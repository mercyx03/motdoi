/* v4.5.7 — một đợt quân ngũ, lựa chọn còn hiệu lực, lịch hẹn không bị mất. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H;
  function served(l) { return l.flags.milDone || l.flags.milVet || l.flags.milReleasedAt != null || (l.log || []).some(function (x) { return /Lên đường nhập ngũ|Hoàn thành nghĩa vụ quân sự|Ra quân sau 24 tháng|Nhận trợ cấp xuất ngũ/.test(x.t); }); }
  E.canServe = function (l) {
    var id = l.job && E.resolveJob(l.job.id);
    return l.alive && l.sex === 'M' && l.age >= 18 && l.age <= 27 && !served(l) && !l.flags.military && !l.abroad && !(l.jailUntil != null && l.age < l.jailUntil) && l.st.hea >= 55 && !(l.ill && l.ill.mult >= 2) && id !== 'quan_doi' && id !== 'cong_an';
  };
  function start(l, r, log) {
    if (!E.canServe(l)) return;
    l.flags.milDone = true; l.flags.milSince = l.age; l.flags.military = l.age + 2;
    l.flags.milTB = false; l.flags.milRole = null; l.flags.milSeen = {}; l.school = null; l.flags.retryUni = null;
    log('Lên đường nhập ngũ, thực hiện nghĩa vụ quân sự trong hai năm.', 'big');
    H.chain(l, 'nv_don_vi'); H.chain(l, 'nv_tan_binh');
  }
  var uniMake = E.DEC.uni.make, uniApply = E.DEC.uni.apply;
  E.DEC.uni.make = function (l) { var d = uniMake.apply(this, arguments); if (!E.canServe(l)) d.opts = d.opts.filter(function (o) { return o.k !== 'military'; }); return d; };
  E.DEC.uni.apply = function (l, d, k, r, log) { if (k === 'military') { if (E.canServe(l)) start(l, r, log); return; } return uniApply.apply(this, arguments); };
  E.SC('nv_lenh_goi', { title: 'Đợt khám tuyển nghĩa vụ quân sự', valid: E.canServe,
    text: 'Bạn nhận lịch khám tuyển. Kết quả sức khỏe và hoàn cảnh hiện tại được xem xét trước khi nhập ngũ.',
    opts: [
      { k: 'di', l: 'Tham gia khám tuyển', run: function (l, r, log) { if (!E.canServe(l)) return; if (r() < 0.65) start(l, r, log); else { l.flags.milScreened = true; log('Đợt khám tuyển kết thúc, bạn không được chọn nhập ngũ trong đợt này.', 'neutral'); } } },
      { k: 'hoi', l: 'Hỏi hướng dẫn về sức khỏe và hoàn cảnh cá nhân', run: function (l, r, log) { if (E.canServe(l)) { l.flags.milScreened = true; log('Bạn trình bày hoàn cảnh và nhận hướng dẫn bổ sung hồ sơ. Chưa có quyết định nhập ngũ.', 'neutral'); } } }
    ] });
  // Tân binh / phân đơn vị / ra quân đều chỉ có một lần, kể cả mở lại lựa chọn cũ.
  Object.keys(E.DEC).filter(function (id) { return /^nv_/.test(id) && id !== 'nv_lenh_goi'; }).forEach(function (id) {
    var D = E.DEC[id], apply = D.apply, before = D.valid;
    D.valid = function (l, d) {
      if (!l.alive || !(l.flags.military > 0) || l.jailUntil != null && l.age < l.jailUntil) return false;
      if (id === 'nv_xuat_ngu') return l.age >= l.flags.military && !l.flags.milVet && l.flags.milReleasedAt == null;
      return l.age < l.flags.military && !(l.flags.milResolved || {})[id] && (!before || before(l, d));
    };
    D.apply = function (l, d, k, r, log) {
      if (!D.valid(l, d.data)) return;
      (l.flags.milResolved || (l.flags.milResolved = {}))[id] = true;
      if (id === 'nv_xuat_ngu') {
        // Đóng trạng thái trước khi phát trợ cấp / nhận việc, không thể nhận lần hai.
        l.flags.military = null; l.flags.milVet = true; l.flags.milDone = true; l.flags.milReleasedAt = l.age;
        if (!l.job) l.flags.needJob = true;
      }
      return apply.apply(this, arguments);
    };
  });
  var milYear = E.milYear;
  E.milYear = function (l, r, a) {
    l.flags.milDone = true;
    if (l.flags.milPlanAge === a) return [];
    l.flags.milPlanAge = a;
    if (l.flags.milTB) (l.flags.milResolved || (l.flags.milResolved = {})).nv_tan_binh = true;
    if (l.flags.milRole) (l.flags.milResolved || (l.flags.milResolved = {})).nv_don_vi = true;
    return milYear(l, r, a).filter(function (x) { return E.DEC[x[0]].valid(l, {}); });
  };
  function sender(l) { return l.fam.mAlive ? 'mẹ' : l.fam.fAlive && !l.fam.noDad ? 'bố' : H.sibs(l).length ? 'anh chị em' : null; }
  E.DEC.nv_thu_nha.def.text = function (l) {
    if (l.partner && l.partner.alive !== false) return l.partner.name + ' gửi lời hỏi thăm, động viên bạn trong những ngày xa nhà.';
    var s = sender(l); return s ? 'Nhận được thư và một ít quà từ ' + s + ', bạn đem chia với đồng đội.' : 'Một người bạn gửi lời hỏi thăm; đồng đội rủ bạn cùng chia quà hậu phương trong phòng.';
  };
  E.DEC.nv_thu_nha.def.opts[0].run = function (l, r, log) { var s = l.partner && l.partner.alive !== false ? l.partner.name : sender(l); log(s ? 'Gửi lời hỏi thăm và cảm ơn ' + s + ', chia niềm vui với đồng đội.' : 'Ngồi chuyện trò cùng đồng đội, những ngày xa nhà bớt cô quạnh.', 'good'); H.fx(l, { hap: 3, soc: 2 }); };
  var leave = E.DEC.nv_phep.def.opts.filter(function (o) { return o.k === 'nha'; })[0];
  leave.run = function (l, r, log) { var s = sender(l), n = l.cur === 'vnd' ? 1 : l.base / 90; if (l.money < n) { log('Chưa đủ tiền tàu xe, bạn xin ở lại đơn vị và liên lạc hỏi thăm từ xa.', 'neutral'); return; } H.cash(l, -n, 'Tàu xe về phép'); H.fx(l, { hap: 8, soc: 3 }); log(s ? 'Về phép thăm ' + s + ', dành những ngày nghỉ bên người thân.' : 'Dùng ngày phép về thăm quê, gặp lại bạn bè rồi trở lại đơn vị đúng hẹn.', 'good'); };
  E.quietYear = function (l, a, r) {
    var pool = [
      'Một năm không có bước ngoặt lớn, những chuyện nhỏ vẫn làm nên cuộc sống.',
      'Thêm một năm nhìn cảnh vật quanh mình thay đổi theo mùa.',
      'Những ngày nắng mưa nối nhau, bạn tiếp tục nhịp sống thường ngày.',
      'Năm nay không có tin lớn, chỉ những thay đổi rất nhỏ qua từng tháng.',
      'Một năm đủ yên để nhận ra những điều trước kia thường bỏ qua.',
      'Nhịp sống có lúc chậm, có lúc vội; năm nay rồi cũng qua.',
      'Cuối năm nhìn lại, điều đáng nhớ nằm trong những ngày rất đỗi bình thường.',
      'Năm nay trôi qua giữa những việc quen thuộc, không có biến động lớn.',
      'Những dự định nhỏ, có việc làm được, có việc để sang năm.',
      'Một năm lặng lẽ, cuộc sống tiếp tục bằng những việc thường nhật.',
      'Bước sang một mùa mới, bạn thêm quen với nhịp sống của mình.',
      'Năm nay không nhiều chuyện để kể, nhưng thời gian vẫn để lại dấu ấn.',
      'Có những ngày dài và những tháng qua rất nhanh; lại thêm một năm.',
      'Những điều quen thuộc quanh nơi ở trở thành ký ức của năm nay.',
      'Thời tiết đổi mùa, sinh hoạt vẫn giữ nhịp quen thuộc.',
      'Qua một năm tương đối ổn định, bạn lại nhìn về chặng đường phía trước.'
    ];
    if (a < 6) pool = ['Thêm một năm khám phá thế giới qua những điều nhỏ xíu.', 'Những âm thanh và màu sắc quanh nhà dần trở nên quen thuộc.', 'Lớn thêm một chút, học thêm những thói quen mới.', 'Mỗi ngày là một khám phá nhỏ trong những năm đầu đời.'];
    else if (l.school) pool = pool.concat(['Một năm đi học, những trang vở đầy dần theo từng tháng.', 'Bài học mới nối tiếp bài cũ, bạn bước thêm một đoạn trên đường học tập.', 'Những ngày đến lớp đan xen với thời gian tự học và nghỉ ngơi.']);
    else if (l.job) pool = pool.concat(['Thêm một năm làm việc, bạn quen hơn với nhịp của nghề.', 'Công việc tiếp diễn qua những ngày bận rộn và những lúc yên ắng.', 'Một năm tích lũy thêm trải nghiệm từ những việc quen thuộc.']);
    if (l.flags.military && a < l.flags.military) pool = ['Một năm rèn nề nếp trong doanh trại, dần quen với sinh hoạt tập thể.', 'Những ngày quân ngũ nối tiếp nhau qua huấn luyện, sinh hoạt và trực gác.'];
    var recent = {}, allSeen = {}; (l.log || []).forEach(function (e) { allSeen[e.t] = true; if (e.a >= a - 12) recent[e.t] = true; });
    var fresh = pool.filter(function (t) { return !allSeen[t]; });
    if (!fresh.length) fresh = pool.filter(function (t) { return !recent[t]; });
    return G.U.pick(r, fresh.length ? fresh : pool);
  };
})(globalThis.G);
