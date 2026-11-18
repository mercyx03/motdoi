'use strict';
/* Sinh public/js/data-era920.js (số liệu quốc gia theo năm 1950–2023) từ các tệp CSV đã tải về.
   Dùng:  node tools/build-era-data920.js --src <thư mục chứa CSV> [--out public/js/data-era920.js] [--retrieved <ISO>]
   Không gọi mạng. Tệp nguồn (tải bằng curl, lưu SHA-256 trong tệp đầu ra) — xem docs/ERA-GIAI-DOAN-2-920.md:
     owid-life-expectancy.csv                              https://ourworldindata.org/grapher/life-expectancy.csv?v=1&csvType=full
     owid-children-per-woman-un.csv                        https://ourworldindata.org/grapher/children-per-woman-un.csv?v=1&csvType=full
     owid-child-mortality.csv                              https://ourworldindata.org/grapher/child-mortality.csv?v=1&csvType=full
     owid-share-of-population-urban.csv                    https://ourworldindata.org/grapher/share-of-population-urban.csv?v=1&csvType=full
     owid-gdp-per-capita-maddison-project-database.csv     https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database.csv?v=1&csvType=full
     owid-mobile-cellular-subscriptions-per-100-people.csv https://ourworldindata.org/grapher/mobile-cellular-subscriptions-per-100-people.csv?v=1&csvType=full
     owid-internet.csv                                     https://ourworldindata.org/grapher/share-of-individuals-using-the-internet.csv?v=1&csvType=full
     gm-entities.csv                                       https://raw.githubusercontent.com/open-numbers/ddf--gapminder--systema_globalis/master/ddf--entities--geo--country.csv (chỉ để đổi mã ISO3 sang ISO2) */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const root = path.join(__dirname, '..');
