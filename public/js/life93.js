/* Một Đời — v7.3.0: thành tựu mới
   · thành tựu kiểu Gen Z: Nhà có 5 nàng tiên, Lời xin lỗi của một dân chơi, Flex nhẹ cái, Đi đâu cũng là healing, Red flag di động,
     Green flag chính hiệu, Ế bền vững, Giàu ngầm, Hot hòn họt, Lên xu hướng, Drama không hồi kết, Từ bạn thân thành người thương,
     Quay xe thần sầu, Cày như trâu
   · thành tựu "fan cứng" cho nghệ sĩ các chương trình Anh trai "say hi" (mùa 1, 2), Anh trai vượt ngàn chông gai (2024, 2026),
     Tinh hà "say hi", Em xinh "say hi" — tên thành tựu là tên FC chính thức. Chỉ có những nghệ sĩ đã có tên FC được công bố,
     đối chiếu từ nguồn công khai (Wikipedia "Danh sách tên gọi người hâm mộ", báo chí, fanpage chính thức).
     Điều kiện: chọn nghệ sĩ đó làm bias / thần tượng ít nhất 3 năm */
(function (G) {
  'use strict';
  var E = G.E, H = E.H;
  function dAge(l) { return l.death ? l.death.age : l.age; }
  function nw(l) { return E.netWorth ? E.netWorth(l) / (l.base || 1) : 0; }
  function marriedNow(l) { return !!(l.partner && l.partner.status === 'married' && l.partner.alive !== false); }
  // ghi nhận vài mốc trong đời để chấm thành tựu
  E.HOOKS.year.unshift(function (l, r, log, a) {
    if (!l.alive) return;
    var F = l.flags;
    if (l.veh === 'ô tô' && a < 25) F.carYoung = true;
    if (l.partner && l.partner.reunited) F.reunited = true;
    if (l.partner && l.partner.fromFriend && l.partner.status === 'married') F.friendSpouse = true;
    if (l.partner && l.partner.status === 'married' && F.marriedSince == null) F.marriedSince = a;
    if (!l.partner || l.partner.status !== 'married') F.marriedSince = null;
    // thần tượng: đếm số năm theo từng nghệ sĩ
    var who = [l.bias && !l.bias.all ? l.bias.n : null, l.idol || null].filter(Boolean).join(' | ');
    if (who) { var Y = F.biasYrs || (F.biasYrs = {}); FANS.forEach(function (x) { if (x[2].some(function (n) { return who.indexOf(n) >= 0; })) Y[x[0]] = (Y[x[0]] || 0) + 1; }); }
  });
  // [mã, tên FC, các tên nghệ sĩ trong game, tên hiển thị]
  var FANS = [
    ['fc_sundays', 'SUNDAYs', ['HIEUTHUHAI'], 'HIEUTHUHAI'],
    ['fc_flash', 'FLASH', ['Rhyder'], 'Rhyder'],
    ['fc_lion_kingdom', 'Lion Kingdom', ['Isaac'], 'Isaac'],
    ['fc_sun_sun', 'Sun Sun', ['Đức Phúc'], 'Đức Phúc'],
    ['fc_muzik', 'Muzik', ['Quang Hùng MasterD'], 'Quang Hùng MasterD'],
    ['fc_galaxy_day', 'Galaxy Day', ['Anh Tú Atus'], 'Anh Tú Atus'],
    ['fc_goose', 'Goose', ['HURRYKNG'], 'HURRYKNG'],
    ['fc_dopamine', 'Dopamine', ['Dương Domic'], 'Dương Domic'],
    ['fc_embes', 'Embes', ['Negav'], 'Negav'],
    ['fc_sonic', 'SONIC', ['JSOL'], 'JSOL'],
    ['fc_xa_xa', 'Xa Xa', ['Pháp Kiều'], 'Pháp Kiều'],
    ['fc_cuu_co_canh', 'Cừu Có Cánh', ['Captain Boy'], 'Captain Boy'],
    ['fc_forever_mine', 'FM — Forever Mine', ['Vũ Cát Tường'], 'Vũ Cát Tường'],
    ['fc_unicong', 'UNICONG', ['CONGB'], 'CONGB'],
    ['fc_capo', 'Capo', ['Sơn.K'], 'Sơn.K'],
    ['fc_brayniacs', 'Brayniacs', ['B Ray'], 'B Ray'],
    ['fc_archer', 'Archer', ['buitruonglinh'], 'buitruonglinh'],
    ['fc_dong_cam_sanh', 'Động Cam Sành', ['Orange'], 'Orange'],
    ['fc_euphoria', 'Euphoria', ['LyHan'], 'LyHan'],
    ['fc_saawu', 'SAAWU', ['Saabirose'], 'Saabirose'],
    ['fc_bong_den', 'Bóng đèn', ['Ánh Sáng AZA'], 'Aza Ánh Sáng'],
    ['fc_kingdom', 'Kingdom', ['SOOBIN', 'Soobin Hoàng Sơn'], 'SOOBIN'],
    ['fc_tom_hum', 'Tôm Hùm', ['Đăng Khôi'], 'Đăng Khôi'],
    ['fc_ban_nhac', 'bạn nhạc', ['Hoàng Dũng'], 'Hoàng Dũng'],
    ['fc_ung_dung', 'Ưng Dung', ['Hà An Huy'], 'Hà An Huy'],
    ['fc_fan_thue_dalab', 'Fan Thuê của Da LAB', ['Thỏ (Da LAB)', 'Thơm (Da LAB)'], 'Thỏ và Thơm (Da LAB)']
  ];
  E.FAN_CLUBS = FANS;
  function scSeen(l, re) { var n = 0, s = l.flags.scN || {}; for (var k in s) if (re.test(k)) n += s[k]; return n; }
  if (!E.addAchievements) return;
  E.addAchievements([
    ['nam_nang_tien', '🧚', 'Nhà có 5 nàng tiên', 'Có từ 5 cô con gái', function (l) { return (l.kids || []).filter(function (k) { return k.sex === 'F'; }).length >= 5; }],
    ['dan_choi_hoi_loi', '🙇', 'Lời xin lỗi của một dân chơi', 'Từng đào hoa (từ 4 cuộc tình tan vỡ), rồi hối lỗi, cưới và chung thủy từ 15 năm', function (l) { return (l.exes || 0) >= 4 && marriedNow(l) && l.flags.marriedSince != null && dAge(l) - l.flags.marriedSince >= 15; }],
    ['flex_nhe', '🚗', 'Flex nhẹ cái', 'Có ô tô riêng trước tuổi 25', function (l) { return !!l.flags.carYoung; }],
    ['healing', '🧳', 'Đi đâu cũng là healing', 'Đi du lịch từ 10 nơi', function (l) { return (l.flags.places || []).length >= 10; }],
    ['red_flag', '🚩', 'Red flag di động', 'Có từ 6 cuộc tình tan vỡ', function (l) { return (l.exes || 0) >= 6; }],
    ['green_flag', '💚', 'Green flag chính hiệu', 'Chưa từng chia tay hay ly hôn, chung thủy với một người từ 40 năm', function (l) { return !(l.exes > 0) && marriedNow(l) && l.flags.marriedSince != null && dAge(l) - l.flags.marriedSince >= 40; }],
    ['e_ben_vung', '🥲', 'Ế bền vững', 'Chưa từng hẹn hò ai, sống tới 50 tuổi', function (l) { return !l.flags.everDated && !l.partner && !(l.exes > 0) && !(l.widowed > 0) && dAge(l) >= 50; }],
    ['giau_ngam', '🤫', 'Giàu ngầm', 'Sống tằn tiện mà tài sản cuối đời từ 100 lần thu nhập năm', function (l) { return l.spend === 'save' && nw(l) >= 100; }],
    ['hot_hon_hot', '🔥', 'Hot hòn họt', 'Trở thành người nổi tiếng cả nước biết mặt', function (l) { return (l.fame || 0) >= 1e6; }],
    ['len_xu_huong', '📈', 'Lên xu hướng', 'Có một bài đăng lan truyền khắp mạng xã hội', function (l) { return !!l.flags.viral; }],
    ['drama_khong_hoi_ket', '🍿', 'Drama không hồi kết', 'Gặp từ 8 drama gia đình, công sở, hàng xóm, mạng xã hội trong một đời', function (l) { return scSeen(l, /^(fd_|ps_|cs_|hx_|mxh_|th_tay|th_nghi|bb_|dp_|tro_ban)/) >= 8; }],
    ['ban_than_thanh_nguoi_thuong', '💞', 'Từ bạn thân thành người thương', 'Cưới chính người bạn thân của mình', function (l) { return !!l.flags.friendSpouse; }],
    ['quay_xe', '↩️', 'Quay xe thần sầu', 'Quay lại với người yêu cũ', function (l) { return !!l.flags.reunited; }],
    ['cay_nhu_trau', '🐃', 'Cày như trâu', 'Đi làm từ 50 năm', function (l) { return (l.workYrs || 0) >= 50; }]
  ].concat(FANS.map(function (x) {
    return [x[0], x[0] === 'fc_bong_den' ? '💡' : '🎤', x[1], 'Trở thành fan cứng của ' + x[3] + ' (thần tượng ' + x[3] + ' từ 3 năm)', function (l) { return ((l.flags.biasYrs || {})[x[0]] || 0) >= 3; }];
  })));
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
