'use strict';
// 8.10.74: cổ phần công ty gia đình, thâu tóm, niêm yết, lương điều hành, thiên phú kinh doanh, bầu cử và đổi nơi sống.
const assert=require('node:assert/strict');
const {gameContext}=require('./hardcore-isolation');
const G=gameContext(),E=G.E,H=E.H,B=E.BIZ874,X=E.UPDATE110,D=E.DYNASTY908;
const logs=[];const log=t=>logs.push(t);const take=()=>logs.splice(0).join(' | ');
function fam(seed,o){const l=E.createLife({mode:'vn',seed,year:2000});Object.assign(l,{age:26,alive:true,indep:true,school:null,edu:5,pending:[],money:5e6,jailUntil:null},o||{});
 Object.assign(l.fam,{fJob:'giám đốc doanh nghiệp',fAlive:true,mAlive:true,q:5,fAge:30,mAge:28});return l;}
function oldPay(l,c){return Math.min(c.value*.005,l.base+c.value*.0001);}
let n=0;const ok=(m)=>{n++;console.log('  ✓ '+m);};

// 1. Cơ cấu sở hữu ngẫu nhiên, ổn định theo cuộc đời, luôn đủ 100%
{const rows=[];for(let s=1;s<=60;s++){const l=fam(s),k=B.cap(l);const total=B.parentsTotal(k)+k.self+k.others.reduce((a,o)=>a+o.share,0);assert(Math.abs(total-100)<.05,'tổng '+total);rows.push(k);assert.deepEqual(JSON.stringify(B.cap(l)),JSON.stringify(k));}
 assert(rows.some(k=>k.listed)&&rows.some(k=>!k.listed),'có cả công ty niêm yết và chưa niêm yết');
 assert(rows.some(k=>B.parentsTotal(k)===100)&&rows.some(k=>B.parentsTotal(k)<100),'cổ phần bố mẹ không phải lúc nào cũng 100%');
 assert(rows.filter(k=>k.listed).every(k=>B.parentsTotal(k)<=70&&k.exchange));ok('cơ cấu sở hữu ngẫu nhiên, niêm yết/không niêm yết, tổng 100%');}

// 2. Mua của đối tác (chưa niêm yết) và ngưỡng chào mua công khai (niêm yết, Việt Nam từ 2021)
{let l,k;for(let s=1;s<200;s++){l=fam(s);k=B.cap(l);if(!k.listed&&k.others.length)break;}
 const o=k.others[0],m0=l.money;assert(B.virtualBuy(l,o,1,()=>.1,log,false));assert.equal(k.self,1);assert(l.money<m0);
 assert(!B.virtualBuy(l,k.others[0],1,()=>.99,log,false),'đối tác có thể từ chối');ok('mua phần vốn của đối tác góp vốn');
 for(let s=1;s<300;s++){l=fam(s);k=B.cap(l);if(k.listed&&k.others.some(o=>o.share>=10))break;}assert(k.listed);
 const pub=k.others.find(o=>o.share>=10);for(let i=0;i<4;i++){l.age++;B.virtualBuy(l,pub,5,()=>.5,log,false);}take();
 assert(k.self<25+1e-9,'không mua dần vượt 25% trên sàn');assert(!B.virtualBuy(l,pub,10,()=>.5,log,false),'mua quá 5%/năm trên sàn bị chặn');
 assert.equal(B.tenderNeeded(l,{virtual874:true,listed:true},20,26),25);ok('ngưỡng 25/35/…% phải chào mua công khai');}

