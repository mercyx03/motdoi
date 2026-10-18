/* Tiền tệ bản địa của 195 quốc gia (tỷ giá xấp xỉ so với 1 USD, 2025).
   Nội bộ game tính theo "USD sức mua tương đương (PPP)"; khi hiển thị quy đổi:
   PPP → USD danh nghĩa (nhân mức giá tương đối theo GDP) → tiền bản địa, kèm quy đổi ra đồng Việt Nam. */
(function (G) {
  'use strict';
  var EUR = 'AT,BE,HR,CY,EE,FI,FR,DE,GR,IE,IT,LV,LT,LU,MT,NL,PT,SK,SI,ES,AD,MC,SM,VA,ME';
  var GROUPS = [
    [EUR, 'EUR', 'euro', 0.92], ['BJ,BF,CI,GW,ML,NE,SN,TG', 'XOF', 'franc CFA', 600], ['CM,CF,TD,CG,GQ,GA', 'XAF', 'franc CFA', 600],
    ['US,EC,SV,PA,TL,MH,FM,PW,ZW', 'USD', 'đô la Mỹ', 1], ['AU,KI,NR,TV', 'AUD', 'đô la Úc', 1.5], ['AG,DM,GD,KN,LC,VC', 'XCD', 'đô la Đông Caribe', 2.7],
    ['CH,LI', 'CHF', 'franc Thụy Sĩ', 0.88], ['IL,PS', 'ILS', 'shekel', 3.7]
  ];
  var ONE = 'AF:AFN:afghani:70,AL:ALL:lek:92,DZ:DZD:dinar:134,AO:AOA:kwanza:900,AR:ARS:peso:1000,AM:AMD:dram:390,AZ:AZN:manat:1.7,BS:BSD:đô la Bahamas:1,' +
    'BH:BHD:dinar:0.376,BD:BDT:taka:120,BB:BBD:đô la Barbados:2,BY:BYN:rúp Belarus:3.2,BZ:BZD:đô la Belize:2,BT:BTN:ngultrum:84,BO:BOB:boliviano:6.9,' +
    'BA:BAM:mark:1.8,BW:BWP:pula:13.5,BR:BRL:real:5.5,BN:BND:đô la Brunei:1.33,BG:BGN:lev:1.8,BI:BIF:franc Burundi:2900,CV:CVE:escudo:101,KH:KHR:riel:4050,' +
    'CA:CAD:đô la Canada:1.38,CL:CLP:peso:940,CN:CNY:nhân dân tệ:7.2,CO:COP:peso:4100,KM:KMF:franc Comoros:450,CD:CDF:franc Congo:2850,CR:CRC:colón:510,' +
    'CU:CUP:peso Cuba:24,CZ:CZK:koruna:23,DK:DKK:krone:6.9,DJ:DJF:franc Djibouti:178,DO:DOP:peso:60,EG:EGP:bảng Ai Cập:49,ER:ERN:nakfa:15,SZ:SZL:lilangeni:18,' +
    'ET:ETB:birr:120,FJ:FJD:đô la Fiji:2.25,GM:GMD:dalasi:70,GE:GEL:lari:2.7,GH:GHS:cedi:15,GT:GTQ:quetzal:7.7,GN:GNF:franc Guinea:8600,GY:GYD:đô la Guyana:209,' +
    'HT:HTG:gourde:131,HN:HNL:lempira:25,HU:HUF:forint:365,IS:ISK:króna:138,IN:INR:rupee:84,ID:IDR:rupiah:16000,IR:IRR:rial:600000,IQ:IQD:dinar:1310,' +
    'JM:JMD:đô la Jamaica:157,JP:JPY:yên:150,JO:JOD:dinar:0.71,KZ:KZT:tenge:500,KE:KES:shilling:129,KP:KPW:won Triều Tiên:900,KR:KRW:won:1380,KW:KWD:dinar:0.31,' +
    'KG:KGS:som:87,LA:LAK:kíp:21800,LB:LBP:bảng Liban:89500,LS:LSL:loti:18,LR:LRD:đô la Liberia:190,LY:LYD:dinar:4.8,MG:MGA:ariary:4600,MW:MWK:kwacha:1735,' +
    'MY:MYR:ringgit:4.4,MV:MVR:rufiyaa:15.4,MR:MRU:ouguiya:40,MU:MUR:rupee Mauritius:46,MX:MXN:peso:18.5,MD:MDL:leu:17.8,MN:MNT:tugrik:3400,MA:MAD:dirham:9.9,' +
    'MZ:MZN:metical:64,MM:MMK:kyat:2100,NA:NAD:đô la Namibia:18,NP:NPR:rupee Nepal:135,NZ:NZD:đô la New Zealand:1.65,NI:NIO:córdoba:36.8,NG:NGN:naira:1550,' +
    'MK:MKD:denar:57,NO:NOK:krone:10.8,OM:OMR:rial:0.385,PK:PKR:rupee Pakistan:280,PG:PGK:kina:3.9,PY:PYG:guaraní:7800,PE:PEN:sol:3.75,PH:PHP:peso:57,' +
    'PL:PLN:złoty:4,QA:QAR:riyal:3.64,RO:RON:leu:4.6,RU:RUB:rúp:90,RW:RWF:franc Rwanda:1350,WS:WST:tala:2.7,ST:STN:dobra:22.5,SA:SAR:riyal:3.75,RS:RSD:dinar:108,' +
    'SC:SCR:rupee Seychelles:13.8,SL:SLE:leone:22.5,SG:SGD:đô la Singapore:1.33,SB:SBD:đô la Solomon:8.4,SO:SOS:shilling:570,ZA:ZAR:rand:18,SS:SSP:bảng Nam Sudan:1300,' +
    'LK:LKR:rupee Sri Lanka:300,SD:SDG:bảng Sudan:600,SR:SRD:đô la Suriname:35,SE:SEK:krona:10.5,SY:SYP:bảng Syria:13000,TJ:TJS:somoni:10.9,TZ:TZS:shilling:2650,' +
    'TH:THB:baht:35,TO:TOP:paʻanga:2.35,TT:TTD:đô la Trinidad:6.8,TN:TND:dinar:3.1,TR:TRY:lira:34,TM:TMT:manat:3.5,UG:UGX:shilling:3700,UA:UAH:hryvnia:41,' +
    'AE:AED:dirham:3.67,GB:GBP:bảng Anh:0.78,UY:UYU:peso:40,UZ:UZS:som:12800,VU:VUV:vatu:120,VE:VES:bolívar:40,VN:VND:đồng:25400,YE:YER:rial:530,ZM:ZMW:kwacha:27';
  var CUR = {};
  GROUPS.forEach(function (g) { g[0].split(',').forEach(function (c) { CUR[c] = { code: g[1], name: g[2], rate: g[3] }; }); });
  ONE.split(',').forEach(function (s) { var p = s.split(':'); CUR[p[0]] = { code: p[1], name: p[2], rate: +p[3] }; });
  var VND = 25400;

  // mức giá so với Mỹ (PPP → danh nghĩa), xấp xỉ theo GDP bình quân PPP (nghìn USD)
  function priceLevel(gdpk) { return Math.min(1.15, Math.max(0.28, 0.22 + 0.0095 * gdpk)); }

  function units(v, d) {
    var U = G.U, a = Math.abs(v);
    if (a >= 1e9) return U.fmtNum(v / 1e9, a >= 1e11 ? 0 : 1) + ' tỷ';
    if (a >= 1e6) return U.fmtNum(v / 1e6, a >= 1e8 ? 0 : 1) + ' triệu';
    return U.fmtNum(v, d || 0);
  }
  function fmtVND(trieu) { // số đo bằng triệu đồng
    var U = G.U, neg = trieu < 0, v = Math.abs(trieu), s;
    if (!isFinite(v)) return '—';
    v = Math.round(v * 1e6) / 1e6;
    if (v >= 999.95) s = U.fmtNum(v / 1000, 2) + ' tỷ đ';
    else if (v >= .99995) s = U.fmtNum(v, 2) + ' triệu đ';
    else if (v >= .001) s = U.fmtNum(v * 1000, 1) + 'k đ';
    else s = U.fmtNum(v * 1e6, 0) + ' đ';
    return (neg && v ? '−' : '') + s;
  }
  // v: USD PPP → chuỗi tiền bản địa (+ ≈ VND nếu muốn)
  function fmtLocal(code, gdpk, v, withVnd) {
    var c = CUR[code] || CUR.US;
    var nominal = v * priceLevel(gdpk), local = nominal * c.rate, neg = v < 0;
    var s = (neg ? '−' : '') + units(Math.abs(local)) + ' ' + c.code;
    if (withVnd && c.code !== 'VND') s += ' (≈ ' + fmtVND(nominal * VND / 1e6) + ')';
    return s;
  }
  function toVND(gdpk, v) { return v * priceLevel(gdpk) * VND / 1e6; } // triệu đồng

  G.CUR = { CUR: CUR, priceLevel: priceLevel, fmtLocal: fmtLocal, fmtVND: fmtVND, toVND: toVND, VND: VND };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
