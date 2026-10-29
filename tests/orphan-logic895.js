'use strict';
const assert = require('assert');

const { gameContext } = require('./hardcore-isolation');
const G = gameContext();
const E = G.E, H = E.H;

console.log('--- KIEM THU TINH LOGIC CHO NHAN VAT MO COI O MAI AM ---');

function createOrphanLife(kind = 'mai_am') {
  const l = E.createLife({ mode: 'vn', seed: 20261029, year: 2026 });
  l.age = 1;
  l.fam = l.fam || {};
  l.fam.orphan = {
    kind: kind,
    carer: kind === 'mai_am' ? 'các cô ở mái ấm' : kind === 'chua' ? 'sư cô' : 'ông bà',
    one: kind === 'mai_am' ? 'cô bảo mẫu' : kind === 'chua' ? 'sư cô' : 'bà',
    unknown: true
  };
  l.fam.mAlive = false;
  l.fam.fAlive = false;
  l.fam.noDad = true;
  l.fam.home = kind === 'mai_am' ? 'mái ấm' : kind === 'chua' ? 'nhà chùa' : 'nhà';
  return l;
}

// 1. Kiem tra Le thoi noi (1 tuoi)
{
  const l = createOrphanLife('mai_am');
  const d = E.DEC.thoi_noi.make(l, () => 0.5);
  console.log('1. Thoi noi text:', d.text);
  assert(d.text.includes('mái ấm') || d.text.includes('bảo mẫu'), 'Text thoi noi phai phu hop boi canh mai am');
  assert(!d.text.includes('nhờ người thân cho mượn'), 'Khong duoc noi nho nguoi than cho muon');

  const borrowOpt = d.opts.find(o => o.l.includes('mái ấm') || o.l.includes('đồ chơi'));
  console.log('   Thoi noi option muon do choi:', borrowOpt ? borrowOpt.l : 'N/A');
  assert(borrowOpt, 'Phai co option muon do choi tai mai am');
  assert(!borrowOpt.l.includes('người thân'), 'Option thoi noi khong duoc ghi muon cua nguoi than');

  let logged = '';
  E.DEC.thoi_noi.apply(l, d, 'borrow', () => 0.5, (msg) => { logged = msg; });
  console.log('   Thoi noi log:', logged);
  assert(!logged.includes('Gia đình lưu lại'), 'Log thoi noi khong duoc quy ve gia dinh');
  console.log('✓ 1. Le thoi noi cho tre mo coi o mai am hoan toan logic!');
}

// 2. Kiem tra Sinh nhat 5 tuoi
{
  const l = createOrphanLife('mai_am');
  l.age = 5;
  const d = E.DEC.sinh_nhat.make(l, () => 0.5);
  console.log('2. Sinh nhat 5 tuoi text:', d.text);
  assert(d.text.includes('mái ấm') && (d.text.includes('bảo mẫu') || d.text.includes('cùng phòng')), 'Text sinh nhat phai phan anh mai am');
  assert(!d.text.includes('Gia đình cân nhắc một buổi sum họp'), 'Khong duoc noi gia dinh sum hop');

  const simpleOpt = d.opts.find(o => o.l.includes('mái ấm'));
  console.log('   Sinh nhat option simple:', simpleOpt ? simpleOpt.l : 'N/A');
  assert(simpleOpt, 'Phai co option sinh nhat o mai am');
  assert(!simpleOpt.l.includes('cả nhà'), 'Option khong duoc ghi ca nha');

  let logged = '';
  E.DEC.sinh_nhat.apply(l, d, 'simple', () => 0.5, (msg) => { logged = msg; });
  console.log('   Sinh nhat log:', logged);
  assert(logged.includes('bảo mẫu') || logged.includes('mái ấm'), 'Log sinh nhat phai phan anh mai am');
  assert(!logged.includes('Mẹ') && !logged.includes('Bố'), 'Log khong duoc co me hay bo');
  console.log('✓ 2. Sinh nhat 5 tuoi cho tre mo coi o mai am hoan toan logic!');
}

// 3. Kiem tra Su kien Em ho / Em nho moi vao mai am
{
  const l = createOrphanLife('mai_am');
  l.age = 6;
  const d = E.DEC.k6_em_ho.make(l, () => 0.5);
  console.log('3. k6_em_ho title:', d.title);
  console.log('   k6_em_ho text:', d.text);
  assert(d.title.includes('mái ấm'), 'Title phai la em nho moi vao mai am');
  assert(d.text.includes('Mái ấm đón một em nhỏ mới vào'), 'Text phai la em nho moi vao mai am');
  assert(!d.text.includes('Em họ'), 'Text khong duoc ghi em ho');

  const nhuongOpt = d.opts.find(o => o.k === 'nhuong');
  assert(nhuongOpt, 'Phai co option nhuong');
  console.log('   k6_em_ho option nhuong:', nhuongOpt.l);
  assert(nhuongOpt.l.includes('nhường đồ chơi') || nhuongOpt.l.includes('dắt em') || nhuongOpt.l.includes('Dỗ dành'), 'Option nhuong phai phu hop');

  let logged = '';
  E.DEC.k6_em_ho.apply(l, d, 'nhuong', () => 0.5, (msg) => { logged = msg; });
  console.log('   k6_em_ho log:', logged);
  assert(!logged.includes('Em họ'), 'Log khong duoc ghi em ho');
  assert(logged.includes('mái ấm') || logged.includes('Bé nhỏ quấn bạn'), 'Log phai the hien tinh cam mai am');
  console.log('✓ 3. Su kien tre nho o mai am (thay cho em ho) hoan toan logic!');
}

// 4. Kiem tra tre mo coi o chua
{
  const l = createOrphanLife('chua');
  l.age = 6;
  const d = E.DEC.k6_em_ho.make(l, () => 0.5);
  console.log('4. Chua k6_em_ho title:', d.title);
  assert(d.title.includes('chùa') || d.title.includes('chú tiểu'), 'Title phai la chu tieu o chua');
  assert(!d.text.includes('Em họ'), 'Text khong duoc ghi em ho');
  const d5 = E.DEC.sinh_nhat.make(l, () => 0.5);
  console.log('   Chua sinh nhat text:', d5.text);
  assert(d5.text.includes('chùa') || d5.text.includes('Sư cô'), 'Text sinh nhat o chua phai phu hop');
  console.log('✓ 4. Tre mo coi o chua hoan toan logic!');
}

console.log('=== TAT CA 3 MUC PHAN ANH DEU DA DAT KIEM THU LOGIC 100% ===');
