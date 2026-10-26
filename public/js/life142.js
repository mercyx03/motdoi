/* GĐ2 — một người, một danh tính, một nguồn tính cách, một nguồn tin cậy.
   Lớp cầu nối mỏng trên các hệ thống sẵn có; không có kho NPC thứ hai.
   · Danh tính: uid110 (E.UPDATE110.uid) cho mọi object người (bạn đời, con, anh chị em, bạn bè, bạn thân).
     Bố mẹ không có object riêng → 'parent:m' / 'parent:f'. Mã cũ vẫn tra được: 'mother'/'father' (life138),
     'parent:m:<tên>' (life113), 'child:<uid>' / 'partner:<uid>' (life113), parentId (life54), uid family100.
   · Tính cách: bố mẹ → fam.mTrait/fTrait (life90) · bạn đời → traits130 (life130) · con → persona141 (life141),
     nhãn future126 chỉ dùng khi không mâu thuẫn với persona141 · người quen khác → life138.trait.
   · Tin cậy: bố mẹ & bạn đời → family100.trust/tension · con → persona141.trust (tension vẫn ở family100,
     gắn bó k.close, attach/fear ở persona141 — các chỉ số khác nghĩa được giữ riêng) · người quen khác → life138.trust,
     độ thân của bạn bè / anh chị em vẫn là `close`.
   · Người cũ: danh tính & lịch sử quan hệ đi theo người ấy khi chia tay và khi quay lại.
   · Tin một người qua đời lan theo danh tính, không theo tên (tên trùng không còn làm "chết oan" người khác). */
