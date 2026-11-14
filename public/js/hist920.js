/* Một Đời — 9.3 (giai đoạn 3–5 bối cảnh lịch sử): biến cố lịch sử có hậu quả nhiều giai đoạn, theo nước, năm, nơi ở và hoàn cảnh cá nhân.
   Mở rộng E.ERA920 (era920.js); dùng các hệ thống có sẵn: H.fx/H.cash/H.mem/H.kill/H.moveToCity/H.emigrate, nghĩa vụ quân sự (flags.military), mất việc (l.job, flags.needJob),
   bệnh mạn tính (flags.chronic), cha mẹ qua đời (fam.fAlive), cảnh lựa chọn E.SC + E.UPDATE110.next. Không thêm hệ thống tiền, sức khỏe hay gia đình riêng.
   · Mỗi biến cố (EP) có: khoảng năm, phạm vi (nước, vùng, tuổi, giới, nghề, tài chính), xác suất bị ảnh hưởng, kết quả theo mức độ, và có thể mở một "việc dang dở" (open) kéo sang các năm sau:
     chấn thương tâm lý (trauma), di dời (displaced), khó khăn kinh tế (hardship), bị gán thành phần (classLabel). Việc dang dở có thể khép lại, nhẹ đi hoặc kéo dài tùy tiền, sức khỏe, gia đình, việc làm; không tự biến mất ngay.
   · Lựa chọn quan trọng (nhập ngũ hay hoãn, ở lại hay đi, vượt biên) là cảnh E.SC 'hist920_choice'; lựa chọn được ghi vào l.flags.hist920 và ảnh hưởng các biến cố sau (phía nào của Việt Nam, đã nhập ngũ, đã tị nạn).
   · Quyết định ngẫu nhiên băm theo mã đời + năm + nhãn (tải lại bản lưu không đổi kết quả, không phụ thuộc số lần rút ngẫu nhiên nơi khác). Chỉ áp cho đời có số liệu theo năm (E.ERA920) và năm thế giới đến 2023.
   · KHÔNG gán tính cách tốt/xấu theo giàu nghèo, tôn giáo hay dân tộc. Dân tộc, nghề cha mẹ, tầng lớp gia đình chỉ xuất hiện khi chính biến cố lịch sử có tiêu chí đó (ghi rõ trong mô tả biến cố); mọi xác suất là tham số trò chơi, không phải thống kê.
   · Mức kiểm chứng (ver: 'secondary'): ngày tháng và sự kiện đã đối chiếu ngày 15/11/2026 với bách khoa trực tuyến và kết quả tìm kiếm web (nguồn THỨ CẤP); CHƯA đọc văn bản gốc hay nghiên cứu học thuật. Số liệu thương vong và tỷ lệ là tham số trò chơi. Xem docs/ERA-DOI-CHIEU-NGUON-940.md. */
