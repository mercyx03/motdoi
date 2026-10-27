/* Explicit contexts for guarded menus; paired with original random templates. */
module.exports=function(G){const E=G.E,out={};function base(){const l=E.createLife({mode:'vn',seed:12624,noOrphan:true});Object.assign(l,{age:45,indep:true,retired:false,edu:7,school:null,abroad:null,pending:[],sched:[],money:l.base*100});Object.assign(l.st,{kno:100,hea:90,soc:90});l.karma=30;l.flags.military=0;l.flags.dirty=0;l.lang={en:5};l.langExp={};return l;}function add(ids,setup,arg){for(const id of ids.split(',')){let l=base();setup(l);out[id]={life:l,arg:arg||{}};}}
add('recovery109',l=>{l.flags.career109={projects:0,reputation:0,unemployment:{at:44,years:1}};l.job=null;});
add('repair109',l=>{l.partner={name:'Minh An',sex:'F',age:40,alive:true,status:'married',family100:{uid:'review-spouse',trust:40,tension:70}};});
add('direct111',l=>{l.edu=3;l.flags.study54={records:{math:4}};});
add('officer111',l=>{l.edu=5;E.startJob(l,'cong_an',()=>0,()=>{},true);});
add('childHome112',l=>{l.kids=[{name:'Minh',alive:true,born:20,sex:'M',gifts112:[{id:'house-review',kind:'home',data:{n:'Căn hộ gia đình',city:'Hà Nội',v:2000}}]}];});
add('research113,titles113,scienceLeader113',l=>{E.startJob(l,'giang_vien',()=>0,()=>{},true);E.UPDATE110.state(l).research={papers:20,rep:90,teaching:15,completed:10,title:'GS'};});
add('move114',l=>{l.flags.life114={approved:{country:'US',until:47}};});
add('leadership115',l=>{E.startJob(l,'quan_doi',()=>0,()=>{},true);l.flags.service107={merit:10,used:{},post:{track:'quan_doi',name:'Bộ trưởng Bộ Quốc phòng',at:40}};});
add('transfer116,transfer116_review,transfer116_accept,publicTeach116',l=>{E.startJob(l,'cong_an',()=>0,()=>{},true);l.job.rank=6;l.job.since=30;l.job.yrs=10;l.flags.dangVien=true;l.flags.service107={merit:10,post:{track:'cong_an',name:'Giám đốc công an tỉnh',rank:6,at:40}};});
for(const id of ['transfer116_review','transfer116_accept']){let l=out[id].life;let d=E.DEC.transfer116.make(l,()=>0);E.DEC.transfer116.apply(l,d,'5',()=>0,()=>{});if(id==='transfer116_accept'){d=l.pending.shift();E.DEC.transfer116_review.apply(l,d,'review',()=>0,()=>{});}out[id].arg=l.pending[0].data;l.pending=[];}
add('publicReview116',l=>{E.startJob(l,'cong_chuc',()=>0,()=>{},true);l.job.rank=0;l.job.since=30;l.job.rankSince=30;l.job.yrs=10;Object.assign(E.PUBLIC116.record(l),{points:10,projects:5});l.flags.dangVien=true;});
add('civicWork118',l=>{l.flags.civic106={front:true};});
add('borderReview122',l=>{E.WORLD120.s(l).exitOrder={until:47,reason:'Nghĩa vụ tài sản đang được xem xét'};});
add('anniversary122',l=>{E.startJob(l,'quan_doi',()=>0,()=>{},true);l.birthYear=2030-l.age;});
add('highSchool125',l=>{l.age=15;l.edu=2;});
add('highFallback125',l=>{l.age=15;l.edu=2;let d=E.DEC.highSchool125.make(l,()=>0);E.DEC.highSchool125.apply(l,d,'0',()=>0,()=>{});l.pending=[];});
add('academicReview125',l=>{E.WORLD120.s(l).academicCase={at:44,status:'pending',evidence:1};});
add('serviceExtension125',l=>{l.age=60;E.startJob(l,'cong_chuc',()=>0,()=>{},true);});
add('future126,childFuture126,childMatch126',l=>{l.kids=[{name:'Minh',alive:true,born:20,sex:'M',study:80,edu:5,close:90}];E.DEC.future126.make(l,()=>0);});
for(const id of ['childFuture126','childMatch126'])out[id].arg={id:out[id].life.kids[0].parentId};
out.childMatch126.arg.person={name:'An Nhiên',sex:'F',age:25,home:'Hà Nội',education:'Đại học',job:'kỹ sư',family:'Gia đình lao động',values:'Ưa cuộc sống giản dị',compatibility:.8};
add('companySector133',l=>{l.money=l.base*100;});
add('groupSector133,companyRole133,companyIssue133',l=>{l.money=l.base*400;E.WORLD120.s(l).companies=[0,1,2].map(k=>({name:'Công ty kiểm thử '+k,value:l.base*50,share:k?100:60,created:40,governance:0,sector:'general'}));E.WORLD120.s(l).group={since:44};},{i:0,role:'ceo'});
/* GĐ2.5: ngữ cảnh cho các tình huống thêm sau này mà chưa khuôn nhân vật nào mở được (trạng thái dựng bằng đúng đường của game) */
add('academicCase125',l=>{E.startJob(l,'nghien_cuu',()=>0,()=>{},true);},{kind:'stolen'});
add('comeOut130',l=>{l.kids=[{name:'An Nhiên',sex:'F',born:15,alive:true,close:80,orient:'gay'}];E.FAMILY53.init(l);E.FAMILY130.identity(l,l.kids[0]).disclosed=true;});out.comeOut130.arg={id:out.comeOut130.life.kids[0].parentId};
add('supportRules130',l=>{l.partner={name:'Lan Chi',sex:'F',age:40,alive:true,status:'married',since:30};l.money=l.base*2000;const d=E.DEC.chu_cap_nguoi_yeu.make(l,()=>0.5);E.DEC.chu_cap_nguoi_yeu.apply(l,d,'vua',()=>0.5,()=>{});});
add('groupRoles137,childrenSuccession139',l=>{l.money=l.base*400;E.WORLD120.s(l).companies=[0,1].map(k=>({name:'Công ty kiểm thử '+k,value:l.base*50,share:100,created:40,governance:0,sector:'general'}));E.WORLD120.s(l).group={since:44};l.kids=[{name:'Minh Kế',sex:'M',born:20,alive:true,close:70,edu:5}];E.FAMILY53.init(l);});
add('auditionPrep139',l=>{l.age=19;l.edu=3;l.money=l.base*5;E.LIFE138.state(l).agency={name:'Nova Entertainment (hư cấu)',code:'KR',status:'offer',years:0};});
add('collectors140',l=>{l.loans=[{type:'bank',name:'vay ngân hàng',bal:l.base*3,rate:.09,minShare:.12,late:3,since:40}];E.DEBT140.year(l,()=>0,()=>{});});
/* GĐ4: chuỗi hậu quả — dựng chuỗi đang mở đúng giai đoạn qua E.CHAIN144 và truyền cid/token như lịch hẹn của game */
function chain144(ids,kind,stage,setup,extra){for(const id of ids.split(',')){add(id,setup);const l=out[id].life,c=E.CHAIN144.start(l,kind,{dec:'regression',k:'x'},extra(l));c.stage=stage;c.open={at:l.age,token:c.id+'#'+stage+'@'+l.age};out[id].arg={cid:c.id,token:c.open.token};}}
const loan=(l,type)=>{l.loans=[{type,name:type==='nong'?'vay nóng (tín dụng đen)':'vay người thân',bal:l.base*.4,rate:type==='nong'?1.5:0,minShare:.4,late:0,since:44}];};
chain144('ch144_edu_barrier','edu',0,l=>{l.age=19;l.edu=2;l.money=l.base;},()=>({data:{edu0:2}}));
chain144('ch144_job_search','career',0,l=>{l.age=35;l.job=null;l.lastJob={id:'van_phong',rank:1,yrs:5};l.flags.needJob=true;},()=>({npc:{ref:null,name:'Thu Hà'}}));
chain144('ch144_job_referral','career',1,l=>{l.age=37;l.job=null;l.lastJob={id:'van_phong',rank:1,yrs:5};},()=>({npc:{ref:null,name:'Thu Hà'},data:{retrained:true}}));
chain144('ch144_biz_debt','biz',0,l=>{E.startJob(l,'kd_quan',()=>0,()=>{},true);loan(l,'nong');},()=>({data:{loan:'nong',since:44}}));
chain144('ch144_biz_crossroad','biz',1,l=>{E.startJob(l,'kd_quan',()=>0,()=>{},true);l.loans=[];},()=>({data:{loan:'nong',since:44,cleared:true}}));
chain144('ch144_debt_due,ch144_debt_end','debt',0,l=>{l.fam.mAlive=true;l.veh='xe máy';l.vehVal=l.base*.5;loan(l,'family');},()=>({data:{loan:'family',since:44,who:'mẹ'}}));
E.CHAIN144.active(out.ch144_debt_end.life,'debt').stage=1;out.ch144_debt_end.arg.token=E.CHAIN144.active(out.ch144_debt_end.life,'debt').open.token=E.CHAIN144.active(out.ch144_debt_end.life,'debt').id+'#1@45';
chain144('ch144_fam_distance','family',0,l=>{Object.assign(l.fam,{mAlive:true,fAlive:false});l.sibList=[{n:'Lan',sex:'F',alive:true,born:2}];},()=>({data:{side:'m'}}));
chain144('ch144_fam_reconcile','family',1,l=>{Object.assign(l.fam,{mAlive:true,fAlive:false});l.kids=[{name:'Bin',sex:'M',born:44,alive:true}];},()=>({data:{side:'m',warm:1}}));
const spouse=l=>{l.partner={name:'Minh An',sex:'F',age:42,alive:true,status:'married',since:30,family100:{uid:'review-spouse-144',trust:50,tension:40}};};
chain144('ch144_love_after','marriage',0,spouse,l=>({npc:{ref:E.UPDATE110.uid(l,l.partner),name:l.partner.name}}));
chain144('ch144_love_cross','marriage',1,l=>{spouse(l);l.partner.family100.trust=45;},l=>({npc:{ref:E.UPDATE110.uid(l,l.partner),name:l.partner.name}}));
const friend=l=>{l.friends=[{name:'Hoài Nam',sex:'M',alive:true,close:70,d:0,since:10}];l.job=null;l.money=-l.base;};
chain144('ch144_friend_return','friend',0,friend,l=>({npc:{ref:E.UPDATE110.uid(l,l.friends[0]),name:'Hoài Nam'},data:{helped:true,why:'vừa mất việc'}}));
chain144('ch144_friend_drift','friend',0,friend,l=>({npc:{ref:E.UPDATE110.uid(l,l.friends[0]),name:'Hoài Nam'},data:{helped:false,why:'vừa chia tay người yêu'}}));
chain144('ch144_health_rehab','health',0,l=>{E.startJob(l,'shipper',()=>0,()=>{},true);l.flags.dauLung=true;},()=>({data:{what:'tai nạn khi làm việc'}}));
chain144('ch144_health_flare','health',1,l=>{E.startJob(l,'shipper',()=>0,()=>{},true);l.flags.dauLung=true;},()=>({data:{what:'tai nạn khi làm việc'}}));
/* Góp ý người chơi: thương vụ cần một doanh nhân đã quen; áp lực giới giải trí cần người làm nghề giải trí */
add('deal148',l=>{l.money=l.base*500;const p=E.ELITE148.meet(l,()=>0.3,{kind:'business',tier:2,where:'tiệc gặp gỡ đối tác'});p.trust=80;});
add('dark149',l=>{E.startJob(l,Object.keys(E.CAR).find(k=>E.CAR[k].fame),()=>0,()=>{},true);});
/* Showbiz: một chương trình đang ghi hình (bắt đầu bằng hàm của game) */
add('show151_step',l=>{l.age=30;l.st.kno=80;E.SHOW151.begin(l,()=>0.3,()=>{},'nnc','contestant');l.pending=[];});
out.show151_step.arg={token:out.show151_step.life.flags.show151.active.token,step:out.show151_step.life.flags.show151.active.step};
add('mini152',l=>{l.age=30;l.flags.mini152={kind:'rps',token:'ctx',st:E.MINI152.MINI.rps.init('ctx',{host:'người dẫn'}),done:'none',ctx:{title:'Oẳn tù tì'},manual:true,notes:[]};});
out.mini152.arg={token:'ctx',n:0};
return out;};
