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
const MODULES = ['js/util.js', 'js/data-vn.js', 'js/data-world.js', 'js/names.js', 'js/currency.js', 'js/engine.js', 'js/careers.js', 'js/scenarios.js', 'js/expansion.js', 'js/wealth.js', 'js/jobs.js', 'js/childhood.js', 'js/finale.js', 'js/scene.js'];
for (const f of MODULES) {
  vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx, { filename: f });
}
const G = ctx.G;
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
  const UI_SCRIPTS = ['js/music.js', 'js/card.js', 'js/app.js']; // chỉ chạy trên trình duyệt
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
  ['#bornBtn', '#provSel', '#ethSel', '#nameInp', '#genderChips', '#lgbtChips', '#lenChips', '#logList', '#lifeMap', '#cohortLive', '#placePanel', '#modalRoot', '#memAll', '#endWrap', '#birthWrap', '#skipBtn', '#autoBtn', '#pauseBtn', '#speeds', '#exitBtn', '#actPanel', '#finPanel', '#recentList', '#sharedWrap', '#famPanel', '#idCard', '#statsPanel', '#heroProfile', '#scenePanel', '#minorBtn', '#jobsBtn', '#statJobs']
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
ok(VN.P34.filter(n => n.kind === 'Thành phố').length === 6, '6 thành phố trực thuộc TW');
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
for (const g of ['random', 'M', 'F', 'gay', 'lesbian', 'bi']) {
  for (const mode of ['vn', 'world']) {
    const l = E.createLife({ mode, gender: g, seed: seed++ });
    const exp = { M: ['M', 'straight'], F: ['F', 'straight'], gay: ['M', 'gay'], lesbian: ['F', 'gay'] }[g];
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
    ok(med > 4 && med < 60, mode + ': tài sản cuối đời trung vị hợp lý');
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
  const g = ['random', 'M', 'F', 'gay', 'lesbian', 'bi'][i % 6];
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
  if (adult) [['tham_tu', 1], ['cong_an', 3, l => { l.job.br = 'mt'; l.flags.revenge = 1; }], ['luat_su', 2], ['tham_phan', 2], ['bac_si', 2], ['giao_vien', 1], ['chu_nha_hang', 1], ['tiem_dt', 2], ['cam_do', 1],
    ['ky_su_xd', 1], ['phong_vien', 1], ['sale_bds', 1], ['ngan_hang', 2], ['chinh_tri', 3, l => { l.flags.dirty = 1; }], ['dau_bep', 2],
    ['tai_phiet', 2, l => { l.fam.elite = 'tp'; l.flags.eliteFollow = true; l.flags.eliteChoice = true; l.fam.fAlive = true; l.sibList = [sib('Phạm Văn Cả', 'M', -2)]; l.mkt.land = 'đóng băng'; }],
    ['kd_tu_do', 1, l => { l.fam.elite = 'nh'; l.flags.eliteCut = true; l.flags.eliteChoice = true; l.fam.fAlive = true; }]]
    .forEach(([id, rk, f]) => { const l = clone(adult); E.startJob(l, id, r(14), () => { }); l.job.rank = rk; l.job.yrs = 5; if (f) f(l); T.push(l); });
  T.push(grow({ mode: 'vn', seed: 122 }, 17, l => { l.fam.elite = 'tp'; l.fam.q = 5; l.flags.eliteChoice = false; }));
  T.push(grow({ mode: 'vn', seed: 120 }, 61, l => { l.indep = true; l.retired = true; l.job = null; l.pensioned = true; l.pensionInc = l.base * 0.6; l.money = l.base * 5; l.st.hea = 70; }));
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
      try { d = E.DEC[id].make(l0, () => U.rand(l0), id === 'bi_bat' ? { why: 'trộm cắp tài sản', sev: 1 } : id === 'csgt' ? { why: 'vượt đèn đỏ', f: 5 } : id === 'con_18' || id === 'con_lac_loi' ? { n: (l0.kids.find(k => k.alive && (id !== 'con_lac_loi' || k.vice)) || {}).name } : undefined); }
      catch (e) { return; } // tình huống không áp dụng cho khuôn này
      if (!d || !d.opts.length) return;
      if (E.DEC[id].valid && !E.DEC[id].valid(l0, d.data)) return;
      ok(!badText(d.title) && !badText(d.text) && d.opts.every(o => !badText(o.l) && !badText(o.h)), 'tình huống "' + id + '" hiển thị sạch: ' + d.title + ' / ' + d.text);
      d.opts.forEach(o => {
        for (let rep = 0; rep < 4; rep++) {
          const l = clone(base); l.rs = (l.rs + rep * 7919 + ti) | 0;
          try {
            const dd = E.DEC[id].make(l, () => U.rand(l), d.data && (id === 'bi_bat' || id === 'csgt' || id === 'con_18' || id === 'con_lac_loi') ? d.data : undefined);
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
  Object.keys(E.DEC).forEach(id => ok(okIds[id], 'tình huống "' + id + '" kiểm tra được trên ít nhất một khuôn'));
  // AI chọn được cho mọi tình huống
  Object.keys(E.DEC).forEach(id => {
    const base = TPL.find(t => { try { const l = clone(t); const d = E.DEC[id].make(l, () => U.rand(l)); return d.opts.length && (!E.DEC[id].valid || E.DEC[id].valid(l, d.data)); } catch (e) { return false; } });
    if (!base) return;
    const l = clone(base); const d = E.DEC[id].make(l, () => U.rand(l)); l.pending.unshift(d);
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
  ok(d.opts.some(o => o.k === 'denied') || l.money >= E.housePrice(l), 'nợ xấu → ngân hàng từ chối cho vay mua nhà');
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
    E.beginYear(l, {}); l.pending = [];
    const acts = E.actions(l);
    ok(acts.length === E.ACT.length && acts.every(a => !badText(a.l) && !badText(a.g)), 'danh sách hành động sạch (' + acts.length + ')');
    ok(E.ACT.every(a => !!E.DEC[a.sc || a.id]), 'mọi hành động đều có tình huống tương ứng');
    const avail = acts.filter(a => a.ok === true);
    ok(avail.length >= 8, 'người 25 tuổi có nhiều việc để làm (' + avail.length + ')');
    let n = 0; for (const a of avail) { if (E.act(l, a.id)) n++; l.pending = []; if (n >= 5) break; }
    ok(n === E.ACTS_PER_YEAR, 'giới hạn ' + E.ACTS_PER_YEAR + ' lượt hành động mỗi năm (' + n + ')');
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
    if (l.death.age < 6) kinds.child++; else if (l.death.sudden) kinds.sudden++; else { kinds.ill++; ok(st.some(s => s.h === 'Di nguyện') && st.some(s => s.h === 'Hồi tưởng') && st[st.length - 1].h === 'Xuôi tay', 'chết vì bệnh có đủ hồi tưởng, di nguyện, xuôi tay #' + i); }
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
  ok(total / lives > 25 && total / lives < 90, 'nhịp lựa chọn vừa phải (' + (total / lives).toFixed(1) + '/đời)');
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
  ok(mean > 15 && mean < 23 && schol > 0 && schol < grads * 0.2, 'phân bố điểm thi hợp lý');
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
    E.H.visit(l, 'Hàn Quốc'); let first = 0, again = 0;
    for (let i = 0; i < 200; i++) { const c = clone(l); c.rs = 900 + i; const d = E.DEC.du_lich.make(c, R(i)); if (d.data.far !== 'Hàn Quốc') continue; c.pending.unshift(d); const t = texts(E.resolve(c, 'far')); if (/Lần đầu đặt chân đến Hàn Quốc/.test(t)) first++; if (/Hàn Quốc/.test(t)) again++; }
    ok(first === 0 && again > 0, 'đã từng ở Hàn Quốc thì không còn "lần đầu đặt chân đến Hàn Quốc" (' + again + ' lượt quay lại)'); }
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
    ok(!E.TRIG.find(t => t.id === 'concert').when(y, 30), 'thần tượng 75 tuổi không còn tổ chức concert');
    y.birthYear = 2000; ok(E.TRIG.find(t => t.id === 'concert').when(y, 30), 'thần tượng 35 tuổi vẫn tổ chức concert'); }

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

  // 8. xe & nhà theo mức giàu có, đầu tư kinh doanh
  { const l = mk(44000, 40, l => { l.money = l.base * 5000; l.lic.B = true; l.income = l.base; });
    const d = E.DEC.mua_xe.make(l, R(1)); ok(['car_ev', 'car_pt', 'car_lux', 'car_sport', 'car_super'].every(k => d.opts.some(o => o.k === k)), 'có xe điện, xe phổ thông, xe sang, xe thể thao, siêu xe');
    l.pending.unshift(d); E.resolve(l, 'car_pt'); ok(l.veh === 'ô tô' && l.vehTier === 1, 'mua ô tô phổ thông');
    const v0 = l.vehVal, m0 = l.money; playDec(l, 'mua_xe', 'car_super'); ok(l.vehTier === 4 && /siêu xe/.test(l.vehName) && l.money < m0 - l.base * 100, 'đổi sang siêu xe (bán lại xe cũ ' + E.fmtMoney(l, v0) + ')');
    ok(!E.DEC.mua_xe.make(l, R(2)).opts.some(o => o.k === 'car_pt'), 'đã có siêu xe thì không còn "mua xe phổ thông"');
    l.ownHouse = true; l.houseVal = E.H.housePrice(l); l.houseTier = 1;
    playDec(l, 'doi_nha', 'h4'); ok(l.houseTier === 4 && /biệt thự/.test(l.houseName), 'đổi lên biệt thự');
    playDec(l, 'doi_nha', 'h5'); ok(l.houseTier === 5 && /dinh thự/.test(l.houseName) && isFinite(E.netWorth(l)), 'đổi lên dinh thự');
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
    ok(m('tai_phiet', 3) > m('kd_tu_do', 3) * 10 && m('tai_phiet', 3) * 12 > 100000, 'chủ tịch tập đoàn gia đình kiếm hàng trăm tỷ mỗi năm (' + E.fmtMoney(l, m('tai_phiet', 3) * 12) + '/năm)');
    ok(m('ngan_hang_cao', 3) > m('ngan_hang', 3) * 10, 'chủ tịch ngân hàng ≫ giám đốc chi nhánh'); }

  // hướng đi giữa các nghề
  Object.keys(E.jobs.PATHS).forEach(id => { ok(!!E.CAR[id], 'nghề nguồn tồn tại: ' + id); E.jobs.PATHS[id].forEach(p => ok(!!E.CAR[p[0]] && p[1] < E.CAR[p[0]].t.length, 'hướng đi ' + id + ' → ' + p[0] + ' hợp lệ')); });
  { const l = mk(50100, 32, l => { E.startJob(l, 'dau_bep', R(1), () => { }); l.job.rank = 2; l.job.yrs = 5; l.money = l.base * 10; });
    const t = play(l, 'chuyen_huong', 'go'); ok(['chu_quan_an', 'chu_nha_hang'].includes(E.resolveJob(l.job.id)) && l.job.rank >= 1, 'bếp trưởng mở quán / nhà hàng riêng: ' + t);
    const p = mk(50101, 40, l => { E.startJob(l, 'cong_an', R(2), () => { }); l.job.rank = 4; l.job.yrs = 5; l.money = l.base; }); play(p, 'chuyen_huong', 'go'); ok(E.resolveJob(p.job.id) === 'tham_tu', 'công an lâu năm có thể chuyển sang làm thám tử tư'); }
  { let n = 0; for (let i = 0; i < 400; i++) { const x = run1(E.createLife({ mode: 'vn', seed: 50200 + i }), 60); if (x.log.some(e => /^Rời vị trí .*chuyển sang làm/.test(e.t))) n++; } ok(n > 15, 'nhiều người rẽ hướng sự nghiệp trong đời (' + n + '/400)'); }

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
