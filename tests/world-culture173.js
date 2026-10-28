'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext();
const E = G.E, H = E.H, W = G.W;

let checks = 0;
function ok(cond, msg) {
  assert(cond, msg);
  checks++;
}

// Danh sách từ khóa đặc trưng chỉ dành cho lãnh thổ / thể chế Việt Nam (không được xuất hiện cho người bản địa ngoài VN)
const VN_ONLY_REGEX = /Tết Nguyên đán|ông Công ông Táo|bánh chưng|Đội Thiếu niên|Đoàn Thanh niên|khăn quàng đỏ|VinFast|Xanh SM|Vietlott|xổ số kiến thiết|CCCD|CSGT|VKSND|UBND|BHYT|BHXH|quán nét cỏ|đua xe trái phép|gọi 111|sổ đỏ|Tây Bắc|Đà Lạt|Sầm Sơn|Cửa Lò|Bách khoa Hà Nội|Kinh tế Quốc dân/i;

function makeWorldLife(code, seed = 173, extra = {}) {
  const l = E.createLife(Object.assign({ mode: 'world', country: code, seed }, extra));
  // Đảm bảo nhân vật bản địa không mang họ tên / tổ tiên Việt Nam ngẫu nhiên khi kiểm thử độc lập quốc gia
  if (code !== 'VN' && !extra.keepAncestry) {
    if (l.flags && l.flags.life138) {
      l.flags.life138.ancestry = [code];
    }
  }
  return l;
}

// 1. Kiểm tra toàn bộ 195 quốc gia có hồ sơ văn hóa & vùng địa lý hợp lệ
ok(W.C.length === 195, 'Phải có đúng 195 quốc gia trong G.W.C');
const levelCounts = { deep: 0, country: 0, regional: 0 };
for (const c of W.C) {
  const pr = E.cultureProfile173(c.code);
  ok(pr && pr.code === c.code && pr.name === c.name, 'Hồ sơ hợp lệ cho ' + c.code);
  ok(pr.region && pr.regionName && pr.regionName !== 'Chưa phân vùng', 'Phân vùng địa lý hợp lệ cho ' + c.code);
  ok(['deep', 'country', 'regional'].includes(pr.level), 'Cấp độ hồ sơ hợp lệ cho ' + c.code);
  levelCounts[pr.level]++;
}
ok(levelCounts.deep >= 20, 'Ít nhất 20 quốc gia có hồ sơ chuyên sâu (deep): ' + levelCounts.deep);

// 2. Kịch bản 1: Nhật Bản (JP)
{
  const l = makeWorldLife('JP', 201);
  ok(!H.inVN(l) && !H.isVN(l) && !H.hasVNOrigin(l), 'JP native không phải VN');
  const cel = E.celebrationItems173(l);
  ok(cel.some(x => /Shōgatsu/.test(x[1])) && !cel.some(x => /Tết cùng gia đình|Tết cổ truyền Việt Nam/.test(x[1])), 'JP celebration có Shōgatsu, không có Tết VN');
  ok(/Shōgatsu/.test(E.partyHolidayLabel173(l)), 'JP party label dùng Shōgatsu');
  l.age = 1;
  const tn = E.DEC.thoi_noi.make(l, () => 0.5);
  ok(/1 tuổi|Erabitori/i.test(tn.title + ' ' + tn.text) && !/thôi nôi/i.test(tn.title), 'JP 1 tuổi dùng nghi thức bản địa');
  l.age = 14; l.school = 'lower';
  ok(E.DEC.world_school173.valid(l), 'JP học sinh mở được world_school173 (bukatsu)');
  const sc = E.DEC.world_school173.make(l, () => 0.5);
  ok(/bukatsu/i.test(sc.title + ' ' + sc.text), 'JP học đường có bukatsu');
  l.age = 17; l.school = 'upper';
  ok(E.DEC.world_exam173.valid(l), 'JP tuổi 17 mở được world_exam173');
  const ex = E.DEC.world_exam173.make(l, () => 0.5);
  ok(/Kyōtsū|Center Test|tuyển sinh đại học/i.test(ex.text), 'JP kỳ thi cuối cấp phù hợp');
  l.age = 20; l.school = null; l.indep = true;
  ok(E.DEC.world_coming173.valid(l), 'JP tuổi 20 mở được Lễ Thành nhân (Seijin-shiki)');
  const co = E.DEC.world_coming173.make(l, () => 0.5);
  ok(/Seijin-shiki/i.test(co.text), 'JP có Seijin-shiki ở tuổi 20');
  l.age = 26; l.job = { id: 'lap_trinh', rank: 0, yrs: 2 };
  const wk = E.DEC.world_workplace173.make(l, () => 0.5);
  ok(/nomikai/i.test(wk.text), 'JP công sở có tình huống nomikai');
}

