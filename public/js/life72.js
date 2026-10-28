/* Một Đời — v5.7.0: đời sống từng quốc gia (chế độ Thế giới).
   · chỉ áp dụng cho nhân vật sinh ra ngoài Việt Nam và đang sống ngoài Việt Nam — đời ở Việt Nam giữ nguyên
   · chuyện thường ngày riêng từng nước (lễ hội, ăn uống, đi lại, trường lớp, công việc, thời tiết…), lọc theo tuổi,
     việc học, việc làm, thành thị / nông thôn, gia đình, tôn giáo; mỗi chuyện chỉ kể một lần trong đời
   · tình huống lựa chọn mang đặc trưng quốc gia: kỳ thi đại học, về quê dịp lễ, mất điện, hụi / họ, tiệc công ty,
     thiên tai, khám chữa bệnh, lễ 15 tuổi, lễ hội đường phố, đình công, mai mối, tăng ca, khai thuế, học thêm */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, W = G.W, SC = E.SC;
  function here(l) { return (l.abroad && l.abroad.code) || l.country; }
  function world(l) { return !!l && here(l) !== 'VN' && !!W.BY[here(l)]; }
  function free(l) { return l.alive && !(l.jailUntil != null && l.age < l.jailUntil) && !(l.flags.military && l.age < l.flags.military) && !(l.abroad && l.abroad.trapped); }
  function rel(l) { return E.leisure && E.leisure.rel ? E.leisure.rel(l) : ''; }
  function kids(l, a0, a1) { return (l.kids || []).filter(function (k) { var x = l.age - k.born; return k.alive !== false && x >= a0 && x <= a1; }); }
  function parents(l) { var f = l.fam || {}; return (!f.noMom && f.mAlive) || (!f.noDad && f.fAlive); }
  function partner(l) { return !!(l.partner && l.partner.alive !== false && l.partner.status !== 'dating'); }
  function family(l) { return !!(parents(l) || partner(l) || kids(l, 0, 200).length || (l.sibList || []).some(function (s) { return s.alive; })); }
  function working(l) { var j = l.job && E.jobDef(l); return !!j && j.sec !== 'crime' && !l.retired; }
  function name(l) { return W.BY[here(l)].name; }
  function fx(l, o) { H.fx(l, o); }
  function stress(l, d) { if (l.mind) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function cost(l, k) { return Math.max(0, l.base || 0) * k; }
  function pay(l, k, why) { H.cash(l, -cost(l, k), why); }
  function canPay(l, k) { return l.indep && l.age >= 18 && l.money >= cost(l, k); }
  function on(list) { return function (l) { return list.indexOf(here(l)) >= 0; }; }

  // ===================================================================
  // 1. VÙNG (dùng cho các nước chưa có chuyện riêng)
  // ===================================================================
  var REG = {
    eu: 'AL AD AT BY BE BA BG HR CY CZ DK EE FI FR DE GR HU IS IE IT LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SE CH UA GB VA',
    me: 'DZ BH EG IR IQ IL JO KW LB LY MA OM PS QA SA SY TN TR AE YE',
    af: 'AO BJ BW BF BI CV CM CF TD KM CD CG CI DJ GQ ER SZ ET GA GM GH GN GW KE LS LR MG MW ML MR MU MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG UG ZM ZW',
    sa: 'AF BD BT IN MV NP PK LK',
    ea: 'CN JP KP KR MN TW',
    se: 'BN KH ID LA MY MM PH SG TH TL',
    ca: 'AM AZ GE KZ KG TJ TM UZ',
    la: 'AG AR BS BB BZ BO BR CL CO CR CU DM DO EC SV GD GT GY HT HN JM MX NI PA PY PE KN LC VC SR TT UY VE',
    na: 'US CA',
    oc: 'AU FJ KI MH FM NR NZ PW PG WS SB TO TV VU'
  };
  var REGION = {}; Object.keys(REG).forEach(function (k) { REG[k].split(' ').forEach(function (c) { REGION[c] = k; }); });
  E.worldRegion = function (code) { return REGION[code] || null; };

  // ===================================================================
  // 2. CHUYỆN THƯỜNG NGÀY TỪNG NƯỚC
  // ===================================================================
  // nhãn trước dấu |: * từ 6 tuổi · 1 vào lớp Một (6–7 tuổi) · b còn anh chị em · n 6–12 tuổi · k đang học phổ thông · h đang học THPT · u đang học đại học / sau đại học
  // a từ 18 tuổi · y 18–35 · w đang đi làm · i đã tự lập · p có con 4–17 tuổi · o từ 60 · e từ 65 · c thành thị · r nông thôn
  // f còn gia đình · M Hồi giáo · C Kitô giáo · H Hindu · B Phật giáo · S Sikh · J Do Thái · + vui · - buồn
  var LINES = {
    IN: [
      '*|Cả khu phố dán mắt vào trận cricket Ấn Độ gặp Pakistan, mỗi cú six lại vang tiếng reo khắp con hẻm.+',
      'a|Mùa giải IPL bắt đầu, tối nào quán trà ven đường cũng đông kín người xem chung một màn hình.',
      '*|Gió mùa tây nam về, mưa trút mấy ngày liền, đường ngập tới đầu gối nhưng ai cũng thở phào vì hết nóng.',
      '*|Đợt nắng nóng hơn 45 độ, bạn mang chiếu lên sân thượng ngủ cho mát.',
      'a|Đặt vé tàu Tatkal đúng 10 giờ sáng, trang web quay vòng vòng, vào được thì vé đã sang danh sách chờ.-',
      'a|Chuyến tàu đêm toa giường nằm chật kín, người bán trà đi dọc toa rao "chai, chai" suốt đêm.',
      'ac|Gọi auto-rickshaw đi làm, lại mặc cả từng chục rupee vì tài xế "quên" bật đồng hồ.',
      'h|Mùa thi board lớp 12, cả khu tắt loa nhạc để học sinh ôn bài.',
      'a|Đi cập nhật địa chỉ trên thẻ Aadhaar, xếp hàng từ sáng đến trưa mới tới lượt.',
      'r|Cả làng ngóng mưa để gieo vụ kharif; năm nay mưa đến muộn, ruộng nứt nẻ chờ nước.',
      'a|Đám cưới bên họ hàng kéo dài ba ngày, chú rể cưỡi ngựa trong đoàn baraat giữa tiếng trống dhol.+',
      '*|Bữa trưa là đĩa thali đủ dal, roti, cơm và dưa achar.',
      'c|Mùa đông, khói bụi phủ kín các thành phố phía bắc, chỉ số AQI có ngày vượt 400, trường học phải cho nghỉ.-',
      'a|Thanh toán gì cũng quét mã UPI, cả hàng chè ven đường cũng dán mã QR.',
      'n|Giờ ra chơi cả bọn chơi cricket bằng gậy gỗ và quả bóng tennis cũ ngoài bãi đất trống.+',
      'o|Sáng sớm ra công viên tập yoga và cười với nhóm "câu lạc bộ tiếng cười" của khu phố.+'
    ],
    CN: [
      '*|Đêm giao thừa, chương trình Xuân Vãn phát trên tivi, điện thoại rung liên tục vì bao lì xì WeChat.+',
      'a|Giành được bao lì xì 8,88 tệ trong nhóm chat họ hàng, cả nhóm thi nhau bấm nhanh tay.+',
      'ac|Mọi thứ đều quét mã: bánh bao buổi sáng, tàu điện ngầm, cả ông bán rau ở chợ cũng dán mã Alipay.',
      'a|Ngày 11/11 "Song Thập Nhất", giỏ hàng Taobao đầy ắp, nửa đêm canh giờ thanh toán giảm giá.',
      'k|Từ khi có chính sách "song giảm", bài tập về nhà ít đi, lớp học thêm cuối tuần cũng thưa hẳn.',
      '*|Kỳ nghỉ Quốc khánh "tuần lễ vàng", điểm du lịch nào cũng biển người, chụp ảnh chỉ thấy toàn đầu người.',
      'a|Đi tàu cao tốc vài tiếng đã sang tỉnh khác, nhanh hơn cả đi máy bay nếu tính thời gian chờ.',
      'o|Chiều nào cũng ra quảng trường nhảy múa cùng các bà các chị, loa mở to cả khu.+',
      'o|Sáng sớm tập thái cực quyền trong công viên với nhóm hàng xóm.+',
      '*|Tết Đoan Ngọ, xem đua thuyền rồng và ăn bánh tông gói lá.+',
      '*|Tết Trung thu, ăn bánh trung thu nhân lòng đỏ trứng muối và ngắm trăng.+',
      'y|Bạn bè cùng lứa than chuyện "nằm thẳng" vì áp lực công việc và giá nhà.',
      'a|Họ hàng hỏi dồn dập dịp Tết: "Lương bao nhiêu? Bao giờ cưới? Bao giờ mua nhà?"',
      'h|Năm cuối cấp ba, ngày nào cũng học từ sáng sớm đến tối muộn, trên bảng đếm ngược số ngày đến kỳ thi gaokao.',
      'ac|Gọi đồ ăn qua Meituan, chưa đầy nửa tiếng shipper áo vàng đã đứng trước cửa.'
    ],
    NG: [
      '*|Điện lưới lại cắt, cả phố rộ tiếng máy phát chạy xăng, ai cũng gọi đùa đó là "bố đời hàng xóm".-',
      'a|Đi dự tiệc owambe, khách mặc vải aso-ebi cùng màu, mọi người tung tiền lên cô dâu chú rể đang nhảy.+',
      '*|Cuộc tranh cãi muôn thuở trên mạng lại nổ ra: cơm jollof của Nigeria hay Ghana ngon hơn.',
      'ac|Kẹt xe "go-slow" kinh hoàng, ngồi trên chiếc danfo vàng gần hai tiếng mới đến nơi.-',
      'a|Giá xăng tăng vọt sau khi bỏ trợ giá, cuốc okada lên giá gấp đôi.-',
      'k|Ôn thi WAEC, tối mất điện phải học dưới ánh đèn sạc.',
      '*|Super Eagles đá vòng loại, quán ngoài trời hò hét theo từng pha bóng.+',
      'a|Nollywood ra phim mới, nhóm bạn rủ nhau xem rồi cãi nhau suốt về cái kết.',
      'r|Lễ hội khoai mỡ mới (New Yam) của làng, trưởng làng cắt củ khoai đầu mùa trước khi mọi người được ăn.+',
      'a|Ngân hàng thiếu tiền mặt, máy ATM nào cũng có hàng dài người xếp chờ.-',
      'n|Cả xóm trẻ con đá bóng chân đất trên con đường đất đỏ đến khi trời tối.+',
      'a|Đi chợ Balogun mặc cả từng xấp vải, người bán gọi ai cũng là "customer".'
    ],
    PK: [
      '*|Lại đến giờ cắt điện luân phiên, quạt trần đứng im giữa trưa hè.-',
      '*|Trận cricket Pakistan gặp Ấn Độ, đường phố vắng tanh, ai cũng dán mắt vào màn hình.',
      '*|Những chiếc xe tải vẽ hoa văn sặc sỡ, treo chuông leng keng chạy ngang phố.',
      'a|Mùa cưới, đêm mehndi rộn ràng tiếng trống dhol và nhạc Punjab.+',
      '*|Bữa sáng ngày nghỉ là halwa puri và chén chai đặc sữa.+',
      '*|Ngày Độc lập 14/8, phố phường rợp cờ xanh trắng, trẻ con thổi kèn nhựa inh ỏi.+',
      'c|Mùa đông, khói mù phủ kín các thành phố phía đông, trường học phải tạm nghỉ.-',
      'a|Đi chợ bazaar mặc cả, chủ quầy mời chén trà trước rồi mới bàn giá.',
      'n|Mùa diều, trẻ con leo lên mái nhà thả diều, thi cắt dây diều của nhau.+',
      'a|Chuyến xe buýt đường dài dừng ở quán dhaba ven đường, ăn bánh naan nóng với gà karahi.'
    ],
    ID: [
      '*|Ngày 17/8, cả xóm tổ chức trò chơi mừng Độc lập: leo cột cau, đua nhảy bao bố, thi ăn bánh phồng treo dây.+',
      'ac|Gọi xe ôm công nghệ ojek đi làm, luồn lách giữa dòng xe kẹt cứng.',
      '*|Bữa tối là đĩa nasi goreng mua ở xe đẩy, chủ xe gõ bát leng keng rao hàng.+',
      '*|Mùa mưa, nước ngập lên đến bậc cửa, xe máy chết máy giữa đường.-',
      '*|Động đất nhẹ rung cả nhà vài giây, cả xóm chạy ra đường rồi lại cười xòa đi vào.',
      'k|Sáng thứ Hai chào cờ, cả trường mặc đồng phục áo trắng quần đỏ đứng nghiêm dưới nắng.',
      'w|Thứ Sáu cả cơ quan mặc áo batik, bạn chọn chiếc áo hoa văn yêu thích.',
      'a|Đi xem múa rối bóng wayang kulit kéo dài gần hết đêm.',
      'a|Ăn sate ở hàng ven đường, khói than thơm lừng cả góc phố.+',
      'n|Mùa diều, trẻ con chạy khắp bờ ruộng thả những con diều tự làm.+'
    ],
    ET: [
      '*|Tết Enkutatash vào tháng Chín, trẻ con đi hát rong từng nhà và tặng tranh vẽ hoa cúc vàng.+',
      'a|Nghi lễ cà phê buna: rang hạt, giã, pha ba lượt abol, tona, baraka, ngồi trọn buổi chiều.+',
      '*|Cả nhà ngồi quanh một mâm injera lớn, xé bánh chấm món hầm wat.+',
      'a|Lịch Ethiopia chậm hơn lịch phương Tây bảy, tám năm, làm giấy tờ với người nước ngoài phải giải thích mãi.',
      'C|Lễ Timkat, đoàn rước tabot đi qua phố, cả thành phố trắng muốt áo truyền thống.+',
      '*|Sáng sớm đường chạy đầy người tập, ai cũng mơ thành vận động viên như Haile Gebrselassie.',
      'ac|Đi xe minibus xanh trắng, phụ xe thò đầu ra cửa hô tên điểm đến liên tục.',
      'r|Mùa mưa kiremt, đường đất lầy lội, đi chợ mất gấp đôi thời gian.-',
      'C|Lễ Meskel, đốt đống lửa demera lớn ở quảng trường, mọi người hát mừng.+'
    ],
    US: [
      'a|Đến mùa khai thuế, ngồi cả buổi tối điền mẫu đơn trên mạng cho kịp hạn 15 tháng 4.',
      '*|Ngày 4 tháng 7, ăn thịt nướng ở công viên rồi ngồi chờ xem pháo hoa.+',
      'f|Lễ Tạ ơn, ăn gà tây, khoai nghiền, bánh bí ngô rồi ngồi xem bóng bầu dục trên tivi.+',
      'a|Đi ăn nhà hàng, cộng thêm 18–20% tiền tip mới là giá thật.',
      '*|Super Bowl Chủ nhật, nhóm bạn tụ tập ăn cánh gà, nhiều người xem chỉ vì quảng cáo và màn diễn giữa giờ.+',
      'n|Halloween hóa trang, đi gõ cửa từng nhà xin kẹo "trick or treat", về đổ ra đếm cả túi.+',
      'k|Đi xe buýt vàng đến trường, ngồi hàng ghế cuối với nhóm bạn thân.',
      'a|Không có ô tô thì đi chợ cũng thành chuyện lớn, nhà ở ngoại ô cách siêu thị cả chục cây số.',
      'u|Bạn bè cùng khóa than chuyện nợ vay sinh viên mỗi khi nói đến tương lai.',
      'a|Thư bảo hiểm y tế gửi về toàn mã dịch vụ khó hiểu, gọi tổng đài cả tiếng mới rõ.-',
      'a|Black Friday, có người xếp hàng từ nửa đêm trước cửa hàng điện máy để săn tivi giảm giá.',
      'r|Cuối tuần đi chợ nông sản của thị trấn, mua mật ong và bắp tươi.+',
      'k|Trường tổ chức hội chợ khoa học, cả lớp trưng bày mô hình núi lửa phun "dung nham" giấm và baking soda.+',
      'e|Đến tuổi hưởng Medicare, ngồi đọc mãi mới phân biệt được phần A, B, D.',
      'a|Mùa giải bóng chày, đi xem trận ở sân, ăn xúc xích và hát "Take Me Out to the Ball Game" giữa hiệp bảy.+'
    ],
    BD: [
      '*|Pohela Boishakh, Tết Bengal: mọi người mặc đỏ trắng, ăn panta ilish là cơm ngâm với cá hilsa.+',
      'r|Mùa lũ, nước ngập đường làng, phải chèo thuyền đi chợ.-',
      'ac|Kẹt xe ở thủ đô, những chiếc xích lô vẽ hoa sặc sỡ chen kín ngã tư.',
      'w|Nhà máy may tăng ca dịp cao điểm đơn hàng xuất khẩu, tối mịt mới về.',
      '*|Đội cricket "Những chú hổ" ra sân, cả khu phố tụ trước một chiếc tivi.',
      '*|Ngày 21/2, Ngày Tiếng mẹ đẻ, mọi người đi chân trần đặt hoa ở đài tưởng niệm Shaheed Minar.',
      'a|Đám cưới có lễ gaye holud, họ hàng bôi nghệ lên cô dâu chú rể, hát múa rộn ràng.+',
      'r|Mùa gặt lúa boro, cả làng ra đồng từ tinh mơ.',
      '*|Bão vịnh Bengal sắp vào, loa phát thanh nhắc mọi người chuẩn bị đến nhà trú bão.-'
    ],
    BR: [
      '*|Festa Junina tháng Sáu: ăn bắp luộc, uống quentão, nhảy quadrilha quanh đống lửa.+',
      'a|Chủ nhật làm tiệc nướng churrasco với bạn bè, bia lạnh và nhạc pagode.+',
      'a|Thanh toán gì cũng bằng Pix, chuyển khoản tức thì chỉ bằng mã QR.',
      'f|Tám giờ tối xem telenovela, cả nhà bàn tán về nhân vật phản diện.',
      'a|Mua đồ trả góp "parcelado" 10 kỳ không lãi, từ tủ lạnh đến đôi giày.',
      '*|Mùa World Cup, cả nước nghỉ làm sớm xem đội tuyển áo vàng thi đấu.+',
      '*|Trận derby của đội bóng thành phố, hàng xóm treo cờ ra cửa sổ, pháo nổ khi có bàn thắng.+',
      'a|Sáng thứ Bảy ra chợ phiên (feira) uống nước mía, ăn pastel vừa chiên.+',
      'c|Xe buýt giờ cao điểm chật như nêm, đường về nhà mất gần hai tiếng.-',
      'n|Chơi bóng đá futsal ở sân xi măng của trường đến tận lúc trời tối.+'
    ],
    EG: [
      '*|Bữa sáng là ful medames và bánh ta\'ameya chiên giòn mua ở xe ven đường.+',
      'a|Ngồi quán ahwa uống trà, chơi cờ tavla với hàng xóm đến khuya.',
      'ac|Đi microbus, khách tự chuyền tiền xe lên phía trước, phụ xe hô tên điểm dừng liên tục.',
      'f|Lễ Sham el-Nessim, cả nhà đi dã ngoại ngoài công viên, ăn cá muối fesikh và trứng tô màu.+',
      'h|Năm thi Thanaweya Amma, lịch học thêm kín từ chiều đến tối, cả nhà như lên dây cót.',
      '*|Trận Al Ahly gặp Zamalek, thành phố chia làm hai màu đỏ và trắng.',
      'a|Giá cả leo thang sau mấy đợt đồng bảng mất giá, đi chợ phải tính từng món.-',
      'a|Mùa hè nóng gay gắt, nhiều người kéo nhau ra biển Alexandria hóng gió.',
      'r|Ven sông Nile, người làng vẫn tưới ruộng bằng kênh mương đào từ bao đời.'
    ],
    PH: [
      'ac|Đi xe jeepney, chuyền tiền xe lên tài xế kèm câu "bayad po".',
      '*|Từ tháng Chín, các tháng "ber" đã rộn nhạc Giáng sinh khắp trung tâm thương mại.+',
      '*|Bão (bagyo) vào, trường học thông báo nghỉ, lũ trẻ reo "walang pasok!".',
      'a|Nhà hàng xóm hát karaoke đến khuya, bài "My Way" vang lên lần thứ ba trong tối.',
      'a|Người họ hàng làm việc ở nước ngoài gửi thùng balikbayan về, cả xóm hồi hộp xem mở hộp.+',
      '*|Ngày hội fiesta của barangay, nhà nào cũng nấu ăn mời khách qua đường.+',
      '*|Sân bóng rổ đầu ngõ lúc nào cũng có người chơi, kể cả giữa trưa nắng.',
      '*|Giữa trưa nắng, ăn một ly halo-halo đá bào đủ màu.+',
      'f|Lễ Undas đầu tháng 11, ra nghĩa trang thắp nến, ngồi ăn uống bên mộ người thân.',
      'k|Ở trường, cả lớp nói chuyện bằng "Taglish", nửa tiếng Tagalog nửa tiếng Anh.'
    ],
    MX: [
      '*|Día de Muertos, dựng bàn thờ ofrenda với hoa cúc vạn thọ, bánh pan de muerto và ảnh người đã khuất.',
      '*|Đêm 15/9 nghe lễ "El Grito" mừng Quốc khánh, ăn món pozole.+',
      'a|Nửa đêm ăn taco al pastor ở xe ven đường, thịt nướng quay xoay trên xiên.+',
      '*|Còi báo động động đất vang lên, mọi người chạy ra khỏi tòa nhà theo diễn tập.',
      'a|Cuối tuần đi chợ phiên tianguis, mua trái cây và đồ gia dụng.',
      'f|Đêm posada tháng 12, đập piñata hình ngôi sao bảy cánh, kẹo rơi đầy sân.+',
      'a|Đi xem đấu vật lucha libre, các đô vật đeo mặt nạ bay từ trên dây xuống.+',
      'c|Đi metro giờ cao điểm, có toa riêng cho phụ nữ và trẻ em.',
      'n|Sinh nhật bạn cùng lớp có màn cắn bánh "mordida", bị dúi mặt vào kem.+',
      'f|Ngày 6/1 Lễ Ba Vua, cả nhà cắt bánh rosca, ai trúng hình em bé phải đãi tamal ngày 2/2.+'
    ],
    TZ: [
      'ac|Đi daladala, xe chật đến mức đứng cũng không còn chỗ, phụ xe vẫn gọi thêm khách.',
      '*|Bữa tối là ugali ăn cùng rau và cá rán.',
      'a|Chuyển tiền cho người nhà bằng M-Pesa, chỉ mấy tin nhắn là xong.',
      'r|Mùa mưa dài masika, ruộng ngô xanh lại nhưng đường đất thành bùn.',
      '*|Ngày Độc lập 9/12, trường học tập diễu hành, cờ xanh vàng đen rợp phố.+',
      'a|Đi bajaji ba bánh về nhà, mặc cả bằng tiếng Swahili, nhắc nhau "pole pole" — từ từ thôi.'
    ],
    UG: [
      'ac|Gọi boda boda về nhà, ông xe ôm phóng vèo vèo qua những con dốc đất đỏ.',
      '*|Ăn "rolex" — trứng chiên cuộn bánh chapati — ở hàng ven đường.+',
      '*|Bữa trưa có matooke, chuối xanh hấp nghiền ăn với nước sốt lạc.',
      'C|Ngày 3/6 Lễ các Thánh tử đạo, hàng triệu người hành hương về Namugongo.',
      'r|Mùa mưa về, cả nhà ra vườn trồng chuối và cà phê.',
      'a|Cuối tuần ra hồ Victoria ăn cá rô phi nướng.+'
    ],
    KE: [
      'ac|Đi matatu vẽ graffiti sặc sỡ, nhạc mở to đến rung cả ghế.',
      'a|Từ tiền chợ đến tiền điện đều trả bằng M-Pesa trên điện thoại.',
      '*|Bữa tối là ugali với sukuma wiki — cải xào — món quen của mọi nhà.',
      '*|Cả nước xem các vận động viên Kenya thắng giải marathon lớn, ai cũng tự hào.+',
      'r|Mùa mưa dài tháng Tư, cả nhà tranh thủ gieo ngô và đậu.',
      'c|Kẹt xe trên đường cao tốc ra trung tâm, đi chưa đến mười cây số mất cả tiếng.-',
      'k|Năm cuối cấp ôn thi KCSE, học nội trú, cuối tuần mới gặp gia đình.'
    ],
    CD: [
      '*|Nhạc rumba Congo phát khắp các quán ven đường, ai đi ngang cũng lắc lư theo.+',
      'a|Thấy hội "La Sape" diện vest màu sặc sỡ dạo phố, khách qua đường dừng lại chụp ảnh.',
      '*|Bữa trưa là fufu sắn ăn cùng pondu — lá sắn giã nấu với cá khô.',
      '*|Điện lại mất cả buổi tối, cả khu thắp đèn dầu ngồi trước hiên nói chuyện.-',
      'ac|Chen lên chiếc xe buýt nhỏ cũ kỹ, cửa không đóng được, người đứng bám ngoài thành xe.',
      'r|Mùa thu hoạch sắn, cả làng phơi sắn trắng xóa bên đường.'
    ],
    RU: [
      'f|Mùa hè ra dacha ngoại ô trồng cà chua, dưa chuột rồi muối dưa ăn cả mùa đông.+',
      '*|Tuần lễ Maslenitsa, ăn bánh blini với mứt và kem chua, cuối tuần đốt hình nộm mùa đông.+',
      '*|Đêm giao thừa là ngày lễ lớn nhất, bàn tiệc có salad Olivier, đồng hồ Điện Kremlin điểm 12 tiếng trên tivi.+',
      'a|Đi tắm hơi banya, đập nhẹ chổi lá bạch dương rồi nhảy vào nước lạnh.',
      '*|Mùa đông âm 25 độ, khói thở ra đóng băng trên khăn quàng.-',
      'c|Đi tàu điện ngầm, nhà ga trang trí đèn chùm và tranh khảm như cung điện.',
      'n|Ngày 1/9 khai giảng, học sinh mang bó hoa thật to tặng cô giáo.+',
      'a|Mùa thu vào rừng hái nấm, về ngâm muối đầy mấy hũ.+'
    ],
    ZA: [
      'a|Cuối tuần làm tiệc nướng braai với bạn bè, thịt cừu và xúc xích boerewors.+',
      '*|Lịch cắt điện luân phiên được báo theo "cấp độ", ai cũng mở ứng dụng xem tối nay mất điện mấy giờ.-',
      'ac|Đi minibus taxi, ra hiệu bằng tay để báo điểm đến cho tài xế.',
      '*|Đội rugby Springboks thắng trận lớn, cả nước mặc áo xanh lá đi làm.+',
      '*|Ngày Di sản 24/9, ai cũng gọi đùa là "Ngày nướng thịt quốc gia".+',
      'a|Đi siêu thị nghe đủ thứ tiếng: isiZulu, isiXhosa, Afrikaans, tiếng Anh…',
      'r|Mùa khô, cả vùng hạn chế nước, mỗi nhà chỉ được dùng theo định mức.-'
    ],
    IR: [
      'f|Tết Nowruz, bày mâm haft-sin bảy món bắt đầu bằng chữ "s", đi thăm họ hàng cả tuần.+',
      '*|Đêm Chaharshanbe Suri, nhảy qua đống lửa nhỏ, cầu cho năm mới khỏe mạnh.+',
      'f|Đêm Yalda dài nhất năm, cả nhà ăn lựu, dưa hấu và đọc thơ Hafez đến khuya.+',
      'f|Ngày Sizdah Bedar, cả nhà ra công viên dã ngoại, thả rau mầm sabzeh xuống dòng nước.+',
      'a|Uống trà ngậm viên đường, nghe chủ nhà khách sáo theo phép "taarof" mãi mới chịu nhận tiền.',
      'a|Giá cả thay đổi theo tuần, đi chợ phải hỏi giá lại từng món.-'
    ],
    TR: [
      '*|Uống trà trong ly hình hoa tulip, trà nối trà suốt buổi trò chuyện.',
      'a|Bữa sáng kiểu Thổ dọn kín bàn: pho mát, ô liu, trứng menemen, mật ong và kaymak.+',
      '*|Mua bánh simit vòng rắc mè ở xe đẩy ven đường.',
      '*|Trường và cơ quan tập diễn tập động đất, ai cũng chuẩn bị túi khẩn cấp ở cửa nhà.',
      'ac|Đi dolmuş, khách chuyền tiền xe lên tài xế qua từng hàng ghế.',
      '*|Trận derby Galatasaray gặp Fenerbahçe, thành phố náo loạn tiếng còi xe.',
      'f|Dịp bayram đi thăm người lớn tuổi, hôn tay người già rồi đặt lên trán, trẻ con được kẹo và tiền.+'
    ],
    JP: [
      '*|Mùa hoa anh đào, trải bạt ngồi ngắm hoa (hanami) dưới gốc cây cùng bạn bè.+',
      '*|Tuần lễ Vàng đầu tháng Năm, tàu Shinkansen chật kín, đường cao tốc tắc hàng chục cây số.',
      'f|Dịp Obon, về quê thắp đèn lồng đón ông bà, tối đi xem múa bon odori.+',
      'a|Cuối năm ngồi viết thiệp chúc Tết nengajo, đóng dấu con giáp của năm mới.',
      'a|Ghé konbini mua cơm nắm, trả tiền điện và gửi bưu kiện trong vòng năm phút.',
      '*|Điện thoại rú lên cảnh báo động đất khẩn cấp, cả phòng nín thở vài giây chờ rung chấn đi qua.-',
      'c|Tàu điện giờ cao điểm đông đến mức nhân viên phải đẩy khách cho cửa đóng được; tàu trễ một phút cũng có loa xin lỗi.',
      '*|Lễ hội pháo hoa mùa hè, mặc yukata đi ăn takoyaki ở các quầy hàng.+',
      'f|Đêm giao thừa ăn mì soba trường thọ, sáng mùng Một đi lễ đền hatsumōde.+',
      'k|Cuối giờ học, cả lớp tự lau sàn, lau bảng, đổ rác — trường không thuê người dọn.',
      '1|Ngày đầu đi học lớp Một, đeo chiếc cặp randoseru mới tinh ông bà mua.+',
      'a|Phân loại rác theo lịch: chai nhựa thứ Ba, đồ cháy được thứ Năm — để nhầm là bị dán giấy nhắc.',
      'a|Đi tắm suối nước nóng onsen, ngâm mình ngắm tuyết rơi.+'
    ],
    KR: [
      'f|Tết Chuseok, cả nhà làm bánh songpyeon, đi tảo mộ tổ tiên.+',
      'f|Sáng Tết Seollal, mặc hanbok cúi lạy chúc Tết người lớn (sebae), được lì xì phong bì.+',
      'k|Tan trường lại đến lớp học thêm hagwon, gần nửa đêm mới về nhà.-',
      'a|Tối thứ Sáu gọi gà rán với bia (chimaek), xem bóng chày trên tivi.+',
      'k|Ra quán PC bang chơi game với hội bạn, gọi mì ly ngay tại chỗ.',
      'a|Đồ ăn đặt qua ứng dụng giao tới trong hai mươi phút, cả đến công viên bờ sông Hán cũng giao.',
      'a|Đi KTX từ Seoul xuống Busan hơn hai tiếng, chưa kịp ngủ đã đến nơi.',
      'y|Bạn bè cùng lứa bàn chuyện tiền đặt cọc jeonse thuê nhà, số tiền lớn đến chóng mặt.',
      'y|Một người bạn lên đường nhập ngũ, cả nhóm tiễn ở cổng trại huấn luyện, hẹn mười tám tháng sau gặp lại.',
      '*|Cổ vũ đội tuyển Hàn Quốc, cả quảng trường đỏ rực áo "Red Devils".+'
    ],
    DE: [
      'a|Chủ nhật cửa hàng đóng cửa hết, quên mua sữa từ thứ Bảy là chịu.',
      'a|Mang chai nhựa ra máy trả vỏ ở siêu thị lấy lại tiền cọc Pfand.',
      '*|Tháng Mười Hai, đi chợ Giáng sinh uống rượu vang nóng Glühwein, ăn bánh gừng.+',
      'a|Tàu Deutsche Bahn lại trễ, chuyến nối tiếp bị lỡ, bảng điện tử báo "trễ 40 phút".-',
      'a|Bữa tối Abendbrot chỉ là bánh mì đen, pho mát và xúc xích lạnh.',
      'a|Đúng sáu giờ chiều là "Feierabend", văn phòng vắng tanh, không ai gửi email công việc nữa.',
      'p|Xin chỗ nhà trẻ Kita cho con, gửi hồ sơ cả chục nơi mới có chỗ.',
      'a|Tranh thủ ngày nắng hiếm hoi, cả công viên kín người nằm phơi nắng.+',
      'a|Mùa giải Bundesliga, đi xem trận ở sân, cả khán đài đứng hát suốt chín mươi phút.+'
    ],
    FR: [
      'a|Sáng nào cũng ghé tiệm boulangerie mua ổ bánh mì baguette còn ấm.+',
      'a|Đình công giao thông, tàu điện ngầm chạy một chuyến bỏ hai, đi làm mất gấp đôi thời gian.-',
      '*|Ngày 14/7, xem diễu binh trên tivi buổi sáng, tối ra bờ sông xem pháo hoa.+',
      'w|Giờ nghỉ trưa kéo dài, đồng nghiệp ngồi ăn đủ món khai vị, món chính, tráng miệng.',
      'a|Tháng Tám cả thành phố vắng hẳn, ai cũng đi nghỉ hè, tiệm bánh dán giấy "nghỉ đến 25/8".',
      'f|Tháng Giêng cắt bánh galette des rois, ai trúng hạt đậu được đội vương miện giấy.+',
      'a|Sáu giờ chiều rủ bạn đi "apéro", ngồi nhâm nhi đồ uống và pho mát.+',
      '*|Tour de France chạy qua vùng, cả làng ra đường đứng chờ đoàn đua vụt qua trong vài giây.+'
    ],
    GB: [
      'a|Gọi điện đặt lịch bác sĩ gia đình (GP) lúc 8 giờ sáng, máy báo bạn là người thứ 23 đang chờ.-',
      'a|Tối thứ Năm đi pub quiz với đồng nghiệp, đội về nhì vì một câu hỏi về thủ đô Úc.',
      '*|Đêm Guy Fawkes 5/11, đi xem đốt lửa và bắn pháo hoa ở công viên.+',
      'f|Trưa Chủ nhật ăn "Sunday roast": thịt nướng, bánh Yorkshire pudding và nước sốt gravy.+',
      'a|Lại một cuộc đình công đường sắt, phải đi xe buýt thay tàu, mất hơn hai tiếng.-',
      '*|Mùa hè chỉ có vài ngày nắng, ai cũng ra công viên nằm dài dù trời mới 22 độ.',
      'a|Xếp hàng ngay ngắn ở trạm xe buýt, ai chen ngang là cả hàng nhìn với ánh mắt khó chịu.',
      'a|Pha trà sữa đúng kiểu, tranh luận mãi chuyện cho sữa vào trước hay sau.',
      'a|Ngày khai mạc Premier League, cả quán pub hò hét theo từng bàn thắng.+'
    ],
    IT: [
      'a|Đứng ở quầy bar uống một tách espresso trong hai phút rồi đi làm.',
      'f|Bữa trưa Chủ nhật kéo dài đến chiều, bà nấu mì ống tự cán tay.+',
      '*|Lễ Ferragosto 15/8, cả thành phố vắng hoe, mọi người ra biển.+',
      'a|Bảy giờ tối đi uống aperitivo, gọi một ly spritz là được ăn kèm đồ nhắm.+',
      'n|Đêm 5/1 treo tất chờ bà Befana mang kẹo, ai hư thì nhận "than" làm bằng đường.+',
      '*|Trận derby Serie A, cả xóm chia phe cãi nhau từ sáng.'
    ],
    ES: [
      'a|Mười giờ tối mới ăn tối, nhà hàng lúc tám giờ vẫn còn vắng tanh.',
      'a|Đi bar tapas, gọi mỗi món một đĩa nhỏ đứng ăn cùng bạn bè.+',
      'f|Đêm giao thừa ăn 12 quả nho theo 12 tiếng chuông, nuốt không kịp là cười sặc sụa.+',
      'n|Ngày 6/1 Lễ Ba Vua, sáng dậy chạy ra xem quà đặt cạnh đôi giày.+',
      '*|Trận "El Clásico" Real Madrid gặp Barcelona, quán bar nào cũng chật cứng.',
      'a|Giữa trưa hè nóng 40 độ, phố xá vắng ngắt, cửa hàng đóng cửa nghỉ trưa.'
    ],
    TH: [
      '*|Tết Songkran, cả phố té nước vào nhau, súng nước và xô nước ở khắp nơi.+',
      '*|Đêm Loy Krathong, thả đèn hoa krathong trên sông, ước một điều cho năm mới.+',
      'B|Sáng sớm đặt cơm và đồ ăn vào bát khất thực của các nhà sư đi qua ngõ.',
      'ac|Ghé 7-Eleven mua bánh mì nướng kẹp pho mát, cửa hàng ở cách nhau vài chục mét.',
      'ac|Đi xe ôm áo cam đầu ngõ, luồn qua dòng xe kẹt cứng giờ tan tầm.',
      'a|Đi chợ đêm ăn xôi xoài, gỏi đu đủ som tam cay xé lưỡi.+',
      'a|Xem phim ở rạp, cả khán phòng đứng dậy khi quốc ca và hình ảnh nhà vua chiếu trước buổi chiếu.',
      'k|Đầu năm học có lễ Wai Khru, học sinh dâng hoa tri ân thầy cô.+'
    ],
    MY: [
      'a|Khuya đi quán mamak uống teh tarik, ăn roti canai với nhóm bạn.+',
      '*|Ngày Merdeka 31/8, phố phường cắm cờ Jalur Gemilang, xem diễu hành trên tivi.+',
      'a|Dịp lễ, các gia đình mở "open house" mời bạn bè mọi sắc tộc đến ăn uống.+',
      '*|Mùa sầu riêng, cả khu phố thơm nồng, quầy trái cây bày la liệt.',
      'a|Ăn nasi lemak gói lá chuối cho bữa sáng.',
      '*|Mưa chiều nhiệt đới đổ ào ào đúng giờ tan tầm, đường ngập loang lổ.'
    ],
    SG: [
      'a|Đến hawker centre, đặt gói khăn giấy lên bàn để "chope" giữ chỗ trước khi đi mua đồ ăn.',
      'a|Ăn cơm gà Hải Nam và uống kopi ở trung tâm ẩm thực gần nhà.+',
      '*|Ngày 9/8 xem Lễ diễu hành Quốc khánh, máy bay bay qua kéo lá cờ đỏ trắng.+',
      'a|Đi MRT điều hòa lạnh buốt dù ngoài trời 33 độ.',
      'y|Một người bạn đi nghĩa vụ quốc gia, cuối tuần mới được về nhà.',
      'a|Đăng ký mua căn hộ HDB, bốc thăm chờ mấy năm mới đến lượt nhận nhà.'
    ],
    TW: [
      'a|Đi chợ đêm ăn gà rán, đậu phụ thối và uống trà sữa trân châu.+',
      'a|Nghe xe rác bật nhạc "Für Elise" đầu ngõ, cả xóm cầm túi rác chạy ra.',
      'ac|Dòng xe tay ga xếp kín vạch chờ đèn đỏ, đèn xanh là cả đàn lao đi.',
      '*|Bão vào, chính quyền thông báo nghỉ làm nghỉ học, cả nhà ở nhà tích trữ mì gói.',
      'a|Cửa hàng tiện lợi cái gì cũng làm được: in tài liệu, trả hóa đơn, nhận bưu kiện.'
    ],
    SA: [
      'a|Mùa hè nóng gần 50 độ, đi đâu cũng chỉ từ ô tô điều hòa vào trung tâm thương mại điều hòa.',
      'f|Mùa đông ra sa mạc cắm trại, nướng thịt và uống cà phê Ả Rập với chà là.+',
      'a|Mùa lễ hội giải trí, thành phố có hòa nhạc, sân khấu và khu vui chơi mở đến tận khuya.+',
      'f|Bữa trưa cuối tuần là mâm kabsa cơm thịt cừu lớn, mọi người ngồi quanh cùng ăn.+'
    ],
    AE: [
      'a|Tháng Tám nóng 45 độ, bước ra khỏi tòa nhà mà kính mắt mờ hơi nước.',
      'a|Ở chỗ làm có đồng nghiệp từ hàng chục quốc gia, giờ ăn trưa như một hội chợ ẩm thực thế giới.',
      'ac|Đi metro không người lái, toa hạng vàng và toa dành cho phụ nữ tách riêng.',
      'a|Mùa đông dễ chịu, cả thành phố đổ ra bãi biển và công viên.+'
    ],
    CO: [
      'a|Ăn arepa nướng nhân pho mát cho bữa sáng, uống tách tinto.',
      'a|Tối thứ Bảy đi nhảy salsa, quán nhạc chật kín người.+',
      'ac|Ngày "pico y placa", xe biển số đuôi của bạn bị cấm chạy giờ cao điểm, phải đi buýt.',
      '*|Đội tuyển Colombia đá vòng loại, cả nước mặc áo vàng, đường phố vang tiếng còi.+',
      'r|Mùa hái cà phê trên sườn đồi, cả xóm đi hái thuê.'
    ],
    AR: [
      'a|Chia nhau một bình trà mate, chuyền tay ống hút bombilla trong nhóm bạn.',
      'f|Trưa Chủ nhật làm tiệc nướng asado, thịt bò nướng than kéo dài đến chiều.+',
      '*|Trận siêu kinh điển Boca gặp River, cả thành phố như ngừng thở.',
      'a|Giá cả thay đổi liên tục, siêu thị dán nhãn giá mới mỗi tuần.-',
      'a|Ăn bánh alfajor kẹp dulce de leche với cà phê chiều.+'
    ],
    PE: [
      'a|Ăn ceviche cá tươi vắt chanh vào giờ trưa, ăn kèm khoai lang và ngô to hạt.+',
      '*|Lễ Inti Raymi ngày 24/6, tái hiện lễ thờ thần Mặt Trời của người Inca.+',
      'ac|Đi xe combi, phụ xe đứng ở cửa hô tên đường liên tục.',
      '*|Fiestas Patrias cuối tháng Bảy, cả nước treo cờ đỏ trắng trước nhà.+'
    ],
    CA: [
      '*|Mùa khúc côn cầu, cả nhà ngồi xem trận NHL, ai cũng có đội "ruột".',
      'a|Ghé Tim Hortons gọi cà phê "double-double" — hai kem, hai đường.',
      '*|Mùa đông âm 30 độ, cắm điện sưởi máy ô tô qua đêm để sáng còn nổ máy được.-',
      '*|Ngày Canada 1/7, mặc áo đỏ đi xem pháo hoa.+',
      'a|Mùa xuân về vùng quê dự lễ "cabane à sucre", ăn kẹo xi-rô lá phong cuộn trên tuyết.+',
      'a|Khói cháy rừng từ xa bay về, trời vàng đục, ứng dụng thời tiết cảnh báo hạn chế ra ngoài.-'
    ],
    AU: [
      'a|Cuối tuần làm tiệc nướng "barbie" ở công viên, bếp nướng công cộng miễn phí.+',
      '*|Mùa xuân, chim ác là sà xuống mổ đầu người đi xe đạp, ai cũng gắn dây kẽm lên mũ bảo hiểm.',
      '*|Ra biển tắm giữa hai lá cờ đỏ vàng của đội cứu hộ.+',
      'a|Ngày đua ngựa Melbourne Cup, cả văn phòng dừng tay xem cuộc đua ba phút.',
      '*|Bôi kem chống nắng mỗi sáng, chỉ số tia UV lúc nào cũng ở mức "cực cao".',
      '*|Mùa cháy rừng, ứng dụng cảnh báo báo động, khói mù phủ kín cả thành phố.-'
    ],
    NZ: [
      '*|Đội rugby All Blacks múa haka trước trận đấu, cả sân lặng đi rồi vỡ òa.+',
      '*|Ngày Waitangi 6/2, xem lễ kỷ niệm hiệp ước trên tivi.',
      '*|Kỳ nghỉ lễ Matariki giữa mùa đông, cả nhà ngắm chòm sao Tua Rua.+',
      'a|Đi bộ đường dài trên núi, đường mòn có lán nghỉ cho người leo.'
    ],
    GH: [
      '*|Điện lại cắt "dumsor", cả xóm kê ghế ra hiên ngồi cho mát.-',
      'a|Đi tiệc mặc vải kente sặc sỡ, nhạc highlife vang đến khuya.+',
      'a|Ăn cơm jollof và kelewele chuối rán cay ở hàng ven đường.+',
      'ac|Đi trotro, phụ xe hô tên điểm đến và đập tay lên thành xe.'
    ],
    KH: [
      '*|Tết Chol Chnam Thmey tháng Tư, té nước và chơi trò chơi dân gian ở sân chùa.+',
      '*|Lễ hội nước Bon Om Touk, xem đua thuyền trên sông.+',
      'ac|Đi tuk-tuk qua những con phố đầy hàng rong.'
    ],
    LA: [
      '*|Tết Boun Pi Mai tháng Tư, té nước và buộc chỉ cổ tay chúc phúc.+',
      '*|Bữa nào cũng có xôi đựng trong giỏ tre, vo viên chấm jeow ớt.',
      'B|Lễ hội That Luang, đoàn rước mang tháp sáp ong về chùa.+'
    ],
    MM: [
      '*|Lễ hội nước Thingyan, cả thành phố té nước suốt mấy ngày.+',
      '*|Bôi bột thanaka lên má cho mát da trước khi ra đường.',
      'a|Ngồi quán trà bên đường, uống trà sữa và ăn bánh samosa.'
    ],
    NP: [
      'H|Lễ Dashain, người lớn chấm tika đỏ lên trán con cháu, trẻ con chơi đu tre khắp làng.+',
      'H|Lễ Tihar, thắp đèn và đeo vòng hoa cho cả chó, quạ, bò.+',
      '*|Bữa nào cũng là dal bhat, cơm và súp đậu, người Nepal hay nói "dal bhat power, 24 hour".',
      'r|Mùa mưa, sạt lở đất chặn đường lên núi mấy ngày liền.-'
    ],
    LK: [
      '*|Tết Sinhala và Tamil tháng Tư, đốt lò nấu sữa kiribath đúng giờ lành.+',
      'B|Lễ Vesak, đèn lồng giấy treo khắp phố, nhiều nơi phát cơm miễn phí (dansal).+',
      '*|Cả nước xem cricket, quán nào cũng mở đài tường thuật.'
    ],
    AF: [
      'n|Mùa thả diều, trẻ con lên mái nhà thi cắt dây diều của nhau.+',
      '*|Tết Nowruz, ăn món haft mewa bảy loại trái cây khô ngâm nước.+',
      'a|Ngồi quán uống trà xanh với kẹo, nghe người già kể chuyện xưa.',
      'a|Xem trận buzkashi, các kỵ sĩ tranh nhau xác con dê trên lưng ngựa.'
    ],
    IQ: [
      'a|Mùa hè nóng 50 độ, điện lưới cắt liên tục, cả nhà mua "ampe" từ máy phát của khu phố.-',
      'a|Cuối tuần ra bờ sông ăn cá chép nướng masgouf.+',
      'a|Ngồi quán cà phê chơi cờ domino, uống trà đặc trong ly nhỏ.'
    ],
    MA: [
      'a|Mặc cả ở khu chợ souk, chủ hàng mời uống trà bạc hà ngọt trước khi bàn giá.',
      'f|Thứ Sáu cả nhà ăn couscous, mâm lớn đặt giữa nhà.+',
      'a|Đi nhà tắm công cộng hammam, kỳ cọ bằng găng tay thô và xà phòng đen.'
    ],
    DZ: ['a|Ăn bánh mì tròn kesra với dầu ô liu, uống cà phê sữa buổi sáng.', '*|Trận đấu của đội tuyển "Những con cáo sa mạc", phố phường rộn tiếng còi.+'],
    SD: ['a|Ghé quán trà của "bà bán trà" ven đường, uống trà đường đặc với gừng.', '*|Mùa bão cát haboob, bầu trời chuyển màu cam, cả phố đóng kín cửa.-'],
    UA: ['f|Mùa hè về quê ông bà, hái anh đào trong vườn.+', '*|Ăn súp borscht đỏ với kem chua và bánh mì đen.', 'a|Còi báo động không kích vang lên, mọi người xuống hầm trú ẩn.-'],
    PL: ['f|Đêm Wigilia đêm Giáng sinh, cả nhà chờ ngôi sao đầu tiên mới được ngồi vào bàn tiệc 12 món.+', 'a|Ăn bánh pierogi nhân khoai tây và pho mát.', '*|Mùa đông dài, trời tối từ bốn giờ chiều.'],
    NL: ['a|Đạp xe đi làm giữa trời mưa, cả thành phố có nhiều xe đạp hơn người.', '*|Ngày Nhà vua 27/4, cả nước mặc đồ cam, đường phố biến thành chợ đồ cũ.+'],
    SE: ['a|Giờ "fika" buổi chiều, cả văn phòng nghỉ uống cà phê ăn bánh quế.+', '*|Lễ Midsommar, nhảy quanh cây cột hoa và ăn cá trích muối.+'],
    NO: ['*|Đường trượt tuyết việt dã ngay rìa thành phố, cuối tuần ai cũng ra trượt.+', 'a|Mùa đông gần như không thấy mặt trời, ra đường lúc nào trời cũng tối.-'],
    FI: ['a|Tắm sauna rồi lăn ra tuyết, gần như nhà nào cũng có phòng xông hơi.', '*|Mùa hè mặt trời gần như không lặn, mười giờ đêm trời vẫn sáng.+'],
    GR: ['f|Lễ Phục sinh Chính Thống, nướng nguyên con cừu, chơi đập trứng đỏ.+', '*|Mùa hè cháy rừng, đài liên tục báo khu vực phải sơ tán.-'],
    PT: ['a|Ăn bánh pastel de nata còn nóng với tách bica.+', '*|Lễ thánh Anthony tháng Sáu, phố cổ nướng cá mòi thơm lừng.+'],
    IE: ['a|Tối đi pub nghe nhạc truyền thống, đàn fiddle và trống bodhrán.+', '*|Ngày Thánh Patrick, cả thành phố mặc đồ xanh lá xem diễu hành.+'],
    CH: ['a|Tàu chạy đúng giờ đến từng phút, trễ hai phút cũng có loa xin lỗi.', 'f|Ăn lẩu pho mát fondue trong buổi tối mùa đông.+'],
    IL: ['J|Chiều thứ Sáu, đường phố lặng dần đón ngày Sabát, cửa hàng đóng cửa.', 'a|Ăn bánh mì pita nhồi falafel và sốt tahini.'],
    KZ: ['f|Nauryz tháng Ba, nấu súp nauryz kozhe bảy nguyên liệu.+', '*|Mùa đông thảo nguyên gió buốt âm 30 độ.-'],
    UZ: ['f|Nấu nồi cơm plov lớn cho cả họ, đàn ông đứng bếp.+', 'a|Đi chợ Chorsu mua bánh mì non tròn còn nóng.'],
    MN: ['*|Lễ hội Naadam: đấu vật, đua ngựa, bắn cung.+', 'f|Tết Tsagaan Sar, ăn bánh hấp buuz cả trăm chiếc.+'],
    CU: ['a|Xe hơi cổ những năm 1950 vẫn chạy khắp phố, sơn lại màu rực rỡ.', 'a|Mua hàng phải xếp hàng dài, ai cũng hỏi "người cuối cùng là ai?" để giữ chỗ.'],
    VE: ['a|Ăn arepa nhồi thịt bò xé cho bữa sáng.', 'a|Đi chợ trả bằng đô la Mỹ, tiền lẻ thối lại bằng đồng bolívar.'],
    CL: ['*|Fiestas Patrias 18/9, ăn bánh empanada ở các lều fonda, nhảy điệu cueca.+', '*|Động đất nhẹ lắc nhà, người lớn vẫn bình thản ngồi uống trà.'],
    _eu: [
      'a|Mùa hè đi nghỉ ven biển hai tuần, kỳ nghỉ được tính từ đầu năm.+',
      '*|Euro hay World Cup, cả quảng trường dựng màn hình lớn xem chung.+',
      'a|Đi chợ phiên cuối tuần ở quảng trường trung tâm, mua bánh mì, pho mát và rau củ.',
      '*|Mùa đông ngày ngắn, bốn giờ chiều trời đã tối.',
      'a|Tàu liên vùng trễ chuyến, cả toa thở dài khi loa thông báo.-'
    ],
    _me: [
      'a|Tối đến quán cà phê đông người, ngồi uống trà và chơi cờ đến khuya.',
      '*|Mùa hè nóng trên 45 độ, ban ngày phố vắng, tối mới đông người ra đường.',
      'a|Mặc cả ở khu chợ cổ, người bán mời uống trà trước khi nói chuyện giá.',
      'f|Đám cưới lớn mời cả trăm khách, nhạc và múa đến gần sáng.+'
    ],
    _af: [
      'ac|Xe khách nhỏ chở quá tải, hành lý buộc chồng chất trên nóc xe.',
      'a|Trả tiền chợ và gửi tiền cho người thân bằng ví tiền điện thoại.',
      '*|Đội tuyển quốc gia đá cúp châu Phi, cả xóm tụ quanh một chiếc tivi.+',
      'r|Mùa mưa đến, cả làng ra đồng gieo hạt.',
      '*|Điện lưới chập chờn, cả xóm ngồi nói chuyện dưới trời sao khi mất điện.-',
      'a|Ngày chợ phiên, người các làng quanh vùng kéo về mua bán từ sáng sớm.'
    ],
    _sa: [
      '*|Trận cricket của đội tuyển quốc gia, cả khu phố tụ quanh một chiếc tivi.',
      'a|Chén trà sữa gia vị ở quán ven đường là cuộc hẹn quen thuộc mỗi chiều.',
      '*|Mùa mưa về, đường phố ngập nhưng ai cũng mừng vì hết nắng nóng.'
    ],
    _ea: ['a|Cửa hàng tiện lợi mở 24 giờ ở mọi góc phố, bữa khuya chỉ cách vài bước chân.', '*|Mùa thu lá đỏ, cả công viên kín người chụp ảnh.+'],
    _se: ['*|Mưa nhiệt đới đổ ào ào rồi tạnh, nắng lại gay gắt như chưa có gì.', 'a|Bữa tối ở khu chợ đêm, quầy ăn nào cũng bốc khói thơm lừng.+'],
    _ca: ['f|Tết Nowruz đầu xuân, cả họ nấu món ăn truyền thống, đi thăm nhau.+', 'a|Ăn bánh mì tròn nướng lò đất, trà xanh rót không bao giờ đầy ly.'],
    _la: [
      'f|Tối nào cũng có telenovela, cả nhà vừa xem vừa bàn tán.',
      '*|Trận bóng đá của đội tuyển, đường phố vắng tanh rồi vỡ òa tiếng còi xe.+',
      'a|Sáng Chủ nhật đi chợ phiên, mua trái cây nhiệt đới và uống nước ép tươi.+',
      'a|Lễ hội của thị trấn có nhạc sống, múa và pháo hoa đến khuya.+'
    ],
    _na: ['a|Mùa lễ cuối năm, khu phố treo đèn trang trí sáng rực.+'],
    _oc: ['*|Mùa hè ra biển bơi và lướt sóng.+', 'a|Cả cộng đồng tổ chức tiệc nướng lớn, mỗi nhà mang một món góp.+'],
    _all: [
      'H|Đêm Diwali, đèn dầu diya thắp kín bậu cửa, pháo hoa nổ đến khuya, ai cũng đi chúc nhau và tặng bánh kẹo.+',
      'H|Lễ Holi, cả xóm tung bột màu và té nước vào nhau, ai về nhà cũng lem luốc từ đầu đến chân.+',
      'H|Chín đêm Navratri, đi múa garba vòng tròn quanh sân đền.+',
      'Hb|Ngày Raksha Bandhan, chị em gái buộc sợi chỉ rakhi lên cổ tay anh em trai, anh em trai hứa luôn che chở.',
      'H|Lễ Ganesh Chaturthi, rước tượng thần đầu voi ra sông trong tiếng trống rộn ràng.+',
      'S|Lễ Vaisakhi, đến đền gurdwara dự bữa cơm langar miễn phí, ai ngồi cũng được phục vụ như nhau.+',
      'S|Ngày sinh Guru Nanak, đền gurdwara thắp đèn sáng rực, tụng kinh suốt đêm.+',
      'J|Đêm Hanukkah, thắp thêm một ngọn nến trên giá nến tám nhánh, ăn bánh khoai tây chiên latke.+',
      'J|Bữa tối Seder Lễ Vượt Qua, đọc sách Haggadah, ăn bánh không men matzah.',
      'J|Ngày Yom Kippur, nhịn ăn cả ngày, đường phố yên ắng lạ thường.',
      'B|Lễ Phật đản (Vesak), đến chùa thắp nến, thả đèn và làm việc thiện.+',
      'B|Ngày rằm, đến chùa nghe giảng pháp và thiền buổi tối.'
    ]
  };
  var TAG = /^([*1nkhuayiwpoecrfbMCHBSJ]+)\|/;
  function fits(l, tags) {
    var a = l.age, s = l.school || '', R = rel(l);
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (t === '*' && a < 6) return false;
      if (t === 'n' && (a < 6 || a > 12)) return false;
      if (t === '1' && (a < 6 || a > 7)) return false;
      if (t === 'b' && !(l.sibList || []).some(function (x) { return x.alive; })) return false;
      if (t === 'k' && !(/^(primary|lower|upper|priv)$/.test(s) && a <= 18)) return false;
      if (t === 'h' && s !== 'upper') return false;
      if (t === 'u' && !/^(uni|post|phd)$/.test(s)) return false;
      if (t === 'a' && a < 18) return false;
      if (t === 'y' && (a < 18 || a > 35)) return false;
      if (t === 'i' && !l.indep) return false;
      if (t === 'w' && !working(l)) return false;
      if (t === 'p' && !kids(l, 4, 17).length) return false;
      if (t === 'o' && a < 60) return false;
      if (t === 'e' && a < 65) return false;
      if (t === 'c' && !l.urban) return false;
      if (t === 'r' && l.urban) return false;
      if (t === 'f' && !family(l)) return false;
      if (t === 'M' && R !== 'hoi') return false;
      if (t === 'C' && R !== 'cg' && R !== 'tl') return false;
      if (t === 'H' && R !== 'hin') return false;
      if (t === 'B' && R !== 'pg') return false;
      if (t === 'S' && R !== 'sik') return false;
      if (t === 'J' && R !== 'dt') return false;
    }
    return a >= 6;
  }
  function parse(id, raw) { var m = raw.match(TAG), tags = m ? m[1] : '*', body = m ? raw.slice(m[0].length) : raw, tone = 'neutral';
    if (/\+$/.test(body)) { tone = 'good'; body = body.slice(0, -1); } else if (/-$/.test(body)) { tone = 'bad'; body = body.slice(0, -1); }
    return { id: id, tags: tags, t: body, tone: tone }; }
  var BANK = {}; Object.keys(LINES).forEach(function (k) { BANK[k] = LINES[k].map(function (x, i) { return parse(k + ':' + i, x); }); });
  E.WORLD_LINES = BANK;
  function seen(l) { return l.flags.qgSeen || (l.flags.qgSeen = {}); }
  function pool(l) {
    if (!world(l) || !free(l)) return { own: [], reg: [] };
    var c = here(l), S = seen(l), ok = function (x) { return S[x.id] == null && fits(l, x.tags); };
    var reg = REGION[c] ? (BANK['_' + REGION[c]] || []) : [];
    // người theo đạo Phật ở nước khác: không dùng phong tục riêng của Việt Nam (đã có ở module lễ hội)
    return { own: (BANK[c] || []).filter(ok), reg: reg.concat(BANK._all).filter(ok) };
  }
  E.worldLinePool = pool;
  function tellLine(l, r, log, a) {
    var p = pool(l); if (!p.own.length && !p.reg.length) return;
    if (r() >= (p.own.length ? 0.45 : 0.2)) return;
    var list = p.own.length && (!p.reg.length || r() < 0.8) ? p.own : p.reg, x = U.pick(r, list); seen(l)[x.id] = a; l.flags.qgLineAt = a;
    log(x.t, x.tone); if (x.tone === 'good') fx(l, { hap: 1 }); else if (x.tone === 'bad') fx(l, { hap: -1 });
  }

  // ===================================================================
  // 3. TÌNH HUỐNG LỰA CHỌN THEO QUỐC GIA
  // ===================================================================
  function once(l, id, gap) { var F = l.flags.qgAt || (l.flags.qgAt = {}); return F[id] == null || (gap && l.age - F[id] >= gap); }
  function mark(l, id) { (l.flags.qgAt || (l.flags.qgAt = {}))[id] = l.age; }
  // Không thêm vào E.TRIG / E.EVENTS: hai danh sách này được xáo trộn bằng số ngẫu nhiên cho mọi đời, thêm phần tử sẽ làm đời ở Việt Nam diễn ra khác đi.
  // Mọi thứ của module chạy trong một hook riêng, thoát ngay (không dùng số ngẫu nhiên nào) với đời ở Việt Nam.
  var TR = [];
  function trig(id, when, p, cd, max) { TR.push({ id: id, when: when, p: p, cd: cd || 3, max: max || 99 }); }
  function pick(map, l) { return map[here(l)]; }

  // 3.1 Kỳ thi đại học
  var EXAM = {
    CN: ['kỳ thi gaokao', 'Ngày 7 tháng 6, cả nước dõi theo kỳ thi gaokao. Cổng trường có cảnh sát giữ trật tự, phụ huynh mặc sườn xám đỏ đứng chờ cầu may.'],
    KR: ['kỳ thi Suneung', 'Ngày thi Suneung, công sở vào làm muộn một tiếng để thí sinh không kẹt xe, máy bay tạm ngừng cất cánh trong giờ thi nghe tiếng Anh.'],
    JP: ['kỳ thi chung (Kyōtsū test)', 'Giữa tháng Giêng là kỳ thi chung xét tuyển đại học, tuyết rơi dày, ai cũng lo chuyến tàu đến điểm thi bị chậm.'],
    IN: ['kỳ thi JEE / NEET', 'Kỳ thi JEE vào trường kỹ thuật và NEET vào trường y đến gần, hàng triệu thí sinh cạnh tranh từng điểm.'],
    TR: ['kỳ thi YKS', 'Kỳ thi YKS vào đại học tháng Sáu, điểm số quyết định ngành và trường cho cả tương lai.'],
    IR: ['kỳ thi Konkur', 'Kỳ thi Konkur vào đại học đến gần, cả nhà tắt tivi để bạn ôn bài.'],
    BR: ['kỳ thi ENEM', 'Hai Chủ nhật tháng Mười Một là kỳ thi ENEM, cổng trường đóng đúng giờ, ai đến muộn một phút cũng bị ở ngoài.'],
    EG: ['kỳ thi Thanaweya Amma', 'Kỳ thi Thanaweya Amma quyết định vào đại học, điểm từng phần trăm đều có ý nghĩa.'],
    NG: ['kỳ thi JAMB UTME', 'Kỳ thi JAMB UTME làm trên máy tính ở trung tâm khảo thí, phải đến từ sáng sớm xếp hàng kiểm tra vân tay.'],
    KE: ['kỳ thi KCSE', 'Kỳ thi KCSE cuối cấp tháng Mười Một, đề thi được áp tải dưới sự giám sát chặt chẽ.'],
    ID: ['kỳ thi UTBK-SNBT', 'Kỳ thi UTBK xét tuyển đại học công lập đến gần, ngày nào cũng làm đề thử trên mạng.'],
    TW: ['kỳ thi xét tuyển học lực', 'Tháng Giêng là kỳ thi xét tuyển học lực đại học, ai cũng ôn đến tận đêm trước.'],
    TH: ['kỳ thi TCAS', 'Kỳ thi TGAT, A-Level trong hệ thống TCAS vào đại học đến gần, bạn bè rủ nhau đi chùa cầu may.'],
    PK: ['kỳ thi đầu vào đại học', 'Kỳ thi đầu vào MDCAT, ECAT cho trường y và kỹ thuật đến gần, lớp luyện thi chật kín.'],
    BD: ['kỳ thi HSC và xét tuyển đại học', 'Sau kỳ thi HSC là các kỳ thi tuyển vào đại học công lập, mỗi chỗ có hàng chục người tranh.']
  };
  SC('qg_thi_dh', {
    title: function (l) { var x = pick(EXAM, l); return 'Ngày ' + (x ? x[0] : 'thi đại học'); },
    valid: function (l) { return world(l) && !!pick(EXAM, l) && l.school === 'upper'; },
    text: function (l) { return pick(EXAM, l)[1] + ' Còn ít tuần nữa là đến ngày thi.'; },
    opts: [
      { k: 'on', l: 'Ôn cấp tốc mỗi ngày đến khuya', h: 'Kiến thức tăng, căng thẳng tăng', ai: { amb: 1.2 }, run: function (l, r, log) { mark(l, 'qg_thi_dh'); fx(l, { kno: 3, hea: -1 }); stress(l, 6); log('Những tuần cuối ôn đến khuya, đề nào cũng làm lại hai lần. Bước vào phòng thi, bạn thấy mình đã chuẩn bị hết sức.', 'neutral'); } },
      { k: 'deu', l: 'Học đều, ngủ đủ, giữ sức', h: 'Ít căng thẳng', ai: { smart: 1.2, w: 1.1 }, run: function (l, r, log) { mark(l, 'qg_thi_dh'); fx(l, { kno: 2, hea: 1 }); stress(l, -2); log('Bạn giữ lịch học đều đặn và ngủ đủ giấc. Sáng ngày thi tỉnh táo, làm bài bình tĩnh.', 'good'); } },
      { k: 'buong', l: 'Mặc kệ, đến đâu hay đến đó', h: 'Không áp lực, kiến thức không tăng', ai: { w: 0.3 }, run: function (l, r, log) { mark(l, 'qg_thi_dh'); fx(l, { hap: 1 }); log('Bạn không ôn thêm gì. Ra khỏi phòng thi, nhiều câu chỉ đoán bừa.', 'neutral'); } }
    ]
  });
  trig('qg_thi_dh', function (l, a) { return !!pick(EXAM, l) && l.school === 'upper' && a >= 16 && once(l, 'qg_thi_dh'); }, 0.6, 1, 1);

  // 3.2 Về quê dịp lễ
  function homeFest(l) {
    var c = here(l), R = rel(l);
    if (c === 'CN' || c === 'TW') return ['Tết Nguyên đán', c === 'CN' ? 'Mùa "xuân vận": hàng trăm triệu lượt người về quê ăn Tết. Vé tàu trên ứng dụng 12306 hết sạch sau vài phút mở bán.' : 'Tết Nguyên đán đến, vé tàu cao tốc về quê mở bán là hết sạch.'];
    if (c === 'KR') return ['Chuseok', 'Chuseok đến, đường cao tốc về quê kẹt hàng chục cây số, chuyến đi bốn tiếng có thể thành mười tiếng.'];
    if (c === 'JP') return ['Obon', 'Kỳ nghỉ Obon, tàu Shinkansen về quê kín chỗ, đường cao tốc tắc dài.'];
    if (R === 'hoi' && /^(ID|MY)$/.test(c)) return ['Lebaran', 'Trước Lebaran là mùa "mudik": hàng triệu người rời thành phố về quê, xe buýt, phà, đường cao tốc đều quá tải.'];
    if (R === 'hoi' && /^(BD|PK|EG|TR|NG|DZ|MA|IQ|IR|AF|SN|ML|NE)$/.test(c)) return ['dịp Eid', 'Dịp Eid đến gần, bến xe, nhà ga đông nghẹt người về quê, giá vé tăng gấp đôi.'];
    if (R === 'hin' && /^(IN|NP)$/.test(c)) return [c === 'NP' ? 'lễ Dashain' : 'Diwali', 'Mùa lễ hội, tàu về quê chật kín, người ngồi cả trên bậc cửa toa.'];
    if ((R === 'cg' || R === 'tl') && /^(NG|GH|KE|UG|PH|MX|PL|ET|CM|CD|BR)$/.test(c)) return ['Giáng sinh', 'Giáng sinh đến, nhiều người rời thành phố về quê đoàn tụ, xe khách đường dài kín chỗ.'];
    if (c === 'TH') return ['Songkran', 'Dịp Songkran, Bangkok vắng hẳn, ai cũng về quê thăm ông bà, xe khách đi các tỉnh kín chỗ.'];
    return null;
  }
  SC('qg_ve_que', {
    title: function (l) { var x = homeFest(l); return 'Về quê ' + (x ? x[0] : 'dịp lễ'); },
    valid: function (l) { return world(l) && !!homeFest(l) && parents(l) && !!(l.movedTo || l.cityStudent) && l.age >= 18; },
    text: function (l) { var x = homeFest(l); return x[1] + ' ' + (l.fam.mAlive && l.fam.fAlive ? 'Bố mẹ' : l.fam.mAlive ? 'Mẹ' : 'Bố') + ' gọi điện hỏi năm nay bạn có về không.'; },
    opts: [
      { k: 've', l: 'Chen chúc về quê đoàn tụ', h: function (l) { return 'Tiền vé, quà biếu khoảng ' + H.money(l, cost(l, 0.025)); }, req: function (l) { return canPay(l, 0.025); }, ai: { soc: 1.2, w: 1.3 }, run: function (l, r, log) { mark(l, 'qg_ve_que'); pay(l, 0.025, 'Về quê dịp lễ'); fx(l, { hap: 6, soc: 2 }); stress(l, -3); log(U.pick(r, ["Đường về đông nghẹt, mệt rã rời, nhưng bữa cơm đầu tiên ở nhà làm bạn quên hết.","Chuyến đi dài cả ngày, đến nhà khi trời đã tối, bố mẹ vẫn đợi cơm.","Về quê năm nay, thấy bố mẹ già đi nhiều, bạn ở lại thêm mấy ngày.","Đứng suốt chặng đường, nhưng đến cổng nhà nghe tiếng gọi tên mình là thấy đáng."]), 'good'); H.mem(l, 'Chuyến về quê đông nghẹt người năm ' + l.age + ' tuổi.', 2); } },
      { k: 'video', l: 'Ở lại, gọi video chúc lễ', h: 'Tiết kiệm tiền, hơi buồn', ai: { w: 0.7 }, run: function (l, r, log) { mark(l, 'qg_ve_que'); fx(l, { hap: -2 }); log(U.pick(r, ["Bạn ở lại thành phố, gọi video về nhà. Màn hình nhỏ, tiếng cười ở nhà vẫn vang qua loa điện thoại.","Năm nay không về được, bạn gửi quà về nhà và gọi điện chúc lễ.","Bạn ở lại làm việc, tối gọi video thấy cả nhà quây quần mà chạnh lòng."]), 'neutral'); } },
      { k: 'don', l: 'Đón bố mẹ lên chơi thay vì về quê', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.02)); }, req: function (l) { return canPay(l, 0.02); }, ai: { w: 0.5 }, run: function (l, r, log) { mark(l, 'qg_ve_que'); pay(l, 0.02, 'Đón bố mẹ lên chơi'); fx(l, { hap: 4, soc: 1 }); log('Bạn đón bố mẹ lên thành phố, dẫn đi chơi những nơi họ chưa từng đến.', 'good'); } }
    ]
  });
  trig('qg_ve_que', function (l, a) { return !!homeFest(l) && parents(l) && !!(l.movedTo || l.cityStudent) && a >= 18 && once(l, 'qg_ve_que', 4); }, 0.25, 4);

  // 3.3 Mất điện kéo dài
  var GRID = {
    NG: 'Điện lưới quốc gia chập chờn, có tuần chỉ có điện vài tiếng mỗi ngày.', GH: 'Lại đến mùa "dumsor" — cắt điện luân phiên kéo dài.',
    ZA: 'Lịch cắt điện luân phiên theo cấp độ, có ngày mất điện đến tám tiếng.', PK: 'Mùa hè cắt điện luân phiên nhiều giờ mỗi ngày.',
    IQ: 'Mùa hè nóng 50 độ mà điện lưới chỉ có vài tiếng một ngày.', LB: 'Điện nhà nước chỉ có vài giờ mỗi ngày, còn lại phải mua điện từ máy phát của khu phố.',
    BD: 'Đợt nắng nóng, cắt điện luân phiên nhiều lần trong ngày.', ZM: 'Hạn hán làm hồ thủy điện cạn, cả nước cắt điện luân phiên nhiều giờ.',
    ZW: 'Cắt điện luân phiên kéo dài, có khi chỉ có điện vào ban đêm.', CD: 'Điện lưới mất liên tục, cả khu có lúc mất điện mấy ngày.',
    VE: 'Mất điện diện rộng xảy ra thường xuyên, tủ lạnh, máy bơm nước đều đứng.', YE: 'Điện lưới gần như không còn, cả khu phải tự lo nguồn điện.',
    SD: 'Điện lưới chập chờn, có ngày mất điện từ sáng đến tối.', SY: 'Điện nhà nước chỉ có vài giờ mỗi ngày.', NP: 'Mùa khô, thủy điện thiếu nước, có lúc phải cắt điện luân phiên.'
  };
  SC('qg_mat_dien', {
    title: 'Mất điện triền miên',
    valid: function (l) { return world(l) && !!pick(GRID, l) && l.indep && !l.flags.qgPower; },
    text: function (l) { return pick(GRID, l) + ' Đồ ăn trong tủ lạnh hỏng, điện thoại không có chỗ sạc, công việc bị gián đoạn.'; },
    opts: [
      { k: 'may', l: 'Mua máy phát điện chạy xăng', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.05)) + ', tốn tiền xăng, ồn'; }, req: function (l) { return canPay(l, 0.05); }, ai: { w: 1 }, run: function (l, r, log) { mark(l, 'qg_mat_dien'); l.flags.qgPower = 'gen'; pay(l, 0.05, 'Mua máy phát điện'); fx(l, { hap: 2 }); log('Mua máy phát điện. Mất điện là giật dây nổ máy, ồn ào nhưng có điện thắp sáng và sạc điện thoại.', 'neutral'); } },
      { k: 'solar', l: 'Lắp tấm pin mặt trời và bình tích điện', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.1)) + ', về lâu dài đỡ tốn'; }, req: function (l) { return canPay(l, 0.1); }, ai: { smart: 1.3, w: 0.8 }, run: function (l, r, log) { mark(l, 'qg_mat_dien'); l.flags.qgPower = 'solar'; pay(l, 0.1, 'Lắp điện mặt trời'); fx(l, { hap: 4 }); stress(l, -3); log('Lắp tấm pin mặt trời trên mái và bình tích điện. Cả khu mất điện, nhà bạn vẫn sáng đèn, hàng xóm sang nhờ sạc điện thoại.', 'good'); } },
      { k: 'chiu', l: 'Chịu đựng, dùng đèn sạc và pin dự phòng', h: 'Không tốn nhiều', ai: { w: 0.8 }, run: function (l, r, log) { mark(l, 'qg_mat_dien'); fx(l, { hap: -3 }); stress(l, 3); log('Bạn sắm thêm đèn sạc và cục pin dự phòng, quen dần với những tối ngồi quạt tay.', 'neutral'); } }
    ]
  });
  trig('qg_mat_dien', function (l, a) { return !!pick(GRID, l) && l.indep && a >= 20 && !l.flags.qgPower && once(l, 'qg_mat_dien', 6); }, 0.18, 6);

  // 3.4 Hụi / họ — nhóm góp tiền xoay vòng
  var HUI = { NG: 'ajo (esusu)', GH: 'susu', KE: 'chama', ET: 'equb', SO: 'hagbad', EG: 'gam\'eya', MX: 'tanda', PE: 'pandero', PK: '"committee"', KR: 'gye', PH: 'paluwagan', ZA: 'stokvel', CM: 'njangi', CI: 'tontine', SN: 'tontine', ML: 'tontine', BF: 'tontine', HT: 'sòl', ID: 'arisan', DO: 'san', TZ: 'VICOBA', SD: 'sanduq' };
  SC('qg_hui', {
    title: function (l) { return 'Góp ' + (pick(HUI, l) || 'hụi'); },
    valid: function (l) { return world(l) && !!pick(HUI, l) && l.indep && l.age >= 20 && !l.flags.qgHui; },
    text: function (l) { return 'Mấy người quen rủ bạn vào nhóm ' + pick(HUI, l) + ': mỗi tháng mọi người góp một khoản như nhau, mỗi kỳ một người nhận cả phần góp. Không lãi suất, không giấy tờ, tất cả dựa vào chữ tín.'; },
    opts: [
      { k: 'vao', l: 'Tham gia, góp đều mỗi tháng', h: 'Có một khoản lớn để dùng việc lớn, phụ thuộc chữ tín', req: function (l) { return l.money > cost(l, 0.05); }, ai: { soc: 1.1, w: 1 }, run: function (l, r, log) { mark(l, 'qg_hui'); l.flags.qgHui = true; var x = r();
        if (x < 0.06) { pay(l, 0.05, 'Mất tiền góp ' + pick(HUI, l)); fx(l, { hap: -6 }); stress(l, 5); log('Đến lượt bạn nhận thì người cầm tiền bỏ trốn. Cả nhóm mất trắng, bạn mất gần cả năm tiền góp.', 'bad'); }
        else if (x < 0.18) { pay(l, 0.008, 'Bù tiền góp ' + pick(HUI, l)); fx(l, { soc: 1 }); log('Một thành viên chậm góp mấy kỳ, cả nhóm phải bù cho đủ. Cuối cùng bạn vẫn nhận đủ phần của mình.', 'neutral'); }
        else { fx(l, { hap: 4, soc: 3 }); log(U.pick(r, ["Đến lượt bạn nhận khoản góp của cả nhóm, đủ để sửa lại mái nhà và sắm đồ đạc. Ai cũng góp đúng hạn.","Nhận phần góp của cả nhóm đúng lúc cần đóng học phí cho người nhà, ai cũng giữ chữ tín.","Đến kỳ của bạn, khoản tiền góp đủ mua một chiếc xe máy cũ để đi làm."]), 'good'); } } },
      { k: 'khong', l: 'Từ chối, tự gửi tiết kiệm', ai: { smart: 1, w: 0.8 }, run: function (l, r, log) { mark(l, 'qg_hui'); log('Bạn cảm ơn và từ chối, tự mở tài khoản tiết kiệm riêng.', 'neutral'); } }
    ]
  });
  trig('qg_hui', function (l, a) { return !!pick(HUI, l) && l.indep && a >= 20 && a <= 65 && !l.flags.qgHui; }, 0.08, 8, 1);

  // 3.5 Tiệc công ty sau giờ làm
  var PARTY = {
    JP: ['Tiệc nomikai', 'Trưởng phòng rủ cả nhóm đi nomikai sau giờ làm ở quán izakaya. Ở đây, tiệc rượu là nơi nói chuyện công việc thẳng thắn hơn trong văn phòng.'],
    KR: ['Buổi hoesik', 'Cả phòng đi hoesik sau giờ làm: thịt nướng, soju, rồi "tăng hai" ở quán karaoke noraebang.'],
    CN: ['Tiệc rượu tiếp khách', 'Công ty tiếp đối tác quan trọng, sếp muốn bạn đi cùng. Ở bàn tiệc, nâng ly "cạn chén" là chuyện thường.']
  };
  SC('qg_tiec_cty', {
    title: function (l) { return pick(PARTY, l)[0]; },
    valid: function (l) { return world(l) && !!pick(PARTY, l) && working(l) && H.isEmployee(l) && (!E.hasBoss || E.hasBoss(l)); },
    text: function (l) { return pick(PARTY, l)[1]; },
    opts: [
      { k: 'het', l: 'Đi đến tăng cuối', h: 'Quan hệ tốt hơn, mệt, tốn tiền', ai: { soc: 1.3, w: 0.8 }, run: function (l, r, log) { pay(l, 0.004, 'Tiệc sau giờ làm'); fx(l, { soc: 4, hea: -2 }); if (l.job) l.job.rep = U.clamp((l.job.rep || 50) + 3, 0, 100); log('Bạn ở lại đến tận khuya. Sáng hôm sau đau đầu, nhưng đồng nghiệp gần gũi hơn hẳn.', 'neutral'); } },
      { k: 'som', l: 'Đi một lúc rồi xin phép về sớm', h: 'Cân bằng', ai: { smart: 1.2, w: 1.2 }, run: function (l, r, log) { pay(l, 0.002, 'Tiệc sau giờ làm'); fx(l, { soc: 2 }); log(U.pick(r, ["Bạn ngồi chung một lúc, nâng ly cảm ơn mọi người rồi xin về sớm. Không ai phật ý.","Bạn dự đến hết tăng một, nói chuyện vui vẻ rồi xin phép về."]), 'good'); } },
      { k: 'khong', l: 'Từ chối khéo vì có việc riêng', h: 'Giữ sức, có thể bị xem là xa cách', ai: { w: 0.6 }, run: function (l, r, log) { fx(l, { hap: 1, soc: -1 }); if (l.job) l.job.rep = U.clamp((l.job.rep || 50) - 1, 0, 100); log('Bạn từ chối khéo. Hôm sau nghe kể buổi tiệc vui, thấy mình hơi lạc lõng.', 'neutral'); } }
    ]
  });
  trig('qg_tiec_cty', function (l, a) { return !!pick(PARTY, l) && working(l) && H.isEmployee(l) && (!E.hasBoss || E.hasBoss(l)) && a <= 60; }, 0.1, 4);

  // 3.6 Thiên tai đặc trưng
  var HAZ = {
    JP: ['động đất', 'Điện thoại rú lên cảnh báo động đất khẩn cấp, cơ quan khí tượng nhắc nguy cơ có dư chấn mạnh trong tuần.'],
    PH: ['bão', 'Cơ quan khí tượng PAGASA nâng tín hiệu bão lên cấp cao, siêu bão sắp đổ bộ.'], BD: ['bão xoáy', 'Bão xoáy từ vịnh Bengal đang tiến vào, đài phát tín hiệu nguy hiểm cấp cao.'],
    IN: ['lũ mùa mưa', 'Mưa gió mùa kéo dài, sông dâng cao, chính quyền cảnh báo lũ lớn.'], PK: ['lũ mùa mưa', 'Mưa gió mùa dữ dội, nhiều vùng trũng được yêu cầu sơ tán.'],
    CN: ['lũ', 'Mưa lớn nhiều ngày, hồ chứa xả lũ, khu bạn ở nằm trong vùng cảnh báo.'], ID: ['động đất', 'Động đất mạnh vừa xảy ra ngoài khơi, cảnh báo sóng thần được phát.'],
    TR: ['động đất', 'Một trận động đất làm rung chuyển cả thành phố, cơ quan cứu hộ cảnh báo dư chấn.'], MX: ['động đất', 'Còi báo động động đất vang khắp thành phố, các tòa nhà cũ bị kiểm tra.'],
    CL: ['động đất', 'Động đất mạnh, chính quyền yêu cầu người dân ven biển lên vùng cao.'], NP: ['sạt lở đất', 'Mưa lớn gây sạt lở, đường lên làng bị chặn, nguy cơ sạt tiếp.'],
    US: ['bão lớn', 'Cơ quan khí tượng cảnh báo một cơn bão lớn sắp đổ bộ, siêu thị hết sạch nước đóng chai.'], AU: ['cháy rừng', 'Cháy rừng lan nhanh trong gió nóng, ứng dụng cảnh báo yêu cầu chuẩn bị rời đi.'],
    CA: ['cháy rừng', 'Cháy rừng đang tiến gần thị trấn, lệnh chuẩn bị sơ tán được phát ra.'], GR: ['cháy rừng', 'Cháy rừng mùa hè lan đến gần khu dân cư, tin nhắn khẩn yêu cầu sơ tán.'],
    MZ: ['bão xoáy', 'Bão xoáy từ Ấn Độ Dương đang tiến vào bờ biển.'], MG: ['bão xoáy', 'Bão xoáy nhiệt đới sắp đổ bộ, mưa lớn và gió giật mạnh.'],
    HT: ['bão', 'Bão nhiệt đới đang hướng về đảo, nhiều khu dân cư được khuyên đến nơi trú ẩn.'], CU: ['bão', 'Bão lớn sắp đổ bộ, chính quyền tổ chức sơ tán vùng ven biển.'],
    TW: ['bão', 'Bão mạnh sắp đổ bộ, chính quyền thông báo nghỉ làm nghỉ học.'], NZ: ['động đất', 'Động đất làm rung chuyển cả thành phố, cảnh báo dư chấn trong nhiều ngày.'],
    IT: ['động đất', 'Động đất ở miền trung, nhiều nhà cũ bị nứt tường, chính quyền kiểm tra từng khu.'], KR: ['mưa lũ', 'Mùa mưa jangma, mưa lớn gây ngập các tuyến đường hầm và nhà bán hầm.'],
    MM: ['lũ', 'Mưa lớn kéo dài, sông dâng cao, làng ven sông được yêu cầu sơ tán.'], ET: ['hạn hán', 'Mưa không về đúng mùa, giếng cạn dần, giá lương thực tăng vọt.']
  };
  SC('qg_thien_tai', {
    title: function (l) { return 'Cảnh báo ' + pick(HAZ, l)[0]; },
    valid: function (l) { return world(l) && !!pick(HAZ, l) && l.indep && l.age >= 18; },
    text: function (l) { return pick(HAZ, l)[1]; },
    opts: [
      { k: 'so_tan', l: 'Sơ tán sớm theo hướng dẫn', h: function (l) { return 'An toàn, tốn khoảng ' + H.money(l, cost(l, 0.01)); }, req: function (l) { return l.money >= cost(l, 0.01); }, ai: { smart: 1.3, w: 1.2 }, run: function (l, r, log) { pay(l, 0.01, 'Sơ tán tránh ' + pick(HAZ, l)[0]); fx(l, { hap: -1 }); log(U.pick(r, ["Bạn mang giấy tờ quan trọng, nước và thuốc men đi sơ tán sớm. Mấy ngày sau trở về, nhà chỉ hư hỏng nhẹ.","Bạn đến ở nhờ nhà người quen ở vùng an toàn. Khi quay về, khu phố ngổn ngang nhưng nhà vẫn đứng vững.","Bạn theo xe của chính quyền đến điểm sơ tán, ngủ trên chiếu trong nhà thi đấu cùng hàng trăm người.","Sơ tán sớm, bạn tránh được đợt nguy hiểm nhất. Về nhà chỉ phải dọn dẹp, lau chùi mất mấy ngày."]), 'neutral'); } },
      { k: 'o_lai', l: 'Ở lại, gia cố nhà cửa', h: 'Không tốn tiền đi lại, có rủi ro', ai: { risk: 1.2, w: 0.6 }, run: function (l, r, log) { if (r() < 0.3) { pay(l, 0.03, 'Sửa nhà sau ' + pick(HAZ, l)[0]); fx(l, { hea: -4, hap: -6 }); stress(l, 8); log(U.pick(r, ["Thiên tai mạnh hơn dự báo. Nhà hư hỏng nặng, bạn bị thương nhẹ khi dọn dẹp, phải bỏ tiền sửa lại.","Một phần mái nhà bị tốc, đồ đạc hư hỏng nhiều, bạn phải bỏ tiền sửa sang lại.","Nước và gió tràn vào nhà, bạn bị trầy xước khi chống đỡ, mất một khoản sửa chữa."]), 'bad'); } else { fx(l, { hap: -1 }); stress(l, 3); log(U.pick(r, ["Bạn ở lại chằng chống nhà cửa, cả đêm thức trắng nghe ngóng. May mắn chỉ thiệt hại nhẹ.","Bạn gia cố cửa sổ, tích trữ nước và đồ ăn, ngồi nghe đài cả đêm. Sáng ra mọi thứ vẫn ổn.","Ở lại trong nhà, bạn nghe tiếng gió rít suốt đêm. May mà chỉ đổ mấy chậu cây ngoài sân."]), 'neutral'); } } },
      { k: 'giup', l: 'Gia cố nhà rồi giúp hàng xóm lớn tuổi đi sơ tán', h: 'Tốt cho cộng đồng, vất vả', ai: { karma: 1.3, w: 0.7 }, run: function (l, r, log) { fx(l, { karma: 5, soc: 3, hea: -1 }); log(U.pick(r, ["Bạn giúp bà cụ hàng xóm thu dọn đồ đạc và đưa bà đến nơi trú ẩn. Cả khu nhắc mãi chuyện ấy.","Bạn gõ cửa từng nhà người già trong khu, giúp họ mang đồ đến nơi trú ẩn.","Bạn chở ông cụ neo đơn cạnh nhà đi sơ tán, ông nắm tay cảm ơn mãi."]), 'good'); H.mem(l, 'Mùa ' + pick(HAZ, l)[0] + ' năm ' + l.age + ' tuổi, bạn đưa bà cụ hàng xóm đi sơ tán.', 3); } }
    ]
  });
  trig('qg_thien_tai', function (l, a) { return !!pick(HAZ, l) && l.indep && a >= 18; }, 0.04, 6, 5);

  // 3.7 Khám chữa bệnh: công hay tư
  var CARE = {
    GB: ['NHS', 'Bác sĩ gia đình chuyển bạn đến chuyên khoa của NHS. Danh sách chờ là vài tháng, miễn phí; khám tư nhanh hơn nhưng phải tự trả.'],
    CA: ['bảo hiểm y tế tỉnh', 'Khám chuyên khoa qua bảo hiểm y tế tỉnh là miễn phí nhưng phải chờ lâu; phòng khám ngoài bảo hiểm nhanh hơn, tốn tiền.'],
    AU: ['Medicare', 'Bệnh viện công qua Medicare miễn phí nhưng mổ không gấp phải chờ; bảo hiểm tư được chọn bác sĩ và ngày mổ.'],
    IN: ['bệnh viện công', 'Bệnh viện công rẻ nhưng hàng người chờ từ tờ mờ sáng; bệnh viện tư sạch sẽ, nhanh, giá cao.'],
    NG: ['bệnh viện công', 'Bệnh viện công thiếu bác sĩ, phải mua thuốc và vật tư ở ngoài; phòng khám tư tốt hơn nhưng đắt.'],
    PK: ['bệnh viện công', 'Bệnh viện công đông nghẹt; bệnh viện tư khám ngay nhưng chi phí cao.'],
    EG: ['bệnh viện công', 'Bệnh viện công miễn phí nhưng quá tải; phòng khám tư của bác sĩ có tiếng mở buổi tối, giá cao.'],
    BR: ['SUS', 'Khám qua hệ thống công SUS miễn phí nhưng phải xếp hàng chờ chuyên khoa; gói bảo hiểm tư nhanh hơn.'],
    MX: ['IMSS', 'Khám qua IMSS gần như miễn phí nhưng lịch hẹn xa; phòng khám tư khám ngay trong ngày.'],
    US: ['bảo hiểm', 'Bảo hiểm chỉ trả sau khi bạn tự chi đủ mức khấu trừ; bác sĩ trong mạng lưới phải chờ hai tháng, bác sĩ ngoài mạng lưới khám sớm hơn nhưng tự trả nhiều.'],
    ID: ['BPJS', 'Khám qua bảo hiểm BPJS phải đi từ trạm y tế tuyến dưới, chờ giấy chuyển viện; bệnh viện tư nhanh hơn nhưng tự trả.'],
    PH: ['bệnh viện công', 'Bệnh viện công có PhilHealth hỗ trợ nhưng đông đúc; bệnh viện tư nhanh nhưng đắt.'],
    ZA: ['bệnh viện công', 'Bệnh viện công rẻ nhưng chờ cả ngày; người có bảo hiểm y tế tư đi phòng khám tư.'],
    KE: ['bệnh viện công', 'Bệnh viện công rẻ nhưng thiếu thuốc; bệnh viện tư tốt hơn nhưng phải trả trước.'],
    TR: ['bệnh viện công', 'Bệnh viện công có bảo hiểm SGK đặt lịch qua ứng dụng nhưng kín lịch; bệnh viện tư khám ngay.'],
    TH: ['chế độ y tế toàn dân', 'Bệnh viện công theo chế độ y tế toàn dân chi phí rất thấp nhưng chờ lâu; bệnh viện tư nhanh và tiện nghi hơn.']
  };
  SC('qg_kham_benh', {
    title: function (l) { return 'Khám chữa ' + (l.ill ? l.ill.n : 'bệnh'); },
    valid: function (l) { return world(l) && !!pick(CARE, l) && !!l.ill && l.indep && once(l, 'qg_kham_benh', 3); },
    text: function (l) { return pick(CARE, l)[1]; },
    opts: [
      { k: 'cong', l: function (l) { return 'Chờ khám theo ' + pick(CARE, l)[0]; }, h: 'Rẻ hoặc miễn phí, phải chờ', ai: { w: 1 }, run: function (l, r, log) { mark(l, 'qg_kham_benh'); stress(l, 4); fx(l, { hap: -1 }); log(U.pick(r, ["Bạn chờ khám theo hệ thống công. Mất nhiều thời gian, nhưng cuối cùng cũng được bác sĩ chuyên khoa điều trị.","Xếp hàng từ sáng sớm, đến chiều mới tới lượt. Bác sĩ khám kỹ, kê đơn và hẹn tái khám.","Chờ mấy tuần mới có lịch hẹn, trong lúc chờ bạn uống thuốc theo đơn của bác sĩ gia đình."]), 'neutral'); } },
      { k: 'tu', l: 'Đi khám tư cho nhanh', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.04)) + ', điều trị sớm hơn'; }, req: function (l) { return l.money >= cost(l, 0.04); }, ai: { w: 0.8, smart: 1.1 }, run: function (l, r, log) { mark(l, 'qg_kham_benh'); pay(l, 0.04, 'Khám chữa bệnh tư'); if (l.ill && l.ill.cure != null) l.ill.cure = Math.min(0.95, l.ill.cure * 1.15); fx(l, { hea: 2 }); log(U.pick(r, ["Bạn đi khám tư, được làm xét nghiệm và bắt đầu điều trị ngay trong tuần.","Phòng khám tư nhận ngay trong ngày, có kết quả xét nghiệm sau vài giờ.","Bạn chọn bệnh viện tư, phòng sạch sẽ, bác sĩ giải thích cặn kẽ phác đồ điều trị."]), 'good'); } }
    ]
  });
  trig('qg_kham_benh', function (l) { return !!pick(CARE, l) && !!l.ill && l.indep && once(l, 'qg_kham_benh', 3); }, 0.35, 3);

  // 3.8 Lễ 15 tuổi của con gái (quinceañera)
  var QUINCE = 'MX GT HN SV NI CR PA CO VE EC PE BO PY UY AR CU DO'.split(' ');
  function quinceGirl(l) { var F = l.flags.qgQuince || {}; return kids(l, 15, 15).filter(function (k) { return k.sex === 'F' && !F[k.name]; })[0]; }
  SC('qg_quince', {
    title: function (l) { return here(l) === 'AR' || here(l) === 'UY' ? 'Tiệc 15 tuổi của con gái' : 'Lễ quinceañera của con gái'; },
    prep: function (l) { var k = quinceGirl(l); return { n: k ? k.name : '' }; },
    valid: function (l, d) { return world(l) && QUINCE.indexOf(here(l)) >= 0 && l.indep && !!quinceGirl(l) && (!d || !d.n || quinceGirl(l).name === d.n); },
    text: function (l, d) { return 'Con gái ' + d.n + ' tròn 15 tuổi. Ở đây, sinh nhật 15 tuổi của con gái là một dịp lớn: váy dạ hội, điệu valse với bố, bánh nhiều tầng, họ hàng và bạn bè đến đông đủ.'; },
    opts: [
      { k: 'lon', l: 'Tổ chức tiệc lớn ở nhà hàng', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.12)); }, req: function (l) { return canPay(l, 0.12); }, ai: { soc: 1.2, w: 0.7 }, run: function (l, r, log, d) { (l.flags.qgQuince = l.flags.qgQuince || {})[d.n] = 1; pay(l, 0.12, 'Tiệc 15 tuổi của con'); var k = (l.kids || []).filter(function (x) { return x.name === d.n; })[0]; if (k) k.close = U.clamp((k.close || 50) + 8, 0, 100); fx(l, { hap: 6, soc: 4 }); log(d.n + ' xuất hiện trong chiếc váy dạ hội, nhảy điệu valse đầu tiên cùng bạn. Cả khán phòng vỗ tay rần rần.', 'good'); H.mem(l, 'Điệu valse cùng con gái ' + d.n + ' trong ngày con tròn 15 tuổi.', 5); } },
      { k: 'nho', l: 'Làm tiệc nhỏ ở nhà với người thân', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.03)); }, req: function (l) { return canPay(l, 0.03); }, ai: { smart: 1.1, w: 1.2 }, run: function (l, r, log, d) { (l.flags.qgQuince = l.flags.qgQuince || {})[d.n] = 1; pay(l, 0.03, 'Tiệc 15 tuổi của con'); var k = (l.kids || []).filter(function (x) { return x.name === d.n; })[0]; if (k) k.close = U.clamp((k.close || 50) + 4, 0, 100); fx(l, { hap: 4 }); log('Bữa tiệc nhỏ ở sân nhà, nhạc mariachi từ chiếc loa cũ. ' + d.n + ' vẫn cười rạng rỡ.', 'good'); } },
      { k: 'du_lich', l: 'Hỏi con muốn tiệc hay một chuyến du lịch', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.06)); }, req: function (l) { return canPay(l, 0.06); }, ai: { w: 0.6 }, run: function (l, r, log, d) { (l.flags.qgQuince = l.flags.qgQuince || {})[d.n] = 1; pay(l, 0.06, 'Chuyến đi mừng con 15 tuổi'); var k = (l.kids || []).filter(function (x) { return x.name === d.n; })[0]; if (k) k.close = U.clamp((k.close || 50) + 6, 0, 100); fx(l, { hap: 5 }); log(d.n + ' chọn một chuyến du lịch cùng bố mẹ thay cho bữa tiệc. Chuyến đi ấy con nhắc mãi.', 'good'); } },
      { k: 'thoi', l: 'Chưa đủ điều kiện, chỉ ăn mừng trong nhà', ai: { w: 0.4 }, run: function (l, r, log, d) { (l.flags.qgQuince = l.flags.qgQuince || {})[d.n] = 1; log('Bạn giải thích với ' + d.n + ' rằng năm nay nhà chưa đủ điều kiện. Cả nhà vẫn làm một chiếc bánh kem nhỏ.', 'neutral'); } }
    ]
  });
  trig('qg_quince', function (l) { return QUINCE.indexOf(here(l)) >= 0 && l.indep && !!quinceGirl(l); }, 0.9, 1);

  // 3.9 Lễ hội đường phố lớn
  var FEST = { BR: ['Carnaval', 'Carnaval đến, các nhóm bloco diễu hành khắp phố với trống samba, cả thành phố nghỉ mấy ngày.'], TT: ['Carnival', 'Carnival đến, từ sáng sớm J\'ouvert người ta đã bôi sơn, bùn lên người nhảy theo nhạc soca.'], BO: ['Carnaval de Oruro', 'Lễ hội Oruro với hàng nghìn vũ công đeo mặt nạ quỷ diablada diễu hành.'], CO: ['Carnaval de Barranquilla', 'Lễ hội Barranquilla bốn ngày, cả thành phố nhảy cumbia trên đường.'], UY: ['Carnaval', 'Mùa lễ hội dài nhất thế giới, các nhóm murga hát châm biếm trên sân khấu dựng giữa phố.'], ES: ['Las Fallas', 'Lễ hội Las Fallas ở Valencia, những tượng giấy khổng lồ dựng khắp phố trước đêm đốt.'], DE: ['Karneval', 'Mùa Karneval, ngày thứ Năm "Weiberfastnacht" phụ nữ cắt cà vạt của đàn ông, cả thành phố hóa trang.'] };
  SC('qg_le_hoi', {
    title: function (l) { return pick(FEST, l)[0]; },
    valid: function (l) { return world(l) && !!pick(FEST, l) && l.age >= 14; },
    text: function (l) { return pick(FEST, l)[1]; },
    opts: [
      { k: 'di', l: 'Xuống đường nhập hội', h: 'Vui hết mình, giữ kỹ đồ đạc', ai: { soc: 1.3, w: 1.2 }, run: function (l, r, log) { fx(l, { hap: 6, soc: 3 }); if (r() < 0.12 && l.age >= 18) { pay(l, 0.006, 'Mất điện thoại ngày hội'); log('Nhảy múa đến khàn cả giọng — rồi phát hiện điện thoại đã "bốc hơi" giữa đám đông.', 'neutral'); } else log(U.pick(r, ["Bạn nhảy theo đoàn diễu hành đến tận khuya, áo ướt đẫm mồ hôi, giọng khản đặc.","Bạn hòa vào dòng người, hát theo đến khàn giọng, về nhà ngủ một mạch đến trưa.","Năm nay bạn mặc trang phục cùng nhóm bạn, đi theo đoàn trống từ chiều đến nửa đêm.","Cả buổi tối đứng giữa đám đông, ai cũng cười, ai cũng nhảy. Một ngày đáng nhớ."]), 'good'); } },
      { k: 'xem', l: 'Xem trên tivi ở nhà cho yên tĩnh', ai: { w: 0.6 }, run: function (l, r, log) { fx(l, { hap: 1 }); stress(l, -2); log(U.pick(r, ["Bạn ở nhà xem lễ hội trên tivi, nghe tiếng trống vọng từ ngoài phố.","Năm nay bạn ở nhà nghỉ ngơi, chỉ ra ban công nhìn đoàn diễu hành đi qua."]), 'neutral'); } },
      { k: 'lam', l: 'Đi làm thêm dịp lễ hội', h: 'Kiếm thêm tiền', req: function (l) { return l.age >= 18 && working(l); }, ai: { amb: 1.2, w: 0.5 }, run: function (l, r, log) { H.cash(l, cost(l, 0.01), 'Làm thêm dịp lễ hội'); fx(l, { hea: -1 }); log('Bạn nhận làm thêm mấy ngày lễ, khách đông nghẹt, tiền thưởng kha khá.', 'neutral'); } }
    ]
  });
  trig('qg_le_hoi', function (l, a) { return !!pick(FEST, l) && a >= 14; }, 0.12, 5, 6);

  // 3.10 Đình công giao thông
  var STRIKE = { FR: 'Công đoàn giao thông đình công, tàu điện ngầm và tàu SNCF chạy rất ít chuyến.', GB: 'Nhân viên đường sắt đình công, nhiều tuyến tàu ngừng chạy cả ngày.', DE: 'Công đoàn lái tàu đình công, Deutsche Bahn hủy phần lớn chuyến đường dài.', IT: 'Ngày "sciopero" — đình công giao thông, xe buýt và tàu điện ngừng chạy trừ giờ bảo đảm tối thiểu.', BE: 'Tổng đình công, tàu và xe buýt gần như ngừng chạy.', ES: 'Nhân viên đường sắt đình công, chỉ chạy các chuyến dịch vụ tối thiểu.' };
  SC('qg_dinh_cong', {
    title: 'Đình công giao thông',
    valid: function (l) { return world(l) && !!pick(STRIKE, l) && working(l) && l.urban; },
    text: function (l) { return pick(STRIKE, l) + ' Sáng nay bạn vẫn phải đi làm.'; },
    opts: [
      { k: 'xe_dap', l: 'Đạp xe hoặc đi bộ đến chỗ làm', h: 'Mệt nhưng đúng giờ', ai: { w: 1 }, run: function (l, r, log) { fx(l, { hea: 1 }); log(U.pick(r, ["Bạn đạp xe xuyên thành phố, đường đông xe đạp và xe trượt điện như ngày hội.","Bạn đi bộ gần một tiếng đến chỗ làm, chân mỏi nhừ nhưng vẫn kịp giờ."]), 'neutral'); } },
      { k: 'tu_xa', l: 'Xin làm việc từ xa hôm nay', h: 'Tùy công việc', req: function (l) { var j = E.jobDef(l); return !!j && /office|media|edu|sale|state/.test(j.cat); }, ai: { smart: 1.2, w: 1.2 }, run: function (l, r, log) { stress(l, -2); log('Bạn mở máy tính làm việc ở nhà, tránh được cảnh chen chúc ở các ga còn chạy.', 'good'); } },
      { k: 'ung_ho', l: 'Đi cùng đoàn biểu tình ôn hòa sau giờ làm', h: 'Bày tỏ quan điểm, mất thời gian', ai: { w: 0.4 }, run: function (l, r, log) { fx(l, { soc: 3 }); log('Sau giờ làm, bạn đi cùng đoàn người tuần hành ôn hòa qua quảng trường, chủ yếu để nghe xem mọi người đòi hỏi gì.', 'neutral'); } }
    ]
  });
  trig('qg_dinh_cong', function (l) { return !!pick(STRIKE, l) && working(l) && l.urban; }, 0.08, 4);

  // 3.11 Mai mối
  var MATCH = 'IN PK BD NP LK AF'.split(' ');
  SC('qg_mai_moi', {
    title: 'Lời mai mối',
    valid: function (l) { return world(l) && MATCH.indexOf(here(l)) >= 0 && !l.partner && parents(l) && l.age >= 22 && l.age <= 32 && l.orient !== 'gay'; },
    text: function (l) { return (l.fam.mAlive ? 'Mẹ' : 'Bố') + ' đưa bạn xem hồ sơ của một ' + (l.sex === 'F' ? 'chàng trai' : 'cô gái') + ' do người quen giới thiệu: cùng cộng đồng, học vấn tương xứng, hai gia đình muốn gặp mặt một buổi.'; },
    opts: [
      { k: 'gap', l: 'Đồng ý gặp mặt một buổi', h: 'Không ép buộc, chỉ là gặp để tìm hiểu', ai: { soc: 1.2, w: 1 }, run: function (l, r, log) { mark(l, 'qg_mai_moi'); fx(l, { soc: 2 }); if (r() < 0.35) { fx(l, { hap: 4 }); log('Hai gia đình uống trà, hai người được ngồi riêng nói chuyện. Hợp nhau hơn bạn nghĩ, hẹn sẽ gặp lại.', 'good'); } else log('Buổi gặp lịch sự nhưng không hợp. Hai bên vui vẻ nói lời từ chối khéo.', 'neutral'); } },
      { k: 'tu_tim', l: 'Thưa với bố mẹ mình muốn tự tìm hiểu người phù hợp', ai: { w: 0.8 }, run: function (l, r, log) { mark(l, 'qg_mai_moi'); fx(l, { hap: 1 }); log('Bạn nói thật với bố mẹ. Có chút không vui, nhưng cuối cùng bố mẹ cũng tôn trọng lựa chọn của bạn.', 'neutral'); } },
      { k: 'hoan', l: 'Xin hoãn vài năm để lo sự nghiệp', ai: { amb: 1.2, w: 0.6 }, run: function (l, r, log) { mark(l, 'qg_mai_moi'); log('Bạn xin bố mẹ cho thêm vài năm tập trung công việc. Chuyện mai mối tạm gác lại.', 'neutral'); } }
    ]
  });
  trig('qg_mai_moi', function (l, a) { return MATCH.indexOf(here(l)) >= 0 && !l.partner && parents(l) && a >= 22 && a <= 32 && l.orient !== 'gay' && once(l, 'qg_mai_moi', 4); }, 0.15, 4);

  // 3.12 Tăng ca
  var OT = { CN: ['Lịch làm "996"', 'Dự án gấp, công ty chạy lịch "996": chín giờ sáng đến chín giờ tối, sáu ngày một tuần.'], JP: ['Làm thêm giờ', 'Cuối quý, cả phòng ở lại làm thêm giờ, không ai muốn về trước trưởng phòng.'], KR: ['Làm đêm', 'Hạn chót dự án, cả nhóm "yagun" — làm đến đêm khuya nhiều ngày liền.'] };
  SC('qg_tang_ca', {
    title: function (l) { return pick(OT, l)[0]; },
    valid: function (l) { var j = E.jobDef(l); return world(l) && !!pick(OT, l) && working(l) && H.isEmployee(l) && (!E.hasBoss || E.hasBoss(l)) && !!j && /office|sale|media|state/.test(j.cat); },
    text: function (l) { return pick(OT, l)[1]; },
    opts: [
      { k: 'chiu', l: 'Cố gắng theo nhịp cả nhóm', h: 'Tiền làm thêm, sức khỏe giảm', ai: { amb: 1.2, w: 1 }, run: function (l, r, log) { H.cash(l, cost(l, 0.02), 'Tiền làm thêm giờ'); fx(l, { hea: -3, hap: -2 }); stress(l, 7); if (l.job) l.job.rep = U.clamp((l.job.rep || 50) + 3, 0, 100); log('Mấy tuần liền về nhà khi đã khuya. Dự án kịp hạn, cấp trên ghi nhận, còn bạn thì gầy đi trông thấy.', 'neutral'); } },
      { k: 'ranh_gioi', l: 'Làm đủ giờ, nói rõ giới hạn với cấp trên', h: 'Giữ sức khỏe, có thể mất điểm', ai: { smart: 1.2, w: 0.8 }, run: function (l, r, log) { fx(l, { hea: 1 }); if (l.job) l.job.rep = U.clamp((l.job.rep || 50) - 2, 0, 100); log('Bạn làm đủ phần việc trong giờ và nói rõ không thể ở lại mỗi tối. Cấp trên không vui nhưng chấp nhận.', 'neutral'); } }
    ]
  });
  trig('qg_tang_ca', function (l) { return !!pick(OT, l) && working(l) && H.isEmployee(l); }, 0.1, 4);

  // 3.13 Khai thuế thu nhập
  var TAX = { US: ['IRS', 'hạn 15 tháng 4'], CA: ['CRA', 'hạn 30 tháng 4'], AU: ['ATO', 'hạn 31 tháng 10, sau năm tài chính kết thúc 30/6'], DE: ['cơ quan thuế (ELSTER)', 'hạn mùa hè năm sau'], FR: ['impots.gouv', 'hạn tháng Năm, tháng Sáu'] };
  SC('qg_thue', {
    title: 'Mùa khai thuế',
    valid: function (l) { return world(l) && !!pick(TAX, l) && working(l) && l.indep; },
    text: function (l) { var t = pick(TAX, l); return 'Đến mùa khai thuế thu nhập với ' + t[0] + ', ' + t[1] + '. Khai đúng các khoản khấu trừ thì có thể được hoàn lại một phần tiền thuế.'; },
    opts: [
      { k: 'tu', l: 'Tự khai trên mạng', h: 'Miễn phí, dễ khai sót', ai: { smart: 1.2, w: 1 }, run: function (l, r, log) { mark(l, 'qg_thue'); fx(l, { kno: 1 }); if (r() < 0.75) { H.cash(l, cost(l, 0.004 + r() * 0.012), 'Hoàn thuế'); log(U.pick(r, ['Bạn ngồi hai buổi tối tự khai. Vài tuần sau nhận được tiền hoàn thuế.', 'Lần này khai nhanh hơn hẳn vì đã quen mẫu đơn, tiền hoàn thuế về tài khoản sau ba tuần.', 'Tự khai thuế, tìm ra thêm một khoản được khấu trừ, tiền hoàn nhiều hơn dự tính.', 'Khai xong mới thở phào, tiền hoàn thuế đủ trả một tháng tiền điện nước.']), 'good'); } else { pay(l, 0.003, 'Nộp bổ sung thuế'); log(U.pick(r, ['Khai sót một khoản thu nhập, bạn nhận thư yêu cầu nộp bổ sung kèm tiền phạt nhỏ.', 'Nhập nhầm một con số, cơ quan thuế gửi thư yêu cầu điều chỉnh và nộp thêm.']), 'bad'); } } },
      { k: 'thue', l: 'Thuê dịch vụ kế toán khai hộ', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.004)); }, req: function (l) { return l.money >= cost(l, 0.004); }, ai: { w: 0.8 }, run: function (l, r, log) { mark(l, 'qg_thue'); pay(l, 0.004, 'Phí dịch vụ khai thuế'); H.cash(l, cost(l, 0.008 + r() * 0.008), 'Hoàn thuế'); log(U.pick(r, ['Kế toán tìm thêm mấy khoản được khấu trừ bạn không biết, tiền hoàn thuế đủ bù phí dịch vụ.', 'Giao hết giấy tờ cho kế toán, bạn chỉ việc ký, tiền hoàn thuế về đúng hẹn.', 'Kế toán nhắc bạn giữ hóa đơn chi phí đi làm, năm nay được hoàn thuế nhiều hơn.']), 'good'); } },
      { k: 'muon', l: 'Để sát hạn rồi tính', h: 'Dễ bị phạt nộp muộn', ai: { w: 0.3 }, run: function (l, r, log) { mark(l, 'qg_thue'); pay(l, 0.006, 'Phạt nộp thuế muộn'); log('Bạn quên mất hạn khai thuế, phải nộp kèm tiền phạt chậm nộp.', 'bad'); } }
    ]
  });
  trig('qg_thue', function (l) { return !!pick(TAX, l) && working(l) && l.indep && once(l, 'qg_thue', 5); }, 0.2, 5, 4);

  // 3.14 Cho con học thêm
  var TUTOR = { KR: ['hagwon', 'Bạn bè của con đều học hagwon toán, tiếng Anh đến tối muộn; con hỏi có phải đi học thêm không.'], JP: ['juku', 'Nhiều bạn cùng lớp của con học juku luyện thi sau giờ học; giáo viên gợi ý con nên ôn thêm.'], CN: ['lớp năng khiếu', 'Từ khi cấm dạy thêm các môn chính, nhiều phụ huynh chuyển sang cho con học lớp năng khiếu, thể thao.'], IN: ['lớp luyện thi (coaching)', 'Các trung tâm luyện thi (coaching) mời chào khắp nơi, nhiều gia đình cho con học từ lớp 9 để chuẩn bị thi JEE, NEET.'], EG: ['học thêm tư nhân', 'Giáo viên mở lớp học thêm tư nhân buổi tối, ai cũng nói không học thêm thì khó đạt điểm cao.'], TR: ['dershane luyện thi', 'Các lớp luyện thi dershane tuyển sinh, học phí không nhỏ.'] };
  function tutorKid(l) { return kids(l, 10, 17)[0]; }
  SC('qg_hoc_them', {
    title: function (l) { return 'Cho con đi ' + pick(TUTOR, l)[0] + '?'; },
    prep: function (l) { var k = tutorKid(l); return { n: k ? k.name : '' }; },
    valid: function (l, d) { return world(l) && !!pick(TUTOR, l) && l.indep && !!tutorKid(l) && once(l, 'qg_hoc_them', 3); },
    text: function (l, d) { return pick(TUTOR, l)[1].replace(/\bcon\b/, 'con (' + d.n + ')'); },
    opts: [
      { k: 'nhieu', l: 'Cho con học nhiều lớp', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.06)) + '/năm, con mệt'; }, req: function (l) { return canPay(l, 0.06); }, ai: { amb: 1.3, w: 0.7 }, run: function (l, r, log, d) { mark(l, 'qg_hoc_them'); pay(l, 0.06, 'Học thêm cho con'); var k = (l.kids || []).filter(function (x) { return x.name === d.n; })[0]; if (k) k.close = U.clamp((k.close || 50) - 3, 0, 100); log(d.n + ' kín lịch học thêm đến tối, điểm số khá lên nhưng con ít nói hẳn.', 'neutral'); } },
      { k: 'mot', l: 'Chỉ một lớp môn con yếu nhất', h: function (l) { return 'Khoảng ' + H.money(l, cost(l, 0.02)) + '/năm'; }, req: function (l) { return canPay(l, 0.02); }, ai: { smart: 1.2, w: 1.2 }, run: function (l, r, log, d) { mark(l, 'qg_hoc_them'); pay(l, 0.02, 'Học thêm cho con'); var k = (l.kids || []).filter(function (x) { return x.name === d.n; })[0]; if (k) k.close = U.clamp((k.close || 50) + 2, 0, 100); log('Bạn cho ' + d.n + ' học thêm đúng một môn, vẫn để con có thời gian chơi.', 'good'); } },
      { k: 'tu_hoc', l: 'Để con tự học, bố mẹ kèm thêm ở nhà', h: 'Không tốn tiền, tốn thời gian', ai: { w: 0.8 }, run: function (l, r, log, d) { mark(l, 'qg_hoc_them'); var k = (l.kids || []).filter(function (x) { return x.name === d.n; })[0]; if (k) k.close = U.clamp((k.close || 50) + 4, 0, 100); stress(l, 2); log('Tối nào bạn cũng ngồi kèm ' + d.n + ' học bài. Hai ' + (l.sex === 'F' ? 'mẹ' : 'bố') + ' con thân nhau hơn.', 'good'); } }
    ]
  });
  trig('qg_hoc_them', function (l) { return !!pick(TUTOR, l) && l.indep && !!tutorKid(l) && once(l, 'qg_hoc_them', 3); }, 0.2, 3);

  // ===================================================================
  // 4. CHẠY HẰNG NĂM (chỉ đời ở nước ngoài Việt Nam)
  // ===================================================================
  E.HOOKS.year.unshift(function (l, r, log, a) { // đặt đầu danh sách: độc lập với các hook khác
    if (!world(l) || !free(l)) return;
    if (l.flags.qgLineAt == null || a - l.flags.qgLineAt >= 2) tellLine(l, r, log, a);
    if (!l.alive || l.pending.length >= 3) return;
    var at = l.flags.qgTrig || (l.flags.qgTrig = {}), n = l.flags.qgN || (l.flags.qgN = {});
    var c = TR.filter(function (t) { return E.DEC[t.id] && (at[t.id] == null || a - at[t.id] >= t.cd) && (n[t.id] || 0) < t.max && t.when(l, a); });
    if (!c.length) return;
    var t = c[Math.floor(r() * c.length)]; if (r() >= t.p) return;
    var d = E.DEC[t.id].make(l, r); if (!d || !d.opts.length || (E.DEC[t.id].valid && !E.DEC[t.id].valid(l, d.data))) return;
    at[t.id] = a; n[t.id] = (n[t.id] || 0) + 1; l.pending.push(d);
  });
  // Người theo đạo Phật ở nước khác không gặp phong tục riêng của Việt Nam (Vu Lan cài hoa hồng, Rằm tháng Giêng…): xem leisure.js.
  E.WORLD_COUNTRY = { lines: BANK, region: REGION, world: world, here: here, fits: fits };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
