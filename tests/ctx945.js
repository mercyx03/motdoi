'use strict';
// 9.5: bối cảnh thời đại theo nước và năm (data-ctx945.js, ctx945.js), sửa tôn giáo theo nước (religion945.js), nền trước 1950 (era920.js), trần kiến thức (engine.js).
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, U = G.U, H = E.H, C = E.CTX945, D = C.DATA;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const say = l => (t, k) => l.log.push({ a: l.age, t, k });
function life(cc, y, o) { o = o || {}; const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: o.seed || 41, year: y, gender: o.sex || 'M' }); l.age = o.age == null ? 0 : o.age; l.alive = true; l.pending = []; l.sched = []; return l; }
const R = l => () => U.rand(l);
const known = new Set(G.W.C.map(c => c.code)); const groups = new Set(Object.keys(D.GRP));
// 1. Dữ liệu hợp lệ
{
  const all = [['WAR', 0, 1, 2, 3], ['FAM', 0, 1, 2, 3], ['EPI', 0, 1, 2, 3], ['ECON', 0, 1, 2, 3], ['DIS', 0, 1, 1, 2]];
  ok(D.WAR.length >= 190 && D.FAM.length >= 75 && D.EPI.length >= 25 && D.ECON.length >= 55 && D.DIS.length >= 30, 'đủ số mục dữ liệu: ' + [D.WAR.length, D.FAM.length, D.EPI.length, D.ECON.length, D.DIS.length].join('/'));
  const chk = (name, rows, ci, yi0, yi1, si) => rows.forEach(r => { const codes = D.GRP[r[ci]] || (r[ci] === '*' ? ['*'] : [r[ci]]); codes.forEach(c => ok(c === '*' || known.has(c), name + ': mã nước hợp lệ ' + c)); ok(r[yi0] >= 1900 && r[yi1] <= 2025 && r[yi0] <= r[yi1], name + ': năm hợp lệ ' + r.join(',')); ok([1, 2, 3].includes(r[si]), name + ': mức 1–3 ' + r.join(',')); ok(typeof r[r.length - 1] === 'string' && r[r.length - 1].length > 5, name + ': có tên'); });
  chk('WAR', D.WAR, 0, 1, 2, 3); chk('FAM', D.FAM, 0, 1, 2, 3); chk('EPI', D.EPI, 0, 1, 2, 3); chk('ECON', D.ECON, 0, 1, 2, 3);
  D.DIS.forEach(r => { ok(known.has(r[0]) && r[1] >= 1900 && r[1] <= 2025 && [1, 2, 3].includes(r[2]) && r[3], 'DIS hợp lệ ' + r.join(',')); });
  ok(/Wikipedia/.test(D.src) && D.ver === 'secondary', 'ghi nguồn và mức đối chiếu');
  ok(['war', 'civil', 'ins', 'occ', 'terror'].every(k => D.WAR.some(r => r[4] === k)), 'có đủ các loại xung đột');
}
// 2. Tra cứu các ca đã biết
{
  const at = (cc, y) => C.at(cc, y);
  ok(at('VN', 1968).war === 3 && at('VN', 1945).fam === 3 && at('VN', 1985).econ === 2 && at('VN', 2010).level === 0, 'Việt Nam: 1968 chiến tranh, 1945 nạn đói, 1985 bao cấp, 2010 bình thường');
  ok(at('CN', 1960).fam === 3 && at('CN', 1967).war === 2 && at('CN', 1980).level === 0, 'Trung Quốc: 1960 nạn đói, 1967 Cách mạng Văn hóa');
  ok(at('ET', 1984).fam === 3 && at('ET', 1984).war === 3, 'Ethiopia 1984: đói và nội chiến');
  ok(at('UA', 1933).fam === 3 && at('RU', 1942).war === 3 && at('KZ', 1932).fam === 3, 'Xô viết 1932–1933 và 1942');
  ok(at('DE', 1946).fam === 2 && at('NL', 1944).fam === 2 && at('GR', 1942).fam === 3, 'châu Âu sau chiến tranh: Đức 1946, Hà Lan 1944, Hy Lạp 1942');
  ok(at('IN', 1943).fam === 3 && at('BD', 1974).fam === 3 && at('KH', 1977).fam === 3 && at('KP', 1996).fam === 3, 'nạn đói Bengal, Bangladesh, Khmer Đỏ, Bắc Triều Tiên');
  ok(at('US', 1918).epi === 3 && at('BR', 1918).epi === 3 && at('US', 1968).crisis === 0, 'cúm 1918 toàn cầu, cúm 1968 nhẹ không tính khủng hoảng');
  ok(at('DE', 1922).econ === 3 && at('AR', 2001).econ === 3 && at('ZW', 2008).econ === 3 && at('US', 1933).econ === 2, 'siêu lạm phát và Đại suy thoái');
  ok(at('JP', 1923).dis === 3 && at('HT', 2010).dis === 3 && at('TR', 2023).dis === 3, 'thiên tai lớn');
  ok(at('RU', 1932).fam === 2 && at('BY', 1943).war === 3 && at('LT', 1944).war === 3 && at('AM', 1919).fam === 3, 'nhóm nước Liên Xô được áp đúng');
  ok(at('RS', 1992).econ === 3 && at('BA', 1993).war === 3 && at('HR', 1993).war === 3 && at('SI', 1993).war === 0, 'chiến tranh Nam Tư theo từng nước');
  ok(at('RW', 1994).war === 3 && at('RW', 1993).war === 2 && at('BI', 1994).war === 3, 'Rwanda và Burundi');
  ok(at('SE', 1960).level === 0 && at('CH', 1944).level === 0 && at('US', 1975).level === 0, 'nước không có biến cố thì bình thường');
  const pov = (cc, y) => C.pov(life(cc, y));
  ok(pov('RW', 1994) >= 2 && pov('US', 1950) === 0 && pov('VN', 2015) === 0 && pov('VN', 1960) >= 2 && pov('CN', 1960) >= 2, 'mức thiếu thốn nền theo mức phát triển: Rwanda 1994, Mỹ 1950, Việt Nam 1960 và 2015');
  ok(pov('JP', 1946) <= pov('IN', 1946) && pov('IN', 1950) >= 2, 'Ấn Độ 1950 nghèo hơn Nhật Bản');
}
// 3. Tử vong cộng thêm: sinh giữa nạn đói thì chết nhiều hơn so với không có mô-đun, người lớn tuổi trẻ ít bị
{
  const off = gameContext({ skip: ['js/ctx945.js'] }).E;
  const STOP = { stop: true };
  function run(Ex, cc, y, N, mode) { let d5 = 0, d15 = 0; for (let i = 0; i < N; i++) { const l = Ex.createLife({ mode: mode || 'world', country: cc, seed: 3000 + i, year: y }); try { Ex.runHeadless(l, function (x) { if (x.age >= 16) throw STOP; }); } catch (e) { if (e !== STOP) throw e; } if (!l.alive && l.death.age < 5) d5++; if (!l.alive && l.death.age < 15) d15++; } return { d5: d5 / N, d15: d15 / N }; }
  const a = run(E, 'UA', 1932, 120), b = run(off, 'UA', 1932, 120); ok(a.d15 > b.d15 + 0.15, 'sinh năm 1932 ở Ukraina: chết trước 15 tuổi cao hơn hẳn (' + a.d15.toFixed(2) + ' so với ' + b.d15.toFixed(2) + ')');
  const c2 = run(E, 'ET', 1984, 120), d2 = run(off, 'ET', 1984, 120); ok(c2.d5 > d2.d5 + 0.05, 'sinh năm 1984 ở Ethiopia: chết trước 5 tuổi cao hơn (' + c2.d5.toFixed(2) + ' so với ' + d2.d5.toFixed(2) + ')');
  const e2 = run(E, 'US', 1968, 120), f2 = run(off, 'US', 1968, 120); ok(Math.abs(e2.d15 - f2.d15) < 0.05, 'Mỹ 1968 không đổi đáng kể (' + e2.d15.toFixed(2) + ' so với ' + f2.d15.toFixed(2) + ')');
  const g2 = run(E, 'VN', 2005, 100, 'vn'), h2 = run(off, 'VN', 2005, 100, 'vn'); ok(g2.d15 === h2.d15 || Math.abs(g2.d15 - h2.d15) < 0.04, 'Việt Nam 2005 không đổi (' + g2.d15.toFixed(2) + ' so với ' + h2.d15.toFixed(2) + ')');
  // hazard theo tuổi và giới
  const l = life('VN', 1943, { sex: 'M' }), c = C.at('VN', 1968); const m = C.hazard(l, c, 25).reduce((s, x) => s + x[0], 0), w = C.hazard(life('VN', 1943, { sex: 'F' }), c, 25).reduce((s, x) => s + x[0], 0); ok(m > w * 2, 'thời chiến: nam ở tuổi chiến đấu nguy hiểm hơn (' + m.toFixed(4) + ' > ' + w.toFixed(4) + ')');
  const old = life('UA', 1932), co = C.at('UA', 1932); const infant = C.hazard(old, co, 0).reduce((s, x) => s + x[0], 0), adult = C.hazard(old, co, 30).reduce((s, x) => s + x[0], 0); ok(infant > adult * 3, 'nạn đói: trẻ sơ sinh nguy hiểm hơn người trưởng thành nhiều lần');
  const pre = life('UA', 1932), post = life('UA', 1980); ok(C.hazard(pre, C.at('UA', 1932), 0).length > 0 && C.hazard(post, C.at('UA', 1980), 0).length === 0, 'hết nạn đói thì không còn tử vong cộng thêm');
  const p1 = C.hazard(life('CN', 1960), C.at('CN', 1960), 0).reduce((s, x) => s + x[0], 0), p0 = C.hazard(life('CN', 1928), C.at('CN', 1928), 0).reduce((s, x) => s + x[0], 0); ok(p0 > p1 * 1.5, 'trước 1950 dùng đủ mức, từ 1950 chỉ 20% vì số liệu UN đã gồm phần lớn');
}
// 4. Sinh ra giữa chiến tranh / nạn đói: ghi chú, sức khỏe, thiếu lễ
{
  const l = life('ET', 1984, { seed: 51 }); E.beginYear(l, { auto: true }); E.finishYear(l); ok(l.log.some(e => /chào đời giữa hoàn cảnh khó khăn/.test(e.t)) && l.flags.lowBirth945 && l.st.hea < 75, 'sinh năm 1984 ở Ethiopia: dòng nhật ký và sức khỏe sơ sinh kém (hea ' + l.st.hea.toFixed(0) + ')');
  const w = life('VN', 1968, { seed: 52 }); E.beginYear(w, { auto: true }); E.finishYear(w); ok(w.log.some(e => /chào đời giữa hoàn cảnh khó khăn/.test(e.t) && /bom đạn|chạy loạn/.test(e.t)), 'sinh năm 1968 ở Việt Nam: tiếng bom đạn và chạy loạn');
  const p = life('US', 1968, { seed: 53 }); E.beginYear(p, { auto: true }); E.finishYear(p); ok(!p.log.some(e => /chào đời giữa hoàn cảnh khó khăn/.test(e.t)) && !p.flags.lowBirth945, 'thời bình không có ghi chú này');
}
// 5. Phong tục: thôi nôi bốc đồ
{
  const q = (cc, y, qv) => { const l = life(cc, y, { seed: 61 }); l.fam.q = qv; return C.customAllowed(l, 'thoi_noi'); };
  ok(q('VN', 2005, 2) && q('JP', 2000, 3) && q('KR', 1975, 3), 'thời bình: có lễ thôi nôi / Doljanchi');
  ok(!q('VN', 1968, 5) && !q('ET', 1984, 5) && !q('DE', 1946, 5) && !q('CN', 1960, 4), 'giữa chiến tranh, nạn đói: không có lễ dù nhà khá giả');
  ok(!q('VN', 1938, 2) && !q('US', 1930, 2) && q('US', 1930, 4) && q('US', 1955, 4), 'ngày xưa (trước 1960) chỉ nhà khá giả mới bày mâm bốc đồ');
  ok(!q('BI', 2010, 1) && q('BI', 2010, 4) && q('RW', 2008, 1), 'nước rất nghèo (Burundi 2010): chỉ nhà khá giả; nghèo vừa vẫn có lễ');
  const l = life('VN', 1955, { seed: 62 }); l.fam.q = 2; l.age = 1; const log = []; E.HOOKS.year.forEach(h => { try { h(l, R(l), (t, k) => log.push(t), 1); } catch (e) { } }); ok(log.some(t => /thôi nôi|bữa cơm quây quần|bát cháo/.test(t)), 'năm tròn 1 tuổi trong hoàn cảnh không có lễ: có dòng ghi chú thay thế');
  const tr = E.TRIG.find(t => t.id === 'thoi_noi'), a = life('VN', 1968, { seed: 63, age: 1 }), b = life('VN', 2005, { seed: 64, age: 1 }); ok(!tr.when(a, 1) && tr.when(b, 1), 'trình kích hoạt thôi nôi theo hoàn cảnh');
  // học thêm / trường quốc tế
  const opt = (l, k) => E.DEC.con_hoc.def.opts.find(o => o.k === k); const old = life('VN', 1935, { seed: 65, age: 40 }); old.fam.q = 4; const jp = life('JP', 1970, { seed: 66, age: 40 }); jp.fam.q = 4; ok(!C.schoolOptionOk(old, 'intl') && C.schoolOptionOk(jp, 'intl'), 'trường quốc tế cho con chỉ có từ khoảng 1990 và khi hết chiến tranh');
  ok(C.schoolOptionOk(life('US', 1935, { seed: 67, age: 40 }), 'extra') && !C.schoolOptionOk(life('ET', 1944, { seed: 68, age: 40 }), 'extra'), 'học thêm: không ở vùng đói và chiến sự');
}
// 6. Tần suất sự kiện theo hoàn cảnh
{
  const war = life('VN', 1948, { seed: 71, age: 20 }), calm = life('JP', 1985, { seed: 72, age: 20 }), famine = life('ET', 1964, { seed: 73, age: 20 });
  const T = id => ({ id }); const lux = ['concert', 'kpop', 'mua_sam', 'tiktok', 'nap_game', 'k6_karaoke', 'gameshow'];
  lux.forEach(id => ok(C.eventK(T(id), war) < 0.5 && C.eventK(T(id), calm) === 1, 'sự kiện xa xỉ ' + id + ' giảm mạnh thời chiến, bình thường thời bình'));
  const danger = ['bi_cuop', 'khung_bo', 'chan_thuong', 'ruot_thua', 'nghi_hoc_ngheo']; danger.forEach(id => ok(C.eventK(T(id), war) > 1.5 && C.eventK(T(id), calm) === 1, 'sự kiện nguy hiểm ' + id + ' tăng thời chiến'));
  ok(C.eventK(T('chien_tranh'), war) >= 4 && C.eventK(T('chien_tranh'), calm) === 1, 'sự kiện chiến tranh tăng khi có chiến sự thật');
  ok(C.eventK(T('mua_sam'), famine) < 0.4 && C.eventK(T('thoi_noi'), famine) === 1, 'không đụng tới sự kiện không thuộc nhóm nào');
  ok(E.TRIG.length >= 600, 'không làm mất trình kích hoạt (' + E.TRIG.length + ')');
}
// 7. Việc của thời loạn / đói / dịch
{
  const cases = [['VN', 1968, 'M', 17], ['ET', 1984, 'F', 8], ['IR', 1985, 'M', 30], ['NL', 1944, 'F', 25], ['DE', 1922, 'M', 35], ['JP', 1923, 'F', 12], ['PE', 2020, 'M', 40], ['KH', 1976, 'F', 19], ['SY', 2014, 'M', 22], ['ZW', 2008, 'F', 28]];
  const seen = new Set();
  cases.forEach(([cc, y, sex, age], i) => {
    const l = life(cc, y - age, { seed: 80 + i, sex, age, mode: cc === 'VN' ? 'vn' : 'world' }); const c = C.of(l); const ks = C.kindsFor(l, c); ok(ks.length >= 1, cc + ' ' + y + ': có ít nhất một loại việc');
    ks.forEach(k => { seen.add(k); const ev = C.EV[k]; ok(ev.n && ev.t(l, c) && !/undefined|NaN/.test(ev.t(l, c)), 'văn bản sạch: ' + k); const opts = ev.o(l, c); ok(opts.length >= 2 && opts.every(o => o.k && o.l && o.h && typeof o.run === 'function' && !/undefined|NaN/.test(o.l + o.h)), k + ': ít nhất 2 lựa chọn sạch');
      opts.forEach(o => { const x = life(cc, y - age, { seed: 90 + i, sex, age, mode: cc === 'VN' ? 'vn' : 'world' }); x.money = x.base * 3; const r = R(x), c2 = C.of(x); const o2 = C.EV[k].o(x, c2).find(z => z.k === o.k); o2.run(x, r, say(x)); ok(isFinite(x.money) && isFinite(x.st.hap) && isFinite(x.st.hea), 'chạy được: ' + k + '/' + o.k + ' (' + cc + ')'); }); });
  });
  ok(seen.size >= 7, 'đã thử ' + seen.size + ' loại việc');
  // chọn theo hoàn cảnh: lính chỉ có ở nơi có chiến sự và với nam trong độ tuổi
  const m = life('VN', 1950, { seed: 99, sex: 'M', age: 18, mode: 'vn' }), f = life('VN', 1950, { seed: 99, sex: 'F', age: 18, mode: 'vn' }), k = life('VN', 1950, { seed: 99, sex: 'M', age: 5, mode: 'vn' });
  ok(C.kindsFor(m, C.of(m)).includes('drafted') && !C.kindsFor(f, C.of(f)).includes('drafted') && !C.kindsFor(k, C.of(k)).includes('drafted'), 'tuyển quân chỉ với nam trong độ tuổi');
  ok(C.kindsFor(life('JP', 2005, { age: 20 }), C.of(life('JP', 2005, { age: 20 }))).length === 0, 'thời bình không có việc của thời loạn');
  // queue qua hook trong nhiều năm: gặp được
  let got = 0; for (let i = 0; i < 40; i++) { const l = life('VN', 1960, { seed: 100 + i, mode: 'vn', age: 8 }); for (let a = 0; a < 8; a++) { l.age = 8 + a; E.HOOKS.year.forEach(h => { try { h(l, R(l), say(l), l.age); } catch (e) { } }); if ((l.pending || []).some(d => d.id === 'ctx945_event')) { got++; break; } } l.pending = []; }
  ok(got >= 20, 'trong vài năm chiến tranh phần lớn nhân vật gặp ít nhất một việc của thời loạn (' + got + '/40)');
}
// 8. Mất bố mẹ, nhà trường, thu nhập, lương thực
{
  function loss(cc, y, N) { let c = 0; for (let i = 0; i < N; i++) { const l = life(cc, y - 8, { seed: 200 + i, age: 8, mode: cc === 'VN' ? 'vn' : 'world' }); l.fam.fAlive = true; l.fam.noDad = false; l.fam.mAlive = true; for (let a = 0; a < 6; a++) { l.age = 8 + a; E.HOOKS.year.forEach(h => { try { h(l, R(l), say(l), l.age); } catch (e) { } }); if (!l.alive) break; } if (!l.fam.fAlive || !l.fam.mAlive) c++; } return c / N; }
  const w = loss('VN', 1968, 80), p = loss('JP', 2005, 80); ok(w > p + 0.1, 'thời chiến mất bố hoặc mẹ nhiều hơn thời bình (' + w.toFixed(2) + ' so với ' + p.toFixed(2) + ')');
  let hit = 0; for (let i = 0; i < 12; i++) { const x = life('VN', 1958, { seed: 310 + i, age: 10, mode: 'vn' }); x.school = 'primary'; x.age = 10; E.HOOKS.year.forEach(h => { try { h(x, R(x), say(x), 10); } catch (e) { } }); if (x.log.some(e => /trường học/.test(e.t) && /đóng cửa|gián đoạn|phá hủy/.test(e.t))) hit++; } ok(hit >= 2, 'năm chiến tranh nhà trường bị gián đoạn (' + hit + '/12)');
  const cw = C.at('VN', 1968), cf = C.at('ET', 1984), cp = C.at('SE', 1970); ok(C.incomeK(cw) < 1 && C.incomeK(cf) < C.incomeK(cw) && C.incomeK(cp) === 1 && C.incomeK(cf) >= 0.55, 'thu nhập giảm theo chiến tranh và nạn đói');
  ok(C.foodK(cf) > C.foodK(cw) && C.foodK(cw) > 1 && C.foodK(cp) === 1 && C.foodK(C.at('DE', 1922)) > 1.2, 'giá lương thực tăng khi đói, chiến tranh và siêu lạm phát');
  ok(C.incomeK(C.of(life('ET', 1936, { age: 24 }))) <= 1, 'thu nhập không bao giờ vượt hệ số 1');
}
// 9. Nền trước 1950 và trần kiến thức
{
  function mean(cc, y, N, mode) { let u = 0, s = 0; for (let i = 0; i < N; i++) { const l = E.createLife({ mode: mode || 'world', country: cc, seed: 400 + i, year: y }); E.runHeadless(l); s += l.alive ? 100 : l.death.age; if (!l.alive && l.death.age < 5) u++; } return { age: s / N, u5: u / N }; }
  const a = mean('IN', 1905, 100), b = mean('IN', 1950, 100); ok(a.u5 > b.u5 - 0.02 && a.age < b.age + 5, 'Ấn Độ 1905 không tốt hơn 1950 (u5 ' + a.u5.toFixed(2) + ' so với ' + b.u5.toFixed(2) + ')');
  const x = life('VN', 1905, { seed: 410, mode: 'vn' }), y = life('VN', 1950, { seed: 410, mode: 'vn' }); ok(x.e0 < y.e0 - 5 && x.u5 > y.u5, 'tuổi thọ lúc sinh năm 1905 thấp hơn 1950 và tử vong trẻ em cao hơn (' + x.e0.toFixed(1) + ' < ' + y.e0.toFixed(1) + ')');
  const z = life('US', 1999, { seed: 411 }), w = life('US', 2000, { seed: 411 }); ok(Math.abs(z.e0 - w.e0) < 1, 'từ 1950 trở đi không bị lùi thêm');
  // trần kiến thức: tuổi 18 không còn dồn lên 95–100
  let sum = 0, hi = 0; const N = 60; for (let i = 0; i < N; i++) { const l = E.createLife({ mode: 'vn', seed: 37000 + i }); let g = 0; while (l.alive && g++ < 40 && l.age < 19) { E.beginYear(l, { auto: true }); let k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); if (l.alive) E.finishYear(l); k = 0; while (l.pending.length && l.alive && k++ < 30) E.resolve(l, E.autoKey(l)); E.endYear(l); } if (l.alive) { sum += l.st.kno; if (l.st.kno >= 95) hi++; } }
  ok(sum / N > 65 && sum / N < 88 && hi <= N * 0.05, 'kiến thức trung bình ở tuổi 18 khoảng ' + (sum / N).toFixed(0) + ', không còn chạm trần (' + hi + '/' + N + ' đạt từ 95)');
}
// 10. Tôn giáo theo nước
{
  const R9 = E.REL945, T = R9.TABLE; const labels = new Set(['Công giáo', 'Tin Lành', 'Chính thống giáo Đông phương', 'Anh giáo', 'Hồi giáo', 'Hindu giáo', 'Phật giáo', 'Không tôn giáo', 'Tín ngưỡng truyền thống', 'Do Thái giáo', 'Khác']);
  Object.keys(T).forEach(cc => { ok(known.has(cc), 'mã nước hợp lệ ' + cc); const parts = T[cc].split(',').map(x => x.split(':')); ok(parts.every(p => labels.has(p[0]) && +p[1] > 0), 'nhãn hợp lệ ' + cc); const sum = parts.reduce((s, p) => s + +p[1], 0); ok(sum >= 95 && sum <= 105, cc + ': tổng ' + sum); });
  function dist(cc, N) { const c = {}; for (let i = 0; i < N; i++) { const l = E.createLife({ mode: 'world', country: cc, seed: 500 + i }); c[l.religion] = (c[l.religion] || 0) + 1; } Object.keys(c).forEach(k => c[k] /= N); return c; }
  const rw = dist('RW', 300); ok(!rw['Chính thống giáo Đông phương'] && !rw['Anh giáo'] && (rw['Công giáo'] || 0) + (rw['Tin Lành'] || 0) > 0.85 && (rw['Hồi giáo'] || 0) < 0.08, 'Rwanda: Công giáo và Tin Lành chiếm đa số, không có Chính thống giáo hay Anh giáo');
  const et = dist('ET', 300); ok((et['Chính thống giáo Đông phương'] || 0) > 0.35 && (et['Hồi giáo'] || 0) > 0.25, 'Ethiopia: Chính thống giáo và Hồi giáo');
  const eg = dist('EG', 300); ok((eg['Hồi giáo'] || 0) > 0.8 && (eg['Chính thống giáo Đông phương'] || 0) > 0.04 && !eg['Anh giáo'], 'Ai Cập: Hồi giáo và Kitô hữu Coptic (Chính thống giáo Đông phương)');
  const de = dist('DE', 300); ok((de['Hồi giáo'] || 0) < 0.12, 'Đức: Hồi giáo dưới 12% (' + (de['Hồi giáo'] || 0).toFixed(2) + ')');
  const ng = dist('NG', 300); ok((ng['Hồi giáo'] || 0) > 0.4 && !ng['Chính thống giáo Đông phương'], 'Nigeria: Hồi giáo và Kitô hữu, không có Chính thống giáo Đông phương');
  const co = dist('CO', 300); ok((co['Công giáo'] || 0) > 0.65, 'Colombia: Công giáo chiếm đa số');
  const dz = dist('DZ', 200); ok(Object.keys(dz).every(k => /Hồi giáo|Chưa khai/.test(k)), 'Algeria: không có Kitô hữu bản địa');
  const us = dist('US', 300); ok(!us['Anh giáo (Giám nhiệm / Episcopal)'] || us['Anh giáo (Giám nhiệm / Episcopal)'] < 0.04, 'Mỹ: Giám nhiệm không còn chiếm một phần tư số người Tin Lành');
  ok(R9.denom({ country: 'RW', pool: 'afe' }, 'x', 100) === 'Công giáo' || R9.denom({ country: 'RW', pool: 'afe' }, 'x', 100) === 'Tin Lành', 'giáo phái theo nước');
  const vn = E.createLife({ mode: 'vn', seed: 7 }); ok(R9.weights(vn) === null, 'Việt Nam không dùng bảng này');
}
// 11. Tương thích: đời sinh gần đây ở nước giàu không đổi; chạy nhiều bối cảnh không lỗi
{
  const hashes = e => [['vn', 'VN'], ['world', 'JP'], ['world', 'KR']].map(([mode, cc], i) => { const l = e.createLife({ mode, country: cc, seed: 4800 + i, year: 2026 }); e.runHeadless(l); return crypto.createHash('sha1').update(JSON.stringify({ log: l.log.map(x => [x.a, x.t]), money: Math.round(l.money * 100) })).digest('hex'); });
  const sk = gameContext({ skip: ['js/ctx945.js', 'js/religion945.js'] }).E; const a = hashes(sk), b = hashes(gameContext().E); ok(a.every((h, i) => h === b[i]), 'đời sinh 2026 ở Việt Nam, Nhật Bản, Hàn Quốc giống hệt khi có và không có mô-đun bối cảnh');
  const cases = [['VN', 1945], ['VN', 1968], ['CN', 1960], ['ET', 1984], ['RW', 1994], ['SY', 2014], ['DE', 1946], ['US', 1918], ['UA', 1932], ['KH', 1977], ['BD', 1974], ['LB', 1980], ['PE', 1988], ['ZW', 2008], ['IR', 1982], ['NG', 1968], ['JP', 1945], ['IN', 1943], ['GR', 1942], ['AR', 1978]];
  let crash = 0; cases.forEach(([cc, y], i) => { for (let k = 0; k < 3; k++) { try { const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: 600 + i * 7 + k, year: y }); E.runHeadless(l); if (!isFinite(l.money)) crash++; } catch (e) { crash++; console.log(cc, y, e.stack.split('\n').slice(0, 3).join(' | ')); } } });
  ok(crash === 0, 'chạy 60 đời ở 20 bối cảnh không lỗi');
}
// 12. Hạn chế xuất cảnh và thời thuộc địa
{
  const at = (cc, y) => C.at(cc, y);
  ok(at('CN', 1970).restrict === 3 && at('CN', 1982).restrict === 2 && at('CN', 1995).restrict === 0 && at('VN', 1980).restrict === 3 && at('VN', 1988).restrict === 2 && at('VN', 2000).restrict === 0, 'hạn chế xuất cảnh theo nước và năm: Trung Quốc, Việt Nam');
  ok(at('RO', 1985).restrict === 3 && at('PL', 1985).restrict === 2 && at('KP', 2015).restrict === 3 && at('CU', 2005).restrict === 3 && at('CU', 2015).restrict === 0 && at('BG', 1990).restrict === 0, 'khối Đông Âu, Bắc Triều Tiên, Cuba');
  ok(at('RU', 1970).restrict === 3 && at('UA', 1970).restrict === 3 && at('RU', 1990).restrict === 2, 'Liên Xô: bức màn sắt rồi cải tổ');
  const open = life('US', 1950, { seed: 700, age: 20 }), shut = life('CN', 1950, { seed: 701, age: 20 }); open.fam.q = shut.fam.q = 3;
  ok(C.emigAllowed(open) && !C.emigAllowed(shut), 'xuất cảnh: Mỹ cho phép, Trung Quốc thời Mao không');
  const rich = life('CN', 1942, { seed: 702, age: 20 }); rich.fam.q = 5; ok(!C.emigAllowed(rich), 'mức 3 thì nhà giàu cũng không ra được');
  const mid = life('PL', 1960, { seed: 703, age: 25 }); mid.fam.q = 2; const mid2 = life('PL', 1960, { seed: 703, age: 25 }); mid2.fam.q = 4; ok(!C.emigAllowed(mid) && C.emigAllowed(mid2), 'mức 2 (Ba Lan 1985): chỉ nhà có quan hệ');
  ['xkld', 'emig', 'du_hoc'].forEach(id => { if (!E.DEC[id] || !E.DEC[id].def) return; ok(typeof E.DEC[id].def.valid === 'function', 'đã gắn điều kiện xuất cảnh vào ' + id); });
  const emigTrig = E.TRIG.filter(t => C.EMIG.includes(t.id)); ok(emigTrig.every(t => !t.when(shut, 25)), 'trình kích hoạt xuất cảnh bị chặn ở nước cấm xuất cảnh (' + emigTrig.length + ')');
  ok(C.colonyAt('NG', 1930) === 'Anh' && C.colonyAt('NG', 1960) === null && C.colonyAt('VN', 1930) === 'Pháp' && C.colonyAt('DZ', 1955) === 'Pháp' && C.colonyAt('ID', 1925) === 'Hà Lan' && C.colonyAt('US', 1930) === null, 'thời thuộc địa suy ra từ bảng bối cảnh chính trị');
  const col = life('NG', 1930, { seed: 710 }); E.beginYear(col, { auto: true }); E.finishYear(col); ok(col.log.some(e => /thuộc địa của Anh/.test(e.t) && /chào đời/.test(e.t)), 'sinh ra dưới thời thuộc địa: có dòng ghi chú');
  const closed = life('CN', 1950, { seed: 711, age: 17 }); const lg = []; closed.age = 17; E.HOOKS.year.forEach(h => { try { h(closed, R(closed), (t) => lg.push(t), 17); } catch (e) { } }); ok(lg.some(t => /gần như không thể/.test(t)), 'thông báo khi lớn lên ở nước cấm xuất cảnh');
}
console.log('PASS ctx945: ' + n + ' checks');
