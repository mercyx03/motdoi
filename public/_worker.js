const ADMIN_EVENT_CATALOG = /* admin-catalog */ [];
/* Cloudflare Pages advanced mode: chỉ đọc bảng giá công khai; không nhận lệnh giao dịch thật. */
const VN = ['E1VFVN30', 'VCB', 'FPT', 'VNM', 'HPG', 'MWG', 'GAS'];
const US = ['SPY', 'AAPL', 'MSFT', 'NVDA', 'KO', 'TM'];
const GOLD = { SJC: 'SJL1L10', NHAN: 'SJ9999', PNJ: 'PQHN24NTT' };
async function json(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' }, signal: AbortSignal.timeout(7000) });
  if (!r.ok) throw Error('HTTP ' + r.status);
  return r.json();
}
function positive(n) { return Number.isFinite(n) && n > 0; }
const reviewSchemas = new WeakMap();
const reviewIPs = new Map();
function ratingJson(status, body) { return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
async function initRatings(db) {
  if (!reviewSchemas.has(db)) reviewSchemas.set(db, db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS game_ratings (voter_hash TEXT PRIMARY KEY, stars INTEGER NOT NULL CHECK(stars BETWEEN 1 AND 5), updated_at INTEGER NOT NULL, review_text TEXT NOT NULL DEFAULT '')"),
    db.prepare('CREATE INDEX IF NOT EXISTS game_ratings_recent ON game_ratings(updated_at DESC)')
  ]).then(async () => {
    const columns = await db.prepare('PRAGMA table_info(game_ratings)').all();
    if (!columns.results.some(x => x.name === 'review_text')) {
      try { await db.prepare("ALTER TABLE game_ratings ADD COLUMN review_text TEXT NOT NULL DEFAULT ''").run(); }
      catch (e) { const retry = await db.prepare('PRAGMA table_info(game_ratings)').all(); if (!retry.results.some(x => x.name === 'review_text')) throw e; }
    }
    // v6.7: mỗi lần đánh giá là một dòng riêng (trước đây mỗi trình duyệt chỉ giữ một dòng, gửi lại là ghi đè).
    // Chép các đánh giá cũ sang bảng mới; chạy lại nhiều lần cũng không nhân đôi.
    await db.batch([
      db.prepare("CREATE TABLE IF NOT EXISTS game_reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, voter_hash TEXT NOT NULL, stars INTEGER NOT NULL CHECK(stars BETWEEN 1 AND 5), created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, review_text TEXT NOT NULL DEFAULT '')"),
      db.prepare('CREATE INDEX IF NOT EXISTS game_reviews_recent ON game_reviews(updated_at DESC)'),
      db.prepare('CREATE INDEX IF NOT EXISTS game_reviews_voter ON game_reviews(voter_hash, created_at DESC)'),
      db.prepare('INSERT INTO game_reviews(voter_hash, stars, created_at, updated_at, review_text) SELECT r.voter_hash, r.stars, r.updated_at, r.updated_at, r.review_text FROM game_ratings r WHERE NOT EXISTS (SELECT 1 FROM game_reviews g WHERE g.voter_hash = r.voter_hash AND g.created_at = r.updated_at)')
    ]);
  }).catch(e => { reviewSchemas.delete(db); throw e; }));
  await reviewSchemas.get(db);
}
async function reviews(request, env, url) {
  if (!['GET', 'POST'].includes(request.method)) return ratingJson(405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  if (request.method === 'POST' && request.headers.get('Origin') !== url.origin) return ratingJson(403, { ok: false, code: 'ORIGIN' });
  const db = env.REVIEWS_DB;
  if (!db) return ratingJson(503, { ok: false, code: 'REVIEWS_NOT_CONFIGURED' });
  if (request.method === 'GET') {
    const raw = url.searchParams.get('offset') || '0';
    if (!/^\d{1,7}$/.test(raw)) return ratingJson(400, { ok: false, code: 'INVALID_OFFSET' });
    // v6.5.1: lọc theo số sao (?stars=1..5), chỉ review có nội dung (?text=1), số dòng mỗi trang (?limit=1..100)
    const starsRaw = url.searchParams.get('stars') || '', limitRaw = url.searchParams.get('limit') || '20';
    if (starsRaw && !/^[1-5]$/.test(starsRaw)) return ratingJson(400, { ok: false, code: 'INVALID_STARS' });
    if (!/^\d{1,3}$/.test(limitRaw) || +limitRaw < 1 || +limitRaw > 100) return ratingJson(400, { ok: false, code: 'INVALID_LIMIT' });
    await initRatings(db);
    const where = [], args = [];
    if (starsRaw) { where.push('stars = ?'); args.push(Number(starsRaw)); }
    const cond = where.length ? ' WHERE ' + where.join(' AND ') : '';
    const rows = await db.batch([
      db.prepare('SELECT stars, COUNT(*) AS count FROM game_reviews GROUP BY stars'),
      db.prepare('SELECT stars, updated_at FROM game_reviews' + cond + ' ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?').bind(...args, Number(limitRaw), Number(raw)),
      db.prepare('SELECT COUNT(*) AS count FROM game_reviews' + cond).bind(...args)
    ]);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; let total = 0, sum = 0;
    for (const row of rows[0].results) { distribution[row.stars] = row.count; total += row.count; sum += row.stars * row.count; }
    const matched = Number((rows[2].results[0] || {}).count || 0);
    return ratingJson(200, { ok: true, total, matched, average: total ? sum / total : 0, distribution, reviews: rows[1].results.map(x => ({ stars: x.stars, updatedAt: x.updated_at })) });
  }
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return ratingJson(415, { ok: false, code: 'CONTENT_TYPE' });
  let data;
  try {
    const reader = request.body?.getReader(); if (!reader) throw Error();
    const chunks = []; let size = 0;
    while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > 8192) { await reader.cancel(); return ratingJson(413, { ok: false, code: 'BODY_TOO_LARGE' }); } chunks.push(part.value); }
    const buffer = new Uint8Array(size); let at = 0; for (const chunk of chunks) { buffer.set(chunk, at); at += chunk.length; }
    data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(buffer));
  } catch { return ratingJson(400, { ok: false, code: 'INVALID_JSON' }); }
  if (!data || !Number.isInteger(data.stars) || data.stars < 1 || data.stars > 5 || typeof data.voter !== 'string' || !/^[a-f0-9]{64}$/.test(data.voter)) return ratingJson(400, { ok: false, code: 'INVALID_RATING' });

  if (data.stars <= 2) return ratingJson(400, { ok: false, code: 'LOW_STARS_BLOCKED', message: 'Nếu bạn không thích game thì mời bạn đi ra thay vì cố đánh giá dìm hàng công sức của 1 người hết lòng lắng nghe mọi góp ý và điều chỉnh theo ý của bạn.' });
  if (data.review != null && (typeof data.review !== 'string' || data.review.trim())) return ratingJson(400, { ok: false, code: 'COMMENTS_MOVED' });
  const review = '';
  const now = Date.now(), ip = request.headers.get('CF-Connecting-IP');
  for (const [key, until] of reviewIPs) if (until <= now) reviewIPs.delete(key);
  if (ip && (reviewIPs.get(ip) || 0) > now) return ratingJson(429, { ok: false, code: 'RATE_LIMIT' });
  if (ip && reviewIPs.size >= 5000) return ratingJson(503, { ok: false, code: 'BUSY' });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data.voter));
  const voterHash = Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2, '0')).join('');
  await initRatings(db);
  // v6.7: mỗi lần đánh giá là một lượt mới; mỗi trình duyệt tối đa 5 lượt trong 24 giờ, quá 5 lượt thì sửa lượt gần nhất; cách nhau ít nhất 1 phút
  const DAY = 86400000, PER_DAY = 5;
  const recent = await db.prepare('SELECT id, created_at, updated_at FROM game_reviews WHERE voter_hash = ? AND created_at > ? ORDER BY created_at DESC').bind(voterHash, now - DAY).all();
  const rows = recent.results || [], last = rows[0];
  if (last && now - Math.max(last.created_at, last.updated_at) < 60000) return ratingJson(429, { ok: false, code: 'RATE_LIMIT' });
  let result, edited = false;
  if (rows.length >= PER_DAY) { edited = true; result = await db.prepare('UPDATE game_reviews SET stars = ?, updated_at = ? WHERE id = ? AND updated_at <= ?').bind(data.stars, now, last.id, now - 60000).run(); }
  else result = await db.prepare('INSERT INTO game_reviews(voter_hash, stars, created_at, updated_at, review_text) VALUES (?, ?, ?, ?, ?)').bind(voterHash, data.stars, now, now, review).run();
  if (!result.success) throw Error('database');
  if (!result.meta.changes) return ratingJson(429, { ok: false, code: 'RATE_LIMIT' });
  if (ip) reviewIPs.set(ip, now + 60000);
  return ratingJson(200, { ok: true, edited, left: Math.max(0, PER_DAY - rows.length - (edited ? 0 : 1)) });
}
// ===================== v6.9: tài khoản & lưu tiến trình =====================
// Không thu email hay thông tin cá nhân: chỉ tên đăng nhập + mật khẩu (băm PBKDF2-SHA256, 100.000 vòng, salt riêng).
// Phiên đăng nhập: mã ngẫu nhiên 256 bit, máy chủ chỉ lưu SHA-256 của mã; hết hạn sau 180 ngày.
const accountSchemas = new WeakMap(), accountIPs = new Map();
const ACC = { iter: 100000, sessionDays: 180, maxSave: 1500000, maxBody: 1600000 };
function accJson(status, body) { return Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
const hex = buf => Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2, '0')).join('');
async function sha256(text) { return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))); }
async function pbkdf2(password, saltHex) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const salt = new Uint8Array(saltHex.match(/../g).map(h => parseInt(h, 16)));
  return hex(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ACC.iter }, key, 256));
}
function sameHex(a, b) { if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
async function initAccounts(db) {
  if (!accountSchemas.has(db)) accountSchemas.set(db, (async () => {
    // A persistent migration marker avoids DDL and PRAGMA on every cold isolate.
    try { const ready = await db.prepare('SELECT version FROM game_account_schema WHERE version = 2').first(); if (ready) return; }
    catch (e) { if (!/no such table/i.test(String(e.message))) throw e; }
    await db.batch([
      db.prepare("CREATE TABLE IF NOT EXISTS game_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, pass_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at INTEGER NOT NULL, fail_count INTEGER NOT NULL DEFAULT 0, lock_until INTEGER NOT NULL DEFAULT 0, display_name TEXT NOT NULL DEFAULT '')"),
      db.prepare('CREATE TABLE IF NOT EXISTS game_sessions (token_hash TEXT PRIMARY KEY, account_id INTEGER NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER NOT NULL)'),
      db.prepare('CREATE INDEX IF NOT EXISTS game_sessions_account ON game_sessions(account_id)'),
      db.prepare('CREATE TABLE IF NOT EXISTS game_saves (account_id INTEGER PRIMARY KEY, data TEXT NOT NULL, rev INTEGER NOT NULL, updated_at INTEGER NOT NULL)'),
      db.prepare("CREATE TABLE IF NOT EXISTS game_account_roles (account_id INTEGER PRIMARY KEY, role TEXT NOT NULL CHECK(role = 'admin'))"),
      db.prepare('CREATE TABLE IF NOT EXISTS game_update_comments (id INTEGER PRIMARY KEY AUTOINCREMENT, account_id INTEGER NOT NULL, parent_id INTEGER, body TEXT NOT NULL, created_at INTEGER NOT NULL, reply_to_id INTEGER)'),
      db.prepare('CREATE TABLE IF NOT EXISTS game_notification_reads (account_id INTEGER PRIMARY KEY, last_id INTEGER NOT NULL DEFAULT 0)'),
      db.prepare('CREATE TABLE IF NOT EXISTS game_account_schema (version INTEGER PRIMARY KEY)')
    ]);
    const columns = await db.batch([db.prepare('PRAGMA table_info(game_accounts)'),db.prepare('PRAGMA table_info(game_update_comments)')]);
    for (const [i, column, sql] of [[0,'display_name',"ALTER TABLE game_accounts ADD COLUMN display_name TEXT NOT NULL DEFAULT ''"],[1,'reply_to_id','ALTER TABLE game_update_comments ADD COLUMN reply_to_id INTEGER']]) {
      if (!columns[i].results.some(x=>x.name===column)) { try { await db.prepare(sql).run(); } catch(e) { if(!/duplicate column/i.test(String(e.message)))throw e; } }
    }
    await db.batch([
      db.prepare('CREATE INDEX IF NOT EXISTS game_comments_parent ON game_update_comments(parent_id, id DESC)'),
      db.prepare('CREATE INDEX IF NOT EXISTS game_comments_author ON game_update_comments(account_id, created_at DESC)'),
      db.prepare('CREATE INDEX IF NOT EXISTS game_comments_recipient ON game_update_comments(reply_to_id, id)'),
      db.prepare('INSERT OR IGNORE INTO game_account_schema(version) VALUES (2)')
    ]);
  })().catch(e => { accountSchemas.delete(db); throw e; }));
  await accountSchemas.get(db);
}
async function readJsonBody(request, limit) {
  const reader = request.body?.getReader(); if (!reader) throw Error('empty');
  const chunks = []; let size = 0;
  while (true) { const part = await reader.read(); if (part.done) break; size += part.value.length; if (size > limit) { await reader.cancel(); const e = Error('large'); e.large = true; throw e; } chunks.push(part.value); }
  const buffer = new Uint8Array(size); let at = 0; for (const c of chunks) { buffer.set(c, at); at += c.length; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(buffer));
}
async function newSession(db, accountId, now) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  await db.batch([
    db.prepare('DELETE FROM game_sessions WHERE expires_at < ?').bind(now),
    db.prepare('INSERT INTO game_sessions(token_hash, account_id, created_at, expires_at) VALUES (?, ?, ?, ?)').bind(await sha256(token), accountId, now, now + ACC.sessionDays * 86400000)
  ]);
  return token;
}
async function sessionAccount(db, request, now) {
  const m = /^Bearer ([a-f0-9]{64})$/.exec(request.headers.get('Authorization') || ''); if (!m) return null;
  const row = await db.prepare('SELECT s.account_id AS id, a.username AS username, a.display_name AS displayName, s.token_hash AS th, COALESCE(r.role,\'member\') AS role FROM game_sessions s JOIN game_accounts a ON a.id = s.account_id LEFT JOIN game_account_roles r ON r.account_id = a.id WHERE s.token_hash = ? AND s.expires_at > ?').bind(await sha256(m[1]), now).first();
  return row || null;
}
async function account(request, env, url) {
  if (request.method !== 'POST') return accJson(405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  if (request.headers.get('Origin') !== url.origin) return accJson(403, { ok: false, code: 'ORIGIN' });
  if (!(request.headers.get('Content-Type') || '').toLowerCase().startsWith('application/json')) return accJson(415, { ok: false, code: 'CONTENT_TYPE' });
  const db = env.REVIEWS_DB; if (!db) return accJson(503, { ok: false, code: 'ACCOUNTS_NOT_CONFIGURED' });
  let body; try { body = await readJsonBody(request, ACC.maxBody); } catch (e) { return e.large ? accJson(413, { ok: false, code: 'BODY_TOO_LARGE' }) : accJson(400, { ok: false, code: 'INVALID_JSON' }); }
  if (!body || typeof body.action !== 'string') return accJson(400, { ok: false, code: 'INVALID_ACTION' });
  await initAccounts(db);
  const now = Date.now(), ip = request.headers.get('CF-Connecting-IP') || '', action = body.action;
  if (action === 'register' || action === 'login') {
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '', password = typeof body.password === 'string' ? body.password : '';
    if (!/^[a-z0-9_.]{3,24}$/.test(username)) return accJson(400, { ok: false, code: 'INVALID_USERNAME' });
    if (password.length < 8 || password.length > 128) return accJson(400, { ok: false, code: 'INVALID_PASSWORD' });
    // chống dò mật khẩu: tối đa 10 lần đăng nhập / đăng ký mỗi 10 phút trên một IP (bộ nhớ worker) và khóa tài khoản 15 phút sau 8 lần sai
    for (const [k, v] of accountIPs) if (v.until <= now) accountIPs.delete(k);
    if (ip) { const v = accountIPs.get(ip) || { n: 0, until: now + 600000 }; v.n++; accountIPs.set(ip, v); if (v.n > 10) return accJson(429, { ok: false, code: 'RATE_LIMIT' }); }
    if (action === 'register') {
      const displayName = cleanDisplayName(body.displayName);
      if (!displayName) return accJson(400, { ok: false, code: 'INVALID_DISPLAY_NAME' });
      const exists = await db.prepare('SELECT id FROM game_accounts WHERE username = ?').bind(username).first();
      if (exists) return accJson(409, { ok: false, code: 'USERNAME_TAKEN' });
      const salt = hex(crypto.getRandomValues(new Uint8Array(16))), hash = await pbkdf2(password, salt);
      let res; try { res = await db.prepare('INSERT INTO game_accounts(username, pass_hash, salt, created_at, display_name) VALUES (?, ?, ?, ?, ?)').bind(username, hash, salt, now, displayName).run(); } catch (e) { return accJson(409, { ok: false, code: 'USERNAME_TAKEN' }); }
      const row = await db.prepare('SELECT id FROM game_accounts WHERE username = ?').bind(username).first();
      return accJson(200, { ok: true, username, displayName, role: 'member', token: await newSession(db, row.id, now) });
    }
    const acc = await db.prepare('SELECT id, pass_hash, salt, display_name, fail_count, lock_until FROM game_accounts WHERE username = ?').bind(username).first();
    if (acc && acc.lock_until > now) return accJson(429, { ok: false, code: 'LOCKED' });
    const hash = await pbkdf2(password, acc ? acc.salt : '00'.repeat(16));
    if (!acc || !sameHex(hash, acc.pass_hash)) {
      if (acc) await db.prepare('UPDATE game_accounts SET fail_count = fail_count + 1, lock_until = CASE WHEN fail_count + 1 >= 8 THEN ? ELSE lock_until END WHERE id = ?').bind(now + 900000, acc.id).run();
      return accJson(401, { ok: false, code: 'WRONG_LOGIN' });
    }
    await db.prepare('UPDATE game_accounts SET fail_count = 0, lock_until = 0 WHERE id = ?').bind(acc.id).run();
    return accJson(200, { ok: true, username, displayName: acc.display_name, role: await accountRole(db, acc.id), token: await newSession(db, acc.id, now) });
  }
  const me = await sessionAccount(db, request, now);
  if (!me) return accJson(401, { ok: false, code: 'NOT_LOGGED_IN' });
  if (action === 'notifications' || action === 'notifications_read') {
    const admin = me.role === 'admin';
    // Separate indexed recipient branches; no OR over every author's comments.
    const visible = admin ? 'SELECT c.id FROM game_update_comments c WHERE c.account_id != ?' : 'SELECT c.id FROM game_update_comments p JOIN game_update_comments c ON c.reply_to_id = p.id WHERE p.account_id = ? AND c.account_id != ? UNION SELECT c.id FROM game_update_comments p JOIN game_update_comments c ON c.parent_id = p.id WHERE p.account_id = ? AND c.reply_to_id IS NULL AND c.account_id != ?';
    const args = admin ? [me.id] : [me.id,me.id,me.id,me.id];
    const cte = 'WITH visible AS ('+visible+') ';
    if(action === 'notifications_read') {
      const id = body.lastId;
      if(!Number.isSafeInteger(id)||id<0)return accJson(400,{ok:false,code:'INVALID_CURSOR'});
      const result = await db.prepare(cte+'INSERT INTO game_notification_reads(account_id,last_id) SELECT ?, ? WHERE ? <= (SELECT COALESCE(MAX(id),0) FROM visible) ON CONFLICT(account_id) DO UPDATE SET last_id = MAX(last_id,excluded.last_id)').bind(...args,me.id,id,id).run();
      if(!result.meta.changes)return accJson(400,{ok:false,code:'INVALID_CURSOR'});
      return accJson(200,{ok:true});
    }
    const result = await db.batch([
      db.prepare(cte+'SELECT COALESCE(MAX(id),0) AS lastId, COUNT(CASE WHEN id > COALESCE((SELECT last_id FROM game_notification_reads WHERE account_id = ?),0) THEN 1 END) AS count FROM visible').bind(...args,me.id),
      db.prepare(cte+"SELECT c.id, COALESCE(c.parent_id,c.id) AS threadId, SUBSTR(c.body,1,140) AS body, c.created_at AS createdAt, COALESCE(NULLIF(a.display_name,''),'Người chơi') AS displayName FROM game_update_comments c LEFT JOIN game_accounts a ON a.id = c.account_id WHERE c.id IN (SELECT id FROM visible ORDER BY id DESC LIMIT 30) ORDER BY c.id DESC").bind(...args)
    ]);
    return accJson(200,{ok:true,...result[0].results[0],items:result[1].results});
  }
  if (action === 'admin_events') { if(me.role!=='admin')return accJson(403,{ok:false,code:'FORBIDDEN'}); return accJson(200,{ok:true,entries:ADMIN_EVENT_CATALOG}); }
  if (action === 'me') return accJson(200, { ok: true, username: me.username, displayName: me.displayName, role: me.role });
  if (action === 'profile') { const name = cleanDisplayName(body.displayName); if (!name) return accJson(400, { ok: false, code: 'INVALID_DISPLAY_NAME' }); await db.prepare('UPDATE game_accounts SET display_name = ? WHERE id = ?').bind(name, me.id).run(); return accJson(200, { ok: true, username: me.username, displayName: name, role: me.role }); }
  if (action === 'logout') { await db.prepare('DELETE FROM game_sessions WHERE token_hash = ?').bind(me.th).run(); return accJson(200, { ok: true }); }
  if (action === 'load') { const s = await db.prepare('SELECT data, rev, updated_at FROM game_saves WHERE account_id = ?').bind(me.id).first(); return accJson(200, { ok: true, username: me.username, rev: s ? s.rev : 0, updatedAt: s ? s.updated_at : 0, data: s ? JSON.parse(s.data) : null }); }
  if (action === 'save') {
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) return accJson(400, { ok: false, code: 'INVALID_SAVE' });
    const text = JSON.stringify(body.data); if (text.length > ACC.maxSave) return accJson(413, { ok: false, code: 'SAVE_TOO_LARGE' });
    const base = Number.isInteger(body.rev) ? body.rev : -1;
    const cur = await db.prepare('SELECT rev FROM game_saves WHERE account_id = ?').bind(me.id).first();
    if ((cur ? cur.rev : 0) !== base) return accJson(409, { ok: false, code: 'CONFLICT', rev: cur ? cur.rev : 0 });
    const rev = base + 1;
    const r = cur ? await db.prepare('UPDATE game_saves SET data = ?, rev = ?, updated_at = ? WHERE account_id = ? AND rev = ?').bind(text, rev, now, me.id, base).run()
      : await db.prepare('INSERT OR IGNORE INTO game_saves(account_id, data, rev, updated_at) VALUES (?, ?, ?, ?)').bind(me.id, text, rev, now).run();
    if (!r.meta.changes) return accJson(409, { ok: false, code: 'CONFLICT' });
    return accJson(200, { ok: true, rev, updatedAt: now });
  }
  if (action === 'delete') {
    const acc = await db.prepare('SELECT pass_hash, salt FROM game_accounts WHERE id = ?').bind(me.id).first();
    const password = typeof body.password === 'string' ? body.password : '';
    if (!acc || !sameHex(await pbkdf2(password, acc.salt), acc.pass_hash)) return accJson(401, { ok: false, code: 'WRONG_LOGIN' });
    await db.batch([db.prepare('DELETE FROM game_saves WHERE account_id = ?').bind(me.id), db.prepare('DELETE FROM game_sessions WHERE account_id = ?').bind(me.id), db.prepare('DELETE FROM game_account_roles WHERE account_id = ?').bind(me.id), db.prepare('DELETE FROM game_accounts WHERE id = ?').bind(me.id)]);
    return accJson(200, { ok: true });
  }
  return accJson(400, { ok: false, code: 'INVALID_ACTION' });
}