// 3. Kịch bản 2: Hàn Quốc (KR)
{
  const l = makeWorldLife('KR', 202);
  const cel = E.celebrationItems173(l);
  ok(cel.some(x => /Seollal/.test(x[1])) && !cel.some(x => /Tết cổ truyền Việt Nam/.test(x[1])), 'KR celebration có Seollal');
  l.age = 1;
  const tn = E.DEC.thoi_noi.make(l, () => 0.5);
  ok(/Doljanchi/i.test(tn.title + ' ' + tn.text), 'KR 1 tuổi có Doljanchi');
  l.age = 15; l.school = 'upper';
  const sc = E.DEC.world_school173.make(l, () => 0.5);
  ok(/hagwon/i.test(sc.title + ' ' + sc.text), 'KR học đường có hagwon');
  l.age = 17;
  const ex = E.DEC.world_exam173.make(l, () => 0.5);
  ok(/Suneung|CSAT/i.test(ex.text), 'KR tuổi 17 có Suneung (CSAT)');
  l.age = 26; l.school = null; l.indep = true; l.job = { id: 'ke_toan', rank: 0, yrs: 2 };
  const wk = E.DEC.world_workplace173.make(l, () => 0.5);
  ok(/hoesik/i.test(wk.text), 'KR công sở có tình huống hoesik');
}

// 4. Kịch bản 3: Hoa Kỳ (US)
{
  const l = makeWorldLife('US', 203);
  l.pool = 'en';
  const cel = E.celebrationItems173(l);
  ok(cel.some(x => /Thanksgiving/.test(x[1])) && !cel.some(x => /Tết Nguyên đán/.test(x[1])), 'US celebration có Thanksgiving');
  l.age = 15; l.school = 'upper';
  const sc = E.DEC.world_school173.make(l, () => 0.5);
  ok(/ngoại khóa/i.test(sc.title + ' ' + sc.text), 'US học đường có hoạt động ngoại khóa');
  l.age = 17;
  const ex = E.DEC.world_exam173.make(l, () => 0.5);
  ok(/SAT\/ACT/i.test(ex.text), 'US tuổi 17 có SAT/ACT');
}

// 5. Kịch bản 4: Đức / Pháp / Anh (DE, FR, GB)
{
  const de = makeWorldLife('DE', 204);
  de.age = 10; de.school = 'primary';
  const scDe = E.DEC.world_school173.make(de, () => 0.5);
  ok(/Gymnasium|Realschule/i.test(scDe.text), 'DE tuổi 10 có phân luồng Gymnasium/Realschule');
  de.age = 17; de.school = 'upper';
  ok(/Abitur/i.test(E.DEC.world_exam173.make(de, () => 0.5).text), 'DE tuổi 17 có Abitur');
  de.age = 28; de.school = null; de.indep = true; de.job = { id: 'ky_su_xd', rank: 0, yrs: 3 };
  ok(/Betriebsrat/i.test(E.DEC.world_workplace173.make(de, () => 0.5).text), 'DE công sở có Betriebsrat');

  const fr = makeWorldLife('FR', 205);
  fr.age = 17; fr.school = 'upper';
  ok(/Baccalauréat/i.test(E.DEC.world_exam173.make(fr, () => 0.5).text), 'FR tuổi 17 có Baccalauréat');

  const gb = makeWorldLife('GB', 206);
  gb.age = 14; gb.school = 'lower';
  ok(/GCSE/i.test(E.DEC.world_school173.make(gb, () => 0.5).text), 'GB tuổi 14 có GCSE');
  gb.age = 17; gb.school = 'upper';
  ok(/A-Level/i.test(E.DEC.world_exam173.make(gb, () => 0.5).text), 'GB tuổi 17 có A-Level');
}

// 6. Kịch bản 5: Ấn Độ / Thái Lan / Indonesia (IN, TH, ID)
{
  const ind = makeWorldLife('IN', 207);
  ok(E.celebrationItems173(ind).some(x => /Diwali/.test(x[1])), 'IN có lễ Diwali');
  ind.age = 17; ind.school = 'upper';
  ok(/Board Exams/i.test(E.DEC.world_exam173.make(ind, () => 0.5).text), 'IN tuổi 17 có Board Exams');

  const th = makeWorldLife('TH', 208);
  ok(E.celebrationItems173(th).some(x => /Songkran/.test(x[1])), 'TH có lễ Songkran');

  const idn = makeWorldLife('ID', 209);
  ok(E.celebrationItems173(idn).some(x => /Lebaran/.test(x[1])), 'ID có lễ Lebaran');
}

