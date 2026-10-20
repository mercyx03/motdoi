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
    var who = [l.bias && !l.bias.all ? l.bias.n : null, l.idol || null].filter(Boolean);
    if (who.length) { var Y = F.biasYrs || (F.biasYrs = {}); FANS.forEach(function (x) { if (x[2].some(function (n) { return who.some(function (w) { return w === n || w.slice(-n.length - 1) === ' ' + n; }); })) Y[x[0]] = (Y[x[0]] || 0) + 1; }); } // so khớp đúng tên: "Anh Tú" khác "Anh Tú Atus"
  });
  // [mã, tên FC, các tên nghệ sĩ trong game, tên hiển thị]
  var FANS = [
    ['fc_sundays', 'SUNDAYs', ['HIEUTHUHAI'], 'HIEUTHUHAI'],
    ['fc_flash', 'FLASH', ['Rhyder'], 'Rhyder'],
    ['fc_lion_kingdom', 'Lion Kingdom', ['Isaac'], 'Isaac'],
    ['fc_sun_sun', 'Sun Sun', ['Đức Phúc'], 'Đức Phúc'],
    ['fc_muzik', 'Muzik', ['Quang Hùng MasterD'], 'Quang Hùng MasterD'],
    ['fc_galaxy', 'FC Galaxy', ['Anh Tú Atus'], 'Anh Tú Atus'],
    ['fc_goose', 'Goose', ['HURRYKNG'], 'HURRYKNG'],
    ['fc_dopamine', 'Dopamine', ['Dương Domic'], 'Dương Domic'],
    ['fc_sonic', 'SONIC', ['JSOL'], 'JSOL'],
    ['fc_xa_xa', 'Xa Xa', ['Pháp Kiều'], 'Pháp Kiều'],
    ['fc_cuu_co_canh', 'Cừu Có Cánh', ['Captain Boy'], 'Captain Boy'],
    ['fc_seasea', 'SeaSea', ['Erik'], 'Erik'],
    ['fc_nhim', 'Nhím', ['Song Luân'], 'Song Luân'],
    ['fc_oil', 'Oil', ['Phạm Anh Duy'], 'Phạm Anh Duy'],
    ['fc_lover', 'Lover', ['Anh Tú'], 'Anh Tú (Voi)'],
    ['fc_love', 'Love', ['Phạm Đình Thái Ngân'], 'Phạm Đình Thái Ngân'],
    ['fc_wink', 'Wink', ['Đỗ Phú Quí'], 'Đỗ Phú Quí'],
    ['fc_smilou', 'Smilou', ['Lou Hoàng'], 'Lou Hoàng'],
    ['fc_chun_fam', 'Chun Fam', ['Quang Trung'], 'Quang Trung'],
    ['fc_citisan', 'Citisan', ['Công Dương'], 'Công Dương'],
    ['fc_ginious', 'Ginious', ['Gin Tuấn Kiệt'], 'Gin Tuấn Kiệt'],
    ['fc_lil_li', 'Lil Lì', ['Nicky'], 'Nicky'],
    ['fc_hip', 'Híp', ['Quân A.P'], 'Quân A.P'],
    ['fc_deers', 'Deers', ['Vũ Thịnh'], 'Vũ Thịnh'],
    ['fc_alo_family', 'Alo Family', ['Ali Hoàng Dương'], 'Ali Hoàng Dương'],
    ['fc_weanie', 'Weanie', ['WEAN'], 'Wean Lê'],
    ['fc_tage', 'FC Tage', ['Tage'], 'Tage'],
    ['fc_forever_mine', 'FM — Forever Mine', ['Vũ Cát Tường'], 'Vũ Cát Tường'],
    ['fc_unicong', 'UNICONG', ['CONGB'], 'CONGB'],
    ['fc_capo', 'Capo', ['Sơn.K'], 'Sơn.K'],
    ['fc_brayniacs', 'Brayniacs', ['B Ray'], 'B Ray'],
    ['fc_archer', 'Archer', ['buitruonglinh'], 'buitruonglinh'],
    ['fc_riker', 'Riker', ['Karik'], 'Karik'],
    ['fc_gillianaire', 'Gillianaire', ['GILL'], 'GILL'],
    ['fc_co_dong', 'Cổ Đông', ['Mason Nguyễn'], 'Mason Nguyễn'],
    ['fc_mumble_bee', 'Mumble Bee', ['HUSTLANG Robber'], 'Robber'],
    ['fc_2nammaste', '2Nammaste', ['Nhâm Phương Nam'], 'Nhâm Phương Nam'],
    ['fc_khu_o_chuot', 'Khu ổ chuột', ['Jaysonlei'], 'Jaysonlei'],
    ['fc_bon_bon', 'Bon Bon', ['Jey B'], 'Jey B'],
    ['fc_voi_con', 'Voi Con', ['Vương Bình'], 'Vương Bình'],
    ['fc_icon', 'ICON', ['LOHAN'], 'LOHAN'],
    ['fc_kho_bau', 'Kho Báu', ['Cody Nam Võ'], 'Cody Nam Võ'],
    ['fc_bot_ngot', 'Bột Ngọt', ['Bùi Duy Ngọc'], 'Bùi Duy Ngọc'],
    ['fc_sonata', 'SONATA', ['Đỗ Nam Sơn'], 'Đỗ Nam Sơn'],
    ['fc_lop_du', 'Lớp Du', ['Phúc Du'], 'Phúc Du'],
    ['fc_vit_con', 'Vịt Con', ['Ryn Lee'], 'Ryn Lee'],
    ['fc_to_vet', 'Tổ Vẹt', ['Rio'], 'Rio'],
    ['fc_bff', 'BFF', ['Ngô Kiến Huy'], 'Ngô Kiến Huy'],
    ['fc_ocean', 'Ocean', ['OGENUS'], 'OGENUS'],
    ['fc_andme', 'ANDME', ['Dillan Hoàng Phan'], 'Dillan Hoàng Phan'],
    ['fc_tezdy', 'Tezdy', ['TEZ'], 'TEZ'],
    ['fc_pillow', 'Pillow', ['Khôi Vũ'], 'Khôi Vũ'],
    ['fc_one', 'ONE', ['OTIS'], 'OTIS'],
    ['fc_pansun', 'PanSun', ['Hải Nam'], 'Hải Nam'],
    ['fc_dong_cam_sanh', 'Động Cam Sành - MyMuse', ['Orange'], 'Orange'],
    ['fc_euphoria', 'Euphoria', ['LyHan'], 'LyHan'],
    ['fc_saawu', 'SAAWU', ['Saabirose'], 'Saabirose'],
    ['fc_bong_den', 'Bóng đèn', ['Ánh Sáng AZA'], 'Aza Ánh Sáng'],
    ['fc_salty', 'SALTY', ['Muộii'], 'Muộii'],
    ['fc_lovely', 'Lovely', ['LyLy'], 'LyLy'],
    ['fc_chaubaus', 'Chaubaus', ['Châu Bùi'], 'Châu Bùi'],
    ['fc_myllions', 'Myllions', ['Mỹ Mỹ'], 'Mỹ Mỹ'],
    ['fc_shinner', 'Shinner', ['Quỳnh Anh Shyn'], 'Quỳnh Anh Shyn'],
    ['fc_peach_jam', 'Peach Jam', ['Đào Tử A1J'], 'Đào Tử A1J'],
    ['fc_lac_da', 'Lạc Đà', ['Han Sara'], 'Han Sara'],
    ['fc_to_co', 'Tổ Cò', ['Phương Mỹ Chi'], 'Phương Mỹ Chi'],
    ['fc_little_ly', 'Little Ly', ['Phương Ly'], 'Phương Ly'],
    ['fc_halo', 'Halo', ['Maiquinn'], 'Maiquinn'],
    ['fc_thor', 'Thor', ['Lamoon'], 'Lamoon'],
    ['fc_tien_doi', 'Tiên Đôi', ['Tiên Tiên'], 'Tiên Tiên'],
    ['fc_hippies', 'Hippies', ['Lâm Bảo Ngọc'], 'Lâm Bảo Ngọc'],
    ['fc_millie', 'Millie', ['Vũ Thảo My'], 'Vũ Thảo My'],
    ['fc_moro', 'Moro', ['Juky San'], 'Juky San'],
    ['fc_ca_vo', 'Cá Vợ', ['52Hz'], '52Hz'],
    ['fc_dau_tay_kiukiu', 'Dâu Tây kiukiu', ['Danmy'], 'Danmy'],
    ['fc_bong_hoa_nho', 'Bông hoa nhỏ', ['Bích Phương'], 'Bích Phương'],
    ['fc_bomer', 'Bomer', ['Pháo'], 'Pháo NorthSide'],
    ['fc_chit', 'Chít', ['Chi Xê'], 'Chi Xê'],
    ['fc_lahu', 'Lahu', ['Ngô Lan Hương'], 'Ngô Lan Hương'],
    ['fc_ember', 'EMBER', ['Yeolan'], 'Yeolan'],
    ['fc_vang', 'Vàng', ['Hoàng Duyên'], 'Hoàng Duyên'],
    ['fc_bao_anh', 'FC Bảo Anh', ['Bảo Anh'], 'Bảo Anh'],
    ['fc_kingdom', 'Kingdom', ['SOOBIN', 'Soobin Hoàng Sơn'], 'SOOBIN'],
    ['fc_tom_hum', 'Tôm Hùm', ['Đăng Khôi'], 'Đăng Khôi'],
    ['fc_bbq', 'BBQ', ['BB Trần'], 'BB Trần'],
    ['fc_homie', 'Homie', ['Binz'], 'Binz'],
    ['fc_carrot', 'Carrot', ['Jun Phạm'], 'Jun Phạm'],
    ['fc_khach_iu', 'Khách iu', ['Bùi Công Nam'], 'Bùi Công Nam'],
    ['fc_zhoufam', 'Zhoufam', ['Duy Khánh'], 'Duy Khánh'],
    ['fc_toc_con', 'Tóc con', ['Phan Đình Tùng', 'Phan Đinh Tùng'], 'Phan Đình Tùng'],
    ['fc_pifam', 'Pifam', ['Tăng Phúc'], 'Tăng Phúc'],
    ['fc_ban_nhac', 'Bạn Nhạc', ['Hoàng Dũng'], 'Hoàng Dũng'],
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
