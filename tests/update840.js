'use strict';
// v8.4.0 — khối năng khiếu có trường nghệ thuật thật trong nguyện vọng; học bổ túc văn hóa cho người nghỉ học sớm
const assert = require('assert'), { gameContext } = require('./hardcore-isolation'), G = gameContext(), E = G.E, H = E.H;
let checks = 0;
function ok(x, m) { checks++; assert(x, m); }
function bad(t) { return typeof t !== 'string' || /undefined|NaN|null|\[object/.test(t); }
function grad(seed, khoi, talent, opts) {
  const l = E.createLife(Object.assign({ mode: 'vn', seed, year: 2026 }, opts || {}));
  l.age = 18; l.edu = 3; l.school = null; l.indep = false; l.job = null; l.pending = []; l.jailUntil = null; l.abroad = null;
  delete l.flags.military; l.khoi = khoi; l.talent = talent || null; l.skill = 60; l.examScore = 22; l.flags.nkPrep = khoi && /H00|V00|S00|N00/.test(khoi) ? 1 : 0;
  return l;
}
function choose(l, k) { ok(l.pending[0] && l.pending[0].opts.some(o => o.k === k), 'có lựa chọn ' + k + ' trong ' + (l.pending[0] && l.pending[0].id)); E.resolve(l, k); }

// 1. Khối thi năng khiếu
['H00', 'V00', 'S00', 'N00'].forEach(k => ok(E.KHOI[k] && E.KHOI[k].m.indexOf('art') >= 0, 'khối ' + k + ' hợp ngành nghệ thuật'));
{
  const l = grad(840001, null); l.age = 16; l.edu = 2; l.school = 'upper';
  const d = E.DEC.chon_khoi.make(l, H.rf(l));
  ['A00', 'A01', 'B00', 'C00', 'D01', 'H00', 'V00', 'S00', 'N00'].forEach(k => ok(d.opts.some(o => o.k === k), 'chọn khối có ' + k));
  ok(d.opts.filter(o => o.k === 'H00').length === 1, 'khối H00 không bị lặp');
  ok(d.opts.every(o => !bad(o.l) && !bad(o.h)), 'chọn khối hiển thị sạch');
  l.pending = [d]; E.resolve(l, 'S00'); ok(l.khoi === 'S00' && l.flags.nkPrep === 1, 'chọn khối năng khiếu thì có ôn năng khiếu');
}

// 2. Nguyện vọng: khối H00 thấy trường nghệ thuật, trường hợp khối đứng đầu
const EDU = E.EDUCATION54, A = E.ARTS84;
['mtvn', 'mtcn', 'hau', 'skda', 'hvan', 'hufa', 'dau', 'hcmufa', 'uah', 'skdahcm', 'nvhcm', 'spnttw'].forEach(id => ok(A.school(id) && A.school(id).nk, 'có trường nghệ thuật ' + id));
for (const [khoi, region, expectTop] of [['H00', 'Bắc', /Mỹ thuật|Kiến trúc|Sư phạm Nghệ thuật/], ['V00', 'Nam', /Kiến trúc/], ['S00', 'Bắc', /Sân khấu/], ['N00', 'Nam', /Nhạc viện/], ['A00', 'Bắc', /Bách khoa|Công nghệ|Kinh tế|Ngoại thương|Sư phạm|Luật|Khoa học|Công nghiệp/]]) {
  const l = grad(840100 + region.length, khoi);
  EDU.open(l, H.rf(l));
  ok(l.pending[0].id === 'study_wishes54', 'mở được danh sách nguyện vọng');
  ok(new RegExp(khoi).test(l.pending[0].text), 'nguyện vọng nhắc khối thi của bạn ' + khoi);
  choose(l, 'region_' + region);
  const schools = l.pending[0].opts.filter(o => o.k.indexOf('school_') === 0);
  ok(expectTop.test(schools[0].l), khoi + ': trường hợp khối lên đầu (' + schools[0].l + ')');
  ok(schools.every(o => /xét khối/.test(o.h) && !bad(o.h)), 'mỗi trường ghi khối xét tuyển');
  if (khoi !== 'A00') ok(schools.filter(o => /✓ hợp khối/.test(o.h)).length >= 1, khoi + ' có trường hợp khối ở miền ' + region);
}

// 3. Nộp hồ sơ: trường nghệ thuật thi năng khiếu; trái khối thì không được nhận
let artIn = 0, nkTried = 0, refused = 0;
for (let i = 0; i < 160; i++) {
  const l = grad(841000 + i, i % 2 ? 'H00' : 'S00', i % 4 < 2 ? (i % 2 ? 'hội họa' : 'diễn xuất') : null);
  EDU.open(l, H.rf(l));
  const s = EDU.state(l);
  s.wishes = i % 2 ? [{ school: 'mtvn', major: 'art' }, { school: 'hust', major: 'it' }] : [{ school: 'skda', major: 'art' }, { school: 'neu', major: 'eco' }];
  l.pending = [EDU54make(l)];
  const n0 = l.log.length; choose(l, 'submit');
  const lines = l.log.slice(n0).map(e => e.t);
  ok(lines.every(t => !bad(t)), 'nhật ký nộp hồ sơ sạch');
  if (lines.some(t => /Thi năng khiếu tại/.test(t))) nkTried++;
  ok(lines.some(t => /không xét khối/.test(t)) || lines.some(t => /Trúng tuyển NV1/.test(t)), 'nguyện vọng trái khối bị loại, không trúng tuyển nhầm');
  if (lines.some(t => /không xét khối/.test(t))) refused++;
  if (l.school === 'uni' && l.major === 'art') {
    artIn++;
    ok(l.flags.tSchool && l.flags.tSchool.jobs.length && /Mỹ thuật|Sân khấu/.test(l.uniName), 'đỗ trường nghệ thuật: đúng tên trường, có nghề gợi ý khi ra trường');
    ok(l.majorName && !/Nghệ thuật – Thiết kế/.test(l.majorName), 'tên ngành cụ thể: ' + l.majorName);
  }
  ok(!(l.school === 'uni' && l.major !== 'art'), 'không đỗ trường khối A/D khi thi khối năng khiếu');
}
function EDU54make(l) { return E.DEC.study_wishes54.make(l); }
console.log('   Khối năng khiếu: thi năng khiếu ' + nkTried + '/160 · đỗ trường nghệ thuật ' + artIn + ' · NV trái khối bị loại ' + refused);
ok(nkTried === 160 && artIn > 30 && artIn < 150 && refused > 10, 'thi năng khiếu có đỗ có trượt; nguyện vọng trái khối bị loại');
// có năng khiếu thật thì dễ đỗ hơn
{
  let withT = 0, without = 0;
  for (let i = 0; i < 300; i++) { const a = grad(842000 + i, 'H00', 'hội họa'), b = grad(842000 + i, 'H00', null); b.flags.nkPrep = 0; const u = A.school('mtcn'); if (A.nkScore(a, u, H.rf(a)) >= u.nkPass) withT++; if (A.nkScore(b, u, H.rf(b)) >= u.nkPass) without++; }
  ok(withT > without + 30, 'năng khiếu hội họa + ôn khối giúp thi năng khiếu tốt hơn (' + withT + ' > ' + without + ')');
}
// máy tự chọn nguyện vọng: khối năng khiếu chọn trường hợp khối
{
  let fit = 0, n = 0;
  for (let i = 0; i < 60; i++) {
    const l = grad(843000 + i, ['H00', 'V00', 'S00', 'N00'][i % 4]);
    EDU.open(l, H.rf(l)); let g = 0;
    while (l.pending[0] && l.pending[0].id === 'study_wishes54' && g++ < 40) E.resolve(l, E.autoKey(l));
    const w = EDU.state(l).wishes; n++;
    if (w.length && w.every(x => A.fits(l, A.school(x.school), x.major))) fit++;
  }
  ok(fit >= n * 0.9, 'máy tự chọn nguyện vọng hợp khối (' + fit + '/' + n + ')');
}

// 4. Học bổ túc văn hóa
{
  const l = grad(844001, null); l.age = 22; l.edu = 1; l.indep = true; l.money = l.base * 2; l.acts = 0; l.khoi = null;
  E.startJob(l, 'phu_ho', H.rf(l), () => {}, true);
  ok(E.actAvail(l, E.ACT.find(a => a.id === 'bo_tuc')) === true, 'người nghỉ học sớm, đang đi làm có thể đăng ký bổ túc');
  const d = E.act(l, 'bo_tuc'); ok(d && d.opts.some(o => o.k === 'lien') && d.opts.some(o => o.k === 'thcs') && !d.opts.some(o => o.k === 'thpt'), 'học hết tiểu học: học bổ túc THCS hoặc học liền lên THPT');
  E.resolve(l, 'lien');
  ok(l.flags.gdtx && l.job, 'vừa học bổ túc vừa giữ việc làm');
  const hook = E.GDTX84.yearHook; // gọi đích danh hàm của phần bổ túc, không phụ thuộc thứ tự nạp module
  for (let y = 0; y < 5 && l.flags.gdtx; y++) { hook(l, H.rf(l), (t, k) => l.log.push({ a: l.age, t, k }), l.age); l.age++; }
  ok(!l.flags.gdtx && (l.edu >= 3 || l.flags.hsFail), 'học xong bổ túc THPT thì có bằng (hoặc được thi lại)');
  ok(l.log.some(e => /bổ túc THCS/.test(e.t)), 'giữa chừng nhận bằng THCS');
  if (l.edu >= 3) {
    ok(l.pending.some(x => x.id === 'bo_tuc_xong'), 'xong bổ túc được chọn học tiếp hay đổi việc');
    ok(Number.isFinite(l.examScore), 'thi tốt nghiệp THPT như học sinh chính quy');
    const q = l.pending.find(x => x.id === 'bo_tuc_xong'); l.pending = [q]; E.resolve(l, 'viec');
    ok(l.flags.upgradeJob, 'đi tìm việc tốt hơn với bằng mới');
    const c = E.CAR; ok(Object.keys(c).some(id => c[id].edu === 3 && E.jobEligible(l, c[id])), 'có bằng THPT thì mở thêm nghề cần bằng phổ thông');
  }
  ok(l.log.every(e => !bad(e.t)), 'nhật ký bổ túc sạch');
}
// không cho bổ túc khi đã có bằng hoặc đang đi học
{
  const l = grad(844002, 'A00'); l.age = 25; l.indep = true;
  ok(E.actAvail(l, E.ACT.find(a => a.id === 'bo_tuc')) !== true, 'đã có bằng THPT thì không cần bổ túc');
  l.edu = 2; l.school = 'voc'; ok(E.actAvail(l, E.ACT.find(a => a.id === 'bo_tuc')) !== true, 'đang đi học thì không đăng ký bổ túc');
}
// chạy trọn nhiều cuộc đời bỏ học sớm: có người học bổ túc và lên được bậc học cao hơn
{
  let joined = 0, finished = 0, uni = 0;
  for (let i = 0; i < 120; i++) {
    const l = E.createLife({ mode: 'vn', seed: 845000 + i, year: 2026 }); let g = 0;
    while (l.alive && g++ < 70) {
      E.beginYear(l, { auto: true });
      if (l.age === 15 && l.pending.some(d => d.id === 'hs')) { const d = l.pending.find(x => x.id === 'hs'); if (d.opts.some(o => o.k === 'work')) { l.pending = [d]; E.resolve(l, 'work'); } }
      if(l.age>=20&&!l._requestedGdtx&&E.DEC.bo_tuc.valid(l)){l._requestedGdtx=true;const request=E.DEC.bo_tuc.make(l,H.rf(l));request.manual=true;E.DEC.bo_tuc.apply(l,request,l.edu===2?'thpt':'lien',H.rf(l),function(t,k){l.log.push({a:l.age,t,k});});}
      let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l));
      if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l);
      if (l.flags.gdtx && !l._j) { l._j = 1; joined++; }
    }
    if (l.log.some(e => /bổ túc THPT sau/.test(e.t))) finished++;
    if (l.log.some(e => /bổ túc/.test(e.t)) && l.edu >= 5) uni++;
    ok(l.log.every(e => !bad(e.t)), 'nhật ký sạch #' + i);
  }
  console.log('   Bổ túc: đăng ký ' + joined + ' · tốt nghiệp THPT hệ bổ túc ' + finished + ' · sau đó có bằng đại học ' + uni);
  ok(joined > 5 && finished > 2, 'người nghỉ học sớm có thể học bổ túc và tốt nghiệp');
}
console.log('PASS: ' + checks + ' kiểm tra · khối năng khiếu, trường nghệ thuật, thi năng khiếu, học bổ túc văn hóa.');