// 7. Kịch bản 6: Brazil / Mexico (BR, MX)
{
  const br = makeWorldLife('BR', 210);
  ok(E.celebrationItems173(br).some(x => /Carnaval/.test(x[1])), 'BR có Carnaval');
  br.age = 17; br.school = 'upper';
  ok(/ENEM|Vestibular/i.test(E.DEC.world_exam173.make(br, () => 0.5).text), 'BR có kỳ thi ENEM/Vestibular');

  const mx = makeWorldLife('MX', 211);
  mx.sex = 'F';
  ok(E.celebrationItems173(mx).some(x => /Día de Muertos/.test(x[1])), 'MX có Día de Muertos');
  mx.age = 15;
  ok(E.DEC.world_coming173.valid(mx), 'MX nữ 15 tuổi có lễ Quinceañera');
  const q = E.DEC.world_coming173.make(mx, () => 0.5);
  ok(/Quinceañera/i.test(q.text), 'MX hiển thị Quinceañera');
}

// 8. Kịch bản 7: Ai Cập / Nam Phi (EG, ZA)
{
  const eg = makeWorldLife('EG', 212);
  ok(E.celebrationItems173(eg).some(x => /Eid al-Fitr/.test(x[1])), 'EG có Eid al-Fitr');
  eg.age = 17; eg.school = 'upper';
  ok(/Thanaweya Amma/i.test(E.DEC.world_exam173.make(eg, () => 0.5).text), 'EG có Thanaweya Amma');

  const za = makeWorldLife('ZA', 213);
  ok(E.festivalCandidates173(za).some(x => x.id === 'heritage_za' || x.id === 'xmas_summer'), 'ZA có lễ hội Nam Phi');
  za.age = 17; za.school = 'upper';
  ok(/Matric/i.test(E.DEC.world_exam173.make(za, () => 0.5).text), 'ZA có kỳ thi Matric');
}

// 9. Kịch bản 8: Quốc gia nhỏ (AD, BT, FJ, CV, TV) — không lỗi, không có Tết VN, có phương án 0 đồng
for (const smallCode of ['AD', 'BT', 'FJ', 'CV', 'TV']) {
  const sm = makeWorldLife(smallCode, 214);
  sm.religion = 'Không tôn giáo';
  const cands = E.festivalCandidates173(sm);
  ok(cands.length > 0, smallCode + ' luôn có ít nhất 1 dịp lễ phù hợp');
  sm.age = 20; sm.indep = true; sm.money = 0;
  const festDec = E.DEC.world_festival173.make(sm, () => 0.5);
  ok(!VN_ONLY_REGEX.test(festDec.text), smallCode + ' không rò rỉ nội dung chỉ dành cho VN');
  // Kiểm tra nhân vật nghèo (money = 0) vẫn chọn được phương án đón lễ giản dị tại nhà (home)
  const homeIdx = festDec.data.keys.indexOf('home');
  ok(homeIdx >= 0, smallCode + ' có lựa chọn đón lễ giản dị 0 đồng tại nhà');
  E.DEC.world_festival173.apply(sm, festDec, String(homeIdx), () => 0.5, () => {});
  ok(sm.money === 0 && Object.keys(sm.flags.culture173.festivals).length === 1, smallCode + ' đón lễ tại nhà không tốn tiền và được ghi nhận');
}

// 10. Kịch bản 9: Nhân vật sinh và sống trọn đời tại Việt Nam (VN) — bảo toàn đầy đủ bản sắc Việt Nam
{
  const vn = E.createLife({ mode: 'vn', seed: 215 });
  ok(H.inVN(vn) && H.isVN(vn) && H.hasVNOrigin(vn), 'VN native có đầy đủ cờ VN');
  ok(E.celebrationItems173(vn)[0][1] === 'Đón Tết cùng gia đình', 'VN giữ nguyên Đón Tết cùng gia đình');
  vn.age = 1;
  const tn = E.DEC.thoi_noi.make(vn, () => 0.5);
  ok(/thôi nôi/i.test(tn.title), 'VN giữ nguyên Lễ thôi nôi');
}