(function(G){'use strict';var E=G.E,H=E.H,U=G.U,X=E.UPDATE110;
var LEGACY_PARENT=/^parent:([mf])(?::.*)?$/;
function cl(v){return U.clamp(Math.round(v),0,100);}
function people138(l){var s=l.flags.life138;return s&&s.people||null;}
function objects(l){return [l.partner,l.bff].concat(l.kids||[],l.sibList||[],l.friends||[]).filter(function(o){return o&&typeof o==='object';});}

// ---------- định danh ----------
// Gán uid110 cho mọi object người còn thiếu (định danh cũ không bao giờ bị thay). Bạn thân thành người yêu → dùng chung một uid.
function ensureIds(l){
 if(!l||!l.flags)return;
 objects(l).forEach(function(o){X.uid(l,o);});
 var p=l.partner;
 if(p&&p.fromFriend){var f=friendOf(l,p);if(f&&!same(l,f.uid110,p.uid110))share(l,f,p);}
}
// người bạn chính là người yêu: ưu tiên bản ghi có cờ lover; dữ liệu cũ chỉ có p.fromFriend thì nhận người bạn cùng tên, cùng giới, quen trước khi yêu
function friendOf(l,p){var all=[l.bff].concat(l.friends||[]).filter(function(f){return f&&f.name===p.name&&(!f.sex||!p.sex||f.sex===p.sex);});return all.find(function(f){return f.lover;})||(p.fromFriend?all.find(function(f){return f.since==null||p.since==null||f.since<=p.since;}):null)||null;}
// Bản lưu cũ: bạn thân và người yêu (cùng một người) mang hai uid khác nhau. Không đổi uid nào, không xóa hồ sơ nào:
// ghi bí danh uid người yêu → uid bạn thân (có trước). Mọi phép so danh tính đi qua canon().
function share(l,f,p){var keep=X.uid(l,f),old=X.uid(l,p);if(old!==keep&&canon(l,old)!==keep)aliases(l)[old]=keep;}
function aliases(l){return l.flags.npcAlias142||(l.flags.npcAlias142={});}
function canon(l,id){var a=l.flags.npcAlias142;for(var i=0;a&&id&&a[id]&&i<5;i++)id=a[id];return id;}
function alias(l,id){return canon(l,id);}
function same(l,a,b){return !!a&&!!b&&canon(l,a)===canon(l,b);}

// Tìm người theo bất kỳ dạng tham chiếu nào. Không tạo người mới; người đã mất trả về với alive:false.
function find(l,ref){
 if(!l||ref==null)return null;
 if(typeof ref==='object')return classify(l,ref);
 var id=String(ref),m=LEGACY_PARENT.exec(id);
 if(id==='mother'||id==='father')m=[0,id==='mother'?'m':'f'];
 if(m)return parent(l,m[1]);
 id=alias(l,id.replace(/^(child|partner|sibling|friend):(?=.*:110:)/,''));
 var o=objects(l).find(function(o){return o.uid110&&canon(l,o.uid110)===id||o.parentId===id||o.family100&&o.family100.uid===id;});
 if(o)return classify(l,o);
 var q=l.flags.family100&&l.flags.family100.parents;
 if(q)for(var side in q)if(q[side]&&q[side].family100&&q[side].family100.uid===id)return parent(l,side);
 var x=(l.flags.exList||[]).find(function(x){return x.uid===id;});
 if(x)return {kind:'ex',id:id,obj:x,name:x.name,alive:!x.dead&&!(E.isDeadPartner&&E.isDeadPartner(l,x))};
 var dd=(l.flags.deadPartners||[]).find(function(d){return d.uid&&canon(l,d.uid)===id;});
 if(dd)return {kind:'dead',id:id,obj:null,name:dd.n,alive:false};
 var P=people138(l);if(P&&P[id])return {kind:'acquaintance',id:id,obj:null,name:P[id].name,alive:P[id].alive!==false};
 return null;
}
function parent(l,side){var f=l.fam||{};return {kind:'parent',side:side,id:'parent:'+side,key138:side==='m'?'mother':'father',name:f[side+'Name'],alive:!!f[side+'Alive']&&!(side==='f'&&f.noDad)};}
function classify(l,o){
 var kind=o===l.partner?'partner':(l.kids||[]).indexOf(o)>=0?'child':(l.sibList||[]).indexOf(o)>=0?'sibling':o===l.bff||(l.friends||[]).indexOf(o)>=0?'friend':null;
 if(!kind)return null;
 return {kind:kind,id:X.uid(l,o),obj:o,name:o.name||o.n,alive:o.alive!==false};
}

// ---------- tính cách ----------
var PARTNER_STYLE={'nhạy cảm':'anxious','ghen tuông':'anxious','gia trưởng':'independent','nóng tính':'direct','hướng nội':'private','hoạt bát':'direct','tiết kiệm':'independent','hài hước':'direct'};
function partnerTraits(l,p){return p.traits130||(E.FAMILY130?E.FAMILY130.personality(l,p):null);}
// Nhãn tính cách của con: persona141 là nguồn chuẩn; nhãn future126 cũ chỉ dùng khi không trái với persona141 hiện tại.
function childTrait(l,k){
 var base=k.future126&&k.future126.trait||null,p=k.persona141;
 if(!p||!p.traits)return {source:base?'future126':'none',label:base};
 var t=p.traits,clash=base&&(/hướng ngoại/.test(base)&&t.extro<40||/nhút nhát|hướng nội/.test(base)&&t.extro>60||/mạnh mẽ/.test(base)&&t.sensitive>60||/bốc đồng/.test(base)&&t.impulse<40);
 if(base&&!clash)return {source:'persona141',label:base,keys:t};
 var label=t.extro<=35?(t.sensitive>=60?'nhút nhát':'hướng nội'):t.extro>=65?'hướng ngoại':t.impulse>=70?'bốc đồng, dễ gây hấn':t.sensitive<=30?'mạnh mẽ':null;
 if(!label&&E.CHILD141&&E.CHILD141.TRAITS){var best=null,dev=-1;Object.keys(t).forEach(function(key){var d=Math.abs(t[key]-50),ends=E.CHILD141.TRAITS[key];if(ends&&d>dev){dev=d;best=ends[t[key]>=50?1:0];}});label=best;}
 return {source:'persona141',label:label||base,keys:t};
}
// Tính cách của một người: { source, label, keys? }
function trait(l,ref,fallback){
 var who=find(l,ref);
 if(who&&who.kind==='parent'){var k=(l.fam||{})[who.side+'Trait'],T=E.PARENT_TRAITS&&E.PARENT_TRAITS[k];if(T)return {source:'fam.'+who.side+'Trait',key:k,label:T.n};}
 if(who&&who.kind==='partner'){var tp=partnerTraits(l,who.obj);if(tp&&tp.length)return {source:'traits130',label:tp.join(', '),keys:tp};}
 if(who&&who.kind==='ex'&&who.obj.ident&&who.obj.ident.traits130)return {source:'traits130',label:who.obj.ident.traits130.join(', '),keys:who.obj.ident.traits130};
 if(who&&who.kind==='child'){var c=childTrait(l,who.obj);if(c.label)return c;}
 var P=people138(l),key=who&&(who.key138||who.id)||ref,p=fallback||P&&P[key];
 return {source:'life138',label:p&&p.trait||null};
}
// Kiểu phản ứng trong family100 (thẳng thắn, kín đáo…) suy từ tính cách chuẩn; null → để life100 dùng cách cũ
function styleOf(l,type,a){
 if(!a)return null;
 if(type==='partner'){var tp=partnerTraits(l,a);return tp&&PARTNER_STYLE[tp[0]]||null;}
 if(type==='child'&&a.persona141&&a.persona141.traits){var t=a.persona141.traits,c=[['sensitive',t.sensitive-50],['independent',t.indep-50],['quiet',50-t.extro],['active',t.extro-50]].sort(function(x,y){return y[1]-x[1];})[0];return c[1]>=10?c[0]:null;}
 return null;
}

// ---------- quan hệ ----------
// family100 của một đứa con: tension/lần trò chuyện… ở family100, riêng `trust` đọc/ghi persona141.trust
function persona(l,k){return k.persona141||(E.CHILD141?E.CHILD141.init(l,k):null);}
function relView(l,a){
 var s=a&&a.family100;if(!s||(l.kids||[]).indexOf(a)<0)return s;
 var p=persona(l,a);if(!p)return s;
 return new Proxy(s,{get:function(t,k){return k==='trust'?p.trust:t[k];},set:function(t,k,v){if(k==='trust')p.trust=cl(v);else t[k]=v;return true;}});
}
function f100(l,who,create){
 var F=E.FAMILY100;if(!F||!who)return null;
 if(who.kind==='parent'){var q=l.flags.family100&&l.flags.family100.parents&&l.flags.family100.parents[who.side];return q&&q.family100||(create&&who.alive?F.info(l,'parent',who.side):null);}
 if(who.kind==='partner')return who.obj.family100||(create&&who.alive?F.info(l,'partner',0):null);
 if(who.kind==='child')return who.obj.family100?relView(l,who.obj):null;
 return null;
}
// Đọc quan hệ đúng nguồn, không tạo dữ liệu: { source, trust, tension?, close?, attach?, fear? }
function relation(l,ref,fallback){
 var who=find(l,ref),P=people138(l);
 if(who&&who.kind==='child'){var k=who.obj,p=k.persona141,s=k.family100;return {source:p?'persona141':'none',trust:p?p.trust:s?s.trust:null,tension:s?s.tension:null,close:k.close,attach:p&&p.attach,fear:p&&p.fear};}
 if(who&&(who.kind==='parent'||who.kind==='partner')){var r=f100(l,who,false);return {source:'family100',trust:r?r.trust:60,tension:r?r.tension:10,close:who.obj&&who.obj.close};}
 if(who&&who.kind==='ex'){var fx=who.obj.ident&&who.obj.ident.family100;return {source:'family100',trust:fx?fx.trust:null,tension:fx?fx.tension:null};}
 var key=who&&(who.key138||who.id)||ref,q=fallback||P&&P[key];
 return {source:'life138',trust:q?q.trust:null,close:who&&who.obj&&who.obj.close};
}
// Đổi độ tin cậy đúng một lần, ở đúng nguồn. Trả về giá trị mới (null nếu không có người / đã mất).
function adjustTrust(l,ref,d,fallback){
 var who=find(l,ref);
 if(who&&!who.alive)return null;
 if(who&&who.kind==='child'){var p=persona(l,who.obj);if(p){p.trust=cl(p.trust+d);return p.trust;}}
 if(who&&(who.kind==='parent'||who.kind==='partner')){var s=f100(l,who,true);if(s){s.trust=U.clamp(s.trust+d,0,100);return s.trust;}}
 var P=people138(l),key=who&&(who.key138||who.id)||ref,q=fallback||P&&P[key];
 if(q){q.trust=U.clamp(q.trust+d,0,100);return q.trust;}
 return null;
}
// Người có trạng thái do hệ thống khác quản lý (life138 không tự sinh chuyện đời cho họ)
function hiddenAlias(l,key){var c=canon(l,key);return c!==key&&!!(people138(l)||{})[c];}
function managed(l,key){var who=find(l,key);return !!who&&who.kind!=='acquaintance'&&who.kind!=='ex';}

// ---------- người yêu / người cũ ----------
// Bản chụp danh tính của người yêu hiện tại (tối đa 4, theo uid) để khi chia tay, hồ sơ người cũ (life80) giữ được
// danh tính, tính cách và lịch sử quan hệ — kể cả khi trong cùng năm đã có người mới.
function snapshot(l){
 var p=l.partner;if(!p||p.alive===false)return;
 X.uid(l,p);
 var L=(l.flags.partnerIdent142||[]).filter(function(x){return x.uid!==p.uid110;});
 L.push({uid:p.uid110,name:p.name,since:p.since,traits130:p.traits130?p.traits130.slice():undefined,family100:p.family100?JSON.parse(JSON.stringify(p.family100)):undefined,nbc:p.nameBeforeCustomization});
 l.flags.partnerIdent142=L.slice(-4);
}
function adoptIdent(l){
 var L=l.flags.partnerIdent142;if(!Array.isArray(L)||!L.length)return;
 var cur=l.partner&&l.partner.alive!==false?l.partner.uid110:null;
 l.flags.partnerIdent142=L.filter(function(st){
  if(st.uid===cur)return true;
  var ident={traits130:st.traits130,family100:st.family100,nbc:st.nbc};
  var X2=l.flags.exList||[],x=X2.filter(function(x){return x.uid===st.uid;}).pop()||X2.filter(function(x){return !x.uid&&x.name===st.name&&(x.since==null||st.since==null||x.since===st.since);}).pop(); // chỉ một hồ sơ: hai người cũ trùng tên không bị gộp
  if(x){x.uid=st.uid;if(!x.ident)x.ident=ident;}
  return false;
 });
 if(!l.flags.partnerIdent142.length)delete l.flags.partnerIdent142;
}
function reunite(l,before){
 var p=l.partner;if(!p||p===before||!p.reunited||p.uid110)return;
 var x=(l.flags.exList||[]).filter(function(x){return x.closed&&x.name===p.name&&x.uid;}).pop();
 if(!x)return;
 p.uid110=x.uid;
 if(x.ident){if(x.ident.traits130)p.traits130=x.ident.traits130.slice();if(x.ident.family100)p.family100=JSON.parse(JSON.stringify(x.ident.family100));if(x.ident.nbc)p.nameBeforeCustomization=x.ident.nbc;}
}

// ---------- qua đời: theo danh tính ----------
function deadList(l){return l.flags.deadPartners||(l.flags.deadPartners=[]);}
// cùng một người? Có uid hai phía → so uid. Bản ghi cũ không uid → so tên, nhưng chỉ với người đã quen trước lúc mất.
function sameDead(d,o,l){
 if(!d||!o)return false;
 if(d.uid&&o.uid110)return l?same(l,d.uid,o.uid110):d.uid===o.uid110;
 if(d.n!==o.name)return false;
 return o.since==null||d.a==null||o.since<=d.a||!!o.lover;
}
function friendsAll(l){return [l.bff].concat(l.friends||[]).filter(function(f){return f&&f.name;});}
E.isDeadPartner=function(l,p){if(!p)return false;var o=p.uid110||!p.uid?p:{name:p.name,since:p.since,uid110:p.uid};return deadList(l).some(function(d){return sameDead(d,o,l);});};
E.personDied=function(l,p,a){
 if(!p||!p.name)return;
 p.alive=false;if(p.died==null)p.died=a;
 if(p.uid110==null&&l.partner===p)X.uid(l,p);
 if(!deadList(l).some(function(d){return sameDead(d,p,l);}))deadList(l).push({n:p.name,s:p.since,a:a,uid:p.uid110});
 friendsAll(l).forEach(function(f){var isSame=p.uid110&&f.uid110?same(l,f.uid110,p.uid110):f.name===p.name&&(!f.sex||!p.sex||f.sex===p.sex)&&(f.lover||f.since==null||f.since<=a);if(isSame){f.alive=false;f.died=a;f.lover=false;}});
 var L=l.flags.exList;if(L)l.flags.exList=L.filter(function(x){return p.uid110&&x.uid?!same(l,x.uid,p.uid110):x.name!==p.name;});
};
var syncOld=E.syncKnownDeaths;
E.syncKnownDeaths=function(l,a){
 if(!syncOld||!l||['vn','world'].indexOf(l.mode)<0)return;
 var deaths=l.flags.deadPartners||[];
 friendsAll(l).forEach(function(f){var d=deaths.filter(function(x){return sameDead(x,f,l);})[0];if(d&&f.alive!==false){f.alive=false;f.died=d.a;f.lover=false;}});
 var p=l.partner;if(!p)return;
 var linked=friendsAll(l).filter(function(f){return f.alive===false&&(p.uid110&&f.uid110?same(l,f.uid110,p.uid110):f.name===p.name&&(f.lover||!!p.fromFriend));})[0];
 if(linked&&E.partnerGone)E.partnerGone(l,linked.died==null?a:linked.died);
};

// ---------- nối vào vòng năm ----------
var resolve=E.resolve;E.resolve=function(l){snapshot(l);var before=l.partner,out=resolve.apply(this,arguments);if(l.partner!==before)reunite(l,before);snapshot(l);return out;};
var finish=E.finishYear;E.finishYear=function(l){snapshot(l);return finish.apply(this,arguments);};
E.HOOKS.year.push(function(l){if(!l.alive)return;adoptIdent(l);ensureIds(l);snapshot(l);});
var create=E.createLife;E.createLife=function(){var l=create.apply(this,arguments);ensureIds(l);return l;};
var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);ensureIds(l);};

