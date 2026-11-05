/* Life context: extend existing childhood choices and family biographies. */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, X = E.UPDATE110, L = E.LIFE138;
  var ART = /ca sĩ|diễn viên|nhạc sĩ|vũ công|đạo diễn|sản xuất âm nhạc|biên kịch|họa sĩ|nhiếp ảnh|thanh nhạc|giáo viên múa|nghệ nhân|nghệ sĩ|truyền hình/;
  function resources(l) {
    var f = l.fam || {}, base = Math.max(1, l.base), household = ((f.fAlive && !f.noDad ? f.fInc || 0 : 0) + (f.mAlive ? f.mInc || 0 : 0)) * 12;
    var ratio = l.age < 18 && !l.indep ? household / base : Math.max(0, l.money || 0) / base;
    return { household: household, ratio: ratio, band: ratio < .6 ? 0 : ratio < 1.5 ? 1 : ratio < 4 ? 2 : ratio < 15 ? 3 : 4 };
  }
  function art(l) { var f = l.fam || {}; return ['f', 'm'].filter(function (side) { return f[side + 'Alive'] && !(side === 'f' && f.noDad) && ART.test(f[side + 'Job'] || ''); }); }
  var infant = E.DEC.thoi_noi, d = infant.def;
  d.text = function (l) {
    var b = resources(l).band;
    var rc = H.resCode ? H.resCode(l) : (l.abroad && l.abroad.code) || l.country || 'VN';
    var isOrph = l.fam && l.fam.orphan && l.fam.orphan.adopted == null;
    if (isOrph) {
      var kind = l.fam.orphan.kind;
      if (kind === 'mai_am') {
        return 'Sinh nhật đầu tiên ở mái ấm. Các cô bảo mẫu chuẩn bị vài món đồ chơi an toàn có sẵn trong phòng sinh hoạt để mừng bé tròn một tuổi. Chỉ dùng đồ chơi lớn phù hợp trẻ một tuổi, có người lớn giám sát. Đồ vật gợi sở thích, không quyết định nghề nghiệp.';
      }
      if (kind === 'chua') {
        return 'Sinh nhật đầu tiên tại nhà chùa. Sư cô và các phật tử chuẩn bị vài món đồ chơi mộc mạc mừng bé tròn một tuổi. Chỉ dùng đồ chơi lớn phù hợp trẻ một tuổi, có người lớn giám sát. Đồ vật gợi sở thích, không quyết định nghề nghiệp.';
      }
      return 'Sinh nhật đầu tiên. Người nuôi dưỡng chuẩn bị vài món đồ chơi sẵn có để mừng bé tròn một tuổi. Chỉ dùng đồ chơi lớn phù hợp trẻ một tuổi, có người lớn giám sát. Đồ vật gợi sở thích, không quyết định nghề nghiệp.';
    }
    return ((H.inVN(l) || H.hasVNOrigin(l)) ? 'Sinh nhật đầu tiên, gia đình cân nhắc lễ thôi nôi.' : rc === 'KR' ? 'Sinh nhật đầu tiên, gia đình cân nhắc lễ Doljanchi (돌잔치) và nghi thức Doljabi.' : rc === 'JP' ? 'Sinh nhật 1 tuổi, gia đình cân nhắc nghi thức Erabitori chọn thẻ/đồ vật tượng trưng.' : (rc === 'CN' || rc === 'TW') ? 'Sinh nhật đầu tiên, gia đình cân nhắc lễ Chu tuế (抓周) tròn 1 tuổi.' : 'Sinh nhật đầu tiên, gia đình chọn cách kỷ niệm.') +
      [' Ngân sách rất eo hẹp: có thể dùng vài đồ chơi sẵn có, nhờ người thân cho mượn hoặc chỉ quây quần bên bé.', ' Gia đình chuẩn bị mâm nhỏ với đồ chơi sẵn có hoặc đồ mượn, vẫn có niềm vui bên nhau.', ' Gia đình có thể chuẩn bị mâm đồ chơi vừa phải tại nhà.', ' Gia đình có điều kiện chuẩn bị nhiều đồ chơi và mời người thân dự tiệc.', ' Gia đình có thể tổ chức tiệc lớn, thuê người chuẩn bị và lưu kỷ niệm.'][b] +
      ' Chỉ dùng đồ chơi lớn phù hợp trẻ một tuổi, có người lớn giám sát. Đồ vật gợi sở thích, không quyết định nghề nghiệp.';
  };
  var need={but:0,bong:0,sach:0,tien:1,son:1,gach:1,cay:1,mic:2,ong:2,nhac:2,kinh:2,may:3,brush846:0,camera846:3,chef846:0,computer846:3,globe846:1,gavel846:0,plane846:2,ball846:1,racket846:1,dance846:1,mask846:0,news846:0,train846:2,animal846:0,badge846:1,fashion846:1};
  var safe = { but: '✏️ Bút đồ chơi lớn, đầu tròn', tien: '💰 Tấm hình tờ tiền khổ lớn', bong: '⚽ Bóng vải mềm', mic: '🎤 Micro đồ chơi không pin rời', may: '🎮 Bảng nút bấm đồ chơi liền khối', ong: '🩺 Ống nghe đồ chơi liền khối', son: '🪮 Lược đồ chơi lớn, đầu tròn', cay: '🌱 Cây vải đồ chơi', kinh: '🔎 Kính lúp đồ chơi liền khối' };
  d.opts.forEach(function (o) {
    var req = o.req;
    o.req = function (l, data) { return (!req||req(l,data))&&resources(l).band>=(need[o.k]||0); };
    if (safe[o.k]) o.l = safe[o.k];
    if (o.k === 'son') o.run = function (l, r, log) { H.fx(l, { hap: 2 }); H.mem(l, 'Ngày sinh nhật đầu tiên, bạn cầm chiếc lược đồ chơi, cả nhà vui cười.', 2); log('Bạn cầm chiếc lược đồ chơi đầu tròn, người lớn ở bên cùng chơi.', 'good'); };
  });
  [['simple', function (l) {
      var isOrph = l.fam && l.fam.orphan && l.fam.orphan.adopted == null;
      if (isOrph) {
        var k = l.fam.orphan.kind;
        return k === 'mai_am' ? 'Cùng các cô ở mái ấm hát mừng, không bày mâm' : k === 'chua' ? 'Cùng sư cô tụng kinh cầu an, không bày mâm' : 'Cùng người nuôi dưỡng hát mừng, không bày mâm';
      }
      return 'Cùng người chăm sóc hát mừng, không bày mâm';
    }, 0],
   ['borrow', function (l) {
      var isOrph = l.fam && l.fam.orphan && l.fam.orphan.adopted == null;
      if (isOrph) {
        var k = l.fam.orphan.kind;
        return k === 'mai_am' ? 'Dùng đồ chơi chung ở mái ấm để bày mâm sinh nhật' : k === 'chua' ? 'Dùng đồ chơi do phật tử tặng để bày mâm sinh nhật' : 'Dùng đồ chơi sẵn có của người nuôi dưỡng';
      }
      return 'Mượn đồ chơi của người thân để bày mâm sinh nhật';
    }, 0],
   ['homeParty', function (l) {
      var isOrph = l.fam && l.fam.orphan && l.fam.orphan.adopted == null;
      if (isOrph) return 'Tiệc nhỏ cùng các bạn ở mái ấm và chụp ảnh kỷ niệm';
      return 'Tiệc nhỏ tại nhà và chụp ảnh kỷ niệm';
    }, 2],
   ['restaurant', 'Tiệc nhà hàng cùng người thân', 3],
   ['professional', 'Tiệc có người tổ chức và album gia đình', 4]].forEach(function (a) {
    d.opts.push({
      k: a[0],
      l: typeof a[1] === 'function' ? a[1] : a[1],
      req: function (l) {
        var isOrph = l.fam && l.fam.orphan && l.fam.orphan.adopted == null;
        if (isOrph && (a[0] === 'restaurant' || a[0] === 'professional')) return false;
        return resources(l).band >= a[2];
      },
      run: function (l, r, log) {
        var s = L.state(l);
        var isOrph = l.fam && l.fam.orphan && l.fam.orphan.adopted == null;
        var textLabel = typeof a[1] === 'function' ? a[1](l) : a[1];
        s.firstBirthday157 = { style: a[0], age: l.age, band: resources(l).band };
        H.fx(l, { hap: 3, soc: 1 });
        H.mem(l, 'Sinh nhật đầu tiên: ' + textLabel.toLowerCase() + '.', 3);
        log(textLabel + '. ' + (isOrph ? 'Những người chăm sóc lưu lại một kỷ niệm ấm áp bên bé, không đặt sẵn tương lai của bé.' : 'Gia đình lưu lại một kỷ niệm ấm áp, không đặt sẵn tương lai của bé.'), 'good');
      }
    });
  });
  // Preserve household resource tiers; expand the objects available within each tier.
  var objects846={
    mic:['🎤 Micro — hướng ca sĩ','ca hát / ca sĩ','âm nhạc','sing'],
    but:['✏️ Bút — hướng giáo viên, nhà văn','giáo dục / viết lách','toán học',null],
    tien:['💰 Thẻ tiền — hướng kinh doanh','kinh doanh','kinh doanh',null],
    bong:['⚽ Bóng mềm — hướng vận động viên','thể thao','thể thao','sport'],
    may:['🎮 Tay cầm đồ chơi — hướng game thủ','game / thể thao điện tử','game',null],
    ong:['🩺 Ống nghe — hướng bác sĩ','y học',null,null],
    son:['🪮 Lược — hướng tạo mẫu tóc, làm đẹp','làm đẹp','làm đẹp',null],
    sach:['📚 Sách tranh — hướng giáo viên, học giả','giáo dục',null,'language'],
    kinh:['🔎 Kính lúp — hướng nhà nghiên cứu','nghiên cứu',null,null],
    nhac:['🎹 Đàn đồ chơi — hướng nhạc công, nhạc sĩ','nhạc cụ / sáng tác','âm nhạc','instrument'],
    gach:['🧱 Xếp hình — hướng kiến trúc sư, kỹ sư','kỹ thuật','khéo tay',null],
    cay:['🌱 Cây vải — hướng sinh học, nông nghiệp','sinh học',null,null],
    brush846:['🎨 Cọ vẽ — hướng họa sĩ','hội họa','hội họa','draw'],
    camera846:['📷 Máy ảnh đồ chơi — hướng nhiếp ảnh gia','nhiếp ảnh',null,'draw'],
    chef846:['🍳 Bộ bếp đồ chơi — hướng đầu bếp','ẩm thực','khéo tay',null],
    computer846:['💻 Thẻ máy tính — hướng lập trình viên','lập trình','khéo tay','code'],
    globe846:['🌍 Quả địa cầu mềm — hướng ngoại giao, ngoại ngữ','ngoại ngữ / ngoại giao','ngoại ngữ','language'],
    gavel846:['⚖️ Búa đồ chơi — hướng luật sư, thẩm phán','pháp luật','ăn nói',null],
    plane846:['✈️ Máy bay đồ chơi — hướng phi công','hàng không',null,null],
    ball846:['🏀 Bóng rổ mềm — hướng vận động viên bóng rổ','bóng rổ','thể thao','sport'],
    racket846:['🏸 Vợt vải — hướng vận động viên cầu lông','cầu lông','thể thao','sport'],
    dance846:['🩰 Giày vải — hướng vũ công','múa / nhảy',null,'dance'],
    mask846:['🎭 Thẻ sân khấu — hướng diễn viên','diễn xuất','diễn xuất','acting'],
    news846:['📺 Thẻ bản tin — hướng MC, nhà báo','dẫn chương trình / báo chí','ăn nói','language'],
    train846:['🚂 Tàu đồ chơi — hướng kỹ thuật, vận tải','giao thông / kỹ thuật','khéo tay',null],
    animal846:['🐾 Thú bông — hướng bác sĩ thú y','chăm sóc động vật',null,null],
    badge846:['🛡️ Thẻ huy hiệu — hướng cứu hộ, phục vụ cộng đồng','cứu hộ / phục vụ cộng đồng',null,null],
    fashion846:['👗 Búp bê vải — hướng thiết kế thời trang','thiết kế thời trang','hội họa','draw']
  };
  Object.keys(objects846).forEach(function(key){var item=objects846[key],o=d.opts.find(function(o){return o.k===key;});if(!o){o={k:key,req:function(l){return resources(l).band>=(need[key]||0);},run:function(l,r,log){H.fx(l,{hap:1,kno:1});log('Bạn thích thú với '+item[0].split(' — ')[0]+'. Người chăm sóc ghi nhận sự tò mò về '+item[1]+'.','good');}};d.opts.push(o);}o.l=item[0];o.h='Đồ chơi lớn hoặc thẻ hình có người lớn giám sát · gợi hướng '+item[1]+' · có thể đổi sở thích khi lớn';});
  // Keep the microphone at the top instead of below a long list on mobile.
  var micIndex=d.opts.findIndex(function(o){return o.k==='mic';});if(micIndex>0)d.opts.unshift(d.opts.splice(micIndex,1)[0]);
  var birthdayText=d.text;d.text=function(l){return birthdayText(l)+' Danh mục có '+Object.keys(objects846).length+' đồ vật tượng trưng; những món hiện ra phụ thuộc ngân sách gia đình, không cần mua đủ cả mâm. Micro gợi hướng ca sĩ, sau này có thể luyện hát và dự thi.';};
  var applyBirthday=infant.apply;infant.apply=function(l,dec,key,r,log){var chosen=d.opts.find(function(o){return o.k===key;});if(!chosen||!dec.opts.some(function(o){return o.k===key;})||chosen.req&&!chosen.req(l,dec.data)){log('Điều kiện của món đã chọn không còn phù hợp. Lễ chưa hoàn tất; người chăm sóc cần thu xếp lại mâm đồ.','neutral');return;}var done=E.WORLD120.p(l).infantDone,out=applyBirthday.apply(this,arguments),item=objects846[key];if(done||!E.WORLD120.p(l).infantDone||!item)return out;var st=E.WORLD120.s(l);st.firstObject846={key:key,label:item[0],interest:item[1],skill:item[3],at:l.age};st.interest=item[1];st.childSupport=1;
    if(item[2]&&!l.talent){l.talent=item[2];l.skill=Math.max(l.skill||0,4);if(item[2]==='game'){l.talentSub=l.talentSub||'MOBA';l.game=l.game||E.gameFor(l,r);}}if(item[3]){var state=L.state(l),sk=L.skill(l,item[3]);state.skillInterest=item[3];sk.interest=true;}
    H.mem(l,'Đồ bốc sinh nhật đầu tiên: '+item[0]+'. Người chăm sóc khuyến khích '+item[1]+'.',3);log('Người chăm sóc lưu hướng quan tâm '+item[1]+'. Khi lớn bạn có thể học, rèn luyện hoặc chọn con đường khác; chưa có nghề nghiệp hay bằng cấp ngay từ lễ thôi nôi.','good');return out;};
  var skillsText=E.DEC.skills138.def.text;E.DEC.skills138.def.text=function(l,data){var old=typeof skillsText==='function'?skillsText(l,data):skillsText,b=E.WORLD120.p(l).firstObject846;return old+(b?' Đồ bốc sinh nhật đầu tiên: '+b.label+'. Gia đình từng khuyến khích '+b.interest+'; môn liên quan được đánh dấu yêu thích, bạn vẫn có thể đổi.':'');};
  var profile846=E.profile;E.profile=function(l){var p=profile846.apply(this,arguments),b=E.WORLD120.p(l).firstObject846;if(b)(p.edu||(p.edu=[])).push('Bốc thôi nôi: '+b.label+' · hướng '+b.interest);return p;};
  X.menu('artFamily157', 'Truyền thống nghệ thuật gia đình', function (l) { var w = X.reason(l, 5); return w !== true ? w : !art(l).length ? 'Chưa có người chăm sóc làm nghề nghệ thuật' : true; },
    'Có thể học cùng người thân hoặc chọn sở thích riêng. Nghề của bố mẹ mở cơ hội tiếp xúc, không bảo đảm tài năng hay thành công.', function (l) {
      var s = L.state(l);
      return [{ k: 'learn', l: 'Học một buổi nghệ thuật cùng người thân', why: l.age >= 18 ? 'Dành cho tuổi đang lớn' : s.artAt157 === l.age ? 'Đã sinh hoạt năm nay' : true, run: function (l, r, log) { s.artAt157 = l.age; var jobs = art(l).map(function (k) { return l.fam[k + 'Job']; }).join(' '), key = /múa|vũ công/.test(jobs) ? 'dance' : /diễn|đạo diễn|biên kịch/.test(jobs) ? 'acting' : /họa|nhiếp/.test(jobs) ? 'draw' : 'sing', sk = L.skill(l, key); sk.level = Math.min(100, sk.level + (sk.level < 60 ? 2 : 1)); s.artMentor157 = true; H.fx(l, { hap: 2 }); log('Người thân hướng dẫn bạn luyện nghệ thuật. Bạn có thêm kinh nghiệm; vẫn cần tự luyện và vượt qua tuyển chọn.', 'good'); } },
      { k: 'own', l: 'Nói với gia đình về con đường riêng', why: s.artAt157 === l.age ? 'Đã sinh hoạt năm nay' : true, run: function (l, r, log) { s.artAt157 = l.age; s.artChoice157 = 'own'; H.fx(l, { soc: 1, hap: 2 }); log('Bạn chia sẻ mong muốn theo đuổi sở thích riêng. Gia đình cùng bàn về kỳ vọng nối nghiệp.', 'neutral'); } }];
    }, 5, 'Học tập');
  var migrate846=E.migrateExt;E.migrateExt=function(l){if(migrate846)migrate846(l);if(!l||!l.flags||l.age!==1||E.WORLD120.p(l).infantDone)return;(l.pending||[]).forEach(function(dec){if(dec.id!=='thoi_noi')return;var fresh=infant.make(l,function(){return .5;},dec.data);dec.title=fresh.title;dec.text=fresh.text;dec.opts=fresh.opts;});};
  E.LIFE157 = { resources: resources, art: art, objects:objects846,objectNeeds:need };
})(globalThis.G);