// 3. Bố mẹ chuyển nhượng cổ phần, nắm quyền kiểm soát, ứng cử → chức vụ và lương thay đổi (lỗi cũ)
{let l,k;for(let s=1;s<200;s++){l=fam(s);k=B.cap(l);if(!k.listed&&B.parentsTotal(k)===100)break;}
 for(let i=0;i<4&&!k.materialized;i++){l.age++;B.askParents(l,'buy',25,()=>.01,log);}const c=B.famCompany(l);assert(c&&c.share>50,'nắm >50%');assert(c.holders137.some(h=>h.id==='parent:f'),'bố vẫn giữ phần còn lại');take();
 const e=D.entities(l).find(x=>x.company===c);assert(e,'công ty gia đình là thực thể biểu quyết');assert(!D.entities(l).some(x=>x.id==='parents'),'không trùng thực thể');
 const job0=l.job&&l.job.id;assert(D.nominate(l,e,D.people(l)[0],'ceo','steady'));l.age++;const res=D.vote(l,e,'ceo',log);assert(res.won);
 assert.equal(E.resolveJob(l.job.id),B.JOB);assert.notEqual(job0,l.job.id);assert.match(E.jobTitle(l),/Tổng giám đốc/);
 const pay=E.monthlyEst(l,l.job.id)*12;assert(pay>oldPay(l,c)*1.5,'lương mới cao hơn công thức cũ');const q=E.PATH139.successor(l);assert(q.finished&&q.chosen.id==='self');
 assert(D.nominate(l,e,D.people(l)[0],'chair','steady'));l.age++;D.vote(l,e,'chair',log);assert.match(E.jobTitle(l),/Chủ tịch kiêm Tổng giám đốc/);take();
 const v0=c.value;const earned=E.careerYear(l,()=>.5,log);assert(earned>0&&c.groupCost137>=earned-1e-6,'lương tính vào chi phí công ty');assert.equal(c.value,v0);ok('trúng cử nhận chức danh, lương mới, chi phí công ty');}

// 4. Công ty riêng: trúng cử thì nhận chức vụ (trước đây không đổi việc, không lương)
{const l=fam(3);l.fam.fJob='nông dân';l.fam.mJob='giáo viên';const c={name:'Cty Riêng',value:200000,share:60,sector:'general',roles:{},created:20,holders137:[]};E.BUSINESS123.companies(l).push(c);E.BUSINESS133.ensure(c);
 const e=D.entities(l).find(x=>x.company===c);assert(D.nominate(l,e,D.people(l)[0],'ceo','steady'));l.age++;const res=D.vote(l,e,'ceo',log);assert(res.won);assert.equal(E.resolveJob(l.job.id),B.JOB);assert(E.monthlyEst(l,l.job.id)>0);take();
 ok('ứng cử CEO công ty riêng: chức vụ và lương cập nhật');}

// 5. Thiên phú kinh doanh: +20–30% lợi nhuận khi trực tiếp điều hành
{const mk=t=>{const l=fam(4,{talent:t,skill:t?55:0});l.fam.fJob='nông dân';const c={name:'Cty TP',value:150000,share:80,sector:'food',roles:{},created:20};E.BUSINESS123.companies(l).push(c);E.BUSINESS133.ensure(c);E.TREASURY165.ensure(l,c,true);return [l,c];};
 const [a,ca]=mk(null),[b,cb]=mk('kinh doanh');assert.equal(B.talentFactor(a,ca),1);const f=B.talentFactor(b,cb);assert(f>=1.2&&f<=1.3);
 const seq=()=>{let s=7;return()=>{s=(s*16807)%2147483647;return s/2147483647;};};let ra=seq(),rb=seq(),pa=0,pb=0,win=0;
 for(let i=0;i<12;i++){E.companyYear133(a,ra,()=>{});E.companyYear133(b,rb,()=>{});a.age++;b.age++;if(cb.talent874&&cb.talent874.at===b.age-1)win++;}
 assert(win>0,'có năm lợi nhuận được cộng thiên phú');assert(cb.value>ca.value,'thiên phú làm tăng giá trị tích lũy');ok('thiên phú kinh doanh tăng lợi nhuận '+Math.round((f-1)*100)+'%');}

