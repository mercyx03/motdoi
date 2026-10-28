/* Action browsing, retired difficulty, certificate and distance compatibility. */
(function(G){'use strict';
var E=G.E,H=E.H,X=E.UPDATE110;
function copy(x){return JSON.parse(JSON.stringify(x));}
function restore(l,s){Object.keys(l).forEach(function(k){delete l[k];});Object.assign(l,s);}
function limit(l){return l.age<10?3:l.age<18?7:Infinity;}
function facts(l){var p=l.partner;return JSON.stringify([l.money,l.st,l.karma,l.skill,l.lang,l.lic,l.job&&[l.job.id,l.job.rank],l.school,p&&[p.name,p.status,p.close],(l.kids||[]).map(function(k){return [k.name,k.close,k.study,k.support114];}),l.veh,l.ownHouse,l.abroad&&[l.abroad.code,l.abroad.study]]);}
function migrate(l){
 l.difficulty='normal';
 l.pending=(l.pending||[]).filter(function(d){return !/^hc_/.test(d.id);});
 l.sched=(l.sched||[]).filter(function(d){return !/^hc_/.test(d.id);});
 l.pending.forEach(function(d){var a=d.data;if(a&&a.actionId850&&!a.deferredTurn894){
  if(a.actionYear850===l.age){l.acts=Math.max(0,(l.acts||0)-1);if(l.flags.actAt)delete l.flags.actAt[a.actionId850];}
  a.deferredTurn894=true;
 }});
}
var m=E.migrateExt;E.migrateExt=function(l){if(m)m(l);migrate(l);};
// A token follows a manual action through its menus. Mandatory story decisions
// have no token and never consume the player's annual action allowance.
var resolve=E.resolve;
E.resolve=function(l,key){
 var d=l.pending[0],a=d&&d.data,token=a&&a.deferredTurn894&&a.actionYear850===l.age?a:null;
 if(!token)return resolve.apply(this,arguments);
 var rootAction=E.ACT.find(function(x){return x.id===token.actionId850;}),rootMenu=rootAction&&(E.DEC[rootAction.sc||rootAction.id]||{}).menu110;
 if(!rootMenu&&l.flags.actAt&&l.flags.actAt[token.actionId850]===l.age){l.pending.shift();return [];}
 var def=E.DEC[d.id],o=def&&def.def&&def.def.opts.find(function(x){return x.k===key;});
 if(!d.opts.some(function(x){return x.k===key;})||def&&def.valid&&!def.valid(l,a)||o&&o.req&&!o.req(l,a))return resolve.apply(this,arguments);
 var snapshot=l.acts>=limit(l)?copy(l):null,old=l.pending.slice(1),before=facts(l),used=l.acts||0,out=resolve.apply(this,arguments);
 l.acts=used; // old cancel handlers refunded an opening cost that no longer exists
 var children=l.pending.filter(function(x){return old.indexOf(x)<0;}),cancel=/^(cancel|back|close)$/.test(key);
 var changed=facts(l)!==before,spend=!cancel&&(children.length===0||changed);
 if(spend&&snapshot){restore(l,snapshot);var e={a:l.age,y:l.birthYear+l.age,t:'Đã hết lượt năm nay. Bạn vẫn có thể xem các phương án hoặc để dịp khác; lựa chọn chưa được thực hiện.',k:'neutral'};l.log.push(e);return [e];}
 if(spend){l.acts=(l.acts||0)+1;var root=E.ACT.find(function(x){return x.id===token.actionId850;});if(root&&!(E.DEC[root.sc||root.id]||{}).menu110)(l.flags.actAt||(l.flags.actAt={}))[token.actionId850]=l.age;}
 children.forEach(function(x){if(cancel||spend)return;x.data=x.data||{};x.data.actionId850=token.actionId850;x.data.actionYear850=l.age;x.data.deferredTurn894=true;x.manual=d.manual;});
 return out;
};
// Clear stale expiry flags as soon as a fresh certificate exists. A queued old
// expiry is also checked by the scenario against the current issue date.
function certs(l){['en','ko','zh'].forEach(function(k){if(l.langAt&&l.langAt[k]!=null&&l.age-l.langAt[k]<2){if(l.langExp)l.langExp[k]=false;if(l.flags.certDue)l.flags.certDue[k]=false;}});}
var r2=E.resolve;E.resolve=function(l,k){var out=r2.apply(this,arguments);certs(l);return out;};
var m2=E.migrateExt;E.migrateExt=function(l){m2(l);certs(l);};
E.HOOKS.year.unshift(certs);
var expiry=E.DEC.chung_chi_het_han,expiryValid=expiry.def.valid;
expiry.def.valid=function(l,d){var k=d&&d.k||'en';return expiryValid(l,d)&&(!d||!d.k||l.langAt&&l.langAt[k]!=null&&l.age-l.langAt[k]>=2);};
// One friend entry, with a stable identity for every person including namesakes.
function friends(l){return [l.bff].concat(l.friends||[]).filter(function(f,i,all){return f&&f.alive!==false&&!f.faded&&all.findIndex(function(x){return x===f||x&&x.uid110&&x.uid110===f.uid110;})===i;});}
function here(l,f){return (f.loc||'HOME')===E.locOf(l);}
function friend(l,id){return friends(l).find(function(f){return X.uid(l,f)===id;});}
for(var i=E.ACT.length-1;i>=0;i--)if(E.ACT[i].id==='gap_ban')E.ACT.splice(i,1);
X.menu('friends894','Hẹn gặp bạn thân',function(l){return X.reason(l,8)!==true?X.reason(l,8):friends(l).length?true:'Chưa có bạn thân';},'Chọn người bạn muốn gặp hoặc liên lạc. Bạn ở xa có thể gọi video; mở danh sách không tốn lượt.',function(l){return friends(l).map(function(f){return {k:X.uid(l,f),l:f.name,h:here(l,f)?'Ở cùng nơi · có thể hẹn gặp':'Ở xa · gọi video',run:function(l,r){X.next(l,'friend894',r,{uid:X.uid(l,f)});}};});},8);
X.menu('friend894','Dành thời gian cho bạn thân',function(l){return X.reason(l,8);},function(l,d){var f=friend(l,d.arg.uid);return f?'Bạn muốn làm gì cùng '+f.name+'?':'Người bạn này không còn liên lạc được.';},function(l,arg){var f=friend(l,arg.uid);if(!f)return[];return [{k:'talk',l:here(l,f)?'Hẹn gặp và tâm sự':'Gọi video để tâm sự',h:'Thực hiện mới tính 1 lượt',run:function(l,r,log){var f=friend(l,arg.uid);if(!f)return;f.close=Math.min(100,(f.close||50)+8);H.fx(l,{hap:2,soc:2});log((here(l,f)?'Bạn hẹn gặp ':'Bạn gọi video cho ')+f.name+', dành thời gian lắng nghe và chia sẻ.','good');}}];},8);
var meet=E.ACT.find(function(a){return a.id==='hen_ban_than';});if(meet){meet.sc='friends894';meet.g='Bạn bè';meet.avail=function(l){return friends(l).length?true:'Chưa có bạn thân';};}
// Existing emergency cards keep their saved keys, but a distant friend receives
// remote support rather than an impossible overnight visit.
var crisis=E.DEC.ban_than_kho;
if(crisis){var prep=crisis.def.prep;crisis.def.prep=function(l,r){var d=prep.apply(this,arguments),f=friends(l).find(function(f){return f.name===d.n;});if(f)d.uid894=X.uid(l,f);return d;};
 function target(l,d){return d&&(d.uid894?friend(l,d.uid894):friends(l).find(function(f){return f.name===d.n;}));}
 crisis.def.valid=function(l,d){return d&&d.n?!!target(l,d):friends(l).some(function(f){return l.age+(f.d||0)>=18;});};
 var support=crisis.def.opts.find(function(o){return o.k==='o_ben';});
 support.l=function(l,d){var f=target(l,d);return f&&!here(l,f)?'Gọi video, ở bên động viên từ xa':'Đến bên bạn để an ủi';};
 support.run=function(l,r,log,d){var f=target(l,d);if(!f)return;f.close=Math.min(100,(f.close||50)+12);H.fx(l,{karma:3,soc:2});log(here(l,f)?'Bạn đến bên '+f.name+' và ở lại lắng nghe, an ủi.':'Bạn gọi video cho '+f.name+', lắng nghe và nhờ người ở gần hỗ trợ; việc đi lại cần sắp xếp riêng.','good');};
}
function canFly(l){return !!l.abroad&&X.reason(l,18)===true;}
function fare(l){return Math.max(l.base*.1,(E.homeTrip(l)||{}).cost||0);}
E.SC('homeVisit894',{title:'Sắp xếp chuyến về thăm ngắn ngày',prep:function(l,r,arg){return {code:l.abroad&&l.abroad.code,reason:arg&&arg.reason||'thăm người thân'};},valid:function(l,d){return canFly(l)&&(!d||!d.code||d.code===l.abroad.code);},text:function(l,d){return 'Bạn đang ở '+l.abroad.name+'. Muốn về '+d.reason+' cần liên hệ gia đình, xin phép trường hoặc nơi làm việc, kiểm tra giấy tờ tái nhập cảnh và đặt vé khứ hồi. Chuyến thăm ngắn ngày không kết thúc du học hay tự cấp bằng.';},opts:[{k:'book',l:'Sắp xếp nghỉ ngắn ngày và mua vé khứ hồi',h:function(l){return 'Dự trù '+H.money(l,fare(l))+'; cần giữ giấy tờ tái nhập cảnh còn hiệu lực';},req:function(l){return canFly(l)&&l.money>=fare(l);},run:function(l,r,log,d){if(!canFly(l)||l.money<fare(l))return;H.cash(l,-fare(l),'Vé khứ hồi về thăm nhà');l.flags.homeVisit894={at:l.age,host:l.abroad.code,reason:d.reason};log('Bạn liên hệ gia đình và sắp xếp nghỉ ngắn ngày. Sau khi lo giấy tờ và chuyến bay, bạn về '+d.reason+'; không thể có mặt ngay trong đêm.','neutral');X.next(l,'homeVisitReturn894',r,{code:l.abroad.code});}},{k:'cancel',l:'Chưa thể đi, gọi điện và nhờ người ở gần hỗ trợ',run:function(l,r,log){log('Bạn liên lạc từ xa, nhờ người ở gần hỗ trợ và tiếp tục theo dõi tình hình.','neutral');}}]});
E.SC('homeVisitReturn894',{title:'Sau chuyến thăm nhà',prep:function(l,r,a){return a||{};},valid:function(l,d){return !!l.abroad&&!!l.flags.homeVisit894&&l.abroad.code===d.code;},text:'Sau những ngày ở bên gia đình, bạn cần quay lại đúng hạn để tiếp tục chương trình học hoặc công việc.',opts:[{k:'return',l:'Quay lại đúng hạn, tiếp tục việc học / công việc',run:function(l,r,log){l.flags.homeVisit894.returned=true;H.fx(l,{hap:3});log('Bạn quay lại nơi đang học hoặc làm việc đúng hạn. Chương trình du học, tiến độ và giấy tờ cư trú vẫn được giữ.','good');}}]});
function addVisit(id,condition){var D=E.DEC[id];if(!D||!D.def)return;D.def.opts.push({k:'visit894',l:'Sắp xếp về thăm ngắn ngày, rồi quay lại',req:function(l,d){return canFly(l)&&(!condition||condition(l,d));},h:'Xem chi phí và cách sắp xếp trước khi quyết định',run:function(l,r,log){X.next(l,'homeVisit894',r,{reason:'thăm người thân đang cần giúp đỡ'});}});}
addVisit('abroadMove146');addVisit('bo_me_can',function(l,d){return /mổ|bệnh|viện|tai nạn/.test((d.t||'')+' '+(d.w||''));});addVisit('ban_than_kho',function(l,d){var f=friends(l).find(function(f){return f.name===d.n;});return f&&(f.loc||'HOME')==='HOME'&&!here(l,f);});
// Saved legacy meeting cards and the "tomorrow" option also respect distance.
var oldMeet=E.DEC.gap_ban;
if(oldMeet){var oldGo=oldMeet.def.opts.find(function(o){return o.k==='go';}),go=oldGo.run,text=oldMeet.def.text;
 oldMeet.def.text=function(l,d){return l.bff&&!here(l,l.bff)?l.bff.name+' đang ở xa. Hai người có thể hẹn giờ gọi video.':text(l,d);};
 oldGo.l=function(l){return l.bff&&!here(l,l.bff)?'Hẹn giờ gọi video':'Hẹn gặp bạn';};oldGo.run=function(l,r,log,d){if(!l.bff)return;if(here(l,l.bff))return go.apply(this,arguments);l.bff.close=Math.min(100,(l.bff.close||50)+6);H.fx(l,{hap:3,soc:2});log('Bạn gọi video trò chuyện với '+l.bff.name+' thay cho cuộc hẹn gặp trực tiếp.','good');};
}
var hospital=E.DEC.ban_nam_vien;
if(hospital){var later=hospital.def.opts.find(function(o){return o.k==='later';});if(later)later.l=function(l){return l.bff&&!here(l,l.bff)?'Gọi điện hỏi thăm, nhờ người ở gần túc trực':'Hẹn mai vào thăm';};}
// Normalize overlapping action categories while retaining the existing money
// and family submenus and all action identifiers.
var build=E.MENU147.build;
E.MENU147.build=function(acts,spend){
 var aliases={'Gia đình & bạn bè':'Bạn bè','Sức khỏe & tâm hồn':'Sức khỏe','Sức khỏe & ngoại hình':'Sức khỏe','Học tập & sự nghiệp':'Học tập','Cuộc sống địa phương':'Đời sống','Cuộc sống & quan hệ':'Đời sống','Giải trí & trải nghiệm':'Giải trí','Sự nghiệp giải trí':'Sự nghiệp'};
 var result=build(acts.map(function(a){var x=Object.assign({},a);x.g=aliases[x.g]||x.g;return x;}),spend);
 var family=result.subs[E.MENU147.FAMILY];
 if(family){var love=family['1. Tình yêu & hôn nhân'];if(love){result.groups['Tình yêu & hôn nhân']=love;result.groups[E.MENU147.FAMILY]=result.groups[E.MENU147.FAMILY].filter(function(x){return love.indexOf(x)<0;});delete family['1. Tình yêu & hôn nhân'];}}
 var category={'Học tập':'Học tập & công việc','Học thuật':'Học tập & công việc','Công việc':'Học tập & công việc','Phát triển sự nghiệp':'Học tập & công việc','Công vụ & quản lý':'Học tập & công việc','Quân đội & công an':'Học tập & công việc','Doanh nghiệp & tập đoàn':'Học tập & công việc','Sự nghiệp':'Giải trí & sáng tạo','Giải trí':'Giải trí & sáng tạo','Năng khiếu':'Giải trí & sáng tạo','Âm nhạc & sự nghiệp':'Giải trí & sáng tạo','Showbiz & người hâm mộ':'Giải trí & sáng tạo','Mạng xã hội':'Giải trí & sáng tạo','Nhà nước & cộng đồng':'Đời sống'};
 Object.keys(result.groups).forEach(function(g){var top=category[g];if(!top)return;var rows=result.groups[g];(result.groups[top]||(result.groups[top]=[])).push.apply(result.groups[top],rows);var subs=result.subs[top]||(result.subs[top]={});subs[g]=rows;delete result.groups[g];});
 return result;
};
})(globalThis.G);
