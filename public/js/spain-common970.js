/* Common Spanish names extend NAMES, existing family records and the child handoff. */
(function(G){
 'use strict';
 var E=G.E,H=E.H,N=G.NAMES,X=E.UPDATE110;
 function year(l){return l.birthYear+l.age;}
 function copy(p){return p&&JSON.parse(JSON.stringify(p));}
 function eligible(l){return l.country==='ES'&&!(E.ROYAL858.context(l)||{}).h;}
 function profile(p){return p&&N.spanishParse(p.name||p.n,p.es970);}
 function state(l){return l.flags.spainCommon970||(l.flags.spainCommon970={orders:{},history:[]});}
 function parents(l){var f=l.fam;return {father:f.noDad?null:N.spanishParse(f.fName,f.fEs970),mother:f.noMom?null:N.spanishParse(f.mName,f.mEs970)};}
 function fill(l){
  if(!eligible(l))return;
  var f=l.fam,p=N.spanishParse(l.name,l.es970);if(p){l.es970=p;l.sur=p.first;if(!f.surnames970)f.surnames970=copy(p);}
  f.fEs970=N.spanishParse(f.fName,f.fEs970);f.mEs970=N.spanishParse(f.mName,f.mEs970);
  (l.kids||[]).concat(l.sibList||[]).forEach(function(k){var p=profile(k);if(p)k.es970=p;});
 }
 function updateName(l,p,newName,field){
  field=field||'name';var old=p[field];if(old===newName)return;
  if(p===l&&l.age>0)E.ID919.setLegal(l,newName,'hoàn tất hồ sơ hai họ');
  p[field]=newName;if(p.n===old)p.n=newName;if(p.name===old)p.name=newName;
  // Keep stable IDs and historical records; update current biography labels only.
  var bios=l.flags.life138&&l.flags.life138.people;
  Object.values(bios||{}).forEach(function(b){if(b.name===old)b.name=newName;});
 }
 function rewriteBirthText(l,old,name){
  (l.log||[]).concat(l.mem||[]).forEach(function(v){if(v&&v.t)v.t=v.t.split(old).join(name);});
 }
 var make=E.createLife;
 E.createLife=function(opts){
  var l=make.apply(this,arguments);if(!eligible(l))return l;
  fill(l);var f=l.fam,r=E.LIFE138.random(l.id+':spanish-family970'),p=parents(l),old=l.name;
  if(!opts||!opts.parent){
   if(!l.custom&&l.es970){
    var n=N.spanishChild(r,l.sex,p.father,p.mother,'father',' ',l.es970.given);
    updateName(l,l,n.full);l.es970=n;l.sur=n.first;rewriteBirthText(l,old,n.full);
   }else if(l.es970){
    // A custom full name is authoritative; parents' surname units match that birth record.
    if(p.father){var dad=N.spanishName(p.father.given,l.es970.first,p.father.second);updateName(l,f,dad.full,'fName');f.fEs970=dad;}
    if(p.mother){var mom=N.spanishName(p.mother.given,f.noDad?l.es970.first:l.es970.second,f.noDad?l.es970.second:p.mother.second);updateName(l,f,mom.full,'mName');f.mEs970=mom;}
   }
   (l.sibList||[]).filter(function(k){return !k.step138;}).forEach(function(k){
    var p=profile(k),old=k.name||k.n;if(!l.es970)return;
    var n=N.spanishName(p?p.given:N.spanishGiven(r,k.sex),l.es970.first,l.es970.second,l.es970.joiner);k.es970=n;
    updateName(l,k,n.full,k.name?'name':'n');rewriteBirthText(l,old,n.full);
   });
  }else if(opts.parent.es970){
   var registered=copy(opts.parent.es970);
   if(registered.full===opts.name&&E.ID919.validName(registered.full,'ES')===true){var shortened=l.name;updateName(l,l,registered.full);rewriteBirthText(l,shortened,registered.full);l.es970=registered;l.sur=registered.first;}
  }
  if(l.es970)f.surnames970=copy(l.es970);
  var rec=l.flags.id919&&l.flags.id919.name;
  if(rec&&l.age===0){rec.legal=rec.display=rec.birth=l.name;rec.family=l.es970?[l.es970.first,l.es970.second]:rec.family;rec.hist=[{at:0,legal:l.name,why:'lúc sinh'}];}
  return l;
 };
 // Future siblings use the same surname pair, including multiword and repeated surnames.
 var name=H.name;
 H.name=function(l,r,sex,sur){
  if(eligible(l)&&l.es970&&sur===l.sur){var family=l.fam.surnames970||l.es970,p=N.spanishName(N.spanishGiven(r,sex),family.first,family.second,family.joiner);return {full:p.full,sub:'',sur:p.first,es970:p};}
  return name.apply(this,arguments);
 };
 function pair(l){var partner=l.partner;return partner?String(partner.relation108||partner.uid110||partner.name):'single';}
 function order(l){var s=state(l),key=pair(l);if(s.orders[key])return s.orders[key];
  var prior=(l.kids||[]).find(function(k){return k.es970&&(k.esParents970===key||k.mate&&l.partner&&k.mate.name===l.partner.name);});
  var me=profile(l),other=profile(l.partner),mom=l.sex==='F'?me:other;
  return s.orders[key]=prior?{order:prior.es970.order||(mom&&prior.es970.first===mom.first&&me.first!==other?.first?'mother':'father'),joiner:prior.es970.joiner||' ',locked:true}:{order:'father',joiner:' ',locked:false};
 }
 function childName(l,r,k){
  var me=profile(l),other=profile(k.mate||l.partner),father=l.sex==='M'?me:other,mother=l.sex==='F'?me:other;
  if(!me)return null;
  // For two registered parents of the same sex, retain their two distinct surname lines.
  if(l.partner&&l.partner.sex===l.sex){father=me;mother=other;}
  var o=order(l),old=profile(k),chosenOrder=year(l)>=2000?o.order:'father',chosenJoin=year(l)>=1959?o.joiner:' ',n=N.spanishChild(r,k.sex,father,mother,chosenOrder,chosenJoin,old&&old.given);
  var taken=(l.kids||[]).filter(function(c){return c!==k;}).map(function(c){return (profile(c)||{}).given;});
  for(var i=0;i<30&&taken.includes(n.given);i++)n=N.spanishChild(r,k.sex,father,mother,chosenOrder,chosenJoin);
  n.order=father&&mother?(year(l)>=2000?o.order:'father'):'single';o.locked=true;k.esParents970=pair(l);return n;
 }
 function registerBirth(l,k,r,lines){
  if(!eligible(l))return;var n=childName(l,r,k);if(!n)return;var old=k.name;updateName(l,k,n.full);k.es970=n;
  (lines||[]).forEach(function(v){v[0]=v[0].split(old).join(n.full);});rewriteBirthText(l,old,n.full);
 }
 function kidOptions(l,k){
  var r=E.LIFE138.random(l.id+':spanish-naming970:'+X.uid(l,k)),p=profile(k),taken=(l.kids||[]).filter(function(c){return c!==k;}).map(function(c){return (profile(c)||{}).given;}),out=[];
  for(var i=0;i<30&&out.length<5;i++){var name=N.spanishName(N.spanishGiven(r,k.sex),p.first,p.second,p.joiner).full;
   if(!taken.includes(N.spanishParse(name).given)&&!out.some(function(o){return o.full===name;}))out.push({full:name,why:'tên gọi gia đình chọn'});
  }return out;
 }
 var childOpts=E.childOpts;
 E.childOpts=function(l,k){var o=childOpts.apply(this,arguments);if(eligible(l)&&k.es970)o.parent.es970=copy(k.es970);return o;};
 var inherit=E.heirAtAge;
 E.heirAtAge=function(l,k){var next=inherit.apply(this,arguments);if(next&&eligible(next)&&k.es970){next.es970=copy(k.es970);next.sur=next.es970.first;}return next;};
 var migrate=E.migrateExt;
 E.migrateExt=function(l){var result=migrate.apply(this,arguments);fill(l);return result;};
 function reason(l){return l.alive&&eligible(l)&&profile(l)?X.reason(l,16):'Dành cho hồ sơ thường dân Tây Ban Nha có đủ hai họ';}
 function request(l,kind){
  if(reason(l)!==true||l.age<18||!['reverse','join','maternal'].includes(kind))return false;var s=state(l),p=profile(l),mom=N.spanishParse(l.fam.mName,l.fam.mEs970);
  if(s.pending||s.lastYear===year(l)||kind==='reverse'&&year(l)<2000||kind==='join'&&year(l)<2021||kind==='maternal'&&year(l)<2021)return false;
  var target=kind==='reverse'?N.spanishName(p.given,p.second,p.first,p.joiner):kind==='join'?N.spanishName(p.given,p.first,p.second,p.joiner===' y '?' ':' y '):mom?N.spanishName(p.given,mom.first,mom.second):null;
  if(!target||target.full===l.name)return false;
  s.pending={kind:kind,at:year(l),from:l.name,target:target,singleFiliation:kind==='maternal'&&!!l.fam.noDad&&!l.fam.orphan?.unknown};s.lastYear=year(l);return true;
 }
 function decide(l,log){
  var s=state(l),q=s.pending;if(reason(l)!==true||!q||year(l)<=q.at)return false;
  if(l.name!==q.from){s.history.push({at:year(l),status:'closed',reason:'Tên đã thay đổi trong lúc chờ'});delete s.pending;return false;}
  if(q.kind==='maternal'&&!(q.singleFiliation&&l.fam.noDad)){
   s.history.push({at:year(l),status:'evidence-required',kind:q.kind});delete s.pending;
   log('Hồ sơ đổi hoàn toàn sang hai họ của mẹ cần căn cứ và giấy tờ bổ sung. Tên pháp lý của bạn được giữ; mong muốn tri ân gia đình bên ngoại chưa đủ để tự động bỏ họ cha.','neutral');return false;
  }
  s.history.push({at:year(l),from:l.name,to:q.target.full,kind:q.kind,status:'approved'});updateName(l,l,q.target.full);l.es970=copy(q.target);l.sur=q.target.first;delete s.pending;
  log('Hồ sơ đã hoàn tất. Tên đăng ký của bạn là '+l.name+'.','good');return true;
 }
 X.menu('spainCommon970','Tên và hai họ trong gia đình',reason,function(l){var p=profile(l),s=state(l);return l.name+'\nHọ thứ nhất: '+p.first+'; họ thứ hai: '+p.second+'.'+(s.pending?'\nĐang chờ xử lý hồ sơ: '+s.pending.target.full+'.':'')+'\nHọ đã đăng ký của con được giữ khi cha mẹ đổi tên. Mỗi thế hệ truyền họ thứ nhất của từng người.';},function(l){
  fill(l);var out=[],o=order(l),s=state(l),expectedPair=pair(l);
  if(l.partner&&!o.locked){
   ['father','mother'].forEach(function(v){if(v==='mother'&&year(l)<2000)return;out.push({k:v,l:v==='father'?'Đăng ký họ cha trước cho các con':'Đăng ký họ mẹ trước cho các con',run:function(l,r,log){if(pair(l)!==expectedPair||order(l).locked||v==='mother'&&year(l)<2000)return;order(l).order=v;log('Đã thống nhất thứ tự họ cho các con của hai người.','neutral');X.next(l,'spainCommon970',r);}});});
   if(year(l)>=1959)out.push({k:'childJoin',l:o.joiner===' y '?'Dùng khoảng trắng giữa hai họ của con':'Dùng chữ y giữa hai họ của con',run:function(l,r){if(pair(l)!==expectedPair||order(l).locked||year(l)<1959)return;var o=order(l);o.joiner=o.joiner===' y '?' ':' y ';X.next(l,'spainCommon970',r);}});
  }
  if(l.age>=18&&!s.pending){[['reverse','Xin đảo thứ tự hai họ',2000],['join','Xin đổi cách nối hai họ',2021],['maternal','Xin xét hồ sơ dùng hai họ của mẹ',2021]].forEach(function(v){if(year(l)>=v[2])out.push({k:v[0],l:v[1],why:s.lastYear===year(l)?'Đã nộp hồ sơ trong năm':true,run:function(l,r,log){if(request(l,v[0]))log('Đã nộp hồ sơ '+state(l).pending.target.full+'. Bạn có thể xem kết quả từ năm sau.','neutral');}});});}
  if(s.pending&&year(l)>s.pending.at)out.push({k:'decision',l:'Xem kết quả hồ sơ đổi họ',run:function(l,r,log){decide(l,log);X.next(l,'spainCommon970',r);}});
  return out;
 },16,'Tình cảm & gia đình');
 var report=E.profile;E.profile=function(l){var p=report.apply(this,arguments);if(eligible(l)&&l.es970)p.jobInfo.push('Hai họ đăng ký: '+l.es970.first+' / '+l.es970.second);return p;};
 E.SPAIN_COMMON970={eligible:eligible,fill:fill,profile:profile,parents:parents,state:state,order:order,request:request,decide:decide,registerBirth:registerBirth,kidOptions:kidOptions};
})(globalThis.G);
