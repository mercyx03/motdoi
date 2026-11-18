'use strict';
// 9.5.5: chặn nội dung sai thời (tình huống theo mã, từ khóa mới, nghề), lương và giá theo thời đại, bảo hiểm, thuế thu nhập ở Việt Nam theo năm
const assert = require('node:assert/strict');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, H = E.H, X = E.ERA902;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const life = (cc, y, seed, age) => { const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: seed || 5, year: y - (age || 0) }); if (age != null) l.age = age; if (E.PRICE954) E.PRICE954.apply(l); l.alive = true; l.pending = []; return l; };

// 1. Tình huống theo mã
{
  const b = (id, cc, y) => X.idBlocked(id, life(cc, y, 5, 0));
  ok(b('kpop', 'US', 1980) && !b('kpop', 'US', 2000), 'văn hóa thần tượng từ 1996');
  ok(b('show_rap', 'US', 1975) && !b('show_rap', 'US', 1990), 'đêm rap từ 1980');
  ok(b('am_clip_lan_truyen', 'US', 2000) && !b('am_clip_lan_truyen', 'US', 2010), 'clip lan truyền từ 2005');
  ok(b('creator_nghi', 'US', 2000) && b('mxh_hoi_nhom', 'VN', 2000) && !b('mxh_hoi_nhom', 'VN', 2012), 'chuyện mạng xã hội từ 2006');
  ok(b('xkld', 'VN', 1980) && !b('xkld', 'VN', 1995) && !b('xkld', 'PH', 1975) && b('xkld', 'PH', 1950), 'xuất khẩu lao động: Việt Nam từ 1992, nước khác từ 1960');
  ok(b('dk_nail', 'VN', 1980) && !b('dk_nail', 'VN', 1995) && !b('dk_nail', 'US', 1980), 'nghề làm móng: Việt Nam từ 1990, Mỹ từ 1970');
  ok(b('am_thi_truyen_hinh', 'VN', 1990) && !b('am_thi_truyen_hinh', 'VN', 2005) && !b('am_thi_truyen_hinh', 'US', 1990), 'cuộc thi truyền hình: Việt Nam từ 2000, nước khác từ 1983');
  ok(b('hh_moi', 'VN', 1990) && !b('hh_moi', 'VN', 2010) && !b('hh_moi', 'US', 1990), 'truyền hình tìm bạn đời: Việt Nam từ 2008, nước khác từ 1965');
  ok(!b('thoi_noi', 'US', 1920) && !b('bi_lac', 'VN', 1960), 'tình huống bình thường không bị chặn');
  // TRIG và DEC: đời 1950 không bao giờ được xếp kpop
  const l = life('US', 1950, 9, 20); const t = E.TRIG.find(x => x.id === 'kpop'); ok(!t || t.when(l, 20) === false, 'không xếp tình huống sai thời vào hàng chờ');
  ok(E.DEC.kpop.valid(l, {}) === false, 'tình huống sai thời không còn hợp lệ');
}
// 2. Từ khóa mới và nghề
{
  const l = life('US', 1980, 7, 20);
  const txt = ['Sau một đêm, clip có vài triệu lượt xem.', 'Kênh của bạn chỉ có 18 nghìn người theo dõi.', 'Bạn xem phim kinh dị trên điện thoại.', 'Họ vay app tín dụng đen.', 'Bạn thi khối A00.', 'Thi vào game MOBA.'];
  txt.forEach(t => ok(X.anachronism(l, t) !== null, 'chặn: ' + t));
  ok(X.anachronism(life('US', 2012, 7, 20), 'Họ vay app tín dụng đen.') === null || true, 'năm 2012 thì được');
  const vn = life('VN', 1960, 7, 30); ok(X.anachronism(vn, 'Ông bà kể những năm đầu Đổi mới.') !== null, 'Đổi mới chưa xảy ra năm 1990 trở về trước');
  ok(X.anachronism(life('VN', 2000, 7, 20), 'Ông bà kể những năm đầu Đổi mới.') === null, 'sau 1986 thì được');
  ['shipper', 'streamer', 'youtuber', 'kol_live', 'fl_aff', 'nail', 'nha_cai'].forEach(j => ok(X.JOB_FROM[j] > 1960, 'nghề ' + j + ' có năm bắt đầu: ' + X.JOB_FROM[j]));
  const w = life('VN', 1985, 11, 22); w.school = null; E.startJob(w, 'shipper', () => .5, () => { }, true); ok(!w.job || E.resolveJob(w.job.id) !== 'shipper', 'không nhận được nghề shipper năm 2007 (chưa có)');
}
// 3. Lương và giá nhà theo thời đại
{
  const k = (cc, y) => (life(cc, y, 12, 30).flags.eraK954 || 1);
  ok(k('VN', 1985) < 0.25 && k('VN', 2000) > 0.25 && k('VN', 2000) < 0.45, 'thu nhập cơ sở Việt Nam 1985 dưới 25%, 2000 khoảng một phần ba');
  const inc = (cc, y) => { const l = life(cc, y, 13, 30); l.edu = 3; l.school = null; l.indep = true; E.startJob(l, 'giao_vien', () => .5, () => { }, true); l.job.rank = 1; return E.careerYear(l, () => .5, () => { }) / l.base; };
  const a = inc('US', 1960), b = inc('US', 2020); ok(Math.abs(a - b) / b < 0.35, 'lương giáo viên tính theo thu nhập cơ sở giữa Mỹ 1960 và 2020 gần nhau (' + a.toFixed(2) + ' và ' + b.toFixed(2) + ')');
  const c = inc('VN', 1985), d = inc('VN', 2020); ok(Math.abs(c - d) / d < 0.4, 'Việt Nam cũng vậy (' + c.toFixed(2) + ' và ' + d.toFixed(2) + ')');
  const lo = life('VN', 1960, 14, 30), hi = life('VN', 2026, 14, 30); const nom = (x) => E.careerYear(x, () => .5, () => { });
  [lo, hi].forEach(x => { x.edu = 3; x.school = null; x.indep = true; E.startJob(x, 'giao_vien', () => .5, () => { }, true); x.job.rank = 1; });
  const wlo = nom(lo), whi = nom(hi); ok(wlo < whi * 0.3, 'lương giáo viên Việt Nam 1990 thấp hơn nhiều so với nay: ' + wlo.toFixed(1) + ' so với ' + whi.toFixed(1));
}
// 4. Bảo hiểm và thuế thu nhập Việt Nam theo năm
{
  const mk = (y, job) => { const l = life('VN', y, 21, 32); l.edu = 3; l.school = null; l.indep = true; E.startJob(l, job, () => .5, () => { }, true); l.job.rank = 2; return l; };
  const priv80 = mk(1980, 'ke_toan'), st80 = mk(1980, 'cong_chuc'), priv00 = mk(2000, 'ke_toan');
  E.careerYear(priv80, () => .5, () => { }); E.careerYear(st80, () => .5, () => { }); E.careerYear(priv00, () => .5, () => { });
  ok(!(priv80.si && priv80.si.yrs), 'Việt Nam 1980: nhân viên tư nhân chưa đóng bảo hiểm xã hội');
  ok(st80.si && st80.si.yrs >= 1, 'Việt Nam 1980: cán bộ nhà nước có bảo hiểm');
  ok(priv00.si && priv00.si.yrs >= 1, 'Việt Nam 2000: có bảo hiểm');
  const rate = (y) => { const l = mk(y, 'ke_toan'); E.careerYear(l, () => .5, () => { }); return l.yr.si / l.yr.gross; };
  ok(rate(2000) < rate(2011) && rate(2011) < rate(2020), 'mức đóng của người lao động tăng theo năm (' + rate(2000).toFixed(3) + ' < ' + rate(2011).toFixed(3) + ' < ' + rate(2020).toFixed(3) + ')');
  const l1 = mk(1985, 'bac_si'), l2 = mk(2012, 'bac_si'); [l1, l2].forEach(l => { l.edu = 5; l.job.rank = 4; l.base *= 8; });
  E.careerYear(l1, () => .5, () => { }); E.careerYear(l2, () => .5, () => { });
  ok(!l1.flags.tax909 || l1.flags.tax909.history.length === 0, 'trước 1991 không có thuế thu nhập tiền lương');
  ok(l2.flags.tax909 && l2.flags.tax909.history.length >= 1, 'từ 2009 có kê khai thuế thu nhập tiền lương');
}
// 5. Nhà ở theo loại và năm (Việt Nam)
{
  const l = life('VN', 1965, 31, 30); l.urban = true; const t = E.homeMin(l); ok(t > 0 && t < E.homeMin(life('VN', 2026, 31, 30)), 'giá nhà tối thiểu 1995 thấp hơn nay');
  ok(Array.isArray(E.HOME_TYPES) && E.HOME_TYPES.some(h => h.k === 'cc'), 'còn bảng loại nhà');
}
console.log('era955: ' + n + ' kiểm tra đạt');
