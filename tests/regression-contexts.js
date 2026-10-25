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
return out;};