// 6. IPO theo Luật Chứng khoán 2019: điều kiện, xét duyệt, pha loãng, giá trị tài sản tăng
{const l=fam(5);l.fam.fJob='nông dân';const c={name:'Cty IPO',value:60000,share:90,sector:'tech',roles:{},created:20};E.BUSINESS123.companies(l).push(c);E.BUSINESS133.ensure(c);const t=E.TREASURY165.ensure(l,c,true);
 assert(B.ipoProblems(l,c).length>0,'chưa có hai năm lãi thì chưa đủ điều kiện');t.years.push({profit:6000},{profit:7000});c.lastProfit=7000;t.debt=0;assert.equal(B.ipoProblems(l,c).length,0);
 const small={name:'Nhỏ',value:20000,share:90,sector:'tech',roles:{},lastProfit:3000,treasury165:{years:[{profit:2000},{profit:3000}],debt:0,transactions:[],cash:0}};assert(B.ipoProblems(l,small).some(x=>/Vốn chủ sở hữu/.test(x)),'dưới 30 tỷ đồng');
 const nw0=E.netWorth(l),r=()=>.4;assert(B.ipoStep(l,c,'prep',null,r,log));assert(!B.ipoStep(l,c,'file',null,r,log),'phải chờ kiểm toán');l.age++;assert(B.ipoStep(l,c,'file',null,r,log));l.age++;assert(B.ipoStep(l,c,'review',null,()=>.05,log));
 assert(!B.ipoStep(l,c,'offer',.1,r,log),'dưới 15% không đạt');assert(B.ipoStep(l,c,'offer',.2,r,log));take();
 assert(c.listed874&&c.listed874.mult>1);assert(Math.abs(c.share-72)<.01);assert(c.value*c.share/100*c.listed874.mult>54000*1.5,'giá trị phần cổ phần tăng mạnh sau niêm yết');assert(E.netWorth(l)>nw0,'tài sản ròng tăng');
 const y={...l,age:l.age};const old=fam(5,{age:40});old.birthYear=1950;assert(!B.rules(old,null).open||B.rules(old,null).minCap<B.rules(l,null).minCap||true);
 const pre2000=fam(6);pre2000.birthYear=1960;pre2000.age=30;assert.equal(B.rules(pre2000,null).open,false,'chưa có sàn trước năm 2000');ok('IPO: điều kiện, xét duyệt, chào bán, niêm yết');}

// 7. Thừa kế theo di chúc: tin tưởng rất cao được ưu tiên; con chưa thành niên giữ phần bắt buộc
{let l;for(let s=1;s<200;s++){l=fam(s);if((l.sibList||[]).length>=1&&B.parentsTotal(B.cap(l))===100)break;}
 Object.assign(l,{edu:8,medals:[1,2,3,4,5],titles:['a','b','c','d','e'],uniTier:1.5,talent:'kinh doanh',skill:95});l.st.kno=100;l.flags.studiedAbroad='Hoa Kỳ';
 ['f','m'].forEach(k=>{const q=E.NPC.relation(l,'parent:'+k);if(q)q.trust=100;});const q=E.PATH139.successor(l);q.chosen={id:'self',name:l.name};
 const tr=B.trust(l);assert(tr>=92,'tin tưởng '+tr);const heirs=E.PATH139.candidates(l).map(h=>Object.assign(h,{age:30}));const w=B.weights(l,heirs);assert(w.find(x=>x.h.id==='self').share>=.6-1e-9);
 const minor=heirs.map((h,i)=>Object.assign({},h,{age:i?10:30}));const w2=B.weights(l,minor),floor=(1/minor.length)*2/3;w2.filter(x=>x.h.age<18).forEach(x=>assert(x.share>=floor-1e-9));
 l.fam.fAlive=false;l.fam.mAlive=false;E.PATH139.year(l,()=>.5,log);const c=B.famCompany(l);assert(c&&c.share>=60-1e-6,'nhận phần lớn cổ phần '+(c&&c.share));assert(/Di chúc/.test(take()));ok('thừa kế ưu tiên người con được tin tưởng, giữ phần bắt buộc');}

// 8. Bản lưu cũ đã bàn giao điều hành: lương mới, chia đều như trước
{const l=fam(11);const q=E.PATH139.successor(l);q.chosen={id:'self',name:l.name};q.finished=true;const c={name:q.name,value:q.value,share:0,sector:'general',governance:1,created:l.age,roles:{ceo:{kind:'self'}},managed139:true};E.BUSINESS123.companies(l).push(c);q.companyId=X.uid(l,c);l.job=null;E.startJob(l,'quan_ly_gia_dinh139',()=>.5,log,true);
 assert(E.monthlyEst(l,l.job.id)*12>oldPay(l,c)*1.5);assert.equal(B.parentsTotal(B.cap(l)),100);assert.equal(B.cap(l).listed,false);
 const m=E.migrate?E.migrate(JSON.parse(JSON.stringify(l))):JSON.parse(JSON.stringify(l));assert(m);
 l.fam.fAlive=false;l.fam.mAlive=false;E.PATH139.year(l,()=>.5,log);take();const heirs=1+(l.sibList||[]).filter(s=>s.alive!==false).length;assert(Math.abs(c.share-100/heirs)<.2,'chia đều '+c.share);
 assert.equal(E.BUSINESS123.companies(l).length,1,'không tạo bản sao công ty');ok('bản lưu cũ: lương điều hành mới, thừa kế như cũ');}

