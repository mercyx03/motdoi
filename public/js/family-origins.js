/* Family origins extend orphan scenarios, persistent biographies and sibling identities. */
(function (G) {
  'use strict';
  var E=G.E,H=E.H,U=G.U,X=E.UPDATE110,L=E.LIFE138;
  function orphan(l){return l.fam&&l.fam.orphan;}
  function free(l){return X.reason(l,6)===true;}
  function copy(x){return JSON.parse(JSON.stringify(x));}
  function rng(l,salt){var h={rs:(l.rs^salt)|0};return function(){return U.rand(h);};}
  var fields=['mName','fName','mAge','fAge','mJob','fJob','mInc','fInc','mInc0','fInc0','mAlive','fAlive','noDad','noMom','mTrait','fTrait','q','home','vice'];
  function household(l){var out={};fields.forEach(function(k){if(l.fam[k]!==undefined)out[k]=l.fam[k];});return out;}
  function syncCare(l,care){var s=L.state(l);s.care=care;s.separated=false;s.schoolSerial=(s.schoolSerial||0)+1;s.current=null;delete s.careReason;}
  function birthFamily(l,r){var o=orphan(l);if(o.birthFamily)return o.birthFamily;
    var who=U.pick(r,['m','f','both']),together=who==='both'&&r()<.5;
    var q=1+Math.floor(r()*5),m=H.name(l,r,'F').full,f=H.name(l,r,'M').full;
    o.birthFamily={who:who,together:together,mAlive:who!=='f',fAlive:who!=='m',q:q,mName:m,fName:f,mAge:18+Math.floor(r()*14),fAge:20+Math.floor(r()*16),
      story:U.pick(r,['Khi ấy người lớn chưa đủ khả năng chăm sóc và không có người hỗ trợ.','Gia đình từng trải qua biến cố, mất liên lạc trong nhiều năm.','Người đến tìm thừa nhận đã bỏ con và muốn có cơ hội sửa chữa.']),
      current:U.pick(r,['đang ở nhà thuê, công việc còn bấp bênh','có việc làm ổn định, sống giản dị','đã có gia đình mới và những người con khác','sống một mình, có người thân hỗ trợ']),trust:25,visits:0};
    var b=o.birthFamily,ps=L.state(l).people;
    ['m','f'].forEach(function(side){var key=side==='m'?'birthMother':'birthFather';if(who!=='both'&&who!==side)return;
      ps[key]={id:key,name:b[side+'Name'],sex:side==='m'?'F':'M',birth:l.birthYear-b[side+'Age'],job:'người thân vừa tìm lại',nationalities:[l.country],genes:copy(L.state(l).genes),trait:U.pick(r,['kiên trì','hướng nội','cởi mở','nhạy cảm']),trust:25,alive:true,events:[],family:b.current};});
    return b;
  }
  function who(b){return b.who==='both'?'bố và mẹ ruột':b.who==='m'?'mẹ ruột':'bố ruột';}
  function canMeet(l){var o=orphan(l);return free(l)&&!!o&&o.unknown&&o.found!=null;}
  function ready(l){var o=orphan(l);return free(l)&&!!o&&o.unknown&&o.found==null;}
  function found(l,r,log){var o=orphan(l),b=birthFamily(l,r);o.found=l.age;o.contact='open';
    log('Hồ sơ và đối chiếu ADN trong mô phỏng đã xác nhận '+who(b)+' của bạn. '+b.story+' Người ấy '+b.current+'. Bạn có quyền gặp, giữ khoảng cách hoặc từ chối liên hệ.','big');
    H.mem(l,'Biết được nguồn cội; việc xây dựng quan hệ mới chỉ bắt đầu.',6);}
  // Keep the existing search event, but let an unresolved search continue in later years.
  var search=E.DEC.mc_tim_bo_me.def;
  search.opts.find(function(o){return o.k==='tim';}).run=function(l,r,log){var o=orphan(l);o.searched=l.age;o.searchOpen=true;
    if(r()<.3){found(l,r,log);o.searchOpen=false;}else log('Đã lưu hồ sơ tìm người thân. Chưa có kết quả khớp; hồ sơ tiếp tục được đối chiếu trong những năm sau.','neutral');};
  search.valid=function(l){var o=orphan(l);return !!o&&o.unknown&&o.found==null&&o.searched==null;};
  E.TRIG.filter(function(t){return t.id==='mc_tim_bo_me';}).forEach(function(t){var old=t.when;t.when=function(l,a){return !!orphan(l)&&orphan(l).found==null&&old(l,a);};});
  var adoption=E.DEC.mc_nhan_nuoi.def,accept=adoption.opts.find(function(o){return o.k==='theo';}),oldAccept=accept.run;
  adoption.valid=function(l){var o=orphan(l);return !!o&&o.adopted==null&&['mai_am','chua'].includes(o.kind)&&l.age>=1&&l.age<=15;};
  accept.run=function(l,r,log,d){var o=orphan(l);if(!adoption.valid(l))return;o.originalCare={carer:o.carer,one:o.one,kind:o.kind};
    oldAccept(l,r,log,d);l.fam.noMom=false;o.adoptiveHome=household(l);syncCare(l,'bố mẹ');
    var s=L.state(l);s.people.originalFather=copy(s.people.father);s.people.originalMother=copy(s.people.mother);
    ['mother','father'].forEach(function(key){var side=key==='mother'?'m':'f';delete s.people[key];var p=L.person(l,key,l.fam[side+'Name'],side==='m'?'F':'M',l.birthYear-l.fam[side+'Age'],l.fam[side+'Job']);p.name=l.fam[side+'Name'];p.birth=l.birthYear-l.fam[side+'Age'];p.job=l.fam[side+'Job'];p.alive=true;p.adoptive=true;p.events.push('Đón con về ở tuổi '+l.age);});
    (l.sibList||[]).filter(function(t){return t.twinOrigins;}).forEach(function(t){t.close=Math.max(65,t.close);log('Gia đình thu xếp đón cả '+t.n+', người sinh đôi với bạn, để hai anh chị em tiếp tục lớn lên bên nhau.','good');});
    l.fam.sibs=(l.sibList||[]).filter(function(t){return t.alive&&t.born<=0;}).length;
  };
  E.TRIG.filter(function(t){return t.id==='mc_nhan_nuoi';}).forEach(function(t){t.when=function(l){return adoption.valid(l)&&!l.abroad&&!(l.jailUntil!=null&&l.age<l.jailUntil);};t.max=3;t.cd=3;});
  X.menu('originsFamily','Gia đình ruột vừa tìm lại',function(l){return canMeet(l)?true:'Chưa tìm lại người thân ruột thịt';},function(l){var b=birthFamily(l,rng(l,902));return who(b)+': '+(b.who!=='f'?b.mName:'')+(b.who==='both'?' và ':'')+(b.who!=='m'?b.fName:'')+'. '+(b.who==='both'?(b.together?'Hai người còn bên nhau. ':'Hai người đã chia tay, có chỗ ở riêng. '):'Chỉ người này đến tìm bạn; chưa xác định tung tích người còn lại. ')+b.story+' Hiện '+b.current+'. '+(!b.mAlive&&!b.fAlive?'Người thân đã qua đời. ':'')+'Tin cậy '+b.trust+'/100; đã gặp '+b.visits+' lần. '+(orphan(l).placementRequested!=null?'Đang chờ thu xếp chuyển nơi chăm sóc. ':'')+'Gia đình đang nuôi dưỡng vẫn có lịch sử và quan hệ riêng.';},function(l){var o=orphan(l),b=birthFamily(l,rng(l,902)),unused=b.lastVisit!==l.age;
    return [{k:'visit',l:'Gặp mặt và tìm hiểu thêm về cuộc sống của nhau',why:!b.mAlive&&!b.fAlive?'Người thân đã qua đời':unused?true:'Đã gặp trong năm nay',run:function(l,r,log){b.lastVisit=l.age;b.visits++;b.trust=U.clamp(b.trust+8,0,100);o.contact='open';H.fx(l,{hap:2,soc:1});log('Bạn gặp '+who(b)+(l.age<18?' cùng người chăm sóc hiện tại':'')+', trao đổi về quá khứ và mong muốn. Chưa thay đổi nơi ở.','neutral');}},
      {k:'stay',l:'Ở lại gia đình hiện tại, vẫn có thể liên lạc',run:function(l,r,log){o.contact='limited';delete o.placementRequested;log('Bạn chọn ở lại với người đã chăm sóc mình và giữ liên lạc theo giới hạn mình mong muốn.','neutral');}},
      {k:'move',l:l.age<18?'Bày tỏ mong muốn về sống với người thân ruột thịt':'Chuyển về sống cùng người thân ruột thịt',why:!b.mAlive&&!b.fAlive?'Không còn người thân này để chuyển về cùng':b.visits<2?'Cần ít nhất hai lần gặp qua các năm':o.placementRequested!=null?'Đã gửi mong muốn, đang chờ thu xếp':o.livingWithBirth?'Đã chuyển về sống cùng người thân ruột thịt':true,run:function(l,r,log){o.placementRequested=l.age;log(l.age<18?'Mong muốn đã được ghi nhận. Người chăm sóc và bên hỗ trợ cần xác minh điều kiện, bàn giao việc học; chưa chuyển nhà ngay.':'Bạn bắt đầu thu xếp chỗ ở và trách nhiệm với gia đình hiện tại; việc chuyển nhà diễn ra trong năm sau.','neutral');}},
      {k:'pause',l:'Tạm dừng liên hệ, giữ khoảng riêng',run:function(l,r,log){o.contact='paused';delete o.placementRequested;log('Bạn đặt ranh giới và tạm dừng liên hệ. Khi sẵn sàng có thể chủ động mở lại cuộc trò chuyện.','neutral');}}];},6,'Tình cảm & gia đình');
  E.SC('originsContact',{title:'Người thân ruột thịt đến tìm bạn',valid:ready,prep:function(l,r){birthFamily(l,r);return {at:l.age};},text:function(l){var b=orphan(l).birthFamily;return 'Một người tự nhận là '+who(b)+' liên hệ qua người chăm sóc hoặc hồ sơ tìm thân nhân. Chưa coi lời nhận là bằng chứng; có thể đồng ý đối chiếu trước khi gặp.';},opts:[
    {k:'verify',l:'Đồng ý xác minh rồi mới quyết định gặp',run:function(l,r,log){if(!ready(l))return;found(l,r,log);X.next(l,'originsFamily',r,{}, {manual:false});}},
    {k:'later',l:'Chưa sẵn sàng, nhờ giữ lại thông tin',run:function(l,r,log){orphan(l).contactAfter=l.age+3;log('Người chăm sóc giữ lại thông tin. Bạn chưa đồng ý gặp hoặc thay đổi gia đình.','neutral');}},
    {k:'decline',l:'Không muốn được liên hệ thêm',run:function(l,r,log){orphan(l).declinedContact=true;log('Bạn từ chối lời đề nghị liên hệ. Không ai tự đưa bạn rời gia đình hiện tại.','neutral');}}]});
  var create=E.createLife;
  E.createLife=function(opts){var l=create.apply(this,arguments),r=rng(l,0x90271);if(!opts||!opts.parent){if(r()<.025){
    var sex=r()<.5?l.sex:(l.sex==='M'?'F':'M'),name=H.name(l,r,sex,l.sur).full;
    for(var n=0;n<20&&(name===l.name||(l.sibList||[]).some(function(t){return t.n===name;}));n++)name=H.name(l,r,sex,l.sur).full;
    var twin={n:name,name:name,sex:sex,born:0,alive:true,close:70,job:'chưa đi học',wed:false,kids:0,q:l.fam.q,twinOrigins:true,older:r()<.5,trait:U.pick(r,['hướng nội','hoạt bát','kiên trì','nhạy cảm'])};
    (l.sibList||(l.sibList=[])).push(twin);l.fam.sibs=(l.fam.sibs||0)+1;l.flags.twinOrigins=true;
    if(l.log[0])l.log[0].t+=' Bạn có '+(twin.older?(sex==='M'?'anh':'chị'):'em')+' sinh đôi tên '+name+'. Hai người có tính cách và con đường riêng.';
  }}return l;};
  X.menu('twinOrigins','Anh chị em sinh đôi',function(l){return free(l)&&(l.sibList||[]).some(function(t){return t.twinOrigins&&t.alive;})?true:'Không có anh chị em sinh đôi còn sống';},'Cùng tuổi nhưng mỗi người có sở thích riêng. Có thể đồng hành, đặt ranh giới hoặc chia sẻ việc bị so sánh.',function(l){var t=l.sibList.find(function(t){return t.twinOrigins&&t.alive;});return [['share','Dành thời gian lắng nghe '+t.n,5,2],['own','Nói rõ mong muốn theo đuổi con đường riêng',1,2],['compare','Ép mình cạnh tranh với người sinh đôi',-5,-2]].map(function(a){return{k:a[0],l:a[1],why:t.lastTwinAt===l.age?'Đã tương tác năm nay':true,run:function(l,r,log){t.lastTwinAt=l.age;t.close=U.clamp(t.close+a[2],0,100);t.twinChoice=a[0];H.fx(l,{hap:a[3]});log(a[0]==='own'?'Hai người trao đổi và tôn trọng hướng học, nghề nghiệp riêng.':a[0]==='share'?'Bạn và '+t.n+' chia sẻ những áp lực của mình, hiểu nhau thêm.':'Sự so sánh làm quan hệ với '+t.n+' căng thẳng hơn.','neutral');}};});},6,'Tình cảm & gia đình');
  E.HOOKS.year.push(function(l,r,log){if(!l.alive)return;var o=orphan(l);if(o&&o.unknown){
    var known=o.birthFamily;if(known&&o.found!=null&&known.year!==l.age){known.year=l.age;['m','f'].forEach(function(side){if(!known[side+'Alive'])return;var age=known[side+'Age']+l.age,death=age>105?1:age>90?.25:age>80?.1:age>70?.035:age>60?.012:0;
      if(o.livingWithBirth)known[side+'Alive']=!!l.fam[side+'Alive'];else if(r()<death){known[side+'Alive']=false;var person=L.state(l).people[side==='m'?'birthMother':'birthFather'];if(person)person.alive=false;log((side==='m'?'Mẹ ruột ':'Bố ruột ')+known[side+'Name']+' qua đời ở tuổi '+age+'.','bad');}
    });}
    if(o.placementRequested!=null&&known&&!known.mAlive&&!known.fAlive){delete o.placementRequested;log('Người thân đã qua đời trước khi chuyển nơi ở; bạn tiếp tục ở nơi hiện tại.','neutral');}

    if(ready(l)&&!o.declinedContact&&l.age>=(o.contactAfter||6)&&o.contactYear!==l.age&&r()<(o.searchOpen?.18:.045)){o.contactYear=l.age;E.WORLD120.queue(l,'originsContact',r,{}, {manual:false});}
    if(o.placementRequested!=null&&o.placementRequested<l.age&&!o.livingWithBirth){var b=o.birthFamily;if(!b)return;
      if(l.age<18&&r()<.25){o.placementRequested=l.age;log('Việc bàn giao chăm sóc chưa được thống nhất; bạn tiếp tục ở nơi hiện tại, vẫn có thể gặp người thân ruột thịt.','neutral');return;}
      o.previousHome=household(l);o.previousRelationships=copy(l.flags.family100||{});o.previousBiographies={father:copy(L.state(l).people.father),mother:copy(L.state(l).people.mother)};
      var f=l.fam;['m','f'].forEach(function(side){var present=!!b[side+'Alive'];f[side+'Alive']=present;f[side+'Name']=present?b[side+'Name']:'Chưa rõ';f[side+'Age']=b[side+'Age'];f[side+'Job']=present?'nhân viên văn phòng':'không rõ tung tích';f[side+'Inc']=present?E.parentMonthly(l,'nhân viên văn phòng',r)*(.6+b.q*.2):0;f[side+'Inc0']=f[side+'Inc'];f[side+'Trait']=U.pick(r,Object.keys(E.PARENT_TRAITS));var key=side==='m'?'mother':'father',bio=L.state(l).people[side==='m'?'birthMother':'birthFather'];if(bio)L.state(l).people[key]=copy(bio);else L.state(l).people[key].alive=false;});
      f.noDad=!b.fAlive;f.noMom=!b.mAlive;f.q=b.q;f.vice=null;f.home='nhà người thân ruột thịt';o.adopted=o.adopted==null?l.age:o.adopted;o.livingWithBirth=true;o.guardianship='birth';delete o.placementRequested;
      if(l.flags.family100)l.flags.family100.parents={};syncCare(l,b.mAlive&&b.fAlive&&b.together?'bố mẹ':b.mAlive?'mẹ':'bố');
      l.flags.famHardship=b.q<=1;l.sendParents=H.isVN(l)||b.q<=3;L.state(l).separated=b.who==='both'&&!b.together;log('Đã thu xếp về sống với '+who(b)+'. Ngân sách chăm sóc và việc học được rà soát theo hoàn cảnh mới; kỷ niệm với gia đình cũ vẫn được giữ.','big');H.mem(l,'Chuyển nơi ở sau nhiều lần gặp gỡ gia đình ruột.',6);
    }
  }});
  var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments),o=orphan(l);if(o&&o.birthFamily&&o.found!=null)p.jobInfo.push('Gia đình ruột: '+who(o.birthFamily)+' · '+o.birthFamily.current+' · '+(o.livingWithBirth?'đang sống cùng':o.contact==='paused'?'tạm dừng liên hệ':'có thể mở mục Gia đình ruột vừa tìm lại'));return p;};
  E.ORIGINS={birthFamily:birthFamily,found:found,household:household};
})(globalThis.G);