// Community identity is server-owned. No username/password or admin role from a
// client request can grant privilege; only a private D1 role record can do so.
function cleanDisplayName(value) {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFC').trim().replace(/\s+/g, ' ');
  return /^[\p{L}\p{N}\p{M} ._'’-]{2,32}$/u.test(name) && !/^(admin|administrator|quản trị viên)$/iu.test(name) ? name : null;
}
async function accountRole(db, id) { const row = await db.prepare("SELECT role FROM game_account_roles WHERE account_id = ?").bind(id).first(); return row && row.role === 'admin' ? 'admin' : 'member'; }
const PINNED_COMMENT_ID = "(SELECT MIN(pc.id) FROM game_update_comments pc JOIN game_account_roles pr ON pr.account_id = pc.account_id AND pr.role = 'admin' WHERE pc.parent_id IS NULL)";
const COMMENT_SELECT = "SELECT CASE WHEN c.id = "+PINNED_COMMENT_ID+" THEN 1 ELSE 0 END AS pinned, c.id, c.parent_id AS parentId, c.body, c.created_at AS createdAt, COALESCE(NULLIF(a.display_name, ''), 'Người chơi đã rời đi') AS displayName, CASE WHEN a.id IS NOT NULL AND r.role = 'admin' THEN 'admin' ELSE 'member' END AS role FROM game_update_comments c LEFT JOIN game_accounts a ON a.id = c.account_id LEFT JOIN game_account_roles r ON r.account_id = a.id";
async function comments(request, env, url) {
  if (!['GET','POST'].includes(request.method)) return accJson(405,{ok:false,code:'METHOD_NOT_ALLOWED'});
  const db=env.REVIEWS_DB;if(!db)return accJson(503,{ok:false,code:'COMMENTS_NOT_CONFIGURED'});
  await initAccounts(db);
  if(request.method==='GET') {
    const raw=url.searchParams.get('offset')||'0',thread=url.searchParams.get('thread')||'';
    if(!/^\d{1,7}$/.test(raw)||thread&&!/^[1-9]\d{0,12}$/.test(thread))return accJson(400,{ok:false,code:'INVALID_PAGE'});
    if(thread) {
      const result=await db.batch([
        db.prepare(COMMENT_SELECT+' WHERE c.id = ? AND c.parent_id IS NULL').bind(Number(thread)),
        db.prepare(COMMENT_SELECT+' WHERE c.parent_id = ? ORDER BY c.id ASC LIMIT 20 OFFSET ?').bind(Number(thread),Number(raw)),
        db.prepare('SELECT COUNT(*) AS count FROM game_update_comments WHERE parent_id = ?').bind(Number(thread))
      ]);
      if(!result[0].results.length)return accJson(404,{ok:false,code:'THREAD_NOT_FOUND'});
      return accJson(200,{ok:true,root:result[0].results[0],replies:result[1].results,total:result[2].results[0].count});
    }
    const page = 'SELECT id FROM game_update_comments WHERE parent_id IS NULL ORDER BY (id = '+PINNED_COMMENT_ID+') DESC, id DESC LIMIT 10 OFFSET ?';
    const result=await db.batch([
      db.prepare(COMMENT_SELECT.replace('SELECT CASE','SELECT (SELECT COUNT(*) FROM game_update_comments replies WHERE replies.parent_id = c.id) AS replyCount, CASE')+' WHERE c.id IN ('+page+') ORDER BY pinned DESC, c.id DESC').bind(Number(raw)),
      db.prepare('SELECT COUNT(*) AS count FROM game_update_comments WHERE parent_id IS NULL'),
      db.prepare(COMMENT_SELECT+' WHERE c.id IN (SELECT id FROM (SELECT id, ROW_NUMBER() OVER (PARTITION BY parent_id ORDER BY id ASC) AS pos FROM game_update_comments WHERE parent_id IN ('+page+')) WHERE pos <= '+(url.searchParams.get('preview')==='1'?3:20)+') ORDER BY c.id ASC').bind(Number(raw))
    ]);
    const grouped=new Map();for(const reply of result[2].results){if(!grouped.has(reply.parentId))grouped.set(reply.parentId,[]);grouped.get(reply.parentId).push(reply);}
    return accJson(200,{ok:true,total:result[1].results[0].count,comments:result[0].results.map(root=>({...root,replies:grouped.get(root.id)||[]}))});
  }
  if(request.headers.get('Origin')!==url.origin)return accJson(403,{ok:false,code:'ORIGIN'});
  if(!(request.headers.get('Content-Type')||'').toLowerCase().startsWith('application/json'))return accJson(415,{ok:false,code:'CONTENT_TYPE'});
  const me=await sessionAccount(db,request,Date.now());if(!me)return accJson(401,{ok:false,code:'NOT_LOGGED_IN'});
  if(!cleanDisplayName(me.displayName))return accJson(403,{ok:false,code:'DISPLAY_NAME_REQUIRED'});
  let body;try{body=await readJsonBody(request,8192);}catch(e){return accJson(e.large?413:400,{ok:false,code:e.large?'BODY_TOO_LARGE':'INVALID_JSON'});}
  if(!body||typeof body.body!=='string')return accJson(400,{ok:false,code:'INVALID_COMMENT'});
  const text=body.body.normalize('NFC').trim();if(!text||text.length>1500||/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text))return accJson(400,{ok:false,code:'INVALID_COMMENT'});
  const parent=body.parentId==null?null:body.parentId;if(parent!==null&&(!Number.isSafeInteger(parent)||parent<1))return accJson(400,{ok:false,code:'INVALID_PARENT'});
  if(parent!==null&&!await db.prepare('SELECT id FROM game_update_comments WHERE id = ? AND parent_id IS NULL').bind(parent).first())return accJson(404,{ok:false,code:'THREAD_NOT_FOUND'});
  const replyTo=body.replyToId==null?parent:Number(body.replyToId);
  if(replyTo!==null&&(!Number.isSafeInteger(replyTo)||!parent||!await db.prepare('SELECT id FROM game_update_comments WHERE id = ? AND (id = ? OR parent_id = ?)').bind(replyTo,parent,parent).first()))return accJson(400,{ok:false,code:'INVALID_REPLY_TARGET'});
  const now=Date.now(),result=await db.prepare('INSERT INTO game_update_comments(account_id, parent_id, body, created_at, reply_to_id) SELECT ?, ?, ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM game_update_comments WHERE account_id = ? AND created_at > ?)').bind(me.id,parent,text,now,replyTo,me.id,now-15000).run();
  if(!result.meta.changes)return accJson(429,{ok:false,code:'RATE_LIMIT'});
  return accJson(201,{ok:true});
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let decodedPath;try{decodedPath=decodeURIComponent(url.pathname);}catch{return new Response('Bad request',{status:400});}
    if (['/_worker.js', '/_headers', '/_routes.json', '/.assetsignore'].includes(decodedPath)) return new Response('Not found', { status: 404 });
    if (url.pathname === '/api/feedback') return new Response('Not found', { status: 404 });
    if (url.pathname === '/api/comments') { try { return await comments(request, env, url); } catch { return accJson(503, { ok: false, code: 'COMMENTS_UNAVAILABLE' }); } }
    if (url.pathname === '/api/account') { try { return await account(request, env, url); } catch { return accJson(503, { ok: false, code: 'ACCOUNTS_UNAVAILABLE' }); } }
    if (url.pathname === '/api/reviews') { try { return await reviews(request, env, url); } catch { return ratingJson(503, { ok: false, code: 'REVIEWS_UNAVAILABLE' }); } }
    if (url.pathname !== '/api/market') return env.ASSETS.fetch(request);
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET' } });
    // Không chuyển URL người dùng sang upstream; query string không làm bỏ qua cache.
    const cacheKey = new Request(url.origin + '/api/market');
    const cache = typeof caches !== 'undefined' ? caches.default : null;
    if (cache) { const hit = await cache.match(cacheKey); if (hit) return hit; }
    const seed = await env.ASSETS.fetch(new Request(url.origin + '/data/market-prices.json'));
    if (!seed.ok) return new Response('Market seed unavailable', { status: 503 });
    const data = await seed.json(); data.errors = []; data.fetchedAt = new Date().toISOString();
    const jobs = VN.map(symbol => async () => {
      const body = await json('https://api-finfo.vndirect.com.vn/v4/stock_prices?sort=date:desc&q=code:' + symbol + '&size=1');
      const p = body.data && body.data[0];
      if (!p || p.code !== symbol || !positive(p.close) || !/^\d{4}-\d{2}-\d{2}$/.test(p.date)) throw Error(symbol);
      const asOf = p.date + 'T' + (/^\d{2}:\d{2}:\d{2}$/.test(p.time) ? p.time : '15:00:00') + '+07:00';
      if (!Number.isFinite(Date.parse(asOf))) throw Error('Date ' + symbol);
      data.quotes[symbol] = { ...data.quotes[symbol], bid: p.close * 1000, ask: p.close * 1000, asOf };
    });
    US.forEach(symbol => jobs.push(async () => {
      const body = await json('https://query1.finance.yahoo.com/v8/finance/chart/' + symbol + '?interval=1d&range=5d');
      const p = body.chart && body.chart.result && body.chart.result[0] && body.chart.result[0].meta;
      if (!p || p.symbol !== symbol || p.currency !== 'USD' || !positive(p.regularMarketPrice) || !positive(p.regularMarketTime)) throw Error(symbol);
      data.quotes[symbol] = { ...data.quotes[symbol], bid: p.regularMarketPrice, ask: p.regularMarketPrice, asOf: new Date(p.regularMarketTime * 1000).toISOString() };
    }));
    jobs.push(async () => {
      const body = await json('https://www.vang.today/api/prices');
      if (!body.success || !positive(body.timestamp)) throw Error('Gold timestamp');
      const parsed = {};
      for (const [symbol, code] of Object.entries(GOLD)) {
        const p = body.prices && body.prices[code];
        if (!p || !positive(p.buy) || !positive(p.sell) || p.sell < p.buy || p.currency !== 'VND') throw Error('Gold ' + code);
        parsed[symbol] = { ...data.quotes[symbol], bid: p.buy / 10, ask: p.sell / 10, asOf: new Date(body.timestamp * 1000).toISOString() };
      }
      Object.assign(data.quotes, parsed);
    });
    jobs.push(async () => {
      const p = await json('https://open.er-api.com/v6/latest/USD');
      if (p.result !== 'success' || !p.rates || !positive(p.rates.VND) || !positive(p.time_last_update_unix)) throw Error('FX');
      data.fx = { ...data.fx, usdVnd: p.rates.VND, asOf: new Date(p.time_last_update_unix * 1000).toISOString() };
    });
    const results = await Promise.allSettled(jobs.map(job => job()));
    results.forEach((r, i) => { if (r.status === 'rejected') data.errors.push('Nguồn ' + (i + 1) + ' chưa cập nhật được; giữ bảng giá có thời điểm cũ.'); });
    // Không để bản upstream cũ hơn thay bảng đã phát hành trong seed.
    const original = await (await env.ASSETS.fetch(new Request(url.origin + '/data/market-prices.json'))).json();
    for (const symbol of Object.keys(data.quotes)) if (Date.parse(data.quotes[symbol].asOf) < Date.parse(original.quotes[symbol].asOf)) data.quotes[symbol] = original.quotes[symbol];
    if (Date.parse(data.fx.asOf) < Date.parse(original.fx.asOf)) data.fx = original.fx;
    const response = Response.json(data, { headers: { 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' } });
    if (cache && ctx) ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }
};
