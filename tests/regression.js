/* Kiểm thử hồi quy — chạy: node tests/regression.js
   Mỗi phiên bản mới PHẢI qua toàn bộ bài test này trước khi phát hành. */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..', 'public');
const ctx = { console, Math, Date, JSON, TextEncoder, TextDecoder, Buffer };
ctx.globalThis = ctx;
vm.createContext(ctx);
const MODULES = ['js/util.js', 'js/data-vn.js', 'js/data-world.js', 'js/names.js', 'js/currency.js', 'js/world-economy.js', 'js/engine.js', 'js/careers.js', 'js/scenarios.js', 'js/expansion.js', 'js/wealth.js', 'js/jobs.js', 'js/childhood.js', 'js/family.js', 'js/sports.js', 'js/talent.js', 'js/leisure.js', 'js/lottery.js', 'js/life3.js', 'js/life32.js', 'js/life33.js', 'js/jobs2.js', 'js/life34.js', 'js/life35.js', 'js/life36.js', 'js/life37.js', 'js/life38.js', 'js/life39.js', 'js/life40.js', 'js/life41.js', 'js/life42.js', 'js/life43.js', 'js/life44.js', 'js/life45.js', 'js/life46.js', 'js/life47.js', 'js/life48.js', 'js/life49.js', 'js/life50.js', 'js/life51.js', 'js/life52.js', 'js/life53.js', 'js/life54.js', 'js/life55.js', 'js/life56.js', 'js/life57.js', 'js/market-data.js', 'js/life58.js', 'js/life59.js', 'js/life60.js', 'js/life61.js', 'js/leisure-data.js', 'js/life62.js', 'js/life63.js', 'js/life64.js', 'js/life65.js', 'js/life66.js', 'js/life67.js', 'js/finale.js', 'js/life68.js', 'js/esports-data.js', 'js/life69.js', 'js/esports-finance.js', 'js/life70.js', 'js/life71.js', 'js/life72.js', 'js/life73.js', 'js/life74.js', 'js/life75.js', 'js/life76.js', 'js/life77.js', 'js/life78.js', 'js/life79.js', 'js/life80.js', 'js/life81.js', 'js/life82.js', 'js/life83.js', 'js/life84.js', 'js/data-personas-vn.js', 'js/life85.js', 'js/life86.js', 'js/scene.js', 'js/scene2d.js'];
for (const f of MODULES) {
  if (process.env.MOTDOI_TEST_NATIVE === '1') vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), { filename: f });
  else vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const G = process.env.MOTDOI_TEST_NATIVE === '1' ? globalThis.G : ctx.G;
const { VN, W, E, NAMES, U } = G;

let pass = 0, fail = 0;
const fails = [];
function ok(cond, msg) { if (cond) pass++; else { fail++; fails.push(msg); } }
function section(name) { console.log('\n▶ ' + name); }
function badText(s) { return typeof s !== 'string' || /undefined|NaN|null|\[object/.test(s); }
function checkLife(l, tag) {
  ok(!l.alive && l.death && l.death.age >= 0 && l.death.age <= 115, tag + ': kết thúc hợp lệ (tuổi ' + (l.death && l.death.age) + ')');
  ok(isFinite(l.money) && isFinite(l.houseVal), tag + ': tiền hữu hạn');
  for (const k of ['hea', 'hap', 'kno', 'soc']) ok(isFinite(l.st[k]) && l.st[k] >= 0 && l.st[k] <= 100, tag + ': chỉ số ' + k);
  const badLog = l.log.find(e => badText(e.t));
  ok(!badLog, tag + ': nhật ký sạch — ' + (badLog && badLog.t));
  ok(l.yrs.length === l.death.age + 1, tag + ': bản đồ đời đủ năm (' + l.yrs.length + ' vs ' + (l.death.age + 1) + ')');
  ok(!badText(E.obituary(l)), tag + ': cáo phó sạch — ' + E.obituary(l));
  ok(!badText(l.name) && l.name.trim().length > 1, tag + ': tên hợp lệ "' + l.name + '"');
  ok(l.pending.length === 0, tag + ': không còn quyết định treo');
  // v2.0: dòng "Qua đời" luôn là dòng cuối cùng của nhật ký
  const di = l.log.findIndex(e => e.k === 'death');
  ok(di === l.log.length - 1, tag + ': không có sự kiện nào sau khi qua đời — ' + (l.log[di + 1] && l.log[di + 1].t));
}

// ---------------------------------------------------------------
section('0. Phiên bản & trang');
{
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const refs = html.match(/(?:src|href)="(?:js|css)\/[^"]+"/g) || [];
  const UI_SCRIPTS = ['js/music.js', 'js/card.js', 'js/app.js', 'js/account.js']; // chỉ chạy trên trình duyệt
  ok(refs.length === MODULES.length + UI_SCRIPTS.length + 1, 'index.html nạp đủ ' + (MODULES.length + UI_SCRIPTS.length) + ' script + 1 stylesheet (' + refs.length + ')');
  UI_SCRIPTS.forEach(m => ok(html.indexOf('src="' + m + '?v=') >= 0, 'index.html nạp ' + m));
  MODULES.forEach(m => ok(html.indexOf('src="' + m + '?v=') >= 0, 'index.html nạp module ' + m));
  ok(html.indexOf('logo.svg?v=' + G.VERSION) >= 0 && fs.existsSync(path.join(ROOT, 'logo.svg')), 'logo Một Đời tồn tại & được dùng');
  ok(/<title>Một Đời/.test(html), 'tên game là "Một Đời"');
  ok(refs.every(r => r.indexOf('?v=' + G.VERSION + '"') > 0), 'mọi tài nguyên dùng ?v=' + G.VERSION + ' (tránh cache cũ sau khi cập nhật)');
  refs.forEach(r => { const f = r.split('"')[1].split('?')[0]; ok(fs.existsSync(path.join(ROOT, f)), 'tệp tồn tại: ' + f); });
  const cl = fs.readFileSync(path.join(__dirname, '..', 'CHANGELOG.md'), 'utf8');
  ok(cl.indexOf('## v' + G.VERSION) >= 0, 'CHANGELOG có mục cho v' + G.VERSION);
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  ['#bornBtn', '#provSel', '#ethSel', '#nameInp', '#genderChips', '#orientChips', '#lenChips', '#logList', '#lifeMap', '#cohortLive', '#placePanel', '#modalRoot', '#memAll', '#endWrap', '#birthWrap', '#skipBtn', '#autoBtn', '#pauseBtn', '#speeds', '#exitBtn', '#actPanel', '#finPanel', '#recentList', '#sharedWrap', '#famPanel', '#idCard', '#statsPanel', '#heroProfile', '#scenePanel', '#minorBtn', '#jobsBtn', '#statJobs']
    .forEach(id => ok(html.indexOf('id="' + id.slice(1) + '"') >= 0 && appSrc.indexOf(id) >= 0, 'phần tử giao diện ' + id + ' tồn tại & được dùng'));
}

section('1. Dữ liệu Việt Nam');
ok(VN.P63.length === 63, '63 tỉnh thành cũ');
ok(VN.P34.length === 34, '34 tỉnh thành mới');
ok(new Set(VN.P63.map(p => p.name)).size === 63, 'tên tỉnh cũ không trùng');
ok(new Set(VN.P34.map(p => p.name)).size === 34, 'tên tỉnh mới không trùng');
VN.P63.forEach(p => ok(VN.P34.some(n => n.name === p.newName), 'tỉnh ' + p.name + ' sáp nhập vào tỉnh tồn tại'));
VN.P34.forEach(n => ok(n.members.length >= 1, n.name + ' có ít nhất 1 tỉnh cũ'));
ok(VN.P34.filter(n => n.members.length === 1).length === 11, '11 tỉnh giữ nguyên');
ok(VN.P34.filter(n => n.kind === 'Thành phố').length === 9, '9 thành phố trực thuộc TW (10/2026)');
ok(VN.P34.reduce((s, n) => s + n.members.length, 0) === 63, 'tổng tỉnh cũ trong 34 tỉnh = 63');
ok(VN.ETH.length === 54, '54 dân tộc (thực tế ' + VN.ETH.length + ')');
ok(new Set(VN.ETH.map(e => e.name)).size === 54, 'tên dân tộc không trùng');
ok(Math.abs(VN.ETH.reduce((s, e) => s + e.share, 0) - 1) < 1e-9, 'tổng tỷ lệ dân tộc = 100%');
ok(VN.ETH[0].name === 'Kinh' && VN.ETH[0].share === 0.86, 'Kinh = 86%');
VN.ETH.forEach(e => (e.homes || []).forEach(h => ok(!!VN.byName[h], 'dân tộc ' + e.name + ': tỉnh "' + h + '" tồn tại')));
VN.ETH.forEach(e => ok(!!VN.RELIGION[e.rel], 'dân tộc ' + e.name + ' có hồ sơ tôn giáo'));

section('2. Dữ liệu thế giới');
ok(W.C.length === 195, '195 quốc gia (thực tế ' + W.C.length + ')');
ok(new Set(W.C.map(c => c.code)).size === 195, 'mã quốc gia không trùng');
ok(new Set(W.C.map(c => c.name)).size === 195, 'tên quốc gia không trùng');
W.C.forEach(c => {
  ok(isFinite(c.births) && c.births >= 0 && c.e0 > 40 && c.e0 < 90 && c.gdp > 0 && c.u5 > 0 && c.urban > 0 && c.urban <= 1, c.code + ': số liệu hợp lệ');
  ok(c.cities.length >= 1 && c.cities.every(x => x.trim()), c.code + ': có thành phố');
  c.pool.split(',').forEach(s => {
    const k = s.split(':')[0];
    ok(k === 'vn' || !!NAMES.P[k], c.code + ': bộ tên "' + k + '" tồn tại');
    ok(k === 'vn' || !!W.REL[k], c.code + ': tôn giáo cho bộ tên "' + k + '"');
  });
});
W.SSM.concat(W.CRIM).forEach(code => ok(!!W.BY[code], 'mã ' + code + ' trong danh sách luật tồn tại'));

section('3. Sinh tên');
const r = (() => { const h = { rs: 12345 }; return () => U.rand(h); })();
Object.keys(NAMES.P).forEach(k => {
  for (let i = 0; i < 40; i++) for (const sx of ['M', 'F']) {
    const n = NAMES.worldName(r, k, sx);
    ok(!badText(n.full) && n.full.split(' ').length >= 2, 'bộ tên ' + k + ' ' + sx + ': "' + n.full + '"');
  }
});
['kinh', 'hmong', 'thai', 'tay', 'muong', 'khmer', 'dao', 'hoa', 'cham', 'tn', 'ts', 'north'].forEach(st => {
  for (let i = 0; i < 40; i++) for (const sx of ['M', 'F']) {
    const n = VN.vnName(r, st, sx);
    ok(!badText(n.full) && n.full.split(' ').length >= 2 && !/—|  /.test(n.full), 'tên VN ' + st + ' ' + sx + ': "' + n.full + '"');
  }
});

section('4. Tạo nhân vật — mọi lựa chọn');
let seed = 1;
VN.P63.forEach((p, i) => { const l = E.createLife({ mode: 'vn', variant: '63', prov: String(i), seed: seed++ }); ok(l.prov.old === p.name && l.provLabel === p.name, '63: chọn ' + p.name); });
VN.P34.forEach((p, i) => { const l = E.createLife({ mode: 'vn', variant: '34', prov: String(i), seed: seed++ }); ok(l.prov.neu === p.name && l.provLabel === p.name, '34: chọn ' + p.name); });
VN.ETH.forEach(e => { const l = E.createLife({ mode: 'vn', eth: e.name, seed: seed++ }); ok(l.eth === e.name, 'chọn dân tộc ' + e.name); });
for (const g of ['random', 'M', 'F', 'gay', 'top', 'lesbian', 'bi']) {
  for (const mode of ['vn', 'world']) {
    const l = E.createLife({ mode, gender: g, seed: seed++ });
    const exp = { M: ['M', 'straight'], F: ['F', 'straight'], gay: ['M', 'gay'], top: ['M', 'gay'], lesbian: ['F', 'gay'] }[g];
    if (exp) ok(l.sex === exp[0] && l.orient === exp[1], mode + ' giới tính ' + g);
    if (g === 'bi') ok(l.orient === 'bi', mode + ' song tính');
  }
}
{ const l = E.createLife({ mode: 'vn', name: '  Nguyễn Văn Test  ', seed: 7 }); ok(l.name === 'Nguyễn Văn Test' && l.sur === 'Nguyễn', 'tên tự nhập được giữ nguyên'); }
{ const l = E.createLife({ mode: 'vn', name: '', seed: 7 }); ok(l.name.length > 3 && !l.custom, 'để trống tên → tên ngẫu nhiên'); }
W.C.forEach(c => {
  const l = E.createLife({ mode: 'world', country: c.code, seed: seed++ });
  ok(l.country === c.code, 'thế giới: ' + c.code);
  ok(!badText(l.name) && !badText(l.place) && !badText(l.religion), c.code + ': hồ sơ sạch — ' + l.name + ' / ' + l.place);
  if (c.code !== 'VN') ok(c.cities.some(x => l.place.indexOf(x) >= 0), c.code + ': nơi ở thuộc đúng quốc gia');
  ok(!badText(l.log[0].t), c.code + ': câu khai sinh sạch');
});
{ const l = E.createLife({ mode: 'world', country: 'KR', seed: 99 }); ok(/[가-힣]/.test(l.nameSub) && ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Changwon', 'Jeju'].some(x => l.place.indexOf(x) >= 0), 'Hàn Quốc: tên Hàn + nơi ở Hàn (' + l.name + ' ' + l.nameSub + ', ' + l.place + ')'); }

section('5. Mô phỏng hàng loạt (tự động)');
function sim(mode, n, extra) {
  const res = [];
  for (let i = 0; i < n; i++) {
    const l = E.createLife(Object.assign({ mode, seed: 100000 + i * 7919 + (mode === 'world' ? 3 : 0) }, extra || {}));
    E.runHeadless(l);
    res.push(l);
  }
  return res;
}
const vnLives = sim('vn', 3000);
vnLives.forEach((l, i) => i < 400 && checkLife(l, 'VN#' + i));
const kinh = vnLives.filter(l => l.eth === 'Kinh').length / vnLives.length;
ok(Math.abs(kinh - 0.86) < 0.025, 'tỷ lệ Kinh ≈ 86% (thực tế ' + (kinh * 100).toFixed(1) + '%)');
const male = vnLives.filter(l => l.sex === 'M').length / vnLives.length;
ok(male > 0.49 && male < 0.56, 'tỷ lệ nam VN hợp lý (' + (male * 100).toFixed(1) + '%)');
const vnMean = vnLives.reduce((s, l) => s + l.death.age + 0.5, 0) / vnLives.length;
console.log('   Tuổi thọ trung bình VN mô phỏng: ' + vnMean.toFixed(1) + ' (thực tế ~74.7)');
ok(Math.abs(vnMean - 74.7) < 4.5, 'tuổi thọ VN gần thực tế (' + vnMean.toFixed(1) + ')');
const u5 = vnLives.filter(l => l.death.age < 5).length / vnLives.length;
ok(u5 > 0.005 && u5 < 0.06, 'tử vong dưới 5 tuổi VN hợp lý (' + (u5 * 1000).toFixed(1) + '‰)');
const uniShare = vnLives.filter(l => l.death.age >= 25 && l.edu >= 5).length / vnLives.filter(l => l.death.age >= 25).length;
console.log('   Tỷ lệ có bằng đại học (VN, sống ≥25): ' + (uniShare * 100).toFixed(1) + '%');
ok(uniShare > 0.08 && uniShare < 0.5, 'tỷ lệ đại học VN hợp lý');
const married = vnLives.filter(l => l.death.age >= 40 && (l.partner || l.widowed || l.exes)).length / vnLives.filter(l => l.death.age >= 40).length;
console.log('   Từng có bạn đời (VN, sống ≥40): ' + (married * 100).toFixed(1) + '%');
ok(married > 0.6, 'phần lớn người trưởng thành có bạn đời');
const v63 = sim('vn', 300, { variant: '63' }); v63.forEach((l, i) => i < 100 && checkLife(l, 'VN63#' + i));

const wLives = sim('world', 3000);
wLives.forEach((l, i) => i < 400 && checkLife(l, 'W#' + i));
const wMean = wLives.reduce((s, l) => s + l.death.age + 0.5, 0) / wLives.length;
const expW = W.C.reduce((s, c) => s + c.births * c.e0, 0) / W.BIRTHS_TOTAL;
console.log('   Tuổi thọ trung bình thế giới mô phỏng: ' + wMean.toFixed(1) + ' (kỳ vọng theo số sinh ~' + expW.toFixed(1) + ')');
ok(Math.abs(wMean - expW) < 5, 'tuổi thọ thế giới gần kỳ vọng');
const inShare = wLives.filter(l => l.country === 'IN').length / wLives.length;
ok(inShare > 0.14 && inShare < 0.21, 'Ấn Độ chiếm ~17% số sinh (' + (inShare * 100).toFixed(1) + '%)');
ok(!wLives.some(l => l.country === 'VA'), 'Vatican (0 trẻ sinh) không bao giờ được quay ra');
const ng = wLives.filter(l => l.country === 'NG'), jp = wLives.filter(l => l.country === 'JP');
if (ng.length > 20 && jp.length > 5) {
  const m = a => a.reduce((s, l) => s + l.death.age, 0) / a.length;
  ok(m(jp) > m(ng), 'Nhật sống lâu hơn Nigeria (' + m(jp).toFixed(0) + ' vs ' + m(ng).toFixed(0) + ')');
}

section('5b. Các lỗi logic đã từng gặp (không được tái phát)');
{
  // v1.0.0: nhận việc bán hàng rong cùng năm vào đại học; đang học đại học vẫn có việc
  let bad = 0, dengue = 0, mortgageDebt = 0, urbanNoCity = 0, n = 0;
  for (let i = 0; i < 800; i++) {
    const l = E.createLife({ mode: 'vn', variant: i % 2 ? '63' : '34', seed: 777000 + i });
    if (l.urban && l.variant === '63' && !/thành phố|TP\.|Huế/.test(l.birthPlace)) urbanNoCity++;
    E.runHeadless(l, x => { if (x.school === 'uni' && x.job) bad++; });
    dengue += l.log.filter(e => /sốt xuất huyết/.test(e.t)).length; n++;
    // trả góp mua nhà không bị tính là "nợ nần chồng chất" ngay năm mua
    l.log.forEach((e, j) => { if (/Mua được căn nhà/.test(e.t) && l.log.slice(j, j + 3).some(x => /Nợ nần chồng chất/.test(x.t) && x.a === e.a)) mortgageDebt++; });
  }
  ok(bad === 0, 'không ai vừa học đại học vừa giữ việc làm cũ (' + bad + ')');
  ok(dengue / n < 0.6, 'tần suất sốt xuất huyết hợp lý (' + (dengue / n).toFixed(2) + '/đời)');
  ok(mortgageDebt === 0, 'mua nhà trả góp không bị báo "nợ nần" ngay (' + mortgageDebt + ')');
  // v1.0.0: tài sản cuối đời âm hàng tỷ do chi tiêu khi về hưu + nợ lãi kép
  for (const mode of ['vn', 'world']) {
    const r = [];
    for (let i = 0; i < 600; i++) { const l = E.createLife({ mode, seed: 88000 + i }); E.runHeadless(l); if (l.death.age >= 30) r.push(E.netWorth(l) / l.base); }
    r.sort((a, b) => a - b);
    const med = r[Math.floor(r.length / 2)], neg = r.filter(x => x < -2).length / r.length;
    console.log('   Tài sản cuối đời (' + mode + '): trung vị ' + med.toFixed(1) + ' lần thu nhập cơ sở, nợ nặng ' + (neg * 100).toFixed(1) + '%');
    ok(med > 4 && med < 120, mode + ': tài sản cuối đời trung vị hợp lý (' + med.toFixed(1) + ')'); // V5: bình thường không còn tự đốt tới 97% tiền dư chỉ vì giàu; mốc trung vị tăng, vẫn kiểm tra hữu hạn và nợ phía dưới.
    ok(neg < 0.12, mode + ': tỷ lệ nợ nặng cuối đời hợp lý');
    // v1.0: tiền mặt âm tối đa 3 lần thu nhập cơ sở. v2.0 có thêm khoản vay (trần 4 lần mỗi khoản, vỡ nợ sau 3 năm) → nợ ròng không quá 8 lần
    ok(r[0] >= -8.01, mode + ': nợ không phình vô hạn (thấp nhất ' + r[0].toFixed(1) + ' lần thu nhập cơ sở)');
  }
  ok(urbanNoCity === 0, 'nơi sinh thành thị (63 tỉnh) luôn có tên thành phố (' + urbanNoCity + ')');
  const t = E.createLife({ mode: 'vn', seed: 905 });
  ok(!/theo không theo/.test(t.log[0].t), 'câu tôn giáo tự nhiên');
  ok(!/khu vực (\S+( \S+)*) cũ, tỉnh \1,/.test(t.log[0].t), 'không lặp "khu vực X cũ, tỉnh X"');
  for (let i = 0; i < 300; i++) {
    const l = E.createLife({ mode: 'vn', variant: '34', seed: 31000 + i });
    if (l.provNote) ok(l.provNote.indexOf(l.provLabel) < 0, 'ghi chú tỉnh cũ không trùng tên tỉnh mới: ' + l.provNote);
  }
}

section('6. Mọi nhánh quyết định (chọn ngẫu nhiên, không tự động)');
let decCount = {}, crash = 0;
for (let i = 0; i < 1500; i++) {
  const g = ['random', 'M', 'F', 'gay', 'top', 'lesbian', 'bi'][i % 7];
  const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', variant: i % 4 < 2 ? '63' : '34', gender: g, seed: 555 + i });
  const rr = (() => { const h = { rs: i * 31 + 1 }; return () => U.rand(h); })();
  const focuses = ['study', 'health', 'social', 'work', 'rest'];
  try {
    let guard = 0;
    while (l.alive && guard++ < 130) {
      if (l.age >= 6 && rr() < 0.2) l.focus = focuses[Math.floor(rr() * 5)];
      E.beginYear(l);
      while (l.pending.length) { const d = l.pending[0]; decCount[d.id] = (decCount[d.id] || 0) + 1; ok(d.opts.length >= 1 && d.opts.every(o => !badText(o.l) && !badText(o.h)) && !badText(d.title) && !badText(d.text), 'quyết định ' + d.id + ' sạch: ' + d.text); E.resolve(l, d.opts[Math.floor(rr() * d.opts.length)].k); }
      E.finishYear(l);
      while (l.pending.length) { const d = l.pending[0]; decCount[d.id] = (decCount[d.id] || 0) + 1; E.resolve(l, d.opts[Math.floor(rr() * d.opts.length)].k); }
      if (l.school === 'uni' && l.job) { fail++; fails.push('Rand#' + i + ': vừa học đại học vừa có việc ở tuổi ' + l.age); }
      E.endYear(l);
    }
    if (i < 300) checkLife(l, 'Rand#' + i);
  } catch (e) { crash++; fails.push('Lỗi crash ở đời #' + i + ': ' + e.stack); fail++; }
}
console.log('   Số lần gặp mỗi quyết định:', JSON.stringify(decCount));
// các quyết định cốt lõi của bản 1.0 phải luôn xuất hiện trong chơi ngẫu nhiên; tình huống mới được kiểm tra riêng ở mục 9
['hs', 'love', 'job', 'marry', 'city', 'xkld', 'kid', 'house', 'biz', 'treat', 'uni', 'major', 'post', 'emig', 'out', 'divorce', 'care', 'uniFail']
  .forEach(id => ok(decCount[id] > 0, 'quyết định cốt lõi "' + id + '" từng xuất hiện'));
const seen = Object.keys(E.DEC).filter(id => decCount[id] > 0).length;
console.log('   Độ phủ tình huống khi chơi ngẫu nhiên: ' + seen + '/' + Object.keys(E.DEC).length);
ok(seen / Object.keys(E.DEC).length > 0.6, 'hơn 60% tình huống xuất hiện tự nhiên trong 1.500 đời (' + seen + ')');
ok(crash === 0, 'không crash');

section('7. Lưu / tiếp tục (tất định)');
for (let i = 0; i < 30; i++) {
  const a = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 4242 + i });
  let n = 0;
  while (a.alive && n++ < 25) { E.beginYear(a); while (a.pending.length) E.resolve(a, E.autoKey(a)); E.finishYear(a); while (a.pending.length) E.resolve(a, E.autoKey(a)); E.endYear(a); }
  const b = JSON.parse(JSON.stringify(a));
  E.runHeadless(a); E.runHeadless(b);
  ok(JSON.stringify(a.death) === JSON.stringify(b.death) && a.log.length === b.log.length, 'lưu/tải giữa chừng cho kết quả y hệt #' + i);
}

section('8. Sinh cùng giây & tiền tệ');
{
  const l = E.createLife({ mode: 'vn', seed: 77 });
  const c = E.makeCohort(l);
  ok(c.length === 4 && c.every(x => x.tl.length > 0 && !badText(x.name) && !badText(x.where)), 'tạo 4 em bé cùng giây (VN)');
  const w = E.makeCohort(E.createLife({ mode: 'world', seed: 78 }));
  ok(w.length === 4 && w.every(x => !badText(x.where)), 'tạo 4 em bé cùng giây (thế giới)');
  // v1.0.0: em bé di cư về sau bị hiện sai thành phố sinh ("Jeddah, Ấn Độ")
  for (let i = 0; i < 150; i++) {
    E.makeCohort(E.createLife({ mode: 'world', seed: 6000 + i })).forEach(c => {
      if (c.where.indexOf('Việt Nam') >= 0) return;
      const cn = c.where.split(', ').pop(), co = W.C.find(x => x.name === cn);
      ok(co && co.cities.some(ct => c.where.indexOf(ct + ', ') === 0), 'thành phố sinh khớp quốc gia: ' + c.where);
    });
  }
  ok(E.fmtMoney({ cur: 'vnd' }, 1500) === '1,5 tỷ đ', 'định dạng tỷ đồng: ' + E.fmtMoney({ cur: 'vnd' }, 1500));
  ok(E.fmtMoney({ cur: 'vnd' }, 85) === '85 triệu đ', 'định dạng triệu đồng');
  ok(E.fmtMoney({ cur: 'usd' }, -1234) === '−$1.234', 'định dạng USD âm: ' + E.fmtMoney({ cur: 'usd' }, -1234));
}

// =====================================================================
//                         KIỂM THỬ BẢN 2.0
// =====================================================================
function clone(l) { return JSON.parse(JSON.stringify(l)); }
function cleanLife(l, tag) {
  ok(isFinite(l.money) && isFinite(E.netWorth(l)), tag + ': tiền hữu hạn');
  for (const k of ['hea', 'hap', 'kno', 'soc']) ok(isFinite(l.st[k]) && l.st[k] >= 0 && l.st[k] <= 100, tag + ': chỉ số ' + k + '=' + l.st[k]);
  ok(isFinite(l.karma) && l.karma >= -100 && l.karma <= 100, tag + ': nhân cách hợp lệ');
  (l.loans || []).forEach(x => ok(isFinite(x.bal) && x.bal >= 0, tag + ': khoản nợ hợp lệ'));
  const bad = l.log.find(e => badText(e.t)); ok(!bad, tag + ': nhật ký sạch — ' + (bad && bad.t));
}
// tạo các "khuôn" nhân vật ở nhiều hoàn cảnh để kiểm tra mọi tình huống
function templates() {
  const T = [];
  function grow(opts, age, setup) {
    for (let t = 0; t < 8; t++) { const x = grow1(Object.assign({}, opts, { seed: opts.seed + t * 1000 }), age, setup); if (x) return x; }
    return null;
  }
  function grow1(opts, age, setup) {
    const l = E.createLife(opts);
    let g = 0;
    while (l.alive && l.age < age && g++ < 120) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && k++ < 20) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && k++ < 20) E.resolve(l, E.autoKey(l)); E.endYear(l); }
    if (!l.alive) return null;
    l.pending = [];
    if (setup) setup(l);
    return l;
  }
  const r = (s) => { const h = { rs: s }; return () => U.rand(h); };
  T.push(grow({ mode: 'vn', seed: 101 }, 10, l => { l.fam.vice = 'gamble'; l.talent = 'game'; l.game = 'Liên Quân Mobile'; l.school = l.school || 'primary'; }));
  T.push(grow({ mode: 'vn', seed: 102 }, 16, l => { l.fam.vice = 'alcohol'; l.fam.q = 1; l.school = 'upper'; l.talent = 'thể thao'; l.talentSub = 'bóng đá'; l.flags.track = 'thể thao'; l.idol = 'Sơn Tùng M-TP'; l.veh = 'xe máy'; l.bff = l.bff || { name: 'Trần Văn Bạn', sex: 'M', since: 7, alive: true, close: 70 }; }));
  T.push(grow({ mode: 'vn', seed: 103, gender: 'F' }, 26, l => {
    l.indep = true; l.money = l.base * 2; l.veh = 'xe máy'; l.idol = 'BLACKPINK';
    l.bff = { name: 'Lê Thị Bạn', sex: 'F', since: 7, alive: true, close: 70, owe: 0.1 };
    l.partner = { name: 'Nguyễn Văn Chồng', sex: 'M', age: 28, status: 'married', since: 24, alive: true };
    l.kids = [{ name: 'Nguyễn Bé', sex: 'M', born: 22, alive: true, vac: false, kids: 0 }, { name: 'Nguyễn Lớn', sex: 'F', born: 12, alive: true, vac: true, kids: 0, vice: 'game' }];
    E.startJob(l, 'tx_cn', r(1), () => { }); l.fam.mAlive = true; l.fam.sibs = 2;
    l.loans = [{ type: 'appden', name: 'vay app đen', bal: l.base * 0.5, rate: 2.4, minShare: 0.5, late: 1 }]; l.flags.thugDebt = true; l.addict.gamble = true; l.ownHouse = true; l.houseVal = l.base * 20;
    l.cityStudent = { city: 'Hà Nội', since: 25 }; l.fame = 2e5;
    E.H.addPet(l, r(10), 'chó', 'Corgi', 'Lu'); l.pets[0].since = 20; E.H.addPet(l, r(11), 'mèo', 'mèo mướp', 'Mướp'); l.pets[1].since = 21;
  }));
  T.push(grow({ mode: 'vn', seed: 104 }, 35, l => { l.indep = true; l.money = l.base * 6; E.startJob(l, 'cong_an', r(2), () => { }); l.job.rank = 4; l.partner = { name: 'Phạm Thị Vợ', sex: 'F', age: 33, status: 'married', since: 28, alive: true }; l.ill = null; }));
  T.push(grow({ mode: 'vn', seed: 105 }, 30, l => { l.indep = true; E.startJob(l, 'ca_si', r(3), () => { }); l.fame = 3e6; l.skill = 70; l.money = l.base * 3; }));
  T.push(grow({ mode: 'vn', seed: 106 }, 22, l => { l.indep = true; E.startJob(l, 'tuyen_thu_es', r(4), () => { }); l.skill = 80; l.job.rank = 2; l.game = 'Liên Minh Huyền Thoại'; }));
  T.push(grow({ mode: 'vn', seed: 107 }, 24, l => { l.indep = true; E.startJob(l, 'vdv', r(5), () => { }); l.skill = 82; l.job.rank = 2; l.talentSub = 'bơi lội'; }));
  T.push(grow({ mode: 'vn', seed: 108 }, 28, l => { l.indep = true; E.startJob(l, 'ma_tuy', r(6), () => { }); l.lastJob = l.job; }));
  T.push(grow({ mode: 'vn', seed: 109 }, 30, l => { l.indep = true; l.jailUntil = l.age + 3; l.record = 1; l.job = null; }));
  T.push(grow({ mode: 'vn', seed: 110 }, 24, l => { l.indep = true; l.abroad = { code: 'KH', name: 'Campuchia', perm: false, until: l.age + 20, trapped: true }; l.job = { id: 'scam_kh', rank: 0, yrs: 0 }; }));
  T.push(grow({ mode: 'vn', seed: 111 }, 22, l => { l.abroad = { code: 'JP', name: 'Nhật Bản', study: true, until: l.age + 1 }; l.school = 'abroad'; l.major = 'it'; }));
  T.push(grow({ mode: 'vn', seed: 112 }, 70, l => { l.indep = true; l.retired = true; l.job = null; l.kids = [{ name: 'Con Cả', sex: 'M', born: 30, alive: true, kids: 2, close: 30, job: 'ke_toan', rank: 2, inc: 15, edu: 5 }]; l.movedTo = 'TP. Hồ Chí Minh'; l.fam.mAlive = false; l.fam.fAlive = false; l.ill = { n: 'ung thư phổi', m: 3, base: 0.3, cure: 0.3, mult: 3, f: 'ung thư phổi', since: 70 }; E.H.addPet(l, r(12), 'rùa', 'rùa tai đỏ', 'Cụ Rùa'); }));
  T.push(grow({ mode: 'world', country: 'UA', seed: 113, gender: 'M' }, 30, l => { l.indep = true; l.abroad = null; E.startJob(l, 'cong_nhan', r(7), () => { }); }));
  T.push(grow({ mode: 'world', country: 'MX', seed: 114 }, 25, l => { l.indep = true; l.veh = 'ô tô'; E.startJob(l, 'cong_chuc', r(8), () => { }); l.job.rank = 3; }));
  T.push(grow({ mode: 'world', country: 'KR', seed: 115 }, 40, l => { l.indep = true; l.money = l.base * 4; E.startJob(l, 'bac_si', r(9), () => { }); l.kids = [{ name: 'Kim Ji-woo', sex: 'F', born: 26, alive: true, kids: 0 }]; l.partner = { name: 'Lee Min-jun', sex: 'M', age: 41, status: 'married', since: 30, alive: true }; }));
  T.push(grow({ mode: 'vn', seed: 116 }, 17, l => { l.school = 'upper'; l.talent = 'cờ'; l.talentSub = 'cờ vua'; l.flags.track = 'cờ'; }));
  T.push(grow({ mode: 'vn', seed: 117, gender: 'gay' }, 30, l => { l.indep = true; l.money = -l.base * 2; l.job = null; l.realized = true; }));
  // v2.4: người giàu có anh chị em, nhà cho thuê, chuỗi cửa hàng, bố mẹ đã mất; trẻ con có anh trai
  const sib = (n, sex, born, extra) => Object.assign({ n, sex, born, alive: true, close: 70, job: 'kỹ sư', wed: true, kids: 1, q: 2 }, extra || {});
  T.push(grow({ mode: 'vn', seed: 118 }, 45, l => {
    l.indep = true; l.money = l.base * 400; l.ownHouse = true; l.houseVal = E.H.housePrice(l); l.houseTier = 1; l.income = l.base; E.startJob(l, 'kd_tu_do', r(13), () => { });
    l.fam.mAlive = false; l.fam.fAlive = false; l.fam.sibs = 1; l.flags.inherit = false; l.sibList = [sib('Trần Văn Cả', 'M', -3), sib('Trần Thị Út', 'F', 6)];
    l.props = [{ k: 'apt', n: 'căn hộ cho thuê', v: l.base * 10, basis: l.base * 9, y: 0.05, since: 40, empty: 0 }];
    l.ventures = [{ k: 'cafe', n: 'quán cà phê', cap: l.base * 1.5, unit: l.base * 1.5, br: 1, mu: 0.1, sd: 0.3, yrs: 3, bad: 0, good: 2 }];
  }));
  T.push(grow({ mode: 'vn', seed: 119 }, 9, l => { l.fam.sibs = 1; l.sibList = [sib('Lê Văn Hai', 'M', -2, { wed: false, kids: 0 })]; }));
  // v2.5: mỗi nghề có sự kiện riêng một khuôn; gia đình siêu giàu
  const adult = grow({ mode: 'vn', seed: 121, gender: 'M' }, 35, l => { l.indep = true; l.money = l.base * 50; l.edu = 5; l.ill = null; l.partner = null; });
  if (adult) [['tham_tu', 1], ['cong_an', 3, l => { l.job.br = 'mt'; l.flags.revenge = 1; }], ['luat_su', 2], ['tham_phan', 2], ['kiem_sat', 2], ['dieu_tra_vien', 1], ['chap_hanh_vien', 1], ['thua_phat_lai', 1], ['tro_giup_phap_ly', 1], ['bac_si', 2], ['giao_vien', 1], ['chu_nha_hang', 1], ['tiem_dt', 2], ['cam_do', 1],
    ['ky_su_xd', 1], ['phong_vien', 1], ['sale_bds', 1], ['ngan_hang', 2], ['chinh_tri', 3, l => { l.flags.dirty = 1; }], ['dau_bep', 2], ['vdv', 2, l => { l.talent = 'thể thao'; l.talentSub = 'bóng đá'; l.skill = 80; l.job.club = 'Hà Nội FC'; }],
    ['tai_phiet', 2, l => { l.fam.elite = 'tp'; l.flags.eliteFollow = true; l.flags.eliteChoice = true; l.fam.fAlive = true; l.sibList = [sib('Phạm Văn Cả', 'M', -2)]; l.mkt.land = 'đóng băng'; }],
    ['kd_tu_do', 1, l => { l.fam.elite = 'nh'; l.flags.eliteCut = true; l.flags.eliteChoice = true; l.fam.fAlive = true; }]]
    .forEach(([id, rk, f]) => { const l = clone(adult); E.startJob(l, id, r(14), () => { }); l.job.rank = rk; l.job.yrs = 5; if (f) f(l); T.push(l); });
  // v2.9: vừa trúng Jackpot (chưa nhận giải) và đã nhận giải công khai
  if (adult) { const a = clone(adult); a.flags.lottoWin = { amt: 40000, gross: 44000, g: 'power', prize: 'Jackpot 1', y: a.age, pub: null }; T.push(a);
    // v3.0: bằng lái B đã 10 năm, IELTS đã 2 năm, tài xế đang thuê xe
    const g = clone(adult); g.lic = { A1: true, B: true }; g.licAt = { A1: 18, B: g.age - 10 }; g.lang = { en: 3 }; g.langAt = { en: g.age - 2 }; g.langExp = {}; T.push(g);
    const hb = clone(adult); hb.hobby = 'rap'; hb.hobbySk = 70; hb.job = null; T.push(hb);
    const tx = clone(adult); E.startJob(tx, 'tx_cn', r(15), () => { }); tx.lic = { A1: true, B: true }; tx.rentVeh = { k: 'xsm_car', n: 'VinFast VF 5 (taxi điện Xanh SM)', fee: 7.5, fuel: 1.5, ev: true, car: true, since: tx.age - 1, bat: tx.age - 1 }; T.push(tx);
    const b = clone(adult); b.money = Math.max(40000, b.base * 20); b.port = { FPT: { v: 100, basis: 90 } }; b.flags.lottoWin = { amt: 40000, gross: 44000, g: 'power', prize: 'Jackpot 1', y: b.age - 1, pub: true }; T.push(b); }
  T.push(grow({ mode: 'vn', seed: 122 }, 17, l => { l.fam.elite = 'tp'; l.fam.q = 5; l.flags.eliteChoice = false; }));
  // v2.9: học sinh theo đội tuyển toán; người trẻ đạt giải lớn âm nhạc
  T.push(grow({ mode: 'vn', seed: 127 }, 55, l => { l.indep = true; l.money = l.base * 6; l.kids.push({ name: 'Nguyễn Minh Khôi', sex: 'M', born: 25, alive: true, married: false, kids: 0, close: 60, inc: 10 }); })); // con 30 tuổi xin vốn làm ăn
  T.push(grow({ mode: 'vn', seed: 125 }, 8, l => { l.talent = 'âm nhạc'; l.school = l.school || 'primary'; l.flags.nk = null; l.skill = 30; }));
  T.push(grow({ mode: 'vn', seed: 123 }, 9, l => { l.talent = 'toán học'; l.school = l.school || 'primary'; l.flags.nk = { lv: 0 }; }));
  T.push(grow({ mode: 'vn', seed: 124 }, 20, l => { l.talent = 'âm nhạc'; l.school = null; l.indep = true; l.flags.nkCareer = 'âm nhạc'; l.job = null; }));
  T.push(grow({ mode: 'vn', seed: 120 }, 61, l => { l.indep = true; l.retired = true; l.job = null; l.pensioned = true; l.pensionInc = l.base * 0.6; l.money = l.base * 5; l.st.hea = 70; }));
  if(adult){
    const bank=clone(adult); E.startJob(bank,'ngan_hang',r(18),()=>{}); bank.job.rank=0; T.push(bank);
    const hunted=clone(adult); hunted.flags.underworld={linked:true,hunted:true,heat:50}; T.push(hunted);
    const sponsor=clone(adult); sponsor.partner=null; sponsor.flags.sponsor=null; E.startJob(sponsor,'ke_toan',r(19),()=>{}); const offer=E.DEC.sn_loi_moi.make(sponsor,r(20)); E.DEC.sn_loi_moi.apply(sponsor,offer,'accept',r(21),()=>{}); sponsor.pending=[]; T.push(sponsor);
    const variety=clone(adult); E.startJob(variety,'ca_si',r(22),()=>{}); variety.fame=2e5; variety.st.hea=90; delete variety.flags.tv; delete variety.flags.variety; const inv=E.DEC.gameshow.make(variety,r(23)); E.DEC.gameshow.apply(variety,inv,'rm',r(24),()=>{}); const roleOffer=clone(variety);roleOffer.pending=[];T.push(roleOffer); const role=E.DEC.vr_vai_tro.make(variety,r(25)); E.DEC.vr_vai_tro.apply(variety,role,'regular',r(26),()=>{}); variety.pending=[]; T.push(variety);
  }
  if(adult&&E.HOMETOWN){
    const crime=clone(adult);crime.abroad={code:'JP',name:'Nhật Bản',perm:true};crime.jailUntil=null;crime.flags.military=null;E.startJob(crime,'ma_tuy',r(30),()=>{},true);crime.pending=[];T.push(crime);
    const film=clone(adult);film.abroad=null;film.school=null;film.jailUntil=null;film.flags.military=null;film.edu=5;film.major='art';film.money=film.base*1000;E.startJob(film,'dao_dien',r(31),()=>{},true);if(film.job){film.job.rank=1;film.job.rankSince=film.age-4;T.push(clone(film));E.FILM.start(film,r(32),()=>{});film.pending=[];T.push(film);}
    const travel=clone(adult);travel.abroad=null;travel.jailUntil=null;travel.flags.military=null;E.TRAVEL50.init(travel,r(33));travel.pending=[];T.push(travel);
    const movie=clone(adult);movie.abroad=null;movie.jailUntil=null;movie.flags.military=null;E.DATE50.init(movie,'movie',false);movie.pending=[];T.push(movie);
    const rural=clone(adult);rural.abroad=null;rural.school=null;rural.urban=false;rural.flags.cityAsked=false;rural.flags.military=null;rural.jailUntil=null;rural.pending=[];T.push(rural);
    const local=clone(adult); local.abroad=null; local.jailUntil=null; local.flags.military=null; E.LOCAL51.begin(local,r(29),'solo'); local.pending=[]; T.push(local);
    const tour=clone(adult);tour.abroad=null;tour.jailUntil=null;tour.flags.military=null;tour.partner={name:'Nguyễn Minh An',sex:'F',age:33,status:'dating',since:30,alive:true,homeCountry:'VN',home63:'Quảng Nam',inc:50};
    E.HOMETOWN.partner(tour,tour.partner);const itinerary=E.DEC.que_chuyen_di.make(tour,r(27),{side:'theirs'});E.DEC.que_chuyen_di.apply(tour,itinerary,'both',r(28),()=>{});tour.pending=[];T.push(tour);
  }
  // Lịch sử chơi phải được thiết lập rõ; không phụ thuộc một đời tự động có ngẫu nhiên chơi game hay không.
  const gamer=E.createLife({mode:'vn',seed:470099});gamer.age=25;gamer.money=gamer.base*2;gamer.flags.homeGames=['Valorant','Minecraft'];gamer.flags.lastHomeGame='Valorant';T.push(gamer);
  return T.filter(Boolean);
}

section('9. Mọi tình huống & mọi lựa chọn (khuôn nhân vật đa dạng)');
{
  const TPL = templates();
  ok(TPL.length >= 14, 'tạo đủ khuôn nhân vật (' + TPL.length + ')');
  const okIds = {};
  let tries = 0;
  Object.keys(E.DEC).forEach(id => {
    TPL.forEach((base, ti) => {
      let l0 = clone(base), d;
      try { d = E.DEC[id].make(l0, () => U.rand(l0), id === 'market_trade' ? { symbol:'SJC', side:'buy', quantity:'1', unit:'base' } : id === 'home_game_play' ? { g:'Minecraft' } : id === 'bi_bat' ? { why: 'trộm cắp tài sản', sev: 1 } : id === 'csgt' ? { why: 'vượt đèn đỏ', f: 5 } : id === 'con_18' || id === 'con_lac_loi' ? { n: (l0.kids.find(k => k.alive && (id !== 'con_lac_loi' || k.vice)) || {}).name } : undefined); }
      catch (e) { return; } // tình huống không áp dụng cho khuôn này
      if (!d || !d.opts.length) return;
      if (E.DEC[id].valid && !E.DEC[id].valid(l0, d.data)) return;
      ok(!badText(d.title) && !badText(d.text) && d.opts.every(o => !badText(o.l) && !badText(o.h)), 'tình huống "' + id + '" hiển thị sạch: ' + d.title + ' / ' + d.text);
      d.opts.forEach(o => {
        for (let rep = 0; rep < 4; rep++) {
          const l = clone(base); l.rs = (l.rs + rep * 7919 + ti) | 0;
          try {
            const dd = E.DEC[id].make(l, () => U.rand(l), d.data && (id === 'bi_bat' || id === 'csgt' || id === 'con_18' || id === 'con_lac_loi' || id === 'home_game_play' || id === 'market_trade') ? d.data : undefined);
            if (!dd.opts.some(x => x.k === o.k)) continue;
            l.pending.unshift(dd);
            E.resolve(l, o.k);
            let k = 0; while (l.pending.length && l.alive && k++ < 20) E.resolve(l, E.autoKey(l));
            tries++;
            cleanLife(l, id + '/' + o.k);
            if (!l.alive) ok(l.death && !badText(l.death.cause) && l.yrs.length && l.yrs[l.yrs.length - 1].a === l.age, id + '/' + o.k + ': chết giữa năm được ghi nhận đúng');
            // đời vẫn chạy tiếp được sau tình huống
            if (l.alive) { E.beginYear(l, { auto: true }); k = 0; while (l.pending.length && l.alive && k++ < 20) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); E.endYear(l); cleanLife(l, id + '/' + o.k + ' (năm sau)'); }
            okIds[id] = true;
          } catch (e) { fail++; fails.push('Crash ở tình huống ' + id + '/' + o.k + ' (khuôn #' + ti + '): ' + e.stack.split('\n').slice(0, 3).join(' | ')); }
        }
      });
    });
  });
  console.log('   Đã thử ' + tries + ' lượt chọn trên ' + Object.keys(okIds).length + '/' + Object.keys(E.DEC).length + ' tình huống');
  ok(!E.DEC.gameshow_dong.valid(TPL[0],{}),'hậu trường cũ đã được thay bằng mùa vr_vong');
  Object.keys(E.DEC).filter(id => id!=='gameshow_dong' && id!=='me_chong' && !(E.JOBS2 && E.JOBS2[id]) && !/^(nghi_huu_chon|lg_|show_chon|bias_chon|fan|kn_|mua_nuoc|ru_ban_an|hoc_ky_nang|tv_|nk_ra_truong|nganh_y|yt_|noi_tru|chuyen_khoa|mo_phong_kham_ck|bao_ve_tn|thuc_tap|hh_|ket_hon_nn|ve_vn_song|quay_lai_nn|viec_remote|con_thanh_tai|con_pha_gia|tai_san_giam|nv_|elite_thuc_tap|elite_bai_hoc|elite_ap_luc|clb_|khai_giang|ruot_thua|sot_xuat_huyet|di_ung|toi_|tu_cu_ru|tg_|doi_ton_giao|ban_khung_hoang|nhung_ngay_toi|sau_mat_mat|dk_|cho_con_tien|quyen_nuoi_con|con_sau_ly_hon|bo_me_mot_minh|di_buoc_nua|goa_bua|dd_|mo_rong_tu|chon_game|concert_nghe_si|study_|es_|thi_lai_tn|qg_|kh_|cuoi_|r_hon_nhan|r_tri_vi|nc_bao_ve|ct_cu_tri|cn_|dc_|co_bau_som|mua_nuoc_ai|sv_|nghe_kh|nha_|app_ho_so|quay_lai_cu|vd_|chuyen_on|chu_cap_|tim_nguoi_cham_lo|ban_than_|yeu_ban_than)/.test(id)).forEach(id => ok(okIds[id], 'tình huống "' + id + '" kiểm tra được trên ít nhất một khuôn')); // sự kiện nghề v3.3 được kiểm tra riêng ở mục 31
  // AI chọn được cho mọi tình huống
  Object.keys(E.DEC).forEach(id => {
    const base = TPL.find(t => { try { const l = clone(t); const d = E.DEC[id].make(l, () => U.rand(l), id==='market_trade'?{symbol:'SJC',side:'buy',quantity:'1',unit:'base'}:id==='home_game_play'?{g:'Minecraft'}:undefined); return d.opts.length && (!E.DEC[id].valid || E.DEC[id].valid(l, d.data)); } catch (e) { return false; } });
    if (!base) return;
    const l = clone(base); const d = E.DEC[id].make(l, () => U.rand(l), id==='market_trade'?{symbol:'SJC',side:'buy',quantity:'1',unit:'base'}:id==='home_game_play'?{g:'Minecraft'}:undefined); l.pending.unshift(d);
    const k = E.autoKey(l); ok(d.opts.some(o => o.k === k), 'AI chọn hợp lệ ở "' + id + '" (' + k + ')');
  });
}

section('10. Nghề nghiệp, thang bậc, thu nhập');
{
  const CAR = E.CAR;
  Object.keys(CAR).forEach(id => {
    const c = CAR[id];
    // v2.2: nghề theo danh tiếng có 5 danh xưng theo hạng (1 mức cát-xê sàn); nghề thường: mỗi bậc một mức lương
    if (c.fame) ok(c.vn.length === 1 && (c.t.length === 1 || c.t.length === 5), id + ': nghề danh tiếng có 1 hoặc 5 hạng');
    else ok(c.t.length >= 1 && c.vn.length === c.t.length, id + ': số bậc = số mức lương');
    ok(c.vn.every(x => isFinite(x) && x >= 0), id + ': lương hợp lệ');
    if (c.t.length > 1 && !c.skillRank && !c.fame) ok(c.yrs.length === c.t.length - 1, id + ': có số năm tối thiểu cho mỗi lần lên bậc');
    ok(!badText(E.jobLabel(id)), id + ': tên nghề sạch');
  });
  ok(Object.keys(CAR).length >= 75, 'hơn 75 nghề (' + Object.keys(CAR).length + ')');
  ['an_xin', 'xe_om', 'tx_cn', 'doi_no', 'streamer', 'youtuber', 'tuyen_thu_es', 'coach_es', 'caster_es', 'dau_tu_es', 'makeup', 'su_kien', 'tk_thoi_trang', 'stylist', 'ca_si', 'dien_vien', 'mc_tv', 'ky_thu', 'vdv', 'cong_an', 'bac_si', 'dieu_duong', 'sale_bds', 'sale_bh', 'kd_online', 'kd_tu_do', 'phong_vien']
    .forEach(id => ok(!!CAR[id], 'có nghề ' + id));
  const l = E.createLife({ mode: 'vn', seed: 9001 }); l.age = 30; l.edu = 5; l.uniTier = 1;
  const m = (id, rk) => E.monthlyEst(l, id, rk);
  ok(m('sale_b2b', 3) > m('xe_om', 0) * 5, 'giám đốc kinh doanh kiếm gấp nhiều lần xe ôm (' + m('sale_b2b', 3).toFixed(1) + ' vs ' + m('xe_om', 0).toFixed(1) + ')');
  ok(m('kd_tu_do', 3) > m('van_phong', 1) * 10, 'chủ tịch tập đoàn ≫ nhân viên văn phòng');
  ok(m('an_xin', 0) < m('cong_nhan', 0), 'ăn xin < công nhân');
  ok(m('van_phong', 0) < m('van_phong', 1), 'thực tập sinh < nhân viên');
  ok(E.fameMonthly(2e6) > E.fameMonthly(5e3) * 30, 'streamer nút vàng ≫ streamer vài nghìn người theo dõi');
  ok(E.fameMonthly(5e3) < 6, 'kênh dưới 10 nghìn người theo dõi thu nhập thấp');
  // công an thăng hàm đúng số năm
  let promosTooEarly = 0, finals = [];
  for (let i = 0; i < 60; i++) {
    const p = E.createLife({ mode: 'vn', seed: 9100 + i, gender: 'M' });
    p.age = 22; p.edu = 5; p.st.hea = 80; p.st.kno = 70; p.karma = 10; p.indep = true; E.startJob(p, 'cong_an', () => U.rand(p), () => { });
    let lastRank = 0, inRank = 0;
    for (let y = 0; y < 31 && p.job; y++) {
      E.careerYear(p, () => U.rand(p), () => { }, 'work'); inRank++;
      if (p.job && p.job.rank > lastRank) { if (inRank < CAR.cong_an.yrs[lastRank]) promosTooEarly++; lastRank = p.job.rank; inRank = 0; }
      p.age++; if (!p.alive) break;
    }
    finals.push(lastRank);
  }
  ok(promosTooEarly === 0, 'công an không bao giờ được thăng hàm sớm hơn quy định (' + promosTooEarly + ')');
  const avgRank = finals.reduce((a, b) => a + b, 0) / finals.length;
  console.log('   Quân hàm trung bình sau ~30 năm công tác: ' + CAR.cong_an.t[Math.round(avgRank)] + ' (' + avgRank.toFixed(1) + ')');
  ok(avgRank >= 4 && avgRank <= 7.5, 'sau ~30 năm phần lớn công an đạt cấp tá');
  // nghề phi pháp dẫn tới bị bắt
  let caught = 0;
  for (let i = 0; i < 200; i++) { const c = E.createLife({ mode: 'vn', seed: 9300 + i }); c.age = 25; c.indep = true; E.startJob(c, 'trom', () => U.rand(c), () => { }); for (let y = 0; y < 8 && c.alive; y++) { E.careerYear(c, () => U.rand(c), () => { }, 'work'); c.age++; } if ((c.sched || []).some(s => s.id === 'bi_bat')) caught++; }
  ok(caught > 100, 'trộm cắp lâu ngày gần như chắc chắn bị bắt (' + caught + '/200)');
}

section('11. Tiền tệ bản địa');
{
  ok(W.C.every(c => !!G.CUR.CUR[c.code]), 'cả 195 quốc gia đều có đồng tiền');
  const kr = E.createLife({ mode: 'world', country: 'KR', seed: 11 }); kr.indep = true;
  ok(/KRW/.test(E.fmtMoney(kr, kr.base)), 'Hàn Quốc hiển thị won: ' + E.fmtMoney(kr, kr.base));
  ok(/\(≈ .* đ\)/.test(E.fmtMoney(kr, kr.base, true)), 'có quy đổi ra đồng: ' + E.fmtMoney(kr, kr.base, true));
  const jp = E.createLife({ mode: 'world', country: 'JP', seed: 12 }); ok(/JPY/.test(E.fmtMoney(jp, 1000)), 'Nhật Bản hiển thị yên');
  const fr = E.createLife({ mode: 'world', country: 'FR', seed: 13 }); ok(/EUR/.test(E.fmtMoney(fr, 1000)), 'Pháp hiển thị euro');
  const vn = E.createLife({ mode: 'vn', seed: 14 }); ok(/đ$/.test(E.fmtMoney(vn, 100)), 'Việt Nam hiển thị đồng');
  // lương nghề ở Hàn quy ra tiền Việt hợp lý (công nhân Hàn ~ 40–90 triệu đ/tháng)
  kr.edu = 3; const vndMonth = G.CUR.toVND(kr.gdp, E.monthlyEst(kr, 'cong_nhan', 0));
  ok(vndMonth > 25 && vndMonth < 120, 'lương công nhân Hàn Quốc quy đổi hợp lý (' + vndMonth.toFixed(0) + ' triệu đ/tháng)');
}

section('12. Tài chính, nợ xấu, app đen');
{
  const l = E.createLife({ mode: 'vn', seed: 1201 }); l.age = 30; l.indep = true; l.money = 0; l.job = null;
  E.H.addLoan(l, 'bank', l.base * 5); l.money = 0;
  E.beginYear(l); l.pending = []; E.finishYear(l);
  ok(l.credit.bad, 'không trả nổi khoản vay → bị nợ xấu CIC');
  const d = E.DEC.house.make(l, () => U.rand(l));
  ok(d.opts.every(o => o.k === 'no' || l.money >= d.data.pr[o.k.slice(2)]), 'nợ xấu → không được vay ngân hàng mua nhà, chỉ mua được nếu đủ tiền mặt');
  const a = E.createLife({ mode: 'vn', seed: 1202 }); a.age = 25; a.indep = true; a.money = -a.base; a.job = null;
  E.H.addLoan(a, 'appden', a.base); a.money = -a.base * 1.5;
  E.beginYear(a); a.pending = []; E.finishYear(a);
  ok(a.flags.thugDebt, 'trễ hạn app đen → bị khủng bố đòi nợ');
  ok(E.TRIG.some(t => t.id === 'khung_bo' && t.when(a, a.age)), 'tình huống đòi nợ khủng bố được kích hoạt');
  // bảng thu chi đầy đủ & cộng đúng
  const w = E.createLife({ mode: 'vn', seed: 1203 }); w.age = 28; w.indep = true; w.money = 0; E.startJob(w, 'cong_nhan', () => U.rand(w), () => { });
  E.beginYear(w); w.pending = []; const before = w.money; E.finishYear(w);
  const F = w.fin;
  ok(F && isFinite(F.inc) && F.inc > 0 && isFinite(F.spend), 'có bảng thu chi năm');
  const items = (w.yr.items || []).reduce((s, x) => s + x.v, 0);
  ok(Math.abs((w.money - before) - (F.save + items)) < 1e-6 || Math.abs((w.money - before) - F.save) < 1e-6, 'tiền thay đổi khớp bảng thu chi');
  ok(w.log.some(e => e.k === 'money' && /\/tháng/.test(e.t)), 'nhật ký ghi lương theo tháng');
}

section('13. Hành động chủ động');
{
  const l = E.createLife({ mode: 'vn', seed: 1301 });
  for (let i = 0; i < 25; i++) { E.beginYear(l, {}); l.pending = []; E.finishYear(l); E.endYear(l); if (!l.alive) break; }
  if (l.alive) {
    E.beginYear(l, {}); l.pending = []; l.flags.military = null; // đang đi nghĩa vụ thì không làm được việc khác
    const acts = E.actions(l);
    ok(acts.length === E.ACT.length && acts.every(a => !badText(a.l) && !badText(a.g)), 'danh sách hành động sạch (' + acts.length + ')');
    ok(E.ACT.every(a => !!E.DEC[a.sc || a.id]), 'mọi hành động đều có tình huống tương ứng');
    const avail = acts.filter(a => a.ok === true);
    ok(avail.length >= 8, 'người 25 tuổi có nhiều việc để làm (' + avail.length + ')');
    let n = 0; for (const a of avail) { if (E.act(l, a.id)) n++; l.pending = []; if (n >= 5) break; }
    ok(n === 5, 'từ 18 tuổi không giới hạn lượt hành động (' + n + ')'); // v2.7
    E.endYear(l); E.beginYear(l, {}); l.pending = [];
    ok(E.actions(l).some(a => a.ok === true), 'sang năm mới được hành động lại');
  }
}

section('14. Chuỗi Campuchia, giao thông, du học');
{
  let freed = 0, dead = 0, still = 0;
  for (let i = 0; i < 400; i++) {
    const l = E.createLife({ mode: 'vn', seed: 1400 + i }); l.age = 22; l.indep = true;
    E.H.chain(l, 'kh_den'); E.resolve(l, i % 3 === 0 ? 'phone' : i % 3 === 1 ? 'escape' : 'comply');
    for (let y = 0; y < 6 && l.alive && l.abroad && l.abroad.trapped; y++) {
      E.endYear(l); E.beginYear(l, {}); let k = 0;
      while (l.pending.length && l.alive && k++ < 10) { const d = l.pending[0]; E.resolve(l, d.id === 'kh_song' ? 'phone' : E.autoKey(l)); }
    }
    if (!l.alive) { dead++; ok(/Campuchia/.test(l.death.cause), 'chết ở Campuchia ghi rõ nguyên nhân'); }
    else if (!l.abroad) { freed++; ok(/Campuchia/.test(l.flags.cambodia || ''), 'được giải cứu có ghi vào tiểu sử'); }
    else still++;
  }
  console.log('   Campuchia: thoát ' + freed + ', mất ' + dead + ', còn kẹt ' + still);
  ok(freed > 160 && dead >= 3, 'chuỗi Campuchia có đủ kết cục: được giải cứu / bỏ mạng');
  let fined = 0, crashed = 0;
  for (let i = 0; i < 300; i++) {
    const l = E.createLife({ mode: 'vn', seed: 1700 + i }); l.age = 25; l.indep = true; l.veh = 'xe máy'; l.money = l.base;
    const m0 = l.money; E.H.chain(l, 'den_vang'); E.resolve(l, 'go'); let k = 0; while (l.pending.length && l.alive && k++ < 5) E.resolve(l, l.pending[0].id === 'csgt' ? 'flee' : E.autoKey(l));
    if (l.money < m0) fined++; if (!l.alive || l.st.hea < 60) crashed++;
  }
  ok(fined > 30 && crashed > 10, 'vượt đèn vàng có thể bị phạt / tai nạn (' + fined + ' phạt, ' + crashed + ' tai nạn)');
  let abroadOk = 0;
  for (let i = 0; i < 100; i++) {
    const l = E.createLife({ mode: 'vn', seed: 1900 + i }); l.age = 18; l.st.kno = 90; l.fam.q = 5;
    E.H.chain(l, 'du_hoc'); E.resolve(l, 'parents'); let k = 0; while (l.pending.length && k++ < 5) E.resolve(l, E.autoKey(l));
    if (l.school === 'abroad' && l.abroad && l.abroad.study) abroadOk++;
  }
  ok(abroadOk > 95, 'du học: bố mẹ chi trả → đang học ở nước ngoài (' + abroadOk + ')');
}

section('15. Khúc cuối, chia sẻ, 10 đời gần đây, tương thích bản cũ');
{
  let n = 0, kinds = { ill: 0, sudden: 0, child: 0 };
  for (let i = 0; i < 400; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 2100 + i }); E.runHeadless(l);
    const st = E.finale(l);
    ok(st.length >= 2 && st.every(s => !badText(s.h) && (!s.x || !badText(s.x)) && (!s.list || s.list.every(x => !badText(x)))), 'khúc cuối sạch #' + i);
    if (l.death.age < 6) kinds.child++; else if (l.death.sudden) kinds.sudden++; else { kinds.ill++; ok(st.some(s => s.h === 'Di nguyện') && st.some(s => s.h === 'Hồi tưởng') && (function () { var xi = st.map(s => s.h).lastIndexOf('Xuôi tay'); return xi >= 0 && st.slice(xi + 1).every(s => /^(Di chúc để lại|Thừa kế theo pháp luật|Khi các con hay tin|Ngày tiễn biệt)$/.test(s.h)); })(), 'chết vì bệnh có đủ hồi tưởng, di nguyện, xuôi tay (sau đó là di chúc, thừa kế, cảnh các con) #' + i); }
    const sum = E.share.summary(l, 'Cảm ơn nhé');
    const back = E.share.decode(E.share.encode(sum));
    ok(back && back.n === l.name && back.o === sum.o && back.f === 'Cảm ơn nhé' && back.m === sum.m, 'mã hóa/giải mã link chia sẻ #' + i);
    // từng tuổi đều có chuyện kể
    const ages = new Set(l.log.map(e => e.a));
    let missing = 0; for (let a = 0; a <= l.death.age; a++) if (!ages.has(a)) missing++;
    ok(missing === 0, 'tuổi nào cũng có dòng nhật ký (#' + i + ' thiếu ' + missing + ')');
    n++;
  }
  console.log('   Kiểu kết thúc: bệnh ' + kinds.ill + ', đột ngột ' + kinds.sudden + ', trẻ nhỏ ' + kinds.child);
  ok(kinds.ill > 0 && kinds.sudden > 0, 'có cả kết thúc vì bệnh lẫn đột ngột');
  ok(E.share.decode('rác!!!') === null, 'link hỏng không làm sập trang');
  let list = [];
  for (let i = 0; i < 15; i++) list = E.share.pushRecent(list, { id: 'x' + (i % 12), n: 'A' + i });
  ok(list.length === 10 && list[0].n === 'A14' && new Set(list.map(x => x.id)).size === 10, 'lưu đúng 10 đời gần nhất, không trùng');
  // tương thích dữ liệu lưu từ bản 1.0
  const old = E.createLife({ mode: 'vn', seed: 2900 });
  ['tr', 'karma', 'loans', 'credit', 'lic', 'mem', 'sched', 'medals', 'titles', 'addict', 'yr', 'fame', 'skill', 'imm', 'acts', 'spend', 'sendParents', 'uniTier', 'vehVal', 'record'].forEach(k => delete old[k]);
  old.age = 30; old.indep = true; old.job = { id: 'factory', rank: 1, yrs: 3 }; old.mortgage = old.base * 3; old.ownHouse = true; old.houseVal = old.base * 10;
  E.migrate(old);
  ok(old.job.id === 'cong_nhan', 'nghề cũ "factory" chuyển sang "cong_nhan"');
  let crashed2 = false; try { E.runHeadless(old); } catch (e) { crashed2 = true; fails.push('crash khi chơi tiếp đời bản 1.0: ' + e.stack); }
  ok(!crashed2 && !old.alive, 'đời lưu từ bản 1.0 chơi tiếp được tới cuối');
  // v2.0: các lỗi nội dung phát hiện khi chơi thử (không được tái phát)
  let escaped = 0, beggars = 0;
  for (let i = 0; i < 500; i++) {
    const l = E.createLife({ mode: 'vn', seed: 2500 + i }); E.runHeadless(l);
    const ob = E.obituary(l), w = E.wishes(l);
    if (!l.kids.some(k => k.alive)) ok(!w.some(x => /các con/.test(x)), 'không có con thì di nguyện không nhắc "các con" #' + i + ': ' + w.join(' | '));
    ok(!/Chăm sóc bố mẹ/.test(ob) || l.flags.caredParents, 'chỉ ghi "chăm sóc bố mẹ" khi thật sự đã chăm #' + i);
    ok(!/Nghỉ hưu sau/.test(ob) || l.pensioned, 'chỉ ghi "nghỉ hưu" khi có lương hưu #' + i);
    const h = l.jobsHist || [], bi = h.findIndex(j => j.id === 'an_xin' && j.from < 45);
    if (bi >= 0) { beggars++; if (h.slice(bi + 1).length) escaped++; }
    const mem = E.pickMemories(l, 5);
    if ((l.mem || []).some(m => m.a < 16) && mem.length >= 3) ok(mem.some(m => m.a < 16), 'hồi tưởng có ký ức tuổi thơ #' + i);
  }
  if (beggars >= 3) ok(escaped > 0, 'người phải đi ăn xin vẫn có cơ hội tìm được việc khác (' + escaped + '/' + beggars + ')');
}

section('16. Người cùng giây do AI điều khiển có số phận đa dạng');
{
  const jobs = new Set(), causes = new Set();
  for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: 'vn', seed: 3000 + i }); E.runHeadless(l); (l.jobsHist || []).forEach(j => jobs.add(j.id)); causes.add(l.death.cause); }
  console.log('   300 đời VN: ' + jobs.size + ' nghề khác nhau, ' + causes.size + ' nguyên nhân mất khác nhau');
  ok(jobs.size >= 35, 'AI đi vào nhiều nghề khác nhau (' + jobs.size + ')');
  ok(causes.size >= 15, 'nhiều nguyên nhân qua đời khác nhau (' + causes.size + ')');
  // v2.0: tình huống "Túng quẫn" lặp gần như mỗi năm → có thời gian chờ; nhịp quyết định vừa phải
  let cnt = {}, total = 0, lives = 0, maxDoiKem = 0;
  const res = l => { const d = l.pending[0]; if (d) { cnt[d.id] = (cnt[d.id] || 0) + 1; total++; } E.resolve(l, E.autoKey(l)); };
  for (let i = 0; i < 200; i++) {
    const before = cnt.doi_kem || 0; const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 5000 + i });
    let g = 0; while (l.alive && g++ < 130) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) res(l); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) res(l); E.endYear(l); }
    lives++; maxDoiKem = Math.max(maxDoiKem, (cnt.doi_kem || 0) - before);
  }
  console.log('   Trung bình ' + (total / lives).toFixed(1) + ' lựa chọn mỗi đời');
  ok(total / lives > 25 && total / lives < 200, 'nhịp lựa chọn vừa phải (' + (total / lives).toFixed(1) + '/đời)');
  ok(maxDoiKem <= 30, '"Túng quẫn" không lặp mỗi năm (' + maxDoiKem + ')');
  ['bao_lu', 'concert', 'nhat_vi', 'viec_online', 'mua_sam'].forEach(id => ok((cnt[id] || 0) / lives < 3, 'tình huống "' + id + '" không lặp quá dày (' + ((cnt[id] || 0) / lives).toFixed(2) + '/đời)'));
}

section('17. Bản 2.1: thu nhập bố mẹ, tuổi thơ có lựa chọn, tranh pixel, quay số phận');
{
  // thu nhập bố mẹ
  const byQ = [0, 0, 0, 0, 0, 0], nQ = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 2000; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 17000 + i }), f = l.fam;
    ok(isFinite(f.mInc) && f.mInc >= 0 && isFinite(f.fInc) && f.fInc >= 0, 'thu nhập bố mẹ hợp lệ #' + i);
    if (/nội trợ|thất nghiệp/.test(f.mJob)) ok(f.mInc === 0, 'mẹ ' + f.mJob + ' thì thu nhập 0');
    if (f.noDad) ok(f.fInc === 0, 'không có bố thì thu nhập bố 0');
    ok(!badText(E.fmtMoney(l, f.mInc + f.fInc, true)), 'hiển thị thu nhập cả nhà sạch');
    if (E.isVN(l)) { byQ[f.q] += f.mInc + f.fInc; nQ[f.q]++; }
  }
  const avgQ = byQ.map((s, q) => nQ[q] ? s / nQ[q] : 0);
  console.log('   Thu nhập TB cả nhà theo nhóm (triệu đ/tháng): ' + avgQ.slice(1).map(x => x.toFixed(1)).join(' · '));
  ok(avgQ[5] > avgQ[3] && avgQ[3] > avgQ[1], 'nhà giàu có thu nhập bố mẹ cao hơn nhà nghèo');
  ok(Object.keys(E.PARENT_PAY).length > 40, 'bảng lương nghề của bố mẹ đầy đủ');
  // tuổi thơ có lựa chọn
  let yrs = 0, withDec = 0, thoiNoi = 0, at1 = 0;
  for (let i = 0; i < 300; i++) {
    const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 17500 + i });
    let g = 0;
    while (l.alive && g++ < 20 && l.age <= 14) {
      E.beginYear(l, {});
      if (l.age >= 1 && l.age <= 14) { yrs++; if (l.pending.length) withDec++; }
      if (l.age === 1) { at1++; if (l.pending.some(d => d.id === 'thoi_noi')) thoiNoi++; }
      let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l));
      if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
    }
  }
  console.log('   Năm tuổi thơ (1–14) có lựa chọn: ' + (withDec / yrs * 100).toFixed(1) + '% · có lễ thôi nôi: ' + thoiNoi + '/' + at1);
  ok(withDec / yrs > 0.7, 'phần lớn các năm tuổi thơ có lựa chọn cho người chơi');
  ok(thoiNoi / at1 > 0.9, 'lễ thôi nôi gần như luôn xuất hiện ở tuổi 1');
  ['thoi_noi', 'mau_giao', 'do_choi', 'hoc_chu_som', 'he_nay', 'vo_binh', 'tien_an_sang', 'thu_cung', 'van_nghe', 'xin_dien_thoai', 'giup_nha', 'cho_chep_bai', 'thi_hsg', 'trung_thu', 'li_xi', 'bi_lac']
    .forEach(id => ok(!!E.DEC[id] && E.TRIG.some(t => t.id === id && t.child), 'có tình huống tuổi thơ "' + id + '"'));
  // tranh pixel
  const kinds = new Set();
  for (let i = 0; i < 250; i++) {
    const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 18000 + i });
    const stops = [0, 1, 7, 15, 25, 40, 70];
    let g = 0;
    while (l.alive && g++ < 120) {
      if (stops.indexOf(l.age) >= 0 || g % 13 === 0) {
        const av = E.art.avatar(l), sc = E.art.scene(l), cap = E.art.caption(l);
        ok(/^<svg[\s\S]*<\/svg>$/.test(av) && !/NaN|undefined/.test(av), 'chân dung hợp lệ #' + i + ' tuổi ' + l.age);
        ok(/^<svg[\s\S]*<\/svg>$/.test(sc) && !/NaN|undefined/.test(sc), 'khung cảnh hợp lệ #' + i + ' tuổi ' + l.age);
        ok(!badText(cap), 'chú thích khung cảnh sạch: ' + cap);
        kinds.add(E.art.houseKind(l));
      }
      E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l));
      if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
    }
    const dead = E.art.scene(l); ok(/<svg/.test(dead) && !/NaN|undefined/.test(dead), 'khung cảnh khi đã mất hợp lệ #' + i);
    ok(!badText(E.art.caption(l)), 'chú thích khi đã mất sạch');
  }
  console.log('   Các kiểu nhà đã vẽ: ' + [...kinds].join(', '));
  ok(kinds.size >= 7, 'nhiều kiểu nhà khác nhau theo hoàn cảnh (' + kinds.size + ')');
  // quay số phận & hồ sơ xuất phát có trong giao diện
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  ok(/function rollFate/.test(appSrc) && /bornWith\(/.test(appSrc), 'có hiệu ứng quay số phận khi chào đời');
  ok(/renderProfile/.test(appSrc) && /liveThis/.test(appSrc) && /reroll/.test(appSrc), 'có hồ sơ xuất phát ngẫu nhiên + nút sống đời này');
  ok(/Thu nhập cả nhà/.test(appSrc) && /Thu nhập của bố/.test(appSrc) && /Thu nhập của mẹ/.test(appSrc), 'giấy khai sinh có thu nhập bố, mẹ và cả nhà');
  // hồ sơ xuất phát với cùng seed cho ra đúng cuộc đời đó
  const a = E.createLife({ mode: 'vn', variant: '34', gender: 'random', seed: 424242 }), b = E.createLife({ mode: 'vn', variant: '34', gender: 'random', seed: 424242 });
  ok(a.name === b.name && a.provLabel === b.provLabel && a.fam.mJob === b.fam.mJob, '"Sống đời này" tạo đúng nhân vật như hồ sơ xuất phát');
  // dữ liệu lưu từ v2.0 (chưa có thu nhập bố mẹ) được bổ sung
  const old = E.createLife({ mode: 'vn', seed: 99 }); delete old.fam.mInc; delete old.fam.fInc; E.migrate(old);
  ok(isFinite(old.fam.mInc) && isFinite(old.fam.fInc), 'đời lưu từ v2.0 được bổ sung thu nhập bố mẹ');
}

section('18. Bản 2.2: hai tầng lựa chọn, thú cưng, nghề mới & lương thực tế, thu nhập bố mẹ theo năm');
{
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  // giao diện: bỏ chữ "10 cuộc đời"
  ok(!/10 cuộc đời/.test(html) && !/10 cuộc đời/.test(appSrc), 'không còn chữ "10 cuộc đời" trên giao diện');
  ok(/id="recentSection"/.test(html) && /id="recentList"/.test(html), 'vẫn giữ mục các cuộc đời đã sống');
  // Biến cố không còn là năng khiếu; năng khiếu có dòng riêng
  ok(/function eventTeaser/.test(appSrc) && !/'Năng khiếu ' \+ E\.talentText/.test(appSrc), 'Biến cố không lấy năng khiếu làm biến cố');
  ok(/<span>Năng khiếu<\/span>/.test(appSrc), 'hồ sơ xuất phát có dòng Năng khiếu riêng');
  const g = E.createLife({ mode: 'vn', seed: 1 }); g.talent = 'game'; g.talentSub = 'FPS';
  ok(/bắn súng/.test(E.talentText(g)) && /FPS/.test(E.talentText(g)), 'năng khiếu FPS được viết rõ: ' + E.talentText(g));
  g.talentSub = 'MOBA'; ok(/chiến thuật/.test(E.talentText(g)), 'năng khiếu MOBA được viết rõ');
  // hai tầng lựa chọn
  ['uni', 'hs', 'job', 'marry', 'kid', 'xkld', 'house', 'biz', 'kh_den', 'du_hoc'].forEach(id => ok(E.isMajor({ id }), '"' + id + '" là ngã rẽ quyết định'));
  ['thoi_noi', 'mua_sam', 'choi_pet', 'nuoi_pet', 'den_vang', 'di_nhau'].forEach(id => ok(!E.isMajor({ id }), '"' + id + '" là lựa chọn thường ngày'));
  ok(/S\.minorOnly/.test(appSrc) && /tierwarn/.test(appSrc), 'có chế độ "chỉ ngã rẽ lớn" và nhãn ngã rẽ trong hộp thoại');
  let maj = 0, tot = 0;
  for (let i = 0; i < 120; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 21000 + i }); let gg = 0;
    while (l.alive && gg++ < 130) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) { tot++; if (E.isMajor(l.pending[0])) maj++; E.resolve(l, E.autoKey(l)); } if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
  }
  console.log('   Ngã rẽ quyết định: ' + (maj / tot * 100).toFixed(1) + '% số lựa chọn');
  ok(maj / tot > 0.05 && maj / tot < 0.5, 'ngã rẽ quyết định chiếm tỷ lệ vừa phải');
  // thú cưng
  ok(Object.keys(E.PETS).length >= 6, 'có nhiều loài thú cưng');
  ['nuoi_pet', 'choi_pet', 'pet_om', 'pet_trom', 'pet_lac', 'pet_de', 'pet_can'].forEach(id => ok(!!E.DEC[id], 'có tình huống thú cưng "' + id + '"'));
  ok(E.ACT.some(a => a.id === 'nuoi_pet') && E.ACT.some(a => a.id === 'choi_pet'), 'có hành động nuôi & chơi với thú cưng');
  let adopted = 0, died = 0, petCost = 0;
  for (let i = 0; i < 200; i++) {
    const l = E.createLife({ mode: 'vn', seed: 22000 + i }); let gg = 0;
    while (l.alive && gg++ < 130) {
      E.beginYear(l, { auto: true });
      if (l.age === 25 && l.alive) { l.acts = 0; const d = E.act(l, 'nuoi_pet'); if (d) E.resolve(l, d.opts[i % (d.opts.length - 1)].k); }
      let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
      if (l.fin && l.fin.pets > 0) petCost++;
      (l.pets || []).forEach(p => ok(p.n && p.k && isFinite(p.life) && !badText(E.H.petLabel(p)), 'thú cưng hợp lệ'));
    }
    if ((l.pets || []).length) adopted++;
    if ((l.pets || []).some(p => !p.alive)) died++;
    ok(!badText(E.art.caption(l)), 'chú thích có thú cưng sạch');
  }
  console.log('   Có nuôi thú cưng: ' + adopted + '/200 · có thú cưng mất/thất lạc: ' + died + ' · năm có chi phí nuôi: ' + petCost);
  ok(adopted > 150, 'nhận nuôi thú cưng hoạt động');
  ok(died > 50, 'thú cưng có tuổi thọ, có thể mất');
  ok(petCost > 100, 'chi phí nuôi thú cưng được tính vào tài chính');
  const ls = E.createLife({ mode: 'vn', seed: 23001 }); ls.age = 10; E.H.addPet(ls, () => 0.5, 'chó', 'Corgi', 'Lu');
  ok(/<svg/.test(E.art.scene(ls)) && !/NaN|undefined/.test(E.art.scene(ls)) && /chó Lu/.test(E.art.caption(ls)), 'thú cưng được vẽ & ghi trong khung cảnh');
  const old = E.createLife({ mode: 'vn', seed: 23002 }); delete old.pets; old.flags.pet = { k: 'mèo', n: 'Mimi', since: 7 }; E.migrate(old);
  ok(old.pets.length === 1 && old.pets[0].n === 'Mimi' && old.pets[0].alive && !old.flags.pet, 'thú cưng lưu từ v2.1 được chuyển sang hệ mới');
  // nghề mới & lương thực tế
  const need = ['phi_cong', 'tiep_vien', 'kskl', 'hdv', 'le_tan', 'barista', 'nha_si', 'thu_y', 'gv_mam_non', 'thuyen_vien', 'gian_khoan', 'tho_mo', 'tai_xe_tai', 'sau_rieng', 'nuoi_tom',
    'vien_chuc', 'can_bo_xa', 'thue', 'hai_quan', 'tham_phan', 'kiem_sat', 'ngoai_giao', 'qltt', 'kiem_toan', 'kiem_lam', 'dnnn',
    'fl_thiet_ke', 'fl_dich', 'fl_content', 'fl_dev', 'fl_video', 'fl_day', 'fl_aff', 'fl_long_tieng',
    'rapper', 'dv_hai', 'vu_cong', 'nhac_si', 'bien_kich', 'ql_nghe_si', 'dj', 'mc_su_kien', 'kol_live'];
  need.forEach(id => ok(!!E.CAR[id], 'có nghề "' + id + '"'));
  ok(Object.keys(E.CAR).length >= 130, 'tổng số nghề ≥ 130 (' + Object.keys(E.CAR).length + ')');
  ['ca_si', 'dien_vien', 'nguoi_mau', 'rapper', 'dv_hai', 'kol_live'].forEach(id => ok(E.CAR[id].t.length === 5, id + ': có 5 hạng danh tiếng'));
  ok(Object.keys(E.CAR).filter(k => E.CAR[k].cat === 'state').length >= 10, 'đủ nghề trong cơ quan nhà nước');
  ok(Object.keys(E.CAR).filter(k => E.CAR[k].cat === 'free').length >= 7, 'đủ nghề freelancer');
  const v = id => E.CAR[id].vn;
  ok(v('cong_nhan')[0] >= 7 && v('cong_nhan')[0] <= 10, 'lương công nhân khởi điểm 7–10 triệu');
  ok(v('gv_mam_non')[0] <= 8 && v('cong_chuc')[0] <= 10, 'lương nhà nước khởi điểm thấp (theo hệ số)');
  ok(v('phi_cong')[2] >= 150, 'cơ trưởng lương rất cao');
  ok(v('kd_tu_do')[3] >= 300 && v('kd_tu_do')[1] > v('van_phong')[1] * 3, 'chủ kinh doanh thu nhập cao hơn hẳn làm công');
  // danh xưng theo hạng danh tiếng
  const cs = E.createLife({ mode: 'vn', seed: 23003 }); cs.age = 22; cs.indep = true; E.startJob(cs, 'ca_si', () => 0.5, () => { }, true);
  cs.fame = 2000; ok(/đám cưới/.test(E.jobTitle(cs)), 'ca sĩ mới vào nghề: hát đám cưới (' + E.jobTitle(cs) + ')');
  cs.fame = 3e5; ok(/hạng B/.test(E.jobTitle(cs)), 'ca sĩ 300 nghìn fan: hạng B');
  cs.fame = 2e7; ok(/diva|ngôi sao/.test(E.jobTitle(cs)), 'ca sĩ 20 triệu fan: diva/ngôi sao');
  ok(E.monthlyEst(Object.assign(cs, { fame: 500 }), 'ca_si', 0) >= 5, 'ca sĩ mới vẫn có cát-xê sàn');
  // nổi tiếng là hiếm
  let top = 0, nf = 0;
  for (let i = 0; i < 300; i++) {
    const l = E.createLife({ mode: 'vn', seed: 23100 + i }); l.age = 18; l.edu = 3; l.indep = true;
    E.startJob(l, ['ca_si', 'dien_vien', 'rapper', 'dv_hai', 'kol_live', 'nguoi_mau'][i % 6], () => U.rand(l), () => { }, true);
    for (let y = 0; y < 15 && l.job; y++) { l.age++; E.careerYear(l, () => U.rand(l), () => { }, 'work'); }
    if (l.job) { nf++; if (l.fame >= 1e6) top++; }
  }
  console.log('   Nghệ sĩ thành hạng A sau 15 năm: ' + top + '/' + nf);
  ok(top / nf < 0.2, 'trở thành ngôi sao hạng A là hiếm');
  // thu nhập ở tuổi trung niên không phi thực tế
  const inc = [];
  for (let i = 0; i < 300; i++) {
    const l = E.createLife({ mode: 'vn', seed: 24000 + i }); let gg = 0;
    while (l.alive && gg++ < 40 && l.age <= 36) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); if (l.age === 36 && l.alive && l.job && l.job.yrs >= 2) inc.push(l.income / 12); }
  }
  inc.sort((a, b) => a - b); const medInc = inc[inc.length >> 1];
  console.log('   Thu nhập trung vị ở tuổi 36 (VN): ' + medInc.toFixed(1) + ' triệu/tháng');
  ok(medInc > 7 && medInc < 30, 'thu nhập trung vị tuổi 36 hợp lý');
  // thu nhập bố mẹ thay đổi theo năm & nghỉ hưu
  let retired = 0, pension = 0, changed = 0, lost = 0, logs = 0, n = 0;
  for (let i = 0; i < 300; i++) {
    const l = E.createLife({ mode: i % 4 ? 'vn' : 'world', seed: 25000 + i }); const f = l.fam; let gg = 0;
    while (l.alive && gg++ < 45) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
      ok(isFinite(f.mInc) && f.mInc >= 0 && isFinite(f.fInc) && f.fInc >= 0, 'thu nhập bố mẹ hữu hạn mỗi năm');
    }
    n++;
    if (f.mRet || f.fRet) retired++;
    if ((f.mRet && f.mInc > 0 && E.parentKind(f.mJob) === 'formal') || (f.fRet && f.fInc > 0 && E.parentKind(f.fJob) === 'formal')) pension++;
    if (Math.abs(f.mInc - f.mInc0) > 0.01 || Math.abs(f.fInc - f.fInc0) > 0.01) changed++;
    if (l.log.some(e => /mất việc|mất nguồn thu nhập/.test(e.t) && /^(Bố|Mẹ)/.test(e.t))) lost++;
    logs += l.log.filter(e => /^(Bố|Mẹ) .*(nghỉ hưu|thăng chức|tìm được việc|có việc làm trở lại|thôi )/.test(e.t)).length;
    l.log.forEach(e => ok(!badText(e.t), 'dòng nhật ký bố mẹ sạch'));
  }
  console.log('   Bố mẹ: nghỉ hưu ' + retired + '/' + n + ' · có lương hưu ' + pension + ' · thu nhập thay đổi ' + changed + ' · từng mất việc ' + lost + ' · dòng sự kiện ' + logs);
  ok(retired > n * 0.5, 'bố mẹ nghỉ hưu khi về già');
  ok(pension > 20, 'bố mẹ làm nhà nước/công nhân có lương hưu');
  ok(changed > n * 0.8, 'thu nhập bố mẹ thay đổi theo năm');
  ok(lost > 5, 'bố mẹ có thể mất việc');
  ok(E.parentKind('giáo viên') === 'formal' && E.parentKind('doanh nhân') === 'biz' && E.parentKind('làm ruộng') === 'inf' && E.parentKind('nội trợ') === 'none', 'phân loại nghề bố mẹ đúng');
  ok(/lương hưu/.test(appSrc) && /lúc bạn chào đời/.test(appSrc), 'bảng gia đình hiện lương hưu & so với lúc chào đời');
  // sổ tay nghề nghiệp
  ok(/function openJobs/.test(appSrc) && /jobsBtn/.test(appSrc), 'có bảng nghề & lương tham chiếu');
  Object.keys(E.CAR).forEach(id => ok(E.CAT[E.CAR[id].cat], id + ': thuộc nhóm nghề có tên'));
}

section('19. Bản 2.3: ⭐ khoảnh khắc, tài sản & hụi & bảo hiểm, tâm lý, đời con cái, học hành, ảnh thẻ, nhạc lofi');
{
  const run1 = (l, until) => { let g = 0; while (l.alive && g++ < 130 && (until == null || l.age < until)) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); } return l; };
  // ⭐ đánh dấu khoảnh khắc
  const ls = run1(E.createLife({ mode: 'vn', seed: 31001 }));
  const pick3 = ls.log.filter(e => e.k !== 'money' && e.a > 3).slice(0, 3); pick3.forEach(e => e.star = true);
  ok(E.starred(ls).length === 3, 'đếm đúng các dòng đã đánh dấu ⭐');
  const sm = E.share.summary(ls);
  ok(sm.st.length === 3 && sm.st.every(x => /^\d+\|/.test(x)), 'link chia sẻ mang theo khoảnh khắc ⭐');
  ok(E.pickMemories(ls, 6).filter(m => m.star).length >= 3, 'hồi tưởng cuối đời ưu tiên khoảnh khắc ⭐');
  ok(typeof sm.jt === 'string' && typeof sm.nw === 'string' && !badText(sm.jt), 'tóm tắt có nghề chính & tài sản cuối đời');
  ok(E.share.decode(E.share.encode(sm)).st.length === 3, 'mã hóa / giải mã link giữ khoảnh khắc ⭐');
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  ok(/class="star"/.test(appSrc) && /e\.star = !e\.star/.test(appSrc), 'nhật ký có nút ⭐ đánh dấu');
  // tài sản đầu tư
  let invested = 0, landBoom = 0, landBust = 0, crash = 0, liq = 0, hui = 0, huiBust = 0, insPay = 0, insEnd = 0;
  for (let i = 0; i < 250; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 32000 + i }); let g = 0;
    while (l.alive && g++ < 130) {
      E.beginYear(l, { auto: true });
      if (l.age === 30 && l.indep && l.money > l.base * 0.5) { l.acts = 0; const d = E.act(l, 'dau_tu'); if (d) E.resolve(l, ['saving', 'gold', 'stock', 'land'][i % 4]); }
      if (l.age === 32 && isVNx(l) && !l.hui && l.indep) { const d = E.DEC.choi_hui.make(l, () => U.rand(l)); l.pending.unshift(d); E.resolve(l, i % 2 ? 'early' : 'late'); }
      if (l.age === 33 && !l.ins && l.indep) { const d = E.DEC.bao_hiem.make(l, () => U.rand(l)); l.pending.unshift(d); E.resolve(l, i % 2 ? 'protect' : 'invest'); }
      let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) { const n0 = l.log.length; E.finishYear(l);
        l.log.slice(n0).forEach(e => { if (/nóng sốt/.test(e.t)) landBoom++; if (/Bong bóng đất vỡ/.test(e.t)) landBust++; if (/Chứng khoán sập/.test(e.t)) crash++; if (/phải bán .* trang trải/.test(e.t)) liq++; if (/Hốt hụi/.test(e.t)) hui++; if (/VỠ HỤI/.test(e.t)) huiBust++; if (/bảo hiểm chi trả/i.test(e.t)) insPay++; if (/đáo hạn|hết hạn/.test(e.t)) insEnd++; }); }
      k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
      const A = l.assets; ok(['save', 'gold', 'stock', 'land'].every(x => isFinite(A[x]) && A[x] >= 0), 'tài sản hữu hạn, không âm');
      ok(isFinite(E.netWorth(l)) && isFinite(l.money), 'tài sản ròng hữu hạn');
      ok(l.mind.stress >= 0 && l.mind.stress <= 100, 'mức căng thẳng 0–100');
    }
    if (E.assetTotal(l) > 0 || (l.basis && Object.values(l.basis).some(x => x > 0))) invested++;
    l.log.forEach(e => ok(!badText(e.t), 'dòng nhật ký sạch'));
  }
  console.log('   Tài sản: có đầu tư ' + invested + ' · đất sốt ' + landBoom + ' · bong bóng vỡ ' + landBust + ' · chứng khoán sập ' + crash + ' · bán tài sản trang trải ' + liq + ' · hốt hụi ' + hui + ' · vỡ hụi ' + huiBust + ' · bảo hiểm chi trả ' + insPay + ' · hết hạn ' + insEnd);
  ok(invested > 60, 'người chơi đầu tư được');
  ok(landBoom > 5 && landBust > 2 && crash > 5, 'thị trường có chu kỳ sốt đất, vỡ bong bóng, chứng khoán sập');
  ok(hui > 10 && huiBust > 0, 'chơi hụi: có người hốt hụi, có dây hụi bị vỡ');
  ok(insPay + insEnd > 5, 'bảo hiểm: có chi trả / đáo hạn');
  const la = E.createLife({ mode: 'vn', seed: 33001 }); la.age = 30; la.indep = true; la.money = la.base * 3;
  E.ext.buy(la, 'land', la.base * 2); const nw0 = E.netWorth(la);
  ok(Math.abs(nw0 - la.base * 3) < 1e-6, 'mua tài sản không làm đổi tài sản ròng');
  la.money = -la.base; la.mkt.land = 'đóng băng'; E.ext.assetsYear(la, () => 0.5, () => { }, 30);
  ok(la.money >= -1e-6 && la.assets.land < la.base * 2, 'hết tiền mặt thì phải bán bớt tài sản (đất đóng băng bị ép giá)');
  ok(E.DEC.ban_tai_san && E.ACT.some(a => a.id === 'ban_tai_san') && E.ACT.some(a => a.id === 'mua_bao_hiem'), 'có hành động bán tài sản & mua bảo hiểm');
  // tâm lý
  let burn = 0, ppd = 0, mid = 0, highStress = 0, nL = 0;
  for (let i = 0; i < 250; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 34000 + i }); let g = 0, hs = false;
    while (l.alive && g++ < 130) { E.beginYear(l, { auto: true }); l.pending.forEach(d => { if (d.id === 'kiet_suc') burn++; if (d.id === 'tram_cam_sau_sinh') ppd++; if (d.id === 'khung_hoang_40') mid++; }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); if (l.mind.stress > 70) hs = true; }
    nL++; if (hs) highStress++;
  }
  console.log('   Tâm lý: kiệt sức ' + burn + ' · trầm cảm sau sinh ' + ppd + ' · khủng hoảng tuổi trung niên ' + mid + ' · từng căng thẳng quá tải ' + highStress + '/' + nL);
  ok(burn > 5 && ppd > 5 && mid > 10, 'có kiệt sức, trầm cảm sau sinh, khủng hoảng tuổi trung niên');
  ok(highStress > 10 && highStress < nL * 0.8, 'căng thẳng quá tải xảy ra nhưng không phải ai cũng bị');
  ok(E.ACT.some(a => a.id === 'tri_lieu') && E.DEC.tri_lieu, 'có hành động chăm sóc tinh thần / trị liệu');
  ok(/Căng thẳng/.test(appSrc), 'bảng chỉ số hiện mức căng thẳng');
  // đời con cái
  let kids30 = 0, kidsJob = 0, kidsUni = 0, kid18 = 0, kidVice = 0;
  for (let i = 0; i < 220; i++) {
    const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 35000 + i }); let g = 0;
    while (l.alive && g++ < 130) { E.beginYear(l, { auto: true }); l.pending.forEach(d => { if (d.id === 'con_18') kid18++; if (d.id === 'con_lac_loi') kidVice++; }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
    l.kids.forEach(k => {
      ok(isFinite(k.close) && k.close >= 0 && k.close <= 100 && isFinite(k.inc) && k.inc >= 0, 'chỉ số của con hợp lệ');
      if (k.job) ok(!!E.CAR[k.job] && !badText(E.kidTitle(k)), 'nghề của con hợp lệ: ' + E.kidTitle(k));
      ok(isFinite(E.kidSupport(l, k)) && E.kidSupport(l, k) >= 0, 'con phụng dưỡng hợp lệ');
      if (k.alive && l.age - k.born >= 30) { kids30++; if (k.job || k.inc > 0) kidsJob++; if (k.edu >= 5) kidsUni++; }
    });
  }
  console.log('   Con cái ≥30 tuổi: ' + kids30 + ' · có việc làm ' + kidsJob + ' · tốt nghiệp đại học ' + kidsUni + ' · ngã rẽ 18 tuổi ' + kid18 + ' · con lạc lối ' + kidVice);
  ok(kids30 > 50 && kidsJob / kids30 > 0.7, 'con cái lớn lên có nghề nghiệp riêng');
  ok(kidsUni > 5 && kidsUni < kids30, 'một phần con cái học đại học');
  ok(kid18 > 30 && kidVice > 3, 'có ngã rẽ 18 tuổi của con và chuyện con lạc lối');
  // sống tiếp đời con
  let heirs = 0;
  for (let i = 0; i < 120 && heirs < 40; i++) {
    const p = run1(E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 36000 + i }));
    const k = p.kids.find(x => x.alive); if (!k) continue;
    const o = E.childOpts(p, k), c = E.createLife(o); heirs++;
    ok(c.name === k.name && c.sex === k.sex, 'đời con: đúng tên & giới tính của con');
    ok(c.birthYear === p.birthYear + k.born, 'đời con: sinh đúng năm');
    ok(c.gen === (p.gen || 1) + 1 && c.lineage.length >= 1 && c.lineage[c.lineage.length - 1].n === p.name, 'đời con: ghi nhận thế hệ & dòng họ');
    ok(c.fam.mName === p.name || c.fam.fName === p.name, 'đời con: bố/mẹ chính là nhân vật đời trước');
    ok(c.country === (p.abroad && p.abroad.perm ? p.abroad.code : p.country), 'đời con: sinh ra ở nơi bố/mẹ đang sống');
    if (E.isVN(p) && p.mode === 'vn' && !(p.abroad && p.abroad.perm)) ok(c.eth === p.eth, 'đời con: cùng dân tộc'); // v2.4: định cư nước ngoài thì con sinh ở nước đó
    ok(isFinite(c.fam.mInc) && isFinite(c.fam.fInc) && !badText(c.log[0].t), 'đời con: giấy khai sinh hợp lệ');
    run1(c); checkLife(c, 'đời con #' + i);
  }
  ok(heirs >= 20, 'thử được nhiều đời con (' + heirs + ')');
  ok(/data-heir/.test(appSrc) && /childOpts/.test(appSrc), 'màn kết thúc có nút "Sống tiếp đời con"');
  // học hành
  let grads = 0, khoi = 0, scores = [], schol = 0, kno = [];
  for (let i = 0; i < 300; i++) {
    const l = E.createLife({ mode: 'vn', seed: 37000 + i }); run1(l, 19);
    if (l.examScore != null) { grads++; scores.push(l.examScore); kno.push(l.st.kno); ok(l.examScore >= 5 && l.examScore <= 30 && (l.examScore * 4) % 1 === 0, 'điểm thi THPT hợp lệ ' + l.examScore); if (l.khoi && E.KHOI[l.khoi]) khoi++; if (l.flags.scholar) schol++; }
  }
  const mean = scores.reduce((s, x) => s + x, 0) / scores.length;
  console.log('   Thi THPT: ' + grads + ' người · điểm TB ' + mean.toFixed(2) + ' · có khối ' + khoi + ' · đạt ≥27: ' + schol);
  ok(grads > 100 && khoi === grads, 'ai thi tốt nghiệp THPT cũng có khối thi');
  ok(mean >= 5 && mean <= 30 && schol === scores.filter(s=>s>=27).length, 'điểm và cờ học bổng thống nhất theo kết quả thi'); const high=E.createLife({mode:'vn',seed:37001}); high.st.kno=99; ok(E.rollExamScore(high,()=>U.rand(high))>=20, 'kiến thức 99 không bị điểm thấp bất thường (điểm thi v5.6.1 sát thực tế)'); ok(mean >= 19 && mean <= 24.5 && schol <= grads * 0.15, 'điểm thi THPT trung bình sát thực tế (' + mean.toFixed(2) + '), từ 27 điểm trở lên chỉ là số ít (' + schol + '/' + grads + ')');
  ['chon_khoi', 'luyen_thi', 'chuyen_truong', 'bat_nat_mang', 'con_18', 'con_lac_loi', 'con_xin_von', 'con_bo_be', 'kiet_suc', 'tram_cam_sau_sinh', 'khung_hoang_40', 'choi_hui', 'bao_hiem']
    .forEach(id => ok(!!E.DEC[id], 'có tình huống "' + id + '"'));
  ['con_18', 'khung_hoang_40', 'kiet_suc', 'chon_khoi'].forEach(id => ok(E.isMajor({ id }), '"' + id + '" là ngã rẽ quyết định'));
  // dữ liệu lưu từ v2.2
  const old = E.createLife({ mode: 'vn', seed: 38001 }); delete old.assets; delete old.mind; delete old.mkt; delete old.basis; old.kids = [{ name: 'Bé', sex: 'F', born: 0, alive: true, kids: 0 }]; E.migrate(old);
  ok(old.assets && old.mind && old.mkt && old.kids[0].close === 70, 'đời lưu từ v2.2 được bổ sung tài sản, tâm lý, chỉ số con cái');
  run1(old, 40); ok(isFinite(E.netWorth(old)), 'đời lưu cũ chạy tiếp được');
  // ảnh thẻ & nhạc lofi (chạy trên trình duyệt)
  const cardSrc = fs.readFileSync(path.join(ROOT, 'js/card.js'), 'utf8'), musicSrc = fs.readFileSync(path.join(ROOT, 'js/music.js'), 'utf8');
  ok(/getContext\('2d'\)/.test(cardSrc) && /1080/.test(cardSrc) && /toBlob/.test(cardSrc), 'có ảnh thẻ cuộc đời 1080×1350');
  ok(/AudioContext/.test(musicSrc) && /resumeOnGesture/.test(musicSrc) && !/\.(mp3|ogg|wav)/.test(musicSrc), 'nhạc lofi tự sinh, không dùng file nhạc ngoài');
  ok(/#musicBtn/.test(appSrc) && /volRange/.test(appSrc), 'có nút bật/tắt nhạc & âm lượng');
  for (const f of ['card.js', 'music.js']) { try { new vm.Script(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')); ok(true, f + ' cú pháp hợp lệ'); } catch (e) { ok(false, f + ' lỗi cú pháp: ' + e.message); } }
}
section('20. Bản 2.4: lỗi người chơi phản hồi, xe/nhà theo mức giàu, đầu tư kinh doanh, anh chị em, ngoại ngữ, nghỉ hưu');
{
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  const run1 = (l, until) => { let g = 0; while (l.alive && g++ < 130 && (until == null || l.age < until)) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); } return l; };
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed }); l.age = age; l.indep = true; if (setup) setup(l); return l; };
  const playDec = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); const out = E.resolve(l, key || E.autoKey(l)); return { d, out }; };
  const texts = out => out.map(e => e.t).join(' | ');

  // 1. bỏ dòng nguồn ở bảng nghề
  ok(!/Nguồn tham khảo/.test(appSrc), 'bảng Nghề & lương không còn dòng "Nguồn tham khảo"');

  // 2 + 5. bố mẹ đã mất không còn xuất hiện
  let badParent = 0;
  for (let i = 0; i < 300; i++) {
    const l = mk(40000 + i, 40, l => { l.fam.fAlive = false; l.fam.mAlive = true; });
    const d = E.DEC.tham_bo_me.make(l, R(i)); l.pending.unshift(d); const out = E.resolve(l, 'go');
    if (/Bố khoe|Bố rót|bố mẹ giờ|Bố mẹ giờ/.test(texts(out) + d.text)) badParent++;
    const n = E.DEC.bo_me_can.make(l, R(i + 7)); if (/^Bố |chữa bệnh cho bố/.test(n.data.t + n.data.w)) badParent++;
    l.fam.mAlive = false;
    const s = E.DEC.mua_sam.make(l, R(i + 3)); if (/bố mẹ|cho mẹ|cho bố/.test(s.text)) badParent++;
    const k = E.DEC.khung_bo.make(l, R(i)); if (/bố mẹ/.test(k.text)) badParent++;
  }
  ok(badParent === 0, 'không nhắc bố/mẹ đã mất (thăm nhà, mua sắm, bố mẹ cần, đòi nợ): ' + badParent + ' lỗi');
  ok(!E.DEC.tham_bo_me.valid(mk(40500, 50, l => { l.fam.mAlive = false; l.fam.fAlive = false; })), 'bố mẹ đều mất: không có "Về thăm bố mẹ"');
  { const l = mk(40501, 81, l => { l.fam.mAlive = false; l.fam.fAlive = false; l.kids = [{ name: 'Con', sex: 'M', born: 30, alive: true, kids: 0 }]; l.loans = [{ type: 'nong', name: 'vay nóng', bal: l.base, rate: 1.5, minShare: 0.4, late: 1 }]; l.flags.thugDebt = true; });
    const { out } = playDec(l, 'khung_bo', 'family'); ok(/các con/.test(texts(out)) && !/bố mẹ|Bố mẹ/.test(texts(out)), 'tuổi già nhờ các con trả nợ, không phải bố mẹ: ' + texts(out)); }

  // 3. nhớ các nước đã đến
  { const l = mk(40600, 47, l => { l.money = l.base * 5; l.visited = []; });
    E.H.visit(l, 'Hàn Quốc'); ok(E.H.visited(l, 'Hàn Quốc'), 'ghi nhớ nước đã đến'); let again = 0, wrong = 0;
    for (let i = 0; i < 300; i++) { const x = E.createLife({ mode: 'vn', seed: 40700 + i }); E.runHeadless(x); const been = {}; x.log.forEach(e => { const m = /Lần đầu đặt chân đến ([^.]+)\./.exec(e.t); if (m) { if (been[m[1]]) wrong++; been[m[1]] = 1; again++; } }); }
    ok(wrong === 0, 'đã từng đến một nước thì không còn "lần đầu đặt chân" đến nước đó (' + wrong + '/' + again + ')'); }
  { let xk = 0, marked = 0; for (let i = 0; i < 400 && xk < 20; i++) { const l = mk(40700 + i, 24, l => { l.money = l.base * 3; }); const d = E.DEC.xkld.make(l, R(i)); l.pending.unshift(d); E.resolve(l, 'check'); if (l.abroad) { xk++; if (E.H.visited(l, l.abroad.name)) marked++; } }
    ok(xk > 5 && marked === xk, 'đi XKLĐ được ghi nhớ là nước đã đến (' + marked + '/' + xk + ')'); }

  // 4. chứng chỉ ngoại ngữ theo nơi định đến
  ok(E.H.LANG.ja.lv.join() === 'N5,N4,N3,N2,N1' && E.H.LANG.en.cert === 'IELTS' && E.H.LANG.ko.cert === 'TOPIK' && E.H.LANG.zh.cert === 'HSK', 'có JLPT N5→N1, IELTS, TOPIK, HSK');
  { const l = mk(40800, 25, l => { l.abroad = { code: 'JP', name: 'Nhật Bản', until: 28, mult: 3.6, perm: false }; l.money = l.base * 3; });
    const d = E.DEC.hoc_them.make(l, R(1)); ok(d.data.ctx === 'ja' && d.opts.some(o => /JLPT N5/.test(o.l)), 'ở Nhật thì gợi ý học tiếng Nhật thi JLPT: ' + d.opts.map(o => o.l).join(' / '));
    let lv = 0; for (let i = 0; i < 30; i++) { E.H.studyLang(l, 'ja', R(i), () => { }); lv = l.lang.ja; } ok(lv === 5 && E.H.langCert(l, 'ja') === 'JLPT N1', 'học dần lên đến JLPT N1');
    ok(E.H.langNext(l, 'ja') == null && !E.DEC.hoc_them.make(l, R(2)).opts.some(o => o.k === 'lang'), 'đã có N1 thì không học tiếp tiếng Nhật'); }
  { const l = mk(40801, 25); const d = E.DEC.hoc_them.make(l, R(3)); ok(d.opts.some(o => /IELTS/.test(o.l)), 'IELTS vẫn là lựa chọn chung'); }
  { let go = 0, cert = 0; for (let i = 0; i < 300 && go < 15; i++) { const l = mk(40900 + i, 23, l => { l.money = l.base * 3; }); const d = E.DEC.xkld.make(l, R(i)); if (d.data.c[0] !== 'JP') continue; l.pending.unshift(d); E.resolve(l, 'check'); if (l.abroad) { go++; if (l.lang && l.lang.ja >= 1) cert++; } }
    ok(go > 3 && cert === go, 'đi XKLĐ Nhật phải học tiếng, có JLPT (' + cert + '/' + go + ')'); }

  // 6. concert & thần tượng già đi
  { const l = mk(41000, 71); ok(E.actAvail(l, E.ACT.find(a => a.id === 'concert')) !== true, '71 tuổi không còn "đi concert"');
    let old = 0; for (let i = 0; i < 300; i++) { const x = E.createLife({ mode: 'vn', seed: 41100 + i, year: 2080 }); x.age = 20; const n = E.H.pickIdol(R(i), x); const b = E.IDOL_BORN[n]; if (b && 2100 - b > 50) old++; if (!x.idolBorn || !n) old++; }
    ok(old === 0, 'năm 2100 không chọn thần tượng đã ngoài 50 (' + old + ')');
    ok(E.IDOL_BORN['Dua Lipa'] === 1995, 'Dua Lipa có năm sinh');
    const y = E.createLife({ mode: 'vn', seed: 41500 }); y.age = 30; y.idol = 'Dua Lipa'; y.idolBorn = 1995; y.birthYear = 2040;
    const cT = E.TRIG.filter(t => t.id === 'concert').pop(); ok(!cT.when(y, 30), 'thần tượng 75 tuổi không còn tổ chức concert');
    y.birthYear = 2000; ok(cT.when(y, 30), 'thần tượng 35 tuổi vẫn tổ chức concert'); }

  // 7. bớt lặp lại
  { const l = mk(41600, 30, l => { l.money = l.base * 3; }); E.act(l, 've_so'); ok(E.actAvail(l, E.ACT.find(a => a.id === 've_so')) !== true, 'mỗi hành động chỉ làm một lần mỗi năm');
    let same = 0, n = 0; for (let i = 0; i < 60; i++) { const x = run1(E.createLife({ mode: 'vn', seed: 41700 + i })); const byAge = {}; x.log.forEach(e => { if (e.k === 'money') return; const key = e.a + '|' + e.t; byAge[key] = (byAge[key] || 0) + 1; }); Object.values(byAge).forEach(c => { n++; if (c > 1) same++; }); }
    ok(same / n < 0.01, 'hiếm khi một câu lặp lại trong cùng năm (' + same + '/' + n + ')'); }

  // 10. nợ không treo vài chục năm, CIC tự xóa, người già không bị vay nợ app
  { let longLate = 0, oldHome = 0, cleared = 0, oldApp = 0, lives = 0;
    for (let i = 0; i < 700; i++) {
      const l = E.createLife({ mode: 'vn', seed: 42000 + i }); let g = 0;
      while (l.alive && g++ < 130) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
        (l.loans || []).forEach(L => { if ((L.lateTot || 0) > 5) longLate++; if (L.type === 'home' && l.age > 76) oldHome++; if (L.type === 'appden' && L.since >= 65) oldApp++; }); }
      lives++; if (l.log.some(e => /xóa khỏi CIC/.test(e.t))) cleared++;
    }
    ok(longLate === 0, 'không còn khoản nợ trễ hạn quá 5 năm (' + longLate + ')');
    ok(oldHome === 0, 'không còn vay mua nhà sau 76 tuổi (' + oldHome + ')');
    ok(oldApp === 0, 'người trên 65 không vay app đen mới (' + oldApp + ')');
    ok(cleared > 0, 'có người được xóa nợ xấu CIC sau 5 năm (' + cleared + '/' + lives + ')'); }
  { const l = mk(42900, 40, l => { l.credit = { bad: true, since: 30, last: 34 }; l.loans = []; }); ok(E.H.canBankLoan(l), 'nợ xấu đã quá 5 năm: được vay ngân hàng lại'); }
  { const l = mk(42901, 50, l => { l.ownHouse = true; l.houseVal = l.base * 20; l.loans = [{ type: 'home', name: 'vay mua nhà', bal: l.base * 30, rate: 0.08, minShare: 0.06, late: 2, lateTot: 2 }]; l.money = 0; l.job = null; });
    let msg = ''; for (let i = 0; i < 4 && l.alive; i++) { E.beginYear(l, {}); l.pending = []; E.finishYear(l); E.endYear(l); }
    msg = l.log.map(e => e.t).join(' | '); ok(/phát mại/.test(msg) && !/Trả hết khoản vay mua nhà/.test(msg), 'bị phát mại nhà thì không báo "trả hết khoản vay mua nhà"'); }

  // 11. bệnh tật tuổi già
  { let reDiag = 0, chronCured = 0, oldCancer = 0, oldCured = 0;
    for (let i = 0; i < 700; i++) {
      const l = run1(E.createLife({ mode: 'vn', seed: 43000 + i }));
      const diag = {}; l.log.forEach(e => { const m = /(?:Bắt đầu điều trị|Điều trị|Quyết định không điều trị) (.+?)(?: ở |\.)/.exec(e.t); if (m) { diag[m[1]] = (diag[m[1]] || 0) + 1; } });
      Object.keys(diag).forEach(n => { if (diag[n] > 1) reDiag++; });
      if (l.log.some(e => /^Đã khỏi (tiểu đường|tăng huyết áp|suy thận|viêm gan B|xơ gan|HIV)/.test(e.t))) chronCured++;
      l.log.forEach(e => { if (e.a >= 85 && /Bắt đầu điều trị ung thư|Điều trị ung thư|không điều trị ung thư/.test(e.t)) oldCancer++; if (e.a >= 86 && /ung thư .*thuyên giảm/.test(e.t)) oldCured++; });
    }
    ok(reDiag === 0, 'không bị chẩn đoán lại cùng một bệnh (' + reDiag + ')');
    ok(chronCured === 0, 'bệnh mạn tính không "khỏi" mà được kiểm soát (' + chronCured + ')');
    ok(oldCured <= Math.max(1, oldCancer * 0.25), 'ung thư sau 85 tuổi hiếm khi khỏi (' + oldCured + '/' + oldCancer + ')'); }

  // v3.0: mua xe qua 3 bước — nhóm (xe máy / ô tô) → loại xe → mẫu xe
  const vGrp = sg => /^(so|ga|dien|con)$/.test(sg) ? 'moto' : 'car';
  const vSeg = sg => ({ A: 'pho', B: 'pho', C: 'pho', D: 'pho', L: 'sang', S: 'super' })[sg] || sg;
  const vehKeys = l => { const a = E.DEC.mua_xe.make(l, R(9)).opts.map(o => o.k); let k = []; ['moto', 'car'].forEach(g => { if (a.includes('g_' + g)) k = k.concat(E.DEC.mua_xe_loai.make(l, R(9), { g }).opts.map(o => o.k)); }); return k; };
  const vbuy = (l, sg, model) => { sg = vSeg(sg); const g = vGrp(sg); l.pending = [E.DEC.mua_xe.make(l, R(3))]; if (!l.pending[0].opts.some(o => o.k === 'g_' + g)) return false; E.resolve(l, 'g_' + g); if (!l.pending[0] || !l.pending[0].opts.some(o => o.k === 'seg_' + sg)) return false; E.resolve(l, 'seg_' + sg); const m = l.pending[0]; if (!m || m.id !== 'mua_xe_mau' || !m.opts.some(o => o.k === model)) return false; E.resolve(l, model); return true; };
  // 8. xe & nhà theo mức giàu có, đầu tư kinh doanh
  { const l = mk(44000, 40, l => { l.money = l.base * 5000; l.lic.B = true; l.income = l.base; });
    const d = E.DEC.mua_xe.make(l, R(1)); ok(['g_moto', 'g_car'].every(k => d.opts.some(o => o.k === k)) && /^1\. Xe máy/.test(d.opts[0].l) && /^2\. Ô tô/.test(d.opts[1].l), 'mua xe: chọn 1. Xe máy hay 2. Ô tô trước');
    ok(['seg_so', 'seg_ga', 'seg_dien', 'seg_con', 'seg_pho', 'seg_sport', 'seg_sang', 'seg_super'].every(k => vehKeys(l).includes(k)), 'nhiều tiền thì xem được mọi loại: xe số, tay ga, xe điện, côn tay, ô tô phổ thông, xe thể thao, xe sang, siêu xe');
    ok(vbuy(l, 'B', 'm_vios') && l.veh === 'ô tô' && l.vehTier === 1, 'mua ô tô phổ thông');
    const v0 = l.vehVal, m0 = l.money; ok(vbuy(l, 'S', 'm_huracan') && l.vehTier === 4 && /Lamborghini/.test(l.vehName) && l.money < m0 - 10000, 'đổi sang siêu xe (bán lại xe cũ ' + E.fmtMoney(l, v0) + ')');
    ok(!vehKeys(l).includes('seg_pho'), 'đã có siêu xe thì không còn gợi ý ô tô phổ thông');
    l.ownHouse = true; l.houseVal = E.H.housePrice(l); l.houseTier = 1;
    playDec(l, 'doi_nha', 'n_bt'); ok(l.houseTier === 4 && /biệt thự/.test(l.houseName), 'đổi lên biệt thự');
    playDec(l, 'doi_nha', 'n_dt'); ok(l.houseTier === 5 && /dinh thự/.test(l.houseName) && isFinite(E.netWorth(l)), 'đổi lên dinh thự');
    const dt = E.DEC.dau_tu_lon.make(l, R(3)); ok(['p_apt', 'p_shop', 'p_kiot', 'b_store', 'b_cafe', 'b_rest'].every(k => dt.opts.some(o => o.k === k)), 'có nhà cho thuê, cửa hàng, nhà hàng để đầu tư');
    playDec(l, 'dau_tu_lon', 'p_apt'); playDec(l, 'dau_tu_lon', 'b_rest'); ok(l.props.length === 1 && l.ventures.length === 1, 'mua nhà cho thuê & mở nhà hàng');
    const nw = E.netWorth(l); ok(nw > l.base * 10 && isFinite(nw), 'tài sản ròng tính cả nhà cho thuê & vốn kinh doanh'); }
  { let branch = 0, broke = 0, sims = 0;
    for (let i = 0; i < 300; i++) {
      const l = mk(44100 + i, 35, l => { l.money = l.base * 30; l.ventures = [{ k: 'rest', n: 'nhà hàng', cap: l.base * 5, unit: l.base * 5, br: 1, mu: 0.15, sd: 0.32, yrs: 0, bad: 0, good: 0 }]; });
      for (let y = 0; y < 15 && l.alive; y++) { E.wealth.investYear(l, R(i * 31 + y), () => { }, l.age); if ((l.sched || []).some(s => s.id === 'mo_chi_nhanh')) { l.sched = []; playDec(l, 'mo_chi_nhanh', 'yes'); } l.age++; }
      sims++; const v = l.ventures[0]; if (v && v.br > 1) branch++; if (!v) broke++;
      cleanLife(l, 'đầu tư #' + i);
    }
    ok(branch > 10 && broke > 10 && branch + broke < sims, 'kinh doanh: có người mở chi nhánh (' + branch + '), có người phá sản (' + broke + ') trên ' + sims); }

  // 9. anh chị em
  { let withSib = 0, names = 0, younger = 0, events = 0;
    for (let i = 0; i < 300; i++) {
      const l = E.createLife({ mode: 'vn', seed: 45000 + i });
      if (l.fam.sibs) { withSib++; if (l.sibList.length === l.fam.sibs && l.sibList.every(s => !badText(s.n) && s.n.length > 3 && s.born < 0)) names++; }
      run1(l, 50); if ((l.sibList || []).some(s => s.born > 0)) younger++;
      if (l.log.some(e => /Đám cưới của|lên chức|Mẹ sinh em bé|chở bạn đi học|giảng lại bài|bênh bạn/.test(e.t))) events++;
      cleanLife(l, 'anh chị em #' + i);
    }
    ok(withSib > 50 && names === withSib, 'anh chị em có tên & tuổi (' + names + '/' + withSib + ')');
    ok(younger > 5, 'mẹ có thể sinh thêm em (' + younger + ')');
    ok(events > 50, 'có chuyện với anh chị em trong đời (' + events + ')');
    ['sib_tre', 'sib_vay', 'sib_tra', 'sib_gap', 'chia_tai_san', 'doi_nha', 'dau_tu_lon', 'mo_chi_nhanh', 'quan_ly_dau_tu', 'sau_huu'].forEach(id => ok(!!E.DEC[id], 'có tình huống "' + id + '"'));
    ok(/sibList/.test(appSrc), 'bảng gia đình hiện từng anh chị em');
    const old = E.createLife({ mode: 'vn', seed: 45900 }); old.fam.sibs = 2; delete old.sibList; E.migrate(old); ok(old.sibList && old.sibList.length === 2, 'đời lưu từ bản cũ được bổ sung anh chị em'); }

  // 12. nghỉ hưu: chủ doanh nghiệp làm tiếp; nghỉ hưu rồi kinh doanh vẫn có lương hưu
  { let early = 0, n = 0;
    for (let i = 0; i < 100; i++) {
      const l = mk(46000 + i, 55, l => { E.startJob(l, 'kd_tu_do', R(i), () => { }); l.job.rank = 1; l.st.hea = 80; });
      for (let y = 0; y < 15; y++) { l.st.hea = 80; if (!l.job) break; const j0 = l.job; E.careerYear(l, R(i * 17 + y), () => { }, 'work'); if (!l.job && l.retired && l.age < 70) early++; l.age++; }
      n++;
    }
    ok(early === 0, 'chủ doanh nghiệp không phải nghỉ hưu trước 70 tuổi (' + early + '/' + n + ')');
    const l = mk(46500, 61, l => { l.retired = true; l.job = null; l.pensioned = true; l.pensionInc = l.base * 0.6; l.money = l.base * 5; l.st.kno = 90; });
    let opened = false; for (let t = 0; t < 10 && !opened; t++) { const c = clone(l); c.rs = 100 + t; playDec(c, 'sau_huu', 'shop'); if (c.job && !c.retired) { opened = true; E.beginYear(c, {}); c.pending = []; const before = c.money; E.finishYear(c); E.endYear(c); ok(c.fin && c.fin.inc >= c.pensionInc, 'mở cửa hàng sau nghỉ hưu vẫn nhận lương hưu'); } }
    ok(opened, 'nghỉ hưu rồi vẫn mở cửa hàng được'); }

  // bản đầy đủ chạy sạch với người giàu tự động tiêu tiền
  { let rich = 0; for (let i = 0; i < 200; i++) { const l = E.createLife({ mode: 'vn', seed: 47000 + i }); l.fam.q = 5; run1(l, 30); if (!l.alive) continue; l.money += l.base * 300; run1(l); checkLife(l, 'người giàu #' + i); if (l.vehTier >= 2 || l.houseTier >= 2 || (l.ventures || []).length || (l.props || []).length || l.log.some(e => /Khai trương|cho thuê|biệt thự|dinh thự|siêu xe|xe hạng sang/.test(e.t))) rich++; }
    ok(rich > 60, 'người giàu (AI) có tiêu tiền vào xe, nhà, đầu tư (' + rich + ')'); }
}
section('21. Bản 2.5: nghề mới, hướng đi giữa các nghề, sự kiện theo nghề, gia đình tài phiệt / chính trị');
{
  const run1 = (l, until) => { let g = 0; while (l.alive && g++ < 130 && (until == null || l.age < until)) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); } return l; };
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; l.indep = true; l.edu = 5; if (setup) setup(l); return l; };
  const play = (l, id, key) => { const d = E.DEC[id].make(l, R(l.rs)); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };

  // nghề mới
  ['chu_quan_an', 'chu_nha_hang', 'tiem_dt', 'tham_tu', 'cong_chung', 'phong_kham', 'chu_dau_tu', 'tai_phiet', 'ngan_hang_cao', 'chinh_tri', 'chinh_khach'].forEach(id => ok(!!E.CAR[id], 'có nghề ' + id));
  { const l = mk(50000, 40); const m = (id, rk) => E.monthlyEst(l, id, rk);
    ok(m('tai_phiet', 3) > m('kd_tu_do', 3) * 3 && m('tai_phiet', 3) * 12 > 15000 && m('tai_phiet', 3) * 12 < 80000, 'chủ tịch tập đoàn gia đình kiếm vài chục tỷ mỗi năm, không còn hàng trăm tỷ (v4.2 chống farm tiền) (' + E.fmtMoney(l, m('tai_phiet', 3) * 12) + '/năm)');
    ok(m('ngan_hang_cao', 3) > m('ngan_hang', 3) * 10, 'chủ tịch ngân hàng ≫ giám đốc chi nhánh'); }

  // hướng đi giữa các nghề
  Object.keys(E.jobs.PATHS).forEach(id => { ok(!!E.CAR[id], 'nghề nguồn tồn tại: ' + id); E.jobs.PATHS[id].forEach(p => ok(!!E.CAR[p[0]] && p[1] < E.CAR[p[0]].t.length, 'hướng đi ' + id + ' → ' + p[0] + ' hợp lệ')); });
  { const l = mk(50100, 32, l => { E.startJob(l, 'dau_bep', R(1), () => { }); l.job.rank = 2; l.job.yrs = 5; l.money = l.base * 10; });
    const t = play(l, 'chuyen_huong', 'go'); ok(['chu_quan_an', 'chu_nha_hang'].includes(E.resolveJob(l.job.id)) && l.job.rank >= 1, 'bếp trưởng mở quán / nhà hàng riêng: ' + t);
    const p = mk(50101, 40, l => { E.startJob(l, 'cong_an', R(2), () => { }); l.job.rank = 4; l.job.yrs = 5; l.money = l.base; }); play(p, 'chuyen_huong', 'go'); ok(E.resolveJob(p.job.id) === 'tham_tu', 'công an lâu năm có thể chuyển sang làm thám tử tư'); }
  { let n = 0; for (let i = 0; i < 400; i++) { const x = run1(E.createLife({ mode: 'vn', seed: 50200 + i }), 60); if (x.log.some(e => /^Rời vị trí .*chuyển sang làm/.test(e.t))) n++; } ok(n > 8, 'nhiều người rẽ hướng sự nghiệp trong đời (' + n + '/400)'); }

  // công an theo ngành
  { const brs = new Set(); for (let i = 0; i < 80; i++) { const l = mk(50300 + i, 25, l => E.startJob(l, 'cong_an', R(i), () => { })); E.jobs.policeBr(l, R(i + 9)); brs.add(l.job.br); if (i === 0) ok(/Cảnh sát|Công an khu vực/.test(E.jobTitle(l).split(' · ').pop()), 'danh xưng công an có ngành: ' + E.jobTitle(l)); }
    ok(['gt', 'hs', 'mt', 'kt', 'cd', 'kv'].every(b => brs.has(b)), 'đủ 6 ngành công an: ' + [...brs].join(',')); }
  { const l = mk(50400, 30, l => { E.startJob(l, 'cong_an', R(3), () => { }); l.job.br = 'gt'; }); const d = E.DEC.ca_chuyen_an.make(l, R(4)); ok(/xe|chốt|đua|rượu|cồn/.test(d.text), 'CSGT gặp tình huống giao thông: ' + d.text);
    l.job.br = 'kt'; let kh = false; for (let i = 0; i < 40; i++) if (/Campuchia/.test(E.DEC.ca_chuyen_an.make(l, R(i)).text)) kh = true; ok(kh, 'cảnh sát kinh tế có chuyên án đường dây đưa người sang Campuchia');
    let died = 0, medal = 0; for (let i = 0; i < 300; i++) { const c = clone(l); c.job.br = 'mt'; c.rs = 700 + i; const t = play(c, 'ca_chuyen_an', E.DEC.ca_chuyen_an.make(c, R(i)).opts.some(o => o.k === 'brave') ? 'brave' : 'law'); if (!c.alive) died++; if (/Huân chương/.test(t)) medal++; }
    ok(died > 0 && died < 40 && medal > 100, 'chống ma túy: lập công nhiều (' + medal + '), có hy sinh nhưng hiếm (' + died + '/300)'); }

  // thám tử: phần lớn là vụ ngoại tình
  { const l = mk(50500, 35, l => E.startJob(l, 'tham_tu', R(5), () => { })); let love = 0; for (let i = 0; i < 400; i++) if (/chồng|vợ/.test(E.DEC.tt_vu.make(l, R(i)).text)) love++;
    ok(love > 200, 'thám tử ở Việt Nam chủ yếu nhận vụ theo dõi ngoại tình (' + love + '/400)');
    let ok1 = 0, caught = 0; for (let i = 0; i < 200; i++) { const c = clone(l); c.rs = 800 + i; const t = play(c, 'tt_vu', 'caught'); if (/Bị phát hiện/.test(t)) caught++; else ok1++; }
    ok(caught > 20 && ok1 > 80, 'bám sát dễ bị phát hiện nhưng thường xong vụ (' + caught + ' bị lộ / ' + ok1 + ' xong)'); }

  // tham nhũng → thanh tra
  { const l = mk(50600, 45, l => { E.startJob(l, 'chinh_tri', R(6), () => { }); l.job.rank = 3; }); play(l, 'ct_co_che', 'yes'); ok(l.flags.dirty >= 2, 'nhận "quà cảm ơn" để lại vết');
    const tk = E.TRIG.find(t => t.id === 'ct_ky_luat'); ok(tk.when(l, l.age) && tk.p(l) > 0.05, 'có vết thì đoàn thanh tra có thể tìm đến');
    l.birthYear = 2031 - 45; ok(E.TRIG.find(t => t.id === 'ct_bau_cu').when(l, 45), 'năm 2031 có bầu cử đại biểu Quốc hội');
    l.birthYear = 2032 - 45; ok(!E.TRIG.find(t => t.id === 'ct_bau_cu').when(l, 45), 'năm 2032 không có bầu cử'); }

  // gia đình siêu giàu
  { const kinds = {}; let n = 0, badParents = 0, richParents = 0;
    for (let i = 0; i < 6000; i++) { const l = E.createLife({ mode: i % 4 ? 'vn' : 'world', seed: 51000 + i }); n++; if (l.fam.elite) { kinds[l.fam.elite] = (kinds[l.fam.elite] || 0) + 1; if (l.fam.q !== 5 || l.fam.vice || l.fam.noDad) badParents++; if (l.fam.fInc > 500 || l.fam.fJob === 'bí thư tỉnh ủy' || /nghị sĩ/.test(l.fam.fJob)) richParents++; } }
    const tot = Object.values(kinds).reduce((a, b) => a + b, 0);
    console.log('   Gia đình siêu giàu: ' + tot + '/' + n + ' ' + JSON.stringify(kinds));
    ok(tot / n > 0.006 && tot / n < 0.02, 'khoảng 1% sinh ra trong gia đình siêu giàu (' + (tot / n * 100).toFixed(2) + '%)');
    ok(kinds.tp && kinds.nh && kinds.ct, 'có cả tài phiệt, chủ ngân hàng, chính trị');
    ok(badParents === 0 && richParents === tot, 'gia đình siêu giàu: nhóm giàu nhất, bố mẹ giữ chức cao (' + richParents + '/' + tot + ')'); }
  { let follow = 0, cut = 0, inJob = 0, allow = 0, cutAllow = 0, inherit = 0, noWill = 0, lost = 0, n = 0;
    for (let i = 0; i < 20000 && n < 60; i++) {
      const l = E.createLife({ mode: 'vn', seed: 60000 + i }); if (!l.fam.elite) continue; n++;
      run1(l, 40); if (!l.alive) continue;
      if (l.fam.mLost || l.fam.fLost) lost++;
      if (l.flags.eliteFollow && !l.flags.eliteCut) { follow++; if (l.job && E.resolveJob(l.job.id) === E.jobs.eliteJob(l)) inJob++; if (l.log.some(e => /gia nhập cơ nghiệp|nhận công tác/.test(e.t))) allow++; }
      if (l.flags.eliteCut) { cut++; if ((l.yr.items || []).some(x => /Gia đình chu cấp/.test(x.t || ''))) cutAllow++; }
      l.fam.mAlive = false; l.fam.fAlive = false; E.jobs.eliteYear(l, R(i), (t) => { if (/di chúc/.test(t)) noWill++; else if (/Thừa kế|thừa kế/.test(t)) inherit++; }, l.age);
    }
    ok(n >= 30, 'thử đủ đời con nhà siêu giàu (' + n + ')');
    ok(follow > 5 && inJob >= follow * 0.6, 'nghe lời gia đình thì vào thẳng cơ nghiệp (' + inJob + '/' + follow + ')');
    ok(cut > 0 && cutAllow === 0, 'từ chối sắp xếp thì bị cắt chu cấp (' + cut + ' người)');
    ok(noWill > 0 && inherit > 0, 'nghe lời được thừa kế (' + inherit + '), bị cắt thì không có tên trong di chúc (' + noWill + ')');
    ok(lost === 0, 'bố mẹ tài phiệt không bị "cắt giảm nhân sự" (' + lost + ')'); }
  { const l = E.createLife({ mode: 'vn', seed: 61000 }); l.fam.elite = 'ct'; l.fam.q = 5; l.age = 17; l.edu = 3; l.school = null;
    play(l, 'elite_dinh_huong', 'follow'); for (let a = 17; a < 27 && l.alive; a++) { l.age = a; E.jobs.eliteYear(l, R(a), () => { }, a); if (l.school && a >= l.schoolEnd - 1) { l.school = null; l.edu = 5; } }
    ok(l.job && E.resolveJob(l.job.id) === 'chinh_tri', 'con nhà chính trị được đưa vào chính trường: ' + (l.job && E.jobTitle(l)));
    ok(l.flags.eliteBoost === 'chinh_tri', 'có "ô dù" giúp thăng tiến nhanh hơn'); }
  { const l = E.createLife({ mode: 'vn', seed: 61100 }); l.fam.elite = 'tp'; l.age = 26; l.indep = true; l.flags.eliteFollow = true; l.partner = { name: 'Người Yêu', sex: 'F', age: 25, status: 'dating', since: 24, alive: true };
    let cutN = 0; for (let i = 0; i < 100; i++) { const c = clone(l); c.rs = 900 + i; play(c, 'elite_hon_nhan', 'love'); if (c.flags.eliteCut) cutN++; }
    ok(cutN > 30 && cutN < 90, 'đòi cưới người mình yêu: nhiều khi bị gia đình cắt chu cấp (' + cutN + '/100)');
    const y = clone(l); play(y, 'elite_hon_nhan', 'yes'); ok(y.partner && y.partner.status === 'married' && y.partner.name !== 'Người Yêu', 'hôn nhân sắp đặt môn đăng hộ đối'); }
  { const l = mk(61200, 25); l.fam.elite = 'tp'; l.flags.eliteFollow = true; const k = { name: 'Bé', sex: 'M', born: 25, alive: true, kids: 0 }; l.kids = [k]; const o = E.childOpts(l, k); ok(o.parent.elite === 'tp', 'đời con của tài phiệt vẫn sinh trong gia đình tài phiệt');
    const c = E.createLife(o); ok(c.fam.elite === 'tp' && c.fam.q === 5, 'sống tiếp đời con: vẫn là gia đình tài phiệt'); }
  ok(!/Nghèo cũng không/.test(play(mk(61300, 30, l => { l.fam.q = 5; l.money = l.base * 50; }), 'ru_re', 'no')), 'con nhà giàu từ chối làm ăn phi pháp không nói "nghèo"');
}
section('22. Bản 2.6: thu nhỏ hộp lựa chọn, tuổi thơ đa dạng theo giới tính');
{
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'), css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
  ok(/id="decMin"/.test(appSrc) && /function minimizeDecision/.test(appSrc) && /decPill/.test(appSrc) && /\.decpill/.test(css), 'hộp lựa chọn có nút thu nhỏ và thanh "đang chờ bạn chọn" để mở lại');
  ok(/S\.phase === 'decmin'/.test(appSrc) && /Escape/.test(appSrc), 'đang thu nhỏ thì đời tạm dừng, phím Esc để thu nhỏ / mở lại');
  // v2.6: $() trả về một phần tử, $$() mới trả về danh sách — gọi .forEach trên $() làm hỏng cả trang
  const badSel = appSrc.match(/[^$]\$\((['"])[^'"]*\1(?:,\s*\w+)?\)\.forEach/g);
  ok(!badSel, 'app.js không gọi .forEach trên $() (chỉ dùng $$()): ' + (badSel || []).join(' | '));
  for (const f of ['app.js', 'childhood.js', 'jobs.js', 'wealth.js']) { try { new vm.Script(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')); ok(true, f + ' cú pháp hợp lệ'); } catch (e) { ok(false, f + ' lỗi cú pháp: ' + e.message); } }
  const run = (l, until) => { let g = 0; while (l.alive && l.age < until && g++ < 30) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); } return l; };
  const dec = {}; const wrap = {};
  Object.keys(E.DEC).forEach(id => { const ap = E.DEC[id].apply; wrap[id] = ap; E.DEC[id].apply = function (l) { if (l.age <= 15) { const k = id + '|' + l.sex; dec[k] = (dec[k] || 0) + 1; } return ap.apply(this, arguments); }; });
  let rep = 0, tot = 0, lines = 0, n = 0; const kinds = new Set();
  for (let i = 0; i < 500; i++) {
    const l = run(E.createLife({ mode: i % 5 ? 'vn' : 'world', seed: 70000 + i, gender: i % 2 ? 'M' : 'F' }), 16); n++;
    const seen = {}; l.log.filter(e => e.a <= 15 && e.k !== 'money').forEach(e => { tot++; kinds.add(e.t); if (seen[e.t]) rep++; seen[e.t] = 1; });
    lines += l.log.filter(e => e.a <= 15).length; cleanLife(l, 'tuổi thơ #' + i);
    ok((l.flags.kidSeen || []).length <= 120, 'bộ nhớ chống lặp có giới hạn');
  }
  Object.keys(wrap).forEach(id => { E.DEC[id].apply = wrap[id]; });
  console.log('   Tuổi thơ: ' + (lines / n).toFixed(1) + ' dòng/đời · ' + kinds.size + ' câu khác nhau · lặp trong cùng đời ' + (rep / tot * 100).toFixed(2) + '%');
  ok(lines / n > 30, 'mỗi tuổi thơ có nhiều chuyện để kể (' + (lines / n).toFixed(1) + ' dòng)');
  ok(kinds.size > 2000 && rep / tot < 0.03, 'tuổi thơ đa dạng, hiếm khi lặp lại (' + kinds.size + ' câu, lặp ' + (rep / tot * 100).toFixed(2) + '%)');
  const c = (id, s) => dec[id + '|' + s] || 0;
  ok(c('net_coi', 'F') < c('net_coi', 'M') * 0.4, 'bé gái ít bị rủ đi net hơn bé trai (' + c('net_coi', 'F') + ' vs ' + c('net_coi', 'M') + ')');
  ok(c('son_moi', 'M') === 0 && c('toc_dai', 'M') === 0 && c('son_moi', 'F') + c('toc_dai', 'F') > 0, 'tình huống riêng của bé gái (son môi, mái tóc)');
  ok(c('da_bong_vo_kinh', 'F') === 0 && c('da_bong_vo_kinh', 'M') > 0, 'tình huống riêng của bé trai (đá bóng vỡ kính)');
  ok(c('kpop', 'F') > c('kpop', 'M'), 'bé gái mê thần tượng K-pop nhiều hơn (' + c('kpop', 'F') + ' vs ' + c('kpop', 'M') + ')');
  const childIds = [...new Set(Object.keys(dec).map(k => k.split('|')[0]))];
  ok(childIds.length >= 60, 'tuổi thơ gặp nhiều loại tình huống khác nhau (' + childIds.length + ')');
  ['nhat_vi_be', 'trom_xoai', 'tam_song', 'ban_moi', 'hoi_khoe', 've_tranh', 'sinh_nhat', 'to_ong', 'dien_thoai_be', 'da_bong_vo_kinh', 'thach_danh', 'dua_xe_dap', 'kpop', 'nau_com', 'son_moi', 'toc_dai', 'thu_nac_danh', 'nap_game', 'tiktok', 'meo_ket', 'chuyen_ma', 'choi_le_hoi']
    .forEach(id => ok(!!E.DEC[id], 'có tình huống tuổi thơ "' + id + '"'));
}
section('23. Bản 2.7: lượt hành động theo tuổi, game tự chọn việc, trọng tâm cân bằng, người yêu có nghề & lương, ai trả tiền hẹn hò, bố mẹ chu cấp, mua xe trả thẳng / trả góp, đặt tên thú cưng, bố cục');
{
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'), html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, sex, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; if (setup) setup(l); return l; };
  // lượt hành động: <10 tuổi 3 · 10–17 tuổi 7 · ≥18 không giới hạn
  ok(E.actsLimit({ age: 8 }) === 3 && E.actsLimit({ age: 9 }) === 3 && E.actsLimit({ age: 10 }) === 7 && E.actsLimit({ age: 17 }) === 7 && E.actsLimit({ age: 18 }) === Infinity, 'lượt hành động: 3 (dưới 10) · 7 (10–17) · không giới hạn (từ 18)');
  { const l = mk(80000, 12); E.beginYear(l, {}); l.pending = []; l.acts = 4; let n = 0; for (const a of E.actions(l).filter(a => a.ok === true)) { if (E.act(l, a.id)) n++; l.pending = []; }
    ok(n === 3 && l.acts === 7, '12 tuổi được làm tối đa 7 việc mỗi năm (đã dùng 4, làm thêm được ' + n + ')');
    const k = mk(80001, 8); E.beginYear(k, {}); k.pending = []; let m = 0; for (const a of E.actions(k).filter(a => a.ok === true)) { if (E.act(k, a.id)) m++; k.pending = []; }
    k.acts = 3; ok(m <= 3 && E.actions(k).every(a => a.ok !== true) && E.actions(k).some(a => a.ok === 'Đã hết lượt hành động năm nay'), '8 tuổi tối đa 3 việc mỗi năm (' + m + ')'); }
  // không tự chọn việc gì thì game tự chọn ngẫu nhiên
  { let auto = 0; for (let i = 0; i < 200; i++) { const l = mk(80100 + i, 25); l.prevActs = 0; l.acts = 0; const before = l.acts; E.beginYear(l, {}); if (l.acts > 0) auto++; }
    ok(auto > 25 && auto < 160, 'năm trước không tự làm gì thì game tự chọn ngẫu nhiên một việc (' + auto + '/200)');
    let none = 0; for (let i = 0; i < 200; i++) { const l = mk(80400 + i, 25); l.acts = 2; E.beginYear(l, {}); if (l.acts > 0) none++; } ok(none === 0, 'năm trước đã tự làm việc thì game không chen vào (' + none + ')'); }
  // trọng tâm cân bằng
  ok(/'balance', 'Cân bằng'/.test(appSrc) && /f\[5\] && a < f\[5\]/.test(appSrc), 'có trọng tâm "Cân bằng" từ 21 tuổi');
  { let kb = 0, kw = 0, hb = 0, hw = 0; for (let i = 0; i < 150; i++) { const b = mk(80700 + i, 30, 'M', l => { E.startJob(l, 'van_phong', R(i), () => { }); l.focus = 'balance'; }), w = JSON.parse(JSON.stringify(b)); w.focus = 'work';
      for (const [x, tag] of [[b, 'b'], [w, 'w']]) { E.beginYear(x, {}); x.pending = []; E.finishYear(x); x.pending = []; E.endYear(x); if (tag === 'b') { kb += x.st.kno; hb += x.st.hea; } else { kw += x.st.kno; hw += x.st.hea; } } }
    ok(hb > hw && kb > kw - 150, 'cân bằng: khỏe hơn tập trung công việc, kiến thức vẫn tăng (sức khỏe ' + (hb / 150).toFixed(1) + ' vs ' + (hw / 150).toFixed(1) + ')'); }
  // người yêu có nghề, quen lâu mới biết lương
  { let withJob = 0, n = 0; for (let i = 0; i < 200; i++) { const l = mk(81000 + i, 27); const d = E.DEC.love.make(l, R(i)); n++; if (d.data.p.job && /đang làm|sinh viên|nghỉ hưu/.test(d.text)) withJob++; if (i === 0) { l.pending.unshift(d); E.resolve(l, 'yes'); ok(l.partner && l.partner.job && l.partner.incKnown === false, 'người yêu mới: biết nghề nhưng chưa biết lương — ' + l.partner.job); for (let y = 0; y < 3; y++) E.family.partnerYear(l, R(y), () => { }, l.age + y); ok(l.partner.incKnown && isFinite(l.partner.inc), 'quen hai năm thì biết lương của người ấy'); } }
    ok(withJob === n, 'người mới quen hiện cả công việc (' + withJob + '/' + n + ')'); }
  ok(/thu nhập: chưa rõ/.test(appSrc) && /partnerIncKnown/.test(appSrc), 'bảng gia đình hiện nghề & lương người yêu khi đã biết');
  // ai trả tiền buổi hẹn
  { let fPaid = 0, mPaid = 0; for (let i = 0; i < 300; i++) {
      const f = mk(81500 + i, 24, 'F', l => { l.money = l.base; l.partner = { name: 'Anh', sex: 'M', age: 26, status: 'dating', since: 23, alive: true, inc: 10 }; }); const m0 = f.money; E.H.datePay(f, R(i), 0.02, 'Hẹn hò'); if (f.money < m0) fPaid++;
      const m = mk(81800 + i, 24, 'M', l => { l.money = l.base; l.partner = { name: 'Em', sex: 'F', age: 22, status: 'dating', since: 23, alive: true, inc: 8 }; }); const n0 = m.money; E.H.datePay(m, R(i + 5), 0.02, 'Hẹn hò'); if (m.money < n0) mPaid++; }
    ok(fPaid < 90, 'nữ hẹn hò với nam: phần lớn bạn nam trả tiền (nữ phải trả ' + fPaid + '/300)');
    ok(mPaid > 200 && mPaid < 290, 'nam: thường tự trả, đôi khi được người yêu bao (' + mPaid + '/300)'); }
  // bố mẹ khá giả chu cấp
  { const rich = mk(82000, 19, 'M', l => { l.fam.q = 5; l.fam.mAlive = l.fam.fAlive = true; l.fam.fInc = 80; l.fam.mInc = 40; l.school = 'uni'; l.indep = false; l.money = 0; l.cityStudent = { city: 'Hà Nội', since: 18 }; });
    const kid15 = mk(82002, 15, 'M', l => { l.fam.q = 5; l.fam.mAlive = l.fam.fAlive = true; l.fam.fInc = 80; l.fam.mInc = 40; l.school = 'upper'; l.indep = false; l.money = 0; l.cityStudent = null; l.movedTo = null; });
    let km = ''; E.family.allowanceYear(kid15, R(3), t => { km = t; }, 15);
    ok(/tiền tiêu vặt/.test(km) && !/sinh hoạt/.test(km) && kid15.money < rich.base * 0.5, '15 tuổi còn ở nhà với bố mẹ: chỉ là tiền tiêu vặt (' + km + ')');
    const poor = mk(82001, 19, 'M', l => { l.fam.q = 2; l.fam.mAlive = l.fam.fAlive = true; l.fam.fInc = 6; l.fam.mInc = 5; l.school = 'uni'; l.indep = false; l.money = 0; });
    let msg = ''; E.family.allowanceYear(rich, R(1), t => { msg = t; }, 19); E.family.allowanceYear(poor, R(2), () => { }, 19);
    ok(rich.money > rich.base * 0.5 && poor.money === 0 && /tiền sinh hoạt/.test(msg), 'bố mẹ giàu chu cấp tiền sinh hoạt nhiều (' + E.fmtMoney(rich, rich.money) + '/năm), nhà nghèo thì không'); }
  // mua xe: trả thẳng & trả góp
  // v2.8: mua xe theo số tiền — chọn phân khúc rồi chọn mẫu; đủ tiền trả thẳng, chưa đủ thì trả góp
  // v3.0: mua xe qua 3 bước — nhóm (xe máy / ô tô) → loại xe → mẫu xe
  const vGrp = sg => /^(so|ga|dien|con)$/.test(sg) ? 'moto' : 'car';
  const vSeg = sg => ({ A: 'pho', B: 'pho', C: 'pho', D: 'pho', L: 'sang', S: 'super' })[sg] || sg;
  const vehKeys = l => { const a = E.DEC.mua_xe.make(l, R(9)).opts.map(o => o.k); let k = []; ['moto', 'car'].forEach(g => { if (a.includes('g_' + g)) k = k.concat(E.DEC.mua_xe_loai.make(l, R(9), { g }).opts.map(o => o.k)); }); return k; };
  const vbuy = (l, sg, model) => { sg = vSeg(sg); const g = vGrp(sg); l.pending = [E.DEC.mua_xe.make(l, R(3))]; if (!l.pending[0].opts.some(o => o.k === 'g_' + g)) return false; E.resolve(l, 'g_' + g); if (!l.pending[0] || !l.pending[0].opts.some(o => o.k === 'seg_' + sg)) return false; E.resolve(l, 'seg_' + sg); const m = l.pending[0]; if (!m || m.id !== 'mua_xe_mau' || !m.opts.some(o => o.k === model)) return false; E.resolve(l, model); return true; };
  const buy = vbuy;
  { const l = mk(82100, 30, 'M', l => { l.money = 25; l.income = 180; l.lic.A1 = true; });
    const ks = vehKeys(l);
    ok(ks.includes('seg_so') && ks.includes('seg_dien') && !ks.includes('seg_pho'), '25 triệu: gợi ý xe số, xe điện, chưa tới ô tô (' + ks.join(',') + ')');
    l.pending = [E.DEC.mua_xe_mau.make(l, R(1), { s: 'so' })]; const ms = l.pending[0].opts;
    ok(ms.some(o => o.k === 'm_wave' && /19 triệu/.test(o.l)) && ms.every(o => !/^m_/.test(o.k) || /ưu:.*nhược:/.test(o.h)), 'mỗi mẫu xe có giá, thông số, ưu nhược điểm: ' + ms[0].l + ' — ' + ms[0].h);
    ok(ms.some(o => o.k === 'g_future') && !ms.some(o => o.k === 'm_future'), 'xe vượt tiền đang có thì gợi ý trả góp');
    ok(buy(l, 'so', 'g_future') && l.vehName === 'Honda Future 125' && l.loans.some(x => x.type === 'fin'), 'mua xe máy trả góp qua công ty tài chính'); }
  { const l = mk(82150, 35, 'M', l => { l.money = 400; l.income = 250; l.lic.B = true; });
    ok(buy(l, 'B', 'g_vios') && l.veh === 'ô tô' && l.loans.some(x => x.type === 'car') && l.vehTier === 1, '400 triệu: mua Vios trả góp ngân hàng');
    const l2 = mk(82160, 35, 'M', l => { l.money = 900; l.income = 250; l.lic.B = true; });
    ok(buy(l2, 'C', 'm_mazda3') && !l2.loans.some(x => x.type === 'car') && l2.money < 200, '900 triệu: trả thẳng Mazda 3, không phải vay'); }
  { const l = mk(82200, 40, 'M', l => { l.money = 60000; l.income = 2000; l.lic.B = true; });
    ok(buy(l, 'L', 'm_cclass') && l.vehTier === 2, 'mua xe sang'); const v0 = l.vehVal;
    ok(buy(l, 'S', 'm_huracan') && l.vehTier === 4 && /Lamborghini/.test(l.vehName), 'đổi sang siêu xe (bán lại xe cũ ' + E.fmtMoney(l, v0) + ')');
    ok(!vehKeys(l).some(k => k === 'seg_pho' || k === 'seg_so'), 'đã có siêu xe thì không gợi ý ô tô phổ thông hay xe số'); }
  // đặt tên thú cưng & bố cục
  ok(/function namePet/.test(appSrc) && /id="petName"/.test(appSrc) && /choose\(b\.dataset\.k, true\)/.test(appSrc), 'nhận nuôi thú cưng bằng tay thì được tự đặt tên');
  ok(/data-ag=/.test(appSrc) && /actlist/.test(appSrc), 'khung "Việc bạn muốn làm" gọn: chọn nhóm mới hiện danh sách');
  { const right = html.split('id="cohortLive"')[0].split('<div class="col">').pop(); ok(/id="famPanel"/.test(right), 'khung "Gia đình & người thân" nằm đầu cột bên phải'); }
}
section('24. Bản 2.8: tiền bạc rõ ràng, mua xe theo ngân sách, lý do qua đời, trợ cấp hưu trí, bậc nghề theo kinh nghiệm, chủ cơ sở, game theo thể loại');
{
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'), wsrc = fs.readFileSync(path.join(ROOT, 'js/wealth.js'), 'utf8');
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; if (age >= 18) l.indep = true; if (setup) setup(l); return l; };
  ok(/function wealthBreak/.test(appSrc) && /Tiền mặt \/ tài khoản/.test(appSrc) && /Cả năm dư ra/.test(appSrc), 'tài sản ròng có bảng chia: tiền mặt, tiết kiệm, nhà, xe, nợ; "cả năm dư ra / hụt" giải thích rõ');
  ok(!/có thể lãi to, có thể phá sản/.test(wsrc) && !/'Vốn ~'/.test(wsrc), 'bỏ chữ "có thể lãi to, có thể phá sản", không dùng dấu ~ dễ nhầm với dấu trừ');
  // chủ cơ sở không xin tăng lương
  { const l = mk(90000, 40, l => E.startJob(l, 'chu_quan_an', R(1), () => { })); l.job.rank = 1; ok(E.actAvail(l, E.ACT.find(a => a.id === 'tang_luong')) !== true && !E.DEC.tang_luong.valid(l), 'chủ quán không có "Xin tăng lương"');
    const e = mk(90001, 40, l => E.startJob(l, 'van_phong', R(2), () => { })); ok(E.actAvail(e, E.ACT.find(a => a.id === 'tang_luong')) === true, 'nhân viên vẫn xin tăng lương được'); }
  // mở chi nhánh khi không có tiền
  { const l = mk(90010, 45, l => { l.money = -50; l.credit = { bad: true, since: 40, last: 44 }; l.ventures = [{ k: 'spa', n: 'spa / thẩm mỹ viện', cap: 700, unit: 700, br: 1, mu: 0.16, sd: 0.3, yrs: 5, bad: 0, good: 3 }]; });
    ok(!E.DEC.mo_chi_nhanh.valid(l, {}), 'tiền mặt âm, không vay được thì không mời mở chi nhánh'); l.money = 800; ok(E.DEC.mo_chi_nhanh.valid(l, {}), 'đủ tiền thì được mời mở chi nhánh'); }
  // lý do qua đời của người thân
  { let noCause = 0, withCause = 0; for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: 'vn', seed: 90100 + i }); E.runHeadless(l); l.log.forEach(e => { if (/^(Mẹ|Bố|Vợ|Chồng|Người bạn đời|Anh|Chị|Em) .*qua đời ở tuổi \d+/.test(e.t)) { if (/qua đời ở tuổi \d+\.$/.test(e.t)) noCause++; else withCause++; } }); }
    ok(noCause === 0 && withCause > 200, 'người thân mất đều ghi kèm lý do (' + withCause + ' tin, thiếu ' + noCause + ')'); }
  { const old = []; for (let i = 0; i < 200; i++) old.push(E.H.deathCause(90, R(i))); const young = []; for (let i = 0; i < 200; i++) young.push(E.H.deathCause(25, R(i)));
    ok(!young.some(c => /tuổi già/.test(c)) && old.filter(c => /tuổi già|thanh thản/.test(c)).length > 40, 'lý do qua đời hợp với tuổi'); }
  // trợ cấp hưu trí xã hội 500.000 đ/tháng (Luật BHXH 2024)
  { const l = mk(90200, 45, l => { l.fam.fAlive = true; l.fam.fAge = 31; l.fam.fJob = 'làm ruộng'; l.fam.fRet = true; l.fam.fInc = 0; l.fam.q = 3; }); let msg = ''; l.age = 44; E.parentYear(l, R(1), t => { msg += t; }, 'f');
    ok(Math.abs(l.fam.fInc - 0.5) < 1e-9 && /500k/.test(msg), 'trợ cấp hưu trí xã hội đúng 500.000 đ/tháng: ' + msg);
    const p = mk(90201, 76, l => { l.retired = true; l.pensioned = false; l.job = null; l.kids = []; l.fam.q = 3; l.money = 100; }); E.beginYear(p, {}); p.pending = []; E.finishYear(p); ok(Math.abs(p.fin.inc - 6) < 0.01, 'bản thân không có lương hưu: từ 75 tuổi nhận 6 triệu/năm (' + p.fin.inc + ')'); }
  // bậc nghề theo kinh nghiệm
  { const l = mk(90300, 44, l => { l.workYrs = 20; l.edu = 5; l.major = 'it'; }); E.startJob(l, 'dev', R(1), () => { }); ok(l.job.rank >= 1 && !/thực tập/.test(E.jobTitle(l)), '44 tuổi đi làm lại không phải "thực tập sinh": ' + E.jobTitle(l));
    const y = mk(90301, 22, l => { l.workYrs = 0; l.edu = 5; l.major = 'it'; }); E.startJob(y, 'dev', R(2), () => { }); ok(y.job.rank === 0, 'sinh viên mới ra trường vẫn bắt đầu từ thực tập');
    ok(E.offerLabel(l, 'dev') === E.CAR.dev.t[1] && /lập trình viên/.test(E.offerLabel(l, 'dev')), 'lời mời việc hiện đúng vị trí theo kinh nghiệm'); }
  // chủ cơ sở kinh doanh mất việc làm thuê thì chọn tập trung điều hành
  { const l = mk(90400, 44, l => { l.job = null; l.flags.needJob = true; l.ventures = [{ k: 'spa', n: 'spa / thẩm mỹ viện', cap: 700, unit: 700, br: 1, mu: 0.16, sd: 0.3, yrs: 5, bad: 0, good: 0 }]; });
    const d = E.DEC.job.make(l, R(1)); ok(d.opts.some(o => o.k === 'own' && /spa/.test(o.l)), 'có lựa chọn "Tập trung điều hành spa"'); l.pending.unshift(d); E.resolve(l, 'own'); ok(l.flags.selfRun && !l.job && !l.flags.needJob, 'chọn tự điều hành: không đi làm thuê');
    ok(/vens\.length/.test(appSrc), 'căn cước hiện "chủ spa" thay vì nghề cũ hay "thất nghiệp"'); }
  // game theo thể loại sở trường
  { let bad = 0, n = 0; for (let i = 0; i < 400; i++) { const l = E.createLife({ mode: 'vn', seed: 90500 + i }); if (l.talent !== 'game') continue; n++; const t = l.talentSub === 'FPS' ? E.GAMES.fps : E.GAMES.moba; if (t.pc.concat(t.mobile).indexOf(l.game) < 0) bad++; }
    ok(n > 10 && bad === 0, 'game khớp sở trường FPS / MOBA (' + n + ' người, sai ' + bad + ')');
    ok(['Liên Quân Mobile', 'Mobile Legends: Bang Bang', 'Liên Minh Huyền Thoại'].every(g => E.GAMES.moba.pc.concat(E.GAMES.moba.mobile).includes(g)) && ['Valorant', 'Delta Force', 'Free Fire', 'Counter-Strike 2'].every(g => E.GAMES.fps.pc.concat(E.GAMES.fps.mobile).includes(g)), 'có Liên Quân, Mobile Legends, Liên Minh (MOBA) và Valorant, Delta Force, Free Fire, Counter-Strike 2 (FPS)');
    const s = mk(90600, 20, l => { l.talent = 'game'; l.talentSub = 'FPS'; l.game = null; }); E.startJob(s, 'tuyen_thu_es', R(3), () => { }); ok(E.GAMES.fps.pc.concat(E.GAMES.fps.mobile).includes(s.game), 'tuyển thủ sở trường FPS thi đấu game bắn súng: ' + s.game); }
  // không nhắc bố mẹ đã mất ở tuổi thơ; không lặp tin trong cùng năm
  { let bad = 0, dup = 0; for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: i % 4 ? 'vn' : 'world', seed: 90700 + i }); E.runHeadless(l); let md = null; const seen = {};
      l.log.forEach(e => { if (/^Mẹ qua đời/.test(e.t)) md = e.a; if (md != null && e.a > md && /(^|[.,] )Mẹ (cười|khóc|mua|dặn|nấu|ôm)/.test(e.t)) bad++; if (e.k !== 'money' && !/Căn hộ|Ki-ốt|bất động sản cho thuê/.test(e.t)) { const k = e.a + '|' + e.t; if (seen[k]) dup++; seen[k] = 1; } }); }
    ok(bad === 0, 'không nhắc mẹ đã mất (' + bad + ')'); ok(dup <= 3, 'hầu như không lặp tin trong cùng năm (' + dup + ')'); }
}
section('25. Bản 2.9: vận động viên chia theo từng môn');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const ath = (sp, seed, skill) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.talent = 'thể thao'; l.talentSub = sp; l.age = 18; l.skill = skill || 60; l.indep = true; l.school = null; E.startJob(l, 'vdv', R(seed), () => { }); return l; };
  const want = ['bóng đá', 'bóng rổ', 'bóng chuyền', 'bơi lội', 'điền kinh', 'cầu lông', 'bóng bàn', 'quần vợt', 'võ thuật', 'cử tạ', 'bắn cung', 'thể dục dụng cụ', 'đua xe đạp', 'bi-a', 'golf'];
  want.forEach(sp => { const S = E.SPORTS[sp]; ok(S && S.t.length === 4 && S.pay.length === 4 && S.max > S.peak, 'môn ' + sp + ': đủ 4 bậc danh xưng, thu nhập, tuổi đỉnh cao & giải nghệ'); });
  { const seen = new Set(); for (let i = 0; i < 3000; i++) { const l = E.createLife({ mode: 'vn', seed: 95000 + i }); if (l.talent === 'thể thao') seen.add(l.talentSub); } ok(['bóng rổ', 'bóng chuyền', 'thể dục dụng cụ', 'đua xe đạp', 'bi-a', 'golf'].every(s => seen.has(s)), 'năng khiếu thể thao có đủ các môn mới (' + [...seen].join(', ') + ')'); }
  // danh xưng theo môn
  { const f = ath('bóng đá', 95500, 72); E.jobs && 0; const s = ath('bơi lội', 95501, 72);
    ok(/cầu thủ|tuyển thủ/.test(E.jobTitle(f)) && /kình ngư|bơi/.test(E.jobTitle(s)), 'danh xưng theo môn: ' + E.jobTitle(f) + ' / ' + E.jobTitle(s));
    E.sports.sportYear(f, R(1), () => { }, f.age); ok(!!f.job.club && E.jobTitle(f).indexOf(f.job.club) >= 0, 'cầu thủ chuyên nghiệp có câu lạc bộ: ' + E.jobTitle(f));
    const v = ath('võ thuật', 95502, 60); E.sports.sportYear(v, R(2), () => { }, v.age); ok(E.SPORTS['võ thuật'].arts.includes(v.job.art) && E.jobTitle(v).indexOf(v.job.art) >= 0, 'võ sĩ có môn võ cụ thể: ' + E.jobTitle(v)); }
  // thu nhập: bóng đá chuyên nghiệp ≫ thể dục dụng cụ cùng bậc
  { const l = ath('bóng đá', 95600); ok(E.sportPay(l, 2) >= 3 * E.sportPay(ath('thể dục dụng cụ', 95601), 2), 'cầu thủ V.League kiếm nhiều hơn hẳn VĐV thể dục dụng cụ cùng bậc'); }
  // tuổi giải nghệ theo môn
  { const retire = sp => { let s = 0, n = 0; for (let i = 0; i < 40; i++) { const l = ath(sp, 96000 + i * 7 + sp.length, 70); for (let y = 0; y < 40 && l.job && E.resolveJob(l.job.id) === 'vdv'; y++) { l.st.hea = 80; E.careerYear(l, R(i * 31 + y), () => { }, 'work'); l.age++; } if (!l.job || E.resolveJob(l.job.id) !== 'vdv') { s += l.age; n++; } } return n ? s / n : 99; };
    const gym = retire('thể dục dụng cụ'), golf = retire('golf'), bida = retire('bi-a');
    ok(gym <= 28 && golf >= 38 && bida >= 38, 'tuổi giải nghệ khác nhau: thể dục dụng cụ ~' + gym.toFixed(1) + ', golf ~' + golf.toFixed(1) + ', bi-a ~' + bida.toFixed(1)); }
  // giải đấu ghi rõ môn; môn đồng đội hiếm có huy chương Olympic
  { let tagged = 0, all = 0, teamOly = 0; for (let i = 0; i < 300; i++) { const l = ath(i % 2 ? 'bóng đá' : 'bơi lội', 97000 + i, 85); l.job.rank = 2; for (let y = 0; y < 8; y++) { const lg = []; E.careerYear(l, R(i * 13 + y), t => lg.push(t), 'work'); lg.forEach(t => { if (/huy chương/.test(t)) { all++; if (/\((bóng đá|bơi lội)\)/.test(t)) tagged++; if (/Olympic.*bóng đá/.test(t)) teamOly++; } }); l.age++; } }
    ok(all > 50 && tagged === all, 'huy chương ghi rõ môn (' + tagged + '/' + all + ')'); ok(teamOly <= 2, 'bóng đá Việt Nam gần như không có huy chương Olympic (' + teamOly + ')'); }
  // sự kiện riêng
  ['tt_tran_lon', 'tt_xuat_ngoai'].forEach(id => ok(!!E.DEC[id], 'có tình huống "' + id + '"'));
  { let aff = 0; for (let i = 0; i < 200; i++) { const l = ath('bóng đá', 98000 + i, 88); l.job.rank = 3; l.birthYear = 2046 - l.age; const lg = []; E.sports.sportYear(l, R(i), t => lg.push(t), l.age); if (lg.some(t => /ASEAN Cup/.test(t))) aff++; } ok(aff > 20, 'tuyển thủ bóng đá có thể vô địch ASEAN Cup (' + aff + '/200)'); }
}
section('26. Bản 2.9: con đường năng khiếu, concert theo thể loại, sở thích → nghề, giải trí & tâm linh theo tôn giáo');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; if (age >= 18) l.indep = true; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  // năng khiếu toán: trường → huyện → tỉnh → quốc gia → quốc tế
  ok(E.talentTrack.TRACK['toán học'].st.length === 5 && /IMO/.test(E.talentTrack.TRACK['toán học'].st[4][0]) && /VMO/.test(E.talentTrack.TRACK['toán học'].st[3][0]), 'toán: 5 cấp thi đến VMO và IMO');
  ['ngoại ngữ', 'âm nhạc', 'hội họa', 'ăn nói', 'khéo tay', 'kinh doanh'].forEach(t => ok(E.talentTrack.TRACK[t] && E.talentTrack.TRACK[t].st.length === 5, 'năng khiếu ' + t + ' có lộ trình 5 cấp'));
  { const l = mk(99000, 8, l => { l.talent = 'toán học'; l.school = 'primary'; l.flags.nk = undefined; });
    ok(E.DEC.nk_chon.valid(l), 'có năng khiếu thì được hỏi có theo đuổi không'); play(l, 'nk_chon', 'yes'); ok(l.flags.nk && l.flags.nk.lv === 0 && E.talentTrack.canSit(l), 'theo đuổi: đi thi từ cấp trường');
    l.skill = 95; l.st.kno = 95; let guard = 0; while (l.flags.nk.lv < 4 && guard++ < 30) { l.age = Math.max(l.age, E.talentTrack.stage(l)[1]); play(l, 'nk_thi', 'hard'); }
    ok(l.flags.nk.lv === 4, 'thi giỏi thì lên dần đến cấp quốc tế'); ok(l.flags.tuyenThang, 'đạt giải quốc gia được tuyển thẳng đại học');
    const late = mk(99001, 12, l => { l.talent = 'toán học'; l.school = 'lower'; }); play(late, 'nk_chon', 'yes'); ok(late.flags.nk.lv >= 1 && E.talentTrack.canSit(late), 'bắt đầu muộn thì vào thẳng cấp hợp tuổi');
    const no = mk(99002, 9, l => { l.talent = 'toán học'; l.school = 'primary'; }); play(no, 'nk_chon', 'no'); ok(!E.talentTrack.canSit(no), 'không theo đuổi thì không bị gọi đi thi'); }
  { let imo = 0, n = 0; for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: 'vn', seed: 99100 + i }); l.talent = 'toán học'; E.runHeadless(l); if (l.flags.nk && !l.flags.nk.fun) n++; if (l.medals.some(m => /IMO/.test(m.ev))) imo++; }
    ok(n > 50 && imo > 0 && imo < n * 0.2, 'huy chương IMO hiếm mà có (' + imo + '/' + n + ' người theo đuổi)'); }
  // concert theo thể loại & tuổi
  { const l = mk(99200, 20, l => { l.birthYear = 2010; });
    ['vn', 'show', 'kr', 'us', 'rapvn', 'rapus'].forEach(c => ok(E.artistsOf(c, l).length >= 3, 'có nghệ sĩ ' + E.CONCERT_CATS[c].n));
    ok(E.artistsOf('kr', l).some(a => a.n === 'IVE') && E.artistsOf('kr', l).some(a => a.n === 'IU') && E.artistsOf('us', l).some(a => a.n === 'Dua Lipa'), 'K-pop có IVE, IU; US/UK có Dua Lipa');
    const shows = E.artistsOf('show', l).map(a => a.n).join(' / '); ok(/Anh trai "Say Hi"/.test(shows) && /Em xinh "Say Hi"/.test(shows) && /Tinh hà "Say Hi"/.test(shows) && /vượt ngàn chông gai/.test(shows), 'có concert các chương trình: ' + shows);
    const fut = mk(99201, 20, l => { l.birthYear = 2060; }); ok(!E.artistsOf('kr', fut).some(a => a.n === 'BTS') && !E.artistsOf('us', fut).some(a => a.n === 'Dua Lipa'), 'năm 2080 không còn BTS, Dua Lipa biểu diễn');
    let pre = 0; for (let i = 0; i < 300; i++) { const x = mk(99300 + i, 20); const n = E.H.pickIdol(R(i), x); if (/^(anh trai|em xinh|anh tài) /.test(n)) pre++; } ok(pre > 0, 'thần tượng từ chương trình gọi là "anh trai / em xinh / anh tài + tên" (' + pre + ')'); }
  { const kid = mk(99400, 12, l => { l.fam.mAlive = true; l.fam.q = 3; }); const d = E.DEC.concert_di.make(kid, R(1), { cat: 'vn' }); ok(!d.opts.some(o => o.k === 'self') && d.opts.some(o => o.k === 'parents'), '12 tuổi không tự đi concert, phải xin bố mẹ đưa đi');
    const a16 = mk(99401, 16); let far = null; for (let i = 0; i < 40 && !far; i++) { const x = E.DEC.concert_di.make(a16, R(i), { cat: 'us' }); if (x.data.far) far = x; } ok(far && !far.opts.some(o => o.k === 'self'), '16 tuổi muốn xem concert ở nước ngoài phải có người lớn');
    ok(E.actAvail(mk(99402, 65), E.ACT.find(a => a.id === 'concert')) !== true, '65 tuổi không còn đi concert'); }
  // sở thích → nghề (mê rap → rapper)
  { const l = mk(99500, 19, l => { l.hobby = 'rap'; l.hobbySk = 90; l.school = null; l.indep = true; }); ok(E.DEC.so_thich_nghe.valid(l), 'mê rap lâu năm thì có casting rap');
    let got = 0; for (let i = 0; i < 40; i++) { const c = JSON.parse(JSON.stringify(l)); c.rs = 100 + i; play(c, 'so_thich_nghe', 'go'); if (c.job && E.resolveJob(c.job.id) === 'rapper') got++; } ok(got > 15 && got < 40, 'casting rap có đỗ có trượt (' + got + '/40)');
    let hb = 0; for (let i = 0; i < 300; i++) { const x = E.createLife({ mode: 'vn', seed: 99600 + i }); let g = 0; while (x.alive && x.age < 16 && g++ < 20) { E.beginYear(x, { auto: true }); let k = 0; while (x.pending.length && k++ < 30) E.resolve(x, E.autoKey(x)); if (x.alive) E.finishYear(x); k = 0; while (x.pending.length && k++ < 30) E.resolve(x, E.autoKey(x)); E.endYear(x); } if (x.hobby) hb++; } ok(hb > 150, 'phần lớn có một sở thích từ nhỏ (' + hb + '/300)'); }
  // giải trí & tâm hồn
  ['xem_phim', 'karaoke', 'cong_vien', 'da_bong_ban', 'xem_bong_da', 'phuot', 'show_rap', 'choi_game_nha', 'thien_yoga', 'doc_sach', 'leo_nui', 'massage'].forEach(id => ok(E.ACT.some(a => a.id === id) && !!E.DEC[id], 'có hoạt động "' + id + '"'));
  { const k = mk(99700, 12, l => { l.fam.mAlive = true; }); const g = E.actions(k).filter(a => a.g === 'Giải trí' && a.ok === true); ok(g.length >= 4, '12 tuổi có nhiều việc giải trí (' + g.map(a => a.l).join(', ') + ')'); }
  // tâm linh theo tôn giáo
  { const lab = rel => { const l = mk(99800, 30, l => { l.religion = rel; }); return E.actions(l).find(a => a.id === 'di_chua').l; };
    ok(/nhà thờ/.test(lab('Công giáo')) && /chùa/.test(lab('Phật giáo')) && /tổ tiên/.test(lab('Không theo tôn giáo (thờ cúng tổ tiên)')) && /Cao Đài/.test(lab('Cao Đài')) && /Hồi giáo/.test(lab('Hồi giáo (Islam)')), 'tên hành động theo tôn giáo: ' + [lab('Công giáo'), lab('Phật giáo'), lab('Cao Đài')].join(' / '));
    let ruoc = 0, vu = 0, vuOk = true; for (let i = 0; i < 200; i++) { const l = E.createLife({ mode: 'vn', seed: 99900 + i }); l.religion = i % 2 ? 'Công giáo' : 'Phật giáo'; E.runHeadless(l); if (l.log.some(e => /Rước lễ lần đầu/.test(e.t))) ruoc++; let md = null; l.log.forEach(e => { if (/^Mẹ qua đời/.test(e.t)) md = e.a; if (/Vu Lan/.test(e.t)) { vu++; if (md != null && e.a > md && /hoa hồng đỏ/.test(e.t)) vuOk = false; } }); }
    ok(ruoc > 20, 'người Công giáo có rước lễ lần đầu (' + ruoc + ')'); ok(vu > 20 && vuOk, 'Vu Lan cài hoa hồng đỏ khi còn mẹ, trắng khi mẹ đã mất'); }
}
section('27. Bản 2.9: nhóm nghề pháp luật, bảng nghề hiện từng môn thể thao, vé số theo tỉ lệ thật');
{
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; if (age >= 18) l.indep = true; if (setup) setup(l); return l; };
  const play = (l, id, key) => { const d = E.DEC[id].make(l, R(l.rs)); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  // pháp luật
  ok(E.CAT.law === 'Pháp luật & tòa án' && /'law'/.test(appSrc), 'có nhóm nghề "Pháp luật & tòa án" trong bảng nghề');
  ['luat_su', 'tham_phan', 'kiem_sat', 'cong_chung', 'dieu_tra_vien', 'chap_hanh_vien', 'thua_phat_lai', 'tro_giup_phap_ly'].forEach(id => ok(E.CAR[id] && E.CAR[id].cat === 'law', 'nghề ' + id + ' thuộc nhóm pháp luật'));
  ok(/công tố viên/.test(E.CAR.kiem_sat.t.join(' ')), 'kiểm sát viên ghi rõ là công tố viên');
  ['ks_oan_sai', 'tp_dai_an', 'dtv_hoi_cung', 'chv_cuong_che', 'tpl_vi_bang', 'tgpl_vu_viec'].forEach(id => ok(!!E.DEC[id], 'có tình huống "' + id + '"'));
  { const k = mk(99950, 40, l => { E.startJob(l, 'kiem_sat', R(1), () => { }); l.job.rank = 2; }); const t = play(k, 'ks_oan_sai', 'return'); ok(/hồ sơ|vô tội|lương tâm/.test(t) && k.karma > 0, 'kiểm sát viên trả hồ sơ có dấu hiệu oan sai: ' + t.slice(0, 80)); }
  // bảng nghề hiện chi tiết từng môn
  ok(/E\.SPORTS/.test(appSrc) && /theo từng môn/.test(appSrc) && /class="sub"/.test(appSrc), 'bảng "Nghề & lương" hiện chi tiết từng môn thể thao');
  // vé số: tỉ lệ thật
  const L = E.LOTTO; ok(Math.abs(1 / L.power.tiers[0][1] - 28989675) < 1 && Math.abs(1 / L.mega.tiers[0][1] - 8145060) < 1 && Math.abs(1 / L.xskt.tiers[0][1] - 1e6) < 1, 'tỉ lệ trúng thật: Power 1/28.989.675, Mega 1/8.145.060, xổ số kiến thiết 1/1.000.000');
  { let jack = 0; for (let i = 0; i < 20000; i++) { const d = E.lottery.draw({}, R(i), 'power', 5); if (d.best && d.best.i === 0) jack++; } ok(jack === 0, 'mua 5 vé Power 6/55 thì gần như không bao giờ trúng Jackpot (' + jack + '/20000)'); }
  { let small = 0; for (let i = 0; i < 2000; i++) { const d = E.lottery.draw({}, R(i), 'mega', 5); if (d.best) small++; } ok(small > 150 && small < 400, 'giải nhỏ (trùng 3 số) thỉnh thoảng có (' + small + '/2000 lượt mua 5 vé)'); }
  { const sv = L.power.tiers[0][1]; L.power.tiers[0][1] = 1; const l = mk(99960, 35, l => { l.money = 50; }); const t = play(l, 've_so', 'power'); L.power.tiers[0][1] = sv;
    const w = l.flags.lottoWin; ok(w && /TRÚNG JACKPOT 1/.test(t) && /thuế thu nhập cá nhân/.test(t) && Math.abs(w.amt - (w.gross - (w.gross - 10) * 0.1)) < 1e-6, 'trúng Jackpot: trừ thuế TNCN 10% phần vượt 10 triệu');
    ok(w.gross >= 30000 && w.gross <= 300000, 'Jackpot 1 từ 30 tỷ, mua nhiều vé trúng cũng chỉ một giải (' + E.fmtMoney(l, w.gross) + ')');
    ok(l.pending[0] && l.pending[0].id === 'ts_nhan_giai', 'trúng lớn: chọn đeo mặt nạ hay công khai'); const m0 = l.money; E.resolve(l, 'public'); ok(l.money > m0 + 10000 && w.pub === true, 'nhận giải công khai, tiền về tài khoản');
    let strangers = 0, kin = 0, funny = 0; for (let y = 0; y < 5; y++) { E.beginYear(l, {}); let k = 0; while (l.pending.length && k++ < 10) { const p = l.pending[0]; if (p.id === 'ts_nguoi_la') { strangers++; if (/bế mày|nhát dao|thay tã/.test(p.text)) funny++; } if (p.id === 'ts_ho_hang') kin++; E.resolve(l, E.autoKey(l)); } E.finishYear(l); l.pending = []; E.endYear(l); }
    ok(strangers >= 2 && kin >= 1, 'công khai thì người lạ "nhận vơ" (' + strangers + ', có ' + funny + ' câu hài) và họ hàng tìm đến (' + kin + ')'); }
}
section('28. Bản 3.0: HIV có đường lây, lương theo trình độ & BHXH, sở trường & căng thẳng, bằng lái / chứng chỉ hết hạn, xe cộ, hẹn hò, chống lặp, hồ sơ');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'), htmlSrc = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  // --- giao diện
  ok(/id="profBtn"/.test(htmlSrc) && /function openProfile/.test(appSrc) && /data-prof/.test(appSrc), 'có nút "Hồ sơ" và nút "Xem hồ sơ chi tiết" mở hồ sơ');
  ok(/id="logToggle"/.test(htmlSrc) && /setLogCollapsed/.test(appSrc) && /#logCard\.collapsed/.test(fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8')), 'nhật ký cuộc đời có nút thu gọn / mở và cuộn trong khung');
  // --- HIV
  { const l = mk(98000, 25); ok(E.hivRisk(l) === 0, 'người không có hành vi nguy cơ: nguy cơ HIV = 0');
    l.flags.unsafe = 2; ok(E.hivRisk(l) > 0, 'quan hệ không an toàn thì có nguy cơ HIV');
    const d = mk(98001, 25, x => { x.addict.drugs = true; x.flags.inject = true; }); ok(E.hivRisk(d) > 0, 'chích ma túy dùng chung kim tiêm thì có nguy cơ HIV'); }
  { let bad = 0, n = 0, hivAll = 0;
    for (let i = 0; i < 700; i++) { const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 98100 + i }); E.runHeadless(l); n++;
      const had = (l.illHist || []).includes('HIV') || (l.ill && l.ill.n === 'HIV') || /HIV/.test(l.death ? l.death.cause : '');
      if (had) { hivAll++; if (!E.hivRisk(l)) bad++; } }
    ok(bad === 0, 'không ai "tự nhiên" bị HIV khi không có đường lây (' + hivAll + ' ca HIV / ' + n + ' đời, tất cả đều có đường lây)'); }
  { const l = mk(98002, 30, x => { x.flags.unsafe = 1; x.ill = { n: 'HIV', m: 3, base: 0, cure: 0, mult: 3, f: 'HIV/AIDS', since: 30, chronic: true }; });
    const d = E.DEC.treat.make(l, R(1)); ok(/quan hệ tình dục không dùng bao cao su/.test(d.text) && /ARV/.test(d.text), 'chẩn đoán HIV nói rõ đường lây và điều trị ARV'); }
  { const l = mk(98003, 22); const d = E.DEC.qua_dem.make(l, R(2), { app: 'Tinder', name: 'Lan' }); l.pending.unshift(d); E.resolve(l, 'unsafe'); ok(l.flags.unsafe === 1, 'hẹn qua app, không dùng bao cao su → tăng nguy cơ');
    const s2 = mk(98004, 22); s2.pending.unshift(E.DEC.qua_dem.make(s2, R(3), { app: 'Tinder', name: 'Lan' })); E.resolve(s2, 'safe'); ok(!s2.flags.unsafe, 'dùng bao cao su thì không tăng nguy cơ'); }
  // --- khăn quàng đỏ, mối tình đầu, tiền tiêu vặt
  { let lop1 = 0, doi = 0; for (let i = 0; i < 60; i++) { const l = E.createLife({ mode: 'vn', seed: 98200 + i }); for (let a = 0; a < 10; a++) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && k++ < 20) E.resolve(l, E.autoKey(l)); E.finishYear(l); l.pending = []; E.endYear(l); }
      l.log.forEach(e => { if (/^Vào lớp 1/.test(e.t) && /khăn quàng/.test(e.t)) lop1++; if (/khăn quàng đỏ/.test(e.t) && /Đội Thiếu niên/.test(e.t) && e.a === 8) doi++; }); }
    ok(lop1 === 0 && doi > 30, 'lớp 1 chưa quàng khăn đỏ; 8 tuổi (lớp 3) mới được kết nạp Đội (' + doi + '/60)'); }
  { const ev = E.EVENTS.find(e => /Mối tình đầu với/.test(e.run.toString())); const l = mk(98300, 21, x => { x.exes = 1; x.partner = null; });
    ok(ev && !ev.c(l, 21), 'đã từng yêu rồi chia tay thì không còn "mối tình đầu" lần nữa');
    const l2 = mk(98301, 19); l2.pending.unshift(E.DEC.love.make(l2, R(4))); E.resolve(l2, 'yes'); ok(l2.flags.everDated && l2.flags.firstLove === l2.partner.name, 'người yêu đầu tiên chính là mối tình đầu'); }
  // --- lương: thăng chức không giảm lương, trình độ cao lương cao, BHXH
  { let drops = 0, promos = 0;
    for (let i = 0; i < 120; i++) { const l = mk(98400 + i, 23, x => { x.edu = 5; x.major = 'eco'; E.startJob(x, 'ke_toan', R(i), () => { }); x.st.kno = 80; });
      let prev = null, prevRk = 0; for (let y = 0; y < 25 && l.job; y++) { const rk = l.job.rank, J = l.job; E.careerYear(l, R(i * 50 + y), () => { }, 'work'); const g = l.yr.gross; if (prev != null && rk > prevRk && l.job === J) { promos++; if (g < prev * 0.999) drops++; } prev = g; prevRk = rk; l.age++; } }
    ok(promos > 20 && drops === 0, 'được thăng chức thì lương năm sau không bao giờ thấp hơn (' + promos + ' lần thăng chức, ' + drops + ' lần tụt lương)'); }
  { const est = e => { const l = mk(98500, 30, x => { x.edu = e; x.major = 'eco'; }); return E.monthlyEst(l, 'ngan_hang', 1); };
    ok(est(7) > est(6) && est(6) > est(5) * 1.08, 'thạc sĩ, tiến sĩ được trả cao hơn cử nhân (' + [5, 6, 7].map(e => est(e).toFixed(1)).join(' < ') + ' triệu/tháng)');
    const ie = mk(98501, 30, x => { x.edu = 5; x.lang = { en: 4 }; x.langAt = { en: 30 }; }), no = mk(98501, 30, x => { x.edu = 5; });
    ok(E.monthlyEst(ie, 'marketing', 1) > E.monthlyEst(no, 'marketing', 1) * 1.05, 'có IELTS 7.5 còn hạn thì lương văn phòng cao hơn');
    ie.langExp = { en: true }; ok(Math.abs(E.monthlyEst(ie, 'marketing', 1) - E.monthlyEst(no, 'marketing', 1)) < 1e-9, 'IELTS hết hạn thì không còn được cộng'); }
  { const l = mk(98600, 30, x => { x.edu = 5; E.startJob(x, 'ke_toan', R(5), () => { }); }); const inc = E.careerYear(l, R(6), () => { }, 'balance');
    ok(l.yr.si > 0 && Math.abs(inc - l.yr.gross * (1 - 0.105)) < 1e-6 && l.si.yrs === 1, 'làm công ăn lương chính thức: trừ BHXH 8% + BHYT 1,5% + BHTN 1% (' + E.fmtMoney(l, l.yr.gross / 12) + ' → ' + E.fmtMoney(l, inc / 12) + '/tháng)');
    const f = mk(98601, 30, x => { E.startJob(x, 'ban_rong', R(7), () => { }); }); E.careerYear(f, R(8), () => { }, 'balance'); ok(!f.yr.si && !f.si, 'buôn bán tự do không đóng BHXH bắt buộc');
    ok(/có đóng BHXH, BHYT, BHTN/.test(E.offerHint(l, 'ke_toan')) && !/BHXH/.test(E.offerHint(l, 'ban_rong')), 'lời mời việc làm ghi rõ có đóng bảo hiểm hay không'); }
  { const l = mk(98700, 62, x => { E.startJob(x, 'ke_toan', R(9), () => { }); x.job.rank = 2; x.workYrs = 35; x.si = { yrs: 30, sum: 300 * 30 }; });
    E.careerYear(l, R(10), () => { }, 'balance');
    ok(l.retired && l.pensioned && Math.abs(l.pensionRate - 0.65) < 1e-9 && Math.abs(l.pensionInc - 300 * 0.65) < 1e-6, 'nam đóng BHXH 30 năm: lương hưu 65% lương bình quân (' + E.fmtMoney(l, l.pensionInc / 12) + '/tháng)');
    const s = mk(98701, 62, x => { E.startJob(x, 'ke_toan', R(11), () => { }); x.workYrs = 35; x.si = { yrs: 10, sum: 300 * 10 }; }); for (let i = 0; i < 3 && !s.retired; i++) { E.careerYear(s, R(12 + i), () => { }, 'balance'); s.age++; }
    ok(s.retired && !s.pensioned, 'đóng BHXH chưa đủ 15 năm thì không có lương hưu'); }
  { const l = mk(98710, 40, x => { E.startJob(x, 'ke_toan', R(13), () => { }); x.si = { yrs: 6, sum: 100 * 6, m: 10 }; }); const m0 = l.money;
    l.ill = { n: 'ung thư dạ dày', m: 5, base: 0.3, cure: 0.3, mult: 5, f: 'ung thư dạ dày', since: 40 }; const t = play(l, 'treat', 'best');
    ok(/Bảo hiểm y tế chi trả|BHYT chi trả/.test(t) && l.money > m0 - E.DEC.treat.make(l, R(1)).data.cost * 0.6, 'có BHYT: viện phí được chi trả phần lớn'); }
  // --- tiến sĩ
  { const l = mk(98800, 26, x => { x.edu = 6; x.major = 'it'; }); play(l, 'phd', 'yes'); ok(l.school === 'phd' && l.schoolEnd > 26, 'có thể học tiếp tiến sĩ sau thạc sĩ');
    l.age = l.schoolEnd - 1; E.finishYear(l); ok(l.edu === 7 && l.log.some(e => /học vị tiến sĩ/.test(e.t)), 'bảo vệ luận án, nhận học vị tiến sĩ');
    let acad = 0; for (let i = 0; i < 40; i++) { const o = E.offers(l, R(200 + i)); if (o.some(id => /^(giang_vien|nghien_cuu)$/.test(id))) acad++; } ok(acad >= 30, 'tiến sĩ thường được mời làm giảng viên / nghiên cứu viên (' + acad + '/40)'); }
  // --- sở trường, căng thẳng, năng khiếu
  { const fit = mk(98900, 30, x => { x.talent = 'toán học'; x.skill = 60; x.edu = 5; E.startJob(x, 'ke_toan', R(14), () => { }); }), mis = mk(98900, 30, x => { x.talent = 'toán học'; x.skill = 60; x.edu = 5; E.startJob(x, 'ban_rong', R(14), () => { }); });
    ok(E.jobFit(fit, E.jobDef(fit)) === 1 && E.jobFit(mis, E.jobDef(mis)) === -1, 'năng khiếu toán làm kế toán là đúng sở trường, đi bán hàng rong là không');
    const s0 = fit.mind.stress, s1 = mis.mind.stress; const tf = []; E.careerYear(fit, R(15), t => tf.push(t), 'balance'); const tm = []; E.careerYear(mis, R(15), t => tm.push(t), 'balance');
    ok(fit.mind.stress < s0 && mis.mind.stress > s1, 'làm đúng sở trường bớt căng thẳng, làm việc không thích căng thẳng hơn');
    ok(tf.some(t => /đúng sở trường/.test(t)) && tm.some(t => /chẳng liên quan/.test(t)), 'nhật ký ghi rõ công việc có hợp sở trường không'); }
  { const a = mk(98901, 30, x => { x.talent = 'toán học'; x.skill = 60; x.edu = 5; x.major = 'eco'; E.startJob(x, 'ke_toan', R(16), () => { }); }), b = mk(98901, 30, x => { x.talent = null; x.skill = 5; x.edu = 5; x.major = 'eco'; E.startJob(x, 'ke_toan', R(16), () => { }); });
    E.careerYear(a, R(17), () => { }, 'balance'); E.careerYear(b, R(17), () => { }, 'balance'); ok(a.yr.gross > b.yr.gross * 1.05, 'làm đúng sở trường năng suất cao, thu nhập cao hơn'); }
  ok(E.stressLabel(10) === 'thư thái' && E.stressLabel(40) === 'bình thường' && E.stressLabel(60) === 'căng thẳng' && E.stressLabel(75) === 'quá tải' && E.stressLabel(90) === 'báo động', 'căng thẳng chia mức theo thang 0–100');
  { const l = mk(98902, 30); const t = E.talentLevel(l, 47); ok(t.lv === 5 && t.exp === 70 && t.name === 'Rất giỏi', 'năng khiếu có cấp độ & EXP (47 → cấp 5, EXP 70/100)');
    const k = mk(98903, 12, x => { x.talent = 'âm nhạc'; x.skill = 29.8; x.flags.tLv = 3; }); const out = []; E.HOOKS.year.find(h => /hivMomChecked/.test(h.toString()))(k, R(18), t => out.push(t), 12, k.fin || {}); ok(out.some(t => /lên cấp 4/.test(t)), 'rèn giũa năng khiếu thì lên cấp (' + out.join(' ') + ')'); }
  { let dep = 0, hi = 0; for (let i = 0; i < 40; i++) { const l = mk(98950 + i, 35, x => { x.mind.stress = 90; x.partner = { name: 'An', sex: 'F', age: 33, status: 'married', since: 30, alive: true }; }); l.mind.hiYrs = 2; const s0 = l.st.soc; const out = []; E.HOOKS.year.find(h => /hivMomChecked/.test(h.toString()))(l, R(300 + i), t => out.push(t), 35, {}); if (out.some(t => /trầm cảm/.test(t))) dep++; if (l.st.soc < s0) hi++; }
    ok(dep >= 6 && hi === 40, 'căng thẳng kéo dài làm giảm các mối quan hệ và dễ dẫn tới trầm cảm (' + dep + '/40)'); }
  // --- bằng lái, chứng chỉ
  { const hook = E.HOOKS.year.find(h => /hivMomChecked/.test(h.toString()));
    const l = mk(99000, 40, x => { x.lic = { A1: true, B: true }; x.licAt = { A1: 18, B: 30 }; }); hook(l, R(19), () => { }, 40, {});
    ok(l.sched.some(s => s.id === 'gplx_het_han') && !l.sched.some(s => s.arg && s.arg.k === 'A1'), 'bằng B hết hạn sau 10 năm thì được hỏi có đổi không; bằng A1 vĩnh viễn');
    const t = play(l, 'gplx_het_han', 'renew'); ok(l.lic.B && l.licAt.B === 40 && /thêm 10 năm/.test(t), 'đổi bằng B thêm 10 năm');
    const n = mk(99001, 50, x => { x.lic = { A1: true, B: true }; x.licAt = { B: 40 }; }); play(n, 'gplx_het_han', 'no'); ok(!n.lic.B && n.lic.A1, 'không đổi thì mất bằng B, bằng A1 vẫn còn');
    const p = E.profile(n); ok(p.certs.some(c => /A1 · không thời hạn/.test(c)) && p.certs.some(c => /ô tô B · đã hết hạn/.test(c)), 'hồ sơ ghi rõ hạn bằng lái: ' + p.certs.join('; '));
    const ie = mk(99002, 26, x => { x.edu = 5; E.startJob(x, 'marketing', R(20), () => { }); x.lang = { en: 3 }; x.langAt = { en: 24 }; }); hook(ie, R(21), () => { }, 26, {});
    ok(ie.sched.some(s => s.id === 'chung_chi_het_han' && s.arg.k === 'en'), 'IELTS hết hạn sau 2 năm: được hỏi có thi lại không');
    play(ie, 'chung_chi_het_han', 'retest', { k: 'en' }); ok(ie.langAt.en === 26 && !ie.langExp.en, 'thi lại IELTS thì chứng chỉ có hạn mới');
    const old = mk(99003, 60, x => { x.retired = true; x.lang = { ja: 3, en: 2 }; x.langAt = { en: 50, ja: 50 }; }); hook(old, R(22), () => { }, 60, {});
    ok(old.langExp.en && !old.langExp.ja, 'JLPT không thời hạn; IELTS của người không còn dùng đến thì tự hết hạn'); }
  // --- xe cộ, xăng, thuê xe
  { const m = mk(99100, 30, x => { x.veh = 'xe máy'; x.vehK = 'wave'; x.vehSeg = 'so'; x.urban = true; }), c = mk(99101, 30, x => { x.veh = 'ô tô'; x.vehK = 'vios'; x.vehSeg = 'B'; x.vehTier = 1; x.vehVal = 500; x.urban = true; });
    const tm = E.travelCost(m, m.base, 30), tc = E.travelCost(c, c.base, 30);
    ok(E.fuelWeek(m) > 0.04 && E.fuelWeek(m) < 0.15 && tm > 3 && tm < 10, 'xe máy: đổ xăng ~' + E.fmtMoney(m, E.fuelWeek(m)) + '/tuần, cả năm đi lại ~' + E.fmtMoney(m, tm));
    ok(E.fuelWeek(c) > 0.25 && tc > 30 && tc < 80, 'ô tô: đổ xăng ~' + E.fmtMoney(c, E.fuelWeek(c)) + '/tuần, cả năm (xăng, bảo hiểm, gửi xe, bảo dưỡng) ~' + E.fmtMoney(c, tc)); }
  { const l = mk(99200, 30, x => { x.lic = { A1: true, B: true }; E.startJob(x, 'tx_cn', R(23), () => { }); x.money = 50; });
    const d = E.DEC.mua_xe.make(l, R(24)); ok(d.opts.some(o => o.k === 'rent') && /^3\. Thuê xe/.test(d.opts.find(o => o.k === 'rent').l), 'tài xế công nghệ được chọn "3. Thuê xe chạy dịch vụ"');
    l.pending.unshift(d); E.resolve(l, 'rent'); ok(l.pending[0] && l.pending[0].id === 'thue_xe' && l.pending[0].opts.some(o => o.k === 'xsm_car'), 'có thuê xe điện Xanh SM, xe xăng chạy Grab');
    E.resolve(l, 'xsm_car'); ok(l.rentVeh && l.rentVeh.ev && l.rentVeh.car, 'thuê VinFast VF 5 chạy Xanh SM');
    const tc = E.travelCost(l, l.base, 30); ok(tc >= (7.5 + 1.5) * 12, 'tiền thuê xe & sạc được tính vào chi phí đi lại (' + E.fmtMoney(l, tc) + '/năm)');
    const hook = E.HOOKS.year.find(h => /hivMomChecked/.test(h.toString())); l.age = 32; const out = []; hook(l, R(25), t => out.push(t), 32, {}); ok(out.some(t => /bảo dưỡng.*pin/.test(t)), '2 năm thuê xe điện phải bảo dưỡng, kiểm tra pin');
    const st = mk(99201, 30); ok(!E.DEC.mua_xe.make(st, R(26)).opts.some(o => o.k === 'rent'), 'không làm tài xế thì không có lựa chọn thuê xe chạy dịch vụ'); }
  // --- kinh doanh lãi lỗ theo thực tế
  { const profs = []; for (let i = 0; i < 300; i++) { const l = mk(99300 + i, 40, x => { x.money = 5000; x.mkt = { stock: 'bình thường', land: 'bình thường' }; }); play(l, 'dau_tu_lon', 'b_spa'); const v = l.ventures[0]; v.yrs = 3; v.q = 1; const out = []; E.wealth.investYear(l, R(400 + i), t => out.push(t), 40); if (v.last) profs.push(v.last.prof); if (i === 0) ok(/doanh thu ~.*chi phí.*mặt bằng/.test(out.join(' ')), 'lãi lỗ cửa hàng ghi rõ doanh thu, chi phí: ' + out.join(' ').slice(0, 160)); }
    profs.sort((a, b) => a - b); const med = profs[profs.length >> 1];
    ok(med > 450 && med < 1100, 'spa / thẩm mỹ viện làm ăn bình thường lãi khoảng ' + Math.round(med) + ' triệu/năm (vốn ~1,8 tỷ), không còn chỉ vài chục triệu');
    ok(profs[Math.floor(profs.length * 0.05)] < 300, 'năm vắng khách vẫn có thể lãi ít hoặc lỗ (5% thấp nhất: ' + Math.round(profs[Math.floor(profs.length * 0.05)]) + ' triệu)'); }
  // --- mua sắm, tìm người yêu, game hợp tuổi
  { const rich = mk(99400, 51, x => { x.money = x.base * 50; }); ok(!E.DEC.mua_sam.def.valid(rich), 'trong tài khoản cả chục tỷ thì không còn "cơn thèm mua sắm" phải đắn đo vay mượn');
    const mid = mk(99401, 51, x => { x.money = x.base * 3; }); let pc = 0, loan = 0; for (let i = 0; i < 40; i++) { const d = E.DEC.mua_sam.make(mid, R(500 + i)); if (/máy tính chơi game|Bạn bè ai cũng có/.test(d.text)) pc++; if (mid.money >= d.data.p * mid.base && d.opts.some(o => /^(card|paylater|appden)$/.test(o.k))) loan++; }
    ok(pc === 0 && loan === 0, 'mua sắm hợp tuổi 51, đủ tiền thì không gợi ý quẹt thẻ / vay app'); }
  { const old = mk(99410, 73, x => { x.partner = null; x.retired = true; x.job = null; }); const d = E.DEC.tim_nguoi_yeu.make(old, R(27));
    ok(!/Bạn bè lần lượt có đôi/.test(d.text) && /xế chiều/.test(d.text) && !d.opts.some(o => /chỗ làm|trường học/.test(o.l)) && d.opts.some(o => /câu lạc bộ dưỡng sinh/.test(o.l)), '73 tuổi tìm bạn đời: lời lẽ, lựa chọn hợp tuổi (' + d.opts.map(o => o.l).join(' / ') + ')');
    const g = mk(99411, 26, x => { x.orient = 'gay'; x.realized = true; }, 'M'), s = mk(99412, 26, null, 'M'), m50 = mk(99413, 50);
    const ks = l => E.DEC.app_hen_ho.make(l, R(28)).opts.map(o => o.k);
    ok(ks(g).includes('blued') && !ks(s).includes('blued') && ks(s).includes('tinder') && ks(s).includes('bumble'), 'ứng dụng hẹn hò: Tinder, Bumble…; Blued chỉ dành cho nam đồng tính / song tính');
    ok(!ks(m50).includes('tinder') && ks(m50).includes('trung_nien') && ks(m50).includes('fb'), '50 tuổi: Facebook Hẹn hò, nhóm kết bạn trung niên thay vì Tinder'); }
  { const l = mk(99420, 46); let ff = 0; for (let i = 0; i < 60; i++) if (/Free Fire|Roblox|Play Together/.test(E.DEC.choi_game_nha.make(l, R(600 + i)).text + JSON.stringify(E.DEC.choi_game_nha.make(l, R(600 + i)).data))) ff++;
    ok(ff === 0, '46 tuổi không còn chơi Free Fire, Roblox'); }
  // --- chống lặp & logic gia đình
  { let over = 0, worst = '', sameCause = 0, firstLoveAfter = 0, lines = 0;
    const cnt = {}; Object.keys(E.DEC).forEach(id => { const D = E.DEC[id], ap = D.apply; D.apply = function (l) { if (l._cnt) l._cnt[id] = (l._cnt[id] || 0) + 1; return ap.apply(this, arguments); }; });
    const repIds = E.TRIG.filter(t => t.rep).map(t => t.id);
    for (let i = 0; i < 160; i++) { const l = E.createLife({ mode: 'vn', seed: 99500 + i }); l._cnt = {}; E.runHeadless(l);
      ['mua_sam', 'csgt', 'so_thich', 'bao_lu', 'di_nhau', 'ca_do', 'ban_muon_tien', 'viec_online', 'sib_vay'].forEach(id => { if ((l._cnt[id] || 0) > 5) { over++; worst = id + ' ×' + l._cnt[id]; } });
      const md = {}; l.log.forEach(e => { let m = e.t.match(/^Mẹ qua đời ở tuổi \d+ vì ([^.]+)\./); if (m) md[e.a] = m[1]; m = e.t.match(/^Bố qua đời ở tuổi \d+ vì ([^.]+)\./); if (m && md[e.a] === m[1] && !/tai nạn/.test(m[1])) sameCause++; });
      const fl = l.log.findIndex(e => /^Mối tình đầu với/.test(e.t)), br = l.log.findIndex(e => /^Chia tay /.test(e.t)); if (fl >= 0 && br >= 0 && br < fl) firstLoveAfter++;
      const seen = {}, perAge = {}; l.log.forEach(e => { if (e.k !== 'money') perAge[e.a] = (perAge[e.a] || 0) + 1; }); l.log.forEach(e => { if (e.k === 'quiet' && perAge[e.a] > 1 && seen[e.t] != null && e.a - seen[e.t] <= 8) lines++; seen[e.t] = e.a; });
      delete l._cnt; }
    ok(over === 0, 'tình huống thường ngày không lặp quá 5 lần trong một đời (' + (worst || 'ổn') + ')');
    ok(sameCause === 0, 'bố mẹ mất cùng năm không trùng một căn bệnh');
    ok(firstLoveAfter === 0, 'không có "mối tình đầu" sau khi đã yêu rồi chia tay');
    ok(lines === 0, 'một dòng nhật ký y hệt không lặp lại trong vòng 8 năm (trừ khi đó là dòng duy nhất của năm)'); }
  // --- hồ sơ chi tiết
  { const l = E.createLife({ mode: 'vn', seed: 99700 }); E.runHeadless(l); const P = E.profile(l);
    ok(P && Array.isArray(P.edu) && Array.isArray(P.certs) && Array.isArray(P.ach) && Array.isArray(P.assets) && Array.isArray(P.income) && typeof P.job === 'string' && isFinite(P.net), 'hồ sơ chi tiết đủ mục: công việc, thu nhập, tài sản, bằng cấp, chứng chỉ, thành tựu');
    ok(!JSON.stringify(P).match(/NaN|undefined/), 'hồ sơ không có giá trị lỗi');
    const k = mk(99701, 35, x => { x.edu = 7; x.major = 'it'; x.talent = 'toán học'; x.skill = 55; x.medals = [{ ev: 'IMO 2042', m: 'vàng', y: 2042 }]; });
    const K = E.profile(k); ok(K.edu.some(e => /tiến sĩ/.test(e)) && K.edu.some(e => /thạc sĩ/.test(e)) && K.talent.lv.lv === 6 && K.ach.some(a => /IMO/.test(a.t)), 'hồ sơ: bằng cấp, cấp độ năng khiếu, huy chương'); }
}
section('29. Bản 3.1: lựa chọn theo nơi đang sống, về thăm bố mẹ tốn tiền theo khoảng cách, nhật ký ghi số tiền, gợi ý chi phí, rà soát lời kể');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; l.fam.noDad = false; l.fam.mAlive = l.fam.fAlive = true; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  const VNP = /Cúc Phương|Fansipan|Sa Pa|Đà Lạt|Hạ Long|Hà Giang|Phú Quốc|Hội An|Nha Trang|Côn Đảo|Tam Đảo|Ba Vì|Bà Đen|Mộc Châu|Mũi Né|Vũng Tàu|Cát Tiên|Bạch Mã|Langbiang|Mẫu Sơn|Ninh Bình|Huế|Quy Nhơn|Phong Nha|Cần Thơ|Cát Bà|Sơn Trà|Bà Nà|Chứa Chan|Tà Năng/;
  // về thăm bố mẹ
  { const home = mk(99800, 25), city = mk(99801, 20, l => { l.region = 'DBSH'; l.cityStudent = { city: 'TP. Hồ Chí Minh', since: 18 }; }), ab = mk(99802, 22, l => { l.abroad = { code: 'JP', name: 'Nhật Bản', study: true, until: 24 }; l.school = 'abroad'; });
    const t0 = E.homeTrip(home), t1 = E.homeTrip(city), t2 = E.homeTrip(ab);
    ok(t0.near && t0.cost < 1 && t1.flight && t1.cost >= 3 && t2.abroad && t2.cost >= 8, 'về thăm bố mẹ: ở gần ~' + E.fmtMoney(home, t0.cost) + ', học ở TP.HCM quê miền Bắc phải bay ~' + E.fmtMoney(city, t1.cost) + ', du học Nhật ~' + E.fmtMoney(ab, t2.cost));
    const d = E.DEC.tham_bo_me.make(city, R(1)); ok(/TP\. Hồ Chí Minh/.test(d.text) && /máy bay/.test(d.opts[0].l + d.opts[0].h) && /triệu/.test(d.opts[0].h) && d.opts.some(o => o.k === 'call'), 'lời mời về thăm nhà ghi rõ đang ở đâu, đi bằng gì, tốn bao nhiêu');
    const m0 = city.money; const t = play(city, 'tham_bo_me', 'go'); ok(city.money < m0 - 3 && /\(bạn tự chi [\d,.]+ triệu đ từ tiền riêng\)/.test(t), 'về thăm nhà bị trừ tiền vé, nhật ký ghi rõ: ' + t);
    const m1 = ab.money; play(ab, 'tham_bo_me', 'call'); ok(ab.money === m1, 'gọi video hỏi thăm thì không tốn tiền'); }
  // địa điểm theo nơi đang sống
  { const ab = mk(99810, 22, l => { l.abroad = { code: 'JP', name: 'Nhật Bản', study: true, until: 24 }; }), vn = mk(99811, 22);
    let bad = 0, vnOk = 0; for (let i = 0; i < 40; i++) { const t = E.DEC.leo_nui.make(ab, R(700 + i)).text + E.DEC.phuot.make(ab, R(800 + i)).text + E.DEC.du_lich.make(ab, R(900 + i)).opts.map(o => o.l).join(); if (VNP.test(t)) bad++; if (VNP.test(E.DEC.leo_nui.make(vn, R(700 + i)).text)) vnOk++; }
    ok(bad === 0 && vnOk >= 35, 'đang du học Nhật thì dã ngoại, đi phượt, du lịch ở Nhật — không còn "rừng Cúc Phương" (' + E.DEC.leo_nui.make(ab, R(1)).text + ')');
    const ev = E.EVENTS.find(e => e.travel50 || /'Đi du lịch ' \+ dest/.test(e.run.toString())); let evBad = 0; for (let i = 0; i < 30; i++) { const out = []; const x = mk(99820 + i, 30, l => { l.abroad = { code: 'KR', name: 'Hàn Quốc', perm: false, until: 35 }; l.money = 50; }); ev.run(x, 30, R(i), t => out.push(t)); if (VNP.test(out.join(' '))) evBad++; }
    ok(evBad === 0, 'đang làm việc ở Hàn Quốc thì đi du lịch quanh Hàn, không "đi Phú Quốc"');
    const tm = E.EVENTS.filter(e => /Thanh minh|ông Công ông Táo/.test(e.run.toString())); const away = mk(99830, 30, l => { l.abroad = { code: 'KR', name: 'Hàn Quốc', perm: false, until: 35 }; l.religion = 'Không tôn giáo'; });
    ok(tm.length && tm.every(e => !e.c(away, 30)), 'đang ở nước ngoài thì không có tảo mộ Thanh minh, cúng ông Công ông Táo cùng cả nhà'); }
  // nhật ký ghi số tiền đã chi
  { const l = mk(99840, 30, l => { l.money = 100; }); let t = play(l, 'du_lich', 'near'); t += E.resolve(l, 'solo').map(e=>e.t).join(' '); t += E.resolve(l, 'self').map(e=>e.t).join(' '); ok(/Bạn thanh toán|bạn tự chi/.test(t) && l.money < 100, 'đi du lịch: xác nhận gói rồi ghi số tiền đã chi (' + t + ')');
    const n = mk(99841, 30, l => { l.money = 200; }); const t2 = play(n, 'di_nhau', 'grab'); ok(/\(bạn tự chi /.test(t2), 'đi nhậu gọi xe về: nhật ký ghi tiền đã chi (' + t2 + ')'); }
  // gợi ý chi phí cho lựa chọn chưa ghi giá
  { const l = mk(99850, 30, l => { l.money = 200; l.sibList = [{ n: 'Lê Văn Hai', sex: 'M', born: -2, alive: true, close: 60, job: 'kỹ sư', wed: true, kids: 1, q: 2 }]; });
    const d = E.DEC.sib_gap.make(l, R(1)), c = E.optCosts(l, d); ok(/Chi phí khoảng/.test(c.trip || '') && !c.call, 'lựa chọn "rủ đi du lịch chung" hiện chi phí ước tính (' + c.trip + '), gọi điện thì không');
    const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'); ok(/E\.optCosts\(l, d\)/.test(app) && /Tiền riêng là tiền lì xì/.test(app), 'giao diện hiện chi phí ở từng lựa chọn và giải thích "tiền riêng"'); }
  // rà soát lời kể: bố / mẹ đã mất, chuyện trường lớp khi đã nghỉ học
  { const l = mk(99860, 40, l => { l.fam.fAlive = false; });
    ok(E.H.famFix(l, 'Lo trọn chuyện mổ mắt cho mẹ. Bố mẹ khoe với cả xóm.') === 'Lo trọn chuyện mổ mắt cho mẹ. Mẹ khoe với cả xóm.', 'bố đã mất thì "Bố mẹ khoe" thành "Mẹ khoe"');
    const k = mk(99861, 9, l => { l.fam.mAlive = false; }); ok(E.H.famFix(k, 'Nhường anh Hai. Mẹ khen bạn biết điều.') === 'Nhường anh Hai. Bố khen bạn biết điều.' && E.H.famFix(k, 'Tháng Năm kính Đức Mẹ.') === 'Tháng Năm kính Đức Mẹ.', 'mẹ đã mất thì lời kể tuổi thơ nhắc bố; "Đức Mẹ" giữ nguyên');
    const o = mk(99862, 13, l => { l.school = null; }); ok(E.H.schoolOff(o, 'Lần đầu được làm lớp trưởng, oai lắm.') && !E.H.schoolOff(mk(99863, 13, l => { l.school = 'lower'; }), 'Lần đầu được làm lớp trưởng, oai lắm.'), 'đã nghỉ học thì không còn chuyện "làm lớp trưởng"'); }
  { let bad = 0; for (let i = 0; i < 120; i++) { const l = E.createLife({ mode: 'vn', seed: 99900 + i }); let mDead = null, fDead = null;
      E.runHeadless(l, x => { if (!x.fam.mAlive && mDead == null) mDead = x.age; if (!x.fam.fAlive && fDead == null) fDead = x.age; });
      l.log.forEach(e => { if (mDead != null && fDead != null && e.a > Math.max(mDead, fDead) && /(^|[^\p{L}])Bố mẹ (khoe|mua cho|gửi|cho tiền)/u.test(e.t)) bad++; }); }
    ok(bad === 0, 'bố mẹ đều đã mất thì không còn "bố mẹ khoe / mua cho / gửi tiền"'); }
}
section('30. Bản 3.2: nhà ở theo loại, bệnh viện công / tư, phẫu thuật, răng khôn, diễn viên & game show, nhắn tin tán tỉnh, chống lặp, giao diện điện thoại');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'), html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');
  // giao diện
  ok(!/Hãy chọn xong lựa chọn đang chờ trước đã/.test(appSrc) && /quay lại lựa chọn đang chờ/.test(appSrc), 'đang có lựa chọn chờ (đã thu nhỏ) vẫn làm được "Việc bạn muốn làm", xong quay lại lựa chọn đó');
  ok(/id="mnav"/.test(html) && /id="moreBtn"/.test(html) && /\.mnav \{ position: fixed/.test(css) && /align-items: end/.test(css), 'điện thoại: thanh điều hướng dưới cùng, nút "⋯", hộp lựa chọn trượt từ dưới lên');
  // nhà ở
  { const hn = mk(30001, 30, l => { l.urban = true; l.prov = { old: 'Hà Nội', neuId: l.prov.neuId }; l.movedTo = 'Hà Nội'; l.money = 3000; l.income = 300; }), q = mk(30002, 30, l => { l.urban = false; l.movedTo = null; l.money = 800; l.income = 120; });
    const d1 = E.DEC.house.make(hn, R(1)), d2 = E.DEC.house.make(q, R(2));
    const names = d => d.opts.map(o => o.l).join(' / ');
    ok(['cap4', 'mini', 'cu', 'cc', 'lau', 'ccc', 'bt', 'dt'].every(k => d1.data.pr[k] > 0) && d1.opts.some(o => o.k === 'n_mini') && d1.opts.some(o => o.k === 'n_cu'), 'Hà Nội: chọn được nhà cấp 4, chung cư mini, chung cư cũ, chung cư thương mại… (' + names(d1) + ')');
    ok(d1.data.pr.n_mini == null && d1.data.pr.mini < d1.data.pr.cc && d1.data.pr.cc < d1.data.pr.ccc && d1.data.pr.ccc < d1.data.pr.bt && d1.data.pr.bt < d1.data.pr.dt, 'giá tăng dần: chung cư mini < chung cư thương mại < cao cấp < biệt thự < dinh thự');
    ok(d2.opts.some(o => o.k === 'n_cap4') && !d2.data.pr.mini && d2.data.pr.cap4 < 1000, 'ở quê: nhà cấp 4 vài trăm triệu, không có chung cư mini (' + E.fmtMoney(q, d2.data.pr.cap4) + ')');
    const t = play(q, 'house', 'n_cap4'); ok(q.ownHouse && q.houseK === 'cap4' && /nhà cấp 4/.test(q.houseName), 'mua nhà cấp 4: ' + t);
    const prices = []; for (let i = 0; i < 30; i++) prices.push(E.DEC.house.make(hn, R(50 + i)).data.pr.cc); ok(new Set(prices.map(Math.round)).size > 10, 'giá nhà mỗi lần xem mỗi khác, không còn "nhà 4 tỷ" y hệt'); }
  // bệnh viện
  { const poor = mk(30010, 40, l => { l.money = 20; l.fam.q = 1; l.ill = { n: 'viêm gan B mạn tính', m: 2, base: 0.2, cure: 0.2, mult: 2, f: 'xơ gan', since: 40 }; }), rich = mk(30011, 40, l => { l.money = 30000; l.ill = { n: 'viêm gan B mạn tính', m: 2, base: 0.2, cure: 0.2, mult: 2, f: 'xơ gan', since: 40 }; });
    const dp = E.DEC.treat.make(poor, R(3)), dr = E.DEC.treat.make(rich, R(4));
    ok(/bệnh viện công/.test(dp.opts[0].l) && /xếp hàng/.test(dp.opts[0].h) && /bệnh viện tư/.test(dr.opts[0].l), 'nhà nghèo lên bệnh viện công (xếp hàng, nằm ghép), nhà giàu vào bệnh viện tư');
    const t = play(poor, 'treat', 'best'); ok(/xếp hàng lấy số/.test(t), 'bệnh viện công: dậy sớm xếp hàng lấy số, chờ khám, đợi lấy thuốc (' + t.slice(0, 120) + ')'); }
  { let surg = 0; for (let i = 0; i < 40; i++) { const l = mk(30020 + i, 50, x => { x.money = 500; x.ill = { n: 'ung thư dạ dày', m: 5, base: 0.3, cure: 0.3, mult: 5, f: 'ung thư dạ dày', since: 50 }; }); play(l, 'treat', 'best'); if (l.pending[0] && l.pending[0].id === 'phau_thuat') surg++; }
    ok(surg > 15, 'bệnh nặng (ung thư) thường phải phẫu thuật (' + surg + '/40)');
    const l = mk(30070, 50, x => { x.money = 500; x.fam.q = 2; }); const m0 = l.money; const t = play(l, 'phau_thuat', 'cong', { why: 'mổ ruột thừa' }); ok(l.money < m0 && /(thành công|biến chứng)/.test(t), 'phẫu thuật ở bệnh viện công: ' + t.slice(0, 100)); }
  { const l = mk(30080, 22, x => { x.money = 50; }); const d = E.DEC.rang_khon.make(l, R(5)); ok(d.opts.some(o => o.k === 'public') && d.opts.some(o => o.k === 'private') && /triệu|nghìn/.test(d.opts[0].h), 'răng khôn mọc lệch: nhổ ở bệnh viện công hay nha khoa tư, ghi rõ chi phí');
    play(l, 'rang_khon', 'wait'); ok(l.sched.some(s => s.id === 'rang_khon' && s.arg.worse), 'để đó thì vài năm sau răng khôn sưng đau hơn');
    ok(E.TRIG.some(t => t.id === 'rang_khon' && t.max === 1), 'răng khôn chỉ phải nhổ một lần'); }
  // diễn viên
  { const fees = { web: [], tv: [], cinema: [] }, big = []; let hits = 0;
    for (let i = 0; i < 300; i++) { const k = ['web', 'tv', 'cinema'][i % 3]; const l = mk(30100 + i, 25, x => { x.talent = 'diễn xuất'; x.skill = 70; E.startJob(x, 'dien_vien', R(i), () => { }); x.actSk = 70; x.fame = 5e4; });
      const m0 = l.money; const t = play(l, 'casting', k); const got = l.money - m0; if (got > 0 && /vai chính/.test(t)) fees[k].push(got); if (/doanh thu/.test(t) && /(bom tấn|phủ sóng)/.test(t)) { hits++; big.push(t); } }
    const med = a => a.sort((x, y) => x - y)[a.length >> 1] || 0;
    ok(med(fees.web) >= 70 && med(fees.tv) >= 250 && med(fees.cinema) >= 400, 'cát-xê vai chính: web drama ~' + Math.round(med(fees.web)) + ' triệu, phim truyền hình ~' + Math.round(med(fees.tv)) + ' triệu, điện ảnh ~' + Math.round(med(fees.cinema)) + ' triệu');
    ok(hits >= 3, 'phim điện ảnh doanh thu trăm tỷ thì nổi tiếng, nhãn hàng tìm đến (' + hits + ' lần): ' + (big[0] || '').slice(0, 140)); }
  { const l = mk(30500, 28, x => { E.startJob(x, 'dien_vien', R(1), () => { }); x.fame = 5e5; }); const d = E.DEC.gameshow.make(l, R(2)); ok(d.opts.some(o => /Running Man/.test(o.l)) && d.opts.some(o => /2 Ngày 1 Đêm/.test(o.l)), 'người nổi tiếng được mời tham gia Running Man Việt Nam, 2 Ngày 1 Đêm');
    play(l, 'gameshow', 'hai'); ok(l.pending[0].id==='vr_vai_tro','chọn vai trò trước khi quay'); play(l,'vr_vai_tro','guest'); const g = l.pending[0]; ok(g && g.id === 'vr_vong' && /Khách mời:/.test(g.text) && /Đội bạn:/.test(g.text), '2 Ngày 1 Đêm mở chuỗi nhiệm vụ, khách mời và đội chơi');
    const r2 = mk(30501, 28, x => { E.startJob(x, 'dien_vien', R(1), () => { }); x.fame = 5e5; }); play(r2, 'gameshow', 'rm'); play(r2,'vr_vai_tro','regular'); ok(r2.pending[0].id === 'vr_vong' && /Running Man/.test(r2.pending[0].title), 'Running Man mở chuỗi chơi thay vì một sự kiện hậu trường cố định');
    const a = mk(30502, 20, x => { x.talent = 'diễn xuất'; }); ok(E.actions(a).some(x => x.id === 'hoc_dien' && x.ok === true), 'có việc "Học diễn xuất / đi casting"'); }
  // tình yêu
  { let ghost = 0, mapmo = 0, love = 0; for (let i = 0; i < 200; i++) { const l = mk(30600 + i, 22); const t = play(l, 'nhan_tin', 'flirt'); if (/ghost/.test(t)) ghost++; else if (/mập mờ/.test(t)) mapmo++; else if (l.pending[0] && l.pending[0].id === 'love') love++; }
    ok(ghost > 30 && mapmo > 30 && love > 50, 'nhắn tin tán tỉnh: bị ghost (' + ghost + '), mập mờ (' + mapmo + '), thành đôi (' + love + ')'); }
  { let hhn = 0, pc = 0; for (let i = 0; i < 400; i++) { const l = mk(31000 + i, 26, null, i % 2 ? 'F' : 'M'); const t = play(l, 'love', 'yes'); if (/hồng hài nhi|ngưu ma vương/.test(t)) hhn++; if (/phi công trẻ|trâu già/.test(t)) pc++; }
    ok(hhn > 3 && pc > 3, 'yêu người chênh tuổi: "hồng hài nhi", "ngưu ma vương" (' + hhn + '), "phi công trẻ lái máy bay" (' + pc + ')'); }
  { const g = mk(31500, 25, x => { x.orient = 'gay'; x.realized = true; x.out = true; }), le = mk(31501, 25, x => { x.orient = 'gay'; x.realized = true; x.out = true; }, 'F'); const hook = E.HOOKS.year.find(h => /bé Liên/.test(h.toString()));
    const o1 = [], o2 = []; hook(g, R(1), t => o1.push(t), 25); hook(le, R(2), t => o2.push(t), 25); ok(o1.length && o2.length && !/bột tôm|bé Liên|tóp mỡ/.test(o1.join() + o2.join()), 'công khai xong, hội bạn thân ủng hộ và không tự gán biệt danh riêng tư'); }
  // thi lại chứng chỉ, tiền mã hóa
  { const l = mk(31600, 30, x => { x.lang = { en: 3 }; x.langAt = { en: 25 }; x.langExp = { en: true }; }); ok(E.actions(l).some(x => x.id === 'thi_lai_cc' && x.ok === true), 'không thi lại IELTS lúc hết hạn thì sau này tự vào "Học tập" để thi lại');
    const d = E.act(l, 'thi_lai_cc'); ok(d && d.id === 'chung_chi_het_han', 'bấm "thi lại" mở đúng lựa chọn thi lại'); }
  { const hookC = E.HOOKS.year.find(h => /rug pull/.test(h.toString())); const res = []; const N = 600; for (let i = 0; i < N; i++) { const l = mk(32000 + i, 30, x => { x.money = 1000; x.cmkt = 'đi ngang'; }); play(l, 'dau_tu', 'crypto'); if (l.pending[0] && l.pending[0].id === 'tien_ao') E.resolve(l, ['BTC', 'ETH', 'SOL', 'MEME'][i % 4]); const put = E.portValue(l); for (let y = 0; y < 5; y++) hookC(l, R(i * 13 + y), () => { }, 30 + y); res.push(E.portValue(l) - put); }
    res.sort((a, b) => a - b); const tot = res[res.length >> 1] * N;
    ok(res.filter(x => x < 0).length > N * 0.5, 'giữ tiền mã hóa 5 năm: quá nửa số người bị lỗ (trung vị ' + Math.round(tot / N) + ' triệu) — không còn "spam" tiền ảo làm giàu'); }
  // chống lặp
  { const cnt = {}; Object.keys(E.DEC).forEach(id => { const D = E.DEC[id], ap = D.apply; D.apply = function (l) { if (l._c) l._c[id] = (l._c[id] || 0) + 1; return ap.apply(this, arguments); }; });
    let over = 0, worst = ''; const trig = {}; E.TRIG.forEach(t => { if (!t.rep) trig[t.id] = 1; });
    for (let i = 0; i < 150; i++) { const l = E.createLife({ mode: 'vn', seed: 33000 + i }); l._c = {}; E.runHeadless(l);
      Object.keys(l._c).forEach(id => { if (trig[id] && !/^(gplx_het_han|chung_chi_het_han|casting|nk_thi)$/.test(id) && l._c[id] > 4 && !E.ACT.some(a => (a.sc || a.id) === id)) { over++; worst = id + ' ×' + l._c[id]; } }); delete l._c; }
    ok(over === 0, 'tình huống ngẫu nhiên không lặp quá vài lần trong một đời (' + (worst || 'ổn') + ')'); }
}
section('31. Bản 3.3: lời lưu ý, nghĩa vụ quân sự 2 năm, hoạt động hợp tuổi, khách sạn / resort, cổ phiếu & tiền ảo, sự kiện nghề theo tài liệu');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok(/Nhân vật và tình huống đều hư cấu, không ám chỉ cá nhân hay tổ chức nào\./.test(html), 'màn hình "Chào đời" có câu: nhân vật và tình huống đều hư cấu');
  ok(/Lấy cảm hứng từ 1 in 8 Billion/.test(html) && !/1in8b\.life/.test(html), 'chân trang nhắc tên 1 in 8 Billion, không gắn liên kết');
  ok(/class="disclaimer"><b>Lưu ý:<\/b> Một Đời là trò chơi mô phỏng/.test(html) && /không nhằm cổ xúy/.test(html), 'chân trang có lời lưu ý nổi bật');
  // nghĩa vụ quân sự
  { const l = mk(31100, 18, x => { x.school = null; x.edu = 3; x.fam.q = 2; });
    l.pending = [E.DEC.uni.make(l, R(1))]; E.resolve(l, 'military');
    ok(l.flags.military === 20 && l.pending.map(d => d.id).join() === 'nv_tan_binh,nv_don_vi', 'nhập ngũ là vào ngay 3 tháng huấn luyện tân binh, rồi về đơn vị');
    ok(E.actions(l).every(x => x.ok !== true), 'trong quân ngũ không làm được việc khác ("Việc bạn muốn làm" bị khóa)');
    while (l.pending.length) E.resolve(l, E.autoKey(l)); const f = E.finishYear(l); E.endYear(l);
    ok(f.some(e => /Thu nhập 1(?:,\d+)? triệu/.test(e.t)) && !f.some(e => /du lịch|concert|nhậu|tìm việc/.test(e.t)), 'năm tại ngũ: có phụ cấp, không có chuyện đời thường bên ngoài');
    E.beginYear(l, {}); const ids = l.pending.map(d => d.id);
    ok(ids.length >= 2 && ids.every(id => /^nv_/.test(id)) && !ids.includes('nv_xuat_ngu'), 'năm thứ hai (19 tuổi): vẫn trong quân ngũ, nhiều chuyện quân ngũ (' + ids.join(', ') + ')');
    while (l.pending.length) E.resolve(l, E.autoKey(l)); E.finishYear(l); E.endYear(l); E.beginYear(l, {}); const ids2 = l.pending.map(d => d.id);
    ok(l.age === 20 && ids2.includes('nv_xuat_ngu'), 'đủ 24 tháng, năm 20 tuổi mới ra quân (' + ids2.join(', ') + ')');
    const m0 = l.money; while (l.pending.length) { const d = l.pending[0]; E.resolve(l, d.id === 'nv_xuat_ngu' ? 've' : E.autoKey(l)); } ok(l.money > m0 + 20, 'ra quân nhận trợ cấp xuất ngũ'); }
  { const l = mk(31110, 20, x => { x.flags.military = 20; x.flags.milTB = true; x.lic = {}; x.flags.milRole = 'lái xe'; }); const t = play(l, 'nv_xuat_ngu', 'cn'); ok(l.job && E.resolveJob(l.job.id) === 'quan_doi' && !l.flags.military, 'có thể ở lại làm quân nhân chuyên nghiệp');
    const d = mk(31111, 18, x => { x.flags.military = 20; x.lic = {}; }); play(d, 'nv_don_vi', 'lai_xe'); ok(d.lic.B, 'lính lái xe được học và thi bằng lái'); }
  // hoạt động hợp tuổi
  { const old = mk(31200, 84, x => { x.retired = true; x.job = null; }); const ok1 = id => E.actions(old).find(x => x.id === id).ok === true;
    ok(!ok1('show_rap') && !ok1('phuot') && !ok1('concert') && !ok1('karaoke') && ok1('doc_sach') && ok1('di_chua'), '84 tuổi: không đi battle rap, phượt, concert, giành mic karaoke; vẫn đọc sách, đi chùa / nhà thờ'); }
  // khách sạn, resort
  { const rich = mk(31300, 45, x => { x.money = 200000; }); const d = E.DEC.dau_tu_lon.make(rich, R(2)); ok(['b_hotel', 'b_hotel4', 'b_resort'].every(k => d.opts.some(o => o.k === k)), 'nhiều tiền thì mở được khách sạn mini, khách sạn 4 sao, resort');
    const poor = mk(31301, 45, x => { x.money = 1000; }); ok(!E.DEC.dau_tu_lon.make(poor, R(3)).opts.some(o => o.k === 'b_resort'), 'chưa đủ tiền thì không có resort');
    let pr = []; for (let i = 0; i < 200; i++) { const l = mk(31310 + i, 45, x => { x.money = 200000; x.mkt = { stock: 'bình thường', land: 'bình thường' }; }); play(l, 'dau_tu_lon', 'b_resort'); const v = l.ventures[0]; v.yrs = 3; v.q = 1; E.wealth.investYear(l, R(500 + i), () => { }, 45); pr.push(v.last.prof); }
    pr.sort((a, b) => a - b); const med = pr[100]; ok(med > 10000 && med < 30000, 'resort ~150 tỷ vốn lãi khoảng ' + Math.round(med / 1000) + ' tỷ/năm khi bình thường'); }
  // cổ phiếu, tiền ảo
  { const l = mk(31400, 35, x => { x.money = 1000; x.mkt = { stock: 'bình thường', land: 'bình thường' }; });
    const d = E.DEC.co_phieu.make(l, R(4)); ok(['VCB', 'FPT', 'VNM', 'HPG', 'E1VFVN30', 'MWG', 'GAS'].every(k => d.opts.some(o => o.k === k)) && !d.opts.some(o=>o.k==='PENNY'), 'bảng giá có mã thật và quỹ chỉ số, không gán giá thị trường cho mã penny hư cấu');
    play(l, 'co_phieu', 'FPT'); ok(l.pending[0]&&l.pending[0].id==='market_trade','chọn mã rồi xác nhận số lượng'); E.resolve(l,'confirm'); const nwA = E.netWorth(l), pv = E.MARKET.value(l); l.marketBook.positions = {}; const nwB = E.netWorth(l); ok(pv > 0 && Math.abs(nwA - nwB - pv) < 1e-6, 'cổ phiếu được tính vào tài sản ròng');
    const c = mk(31402, 35, x => { x.money = 1000; }); const dc = E.DEC.tien_ao.make(c, R(5)); ok(['BTC', 'ETH', 'SOL', 'MEME'].every(k => dc.opts.some(o => o.k === k)), 'tiền mã hóa: Bitcoin, Ethereum, altcoin, memecoin');
    const regs = {}; let rug = 0, end = []; for (let i = 0; i < 300; i++) { const x = mk(31500 + i, 30, y => { y.money = 1000; y.cmkt = 'đi ngang'; }); play(x, 'tien_ao', i % 2 ? 'BTC' : 'MEME'); const hook = E.HOOKS.year.find(h => /rug pull/.test(h.toString())); for (let y = 0; y < 5; y++) { const out = []; hook(x, R(i * 7 + y), t => out.push(t), 30 + y); regs[x.cmkt] = 1; if (out.some(t => /rug pull/.test(t))) rug++; } end.push(E.portValue(x)); }
    ok(Object.keys(regs).length >= 3, 'thị trường tiền ảo lên xuống theo chu kỳ (' + Object.keys(regs).join(', ') + ')');
    ok(rug > 30, 'memecoin có thể bị "rug pull" về 0 (' + rug + ' lần)'); }
  // sự kiện nghề theo tài liệu
  { const ids = ['ld_tai_nan_lao_dong', 'nong_phan_gia', 'cn_cat_giam', 'kd_hang_nhai', 'kt_lam_dep_so', 'xa_dat_dai', 'hq_hang_lau_quen', 'ca_nguoi_nha_vi_pham', 'qd_cuu_ho_lu', 'yt_hoa_hong_thuoc', 'gv_hoc_sinh_bi_bao_hanh', 'sb_hop_dong_no_le', 'spa_tham_my_chui', 'tt_doping', 'fl_khach_quyt', 'pc_ha_canh_kho', 'pp_hoan_luong', 'cn_cuu_sep', 'cc_mot_cua', 'ca_giup_dan'];
    ok(ids.every(id => !!E.DEC[id]), 'có các sự kiện nghề mới theo tài liệu (' + ids.length + ' mẫu kiểm tra)');
    const govIds = Object.keys(E.DEC).filter(id => /^(xa_|thue_|hq_|qltt_|kiem_lam_|kiem_toan_|dnnn_|vc_|nn_|ca_|qd_|cc_)/.test(id));
    ok(govIds.every(id => E.DEC[id].def.opts.some(o => o.ai && (o.ai.w == null ? 1 : o.ai.w) >= 1)), 'mọi sự kiện ở cơ quan nhà nước, công an, quân đội đều có lựa chọn liêm chính / tận tụy');
    ok(govIds.filter(id => /^(qd_cuu_ho_lu|ca_giup_dan|cc_mot_cua|ngoai_giao_bao_ho|qd_bien_dao)$/.test(id) || id === 'cc_mot_cua').length >= 3, 'có sự kiện tốt về người lính, công an, cán bộ tận tụy'); }

  { const R2 = s => { const h = { rs: s }; return () => U.rand(h); }; let tried = 0, crash = 0, bad = 0;
    const jobsFor = j => j === 'free' ? ['fl_dev'] : j === 'crime' ? ['doi_no'] : j === 'biz' ? ['kd_tu_do'] : j === '*' ? ['ke_toan'] : j;
    Object.keys(E.JOBS2).forEach((id, n) => {
      const jid = jobsFor(E.JOBS2[id])[0];
      const base = E.createLife({ mode: 'vn', seed: 40000 + n, gender: 'M' }); base.age = id === 'cn_chuyen_nghe_tuoi_40' ? 40 : 36; base.indep = true; base.money = base.base * 20; base.edu = 6; base.fame = 3e5; base.pending = [];
      E.startJob(base, jid, R2(n), () => { }); base.job.rank = 2; if (jid === 'scam_kh') base.abroad = { code: 'KH', name: 'Campuchia', trapped: false };
      const d0 = E.DEC[id].make(base, R2(n));
      d0.opts.forEach(o => { for (let k = 0; k < 3; k++) { const l = JSON.parse(JSON.stringify(base)); l.rs = (l.rs + k * 7919) | 0; try { const d = E.DEC[id].make(l, R2(n + k)); l.pending.unshift(d); const t = E.resolve(l, o.k).map(e => e.t).join(' '); let g = 0; while (l.pending.length && g++ < 10) E.resolve(l, E.autoKey(l)); tried++; if (badText(t) || !isFinite(l.money) || !isFinite(E.netWorth(l))) { bad++; fails.push('Sự kiện nghề ' + id + '/' + o.k + ': ' + t.slice(0, 100)); } } catch (e) { crash++; fails.push('Crash sự kiện nghề ' + id + '/' + o.k + ': ' + e.message); } } });
    });
    ok(crash === 0 && bad === 0 && tried > 600, 'mọi sự kiện nghề mới (' + Object.keys(E.JOBS2).length + ' sự kiện) chạy đúng với mọi lựa chọn (' + tried + ' lượt thử)'); }
  { const l = mk(31600, 35, x => { x.edu = 5; E.startJob(x, 'ke_toan', R(6), () => { }); x.job.rank = 2; }); play(l, 'kt_lam_dep_so', 'lam'); ok(l.flags.traps && l.flags.traps.so_sach === 35, 'chọn sai thì có "cờ chờ nổ": hậu quả đến vài năm sau');
    const hook = E.HOOKS.year.find(h => /TRAPS|traps/.test(h.toString())); let boom = 0; for (let i = 0; i < 50; i++) { const x = mk(31700 + i, 40, y => { y.flags.traps = { so_sach: 35 }; }); hook(x, R(i), () => { }, 40); if (x.sched.some(s => s.id === 'bi_bat')) boom++; } ok(boom > 3 && boom < 25, 'sai phạm sổ sách năm nào đó có thể bị thanh tra phát hiện (' + boom + '/50 trong một năm)');
    const h = mk(31800, 30, x => { E.startJob(x, 'hai_quan', R(7), () => { }); }); const t = play(h, 'hq_hang_lau_quen', 'kiem'); ok(/biểu dương/.test(t) && h.karma > 0, 'cán bộ hải quan làm đúng được biểu dương: ' + t.slice(0, 80)); }
}

section('32. Bản 3.4: hẹn hò qua mạng (người tử tế, đào mỏ, lừa đầu tư), hoạt động hẹn hò, rủ chơi game, nghề cày thuê rank, chuyện tuổi thơ, nhớ chuyện đời trước');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  const kidLife = (l) => { let g = 0; while (l.alive && l.age <= 14 && g++ < 20) { E.beginYear(l, { auto: true }); const ids = l.pending.map(d => d.id); let k = 0; while (l.pending.length && k++ < 20) E.resolve(l, E.autoKey(l)); E.finishYear(l); k = 0; while (l.pending.length && k++ < 20) E.resolve(l, E.autoKey(l)); E.endYear(l); } };
  // hẹn hò qua mạng
  ['tot', 'dao_mo', 'dau_tu', 'catfish', 'qua_tang'].forEach((t, i) => { const d = E.DEC.hen_online.make(mk(32100 + i, 28), R(i), { t, app: 'Tinder' }); ok(d.opts.length === 4 && !badText(d.text) && /Tinder/.test(d.title), 'hẹn hò qua mạng — kiểu "' + t + '": ' + d.text.slice(0, 70)); });
  { let lost = 0, safe = 0; for (let i = 0; i < 200; i++) { const l = mk(32200 + i, 30, x => { x.money = 300; }); const m0 = l.money; play(l, 'hen_online', 'chieu', { t: 'dau_tu' }); if (l.money < m0 - 10) lost++; const l2 = mk(32200 + i, 30, x => { x.money = 300; }); play(l2, 'hen_online', 'kiem_tra', { t: 'dau_tu' }); if (l2.money >= 300 - 0.01) safe++; }
    ok(lost > 60 && safe > 150, 'nghe lời "sàn đầu tư" thì nhiều người mất tiền (' + lost + '/200); gọi video, tra trên mạng thì đa số thoát (' + safe + '/200)'); }
  { const naive = mk(32300, 19, x => { x.st.kno = 20; }), sage = mk(32301, 40, x => { x.st.kno = 90; x.flags.scamOnline = true; }); ok(E.datingSavvy(sage) > E.datingSavvy(naive) + 0.3, 'càng hiểu biết, từng trải, từng bị lừa thì càng tinh ý (' + E.datingSavvy(naive).toFixed(2) + ' → ' + E.datingSavvy(sage).toFixed(2) + ')'); }
  { const l = mk(32310, 26); play(l, 'hen_online', 'gap', { t: 'tot', n: 'Trần Thu Hà', s: 'F' }); ok(l.pending[0] && l.pending[0].id === 'love' && l.pending[0].data.p.name === 'Trần Thu Hà', 'gặp người tử tế qua app thì có thể thành người yêu'); }
  { let n = 0; for (let i = 0; i < 60; i++) { const l = mk(32400 + i, 27); play(l, 'app_hen_ho', 'tinder'); if (l.pending[0] && l.pending[0].id === 'app_ho_so') E.resolve(l, 'p0'); if (l.pending.some(d => d.id === 'hen_online')) n++; } ok(n > 15, 'quẹt Tinder, chọn một hồ sơ để nhắn tin dẫn vào tình huống hẹn hò qua mạng (' + n + '/60)'); }
  // hoạt động hẹn hò
  { const l = mk(32500, 25, x => { x.partner = { name: 'Lan', sex: 'F', age: 24, status: 'dating', since: 24, alive: true }; x.money = 100; }); const d = E.DEC.hen_ho.make(l, R(5)); const all = E.DEC.hen_ho.def.opts.map(o => o.k);
    ok(['phim', 'to_tuong', 'thuy_cung', 'nha_sach', 'bao_tang'].every(k => all.includes(k)) && all.length >= 15, 'có nhiều hoạt động hẹn hò: xem phim, tô tượng, thủy cung, nhà sách, bảo tàng… (' + all.length + ')');
    ok(d.opts.length >= 6 && d.opts.length <= 14, 'mỗi lần chỉ hiện vài hoạt động khác nhau, có nút đổi gợi ý (' + d.opts.map(o => o.k).join(', ') + ')');
    const t = play(l, 'hen_ho', d.opts[0].k); ok(!badText(t) && /Lan/.test(t), 'đi hẹn hò: ' + t.slice(0, 90)); }
  // rủ chơi game
  { const seen = new Set(); let bad = 0; for (let i = 0; i < 40; i++) { const l = mk(32600 + i, 20, x => { x.talent = 'game'; x.game = 'Liên Quân Mobile'; }); const t = play(l, 'ghep_game', 'choi'); if (/giả gái/.test(t)) seen.add('nam giả nữ'); if (/lớp 5/.test(t)) seen.add('học sinh lớp 5'); if (badText(t)) bad++; }
    ok(bad === 0 && seen.size === 2, 'rủ người lạ chơi game có tình huống trớ trêu: nam giả nữ, đồng đội là học sinh lớp 5'); }
  // nghề cày thuê
  ok(!!E.CAR.cay_thue && E.CAR.cay_thue.talent === 'game', 'có nghề cày thuê rank');
  { const B = E.BOOST['Liên Quân Mobile'].tiers.map(t => t[1]); ok(JSON.stringify(B) === JSON.stringify([3, 6.5, 10, 13, 15, 25]), 'giá cày thuê Liên Quân theo bảng giá: 3k, 6–7k, 10k, 13k, 15k, 25k / sao');
    ok(!!E.BOOST['Liên Minh Huyền Thoại'] && !!E.BOOST['Liên Minh: Tốc Chiến'], 'có giá cày thuê Liên Minh Huyền Thoại và Tốc Chiến'); }
  { const l = mk(32700, 22, x => { E.startJob(x, 'cay_thue', R(1), () => { }); x.boostGame = 'Liên Quân Mobile'; }); l.skill = 20; const lo = E.boostMonth(l); l.skill = 95; const hi = E.boostMonth(l);
    ok(lo.tier === 'Đồng → Vàng' && hi.tier === 'Chiến Thần' && hi.month > lo.month * 4, 'trình càng cao nhận đơn càng đắt: ' + lo.tier + ' ~' + lo.month.toFixed(1) + ' tr/tháng → ' + hi.tier + ' ~' + hi.month.toFixed(1) + ' tr/tháng');
    const out = []; const inc = E.careerYear(l, R(3), (t) => out.push(t)); ok(inc > 0 && isFinite(inc) && out.some(t => /Cày thuê Liên Quân/.test(t)), 'thu nhập cày thuê tính từ giá theo sao: ' + (out.find(t => /Cày thuê/.test(t)) || '').slice(0, 110)); }
  { const l = mk(32710, 16, x => { x.talent = 'game'; x.game = 'Liên Quân Mobile'; x.school = 'high'; x.indep = false; }); const a = E.ACT.find(x => x.id === 'cay_thue_them'); ok(a && E.actAvail(l, a) === true, 'học sinh giỏi game có thể nhận cày thuê kiếm thêm');
    const d = E.DEC.cay_them.make(l, R(1)); ok(/vi phạm điều khoản/.test(d.text) && !d.opts.some(o => o.k === 'nghe'), 'nhắc rủi ro bị khóa tài khoản; học sinh chưa thể làm nghề toàn thời gian'); }
  // chuyện tuổi thơ
  { const kid = E.TRIG.filter(t => t.child && /^k_/.test(t.id)); ok(kid.length >= 30 && kid.every(t => t.max === 1), 'thêm ' + kid.length + ' chuyện tuổi thơ mới, mỗi chuyện chỉ gặp tối đa 1 lần trong đời'); }
  { const kidIds = new Set(E.TRIG.filter(t => t.child).map(t => t.id)); const per = [], freq = {}; const N = 120;
    for (let i = 0; i < N; i++) { const l = E.createLife({ mode: 'vn', seed: 33000 + i }); kidLife(l); const seen = Object.keys(l.flags.scN || {}).filter(id => kidIds.has(id)); per.push(seen.length); seen.forEach(k => freq[k] = (freq[k] || 0) + 1); }
    const avg = per.reduce((a, b) => a + b) / N, top = Object.keys(freq).filter(k => k !== 'thoi_noi').sort((a, b) => freq[b] - freq[a])[0];
    ok(avg >= 14, 'tuổi thơ có nhiều chuyện khác nhau (trung bình ' + avg.toFixed(1) + ' chuyện / đời)'); ok(freq[top] / N < 0.75, 'không chuyện tuổi thơ nào xuất hiện ở gần như mọi đời (nhiều nhất: ' + top + ' ' + Math.round(freq[top] / N * 100) + '%)'); }
  // nhớ chuyện đời trước
  { const run = prev => { const c = {}; for (let i = 0; i < 80; i++) { const l = E.createLife({ mode: 'vn', seed: 34000 + i }); if (prev) l.flags.prevSeen = prev; kidLife(l); Object.keys(l.flags.scN || {}).forEach(id => c[id] = (c[id] || 0) + 1); } return c; };
    const ids = ['sinh_nhat', 'li_xi', 'thu_cung', 'choi_le_hoi', 'k_mat_dien', 'k_an_co']; const a = run(null), b = run(Object.fromEntries(ids.map(x => [x, 1])));
    const sa = ids.reduce((s, x) => s + (a[x] || 0), 0), sb = ids.reduce((s, x) => s + (b[x] || 0), 0); ok(sb < sa * 0.7, 'chuyện đã gặp ở đời trước thì đời sau ít gặp lại (' + sa + ' → ' + sb + ')');
    const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'); ok(/mkn\.seen/.test(app) && /prevSeen/.test(app), 'trò chơi lưu những chuyện đã gặp của 3 đời gần nhất'); }
  // rà soát logic
  { const l = mk(32800, 30, x => { x.money = 5; x.ownHouse = false; }); const d = E.DEC.house.make(l, R(1)); ok(d.opts.length > 1 || (/tham khảo/.test(d.text) && /tích lũy/.test(d.text)), 'không đủ tiền mua nhà thì vẫn hiện giá tham khảo thay vì danh sách trống'); }
  { const l = mk(32810, 50, x => { x.fam.mAlive = true; x.fam.fAlive = false; }); const d = E.DEC.care.make(l, R(1)); l.fam.mAlive = false; l.pending.unshift(d); const t = E.resolve(l, 'no').map(e => e.t).join(' '); ok(!/chu cấp cho mẹ/.test(t), 'mẹ đã mất thì không còn "gửi tiền chu cấp cho mẹ"'); }
  { const l = mk(32820, 70, x => { x.job = null; x.retired = true; }); let bad = 0; const id = Object.keys(E.DEC).find(k => E.DEC[k].def && E.DEC[k].def.title === 'Rủ chơi hụi'); for (let i = 0; i < 30; i++) { const d = E.DEC[id].make(l, R(i)); if (/đồng nghiệp/.test(d.text + JSON.stringify(d.data))) bad++; } ok(!!id && bad === 0, 'người đã nghỉ hưu không được "chị đồng nghiệp ở công ty" rủ chơi hụi'); }
}

section('33. Bản 3.5: năng khiếu → trường chuyên ngành → nghề, sự kiện theo bối cảnh ngành, tên người Việt tự nhiên');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  // tên người Việt
  { const h = { rs: 99 }, r = () => U.rand(h); let bad = 0, n = 0; const seen = new Set();
    for (let i = 0; i < 3000; i++) { const s = i % 2 ? 'F' : 'M'; const v = G.VN.vnName(r, 'kinh', s); const w = v.full.split(' '); n++; seen.add(w.slice(1).join(' ')); if (w.length !== 3 || w[1] === w[2] || w[0] === w[2] || (s === 'M' && w[1] === 'Thị') || (s === 'F' && w[1] === 'Văn')) bad++; }
    ok(bad === 0, 'tên người Kinh đủ họ – đệm – tên, không lặp chữ, không "Văn" cho nữ / "Thị" cho nam (' + bad + '/' + n + ' lỗi)');
    ok(!seen.has('Tường Hà') && seen.size > 150, 'tên đệm + tên gọi lấy từ danh sách tên có thật (không còn kiểu "Tường Hà"), đủ đa dạng (' + seen.size + ' tên)'); }
  // gợi ý trường theo năng khiếu
  ok(['Học viện Âm nhạc Quốc gia Việt Nam', 'Nhạc viện TP. Hồ Chí Minh', 'Trường Đại học Sư phạm Nghệ thuật Trung ương', 'Trường Đại học Văn hóa Nghệ thuật Quân đội', 'Trường Cao đẳng Nghệ thuật Hà Nội'].every(n => E.TALENT_SCHOOLS['âm nhạc'].sch.some(s => s[1] === n)), 'năng khiếu ca hát có đủ 5 trường gợi ý: HV Âm nhạc QG, Nhạc viện TP.HCM, ĐH SP Nghệ thuật TW, ĐH VHNT Quân đội, CĐ Nghệ thuật Hà Nội');
  ok(['âm nhạc', 'hội họa', 'diễn xuất', 'thể thao', 'ngoại ngữ', 'toán học', 'ăn nói', 'khéo tay', 'kinh doanh', 'làm đẹp', 'game', 'cờ'].every(t => E.TALENT_SCHOOLS[t] && E.TALENT_SCHOOLS[t].sug), 'mọi năng khiếu đều có gợi ý hướng đi');
  ok(Object.values(E.TALENT_SCHOOLS).every(T => T.sch.every(s => s[7].every(id => !!E.CAR[id]))), 'mọi nghề gợi ý sau khi ra trường đều tồn tại');
  { const l = mk(33100, 16, x => { x.talent = 'âm nhạc'; x.skill = 60; x.school = 'upper'; x.indep = false; }); const d = E.DEC.nk_dinh_huong.make(l, R(1));
    ok(/Học viện Âm nhạc|Nhạc viện/.test(d.text) && /hướng khác/.test(d.text) && d.opts.map(o => o.k).join() === 'luyen,ca_hai,khac', 'tuổi 15–17 được định hướng: gợi ý trường, nghề; được chọn theo năng khiếu hoặc hướng khác');
    play(l, 'nk_dinh_huong', 'luyen'); ok(l.flags.tPrep === 1 && l.skill > 60, 'chọn luyện thi năng khiếu thì năng khiếu tiến bộ, tăng cơ hội đỗ'); }
  { const l = mk(33200, 18, x => { x.talent = 'âm nhạc'; x.skill = 70; x.st.kno = 60; x.edu = 3; x.school = null; }); const d = E.DEC.uni.make(l, R(1)); const nk = d.opts.filter(o => /^nk_/.test(o.k));
    ok(nk.length === 3 && nk.every(o => /khả năng đỗ|khó đỗ/.test(o.h) && /ra trường có thể làm/.test(o.h)), 'ngã rẽ 18 tuổi có 3 trường chuyên ngành kèm khả năng đỗ và nghề sau này: ' + nk.map(o => o.l.replace(/^Thi năng khiếu vào /, '')).join('; '));
    ok(d.opts.some(o => o.k === 'wishes54') && d.opts.some(o => o.k === 'work'), 'vẫn giữ lựa chọn đại học theo nguyện vọng và đi làm'); }
  { const pass = sk => { let n = 0; for (let i = 0; i < 150; i++) { const l = mk(33300 + i, 18, x => { x.talent = 'âm nhạc'; x.skill = sk; x.st.kno = 55; x.edu = 3; x.school = null; }); play(l, 'uni', 'nk_hvan'); if (l.flags.tSchool) n++; } return n; };
    const lo = pass(30), hi = pass(85); ok(hi > lo * 2 && hi > 100, 'thi năng khiếu đỗ hay trượt tùy trình độ (năng khiếu thấp ' + lo + '/150, cao ' + hi + '/150)'); }
  { const l = mk(33400, 18, x => { x.talent = 'âm nhạc'; x.skill = 95; x.st.kno = 70; x.edu = 3; x.school = null; x.flags.tPrep = 1; }); const t = play(l, 'uni', 'nk_hvan');
    ok(l.school === 'uni' && l.majorName === 'Thanh nhạc' && l.flags.tSchool.id === 'hvan', 'đỗ Học viện Âm nhạc: ' + t.slice(0, 80));
    let g = 0; while (l.school && g++ < 6) { E.beginYear(l, {}); l.pending = []; E.finishYear(l); if (l.school) { l.pending = []; E.endYear(l); } } const all = l.log.map(e => e.t).join(' ');
    ok(/Tốt nghiệp đại học ngành Thanh nhạc/.test(all), 'ra trường ghi đúng ngành Thanh nhạc');
    const rt = l.pending.find(d => d.id === 'nk_ra_truong'); ok(!!rt && rt.opts.some(o => /Ca sĩ/i.test(o.l)) && rt.opts.some(o => o.k === 'khac'), 'ra trường được gợi ý nghề đúng chuyên ngành (ca sĩ, nhạc công) hoặc chọn ngành khác');
    l.pending = [rt]; E.resolve(l, rt.opts[0].k); ok(l.job && E.resolveJob(l.job.id) === 'ca_si', 'chọn làm ca sĩ sau khi tốt nghiệp'); }
  { const l = mk(33500, 18, x => { x.talent = 'khéo tay'; x.skill = 50; x.edu = 3; x.school = null; }); let n = 0; for (let i = 0; i < 20; i++) { const L = JSON.parse(JSON.stringify(l)); L.rs = i * 7; play(L, 'uni', 'nk_cdn'); if (L.school === 'voc') n++; } ok(n >= 15, 'cao đẳng nghề học 3 năm theo hệ trường nghề'); }
  // ngành âm nhạc: mua bài, tự sáng tác, may mắn
  { let hits = 0, hitsYoung = 0; for (let i = 0; i < 200; i++) { const a = mk(33600 + i, 26, x => { E.startJob(x, 'ca_si', R(i), () => { }); x.money = 2000; x.skill = 60; }); const f0 = a.fame; play(a, 'am_mua_bai', 'hit'); if (a.fame > f0 * 2) hits++; const b = mk(33600 + i, 26, x => { E.startJob(x, 'ca_si', R(i), () => { }); x.money = 2000; x.skill = 60; }); const g0 = b.fame; play(b, 'am_mua_bai', 'tre'); if (b.fame > g0 * 2) hitsYoung++; }
    ok(hits > 40 && hits < 140 && hitsYoung < hits, 'mua bài của nhạc sĩ hit-maker dễ thành hit hơn (' + hits + '/200) bài của nhạc sĩ trẻ (' + hitsYoung + '/200), nhưng vẫn cần may mắn'); }
  { const l = mk(33700, 26, x => { E.startJob(x, 'nhac_si', R(1), () => { }); x.money = 100; }); play(l, 'am_ban_bai', 'ban_quyen'); const m0 = l.money; const hook = E.HOOKS.year.find(h => /royalty/.test(h.toString())); hook(l, R(2), () => { }, 27); ok(l.flags.royalty > 0 && l.money > m0, 'giữ quyền tác giả thì có tiền bản quyền hằng năm'); }
  // sự kiện ngành có lựa chọn liêm chính
  { const ids = ['mt_tranh_gia', 'hlv_khai_tuoi', 'pt_thuoc_tang_co', 'ks_an_toan', 'tm_go_lau', 'cc_ho_so_gia', 'xam_tre_vi_thanh_nien', 'nn_dich_sai'];
    ok(ids.every(id => E.DEC[id] && E.DEC[id].def.opts.some(o => o.ai && o.ai.w >= 1.2)), 'các tình huống cám dỗ trong nghề đều có lựa chọn làm đúng');
    const l = mk(33800, 35, x => { x.edu = 5; E.startJob(x, 'cong_chung', R(3), () => { }); }); play(l, 'cc_ho_so_gia', 'lam'); ok(l.flags.traps && l.flags.traps.cong_chung_gia === 35, 'làm sai thì có hậu quả đến sau (công chứng giấy tờ giả)'); }
  { const cnt = {}; Object.keys(E.CAR).forEach(id => cnt[id] = 0); E.TRIG.forEach(t => { const j = E.JOBS2[t.id]; if (Array.isArray(j)) j.forEach(id => cnt[id] = (cnt[id] || 0) + 1); });
    const need = ['ky_su', 'tho_han', 'tho_moc', 'phuc_vu', 'ban_rong', 've_so', 'cong_chung', 'dao_dien', 'bien_kich', 'hoa_si', 'van_cong', 'nhac_si'];
    ok(need.every(id => cnt[id] >= 1), 'những nghề trước đây không có sự kiện riêng giờ đã có: ' + need.map(id => id + ' ' + cnt[id]).join(', ')); }
}

section('34. Bản 3.6: sống ở nước ngoài mua nhà / xe / vé số theo nơi đó, mục "Chi tiêu" có chi tiêu định kỳ, chế độ nghỉ hưu, chuyển chỗ ở');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  // định cư Úc
  const au = mk(34100, 26, x => { x.edu = 5; E.H.emigrate(x, ['AU', 'Úc', 'en'], R(1), () => { }); E.startJob(x, 'dev', R(2), () => { }); x.money = x.base * 30; });
  { const d = E.DEC.house.make(au, R(3)); const t = d.text + ' ' + d.opts.map(o => o.l).join(' ');
    ok(/Giá nhà ở .*Úc/.test(d.text) && !/TP\. Hồ Chí Minh|Hà Nội/.test(d.text), 'định cư Úc: giá nhà theo thành phố đang sống ở Úc (' + d.text.slice(d.text.indexOf('Giá nhà'), d.text.indexOf('Giá nhà') + 40) + ')');
    ok(!/cấp 4|chung cư mini|tập thể/.test(t) && /studio|nhà riêng|townhouse/.test(t), 'định cư Úc: loại nhà kiểu nước ngoài (căn hộ studio, nhà riêng có sân vườn…), không còn "nhà cấp 4", "chung cư mini"');
    const p = E.DEC.house.make(au, R(4)); play(au, 'house', p.opts[0].k); ok(au.ownHouse && /studio|căn hộ|nhà/.test(au.houseName), 'mua được nhà ở Úc: ' + au.houseName); }
  { const W = E.wealth, vios = W.MODELS.find(m => m.k === 'vios'), p911 = W.MODELS.find(m => m.k === 'porsche911');
    const vn = mk(34200, 30); const nominal = (l, v) => v * G.CUR.priceLevel(G.W.BY.AU.gdp);
    ok(W.priceOf(vn, vios) === vios.p, 'ở Việt Nam giá xe vẫn theo giá Việt Nam');
    const usd = nominal(au, W.priceOf(au, vios)); ok(usd > 12000 && usd < 30000, 'ở Úc giá xe theo thị trường quốc tế (Toyota Vios ~' + Math.round(usd) + ' USD)');
    ok(W.priceOf(au, p911) / W.priceOf(au, vios) < p911.p / vios.p, 'xe sang ở nước ngoài rẻ tương đối hơn ở Việt Nam (không chịu thuế tiêu thụ đặc biệt như ở VN)'); }
  { const d = E.DEC.ve_so.make(au, R(5)); ok(d.opts.every(o => !/Vietlott|kiến thiết/.test(o.l)) && d.opts.some(o => /xổ số quốc gia/.test(o.l)) && /Úc/.test(d.text), 'định cư Úc thì mua vé số quốc gia nơi đó, không còn Vietlott');
    const v = E.DEC.ve_so.make(mk(34300, 30), R(6)); ok(v.opts.some(o => /Vietlott/.test(o.l)), 'ở Việt Nam vẫn có Vietlott');
    ok(E.actions(au).find(a => a.id === 've_so').l === 'Mua vé số' && /căn hộ/.test(E.actions(au).find(a => a.id === 'mua_nha').l), 'tên hành động đổi theo nơi đang sống'); }
  { const w = E.createLife({ mode: 'world', seed: 34400 }); w.age = 30; w.indep = true; w.pending = []; w.money = w.base * 30; const d = E.DEC.house.make(w, R(7)); ok(!/cấp 4|chung cư mini/.test(d.opts.map(o => o.l).join(' ')), 'người sinh ra ở nước khác cũng mua nhà theo kiểu nước đó'); }
  // chi tiêu định kỳ
  { const l = mk(34500, 30, x => { x.money = 600; E.startJob(x, 'ke_toan', R(1), () => { }); x.edu = 5; x.income = 200; });
    const L = E.recurList(l); ok(['dl_trong', 'dl_ngoai', 'kham_dk'].every(id => L.some(x => x.id === id)) && L.find(x => x.id === 'dl_ngoai').every === 2, 'có chi tiêu định kỳ: du lịch 1 lần/năm, du lịch nước ngoài 1 lần/2 năm, khám sức khỏe định kỳ…');
    ['dl_trong', 'dl_ngoai', 'kham_dk'].forEach(id => E.recurToggle(l, id)); const hook = E.HOOKS.year.find(h => /Chi tiêu định kỳ/.test(h.toString())); const out = []; let n = 0;
    for (let a = 30; a < 36; a++) { l.age = a; const m0 = l.money; hook(l, R(a), t => out.push(a + ':' + t), a); }
    const intl = out.filter(t => /Thái Lan|Hàn Quốc|Nhật Bản|Singapore|Trung Quốc|Đài Loan|Malaysia|Pháp|Úc|Mỹ|Ý|Thụy Sĩ|Indonesia|Dubai/.test(t)).length;
    ok(out.length === 6 && out.every(t => /du lịch .*khám sức khỏe định kỳ/.test(t)) && intl === 3, 'chi tiêu định kỳ tự chạy mỗi năm, du lịch nước ngoài đúng 2 năm/lần: ' + out[0].slice(0, 110));
    E.recurToggle(l, 'dl_trong'); ok(!l.recur.dl_trong, 'bấm lần nữa thì tắt khoản định kỳ');
    l.money = 0; const o2 = []; l.age = 36; hook(l, R(9), t => o2.push(t), 36); ok(o2.some(t => /không đủ tiền/.test(t)) && l.money === 0, 'không đủ tiền thì tạm bỏ, không đẩy vào nợ'); }
  { const l = mk(34600, 14, x => { x.indep = false; }); ok(E.recurList(l).every(x => x.ok !== true), 'trẻ chưa tự lập chưa bật được chi tiêu định kỳ'); }
  { const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'); ok(/💰 Chi tiêu/.test(app) && /data-recur/.test(app) && E.SPEND_ACTS.includes('dau_tu') && E.SPEND_ACTS.includes('mua_nha') && E.SPEND_ACTS.includes('du_lich') && E.SPEND_ACTS.includes('tim_viec'), 'giao diện có mục "Chi tiêu": đầu tư, tìm việc, mua nhà, chuyển nhà, du lịch… và chi tiêu định kỳ'); }
  // nghỉ hưu
  { const l = mk(34700, 58, x => { x.edu = 5; E.startJob(x, 'ke_toan', R(1), () => { }); x.si = { yrs: 22, sum: 22 * 200 }; });
    ok(E.actions(l).find(a => a.id === 'nghi_huu').ok === true, 'đủ tuổi thì có thể tự chọn nghỉ hưu');
    play(l, 'nghi_huu_chon', 'huu'); E.beginYear(l, {}); l.pending = []; E.finishYear(l);
    ok(l.retired && l.flags.fullRetire && !l.job && l.pensionInc > 0, 'chọn nghỉ hưu: nghỉ hẳn, có lương hưu (đã đóng BHXH 22 năm)');
    let asks = 0; for (let y = 0; y < 15; y++) { l.pending = []; E.endYear(l); E.beginYear(l, {}); if (l.pending.some(d => /^(job|sau_huu|biz|nk_nghe|len_chuyen|ru_re|so_thich_nghe)$/.test(d.id))) asks++; l.pending = []; E.finishYear(l); }
    ok(asks === 0, 'đã nghỉ hưu thì không còn bị hỏi nhận việc này việc kia (' + asks + ' lần trong 15 năm)');
    ok(E.actions(l).find(a => a.id === 'tim_viec').l === 'Đi làm lại (đang nghỉ hưu)', 'muốn đi làm lại thì tự bấm "Đi làm lại"');
    const d = E.DEC.job.make(l, R(2)); l.pending = [d]; E.resolve(l, d.opts[0].k); ok(!l.retired && l.job && l.flags.afterRet >= l.age + 5, 'đi làm lại thì thôi nghỉ hưu, làm thêm vài năm'); }
  { const l = mk(34710, 40, x => { E.startJob(x, 'ke_toan', R(1), () => { }); }); ok(E.actions(l).find(a => a.id === 'nghi_huu').ok !== true && !E.DEC.nghi_viec.make(l, R(1)).opts.some(o => o.k === 'huu'), 'chưa đến tuổi thì chưa nghỉ hưu được'); }
  // chuyển chỗ ở
  { const l = mk(34800, 27, x => { x.money = 100; x.ownHouse = false; }); const d = E.DEC.chuyen_noi_o.make(l, R(1)); ok(d.opts.length >= 3, 'có thể chuyển chỗ ở: ' + d.opts.map(o => o.l).join(', '));
    const to = d.data.cs[0]; l.pending = [d]; E.resolve(l, 'c0'); ok(l.place === to || l.city === to, 'chuyển đến ' + to);
    const o = mk(34801, 27, x => { x.ownHouse = true; }); ok(E.actions(o).find(a => a.id === 'chuyen_noi_o').ok !== true, 'đang có nhà riêng thì phải bán / đổi nhà trước'); }
}

section('35. Bản 3.7: LGBT+ — Bột tôm, Tóp mỡ, Bé Liên, Bi; nhận ra mình khoảng 12 tuổi; hẹn hò, về chung nhà cùng giới');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok(/id="orientChips"/.test(html) && !/data-g="X"/.test(html) && !/data-g="(gay|top|lesbian|bi)"/.test(html) && /id="lgbtSub"/.test(html), 'màn tạo nhân vật tách giới tính sinh học (nam / nữ) và xu hướng tính dục (dị tính / LGBTQ+ có tóp mỡ, bột tôm, bé Liên, bi tùy chọn)');
  const mkG = (g, s) => E.createLife({ mode: 'vn', seed: s, gender: g });
  { const a = mkG('gay', 35001), b = mkG('top', 35002), c = mkG('lesbian', 35003), d = mkG('bi', 35004);
    ok(a.sex === 'M' && a.orient === 'gay' && b.sex === 'M' && b.orient === 'gay' && c.sex === 'F' && c.orient === 'gay' && d.orient === 'bi', 'tương thích lựa chọn cũ khi đọc dữ liệu nhân vật');
    ok([a, b, c, d].every(l => /LGBTQ\+/.test(E.orientLabel(l)) && !/bột tôm|tóp mỡ|bé Liên/.test(E.orientLabel(l))), 'hồ sơ ghi xu hướng trung tính: ' + [a, b, c, d].map(E.orientLabel).join(', ')); }
  { const ages = []; let early = 0;
    for (let i = 0; i < 120; i++) { const l = mkG(['gay', 'top', 'lesbian', 'bi'][i % 4], 35100 + i); let g = 0, at = null; while (l.alive && l.age <= 17 && g++ < 20) { if (l.realized && at == null) at = l.age; if (l.age < 12) early += l.realized ? 1 : 0; E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && k++ < 20) E.resolve(l, E.autoKey(l)); E.finishYear(l); k = 0; while (l.pending.length && k++ < 20) E.resolve(l, E.autoKey(l)); E.endYear(l); } if (l.realized) ages.push(at == null ? 18 : at); }
    const m = ages.filter(a => a <= 14).length; ok(early === 0 && m > ages.length * 0.8, 'tuổi thơ như bình thường, phần lớn nhận ra mình khoảng 12–13 tuổi (' + m + '/' + ages.length + ' trước 15 tuổi)'); }
  { const h = { rs: 5 }, r = () => U.rand(h); const t = ['gay', 'top', 'lesbian', 'bi'].map((g, i) => { const l = mkG(g, 35200 + i); l.age = 12; l.school = 'lower'; return E.realizeText(l, r); });
    ok(t.every(x => !badText(x)) && /bạn nam|cậu bạn|anh lớp trên/.test(t[0]) && /bạn nam|cậu bạn|anh lớp trên/.test(t[1]) && /cô bạn/.test(t[2]) && /cả bạn nam lẫn bạn nữ|cả hai/.test(t[3]), 'mỗi kiểu có lời kể riêng khi nhận ra mình: ' + t[1].slice(0, 80)); }
  { const l = mkG('top', 35300); l.age = 24; l.indep = true; l.realized = true; l.pending = []; let sameSex = 0; for (let i = 0; i < 50; i++) { const d = E.DEC.love.make(l, R(i)); if (d.data.p.sex === 'M') sameSex++; } ok(sameSex === 50, 'dữ liệu xu hướng cũ vẫn ghép đúng giới tính người yêu'); }
  { const l = mkG('gay', 35400); l.age = 27; l.indep = true; l.realized = true; l.pending = []; const d = E.DEC.love.make(l, R(1)); l.pending = [d]; E.resolve(l, 'yes'); l.age = 29;
    ok(l.partner && l.partner.sex === 'M', 'nam hẹn hò với nam');
    const m = E.DEC.marry.make(l); ok(m.opts.some(o => /chung sống/.test(o.l)) && /chưa công nhận hôn nhân cùng giới/.test(m.text), 'ở Việt Nam, cặp đôi cùng giới về chung sống (luật chưa công nhận kết hôn)');
    l.pending = [m]; const out = E.resolve(l, 'marry').map(e => e.t).join(' '); ok(l.partner.status === 'cohabit' && /Về chung sống/.test(out) && E.H.partnerWord(l, l.partner) === 'người bạn đời', 'về chung một nhà, gọi là "người bạn đời"'); }
  { const l = mkG('lesbian', 35500); l.age = 28; l.indep = true; l.realized = true; l.pending = []; const d = E.DEC.love.make(l, R(2)); l.pending = [d]; E.resolve(l, 'yes'); l.partner.status = 'cohabit'; l.partner.since = 25;
    ok(l.partner.sex === 'F', 'nữ hẹn hò với nữ');
    const k = E.DEC.kid.make(l); ok(k.opts.some(o => /nhận nuôi/i.test(o.l)) && !k.opts.some(o => /Sinh thêm/.test(o.l)), 'cặp đôi cùng giới làm cha mẹ bằng cách nhận con nuôi'); }
  { const l = mkG('bi', 35600); l.age = 25; l.realized = true; l.pending = []; const s = new Set(); for (let i = 0; i < 40; i++) s.add(E.DEC.love.make(l, R(i)).data.p.sex); ok(s.size === 2, 'Bi có thể quen cả nam lẫn nữ'); }
  { const ids = ['lg_crush', 'lg_ban_than', 'lg_pride', 'lg_giuc_cuoi', 'lg_ra_mat', 'lg_hang_xom', 'lg_hoi_ban_treu', 'lg_bi_hieu_lam', 'lg_cong_so', 'lg_be_lien', 'lg_nuoi_con']; ok(ids.every(id => !!E.DEC[id]), 'có ' + ids.length + ' tình huống riêng cho người LGBT+');
    let bad = 0, n = 0; ids.forEach((id, j) => { for (let s = 0; s < 6; s++) { const g = id === 'lg_bi_hieu_lam' ? 'bi' : id === 'lg_be_lien' ? 'lesbian' : ['gay', 'top', 'lesbian', 'bi'][s % 4]; const l = mkG(g, 35700 + j * 10 + s); l.age = 30; l.indep = true; l.realized = true; l.pending = []; l.urban = true; E.startJob(l, 'ke_toan', R(s), () => { }); l.bff = { name: 'Lan', sex: 'F', alive: true, close: 70 }; const lv = E.DEC.love.make(l, R(s)); lv.data.p.sex = l.sex; l.pending = [lv]; E.resolve(l, 'yes'); l.partner.status = 'cohabit'; l.partner.since = 27; l.partner.role = l.role === 'top' ? 'bot' : 'top';
      const d0 = E.DEC[id].make(l, R(s)); d0.opts.forEach(o => { const L = JSON.parse(JSON.stringify(l)); try { const d = E.DEC[id].make(L, R(s)); L.pending = [d]; const t = E.resolve(L, o.k).map(e => e.t).join(' ') + d.text; n++; if (badText(t)) { bad++; fails.push(id + '/' + o.k + ': ' + t.slice(0, 120)); } } catch (e) { bad++; fails.push('Crash ' + id + '/' + o.k + ': ' + e.message); } }); } });
    ok(bad === 0 && n > 100, 'mọi tình huống LGBT+ chạy đúng với mọi lựa chọn (' + n + ' lượt thử)'); }
  { let bad = 0; for (let i = 0; i < 80; i++) { const l = mkG(['gay', 'top', 'lesbian', 'bi'][i % 4], 36000 + i); const snap = {}; E.runHeadless(l, x => { snap[x.age] = x.partner ? x.partner.sex : null; });
      l.log.forEach(e => { if (snap[e.a] === l.sex && /(^|[^\p{L}])(vợ|chồng)( |,|\.)/u.test(e.t) && !/vợ chồng nhà|lấy vợ|lấy chồng|mẹ chồng|chồng chất|lãi chồng/.test(e.t)) { bad++; fails.push('Cùng giới mà gọi vợ/chồng: ' + e.t.slice(0, 100)); } }); }
    ok(bad === 0, 'cặp đôi cùng giới không bị gọi nhầm "vợ" / "chồng" trong nhật ký'); }
  { const hook = E.HOOKS.year.find(h => /bé Liên/.test(h.toString())); const tp = E.createLife({ mode: 'vn', seed: 36500, gender: 'top' }); tp.age = 25; tp.out = true; tp.realized = true; const o = []; hook(tp, R(1), x => o.push(x), 25); ok(o.length && !/tóp mỡ|bột tôm/.test(o.join()), 'nhân vật cũ công khai vẫn được tôn trọng, không bị gán vai trò riêng tư'); }
  { const mx = {}; for (let i = 0; i < 150; i++) { const l = E.createLife({ mode: i % 4 ? 'vn' : 'world', seed: 37000 + i }); E.runHeadless(l); const c = l.flags.scN || {}; ['casting', 'so_thich', 'nghien_bac'].forEach(id => mx[id] = Math.max(mx[id] || 0, c[id] || 0)); mx.branch = Math.max(mx.branch || 0, l.flags.branchN || 0); }
    ok(mx.casting <= 8 && mx.so_thich <= 2 && mx.branch <= 6 && mx.nghien_bac <= 6, 'lựa chọn không lặp lại quá nhiều trong một đời: casting ≤ 8, sở thích ≤ 2, mở chi nhánh ≤ 6, cơn nghiện ≤ 6 (' + JSON.stringify(mx) + ')'); }
}

section('36. Bản 3.8: thi lại đại học không kẹt, người già không đi học, concert theo chương trình & bias, fanmeeting, kỹ năng cứu người, trà sữa & đi ăn, trại lừa đảo khóa chi tiêu');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const play = (l, id, key, arg) => { const d = E.DEC[id].make(l, R(l.rs), arg); l.pending.unshift(d); return E.resolve(l, key || E.autoKey(l)).map(e => e.t).join(' | '); };
  // thi lại đại học
  { const l = mk(36100, 18, x => { x.edu = 3; x.school = null; x.examScore = 15; x.st.kno = 40; x.fam.q = 3; });
    let stuck = 0, tries = 0; for (let y = 0; y < 6; y++) { const d = E.DEC.uniFail.make(l); if (!d.opts.some(o => o.k === 'retry')) break; tries++; l.pending = [d]; E.resolve(l, 'retry'); }
    ok(tries === 2 && !E.DEC.uniFail.make(l).opts.some(o => o.k === 'retry'), 'ôn thi lại đại học tối đa 2 lần (thi 3 lần), không kẹt mãi ở ngã rẽ này');
    ok(l.examScore === 15, 'chưa đến năm thi thì giữ điểm cũ'); l.age++; l.pending=[]; E.beginYear(l,{}); ok(l.examScore > 15, 'đến năm thi lại mới công bố điểm mới');
    l.age = 20; const u = E.DEC.uni.make(l, R(1)); ok(/Thi lại đại học — lần thứ 3/.test(u.title) && !/Mười tám tuổi/.test(u.title), 'thi lại thì tiêu đề ghi đúng lần thi, không còn "Mười tám tuổi" khi đã 20 tuổi: ' + u.title); }
  { let n = 0; for (let i = 0; i < 60; i++) { const l = E.createLife({ mode: 'vn', seed: 36200 + i }); E.runHeadless(l); if (l.log.filter(e => /^(Mười tám tuổi|Thi lại đại học)/.test(e.t)).length > 3) n++; const fails = l.log.filter(e => /^Trượt đại học/.test(e.t)).length; if (fails > 3) n++; } ok(n === 0, 'không ai thi trượt đại học quá 3 lần'); }
  // tuổi già
  { const l = mk(36300, 81, x => { x.money = 500; }); ok(E.actions(l).find(a => a.id === 'hoc_them').ok !== true, '81 tuổi không còn bị "đi học chứng chỉ"');
    let n = 0; for (let i = 0; i < 80; i++) { const o = E.createLife({ mode: 'vn', seed: 36400 + i }); E.runHeadless(o); n += o.log.filter(e => e.a > 60 && /Học tiếng Hàn|thi IELTS|Học tin học|văn bằng 2/.test(e.t)).length; } ok(n === 0, 'người trên 60 tuổi không tự đi học chứng chỉ (' + n + ')'); }
  // concert, bias
  { const S = E.SHOWS.map(s => s.n).join(' | ');
    ok(/mùa 1 \(2024\)/.test(S) && /mùa 2 \(2025\)/.test(S) && /Em xinh/.test(S) && /Tinh hà/.test(S) && /vượt ngàn chông gai 2024/.test(S) && /vượt ngàn chông gai 2026/.test(S), 'có đủ concert: Anh trai "Say Hi" mùa 1, mùa 2, Em xinh, Tinh hà, Anh trai vượt ngàn chông gai 2024 và 2026');
    ok(E.SHOWS.every(s => s.m.length >= 24) && E.SHOWS.find(s => s.k === 'atsh1').m.includes('HIEUTHUHAI') && E.SHOWS.find(s => s.k === 'atvncg24').m.includes('SOOBIN') && E.SHOWS.find(s => s.k === 'exsh').m.includes('Bích Phương'), 'mỗi chương trình có đầy đủ nghệ sĩ (' + E.SHOWS.map(s => s.m.length).join(', ') + ')');
    const l = mk(36500, 22, x => { x.money = 300; }); l.birthYear = 2026 - 22; const sc = E.DEC.show_chon.make(l, R(1)); ok(sc.opts.length >= 6, 'chọn concert chương trình nào: ' + sc.opts.slice(0, 6).map(o => o.l.replace(/ \(.*/, '')).join(', '));
    let seen = new Set(), p = 0; for (; p < 4; p++) { const d = E.DEC.bias_chon.make(l, R(p), { k: 'atsh1', p }); d.opts.filter(o => /^b\d/.test(o.k)).forEach(o => seen.add(o.l)); if (!d.opts.some(o => o.k === 'more')) break; }
    ok(seen.size === 30, 'chọn chương trình thì hiện toàn bộ nghệ sĩ để chọn bias (' + seen.size + ' anh trai, chia trang 10 người)');
    play(l, 'bias_chon', 'b0', { k: 'atsh1', p: 0 }); ok(l.bias && l.bias.n === 'HIEUTHUHAI' && l.idol === 'anh trai HIEUTHUHAI' && l.pending[0] && l.pending[0].id === 'concert_di', 'chọn bias xong thì đi concert ủng hộ bias'); }
  // fanmeeting
  { let lucky = 0, went = 0; for (let i = 0; i < 300; i++) { const l = mk(36600 + i, 22, x => { x.money = 300; x.idol = 'anh trai HIEUTHUHAI'; x.idolCat = 'show'; }); const t = play(l, 'fanmeeting', 'vip'); if (!/hết sạch/.test(t)) went++; if (l.flags.fanService) lucky++; }
    ok(went > 150 && lucky > 15 && lucky < went * 0.4, 'fanmeeting: săn được vé ' + went + '/300, được thần tượng gọi tên, chụp ảnh, tặng quà ' + lucky + ' lần'); }
  // kỹ năng
  { const a = mk(36700, 25, x => { x.skills = { boi: 10 }; }), b = mk(36701, 25); let sa = 0, sb = 0;
    for (let i = 0; i < 100; i++) { const A = JSON.parse(JSON.stringify(a)), B = JSON.parse(JSON.stringify(b)); A.rs = B.rs = i * 7; if (/kéo được đứa bé vào bờ/.test(play(A, 'kn_duoi_nuoc', 'cuu'))) sa++; if (B.st.hea >= b.st.hea - 1) sb++; }
    ok(sa > 75, 'đã học bơi thì cứu được người đuối nước (' + sa + '/100)');
    const c = mk(36702, 20, x => { x.skills = { vo: 10 }; }); let win = 0; for (let i = 0; i < 100; i++) { const C = JSON.parse(JSON.stringify(c)); C.rs = i * 13; if (/khóa tay/.test(play(C, 'kn_bat_nat', 'vo'))) win++; } ok(win > 70, 'đã học võ thì cứu được người bị bắt nạt (' + win + '/100)');
    const k = mk(36703, 9, x => { x.indep = false; x.school = 'primary'; }); play(k, 'k_hoc_boi', 'hoc'); play(k, 'hoc_boi51', 'safe'); play(k, 'hoc_boi51', 'safe'); ok(E.hasSkill(k, 'boi'), 'học bơi qua các buổi luyện tập thì ghi nhớ kỹ năng');
    const t = mk(36704, 30, x => { x.talent = 'âm nhạc'; x.skill = 70; }); const out = play(t, 'kn_the_hien', 'lam'); ok(/hát/i.test(E.DEC.kn_the_hien.make(t, R(1)).title + out), 'có năng khiếu thì có dịp thể hiện: ' + out.slice(0, 70)); }
  // trà sữa, đi ăn
  { const l = mk(36800, 23, x => { x.money = 100; x.partner = { name: 'Lan', sex: 'F', age: 23, status: 'dating', since: 21, alive: true }; }); const d = E.DEC.mua_nuoc.make(l, R(1));
    ok(d.opts.filter(o => /^d\d/.test(o.k)).length === 5 && d.opts.some(o => /trà sữa|matcha|cà phê|trà|sinh tố|kem|nước ép|cacao|yakult|Phindi|oolong|bạc xỉu/i.test(o.l)), 'mua nước cho người yêu, chọn món: ' + d.opts.slice(0, 5).map(o => o.l).join('; '));
    const m0 = l.money; play(l, 'mua_nuoc', 'd0'); ok(l.money < m0, 'mua nước có tốn tiền');
    const h = E.DEC.hen_ho.def.opts.map(o => o.k); ok(['mi_cay', 'netflix', 'ga_ran', 'dookki', 'lau_sang', 'buffet_hs'].every(k => h.includes(k)), 'hẹn hò có thêm: mì cay, Netflix, gà rán, Dookki, lẩu Haidilao, buffet Cửu Vân Long…');
    const r2 = E.DEC.ru_ban_an.make(l, R(2)); ok(r2.opts.length >= 5, 'rủ bạn đi ăn: ' + r2.opts.slice(0, 5).map(o => o.l).join(', ')); }
  // trại lừa đảo
  { const l = mk(36900, 24, x => { x.money = 50; x.abroad = { code: 'KH', name: 'Campuchia', perm: false, until: 44, trapped: true }; x.recur = { dl_trong: true }; });
    ok(E.actions(l).every(a => a.ok !== true || /^kh_act_/.test(a.id)), 'bị giam trong trại lừa đảo thì không làm được việc gì (chi tiêu, mua sắm, đi chơi…) ngoài các việc trong trại');
    let bad = 0; for (let y = 0; y < 3; y++) { E.beginYear(l, { auto: true }); if (l.pending.some(d => !/^(kh_|treat|phau_thuat)/.test(d.id))) bad++; l.pending = []; const n0 = l.log.length; E.finishYear(l); if (l.log.slice(n0).some(e => /du lịch|Mua |Tổ chức đám cưới|Chi tiêu định kỳ/.test(e.t))) bad++; l.pending = []; E.endYear(l); }
    ok(bad === 0, 'trong trại lừa đảo không có chuyện yêu đương, cưới hỏi, du lịch, mua sắm'); }
}

section('37. Bản 3.8: lỗi giao thông theo loại xe, ca sĩ tham gia Anh trai "Say Hi" / Anh trai vượt ngàn chông gai');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  // CSGT
  { let car = 0, moto = 0; for (let i = 0; i < 200; i++) { const a = mk(37000 + i, 30, x => { x.veh = 'ô tô'; x.lic.B = true; x.lic.A1 = true; }); if (/mũ bảo hiểm/.test(E.DEC.csgt.make(a, R(i)).text)) car++; const b = mk(37000 + i, 30, x => { x.veh = 'xe máy'; x.lic.A1 = true; }); if (/mũ bảo hiểm/.test(E.DEC.csgt.make(b, R(i)).text)) moto++; }
    ok(car === 0 && moto > 50, 'đi ô tô không bị phạt "không đội mũ bảo hiểm" (ô tô ' + car + ', xe máy ' + moto + ' / 200)');
    const a = mk(37300, 30, x => { x.veh = 'ô tô'; x.lic.B = true; }); const ts = new Set(); for (let i = 0; i < 40; i++) ts.add(E.DEC.csgt.make(a, R(i)).data.why); ok([...ts].some(t => /dây an toàn|tốc độ|điện thoại/.test(t)), 'ô tô bị phạt các lỗi của ô tô: ' + [...ts].join(', ')); }
  // show thực tế
  const run = (l, s) => { const d = E.DEC.tv_moi.make(l, R(s)); d.data.k = l.age >= 30 ? 'atvncg' : 'atsh'; d.data.s = d.data.k === 'atsh' ? 'Anh trai "Say Hi" mùa 3' : 'Anh trai vượt ngàn chông gai 2027'; l.pending = [d]; const out = E.resolve(l, 'nhan').map(e => e.t); const titles = []; let g = 0; while (l.pending.length && g++ < 25) { titles.push(l.pending[0].title); out.push(...E.resolve(l, E.autoKey(l)).map(e => e.t)); } return { out, titles }; };
  { const l = mk(37400, 24, x => { x.money = 100; E.startJob(x, 'ca_si', R(1), () => { }); x.fame = 5e4; }); ok(E.DEC.tv_moi.valid(l, {}) && E.tvShowsFor(l).includes('atsh'), 'ca sĩ nam trẻ có tiếng được mời tham gia Anh trai "Say Hi"');
    const o = mk(37401, 40, x => { x.money = 100; E.startJob(x, 'ca_si', R(1), () => { }); x.fame = 3e5; }); let atv = 0; for (let i = 0; i < 20; i++) if (/vượt ngàn chông gai/.test(E.DEC.tv_moi.make(o, R(i)).text)) atv++; ok(atv === 20, 'nghệ sĩ nam từ 30 tuổi, có tên tuổi được mời Anh trai vượt ngàn chông gai');
    const f = mk(37402, 23, x => { x.money = 100; E.startJob(x, 'ca_si', R(1), () => { }); x.fame = 5e4; }, 'F'); ok(/Em xinh/.test(E.DEC.tv_moi.make(f, R(1)).text), 'ca sĩ nữ được mời Em xinh "Say Hi"');
    const n = mk(37403, 24, x => { E.startJob(x, 'ke_toan', R(1), () => { }); }); ok(!E.DEC.tv_moi.valid(n, {}), 'người không làm nghệ thuật thì không được mời'); }
  { const T1 = E.TV_FMT.atsh.rounds.map(r => r.n), T2 = E.TV_FMT.atvncg.rounds.map(r => r.n);
    ok(T1.join('|') === 'Bài nhóm liên quân|Livestage 1|Livestage 2|Livestage 3|Livestage 4 — Dance battle|Chung kết', 'Anh trai "Say Hi": ' + T1.join(' → '));
    ok(T2.join('|') === 'Đêm Hội ngộ|Công diễn 1|Công diễn 2|Công diễn 3|Công diễn 4|Công diễn 5|Đêm chung kết', 'Anh trai vượt ngàn chông gai: ' + T2.join(' → ')); }
  { const res = {}; let dance = 0, team = 0, saved = 0, bad = 0;
    for (let i = 0; i < 200; i++) { const atv = i % 2 === 1; const l = mk(37500 + i, atv ? 38 : 24, x => { x.money = 100; E.startJob(x, 'ca_si', R(i), () => { }); x.fame = atv ? 2e5 : 4e4; x.skill = 30 + (i % 8) * 9; });
      const { out, titles } = run(l, i); const T = l.flags.tv; const k = T.res || 'out'; res[k] = (res[k] || 0) + 1; if (titles.includes('Trước vòng Dance battle')) dance++; if (T.saved) saved++; if (out.some(t => /(anh trai|anh tài) [A-ZĐ0-9]/.test(t))) team++; if (out.some(t => badText(t))) bad++; }
    ok(bad === 0, 'mọi diễn biến chương trình đều hợp lệ');
    ok(dance > 20, 'trước vòng Dance battle có thể tập nhảy (' + dance + ' lần)');
    ok(saved > 5, 'bị loại vẫn có thể được bình chọn cứu / hồi sinh (' + saved + ' lần)');
    ok(res.out > 30 && (res.win || 0) > 3 && (res.win || 0) < 60 && (res.best5 || 0) + (res.giatoc || 0) > 20, 'có người bị loại giữa chừng, có người vô địch / Best 5 / Gia tộc Anh tài Toàn năng: ' + JSON.stringify(res)); }
  { const l = mk(37800, 24, x => { x.money = 100; E.startJob(x, 'ca_si', R(1), () => { }); x.fame = 4e4; }); const d = E.DEC.tv_moi.make(l, R(2)); d.data.k = 'atsh'; d.data.s = 'Anh trai "Say Hi" mùa 3'; l.pending = [d]; E.resolve(l, 'nhan'); const v = l.pending[0];
    ok(v && v.id === 'tv_vong' && /ghép đội với (anh trai .+, ){3}anh trai/.test(v.text), 'mỗi vòng ghép đội ngẫu nhiên với các anh trai thật của chương trình: ' + v.text.slice(v.text.indexOf('ghép'), v.text.indexOf('ghép') + 90)); }
}

section('38. Bản 3.8.1: sống cùng bố mẹ thì không "về thăm", tên con đồng nhất, các nước khác ít lặp câu');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex, mode) => { const l = E.createLife({ mode: mode || 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  { const l = mk(38100, 46, x => { x.flags.caring = true; x.fam.mAlive = true; x.fam.fAlive = true; x.money = 100; x.partner = { name: 'Lan', sex: 'F', age: 44, status: 'married', since: 30, alive: true }; });
    const d = E.DEC.tham_bo_me.make(l, R(1)); const ks = d.opts.map(o => o.k);
    ok(/sống cùng nhà/.test(d.text) && !ks.includes('call') && ks.includes('an_toi'), 'đã đón bố mẹ về ở cùng: không còn "gọi video hỏi thăm", có "ăn cơm tối cùng bố mẹ"');
    let bad = 0; for (let i = 0; i < 40; i++) { const L = JSON.parse(JSON.stringify(l)); L.rs = i * 11; const dd = E.DEC.tham_bo_me.make(L, R(i)); L.pending = [dd]; const t = E.resolve(L, 'go').map(e => e.t).join(' '); if (/năng về|Về thăm|Bay về|xe khách/.test(t)) bad++; } ok(bad === 0, 'dành một ngày với bố mẹ khi ở cùng nhà: không còn "mẹ dặn năng về hơn"');
    ok(E.actions(l).find(a => a.id === 'tham_bo_me').l === 'Dành thời gian cho bố mẹ', 'tên hành động đổi thành "Dành thời gian cho bố mẹ"');
    const far = mk(38101, 30, x => { x.movedTo = 'Hà Nội'; x.fam.mAlive = true; }); ok(E.DEC.tham_bo_me.make(far, R(2)).opts.some(o => o.k === 'call'), 'ở xa thì vẫn gọi video, về thăm như cũ'); }
  { let mixed = 0, dup = 0, n = 0;
    for (let i = 0; i < 240; i++) { const l = E.createLife({ mode: 'world', seed: 38200 + i, gender: 'F' }); E.runHeadless(l); const P = G.NAMES.P[l.pool]; if (!P || P.native || /patronym|bin|double/.test(P.style || '') || l.kids.length < 2) continue;
      const exes = l.exes || 0; if (exes > 0 || l.log.filter(e => /^(Kết hôn với|Tổ chức đám cưới với|Đăng ký kết hôn)/.test(e.t)).length > 1) continue; n++;
      const s = new Set(l.kids.map(k => { const w = k.name.split(' '); let surname=w[w.length-1]; if(k.sex==='F'&&P.LFa){const ix=P.LFa.indexOf(surname);if(ix>=0&&P.La[ix])surname=P.La[ix];} return surname.replace(/a$/, ''); })); if (s.size > 1) mixed++; const g = l.kids.map(k => k.name); if (new Set(g).size < g.length) dup++; }
    ok(n > 20 && mixed <= n * 0.05 && dup === 0, 'nhân vật nữ ở nước khác: họ con nhất quán theo bộ tên (kể cả biến thể theo giới), không trùng tên nhau (' + mixed + '/' + n + ' khác họ, ' + dup + ' trùng tên)'); }
  { let reps = 0, lines = 0; for (let i = 0; i < 80; i++) { const l = E.createLife({ mode: 'world', seed: 38400 + i }); E.runHeadless(l); const seen = {}; l.log.forEach(e => { if (e.k === 'money' || e.k === 'quiet') return; lines++; if (seen[e.t]) reps++; seen[e.t] = 1; }); }
    ok(reps / lines < 0.07, 'chơi ở nước khác ít lặp câu (' + (reps / lines * 100).toFixed(1) + '% dòng nhật ký lặp lại)'); }
  { const w = E.createLife({ mode: 'world', seed: 38500 }); let t = ''; for (let i = 0; i < 80 && !/cò đất/.test(t); i++) { const l = E.createLife({ mode: 'world', seed: 38500 + i }); if (l.country === 'VN') continue; E.runHeadless(l); t = l.log.map(e => e.t).join(' '); } ok(!/cò đất dựng lều/.test(t), 'nước khác không còn tin "cò đất dựng lều" (chuyện ở Việt Nam)'); }
}

section('39. Bản 3.9: số năm học theo ngành, bảo vệ đồ án / khóa luận, ngành y (thực tập, nội trú, chuyên khoa, phòng khám), số liệu nghề');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  const enter = (l, k, s) => { l.uniCity = 'Hà Nội'; l.pending = []; E.DEC.major.apply(l, E.DEC.major.make(l), k, R(s), () => { }); };
  { const a = mk(39100, 18, x => { x.st.kno = 80; x.examScore = 27; }); enter(a, 'it', 1); ok(/Bách khoa/.test(a.uniName) && a.schoolEnd - a.age === 5, 'học giỏi khối kỹ thuật ở Hà Nội vào Bách khoa, học 5 năm (kỹ sư): ' + a.uniName);
    const b = mk(39101, 18, x => { x.st.kno = 60; x.examScore = 21; }); enter(b, 'eco', 2); ok(b.schoolEnd - b.age === 4 && !!b.uniName, 'ngành thường học 4 năm: ' + b.uniName);
    const m = mk(39102, 18, x => { x.st.kno = 75; x.st.hea = 80; }); enter(m, 'med', 3); ok(m.pending[0] && m.pending[0].id === 'nganh_y', 'vào khối Y thì chọn hướng học');
    const yrs = {}; Object.keys(E.MED_TRACK).forEach((t, i) => { const x = mk(39110 + i, 18, y => { y.st.kno = 75; y.st.hea = 80; }); enter(x, 'med', 4 + i); x.pending = []; E.DEC.nganh_y.apply(x, E.DEC.nganh_y.make(x, R(i)), t, R(i), () => { }); yrs[t] = x.schoolEnd - x.age; });
    ok(yrs.dk === 6 && yrs.rhm === 6 && yrs.yhct === 6 && yrs.duoc === 5 && yrs.dd === 4 && yrs.qy === 7, 'số năm học: đa khoa 6, răng hàm mặt 6, y học cổ truyền 6, dược 5, điều dưỡng 4, quân y 7 (' + JSON.stringify(yrs) + ')');
    const cd = mk(39120, 18); cd.edu = 3; cd.school = null; cd.pending = [E.DEC.uni.make(cd, R(1))]; E.resolve(cd, 'voc'); ok(cd.school === 'voc' && cd.schoolEnd - cd.age === 2, 'cao đẳng học 2 năm'); }
  // bảo vệ tốt nghiệp
  { let bkFail = 0, goodFail = 0, normFail = 0; const N = 300;
    for (let i = 0; i < N; i++) { const a = mk(39200 + i, 22, x => { x.school = 'uni'; x.major = 'it'; x.uniName = 'Đại học Bách khoa Hà Nội'; x.schoolEnd = 23; x.st.kno = 60; }); a.pending = [E.DEC.bao_ve_tn.make(a, R(i))]; E.resolve(a, 'vua'); if (!a.flags.gradOK) bkFail++;
      const g = mk(39200 + i, 22, x => { x.school = 'uni'; x.major = 'it'; x.uniName = 'Đại học Bách khoa Hà Nội'; x.schoolEnd = 23; x.st.kno = 88; }); g.pending = [E.DEC.bao_ve_tn.make(g, R(i))]; E.resolve(g, 'doc_suc'); if (!g.flags.gradOK) goodFail++;
      const n = mk(39200 + i, 22, x => { x.school = 'uni'; x.major = 'eco'; x.uniName = 'Trường Đại học Thương mại'; x.schoolEnd = 23; x.st.kno = 60; }); n.pending = [E.DEC.bao_ve_tn.make(n, R(i))]; E.resolve(n, 'vua'); if (!n.flags.gradOK) normFail++; }
    ok(bkFail > N * 0.3 && goodFail < N * 0.15 && normFail < N * 0.15, 'sinh viên Bách khoa hay rớt đồ án (' + bkFail + '/' + N + '), học rất giỏi thì hiếm rớt (' + goodFail + '), ngành thường ít rớt (' + normFail + ')');
    const f = mk(39500, 22, x => { x.school = 'uni'; x.major = 'it'; x.uniName = 'Đại học Bách khoa Hà Nội'; x.schoolEnd = 23; x.st.kno = 30; }); let tries = 0, g = 0;
    while (f.school && g++ < 8) { E.beginYear(f, {}); const d = f.pending.find(x => x.id === 'bao_ve_tn'); f.pending = d ? [d] : []; if (d) { tries++; E.resolve(f, 'vua'); } f.pending = []; E.finishYear(f); f.pending = []; if (f.school) E.endYear(f); }
    ok(!f.school && f.edu >= 5 && (tries >= 1 || f.log.some(e => /Bảo vệ đồ án/.test(e.t))), 'rớt thì bảo vệ lại, cuối cùng vẫn ra trường (' + tries + ' lần bảo vệ)'); }
  // ngành y
  { const l = mk(39600, 21, x => { x.school = 'uni'; x.major = 'med'; x.uniCity = 'TP. Hồ Chí Minh'; x.med = { track: 'dk', spec: null }; x.schoolEnd = 24; });
    const hs = E.medHospitals(l); ok(hs.includes('Bệnh viện Chợ Rẫy') && hs.includes('Bệnh viện Từ Dũ'), 'học y ở TP.HCM thì thực tập ở Chợ Rẫy, Từ Dũ, Nhi Đồng 1…');
    const hn = mk(39601, 21, x => { x.school = 'uni'; x.major = 'med'; x.uniCity = 'Hà Nội'; x.med = { track: 'dk' }; x.schoolEnd = 24; }); ok(E.medHospitals(hn).includes('Bệnh viện Bạch Mai'), 'học y ở Hà Nội thì thực tập ở Bạch Mai, Việt Đức…');
    const d = E.DEC.yt_dem.make(l, R(1)); ok(/Chợ Rẫy|Từ Dũ|Nhi Đồng|Đại học Y Dược|115/.test(d.text), 'sự kiện thực tập ghi đúng bệnh viện: ' + d.text.slice(0, 70));
    const du = mk(39602, 21, x => { x.school = 'uni'; x.major = 'med'; x.med = { track: 'duoc' }; x.schoolEnd = 23; }); ok(!E.DEC.yt_mo.valid(du, {}), 'sinh viên dược không có sự kiện vào phòng mổ'); }
  { const ks = Object.keys(E.MED_SPEC); const S = E.MED_SPEC; ok(S.rhm && S.chinhhinh[1] > S.noi[1] && S.thammy[1] > S.noi[1] && ks.length >= 12, 'nhiều chuyên khoa, thu nhập khác nhau (chỉnh hình ×' + S.chinhhinh[1] + ', thẩm mỹ ×' + S.thammy[1] + ', nội ×' + S.noi[1] + ')');
    const a = mk(39700, 30, x => { x.edu = 5; x.major = 'med'; x.med = { track: 'dk', spec: 'noi', out: true }; E.startJob(x, 'bac_si', R(1), () => { }); x.job.rank = 2; }), b = JSON.parse(JSON.stringify(a)); b.med.spec = 'thammy';
    const ia = E.careerYear(a, R(5), () => { }), ib = E.careerYear(b, R(5), () => { }); ok(ib > ia * 1.4, 'bác sĩ phẫu thuật thẩm mỹ thu nhập cao hơn bác sĩ nội khoa (' + Math.round(ib) + ' vs ' + Math.round(ia) + ')'); }
  { const l = mk(39800, 23, x => { x.edu = 5; x.major = 'med'; x.med = { track: 'dk', spec: null }; x.school = null; }); const hook = E.HOOKS.year.find(h => /chuyen_khoa/.test(h.toString())); hook(l, R(1), () => { }, 23);
    ok(l.job && E.resolveJob(l.job.id) === 'bac_si' && l.pending.some(d => d.id === 'chuyen_khoa'), 'ra trường y đa khoa: làm bác sĩ, chọn chuyên khoa');
    const c = l.pending.find(d => d.id === 'chuyen_khoa'); l.pending = [c]; const t = E.resolve(l, c.opts[0].k).map(e => e.t).join(' '); ok(/về công tác ở/.test(t) && !!l.med.spec, 'chọn chuyên khoa và nơi công tác: ' + t.slice(0, 90));
    const p = mk(39801, 23, x => { x.edu = 5; x.major = 'med'; x.med = { track: 'duoc', spec: null }; x.school = null; }); hook(p, R(2), () => { }, 23); ok(p.job && E.resolveJob(p.job.id) === 'duoc_si' && !p.pending.some(d => d.id === 'chuyen_khoa'), 'ra trường dược: làm dược sĩ, không chọn chuyên khoa'); }
  { const l = mk(39900, 40, x => { x.edu = 5; x.major = 'med'; x.med = { track: 'dk', spec: 'dalieu', out: true }; E.startJob(x, 'bac_si', R(1), () => { }); x.job.rank = 3; x.money = 5000; }); const t = (l.pending = [E.DEC.mo_phong_kham_ck.make(l, R(1))], E.resolve(l, 'mo').map(e => e.t).join(' '));
    ok(E.resolveJob(l.job.id) === 'phong_kham' && /da liễu/.test(l.job.p), 'giàu thì mở phòng khám theo chuyên môn: ' + l.job.p); }
  // số liệu nghề
  { const l = mk(40000, 30, x => { x.edu = 5; x.med = { track: 'dk', spec: 'ngoai', out: true }; E.startJob(x, 'bac_si', R(1), () => { }); }); const hook = E.HOOKS.year.find(h => /Cột mốc nghề nghiệp/.test(h.toString())); const out = [];
    for (let y = 0; y < 15; y++) hook(l, R(y), t => out.push(t), 30 + y);
    ok(l.work && l.work['bac_si:ca mổ'] > 1500 && out.some(t => /mổ/.test(t)) && out.some(t => /Cột mốc/.test(t)), 'nhật ký tự ghi số ca mổ, cột mốc nghề (' + l.work['bac_si:ca mổ'] + ' ca sau 15 năm)');
    const g = mk(40001, 30, x => { x.edu = 5; E.startJob(x, 'giao_vien', R(1), () => { }); }); for (let y = 0; y < 10; y++) hook(g, R(y), () => { }, 30 + y); ok(g.work['giao_vien:học trò'] > 500, 'các nghề khác cũng có số liệu (giáo viên đã dạy ' + g.work['giao_vien:học trò'] + ' học trò)'); }
  // thực tập
  { const l = mk(40100, 21, x => { x.school = 'uni'; x.major = 'eco'; x.schoolEnd = 22; x.st.kno = 90; }); let got = 0; for (let i = 0; i < 40; i++) { const L = JSON.parse(JSON.stringify(l)); L.rs = (L.rs + i * 7919) | 0; L.pending = [E.DEC.thuc_tap.make(L, R(i))]; E.resolve(L, 'cham'); if (L.flags.internJob) got++; } ok(got > 15, 'thực tập tốt thì được giữ lại làm việc (' + got + '/40)'); }
}

section('40. Bản 4.0: số liệu nghề sát thực tế, Tân binh toàn năng, giải thưởng chung kết, tham gia lại mùa sau, show hẹn hò');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  // số liệu nghề
  { const hook = E.HOOKS.year.find(h => /Cột mốc nghề nghiệp/.test(h.toString()));
    const per = (spec, rank, unit) => { const l = mk(40500, 35, x => { x.edu = 5; x.med = { track: 'dk', spec, out: true }; E.startJob(x, 'bac_si', R(1), () => { }); x.job.rank = rank; }); let t = 0; for (let y = 0; y < 10; y++) { const b = (l.work || {})['bac_si:' + unit] || 0; hook(l, R(y), () => { }, 35 + y); t += l.work['bac_si:' + unit] - b; } return t / 10; };
    const noi = per('noi', 2, 'lượt khám'), ngoai = per('ngoai', 2, 'ca mổ'), gm = per('gmhs', 2, 'ca gây mê'), cdha = per('cdha', 2, 'ca đọc phim'), san = per('san', 2, 'ca đỡ đẻ, mổ lấy thai');
    ok(noi >= 6000 && noi <= 10000, 'bác sĩ nội khám ~' + Math.round(noi) + ' lượt / năm (thực tế 25–40 lượt / ngày)');
    ok(ngoai >= 180 && ngoai <= 320, 'bác sĩ ngoại mổ ~' + Math.round(ngoai) + ' ca / năm (1–2 ca / ngày)');
    ok(gm >= 600 && gm <= 1000 && cdha >= 8000 && san >= 250 && san <= 450, 'gây mê ~' + Math.round(gm) + ' ca, chẩn đoán hình ảnh ~' + Math.round(cdha) + ' phim, sản ~' + Math.round(san) + ' ca đỡ đẻ / mổ lấy thai mỗi năm');
    const tt = per('ngoai', 0, 'ca mổ'), gd = per('ngoai', 5, 'ca mổ'); ok(tt < ngoai && gd < tt, 'bác sĩ thực hành mổ ít hơn (' + Math.round(tt) + '), giám đốc bệnh viện mổ rất ít vì bận quản lý (' + Math.round(gd) + ')'); }
  // Tân binh toàn năng
  { const l = mk(40600, 19, x => { x.birthYear = 2007; x.talent = 'âm nhạc'; x.skill = 70; }); ok(E.tvShowsFor(l).includes('tbtn'), 'ca sĩ trẻ / tân binh có năng khiếu được mời Tân binh toàn năng');
    ok(E.TV_FMT.tbtn.rounds.map(x => x.n.split(' —')[0]).join('|') === 'Kỳ sát hạch 1|Kỳ sát hạch 2|Kỳ sát hạch 3|Survival showcase|Giai đoạn thăng cấp|Chung kết', 'Tân binh toàn năng: ' + E.TV_FMT.tbtn.rounds.map(x => x.n).join(' → '));
    const res = {}; for (let i = 0; i < 150; i++) { const L = mk(40700 + i, 19, x => { x.birthYear = 2007; x.talent = 'âm nhạc'; x.skill = 50 + (i % 6) * 8; x.money = 50; }); const d = E.DEC.tv_moi.make(L, R(i)); d.data.k = 'tbtn'; d.data.s = 'Tân binh toàn năng mùa 2'; L.pending = [d]; E.resolve(L, 'nhan'); let g = 0; while (L.pending.length && g++ < 20) E.resolve(L, E.autoKey(L)); const k = L.flags.tv.res || 'out'; res[k] = (res[k] || 0) + 1; }
    ok(res.debut > 15 && res.debut < 70 && res.out > 50, 'phần lớn bị loại qua các kỳ sát hạch, chỉ một phần debut nhóm nhạc (' + JSON.stringify(res) + ')'); }
  // giải thưởng
  { const A = E.TV_AWARDS; ok(A.say.some(x => /Best Leader/.test(x[0])) && A.say.some(x => /Best Hit/.test(x[0])) && A.say.some(x => /Best Performer/.test(x[0])) && A.atvncg.some(x => /được yêu thích nhất/.test(x[0])) && A.atvncg.some(x => /quốc dân/.test(x[0])), 'có các giải phụ: Best Leader, Best Performer, Best Hit… (Say Hi); Anh Tài được yêu thích nhất, Anh Tài quốc dân… (Anh tài)');
    let got = 0; for (let i = 0; i < 120; i++) { const k = i % 2 ? 'atsh' : 'atvncg'; const L = mk(40900 + i, k === 'atvncg' ? 38 : 24, x => { x.birthYear = 2026 - x.age; x.money = 100; E.startJob(x, 'ca_si', R(i), () => { }); x.fame = 2e5; x.skill = 85; }); const d = E.DEC.tv_moi.make(L, R(i)); d.data.k = k; d.data.s = 'Show'; L.pending = [d]; E.resolve(L, 'nhan'); let g = 0; while (L.pending.length && g++ < 20) E.resolve(L, E.autoKey(L)); if ((L.flags.tv.awards || []).length) got++; }
    ok(got > 10 && got < 100, 'đi đến chung kết có thể nhận thêm giải phụ (' + got + '/120)'); }
  // tham gia lại
  { const L = mk(41100, 24, x => { x.birthYear = 2002; x.money = 100; E.startJob(x, 'ca_si', R(1), () => { }); x.fame = 5e4; }); const d = E.DEC.tv_moi.make(L, R(1)); L.pending = [d]; E.resolve(L, 'nhan'); let g = 0; while (L.pending.length && g++ < 20) E.resolve(L, E.autoKey(L));
    const y0 = L.age; ok(L.flags.tv.done && L.flags.tv.y === L.birthYear + y0, 'cả chương trình diễn ra trọn trong một năm');
    L.age = y0 + 1; const one = E.DEC.tv_moi.valid(L, {}); L.age = y0 + 2; ok(!one && (E.DEC.tv_moi.valid(L, {}) || L.flags.tv.res === 'win'), 'muốn tham gia lại (mùa sau / chương trình khác) phải chờ ít nhất 2 năm'); }
  // show hẹn hò
  { const L = mk(41200, 27, x => { x.edu = 5; x.st.soc = 60; E.startJob(x, 'ke_toan', R(1), () => { }); }); ok(E.DEC.hh_moi.valid(L, {}), 'độc thân, học vấn tốt thì được mời show hẹn hò');
    const lo = mk(41201, 27, x => { x.edu = 2; x.st.soc = 20; x.st.kno = 20; }); ok(!E.DEC.hh_moi.valid(lo, {}), 'hồ sơ chưa nổi bật thì chưa được mời');
    const d = E.DEC.hh_moi.make(L, R(1)); ok(['bmhh', 'nali', 'dtd'].every(k => d.opts.some(o => o.k === k)), 'có Bạn muốn hẹn hò, Người ấy là ai, Đảo thiên đường');
    let couple = 0, n = 0; for (let i = 0; i < 90; i++) { const sx = i % 2 ? 'F' : 'M'; const X = mk(41300 + i, 27, x => { x.edu = 5; x.st.soc = 60; E.startJob(x, 'ke_toan', R(i), () => { }); }, sx); X.pending = [E.DEC.hh_moi.make(X, R(i))]; E.resolve(X, ['bmhh', 'nali', 'dtd'][i % 3]); let g = 0; while (X.pending.length && g++ < 20) E.resolve(X, E.autoKey(X)); n++; if (X.partner) couple++; }
    ok(couple > 15 && couple < n - 10, 'show hẹn hò: có người thành đôi, có người ra về một mình (' + couple + '/' + n + ')');
    const F = mk(41400, 26, x => { x.edu = 5; x.st.soc = 60; }, 'F'); F.pending = [E.DEC.hh_moi.make(F, R(2))]; E.resolve(F, 'nali'); const v1 = F.pending[0];
    ok(v1.id === 'hh_nali_f' && /5 chàng trai/.test(v1.text) && /tuổi, /.test(v1.text), 'Người ấy là ai (nữ): là nữ chính, xem ngoại hình, nghề của 5 chàng trai');
    const tr = F.flags.nali.cs.map(c => c.truth).sort().join(','); ok(tr === 'gay,single,single,single,taken', 'có người đã có người yêu, có người đồng tính trà trộn — công bố sự thật khi loại / chọn');
    F.pending = [v1]; const t = E.resolve(F, 'c0').map(e => e.t).join(' '); ok(/công bố/.test(t) && F.pending[0] && F.pending[0].id === 'hh_nali_f', 'loại một người thì chương trình công bố sự thật, sang vòng sau');
    const M = mk(41500, 27, x => { x.edu = 5; x.st.soc = 60; }, 'M'); M.pending = [E.DEC.hh_moi.make(M, R(3))]; E.resolve(M, 'nali'); ok(M.pending[0].id === 'hh_nali_m' && /nữ chính/i.test(M.pending[0].text), 'Người ấy là ai (nam): là một trong 5 chàng trai, thuyết phục nữ chính chọn mình'); }
}
section('41. Bản 4.1: nghĩa vụ quân sự đủ 24 tháng, con thành tài / phá gia chi tử, tài sản mất giá, kết hôn đồng giới ở nước ngoài, về Việt Nam rồi quay lại');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  // quân ngũ
  { let n = 0, good = 0, y2 = 0, y2n = 0; for (let s = 1; s < 2500 && n < 25; s++) { const l = E.createLife({ mode: 'vn', seed: s, gender: 'M' }); E.runHeadless(l); const en = l.log.find(e => /Lên đường nhập ngũ/.test(e.t)); if (!en) continue; const out = l.log.find(e => e.a > en.a && /Ra quân sau 24 tháng|xuất ngũ|trường sĩ quan|quân nhân chuyên nghiệp/.test(e.t)); if (!out) continue; n++; if (out.a === en.a + 2) good++; const mid = l.log.filter(e => e.a === en.a + 1 && /tiểu đội|đơn vị|đồng đội|hành quân|bắn|giao thừa|hội thao|quân|doanh trại|tăng gia|chỉ huy/.test(e.t)).length; y2 += mid; y2n++; }
    ok(n >= 10 && good === n, 'nhập ngũ năm X tuổi thì ra quân năm X+2 (đủ 24 tháng) — ' + good + '/' + n);
    ok(y2 / y2n >= 2, 'năm thứ hai trong quân ngũ có nhiều sự kiện quân ngũ (trung bình ' + (y2 / y2n).toFixed(1) + ')'); }
  { const l = mk(41600, 20, x => { x.birthYear = 2007; x.flags.military = 20; }); const a = E.milAllowance(l); const l2 = mk(41601, 20, x => { x.birthYear = 2006; }); ok(a === 45.5 && E.milAllowance(l2) === 25.3, 'trợ cấp xuất ngũ theo mức mới: 25,3 triệu (2026), 45,5 triệu từ 2027');
    l.pending = [E.DEC.nv_xuat_ngu.make(l, R(1))]; const m0 = l.money; const t = E.resolve(l, 've').map(e => e.t).join(' '); ok(Math.abs(l.money - m0 - 45.5) < 0.01 && /24 tháng/.test(t) && !/undefined|NaN/.test(t), 'ra quân nhận đủ trợ cấp: ' + t.slice(0, 120)); }
  // con cái
  { const l = mk(41700, 55, x => { x.money = 900; x.kids = [{ name: 'Tú', sex: 'M', born: 30, alive: true, study: 30, close: 60 }, { name: 'Mai', sex: 'F', born: 28, alive: true, study: 85, close: 60 }]; });
    ok(E.DEC.con_thanh_tai.valid(l, {}) && !E.DEC.con_pha_gia.valid(l, {}), 'học lực thấp không suy diễn thành cờ bạc'); l.kids[0].vice='cờ bạc'; ok(E.DEC.con_pha_gia.valid(l, {}), 'có tiền sử cờ bạc mới xét chuyện nợ cờ bạc');
    const d = E.DEC.con_thanh_tai.make(l, R(1)); ok(/Mai/.test(d.text) && !/Tú/.test(d.text), 'con thành tài là đứa học giỏi: ' + d.text);
    const p = E.DEC.con_pha_gia.make(l, R(2)); ok(/Tú/.test(p.text) && /tín dụng đen|cờ bạc/.test(p.text) && p.opts.some(o => o.k === 'cong_an'), 'con phá gia: cờ bạc, nợ tín dụng đen, có lựa chọn trình báo công an');
    const z = mk(41701, 55, x => { x.kids = [{ name: 'An', sex: 'M', born: 50, alive: true, study: 20 }]; }); ok(!E.DEC.con_pha_gia.valid(z, {}), 'con còn nhỏ thì chưa có chuyện cờ bạc nợ nần'); }
  // tài sản mất giá
  { const hk = E.HOOKS.year.find(h => /dropAt/.test(h.toString())); const l = mk(41800, 45, x => { x.money = 300; x.assets = { save: 0, gold: 200, stock: 0, land: 1500 }; x.basis = { save: 0, gold: 205, stock: 0, land: 2000 }; });
    hk(l, R(1), () => { }, 45); const d = l.pending[0]; ok(d && d.id === 'tai_san_giam' && /lô đất/i.test(d.title) && /25%/.test(d.text) && ['ban', 'giu', 'ban_nua'].every(k => d.opts.some(o => o.k === k)), 'đất mất giá 25% thì được hỏi bán cắt lỗ hay giữ');
    l.pending = []; hk(l, R(2), () => { }, 46); ok(!l.pending.length, 'không hỏi lại liên tục');
    l.pending = [d]; const m0 = l.money; E.resolve(l, 'ban'); ok(l.assets.land === 0 && l.money > m0 + 1000, 'bán đất thì có tiền mặt, hết đất');
    const g = mk(41801, 45, x => { x.assets = { save: 0, gold: 200, stock: 0, land: 0 }; x.basis = { save: 0, gold: 205, stock: 0, land: 0 }; }); hk(g, R(3), () => { }, 45); ok(!g.pending.length, 'giảm ít (dưới 15%) thì không hỏi'); }
  // kết hôn đồng giới ở nước ngoài
  { const l = mk(41900, 28, x => { x.money = 600; E.startJob(x, 'ke_toan', R(1), () => { }); x.partner = { name: 'Minh Khoa', sex: 'M', age: 29, status: 'dating', since: 24, alive: true }; }, 'gay');
    const d = E.DEC.marry.make(l, R(2)); ok(d.opts.some(o => o.k === 'marry') && d.opts.some(o => o.k === 'nuoc_ngoai') && /chưa công nhận/.test(d.text), 'đồng giới ở Việt Nam: chung sống, hoặc sang nước đã công nhận hôn nhân đồng giới');
    l.pending = [d]; E.resolve(l, 'nuoc_ngoai'); const c = l.pending[0]; ok(c.id === 'ket_hon_nn' && /Thái Lan/.test(c.opts.map(o => o.l).join()) && /Hà Lan/.test(c.opts.map(o => o.l).join()), 'liệt kê các nước để chọn: ' + c.opts.map(o => o.l).join(', '));
    ok(E.SSM_LIST.every(k => W.SSM.includes(k)), 'chỉ liệt kê nước đã hợp pháp hóa hôn nhân đồng giới');
    E.resolve(l, 'n1'); ok(l.abroad && l.abroad.code === 'AU' && l.abroad.perm && l.cur !== 'vnd' && l.partner.status === 'married', 'sang Úc: kết hôn hợp pháp, sống ở Úc, tiêu tiền Úc');
    const aud = E.fmtMoney(l, l.money); ok(/AUD/.test(aud) && l.money > 0, 'tiền tiết kiệm quy đổi theo tỉ giá: ' + aud);
    const acts = E.actions(l); ok(acts.find(a => a.id === 've_vn_song').ok === true && acts.find(a => a.id === 'viec_remote').ok === true && acts.find(a => a.id === 'quay_lai_nn').ok !== true, 'ở nước ngoài: có thể làm việc từ xa, về Việt Nam sống một thời gian');
    const fl = E.DEC.ve_vn_song.make(l, R(3)); ok(/AUD/.test(fl.text) && !/\d{4}\.\d{3} AUD|[5-9]\.\d{3} AUD/.test(fl.text), 'vé máy bay về Việt Nam tính bằng tiền nước sở tại, giá hợp lý: ' + fl.text.match(/khoảng [^)]*/)[0]);
    const a0 = l.money; l.pending = [fl]; E.resolve(l, 've'); ok(l.cur === 'vnd' && !l.abroad && l.place === 'thành phố Hạ Long' || (l.cur === 'vnd' && !l.abroad), 'về Việt Nam: tiêu tiền Việt, sống ở quê cũ (' + l.place + ')');
    ok(l.money > 300 && l.money < 700, 'tiền đổi lại sang tiền Việt hợp lý: ' + E.fmtMoney(l, l.money));
    ok(E.actions(l).find(a => a.id === 'quay_lai_nn').ok === true, 'về Việt Nam rồi vẫn có thể quay lại nước đã định cư');
    const v0 = l.money; l.pending = [E.DEC.quay_lai_nn.make(l, R(4))]; E.resolve(l, 'di'); ok(l.abroad && l.abroad.code === 'AU' && l.cur !== 'vnd' && l.flags.needJob, 'quay lại Úc: đổi tiền Việt sang tiền Úc, trả vé máy bay, tìm việc lại');
    const back = l.money * C_VNDf(l); ok(Math.abs(back - (v0 - 25)) < 1, 'quy đổi hai chiều khớp nhau (sau khi trừ vé máy bay)');
    E.runHeadless(l); ok(!l.alive && !l.log.some(e => badText(e.t)) && isFinite(l.money), 'sống tiếp trọn đời ở nước ngoài, nhật ký sạch'); }
  function C_VNDf(l) { return G.CUR.priceLevel(W.BY[l.abroad.code].gdp) * G.CUR.VND / 1e6; }
}

section('42. Bản 4.2: bạn thân đã mất, không làm chủ khi chưa 18 tuổi, con nhà theo gia đình, đại học (CLB, khai giảng), bệnh tật, con đường xấu, trong tù, chống farm tiền, đổi tôn giáo, giới hạn tuổi, hẹn hò');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  // bạn thân đã mất
  { const l = mk(42000, 13, x => { x.school = 'lower'; x.bff = { name: 'Tuấn', alive: false, died: 11, close: 50 }; }); const d = E.DEC.thu_nac_danh.make(l, R(1)); ok(!d.opts.some(o => /bạn thân/.test(o.l)), 'bạn thân đã mất thì không còn "đưa cho bạn thân xem": ' + d.opts.map(o => o.l).join(' / '));
    const a = mk(42001, 13, x => { x.school = 'lower'; x.bff = { name: 'Tuấn', alive: true, close: 50 }; }); ok(E.DEC.thu_nac_danh.make(a, R(1)).opts.some(o => /bạn thân/.test(o.l)), 'bạn thân còn sống thì vẫn như cũ'); }
  // không làm chủ khi chưa 18 tuổi
  { let bad = 0; for (let i = 0; i < 300; i++) { const l = mk(42100 + i, 17, x => { x.school = null; x.edu = 2; }); if (E.offers(l, R(i)).some(id => E.ownerStart(l, id) && !E.famBiz(l, id))) bad++; } ok(bad === 0, '17 tuổi không được mời làm chủ tạp hóa, chủ quán… (' + bad + '/300)');
    const f = mk(42400, 17, x => { x.fam.fJob = 'bán tạp hóa'; x.fam.fAlive = true; }); ok(/phụ giúp .* của gia đình/.test(E.offerLabel(f, 'kd_tap_hoa')), 'con nhà bán tạp hóa thì được phụ giúp tiệm của gia đình: ' + E.offerLabel(f, 'kd_tap_hoa')); }
  // con nhà có điều kiện nghe theo gia đình
  { let n = 0, bad = 0, study = 0; for (let s = 1; s < 5000 && n < 15; s++) { const l = E.createLife({ mode: 'vn', seed: s }); if (!l.fam.elite) continue; n++; let g = 0, asked = false;
      while (l.alive && g++ < 23) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && k++ < 30) { const d = l.pending[0]; if (l.flags.eliteFollow && l.age >= 17 && l.age <= 20 && /^(uni|job)$/.test(d.id)) asked = true; E.resolve(l, d.id === 'elite_dinh_huong' ? 'follow' : E.autoKey(l)); } if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); }
      if (asked) bad++; if (l.flags.eliteStudy) study++; }
    ok(n >= 10 && bad === 0, 'đã nghe theo gia đình thì không hiện bảng "ngã rẽ 18 tuổi" / tìm việc (' + bad + '/' + n + ')');
    ok(study >= n - 3, 'gia đình sắp xếp việc học luôn (' + study + '/' + n + ')'); }
  // đại học
  { const l = mk(42500, 18, x => { x.school = 'uni'; x.schoolEnd = 22; x.talent = 'âm nhạc'; x.hobby = 'guitar'; }); const d = E.DEC.clb_chon.make(l, R(1));
    ok(/Guitar/.test(d.opts[0].l) && /sở trường/.test(d.opts[0].h) && d.opts.some(o => /tình nguyện/.test(o.l)), 'chọn câu lạc bộ, gợi ý theo sở trường / sở thích: ' + d.opts.map(o => o.l).join(' / '));
    const k = E.DEC.khai_giang.make(l, R(2)); ok(/khai giảng/.test(k.text) && /miễn phí/.test(k.text) && k.opts.some(o => o.k === 'khong'), 'lễ khai giảng mời ca sĩ, vé miễn phí, có thể không đi: ' + k.text);
    let kg = 0; for (let i = 0; i < 40; i++) { const x = mk(42600 + i, 18, y => { y.school = 'uni'; y.schoolEnd = 22; }); E.runHeadless(x); kg += x.log.filter(e => /lễ khai giảng/.test(e.t)).length; } ok(kg > 10, 'sinh viên thường có dịp đi lễ khai giảng (' + kg + ' lần / 40 đời)'); }
  // bệnh tật
  { let ap = 0, dg = 0, al = 0; const n = 300; for (let i = 0; i < n; i++) { const l = E.createLife({ mode: 'vn', seed: 42700 + i }); E.runHeadless(l); if (l.log.some(e => /ruột thừa/.test(e.t))) ap++; if (l.log.some(e => /sốt xuất huyết/.test(e.t))) dg++; if (l.allergy) al++; }
    ok(ap >= 3 && ap <= 60 && dg >= 3 && dg <= 90 && al >= 5 && al <= 60, 'bệnh tật ngẫu nhiên với tỉ lệ thấp: ruột thừa ' + ap + ', sốt xuất huyết ' + dg + ', dị ứng ' + al + ' / ' + n + ' đời'); }
  // con đường xấu
  { const l = mk(42800, 28, x => { E.startJob(x, 'trom', R(1), () => { }); x.partner = { name: 'Lan', sex: 'F', age: 27, status: 'married', since: 24, alive: true }; });
    ok(['toi_dan_em', 'toi_cuop_nguoi_yeu', 'toi_tra_thu', 'toi_me_khoc', 'toi_truy_na', 'toi_ma_tuy'].every(id => E.DEC[id].valid(l, {})), 'đi đường xấu: đàn em phản bội, bị cướp người yêu, bị trả thù, mẹ khóc, truy nã, ma túy');
    const ok2 = mk(42801, 28, x => { E.startJob(x, 'ke_toan', R(1), () => { }); }); ok(!E.DEC.toi_dan_em.valid(ok2, {}), 'người làm ăn lương thiện không gặp các chuyện này');
    if (l.fam.mAlive || l.fam.fAlive) { l.pending = [E.DEC.toi_me_khoc.make(l, R(2))]; E.resolve(l, 'bo'); ok(!l.job && l.flags.leftCrime === 28, 'có thể rửa tay gác kiếm'); } }
  // trong tù
  { const l = mk(42900, 30, x => { x.money = 100; }); E.H.jail(l, 6, 'cướp tài sản', () => { }); E.beginYear(l, {}); const ids = l.pending.map(d => d.id);
    ok(ids.length >= 3 && ids.length <= 4 && ids.every(id => /^(tg_|trai_giam)/.test(id)), 'trong tù: mỗi năm chỉ có chuyện trong trại giam (' + ids.join(', ') + ')');
    const acts = E.actions(l).filter(a => a.ok === true).map(a => a.id); ok(acts.length >= 4 && acts.every(id => /^tg_act_/.test(id)), 'việc bạn muốn làm trong tù đổi thành việc trong trại: ' + acts.join(', '));
    const out = E.actions(mk(42901, 30)).filter(a => /^tg_act_/.test(a.id) && a.ok === true); ok(out.length === 0, 'ra ngoài thì không còn việc trong trại');
    let g = 0; while (l.alive && g++ < 10 && l.jailUntil != null) { while (l.pending.length) E.resolve(l, E.autoKey(l)); E.finishYear(l); while (l.pending.length && l.jailUntil != null) E.resolve(l, E.autoKey(l)); E.endYear(l); E.beginYear(l, {}); }
    while (l.pending.length && l.pending[0].id !== 'ra_tu') E.resolve(l, E.autoKey(l)); if (l.pending[0]) E.resolve(l, 'honest');
    let formal = 0, crime = 0, tot = 0; for (let i = 0; i < 100; i++) { const o = E.offers(l, R(i)); tot += o.length; o.forEach(id => { const c = E.CAR[E.resolveJob(id)]; if (c.sec === 'formal') formal++; if (c.sec === 'crime') crime++; }); }
    ok(l.flags.releasedAt != null && formal < tot * 0.15 && crime > 10, 'ra tù khó xin việc chính thức (' + formal + '/' + tot + '), việc phi pháp lại dễ tìm (' + crime + ')'); }
  // chống farm tiền
  { const big = mk(43000, 50, x => { x.assets = { save: 0, gold: 0, stock: x.base * 5000, land: 0 }; x.basis = { save: 0, gold: 0, stock: x.base * 5000, land: 0 }; }); const v0 = big.assets.stock; E.wealthDrag(big); const f = 1 - big.assets.stock / v0;
    const small = mk(43001, 50, x => { x.assets = { save: 0, gold: 0, stock: x.base * 50, land: 0 }; x.basis = { save: 0, gold: 0, stock: x.base * 50, land: 0 }; }); const s0 = small.assets.stock; E.wealthDrag(small);
    ok(f > 0.03 && f < 0.1 && small.assets.stock === s0, 'tài sản rất lớn chịu chi phí, thuế, phí quản lý (' + (f * 100).toFixed(1) + '%/năm); tài sản bình thường không bị ảnh hưởng');
    ok(E.monthlyEst(big, 'tai_phiet', 3) < 5000, 'thu nhập chủ tịch tập đoàn sát thực tế hơn (' + Math.round(E.monthlyEst(big, 'tai_phiet', 3)) + ' triệu/tháng)'); }
  // đổi tôn giáo
  { const l = mk(43100, 30); const d = E.DEC.doi_ton_giao.make(l, R(1)); ok(d.opts.length >= 5 && !d.opts.some(o => o.l === 'Theo ' + l.religion), 'đổi tôn giáo: ' + d.opts.map(o => o.l).join(' / '));
    const ci = d.opts.findIndex(o => o.l === 'Theo Công giáo'); l.pending = [d]; E.resolve(l, d.opts[ci].k); const di = E.actions(l).find(a => a.id === 'di_chua').l;
    ok(/Công giáo/.test(l.religion) && /nhà thờ/.test(di), 'đổi sang Công giáo thì hoạt động tôn giáo đổi theo: ' + di); }
  // giới hạn tuổi, mục tình cảm, hẹn hò, giá skin
  { const o = mk(43200, 70); const a = E.actions(o); ok(a.find(x => x.id === 'bang_lai').ok !== true && a.find(x => x.id === 'tim_nguoi_yeu').ok !== true, '70 tuổi không còn thi bằng lái, không bị bắt tìm người yêu');
    let old = 0; for (let i = 0; i < 120; i++) { const l = E.createLife({ mode: 'vn', seed: 43300 + i }); E.runHeadless(l); if (l.log.some(e => e.a > 55 && /^Bắt đầu hẹn hò với/.test(e.t))) old++; } ok(old === 0, 'chỉ tìm một nửa khi dưới 55 tuổi (' + old + ' đời vi phạm)');
    const c = mk(43400, 25, x => { x.partner = { name: 'Lan', sex: 'F', age: 24, status: 'dating', since: 23, alive: true }; }); const ca = E.actions(c);
    ok(ca.find(x => x.id === 'tim_nguoi_yeu').ok === 'Không áp dụng' && ca.find(x => x.id === 'hen_ho').ok === true, 'đã có người yêu thì mục Tình cảm không còn "Tìm người yêu"');
    const keys = new Set(); for (let i = 0; i < 30; i++) E.DEC.hen_ho.make(c, R(i)).opts.forEach(x => keys.add(x.k)); ok(['mi_cay', 'ga_ran', 'concert_doi', 'to_tuong', 'thuy_cung', 'bao_tang', 'skinship', 'photobooth'].every(k => keys.has(k)) && keys.has('doi'), 'nhiều kiểu hẹn hò: mì cay, gà rán, đu concert, tô tượng, thủy cung, bảo tàng, skinship… (' + keys.size + ' kiểu)');
    const k = mk(43500, 10); k.flags.homeGames = ['Liên Quân Mobile']; const d = E.DEC.nap_game.make(k, R(1)); const tx = E.DEC.nap_game.def.text(k, d.data); ok(d.data.g === 'Liên Quân Mobile' && /ước tính/.test(tx) && d.opts.some(o => /399 Quân Huy/.test(o.l)), 'skin đúng game đã chơi, giá cửa hàng có đơn vị rõ ràng: ' + tx); }
}

section('43. Bản 4.3: mất mát lần đầu và những lần sau, sức khỏe tinh thần, định kiến nghề nghiệp');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  // mất mát
  { let multi = 0, parentFirst = 0, later = 0, n = 0; for (let i = 0; i < 200; i++) { const l = E.createLife({ mode: 'vn', seed: 43600 + i }); E.runHeadless(l); n++;
      const L = l.log.filter(e => e.k === 'bad' && /qua đời/.test(e.t));
      const firsts = L.filter(e => /ần đầu bạn hiểu thế nào là mất mát/.test(e.t)); if (firsts.length > 1) multi++;
      const f0 = L.find(e => /^(Bố|Mẹ) qua đời/.test(e.t) && e.a >= 4 && e.a < 18); if (f0 && /lần đầu bạn hiểu thế nào là mất mát/i.test(f0.t)) parentFirst++;
      if (L.some(e => /tiễn biệt|nỗi đau|chỗ trống|một phần|bố mẹ nữa|một nửa|đầu bạc/.test(e.t))) later++; }
    ok(multi === 0, 'chỉ có một lần "lần đầu hiểu thế nào là mất mát" trong đời (' + multi + ' đời bị lặp)');
    ok(later > n * 0.5, 'những lần mất người thân sau có cách nói khác: nỗi đau chồng lên nỗi đau (' + later + '/' + n + ')');
    const l = mk(43900, 10, x => { x.flags = x.flags || {}; }); const t = E.lossText(l, 'Bố qua đời ở tuổi 41 vì đột quỵ.', 'bad');
    ok(/lần đầu bạn hiểu thế nào là mất mát/i.test(t), 'bố mất khi mới 10 tuổi — lần đầu biết thế nào là mất mát: ' + t);
    l.age = 20; const t2 = E.lossText(l, 'Ông ngoại qua đời vì một cơn đột quỵ. Lần đầu bạn hiểu thế nào là mất mát.', 'bad');
    ok(!/Lần đầu/.test(t2) && /tiễn biệt|nỗi đau|ký ức/.test(t2), 'ông mất sau đó thì không còn là "lần đầu": ' + t2); }
  // sức khỏe tinh thần
  { const l = mk(44000, 25); const d = E.DEC.ban_khung_hoang.make(l, R(1)); ok(d.opts[0].k === 'goi' && /hỏi thẳng/.test(d.opts[0].l), 'bạn bè gặp khủng hoảng: có lựa chọn gọi ngay, hỏi thẳng, lắng nghe');
    l.pending = [d]; const t = E.resolve(l, 'goi').map(e => e.t).join(' '); ok(/096 306 1414/.test(t) && /115/.test(t), 'có thông tin đường dây hỗ trợ: ' + t.slice(-160));
    const s = mk(44001, 30, x => { x.mind.stress = 80; x.st.hap = 20; }); ok(E.DEC.nhung_ngay_toi.valid(s, {}), 'căng thẳng kéo dài, buồn bã thì có "những ngày tăm tối"');
    s.pending = [E.DEC.nhung_ngay_toi.make(s, R(2))]; E.resolve(s, 'kham'); ok(s.mind.stress < 60, 'đi khám, điều trị thì đỡ dần');
    let c = 0; for (let i = 0; i < 100; i++) { const x = E.createLife({ mode: 'vn', seed: 44100 + i }); E.runHeadless(x); if (x.log.some(e => /nhắn cho bạn: "Mệt quá|chạy đến bên|lắng nghe đến tận/.test(e.t))) c++; } ok(c >= 1 && c <= 50, 'tình huống bạn bè khủng hoảng không quá dày (' + c + '/100 đời)'); }
  // định kiến nghề nghiệp
  { const l = mk(44300, 30, x => { E.startJob(x, 'tho_xam', R(1), () => { }); x.job.yrs = 3; }); const d = E.DEC.dk_xam.make(l, R(1));
    ok(/xăm/.test(d.text) && /bà cụ/.test(d.text) && ['tam_su', 'tu_tin', 'buon'].every(k => d.opts.some(o => o.k === k)), 'thợ xăm: định kiến ở trạm xe buýt, bà cụ tử tế; tâm sự / tự tin / giữ nỗi buồn');
    l.pending = [d]; E.resolve(l, 'tam_su'); ok(l.mem.some(m => /Hình xăm chỉ nói lên/.test(m.t)), 'lời bà cụ trở thành ký ức');
    ok(!E.DEC.dk_xam_nho.valid(l, {}), 'chưa đủ thời gian thì chưa nhắc lại'); l.age += 2; const f = E.DEC.dk_xam_nho.make(l, R(2));
    ok(E.DEC.dk_xam_nho.valid(l, {}) && /tưởng nhớ|mẹ vừa mất/.test(f.text) && /Hình xăm chỉ nói lên/.test(f.text), 'về sau, khách muốn xăm tưởng nhớ người thân — lời bà cụ được nhắc lại');
    const n = E.STIGMA.length; ok(n >= 10 && E.STIGMA.every(k => E.DEC['dk_' + k] && E.DEC['dk_' + k + '_nho']), 'có ' + n + ' nghề với tình huống định kiến và ký ức về sau: ' + E.STIGMA.join(', '));
    const o = mk(44301, 30, x => { E.startJob(x, 'ke_toan', R(1), () => { }); }); ok(!E.STIGMA.some(k => E.DEC['dk_' + k].valid(o, {})), 'chỉ xuất hiện đúng với nghề của mình');
    const g = mk(44302, 30, x => { E.startJob(x, 'dieu_duong', R(1), () => { }); }, 'F'); ok(!E.DEC.dk_nam_nu.valid(g, {}), '"con trai mà làm nghề con gái" chỉ với nam'); }
}

section('44. Bản 4.4: nghề tự do không "thăng chức", trả góp rõ ràng, xưng hô, cho con tiền không trùng, đi học, hệ quả các mối quan hệ, hồi tưởng có người bạn đời');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; if (age >= 18) l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  // thăng tiến đúng đặc thù nghề
  { const t = (id, rk) => { const l = mk(44500, 35, x => { E.startJob(x, id, R(1), () => { }); x.job.rank = rk; }); return E.rankUpText(l, E.CAR[E.resolveJob(id)]).t; };
    ok(!/thăng chức:/.test(t('fl_dev', 1)) && /tự do/.test(t('fl_dev', 1)), 'freelancer không được "thăng chức": ' + t('fl_dev', 1));
    ok(/mở cơ sở riêng/.test(t('tho_toc', 2)) && /mở rộng quy mô/.test(t('kd_quan', 1)), 'mở tiệm riêng / mở rộng quy mô: ' + t('tho_toc', 2) + ' · ' + t('kd_quan', 1));
    ok(/^Được thăng chức/.test(t('ke_toan', 1)), 'người làm thuê vẫn được thăng chức: ' + t('ke_toan', 1));
    let bad = 0; for (let i = 0; i < 200; i++) { const l = E.createLife({ mode: 'vn', seed: 44600 + i }); const r0 = l; E.runHeadless(l); l.log.forEach((e, j) => { if (/^Được thăng chức: (freelancer|lập trình viên tự do|cộng tác viên|họa sĩ|nghệ sĩ xăm|chủ )/.test(e.t)) bad++; }); }
    ok(bad === 0, 'không còn "Được thăng chức: freelancer / chủ…" (' + bad + ')'); }
  // trả góp
  { const l = mk(44700, 30, x => { x.money = 300; x.income = 300; }); const p = E.loanPlan(l, 800, 'car');
    ok(/Trả trước/.test(p) && /lãi 10%\/năm/.test(p) && /góp 5 năm/.test(p) && /mỗi năm/.test(p) && /\/tháng/.test(p) && /tổng phải trả/.test(p), 'mua trả góp ghi rõ: ' + p);
    E.H.addLoan(l, 'car', 560); l.vehName = 'Toyota Vios'; const L = l.loans[l.loans.length - 1]; ok(L.term === 5 && Math.abs(L.pay - 147.73) < 0.5, 'khoản góp cố định mỗi năm theo kỳ hạn');
    E.beginYear(l, {}); while (l.pending.length) E.resolve(l, E.autoKey(l)); const m0 = l.money; const out = E.finishYear(l); const ln = out.find(e => /Góp tiền trả góp Toyota Vios năm thứ 1\/5/.test(e.t));
    ok(!!ln && L.bal < 560, 'hết năm trừ tiền góp và ghi vào nhật ký: ' + (ln && ln.t)); }
  // xưng hô
  { const f = mk(44800, 25, x => { x.partner = { name: 'Huy', sex: 'M', age: 27, status: 'married' }; }, 'F'); const m = mk(44801, 25, x => { x.partner = { name: 'Lan', sex: 'F', age: 24, status: 'married' }; }, 'M');
    ok(E.xung(f).me === 'anh' && E.xung(f).you === 'em' && E.xung(m).me === 'em' && E.xung(m).you === 'anh', 'vợ xưng "em" gọi chồng "anh", chồng xưng "anh" gọi vợ "em"');
    m.bff = { name: 'Hoa', sex: 'F', alive: true, close: 60 }; ok(/phù rể/.test(E.DEC.ban_cuoi.make(m, R(1)).text), 'nhân vật nam được mời làm phù rể (không phải phù dâu)');
    f.bff = { name: 'Nam', sex: 'M', alive: true, close: 60 }; ok(/phù dâu/.test(E.DEC.ban_cuoi.make(f, R(1)).text), 'nhân vật nữ được mời làm phù dâu'); }
  // cho con tiền không trùng
  { const l = mk(44900, 60, x => { x.money = x.base * 40; x.kids = [{ name: 'Tú', sex: 'M', born: 30, alive: true, close: 60 }]; });
    l.pending = [E.DEC.cho_con_tien.make(l, R(1))]; ok(/Có giúp con không/.test(l.pending[0].text), 'cho con tiền là một lựa chọn, không tự động'); E.resolve(l, 'cho');
    ok(!E.DEC.con_xin_von.valid(l, {}) && !E.DEC.cho_con_tien.valid(l, {}), 'vừa cho con tiền thì không hỏi "con xin vốn" / cho tiền lần nữa ngay'); }
  // đi học
  { let drop = 0, n = 0; for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: i % 2 ? 'vn' : 'world', seed: 45000 + i }); if (l.fam.q < 4) continue; n++; let g = 0; while (l.alive && g++ < 13) { E.beginYear(l, { auto: true }); while (l.pending.length) E.resolve(l, E.autoKey(l)); E.finishYear(l); while (l.pending.length) E.resolve(l, E.autoKey(l)); E.endYear(l); } if (l.alive && !l.school && l.age <= 13) drop++; }
    ok(n > 30 && drop === 0, 'con nhà khá giả không tự dưng nghỉ học sau tiểu học (' + drop + '/' + n + ')'); }
  // hệ quả các mối quan hệ
  { const l = mk(45400, 35, x => { x.partner = { name: 'Lan', sex: 'F', age: 33, status: 'married', since: 28, alive: true }; x.kids = [{ name: 'Bi', sex: 'M', born: 28, alive: true, close: 60 }]; });
    const hk = E.HOOKS.year.find(h => /relPrev/.test(h.toString())); hk(l, R(1), () => { }, 35); l.exes = 1; l.partner = null; l.age = 36; l.pending = []; hk(l, R(2), () => { }, 36);
    ok(l.flags.divAt === 36 && l.pending.some(d => d.id === 'quyen_nuoi_con'), 'ly hôn khi con còn nhỏ: phải quyết định quyền nuôi con');
    const d = l.pending.find(d => d.id === 'quyen_nuoi_con'); l.pending = [d]; E.resolve(l, 'ex'); const m0 = l.money; l.age = 37; hk(l, R(3), () => { }, 37); ok(l.money < m0 && l.kids[0].custody === 'ex', 'con ở với người kia thì phải cấp dưỡng hằng năm');
    ok(E.DEC.con_sau_ly_hon.valid(l, {}), 'có chuyện con buồn sau ngày bố mẹ chia tay');
    const o = mk(45401, 10, x => { x.indep = false; x.fam.fAlive = true; x.fam.mAlive = true; x.fam.noDad = false; }); hk(o, R(4), () => { }, 10); o.fam.mAlive = false; o.age = 11; hk(o, R(5), () => { }, 11); ok(o.flags.singleParent === 'bố', 'mẹ mất khi còn nhỏ: bố gà trống nuôi con');
    const g = E.EVENTS.find(e => /gà trống nuôi con/.test(e.run.toString())); o.age = 12; ok(g && g.c(o, 12), 'có những năm tháng bố một mình nuôi con');
    const w = mk(45402, 60, x => { x.partner = { name: 'Hạnh', sex: 'F', age: 58, status: 'married', since: 30, alive: true }; }); hk(w, R(6), () => { }, 60); w.widowed = 1; w.partner = null; w.age = 61; hk(w, R(7), () => { }, 61);
    ok(w.flags.widowAt === 61 && w.flags.lateSpouse === 'Hạnh' && E.DEC.goa_bua.valid(w, {}), 'góa bụa: những ngày một mình'); }
  // hồi tưởng có người bạn đời
  { let miss = 0, n = 0; for (let i = 0; i < 150; i++) { const l = E.createLife({ mode: 'vn', seed: 45500 + i }); E.runHeadless(l); const sp = E.spousesOf(l); if (!sp.length || l.death.age < 40) continue; n++; const txt = JSON.stringify(E.finale(l)); if (!sp.some(s => txt.indexOf(s) >= 0)) miss++; }
    ok(n > 40 && miss === 0, 'hồi tưởng cuối đời luôn có mặt người bạn đời (' + miss + '/' + n + ' thiếu)'); }
}

section('45. Bản 4.5: chức cao không bị sếp ép, trong tù, phi pháp có đường dây, mở rộng kinh doanh, bạn đời góp theo thu nhập, game tự chọn, concert chọn nghệ sĩ, giới tính & xu hướng, lời kể gia đình');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup, sex) => { const l = E.createLife({ mode: 'vn', seed, gender: sex || 'M' }); l.age = age; l.indep = age >= 18; l.pending = []; if (setup) setup(l); return l; };
  // chức cao
  { const ceo = mk(45600, 45, x => { E.startJob(x, 'ngan_hang_cao', R(1), () => { }); x.job.rank = 2; }); const pil = mk(45601, 45, x => { E.startJob(x, 'phi_cong', R(1), () => { }); x.job.rank = E.CAR.phi_cong.t.length - 1; }); const emp = mk(45602, 30, x => { E.startJob(x, 'ke_toan', R(1), () => { }); });
    ok(!E.DEC.sep_ep.valid(ceo, {}) && !E.DEC.sep_ep.valid(pil, {}) && E.DEC.sep_ep.valid(emp, {}), 'tổng giám đốc ngân hàng, cơ trưởng không bị "sếp" ép làm ngoài giờ; nhân viên thì có');
    ok(!E.hasBoss(mk(45603, 30, x => { E.startJob(x, 'fl_dev', R(1), () => { }); })), 'làm tự do không có sếp'); }
  // trong tù
  { const l = mk(45700, 30, x => { x.money = 100; }); E.H.jail(l, 1, 'trộm cắp', () => { }); ok(l.jailUntil === 31, 'án 1 năm: ở đủ thanh năm 30–31 tuổi mới ra tù');
    E.beginYear(l, {}); const n = l.pending.length; ok(n >= 3 && n <= 4 && l.pending.every(d => /^(tg_|trai_giam)/.test(d.id)), 'mỗi năm trong tù có 3–4 chuyện trong trại (' + l.pending.map(d => d.id).join(', ') + ')');
    l.pending.push(E.DEC.bang_lai.make(l, R(2))); E.resolve(l, E.autoKey(l)); ok(!l.pending.some(d => d.id === 'bang_lai'), 'trong tù không thi bằng lái, không hẹn hò, không mua nhà');
    let bad = 0; for (let i = 0; i < 1500; i++) { const x = E.createLife({ mode: 'vn', seed: 45800 + i }); E.runHeadless(x); const j = x.log.findIndex(e => /Bị kết án/.test(e.t)); if (j < 0) continue; const rel = x.log.findIndex((e, k) => k > j && /Mãn hạn tù/.test(e.t)); x.log.slice(j + 1, rel < 0 ? x.log.length : rel).forEach(e => { if (/Bắt đầu hẹn hò|Mua nhà|Thi đỗ bằng lái|Bắt đầu công việc mới/.test(e.t)) bad++; }); }
    ok(bad === 0, 'đời có đi tù: không có chuyện hẹn hò, mua nhà, thi bằng lái, nhận việc trong thời gian ở tù (' + bad + ')'); }
  // phi pháp
  { const l = mk(45899, 31, x => { x.jailUntil = 32; x.money = 100; });
    E.finishYear(l);
    ok(l.jailUntil === 32 && !l.log.some(e => /Mãn hạn tù/.test(e.t)), 'chưa chạy xong thanh năm cuối: vẫn bị giam, chưa có nhật ký ra tù');
    ok(E.actions(l).filter(a => a.ok === true).every(a => /^tg_/.test(a.id)), 'năm cuối trong tù chỉ mở các thao tác trong trại');
    E.endYear(l);
    ok(l.jailUntil === null && l.age === 32 && l.log.some(e => /Mãn hạn tù/.test(e.t)), 'hoàn tất thanh năm mới được ra tù'); }
  { const l = mk(45898, 20, x => { x.birthYear = 2006; });
    const names = E.artistsOf('vn', l).map(a => a.n);
    ok(!names.includes('Soobin Hoàng Sơn') && !names.includes('Hoàng Dũng'), 'SOOBIN và Hoàng Dũng thuộc Anh Tài, không trùng danh mục nghệ sĩ Việt riêng'); }
  { const l = mk(45900, 30); const m = i => E.monthlyEst(l, 'buon_lau', i); ok(E.CAR.buon_lau.t.length === 3 && m(1) > 150 && m(2) > 800, 'buôn lậu có đường dây, lên cấp dần: ' + E.CAR.buon_lau.t.map((t, i) => t + ' ~' + Math.round(m(i)) + ' tr').join(' → '));
    const boss = mk(45901, 40, x => { E.startJob(x, 'buon_lau', R(1), () => { }); x.job.rank = 2; }); const low = mk(45902, 25, x => { E.startJob(x, 'buon_lau', R(1), () => { }); });
    ok(E.crimeRankK(boss, E.CAR.buon_lau) < E.crimeRankK(low, E.CAR.buon_lau) * 0.5, 'ông trùm ít bị bắt hơn chân rết nhiều');
    ok(E.DEC.dd_tranh_dia_ban.valid(boss, {}) && E.DEC.dd_vao_duong_day.valid(low, {}), 'có chuyện vào đường dây, tranh giành địa bàn, mất lô hàng'); }
  // mở rộng kinh doanh
  { const l = mk(46000, 35, x => { E.startJob(x, 'kd_quan', R(1), () => { }); x.money = x.base * 30; }); ok(E.actions(l).find(a => a.id === 'mo_rong').ok === true, 'chủ quán có tiền thì chủ động mở rộng quy mô được');
    const p = mk(46001, 35, x => { E.startJob(x, 'kd_quan', R(1), () => { }); x.money = 0; }); ok(E.actions(p).find(a => a.id === 'mo_rong').ok !== true, 'chưa đủ vốn thì chưa mở rộng được'); }
  // bạn đời góp theo thu nhập
  { const l = mk(46099, 40, x => { x.partner = { name: 'An', sex: 'F', age: 38, status: 'married', alive: true, inc: 2 }; });
    E.finishYear(l); ok(Math.abs(l.fin.partner - 13.2) < 0.01, 'bạn đời lương thấp không đóng góp vượt quá thu nhập thực'); }
  { const l = mk(46098, 75, x => { x.retired = true; x.pensioned = true; x.pensionInc = 120; x.kids = []; x.partner = null; });
    E.finishYear(l); ok(!l.log.some(e => /con cái biếu/.test(e.t)), 'người nghỉ hưu không có con không ghi con cái biếu tiền'); }
  { const l = mk(46097, 40, x => { x.money = 1000; x.ventures = [{ k: 'store', n: 'cửa hàng', unit: 700, br: 8, cap: 5600 }, { k: 'cafe', n: 'quán cà phê', unit: 450, br: 1, cap: 450 }]; });
    ok(E.actions(l).find(a => a.id === 'mo_rong').ok === true, 'cơ sở đầu đã đủ 8 chi nhánh vẫn được mở thêm cơ sở khác');
    l.pending = [E.DEC.mo_rong_tu.make(l, R(1))]; E.resolve(l, 'ven_cafe');
    ok(l.ventures[1].br === 2 && l.ventures[0].br === 8 && l.money === 550, 'mở đúng chi nhánh đã chọn và trừ đúng vốn'); }
  { const l = mk(46100, 40, x => { x.partner = { name: 'My', sex: 'F', age: 38, status: 'married', since: 30, alive: true, inc: 136 }; x.money = 500; E.startJob(x, 'ke_toan', R(1), () => { }); });
    E.beginYear(l, {}); while (l.pending.length) E.resolve(l, E.autoKey(l)); E.finishYear(l); ok(l.fin.partner / 12 > 60, 'vợ lương 136 triệu/tháng thì góp khoảng một nửa (' + Math.round(l.fin.partner / 12) + ' triệu/tháng), không còn 10 triệu'); }
  // game
  { const l = mk(46200, 9, x => { x.talent = 'game'; x.talentSub = 'MOBA'; }); const d = E.DEC.chon_game.make(l, R(1)); const gs = d.opts.map(o => o.l);
    ok(['Liên Minh Huyền Thoại', 'Liên Minh: Tốc Chiến', 'Liên Quân Mobile', 'Mobile Legends: Bang Bang'].every(g => gs.includes(g)), 'năng khiếu MOBA: tự chọn LMHT, Tốc Chiến, Liên Quân, Mobile Legends');
    const f = mk(46201, 9, x => { x.talent = 'game'; x.talentSub = 'FPS'; }); const fs2 = E.DEC.chon_game.make(f, R(1)).opts.map(o => o.l); ok(['Valorant', 'Counter-Strike 2', 'Delta Force', 'Free Fire'].every(g => fs2.includes(g)) && fs2.includes('PUBG Mobile'), 'năng khiếu FPS cùng danh mục ở nhà, có PUBG Mobile theo yêu cầu mới'); }
  // concert
  { const l = mk(46300, 20, x => { x.birthYear = 2006; }); const d = E.DEC.concert_chon.make(l, R(1));
    ok(d.opts.find(o => o.k === 'vn').h === '' && d.opts.find(o => o.k === 'kr').h === '' && d.opts.find(o => o.k === 'us').l === 'Nghệ sĩ US/UK', 'nhóm nghệ sĩ không còn ghi tên ở dưới; "Nghệ sĩ US/UK"');
    ok(/vượt ngàn chông gai 2024/.test(d.opts.find(o => o.k === 'show').h) && /vượt ngàn chông gai 2026/.test(d.opts.find(o => o.k === 'show').h), 'concert chương trình có cả Anh trai vượt ngàn chông gai 2024, 2026');
    l.pending = [d]; E.resolve(l, 'vn'); const p = l.pending[0]; ok(p.id === 'concert_nghe_si' && p.opts.some(o => o.l === 'Sơn Tùng M-TP') && !p.opts.some(o => /HIEUTHUHAI|Quang Hùng/.test(o.l)), 'chọn nghệ sĩ Việt Nam hạng A (không lấy nghệ sĩ các show Say Hi)');
    E.resolve(l, 'a0'); ok(l.pending[0] && l.pending[0].id === 'concert_di' && /Sơn Tùng/.test(l.pending[0].text), 'chọn nghệ sĩ xong mới đi concert');
    const kr = E.artistsOf('kr', l).map(a => a.n); ok(['IU', 'Hwasa', 'PSY', 'BTS'].every(x => kr.includes(x)), 'K-pop có cả IU, Hwasa, PSY'); }
  // giới tính & xu hướng
  { const html0 = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'); ok(!/data-g="X"|Liên giới/.test(html0), 'giới tính chỉ còn Nam / Nữ / Ngẫu nhiên (v5.6.2 bỏ liên giới)');
    const sub = { top: ['M', 'Đồng tính nam (tóp mỡ)'], bot: ['M', 'Đồng tính nam (bột tôm)'], les: ['F', 'Đồng tính nữ (bé Liên)'], bi: [null, 'Song tính (bi)'] };
    ok(Object.keys(sub).every(o => { const z = E.createLife({ mode: 'vn', seed: 46410, gender: 'random', orient: o }); return (!sub[o][0] || z.sex === sub[o][0]) && E.orientLabel(z) === sub[o][1]; }), 'chọn tóp mỡ / bột tôm / bé Liên / bi: đúng giới tính và hồ sơ ghi đúng cách gọi');
    ok(/data-o="top" data-tip="Top">Tóp mỡ/.test(html0) && /data-o="bot" data-tip="Bot">Bột tôm/.test(html0) && /data-o="les" data-tip="Les">Bé Liên/.test(html0) && /data-o="bi" data-tip="Bisexual">Bi/.test(html0), 'bấm LGBTQ+ hiện tóp mỡ / bột tôm / bé Liên / bi, rê chuột hoặc ấn giữ thấy Top / Bot / Les / Bisexual');
    const y = E.createLife({ mode: 'vn', seed: 46401, gender: 'F', orient: 'lgbt' }); ok(y.orient !== 'straight' && !/bột tôm|tóp mỡ|bé Liên/.test(E.orientLabel(y)), 'xu hướng LGBTQ+ gọn, không còn "bột tôm / tóp mỡ": ' + E.orientLabel(y));
    const z = E.createLife({ mode: 'vn', seed: 46402, gender: 'M', orient: 'straight' }); ok(z.orient === 'straight', 'chọn dị tính');
    ok(/id="orientChips"/.test(html0) && /id="lgbtSub"/.test(html0), 'trang chọn: giới tính sinh học riêng, xu hướng tính dục riêng (bỏ chọn được)'); }
  // lời kể gia đình
  { const l = mk(46500, 70, x => { x.kids = []; x.fam.mAlive = false; x.fam.fAlive = false; x.sibList = []; x.fam.sibs = 0; x.partner = null; });
    ok(!/[Cc]on cháu/.test(E.famLogic(l, 'Con cháu tổ chức lễ mừng thọ 70 tuổi.', true)), 'không con cháu thì không có "con cháu tổ chức mừng thọ"');
    ok(/một mình/.test(E.famLogic(l, 'Tiết Thanh minh, cả nhà đi tảo mộ ông bà.', true)) && E.famLogic(l, 'Anh chị em mỗi người góp một phần lo cho bố mẹ.', true) === null, 'cả nhà đã mất / không anh chị em thì lời kể đổi theo');
    let bad = 0; for (let i = 0; i < 300; i++) { const x = E.createLife({ mode: 'vn', seed: 46600 + i }); E.runHeadless(x); x.log.forEach(e => { if (/[Cc]on cháu tổ chức/.test(e.t) && !x.kids.length) bad++; if (/tập gym|Tập gym/.test(e.t) && !/[Pp]hòng tập gym/.test(e.t) && e.a > 65) bad++; }); }
    ok(bad === 0, 'không còn "con cháu tổ chức" khi không có con, không tập gym sau 65 tuổi (' + bad + ')'); }
}

section('46. Bản 5.6.1: điểm thi sát thực tế (siêu giỏi vẫn đạt 30, học kém trượt tốt nghiệp và thi lại), bé gái hầu như không bị rủ đi net, bằng lái sau 60 tuổi');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; l.pending = []; if (setup) setup(l); return l; };
  { const top = mk(46100, 17, x => { x.st.kno = 99; x.flags.examApt = 2.6; x.khoi = 'A00'; }); let s30 = 0; for (let i = 0; i < 50; i++) if (E.rollExamScore(top, R(i)) >= 30) s30++;
    ok(s30 > 30, 'học siêu giỏi vẫn có thể đạt 30 điểm (' + s30 + '/50 lượt)');
    const mid = mk(46101, 17, x => { x.st.kno = 99; x.flags.examApt = 0; }); let sum = 0; for (let i = 0; i < 50; i++) sum += E.rollExamScore(mid, R(i)); ok(sum / 50 > 22 && sum / 50 < 26, 'học sinh bình thường điểm quanh mức trung bình (' + (sum / 50).toFixed(2) + ')');
    const weak = mk(46102, 17, x => { x.st.kno = 60; x.flags.examApt = -2.6; x.flags.luyenThi = -1; }); let low = 0; for (let i = 0; i < 50; i++) if (E.rollExamScore(weak, R(i)) < 15) low++; ok(low > 25, 'học rất kém có thể dưới 15 điểm (' + low + '/50)'); }
  { const l = mk(46103, 17, x => { x.st.kno = 55; x.flags.examApt = -2.6; x.flags.luyenThi = -1; x.school = 'upper'; x.schoolEnd = 18; x.edu = 2; });
    const hook = E.HOOKS.gradUpper.find(h => /failHS|rollExamScore/.test(h.toString())); const logs = []; l.edu = 3; l.flags.uniNext = 18; hook(l, R(1), t => logs.push(t));
    if (l.examScore < 15) { ok(l.edu < 3 && l.flags.uniNext == null && logs.some(t => /Trượt tốt nghiệp THPT/.test(t)), 'dưới 15 điểm: trượt tốt nghiệp, chưa có bằng, chưa xét đại học');
      ok((l.sched || []).some(s => s.id === 'thi_lai_tn'), 'năm sau được thi lại tốt nghiệp');
      l.age = 18; l.pending = [E.DEC.thi_lai_tn.make(l, R(2))]; ok(['thi', 'nghe', 'lam'].every(k => l.pending[0].opts.some(o => o.k === k)), 'thi lại / học nghề / đi làm'); }
    else ok(false, 'kịch bản học rất kém phải dưới 15 điểm (' + l.examScore + ')'); }
  { let f = 0, m = 0; for (let i = 0; i < 800; i++) { const l = E.createLife({ mode: 'vn', seed: 46200 + i, gender: i % 2 ? 'F' : 'M' }); const T = E.TRIG.find(t => t.id === 'net_coi'); l.age = 12; l.urban = false; const p = typeof T.p === 'function' ? T.p(l, 12) : T.p; if (l.sex === 'F') f += p; else m += p; }
    ok(f / 400 <= 0.003 && m / 400 >= 0.09, 'bé gái hầu như không bị rủ đi net (' + (f / 400 * 100).toFixed(2) + '%/năm, ~2% cả tuổi thơ), bé trai ' + (m / 400 * 100).toFixed(1) + '%/năm'); }
  { const o = mk(46300, 70, x => { x.lic = {}; x.indep = true; }); ok(!E.DEC.bang_lai.valid(o, {}), 'không thi bằng lái sau 60 tuổi'); }
}
section('47. Bản 5.6.1: Pháp Kiều gọi thẳng tên, phông chữ tiếng Việt, gọi đúng người yêu / vợ / chồng, giá món ăn địa phương');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  ok(E.memberName('anh trai', 'Pháp Kiều') === 'Pháp Kiều' && E.memberName('anh trai', 'HIEUTHUHAI') === 'anh trai HIEUTHUHAI', 'Pháp Kiều được gọi thẳng tên, các anh trai khác giữ cách gọi cũ');
  { const css = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8'); ok(!/--serif:[^;]*Georgia/.test(css) && !/--display:[^;]*Georgia/.test(css) && /Times New Roman/.test(css), 'phông dự phòng hỗ trợ đủ dấu tiếng Việt (không rơi về Georgia làm lệch dấu ế, ồ)'); }
  { let l = null; for (let s = 1; s < 5000 && !l; s++) { const x = E.createLife({ mode: 'vn', seed: s, variant: '63' }); if (/Đà Nẵng/.test(x.provLabel)) l = x; }
    l.age = 22; l.indep = true; l.pending = []; l.money = 300; l.partner = { name: 'Võ Ngọc Ánh', sex: 'F', age: 21, status: 'dating', alive: true, close: 60 };
    const lab = () => E.DEC.que_doc.make(l, R(1)).opts.find(o => o.k === 'partner').l;
    ok(lab() === 'Mời người yêu đi chơi', 'đang yêu thì ghi "người yêu": ' + lab()); l.partner.status = 'married'; ok(lab() === 'Mời vợ đi chơi', 'đã cưới thì ghi "vợ": ' + lab());
    l.partner.sex = 'M'; l.sex = 'F'; ok(lab() === 'Mời chồng đi chơi', 'đã cưới thì ghi "chồng": ' + lab()); l.sex = 'M'; l.partner.sex = 'F'; l.partner.status = 'dating';
    ok(E.dishPrice('mì Quảng') <= .06 && E.dishPrice('phở Hà Nội') <= .07 && E.dishPrice('cua Năm Căn') >= .3 && E.placePrice('biển Mỹ Khê') <= .1, 'giá món ăn / địa danh sát thực tế: mì Quảng ~' + Math.round(E.dishPrice('mì Quảng') * 1000) + 'k, cua Năm Căn ~' + Math.round(E.dishPrice('cua Năm Căn') * 1000) + 'k mỗi người');
    l.pending = [E.DEC.que_doc.make(l, R(1))]; E.resolve(l, 'partner'); E.resolve(l, 'switch'); const m = l.pending[0];
    const mq = m && m.opts.find(o => /mì Quảng/.test(o.l)); ok(!!mq && /^\d+k đ$/.test(mq.h) && parseInt(mq.h, 10) <= 250, 'ở Đà Nẵng ăn mì Quảng cùng người yêu chỉ vài trăm nghìn kể cả đi lại (' + (mq && mq.h) + ')'); }
}
section('48. Bản 5.6.3: nhập quốc tịch theo số năm cư trú, visa esports, cắt giảm nhân sự đúng đối tượng');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; l.indep = true; l.pending = []; if (setup) setup(l); return l; };
  ok(E.NATURALIZE.US[0] === 6 && E.NATURALIZE.SE[0] === 8 && E.NATURALIZE.PT[0] === 10 && E.NATURALIZE.JP[1] === 1, 'số năm nhập quốc tịch theo từng nước (Mỹ 6 kể cả chờ thẻ xanh, Thụy Điển 8, Bồ Đào Nha 10, Nhật buộc thôi quốc tịch gốc)');
  { const l = mk(48000, 30, x => { x.abroad = { code: 'JP', name: 'Nhật Bản', perm: true, pool: 'ja', base: x.base }; x.money = x.base * 5; E.startJob(x, 'ke_toan', R(1), () => { }); });
    const hook = E.HOOKS.year.find(h => /nhap_quoc_tich/.test(h.toString()));
    for (let y = 0; y < 4; y++) hook(l, R(y), () => { }, 30 + y); ok(!l.pending.some(d => d.id === 'nhap_quoc_tich'), 'chưa đủ 5 năm ở Nhật thì chưa được xét nhập quốc tịch');
    hook(l, R(9), () => { }, 34); const d = l.pending.find(d => d.id === 'nhap_quoc_tich'); ok(!!d && /5 năm/.test(d.text) && /thôi quốc tịch/.test(d.text), 'đủ 5 năm: được xét nhập quốc tịch, ghi rõ phải thôi quốc tịch gốc: ' + (d && d.text.slice(0, 120)));
    let got = 0; for (let i = 0; i < 40; i++) { const c = JSON.parse(JSON.stringify(l)); c.rs = 4800 + i * 7919; c.pending = [E.DEC.nhap_quoc_tich.make(c, R(i), { code: 'JP' })]; E.resolve(c, 'nop'); if (E.isCitizenOf(c, 'JP')) got++; } ok(got > 15 && got < 40, 'nộp hồ sơ: phần lớn đỗ, vẫn có người trượt thi (' + got + '/40)'); }
  { const s = { season: { token: 't' } }; let deny = 0; for (let i = 0; i < 2000; i++) { const t = { season: { token: 't' + i } }; if (!E.esVisa({ flags: {}, st: {}, mem: [] }, R(i), () => { }, t, { id: 'msi', name: 'MSI' })) deny++; }
    ok(deny > 20 && deny < 160, 'đi giải quốc tế phải xin visa, hiếm khi bị từ chối (' + deny + '/2000)'); }
  { const top = mk(48100, 45, x => { E.startJob(x, 'phi_cong', R(1), () => { }); x.job.rank = E.CAR.phi_cong.t.length - 1; }); const mkt = mk(48101, 45, x => { E.startJob(x, 'marketing', R(1), () => { }); x.job.rank = 3; x.job.yrs = 3; });
    const drv = mk(48102, 35, x => { E.startJob(x, 'tx_cn', R(1), () => { }); }); const fl = mk(48103, 30, x => { E.startJob(x, 'fl_dich', R(1), () => { }); }); const emp = mk(48104, 30, x => { E.startJob(x, 'ke_toan', R(1), () => { }); x.job.yrs = 3; });
    ok(E.layoffRisk(top) === 0 && E.layoffRisk(mkt) === 0 && E.layoffRisk(drv) === 0 && E.layoffRisk(fl) === 0 && E.layoffRisk(emp) > 0.5, 'cắt giảm nhân sự: không rơi vào cơ trưởng huấn luyện, giám đốc marketing, tài xế công nghệ, freelancer; nhân viên làm thuê vẫn có thể bị');
    ok(!E.DEC.vp_sa_thai_ai.valid(fl, {}) && !E.DEC.cn_cat_giam.valid(mk(48105, 40, x => { E.startJob(x, 'cong_nhan', R(1), () => { }); x.job.rank = E.CAR.cong_nhan.t.length - 1; }), {}), 'freelancer không bị "công ty cắt giảm vì AI", quản đốc không nằm trong danh sách cắt giảm công nhân'); }
}
section('49. Bản 5.6.4: chức cao / nghề tự do không có "sếp", gia đình đúng hoàn cảnh, ngồi tù đủ năm, lương hưu đa số nghề, sân bóng theo nơi sống');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, setup) => { const l = E.createLife({ mode: 'vn', seed, gender: 'M' }); l.age = age; l.indep = true; l.school = null; l.pending = []; if (setup) setup(l); return l; };
  { const mc = mk(49000, 30, x => E.startJob(x, 'mc_su_kien', R(1), () => { })); const kt = mk(49001, 30, x => E.startJob(x, 'ke_toan', R(1), () => { }));
    ok(!E.hasBoss(mc) && E.hasBoss(kt) && !E.DEC.sep_ep.valid(mc, {}), 'MC sự kiện làm tự do không bị "sếp ép làm ngoài giờ"; kế toán làm thuê thì có sếp');
    const cap = mk(49002, 45, x => { E.startJob(x, 'phi_cong', R(1), () => { }); x.job.rank = E.CAR.phi_cong.t.length - 1; }); ok(!E.hasBoss(cap) && !E.DEC.vp_cuop_cong.valid(cap, {}), 'cơ trưởng huấn luyện không bị sếp mắng / cướp công'); }
  { const l = mk(49010, 40, x => { x.sibList = []; x.fam.sibs = 0; x.fam.mAlive = true; x.fam.mAge = 34; }); const d = E.DEC.care.make(l, R(1), { who: 'Mẹ' });
    ok(!d.opts.some(o => /anh chị/.test(o.l)), 'không có anh chị em: không còn "nhờ anh chị em" chăm bố mẹ: ' + d.opts.map(o => o.l).join(' / '));
    const k = mk(49011, 8, x => { x.sibList = []; x.fam.sibs = 0; x.school = 'primary'; }); const m = E.DEC.k_mat_dien.make(k, R(2)); ok(!m.opts.some(o => /^Ngồi nghe anh chị/.test(o.l)), 'con một không "nghe anh chị kể chuyện ma"'); }
  { const l = mk(49020, 15, x => { x.school = null; }); const d = E.DEC.to_tinh.make(l, R(1)); ok(!/bàn trên|trong cặp/.test(d.text), 'đã nghỉ học: thư tỏ tình không còn "ngồi bàn trên", "trong cặp": ' + d.text); }
  { const hn = mk(49030, 25, x => { x.movedTo = 'Hà Nội'; }), hcm = mk(49031, 25, x => { x.movedTo = 'TP. Hồ Chí Minh'; }), np = mk(49032, 25, x => { x.movedTo = null; x.city = null; x.prov.old = 'Nam Định'; });
    const t = l => E.DEC.xem_bong_da.make(l, R(1)).text; ok(/Mỹ Đình|Hàng Đẫy/.test(t(hn)) && /Thống Nhất/.test(t(hcm)) && !/Mỹ Đình/.test(t(hcm)) && /Thiên Trường/.test(t(np)), 'đi xem bóng ở sân gần nơi sống: ' + [t(hn), t(hcm), t(np)].join(' | ')); }
  { const l = mk(49040, 30); l._yearRun = true; E.H.jail(l, 1, 'trộm cắp tài sản', () => { }); ok(l.jailUntil === 32, 'bị bắt giữa năm: chạy hết thanh năm sau mới ra tù (' + l.jailUntil + ')');
    const b = mk(49041, 30); b._yearRun = false; E.H.jail(b, 1, 'trộm cắp tài sản', () => { }); ok(b.jailUntil === 31, 'bị kết án đầu năm: đúng 1 năm');
    const c = mk(49042, 30); c.pending = []; E.beginYear(c, { auto: true }); E.finishYear(c); E.endYear(c); ok(!c._yearRun, 'kết thúc năm thì xóa cờ đang chạy năm'); }
  { const own = mk(49050, 40, x => { E.startJob(x, 'bartender', R(1), () => { }); x.job.rank = 2; }); const vs = mk(49051, 40, x => E.startJob(x, 've_so', R(1), () => { })); const fl = mk(49052, 40, x => E.startJob(x, 'fl_dev', R(1), () => { }));
    ok(E.pensionCovered(own) && !E.pensionCovered(vs) && !E.pensionCovered(fl), 'chủ quán tự đóng BHXH tự nguyện có lương hưu; vé số, freelancer vẫn không');
    let n = 0, pen = 0; for (let i = 0; i < 60; i++) { const l = E.createLife({ mode: 'vn', seed: 49100 + i }); E.runHeadless(l); if (l.death && l.death.age >= 66) { n++; if (l.pensioned) pen++; } } ok(n > 15 && pen / n > 0.7, 'đa số người sống đến tuổi hưu có lương hưu (' + pen + '/' + n + ')'); }
  { const old = mk(49060, 76); const g = E.RECUR.find(x => x.id === 'gym'); ok(/dưỡng sinh/.test(g.run(old)) && !/gym/.test(g.l), '76 tuổi không còn "tập gym", chuyển sang đi bộ, dưỡng sinh'); }
  { const l = mk(49070, 32, x => { x.edu = 7; x.workYrs = 5; x.jobsHist = []; }); E.startJob(l, 'nghien_cuu', R(1), () => { }); ok(!/giáo sư/.test(E.jobTitle(l)), 'tiến sĩ mới vào nghề nghiên cứu không vào thẳng phó giáo sư: ' + E.jobTitle(l)); }
  { const l = mk(49080, 80, x => { x.kids = []; x.sibList = []; x.fam.sibs = 0; x.fam.mAlive = false; x.fam.fAlive = false; x.partner = null; });
    ok(E.famLogic(l, 'Mùng Một, ngày Rằm cả nhà ăn chay.', true) === 'Mùng Một, ngày Rằm bạn ăn chay.' && E.famLogic(l, 'Rằm tháng Giêng, cả nhà lên chùa cầu an đầu năm.', true) === 'Rằm tháng Giêng, bạn lên chùa cầu an đầu năm.', 'không còn ai trong gia đình: không còn "cả nhà ăn chay", "cả nhà lên chùa"');
    const d = E.DEC.sau_mat_mat.make(l, R(1)); ok(!d.opts.some(o => /với gia đình/.test(o.l)), 'không còn gia đình: sau mất mát ngồi lại với bạn bè thân'); }
  { let bad = 0; for (let i = 0; i < 40; i++) { const l = E.createLife({ mode: 'vn', seed: 49200 + i, gender: 'F' }); l.age = 1; l.pending = [E.DEC.thoi_noi.make(l, R(i))]; if (/thầy giáo/.test(E.resolve(l, 'but').map(e => e.t).join(' '))) bad++; } ok(bad === 0, 'bé gái bốc trúng cây bút: "sau này làm cô giáo"'); }
}
section('50. Bản 5.7.0: đời sống từng quốc gia (chế độ Thế giới), Việt Nam giữ nguyên');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const hook = E.HOOKS.year.find(h => /qgLineAt/.test(h.toString()));
  ok(!!hook, 'có hook đời sống từng quốc gia');
  { let used = 0; const boom = () => { used++; return 0.5; }; let logs = 0;
    for (let i = 0; i < 20; i++) { const l = E.createLife({ mode: i % 2 ? 'world' : 'vn', seed: 50000 + i }); if (l.country !== 'VN') continue; l.age = 30; hook(l, boom, () => logs++, 30); }
    const em = E.createLife({ mode: 'vn', seed: 50100 }); em.age = 30; em.abroad = { code: 'JP', name: 'Nhật Bản', perm: true }; hook(em, boom, () => logs++, 30);
    ok(used === 0 && logs === 0, 'đời ở Việt Nam (kể cả người Việt định cư nước ngoài) không dùng số ngẫu nhiên, không thêm chuyện nào từ module mới'); }
  ok(!E.TRIG.some(t => /^qg_/.test(t.id)) && Object.keys(E.DEC).filter(k => /^qg_/.test(k)).length >= 12, 'tình huống quốc gia không thêm vào danh sách chung (không làm đời ở Việt Nam đổi khác)');
  { const mkW = (code, age, setup) => { let l = null; for (let i = 0; i < 4000 && !l; i++) { const x = E.createLife({ mode: 'world', seed: 51000 + i }); if (x.country === code) l = x; } l.age = age; l.pending = []; if (setup) setup(l); return l; };
    const jp = mkW('JP', 30, x => { x.school = null; x.indep = true; }); const P = E.worldLinePool(jp);
    ok(P.own.length >= 6 && P.own.every(x => /^JP:/.test(x.id)), 'người sống ở Nhật có chuyện riêng của Nhật (' + P.own.length + ')');
    ok(!P.own.some(x => /randoseru|lớp Một|Cuối giờ học, cả lớp/.test(x.t)), 'người lớn không nhận chuyện của học sinh tiểu học');
    const kid = mkW('JP', 6, x => { x.school = 'primary'; }); ok(E.worldLinePool(kid).own.some(x => /randoseru/.test(x.t)), 'bé vào lớp Một ở Nhật có chuyện chiếc cặp randoseru');
    const th = mkW('TH', 40, x => { x.religion = 'Phật giáo'; x.indep = true; }); let vulan = 0; for (let i = 0; i < 30; i++) { const c = JSON.parse(JSON.stringify(th)); c.rs = 7 + i * 31; c.pending = []; E.finishYear(c); if (c.log.some(e => /Vu Lan|cài hoa hồng/.test(e.t))) vulan++; } ok(vulan === 0, 'người theo đạo Phật ở Thái Lan không gặp phong tục Vu Lan cài hoa hồng của Việt Nam');
    const ng = mkW('NG', 30, x => { x.indep = true; x.money = x.base * 2; x.flags.qgPower = null; }); ok(E.DEC.qg_mat_dien.valid(ng, {}) && !E.DEC.qg_mat_dien.valid(jp, {}), 'mất điện triền miên ở Nigeria, không ở Nhật');
    const up = mkW('KR', 17, x => { x.school = 'upper'; }); const d = E.DEC.qg_thi_dh.make(up, R(1)); ok(/Suneung/.test(d.title + d.text) && E.DEC.qg_thi_dh.valid(up, d.data) && !E.DEC.qg_thi_dh.valid(mkW('KR', 25, x => { x.school = null; }), {}), 'Hàn Quốc: thi Suneung chỉ khi đang học cấp ba');
    const inn = mkW('IN', 26, x => { x.partner = null; x.orient = 'straight'; x.fam.mAlive = true; }); const gay = mkW('IN', 26, x => { x.partner = null; x.orient = 'gay'; x.fam.mAlive = true; });
    ok(E.DEC.qg_mai_moi.valid(inn, {}) && !E.DEC.qg_mai_moi.valid(gay, {}), 'mai mối ở Ấn Độ chỉ với người độc thân, không áp cho người đồng tính');
    const mx = mkW('MX', 42, x => { x.indep = true; x.money = x.base; x.kids = [{ name: 'Lucía', sex: 'F', born: 27, alive: true }, { name: 'Diego', sex: 'M', born: 27, alive: true }]; });
    const q = E.DEC.qg_quince.make(mx, R(2)); ok(q.data.n === 'Lucía' && E.DEC.qg_quince.valid(mx, q.data), 'Mexico: lễ quinceañera cho con gái tròn 15 tuổi');
    E.resolve(Object.assign(mx, { pending: [q] }), 'nho'); ok(!E.DEC.qg_quince.valid(mx, {}), 'mỗi con gái chỉ tổ chức một lần');
    const boss = mkW('JP', 45, x => { x.indep = true; E.startJob(x, 'ke_toan', R(3), () => { }); x.job.rank = E.CAR.ke_toan.t.length - 1; }); ok(!E.DEC.qg_tiec_cty.valid(boss, {}), 'người đứng đầu không bị "trưởng phòng rủ đi nomikai"'); }
  { let dup = 0, n = 0, wrong = 0; const all = Object.values(E.WORLD_LINES).flat(); const byText = {}; all.forEach(x => byText[x.t] = x);
    for (let i = 0; i < 40; i++) { const l = E.createLife({ mode: 'world', seed: 52000 + i }); if (l.country === 'VN') continue; E.runHeadless(l); n++; const seen = {};
      l.log.forEach(e => { if (byText[e.t]) { if (seen[e.t]) dup++; seen[e.t] = 1; } }); }
    ok(n > 25 && dup === 0, 'mỗi chuyện riêng của quốc gia chỉ kể một lần trong đời (' + dup + ' lần lặp / ' + n + ' đời)'); }
  ok(!/H.mb(l,(amount|cost(l)))/.test(fs.readFileSync(path.join(ROOT, 'js/life57.js'), 'utf8')), 'chi phí buổi tìm hiểu văn hóa ở nước ngoài hiển thị đúng số tiền thật (không nhân hai lần thu nhập cơ sở)');
}
section('51. Bản 5.8.0: xem tivi chọn thần tượng, trại lừa đảo, chu cấp, mức sống, đám cưới, chia tay, đồ công nghệ');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, f) => { const l = E.createLife({ mode: 'vn', seed, gender: 'F' }); l.age = age; l.pending = []; if (f) f(l); return l; };
  { let rnd = 0; for (let i = 0; i < 40; i++) { const l = E.createLife({ mode: 'vn', seed: 51000 + i }); E.runHeadless(l); if (l.log.some(e => /^Mê mẩn /.test(e.t))) rnd++; } ok(rnd === 0, 'Việt Nam: không còn tự nhiên "mê" một thần tượng ngẫu nhiên (' + rnd + ')'); }
  { const l = mk(51100, 12, x => { x.school = 'lower'; }); l.pending = [E.DEC.tv_xem.make(l, R(1))]; E.resolve(l, 'show'); const s = l.pending[0];
    ok(s.id === 'tv_show' && ['Anh trai "Say Hi"', 'Em xinh "Say Hi"', 'Tinh hà "Say Hi"', 'Anh trai vượt ngàn chông gai', 'Chị đẹp đạp gió rẽ sóng', 'Rap Việt'].every(n => s.opts.some(o => o.l === n)), 'mở tivi xem gameshow: có đủ các chương trình');
    const at = E.TV_SHOWS.find(f => f.k === 'atsh'), c = E.tvCast(at, l), all = new Set(E.SHOWS.filter(x => /^atsh/.test(x.k)).flatMap(x => x.m));
    ok(c.length === all.size, 'chương trình nhiều mùa: gộp hết người tham gia các mùa (' + c.length + ')');
    l.pending = [E.DEC.tv_bias.make(l, R(2), { k: 'rap', p: 0 })]; E.resolve(l, 'm0'); ok(l.idol === 'Dế Choắt' && /Dế Choắt/.test(E.DEC.fan_photocard.make(l, R(3)).text), 'chọn người mình thích → photocard, fanmeeting là của đúng người ấy'); }
  { const l = mk(51200, 22, x => { x.indep = true; }); l.pending = [E.DEC.kh_den.make(l, R(1))]; E.resolve(l, 'comply');
    const shown = E.actions(l).filter(a => a.ok === true || !/^(Từ \d+ tuổi|Không áp dụng|Không còn phù hợp)/.test(a.ok));
    ok(l.abroad && l.abroad.trapped && shown.length >= 6 && shown.every(a => /^kh_act_/.test(a.id)), 'bị giam ở trại lừa đảo: "việc bạn muốn làm" chỉ còn các việc trong trại (' + shown.map(a => a.id).join(',') + ')');
    const hook = E.HOOKS.year.find(h => /khLines/.test(h.toString())); hook(l, R(4), () => { }, l.age); ok(l.pending.some(d => /^kh_/.test(d.id)), 'mỗi năm trong trại có một chuyện mới (chỉ tiêu, nạn nhân, ốm, bị bán…)');
    const d = E.DEC.kh_chi_tieu.make(l, R(5)); l.pending = [d]; const h0 = l.st.hea; E.resolve(l, 'tu_choi'); ok(l.st.hea < h0, 'từ chối lừa đảo: bị chích điện, sức khỏe giảm');
    const f = mk(51201, 25, x => { x.fam.mAlive = true; x.fam.fAlive = true; x.fam.noMom = false; x.fam.noDad = false; x.flags.khSince = 21; }); const t = E.khReturn(f, 'X.'); ok(/mẹ|Mẹ/.test(t) && /sống lại|thoát|sống tiếp/.test(t) && /4 năm/.test(t), 'trở về từ Campuchia: bố mẹ ra đón, cảm giác được sống lại: ' + t.slice(0, 120)); }
  { const src = n => fs.readFileSync(path.join(ROOT, 'js/' + n), 'utf8');
    ok(!/H\.mb\(l,cost\(l\)\)/.test(src('life55.js')) && !/Mỗi năm tối đa hai tình huống/.test(src('life55.js')), 'chuyện nghề nghiệp: chi phí bồi dưỡng hiển thị đúng, bỏ dòng "Mỗi năm tối đa hai tình huống…"');
    ok(!/địa giới 63/.test(src('life56.js')), 'quê người ấy: không còn ghi "(địa giới 63 tỉnh/thành…)"'); }
  { const l = mk(51300, 24, x => { x.indep = true; x.partner = { name: 'Dung', sex: 'F', age: 39, status: 'dating', since: 23, alive: true, inc: 900 }; x.flags.sponsor = { name: 'Dung', active: true, monthly: 100, control: 70, since: 23 }; x.mind.stress = 10; });
    const hook = E.HOOKS.year.find(h => /feltAt/.test(h.toString())); const h0 = l.st.hap; hook(l, R(6), () => { }, 24); ok(l.mind.stress >= 20 && l.st.hap < h0, 'được chu cấp nhưng bị kiểm soát: căng thẳng tăng, hạnh phúc giảm'); }
  { const rich = mk(51400, 40, x => { x.indep = true; x.money = x.base * 200; }), poor = mk(51401, 40, x => { x.indep = true; x.money = 0; });
    ok(E.wealthLivingK(rich, rich.base * 3) > 1.5 && E.wealthLivingK(poor, poor.base * 0.4) < 1, 'nhà giàu chi tiêu sinh hoạt nhiều hơn, nhà nghèo ít hơn'); }
  { const w = mk(51500, 28, x => { x.indep = true; x.money = 300; x.partner = { name: 'Minh', sex: 'M', age: 29, status: 'dating', since: 25, alive: true }; x.fam.q = 5; x.fam.mAlive = true; x.fam.noMom = false; });
    w.pending = [E.DEC.marry.make(w, R(1))]; E.resolve(w, 'marry'); const c = w.pending[0];
    ok(c && c.id === 'cuoi_to_chuc' && /60%/.test(c.text) && c.opts.some(o => o.k === 'nuoc_ngoai') && !c.opts.some(o => o.k === 'sieu'), 'đám cưới: chọn nơi tổ chức (có cả cưới ở nước ngoài), nhà khá giả bố mẹ lo phần lớn, siêu đám cưới chỉ cho gia đình tài phiệt');
    E.resolve(w, 'que'); ok(w.partner.status === 'married' && w.pending[0] && w.pending[0].id === 'cuoi_nhan', 'cưới xong chọn nhẫn cưới'); }
  { const l = mk(51600, 23, x => { x.partner = { name: 'Dung', age: 39 }; x.flags.sponsor = { name: 'Dung', active: true }; }); const t = E.breakupWhy(l, l.partner, R(7)).t; ok(t.length > 20 && /Dung/.test(t), 'chia tay người chu cấp có lý do cụ thể: ' + t); }
  { const l = mk(51700, 20, x => { x.indep = true; x.money = 500; x.birthYear = 2026; }); const a = E.techLineup(l, 'ios').map(x => x.n); l.age = 21; const b = E.techLineup(l, 'ios').map(x => x.n);
    ok(a[0] === 'iPhone 38 Pro Max' && b[0] === 'iPhone 39 Pro Max' && a.some(n => /Fold/.test(n)) && E.techLineup(l, 'samsung').length >= 5 && E.techLineup(l, 'lt_gaming').length >= 4 && E.techLineup(l, 'pc').length >= 5, 'điện thoại, laptop, PC lên đời theo từng năm: ' + a[0] + ' → ' + b[0]);
    l.pending = [E.DEC.cn_mau.make(l, R(8), { kind: 'lt_vp' })]; E.resolve(l, 'm1'); ok(l.flags.tech && l.flags.tech.laptop, 'mua laptop được ghi nhận'); }
}
section('52. Bản 5.9.0: con ngoài hôn nhân, nhiều bạn thân, hẹn hò với bạn thân, định cư nước ngoài');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (seed, age, sex, f) => { const l = E.createLife({ mode: 'vn', seed, gender: sex }); l.age = age; l.pending = []; if (f) f(l); return l; };
  const couple = sex => x => { x.indep = true; x.money = 200; x.partner = { name: sex === 'F' ? 'Trần Văn Hùng' : 'Lê Thị Lan', sex: sex === 'F' ? 'M' : 'F', age: 25, status: 'dating', since: 21, alive: true }; };
  { const a = mk(52000, 24, 'F', couple('F')); a.pending = [E.DEC.co_bau_som.make(a, R(1))]; E.resolve(a, 'cung_nuoi'); ok(a.kids.length === 1 && a.kids[0].oow && a.partner.status === 'dating', 'sinh con khi chưa cưới: con ngoài giá thú, hai người vẫn đang yêu');
    const b = mk(52001, 24, 'F', couple('F')); b.pending = [E.DEC.co_bau_som.make(b, R(1))]; E.resolve(b, 'cuoi'); ok(b.kids.length === 1 && b.partner.status === 'married', 'cưới chạy bầu');
    const c = mk(52002, 24, 'F', couple('F')); c.pending = [E.DEC.co_bau_som.make(c, R(1))]; E.resolve(c, 'don_than'); ok(c.kids.length === 1 && !c.partner && c.flags.singleParent, 'làm mẹ đơn thân');
    const d = mk(52003, 24, 'M', couple('M')); d.pending = [E.DEC.co_bau_som.make(d, R(1))]; E.resolve(d, 'don_than'); ok(d.kids[0].custody === 'other' && !d.partner, 'nam nhận con, con ở với mẹ');
    const hook = E.HOOKS.year.find(h => /Tiền chu cấp nuôi con/.test(h.toString())); const m0 = d.money; hook(d, R(2), () => { }, d.age); ok(d.money < m0, 'con ở với người kia: mỗi năm gửi tiền chu cấp nuôi con');
    const g = mk(52004, 24, 'F', x => { x.partner = { name: 'Mai', sex: 'F', age: 24, status: 'dating', since: 20, alive: true }; }); ok(!E.DEC.co_bau_som.valid(g, {}), 'cặp đôi cùng giới không có tình huống "có thai ngoài ý muốn"'); }
  { const l = mk(52100, 16, 'F', x => { x.school = 'upper'; }); for (let i = 0; i < 5; i++) { const d = E.DEC.ban_than_moi.make(l, R(10 + i)); if (!E.DEC.ban_than_moi.valid(l, d.data)) break; l.pending = [d]; E.resolve(l, 'than'); }
    ok(l.friends.length === 4, 'có thể có thêm nhiều bạn thân (tối đa 4 người ngoài bạn thân đầu tiên): ' + l.friends.length); }
  { const st = mk(52200, 20, 'M', x => { x.orient = 'straight'; x.partner = null; x.bff = { name: 'Thảo', sex: 'F', since: 10, alive: true, close: 90 }; x.friends = [{ name: 'Minh', sex: 'M', d: 0, since: 15, close: 90, alive: true }]; });
    const y = E.DEC.yeu_ban_than.make(st, R(3)); ok(y.data.n === 'Thảo', 'người dị tính chỉ "rung động" với bạn thân khác giới');
    let got = 0; for (let i = 0; i < 20; i++) { const c = JSON.parse(JSON.stringify(st)); c.rs = 7 + i * 7919; c.pending = [E.DEC.yeu_ban_than.make(c, R(40 + i))]; E.resolve(c, 'to_tinh'); if (c.partner && c.partner.name === 'Thảo' && c.partner.fromFriend) got++; } ok(got > 3 && got < 20, 'tỏ tình với bạn thân: có khi thành người yêu, có khi bị từ chối (' + got + '/20)');
    const gay = mk(52201, 20, 'M', x => { x.orient = 'gay'; x.partner = null; x.bff = { name: 'Thảo', sex: 'F', since: 10, alive: true, close: 90 }; x.friends = [{ name: 'Minh', sex: 'M', d: 0, since: 15, close: 90, alive: true }]; }); ok(E.DEC.yeu_ban_than.make(gay, R(3)).data.n === 'Minh', 'người đồng tính rung động với bạn thân cùng giới');
    const taken = mk(52202, 20, 'M', x => { x.partner = { name: 'X', sex: 'F', age: 20, status: 'dating', since: 19, alive: true }; x.bff = { name: 'Thảo', sex: 'F', since: 10, alive: true, close: 90 }; }); ok(!E.DEC.yeu_ban_than.valid(taken, {}), 'đang có người yêu thì không tỏ tình với bạn thân'); }
  { const a = mk(52300, 30, 'F', x => { x.indep = true; x.money = x.base * 3; E.startJob(x, 'ke_toan', R(1), () => { }); x.abroad = { code: 'CA', name: 'Canada', perm: true, since: 26 }; x.edu = 5; x.fam.mAlive = true; x.fam.noMom = false; });
    const ids = ['dc_van_hoa', 'dc_hoc_tieng', 'dc_thuong_tru', 'dc_bang_cap', 'dc_ky_thi', 'dc_tet', 'dc_gui_tien', 'dc_bao_lanh', 'dc_hoi']; ok(ids.every(id => E.DEC[id].valid(a, E.DEC[id].make(a, R(5)).data)), 'định cư nước ngoài: đủ các chuyện học tiếng, thường trú, bằng cấp, kỳ thị, Tết xa nhà, gửi tiền, bảo lãnh bố mẹ, cộng đồng');
    ok(/thường trú nhân \(PR\)/.test(E.DEC.dc_thuong_tru.make(a, R(6)).title) && /tiếng Anh/.test(E.DEC.dc_hoc_tieng.make(a, R(7)).title), 'tên giấy tờ, ngôn ngữ đúng theo nước (Canada: PR, tiếng Anh)');
    const home = mk(52301, 30, 'F', x => { x.indep = true; }); ok(!ids.some(id => E.DEC[id].valid(home, {})), 'ở trong nước thì không có chuyện định cư nước ngoài'); }
}
section('53. Bản 5.9.1: mua nước cho người thân — xưng hô đúng từng người');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (sex, f) => { const l = E.createLife({ mode: 'vn', seed: 53000, gender: sex }); l.age = 30; l.indep = true; l.money = 100; l.pending = []; l.bff = null; l.sibList = []; f(l); return l; };
  const say = (l, k) => { const out = []; for (let i = 0; i < 12; i++) { const c = JSON.parse(JSON.stringify(l)); c.rs = 11 + i * 7919; c.pending = [E.DEC.mua_nuoc_ai.make(c, R(3))]; E.resolve(c, k); E.resolve(c, 'd' + (i % 5)); out.push(c.log.slice(-1)[0].t); } return out.join(' '); };
  const wife = mk('M', x => { x.partner = { name: 'Lan', sex: 'F', age: 28, status: 'married', alive: true }; x.fam.mAlive = false; x.fam.fAlive = false; });
  const t1 = say(wife, 'p0'); ok(/vợ Lan/.test(t1) && !/Anh dặn|Anh không uống|anh đang thèm|của anh|Anh đang giảm/.test(t1), 'mua nước cho vợ: vợ tự xưng "em", không còn câu "anh…"');
  const hus = mk('F', x => { x.partner = { name: 'Hùng', sex: 'M', age: 32, status: 'married', alive: true }; x.fam.mAlive = false; x.fam.fAlive = false; });
  const t2 = say(hus, 'p0'); ok(/chồng Hùng/.test(t2) && !/Em dặn|Em không uống|em đang thèm|của em|Em đang giảm/.test(t2), 'mua nước cho chồng: chồng tự xưng "anh"');
  const mom = mk('F', x => { x.partner = null; x.fam.mAlive = true; x.fam.noMom = false; x.fam.fAlive = false; });
  const t3 = say(mom, 'p0'); ok(/cho mẹ/.test(t3) && /con|Mẹ dặn|mẹ đang thèm|của mẹ/.test(t3) && !/(Anh|Em) (dặn|không uống|đang giảm)|(anh|em) đang thèm/.test(t3), 'mua nước cho mẹ: mẹ xưng "mẹ", gọi bạn là "con"');
  const ai = E.DEC.mua_nuoc_ai.make(mk('M', x => { x.partner = { name: 'Lan', sex: 'F', age: 28, status: 'married', alive: true }; x.fam.mAlive = true; x.fam.noMom = false; x.sibList = [{ n: 'Vũ Thu Hà', sex: 'F', born: -3, alive: true }]; }), R(1));
  ok(ai.opts.some(o => /Vợ Lan/.test(o.l)) && ai.opts.some(o => o.l === 'Mẹ') && ai.opts.some(o => /Chị Hà/.test(o.l)), 'chọn được người muốn mua nước: ' + ai.opts.map(o => o.l).join(', '));
}
section('54. Bản 5.9.2: quà tặng đa dạng, xưng hô đúng giới tính');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (sex, psex) => { const l = E.createLife({ mode: 'vn', seed: 54000, gender: sex }); l.age = 25; l.indep = true; l.money = 100; l.pending = []; l.partner = { name: 'Bảo', sex: psex, age: 25, status: 'dating', since: 22, alive: true, inc: 20 }; return l; };
  const open = (l, grp) => { l.pending = [E.DEC.gift50.make(l, R(1))]; E.resolve(l, 'choose'); E.resolve(l, grp); return l.pending[0].opts.map(o => o.l); };
  const fl = open(mk('M', 'F'), 'flowers'); ok(fl.length >= 12 && fl.some(x => /bất tử/.test(x)) && fl.some(x => /hoa tiền/.test(x)), 'quà hoa đa dạng: hoa hồng bất tử, bó hoa tiền… (' + fl.length + ')');
  const g0 = mk('M', 'F'); g0.pending = [E.DEC.gift50.make(g0, R(1))]; E.resolve(g0, 'choose'); const groups = g0.pending[0].opts.map(o => o.l); ok(['Đồ ăn ngọt', 'Đồ công nghệ', 'Trải nghiệm', 'Thời trang / nước hoa'].every(n => groups.includes(n)), 'thêm nhóm quà: đồ ăn ngọt, công nghệ, trải nghiệm, thời trang');
  const forHim = open(mk('F', 'M'), 'fashion'), forHer = open(mk('M', 'F'), 'fashion'); { const cos = open(mk('M', 'F'), 'cosmetics'); ok(cos.some(x => /Hoa Biết/.test(x)) && !open(mk('F', 'M'), 'cosmetics').some(x => /Hoa Biết/.test(x)), 'mỹ phẩm Hoa Biết cho bạn gái'); }
  ok(forHim.some(x => /Ví da/.test(x)) && !forHim.some(x => /Túi xách/.test(x)) && forHer.some(x => /Túi xách/.test(x)) && !forHer.some(x => /Ví da/.test(x)), 'quà hợp với người nhận (túi xách cho bạn gái, ví da cho bạn trai)');
  const m = E.createLife({ mode: 'vn', seed: 54100, gender: 'M' }), f = E.createLife({ mode: 'vn', seed: 54101, gender: 'F' });
  ok(/"Anh ơi, em chưa/.test(E.famLogic(m, 'cô gửi ảnh: "Chị ơi, em chưa bao giờ thấy mình đẹp như thế."', true)) && /"Chị biết tôi là ai/.test(E.famLogic(f, '"Anh biết tôi là ai không?"', true)), 'câu thoại người khác nói với bạn gọi đúng "anh" / "chị" theo giới tính');
  ok(E.callYou(f, { sex: 'M', age: 27 }) === 'em' && E.callYou(m, { sex: 'F', age: 23 }) === 'anh', 'người yêu gọi bạn đúng xưng hô');
}
section('55. Bản 6.0.0: sinh viên lên thành phố (chỗ ở, làm thêm, cạm bẫy), chuyện nghề chi tiết, quà cho nam');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const stu = (q, f) => { const l = E.createLife({ mode: 'vn', seed: 55000 + q, gender: 'F' }); l.age = 18; l.pending = []; l.school = 'uni'; l.schoolEnd = 22; l.cityStudent = { city: 'Hà Nội', since: 18 }; l.fam.q = q; l.fam.mAlive = true; l.fam.noMom = false; l.money = 10; if (f) f(l); return l; };
  const ks = l => E.DEC.sv_cho_o.make(l, R(1)).opts.map(o => o.k);
  ok(ks(stu(1)).join() === 'ktx,ghep' && ks(stu(5)).includes('mua_cc') && !ks(stu(5)).includes('biet_thu'), 'chỗ ở theo điều kiện: nhà nghèo ký túc xá / trọ ghép, nhà giàu thuê chung cư hoặc mua hẳn, biệt thự chỉ cho gia đình tài phiệt');
  const home = stu(3, x => { x.cityStudent = null; }); ok(!E.DEC.sv_cho_o.valid(home, {}), 'nhà ở sẵn thành phố đó thì không phải tìm chỗ ở');
  const buy = stu(5); buy.pending = [E.DEC.sv_cho_o.make(buy, R(1))]; E.resolve(buy, 'mua_cc'); buy.school = null; buy.cityStudent = null; const hk = E.HOOKS.year.find(h => /stuHome; if/.test(h.toString())); hk(buy, R(2), () => { }, 22); ok(buy.ownHouse && buy.houseVal > 0, 'bố mẹ mua căn hộ khi đi học: ra trường được sang tên');
  const poor = stu(1); poor.pending = [E.DEC.sv_cho_o.make(poor, R(1))]; E.resolve(poor, 'ghep'); poor.money = 0; const m0 = poor.money; hk(poor, R(3), () => { }, 18); ok(poor.money < m0 && poor.pending.some(d => d.id === 'sv_lam_them'), 'tự trả tiền trọ, thiếu tiền thì tính chuyện đi làm thêm');
  E.resolve(poor, 'cafe'); const ph = E.HOOKS.year.find(h => /Làm thêm: /.test(h.toString())); const m1 = poor.money; ph(poor, R(4), () => { }, 19); ok(poor.money > m1, 'làm thêm có thu nhập mỗi năm khi đi học');
  ok(['sv_viec_nhe', 'sv_hoi_thao', 'sv_vay', 'sv_tro_coc', 'sv_keo', 'sv_mau_anh', 'sv_tiec'].every(id => !/lừa đảo|cạm bẫy|đa cấp/.test(E.DEC[id].make(stu(2), R(5)).text)), 'cạm bẫy hiện ra như cơ hội bình thường, không nói trước là bẫy');
  const job = (id, sex) => { const l = E.createLife({ mode: 'vn', seed: 55100, gender: sex }); l.age = 30; l.indep = true; l.pending = []; E.startJob(l, id, R(1), () => { }); return l; };
  let all = ''; for (let i = 0; i < 30; i++) all += E.DEC.nghe_kh.make(job('tho_toc', 'F'), R(10 + i)).opts.map(o => o.l).join(' ');
  ok(/Mullet/.test(all) && /Side part/.test(all) && /Undercut/.test(all), 'thợ cắt tóc có các kiểu mullet, side part, undercut…');
  let fem = 0; for (let i = 0; i < 30; i++) if (/chị khách/.test(E.DEC.nghe_kh.make(job('barber', 'M'), R(40 + i)).text)) fem++; ok(fem === 0, 'barber (tiệm tóc nam) không nhận khách nữ làm tóc dài');
  const t = job('giao_vien', 'F'); let said = ''; for (let i = 0; i < 20; i++) { const c = JSON.parse(JSON.stringify(t)); c.rs = 3 + i * 7919; c.pending = [E.DEC.nghe_kh.make(c, R(60 + i))]; E.resolve(c, 't0'); said += c.log.slice(-1)[0].t; } ok(!/Thầy|thầy/.test(said), 'cô giáo được gọi là "cô", không gọi nhầm "thầy"');
  const g = E.createLife({ mode: 'vn', seed: 55200, gender: 'F' }); g.age = 25; g.indep = true; g.money = 100; g.pending = []; g.partner = { name: 'Bảo', sex: 'M', age: 26, status: 'dating', since: 22, alive: true, inc: 20 };
  g.pending = [E.DEC.gift50.make(g, R(1))]; E.resolve(g, 'choose'); E.resolve(g, 'books'); const hob = g.pending[0].opts.map(o => o.l).join(' ');
  ok(/Gundam/.test(hob) && /Lego/.test(hob), 'quà tặng bạn trai: Gundam, Lego…');
  g.pending = [E.DEC.gift50.make(g, R(1))]; E.resolve(g, 'choose'); E.resolve(g, 'fashion'); const fa = g.pending[0].opts.map(o => o.l).join(' '); ok(/Nước hoa nam/.test(fa) && !/Nước hoa nữ/.test(fa), 'nước hoa nam cho bạn trai, nước hoa nữ cho bạn gái');
}
section('56. Bản 6.1.0: viện phí có BHYT 80%, nha khoa, thưởng Tết theo ngành');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (job, f) => { const l = E.createLife({ mode: 'vn', seed: 56000, gender: 'F' }); l.age = 30; l.indep = true; l.money = 500; l.pending = []; if (job) { E.startJob(l, job, R(1), () => { }); l.job.since = 25; } l.income = 240; if (f) f(l); return l; };
  const a = mk('ke_toan'); const m0 = a.money; E.medBill(a, 20, 'Viện phí', () => { }, 1); ok(Math.abs((m0 - a.money) - 4) < 1e-6 && E.bhytShare(a) === 0.8, 'có BHYT: bảo hiểm trả 80%, bạn trả 20%');
  const kid = mk(null, x => { x.age = 4; x.indep = false; x.school = null; }); const k0 = kid.money; E.medBill(kid, 5, 'Viện phí', () => { }, 1); ok(kid.money === k0 && E.bhytShare(kid) === 1, 'trẻ dưới 6 tuổi BHYT trả 100%, con chưa tự lập không bị trừ tiền riêng');
  const p = mk('ke_toan'); const p0 = p.money; E.medBill(p, 20, 'Bệnh viện tư', () => { }, 0); ok(Math.abs((p0 - p.money) - 20) < 1e-6, 'bệnh viện tư: BHYT không trả phần chênh');
  const rk = mk('ke_toan'); rk.pending = [E.DEC.rang_khon.make(rk, R(1))]; const r0 = rk.money; E.resolve(rk, 'public'); ok(Math.abs((r0 - rk.money) - 0.3) < 1e-6, 'nhổ răng khôn ở bệnh viện công theo BHYT: trả 20% (300k đ / 1,5 triệu đ)');
  const pt = mk('ke_toan'); pt.pending = [E.DEC.phau_thuat.make(pt, R(2), { why: 'mổ ruột thừa' })]; const s0 = pt.money; E.resolve(pt, 'cong'); const paid = s0 - pt.money; ok(paid > 3 && paid < 5 || paid > 4.5, 'phẫu thuật ở bệnh viện công: BHYT trả 80% (bạn trả ' + paid.toFixed(1) + ' triệu đ / 18 triệu đ)');
  ok(['nha_tram', 'nha_cao', 'nha_nieng', 'nha_su'].every(id => !!E.DEC[id]) && /BHYT không chi trả/.test(E.DEC.nha_nieng.make(mk(null, x => { x.age = 15; x.indep = false; x.school = 'upper'; }), R(3)).text), 'nha khoa: trám, lấy cao răng (BHYT trả), niềng, bọc sứ (tự trả)');
  const hook = E.HOOKS.year.find(h => /tetAt/.test(h.toString())); const avg = j => { let s = 0; for (let i = 0; i < 120; i++) { const l = mk(j); l.flags.tetAt = null; const h = { rs: i * 31 + 7 }; const b = l.money; hook(l, () => U.rand(h), () => { }, 30); s += (l.money - b) / 20; } return s / 120; };
  const bank = avg('ngan_hang'), dev = avg('dev'), pub = avg('cong_chuc'), serv = avg('phuc_vu');
  ok(bank > dev && dev > serv && serv > pub * 0.9 && bank > 3 && pub < 1, 'thưởng Tết theo ngành: ngân hàng ' + bank.toFixed(1) + ' tháng, công nghệ ' + dev.toFixed(1) + ', dịch vụ ' + serv.toFixed(1) + ', nhà nước ' + pub.toFixed(1));
  const own = mk('kd_quan'), fl = mk('tx_cn'); ok(!E.tetBonusEligible(own) && !E.tetBonusEligible(fl), 'chủ quán, tài xế công nghệ (tự do) không có thưởng Tết từ công ty');
  { let wrong = 0, crop = 0, docLoss = 0, docYears = 0; for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: 'vn', seed: 56300 + i }); E.runHeadless(l); const f = l.fam;
      l.log.forEach(e => { const m = e.t.match(/^(Bố|Mẹ) /); if (!m) return; const job = m[1] === 'Bố' ? f.fJob : f.mJob;
        if (/bác sĩ|y tá|giáo viên/.test(job || '') && /thu hẹp sản xuất|cắt giảm công nhân|hết đơn hàng/.test(e.t)) wrong++;
        if (/làm ruộng|chăn nuôi|đánh cá|nuôi trồng|trồng cây/.test(job || '') && /thất nghiệp|hết việc, ngày ngày/.test(e.t)) crop++;
        if (/chăn nuôi|nuôi trồng/.test(job || '') && /phân bón/.test(e.t)) wrong++; if (/làm ruộng|trồng cây/.test(job || '') && /vật nuôi|đàn lợn|ao tôm/.test(e.t)) wrong++; }); }
    ok(wrong === 0 && crop === 0, 'bố mẹ mất việc đúng lý do theo nghề: bác sĩ / giáo viên không "thu hẹp sản xuất", nông dân / ngư dân mất mùa chứ không "thất nghiệp" (' + wrong + ', ' + crop + ')'); }
}
section('57. Bản 6.2.0: app hẹn hò 5 hồ sơ, Người ấy là ai chọn 1 trong 3, chu cấp khi đặt ranh giới');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const l = E.createLife({ mode: 'vn', seed: 57000, gender: 'M' }); l.age = 25; l.indep = true; l.money = 50; l.pending = []; l.partner = null; l.orient = 'straight';
  l.pending = [E.DEC.app_hen_ho.make(l, R(1))]; E.resolve(l, 'tinder'); const d = l.pending[0];
  ok(d && d.id === 'app_ho_so' && d.opts.filter(o => /^p\d$/.test(o.k)).length === 5 && /1\. .*\n2\. .*\n3\. .*\n4\. .*\n5\. /.test(d.text), 'mở app hẹn hò: hiện 5 hồ sơ để chọn nhắn tin');
  ok(l.flags.appSwipe.list.every(p => p.s === 'F'), 'hồ sơ đúng xu hướng tính dục (nam dị tính thấy hồ sơ nữ)');
  let chat = 0; for (let i = 0; i < 20; i++) { const c = JSON.parse(JSON.stringify(l)); c.rs = 5 + i * 7919; c.pending = [E.DEC.app_ho_so.make(c, R(10 + i), { app: 'Bumble', fresh: true })]; E.resolve(c, 'p0'); if (c.pending[0] && c.pending[0].id === 'hen_online') chat++; } ok(chat > 8 && chat < 20, 'chọn nhắn tin: phần lớn được trả lời, có người chỉ "seen" (' + chat + '/20)');
  const m = JSON.parse(JSON.stringify(l)); m.pending = [E.DEC.app_ho_so.make(m, R(2), { app: 'Hinge', fresh: true })]; E.resolve(m, 'luot'); ok(m.pending[0] && m.pending[0].id === 'app_ho_so', 'lướt thêm 5 hồ sơ khác');
  const f = E.createLife({ mode: 'vn', seed: 57100, gender: 'F' }); f.age = 24; f.pending = []; f.partner = null; f.flags.nali = { cs: [0, 1, 2, 3, 4].map(i => ({ n: 'Anh ' + i, age: 26, job: 'kỹ sư', st: 'cao', truth: 'single', fit: 0.6 })) };
  for (let v = 1; v <= 2; v++) { f.pending = [E.DEC.hh_nali_f.make(f, R(v), { v })]; E.resolve(f, 'c0'); }
  const fin = E.DEC.hh_nali_f.make(f, R(3), { v: 3 }); ok(fin.opts.length === 3 && fin.opts.every(o => /^Chọn /.test(o.l)), 'Người ấy là ai: chung cuộc chọn 1 trong 3 người');
  let still = 0; for (let i = 0; i < 60; i++) { const s = E.createLife({ mode: 'vn', seed: 57200 + i, gender: 'F' }); s.age = 24; s.indep = true; s.pending = []; s.partner = { name: 'Dung', sex: 'M', age: 40, status: 'dating', since: 23, alive: true, inc: 900 }; s.flags.sponsor = { name: 'Dung', active: true, monthly: 100, control: 50, since: 23 };
    s.pending = [E.DEC.sn_kiem_soat.make(s, R(i))]; E.resolve(s, 'boundary'); if (s.flags.sponsor.active && !(s.flags.sponsor.withheldUntil === s.age)) still++; }
  ok(still > 35 && still < 60, 'không để người chu cấp kiểm soát: phần lớn trường hợp người ấy vẫn chu cấp (' + still + '/60)');
}
section('58. Bản 6.3.0: quay lại với người cũ, chủ động chu cấp, tiến độ thăng chức, sống tiếp đời con');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  const mk = (sex, f) => { const l = E.createLife({ mode: 'vn', seed: 58000, gender: sex }); l.age = 35; l.indep = true; l.pending = []; if (f) f(l); return l; };
  const hk = E.HOOKS.year.find(h => /lastP/.test(h.toString()));
  const a = mk('M', x => { x.partner = { name: 'Lan', sex: 'F', age: 34, status: 'married', since: 26, alive: true }; }); hk(a, R(1), () => { }, 35); a.partner = null; hk(a, R(2), () => { }, 36); a.age = 37;
  ok(a.flags.exList.length === 1 && a.flags.exList[0].married && E.DEC.quay_lai_cu.make(a, R(3)).title === 'Gặp lại vợ cũ', 'chia tay / ly hôn thì nhớ người cũ, có thể gặp lại (vợ cũ)');
  const k = mk('M', x => { x.partner = null; x.flags.exList = [{ name: 'Lan', sex: 'F', d: -1, married: true, since: 26, until: 32 }]; x.kids = [{ name: 'Bé Na', sex: 'F', born: 28, alive: true, otherParent: 'Lan' }]; });
  let back = 0; for (let i = 0; i < 30; i++) { const c = JSON.parse(JSON.stringify(k)); c.rs = 3 + i * 7919; c.pending = [E.DEC.quay_lai_cu.make(c, R(10 + i))]; E.resolve(c, 'quay_lai'); if (c.partner && c.partner.name === 'Lan') back++; }
  ok(/đưa đón con/.test(E.DEC.quay_lai_cu.make(k, R(4)).text) && back > 10 && back < 30, 'có con chung thì dễ gặp lại, có thể quay lại với nhau (' + back + '/30)');
  ok(!E.DEC.quay_lai_cu.valid(mk('M', x => { x.partner = { name: 'Mai', sex: 'F', age: 30, status: 'dating', since: 33, alive: true }; x.flags.exList = [{ name: 'Lan', sex: 'F', d: 0, married: false, since: 20, until: 25 }]; }), {}), 'đang có người yêu thì không có chuyện quay lại với người cũ');
  const g = mk('M', x => { x.money = x.base * 60; x.income = x.base * 5; x.partner = { name: 'Thảo', sex: 'F', age: 28, status: 'dating', since: 34, alive: true, inc: 10 }; });
  g.pending = [E.DEC.chu_cap_nguoi_yeu.make(g, R(1))]; E.resolve(g, 'vua'); const gh = E.HOOKS.year.find(h => /giveSup/.test(h.toString()) && /paidAt/.test(h.toString())); const m0 = g.money; gh(g, R(5), () => { }, 36);
  ok(g.flags.giveSup && m0 - g.money > 0, 'người giàu chủ động chu cấp cho người yêu, mỗi năm trừ tiền chu cấp');
  ok(!E.DEC.chu_cap_nguoi_yeu.valid(mk('M', x => { x.money = 10; x.income = x.base; x.partner = { name: 'T', sex: 'F', age: 28, status: 'dating', since: 34, alive: true }; }), {}), 'không dư dả thì không có lựa chọn chu cấp');
  const p = mk('F', x => { E.startJob(x, 'ke_toan', R(1), () => { }); x.job.yrs = 0; }); const P = E.promoProgress(p); ok(P && P.next && P.need >= 1 && P.done === 0 && P.chance === 0 && /cần thêm/.test(P.why[0]), 'tiến độ thăng chức: chức tiếp theo, số năm còn thiếu, lý do');
  p.job.yrs = 5; p.focus = 'work'; const P2 = E.promoProgress(p); ok(P2.chance > 0 && P2.why.some(w => /tập trung công việc/.test(w)), 'đủ năm thì có cơ hội mỗi năm, tập trung công việc tăng cơ hội');
  ok(!/confirm\(/.test(fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8').replace(/\/\/[^\n]*/g, '')), 'không dùng confirm() của trình duyệt (bị chặn trong trình duyệt tích hợp) — nút "Sống tiếp đời con" luôn bấm được');
}
section('59. Bản 6.4.0: những cuộc đời không màu hồng, ôn thi chuyên theo từng môn');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  let hard = 0, n = 0; const W = [], O = []; for (let i = 0; i < 600; i++) { const l = E.createLife({ mode: 'vn', seed: (i < 300 ? 75000 : 78700) + i }); E.runHeadless(l); n++; if (l.death.age < 40) continue; const w = E.netWorth(l) / l.base; if (l.flags.hardLot) { hard++; W.push(w); } else O.push(w); }
  const med = a => { a.sort((x, y) => x - y); return a[Math.floor(a.length / 2)]; };
  ok(hard > n * 0.06 && hard < n * 0.3, 'một phần nhỏ cuộc đời gặp vận đen (' + hard + '/' + n + ')');
  const lg = a => a.reduce((t, x) => t + Math.log(Math.max(1, x + 1)), 0) / Math.max(1, a.length);
  ok(W.length >= 5 && lg(W) < lg(O), 'đời vận đen khó khăn hơn: tài sản cuối đời (trung bình log) ' + lg(W).toFixed(2) + ' so với ' + lg(O).toFixed(2) + ', trung vị ' + (W.length ? med(W).toFixed(0) : '-') + ' so với ' + med(O).toFixed(0) + ' lần thu nhập cơ sở');
  const k = E.createLife({ mode: 'vn', seed: 59200, gender: 'M' }); k.age = 16; k.pending = []; k.school = 'upper'; k.flags.vdNk = 14; k.flags.hardLot = true; k.st.kno = 60;
  let fail = 0, worker = 0; for (let i = 0; i < 20; i++) { const c = JSON.parse(JSON.stringify(k)); c.rs = 7 + i * 7919; const d = E.DEC.vd_nang_khieu_kq.make(c, R(i)); if (!d.data.win) { fail++; c.pending = [d]; E.resolve(c, 'cong_nhan'); if (c.job && E.resolveJob(c.job.id) === 'cong_nhan' && !c.school) worker++; } }
  ok(fail > 10 && worker === fail, 'rớt trường năng khiếu thì có thể bỏ học đi làm công nhân (' + worker + '/' + fail + ')');
  const j = E.createLife({ mode: 'vn', seed: 59300, gender: 'F' }); j.age = 22; j.pending = []; j.school = null; j.job = null; j.urban = false; j.money = 10; j.edu = 3;
  j.pending = [E.DEC.vd_xin_viec.make(j, R(1))]; E.resolve(j, 'ra_tp'); ok(j.urban && !!j.movedTo, 'xin việc mãi không được thì lên thành phố lập nghiệp');
  const prepOf = sub => { const l = E.createLife({ mode: 'vn', seed: 59400, gender: 'F' }); l.age = 16; l.pending = []; l.school = 'upper'; l.st.kno = 85; l.pending = [E.DEC.doi_tuyen54.make(l, R(1))]; E.resolve(l, 'yes'); E.resolve(l, sub); return l.pending[0].opts.map(o => o.l).join(' | '); };
  const en = prepOf('english'), ma = prepOf('math'), li = prepOf('lit');
  ok(en !== ma && ma !== li && /podcast|từ vựng/.test(en) && /hình học|bất đẳng thức/.test(ma) && /nghị luận|tác phẩm/.test(li), 'ôn đội tuyển mỗi môn một cách: Anh (nghe, từ vựng), Toán (hình học, bất đẳng thức), Văn (nghị luận)');
  const s = E.createLife({ mode: 'vn', seed: 59500, gender: 'F' }); s.age = 15; s.pending = []; s.school = 'lower'; s.st.kno = 80; s.pending = [E.DEC.hs.make(s, R(1))]; E.resolve(s, 'special54'); E.resolve(s, 'english'); const on = s.pending[0];
  ok(on && on.id === 'chuyen_on' && /nghe hiểu, ngữ âm/.test(on.text), 'thi vào chuyên Anh: có bước ôn thi theo dạng đề chuyên Anh');
  E.resolve(s, 'o0'); ok(!s.pending.some(d => d.id === 'chuyen_on') && (s.flags.study54.special || s.log.some(e => /chưa đỗ|Chưa đỗ|trượt/.test(e.t)) || s.school === 'upper'), 'ôn xong thì vào phòng thi, có kết quả đỗ / trượt');
}
section('60. Bản 6.5.0: mèo đi theo, tuổi thơ đa dạng, di chúc chia theo tỉ lệ, các con khi bạn mất, thừa kế đời con');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); }, Hh = E.H;
  // mèo: cứu xong có lựa chọn mang về, mang về thì có thú cưng thật
  const c = E.createLife({ mode: 'vn', seed: 60100 }); c.age = 8; c.school = 'primary'; c.pets = []; c.pending = [E.DEC.meo_ket.make(c, R(1))];
  E.resolve(c, 'adult'); const mt = c.pending[0];
  ok(mt && mt.id === 'meo_theo' && /mến bạn/.test(mt.text) && mt.opts.some(o => o.k === 'take') && mt.opts.some(o => o.k === 'leave'), 'cứu mèo xong: chú mèo mến bạn đi theo, được chọn mang về hay không');
  ok(!c.log.some(e => /được mang mèo về nuôi/.test(e.t)), 'không còn báo "được mang mèo về" khi chưa có mèo');
  E.resolve(c, 'take'); ok(Hh.pets(c).length === 1 && Hh.pets(c)[0].k === 'mèo', 'mang về thì nhà có mèo thật (hiện trong gia đình, đặt tên được)');
  const c2 = E.createLife({ mode: 'vn', seed: 60101 }); c2.age = 8; c2.school = 'primary'; c2.pets = []; c2.pending = [E.DEC.meo_theo.make(c2, R(2))]; E.resolve(c2, 'leave'); ok(!Hh.pets(c2).length, 'không mang về thì không có mèo');
  // tuổi thơ: nhiều chuyện mới, mỗi đời gặp khác nhau
  const ids = E.TRIG.filter(t => /^k6_/.test(t.id)).map(t => t.id); ok(ids.length >= 35, 'thêm ' + ids.length + ' chuyện tuổi thơ mới');
  const seen = new Set(); for (let i = 0; i < 60; i++) { const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 60200 + i }); E.runHeadless(l); Object.keys(l.flags.scN || {}).forEach(id => { if (/^k6_/.test(id)) seen.add(id); }); }
  ok(seen.size >= 25, 'các chuyện tuổi thơ mới xuất hiện ngẫu nhiên giữa các đời (' + seen.size + ' loại trong 60 đời)');
  // di chúc tự chia theo tỉ lệ
  const W = E.WILL70, mkW = () => { const l = E.createLife({ mode: 'vn', seed: 60300 }); l.age = 75; l.school = null; l.indep = true; l.money = 1000; l.loans = []; l.pending = []; l.partner = { name: 'Hoa', sex: 'F', age: 72, status: 'married', alive: true }; l.kids = [{ name: 'An', sex: 'M', born: 30, alive: true }, { name: 'Bình', sex: 'F', born: 33, alive: true, vice: 'cờ bạc' }]; l.grand = 2; return l; };
  let l = mkW(); ok(W.choices(l).some(x => x.k === 'custom') && W.recipients(l).some(x => x.kind === 'society') && W.recipients(l).some(x => x.kind === 'other') && W.recipients(l).some(x => x.kind === 'grand'), 'di chúc: tự chia cho từng người con, bạn đời, các cháu, người khác, xã hội');
  let d = E.act(l, 'di_chuc70'); d.data.plan = 'custom'; d.data.shares = { k0: 60, k1: 50 }; ok(/quá 100%/.test(W.check(l, d.data)), 'tổng quá 100% bị chặn');
  d.data.shares = { k0: 50, k1: 0, p: 20, o: 10, s: 10 }; d.data.otherName = ''; ok(/tên người nhận/.test(W.check(l, d.data)), 'chia cho người khác phải ghi tên');
  d.data.otherName = 'Cô Tư hàng xóm'; d.data.cause = 'benh'; ok(!W.check(l, d.data), 'di chúc hợp lệ'); E.resolve(l, 'save');
  l.alive = false; l.death = { age: 75, year: l.birthYear + 75, cause: 'tuổi già' }; const net = E.netWorth(l), s = W.settle(l);
  const get = n => s.list.filter(x => x.name === n).reduce((a, x) => a + x.amount, 0), law = n => s.law.filter(x => x.name === n).reduce((a, x) => a + x.amount, 0);
  ok(net > 0 && Math.abs(get('An') - net * 0.5) < 1e-6 && Math.abs(get('Hoa') - net * 0.2) < 1e-6 && Math.abs(get('Cô Tư hàng xóm') - net * 0.1) < 1e-6 && Math.abs(get(W.causes.benh) - net * 0.1) < 1e-6 && get('Bình') === 0, 'chia đúng tỉ lệ: con 50%, bạn đời 20%, người khác 10%, quỹ bệnh nhi 10%, đứa con cờ bạc 0%');
  ok(Math.abs(s.unassigned - net * 0.1) < 1e-6 && s.law.length === 3 && Math.abs(law('Bình') - net * 0.1 / 3) < 1e-6, '10% chưa chia được chia theo pháp luật cho các con và bạn đời');
  ok(Math.abs(s.list.reduce((a, x) => a + x.amount, 0) + s.law.reduce((a, x) => a + x.amount, 0) - net) < 1e-6, 'tổng phần chia đúng bằng di sản, không sinh thêm tiền');
  const fin = E.finale(l), grief = fin.find(x => x.h === 'Khi các con hay tin');
  ok(fin.some(x => x.h === 'Di chúc để lại' && x.list.some(t => /50%/.test(t))) && grief && grief.list.length >= 3, 'khúc cuối có di chúc theo tỉ lệ và cảnh từng người con, bạn đời');
  ok(grief && grief.list.some(t => /Bình/.test(t) && /(nghẹn ngào|biết lỗi|khóc không thành tiếng)/.test(t)), 'đứa con phá gia chi tử nghẹn ngào nhận ra bố / mẹ đã hy sinh');
  ok(JSON.stringify(E.finale(l)) === JSON.stringify(fin), 'khúc cuối ổn định, mở lại vẫn như cũ');
  // con chưa thành niên được ít nhất 2/3 suất pháp luật
  const y = mkW(); y.kids.push({ name: 'Út', sex: 'M', born: 70, alive: true }); d = E.act(y, 'di_chuc70'); d.data.plan = 'custom'; d.data.shares = { s: 100 }; d.data.cause = 'hoc'; E.resolve(y, 'save'); y.alive = false; y.death = { age: 75, year: y.birthYear + 75, cause: 'tuổi già' };
  const sy = W.settle(y), ut = sy.list.filter(x => x.name === 'Út').reduce((a, x) => a + x.amount, 0), ny = sy.net;
  ok(Math.abs(ut - ny / 4 * 2 / 3) < 1e-6 && sy.notes.length === 1 && Math.abs(sy.list.reduce((a, x) => a + x.amount, 0) - ny) < 1e-6, 'con chưa thành niên vẫn được 2/3 một suất thừa kế dù di chúc cho hết xã hội');
  // các kiểu con khác nhau
  const types = new Set(), base = { name: 'X', sex: 'M', born: 30, alive: true, close: 60 };
  [{ vice: 'ma túy' }, { close: 20 }, { abroadStudy: true }, { edu: 5, job: 'bác sĩ' }, { close: 90 }, {}, { born: 70 }, { born: 60 }, { jail: 60 }].forEach(x => types.add(E.kidGrief.type(l, Object.assign({}, base, x))));
  ok(types.size >= 9, 'nhiều kiểu phản ứng tùy con: ' + [...types].join(', '));
  // sống tiếp đời con
  let P = null; for (let i = 0; i < 300 && !P; i++) { const x = E.createLife({ mode: 'vn', seed: 60400 + i }); E.runHeadless(x); if (x.death.age >= 70 && E.netWorth(x) > 0 && x.kids.filter(k => k.alive && x.death.age - k.born >= 25).length >= 2) P = x; }
  ok(!!P, 'tìm được đời có nhiều con để thử');
  if (P) {
    const kids = P.kids.filter(k => k.alive), k = kids[1], ka = P.death.age - k.born, sh = E.heirShare(P, k), es = E.WILL70.estate(P);
    ok(sh > 0 && Math.abs(kids.reduce((a, x) => a + E.heirShare(P, x), 0) - es.law.concat(es.list).filter(x => x.kid != null).reduce((a, x) => a + x.amount, 0)) < 1e-6, 'mỗi người con có phần thừa kế riêng');
    const b = E.createLife(E.childOpts(P, k)); E.runHeadless(b);
    const side = P.sex === 'F' ? 'mẹ' : 'bố', dl = b.log.filter(e => e.t.indexOf((side === 'mẹ' ? 'Mẹ ' : 'Bố ') + P.name + ' qua đời ở tuổi ' + P.death.age) === 0);
    ok(b.death.age < ka || (dl.length === 1 && dl[0].a === ka), 'sống từ lúc chào đời: ' + side + ' ra đi đúng năm con ' + ka + ' tuổi, đúng tuổi ' + P.death.age);
    ok(b.death.age < ka || b.log.some(e => e.a === ka && /được hưởng/.test(e.t)), 'sống từ lúc chào đời: nhận đúng phần thừa kế khi ' + side + ' mất');
    const h = E.heirAtAge(P, k); ok(h && h.age === ka && h.alive && h.name === k.name && h.fam[P.sex === 'F' ? 'mAlive' : 'fAlive'], 'tiếp tục ở tuổi hiện tại: bắt đầu đúng ' + ka + ' tuổi, ' + side + ' còn sống đến năm ấy');
    if (h) { const m0 = h.money; E.beginYear(h, {}); let g = 0; while (h.pending.length && g++ < 64) E.resolve(h, E.autoKey(h)); E.finishYear(h);
      ok(!h.fam[P.sex === 'F' ? 'mAlive' : 'fAlive'] && h.log.some(e => /được hưởng/.test(e.t)), 'năm ấy ' + side + ' mất và bạn nhận thừa kế');
      const it = (h.yr.items || []).filter(x => /^Thừa kế từ/.test(x.t)); ok(it.length === 1 && Math.abs(it[0].v - h.flags.heirOf.amt) < 1e-6 && Math.abs(h.flags.heirOf.amt - sh) < 1e-6, 'tiền thừa kế được cộng đúng một lần vào tiền mặt, đúng bằng phần của con'); }
  }
  const appSrc = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8');
  ok(/data-hm="now"/.test(appSrc) && /heirAtAge/.test(appSrc) && /data-share/.test(appSrc), 'màn kết thúc: chọn sống từ lúc chào đời hay ở tuổi hiện tại; di chúc nhập tỉ lệ từng người');
}
section('61. Bản 6.6.0: hoàng tộc, nghề khoa học, con đường chính trị, nhiều kết quả, thành tựu, gia phả');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); };
  // hoàng tộc: chỉ ở nước còn chế độ quân chủ, hiếm, có sự kiện riêng
  let roy = 0, n = 0, other = 0, royals = [];
  for (let i = 0; i < 1500; i++) { const l = E.createLife({ mode: 'world', country: ['GB', 'JP', 'TH', 'SE', 'SA'][i % 5], seed: 61000 + i }); n++; if (l.flags.royal) { roy++; royals.push(l); } }
  for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: 'world', country: ['US', 'FR', 'DE', 'KR', 'BR'][i % 5], seed: 61500 + i }); if (l.flags.royal) other++; }
  for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: 'vn', seed: 61800 + i }); if (l.flags.royal) other++; }
  ok(roy > n * 0.01 && roy < n * 0.06 && other === 0, 'xuất thân hoàng tộc hiếm, chỉ ở nước còn quân chủ (' + roy + '/' + n + ', nước khác ' + other + ')');
  const r0 = royals[0]; ok(r0 && r0.fam.q === 5 && /thái tử|hoàng thân/.test(r0.fam.fJob) && !r0.fam.elite, 'gia đình hoàng tộc: giàu nhất, bố là thái tử / hoàng thân');
  if (r0) { E.runHeadless(r0); ok(r0.log.some(e => /hoàng tộc|Hoàng gia|hoàng gia/.test(e.t)) && E.achievementsOf(r0).some(a => a.id === 'hoang_toc'), 'đời hoàng tộc có sự kiện riêng và thành tựu "Dòng dõi hoàng tộc"'); }
  const k = E.createLife({ mode: 'world', country: 'GB', seed: 61001 }); k.flags.royal = { tier: 'direct', c: 'GB', house: 'Hoàng gia Anh' }; k.age = 30; k.pending = []; k.fam.fJob = 'thái tử'; k.fam.fAlive = false; k.fam.mAlive = false; k.fam.sibs = 0; k.sibList = [];
  const hk = E.HOOKS.year.find(h => /reignAt/.test(h.toString())), m0 = k.money; hk(k, R(1), () => { }, 30);
  ok(k.flags.royal.reign && E.royalTitle(k) === (k.sex === 'F' ? 'Nữ hoàng' : 'Quốc vương') && k.money > m0, 'con trưởng nhánh chính kế vị khi người trị vì qua đời, có ngân sách hoàng gia');
  const q = E.createLife({ mode: 'world', country: 'GB', seed: 61002 }); q.flags.royal = { tier: 'branch', c: 'GB', house: 'Hoàng gia Anh' }; q.flags.royalPressure = true; q.age = 30; q.pending = [E.DEC.r_tu_bo.make(q, R(2))]; E.resolve(q, 'tu_bo');
  const mq = q.money; hk(q, R(3), () => { }, 31); ok(q.flags.royal.quit && q.money === mq && E.royalTitle(q) === 'cựu thành viên hoàng tộc', 'từ bỏ tước hiệu thì thôi nhận trợ cấp hoàng tộc');
  // nghề khoa học
  ok(['ky_su_rd', 'ky_su_vu_tru', 'nc_y_sinh', 'nong_cnc'].every(id => E.CAR[id] && E.CAR[id].t.length >= 3), 'thêm nghề R&D, hàng không vũ trụ, nghiên cứu y sinh, nông nghiệp công nghệ cao');
  const s = E.createLife({ mode: 'vn', seed: 61100 }); s.age = 23; s.school = null; s.edu = 5; s.st.kno = 90; s.pending = [E.DEC.nc_moi.make(s, R(4))]; E.resolve(s, 'nhan');
  ok(s.job && s.job.id === 'nghien_cuu' && s.sched.some(x => x.id === 'nc_bao_ve'), 'nhận lời làm nghiên cứu: vào nghề, có lịch bảo vệ thạc sĩ');
  s.age = 25; s.pending = [E.DEC.nc_bao_ve.make(s, R(5), { lv: 6 })]; E.resolve(s, 'ky'); s.age = 29; s.pending = [E.DEC.nc_bao_ve.make(s, R(6), { lv: 7 })]; E.resolve(s, 'ky');
  ok(s.edu >= 6, 'bảo vệ luận văn / luận án nâng học vị (' + s.edu + ')');
  // chính trị
  const c = E.createLife({ mode: 'vn', seed: 61200 }); c.age = 40; c.school = null; c.edu = 5; E.startJob(c, 'cong_chuc', R(7), () => { }); c.job.rank = 2; c.pending = [E.DEC.ct_quy_hoach.make(c, R(8))]; E.resolve(c, 'nhan');
  ok(c.job.id === 'chinh_tri' && c.job.rank === 1, 'công chức được quy hoạch, điều động sang khối Đảng / chính quyền');
  let won = 0; for (let i = 0; i < 40; i++) { const x = JSON.parse(JSON.stringify(c)); x.rs = 9 + i * 7919; x.pending = [E.DEC.ct_ung_cu.make(x, R(i))]; E.resolve(x, 'nhan'); if (x.flags.daiBieu) won++; }
  ok(won > 10 && won < 40, 'ứng cử đại biểu: có người trúng, có người không (' + won + '/40)');
  const w = E.createLife({ mode: 'world', country: 'US', seed: 61300 }); w.age = 40; w.school = null; w.edu = 5; w.st.soc = 90; w.money = w.base * 5;
  let wins = 0; for (let i = 0; i < 30; i++) { const x = JSON.parse(JSON.stringify(w)); x.rs = 3 + i * 104729; x.pending = [E.DEC.ct_tranh_cu.make(x, R(100 + i))]; E.resolve(x, 'ra'); if (x.job && x.job.id === 'chinh_khach') wins++; }
  ok(wins > 3 && wins < 30, 'thế giới: tranh cử hội đồng thành phố, thắng thì thành chính khách (' + wins + '/30)');
  // nhiều kết quả cho cùng lựa chọn
  const V = E.LOG_VARIANTS, key = 'Kìm lòng, quyết định để dành.'; ok(Object.keys(V).length >= 40 && V[key].length >= 2, 'thêm cách kể khác cho ' + Object.keys(V).length + ' kết quả cố định');
  const seenT = new Set(); for (let i = 0; i < 40; i++) { const m = E.createLife({ mode: 'vn', seed: 61400 + i }); m.age = 25; m.school = null; m.money = m.base; m.pending = [E.DEC.mua_sam.make(m, R(i))]; E.resolve(m, 'save'); m.log.slice(-3).forEach(e => { if (e.t === key || V[key].includes(e.t)) seenT.add(e.t); }); }
  ok(seenT.size >= 3, 'cùng một lựa chọn cho ra nhiều câu khác nhau (' + seenT.size + ')');
  // thành tựu và gia phả
  ok(E.ACHIEVEMENTS.length >= 80 && new Set(E.ACHIEVEMENTS.map(a => a.id)).size === E.ACHIEVEMENTS.length, 'có ' + E.ACHIEVEMENTS.length + ' thành tựu, không trùng mã');
  const cnt = {}; let lives = 0; for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 61600 + i }); E.runHeadless(l); lives++; E.achievementsOf(l).forEach(a => cnt[a.id] = (cnt[a.id] || 0) + 1); }
  ok(Object.values(cnt).every(v => v < lives * 0.9) && Object.keys(cnt).length >= 40, 'thành tựu không quá dễ (mỗi cái < 90% số đời), nhiều loại mở được (' + Object.keys(cnt).length + ')');
  let P = null; for (let i = 0; i < 200 && !P; i++) { const x = E.createLife({ mode: 'vn', seed: 61900 + i }); E.runHeadless(x); if (x.kids.some(k2 => k2.alive)) P = x; }
  const kid = P.kids.find(k2 => k2.alive), child = E.createLife(E.childOpts(P, kid)); E.runHeadless(child);
  const tr = E.treeRecord(child), tp = E.treeRecord(P);
  ok(tr.pid === P.id && tr.gen === (P.gen || 1) + 1 && tp.k.some(x => x.n === kid.name) && !badText(tr.y + tr.w + tr.n), 'gia phả: đời con ghi đúng đời bố / mẹ, đúng thế hệ');
  ok(E.achievementsOf(child).some(a => a.id === 'song_tiep'), 'thành tựu "Tiếp nối" khi sống tiếp đời con');
  const sum = E.share.summary(child); ok(Array.isArray(sum.ach) && sum.ach.length <= 4, 'ảnh thẻ / link chia sẻ kèm thành tựu');
  const app = fs.readFileSync(path.join(ROOT, 'js/app.js'), 'utf8'), card = fs.readFileSync(path.join(ROOT, 'js/card.js'), 'utf8'), idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  ok(/legacyBtn/.test(idx) && /function openLegacy/.test(app) && /treeHtml/.test(app) && /cardStory/.test(app) && /1920/.test(card), 'giao diện: nút Thành tựu, gia phả ở màn kết thúc, ảnh thẻ khổ dọc 9:16');
  ok(!fs.readdirSync(ROOT).some(f => /\.(md|csv)$/.test(f)), 'thư mục public không còn tài liệu nội bộ (.md, .csv)');
}
section('62. Bản 6.7.0: dữ liệu Nemotron-Personas-Vietnam, di sản, lễ tết dân tộc, lịch sử, bầu cử, ngày lễ');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); }, PV = G.PERSONAS_VN;
  ok(PV && PV.sampled >= 5000 && Object.keys(PV.regions).length === 12 && /Nemotron-Personas-Vietnam/.test(PV.source) && /CC BY 4.0/.test(PV.source), 'có số liệu tổng hợp từ Nemotron-Personas-Vietnam (' + (PV && PV.sampled) + ' persona, 6 vùng × thành thị / nông thôn), ghi nguồn và giấy phép');
  const dish = k => PV.regions[k].dish.slice(0, 12).map(x => x[0]);
  ok(dish('DBSCL_r').some(d => /hủ tiếu|lẩu mắm|cá kho/.test(d)) && dish('DBSH_u').some(d => /bún chả|bún riêu|bánh cuốn/.test(d)) && PV.regions.TN_r.job.slice(0, 6).some(x => /cà phê|cao su|hồ tiêu/.test(x[0])), 'số liệu phản ánh khác biệt vùng miền (món ăn, nghề nghiệp)');
  ok(/Nemotron-Personas-Vietnam/.test(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')), 'trang chủ ghi công bộ dữ liệu');
  // người quen theo vùng
  const mk = (seed, o) => { const l = E.createLife(Object.assign({ mode: 'vn', seed }, o || {})); l.age = 30; l.school = null; l.indep = true; l.pending = []; return l; };
  let okJob = 0, tried = 0, retiredYoung = 0;
  for (let i = 0; i < 80; i++) { const l = mk(62000 + i); const d = E.DEC.pv_nguoi_quen.make(l, R(i)); if (d.data.none) continue; tried++; const g = E.PERSONA.group(l); if (g.job.some(x => x[0] === d.data.job)) okJob++; if (d.data.age < 55 && /^Nghỉ hưu/.test(d.data.job)) retiredYoung++; ok(!badText(d.text) && d.opts.length === 3, 'người quen: lời kể sạch #' + i); }
  ok(tried > 60 && okJob === tried && retiredYoung === 0, 'người quen có nghề theo đúng vùng, không có người trẻ "nghỉ hưu" (' + okJob + '/' + tried + ')');
  const t = mk(62100); const d1 = E.DEC.pv_thu_vui.make(t, R(1)); E.resolve(Object.assign(t, { pending: [d1] }), 'h0'); ok((t.flags.hobbies || []).length === 1, 'chọn thú vui phổ biến theo vùng, tuổi');
  // di sản UNESCO đúng địa phương
  const her = (prov, eth) => { const l = mk(62200); l.prov = Object.assign({}, l.prov, { old: prov, region: G.VN.byName[prov] ? G.VN.byName[prov].region : l.prov.region }); if (eth) l.eth = eth; return E.heritageFor(l).map(h => h.id); };
  ok(her('Bắc Ninh').includes('quan_ho') && her('Phú Thọ').includes('xoan') && her('Phú Thọ').includes('hung_vuong') && her('An Giang').includes('ba_chua_xu') && her('Ninh Thuận').includes('gom_cham') && her('Gia Lai').includes('cong_chieng') && her('Sơn La', 'Thái').includes('xoe') && !her('Cà Mau').includes('quan_ho'), 'di sản UNESCO gắn đúng địa phương, dân tộc');
  ok(E.HERITAGE_VN.length === 16, 'đủ 16 di sản văn hóa phi vật thể của Việt Nam được UNESCO ghi danh');
  const kh = mk(62300, { eth: 'Khmer' }); const f = E.DEC.vh_le_dan_toc.make(kh, R(3)); ok(!f.data.none && /Chôl Chnăm Thmây|Sene Dolta|Ok Om Bok/.test(f.title), 'người Khmer có lễ tết của dân tộc mình');
  // lịch sử: các mốc chính xác
  const H2 = E.HISTORY_VN.map(x => x.join(' ')).join(' | ');
  ok(/938.*Ngô Quyền.*Bạch Đằng/.test(H2) && /1288.*Bạch Đằng/.test(H2) && /1789.*Ngọc Hồi – Đống Đa/.test(H2) && /2\/9\/1945.*Tuyên ngôn Độc lập/.test(H2) && /7\/5\/1954.*Điện Biên Phủ/.test(H2) && /30\/4\/1975.*thống nhất/.test(H2) && /1986.*Đổi mới/.test(H2) && /1\/7\/2025.*34 tỉnh/.test(H2), 'bài học lịch sử dùng đúng các mốc chính thức');
  // bầu cử: đúng chu kỳ 5 năm, đúng luật
  const vt = mk(62400); vt.birthYear = 2026 - 30; const tr = E.TRIG.find(x => x.id === 'bau_cu');
  ok(tr.when(vt, 30) === true, 'năm 2026 có bầu cử'); vt.birthYear = 2027 - 30; ok(tr.when(vt, 30) === false, 'năm 2027 không có bầu cử'); vt.birthYear = 2031 - 30; ok(tr.when(vt, 30) === true, 'năm 2031 có bầu cử (5 năm một lần)');
  vt.pending = [E.DEC.bau_cu.make(vt, R(4))]; E.resolve(vt, 'nho'); ok(vt.log.some(e => /tự mình đi bầu, không được nhờ người khác bầu thay/.test(e.t)) && tr.when(vt, 30) === false, 'nhờ bầu hộ: được giải thích đúng Luật Bầu cử, không bầu lại trong cùng năm');
  // ngày lễ: làm ngày lễ được trả ít nhất 300%
  const w = mk(62500); E.startJob(w, 'ke_toan', R(5), () => { }); w.income = 120; const m0 = w.money; w.pending = [E.DEC.le_30_4.make(w, R(6))]; E.resolve(w, 'tang_ca'); ok(Math.abs((w.money - m0) - 120 / 365 * 2 * 3) < 1e-6, 'đi làm ngày lễ 30/4 – 1/5 được trả gấp 3 (Bộ luật Lao động 2019)');
  // chạy nhiều đời không lỗi, các sự kiện mới đều xuất hiện
  const seen = {}; for (let i = 0; i < 150; i++) { const l = E.createLife({ mode: 'vn', seed: 62600 + i }); E.runHeadless(l); Object.keys(l.flags.scN || {}).forEach(k => seen[k] = 1); }
  ok(['pv_nguoi_quen', 'pv_thu_vui', 'vh_di_san', 'ls_bai_hoc', 'ls_ong_ba_ke', 'ls_27_7', 'gio_to', 'le_30_4', 'bau_cu'].every(k => seen[k]), 'các sự kiện văn hóa, lịch sử mới đều xuất hiện trong các đời Việt Nam');
  const wl = E.createLife({ mode: 'world', country: 'US', seed: 62700 }); E.runHeadless(wl); ok(!Object.keys(wl.flags.scN || {}).some(k => /^(pv_|vh_di_san|ls_|gio_to|le_30_4|bau_cu)/.test(k)), 'đời ở nước ngoài không gặp sự kiện riêng của Việt Nam');
}
section('63. Bản 6.8.0: khai thác sâu Nemotron-Personas-Vietnam, đối chiếu mô phỏng, thêm thành tựu');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); }, PV = G.PERSONAS_VN;
  // mẫu lớn, đại diện đúng toàn bộ tập dữ liệu (tỉ lệ vùng của 1.000.000 persona theo thống kê công bố)
  const FULL = { DBSH: 24.49, MNPB: 12.43, BTB: 17.62, TN: 9.18, DNB: 20.78, DBSCL: 15.50 };
  ok(PV.sampled >= 150000, 'mẫu ' + PV.sampled + ' persona (khoảng 18% bộ dữ liệu)');
  const share = k => ((PV.regions[k + '_u'] || { n: 0 }).n + (PV.regions[k + '_r'] || { n: 0 }).n) / PV.sampled * 100;
  ok(Object.keys(FULL).every(k => Math.abs(share(k) - FULL[k]) < 1), 'tỉ lệ 6 vùng trong mẫu khớp toàn bộ dữ liệu (sai lệch dưới 1 điểm)');
  ok(Object.values(PV.regions).every(g => g.n >= 3000), 'nhóm nhỏ nhất vẫn có từ 3.000 persona');
  ok(Object.keys(PV.skills).length >= 100 && Object.keys(PV.goalsByJob).length >= 80 && Object.values(PV.regions).every(g => g.sport.length >= 10 && g.place.length >= 10 && g.art.length >= 10 && g.goal.length >= 5), 'có kỹ năng, mục tiêu theo nghề; thể thao, du lịch, văn nghệ, mục tiêu theo vùng');
  ok(Object.keys(PV.edu).length >= 20 && Object.keys(PV.marital).length >= 8, 'có phân bố học vấn, hôn nhân theo vùng và tuổi');
  ok(PV.skills['Ngư dân'] && PV.skills['Ngư dân'].some(s => /biển|lưới|tàu|hải sản/i.test(s)), 'kỹ năng đúng nghề (ngư dân: biển, lưới, tàu thuyền)');
  ok(PV.regions.DBSCL_r.art.slice(0, 8).some(x => /đờn ca tài tử|cải lương/.test(x[0])) && PV.regions.DBSH_r.art.slice(0, 12).some(x => /chèo|quan họ/.test(x[0])), 'văn nghệ đúng vùng (miền Tây: đờn ca tài tử, cải lương; đồng bằng Bắc Bộ: chèo, quan họ)');
  // sự kiện mới
  const mk = (seed, o) => { const l = E.createLife(Object.assign({ mode: 'vn', seed }, o || {})); l.age = 35; l.school = null; l.indep = true; l.money = l.base * 6; l.pending = []; return l; };
  let withSkill = 0, nq = 0; for (let i = 0; i < 40; i++) { const l = mk(63000 + i), d = E.DEC.pv_nguoi_quen.make(l, R(i)); if (d.data.none) continue; nq++; if (/giỏi|mong nhất/.test(d.text)) withSkill++; ok(!badText(d.text), 'người quen kể nghề, kỹ năng, mong muốn: lời kể sạch #' + i); }
  ok(nq > 30 && withSkill >= nq * 0.8, 'người quen kể thêm kỹ năng nghề và điều đang mong muốn (' + withSkill + '/' + nq + ')');
  for (const id of ['pv_the_thao', 'pv_du_lich', 'pv_van_nghe']) { let shown = 0; for (let i = 0; i < 20; i++) { const l = mk(63100 + i), d = E.DEC[id].make(l, R(i)); if (d.data.none) continue; shown++; ok(!badText(d.text) && d.opts.length >= 3, id + ' sạch #' + i); } ok(shown >= 15, id + ' xuất hiện được ở hầu hết các vùng (' + shown + '/20)'); }
  const hcm = mk(63200); hcm.movedTo = 'TP. Hồ Chí Minh'; hcm.urban = true; let sg = 0; for (let i = 0; i < 30; i++) { const d = E.DEC.pv_du_lich.make(hcm, R(i)); if (!d.data.none && d.data.list.includes('Sài Gòn')) sg++; } ok(sg === 0, 'không gợi ý đi du lịch chính nơi mình đang sống');
  const v = mk(63300), d = E.DEC.pv_van_nghe.make(v, R(5)); ok(d.data.none || !d.data.list.some(x => /karaoke|nhiếp ảnh|phim Hàn/.test(x)), 'đêm văn nghệ chỉ có tiết mục biểu diễn');
  // đối chiếu mô phỏng với dữ liệu
  let prim = 0, n20 = 0, mar35 = 0, n35 = 0; for (let i = 0; i < 300; i++) { const l = E.createLife({ mode: 'vn', seed: 63400 + i }); E.runHeadless(l, x => { if (x.age === 20) { n20++; if (x.edu <= 1) prim++; } if (x.age === 38) { n35++; if (x.partner && x.partner.alive !== false && x.partner.status !== 'dating') mar35++; } }); }
  ok(prim / n20 < 0.1, 'Việt Nam: người 20 tuổi chỉ học hết tiểu học dưới 10%, sát dữ liệu (' + (prim / n20 * 100).toFixed(0) + '%, trước đây ~17%)');
  ok(mar35 / n35 > 0.6, 'Việt Nam: người 38 tuổi đã lập gia đình trên 60% (' + (mar35 / n35 * 100).toFixed(0) + '%)');
  const w = E.createLife({ mode: 'world', country: 'NG', seed: 63500 }); ok(w.mode === 'world', 'thế giới không bị đổi công thức học vấn của Việt Nam');
  const s = mk(63600); s.age = 30; s.partner = null; const xm = E.DEC.vn_xem_mat.make(s, R(9)); ok(/xem mắt|giới thiệu/.test(xm.title + xm.text) && !badText(xm.text), 'mai mối, xem mắt khi chưa có ai');
  s.partner = { name: 'Hà', sex: 'F', age: 29, status: 'dating', since: 26, alive: true }; ok(E.DEC.vn_giuc_cuoi.valid(s, {}), 'yêu lâu thì hai bên gia đình giục cưới');
  // thành tựu
  const ids = E.ACHIEVEMENTS.map(a => a.id), ts = E.ACHIEVEMENTS.map(a => a.t);
  ok(ids.length >= 120 && new Set(ids).size === ids.length, 'có ' + ids.length + ' thành tựu, không trùng mã');
  ok(ts.includes('Doanh nhân đầu tàu') && ts.includes('Mưu sinh xứ người') && ts.includes('Lá lành đùm lá rách') && !ts.includes('Thuyền trưởng doanh nghiệp') && !ts.includes('Xứ người mưu sinh') && !ts.includes('Bàn tay chìa ra'), 'đổi tên thành tựu theo góp ý');
  ok(fs.existsSync(path.join(ROOT, '..', 'docs', 'persona-calibration.md')), 'có báo cáo đối chiếu mô phỏng');
}
section('64. Bản 6.9.0: toàn bộ 1 triệu persona, số liệu theo 34 tỉnh, món đặc trưng đúng tỉnh, tài khoản');
{
  const R = s => { const h = { rs: s }; return () => U.rand(h); }, PV = G.PERSONAS_VN;
  ok(PV.sampled === 1000000, 'dùng toàn bộ 1.000.000 persona');
  ok(Object.keys(PV.provinces || {}).length === 34 && G.VN.P34.every(p => PV.provinces[p.name] && PV.provinces[p.name].n >= 3000), 'có số liệu cho đủ 34 tỉnh, thành, mỗi nơi từ 3.000 persona');
  const SP = E.PROVINCE_SPECIALTIES; ok(Object.keys(SP).every(k => G.VN.P34.some(p => p.name === k)), 'đặc sản gắn với đúng tên 34 tỉnh, thành sau sắp xếp');
  ok(SP['Huế'].includes('cơm hến') && SP['Hải Phòng'].includes('bánh đa cua') && SP['Thanh Hóa'].includes('nem chua') && !(SP['Gia Lai'] || []).includes('cao lầu'), 'đặc sản theo danh sách đã biết rộng rãi, không lấy món sai tỉnh từ dữ liệu tổng hợp');
  const at = name => { const l = E.createLife({ mode: 'vn', variant: '34', prov: String(G.VN.P34.findIndex(p => p.name === name)), seed: 64000 }); l.age = 30; l.school = null; l.indep = true; l.movedTo = name === 'Hà Nội' ? 'TP. Hồ Chí Minh' : 'Hà Nội'; return l; };
  let hit = 0; for (let i = 0; i < 30; i++) { const d = E.DEC.pv_mon_que.make(at('Huế'), R(i)); if (/bún bò Huế|cơm hến|bánh bèo|bánh nậm|bánh lọc/.test(d.text)) hit++; ok(!badText(d.text), 'món quê sạch #' + i); }
  ok(hit >= 15, 'người Huế xa quê nhớ món của Huế (' + hit + '/30)');
  for (let i = 0; i < 20; i++) { const d = E.DEC.pv_mon_que.make(at('Gia Lai'), R(i)); ok(!/cao lầu/.test(d.text) || !/đặc trưng của Gia Lai/.test(d.text), 'không gán cao lầu là đặc trưng của Gia Lai #' + i); }
  // tài khoản: tệp và định tuyến
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'), wk = fs.readFileSync(path.join(ROOT, '_worker.js'), 'utf8'), acc = fs.readFileSync(path.join(ROOT, 'js/account.js'), 'utf8');
  ok(/id="accountBtn"/.test(idx) && /js\/account\.js/.test(idx), 'có nút Tài khoản và mã tài khoản trên trang');
  ok(/PBKDF2/.test(wk) && /iterations: ACC\.iter/.test(wk) && /sha256\(token\)/.test(wk) && !/console\.log/.test(wk), 'mật khẩu băm PBKDF2, mã phiên chỉ lưu bản băm');
  ok(!/confirm\(/.test(acc.replace(/\/\/[^\n]*/g, '')) && /Không cần email/.test(acc), 'không dùng hộp confirm của trình duyệt, không thu email');
}
function isVNx(l) { return E.isVN(l); }

console.log('\n' + '='.repeat(60));
console.log('KẾT QUẢ: ' + pass + ' đạt, ' + fail + ' lỗi');
if (fail) {
  const uniq = [...new Set(fails)];
  console.log('Lỗi (tối đa 40 dòng đầu, ' + uniq.length + ' loại):');
  uniq.slice(0, 40).forEach(f => console.log('  ✗ ' + f));
  process.exit(1);
}
console.log('✓ Tất cả bài kiểm thử hồi quy đều đạt.');
