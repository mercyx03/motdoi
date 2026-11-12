/* Một Đời — MD4 (8.10.22): đời sống đa quốc gia. Mở rộng hệ sẵn có, không tạo sổ quốc tịch/visa thứ hai.
   · D11: quê nhà/điểm về thăm theo quốc tịch, nơi sinh và nơi gia đình sống (travel-context dùng E.GLOBAL919.homes);
     chương trình du học 22 điểm đến (life107 đọc học phí/ngôn ngữ/học bổng từ đây); trường, học bổng, visa là ba bước riêng.
   · D12: tuyến lao động quốc tế có hợp đồng/giấy phép/phí trần; công nhận bằng nghề được quản lý; đoàn tụ/bảo lãnh vợ chồng
     theo hồ sơ có giai đoạn (nộp → có thể yêu cầu bổ sung → quyết định), không tự cấp thường trú/quốc tịch.
   · D16: pool gặp gỡ theo nơi đang sống/học (bản xứ, quốc tế, đồng hương) và bộ lọc; quốc tịch người gặp lưu một lần theo ID;
     quy tắc quốc tịch con theo nước; giấy tờ đi lại của từng thành viên gia đình; chọn nơi sống sau cưới.
   Mọi tỷ trọng pool, thời gian xử lý, tỷ lệ chấp thuận là tham số gameplay; học phí/quy định ghi mức nguồn ở docs/MD4-SOURCES.md.
   Số ngẫu nhiên của quyết định hồ sơ băm theo nhân vật + năm (không tiêu RNG của game, tải lại không đổi). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W, N = G.NAMES;
  if (!X || !W) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(l, tag) { return hash(l.id + ':g919:' + tag) / 4294967296; }
  function cname(c) { return W.BY[c] ? W.BY[c].name : c; }
  function res(l) { return H.resCode(l); }
  function mo(l, v) { return H.money(l, v); }
  function usd(l, v) { return E.usdToLocal ? E.usdToLocal(l, v) : v / 4000 * l.base; }
  function st(l) { var s = l.flags.global919; if (!s || typeof s !== 'object') s = l.flags.global919 = { v: 1, met: {}, pref: 'any', track: {}, labor: null, res: null, famVisa: {}, cits: {} }; ['met', 'track', 'famVisa', 'cits'].forEach(function (k) { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; }); return s; }
  function citizenships(l) { var a = [l.country].concat(l.flags.citizen || []); return a.filter(function (c, i) { return c && W.BY[c] && a.indexOf(c) === i; }); }

  // ================= D11: quê nhà và điểm về thăm =================
  // Quê nhà = quốc gia gốc (khai sinh) + quốc tịch đã có + nơi bố mẹ đang sống (nếu đã ghi nhận). Không suy từ ngôn ngữ giao diện.
  function homes(l) {
    var a = citizenships(l), fr = l.flags.id919 && l.flags.id919.familyRes;
    (Array.isArray(fr) ? fr : []).forEach(function (c) { if (W.BY[c] && a.indexOf(c) < 0) a.push(c); });
    return a;
  }

  // ================= D11: chương trình du học =================
  // usd: học phí/năm cho sinh viên quốc tế ngoài khối miễn trừ (tham chiếu 2024–2025, mức trung bình); live: sinh hoạt/năm;
  // instr: ngôn ngữ giảng dạy có thể chọn; local: học phí khi học bằng tiếng bản địa (null = như học phí chung); work: quyền làm thêm; stay: ở lại tìm việc.
  var P = {
    US: { usd: 30000, live: 18000, instr: ['en'], work: 'làm trong trường tối đa 20 giờ/tuần khi đang học', stay: 'OPT 12 tháng (ngành STEM thêm tối đa 24 tháng)', schol: [0.25, 0.5], full: false },
    GB: { usd: 24000, live: 16000, instr: ['en'], work: 'tối đa 20 giờ/tuần trong kỳ học (bậc đại học)', stay: 'Graduate route 24 tháng; công bố 2025 rút còn 18 tháng cho hồ sơ từ 2027 (dự báo)', schol: [0.25, 0.5], full: false },
    CA: { usd: 25000, live: 15000, instr: ['en', 'fr'], work: 'tối đa 24 giờ/tuần ngoài trường trong kỳ học (từ 11/2024)', stay: 'PGWP tùy độ dài khóa, tối đa 3 năm', schol: [0.25, 0.5], full: false },
    AU: { usd: 30000, live: 18000, instr: ['en'], work: 'tối đa 48 giờ/2 tuần trong kỳ học', stay: 'Temporary Graduate 2–3 năm tùy bậc', schol: [0.25, 0.5], full: false },
    DE: { usd: 0, fee: 350, bw: 3300, live: 13000, instr: ['de', 'en'], work: '140 ngày toàn thời gian hoặc 280 nửa ngày/năm', stay: 'tìm việc tối đa 18 tháng sau tốt nghiệp', schol: [], living: true, note: 'Đại học công lập phần lớn miễn học phí, đóng phí học kỳ; bang Baden-Württemberg thu khoảng 1.500 €/học kỳ với sinh viên ngoài EU. Có học bổng sinh hoạt (ví dụ DAAD), không mặc định mọi trường đều miễn.' },
    FR: { usd: 3100, master: 4200, live: 12000, instr: ['fr', 'en'], work: 'tối đa 964 giờ/năm', stay: 'giấy phép tìm việc 12 tháng sau thạc sĩ', schol: [0.5, 1], note: 'Học phí phân biệt cho sinh viên ngoài EU tại trường công (khoảng 2.895 €/năm cử nhân, 3.941 €/năm thạc sĩ), nhiều trường có miễn giảm.' },
    BE: { usd: 4800, live: 12000, instr: ['fr', 'nl', 'en'], work: 'tối đa 20 giờ/tuần trong kỳ học', stay: 'tìm việc 12 tháng', schol: [0.5] },
    CH: { usd: 4000, live: 25000, instr: ['de', 'fr', 'it', 'en'], work: 'tối đa 15 giờ/tuần trong kỳ học', stay: '6 tháng tìm việc', schol: [0.5, 1], note: 'Ngôn ngữ giảng dạy theo vùng (Đức, Pháp, Ý); thạc sĩ có nhiều chương trình tiếng Anh.' },
    ES: { usd: 3000, live: 11000, instr: ['es', 'en'], work: 'tối đa 30 giờ/tuần (từ 2024)', stay: 'tìm việc 12 tháng', schol: [0.5] },
    PL: { usd: 3500, local: 0, live: 9000, instr: ['pl', 'en'], work: 'được làm thêm khi có thẻ cư trú học tập', stay: 'tìm việc 9 tháng', schol: [0.5, 1], note: 'Học bằng tiếng Ba Lan tại trường công miễn phí cho nhóm đủ điều kiện (ví dụ có Karta Polaka); người nước ngoài khác có thể vẫn phải trả.' },
    CZ: { usd: 4000, local: 0, live: 10000, instr: ['cs', 'en'], work: 'được làm thêm không cần giấy phép riêng khi học hệ chính quy', stay: 'tìm việc 9 tháng', schol: [0.5], note: 'Chương trình tiếng Séc tại trường công không thu học phí bất kể quốc tịch; chương trình tiếng Anh có học phí.' },
    AT: { usd: 1600, live: 14000, instr: ['de', 'en'], work: 'tối đa 20 giờ/tuần', stay: '12 tháng tìm việc', schol: [0.5] },
    SE: { usd: 14000, live: 12000, instr: ['en', 'sv'], work: 'không giới hạn giờ khi có giấy phép cư trú học tập', stay: '12 tháng tìm việc', schol: [0.75, 1] },
    FI: { usd: 12000, live: 11000, instr: ['en', 'fi'], work: 'trung bình 30 giờ/tuần', stay: '2 năm tìm việc', schol: [0.5, 1] },
    NL: { usd: 15000, live: 14000, instr: ['en', 'nl'], work: 'tối đa 16 giờ/tuần hoặc toàn thời gian mùa hè', stay: 'Orientation year 12 tháng', schol: [0.25, 0.5] },
    SG: { usd: 25000, live: 15000, instr: ['en'], work: 'tối đa 16 giờ/tuần trong kỳ học (trường được phép)', stay: 'không có visa tìm việc riêng; cần giấy phép lao động', schol: [0.5, 1], note: 'Trợ cấp học phí có thể kèm cam kết làm việc tại Singapore 3 năm.' },
    CN: { usd: 4000, live: 7000, instr: ['zh', 'en'], work: 'làm thêm cần trường và cơ quan xuất nhập cảnh cho phép', stay: 'cần giấy phép lao động', schol: [0.5, 1], full: true, fullName: 'học bổng Chính phủ Trung Quốc' },
    TW: { usd: 4000, live: 8000, instr: ['zh', 'en'], work: 'tối đa 20 giờ/tuần khi có giấy phép', stay: 'tìm việc tối đa 1 năm', schol: [0.5, 1], full: true, fullName: 'học bổng Đài Loan (MOE/ICDF)' },
    HK: { usd: 20000, live: 15000, instr: ['en', 'zh'], work: 'làm thêm hạn chế (trong trường / mùa hè)', stay: 'IANG 24 tháng', schol: [0.5, 1] },
    MY: { usd: 5000, live: 6000, instr: ['en', 'ms'], work: 'chỉ làm thêm trong kỳ nghỉ, tối đa 20 giờ/tuần', stay: 'cần giấy phép lao động', schol: [0.5] },
    JP: { usd: 5000, live: 12000, instr: ['ja', 'en'], work: 'tối đa 28 giờ/tuần khi có giấy phép', stay: 'chuyển sang visa tìm việc 6–12 tháng', schol: [0.5, 1], full: true, fullName: 'học bổng MEXT' },
    KR: { usd: 5000, live: 10000, instr: ['ko', 'en'], work: 'khoảng 20–25 giờ/tuần khi có giấy phép', stay: 'D-10 tìm việc', schol: [0.5, 1], full: true, fullName: 'học bổng GKS' },
    IT: { usd: 3000, live: 11000, instr: ['it', 'en'], work: 'tối đa 20 giờ/tuần', stay: '12 tháng tìm việc', schol: [0.5, 1] }
  };
  var UNIS = { BE: ['KU Leuven', 'Université libre de Bruxelles'], CH: ['ETH Zürich', 'Université de Genève'], ES: ['Universidad de Barcelona', 'Universidad Complutense de Madrid'], PL: ['University of Warsaw', 'Jagiellonian University'], CZ: ['Charles University', 'Czech Technical University in Prague'], AT: ['University of Vienna', 'TU Wien'], SE: ['Lund University', 'KTH Royal Institute of Technology'], FI: ['University of Helsinki', 'Aalto University'], NL: ['University of Amsterdam', 'Delft University of Technology'], SG: ['National University of Singapore', 'Nanyang Technological University'], CN: ['Fudan University', 'Zhejiang University'], TW: ['National Taiwan University', 'National Cheng Kung University'], HK: ['The University of Hong Kong', 'The Chinese University of Hong Kong'], MY: ['Universiti Malaya', 'Universiti Putra Malaysia'], IT: ['Università di Bologna', 'Politecnico di Milano'] };
  var LANGNAME = { en: 'tiếng Anh', de: 'tiếng Đức', fr: 'tiếng Pháp', it: 'tiếng Ý', es: 'tiếng Tây Ban Nha', pl: 'tiếng Ba Lan', cs: 'tiếng Séc', nl: 'tiếng Hà Lan', sv: 'tiếng Thụy Điển', fi: 'tiếng Phần Lan', zh: 'tiếng Trung', ja: 'tiếng Nhật', ko: 'tiếng Hàn', ms: 'tiếng Mã Lai' };
  function program(code, lv, track) {
    var p = P[code]; if (!p) return null; var t = track && p.instr.indexOf(track) >= 0 ? track : p.instr[0];
    var annual = p.local != null && t !== 'en' && t === p.instr[0] ? p.local : lv === 6 && p.master ? p.master : p.usd;
    return { code: code, track: t, years: lv === 6 ? 2 : lv === 7 ? 4 : code === 'GB' ? 3 : 4, tuitionUsd: annual + (p.fee || 0), liveUsd: p.live, p: p };
  }
  function trackOf(l, code) { var t = st(l).track[code]; return P[code] && P[code].instr.indexOf(t) >= 0 ? t : P[code] ? P[code].instr[0] : 'en'; }
  // Kỹ năng ngôn ngữ giảng dạy: chứng chỉ còn hạn (hệ có sẵn) hoặc kỹ năng thực tế (identity919) — 2 trên thang chứng chỉ ≈ 55 kỹ năng.
  function instrLevel(l, k) { var cert = E.certValid && E.certValid(l, k) ? (l.lang && l.lang[k]) || 0 : 0, sk = E.ID919 ? E.ID919.skill(l, k) : 0; return Math.max(cert, sk >= 75 ? 4 : sk >= 65 ? 3 : sk >= 55 ? 2 : sk >= 40 ? 1 : 0); }
  function tuitionTotal(l, d) { var q = program(d.country, d.lv, trackOf(l, d.country)); return q ? usd(l, q.tuitionUsd * q.years) : l.base * (d.lv === 6 ? 2 : 4); }
  // Xét tuyển và xét học bổng là hai kết quả riêng (life107 gọi). Ngôn ngữ giảng dạy là điều kiện của chương trình.
  function admit(l, d, r) {
    var t = trackOf(l, d.country), lv = instrLevel(l, t), need = t === 'en' ? 2 : 3;
    if (lv < need) return { ok: false, why: 'Chương trình dạy bằng ' + (LANGNAME[t] || t) + ' yêu cầu trình độ tương đương ' + (need === 2 ? 'B1–B2' : 'B2') + '; hồ sơ hiện chưa đạt.' };
    var x = U.clamp(0.45 + (l.st.kno - 50) / 100 + (lv - need) * 0.05 + (l.edu >= 5 ? 0.05 : 0), 0.12, 0.92);
    return { ok: (r ? r() : u(l, 'adm:' + d.country + ':' + d.lv + ':' + l.age)) < x, chance: x, track: t };
  }
  function scholarship(l, d, r) {
    var p = P[d.country]; if (!p) return { pct: 0 };
    var merit = U.clamp((l.st.kno - 55) / 40 + (l.edu >= 5 ? 0.1 : 0), 0, 1), roll = r ? r() : u(l, 'sch:' + d.country + ':' + d.lv + ':' + l.age);
    if (p.full && roll < 0.04 + merit * 0.12) return { pct: 1, cover: 'full', name: p.fullName };
    var tiers = (p.schol || []).slice().sort(function (a, b) { return b - a; });
    for (var i = 0; i < tiers.length; i++) if (roll < 0.06 + merit * (0.18 + i * 0.12)) return { pct: tiers[i], cover: 'tuition' };
    return { pct: 0, cover: null };
  }

  // ================= D16.1: pool gặp gỡ theo nơi đang sống =================
  var INTL = ['CN', 'IN', 'VN', 'KR', 'US', 'DE', 'FR', 'NG', 'BR', 'ID', 'JP', 'MX', 'IT', 'ES', 'TR', 'PH', 'PK', 'GB'];
  var CTX = { campus: { local: 0.45, intl: 0.25, compat: 0.30 }, work: { local: 0.55, intl: 0.15, compat: 0.30 }, settled: { local: 0.65, intl: 0.15, compat: 0.20 }, home: { local: 0.95, intl: 0.05, compat: 0 } };
  var PREF = { any: 'Không ưu tiên quốc tịch', local: 'Ưu tiên người bản xứ', intl: 'Ưu tiên sinh viên/người quốc tế', compat: 'Ưu tiên đồng hương' };
  function ctx(l) { if (res(l) === l.country) return 'home'; var a = l.abroad; if (!a) return 'home'; if (a.study || (l.flags.study107 && !l.flags.study107.finished) || /^(uni|grad|post)/.test(String(l.school || ''))) return 'campus'; return a.perm ? 'settled' : 'work'; }
  function weights(l) { var c = CTX[ctx(l)], p = st(l).pref, w = { local: c.local, intl: c.intl, compat: c.compat }; if (p !== 'any' && w[p] > 0) w[p] *= 3; var s = w.local + w.intl + w.compat; Object.keys(w).forEach(function (k) { w[k] = w[k] / s; }); return w; }
  function poolOf(code, r) { var b = W.BY[code], p = b ? String(b.pool) : 'en'; return p.indexOf(':') >= 0 ? U.wkey(r, p) : p; }
  function nameFrom(code, r, sex) { if (code === 'VN' && G.VN) return G.VN.vnName(r, 'kinh', sex).full; return N.worldName(r, poolOf(code, r), sex).full; }
  var stranger0 = H.stranger;
  H.stranger = function (l, r, sex) {
    // Ở trong nước: giữ nguyên hành vi cũ (không đổi RNG của các đời đang chơi). Ở nước ngoài: chọn nhóm theo bối cảnh và bộ lọc.
    if (!l || !l.flags || !l.alive || res(l) === l.country || !W.BY[res(l)]) return stranger0.apply(this, arguments);
    var w = weights(l), x = r(), grp = x < w.local ? 'local' : x < w.local + w.intl ? 'intl' : 'compat';
    var code = grp === 'local' ? res(l) : grp === 'compat' ? l.country : (function () { var a = INTL.filter(function (c) { return c !== res(l) && c !== l.country && W.BY[c]; }); return a[Math.floor(r() * a.length)]; })();
    var n = grp === 'compat' ? stranger0.apply(this, arguments) : nameFrom(code, r, sex), s = st(l), keys = Object.keys(s.met);
    if (keys.length > 240) keys.slice(0, keys.length - 200).forEach(function (k) { delete s.met[k]; });
    if (!s.met[n]) s.met[n] = { cc: code, grp: grp, ctx: ctx(l), res: res(l), at: l.age };
    return n;
  };
  // Người đã gặp mang quốc tịch/quê nhà một lần, giữ nguyên khi thành người yêu, bạn đời; không đổi để làm đẹp thống kê.
  function stamp(l) {
    var s = l.flags.global919; if (!s || !s.met) return; var p = l.partner;
    [p].concat(E.friendsOf ? E.friendsOf(l) : []).forEach(function (x) { if (!x || !x.name || x.homeCountry) return; var m = s.met[x.name]; if (!m) return; x.homeCountry = m.cc; x.metAt919 = { at: m.at, res: m.res, ctx: m.ctx, grp: m.grp }; if (x.res919 == null) x.res919 = m.res; });
  }
  var resolve0 = E.resolve; E.resolve = function (l) { var out = resolve0.apply(this, arguments); if (l && l.alive && l.flags) stamp(l); return out; };

  // ================= Quốc gia: EU / EEA / Schengen tách riêng =================
  var EU = 'AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE'.split(' ');
  var EEA = EU.concat(['IS', 'LI', 'NO']);
  var SCHENGEN = EU.filter(function (c) { return c !== 'IE' && c !== 'CY'; }).concat(['IS', 'LI', 'NO', 'CH']);
  function bloc(c) { return { eu: EU.indexOf(c) >= 0, eea: EEA.indexOf(c) >= 0, schengen: SCHENGEN.indexOf(c) >= 0 }; }

  // ================= D16.2: điều kiện nhập cảnh theo hộ chiếu =================
  // kind: right (công dân/tự do đi lại), free (miễn thị thực ngắn hạn), eta (cấp phép điện tử trước), visa (xin thị thực). Không bảo đảm nhập cảnh.
  var VWP = ['SG', 'JP', 'KR', 'TW', 'GB', 'AU', 'NZ', 'CL', 'IL', 'QA'].concat(EU.filter(function (c) { return ['BG', 'CY', 'RO'].indexOf(c) < 0; }));
  var ENTRY = { // nguồn thứ cấp; ngoài bảng này trả về "cần kiểm tra / thị thực"
    'SG>VN': 'free', 'SG>MY': 'free', 'SG>TH': 'free', 'SG>JP': 'free', 'SG>KR': 'eta', 'SG>GB': 'eta', 'SG>CA': 'eta', 'SG>AU': 'eta', 'SG>CN': 'free',
    'VN>SG': 'free', 'VN>TH': 'free', 'VN>MY': 'free', 'VN>PH': 'free', 'VN>US': 'visa', 'VN>GB': 'visa', 'VN>JP': 'visa', 'VN>KR': 'visa', 'VN>AU': 'visa', 'VN>CA': 'visa', 'VN>IN': 'eta',
    'IN>FR': 'visa', 'IN>DE': 'visa', 'IN>US': 'visa', 'IN>SG': 'visa', 'IN>TH': 'free', 'IN>VN': 'eta',
    'US>CA': 'eta', 'US>GB': 'eta', 'US>JP': 'free', 'US>VN': 'eta', 'GB>US': 'eta', 'DE>US': 'eta', 'FR>US': 'eta', 'DE>GB': 'eta', 'FR>GB': 'eta', 'JP>US': 'eta', 'KR>US': 'eta', 'AU>US': 'eta',
    'CN>SG': 'free', 'CN>US': 'visa', 'CN>FR': 'visa', 'KR>JP': 'free', 'JP>KR': 'eta', 'CA>US': 'free', 'US>MX': 'free', 'AU>NZ': 'right', 'NZ>AU': 'right'
  };
  function entry(pp, dest) {
    if (pp === dest) return { kind: 'right', note: 'công dân' };
    if (bloc(pp).eea && bloc(dest).eea || pp === 'CH' && bloc(dest).eea || bloc(pp).eea && dest === 'CH') return { kind: 'right', note: 'tự do đi lại EU/EEA/Thụy Sĩ' };
    var k = ENTRY[pp + '>' + dest];
    if (!k && dest === 'US' && VWP.indexOf(pp) >= 0) k = 'eta';
    if (!k && bloc(dest).schengen && ['US', 'CA', 'GB', 'AU', 'NZ', 'JP', 'KR', 'SG', 'TW', 'MY', 'BR', 'MX', 'AR', 'CL', 'IL'].indexOf(pp) >= 0) k = 'free';
    if (k) return { kind: k, note: { free: 'miễn thị thực ngắn hạn (vẫn xét điều kiện nhập cảnh)', eta: 'cần cấp phép điện tử trước chuyến đi (ESTA/eTA/ETA/K-ETA…)', visa: 'cần xin thị thực', right: 'quyền cư trú theo thỏa thuận' }[k] };
    if (pp === 'VN' && E.TRAVEL918 && E.TRAVEL918.entry) { var t = E.TRAVEL918.entry({ country: 'VN', flags: {} }, dest); if (t && t.kind) return { kind: t.kind === 'home' ? 'right' : t.kind === 'evisa' ? 'eta' : t.kind, note: t.note || '' }; }
    return { kind: 'visa', note: 'chưa có dữ liệu xác minh cho cặp hộ chiếu–điểm đến này; coi như cần thị thực' };
  }
  var RANK = { right: 0, free: 1, eta: 2, visa: 3 };
  function members(l) {
    var out = [], tp = E.TRAVEL918 && E.TRAVEL918.passport;
    var mine = citizenships(l).filter(function (c) { return c === l.country ? !!(tp ? tp(l) : true) : true; });
    out.push({ key: 'me', name: 'Bạn', pass: mine, cits: citizenships(l) });
    var p = l.partner; if (p && p.alive !== false && (p.status === 'married' || p.live)) { var pc = p.homeCountry || l.country, pp = partnerPassport(l, p); out.push({ key: 'partner', name: p.name, pass: pp.until > p.age ? [pc] : [], cits: [pc] }); }
    (l.kids || []).forEach(function (k) {
      if (k.alive === false || l.age - k.born >= 18 || k.custody === 'other') return; var c = E.ERA917 ? E.ERA917.kidRec(l, k) : null, age = l.age - k.born;
      var pass = c ? (c.passports || []).filter(function (x) { return x.until > age; }).map(function (x) { return x.cc; }) : [];
      out.push({ key: 'kid:' + (X.uid(l, k)), name: k.name, pass: pass, cits: c ? c.cits.slice() : [l.country], pending: c && c.pending });
    });
    return out;
  }
  // Hộ chiếu của bạn đời: một lần cho mỗi người, có hạn (5–10 năm); hết hạn phải làm lại, không coi là luôn còn hiệu lực.
  function partnerPassport(l, p) { if (!p.pp919) { var x = hash(l.id + ':pp:' + (p.relation108 || p.name)) / 4294967296; p.pp919 = { cc: p.homeCountry || l.country, until: (p.age || 25) + Math.floor(x * 9) }; } return p.pp919; }
  function familyNeeds(l, dest) {
    var fv = st(l).famVisa[dest] || {};
    return members(l).map(function (m) {
      if (!m.pass.length) return { m: m, kind: 'nopass', text: m.name + ': chưa có hộ chiếu còn hạn' + (m.cits.length ? ' (quốc tịch ' + m.cits.map(cname).join(', ') + ' — cần làm hộ chiếu trước)' : '') + (m.pending ? '; đang chờ hồ sơ' : '') };
      var best = m.pass.map(function (pp) { var e = entry(pp, dest); e.pp = pp; return e; }).sort(function (a, b) { return RANK[a.kind] - RANK[b.kind]; })[0];
      var ok = fv[m.key] && fv[m.key].until >= l.age && fv[m.key].ok;
      return { m: m, kind: ok ? 'granted' : best.kind, pp: best.pp, text: m.name + ': hộ chiếu ' + cname(best.pp) + ' — ' + (ok ? 'đã được cấp ' + (best.kind === 'eta' ? 'phép điện tử' : 'thị thực') + ' còn hạn' : best.note) };
    });
  }

  // ================= D16.2: quy tắc quốc tịch theo nước (bổ sung cho ERA917) =================
  var CIT = {
    SG: { descent: 'register', dual: 21, note: 'Sinh tại Singapore sau 16/09/1963: Điều 121 Hiến pháp quy định quốc tịch khi sinh nếu có ít nhất một cha/mẹ là công dân Singapore, trừ các ngoại lệ được nêu trong điều luật. Sinh tại Singapore với cha mẹ đều không có quốc tịch Singapore không tự có quốc tịch, nhưng Chính phủ có thể xét cấp trong trường hợp phù hợp. Con sinh ở nước ngoài: cha/mẹ là công dân Singapore nộp đăng ký quốc tịch theo huyết thống (ICA khuyến nghị trong vòng 1 năm sau sinh); cha/mẹ là công dân theo huyết thống cần đáp ứng điều kiện cư trú. Theo ICA, người giữ hai quốc tịch từ khi còn nhỏ có thể giữ đến 21 tuổi; muốn giữ quốc tịch Singapore phải từ bỏ quốc tịch nước ngoài và tuyên thệ (Oath of Renunciation, Allegiance and Loyalty) trước 22 tuổi, nếu không sẽ mất quốc tịch Singapore vào sinh nhật 22. Chỉ được thôi quốc tịch Singapore từ 21 tuổi. Có quốc tịch, tuyên thệ, hộ chiếu và quyền đi lại là các bước riêng.', ver: 'Điều 121 Hiến pháp Singapore: https://sso.agc.gov.sg/Act/CONS1963?ProvIds=pr121- · Hướng dẫn ICA cho trẻ sinh ở nước ngoài: https://www.ica.gov.sg/enter-depart/for-singapore-citizens/child-born-overseas' },
    JP: { descent: 'reserve', dual: 20, note: 'Con sinh ở nước ngoài có quốc tịch nước khác do nơi sinh phải bảo lưu quốc tịch Nhật trong 3 tháng; người song tịch chọn quốc tịch trước 20 tuổi.', ver: 'nguồn thứ cấp' },
    CN: { descent: 'auto', dual: 0, note: 'Không công nhận song tịch; con sinh ở nước ngoài của cha/mẹ đã định cư nước ngoài và có quốc tịch nước khác từ khi sinh thì không có quốc tịch Trung Quốc.', ver: 'nguồn thứ cấp' },
    IN: { descent: 'register', dual: 0, note: 'Không công nhận song tịch; con sinh ở nước ngoài cần đăng ký khai sinh qua cơ quan đại diện; có diện OCI cho người gốc Ấn có quốc tịch khác.', ver: 'nguồn thứ cấp' },
    DE: { descent: 'auto', dual: null, note: 'Từ 27/6/2024 cho phép song tịch; con sinh ở nước ngoài của công dân Đức cũng sinh ở nước ngoài (sau 1999) phải đăng ký khai sinh trong 1 năm.', ver: 'nguồn thứ cấp' },
    US: { descent: 'register', dual: null, note: 'Quốc tịch theo huyết thống cần cha/mẹ đáp ứng thời gian cư trú tại Mỹ; đăng ký CRBA tại cơ quan đại diện.', ver: 'nguồn thứ cấp' },
    KR: { descent: 'auto', dual: 22, note: 'Song tịch từ khi sinh phải chọn trước 22 tuổi (có diện cam kết không sử dụng quốc tịch nước ngoài).', ver: 'nguồn thứ cấp' }
  };
  function citRule(cc) { return CIT[cc] || { descent: 'auto', dual: null, note: 'Quy tắc nước này chưa xác minh chi tiết; trò chơi áp quy tắc chung theo cha/mẹ.', ver: 'chưa xác minh' }; }
  // Con của cha/mẹ mang quốc tịch đăng ký theo huyết thống: hồ sơ nộp muộn (sau 1 tuổi) cần xét riêng, thêm một năm.
  var era = E.ERA917;
  if (era && E.DEC.citizen917) {
    var y917 = E.HOOKS.year; y917.push(function (l, r, log) {
      if (!l.alive || !l.kids) return; (l.kids || []).forEach(function (k) {
        var c = k.cit917; if (!c || !c.pending || c.pending.kind !== 'cit' || c.pending.late919 != null) return; var rule = citRule(c.pending.cc);
        if ((rule.descent === 'register' || rule.descent === 'reserve') && c.born && c.born !== c.pending.cc && c.pending.at - k.born > (rule.descent === 'reserve' ? 0 : 1)) { c.pending.late919 = l.age; c.pending.at = l.age; log && log('Hồ sơ quốc tịch ' + cname(c.pending.cc) + ' của ' + k.name + ' nộp sau thời hạn khuyến nghị nên cần xét riêng, chờ thêm một năm.', 'neutral'); }
      });
    });
  }
  // Song tịch phải chọn: người chơi đến tuổi quy định với hai quốc tịch trong đó một nước yêu cầu chọn.
  function dualDue(l) { var a = citizenships(l); if (a.length < 2) return null; for (var i = 0; i < a.length; i++) { var x = CIT[a[i]]; if (x && x.dual === 0 || x && x.dual && l.age >= x.dual) return a[i]; } return null; }
  E.SC('dualChoice919', { title: 'Chọn quốc tịch', valid: function (l) { return l.alive && !!dualDue(l) && !st(l).cits.chosen; }, text: function (l) { var c = dualDue(l); return 'Luật ' + cname(c) + ' không cho giữ song tịch ở tuổi này. ' + citRule(c).note + ' Lựa chọn ảnh hưởng hộ chiếu, quyền cư trú và đi lại; không đổi tên, gia phả hay quê hương của bạn.'; },
    opts: [{ k: 'keep', l: function (l) { return 'Giữ quốc tịch ' + cname(dualDue(l)) + ', thôi quốc tịch còn lại'; }, run: function (l, r, log) { var c = dualDue(l), s = st(l); if (!c) return; s.cits.chosen = { keep: c, at: l.age }; if (c !== l.country) { l.flags.renounced = l.country; } l.flags.citizen = (l.flags.citizen || []).filter(function (x) { return x === c; }); log('Bạn chọn giữ quốc tịch ' + cname(c) + '.', 'neutral'); } },
      { k: 'other', l: function (l) { return 'Giữ quốc tịch khác, thôi quốc tịch ' + cname(dualDue(l)); }, run: function (l, r, log) { var c = dualDue(l), s = st(l); if (!c) return; s.cits.chosen = { drop: c, at: l.age }; l.flags.citizen = (l.flags.citizen || []).filter(function (x) { return x !== c; }); if (c === l.country) l.flags.renounced = c; log('Bạn thôi quốc tịch ' + cname(c) + '; hộ chiếu nước này hết giá trị từ đây.', 'neutral'); } }] });

  // ================= D12: tuyến lao động quốc tế =================
  var LABOR = {
    TW: { lang: 'zh', need: 30, fee: 0.6, years: 3, sectors: 'sản xuất, chăm sóc, xây dựng', note: 'Hợp đồng qua doanh nghiệp được phép; phí dịch vụ có trần theo luật Việt Nam và Đài Loan.' },
    JP: { lang: 'ja', need: 40, fee: 0.8, years: 3, sectors: 'kỹ năng đặc định, sản xuất, điều dưỡng', note: 'Chương trình thực tập kỹ năng đang chuyển sang hệ đào tạo–việc làm mới (dự kiến 2027); kỹ năng đặc định cần thi tiếng và tay nghề.' },
    KR: { lang: 'ko', need: 35, fee: 0.3, years: 3, sectors: 'EPS: sản xuất, nông nghiệp, ngư nghiệp', note: 'EPS do nhà nước tổ chức, cần thi tiếng Hàn EPS-TOPIK.' },
    RO: { lang: 'en', need: 20, fee: 0.5, years: 2, sectors: 'xây dựng, dịch vụ, sản xuất', note: 'Giấy phép lao động do chủ sử dụng xin trước, sau đó mới xin thị thực lao động.' },
    PL: { lang: 'en', need: 20, fee: 0.5, years: 2, sectors: 'sản xuất, kho vận, xây dựng', note: 'Giấy phép lao động/thẻ cư trú tạm thời; thị thực du lịch không cho phép đi làm.' },
    HU: { lang: 'en', need: 20, fee: 0.5, years: 2, sectors: 'sản xuất, điện tử', note: 'Thẻ cư trú lao động khách gắn với chủ sử dụng.' },
    DE: { lang: 'de', need: 55, fee: 0.4, years: 3, sectors: 'điều dưỡng, kỹ thuật, nghề được đào tạo', regulated: 'điều dưỡng', note: 'Nghề được quản lý (điều dưỡng, giáo viên) cần công nhận bằng và tiếng Đức B1–B2 trước khi hành nghề.' }
  };
  function laborWhy(l, code) {
    var L = LABOR[code], s = st(l); if (!L) return 'Không có tuyến'; if (s.labor && !s.labor.done) return 'Đang có hồ sơ lao động';
    if (l.age < 18 || l.age > 45) return 'Tuyến này nhận người 18–45 tuổi'; if (res(l) === code) return 'Đang sống tại nước này';
    if (E.TRAVEL918 && E.TRAVEL918.passport && l.country === 'VN' && !E.TRAVEL918.passport(l)) return 'Cần có hộ chiếu còn hạn';
    var sk = E.ID919 ? E.ID919.skill(l, L.lang) : 0; if (sk < L.need) return 'Cần ' + (LANGNAME[L.lang] || L.lang) + ' giao tiếp cơ bản (kỹ năng ' + L.need + '+, hiện ' + Math.round(sk) + ')';
    if (L.regulated && !(E.MD4B && E.MD4B.recognized(l, code))) return 'Nghề ' + L.regulated + ' cần công nhận bằng trước (mục Công nhận bằng nghề ở nước ngoài)';
    if (l.money < l.base * L.fee) return 'Chưa đủ phí hồ sơ, đào tạo'; return true;
  }
  function laborYear(l, log) {
    var s = st(l), q = s.labor; if (!q || q.done || q.at >= l.age) return; q.done = true;
    var L = LABOR[q.code], ok = u(l, 'labor:' + q.code + ':' + q.at) < U.clamp(0.55 + (E.ID919 ? E.ID919.skill(l, L.lang) : 0) / 250 + (l.st.hea - 60) / 300, 0.3, 0.9);
    if (!ok) { H.cash(l, l.base * L.fee * 0.5, 'Hoàn một phần phí hồ sơ lao động'); log('Chủ sử dụng tại ' + cname(q.code) + ' chưa chọn hồ sơ của bạn; được hoàn một nửa phí theo hợp đồng dịch vụ.', 'neutral'); q.result = 'refused'; return; }
    q.result = 'offer'; X.next(l, 'labor919', function () { return 0.5; }, { offer: q.code }, { manual: false });
    log('Có hợp đồng lao động tại ' + cname(q.code) + ' (' + L.sectors + '); giấy phép lao động đã được chủ sử dụng xin. Bạn có thể nhận hoặc từ chối.', 'good');
  }
  function startLabor(l, r, log, code) {
    var L = LABOR[code], b = W.BY[code]; if (!b || l.job && l.job.id === 'xkld') return false;
    l.abroad = { code: code, name: b.name, until: l.age + L.years, mult: 1 + (b.gdp - 20) / 200, perm: false, labor919: { sectors: L.sectors, permit: 'lao động', at: l.age } };
    l.prevJob = l.job; l.school = null; l.job = { id: 'xkld', rank: 0, yrs: 0, t: L.sectors.split(',')[0] + ' ở ' + b.name }; l.indep = true; l.flags.needJob = false;
    log('Sang ' + b.name + ' làm việc theo hợp đồng ' + L.years + ' năm. Hợp đồng, giấy phép lao động và nơi ở được ghi rõ; bạn giữ hộ chiếu của mình và có thể liên hệ đường dây hỗ trợ người lao động nếu bị vi phạm.', 'big');
    H.mem(l, 'Ngày lên đường sang ' + b.name + ' làm việc.', 4); return true;
  }
  X.menu('labor919', 'Lao động quốc tế theo hợp đồng', function (l) { var r = X.reason(l, 18); if (r !== true) return r; return l.retired ? 'Đã nghỉ hưu' : true; }, function (l, d) {
    var s = st(l), q = s.labor;
    return 'Đi làm nước ngoài cần hợp đồng, giấy phép lao động và thị thực lao động; thị thực du lịch không cho phép đi làm. Phí dịch vụ có trần; không ai được giữ hộ chiếu của người lao động. Nghề thiếu nhân lực có thể mở cơ hội nhưng không bảo đảm thường trú.' +
      (q ? '\nHồ sơ gần nhất: ' + cname(q.code) + (q.done ? (q.result === 'offer' ? ' — có hợp đồng' : q.result === 'accepted' ? ' — đã nhận' : ' — chưa được chọn') : ' — đang chờ chủ sử dụng chọn') : '') +
      '\n' + Object.keys(LABOR).map(function (c) { var L = LABOR[c]; return '• ' + cname(c) + ': ' + L.sectors + '; ' + L.note; }).join('\n');
  }, function (l, arg) {
    var s = st(l);
    if (arg && arg.offer && s.labor && s.labor.result === 'offer') return [{ k: 'accept', l: 'Nhận hợp đồng tại ' + cname(arg.offer), why: l.job && l.job.id === 'xkld' ? 'Đang làm việc ở nước ngoài' : true, run: function (l, r, log) { if (startLabor(l, r, log, arg.offer)) s.labor.result = 'accepted'; } }, { k: 'decline', l: 'Từ chối, ở lại', run: function (l, r, log) { s.labor.result = 'declined'; log('Bạn từ chối hợp đồng.', 'neutral'); } }];
    return Object.keys(LABOR).map(function (c) { var L = LABOR[c]; return { k: 'apply:' + c, l: 'Nộp hồ sơ ' + cname(c) + (L.regulated ? ' (kể cả ' + L.regulated + ': cần công nhận bằng)' : ''), h: 'Phí ' + mo(l, l.base * L.fee) + ' · kết quả năm sau', why: laborWhy(l, c), run: function (l, r, log) { if (laborWhy(l, c) !== true) return; H.cash(l, -l.base * L.fee, 'Phí hồ sơ, đào tạo lao động ' + cname(c)); st(l).labor = { code: c, at: l.age, done: false }; log('Nộp hồ sơ lao động ' + cname(c) + '. Chủ sử dụng sẽ phỏng vấn và xin giấy phép trước khi có hợp đồng.', 'neutral'); } }; });
  }, 18, 'Nghề nghiệp');

  // ================= D12 + D16.3: nơi sống sau cưới, bảo lãnh vợ/chồng =================
  var PROC = { CA: [1, 2], US: [1, 2], GB: [1, 1], AU: [1, 2], DE: [1, 1], JP: [1, 1], KR: [1, 1], FR: [1, 1], SG: [1, 1] };
  function married(l) { var p = l.partner; return p && p.alive !== false && p.status === 'married' ? p : null; }
  function partnerHome(l) { var p = married(l); return p && p.homeCountry && W.BY[p.homeCountry] ? p.homeCountry : null; }
  function canSponsor(l, where) { // người bảo lãnh phải có quyền cư trú lâu dài tại nơi đó
    if (where === 'me') { var r0 = res(l), right = citizenships(l).indexOf(r0) >= 0 || l.abroad && l.abroad.perm; if (l.age < 18) return 'Người bảo lãnh cần đủ 18 tuổi'; if (!right) return 'Bạn chưa có quyền thường trú/công dân tại ' + cname(r0) + ' để bảo lãnh'; if (r0 === 'CA' && citizenships(l).indexOf('CA') < 0 && !(l.abroad && l.abroad.perm)) return 'Canada: người bảo lãnh phải là công dân hoặc thường trú nhân sống tại Canada'; return true; }
    var p = married(l); return p && p.age >= 18 ? true : 'Bạn đời cần đủ 18 tuổi';
  }
  function partnerPref(l) { var p = married(l); if (!p) return 'flex'; var x = hash(l.id + ':pref919:' + (p.relation108 || p.name)) / 4294967296; return x < 0.4 ? 'home' : x < 0.7 ? 'here' : 'flex'; }
  function fileYear(l, log) {
    var s = st(l), f = s.res && s.res.file; if (!f || f.stage === 'approved' || f.stage === 'refused' || l.age < f.due) return;
    if (f.stage === 'submitted' && !f.rfeDone && u(l, 'rfe:' + f.dest + ':' + f.at) < 0.35) { f.stage = 'rfe'; f.due = l.age + 1; log('Cơ quan di trú yêu cầu bổ sung bằng chứng quan hệ (ảnh, liên lạc, giấy tờ chung sống) cho hồ sơ đoàn tụ tại ' + cname(f.dest) + '.', 'neutral'); return; }
    if (f.stage === 'rfe' && !f.rfeDone) { f.stage = 'refused'; f.why = 'không bổ sung giấy tờ đúng hạn'; log('Hồ sơ đoàn tụ bị từ chối vì không bổ sung giấy tờ đúng hạn. Có thể nộp lại.', 'bad'); return; }
    var p = married(l), years = p ? Math.max(0, l.age - (p.since || l.age)) : 0, x = U.clamp(0.62 + Math.min(4, years) * 0.06 + (f.rfeDone ? 0.05 : 0) + (f.appeal ? -0.1 : 0), 0.3, 0.92);
    if (u(l, 'dec:' + f.dest + ':' + f.at + ':' + (f.tries || 0)) < x) {
      f.stage = 'approved'; f.decided = l.age;
      if (f.dir === 'in') { if (p) { p.res919 = f.dest; p.permit919 = { kind: 'vợ/chồng', at: l.age, work: true }; } log('Hồ sơ bảo lãnh được chấp thuận: ' + (p ? p.name : 'bạn đời') + ' có quyền cư trú theo diện vợ/chồng tại ' + cname(f.dest) + ' (chưa phải quốc tịch).', 'good'); }
      else { s.res.ready = true; log('Hồ sơ cư trú diện vợ/chồng tại ' + cname(f.dest) + ' được chấp thuận. Bạn có thể chuyển sang sống khi đã thu xếp xong công việc, nhà ở.', 'good'); if (married(l)) X.next(l, 'spouse919', function () { return 0.5; }, {}, { manual: false }); }
    } else { f.stage = 'refused'; f.why = 'chưa đủ bằng chứng quan hệ hoặc điều kiện bảo lãnh'; log('Hồ sơ đoàn tụ tại ' + cname(f.dest) + ' bị từ chối. Có thể nộp lại hoặc khiếu nại một lần.', 'bad'); }
  }
  function submit(l, dir, dest, log) { var s = st(l); s.res = s.res || {}; var t = PROC[dest] || [1, 2], due = l.age + t[0] + (u(l, 'proc:' + dest + ':' + l.age) < 0.5 ? 0 : t[1] - t[0]); s.res.file = { dir: dir, dest: dest, at: l.age, due: due, stage: 'submitted', tries: (s.res.file && s.res.file.tries || 0) + 1 }; H.cash(l, -l.base * 0.05, 'Lệ phí, giấy tờ hồ sơ đoàn tụ'); log('Nộp hồ sơ ' + (dir === 'in' ? 'bảo lãnh bạn đời sang ' : 'cư trú diện vợ/chồng tại ') + cname(dest) + '; dự kiến có kết quả khi bạn ' + due + ' tuổi (có thể thay đổi).', 'neutral'); }
  X.menu('spouse919', 'Nơi sống sau kết hôn và hồ sơ đoàn tụ', function (l) { var r = X.reason(l, 18); if (r !== true) return r; return married(l) && partnerHome(l) && (partnerHome(l) !== res(l) || st(l).res) ? true : 'Cần kết hôn với người có quê nhà ở nước khác nơi bạn sống'; }, function (l) {
    var s = st(l), p = married(l), q = s.res || {}, f = q.file, pref = partnerPref(l);
    if (!p) return 'Hoàn cảnh hôn nhân đã thay đổi; hồ sơ đoàn tụ không còn áp dụng.';
    return p.name + ' (quê ' + cname(p.homeCountry) + ', đang sống ở ' + cname(p.res919 || res(l)) + '). Bạn đang sống ở ' + cname(res(l)) + '. Kết hôn chỉ mở quyền nộp hồ sơ, không tự cấp cư trú, việc làm hay quốc tịch; Canada cũng yêu cầu hồ sơ bảo lãnh và thường trú riêng. Không ai phải sinh con để hồ sơ được duyệt.' +
      '\nMong muốn của ' + p.name + ': ' + (pref === 'home' ? 'muốn về sống gần gia đình ở ' + cname(p.homeCountry) : pref === 'here' ? 'muốn ở lại nơi hiện tại' : 'linh hoạt, cùng bàn') + '.' +
      (q.plan ? '\nKế hoạch: ' + { stay: 'sống tại ' + cname(res(l)), move: 'chuyển sang ' + cname(p.homeCountry), apart: 'tạm sống xa nhau', third: 'sống ở nước thứ ba', talk: 'đang bàn tiếp' }[q.plan] + '.' : '') +
      (f ? '\nHồ sơ: ' + (f.dir === 'in' ? 'bảo lãnh bạn đời sang ' : 'cư trú tại ') + cname(f.dest) + ' — ' + { submitted: 'đang xét', rfe: 'cần bổ sung giấy tờ', approved: 'đã chấp thuận', refused: 'bị từ chối (' + (f.why || '') + ')' }[f.stage] + '.' : '');
  }, function (l) {
    var s = st(l), p = married(l), q = s.res || (s.res = {}), f = q.file, here = res(l), pref = partnerPref(l), out = [];
    if (!p) return [];
    function agree(plan) { var want = { home: 'move', here: 'stay', flex: plan }[pref]; return want === plan || u(l, 'agree:' + plan + ':' + l.age) < 0.55; }
    var busy = f && (f.stage === 'submitted' || f.stage === 'rfe') ? 'Đang có hồ sơ chờ xét' : true;
    if (f && f.stage === 'rfe' && !f.rfeDone) out.push({ k: 'rfe', l: 'Bổ sung bằng chứng quan hệ', h: mo(l, l.base * 0.01), run: function (l, r, log) { f.rfeDone = true; f.stage = 'submitted'; H.cash(l, -l.base * 0.01, 'Bổ sung hồ sơ đoàn tụ'); log('Đã bổ sung giấy tờ; hồ sơ tiếp tục được xét.', 'neutral'); } });
    if (q.ready && f && f.dir === 'out' && f.stage === 'approved' && here !== f.dest) out.push({ k: 'go', l: 'Chuyển sang sống tại ' + cname(f.dest) + ' cùng gia đình', h: 'Bán/chuyển nhà và công việc một lần; thú cưng đi cùng', run: function (l, r, log) { var b = W.BY[f.dest]; if (!b || res(l) === f.dest) return; H.emigrate(l, [f.dest, b.name, poolOf(f.dest, r)], r, log); l.abroad.spouse919 = true; p.res919 = f.dest; q.ready = false; q.plan = 'move'; log('Cả nhà ổn định ở ' + b.name + '. Quyền cư trú theo diện vợ/chồng; muốn nhập quốc tịch phải đủ điều kiện riêng sau nhiều năm.', 'good'); } });
    out.push({ k: 'stay', l: 'Sống tại ' + cname(here) + (p.res919 !== here && !(p.permit919) ? ' — nộp hồ sơ bảo lãnh bạn đời' : ''), h: p.res919 === here || p.permit919 ? '' : 'Lệ phí ' + mo(l, l.base * 0.05) + ' · xét 1–2 năm', why: busy !== true ? busy : p.permit919 || p.homeCountry === here ? true : canSponsor(l, 'me'), run: function (l, r, log) { if (!agree('stay')) { q.plan = 'talk'; q.talkAt = l.age; log(p.name + ' chưa đồng ý ở lại; hai người hẹn bàn tiếp năm sau.', 'neutral'); return; } q.plan = 'stay'; if (!p.permit919 && p.homeCountry !== here) submit(l, 'in', here, log); else log('Hai bạn thống nhất sống tại ' + cname(here) + '.', 'good'); } });
    if (p.homeCountry !== here) out.push({ k: 'move', l: 'Chuyển sang ' + cname(p.homeCountry) + ' — nộp hồ sơ cư trú diện vợ/chồng', h: 'Lệ phí ' + mo(l, l.base * 0.05), why: busy !== true ? busy : canSponsor(l, 'partner'), run: function (l, r, log) { if (!agree('move')) { q.plan = 'talk'; log(p.name + ' muốn cân nhắc thêm việc chuyển về ' + cname(p.homeCountry) + '.', 'neutral'); return; } q.plan = 'move'; submit(l, 'out', p.homeCountry, log); } });
    var third = citizenships(l).filter(function (c) { return c !== here && c !== p.homeCountry; });
    third.forEach(function (c) { out.push({ k: 'third:' + c, l: 'Cùng sang nước thứ ba: ' + cname(c) + ' (bạn có quốc tịch)', why: busy, run: function (l, r, log) { if (!agree('third')) { q.plan = 'talk'; log(p.name + ' chưa muốn sang ' + cname(c) + '.', 'neutral'); return; } q.plan = 'third'; submit(l, 'in', c, log); } }); });
    out.push({ k: 'apart', l: 'Tạm sống xa nhau, thăm nhau khi có thể', h: 'Quan hệ cần duy trì liên lạc; có thể đổi kế hoạch sau', run: function (l, r, log) { q.plan = 'apart'; p.res919 = p.res919 || p.homeCountry; log('Hai bạn tạm sống ở hai nơi, liên lạc hằng ngày và hẹn gặp trong kỳ nghỉ.', 'neutral'); } });
    if (f && f.stage === 'refused') { out.push({ k: 'reapply', l: 'Nộp lại hồ sơ với bằng chứng đầy đủ hơn', h: mo(l, l.base * 0.05), run: function (l, r, log) { submit(l, f.dir, f.dest, log); } }); if (!f.appeal) out.push({ k: 'appeal', l: 'Khiếu nại quyết định từ chối', h: mo(l, l.base * 0.03), run: function (l, r, log) { H.cash(l, -l.base * 0.03, 'Khiếu nại hồ sơ đoàn tụ'); f.appeal = true; f.stage = 'submitted'; f.due = l.age + 1; f.rfeDone = true; log('Đã khiếu nại; kết quả năm sau.', 'neutral'); } }); }
    return out;
  }, 18, 'Tình cảm & gia đình');
  function apartYear(l, log) { var s = st(l), p = married(l); if (!p || !s.res || s.res.plan !== 'apart' || s.res.apartAt === l.age) return; s.res.apartAt = l.age; if (p.affection108 != null) p.affection108 = U.clamp(p.affection108 - 2, 0, 100); }

  // ================= D16.1 menu: bộ lọc gặp gỡ =================
  X.menu('pool919', 'Gặp gỡ ở nơi đang sống: bản xứ, quốc tế, đồng hương', function (l) { return X.reason(l, 16); }, function (l) {
    var w = weights(l), c = ctx(l), s = st(l), b = W.BY[res(l)], thin = s.pref === 'local' && b && b.births < 5;
    return 'Bạn đang ' + { campus: 'học', work: 'làm việc', settled: 'định cư', home: 'sống' }[c] + ' tại ' + cname(res(l)) + '. Người mới gặp đến từ nơi bạn thực sự sinh hoạt; quốc tịch, nguồn gốc và nơi ở là các thông tin riêng, tên không chứng minh quốc tịch. Tỷ trọng là tham số trò chơi, không phải số dân thật.\nƯớc tính: bản xứ ' + Math.round(w.local * 100) + '% · quốc tế ' + Math.round(w.intl * 100) + '% · đồng hương ' + Math.round(w.compat * 100) + '%. Bộ lọc: ' + PREF[s.pref] + '.' + (thin ? '\nNhóm bạn chọn ít người ở nơi này; kết quả có thể ít và vẫn có người ngoài nhóm.' : '') +
      (c === 'home' ? '\nỞ trong nước, người quốc tế chủ yếu gặp ở thành phố lớn, trường quốc tế, nơi làm việc đa quốc gia.' : '');
  }, function (l) { var s = st(l); return Object.keys(PREF).map(function (k) { return { k: k, l: (s.pref === k ? '✓ ' : '') + PREF[k], why: s.pref === k ? 'Đang dùng' : true, run: function (l, r, log) { st(l).pref = k; log('Bộ lọc gặp gỡ: ' + PREF[k].toLowerCase() + '.', 'neutral'); } }; }); }, 16, 'Tình cảm & gia đình');

  // ================= D16.2 menu: giấy tờ đi lại của gia đình =================
  var TRIP = ['VN', 'SG', 'JP', 'KR', 'US', 'GB', 'FR', 'DE', 'AU', 'CA', 'TH', 'CN', 'IN', 'MY'];
  X.menu('famTravel919', 'Giấy tờ đi lại của cả gia đình', function (l) { var r = X.reason(l, 18); return r !== true ? r : true; }, function (l, d) {
    var dest = d && d.arg && d.arg.dest; if (!dest) return 'Chọn điểm đến để xem yêu cầu của từng người. Mỗi người dùng hộ chiếu hợp lệ của chính mình; con miễn thị thực không có nghĩa cha/mẹ cũng được miễn. Miễn thị thực du lịch không cho quyền làm việc hay định cư và không bảo đảm nhập cảnh.';
    return 'Đi ' + cname(dest) + ' (' + (bloc(dest).schengen ? 'khối Schengen' : bloc(dest).eu ? 'EU, ngoài Schengen' : 'ngoài EU') + '):\n' + familyNeeds(l, dest).map(function (x) { return '• ' + x.text; }).join('\n');
  }, function (l, arg) {
    if (!arg || !arg.dest) return TRIP.filter(function (c) { return W.BY[c] && c !== res(l); }).map(function (c) { return { k: 'd:' + c, l: cname(c), run: function (l, r) { X.next(l, 'famTravel919', r, { dest: c }); } }; });
    var dest = arg.dest, out = [];
    familyNeeds(l, dest).forEach(function (x) {
      if (x.kind !== 'eta' && x.kind !== 'visa') return; var fee = l.base * (x.kind === 'eta' ? 0.005 : 0.02);
      out.push({ k: 'apply:' + x.m.key, l: (x.kind === 'eta' ? 'Xin phép điện tử cho ' : 'Nộp thị thực cho ') + x.m.name, h: mo(l, fee), why: l.money >= fee ? true : 'Chưa đủ lệ phí', run: function (l, r, log) {
        var fv = st(l).famVisa[dest] || (st(l).famVisa[dest] = {}); if (fv[x.m.key] && fv[x.m.key].at === l.age) return; H.cash(l, -fee, 'Lệ phí thị thực/phép điện tử ' + cname(dest));
        var okp = x.kind === 'eta' ? 0.97 : U.clamp(0.55 + (l.job ? 0.15 : 0) + Math.min(0.15, l.money / l.base * 0.02), 0.3, 0.9), ok = u(l, 'fv:' + dest + ':' + x.m.key + ':' + l.age) < okp;
        fv[x.m.key] = { kind: x.kind, ok: ok, at: l.age, until: l.age + (x.kind === 'eta' ? 2 : 1) };
        log((ok ? 'Đã cấp ' : 'Chưa được cấp ') + (x.kind === 'eta' ? 'phép điện tử' : 'thị thực') + ' ' + cname(dest) + ' cho ' + x.m.name + '.', ok ? 'good' : 'neutral');
      } });
    });
    var p = l.partner; if (p && p.alive !== false && p.status === 'married' && partnerPassport(l, p).until <= p.age + 1) out.push({ k: 'ppPartner', l: 'Làm lại hộ chiếu ' + cname(partnerPassport(l, p).cc) + ' cho ' + p.name, h: mo(l, l.base * 0.015) + ' · cấp trong năm', why: l.money >= l.base * 0.015 ? true : 'Chưa đủ lệ phí', run: function (l, r, log) { var q = partnerPassport(l, p); H.cash(l, -l.base * 0.015, 'Lệ phí hộ chiếu của bạn đời'); q.until = p.age + 10; q.renewed = l.age; log('Hộ chiếu của ' + p.name + ' đã được làm lại, hạn 10 năm.', 'good'); } });
    if (!out.length) out.push({ k: 'ok', l: 'Không ai cần thêm giấy tờ (trừ người chưa có hộ chiếu)', run: function () { } });
    return out;
  }, 18, 'Gia đình');

  // ================= D11 menu: chương trình du học =================
  X.menu('programs919', 'Chương trình du học các nước: ngôn ngữ, học phí, học bổng', function (l) { return X.reason(l, 15); }, function (l) {
    return 'Nộp trường, nộp học bổng và xin visa là ba bước riêng: đậu trường không bảo đảm học bổng hay visa. Học bổng ghi rõ % học phí hay toàn bộ chi phí; học bổng học phí không gồm vé máy bay, ăn ở. Học bằng tiếng Anh vẫn nên học tiếng địa phương để hòa nhập, làm việc. Khó dễ tùy chương trình, hồ sơ và năm, không xếp hạng cố định giữa các nước. Con số là tham chiếu 2024–2025 (nguồn thứ cấp), quy đổi theo giá của game.\n' +
      Object.keys(P).filter(function (c) { return W.BY[c]; }).map(function (c) { var q = program(c, 5, trackOf(l, c)), b = bloc(c); return '• ' + cname(c) + (b.eu ? ' (EU' + (b.schengen ? ', Schengen' : '') + ')' : b.schengen ? ' (Schengen, ngoài EU)' : '') + ': học bằng ' + P[c].instr.map(function (k) { return LANGNAME[k] || k; }).join('/') + ' (đang chọn ' + (LANGNAME[q.track] || q.track) + '); học phí ~' + mo(l, usd(l, q.tuitionUsd)) + '/năm, sinh hoạt ~' + mo(l, usd(l, q.liveUsd)) + '/năm; làm thêm: ' + P[c].work + '; sau tốt nghiệp: ' + P[c].stay + '.' + (P[c].note ? ' ' + P[c].note : ''); }).join('\n');
  }, function (l) {
    var out = [];
    Object.keys(P).forEach(function (c) { if (!W.BY[c] || P[c].instr.length < 2) return; P[c].instr.forEach(function (t) { if (trackOf(l, c) === t) return; out.push({ k: 'tr:' + c + ':' + t, l: cname(c) + ': chọn chương trình dạy bằng ' + (LANGNAME[t] || t), run: function (l, r, log) { st(l).track[c] = t; log('Hồ sơ ' + cname(c) + ' sẽ theo chương trình dạy bằng ' + (LANGNAME[t] || t) + '.', 'neutral'); } }); }); });
    var o = l.flags.studyVisa900; if (o && o.unpaid919 > 0) out.unshift({ k: 'pay', l: 'Nộp phần học phí còn lại sau học bổng (' + mo(l, o.unpaid919) + ')', why: l.money >= o.unpaid919 ? true : 'Chưa đủ tiền', run: function (l, r, log) { var q = l.flags.studyVisa900; if (!q || !(q.unpaid919 > 0) || l.money < q.unpaid919) return; H.cash(l, -q.unpaid919, 'Học phí còn lại sau học bổng'); q.deposit = (q.deposit || 0) + q.unpaid919; q.unpaid919 = 0; log('Đã nộp phần học phí còn lại; có thể xin visa du học.', 'good'); } });
    return out.slice(0, 50);
  }, 15, 'Học tập');

  // ================= hook năm, bản lưu =================
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !l.flags || !['vn', 'world'].includes(l.mode)) return;
    var s = st(l); stamp(l); laborYear(l, log); fileYear(l, log); apartYear(l, log);
    var p = married(l); if (p && p.homeCountry && p.homeCountry !== res(l) && !s.res && !(s.askedFor === (p.relation108 || p.name))) { s.askedFor = p.relation108 || p.name; X.next(l, 'spouse919', r, {}, { manual: false }); }
    if (s.res && s.res.plan === 'talk' && s.res.talkAt != null && l.age - s.res.talkAt === 1) X.next(l, 'spouse919', r, {}, { manual: false });
    if (dualDue(l) && !s.cits.chosen && s.cits.askedAt !== l.age) { s.cits.askedAt = l.age; l.pending.push(E.DEC.dualChoice919.make(l, r)); }
  });
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.global919 != null && typeof l.flags.global919 !== 'object') delete l.flags.global919; };
  E.GLOBAL919 = { homes: homes, P: P, UNIS: UNIS, program: program, trackOf: trackOf, tuitionTotal: tuitionTotal, admit: admit, scholarship: scholarship, instrLevel: instrLevel, ctx: ctx, weights: weights, CTX: CTX, entry: entry, bloc: bloc, EU: EU, EEA: EEA, SCHENGEN: SCHENGEN, members: members, familyNeeds: familyNeeds, partnerPassport: partnerPassport, CIT: CIT, citRule: citRule, dualDue: dualDue, LABOR: LABOR, laborWhy: laborWhy, canSponsor: canSponsor, partnerPref: partnerPref, state: st, citizenships: citizenships, stamp: stamp, LANGNAME: LANGNAME };
})(globalThis.G);
