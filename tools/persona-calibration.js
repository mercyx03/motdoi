/* Một Đời — đối chiếu mô phỏng với Nemotron-Personas-Vietnam (v6.8.0)
   So tỉ lệ học vấn và tình trạng hôn nhân theo nhóm tuổi của các đời Việt Nam trong game
   với số liệu tổng hợp trong public/js/data-personas-vn.js, ghi kết quả ra docs/persona-calibration.md.
   Chạy: node tools/persona-calibration.js [số đời, mặc định 600] */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), PUB = path.join(ROOT, 'public');
const ctx = { console, Math, Date, JSON }; ctx.globalThis = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
[...html.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]).filter(f => !/app\.js|music\.js|card\.js|scene2d\.js|scene\.js/.test(f)).forEach(f => vm.runInContext(fs.readFileSync(path.join(PUB, f), 'utf8'), ctx, { filename: f }));
const G = ctx.G, E = G.E, PV = G.PERSONAS_VN, N = +process.argv[2] || 600;
const BANDS = [['y', '18–29', 18, 29], ['m', '30–44', 30, 44], ['o', '45–59', 45, 59], ['s', '60+', 60, 200]];
const EDU = ['Không có học vấn', 'Tiểu học', 'Trung học cơ sở', 'Trung học phổ thông', 'Trung cấp / Cao đẳng', 'Đại học', 'Sau đại học', 'Sau đại học'];
const MAR = ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa'];
function bandOf(a) { return BANDS.find(b => a >= b[2] && a <= b[3]); }
function marital(l) { if (l.partner && l.partner.alive !== false && l.partner.status !== 'dating') return 'Đã kết hôn'; if ((l.widowed || 0) > 0) return 'Góa'; if ((l.flags.divorced || l.flags.divorce || 0) || /ly hôn/i.test((l.log || []).slice(-200).map(e => e.t).join(' '))) return 'Ly hôn'; return 'Độc thân'; }
function pct(o, keys) { const t = keys.reduce((s, k) => s + (o[k] || 0), 0) || 1; const r = {}; keys.forEach(k => r[k] = (o[k] || 0) / t * 100); return r; }
const game = { edu: {}, mar: {} };
for (let i = 0; i < N; i++) {
  const l = E.createLife({ mode: 'vn', seed: 880000 + i * 13 });
  E.runHeadless(l, x => { if (x.age < 18 || x.age % 3) return; const b = bandOf(x.age); if (!b) return; const e = game.edu[b[0]] || (game.edu[b[0]] = {}), m = game.mar[b[0]] || (game.mar[b[0]] = {}); const ek = EDU[Math.max(0, Math.min(7, x.edu || 0))]; e[ek] = (e[ek] || 0) + 1; const mk = marital(x); m[mk] = (m[mk] || 0) + 1; });
}
const data = { edu: {}, mar: {} };
Object.keys(PV.edu || {}).forEach(k => { const b = k.split('_')[1], o = data.edu[b] || (data.edu[b] = {}); Object.keys(PV.edu[k]).forEach(x => o[x] = (o[x] || 0) + PV.edu[k][x]); });
Object.keys(PV.marital || {}).forEach(k => { const b = k.split('_')[1], o = data.mar[b] || (data.mar[b] = {}); Object.keys(PV.marital[k]).forEach(x => o[x] = (o[x] || 0) + PV.marital[k][x]); });
const EK = [...new Set(EDU)], lines = [], gaps = [];
lines.push('# Đối chiếu mô phỏng với Nemotron-Personas-Vietnam', '', 'Tạo bằng `node tools/persona-calibration.js` ngày ' + new Date().toISOString().slice(0, 10) + '. Game: ' + N + ' đời Việt Nam, lấy mẫu mỗi 3 năm từ 18 tuổi. Dữ liệu: ' + PV.sampled + ' persona (NVIDIA & FPT, CC BY 4.0).', '');
function table(title, keys, g, d) {
  lines.push('## ' + title, '', '| Nhóm tuổi | ' + keys.join(' | ') + ' |', '|---|' + keys.map(() => '---').join('|') + '|');
  BANDS.forEach(b => { const gp = pct(g[b[0]] || {}, keys), dp = pct(d[b[0]] || {}, keys); lines.push('| ' + b[1] + ' | ' + keys.map(k => Math.round(gp[k]) + '% / ' + Math.round(dp[k]) + '%').join(' | ') + ' |'); keys.forEach(k => { const diff = gp[k] - dp[k]; if (Math.abs(diff) >= 15) gaps.push(title + ', ' + b[1] + ', ' + k + ': game ' + Math.round(gp[k]) + '% so với dữ liệu ' + Math.round(dp[k]) + '%'); }); });
  lines.push('', '(mỗi ô: game / dữ liệu)', '');
}
table('Học vấn', EK, game.edu, data.edu);
table('Tình trạng hôn nhân', MAR, game.mar, data.mar);
lines.push('## Chênh lệch từ 15 điểm phần trăm trở lên', '', gaps.length ? gaps.map(g => '- ' + g).join('\n') : '- Không có.', '', 'Lưu ý: bộ dữ liệu là persona tổng hợp chỉ từ 18 tuổi, game là mô phỏng nhiều thế hệ trong tương lai (sinh từ 2026), nên một số chênh lệch là hợp lý (ví dụ thế hệ sau học cao hơn).');
fs.writeFileSync(path.join(ROOT, 'docs', 'persona-calibration.md'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
