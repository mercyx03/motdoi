/* Một Đời — MD4 D06/D07 (8.10.22): thú cưng, ngựa, sinh sản có trách nhiệm, bệnh thú y theo loài.
   Mở rộng l.pets / E.PETS / H.addPet của engine và các tình huống thú cưng của scenarios (không tạo bảng vật nuôi riêng):
   · Mỗi con có ID bền vững, giới tính, tuổi lúc về nhà, hồ sơ tiêm phòng/tẩy ký sinh, triệt sản, cha mẹ (nếu sinh trong nhà),
     bệnh sử. Không sinh lại khi mở menu. Thêm ngựa (chuồng/gửi nuôi, thức ăn, thú y, chăm móng; cưỡi ngựa là kỹ năng có rủi ro).
   · Phối giống cần thú y tư vấn, tuổi phù hợp, chưa triệt sản, kiểm tra phả hệ; thai kỳ một lần, số con theo loài, biến chứng,
     trách nhiệm tìm nhà. Triệt sản một lần, có hồi phục; chi phí tùy loài/giới/nơi, không mặc định "cái luôn đắt hơn".
   · Bệnh theo loài: triệu chứng → khám → chẩn đoán → điều trị theo bác sĩ → hồi phục/di chứng/tử vong; không tự chọn thuốc,
     không "đợi xem" với bệnh nặng. Lây người–động vật theo tác nhân và đường phơi nhiễm, không tự lây vì sống chung.
   · Tối đa một bệnh mới mỗi con mỗi năm; tỷ lệ là tham số trò chơi (docs/MD4-SOURCES.md). Không nêu liều thuốc. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, W = G.W;
  if (!X || !E.PETS) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function res(l) { return H.resCode(l); }
  function gdpK(l) { var b = W.BY[res(l)]; return Math.max(0.5, Math.min(2.5, (b ? b.gdp : 10) / 15)); }
  function st(l) { var s = l.flags.pets919; if (!s || typeof s !== 'object') s = l.flags.pets919 = { v: 1, serial: 0, ride: 0 }; return s; }
  // Ngựa: tuổi thọ 25–30 năm, nuôi tốn nhiều (thức ăn, chuồng/gửi nuôi, thú y, chăm móng).
  if (!E.PETS['ngựa']) E.PETS['ngựa'] = { life: [24, 30], cost: 0.3, hap: 3, br: { 'ngựa thuần chủng địa phương': 0.4, 'ngựa Ả Rập': 1.5, 'ngựa Thoroughbred': 2 } };
  var SP = {
    'chó': { mature: 1, old: 8, litter: [3, 8], vacc: 'vaccine cơ bản (Care, Parvo, viêm gan) và dại nơi có quy định', neut: [0.06, 0.09] },
    'mèo': { mature: 1, old: 10, litter: [2, 6], vacc: 'vaccine giảm bạch cầu, viêm hô hấp, dại nơi có quy định', neut: [0.04, 0.06] },
    'chim': { mature: 2, old: 15, litter: [2, 4], vacc: null, neut: null }, 'hamster': { mature: 0, old: 2, litter: [5, 10], vacc: null, neut: null },
    'cá cảnh': { mature: 1, old: 5, litter: null, vacc: null, neut: null }, 'thỏ': { mature: 1, old: 6, litter: [3, 8], vacc: null, neut: [0.03, 0.04] }, 'rùa': { mature: 8, old: 40, litter: null, vacc: null, neut: null },
    'ngựa': { mature: 3, old: 20, litter: [1, 1], vacc: 'uốn ván, viêm não West Nile nơi lưu hành', neut: [0.15, 0.25] }
  };
  // Bệnh: sev 1 thường gặp/nhẹ, 2 cần điều trị, 3 nguy hiểm. inc: xác suất/năm (đã gộp), vacc: giảm khi tiêm đủ.
  // zoo: đường lây cho người (null = không lây sang người trong game). young/old: nhân nguy cơ. regions: chỉ ở vùng lưu hành.
  var DZ = {
    'chó': [{ id: 'derm', n: 'viêm da do bọ chét/ve hoặc nấm', sev: 1, inc: 0.06, zoo: 'nấm da lây khi tiếp xúc nếu không rửa tay' }, { id: 'gi', n: 'rối loạn tiêu hóa (nôn, tiêu chảy)', sev: 1, inc: 0.06 }, { id: 'cough', n: 'ho cũi chó (bệnh hô hấp lây giữa chó)', sev: 1, inc: 0.025, vacc: 0.5 }, { id: 'demodex', n: 'ghẻ Demodex', sev: 1, inc: 0.01, young: 2, note: 'không lây sang người' },
      { id: 'parvo', n: 'Parvovirus', sev: 3, inc: 0.012, vacc: 0.1, young: 4 }, { id: 'distemper', n: 'Care (sài sốt)', sev: 3, inc: 0.006, vacc: 0.1, young: 3 }, { id: 'lepto', n: 'bệnh xoắn khuẩn Leptospira', sev: 2, inc: 0.004, vacc: 0.3, zoo: 'lây qua nước tiểu nhiễm khuẩn' }, { id: 'rabies', n: 'nghi dại', sev: 3, inc: 0.0006, vacc: 0.02, zoo: 'phơi nhiễm qua vết cắn/cào — cần tiêm phòng sau phơi nhiễm khẩn cấp', regions: 'VN IN CN ID PH TH KH LA MM BD PK NG ET KE TZ EG' }],
    'mèo': [{ id: 'ring', n: 'nấm da (Microsporum)', sev: 1, inc: 0.04, zoo: 'lây qua tiếp xúc da, nhất là trẻ nhỏ' }, { id: 'ear', n: 'rận tai', sev: 1, inc: 0.04 }, { id: 'hair', n: 'búi lông/rối loạn tiêu hóa', sev: 1, inc: 0.05 }, { id: 'fpv', n: 'giảm bạch cầu mèo (FPV)', sev: 3, inc: 0.01, vacc: 0.1, young: 4 },
      { id: 'flu', n: 'phức hợp viêm hô hấp (herpesvirus/calicivirus)', sev: 2, inc: 0.03, vacc: 0.4, young: 2 }, { id: 'toxo', n: 'nhiễm Toxoplasma (thường không triệu chứng ở mèo)', sev: 1, inc: 0.01, zoo: 'phơi nhiễm khi dọn phân mèo không đeo găng — người mang thai lần đầu nhiễm cần đặc biệt tránh' }, { id: 'rabies', n: 'nghi dại', sev: 3, inc: 0.0004, vacc: 0.02, zoo: 'phơi nhiễm qua vết cắn/cào — cần tiêm phòng sau phơi nhiễm khẩn cấp', regions: 'VN IN CN ID PH TH KH LA MM BD PK NG ET KE TZ EG' }],
    'chim': [{ id: 'pluck', n: 'nhổ/rụng lông (cần phân biệt căng thẳng với bệnh)', sev: 1, inc: 0.05 }, { id: 'para', n: 'ký sinh trùng đường ruột', sev: 1, inc: 0.03 }, { id: 'pbfd', n: 'bệnh mỏ và lông (PBFD)', sev: 2, inc: 0.006, chronic: true }, { id: 'pdd', n: 'bệnh phồng dạ dày tuyến (PDD)', sev: 3, inc: 0.004 }, { id: 'asper', n: 'nhiễm nấm Aspergillus', sev: 2, inc: 0.01, old: 2 }, { id: 'psitt', n: 'sốt vẹt (Chlamydia psittaci)', sev: 2, inc: 0.006, zoo: 'lây qua bụi phân/lông khô — có thể gây viêm phổi ở người' }],
    'hamster': [{ id: 'wet', n: 'đuôi ướt (tiêu chảy)', sev: 2, inc: 0.06, young: 2 }, { id: 'ring', n: 'nấm da', sev: 1, inc: 0.03, zoo: 'lây qua tiếp xúc da' }, { id: 'teeth', n: 'răng mọc dài', sev: 1, inc: 0.05 }, { id: 'pouch', n: 'tắc túi má', sev: 1, inc: 0.02 }, { id: 'pneu', n: 'viêm phổi', sev: 2, inc: 0.03 }, { id: 'lcmv', n: 'nhiễm virus LCMV (hiếm)', sev: 1, inc: 0.002, zoo: 'hiếm; nguy hiểm hơn với người mang thai hoặc suy giảm miễn dịch' }],
    'cá cảnh': [{ id: 'ich', n: 'bệnh đốm trắng (Ich)', sev: 1, inc: 0.08 }, { id: 'fin', n: 'thối vây/tổn thương mang', sev: 1, inc: 0.05 }, { id: 'dropsy', n: 'bụng phình (triệu chứng của nhiều nguyên nhân)', sev: 3, inc: 0.02 }, { id: 'aero', n: 'nhiễm khuẩn Aeromonas', sev: 2, inc: 0.02 }, { id: 'myco', n: 'lao cá (Mycobacterium)', sev: 2, inc: 0.005, chronic: true, zoo: 'vết thương hở tiếp xúc nước bể — đeo găng khi vệ sinh' }],
    'ngựa': [{ id: 'colicm', n: 'đau bụng (colic) mức nhẹ', sev: 1, inc: 0.06 }, { id: 'colics', n: 'đau bụng (colic) nặng, có thể cần phẫu thuật', sev: 3, inc: 0.01 }, { id: 'lamin', n: 'viêm lá móng (laminitis)', sev: 2, inc: 0.02, old: 2 }, { id: 'thrush', n: 'thối móng (thrush)', sev: 1, inc: 0.04 }, { id: 'worms', n: 'ký sinh trùng đường ruột', sev: 1, inc: 0.05 },
      { id: 'wnv', n: 'viêm não West Nile', sev: 3, inc: 0.002, vacc: 0.1, regions: 'US CA MX IT GR HU RO FR ES' }, { id: 'tetanus', n: 'uốn ván', sev: 3, inc: 0.002, vacc: 0.05 }, { id: 'anthrax', n: 'bệnh than', sev: 3, inc: 0.0004, zoo: 'lây qua tiếp xúc — thông báo cơ quan thú y', regions: 'IN PK BD ET NG KE MN KZ ZA ZW' }],
    'thỏ': [{ id: 'gi', n: 'ứ trệ tiêu hóa', sev: 2, inc: 0.04 }, { id: 'teeth', n: 'răng mọc dài', sev: 1, inc: 0.04 }], 'rùa': [{ id: 'shell', n: 'nấm mai', sev: 1, inc: 0.03 }]
  };
  function sp(p) { return SP[p.k] || SP['chó']; }
  function petAge(l, p) { return Math.max(0, l.age - (p.since || 0) + (p.age0 || 0)); }
  function ensure(l, p) {
    if (p.id919) return p; var s = st(l); p.id919 = 'pet' + (++s.serial); var seed = l.id + ':' + p.id919 + ':' + p.n;
    if (!p.sex) p.sex = u(seed + ':sex') < 0.5 ? 'M' : 'F'; if (p.age0 == null) p.age0 = p.born919 ? 0 : Math.floor(u(seed + ':age') * (p.k === 'ngựa' ? 5 : 2));
    if (!p.rec919) p.rec919 = { vacc: null, worm: null, ill: null, hist: [], parents: p.parents919 || null }; if (p.neut == null) p.neut = false; return p;
  }
  function pets(l) { return (l.pets || []).filter(function (p) { return p.alive; }).map(function (p) { return ensure(l, p); }); }
  function vaccOk(l, p) { var v = p.rec919 && p.rec919.vacc; return v != null && l.age - v <= (p.k === 'ngựa' ? 1 : 2); }
  // ---- phả hệ ----
  function byId(l, id) { return (l.pets || []).find(function (p) { return p.id919 === id; }); }
  function related(l, a, b) {
    var pa = a.rec919 && a.rec919.parents || [], pb = b.rec919 && b.rec919.parents || [];
    if (pa.indexOf(b.id919) >= 0 || pb.indexOf(a.id919) >= 0) return 'cha/mẹ – con';
    var share = pa.filter(function (x) { return pb.indexOf(x) >= 0; }).length; if (share === 2) return 'anh chị em ruột'; if (share === 1) return 'anh chị em cùng cha hoặc cùng mẹ';
    var ga = [], gb = []; pa.forEach(function (x) { var q = byId(l, x); if (q && q.rec919 && q.rec919.parents) ga = ga.concat(q.rec919.parents); }); pb.forEach(function (x) { var q = byId(l, x); if (q && q.rec919 && q.rec919.parents) gb = gb.concat(q.rec919.parents); });
    return ga.some(function (x) { return gb.indexOf(x) >= 0; }) ? 'họ hàng gần (chung ông bà)' : pa.length && pb.length ? 'không cùng huyết thống đã biết' : 'chưa đủ phả hệ để kiểm tra';
  }
  // ---- bệnh ----
  function rollIll(l, p) {
    var list = (DZ[p.k] || []).filter(function (d) { return !d.regions || d.regions.split(' ').indexOf(res(l)) >= 0; }), a = petAge(l, p), base = l.id + ':ill919:' + p.id919 + ':' + l.age;
    if (u(base + ':gate') > 0.22) return null;
    var w = list.map(function (d) { var x = d.inc * (d.young && a <= 1 ? d.young : 1) * (d.old && a >= sp(p).old ? d.old : 1) * (d.vacc && vaccOk(l, p) ? d.vacc : 1) * (d.id === 'worms' || d.id === 'para' ? (p.rec919.worm != null && l.age - p.rec919.worm <= 1 ? 0.3 : 1) : 1); return x; }), sum = w.reduce(function (a, b) { return a + b; }, 0);
    if (u(base + ':hit') > sum / 0.22) return null; var t = u(base + ':which') * sum; for (var i = 0; i < list.length; i++) { t -= w[i]; if (t <= 0) return list[i]; } return null;
  }
  function illYear(l, r, log) {
    pets(l).forEach(function (p) {
      var c = p.rec919.ill; if (c && c.stage === 'chronic' && c.keptAt !== l.age) { c.keptAt = l.age; H.cash(l, -l.base * 0.01 * gdpK(l), 'Theo dõi bệnh mạn tính cho ' + p.n); }
      if (c && c.stage === 'symptoms' && c.at < l.age) { var d = find(p, c.id); c.stage = 'untreated'; if (d.sev >= 2 && u(l.id + ':untr:' + p.id919 + ':' + l.age) < (d.sev === 3 ? 0.7 : 0.3)) { die(l, p, d, log); } else { p.rec919.hist.push({ at: l.age, n: d.n, out: 'tự hồi phục' }); p.rec919.ill = null; } return; }
      if (c) return; var nd = rollIll(l, p); if (!nd) return;
      p.rec919.ill = { id: nd.id, at: l.age, stage: 'symptoms' }; zoo(l, p, nd, log, 'exposure');
      X.next(l, 'petIll919', r, { id: p.id919 }, { manual: false });
    });
  }
  function find(p, id) { return (DZ[p.k] || []).find(function (d) { return d.id === id; }) || { id: id, n: 'bệnh', sev: 1 }; }
  function die(l, p, d, log) { p.alive = false; p.died = l.age; p.rec919.hist.push({ at: l.age, n: d.n, out: 'không qua khỏi' }); p.rec919.ill = null; log(U.cap(H.petLabel(p)) + ' ' + p.n + ' không qua khỏi ' + d.n + '. Gia đình được bác sĩ thú y giúp cho bé ra đi nhẹ nhàng.', 'bad'); H.mem(l, 'Ngày tiễn ' + p.n + '.', 4); l.st.hap -= p.k === 'chó' || p.k === 'mèo' || p.k === 'ngựa' ? 8 : 3; }
  // Lây sang người: chỉ khi tác nhân có đường lây và có phơi nhiễm; giảm khi vệ sinh/đeo găng; nhóm nguy cơ được nhắc riêng.
  function zoo(l, p, d, log, phase) {
    if (!d.zoo) return; var s = st(l), x = u(l.id + ':zoo:' + p.id919 + ':' + d.id + ':' + l.age), hyg = s.hygiene ? 0.4 : 1, preg = l.flags.pregnant || l.partner && l.partner.pregnant;
    if (d.id === 'rabies') { var cost = l.base * 0.03; H.cash(l, -cost, 'Tiêm phòng dại sau phơi nhiễm (người)'); log('Vì ' + p.n + ' có dấu hiệu nghi dại, bạn được đưa ngay tới cơ sở y tế để tiêm phòng sau phơi nhiễm; cơ quan thú y được báo. Không chờ xem diễn biến.', 'neutral'); return; }
    if (d.id === 'toxo') { if (preg) log('Bác sĩ dặn: trong thai kỳ nên nhờ người khác dọn khay cát mèo hằng ngày hoặc đeo găng, rửa tay; nuôi mèo không đồng nghĩa thai nhi bị ảnh hưởng.', 'neutral'); return; }
    var risk = { ring: 0.15, psitt: 0.08, lepto: 0.05, myco: 0.04, lcmv: 0.02, derm: 0.03, anthrax: 0.05 }[d.id] || 0.02;
    if (x < risk * hyg) { H.fx(l, { hea: d.id === 'ring' || d.id === 'derm' ? -1 : -4 }); log('Bạn bị lây ' + (d.id === 'ring' || d.id === 'derm' ? 'nấm da' : d.id === 'psitt' ? 'bệnh sốt vẹt (viêm đường hô hấp)' : d.id === 'myco' ? 'nhiễm khuẩn da từ nước bể cá' : d.n) + ' từ ' + p.n + ' (' + d.zoo + '); đi khám và điều trị theo bác sĩ.', 'bad'); }
  }
  E.SC('petIll919', { title: 'Thú cưng có dấu hiệu bệnh', valid: function (l, d) { var p = d && d.id && byId(l, d.id); return l.alive && !!p && p.alive && !!p.rec919.ill && p.rec919.ill.stage === 'symptoms'; },
    prep: function (l, r, a) { return { id: a && a.id }; },
    text: function (l, d) { var p = byId(l, d.id), c = p.rec919.ill, dd = find(p, c.id); return p.n + ' (' + H.petLabel(p) + ', ' + petAge(l, p) + ' tuổi) có triệu chứng bất thường. Chỉ bác sĩ thú y khám, xét nghiệm mới xác định được bệnh và phác đồ; game không cho tự chọn thuốc.' + (dd.sev >= 2 ? ' Triệu chứng có vẻ nặng.' : '') + (dd.zoo ? ' Nên rửa tay, đeo găng khi chăm sóc.' : ''); },
    opts: [{ k: 'vet', l: 'Đưa đi bác sĩ thú y khám và điều trị theo chỉ định', h: function (l) { return 'Khám + điều trị ~' + mo(l, l.base * 0.03 * gdpK(l)); }, run: function (l, r, log, d) { treat(l, d.id, 'vet', log); } },
      { k: 'hosp', l: 'Nhập viện thú y (theo dõi, truyền dịch, chăm sóc tích cực)', h: function (l) { return '~' + mo(l, l.base * 0.1 * gdpK(l)); }, req: function (l, d) { var p = byId(l, d.id); return !!p && find(p, p.rec919.ill.id).sev >= 2; }, run: function (l, r, log, d) { treat(l, d.id, 'hosp', log); } },
      { k: 'home', l: 'Theo dõi tại nhà, chăm sóc cơ bản (chỉ khi triệu chứng nhẹ)', req: function (l, d) { var p = byId(l, d.id); return !!p && find(p, p.rec919.ill.id).sev === 1; }, run: function (l, r, log, d) { treat(l, d.id, 'home', log); } }] });
  function treat(l, id, how, log) {
    var p = byId(l, id); if (!p || !p.rec919.ill || p.rec919.ill.stage !== 'symptoms') return; var c = p.rec919.ill, d = find(p, c.id), k = gdpK(l);
    var cost = how === 'hosp' ? 0.1 : how === 'vet' ? 0.03 * (d.sev === 3 ? 2 : 1) : 0.003; H.cash(l, -l.base * cost * k, (how === 'home' ? 'Chăm sóc tại nhà cho ' : 'Thú y cho ') + p.n);
    var x = u(l.id + ':tr919:' + id + ':' + c.at + ':' + how), young = petAge(l, p) <= 1, surv = d.sev === 1 ? (how === 'home' ? 0.9 : 0.98) : d.sev === 2 ? (how === 'hosp' ? 0.92 : 0.8) : (how === 'hosp' ? (young ? 0.65 : 0.72) : 0.45);
    if (d.id === 'rabies') surv = 0;
    log('Bác sĩ thú y chẩn đoán ' + p.n + ' bị ' + d.n + '.', 'neutral');
    if (x > surv) { die(l, p, d, log); return; }
    if (d.chronic) { c.stage = 'chronic'; c.dx = l.age; log(p.n + ' cần theo dõi lâu dài; bệnh không khỏi hẳn nhưng có thể sống thoải mái với chăm sóc phù hợp.', 'neutral'); return; }
    p.rec919.hist.push({ at: l.age, n: d.n, out: 'hồi phục' + (d.sev === 3 && x > surv - 0.15 ? ', còn di chứng nhẹ' : '') }); p.rec919.ill = null; log(p.n + ' hồi phục' + (d.sev === 3 ? ' sau thời gian điều trị vất vả' : '') + '.', 'good');
  }
  // ---- sinh sản ----
  function breedWhy(l, p, mate) {
    var S = sp(p); if (!S.litter) return 'Loài này không phối giống trong game'; if (p.neut) return p.n + ' đã triệt sản'; if (p.rec919.preg) return p.n + ' đang mang thai'; if (p.service919) return 'Chó hỗ trợ không dùng để phối giống';
    var a = petAge(l, p); if (a < S.mature + (p.k === 'chó' || p.k === 'mèo' ? 1 : 0)) return 'Chưa đủ tuổi trưởng thành an toàn'; if (a > S.old) return 'Tuổi đã cao, thú y khuyên không phối';
    if (p.rec919.ill) return 'Đang có bệnh'; if (mate && (mate.neut || mate.sex === p.sex)) return 'Con giống không phù hợp'; return true;
  }
  function breed(l, p, mate, log) {
    var fem = p.sex === 'F' ? p : mate && mate.sex === 'F' ? mate : null; if (!fem) { log('Con cái là bên mang thai; ' + p.n + ' là con đực nên lứa con thuộc chủ của con cái.', 'neutral'); H.cash(l, -l.base * 0.005, 'Khám thú y trước phối giống'); return; }
    H.cash(l, -l.base * (mate ? 0.01 : 0.04) * gdpK(l), mate ? 'Khám thú y trước phối giống' : 'Phí con giống và khám thú y');
    var rel = mate ? related(l, fem, mate) : 'không cùng huyết thống đã biết', close = /cha\/mẹ|ruột|cùng cha|họ hàng gần/.test(rel);
    fem.rec919.preg = { at: l.age, sire: mate ? mate.id919 : null, rel: rel, close: close };
    log(fem.n + ' được phối giống' + (mate ? ' với ' + mate.n + ' (' + rel + ')' : ' với con giống thuê') + '. ' + (close ? 'Thú y cảnh báo giao phối cận huyết làm tăng nguy cơ bệnh di truyền và biến chứng (không chắc chắn con nào bị). ' : '') + 'Kết quả mang thai và số con sẽ rõ vào năm sau.', close ? 'neutral' : 'neutral');
  }
  function birthYear(l, r, log) {
    pets(l).forEach(function (p) {
      var g = p.rec919.preg; if (!g || g.at >= l.age) return; delete p.rec919.preg; var S = sp(p), x = u(l.id + ':preg:' + p.id919 + ':' + g.at);
      if (x < 0.25) { log(p.n + ' không đậu thai sau lần phối giống.', 'neutral'); return; }
      var n = S.litter[0] + Math.floor(u(l.id + ':litter:' + p.id919 + ':' + g.at) * (S.litter[1] - S.litter[0] + 1)), comp = u(l.id + ':comp:' + p.id919 + ':' + g.at) < (g.close ? 0.18 : 0.08);
      if (comp) { H.cash(l, -l.base * 0.06 * gdpK(l), 'Can thiệp thú y khi ' + p.n + ' sinh'); n = Math.max(1, n - 1); }
      var kids = [];
      for (var i = 0; i < n; i++) { var c = H.addPet(l, r, p.k, p.br); c.born919 = true; c.age0 = 0; c.parents919 = [p.id919].concat(g.sire ? [g.sire] : []); ensure(l, c); c.rec919.parents = c.parents919; if (g.close && u(l.id + ':inb:' + c.id919) < 0.2) c.rec919.hist.push({ at: l.age, n: 'yếu tố sức khỏe bẩm sinh cần theo dõi', out: 'theo dõi' }); kids.push(c); }
      p.rec919.litters = (p.rec919.litters || 0) + 1;
      log(p.n + ' sinh ' + n + ' con' + (comp ? ' sau ca sinh khó có thú y can thiệp' : '') + '. Mỗi bé đã có hồ sơ riêng; bạn cần chăm sóc hoặc tìm nhà mới có trách nhiệm.', 'good');
      st(l).homing = kids.map(function (c) { return c.id919; }); X.next(l, 'petHome919', r, {}, { manual: false });
    });
  }
  X.menu('petHome919', 'Tìm nhà cho đàn con', function (l) { return (st(l).homing || []).some(function (id) { var p = byId(l, id); return p && p.alive; }) ? true : 'Không có bé nào chờ nhà mới'; }, 'Mỗi bé cần nơi chăm sóc lâu dài. Có thể giữ lại một phần, gửi người quen có trách nhiệm hoặc nhờ tổ chức cứu hộ.', function (l) {
    var hs = (st(l).homing || []).map(function (id) { return byId(l, id); }).filter(function (p) { return p && p.alive; });
    return [{ k: 'keepOne', l: 'Giữ lại một bé, gửi những bé còn lại cho người nhận nuôi có trách nhiệm', run: function (l, r, log) { hs.slice(1).forEach(function (p) { p.alive = false; p.rehomed919 = l.age; }); st(l).homing = []; H.fx(l, { karma: 1 }); log('Các bé còn lại đã có nhà mới; bạn giữ ' + hs[0].n + '.', 'good'); } },
      { k: 'all', l: 'Gửi tất cả cho người nhận nuôi', run: function (l, r, log) { hs.forEach(function (p) { p.alive = false; p.rehomed919 = l.age; }); st(l).homing = []; log('Cả đàn đã có nhà mới.', 'good'); } },
      { k: 'keep', l: 'Giữ cả đàn', why: H.pets(l).length <= 6 ? true : 'Quá nhiều vật nuôi để chăm sóc tốt', run: function (l, r, log) { st(l).homing = []; log('Bạn giữ cả đàn; chi phí nuôi tăng theo số lượng.', 'neutral'); } }];
  }, 0);

  // ---- ngựa và cưỡi ngựa ----
  function horses(l) { return pets(l).filter(function (p) { return p.k === 'ngựa'; }); }
  function stableWhy(l) { if (l.age < 16) return 'Cần đủ 16 tuổi để tự chịu trách nhiệm nuôi ngựa'; if (!l.indep) return 'Cần tự lập tài chính'; return true; }
  function horseYear(l, log) { horses(l).forEach(function (h) { var b = h.rec919.board; if (!l.urban && b !== 'boarding') return; if (h.rec919.boardAt === l.age) return; h.rec919.boardAt = l.age; H.cash(l, -l.base * 0.25 * gdpK(l), 'Gửi nuôi/chuồng cho ngựa ' + h.n); }); }

  // ---- menu ----
  X.menu('pets919', 'Thú cưng, ngựa: hồ sơ, thú y và sinh sản', function (l) { var r = X.reason(l, 8); if (r !== true) return r; return H.pets(l).length || l.age >= 16 && l.indep ? true : 'Chưa có vật nuôi'; }, function (l) {
    var s = st(l);
    return pets(l).map(function (p) { var r0 = p.rec919, S = sp(p); return '• ' + p.n + ' — ' + H.petLabel(p) + ', ' + (p.sex === 'F' ? 'cái' : 'đực') + ', ' + petAge(l, p) + ' tuổi' + (p.service919 ? ', chó hỗ trợ' : '') + (p.neut ? ', đã triệt sản' : '') + (S.vacc ? '; tiêm phòng: ' + (vaccOk(l, p) ? 'đủ' : 'cần tiêm') : '') + (r0.parents ? '; cha mẹ: ' + r0.parents.map(function (id) { var q = byId(l, id); return q ? q.n : 'con giống thuê'; }).join(' × ') : '') + (r0.ill ? '; ' + (r0.ill.stage === 'chronic' ? 'đang theo dõi ' + find(p, r0.ill.id).n : 'có triệu chứng') : '') + (r0.preg ? '; đang mang thai' : '') + (r0.hist.length ? '; bệnh sử: ' + r0.hist.slice(-2).map(function (h) { return h.n + ' (' + h.out + ')'; }).join(', ') : ''); }).join('\n') +
      '\nTiêm phòng, tẩy ký sinh và vệ sinh giảm nguy cơ có giới hạn, không miễn dịch tuyệt đối. Chi phí thú y tùy loài, thủ thuật và nơi sống (hệ thú y thường không thuộc bảo hiểm y tế người).' + (s.hygiene ? ' Gia đình đã có thói quen vệ sinh khi chăm vật nuôi.' : '') + (horses(l).length ? '\nKỹ năng cưỡi ngựa: ' + Math.round(s.ride) + '/100.' : '');
  }, function (l) {
    var s = st(l), out = [];
    pets(l).forEach(function (p) {
      var S = sp(p), key = p.id919;
      if (S.vacc) out.push({ k: 'vac:' + key, l: 'Tiêm phòng và tẩy ký sinh cho ' + p.n, h: mo(l, l.base * 0.01 * gdpK(l)), why: vaccOk(l, p) && p.rec919.worm === l.age ? 'Đã đủ' : true, run: function (l, r, log) { H.cash(l, -l.base * 0.01 * gdpK(l), 'Tiêm phòng, tẩy ký sinh cho ' + p.n); p.rec919.vacc = l.age; p.rec919.worm = l.age; log(p.n + ' được tiêm ' + S.vacc + ' và tẩy ký sinh theo lịch.', 'good'); } });
      else if (DZ[p.k] && DZ[p.k].some(function (d) { return d.id === 'para' || d.id === 'worms'; })) out.push({ k: 'chk:' + key, l: 'Khám định kỳ, xét nghiệm phân cho ' + p.n, h: mo(l, l.base * 0.006 * gdpK(l)), why: p.rec919.worm === l.age ? 'Đã khám năm nay' : true, run: function (l, r, log) { H.cash(l, -l.base * 0.006 * gdpK(l), 'Khám định kỳ cho ' + p.n); p.rec919.worm = l.age; log('Đã khám định kỳ cho ' + p.n + '.', 'good'); } });
      if (S.neut && !p.neut && !p.service919) { var nc = l.base * (p.sex === 'F' ? S.neut[1] : S.neut[0]) * gdpK(l); out.push({ k: 'neut:' + key, l: 'Triệt sản cho ' + p.n + ' (theo tư vấn thú y)', h: '~' + mo(l, nc) + ' · cần 1–2 tuần hồi phục', why: petAge(l, p) < 0.5 ? 'Chưa đủ tuổi' : p.rec919.preg ? 'Đang mang thai' : p.rec919.ill ? 'Đang có bệnh' : true, run: function (l, r, log) { if (p.neut) return; H.cash(l, -nc, 'Triệt sản cho ' + p.n); p.neut = true; p.rec919.neutAt = l.age; log(p.n + ' được triệt sản, hồi phục tốt sau vài ngày theo dõi.', 'good'); } }); }
      if (S.litter && !p.neut) {
        out.push({ k: 'stud:' + key, l: 'Phối giống ' + p.n + ' với con giống thuê (có thú y tư vấn)', why: breedWhy(l, p, null), run: function (l, r, log) { if (breedWhy(l, p, null) === true) breed(l, p, null, log); } });
        pets(l).filter(function (q) { return q !== p && q.k === p.k && q.sex !== p.sex && p.sex === 'F'; }).forEach(function (q) { out.push({ k: 'pair:' + key + ':' + q.id919, l: 'Phối ' + p.n + ' với ' + q.n + ' (' + related(l, p, q) + ')', why: breedWhy(l, p, q), run: function (l, r, log) { if (breedWhy(l, p, q) === true) breed(l, p, q, log); } }); });
      }
      if (p.k === 'ngựa') {
        out.push({ k: 'ride:' + key, l: 'Học/luyện cưỡi ' + p.n + ' với huấn luyện viên', h: mo(l, l.base * 0.03 * gdpK(l)) + ' · có mũ bảo hộ', why: s.rideAt === l.age ? 'Đã luyện năm nay' : true, run: function (l, r, log) { s.rideAt = l.age; H.cash(l, -l.base * 0.03 * gdpK(l), 'Học cưỡi ngựa'); s.ride = Math.min(100, s.ride + (100 - s.ride) * 0.18); if (u(l.id + ':fallh:' + l.age) < 0.04) { H.fx(l, { hea: -3 }); log('Bạn bị ngã khi luyện tập, may nhờ mũ bảo hộ nên chỉ bầm nhẹ.', 'bad'); } else log('Buổi luyện tập tiến bộ; kỹ năng cưỡi ' + Math.round(s.ride) + '/100.', 'good'); } });
        out.push({ k: 'show:' + key, l: 'Tham gia giải cưỡi ngựa nghiệp dư cùng ' + p.n, h: 'Lệ phí ' + mo(l, l.base * 0.02 * gdpK(l)), why: s.ride < 30 ? 'Cần kỹ năng cưỡi 30+' : s.showAt === l.age ? 'Đã thi năm nay' : p.rec919.ill ? 'Ngựa đang bệnh' : true, run: function (l, r, log) { s.showAt = l.age; H.cash(l, -l.base * 0.02 * gdpK(l), 'Lệ phí giải cưỡi ngựa'); var sc = s.ride * 0.6 + (p.br === 'ngựa thuần chủng địa phương' ? 20 : 26) + u(l.id + ':show:' + l.age) * 30, field = 55 + u(l.id + ':field:' + l.age) * 30; if (sc > field + 10) { H.cash(l, l.base * 0.03, 'Giải thưởng cưỡi ngựa'); H.fx(l, { hap: 6 }); H.mem(l, 'Cùng ' + p.n + ' giành giải cưỡi ngựa.', 4); log('Bạn và ' + p.n + ' đoạt giải! Tiền thưởng nhỏ hơn chi phí nuôi ngựa cả năm.', 'big'); } else log('Bạn hoàn thành phần thi, chưa vào nhóm có giải. Kết quả tùy kỹ năng, chuẩn bị và đối thủ.', 'neutral'); } });
        if (l.urban || p.rec919.board === 'boarding') out.push({ k: 'board:' + key, l: (p.rec919.board === 'boarding' ? '✓ ' : '') + 'Gửi ' + p.n + ' ở trang trại (boarding)', run: function () { p.rec919.board = 'boarding'; } });
      }
    });
    if (!s.hygiene) out.push({ k: 'hyg', l: 'Thói quen vệ sinh khi chăm vật nuôi (rửa tay, găng khi dọn chuồng/khay/bể)', run: function (l, r, log) { s.hygiene = true; log('Cả nhà giữ thói quen vệ sinh; nguy cơ lây bệnh từ vật nuôi giảm (không về 0).', 'good'); } });
    if (!horses(l).length) out.push({ k: 'horse', l: 'Mua và nuôi một con ngựa', h: 'Giá ~' + mo(l, l.base * 0.4) + ' · chuồng/gửi nuôi, thức ăn, thú y, chăm móng hằng năm', why: stableWhy(l) !== true ? stableWhy(l) : l.money < l.base * 0.7 ? 'Cần đủ tiền mua và dự phòng một năm nuôi' : true, run: function (l, r, log) { H.cash(l, -l.base * 0.4, 'Mua ngựa'); var h = H.addPet(l, r, 'ngựa', 'ngựa thuần chủng địa phương'); ensure(l, h); h.rec919.board = l.urban ? 'boarding' : 'home'; log('Bạn nhận nuôi ngựa ' + h.n + (l.urban ? ' và gửi ở trang trại ngoại ô' : ' trong chuồng ở nhà') + '. Cưỡi ngựa cần học có huấn luyện viên.', 'good'); } });
    return out.slice(0, 50);
  }, 8, 'Đời sống');

  // ---- năm, thế hệ ----
  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !l.flags || !(l.pets || []).length) return; var s = st(l); if (s.yearAt === l.age) return; s.yearAt = l.age; pets(l); birthYear(l, r, log); illYear(l, r, log); horseYear(l, log); });
  // Tình huống bệnh cũ của scenarios ("để vài hôm xem sao" cho bệnh nặng) nhường cho hồ sơ bệnh theo loài; dữ liệu cũ vẫn hợp lệ.
  E.TRIG.filter(function (t) { return t.id === 'pet_om'; }).forEach(function (t) { var w = t.when; t.when = function (l, a) { return !l.flags.pets919 && w(l, a); }; });
  // Chủ mất: vật nuôi còn sống có người tiếp nhận rõ ràng (bạn đời, con đã lớn, người thân), giữ ID và hồ sơ; không bị bỏ sót.
  function guardian(l) { if (l.partner && l.partner.alive !== false) return l.partner.name; var k = (l.kids || []).find(function (k) { return k.alive !== false && l.age - k.born >= 16; }); if (k) return k.name; var t = (l.sibList || []).find(function (t) { return t.alive !== false; }); return t ? (t.n || t.name) : 'một tổ chức cứu hộ động vật'; }
  function handover(l) { if (l && !l.alive && l.flags) { var ps = (l.pets || []).filter(function (p) { return p.alive && !p.guardian919; }); if (ps.length) { var g = guardian(l); ps.forEach(function (p) { ensure(l, p); p.guardian919 = g; }); l.log.push({ a: l.age, y: l.birthYear + l.age, t: g + ' nhận chăm sóc ' + ps.map(function (p) { return p.n; }).join(', ') + ' sau khi bạn ra đi.', k: 'neutral' }); } } }
  var kill0 = H.kill; H.kill = function (l) { var out = kill0.apply(this, arguments); handover(l); return out; };
  var by0 = E.beginYear; E.beginYear = function (l) { var out = by0.apply(this, arguments); handover(l); return out; };
  var rs0 = E.resolve; E.resolve = function (l) { var out = rs0.apply(this, arguments); handover(l); return out; };
  var mig = E.migrateExt; E.migrateExt = function (l) { if (mig) mig(l); if (l && l.flags && l.flags.pets919 != null && typeof l.flags.pets919 !== 'object') delete l.flags.pets919; };
  E.PETS919 = { SP: SP, DZ: DZ, ensure: ensure, pets: pets, petAge: petAge, related: related, rollIll: rollIll, treat: treat, breedWhy: breedWhy, breed: breed, birthYear: birthYear, vaccOk: vaccOk, zoo: zoo, byId: byId, state: st };
})(globalThis.G);
