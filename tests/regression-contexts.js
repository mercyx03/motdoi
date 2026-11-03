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
add('film154,actor154',l=>{l.age=25;l.talent='diễn xuất';l.actSk=70;E.ACTOR154.startProject(l,()=>0.3,()=>{});l.pending=[];});
out.film154.arg={token:out.film154.life.flags.actor154.project.token,stage:'read'};
/* Thực tập sinh K-pop: 15 tuổi được chú ý; thực tập sinh đang đánh giá; nhóm vừa thành lập */
add('scout155',l=>{l.age=15;l.birthYear=2010;l.school='THPT';l.indep=false;E.LIFE138.skill(l,'sing').level=70;E.LIFE138.skill(l,'dance').level=65;});
add('eval155',l=>{l.age=16;l.birthYear=2009;l.school='THPT';l.indep=false;l.flags.idol155={stage:'junior',evals:[],peers:[{name:'Minh Anh',skill:50,grow:3,kind:'hòa đồng',bond:0}],company:{name:'Aurora Entertainment (hư cấu)',rep:80,split:0.2},months:0,debt:0};E.LIFE138.state(l).agency={name:'Aurora Entertainment (hư cấu)',code:'KR',status:'junior155',years:0,started:15};});
add('debut155',l=>{l.age=20;l.flags.idol155={stage:'debut',evals:[],peers:[],company:{name:'Aurora Entertainment (hư cấu)',rep:80,split:0.2},group:{name:'NOVA',members:['A','B','C'],position:null,debutAge:20,fandom:0,albums:[],wins:0},debt:0};E.LIFE138.state(l).agency={name:'Aurora Entertainment (hư cấu)',code:'KR',status:'debut',years:3,started:16};});
out.debut155.arg={step:'pos'};
// 8.10.17: khuôn ngẫu nhiên không phải lúc nào cũng có bạn đời đi làm (tình huống chỉ mở khi người ấy có thu nhập, dưới 62 tuổi).
add('marriageMove130',l=>{l.partner={name:'Minh An',sex:l.sex==='M'?'F':'M',age:42,alive:true,status:'married',since:30,inc:12,job:'kế toán'};});
// 8.10.17: bệnh thận/gan theo giai đoạn và kế vị nhóm — trạng thái dựng bằng API của chính module.
add('organ917,kidneyPrep917',l=>{E.ORGAN917.newKidney(l,22,null,null);});
add('kidneyFail917',l=>{E.ORGAN917.newKidney(l,10,null,null);l.flags.organ917.kidney.failAt=l.age;});out.kidneyFail917.arg={at:out.kidneyFail917.life.age};
add('kidneyOffer917',l=>{E.ORGAN917.newKidney(l,10,null,null);const k=l.flags.organ917.kidney;k.dialysis={type:'hd',since:43,missed:0};k.wait={since:43};});out.kidneyOffer917.arg={at:out.kidneyOffer917.life.age};
add('liverDecomp917',l=>{E.ORGAN917.newLiver(l,'hbv','decompensated',null);});out.liverDecomp917.arg={at:out.liverDecomp917.life.age};
add('liverOffer917',l=>{E.ORGAN917.newLiver(l,'hbv','decompensated',null);l.flags.organ917.liver.wait={since:43};});out.liverOffer917.arg={at:out.liverOffer917.life.age};
add('crimeLeader912',l=>{E.startJob(l,'doi_no',()=>0.5,()=>{},true);l.job.rank=1;E.migrateExt(l);const g=E.CRIME912.group(l);E.CRIME912.ensureBoss(l);g.crisis={id:'ctx:crisis',kind:'retire',stage:1,at:l.age,cand:{id:'ctx:heir',name:'Người kế nhiệm hư cấu',trait:'cẩn thận',trust:40,since:l.age,demand:0},oldBoss:g.boss&&g.boss.name};});
// 8.10.17: câu chuyện quốc gia nhiều năm (life173) chỉ mở khi đang sống ở đúng nước, sau mốc tham chiếu, đúng hoàn cảnh (đi học / có việc / đang hẹn hò).
Object.values(E.COUNTRY_DEPTH_DATA.profiles).forEach(p=>p.lifeEvents.forEach(e=>{const l=E.createLife({mode:'world',country:p.countryCode,seed:917017,year:e.kind==='education'?2010:2002,noOrphan:true});Object.assign(l,{age:e.kind==='education'?16:24,alive:true,indep:e.kind!=='education',retired:false,school:e.kind==='education'?'upper':null,abroad:null,pending:[],sched:[],money:l.base*30,jailUntil:null});l.flags.military=0;l.flags.dirty=0;if(e.kind==='work')l.job={id:'ke_toan',since:22,rank:0,yrs:2,rep:50};if(e.kind==='marriage')l.partner={name:'Người yêu hư cấu',sex:l.sex==='M'?'F':'M',age:24,since:21,alive:true,status:'dating',affection108:65};out[e.eventId]={life:l,arg:{}};}));
// 8.10.19 Phần B/C: chuỗi biến cố drama917 (dựng qua CHAIN144 với cid/token), công vụ state917, thời đại era917.
const sibs=l=>{l.sibList=[{n:'Lan',sex:'F',born:-3,alive:true,close:60,job:'kế toán'}];l.fam.fAlive=false;};
chain144('d917_will_1','d917_will',0,sibs,()=>({npc:{ref:null,name:'Lan'},data:{who:'bố'}}));
chain144('d917_will_2','d917_will',1,sibs,()=>({npc:{ref:null,name:'Lan'},data:{who:'bố',path:'mediate'}}));
chain144('d917_debt_1','d917_debt',0,sibs,()=>({npc:{ref:null,name:'Lan'},data:{kind:'sib'}}));
chain144('d917_rumor_1','d917_rumor',0,l=>{l.partner={name:'Minh An',sex:l.sex==='M'?'F':'M',age:42,alive:true,status:'married',since:30};},()=>({npc:{ref:null,name:'Minh An'},data:{}}));
chain144('d917_credit_1','d917_credit',0,l=>{E.startJob(l,'van_phong',()=>0,()=>{},true);},l=>({npc:{ref:null,name:'Trần Bình'},data:{since:l.job.since}}));
chain144('d917_partner_1','d917_partner',0,l=>{E.startJob(l,'kd_quan',()=>0,()=>{},true);},()=>({npc:{ref:null,name:'Phạm Hưng'},data:{}}));
chain144('d917_complaint_1','d917_complaint',0,l=>{E.startJob(l,'hanh_chinh_cong',()=>0,()=>{},true);l.job.rank=5;E.STATE174.syncState(l);},()=>({npc:{ref:null,name:'người dân'},data:{}}));
chain144('d917_protege_1','d917_protege',0,l=>{E.startJob(l,'trung_uong',()=>0,()=>{},true);l.job.rank=5;E.STATE174.syncState(l);E.STATE917.state(l).allies.push({id:'ctx:ally',name:'Vũ Hà',since:40,where:'Bộ Tài chính',trust:60,active:true,helped:0,disagreed:0});},()=>({npc:{ref:null,name:'Vũ Hà'},data:{}}));
chain144('d917_school_1','d917_school',0,l=>{l.kids=[{name:'Minh',sex:'M',born:35,alive:true,close:60}];},()=>({npc:{ref:null,name:'Minh'},data:{}}));
chain144('d917_move_1','d917_move',0,l=>{l.abroad={code:'JP',name:'Nhật Bản',perm:true,pool:'jp'};},()=>({npc:{ref:null,name:''},data:{}}));
add('post917,staff917,project917,stepDown917,discipline917',l=>{E.startJob(l,'trung_uong',()=>0,()=>{},true);l.job.rank=6;l.job.rankSince=l.age;E.STATE174.syncState(l);E.STATE917.syncPost(l);E.STATE174.state(l).kpi.integrity=30;});
add('staffPerson917',l=>{E.startJob(l,'trung_uong',()=>0,()=>{},true);l.job.rank=6;E.STATE174.syncState(l);E.STATE917.syncPost(l);});out.staffPerson917.arg={id:E.STATE917.staff(out.staffPerson917.life)[0].id};
add('citizen917',l=>{l.partner={name:'Kim',sex:l.sex==='M'?'F':'M',age:40,alive:true,status:'married',homeCountry:'KR'};l.kids=[{name:'Min',sex:'F',born:44,alive:true}];});
add('drama917,era917,care917',l=>{});
// 8.10.20 Phần C tiếp: phiếu lương, ngân sách, nghỉ ốm, đào tạo lại, nhà ở xã hội, giao thông, thuế TNDN, hộ chiếu, chuỗi kinh tế.
add('payslip918,sick918',l=>{l.birthYear=1996;E.startJob(l,'cong_chuc',()=>0,()=>{},true);l.si={yrs:16,sum:100,last:44,m:10};l.yr={gross:240,si:25.2,items:[]};l.flags.tax909={registered:{},history:[{age:45,year:2041,afterInsurance:214.8,deduction:186,taxable:28.8,tax:1.44,dependents:0,gross:240,insurance:25.2}]};l.ill='cúm nặng';});out.sick918.arg={at:out.sick918.life.age};
add('budget918,retrain918,biztax918',l=>{E.startJob(l,'kd_quan',()=>0,()=>{},true);l.income=l.base*2;l.si={yrs:3,last:40,m:8};});
add('housing918,housingOffer918',l=>{l.urban=true;l.ownHouse=false;l.partner=null;l.yr={gross:180,items:[]};l.income=180;l.flags.econ918={housing:{status:'waiting',applied:42,due:45}};});out.housingOffer918.arg={at:out.housingOffer918.life.age};
add('lez918',l=>{l.birthYear=1986;l.urban=true;l.prov={neu:'Hà Nội',old:'Hà Nội',kind:'Thành phố'};l.veh='xe máy';l.vehK='wave';l.vehName='Honda Wave';});out.lez918.arg={at:out.lez918.life.age,ph:3};
add('passport918',l=>{l.kids=[{name:'Bi',sex:'M',born:38,alive:true}];l.flags.travel918={passport:{cc:'VN',issued:44,until:54},visas:{},denied:{},trips:[]};});
chain144('d918_squeeze_1','d918_squeeze',0,l=>{l.partner={name:'An',sex:'F',age:44,alive:true,status:'married',inc:10};},()=>({npc:{ref:null,name:''},data:{y:2041}}));
chain144('d918_eldercare_1','d918_eldercare',0,l=>{l.fam.mAlive=true;l.fam.mAge=35;l.sibList=[{n:'Lan',sex:'F',born:-3,alive:true,close:60}];},()=>({npc:{ref:null,name:'mẹ'},data:{who:'mẹ',side:'m',path:'yes'}}));
chain144('d918_reskill_1','d918_reskill',0,l=>{E.startJob(l,'van_phong',()=>0,()=>{},true);},l=>({npc:{ref:null,name:''},data:{since:l.job.since}}));
// 8.10.20 Phần C hoàn thiện: BHYT/quỹ hưu, giờ làm, thực tập, khuyết tật, vay sinh viên, đề xuất chính sách.
add('insurance918,work918',l=>{E.startJob(l,'ke_toan',()=>0,()=>{},true);l.flags.bhytVol=false;l.yr={gross:240,items:[]};l.flags.welfare918={vol:{m:1,bal:30,paid:30,since:40}};});
add('intern918,studentLoan918',l=>{l.age=20;l.school='uni';l.major='eco';l.indep=false;l.fam.q=2;l.money=0;});
add('disability918',l=>{l.kids=[{name:'Na',sex:'F',born:35,alive:true,dev915:{v:1,c:{id:{known:true,at:38}}}}];});
add('policy918',l=>{E.startJob(l,'trung_uong',()=>0,()=>{},true);l.job.rank=6;l.job.rankSince=l.age;E.STATE174.syncState(l);E.STATE917.syncPost(l);});
// 8.10.24 (MD5): bối cảnh cho các menu/tình huống mới (chỉ là dữ liệu dựng, không đổi assertion)
function wed(l,extra){l.partner=Object.assign({name:'Hà',sex:'F',age:43,status:'married',since:30,alive:true,close:70,job:'giáo viên',inc:5},extra||{});}
add('divorceCase920',l=>{wed(l,{separated919:44,close:25});l.jailUntil=48;});
add('residence920',l=>{l.flags.life114={migration:{country:'DE',due:46}};});
add('kin920,home920,household920,kinPrep920',l=>{wed(l);l.fam.mAlive=true;l.ownHouse=false;l.urban=true;l.kids=[{name:'Bé',sex:'F',born:42,alive:true}];},{mode:'meal'});
add('goalAsk920',l=>{wed(l);l.partner.goal920={k:'cook',at:45,prog:0};},{k:'cook'});
add('shopAsk920',l=>{wed(l);l.money=l.base*100;});
add('parenting920,anger920',l=>{l.kids=[{name:'Minh',sex:'M',born:33,alive:true,study:50,close:60,uid110:'ctx-kid'}];},{id:'ctx-kid'});
add('doubt920,truth920',l=>{wed(l);l.partner.pid920='ctx-p';l.flags.kin920={cheat:{who:'ctx-p',real:true,at:45,done:false}};});
add('school920',l=>{Object.assign(l,{age:16,indep:false,school:'upper',schoolEnd:18});E.SCHOOL920.plan(l,()=>{});});
add('rite920',l=>{Object.assign(l,{age:13,sex:'M'});l.religion='Do Thái giáo';});
add('royalCircle920,royalPerson920,royalRole920,royalDuty920,royalRumor920',l=>{l.country='GB';l.flags.royal={tier:'direct',c:'GB',house:'Hoàng gia Anh',role920:'working'};l.fame=2e6;const h=E.ROYAL920.house(l,'GB'),m=E.ROYAL920.eligible(l,h)[0];if(m)E.ROYAL920.st(l).rel={[m.id]:{cc:'GB',stage:'trust',trust:40,at:2000}};});
if(out.royalPerson920){const L=out.royalPerson920.life;out.royalPerson920.arg={id:Object.keys(E.ROYAL920.st(L).rel||{})[0]};}
add('sixth829,schoolEngland829',l=>{Object.assign(l,{age:16,mode:'world',country:'GB',city:'London',abroad:null,birthYear:2003,school:'lower',alive:true});});
add('exchange829,aid829',l=>{Object.assign(l,{age:20,mode:'world',country:'US',abroad:null,school:'uni',alive:true});});
add('babyFaith830',l=>{l.kids=[{name:'An',born:l.age,sex:'F',alive:true}];l.religion='Công giáo';});
add('dossier830,faithHome830',l=>{l.country='VN';l.abroad=null;l.age=30;wed(l);});
return out;};
