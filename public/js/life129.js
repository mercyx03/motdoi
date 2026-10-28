/* Family continuity: living estates, child households and family decisions. */
(function(G){'use strict';
var E=G.E,H=E.H,U=G.U,X=E.UPDATE110;
function clone(x){return JSON.parse(JSON.stringify(x));}
function state(l){return l.flags.family129||(l.flags.family129={});}
function free(l){return X.reason(l,18);}
function kids(l){E.FAMILY53.init(l);return (l.kids||[]).filter(function(k){return k.alive!==false;});}
function child(l,id){return kids(l).find(function(k){return k.parentId===id;});}
function menu(id,title,text,rows){X.menu(id,title,free,text,rows,18,'Tình cảm & gia đình');}
function annual(l,key){return state(l)[key]!==l.age;}
function mark(l,key){state(l)[key]=l.age;}
// Shared family time raises closeness with the children involved, the partner and living parents.
function bond(l,children,n){children.forEach(function(k){k.close=U.clamp((k.close||50)+n,0,100);});var p=l.partner;if(p&&p.alive!==false)p.close=U.clamp((p.close==null?60:p.close)+n,0,100);if(E.FAMILY100)['m','f'].forEach(function(side){if(E.FAMILY100.targets(l,'parent').includes(side)){var s=E.FAMILY100.info(l,'parent',side);s.trust=U.clamp(s.trust+n,0,100);}});}

// Freeze the parent's estate at the handoff, and settle only after their actual death.
// The other life is no longer simulated. Gifts already removed from ownership are excluded.
function estateRecord(l,k){
 var copy=clone(l);copy.alive=false;copy.death={age:l.age,cause:''};delete copy.flags.estate65;
 if(copy.flags.will70)delete copy.flags.will70.settlement;
 var p=E.ESTATE84.allocate(copy).list.find(function(p){return p.kid===l.kids.indexOf(k);});
 return {side:l.sex==='F'?'m':'f',name:l.name,sex:l.sex,at:l.age-k.born,amt:p?p.cash:0,items:p?clone(p.items):[],cur:l.cur,base:l.base,ctx:l.abroad&&l.abroad.perm?l.abroad.code:l.country,note:l.flags.will70&&l.flags.will70.note||'',done:false};
}
var opts=E.childOpts;
E.childOpts=function(l,k){var o=opts.apply(this,arguments);if(l.alive)o.parent.livingEstate129=estateRecord(l,k);return o;};
function scaleEstate(l,f,factor){f.amt*=factor;(f.items||[]).forEach(function(x){x.v*=factor;if(E.BUSINESS137)E.BUSINESS137.scaleItem(x,factor);if(x.data)['v','basis','cap','unit','R'].forEach(function(k){if(typeof x.data[k]==='number')x.data[k]*=factor;});});f.cur=l.cur;f.base=l.base;}
var create=E.createLife;
E.createLife=function(o){var l=create.apply(this,arguments);if(o&&o.parent&&o.parent.livingEstate129){var f=clone(o.parent.livingEstate129);if(f.cur!==l.cur||f.ctx!==(l.abroad&&l.abroad.perm?l.abroad.code:l.country))scaleEstate(l,f,l.base/f.base);state(l).estate=f;}return l;};
function restoreEstate(l,parent){
 var s=state(l),prior=l.flags.expansion110&&l.flags.expansion110.livingParent;
 if(s.estate||!prior||!parent||parent.name!==prior.name||parent.sex!==prior.sex)return false;
 var k=(parent.kids||[]).find(function(k){return k.name===l.name&&parent.birthYear+k.born===l.birthYear;});if(!k)return false;
 var f=estateRecord(parent,k);if(f.cur!==l.cur||f.ctx!==(l.abroad&&l.abroad.perm?l.abroad.code:l.country))scaleEstate(l,f,l.base/f.base);s.estate=f;return true;
}
var convert=E.abroadConvert;
E.abroadConvert=function(l,factor){var out=convert.apply(this,arguments),f=state(l).estate;if(f&&!f.done)scaleEstate(l,f,factor);(l.kids||[]).forEach(function(k){if(k.spouse126&&typeof k.spouse126.inc==='number')k.spouse126.inc*=factor;var q=k.future126&&k.future126.proposal129;if(q){q.fee*=factor;if(typeof q.person.inc==='number')q.person.inc*=factor;q.cur=null;}});return out;};
function settle(l,log){var f=state(l).estate;if(!f||f.done||l.age<f.at||l.fam[f.side+'Alive'])return;
 if(l.age<18){f.trust=true;return;}f.done=true;
 H.cash(l,f.amt,'Thừa kế từ '+f.name);E.ESTATE84.receive(l,f,clone(f.items),log,l.age);
 log('Nhận di sản của '+f.name+' theo bản di chúc đã lưu khi chuyển đời: '+H.money(l,f.amt)+' tiền mặt'+(f.items.length?' và '+f.items.length+' tài sản':'')+'.','big');if(f.note)log('Lời nhắn: '+f.note,'neutral');
}
// Suppress the generic randomly generated inheritance for this same parent.
var inheritance=E.DEC.chia_tai_san;
if(inheritance){var iv=inheritance.valid;inheritance.valid=function(l,d){return !state(l).estate&&(!iv||iv(l,d));};}

// Four completed transactions per direction/year. Browsing or cancelling consumes no quota.
function trades(l,id){var s=state(l);if(!s.trades||s.trades.at!==l.age)s.trades={at:l.age};return s.trades[id]||0;}
['dau_tu_lon','quan_ly_dau_tu'].forEach(function(id){
 var a=E.ACT.find(function(a){return a.id===id;});if(!a)return;
 var av=a.avail;a.avail=function(l){return trades(l,id)>=4?'Đã đủ 4 giao dịch năm nay':av?av(l):true;};
 var def=E.DEC[a.sc||id],apply=def.apply,make=def.make;
 def.make=function(l){var d=make.apply(this,arguments);d.data=d.data||{};d.data.tradeAt129=l.age;d.text+=' Giao dịch đã hoàn tất năm nay: '+trades(l,id)+'/4.';return d;};
 def.apply=function(l,d,key){if(d.data.tradeAt129!=null&&d.data.tradeAt129!==l.age||trades(l,id)>=4)return;var before=(l.props||[]).length+(l.ventures||[]).length,out=apply.apply(this,arguments),after=(l.props||[]).length+(l.ventures||[]).length;if(after!==before)state(l).trades[id]=trades(l,id)+1;if(l.flags.actAt)delete l.flags.actAt[id];return out;};
});

var step=E.DEC.di_buoc_nua,stepApply=step.apply;
step.apply=function(l,d,key,r,log){if(state(l).stepParent||!step.valid(l,d.data))return;stepApply.apply(this,arguments);if(key==='ung_ho'){
 var side=l.fam.fAlive?'f':'m',sex=side==='f'?'F':'M';state(l).stepParent={name:H.stranger(l,r,sex),sex:sex,born:l.age-Math.max(30,l.fam[side+'Age']+l.age+U.randint(r,-5,5)),alive:true,side:side};log((sex==='M'?'Bố dượng ':'Mẹ kế ')+state(l).stepParent.name+' trở thành một thành viên trong gia đình.','good');
}};
var elite=E.DEC.elite_hon_nhan,em=elite.make,ea=elite.apply;
elite.make=function(l,r){var d=em.apply(this,arguments);d.data.salary129=l.cur==='vnd'?U.randint(r,120,300):l.base*(1.5+r()*2);d.text+=' Người được giới thiệu đang quản lý doanh nghiệp gia đình, thu nhập '+H.money(l,d.data.salary129)+'/tháng.';return d;};
elite.apply=function(l,d,key,r,log){if(l.age<18)return;ea.apply(this,arguments);if(key==='yes'&&l.partner&&l.partner.name===d.data.n){var p=l.partner;p.age=Math.max(18,p.age);p.jobId='tai_phiet';p.job=E.CAR.tai_phiet.t[0];p.inc=d.data.salary129|| (l.cur==='vnd'?200:l.base*2);p.incKnown=true;p.familyBackground129=d.data.who;p.rankSince=l.age;}};
function secondarySchool(l){return l.school==='upper'||l.school==='lower';}
var marriage=E.DEC.marry,mv=marriage.valid,mm=marriage.make,ma=marriage.apply;
marriage.valid=function(l,d){return !secondarySchool(l)&&l.age>=18&&(!mv||mv(l,d));};
marriage.make=function(l){var d=mm.apply(this,arguments);if(secondarySchool(l)||l.age<18)d.opts=[{k:'wait',l:'Tập trung học, chưa bàn chuyện kết hôn'}];return d;};
marriage.apply=function(l,d,k){if(!marriage.valid(l,d.data))return;return ma.apply(this,arguments);};
var contract=E.DEC.contract108,cv=contract.valid;contract.valid=function(l,d){return !secondarySchool(l)&&cv(l,d);};
var work=E.DEC.tim_nguoi_yeu.def.opts.find(function(o){return o.k==='work';});if(work){var wr=work.req;work.req=function(l,d){return !!(l.school||l.job||l.retired||l.age>=60)&&(!wr||wr(l,d));};}

menu('custody129','Nơi sống của con ngoài hôn nhân','Hai cha mẹ bàn nơi ở ổn định cho con; người không sống cùng vẫn có trách nhiệm cấp dưỡng. Mỗi con có thể điều chỉnh một lần mỗi năm.',function(l){var rows=[];kids(l).filter(function(k){return l.age-k.born<18&&(k.oow||k.birthContext108==='outside'||k.birthContext108==='affair');}).forEach(function(k){['me','other','both'].forEach(function(where){rows.push({k:k.parentId+where,l:k.name+' · '+(where==='both'?'Luân phiên hai nhà':where==='me'?'Sống cùng '+(l.sex==='M'?'ba (bạn)':'mẹ (bạn)'):'Sống cùng '+(k.coParent108?k.coParent108.name:k.otherParent||'người còn lại')),why:k.custodyAt129===l.age?'Đã thỏa thuận trong năm':true,run:function(l,r,log){k.custody=where;k.custodyAt129=l.age;delete k.residence112;delete k.homeGift112;log('Thống nhất nơi ở của '+k.name+': '+E.kidWhere(l,k)+'.','good');}});});});return rows;});

menu('schoolMeeting129','Họp phụ huynh','Xem học lực, hành vi và quan hệ bạn bè của từng con; chọn cách hỗ trợ phù hợp.',function(l){return kids(l).filter(function(k){var a=l.age-k.born;return a>=6&&a<18&&k.vice!=='bỏ học';}).map(function(k){return{k:k.parentId,l:k.name+' · học lực '+Math.round(k.study||50)+'/100',why:k.meetingAt129===l.age?'Đã họp năm nay':true,run:function(l,r){X.next(l,'schoolSupport129',r,{id:k.parentId});}};});});
X.menu('schoolSupport129','Nhận xét của giáo viên',free,function(l,d){var k=child(l,d.arg.id);if(!k)return 'Hồ sơ đã thay đổi.';return k.name+': học lực '+Math.round(k.study||50)+'/100; hành vi '+(k.vice||((k.close||50)<40?'có dấu hiệu thu mình':'hợp tác trong lớp'))+'; bạn bè '+((k.close||50)<40?'cần được lắng nghe':'hòa đồng')+'. Trao đổi cùng người đang chăm con.';},function(l,arg){var k=child(l,arg.id);if(!k||k.meetingAt129===l.age||l.age-k.born<6||l.age-k.born>=18||k.vice==='bỏ học')return[];return [['listen','Lắng nghe con và phối hợp giáo viên',0,3,6],['tutor','Hỗ trợ học tập · '+H.money(l,l.base*.08),.08,8,2],['pressure','Đặt kỳ vọng cao, yêu cầu cải thiện',0,2,-5]].map(function(x){return{k:x[0],l:x[1],why:l.money>=l.base*x[2]?true:'Chưa đủ tiền',run:function(l,r,log){if(l.money<l.base*x[2])return;k.meetingAt129=l.age;H.cash(l,-l.base*x[2],'Hỗ trợ học tập cho '+k.name);k.study=U.clamp((k.study||50)+x[3],0,100);k.close=U.clamp((k.close||50)+x[4],0,100);log('Sau buổi họp của '+k.name+', bạn chọn '+x[1]+'.','neutral');}};});},18);

menu('grandCare129','Ông bà cùng chăm cháu','Ông bà có thể trông trẻ, truyền kinh nghiệm và trao đổi khác biệt trong cách dạy cháu.',function(l){if(!l.fam.mAlive&&!l.fam.fAlive)return[];var small=kids(l).filter(function(k){return l.age-k.born<18&&!!E.FAMILY100&&E.FAMILY100.localChild(l,k);});if(!small.length)return[];return [['care','Nhờ ông bà trông cháu'],['wisdom','Nghe ông bà chia sẻ kinh nghiệm'],['boundaries','Thống nhất cách dạy, tránh chiều hoặc ép cháu']].map(function(x){return{k:x[0],l:x[1],why:annual(l,'grandAt')?true:'Đã sinh hoạt cùng ông bà năm nay',run:function(l,r,log){mark(l,'grandAt');if(x[0]==='care'&&r()<.3){state(l).grandConflict=true;log('Ông bà và bạn bất đồng về giờ ngủ và việc chiều cháu. Cần trao đổi lại cách chăm sóc.','neutral');H.fx(l,{hap:-2});}else{state(l).grandConflict=false;bond(l,small,5);small.forEach(function(k){if(x[0]==='wisdom')k.study=U.clamp((k.study||50)+2,0,100);});H.fx(l,{hap:5,soc:5});log(x[1]+'. Cả nhà chia sẻ trách nhiệm, các cháu gần gũi ông bà hơn. Hạnh phúc +5, gắn kết +5.','good');}}};});});

function candidates(l){var s=state(l);if(!s.orphanage||s.orphanage.at!==l.age){var holder={rs:(l.rs^l.age)|0},r=function(){return U.rand(holder);};s.orphanage={at:l.age,children:[]};for(var i=0;i<5;i++){var sex=i%2?'F':'M';s.orphanage.children.push({id:l.age+':'+i,name:H.stranger(l,r,sex),sex:sex,age:1+Math.floor(r()*12),trait:['nhút nhát','hướng ngoại','thông minh','mạnh mẽ','hướng nội'][i],story:['Mồ côi cả cha mẹ, không còn người thân đủ điều kiện chăm sóc','Cha mẹ mất tích, đang được mái ấm bảo trợ','Mất cha mẹ, ông bà đã quá già để nuôi dưỡng','Bị bỏ rơi từ nhỏ, không tìm được người thân','Không còn người thân chăm sóc, đang sống tại cô nhi viện'][i],adopted:false});}}return s.orphanage.children;}
menu('orphanage129','Thăm cô nhi viện · hồ sơ nhận con nuôi','Mỗi năm có 5 hồ sơ trẻ cần gia đình. Chọn xem từng hồ sơ trước khi nhận nuôi; chi phí là chuẩn bị sinh hoạt cho trẻ.',function(l){return candidates(l).filter(function(c){return !c.adopted;}).map(function(c){return{k:c.id,l:c.name+' · '+c.age+' tuổi · '+(c.sex==='M'?'nam':'nữ')+' · '+c.trait,run:function(l,r){X.next(l,'adoptChild129',r,{id:c.id});}};});});
X.menu('adoptChild129','Hồ sơ nhận nuôi',free,function(l,d){var c=candidates(l).find(function(c){return c.id===d.arg.id;});return c?c.name+' · '+c.age+' tuổi · '+c.trait+'. '+c.story+'. Chuẩn bị '+H.money(l,l.base*.15)+'.':'Hồ sơ đã thay đổi.';},function(l,arg){var c=candidates(l).find(function(c){return c.id===arg.id&&!c.adopted;});if(!c)return[];return[{k:'adopt',l:'Hoàn tất hồ sơ và đón con về nhà',why:l.age>=25&&l.age-c.age>=18&&l.indep&&l.money>=l.base*.65?true:'Cần từ 25 tuổi, hơn trẻ ít nhất 18 tuổi, tự lập và đủ quỹ chăm sóc',run:function(l,r,log){if(c.adopted)return;c.adopted=true;H.cash(l,-l.base*.15,'Chuẩn bị đón con nuôi');var k={name:c.name,sex:c.sex,born:l.age-c.age,alive:true,adopt:true,adopted:true,close:55,study:50,edu:c.age>=12?1:0,inc:0,kids:0,custody:'me',adoption129:{trait:c.trait,story:c.story,at:l.age}};l.kids.push(k);E.FAMILY53.init(l);E.FAMILY126.init(l,k).trait=c.trait;log('Đón '+k.name+' từ cô nhi viện về gia đình. Bạn trở thành '+(l.sex==='M'?'ba':'mẹ')+' nuôi của con.','big');}}];},18);

menu('celebration129','Lễ Tết, sinh nhật và cưới hỏi','Chọn dịp sum họp và mức chi phù hợp. Mỗi dịp tổ chức một lần mỗi năm, dù chọn cách giản dị hay tiệc lớn. Tình cảm gia đình không phụ thuộc giá bữa tiệc.',function(l){
 var relatives=kids(l),hasFamily=relatives.length||l.partner&&l.partner.alive!==false||l.fam.mAlive||l.fam.fAlive;if(!hasFamily)return[];
 return (E.celebrationItems173?E.celebrationItems173(l):[['tet',H.inVN(l)?'Đón Tết cùng gia đình':'Sum họp lễ gia đình',.08],['birthday','Mừng sinh nhật người thân',.04],['wedding','Dự cưới họ hàng',.06]]).reduce(function(out,x){
  [['',1,''],[':simple',0,' · cùng chuẩn bị, lời chúc và kỷ niệm tại nhà'],[':venue',4,' · tổ chức tại nhà hàng']].forEach(function(style){var cost=l.base*x[2]*style[1];out.push({k:x[0]+style[0],l:x[1]+style[2]+' · '+H.money(l,cost),why:!annual(l,x[0])?'Đã tổ chức năm nay':cost===0||l.money>=cost?true:'Chưa đủ tiền',run:function(l,r,log){if(!annual(l,x[0])||cost>0&&l.money<cost)return;mark(l,x[0]);if(cost)H.cash(l,-cost,x[1]);bond(l,relatives,5);H.fx(l,{hap:5,soc:5});H.mem(l,x[1]+style[2]+'.',3);log(x[1]+style[2]+', cả nhà có thêm một kỷ niệm chung. Hạnh phúc +5, gắn kết +5.','good');}});});return out;
 },[]);
});

// Every adult child has an individual marriage preference; no automatic wedding debit.
function marriagePlan(l,k){var s=E.FAMILY126.init(l,k);if(!s.marriage129){var n=0;for(var i=0;i<k.name.length;i++)n=(n*31+k.name.charCodeAt(i))>>>0;s.marriage129=['early','usual','late','single'][n%4];}return s.marriage129;}
function suitor(l,k,r){var sex=k.orient==='gay'?k.sex:k.orient==='bi'?(r()<.5?'M':'F'):k.sex==='M'?'F':'M';return {name:H.stranger(l,r,sex),sex:sex,age:Math.max(18,l.age-k.born+U.randint(r,-2,3)),job:U.pick(r,['kỹ sư','giáo viên','nhân viên văn phòng','kinh doanh']),inc:l.base/12*(1+r()*3),family:U.pick(r,['gia đình lao động','gia đình kinh doanh','gia đình trí thức']),compatibility:.5+r()*.5};}
E.childMarriage126=function(l,k,r,log){
 E.FAMILY53.init(l);var s=E.FAMILY126.init(l,k),age=l.age-k.born,plan=marriagePlan(l,k);if(k.married||age<18||s.marriageAt129===l.age)return true;s.marriageAt129=l.age;
 if(s.proposal129)return true;
 if(!s.match){var min=plan==='early'?18:plan==='late'?35:23;if(plan==='single'||age<min||r()>=.16)return true;s.match={person:suitor(l,k,r),since:l.age,stage:'dating'};log(k.name+' đang tìm hiểu '+s.match.person.name+'.','neutral');return true;}
 var datingPerson=s.match.person,datedAt=datingPerson.at129==null?s.match.since:datingPerson.at129;if(l.age>datedAt)datingPerson.age+=l.age-datedAt;datingPerson.at129=l.age;if(l.age-s.match.since<2)return true;var p=s.match.person;if(p.age<18||p.compatibility<=.25){delete s.match;log(k.name+' dừng tìm hiểu vì chưa phù hợp.','neutral');return true;}
 s.proposal129={person:clone(p),at:l.age,fee:l.base*.25,cur:l.cur};if(!p.inc)s.proposal129.person.inc=l.base/12*1.5;
 X.next(l,'childWedding129',r,{id:k.parentId},{manual:false});log(k.name+' muốn kết hôn và hỏi ý kiến cùng khoản hỗ trợ tổ chức cưới của bạn.','big');return true;
};
function proposal(l,arg){var k=child(l,arg.id);return k&&!k.married&&l.age-k.born>=18&&E.FAMILY126.init(l,k).proposal129;}
X.menu('childWedding129','Con xin ý kiến chuyện cưới',free,function(l,d){var q=proposal(l,d.arg),k=child(l,d.arg.id);if(!q)return 'Đề nghị đã được giải quyết.';var p=q.person;return k.name+' muốn cưới '+p.name+' · '+p.age+' tuổi · '+p.job+' · thu nhập '+H.money(l,p.inc)+'/tháng · '+(p.family||'gia cảnh đang tìm hiểu')+'. Chi phí lễ cưới và sính lễ: '+H.money(l,q.fee)+'.';},function(l,arg){var q=proposal(l,arg),k=child(l,arg.id);if(!q)return[];return [{k:'yes',l:'Đồng ý, chi tiền lễ cưới và sính lễ',why:q.cur===l.cur&&l.money>=q.fee?true:'Chưa đủ tiền hoặc cần lập lại dự toán theo tiền tệ hiện tại',run:function(l,r,log){if(!proposal(l,arg)||l.money<q.fee||q.cur!==l.cur)return;H.cash(l,-q.fee,'Lễ cưới và sính lễ cho '+k.name);k.married=true;k.spouse126=q.person;k.spouse126.at129=l.age;delete E.FAMILY126.init(l,k).proposal129;delete k.future126.match;k.close=U.clamp((k.close||50)+5,0,100);log(k.name+' kết hôn với '+q.person.name+'. Bạn hỗ trợ '+H.money(l,q.fee)+' tổ chức lễ cưới.','big');}},{k:'no',l:'Chưa đồng ý, từ chối tài trợ và trao đổi với con',run:function(l,r,log){delete k.future126.proposal129;delete k.future126.match;k.close=U.clamp((k.close||50)-5,0,100);log('Bạn chưa đồng ý hôn sự của '+k.name+', chưa chi tiền. Con cần thêm thời gian trao đổi và tự quyết định tương lai.','neutral');}}];},18);
menu('weddings129','Xem đề nghị kết hôn của con','Xem đối tượng và ngân sách trước khi quyết định.',function(l){return kids(l).filter(function(k){return k.future126&&k.future126.proposal129;}).map(function(k){return{k:k.parentId,l:k.name,run:function(l,r){var q=k.future126.proposal129;if(q.cur!==l.cur){q.fee=l.base*.25;q.cur=l.cur;}X.next(l,'childWedding129',r,{id:k.parentId},{manual:false});}};});});

function statusPerson(l){var a=l.flags.affair107;return a&&a.person108&&a.person108.alive!==false?a.person108:(l.flags.network108||[]).find(function(p){return p.alive!==false&&p.age>=18&&p.status==='ambiguous';})||(l.partner&&l.partner.alive!==false&&l.partner.status==='dating'?l.partner:null);}
E.SC('status129',{title:'Người ấy muốn một danh phận rõ ràng',valid:function(l,d){var p=statusPerson(l);return l.age>=18&&p&&p.age>=18&&(!d||d.name==null||d.name===p.name);},prep:function(l){return {name:statusPerson(l).name};},text:function(l,d){return d.name+' không muốn tiếp tục mối quan hệ mập mờ, đề nghị nói rõ vị trí của mình và trách nhiệm với con nếu có.';},opts:[{k:'talk',l:'Nói thật, thống nhất ranh giới và trách nhiệm',run:function(l,r,log,d){log('Bạn và '+d.name+' trao đổi thẳng thắn. Chuyện cưới hay chia tay cần được giải quyết riêng, trách nhiệm với con vẫn được giữ.','neutral');H.fx(l,{hap:2});}},{k:'delay',l:'Lảng tránh, xin thêm thời gian',run:function(l,r,log,d){var p=statusPerson(l);if(p)p.affection108=Math.max(0,(p.affection108||35)-10);H.fx(l,{hap:-4});log(d.name+' thất vọng vì bạn tiếp tục né tránh chuyện danh phận.','bad');}}]});
E.TRIG.push({id:'status129',when:function(l){return free(l)===true&&E.DEC.status129.valid(l);},p:.15,cd:3,max:4});

function year(l,r,log){if(!l.alive)return;settle(l,log);var s=state(l);if(s.year===l.age)return;s.year=l.age;
 var sp=s.stepParent;if(sp&&sp.alive&&l.age-sp.born>75&&r()<.04){sp.alive=false;log(sp.name+' qua đời, gia đình cùng lo hậu sự.','bad');}
 kids(l).forEach(function(k){marriagePlan(l,k);if(k.married&&!k.spouse126){k.spouse126=suitor(l,k,r);k.spouse126.at129=l.age;}if(k.spouse126){var p=k.spouse126;if(p.at129==null)p.at129=l.age;if(l.age>p.at129){p.age+=l.age-p.at129;p.at129=l.age;}}
 var gs=k.grandchildren129||(k.grandchildren129=[]);while(gs.length<(k.kids||0)){var sex=r()<.5?'M':'F';gs.push({name:H.stranger(l,r,sex),sex:sex,born:l.age,alive:true});}
 });
}
E.HOOKS.year.push(year);
[['celebration129',.25],['schoolMeeting129',.3],['grandCare129',.15]].forEach(function(x){E.TRIG.push({id:x[0],when:function(l){if(free(l)!==true)return false;if(x[0]==='celebration129')return kids(l).length>0&&annual(l,'tet');if(x[0]==='grandCare129')return (l.fam.mAlive||l.fam.fAlive)&&annual(l,'grandAt')&&kids(l).some(function(k){return l.age-k.born<18&&!!E.FAMILY100&&E.FAMILY100.localChild(l,k);});return kids(l).some(function(k){var a=l.age-k.born;return a>=6&&a<18&&k.meetingAt129!==l.age;});},p:x[1],cd:1,max:100});});
E.FAMILY129={state:state,estateRecord:estateRecord,restoreEstate:restoreEstate,settle:settle,year:year,candidates:candidates,trades:trades,marriagePlan:marriagePlan};
})(globalThis.G);
