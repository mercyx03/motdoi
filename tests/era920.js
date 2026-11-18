'use strict';
// 9.2 giai đoạn 2 bối cảnh lịch sử: số liệu quốc gia theo năm 1950–2023 (data-era920.js, era920.js), tên nước/thành phố (era920-pol.js),
// nối vào tử vong, sinh con, đô thị hóa, ngưỡng phát triển (engine.js), phổ cập điện thoại/internet (era902.js, access890.js).
const assert = require('node:assert/strict');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext(), E = G.E, X = E.ERA920, D = G.ERA920_DATA;
let n = 0; const ok = (c, m) => { assert.ok(c, m); n++; };
const near = (a, b, t, m) => ok(Math.abs(a - b) <= t, m + ' (' + a + ' vs ' + b + ')');
{
  const l = E.createLife({ mode: 'world', country: 'VN', seed: 957, year: 1986 });
  l.age = 14;
  const home = E.devGdp(l);
  ok(E.ERA902.anachronism(l, 'Bạn đọc tin trên internet'), 'Việt Nam 2000: internet chưa đạt ngưỡng phổ cập của game');
  l.abroad = { code: 'US', study: true };
  near(E.devGdp(l), G.W.BY.US.gdp * Math.min(1.25, X.at('US', 2000).gdpRel), 1e-8, 'du học: mức phát triển dùng nước đang sống và năm thực tế');
  ok(!E.ERA902.anachronism(l, 'Bạn đọc tin trên internet'), 'du học: cảnh dùng mức phổ cập của nước đang sống');
  l.abroad = null;
  near(E.devGdp(l), home, 1e-8, 'trở về: dùng lại nước gốc');
}
// 1. dữ liệu: đủ nước, đủ năm, giá trị hợp lý, có nguồn và hàm băm
{
  const codes = G.W.C.map(c => c.code);
  ok(X && D && D.from === 1950 && D.to === 2023, 'có module và dữ liệu 1950–2023');
  ok(codes.every(c => D.c[c]), 'đủ ' + codes.length + ' nước của game');
  let bad = [];
  codes.forEach(c => { const s = X.series(c); ['e', 't', 'u', 'r', 'g', 'm', 'p', 'n'].forEach(k => { if (!s[k] || s[k].length !== 74 || s[k].some(v => !isFinite(v))) bad.push(c + ':' + k + ' độ dài/giá trị'); });
    s.e.forEach((v, i) => { if (v < 8 || v > 90) bad.push(c + ' e0 ' + (1950 + i) + '=' + v); }); s.t.forEach((v, i) => { if (v < 0.7 || v > 9) bad.push(c + ' tfr ' + (1950 + i) + '=' + v); });
    s.u.forEach((v, i) => { if (v < 0.5 || v > 1000) bad.push(c + ' u5 ' + (1950 + i) + '=' + v); }); s.r.forEach((v, i) => { if (v < 0 || v > 100.01) bad.push(c + ' urban ' + (1950 + i) + '=' + v); });
    s.g.forEach((v, i) => { if (v <= 0.02 || v > 6) bad.push(c + ' gdpRel ' + (1950 + i) + '=' + v); }); s.n.forEach(v => { if (v < 0 || v > 100) bad.push(c + ' internet=' + v); }); });
  ok(bad.length === 0, 'giá trị trong khoảng hợp lý: ' + bad.slice(0, 4).join(' | '));
  ok(Object.keys(D.src).length >= 7 && Object.keys(D.src).every(k => /^[0-9a-f]{64}$/.test(D.src[k].sha256) && /^https:\/\//.test(D.src[k].url)), 'mỗi nguồn có URL và SHA-256');
  ok(/^\d{4}-\d\d-\d\dT[\d:]+([+-]\d\d:\d\d|Z)$/.test(D.retrieved), 'ngày tải có múi giờ');
  const head = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'data-era920.js'), 'utf8').slice(0, 900); ok(/CC BY/.test(head) && /UN WPP/.test(head), 'đầu tệp dữ liệu ghi giấy phép và nguồn');
}
// 2. đối chiếu với số liệu UN đã biết (làm tròn); chuỗi có các cú sốc lịch sử
{
  const v = (c, y) => X.at(c, y);
  near(v('VN', 1950).e0, 48.0, 0.3, 'Việt Nam 1950 tuổi thọ'); near(v('VN', 2023).e0, 74.6, 0.3, 'Việt Nam 2023 tuổi thọ'); near(v('VN', 1950).tfr, 5.15, 0.1, 'Việt Nam 1950 tổng tỷ suất sinh');
  near(v('JP', 1950).e0, 59.3, 0.3, 'Nhật 1950'); near(v('US', 1950).e0, 68.1, 0.3, 'Mỹ 1950'); near(v('IN', 1950).e0, 41.2, 0.3, 'Ấn Độ 1950');
  ok(v('KH', 1977).e0 < 30, 'Campuchia thời Khmer Đỏ có tuổi thọ sụt mạnh (' + v('KH', 1977).e0 + ')');
  ok(v('RW', 1994).e0 < 35, 'Rwanda 1994 sụt mạnh (' + v('RW', 1994).e0 + ')');
  ok(v('CN', 1960).e0 < v('CN', 1957).e0 - 5 && v('CN', 1960).e0 < v('CN', 1964).e0 - 8, 'Trung Quốc 1959–1961 có đáy tuổi thọ (' + v('CN', 1960).e0.toFixed(1) + ')');
  ok(v('RU', 1994).e0 < v('RU', 1989).e0 - 2.5, 'Nga đầu thập niên 1990 giảm tuổi thọ');
  ok(v('ZA', 2005).e0 < v('ZA', 1990).e0, 'Nam Phi giảm tuổi thọ thời HIV/AIDS');
  ok(v('VN', 2000).internet < 1 && v('VN', 2010).internet > 20 && v('VN', 1990).mobile === 0 && v('VN', 2015).mobile > 100, 'Việt Nam: internet và di động theo năm');
  ok(v('NG', 1960).u5 > 250 && v('NG', 2023).u5 < 150, 'Nigeria: tử vong dưới 5 tuổi giảm mạnh');
  ok(v('VN', 1950).u5Observed === false && v('VN', 1960).u5Observed === true, 'năm chưa có số liệu quan sát được đánh dấu là ước tính');
  ok(X.at('VN', 1930).clamped === true && X.at('VN', 1930).e0 === v('VN', 1950).e0, 'trước 1950 dùng mức 1950 và đánh dấu clamped');
}
// 3. đời sinh năm cũ: số liệu lúc sinh khác hẳn đời hiện nay; đời sinh 2026 không có cờ
{
  const mk = (cc, y, seed) => E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: seed || 11, year: y });
  const old = mk('NG', 1960), now = mk('NG', 2026);
  ok(old.era920 && old.era920.cc === 'NG' && old.era920.by === 1960, 'đời 1960 có cờ era920');
  ok(!now.era920, 'đời 2026 không có cờ era920');
  ok(old.e0 < now.e0 - 8 && old.u5 > now.u5 * 1.8 && old.tfr > now.tfr + 0.2, 'Nigeria 1960: tuổi thọ thấp hơn, trẻ chết nhiều hơn, đông con hơn đời hiện nay (e0 ' + old.e0.toFixed(1) + '/' + now.e0.toFixed(1) + ', u5 ' + old.u5.toFixed(0) + '/' + now.u5.toFixed(0) + ', tfr ' + old.tfr.toFixed(2) + '/' + now.tfr.toFixed(2) + ')');
  const jp = mk('JP', 1990), jp0 = mk('JP', 2026); ok(jp.tfr > 1.4 && jp.tfr < 2.0 && jp.e0 < jp0.e0, 'Nhật 1990 có tổng tỷ suất sinh theo năm');
  const vn = mk('VN', 1975, 12); ok(vn.variant === '63' && vn.tfr <= 8.5, 'Việt Nam 1975: 63 tỉnh (trước hợp nhất 2025), tỷ suất sinh có trần');
  const vn2 = E.createLife({ mode: 'vn', seed: 12, year: 2025 }); ok(vn2.variant === '34', 'sinh 2025 vẫn theo 34 tỉnh');
  // đô thị hóa theo năm: Việt Nam 1950 sống ở nông thôn nhiều hơn rõ rệt so với 2026
  let u50 = 0, u26 = 0; for (let i = 0; i < 120; i++) { if (E.createLife({ mode: 'world', country: 'VN', seed: 700 + i, year: 1950 }).urban) u50++; if (E.createLife({ mode: 'world', country: 'VN', seed: 700 + i, year: 2026 }).urban) u26++; }
  ok(u50 < u26 * 0.6, 'tỷ lệ sinh ở đô thị 1950 thấp hơn hẳn 2026 (' + u50 + ' vs ' + u26 + ' trên 120)');
}
// 4. tử vong theo năm: đường tử vong được nạp lại mỗi năm và cải thiện theo số liệu
{
  const l = E.createLife({ mode: 'world', country: 'IN', seed: 31, year: 1950 });
  const q = [0, 20, 40].map(a => { l.age = a; l.era920.y = null; X.refresh(l); return { m: l.mort, e: l.mort.A }; });
  const q40a = E.qBase(q[0].m, 40);
  l.age = 40; l.era920.y = null; X.refresh(l); const q40b = E.qBase(l.mort, 40);
  l.age = 0; l.era920.y = null; X.refresh(l); const q40c = E.qBase(l.mort, 40);
  ok(q40b < q40c, 'ở Ấn Độ nguy cơ chết tuổi 40 vào năm 1990 thấp hơn so với dùng mức 1950 (' + q40b.toFixed(4) + ' < ' + q40c.toFixed(4) + ')');
  l.age = 80; l.era920.y = null; X.refresh(l); const mod = E.createLife({ mode: 'world', country: 'IN', seed: 31, year: 2026 });
  ok(Math.abs(E.qBase(l.mort, 50) - E.qBase(mod.mort, 50)) / E.qBase(mod.mort, 50) < 0.35, 'từ năm 2030 trở đi đường tử vong gần với đời hiện nay (đã chuẩn hóa theo số liệu hiện nay)');
  ok(l.mortM && l.mortF && l.mortM !== l.mortF, 'có đường tử vong riêng cho nam và nữ');
  const j = JSON.parse(JSON.stringify(l)); j.age = 10; j.era920.y = null; X.refresh(j); ok(isFinite(j.mort.A) && isFinite(E.qBase(j.mort, 10)), 'sau vòng JSON vẫn nạp lại được đường tử vong');
  const sameYear = l.mort; X.refresh(l); ok(l.mort === sameYear, 'cùng năm không dựng lại');
}
// 5. đời sinh từ 2026 không đổi một byte so với khi không có ba module era920
{
  const SKIP = ['js/data-era920.js', 'js/era920.js', 'js/era920-pol.js'];
  const hashes = e => [['vn', 'VN'], ['world', 'VN']].map(([mode, cc], i) => { const l = e.createLife({ mode, country: cc, seed: 4600 + i, year: 2026 }); /* nước khác Việt Nam: tỷ suất sinh đời hiện nay nay lấy số liệu UN (9.4) nên khác khi bỏ module */ e.runHeadless(l); const s = Object.assign({}, l); delete s.v; return crypto.createHash('sha256').update(JSON.stringify(s)).digest('hex'); });
  const a = hashes(gameContext({ skip: SKIP }).E), b = hashes(gameContext().E); ok(a.every((h, i) => h === b[i]), 'đời Việt Nam sinh 2026 giống hệt khi có và không có số liệu theo năm');
}
// 6. mô phỏng: tuổi thọ và tử vong dưới 5 tuổi của đời mô phỏng bám đường tử vong theo năm (kiểm tra thô, mẫu nhỏ)
{
  const cases = [['IN', 1950], ['NG', 1960], ['VN', 1950]], N = 20; let sumDiff = 0, c5 = 0, e5 = 0, nn = 0;
  cases.forEach(([cc, y]) => {
    for (let i = 0; i < N; i++) {
      const l = E.createLife({ mode: cc === 'VN' ? 'vn' : 'world', country: cc, seed: 8100 + i * 7 + y, year: y }), l0 = JSON.parse(JSON.stringify(l)); let S = 1, e = 0;
      for (let a = 0; a < 115; a++) { l0.age = a; l0.era920.y = null; X.refresh(l0); const q = a >= 110 ? 1 : E.qBase(l0.mort, a); e += S * (1 - q / 2); S *= 1 - q; }
      E.runHeadless(l); const d = l.death ? l.death.age : l.age; sumDiff += d - e; nn++; if (d < 5) c5++; e5 += X.at(cc, y).u5 / 1000;
    }
  });
  ok(Math.abs(sumDiff / nn) < 7, 'tuổi thọ mô phỏng gần tuổi thọ của đường tử vong theo năm (chênh trung bình ' + (sumDiff / nn).toFixed(1) + ' năm trên ' + nn + ' đời)');
  const r = (c5 / nn) / (e5 / nn); ok(r > 0.55 && r < 1.7, 'tỷ lệ chết trước 5 tuổi gần số liệu UN (tỷ số ' + r.toFixed(2) + ')');
}
// 7. số con mong muốn theo tỷ suất sinh của năm quyết định; ngưỡng phát triển theo năm
{
  const l = E.createLife({ mode: 'world', country: 'NG', seed: 41, year: 1960 }); const t60 = X.tfrNow(l); l.age = 40; const t00 = X.tfrNow(l); l.age = 70; const t30 = X.tfrNow(l);
  ok(t60 > 5.5 && t00 > 5 && t30 < t60, 'Nigeria: tỷ suất sinh theo năm quyết định (' + t60.toFixed(2) + ' → ' + t00.toFixed(2) + ' → ' + t30.toFixed(2) + ')');
  const v = E.createLife({ mode: 'vn', seed: 42, year: 1960 }); v.age = 5; const g60 = E.devGdp(v); v.age = 60; const g20 = E.devGdp(v); ok(g60 < v.gdp * 0.35 && g20 > g60 * 2, 'mức phát triển Việt Nam tăng theo năm (' + g60.toFixed(1) + ' → ' + g20.toFixed(1) + ')');
  const m = E.createLife({ mode: 'vn', seed: 42, year: 2026 }); ok(E.devGdp(m) === m.gdp, 'đời hiện nay: mức phát triển bằng gdp');
}
// 8. phổ cập theo nước: văn bản mạng xã hội bị cắt ở nước chưa có, giữ ở nước đã có; nhắn tin đổi theo điện thoại
{
  const X2 = E.ERA902, T = 'Bạn xem Facebook cả tối. Rồi đi ngủ.';
  const ng = { country: 'NG', birthYear: 1990, age: 13 }, us = { country: 'US', birthYear: 1990, age: 13 }; // năm 2003
  ok(X2.clean(ng, T, true) === 'Rồi đi ngủ.' && X2.clean(us, T, true) === 'Rồi đi ngủ.', 'năm 2003 chưa có Facebook ở cả hai nước (mốc toàn cầu 2004)');
  const ng2 = { country: 'NG', birthYear: 1990, age: 14 }, us2 = { country: 'US', birthYear: 1990, age: 14 }; // 2004 (Facebook ra mắt)
  ok(X.at('NG', 2004).internet < 3 && X.at('US', 2004).internet > 60, 'dữ liệu: internet 2004 Nigeria thấp, Mỹ cao');
  ok(X2.clean(ng2, T, true) === 'Rồi đi ngủ.' && X2.clean(us2, T, true) === T, 'năm 2004: Nigeria chưa phổ cập, Mỹ đã có');
  const cd = { country: 'CD', birthYear: 1975, age: 20 }, us3 = { country: 'US', birthYear: 1975, age: 20 }; // 1995
  ok(X2.clean(cd, 'Cô nhắn tin cho bạn.', true) !== 'Cô nhắn tin cho bạn.' && /(gọi điện|viết thư)/.test(X2.clean(cd, 'Cô nhắn tin cho bạn.', true)), 'năm 1995 ở CHDC Congo "nhắn tin" đổi thành cách nói hợp thời');
  ok(X2.clean(us3, 'Cô nhắn tin cho bạn.', true) === 'Cô nhắn tin cho bạn.' || /gọi điện/.test(X2.clean(us3, 'Cô nhắn tin cho bạn.', true)), 'năm 1995 ở Mỹ dùng cách nói hợp thời');
  const modern = { country: 'NG', birthYear: 2010, age: 16 }; ok(X2.clean(modern, T, true) === T, 'từ năm 2024 trở đi không còn lọc theo nước');
  const old = { birthYear: 1990, age: 8 }; ok(X2.clean(old, 'Gọi video cho mẹ.', true) === 'Gọi điện cho mẹ.', 'đối tượng không có nước: giữ quy tắc giai đoạn 1');
  // access890: mức tiếp cận internet theo năm
  const A = E.ACCESS890, l1 = E.createLife({ mode: 'world', country: 'IN', seed: 51, year: 1985 }); l1.age = 10; const e1995 = A.effective(l1); l1.age = 35; const e2020 = A.effective(l1);
  ok(e1995 < 0.05 && e2020 > 0.15, 'Ấn Độ: mức tiếp cận internet hiệu dụng tăng theo năm (' + e1995.toFixed(3) + ' → ' + e2020.toFixed(3) + ')');
}
// 9. tên nước, tình trạng chính trị, tên thành phố
{
  const P = X.POL;
  ok(/chia hai miền/.test(P.status('VN', 1960)) && P.status('VN', 1980) === null, 'Việt Nam: chia hai miền 1955–1974, hết sau thống nhất');
  ok(/Liên Xô/.test(P.status('RU', 1980)) && P.status('RU', 1995) === null && /Liên Xô/.test(P.status('UA', 1985)), 'Nga/Ukraina thuộc Liên Xô đến 1990');
  ok(/apartheid/.test(P.status('ZA', 1980)) && P.status('ZA', 1996) === null, 'Nam Phi: apartheid đến 1993');
  ok(/Ethiopia/.test(P.status('ER', 1960)) && /Sudan/.test(P.status('SS', 2005)) && /Bồ Đào Nha/.test(P.status('TL', 1960)) && /Indonesia/.test(P.status('TL', 1985)), 'Eritrea, Nam Sudan, Đông Timor theo năm');
  ok(/Anh/.test(P.status('GH', 1950)) && P.status('GH', 1957) === null && /Pháp/.test(P.status('SN', 1959)) && P.status('SN', 1960) === null, 'thuộc địa: kết thúc đúng năm độc lập');
  ok(P.nameAt('MM', 1980) === 'Miến Điện (Burma)' && P.nameAt('MM', 1990) === null && P.nameAt('CD', 1980) === 'Zaire' && P.nameAt('LK', 1960) === 'Ceylon', 'tên nước theo năm');
  const vn70 = { country: 'VN', birthYear: 1950, age: 20 }, vn76 = { country: 'VN', birthYear: 1950, age: 26 }, vn90 = { country: 'VN', birthYear: 1990, age: 10 };
  ok(P.rename(vn70, 'Bạn lên TP. Hồ Chí Minh học.') === 'Bạn lên Sài Gòn học.' && P.rename(vn76, 'Bạn lên TP. Hồ Chí Minh học.') === 'Bạn lên TP. Hồ Chí Minh học.' && P.rename(vn90, 'TP. Hồ Chí Minh') === 'TP. Hồ Chí Minh', 'Sài Gòn đổi tên 1976');
  const mb = { country: 'IN', birthYear: 1960, age: 30 }; ok(P.rename(mb, 'Đến Mumbai và Kolkata.') === 'Đến Bombay và Calcutta.' && P.rename({ country: 'IN', birthYear: 1960, age: 40 }, 'Đến Mumbai.') === 'Đến Mumbai.' && P.rename(mb, 'Mumbaiville') === 'Mumbaiville', 'Ấn Độ: tên thành phố theo năm, đúng ranh giới từ');
  ok(P.rename({ country: 'KZ', birthYear: 2000, age: 20 }, 'ở Astana') === 'ở Nur-Sultan' && P.rename({ country: 'KZ', birthYear: 2000, age: 24 }, 'ở Astana') === 'ở Astana', 'Astana/Nur-Sultan theo năm');
  const l = E.createLife({ mode: 'world', country: 'RU', seed: 61, year: 1975 }); E.runHeadless(l);
  ok(l.log.some(x => /Bối cảnh năm 1975/.test(x.t) && /Liên Xô/.test(x.t)) && l.log.some(x => /Liên Xô tan rã/.test(x.t)), 'đời sinh 1975 ở Nga ghi bối cảnh lúc sinh và lúc Liên Xô tan rã');
  let v1 = false, v2 = false; for (let sd = 62; sd < 82 && !(v1 && v2); sd++) { const v = E.createLife({ mode: 'vn', seed: sd, year: 1965 }); E.runHeadless(v); if (v.log.some(x => /chia hai miền/.test(x.t)) && v.log.some(x => /chiến tranh Việt Nam kết thúc/.test(x.t))) { v1 = v2 = true; } } ok(v1 && v2, 'đời Việt Nam 1965 ghi bối cảnh chiến tranh và thống nhất (quét nhiều mầm: từ 9.5 nhân vật có thể chết trong chiến tranh trước 1975)');
  const m = E.createLife({ mode: 'vn', seed: 63, year: 2026 }); E.runHeadless(m); ok(!m.log.some(x => /Bối cảnh năm/.test(x.t)), 'đời hiện nay không có dòng bối cảnh lịch sử');
}
// 9b. chính sách theo năm: hôn nhân cùng giới chỉ hợp pháp từ năm có hiệu lực của từng nước
{
  const l = E.createLife({ mode: 'world', country: 'US', seed: 91, year: 1990 }); l.age = 20; /* 2010 */ ok(E.H.sameSexLegal(l) === false, 'Mỹ 2010: chưa hợp pháp cùng giới');
  l.age = 26; /* 2016 */ ok(E.H.sameSexLegal(l) === true, 'Mỹ 2016: đã hợp pháp');
  const nl = E.createLife({ mode: 'world', country: 'NL', seed: 92, year: 1970 }); nl.age = 30; ok(E.H.sameSexLegal(nl) === false, 'Hà Lan 2000: chưa'); nl.age = 31; ok(E.H.sameSexLegal(nl) === true, 'Hà Lan 2001: nước đầu tiên');
  const jp = E.createLife({ mode: 'world', country: 'JP', seed: 93, year: 1990 }); jp.age = 30; ok(E.H.sameSexLegal(jp) === false, 'Nhật: không thuộc danh sách');
  const now = E.createLife({ mode: 'world', country: 'US', seed: 94, year: 2026 }); ok(E.H.sameSexLegal(now) === true, 'đời sinh 2026 giữ nguyên');
  ok(G.W.SSM.every(c => X.SSM_Y[c] != null), 'mọi nước trong danh sách có năm hiệu lực');
}
{ const ng = E.createLife({ mode: 'world', country: 'NG', seed: 95, year: 2026 }), kr = E.createLife({ mode: 'world', country: 'KR', seed: 96, year: 2026 }); near(ng.tfr, X.at('NG', 2023).tfr, 0.01, 'Nigeria hiện nay: tỷ suất sinh theo UN'); ok(kr.tfr < 1 && kr.tfr >= 0.7, 'Hàn Quốc hiện nay: tỷ suất sinh dưới 1'); }
{ const P = X.POL; ok(/sáp nhập năm 1940/.test(P.status('LT', 1980)) && /chưa công nhận/.test(P.status('LT', 1990)) && /tan rã/.test(P.status('LV', 1991)) && /Libya lần thứ hai/.test(P.status('LY', 2015)) && /Nam Sudan/.test(P.status('SS', 2015)) && /Yemen/.test(P.status('YE', 2016)), 'bối cảnh Baltic 1940/1990/1991 và các xung đột 2011–2023'); }
// 10. giao diện và bản lưu cũ
{
  const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8'), app = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'app.js'), 'utf8');
  ok(['js/data-era920.js', 'js/era920.js', 'js/era902.js', 'js/era920-pol.js'].every((s, i, a) => html.indexOf(s) > 0 && (i === 0 || html.indexOf(s) > html.indexOf(a[i - 1]) || s === 'js/era902.js')), 'ba module era920 nạp trong index.html');
  ok(html.indexOf('js/data-era920.js') < html.indexOf('js/era920.js') && html.indexOf('js/era920.js') < html.indexOf('js/era920-pol.js') && html.indexOf('js/era920-pol.js') < html.indexOf('js/app.js'), 'thứ tự nạp: dữ liệu, module, tên nước, app');
  ok(/function yearHintText/.test(app) && /optgroup/.test(app) && /trước ' \+ FULL_FROM/.test(app) && !/thử nghiệm|ước tính từ tuổi thọ/.test(app), 'ô năm sinh có nhóm các năm trước 1950 và mô tả theo nước, không có chú thích thử nghiệm');
  const old = E.createLife({ mode: 'world', country: 'JP', seed: 71, year: 2026 }); const o = JSON.parse(JSON.stringify(old)); E.runHeadless(o); ok(!o.alive && isFinite(o.money) && !o.era920, 'bản lưu cũ (không cờ era920) chạy như trước');
  const e = E.createLife({ mode: 'world', country: 'JP', seed: 72, year: 1960 }); const t = JSON.parse(JSON.stringify(e)); E.runHeadless(t); ok(!t.alive && isFinite(t.money) && t.era920, 'đời có cờ era920 qua vòng JSON chạy hết');
}
console.log('PASS era920: ' + n + ' checks');
