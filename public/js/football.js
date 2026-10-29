/* Professional football extends the existing athlete career and annual finance pipeline. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, X = E.UPDATE110, D = E.FOOTBALL_DATA;
  function year(l) { return l.birthYear + l.age; }
  function peek(l) { return l.flags && l.flags.football; }
  function club(id) { return D.clubs.find(function (c) { return c.id === id; }); }
  function athlete(l) { return !!(l.job && E.resolveJob(l.job.id) === 'vdv' && l.talentSub === 'bóng đá'); }
  function free(l) { return X.free(l, 10) && !(l.flags && l.flags.military); }
  function usd(l, n) { var home = G.W.BY[H.resCode(l)]; return l.cur === 'vnd' ? n * G.CUR.VND / 1e6 : n / G.CUR.priceLevel(home ? home.gdp : l.gdp); }
  function active(l) { var s = peek(l); return !!(s && s.stage !== 'retired' && free(l)); }
  function syncTalent(l) {
    var s=peek(l);if(!s||s.stage==='retired')return;
    var relevant=l.talent==='thể thao'&&l.talentSub==='bóng đá',v=Math.max(0,Math.min(100,l.skill||0));
    if(s.bridgeSkill897==null){if(relevant){s.potential=Math.max(s.potential,v);D.skills.forEach(function(k){s.skills[k]=Math.min(s.potential,Math.max(s.skills[k],v*.9));});}s.bridgeSkill897=v;return;}
    var gain=v-s.bridgeSkill897;if(relevant&&gain>0){s.potential=Math.max(s.potential,v);D.skills.forEach(function(k){s.skills[k]=Math.min(s.potential,s.skills[k]+gain*.75);});}s.bridgeSkill897=v;
  }
  function employed(l){var s=peek(l);return !!(s&&s.stage==='pro'&&s.contract&&s.contract.end>year(l)&&athlete(l));}
  function syncOccupation(l,r){var s=peek(l);if(!s||s.stage!=='pro'||!s.contract||s.contract.end<=year(l))return false;
    if(!l.job){var old=l.talentSub,school=l.school,end=l.schoolEnd,abroad=l.abroad,histLength=(l.jobsHist||[]).length,prior=(l.jobsHist||[]).slice(-1)[0];l.talentSub='bóng đá';l.school=null;E.startJob(l,'vdv',r||H.rf(l),function(){},true);l.school=school;l.schoolEnd=end;l.abroad=abroad;if(!l.job||E.resolveJob(l.job.id)!=='vdv'){l.talentSub=old;return false;}if(prior&&E.resolveJob(prior.id)==='vdv'&&prior.to==null){l.jobsHist.splice(histLength);l.job.since=prior.from;l.job.yrs=Math.max(0,l.age-prior.from);}}
    if(athlete(l)){l.indep=true;l.job.club=(club(s.loan?s.loan.club:s.club)||{}).name;l.flags.needJob=false;l.flags.upgradeJob=false;l.pending=(l.pending||[]).filter(function(d){return d.id!=='job'||d.manual||d.data&&d.data.requested;});return true;}return false;
  }
  function negotiationWhy(l,c){var s=peek(l),y=year(l);if(!active(l)||!c)return 'Cần hồ sơ bóng đá và tự do tham gia.';if(l.age<16)return 'Từ 16 tuổi mới đàm phán hợp đồng chuyên nghiệp.';if(s.injury>0)return 'Cần hồi phục chấn thương trước khi đánh giá.';
    var attempts=s.negotiations897||{},renewal=s.contract&&s.contract.club===c.id;if(attempts[c.id]===y)return 'Đã trao đổi với CLB này trong năm; xem lời mời hoặc thử CLB khác.';
    if(!renewal&&Object.keys(attempts).filter(function(k){return attempts[k]===y;}).length>=3)return 'Đã trao đổi ba CLB trong năm; có thể xem lời mời đang có.';
    if(!renewal&&(rating(l)<c.strength-14||c.tier===1&&s.reputation<c.reputation*.35&&rating(l)<c.strength+8))return 'Năng lực vị trí hoặc thành tích hiện tại chưa phù hợp CLB này.';
    if(s.contract&&s.contract.end>y+1&&!renewal&&c.financeUSD<s.contract.annualUSD*2)return 'CLB chưa đủ ngân sách chuyển nhượng hợp đồng hiện tại.';return true;
  }
  function negotiationChance(l,c){var s=peek(l);return U.clamp(.45+(rating(l)-c.strength)/60+s.reputation/250+(s.potential>=85?.04:0),.12,.92);}
  function follow(l,id,r,arg){X.next(l,id,r,arg);var d=l.pending[0];d.data=d.data||{};d.data.actionId850='footballCareer';d.data.actionYear850=l.age;d.data.deferredTurn894=true;d.data.requested=true;}

  function init(l, r, legacySave) {
    if (peek(l)) return peek(l);
    r = r || function () { return .5; };
    var s = { version: 1, stage: 'local', position: 'MF', skills: {}, potential: 55 + r() * 40,
      form: 50, fitness: 85, stability: 50, recovery: 50, injury: 0, reputation: 0, internationalRep: 0,
      training: 'balanced', style: 'possession', trials: {}, offers: [], contracts: [], seasons: [], trophies: [],
      totals: { apps: 0, goals: 0, assists: 0, clean: 0, minutes: 0 }, national: { country: l.country, caps: 0, goals: 0, assists: 0, qualified: {} },
      coaches: {}, coach: { id: l.id + ':football:local', name: H.stranger(l, r, 'M'), trust: 50, style: 'Khuyến khích, coi trọng học văn hóa', history: [] },
      familySupport: l.fam && l.fam.q >= 3 ? 70 : 45, studyBalance: true, events: {} };
    D.skills.forEach(function (k) { s.skills[k] = Math.min(s.potential, 22 + r() * 18 + (l.talent==='thể thao'?(l.skill||0)*.2:0)); });
    l.flags.football = s;
    // A legacy athlete keeps the current career and receives a bounded transition contract.
    if (legacySave && athlete(l)) {
      var legacy = D.clubs.find(function (c) { return c.name === l.job.club; }) || D.clubs.find(function (c) { return c.country === H.resCode(l); });
      if (legacy) {
        s.club = legacy.id; s.stage = l.age < 16 ? 'youth' : 'pro';
        D.skills.forEach(function (k) { s.skills[k] = Math.min(95, Math.max(s.skills[k], l.skill || 30)); });
        s.potential = Math.max(s.potential, l.skill || 30);
        if (s.stage === 'pro') s.contract = { club: legacy.id, start: year(l), end: year(l) + 2, annualUSD: wage(l, legacy), bonusUSD: 0, signingUSD: 0, signed: true, legacy: true };
      } else s.legacyFallback = true;
    }
    syncTalent(l);return s;
  }
  function rating(l) {
    var s = peek(l); if (!s) return 0;
    var weights = D.weights[s.position] || D.weights.MF, total = 0, n = 0;
    Object.keys(weights).forEach(function (k) { total += s.skills[k] * weights[k]; n += weights[k]; });
    return U.clamp(total / n * .76 + s.form * .1 + s.fitness * .08 + s.skills.discipline * .06, 0, 100);
  }
  function stageFor(l) { return l.age < 15 ? 'U15' : l.age < 17 ? 'U17' : l.age < 19 ? 'U19' : 'U21'; }
  function trialOptions(l) {
    return D.clubs.filter(function (c) { return l.age >= c.minAge && l.age <= c.maxAge && (c.country === H.resCode(l) || l.age >= 18 && rating(l) >= 55); });
  }
  function trialCost(l, c) { return usd(l, c.country === H.resCode(l) ? 25 : 700) * (c.scholarship && peek(l).familySupport < 50 ? .2 : 1); }
  function trial(l, id, r, log) {
    var s = peek(l), c = club(id), y = year(l);
    if (!active(l) || !c || s.contract || s.injury>0 || !trialOptions(l).includes(c) || s.trials[id] === y || l.money < trialCost(l, c)){log('Chưa thử tuyển: kiểm tra tuổi học viện, nơi cư trú, hợp đồng, chấn thương, lượt thử và chi phí đi lại. Chưa trừ tiền.','neutral');return false;}
    H.cash(l, -trialCost(l, c), 'Đi lại và ăn ở thử tuyển bóng đá'); s.trials[id] = y;
    var score = rating(l) + s.potential * .13 + (s.studyBalance ? 2 : 0) + r() * 24 - 12;
    var threshold = c.competition * .6 + l.age * .65;
    var result = score >= threshold + 9 ? 'accepted' : score >= threshold + 3 ? 'extended' : score >= threshold - 4 ? 'lower' : 'rejected';
    if (s.injury > 0) result = 'rejected';
    s.lastTrial = { year: y, club: id, result: result, score: score };
    if (result === 'accepted') {
      s.offers.push({ id: 'academy:' + id + ':' + y, club: id, kind: 'academy', expires: y, scholarship: c.scholarship });
      log(c.name + ' nhận bạn vào ' + stageFor(l) + '. Mở lời mời để tự chọn đội.', 'good');
      if (score > threshold + 20) {
        var other = D.clubs.find(function (x) { return x.country === c.country && x.id !== id && x.tier === c.tier; });
        if (other) s.offers.push({ id: 'scout:' + other.id + ':' + y, club: other.id, kind: 'academy', expires: y });
      }
    } else if (result === 'extended') { s.events.retrial = { club: id, year: y + 1 }; log(c.name + ' mời trở lại thử việc vào năm sau; cần duy trì thể lực và luyện tập.', 'neutral'); }
    else if (result === 'lower') {
      var lower = D.clubs.find(function (x) { return x.country === c.country && x.tier > c.tier; });
      if (lower) s.offers.push({ id: 'lower:' + lower.id + ':' + y, club: lower.id, kind: 'academy', expires: y });
      log('Chưa đạt yêu cầu đội này. ' + (lower ? lower.name + ' đề nghị một lộ trình cấp thấp hơn.' : 'Bạn có thể luyện tập rồi thử lại năm sau.'), 'neutral');
    } else log(c.name + ' từ chối: ' + (s.injury ? 'cần hồi phục chấn thương.' : 'năng lực hoặc phong độ chưa đủ; có thể thử lại năm sau.'), 'bad');
    return result;
  }
  function relocate(l, code, log) {
    if (H.resCode(l) === code) return;
    var dest = G.W.BY[code]; if (!dest) return;
    var oldGDP = (G.W.BY[H.resCode(l)] || l).gdp, newCur = code === 'VN' ? 'vnd' : 'usd';
    var oldUSD = l.cur === 'vnd' ? 1e6 / G.CUR.VND : G.CUR.priceLevel(oldGDP);
    var newUnits = newCur === 'vnd' ? G.CUR.VND / 1e6 : 1 / G.CUR.priceLevel(dest.gdp);
    E.abroadConvert(l, oldUSD * newUnits); l.cur = newCur;
    l.abroad = code === l.country ? null : { code: code, name: dest.name, perm: true, football: true, pool: String(dest.pool || 'en').split(',')[0].split(':')[0] };
    l.city = dest.cities[0]; l.place = l.city; l.urban = true; H.setBase(l);
    log('Chuyển nơi cư trú tới ' + dest.name + ' để thi đấu; tiền và tài sản được quy đổi, quốc tịch giữ nguyên. Chi phí gia đình tiếp tục tính theo nơi sống.', 'neutral');
    H.fx(l, { hap: -2, soc: -1 });
  }
  function wage(l, c) {
    var s = peek(l), ability = rating(l), fame = 1 + Math.min(5, s.reputation / 25 + s.internationalRep / 40);
    var age = l.age < 23 ? .7 + s.potential / 200 : l.age > 32 ? .65 : 1;
    var role = ability > c.strength + 8 ? 1.8 : ability < c.strength - 8 ? .5 : 1;
    return Math.round(c.financeUSD * .18 * (.35 + ability / 100) * fame * age * role * (s.position === 'FW' ? 1.1 : 1));
  }
  function negotiate(l, id, r, log) {
    var s=peek(l),c=club(id),y=year(l),why=negotiationWhy(l,c);if(why!==true){log(why,'neutral');return false;}
    (s.negotiations897||(s.negotiations897={}))[id]=y;s.negotiateAt=y;
    var renewal=s.contract&&s.contract.club===id;
    if(r()>negotiationChance(l,c)){log(c.name+' chưa gửi đề nghị sau đánh giá vị trí và ngân sách. Bạn có thể liên hệ CLB khác trong hạn mức năm nay.','neutral');return false;}
    s.offers=s.offers.filter(function(o){return o.id!=='pro:'+id+':'+y;});
    s.offers.push({id:'pro:'+id+':'+y,club:id,kind:'pro',expires:y,annualUSD:wage(l,c),years:l.age<18?2:l.age>32?1:3,transferUSD:s.contract&&!renewal?Math.round(s.contract.annualUSD*Math.max(0,s.contract.end-y)):0});
    log(c.name+' gửi hợp đồng để bạn xem và quyết định; phí chuyển nhượng thuộc CLB, không cộng vào tiền cá nhân.','good');return true;
  }
  function accept(l, offerId, r, log, opts) {
    var s=peek(l),y=year(l),o=s&&s.offers.find(function(x){return x.id===offerId&&x.expires>=y;}),switching=l.job&&!athlete(l);
    if(!active(l)||!o||o.kind==='pro'&&l.age<16||switching&&!(opts&&opts.switchJob))return false;
    var c=club(o.club);if(!c||s.loan)return false;if(c.country!==H.resCode(l)&&(l.age<18||E.MOBILITY122.barrier(l,c.country,false)!==true)){log('Chưa ký chuyển quốc gia: cần đủ tuổi và đáp ứng điều kiện đi lại hiện tại.','neutral');return false;}
    if(o.kind==='academy'&&l.age<18&&c.country!==H.resCode(l))return false;
    if(o.kind==='pro'){
      var oldSub=l.talentSub,school=l.school,schoolEnd=l.schoolEnd,student=l.cityStudent,oldAbroad=l.abroad,oldJob=l.job;
      l.talentSub='bóng đá';l.school=null;
      if(!athlete(l))E.startJob(l,'vdv',r,function(){},true);
      if(!l.job||E.resolveJob(l.job.id)!=='vdv'){l.talentSub=oldSub;l.school=school;l.schoolEnd=schoolEnd;l.cityStudent=student;l.abroad=oldAbroad;log('Chưa ký: cần bàn giao công việc hoặc nghĩa vụ hiện tại trước.','neutral');return false;}
      l.abroad=oldAbroad;
      if(s.studyBalance&&c.country===H.resCode(l)){l.school=school;l.schoolEnd=schoolEnd;l.cityStudent=student;}
      else if(school){l.flags.footballStudyPaused897={school:school,end:schoolEnd,country:H.resCode(l),at:l.age};l.school=null;l.schoolEnd=null;l.cityStudent=null;log('Bạn dừng chương trình học hiện tại để chuyển sang thi đấu; không tự nhận bằng.','neutral');}
      if(oldJob&&oldJob!==l.job){var prev=(l.jobsHist||[]).slice(0,-1).pop();if(prev&&prev.to==null)prev.to=l.age;}
    }
    if(s.contract)s.contracts.push(Object.assign({},s.contract,{closed:y}));s.club=c.id;s.legacyFallback=false;
    if(o.kind==='academy'){s.stage='youth';s.scholarship=c.scholarship;s.contract=null;}
    else {s.stage='pro';s.contract={club:c.id,start:y,end:y+o.years,annualUSD:o.annualUSD,bonusUSD:o.annualUSD*.001,signingUSD:o.annualUSD*.05,signed:false};l.job.club=c.name;l.job.rank=1;l.retired=false;l.indep=true;l.flags.needJob=false;l.flags.upgradeJob=false;}
    relocate(l, c.country, log); s.offers = [];
    s.coaches = s.coaches || {};
    if (!s.coaches[c.id]) s.coaches[c.id] = { id: l.id + ':football:' + c.id, name: H.stranger(l, E.LIFE138.random(l.id + ':coach:' + c.id), 'M'), trust: 50, style: c.tactics === 'defensive' ? 'Kỷ luật, ưu tiên phòng ngự' : 'Khuyến khích kỹ thuật và phối hợp', history: [] };
    s.coach = s.coaches[c.id];
    s.coach.history.push({ year: y, text: 'Gia nhập ' + c.name });
    H.mem(l, 'Gia nhập ' + c.name + (s.stage === 'youth' ? ' · ' + stageFor(l) : ' với hợp đồng chuyên nghiệp') + '.', 5);
    log('Bạn chọn ' + c.name + '. ' + (s.stage === 'youth' ? 'Tiếp tục học văn hóa song song theo lựa chọn cá nhân.' : 'Hợp đồng chuyên nghiệp đã được ghi nhận là nghề chính. Lương đi qua ngân sách thu nhập hằng năm.'), 'good'); return true;
  }
  function train(l, r, log) {
    syncTalent(l);var s = peek(l), c = club(s.club), age = l.age, peak = s.position === 'GK' ? 32 : 28;
    if (s.injury > 0) { s.injury = Math.max(0, s.injury - Math.ceil(40 + s.recovery / 5)); s.fitness = Math.min(100, s.fitness + 10); if (!s.injury) log('Đã hoàn tất phục hồi, có thể trở lại thi đấu.', 'good'); return; }
    var load = s.training === 'intense' ? 1.8 : s.training === 'rest' ? 0 : 1;
    var gain = age <= peak ? (age < 22 ? 3 : 1.2) * load * (c ? .6 + c.academy / 100 : .65) * (.8 + s.familySupport / 250) : -(1 + (age - peak) * .25);
    D.skills.forEach(function (k) {
      var specific = s.training === k ? 1.8 : 1;
      s.skills[k] = U.clamp(s.skills[k] + gain * specific * (.7 + r() * .6), 1, s.potential);
    });
    s.fitness = U.clamp(s.fitness + (load === 0 ? 25 : load > 1 ? -14 : 8), 0, 100);
    s.stability = U.clamp(s.stability + (s.training === 'balanced' ? 2 : 0), 0, 100);
    if (s.studyBalance && age < 22) { H.fx(l, { kno: 1 }); s.familySupport = Math.min(100, s.familySupport + 1); }
    else if (age < 18) { H.fx(l, { kno: -2, hap: -1 }); s.familySupport = Math.max(0, s.familySupport - 3); }
    var risk = .015 + (load > 1 ? .16 : 0) + Math.max(0, 50 - s.fitness) / 300 + Math.max(0, 60 - l.st.hea) / 400;
    if (load && r() < risk) { s.injury = r() < .2 ? 60 : 8; H.fx(l, { hea: -5 }); log('Chấn thương khi tập luyện: cần phục hồi ' + s.injury + ' tuần, không thi đấu khi chưa bình phục.', 'bad'); }
    if (athlete(l)) l.skill = rating(l);s.bridgeSkill897=l.skill||0;
  }
  function match(l, season, id, opponent, r, international, knockout) {
    var prior = season.matches.find(function (m) { return m.id === id; }); if (prior) return prior;
    var s = peek(l), c = club(s.club), quality = international ? D.markets[s.national.country][4] : c ? c.strength : 30;
    var available = !s.injury && s.fitness > 25 && !(E.CAREER_DEPTH900&&E.CAREER_DEPTH900.sportState(l).injury>=60), ability = rating(l)+(E.CAREER_DEPTH900?E.CAREER_DEPTH900.power(l):0), coach = s.coach.trust;
    var chance = U.clamp(.55 + (ability - quality) / 100 + (coach - 50) / 250, .08, .96);
    var minutes = !available ? 0 : r() < chance ? 60 + Math.floor(r() * 31) : r() < .5 ? 15 + Math.floor(r() * 25) : 0;
    var home = season.matches.length % 2 === 0, tactical = s.style === (c && c.tactics) ? 3 : 0;
    var edge = (quality - opponent + (minutes ? ability * .1 : 0) + tactical + (home ? 3 : 0) + (s.form - 50) * .1) / 40;
    var gf = Math.max(0, Math.floor(r() * 4 + edge)), ga = Math.max(0, Math.floor(r() * 4 - edge));
    var won = gf > ga || knockout && gf === ga && r() < .5;
    var goals = 0, assists = 0;
    for (var i = 0; i < gf && minutes; i++) { if (s.position !== 'GK' && r() < (s.position === 'FW' ? .4 : .15) * minutes / 90) goals++; else if (r() < .25 * minutes / 90) assists++; }
    var card = minutes && r() < (100 - s.skills.discipline) / 400 ? (r() < .1 ? 'đỏ' : 'vàng') : null;
    var m = { id: id, round: id.split(':').pop(), competition: id.startsWith('league:') ? (c ? c.league : 'Giải trẻ') : id.startsWith('national:') ? 'Giao hữu quốc tế' : id.split(':')[0], opponentName: 'Đối thủ mô phỏng (sức mạnh ' + Math.round(opponent) + ')', home: home, opponent: opponent, gf: gf, ga: ga, win: won, minutes: minutes, goals: goals, assists: assists,
      clean: s.position === 'GK' && minutes >= 60 && !ga ? 1 : 0, card: card, substituted: minutes > 0 && minutes < 90,
      absence: minutes ? null : s.injury ? 'Chấn thương' : !available ? 'Quá tải' : 'Không được đăng ký / dự bị',
      rating: minutes ? U.clamp(5 + (won ? 1 : 0) + goals + assists * .5 + r(), 1, 10) : null, international: !!international };
    season.matches.push(m);
    if (minutes) {
      var total = international ? s.national : s.totals;
      if (international) { total.caps++; total.goals += goals; total.assists += assists; }
      else { total.apps++; total.goals += goals; total.assists += assists; total.minutes += minutes; total.clean += m.clean; }
      s.form = U.clamp(s.form + (won ? 2 : -2) + goals, 10, 95);
      s.fitness = Math.max(0, s.fitness - 1);
      if (r() < .008 + Math.max(0, 45 - s.fitness) / 1500) { s.injury = r() < .15 ? 60 : 4; m.injury = s.injury; H.fx(l, { hea: -3 }); }
    }
    return m;
  }
  function tournament(l, z, name, strength, r, group, international) {
    var id = name + ':' + z.year, results = [], points = 0;
    if (group) {
      for (var i = 0; i < 3; i++) { var m = match(l, z, id + ':group' + i, strength + i * 2, r, international, false); results.push(m); points += m.gf > m.ga ? 3 : m.gf === m.ga ? 1 : 0; }
      if (points < 4) { z.competitions.push({ name: name, stage: 'Bị loại vòng bảng', points: points }); return false; }
    }
    for (var round = 0; round < 3; round++) {
      var k = match(l, z, id + ':knockout' + round, strength + round * 3, r, international, true); results.push(k);
      if (!k.win) { z.competitions.push({ name: name, stage: ['Tứ kết', 'Bán kết', 'Chung kết'][round] }); return false; }
    }
    z.competitions.push({ name: name, stage: 'Vô địch' });
    if (results.some(function (m) { return m.minutes > 0; })) {
      peek(l).trophies.push({ year: z.year, club: international ? null : z.club, nation: international ? peek(l).national.country : null, name: name });
      peek(l).reputation = Math.min(100, peek(l).reputation + 4);
    }
    return true;
  }
  function national(l, z, r, log) {
    var s = peek(l), n = s.national, market = D.markets[n.country];
    n.called = false;
    if (!market || s.injury || s.fitness < 35 || n.country !== l.country) { n.reason = 'Chưa đủ điều kiện đại diện hoặc thể lực.'; return; }
    var apps = z.matches.filter(function (m) { return !m.international && m.minutes > 0; }).length;
    var threshold = market[4] - (l.age < 23 ? 12 : 0), chance = U.clamp(.35 + (rating(l) - threshold) / 90 + apps / 150, .02, .88);
    if (apps < 5 || rating(l) < threshold - 6 || r() >= chance) { n.reason = 'Cần ra sân ít nhất 5 trận, cải thiện năng lực vị trí và phong độ; còn cạnh tranh danh sách triệu tập.'; return; }
    n.called = true; n.level = l.age < 17 ? 'U17' : l.age < 20 ? 'U20' : l.age < 23 ? 'U23' : 'ĐTQG';
    n.captain = n.caps > 40 && s.skills.discipline > 75;
    log('Được triệu tập ' + n.level + ' ' + n.country + (n.captain ? ' với vai trò đội trưởng.' : '.'), 'good');
    var conf = D.confeds[market[0]], y = z.year;
    if (l.age < 23) { if ((y - D.calendar.youth.anchor) % 2 === 0) tournament(l, z, 'Giải trẻ ' + n.level + ' · ' + market[0], conf.strength - 10, r, true, true); return; }
    match(l, z, 'national:' + y + ':friendly', conf.strength, r, true, false);
    [{ name: conf.nation, anchor: conf.anchor, cycle: conf.cycle, strength: conf.strength },
      { name: 'FIFA World Cup', anchor: D.calendar.world.anchor, cycle: 4, strength: 86 }].forEach(function (ev) {
      var offset = ((y - ev.anchor) % ev.cycle + ev.cycle) % ev.cycle;
      var key = ev.name + ':' + (y + (offset === ev.cycle - 1 ? 1 : 0));
      if (offset === ev.cycle - 1) {
        var pts = 0;
        for (var i = 0; i < 6; i++) { var m = match(l, z, key + ':qualifier' + i, conf.strength + i, r, true, false); pts += m.gf > m.ga ? 3 : m.gf === m.ga ? 1 : 0; }
        n.qualified[key] = pts >= (ev.name === 'FIFA World Cup' ? 11 : 8);
        z.competitions.push({ name: 'Vòng loại ' + ev.name, stage: n.qualified[key] ? 'Giành vé' : 'Không giành vé', points: pts, confederation: market[0], slots: conf.slots });
      }
      if (!offset && n.qualified[key]) { tournament(l, z, ev.name, ev.strength, r, true, true); s.internationalRep = Math.min(100, s.internationalRep + 5); }
    });
  }
  function season(l, r, log) {
    var s = peek(l), y = year(l), c = club(s.loan ? s.loan.club : s.club);
    if (s.seasons.some(function (z) { return z.year === y; })) return s.seasons.find(function (z) { return z.year === y; });
    var z = { year: y, club: c && c.id, stage: s.stage, matches: [], competitions: [], table: [] };
    s.seasons.push(z);
    if (!c || s.stage === 'local' || s.stage === 'free') return z;
    var youth = s.stage === 'youth', peers = D.clubs.filter(function (x) { return x.country === c.country && x.tier === c.tier; });
    var table = peers.map(function (x) { return { id: x.id, name: x.name, points: 0, gf: 0, ga: 0 }; });
    for (var i = 0; i < peers.length; i++) for (var j = i + 1; j < peers.length; j++) for (var leg = 0; leg < 2; leg++) {
      var a = peers[i], b = peers[j], own = a.id === c.id || b.id === c.id;
      var m = own ? match(l, z, 'league:' + y + ':' + a.id + ':' + b.id + ':' + leg, (a.id === c.id ? b : a).strength - (youth ? 15 : 0), r, false, false) : { gf: Math.floor(r() * 4), ga: Math.floor(r() * 4) };
      if (own) { m.opponentName = (a.id === c.id ? b : a).name;if(E.CAREER_DEPTH900)E.CAREER_DEPTH900.match(l,m.opponentName,m.gf>m.ga?1:5); m.competition = youth ? stageFor(l) + ' · ' + c.league : c.league; }
      var gf = own && b.id === c.id ? m.ga : m.gf, ga = own && b.id === c.id ? m.gf : m.ga;
      table[i].gf += gf; table[i].ga += ga; table[j].gf += ga; table[j].ga += gf;
      table[i].points += gf > ga ? 3 : gf === ga ? 1 : 0; table[j].points += ga > gf ? 3 : gf === ga ? 1 : 0;
    }
    table.sort(function (a, b) { return b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.id.localeCompare(b.id); });
    z.table = table; z.place = table.findIndex(function (x) { return x.id === c.id; }) + 1;
    var leagueName = youth ? stageFor(l) + ' · ' + c.league : c.league;
    z.competitions.push({ name: leagueName, stage: 'Hạng ' + z.place });
    if (z.place === 1 && z.matches.some(function (m) { return m.minutes > 0; })) s.trophies.push({ name: leagueName, year: y, club: c.id });
    if (!youth) {
      tournament(l, z, c.cup, c.strength + 4, r, false, false);
      var previous = s.seasons.find(function (x) { return x.year === y - 1 && x.club === c.id && x.stage === 'pro'; }), conf = D.confeds[c.confed];
      if (c.tier === 1 && previous && previous.place <= 2) {
        var name = previous.place === 2 && conf.second ? conf.second : conf.club;
        tournament(l, z, name, conf.strength + 8, r, true, false);
      }
      var winner = s.trophies.some(function (t) { return t.club === c.id && t.name === conf.club && t.year < y && t.year >= y - 4; });
      if (y >= D.calendar.clubWorld.from && (y - D.calendar.clubWorld.anchor) % 4 === 0 && winner) tournament(l, z, 'FIFA Club World Cup', 90, r, true, false);
    }
    national(l, z, r, log);
    var apps = z.matches.filter(function (m) { return !m.international && m.minutes > 0; }).length;
    if (z.matches.reduce(function (n, m) { return n + m.goals; }, 0) >= 8) s.trophies.push({ year: y, club: c.id, name: 'Khen thưởng ghi bàn xuất sắc (mô phỏng)' });
    s.estimatedValueUSD = Math.round(wage(l, c) * Math.max(.2, (s.contract ? s.contract.end - y : 0)) * (l.age < 25 ? 2 : 1));
    s.role = rating(l) > c.strength + 10 && apps >= 5 ? 'Ngôi sao' : apps >= 4 ? 'Đá chính' : 'Dự bị';
    if (s.role !== 'Dự bị' && s.skills.discipline >= 80 && s.coach.trust >= 70) s.role = 'Đội trưởng';
    s.reputation = U.clamp(s.reputation + apps * .35 + (z.place === 1 ? 3 : 0) - (apps < 3 ? 2 : 0), 0, 100);
    s.coach.trust = U.clamp(s.coach.trust + (s.training === 'intense' ? -3 : 2) + (s.form > 60 ? 2 : -1), 0, 100);
    log('Mùa ' + y + ' · ' + c.name + ': hạng ' + z.place + ', ' + apps + ' lần ra sân; ' + s.role + '.', 'neutral');
    s.seasons = s.seasons.slice(-50); return z;
  }
  function retire(l, log) {
    var s = peek(l); if (!s || s.stage === 'retired') return false;
    if (s.contract) s.contracts.push(Object.assign({}, s.contract, { retired: year(l) }));
    s.stage = 'retired'; s.contract = null; s.loan = null; s.offers = [];
    if (athlete(l)) { l.job = null; l.flags.needJob = true; }
    log('Giải nghệ cầu thủ. Hồ sơ thành tích được giữ; có thể học nghề huấn luyện, tuyển trạch hoặc bình luận.', 'big'); return true;
  }
  function annual(l, r, log) {
    var s = peek(l); if (!s || s.legacyFallback || s.stage === 'retired' || s.processed === year(l) || !active(l)) return;
    s.processed = year(l); s.offers = s.offers.filter(function (o) { return o.expires >= year(l); });
    if (s.loan && year(l) >= s.loan.end) { s.club = s.loan.parent; s.loan = null; relocate(l, club(s.club).country, log); log('Hết thời hạn cho mượn, trở lại câu lạc bộ chủ quản.', 'neutral'); }
    if (s.contract && year(l) >= s.contract.end) { s.contracts.push(s.contract); s.contract = null; s.stage = 'free';if(athlete(l)){l.job=null;l.flags.needJob=true;} log('Hết hợp đồng: trở thành cầu thủ tự do, không còn lương câu lạc bộ.', 'neutral'); }
    if (s.stage === 'youth' && l.age > 21) { s.stage = 'free'; log('Hết tuổi đội trẻ; cần hợp đồng để tiếp tục chuyên nghiệp.', 'neutral'); }
    train(l, r, log); var z = season(l, r, log);
    if (s.stage === 'youth') {
      if (s.supportPaid !== year(l)) {
        s.supportPaid = year(l);
        var trainingClub = club(s.club), stipend = s.scholarship ? Math.min(2400, trainingClub.financeUSD * .005) : 0;
        if (stipend) H.cash(l, usd(l, stipend), 'Hỗ trợ đào tạo bóng đá (không phải lương chuyên nghiệp)');
      }
      if (l.age >= 16 && rating(l) > club(s.club).strength - 18) negotiate(l, s.club, r, log);
    }
    if (s.stage === 'pro') {
      l.job && athlete(l) && (l.job.club = club(s.loan ? s.loan.club : s.club).name);
      if (s.contract.end - year(l) <= 1) negotiate(l, s.club, r, log);
      if (z && s.reputation > 12 && r() < .4) {
        var candidates = D.clubs.filter(function (c) { return c.id !== s.club && c.strength < rating(l) + 10 && c.reputation < s.reputation * 2 + 30 && c.financeUSD >= s.contract.annualUSD * 2; });
        if (candidates.length && s.negotiateAt !== year(l)) negotiate(l, U.pick(r, candidates).id, r, log);
      }
    }
    if (l.age >= (s.position === 'GK' ? 43 : 40) || l.age >= 33 && rating(l) < 28) retire(l, log);
  }
  function income(l, r, log) {
    var s = peek(l); annual(l, r, log);
    if (!s || s.paid === year(l) && s.earnings && s.earnings.year === year(l)) return 0;
    if (s.stage !== 'pro' || !s.contract || s.contract.end <= year(l) || !free(l) || !athlete(l)) return 0;
    s.paid = year(l);
    var c = s.contract, z = s.seasons.find(function (z) { return z.year === year(l); });
    var apps = z ? z.matches.filter(function (m) { return !m.international && m.minutes > 0; }).length : 0;
    var signing = c.signed ? 0 : c.signingUSD; c.signed = true;
    var gross = c.annualUSD + c.bonusUSD * apps + signing, sponsor = s.internationalRep >= 20 ? c.annualUSD * Math.min(.5, s.reputation / 200) : 0;
    var costs = (gross + sponsor) * .15;
    s.earnings = { year: year(l), salaryUSD: c.annualUSD, bonusUSD: c.bonusUSD * apps, signingUSD: signing, sponsorUSD: sponsor, taxAgentUSD: costs, netUSD: gross + sponsor - costs };
    l.yr = l.yr || { items: [] }; l.yr.gross = usd(l, gross + sponsor); l.yr.si = 0;
    log('Bóng đá: lương ' + H.money(l, usd(l, c.annualUSD)) + '/năm; thưởng và phí ký ' + H.money(l, usd(l, c.bonusUSD * apps + signing)) + '. Khấu trừ thuế/đại diện mô phỏng 15%, sinh hoạt tính riêng.', 'money');
    l.job.yrs = (l.job.yrs || 0) + 1; l.workYrs = (l.workYrs || 0) + 1;
    return usd(l, s.earnings.netUSD);
  }
  function loan(l, r, log) {
    var s = peek(l); if (!active(l) || !s.contract || s.loan || s.role !== 'Dự bị' || s.contract.end <= year(l) + 1) return false;
    var c = club(s.club), dest = D.clubs.find(function (x) { return x.country === c.country && x.tier > c.tier; });
    if (!dest) return false;
    s.loan = { parent: s.club, club: dest.id, end: year(l) + 1 }; log('Đồng ý cho mượn một mùa tới ' + dest.name + ' để cạnh tranh thời gian ra sân. Lương theo hợp đồng chủ quản, không cộng hai lần.', 'neutral'); return true;
  }
  function summary(l) {
    var s = peek(l); if (!s) return 'Có thể bắt đầu bóng đá từ 10 tuổi, luyện tập tại địa phương rồi tự chọn nơi thử tuyển. Học viện không bảo đảm một suất chuyên nghiệp.';
    var c = club(s.loan ? s.loan.club : s.club), z = s.seasons[s.seasons.length - 1];
    return D.positions[s.position] + ' · ' + (s.stage === 'youth' ? stageFor(l) : ({local:'Bóng đá địa phương',pro:'Cầu thủ chuyên nghiệp',free:'Cầu thủ tự do',retired:'Đã giải nghệ'})[s.stage]||s.stage) + ' · ' + (c ? c.name + ' (' + c.country + ')' : 'Chưa có đội') +
      '\nNăng lực vị trí ' + Math.round(rating(l)) + ' · tiềm năng ' + Math.round(s.potential) + ' · phong độ ' + Math.round(s.form) + ' · thể lực ' + Math.round(s.fitness) + ' · hồi phục ' + s.recovery + ' · ổn định ' + s.stability +
      '\n' + D.skills.map(function (k, i) { return D.skillNames[i] + ' ' + Math.round(s.skills[k]); }).join(' · ') +
      '\n' + (s.injury ? 'Chấn thương còn ' + s.injury + ' tuần.' : 'Sẵn sàng thi đấu.') + ' Vai trò: ' + (s.role || 'Chưa được xếp đội') +
      '\n' + (s.contract ? 'Hợp đồng đến ' + s.contract.end + ': ' + H.money(l, usd(l, s.contract.annualUSD) / 12) + '/tháng; phí ký 5%, thưởng mỗi lần ra sân 0,1% lương năm.' : 'Chưa có hợp đồng chuyên nghiệp; không nhận lương nghề cầu thủ.') +
      '\nSự nghiệp CLB: ' + s.totals.apps + ' trận · ' + s.totals.goals + ' bàn · ' + s.totals.assists + ' kiến tạo · ' + s.totals.clean + ' sạch lưới. ĐT: ' + s.national.caps + ' trận / ' + s.national.goals + ' bàn. Giá trị chuyển nhượng ước tính ' + H.money(l, usd(l, s.estimatedValueUSD || 0)) + '.' +
      '\nTriệu tập: ' + (s.national.called ? s.national.level : s.national.reason || 'Cần thi đấu và chứng minh năng lực.') +
      '\nHLV ' + s.coach.name + ' · ' + s.coach.style + ' · tín nhiệm ' + Math.round(s.coach.trust) + '. Hỗ trợ gia đình ' + s.familySupport + '/100.' +
      '\n' + (z ? 'Mùa gần nhất: ' + z.competitions.map(function (e) { return e.name + ': ' + e.stage; }).join('; ') : 'Chưa có mùa giải.') +
      '\nDanh hiệu: ' + (s.trophies.map(function (t) { return t.year + ' ' + t.name; }).join('; ') || 'Chưa có') + '\n' + D.model;
  }
  X.menu('footballCareer', 'Sự nghiệp bóng đá chuyên nghiệp', function (l) { return free(l) ? true : 'Cần đủ 10 tuổi và tự do đi lại'; }, summary, function (l) {
    var s = peek(l);
    if (!s) return [{ k: 'start', l: 'Bắt đầu bóng đá địa phương (giữ việc và việc học hiện có)', run: function (l, r, log) { init(l, r); log('Bắt đầu luyện bóng đá tại địa phương. Mở hồ sơ để chọn vị trí và nơi thử tuyển.', 'good'); } }];
    return [{ k: 'training', l: 'Chọn vị trí, luyện tập, học văn hóa & phục hồi', run: function (l, r) { X.next(l, 'footballTraining', r); } },
      { k: 'trials', l: 'Tự chọn câu lạc bộ thử tuyển / đàm phán', why: s.stage !== 'retired', run: function (l, r) { X.next(l, 'footballMarkets', r); } },
      { k: 'offers', l: 'Xem và chọn lời mời (' + s.offers.length + ')', run: function (l, r) { X.next(l, 'footballOffers', r); } },
      { k: 'results', l: 'Lịch đấu, bảng xếp hạng & kết quả từng trận', run: function (l, r) { X.next(l, 'footballResults', r); } },
      { k: 'loan', l: 'Xin cho mượn một mùa để có cơ hội ra sân', why: s.stage === 'pro' && s.role === 'Dự bị', run: loan },
      { k: 'coach', l: 'Trao đổi với huấn luyện viên về vai trò', why: s.coach.talkAt !== year(l), run: function (l, r, log) { s.coach.talkAt = year(l); s.coach.trust = U.clamp(s.coach.trust + (s.skills.discipline > 50 ? 5 : -5), 0, 100); s.coach.history.push({ year: year(l), text: 'Trao đổi vai trò: ' + s.role }); log('Huấn luyện viên yêu cầu duy trì kỷ luật, thể lực và phong độ; suất đá chính tiếp tục dựa trên cạnh tranh.', 'neutral'); } },
      { k: 'retire', l: 'Giải nghệ cầu thủ', why: s.stage !== 'retired', run: function (l, r, log) { retire(l, log); } },
      { k: 'coachJob', l: 'Chuyển sang nghề huấn luyện thể thao', why: s.stage === 'retired' && !l.job && s.totals.apps >= 20 && l.edu >= 3, run: function (l, r, log) { E.startJob(l, 'hlv_tt', r, log); } },
      { k: 'scout', l: 'Chuyển sang nghề tuyển trạch bóng đá', why: s.stage === 'retired' && !l.job && s.totals.apps >= 20 && l.st.kno >= 45, run: function (l, r, log) { E.startJob(l, 'football_scout', r, log); } },
      { k: 'caster', l: 'Chuyển sang nghề bình luận bóng đá', why: s.stage === 'retired' && !l.job && s.reputation >= 20 && l.st.soc >= 50, run: function (l, r, log) { E.startJob(l, 'football_caster', r, log); } }];
  }, 10, 'Học tập & sự nghiệp');
  X.menu('footballTraining', 'Chương trình bóng đá', function (l) { return active(l) ? true : 'Cần đang theo đuổi bóng đá'; }, summary, function (l) {
    var s = peek(l), rows = Object.keys(D.positions).map(function (p) { return { k: p, l: 'Vị trí: ' + D.positions[p], run: function () { s.position = p; } }; });
    ['balanced', 'intense', 'rest'].concat(D.skills).forEach(function (t, i) { rows.push({ k: t, l: 'Luyện tập: ' + (i < 3 ? ['Cân bằng', 'Cường độ cao (tăng nguy cơ chấn thương)', 'Nghỉ ngơi / phục hồi'][i] : D.skillNames[i - 3]), run: function () { s.training = t; } }); });
    rows.push({ k: 'study', l: s.studyBalance ? 'Dồn thời gian cho bóng đá, giảm học văn hóa' : 'Cân bằng học văn hóa và bóng đá', run: function () { s.studyBalance = !s.studyBalance; } });
    ['possession', 'counter', 'defensive'].forEach(function (t, i) { rows.push({ k: t, l: 'Lối chơi: ' + ['Kiểm soát', 'Phản công', 'Phòng ngự'][i], run: function () { s.style = t; } }); }); return rows;
  }, 10);
  X.menu('footballMarkets', 'Chọn quốc gia bóng đá', function (l) { return active(l) ? true : 'Cần đang theo đuổi bóng đá'; }, D.model, function (l) {
    return Object.keys(D.markets).filter(function (code) { return l.age >= 18 || code === H.resCode(l); }).map(function (code) {
      return { k: code, l: (G.W.BY[code] || { name: code }).name + ' · ' + D.markets[code][1], run: function (l, r) { X.next(l, 'footballClubs', r, { country: code }); } };
    });
  }, 10);
  X.menu('footballClubs','Thử tuyển và đàm phán bóng đá',function(l){return active(l)?true:'Cần đang theo đuổi bóng đá';},'Chọn CLB để xem điều kiện thử tuyển học viện hoặc đàm phán chuyên nghiệp. Từ 16 tuổi có thể xem cả hai hướng; học viện chưa phải nghề có lương. Mỗi CLB thử một lần/năm; tối đa ba CLB đàm phán, gia hạn đội hiện tại được xét riêng.',function(l,arg){
    var country=arg.country||H.resCode(l);if(l.age<18&&country!==H.resCode(l))return [];
    return D.clubs.filter(function(c){return c.country===country;}).map(function(c){return {k:c.id,l:c.name+' · '+c.league,h:'Năng lực vị trí '+Math.round(rating(l))+' / sức cạnh tranh CLB '+c.strength+' · học viện '+c.minAge+'–'+c.maxAge+' tuổi. '+(negotiationWhy(l,c)===true?'Có thể trao đổi hợp đồng.':negotiationWhy(l,c)),run:function(l,r){X.next(l,'footballApproach897',r,{club:c.id});}};});
  },10);
  X.menu('footballApproach897','Làm việc với câu lạc bộ',function(l){return active(l)?true:'Cần đang theo đuổi bóng đá';},function(l,d){var c=club(d.arg.club);return c?c.name+' · năng lực vị trí '+Math.round(rating(l))+' · thể lực '+Math.round(peek(l).fitness)+'. Thử học viện không phải ký nghề chuyên nghiệp. '+D.model:'CLB không còn phù hợp.';},function(l,arg){var c=club(arg.club),s=peek(l);if(!c)return [];
    function result(l,r,log,data,kind){var messages=[],before=s.negotiations897&&s.negotiations897[c.id],paid=s.trials[c.id],answer=kind==='trial'?trial(l,c.id,r,function(t,k){messages.push(t);log(t,k);}):negotiate(l,c.id,r,function(t,k){messages.push(t);log(t,k);});data.actionCommitted897=kind==='trial'?s.trials[c.id]!==paid:s.negotiations897&&s.negotiations897[c.id]!==before;X.next(l,'footballOutcome897',r,{club:c.id,message:messages.join('\n')||'Chưa thực hiện: hoàn cảnh hoặc điều kiện CLB đã thay đổi; chưa trừ tiền.',result:answer});}
    return [{k:'trial',l:'Đăng ký thử tuyển học viện / đội trẻ',h:'Chi phí '+H.money(l,trialCost(l,c))+' · tuổi '+c.minAge+'–'+c.maxAge+'; cần chưa có hợp đồng chuyên nghiệp, đủ tiền và đúng quốc gia khi chưa 18 tuổi.',run:function(l,r,log){result(l,r,log,l.pending897Data||{},'trial');}},{k:'negotiate',l:'Đàm phán hợp đồng chuyên nghiệp',h:negotiationWhy(l,c)===true?'Phù hợp bước đánh giá · khả năng nhận đề nghị mô phỏng '+Math.round(negotiationChance(l,c)*100)+'%; vẫn có thể bị từ chối.':negotiationWhy(l,c),run:function(l,r,log){result(l,r,log,l.pending897Data||{},'pro');}}];
  },10);
  // UPDATE110 runs a selected row with its original argument. Pass the live
  // decision marker explicitly so a completed attempt costs a turn, previews don't.
  var approachApply=E.DEC.footballApproach897.apply;E.DEC.footballApproach897.apply=function(l,d){l.pending897Data=d.data;try{return approachApply.apply(this,arguments);}finally{delete l.pending897Data;}};
  E.SC('footballOutcome897',{title:'Kết quả làm việc với CLB',prep:function(l,r,a){return a||{};},text:function(l,d){return d.message+'\nLời mời còn hiệu lực: '+peek(l).offers.filter(function(o){return o.expires>=year(l);}).length+'. Bạn cần mở hợp đồng và xác nhận mới gia nhập.';},valid:function(l){return !!peek(l);},opts:[{k:'offers',l:'Xem các lời mời và hợp đồng',run:function(l,r){follow(l,'footballOffers',r);}},{k:'clubs',l:'Tiếp tục xem CLB',run:function(l,r,log,d){follow(l,'footballClubs',r,{country:(club(d.club)||{}).country||H.resCode(l)});}},{k:'profile',l:'Về hồ sơ bóng đá',run:function(l,r){follow(l,'footballCareer',r);}},{k:'cancel',l:'Đóng kết quả',run:function(){}}]});
  X.menu('footballOffers','Lời mời bóng đá',function(l){return active(l)?true:'Cần đang theo đuổi bóng đá';},function(l){return peek(l).offers.some(function(o){return o.expires>=year(l);})?'Chọn lời mời để xem hợp đồng, ảnh hưởng tới công việc và học tập trước khi ký.':'Hiện chưa có lời mời còn hiệu lực. Có thể xem điều kiện và liên hệ CLB phù hợp.';},function(l){return peek(l).offers.filter(function(o){return o.expires>=year(l);}).map(function(o){var c=club(o.club);return {k:o.id,l:c.name+' · '+(o.kind==='academy'?'Đội trẻ / học viện, chưa có lương nghề':H.money(l,usd(l,o.annualUSD)/12)+'/tháng · '+o.years+' năm'),run:function(l,r){X.next(l,'footballSign897',r,{offer:o.id});}};});},10);
  E.SC('footballSign897',{title:'Xem và ký lời mời bóng đá',prep:function(l,r,a){return a||{};},valid:function(l,d){return active(l)&&(!d||!d.offer||peek(l).offers.some(function(o){return o.id===d.offer&&o.expires>=year(l);}));},text:function(l,d){var o=peek(l).offers.find(function(o){return o.id===d.offer;});if(!o)return 'Lời mời đã hết hạn.';return club(o.club).name+' · '+(o.kind==='academy'?'Đào tạo đội trẻ, chưa phải nghề chuyên nghiệp.':'Hợp đồng chuyên nghiệp '+o.years+' năm · lương '+H.money(l,usd(l,o.annualUSD)/12)+'/tháng. Phí ký trả qua thu nhập một lần, phí chuyển nhượng không thuộc cá nhân.')+(l.job&&!athlete(l)?' Nếu ký, bạn xác nhận bàn giao nghề '+E.jobTitle(l)+' để theo bóng đá.':'')+(l.school?' Cần thu xếp việc học; chuyển quốc gia có thể dừng chương trình đang theo, không tự nhận bằng.':'');},opts:[{k:'sign',l:'Đồng ý các điều kiện và ký',run:function(l,r,log,d){var lines=[],ok=accept(l,d.offer,r,function(t,k){lines.push(t);log(t,k);},{switchJob:true});d.actionCommitted897=ok;X.next(l,'footballOutcome897',r,{club:peek(l).club,message:lines.join('\n')||(ok?'Đã ký hợp đồng.':'Chưa ký: lời mời, tuổi, công việc hoặc nghĩa vụ hiện tại không đủ điều kiện; chưa thay đổi đội.')});}},{k:'cancel',l:'Chưa ký, giữ công việc hiện tại',run:function(l,r){follow(l,'footballOffers',r);}}]});
  var originalResolve897=E.resolve;E.resolve=function(l){var out=originalResolve897.apply(this,arguments);syncTalent(l);if(employed(l))syncOccupation(l,H.rf(l));return out;};
  var jobValid897=E.DEC.job.valid;E.DEC.job.valid=function(l,d){return (!employed(l)||d&&(d.requested||d.actionId850))&&(!jobValid897||jobValid897(l,d));};

  X.menu('footballResults', 'Mùa giải bóng đá', function (l) { return !!peek(l) ? true : 'Chưa có hồ sơ'; }, function (l) {
    var s = peek(l), z = s.seasons[s.seasons.length - 1]; if (!z) return 'Chưa có mùa giải.';
    return 'Mùa ' + z.year + '\n' + z.table.map(function (t, i) { return (i + 1) + '. ' + t.name + ' · ' + t.points + ' điểm · ' + t.gf + ':' + t.ga; }).join('\n') + '\n' +
      z.matches.map(function (m, i) { return 'Trận ' + (i + 1) + ' · ' + m.competition + ' · gặp ' + m.opponentName + ': ' + m.gf + '–' + m.ga + ' · ' + m.minutes + ' phút · ' + m.goals + ' bàn / ' + m.assists + ' kiến tạo' + (m.card ? ' · thẻ ' + m.card : '') + (m.absence ? ' · ' + m.absence : '') + (m.rating ? ' · điểm ' + m.rating.toFixed(1) : ''); }).join('\n');
  }, function () { return []; }, 10);
  ['football_scout', 'football_caster'].forEach(function (id, i) { E.CAR[id] = { id: id, t: [i ? 'bình luận viên bóng đá' : 'tuyển trạch viên bóng đá', i ? 'bình luận viên bóng đá nổi tiếng' : 'trưởng bộ phận tuyển trạch'], vn: [12, 28], yrs: [5], cat: 'sport', sec: 'formal', edu: 3, hidden: 1, sigma: .1, loss: .02 }; });
  var career = E.careerYear;
  var startJob = E.startJob; E.startJob = function (l, id, r) { var out = startJob.apply(this, arguments); if (athlete(l) && !peek(l)) init(l, r); return out; };
  E.careerYear = function (l, r, log) {
    syncOccupation(l,r);if (athlete(l)) { var s = init(l, r); if (!s.legacyFallback) return income(l, r, log); }
    return career.apply(this, arguments);
  };
  E.HOOKS.year.push(function (l, r, log) {
    var s = peek(l); if (!s) return;
    syncOccupation(l,r);if (s.stage === 'pro' && !athlete(l)) { if (s.contract) s.contracts.push(Object.assign({}, s.contract, { closed: year(l), reason: 'Đổi nghề' })); s.contract = null; s.stage = 'free'; s.loan = null; }
    annual(l, r, log);
  });
  // Old random trophies, international moves and athlete injuries must not bypass this simulation.
  ['tt_tran_lon', 'tt_xuat_ngoai', 'chan_thuong', 'ky_som', 'ky_som_hen'].forEach(function (id) {
    var dec = E.DEC[id]; if (!dec) return; var valid = dec.valid;
    dec.valid = function (l, d) { return !athlete(l) && !(peek(l) && peek(l).stage !== 'retired') && valid.apply(this, arguments); };
  });
  E.HOOKS.year = E.HOOKS.year.map(function (fn) { if (fn !== E.sports.sportYear) return fn; return function (l) { if (!athlete(l) || peek(l) && peek(l).legacyFallback) return fn.apply(this, arguments); }; });
  var title = E.jobTitle; E.jobTitle = function (l) { var s = peek(l); return athlete(l) && s && !s.legacyFallback ? 'Cầu thủ bóng đá · ' + (club(s.loan ? s.loan.club : s.club) || { name: 'Tự do' }).name + ' · ' + (s.role || s.stage) : title.apply(this, arguments); };
  var sportTitle = E.sportTitle; E.sportTitle = function (l) { return athlete(l) && peek(l) && !peek(l).legacyFallback ? E.jobTitle(l) : sportTitle.apply(this, arguments); };
  var monthly = E.monthlyEst; E.monthlyEst = function (l, id) { var s = peek(l); return E.resolveJob(id) === 'vdv' && l.talentSub === 'bóng đá' && s && !s.legacyFallback ? s.contract ? usd(l, s.contract.annualUSD) / 12 : 0 : monthly.apply(this, arguments); };
  var incomeParts = E.incomeParts; E.incomeParts = function (l) {
    var rows = incomeParts.apply(this, arguments), s = peek(l);
    if (s && s.earnings && s.earnings.year === year(l) && l.yr && l.yr.gross > 0) rows.push({ k: 'Thuế / phí đại diện bóng đá (15%)', v: -usd(l, s.earnings.taxAgentUSD) });
    return rows;
  };
  var profile = E.profile; E.profile = function (l) {
    var p = profile.apply(this, arguments), s = peek(l);
    if (s) { p.jobInfo.push(summary(l)); p.income = E.incomeParts(l); }
    if (employed(l)) {
      var gross = usd(l, s.contract.annualUSD) / 12;
      p.salary = { gross: gross, net: gross * .85, netLabel: 'Sau thuế / phí đại diện (15%)' };
      if (s.earnings && s.earnings.year === year(l)) p.jobInfo.push('Quyết toán bóng đá năm ' + year(l) + ': ' + H.money(l, usd(l, s.earnings.netUSD)) + ' sau thuế/phí, gồm lương và thưởng; sinh hoạt tính riêng.');
    }
    return p;
  };
  // State KPI depends on knowledge/reputation which can change after year hooks.
  // Finalise the derived profile before saving, so reload does not recompute a different KPI.
  var endYear = E.endYear; E.endYear = function (l) { var out = endYear.apply(this, arguments); if (E.STATE174 && l.flags && l.flags.state174) E.STATE174.syncState(l); return out; };
  var migrate = E.migrateExt; E.migrateExt = function (l) { if (migrate) migrate.apply(this, arguments); if (athlete(l) && !peek(l)) init(l, null, true);if(peek(l)){syncTalent(l);syncOccupation(l,H.rf(l));} };
  E.SC('footballDiscovery', { title: 'Cơ hội bóng đá ở địa phương', valid: function (l) { return free(l) && l.age <= 12 && !peek(l); },
    text: 'Sau buổi chơi bóng, người phụ trách câu lạc bộ thiếu niên gợi ý bạn tập luyện nghiêm túc hơn. Gia đình cần cân nhắc học tập và chi phí; đây mới là bước đầu, chưa phải lời hứa trở thành cầu thủ.',
    opts: [{ k: 'start', l: 'Tập ở địa phương và tiếp tục học văn hóa', run: function (l, r, log) { init(l, r); log('Bắt đầu lộ trình bóng đá thiếu niên. Bạn có thể chọn vị trí và tự đăng ký học viện.', 'good'); } },
      { k: 'wait', l: 'Tiếp tục chơi cho vui, cân nhắc sau', run: function (l, r, log) { log('Bạn giữ bóng đá làm sở thích. Có thể chủ động bắt đầu trong mục sự nghiệp khi muốn.', 'neutral'); } }] });
  E.TRIG.push({ id: 'footballDiscovery', when: function (l) { return free(l) && l.age <= 12 && !peek(l) && l.talentSub === 'bóng đá' && l.st.hea >= 45; }, p: .14, cd: 3, max: 1, child: true });
  // Thành tựu đọc thống kê và lịch sử thi đấu, không cấp theo quốc tịch hay lời mời.
  function eligibleAchievement(l) { var s = peek(l); return s && !s.legacyFallback ? s : null; }
  function totalAchievement(key, value) { return function (l) { var s = eligibleAchievement(l); return !!s && Number((s.totals || {})[key]) >= value; }; }
  var footballAch = [
    ['football_first_app', '⚽', 'Tiếng còi đầu tiên', 'Có trận ra sân đầu tiên ở câu lạc bộ.', totalAchievement('apps', 1)],
    ['football_50_apps', '👟', 'Đôi giày bền bỉ', 'Ra sân 50 trận cho câu lạc bộ.', totalAchievement('apps', 50)],
    ['football_100_apps', '🏟️', 'Trăm trận sân cỏ', 'Ra sân 100 trận cho câu lạc bộ.', totalAchievement('apps', 100)],
    ['football_300_apps', '🏟️', 'Dấu chân qua năm tháng', 'Ra sân 300 trận cho câu lạc bộ.', totalAchievement('apps', 300)],
    ['football_first_goal', '🥅', 'Lần đầu tung lưới', 'Ghi bàn đầu tiên cho câu lạc bộ.', totalAchievement('goals', 1)],
    ['football_50_goals', '🔥', 'Năm mươi lần ăn mừng', 'Ghi 50 bàn cho câu lạc bộ.', totalAchievement('goals', 50)],
    ['football_100_goals', '🔥', 'Trăm bàn để nhớ', 'Ghi 100 bàn cho câu lạc bộ.', totalAchievement('goals', 100)],
    ['football_first_assist', '🤝', 'Đường chuyền mở lối', 'Có kiến tạo đầu tiên cho câu lạc bộ.', totalAchievement('assists', 1)],
    ['football_50_assists', '🎯', 'Người kiến thiết', 'Có 50 kiến tạo cho câu lạc bộ.', totalAchievement('assists', 50)],
    ['football_100_assists', '🎯', 'Nhạc trưởng sân cỏ', 'Có 100 kiến tạo cho câu lạc bộ.', totalAchievement('assists', 100)],
    ['football_25_clean', '🧤', 'Phía sau là bình yên', 'Có 25 trận sạch lưới khi thi đấu cho câu lạc bộ.', totalAchievement('clean', 25)],
    ['football_100_clean', '🛡️', 'Bức tường trăm trận', 'Có 100 trận sạch lưới khi thi đấu cho câu lạc bộ.', totalAchievement('clean', 100)],
    ['football_9000_minutes', '⏱️', 'Chín nghìn phút nỗ lực', 'Tích lũy 9.000 phút thi đấu câu lạc bộ.', totalAchievement('minutes', 9000)]
  ];
  [['caps', 1, 'Lần đầu khoác áo tuyển'], ['caps', 25, 'Hai mươi lăm lần phụng sự'], ['caps', 100, 'Trăm trận vì màu cờ'], ['goals', 1, 'Bàn thắng cho đội tuyển'], ['goals', 25, 'Niềm vui của cả đội'], ['assists', 25, 'Đồng đội trên tuyển']].forEach(function (a) {
    footballAch.push(['football_national_' + a[0] + '_' + a[1], '🏳️', a[2], 'Đạt ' + a[1] + ' ' + ({ caps: 'lần ra sân', goals: 'bàn thắng', assists: 'kiến tạo' })[a[0]] + ' cho đội tuyển trong mô phỏng.', function (l) { var s = eligibleAchievement(l); return !!s && Number((s.national || {})[a[0]]) >= a[1]; }]);
  });
  Object.keys(D.markets).forEach(function (cc) {
    footballAch.push(['football_market_' + cc, '🌍', 'Dấu giày · ' + G.W.BY[cc].name, 'Thi đấu ít nhất 10 trận có phút ra sân tại các câu lạc bộ thuộc ' + G.W.BY[cc].name + '. Chỉ nhận hợp đồng hoặc chuyển nơi ở chưa đủ.', function (l) {
      var s = eligibleAchievement(l); return !!s && (s.seasons || []).reduce(function (n, z) { var c = club(z.club); return n + (c && c.country === cc ? (z.matches || []).filter(function (m) { return !m.international && m.minutes > 0; }).length : 0); }, 0) >= 10;
    }]);
  });
  [['FIFA World Cup', 'Cúp vàng thế giới'], ['FIFA Club World Cup', 'Đỉnh cao câu lạc bộ thế giới']].forEach(function (a) {
    footballAch.push(['football_cup_' + a[0].replace(/ /g, '_'), '🏆', a[1], 'Có danh hiệu ' + a[0] + ' được ghi nhận sau khi thực sự ra sân trong giải mô phỏng.', function (l) { var s = eligibleAchievement(l); return !!s && (s.trophies || []).some(function (t) { return t.name === a[0] && (s.seasons || []).some(function (z) { return z.year === t.year && (z.matches || []).some(function (m) { return m.minutes > 0 && m.competition === a[0] && !!m.international === !!t.nation; }); }); }); }]);
  });
  footballAch.push(['football_hat_trick', '🎩', 'Ba bàn một trận', 'Ghi ít nhất 3 bàn trong một trận có phút ra sân.', function (l) { var s = eligibleAchievement(l); return !!s && (s.seasons || []).some(function (z) { return (z.matches || []).some(function (m) { return m.minutes > 0 && m.goals >= 3; }); }); }]);
  footballAch.push(['football_three_countries', '🧳', 'Hành trình ba nền bóng đá', 'Có phút ra sân ở câu lạc bộ thuộc 3 quốc gia khác nhau.', function (l) { var s = eligibleAchievement(l); if (!s) return false; var codes = {}; (s.seasons || []).forEach(function (z) { var c = club(z.club); if (c && (z.matches || []).some(function (m) { return !m.international && m.minutes > 0; })) codes[c.country] = true; }); return Object.keys(codes).length >= 3; }]);
  footballAch.push(['football_second_career', '🎙️', 'Sau tiếng còi cuối', 'Giải nghệ sau ít nhất 20 trận, rồi làm huấn luyện, tuyển trạch hoặc bình luận bóng đá.', function (l) { var s = eligibleAchievement(l); return !!s && s.stage === 'retired' && (s.totals || {}).apps >= 20 && !!l.job && ['football_scout', 'football_caster', 'hlv_tt'].indexOf(l.job.id) >= 0; }]);
  E.addAchievements(footballAch);
  E.FOOTBALL = { init: init, peek: peek, club: club, rating: rating, trial: trial, trialOptions: trialOptions, trialCost: trialCost, negotiate: negotiate,
    employed:employed,syncOccupation:syncOccupation,syncTalent:syncTalent,negotiationWhy:negotiationWhy,negotiationChance:negotiationChance,accept: accept, annual: annual, season: season, match: match, national: national, income: income, wage: wage, usd: usd, loan: loan, retire: retire, summary: summary, relocate: relocate };
})(globalThis.G);
