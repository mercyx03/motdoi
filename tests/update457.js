'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert');
const root = path.join(__dirname, '..', 'public'), html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [, f] of html.matchAll(/<script src="(js\/[^"?]+)\?v=[^"]+"[^>]*><\/script>/g)) if (!['js/app.js', 'js/music.js', 'js/card.js', 'js/account.js'].includes(f)) vm.runInThisContext(fs.readFileSync(path.join(root, f), 'utf8'), { filename: f });
const E = G.E; let n = 0; const ok = (x, t) => { assert.ok(x, t); n++; };
const r = () => .1;
function life(age = 18) { const l = E.createLife({ mode: 'vn', seed: 45701, gender: 'M' }); l.age = age; l.st.hea = 100; l.ill = null; l.pending = []; l.school = null; l.job = null; l.abroad = null; l.edu = 4; l.money = 100; return l; }
function apply(l, id, k, arg, random = r) { const d = E.DEC[id].make(l, random, arg), logs = []; E.DEC[id].apply(l, d, k, random, (t, k) => logs.push({ t, k })); return { d, logs }; }
{
  const l = life(); ok(E.canServe(l), 'có thể nhập ngũ lần đầu');
  apply(l, 'uni', 'military'); ok(l.flags.military === 20 && l.flags.milDone, 'nhập ngũ đủ hai năm');
  const initial = l.pending.map(d => d.id); ok(initial.join(',') === 'nv_tan_binh,nv_don_vi', 'tân binh trước phân đơn vị');
  E.resolve(l, 'gang'); E.resolve(l, 'bo_binh');
  l.pending = []; l.age = 19; E.beginYear(l, {}); const ids = l.pending.map(d => d.id);
  ok(ids.length === 3 && !ids.includes('nv_tan_binh') && !ids.includes('nv_don_vi'), 'năm hai có chuyện mới, không huấn luyện lại');
  while(l.pending.length) E.resolve(l, E.autoKey(l));
  E.beginYear(l, {}); ok(l.pending.length === 0, 'mở lại năm quân ngũ không xếp lại cùng sự kiện');
  l.age = 20; E.beginYear(l, {}); ok(l.pending.length === 1 && l.pending[0].id === 'nv_xuat_ngu', 'đủ thời hạn chỉ xếp lựa chọn ra quân trước');
  const money = l.money, d = l.pending[0]; E.resolve(l, 've'); const after = l.money;
  ok(after > money && l.flags.military === null && l.flags.milReleasedAt === 20 && l.flags.milVet, 'ra quân mở khóa ngay và trả trợ cấp');
  E.DEC.nv_xuat_ngu.apply(l, d, 've', r, () => {}); ok(l.money === after, 'không nhận lại trợ cấp với cảnh cũ');
  ok(!E.DEC.uni.make(l, r).opts.some(o => o.k === 'military'), 'không mời nhập ngũ lại sau phục vụ');
  const deadline = l.flags.military; apply(l, 'uni', 'military'); ok(l.flags.military === deadline && l.money === after, 'chặn cả lựa chọn cũ quay lại nhập ngũ');
}
{
  const l = life(); l.flags.military = 20; l.flags.milDone = true; E.beginYear(l, {});
  ok(l.pending.length === 4 && l.pending[0].id === 'nv_tan_binh' && l.pending[1].id === 'nv_don_vi', 'đủ 4 lựa chọn năm đầu, không mất sự kiện thứ tư');
  const all = []; while(l.pending.length) { all.push(l.pending[0].id); E.resolve(l, E.autoKey(l)); }
  l.age = 19; E.beginYear(l, {}); while(l.pending.length) { all.push(l.pending[0].id); E.resolve(l, E.autoKey(l)); }
  ok(new Set(all).size === all.length, 'các chuyện quân ngũ khác nhau giữa hai năm');
  l.age = 22; E.beginYear(l, {}); ok(l.pending[0].id === 'nv_xuat_ngu', 'save cũ vượt mốc vẫn được ra quân');
}
for (const kind of ['vet', 'log', 'jail', 'army', 'police', 'ill', 'young', 'old']) {
  const l = life(); if(kind === 'vet')l.flags.milVet = true;
  if(kind === 'log')l.log.push({a:18,t:'Lên đường nhập ngũ, thực hiện nghĩa vụ quân sự.'});
  if(kind === 'jail')l.jailUntil = 20;
  if(kind === 'army')l.job = {id:'quan_doi',rank:0};
  if(kind === 'police')l.job = {id:'cong_an',rank:0};
  if(kind === 'ill')l.st.hea = 20;
  if(kind === 'young')l.age = 16;
  if(kind === 'old')l.age = 40;
  ok(!E.canServe(l), 'không gọi nhập ngũ sai hoàn cảnh: ' + kind);
}
{
  const l = life(20); l.flags.military = 20; l.flags.milVet = true; const money = l.money;
  ok(!E.DEC.nv_xuat_ngu.valid(l, {}), 'save cũ đã nhận trợ cấp không được nhận lại');
  E.beginYear(l, {}); ok(!l.flags.military && l.money === money && !l.pending.some(d=>d.id==='nv_xuat_ngu'), 'khôi phục save cũ đã ra quân, không phát lại trợ cấp');
}
{
  const l = life(); l.flags.military = 20; l.fam.mAlive = l.fam.fAlive = false; l.fam.noDad = true; l.sibList = [];
  const text = E.DEC.nv_thu_nha.make(l, r).text, logs = apply(l, 'nv_thu_nha', 'vung').logs;
  ok(!/Mẹ|mẹ|bố/.test(text + JSON.stringify(logs)), 'bố mẹ đã mất không gửi thư / quà');
  l.money = 0; apply(l, 'nv_phep', 'nha'); ok(l.money === 0, 'không tiêu âm tiền tàu xe');
  const d = E.DEC.nv_ban_dan.make(l, r); l.flags.military = null; l.pending = [d]; const hp = l.st.hea; E.resolve(l, d.opts[0].k);
  ok(!l.pending.length && l.st.hea === hp, 'bỏ cảnh huấn luyện cũ sau khi ra quân');
}
{
  const l = life(30); l.flags.milDone = true;
  E.SC('audit_later', {title:'Lịch hẹn', text:'Kiểm tra',opts:[{k:'ok',l:'Được',run:()=>{}}]});
  E.SC('audit_b', {title:'Lịch hẹn khác', text:'Kiểm tra',opts:[{k:'ok',l:'Được',run:()=>{}}]});
  E.SC('audit_c', {title:'Lịch hẹn thứ ba', text:'Kiểm tra',opts:[{k:'ok',l:'Được',run:()=>{}}]});
  E.SC('audit_d', {title:'Lịch hẹn thứ tư', text:'Kiểm tra',opts:[{k:'ok',l:'Được',run:()=>{}}]});
  l.sched = ['audit_later','audit_later','audit_b','audit_c','audit_d'].map(id=>({id,at:30}));
  E.beginYear(l, {}); ok(l.pending.filter(d=>d.id==='audit_later').length===1, 'không xếp hai lịch hẹn giống nhau');
  ok(l.sched.some(s=>s.id==='audit_d'), 'lịch hẹn quá số ô được giữ cho năm sau');
}
{
  const l = life(60), seen = new Set(); for(let a=60;a<80;a++) {const t=E.quietYear(l,a,r);ok(!l.log.some(x=>x.a>=a-12&&x.t===t),'câu năm yên bình không lặp trong 12 năm');seen.add(t);l.log.push({a,t});} ok(seen.size >= 16,'đa dạng câu năm bình thường');
}
{
  const ev = E.EVENTS.find(x => x.run.toString().includes("'nv_lenh_goi'")); ok(!!ev, 'lời gọi khám tuyển thay nhập ngũ tự động cuối năm');
  const l = life(); ev.run(l,18,r,()=>{}); ok(!l.flags.military && l.sched.some(s=>s.id==='nv_lenh_goi'&&s.at===19) && !ev.c(l,19), 'không mất năm phục vụ, không gọi liên tục');
}
console.log('PASS: ' + n + ' kiểm tra quân ngũ, sự kiện cũ và chống lặp bản 4.5.7.');
