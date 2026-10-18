'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=path.join(__dirname,'..','public'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const [,f]of html.matchAll(/<script src="(js\/[^?]+)\?v=[^"]+"><\/script>/g))if(!['js/app.js','js/music.js','js/card.js'].includes(f))vm.runInThisContext(fs.readFileSync(path.join(root,f),'utf8'),{filename:f});
const {E,U,VN}=G,T=E.HOMETOWN;let n=0;function ok(x,t){assert.ok(x,t);n++;}
function life(name='Hà Nội',other='Quảng Nam',variant='63'){const l=E.createLife({mode:'vn',variant,oldProv:name,seed:464001});l.age=30;l.school=null;l.indep=true;l.pending=[];l.flags={};l.abroad=null;l.movedTo=null;l.cityStudent=null;l.money=100;l.partner={name:'An',sex:l.sex==='M'?'F':'M',age:29,alive:true,status:'dating',since:28,homeCountry:'VN',home63:other,job:'kế toán',inc:100,close:60};T.partner(l,l.partner);return l;}
function run(l,d,k){l.pending=[d];return E.resolve(l,k);}
function invoice(l,side,id='both'){const d=E.DEC.que_chuyen_di.make(l,()=>.5,{side});run(l,d,id);return l.pending.find(d=>d.id==='que_thanh_toan');}
ok(Object.keys(T.data).length===63&&VN.P63.every(p=>T.data[p.name]),'đủ đúng 63 tỉnh thành cũ');
for(const p of VN.P63){const c=T.data[p.name];ok(c.places.length>=2&&c.foods.length>=2&&new Set(c.places).size===c.places.length,'mỗi tỉnh có địa danh / đặc sản riêng');
 for(const variant of ['63','34']){const l=life(p.name,'Quảng Nam',variant);ok(T.own(l).name===p.name,'bản đồ 34 và 63 giữ đúng vùng sinh ra');const d=E.DEC.que_doc.make(l,()=>.5);ok(d.text.includes(c.places[0])&&d.text.includes(c.foods[0])&&!/undefined|NaN/.test(d.text),'giới thiệu đúng địa phương');}
 for(const side of ['mine','theirs'])for(const route of ['place0','place1','food','both'])for(const payer of ['self','split','partner']){
  const l=life(p.name,VN.P63[(p.id+1)%63].name);const d=invoice(l,side,route),cost=T.quote(l,d.data),cash=l.money,place=T.own(l).name,from=l.movedTo,partner=l.partner,home=partner.home63,share=payer==='self'?1:payer==='split'?.5:0;const logs=run(l,d,payer);
  ok(Math.abs(l.money-(cash-cost*share))<1e-8,'trừ đúng phần người chơi trả');ok(l.flags.heritageTravel.visits.length===1&&l.flags.heritageTravel.visits[0].province===(side==='mine'?p.name:home),'ghi nhận đúng quê và hướng mời');
  ok(logs.some(e=>e.t.includes(side==='mine'?p.name:home))&&logs.some(e=>/Tổng ngân sách/.test(e.t))&&logs.every(e=>!/undefined|NaN/.test(e.t)),'kết quả nêu nơi đến, người trả, nguồn tiền');ok(T.own(l).name===place&&partner.home63===home&&l.movedTo===from,'đi chơi không đổi quê hoặc nơi sống');
  const state=JSON.stringify(l.flags.heritageTravel),after=l.money;run(l,d,payer);ok(l.money===after&&JSON.stringify(l.flags.heritageTravel)===state,'hóa đơn cũ không thu tiền hoặc tạo lợi ích lần hai');
 }
}
{
 const l=life(),before=l.rs,p={name:'Bình',sex:'M',age:28,alive:true};T.partner(l,p);const home=p.home63,id=p.heritageId;for(let i=0;i<5;i++)T.partner(l,p);ok(p.home63===home&&p.heritageId===id&&l.rs===before,'quê cố định và không tiêu thụ RNG đời khi vẽ giao diện');
 const old=life();delete old.partner.home63;delete old.partner.homeCountry;delete old.partner.heritageId;const a=E.migrate(JSON.parse(JSON.stringify(old))),b=E.migrate(JSON.parse(JSON.stringify(old)));ok(a.partner.home63===b.partner.home63&&a.partner.heritageId===b.partner.heritageId,'bổ sung quê cho bản lưu cũ một cách tất định');const snapshot=JSON.stringify(a);E.migrate(a);ok(JSON.stringify(a)===snapshot,'mở lại bản lưu không đổi quê hoặc trạng thái');
 const l2=life();l2.partner=null;const d=E.DEC.love.make(l2,()=>.5);const origin=d.data.p.home63;run(l2,d,'yes');if(!l2.partner){l2.pending=[d];const key=d.opts.find(o=>o.k!=='no').k;E.resolve(l2,key);}ok(l2.partner&&l2.partner.home63===origin,'hồ sơ quê được giữ khi bắt đầu yêu');
}
for(const status of ['dating','cohabit','married']){const l=life();l.partner.status=status;ok(T.eligible(l,'mine')&&T.eligible(l,'theirs'),'đang yêu / chung nhà / đã cưới đều được mời nhau');}
{
 const l=life();ok(E.DEC.que_loi_moi.valid(l,{})&&E.TRIG.find(t=>t.id==='que_loi_moi').when(l),'lời mời ngẫu nhiên có thể xếp trước khi chuẩn bị dữ liệu');const d=E.DEC.que_loi_moi.make(l,()=>.5);ok(d.text.includes(l.partner.home63),'người yêu mời về đúng quê mình');run(l,d,'go');ok(l.pending[0].id==='que_chuyen_di'&&l.pending[0].data.side==='theirs','nhận lời mới lên kế hoạch');
 const q=life('Hà Nội','Hà Nội'),offer=E.DEC.que_loi_moi.make(q,()=>.5);ok(/cùng quê/.test(offer.text)&&T.transport(q,'Hà Nội').v===.06,'cùng quê là đi chơi địa phương (đi lại trong tỉnh vài chục nghìn — v5.6.1)');
}
for(const reason of ['breakup','death','sameNameNewPartner','jail','military','trapped','year','move','origin','currency','young','partnerYoung']){
 const l=life(),d=invoice(l,'theirs'),before=l.money;
 if(reason==='breakup')l.partner=null;if(reason==='death')l.partner.alive=false;if(reason==='sameNameNewPartner'){l.partner=Object.assign({},l.partner);delete l.partner.heritageId;T.partner(l,l.partner);}if(reason==='jail')l.jailUntil=33;if(reason==='military')l.flags.military=33;if(reason==='trapped')l.abroad={code:'KH',trapped:true};if(reason==='year')l.age++;if(reason==='move')l.movedTo='Cần Thơ';if(reason==='origin')l.partner.home63='Bến Tre';if(reason==='currency')l.cur='usd';if(reason==='young')l.age=17;if(reason==='partnerYoung')l.partner.age=17;
 ok(!E.DEC.que_thanh_toan.valid(l,d.data),'hóa đơn hết hiệu lực khi hoàn cảnh đổi: '+reason);run(l,d,'self');ok(l.money===before&&!l.flags.heritageTravel.visits.length,'không thu phí hoặc áp sang người khác: '+reason);
}
{
 const l=life();l.money=0;l.partner.inc=0;const d=invoice(l,'mine');ok(d.opts.length===1&&d.opts[0].k==='no','không đủ ngân sách chỉ hoãn lại');run(l,d,'self');ok(l.money===0&&!l.flags.heritageTravel.visits.length,'không tạo nợ hoặc tiền ảo');
 const q=life();q.partner.inc=1;const first=invoice(q,'mine','food');run(q,first,'partner');ok(q.partner.heritageSpending.spent<=1.2,'người yêu trả trong ngân sách thu nhập riêng');const next=invoice(q,'theirs');ok(!next.opts.some(o=>o.k==='partner'||o.k==='split'),'không tiếp tục dùng tiền riêng đã tiêu hết của người yêu');
 const k=life();run(k,invoice(k,'mine'),'self');ok(!T.eligible(k,'mine')&&T.eligible(k,'theirs'),'mỗi hướng tối đa một chuyến/năm');run(k,invoice(k,'theirs'),'self');ok(!T.eligible(k,'mine')&&!T.eligible(k,'theirs'),'cả đôi tối đa hai chuyến/năm');k.age++;ok(T.eligible(k,'mine'),'năm sau có thể lên lịch mới');
}
{
 const l=life();l.fam.mAlive=l.fam.fAlive=false;l.kids=[];const logs=run(l,invoice(l,'mine'),'self');ok(logs.every(e=>!/sum vầy|bố mẹ|con cháu/.test(e.t)),'không tự tạo người thân khi đi quê');
 for(const allergy of ['tôm, cua và hải sản có vỏ','đậu phộng','trứng']){const q=life();q.allergy=allergy;const logs=run(q,invoice(q,'theirs'),'self');ok(logs.some(e=>/kiểm tra thành phần và tránh/.test(e.t)),'món ăn theo dị ứng');}
 const a=life();a.flags.vegetarian=true;ok(/món chay/.test(T.meal(a,T.own(a))),'tôn trọng chế độ ăn chay');a.flags.vegetarian=false;a.religion='Hồi giáo';ok(/kiêng kỵ/.test(T.meal(a,T.own(a))),'tôn trọng kiêng kỵ tôn giáo');
}
{
 const l=life();l.abroad={code:'US',name:'Hoa Kỳ',perm:true};l.cur='usd';l.gdp=80;l.base=80000;l.money=100000;l.partner.inc=10000;const d=invoice(l,'mine'),cost=T.quote(l,d.data);ok(Math.abs(G.CUR.toVND(l.gdp,cost)-41.6)<.01,'ngân sách từ nước ngoài quy đổi đúng sang đơn vị game');const where=JSON.stringify(l.abroad);run(l,d,'self');ok(JSON.stringify(l.abroad)===where&&l.cur==='usd','du lịch về quê rồi trở lại nước đang sống');
 const q=life();q.country='US';delete q.prov;q.partner.homeCountry='JP';delete q.partner.home63;ok(!T.own(q)&&!T.eligible(q,'mine')&&!T.eligible(q,'theirs'),'không gán quê Việt Nam cho nhân vật và người yêu nước ngoài');const invalid=E.DEC.que_chuyen_di.make(q,()=>.5,{side:'theirs'});ok(!E.DEC.que_chuyen_di.valid(q,invalid.data),'không tự đổi điểm đến khi quê được chọn không hợp lệ');
 const p=life();p.partner.homeCountry='US';delete p.partner.home63;ok(T.eligible(p,'mine')&&!T.eligible(p,'theirs'),'có thể mời người yêu nước ngoài về quê Việt Nam của mình');
}
{
 let visits=0;
 for(let i=0;i<120;i++){
  const l=E.createLife({mode:i%4?'vn':'world',seed:464100+i});E.runHeadless(l);const history=l.flags.heritageTravel&&l.flags.heritageTravel.visits||[],years={};visits+=history.length;
  ok(!l.alive&&Number.isFinite(l.money)&&l.log.every(e=>!/undefined|NaN|\[object Object\]/.test(e.t))&&l.log.at(-1).k==='death','chạy đời đầy đủ với sự kiện quê hương không crash hoặc hỏng nhật ký');
  for(const v of history){years[v.age]=(years[v.age]||0)+1;ok(v.age>=18&&T.profile(v.province)&&v.self>=0&&v.partner>=0,'lịch sử đúng tuổi, đúng tỉnh và chi phí hợp lệ');}
  ok(Object.values(years).every(c=>c<=2),'mô phỏng không vượt hai chuyến đôi/năm');
 }
 ok(visits>10,'lời mời về quê phát sinh và có chuyến đi hoàn thành khi chơi tự động');
 console.log('INFO: '+visits+' chuyến đôi trong 120 đời mô phỏng.');
}
console.log('PASS: '+n+' kiểm tra quê hương 63 tỉnh thành bản 4.6.4.');
