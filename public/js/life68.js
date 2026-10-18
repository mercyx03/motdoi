/* V5.5.1 — di chúc chủ động từ tuổi 70, không tiêu hao lượt/năm. */
(function(G){
  'use strict';
  var E=G.E,H=E.H;
  function allowed(l){return l.alive&&l.age>=70;}
  function kids(l){return(l.kids||[]).filter(function(k){return k.alive!==false;});}
  function spouse(l){return l.partner&&l.partner.alive!==false&&l.partner.status!=='dating'?l.partner:null;}
  function partnerKey(l,p){return p&&(p.heritageId||[p.name,p.sex,l.birthYear+l.age-p.age].join(':'));}
  function choices(l){var a=[{k:'personal',l:'Chỉ để lại lời nhắn'}];if(kids(l).length)a.push({k:'equal',l:'Chia đều di sản cho các con còn sống'});if(spouse(l))a.push({k:'spouse',l:'Để lại di sản cho '+spouse(l).name});if(spouse(l)&&kids(l).length)a.push({k:'family',l:'Một nửa cho bạn đời, một nửa chia đều cho các con'});a.push({k:'charity',l:'Để lại di sản cho hoạt động từ thiện'});return a;}
  function valid(l,d){return allowed(l)&&(!d||d.at==null||d.at===l.age)&&(!d||d.revision==null||d.revision===(l.flags.willRevision70||l.flags.will70&&l.flags.will70.revision||0));}
  function check(l,d){if(!valid(l,d))return 'Hoàn cảnh đã thay đổi, hãy mở lại di chúc.';if(!choices(l).some(function(x){return x.k===d.plan;}))return 'Người nhận không còn phù hợp. Hãy chọn lại.';if(typeof d.note!=='string'||d.note.length>1000)return 'Lời nhắn tối đa 1.000 ký tự.';if(d.plan==='personal'&&!d.note.trim())return 'Hãy viết lời nhắn hoặc chọn cách để lại tài sản.';if(d.plan==='spouse'||d.plan==='family'){if(d.partner!==partnerKey(l,spouse(l)))return 'Thông tin bạn đời đã thay đổi, hãy mở lại di chúc.';}return '';}
  E.DEC.di_chuc={valid:valid,make:function(l){var w=l.flags.will70,plan=w&&w.plan||(['equal','charity'].indexOf(l.flags.will)>=0?l.flags.will:'personal');if(!choices(l).some(function(x){return x.k===plan;}))plan='personal';return{id:'di_chuc',title:w?'Xem / sửa di chúc':'Viết di chúc',text:'Bạn có thể sửa bất cứ lúc nào. Bản lưu mới nhất sẽ thay thế bản trước; tài sản vẫn thuộc về bạn khi còn sống.',data:{at:l.age,revision:l.flags.willRevision70||w&&w.revision||0,note:w&&w.note||'',plan:plan,partner:partnerKey(l,spouse(l))},opts:[{k:'save',l:'Lưu di chúc'},{k:'none',l:'Đóng, không thay đổi'}].concat(w?[{k:'revoke',l:'Hủy bản di chúc đã lưu'}]:[])};},auto:function(){return 'none';},apply:function(l,d,k,r,log){if(!valid(l,d.data)||!d.opts.some(function(o){return o.k===k;}))return;if(k==='none')return;if(k==='revoke'){l.flags.willRevision70=(l.flags.willRevision70||l.flags.will70&&l.flags.will70.revision||0)+1;delete l.flags.will70;delete l.flags.will;log('Bạn hủy bản di chúc đã lưu.','neutral');return;}if(check(l,d.data))return;var old=l.flags.will70,revision=(l.flags.willRevision70||old&&old.revision||0)+1;l.flags.willRevision70=revision;l.flags.will70={revision:revision,age:l.age,year:l.birthYear+l.age,note:d.data.note.trim(),plan:d.data.plan,partner:d.data.partner,partnerName:spouse(l)&&spouse(l).name};l.flags.will=d.data.plan;log((old?'Cập nhật':'Lưu')+' di chúc ở tuổi '+l.age+'.','neutral');}};
  E.ACT.push({id:'di_chuc70',g:'Tiền bạc',l:'Viết / sửa di chúc',min:70,jail:true,trap:true,mil:true,sc:'di_chuc',avail:function(l){return allowed(l)?true:'Từ 70 tuổi';},ai:{w:0}});
  var actions=E.actions,act=E.act,avail=E.actAvail;
  E.actions=function(l){return actions.apply(this,arguments).map(function(a){if(a.id==='di_chuc70')a.ok=allowed(l)?true:'Từ 70 tuổi';return a;});};
  E.actAvail=function(l,a){return a&&a.id==='di_chuc70'?(allowed(l)?true:'Từ 70 tuổi'):avail.apply(this,arguments);};
  E.act=function(l,id){if(id!=='di_chuc70')return act.apply(this,arguments);if(!allowed(l))return null;var d=E.DEC.di_chuc.make(l);d.manual=true;l.pending=(l.pending||[]).filter(function(x){return x.id!=='di_chuc';});l.pending.unshift(d);return d;};
  function settle(l){var w=l.flags.will70;if(!w||l.alive)return null;if(w.settlement)return w.settlement;var amount=Math.max(0,E.netWorth(l)),list=[],recipients=kids(l),p=spouse(l),samePartner=p&&partnerKey(l,p)===w.partner;
    function give(name,fraction){list.push({name:name,amount:amount*fraction});}
    if(w.plan==='equal'&&recipients.length)recipients.forEach(function(k){give(k.name,1/recipients.length);});
    if(w.plan==='spouse'&&samePartner)give(p.name,1);
    if(w.plan==='family'){if(samePartner)give(p.name,.5);if(recipients.length)recipients.forEach(function(k){give(k.name,.5/recipients.length);});}
    if(w.plan==='charity')give('Hoạt động từ thiện',1);
    var assigned=list.reduce(function(s,x){return s+x.amount;},0);w.settlement={net:amount,list:list,unassigned:Math.max(0,amount-assigned)};return w.settlement;
  }
  var finale=E.finale;E.finale=function(l){var stages=finale.apply(this,arguments),w=l.flags.will70,s=settle(l);if(!s)return stages;var lines=[];if(w.note)lines.push(w.note);if(w.plan!=='personal'){lines.push('Di sản ròng còn lại: '+H.money(l,s.net)+'.');s.list.forEach(function(x){lines.push(x.name+': '+H.money(l,x.amount)+'.');});if(s.unassigned>.000001)lines.push('Chưa phân chia: '+H.money(l,s.unassigned)+(s.list.length?' (phần của người nhận không còn phù hợp).':' (không còn người nhận phù hợp).'));}stages.push({h:'Di chúc để lại',x:'Bản lưu năm '+w.year+' · '+w.age+' tuổi.',list:lines});return stages;};
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);l.pending=(l.pending||[]).filter(function(d){return d.id!=='di_chuc'||allowed(l);}).map(function(d){if(d.id==='di_chuc'&&(!d.data||!d.data.plan)){var fresh=E.DEC.di_chuc.make(l);fresh.manual=d.manual;return fresh;}return d;});};
  E.WILL70={allowed:allowed,choices:choices,check:check,settle:settle};
})(G);
