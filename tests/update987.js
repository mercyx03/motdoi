'use strict';
// 9.8.7: nhập quốc tịch giữa năm, sinh đôi có hồ sơ riêng, trường hàng không + tuyển học viên phi công, chương trình sống còn, vị trí nhóm, quảng cáo, album solo.
const assert=require('assert'),G=require('./hardcore-isolation').gameContext(),E=G.E,U=G.U,X=E.UPDATE110;let n=0;function ok(v,m){assert(v,m);n++;}
function life(age,extra){let l=E.createLife({mode:'vn',seed:987+age});Object.assign(l,{age,school:null,indep:true,money:1e6,edu:5,record:0,pending:[],job:null},extra||{});return l;}
function pickRow(l,id,key,arg){let d=E.DEC[id].make(l,()=>.5,arg||{}),i=d.data.keys.indexOf(key);assert(i>=0,'row '+key+' in '+id+': '+d.data.keys.join(','));d.manual=true;l.pending.unshift(d);return E.resolve(l,String(i));}
// --- Nhập quốc tịch khi thanh năm đang chạy (_yearRun) vẫn nộp được, trừ lệ phí, có kết quả năm sau.
{let l=life(35);l.abroad={code:'DE',name:'Đức',perm:true,natLegacy873:true};l.flags.residYrs={DE:10};l._yearRun=true;
 let d=E.DEC.nhap_quoc_tich.make(l,()=>.5,{code:'DE'});d.manual=true;l.pending.unshift(d);let m=l.money;E.resolve(l,'nop');
 ok(l.flags.nat880&&l.flags.nat880.stage==='review','hồ sơ được xếp hàng khi nộp giữa năm');ok(m-l.money>0,'trừ lệ phí');l._yearRun=false;
 l.age=l.flags.nat880.dueAge;let logs=[];E.HOOKS.year.forEach(h=>{try{if(/nat880/.test(String(h)))h(l,()=>.1,t=>logs.push(t),l.age);}catch(e){}});
 ok(l.pending.some(x=>x.id==='nat880_interview'),'được mời phỏng vấn khi tới hạn');
 l.pending=l.pending.filter(x=>x.id==='nat880_interview');let it=l.pending[0];it.manual=true;E.resolve(l,'self');ok(!l.flags.nat880,'có kết quả sau phỏng vấn');}
{let l=life(35,{money:0});l.abroad={code:'DE',name:'Đức',perm:true,natLegacy873:true};l.flags.residYrs={DE:10};let d=E.DEC.nhap_quoc_tich.make(l,()=>.5,{code:'DE'});d.manual=true;l.pending.unshift(d);let out=E.resolve(l,'nop');ok(!l.flags.nat880&&out.some(e=>/Chưa nộp được/.test(e.t)),'thiếu tiền thì báo rõ, không im lặng');}
// --- Sinh đôi: mỗi bé một mã hồ sơ; đổi tên bé thứ hai không đổi bé thứ nhất; bản lưu cũ trùng mã được sửa.
{let base=life(30,{sex:'F'}),t=null;for(let i=0;i<30000&&!t;i++){let l=JSON.parse(JSON.stringify(base));l.id='tw987-'+i;l.kids=[{name:'Lan',sex:'F',born:30,alive:true,married:false,kids:0}];E.FAMILY53.init(l);E.GENETICS912.onBirths(l,()=>{});if(l.kids.length===2)t=l;}
 ok(t,'tìm được ca sinh đôi');E.FAMILY53.init(t);ok(t.kids[0].parentId!==t.kids[1].parentId,'hai bé khác mã hồ sơ');ok(t.kids[0].name!==t.kids[1].name,'bé thứ hai có tên riêng');
 let r=E.FAMILY53.name(t,t.kids[1].parentId,'Mai',30,()=>{});ok(r.ok&&t.kids[1].name==='Mai'&&t.kids[0].name==='Lan','đổi tên đúng bé thứ hai');
 t.kids[1].parentId=t.kids[0].parentId;E.FAMILY53.init(t);ok(t.kids[0].parentId!==t.kids[1].parentId&&E.FAMILY53.find(t,t.kids[1].parentId)===t.kids[1],'sửa bản lưu cũ trùng mã');}
// --- Hàng không: trường mới và chương trình, cổng nghề phi công.
{let vaa=E.EDUCATION54.schools.find(u=>u.id==='vaa');ok(vaa&&/Hàng không/.test(vaa.name),'có Học viện Hàng không Việt Nam');let names=E.EDUCATION54.programs(vaa).map(p=>p.name);ok(names.includes('Quản lý và khai thác bay')&&names.includes('Kỹ thuật hàng không'),'chương trình hàng không');
 let hust=E.EDUCATION54.schools.find(u=>u.id==='hust');ok(E.EDUCATION54.programs(hust).some(p=>/hàng không/i.test(p.name)),'Bách khoa có Kỹ thuật hàng không');
 let l=life(24,{major:'eco',majorName:'Kế toán'});ok(!E.pilotEligible836(l),'bằng đại học bất kỳ không còn đủ làm phi công');ok(E.startJob(l,'phi_cong',()=>.5,()=>{},true)===false,'không tự nhận việc phi công');
 let old=life(40);old.job={id:'phi_cong',rank:2,yrs:10,since:30};ok(E.pilotEligible836(old),'phi công ở bản lưu cũ được giữ');
 let c=life(20,{edu:3});c.st.kno=95;c.st.hea=95;c.st.soc=90;c.lang={en:4};let A=E.AVIATION987;ok(A.applyWhy(c)===true,'đủ điều kiện nộp hồ sơ');
 let passed=null;for(let i=0;i<60&&!passed;i++){let x=JSON.parse(JSON.stringify(c));x.id='pilot'+i;A.applyRun(x,()=>.5,()=>{});if(x.flags.pilot987.offer)passed=x;}
 ok(passed,'có thể trúng tuyển');A.enrol(passed,()=>{},true);ok(A.training(passed),'vào khóa huấn luyện');
 for(let y=0;y<6&&!A.certified(passed)&&A.training(passed);y++){passed.age++;passed.flags.pilot987.yearAt=null;A.year(passed,()=>.5,()=>{});}
 ok(A.certified(passed)||passed.flags.pilot987.stage==='stopped','khóa học kết thúc có kết quả');if(A.certified(passed))ok(E.pilotEligible836(passed),'có chứng chỉ thì đủ điều kiện nghề phi công');
 let weak=life(20,{edu:3});weak.st.hea=40;let fails=0;for(let i=0;i<30;i++){let x=JSON.parse(JSON.stringify(weak));x.id='w'+i;A.applyRun(x,()=>.5,()=>{});if(!x.flags.pilot987.offer)fails++;}ok(fails===30,'sức khỏe không đạt thì không trúng tuyển');}