// ---------- bản lưu: cấu trúc v2 ----------
// Một lần cho bản lưu cũ: các thay đổi tin cậy từng ghi vào bản sao (life138.trust, family100.trust của con) được cộng
// đúng một lần vào nguồn chuẩn. Trường cũ giữ nguyên trong bản lưu (không xóa), chỉ không còn được đọc.
E.registerSchemaStep({to:2,run:function(l){
 if(!l||!l.flags)return;
 var P=people138(l),F=E.FAMILY100;
 (l.kids||[]).forEach(function(k){
  if(k.alive===false)return;
  var p=k.persona141||(E.CHILD141&&l.age>=k.born?E.CHILD141.init(l,k):null);if(!p)return;
  if(k.family100&&Number.isFinite(k.family100.trust)&&!k.family100.merged142){p.trust=cl(p.trust+(k.family100.trust-60));k.family100.merged142=true;}
  var q=P&&k.uid110&&P[k.uid110];if(q&&Number.isFinite(q.trust)&&!q.merged142){p.trust=cl(p.trust+(q.trust-55));q.merged142=true;}
 });
 if(P&&F){
  [['father','f'],['mother','m']].forEach(function(x){var q=P[x[0]],who=parent(l,x[1]);if(!q||!Number.isFinite(q.trust)||q.merged142)return;q.merged142=true;if(q.trust===55||!who.alive)return;var s=f100(l,who,true);if(s)s.trust=U.clamp(s.trust+(q.trust-55),0,100);});
  var pt=l.partner;if(pt&&pt.alive!==false&&pt.uid110&&P[pt.uid110]){var q2=P[pt.uid110];if(Number.isFinite(q2.trust)&&!q2.merged142){q2.merged142=true;if(q2.trust!==55){var s2=f100(l,{kind:'partner',obj:pt,alive:true},true);if(s2)s2.trust=U.clamp(s2.trust+(q2.trust-55),0,100);}}}
 }
 ensureIds(l);
}});

E.NPC={hiddenAlias:hiddenAlias,same:same,canon:canon,find:find,ensureIds:ensureIds,trait:trait,childTrait:childTrait,styleOf:styleOf,relation:relation,adjustTrust:adjustTrust,relView:relView,managed:managed,sameDead:sameDead,alias:alias};
})(globalThis.G);
