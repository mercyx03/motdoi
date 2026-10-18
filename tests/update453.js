'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, file] of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g)) if (!['js/app.js', 'js/music.js', 'js/card.js'].includes(file)) vm.runInThisContext(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file });
const { E, U } = globalThis.G; let checks = 0;
function ok(x, text) { assert.ok(x, text); checks++; }
function rng(seed) { const h = { rs: seed }; return () => U.rand(h); }
function life(age = 18, sex = 'M', seed = 85301) { const l = E.createLife({ mode: 'vn', seed, gender: sex }); l.age = age; l.indep = age >= 18; l.pending = []; l.school = null; l.edu = 5; l.workYrs = 0; l.jobsHist = []; l.job = null; l.money = 500; l.partner = null; return l; }
function run(l, id, k, random) { const d = E.DEC[id].make(l, rng(5)); const logs = []; E.DEC[id].apply(l, d, k, random || rng(6), (t, k) => logs.push({ t, k })); return logs; }
ok(G.VERSION === require('../package.json').version && !html.includes('?v=4.5.3'), 'đổi cache toàn bộ bản mới');
{
  const l = life(17); ok(!E.jobEligible(l, E.CAR.bartender), 'dưới 18 không được mời bartender');
  ok(E.startJob(l, 'bartender', rng(1), () => {}) === false && !l.job, 'chặn cả đường nhận việc trực tiếp');
}
for (let i = 0; i < 60; i++) {
  const l = life(18, 'M', 85310 + i); E.startJob(l, 'bartender', rng(i), () => {});
  ok(l.job.rank === 0 && E.jobTitle(l) === 'bartender', 'người mới bắt đầu ở bartender #' + i);
  l.job.yrs = 99; run(l, 'tang_luong', 'ask', () => 0);
  ok(l.job.rank === 0, 'điểm kinh nghiệm không cho thăng trưởng ngay năm đầu #' + i);
  const cash = l.money; run(l, 'tang_luong', 'ask', () => 0); ok(l.money === cash && l.job.rank === 0, 'không lặp xin lương để lấy tiền / thăng chức #' + i);
  l.age = 21; l.job.yrs = 3; run(l, 'tang_luong', 'ask', () => 0);
  ok(l.job.rank === 1 && /bartender trưởng/.test(E.jobTitle(l)), 'đủ năm công tác mới xét trưởng #' + i);
}
{
  const l = life(25); E.startJob(l, 'dev', rng(1), () => {}); ok(l.job.rank === 0, '25 tuổi nhưng mới vào nghề vẫn bắt đầu ở bậc đầu');
  const exp = life(40); exp.workYrs = 20; E.startJob(exp, 'dev', rng(1), () => {}); ok(exp.job.rank >= 1, 'người có kinh nghiệm không bị bắt làm thực tập lại một cách máy móc');
  const bar = life(28); bar.jobsHist = [{ id: 'bartender', from: 18 }, { id: 'cong_nhan', from: 22 }]; bar.workYrs = 10;
  E.startJob(bar, 'bartender', rng(1), () => {}); ok(bar.job.rank === 1, 'có bốn năm làm bartender thật thì có thể ứng tuyển vị trí trưởng');
  const other = life(28); other.workYrs = 10; E.startJob(other, 'bartender', rng(1), () => {}); ok(other.job.rank === 0, 'kinh nghiệm nghề khác không tự biến thành bartender trưởng');
  const young = life(18); E.startJob(young, 'bartender', rng(1), () => {}); run(young, 'cn_cuu_sep', 'so_cuu', () => 0); ok(young.job.rank === 0, 'sự kiện cứu sếp không nhảy bậc trưởng ngay khi vào làm');
  for (let i = 0; i < 25; i++) { const x = life(18, 'M', 85400 + i); E.startJob(x, 'bartender', rng(i), () => {}); E.careerYear(x, rng(i + 900), () => {}, 'work'); ok(x.job && x.job.rank === 0, 'năm sự nghiệp đầu không tự thăng bartender trưởng'); }
}
{
  const l = life(0); l.fam.q = 4; l.fam.vice = null; l.fam.noDad = false; l.fam.mAlive = l.fam.fAlive = true; l.fam.elite = null;
  ok(!E.birthContext(l).severe && E.birthContext(l).label === 'Bối cảnh gia đình', 'bình thường không ghi biến cố');
  l.fam.noDad = true; ok(!E.birthContext(l).severe, 'gia đình mẹ đơn thân không tự suy diễn thành bi kịch');
  l.fam.noDad = false; l.fam.vice = 'drugs'; ok(E.birthContext(l).severe && E.birthContext(l).label === 'Bối cảnh gia đình' && /ma túy/.test(E.birthContext(l).text), 'nghiện ma túy trong gia đình được nhận diện là tình huống nặng');
  const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8'); ok(app.includes('E.birthContext(l).label'), 'giao diện dùng nhãn theo hoàn cảnh, không cứng dòng Biến cố');
}
const sponsorHook = E.sponsorYear;
for (const sx of ['M', 'F']) for (const orient of ['straight', 'gay', 'bi']) {
  const l = life(22, sx); l.orient = orient; const d = E.DEC.sn_loi_moi.make(l, rng(20));
  ok(d.data.p.age >= l.age + 10 && d.data.p.age >= 18 && d.data.monthly <= d.data.p.inc * 0.2, 'người chu cấp lớn tuổi, đủ khả năng chi');
  ok(orient !== 'straight' || d.data.p.sex !== sx, 'đề nghị phù hợp xu hướng dị tính');
  ok(orient !== 'gay' || d.data.p.sex === sx, 'đề nghị phù hợp xu hướng đồng tính');
  const cash = l.money, karma = l.karma; E.DEC.sn_loi_moi.apply(l, d, 'decline', rng(1), () => {});
  ok(l.money === cash && l.karma === karma && !l.partner, 'từ chối không bị ép quan hệ / mất tiền / nhân cách');
  E.DEC.sn_loi_moi.apply(l, d, 'accept', rng(1), () => {});
  ok(E.sponsorActive(l) && l.money === cash && l.pending.some(d => d.id === 'sn_kiem_soat'), 'đồng ý rõ ràng, chưa được tiền ngay, có sự kiện kiểm soát');
  const control = l.flags.sponsor.control; run(l, 'sn_kiem_soat', 'comply'); ok(l.flags.sponsor.control > control, 'nhượng bộ làm tăng kiểm soát');
  sponsorHook(l, rng(3), () => {}, l.age); const paid = l.money;
  ok(Math.abs(paid - cash - l.flags.sponsor.monthly * 12) < 0.001, 'chi đúng khoản chu cấp thực nhận trong năm');
  sponsorHook(l, rng(3), () => {}, l.age); ok(l.money === paid, 'không trả trợ cấp hai lần cùng năm');
  run(l, 'sn_quan_he', 'stop'); l.age++; sponsorHook(l, rng(3), () => {}, l.age);
  ok(!E.sponsorActive(l) && l.money === paid && !!l.partner, 'dừng nhận tiền vẫn giữ tài sản và có thể giữ quan hệ tự nguyện');
}
{
  const young = life(17); ok(!E.DEC.sn_loi_moi.valid(young, {}), 'không có đề nghị bao nuôi với người dưới 18');
  const married = life(22); married.partner = { name: 'An', status: 'married', age: 50, inc: 500, alive: true }; ok(!E.DEC.sn_loi_moi.valid(married, {}), 'không tự chèn mối quan hệ mới khi đã có gia đình');
  const l = life(22); run(l, 'sn_loi_moi', 'accept'); const stale = E.DEC.sn_kiem_soat.make(l, rng(1));
  run(l, 'sn_nghi_viec', 'keep', () => 0.99); sponsorHook(l, rng(1), () => {}, l.age); ok(l.money === 500, 'cắt chu cấp thì không ghi nhận khoản tiền đã hứa');
  l.age++; l.jailUntil = l.age + 2; sponsorHook(l, rng(1), () => {}, l.age); ok(l.money === 500 && !E.sponsorActive(l), 'không tiếp tục chu cấp / hẹn hò ngoài trại khi ở tù');
  l.jailUntil = null; run(l, 'sn_quan_he', 'leave'); const oldMoney = l.money;
  E.DEC.sn_kiem_soat.apply(l, stale, 'comply', rng(1), () => {}); ok(l.partner === null && l.money === oldMoney, 'sự kiện cũ không tiếp tục kiểm soát sau chia tay');
}
{
  const l = life(22); run(l, 'sn_loi_moi', 'accept'); l.pending = []; l.partner.status = 'married'; l.flags.sponsor.withheldUntil = l.age;
  E.finishYear(l); ok(l.fin.partner === 0, 'bị cắt chu cấp sau cưới không vẫn tự cộng phần đóng góp của cùng người ấy');
  const p = life(22); p.partner = { name: 'An', age: 114, sex: 'F', job: 'đã nghỉ hưu', inc: 50, status: 'dating', since: p.age, alive: true };
  E.finishYear(p); ok(!p.partner && p.flags.lateDating === 'An' && p.widowed === 0, 'người đang hẹn hò cũng có tuổi thọ, không tự tính thành góa');
}
{
  ok(E.art.style === '2d', 'dùng bộ minh họa vector 2D');
  ok(E.art.theme === 'anime' && /anime-eye/.test(E.art.avatar(life(20))), 'chân dung dùng mắt nhiều lớp và phong cách anime');
  for (const sx of ['M', 'F']) for (const age of [0, 8, 16, 28, 65, 82]) {
    const l = life(age, sx), av = E.art.avatar(l), sc = E.art.scene(l);
    ok(/geometricPrecision/.test(av) && !/crispEdges|class="px/.test(av + sc), 'đường nét 2D, không pixel: ' + sx + age);
    ok(!/NaN|undefined|<script/.test(av + sc), 'SVG hợp lệ: ' + sx + age);
    for (let i = 0; i < 10; i++) U.rand(l);
    ok(E.art.avatar(l) === av && E.art.scene(l) === sc, 'ngoại hình không thay ngẫu nhiên theo hành động: ' + sx + age);
  }
  const alone = life(12); alone.indep = false; alone.fam.mAlive = alone.fam.fAlive = false; alone.fam.sibs = 5; alone.sibList = []; alone.partner = null; alone.kids = [];
  ok(E.art.companions(alone).length === 1 && /một mình/.test(E.art.caption(alone)), 'không vẽ bố mẹ / anh chị em đã mất hoặc không tồn tại');
  alone.age = 30; alone.jailUntil = 32; alone.kids = [{ born: 24, alive: true, sex: 'F' }];
  ok(E.art.companions(alone).length === 1 && /Trại giam/.test(E.art.caption(alone)), 'trong trại giam không vẽ con cháu đứng chung');
  alone.jailUntil = null; alone.indep = true; alone.ownHouse = true; alone.houseName = 'căn hộ chung cư cao cấp';
  ok(E.art.houseKind(alone) === 'cc', 'hình nhà đúng căn hộ đã sở hữu, không tự biến thành biệt thự theo gia cảnh');
  const family = life(8); family.indep = false; family.fam.noDad = false; family.fam.mAlive = family.fam.fAlive = true;
  const mother = E.art.companions(family).find(p => p.color === '#aa7778'); family.fam.fAlive = false;
  const later = E.art.companions(family).find(p => p.color === '#aa7778');
  ok(mother.skin === later.skin && mother.hair === later.hair, 'ngoại hình mẹ không đổi chỉ vì bố không còn trong khung cảnh');
}
console.log('PASS: ' + checks + ' kiểm tra bản 4.5.3.');
if (process.argv[2] === '--preview') {
  const sharp = require(process.argv[3]), out = process.argv[4] || path.join(__dirname, 'artifacts', 'art-2d-preview.png');
  const rows = ['<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="790" viewBox="0 0 1000 790"><rect width="1000" height="790" fill="#10212f"/>'];
  [0, 8, 16, 28, 65, 82].forEach((age, i) => { const l = life(age, i % 2 ? 'F' : 'M'); if (age >= 6 && age < 18) l.school = 'lower'; rows.push(E.art.avatar(l).replace('<svg ', '<svg x="' + (20 + i * 161) + '" y="35" width="145" height="145" ')); rows.push('<text x="' + (20 + i * 161) + '" y="22" font-family="sans-serif" font-size="14" fill="#e7ddc8">' + age + ' tuoi</text>'); });
  for (let i = 0; i < 4; i++) {
    const l = life(i === 0 ? 0 : 30, 'M', 85300 + i); l.urban = i === 1; l.coast = i === 0; l.indep = i !== 0; l.st.hap = i === 1 ? 70 : 50; l.fam.q = 3;
    if (i === 1) { l.ownHouse = true; l.houseName = 'căn hộ chung cư'; }
    if (i === 2) { l.partner = { age: 30, sex: 'F', status: 'married', alive: true }; l.kids = [{ born: 25, alive: true, sex: 'M' }]; }
    if (i === 3) l.jailUntil = 33;
    rows.push(E.art.scene(l).replace('<svg ', '<svg x="' + (10 + i % 2 * 495) + '" y="' + (210 + Math.floor(i / 2) * 255) + '" width="480" height="192" '));
    rows.push('<text x="' + (10 + i % 2 * 495) + '" y="' + (423 + Math.floor(i / 2) * 255) + '" font-family="sans-serif" font-size="14" fill="#e7ddc8">' + ['Ven bien / so sinh', 'Can ho thanh pho', 'Gia dinh / nha mai ngoi', 'Trong trai giam'][i] + '</text>');
  }
  rows.push('</svg>'); fs.mkdirSync(path.dirname(out), { recursive: true });
  sharp(Buffer.from(rows.join(''))).png().toFile(out).then(() => console.log('Preview: ' + out)).catch(e => { console.error(e); process.exitCode = 1; });
}
