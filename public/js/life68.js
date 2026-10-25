/* V5.5.1 — di chúc chủ động từ tuổi 70, không tiêu hao lượt/năm.
   V6.5.0 — di chúc đa dạng hơn: tự chia theo tỉ lệ cho từng người con, bạn đời, bạn bè, các cháu, một người khác
   hoặc để lại cho xã hội (quỹ khuyến học, bệnh nhi, mái ấm…); phần chưa chia và người không có di chúc chia theo pháp luật;
   con chưa thành niên luôn được ít nhất 2/3 một suất thừa kế theo pháp luật (Việt Nam). */
(function(G){
  'use strict';
  var E=G.E,H=E.H;
  var CAUSES={hoc:'Quỹ khuyến học cho học sinh nghèo ở quê nhà',benh:'Quỹ hỗ trợ bệnh nhi ung thư',tre:'Mái ấm, trại trẻ mồ côi',truong:'Quỹ học bổng mang tên bạn ở trường cũ',tho:'Nơi thờ tự bạn vẫn hay lui tới',rung:'Quỹ trồng rừng, bảo vệ môi trường',gia:'Viện dưỡng lão cho người già neo đơn'};
  function allowed(l){return l.alive&&l.age>=18;}
  function kids(l){return(l.kids||[]).filter(function(k){return k.alive!==false;});}
  function spouse(l){return l.partner&&l.partner.alive!==false&&l.partner.status!=='dating'?l.partner:null;}
  function partnerKey(l,p){return p&&(p.heritageId||[p.name,p.sex,l.birthYear+l.age-p.age].join(':'));}
  function friends(l){return E.friendsOf?E.friendsOf(l).filter(function(f){return f&&f.name;}):[];}
  function kidAge(l,k){return l.age-(k.born||0);}
  // người có thể nhận khi tự chia theo tỉ lệ
  function recipients(l){
    var a=[],p=spouse(l);
    (l.kids||[]).forEach(function(k,i){if(k.alive!==false)a.push({key:'k'+i,name:k.name,kind:'kid',idx:i,note:(k.sex==='M'?'con trai':'con gái')+', '+kidAge(l,k)+' tuổi'});});
    if(p)a.push({key:'p',name:p.name,kind:'spouse',note:'bạn đời'});
    if((l.grand||0)>0)a.push({key:'g',name:'Các cháu',kind:'grand',note:l.grand+' đứa cháu'});
    var seen={};friends(l).forEach(function(f){if(seen[f.name])return;seen[f.name]=1;a.push({key:'f:'+f.name,name:f.name,kind:'friend',note:'bạn thân'});});
    a.push({key:'o',name:'Một người khác',kind:'other',note:'tự ghi tên'});
    a.push({key:'s',name:'Xã hội / từ thiện',kind:'society',note:'chọn quỹ bên dưới'});
    return a;
  }
  function choices(l){var a=[{k:'personal',l:'Chỉ để lại lời nhắn'}];if(kids(l).length)a.push({k:'equal',l:'Chia đều di sản cho các con còn sống'});if(spouse(l))a.push({k:'spouse',l:'Để lại di sản cho '+spouse(l).name});if(spouse(l)&&kids(l).length)a.push({k:'family',l:'Một nửa cho bạn đời, một nửa chia đều cho các con'});a.push({k:'custom',l:'Tự chia theo tỉ lệ: từng người con, bạn đời, người khác, xã hội'});a.push({k:'charity',l:'Để lại toàn bộ cho xã hội / hoạt động từ thiện'});return a;}
  function valid(l,d){return allowed(l)&&(!d||d.at==null||d.at===l.age)&&(!d||d.revision==null||d.revision===(l.flags.willRevision70||l.flags.will70&&l.flags.will70.revision||0));}
  function shareSum(sh){return Object.keys(sh||{}).reduce(function(s,k){return s+(+sh[k]||0);},0);}
  function check(l,d){
    if(!valid(l,d))return 'Hoàn cảnh đã thay đổi, hãy mở lại di chúc.';
    if(!choices(l).some(function(x){return x.k===d.plan;}))return 'Người nhận không còn phù hợp. Hãy chọn lại.';
    if(typeof d.note!=='string'||d.note.length>1000)return 'Lời nhắn tối đa 1.000 ký tự.';
    if(d.plan==='personal'&&!d.note.trim())return 'Hãy viết lời nhắn hoặc chọn cách để lại tài sản.';
    if(d.plan==='spouse'||d.plan==='family'){if(d.partner!==partnerKey(l,spouse(l)))return 'Thông tin bạn đời đã thay đổi, hãy mở lại di chúc.';}
    if((d.plan==='charity'||d.plan==='custom')&&d.cause&&!CAUSES[d.cause])return 'Hãy chọn lại quỹ / tổ chức nhận.';
    if(d.plan==='custom'){
      var sh=d.shares||{},keys=recipients(l).map(function(x){return x.key;}),bad=Object.keys(sh).filter(function(k){var v=sh[k];return keys.indexOf(k)<0&&+v>0||!(typeof v==='number'&&isFinite(v)&&v>=0&&v<=100&&Math.round(v)===v);});
      if(bad.length)return 'Mỗi phần phải là số nguyên từ 0 đến 100%.';
      var sum=shareSum(sh);if(sum<=0)return 'Hãy chia ít nhất một phần cho ai đó.';if(sum>100)return 'Tổng các phần đang là '+sum+'%, không được quá 100%.';
      if(+sh.p>0&&d.partner!==partnerKey(l,spouse(l)))return 'Thông tin bạn đời đã thay đổi, hãy mở lại di chúc.';
      if(+sh.o>0){var n=typeof d.otherName==='string'?d.otherName.trim():'';if(!n||n.length>60)return 'Hãy ghi tên người nhận (tối đa 60 ký tự).';}
      if(+sh.s>0&&!d.cause)return 'Hãy chọn quỹ / tổ chức xã hội nhận phần di sản.';
    }
    return '';
  }
  E.DEC.di_chuc={valid:valid,make:function(l){var w=l.flags.will70,plan=w&&w.plan||(['equal','charity'].indexOf(l.flags.will)>=0?l.flags.will:'personal');if(!choices(l).some(function(x){return x.k===plan;}))plan='personal';
    var shares={};if(w&&w.shares)Object.keys(w.shares).forEach(function(k){if(recipients(l).some(function(x){return x.key===k;}))shares[k]=w.shares[k];});
    return{id:'di_chuc',title:w?'Xem / sửa di chúc':'Viết di chúc',text:'Bạn có thể sửa bất cứ lúc nào. Bản lưu mới nhất sẽ thay thế bản trước; tài sản vẫn thuộc về bạn khi còn sống. Phần không ghi trong di chúc sẽ chia theo pháp luật.',data:{at:l.age,revision:l.flags.willRevision70||w&&w.revision||0,note:w&&w.note||'',plan:plan,partner:partnerKey(l,spouse(l)),shares:shares,cause:w&&w.cause||'hoc',otherName:w&&w.otherName||''},opts:[{k:'save',l:'Lưu di chúc',h:''},{k:'none',l:'Đóng, không thay đổi',h:''}].concat(w?[{k:'revoke',l:'Hủy bản di chúc đã lưu',h:''}]:[])};},
    auto:function(){return 'none';},
    apply:function(l,d,k,r,log){if(!valid(l,d.data)||!d.opts.some(function(o){return o.k===k;}))return;if(k==='none')return;if(k==='revoke'){l.flags.willRevision70=(l.flags.willRevision70||l.flags.will70&&l.flags.will70.revision||0)+1;delete l.flags.will70;delete l.flags.will;log('Bạn hủy bản di chúc đã lưu.','neutral');return;}if(check(l,d.data))return;var old=l.flags.will70,revision=(l.flags.willRevision70||old&&old.revision||0)+1;l.flags.willRevision70=revision;
      var w={revision:revision,age:l.age,year:l.birthYear+l.age,note:d.data.note.trim(),plan:d.data.plan,partner:d.data.partner,partnerName:spouse(l)&&spouse(l).name};
      if(d.data.plan==='charity')w.cause=CAUSES[d.data.cause]?d.data.cause:'hoc';
      if(d.data.plan==='custom'){var sh={},rs=recipients(l);Object.keys(d.data.shares||{}).forEach(function(key){var v=+d.data.shares[key];if(v>0){sh[key]=v;var x=rs.filter(function(y){return y.key===key;})[0];if(x&&x.kind==='kid')(w.kidNames||(w.kidNames={}))[key]=x.name;}});w.shares=sh;if(sh.s)w.cause=d.data.cause;if(sh.o)w.otherName=d.data.otherName.trim();}
      l.flags.will70=w;l.flags.will=d.data.plan;log((old?'Cập nhật':'Lưu')+' di chúc ở tuổi '+l.age+'.','neutral');}};
  E.ACT.push({id:'di_chuc70',g:'Tiền bạc',l:'Viết / sửa di chúc',min:18,jail:true,trap:true,mil:true,sc:'di_chuc',avail:function(l){return allowed(l)?true:'Từ 18 tuổi';},ai:{w:0}});
  var actions=E.actions,act=E.act,avail=E.actAvail;
  E.actions=function(l){return actions.apply(this,arguments).map(function(a){if(a.id==='di_chuc70')a.ok=allowed(l)?true:'Từ 18 tuổi';return a;});};
  E.actAvail=function(l,a){return a&&a.id==='di_chuc70'?(allowed(l)?true:'Từ 18 tuổi'):avail.apply(this,arguments);};
  E.act=function(l,id){if(id!=='di_chuc70')return act.apply(this,arguments);if(!allowed(l))return null;var d=E.DEC.di_chuc.make(l);d.manual=true;l.pending=(l.pending||[]).filter(function(x){return x.id!=='di_chuc';});l.pending.unshift(d);return d;};
  // người thừa kế theo pháp luật (hàng thứ nhất): các con còn sống và bạn đời còn sống
  function legalHeirs(l){var a=[];(l.kids||[]).forEach(function(k,i){if(k.alive!==false)a.push({name:k.name,kid:i});});var p=spouse(l);if(p)a.push({name:p.name,spouse:true});return a;}
  function vn(l){return H.isVN(l)&&!(l.abroad&&l.abroad.perm);}
  function compute(l,w){
    var amount=Math.max(0,E.netWorth(l)),list=[],p=spouse(l),samePartner=w&&p&&partnerKey(l,p)===w.partner,recipients=kids(l);
    function give(name,fraction,extra){if(fraction>0)list.push(Object.assign({name:name,amount:amount*fraction},extra||{}));}
    function kidGive(fraction){recipients.forEach(function(k){give(k.name,fraction/recipients.length,{kid:l.kids.indexOf(k)});});}
    if(w){
      if(w.plan==='equal'&&recipients.length)kidGive(1);
      if(w.plan==='spouse'&&samePartner)give(p.name,1,{spouse:true});
      if(w.plan==='family'){if(samePartner)give(p.name,.5,{spouse:true});if(recipients.length)kidGive(.5);}
      if(w.plan==='charity')give(CAUSES[w.cause]||'Hoạt động từ thiện',1,{society:true});
      if(w.plan==='custom'){var sh=w.shares||{};Object.keys(sh).forEach(function(key){var f=(+sh[key]||0)/100;if(!(f>0))return;
        if(key.charAt(0)==='k'&&key.charAt(1)!==':'){var i=+key.slice(1),k=l.kids[i];if(k&&k.alive!==false&&(!w.kidNames||!w.kidNames[key]||w.kidNames[key]===k.name))give(k.name,f,{kid:i});}
        else if(key==='p'){if(samePartner)give(p.name,f,{spouse:true});}
        else if(key==='g'){if((l.grand||0)>0)give('Các cháu',f,{grand:true});}
        else if(key==='o'){if(w.otherName)give(w.otherName,f,{other:true});}
        else if(key==='s')give(CAUSES[w.cause]||'Hoạt động từ thiện',f,{society:true});
        else if(key.indexOf('f:')===0){var fn=key.slice(2);if(friends(l).some(function(x){return x.name===fn;}))give(fn,f,{friend:true});}
      });}
    }
    var notes=[],heirs=legalHeirs(l);
    // VN: con chưa thành niên được ít nhất 2/3 một suất thừa kế theo pháp luật dù di chúc chia khác
    if(w&&vn(l)&&heirs.length&&amount>0){var legal=amount/heirs.length,floor=legal*2/3;
      recipients.forEach(function(k){if(kidAge(l,k)>=18)return;var i=l.kids.indexOf(k),got=list.filter(function(x){return x.kid===i;}).reduce(function(s,x){return s+x.amount;},0);if(got>=floor-1e-9)return;
        var need=floor-got,assigned=list.reduce(function(s,x){return s+x.amount;},0),free=Math.max(0,amount-assigned),fromFree=Math.min(free,need);need-=fromFree;
        if(need>1e-9){var pool=list.filter(function(x){return !(x.kid!=null&&kidAge(l,l.kids[x.kid])<18);}),tot=pool.reduce(function(s,x){return s+x.amount;},0);if(tot>0)pool.forEach(function(x){x.amount-=need*x.amount/tot;});}
        var own=list.filter(function(x){return x.kid===i;})[0];if(own)own.amount=floor;else list.push({name:k.name,amount:floor,kid:i,forced:true});
        notes.push(k.name+' chưa đủ 18 tuổi nên theo luật vẫn được hưởng ít nhất 2/3 một suất thừa kế ('+H.money(l,floor)+').');});}
    list=list.filter(function(x){return x.amount>1e-9;});
    var assigned=list.reduce(function(s,x){return s+x.amount;},0),unassigned=Math.max(0,amount-assigned),law=[];
    if(unassigned>1e-6&&heirs.length)heirs.forEach(function(h){law.push(Object.assign({amount:unassigned/heirs.length},h));});
    return{net:amount,list:list,unassigned:unassigned,law:law,notes:notes,debt:Math.min(0,E.netWorth(l))};
  }
  function settle(l){var w=l.flags.will70;if(!w||l.alive)return null;if(w.settlement)return w.settlement;w.settlement=compute(l,w);return w.settlement;}
  // di sản khi mất (có hoặc không có di chúc) — dùng cho "sống tiếp đời con"
  function estate(l){return settle(l)||(l.flags.estate65||(l.alive?compute(l,null):(l.flags.estate65=compute(l,null))));}
  function forKid(l,i){var s=estate(l);return s.list.concat(s.law).filter(function(x){return x.kid===i;}).reduce(function(t,x){return t+x.amount;},0);}
  var finale=E.finale;E.finale=function(l){var stages=finale.apply(this,arguments),w=l.flags.will70,s=settle(l);
    if(!s){if(l.alive||!l.death||l.death.age<18)return stages;var e=estate(l);if(e.net>0&&e.law.length){stages.push({h:'Thừa kế theo pháp luật',x:'Không để lại di chúc, di sản ròng '+H.money(l,e.net)+' được chia đều cho những người thừa kế hàng thứ nhất.',list:e.law.map(function(x){return x.name+': '+H.money(l,x.amount)+'.';})});}else if(e.debt<0&&legalHeirs(l).length){stages.push({h:'Thừa kế theo pháp luật',x:'Tài sản để lại không đủ trả nợ. Theo luật, người thừa kế chỉ trả nợ trong phạm vi di sản được hưởng, nên không con cháu nào phải gánh thêm.'});}return stages;}
    var lines=[];if(w.note)lines.push(w.note);if(w.plan!=='personal'){lines.push('Di sản ròng còn lại: '+H.money(l,s.net)+'.');s.list.forEach(function(x){lines.push(x.name+': '+H.money(l,x.amount)+(s.net>0?' ('+Math.round(x.amount/s.net*100)+'%)':'')+'.');});s.notes.forEach(function(n){lines.push(n);});if(s.unassigned>.000001)lines.push('Chưa phân chia: '+H.money(l,s.unassigned)+(s.list.length?' (phần của người nhận không còn phù hợp hoặc chưa ghi trong di chúc)':' (không còn người nhận phù hợp)')+(s.law.length?' — chia theo pháp luật cho '+s.law.map(function(x){return x.name;}).join(', ')+'.':'.'));}
    else if(s.law.length&&s.net>0)lines.push('Di sản ròng '+H.money(l,s.net)+' chia theo pháp luật cho '+s.law.map(function(x){return x.name;}).join(', ')+'.');
    stages.push({h:'Di chúc để lại',x:'Bản lưu năm '+w.year+' · '+w.age+' tuổi.',list:lines});return stages;};
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);l.pending=(l.pending||[]).filter(function(d){return d.id!=='di_chuc'||allowed(l);}).map(function(d){if(d.id==='di_chuc'&&(!d.data||!d.data.plan)){var fresh=E.DEC.di_chuc.make(l);fresh.manual=d.manual;return fresh;}if(d.id==='di_chuc'&&d.data&&!d.data.shares){d.data.shares={};d.data.cause=d.data.cause||'hoc';d.data.otherName=d.data.otherName||'';}return d;});};
  E.WILL70={allowed:allowed,choices:choices,check:check,settle:settle,estate:estate,forKid:forKid,recipients:recipients,causes:CAUSES,legalHeirs:legalHeirs};
})(G);
