/* Một Đời — MD4 phần hoàn thiện (8.10.23): các mục còn giản lược sau 8.10.22.
   · D17: khởi đầu "chăm sóc tạm thời" khi cha mẹ vẫn giữ quyền nuôi con (không đủ điều kiện làm con nuôi; có lịch thăm và đánh giá đoàn tụ).
   · D10: chuỗi nhiều năm khi ở tù (thăm nuôi, bạn đời chờ hay xa cách, tái hòa nhập), bệnh dài hạn (tải người chăm, chia sẻ việc chăm),
     anh chị em tranh chấp trách nhiệm chăm cha mẹ già (tiếp nối tình huống "Ai nuôi bố mẹ?" của life90).
   · D11: khóa tiếng 1 năm ở nước ngoài (visa học tiếng riêng, chuyển sang đại học phải xét lại, không tự động); bảo lưu, chuyển trường,
     bỏ học khi đang du học; học nghề kép ở Đức (hợp đồng, phụ cấp, 3 năm); nghiên cứu sinh có hợp đồng lương.
   · D12: công nhận bằng cho nghề được quản lý (nộp hồ sơ → thẩm định → bù kiến thức/thi → công nhận); lộ trình thường trú theo nước,
     ngành thiếu nhân lực và vùng ưu tiên (không bảo đảm, không phải quốc tịch).
   · D07: chăn nuôi gia súc/gia cầm với bệnh theo loài (tụ huyết trùng, lở mồm long móng, dịch tả lợn châu Phi, cúm gia cầm, Newcastle,
     bệnh than ở vùng lưu hành), khai báo thú y, tiêu hủy có hỗ trợ (tham số mô phỏng), nguy cơ lây sang người khi không bảo hộ.
   Kết quả quyết định dùng RNG của quyết định; sự kiện theo năm băm theo nhân vật + năm (tải lại không đổi). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, C = G.CUR, GL = E.GLOBAL919, I = E.ID919;
  if (!X || !GL || !I) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function res(l) { return H.resCode(l); }
  function cname(c) { return W.BY[c] ? W.BY[c].name : c; }
  function usd(l, v) { return E.usdToLocal ? E.usdToLocal(l, v) : v / 4000 * l.base; }
  function jailed(l) { return l.jailUntil != null && l.age < l.jailUntil; }
  function st(l) { var s = l.flags.md4b; if (!s || typeof s !== 'object') s = l.flags.md4b = { v: 1 }; return s; }
  function passOk(l) { return !(E.TRAVEL918 && E.TRAVEL918.passport) || l.country !== 'VN' || !!E.TRAVEL918.passport(l); }

  // ================= D17: chăm sóc tạm thời =================
  var TC = ['cha mẹ đang điều trị bệnh dài ngày', 'gia đình mất chỗ ở, đang được hỗ trợ tìm nhà', 'người chăm sóc chính đang chấp hành án', 'trẻ cần được bảo vệ trong lúc gia đình được hỗ trợ'];
  function tc(l) { return l.flags.tempCare919 && !l.flags.tempCare919.ended ? l.flags.tempCare919 : null; }
  var create0 = E.createLife; E.createLife = function (o) {
    var l = create0.apply(this, arguments); if (!l || !l.flags || o && o.parent || l.fam.orphan || l.fam.elite || l.flags.royal) return l;
    if (!(o && o.tempCare) && u(l.id + ':tc919') > 0.003) return l;
    var why = TC[Math.floor(u(l.id + ':tcw') * TC.length)];
    l.flags.tempCare919 = { reason: why, since: 0, visits: 0, rights: true, carer: 'gia đình nuôi dưỡng tạm thời' }; l.fam.home = 'nhà nuôi dưỡng tạm thời';
    if (l.log[0]) l.log[0].t += ' Vì ' + why + ', bạn được chăm sóc tạm thời ở một gia đình nuôi dưỡng; cha mẹ vẫn giữ quyền nuôi con và có lịch thăm.';
    return l;
  };
  var carer0 = E.orphanCarer; E.orphanCarer = function (l) { var t = l && tc(l); if (t && l.age < 18) return t.carer; return carer0 ? carer0.apply(this, arguments) : null; };
  function tcYear(l, log) {
    var t = tc(l); if (!t || t.yearAt === l.age) return; t.yearAt = l.age;
    if (l.age >= 18) { t.ended = l.age; t.out = 'adult'; log('Mười tám tuổi, bạn rời gia đình nuôi dưỡng tạm thời, tự lập và vẫn giữ liên lạc với cha mẹ.', 'neutral'); return; }
    if (!l.fam.mAlive && (!l.fam.fAlive || l.fam.noDad)) { t.ended = l.age; t.out = 'orphaned'; log('Cha mẹ không còn; hồ sơ chuyển sang chăm sóc thay thế lâu dài.', 'bad'); return; }
    var p = 0.18 + Math.min(0.15, t.visits * 0.03);
    if (l.age >= 1 && u(l.id + ':tcr:' + l.age) < p) { t.ended = l.age; t.out = 'reunified'; l.fam.home = l.fam.q <= 2 ? 'nhà thuê' : 'nhà riêng'; log('Gia đình đã ổn định (' + t.reason + ' được giải quyết); cơ quan bảo trợ đánh giá và cho bạn về sống với cha mẹ. Gia đình nuôi dưỡng tạm thời vẫn giữ liên lạc.', 'big'); H.mem(l, 'Ngày về lại nhà với cha mẹ.', 6); H.fx(l, { hap: 8 }); }
  }
  X.menu('tempCare919', 'Gặp cha mẹ trong thời gian được chăm sóc tạm thời', function (l) { return tc(l) && l.age >= 3 && l.age < 18 ? true : 'Không ở diện chăm sóc tạm thời'; }, function (l) { var t = tc(l); return 'Bạn đang ở gia đình nuôi dưỡng tạm thời vì ' + t.reason + '. Cha mẹ vẫn giữ quyền nuôi con, nên bạn không thuộc diện được nhận làm con nuôi. Các lần gặp giúp đánh giá việc đoàn tụ; đoàn tụ khi gia đình đủ điều kiện, không theo lịch cố định.'; },
    function (l) { var t = tc(l); return [{ k: 'visit', l: 'Gặp cha mẹ theo lịch thăm', why: t.visitAt === l.age ? 'Đã gặp năm nay' : true, run: function (l, r, log) { t.visitAt = l.age; t.visits++; H.fx(l, { hap: 3 }); log('Buổi gặp cha mẹ có cán bộ xã hội đi cùng; mọi người kể nhau nghe chuyện cả năm.', 'good'); } }, { k: 'talk', l: 'Nói với cán bộ xã hội về mong muốn của mình', run: function (l, r, log) { log('Ý kiến của bạn được ghi vào hồ sơ; cán bộ giải thích các bước trước khi về nhà.', 'neutral'); } }]; }, 3, 'Tình cảm & gia đình');

  // ================= D10: ở tù, bệnh dài hạn, anh chị em tranh chấp chăm cha mẹ =================
  var B = function () { return E.BONDS919; };
  function prisonYear(l, log) {
    var s = st(l), p = l.partner;
    if (jailed(l)) {
      var q = s.prison || (s.prison = { since: l.age, visits: [], partner: null }); if (q.yearAt === l.age) return; q.yearAt = l.age;
      var circle = B() ? B().circle(l) : [], came = circle.filter(function (c) { return u(l.id + ':pv:' + c.name + ':' + l.age) < c.bond / 110 - (c.far ? 0.25 : 0); });
      q.visits.push({ at: l.age, who: came.map(function (c) { return c.name; }) });
      circle.forEach(function (c) { var d = came.indexOf(c) >= 0 ? 1 : -3; if (c.ref && c.ref.affection108 != null) c.ref.affection108 = U.clamp(c.ref.affection108 + d, 0, 100); else if (c.ref) c.ref.close = U.clamp((c.ref.close || 55) + d, 0, 100); });
      log(came.length ? came.map(function (c) { return c.name; }).join(', ') + ' đến thăm nuôi, gửi đồ và thư.' : 'Năm nay không ai đến thăm; bạn viết thư về nhà.', came.length ? 'neutral' : 'bad');
      if (p && p.alive !== false && p.status === 'married' && q.partner == null && l.jailUntil - l.age >= 3) { q.partner = 'ask'; X.next(l, 'prisonPartner919', function () { return 0.5; }, {}, { manual: false }); }
      return;
    }
    if (s.prison && !s.prison.out) { var q2 = s.prison; q2.out = l.age; var sup = q2.visits.reduce(function (n, v) { return n + v.who.length; }, 0);
      log('Ra tù sau ' + (l.age - q2.since) + ' năm. ' + (sup ? 'Những người từng thăm nuôi giúp bạn tìm chỗ ở và việc làm.' : 'Gần như không ai đón; trung tâm hỗ trợ tái hòa nhập giới thiệu chỗ ở tạm.'), sup ? 'good' : 'neutral');
      if (p && p.separated919 && B()) B().state(l).open = { kind: 'jail', who: 'partner', name: p.name, how: 'distant', stage: 'mend', at: l.age, temper: 'đã xa cách' };
    }
  }
  E.SC('prisonPartner919', { title: 'Bạn đời khi bạn chấp hành án dài', valid: function (l) { return jailed(l) && l.partner && l.partner.alive !== false && st(l).prison && st(l).prison.partner === 'ask'; },
    text: function (l) { return l.partner.name + ' đến thăm. Án còn ' + (l.jailUntil - l.age) + ' năm. Mỗi người có quyền tự quyết về tương lai của mình; không có câu trả lời đúng duy nhất.'; },
    opts: [{ k: 'wait', l: 'Nói rằng mình mong người ấy chờ', run: function (l, r, log) { decide(l, r, log, 0.1); } }, { k: 'free', l: 'Nói người ấy không cần chờ, hãy sống cho mình', run: function (l, r, log) { decide(l, r, log, -0.15); } }, { k: 'later', l: 'Chưa bàn, hẹn khi gặp lần sau', run: function (l) { st(l).prison.partner = null; } }] });
  function decide(l, r, log, d) { var p = l.partner, q = st(l).prison, bond = E.RELATIONS108 ? E.RELATIONS108.bond(l, p) : 60, x = r(); q.partner = 'done';
    if (x < bond / 100 + d) { p.waiting919 = l.age; if (p.affection108 != null) p.affection108 = U.clamp(p.affection108 + 4, 0, 100); log(p.name + ' quyết định chờ bạn; hai người viết thư mỗi tuần.', 'good'); }
    else if (x < bond / 100 + d + 0.3) { log(p.name + ' chưa quyết; ' + (p.sex === 'F' ? 'cô ấy' : 'anh ấy') + ' vẫn thăm khi có thể.', 'neutral'); }
    else { p.separated919 = l.age; if (p.affection108 != null) p.affection108 = U.clamp(p.affection108 - 20, 0, 100); log(p.name + ' nói cần sống tiếp cuộc đời mình; hai người ly thân. Chuyện có thể khác khi bạn ra tù.', 'bad'); } }
  function illYear(l, r, log) {
    var s = st(l), i = l.ill; if (!i || !(i.chronic || (i.mult || 1) >= 2) || l.age - (i.since || l.age) < 2) return; if (s.illAt != null && l.age - s.illAt < 3) return;
    var carers = (B() ? B().circle(l) : []).filter(function (c) { return !c.far; }); if (!carers.length) return; s.illAt = l.age; s.ill = { at: l.age, carer: carers[0].name, key: carers[0].key };
    X.next(l, 'illCare919', r, {}, { manual: false });
  }
  X.menu('illCare919', 'Người chăm sóc khi bạn bệnh lâu ngày', function (l) { return st(l).ill && st(l).ill.at === l.age ? true : 'Không có chuyện cần bàn'; }, function (l) { var q = st(l).ill; return q.carer + ' đã chăm sóc bạn nhiều năm và bắt đầu mệt mỏi, ít ngủ, bỏ dở việc riêng. Chia sẻ việc chăm sóc không có nghĩa là bị bỏ rơi.'; },
    function (l) { var q = st(l).ill, aide = l.base * 0.12, c = (B() ? B().circle(l) : []).find(function (x) { return x.key === q.key; }); function bond(d) { if (c && c.ref) { if (c.ref.affection108 != null) c.ref.affection108 = U.clamp(c.ref.affection108 + d, 0, 100); else c.ref.close = U.clamp((c.ref.close || 55) + d, 0, 100); } }
      return [{ k: 'aide', l: 'Thuê người chăm sóc vài giờ mỗi ngày', h: '~' + mo(l, aide) + '/năm', why: l.money >= aide ? true : 'Chưa đủ tiền', run: function (l, r, log) { H.cash(l, -aide, 'Người chăm sóc tại nhà'); bond(5); if (l.flags.care919) l.flags.care919.care = { kind: 'aide2', at: l.age, burden: 10 }; log(q.carer + ' được nghỉ ngơi hơn; quan hệ hai người nhẹ nhõm hẳn.', 'good'); } },
        { k: 'share', l: 'Nhờ người thân khác cùng chia việc', run: function (l, r, log) { var ok = r() < 0.55; bond(ok ? 4 : -1); log(ok ? 'Người thân chia lịch chăm sóc; ' + q.carer + ' có thời gian cho mình.' : 'Người thân bận, chỉ giúp được thỉnh thoảng; mọi người tiếp tục bàn.', ok ? 'good' : 'neutral'); } },
        { k: 'thanks', l: 'Nói lời cảm ơn, cùng đặt giới hạn để người chăm không kiệt sức', run: function (l, r, log) { bond(3); log('Hai người thống nhất nghỉ một ngày mỗi tuần cho người chăm.', 'neutral'); } }]; }, 0);
  function sibYear(l, r, log) {
    var s = st(l), f = l.fam || {}, alive = f.mAlive || f.fAlive && !f.noDad, sibs = (l.sibList || []).filter(function (t) { return t.alive !== false && l.age - (t.born || 0) >= 18 - (t.born || 0) && l.age + (-(t.born || 0)) >= 18; });
    if (!l.flags.fdNuoi) return; var q = s.fd || (s.fd = { plan: l.flags.fdNuoi, at: l.age, burden: l.flags.fdNuoi === 'nhan' ? 20 : 10 });
    if (q.closed) return; if (!alive) { q.closed = l.age; var x = u(l.id + ':fdend'); log(x < 0.5 ? 'Sau khi bố mẹ mất, anh chị em ngồi lại ôn chuyện những năm chăm bố mẹ; những hiềm khích cũ dịu đi.' : 'Bố mẹ mất rồi, chuyện ai lo nhiều hơn vẫn để lại khoảng cách giữa anh chị em.', 'neutral'); if (x < 0.5) (l.sibList || []).forEach(function (t) { t.close = Math.min(100, (t.close || 50) + 6); }); return; }
    if (q.yearAt === l.age) return; q.yearAt = l.age; q.burden = U.clamp(q.burden + ({ nhan: 10, chia: 4, vien: 2 }[q.plan] || 5), 0, 100);
    if (q.plan === 'vien' && l.indep) H.cash(l, -l.base * 0.25, 'Góp tiền thuê người chăm bố mẹ');
    if (q.burden >= 40 && (q.askAt == null || l.age - q.askAt >= 2) && sibs.length) { q.askAt = l.age; X.next(l, 'sibCare919', r, {}, { manual: false }); }
  }
  X.menu('sibCare919', 'Anh chị em chia trách nhiệm chăm bố mẹ', function (l) { var q = st(l).fd; return q && !q.closed && q.askAt === l.age ? true : 'Không có chuyện cần bàn'; }, function (l) { var q = st(l).fd; return 'Bạn đã lo cho bố mẹ ' + (l.age - q.at) + ' năm theo cách "' + { nhan: 'đón về ở cùng', chia: 'luân phiên', vien: 'góp tiền thuê người chăm' }[q.plan] + '". Mức mệt mỏi ' + Math.round(q.burden) + '/100. Mỗi anh chị em có hoàn cảnh riêng; không ai bị ép, nhưng có thể bàn lại.'; },
    function (l) { var q = st(l).fd, sibs = (l.sibList || []).filter(function (t) { return t.alive !== false; });
      return [{ k: 'money', l: 'Đề nghị anh chị em góp tiền thuê người chăm', run: function (l, r, log) { var got = 0, names = []; sibs.forEach(function (t) { if (r() < 0.25 + (t.close || 50) / 200) { var v = l.base * 0.05; got += v; names.push(t.n || t.name); } else t.close = Math.max(0, (t.close || 50) - 4); }); if (got) H.cash(l, got, 'Anh chị em góp tiền chăm bố mẹ'); q.burden -= got ? 20 : 5; log(got ? names.join(', ') + ' đồng ý góp tiền (' + mo(l, got) + '/năm nay).' : 'Chưa ai góp được; mỗi nhà đều có khó khăn riêng.', got ? 'good' : 'neutral'); } },
        { k: 'rota', l: 'Đề nghị luân phiên đón bố mẹ', run: function (l, r, log) { var ok = r() < 0.5; q.plan = ok ? 'chia' : q.plan; q.burden -= ok ? 25 : 0; sibs.forEach(function (t) { t.close = U.clamp((t.close || 50) + (ok ? 3 : -5), 0, 100); }); log(ok ? 'Cả nhà thống nhất lịch luân phiên.' : 'Đề nghị luân phiên chưa được đồng ý; không khí họp gia đình căng thẳng.', ok ? 'good' : 'bad'); } },
        { k: 'mediate', l: 'Họp gia đình có người trung gian (họ hàng/tư vấn)', h: mo(l, l.base * 0.01), run: function (l, r, log) { H.cash(l, -l.base * 0.01, 'Tư vấn gia đình'); var ok = r() < 0.7; q.burden -= ok ? 30 : 5; sibs.forEach(function (t) { t.close = U.clamp((t.close || 50) + (ok ? 6 : 0), 0, 100); }); log(ok ? 'Buổi họp có người trung gian giúp mọi người nói ra; có thỏa thuận chia việc rõ ràng.' : 'Buổi họp chưa có kết quả, nhưng mọi người chịu nghe nhau hơn.', ok ? 'good' : 'neutral'); } },
        { k: 'alone', l: 'Tự tiếp tục lo, không bàn thêm', run: function (l, r, log) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + 6, 0, 100); log('Bạn tiếp tục một mình; mệt nhưng không muốn tranh cãi.', 'neutral'); } }]; }, 0);

  // ================= D11: khóa tiếng 1 năm, việc học ở nước ngoài, học nghề Đức, nghiên cứu sinh =================
  var LYC = ['DE', 'FR', 'JP', 'KR', 'CN', 'TW', 'PL', 'CZ', 'IT', 'ES'];
  function goTemp(l, code, abroad) {
    var host = W.BY[code], from = W.BY[res(l)] || W.BY[l.country], f = l.cur === 'vnd' ? 1e6 / C.VND / C.priceLevel(host.gdp) : C.priceLevel(from.gdp) / C.priceLevel(host.gdp);
    var save = { abroad: l.abroad ? JSON.parse(JSON.stringify(l.abroad)) : null, place: l.place, city: l.city, urban: l.urban, movedTo: l.movedTo, base: l.base, gdp: l.gdp, cur: l.cur, factor: f };
    E.abroadConvert(l, f); if (l.cur === 'vnd') l.cur = 'usd'; l.abroad = abroad; l.place = l.city = host.cities[0]; l.urban = true; l.gdp = host.gdp; H.setBase(l); return save;
  }
  function backTemp(l, save) { E.abroadConvert(l, 1 / save.factor); ['abroad', 'place', 'city', 'urban', 'movedTo', 'base', 'gdp', 'cur'].forEach(function (k) { l[k] = save[k]; }); }
  function lyCost(l, c) { var p = GL.P[c]; return usd(l, 6000 + (p ? p.live : 12000)); }
  function lyWhy(l, c) { if (l.age < 17 || l.age > 35) return 'Dành cho người 17–35 tuổi'; if (l.abroad || l.school) return 'Cần đang ở trong nước, không đang đi học'; if (!passOk(l)) return 'Cần hộ chiếu còn hạn'; if (st(l).ly && !st(l).ly.done) return 'Đang có khóa học tiếng'; if (l.money < lyCost(l, c) * 1.1) return 'Cần học phí, sinh hoạt một năm và dự phòng'; return true; }
  X.menu('langYear919', 'Khóa học tiếng một năm ở nước ngoài', function (l) { return X.reason(l, 17); }, function (l) { var q = st(l).ly; return 'Khóa học tiếng là chương trình riêng với thị thực học tiếng; học xong không tự được vào đại học hay miễn học phí — muốn chuyển sang đại học phải nộp hồ sơ và xin visa đại học riêng. Trong năm học tiếng không làm công việc cũ.' + (q ? '\nGần nhất: ' + cname(q.code) + (q.done ? ' — đã hoàn thành' : ' — đang học') + (q.cont ? ', có ý định học tiếp đại học' : '') + '.' : ''); },
    function (l) { var q = st(l).ly, out = [];
      if (q && !q.done && res(l) === q.code) out.push({ k: 'cont', l: (q.cont ? '✓ ' : '') + 'Đăng ký xét tuyển đại học tại ' + cname(q.code) + ' khi kết thúc khóa', h: 'Xét bằng trình độ tiếng sau khóa; visa đại học xin riêng', run: function () { q.cont = true; } });
      LYC.filter(function (c) { return W.BY[c] && c !== l.country; }).forEach(function (c) { out.push({ k: 'go:' + c, l: 'Học tiếng một năm tại ' + cname(c), h: '~' + mo(l, lyCost(l, c)) + ' học phí + sinh hoạt · visa học tiếng xét riêng', why: lyWhy(l, c), run: function (l, r, log) {
        if (lyWhy(l, c) !== true) return; H.cash(l, -l.base * 0.01, 'Lệ phí visa học tiếng'); if (r() > 0.85) { log('Visa học tiếng ' + cname(c) + ' chưa được cấp; có thể nộp lại năm sau.', 'neutral'); return; }
        if (l.job) { log('Bạn nghỉ việc để đi học tiếng.', 'neutral'); l.job = null; l.income = 0; }
        H.cash(l, -lyCost(l, c), 'Khóa học tiếng một năm tại ' + cname(c)); var save = goTemp(l, c, { code: c, name: W.BY[c].name, pool: String(W.BY[c].pool).split(',')[0].split(':')[0], study: true, until: l.age + 1, perm: false, langCourse919: true });
        st(l).ly = { code: c, at: l.age, save: save, done: false }; log('Bạn sang ' + cname(c) + ' học tiếng một năm.', 'big'); } }); });
      return out; }, 17, 'Học tập');
  function lyYear(l, r, log) {
    var q = st(l).ly; if (!q || q.done || l.age <= q.at) return; q.done = l.age; var k = I.langOf(q.code), x = I.rec(l, k);
    ['lis', 'spk', 'rd', 'wr'].forEach(function (f) { x[f] = Math.min(100, x[f] + (100 - x[f]) * 0.3); }); x.last = l.age;
    var sw = q.cont && E.FIN920 ? E.FIN920.switchRule(q.code) : null; // 8.10.24 (MD5 FIN-04): đổi diện tại chỗ chỉ khi quy định nước đó cho phép
    backTemp(l, q.save); delete q.save; log('Kết thúc khóa tiếng tại ' + cname(q.code) + ': ' + I.lname(k) + ' lên mức ' + I.band(I.skill(l, k)) + '.' + (sw && sw.mode === 'onshore' ? ' Bạn nộp hồ sơ đại học ngay tại ' + cname(q.code) + ' và được ở lại chờ kết quả trong thời hạn cư trú còn lại.' : ' Bạn về nước.' + (sw ? ' ' + sw.note : '')), 'good');
    if (q.cont) { E.GLOBAL919.state(l).track[q.code] = GL.P[q.code] && GL.P[q.code].instr.indexOf(k) >= 0 ? k : 'en'; var d = { country: q.code, lv: 5 }, a = GL.admit(l, d, r);
      if (!a.ok) { log('Hồ sơ đại học tại ' + cname(q.code) + ' chưa được nhận' + (a.why ? ': ' + a.why : '') + '.' + (sw && sw.mode === 'onshore' ? ' Giấy phép học tiếng hết hạn nên bạn về nước; có thể nộp lại từ trong nước.' : ''), 'neutral'); return; }
      if (sw) q.switch920 = { mode: sw.mode, at: l.age };
      var t = GL.tuitionTotal(l, d), fields = E.POSTGRAD106 ? Object.keys(E.POSTGRAD106.fields).filter(function (f) { return f !== 'med'; }) : ['it']; l.flags.studyVisa900 = { country: q.code, lv: 5, school: 0, field: fields[0], scholar: false, track919: a.track, until: l.age + 1, deposit: 0, unpaid919: t || 0 };
      if (!(t > 0)) delete l.flags.studyVisa900.unpaid919; if (sw && sw.mode === 'onshore') l.flags.studyVisa900.onshore920 = q.code; log('Được nhận vào đại học tại ' + cname(q.code) + '. Chuyển sang diện du học đại học cần xin visa đại học riêng' + (t > 0 ? ' và nộp học phí' : '') + '; không tự động.', 'good'); }
  }
  X.menu('studyAbroad919', 'Việc học ở nước ngoài: bảo lưu, chuyển trường, dừng học', function (l) { var s = l.flags.study107; return s && !s.finished && l.abroad && l.abroad.study && l.school ? true : 'Cần đang du học'; }, function (l) { var s = l.flags.study107; return 'Đang học ' + s.school + ' tại ' + cname(s.country) + ', dự kiến xong khi ' + l.schoolEnd + ' tuổi. Mỗi thay đổi phải báo trường và cơ quan cấp phép cư trú; dừng học thì giấy phép du học chấm dứt.'; },
    function (l) { var s = l.flags.study107, pg = l.flags.pg106;
      return [{ k: 'defer', l: 'Bảo lưu một năm (gia hạn giấy phép cư trú)', h: mo(l, l.base * 0.01), why: s.defer919 != null ? 'Đã bảo lưu một lần' : true, run: function (l, r, log) { H.cash(l, -l.base * 0.01, 'Gia hạn cư trú khi bảo lưu'); s.defer919 = l.age; l.schoolEnd++; l.abroad.until++; if (pg && pg.end) pg.end++; log('Bạn bảo lưu một năm; thời gian học và giấy phép cư trú kéo dài tương ứng.', 'neutral'); } },
        { k: 'transfer', l: 'Chuyển sang trường khác trong ' + cname(s.country), h: 'Phí hồ sơ ' + mo(l, l.base * 0.02) + ' · có thể mất tín chỉ', why: s.transfer919 === l.age ? 'Đã chuyển năm nay' : true, run: function (l, r, log) { var list = (GL.UNIS[s.country] || []).filter(function (x) { return x !== s.school; }), nm = list[0] || 'một trường đại học khác tại ' + cname(s.country); H.cash(l, -l.base * 0.02, 'Hồ sơ chuyển trường'); if (r() < 0.25) { log('Trường mới chưa nhận hồ sơ chuyển; bạn tiếp tục ở trường cũ.', 'neutral'); return; } s.transfer919 = l.age; s.school = nm; if (l.uniName) l.uniName = nm; var lost = r() < 0.5; if (lost) { l.schoolEnd++; l.abroad.until++; if (pg && pg.end) pg.end++; } log('Bạn chuyển sang ' + nm + (lost ? '; một số tín chỉ không được công nhận nên học thêm một năm.' : '; tín chỉ được công nhận.'), 'neutral'); } },
        { k: 'drop', l: 'Dừng học', h: 'Giấy phép du học chấm dứt; cần về nước hoặc đổi diện cư trú hợp lệ', run: function (l, r, log) { s.finished = 'dropped'; s.dropped919 = l.age; l.school = null; l.schoolEnd = null; if (pg) { pg.done = true; pg.dropped919 = l.age; } l.abroad.study = false; l.abroad.until = l.age; log('Bạn dừng học. Giấy phép cư trú du học hết hiệu lực trong năm; không tự chuyển thành cư trú làm việc.', 'bad'); } }]; }, 18, 'Học tập');
  var AUS = { pflege: 'Điều dưỡng (Pflegefachmann/-frau)', mecha: 'Cơ điện tử (Mechatroniker)', koch: 'Đầu bếp (Koch)', elektro: 'Điện tử (Elektroniker)' };
  function ausWhy(l) { if (l.age < 16 || l.age > 35) return 'Dành cho người 16–35 tuổi'; if (l.abroad) return 'Cần đang ở trong nước'; if (!passOk(l)) return 'Cần hộ chiếu còn hạn'; if (I.skill(l, 'de') < 55) return 'Cần tiếng Đức khoảng B1 (kỹ năng 55+, hiện ' + Math.round(I.skill(l, 'de')) + ')'; if (st(l).aus && !st(l).aus.done) return 'Đang có hợp đồng học nghề'; if (l.money < l.base * 0.3) return 'Cần chi phí hồ sơ, vé và dự phòng'; return true; }
  X.menu('ausbildung919', 'Học nghề kép tại Đức (Ausbildung)', function (l) { return X.reason(l, 16); }, function (l) { var q = st(l).aus; return 'Học nghề kép: hợp đồng với doanh nghiệp, học ở trường nghề xen kẽ làm việc, có phụ cấp hằng tháng, thường 3 năm; cần tiếng Đức. Hoàn thành mở cơ hội làm việc và cư trú tiếp, không bảo đảm thường trú. Phụ cấp tùy ngành, không phải lương đầy đủ.' + (q ? '\nHợp đồng: ' + AUS[q.field] + (q.done ? ' — đã hoàn thành' : ' — năm thứ ' + (l.age - q.at + 1)) : ''); },
    function (l) { return Object.keys(AUS).map(function (f) { return { k: f, l: 'Ứng tuyển ' + AUS[f], why: ausWhy(l), run: function (l, r, log) { if (ausWhy(l) !== true) return; H.cash(l, -l.base * 0.08, 'Hồ sơ, visa học nghề Đức'); if (r() > 0.45 + I.skill(l, 'de') / 250) { log('Doanh nghiệp chưa chọn hồ sơ của bạn; có thể ứng tuyển lại.', 'neutral'); return; }
      st(l).aus = { field: f, at: l.age, done: false }; l.abroad = { code: 'DE', name: W.BY.DE.name, until: l.age + 3, mult: 0.45, perm: false, labor919: { ausb: f, at: l.age, permit: 'đào tạo nghề' } }; l.prevJob = l.job; l.school = null; l.job = { id: 'xkld', rank: 0, yrs: 0, t: 'Học nghề kép: ' + AUS[f] }; l.indep = true; l.flags.needJob = false;
      log('Bạn ký hợp đồng học nghề ' + AUS[f] + ' tại Đức; vừa học vừa làm, có phụ cấp hằng tháng.', 'big'); H.mem(l, 'Ngày bắt đầu học nghề ở Đức.', 4); } }; }); }, 16, 'Nghề nghiệp');
  function ausYear(l, log) { var q = st(l).aus; if (!q || q.done || l.age - q.at < 3) return; if (!(l.abroad && l.abroad.code === 'DE' && l.job && l.job.id === 'xkld')) { q.done = 'left'; return; } q.done = l.age; l.abroad.until = l.age + 3; l.abroad.mult = 1; l.job.t = AUS[q.field].split(' (')[0] + ' tại Đức'; if (q.field === 'pflege') recogState(l)['DE:nurse'] = { stage: 'done', at: l.age, via: 'ausbildung' }; log('Hoàn thành học nghề ' + AUS[q.field] + '; được doanh nghiệp nhận làm chính thức, giấy phép cư trú lao động được gia hạn.', 'good'); }
  function phdYear(l) { var q = l.flags.phd919; if (!q || !q.funded || l.school !== 'phd' || !l.abroad || st(l).phdAt === l.age) return; st(l).phdAt = l.age; H.cash(l, usd(l, 24000), 'Lương nghiên cứu sinh (hợp đồng nghiên cứu)'); }

  // ================= D12: công nhận bằng, lộ trình thường trú =================
  var RECOG = { 'DE:nurse': ['Đức', 'điều dưỡng', 'de', 65], 'DE:teacher': ['Đức', 'giáo viên', 'de', 70], 'JP:nurse': ['Nhật', 'điều dưỡng/chăm sóc (kaigo)', 'ja', 60], 'GB:nurse': ['Anh', 'điều dưỡng (NMC)', 'en', 65], 'AU:nurse': ['Úc', 'điều dưỡng (AHPRA)', 'en', 65], 'CA:nurse': ['Canada', 'điều dưỡng', 'en', 65] };
  function recogState(l) { var s = st(l); return s.recog || (s.recog = {}); }
  function recognized(l, cc) { var r = recogState(l); return Object.keys(r).some(function (k) { return k.indexOf(cc + ':') === 0 && r[k].stage === 'done'; }); }
  function degreeFits(l, prof) { var m = String(l.major || '') + ' ' + String(l.majorName || '') + ' ' + (l.job ? l.job.id : ''); return prof === 'nurse' ? /med|y_|yte|y tế|dieu_duong|điều dưỡng|y_ta|bac_si/.test(m) : /edu|su_pham|giao_vien|giáo/.test(m); }
  X.menu('recog919', 'Công nhận bằng nghề ở nước ngoài', function (l) { return X.reason(l, 18); }, function (l) { var r = recogState(l); return 'Nghề được quản lý (điều dưỡng, giáo viên…) phải được cơ quan nước đến công nhận bằng trước khi hành nghề: nộp hồ sơ → thẩm định → có thể phải học bù hoặc thi kiến thức → công nhận. Cần trình độ ngôn ngữ nghề nghiệp; không có visa du lịch hay hợp đồng thay cho bước này.' + Object.keys(r).map(function (k) { return '\n• ' + RECOG[k][0] + ' — ' + RECOG[k][1] + ': ' + { submitted: 'đang thẩm định', partial: 'cần học bù/thi kiến thức', adapt: 'đang học bù', done: 'đã công nhận' }[r[k].stage]; }).join(''); },
    function (l) { var r = recogState(l), out = []; Object.keys(RECOG).forEach(function (k) { var R = RECOG[k], cur = r[k], prof = k.split(':')[1], fee = l.base * 0.03;
      if (!cur) out.push({ k: 'sub:' + k, l: 'Nộp hồ sơ công nhận ' + R[1] + ' tại ' + R[0], h: 'Phí ~' + mo(l, fee) + ' · thẩm định khoảng 1 năm', why: !degreeFits(l, prof) && l.edu < 4 ? 'Cần bằng ngành phù hợp' : I.skill(l, R[2]) < R[3] - 15 ? 'Cần ' + I.lname(R[2]) + ' gần mức nghề nghiệp (kỹ năng ' + (R[3] - 15) + '+)' : l.money < fee ? 'Chưa đủ phí' : true, run: function (l, r0, log) { H.cash(l, -fee, 'Hồ sơ công nhận bằng ' + R[1]); r[k] = { stage: 'submitted', at: l.age }; log('Nộp hồ sơ công nhận bằng ' + R[1] + ' tại ' + R[0] + '.', 'neutral'); } });
      else if (cur.stage === 'partial') out.push({ k: 'adapt:' + k, l: 'Học bù/thi kiến thức để được công nhận ' + R[1] + ' (' + R[0] + ')', h: mo(l, l.base * 0.05), why: l.money >= l.base * 0.05 ? true : 'Chưa đủ tiền', run: function (l, r0, log) { H.cash(l, -l.base * 0.05, 'Khóa bù/thi kiến thức'); cur.stage = 'adapt'; cur.adaptAt = l.age; log('Bạn đăng ký khóa học bù và kỳ thi kiến thức; kết quả năm sau.', 'neutral'); } });
    }); if (!out.length) out.push({ k: 'none', l: 'Không có bước nào cần làm lúc này', run: function () { } }); return out; }, 18, 'Nghề nghiệp');
  function recogYear(l, log) { var r = recogState(l); Object.keys(r).forEach(function (k) { var q = r[k], R = RECOG[k]; if (!R || q.stage === 'done' || q.yr === l.age) return; q.yr = l.age;
    if (q.stage === 'submitted' && l.age > q.at) { var full = degreeFits(l, k.split(':')[1]) && u(l.id + ':rec:' + k) < 0.4; q.stage = full ? 'done' : 'partial'; log('Kết quả thẩm định bằng ' + R[1] + ' tại ' + R[0] + ': ' + (full ? 'được công nhận tương đương.' : 'công nhận một phần; cần học bù hoặc thi kiến thức.'), full ? 'good' : 'neutral'); }
    else if (q.stage === 'adapt' && l.age > q.adaptAt) { var ok = u(l.id + ':adapt:' + k + ':' + l.age) < 0.45 + (I.skill(l, R[2]) - R[3]) / 100 + 0.15; q.stage = ok ? 'done' : 'partial'; log(ok ? 'Bạn vượt qua kỳ thi kiến thức; bằng ' + R[1] + ' được công nhận tại ' + R[0] + '.' : 'Chưa đạt kỳ thi kiến thức ' + R[1] + '; có thể thi lại.', ok ? 'good' : 'neutral'); } }); }
  var PRR = { DE: { y: 5, s: 3, k: 'de', sk: 45, n: 'Giấy phép định cư (Niederlassungserlaubnis); diện lao động có tay nghề sớm hơn' }, JP: { y: 10, s: 5, k: 'ja', sk: 55, n: 'Thường trú cần thời gian cư trú dài; diện chuyên môn/kỹ năng cao sớm hơn' }, KR: { y: 5, s: 4, k: 'ko', sk: 45, n: 'Chuyển diện lao động kỹ năng rồi mới xét thường trú' }, TW: { y: 6, s: 6, k: 'zh', sk: 40, n: 'Lao động phổ thông có thể chuyển sang diện kỹ năng trung cấp sau 6 năm; thường trú là bước sau' },
    PL: { y: 5, s: 5, k: 'pl', sk: 45, n: 'Thẻ cư trú dài hạn EU sau 5 năm cư trú hợp pháp' }, RO: { y: 5, s: 5, k: 'ro', sk: 35, n: 'Cư trú dài hạn sau 5 năm' }, HU: { y: 3, s: 3, k: 'hu', sk: 35, n: 'Giấy phép định cư quốc gia sau 3 năm (tham số mô phỏng)' }, AU: { y: 4, s: 3, k: 'en', sk: 60, reg: 3, n: 'Diện tay nghề/vùng ưu tiên (regional) có thể rút ngắn; vẫn xét điểm và hạn ngạch' },
    CA: { y: 2, s: 1, k: 'en', sk: 60, reg: 1, n: 'Canadian Experience Class / chương trình tỉnh bang; xét theo điểm' }, GB: { y: 5, s: 5, k: 'en', sk: 55, n: 'Indefinite Leave to Remain: Skilled Worker thường cần 5 năm diện đủ điều kiện, đáp ứng lương và xác nhận bảo trợ (GOV.UK)' }, US: { y: 99, s: 99, k: 'en', sk: 50, n: 'Thường trú chủ yếu qua bảo lãnh của chủ sử dụng/gia đình, có hàng đợi theo quốc gia; không có lộ trình chỉ theo số năm' } };
  function prRule(c) { return PRR[c] || { y: 99, s: 99, k: I.langOf(c), sk: 45, n: 'Chưa có lộ trình thường trú được đối chiếu cho nước này' }; }
  function shortage(l) { var c = l.job && E.jobDef ? E.jobDef(l) : null; return !!(c && /med|it|edu/.test(c.cat || '')) || !!(st(l).aus && st(l).aus.done) || recognized(l, res(l)); }
  function regional(l) { var b = W.BY[res(l)]; return !!b && b.cities.slice(0, 3).indexOf(l.city) < 0; }
  function prYears(l) { var R = prRule(res(l)); return Math.min(R.y, shortage(l) ? R.s : R.y, R.reg && regional(l) ? R.reg : 99); }
  function prWhy(l) { var a = l.abroad, s = st(l), R = prRule(res(l)), wy = (s.wy || {})[res(l)] || 0, blk = E.FIN920 && E.FIN920.resBlock(l, res(l), 'pr'); if (blk) return blk; if (!a || a.perm || a.visit907) return 'Cần đang cư trú có thời hạn ở nước ngoài'; if (!l.job || a.study || a.residence900 && a.residence900.kind !== 'worker' || E.ABROAD_DEPTH900 && !E.ABROAD_DEPTH900.valid(l)) return 'Cần đang làm việc theo diện lao động còn hiệu lực'; if (R.y >= 99) return R.n; if (wy < prYears(l)) return 'Cần ' + prYears(l) + ' năm làm việc hợp pháp (đã có ' + wy + ')'; if (I.skill(l, R.k) < R.sk) return 'Cần ' + I.lname(R.k) + ' kỹ năng ' + R.sk + '+'; if (s.pr && !s.pr.done) return 'Đang có hồ sơ chờ'; if (l.money < l.base * 0.05) return 'Chưa đủ lệ phí'; return true; }
  X.menu('pr919', 'Lộ trình thường trú ở nước đang làm việc', function (l) { return l.abroad && !l.abroad.perm ? X.reason(l, 18) : 'Cần đang sống ở nước ngoài có thời hạn'; }, function (l) { var R = prRule(res(l)), wy = (st(l).wy || {})[res(l)] || 0; return cname(res(l)) + ': ' + R.n + '. Trong trò chơi cần khoảng ' + (R.y >= 99 ? '—' : prYears(l)) + ' năm làm việc hợp pháp (bạn đã có ' + wy + ')' + (shortage(l) && R.s < R.y ? '; ngành của bạn đang thiếu nhân lực nên được xét sớm hơn' : '') + (R.reg && regional(l) ? '; bạn sống ở vùng ưu tiên' : '') + '. Thường trú không phải quốc tịch và không bảo đảm được duyệt.'; },
    function (l) { return [{ k: 'apply', l: 'Nộp hồ sơ thường trú', h: mo(l, l.base * 0.05) + ' · xét khoảng 1 năm', why: prWhy(l), run: function (l, r, log) { if (prWhy(l) !== true) return; H.cash(l, -l.base * 0.05, 'Lệ phí hồ sơ thường trú'); st(l).pr = { code: res(l), at: l.age, done: false }; log('Nộp hồ sơ thường trú tại ' + cname(res(l)) + '.', 'neutral'); } }]; }, 18, 'Đời sống');
  function prYear(l, log) {
    var s = st(l); if (l.abroad && !l.abroad.perm && !l.abroad.visit907 && !l.abroad.study && (!l.abroad.residence900 || l.abroad.residence900.kind === 'worker') && (!E.ABROAD_DEPTH900 || E.ABROAD_DEPTH900.valid(l)) && l.job && s.wyAt !== l.age) { s.wyAt = l.age; s.wy = s.wy || {}; s.wy[res(l)] = (s.wy[res(l)] || 0) + 1; }
    var q = s.pr; if (!q || q.done || l.age <= q.at) return; q.done = l.age; var R = prRule(q.code);
    if (!l.abroad || res(l) !== q.code) { log('Hồ sơ thường trú dừng vì bạn không còn sống tại ' + cname(q.code) + '.', 'neutral'); return; }
    if (R.y >= 99) { H.cash(l, l.base * 0.05, 'Hoàn phí hồ sơ thường trú chưa có lộ trình'); return; }
    var ok = u(l.id + ':pr:' + q.at) < U.clamp(0.55 + (shortage(l) ? 0.15 : 0) + (I.skill(l, R.k) - R.sk) / 150 - (l.record > 0 ? 0.35 : 0), 0.1, 0.9);
    if (ok) { l.abroad.perm = true; l.abroad.until = null; if (l.abroad.residence900) { l.abroad.residence900.kind = 'permanent'; l.abroad.residence900.until = null; } log('Được cấp thường trú tại ' + cname(q.code) + '. Bạn có quyền cư trú lâu dài; quốc tịch là thủ tục riêng sau nhiều năm.', 'good'); H.mem(l, 'Ngày nhận thẻ thường trú tại ' + cname(q.code) + '.', 5); }
    else log('Hồ sơ thường trú tại ' + cname(q.code) + ' chưa được chấp thuận năm nay; có thể nộp lại khi hồ sơ mạnh hơn.', 'neutral');
  }

  // ================= D07: chăn nuôi và bệnh gia súc =================
  var SPC = { cattle: { n: 'trâu/bò', price: 0.3, net: 0.05, unit: 1, vac: 0.004 }, pig: { n: 'lợn', price: 0.06, net: 0.015, unit: 5, vac: 0.002 }, poultry: { n: 'gà vịt (100 con)', price: 0.1, net: 0.035, unit: 1, vac: 0.01 } };
  var LD = {
    cattle: [{ id: 'hs', n: 'tụ huyết trùng (Pasteurella multocida)', inc: 0.04, vacc: 0.2, loss: 0.3, region: 'asia africa' }, { id: 'fmd', n: 'lở mồm long móng', inc: 0.025, vacc: 0.2, loss: 0.08, notify: true }, { id: 'anthrax', n: 'bệnh than', inc: 0.003, vacc: 0.1, loss: 0.3, notify: true, zoo: 0.05, region: 'asia africa' }],
    pig: [{ id: 'asf', n: 'dịch tả lợn châu Phi', inc: 0.03, vacc: 0.6, loss: 1, notify: true, cull: true, region: 'asia europe' }, { id: 'hsp', n: 'tụ huyết trùng lợn', inc: 0.025, vacc: 0.2, loss: 0.25 }, { id: 'fmd', n: 'lở mồm long móng', inc: 0.02, vacc: 0.2, loss: 0.1, notify: true }],
    poultry: [{ id: 'hpai', n: 'cúm gia cầm độc lực cao (H5N1)', inc: 0.025, vacc: 0.3, loss: 1, notify: true, cull: true, zoo: 0.01 }, { id: 'nd', n: 'Newcastle', inc: 0.04, vacc: 0.2, loss: 0.5 }]
  };
  var REG = { asia: 'VN TH ID PH KH LA MM CN IN BD PK NP LK MY KR JP MN', africa: 'NG GH KE ET TZ UG ZA SN CM ZW ZM', europe: 'PL DE IT RO HU BG RS UA RU EE LV LT' };
  function inRegion(l, d) { if (!d.region) return true; return d.region.split(' ').some(function (k) { return REG[k].split(' ').indexOf(res(l)) >= 0; }); }
  function farm(l) { var s = st(l); return s.farm || (s.farm = { herd: { cattle: 0, pig: 0, poultry: 0 }, vac: {}, bio: false, hist: [] }); }
  function farmWhy(l) { var r = X.reason(l, 18); if (r !== true) return r; if (!l.indep) return 'Cần tự lập'; if (l.urban && !(l.job && /nong|chan_nuoi|farm/.test(l.job.id))) return 'Cần sống ở nông thôn hoặc làm nghề nông'; return true; }
  X.menu('farm919', 'Chăn nuôi gia súc, gia cầm và thú y', farmWhy, function (l) { var f = farm(l); return 'Đàn: ' + Object.keys(SPC).map(function (k) { return SPC[k].n + ' ' + f.herd[k] * (k === 'pig' ? 1 : 1); }).join(', ') + '. Tiêm phòng theo lịch giảm nguy cơ có giới hạn; nhiều bệnh (lở mồm long móng, dịch tả lợn châu Phi, cúm gia cầm, bệnh than) bắt buộc khai báo thú y. Mức hỗ trợ khi tiêu hủy là tham số mô phỏng.' + (f.bio ? ' Trại đã có biện pháp an toàn sinh học.' : '') + (f.hist.length ? '\nGần đây: ' + f.hist.slice(-3).map(function (h) { return h.age + ' tuổi: ' + h.t; }).join('; ') : ''); },
    function (l) { var f = farm(l), out = []; Object.keys(SPC).forEach(function (k) { var S = SPC[k], cost = l.base * S.price * S.unit;
      out.push({ k: 'buy:' + k, l: 'Mua thêm ' + (k === 'pig' ? '5 con lợn' : k === 'cattle' ? '1 con trâu/bò' : '100 con gà vịt'), h: mo(l, cost), why: l.money >= cost ? true : 'Chưa đủ tiền', run: function (l, r, log) { H.cash(l, -cost, 'Mua ' + S.n); f.herd[k] += S.unit; (f.buy920 || (f.buy920 = {}))[k] = l.age; log('Đàn ' + S.n + ' có thêm ' + S.unit + (k === 'poultry' ? ' lứa' : ' con') + '.', 'neutral'); } });
      if (f.herd[k] > 0) { out.push({ k: 'vac:' + k, l: 'Tiêm phòng cho đàn ' + S.n, h: mo(l, l.base * S.vac * f.herd[k]), why: f.vac[k] === l.age ? 'Đã tiêm năm nay' : true, run: function (l, r, log) { H.cash(l, -l.base * S.vac * f.herd[k], 'Tiêm phòng ' + S.n); f.vac[k] = l.age; log('Đàn ' + S.n + ' được tiêm phòng theo lịch của thú y.', 'good'); } });
        out.push({ k: 'sell:' + k, l: 'Bán toàn bộ ' + S.n, h: '~' + mo(l, l.base * S.price * f.herd[k] * 0.9), why: f.out && f.out.k === k && !f.out.done ? 'Đàn đang có dịch, không được bán' : true, run: function (l, r, log) { H.cash(l, l.base * S.price * f.herd[k] * 0.9, 'Bán ' + S.n); f.herd[k] = 0; log('Bán hết đàn ' + S.n + '.', 'neutral'); } }); } });
      if (!f.bio && (f.herd.cattle + f.herd.pig + f.herd.poultry)) out.push({ k: 'bio', l: 'Làm an toàn sinh học (rào chắn, khử trùng, khu cách ly)', h: mo(l, l.base * 0.05), run: function (l, r, log) { H.cash(l, -l.base * 0.05, 'An toàn sinh học trại chăn nuôi'); f.bio = true; log('Trại có rào chắn, hố khử trùng và khu cách ly; nguy cơ dịch giảm.', 'good'); } });
      return out; }, 18, 'Tiền bạc');
  function farmYear(l, r, log) {
    var f = st(l).farm; if (!f || f.yearAt === l.age) return; f.yearAt = l.age;
    Object.keys(SPC).forEach(function (k) { var n = f.herd[k]; if (!n) return; var S = SPC[k], price = 0.8 + u(l.id + ':mp:' + k + ':' + l.age) * 0.4; H.cash(l, l.base * S.net * n * price, 'Thu nhập chăn nuôi ' + S.n + ' (sau thức ăn, công)');
      if (f.out && !f.out.done) return; var x = u(l.id + ':ld:' + k + ':' + l.age), acc = 0;
      LD[k].filter(function (d) { return inRegion(l, d); }).some(function (d) { acc += d.inc * (f.vac[k] != null && l.age - f.vac[k] <= 1 ? d.vacc : 1) * (f.bio ? 0.6 : 1); if (x < acc) { f.out = { k: k, id: d.id, at: l.age, done: false }; X.next(l, 'farmOut919', r, {}, { manual: false }); return true; } return false; }); });
  }
  function dz(f) { return LD[f.out.k].find(function (d) { return d.id === f.out.id; }); }
  E.SC('farmOut919', { title: 'Dịch bệnh trong đàn', valid: function (l) { var f = st(l).farm; return l.alive && !!f && !!f.out && !f.out.done; },
    text: function (l) { var f = st(l).farm, d = dz(f), S = SPC[f.out.k]; return 'Đàn ' + S.n + ' có dấu hiệu ' + d.n + '. ' + (d.notify ? 'Đây là bệnh phải khai báo cho thú y địa phương; che giấu hoặc bán chạy vật bệnh là vi phạm và làm dịch lan.' : 'Thú y xã có thể đến khám, điều trị theo chỉ định.') + (d.zoo ? ' Bệnh có thể lây sang người khi tiếp xúc không bảo hộ.' : ''); },
    opts: [{ k: 'report', l: 'Báo thú y, làm theo hướng dẫn (cách ly, điều trị hoặc tiêu hủy có hỗ trợ)', run: function (l, r, log) { var f = st(l).farm, d = dz(f), S = SPC[f.out.k], n = f.herd[f.out.k], lost = Math.round(n * (d.cull ? 1 : d.loss * 0.5)), comp = d.cull ? l.base * S.price * lost * 0.35 : 0; f.herd[f.out.k] -= lost; if (comp) { if (E.FIN920) E.FIN920.cullClaim(l, f, d, lost, comp, log); else H.cash(l, comp, 'Hỗ trợ tiêu hủy theo chính sách (mô phỏng)'); } if (!d.cull) H.cash(l, -l.base * 0.01 * Math.max(1, n), 'Chi phí thú y điều trị đàn'); f.out.done = l.age; f.hist.push({ age: l.age, t: d.n + ', khai báo, mất ' + lost }); if (d.zoo && r() < d.zoo * 0.3) { H.fx(l, { hea: -5 }); log('Bạn có triệu chứng sau khi xử lý đàn bệnh; được cơ sở y tế theo dõi, điều trị.', 'bad'); } log('Thú y ' + (d.cull ? 'tiêu hủy đàn ' + S.n + ' trong vùng dịch' : 'điều trị, cách ly đàn') + '; mất ' + lost + (f.out.k === 'poultry' ? ' lứa' : ' con') + (comp ? ', nhận hỗ trợ ' + mo(l, comp) : '') + '.', 'bad'); } },
      { k: 'ppe', l: 'Báo thú y và tự tham gia xử lý có đồ bảo hộ đầy đủ', req: function (l) { var f = st(l).farm; return !!f && !!f.out && !!dz(f).zoo; }, run: function (l, r, log) { var f = st(l).farm, d = dz(f), S = SPC[f.out.k], n = f.herd[f.out.k]; f.herd[f.out.k] = 0; f.out.done = l.age; if (E.FIN920) E.FIN920.cullClaim(l, f, d, n, l.base * S.price * n * 0.35, log); else H.cash(l, l.base * S.price * n * 0.35, 'Hỗ trợ tiêu hủy theo chính sách (mô phỏng)'); f.hist.push({ age: l.age, t: d.n + ', khai báo, xử lý có bảo hộ' }); log('Bạn mặc đồ bảo hộ, cùng thú y xử lý đàn; không có ai bị lây.', 'neutral'); } },
      { k: 'hide', l: 'Giấu dịch, bán gấp vật còn khỏe', run: function (l, r, log) { var f = st(l).farm, d = dz(f), S = SPC[f.out.k], n = f.herd[f.out.k]; H.cash(l, l.base * S.price * n * 0.5, 'Bán gấp ' + S.n); f.herd[f.out.k] = 0; f.out.done = l.age; H.fx(l, { karma: -6 }); if (r() < 0.5) { H.cash(l, -l.base * 0.3, 'Phạt vi phạm phòng chống dịch'); log('Cơ quan thú y truy ra nguồn dịch từ đàn bán gấp; bạn bị phạt và cả xóm phải phun khử trùng.', 'bad'); } else log('Bạn bán gấp đàn ' + S.n + '; dịch vẫn lan sang mấy nhà bên cạnh.', 'bad'); f.hist.push({ age: l.age, t: d.n + ', giấu dịch' }); } }] });

  // ================= hook năm, bản lưu =================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return;
    tcYear(l, log); prisonYear(l, log); illYear(l, r, log); sibYear(l, r, log); lyYear(l, r, log); ausYear(l, log); phdYear(l); recogYear(l, log); prYear(l, log); farmYear(l, r, log);
  });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.md4b != null && typeof l.flags.md4b !== 'object') delete l.flags.md4b; };
  E.MD4B = { recognized: recognized, recogState: recogState, RECOG: RECOG, PRR: PRR, prYears: prYears, prWhy: prWhy, shortage: shortage, LD: LD, SPC: SPC, farm: farm, farmYear: farmYear, lyYear: lyYear, goTemp: goTemp, backTemp: backTemp, ausWhy: ausWhy, tc: tc, tcYear: tcYear, prisonYear: prisonYear, sibYear: sibYear, illYear: illYear, state: st };
})(globalThis.G);
