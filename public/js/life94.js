/* Một Đời — v7.4.0: ứng dụng hẹn hò theo từng nước
   Mỗi nước một bộ app phổ biến thật (tham khảo bảng xếp hạng lượt tải / người dùng của data.ai, adjoe, các bảng xếp hạng app
   hẹn hò tại Hàn Quốc, Nhật Bản, Trung Quốc):
   · Việt Nam: Tinder, Bumble, Facebook Hẹn hò, Litmatch · Hàn Quốc: Amanda, WIPPY, Glam, Tinder · Nhật Bản: Pairs, Tapple, with, Tinder
   · Trung Quốc: Tantan, Momo, Soul (không có Tinder / Facebook) · Đài Loan, Hồng Kông: Tinder, Omi, Pairs · Nga: Mamba, VK Знакомства, Badoo
   · Mỹ, Anh, Úc, Canada…: Tinder, Hinge, Bumble · châu Âu lục địa: Tinder, Hinge, Bumble, Badoo · Mỹ Latinh: Tinder, Badoo, Bumble
   · Ấn Độ: Tinder, Bumble, Aisle, QuackQuack · Trung Đông, Bắc Phi: Muzz · Indonesia, Malaysia, Thái Lan, Philippines: Tinder, Tantan, Omi, Litmatch, Bumble
   · ứng dụng cho người LGBTQ+: Blued (châu Á), Grindr (nơi khác), HER
   · người lớn tuổi: nhóm Zalo (Việt Nam), công ty mai mối kết hôn (Hàn Quốc), dịch vụ "hôn hoạt" (Nhật Bản), góc xem mắt ở công viên (Trung Quốc),
     trang mai mối hôn nhân (Ấn Độ), mai mối qua gia đình (Trung Đông), Match.com / eHarmony (Mỹ, Anh)… */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, isVN = H.isVN;
  function here(l) { return String((l.abroad && l.abroad.perm && l.abroad.code) || l.country || (isVN(l) ? 'VN' : '')).toUpperCase(); }
  var R = {
    VN: /^VN$/, KR: /^KR$/, JP: /^JP$/, CN: /^CN$/, TWHK: /^(TW|HK|MO)$/, RU: /^(RU|BY|KZ|KG|UZ|TJ|AM|AZ)$/,
    ANGLO: /^(US|GB|CA|AU|NZ|IE)$/, EU: /^(DE|FR|NL|BE|LU|AT|CH|SE|NO|DK|FI|IS|ES|PT|IT|GR|PL|CZ|SK|HU|RO|BG|HR|SI|EE|LV|LT|UA|RS|BA|ME|MK|AL|MT|CY|MD)$/,
    LATAM: /^(BR|MX|AR|CO|CL|PE|VE|EC|BO|PY|UY|CR|PA|GT|HN|SV|NI|DO|CU|PR|JM|TT|HT)$/,
    IN: /^(IN|NP|LK|BD)$/, MENA: /^(SA|AE|QA|KW|BH|OM|YE|IR|IQ|JO|SY|LB|EG|LY|TN|DZ|MA|SD|PK|AF|TR)$/,
    SEA: /^(ID|MY|TH|PH|SG|KH|LA|MM|BN|TL)$/
  };
  function region(l) { var c = here(l); for (var k in R) if (R[k].test(c)) return k; return 'OTHER'; }
  E.datingRegion = region;
  // [mã, tên app, mô tả, độ dễ match, tỉ lệ "qua đêm", tỉ lệ lừa đảo, nghiêm túc, các vùng, điều kiện riêng]
  var Y = function (l) { return l.age <= 45; }, Y2 = function (l) { return l.age >= 20 && l.age <= 45; }, ALL = function (l) { return l.age <= 65; };
  var APPS = [
    ['tinder', 'Tinder', 'Đông người dùng nhất, quẹt nhanh — nhiều người chỉ tìm vui qua đường', 0.55, 0.35, 0.06, 0, 'VN KR JP TWHK ANGLO EU LATAM IN SEA OTHER', Y],
    ['bumble', 'Bumble', 'Con gái nhắn tin trước, ít bị làm phiền', 0.5, 0.12, 0.04, 0, 'VN ANGLO EU LATAM IN SEA', Y],
    ['hinge', 'Hinge', '"Ứng dụng sinh ra để được xóa" — hợp người muốn yêu nghiêm túc', 0.5, 0.05, 0.03, 1, 'ANGLO EU', Y2],
    ['fb', 'Facebook Hẹn hò', 'Gợi ý theo bạn chung, nhiều người ở gần', 0.45, 0.08, 0.08, 0, 'VN ANGLO LATAM OTHER', ALL],
    ['litmatch', 'Litmatch', 'Trò chuyện ẩn danh theo "linh hồn", giới trẻ dùng nhiều', 0.4, 0.1, 0.06, 0, 'VN SEA', function (l) { return l.age <= 35; }],
    ['amanda', 'Amanda', 'Hồ sơ phải được người dùng khác chấm điểm đạt mới vào được — nổi tiếng khắt khe về ngoại hình', 0.42, 0.1, 0.03, 0, 'KR', Y],
    ['wippy', 'WIPPY', 'App hẹn hò được tải nhiều nhất ở Hàn Quốc, gợi ý người ở gần', 0.5, 0.15, 0.04, 0, 'KR', Y],
    ['glam', 'Glam', 'Hồ sơ được xét duyệt, nhiều người đi làm muốn tìm người yêu nghiêm túc', 0.45, 0.06, 0.03, 1, 'KR', Y2],
    ['pairs', 'Pairs', 'App hẹn hò phổ biến nhất Nhật Bản, phần lớn người dùng tìm người yêu nghiêm túc', 0.5, 0.04, 0.03, 1, 'JP TWHK', Y2],
    ['tapple', 'Tapple', 'Chọn theo sở thích chung, hợp người dưới 30 tuổi', 0.5, 0.1, 0.03, 0, 'JP', function (l) { return l.age <= 32; }],
    ['with', 'with', 'Ghép đôi theo trắc nghiệm tính cách', 0.45, 0.05, 0.03, 1, 'JP', Y2],
    ['tantan', 'Tantan (探探)', 'Quẹt trái quẹt phải kiểu Tinder, rất phổ biến ở Trung Quốc', 0.55, 0.3, 0.07, 0, 'CN SEA', Y],
    ['momo', 'Momo (陌陌)', 'Tìm người lạ ở gần, vừa kết bạn vừa hẹn hò', 0.5, 0.3, 0.08, 0, 'CN', Y],
    ['soul', 'Soul', 'Ghép đôi theo "tâm hồn" qua trắc nghiệm, giới trẻ Trung Quốc rất chuộng', 0.45, 0.08, 0.05, 0, 'CN', function (l) { return l.age <= 35; }],
    ['omi', 'Omi', 'Ghép đôi theo sở thích, phổ biến ở Đài Loan, Malaysia, Thái Lan', 0.45, 0.12, 0.05, 0, 'TWHK SEA', Y],
    ['mamba', 'Mamba', 'Trang hẹn hò lâu đời và lớn nhất nước Nga', 0.5, 0.2, 0.07, 0, 'RU', function (l) { return l.age <= 55; }],
    ['vk', 'VK Знакомства', 'Hẹn hò ngay trong mạng xã hội VK, quen qua bạn chung', 0.45, 0.12, 0.06, 0, 'RU', ALL],
    ['badoo', 'Badoo', 'Đông người dùng ở châu Âu, Mỹ Latinh', 0.5, 0.2, 0.06, 0, 'RU EU LATAM OTHER', function (l) { return l.age <= 55; }],
    ['aisle', 'Aisle', 'App hẹn hò cho người muốn tiến tới hôn nhân ở Ấn Độ', 0.45, 0.03, 0.04, 1, 'IN', Y2],
    ['quackquack', 'QuackQuack', 'App hẹn hò của Ấn Độ, nhiều người ở các thành phố nhỏ', 0.45, 0.08, 0.06, 0, 'IN', Y],
    ['muzz', 'Muzz', 'App tìm bạn đời cho người Hồi giáo, có thể có người giám hộ cùng xem tin nhắn', 0.45, 0, 0.03, 1, 'MENA SEA', function (l) { return l.age >= 18 && l.age <= 50; }],
    ['blued', 'Blued', 'Ứng dụng hẹn hò dành cho nam đồng tính, song tính', 0.6, 0.4, 0.05, 0, 'VN CN TWHK KR JP SEA IN', function (l) { return l.sex === 'M' && l.orient !== 'straight' && l.age <= 55; }],
    ['grindr', 'Grindr', 'Ứng dụng hẹn hò dành cho nam đồng tính, song tính', 0.6, 0.4, 0.05, 0, 'ANGLO EU LATAM RU OTHER', function (l) { return l.sex === 'M' && l.orient !== 'straight' && l.age <= 55; }],
    ['her', 'HER', 'Ứng dụng dành cho nữ đồng tính, song tính', 0.5, 0.08, 0.03, 0, 'VN KR JP TWHK ANGLO EU LATAM SEA OTHER', function (l) { return l.sex === 'F' && l.orient !== 'straight' && l.age <= 55; }]
  ];
  // cách tìm bạn đời cho người lớn tuổi theo từng nơi
  var OLD = {
    VN: ['nhóm kết bạn tuổi trung niên trên Zalo, Facebook', 'Nhiều người cùng cảnh, nhưng cũng nhiều kẻ lừa tình'],
    KR: ['công ty mai mối kết hôn (như Duo)', 'Trả phí, được giới thiệu người có hồ sơ xác minh nghề nghiệp, học vấn'],
    JP: ['dịch vụ "hôn hoạt" (konkatsu) và app Omiai', 'Hẹn gặp có mục đích tiến tới hôn nhân, nhiều người tuổi trung niên'],
    CN: ['góc xem mắt ở công viên (相亲角) và mai mối qua người quen', 'Bố mẹ, họ hàng mang hồ sơ đi "chợ xem mắt" giúp'],
    TWHK: ['dịch vụ mai mối và nhóm kết bạn trên LINE, Facebook', 'Người giới thiệu xếp lịch gặp mặt'],
    RU: ['trang hẹn hò Teamo và các nhóm VK cho người trung niên', 'Nhiều người nghiêm túc, cũng có kẻ lừa tình'],
    ANGLO: ['Match.com, eHarmony', 'Trang hẹn hò lâu đời, nhiều người trung niên tìm bạn đời nghiêm túc'],
    EU: ['trang hẹn hò cho người trưởng thành (Parship, Meetic…)', 'Ghép đôi theo trắc nghiệm, nhiều người trên 40 tuổi'],
    LATAM: ['nhóm kết bạn trên Facebook, WhatsApp', 'Quen qua bạn bè, nhà thờ, câu lạc bộ khiêu vũ'],
    IN: ['trang mai mối hôn nhân (Shaadi.com, Jeevansathi)', 'Gia đình hai bên cùng xem hồ sơ, lá số'],
    MENA: ['mai mối qua gia đình, người quen', 'Gia đình hai bên gặp nhau trước, rồi mới để hai người tìm hiểu'],
    SEA: ['nhóm kết bạn trên Facebook và mai mối qua người quen', 'Nhiều người cùng cảnh, nhưng cũng có kẻ lừa tình'],
    OTHER: ['nhóm kết bạn trên Facebook, WhatsApp', 'Quen qua bạn bè, người quen giới thiệu']
  };
  function appsFor(l) { var rg = region(l); return APPS.filter(function (a) { return a[7].split(' ').indexOf(rg) >= 0; }); }
  E.datingApps = function (l) { return appsFor(l).filter(function (a) { return a[8](l); }).map(function (a) { return a[1]; }); };
  var D = E.DEC.app_hen_ho; if (!D) return;
  function open(l, r, name) { l.pending.unshift(E.DEC.app_ho_so.make(l, r, { app: name, fresh: true })); }
  D.def.text = function (l) { var o = OLD[region(l)] || OLD.OTHER; return l.age >= 45 ? 'Con cái khuyên bạn thử tìm bạn đời. Ở đây người tuổi bạn hay dùng ' + o[0] + '. Bạn chọn cách nào?' : 'Bạn tải vài ứng dụng hẹn hò phổ biến ở ' + (isVN(l) && !(l.abroad && l.abroad.perm) ? 'Việt Nam' : (l.abroad && l.abroad.perm ? l.abroad.name : l.countryName) || 'nơi bạn sống') + ' về máy. Mỗi app một kiểu người dùng:'; };
  D.def.opts = APPS.map(function (a) {
    return { k: a[0], l: a[1], h: a[2], req: function (l) { return appsFor(l).indexOf(a) >= 0 && a[8](l); }, ai: { w: a[6] ? 1 : 0.9, risk: a[4] > 0.2 ? 0.6 : 0 }, run: function (l, r, log) { open(l, r, a[1]); } };
  }).concat([
    { k: 'trung_nien', l: function (l) { return U.cap((OLD[region(l)] || OLD.OTHER)[0]); }, h: function (l) { return (OLD[region(l)] || OLD.OTHER)[1]; }, req: function (l) { return l.age >= 45; }, ai: { w: 0.9 }, run: function (l, r, log) {
      var o = OLD[region(l)] || OLD.OTHER, y = r(), scam = /lừa/.test(o[1]) ? 0.15 : 0.05;
      if (y < scam) { H.cash(l, -l.base * 0.1, 'Bị lừa tình qua mạng'); log('Quen một người qua ' + o[0] + ', được hứa hẹn đủ điều rồi bị vay tiền "lo việc gấp". Mất tiền, mất niềm tin.', 'bad'); H.fx(l, { hap: -8 }); return; }
      if (y < scam + 0.4 && E.DEC.love) { l.pending.unshift(E.DEC.love.make(l, r, { where: 'qua ' + o[0] })); return; }
      log('Thử ' + o[0] + ' một thời gian, gặp vài người nhưng chưa thấy ai hợp.', 'neutral');
    } },
    { k: 'no', l: 'Thôi, xóa app', ai: { w: 0.2 }, run: function (l, r, log) { log('Tải về rồi lại xóa, thấy không hợp với mình.', 'neutral'); } }
  ]);
  // lựa chọn "Dùng ứng dụng hẹn hò (…)" ghi đúng tên app phổ biến nơi bạn sống
  var TN = E.DEC.tim_nguoi_yeu && E.DEC.tim_nguoi_yeu.def;
  if (TN) TN.opts.forEach(function (o) { if (o.k !== 'app') return; o.l = function (l) { if (l.age >= 45) return 'Tìm bạn đời qua ' + (OLD[region(l)] || OLD.OTHER)[0]; var n = E.datingApps(l).slice(0, 2); return 'Dùng ứng dụng hẹn hò (' + (n.length ? n.join(', ') : 'Tinder') + '…)'; }; });
  // app "quẹt nhanh" dễ có người chỉ muốn gặp qua đêm
  E.HOOKUP_APP = /Tinder|Blued|Grindr|Tantan|Momo|Badoo|Mamba|WIPPY/;
  // hồ sơ "gửi quà từ nước ngoài": không còn nhắc Việt Nam khi bạn sống ở nước khác
  var hz = E.DEC.hen_online;
  if (hz && typeof hz.def.text === 'function') { var t0 = hz.def.text; hz.def.text = function (l, d) { var t = t0.apply(this, arguments); if (!(isVN(l) && !(l.abroad && l.abroad.perm)) && typeof t === 'string') t = t.replace('nữ bác sĩ Việt kiều', 'nữ bác sĩ đang làm việc ở nước ngoài').replace('nói tiếng Việt hơi lơ lớ', 'nói tiếng bản xứ hơi lơ lớ'); return t; }; }
  var hs = E.DEC.app_ho_so;
  if (hs && typeof hs.def.text === 'function') { var t1 = hs.def.text; hs.def.text = function (l, d) { var t = t1.apply(this, arguments); if (!(isVN(l) && !(l.abroad && l.abroad.perm)) && typeof t === 'string') t = t.replace('sắp về Việt Nam', 'sắp về nước').replace('nói tiếng Việt chưa sõi', 'nói tiếng bản xứ chưa sõi'); return t; }; }
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
