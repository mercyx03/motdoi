/* 8.9.0 — Bản địa hóa đời sống theo nơi cư trú, nguồn gốc gia đình và tín ngưỡng (195 quốc gia).
   Ba lớp dữ liệu:
   1) Khu vực địa lý cho đủ 195 mã quốc gia (sự thật địa lý, không suy ra phong tục).
   2) Hồ sơ quốc gia: lễ hội / kỳ thi / nghi thức trưởng thành / môi trường làm việc chỉ ghi khi có nguồn (docs/culture-sources.md).
   3) Bản sắc cá nhân: quốc gia sinh, nơi đang sống, nhóm tên gốc, tổ tiên (life138), tôn giáo gia đình, mức gắn bó truyền thống.
   Quốc gia chưa có hồ sơ riêng dùng sự kiện phổ quát + lễ theo tôn giáo gia đình, không tự tạo phong tục. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, C = E.WORLD120;

  // ---------- Lớp 1: khu vực địa lý ----------
  var REGIONS = {
    SEA: ['Đông Nam Á', 'VN,TH,KH,LA,MM,MY,SG,ID,PH,BN,TL'],
    EA: ['Đông Á', 'CN,JP,KR,KP,MN'],
    SA: ['Nam Á', 'IN,PK,BD,NP,BT,LK,MV,AF'],
    CAS: ['Trung Á', 'KZ,UZ,TJ,KG,TM'],
    CAU: ['Kavkaz', 'AM,AZ,GE'],
    MENA: ['Trung Đông và Bắc Phi', 'DZ,BH,EG,IR,IQ,IL,JO,KW,LB,LY,MA,OM,PS,QA,SA,SY,TN,TR,AE,YE'],
    EUW: ['Tây Âu', 'AT,BE,FR,DE,LI,LU,MC,NL,CH,IE,GB'],
    EUN: ['Bắc Âu và Baltic', 'DK,FI,IS,NO,SE,EE,LV,LT'],
    EUS: ['Nam Âu và Balkan', 'AD,HR,CY,GR,IT,MT,PT,SM,ES,VA,SI,AL,BA,ME,MK,RS'],
    EUE: ['Đông Âu', 'BY,BG,CZ,HU,MD,PL,RO,RU,SK,UA'],
    NAM: ['Bắc Mỹ', 'US,CA'],
    LAT: ['Mỹ Latinh', 'AR,BO,BR,CL,CO,CR,EC,SV,GT,HN,MX,NI,PA,PY,PE,UY,VE,BZ'],
    CAR: ['Caribe', 'AG,BS,BB,CU,DM,DO,GD,HT,JM,KN,LC,VC,TT,GY,SR'],
    OCE: ['Châu Đại Dương', 'AU,NZ,FJ,KI,MH,FM,NR,PW,PG,WS,SB,TO,TV,VU'],
    AFW: ['Tây Phi', 'BJ,BF,CV,CI,GM,GH,GN,GW,LR,ML,MR,NE,NG,SN,SL,TG'],
    AFC: ['Trung Phi', 'AO,CM,CF,TD,CG,CD,GQ,GA,ST'],
    AFE: ['Đông Phi', 'BI,KM,DJ,ER,ET,KE,MG,MW,MU,MZ,RW,SC,SO,SS,SD,TZ,UG,ZM,ZW'],
    AFS: ['Nam Phi', 'BW,SZ,LS,NA,ZA']
  };
  var REGION_OF = {};
  Object.keys(REGIONS).forEach(function (k) { REGIONS[k][1].split(',').forEach(function (c) { REGION_OF[c] = k; }); });
  var LATIN_QUINCE = 'MX,GT,SV,HN,NI,CR,PA,CU,DO,CO,VE,EC,PE,BO,PY,CL,AR,UY'.split(',');

  // ---------- Thư viện lễ hội (src = khóa nguồn trong docs/culture-sources.md) ----------
  // since: năm bắt đầu áp dụng dạng hiện tại, chỉ ghi khi có căn cứ; không ghi = truyền thống lâu đời.
  var HOL = {
    tet_vn: { n: 'Tết Nguyên đán', menu: 'Đón Tết cùng gia đình', party: 'lễ Tết', t: 'dọn nhà, gói bánh chưng hoặc bánh tét, chúc Tết và mừng tuổi', src: 'vn' },
    chunjie: { n: 'Tết Xuân (Xuân Tiết)', t: 'ăn bữa cơm đoàn viên đêm giao thừa, gói sủi cảo, trao phong bao đỏ', src: 'cn' },
    zhongqiu: { n: 'Tết Trung thu', t: 'ngắm trăng và chia bánh trung thu cùng gia đình', src: 'cn' },
    shogatsu: { n: 'Shōgatsu (năm mới Nhật Bản)', t: 'ăn món osechi, viếng đền chùa đầu năm (hatsumōde), gửi thiệp nengajō', src: 'jp' },
    obon: { n: 'Obon', t: 'về quê thăm mộ tổ tiên, xem hoặc tham gia múa Bon Odori', src: 'jp' },
    seollal: { n: 'Seollal (Tết âm lịch Hàn Quốc)', t: 'mặc hanbok, cúi chào chúc tuổi người lớn (sebae), ăn canh bánh gạo tteokguk', src: 'kr', since: 1985 },
    chuseok: { n: 'Chuseok', t: 'về quê, làm bánh songpyeon, viếng mộ tổ tiên', src: 'kr' },
    tsagaan: { n: 'Tsagaan Sar (năm mới Mông Cổ)', t: 'chúc tuổi người lớn, cả nhà làm bánh hấp buuz', src: 'mn' },
    naadam: { n: 'Naadam', t: 'xem đấu vật, đua ngựa và bắn cung', src: 'unesco' },
    thanks_us: { n: 'Lễ Tạ ơn (Thanksgiving)', t: 'bữa tối cùng gia đình vào thứ Năm thứ tư của tháng 11', src: 'us', since: 1863 },
    july4: { n: 'Ngày Độc lập Hoa Kỳ (4/7)', t: 'dã ngoại, nướng BBQ và xem pháo hoa', src: 'us' },
    thanks_ca: { n: 'Lễ Tạ ơn Canada', t: 'bữa tối gia đình vào thứ Hai thứ hai của tháng 10', src: 'ca', since: 1879 },
    canada_day: { n: 'Ngày Canada (1/7)', t: 'xem pháo hoa và tham gia hoạt động cộng đồng', src: 'ca', since: 1879 },
    christmas: { n: 'Giáng sinh', t: 'trang trí cây thông, bữa tối gia đình và trao quà', src: 'faith' },
    xmas_summer: { n: 'Giáng sinh giữa mùa hè', t: 'bữa trưa ngoài trời, nướng thịt hoặc ra biển cùng gia đình', src: 'faith' },
    bonfire: { n: 'Đêm lửa trại Guy Fawkes (5/11)', t: 'đốt lửa trại và xem pháo hoa', src: 'gb' },
    bastille: { n: 'Quốc khánh Pháp (14/7)', t: 'xem diễu hành, pháo hoa và dạ vũ ngoài trời', src: 'fr', since: 1880 },
    einheit: { n: 'Ngày Thống nhất nước Đức (3/10)', t: 'tham gia lễ hội công cộng ở thành phố', src: 'de', since: 1990 },
    ferragosto: { n: 'Ferragosto (15/8)', t: 'nghỉ hè giữa tháng 8, dã ngoại cùng gia đình', src: 'it' },
    nochevieja: { n: 'Nochevieja (đêm giao thừa)', t: 'ăn 12 quả nho theo 12 tiếng chuông nửa đêm', src: 'es' },
    sinterklaas: { n: 'Sinterklaas (5/12)', t: 'trao quà kèm những bài thơ vui trong gia đình', src: 'unesco' },
    midsommar: { n: 'Midsommar', t: 'dựng cột hoa, nhảy vòng tròn, ăn cá trích và dâu tây', src: 'se' },
    syttende: { n: 'Ngày Hiến pháp Na Uy (17/5)', t: 'xem đoàn diễu hành của trẻ em, nhiều người mặc bunad', src: 'no' },
    wigilia: { n: 'Wigilia (đêm Giáng sinh)', t: 'bữa tối đêm 24/12, chia bánh thánh opłatek với người thân', src: 'pl' },
    novy_god: { n: 'Năm mới (Novy God)', t: 'trang trí cây thông năm mới, bữa tối giao thừa và trao quà', src: 'ru' },
    maslenitsa: { n: 'Maslenitsa (tuần bánh blini)', t: 'làm bánh blini, tiễn mùa đông', src: 'ru' },
    pascha: { n: 'Lễ Phục sinh Chính Thống (Pascha)', t: 'dự lễ đêm, nhuộm trứng đỏ, bữa tiệc sau Mùa Chay', src: 'faith' },
    eid_fitr: { n: 'Eid al-Fitr', t: 'cầu nguyện buổi sáng, thăm họ hàng, bố thí và mặc trang phục mới', src: 'faith' },
    bayram: { n: 'Ramazan Bayramı', t: 'thăm người lớn tuổi, hôn tay chúc phúc, mời kẹo ngọt', src: 'faith' },
    lebaran: { n: 'Lebaran (Idul Fitri)', t: 'về quê (mudik), xin lỗi nhau (halal bihalal), ăn ketupat', src: 'id' },
    hari_raya: { n: 'Hari Raya Aidilfitri', t: 'mở cửa đón khách (rumah terbuka), ăn ketupat và rendang', src: 'my' },
    sham_nessim: { n: 'Sham el-Nessim', t: 'dã ngoại mùa xuân, ăn cá muối và trứng màu', src: 'eg' },
    nowruz: { n: 'Nowruz (năm mới mùa xuân)', t: 'dọn nhà đón xuân, bày bàn lễ năm mới, thăm họ hàng', src: 'unesco' },
    diwali: { n: 'Diwali (lễ hội ánh sáng)', t: 'thắp đèn diya, vẽ rangoli, chia sẻ đồ ngọt', src: 'faith' },
    holi: { n: 'Holi', t: 'tung bột màu và chúc mừng mùa xuân', src: 'in' },
    dashain: { n: 'Dashain', t: 'nhận tika từ người lớn, đoàn tụ gia đình, thả diều', src: 'np' },
    avurudu: { n: 'Tết Sinhala và Tamil (Aluth Avurudu)', t: 'nấu cơm sữa kiribath theo giờ lành, chơi trò dân gian', src: 'lk' },
    boishakh: { n: 'Pohela Boishakh (năm mới Bengal)', t: 'xem diễu hành Mangal Shobhajatra, ăn panta ilish', src: 'unesco' },
    songkran: { n: 'Songkran (Tết Thái)', t: 'té nước chúc phúc, rưới nước lên tay người lớn tuổi, làm công đức ở chùa', src: 'unesco' },
    loy_krathong: { n: 'Loy Krathong', t: 'thả đèn hoa krathong trên sông hồ', src: 'th' },
    khmer_ny: { n: 'Chôl Chnăm Thmây (Tết Khmer)', t: 'đi chùa, đắp núi cát, chơi trò dân gian', src: 'kh' },
    pimai: { n: 'Pi Mai Lao (Tết Lào)', t: 'té nước, buộc chỉ cổ tay chúc phúc (baci)', src: 'la' },
    thingyan: { n: 'Thingyan (Tết té nước Myanmar)', t: 'té nước, làm công đức và thả cá phóng sinh', src: 'mm' },
    simbang_gabi: { n: 'Mùa Giáng sinh Philippines', t: 'dự lễ Simbang Gabi và bữa Noche Buena đêm 24/12', src: 'ph' },
    muertos: { n: 'Día de Muertos', t: 'dựng bàn thờ ofrenda với cúc vạn thọ, ăn pan de muerto, tưởng nhớ người thân', src: 'unesco' },
    posadas: { n: 'Las Posadas (16–24/12)', t: 'đi rước Posadas trong khu phố, đập piñata', src: 'mx' },
    carnaval: { n: 'Carnaval', t: 'xem diễu hành, nhảy samba, vui lễ hội đường phố trước Mùa Chay', src: 'br' },
    junina: { n: 'Festa Junina', t: 'mặc trang phục đồng quê, nhảy quadrilha, ăn bánh ngô', src: 'br' },
    enkutatash: { n: 'Enkutatash (năm mới Ethiopia)', t: 'tặng hoa cúc vàng, thăm họ hàng, trẻ em hát chúc', src: 'et' },
    meskel: { n: 'Meskel', t: 'xem đốt đống lửa Demera', src: 'unesco' },
    heritage_za: { n: 'Ngày Di sản Nam Phi (24/9)', t: 'nướng braai, mặc trang phục truyền thống của gia đình', src: 'za', since: 1995 },
    rosh: { n: 'Rosh Hashanah', t: 'nghe kèn shofar, ăn táo chấm mật ong cầu năm mới ngọt lành', src: 'faith' },
    pesach: { n: 'Lễ Vượt Qua (Pesach)', t: 'bữa Seder, ăn bánh không men matzah', src: 'faith' },
    vesak: { n: 'Lễ Phật Đản (Vesak)', t: 'đi chùa, thắp đèn và làm việc thiện', src: 'faith' },
    vaisakhi: { n: 'Vaisakhi', t: 'đến gurdwara, xem diễu hành và dùng bữa cộng đồng langar', src: 'faith' },
    new_year_common: { n: 'Lễ đón năm mới và ngày hội cộng đồng', menu: 'Sum họp lễ gia đình', party: 'dịp lễ của gia đình', t: 'sum họp gia đình, trò chuyện cùng hàng xóm và chúc nhau năm mới bình an', src: 'universal' }
  };
  Object.keys(HOL).forEach(function (k) { var h = HOL[k]; h.id = k; if (!h.menu) h.menu = 'Đón ' + h.n + ' cùng gia đình'; if (!h.party) h.party = h.n; });

  // ---------- Lớp 2: hồ sơ quốc gia ----------
  // h: lễ hội gia đình/cộng đồng; ex: kỳ thi cuối cấp theo năm; co: nghi thức trưởng thành; sc: kiểu đời sống học đường; wk: kiểu môi trường làm việc.
  function ex(fn) { return fn; }
  var P = {
    VN: { h: ['tet_vn'], deep: 1 },
    CN: { h: ['chunjie', 'zhongqiu'], sc: 'cn', ex: ex(function (y) { return y >= 1966 && y <= 1976 ? null : 'Gaokao (kỳ thi tuyển sinh đại học)'; }), deep: 1 },
    JP: { h: ['shogatsu', 'obon'], sc: 'jp', wk: 'jp', co: 'jp', ex: ex(function (y) { return y >= 2021 ? 'Kỳ thi chung tuyển sinh đại học (Kyōtsū Test)' : y >= 1990 ? 'Kỳ thi Trung tâm (Center Test)' : y >= 1979 ? 'Kỳ thi Kyōtsū Ichiji' : 'kỳ thi tuyển sinh riêng của từng trường đại học'; }), deep: 1 },
    KR: { h: ['seollal', 'chuseok'], sc: 'kr', wk: 'kr', co: 'kr', ex: ex(function (y) { return y >= 1994 ? 'Suneung (CSAT)' : 'kỳ thi tuyển sinh đại học'; }), deep: 1 },
    MN: { h: ['tsagaan', 'naadam'] },
    US: { h: ['thanks_us', 'july4'], sc: 'us', wk: 'us', ex: ex(function (y) { return y >= 1959 ? 'SAT/ACT và hồ sơ xét tuyển đại học' : y >= 1926 ? 'SAT và hồ sơ xét tuyển đại học' : null; }), deep: 1 },
    CA: { h: ['thanks_ca', 'canada_day'], sc: 'us', ex: ex(function () { return 'xét tuyển đại học bằng học bạ lớp 12 của tỉnh bang'; }), deep: 1 },
    GB: { h: ['christmas', 'bonfire'], sc: 'gb', ex: ex(function (y) { return y >= 1951 ? 'A-Level' : null; }), deep: 1 },
    IE: { h: ['christmas'] },
    FR: { h: ['christmas', 'bastille'], sc: 'fr', wk: 'fr', ex: ex(function () { return 'Baccalauréat'; }), deep: 1 },
    DE: { h: ['christmas', 'einheit'], sc: 'de', wk: 'de', ex: ex(function () { return 'Abitur'; }), deep: 1 },
    AT: { h: ['christmas'] }, CH: { h: ['christmas'] },
    IT: { h: ['christmas', 'ferragosto'], ex: ex(function (y) { return y >= 1923 ? 'Esame di Maturità' : null; }), deep: 1 },
    ES: { h: ['christmas', 'nochevieja'], ex: ex(function (y) { return y >= 1975 ? 'Selectividad (kỳ thi vào đại học)' : null; }), deep: 1 },
    PT: { h: ['christmas'] },
    NL: { h: ['sinterklaas'], ex: ex(function () { return 'eindexamen (kỳ thi tốt nghiệp trung học)'; }), deep: 1 },
    SE: { h: ['midsommar', 'christmas'], wk: 'se', ex: ex(function (y) { return y >= 1977 ? 'xét tuyển bằng điểm trung học hoặc Högskoleprovet' : null; }), deep: 1 },
    NO: { h: ['syttende', 'christmas'] },
    PL: { h: ['wigilia'] },
    RU: { h: ['novy_god', 'maslenitsa'], ex: ex(function (y) { return y >= 2009 ? 'EGE (Kỳ thi Quốc gia Thống nhất)' : 'kỳ thi tốt nghiệp và thi tuyển riêng của trường đại học'; }), deep: 1 },
    BY: { h: ['novy_god'] }, UA: { h: ['novy_god'] },
    GR: { h: ['pascha'] }, CY: { h: ['pascha'] },
    TR: { h: ['bayram'] },
    SA: { h: ['eid_fitr'], deep: 1, ex: ex(function () { return 'kỳ thi cuối cấp trung học và bài thi xét tuyển đại học'; }) },
    AE: { h: ['eid_fitr'], deep: 1, ex: ex(function () { return 'kỳ thi cuối cấp trung học'; }) },
    EG: { h: ['eid_fitr', 'sham_nessim'], ex: ex(function () { return 'Thanaweya Amma (kỳ thi tốt nghiệp trung học)'; }), deep: 1 },
    QA: { h: ['eid_fitr'] }, KW: { h: ['eid_fitr'] }, BH: { h: ['eid_fitr'] }, OM: { h: ['eid_fitr'] }, JO: { h: ['eid_fitr'] }, IQ: { h: ['eid_fitr'] },
    SY: { h: ['eid_fitr'] }, YE: { h: ['eid_fitr'] }, LY: { h: ['eid_fitr'] }, DZ: { h: ['eid_fitr'] }, MA: { h: ['eid_fitr'] }, TN: { h: ['eid_fitr'] },
    PS: { h: ['eid_fitr'] }, AF: { h: ['eid_fitr'] }, PK: { h: ['eid_fitr'] }, MV: { h: ['eid_fitr'] },
    IR: { h: ['nowruz'] }, AZ: { h: ['nowruz'] }, KZ: { h: ['nowruz'] }, UZ: { h: ['nowruz'] }, TJ: { h: ['nowruz'] }, KG: { h: ['nowruz'] }, TM: { h: ['nowruz'] },
    IL: { h: ['rosh'] },
    IN: { h: ['diwali', 'holi'], sc: 'in', ex: ex(function (y) { return y >= 2016 ? 'Board Exams lớp 12 và JEE/NEET' : y >= 2013 ? 'Board Exams lớp 12 và JEE Main' : 'Board Exams lớp 12 và kỳ thi đầu vào'; }), deep: 1 },
    BD: { h: ['eid_fitr', 'boishakh'] }, NP: { h: ['dashain'] }, LK: { h: ['avurudu'] },
    TH: { h: ['songkran', 'loy_krathong'], ex: ex(function (y) { return y >= 2018 ? 'TCAS (hệ thống tuyển sinh đại học)' : 'kỳ thi tuyển sinh đại học'; }), deep: 1 },
    KH: { h: ['khmer_ny'] }, LA: { h: ['pimai'] }, MM: { h: ['thingyan'] },
    MY: { h: ['hari_raya'], ex: ex(function (y) { return y >= 1964 ? 'SPM (Sijil Pelajaran Malaysia)' : null; }), deep: 1 },
    BN: { h: ['hari_raya'] },
    SG: { h: ['chunjie', 'hari_raya'], ex: ex(function (y) { return y >= 1975 ? 'GCE A-Level' : null; }), deep: 1 },
    ID: { h: ['lebaran'], ex: ex(function () { return 'kỳ thi tuyển sinh đại học quốc gia'; }), deep: 1 },
    PH: { h: ['simbang_gabi'], ex: ex(function () { return 'kỳ thi tuyển sinh của trường đại học'; }), deep: 1 },
    AU: { h: ['xmas_summer'], sc: 'us', ex: ex(function (y) { return y >= 2009 ? 'kỳ thi Year 12 và xếp hạng ATAR' : 'kỳ thi cuối cấp Year 12'; }), deep: 1 },
    NZ: { h: ['xmas_summer'] },
    ZA: { h: ['xmas_summer', 'heritage_za'], ex: ex(function (y) { return y >= 2008 ? 'Matric (National Senior Certificate)' : 'kỳ thi Matric'; }), deep: 1 },
    MX: { h: ['muertos', 'posadas'], ex: ex(function () { return 'kỳ thi tuyển sinh đại học (examen de admisión)'; }), deep: 1 },
    BR: { h: ['carnaval', 'junina'], ex: ex(function (y) { return y >= 1998 ? 'ENEM' : 'Vestibular'; }), deep: 1 },
    AR: { h: ['xmas_summer'], ex: ex(function () { return 'hoàn tất trung học và khóa dự bị đại học'; }), deep: 1 },
    CL: { h: ['xmas_summer'] }, UY: { h: ['xmas_summer'] },
    ET: { h: ['enkutatash', 'meskel'] },
    NG: { deep: 1, ex: ex(function (y) { return y >= 1999 ? 'WASSCE' : 'kỳ thi WAEC'; }) },
    GH: { ex: ex(function (y) { return y >= 1999 ? 'WASSCE' : 'kỳ thi WAEC'; }) },
    KE: { deep: 1, ex: ex(function (y) { return y >= 1989 ? 'KCSE' : 'kỳ thi cuối cấp trung học'; }) }
  };

  // Tín ngưỡng gia đình (l.religion) → lễ của chính gia đình đó, không suy từ quốc tịch.
  function faithHoliday(l) {
    var s = (l && l.religion) || '';
    if (/Hồi giáo/.test(s)) return 'eid_fitr';
    if (/Chính Thống/.test(s)) return 'pascha';
    if (/Công giáo|Tin Lành|Kitô|Anh giáo/.test(s)) return 'christmas';
    if (/Hindu/.test(s)) return 'diwali';
    if (/Do Thái/.test(s)) return 'pesach';
    if (/Sikh/.test(s)) return 'vaisakhi';
    if (/Phật giáo/.test(s) && !/Hòa Hảo/.test(s)) return 'vesak';
    return null;
  }
  function code(l) { return E.resCode ? E.resCode(l) : (l && l.abroad && l.abroad.code) || (l && l.country) || 'VN'; }
  function cname(c) { return (G.W.BY[c] || {}).name || c; }
  function year(l) { return (l.birthYear || 0) + (l.age || 0); }
  function hol(id, y) { var h = HOL[id]; return h && (!h.since || !y || y >= h.since) ? h : null; }

  function profileOf(c) {
    var p = P[c] || {}, r = REGION_OF[c];
    return {
      code: c, name: cname(c), region: r || null, regionName: r ? REGIONS[r][0] : 'Chưa phân vùng',
      level: p.deep ? 'deep' : p.h || p.ex || p.cuisine ? 'country' : 'regional',
      holidays: (p.h || []).slice(), exam: p.ex || null, school: p.sc || null, work: p.wk || null, coming: p.co || null,
      cuisine: p.cuisine || null,
      depth: p.depth || null,
      sources: (p.h || []).map(function (id) { return HOL[id].src; }).filter(function (v, i, a) { return a.indexOf(v) === i; })
    };
  }
  E.cultureProfile173 = profileOf;
  E.CULTURE173 = { REGIONS: REGIONS, REGION_OF: REGION_OF, HOL: HOL, PROFILES: P, profile: profileOf, faith: faithHoliday };

  // ---------- Lớp 3: bản sắc cá nhân ----------
  function st(l) {
    var s = l.flags.culture173;
    if (!s || typeof s !== 'object') s = l.flags.culture173 = {};
    if (!isFinite(s.tradition)) s.tradition = 60;
    if (!isFinite(s.integration)) s.integration = code(l) === l.country ? 100 : 20;
    s.festivals = s.festivals && typeof s.festivals === 'object' ? s.festivals : {};
    s.history = Array.isArray(s.history) ? s.history : [];
    s.seen = s.seen && typeof s.seen === 'object' ? s.seen : {};
    return s;
  }
  function peek(l) { return (l && l.flags && l.flags.culture173) || {}; }
  function origins(l) {
    var out = [];
    function add(c) { if (c && G.W.BY[c] && out.indexOf(c) < 0) out.push(c); }
    add(l.country);
    var anc = l.flags && l.flags.life138 && l.flags.life138.ancestry;
    (Array.isArray(anc) ? anc : []).forEach(add);
    // Nguồn gốc phải có trong hồ sơ, không suy từ bộ tên hoặc ngôn ngữ.
    return out;
  }
  function context(l) {
    var res = code(l), og = origins(l), a = l.abroad;
    var type = a ? (a.perm ? 'settled' : a.study ? 'study' : 'work') : og.some(function (c) { return c !== res; }) ? 'heritage' : 'native';
    var s = peek(l);
    return {
      birthCountry: l.country, residenceCountry: res, origins: og,
      heritage: og.filter(function (c) { return c !== res; }),
      residenceType: type, diaspora: type !== 'native',
      tradition: isFinite(s.tradition) ? s.tradition : 60, integration: isFinite(s.integration) ? s.integration : (res === l.country ? 100 : 20),
      faith: faithHoliday(l)
    };
  }
  E.culturalContext173 = context;
  var TYPE_LABEL = { native: 'sinh ra và lớn lên tại đây', heritage: 'gia đình có nguồn gốc đa văn hóa', study: 'du học / đào tạo có thời hạn', work: 'làm việc có thời hạn', settled: 'đã định cư' };

  // Ứng viên lễ hội cho một người: lễ nơi ở, lễ tín ngưỡng gia đình, lễ quê gốc (nếu còn gắn bó).
  function heritageHoliday(c, y) { var p = P[c]; var id = p && p.h && p.h[0]; return id && hol(id, y) ? id : null; }
  function candidates(l) {
    var y = year(l), ctx = context(l), out = [];
    function push(id, why, w) { if (!id || !hol(id, y) || out.some(function (x) { return x.id === id; })) return; out.push({ id: id, why: why, w: w }); }
    profileOf(ctx.residenceCountry).holidays.forEach(function (id, i) { push(id, 'local', i ? .6 : 1); });
    push(ctx.faith, 'faith', 1.4);
    if (ctx.tradition >= 25) ctx.heritage.forEach(function (c) { push(heritageHoliday(c, y), 'origin', .5 + ctx.tradition / 100); });
    if (!out.length) push('new_year_common', 'local', 1);
    return out;
  }
  E.festivalCandidates173 = candidates;

  // ---------- Lễ gia đình cho celebration129 / party148 / luxuryParty172 ----------
  E.celebrationItems173 = function (l) {
    var y = year(l), ctx = context(l), res = ctx.residenceCountry, items = [];
    var localId = profileOf(res).holidays.map(function (id) { return hol(id, y) ? id : null; }).filter(Boolean)[0];
    var mainLabel = res === 'VN' ? 'Đón Tết cùng gia đình' : localId ? HOL[localId].menu : ctx.faith ? HOL[ctx.faith].menu : 'Sum họp lễ gia đình';
    items.push(['tet', mainLabel, .08]);
    if (ctx.faith && ctx.faith !== localId && mainLabel !== HOL[ctx.faith].menu) items.push(['faith173', HOL[ctx.faith].menu, .06]);
    if (ctx.tradition >= 25) {
      var used = items.map(function (x) { return x[1]; });
      ctx.heritage.some(function (c) {
        var id = heritageHoliday(c, y); if (!id) return false;
        var label = c === 'VN' ? 'Giữ Tết cổ truyền Việt Nam nơi đất khách' : 'Giữ ' + HOL[id].n + ' theo truyền thống gia đình';
        if (used.indexOf(label) >= 0 || id === localId || id === ctx.faith) return false;
        items.push(['origin173', label, .06]); return true;
      });
    }
    items.push(['birthday', 'Mừng sinh nhật người thân', .04], ['wedding', 'Dự cưới họ hàng', .06]);
    return items;
  };
  E.partyHolidayLabel173 = function (l, fallback) {
    var res = code(l);
    if (res === 'VN') return fallback || 'Gặp mặt gia đình / lễ Tết';
    var y = year(l), ids = profileOf(res).holidays.filter(function (id) { return hol(id, y); }), f = faithHoliday(l);
    var id = ids[0] || f;
    return 'Gặp mặt gia đình' + (id ? ' / ' + HOL[id].party : ' / dịp lễ của gia đình');
  };

  // ---------- Bộ sinh số tất định (không tiêu hao RNG chung của đời người) ----------
  function hash(x) { var n = 2166136261; String(x).split('').forEach(function (ch) { n = Math.imul(n ^ ch.charCodeAt(0), 16777619); }); return n >>> 0; }
  function roll(l, key) { return hash((l.id || l.name || '') + ':' + key + ':' + l.age) / 4294967296; }
  function ok(l) { return l && l.alive && ['vn', 'world'].indexOf(l.mode) >= 0 && E.FAMILY53 && E.FAMILY53.free(l) && !(l.jailUntil != null && l.age < l.jailUntil); }
  function adult(l) { return l.age >= 18 && l.indep; }
  function cost(l, rate) { return adult(l) ? l.base * rate : 0; }
  function pay(l, rate, label, r, log) {
    if (!rate) return true;
    if (E.LIFE138 && E.LIFE138.fund) return E.LIFE138.fund(l, rate, label, r, log);
    if (l.money < l.base * rate) { log('Chưa đủ tiền cho ' + label + '.', 'neutral'); return false; }
    H.cash(l, -l.base * rate, label); return true;
  }
  function stress(l, d) { if (l.mind && isFinite(l.mind.stress)) l.mind.stress = U.clamp(l.mind.stress + d, 0, 100); }
  function note(l, text) { var s = st(l); s.history.push({ age: l.age, year: year(l), text: text }); if (s.history.length > 24) s.history.shift(); }
  function queue(l, id, r, arg) { return C.queue(l, id, r, arg || {}, { manual: false }); }

  // ---------- Lễ hội tương tác ----------
  function festivalWhy(l) { return ok(l) && l.age >= 4 ? true : 'Chưa phù hợp'; }
  function festivalPick(l) {
    var list = candidates(l); if (!list.length) return null;
    var s = peek(l), tot = 0;
    list.forEach(function (x) { x.ww = x.w / (1 + ((s.festivals || {})[x.id] || 0) * .15); tot += x.ww; });
    var t = roll(l, 'festival-pick') * tot;
    for (var i = 0; i < list.length; i++) { t -= list[i].ww; if (t <= 0) return list[i]; }
    return list[list.length - 1];
  }
  function selectedFestival(l, a) {
    if (!a || !a.id) return festivalPick(l);
    return candidates(l).filter(function (x) { return x.id === a.id && x.why === (a.kind || 'local'); })[0] || null;
  }
  function attend(l, id, kind) {
    var s = st(l), first = !s.festivals[id];
    s.localFestivals = s.localFestivals || {};
    if (kind === 'local') {
      var cc = code(l); s.localFestivals[cc] = s.localFestivals[cc] || {};
      s.localFestivalYears = s.localFestivalYears || {}; s.localFestivalYears[cc] = s.localFestivalYears[cc] || {};
      var years = s.localFestivalYears[cc][id] || (s.localFestivalYears[cc][id] = []);
      if (years.indexOf(year(l)) < 0) years.push(year(l));
      s.localFestivals[cc][id] = years.length;
    }
    s.festivals[id] = (s.festivals[id] || 0) + 1; s.festAt = l.age;
    if (kind === 'origin') s.tradition = U.clamp(s.tradition + 4, 0, 100);
    if (kind === 'local' && code(l) !== l.country) s.integration = U.clamp(s.integration + 4, 0, 100);
    if (first) H.mem(l, 'Lần đầu ' + (kind === 'origin' ? 'giữ ' : 'đón ') + HOL[id].n + ' tại ' + cname(code(l)) + '.', 3);
  }
  C.incident('world_festival173', 'Dịp lễ trong năm', festivalWhy, function (l, d) {
    var a = d && d.arg || {}, pick = selectedFestival(l, a);
    var h = pick && HOL[pick.id]; if (!h) return 'Dịp lễ đã qua.';
    var why = pick.why === 'origin' ? 'Gia đình bạn vẫn giữ lễ của quê gốc dù đang sống tại ' + cname(code(l)) + '.' : pick.why === 'faith' ? 'Đây là dịp lễ theo tín ngưỡng của gia đình bạn.' : 'Dịp lễ quen thuộc tại ' + cname(code(l)) + '.';
    return h.n + '. ' + why + ' Mọi người thường ' + h.t + '. Mỗi gia đình đón lễ theo cách riêng; bạn có thể tham gia nhiều hay ít tùy hoàn cảnh.';
  }, function (l, a) {
    var pick = selectedFestival(l, a);
    var h = pick && HOL[pick.id]; if (!h) return [];
    var fid = pick.id, fkind = pick.why;
    var c1 = cost(l, .02), c2 = cost(l, .04);
    return [
      { k: 'community', l: 'Cùng mọi người tham gia hoạt động ' + h.n + (c1 ? ' · ' + H.money(l, c1) : ''), h: 'Hạnh phúc +4 · quan hệ +4', why: !c1 || l.money >= c1 ? true : 'Chưa đủ tiền', run: function (l, r, log) { if (c1 && !pay(l, .02, h.n, r, log)) return; attend(l, fid, fkind); H.fx(l, { hap: 4, soc: 4 }); log('Bạn cùng mọi người ' + h.t + '. ' + h.n + ' năm nay để lại nhiều kỷ niệm.', 'good'); } },
      { k: 'home', l: 'Đón lễ giản dị tại nhà cùng người thân', h: 'Không tốn thêm tiền · hạnh phúc +3 · gắn kết gia đình', run: function (l, r, log) { attend(l, fid, fkind); H.fx(l, { hap: 3, soc: 1 }); log('Cả nhà đón ' + h.n + ' giản dị tại nhà. Không cần chi nhiều, điều quý là có nhau.', 'good'); } },
      { k: 'host', l: 'Mời bạn bè, hàng xóm cùng chung vui' + (c2 ? ' · ' + H.money(l, c2) : ''), h: 'Quan hệ +6 · hạnh phúc +3', why: l.age < 12 ? 'Cần lớn hơn để tự mời khách' : !c2 || l.money >= c2 ? true : 'Chưa đủ tiền', run: function (l, r, log) { if (c2 && !pay(l, .04, 'Mời khách dịp ' + h.n, r, log)) return; attend(l, fid, fkind); st(l).integration = U.clamp(st(l).integration + 2, 0, 100); H.fx(l, { soc: 6, hap: 3 }); log('Bạn mời bạn bè, hàng xóm cùng đón ' + h.n + '. Mọi người kể cho nhau nghe phong tục của gia đình mình.', 'good'); } },
      { k: 'rest', l: 'Nghỉ ngơi, không tham gia năm nay', h: 'Không thay đổi lớn', run: function (l, r, log) { st(l).festAt = l.age; H.fx(l, { hea: 1 }); log('Bạn dành kỳ nghỉ ' + h.n + ' để nghỉ ngơi. Không tham gia lễ hội cũng là một lựa chọn bình thường.', 'neutral'); } }
    ];
  });

  // ---------- Đời sống học đường theo quốc gia ----------
  var SCHOOL = {
    jp: { min: 12, max: 17, title: 'Câu lạc bộ sau giờ học (bukatsu)', text: 'Trường trung học tại Nhật thường có câu lạc bộ thể thao và văn hóa sinh hoạt sau giờ học; tham gia hay không tùy học sinh và trường.', o: [['sport', 'Vào câu lạc bộ thể thao, tập luyện đều', { hea: 3, soc: 2 }, 2], ['culture', 'Vào câu lạc bộ văn hóa: âm nhạc, mỹ thuật hoặc khoa học', { kno: 2, hap: 2 }, 1], ['home', 'Về nhà sớm (kitaku-bu), tự sắp xếp thời gian', { hap: 2, hea: 1 }, -1]] },
    kr: { min: 12, max: 17, title: 'Học thêm buổi tối (hagwon) hay giữ sức', text: 'Nhiều học sinh Hàn Quốc học thêm ở hagwon buổi tối; mức độ khác nhau theo gia đình và mục tiêu.', o: [['hagwon', 'Học hagwon để chuẩn bị kỳ thi', { kno: 3 }, 4, .03], ['balance', 'Học vừa sức, giữ một sở thích riêng', { kno: 1, hap: 2 }, 0], ['self', 'Tự học ở nhà, ngủ đủ giấc', { kno: 1, hea: 2 }, -1]] },
    cn: { min: 15, max: 17, title: 'Giờ tự học buổi tối ở trường cấp ba', text: 'Nhiều trường cấp ba ở Trung Quốc có giờ tự học buổi tối để ôn tập; cường độ khác nhau theo trường và vùng.', o: [['stay', 'Ở lại tự học tập trung', { kno: 3, hea: -1 }, 3], ['group', 'Lập nhóm học cùng bạn', { kno: 2, soc: 2 }, 1], ['sport', 'Giữ giờ chơi thể thao sau giờ học', { hea: 2, hap: 1 }, -1]] },
    us: { min: 13, max: 17, title: 'Hoạt động ngoại khóa', text: 'Ở nhiều trường trung học, hoạt động ngoại khóa như thể thao, tranh biện, nhạc kịch hay tình nguyện là phần quen thuộc của đời sống học đường.', o: [['team', 'Vào đội thể thao của trường', { hea: 3, soc: 2 }, 2], ['debate', 'Tham gia câu lạc bộ tranh biện hoặc khoa học', { kno: 3 }, 1], ['volunteer', 'Đi tình nguyện ở cộng đồng', { soc: 2, karma: 2 }, 0], ['job', 'Làm thêm cuối tuần', { soc: 1 }, 1]] },
    gb: { min: 14, max: 15, title: 'Chọn môn GCSE', text: 'Học sinh ở Anh thường chọn một số môn tự chọn cho chương trình GCSE từ khoảng 14 tuổi.', since: 1988, o: [['science', 'Chọn thêm khoa học và toán', { kno: 3 }, 2], ['arts', 'Chọn nghệ thuật, âm nhạc hoặc kịch', { hap: 3 }, 0], ['lang', 'Chọn thêm ngoại ngữ và nhân văn', { kno: 2, soc: 1 }, 1]] },
    de: { min: 10, max: 10, title: 'Chọn loại trường sau tiểu học', text: 'Ở Đức, sau tiểu học (thường hết lớp 4) học sinh chuyển sang các loại trường khác nhau như Gymnasium, Realschule hay Gesamtschule; quy định khác nhau theo từng bang.', o: [['gym', 'Theo Gymnasium, hướng tới Abitur', { kno: 2 }, 2], ['real', 'Theo Realschule, mở đường học nghề kép', { kno: 1, hap: 1 }, 0], ['gesamt', 'Theo Gesamtschule, quyết định sau', { soc: 1, hap: 1 }, 0]] },
    fr: { min: 15, max: 15, title: 'Định hướng vào lycée', text: 'Cuối collège, học sinh Pháp được định hướng vào lycée phổ thông, công nghệ hoặc nghề.', o: [['general', 'Lycée phổ thông', { kno: 2 }, 1], ['techno', 'Lycée công nghệ', { kno: 1, hap: 1 }, 0], ['pro', 'Lycée nghề, sớm thực hành', { hap: 2 }, -1]] },
    in: { min: 14, max: 17, title: 'Lớp luyện thi (coaching) cho kỳ thi lớn', text: 'Nhiều học sinh Ấn Độ học thêm ở trung tâm luyện thi trước các kỳ thi lớp 10, lớp 12 và thi đầu vào.', o: [['coach', 'Học trung tâm luyện thi', { kno: 3 }, 4, .03], ['peer', 'Học nhóm với bạn bè', { kno: 2, soc: 1 }, 1], ['steady', 'Tự ôn đều, giữ nhịp sinh hoạt', { kno: 1, hea: 1 }, 0]] },
    generic: { min: 11, max: 17, title: 'Một dự án ở trường', text: 'Lớp bạn có một dự án chung và vài câu lạc bộ đang tuyển thành viên.', o: [['club', 'Tham gia câu lạc bộ của trường', { soc: 2, hap: 1 }, 1], ['project', 'Nhận phần việc chính trong dự án', { kno: 2 }, 2], ['light', 'Làm phần vừa sức, dành thời gian nghỉ', { hap: 2 }, 0]] }
  };
  function schoolKey(l) { var k = profileOf(code(l)).school || 'generic', d = SCHOOL[k]; return d && (!d.since || year(l) >= d.since) ? k : 'generic'; }
  function inSchool(l) { return !!l.school && ['uni', 'post', 'phd', 'police', 'abroad'].indexOf(l.school) < 0; }
  function schoolWhy(l) { var d = SCHOOL[schoolKey(l)]; return ok(l) && !H.inVN(l) && inSchool(l) && l.age >= d.min && l.age <= d.max ? true : 'Chưa phù hợp'; }
  C.incident('world_school173', 'Đời sống học đường', schoolWhy, function (l) { var d = SCHOOL[schoolKey(l)]; return d.title + ' · ' + cname(code(l)) + '. ' + d.text; }, function (l) {
    var key = schoolKey(l), d = SCHOOL[key];
    return d.o.map(function (o) {
      return { k: o[0], l: o[1] + (o[4] ? ' · gia đình chi ' + H.money(l, l.base * o[4]) : ''), run: function (l, r, log) {
        if (o[4] && !pay(l, o[4], d.title, r, log)) return;
        var s = st(l); s.seen.school = l.age; s.schoolChoice = { key: key, choice: o[0], age: l.age };
        H.fx(l, o[2]); stress(l, o[3]); note(l, d.title + ': ' + o[1]);
        log(d.title + ': ' + o[1].toLowerCase() + '. ' + (o[3] >= 3 ? 'Lịch học dày hơn, cần giữ giờ nghỉ.' : 'Bạn có thêm trải nghiệm ở trường.'), 'good');
      } };
    });
  });

  // ---------- Kỳ thi cuối cấp theo quốc gia ----------
  function examName(l) { var p = profileOf(code(l)); var n = p.exam ? p.exam(year(l)) : 'kỳ thi / đánh giá cuối cấp trung học'; return n; }
  function examWhy(l) { var s = peek(l); return ok(l) && !H.inVN(l) && inSchool(l) && l.age === 17 && !s.exam && !!examName(l) ? true : 'Chưa phù hợp'; }
  function examRun(l, r, log, k, bonus, fx, rate) {
    if (rate && !pay(l, rate, 'Luyện thi', r, log)) return;
    var name = examName(l), score = (l.st.kno || 50) * .6 + bonus + r() * 30;
    var res = score >= 75 ? 'xuất sắc' : score >= 58 ? 'tốt' : score >= 40 ? 'đạt' : 'chưa như kỳ vọng';
    st(l).exam = { name: name, year: year(l), result: res, country: code(l), prep: k };
    H.fx(l, fx); H.fx(l, { hap: res === 'chưa như kỳ vọng' ? -3 : res === 'xuất sắc' ? 4 : 1 });
    H.mem(l, name + ' tại ' + cname(code(l)) + ': kết quả ' + res + '.', 3); note(l, name + ': ' + res);
    log(name + ': kết quả ' + res + ' (mô phỏng). Kết quả ghi vào hồ sơ, không thay thế điều kiện tốt nghiệp hay tuyển sinh của game; vẫn còn nhiều con đường sau phổ thông.', res === 'chưa như kỳ vọng' ? 'neutral' : 'good');
  }
  C.incident('world_exam173', 'Kỳ thi cuối cấp', examWhy, function (l) { return examName(l) + ' · ' + cname(code(l)) + '. Đây là giai đoạn ôn tập quan trọng của năm cuối trung học. Cách chuẩn bị ảnh hưởng đến kết quả và sức khỏe.'; }, function (l) {
    return [
      { k: 'plan', l: 'Ôn tập theo kế hoạch, ngủ đủ', run: function (l, r, log) { examRun(l, r, log, 'plan', 8, { kno: 1 }); } },
      { k: 'cram', l: 'Ôn cấp tốc, thức khuya', run: function (l, r, log) { stress(l, 6); examRun(l, r, log, 'cram', 11, { hea: -2 }); } },
      { k: 'tutor', l: 'Học lớp luyện thi · gia đình chi ' + H.money(l, l.base * .03), run: function (l, r, log) { examRun(l, r, log, 'tutor', 10, { kno: 2 }, .03); } },
      { k: 'calm', l: 'Giữ nhịp bình thường, không ép bản thân', run: function (l, r, log) { examRun(l, r, log, 'calm', 3, { hap: 1 }); } }
    ];
  });

  // ---------- Nghi thức trưởng thành ----------
  function coming(l) {
    var c = code(l), p = profileOf(c), y = year(l), latin = LATIN_QUINCE.indexOf(c) >= 0 || (c === 'US' && /^es_la/.test(String(l.pool || '')));
    if (/Do Thái/.test(l.religion || '')) return { key: 'mitzvah', age: 13, name: l.sex === 'F' ? 'Bat Mitzvah' : 'Bar Mitzvah', text: 'Theo truyền thống Do Thái giáo, thiếu niên đánh dấu tuổi trưởng thành tôn giáo bằng nghi lễ tại giáo đường.', paid: .04 };
    if (p.coming === 'jp' && y >= 1948) return { key: 'seijin', age: 20, name: 'Lễ Thành nhân (Seijin-shiki)', text: 'Nhiều địa phương ở Nhật tổ chức lễ cho thanh niên tròn 20 tuổi quanh Ngày Thành nhân tháng 1' + (y >= 2022 ? '; tuổi trưởng thành theo luật đã hạ xuống 18 từ năm 2022, nhưng nhiều nơi vẫn tổ chức lễ cho người 20 tuổi.' : '.'), paid: .03 };
    if (p.coming === 'kr' && y >= 1973) return { key: 'seongnyeon', age: y >= 2013 ? 19 : 20, name: 'Ngày Trưởng thành (Seongnyeon-ui nal)', text: 'Hàn Quốc có Ngày Trưởng thành vào thứ Hai tuần thứ ba của tháng 5; nhiều người nhận hoa, nước hoa và lời chúc từ gia đình.', paid: .01 };
    if (latin && l.sex === 'F') return { key: 'quince', age: 15, name: 'Quinceañera (sinh nhật tuổi 15)', text: 'Ở nhiều gia đình Mỹ Latinh, sinh nhật 15 tuổi của con gái là dịp lễ lớn; quy mô rất khác nhau, từ bữa cơm gia đình đến buổi tiệc có điệu vals.', paid: .06 };
    if (c === 'VN') return null;
    return { key: 'eighteen', age: 18, name: 'Sinh nhật tuổi 18', text: 'Tuổi 18 là cột mốc trưởng thành quen thuộc với nhiều gia đình; cách đánh dấu tùy mỗi nhà.', paid: .02 };
  }
  E.comingOfAge173 = coming;
  function comingWhy(l) { var c = coming(l); return ok(l) && c && l.age === c.age && !(peek(l).coming) ? true : 'Chưa phù hợp'; }
  C.incident('world_coming173', 'Cột mốc trưởng thành', comingWhy, function (l) { var c = coming(l); return c ? c.name + '. ' + c.text : 'Cột mốc đã qua.'; }, function (l) {
    var c = coming(l); if (!c) return [];
    function done(l, style, fx, text) { st(l).coming = { key: c.key, name: c.name, age: l.age, style: style }; H.fx(l, fx); H.mem(l, c.name + ': ' + text, 4); note(l, c.name); }
    return [
      { k: 'ceremony', l: (c.key === 'mitzvah' ? 'Chuẩn bị và tham dự nghi lễ tại giáo đường' : 'Tổ chức / tham dự lễ chính thức') + ' · ' + H.money(l, l.base * c.paid), run: function (l, r, log) { if (!pay(l, c.paid, c.name, r, log)) return; done(l, 'ceremony', { hap: 5, soc: 3 }, 'một ngày đáng nhớ cùng gia đình và bạn bè.'); log(c.name + ': bạn cùng gia đình đánh dấu cột mốc này. Kỷ niệm sẽ theo bạn lâu dài.', 'big'); } },
      { k: 'family', l: 'Bữa cơm ấm cúng cùng gia đình', h: 'Không tốn thêm tiền', run: function (l, r, log) { done(l, 'family', { hap: 4 }, 'bữa cơm giản dị, nhiều lời chúc.'); log(c.name + ': cả nhà quây quần, nói về những dự định phía trước.', 'good'); } },
      { k: 'friends', l: 'Đi chơi cùng bạn thân', h: 'Không tốn thêm tiền', run: function (l, r, log) { done(l, 'friends', { hap: 3, soc: 3 }, 'một buổi đi chơi cùng bạn bè.'); log('Bạn đánh dấu ' + c.name.toLowerCase() + ' bằng buổi đi chơi cùng bạn thân.', 'good'); } },
      { k: 'quiet', l: 'Không tổ chức gì đặc biệt', run: function (l, r, log) { done(l, 'quiet', {}, 'một ngày như bao ngày.'); log('Bạn không tổ chức gì đặc biệt; trưởng thành không phụ thuộc vào một buổi lễ.', 'neutral'); } }
    ];
  });

  // ---------- Văn hóa nơi làm việc ----------
  var WORK = {
    jp: { title: 'Buổi liên hoan sau giờ làm (nomikai)', text: function (y) { return 'Phòng bạn rủ đi liên hoan sau giờ làm. Nhiều công ty Nhật có thói quen này, nhưng tham gia không bắt buộc.' + (y >= 2019 ? ' Từ năm 2019, luật cải cách cách làm việc đặt giới hạn giờ làm thêm.' : ''); }, o: [['join', 'Đi cùng một lúc rồi xin phép về', { soc: 3 }, 2, 1], ['tea', 'Đề xuất ăn trưa chung thay vì uống buổi tối', { soc: 2, hap: 1 }, 1, 0], ['decline', 'Từ chối lịch sự, giữ thời gian riêng', { hap: 2 }, 0, -1]] },
    kr: { title: 'Liên hoan công ty (hoesik)', text: function (y) { return 'Bộ phận tổ chức hoesik sau giờ làm.' + (y >= 2018 ? ' Từ năm 2018, giới hạn 52 giờ làm mỗi tuần được áp dụng dần theo quy mô doanh nghiệp.' : '') + ' Mức độ tham gia khác nhau theo công ty.'; }, o: [['join', 'Tham gia, giữ chừng mực', { soc: 3 }, 2, 1], ['early', 'Dự phần đầu rồi về sớm', { soc: 1, hea: 1 }, 1, 0], ['decline', 'Báo trước là bận việc gia đình', { hap: 1 }, 0, -1]] },
    fr: { title: 'Tin nhắn công việc ngoài giờ', text: function (y) { return 'Quản lý gửi email lúc tối muộn.' + (y >= 2017 ? ' Từ năm 2017, luật lao động Pháp ghi nhận quyền ngắt kết nối ngoài giờ ở các doanh nghiệp lớn.' : '') ; }, o: [['next', 'Trả lời vào sáng hôm sau', { hap: 2 }, 1, 0], ['now', 'Trả lời ngay để xong việc', { hea: -1 }, 1, 2], ['talk', 'Đề xuất thỏa thuận giờ liên lạc của nhóm', { soc: 2 }, 2, -1]] },
    de: { title: 'Hội đồng người lao động (Betriebsrat)', text: function () { return 'Công ty sắp bầu hội đồng người lao động. Ở Đức, Betriebsrat đại diện nhân viên trong các vấn đề như giờ làm và điều kiện làm việc.'; }, o: [['run', 'Ứng cử vào hội đồng', { soc: 3, kno: 1 }, 3, 2], ['vote', 'Đi bầu và theo dõi hoạt động', { soc: 1 }, 1, 0], ['skip', 'Tập trung vào công việc của mình', { hap: 1 }, 0, 0]] },
    se: { title: 'Giờ fika ở văn phòng', text: function () { return 'Đồng nghiệp rủ nghỉ uống cà phê và ăn bánh (fika), một thói quen quen thuộc ở nhiều nơi làm việc tại Thụy Điển.'; }, o: [['join', 'Ngồi fika, trò chuyện với đồng nghiệp', { soc: 3, hap: 1 }, 2, -1], ['brief', 'Ghé một lát rồi quay lại việc', { soc: 1 }, 1, 0], ['skip', 'Tiếp tục làm cho xong việc', { kno: 1 }, 0, 1]] },
    us: { title: 'Buổi kết nối nghề nghiệp', text: function () { return 'Công ty mời tham gia một buổi networking với các phòng ban và đối tác. Nhiều người dùng dịp này để giới thiệu dự án của mình.'; }, o: [['pitch', 'Chuẩn bị giới thiệu dự án của mình', { soc: 2, kno: 1 }, 3, 1], ['listen', 'Tham gia, chủ yếu lắng nghe', { soc: 1, kno: 1 }, 1, 0], ['skip', 'Không tham gia, về nhà nghỉ', { hap: 1 }, 0, -1]] },
    generic: { title: 'Làm quen văn hóa nơi làm việc', text: function () { return 'Nơi làm việc có những quy tắc ngầm về giờ giấc, cách họp và cách góp ý. Bạn chọn cách thích nghi.'; }, o: [['observe', 'Quan sát và hỏi đồng nghiệp lâu năm', { soc: 2, kno: 1 }, 2, 0], ['propose', 'Đề xuất cải tiến một quy trình', { kno: 2 }, 2, 1], ['keep', 'Giữ cách làm việc quen thuộc', { hap: 1 }, 0, 0]] }
  };
  function workKey(l) { return profileOf(code(l)).work || 'generic'; }
  function workWhy(l) { return ok(l) && l.job && !l.retired && l.age >= 20 && l.age <= 65 && !H.inVN(l) ? true : 'Chưa phù hợp'; }
  C.incident('world_workplace173', 'Văn hóa nơi làm việc', workWhy, function (l) { var w = WORK[workKey(l)]; return w.title + ' · ' + cname(code(l)) + '. ' + w.text(year(l)) + ' Đây là tình huống mô phỏng, không mô tả mọi nơi làm việc của quốc gia này.'; }, function (l) {
    var w = WORK[workKey(l)];
    return w.o.map(function (o) {
      return { k: o[0], l: o[1], run: function (l, r, log) {
        var s = st(l); s.seen.work = l.age; if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + o[3], 0, 100);
        if (code(l) !== l.country) s.integration = U.clamp(s.integration + 3, 0, 100);
        H.fx(l, o[2]); stress(l, o[4]); note(l, w.title + ': ' + o[1]);
        log(w.title + ': ' + o[1].toLowerCase() + '. ' + (o[3] >= 2 ? 'Đồng nghiệp ghi nhận sự chủ động của bạn; thăng tiến vẫn phụ thuộc năng lực.' : 'Công việc tiếp tục bình thường.'), 'neutral');
      } };
    });
  });

  // ---------- Hòa nhập khi sống xa quê ----------
  function integrationWhy(l) { return ok(l) && l.age >= 12 && code(l) !== l.country ? true : 'Chưa phù hợp'; }
  C.incident('world_integration173', 'Thích nghi với nơi ở mới', integrationWhy, function (l) {
    var s = st(l), c = context(l);
    return 'Bạn đang sống tại ' + cname(c.residenceCountry) + ' (' + TYPE_LABEL[c.residenceType] + '), quê gốc ở ' + cname(l.country) + '. Mức hòa nhập ' + Math.round(s.integration) + '/100, gắn bó truyền thống ' + Math.round(s.tradition) + '/100. Không có cách thích nghi nào đúng cho mọi người.';
  }, function (l) {
    var c1 = cost(l, .02);
    return [
      { k: 'language', l: 'Học ngôn ngữ và phong tục địa phương' + (c1 ? ' · ' + H.money(l, c1) : ''), h: 'Hòa nhập +15', why: !c1 || l.money >= c1 ? true : 'Chưa đủ tiền', run: function (l, r, log) { if (c1 && !pay(l, .02, 'Lớp ngôn ngữ và văn hóa', r, log)) return; var s = st(l); s.integration = U.clamp(s.integration + 15, 0, 100); s.seen.integration = l.age; H.fx(l, { kno: 2, soc: 1 }); note(l, 'Học ngôn ngữ tại ' + cname(code(l))); log('Bạn học thêm ngôn ngữ và phong tục nơi ở mới; giao tiếp hằng ngày dần tự tin hơn.', 'good'); } },
      { k: 'community', l: 'Tìm đến cộng đồng đồng hương', h: 'Truyền thống +10 · quan hệ +3', run: function (l, r, log) { var s = st(l); s.tradition = U.clamp(s.tradition + 10, 0, 100); s.integration = U.clamp(s.integration + 3, 0, 100); s.seen.integration = l.age; H.fx(l, { soc: 3, hap: 2 }); note(l, 'Kết nối cộng đồng người ' + cname(l.country)); log('Bạn gặp những người cùng quê ở ' + cname(code(l)) + '. Có người chia sẻ kinh nghiệm thuê nhà, tìm việc và giữ phong tục gia đình.', 'good'); } },
      { k: 'both', l: 'Giữ nếp nhà, đồng thời kết bạn với người địa phương', h: 'Hòa nhập +8 · truyền thống +5', run: function (l, r, log) { var s = st(l); s.integration = U.clamp(s.integration + 8, 0, 100); s.tradition = U.clamp(s.tradition + 5, 0, 100); s.seen.integration = l.age; H.fx(l, { soc: 2, hap: 2 }); note(l, 'Cân bằng hai nền văn hóa'); log('Bạn vẫn nấu món quê, giữ ngày lễ của gia đình và cũng nhận lời mời của bạn bè địa phương.', 'good'); } },
      { k: 'alone', l: 'Thu mình, chỉ lo học tập / công việc', h: 'Căng thẳng tăng nhẹ', run: function (l, r, log) { var s = st(l); s.seen.integration = l.age; stress(l, 4); H.fx(l, { hap: -1 }); log('Bạn tập trung vào việc chính, ít giao lưu. Cảm giác xa lạ có thể kéo dài nếu không có ai để chia sẻ.', 'neutral'); } }
    ];
  });

  // ---------- Hệ quả dài hạn và kích hoạt hằng năm ----------
  E.HOOKS.year.push(function (l, r, log) {
    if (!ok(l)) return;
    var s = peek(l), y = year(l), res = code(l);
    if (s.yearAt === l.age) return;
    if (l.flags.culture173) l.flags.culture173.yearAt = l.age;
    // Hệ quả dài hạn của mức hòa nhập / gắn bó truyền thống khi sống xa quê.
    if (res !== l.country && l.flags.culture173) {
      var q = st(l);
      if (q.integration >= 70 && roll(l, 'int-good') < .25) H.fx(l, { soc: 1, hap: 1 });
      if (q.integration < 25 && l.age >= 16 && roll(l, 'int-low') < .25) { H.fx(l, { hap: -1 }); stress(l, 2); }
      if (!q.festAt || l.age - q.festAt > 5) q.tradition = U.clamp(q.tradition - 1, 0, 100);
      if (q.lastRes !== res) { if (q.lastRes) note(l, 'Chuyển đến ' + cname(res)); q.lastRes = res; }
    }
    var fireFest = !H.inVN(l) || context(l).heritage.length;
    if (l.age >= 4 && fireFest && (!s.festAt || l.age - s.festAt >= 1) && roll(l, 'festival') < .3) {
      var pick = festivalPick(l); if (pick) queue(l, 'world_festival173', r, { id: pick.id, kind: pick.why });
    }
    if (schoolWhy(l) === true && (s.seen ? s.seen.school == null || l.age - s.seen.school >= 3 : true) && roll(l, 'school') < .3) queue(l, 'world_school173', r);
    if (examWhy(l) === true && roll(l, 'exam') < .85) queue(l, 'world_exam173', r);
    if (comingWhy(l) === true && roll(l, 'coming') < .8) queue(l, 'world_coming173', r);
    if (workWhy(l) === true && (!s.seen || s.seen.work == null || l.age - s.seen.work >= 4) && roll(l, 'work') < .12) queue(l, 'world_workplace173', r);
    if (integrationWhy(l) === true && (!s.seen || s.seen.integration == null || l.age - s.seen.integration >= 3) && roll(l, 'integration') < .3) queue(l, 'world_integration173', r);
    if (y && !l.flags.culture173 && res !== l.country) st(l);
  });

  // ---------- Đời sống học đường: dòng nhật ký theo quốc gia ----------
  var LINES = {
    jp: ['Một năm học với giờ sinh hoạt câu lạc bộ sau tan trường.', 'Cả lớp chia ca trực nhật, tự dọn lớp học cuối ngày.', 'Lễ hội văn hóa của trường (bunkasai) bận rộn mà vui.'],
    kr: ['Những buổi tối ở thư viện và lớp học thêm.', 'Hội thao của trường, cả lớp cổ vũ đến khản giọng.', 'Một năm học dày lịch kiểm tra.'],
    cn: ['Một năm học với giờ tự học buổi tối.', 'Buổi chào cờ sáng thứ Hai và bài thể dục giữa giờ.', 'Cả lớp ôn tập cho các kỳ kiểm tra cuối học kỳ.'],
    us: ['Mùa giải thể thao của trường, khán đài đông kín cuối tuần.', 'Hội chợ khoa học, bạn mang mô hình tự làm đến trưng bày.', 'Một năm học với nhiều hoạt động ngoại khóa.'],
    gb: ['Đồng phục, giờ ra chơi và những buổi họp toàn trường.', 'Ngày thể thao (sports day) của trường.', 'Một năm học ổn định với các bài kiểm tra định kỳ.'],
    de: ['Một năm học có nhiều giờ thảo luận nhóm.', 'Chuyến dã ngoại cùng lớp (Klassenfahrt).', 'Kỳ thực tập ngắn tìm hiểu nghề nghiệp.'],
    fr: ['Bữa trưa ở căng tin và giờ thảo luận văn học.', 'Chuyến tham quan bảo tàng cùng lớp.', 'Một năm học với nhiều bài luận.'],
    in: ['Một năm học xoay quanh các bài kiểm tra định kỳ.', 'Ngày hội thể thao và văn nghệ hằng năm của trường.', 'Những buổi học nhóm trước kỳ thi.'],
    generic: ['Một năm đi học bình thường.', 'Kết thêm vài người bạn mới trong lớp.', 'Một năm học có cả điểm tốt lẫn bài khó.']
  };
  E.worldSchoolLine173 = function (l, a, r) {
    var k = profileOf(code(l)).school || 'generic', arr = LINES[k] || LINES.generic;
    var i = typeof r === 'function' ? Math.floor(r() * arr.length) : 0;
    return arr[Math.min(arr.length - 1, Math.max(0, i))];
  };

  // ---------- Hồ sơ nhân vật ----------
  var profile = E.profile;
  E.profile = function (l) {
    var p = profile.apply(this, arguments);
    if (!l || ['vn', 'world'].indexOf(l.mode) < 0 || !p) return p;
    var c = context(l), s = peek(l), pr = profileOf(c.residenceCountry);
    var fest = Object.keys(s.festivals || {}).sort(function (a, b) { return s.festivals[b] - s.festivals[a]; }).slice(0, 4).map(function (id) { return HOL[id] ? HOL[id].n + ' ×' + s.festivals[id] : null; }).filter(Boolean);
    p.culture173 = { birthCountry: c.birthCountry, residenceCountry: c.residenceCountry, residenceType: c.residenceType, origins: c.origins, tradition: c.tradition, integration: c.integration, festivals: fest, profileLevel: pr.level, region: pr.regionName };
    p.jobInfo = p.jobInfo || [];
    if (c.diaspora || c.residenceCountry !== 'VN') p.jobInfo.push('Bản sắc và cư trú: gốc ' + c.origins.map(cname).join(' – ') + ' · đang sống tại ' + cname(c.residenceCountry) + ' (' + TYPE_LABEL[c.residenceType] + ')' + (c.diaspora ? ' · gắn bó truyền thống ' + Math.round(c.tradition) + '/100 · hòa nhập ' + Math.round(c.integration) + '/100' : ''));
    if (fest.length) p.jobInfo.push('Lễ hội đã tham gia: ' + fest.join(', '));
    if (s.coming) p.jobInfo.push('Cột mốc trưởng thành: ' + s.coming.name + ' (' + s.coming.age + ' tuổi)');
    if (s.exam) { p.edu = p.edu || []; p.edu.push(s.exam.name + ' · ' + cname(s.exam.country) + ' · ' + s.exam.result + ' (mô phỏng)'); }
    return p;
  };

  // ---------- Tương thích bản lưu ----------
  C.wrap('celebration129', function (old, l, d, k, r, log) {
    var key = d && d.data && d.data.keys && d.data.keys[+k] || '';
    var out = old(l, d, k, r, log);
    if (d && d.data && d.data.done && /^(tet|faith173|origin173)/.test(key)) {
      var y = year(l), ctx = context(l), res = ctx.residenceCountry;
      var localId = profileOf(res).holidays.map(function (id) { return hol(id, y) ? id : null; }).filter(Boolean)[0] || ctx.faith || 'new_year_common';
      if (/^origin173/.test(key)) {
        var origId = ctx.heritage.map(function (c) { return heritageHoliday(c, y); }).filter(Boolean)[0];
        if (origId) attend(l, origId, 'origin');
      } else if (/^faith173/.test(key) && ctx.faith) attend(l, ctx.faith, 'faith');
      else if (localId) attend(l, localId, 'local');
    }
    return out;
  });
  var migrateExt = E.migrateExt;
  E.migrateExt = function (l) {
    if (migrateExt) migrateExt(l);
    (l.pending || []).forEach(function (d) {
      if (d && d.manual && /^world_(festival|school|exam|coming|workplace|integration)173$/.test(d.id) && !(d.data && d.data.requested)) d.manual = false;
    });
  };
  var migrate = E.migrate;
  if (migrate) E.migrate = function (l) {
    var out = migrate.apply(this, arguments) || l;
    if (out && out.flags && out.flags.culture173) st(out);
    return out;
  };

  // Batch 1: tên món đã đối chiếu cơ quan văn hóa/du lịch chính thức.
  // Giá, điểm và thời gian luyện tập dưới đây là cân bằng game, không phải số liệu thực tế.
  var FOOD = {
    FI: { dishes: ['Ruisleipä (bánh mì lúa mạch đen)', 'Karjalanpiirakka (bánh Karelia)', 'Lohikeitto (súp cá hồi)', 'Leipäjuusto (phô mai nướng)', 'Kalakukko (bánh mì nhân cá vùng Savo)'], text: 'Bạn ghé quầy thực phẩm và tìm hiểu cách dùng cá, bánh mì lúa mạch đen cùng nguyên liệu theo mùa. Món vùng Savo không đại diện cho mọi gia đình Phần Lan.', source: 'https://www.visitfinland.com/en/articles/finlands-traditional-and-iconic-foods/' },
    GH: { dishes: ['Kenkey (bột ngô lên men)', 'Banku (bột ngô và sắn)', 'Tuo zaafi (món bột vùng Bắc Ghana)', 'Akple (món bột của cộng đồng Ewe)', 'Eto (khoai nghiền với dầu cọ)'], text: 'Khu chợ có nhiều quầy theo cộng đồng và vùng miền. Bạn hỏi người bán về cách chế biến, thay vì xem một món là thói quen bắt buộc của cả Ghana.', source: 'https://ghanaculture.gov.gh/regional-representation-and-diversity/' },
    IE: { dishes: ['Soda bread (bánh mì dùng muối nở)', 'Waterford Blaa (bánh mì mềm Waterford)', 'Seafood chowder (súp hải sản)', 'Smoked salmon (cá hồi hun khói)', 'Irish lamb (món thịt cừu Ireland)'], text: 'Bạn tìm hiểu bánh mì và món ăn từ nguyên liệu địa phương. Người bán giải thích món Blaa gắn với Waterford; thực đơn mỗi nhà tùy khẩu vị và điều kiện.', source: 'https://www.ireland.com/en/magazine/food-and-drink/traditional-irish-food/' }
  };
  Object.keys(FOOD).forEach(function (cc) { FOOD[cc].countryCode = cc; FOOD[cc].metadata = { sources: [FOOD[cc].source], verifiedAt: '2026-10-28', confidence: 'verified', scope: 'dish-names-only', effectiveFrom: null, effectiveTo: null }; P[cc] = P[cc] || {}; P[cc].cuisine = FOOD[cc]; });
  HOL.matariki_nz = { id: 'matariki_nz', n: 'Matariki (năm mới Māori)', t: 'tưởng nhớ người đã khuất, chia sẻ bữa ăn và cùng nghĩ về năm tới; một số cộng đồng đánh dấu năm mới bằng Puanga', src: 'nz-mch', since: 2022, calendar: 'Lịch thay đổi theo năm; không mô phỏng ngày nghỉ trước 2022', menu: 'Cùng đón Matariki', party: 'Matariki' };
  P.NZ.h.push('matariki_nz');
  function kitchen(l) { var s = st(l); return s.kitchen || (s.kitchen = { learned: {}, cooked: {}, lastAt: null }); }
  function foodWhy(l) { return ok(l) && l.age >= 12 && !!FOOD[code(l)] && (!peek(l).kitchen || peek(l).kitchen.lastAt !== l.age) ? true : 'Chưa phù hợp'; }
  C.incident('world_cuisine173', 'Bữa ăn và câu chuyện địa phương', foodWhy, function (l) { return FOOD[code(l)] ? FOOD[code(l)].text + ' Bạn chọn món phù hợp chế độ ăn của mình; không có món nào bắt buộc.' : 'Bạn đã chuyển nơi ở, hãy tìm hiểu món ăn tại nơi mới.'; }, function (l) {
    var cc = code(l), f = FOOD[cc]; if (!f) return [];
    var s = peek(l).kitchen || {}, learned = s.learned || {}, cooked = s.cooked || {};
    var dish = f.dishes.filter(function (n) { return !learned[cc + ':' + n]; })[0] || f.dishes[0];
    var ready = f.dishes.filter(function (n) { var q = learned[cc + ':' + n]; return q && q.age < l.age && !cooked[cc + ':' + n]; })[0];
    return [
      { k: 'learn', l: 'Học cách làm ' + dish, h: 'Ghi nhớ công thức; có thể thực hành từ năm sau · chi phí mô phỏng 1% mức sống năm nếu tự lập', run: function (l, r, log) { if (adult(l) && !pay(l, .01, 'Học món địa phương', r, log)) return; var q = kitchen(l); q.learned[cc + ':' + dish] = { countryCode: cc, age: l.age, year: year(l) }; q.lastAt = l.age; H.fx(l, { kno: 1 }); note(l, 'Học công thức ' + dish + ' tại ' + cname(cc)); log('Bạn ghi lại cách làm ' + dish + '. Cần dành thời gian luyện tập, chưa nấu thành thạo ngay.', 'good'); } },
      { k: 'cook', l: ready ? 'Thực hành ' + ready + ' và chia sẻ bữa ăn' : 'Thực hành công thức đã học từ năm trước', why: !!ready && (!adult(l) || l.money >= l.base * .015), h: 'Chi phí mô phỏng 1,5% mức sống năm nếu tự lập · kết quả tùy kinh nghiệm', run: function (l, r, log) { if (!ready || adult(l) && !pay(l, .015, 'Nguyên liệu nấu ăn', r, log)) return; var q = kitchen(l), success = r() < Math.min(.9, .45 + (l.st.kno || 0) / 250 + Object.keys(q.cooked).length * .03); q.lastAt = l.age; if (success) { q.cooked[cc + ':' + ready] = { countryCode: cc, age: l.age, year: year(l) }; H.fx(l, { hap: 3, soc: 2 }); note(l, 'Tự làm thành công ' + ready); log('Món ' + ready + ' đã thành công. Bạn chia sẻ với người thân còn liên lạc được hoặc bạn bè quanh mình.', 'good'); } else { H.fx(l, { kno: 1 }); log('Món ăn chưa như ý. Bạn giữ công thức và kinh nghiệm để thử lại năm sau.', 'neutral'); } } },
      { k: 'talk', l: 'Trò chuyện về nguyên liệu, không mua thêm', h: 'Không tốn tiền · quan hệ +1', run: function (l, r, log) { kitchen(l).lastAt = l.age; H.fx(l, { soc: 1 }); log('Bạn lắng nghe câu chuyện món ăn và tôn trọng khác biệt khẩu vị; không bắt buộc phải ăn thử.', 'neutral'); } }
    ];
  });
  E.HOOKS.year.push(function (l, r) { if (foodWhy(l) === true && roll(l, 'cuisine') < .24) queue(l, 'world_cuisine173', r); });

  // Hồ sơ theo tiêu chí 3/3/3/5/5/5, mở rộng chính resolver và state văn hóa này.
  var DEPTH = E.COUNTRY_DEPTH_DATA || { sources: {}, profiles: {} }, CASES = {};
  Object.keys(DEPTH.profiles).forEach(function (cc) {
    if (!G.W.BY[cc] || !/^[A-Z]{2}$/.test(cc)) throw new Error('Invalid country depth code: ' + cc);
    var dp = DEPTH.profiles[cc], p = P[cc] || (P[cc] = {}), previousExam = p.ex;
    p.depth = dp; p.h = p.h || [];
    dp.festivals.forEach(function (f) {
      if (!HOL[f.id]) HOL[f.id] = { id: f.id, n: f.name, t: f.activity, src: f.source, since: f.since || dp.metadata.referenceYear, calendar: f.date, menu: 'Cùng đón ' + f.name, party: f.name };
      if (p.h.indexOf(f.id) < 0) p.h.push(f.id);
    });
    if (dp.exam) p.ex = function (y) { return y >= dp.metadata.referenceYear ? dp.exam : previousExam ? previousExam(y) : 'đánh giá cuối cấp theo chương trình trường học'; };
    if (!FOOD[cc]) FOOD[cc] = { countryCode: cc, dishes: dp.cuisine.dishes.slice(), text: 'Bạn tìm hiểu món ăn địa phương tại ' + cname(cc) + ', hỏi rõ nguyên liệu và phong cách của từng cộng đồng; các món không bắt buộc với mọi gia đình.', source: DEPTH.sources[dp.cuisine.source], metadata: { verifiedAt: dp.metadata.verifiedAt, confidence: 'verified', scope: 'dish-names-only', sources: [DEPTH.sources[dp.cuisine.source]].concat((dp.cuisine.extraSources || []).map(function (s) { return DEPTH.sources[s]; })) } };
    p.cuisine = FOOD[cc];
    dp.lifeEvents.forEach(function (e) { CASES[e.id] = e; });
  });
  E.countryDepth173 = function (cc) { return profileOf(cc).depth; };
  function depthAt(l) { return DEPTH.profiles[code(l)]; }
  function currentDepth(l) { var p = depthAt(l); return p && year(l) >= p.metadata.legalFrom ? p : null; }
  function caseState(l) { var s = st(l); if (!s.cases || typeof s.cases !== 'object' || Array.isArray(s.cases)) s.cases = {}; return s.cases; }
  function casePeek(l, e) { var q = (peek(l).cases || {})[e.id]; return q && typeof q === 'object' && !Array.isArray(q) ? q : null; }
  function jobToken(l) { return l.job ? l.job.id + ':' + (l.job.since == null ? '' : l.job.since) : null; }
  function caseWhy(l, e) {
    if (!ok(l) || code(l) !== e.countryCode || !currentDepth(l) || l.age < e.min) return 'Chưa phù hợp nơi ở, tuổi hoặc mốc tham chiếu';
    var q = casePeek(l, e), active = q && q.status === 'active';
    if (q && q.status === 'complete' && !(e.kind === 'safety' && l.age > q.preparedUntil)) return 'Câu chuyện đã hoàn tất';
    if (q && q.at === l.age) return 'Đã quyết định chuyện này trong năm';
    if (!active && e.max && l.age > e.max) return 'Đã qua giai đoạn này';
    if (active && l.age < q.due) return 'Cần thêm thời gian';
    if (e.kind === 'education' && !active && !l.school) return 'Cần đang đi học';
    if (e.kind === 'work' && (!l.job || active && q.job !== jobToken(l))) return 'Công việc đã thay đổi';
    if (e.kind === 'marriage') {
      if (!l.partner || l.partner.alive === false || l.partner.age < 18 || l.partner.status !== 'dating') return 'Cần hai người trưởng thành đang hẹn hò';
      if (active && q.partner !== l.partner.uid110) return 'Mối quan hệ đã thay đổi';
    }
    if (active && q.actor && E.LIFE138.state(l).people[q.actor] && E.LIFE138.state(l).people[q.actor].alive === false) return 'Người cùng chuẩn bị không còn tham gia được';
    return true;
  }
  function caseActor(l, e, q) {
    if (e.kind === 'marriage') return l.partner;
    var id = q.actor || ('culture173:' + e.id + ':' + q.started), people = E.LIFE138.state(l).people;
    if (people[id]) return people[id];
    var r = E.LIFE138.random(l.id + ':' + id);
    q.actor = id;
    var p = E.LIFE138.person(l, id, H.stranger(l, r, 'F'), 'F', l.birthYear - 8, e.kind === 'education' ? 'người tư vấn học tập hư cấu' : e.kind === 'work' ? 'người phụ trách công việc hư cấu' : 'người quen địa phương hư cấu', [e.countryCode]);
    p.goal173 = e.goal; return p;
  }
  function caseRecord(l, e, q, choice, text) {
    q.at = l.age; var person = caseActor(l, e, q);
    if (person && person.events) { person.events.push({ age: l.age, countryCode: code(l), text: text, choice: choice }); if (person.events.length > 24) person.events.shift(); }
    if (person && person.trust != null) person.trust = U.clamp(person.trust + (choice === 'pause' ? 0 : 2), 0, 100);
    note(l, e.title + ': ' + text);
  }
  function startCase(l, e, choice, rate, r, log) {
    if (adult(l) && rate && !pay(l, rate, e.title, r, log)) return;
    var q = casePeek(l, e) || { countryCode: code(l), started: l.age, progress: 0 }; caseState(l)[e.id] = q;
    if (q.status === 'complete' || q.status === 'interrupted') {
      q.previous = q.previous || []; q.previous.push({ started: q.started, progress: q.progress, partner: q.partner || null, job: q.job, actor: q.actor || null, reason: q.reason || 'review' }); if (q.previous.length > 12) q.previous.shift();
      q.progress = 0; q.started = l.age; q.actor = null;
    }
    q.status = choice === 'pause' ? 'paused' : 'active'; q.choice = choice; q.due = l.age + 1; q.job = jobToken(l);
    if (e.kind === 'marriage') q.partner = X.uid(l, l.partner);
    if (e.kind === 'education') q.route = choice;
    caseRecord(l, e, q, choice, choice === 'pause' ? 'Tạm hoãn, không cam kết thay người khác.' : 'Đã thống nhất bước chuẩn bị và hẹn xem lại năm sau.');
    H.fx(l, choice === 'pause' ? { hap: 1 } : choice === 'light' ? { soc: 1 } : { kno: 1 });
    if (choice !== 'pause') log('Bạn cùng ' + caseActor(l, e, q).name + ' chuẩn bị: ' + e.goal + '. Câu chuyện sẽ được xem lại từ năm sau.', 'neutral');
    else log('Bạn tạm hoãn ' + e.title.toLowerCase() + '. Có thể cân nhắc lại ở năm sau khi còn phù hợp.', 'neutral');
  }
  function finishCase(l, e, q, r, log) {
    var policies = (peek(l).laborReviewed || {})[code(l)] || {}, review = Object.keys(policies).length;
    var person = caseActor(l, e, q), trust = e.kind === 'marriage' && E.RELATIONS108 ? E.RELATIONS108.bond(l, person) : person && person.trust != null ? person.trust : 50;
    var tension = l.mind && l.mind.stress || 0;
    var chance = U.clamp(.4 + (l.st.kno || 0) / 350 + trust / 600 + (e.kind === 'work' ? review * .025 : 0) - tension / 500, .2, .9);
    if (r() < chance) {
      q.progress = U.clamp(Math.floor(Number(q.progress) || 0) + 1, 0, 2); q.status = q.progress >= 2 ? 'complete' : 'active'; q.due = l.age + 1;
      var fx = e.kind === 'education' ? { kno: q.route === 'academic' ? 3 : q.route === 'vocational' ? 2 : 1, soc: q.route === 'vocational' ? 1 : q.route === 'applied' ? 2 : 0 } : e.kind === 'training' ? { kno: 2, soc: 1 } : e.kind === 'work' ? { hap: 2, soc: 1 } : e.kind === 'safety' ? { kno: 1, hap: 2 } : { soc: 2, hap: 2 };
      H.fx(l, fx); stress(l, -2);
      if (e.kind === 'education' && q.route === 'academic') stress(l, 3);
      if (e.kind === 'work' && l.job) l.job.rep = U.clamp((l.job.rep == null ? 50 : l.job.rep) + 2, 0, 100);
      if (e.kind === 'marriage' && l.partner && E.RELATIONS108 && l.partner.countryBondAt173 !== l.age) { l.partner.affection108 = U.clamp(E.RELATIONS108.bond(l, l.partner) + 2, 0, 100); l.partner.countryBondAt173 = l.age; }
      if (e.kind === 'safety') q.preparedUntil = l.age + 3;
      caseRecord(l, e, q, 'review', q.status === 'complete' ? 'Hoàn thành hai lượt theo dõi qua các năm.' : 'Có tiến bộ, tiếp tục theo dõi thêm một năm.');
      log((e.followup || 'Bạn cùng người tư vấn đối chiếu kế hoạch và khả năng thực hiện; kết quả học tập vẫn cần được đánh giá trong hệ thống giáo dục.') + (q.status === 'complete' ? ' Việc chuẩn bị đã được ghi vào hồ sơ.' : ' Hai bên hẹn xem lại ở năm sau.'), 'good');
    } else {
      q.due = l.age + 1;
      caseRecord(l, e, q, 'retry', 'Còn điểm chưa thống nhất, giữ hồ sơ để thử lại.');
      stress(l, 1); log('Việc ' + e.goal + ' chưa hoàn tất. ' + person.name + ' muốn xem lại chi tiết; bạn có thể tiếp tục, giảm nhịp hoặc dừng ở năm sau.', 'neutral');
    }
  }
  function caseRows(l, e) {
    if (caseWhy(l, e) !== true) return [];
    var q = casePeek(l, e), active = q && q.status === 'active';
    if (active) return [
      { k: 'review', l: 'Cùng xem lại bước đã chuẩn bị', h: 'Có thể tiến bộ hoặc cần thử lại · không tự cấp bằng, việc làm hay đăng ký hôn nhân', run: function (l, r, log) { finishCase(l, e, q, r, log); } },
      { k: 'light', l: 'Giảm nhịp, hẹn sang năm', h: 'Giữ công việc đang làm dở · giảm căng thẳng', run: function (l, r, log) { q.due = l.age + 1; caseRecord(l, e, q, 'light', 'Giảm nhịp và giữ hồ sơ.'); stress(l, -2); log('Bạn cùng người liên quan điều chỉnh lịch và hẹn lại năm sau.', 'neutral'); } },
      { k: 'pause', l: 'Dừng kế hoạch hiện tại', h: 'Không tự quyết thay người yêu, trường học hay nơi làm việc', run: function (l, r, log) { q.status = 'paused'; caseRecord(l, e, q, 'pause', 'Dừng kế hoạch hiện tại.'); log('Bạn khép lại kế hoạch đang làm dở, giữ lịch sử đã trao đổi.', 'neutral'); } }
    ];
    if (e.kind === 'education') return depthAt(l).education.map(function (route) { return { k: route.route, l: 'Lập kế hoạch: ' + route.name, h: route.note, run: function (l, r, log) { startCase(l, e, route.route, 0, r, log); } }; });
    if (e.kind === 'marriage') return depthAt(l).marriage.map(function (item, i) { return { k: item.id, l: 'Cùng tìm hiểu: ' + item.name, h: item.note, run: function (l, r, log) { startCase(l, e, item.id, 0, r, log); } }; });
    var labels = e.options || ['Cùng chuẩn bị và hẹn xem lại', 'Tham gia một phần vừa sức', 'Tạm hoãn'];
    return labels.map(function (label, i) { var rate = i === 0 && (e.kind === 'training' || e.kind === 'safety') ? .01 : 0;
      return { k: ['plan', 'light', 'pause'][i], l: label, h: rate && adult(l) ? 'Chi phí chuẩn bị mô phỏng: ' + H.money(l, l.base * rate) : 'Không chi thêm tiền', why: !rate || !adult(l) || l.money >= l.base * rate, run: function (l, r, log) { startCase(l, e, ['plan', 'light', 'pause'][i], rate, r, log); } };
    });
  }
  var depthIds = [];
  Object.keys(CASES).forEach(function (key) {
    var e = CASES[key], id = 'country_' + key + '173'; e.eventId = id; depthIds.push(id);
    C.incident(id, e.title, function (l) { return caseWhy(l, e); }, function (l) {
      var q = casePeek(l, e), p = depthAt(l); if (!p || p.countryCode !== e.countryCode) return 'Câu chuyện không thuộc quốc gia đang cư trú.';
      var text = q && q.status === 'active' ? (e.followup || e.text) + ' Đang theo dõi bước ' + (q.progress + 1) + '/2; người cùng chuẩn bị: ' + (q.actor && E.LIFE138.state(l).people[q.actor] ? E.LIFE138.state(l).people[q.actor].name : l.partner ? l.partner.name : 'người liên quan') + '.' : e.text;
      return text + ' Tình huống và kết quả là mô phỏng. Thông tin tham chiếu năm ' + p.metadata.referenceYear + '; tương lai trong game dùng giả định giữ mốc này.';
    }, function (l) { return caseRows(l, e); });
  });
  X.menu('countryStories173', 'Câu chuyện riêng ở nơi đang sống', function (l) { return ok(l) && l.age >= 12 && currentDepth(l) ? true : 'Chưa có đợt nội dung riêng phù hợp nơi cư trú hoặc năm này'; }, function (l) { var p = depthAt(l); return p ? 'Những lựa chọn tại ' + cname(code(l)) + '. Câu chuyện được nhớ qua các năm; chỉ một chuyện mới được hệ thống đưa tới mỗi năm. Dữ liệu có mốc tham chiếu ' + p.metadata.referenceYear + '.' : 'Chưa có đợt nội dung riêng ở đây.'; }, function (l) { var p = depthAt(l); return p ? p.lifeEvents.map(function (e) { return { k: e.id, l: e.title, why: caseWhy(l, e), run: function (l, r) { X.next(l, e.eventId, r, {}, { manual: true }); } }; }) : []; }, 12, 'Cuộc sống & quan hệ');
  X.menu('countryLabor173', 'Đối chiếu điều kiện làm việc địa phương', function (l) { return ok(l) && l.age >= 18 && l.job && currentDepth(l) ? true : 'Cần đang đi làm tại nơi có hồ sơ đã nghiên cứu'; }, function (l) { var p = depthAt(l); return p ? 'Mốc tham chiếu ' + p.metadata.referenceYear + '. Điều kiện có ngoại lệ theo ngành, hợp đồng và hoàn cảnh; đây không phải kết luận về nơi làm việc của bạn. Không tự tăng lương hoặc truy lĩnh.' : 'Chưa có hồ sơ đã nghiên cứu ở đây.'; }, function (l) {
    var cc = code(l), reviewed = (peek(l).laborReviewed || {})[cc] || {};
    var p = depthAt(l); return p ? p.labor.map(function (policy) { return { k: policy.id, l: policy.name + ': ' + policy.note, why: peek(l).laborAt !== l.age ? true : 'Đã đối chiếu một nội dung trong năm', run: function (l, r, log) { var s = st(l); s.laborReviewed = s.laborReviewed || {}; s.laborReviewed[cc] = s.laborReviewed[cc] || {}; s.laborReviewed[cc][policy.id] = { age: l.age, referenceYear: depthAt(l).metadata.referenceYear }; s.laborAt = l.age; stress(l, -1); log('Bạn giữ bản đối chiếu: ' + policy.name + '. Hiểu rõ thông tin sẽ giúp khi trao đổi chuyện công việc sau này.', 'neutral'); } }; }) : [];
  }, 18, 'Học tập & sự nghiệp');
  E.HOOKS.year.push(function (l, r, log) {
    var p = currentDepth(l); if (!p || !ok(l)) return;
    var s = peek(l);
    p.lifeEvents.forEach(function (e) {
      var q = casePeek(l, e); if (!q || q.status !== 'active') return;
      var reason = e.kind === 'work' && q.job !== jobToken(l) ? 'Công việc đã thay đổi' : e.kind === 'marriage' && (!l.partner || l.partner.alive === false || l.partner.status !== 'dating' || q.partner !== l.partner.uid110) ? 'Mối quan hệ đã thay đổi' : q.actor && E.LIFE138.state(l).people[q.actor] && E.LIFE138.state(l).people[q.actor].alive === false ? 'Người cùng chuẩn bị không còn tham gia được' : null;
      if (reason) { q.status = 'interrupted'; q.reason = reason; q.at = l.age; note(l, e.title + ': ' + reason); log(e.title + ': ' + reason + '. Kế hoạch cũ được khép lại, giữ lịch sử; chưa ghi thêm kết quả.', 'neutral'); }
    });
    if (s.safetyCalmAt !== l.age && p.lifeEvents.some(function (e) { var q = casePeek(l, e); return e.kind === 'safety' && q && q.preparedUntil >= l.age; })) { stress(l, -1); st(l).safetyCalmAt = l.age; }
    if (s.caseQueuedAt === l.age) return;
    var eligible = p.lifeEvents.filter(function (e) { return caseWhy(l, e) === true; });
    var due = eligible.filter(function (e) { var q = casePeek(l, e); return q && q.status === 'active'; });
    if (due.length) eligible = due;
    else if (roll(l, 'country-case-arrival') >= .28) return;
    if (!eligible.length) return;
    var chosen = eligible[Math.floor(roll(l, 'country-case-pick') * eligible.length) % eligible.length];
    if (queue(l, chosen.eventId, r)) st(l).caseQueuedAt = l.age;
  });
  var marryMake = E.DEC.marry.make;
  var marryValid = E.DEC.marry.valid;
  function vnMarriageAge(l) { return code(l) !== 'VN' || year(l) < 2015 || !l.partner || l.sex === l.partner.sex || l.age >= (l.sex === 'M' ? 20 : 18) && l.partner.age >= (l.partner.sex === 'M' ? 20 : 18); }
  E.DEC.marry.valid = function (l, d) { return vnMarriageAge(l) && marryValid.apply(this, arguments); };
  E.DEC.marry.make = function (l) { var d = marryMake.apply(this, arguments), p = currentDepth(l); if (!vnMarriageAge(l)) { d.text += ' Chưa đủ tuổi đăng ký kết hôn tại Việt Nam: nam từ đủ 20, nữ từ đủ 18.'; d.opts = [{ k: 'wait', l: 'Chờ đến khi cả hai đủ điều kiện' }]; } if (p && l.age >= 18) d.text += ' Tại ' + cname(code(l)) + ', hai bạn có thể tìm hiểu trước: ' + p.marriage.map(function (m) { return m.name; }).join('; ') + '. Các bước chuẩn bị nằm trong Câu chuyện riêng ở nơi đang sống, không bắt buộc làm lễ lớn.'; return d; };
  var previousProfile = E.profile;
  E.profile = function (l) { var p = previousProfile.apply(this, arguments), local = depthAt(l); if (!p || !local) return p;
    var cases = peek(l).cases || {}, active = local.lifeEvents.filter(function (e) { return cases[e.id] && cases[e.id].status === 'active'; });
    p.jobInfo = p.jobInfo || []; if (active.length) p.jobInfo.push('Chuyện địa phương đang theo dõi: ' + active.map(function (e) { return e.title + ' · hẹn từ tuổi ' + cases[e.id].due; }).join('; '));
    return p;
  };

  // Gắn nơi cư trú vào sự kiện khi tạo; kiểm tra lại trước mọi tác động.
  var GUARDED = ['world_festival173', 'world_school173', 'world_exam173', 'world_coming173', 'world_workplace173', 'world_integration173', 'world_cuisine173', 'countryStories173', 'countryLabor173'].concat(depthIds);
  GUARDED.forEach(function (id) {
    var dec = E.DEC[id], make = dec.make, apply = dec.apply, valid = dec.valid;
    dec.make = function (l, r, a) {
      if (id === 'world_festival173' && !(a && a.id)) { var pick = festivalPick(l); if (pick) a = { id: pick.id, kind: pick.why }; }
      var d = make.call(this, l, r, a); d.data.countryCode = code(l); return d;
    };
    dec.valid = function (l, d) { return (!d || !d.countryCode || d.countryCode === code(l)) && valid.apply(this, arguments); };
    dec.apply = function (l, d, k, r, log) {
      var data = d && d.data;
      if (!data || !data.countryCode || data.countryCode !== code(l) || !valid(l, data) || id === 'world_festival173' && !selectedFestival(l, data.arg)) { if (data) data.done = true; log('Hoàn cảnh hoặc nơi cư trú đã đổi; dịp này khép lại, không trừ tiền hay ghi nhận thành tích.', 'neutral'); return; }
      return apply.apply(this, arguments);
    };
  });
  var migrateScoped = E.migrateExt;
  E.migrateExt = function (l) {
    if (migrateScoped) migrateScoped(l);
    l.pending = (l.pending || []).map(function (d) {
      if (GUARDED.indexOf(d.id) < 0 || d.data && d.data.countryCode) return d;
      // Bản lưu cũ chưa có ràng buộc: dựng lại từ nơi ở hiện tại, không tin văn bản/arg cũ.
      if (!E.DEC[d.id].valid(l)) return null;
      var fresh = E.DEC[d.id].make(l, function () { return .5; }); fresh.manual = d.manual; return fresh;
    }).filter(function (d) { return d && (GUARDED.indexOf(d.id) < 0 || d.data.countryCode === code(l)); });
  };

  // Dùng kho thành tựu hiện hữu; không đọc nhật ký văn bản hay đoán từ tên nhân vật.
  var festivalTitles = { JP: 'Ba mùa Shōgatsu', KR: 'Nếp nhà Seollal', CN: 'Ba mùa đoàn viên', MN: 'Đón xuân thảo nguyên', VN: 'Tết lại về', MX: 'Nhớ người qua Día de Muertos', BR: 'Ba mùa Carnaval', TH: 'Những mùa Songkran', ET: 'Năm mới Enkutatash', SE: 'Những mùa Midsommar', NO: 'Cờ hoa ngày Hiến pháp', FR: 'Hẹn ngày Quốc khánh', DE: 'Những ngày Thống nhất' };
  var newAch = [];
  Object.keys(P).forEach(function (cc) {
    var p = P[cc], first = p.h && p.h[0];
    if (first) newAch.push(['culture173_local_' + cc, '🌏', festivalTitles[cc] || 'Hẹn mùa lễ tại ' + cname(cc), 'Tham gia ' + HOL[first].n + ' tại ' + cname(cc) + ' trong ít nhất 3 năm. Lễ quê gốc ở nước khác không tính.', function (l) { return ((peek(l).localFestivals || {})[cc] || {})[first] >= 3; }]);
    if (p.ex) newAch.push(['culture173_exam_' + cc, '🎓', 'Dấu mốc học đường · ' + cname(cc), 'Đạt kết quả xuất sắc trong sự kiện đánh giá cuối cấp tại ' + cname(cc) + ' (mô phỏng).', function (l) { var x = peek(l).exam; return !!x && x.country === cc && x.result === 'xuất sắc'; }]);
  });
  Object.keys(FOOD).forEach(function (cc) { newAch.push(['culture173_kitchen_' + cc, '🍲', 'Căn bếp · ' + cname(cc), 'Tự làm thành công 3 món khác nhau đã học tại ' + cname(cc) + ', qua nhiều năm thực hành.', function (l) { var q = peek(l).kitchen || {}; return FOOD[cc].dishes.filter(function (n) { return (q.cooked || {})[cc + ':' + n]; }).length >= 3; }]); });
  newAch.push(['culture173_matariki', '✨', 'Nhìn lên Matariki', 'Cùng đón Matariki tại New Zealand từ năm 2022 trở đi.', function (l) { return ((peek(l).localFestivals || {}).NZ || {}).matariki_nz >= 1; }]);
  E.addAchievements(newAch);
  E.CULTURE173.FOOD = FOOD;
  E.CULTURE173.DEPTH = DEPTH;
  E.CULTURE173.CASES = CASES;
  E.CULTURE173.caseWhy = caseWhy;
  E.CULTURE173.context = context;
  E.CULTURE173.candidates = candidates;
  E.CULTURE173.coming = coming;
  E.CULTURE173.examName = examName;
  E.CULTURE173.schoolKey = schoolKey;
  E.CULTURE173.workKey = workKey;
  E.CULTURE173.state = st;
})(globalThis.G);