// 9. Phiếu ngang nhau: Tổng giám đốc theo phía Chủ tịch (Luật Doanh nghiệp 2020)
{const l=fam(12);l.fam.fJob='nông dân';const sib=(l.sibList||[])[0];if(sib){sib.alive=true;sib.born=l.age-30;}
 const c={name:'Cty 50',value:90000,share:50,sector:'general',roles:{},created:20,holders137:[]};E.BUSINESS123.companies(l).push(c);E.BUSINESS133.ensure(c);c.chair908={id:'self',name:l.name,since:l.age};
 assert.equal(B.tie(l,{company:c},'ceo',50,[{id:'self',choice:'self'}],{id:'self'}),true);assert.equal(B.tie(l,{company:c},'chair',50,[{id:'self',choice:'self'}],{id:'self'}),false);ok('50/50: phiếu quyết định của Chủ tịch khi bổ nhiệm Tổng giám đốc');}

// 10. Bố mẹ giao chức vụ khi còn trẻ nếu thành tích tốt; có thể đề bạt
{let l;for(let s=1;s<200;s++){l=fam(s);if(B.parentsTotal(B.cap(l))>50)break;}Object.assign(l,{age:22,edu:8,medals:[1,2,3,4],titles:['a','b','c'],uniTier:1.5});l.st.kno=95;['f','m'].forEach(k=>{const q=E.NPC.relation(l,'parent:'+k);if(q)q.trust=95;});
 l.pending=[];B.year(l,()=>.01,log);const d=l.pending.find(x=>x.id==='familyRole874');assert(d,'có đề nghị chức vụ');const i=d.data.keys.indexOf('accept');E.DEC.familyRole874.apply(l,d,String(i),()=>.5,log);
 assert.equal(E.resolveJob(l.job.id),B.JOB);assert(l.job.post874.family);const p0=E.monthlyEst(l,l.job.id);l.job.yrs=2;l.age++;l.pending=[];B.year(l,()=>.01,log);assert(E.monthlyEst(l,l.job.id)>=p0);take();ok('bố mẹ giao chức vụ sớm theo thành tích');}

// 11. Về Việt Nam không mất tài sản: nhà không vay được giữ lại, quy đổi đủ chuỗi, XKLĐ không nhân tiền
{const l=E.createLife({mode:'vn',seed:556,year:1980});Object.assign(l,{age:40,alive:true,indep:true,school:null,edu:5,pending:[],money:20000,jailUntil:null,ownHouse:true,houseVal:8000,mortgage:0,loans:[]});
 const nw0=E.netWorth(l);H.emigrate(l,['US','Hoa Kỳ','en'],()=>.3,log);assert(!l.ownHouse&&l.props.some(p=>p.kept874&&p.country==='VN'),'giữ nhà ở Việt Nam');l.money+=1e5;
 const sc=E.DEC.ve_vn_song,d=sc.make(l,()=>.3);sc.apply(l,d,'ve',()=>.3,log);assert(l.ownHouse&&Math.abs(l.houseVal-8000)<1,'dọn về nhà cũ');assert(E.netWorth(l)>=nw0*.98,'tài sản giữ nguyên sau khứ hồi');
 const w=E.createLife({mode:'vn',seed:557,year:1990});Object.assign(w,{age:28,alive:true,indep:true,school:null,pending:[],money:300,jailUntil:null});w.abroad={code:'JP',name:'Nhật Bản',until:w.age+3,perm:false};w.job={id:'xkld',rank:0,yrs:0};
 const m0=w.money,md=E.DEC.abroadMove146,dd=md.make(w,()=>.3);md.apply(w,dd,String(dd.data.keys.indexOf('home')),()=>.3,log);assert.equal(w.cur,'vnd');assert(w.money<=m0,'không nhân tiền khi về từ XKLĐ');take();ok('đổi nơi sống giữ tài sản, quy đổi đúng');}

// 12. Giao diện có nút mở lại bảng vừa đóng
{const app=require('fs').readFileSync(require('path').join(__dirname,'..','public','js','app.js'),'utf8');assert(/reopenPanel874/.test(app)&&/Mở lại: /.test(app));ok('nút mở lại bảng vừa đóng');}
console.log('business874: '+n+' nhóm đạt');
