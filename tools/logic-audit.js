/* Một Đời — rà soát lỗi logic trên nhiều đời mô phỏng (v7.0.0)
   Chạy: node tools/logic-audit.js [số đời, mặc định 1500]. In ra từng loại lỗi kèm ví dụ. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const PUB = path.join(__dirname, '..', 'public');
const ctx = { console, Math, Date, JSON, TextEncoder, TextDecoder }; ctx.globalThis = ctx; vm.createContext(ctx);
const html = fs.readFileSync(path.join(PUB, 'index.html'), 'utf8');
[...html.matchAll(/<script src="(js\/[^"?]+)/g)].map(m => m[1]).filter(f => !/app\.js|music\.js|card\.js|scene2d\.js|scene\.js|account\.js/.test(f)).forEach(f => vm.runInContext(fs.readFileSync(path.join(PUB, f), 'utf8'), ctx, { filename: f }));
const E = ctx.G.E, N = +process.argv[2] || 1500, issues = {};
function add(k, ex) { const o = issues[k] || (issues[k] = { n: 0, ex: [] }); o.n++; if (o.ex.length < 4) o.ex.push(ex); }
for (let i = 0; i < N; i++) {
  const l = E.createLife({ mode: i % 3 ? 'vn' : 'world', seed: 700000 + i * 7 });
  const snap = {};
  E.runHeadless(l, x => { snap[x.age] = { p: x.partner ? { n: x.partner.name, s: x.partner.status, a: x.partner.alive !== false } : null, kids: (x.kids || []).length, kidsAlive: (x.kids || []).filter(k => k.alive !== false).length, job: x.job ? x.job.id : null, school: x.school, m: x.fam.mAlive, f: x.fam.fAlive && !x.fam.noDad, indep: x.indep, jail: x.jailUntil != null && x.age < x.jailUntil, money: x.money, base: x.base, retired: x.retired, abroad: !!x.abroad }; });
  const tag = (e) => i + '@' + e.a + ': ' + String(e.t).slice(0, 140);
  const d = l.death ? l.death.age : 999;
  l.log.forEach(e => {
    const t = String(e.t || ''), a = e.a, s = snap[a] || snap[a - 1] || {};
    if (a > d) add('Sự kiện sau khi đã mất', tag(e));
    if (a < 18 && /(Tổ chức đám cưới|Kết hôn với|Đăng ký kết hôn)/.test(t)) add('Kết hôn trước 18 tuổi', tag(e));
    if (a < 15 && /Bắt đầu công việc mới/.test(t)) add('Đi làm chính thức trước 15 tuổi', tag(e));
    if (a < 45 && /(Nghỉ hưu|nhận lương hưu|Về hưu)/.test(t) && !/(Bố|Mẹ|bố|mẹ|ông|bà|chồng|vợ|con|bạn đời|người ấy)/.test(t)) add('Nghỉ hưu quá sớm', tag(e));
    if (a >= 1 && /^(Mẹ|Bố) (mua|nấu|dặn|ôm|cho|chở|đưa|đón|khen|mắng|gọi)/.test(t) && ((/^Mẹ/.test(t) && s.m === false && (snap[a - 1] || {}).m === false) || (/^Bố/.test(t) && s.f === false && (snap[a - 1] || {}).f === false))) add('Nhắc bố / mẹ đã mất như còn sống', tag(e));
    if (/^Con [A-ZĐ]/.test(t) && s.kids === 0 && (snap[a - 1] || {}).kids === 0) add('Nhắc con khi chưa có con', tag(e));
    if (s.p && !s.p.a && (snap[a - 1] || {}).p && !(snap[a - 1] || {}).p.a && t.indexOf(s.p.n) >= 0 && !/(qua đời|mất|tưởng nhớ|nhớ|giỗ|mộ|di ảnh|ngày xưa|ra đi|vắng|thương nhớ|kỷ niệm)/.test(t)) add('Nhắc bạn đời đã mất như còn sống', tag(e));
    if (s.jail && (snap[a - 1] || {}).jail && /(Bắt đầu công việc mới|đi du lịch|Chuyến đi|Tổ chức đám cưới|mua (nhà|xe|ô tô))/.test(t)) add('Làm việc tự do khi đang ở tù', tag(e));
    if (a < 6 && /(cả lớp|bài kiểm tra|giờ ra chơi|thầy giáo|bạn cùng bàn)/.test(t) && !/mẫu giáo|nhà trẻ/.test(t)) add('Chuyện trường lớp trước tuổi đi học', tag(e));
    if (/^Bắt đầu hẹn hò với/.test(t) && (snap[a - 1] || {}).p && (snap[a - 1] || {}).p.s === 'married' && (snap[a - 1] || {}).p.a && t.indexOf((snap[a - 1] || {}).p.n) < 0) add('Hẹn hò người khác khi đang có vợ / chồng', tag(e));
    if (a > 27 && /(Nhập ngũ|nhập ngũ, |Lên đường nhập ngũ|đi nghĩa vụ quân sự)/.test(t) && !/(con|cháu|bạn|anh|em|chị)/.test(t)) add('Nhập ngũ quá tuổi', tag(e));
    if (a < 18 && /(bằng lái ô tô|bằng B2|bằng B1|bằng lái xe ô tô|mua (căn hộ|nhà|ô tô))/.test(t) && !/(bố|mẹ|ông|bà|anh|chị)/i.test(t)) add('Việc của người lớn khi chưa 18', tag(e));
    if (/Tốt nghiệp đại học/.test(t) && a < 19) add('Tốt nghiệp đại học quá sớm', tag(e));
    if (/(Bố|Mẹ) qua đời ở tuổi (d+)/.test(t) && +RegExp.$2 > 112) add('Bố mẹ sống quá lâu', tag(e));
    if (/lương hưu/.test(t) && a < 50 && !/(bố|mẹ|Bố|Mẹ|ông|bà|vợ|chồng|BHXH|đóng|đủ 15 năm|sẽ có)/.test(t)) add('Nhận lương hưu khi còn trẻ', tag(e));
    if (/undefined|NaN|\[object|null(?![\p{L}])/u.test(t)) add('Lời kể lỗi dữ liệu', tag(e));
    if (/  |\s[,.]|\.\.(?!\.)/.test(t) && !/…/.test(t)) add('Dấu câu / khoảng trắng thừa', tag(e));
  });
  // sinh con ngoài độ tuổi hợp lý (không tính con nuôi)
  (l.kids || []).forEach(k => { if (!k.adopted && (k.born < 15 || (l.sex === 'F' && k.born > 52))) add('Sinh con ngoài độ tuổi hợp lý', i + ': mẹ/bố ' + l.sex + ' sinh lúc ' + k.born + ' tuổi'); });
  if ((l.grand || 0) > 0 && (l.kids || []).length && Math.max(...l.kids.map(k => d - k.born)) < 15) add('Có cháu khi con còn quá nhỏ', i + ': con lớn nhất ' + Math.max(...l.kids.map(k => d - k.born)) + ' tuổi, cháu ' + l.grand);
  if (!isFinite(l.money) || l.money < -500 * l.base) add('Tiền âm vô lý', i + ': ' + (l.money / l.base).toFixed(0) + ' lần thu nhập cơ sở');
  if (l.partner && l.partner.status !== 'dating' && l.partner.alive !== false && l.partner.age < 18 && d >= 18) add('Bạn đời dưới 18 tuổi', i + ': ' + l.partner.age);
  if ((l.kids || []).some(k => k.died != null && k.died < k.born)) add('Con mất trước khi sinh', i + '');
  (l.pets || []).forEach(p => { if (p.alive && d - p.since > 30) add('Thú cưng sống quá lâu', i + ': ' + p.k + ' ' + (d - p.since) + ' năm'); });
  if ((l.kids || []).length > 12) add('Quá nhiều con', i + ': ' + l.kids.length);
}
const keys = Object.keys(issues).sort((a, b) => issues[b].n - issues[a].n);
console.log('Rà soát ' + N + ' đời — ' + keys.length + ' loại vấn đề');
keys.forEach(k => { console.log('\n■ ' + k + ' (' + issues[k].n + ')'); issues[k].ex.forEach(x => console.log('   ' + x)); });
