/* Một Đời — 9.5.5: tuổi thơ ngoài Việt Nam (lễ hội theo nước, tuổi 1–2, tuổi 10–14) trên cơ chế KID/TRIG của kid953.js.
   Trước đây các chuyện có lựa chọn như Trung thu, lì xì chỉ dành cho Việt Nam nên người chơi nước khác ít chuyện hơn.
   Lễ hội gắn với NƯỚC (lịch lễ chung của nước đó), không gắn với tôn giáo hay sắc tộc của từng nhân vật và không nói gì về tính cách.
   Mỗi chuyện có ngữ cảnh: thời bình, mức phát triển, nông thôn hay thành thị, số người trông, năm sống (chưa có thì không xuất hiện). */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E && E.H, K = E && E.KID953;
  if (!E || !H || !K || !K.KID) return;
  var KID = K.KID, hs = K.hs, carer = K.carer, dev = K.dev;
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function wy(l) { return l.birthYear + l.age; }
  function cc(l) { return H.resCode(l); }
  function inSet(s) { var m = {}; s.split(' ').forEach(function (c) { m[c] = 1; }); return function (l) { return !!m[cc(l)]; }; }
  function calm(l) { return !K.turbulent(l); }
  function mem(l, t, w) { H.mem(l, t, w || 3); }
  function flag(l) { return l.flags.fest955 || (l.flags.fest955 = {}); }
  function name(l) { var c = G.W && G.W.BY[cc(l)]; return c ? c.name : 'quê hương'; }
  var poor = function (l) { return (l.fam && l.fam.q || 3) <= 2; };

  // ===================================================================
  // 1. LỄ HỘI THEO NƯỚC (4–12 tuổi)
  // ===================================================================
  function FEST(id, set, title, text, opts, from, cwv) {
    var inC = inSet(set);
    K.KID(id, 4, 12, { title: title, text: text, opts: opts }, function (l) { return inC(l) && calm(l) && wy(l) >= (from || 1900); }, cwv || 0.9, 0.06);
  }
  // 1.1 Tết Âm lịch ở Trung Quốc, Đài Loan, Hồng Kông, Singapore; Seollal ở Hàn Quốc
  FEST('k955_tet_am', 'CN TW HK SG KR MO', 'Tết Âm lịch', function (l) {
    var kr = cc(l) === 'KR', who = cap(carer(l));
    return kr ? 'Sáng Seollal, ' + who + ' cho bạn mặc hanbok, cúi lạy chúc tuổi người lớn rồi được mừng tuổi.' : 'Giao thừa, cả nhà quây quần ăn bữa cơm đoàn viên. Sáng mùng một ' + who + ' dặn bạn chúc Tết người lớn để nhận bao đỏ.';
  }, [
    { k: 'chuc', l: 'Chúc Tết đủ mọi người, lễ phép', ai: { w: 1.2 }, run: function (l, r, log) { var kr = cc(l) === 'KR'; log(kr ? 'Cúi lạy đúng lễ, được khen và mừng tuổi một phong bì khá dày.' : 'Chúc từng người một, được lì xì đầy túi, ai cũng khen bé ngoan.', 'good'); H.fx(l, { hap: 4, soc: 2 }); H.cash(l, l.base * 0.01, 'Tiền mừng tuổi'); mem(l, 'Cái Tết nhận phong bao đỏ đầu tiên.', 2); } },
    { k: 'phao', l: 'Mải chơi pháo và trò chơi với anh chị em họ', ai: { w: 0.8 }, run: function (l, r, log) { log('Chơi từ sáng đến tối, quên cả chúc Tết, bị nhắc nhẹ nhưng vẫn được bao đỏ.', 'neutral'); H.fx(l, { hap: 4 }); } },
    { k: 'gui', l: 'Nhờ ba mẹ giữ hộ tiền mừng tuổi cho an toàn', ai: { w: 0.7, smart: 1 }, run: function (l, r, log) { log('Ba mẹ cất tiền vào sổ tiết kiệm cho bạn, hứa đến khi vào đại học mới dùng.', 'neutral'); l.flags.piggy = (l.flags.piggy || 0) + 1; H.fx(l, { kno: 1 }); } }
  ]);
  // 1.2 Trung thu / Chuseok
  FEST('k955_trung_thu_a', 'CN TW HK KR SG JP', 'Đêm trăng rằm mùa thu', function (l) { var kr = cc(l) === 'KR', jp = cc(l) === 'JP'; return kr ? 'Dịp Chuseok, cả nhà về quê cúng tổ tiên và cùng làm bánh songpyeon.' : jp ? 'Đêm Tsukimi, nhà bạn bày bánh dango và cỏ bạc lên ngắm trăng.' : 'Trăng rằm tháng Tám, nhà bạn mua bánh trung thu, bé nào cũng cầm đèn lồng chạy khắp xóm.'; }, [
    { k: 'lam', l: 'Cùng người lớn làm bánh', ai: { w: 1.1 }, run: function (l, r, log) { log('Nặn bánh méo mó nhưng ăn ngon lạ, bạn khoe với cả họ.', 'good'); H.fx(l, { hap: 4, kno: 1 }); mem(l, 'Lần đầu tự tay nặn bánh đêm trăng rằm.', 2); } },
    { k: 'den', l: function (l) { return cc(l) === 'JP' || cc(l) === 'KR' ? 'Mang bánh ra ngắm trăng cùng bạn bè' : 'Xách đèn lồng đi chơi với bạn bè'; }, ai: { w: 1, soc: 1 }, run: function (l, r, log) { log(cc(l) === 'JP' || cc(l) === 'KR' ? 'Các bạn chia bánh cho nhau rồi ngồi chờ trăng lên.' : 'Đèn lồng tắt giữa đường, bạn bè nhường nhau thắp lại từng chiếc.', 'good'); H.fx(l, { hap: 4, soc: 3 }); } },
    { k: 'ngam', l: 'Ngồi ngắm trăng nghe ông bà kể chuyện', ai: { w: 0.8 }, run: function (l, r, log) { log(cc(l) === 'JP' || cc(l) === 'KR' ? 'Ông bà chỉ lên mặt trăng và kể chuyện chú thỏ giã bánh.' : 'Nghe truyện dân gian về cung trăng nhiều lần mà vẫn thích.', 'neutral'); H.fx(l, { hap: 2, kno: 1 }); } }
  ]);
  // 1.3 Diwali (Ấn Độ, Nepal, Fiji, Mauritius)
  FEST('k955_diwali', 'IN NP FJ MU', 'Đêm Diwali', function (l) { return 'Đêm Diwali, đèn dầu diya thắp kín bậu cửa, tiếng pháo vang khắp phố. ' + cap(carer(l)) + ' đang bày bánh kẹo ra mời khách.'; }, [
    { k: 'den', l: 'Giúp xếp đèn dầu thành hình hoa', ai: { w: 1.2 }, run: function (l, r, log) { log('Xếp đèn ngoài cửa đến mỏi tay, nhưng nhìn lối vào sáng rực thì thấy xứng đáng.', 'good'); H.fx(l, { hap: 4 }); mem(l, 'Đêm Diwali xếp đèn cùng cả nhà.', 2); } },
    { k: 'phao', l: 'Đòi đốt pháo cùng anh chị em', ai: { w: 0.9, risk: 1 }, run: function (l, r, log) { if (hs(l, 'dw' + l.age) < 0.2) { log('Tia lửa bắn trúng tay áo, may chỉ cháy xém. Người lớn tịch thu hết pháo.', 'bad'); H.fx(l, { hea: -1, hap: -2 }); } else { log('Đốt pháo hoa dưới sự trông chừng của người lớn, vui đến khuya.', 'good'); H.fx(l, { hap: 4, soc: 2 }); } } },
    { k: 'qua', l: 'Cầm bánh kẹo sang chúc nhà hàng xóm', ai: { w: 1, soc: 1 }, run: function (l, r, log) { log('Đi hết nhà này đến nhà khác, được cho thêm bao nhiêu là kẹo.', 'good'); H.fx(l, { hap: 3, soc: 3 }); } }
  ]);
  // 1.4 Eid / lễ kết thúc tháng nhịn ăn
  FEST('k955_eid', 'ID PK BD TR EG SA IQ MA DZ TN LY SD MY AE QA KW JO SY YE AF AZ UZ TJ KG TM SO SN ML NE MR DJ GM BN MV OM BH IR', 'Sáng Eid', function (l) { return 'Sáng Eid, cả nhà mặc quần áo mới đi lễ, rồi ghé thăm họ hàng. ' + cap(carer(l)) + ' đã chuẩn bị bánh và quà cho trẻ nhỏ.'; }, [
    { k: 'tham', l: 'Cùng người lớn đi thăm họ hàng cả ngày', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { log('Chào hỏi hết nhà này đến nhà khác, được mừng tuổi và ăn bánh đến no.', 'good'); H.fx(l, { hap: 4, soc: 3 }); H.cash(l, l.base * 0.008, 'Tiền mừng ngày lễ'); } },
    { k: 'nhin', l: 'Thử nhịn ăn nửa ngày như người lớn trong tháng trước', ai: { w: 0.6 }, run: function (l, r, log) { log('Nhịn được đến trưa thì đói lả, người lớn cười rồi cho ăn bù. Bạn tự hào vì đã cố.', 'neutral'); H.fx(l, { hap: 1, kno: 1 }); } },
    { k: 'choi', l: 'Chơi với đám trẻ trong xóm ngoài sân', ai: { w: 1 }, run: function (l, r, log) { log('Cả xóm trẻ con rượt đuổi nhau trong bộ đồ mới, về nhà lấm bẩn nhưng không ai mắng.', 'good'); H.fx(l, { hap: 4, soc: 2 }); } }
  ]);
  // 1.5 Giáng sinh (và Wigilia, Genna, Giáng sinh Chính thống)
  var XM = 'US GB DE FR ES IT PT BR MX AR CO CL PE VE EC BO PY UY CA AU NZ IE NL BE CH AT SE NO DK FI PL CZ HU RO BG GR UA RU BY RS HR SI SK LT LV EE PH KE NG GH ZA ET TZ UG ZM ZW CM CD AO MZ CR PA GT HN SV NI DO PR CU JM TT';
  FEST('k955_giang_sinh', XM, 'Đêm Giáng sinh', function (l) {
    var c = cc(l), o = /^(RU|UA|BY|RS|GR|BG|RO|ET)$/.test(c);
    return (o ? 'Đêm trước lễ Giáng sinh theo lịch Chính thống, ' : 'Đêm Giáng sinh, ') + 'cả nhà quây quần bên bàn ăn. ' + (poor(l) ? 'Năm nay quà không nhiều, nhưng ' + carer(l) + ' vẫn gói cho bạn một món nhỏ.' : 'Dưới cây thông có những hộp quà gói giấy màu.');
  }, [
    { k: 'qua', l: 'Hồi hộp mở quà', ai: { w: 1.2 }, run: function (l, r, log) { log(poor(l) ? 'Món quà nhỏ làm bạn vui hơn cả đống quà của bạn bè — vì có tên bạn trên nhãn.' : 'Bạn mở từng hộp quà, thích nhất là món nhỏ nhất.', 'good'); H.fx(l, { hap: 5 }); mem(l, 'Đêm Giáng sinh mở quà.', 2); } },
    { k: 'lam', l: 'Tự làm thiệp tặng người thân', ai: { w: 0.9, smart: 1 }, run: function (l, r, log) { log('Tấm thiệp vẽ nguệch ngoạc được dán lên tủ lạnh suốt cả năm.', 'good'); H.fx(l, { hap: 3, karma: 1 }); } },
    { k: 'thuc', l: 'Cố thức đợi nửa đêm', ai: { w: 0.7 }, run: function (l, r, log) { log('Ngủ gục trước khi đồng hồ điểm, sáng ra đã thấy mình nằm trên giường.', 'neutral'); H.fx(l, { hap: 2 }); } }
  ]);
  // 1.6 Halloween (Mỹ, Canada, Anh, Ireland, Úc, New Zealand) từ 1950
  FEST('k955_halloween', 'US CA GB IE AU NZ', 'Đêm Halloween', function (l) { return 'Đêm 31 tháng 10, bạn và đám bạn hóa trang đi gõ cửa từng nhà xin kẹo. ' + cap(carer(l)) + ' dặn chỉ đi những phố quen, về trước giờ hẹn.'; }, [
    { k: 'ao', l: 'Tự chế bộ đồ hóa trang', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { log('Bộ đồ làm từ giấy bìa và vải cũ được cả phố khen sáng tạo.', 'good'); H.fx(l, { hap: 4, kno: 1 }); mem(l, 'Bộ đồ Halloween tự chế đầu tiên.', 2); } },
    { k: 'ban', l: 'Đi cùng nhóm bạn, người lớn đi theo xa xa', ai: { w: 1, soc: 1 }, run: function (l, r, log) { log('Túi kẹo đầy ắp, đổi kẹo với nhau đến khuya.', 'good'); H.fx(l, { hap: 4, soc: 3 }); } },
    { k: 'so', l: 'Ở nhà phát kẹo cho trẻ khác vì hơi sợ', ai: { w: 0.6 }, run: function (l, r, log) { log('Ngồi cạnh rổ kẹo, đếm xem có bao nhiêu bộ đồ ma quái ghé qua.', 'neutral'); H.fx(l, { hap: 2 }); } }
  ], 1950);
  // 1.7 Lễ Tạ ơn (Mỹ, Canada)
  FEST('k955_tha_on', 'US CA', 'Bữa tiệc Lễ Tạ ơn', function (l) { return 'Dịp Lễ Tạ ơn, nhà bạn đông kín họ hàng, bàn ăn bày gà tây, bí ngô nướng và bánh nướng.'; }, [
    { k: 'giup', l: 'Phụ giúp nhặt rau và bày bàn', ai: { w: 1.1 }, run: function (l, r, log) { log('Được giao việc như người lớn, bạn làm hết sức nghiêm túc.', 'good'); H.fx(l, { hap: 3, karma: 1 }); } },
    { k: 'tv', l: 'Xem truyền hình cùng cả nhà', ai: { w: 1 }, req: function (l) { return wy(l) >= 1955; }, run: function (l, r, log) { log('Cả nhà ngồi quây quần trước màn hình, vừa xem vừa chuyện trò.', 'good'); H.fx(l, { hap: 4, soc: 2 }); } },
    { k: 'ke', l: 'Nghe ông bà kể chuyện ngày xưa quanh bàn ăn', ai: { w: 0.8 }, run: function (l, r, log) { log('Lần đầu bạn nghe chuyện gia đình mình đã đến đây như thế nào.', 'neutral'); H.fx(l, { kno: 2, hap: 2 }); } }
  ], 1900);
  // 1.8 Carnaval
  FEST('k955_carnaval', 'BR TT CO UY VE', 'Mùa Carnaval', function (l) { return 'Mùa Carnaval, phố xá rộn tiếng trống. Bạn được ' + carer(l) + ' dắt ra xem đoàn diễu hành đi qua.'; }, [
    { k: 'nhay', l: 'Nhảy theo nhịp trống giữa đường', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { log('Bạn lắc lư theo nhịp, người lớn vỗ tay cổ vũ.', 'good'); H.fx(l, { hap: 5, soc: 2 }); mem(l, 'Lần đầu nhảy theo nhịp trống Carnaval.', 2); } },
    { k: 'ao', l: 'Đòi hóa trang như người trong đoàn', ai: { w: 0.9 }, run: function (l, r, log) { log('Bộ đồ lông vũ nhỏ xíu, đội cả buổi chiều mà không chịu cởi.', 'good'); H.fx(l, { hap: 4 }); } },
    { k: 'don', l: 'Núp sau lưng người lớn vì tiếng trống quá to', ai: { w: 0.6 }, run: function (l, r, log) { log('Bịt tai nhìn qua kẽ tay, một lúc sau thấy quen dần.', 'neutral'); H.fx(l, { hap: 1 }); } }
  ], 1900);
  // 1.9 Songkran
  FEST('k955_songkran', 'TH LA KH MM', 'Tết té nước', function (l) { return 'Giữa tháng Tư nắng gắt, cả xóm té nước chúc phúc nhau. Bạn được giao một chiếc gáo nhỏ.'; }, [
    { k: 'te', l: 'Té nước vào mọi người, kể cả người lạ', ai: { w: 1, risk: 0.5 }, run: function (l, r, log) { log('Ướt như chuột lột, cười đến mệt, về nhà được bà lau tóc cho.', 'good'); H.fx(l, { hap: 5, soc: 2 }); } },
    { k: 'tam', l: 'Cùng người lớn tắm tượng Phật và rửa tay chúc phúc cho người già', ai: { w: 1.1 }, run: function (l, r, log) { log('Rót nước thơm lên tay ông bà, được xoa đầu và chúc nhiều điều tốt.', 'good'); H.fx(l, { hap: 3, karma: 2 }); mem(l, 'Lần đầu rót nước chúc phúc cho ông bà.', 2); } }
  ]);
  // 1.10 Nowruz
  FEST('k955_nowruz', 'IR AF TJ UZ AZ KZ KG TM', 'Nowruz', function (l) { return 'Ngày xuân phân, cả nhà dọn dẹp và bày bàn Nowruz với những món đồ tượng trưng cho năm mới. ' + cap(carer(l)) + ' gọi bạn đến phụ.'; }, [
    { k: 'don', l: 'Phụ dọn nhà và nảy mầm lúa mạch cho bàn lễ', ai: { w: 1.1 }, run: function (l, r, log) { log('Hạt lúa mầm xanh đúng ngày lễ, bạn tự hào chỉ cho khách xem.', 'good'); H.fx(l, { hap: 3, karma: 1 }); } },
    { k: 'tham', l: 'Đi thăm họ hàng nhận quà năm mới', ai: { w: 1, soc: 1 }, run: function (l, r, log) { log('Đi hết nhà này đến nhà khác, ăn bánh ngọt và nhận tiền mừng.', 'good'); H.fx(l, { hap: 4, soc: 2 }); H.cash(l, l.base * 0.008, 'Tiền mừng năm mới'); } },
    { k: 'lua', l: 'Nhảy qua đống lửa nhỏ như mọi người', ai: { w: 0.7, risk: 1 }, run: function (l, r, log) { log('Nhảy thoát trong gang tấc, tim đập thình thịch nhưng vui.', 'good'); H.fx(l, { hap: 3 }); } }
  ]);
  // 1.11 Nhật Bản: Otoshidama, Shichi-Go-San
  K.KID('k955_shichigosan', 3, 7, { title: 'Lễ Shichi-Go-San', text: function (l) { return 'Tháng Mười Một, ' + carer(l) + ' đưa bạn đến đền để cầu chúc cho trẻ ' + l.age + ' tuổi lớn lên khỏe mạnh, mặc bộ lễ phục đẹp nhất.'; },
    opts: [{ k: 'chup', l: 'Chụp ảnh cùng cả nhà', ai: { w: 1.2 }, run: function (l, r, log) { log('Bạn đứng yên chụp mãi đến mệt, nhưng ảnh sau này thành kỷ niệm của cả nhà. Bạn còn được cây kẹo dài chitose-ame.', 'good'); H.fx(l, { hap: 4 }); mem(l, 'Ngày chụp ảnh Shichi-Go-San cùng cả nhà.', 3); } },
      { k: 'met', l: 'Mệt, đòi về sớm', ai: { w: 0.6 }, run: function (l, r, log) { log('Bạn dỗi giữa chừng, người lớn dỗ mãi bằng kẹo mới chịu chụp nốt tấm cuối.', 'neutral'); } }] },
  function (l) { return cc(l) === 'JP' && calm(l) && wy(l) >= 1900; }, 0.9, 0.06);
  K.KID('k955_otoshidama', 4, 12, { title: 'Năm mới và phong bao', text: function (l) { return 'Ngày đầu năm, bạn được ông bà và họ hàng đưa phong bao nhỏ. ' + cap(carer(l)) + ' hỏi bạn định làm gì với số tiền ấy.'; },
    opts: [{ k: 'gui', l: 'Gửi một phần vào ngân hàng', ai: { w: 1, smart: 1 }, run: function (l, r, log) { log('Bạn đưa phần lớn cho ' + carer(l) + ' mang đi gửi, chỉ giữ lại ít để mua truyện.', 'good'); l.flags.piggy = (l.flags.piggy || 0) + 1; H.fx(l, { kno: 1, hap: 2 }); } },
      { k: 'mua', l: 'Mua ngay món đồ chơi mơ ước', ai: { w: 1.1 }, run: function (l, r, log) { log('Bạn mua ngay đồ chơi vẫn nhìn mãi ở cửa hàng, chơi đến hết tuần.', 'good'); H.fx(l, { hap: 5 }); } },
      { k: 'chia', l: 'Chia cho em hoặc bạn một ít', ai: { w: 0.7 }, run: function (l, r, log) { log('Bạn chia một phần cho em nhỏ, được khen và nhận lại nụ cười.', 'good'); H.fx(l, { karma: 2, soc: 1 }); } }] },
  function (l) { return cc(l) === 'JP' && calm(l); }, 0.8, 0.06);
  // 1.12 Holi
  FEST('k955_holi', 'IN NP', 'Ngày hội sắc màu', function (l) { return 'Sáng Holi, cả xóm xuống đường tung bột màu lên nhau. ' + cap(carer(l)) + ' bôi chút bột màu lên má bạn trước.'; }, [
    { k: 'tung', l: 'Chạy ra tung bột màu với đám bạn', ai: { w: 1.1, soc: 1 }, run: function (l, r, log) { log('Người lấm đủ màu, không ai nhận ra ai, cười mãi.', 'good'); H.fx(l, { hap: 5, soc: 3 }); mem(l, 'Ngày hội sắc màu đầu tiên.', 2); } },
    { k: 'nhin', l: 'Đứng trên bậc cửa nhìn, chỉ dám bôi nhẹ', ai: { w: 0.7 }, run: function (l, r, log) { log('Đến chiều bạn mới dám xuống, bị bạn bè đổ nguyên xô nước màu lên đầu.', 'neutral'); H.fx(l, { hap: 3 }); } }
  ]);
  // 1.13 Ngày của người chết, México
  FEST('k955_dia_muertos', 'MX', 'Ngày của người đã khuất', function (l) { return 'Đầu tháng Mười Một, nhà bạn dựng bàn thờ với hoa cúc vạn thọ, ảnh người thân đã khuất và những món họ thích.'; }, [
    { k: 'phu', l: 'Phụ xếp hoa và bày món ăn lên bàn', ai: { w: 1.1 }, run: function (l, r, log) { log('Bạn xếp cánh hoa thành lối đi và nghe kể về người đã khuất.', 'good'); H.fx(l, { hap: 2, kno: 1, karma: 1 }); mem(l, 'Lần đầu giúp dựng bàn thờ ngày của người đã khuất.', 3); } },
    { k: 'nghe', l: 'Ngồi nghe người lớn kể chuyện về ông bà', ai: { w: 1 }, run: function (l, r, log) { log('Bạn thấy người đã mất vẫn ở đó, trong mỗi câu chuyện.', 'neutral'); H.fx(l, { hap: 2, kno: 1 }); } }
  ]);

  // ===================================================================
  // 2. TUỔI 1–2: những chuyện đầu đời mọi nơi đều có
  // ===================================================================
  K.KID('k955_buoc_dau', 1, 2, { title: 'Những bước chân đầu tiên',
    text: function (l) { return 'Bạn bám vào mép ghế đứng lên, ' + carer(l) + ' dang tay đứng cách vài bước, gọi bạn lại.'; },
    opts: [{ k: 'di', l: 'Buông tay, bước về phía người gọi', ai: { w: 1.2 }, run: function (l, r, log) { if (hs(l, 'step' + l.age) < 0.35) { log('Bạn ngã phịch sau hai bước, khóc rồi lại bám dậy. Đến chiều đã đi được cả căn phòng.', 'neutral'); } else log('Bạn chập chững đi được ba bước rồi nhào vào lòng người gọi. Cả nhà reo lên.', 'good'); H.fx(l, { hap: 4, hea: 1 }); mem(l, 'Những bước chân đầu tiên.', 3); } },
      { k: 'ngoi', l: 'Ngồi bệt, thích bò hơn', ai: { w: 0.5 }, run: function (l, r, log) { log('Bạn bò nhanh như chớp, đi chậm hơn các bạn cùng tuổi một chút nhưng chẳng sao.', 'neutral'); } }] },
  function (l) { return calm(l); }, 1, 0.05);
  K.KID('k955_ru_ngu', 1, 3, { title: 'Tiếng hát ru',
    text: function (l) { return 'Mỗi tối bạn đều được nghe một bài hát quen thuộc từ ' + carer(l) + ' trước khi ngủ, có hôm hát lệch cả tông.'; },
    opts: [{ k: 'nghe', l: 'Nằm yên nghe cho đến khi ngủ', ai: { w: 1.2 }, run: function (l, r, log) { log('Giọng hát ấy sẽ theo bạn rất lâu, nhiều năm sau chỉ cần nghe giai điệu là nhớ lại.', 'good'); H.fx(l, { hap: 3 }); l.flags.lullaby955 = true; mem(l, 'Bài hát ru ' + carer(l) + ' vẫn hát mỗi tối.', 3); } },
      { k: 'quay', l: 'Quấy khóc đòi hát thêm', ai: { w: 0.8 }, run: function (l, r, log) { log(cap(carer(l)) + ' thức thêm nửa tiếng hát đi hát lại, bạn mới chịu nhắm mắt.', 'neutral'); H.fx(l, { hap: 1 }); } }] },
  function (l) { return calm(l); }, 0.9, 0.05);
  K.KID('k955_nha_tre', 2, 3, { title: 'Ngày đầu gửi nhà trẻ',
    text: function (l) { return 'Sáng nay ' + carer(l) + ' đưa bạn đến nhà trẻ ' + (l.urban ? 'gần nhà' : 'trong làng') + ' lần đầu, rồi phải quay đi làm.'; },
    opts: [{ k: 'khoc', l: 'Khóc to, bám chặt không buông', ai: { w: 1 }, run: function (l, r, log) { log('Cô giáo bế bạn vào, bạn khóc đến khi mệt lả. Đến chiều đã nín và chơi xếp hình.', 'neutral'); H.fx(l, { hap: -1 }); } },
      { k: 'nhin', l: 'Đứng nhìn các bạn chơi, nép sau lưng cô', ai: { w: 0.9 }, run: function (l, r, log) { log('Tuần đầu bạn chỉ đứng nhìn. Sang tuần sau đã có bạn rủ chơi cùng.', 'neutral'); H.fx(l, { soc: 1 }); } },
      { k: 'choi', l: 'Chạy ngay vào chơi đồ chơi', ai: { w: 0.7, soc: 1 }, run: function (l, r, log) { log('Bạn quên luôn chuyện chia tay, đến khi bị gọi về còn đòi ở lại thêm.', 'good'); H.fx(l, { hap: 2, soc: 2 }); } }] },
  function (l) { var f = l.fam || {}; return calm(l) && wy(l) >= 1950 && dev(l) >= 3 && !!(l.urban || dev(l) >= 8) && (f.mAlive && f.mJob !== 'nội trợ' || f.fAlive && !f.noDad && f.fJob && f.fJob !== 'thất nghiệp'); }, 1, 0.07);
  K.KID('k955_an_dam', 1, 2, { title: 'Những thìa ăn dặm đầu tiên',
    text: function (l) { var c = cc(l), t = /^(VN|CN|TW|HK|KR|JP|TH|ID|MY|PH|LA|KH|MM|BD|IN|LK|SG)$/.test(c) ? 'bát cháo gạo loãng' : /^(NG|GH|KE|TZ|UG|ZM|ZW|CM|SN|ML|NE|BF|CI|TG|BJ|ET)$/.test(c) ? 'bát bột ngô nấu sánh' : /^(US|GB|CA|AU|NZ|DE|FR|NL|SE|NO|DK|FI|IE)$/.test(c) ? 'thìa bột yến mạch trộn trái cây nghiền' : 'bát cháo bột mềm'; var c0 = K.cx(l); return cap(carer(l)) + ' đút cho bạn ' + t + (c0.fam >= 1 ? ' — nhà nấu ít hơn thường lệ vì lương thực đang khan hiếm.' : '.'); },
    opts: [{ k: 'an', l: 'Há miệng ăn ngoan', ai: { w: 1.2 }, run: function (l, r, log) { var c = K.cx(l); if (c.fam >= 2) { log('Bạn ăn ngon lành, nhưng bát nhỏ và thưa hơn người lớn mong muốn.', 'neutral'); H.fx(l, { hea: -1 }); } else { log('Bạn ăn hết bát, đòi thêm. Cả nhà mừng vì bé ăn khỏe.', 'good'); H.fx(l, { hea: 1, hap: 2 }); } } },
      { k: 'nhe', l: 'Nhè ra, ngoảnh mặt đi', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn phun cả thìa ra áo ' + carer(l) + '. Phải thử đến ba loại món mới thấy bạn chịu ăn.', 'neutral'); H.fx(l, { hap: 1 }); } }] },
  function (l) { return calm(l); }, 0.9, 0.05);

  // ===================================================================
  // 3. TUỔI 10–14: thi chuyển cấp, đội thể thao, việc nhà và lao động của trẻ
  // ===================================================================
  var TEAM = { football: 'AR BR CO CL PE UY EC GH NG SN CM CI ML MA EG DZ TN ES IT PT FR DE NL BE GB IE TR GR RU UA PL CZ HU RO RS HR VN TH ID MY KE TZ UG SA IR MX', cricket: 'IN PK BD LK AU NZ ZA ZW', baseball: 'US JP KR TW CU DO VE PR', basketball: 'PH LT', hockey: 'CA FI SE CZ SK', rugby: 'NZ FJ WS TO' };
  function teamOf(l) { var c = cc(l); for (var k in TEAM) if (('' + TEAM[k]).split(' ').indexOf(c) >= 0) return k; return 'football'; }
  var TNAME = { football: 'đội bóng đá của trường', cricket: 'đội cricket của trường', baseball: 'đội bóng chày của trường', basketball: 'đội bóng rổ của trường', hockey: 'đội khúc côn cầu trên băng', rugby: 'đội bóng bầu dục' };
  K.KID('k955_doi_the_thao', 10, 14, { title: 'Thử vào đội thể thao',
    text: function (l) { return 'Thầy cô thông báo tuyển người cho ' + TNAME[teamOf(l)] + '. Nhiều bạn trong lớp đăng ký.'; },
    opts: [{ k: 'thu', l: 'Đăng ký và đi tập đều', ai: { w: 1.1, amb: 1 }, run: function (l, r, log) { if (r() < 0.55) { log('Bạn lọt vào đội dự bị, buổi chiều nào cũng tập đến tối mới về.', 'good'); H.fx(l, { hea: 3, soc: 3, hap: 3 }); mem(l, 'Lần đầu khoác áo đội thể thao của trường.', 3); } else { log('Bạn không lọt vào đội chính, nhưng vẫn theo tập và có thêm mấy người bạn mới.', 'neutral'); H.fx(l, { hea: 2, soc: 2 }); } } },
      { k: 'xem', l: 'Chỉ đứng ngoài cổ vũ', ai: { w: 0.7 }, run: function (l, r, log) { log('Bạn ngồi trên khán đài hò hét, còn mơ một ngày sẽ vào sân.', 'neutral'); H.fx(l, { hap: 1, soc: 1 }); } },
      { k: 'tu', l: 'Bận việc nhà, không có thời gian', ai: { w: 0.6 }, req: function (l) { return poor(l) || !l.school; }, run: function (l, r, log) { log('Bạn ở nhà phụ việc, mắt vẫn dõi theo tiếng reo từ sân trường.', 'neutral'); H.fx(l, { hap: -1 }); } }] },
  function (l) { return !!l.school && calm(l); }, 1, 0.06);
  function englandTrack(l) { return E.england829 && E.england829(l); }
  function preparingTransition(l) { return l.school === 'lower' && calm(l) && l.age === (englandTrack(l) ? 15 : 14); }
  K.KID('k955_thi_chuyen_cap', 14, 15, { title: 'Chuẩn bị chuyển cấp', valid: preparingTransition,
    text: function (l) {
      var next = H.inVN(l) ? 'Năm tới là kỳ thi vào lớp 10.' : 'Năm tới, bạn sẽ chọn hướng đi sau khi học xong bậc hiện tại.';
      return next + ' Cả nhà bàn xem nên dành bao nhiêu thời gian để chuẩn bị.';
    },
    opts: [{ k: 'on', l: 'Dành cả mùa hè ôn luyện', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { H.fx(l, { kno: 3, hap: -2 }); log('Bạn nắm chắc thêm nhiều phần khó sau một mùa hè ôn luyện.', 'good'); } },
      { k: 'binh', l: 'Học vừa phải, giữ thời gian chơi', ai: { w: 0.9 }, run: function (l, r, log) { H.fx(l, { kno: 1, hap: 2 }); log('Bạn ôn đều và vẫn giữ được thời gian nghỉ ngơi.', 'neutral'); } },
      { k: 'ban', l: 'Rủ bạn học nhóm', ai: { w: 0.8, soc: 1 }, run: function (l, r, log) { H.fx(l, { kno: 2, soc: 2 }); log('Cả nhóm cùng giải những bài trước đây còn vướng.', 'good'); } }] },
  preparingTransition, 1.1, 0.07);
  K.KID('k955_viec_nha_nong', 10, 14, { title: 'Việc nhà và việc đồng áng',
    text: function (l) { return 'Mùa vụ đến, ' + carer(l) + ' cần thêm tay người ' + (l.urban ? 'trông quầy hàng của nhà' : 'ngoài đồng') + '. Việc học cũng đang vào giai đoạn quan trọng.'; },
    opts: [{ k: 'ca', l: 'Giúp cả buổi, hôm sau đến lớp muộn', ai: { w: 1 }, run: function (l, r, log) { log('Bạn giúp được nhiều việc, gia đình đỡ vất vả, nhưng bài vở bị lỡ vài buổi.', 'neutral'); H.fx(l, { karma: 2, kno: -1, hap: -1 }); } },
      { k: 'chia', l: 'Giúp sau giờ học, tối ôn bài', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { log('Bạn sắp xếp được cả hai, mệt nhưng không bị lỡ buổi nào.', 'good'); H.fx(l, { karma: 1, kno: 1, hea: -1 }); } },
      { k: 'nho', l: 'Nhờ anh chị hoặc người làm công thay', ai: { w: 0.5 }, run: function (l, r, log) { log('Có người đỡ hộ, bạn giữ nguyên lịch học.', 'neutral'); H.fx(l, { kno: 1 }); } }] },
  function (l) { return !!l.school && calm(l) && (poor(l) || dev(l) < 5 || wy(l) < 1990) && (!l.urban || /bán|buôn|chợ|cửa hàng|tạp hóa/i.test(((l.fam && l.fam.mJob) || '') + ' ' + ((l.fam && l.fam.fJob) || ''))); }, 1.2, 0.07);
  K.KID('k955_hoc_ngoai_ngu', 10, 14, { title: 'Lớp ngoại ngữ',
    text: function (l) { var c = cc(l); var n = /^(US|GB|CA|AU|NZ|IE)$/.test(c) ? 'một ngoại ngữ thứ hai (Tây Ban Nha, Pháp hay Quan thoại)' : /^(FR|BE|CH)$/.test(c) ? 'tiếng Anh và tiếng Đức' : /^(CN|JP|KR|TW|VN|TH|ID|BR|MX|DE|ES|IT|RU|PL|TR)$/.test(c) ? 'tiếng Anh' : 'một ngoại ngữ'; return 'Trường mở lớp ' + n + ' sau giờ học. Đây là lần đầu bạn học một thứ tiếng khác, ngoài ngôn ngữ ở nhà.'; },
    opts: [{ k: 'cham', l: 'Học đều và tập nói với bạn', ai: { w: 1.1, smart: 1 }, run: function (l, r, log) { log('Từng câu chào hỏi bạn tập đi tập lại, cuối năm đã bắt chuyện được với người nước ngoài ở chợ.', 'good'); H.fx(l, { kno: 3, hap: 2 }); } },
      { k: 'ngai', l: 'Ngại nói sai nên chỉ học bài', ai: { w: 0.8 }, run: function (l, r, log) { log('Điểm viết khá nhưng nói thì lắp bắp, cô giáo khuyên tập nói nhiều hơn.', 'neutral'); H.fx(l, { kno: 2 }); } },
      { k: 'bo', l: 'Chán, chỉ đi cho có', ai: { w: 0.5 }, run: function (l, r, log) { log('Bạn học qua loa, đến năm sau mới thấy tiếc.', 'neutral'); H.fx(l, { kno: 0 }); } }] },
  function (l) { return !!l.school && calm(l) && wy(l) >= 1950; }, 1, 0.06);
  K.KID('k955_viec_vat', 12, 14, { title: 'Công việc đầu tiên kiếm tiền tiêu vặt',
    text: function (l) { return 'Một người hàng xóm nhờ bạn ' + (/^(US|CA|GB|AU|NZ|IE|DE|NL|SE|NO|DK|FI)$/.test(cc(l)) ? 'giao báo mỗi sáng hoặc trông con nhỏ cuối tuần' : 'phụ bán hàng hoặc giao đồ cuối tuần') + ' để có tiền tiêu vặt.'; },
    opts: [{ k: 'nhan', l: 'Nhận lời, làm cuối tuần', ai: { w: 1.1, amb: 1 }, run: function (l, r, log) { log('Bạn dậy sớm đều đặn, cầm đồng lương đầu tiên mà thấy mình lớn hẳn.', 'good'); H.cash(l, l.base * 0.02, 'Công việc đầu tiên kiếm tiền tiêu vặt'); H.fx(l, { hap: 3, karma: 1 }); mem(l, 'Đồng lương đầu tiên tự kiếm được.', 3); } },
      { k: 'tu', l: 'Từ chối, muốn dành thời gian chơi và học', ai: { w: 0.8 }, run: function (l, r, log) { log('Bạn giữ thời gian cho mình, hơi tiếc vì bạn bè đã có tiền đi xem phim.', 'neutral'); H.fx(l, { hap: 1 }); } }] },
  function (l) { return !!l.school && calm(l) && wy(l) >= 1950 && dev(l) >= 3; }, 0.9, 0.06);

  E.KID955 = { FEST: FEST, teamOf: teamOf, TEAM: TEAM };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