// --- Chương trình sống còn: thí sinh cá nhân ở Việt Nam đăng ký được, có vé thì vào show.
{let I=E.IDOL987,SH=E.SHOW151,l=life(19,{sex:'F'});l.birthYear=2026-19;let shows=I.survivalShows();ok(shows.includes('globalidol987')&&shows.includes('produce101'),'danh sách show sống còn');
 ok(I.applyWhy(l,SH.SHOWS.globalidol987)===true,'người ở Việt Nam, không thuộc công ty vẫn gửi hồ sơ');ok(I.applyWhy(life(30),SH.SHOWS.globalidol987)!==true,'giới hạn tuổi');
 let L=E.LIFE138;['sing','dance','acting'].forEach(k=>L.skill(l,k).level=80);let got=null;for(let i=0;i<40&&!got;i++){let x=JSON.parse(JSON.stringify(l));x.id='sv'+i;['sing','dance','acting'].forEach(k=>L.skill(x,k).level=80);I.apply(x,()=>.5,()=>{},'globalidol987');if(SH.S(x).active)got=x;}
 ok(got&&SH.S(got).active.id==='globalidol987','qua sơ tuyển thì bắt đầu ghi hình');ok(!got.abroad,'không đổi nơi cư trú');
 // Chạy hết chương trình bằng lựa chọn tự động.
 for(let i=0;i<40&&SH.S(got).active;i++){let d=got.pending[0];if(!d)break;E.resolve(got,E.DEC[d.id].auto(got,d,()=>.5));}
 ok(!SH.S(got).active&&SH.S(got).history.some(h=>h.id==='globalidol987'),'chương trình kết thúc và được ghi vào hồ sơ');}
// --- Vị trí, quảng cáo, album solo.
{let I=E.IDOL987,l=life(22,{sex:'M'}),L=E.LIFE138;['sing','dance','rap','acting'].forEach(k=>L.skill(l,k).level=75);l.fame=3e6;
 let s=E.IDOL155.S(l);s.stage='debut';s.group={name:'NOVA',members:['A','B','C'],position:'subVocal',debutAge:20,fandom:4e5,albums:[],wins:0};
 ok(Object.keys(E.IDOL155.POS).includes('leadDance')&&E.IDOL155.posFit(l,'center')>0,'có thêm vị trí dẫn/phụ/center');
 let logs=[];I.requestPos(l,()=>.5,t=>logs.push(t),'vocal');ok(logs.length&&I.state(l).posAt===l.age,'đề nghị đổi vị trí có kết quả');
 I.toggleExtra(l,()=>{},'center');I.updatePop(l,()=>.5);ok(I.popularity(l)>=30,'độ nổi tiếng cá nhân');
 let offers=I.makeOffers(l);ok(offers.length>=1,'có lời mời quảng cáo');let m=l.money;I.acceptOffer(l,()=>.5,()=>{},offers[0],false);ok(l.money>m,'nhận cát-xê');
 let amb={id:'t',cat:'beauty',brand:'Test',kind:'ambassador',fee:100,years:2};I.state(l).offers={at:l.age,list:[amb]};I.acceptOffer(l,()=>.5,()=>{},amb,false);let deal=I.state(l).deals.find(d=>d.brand==='Test');ok(deal&&deal.until===l.age+2,'hợp đồng đại diện có thời hạn');
 let dup={id:'u',cat:'beauty',brand:'Other',kind:'cf',fee:50,years:0};I.state(l).offers={at:l.age,list:[dup]};let m2=l.money;I.acceptOffer(l,()=>.5,()=>{},dup,false);ok(l.money===m2,'độc quyền ngành hàng');
 l.age++;m=l.money;I.dealsYear(l,()=>{});ok(l.money>m,'đại diện trả mỗi năm');let m3=l.money;I.dealsYear(l,()=>{});ok(l.money===m3,'không trả hai lần một năm');l.record=1;I.dealsYear(Object.assign(l,{age:l.age}),()=>{});
 l.record=0;I.state(l).pop=80;ok(I.soloWhy(l)===true,'đủ điều kiện album solo');I.plan(l,()=>.5,()=>{},'mini','dance','mid');ok(I.state(l).solo&&I.state(l).solo.release===l.age+1,'sản xuất trong năm, phát hành năm sau');ok(I.soloWhy(l)!==true,'không phát hành chồng');
 l.age++;I.release(l,()=>{});ok(I.state(l).albums.length===1,'phát hành album solo');let low=life(20);ok(I.soloWhy(low)!==true,'chưa nổi tiếng thì chưa phát hành solo');}
console.log('update987: '+n+' kiểm tra đạt');
