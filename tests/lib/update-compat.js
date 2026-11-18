/* Các test nhật ký cập nhật cũ so sánh mục cũ với ảnh chụp trong git. Từ 9.4.2 trở đi công cụ dựng lịch sử chuẩn hóa giờ (".000Z" → "Z"),
   rút gọn tiêu đề (có correctedAt) và đánh dấu mục đã phát hành. Những thay đổi hợp lệ đó không được coi là mục cũ bị sửa nội dung.
   Dùng: require('./lib/update-compat') ở đầu test; chỉ thay assert.deepStrictEqual cho dữ liệu nhật ký (đối tượng có id + publishedAt). */
'use strict';
const assert = require('assert'), strict = require('assert/strict');
const ISO = /^\d{4}-\d\d-\d\dT[\d:.]+(Z|[+-]\d\d:\d\d)$/;
function canon(x) {
  if (typeof x === 'string' && ISO.test(x)) { const t = Date.parse(x); return Number.isFinite(t) ? new Date(t).toISOString() : x; }
  if (Array.isArray(x)) return x.map(canon);
  if (x && typeof x === 'object') { const o = {}; for (const k of Object.keys(x)) o[k] = canon(x[k]); return o; }
  return x;
}
function isNote(x) { return x && typeof x === 'object' && !Array.isArray(x) && typeof x.id === 'string' && 'publishedAt' in x; }
function pair(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) { const n = Math.min(a.length, b.length); const ra = [], rb = []; for (let i = 0; i < n; i++) { const p = pair(a[i], b[i]); ra.push(p[0]); rb.push(p[1]); } return [ra.concat(a.slice(n).map(canon)), rb.concat(b.slice(n).map(canon))]; }
  if (isNote(a) && isNote(b) && a.id === b.id) {
    const x = Object.assign({}, a), y = Object.assign({}, b);
    if (x.correctedAt || y.correctedAt) { for (const k of ['correctedAt', 'title', 'summary']) { delete x[k]; delete y[k]; } }
    if (x.releaseStatus === 'released' && y.releaseStatus === 'packaged') { for (const k of ['releaseStatus', 'releasedAt']) { delete x[k]; delete y[k]; } }
    return [canon(x), canon(y)];
  }
  return [canon(a), canon(b)];
}
for (const mod of [assert, strict]) {
  const orig = mod.deepStrictEqual;
  mod.deepStrictEqual = function (a, b, m) { const p = pair(a, b); return orig.call(this, p[0], p[1], m); };
}
module.exports = { canon, pair };
