/* Một Đời — MD5 (8.10.24): school920 — prom/tiệc cuối cấp, lễ tốt nghiệp, kỷ yếu, ngoại khóa, lễ trưởng thành.
   · SCHOOL: mỗi trường có hồ sơ ổn định (loại trường, nguồn lực, truyền thống, khách ngoài trường) sinh một lần theo khóa, không
     reroll khi mở menu. Năm cuối/khối tính theo lịch học (schoolEnd), không theo age === 18. Sự kiện có mã (quốc gia + trường + khóa
     + loại), vòng đời announced → accepted/declined → completed/cancelled; không dự hai lần cùng một sự kiện.
   · Chuỗi: thông báo → tham gia hay không (không bắt buộc, không mất bạn bè) → trang phục (đồng phục/đồ có sẵn/mượn/thuê/mua; đồ mua
     lưu tủ đồ và dùng lại; không theo giới) → đi một mình/nhóm bạn/bạn đi cùng (cần đồng ý, không thành người yêu)/người yêu → dự →
     ký ức. Thiếu tiền thì không tạo nợ: chỉ chọn phương án rẻ hơn hoặc không đi. Sau tiệc là hoạt động có giám sát, không rượu.
   · Bảng quốc gia: mô tả là đầu mối (status 'secondary') trừ mục đã đọc nguồn chính thức; xem docs/MD5-SOURCES.md.
   · RITE: lễ văn hóa/tôn giáo tách khỏi tuổi pháp lý; tham gia theo gia đình, niềm tin, nơi sống và nguyện vọng, không theo hộ chiếu.
     Rumspringa, Naghol, Sateré-Mawé để ở trạng thái nghiên cứu (chỉ thông tin, không nhập vai/không thử thách đau đớn). */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, W = G.W, X = E.UPDATE110;
  if (!X) return;
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function mo(l, v) { return H.money(l, v); }
  function st(l) { var s = l.flags.school920; if (!s || typeof s !== 'object') s = l.flags.school920 = {}; ['prof', 'inst', 'mem'].forEach(function (k) { if (!s[k]) s[k] = k === 'mem' ? [] : {}; }); if (!s.wardrobe) s.wardrobe = []; return s; }
  function cc(l) { return E.resCode ? E.resCode(l) : l.country; }
  function yr(l) { return l.birthYear + l.age; }
  function jailed(l) { return l.jailUntil != null && l.age < l.jailUntil; }

  // ================= bảng quốc gia =================
  // g: khối (final = năm cuối, pre = năm áp chót, age16 = khoảng 16 tuổi); p: khả năng một trường có tổ chức; crown: truyền thống bình chọn
  var PROM = {
    VN: { n: 'Tiệc chia tay / prom cuối cấp', g: 'final', p: null, when: 'cuối học kỳ II, sau hoặc trước kỳ thi tốt nghiệp tùy trường', note: 'Có ở một số trường chuyên, quốc tế, tư hoặc công có truyền thống và nguồn lực; nhiều trường chỉ có lễ tri ân.', guests: 'school', ok: 'secondary' },
    US: { n: 'Senior prom', g: 'final', p: 0.85, also: { n: 'Junior prom', g: 'pre', p: 0.5 }, when: 'mùa xuân', note: 'Tùy trường; không phải học sinh lớp 11/12 nào cũng có cả hai prom.', guests: 'open', crown: 0.5, ok: 'secondary' },
    CA: { n: 'Prom / graduation formal', g: 'final', p: 0.8, when: 'cuối năm học', note: 'Tùy trường và tỉnh bang.', guests: 'open', crown: 0.3, ok: 'secondary' },
    GB: { n: 'Leavers\' prom / sixth form ball', g: 'final', p: 0.6, also: { n: 'Year 11 prom', g: 'age16', p: 0.6 }, when: 'cuối Year 11 hoặc Year 13 tùy trường', note: 'Không phải trường nào cũng gọi là ball hay prom.', guests: 'school', ok: 'secondary' },
    AU: { n: 'School formal', g: 'final', p: 0.85, when: 'năm 12, tùy trường', note: 'Khách ngoài trường theo quy định từng trường.', guests: 'open', ok: 'secondary' },
    NZ: { n: 'School ball', g: 'final', p: 0.85, when: 'năm 12–13', note: 'Khối và khách tùy trường.', guests: 'open', ok: 'secondary' },
    PL: { n: 'Studniówka', g: 'final', p: 0.92, when: 'khoảng 100 ngày trước kỳ thi matura (tháng 1–2)', note: 'Mở đầu bằng điệu polonaise; giáo viên, chủ nhiệm cùng dự. Ngày cụ thể do trường chọn.', guests: 'open', dance: 'polonaise', ok: 'official', src: 'gov.pl — Studniówka 2026, ZSCKR Korolówka-Osada' },
    IT: { n: 'Cento giorni (100 ngày trước maturità)', g: 'final', p: 0.6, when: 'khoảng 100 ngày trước kỳ thi maturità', note: 'Hình thức theo vùng/trường (đi chơi, tiệc lớp); không phải dạ vũ kiểu Ba Lan.', guests: 'school', ok: 'secondary' },
    PH: { n: 'JS Prom (Junior–Senior Promenade)', g: 'pre', p: 0.75, when: 'theo lịch từng trường', note: 'Học sinh khối junior và senior; tháng tổ chức khác nhau giữa các trường.', guests: 'school', crown: 0.4, ok: 'secondary' },
    IN: { n: 'Farewell party', g: 'final', p: 0.8, when: 'trước kỳ thi cuối cấp', note: 'Khối dưới tổ chức tiễn khối cuối; có nơi có nhảy, có nơi chỉ văn nghệ; trang phục tùy trường (saree, kurta, đồ trang trọng).', guests: 'school', ok: 'secondary' },
    PK: { n: 'Farewell party', g: 'final', p: 0.75, when: 'trước kỳ thi cuối cấp', note: 'Hình thức và trang phục theo trường, không mặc định có khiêu vũ.', guests: 'school', ok: 'secondary' },
    DE: { n: 'Abiball', g: 'final', p: 0.9, when: 'sau hoặc sát kỳ thi Abitur', note: 'Phụ huynh và thầy cô có thể cùng dự tùy hình thức.', guests: 'family', ok: 'secondary' },
    FI: { n: 'Vanhojen tanssit (vũ hội của khóa trên)', g: 'pre', p: 0.95, when: 'tháng 2, sau khi khóa cuối nghỉ để ôn thi', note: 'Dành cho học sinh lukio khóa áp chót, không phải lễ tốt nghiệp; tập nhảy nhiều tuần.', guests: 'school', dance: 'các điệu nhảy cổ điển', ok: 'official', src: 'espoo.fi — Vanhojen tanssit 5.–6.2.2026 (khối: nguồn thứ cấp)' },
    RU: { n: 'Vypusknoy (lễ/tiệc tốt nghiệp)', g: 'final', p: 0.85, when: 'cuối tháng 6', note: 'Quy mô tùy lớp và thời kỳ; không phải lớp nào cũng xa xỉ.', guests: 'family', ok: 'secondary' },
    UA: { n: 'Vypusknyi (lễ tốt nghiệp)', g: 'final', p: 0.85, when: 'cuối năm học', note: 'Hình thức riêng của Ukraina, tùy điều kiện thời kỳ.', guests: 'family', ok: 'secondary' },
    AT: { n: 'Maturaball', g: 'final', p: 0.85, when: 'thường vào mùa thu/đông năm cuối, trước kỳ matura', note: 'Học sinh tự tổ chức theo văn hóa vũ hội.', guests: 'open', dance: 'valse', ok: 'secondary' },
    ZA: { n: 'Matric dance', g: 'final', p: 0.85, when: 'năm Grade 12', note: 'Có trường tổ chức farewell cho Grade 11; tùy trường.', guests: 'open', ok: 'secondary' },
    PE: { n: 'Fiesta de Promoción', g: 'final', p: 0.8, when: 'cuối năm 5to de secundaria', note: 'Bữa tối cùng gia đình, có nơi có tiệc sau; không bắt kéo dài tới sáng.', guests: 'family', ok: 'secondary' },
    KR: { n: 'Lễ tốt nghiệp và chụp ảnh cùng lớp', g: 'final', p: 0, when: 'tháng 2', note: 'Lễ hội trường (thường mùa thu) tách khỏi lễ tốt nghiệp; prom hiếm.', guests: 'family', ok: 'secondary' },
    JP: { n: 'Lễ tốt nghiệp (sotsugyō-shiki)', g: 'final', p: 0, when: 'tháng 3', note: 'Có nơi còn tục tặng khuy áo thứ hai (đồng phục gakuran) — tùy người, không bắt buộc, không có nghĩa là đã thành đôi.', guests: 'family', ok: 'secondary' },
    TR: { n: 'Mezuniyet balosu', g: 'final', p: 0.6, when: 'cuối năm học', note: 'Tùy trường/địa phương; khách sạn ven Bosphorus chỉ là một lựa chọn ở Istanbul.', guests: 'school', ok: 'secondary' },
    HR: { n: 'Norijada', g: 'final', p: 0.8, when: 'khoảng 100 ngày trước khi kết thúc năm cuối', note: 'Học sinh cuối cấp đi diễu hành vui ở một số thành phố, do trường/địa phương quản lý an toàn.', guests: 'school', ok: 'secondary' },
    RS: { n: 'Maturska večer (dạ tiệc tốt nghiệp)', g: 'final', p: 0.85, when: 'cuối năm học', note: 'Lễ riêng của Serbia, không phải Norijada.', guests: 'school', ok: 'secondary' },
    HU: { n: 'Szalagavató (lễ gắn ruy băng)', g: 'final', p: 0.9, when: 'mùa thu/đông năm cuối', note: 'Gắn ruy băng, biểu diễn valse cùng gia đình, theo lịch trường.', guests: 'family', dance: 'valse', ok: 'secondary' }
  };
  // Các chương trình bên dưới là phương án trường/gia đình có thể chọn trong mô phỏng.
  [
    ['IT','I cento giorni','Gặp lớp trước kỳ thi cuối cấp, viết lời nhắn gửi tương lai.'],
    ['BE','Ngày hội 100 ngày','Lớp chuẩn bị tiết mục chia tay cùng thầy cô.'],
    ['CN KR','Ngày đếm ngược đến kỳ thi','Chụp ảnh kỷ yếu, ký áo và gửi lời động viên trước kỳ thi.'],
    ['NG','SS3 Graduation Dinner','Chọn trang phục ren hoặc Ankara, chụp ảnh và tặng hoa trên thảm đỏ.'],
    ['KE TZ','Tiệc tốt nghiệp đại gia đình','Cùng họ hàng chuẩn bị mâm cơm, thịt nướng và chuối, mời hàng xóm đến chung vui.'],
    ['LB','Dạ hội cuối cấp','Ban nhạc của trường mở màn; cả lớp có thể hòa vào hàng nhảy dabke.'],
    ['EG','Graduation Gala','Sân khấu phối tiếng trống tabla cùng nhạc pop và tiết mục của lớp.'],
    ['AE','Prom Night','Ban tổ chức chọn thảm đỏ, chụp ảnh và bình chọn tại hội trường hoặc khách sạn.'],
    ['SA QA','Hafla tốt nghiệp','Gia đình đón khách với qahwa và chà là; trang phục, chỗ ngồi và tiết mục theo ý chủ tiệc.'],
    ['IN BD','Farewell Party','Khóa dưới chuẩn bị video, trao giải vui; khách có thể chọn saree hoặc suit.'],
    ['PK','Farewell cuối khóa','Cùng bạn đọc thơ shayari, tặng quà lưu niệm trong trang phục shalwar kameez hoặc lễ phục.'],
    ['ID','Đêm chia tay cuối cấp','Chọn batik, kebaya hoặc trang phục dạ hội; nghe angklung và ban nhạc của trường.'],
    ['CD','Fête de collation','Mặc bộ vest yêu thích, nghe rumba và nhảy ndombolo cùng người thân.'],
    ['ET','Tiệc injera mừng tốt nghiệp','Cùng gia đình chia bánh injera và mời khách cà phê pha bằng jebena.'],
    ['BR MX','Dạ tiệc cuối cấp','Có thể mời cha, mẹ hoặc người thân mở điệu nhảy đầu tiên.']
  ].forEach(function(row){row[0].split(' ').forEach(function(code){
    var prior=PROM[code]; PROM[code]=Object.assign({g:'final',p:0.55,when:'theo lịch của trường',guests:'school',ok:'simulation'},prior||{}, {n:row[1],note:row[2],p:prior && prior.p>0 ? prior.p : 0.55});
  });});
  var activities={PL:'Tập polonaise cho Studniówka',IT:'Ghi lời nhắn 100 ngày trước kỳ thi',BE:'Dựng tiết mục 100 ngày',KR:'Chụp ảnh và viết lời chúc cho lớp',CN:'Làm sổ lưu niệm Bách Nhật',NG:'Thiết kế trang phục Ankara cho thảm đỏ',KE:'Chuẩn bị mâm ăn chung với họ hàng',TZ:'Mời hàng xóm tới bữa cơm mừng tốt nghiệp',LB:'Tập dabke cùng nhóm bạn',EG:'Chơi tabla trong ban nhạc lớp',AE:'Phụ trách thảm đỏ và gian chụp ảnh',SA:'Đón khách với qahwa, chà là và bukhoor',QA:'Chuẩn bị bàn cà phê và chà là',IN:'Dựng tiết mục Bollywood với khóa dưới',BD:'Chuẩn bị video chia tay và lời chúc',PK:'Đọc thơ shayari tặng lớp',ID:'Tập angklung với ban nhạc trường',CD:'Tập nhảy ndombolo cùng bạn bè',ET:'Mời khách dùng injera và cà phê',BR:'Mời cha, mẹ hoặc người thân mở điệu nhảy',MX:'Tập khiêu vũ với người thân'};
  Object.keys(activities).forEach(function(code){if(PROM[code])PROM[code].activity=activities[code];});
  var DEF = { n: 'Buổi chia tay cuối cấp', g: 'final', p: 0.35, when: 'cuối năm học', note: 'Truyền thống của nước này chưa có dữ liệu riêng; dùng mô tả chung.', guests: 'school', ok: 'generic' };
  function rec(c) { return PROM[c] || DEF; }

  // ================= hồ sơ trường (ổn định theo khóa) =================
  function inSchool(l) { return ['primary', 'lower', 'upper', 'priv', 'voc'].indexOf(l.school) >= 0 && !jailed(l); }
  function endAge(l) { return l.schoolEnd != null ? l.schoolEnd : l.school === 'primary' ? 11 : l.school === 'lower' ? 15 : 18; }
  function left(l) { return endAge(l) - l.age - 1; } // tuổi trong năm học đang diễn ra tăng trước khi trường cập nhật schoolEnd: năm cuối = 1
  function key(l) { var sp = l.flags.study54 && l.flags.study54.special; return cc(l) + ':' + l.school + ':' + (sp && !(l.school==='upper' && E.WORLD120.p(l).highSchool) && sp.name || l.uniName || 'local') + ':' + (l.birthYear + endAge(l)); }
  function profile(l) {
    var s = st(l), k = key(l); var named = cc(l)==='VN' && l.school==='upper' && E.WORLD120.p(l).highSchool;
    var selectedType = named && (named.type || (/chuyên/i.test(named.name) ? 'chuyên' : 'công lập'));
    if (s.prof[k] && (named ? s.prof[k].schoolName===named.name : cc(l)!=='VN' || s.prof[k].type!=='chuyên' || s.prof[k].res>=0.82)) return s.prof[k];
    var sp = l.flags.study54 && l.flags.study54.special, type = sp ? 'chuyên' : l.school === 'priv' ? (u(l.id + k + ':intl') < 0.25 ? 'quốc tế' : 'tư thục') : l.school === 'voc' ? 'nghề' : 'công lập';
    var res = U.clamp({ 'chuyên': 0.6, 'quốc tế': 0.85, 'tư thục': 0.6, 'nghề': 0.35, 'công lập': 0.45 }[type] + (u(l.id + k + ':res') - 0.5) * 0.4 + (l.urban ? 0.05 : -0.05), 0.1, 0.95);
    if (named || cc(l)==='VN' && type==='chuyên') {
      type = selectedType || type;
      var floor = type==='chuyên' ? 0.82 : type==='tư thục' ? 0.60 : 0.35;
      res = floor + u((named ? named.name : sp.name) + k + ':resources') * 0.15;
    }
    var R = rec(cc(l)), base = R.p != null ? R.p : { 'chuyên': 0.55, 'quốc tế': 0.9, 'tư thục': 0.6, 'nghề': 0.15, 'công lập': 0.25 }[type];
    var hold = u(l.id + k + ':prom') < U.clamp(base * (0.75 + res * 0.5), 0, 0.97);
    s.prof[k] = { key: k, schoolName: named && named.name, cc: cc(l), type: type, res: Math.round(res * 100) / 100, prom: hold, junior: R.also ? u(l.id + k + ':jr') < R.also.p : false, crown: R.crown ? u(l.id + k + ':crown') < R.crown : false, guests: R.guests, fund: res < 0.45 && u(l.id + k + ':fund') < 0.5, campfire: cc(l) === 'VN' ? u(l.id + k + ':camp') < 0.55 : u(l.id + k + ':camp') < 0.15, at: l.age };
    return s.prof[k];
  }

  // ================= sự kiện trong năm học =================
  var TRIPS_VN = [['Đà Lạt', 0.05, ['TP. Hồ Chí Minh', 'Khánh Hòa', 'Đắk Lắk', 'Lâm Đồng', 'Đồng Nai', 'Bình Dương', 'Cần Thơ']], ['Vũng Tàu', 0.025, ['TP. Hồ Chí Minh', 'Đồng Nai', 'Bình Dương', 'Tây Ninh', 'Cần Thơ']], ['Hạ Long', 0.04, ['Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Bắc Ninh', 'Hưng Yên']], ['Huế – Hội An', 0.045, ['Đà Nẵng', 'Huế', 'Quảng Ngãi', 'Quảng Trị', 'Hà Tĩnh', 'Nghệ An']], ['Sa Pa', 0.05, ['Hà Nội', 'Lào Cai', 'Phú Thọ', 'Thái Nguyên']], ['Phú Quốc', 0.07, ['TP. Hồ Chí Minh', 'An Giang', 'Cần Thơ']]];
  function prov(l) { return l.provLabel || l.city || l.place || ''; }
  function tripChoices(l) {
    if (cc(l) !== 'VN') return [['một thành phố trong nước', 0.04], ['vùng biển/núi gần nhất', 0.03]];
    var p = prov(l), near = TRIPS_VN.filter(function (t) { return t[2].some(function (x) { return p.indexOf(x) >= 0; }); });
    return (near.length ? near : TRIPS_VN.slice(0, 3)).slice(0, 3).map(function (t) { return [t[0], t[1]]; });
  }
  function iid(l, kind) { return key(l) + ':' + kind + ':' + yr(l); }
  function plan(l, log) {
    if (!inSchool(l) || l.age < 6) return;
    var s = st(l), p = profile(l), R = rec(cc(l)), made = [];
    function add(kind, extra) { var id = iid(l, kind); if (s.inst[id]) return; s.inst[id] = Object.assign({ id: id, kind: kind, cc: cc(l), school: p.key, year: yr(l), age: l.age, stage: 'announced' }, extra || {}); made.push(kind); }
    if (l.age >= 7 && l.age <= 17 && u(l.id + ':trip:' + l.age) < 0.7) add('trip', { dest: tripChoices(l)[0][0] });
    var fin = left(l) === 1 && ['upper', 'priv', 'voc'].indexOf(l.school) >= 0;
    if (fin) { add('grad'); add('yearbook'); if (p.prom && R.g === 'final') add('prom', { name: R.n }); if (cc(l) === 'VN' || u(l.id + ':senior') < 0.4) add('senior'); if (p.campfire) add('campfire'); }
    if (R.g === 'pre' && left(l) === 2 && p.prom && ['upper', 'priv'].indexOf(l.school) >= 0) add('prom', { name: R.n });
    if (R.also && p.junior && (R.also.g === 'pre' && left(l) === 2 || R.also.g === 'age16' && l.age === 16)) add('prom2', { name: R.also.n });
    if (made.length && log) log('Trường thông báo kế hoạch năm học: ' + made.map(function (k) { return label(s.inst[iid(l, k)]); }).join(', ') + '. Tham gia là tự nguyện.', 'neutral');
    if (fin && !p.prom && R.g === 'final' && !s.inst[iid(l, 'noprom')] && log) { s.inst[iid(l, 'noprom')] = { id: iid(l, 'noprom'), kind: 'noprom', stage: 'info', age: l.age, school: p.key }; log(R.n + ': trường bạn năm nay không tổ chức' + (p.res < 0.45 ? ' (kinh phí hạn chế); học sinh có thể đề xuất một buổi gặp mặt đơn giản' : '') + '.', 'neutral'); }
  }
  function label(e) { return { trip: 'chuyến ngoại khóa ' + (e.dest || ''), grad: 'lễ tốt nghiệp / tri ân thầy cô', yearbook: 'kỷ yếu', prom: e.name || 'tiệc cuối cấp', prom2: e.name || 'tiệc khối', senior: 'chuyến đi cuối cấp', campfire: 'đêm lửa trại' }[e.kind] || e.kind; }
  function live(l) { var s = st(l); return Object.keys(s.inst).map(function (k) { return s.inst[k]; }).filter(function (e) { return e.age === l.age && e.kind !== 'noprom' && e.school === (inSchool(l) ? key(l) : e.school); }); }
  function payer(l) { return l.indep ? 'Bạn chi' : 'Gia đình chi'; }
  function afford(l, c) { return l.money >= c + (l.indep ? l.base * 0.05 : 0); }
  function ticket(l, e) { var p = profile(l); return e.kind === 'prom' || e.kind === 'prom2' ? l.base * (0.004 + p.res * 0.02) : e.kind === 'yearbook' ? l.base * 0.004 : e.kind === 'trip' ? l.base * 0.008 : e.kind === 'senior' ? l.base * (e.cost || 0.04) : e.kind === 'campfire' ? l.base * 0.002 : 0; }
  function memo(l, e, t, w) { var s = st(l); s.mem.push({ id: e.id, kind: e.kind, cc: e.cc, school: e.school, year: e.year, age: l.age, t: t, with: w || [] }); if (s.mem.length > 40) s.mem = s.mem.slice(-40); H.mem(l, t, 3); }

  // trang phục (tủ đồ dùng chung cho tiệc trường, lễ trưởng thành, hoàng gia)
  var OUTFIT = { suit: 'bộ vest/suit', dress: 'đầm dạ tiệc', aodai: 'áo dài', trad: 'trang phục truyền thống', smart: 'đồ lịch sự' };
  function wardrobe(l) { return st(l).wardrobe; }
  function outfitRows(l, e, done) {
    var out = [{ k: 'uniform', l: 'Mặc đồng phục / đồ có sẵn', h: 'Không tốn tiền', c: 0 }];
    wardrobe(l).forEach(function (w) { out.push({ k: 'own:' + w.id, l: 'Dùng lại ' + w.label + ' trong tủ đồ', h: 'Không tốn thêm', c: 0, item: w }); });
    Object.keys(OUTFIT).filter(function (k) { return k !== 'aodai' || cc(l) === 'VN'; }).forEach(function (k) {
      out.push({ k: 'borrow:' + k, l: 'Mượn ' + OUTFIT[k] + ' của người thân/bạn', h: 'Không tốn tiền, trả lại sau', c: 0 });
      out.push({ k: 'rent:' + k, l: 'Thuê ' + OUTFIT[k], h: '~' + mo(l, l.base * 0.008), c: l.base * 0.008 });
      out.push({ k: 'buy:' + k, l: 'Mua ' + OUTFIT[k] + ' (giữ lại dùng sau)', h: '~' + mo(l, l.base * 0.03), c: l.base * 0.03, buy: k });
    });
    return out.map(function (o) { return { k: 'fit:' + o.k, l: o.l, h: o.h, why: !afford(l, o.c) ? 'Chưa đủ tiền — chọn phương án khác' : true, run: function (l, r, log) { if (!afford(l, o.c) || e.outfit) return; if (o.c) H.cash(l, -o.c, payer(l) + ': trang phục ' + label(e)); if (o.buy) { var w = { id: l.id + ':w920:' + wardrobe(l).length, kind: o.buy, label: OUTFIT[o.buy], age: l.age }; wardrobe(l).push(w); e.outfit = w.id; } else e.outfit = o.k; log('Đã chuẩn bị trang phục: ' + o.l.toLowerCase() + '.', 'neutral'); done && done(l, r); } }; });
  }
  function friends(l) { return (l.friends || []).filter(function (f) { return f.alive !== false && (f.age == null || f.age < 21); }).slice(0, 6); }
  function companionRows(l, e) {
    var p = profile(l), out = [{ k: 'who:alone', l: 'Đi một mình', run: function (l, r, log) { e.who = 'alone'; log('Bạn đi một mình — nhiều người cũng vậy.', 'neutral'); } },
      { k: 'who:group', l: 'Đi cùng nhóm bạn', run: function (l, r, log) { e.who = 'group'; log('Bạn hẹn nhóm bạn đi cùng.', 'good'); } }];
    friends(l).forEach(function (f) { out.push({ k: 'who:ask:' + X.uid(l, f), l: 'Mời ' + f.name + ' đi cùng (bạn đi cùng, không phải hẹn hò)', h: 'Người được mời có thể từ chối', why: e.asked === X.uid(l, f) ? 'Đã mời' : true, run: function (l, r, log) { e.asked = X.uid(l, f); var yes = u(e.id + ':' + e.asked) < 0.3 + (f.close || 50) / 120; if (yes) { e.who = 'date'; e.date = f.name; log(f.name + ' nhận lời đi cùng bạn. Hai người vẫn là bạn.', 'good'); } else log(f.name + ' cảm ơn nhưng đã hẹn đi với nhóm khác. Không sao cả.', 'neutral'); } }); });
    var q = l.partner; if (q && q.alive !== false) out.push({ k: 'who:partner', l: 'Đi cùng người yêu ' + q.name, why: Math.abs((q.age || l.age) - l.age) > 3 ? 'Khách mời cần cùng lứa tuổi học sinh' : p.guests === 'school' && !q.school108 ? 'Trường chỉ cho học sinh trong trường dự' : true, run: function (l, r, log) { e.who = 'partner'; e.date = q.name; log('Bạn và ' + q.name + ' cùng đi.', 'good'); } });
    return out;
  }
  function attend(l, e, r, log) {
    var c = ticket(l, e), p = profile(l), R = rec(e.cc);
    if (e.stage !== 'accepted' || !afford(l, c) && !(p.fund && c)) return;
    if (c) { if (afford(l, c)) H.cash(l, -c, payer(l) + ': ' + label(e)); else log('Quỹ hỗ trợ của trường đóng phần phí của bạn.', 'neutral'); }
    e.stage = 'completed'; e.done = l.age; H.fx(l, { hap: 4, soc: 2 });
    var w = e.date ? [e.date] : [];
    friends(l).slice(0, 4).forEach(function (f) { if (u(e.id + ':fr:' + f.name) < 0.6) { f.close = U.clamp((f.close || 50) + 2, 0, 100); w.push(f.name); } });
    var t;
    if (e.kind === 'prom' || e.kind === 'prom2') {
      t = e.name + (R.dance ? ': mở màn bằng ' + R.dance : '') + '; bạn ' + (e.who === 'alone' ? 'đi một mình và nhảy cùng các bạn trong lớp' : e.who === 'group' ? 'đi cùng nhóm bạn' : 'đi cùng ' + e.date) + '. Cả lớp chụp ảnh, cảm ơn thầy cô.';
      if (p.crown && u(e.id + ':crown') < 0.08 + (l.st.soc || 50) / 1000) t += ' Bạn được các bạn bình chọn trong danh hiệu của buổi tiệc.';
      t += ' Sau tiệc, lớp đi ăn khuya có thầy cô và phụ huynh đưa về.';
    } else if (e.kind === 'grad') t = 'Lễ tốt nghiệp: bạn mặc trang phục của buổi lễ, gửi lời cảm ơn thầy cô và chụp ảnh cùng gia đình.';
    else if (e.kind === 'yearbook') t = 'Bạn góp ảnh và lời nhắn vào kỷ yếu của lớp.';
    else if (e.kind === 'trip' || e.kind === 'senior') t = (e.kind === 'senior' ? 'Chuyến đi cuối cấp ' : 'Chuyến ngoại khóa ') + (e.dest || '') + ' cùng lớp, có giáo viên đi kèm.';
    else if (e.kind === 'campfire') t = 'Đêm lửa trại của trường: văn nghệ, trò chơi lớn, đốt lửa có ban tổ chức giám sát.';
    log(t, 'good'); memo(l, e, t, w);
  }
  function evRows(l, e) {
    var out = [];
    if (e.stage === 'announced') {
      out.push({ k: 'join', l: 'Đăng ký tham gia', run: function (l, r, log) { e.stage = 'accepted'; log('Bạn đăng ký ' + label(e) + '.', 'neutral'); } });
      [['home', 'Không tham gia, ở nhà nghỉ ngơi'], ['friends', 'Không tham gia, hẹn vài người bạn đi chơi riêng'], ['other', 'Không tham gia, dành thời gian cho việc khác']].forEach(function (x) { out.push({ k: 'no:' + x[0], l: x[1], run: function (l, r, log) { e.stage = 'declined'; e.alt = x[0]; if (x[0] === 'friends') H.fx(l, { soc: 1, hap: 1 }); log('Bạn không tham gia ' + label(e) + '. Quyết định của bạn được tôn trọng; bạn bè vẫn là bạn bè.', 'neutral'); } }); });
      return out;
    }
    if (e.stage !== 'accepted') return [{ k: 'none', l: e.stage === 'completed' ? 'Đã tham dự' : e.stage === 'cancelled' ? 'Sự kiện đã hủy' : 'Đã không tham gia', why: 'Không còn bước nào', run: function () { } }];
    var formal = e.kind === 'prom' || e.kind === 'prom2' || e.kind === 'grad';
    if (formal && !e.outfit) return outfitRows(l, e);
    if ((e.kind === 'prom' || e.kind === 'prom2') && !e.who) return companionRows(l, e);
    if ((e.kind === 'prom' || e.kind === 'prom2') && !e.prep && rec(cc(l)).activity) {
      var activity=rec(cc(l)).activity;
      out.push({k:'prep:local',l:activity,run:function(l,r,log){e.prep='local';e.activity=activity;H.fx(l,{soc:1});log('Bạn cùng lớp chuẩn bị: '+activity+'.','good');H.mem(l,activity,2);}});
    }
    if ((e.kind === 'prom' || e.kind === 'prom2') && !e.prep) [['dance', 'Tập nhảy cùng lớp'], ['help', 'Tham gia ban tổ chức (chọn nhạc, trang trí)'], ['skip', 'Không cần chuẩn bị thêm']].forEach(function (x) { out.push({ k: 'prep:' + x[0], l: x[1], run: function (l, r, log) { e.prep = x[0]; if (x[0] !== 'skip') H.fx(l, { soc: 1 }); log(x[0] === 'dance' ? 'Mấy tuần tập nhảy sau giờ học.' : x[0] === 'help' ? 'Bạn cùng ban tổ chức lo nhạc và trang trí.' : 'Bạn để dành sức cho buổi tối.', 'neutral'); } }); });
    else if (e.kind === 'senior' && !e.dest) tripChoices(l).forEach(function (t) { out.push({ k: 'dest:' + t[0], l: 'Bình chọn đi ' + t[0], h: '~' + mo(l, l.base * t[1]), run: function (l, r, log) { e.dest = t[0]; e.cost = t[1]; log('Lớp chọn đi ' + t[0] + '.', 'neutral'); } }); });
    else if (e.kind === 'yearbook' && !e.photo) [['group', 'Chỉ ảnh tập thể', 0], ['solo', 'Chụp thêm ảnh cá nhân', 0.01]].forEach(function (x) { out.push({ k: 'photo:' + x[0], l: x[1], h: x[2] ? '~' + mo(l, l.base * x[2]) : '', why: afford(l, l.base * x[2]) ? true : 'Chưa đủ tiền', run: function (l, r, log) { e.photo = x[0]; if (x[2]) H.cash(l, -l.base * x[2], payer(l) + ': ảnh kỷ yếu'); attend(l, e, r, log); } }); });
    else { var c = ticket(l, e), ok = afford(l, c) || profile(l).fund; out.push({ k: 'go', l: 'Tham dự ' + label(e), h: c ? payer(l) + ' ~' + mo(l, c) + (profile(l).fund ? ' (có quỹ hỗ trợ)' : '') : '', why: ok ? true : 'Chưa đủ tiền — có thể không tham gia, không phát sinh nợ', run: function (l, r, log) { if ((e.kind === 'trip' || e.kind === 'senior' || e.kind === 'campfire') && u(e.id + ':wx:' + (e.post || 0)) < 0.06) { if (!e.post) { e.post = 1; log('Thời tiết xấu, trường dời ' + label(e) + ' sang dịp khác trong năm.', 'neutral'); return; } e.stage = 'cancelled'; log(label(e) + ' bị hủy vì thời tiết; không thu phí.', 'neutral'); return; } attend(l, e, r, log); } }); }
    out.push({ k: 'cancel', l: 'Rút đăng ký', h: 'Chưa trả phí thì không mất tiền', run: function (l, r, log) { e.stage = 'declined'; e.alt = 'withdrew'; log('Bạn rút đăng ký ' + label(e) + '.', 'neutral'); } });
    return out;
  }
  X.menu('school920', 'Sự kiện ở trường: ngoại khóa, kỷ yếu, tốt nghiệp, prom', function (l) { if (!inSchool(l)) return 'Cần đang đi học phổ thông'; return live(l).length ? true : 'Năm học này chưa có sự kiện nào'; }, function (l, d) {
    var a = d && d.arg || {}, e = a.id && st(l).inst[a.id], p = inSchool(l) ? profile(l) : null, R = rec(cc(l));
    if (e) return label(e) + ' · ' + { announced: 'đang mở đăng ký', accepted: 'đã đăng ký', declined: 'không tham gia', completed: 'đã tham dự', cancelled: 'đã hủy' }[e.stage] + ((e.kind === 'prom' || e.kind === 'prom2') ? '\n' + R.n + ': ' + R.when + '. ' + R.note : '') + (e.outfit ? '\nTrang phục đã chọn.' : '') + (e.who ? '\nĐi cùng: ' + (e.who === 'alone' ? 'một mình' : e.who === 'group' ? 'nhóm bạn' : e.date) : '');
    return 'Trường ' + (p ? p.type : '') + ' · nguồn lực ' + (p ? Math.round(p.res * 100) : '?') + '/100' + (p && p.fund ? ' · có quỹ hỗ trợ học sinh khó khăn' : '') + '. Mọi hoạt động là tự nguyện; không ảnh hưởng điều kiện tốt nghiệp.';
  }, function (l, arg) {
    var e = arg && arg.id && st(l).inst[arg.id];
    if (e) return evRows(l, e).concat([{ k: 'back', l: '← Danh sách sự kiện', run: function (l, r) { X.next(l, 'school920', r, {}); } }]);
    return live(l).map(function (x) { return { k: x.id, l: U.cap(label(x)) + ' · ' + { announced: 'mở đăng ký', accepted: 'đã đăng ký', declined: 'không tham gia', completed: 'đã dự', cancelled: 'đã hủy' }[x.stage], run: function (l, r) { X.next(l, 'school920', r, { id: x.id }); } }; });
  }, 6, 'Học tập');

  // ================= RITE: lễ trưởng thành =================
  var LATIN = ['MX', 'PE', 'CO', 'AR', 'CL', 'EC', 'VE', 'BO', 'PY', 'UY', 'GT', 'HN', 'SV', 'NI', 'CR', 'PA', 'DO', 'CU', 'PR'];
  var RITES = {
    quince: { n: 'Quinceañera / tiệc 15 tuổi', age: 15, legal: 'Không thay đổi tuổi pháp lý; là lễ gia đình', when: function (l) { return LATIN.indexOf(cc(l)) >= 0 || /^es_la/.test(String(l.pool || '')); }, who: function (l) { return l.sex === 'F'; }, opts: ['điệu valse với cha, mẹ hoặc người thân/bạn thân', 'nhóm bạn đi cùng (court of honor)'], cost: [0.01, 0.05, 0.12], ok: 'secondary', note: 'Quy mô rất khác nhau giữa các gia đình; không bắt buộc vương miện, quà đắt hay tiệc lớn.' },
    seijin: { n: 'Lễ Thành nhân (tổ chức cho tuổi 20)', age: 20, legal: 'Tuổi trưởng thành theo luật Nhật là 18 từ 4/2022; nhiều địa phương vẫn làm lễ cho người 20 tuổi', when: function (l) { return cc(l) === 'JP' && yr(l) >= 1948; }, who: function () { return true; }, opts: ['furisode', 'hakama', 'vest/suit', 'trang phục khác'], cost: [0, 0.01, 0.04], ok: 'secondary', note: 'Chính quyền địa phương mời theo nơi cư trú; mỗi người chỉ dự một lần.' },
    guanli: { n: 'Quán lễ / Kê lễ (phục hưng văn hóa)', age: 20, legal: 'Nghi thức văn hóa, không có giá trị pháp lý', when: function (l) { return /^(CN|TW|HK|SG|MY)$/.test(cc(l)) && u(l.id + ':hanfu') < 0.15; }, who: function () { return true; }, opts: ['hanfu', 'trang phục thường ngày'], cost: [0, 0.01, 0.03], ok: 'secondary', note: 'Chỉ một số trường, gia đình, hội nhóm thực hành; không phải bắt buộc.' },
    mitzvah: { n: 'Bar/Bat Mitzvah', age: 13, prepAge: 12, legal: 'Trưởng thành về bổn phận tôn giáo, không đổi quyền dân sự', when: function (l) { return /Do Thái/.test(l.religion || ''); }, who: function () { return true; }, opts: ['đọc Torah tại giáo đường', 'dự án thiện nguyện', 'tiệc gia đình'], cost: [0.005, 0.03, 0.1], ok: 'secondary', note: 'Tuổi và vai trò của nữ khác nhau giữa các nhánh/giáo đoàn; tiệc lớn không bắt buộc.' },
    maasai: { n: 'Tìm hiểu nghi lễ trưởng thành của cộng đồng Maasai (Enkipaata, Eunoto, Olng\'esherr)', age: 18, legal: 'Chỉ là khách tìm hiểu/quan sát khi được cộng đồng mời', when: function (l) { return /^(KE|TZ)$/.test(cc(l)); }, who: function () { return true; }, observe: true, cost: [0, 0.01, 0.02], ok: 'official', note: 'UNESCO (2018): ba nghi lễ chuyển giai đoạn của nam thanh niên Maasai khoảng 15–30 tuổi ở Kenya, đang suy giảm vì thay đổi sinh kế, đất đai, khí hậu. Không phải mọi người Kenya/Tanzania là Maasai.' }
  };
  var RESEARCH = {
    rumspringa: 'Rumspringa (một số cộng đồng Amish): giai đoạn thanh niên tìm hiểu trước khi chọn rửa tội; không phải một đêm bắt buộc rời nhà. Trò chơi chưa có cộng đồng Amish — trạng thái nghiên cứu.',
    naghol: 'Naghol (đảo Pentecost, Vanuatu): nghi lễ địa phương theo mùa; trò chơi chỉ ghi thông tin, không mô phỏng việc nhảy, không có kỹ thuật/độ cao — trạng thái nghiên cứu.',
    satere: 'Sateré-Mawé (Brazil): nghi lễ của một dân tộc bản địa; chưa có nguồn chính thức đã đọc — trạng thái nghiên cứu, không có minigame chịu đau.'
  };
  RITES.seijin.note += ' Từ năm 2000, ngày lễ quốc gia rơi vào thứ Hai thứ hai của tháng Một; lịch buổi lễ địa phương có thể khác.';
  RITES.guanli.opts = ['mặc Hán phục và đội mũ trong Quán lễ','cài trâm trong Kê lễ','đọc lời hứa trước gia đình'];
  [
    ['sweet','Sweet 16',16,'US CA','lời chúc về tính tự lập|điệu nhảy cùng người thân'],
    ['debut','Debut tuổi 18',18,'PH','18 đóa hồng|18 ngọn nến và lời chúc'],
    ['ball','Dạ vũ ra mắt theo lời mời',18,'FR AT GB AU US','điệu valse mở màn|tập khiêu vũ với bạn đồng hành'],
    ['reels','Dạ vũ Scotland theo lời mời',18,'GB','học điệu reel|chọn kilt hoặc váy dạ hội'],
    ['confirmation','Konfirmation',15,'DK NO SE','nghi lễ đức tin|lễ trưởng thành thế tục và bài phát biểu'],
    ['amish','Tìm hiểu Rumspringa cùng cộng đồng Amish',16,'US','nghe những người trẻ kể về thời gian cân nhắc việc gia nhập giáo hội; trải nghiệm khác nhau giữa các gia đình'],
    ['pentecost','Naghol ở Pentecost',16,'VU','lắng nghe người địa phương giới thiệu nghi lễ'],
    ['amazon','Nghi lễ găng tay kiến của Sateré-Mawé',13,'BR','tìm hiểu qua lời kể của cộng đồng'],
    ['mentawai','Truyền thống Mentawai',15,'ID','nghe nghệ nhân kể về hình xăm và tục mài răng'],
    ['bali','Metatah của người Hindu ở Bali',16,'ID','tìm hiểu ý nghĩa tự chủ trong nghi lễ'],
    ...[5,10,15,20,25].map(function(age){return ['crown'+age,'Sinh nhật năm vương miện',age,'NL','trang trí ghế sinh nhật|nhận lời chúc từ gia đình'];})
  ].forEach(function(row){RITES[row[0]]={n:row[1],age:row[2],legal:'Cột mốc văn hóa',when:function(l){return row[3].split(' ').includes(cc(l));},who:function(){return true;},observe:['amish','pentecost','amazon','mentawai','bali'].includes(row[0]),opts:row[4].split('|'),note:row[4].split('|').join(' hoặc ')+'. Tùy gia đình, cộng đồng và lời mời.',cost:[0,0.015,0.05]};});
  RITES.bat = Object.assign({},RITES.mitzvah,{n:'Bat Mitzvah',age:12,prepAge:11,who:function(l){return l.sex==='F';}});
  RITES.mitzvah.who=function(l){return l.sex!=='F';};
  function riteState(l) { var s = st(l); return s.rite || (s.rite = {}); }
  function rites(l) { return Object.keys(RITES).filter(function (k) { var R = RITES[k], d = riteState(l)[k]; return R.when(l) && R.who(l) && (!d || d.stage !== 'done' && d.stage !== 'declined') && (l.age === R.age || R.prepAge != null && l.age === R.prepAge || d && d.stage === 'prep' && l.age <= R.age + 1); }); }
  function riteWhy(l) { if (!l.alive || jailed(l)) return 'Cần được tự do đi lại'; var done173 = l.flags.culture173 && l.flags.culture173.coming; return rites(l).length ? true : done173 ? 'Đã đánh dấu cột mốc trưởng thành' : 'Chưa có nghi lễ phù hợp với gia đình, niềm tin hoặc nơi sống của bạn'; }
  X.menu('rite920', 'Lễ trưởng thành của gia đình / cộng đồng', riteWhy, function (l) {
    return 'Lễ văn hóa hoặc tôn giáo không thay đổi tuổi pháp lý và không cấp quyền kết hôn, lao động hay uống rượu. Tham gia theo mong muốn của bạn và gia đình; từ chối không làm bạn kém đi. ' + rites(l).map(function (k) { var R = RITES[k]; return '\n• ' + R.n + ' — ' + R.legal + '. ' + R.note; }).join('');
  }, function (l) {
    var out = [];
    rites(l).forEach(function (k) {
      var R = RITES[k], d = riteState(l)[k];
      if (R.prepAge != null && l.age === R.prepAge && !d) { out.push({ k: k + ':prep', l: 'Bắt đầu một năm chuẩn bị cho ' + R.n, h: 'Học cùng thầy/giáo đoàn', run: function (l, r, log) { riteState(l)[k] = { stage: 'prep', at: l.age }; log('Bạn bắt đầu chuẩn bị cho ' + R.n + '.', 'neutral'); } }); return; }
      if (R.observe) { out.push({ k: k + ':obs', l: 'Tìm hiểu qua bảo tàng/trung tâm văn hóa, hoặc dự với tư cách khách khi được mời', h: 'Tôn trọng quy định của cộng đồng', run: function (l, r, log) { riteState(l)[k] = { stage: 'done', at: l.age, how: 'observe' }; H.fx(l, { kno: 2 }); var memory=R.n+' — '+R.note; log(memory,'good'); H.mem(l,memory,3); } }); return; }
      if(R.opts && R.opts.length>1 && !(d && d.choice)) R.opts.forEach(function(option,index){
        out.push({k:k+':choose:'+index,l:'Chọn cho '+R.n+' — '+option,run:function(l,r,log){var record=riteState(l)[k] || (riteState(l)[k]={});record.choice=option;log('Bạn chọn '+option+' cho buổi lễ.','neutral');X.next(l,'rite920',r);}});
      });
      ['small', 'mid', 'big'].forEach(function (sz, i) { var c = l.base * R.cost[i]; out.push({ k: k + ':' + sz, l: R.n + ': ' + ['bữa cơm/lễ nhỏ với người thân', 'buổi lễ vừa phải', 'buổi lễ lớn'][i], h: c ? (l.indep ? 'Bạn chi' : 'Gia đình chi') + ' ~' + mo(l, c) : 'Không tốn thêm', why: l.money >= c ? true : 'Chưa đủ tiền — chọn quy mô nhỏ hơn', run: function (l, r, log) { if (l.money < c) return; if (c) H.cash(l, -c, R.n); var opt = d && d.choice || R.opts && R.opts[Math.floor(u(l.id + ':' + k + ':o') * R.opts.length)]; riteState(l)[k] = { stage: 'done', at: l.age, size: sz, choice: opt || null }; H.fx(l, { hap: 3 + i, soc: 1 + i }); var t = R.n + (opt ? ' (' + opt + ')' : '') + ': một ngày đáng nhớ cùng gia đình và bạn bè.'; log(t, 'big'); H.mem(l, t, 4); st(l).mem.push({ id: 'rite:' + k, kind: 'rite', cc: cc(l), age: l.age, t: t }); } }); });
      out.push({ k: k + ':no', l: 'Không tổ chức ' + R.n, run: function (l, r, log) { riteState(l)[k] = { stage: 'declined', at: l.age }; log('Bạn và gia đình quyết định không tổ chức ' + R.n + '. Trưởng thành không phụ thuộc vào một buổi lễ.', 'neutral'); } });
    });
    return out;
  }, 5, 'Đời sống');
  // không trùng với cột mốc chung của life173 ở các lễ đã có dữ liệu riêng
  var wc = E.DEC.world_coming173;
  if (wc) { var wv = wc.valid; wc.valid = function (l, d) { var c = E.comingOfAge173 && E.comingOfAge173(l); if (c && RITES[c.key] && RITES[c.key].when(l)) return false; return wv.apply(this, arguments); }; }

  E.HOOKS.year.push(function (l, r, log) { if (!l.alive || !['vn', 'world'].includes(l.mode)) return; plan(l, log); var s = l.flags.school920; if (s && s.inst) Object.keys(s.inst).forEach(function (k) { var e = s.inst[k]; if (e.age < l.age - 1 && e.stage === 'announced') { e.stage = 'declined'; e.alt = 'expired'; } if (l.age - e.age > 6) delete s.inst[k]; }); });
  E.SCHOOL920 = { PROM: PROM, rec: rec, profile: profile, key: key, plan: plan, live: live, evRows: evRows, attend: attend, label: label, wardrobe: wardrobe, OUTFIT: OUTFIT, RITES: RITES, RESEARCH: RESEARCH, rites: rites };
})(globalThis.G);
