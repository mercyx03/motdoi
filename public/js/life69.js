/* V5.6 — cùng danh mục esports cho sự nghiệp và khán giả. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,U=G.U,D=G.ESPORTS_DATA;
  var ids=Object.keys(D.games), names=ids.map(function(k){return D.games[k].name;});
  function game(l){return ids[names.indexOf(l.game)];}
  function practiceSkill(l,g){var p=l.flags.esPractice&&l.flags.esPractice[g];return p?p.skill:l.talent==='game'&&l.game===g?(l.skill||20):20;}
  E.esportsPractice=function(l,g,night){if(names.indexOf(g)<0)return;var all=l.flags.esPractice||(l.flags.esPractice={}),p=all[g]||(all[g]={skill:practiceSkill(l,g),age:l.age,gained:0});if(p.age!==l.age){p.age=l.age;p.gained=0;}var gain=Math.min(night?1:2,Math.max(0,12-p.gained));p.skill=U.clamp(p.skill+gain,0,100);p.gained+=gain;};
  function free(l){return l.alive&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.abroad&&l.abroad.trapped)&&!(l.flags.military&&l.age<l.flags.military);}
  function pro(l){return !!(l.job&&E.resolveJob(l.job.id)==='tuyen_thu_es');}
  function managed(l){return pro(l)&&!!game(l);}
  function lg(id){return D.leagues.filter(function(x){return x.id===id;})[0];}
  function team(id){for(var i=0;i<D.leagues.length;i++){var t=D.leagues[i].teams.filter(function(x){return x.id===id;})[0];if(t)return t;}return null;}
  var america='US CA MX GT BZ HN SV NI CR PA CU HT DO JM BS BB TT AG DM GD KN LC VC AR BO BR CL CO EC GY PY PE SR UY VE';
  var asia='VN JP KR KP CN TW HK MO TH LA KH MM MY SG ID PH BN TL IN PK BD LK NP BT MV MN AU NZ FJ PG WS TO SB VU FM KI MH NR PW TV';
  function has(list,k){return (' '+list+' ').indexOf(' '+k+' ')>=0;}
  function region(l,g){var c=l.flags.esBirthCountry||l.country||'VN';
    if(g==='lol')return c==='CN'?'LPL':c==='KR'?'LCK':c==='BR'?'CBLOL':has(america,c)?'LCS':has(asia,c)?'LCP':'LEC';
    if(g==='val')return 'VCT-'+(c==='CN'?'CN':has(america,c)?'Americas':has(asia,c)?'Pacific':'EMEA');
    if(g==='aov')return c==='TH'?'RPL':/^(TW|HK|MO)$/.test(c)?'GCS':/^(ID|MY|SG|PH)$/.test(c)?'ACS':'AOG';
    return 'TFT-'+(c==='CN'?'CN':has(america,c)?'AMER':has(asia,c)?'APAC':'EMEA');
  }
  function init(l,r){
    if(!managed(l))return null;
    var g=game(l),s=l.flags.esports;
    if(!l.job.esCareerKey)l.job.esCareerKey=(l.flags.esCareerSerial||0)+1;
    l.flags.esCareerSerial=Math.max(l.flags.esCareerSerial||0,l.job.esCareerKey);
    if(!s||s.game!==g||s.careerKey!==l.job.esCareerKey){
      var legacy=!s&&(l.job.yrs||0)>0&&l.job.rank>0,oldRank=l.job.rank;
      s=l.flags.esports={game:g,league:region(l,g),careerKey:l.job.esCareerKey,jobSince:l.job.since,experience:0,form:50,peak:21+Math.floor(r()*3),retire:26+Math.floor(r()*4),reflex:l.skill||30,stage:'academy',team:null,history:[],seasons:0};
      l.job.rank=0;
      if(legacy){s.stage='pro';s.experience=Math.min(100,l.job.yrs*6);s.team=g==='tft'?null:lg(s.league).teams.filter(function(t){return !t.guest&&!t.archived;})[0].id;l.job.rank=Math.min(3,oldRank);s.legacy=true;}
      ['floor','last','sportPrevSalary','sportPaidFactor','sportContract'].forEach(function(k){delete l.job[k];});
    }
    return s;
  }
  function training(l,r,log,focus){var s=init(l,r);if(!s||s.aged===l.age)return;s.aged=l.age;
    s.reflex=U.clamp(l.skill==null?s.reflex:l.skill,0,100);
    s.experience=U.clamp(s.experience+5+r()*3,0,100);
    var loss=l.age>s.peak?1+(l.age-s.peak)*.45+r()*1.5:-(2+r()*2+(focus==='work'?1:0));
    s.reflex=U.clamp(s.reflex-loss,0,100);l.skill=s.reflex;
    s.form=Math.round(U.clamp(50+(r()-.5)*48+(l.st.hea-60)*.18-(l.mind&&l.mind.stress||0)*.12,10,95));
    log('Esports: phản xạ '+Math.round(s.reflex)+'/100 · kinh nghiệm '+Math.round(s.experience)+'/100 · phong độ '+s.form+'/100.','neutral');
    if(l.age<s.retire&&free(l)&&!(l.sched||[]).some(function(x){return x.id==='es_season'&&x.at===l.age;}))H.sched(l,'es_season',0);
  }
  function queue(l,r,id,arg){var d=E.DEC[id].make(l,r,arg);l.pending.unshift(d);return d;}
  var close={k:'close',l:'Để dịp khác'};
  // Dynamic menus carry only stable catalog IDs. Every apply rechecks current state.
  function menu(id,valid,make,apply){E.DEC[id]={valid:valid,make:function(l,r,a){var d=make(l,r,a||{});d.id=id;d.data=d.data||{};d.opts=d.opts.map(function(o){return{k:o.k,l:o.l,h:o.h||''};});return d;},auto:function(l,d,r){var a=d.opts.filter(function(x){return x.k!=='close';});return a.length?a[Math.floor(r()*a.length)].k:'close';},apply:function(l,d,k,r,log){if(!valid(l,d.data)||!d.opts.some(function(o){return o.k===k;})||k==='close')return;apply(l,d.data,k,r,log);}};}
  function local(l){return l.abroad&&l.abroad.perm&&l.abroad.code||l.country;}
  function fee(l,n){return l.cur==='vnd'?n:n/90*l.base;}
  function pay(l,n,label,log){var x=fee(l,n);if(l.money<x){log('Bạn chưa đủ tiền cho '+label.toLowerCase()+'.','neutral');return false;}H.cash(l,-x,label);return true;}
  menu('es_watch',free,function(){return{title:'Đi xem esports',text:'Chọn game bạn muốn cổ vũ. Danh mục tham chiếu mùa 2026:',opts:ids.map(function(k){return{k:k,l:D.games[k].name};}).concat([close])};},function(l,d,k,r){queue(l,r,'es_watch_league',{game:k});});
  menu('es_watch_league',function(l,d){return free(l)&&d&&!!D.games[d.game];},function(l,r,a){return{title:D.games[a.game].name,text:a.game==='tft'?'Chọn khu vực của tuyển thủ:':'Chọn giải / khu vực:',data:a,opts:D.leagues.filter(function(x){return x.game===a.game;}).map(function(x){return{k:x.id,l:x.name};}).concat([close])};},function(l,d,k,r){if(lg(k)&&lg(k).game===d.game)queue(l,r,'es_watch_team',{league:k});});
  menu('es_watch_team',function(l,d){return free(l)&&d&&!!lg(d.league);},function(l,r,a){var x=lg(a.league);return{title:x.name,text:x.snapshot+'. '+(x.individual?'Chọn tuyển thủ:':'Chọn đội bạn muốn cổ vũ:'),data:a,opts:x.teams.map(function(t){return{k:t.id,l:t.name+(t.guest?' · khách mời Versus':t.archived?' · mùa Xuân':'')};}).concat([close])};},function(l,d,k,r){var x=lg(d.league);if(!x.teams.some(function(t){return t.id===k;}))return;queue(l,r,'es_watch_player',{league:d.league,team:k});});
  menu('es_watch_player',function(l,d){return free(l)&&d&&!!lg(d.league)&&lg(d.league).teams.some(function(t){return t.id===d.team;});},function(l,r,a){var x=lg(a.league),t=team(a.team);return{title:t.name,text:x.individual?'Bạn muốn xem tuyển thủ này thi đấu?':'Cổ vũ cả đội hoặc một tuyển thủ:',data:a,opts:(x.individual?[{k:'all',l:'Cổ vũ '+t.name}]:[{k:'all',l:'Cổ vũ cả đội'}].concat(t.players.map(function(n,i){return{k:String(i),l:n};}))).concat([close])};},function(l,d,k,r){var t=team(d.team),p=k==='all'?null:t.players[+k];if(k!=='all'&&!p)return;queue(l,r,'es_watch_confirm',{league:d.league,team:d.team,player:p,at:l.age});});
  menu('es_watch_confirm',function(l,d){return free(l)&&d&&d.at===l.age&&!!team(d.team);},function(l,r,a){var x=lg(a.league),t=team(a.team),os=[{k:'online',l:'Xem trực tuyến · miễn phí'}];if(!x.individual&&local(l)===x.host)os.push({k:'arena',l:'Đến nhà thi đấu · '+H.money(l,fee(l,.3))});return{title:'Cổ vũ '+(a.player||t.name),text:x.name+' · '+(!x.individual&&local(l)===x.host?'Có thể mua vé xem tại nước bạn đang sống.':'Bạn có thể xem trực tuyến từ nơi đang sống.'),data:a,opts:os.concat([close])};},function(l,d,k,r,log){var x=lg(d.league),t=team(d.team);if(k==='arena'&&(x.individual||local(l)!==x.host||!pay(l,.3,'Vé xem esports',log)))return;
    if(l.flags.esWatchedAge===l.age){log('Bạn tiếp tục theo dõi '+(d.player||t.name)+'.','neutral');return;}
    l.flags.esWatchedAge=l.age;l.flags.esSupport={game:x.game,league:x.id,team:t.id,player:d.player};H.fx(l,{hap:3,kno:1});
    log('Xem '+x.name+(k==='arena'?' tại nhà thi đấu':' trực tuyến')+', cổ vũ '+(d.player||t.name)+'. '+U.pick(r,['Một pha lật kèo khiến bạn bật dậy reo hò.','Bạn cùng bạn bè bàn luận cách đọc tình huống.','Trận đấu căng thẳng đến những phút cuối.']),'good');
    H.mem(l,'Cổ vũ '+(d.player||t.name)+' tại '+x.name+'.',2);
  });
  function eligible(l){return free(l)&&l.age>=18&&l.age<=23&&!l.school&&!pro(l);}
  menu('es_try',eligible,function(l){var played=E.playedGames(l);return{title:'Thử sức tuyển thủ esports',text:'Chọn game bạn đã chơi. Qua tuyển chọn mới vào học viện; cần thi đấu tốt để được đội lớn chiêu mộ.',opts:ids.filter(function(k){return played.indexOf(D.games[k].name)>=0;}).map(function(k){return{k:k,l:D.games[k].name};}).concat([close])};},function(l,d,k,r){if(E.playedGames(l).indexOf(D.games[k].name)>=0)queue(l,r,'es_try_confirm',{game:k,at:l.age});});
  menu('es_try_confirm',function(l,d){return eligible(l)&&d&&d.at===l.age&&!!D.games[d.game]&&E.playedGames(l).indexOf(D.games[d.game].name)>=0;},function(l,r,a){return{title:'Vòng tuyển chọn '+D.games[a.game].name,text:(l.job?'Nếu trúng tuyển, bạn sẽ rời công việc hiện tại. ':'')+'Bạn muốn thể hiện thế mạnh nào?',data:a,opts:[{k:'mechanics',l:'Thi đấu xếp hạng, thể hiện kỹ năng'},{k:'teamwork',l:'Đấu thử, phối hợp và giao tiếp'},{k:'analysis',l:'Phân tích trận đấu và thích nghi bản cập nhật'},close]};},function(l,d,k,r,log){
    var trained=practiceSkill(l,D.games[d.game].name),mark=trained*.55+l.st.kno*.2+l.st.soc*.1+r()*20+(k==='analysis'?5:0);
    if(mark<55){log('Chưa vượt qua tuyển chọn '+D.games[d.game].name+'. Hãy luyện tập thêm.','neutral');return;}
    l.game=D.games[d.game].name;l.skill=trained;l.gameType=d.game==='val'?'FPS':d.game==='tft'?'Khác':'MOBA';E.startJob(l,'tuyen_thu_es',r,log);var s=init(l,r);l.job.rank=0;
    log(d.game==='lol'&&region(l,d.game)==='LCP'&&(l.flags.esBirthCountry||l.country)==='VN'?'Bắt đầu từ đội trẻ / VCS B. Phong độ tốt có thể mở cơ hội được đội LCP chiêu mộ.':'Gia nhập hệ đào tạo trẻ, bắt đầu tích lũy kinh nghiệm thi đấu.','good');
    queue(l,r,'es_season');
  });
  function seasonValid(l,d){var s=l.flags.esports;return free(l)&&managed(l)&&s&&l.age<s.retire&&(!d||d.at==null||d.at===l.age)&&(!d||d.token==null||s.season&&s.season.token===d.token);}
  function calendar(s){
    if(s.game==='lol')return[{id:'split1',name:s.league==='LCK'?'LCK Cup':s.league==='LEC'?'LEC Versus':s.league+' · chặng đầu',size:lg(s.league).teams.length},{id:'fst',name:'First Stand',size:8,intl:true},{id:'split2',name:s.league+' · chặng giữa năm',size:lg(s.league).teams.filter(function(t){return !t.guest&&!t.archived;}).length},{id:'msi',name:'MSI',size:11,intl:true},{id:'ewcq',name:'Vòng tuyển chọn EWC',size:8},{id:'ewc',name:'Esports World Cup',size:16,intl:true},{id:'split3',name:s.league+' · chặng cuối mùa',size:lg(s.league).teams.filter(function(t){return !t.guest&&!t.archived;}).length},{id:'worlds',name:'Chung kết thế giới LMHT',size:19,intl:true}];
    if(s.game==='val')return[{id:'kickoff',name:s.league+' Kickoff',size:12},{id:'santiago',name:'Masters Santiago',size:12,intl:true},{id:'stage1',name:s.league+' Stage 1',size:12},{id:'london',name:'Masters London',size:12,intl:true},{id:'ewcq',name:'Vòng tuyển chọn EWC',size:8},{id:'ewc',name:'Esports World Cup',size:16,intl:true},{id:'stage2',name:s.league+' Stage 2',size:s.league==='VCT-CN'?14:16},{id:'champions',name:'VALORANT Champions',size:16,intl:true}];
    if(s.game==='aov'){var a=[{id:'spring',name:s.league==='ACS'?'AoV Crown Series':s.league+' · mùa Xuân',size:s.league==='AOG'?8:lg(s.league).teams.length},{id:'aplwc',name:'APL · vòng Wildcard',size:8},{id:'apl',name:'Arena of Valor Premier League (APL)',size:16,intl:true}];if(s.league!=='ACS')a=a.concat([{id:'winter',name:s.league+' · mùa Đông',size:s.league==='AOG'?9:lg(s.league).teams.length},{id:'aic',name:'Arena of Valor International Championship (AIC)',size:16,intl:true}]);return a;}
    return[{id:'open',name:'TFT · Tactician’s Trials',size:256},{id:'pro1',name:'TFT Pro Circuit · Stargazer Cup',size:32},{id:'pro2',name:'TFT Pro Circuit · Dark Star Cup',size:32},{id:'pro3',name:'TFT Pro Circuit · Anima Cup',size:32},{id:'regional',name:'TFT · chung kết khu vực',size:64},{id:'crown',name:'Tactician’s Crown',size:40,intl:true}];
  }
  function qualified(s,id){var z=s.season.results||{},r=function(k){return z[k]&&z[k].place||999;};
    if(s.game==='aov'&&s.league==='AOG'&&team(s.team)&&team(s.team).winterOnly&&/^(spring|aplwc|apl)$/.test(id))return false;switch(id){case'fst':return r('split1')<=(/LCK|LPL/.test(s.league)?2:1);case'msi':return r('split2')<=(s.league==='CBLOL'?1:2);case'ewc':return s.game==='val'&&r('stage1')===1||r('ewcq')<=(s.game==='val'?s.league==='VCT-EMEA'?3:2:/LCK|LPL|EMEA/.test(s.league)?2:1);case'worlds':return r('split3')<=(s.league==='CBLOL'?2:3)||r('msi')===1&&r('split3')<=6||s.season.msiExtra&&r('split3')===4;case'santiago':return r('kickoff')<=3;case'london':return r('stage1')<=3;case'champions':return r('stage2')<=2||s.season.pointsRank<=2;case'aplwc':return s.league==='ACS'?r('spring')<=2:r('spring')>=5&&r('spring')<=6;case'apl':return s.league!=='ACS'&&r('spring')<=4||r('aplwc')<=4;case'aic':return r('winter')<=4;case'pro1':case'pro2':case'pro3':return s.history.some(function(x){return x.age<s.season.at&&/chung kết khu vực/.test(x.event)&&x.place<=32;});case'regional':return r('open')<=8||r('pro1')<=16||r('pro2')<=16||r('pro3')<=16;case'crown':return r('pro1')===1||r('pro2')===1||r('pro3')===1||s.season.tftPointsRank===1||r('regional')<=({'TFT-AMER':7,'TFT-EMEA':5,'TFT-APAC':7,'TFT-CN':8}[s.league]||5);default:return true;}
  }
  var situations={
    lol:[['Đối thủ liên tục lấy mục tiêu sớm.','ward','Cắm mắt sâu, đọc hướng di chuyển','lane','Đổi đường lấy trụ','fight','Ép giao tranh sớm'],['Fearless Draft khiến bể tướng bị thử thách.','pool','Chuẩn bị lựa chọn mới','comfort','Giữ lối đánh quen thuộc','flex','Đổi vai trò trong đội'],['Đội bạn đang dẫn nhưng chưa thể kết thúc.','vision','Kiểm soát tầm nhìn quanh mục tiêu lớn','split','Đẩy lẻ kéo giãn đội hình','dive','Đánh thẳng vào căn cứ']],
    val:[['Đội đối phương bắt bài hướng tấn công.','default','Đánh chậm, lấy thông tin trước','rush','Đổi nhịp đánh nhanh','fake','Nghi binh rồi đổi khu vực'],['Đội đang thua điểm và thiếu tiền mua súng.','save','Giữ súng, đồng bộ kinh tế','force','Mua ép tìm đột biến','timeout','Xin hội ý chỉnh phối hợp'],['Đối thủ kiểm soát khu giữa bản đồ.','utility','Phối hợp kỹ năng để lấy lại khoảng trống','duel','Chủ động đấu súng','rotate','Đổi hướng né điểm mạnh đối phương']],
    aov:[['Đối thủ tập trung tranh Rồng.','trade','Đổi mục tiêu, lấy lợi thế cánh còn lại','contest','Tập trung tranh chấp','pick','Phục kích người đi lẻ'],['Đồng đội bị ép liên tục ở đường bên.','cover','Đảo đường hỗ trợ','farm','Tập trung tăng tiến sức mạnh','bait','Dụ đối thủ giao tranh'],['Trận đấu kéo dài, một sai lầm có thể mất nhà.','vision','Kiểm tra tầm nhìn trước khi lấy mục tiêu','siege','Đẩy cả đội cùng nhau','flank','Tìm góc vòng ra phía sau']],
    tft:[['Nhiều người trong sảnh đang chơi cùng đội hình với bạn.','pivot','Xoay sang bài ít bị tranh','roll','Roll giữ đội hình hiện tại','econ','Giữ tiền chờ cấp cao'],['Máu thấp, lượng vàng còn khá nhiều.','stabilize','Roll ổn định bàn đấu','level','Lên cấp tăng trần sức mạnh','greed','Giữ vàng thêm một vòng'],['Đối thủ đứng đầu đã lộ cách xếp đội hình.','scout','Soi bàn, đổi vị trí chủ lực','item','Ghép trang bị còn thiếu','risk','Đổi toàn bộ đội hình']]
  };
  function next(l,r,log){var s=init(l,r),z=s.season,cal=calendar(s);while(z.index<cal.length&&!qualified(s,cal[z.index].id)){log('Chưa giành được vé '+cal[z.index].name+'.','neutral');z.index++;}if(z.index<cal.length)queue(l,r,'es_match',{at:l.age,token:z.token,index:z.index});else{z.done=true;s.seasons++;log('Khép lại mùa thi đấu. Thành tích sẽ được tính khi thương lượng hợp đồng.','neutral');}}
  menu('es_season',seasonValid,function(l,r){var s=init(l,r),t=team(s.team),done=s.season&&s.season.at===l.age;return{title:'Mùa esports · '+(l.birthYear+l.age),text:(s.stage==='academy'?'Bạn đang ở hệ đào tạo trẻ.':(s.game==='tft'?'Thi đấu cá nhân':t&&t.name)+' · '+s.league)+'. Phản xạ '+Math.round(s.reflex)+' · kinh nghiệm '+Math.round(s.experience)+' · phong độ '+s.form+'.',opts:done?[close]:[{k:'play',l:s.stage==='academy'?'Thi đấu tuyển chọn lên chuyên nghiệp':'Bắt đầu mùa thi đấu'},close],data:{at:l.age}};},function(l,d,k,r,log){var s=init(l,r);if(s.season&&s.season.at===l.age)return;
    s.season={at:l.age,token:l.age+':'+s.game+':'+s.careerKey+':'+s.seasons,index:0,results:{},points:0,pointsRank:999};
    if(s.stage==='academy'){
      var score=s.reflex*.7+s.experience*.15+s.form*.15;
      if(score<55||r()>U.clamp((score-35)/65,.05,.85)){log('Mùa tuyển chọn chưa đủ nổi bật, bạn tiếp tục ở đội trẻ.','neutral');s.season.done=true;return;}
      queue(l,r,'es_recruit',{at:l.age,token:s.season.token});return;
    }
    next(l,r,log);
  });
  menu('es_recruit',seasonValid,function(l,r,a){var s=init(l,r),x=lg(s.league),available=x.teams.filter(function(t){return !t.guest&&!t.archived;}),choices=[];if(s.game==='tft'){choices=[{k:'solo',l:'Thi đấu tự do tại '+x.name}];var orgs=[];x.teams.forEach(function(t){var m=/^([A-Z0-9]{2,5}) /.exec(t.name);if(m&&orgs.indexOf(m[1])<0)orgs.push(m[1]);});orgs.slice(0,3).forEach(function(n){choices.push({k:'sponsor:'+n,l:'Nhận hợp đồng đội '+n+' · bao ăn ở'});});}else{var start=Math.floor(r()*available.length);for(var i=0;i<Math.min(3,available.length);i++){var t=available[(start+i)%available.length];choices.push({k:t.id,l:'Nhận lời '+t.name});}}return{title:'Cơ hội lên chuyên nghiệp',text:s.game==='lol'&&(l.flags.esBirthCountry||l.country)==='VN'?'Đấu tốt ở hệ trẻ giúp bạn được các đội LCP mời thử việc. Chọn lời mời phù hợp:':'Màn thể hiện ở vòng tuyển chọn đã mở ra cơ hội mới:',data:a,opts:choices.concat([close])};},function(l,d,k,r,log){var s=init(l,r);if(s.stage!=='academy'||!s.season||s.season.promoted)return;var sponsored=s.game==='tft'&&k.indexOf('sponsor:')===0;if(k!=='solo'&&!sponsored&&!lg(s.league).teams.some(function(t){return t.id===k&&!t.guest&&!t.archived;}))return;s.team=s.game==='tft'?null:k;s.sponsor=sponsored?k.slice(8):null;s.stage='pro';s.season.promoted=true;s.season.done=true;l.job.rank=1;if(E.esportsContract){var contract=E.esportsContract(l,s,r);log('Lương hợp đồng '+H.money(l,E.ESPORTS.finance.gross(l)/12)+'/tháng · phần tiền thưởng '+Math.round(contract.share*100)+'%'+(contract.house?' · bao ăn ở tại gaming house.':'.'),'good');}log(s.game==='tft'?'Bước vào hệ thống thi đấu TFT cá nhân.':'Ký hợp đồng chuyên nghiệp với '+team(k).name+' tại '+s.league+'.','big');H.mem(l,'Lần đầu bước lên sân khấu esports chuyên nghiệp.',4);});
  menu('es_match',function(l,d){return seasonValid(l,d)&&d&&l.flags.esports.stage==='pro'&&l.flags.esports.season.index===d.index&&!l.flags.esports.season.done;},function(l,r,a){var s=init(l,r),ev=calendar(s)[a.index],pool=situations[s.game],scene=pool[Math.floor(r()*pool.length)];a.scene=scene;a.event=ev.id;var rivals=(ev.intl?D.leagues.filter(function(x){return x.game===s.game&&(!x.challengers||ev.id==='champions');}).reduce(function(a,x){return a.concat(x.teams);},[]):lg(s.league).teams).filter(function(t){return t.id!==s.team&&!t.guest&&!t.archived;});a.opponent=rivals[Math.floor(r()*rivals.length)].name;var os=[{k:scene[1],l:scene[2]},{k:scene[3],l:scene[4]},{k:scene[5],l:scene[6]}];for(var i=os.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),tmp=os[i];os[i]=os[j];os[j]=tmp;}return{title:ev.name,text:'Trận đấu tiêu điểm: '+(s.game==='tft'?'cùng sảnh với ':'gặp ')+a.opponent+'. '+scene[0],data:a,opts:os};},function(l,d,k,r,log){var s=init(l,r),z=s.season,ev=calendar(s)[d.index];if(z.results[ev.id]||!qualified(s,ev.id))return;
    var tactic=k===d.scene[1]?2+s.experience*.03:k===d.scene[3]?(s.reflex-55)*.12:(s.form-45)*.14;
    var power=s.reflex*.55+s.experience*.2+s.form*.25+tactic+(r()-.5)*25-(ev.intl?10:0);
    var field=[];for(var i=0;i<ev.size-1;i++)field.push(38+r()*55);var place=1+field.filter(function(v){return v>power;}).length;
    z.results[ev.id]={place:place,size:ev.size};s.history.push({age:l.age,event:ev.name,place:place,size:ev.size,intl:!!ev.intl});if(s.history.length>80)s.history.shift();
    log(ev.name+': '+(s.game==='tft'?'bạn':team(s.team).name)+' về hạng '+place+'/'+ev.size+'.',place===1?'big':place<=4?'good':'neutral');
    if(place<=3){var tier=ev.intl?'world':'national';if(E.recordSportResult)E.recordSportResult(l,tier,place===1?'win':'record','es560:'+ev.id);l.fame=Math.min(5e6,(l.fame||0)+(ev.intl?10000:1000)*(4-place));if(place===1){l.medals=l.medals||[];l.medals.push({ev:ev.name,m:'vàng',y:l.birthYear+l.age,career:'tuyen_thu_es',sport:l.game});H.mem(l,'Vô địch '+ev.name+'.',ev.intl?6:3);}}
    if(E.esportsAward)E.esportsAward(l,ev,place,r,log);
    if(ev.id==='msi')z.msiExtra=place<=2;
    if(/kickoff|stage1|santiago|london/.test(ev.id))z.points+=Math.max(0,7-place)+(place<=3?3:0);
    if(/^pro[123]$/.test(ev.id)){z.proPoints=(z.proPoints||0)+Math.max(0,37-place);if(ev.id==='pro3'){var rivals=[];for(var q=0;q<31;q++)rivals.push(r()*100);z.tftPointsRank=1+rivals.filter(function(x){return x>z.proPoints;}).length;}}
    if(ev.id==='stage2'){var others=[];for(var p=0;p<9;p++)others.push(Math.floor(r()*26));z.pointsRank=1+others.filter(function(v){return v>z.points;}).length;log('Xếp hạng điểm Champions trong nhóm chưa có vé trực tiếp: '+z.pointsRank+'.','neutral');}
    if(s.stage==='pro')l.job.rank=Math.min(3,Math.max(1,E.sportPerformance(l).rank));z.index++;next(l,r,log);
  });
  E.ACT.push({id:'es_watch',g:'Giải trí',l:'Đi xem esports / cổ vũ tuyển thủ',min:6,ai:{w:.03}});
  E.ACT.push({id:'es_try',g:'Công việc',l:'Thử tuyển thủ LMHT / Valorant / Liên Quân / TFT',min:18,max:23,avail:function(l){return eligible(l)&&E.playedGames(l).some(function(n){return names.indexOf(n)>=0;})?true:'Từ 18–23 tuổi, đã chơi game và không còn đi học';},ai:{w:.01}});
  E.ACT.push({id:'es_season',g:'Công việc',l:'Mùa giải esports / thông tin tuyển thủ',min:18,avail:function(l){return managed(l)&&free(l)?true:'Dành cho tuyển thủ thi đấu';},ai:{w:.4}});
  E.SC('es_scout',{title:'Lời mời thử việc esports',valid:eligible,text:'Một tuyển trạch viên để ý những trận đấu xếp hạng của bạn và mời tới vòng thử việc.',opts:[{k:'try',l:'Đến thử việc',run:function(l,r){queue(l,r,'es_try');}},{k:'no',l:'Giữ con đường hiện tại',run:function(){}}]});
  E.TRIG.push({id:'es_scout',when:function(l){return eligible(l)&&l.talent==='game'&&l.skill>=65&&E.playedGames(l).some(function(n){return names.indexOf(n)>=0;});},p:.18,cd:3,max:2});
  var performance=E.sportPerformance;
  E.sportPerformance=function(l){var s=l.flags.esports;if(!managed(l)||!s)return performance.apply(this,arguments);var points=0,seen={};s.history.forEach(function(x){var key=x.age+':'+x.event;if(seen[key]||x.age>l.age)return;seen[key]=true;var weight=x.intl?28:5;points+=weight*(x.place===1?1:x.place===2?.6:x.place===3?.35:0)*(l.age-x.age<=3?1:.3);});return{points:points,multiplier:1+Math.min(2.5,points*.025),rank:points>=65?3:points>=25?2:points>=5?1:0};};
  E.CAR.tuyen_thu_es.minAge=18;
  // The old generic 3-million contract must not contradict a signed league contract.
  if(E.DEC.es_hop_dong_doi){var oldContractValid=E.DEC.es_hop_dong_doi.valid;E.DEC.es_hop_dong_doi.valid=function(l,d){return !managed(l)&&oldContractValid(l,d);};}
  E.TRIG.filter(function(t){return t.id==='es_hop_dong_doi';}).forEach(function(t){var before=t.when;t.when=function(l,a){return !managed(l)&&before(l,a);};});
  var start=E.startJob;E.startJob=function(l,id,r,log){if(E.resolveJob(id)==='tuyen_thu_es'&&l.game==='Nghịch Thủy Hàn'){log('Nghịch Thủy Hàn chưa có con đường thi đấu chuyên nghiệp.','neutral');return false;}return start.apply(this,arguments);};
  var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments),s=l.flags.esports;if(managed(l)&&s){p.jobInfo.push((s.stage==='academy'?'Hệ đào tạo trẻ':s.game==='tft'?'Tuyển thủ cá nhân':team(s.team)&&team(s.team).name)+' · '+s.league);p.jobInfo.push('Phản xạ '+Math.round(s.reflex)+' · kinh nghiệm '+Math.round(s.experience)+' · phong độ '+s.form+' · dự kiến giải nghệ '+s.retire+' tuổi');}return p;};
  var migrate=E.migrateExt;E.migrateExt=function(l){if(migrate)migrate(l);if(managed(l))init(l,function(){return .5;});};
  // Capture country at creation so later emigration does not rewrite birth region.
  var create=E.createLife;E.createLife=function(){var l=create.apply(this,arguments);l.flags.esBirthCountry=l.country;return l;};
  E.ESPORTS={practiceSkill:practiceSkill,data:D,region:region,init:init,managed:managed,annual:training,calendar:calendar,qualified:qualified,free:free};
})(globalThis.G);
