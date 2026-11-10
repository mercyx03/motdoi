/* ROYAL920: nguồn dùng chung cho tước, danh xưng, tên theo bối cảnh và quyền công vụ.
   Không thay ID/cây gia đình, không suy ra bất động sản hay thu nhập từ chữ 'xứ'. */
(function(G){'use strict';
  var E=G.E,R=E.ROYAL920,A=E.ROYAL837,X=E.UPDATE110,H=E.H,U=G.U,D=E.ROYAL858_DATA;
  if(!R||!A||!D)return;
  var contexts=new WeakMap(),UNKNOWN='Chưa xác định';
  function year(l){return l.birthYear+l.age;}
  function date(l){return /^\d{4}-\d{2}-\d{2}$/.test(l.royalDate858||'')?l.royalDate858:year(l)+'-12-31';}
  function supported(h){return !!h&&D.countries.includes(h.cc);}
  function copy(x){return JSON.parse(JSON.stringify(x));}
  function on(l,id){var r=D.rules[id];return !!r&&(!r.from||date(l)>=r.from);}
  function bind(l,h){if(h)h.members.forEach(function(m){contexts.set(m,{l:l,h:h});});}
  function person(h,id){return h&&R.byId(h,id);}
  function parent(h,m){return m&&person(h,m.parent);}
  function children(l,h,m){return h.members.filter(function(x){return x.parent===m.id&&x.by<=year(l)&&!x.adopted920;}).sort(function(a,b){return a.by-b.by||(a.birthOrder837||0)-(b.birthOrder837||0)||String(a.id).localeCompare(String(b.id));});}
  function ancestry(h,m){if(!m)return [];var out=[],seen=new Set([m.id]),p=parent(h,m);while(p&&!seen.has(p.id)){out.push(p);seen.add(p.id);p=parent(h,p);}return out;}
  function wasSovereign(h,m){return m&&(m.id===h.seat||(m.titles||[]).some(function(t){return t.key==='sovereign';}));}
  function seniorSon(l,h,m){return children(l,h,m).find(function(x){return x.sex==='M'&&x.alive!==false&&!x.illegitimate837;});}
  function distance(h,a,b){var aa=[a].concat(ancestry(h,a)),bb=[b].concat(ancestry(h,b)),best=Infinity;aa.forEach(function(x,i){var j=bb.findIndex(function(y){return y.id===x.id;});if(j>=0)best=Math.min(best,i+j);});return Number.isFinite(best)?best:null;}
  function data(m){return m.royal858||{};}
  function state(m){var s=m.royal858||(m.royal858={version:1});['history','namesHistory','requests'].forEach(function(k){if(!Array.isArray(s[k]))s[k]=[];});return s;}
  function activeRecords(l,m){return (m.titles||[]).filter(function(t){return !t.lost&&(t.at==null||t.at<=year(l))&&(!t.effectiveDate858||t.effectiveDate858<=date(l));});}
  function proof(l,h,m,key,label,ruleId,how,extra){var r=D.rules[ruleId]||{};return Object.assign({key:key,label:label,how:how||'entitlement',ruleId:ruleId,source:r.source||null,effectiveDate:r.from||null,holderId:m.id,territory:null,scenario:false,rights:{ownership:false,income:false,government:false}},extra||{});}
  function ukPrince(l,h,m){
    if(!on(l,'uk1917')||m.adopted920||m.illegitimate837)return null;
    var a=ancestry(h,m),p=a[0],gp=a[1],ggp=a[2];
    if(p&&wasSovereign(h,p)||p&&p.sex==='M'&&gp&&wasSovereign(h,gp))return 'uk1917';
    // 1948 không suy diễn từ mọi công chúa: chỉ những người có quyết định/phạm vi cụ thể.
    if(data(m).reference1948&&on(l,'uk1948'))return 'uk1948';
    if(p&&gp&&activeRecords(l,gp).some(function(t){return t.key==='wales'&&(t.how!=='courtesy');})&&seniorSon(l,h,gp)===p){
      if(on(l,'uk2012'))return 'uk2012';
      if(m.sex==='M'&&seniorSon(l,h,p)===m)return 'uk1917';
    }
    // Văn thư 2012 vẫn áp cho con đã sinh trước lúc tước Wales được thể hiện lại trong hồ sơ.
    if(data(m).reference2012&&on(l,'uk2012')&&p&&gp)return 'uk2012';
    return null;
  }
  function relationship(l,h,m){var sov=person(h,h.seat),a=sov&&distance(h,m,sov),chain=ancestry(h,m);return {sovereignId:h.seat,parentId:m.parent||null,depthToSovereign:chain.findIndex(function(x){return x.id===h.seat;})+1||null,kinshipDistance:a,branchId:chain.length?chain[chain.length-2]&&chain[chain.length-2].id||m.id:m.id,label:m.id===h.seat?'Người trị vì':m.parent===h.seat?'Con của người trị vì':chain.some(function(x){return x.id===h.seat;})?'Hậu duệ người trị vì':m.spouse===h.seat?'Phối ngẫu người trị vì':a==null?UNKNOWN:'Nhánh họ hàng của người trị vì'};}
  function base(l,h,m,line){if(h.cc==='ES'&&E.SPAIN862)return E.SPAIN862.base(l,h,m,line);if(h.cc==='MC'&&E.MONACO861)return E.MONACO861.base(l,h,m,line);var c=h.cc,p=parent(h,m),anc=ancestry(h,m),sov=person(h,h.seat),heir=line[0],titles=[],hrh=null,member=null;
    function add(key,label,rule,how,extra){titles.push(proof(l,h,m,key,label,rule,how,extra));}
    if(m.id===h.seat){add('sovereign',m.sex==='F'?(c==='LU'?'Nữ Đại Công tước Luxembourg':'Nữ hoàng'):(c==='LU'?'Đại Công tước Luxembourg':'Quốc vương'),c==='ES'?'spain':c==='LU'?'luxembourg':c==='GB'?'uk1917':c==='SE'?'sweden':c==='DK'?'monpezat':c==='BE'?'brabant':'netherlands','accession');hrh=c==='LU'?'HRH':'Bệ hạ';member=true;}
    if(c==='GB'){
      var prince=ukPrince(l,h,m);if(prince){add('prince',m.sex==='F'?'Công chúa (Princess)':'Hoàng tử (Prince)',prince);hrh='HRH';member=true;}
      if(sov&&m===heir&&m.parent===sov.id&&!m.adopted920&&!m.illegitimate837&&m.sex==='M'&&seniorSon(l,h,sov)===m){
        if(on(l,'cornwall'))add('cornwall','Công tước xứ Cornwall','cornwall','automatic',{territory:'Cornwall',rights:{ownership:false,income:true,government:false,estate:'Duchy of Cornwall',management:'Quyền trong điền sản theo điều kiện riêng; không sở hữu cả hạt'}});
        if(on(l,'rothesay'))add('rothesay','Công tước xứ Rothesay','rothesay','automatic',{territory:'Rothesay'});
      }
      var great=anc[2],throughMale=p&&p.sex==='M'&&anc[1]&&anc[1].sex==='M'&&great&&wasSovereign(h,great);
      var peer=p&&activeRecords(l,p).find(function(t){return t.verified858&&['duke','marquess','earl'].includes(t.key)&&t.how!=='courtesy';});
      if(!prince&&(throughMale||peer&&(m.sex==='F'||['duke','marquess'].includes(peer.key))))add('courtesyChild',m.sex==='F'?'Lady':'Lord','uk1917','parentCourtesy',{fromParentId:p.id});
    }else if(c==='ES'&&on(l,'spain')){
      if(m===heir){add('asturias',m.sex==='F'?'Thái nữ Tây Ban Nha — Thân vương nữ xứ Asturias (Princesa de Asturias)':'Thái tử Tây Ban Nha — Thân vương xứ Asturias (Príncipe de Asturias)','spain','automatic',{territory:'Asturias'});hrh='HRH';member=true;}
      else if(p&&wasSovereign(h,p)||heir&&m.parent===heir.id||p&&data(p).asturiasBasis){add('infante',m.sex==='F'?'Infanta de España':'Infante de España','spain');hrh='HRH';member=true;}
      else if(p&&(p.parent===h.seat||heir&&p.parent===heir.id)){add('grande','Grande de España','spain');hrh='Excelencia';}
    }else if(c==='BE'){
      if(on(l,'belgium')&&anc.slice(0,2).some(function(x){return wasSovereign(h,x)||heir&&x.id===heir.id;})){add('prince',m.sex==='F'?'Công chúa Bỉ':'Hoàng tử Bỉ','belgium');hrh='HRH';member=true;}
      var eldest=sov&&children(l,h,sov)[0],firstDesc=eldest&&children(l,h,eldest)[0];
      if(on(l,'brabant')&&m===heir&&(m===eldest||eldest&&eldest.alive===false&&m===firstDesc)){add('brabant',m.sex==='F'?'Nữ Công tước xứ Brabant':'Công tước xứ Brabant','brabant','automatic',{territory:'Brabant'});hrh='HRH';member=true;}
    }else if(c==='SE'&&on(l,'sweden')){
      if(anc.slice(0,2).some(function(x){return wasSovereign(h,x);})&&!m.adopted920){add('prince',m.sex==='F'?'Công chúa Thụy Điển':'Hoàng tử Thụy Điển','sweden','royalDecisionModel',{scenario:true});hrh='HRH';member=true;}
      if(m===heir){add('heir',m.sex==='F'?'Thái nữ Thụy Điển (Kronprinsessa)':'Thái tử Thụy Điển (Kronprins)','sweden');hrh='HRH';member=true;}
    }else if(c==='DK'){
      if(anc.slice(0,2).some(function(x){return wasSovereign(h,x);})&&!m.adopted920){add('prince',m.sex==='F'?'Công chúa Đan Mạch':'Hoàng tử Đan Mạch','monpezat','royalDecisionModel',{scenario:true});hrh='HRH';member=true;}
      if(m===heir){add('heir',m.sex==='F'?'Thái nữ Đan Mạch (Kronprinsessa)':'Thái tử Đan Mạch (Kronprins)','monpezat');hrh='HRH';member=true;}
    }else if(c==='NL'&&on(l,'netherlands')){
      // Tước nhánh xa phải có sắc lệnh riêng, không suy ra Count/Jonkheer từ số thứ tự kế vị.
      if(m.parent===h.seat||heir&&m.parent===heir.id){add('prince',m.sex==='F'?'Princess of the Netherlands':'Prince of the Netherlands','netherlands','royalDecisionModel',{scenario:true});hrh='HRH';}
      if(m===heir&&anc.some(function(x){return x.id===h.seat;})){add('orange',m.sex==='F'?'Princess of Orange':'Prince of Orange','netherlands','automatic',{territory:'Orange'});hrh='HRH';}
      member=!!(sov&&distance(h,m,sov)!=null&&distance(h,m,sov)<=2&&line.includes(m)||m.id===h.seat);
    }else if(c==='LU'&&on(l,'luxembourg')){
      if(m===heir&&year(l)-m.by>=18){add('hereditary',m.sex==='F'?'Nữ Đại Công tước Kế vị (Grande-Duchesse héritière)':'Đại Công tước Kế vị (Grand-Duc héritier)','luxembourg','automatic');hrh='HRH';member=true;}
    }
    // Tước đã phong có metadata rõ ràng mới tạo quyền đã xác minh. Bản ghi cũ không bị xóa.
    activeRecords(l,m).filter(function(t){return t.verified858&&t.how!=='courtesy';}).forEach(function(t){if(!titles.some(function(x){return x.key===t.key&&x.territory===(t.territory||null);})){add(t.key,t.label858||R.tname(t.key,m.sex)+(t.territory?' xứ '+t.territory:''),t.rule858,'grant',{territory:t.territory||null,at:t.at,effectiveDate:t.effectiveDate858,remainder:t.remainder858,scenario:!!t.scenario858,grantId:t.id858});}});
    if(data(m).bourbonBasis&&on(l,'luxembourg'))add('bourbon',m.sex==='F'?'Princess of Bourbon-Parma':'Prince of Bourbon-Parma','bourbon','separateBasis',{basis:data(m).bourbonBasis});
    var targeted=(h.titleOrders858||[]).filter(function(o){return o.effectiveDate<=date(l)&&(o.memberIds.includes(m.id)||o.descendantRoot&&ancestry(h,m).some(function(a){return a.id===o.descendantRoot;}));});
    targeted.forEach(function(o){if(o.kind==='se2019'&&c==='SE'){hrh=null;member=false;}if(o.kind==='dk2023'&&c==='DK'){
      titles=titles.filter(function(t){return !['prince','heir'].includes(t.key);});hrh='Excellency';member=false;
      if(!titles.some(function(t){return t.key==='monpezat';}))add('monpezat',m.sex==='F'?'Countess of Monpezat':'Count of Monpezat','dk2023','scopedDecision',{territory:'Monpezat',scenario:!!o.scenario});
    }});
    if(data(m).monpezatBasis&&on(l,'monpezat')&&!titles.some(function(t){return t.key==='monpezat';}))add('monpezat',m.sex==='F'?'Countess of Monpezat':'Count of Monpezat','monpezat','scopedDecision',{territory:'Monpezat'});
    var explicitLoss=(m.titles||[]).some(function(t){return t.key==='prince'&&t.lost;})&&!activeRecords(l,m).some(function(t){return t.key==='prince';});
    if(explicitLoss)titles=titles.filter(function(t){return !['prince','infante'].includes(t.key);});
    activeRecords(l,m).forEach(function(t){if(t.verified858&&t.style858)hrh=t.style858;});
    if(m.id===h.seat){titles=titles.filter(function(t){return !['prince','infante','heir','asturias','cornwall','rothesay','orange','hereditary','brabant'].includes(t.key);});hrh=c==='LU'?'HRH':'Bệ hạ';member=true;}
    return {titles:titles,style:hrh,royalHouse:member};
  }
  function identity(l,h,m,skipSpouse){
    var line=R.order(l,h),b=base(l,h,m,line),sp=!skipSpouse&&m.spouse&&person(h,m.spouse),titles=b.titles.slice(),style=b.style,member=b.royalHouse;
    if(sp&&h.cc==='ES'&&E.SPAIN862){var esConsort=E.SPAIN862.consort(l,h,m,sp,base(l,h,sp,line));titles=titles.concat(esConsort.titles);style=esConsort.style||style;if(esConsort.member!=null)member=esConsort.member;}else if(sp&&h.cc==='MC'&&E.MONACO861){var mcConsort=E.MONACO861.consort(l,h,m,sp,base(l,h,sp,line));titles=titles.concat(mcConsort.titles);style=mcConsort.style||style;if(mcConsort.member!=null)member=mcConsort.member;}else if(sp){var sb=base(l,h,sp,line);sb.titles.forEach(function(t){
      var label=null;
      if(h.cc==='GB'&&sp.sex==='M'&&m.sex==='F'&&t.key==='prince')label='Vương phi (Princess '+namesOf(l,h,sp).daily+')';
      if(h.cc==='ES'&&t.key==='asturias')label=m.sex==='F'?'Princesa de Asturias (phối ngẫu)':'Príncipe de Asturias (phối ngẫu)';
      if(sp.sex==='M'&&m.sex==='F'&&h.cc==='GB'&&['wales','cornwall','rothesay','duke','earl'].includes(t.key))label=({wales:'Vương phi xứ Wales (Princess of Wales)',cornwall:'Nữ Công tước xứ Cornwall',rothesay:'Nữ Công tước xứ Rothesay'})[t.key]||R.tname(t.key,'F')+(t.territory?' xứ '+t.territory:'');
      if(sp.sex==='M'&&m.sex==='F'&&h.cc==='BE'&&t.key==='brabant')label='Nữ Công tước xứ Brabant (phối ngẫu)';
      if(sp.sex==='M'&&m.sex==='F'&&h.cc==='NL'&&['prince','princeOrangeNassau'].includes(t.key))label=t.label.replace('Prince','Princess')+' (danh xưng phối ngẫu)';
      if(sp.sex==='M'&&m.sex==='F'&&h.cc==='LU'&&t.key==='hereditary')label='Nữ Đại Công tước Kế vị (Grande-Duchesse héritière, phối ngẫu)';
      if(t.key==='sovereign'&&m.sex==='F')label=h.cc==='LU'?'Đại Công tước phu nhân Luxembourg':h.cc==='GB'?'Hoàng hậu (Queen Consort)':'Hoàng hậu (phối ngẫu)';
      if(t.key==='sovereign'&&h.cc==='ES'&&m.sex==='M')label='Príncipe consorte';
      if(label){titles.push(Object.assign({},t,{label:label,how:'courtesy',holderId:sp.id,sourcePersonId:sp.id,rights:{ownership:false,income:false,government:false}}));style=t.key==='sovereign'&&m.sex==='F'&&h.cc!=='LU'?'Bệ hạ':sb.style==='HRH'?'HRH':style;member=member==null?true:member;}
    });}
    var weights={sovereign:0,mcHereditary:1,mcBaux:2,mcCarlades:4,familyRole:99,asturias:1,wales:1,orange:1,hereditary:1,heir:1,brabant:2,rothesay:3,cornwall:4,duke:5,prince:8,infante:8,monpezat:9,courtesyChild:10};
    titles.sort(function(a,b){return (weights[a.key]==null?7:weights[a.key])-(weights[b.key]==null?7:weights[b.key]);});
    if(h.cc==='MC')titles.sort(function(a,b){var rank={sovereign:0,mcHereditary:1,mcBaux:2,prince:3,mcCarlades:4,familyRole:99};return (rank[a.key]??5)-(rank[b.key]??5);});
    var p=parent(h,m),parentTitles=p?base(l,h,p,line).titles:[],territorial=parentTitles.find(function(t){return t.key==='wales'&&t.how!=='courtesy';})||parentTitles.find(function(t){return t.key==='duke'&&t.territory;});
    var names=namesOf(l,h,m),suffix=h.cc==='GB'&&territorial?territorial.territory:null;
    var own=titles.find(function(t){return t.key==='prince';}),display=titles[0]?titles[0].label:UNKNOWN;
    if(own&&titles[0]===own&&suffix)display=own.label+' '+names.daily+' of '+suffix+' (cách gọi theo tước cha/mẹ)';
    var pos=line.indexOf(m),isHeir=pos===0,relation=relationship(l,h,m),role;
    if(m.player)role=R.role(l)||'nonworking';else role=data(m).dutyRole||(m.working?'working':'nonworking');if(m.id!==h.seat&&(h.titleOrders858||[]).some(function(o){return o.effectiveDate<=date(l)&&(o.memberIds.includes(m.id)||o.descendantRoot&&ancestry(h,m).some(function(a){return a.id===o.descendantRoot;}));}))role='nonworking';
    var publicStyle=data(m).publicStyle||'formal',regular=publicStyle==='civil'?names.dailyWithSurname:display;
    var result={id:m.id,country:h.cc,asOf:date(l),relation:relation,position:pos<0?null:pos+1,eligible:pos>=0,heirStatus:isHeir?(relation.depthToSovereign&&!(R.rule(h.cc).succ==='male'&&m.sex==='F')?'apparent':'presumptive'):null,titles:titles,style:style,territorialSuffix:suffix,royalHouse:member,dutyRole:role,performingDuties:role==='working'&&data(m).dutyAt===year(l),names:names,officialTitle:display,publicTitle:regular,privateAssets:'Tài sản cá nhân giữ ở hồ sơ tài chính',estateRights:titles.filter(function(t){return t.rights.income;}).map(function(t){return t.rights;}),publicBudgetEligible:role==='working',uncertainLegacy:activeRecords(l,m).filter(function(t){return !t.verified858&&!['sovereign','consort'].includes(t.key);}).map(function(t){return {key:t.key,at:t.at,why:t.why||UNKNOWN};})};if(h.cc==='ES'&&E.SPAIN862)return E.SPAIN862.enrich(l,h,m,result);return h.cc==='MC'&&E.MONACO861?E.MONACO861.enrich(l,h,m,result):result;
  }
  function namesOf(l,h,m){if(h.cc==='ES'&&E.SPAIN862)return E.SPAIN862.names(l,h,m);var n=data(m).names||{},daily=n.daily||m.name||UNKNOWN,given=n.given||[daily],legal=n.legalSurname||null;
    if(!legal&&n.uk1960Line&&on(l,'ukSurname')&&!n.marriedFemaleException)legal='Mountbatten-Windsor';
    return {birth:n.birth||m.name||UNKNOWN,given:given.slice(),ceremonial:n.ceremonial||m.fullName837||m.name||UNKNOWN,legalSurname:legal,house:n.house||h.name,daily:daily,dailyWithSurname:daily+(legal&&!daily.endsWith(legal)?' '+legal:''),service:n.service||null,honours:(n.honours||[]).slice(),surnameBasis:n.surnameBasis||null};
  }
  function nameFor(l,h,m,context){var v=identity(l,h,m),n=v.names;if(h.cc==='ES'&&E.SPAIN862)return E.SPAIN862.nameFor(l,h,m,context,v);if(h.cc==='MC'&&E.MONACO861)return E.MONACO861.nameFor(l,h,m,context,v);if(context==='Scotland'){var r=v.titles.find(function(t){return t.key==='rothesay';});return (r?r.label:v.officialTitle)+' · '+n.ceremonial;}if(context==='ceremony')return (v.style?v.style+' · ':'')+v.officialTitle+' · '+n.ceremonial;
    if(['school','military'].includes(context)){if(n.service)return n.service;return n.daily+(v.territorialSuffix?' '+v.territorialSuffix:n.legalSurname?' '+n.legalSurname:'');}
    return context==='document'?n.given.join(' ')+(n.legalSurname?' '+n.legalSurname:''):(context==='work'||data(m).publicStyle==='civil'?n.dailyWithSurname:v.publicTitle+' · '+n.daily);
  }
  function linkSpouse(l,h){var me=person(h,'player'),p=l.partner;if(!me||!l.flags.royal||l.flags.royal.c!==h.cc||!p||p.status!=='married'||p.alive===false||me.spouse)return;
    var id=p.royal920&&p.royal920.cc===h.cc?p.royal920.id:h.cc+':spouse858:'+X.uid(l,p),m=person(h,id);
    if(!m){m={id:id,name:p.name,sex:p.sex,by:year(l)-(p.age||l.age),alive:true,spouse:me.id,role:'spouse',titles:[],country837:h.cc};h.members.push(m);}me.spouse=id;m.spouse=me.id;p.royal920={cc:h.cc,id:id};
  }
  function roleOverride(l){if(E.MONACO861){var mcRole=E.MONACO861.roleOverride(l);if(mcRole)return mcRole;}var s=l.flags&&l.flags.royal920,c=l.flags&&l.flags.royal&&l.flags.royal.c||s?.spouse?.cc,h=s&&s.houses&&s.houses[c];if(!h)return null;return (h.titleOrders858||[]).some(function(o){return o.effectiveDate<=date(l)&&(o.memberIds.includes('player')||o.descendantRoot&&ancestry(h,person(h,'player')).some(function(a){return a.id===o.descendantRoot;}));})?'nonworking':null;}
  function releaseBudget(l){var s=l.flags.royal920;if(s&&R.role(l)!=='working'&&s.budget&&s.budget.left>0){s.ledger.push({y:year(l),t:'hoàn ngân sách chưa chi khi dừng công vụ',v:-s.budget.left});s.budget.returned858=(s.budget.returned858||0)+s.budget.left;s.budget.left=0;}}
  function sync(l,h,reason){if(!supported(h))return;if(h.cc==='ES'&&E.SPAIN862)E.SPAIN862.reconcile(l,h);A.prepare(l,h,false);linkSpouse(l,h);bind(l,h);var line=R.order(l,h);
    h.members.forEach(function(m){var v=identity(l,h,m),s=state(m),finger=JSON.stringify([v.officialTitle,v.style,v.position,v.royalHouse,v.territorialSuffix,v.dutyRole,v.names]);
      if(s.fingerprint!==finger){if(s.fingerprint)s.history.push({date:date(l),reason:reason||'đối chiếu gia phả',title:v.officialTitle,style:v.style,position:v.position,royalHouse:v.royalHouse});s.fingerprint=finger;}
      var contextual=nameFor(l,h,m,'school');if(s.lastContextName&&s.lastContextName!==contextual)s.namesHistory.push({date:date(l),name:s.lastContextName,until:date(l)});s.lastContextName=contextual;
      s.current=v;m.heirApparent847=v.heirStatus==='apparent';m.waitingParentAccession850=!!(v.position>1&&m.parent!==h.seat);if(h.cc==='ES'){m.asturias837=v.titles.some(function(t){return t.key==='asturias'&&t.how!=='courtesy';});if(m.asturias837)s.asturiasBasis={source:D.rules.spain.source,from:date(l)};m.infante837=E.SPAIN862?E.SPAIN862.isInfante(l,h,m,line):v.titles.some(function(t){return t.key==='infante';});}
      if(m.spouse){var spouse=person(h,m.spouse);if(spouse)spouse.consortStyle847=identity(l,h,spouse).officialTitle;}
      if(m.player&&l.partner&&l.partner.status==='married'){var sp=m.spouse&&person(h,m.spouse);l.partner.royalConsortTitle847=sp?identity(l,h,sp).officialTitle:UNKNOWN;}
    });
    (l.kids||[]).forEach(function(k){if(k.royal920&&k.royal920.cc===h.cc){var m=person(h,k.royal920.id);if(m)k.royal920.titled=identity(l,h,m).titles.some(function(t){return ['prince','infante','asturias','mcHereditary'].includes(t.key);});}});releaseBudget(l);
  }
  function title(m){var q=contexts.get(m);if(!q||!supported(q.h))return null;var v=identity(q.l,q.h,m),place=(q.l.abroad&&q.l.abroad.city)||q.l.city||'';var scotland=q.h.cc==='GB'&&/Scotland|Edinburgh|Glasgow|Aberdeen/i.test(place),r=scotland&&v.titles.find(function(t){return t.key==='rothesay';});return (r?r.label:v.officialTitle)+(v.style?' · '+v.style:'');}
  function context(l){var q=A.context(l);if(q&&supported(q.h)){bind(l,q.h);return q;}return null;}
  function lifeTitle(l){if(!l.flags.royal&&!l.flags.royal920?.spouse)return null;var q=context(l);return q&&q.me?identity(l,q.h,q.me).publicTitle:null;}
  var TEMPLATES={wales:{c:'GB',key:'wales',rule:'wales',territory:'Wales'},sussex:{c:'GB',key:'duke',rule:'sussex',territory:'Sussex',remainder:'heirsMaleBody'},edinburgh:{c:'GB',key:'duke',rule:'edinburgh',territory:'Edinburgh',remainder:'life'},swedenDuchy:{c:'SE',key:'duke',rule:'estelle',remainder:'life'},netherlandsCount:{c:'NL',key:'countOrangeNassau',rule:'netherlands',remainder:'specifiedDecision'},netherlandsPrince:{c:'NL',key:'princeOrangeNassau',rule:'netherlands',remainder:'specifiedDecision'},jonkheer:{c:'NL',key:'jonkheer',rule:'netherlands',remainder:'specifiedDecision'},spainDuchy:{c:'ES',key:'duke',rule:'spain',remainder:'life'}};
  function issue(l,h,m,template,options){if(template==='spainDuchy'&&E.SPAIN862)return E.SPAIN862.grant(l,h,m,options?.territory,options);var t=TEMPLATES[template],o=options||{};if(!t||h.cc!==t.c||m.alive===false||m.by>year(l)||o.issuerId!==h.seat||!on(l,t.rule)||o.confirmed!==true)return false;
    var line=R.order(l,h),territory=t.territory||o.territory||null;
    if(template==='wales'&&(line[0]!==m||m.sex==='F'&&!o.scenario))return false;
    if(['sussex','edinburgh'].includes(template)&&year(l)-m.by<18)return false;
    if(['swedenDuchy','spainDuchy'].includes(template)&&!territory)return false;
    if(h.members.some(function(x){return x!==m&&activeRecords(l,x).some(function(r){return r.verified858&&r.key===t.key&&r.territory===territory;});}))return false;
    var label=t.key==='wales'?(m.sex==='F'?'Thân vương nữ xứ Wales (Princess of Wales, theo quyền riêng)':'Thân vương xứ Wales (Prince of Wales)'):t.key==='countOrangeNassau'?(m.sex==='F'?'Countess of Orange-Nassau':'Count of Orange-Nassau'):t.key==='princeOrangeNassau'?(m.sex==='F'?'Princess of Orange-Nassau':'Prince of Orange-Nassau'):t.key==='jonkheer'?(m.sex==='F'?'Jonkvrouw':'Jonkheer'):R.tname(t.key,m.sex)+' xứ '+territory;
    var grant={territory:territory,label858:label,verified858:true,rule858:t.rule,source858:D.rules[t.rule].source,effectiveDate858:date(l),issuerId858:h.seat,remainder858:t.remainder||'notHereditary',style858:t.key==='princeOrangeNassau'?'Highness':null,scenario858:!!o.scenario||['swedenDuchy','netherlandsCount','netherlandsPrince','jonkheer','spainDuchy'].includes(template),id858:h.cc+':'+m.id+':'+template+':'+date(l)};
    if(!R.grant(m,t.key,'substantive',t.remainder==='heirsMaleBody','quyết định có xác nhận của quân chủ trong mô phỏng',year(l),grant))return false;
    state(m).history.push({date:date(l),event:'grant',template:template,by:h.seat,title:label,scenario:grant.scenario858});sync(l,h,'phong tước');return true;
  }
  function applyOrder(l,h,kind,ids,options){var o=options||{},rule=kind==='se2019'?'se2019':kind==='dk2023'?'dk2023':null;if(!rule||!((kind==='se2019'&&h.cc==='SE')||(kind==='dk2023'&&h.cc==='DK'))||o.issuerId!==h.seat||!ids.length||!ids.every(function(id){return !!person(h,id)&&id!==h.seat;}))return false;
    var effective=o.effectiveDate||D.rules[rule].from;if(effective<D.rules[rule].from)return false;var key=kind+':'+ids.slice().sort().join('|')+':'+effective;
    h.titleOrders858=h.titleOrders858||[];if(h.titleOrders858.some(function(x){return x.id===key;}))return false;
    h.titleOrders858.push({id:key,kind:kind,memberIds:ids.slice(),descendantRoot:o.descendantRoot||null,effectiveDate:effective,source:D.rules[rule].source,scenario:!o.historicalReference});sync(l,h,'quyết định phạm vi danh xưng');return true;
  }
  function inherit(l,h){h.members.forEach(function(m){if(m.alive!==false)return;(m.titles||[]).filter(function(t){return t.verified858&&!t.lost&&!t.inheritanceClosed858;}).forEach(function(t){
    if(t.remainder858==='life'){t.inheritanceClosed858=true;t.lost='kết thúc tước chung thân khi qua đời';return;}
    if(t.remainder858!=='heirsMaleBody')return;
    var seen=new Set(),desc=[];function walk(p){if(seen.has(p.id))return;seen.add(p.id);children(l,h,p).filter(function(k){return k.sex==='M'&&!k.illegitimate837;}).forEach(function(k){if(k.alive!==false)desc.push(k);walk(k);});}walk(m);var next=desc[0];
    t.inheritanceClosed858=true;t.lost=next?'truyền theo remainder':'không còn hậu duệ đủ điều kiện';if(next){var extra=copy(t);delete extra.lost;delete extra.inheritanceClosed858;extra.id858=t.id858+':'+next.id;extra.inheritedFrom858=m.id;extra.effectiveDate858=date(l);R.grant(next,t.key,'inheritance',true,'thừa tước theo điều kiện riêng',year(l),extra);}
  });});}
  function cleanName(v){v=String(v||'').normalize('NFC').trim().replace(/\s+/g,' ');return v.length<=100&&(!v||/^\p{L}[\p{L}\p{M} .’'\-]*$/u.test(v))?v:null;}
  function setNames(l,h,m,input){if(h.cc==='ES'&&E.SPAIN862)return E.SPAIN862.setNames(l,h,m,input);var q=input||{},given=(q.given||[]).map(cleanName);if(!given.length||given.some(function(x){return !x;}))return {ok:false,message:'Tên cần dùng chữ, dấu bản địa, khoảng trắng hoặc gạch nối.'};
    var surname=q.legalSurname==null?namesOf(l,h,m).legalSurname:cleanName(q.legalSurname),daily=cleanName(q.daily||given[0]);if(surname===null&&q.legalSurname||!daily)return {ok:false,message:'Tên hoặc họ không hợp lệ.'};
    var service=q.service==null?namesOf(l,h,m).service:cleanName(q.service);if(q.service&&service===null)return {ok:false,message:'Tên dùng ở trường/quân đội không hợp lệ.'};
    var s=state(m),old=namesOf(l,h,m);s.namesHistory.push({date:date(l),names:old});s.names=Object.assign({},s.names||{},{birth:old.birth,given:given,daily:daily,service:service||null,legalSurname:surname||null,ceremonial:given.join(' ')+(surname?' '+surname:''),honours:Array.isArray(q.honours)?q.honours.filter(function(id){return !!person(h,id);}).slice(0,6):old.honours,house:q.house||old.house,surnameBasis:q.surnameBasis||old.surnameBasis});
    m.fullName837=s.names.ceremonial;var k=(l.kids||[]).find(function(k){return k.royal920?.id===m.id&&k.royal920.cc===h.cc;});if(k)k.royalName837=m.fullName837;
    if((R.lineOf(l,h,m)||99)<=6){s.nameDiscussion={from:year(l),due:year(l)+1,status:'open',reason:'Kỳ vọng gia đình/cố vấn, không phải quyền phủ quyết tên'};}
    if(h.cc==='MC'&&E.MONACO861)E.MONACO861.learn(l,h,m,Object.assign({},q,{previousNames:old}));sync(l,h,'thống nhất tên theo bối cảnh');return {ok:true,message:'Đã ghi tên; giữ ID, tên khai sinh và lịch sử.'};
  }
  function setPublicStyle(l,h,m,mode){if(year(l)-m.by<18||!['formal','civil'].includes(mode))return false;state(m).publicStyle=mode;state(m).history.push({date:date(l),event:'publicStyle',mode:mode});sync(l,h,'cách dùng danh xưng công khai');return true;}
  function report(l,h,m){var v=identity(l,h,m);return [nameFor(l,h,m,'ceremony'),v.relation.label+' · '+(v.position?'Thứ '+v.position+' trong hàng kế vị':'Ngoài hàng kế vị'),'Danh xưng: '+(v.style||'Chưa có kính ngữ đã xác định')+' · Tư cách Vương thất: '+(v.royalHouse==null?UNKNOWN:v.royalHouse?'Có':'Không')+' · Công vụ: '+(v.dutyRole==='working'?'đang nhận công vụ':'không nhận công vụ'),
    'Các tước riêng: '+(v.titles.map(function(t){return t.label+' — '+(t.how==='courtesy'?'Danh xưng theo phối ngẫu, người giữ tước: '+t.holderId:t.how==='automatic'?'Tự động theo điều kiện riêng':'Căn cứ: '+t.ruleId)+(t.scenario?' · Kịch bản trong game':'');}).join('\n')||UNKNOWN),
    'Tên khai sinh: '+v.names.birth+'\nTên nghi lễ: '+v.names.ceremonial+'\nHọ pháp lý: '+(v.names.legalSurname||UNKNOWN)+'\nNhà/vương triều: '+v.names.house+'\nỞ trường / quân đội: '+nameFor(l,h,m,'school'),
    v.uncertainLegacy.length?'Tước đã ghi ở bản lưu cũ vẫn giữ nguyên trong lịch sử; căn cứ còn thiếu: '+v.uncertainLegacy.map(function(t){return t.key;}).join(', '):'',
    'Tài sản riêng, quyền hưởng lợi điền sản và ngân sách công vụ là ba phần độc lập. '+(v.estateRights.length?'Có quyền điền sản theo căn cứ riêng; không phải sở hữu cả vùng.':'Tước theo xứ không tự tạo đất, doanh thu hoặc quyền quản trị.')].filter(Boolean).join('\n');}
  function menuWhy(l){return l.alive&&context(l)?true:'Cần hồ sơ hoàng gia thuộc quốc gia đang hỗ trợ';}
  X.menu('royalIdentity858','Hồ sơ hoàng gia: tước, tên và gia phả',menuWhy,function(l,d){var q=context(l),m=q&&person(q.h,d.arg.id||q.me.id);return m?report(l,q.h,m):'Không còn mã người trong gia phả.';},function(l,arg){var q=context(l),m=q&&person(q.h,arg.id||q.me.id);if(!m)return [];var out=[{k:'tree',l:'Xem gia phả và bảng kế vị',run:function(l,r){X.next(l,'royalTree858',r);}}];
    if(m.player&&l.age>=18){['formal','civil'].forEach(function(mode){out.push({k:mode,l:mode==='civil'?'Dùng tên đời thường nơi công cộng':'Dùng danh xưng trang trọng',run:function(l,r){setPublicStyle(l,q.h,m,mode);X.next(l,'royalIdentity858',r,{id:m.id});}});});out.push({k:'duties',l:'Chọn giảm công vụ hoặc giữ vai trò hiện có',run:function(l,r){X.next(l,'royalRole920',r);}});}
    if(q.c==='ES'&&E.SPAIN862)out.push({k:'spain',l:'Tây Ban Nha: Asturias, tước riêng và hai họ',run:function(l,r){X.next(l,'spain862',r,{id:m.id});}});
    if(q.c==='MC'&&E.MONACO861)out.push({k:'monaco',l:'Monaco: tước riêng, quốc tịch và kho tên Grimaldi',run:function(l,r){X.next(l,'monaco861',r,{id:m.id});}});
    var targets=q.h.members.filter(function(x){return x.alive!==false&&year(l)-x.by>=0;});if(m.player&&q.h.seat===m.id)targets.slice(0,18).forEach(function(x){out.push({k:'grant:'+x.id,l:'Xem xét phong tước cho '+x.name,run:function(l,r){X.next(l,'royalGrant858',r,{id:x.id});}});});
    if(m.player&&q.h.seat!==m.id&&l.age>=18)out.push({k:'petition',l:'Gửi đề nghị xem xét phong tước (chờ quyết định)',run:function(l,r,log){var s=state(m);if(s.requests.some(function(x){return x.status==='pending';}))return;s.requests.push({from:year(l),status:'pending',target:m.id,seat:q.h.seat});log('Văn phòng nhận đề nghị; chưa có tước mới. Quyết định được xem xét trong những năm tiếp theo.','neutral');}});
    if(canName(l,q.h,m))out.push({k:'names',l:'Chọn tên chính, tên đệm và tên dùng theo hoàn cảnh',run:function(l,r){X.next(l,'royalName858',r,{id:m.id});}});
    return out;
  },0,'Đời sống');
  X.menu('royalTree858','Gia phả và bảng kế vị hoàng gia',menuWhy,function(l){var q=context(l),line=R.order(l,q.h);return 'Cây gia đình theo mã người; người trị vì và thứ tự cập nhật từ cùng một nguồn.\n'+q.h.members.filter(function(m){return m.by<=year(l);}).map(function(m){var v=identity(l,q.h,m);return '['+m.id+'] '+v.names.ceremonial+' · '+v.officialTitle+' · cha/mẹ ['+(m.parent||'gốc gia phả')+']'+(v.position?' · kế vị #'+v.position:'')+(m.alive===false?' · đã mất':'');}).join('\n');},function(l){var q=context(l);return q.h.members.slice(0,50).map(function(m){return {k:m.id,l:m.name+' · '+identity(l,q.h,m).officialTitle,run:function(l,r){X.next(l,'royalIdentity858',r,{id:m.id});}};});},0);
  X.menu('royalGrant858','Xem xét tước hiệu riêng',menuWhy,function(l,d){var q=context(l),m=person(q.h,d.arg.id);return m?'Quân chủ xem xét '+m.name+'. Mỗi tước có điều kiện và cách truyền riêng; không đồng nghĩa giao đất. Cải cách nữ giữ Wales theo quyền riêng được ghi Kịch bản trong game.':'';},function(l,arg){var q=context(l),m=person(q.h,arg.id);if(!m||q.h.seat!==q.me.id)return [];if(q.c==='ES')return [{k:'es',l:'Mở hồ sơ quyết định tước Tây Ban Nha',run:function(l,r){X.next(l,'spainGrant862',r,{id:m.id});}}];if(q.c==='MC')return [{k:'mc',l:'Mở quyết định tước Monaco (Kịch bản trong game)',run:function(l,r){X.next(l,'monacoGrant861',r,{id:m.id});}}];
    var out=Object.keys(TEMPLATES).filter(function(k){return TEMPLATES[k].c===q.c&&on(l,TEMPLATES[k].rule);}).map(function(k){return {k:k,l:'Xác nhận quyết định: '+({wales:'Wales (cần là người thừa kế hiện tại)',sussex:'Dukedom Sussex — heirs male',edinburgh:'Dukedom Edinburgh — chung thân',swedenDuchy:'Dukedom Östergötland — quyết định riêng',netherlandsCount:'Count/Countess of Orange-Nassau — sắc lệnh riêng',netherlandsPrince:'Prince/Princess of Orange-Nassau — sắc lệnh riêng',jonkheer:'Jonkheer/Jonkvrouw — quyết định riêng',spainDuchy:'Quyền dùng tước Nhà Vua: Lugo — chung thân'})[k],run:function(l,r,log){if(issue(l,q.h,m,k,{issuerId:q.h.seat,confirmed:true,scenario:true,territory:k==='spainDuchy'?'Lugo':'Östergötland'}))log('Đã ghi quyết định phong tước cho '+m.name+': '+identity(l,q.h,m).officialTitle+'.','good');else log('Chưa đáp ứng điều kiện hoặc tước đang do người khác giữ; chưa cấp tước.','neutral');X.next(l,'royalIdentity858',r,{id:m.id});}};});
    if(['SE','DK'].includes(q.c)&&m.id!==q.h.seat)out.push({k:'scopeOrder',l:'Kịch bản trong game: từ năm sau tinh giản danh xưng nhánh này, giữ kế vị/tài sản',run:function(l,r,log){var ids=q.h.members.filter(function(x){return x.id===m.id||ancestry(q.h,x).some(function(a){return a.id===m.id;});}).map(function(x){return x.id;});var kind=q.c==='SE'?'se2019':'dk2023',from=Math.max(year(l)+1,Number(D.rules[kind].from.slice(0,4)))+'-01-01';if(from<D.rules[kind].from)from=D.rules[kind].from;if(applyOrder(l,q.h,kind,ids,{issuerId:q.h.seat,effectiveDate:from,descendantRoot:m.id}))log('Đã ghi quyết định có phạm vi và mốc '+from+'; đây là kịch bản trong game. Kế vị và tài sản không bị gộp vào quyết định danh xưng.','neutral');}});return out;
  },18);

  function canName(l,h,m){return !!m&&(m.player||(l.kids||[]).some(function(k){return k.alive!==false&&k.royal920&&k.royal920.cc===h.cc&&k.royal920.id===m.id&&l.age-k.born<18&&E.FAMILY53.care(l,k);}));}
  function nameFormData(l,arg){var q=context(l),m=q&&person(q.h,arg&&arg.id||q.me.id);return m&&canName(l,q.h,m)?namesOf(l,q.h,m):null;}
  function validNameInput(input){return !!input&&Array.isArray(input.given)&&input.given.length>0&&input.given.every(function(v){return !!cleanName(v);})&&!!cleanName(input.daily||input.given[0])&&(input.legalSurname==null||cleanName(input.legalSurname)!==null)&&(input.service==null||cleanName(input.service)!==null);}
  X.menu('royalName858','Tên khai sinh, tên nghi lễ và tên thường dùng',menuWhy,function(l,d){var q=context(l),m=person(q.h,d.arg.id||q.me.id);return m?'Nhân vật ['+m.id+']. Tên chính và tên đệm là lựa chọn gia đình, không bị phủ quyết chỉ vì ở sáu vị trí đầu. Gợi ý số tên theo truyền thống gia đình là tùy chọn, không phải số bắt buộc.\nĐang có: '+namesOf(l,q.h,m).ceremonial+'\nTên dài được giữ ở gia phả; tên gọi hằng ngày có thể ngắn.':'';},function(l,arg){var q=context(l),m=person(q.h,arg.id||q.me.id);if(!m||!canName(l,q.h,m))return [];
    var out=[{k:'save',l:'Lưu lựa chọn tên đã nhập',run:function(l,r,log){if(!canName(l,q.h,m)||!validNameInput(arg.input))return;var result=setNames(l,q.h,m,Object.assign({},arg.input,{surnameBasis:'lựa chọn tên của gia đình trong game'}));log(result.message,result.ok?'good':'neutral');X.next(l,'royalIdentity858',r,{id:m.id});}}];
    ancestry(q.h,m).slice(0,4).forEach(function(a){out.push({k:'honour:'+a.id,l:'Gợi ý tên đệm tri ân '+a.name+' ['+a.id+']',run:function(l,r,log){var n=namesOf(l,q.h,m);setNames(l,q.h,m,{given:[n.daily,a.name],daily:n.daily,legalSurname:n.legalSurname,honours:[a.id]});log('Đã ghi người được tri ân theo mã gia phả, không nhầm người trùng tên.','good');X.next(l,'royalName858',r,{id:m.id});}});});return out;
  },0);

  // Mở rộng hồ sơ Làm đẹp hiện có; thẩm mỹ không phải điều kiện tước hay kế vị.
  var LOOKS={natural:{name:'No makeup-makeup / clean girl',fit:['daily','charity','outdoor']},dewy:{name:'Glowy / dewy',fit:['daily','outdoor']},regal:{name:'Classic regal',fit:['formal','ceremony']},bronzed:{name:'Soft sun-kissed / bronzed',fit:['outdoor','fashion']},smoky:{name:'Monochromatic smoky',fit:['formal','fashion'],adult:true},bold:{name:'Son đậm và phong cách cá tính',fit:['fashion','daily'],adult:true}};
  function beauty(l){return E.BEAUTY919.state(l);}
  function lookFit(l,key,event){var look=LOOKS[key];if(!look)return 'Chưa có phong cách';if(look.adult&&l.age<18)return 'Mở từ tuổi trưởng thành trong game';if(l.age<12&&key!=='natural')return 'Tuổi nhỏ: ưu tiên chăm sóc và phụ kiện nhẹ';return look.fit.includes(event)?'Phù hợp gợi ý sự kiện':'Có thể khác kỳ vọng trang phục; vẫn là lựa chọn cá nhân';}
  function chooseLook(l,key,event){if(!LOOKS[key]||LOOKS[key].adult&&l.age<18||l.age<12&&key!=='natural')return false;var b=beauty(l);b.presentation858={look:key,event:event||'daily',at:year(l),fit:lookFit(l,key,event||'daily')};return true;}
  function react(l,event,log){var q=context(l),b=l.flags.beauty919,p=b&&b.presentation858;if(!q||!q.me||!p)return null;
    b.reactions858=b.reactions858||[];if(b.reactions858.some(function(x){return x.year===year(l)&&x.event===event;}))return null;
    var v=identity(l,q.h,q.me),cred=R.st(l).cred==null?60:R.st(l).cred,protocol=A.personState(l,q.me).protocol||0,attention=(v.position===1||q.h.seat===q.me.id?3:1)+(v.dutyRole==='working'?2:0)+(l.fame>=1000000?2:0),fit=LOOKS[p.look].fit.includes(event),bias=data(q.me).pressTone==null?0:data(q.me).pressTone;
    var score=(fit?2:-1)+protocol/40+(cred-50)/50+bias,roll=(Math.imul(year(l)+q.me.id.length,2654435761)>>>0)%9-4;
    var outcome=score+roll>3?'positive':score+roll<0&&attention>=3?'critical':'neutral';
    var rec={year:year(l),event:event,look:p.look,attention:attention,outcome:outcome,fit:fit};b.reactions858.push(rec);
    if(outcome==='positive')R.st(l).cred=U.clamp(cred+1,0,100);else if(outcome==='critical'){R.st(l).cred=U.clamp(cred-1,0,100);state(q.me).presentationCase={from:year(l),due:year(l)+1,status:'open',event:event};}
    if(log)log(outcome==='positive'?'Phong cách tại sự kiện được đón nhận tích cực.':outcome==='critical'?'Một phần truyền thông bàn về trang phục; văn phòng sẽ cùng bạn xử lý kỳ vọng ở kỳ sau. Tước và quyền kế vị được giữ riêng.':'Phong cách được ghi nhận bình thường; sự kiện tiếp tục theo lịch.','neutral');return rec;
  }
  E.BEAUTY919.STYLES.naturalStraight=['Tóc thẳng tự nhiên',.002,0,2];E.BEAUTY919.STYLES.softWave=['Gợn nhẹ không hóa chất',.004,0,8];
  X.menu('royalLook858','Làm đẹp theo sự kiện và lựa chọn cá nhân',function(l){return X.reason(l,6);},function(l,d){var b=beauty(l),event=d.arg.event||b.presentation858?.event||'daily',q=context(l);return 'Bối cảnh: '+({daily:'đời thường',charity:'thiện nguyện',outdoor:'ngoài trời',formal:'tiệc tối trang trọng',ceremony:'nghi lễ',fashion:'thời trang'})[event]+'. Gợi ý thẩm mỹ là kỳ vọng của sự kiện, không phải luật giữ tước.\n'+(q?'Mức chú ý tăng theo vai trò, công vụ, truyền thông và lịch sử nhân vật.':'Mỗi người có thể chọn phong cách theo sở thích.')+'\nĐang chọn: '+(b.presentation858?LOOKS[b.presentation858.look].name:'chưa chọn')+'\n'+Object.keys(LOOKS).map(function(k){return LOOKS[k].name+': '+lookFit(l,k,event);}).join('\n');},function(l,arg){var b=beauty(l),event=arg.event||b.presentation858?.event||'daily',out=[];
    ['daily','charity','outdoor','formal','ceremony','fashion'].forEach(function(k){out.push({k:'event:'+k,l:'Xem gợi ý: '+({daily:'đời thường',charity:'thiện nguyện',outdoor:'ngoài trời',formal:'tiệc tối',ceremony:'nghi lễ',fashion:'thời trang'})[k],run:function(l,r){X.next(l,'royalLook858',r,{event:k});}});});
    Object.keys(LOOKS).forEach(function(k){out.push({k:k,l:LOOKS[k].name+' · '+lookFit(l,k,event),why:LOOKS[k].adult&&l.age<18||l.age<12&&k!=='natural'?'Chưa phù hợp tuổi':true,run:function(l,r,log){if(chooseLook(l,k,event))log('Bạn chọn '+LOOKS[k].name+'. Sự phù hợp và phản ứng được xem khi thực sự dự sự kiện, không tự mất tước hoặc quyền kế vị.','good');X.next(l,'royalLook858',r,{event:event});}});});
    ['ribbon','clip','braid'].forEach(function(k){out.push({k:'accessory:'+k,l:'Phụ kiện / tóc: '+({ribbon:'nơ vải',clip:'kẹp tóc',braid:'tóc tết'})[k],run:function(l,r){beauty(l).accessory858=k;if(k==='braid'){var hair=E.BEAUTY919.hair(l);if(hair.len>=10)hair.style='braid';}X.next(l,'royalLook858',r,{event:event});}});});
    if(l.age>=18){out.push({k:'nails',l:'Chọn móng màu theo sở thích',run:function(l,r){beauty(l).nails858={color:'đỏ rượu',at:year(l)};X.next(l,'royalLook858',r,{event:event});}});out.push({k:'tattoo',l:'Hình xăm mini · chi phí mô phỏng '+H.money(l,l.base*.02),why:b.tattoo858?'Đã ghi hình xăm':l.money>=l.base*.02?true:'Chưa đủ ngân sách',run:function(l,r,log){if(l.age<18||beauty(l).tattoo858||l.money<l.base*.02)return;H.cash(l,-l.base*.02,'Hình xăm mini');beauty(l).tattoo858={kind:'mini',at:year(l)};log('Bạn chọn hình xăm mini tại cơ sở phù hợp. Đây là lựa chọn ngoại hình cá nhân; không tự thay tước, HRH hoặc kế vị.','neutral');X.next(l,'royalLook858',r,{event:event});}});}
    return out;
  },6);
  var duty=E.DEC.royalDuty920.apply;E.DEC.royalDuty920.apply=function(l,d,k,r,log){var before=R.st(l).budget&&R.st(l).budget.spent||0,out=duty.apply(this,arguments),after=R.st(l).budget&&R.st(l).budget.spent||0;if(after>before){var q=context(l);if(q&&q.me)state(q.me).dutyAt=year(l);var key=d.data&&d.data.keys&&d.data.keys[Number(k)],event={ceremony:'ceremony',visit:'outdoor',patron:'charity',diplo:'formal'}[key]||'ceremony';react(l,event,log);};return out;};
  var roleApply=E.DEC.royalRole920.apply;E.DEC.royalRole920.apply=function(l,d,k,r,log){var out=roleApply.apply(this,arguments),q=context(l),s=R.st(l);if(q&&R.role(l)!=='working'&&s.budget&&s.budget.left>0){s.ledger.push({y:year(l),t:'hoàn ngân sách chưa chi khi giảm công vụ',v:-s.budget.left});s.budget.returned858=(s.budget.returned858||0)+s.budget.left;s.budget.left=0;}if(q)sync(l,q.h,'đổi vai trò công vụ');return out;};

  // Nối vào các điểm mở rộng hiện hữu. Những nước ngoài phạm vi giữ hành vi cũ.
  var prepare=A.prepare;A.prepare=function(l,h){var out=prepare.apply(this,arguments);bind(l,h);return out;};
  var preference=A.malePreference;A.malePreference=function(h,a,b,l){if(l&&h.cc==='GB'&&date(l)<'2015-03-26')return true;if(l&&h.cc==='DK'&&date(l)<'2009-06-12')return true;if(l&&h.cc==='NL'&&year(l)<1983)return true;return preference.apply(this,arguments);};
  var eligible=A.eligible;A.eligible=function(l,h,m){if((h.cc==='SE'&&year(l)<1980||h.cc==='DK'&&year(l)<1953||h.cc==='BE'&&year(l)<1991)&&(m.sex==='F'||ancestry(h,m).some(function(x){return x.sex==='F';})))return false;return eligible.apply(this,arguments);};
  var titleOld=A.title;A.title=function(m){return title(m)||titleOld.apply(this,arguments);};
  var royalTitle=E.royalTitle;E.royalTitle=function(l){var label=lifeTitle(l);return label==null?royalTitle.apply(this,arguments):label;};
  D.countries.forEach(function(c){if(E.ROYAL847.HEIR_TITLES[c]){['M','F'].forEach(function(sex){E.ROYAL847.HEIR_TITLES[c][sex]='Người thừa kế '+c+' — từng tước cần đối chiếu điều kiện và quyết định riêng';if(E.ROYAL847.CONSORT_TITLES[c])E.ROYAL847.CONSORT_TITLES[c].heir[sex]='Phối ngẫu người thừa kế — dùng tước theo căn cứ riêng, không tự sở hữu xứ';});}});
  var create=E.createLife;E.createLife=function(){var l=create.apply(this,arguments);var s=l.flags.royal920;if(s)Object.values(s.houses||{}).forEach(function(h){if(supported(h))sync(l,h,'khởi tạo/đọc hồ sơ');});return l;};
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate.apply(this,arguments);var s=l.flags&&l.flags.royal920;if(s)Object.values(s.houses||{}).forEach(function(h){if(supported(h))sync(l,h,'đối chiếu bản lưu');});};
  var named=E.FAMILY53.name;E.FAMILY53.name=function(l,id,value,at,log){var result=named.apply(this,arguments);if(result.ok){var k=(l.kids||[]).find(function(k){return k.parentId===id;}),h=k&&k.royal920&&R.st(l).houses[k.royal920.cc],m=h&&person(h,k.royal920.id);if(m&&supported(h)){m.name=k.name;setNames(l,h,m,{given:[k.name],daily:k.name,legalSurname:namesOf(l,h,m).legalSurname});}}return result;};
  var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments),q=context(l);if(q&&q.me)p.jobInfo.push(report(l,q.h,q.me));return p;};
  E.HOOKS.year.push(function(l,r,log){var s=l.flags.royal920;if(!s||!l.alive)return;Object.values(s.houses||{}).forEach(function(h){if(!supported(h))return;inherit(l,h);sync(l,h,'năm mới / thay đổi ngôi');h.members.forEach(function(m){var a=data(m);(a.requests||[]).filter(function(x){return x.status==='pending'&&year(l)>x.from;}).forEach(function(x){if(x.seat!==h.seat){x.status='reviewAgain';return;}var credibility=R.st(l).cred==null?60:R.st(l).cred,near=R.lineOf(l,h,m)||99,allow=r()<U.clamp(.25+credibility/300+(near<=6?.15:0),.1,.85);x.status=allow?'approved':'deferred';x.decidedAt=year(l);if(allow){var key=h.cc==='GB'?(R.order(l,h)[0]===m?'wales':year(l)>=2023?'edinburgh':'sussex'):h.cc==='SE'?'swedenDuchy':h.cc==='ES'?'spainDuchy':null;if(key)issue(l,h,m,key,{issuerId:h.seat,confirmed:true,scenario:true,territory:key==='spainDuchy'?'Lugo':'Östergötland'});}if(m.player)log(allow?'Quân chủ đã xem xét đề nghị; tước chỉ phát sinh nếu đủ điều kiện riêng.':'Đề nghị phong tước được hoãn; giữ vai trò và lịch sử hiện có.','neutral');});
      if(a.nameDiscussion&&a.nameDiscussion.status==='open'&&year(l)>=a.nameDiscussion.due){a.nameDiscussion.status='discussed';if(m.player||m.playerKid)log('Gia đình tiếp tục trao đổi về tên gọi và truyền thống; không phủ quyết tên chỉ vì gần ngai vàng.','neutral');}
      if(a.presentationCase&&a.presentationCase.status==='open'&&year(l)>=a.presentationCase.due){a.presentationCase.status='followedUp';if(m.player)log('Văn phòng cùng bạn bàn lại bối cảnh trang phục và ranh giới đời tư; bình luận thẩm mỹ không trở thành quyết định mất tước.','neutral');}
    });});});
  E.ROYAL858={DATA:D,supported:supported,date:date,bind:bind,identity:identity,title:title,lifeTitle:lifeTitle,context:context,sync:sync,report:report,nameFor:nameFor,namesOf:namesOf,setNames:setNames,setPublicStyle:setPublicStyle,issue:issue,applyOrder:applyOrder,inherit:inherit,state:state,templates:TEMPLATES,canName:canName,nameFormData:nameFormData,validNameInput:validNameInput,LOOKS:LOOKS,lookFit:lookFit,chooseLook:chooseLook,react:react,roleOverride:roleOverride};
})(globalThis.G);
