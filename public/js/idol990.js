/* Một Đời — 9.9.0 (phần lõi): hình ảnh công chúng, giải thưởng trong nước và quốc tế, hợp đồng nhóm, thành viên và sự cố trong nhóm,
   mức độ lan tỏa của sản phẩm. Mở rộng IDOL155 (nhóm), IDOL987 (vị trí, quảng cáo, album solo), life139 (công ty), không tạo hệ thống song song.
   · Hình ảnh công chúng (thiện cảm, chuyên nghiệp, niềm tin của người hâm mộ, tai tiếng) được ghi nhớ và ảnh hưởng quảng cáo, giải thưởng, concert.
   · Giải thưởng: bộ giải theo nước và theo năm (data-idol990.js), cả quá khứ, đến 2025 và các năm sau; giải lớn cần sản phẩm trong năm.
   · Hợp đồng nhóm có kỳ hạn (≈7 năm với Hàn, Mỹ, Anh…); hết hạn chọn tái ký, ra solo, tự do hay giải nghệ; các thành viên khác cũng tự quyết.
   · Mỗi thành viên có tính cách, mong muốn, độ thân thiết; sự cố (mâu thuẫn, yêu nhau trong nhóm, yêu người hâm mộ, ốm/kiệt sức) kéo nhiều năm,
     trưởng nhóm phải xử lý, không xử lý thì leo thang. Tính cách gán ngẫu nhiên đều, không gắn với giàu nghèo, tôn giáo, nghề hay ngoại hình.
   Tên giải, nhóm, nhân vật và số liệu là mô phỏng. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H, U = G.U, X = E && E.UPDATE110, SH = E && E.SHOW151, L = E && E.LIFE138, I = E && E.IDOL155, D = E && E.IDOL990D, P = E && E.IDOL987;
  if (!E || !X || !SH || !L || !I || !D || !P) return;
  var seeded = SH.seeded, hash = SH.hash, V = SH.V;
  function yr(l) { return l.birthYear + l.age; }
  function mo(l, v) { return H.money(l, v); }
  function lv(l, k) { return L.skill(l, k).level || 0; }
  function idol(l) { return l.flags.idol155 || null; }
  function grp(l) { var s = idol(l), g = s && s.group; return g && !g.disbanded && s.stage === 'debut' ? g : null; }
  function agency(l) { return L.state(l).agency; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.abroad && l.abroad.trapped) && !(l.flags.military && l.age < l.flags.military); }
  function st(l) {
    var s = l.flags.idol990; if (!s || typeof s !== 'object') s = l.flags.idol990 = { v: 1 };
    s.awards = s.awards || []; s.noms = s.noms || []; s.hits = s.hits || []; s.issues = s.issues || []; s.cons = s.cons || []; s.first = s.first || {}; s.intl = s.intl || 0; s.hist = s.hist || [];
    s.img = s.img || { warm: 50, pro: 50, trust: 60, scandal: 0 }; return s;
  }
  function peek(l) { return l.flags.idol990 || {}; }
  function code(l) { var a = agency(l), g = grp(l); return (g && a && a.code) || H.resCode(l); }
  function ind(l) { return D.industry(code(l)); }
  function fans(l) { var g = grp(l); return g ? (g.fandom || 0) : Math.max(0, (l.fame || 0) / 12); }
  function jobSinger(l) { return !!(l.job && E.resolveJob && /^ca_si$/.test(E.resolveJob(l.job.id))); }
  function performer(l) { var p = l.flags.idol987; return !!(grp(l) || jobSinger(l) || p && (p.albums || []).length); }
  function pop(l) { return P.popularity(l); }
  function note(l, t) { var s = st(l); s.hist.push({ y: yr(l), t: t }); if (s.hist.length > 40) s.hist.shift(); }
  // ------------------------------------------------------------------ hình ảnh công chúng
  function img(l) { return st(l).img; }
  function fxImg(l, d, why) {
    var m = img(l); ['warm', 'pro', 'trust', 'scandal'].forEach(function (k) { if (d[k]) m[k] = Math.round(U.clamp(m[k] + d[k], 0, 100)); });
    var s = st(l); if (why) { s.imgLog = s.imgLog || []; s.imgLog.push({ y: yr(l), t: why }); if (s.imgLog.length > 12) s.imgLog.shift(); }
  }
  function fameMul(l, f) { if (!f) return; l.fame = Math.max(0, Math.round((l.fame || 0) * (1 + f))); var g = grp(l); if (g && f) g.fandom = Math.max(0, Math.round((g.fandom || 0) * (1 + f * 0.8))); }
  function imgYear(l) { var m = img(l); m.scandal = Math.max(0, m.scandal - 12); m.warm += m.warm > 50 ? -1 : m.warm < 50 ? 1 : 0; m.trust += m.scandal < 20 ? 1 : 0; }
  // ------------------------------------------------------------------ sản phẩm trong năm
  function release(l) {
    var g = grp(l), a = g && (g.albums || [])[(g.albums || []).length - 1], p = l.flags.idol987 && l.flags.idol987.lastRelease;
    if (p && p.age === l.age) return { q: p.q, kind: p.kind || 'solo' };
    if (a && a.age === l.age) return { q: a.q, kind: 'group' };
    return null;
  }
  function skillTop(l) { return Math.max(lv(l, 'sing'), lv(l, 'rap'), lv(l, 'dance')); }
  // ------------------------------------------------------------------ giải thưởng
  function formOf(l, rel, rr) { var m = img(l); return U.clamp(0.35 * pop(l) / 100 + 0.35 * (rel ? rel.q : 0.25) + 0.15 * skillTop(l) / 100 + 0.15 * rr() + (m.warm - 50) / 400 - m.scandal / 400, 0, 1.3); }
  function rollAward(l, rr, a, F, rel, yrsIn, intl) {
    var p = 0, sk = skillTop(l), pp = pop(l), fn = fans(l), cats = [], s = st(l);
    var mult = intl ? 0.6 + Math.min(0.5, s.intl * 0.12) : 1;
    if (a.tier === 'grand') { if (!rel || pp < (intl ? 70 : 55)) return null; p = U.clamp((F - (intl ? 0.85 : 0.78)) * 1.3, 0, 0.55) * mult; }
    else if (a.tier === 'main') { if (pp < 35 || (!rel && F < 0.55)) return null; p = U.clamp((F - (intl ? 0.62 : 0.45)) * 0.95, 0, 0.8) * mult; }
    else if (a.tier === 'popular') { if (fn < 2e4) return null; p = U.clamp((Math.log10(fn) - 4) / 2.2, 0, 0.7) * 0.8 * mult; }
    else if (a.tier === 'critic') { if (!rel || rel.q < 0.62) return null; p = U.clamp((rel.q - 0.6) * 0.9 + (sk - 60) / 300, 0, 0.45) * mult; }
    else if (a.tier === 'honor') { if (a.need === 'veteran') { if (yrsIn < 25 || pp < 60) return null; p = 0.12; } else { if (pp < 55) return null; p = 0.45; } }
    var out = { cats: [], nom: false, rookie: false };
    var cats0 = a.tier === 'grand' ? (a.cat || ['Giải thưởng lớn']) : null;
    if (cats0) cats0.forEach(function (c, i) { if (rr() < p / (1 + i * 0.35)) out.cats.push(c); });
    else if (rr() < p) out.cats.push(a.tier === 'honor' ? '' : a.tier === 'grand' ? 'Giải thưởng lớn' : a.tier === 'main' ? 'Giải chính' : a.tier === 'popular' ? 'Giải bình chọn' : 'Giải chuyên môn');
    if ((a.tier === 'grand' || a.tier === 'main') && yrsIn <= 1 && pp >= 30 && rr() < U.clamp(0.25 + F * 0.5, 0, 0.7)) { out.rookie = true; }
    if (!out.cats.length && !out.rookie && rr() < Math.min(0.8, p * 2 + 0.08) && F > 0.4) out.nom = true;
    return out.cats.length || out.rookie || out.nom ? out : null;
  }
  function awardsYear(l, rr, log) {
    var s = st(l), y = yr(l); if (s.awYear === l.age || !performer(l) || !free(l)) return null; s.awYear = l.age;
    if (s.since == null) s.since = y; var yrsIn = y - s.since;
    var rel = release(l), F = formOf(l, rel, rr), c = code(l), wins = [], noms = [], grand = 0, intlWin = 0;
    var dom = D.awards(c, y, 'dom'), names = {}; dom.forEach(function (a) { names[D.nameOf(a, y)] = 1; });
    var intl = (s.intl > 0 || c === 'US' || c === 'GB') ? D.awards(c, y, 'intl').filter(function (a) { return (fans(l) >= a.min || (l.fame || 0) >= a.min) && !names[D.nameOf(a, y)] && !(c === 'KR' && a.id === 'i_mama'); }) : [];
    function put(a, intlFlag) {
      var r = rollAward(l, rr, a, F, rel, yrsIn, intlFlag); if (!r) return; var nm = D.nameOf(a, y);
      r.cats.forEach(function (cat) { s.awards.push({ y: y, id: a.id, n: nm, tier: a.tier, cat: cat, intl: !!intlFlag }); wins.push(nm + (cat ? ' – ' + cat : '')); if (a.tier === 'grand' && cat) { grand++; } if (intlFlag) intlWin++; });
      if (r.rookie) { s.awards.push({ y: y, id: a.id, n: nm, tier: 'rookie', cat: 'Tân binh', intl: !!intlFlag }); wins.push(nm + ' – Tân binh'); }
      if (r.nom) { s.noms.push({ y: y, id: a.id, n: nm }); noms.push(nm); }
    }
    dom.forEach(function (a) { put(a, false); }); intl.forEach(function (a) { put(a, true); });
    if (!wins.length && !noms.length) return null;
    if (wins.length) { var gain = wins.length * 0.015 + grand * 0.04; fameMul(l, gain); fxImg(l, { warm: 2, pro: 2, trust: 1 }); H.fx(l, { hap: Math.min(10, 3 + wins.length * 2 + grand * 3) }); if (l.flags.idol987) l.flags.idol987.pop = Math.min(100, (l.flags.idol987.pop || pop(l)) + Math.min(8, wins.length + grand * 2)); }
    var txt = (wins.length ? 'Mùa trao giải ' + y + ': bạn nhận ' + wins.slice(0, 5).join('; ') + (wins.length > 5 ? ' và ' + (wins.length - 5) + ' giải khác' : '') + '.' : '') + (noms.length ? (wins.length ? ' ' : 'Mùa trao giải ' + y + ': ') + 'Bạn có tên trong đề cử của ' + noms.slice(0, 4).join(', ') + ' nhưng chưa nhận giải.' : '');
    log(txt + (s.awards.length && grand && !s.first.grand ? ' Đây là giải thưởng lớn đầu tiên trong sự nghiệp của bạn.' : ''), grand || intlWin ? 'big' : wins.length ? 'good' : 'neutral');
    if (grand && !s.first.grand) { s.first.grand = y; H.mem(l, 'Đêm đầu tiên được gọi tên cho giải thưởng lớn.', 7); }
    if (intlWin && !s.first.intl) { s.first.intl = y; H.mem(l, 'Lần đầu nhận giải quốc tế.', 6); }
    s.lastGrand = grand; if (grand >= 3) s.first.triple = y;
    return { wins: wins, noms: noms, grand: grand, intl: intlWin };
  }
  // ------------------------------------------------------------------ thành viên nhóm
  var TRAITS = ['chăm chỉ', 'thẳng tính', 'nhạy cảm', 'điềm tĩnh', 'hài hước', 'cầu toàn', 'hướng nội', 'hòa đồng'];
  var WANTS = ['vị trí trung tâm', 'ra solo', 'ở lại lâu dài với nhóm', 'nổi tiếng nhanh', 'có thời gian cho gia đình', 'thử nghiệm âm nhạc'];
  function mems(l, g) {
    g.mem990 = g.mem990 || []; (g.members || []).forEach(function (n) {
      if (g.mem990.some(function (m) { return m.n === n; })) return; var h = hash(l.id + ':' + g.name + ':m990:' + n);
      g.mem990.push({ n: n, trait: TRAITS[h % TRAITS.length], want: WANTS[(h >>> 4) % WANTS.length], age: l.age + ((h >>> 8) % 7) - 3, bond: 40 + (h >>> 12) % 30, mood: 55 + (h >>> 16) % 30, health: 'ok', left: 0, hist: [] });
    });
    return g.mem990.filter(function (m) { return !m.left; });
  }
  function member(l, g, n) { return mems(l, g).filter(function (m) { return m.n === n; })[0] || null; }
  function isLeader(l) { var g = grp(l); return !!(g && (g.position === 'leader' || (g.extra987 || []).indexOf('leader') >= 0)); }
  function leaderNpc(l, g) { var ms = mems(l, g); if (!ms.length) return null; var best = null; ms.forEach(function (m) { var v = (hash(l.id + ':ld:' + m.n) % 100) + m.bond * 0.1; if (!best || v > best.v) best = { m: m, v: v }; }); return best.m; }
  // ------------------------------------------------------------------ hợp đồng nhóm
  function contract(l) {
    var g = grp(l); if (!g || g.project) return null;
    if (!g.contract990) { var len = ind(l).contract, base = g.debutAge + len; g.contract990 = { from: g.debutAge, len: len, until: Math.max(base, l.age + (base <= l.age ? 2 : 0)), renewals: 0, grace: base <= l.age ? 1 : 0 }; }
    return g.contract990;
  }
  function renewChance(l, g, m) { var c = 0.58 + (m.bond - 50) * 0.003 + (m.mood - 55) * 0.003; if (/ở lại lâu dài/.test(m.want)) c += 0.2; if (/ra solo/.test(m.want)) c -= 0.32; if (/thời gian cho gia đình/.test(m.want)) c -= 0.2; if (/nổi tiếng nhanh/.test(m.want)) c -= 0.08; if (m.health !== 'ok') c -= 0.15; return U.clamp(c, 0.08, 0.95); }
  function others(l, g, rr, log) {
    var kept = [], went = [];
    mems(l, g).forEach(function (m) { if (rr() < renewChance(l, g, m)) kept.push(m.n); else { m.left = l.age; went.push(m.n); g.members = (g.members || []).filter(function (n) { return n !== m.n; }); (g.ex990 = g.ex990 || []).push({ n: m.n, age: l.age, why: m.want }); } });
    return { kept: kept, went: went };
  }
  function leaveGroup(l, how, log) {
    var s = idol(l), g = s.group, a = agency(l); s.exGroup990 = { name: g.name, from: g.debutAge, to: l.age, fandom: g.fandom, wins: g.wins, albums: (g.albums || []).length, how: how };
    g.ex990 = (g.ex990 || []).concat([{ n: '(bạn)', age: l.age, why: how }]); s.group = null;
    if (how !== 'company') { if (a) a.status = 'left'; s.stage = 'left'; }
    note(l, 'Rời nhóm ' + g.name + ' (' + how + ')');
  }
  function doContract(l, r, log, k, rng) {
    var g = grp(l), c = contract(l); if (!g || !c) return; var rr = rng || seeded(l.id + ':contract990:' + l.age), s = st(l), a = agency(l), sc = idol(l).company;
    var oth = others(l, g, rr, log), left = oth.kept.length;
    var names = oth.went.length ? 'Các thành viên ' + oth.went.join(', ') + ' không tái ký' : 'Tất cả thành viên khác đều ở lại';
    c.asked = l.age;
    if (k === 'renew' || k === 'bargain') {
      var ok = true, up = 0; if (k === 'bargain') { var pw = pop(l) / 100 + (img(l).trust - 50) / 200 + (rr() - 0.5) * 0.3; if (pw >= 0.55) { up = 0.05 + (pw - 0.55) * 0.2; } else if (pw < 0.3) ok = false; }
      if (!ok) { log('Công ty không chấp nhận điều kiện bạn đưa ra và rút đề nghị tái ký. Hợp đồng kết thúc, nhóm không còn bạn.', 'bad'); leaveGroup(l, 'tái ký thất bại', log); fxImg(l, { trust: -3 }); return; }
      var len = Math.max(3, Math.round(ind(l).contract * 0.6)); c.renewals++; c.until = l.age + len; c.len = len; if (sc) sc.split = Math.min(0.6, (sc.split || 0.25) + 0.03 + up);
      if (left < 1) { log(names + '; chỉ còn mình bạn nên nhóm ' + g.name + ' tan rã. Bạn tái ký với công ty và tiếp tục hoạt động cá nhân.', 'big'); g.disbanded = true; idol(l).exGroup990 = { name: g.name, from: g.debutAge, to: l.age, fandom: g.fandom, wins: g.wins, albums: (g.albums || []).length, how: 'tan rã' }; }
      else log('Bạn tái ký ' + len + ' năm cùng ' + g.name + (k === 'bargain' && up > 0 ? ' với phần chia tốt hơn' : '') + '. ' + names + '.', 'good');
      s.first.renew = s.first.renew || yr(l); note(l, 'Tái ký ' + len + ' năm'); fxImg(l, { pro: 2 });
    } else if (k === 'soloCo') { leaveGroup(l, 'company', log); log('Bạn ra solo nhưng ở lại công ty: ký hợp đồng cá nhân. ' + names + '. Nhóm ' + g.name + ' tiếp tục với các thành viên còn lại hoặc tan rã tùy họ.', 'big'); g.fandom = Math.round((g.fandom || 0) * 0.85); if (a) a.splitSolo990 = true; }
    else if (k === 'soloFree') {
      leaveGroup(l, 'tự do', log); var keep = U.clamp(0.4 + pop(l) / 200 + (img(l).trust - 50) / 200, 0.25, 0.85), f0 = l.fame || 0; l.fame = Math.round(f0 * keep); fxImg(l, { warm: -2, trust: -4 }, 'Rời công ty và nhóm');
      log('Bạn rời công ty để hoạt động tự do. Tên nhóm và nhiều bài hát thuộc về công ty; khoảng ' + Math.round(keep * 100) + '% người theo dõi đi cùng bạn. Có thể ký công ty mới trong mục Audition hoặc tự phát hành.', 'big');
    } else if (k === 'retire') { leaveGroup(l, 'giải nghệ', log); s.retired = l.age; log('Bạn giải nghệ khi hợp đồng kết thúc. Fan gửi thư cảm ơn và tổ chức buổi chia tay.', 'big'); H.mem(l, 'Buổi chia tay cuối cùng với người hâm mộ.', 8); }
    if (oth.went.length && g.mem990) g.mem990.forEach(function (m) { if (m.left === l.age) note(l, m.n + ' rời nhóm khi hết hợp đồng'); });
  }
  function contractRows(l) {
    var g = grp(l), c = contract(l); if (!g || !c) return [];
    return [
      { k: 'renew', l: 'Tái ký cùng nhóm ' + Math.max(3, Math.round(ind(l).contract * 0.6)) + ' năm', h: 'Giữ nhóm và fandom; các thành viên khác tự quyết ở lại hay không', run: function (l, r, log) { doContract(l, r, log, 'renew'); } },
      { k: 'bargain', l: 'Tái ký có đàm phán về phần chia và quyền sáng tạo', h: 'Độ nổi tiếng và niềm tin cao dễ thắng; thất bại có thể bị rút đề nghị', run: function (l, r, log) { doContract(l, r, log, 'bargain'); } },
      { k: 'soloCo', l: 'Ra solo, ở lại công ty', h: 'Mất một phần fandom nhóm, công ty vẫn hỗ trợ', run: function (l, r, log) { doContract(l, r, log, 'soloCo'); } },
      { k: 'soloFree', l: 'Rời công ty, hoạt động tự do', h: 'Không giữ được tên nhóm, đổi lại tự chủ', run: function (l, r, log) { doContract(l, r, log, 'soloFree'); } },
      { k: 'retire', l: 'Không tái ký và giải nghệ', run: function (l, r, log) { doContract(l, r, log, 'retire'); } }
    ];
  }
  // ------------------------------------------------------------------ sự cố trong nhóm
  var KINDS = {
    rivalry: { n: 'mâu thuẫn giữa thành viên', why: ['tranh đất diễn trong màn trình diễn', 'khác quan điểm về hướng âm nhạc', 'hiểu lầm sau một câu nói trước máy quay', 'tranh vị trí trong đội hình', 'chia phần thưởng và quảng cáo'] },
    couple: { n: 'hai thành viên yêu nhau', why: ['cùng nhau làm việc và đi lưu diễn'] },
    fanlove: { n: 'thành viên hẹn hò với người hâm mộ', why: ['quen qua buổi giao lưu', 'nhắn tin riêng kéo dài'] },
    illness: { n: 'thành viên bị ốm hoặc kiệt sức', why: ['lịch trình dày kéo dài', 'bệnh có từ trước nhưng không nói', 'căng thẳng sau áp lực công chúng'] }
  };
  function stageOf(is) { return is.heat < 35 ? 0 : is.heat < 65 ? 1 : is.heat < 90 ? 2 : 3; }
  function issueText(l, g, is) {
    var a = is.a, b = is.b || 'bạn', st0 = stageOf(is), K = is.kind;
    if (K === 'rivalry') return st0 === 0 ? a + ' và ' + b + ' bắt đầu tránh mặt nhau (' + is.why + ').' : st0 === 1 ? a + ' và ' + b + ' không còn nói chuyện ngoài lịch quay; cả đội nhận ra bầu không khí căng thẳng.' : 'Mâu thuẫn giữa ' + a + ' và ' + b + ' rò rỉ ra ngoài: fan chia phe, báo chí hỏi về tình trạng nhóm.';
    if (K === 'couple') return st0 === 0 ? 'Có dấu hiệu ' + a + ' và ' + b + ' đang yêu nhau trong bí mật.' : st0 === 1 ? 'Người hâm mộ tinh ý bắt đầu bàn tán về ' + a + ' và ' + b + '.' : 'Tin ' + a + ' hẹn hò ' + b + ' bị đăng báo; công ty chờ nhóm phản hồi.';
    if (K === 'fanlove') return st0 === 0 ? a + ' đang nhắn tin riêng với một người hâm mộ.' : st0 === 1 ? 'Tin đồn ' + a + ' hẹn hò với fan lan trong cộng đồng fandom.' : 'Ảnh và tin nhắn của ' + a + ' với người hâm mộ bị phát tán; fandom chia rẽ.';
    return st0 === 0 ? a + ' hay mệt, bỏ bữa và ngủ ít (' + is.why + ').' : st0 === 1 ? a + ' ngất trong buổi tập; công ty chưa quyết có hoãn lịch hay không.' : a + ' phải nhập viện; lịch trình của nhóm phải thay đổi.';
  }
  function newIssue(l, g, rr, log) {
    var ms = mems(l, g), s = st(l); if (!ms.length || s.issues.filter(function (i) { return !i.done; }).length >= 2) return;
    var avgMood = ms.reduce(function (t, m) { return t + m.mood; }, 0) / ms.length, base = 0.14 + (60 - avgMood) / 300 + (pop(l) > 60 ? 0.04 : 0) + (isLeader(l) ? 0 : 0); if (rr() > U.clamp(base, 0.05, 0.4)) return;
    var kinds = ['rivalry', 'illness', ms.length >= 2 ? 'couple' : null, 'fanlove'].filter(Boolean), w = { rivalry: 1.3, illness: 1.1, couple: 0.7, fanlove: 0.7 };
    var K = U.wpick(rr, kinds, function (k) { return w[k]; }); if (s.issues.some(function (i) { return !i.done && i.kind === K; })) return;
    var m1 = ms[Math.floor(rr() * ms.length)], m2 = null, b = null;
    if (K === 'couple') { var rest = ms.filter(function (m) { return m.n !== m1.n; }); if (!rest.length) return; m2 = rest[Math.floor(rr() * rest.length)]; b = m2.n; }
    if (K === 'rivalry') { var rest2 = ms.filter(function (m) { return m.n !== m1.n; }); b = rest2.length && rr() < 0.75 ? rest2[Math.floor(rr() * rest2.length)].n : null; if (/thẳng tính/.test(m1.trait)) m1.mood -= 3; }
    if (K === 'illness' && /nhạy cảm|cầu toàn/.test(m1.trait)) m1.mood -= 2;
    var key = K + ':' + m1.n + ':' + (b || '');
    if (s.issues.some(function (i) { return i.key === key && yr(l) - i.y < 8; })) return;
    var why = KINDS[K].why[Math.floor(rr() * KINDS[K].why.length)];
    var is = { id: l.age + ':' + K + ':' + s.issues.length, key: key, kind: K, a: m1.n, b: b, why: why, y: yr(l), age: l.age, heat: 22 + Math.floor(rr() * 18), trust: 50, calm: 0, hist: [], done: false, acts: 0 };
    s.issues.push(is); if (s.issues.length > 24) s.issues = s.issues.filter(function (i) { return !i.done; }).concat(s.issues.filter(function (i) { return i.done; }).slice(-12));
    note(l, 'Phát sinh: ' + KINDS[K].n + ' (' + m1.n + (b ? ' – ' + b : '') + ')');
    log(issueText(l, g, is) + (isLeader(l) ? ' Với tư cách trưởng nhóm, bạn là người phải xử lý.' : ' Trưởng nhóm sẽ lo, nhưng bạn có thể can thiệp trong mục Quản lý nhóm.'), 'neutral');
  }
  function issueRows(l, is) {
    var g = grp(l); if (!g) return []; var lead = isLeader(l), sc = stageOf(is), a = member(l, g, is.a), b = is.b ? member(l, g, is.b) : null, soc = (l.st && l.st.soc) || 50, bond = a ? a.bond : 50, rows = [];
    function act(heat, trust, mood, bondD, txt, fame, kind) { return function (l, r, log) { var rr = seeded(l.id + ':act990:' + is.id + ':' + l.age + ':' + is.acts), luck = (rr() - 0.5) * 12; is.acts++; var h = heat + (lead ? 0 : Math.round(heat * 0.4)); is.heat = U.clamp(is.heat + h + (heat < 0 ? -luck * 0.4 : luck * 0.4), 0, 100); is.trust = U.clamp(is.trust + trust, 0, 100); is.hist.push({ y: yr(l), t: txt }); if (a) { a.mood = U.clamp(a.mood + mood, 0, 100); a.bond = U.clamp(a.bond + bondD, 0, 100); } if (b) { b.mood = U.clamp(b.mood + mood * 0.6, 0, 100); } if (fame) fameMul(l, fame); is.askedAt = l.age; log(txt + ' ' + (is.heat < 35 ? 'Tình hình lắng xuống.' : is.heat < 65 ? 'Vấn đề chưa hết nhưng đã bớt nóng.' : 'Vấn đề vẫn căng.'), is.heat < 50 ? 'good' : 'neutral'); }; }
    var K = is.kind;
    if (K === 'rivalry') {
      rows.push({ l: lead ? 'Nói chuyện riêng với từng người' : 'Nói chuyện riêng với ' + is.a, h: 'Kết quả theo độ thân thiết và khả năng giao tiếp (' + Math.round(soc) + ')', run: act(-(8 + Math.round(soc / 8) + Math.round(bond / 10)), 6, 4, 4, 'Bạn ngồi nghe riêng từng người, không phán xét ai.') });
      rows.push({ l: 'Ép hai người làm hòa trước mặt cả nhóm', h: 'Nhanh nhưng dễ để lại ấm ức', run: act(-12, -8, -4, -3, 'Bạn buộc hai người bắt tay trước cả nhóm.') });
      rows.push({ l: 'Tách lịch, hạn chế ghép đôi hai người', h: 'Giảm va chạm, mất một phần fan service', run: act(-10, 0, 2, 1, 'Bạn nhờ công ty sắp lịch để hai người ít phải đứng chung.', -0.005) });
      if (sc >= 1) rows.push({ l: 'Báo công ty can thiệp', h: 'Công ty có thể đổi vị trí hoặc tách lịch', run: act(-16, -4, -3, -4, 'Công ty vào cuộc, mời hai người làm việc riêng.') });
    } else if (K === 'couple') {
      rows.push({ l: 'Giữ kín và che chắn lịch trình', h: 'Giữ bí mật nhưng nếu lộ, bạn cũng bị trách', run: act(-6, 3, 3, 4, 'Bạn lặng lẽ sắp xếp lịch để hai người đỡ bị chú ý.') });
      rows.push({ l: 'Khuyên hai người thận trọng và báo công ty', h: 'Công ty chuẩn bị phương án truyền thông', run: act(-14, 2, -2, 0, 'Bạn khuyên hai người thận trọng, đồng thời báo công ty chuẩn bị.') });
      rows.push({ l: 'Khuyên giữ khoảng cách để bảo vệ nhóm', h: 'Giảm rủi ro nhưng hai người có thể giận', run: act(-10, -6, -6, -4, 'Bạn đề nghị hai người giữ khoảng cách trong thời gian hoạt động.') });
    } else if (K === 'fanlove') {
      rows.push({ l: 'Khuyên ' + is.a + ' dừng liên lạc riêng với người hâm mộ', h: 'Bảo vệ nhóm và cả người hâm mộ', run: act(-14, -3, -4, 2, 'Bạn nói thẳng với ' + is.a + ' về rủi ro và quyền riêng tư của người kia.') });
      rows.push({ l: 'Nhờ công ty hướng dẫn cách giữ quan hệ ngoài đời', h: 'Công ty có quy định riêng', run: act(-10, 2, 0, 0, 'Bạn đưa vấn đề tới công ty để có hướng dẫn rõ ràng.') });
      rows.push({ l: 'Tôn trọng quyết định của ' + is.a + ' và hỗ trợ giữ kín', h: 'Có thể bị lộ', run: act(-3, 4, 4, 5, 'Bạn tôn trọng quyết định của ' + is.a + ' và hứa giữ kín.') });
    } else {
      rows.push({ l: 'Ép ' + is.a + ' đi khám và nghỉ ngơi', h: 'Giảm nặng hơn nhưng mất lịch', run: act(-20, 5, 8, 4, 'Bạn đưa ' + is.a + ' đi khám và đề nghị nghỉ.', -0.01) });
      rows.push({ l: 'Xin công ty hoãn lịch của ' + is.a, h: 'Công ty cân nhắc doanh thu', run: act(-14, 2, 4, 1, 'Bạn xin công ty giảm lịch cho ' + is.a + '.') });
      rows.push({ l: 'Chia lại phần biểu diễn để đỡ gánh cho ' + is.a, h: 'Cả nhóm vất vả hơn', run: act(-9, 4, 3, 3, 'Bạn chia lại các phần biểu diễn trong nhóm.', 0) });
    }
    rows.push({ l: 'Chưa xử lý, quan sát thêm', h: 'Vấn đề có thể leo thang', run: function (l, r, log) { is.hist.push({ y: yr(l), t: 'Không can thiệp' }); is.askedAt = l.age; log('Bạn chọn chưa can thiệp vào chuyện của ' + is.a + (is.b ? ' và ' + is.b : '') + '.', 'neutral'); } });
    return rows;
  }
  function breakOut(l, g, is, rr, log) {
    var K = is.kind, K0 = ind(l).dating, s = st(l), m = member(l, g, is.a), b = is.b ? member(l, g, is.b) : null;
    is.done = true; is.endY = yr(l);
    if (K === 'rivalry') { var leaver = rr() < 0.5 && m ? m : b || m; if (leaver) { leaver.left = l.age; g.members = (g.members || []).filter(function (n) { return n !== leaver.n; }); (g.ex990 = g.ex990 || []).push({ n: leaver.n, age: l.age, why: 'mâu thuẫn' }); is.res = leaver.n + ' rời nhóm'; log('Mâu thuẫn không được giải quyết đã đẩy ' + leaver.n + ' rời nhóm. Fandom chia rẽ, bầu không khí sau đó nặng nề.', 'bad'); fameMul(l, -0.05); fxImg(l, { trust: -4, warm: -3 }, 'Nhóm rạn nứt công khai'); } }
    else if (K === 'couple') { var cut = rr() < 0.5; is.res = cut ? 'cặp đôi chia tay, không khí gượng gạo' : m.n + ' rời nhóm để theo đuổi chuyện riêng'; var loss = -0.02 * (1 + K0); fameMul(l, loss); fxImg(l, { trust: -2 * K0, scandal: 8 * K0 }, 'Chuyện yêu đương trong nhóm bị đưa lên báo'); if (!cut && m) { m.left = l.age; g.members = (g.members || []).filter(function (n) { return n !== m.n; }); (g.ex990 = g.ex990 || []).push({ n: m.n, age: l.age, why: 'chuyện tình cảm' }); } log('Tin hẹn hò trong nhóm bùng lên. ' + (cut ? 'Hai người chia tay để giữ nhóm nhưng không khí rất gượng.' : m.n + ' quyết định rời nhóm.') + (K0 >= 2 ? ' Công chúng ở ' + D.IND[code(l)].n.replace('ngành ', '') + ' khá khắt khe với chuyện này.' : ''), 'bad'); }
    else if (K === 'fanlove') { is.res = 'fandom chia rẽ, ' + is.a + ' xin lỗi'; fameMul(l, -0.03 * (1 + K0)); fxImg(l, { trust: -3 * (1 + K0 * 0.5), scandal: 10 }, 'Thành viên hẹn hò người hâm mộ bị phát tán tin nhắn'); log('Tin nhắn riêng của ' + is.a + ' với một người hâm mộ bị phát tán. Một bộ phận fandom thất vọng; nhóm phải đưa ra thông báo.', 'bad'); }
    else { if (m) { m.health = 'recovering'; if (rr() < 0.4) { m.left = l.age; g.members = (g.members || []).filter(function (n) { return n !== m.n; }); (g.ex990 = g.ex990 || []).push({ n: m.n, age: l.age, why: 'sức khỏe' }); is.res = m.n + ' rời nhóm để điều trị'; log(m.n + ' rời nhóm vì sức khỏe sau thời gian dài kiệt sức. Cả nhóm xúc động trong buổi chia tay.', 'bad'); } else { is.res = m.n + ' nghỉ dài hạn rồi quay lại'; log(m.n + ' nghỉ dài hạn để điều trị; nhóm hoạt động thiếu một người trong thời gian đó. Cuối cùng ' + m.n + ' khỏe lại và quay về.', 'neutral'); m.health = 'ok'; fameMul(l, -0.015); } } }
    note(l, 'Kết thúc: ' + KINDS[K].n + ' – ' + is.res);
  }
  function issuesYear(l, rr, log) {
    var g = grp(l); if (!g || !free(l)) return; var s = st(l); if (s.issueYear === l.age) return; s.issueYear = l.age; mems(l, g);
    if (!(g.members || []).length) return;
    s.issues.filter(function (i) { return !i.done; }).forEach(function (is) {
      var lead = isLeader(l), sc = stageOf(is), pub = img(l).scandal, drift = { rivalry: 7, couple: 6, fanlove: 7, illness: 6 }[is.kind] + (sc >= 2 ? 3 : 0) + (pop(l) > 60 ? 2 : 0) + (rr() - 0.5) * 8;
      if (!lead) { var ld = leaderNpc(l, g); if (ld && rr() < 0.35) { drift -= 14; is.hist.push({ y: yr(l), t: 'Trưởng nhóm ' + ld.n + ' đã nói chuyện với các bên' }); if (is.heat > 45) log('Trưởng nhóm ' + ld.n + ' đã ngồi lại với ' + is.a + (is.b ? ' và ' + is.b : '') + '.', 'neutral'); } }
      if (is.askedAt === l.age) drift -= 2; is.heat = U.clamp(is.heat + drift, 0, 100);
      var a = member(l, g, is.a); if (a) a.mood = U.clamp(a.mood + (is.heat > 60 ? -4 : is.heat < 30 ? 2 : 0), 0, 100);
      if (is.heat >= 90) { breakOut(l, g, is, rr, log); return; }
      if (is.heat < 12) { is.calm++; if (is.calm >= 2) { is.done = true; is.endY = yr(l); is.res = 'đã hòa giải'; log('Chuyện của ' + is.a + (is.b ? ' và ' + is.b : '') + ' đã êm xuôi sau thời gian dài.', 'good'); if (lead) { s.first.resolved = s.first.resolved || yr(l); fxImg(l, { trust: 1 }); } note(l, 'Hòa giải: ' + KINDS[is.kind].n); return; } } else is.calm = 0;
      if (stageOf(is) >= 1 && isLeader(l) && is.askedAt !== l.age && E.DEC.issue990) { var d = E.DEC.issue990.make(l, rr, { id: is.id }); d.manual = false; l.pending.push(d); is.askedAt = l.age; }
      else if (stageOf(is) >= 2 && !is.told) { is.told = l.age; log(issueText(l, g, is), 'bad'); }
    });
    newIssue(l, g, rr, log);
    mems(l, g).forEach(function (m) { m.mood = U.clamp(m.mood + (m.bond - 50) * 0.02 + (rr() - 0.5) * 4, 0, 100); if (m.health === 'recovering' && rr() < 0.5) m.health = 'ok'; });
  }
  // ------------------------------------------------------------------ mức độ lan tỏa của sản phẩm
  var PROMO = { tv: ['Quảng bá truyền hình và radio', 'tv'], challenge: ['Thử thách nhảy / video ngắn', 'social'], collab: ['Hợp tác với nghệ sĩ khác', 'collab'], low: ['Quảng bá tối thiểu', 'low'] };
  function eraFit(l, kind) { var e = D.era(yr(l)).id, social = /^(web|short|ai|immersive)$/.test(e), tv = /^(tv|cd|radio)$/.test(e); if (kind === 'social') return social ? (e === 'short' ? 1.25 : 1.1) : 0.5; if (kind === 'tv') return tv ? 1.2 : 0.75; if (kind === 'collab') return 1.05; return 0.7; }
  function reachYear(l, rr, log) {
    var s = st(l), rel = release(l); if (!rel || s.reachYear === l.age || !performer(l)) return null; s.reachYear = l.age;
    var pr = s.promo && s.promo.age >= l.age - 1 ? s.promo.kind : 'low', fit = eraFit(l, PROMO[pr] ? PROMO[pr][1] : 'low'), m = img(l);
    var score = 0.42 * rel.q + 0.18 * pop(l) / 100 + 0.2 * (fit - 0.5) + 0.2 * rr() + (m.warm - 50) / 300 - m.scandal / 400;
    var e = D.era(yr(l)), kind = null, title = (rel.kind === 'group' ? 'Bài hát chủ đề' : 'Ca khúc chủ đề') + ' năm ' + yr(l);
    if (score >= 0.88) kind = 'quocdan'; else if (score >= 0.7) kind = /^(web|short|ai|immersive)$/.test(e.id) ? 'viral' : 'phu'; else if (score >= 0.52) kind = 'cong_dong'; else if (score < 0.3) kind = 'chim';
    if (!kind) { log('Sản phẩm mới được đón nhận ở mức vừa phải qua ' + e.reach + '.', 'neutral'); return { kind: 'vua', score: score }; }
    var T = { quocdan: ['Ca khúc phủ sóng toàn quốc: từ người trẻ đến người lớn tuổi đều nghe qua ' + e.reach + '.', 0.2, 10, 'good'], viral: ['Ca khúc lan truyền mạnh qua ' + e.reach + ', nhiều người làm lại và chia sẻ.', 0.12, 6, 'good'], phu: ['Ca khúc được phát nhiều trên ' + e.reach + ' và đạt độ phủ rộng.', 0.08, 4, 'good'], cong_dong: ['Ca khúc được cộng đồng yêu nhạc nghe nhiều nhưng chưa vượt ra đại chúng.', 0.03, 2, 'neutral'], chim: ['Ca khúc không tạo được tiếng vang dù được quảng bá qua ' + e.reach + '.', -0.03, -3, 'bad'] }[kind];
    fameMul(l, T[1]); if (l.flags.idol987) l.flags.idol987.pop = Math.round(U.clamp((l.flags.idol987.pop || pop(l)) + T[2], 0, 100));
    s.hits.push({ y: yr(l), age: l.age, kind: kind, q: rel.q, promo: pr, score: Math.round(score * 100) });
    log(T[0] + (pr === 'challenge' && fit > 1 ? ' Thử thách nhảy phát huy tác dụng.' : pr === 'tv' && fit < 1 ? ' Quảng bá truyền hình ít hiệu quả với cách khán giả nghe nhạc thời nay.' : ''), T[3] === 'good' && T[1] >= 0.12 ? 'big' : T[3]);
    if (kind === 'quocdan' || kind === 'viral') H.mem(l, 'Ngày bài hát của mình bỗng có mặt ở khắp nơi.', 7);
    return { kind: kind, score: score };
  }
  function sleeperYear(l, rr, log) {
    var s = st(l); if (!s.hits.length || s.sleeper === l.age) return; var old = s.hits.filter(function (h) { return l.age - h.age >= 2 && h.q >= 0.5 && !h.again; });
    if (!old.length || rr() > 0.05 || !/^(web|short|ai|immersive)$/.test(D.era(yr(l)).id)) return; var h = old[Math.floor(rr() * old.length)]; h.again = l.age; s.sleeper = l.age; fameMul(l, 0.05);
    log('Một đoạn video cũ bất ngờ đưa ca khúc năm ' + h.y + ' của bạn trở lại bảng xếp hạng.', 'good');
  }
  // ------------------------------------------------------------------ menu quản lý nhóm
  function teamText(l) {
    var g = grp(l); if (!g) return 'Không còn trong nhóm.'; var c = contract(l), ms = mems(l, g), s = peek(l), t = g.name + ' · ' + (isLeader(l) ? 'bạn là trưởng nhóm' : 'trưởng nhóm: ' + ((leaderNpc(l, g) || {}).n || '—')) + '.';
    if (c) t += '\nHợp đồng nhóm: ' + (l.birthYear + c.from) + '–' + (l.birthYear + c.until) + ' (' + c.len + ' năm), đã tái ký ' + c.renewals + ' lần' + (c.until - l.age <= 1 ? '. Sắp hết hạn, cần quyết định hướng đi.' : '.');
    t += '\nThành viên: ' + (ms.length ? ms.map(function (m) { return m.n + ' (' + m.trait + '; mong muốn: ' + m.want + '; thân thiết ' + m.bond + '/100; tinh thần ' + m.mood + '/100' + (m.health !== 'ok' ? '; sức khỏe: cần theo dõi' : '') + ')'; }).join('; ') : 'chưa có');
    var open = (s.issues || []).filter(function (i) { return !i.done; });
    if (open.length) t += '\nVấn đề đang diễn ra: ' + open.map(function (i) { return issueText(l, g, i); }).join(' ');
    return t;
  }
  X.menu('team990', 'Quản lý nhóm nhạc', function (l) { return grp(l) ? true : 'Cần đang hoạt động trong một nhóm nhạc'; }, function (l) { return teamText(l); },
    function (l) {
      var g = grp(l), s = peek(l), out = []; if (!g) return out;
      (s.issues || []).filter(function (i) { return !i.done; }).forEach(function (is) { out.push({ k: 'i' + is.id, l: 'Xử lý: ' + KINDS[is.kind].n + ' (' + is.a + (is.b ? ' – ' + is.b : '') + ')', h: isLeader(l) ? '' : 'Bạn không phải trưởng nhóm; tác động nhỏ hơn', why: is.askedAt === l.age ? 'Năm nay đã xử lý' : true, run: function (l, r) { X.next(l, 'issue990', r, { id: is.id }); } }); });
      mems(l, g).forEach(function (m) {
        out.push({ k: 't' + m.n, l: 'Trò chuyện riêng với ' + m.n, h: 'Hiểu thêm mong muốn, tăng thân thiết', why: m.talk === l.age ? 'Năm nay đã trò chuyện' : true, run: function (l, r, log) { m.talk = l.age; m.bond = U.clamp(m.bond + 6, 0, 100); m.mood = U.clamp(m.mood + 4, 0, 100); m.hist.push({ y: yr(l), t: 'trò chuyện riêng' }); log('Bạn dành buổi tối nói chuyện riêng với ' + m.n + ' (' + m.trait + '). ' + m.n + ' tâm sự mong muốn: ' + m.want + '.', 'good'); } });
      });
      out.push({ k: 'dinner', l: 'Tổ chức bữa ăn cả nhóm', h: V(l, 150) ? 'Tốn ' + mo(l, V(l, 150)) : '', why: s.dinner === l.age ? 'Năm nay đã tổ chức' : l.money < V(l, 150) ? 'Chưa đủ tiền' : true, run: function (l, r, log) { var st1 = st(l); st1.dinner = l.age; H.cash(l, -V(l, 150), 'Bữa ăn cả nhóm'); mems(l, g).forEach(function (m) { m.mood = U.clamp(m.mood + 5, 0, 100); m.bond = U.clamp(m.bond + 2, 0, 100); }); (st1.issues || []).forEach(function (i) { if (!i.done) i.heat = U.clamp(i.heat - 4, 0, 100); }); log('Cả nhóm có một buổi tối thoải mái hiếm hoi bên nhau.', 'good'); } });
      return out;
    }, 15, 'Sự nghiệp giải trí');
  E.SC('issue990', {
    title: function (l, d) { var is = find(l, d.id); return is ? 'Trong nhóm: ' + KINDS[is.kind].n : 'Vấn đề trong nhóm'; },
    text: function (l, d) { var is = find(l, d.id), g = grp(l); return is && g ? issueText(l, g, is) + (isLeader(l) ? ' Bạn là trưởng nhóm, mọi người chờ bạn quyết định.' : ' Bạn không phải trưởng nhóm nên chỉ hỗ trợ được một phần.') : 'Không còn vấn đề cần xử lý.'; },
    prep: function (l, r, arg) { return { id: arg && arg.id, at: l.age }; },
    opts: [0, 1, 2, 3, 4, 5].map(function (i) {
      function row(l, d) { var is = find(l, d.id); return is && !is.done ? issueRows(l, is)[i] : null; }
      return { k: String(i), req: function (l, d) { return !!row(l, d); }, l: function (l, d) { var x = row(l, d); return x ? x.l : ''; }, h: function (l, d) { var x = row(l, d); return x && x.h || ''; }, ai: function (l, d) { return i === 0 ? 3 : i === 1 ? 1 : 1.5; }, run: function (l, r, log, d) { var x = row(l, d); if (x) x.run(l, r, log); } };
    })
  });
  function find(l, id) { return (peek(l).issues || []).filter(function (i) { return i.id === id; })[0] || null; }
  E.SC('contract990', {
    title: function (l) { var g = grp(l); return 'Hợp đồng nhóm ' + (g ? g.name : '') + ' hết hạn'; },
    text: function (l) { var g = grp(l), c = contract(l); return g && c ? 'Hợp đồng ' + c.len + ' năm của ' + g.name + ' kết thúc vào ' + (l.birthYear + c.until) + '. Độ nổi tiếng cá nhân ' + pop(l) + '/100, người hâm mộ ' + U.fmtNum(g.fandom || 0) + '. Các thành viên khác cũng đang cân nhắc: ' + mems(l, g).map(function (m) { return m.n + ' (' + m.want + ')'; }).join('; ') + '. Mỗi người tự quyết định ở lại hay đi.' : 'Hợp đồng đã được xử lý.'; },
    prep: function (l, r, arg) { return { at: l.age }; },
    opts: [0, 1, 2, 3, 4].map(function (i) { function row(l) { return contractRows(l)[i] || null; } return { k: String(i), req: function (l, d) { return !!row(l) && !!grp(l); }, l: function (l) { var x = row(l); return x ? x.l : ''; }, h: function (l) { var x = row(l); return x && x.h || ''; }, ai: function (l) { return [3, 2, 1.2, 0.6, 0.2][i]; }, run: function (l, r, log) { var x = row(l); if (x) x.run(l, r, log); } }; })
  });
  function contractYear(l, rr, log) {
    var c = contract(l); if (!c) return; if (l.age === c.until - 1 && c.warned !== l.age) { c.warned = l.age; log('Hợp đồng nhóm còn một năm. Công ty bắt đầu bàn chuyện tái ký và các thành viên bắt đầu nói về dự định riêng.', 'neutral'); }
    if (l.age >= c.until && c.asked !== l.age && E.DEC.contract990) { c.asked = l.age; var d = E.DEC.contract990.make(l, rr, {}); d.manual = false; l.pending.push(d); }
  }
  // ------------------------------------------------------------------ vòng năm
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive) return; var s0 = l.flags.idol990, g = grp(l); if (!s0 && !g && !(performer(l) && pop(l) >= 25)) return;
    var s = st(l); if (s.yearAt === l.age) return; s.yearAt = l.age; var rr = seeded(l.id + ':year990:' + l.age);
    imgYear(l); if (g) { mems(l, g); contractYear(l, rr, log); issuesYear(l, rr, log); }
    reachYear(l, rr, log); sleeperYear(l, rr, log); awardsYear(l, rr, log);
  });
  if (E.profile) { var profile = E.profile; E.profile = function (l) { var p = profile.apply(this, arguments), s = l.flags && l.flags.idol990; if (p && p.jobInfo && s) { var g = grp(l), c = g && contract(l); if (c) p.jobInfo.push('Hợp đồng nhóm đến ' + (l.birthYear + c.until)); if (s.awards && s.awards.length) p.jobInfo.push('Giải thưởng: ' + s.awards.length + (s.first && s.first.grand ? ' (có giải lớn)' : '')); if (s.hits && s.hits.length) p.jobInfo.push('Ca khúc được đại chúng biết đến: ' + s.hits.filter(function (h) { return h.kind !== 'chim' && h.kind !== 'cong_dong'; }).length); var ex = idol(l) && idol(l).exGroup990; if (ex) p.jobInfo.push('Từng là thành viên ' + ex.name); } return p; }; }
  var convert = E.abroadConvert; if (convert) E.abroadConvert = function (l, f) { var out = convert.apply(this, arguments), s = l.flags && l.flags.idol990; if (s) (s.cons || []).forEach(function (c) { if (c.cost) c.cost *= f; if (c.deposit) c.deposit *= f; }); return out; };
  if (E.addAchievements) E.addAchievements([
    ['sb_award990', '🏆', 'Được gọi tên', 'Nhận giải thưởng âm nhạc đầu tiên', function (l) { var s = l.flags.idol990; return !!(s && (s.awards || []).length); }],
    ['sb_daesang990', '👑', 'Giải thưởng lớn', 'Nhận giải thưởng lớn (daesang hoặc tương đương)', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.grand); }],
    ['sb_triple990', '🎖️', 'Một đêm ba giải lớn', 'Nhận ba giải lớn trong cùng một năm', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.triple); }],
    ['sb_intlaw990', '🌐', 'Vượt biên giới', 'Nhận giải âm nhạc quốc tế', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.intl); }],
    ['sb_renew990', '🤝', 'Cùng nhau thêm một chặng', 'Tái ký hợp đồng nhóm', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.renew); }],
    ['sb_leader990', '🧭', 'Người giữ lửa', 'Giúp nhóm vượt qua một biến cố khi làm trưởng nhóm', function (l) { var s = l.flags.idol990; return !!(s && s.first && s.first.resolved); }],
    ['sb_viral990', '📈', 'Phủ sóng', 'Có ca khúc phủ sóng hoặc lan truyền mạnh', function (l) { var s = l.flags.idol990; return !!(s && (s.hits || []).some(function (h) { return h.kind === 'quocdan' || h.kind === 'viral'; })); }]
  ]);
  E.IDOL990 = { S: st, peek: peek, img: img, fxImg: fxImg, fameMul: fameMul, grp: grp, code: code, ind: ind, fans: fans, pop: pop, performer: performer, release: release, awardsYear: awardsYear, rollAward: rollAward, formOf: formOf, mems: mems, member: member, isLeader: isLeader, leaderNpc: leaderNpc, contract: contract, contractRows: contractRows, doContract: doContract, issuesYear: issuesYear, issueRows: issueRows, issueText: issueText, stageOf: stageOf, newIssue: newIssue, reachYear: reachYear, PROMO: PROMO, eraFit: eraFit, note: note, free: free, yr: yr, KINDS: KINDS, imgYear: imgYear, find: find, contractYear: contractYear };
})(globalThis.G);
