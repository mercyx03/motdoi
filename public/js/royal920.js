/* Một Đời — MD5 (8.10.24): royal920 — hoàng gia, tước vị, công vụ, ngân sách và kế vị (mở rộng life84, ELITE148).
   · Mọi thành viên hoàng gia trong game là nhân vật HƯ CẤU (nhà hư cấu đặt trong nước quân chủ có thật), có mã người, năm sinh và cây
     kế vị cố định; không mỗi gala sinh thêm người thừa kế. Chỉ nước có chế độ quân chủ (E.MONARCHIES) mới có registry.
   · Anh là nhánh chi tiết: danh mục tước (sovereign, consort, Prince/Princess of Wales, Prince/Princess, Princess Royal, Duke…Baron)
     phân loại riêng (hoàng gia/quý tộc, thực/courtesy, cha truyền/chung thân), không phải một thang rank. Các nước khác: quy tắc kế vị
     và cơ quan chấp thuận hôn nhân ở mức tóm tắt (ghi rõ chưa xác minh).
   · Tình cảm: làm quen → tin cậy → lời mời riêng → hẹn hò → ra mắt gia đình → đính hôn → chấp thuận (nếu luật đòi hỏi) → cưới; người
     kia có quyền từ chối/chậm lại/rút lui; không cưới tự động khi đạt ngưỡng. Hai bên phải trưởng thành, không có quan hệ huyết thống gần.
   · Ngân sách công vụ (theo royal.uk: Sovereign Grant trả cho công vụ, không phải thu nhập riêng): sổ riêng cấp → chi theo nhiệm vụ →
     phần chưa chi hoàn lại, không thành tài sản/thừa kế, không trả theo số tước. Mức tiền là tham số giả lập. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, W = G.W, X = E.UPDATE110, MON = E.MONARCHIES || {};
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function rng(seed) { var a = hash(seed); return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mo(l, v) { return H.money(l, v); }
  function yr(l) { return l.birthYear + l.age; }
  function cc(l) { return E.resCode ? E.resCode(l) : l.country; }
  function st(l) { var s = l.flags.royal920; if (!s || typeof s !== 'object') s = l.flags.royal920 = { houses: {}, met: {}, ledger: [], v: 1 }; if (!s.houses) s.houses = {}; if (!s.met) s.met = {}; if (!s.ledger) s.ledger = []; return s; }
  function cname(c) { return W.BY[c] ? W.BY[c].name : c; }

  // ================= quy tắc theo nước =================
  // succ: abs = trưởng không phân biệt giới; male = ưu tiên nam; agnatic = chỉ nam, qua dòng nam; appoint = chỉ định/hội đồng
  var RULES = {
    GB: { kind: 'lập hiến', succ: 'abs', consent: 'Nhà vua chấp thuận cho 6 người đầu hàng kế vị (Succession to the Crown Act 2013)', consentN: 6, ok: 'secondary', detail: true },
    SE: { kind: 'lập hiến', succ: 'abs', consent: 'Chính phủ chấp thuận theo đề nghị của người trị vì', consentN: 99, ok: 'primary' }, NO: { kind: 'lập hiến', succ: 'abs', consent: 'Nhà vua chấp thuận', consentN: 99, ok: 'secondary' },
    DK: { kind: 'lập hiến', succ: 'abs', consent: 'Người trị vì chấp thuận tại Hội đồng Nhà nước; chính quân vương kết hôn cần Folketing', consentN: 99, ok: 'secondary' }, NL: { kind: 'lập hiến', succ: 'abs', consent: 'Quốc hội chấp thuận cho người trong hàng kế vị', consentN: 99, ok: 'secondary' },
    BE: { kind: 'lập hiến', succ: 'abs', consent: 'Nhà vua chấp thuận', consentN: 99, ok: 'secondary' }, LU: { kind: 'lập hiến', succ: 'abs', consent: 'Đại công tước chấp thuận', consentN: 99, ok: 'secondary' },
    ES: { kind: 'lập hiến', succ: 'male', consent: 'Không kết hôn trái lệnh cấm rõ ràng của người trị vì và Cortes Generales', consentN: 99, ok: 'secondary' }, MC: { kind: 'lập hiến', succ: 'male', consent: 'Thân vương chấp thuận', consentN: 99, ok: 'secondary' },
    JP: { kind: 'lập hiến (biểu tượng)', succ: 'agnatic', consent: 'Hội đồng Hoàng thất (thành viên nam); nữ thành viên kết hôn với thường dân thì rời hoàng tộc', consentN: 99, ok: 'secondary', femaleLeaves: true },
    TH: { kind: 'lập hiến', succ: 'male', consent: 'Theo Luật Hoàng cung (chưa xác minh)', consentN: 99, ok: 'unverified' }, LI: { kind: 'lập hiến (thân vương có quyền lớn)', succ: 'abs', consent: 'Sự đồng ý bằng văn bản của Thân vương trị vì theo Luật Hôn nhân gia tộc (House Law)', consentN: 99, ok: 'secondary' },
    SA: { kind: 'tuyệt đối', succ: 'appoint', consent: 'Quyết định của nhà vua/hội đồng gia tộc (chưa xác minh)', consentN: 99, ok: 'unverified' }, BN: { kind: 'tuyệt đối', succ: 'male', consent: 'Chưa xác minh', consentN: 99, ok: 'unverified' },
    OM: { kind: 'tuyệt đối', succ: 'appoint', consent: 'Chưa xác minh', consentN: 99, ok: 'unverified' }, SZ: { kind: 'tuyệt đối', succ: 'appoint', consent: 'Chưa xác minh', consentN: 99, ok: 'unverified' }
  };
  function rule(c) { return RULES[c] || { kind: MON[c] ? 'quân chủ (chưa phân loại)' : null, succ: 'male', consent: 'Quy định riêng của nước này chưa xác minh', consentN: 99, ok: 'unverified' }; }

  // ================= danh mục tước (Anh) =================
  var TITLES = {
    sovereign: { n: ['Vua (người trị vì)', 'Nữ hoàng (người trị vì)'], kind: 'trị vì', note: 'Người duy nhất giữ ngai; không do kết hôn mà có.' },
    consort: { n: ['Phối ngẫu của Nữ hoàng', 'Hoàng hậu (phối ngẫu)'], kind: 'phối ngẫu', note: 'Do kết hôn với người trị vì; không có quyền trị vì.' },
    wales: { n: ['Thân vương xứ Wales (Prince of Wales)', 'Vương phi xứ Wales (Princess of Wales)'], kind: 'hoàng gia, do nhà vua phong', note: 'Thường phong cho người thừa kế trực tiếp nhưng không tự động có khi đứng đầu hàng kế vị.' },
    prince: { n: ['Hoàng tử (Prince)', 'Công chúa (Princess)'], kind: 'hoàng gia', note: 'Con, cháu nội dòng nam của người trị vì theo Letters Patent 1917 (và ngoại lệ do nhà vua quyết định); vợ hoàng tử dùng style theo chồng.' },
    royal: { n: ['—', 'Princess Royal'], kind: 'danh hiệu riêng do nhà vua trao', note: 'Có thể trao cho con gái trưởng của người trị vì, giữ suốt đời; không phải bậc chung của mọi công chúa.' },
    duke: { n: ['Công tước (Duke)', 'Nữ công tước (Duchess)'], kind: 'quý tộc (peerage)', note: 'Bậc cao nhất của peerage; Duchess có thể là người giữ tước tự thân hoặc là vợ công tước (style do kết hôn).' },
    marquess: { n: ['Hầu tước (Marquess)', 'Nữ hầu tước (Marchioness)'], kind: 'quý tộc (peerage)', note: '' },
    earl: { n: ['Bá tước (Earl)', 'Nữ bá tước (Countess)'], kind: 'quý tộc (peerage)', note: '' },
    viscount: { n: ['Tử tước (Viscount)', 'Nữ tử tước (Viscountess)'], kind: 'quý tộc (peerage)', note: '' },
    baron: { n: ['Nam tước (Baron)', 'Nữ nam tước (Baroness)'], kind: 'quý tộc (peerage)', note: 'Tước chung thân (life peerage) hiện đại chỉ ở bậc nam tước.' }
  };
  function tname(key, sex) { var T = TITLES[key]; return T ? T.n[sex === 'F' ? 1 : 0] : key; }
  // mỗi danh hiệu một bản ghi: substantive (tự thân) hay courtesy/style (do kết hôn, làm con), cha truyền hay chung thân
  function grant(p, key, how, hered, why, at, detail) { p.titles = p.titles || []; if (p.titles.some(function (t) { return t.key === key && !t.lost && (!detail || t.territory === detail.territory); })) return false; p.titles.push(Object.assign({ key: key, how: how, hered: !!hered, why: why, at: at },detail||{})); return true; }
  function mainTitle(p) { if(E.ROYAL858){var canonical=E.ROYAL858.title(p);if(canonical!=null)return canonical;}if(E.ROYAL837){var local=E.ROYAL837.title(p);if(local)return local;} var order = ['sovereign', 'consort', 'wales', 'royal', 'prince', 'duke', 'marquess', 'earl', 'viscount', 'baron'], t = (p.titles || []).filter(function (t) { return !t.lost; }).sort(function (a, b) { return order.indexOf(a.key) - order.indexOf(b.key); })[0]; return t ? tname(t.key, p.sex) + (t.how === 'courtesy' ? ' (danh xưng do kết hôn)' : '') : 'không có tước'; }

  // ================= registry nhà hoàng gia (hư cấu) =================
  var HOUSE = ['Ashbourne', 'Valmont', 'Rhenvald', 'Castelor', 'Eldmere', 'Norhaven', 'Sorvik', 'Montclair'];
  function pool(c) { return String(W.BY[c] && W.BY[c].pool || 'en').split(',')[0].split(':')[0]; }
  function nm(l, r, c, sex) { try { return G.NAMES.worldName(r, pool(c), sex).first || G.NAMES.worldName(r, pool(c), sex).full.split(' ')[0]; } catch (e) { return sex === 'F' ? 'Elena' : 'Henrik'; } }
  function house(l, c) {
    if (!MON[c]) return null; var s = st(l); if (s.houses[c]) {if(E.ROYAL837)E.ROYAL837.prepare(l,s.houses[c],false);return s.houses[c];}
    var r = rng(l.id + ':house920:' + c), y = yr(l), R = rule(c), id = 0, h = { cc: c, name: 'Nhà ' + HOUSE[Math.floor(r() * HOUSE.length)], kind: R.kind, members: [], seat: null, at: y };
    function add(o) { o.id = c + ':r920:' + (++id); o.alive = true; o.titles = []; o.warmth = Math.round(30 + r() * 60); o.open = Math.round(20 + r() * 70); o.faith = r() < 0.7 ? 'theo quốc giáo' : 'ít sùng đạo'; h.members.push(o); return o; }
    var sex0 = R.succ === 'agnatic' || R.succ === 'male' && r() < 0.8 ? 'M' : r() < 0.5 ? 'M' : 'F';
    var sov = add({ name: nm(l, r, c, sex0), sex: sex0, by: y - 58 - Math.floor(r() * 15), role: 'sovereign', working: true }); grant(sov, 'sovereign', 'substantive', true, 'kế vị', sov.by + 40); h.seat = sov.id;
    var con = add({ name: nm(l, r, c, sex0 === 'M' ? 'F' : 'M'), sex: sex0 === 'M' ? 'F' : 'M', by: sov.by + Math.round((r() - 0.5) * 6), role: 'consort', working: true, spouse: sov.id }); sov.spouse = con.id; grant(con, 'consort', 'courtesy', false, 'kết hôn', sov.by + 30);
    var n = 2 + Math.floor(r() * 3);
    for (var i = 0; i < n; i++) { var sx = r() < 0.5 ? 'M' : 'F', k = add({ name: nm(l, r, c, sx), sex: sx, by: sov.by + 24 + i * 2 + Math.floor(r() * 2), role: 'child', parent: sov.id, working: i < 2 }); grant(k, 'prince', 'substantive', false, 'con của người trị vì', k.by); }
    // một thế hệ cháu cho người con trưởng
    var heir = order(l, h)[0]; if (heir) { var m = 1 + Math.floor(r() * 3); for (var j = 0; j < m; j++) { var sx2 = r() < 0.5 ? 'M' : 'F', g = add({ name: nm(l, r, c, sx2), sex: sx2, by: Math.max(heir.by + 24, y - 30) + j * 2, role: 'grandchild', parent: heir.id, working: false }); if (heir.sex === 'M' || c !== 'GB') grant(g, 'prince', 'substantive', false, 'cháu nội của người trị vì', g.by); } }
    if (c === 'GB') { var e = h.members.filter(function (x) { return x.role === 'grandchild' && x.sex === 'F'; })[0] || h.members.filter(function (x) { return x.role === 'child' && x.sex === 'F'; })[0]; if (e) e.name = 'Amara'; }
    s.houses[c] = h; if(E.ROYAL837)E.ROYAL837.prepare(l,h,true);return h;
  }
  function byId(h, id) { return h.members.filter(function (m) { return m.id === id; })[0]; }
  function age(l, m) { return yr(l) - m.by; }
  // thứ tự kế vị dựng lại từ cây (DFS từ người trị vì), không lưu cứng nên sinh/mất/rời hàng đều cập nhật nhất quán
  function order(l, h) {
    var R = rule(h.cc), sov = byId(h, h.seat), out = [];
    function kids(p) { return h.members.filter(function (m) { return m.parent === p.id && m.by<=yr(l) && !m.removed && !m.adopted920 && !m.barredLine837; }).sort(function (a, b) { if ((R.succ === 'male'||E.ROYAL837&&E.ROYAL837.malePreference(h,a,b,l)) && a.sex !== b.sex) return a.sex === 'M' ? -1 : 1; return a.by - b.by || (a.birthOrder837||0)-(b.birthOrder837||0) || String(a.id).localeCompare(String(b.id)); }); }
    function walk(p) { kids(p).forEach(function (k) { if (R.succ === 'agnatic' && k.sex !== 'M') return; if (k.alive && k.id!==h.seat && (!E.ROYAL837||E.ROYAL837.eligible(l,h,k))) out.push(k); if (R.succ !== 'agnatic' || k.sex === 'M') walk(k); }); }
    var root=byId(h,h.founder837)||sov; if (root) walk(root); return R.succ === 'appoint' ? out.slice(0, 1) : out;
  }
  function lineOf(l, h, m) { var i = order(l, h).indexOf(m); return i < 0 ? null : i + 1; }
  function succeed(l, h, log) {
    var sov = byId(h, h.seat); if (sov && sov.alive && !sov.abdicated837) return; var next = order(l, h)[0]; if (!next) return; if(E.ROYAL837&&!E.ROYAL837.accessionReady(l,h,next,log))return;
    if (sov) (sov.titles || []).forEach(function (t) { if (t.key === 'sovereign') t.lost = sov.abdicated837?'thoái vị':'qua đời'; });
    var old = byId(h, sov && sov.spouse); if (old) {old.role=sov&&sov.abdicated837?'formerConsort':'dowager';(old.titles||[]).forEach(function(t){if(t.key==='consort')t.lost='người trị vì thay đổi';});}
    h.seat = next.id; next.role = 'sovereign'; if(E.ROYAL837)E.ROYAL837.accession(l,h,next,sov,log); grant(next, 'sovereign', 'substantive', true, 'kế vị', yr(l));
    (next.titles || []).forEach(function (t) { if (t.key === 'wales') t.lost = 'trở thành người trị vì'; });
    var sp = next.spouse && byId(h, next.spouse); if (sp) grant(sp, 'consort', 'courtesy', false, 'phối ngẫu của người trị vì', yr(l));
    if(E.ROYAL847&&E.ROYAL847.syncTitles)E.ROYAL847.syncTitles(l,h,next,sov,log);
    if (log && st(l).met[h.cc]) log(h.name + ' (' + cname(h.cc) + ', nhân vật hư cấu): ' + next.name + ' kế vị ngai theo thứ tự kế vị.', 'neutral');
  }
  function houseYear(l, h, log) {
    if (st(l).inheritedAt843>yr(l)||h.yr === yr(l)) return; h.yr = yr(l);
    h.members.forEach(function (m) { if (m.alive && !m.player && age(l, m) > 60 && u(l.id + ':rd:' + m.id + ':' + yr(l)) < Math.max(0, (age(l, m) - 60) / 900)) m.alive = false; });
    succeed(l, h, log);
  }

  // ================= tiếp cận: dạ tiệc, gala, đua ngựa, triển lãm =================
  var EV = { reception: ['Dạ tiệc ngoại giao', 0, 'invite'], gala: ['Gala từ thiện (mua vé)', 0.08, 'ticket'], races: ['Ngày hội đua ngựa', 0.03, 'ticket'], art: ['Khai mạc triển lãm nghệ thuật', 0.01, 'ticket'], intro: ['Được người quen trong giới giới thiệu', 0, 'friend'] };
  function tier(l) { return E.ELITE148 ? E.ELITE148.tier(l) : 0; }
  function evWhy(l, k, c) {
    var s = st(l), x = EV[k]; if (!MON[c]) return 'Cần ở/đến nước có chế độ quân chủ';
    if ((s.evN || {})[yr(l)] >= 3) return 'Đã dự 3 sự kiện năm nay';
    if (x[2] === 'invite' && !(tier(l) >= 3 || (l.fame || 0) >= 1e6 || l.flags.royal || l.job && /ngoai_giao|dai_su/.test(l.job.id))) return 'Cần được mời: giới ngoại giao, người rất nổi tiếng hoặc thượng lưu tầng cao';
    if (x[2] === 'friend' && !(E.ELITE148 && E.ELITE148.contacts(l, function (p) { return (p.tier || 0) >= 3; }).length)) return 'Cần quen người trong giới thượng lưu tầng cao';
    if (x[1] && l.money < l.base * x[1] * 1.2) return 'Chưa đủ tiền vé và chi phí';
    if (c !== cc(l) && !(l.flags.id919 || E.GLOBAL919)) return 'Cần giấy tờ đi lại hợp lệ';
    return true;
  }
  function eligible(l, h) { return h.members.filter(function (m) { return m.alive && !m.player && !m.spouse && age(l, m) >= 21 && age(l, m) <= 45; }); }
  function runEv(l, k, c, r, log) {
    var s = st(l), h = house(l, c), x = EV[k]; if (evWhy(l, k, c) !== true) return;
    s.evN = s.evN || {}; s.evN[yr(l)] = (s.evN[yr(l)] || 0) + 1; if (x[1]) H.cash(l, -l.base * x[1], x[0]); if (c !== cc(l)) H.cash(l, -l.base * 0.04, 'Đi lại tới ' + cname(c));
    s.met[c] = true;
    var pool0 = eligible(l, h), chance = (k === 'reception' ? 0.35 : k === 'intro' ? 0.4 : 0.12) * (x[2] === 'ticket' ? 0.8 : 1);
    if (!pool0.length || r() > chance) { log(x[0] + ' tại ' + cname(c) + ': bạn gặp nhiều người trong giới, nhưng không có dịp trò chuyện riêng với thành viên hoàng gia. Mua vé không đồng nghĩa được gặp riêng.', 'neutral'); return; }
    var m = pool0[Math.floor(r() * pool0.length)], rel = s.rel = s.rel || {}, q = rel[m.id] || (rel[m.id] = { cc: c, stage: 'met', trust: 10, at: yr(l) });
    q.trust = Math.min(100, q.trust + 5); log(x[0] + ' tại ' + cname(c) + ': bạn được giới thiệu với ' + mainTitle(m) + ' ' + m.name + ' (' + h.name + ', nhân vật hư cấu). Hai người trò chuyện ngắn.', 'good');
  }
  function monCountries(l) { var out = [cc(l)].filter(function (c) { return MON[c]; }); if (tier(l) >= 3 || (l.fame || 0) >= 1e6) ['GB', 'NL', 'SE', 'JP', 'ES'].forEach(function (c) { if (out.indexOf(c) < 0 && MON[c]) out.push(c); }); return out; }
  X.menu('royalCircle920', 'Dạ tiệc, gala và giới hoàng gia', function (l) { var a = X.reason(l, 18); if (a !== true) return a; return monCountries(l).length || Object.keys(st(l).rel || {}).length ? true : 'Cần sống ở nước quân chủ, hoặc thuộc giới thượng lưu/nổi tiếng được mời ra nước ngoài'; }, function (l) {
    return 'Các thành viên hoàng gia trong trò chơi là nhân vật hư cấu. Có thể không được mời; vé gala không mua được quyền gặp riêng. Quan hệ phát triển chậm, người kia có quyền từ chối.' + Object.keys(st(l).rel || {}).map(function (id) { var q = st(l).rel[id], h = house(l, q.cc), m = byId(h, id); return m ? '\n• ' + m.name + ' (' + mainTitle(m) + ', ' + cname(q.cc) + ') — ' + STAGE[q.stage] + ', tin cậy ' + Math.round(q.trust) : ''; }).join('');
  }, function (l) {
    var out = [];
    monCountries(l).forEach(function (c) { Object.keys(EV).forEach(function (k) { out.push({ k: k + ':' + c, l: EV[k][0] + ' · ' + cname(c), h: EV[k][1] ? '~' + mo(l, l.base * EV[k][1]) : '', why: evWhy(l, k, c), run: function (l, r, log) { runEv(l, k, c, r, log); } }); }); });
    Object.keys(st(l).rel || {}).forEach(function (id) { var q = st(l).rel[id], m = byId(house(l, q.cc), id); if (m && m.alive && q.stage !== 'married') out.push({ k: 'p:' + id, l: 'Gặp lại ' + m.name, run: function (l, r) { X.next(l, 'royalPerson920', r, { id: id }); } }); });
    return out;
  }, 18, 'Tình cảm & gia đình');

  // ================= tiến triển tình cảm =================
  var STAGE = { met: 'mới quen', trust: 'tin cậy', invite: 'được mời gặp riêng', dating: 'đang hẹn hò', family: 'đã ra mắt gia đình', engaged: 'đã đính hôn', approval: 'chờ chấp thuận', married: 'đã kết hôn', friend: 'giữ là bạn', ended: 'đã dừng' };
  var NEXT = { met: 'trust', trust: 'invite', invite: 'dating', dating: 'family', family: 'engaged', engaged: 'approval', approval: 'married' };
  function fit(l, m) { var t = l.flags.traits || ''; return U.clamp(0.25 + m.warmth / 250 + m.open / 300 + (l.karma || 0) / 400 + (l.st.soc - 50) / 300 + u(l.id + ':fit920:' + m.id) * 0.25, 0.05, 0.9); }
  function close(l, m) { var s = st(l); if (l.flags.royal && l.flags.royal.c === (s.rel[m.id] || {}).cc) return 'Cùng hoàng tộc — không phù hợp'; return null; }
  function stepWhy(l, q, m) {
    if (!m.alive) return 'Người này không còn'; if (q.stepAt === yr(l)) return 'Đã gặp năm nay'; if (q.stage === 'ended' || q.stage === 'married') return 'Không áp dụng';
    if (close(l, m)) return close(l, m);
    if ((q.stage === 'invite' || q.stage === 'trust') && NEXT[q.stage] === 'dating' && l.partner && l.partner.alive !== false) return 'Bạn đang có người yêu/bạn đời';
    if (q.stage === 'invite' && l.partner && l.partner.alive !== false) return 'Bạn đang có người yêu/bạn đời';
    if (l.age < 21 || age(l, m) < 21) return 'Cả hai cần trưởng thành';
    return true;
  }
  function step(l, id, r, log) {
    var q = st(l).rel[id], h = house(l, q.cc), m = byId(h, id), R = rule(q.cc); if (stepWhy(l, q, m) !== true) return;
    q.stepAt = yr(l); var f = fit(l, m), want = NEXT[q.stage], x = u(l.id + ':step:' + id + ':' + yr(l));
    if (q.stage === 'approval') {
      var line = lineOf(l, h, m), need = E.ROYAL837?E.ROYAL837.consentNeeded(l,h,m):line != null && line <= R.consentN;
      if (!need || x < 0.75) { if(E.ROYAL837)E.ROYAL837.approve(l,h,m,q); wed(l, h, m, log); return; }
      q.stage = 'engaged'; log('Việc chấp thuận hôn nhân (' + R.consent + ') được hoãn để xem xét thêm. Hai người vẫn đính hôn.', 'neutral'); return;
    }
    if (q.stage === 'met' || q.stage === 'trust') q.trust = Math.min(100, q.trust + 8 + f * 10);
    var need2 = { trust: 25, invite: 45, dating: 55, family: 65, engaged: 75 }[want] || 0;
    if (q.trust < need2 || x > f) {
      if (x > 0.93 && q.stage !== 'met') { q.stage = 'friend'; log(m.name + ' nói thật lòng chỉ muốn giữ tình bạn. Bạn tôn trọng điều đó.', 'neutral'); return; }
      log(m.name + ' bận lịch công vụ; hai người giữ liên lạc nhưng chưa tiến thêm.', 'neutral'); return;
    }
    q.stage = want; q.trust = Math.min(100, q.trust + 5);
    log({ trust: 'Bạn và ' + m.name + ' trò chuyện lâu hơn ở các sự kiện; dần tin tưởng nhau.', invite: m.name + ' mời bạn một buổi gặp riêng, kín đáo khỏi báo chí.', dating: 'Bạn và ' + m.name + ' bắt đầu hẹn hò. Văn phòng hoàng gia đề nghị giữ kín đời tư.', family: 'Bạn được mời ra mắt gia đình ' + m.name + '. ' + (byId(h, h.seat) ? byId(h, h.seat).name + ' tiếp đón lịch sự.' : ''), engaged: m.name + ' và bạn đính hôn.', approval: 'Hồ sơ hôn nhân được trình theo quy định: ' + R.consent + '.' }[want], 'good');
    if (want === 'engaged') q.stage = 'approval'; // bước chấp thuận luôn được xét; chỉ người trong phạm vi luật mới có thể bị hoãn
  }
  function wed(l, h, m, log) {
    var q = st(l).rel[m.id], R = rule(h.cc); if(E.ROYAL837&&!E.ROYAL837.weddingAllowed(l,h,m,q))return false; q.stage = 'married'; m.spouse = 'player';
    l.partner = { name: m.name, sex: m.sex, age: age(l, m), status: 'married', since: l.age, alive: true, job: 'thành viên hoàng gia (' + h.name + ')', jobId: null, inc: 0, incKnown: true, royal920: { cc: h.cc, id: m.id }, homeCountry: h.cc };
    var me = byId(h,'player') || { id: 'player', name: l.name, sex: l.sex, by: l.birthYear, alive: true, player: true, titles: [] }; me.spouse=m.id;me.role='spouse';
    if (R.femaleLeaves && m.sex === 'F') { m.removed = 'rời hoàng tộc khi kết hôn'; (m.titles || []).forEach(function (t) { t.lost = 'kết hôn với thường dân theo luật hoàng thất'; }); log('Theo luật hoàng thất, ' + m.name + ' rời hoàng tộc khi kết hôn; hai bạn sống như thường dân.', 'neutral'); }
    else if (h.cc === 'GB') { if (m.sex === 'M') grant(me, 'prince', 'courtesy', false, 'vợ của hoàng tử — dùng danh xưng theo chồng', yr(l)); else log('Kết hôn với công chúa không tự cho chồng tước hiệu; nhà vua có thể phong hoặc không.', 'neutral'); }
    if(!byId(h,'player'))h.members.push(me); if(E.ROYAL837)E.ROYAL837.wedding(l,h,m,me,log); st(l).spouse = { cc: h.cc, id: m.id, role: null };
    log('Đám cưới của bạn và ' + m.name + ' (' + h.name + ', nhân vật hư cấu). Tước hiệu, danh xưng và vai trò công vụ là các quyết định riêng.', 'big'); H.mem(l, 'Ngày cưới ' + m.name + '.', 8);
    X.next(l, 'royalRole920', function () { return 0.5; }, {}, { manual: false });
  }
  X.menu('royalPerson920', 'Gặp gỡ thành viên hoàng gia', function (l) { return X.reason(l, 18); }, function (l, d) {
    var id = d && d.arg && d.arg.id, q = id && st(l).rel && st(l).rel[id], m = q && byId(house(l, q.cc), id);
    if (!m) return 'Không còn liên lạc.'; var h = house(l, q.cc), ln = lineOf(l, h, m);
    return m.name + ' · ' + mainTitle(m) + ' · ' + age(l, m) + ' tuổi · ' + h.name + ' (' + cname(q.cc) + ', hư cấu) · ' + (ln ? 'thứ ' + ln + ' trong hàng kế vị' : 'ngoài hàng kế vị') + '\nQuan hệ: ' + STAGE[q.stage] + ', tin cậy ' + Math.round(q.trust) + '/100. Tính cách: ' + (m.warmth > 60 ? 'ấm áp' : 'kín đáo') + ', ' + (m.open > 55 ? 'cởi mở với người ngoài hoàng tộc' : 'thận trọng') + '. Quy định hôn nhân: ' + rule(q.cc).consent + '.';
  }, function (l, arg) {
    var id = arg && arg.id, q = id && st(l).rel && st(l).rel[id], m = q && byId(house(l, q.cc), id); if (!m) return [];
    var out = [{ k: 'step', l: { met: 'Trò chuyện thêm ở sự kiện sau', trust: 'Giữ liên lạc, chia sẻ quan tâm chung', invite: 'Nhận lời gặp riêng', dating: 'Hẹn hò kín đáo', family: 'Gặp gỡ gia đình', engaged: 'Chuẩn bị đám cưới', approval: 'Chờ quyết định chấp thuận' }[q.stage] || 'Gặp lại', why: stepWhy(l, q, m), run: function (l, r, log) { step(l, id, r, log); } }];
    if (q.stage !== 'met' && q.stage !== 'friend' && q.stage !== 'ended') out.push({ k: 'slow', l: 'Đề nghị chậm lại / giữ là bạn', run: function (l, r, log) { q.stage = 'friend'; log('Bạn đề nghị giữ tình bạn với ' + m.name + '.', 'neutral'); } });
    return out;
  });

  // ================= vai trò, công vụ, ngân sách =================
  function role(l) { if(E.ROYAL858){var override=E.ROYAL858.roleOverride(l);if(override)return override;}var s = st(l); return s.spouse && s.spouse.role || (l.flags.royal && !l.flags.royal.quit ? (l.flags.royal.role920 || 'working') : null); }
  function isRoyal(l) { return !!(st(l).spouse && l.partner && l.partner.royal920 || l.flags.royal && !l.flags.royal.quit); }
  X.menu('royalRole920', 'Vai trò trong hoàng gia', function (l) { var a = X.reason(l, 18); return a !== true ? a : isRoyal(l) ? true : 'Dành cho thành viên/phối ngẫu hoàng gia'; }, function(l){kidsYear(l,function(){});return 'Vai trò công vụ và tước vị là hai việc riêng. Working royal nhận nhiệm vụ công, có ngân sách công vụ; non-working giữ đời sống riêng, có thể thương lượng lại.'+(l.kids||[]).filter(function(k){return k.royal920;}).map(function(k){var h=house(l,k.royal920.cc),m=byId(h,k.royal920.id),pos=m&&lineOf(l,h,m);return m?'\n• '+k.name+': '+mainTitle(m)+(pos?' · thứ '+pos+' trong hàng kế vị':' · ngoài hàng kế vị'):'';}).join('');}, function (l) {
    return [['working', 'Nhận vai trò công vụ (working royal)'], ['nonworking', 'Không nhận công vụ, giữ nghề/đời sống riêng'], ['stepback', 'Rút khỏi nhiệm vụ hoàng gia']].map(function (x) { return { k: x[0], l: x[1], why: role(l) === x[0] ? 'Đang áp dụng' : true, run: function (l, r, log) { var s = st(l); if (s.spouse) s.spouse.role = x[0]; else if (l.flags.royal) l.flags.royal.role920 = x[0]; log({ working: 'Bạn nhận vai trò công vụ; lịch nhiệm vụ do văn phòng hoàng gia điều phối.', nonworking: 'Bạn không nhận công vụ; văn phòng ghi nhận, không cấp ngân sách công vụ cho bạn.', stepback: 'Bạn rút khỏi nhiệm vụ. Ngân sách công vụ dừng; tài sản riêng giữ nguyên. Việc dùng danh xưng/tước hiệu là quyết định riêng, không tự mất.' }[x[0]], 'neutral'); } }; });
  },18,'Đời sống');
  var DUTY = { ceremony: ['Dự lễ quốc gia / tưởng niệm', 0.15, 3], visit: ['Thăm trường, bệnh viện, cộng đồng', 0.1, 4], patron: ['Hoạt động bảo trợ từ thiện', 0.12, 4], diplo: ['Tiếp đoàn ngoại giao / chuyến thăm cấp nhà nước', 0.4, 5] };
  function ledger(l) { var s = st(l), y = yr(l), b = s.budget; if (!b || b.y !== y) { if (b && b.left > 0) s.ledger.push({ y: b.y, t: 'hoàn lại phần chưa chi', v: -b.left }); var amt = role(l) === 'working' ? l.base * (l.flags.royal && l.flags.royal.reign ? 10 : 2) : 0; s.budget = b = { y: y, grant: amt, left: amt, spent: 0 }; if (amt) s.ledger.push({ y: y, t: 'cấp ngân sách công vụ (giả lập)', v: amt }); if (s.ledger.length > 40) s.ledger = s.ledger.slice(-40); } return b; }
  X.menu('royalDuty920', 'Công vụ hoàng gia và ngân sách công vụ', function (l) { var a = X.reason(l, 18); if (a !== true) return a; return isRoyal(l) && role(l) === 'working' ? true : 'Dành cho thành viên hoàng gia đang nhận công vụ'; }, function (l) {
    var b = ledger(l), s = st(l); return 'Ngân sách công vụ năm nay: cấp ' + mo(l, b.grant) + ', đã chi ' + mo(l, b.spent) + ', còn ' + mo(l, b.left) + '. Đây là tiền công (mức giả lập), chỉ dùng cho nhiệm vụ; phần chưa chi hoàn lại cuối năm, không vào tài sản riêng hay thừa kế, không trả theo số tước hiệu. Tín nhiệm công chúng: ' + Math.round(s.cred == null ? 60 : s.cred) + '/100.';
  }, function (l) {
    var b = ledger(l), s = st(l);
    return Object.keys(DUTY).map(function (k) { var c = l.base * DUTY[k][1]; return { k: k, l: DUTY[k][0], h: 'Chi công vụ ~' + mo(l, c), why: E.ROYAL837&&E.ROYAL837.dutyReason(l,k)!==true?E.ROYAL837.dutyReason(l,k):(s.duty || {})[k] === yr(l) ? 'Đã thực hiện năm nay' : b.left < c ? 'Vượt ngân sách công vụ đã duyệt' : true, run: function (l, r, log) { if (b.left < c||E.ROYAL837&&E.ROYAL837.dutyReason(l,k)!==true) return; s.duty = s.duty || {}; s.duty[k] = yr(l); b.left -= c; b.spent += c; s.ledger.push({ y: yr(l), t: DUTY[k][0], v: -c }); var good = r() < 0.75; s.cred = U.clamp((s.cred == null ? 60 : s.cred) + (good ? DUTY[k][2] : -2), 0, 100); H.fx(l, { soc: 1 }); log(DUTY[k][0] + (good ? ': được đón nhận tốt.' : ': một vài sơ suất trong lịch trình bị báo chí nhắc tới.'), good ? 'good' : 'neutral'); } }; });
  }, 18, 'Đời sống');

  // ================= con, kế vị, tin đồn =================
  function kidsYear(l, log) {
    var s = st(l),born=l.flags.royal&&!l.flags.royal.quit?l.flags.royal:null;if (!s.spouse&&!born) return; var h = house(l, s.spouse?s.spouse.cc:born.c), m = h && byId(h, s.spouse?s.spouse.id:'player'); if (!m) return;
    (l.kids || []).forEach(function (k) {
      if (k.royal920) { var existing=byId(h,k.royal920.id); if(existing){existing.alive=k.alive!==false;repairChildTitle(l,h,m,existing,k);return;} if(k.royal920.cc!==h.cc)return; }
      if (s.spouse&&k.born < (l.partner && l.partner.since || 0)) return; var id = k.royal920&&k.royal920.id || h.cc + ':kid920:' + X.uid(l, k);
      var me = { id: id, name: k.name, sex: k.sex, by: l.birthYear + k.born, alive: k.alive !== false, titles: [], parent: m.removed ? null : m.id, role: 'grandchild', working: false, playerKid: true };
      if (k.adopted || k.adopt) { me.adopted920 = true; }
      var titled = !m.removed && (h.cc !== 'GB' || m.sex === 'M' || h.seat===m.id) && !me.adopted920;
      if(k.royal920&&k.royal920.titled&&!m.removed&&!me.adopted920)titled=true;
      if (titled) grant(me, 'prince', 'substantive', false, 'con của ' + m.name, me.by);
      if(E.ROYAL837)E.ROYAL837.child(l,h,m,me,k); h.members.push(me); k.royal920 = { cc: h.cc, id: id, titled: titled };
      if(E.ROYAL858&&E.ROYAL858.supported(h)){E.ROYAL858.sync(l,h,'sinh con');titled=k.royal920.titled;}
      var ln = lineOf(l, h, me);
      log(k.name + (titled ? ' mang tước ' + mainTitle(me) : ' không tự có tước hiệu (theo quy định của ' + cname(h.cc) + ')') + (ln ? '; đứng thứ ' + ln + ' trong hàng kế vị.' : me.adopted920 ? '; con nuôi không vào hàng kế vị theo quy định hiện hành của nhà này.' : '.'), 'neutral');
    });
    (l.kids || []).forEach(function (k) { if (k.royal920 && k.alive === false) { var x = byId(h, k.royal920.id); if (x) x.alive = false; } });
  }
  function repairChildTitle(l,h,parent,m,k) {
    if(E.ROYAL858&&E.ROYAL858.supported(h)){E.ROYAL858.bind(l,h);var entitlement=E.ROYAL858.identity(l,h,m).titles.find(function(t){return ['prince','infante','asturias'].includes(t.key);});if(entitlement&&entitlement.key==='prince'&&!(m.titles||[]).some(function(t){return t.key==='prince';}))grant(m,'prince','entitlement',false,'đối chiếu '+entitlement.ruleId,yr(l),{verified858:true,rule858:entitlement.ruleId,label858:entitlement.label,source858:entitlement.source,scenario858:entitlement.scenario});k.royal920.titled=!!entitlement;return;}
    // Preserve explicit losses; repair missing grants only when the existing family relation qualifies.
    var qualifies=!parent.removed&&!m.removed&&!m.adopted920&&(h.cc!=='GB'||parent.sex==='M'||h.seat===parent.id);
    if(qualifies&&!(m.titles||[]).some(function(t){return t.key==='prince';}))grant(m,'prince','substantive',false,'đối chiếu quan hệ cha mẹ trong gia tộc',m.by);
    k.royal920.titled=(m.titles||[]).some(function(t){return t.key==='prince'&&!t.lost;});
  }
  function remapTree(value,ids) {
    if(typeof value==='string')return Object.prototype.hasOwnProperty.call(ids,value)?ids[value]:value;
    if(Array.isArray(value))return value.map(function(v){return remapTree(v,ids);});
    if(value&&typeof value==='object'){var out={};Object.keys(value).forEach(function(k){out[Object.prototype.hasOwnProperty.call(ids,k)?ids[k]:k]=remapTree(value[k],ids);});return out;}return value;
  }
  function snapshot(l,k) {
    if(!l.flags.royal920&&!l.flags.royal)return null;
    if(E.ROYAL837&&l.flags.royal)E.ROYAL837.context(l);
    kidsYear(l,function(){});var ref=k.royal920,s=st(l),h=ref&&s.houses[ref.cc],m=h&&byId(h,ref.id);if(!m)return null;
    var old=byId(h,'player');if(old)old.alive=l.alive;
    return JSON.parse(JSON.stringify({cc:ref.cc,id:ref.id,at:yr(l),parentId:l.id,houses:s.houses,people:s.people837||{},met:s.met||{},dynasty860:s.dynasty860?{v:1,reserve:s.dynasty860.reserve,ledger:s.dynasty860.ledger,seen:{},openness:65,pressure:15,influence:30}:null,religion:k.religion||m.religion837}));
  }
  function restore(l,data) {
    if(!data||!data.houses||!data.houses[data.cc])return false;
    var ids={player:data.cc+':ancestor920:'+data.parentId};ids[data.id]='player';var houses=remapTree(data.houses,ids),h=houses[data.cc],me=byId(h,'player');if(!me)return false;
    Object.keys(houses).forEach(function(c){houses[c].members.forEach(function(m){m.player=m===me;m.playerKid=false;});});
    me.name=l.name;me.sex=l.sex;me.by=l.birthYear;me.alive=l.alive;
    l.flags.royal920={v:1,houses:houses,people837:remapTree(data.people||{},ids),met:JSON.parse(JSON.stringify(data.met||{})),ledger:[],rel:{},inheritedAt843:data.at};
    if(data.dynasty860)l.flags.royal920.dynasty860=JSON.parse(JSON.stringify(data.dynasty860));
    l.flags.royal={c:data.cc,house:h.name,tier:(me.titles||[]).some(function(t){return t.key==='prince'&&!t.lost;})?'direct':'branch',reign:h.seat==='player',role920:me.working?'working':'nonworking'};
    if(me.removed)l.flags.royal.quit=true;
    if(data.religion)l.religion=data.religion;
    (l.sibList||[]).forEach(function(sib){var members=h.members.filter(function(m){return m.parent===me.parent&&m.id!==me.id&&m.name===(sib.name||sib.n)&&m.sex===sib.sex;});if(members.length===1)sib.royal920={cc:h.cc,id:members[0].id,titled:(members[0].titles||[]).some(function(t){return !t.lost;})};});
    return true;
  }
  var childRoyal=E.childOpts;E.childOpts=function(l,k){var o=childRoyal.apply(this,arguments),data=snapshot(l,k);if(data)o.parent.royalRegistry843=data;return o;};
  var handoff843=false,heirRoyal=E.heirAtAge;E.heirAtAge=function(l,k){var before=handoff843,data=snapshot(l,k),child;handoff843=true;try{child=heirRoyal.apply(this,arguments);}finally{handoff843=before;}if(child&&data){restore(child,data);if(E.ROYAL837)E.ROYAL837.prepare(child,st(child).houses[data.cc],false);}return child;};
  // tin đồn: tách cáo buộc khỏi chứng cứ; không tự mất ngai/tước
  function rumorYear(l, r, log) {
    var s = st(l); if (!isRoyal(l) || s.rumorAt != null && yr(l) - s.rumorAt < 8 || u(l.id + ':rumor:' + yr(l)) > 0.03) return;
    s.rumorAt = yr(l); X.next(l, 'royalRumor920', r, {}, { manual: false });
  }
  E.SC('royalRumor920', { title: 'Tin đồn trên báo lá cải', prep: function (l) { return { at: l.age }; }, valid: function (l, d) { return isRoyal(l) && d && d.at === l.age; },
    text: 'Một tờ báo đăng tin đồn về đời tư của bạn, không kèm chứng cứ. Văn phòng hoàng gia hỏi bạn muốn phản hồi thế nào. Tin đồn không tự làm mất tước hiệu hay vị trí.',
    opts: [{ k: 'deny', l: 'Ra thông cáo ngắn, bác bỏ thông tin sai', run: function (l, r, log) { var s = st(l); s.cred = U.clamp((s.cred == null ? 60 : s.cred) - 1, 0, 100); log('Thông cáo được đăng; tin đồn lắng xuống sau vài tuần.', 'neutral'); } },
      { k: 'silent', l: 'Im lặng, để luật sư xem xét', run: function (l, r, log) { var s = st(l); s.cred = U.clamp((s.cred == null ? 60 : s.cred) - 3, 0, 100); log('Bạn không bình luận; báo chí đồn đoán thêm một thời gian.', 'neutral'); } },
      { k: 'talk', l: 'Nói chuyện thẳng thắn với bạn đời trước', run: function (l, r, log) { if (l.partner) l.partner.close = U.clamp((l.partner.close || 60) + 2, 0, 100); log('Hai người nói chuyện trước khi trả lời báo chí; bạn đời đứng về phía bạn.', 'good'); } }] });

  // ================= tích hợp life84 (sinh ra trong hoàng tộc) =================
  // Trước đây: mọi thành viên ≥18 tuổi nhận "ngân sách hoàng gia" vào tiền riêng (người trị vì 12 lần mức cơ sở/năm). Nay tách:
  // thu nhập riêng từ quỹ/tài sản gia tộc (tham số) và ngân sách công vụ vào sổ riêng chỉ khi nhận công vụ.
  function stipend(l, x, amt, log) {
    var personal = l.base * (x.reign ? 2 : x.tier === 'direct' ? (role(l) === 'nonworking' || role(l) === 'stepback' ? 0.5 : 1.2) : 0.6);
    H.cash(l, personal, x.reign ? 'Thu nhập riêng từ tài sản gia tộc/quỹ của người trị vì (giả lập)' : 'Trợ cấp từ quỹ gia tộc (giả lập)');
    ledger(l); return personal;
  }
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !['vn', 'world'].includes(l.mode)) return;
    var s = l.flags.royal920; if (!s) return;
    Object.keys(s.houses).forEach(function (c) { houseYear(l, s.houses[c], log); });
    kidsYear(l, log); rumorYear(l, r, log);
    var p = l.partner; if (s.spouse && !(p && p.royal920)) { s.spouse = null; }
  });
  // người sinh ra trong hoàng tộc tự có registry nhà mình (không bịa cho bản lưu cũ khác)
  var cl0 = E.createLife; E.createLife = function (opts) { var l = cl0.apply(this, arguments); if(opts&&opts.parent&&opts.parent.royalRegistry843&&!handoff843){restore(l,opts.parent.royalRegistry843);return l;} if (l && l.flags && l.flags.royal && MON[l.country]) { var h = house(l, l.country), me = { id: 'player', name: l.name, sex: l.sex, by: l.birthYear, alive: true, player: true, titles: [], parent: h.seat, role: 'child' }; if (l.flags.royal.tier === 'direct') grant(me, 'prince', 'substantive', false, 'sinh ra trong nhánh chính', l.birthYear); h.members.push(me); } return l; };
  E.ROYAL920 = { snapshot:snapshot,restore:restore,RULES: RULES, rule: rule, TITLES: TITLES, tname: tname, grant: grant, mainTitle: mainTitle, house: house, order: order, lineOf: lineOf, succeed: succeed, eligible: eligible, runEv: runEv, step: step, wed: wed, role: role, ledger: ledger, stipend: stipend, kidsYear: kidsYear, st: st, byId: byId, EV: EV, evWhy: evWhy };
})(globalThis.G);
