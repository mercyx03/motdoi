'use strict';
// 9.9.1: nghề đường phố theo nước/thời kỳ, thôi nôi theo hoàn cảnh nhà, gỡ chú thích thừa khi chơi.
const assert = require('assert'), G = require('./hardcore-isolation').gameContext(), E = G.E, H = E.H; let n = 0; function ok(v, m) { assert(v, m); n++; }
const S = E.STREET991, C = E.CAR;
function life(cc, y, o) { return Object.assign(E.createLife(Object.assign({ seed: 7 }, o || {})), {}); }
// 1. nghề tồn tại, có tên và cửa sổ năm
ok(S.JOBS.length >= 10, 'có ít nhất 10 nghề đường phố');
S.JOBS.forEach(id => { ok(C[id] && C[id].t.length && C[id].street991, id + ' đủ dữ liệu'); ok(C[id].cat === 'poor' && C[id].edu === 0 && !C[id].hidden, id + ' là nghề cho người nghèo, không đòi bằng cấp'); });
// 2. gating theo nước và năm (dùng bản sao nhân vật đơn giản qua resCode)
const mk = (cc, birth, age) => ({ birthYear: birth, age, country: cc, flags: {}, abroad: null });
const stub = cc => { const o = H.resCode; return o; };
const orig = H.resCode; let cur = 'VN'; H.resCode = () => cur;
const at = (cc, y, id) => { cur = cc; return S.ok(mk(cc, y - 15, 15), C[id]); };
ok(at('VN', 1990, 'danh_giay') && at('VN', 1990, 'xich_lo') && !at('VN', 2015, 'xich_lo'), 'xích lô ở VN đến 2005');
ok(!at('VN', 1990, 'taxi_mo_to') && at('NG', 2010, 'taxi_mo_to') && !at('NG', 1970, 'taxi_mo_to'), 'okada chỉ có ở châu Phi từ 1990');
ok(!at('JP', 2000, 'danh_giay') && !at('US', 2000, 'ban_nga_tu') && at('MX', 2000, 'ban_nga_tu'), 'không có nghề lạc nước');
ok(at('ID', 2000, 'xich_lo') && at('CN', 1930, 'xich_lo') && !at('CN', 1990, 'xich_lo'), 'becak ở Indonesia, xe kéo ở Trung Quốc xưa');
ok(!at('VN', 1930, 'rua_xe') && at('VN', 2000, 'rua_xe'), 'rửa xe thuê chỉ khi xe cộ phổ biến');
H.resCode = orig;
// 3. jobBlocked chặn nghề sai nước/năm
{ cur = 'US'; H.resCode = () => cur; ok(E.ERA902.jobBlocked(mk('US', 1990, 20), 'danh_giay', C.danh_giay) === true, 'jobBlocked chặn nghề lạc nước'); cur = 'VN'; ok(E.ERA902.jobBlocked(mk('VN', 1990, 20), 'danh_giay', C.danh_giay) === false, 'jobBlocked cho phép đúng nước'); H.resCode = orig; }
// 4. thôi nôi: nhà nghèo (q=1) không có, kể cả ở nước giàu; nhà bình thường thì có; thời loạn không có
{ const C945 = E.CTX945; const q = (cc, y, qv) => { const l = E.createLife({ seed: 61, country: cc, year: y }); l.fam.q = qv; return C945.customAllowed(l, 'thoi_noi'); };
  ok(!q('US', 2005, 1) && !q('VN', 2005, 1), 'nhà nghèo túng không bày mâm bốc đồ');
  ok(q('VN', 2005, 3) && q('US', 2005, 2), 'nhà bình thường trở lên có lễ');
  ok(!q('VN', 1968, 3), 'thời chiến không có lễ'); }
// 5. gỡ chú thích thừa
const c = E.CLEAN991.clean;
ok(c('Dự án thần tượng (mô phỏng) mở đơn.') === 'Dự án thần tượng mở đơn.', 'bỏ (mô phỏng)');
ok(c('Họ mời bạn. (Nhân vật trong game.)') === 'Họ mời bạn.', 'bỏ chú thích nhân vật');
ok(c('Tổ chức và tình huống đều hư cấu. Hết.') === 'Hết.', 'bỏ câu hư cấu');
ok(c('Hạng đấu trong game: hạng 2') === 'Hạng đấu trong game: hạng 2', 'không đụng nhãn cơ chế');
ok(c('Một câu bình thường.') === 'Một câu bình thường.', 'câu thường giữ nguyên');
ok(E.lifeNarrative('Tên (hư cấu) xuất hiện') === 'Tên xuất hiện', 'bộ lọc hiển thị');
// 6. toàn bộ vòng đời vẫn chạy với nhiều nước
['VN', 'NG', 'ID', 'MX', 'IN', 'BR', 'EG', 'US'].forEach(cc => { for (let s = 1; s <= 3; s++) { const l = E.createLife({ seed: s * 13, country: cc }); ok(l && l.fam, cc + ' tạo đời được'); } });
console.log('street991 OK', n);
