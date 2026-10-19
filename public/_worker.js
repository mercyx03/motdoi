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
    const starsRaw = url.searchParams.get('stars') || '', limitRaw = url.searchParams.get('limit') || '20', textOnly = url.searchParams.get('text') === '1';
    if (starsRaw && !/^[1-5]$/.test(starsRaw)) return ratingJson(400, { ok: false, code: 'INVALID_STARS' });
    if (!/^\d{1,3}$/.test(limitRaw) || +limitRaw < 1 || +limitRaw > 100) return ratingJson(400, { ok: false, code: 'INVALID_LIMIT' });
    await initRatings(db);
    const where = [], args = [];
    if (starsRaw) { where.push('stars = ?'); args.push(Number(starsRaw)); }
    if (textOnly) where.push("review_text <> ''");
    const cond = where.length ? ' WHERE ' + where.join(' AND ') : '';
    const rows = await db.batch([
      db.prepare('SELECT stars, COUNT(*) AS count FROM game_reviews GROUP BY stars'),
      db.prepare('SELECT stars, updated_at, review_text FROM game_reviews' + cond + ' ORDER BY updated_at DESC, id DESC LIMIT ? OFFSET ?').bind(...args, Number(limitRaw), Number(raw)),
      db.prepare('SELECT COUNT(*) AS count FROM game_reviews' + cond).bind(...args)
    ]);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }; let total = 0, sum = 0;
    for (const row of rows[0].results) { distribution[row.stars] = row.count; total += row.count; sum += row.stars * row.count; }
    const matched = Number((rows[2].results[0] || {}).count || 0);
    return ratingJson(200, { ok: true, total, matched, average: total ? sum / total : 0, distribution, reviews: rows[1].results.map(x => ({ stars: x.stars, updatedAt: x.updated_at, review: x.review_text || '' })) });
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
  if (data.review != null && typeof data.review !== 'string' || (data.review || '').length > 1000) return ratingJson(400, { ok: false, code: 'INVALID_REVIEW' });
  const review = (data.review || '').trim();
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
  if (rows.length >= PER_DAY) { edited = true; result = await db.prepare('UPDATE game_reviews SET stars = ?, review_text = ?, updated_at = ? WHERE id = ? AND updated_at <= ?').bind(data.stars, review, now, last.id, now - 60000).run(); }
  else result = await db.prepare('INSERT INTO game_reviews(voter_hash, stars, created_at, updated_at, review_text) VALUES (?, ?, ?, ?, ?)').bind(voterHash, data.stars, now, now, review).run();
  if (!result.success) throw Error('database');
  if (!result.meta.changes) return ratingJson(429, { ok: false, code: 'RATE_LIMIT' });
  if (ip) reviewIPs.set(ip, now + 60000);
  return ratingJson(200, { ok: true, edited, left: Math.max(0, PER_DAY - rows.length - (edited ? 0 : 1)) });
}
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let decodedPath;try{decodedPath=decodeURIComponent(url.pathname);}catch{return new Response('Bad request',{status:400});}
    if (['/_worker.js', '/_headers', '/_routes.json', '/.assetsignore'].includes(decodedPath)) return new Response('Not found', { status: 404 });
    if (url.pathname === '/api/feedback') return new Response('Not found', { status: 404 });
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