// 11. Kịch bản 10 & 11: Người Việt du học / làm việc tạm thời (perm: false) và định cư (perm: true) ở nước ngoài
{
  const vnAbroad = E.createLife({ mode: 'vn', seed: 216 });
  vnAbroad.age = 21; vnAbroad.indep = true;
  vnAbroad.abroad = { code: 'JP', name: 'Nhật Bản', perm: false, study: true, base: 20 };
  ok(!H.inVN(vnAbroad) && H.isVN(vnAbroad) && H.hasVNOrigin(vnAbroad), 'Du học sinh VN tại JP: inVN=false nhưng hasVNOrigin=true');
  const ctx = E.culturalContext173(vnAbroad);
  ok(ctx.residenceCountry === 'JP' && ctx.residenceType === 'study' && ctx.diaspora === true, 'Bối cảnh cư trú du học tại JP chính xác');
  const cel = E.celebrationItems173(vnAbroad);
  ok(cel.some(x => /Shōgatsu/.test(x[1])) && cel.some(x => /Tết cổ truyền Việt Nam/.test(x[1])), 'Người Việt tại JP có cả lễ Shōgatsu và lựa chọn giữ Tết cổ truyền Việt Nam');

  // Kiểm tra sự kiện hòa nhập văn hóa nơi đất khách
  ok(E.DEC.world_integration173.valid(vnAbroad), 'Du học sinh mở được sự kiện hòa nhập world_integration173');
  const intDec = E.DEC.world_integration173.make(vnAbroad, () => 0.5);
  const bothIdx = intDec.data.keys.indexOf('both');
  E.DEC.world_integration173.apply(vnAbroad, intDec, String(bothIdx), () => 0.5, () => {});
  ok(vnAbroad.flags.culture173.integration > 20 && vnAbroad.flags.culture173.tradition > 60, 'Lựa chọn cân bằng hai nền văn hóa tăng cả hòa nhập lẫn truyền thống');

  // Chuyển sang định cư lâu dài (perm: true)
  vnAbroad.abroad.perm = true;
  delete vnAbroad.abroad.study;
  ok(E.culturalContext173(vnAbroad).residenceType === 'settled', 'Định cư lâu dài có residenceType = settled');
  const prof = E.profile(vnAbroad);
  ok(prof.culture173 && prof.jobInfo.some(s => /Bản sắc và cư trú/.test(s)), 'Hồ sơ nhân vật hiển thị Bản sắc và cư trú');
}

// 12. Kịch bản 12: Con sinh ra ở nước ngoài trong gia đình gốc Việt (country: US, ancestry: ['VN'])
{
  const kidUS = makeWorldLife('US', 217, { keepAncestry: true });
  kidUS.flags.life138.ancestry = ['VN', 'US'];
  ok(!H.inVN(kidUS) && H.hasVNOrigin(kidUS), 'Thế hệ thứ hai tại Mỹ có inVN=false và hasVNOrigin=true');
  const ctx = E.culturalContext173(kidUS);
  ok(ctx.residenceType === 'heritage' && ctx.heritage.includes('VN'), 'Thế hệ thứ hai có residenceType = heritage và heritage chứa VN');
  const cel = E.celebrationItems173(kidUS);
  ok(cel.some(x => /Thanksgiving/.test(x[1])) && cel.some(x => /Tết cổ truyền Việt Nam/.test(x[1])), 'Thế hệ thứ hai tại Mỹ có cả Thanksgiving và Tết cổ truyền Việt Nam');
}

// 13. Kịch bản 13: Tương thích bản lưu cũ (E.migrate)
{
  const oldSave = E.createLife({ mode: 'world', country: 'FR', seed: 218 });
  delete oldSave.flags.culture173;
  oldSave.pending.push({ id: 'world_festival173', manual: true, data: { at: oldSave.age } });
  const migrated = E.migrate(JSON.parse(JSON.stringify(oldSave)));
  ok(migrated && migrated.alive, 'Bản lưu cũ tải lại không lỗi');
  ok(!migrated.pending.some(d => d.id === 'world_festival173'), 'Sự kiện lễ cũ không hợp tuổi sơ sinh được bỏ an toàn khi migrate');
}

// 14. Quét tự động toàn bộ 195 quốc gia qua các độ tuổi tiêu biểu
for (let i = 0; i < W.C.length; i++) {
  const c = W.C[i];
  const l = makeWorldLife(c.code, 1000 + i);
  // Kiểm tra các độ tuổi 1, 8, 15, 17, 22
  for (const targetAge of [1, 8, 15, 17, 22]) {
    while (l.alive && l.age < targetAge) {
      E.beginYear(l);
      let guard = 0;
      while (l.alive && l.pending && l.pending.length && guard++ < 12) {
        E.resolve(l, E.autoKey(l));
      }
      if (l.alive) E.endYear(l);
    }
  }
  if (c.code !== 'VN') {
    const joinedLogs = (l.log || []).map(x => x.t).join('\n');
    const badMatch = joinedLogs.match(VN_ONLY_REGEX);
    ok(!badMatch, 'Quốc gia ' + c.code + ' (' + c.name + ') xuất hiện nội dung chỉ dành cho VN: ' + (badMatch && badMatch[0]));
  }
}

console.log('World culture 173: ' + checks + ' checks passed across 195 countries.');