const SRC = arg('src'); if (!SRC) { console.error('thiếu --src'); process.exit(1); }
const OUT = arg('out', path.join(root, 'public', 'js', 'data-era920.js'));
const RETRIEVED = arg('retrieved', new Date().toISOString());
const { gameContext } = require(path.join(root, 'tests', 'hardcore-isolation'));
const G = gameContext(), CODES = G.W.C.map(c => c.code);
const Y0 = 1950, Y1 = 2023, N = Y1 - Y0 + 1;
const FILES = {
  le: ['owid-life-expectancy.csv', 'UN WPP 2024 (qua Our World in Data), tuổi thọ lúc sinh', 'https://ourworldindata.org/grapher/life-expectancy'],
  tfr: ['owid-children-per-woman-un.csv', 'UN WPP 2024 (qua Our World in Data), tổng tỷ suất sinh', 'https://ourworldindata.org/grapher/children-per-woman-un'],
  u5: ['owid-child-mortality.csv', 'UN IGME và Gapminder (qua Our World in Data), tử vong dưới 5 tuổi (%)', 'https://ourworldindata.org/grapher/child-mortality'],
  urb: ['owid-share-of-population-urban.csv', 'UN World Urbanization Prospects (qua Our World in Data), % dân số đô thị', 'https://ourworldindata.org/grapher/share-of-population-urban'],
  gdp: ['owid-gdp-per-capita-maddison-project-database.csv', 'Maddison Project Database 2023 (qua Our World in Data), GDP bình quân đầu người', 'https://ourworldindata.org/grapher/gdp-per-capita-maddison-project-database'],
  mob: ['owid-mobile-cellular-subscriptions-per-100-people.csv', 'ITU/World Bank WDI IT.CEL.SETS.P2 (qua Our World in Data), thuê bao di động trên 100 dân', 'https://ourworldindata.org/grapher/mobile-cellular-subscriptions-per-100-people'],
  fix: ['owid-fixed-telephone-subscriptions-per-100-people.csv', 'ITU/World Bank WDI IT.MLT.MAIN.P2 (qua Our World in Data), đường dây điện thoại cố định trên 100 dân', 'https://ourworldindata.org/grapher/fixed-telephone-subscriptions-per-100-people'],
  net: ['owid-internet.csv', 'ITU/World Bank WDI IT.NET.USER.ZS (qua Our World in Data), % dân số dùng internet', 'https://ourworldindata.org/grapher/share-of-individuals-using-the-internet']
};
function read(f) { return fs.readFileSync(path.join(SRC, f), 'utf8'); }
function csv(text) {
  return text.split(/\r?\n/).filter(Boolean).slice(1).map(ln => {
    const m = ln.match(/^("([^"]*)"|[^,]*),([^,]*),(\d+),([^,]*)/); if (!m) return null;
    return { code: m[3], year: +m[4], v: m[5] === '' ? null : +m[5] };
  }).filter(Boolean);
}
// ISO3 -> ISO2
const ent = read('gm-entities.csv').split(/\r?\n/).filter(Boolean), hd = ent[0].split(','), i2 = hd.indexOf('iso3166_1_alpha2'), i3 = hd.indexOf('iso3166_1_alpha3');
const to2 = {}; ent.slice(1).forEach(l => { const f = l.split(','); if (f[i3] && f[i2]) to2[f[i3].toUpperCase()] = f[i2].toUpperCase(); });
const raw = {}, sha = {};
Object.keys(FILES).forEach(k => {
  const t = read(FILES[k][0]); sha[k] = crypto.createHash('sha256').update(t).digest('hex');
  const m = {}; csv(t).forEach(r => { const c = to2[r.code]; if (c && r.v != null) (m[c] = m[c] || {})[r.year] = r.v; }); raw[k] = m;
});
// mảng N phần tử theo năm; khoảng trống bên trong được nội suy tuyến tính, hai đầu giữ nguyên giá trị biên (đánh dấu bằng first/last)
function grid(m, lo, hi) { const a = []; for (let y = Y0; y <= Y1; y++) a.push(m && m[y] != null ? m[y] : null); return a; }
function bounds(a) { let f = -1, l = -1; a.forEach((v, i) => { if (v != null) { if (f < 0) f = i; l = i; } }); return [f, l]; }
function fillGaps(a) {
  const [f, l] = bounds(a); if (f < 0) return a.slice();
  const o = a.slice();
  for (let i = f; i <= l; i++) if (o[i] == null) { let p = i - 1, n = i + 1; while (o[n] == null) n++; o[i] = o[p] + (o[n] - o[p]) * (i - p) / (n - p); }
  for (let i = 0; i < f; i++) o[i] = o[f]; for (let i = l + 1; i < N; i++) o[i] = o[l];
  return o;
}
const C = {}, stats = { u5Back: 0, gdpProxy: 0, gdpNone: 0, noMob: 0 };
// hồi quy bình phương tối thiểu: y = b0 + b1 x + b2 x^2
function fit2(xs, ys) {
  const n = xs.length; let s = [0, 0, 0, 0, 0], t = [0, 0, 0];
  for (let i = 0; i < n; i++) { const x = xs[i], y = ys[i]; s[0] += 1; s[1] += x; s[2] += x * x; s[3] += x * x * x; s[4] += x * x * x * x; t[0] += y; t[1] += x * y; t[2] += x * x * y; }
  const M = [[s[0], s[1], s[2], t[0]], [s[1], s[2], s[3], t[1]], [s[2], s[3], s[4], t[2]]];
  for (let i = 0; i < 3; i++) { let p = i; for (let r = i + 1; r < 3; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r; [M[i], M[p]] = [M[p], M[i]]; for (let r = i + 1; r < 3; r++) { const f = M[r][i] / M[i][i]; for (let c = i; c < 4; c++) M[r][c] -= f * M[i][c]; } }
  const b = [0, 0, 0]; for (let i = 2; i >= 0; i--) { let v = M[i][3]; for (let c = i + 1; c < 3; c++) v -= M[i][c] * b[c]; b[i] = v / M[i][i]; } return b;
}
const E0 = {}, U5 = {}, GD = {};
CODES.forEach(c => { E0[c] = fillGaps(grid(raw.le[c])); U5[c] = grid(raw.u5[c]); GD[c] = grid(raw.gdp[c]); });
// hồi quy ln(u5) theo tuổi thọ (chỉ dùng điểm có số liệu quan sát)
const ux = [], uy = []; CODES.forEach(c => U5[c].forEach((v, i) => { if (v != null && v > 0) { ux.push(E0[c][i]); uy.push(Math.log(v * 10)); } }));
const ub = fit2(ux, uy), uq = x => Math.exp(ub[0] + ub[1] * x + ub[2] * x * x);
// hồi quy ln(GDP tương đối so với năm cuối) theo chênh tuổi thọ so với năm cuối (cho nước/năm thiếu GDP)
const gx = [], gy = [];
const gdpLast = {}; CODES.forEach(c => { const a = fillGaps(GD[c]); const [f, l] = bounds(GD[c]); if (f >= 0) gdpLast[c] = a[l]; });
CODES.forEach(c => { if (gdpLast[c]) GD[c].forEach((v, i) => { if (v != null) { gx.push(E0[c][i] - E0[c][N - 1]); gy.push(Math.log(v / gdpLast[c])); } }); });
const gb = fit2(gx, gy), gq = d => Math.exp(gb[0] + gb[1] * d + gb[2] * d * d);
function enc(a, sc) { const q = a.map(v => Math.round(v * sc)); const o = [q[0]]; for (let i = 1; i < q.length; i++) o.push(q[i] - q[i - 1]); return o.join(','); }
const report = [];
CODES.forEach(c => {
  const e = E0[c], tfr = fillGaps(grid(raw.tfr[c])), urb = fillGaps(grid(raw.urb[c]));
  // u5 (trên 1000): quan sát nếu có; trước năm đầu tiên có số liệu thì ước từ tuổi thọ (đánh dấu u)
  let u = U5[c].map(v => v == null ? null : v * 10), [f, l] = bounds(u), uFrom = f < 0 ? null : Y0 + f;
  if (f < 0) { u = e.map(x => Math.min(400, uq(x))); stats.u5Back++; }
  else {
    u = fillGaps(u);
    if (f > 0) {
      const rs = []; for (let i = f; i < Math.min(N, f + 9); i++) rs.push(Math.log(u[i]) - Math.log(uq(e[i]))); rs.sort((x, y) => x - y); const off = rs[Math.floor(rs.length / 2)]; // trung vị phần dư của 9 năm đầu có số liệu (chống năm đột biến)
      for (let i = f - 1; i >= 0; i--) u[i] = Math.min(400, uq(e[i]) * Math.exp(off * Math.pow(0.5, (f - i) / 15))); // độ lệch riêng của nước nhạt dần (bán rã 15 năm) khi lùi xa khỏi số liệu quan sát
      stats.u5Back++;
    }
  }
  // GDP tương đối so với năm cuối quan sát (2022 trở đi = 1)
  let g, gFrom; const gl = GD[c]; const [gf, gl2] = bounds(gl);
  if (gf >= 0) {
    const a = fillGaps(gl), last = a[gl2]; g = a.map(v => v / last); gFrom = Y0 + gf;
    if (gf > 0) { const anchor = g[gf], eAt = e[gf] - e[N - 1], base = gq(eAt); for (let i = 0; i < gf; i++) g[i] = anchor * gq(e[i] - e[N - 1]) / base; stats.gdpProxy++; }
  } else { g = e.map(x => gq(x - e[N - 1])); gFrom = null; stats.gdpNone++; }
  const mob = (() => { const m = raw.mob[c]; if (!m) { stats.noMob++; return new Array(N).fill(0); } const a = grid(m); return fillGaps(a.map((v, i) => v == null && Y0 + i < 1980 ? 0 : v)).map(v => Math.max(0, v)); })();
  const fix = (() => { const m = raw.fix[c]; if (!m) return new Array(N).fill(0); return fillGaps(grid(m)).map(v => Math.max(0, v)); })(); // trước năm đầu có số liệu (1960–1980) giữ giá trị đầu tiên
  const net = (() => { const m = raw.net[c]; if (!m) return new Array(N).fill(0); const a = grid(m); return fillGaps(a.map((v, i) => v == null && Y0 + i < 1990 ? 0 : v)).map(v => Math.max(0, Math.min(100, v))); })();
  C[c] = { e: enc(e, 10), t: enc(tfr, 100), u: enc(u, 10), r: enc(urb, 1), g: enc(g, 1000), m: enc(mob, 10), p: enc(fix, 100), n: enc(net, 10), uf: uFrom, gf: gFrom };
  report.push(c + ' e0 1950=' + e[0].toFixed(1) + ' 2023=' + e[N - 1].toFixed(1) + ' tfr ' + tfr[0].toFixed(2) + '->' + tfr[N - 1].toFixed(2) + ' u5 ' + u[0].toFixed(0) + '->' + u[N - 1].toFixed(0) + ' uf=' + uFrom + ' gf=' + gFrom);
});
const data = {
  v: 1, from: Y0, to: Y1, retrieved: RETRIEVED,
  src: Object.keys(FILES).reduce((o, k) => { o[k] = { name: FILES[k][1], url: FILES[k][2], file: FILES[k][0], sha256: sha[k] }; return o; }, {}),
  sc: { e: 10, t: 100, u: 10, r: 1, g: 1000, m: 10, p: 100, n: 10 },
  fit: { u5ln: ub.map(v => +v.toFixed(6)), gdpLn: gb.map(v => +v.toFixed(6)) },
  c: C
};
const head = '/* 9.2.0: số liệu quốc gia theo năm ' + Y0 + '–' + Y1 + ' cho chế độ chọn năm sinh (era920.js). SINH TỰ ĐỘNG bởi tools/build-era-data920.js — không sửa tay.\n' +
  '   Nguồn (giấy phép CC BY 4.0 / CC BY 3.0 IGO, tải ngày ' + RETRIEVED + '): ' + Object.keys(FILES).map(k => FILES[k][1]).join('; ') + '.\n' +
  '   Mỗi chuỗi là số nguyên nhân hệ số sc, ghi dạng giá trị đầu rồi các hiệu liên tiếp. uf = năm đầu tiên có số liệu tử vong trẻ em quan sát (trước đó là ước tính từ tuổi thọ); gf = năm đầu có GDP quan sát (null: ước hoàn toàn từ tuổi thọ). */\n';
fs.writeFileSync(OUT, head + '(function(G){\'use strict\';G.ERA920_DATA=' + JSON.stringify(data) + ';})(typeof window!==\'undefined\'?(window.G=window.G||{}):(globalThis.G=globalThis.G||{}));\n');
fs.writeFileSync(path.join(root, 'docs', 'era-data920-report.txt'), report.join('\n') + '\n');
console.log('countries', CODES.length, 'bytes', fs.statSync(OUT).size, JSON.stringify(stats), 'u5fit', ub.map(v => v.toFixed(4)).join(' '), 'gdpfit', gb.map(v => v.toFixed(4)).join(' '));