(function (G) {
  'use strict';
  var E = G.E, H = E && E.H, U = G.U, W = G.W, X = E && E.ERA920; if (!X || !E.SC || !E.UPDATE110) return;
  var EP = [], BY = {};
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; h = Math.imul(h, 3266489909); h ^= h >>> 16; return h >>> 0; }
  function u(l, tag) { return hash((l.id || '') + ':h920:' + tag) / 4294967296; }
  function wy(l) { return l.birthYear + l.age; }
  function st(l) { var s = l.flags.hist920; if (!s || typeof s !== 'object') s = l.flags.hist920 = { seen: {}, open: [], did: {} }; if (!s.seen) s.seen = {}; if (!Array.isArray(s.open)) s.open = []; if (!s.did) s.did = {}; return s; }
  function res(l) { return (l.abroad && l.abroad.perm && l.abroad.code) || l.country; }
  function inVN(l) { return l.country === 'VN' && res(l) === 'VN'; }
  function male(l) { return l.sex === 'M'; }
  function money(l, v) { return H.money(l, v); }
  function jobCat(l) { var d = l.job && E.jobDef ? E.jobDef(l) : null; return d ? d.cat : null; }
  function kidsHome(l) { return (l.kids || []).filter(function (k) { return k.alive && k.age < 18; }).length; }
  function circ(l) { return { age: l.age, male: male(l), urban: !!l.urban, q: (l.fam && l.fam.q) || 3, kids: kidsHome(l), cat: jobCat(l), student: !!l.school, partner: !!(l.partner && l.partner.status !== 'dating') }; }
  // ---- phía nào của Việt Nam (vĩ tuyến 17, 1954–1975): theo tỉnh sinh ra, đổi khi nhân vật đã chọn đi sang phía kia ----
  var NORTH_BTB = /^(Thanh Hóa|Nghệ An|Hà Tĩnh|Quảng Bình)$/;
  function vnSide(l) {
    var s = st(l); if (s.side) return s.side; var p = l.prov; if (!p) return 'south';
    if (p.region === 'DBSH' || p.region === 'MNPB' || (p.region === 'BTB' && NORTH_BTB.test(p.old || ''))) return 'north';
    if (p.old === 'Quảng Trị') return 'dmz'; return 'south';
  }
  // ---- việc dang dở ----
  var OPEN = {
    trauma: { drag: function (l, o) { l.st.hap -= o.lvl * 1.2; }, ease: function (l, o, c) { return 0.22 + (c.partner ? 0.06 : 0) + (l.st.soc > 60 ? 0.06 : 0) + (l.st.hea > 70 ? 0.04 : 0) + (l.money > l.base ? 0.04 : 0) - (o.lvl >= 3 ? 0.06 : 0); },
      done: 'Nỗi ám ảnh sau những năm biến động dần nguôi; bạn sống nhẹ lòng hơn.', step: 'Ký ức về những năm đó vẫn thỉnh thoảng trở lại, nhưng bớt nặng hơn trước.' },
    displaced: { drag: function (l, o) { l.st.soc -= 1; H.cash(l, -0.03 * l.base, 'Chi phí ổn định chỗ ở mới'); }, ease: function (l, o, c) { return 0.2 + (l.money > l.base * 2 ? 0.14 : 0) + (c.partner ? 0.06 : 0) + (l.job ? 0.1 : 0) + Math.min(0.2, o.n * 0.04); },
      done: 'Sau nhiều năm sống tạm, gia đình bạn cuối cùng cũng có chỗ ở ổn định.', stuck: 'Nơi ở mới đã thành nhà; bạn thôi nghĩ đến chuyện quay về.' },
    hardship: { drag: function (l, o) { H.cash(l, -0.04 * o.lvl * l.base, 'Kinh tế khó khăn sau biến cố'); l.st.hap -= 0.6 * o.lvl; }, ease: function (l, o, c) { return 0.24 + (l.job ? 0.12 : 0) + (c.partner ? 0.04 : 0) + (l.money > l.base ? 0.08 : 0); },
      done: 'Kinh tế gia đình dần khá lên, bữa ăn không còn là nỗi lo thường trực.', step: 'Cuộc sống bớt túng thiếu hơn so với những năm trước.' },
    classLabel: { drag: function (l) { l.st.soc -= 1.5; l.st.hap -= 0.8; }, ease: function () { return 0.12; }, done: 'Cái nhãn thành phần năm xưa không còn được nhắc tới, mối quan hệ ngoài làng xóm dần trở lại.', step: 'Cái nhãn thành phần vẫn như một bóng đen, nhưng người ta ít nhắc hơn.' }
  };
  function open(l, k, lvl, extra) {
    var s = st(l), ex = s.open.filter(function (o) { return o.k === k; })[0];
    if (ex) { ex.lvl = Math.min(3, Math.max(ex.lvl, lvl || 1)); return ex; }
    var o = { k: k, lvl: lvl || 1, y0: wy(l), n: 0, fresh: 1 }; if (extra) for (var p in extra) o[p] = extra[p];
    s.open.push(o); return o;
  }
  function processOpen(l, log) {
    var s = st(l), c = circ(l), keep = [];
    s.open.forEach(function (o) {
      var D = OPEN[o.k]; if (!D) return;
      if (o.fresh) { delete o.fresh; keep.push(o); return; } // việc vừa mở trong năm nay chưa kịp lành: năm sau mới bắt đầu tính
      o.n++;
      D.drag(l, o);
      if (o.k === 'classLabel' && wy(l) >= 1956 && !o.corrected) { // sửa sai: nhiều hồ sơ được xem lại, không phải tất cả
        o.corrected = true; if (u(l, 'sai:' + o.y0) < 0.6) { H.fx(l, { soc: 5, hap: 3, money: 0.15 }); log('Đợt sửa sai năm 1956: hồ sơ gia đình bạn được xem lại, một phần ruộng đất và danh dự được trả.', 'good'); H.mem(l, 'Năm 1956 gia đình được sửa sai, nhưng những gì đã mất không lấy lại hết được.', 3); return; }
        log('Đợt sửa sai năm 1956 chưa xem tới hồ sơ gia đình bạn; nhãn thành phần còn đó.', 'neutral');
      }
      if (u(l, 'ease:' + o.k + ':' + o.y0 + ':' + o.n) < D.ease(l, o, c)) {
        if (o.lvl > 1) { o.lvl--; if (D.step) log(D.step, 'neutral'); keep.push(o); return; }
        log(D.done, 'good'); return;
      }
      if (o.k === 'displaced' && o.n >= 8) { log(D.stuck, 'neutral'); return; }
      if (o.n === 4) log('Chuyện sau biến cố năm ' + o.y0 + ' vẫn chưa yên: bạn vẫn đang gánh hậu quả.', 'neutral');
      keep.push(o);
    });
    s.open = keep;
  }
  // ---- hậu quả dùng chung ----
  function jobLoss(l, log, text) { if (!l.job) return false; l.lastJob = l.job; l.job = null; l.flags.needJob = true; log(text, 'bad'); return true; }
  function savings(l, f, log, text) { if (l.money > 0 && f > 0) { var lost = l.money * f; H.cash(l, -lost, 'Tiền tiết kiệm mất giá'); log(text + ' (mất khoảng ' + money(l, lost) + ').', 'bad'); return true; } return false; }
  function injure(l, log, text, big) { l.flags.chronic = Math.min(3, (l.flags.chronic || 0) + 1); H.fx(l, { hea: big ? -16 : -9 }); log(text, 'bad'); }
  function loseParent(l, log, text) {
    var f = l.fam; if (!f || l.age >= 40) return false; var side = f.fAlive && (!f.mAlive || u(l, 'par:' + wy(l)) < 0.8) ? 'f' : f.mAlive ? 'm' : null; if (!side) return false;
    if (side === 'f') f.fAlive = false; else f.mAlive = false;
    l.st.hap -= 14; log((side === 'f' ? 'Bố' : 'Mẹ') + ' ' + text, 'bad'); H.mem(l, (side === 'f' ? 'Bố' : 'Mẹ') + ' ' + text + ' Cả nhà không còn như xưa.', 5); return true;
  }
  function relocate(l, dest) { if (H.moveToCity && dest) H.moveToCity(l, dest); }
  function resettle(l, r, log, codes) {
    var tot = 0, i, c; for (i = 0; i < codes.length; i++) tot += codes[i][1]; var x = r() * tot;
    for (i = 0; i < codes.length; i++) { x -= codes[i][1]; if (x <= 0) break; } c = codes[Math.min(i, codes.length - 1)][0];
    var B = W.BY[c]; if (!B || !H.emigrate) return false; H.emigrate(l, [c, B.name, B.pool], r, log); st(l).refugee = { to: c, y: wy(l) }; return true;
  }
  function note(l, log, EPd, text, kind) { log(text, kind || 'neutral'); }
  // ---- cảnh lựa chọn chung ----
  E.SC('hist920_choice', {
    title: function (l, d) { return d.title; }, text: function (l, d) { return d.text; }, tone: 'dark',
    valid: function (l, d) { return !!(l.alive && d && BY[d.id]); },
    prep: function (l, r, d) { return d; },
    opts: ['a', 'b', 'c'].map(function (k) {
      return { k: k, req: function (l, d) { var o = d.ch && d.ch[k]; return !!(o && (!BY[d.id].req || BY[d.id].req(l, k, d))); },
        l: function (l, d) { return d.ch[k].l; }, h: function (l, d) { return d.ch[k].h || ''; },
        ai: function (l, d) { var f = BY[d.id].ai; return f ? f(l, k, d) : 1; },
        run: function (l, r, log, d) { BY[d.id].choose(l, k, r, log, d); st(l).did[d.id] = k; } };
    })
  });
  if (E.MAJOR) E.MAJOR.hist920_choice = 1; // lựa chọn lớn của đời người: hiện như quyết định quan trọng
  function ask(l, r, id, ch, extra) { var e = BY[id]; var d = { id: id, title: e.title, text: e.ask(l), ch: ch }; if (extra) for (var p in extra) d[p] = extra[p]; E.UPDATE110.next(l, 'hist920_choice', r, d, { manual: false }); }
  function add(e) { EP.push(e); BY[e.id] = e; return e; }
  var VNQ = [['US', 60], ['AU', 14], ['CA', 14], ['FR', 5], ['DE', 4], ['GB', 3]]; // nơi định cư (tham số trò chơi, theo thứ tự lớn nhỏ chung của các nước tiếp nhận)
  var WARTRAUMA = 0.35;

  // ======================= VIỆT NAM =======================
  add({ id: 'vn_indochina', title: 'Chiến tranh Đông Dương lần thứ nhất', from: 1950, to: 1953, ver: 'secondary',
    who: function (l) { return inVN(l) ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var w = (c.male && c.age >= 17 && c.age <= 38 ? 0.3 : 0.1) * (c.urban ? 0.7 : 1.15); if (u(l, 'ind:' + y) >= w) return;
      if (c.male && c.age >= 17 && c.age <= 38 && u(l, 'indm:' + y) < 0.5) { H.fx(l, { hea: -3, hap: -4, soc: -3, money: -0.1 }); log('Chiến sự lan tới vùng bạn sống. Bạn bị động viên đi dân công và tải lương thực cho đơn vị trong mùa khô.', 'bad'); open(l, 'trauma', 1); }
      else { H.fx(l, { hea: -2, hap: -4, money: -0.2 }); log('Chiến sự lan tới vùng bạn sống; gia đình phải chạy khỏi làng một thời gian, nhà cửa và vụ mùa bị tổn hại.', 'bad'); open(l, 'displaced', 1); if (u(l, 'indt:' + y) < 0.5) open(l, 'trauma', 1); }
      H.mem(l, 'Những năm chiến tranh với Pháp, gia đình phải rời làng chạy loạn.', 3);
    } });
  add({ id: 'vn_geneva', title: 'Hiệp định Genève 1954: chia cắt và di cư', from: 1954, to: 1955, ver: 'secondary',
    who: function (l) { return inVN(l) && !st(l).did.vn_geneva ? 1 : 0; },
    ask: function (l) { var n = vnSide(l) === 'north'; return 'Hiệp định Genève (7/1954) chia Việt Nam tại vĩ tuyến 17. ' + (n ? 'Trong 300 ngày, người dân miền Bắc được phép tự do đi lại để chuyển vào miền Nam.' : 'Lực lượng và cán bộ Việt Minh ở miền Nam được tập kết ra Bắc, một số gia đình đi cùng.') + ' Gia đình bạn phải quyết định ở lại hay rời đi, và đã đi thì khó trở về.'; },
    run: function (l, y, r, log, c) {
      var side = vnSide(l); if (side === 'dmz') return;
      if (c.age < 16) { // trẻ nhỏ đi theo quyết định của gia đình
        if (u(l, 'gen:' + side) < (side === 'north' ? 0.12 : 0.03)) EP_geneva_go(l, r, log, side, true); st(l).did.vn_geneva = 'a'; return;
      }
      st(l).did.vn_geneva = 'pending'; ask(l, r, 'vn_geneva', { a: { l: 'Ở lại quê hương', h: 'Giữ nhà, ruộng và họ hàng' }, b: { l: side === 'north' ? 'Cùng gia đình vào miền Nam' : 'Theo đơn vị tập kết ra miền Bắc', h: 'Bỏ lại nhà cửa; rất khó quay về' } }, { side: side });
    },
    req: function (l, k, d) { return k !== 'b' || (l.age >= 18 && l.age <= 50 || d.side === 'north'); },
    ai: function (l, k, d) { var t = l.tr || {}; return k === 'a' ? 1 : (d.side === 'north' ? 0.2 : 0.08) * Math.exp(((t.risk || 50) - 50) / 40) * (1 + (l.fam && l.fam.q >= 4 ? 0.3 : 0)); },
    choose: function (l, k, r, log, d) { if (k === 'a') { log('Bạn ở lại, giữ nhà và ruộng. Họ hàng đi rồi nhưng gia đình vẫn bám đất quê.', 'neutral'); return; } EP_geneva_go(l, r, log, d.side, false); } });
  function EP_geneva_go(l, r, log, side, family) {
    var s = st(l), to = side === 'north' ? 'south' : 'north'; s.side = to; relocate(l, to === 'south' ? 'TP. Hồ Chí Minh' : 'Hà Nội');
    H.fx(l, { soc: -8, hap: -3, money: -0.3 }); open(l, 'displaced', 2); log((family ? 'Gia đình bạn quyết định ra đi: ' : 'Bạn quyết định ra đi: ') + 'bỏ lại nhà cửa, lên đường ' + (to === 'south' ? 'vào miền Nam' : 'ra miền Bắc') + ' và bắt đầu lại ở một nơi lạ.', 'big');
    H.mem(l, 'Năm 1954, cả nhà dắt díu nhau rời quê, không biết bao giờ mới được trở về.', 5);
  }
  add({ id: 'vn_land_reform', title: 'Cải cách ruộng đất ở miền Bắc', from: 1953, to: 1956, ver: 'secondary',
    who: function (l) { return inVN(l) && vnSide(l) === 'north' && !l.urban ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var s = st(l); if (s.landHit || y > 1955) return; var p = [0, 0.04, 0.07, 0.14, 0.3, 0.45][c.q] * (y === 1954 ? 0.7 : 1); if (u(l, 'lr:' + y) >= p) return;
      s.landHit = y; H.fx(l, { money: -(0.15 + 0.1 * c.q), soc: -6, hap: -6 }); open(l, 'classLabel', 2); if (c.q >= 4) { l.fam.q = Math.max(1, l.fam.q - 1); }
      log('Đợt cải cách ruộng đất (1953–1956) về tới làng: gia đình bạn bị quy thành phần, ruộng đất và tài sản bị chia, họ hàng làng xóm xa lánh.', 'bad'); H.mem(l, 'Năm ấy làng làm cải cách ruộng đất; gia đình bị quy thành phần, nhiều người ngoảnh mặt.', 4);
    } });
  function warDeath(l, log, side) { H.kill(l, side === 'south' ? 'tử trận trong chiến tranh' : 'hy sinh ngoài mặt trận', log, true); }
  function soldierYear(l, y, log, side) {
    var s = st(l), sd = s.soldier; if (!sd || !(l.flags.military && l.age < l.flags.military)) return;
    var peak = y >= 1965 && y <= 1972, k = sd.k, pd = (peak ? 0.04 : 0.02) * k, pi = (peak ? 0.1 : 0.05) * k;
    if (u(l, 'sd:' + y) < pd) { warDeath(l, log, side); return; }
    if (u(l, 'si:' + y) < pi) { injure(l, log, 'Bạn bị thương trong một trận đánh, phải nằm trạm quân y nhiều tháng.', u(l, 'sib:' + y) < 0.3); open(l, 'trauma', 2); }
    else if (u(l, 'st:' + y) < WARTRAUMA) open(l, 'trauma', 1);
  }
  function draftChoice(l, r, log, side, k) {
    var s = st(l); if (k === 'a') { l.flags.milDone = true; l.flags.military = l.age + 3; l.flags.milSince = l.age; l.flags.milTB = false; l.school = null; s.soldier = { side: side, y0: wy(l), k: 1 }; log('Bạn nhập ngũ và lên đường ra mặt trận.', 'big'); H.mem(l, 'Ngày lên đường nhập ngũ giữa chiến tranh; mẹ đứng khóc ở đầu ngõ.', 5); }
    else if (k === 'b') { s.deferred = wy(l); H.fx(l, { hap: 2 }); log('Bạn được hoãn nhập ngũ để tiếp tục học, nhưng chỉ tạm thời.', 'neutral'); }
    else { if (u(l, 'dodge:' + wy(l)) < 0.4) { H.fx(l, { hap: -8, soc: -6 }); open(l, 'trauma', 1); l.flags.milDone = true; l.flags.military = l.age + 3; l.flags.milSince = l.age; l.flags.milTB = false; s.soldier = { side: side, y0: wy(l), k: 1.3 }; log('Bạn tìm cách tránh nghĩa vụ nhưng bị phát hiện và bắt đi nhập ngũ ngay.', 'bad'); } else { H.fx(l, { hap: -4, soc: -4 }); s.hiding = wy(l); log('Bạn lánh đi nơi khác, sống bấp bênh để khỏi bị gọi nhập ngũ.', 'neutral'); } }
  }
  function draftAsk(id, side, l, r) {
    var ch = { a: { l: 'Nhập ngũ', h: 'Lên đường theo lệnh gọi' }, b: { l: 'Xin hoãn để tiếp tục học', h: 'Chỉ khi đang đi học' }, c: { l: 'Tìm cách tránh nghĩa vụ', h: 'Có thể bị bắt và bị phạt' } };
    ask(l, r, id, ch, { side: side });
  }
  // hỏi nhập ngũ: một lần; nếu đã hoãn vì học thì hỏi thêm một lần nữa khi đã thôi học (hoãn không phải miễn)
  function draftDue(l, s, y) { return !s.hiding && !l.flags.milDone && (!s.draftAsked || (s.deferred && !l.school && !s.asked2 && y > s.deferred)); }
  function draftMark(s, y) { if (s.draftAsked) s.asked2 = y; else s.draftAsked = y; }
  var DRAFT_REQ = function (l, k) { return k !== 'b' || !!l.school; };
  var DRAFT_AI = function (l, k) { var t = l.tr || {}; return k === 'a' ? 1.2 : k === 'b' ? 2 : 0.25 * Math.exp(-((t.moral || 60) - 45) / 30) * Math.exp(((t.risk || 50) - 50) / 40); };
  add({ id: 'vn_war_south', title: 'Chiến tranh ở miền Nam', from: 1960, to: 1975, ver: 'secondary',
    who: function (l) { return inVN(l) && vnSide(l) !== 'north' ? 1 : 0; },
    ask: function () { return 'Lệnh động viên gọi thanh niên vào quân đội. Chiến sự ngày một lan rộng quanh vùng bạn sống.'; }, req: DRAFT_REQ, ai: DRAFT_AI,
    choose: function (l, k, r, log, d) { draftChoice(l, r, log, 'south', k); },
    run: function (l, y, r, log, c) {
      var s = st(l), reg = l.prov && l.prov.region, base = { TN: 0.14, NTB: 0.16, BTB: 0.2, DNB: l.urban ? 0.04 : 0.1, DBSCL: 0.1 }[reg] || 0.08, peak = y >= 1965 && y <= 1968 ? 1.5 : y === 1972 || y === 1975 ? 1.4 : 1;
      soldierYear(l, y, log, 'south');
      if (c.male && c.age >= 18 && c.age <= 35 && draftDue(l, s, y) && y >= 1962 && u(l, 'dr:' + y) < (y >= 1965 ? 0.4 : 0.15)) { draftMark(s, y); draftAsk('vn_war_south', 'south', l, r); return; }
      if (y === 1968 && l.urban && l.prov && l.prov.old === 'Thừa Thiên Huế' && u(l, 'tet') < 0.5) { H.fx(l, { hap: -12, money: -0.3, soc: -3 }); open(l, 'displaced', 2); open(l, 'trauma', 2); log('Tết Mậu Thân (đầu năm 1968): giao tranh dữ dội trong thành phố Huế; gia đình bạn mất nhà và phải chạy loạn nhiều tuần.', 'bad'); return; }
      if (u(l, 'ws:' + y) >= base * peak * (c.urban ? 0.8 : 1)) return;
      var x = u(l, 'wsx:' + y);
      if (x < 0.1) { injure(l, log, 'Bạn bị thương trong một đợt pháo kích hoặc mìn.', false); open(l, 'trauma', 2); }
      else if (x < 0.14 && loseParent(l, log, 'mất vì chiến tranh.')) { open(l, 'hardship', 2); }
      else { H.fx(l, { hap: -5, money: -0.35, soc: -2 }); open(l, 'displaced', 1); if (!c.urban && u(l, 'wsm:' + y) < 0.6) { relocate(l, 'TP. Hồ Chí Minh'); log('Làng bạn nằm giữa vùng giao tranh; cả nhà bỏ ruộng vườn chạy lên thành phố, sống nhờ họ hàng và làm đủ thứ nghề.', 'bad'); } else log('Chiến sự khiến nhà cửa và mùa màng bị thiệt hại; gia đình phải di tản tạm.', 'bad'); }
    } });
  add({ id: 'vn_war_north', title: 'Chiến tranh ở miền Bắc: không kích và sơ tán', from: 1965, to: 1973, ver: 'secondary',
    who: function (l) { return inVN(l) && vnSide(l) === 'north' ? 1 : 0; },
    ask: function () { return 'Lệnh gọi thanh niên nhập ngũ để vào chiến trường miền Nam trong khi máy bay Mỹ đánh phá miền Bắc.'; }, req: DRAFT_REQ, ai: DRAFT_AI,
    choose: function (l, k, r, log, d) { draftChoice(l, r, log, 'north', k); },
    run: function (l, y, r, log, c) {
      var s = st(l); soldierYear(l, y, log, 'north');
      if (c.male && c.age >= 18 && c.age <= 30 && draftDue(l, s, y) && y <= 1972 && u(l, 'drn:' + y) < 0.45) { draftMark(s, y); draftAsk('vn_war_north', 'north', l, r); return; }
      var raid = (y >= 1965 && y <= 1968) || y === 1972 || y === 1973; if (!raid) return;
      var near = c.urban && /Hà Nội|Hải Phòng/.test(l.provLabel || l.place || l.city || '') || /Hà Nội|Hải Phòng/.test(l.city || '');
      if (near && c.age < 15 && !s['evac' + y] && (y === 1965 || y === 1966 || y === 1967 || y === 1972)) { s['evac' + y] = 1; H.fx(l, { soc: -3, hap: -3 }); l.st.kno -= 1; log('Máy bay Mỹ đánh phá Hà Nội và Hải Phòng; trường học sơ tán về nông thôn, bạn xa bố mẹ nhiều tháng và học trong lớp học che hầm.', 'bad'); H.mem(l, 'Những tháng sơ tán về quê giữa tiếng còi báo động.', 3); return; }
      if (u(l, 'wn:' + y) < (near ? 0.12 : 0.05)) { if (u(l, 'wnx:' + y) < 0.15) { injure(l, log, 'Bạn bị thương trong một đợt không kích.', false); } else { H.fx(l, { hap: -4, money: -0.25 }); log('Một đợt ném bom làm hỏng nhà và tài sản của gia đình bạn.', 'bad'); open(l, 'hardship', 1); } }
    } });
  add({ id: 'vn_1975', title: 'Sau 30/4/1975: chuyển giao, học tập cải tạo, kinh tế mới, vượt biên', from: 1975, to: 1979, ver: 'secondary',
    who: function (l) { return inVN(l) ? 1 : 0; },
    ask: function (l) { return 'Cuộc sống sau 30/4/1975 đảo lộn: ' + (st(l).camp ? 'gia đình có người phải đi học tập cải tạo, ' : '') + 'thu nhập sụt, nhà cửa và giấy tờ phải làm lại. Bạn nghe nói về vùng kinh tế mới và về những chuyến vượt biên bằng thuyền nhỏ.'; },
    req: function (l, k) { return k !== 'c' || (l.age >= 14 && l.money > l.base * 0.3); },
    ai: function (l, k) { var t = l.tr || {}; return k === 'a' ? 1.6 : k === 'b' ? 0.5 : 0.35 * Math.exp(((t.risk || 50) - 50) / 30) * (1 + (st(l).camp ? 1.2 : 0)); },
    choose: function (l, k, r, log) {
      var s = st(l);
      if (k === 'a') { H.fx(l, { hap: -2, money: -0.1 }); log('Bạn ở lại, tìm sống bằng nghề phụ và bán dần đồ đạc.', 'neutral'); open(l, 'hardship', 1); return; }
      if (k === 'b') { H.fx(l, { hea: -3, hap: -3, soc: -4, money: -0.25 }); relocate(l, 'Lâm Đồng'); l.urban = false; open(l, 'hardship', 2); open(l, 'displaced', 1); log('Gia đình lên vùng kinh tế mới khai hoang: đất xấu, thiếu nước và thiếu thuốc, vụ đầu thất bát.', 'bad'); return; }
      var x = u(l, 'boat:' + wy(l));
      if (x < 0.15) { H.kill(l, 'chìm tàu hoặc kiệt sức trên biển khi vượt biên', log, true); }
      else if (x < 0.4) { H.fx(l, { hap: -10, money: -0.4, soc: -3 }); open(l, 'trauma', 2); log('Chuyến đi bị chặn lại; bạn bị bắt giữ ít lâu rồi thả về, mất hết tiền dành dụm.', 'bad'); }
      else { H.fx(l, { hap: -4 }); open(l, 'trauma', 2); if (!resettle(l, r, log, VNQ)) log('Bạn đến được trại tị nạn nhưng chưa được nước nào nhận.', 'neutral'); else log('Sau nhiều tháng ở trại tị nạn, bạn được một nước nhận định cư.', 'big'); }
    },
    run: function (l, y, r, log, c) {
      var s = st(l), ok = vnSide(l) !== 'north' || !!s.side;
      var jobs = String((l.fam && (l.fam.fJob + ' ' + l.fam.mJob)) || '') + ' ' + String(l.job && l.job.id || '') + ' ' + String(l.lastJob && l.lastJob.id || '');
      var mil = /quân đội|sĩ quan|bộ đội|công an|cảnh sát|công chức|viên chức|cán bộ|giáo viên/i.test(jobs) || c.cat === 'state' || c.cat === 'uniform';
      if (y === 1975 && ok && !s.camp && mil && u(l, 'camp') < 0.4) { s.camp = y; if (c.age >= 18) { if (!jobLoss(l, log, 'Sau 30/4/1975 bạn phải trình diện học tập cải tạo và bị thôi việc cũ.')) log('Sau 30/4/1975 bạn phải trình diện học tập cải tạo; khi trở về, nguồn sống cũ không còn.', 'bad'); H.fx(l, { hap: -8, soc: -6, money: -0.3 }); } else { H.fx(l, { hap: -6, soc: -3 }); log('Sau 30/4/1975, bố hoặc mẹ bạn phải đi học tập cải tạo ở xa; cả nhà sống nhờ khoản dành dụm ít ỏi và sự giúp đỡ của họ hàng.', 'bad'); } open(l, 'hardship', 2); open(l, 'classLabel', 1); H.mem(l, 'Sau 30/4/1975, người lớn trong nhà phải đi học tập cải tạo, cả nhà thiếu thốn.', 5); return; }
      if (y >= 1976 && ok && !s.did.vn_1975 && c.age >= 14 && (s.camp || u(l, 'kt:' + y) < (c.urban ? 0.22 : 0.06))) { s.did.vn_1975 = 'pending'; ask(l, r, 'vn_1975', { a: { l: 'Ở lại, tìm sống bằng nghề phụ', h: 'Tiết kiệm, bán dần đồ đạc' }, b: { l: 'Đi vùng kinh tế mới', h: 'Được cấp đất khai hoang, điều kiện khắc nghiệt' }, c: { l: 'Tìm đường vượt biên', h: 'Rủi ro rất lớn, đi là khó quay về' } }); }
    } });
  add({ id: 'vn_exodus_hoa', title: 'Làn sóng rời đi 1978–1979', from: 1978, to: 1979, ver: 'secondary',
    who: function (l) { return inVN(l) && l.eth === 'Hoa' && l.age >= 5 ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var s = st(l); if (s.exodus || u(l, 'hoa:' + y) >= 0.5) return; s.exodus = y;
      H.fx(l, { hap: -8, soc: -8, money: -0.5 }); open(l, 'displaced', 2); open(l, 'trauma', 1);
      if (u(l, 'hoa2') < 0.5 && W.BY.CN && H.emigrate) { H.emigrate(l, ['CN', W.BY.CN.name, W.BY.CN.pool], r, log); s.refugee = { to: 'CN', y: y }; log('Trong làn sóng người Hoa rời Việt Nam năm 1978–1979, gia đình bạn bán vội nhà cửa và sang Trung Quốc, bỏ lại phần lớn tài sản.', 'big'); }
      else log('Trong làn sóng người Hoa rời Việt Nam năm 1978–1979, nhiều gia đình quanh bạn ra đi; gia đình bạn ở lại nhưng bị thiệt hại về làm ăn và các mối quan hệ.', 'bad');
      H.mem(l, 'Những năm 1978–1979, láng giềng và họ hàng người Hoa lần lượt ra đi.', 4);
    } });
  add({ id: 'vn_subsidy', title: 'Thời bao cấp và những lần đổi tiền', from: 1976, to: 1988, ver: 'secondary',
    who: function (l) { return inVN(l) ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var s = st(l); if (y === 1978 && !s.doi78) { s.doi78 = 1; savings(l, 0.25, log, 'Năm 1978 đổi tiền: số tiền tiết kiệm bị hạn mức đổi và mất giá'); }
      if (y === 1985 && !s.doi85) { s.doi85 = 1; savings(l, 0.3, log, 'Tháng 9/1985 đổi tiền (10 đồng cũ đổi 1 đồng mới) giữa lạm phát phi mã: tiền để dành mất giá'); }
      if (y <= 1986 && (c.cat === 'state' || c.cat === 'uniform' || c.cat === 'edu' || c.cat === 'med')) { l.st.hap -= 1; H.cash(l, -0.03 * l.base, 'Thiếu thốn thời bao cấp'); if (!s.sub && u(l, 'sub') < 0.7) { s.sub = 1; log('Lương công chức trượt giá liên tục; cả nhà sống bằng tem phiếu, gạo mốc và làm thêm buổi tối.', 'neutral'); open(l, 'hardship', 1); } }
      else if (y <= 1986 && c.urban && !s.sub2) { s.sub2 = 1; log('Thời bao cấp: hàng hóa khan hiếm, xếp hàng mua gạo, vải, thịt bằng tem phiếu.', 'neutral'); }
      if (y === 1987 && !s.doimoi) { s.doimoi = 1; log('Sau Đại hội VI (12/1986), công cuộc Đổi Mới nới lỏng kinh tế tư nhân; năm 1988 Nghị quyết 10 giao ruộng ổn định cho hộ nông dân.', 'good'); if (!c.urban && !l.job) H.fx(l, { money: 0.1 }); }
    } });
  add({ id: 'vn_cambodia_war', title: 'Chiến tranh biên giới và Campuchia', from: 1978, to: 1989, ver: 'secondary',
    who: function (l) { return inVN(l) ? 1 : 0; },
    ask: function () { return 'Lệnh gọi nhập ngũ: bộ đội Việt Nam đang chiến đấu ở biên giới phía Bắc và có mặt ở Campuchia.'; }, req: DRAFT_REQ, ai: DRAFT_AI,
    choose: function (l, k, r, log) { draftChoice(l, r, log, 'camb', k); },
    run: function (l, y, r, log, c) {
      var s = st(l); if (s.soldier && s.soldier.side === 'camb') { var sd = s.soldier; if (l.flags.military && l.age < l.flags.military) { if (u(l, 'cd:' + y) < (y === 1979 ? 0.04 : 0.02)) { warDeath(l, log, 'north'); return; } if (u(l, 'ci:' + y) < 0.08) { injure(l, log, 'Bạn bị thương do mìn hoặc phục kích ở chiến trường.', false); open(l, 'trauma', 2); } else if (u(l, 'ct:' + y) < 0.3) open(l, 'trauma', 1); } }
      if (c.male && c.age >= 18 && c.age <= 27 && draftDue(l, s, y) && u(l, 'dc:' + y) < 0.25) { draftMark(s, y); draftAsk('vn_cambodia_war', 'camb', l, r); }
    } });

  // ======================= CAMPUCHIA 1975–1979 =======================
  // Chế độ Khmer Đỏ (17/4/1975–7/1/1979): cưỡng bức sơ tán các thành phố, bỏ tiền tệ và chợ, trường học đóng cửa, lao động tập thể, đói và bệnh; số người chết ước tính 1,5–2 triệu.
  // Số liệu UN của năm đó có tuổi thọ khoảng 12; mô hình tử vong của engine không xuống thấp tới vậy (sàn 25) nên phần chênh được cộng bằng nguy cơ riêng của biến cố (tham số trò chơi).
  add({ id: 'kh_khmer_rouge', title: 'Chế độ Khmer Đỏ ở Campuchia', from: 1975, to: 1979, ver: 'secondary',
    who: function (l) { return res(l) === 'KH' ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var s = st(l);
      if (y === 1975 && !s.khEvac) {
        s.khEvac = 1; s.khNew = !!l.urban;
        if (l.urban) { l.urban = false; l.place = 'một vùng nông thôn Campuchia'; l.city = l.place; }
        if (l.money > 0) H.cash(l, -l.money, 'Tiền tệ bị bãi bỏ'); l.school = null; l.lastJob = l.job || l.lastJob; l.job = null;
        H.fx(l, { hap: -12, hea: -8, soc: -10 }); open(l, 'trauma', 3); open(l, 'hardship', 3); if (l.urban === false && s.khNew) open(l, 'displaced', 3);
        log('Ngày 17/4/1975 Khmer Đỏ vào Phnôm Pênh và buộc dân các thành phố ra đi; tiền bạc, chợ búa và trường học bị bãi bỏ, mọi người bị đưa về nông thôn lao động tập thể.', 'big'); H.mem(l, 'Tháng 4/1975, cả gia đình bị xua ra khỏi nhà, bắt đầu những năm đói khát và lao động khổ sai.', 5); return;
      }
      if (y <= 1978) {
        var cat = c.cat === 'edu' || c.cat === 'med' || c.cat === 'state' || c.cat === 'uniform' || (l.lastJob && /giáo viên|bác sĩ|công chức|sĩ quan|bộ đội/.test(String(l.lastJob.id || ''))), p = (c.age < 5 ? 0.06 : c.age < 15 ? 0.05 : c.age < 50 ? 0.055 : 0.1) * (s.khNew ? 1.4 : 1) * (cat ? 1.5 : 1);
        if (u(l, 'kh:' + y) < p) { H.kill(l, 'đói, bệnh tật và kiệt sức dưới chế độ Khmer Đỏ', log, false); return; }
        H.fx(l, { hea: -5, hap: -5 }); if (y === 1976 && !s.khLog) { s.khLog = 1; log('Cuộc sống dưới chế độ Khmer Đỏ: làm việc từ sáng sớm đến tối với khẩu phần cơm cháo ít ỏi; đau ốm không có thuốc, nhiều người quanh bạn gục xuống.', 'bad'); }
      } else if (y === 1979 && !s.khEnd) {
        s.khEnd = 1; H.fx(l, { hap: 6, soc: 3 }); open(l, 'hardship', 2); log('Tháng 1/1979 chế độ Khmer Đỏ sụp đổ ở Phnôm Pênh; mọi người tìm đường về quê cũ giữa nạn đói và hoang tàn.', 'good'); H.mem(l, 'Đầu năm 1979, chế độ cũ sụp đổ và cả nhà đi tìm lại những người còn sống.', 5);
      }
    } });
  // ======================= TOÀN CẦU =======================
  var OECD = /^(US|CA|GB|DE|FR|IT|JP|AU|NZ|ES|SE|NO|DK|NL|BE|AT|CH|FI|IE)$/;
  add({ id: 'w_oil_recession', title: 'Cú sốc dầu mỏ và suy thoái 1974–1975, 1980–1982', from: 1974, to: 1982, ver: 'secondary',
    who: function (l) { return OECD.test(res(l)) && (wy(l) <= 1975 || wy(l) >= 1980) ? 1 : 0; },
    run: function (l, y, r, log, c) { var s = st(l), k = 'oil' + (y <= 1975 ? 'a' : 'b'); if (s.seen[k] || !l.job || l.age < 18 || l.age > 62) return; var cat = c.cat, p = (cat === 'worker' ? 0.12 : cat === 'sale' || cat === 'service' ? 0.07 : cat === 'state' || cat === 'uniform' || cat === 'edu' || cat === 'med' ? 0.015 : 0.05); if (u(l, k) >= p) return; s.seen[k] = 1; jobLoss(l, log, 'Giá dầu tăng vọt kéo theo suy thoái; xí nghiệp cắt giảm nhân sự và bạn bị cho nghỉ việc.'); H.fx(l, { hap: -5, money: -0.1 }); open(l, 'hardship', 1); H.mem(l, 'Năm ấy bị cho nghỉ việc giữa suy thoái kinh tế.', 3); } });
  var INFL = { RU: [1992, 1994], UA: [1992, 1995], BY: [1992, 1995], KZ: [1992, 1994], KG: [1992, 1995], TJ: [1992, 1995], TM: [1992, 1996], UZ: [1992, 1994], AM: [1992, 1994], AZ: [1992, 1995], GE: [1992, 1994], MD: [1992, 1994], LT: [1992, 1993], LV: [1992, 1993], EE: [1992, 1993], PL: [1989, 1991], RO: [1990, 1993], BG: [1991, 1997], AL: [1991, 1992], RS: [1992, 1994], HR: [1991, 1993], BA: [1992, 1995], MK: [1992, 1993] };
  var TRANS = /^(RU|UA|BY|KZ|KG|TJ|TM|UZ|AM|AZ|GE|MD|LT|LV|EE|PL|HU|CZ|SK|RO|BG|AL|RS|HR|BA|MK|SI|ME|MN)$/;
  add({ id: 'w_transition', title: 'Chuyển đổi kinh tế sau 1989–1991', from: 1990, to: 1999, ver: 'secondary',
    who: function (l) { return TRANS.test(res(l)) ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var s = st(l), cc = res(l), w = INFL[cc];
      if (w && y >= w[0] && y <= w[1] && !s.seen['inf' + cc + y]) { s.seen['inf' + cc + y] = 1; savings(l, y === w[0] ? 0.35 : 0.2, log, 'Lạm phát phi mã sau khi giá cả được thả nổi: tiền để dành mất giá nhanh'); }
      if (c.age >= 18 && c.age <= 62 && l.job && !s.seen['tr' + y]) { var p = (c.cat === 'state' || c.cat === 'uniform' || c.cat === 'worker' ? 0.09 : 0.05) * (y <= 1994 ? 1.3 : 0.8); if (u(l, 'tr:' + y) < p) { s.seen['tr' + y] = 1; jobLoss(l, log, 'Xí nghiệp nhà nước nơi bạn làm bị cổ phần hóa hoặc đóng cửa; lương bị nợ nhiều tháng rồi bạn mất việc.'); H.fx(l, { hap: -5 }); open(l, 'hardship', 2); H.mem(l, 'Những năm 1990, xí nghiệp đóng cửa và lương bị nợ hàng tháng.', 3); } }
      if (cc === 'AL' && y === 1997 && !s.seen.alb97) { s.seen.alb97 = 1; savings(l, 0.4, log, 'Các quỹ đầu tư kiểu kim tự tháp sụp đổ, tiền tiết kiệm của nhiều gia đình biến mất'); }
    } });
  var YU = { HR: [1991, 1995], BA: [1992, 1995], SI: [1991, 1991], RS: [1991, 1999], ME: [1991, 1999], MK: [2001, 2001] };
  var YUW = { 'Sarajevo': 3, 'Banja Luka': 1.2, 'Zagreb': 0.4, 'Split': 0.5, 'Belgrade': 0.5 };
  add({ id: 'w_yugoslav_wars', title: 'Các cuộc chiến tranh ở Nam Tư cũ', from: 1991, to: 2001, ver: 'secondary',
    who: function (l) { var w = YU[res(l)]; return w && wy(l) >= w[0] && wy(l) <= w[1] ? 1 : 0; },
    ask: function (l) { return 'Chiến sự lan tới nơi bạn sống. Nhiều gia đình đã rời đi; đi là bỏ lại nhà cửa và công việc.'; },
    req: function (l, k) { return true; }, ai: function (l, k) { return k === 'a' ? 1 : 0.25 * (l.money > l.base ? 1.6 : 1); },
    choose: function (l, k, r, log) { if (k === 'a') { H.fx(l, { hap: -6, hea: -3 }); open(l, 'trauma', 2); log('Bạn ở lại, sống giữa tiếng súng và những đợt thiếu điện nước.', 'bad'); return; } resettle(l, r, log, [['DE', 40], ['AT', 12], ['SE', 12], ['CH', 8], ['US', 10], ['DK', 6], ['NL', 6], ['GB', 6]]); open(l, 'trauma', 1); },
    run: function (l, y, r, log, c) {
      var cc = res(l), s = st(l), k = 'yu' + y; if (s.seen[k]) return; var w = (YUW[l.city] || 1) * (c.urban ? 1 : 1.1) * 0.35; if (cc === 'MK' || cc === 'SI') w *= 0.3; if (u(l, 'yu:' + y) >= Math.min(0.8, w)) return; s.seen[k] = 1;
      if (c.male && c.age >= 18 && c.age <= 45 && u(l, 'yum:' + y) < 0.25) { injure(l, log, 'Bạn bị động viên và bị thương ở tiền tuyến.', false); open(l, 'trauma', 2); return; }
      if (u(l, 'yux:' + y) < 0.4 && !s.refugee) { s.asked = y; ask(l, r, 'w_yugoslav_wars', { a: { l: 'Ở lại nơi mình sống', h: 'Giữ nhà và việc làm, chấp nhận rủi ro' }, b: { l: 'Rời nước đi tị nạn', h: 'Bỏ lại nhà cửa, bắt đầu lại ở nước khác' } }); return; }
      H.fx(l, { hap: -6, money: -0.3 }); open(l, 'displaced', 1); log('Chiến tranh ở Nam Tư cũ làm gia đình bạn mất nhà hoặc phải sống lánh nạn trong thời gian dài.', 'bad');
    } });
  var ASIA97 = { TH: 1, ID: 1.4, KR: 1.2, MY: 0.8, PH: 0.5 };
  add({ id: 'w_asia_crisis', title: 'Khủng hoảng tài chính châu Á 1997–1998', from: 1997, to: 1999, ver: 'secondary',
    who: function (l) { return ASIA97[res(l)] ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var s = st(l), k = 'as97'; if (s.seen[k] || y > 1998) return; var w = ASIA97[res(l)];
      if (c.age >= 18 && c.age <= 62 && l.job && u(l, k) < 0.08 * w * (c.cat === 'state' || c.cat === 'edu' || c.cat === 'med' ? 0.3 : 1)) { s.seen[k] = 1; jobLoss(l, log, 'Khủng hoảng tài chính châu Á: công ty cắt giảm hàng loạt và bạn mất việc.'); H.fx(l, { hap: -5 }); open(l, 'hardship', 2); H.mem(l, 'Năm 1997–1998 mất việc vì khủng hoảng tài chính.', 3); }
      else if ((l.ventures || []).length && u(l, k + 'v') < 0.3 * w) { s.seen[k] = 1; (l.ventures || []).forEach(function (v) { v.cap = (v.cap || 0) * 0.6; }); H.fx(l, { hap: -4 }); log('Đồng nội tệ mất giá mạnh, chi phí nhập khẩu và nợ vay ngoại tệ đè nặng, cơ sở kinh doanh của bạn mất khoảng 40% vốn.', 'bad'); }
      else if (u(l, k + 's') < 0.5 * w) { s.seen[k] = 1; savings(l, 0.12 * w, log, 'Đồng nội tệ mất giá mạnh, tiền để dành co lại'); }
    } });
  var GFC = { US: [2008, 2010, 1, 0.8], GB: [2008, 2010, 0.7, 0.5], IE: [2008, 2012, 1.1, 1], ES: [2008, 2013, 1.3, 0.8], GR: [2009, 2016, 1.5, 0.5], IS: [2008, 2010, 1, 0.5], PT: [2010, 2014, 1, 0.3], IT: [2009, 2013, 0.8, 0.3] };
  add({ id: 'w_gfc', title: 'Khủng hoảng tài chính toàn cầu 2008 và khủng hoảng nợ châu Âu', from: 2008, to: 2016, ver: 'secondary',
    who: function (l) { var w = GFC[res(l)]; return w && wy(l) >= w[0] && wy(l) <= w[1] ? 1 : 0; },
    run: function (l, y, r, log, c) {
      var s = st(l), w = GFC[res(l)], k = 'gfc'; if (s.seen[k] === 2) return;
      if (!s.seen.gfcj && c.age >= 18 && c.age <= 62 && l.job && u(l, 'gfcj:' + y) < 0.07 * w[2] * (c.cat === 'state' || c.cat === 'uniform' || c.cat === 'med' || c.cat === 'edu' ? 0.35 : 1)) { s.seen.gfcj = 1; jobLoss(l, log, 'Khủng hoảng tài chính khiến công ty cắt giảm nhân sự; bạn mất việc.'); H.fx(l, { hap: -5 }); open(l, 'hardship', 2); H.mem(l, 'Năm đó bị cho nghỉ việc giữa khủng hoảng kinh tế.', 3); }
      if (!s.seen.gfch && l.ownHouse && l.houseVal > 0) { s.seen.gfch = 1; var f = 0.22 * w[3]; l.houseVal *= 1 - f; log('Giá nhà giảm mạnh sau khủng hoảng: căn nhà của bạn mất khoảng ' + Math.round(f * 100) + '% giá trị' + ((l.mortgage || 0) > l.houseVal ? ', thấp hơn cả khoản vay còn nợ' : '') + '.', 'bad'); H.fx(l, { hap: -4 }); if ((l.mortgage || 0) > l.houseVal) open(l, 'hardship', 1); }
      if (y >= w[1]) s.seen[k] = 2;
    } });
  add({ id: 'w_tsunami_2004', title: 'Sóng thần Ấn Độ Dương 26/12/2004', from: 2004, to: 2004, ver: 'secondary',
    who: function (l) { return /^(ID|LK|IN|TH|MV|MY|SO)$/.test(res(l)) && l.coast ? 1 : 0; },
    run: function (l, y, r, log) { var cc = res(l), w = { ID: 0.1, LK: 0.12, IN: 0.03, TH: 0.04, MV: 0.2, MY: 0.02, SO: 0.03 }[cc]; if (u(l, 'tsu') >= w) return; if (u(l, 'tsud') < 0.12) { H.kill(l, 'sóng thần Ấn Độ Dương', log, true); return; } H.fx(l, { hap: -10, money: -0.7, hea: -3 }); open(l, 'displaced', 2); open(l, 'trauma', 2); log('Sóng thần Ấn Độ Dương (26/12/2004) quét qua vùng ven biển nơi bạn sống: nhà cửa trôi mất, nhiều người quen thiệt mạng.', 'bad'); H.mem(l, 'Ngày 26/12/2004, con sóng khổng lồ cuốn đi nhà cửa và những người thân quen.', 5); } });
  add({ id: 'w_covid', title: 'Đại dịch COVID-19', from: 2020, to: 2022, ver: 'secondary',
    who: function (l) { return 1; },
    run: function (l, y, r, log, c) {
      var s = st(l), inf = { 2020: 0.08, 2021: 0.2, 2022: 0.45 }[y] * (c.age >= 65 ? 0.8 : 1); // tham số trò chơi, không phải thống kê
      if (y === 2020 && !s.seen.cv0) { s.seen.cv0 = 1; log('Năm 2020: đại dịch COVID-19 bùng phát toàn cầu; trường học đóng cửa, đi lại bị hạn chế, nhiều nơi giãn cách xã hội.', 'neutral'); if (c.age >= 6 && c.age < 18 && c.student) { l.st.kno -= 2; } if (l.job && /service|sale|show|beauty|free/.test(c.cat || '') && u(l, 'cvj') < 0.12) { jobLoss(l, log, 'Quán và cơ sở nơi bạn làm phải đóng cửa nhiều tháng; bạn mất việc.'); open(l, 'hardship', 1); } }
      if (u(l, 'cvi:' + y) < inf && !s.seen['cvi' + y]) { s.seen['cvi' + y] = 1; var sev = c.age >= 65 ? 0.3 : c.age >= 50 ? 0.12 : 0.04; if (u(l, 'cvs:' + y) < sev * (l.st.hea < 50 ? 1.8 : 1)) { H.fx(l, { hea: -14 }); l.flags.chronic = Math.min(3, (l.flags.chronic || 0) + (u(l, 'cvl:' + y) < 0.3 ? 1 : 0)); log('Bạn nhiễm COVID-19 nặng, phải nằm viện nhiều ngày; hồi phục chậm.', 'bad'); } else { H.fx(l, { hea: -3 }); log('Bạn nhiễm COVID-19, sốt vài ngày rồi khỏi.', 'neutral'); } }
    } });
  // ======================= HOOK NĂM =======================
  function step(l, r, log) {
    if (!l.alive || !l.era920 || !l.flags) return; var y = wy(l); if (y > X.TO) return;
    var s = st(l);
    EP.forEach(function (e) {
      if (y < e.from || y > e.to) return; var ok = e.who(l, y); if (!(ok > 0)) return;
      var k = e.id + ':' + y; if (s.seen[k]) return; s.seen[k] = 1;
      try { e.run(l, y, r, log, circ(l)); } catch (err) { if (G.DEBUG_HIST920) throw err; }
    });
    if (l.alive) processOpen(l, log);
  }
  E.HOOKS.year.push(step);
  X.HIST = { step: step, EP: EP, BY: BY, st: st, open: open, vnSide: vnSide, OPEN: OPEN, processOpen: processOpen, circ: circ, u: u };
})(globalThis.G);
