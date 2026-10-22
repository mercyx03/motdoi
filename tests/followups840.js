'use strict';
// Các tình huống nối tiếp ở life101.js chỉ xuất hiện sau một tình huống trước đó (cần bối cảnh riêng),
// nên mục 9 của regression.js không mở được trên khuôn nhân vật chung. Kiểm tra riêng ở đây với đúng bối cảnh.
const assert = require('assert'), { gameContext } = require('./hardcore-isolation'), G = gameContext(), E = G.E, H = E.H;
let checks = 0;
function ok(x, m) { checks++; assert(x, m); }
function bad(t) { return typeof t !== 'string' || /undefined|NaN|null|\[object/.test(t); }
function adult(seed) { const l = E.createLife({ mode: 'vn', seed, year: 2000 }); l.age = 28; l.indep = true; l.partner = null; l.pending = []; l.jailUntil = null; l.abroad = null; delete l.flags.military; return l; }
function run(l, id, arg, k) {
  const d = E.DEC[id].make(l, H.rf(l), arg);
  ok(E.DEC[id].valid(l, d.data), id + ': hợp lệ khi đủ bối cảnh');
  ok(!bad(d.title) && !bad(d.text) && d.opts.length && d.opts.every(o => !bad(o.l)), id + ': hiển thị sạch');
  ok(d.opts.some(o => o.k === k), id + ': có lựa chọn ' + k);
  l.pending = [d]; const n0 = l.log.length; E.resolve(l, k);
  ok(l.log.slice(n0).every(e => !bad(e.t)), id + '/' + k + ': nhật ký sạch');
  return d;
}
for (let s = 0; s < 40; s++) {
  // 1. tin nhắn sau khoảng im lặng (sau "mập mờ")
  for (const k of ['talk', 'close']) {
    const l = adult(8401000 + s), d = { n: 'Phạm Minh Khoa', sex: 'M', age: 29 };
    l.flags.mapMo = d.n; l.flags.ambiguous101 = d;
    ok(!E.DEC.map_mo_tiep101.valid(adult(1), d), 'map_mo_tiep101: không có bối cảnh thì không hiện');
    run(l, 'map_mo_tiep101', d, k);
    ok(!l.flags.mapMo && !l.flags.ambiguous101, 'map_mo_tiep101/' + k + ': đóng lại chuyện cũ');
    if (l.partner) ok(l.partner.name === d.n && l.partner.status === 'dating', 'map_mo_tiep101: hẹn hò đúng người cũ');
  }
  // 2. mong đợi khác nhau (sau một cuộc gặp không ràng buộc)
  for (const k of ['talk', 'end']) {
    const l = adult(8402000 + s), d = { n: 'Nguyễn Thu Trang', sex: 'F', age: 27, at: 27 };
    l.flags.casual101 = d;
    ok(!E.DEC.casual_after101.valid(l, Object.assign({}, d, { at: 20 })), 'casual_after101: không dùng nhầm sự kiện cũ');
    run(l, 'casual_after101', d, k);
    ok(!l.flags.casual101, 'casual_after101/' + k + ': khép lại thỏa thuận');
    if (l.partner) ok(l.partner.name === d.n, 'casual_after101: hẹn hò đúng người');
  }
  // 3. đề xuất bổ nhiệm cấp chiến lược (hàm tướng, đã học nâng cao, từ 50 tuổi)
  for (const k of ['yes', 'no']) {
    const l = adult(8403000 + s); l.age = 52; l.job = { id: s % 2 ? 'cong_an' : 'quan_doi', rank: 8, yrs: 3 }; l.flags.topAcad = 1;
    run(l, 'bo_nhiem_chien_luoc', undefined, k);
    if (k === 'yes') ok(l.flags.strategicPost === l.job.id, 'nhận nhiệm vụ cấp chiến lược'); else ok(!l.flags.strategicPost, 'từ chối thì không nhận chức');
    ok(!E.DEC.bo_nhiem_chien_luoc.valid(Object.assign(adult(1), { age: 45 })), 'chưa đủ điều kiện thì không có đề xuất');
  }
}
console.log('PASS: ' + checks + ' kiểm tra tình huống nối tiếp (map_mo_tiep101, casual_after101, bo_nhiem_chien_luoc).');
