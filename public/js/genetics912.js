/* Di truyền, sàng lọc trước hôn nhân và đa thai (912). Mô phỏng trò chơi — KHÔNG phải công cụ chẩn đoán hay tư vấn y khoa.
   Nguồn và phần giản lược: docs/HEALTH-GENETICS-912-SOURCES.md. Mọi tỷ lệ dưới đây là "tham số gameplay" lấy cảm hứng từ nguồn đó.
   · Lớp dữ liệu tách bạch: kiểu gen (sinh một lần theo seed, truyền qua cha/mẹ sinh học) → người mang gen → tình trạng đã xác nhận
     → triệu chứng → chẩn đoán/xét nghiệm → chăm sóc → theo dõi. Mang gen không đồng nghĩa mắc bệnh; âm tính chỉ trong phạm vi xét nghiệm.
   · Cơ chế: lặn NST thường (tan máu β, tan máu α giản lược, bạch tạng, PKU, Wilson, SMA, xơ nang), liên kết X (G6PD, hemophilia A),
     bất thường số lượng NST (trisomy 21 theo tuổi mẹ, không di truyền trong mô hình). Liên kết Y/ty thể: chưa có bệnh cụ thể đủ căn cứ.
   · Tần suất theo nhóm dân cư (suy ra từ nhóm tên của quốc gia), không áp một xác suất cho mọi nước.
   · Không reroll: kiểu gen lưu trên người; con sinh trước bản này và nhân vật đã sống trước bản này không bị gán bệnh mới.
   · Đa thai: cùng trứng (chung kiểu gen, cùng giới) ~cố định; khác trứng theo nhóm dân cư và tuổi mẹ; ba thai rất hiếm. Một lần sinh
     chỉ xử lý một lần (đánh dấu theo nhóm sinh), tải lại không sinh thêm. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W;
  var V = 1;
  var AUTO = ['hbb', 'hba', 'tyr', 'pah', 'atp7b', 'smn1', 'cftr'], XL = ['g6pd', 'f8'];
  // Tần suất alen bệnh q theo nhóm (tham số gameplay; nguồn & mức tin cậy trong tài liệu nguồn). Người mang gen ≈ 2q.
  var Q = {
    sea: { hbb: 0.027, hba: 0.04, tyr: 0.0077, pah: 0.002, atp7b: 0.0058, smn1: 0.01, cftr: 0.0057, g6pd: 0.01, f8: 0.00015 },
    eas: { hbb: 0.005, hba: 0.015, tyr: 0.0077, pah: 0.0063, atp7b: 0.0058, smn1: 0.01, cftr: 0.0057, g6pd: 0.02, f8: 0.00015 },
    sas: { hbb: 0.02, hba: 0.015, tyr: 0.0077, pah: 0.004, atp7b: 0.0058, smn1: 0.01, cftr: 0.0057, g6pd: 0.04, f8: 0.00015 },
    mena: { hbb: 0.02, hba: 0.015, tyr: 0.0077, pah: 0.006, atp7b: 0.0058, smn1: 0.01, cftr: 0.01, g6pd: 0.05, f8: 0.00015 },
    afr: { hbb: 0.005, hba: 0.01, tyr: 0.0139, pah: 0.002, atp7b: 0.0058, smn1: 0.01, cftr: 0.0077, g6pd: 0.1, f8: 0.00015 },
    eur: { hbb: 0.001, hba: 0.002, tyr: 0.0087, pah: 0.0063, atp7b: 0.0058, smn1: 0.01, cftr: 0.019, g6pd: 0.005, f8: 0.00015 },
    mix: { hbb: 0.005, hba: 0.005, tyr: 0.008, pah: 0.005, atp7b: 0.0058, smn1: 0.01, cftr: 0.012, g6pd: 0.03, f8: 0.00015 }
  };
  var DENOVO_F8 = 0.00006; // khoảng 1/3 ca hemophilia A không có tiền sử gia đình (tham số gameplay)
  var GROUP = { vn: 'sea', kh: 'sea', la: 'sea', th: 'sea', mm: 'sea', my: 'sea', id: 'sea', ph: 'sea', sg: 'sea', cn: 'eas', jp: 'eas', kr: 'eas', kp: 'eas', mn: 'eas',
    in: 'sas', bd: 'sas', pk: 'sas', np: 'sas', lk: 'sas', bt: 'sas', af: 'sas', ar: 'mena', fa: 'mena', tr: 'mena', he: 'mena', gr: 'mena', it: 'mena', az: 'mena', hy: 'mena', ka: 'mena',
    afr: 'afr', afw: 'afr', afe: 'afr', afs: 'afr', so: 'afr', et: 'afr', ss: 'afr', ao: 'afr', car: 'afr', ht: 'afr', mg: 'afr',
    en: 'eur', de: 'eur', fr: 'eur', nl: 'eur', nord: 'eur', fi: 'eur', pl: 'eur', cz: 'eur', hu: 'eur', ro: 'eur', bg: 'eur', ru: 'eur', ua: 'eur', yu: 'eur', sq: 'eur', ee: 'eur', lv: 'eur', lt: 'eur', es: 'eur', pt: 'eur' };
  // Đa thai (mỗi lần sinh): cùng trứng ~3,7‰ mọi nơi; khác trứng theo nhóm (Đông/Đông Nam Á thấp, châu Phi cao).
  var MZ = 0.0037, DZ = { sea: 0.004, eas: 0.004, sas: 0.004, mena: 0.007, afr: 0.02, eur: 0.008, mix: 0.007 }, TRIPLET = 0.00012;
  // Hội chứng Down theo tuổi mẹ (tỷ lệ khi sinh; nội suy log giữa các mốc, dưới 25 là ngoại suy).
  var T21 = [[20, 1 / 1500], [25, 1 / 1100], [30, 1 / 900], [35, 1 / 350], [40, 1 / 100], [45, 1 / 25]];
  // Bệnh: tuổi khởi phát, phát hiện, chăm sóc (chi phí theo thu nhập cơ bản năm), tác động. Tham số gameplay.
  var COND = {
    thal_b: { n: 'Tan máu bẩm sinh β (thể nặng)', onset: [0, 2], care: 0.15, careN: 'truyền máu định kỳ và thải sắt theo chỉ định', hea: [-15, -4], mort: [0.12, 0.01] },
    thal_a: { n: 'Tan máu bẩm sinh α (thể bệnh, mô hình giản lược)', onset: [1, 10], care: 0.05, careN: 'theo dõi huyết học, truyền máu khi có chỉ định', hea: [-6, -2], mort: [0.005, 0.001] },
    g6pd: { n: 'Thiếu men G6PD', onset: [0, 0], care: 0, careN: 'tránh các tác nhân gây tan máu (một số thuốc, đậu tằm), khám khi có dấu hiệu', episode: [0.03, 0.005] },
    hema: { n: 'Máu khó đông (hemophilia A)', onset: [1, 3], care: 0.3, careN: 'bổ sung yếu tố đông máu dự phòng', hea: [-8, -2], mort: [0.01, 0.002] },
    oca: { n: 'Bạch tạng (da – mắt)', onset: [0, 0], care: 0.01, careN: 'chống nắng, khám mắt, hỗ trợ thị lực và điều chỉnh học tập', hea: [-2, 0], mort: [0, 0] },
    pku: { n: 'Phenylketon niệu (PKU)', onset: [0, 1], care: 0.05, careN: 'chế độ ăn kiểm soát phenylalanine suốt đời', hea: [-3, 0], mort: [0, 0], study: -20 },
    wilson: { n: 'Bệnh Wilson', onset: [5, 35], care: 0.03, careN: 'thuốc thải đồng, theo dõi gan', hea: [-10, -1], mort: [0.02, 0.001] },
    sma: { n: 'Teo cơ tủy sống (SMA)', onset: [0, 0], care: 0.2, careN: 'phục hồi chức năng, hỗ trợ hô hấp và thuốc theo chỉ định', hea: [-12, -4], mort: [0.4, 0.05] },
    cf: { n: 'Xơ nang', onset: [0, 1], care: 0.1, careN: 'vật lý trị liệu hô hấp, men tụy và thuốc theo chỉ định', hea: [-8, -3], mort: [0.03, 0.008] },
    t21: { n: 'Hội chứng Down (trisomy 21)', onset: [0, 0], care: 0.04, careN: 'can thiệp sớm, khám tim, hỗ trợ học tập và vận động', hea: [-3, -1], mort: [0.01, 0.003], study: -15 }
  };
  // Xét nghiệm: tỷ lệ phát hiện người mang gen theo kỹ thuật (tham số gameplay; WES/WGS không phát hiện mọi biến thể).
  var TESTS = {
    basic: { n: 'Gói khám sức khỏe chung (công thức máu, điện di huyết sắc tố, men G6PD)', cost: 0.01, det: { hbb: 0.85, hba: 0.6, g6pd: 0.9 }, vus: 0 },
    infect: { n: 'Xét nghiệm nhiễm trùng theo chỉ định (HIV, viêm gan B/C, giang mai)', cost: 0.008, det: {}, vus: 0, infection: true },
    panel: { n: 'Sàng lọc người mang gen (bảng gen mục tiêu)', cost: 0.05, det: { hbb: 0.97, hba: 0.9, tyr: 0.9, pah: 0.95, atp7b: 0.9, smn1: 0.95, cftr: 0.9, g6pd: 0.95, f8: 0.85 }, vus: 0.05 },
    wes: { n: 'Giải trình tự exome (WES)', cost: 0.15, det: { hbb: 0.97, hba: 0.2, tyr: 0.85, pah: 0.95, atp7b: 0.9, smn1: 0.1, cftr: 0.9, g6pd: 0.95, f8: 0.5 }, vus: 0.25 },
    wgs: { n: 'Giải trình tự toàn bộ hệ gen (WGS)', cost: 0.3, det: { hbb: 0.97, hba: 0.7, tyr: 0.9, pah: 0.97, atp7b: 0.95, smn1: 0.6, cftr: 0.95, g6pd: 0.97, f8: 0.8 }, vus: 0.3 }
  };
  var LOCUS = { hbb: 'tan máu β (HBB)', hba: 'tan máu α (HBA)', tyr: 'bạch tạng (TYR)', pah: 'PKU (PAH)', atp7b: 'Wilson (ATP7B)', smn1: 'SMA (SMN1)', cftr: 'xơ nang (CFTR)', g6pd: 'thiếu men G6PD', f8: 'hemophilia A (F8)' };
  var LCOND = { hbb: 'thal_b', hba: 'thal_a', tyr: 'oca', pah: 'pku', atp7b: 'wilson', smn1: 'sma', cftr: 'cf', g6pd: 'g6pd', f8: 'hema' };

  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; }
  function rng(seed) { var x = hash(seed) || 1; return function () { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }
  function group(code) { var c = W && W.BY[code], p = String(c && c.pool || 'vn').split(':')[0]; return GROUP[p] || 'mix'; }
  function lifeGroup(l) { return group(H.resCode ? H.resCode(l) : l.country || 'VN'); }
  function fresh(seed, grp, sex) {
    var r = rng(seed), q = Q[grp] || Q.mix, g = { v: V, sex: sex };
    AUTO.forEach(function (k) { g[k] = (r() < q[k] ? 'c' : 'N') + (r() < q[k] ? 'c' : 'N'); g[k] = g[k] === 'cN' ? 'Nc' : g[k]; });
    XL.forEach(function (k) { var a = r() < q[k] ? 'x' : 'X', b = r() < q[k] ? 'x' : 'X'; g[k] = sex === 'M' ? a : [a, b].sort().join(''); });
    return g;
  }
  // Nhân vật/người con sinh trước bản này: không gán bệnh mới (hạ về người mang gen).
  function soften(g) { AUTO.forEach(function (k) { if (g[k] === 'cc') g[k] = 'Nc'; }); XL.forEach(function (k) { if (g[k] === 'x') g[k] = 'X'; else if (g[k] === 'xx') g[k] = 'Xx'; }); delete g.t21; g.softened = true; return g; }
  function pickA(r, gt) { return gt.charAt(r() < 0.5 ? 0 : 1); }
  function inherit(mom, dad, sex, r) {
    var g = { v: V, sex: sex };
    AUTO.forEach(function (k) { var a = [pickA(r, mom[k] || 'NN'), pickA(r, dad[k] || 'NN')].sort().join(''); g[k] = a === 'cN' ? 'Nc' : a; });
    XL.forEach(function (k) {
      var m = mom[k] || 'XX', fromMom = m.length === 2 ? pickA(r, m) : m; if (k === 'f8' && fromMom === 'X' && r() < DENOVO_F8) fromMom = 'x';
      g[k] = sex === 'M' ? fromMom : [fromMom, (dad[k] || 'X').charAt(0)].sort().join('');
    });
    return g;
  }
  function conds(g) { if (!g) return []; var out = []; AUTO.forEach(function (k) { if (g[k] === 'cc') out.push(LCOND[k]); }); XL.forEach(function (k) { if (g[k] === 'x' || g[k] === 'xx') out.push(LCOND[k]); }); if (g.t21) out.push('t21'); return out; }
  function carriers(g) { if (!g) return []; var out = []; AUTO.forEach(function (k) { if (g[k] === 'Nc') out.push(k); }); XL.forEach(function (k) { if (g[k] === 'Xx') out.push(k); }); return out; }
  function t21Risk(age) { var a = U.clamp(age || 28, 15, 50); for (var i = 1; i < T21.length; i++) if (a <= T21[i][0]) { var p = T21[i - 1], q = T21[i], f = (a - p[0]) / (q[0] - p[0]); return Math.exp(Math.log(p[1]) + f * (Math.log(q[1]) - Math.log(p[1]))); } return T21[T21.length - 1][1]; }

  // ---- Kiểu gen của từng người, lưu một lần ----
  function st(l) { var s = l.flags.genetics912; if (!s || typeof s !== 'object') s = l.flags.genetics912 = { v: V, since: l.age, parents: {}, tests: [], serial: 0, births: {} }; ['parents', 'births'].forEach(function (k) { if (!s[k] || typeof s[k] !== 'object') s[k] = {}; }); if (!Array.isArray(s.tests)) s.tests = []; return s; }
  // Nhân vật chính chỉ có tình trạng bệnh khi được thừa hưởng từ đời cha/mẹ (sống tiếp đời con); nếu không thì chỉ là người mang gen.
  function self(l) { var s = st(l); if (!s.self) s.self = soften(fresh(l.id + ':genes912:self', lifeGroup(l), l.sex)); return s.self; }
  function coKey(p) { return p && (p.relation108 || p.id || p.uid110 || p.name) || 'unknown'; }
  function coGenes(l, p) {
    var s = st(l), key = coKey(p);
    if (!s.parents[key]) { var real = p && p.genes912 || (l.partner && coKey(l.partner) === key && l.partner.genes912); s.parents[key] = real || soften(fresh(l.id + ':genes912:co:' + key, group(p && (p.country108 || p.country) || H.resCode(l)), p && p.sex || (l.sex === 'M' ? 'F' : 'M'))); }
    if (l.partner && coKey(l.partner) === key) l.partner.genes912 = s.parents[key];
    return s.parents[key];
  }
  function partnerGenes(l) { return l.partner ? coGenes(l, l.partner) : null; }
  function cond(l, who) { return who === 'self' ? (l.flags.cond912 || (l.flags.cond912 = {})) : (who.cond912 || (who.cond912 = {})); }

  // ---- Sinh: gán kiểu gen, đa thai, trạng thái ban đầu ----
  function coParentOf(l, k) { return k.coParent108 ? { relation108: k.coParent108.id, name: k.coParent108.name, sex: k.coParent108.sex } : k.mate || (l.partner && { name: l.partner.name, sex: l.partner.sex, relation108: l.partner.relation108, country: l.partner.country }) || { name: 'unknown:' + X.uid(l, k) }; }
  function motherAge(l, k) { if (l.sex === 'F') return l.age; var p = l.partner; return p && p.alive !== false && p.sex === 'F' ? p.age : l.age - 2; }
  function twinName(l, r, k, sex) { var mine = String(k.name || '').split(' '), nm = String(H.stranger(l, r, sex) || '').split(' '); if (mine.length < 2 || nm.length < 2) return nm.join(' '); return l.pool === 'vn' || mine[0] === (l.sur || '') ? [mine[0]].concat(nm.slice(1)).join(' ') : [nm[0]].concat(mine.slice(1)).join(' '); }
  function initCond(l, k, g, born) {
    var c = cond(l, k), r = rng(l.id + ':cond912:' + X.uid(l, k));
    conds(g).forEach(function (id) {
      if (c[id]) return; var C = COND[id], onset = born + C.onset[0] + Math.floor(r() * (C.onset[1] - C.onset[0] + 1));
      var x = { id: id, onset: onset, known: false, care: 'none', since: born };
      if (id === 'sma') { var t = r(); x.type = t < 0.5 ? 1 : t < 0.75 ? 2 : t < 0.95 ? 3 : 4; x.onset = born + (x.type === 1 ? 0 : x.type === 2 ? 1 : x.type === 3 ? 3 : 25); if (x.type >= 2) { x.mortK = x.type === 2 ? 0.05 : 0.005; } }
      if (id === 'oca' || id === 't21') { x.known = 'confirmed'; x.dx = born; }
      if (id === 't21') x.heart = r() < 0.5; // khoảng một nửa trẻ có dị tật tim (MedlinePlus)
      c[id] = x;
    });
  }
  function onBirths(l, log) {
    if (!l.alive || !Array.isArray(l.kids)) return;
    var s = st(l), fresh0 = l.kids.filter(function (k) { return k.born === l.age && !k.genes912; });
    fresh0.forEach(function (k) {
      if (k.genes912) return;
      if (k.adopted) { k.genes912 = fresh(l.id + ':genes912:adopt:' + X.uid(l, k), lifeGroup(l), k.sex); initCond(l, k, k.genes912, k.born); return; }
      var co = coParentOf(l, k), key = l.age + ':' + coKey(co);
      var me = self(l), other = coGenes(l, co), mom = l.sex === 'F' ? me : other, dad = l.sex === 'F' ? other : me;
      var r = rng(l.id + ':birth912:' + key + ':' + X.uid(l, k));
      k.genes912 = inherit(mom, dad, k.sex, r);
      if (r() < t21Risk(motherAge(l, k))) k.genes912.t21 = true;
      initCond(l, k, k.genes912, k.born);
      if (s.births[key]) return; // một lần sinh chỉ quyết định đa thai một lần
      var rm = rng(l.id + ':multi912:' + key), mz = rm() < MZ, dzP = (DZ[lifeGroup(l)] || 0.007) * (1 + Math.max(0, motherAge(l, k) - 30) * 0.04), extra = rm() < TRIPLET ? 2 : mz || rm() < dzP ? 1 : 0;
      s.births[key] = { n: 1 + extra, mz: mz && extra > 0, at: l.age };
      for (var i = 0; i < extra; i++) {
        var sex = mz && i === 0 ? k.sex : rm() < 0.512 ? 'M' : 'F', t = JSON.parse(JSON.stringify(k));
        delete t.uid110; delete t.cond912; delete t.persona141; delete t.blood909; t.sex = sex; t.name = twinName(l, rm, k, sex); t.multi912 = key; k.multi912 = key;
        if (mz && i === 0) { t.genes912 = JSON.parse(JSON.stringify(k.genes912)); t.genes912.sex = sex; t.monozygotic912 = true; k.monozygotic912 = true; }
        else { t.genes912 = inherit(mom, dad, sex, rng(l.id + ':birth912:' + key + ':twin' + i)); if (rm() < t21Risk(motherAge(l, k))) t.genes912.t21 = true; }
        l.kids.push(t); X.uid(l, t); initCond(l, t, t.genes912, t.born);
      }
      if (extra) { if (log) log((extra === 2 ? 'Ba em bé' : 'Hai em bé') + ' cùng chào đời' + (mz ? ' — cặp sinh đôi cùng trứng' : '') + '. Đa thai cần theo dõi kỹ hơn, nhưng các bé đều được chăm sóc như mọi trẻ sơ sinh.', 'big'); if (l.mind) l.mind.stress = Math.min(100, (l.mind.stress || 0) + 6); }
    });
  }

  // ---- Diễn biến hằng năm: phát hiện, chăm sóc, tác động; một lần mỗi năm ----
  function screenedAtBirth(l, id) { var gdp = l.gdp || 10; return id === 'pku' || id === 'cf' ? gdp >= 25 : id === 'g6pd' ? gdp >= 25 || H.isVN(l) : id === 'sma' ? gdp >= 45 : false; }
  function careCost(l, x) { var C = COND[x.id]; return l.base * (C.care || 0) * (x.care === 'full' ? 1 : x.care === 'basic' ? 0.4 : 0); }
  function progress(l, who, x, r, log, name) {
    var C = COND[x.id], age = who === 'self' ? l.age : l.age - who.born, now = l.age;
    if (!x.known && now >= x.onset) {
      if (now - x.since <= 1 && screenedAtBirth(l, x.id)) { x.known = 'confirmed'; x.dx = now; x.via = 'sàng lọc sơ sinh'; }
      else if (x.id !== 'g6pd' && r() < 0.5 + Math.min(0.4, (l.gdp || 10) / 100)) { x.known = 'confirmed'; x.dx = now; x.via = 'khám khi có triệu chứng'; }
      if (x.known && log) log((who === 'self' ? 'Bạn' : name) + ' được chẩn đoán ' + C.n.toLowerCase() + (x.via ? ' (' + x.via + ')' : '') + '. Cần ' + C.careN + '; chi phí và mức chăm sóc do gia đình lựa chọn.', 'bad');
      if (x.known && x.care === 'none') x.care = 'basic';
    }
    if (now < x.onset) return;
    if (x.id === 'g6pd') { if (r() < C.episode[x.known ? 1 : 0]) { if (who === 'self') H.fx(l, { hea: -5 }); if (log) log((who === 'self' ? 'Bạn' : name) + ' bị một đợt tan máu sau khi tiếp xúc tác nhân; ' + (x.known ? 'nhờ đã biết bệnh nên được xử trí sớm.' : 'đi khám mới biết thiếu men G6PD.'), 'bad'); if (!x.known) { x.known = 'confirmed'; x.dx = now; x.care = 'basic'; } } return; }
    var cost = careCost(l, x), paid = cost <= 0 || l.money >= cost;
    if (cost > 0) { if (paid) H.cash(l, -cost, 'Chăm sóc ' + C.n.toLowerCase() + (who === 'self' ? '' : ' cho ' + name)); else if (log && x.unpaidAt !== now) { x.unpaidAt = now; log('Không đủ tiền chăm sóc ' + C.n.toLowerCase() + (who === 'self' ? '' : ' cho ' + name) + ' năm nay; tình trạng có thể nặng hơn.', 'bad'); } }
    var treated = x.known && x.care !== 'none' && paid, full = treated && x.care === 'full';
    var dh = C.hea ? (treated ? (full ? C.hea[1] : (C.hea[0] + C.hea[1]) / 2) : C.hea[0]) : 0;
    var mort = C.mort ? (x.mortK != null ? x.mortK * (treated ? 0.3 : 1) : treated ? (full ? C.mort[1] : (C.mort[0] + C.mort[1]) / 2) : C.mort[0]) : 0;
    if (x.id === 'sma' && x.type === 1 && age > 2) mort *= 0.3;
    if (x.id === 'pku' && C.study && !x.studyHit && !(x.known && x.dx <= x.since + 1)) { x.studyHit = true; if (who !== 'self') who.study = U.clamp((who.study || 50) + C.study, 0, 100); else H.fx(l, { kno: C.study / 2 }); }
    if (x.id === 't21' && who !== 'self' && !x.studyHit) { x.studyHit = true; who.study = U.clamp((who.study || 50) + C.study * (treated ? 0.6 : 1), 0, 100); }
    if (who === 'self') { if (dh) H.fx(l, { hea: dh }); if (mort && r() < mort * 0.5) H.kill(l, C.n.toLowerCase(), log); return; }
    if (mort && r() < mort && !(age < 5 && E.SENS920 && E.SENS920.blocks(l))) { who.alive = false; who.died = now; if (log) log('Con ' + name + ' qua đời vì biến chứng của ' + C.n.toLowerCase() + ' khi ' + age + ' tuổi.', 'bad'); H.mem(l, 'Nỗi đau mất con — ' + name + '.', 8); l.st.hap -= 22; }
  }
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive) return; onBirths(l, log);
    var s = st(l); if (s.yearAt === l.age) return; s.yearAt = l.age;
    var R = rng(l.id + ':year912:' + l.age);
    var mine = l.flags.cond912; if (mine) Object.keys(mine).forEach(function (id) { progress(l, 'self', mine[id], R, log); });
    (l.kids || []).forEach(function (k) { if (k.alive === false || !k.cond912) return; if (l.age - k.born >= 18 && k.indep912 !== false) return; Object.keys(k.cond912).forEach(function (id) { if (k.alive !== false) progress(l, k, k.cond912[id], R, log, k.name); }); });
  });
  var resolve0 = E.resolve;
  E.resolve = function (l) { var out = resolve0.apply(this, arguments); if (l && l.alive && (l.kids || []).some(function (k) { return k.born === l.age && !k.genes912; })) onBirths(l, function (t, k) { l.log.push({ a: l.age, y: l.birthYear + l.age, t: t, k: k || '' }); }); return out; };

  // ---- Sàng lọc của hai người trưởng thành: mỗi người đồng ý riêng; kết quả sau một khoảng thời gian ----
  function partnerOk(l) { var p = l.partner; return p && p.alive !== false && p.age >= 18 && l.age >= 18; }
  function screenReason(l) { var x = X.reason(l, 18); if (x !== true) return x; return true; }
  function consent(l) { var p = l.partner; if (!p) return false; var r = rng(l.id + ':consent912:' + coKey(p) + ':' + l.age); return r() < U.clamp(0.55 + (p.close || 60) / 250 + (p.status === 'married' ? 0.1 : 0), 0.3, 0.95); }
  function runTest(l, who, g, kind, seed) {
    var T = TESTS[kind], r = rng(seed), out = {};
    if (T.infection) { var hist = (l.illHist || []).concat(l.ill ? [l.ill.n || l.ill] : []).join(' '); out.infection = who === 'self' ? (/HIV|viêm gan|giang mai/i.test(hist) ? 'dương tính, cần xác nhận và điều trị' : 'không phát hiện trong phạm vi xét nghiệm') : 'kết quả riêng của người ấy'; return out; }
    Object.keys(T.det).forEach(function (k) {
      var gt = g[k] || '', has = gt === 'Nc' || gt === 'Xx' || gt === 'cc' || gt === 'x' || gt === 'xx';
      if (has && r() < T.det[k]) out[k] = gt === 'cc' || gt === 'x' || gt === 'xx' ? 'affected' : 'carrier';
      else if (r() < T.vus / 9) out[k] = 'vus';
      else out[k] = 'neg';
    });
    return out;
  }
  X.menu('screen912', 'Khám sức khỏe & sàng lọc di truyền', screenReason,
    function (l) { var s = st(l), last = s.tests.slice(-3).map(function (t) { return TESTS[t.kind].n + ' (' + (l.birthYear + t.at) + ', ' + (t.status === 'ready' ? 'đã có kết quả' : 'chờ kết quả') + ')'; }).join('; ');
      return 'Đây là mô phỏng trò chơi, không thay thế tư vấn y khoa. Mỗi người tự quyết có xét nghiệm hay không; kết quả của người kia chỉ hiện khi người ấy đồng ý. Âm tính chỉ có nghĩa là không phát hiện trong phạm vi kỹ thuật đã chọn, không bảo đảm khỏe mạnh suốt đời; WES/WGS cũng có giới hạn và có thể trả kết quả chưa rõ ý nghĩa cần xác nhận thêm.' + (last ? '\nĐã làm: ' + last + '.' : ''); },
    function (l) {
      var out = [];
      Object.keys(TESTS).forEach(function (kind) { var T = TESTS[kind], cost = l.base * T.cost, both = partnerOk(l);
        out.push({ k: 'self:' + kind, l: T.n + ' — riêng bạn', h: 'Chi phí ' + H.money(l, cost) + ' · kết quả vào năm sau', why: l.money >= cost ? true : 'Thiếu tiền', run: function (l, r, log) { order(l, kind, false, log); } });
        if (both) out.push({ k: 'both:' + kind, l: T.n + ' — cùng ' + l.partner.name, h: 'Chi phí ' + H.money(l, cost * 2) + ' · người ấy có quyền không đồng ý', why: l.money >= cost * 2 ? true : 'Thiếu tiền', run: function (l, r, log) { order(l, kind, true, log); } }); });
      st(l).tests.filter(function (t) { return t.status === 'ready'; }).slice(-4).forEach(function (t) { out.push({ k: 'res:' + t.id, l: 'Xem kết quả và tư vấn: ' + TESTS[t.kind].n.split(' (')[0] + ' (' + (l.birthYear + t.at) + ')', run: function (l, r) { X.next(l, 'screenResult912', r, { id: t.id }); } }); });
      return out;
    }, 18, 'Sức khỏe');
  function order(l, kind, both, log) {
    var T = TESTS[kind], s = st(l), cost = l.base * T.cost * (both ? 2 : 1); if (l.money < cost) return;
    var agree = both ? consent(l) : false;
    if (both && !agree) { H.cash(l, -l.base * T.cost, T.n + ' (của bạn)'); }
    else H.cash(l, -cost, T.n);
    var t = { id: ++s.serial, kind: kind, at: l.age, status: 'pending', both: !!both, partnerKey: both ? coKey(l.partner) : null, partnerName: both ? l.partner.name : null, consent: { self: true, partner: !!agree } };
    t.self = runTest(l, 'self', self(l), kind, l.id + ':test912:self:' + t.id);
    if (both && agree) t.partner = runTest(l, 'partner', partnerGenes(l), kind, l.id + ':test912:partner:' + t.id);
    s.tests.push(t); if (s.tests.length > 12) s.tests.splice(0, s.tests.length - 12);
    log('Đã lấy mẫu ' + T.n.toLowerCase() + (both ? (agree ? ' cho cả hai người' : '; ' + l.partner.name + ' chưa đồng ý xét nghiệm, chỉ làm cho bạn') : '') + '. Kết quả có vào năm sau.', 'neutral');
  }
  function line(res) { return Object.keys(res).map(function (k) { if (k === 'infection') return 'Nhiễm trùng: ' + res[k]; var v = res[k]; return LOCUS[k] + ': ' + ({ neg: 'không phát hiện trong phạm vi', carrier: 'mang gen (thường không có triệu chứng)', affected: 'phù hợp tình trạng bệnh — cần khám chuyên khoa xác nhận', vus: 'biến thể chưa rõ ý nghĩa — cần xét nghiệm xác nhận' })[v]; }).join('; '); }
  function coupleRisk(t) {
    if (!t.partner) return 'Chưa có kết quả của người kia nên không ước tính được nguy cơ cho con chung.';
    var lines = [];
    AUTO.forEach(function (k) { var a = t.self[k], b = t.partner[k]; if ((a === 'carrier' || a === 'affected') && (b === 'carrier' || b === 'affected')) lines.push(LOCUS[k] + ': cả hai cùng mang gen — mỗi lần mang thai có khoảng 1/4 khả năng con mắc bệnh, 1/2 mang gen'); });
    XL.forEach(function (k) { ['self', 'partner'].forEach(function (w) { var v = t[w][k]; if (v === 'carrier') lines.push(LOCUS[k] + ': người nữ mang gen — mỗi con trai có khoảng 1/2 khả năng mắc, mỗi con gái 1/2 mang gen'); else if (v === 'affected') lines.push(LOCUS[k] + ': một người có tình trạng liên kết X — cần tư vấn chuyên khoa về khả năng truyền cho con'); }); });
    return lines.length ? lines.join('. ') + '. Các lựa chọn gồm chẩn đoán trước sinh, hỗ trợ sinh sản có xét nghiệm phôi, nhận con nuôi hoặc chuẩn bị chăm sóc; quyết định thuộc về hai người.' : 'Chưa phát hiện cặp nguy cơ trong phạm vi xét nghiệm. Kết quả này không loại trừ mọi bệnh, kể cả bệnh do biến thể mới hoặc bệnh mắc phải sau này.';
  }
  X.menu('screenResult912', 'Kết quả và tư vấn di truyền', screenReason,
    function (l, d) { var t = st(l).tests.find(function (x) { return x.id === (d && d.arg && d.arg.id); }); if (!t) return 'Không tìm thấy kết quả.'; return TESTS[t.kind].n + ' (' + (l.birthYear + t.at) + ').\nBạn: ' + line(t.self) + '.' + (t.both ? '\n' + t.partnerName + ': ' + (t.partner ? line(t.partner) + '.' : 'không đồng ý xét nghiệm — thông tin riêng của người ấy được giữ kín.') : '') + '\nTư vấn: ' + coupleRisk(t); },
    function (l, a) { return [{ k: 'ok', l: 'Lưu kết quả vào hồ sơ sức khỏe', run: function (l, r, log) { var t = st(l).tests.find(function (x) { return x.id === a.id; }); if (t) { t.reviewed = l.age; log('Bạn lưu kết quả và lời tư vấn. Việc kết hôn hay sinh con vẫn là quyết định của hai người.', 'neutral'); } } }]; }, 18);
  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !l.flags.genetics912) return; st(l).tests.forEach(function (t) { if (t.status === 'pending' && t.at < l.age) { t.status = 'ready'; log('Đã có kết quả ' + TESTS[t.kind].n.toLowerCase() + '. Mở mục Sức khỏe để xem và nhận tư vấn.', 'neutral'); } }); });

  // ---- Chăm sóc con có tình trạng đã xác nhận ----
  function kidsWith(l) { return (l.kids || []).filter(function (k) { return k.alive !== false && k.cond912 && Object.keys(k.cond912).some(function (id) { return k.cond912[id].known; }); }); }
  X.menu('care912', 'Kế hoạch chăm sóc sức khỏe cho con', function (l) { return kidsWith(l).length ? true : 'Chưa có con nào có tình trạng sức khỏe đã xác nhận'; },
    'Mức chăm sóc ảnh hưởng tới sức khỏe và nguy cơ biến chứng nhưng không bảo đảm khỏi bệnh. Tài chính quyết định khả năng tiếp cận, không quyết định giá trị của đứa trẻ.',
    function (l) { var out = []; kidsWith(l).forEach(function (k) { Object.keys(k.cond912).forEach(function (id) { var x = k.cond912[id], C = COND[id]; if (!x.known || !C.care) return;
      ['basic', 'full'].forEach(function (lv) { if (x.care === lv) return; var cost = l.base * C.care * (lv === 'full' ? 1 : 0.4); out.push({ k: X.uid(l, k) + ':' + id + ':' + lv, l: k.name + ' · ' + C.n + ': ' + (lv === 'full' ? 'chăm sóc đầy đủ' : 'chăm sóc cơ bản'), h: C.careN + ' · khoảng ' + H.money(l, cost) + '/năm', run: function (l, r, log) { x.care = lv; log('Kế hoạch chăm sóc ' + k.name + ': ' + (lv === 'full' ? 'đầy đủ' : 'cơ bản') + ' (' + C.careN + ').', 'neutral'); } }); }); }); }); return out; }, 18, 'Gia đình');

  // ---- Hồ sơ người thân: chỉ hiện thông tin đã biết ----
  if (E.STANDING158) { var rf = E.STANDING158.relativeFacts; E.STANDING158.relativeFacts = function (l, p, child) {
    var out = rf.apply(this, arguments);
    if (child && p.cond912) { var known = Object.keys(p.cond912).filter(function (id) { return p.cond912[id].known; }).map(function (id) { var x = p.cond912[id]; return COND[id].n + (x.care !== 'none' ? ' · ' + (x.care === 'full' ? 'chăm sóc đầy đủ' : 'chăm sóc cơ bản') : '') + (id === 't21' && x.heart ? ' · cần theo dõi tim' : ''); }); if (known.length) out.push(['Sức khỏe đã xác nhận', known.join('; ')]); }
    if (child && p.multi912) out.push(['Sinh cùng lần', p.monozygotic912 ? 'Sinh đôi cùng trứng' : 'Đa thai khác trứng']);
    return out; }; }
  // ---- Chuyển đời: con mang theo kiểu gen và tình trạng ----
  var childOpts = E.childOpts;
  E.childOpts = function (l, k) { var o = childOpts.apply(this, arguments); if (k.genes912) { o.parent.genes912 = JSON.parse(JSON.stringify(k.genes912)); o.parent.cond912 = JSON.parse(JSON.stringify(k.cond912 || {})); } return o; };
  var create0 = E.createLife;
  E.createLife = function (o) { var l = create0.apply(this, arguments), pg = o && o.parent && o.parent.genes912; if (l && l.flags && pg) { st(l).self = JSON.parse(JSON.stringify(pg)); l.flags.cond912 = JSON.parse(JSON.stringify(o.parent.cond912 || {})); } return l; };
  var migrate = E.migrateExt;
  E.migrateExt = function (l) { if (migrate) migrate(l); if (!l || !l.flags) return; if (l.flags.genetics912 != null && typeof l.flags.genetics912 !== 'object') delete l.flags.genetics912; (l.kids || []).forEach(function (k) { if (k.genes912 && typeof k.genes912 !== 'object') delete k.genes912; }); };
  // Con sinh trước bản này: gán kiểu gen người mang gen (không bệnh mới), đánh dấu để không xử lý như ca sinh mới.
  var load0 = E.migrate;
  if (load0) E.migrate = function (l) { var out = load0.apply(this, arguments), x = out || l; if (x && x.flags && Array.isArray(x.kids)) var pre = !x.flags.genetics912; x.kids.forEach(function (k) { if (!k.genes912 && (pre || k.born < x.age)) { k.genes912 = soften(fresh(x.id + ':genes912:legacy:' + X.uid(x, k), lifeGroup(x), k.sex)); k.legacy912 = true; } }); return out; };

  E.GENETICS912 = { Q: Q, COND: COND, TESTS: TESTS, MZ: MZ, DZ: DZ, TRIPLET: TRIPLET, group: group, fresh: fresh, inherit: inherit, conds: conds, carriers: carriers, t21Risk: t21Risk, self: self, coGenes: coGenes, onBirths: onBirths, runTest: runTest, coupleRisk: coupleRisk, soften: soften, state: st, progress: progress };
})(globalThis.G);
