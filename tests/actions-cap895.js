'use strict';
// Hết lượt trong năm: trình chọn việc không được mở ra rồi kẹt (không chọn được, không đóng được).
const assert=require('assert'),{game}=require('./hardcore-isolation'),{year}=require('./lib/quick'),E=game();
const CAP='Đã hết lượt năm nay';
function life(age=8){const l=E.createLife({mode:'vn',seed:89501});l.age=age;l.pending=[];l.acts=0;l.money=l.base*100;l.flags.actAt={};l.alive=true;return l;}
function stats(l){return JSON.stringify([l.st,l.money,l.skill,l.karma]);}
function exit(d){return d.opts.some(o=>/^(cancel|back|close)$/.test(o.k));}
assert.equal(E.actsLimit(life()),3);
const noExit=E.DEC.doc_sach&&E.DEC.doc_sach.make(life(),()=>.5);assert(noExit&&!exit(noExit),'fixture: reading card has no cancel option');

// 1. Còn lượt: mở và chọn bình thường, tốn đúng một lượt.
let l=life();let d=E.act(l,'doc_sach');assert(d&&l.pending[0]===d);E.resolve(l,'read');assert.equal(l.acts,1);assert.equal(l.pending.length,0);

// 2. Hết lượt: không mở được bằng thao tác thông thường; danh sách hiển thị lý do, hàng chờ và lượt giữ nguyên.
l=life();l.acts=3;const before=stats(l);
assert.equal(E.act(l,'doc_sach'),null);assert.equal(l.pending.length,0);assert.equal(l.acts,3);assert.equal(stats(l),before);
const rows=E.actions(l);assert(rows.every(a=>a.ok!==true),'every action chip disabled at the cap');assert.equal(rows.find(a=>a.id==='doc_sach').ok,CAP);
assert.equal(E.actAvail(l,E.ACT.find(a=>a.id==='doc_sach')),true,'AI availability (actAvail) is unchanged');
// Người lớn không giới hạn lượt.
l=life(20);l.acts=50;assert(E.act(l,'doc_sach')||E.actions(l).some(a=>a.ok===true),'adults keep unlimited actions');

// 3. Bấm liên tiếp ngay lúc vừa hết lượt: chỉ một thẻ, các lần sau bị từ chối.
l=life();l.acts=2;assert(E.act(l,'doc_sach'));E.resolve(l,'read');assert.equal(l.acts,3);
for(let i=0;i<5;i++)assert.equal(E.act(l,'doc_sach'),null);assert.equal(l.pending.length,0);

// 4. Lượt hết khi thẻ đang mở (mở lồng nhau): thẻ không có nút thoát được rút lại, không áp dụng tác dụng, không tốn lượt.
l=life();l.acts=2;const outer=E.act(l,'doc_sach');const inner=E.act(l,'cong_vien');assert(outer&&inner&&l.pending[0]===inner);
E.resolve(l,inner.opts[0].k);assert.equal(l.acts,3);assert.equal(l.pending[0],outer);
let snap=stats(l);let out=E.resolve(l,'read');assert.equal(l.acts,3);assert.equal(stats(l),snap,'no effect applied');assert.equal(l.pending.length,0,'blocked card withdrawn');assert(out.some(e=>e.t.includes(CAP)));
// Cùng tình huống, đường giao diện (showDecision) gọi dropBlocked: chỉ rút thẻ tự chọn, giữ sự kiện bắt buộc phía sau.
l=life();l.acts=2;E.act(l,'doc_sach');l.acts=3;const story=E.DEC.chung_chi_het_han.make(l,()=>.5,{k:'en'});l.pending.push(story);
let gone=E.ACTIONS894.dropBlocked(l);assert.equal(gone.length,1);assert.equal(gone[0].id,'doc_sach');assert.deepEqual(l.pending,[story],'mandatory event preserved');
assert.equal(E.ACTIONS894.dropBlocked(l).length,0,'mandatory events never dropped');
// Thẻ có nút "Để dịp khác" vẫn giữ để người chơi tự đóng (hành vi cũ).
l=life(12);l.friends=[{name:'Bình',alive:true,close:60,loc:'HOME'}];E.act(l,'hen_ban_than');E.resolve(l,'0');l.acts=7;E.resolve(l,'0');assert.equal(l.pending[0].id,'friend894');assert.equal(l.friends[0].close,60);
assert(!E.ACTIONS894.blocked(l,l.pending[0]));E.resolve(l,'cancel');assert.equal(l.pending.length,0);assert.equal(l.acts,7);

// 5/6. Sang năm sau lượt được làm mới, tuổi tăng đúng một và mở việc lại bình thường.
l=life();l.acts=3;const age=l.age;year(E,l);assert.equal(l.age,age+1);assert.equal(l.acts,0);assert(E.act(l,'doc_sach'),'next year actions open again');

// 7. Lựa chọn bắt buộc không có token: hết lượt vẫn chọn được, không bị tính lượt.
l=life(20);l.lang={en:2};l.langAt={en:18};l.langExp={en:false};l.acts=99;l.pending=[E.DEC.chung_chi_het_han.make(l,()=>.5,{k:'en'})];E.resolve(l,'retest');assert.equal(l.acts,99);assert.equal(l.langAt.en,20);

// 8. Bản lưu cũ đang kẹt thẻ: nạp lại thì thẻ được rút, lượt/tiền/sự kiện bắt buộc giữ nguyên.
l=life();l.acts=2;E.act(l,'doc_sach');l.acts=3;l.pending.push(E.DEC.chung_chi_het_han.make(l,()=>.5,{k:'en'}));const money=l.money;
l=E.migrate(JSON.parse(JSON.stringify(l)));assert.equal(l.acts,3);assert.equal(l.money,money);assert.deepEqual(l.pending.map(x=>x.id),['chung_chi_het_han']);
// Bản lưu đang mở thẻ còn lượt thì giữ nguyên.
l=life();E.act(l,'doc_sach');l=E.migrate(JSON.parse(JSON.stringify(l)));assert.equal(l.pending[0].id,'doc_sach');E.resolve(l,'read');assert.equal(l.acts,1);
console.log('PASS actions-cap895: cap blocks opening, rapid clicks, mid-dialog cap withdrawal, mandatory events kept, next year, old saves');
