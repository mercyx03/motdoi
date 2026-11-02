/* Một Đời — MD4 (8.10.22): danh tính dùng chung — nguồn gốc, ngoại hình tự nhiên, ngôn ngữ, họ tên.
   Mở rộng LIFE138 (ancestry, genes, hồ sơ người thân theo ID) và hệ chứng chỉ ngoại ngữ l.lang (wealth/life3), không thay thế.
   · D09: ngoại hình tự nhiên (sắc tóc, màu mắt, tông da) theo mô hình đa yếu tố giản lược từ cha mẹ sinh học: trung bình hai bên
     + biến thiên, có thể giống một bên; tạo một lần, không đổi khi đổi quốc tịch/chuyển nước. Tóc nhuộm/kính áp tròng là lớp riêng,
     không di truyền. Ngoại hình không tác động trí tuệ, đạo đức hay "nhan sắc".
   · D09/D12: ngôn ngữ là kỹ năng nghe–nói–đọc–viết 0..100, tăng theo tiếp xúc thật (nhà, trường, nơi sống, bạn bè) và tự học,
     hao hụt khi lâu không dùng; chứng chỉ (l.lang) là kết quả thi riêng có hạn — giấy hết hạn không làm mất kỹ năng.
     Ngôn ngữ ký hiệu theo từng quốc gia/cộng đồng, cùng mô hình kỹ năng, không suy một-một từ tiếng nói.
   · D13: tên pháp lý / hiển thị / lúc sinh / biệt danh, thành phần tên nhiều phần, thứ tự họ–tên theo văn hóa, lịch sử tên theo thời
     điểm; quy tắc đổi họ khi kết hôn theo nước (giữ / theo bạn đời / ghép) có thủ tục; giấy tờ cần cập nhật sau đổi tên.
   Hệ số ngẫu nhiên băm theo ID nhân vật (không tiêu RNG của game). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, L = E.LIFE138;
  if (!X || !L) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function rnd(seed) { var x = hash(seed) || 1; return function () { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; }; }
  function gauss(r) { return (r() + r() + r() - 1.5) / 0.5; }
  function cname(c) { return W.BY[c] ? W.BY[c].name : c; }
  function res(l) { return H.resCode(l); }
  function mo(l, v) { return H.money(l, v); }
  function st(l) { var s = l.flags.id919; if (!s || typeof s !== 'object') s = l.flags.id919 = { v: 1 }; if (!s.langs || typeof s.langs !== 'object') s.langs = {}; return s; }

  // ================= D09: ngoại hình tự nhiên =================
  // Ba thang liên tục 0..1 (càng cao càng sẫm/nhiều sắc tố) + biến thể sắc tố đỏ/lục; nhãn hiển thị là các dải trên thang.
  var BASE = { // nền theo vùng nguồn gốc khi không có dữ liệu cha mẹ: [tóc, mắt, da, đỏ, xanh lá]; tham số trò chơi
    east: [0.92, 0.9, 0.35, 0, 0.01], sea: [0.92, 0.92, 0.5, 0, 0.01], south: [0.9, 0.85, 0.6, 0, 0.04], mena: [0.85, 0.78, 0.45, 0.01, 0.06],
    nweu: [0.45, 0.35, 0.12, 0.08, 0.22], seu: [0.72, 0.62, 0.25, 0.02, 0.12], eeu: [0.55, 0.42, 0.15, 0.03, 0.2], afr: [0.97, 0.95, 0.82, 0, 0.005],
    lat: [0.8, 0.72, 0.42, 0.02, 0.06], pac: [0.9, 0.88, 0.58, 0, 0.01], mix: [0.75, 0.65, 0.4, 0.02, 0.08]
  };
  var REG = { VN: 'sea', TH: 'sea', ID: 'sea', PH: 'sea', MY: 'sea', KH: 'sea', LA: 'sea', MM: 'sea', SG: 'east', CN: 'east', JP: 'east', KR: 'east', TW: 'east', HK: 'east', MN: 'east',
    IN: 'south', PK: 'south', BD: 'south', LK: 'south', NP: 'south', SA: 'mena', EG: 'mena', IR: 'mena', TR: 'mena', MA: 'mena', DZ: 'mena', IQ: 'mena', AE: 'mena',
    GB: 'nweu', IE: 'nweu', DE: 'nweu', NL: 'nweu', BE: 'nweu', SE: 'nweu', NO: 'nweu', DK: 'nweu', FI: 'nweu', IS: 'nweu', AT: 'nweu', CH: 'nweu', FR: 'seu', ES: 'seu', IT: 'seu', PT: 'seu', GR: 'seu',
    PL: 'eeu', CZ: 'eeu', RU: 'eeu', UA: 'eeu', RO: 'eeu', HU: 'eeu', NG: 'afr', GH: 'afr', KE: 'afr', ET: 'afr', ZA: 'afr', SN: 'afr', TZ: 'afr', UG: 'afr',
    BR: 'lat', MX: 'lat', AR: 'lat', CO: 'lat', PE: 'lat', CL: 'lat', US: 'mix', CA: 'mix', AU: 'mix', NZ: 'mix', FJ: 'pac' };
  function base(cc) { return BASE[REG[cc] || 'mix']; }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  function founder(seed, cc) { var r = rnd(seed), b = base(cc); return { hair: clamp01(b[0] + gauss(r) * 0.08), eye: clamp01(b[1] + gauss(r) * 0.1), skin: clamp01(b[2] + gauss(r) * 0.08), red: r() < b[3], green: r() < b[4], src: 'founder' }; }
  // Con: mỗi thang = trung bình hai bên + lệch ngẫu nhiên, có lúc nghiêng hẳn về một bên; biến thể đỏ/lục chỉ khi ít nhất một bên mang.
  function child(seed, a, b) {
    var r = rnd(seed), w = r() < 0.3 ? (r() < 0.5 ? 0.8 : 0.2) : 0.5;
    function mix(k, sd) { return clamp01(a[k] * w + b[k] * (1 - w) + gauss(r) * sd); }
    var p = { hair: mix('hair', 0.08), eye: mix('eye', 0.1), skin: mix('skin', 0.05), src: 'parents' };
    p.red = (a.red || b.red) && r() < (a.red && b.red ? 0.5 : 0.15) && p.hair < 0.8; p.green = (a.green || b.green) && r() < 0.35 && p.eye < 0.7; return p;
  }
  function hairLabel(p) { if (p.red) return 'đỏ'; var h = p.hair; return h >= 0.9 ? 'đen' : h >= 0.78 ? 'đen nâu' : h >= 0.66 ? 'nâu đậm' : h >= 0.54 ? 'nâu vừa' : h >= 0.44 ? 'nâu sáng' : h >= 0.34 ? 'vàng đậm' : h >= 0.22 ? 'vàng vừa' : 'vàng nhạt'; }
  function eyeLabel(p) { var e = p.eye; if (p.green) return e < 0.4 ? 'xanh lá pha xanh dương' : 'xanh lá'; return e >= 0.88 ? 'nâu rất đậm' : e >= 0.74 ? 'nâu vừa' : e >= 0.62 ? 'nâu sáng' : e >= 0.52 ? 'hổ phách' : e >= 0.4 ? 'pha màu (hazel)' : e >= 0.3 ? 'xám' : 'xanh dương'; }
  function skinLabel(p) { var s = p.skin; return s >= 0.85 ? 'tông rất sẫm' : s >= 0.7 ? 'tông sẫm' : s >= 0.55 ? 'tông nâu' : s >= 0.42 ? 'tông ô liu / trung bình' : s >= 0.28 ? 'tông sáng vừa' : s >= 0.16 ? 'tông sáng' : 'tông rất sáng'; }
  function describe(p, dye) { return 'tóc ' + hairLabel(p) + (dye && dye.hair ? ' (đang nhuộm ' + dye.hair + ')' : '') + ', mắt ' + eyeLabel(p) + (dye && dye.lens ? ' (đeo kính áp tròng ' + dye.lens + ')' : '') + ', da ' + skinLabel(p); }
  // Người chơi: nhận từ cha mẹ (đời trước truyền qua childOpts) hoặc dựng từ nguồn gốc hai bên một lần.
  function pheno(l) {
    var s = st(l); if (s.pheno) return s.pheno; var anc = (L.state(l).ancestry || [l.country]), pa = s.parentsPheno;
    if (pa && pa.f && pa.m) s.pheno = child(l.id + ':pheno919', pa.f, pa.m);
    else { var f = founder(l.id + ':f919', anc[0] || l.country), m = founder(l.id + ':m919', anc[1] || anc[0] || l.country); s.parentsPheno = { f: f, m: m }; s.pheno = child(l.id + ':pheno919', f, m); }
    s.pheno.at = l.age; return s.pheno;
  }
  function partnerPheno(l, p) { if (!p) return null; if (!p.pheno919) p.pheno919 = founder(l.id + ':pp919:' + (p.relation108 || p.name), p.homeCountry || res(l)); return p.pheno919; }
  function kidPheno(l, k) {
    if (k.pheno919) return k.pheno919; var mine = pheno(l);
    if (k.adopted || k.adopt) { k.pheno919 = founder(l.id + ':kid919:' + (k.uid110 || k.name), k.originCountry || res(l)); k.pheno919.src = 'adopted'; return k.pheno919; }
    var mate = k.coParent108 || k.mate || l.partner; k.pheno919 = child(l.id + ':kid919:' + X.uid(l, k), mine, partnerPheno(l, mate) || founder(l.id + ':kmate919:' + X.uid(l, k), res(l))); return k.pheno919;
  }

  // ================= D09/D12: ngôn ngữ =================
  var LANG = { vi: 'tiếng Việt', en: 'tiếng Anh', fr: 'tiếng Pháp', de: 'tiếng Đức', es: 'tiếng Tây Ban Nha', it: 'tiếng Ý', pl: 'tiếng Ba Lan', cs: 'tiếng Séc', zh: 'tiếng Trung', ja: 'tiếng Nhật', ko: 'tiếng Hàn', hi: 'tiếng Hindi', ar: 'tiếng Ả Rập', pt: 'tiếng Bồ Đào Nha', ru: 'tiếng Nga', nl: 'tiếng Hà Lan', sv: 'tiếng Thụy Điển', fi: 'tiếng Phần Lan', th: 'tiếng Thái', id: 'tiếng Indonesia', ms: 'tiếng Mã Lai', tr: 'tiếng Thổ Nhĩ Kỳ', hu: 'tiếng Hungary', ro: 'tiếng Romania', sw: 'tiếng Swahili' };
  var SIGN = { VN: 'Ngôn ngữ ký hiệu Việt Nam', US: 'ASL (Mỹ)', CA: 'ASL / LSQ (Canada)', GB: 'BSL (Anh)', AU: 'Auslan (Úc)', NZ: 'NZSL', FR: 'LSF (Pháp)', DE: 'DGS (Đức)', JP: 'JSL (Nhật)', KR: 'KSL (Hàn)', CN: 'CSL (Trung Quốc)', IN: 'ISL (Ấn Độ)', ES: 'LSE (Tây Ban Nha)', IT: 'LIS (Ý)', BR: 'Libras (Brazil)' };
  var CL = { VN: 'vi', US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en', SG: 'en', FR: 'fr', BE: 'fr', DE: 'de', AT: 'de', CH: 'de', ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', IT: 'it', PL: 'pl', CZ: 'cs', CN: 'zh', TW: 'zh', HK: 'zh', JP: 'ja', KR: 'ko', IN: 'hi', SA: 'ar', EG: 'ar', AE: 'ar', MA: 'ar', PT: 'pt', BR: 'pt', RU: 'ru', NL: 'nl', SE: 'sv', FI: 'fi', TH: 'th', ID: 'id', MY: 'ms', TR: 'tr', HU: 'hu', RO: 'ro', NG: 'en', GH: 'en', KE: 'en', ZA: 'en', PH: 'en', TZ: 'sw', UG: 'en' };
  function langOf(cc) { return CL[cc] || 'en'; }
  function signOf(cc) { return 'sl:' + (SIGN[cc] ? cc : 'US'); }
  function lname(k) { return /^sl:/.test(k) ? SIGN[k.slice(3)] || 'ngôn ngữ ký hiệu' : LANG[k] || k; }
  function rec(l, k) { var s = st(l); return s.langs[k] || (s.langs[k] = { lis: 0, spk: 0, rd: 0, wr: 0, last: l.age }); }
  function skill(l, k) { var x = l && l.flags && l.flags.id919 && l.flags.id919.langs && l.flags.id919.langs[k]; if (!x) { var c = l && l.lang && l.lang[k] || 0; return c ? 20 + c * 12 : 0; } return /^sl:/.test(k) ? (x.lis + x.spk) / 2 : (x.lis + x.spk + x.rd + x.wr) / 4; }
  function band(v) { return v >= 90 ? 'như bản ngữ' : v >= 75 ? 'thành thạo' : v >= 60 ? 'khá' : v >= 45 ? 'giao tiếp được' : v >= 25 ? 'cơ bản' : v >= 8 ? 'hiểu vài câu' : 'chưa biết'; }
  // Nguồn tiếp xúc trong năm: [ngôn ngữ, mức] — mức là số điểm tối đa có thể tăng ở mỗi kỹ năng (đã có trần), trẻ nhỏ tiếp thu nhanh hơn.
  function exposure(l) {
    var s = st(l), out = {}, a = l.age, kid = a < 13 ? 1.4 : a < 18 ? 1.1 : a < 40 ? 0.85 : 0.65, here = langOf(res(l));
    function add(k, v) { if (k) out[k] = Math.max(out[k] || 0, v * kid); }
    add(here, l.abroad ? 7 : 9);
    (s.homeLangs || []).forEach(function (h) { if (l.age < 18 || s.homeUse === 'daily') add(h.k, h.use === 'daily' ? 8 : h.use === 'some' ? 4 : 1); });
    if (l.school && a >= 6) add('en', 2.5);
    if (s.study && !s.study.applied && s.study.at >= l.age - 1 && s.study.at < l.age) { add(s.study.k, s.study.gain); s.study.applied = true; } // kế hoạch chọn trong năm, tính vào lượt năm kế tiếp, một lần
    var p = l.partner; if (p && p.alive !== false && p.homeCountry && p.homeCountry !== res(l)) add(langOf(p.homeCountry), 2.5);
    (s.signHome || []).forEach(function (k) { add(k, 6); });
    return out;
  }
  function langYear(l) {
    var s = st(l); if (s.langAt === l.age) return; s.langAt = l.age;
    if (!s.homeLangs) initHome(l);
    var ex = exposure(l);
    Object.keys(ex).forEach(function (k) { var x = rec(l, k), g = ex[k]; ['lis', 'spk', 'rd', 'wr'].forEach(function (f, i) { if (/^sl:/.test(k) && i > 1) return; var room = 100 - x[f], gain = g * (0.4 + room / 100) * (f === 'lis' ? 1.15 : f === 'spk' ? 0.95 : l.age < 6 ? 0.1 : 0.8); x[f] = Math.min(100, x[f] + gain); }); x.last = l.age; });
    Object.keys(s.langs).forEach(function (k) { if (ex[k]) return; var x = s.langs[k], idle = l.age - (x.last || l.age); if (idle < 2) return; ['lis', 'spk', 'rd', 'wr'].forEach(function (f) { var floor = Math.min(x[f], 25 + (x.peak919 || 0) * 0.25); x[f] = Math.max(floor, x[f] - (f === 'spk' ? 3 : 1.5)); }); });
    Object.keys(s.langs).forEach(function (k) { var v = skill(l, k); s.langs[k].peak919 = Math.max(s.langs[k].peak919 || 0, v); });
  }
  // Ngôn ngữ trong nhà: theo người chăm sóc thực tế, không truyền như gen. Bản lưu cũ: chỉ ghi ngôn ngữ nơi sống, không suy thêm.
  function initHome(l) {
    var s = st(l), anc = L.state(l).ancestry || [l.country], here = langOf(l.country), out = [{ k: here, use: 'daily' }];
    if (l.age <= 1) anc.forEach(function (c, i) { var k = langOf(c); if (out.some(function (x) { return x.k === k; })) return; var r = rnd(l.id + ':home919:' + c)(); out.push({ k: k, use: r < 0.45 ? 'daily' : r < 0.8 ? 'some' : 'rare', who: i === 0 ? 'bố' : 'mẹ' }); });
    else s.legacyLang = true;
    s.homeLangs = out; if (!s.langs[here]) { var x = rec(l, here); if (l.age > 1) { var v = Math.min(95, 20 + l.age * 5); x.lis = x.spk = v; x.rd = x.wr = l.age >= 7 ? v - 5 : 0; } }
  }
  // Tự học: mỗi năm một kế hoạch, có trần tăng; không thể đạt bản ngữ trong một năm.
  var METHOD = { self: ['Tự học bằng sách, tài liệu miễn phí', 0, 3], app: ['Ứng dụng miễn phí', 0, 2.5], appPaid: ['Ứng dụng trả phí', 0.01, 4], center: ['Trung tâm ngoại ngữ', 0.04, 6], tutor: ['Gia sư riêng', 0.07, 7.5], exchange: ['Nhóm trao đổi, bạn quốc tế', 0.005, 5] };
  function studyWhy(l, k) { var s = st(l); if (s.study && s.study.at === l.age) return 'Đã có kế hoạch học năm nay'; return X.reason(l, 8); }
  function startStudy(l, k, m, log) { var M = METHOD[m], s = st(l), cost = l.base * M[1]; if (l.money < cost && l.indep) return false; if (cost > 0) H.cash(l, -cost, M[0] + ' — ' + lname(k)); var persist = 0.7 + rnd(l.id + ':persist919:' + l.age)() * 0.6; s.study = { k: k, m: m, at: l.age, gain: M[2] * persist }; log && log('Năm nay bạn học ' + lname(k) + ' (' + M[0].toLowerCase() + '). Tiến bộ tùy sự kiên trì; chứng chỉ là kỳ thi riêng, không bắt buộc để giao tiếp.', 'neutral'); return true; }
  // Kỹ năng thực tế giúp thi chứng chỉ (hệ có sẵn), không ngược lại.
  var study0 = H.studyLang; H.studyLang = function (l, k, r, log) { var before = l.lang && l.lang[k] || 0, b = typeof r === 'function' ? U.clamp((skill(l, k) - (35 + before * 10)) / 100, 0, 0.3) : 0; if (!b) return study0.apply(this, arguments); return study0.call(this, l, k, function () { return r() * (1 - b); }, log); };

  // ================= D13: họ tên =================
  var FAMFIRST = /^(VN|CN|TW|HK|JP|KR|HU|MN)$/;
  function nameRec(l) {
    var s = st(l); if (s.name && s.name.legal) return s.name;
    var full = String(l.name || '').trim(), order = FAMFIRST.test(l.country) ? 'family-first' : 'given-first', parts = full.split(/\s+/), sur = l.sur && full.indexOf(l.sur) >= 0 ? l.sur : order === 'family-first' ? parts[0] : parts[parts.length - 1];
    s.name = { legal: full, display: full, birth: full, family: [sur], order: order, nick: '', hist: [{ at: l.age, legal: full, why: 'lúc sinh' }], docs: [] }; return s.name;
  }
  function validName(t, cc) {
    t = String(t == null ? '' : t); var s = t.trim();
    if (!s) return 'Tên không được để trống'; if (s.length > 80) return 'Tên quá dài (tối đa 80 ký tự)';
    if (/[\u0000-\u001f\u007f<>{}\[\]\\|`$]/.test(s)) return 'Tên có ký tự không hợp lệ';
    if (!/^[\p{L}\p{M}][\p{L}\p{M}\s'’\-.·]*$/u.test(s)) return 'Tên chỉ gồm chữ cái (có dấu), khoảng trắng, dấu nháy, gạch nối';
    if (cc === 'VN' && s.length < 2) return 'Họ tên quá ngắn'; return true;
  }
  function setLegal(l, t, why) { var n = nameRec(l), s = String(t).trim().replace(/\s+/g, ' '); if (s === n.legal) return false; n.hist.push({ at: l.age, legal: s, why: why }); n.legal = s; n.display = s; l.name = s; n.docs = ['hộ chiếu', 'bằng cấp', 'tài khoản ngân hàng', 'giấy tờ nhà đất'].filter(function (d, i) { return i < 2 || l.indep; }); return true; }
  // Quy tắc đổi họ khi kết hôn (lựa chọn khả dụng + ghi chú nguồn). keep: giữ · take: theo bạn đời · double: ghép hai họ.
  var MARRY = {
    VN: { opts: ['keep'], note: 'Việt Nam: vợ chồng giữ họ của mình; không có thủ tục đổi họ theo vợ/chồng.' }, CN: { opts: ['keep'], note: 'Trung Quốc: thường giữ họ riêng.' }, KR: { opts: ['keep'], note: 'Hàn Quốc: vợ chồng giữ họ khai sinh.' },
    JP: { opts: ['same'], intl: ['keep', 'take'], note: 'Nhật: vợ chồng cùng là người Nhật phải dùng chung một họ (Bộ luật Dân sự điều 750). Hôn nhân với người nước ngoài: giữ họ, có thể khai đổi theo họ người kia trong 6 tháng.' },
    DE: { opts: ['keep', 'take', 'double'], note: 'Đức (luật mới từ 1/5/2025): giữ họ riêng, chọn một họ chung, hoặc họ ghép tối đa hai phần.' },
    US: { opts: ['keep', 'take', 'double'], note: 'Mỹ: tự chọn giữ, theo họ người kia hoặc ghép; thủ tục theo bang.' }, GB: { opts: ['keep', 'take', 'double'], note: 'Anh: tự chọn; đổi trên giấy tờ bằng giấy đăng ký kết hôn hoặc deed poll.' },
    CA: { opts: ['keep', 'take', 'double'], note: 'Canada: tùy tỉnh; một số tỉnh (Québec) giữ họ khai sinh trên giấy tờ pháp lý.' }, AU: { opts: ['keep', 'take', 'double'], note: 'Úc: tự chọn.' }, NZ: { opts: ['keep', 'take', 'double'], note: 'New Zealand: tự chọn.' }, IE: { opts: ['keep', 'take', 'double'], note: 'Ireland: tự chọn.' },
    FR: { opts: ['keep', 'use'], note: 'Pháp: họ pháp lý giữ nguyên; có thể dùng họ người kia làm tên sử dụng.' }, ES: { opts: ['keep'], note: 'Tây Ban Nha: giữ nguyên hai họ khai sinh.' }, MX: { opts: ['keep'], note: 'Mexico: thường giữ họ khai sinh trên giấy tờ.' },
    BR: { opts: ['keep', 'add'], note: 'Brazil: có thể thêm họ của người kia (mức nguồn thứ cấp).' }, PT: { opts: ['keep', 'add'], note: 'Bồ Đào Nha: có thể thêm họ người kia (nguồn thứ cấp).' },
    SE: { opts: ['keep', 'take', 'double'], note: 'Thụy Điển: tự chọn theo luật tên.' }, NO: { opts: ['keep', 'take', 'double'], note: 'Na Uy: tự chọn.' }, DK: { opts: ['keep', 'take', 'double'], note: 'Đan Mạch: tự chọn.' }, FI: { opts: ['keep', 'take', 'double'], note: 'Phần Lan: tự chọn.' },
    ZA: { opts: ['keep', 'take', 'double'], note: 'Nam Phi: cả hai vợ chồng đều có thể giữ, đổi theo người kia hoặc ghép (theo phán quyết của Tòa Hiến pháp; xem ngày hiệu lực).' },
    SA: { opts: ['keep'], note: 'Ả Rập Xê Út: giữ tên dòng họ.' }, EG: { opts: ['keep'], note: 'Ai Cập: giữ tên dòng họ.' }, MA: { opts: ['keep'], note: 'Morocco: giữ họ.' }
  };
  function marryRule(cc) { return MARRY[cc] || { opts: ['keep', 'take'], note: 'Quy định ' + cname(cc) + ' chưa xác minh chi tiết; trò chơi cho giữ họ hoặc theo họ bạn đời.' }; }
  function surnameOf(name, cc) { var p = String(name || '').trim().split(/\s+/); return FAMFIRST.test(cc) ? p[0] : p[p.length - 1]; }
  function givenOf(l) { var n = nameRec(l), f = n.family.join(' '); return n.legal.replace(f, '').trim() || n.legal; }
  function compose(l, fam) { var n = nameRec(l), g = givenOf(l); return n.order === 'family-first' ? fam + ' ' + g : g + ' ' + fam; }
  function marryOptions(l) {
    var p = l.partner, cc = res(l), rule = marryRule(cc), intl = p && p.homeCountry && p.homeCountry !== l.country, o = (rule.intl && intl ? rule.intl : rule.opts).slice(), ps = surnameOf(p && p.name, p && p.homeCountry || cc), mine = nameRec(l).family.join(' ');
    var out = [];
    o.forEach(function (k) {
      if (k === 'keep') out.push({ k: 'keep', l: 'Giữ họ ' + mine, fam: null });
      if (k === 'take' && ps && ps !== mine) out.push({ k: 'take', l: 'Đổi sang họ ' + ps + ' của ' + p.name, fam: [ps] });
      if (k === 'double' && ps && ps !== mine) out.push({ k: 'double', l: 'Dùng họ ghép ' + mine + '-' + ps, fam: [mine + '-' + ps] });
      if (k === 'add' && ps && ps !== mine) out.push({ k: 'add', l: 'Thêm họ ' + ps + ' vào sau họ của mình', fam: [mine, ps] });
      if (k === 'use' && ps && ps !== mine) out.push({ k: 'use', l: 'Giữ họ pháp lý, dùng họ ' + ps + ' trong giao tiếp', use: ps });
      if (k === 'same') { out.push({ k: 'keep', l: 'Hai người dùng chung họ ' + mine, fam: null, sameMine: true }); if (ps && ps !== mine) out.push({ k: 'take', l: 'Hai người dùng chung họ ' + ps, fam: [ps] }); }
    });
    return out;
  }
  E.SC('surname919', { title: 'Họ tên sau khi kết hôn', valid: function (l) { var p = l.partner; return l.alive && p && p.status === 'married' && st(l).marriedName !== (p.relation108 || p.name); },
    text: function (l) { var rule = marryRule(res(l)); return rule.note + ' Mỗi người tự quyết với tên của mình; đổi họ là thủ tục pháp lý, giấy tờ cần cập nhật sau đó. Không đổi ID, tài sản, gia phả hay quan hệ.'; },
    opts: [0, 1, 2, 3].map(function (i) { return { k: 'o' + i, req: function (l) { return !!marryOptions(l)[i]; }, l: function (l) { var x = marryOptions(l)[i]; return x ? x.l : ''; }, run: function (l, r, log) {
      var x = marryOptions(l)[i], p = l.partner; if (!x || !p) return; var s = st(l), key = p.relation108 || p.name; if (s.marriedName === key) return; s.marriedName = key; var n = nameRec(l);
      if (x.fam) { var t = compose(l, x.fam.join(' ')), v = validName(t, res(l)); if (v === true) { n.family = x.fam.slice(); setLegal(l, t, 'kết hôn với ' + p.name); H.cash(l, -l.base * 0.005, 'Thủ tục đổi họ, cập nhật giấy tờ'); log('Bạn đổi tên pháp lý thành ' + t + '. Hộ chiếu, bằng cấp và hồ sơ cần cập nhật; tài sản và quan hệ giữ nguyên.', 'neutral'); } }
      else if (x.use) { n.display = compose(l, x.use); log('Bạn giữ họ pháp lý, dùng tên ' + n.display + ' trong giao tiếp.', 'neutral'); }
      else log('Bạn giữ họ của mình sau khi kết hôn.', 'neutral');
      if (x.sameMine && p) p.sur919 = n.family.join(' ');
    } }; }) });

  // ================= Menu =================
  X.menu('identity919', 'Danh tính: nguồn gốc, ngoại hình, ngôn ngữ, họ tên', function (l) { return X.reason(l, 6); }, function (l) {
    var s = st(l), n = nameRec(l), p = pheno(l), b = L.state(l);
    var langs = Object.keys(s.langs).map(function (k) { return { k: k, v: skill(l, k) }; }).filter(function (x) { return x.v >= 5; }).sort(function (a, b) { return b.v - a.v; });
    return 'Tên pháp lý: ' + n.legal + (n.display !== n.legal ? ' · tên thường dùng: ' + n.display : '') + (n.nick ? ' · biệt danh: ' + n.nick : '') + (n.birth !== n.legal ? ' · tên lúc sinh: ' + n.birth : '') + ' (thứ tự ' + (n.order === 'family-first' ? 'họ trước tên' : 'tên trước họ') + ').' +
      (n.docs && n.docs.length ? '\nGiấy tờ cần cập nhật theo tên mới: ' + n.docs.join(', ') + '.' : '') +
      '\nQuốc tịch: ' + (E.GLOBAL919 ? E.GLOBAL919.citizenships(l) : [l.country]).map(cname).join(', ') + ' · Đang sống: ' + cname(res(l)) + ' · Nguồn gốc gia đình: ' + (b.ancestry || [l.country]).map(cname).join(' – ') + '.' +
      '\nNgoại hình tự nhiên: ' + describe(p, s.dye) + '. Ngoại hình không quyết định quốc tịch, tính cách hay năng lực.' +
      '\nNgôn ngữ: ' + (langs.map(function (x) { var c = l.lang && l.lang[x.k] ? ' · chứng chỉ ' + H.langCert(l, x.k) + (E.certValid(l, x.k) ? '' : ' (hết hạn — kỹ năng vẫn còn)') : ''; return lname(x.k) + ' ' + band(x.v) + c; }).join('; ') || 'chưa ghi nhận') + '.' +
      (s.study && s.study.at === l.age ? '\nĐang học: ' + lname(s.study.k) + ' (' + METHOD[s.study.m][0].toLowerCase() + ').' : '');
  }, function (l, arg) {
    var s = st(l), out = [];
    if (arg && arg.learn) return Object.keys(METHOD).map(function (m) { var M = METHOD[m], c = l.base * M[1]; return { k: m, l: M[0], h: c ? mo(l, c) + '/năm' : 'Miễn phí', why: studyWhy(l, arg.learn) !== true ? studyWhy(l, arg.learn) : l.indep && l.money < c ? 'Chưa đủ tiền' : !l.indep && c > l.base * 0.02 && l.fam && l.fam.q <= 2 ? 'Gia đình chưa kham nổi khoản này' : true, run: function (l, r, log) { startStudy(l, arg.learn, m, log); } }; });
    var want = ['en', 'fr', 'de', 'es', 'it', 'pl', 'cs', 'zh', 'ja', 'ko'].concat([langOf(res(l))]).concat(l.partner && l.partner.homeCountry ? [langOf(l.partner.homeCountry)] : []);
    want.filter(function (k, i) { return want.indexOf(k) === i; }).forEach(function (k) { out.push({ k: 'learn:' + k, l: 'Học ' + lname(k) + ' (' + band(skill(l, k)) + ')', why: studyWhy(l, k), run: function (l, r) { X.next(l, 'identity919', r, { learn: k }); } }); });
    var sl = signOf(res(l)); out.push({ k: 'learn:' + sl, l: 'Học ' + lname(sl) + ' (' + band(skill(l, sl)) + ')', why: studyWhy(l, sl), run: function (l, r) { X.next(l, 'identity919', r, { learn: sl }); } });
    if (l.age >= 14) { out.push({ k: 'dye', l: s.dye && s.dye.hair ? 'Thôi nhuộm tóc (trở về màu tự nhiên dần)' : 'Nhuộm tóc màu khác', h: s.dye && s.dye.hair ? '' : mo(l, l.base * 0.004), run: function (l, r, log) { var d = st(l).dye || (st(l).dye = {}); if (d.hair) { d.hair = null; log('Bạn để tóc mọc lại màu tự nhiên.', 'neutral'); return; } d.hair = ['nâu hạt dẻ', 'vàng khói', 'đỏ rượu', 'bạch kim', 'xanh rêu'][Math.floor(r() * 5)]; H.cash(l, -l.base * 0.004, 'Nhuộm tóc'); log('Bạn nhuộm tóc ' + d.hair + '. Màu nhuộm không di truyền cho con.', 'neutral'); } }); }
    if (l.age >= 18) {
      out.push({ k: 'nick', l: 'Đặt biệt danh / tên thường gọi', run: function (l, r, log) { var n = nameRec(l), g = givenOf(l).split(/\s+/).pop(); n.nick = n.nick ? '' : g; log(n.nick ? 'Bạn bè gọi bạn là ' + n.nick + '.' : 'Bỏ biệt danh.', 'neutral'); } });
      var fee = l.base * 0.01, rule = marryRule(res(l));
      out.push({ k: 'legal', l: 'Đổi tên pháp lý (đổi tên gọi, giữ họ)', h: 'Thủ tục ~' + mo(l, fee) + (res(l) === 'VN' ? ' · Việt Nam chỉ chấp thuận khi có lý do chính đáng' : ''), why: nameRec(l).changedAt != null && l.age - nameRec(l).changedAt < 5 ? 'Vừa đổi tên gần đây' : l.money < fee ? 'Chưa đủ lệ phí' : true, run: function (l, r, log) {
        var n = nameRec(l), cc = res(l), rr = rnd(l.id + ':rename919:' + l.age); if (cc === 'VN' && rr() < 0.5) { H.cash(l, -fee * 0.3, 'Hồ sơ đổi tên'); n.changedAt = l.age; log('Hồ sơ đổi tên chưa được chấp thuận: cần lý do chính đáng (tên gây nhầm lẫn, ảnh hưởng tình cảm gia đình…).', 'neutral'); return; }
        var nm = N(l, rr), t = compose(l, n.family.join(' ')).replace(givenOf(l), nm), v = validName(t, cc); if (v !== true) return; H.cash(l, -fee, 'Thủ tục đổi tên'); n.changedAt = l.age; setLegal(l, t, 'tự đổi tên'); log('Tên pháp lý mới: ' + t + '. Cần cập nhật hộ chiếu, bằng cấp; mọi quan hệ, tài sản giữ nguyên.', 'neutral');
      } });
      if (nameRec(l).docs && nameRec(l).docs.length) out.push({ k: 'docs', l: 'Cập nhật giấy tờ theo tên mới (' + nameRec(l).docs.join(', ') + ')', h: mo(l, l.base * 0.005), run: function (l, r, log) { var n = nameRec(l); H.cash(l, -l.base * 0.005, 'Cập nhật giấy tờ sau đổi tên'); n.docs = []; var tp = l.flags.travel918 && l.flags.travel918.passport; if (tp) tp.name919 = n.legal; log('Đã cập nhật giấy tờ theo tên ' + n.legal + '.', 'good'); } });
    }
    return out;
  }, 6, 'Bản thân');
  function N(l, r) { var sex = l.sex === 'F' ? 'F' : 'M', full = H.name ? H.name(l, r, sex).full : l.name; var p = String(full).split(/\s+/); return FAMFIRST.test(l.country) ? p.slice(1).join(' ') : p.slice(0, -1).join(' ') || p[0]; }

  // ================= hook năm, sinh con, đời con =================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return;
    pheno(l); nameRec(l); langYear(l);
    var s = st(l), p = l.partner; if (p && p.status === 'married' && s.marriedName !== (p.relation108 || p.name) && s.askName !== (p.relation108 || p.name)) { s.askName = p.relation108 || p.name; if (marryOptions(l).length > 1) l.pending.push(E.DEC.surname919.make(l, r)); else s.marriedName = s.askName; }
    (l.kids || []).forEach(function (k) { if (k.alive !== false) kidPheno(l, k); });
  });
  var child0 = E.childOpts; if (child0) E.childOpts = function (l, k) { var o = child0.apply(this, arguments); if (o && o.parent && l.flags.id919) { var mate = k.coParent108 || k.mate || l.partner; o.parent.id919 = { pheno: kidPheno(l, k), parents: { f: l.sex === 'M' ? pheno(l) : partnerPheno(l, mate), m: l.sex === 'F' ? pheno(l) : partnerPheno(l, mate) }, familyRes: [res(l)] }; } return o; };
  var create0 = E.createLife; E.createLife = function (o) { var l = create0.apply(this, arguments), q = o && o.parent && o.parent.id919; if (l && l.flags && q) { var s = st(l); if (q.parents && q.parents.f && q.parents.m) s.parentsPheno = JSON.parse(JSON.stringify(q.parents)); if (q.pheno) s.pheno = JSON.parse(JSON.stringify(q.pheno)); s.familyRes = q.familyRes; } return l; };
  var prof0 = E.profile; E.profile = function (l) { var p = prof0.apply(this, arguments); if (p && p.jobInfo && l.flags && l.flags.id919 && l.flags.id919.pheno) p.jobInfo.push('Ngoại hình tự nhiên: ' + describe(l.flags.id919.pheno, l.flags.id919.dye)); return p; };
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.id919 != null && typeof l.flags.id919 !== 'object') delete l.flags.id919; };
  E.ID919 = { pheno: pheno, kidPheno: kidPheno, partnerPheno: partnerPheno, founder: founder, child: child, hairLabel: hairLabel, eyeLabel: eyeLabel, skinLabel: skinLabel, describe: describe, skill: skill, rec: rec, band: band, langOf: langOf, signOf: signOf, lname: lname, langYear: langYear, exposure: exposure, startStudy: startStudy, METHOD: METHOD, nameRec: nameRec, validName: validName, setLegal: setLegal, marryRule: marryRule, marryOptions: marryOptions, MARRY: MARRY, state: st, SIGN: SIGN };
})(globalThis.G);
