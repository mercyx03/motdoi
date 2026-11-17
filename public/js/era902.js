/* Một Đời — 9.1 (giai đoạn 1 bối cảnh lịch sử): chọn năm sinh 1900–2026 và chặn nội dung sai thời.
   Mở rộng khung "năm thế giới = năm sinh + tuổi" của era917.js; không thêm hệ thống riêng.
   · Bảng TECH: mỗi mục là một kỹ thuật/sản phẩm/sự kiện kèm năm đầu tiên nó có thể xảy ra ở BẤT KỲ nước nào (mốc công khai, đối chiếu được).
     Đây chỉ là mốc "sớm nhất có thể"; mức phổ biến theo từng nước (ví dụ internet ở Việt Nam, TV ở Nigeria) thuộc giai đoạn 2.
   · Khi năm thế giới của nhân vật nhỏ hơn mốc: (1) lời kể và văn bản cảnh đi qua E.famLogic/famFix bị cắt các câu sai thời; dòng nhật ký còn trống thì bỏ;
     (2) cảnh dựng bằng DEC.make bị cắt lựa chọn sai thời, bỏ cả cảnh nếu tiêu đề hoặc mọi lựa chọn sai thời; (3) startJob từ chối nghề chưa tồn tại;
     (4) danh sách hành động chủ động ẩn mục sai thời.
   · Đời sinh từ năm 2022 trở đi (mọi mốc đã qua) đi đường tắt, không đổi một byte so với trước.
   · Không đụng tới số liệu dân số/kinh tế/quốc gia: những phần đó vẫn là của hiện nay cho tới giai đoạn 2. */
(function (G) {
  'use strict';
  var E = G.E; if (!E || !E.DEC) return;
  var YEAR_MIN = 1900;
  // [id, nhận diện, năm đầu tiên, cơ sở]. Chỉ ghi mốc có thể đối chiếu công khai.
  // 9.2: mức phổ cập THEO NƯỚC (era920.js, ITU/WDI): dưới ngưỡng ở nước và năm đó thì coi như chưa có, dù trên thế giới đã có từ năm ghi ở TECH.
  // Ngưỡng là tham số trò chơi (thuê bao di động trên 100 dân / % dân dùng internet), không phải mốc thống kê.
  var ADOPT = { mobile: ['mobile', 1], sms: ['mobile', 3], smartphone: ['internet', 5], internet: ['internet', 1], wifi: ['internet', 2], google: ['internet', 1], facebook: ['internet', 3], youtube: ['internet', 3], instagram: ['internet', 5], tiktok: ['internet', 10], zalo: ['internet', 3], stream: ['internet', 5], dating_app: ['internet', 5], ridehail: ['internet', 5], ewallet: ['internet', 5], crypto: ['internet', 3], ai: ['internet', 5], videocall: ['internet', 3], podcast: ['internet', 3], spotify: ['internet', 5], appstore: ['internet', 5], netculture: ['internet', 1], app: ['internet', 5], viral: ['internet', 3], followers: ['internet', 3], phoneuse: ['mobile', 1], moba: ['internet', 3], hashtag: ['internet', 5] };
  var TECH = [
    ['tv', /\btivi\b|\bti vi\b|\bTV\b|truyền hình/i, 1936, 'BBC phát sóng truyền hình công cộng thường xuyên từ 11/1936'],
    ['mobile', /điện thoại di động|điện thoại cầm tay|đi động/i, 1983, 'Motorola DynaTAC bán thương mại 1983'],
    ['sms', /\bSMS\b/, 1992, 'tin nhắn SMS đầu tiên 12/1992'],
    ['smartphone', /điện thoại thông minh|smartphone|iPhone|\bAndroid\b|\biOS\b/i, 2007, 'iPhone ra mắt 2007'],
    ['internet', /\binternet\b|\bonline\b|\bwebsite\b|trang web|\be-?mail\b|\bgmail\b|trên mạng|lên mạng/i, 1991, 'World Wide Web công bố công khai 1991'],
    ['wifi', /\bwi-?fi\b/i, 1999, 'Wi-Fi tiêu dùng 1999'],
    ['google', /\bgoogle\b|tìm kiếm trên mạng/i, 1998, 'Google thành lập 1998'],
    ['facebook', /facebook|\bmạng xã hội\b|fanpage|messenger/i, 2004, 'Facebook 2004'],
    ['youtube', /youtube|youtuber/i, 2005, 'YouTube 2005'],
    ['instagram', /instagram/i, 2010, 'Instagram 2010'],
    ['tiktok', /tiktok|douyin|\baffiliate\b/i, 2016, 'Douyin 2016, TikTok quốc tế 2017'],
    ['zalo', /\bzalo\b/i, 2012, 'Zalo 2012'],
    ['netflix', /netflix/i, 1997, 'Netflix thành lập 1997 (thuê DVD)'],
    ['stream', /livestream|\bstreamer\b|\btwitch\b/i, 2011, 'Twitch 2011'],
    ['dating_app', /tinder|ứng dụng hẹn hò|app hẹn hò/i, 2009, 'Grindr 2009, Tinder 2012'],
    ['ridehail', /\bgrab\b|\buber\b|tài xế công nghệ|xe ôm công nghệ/i, 2009, 'Uber 2009'],
    ['ewallet', /ví điện tử|\bmomo\b|zalopay|thanh toán qr|quét mã qr/i, 2012, 'ví MoMo được cấp phép 11/2012 (M_Service lập 2007 làm dịch vụ nạp tiền điện thoại); ví điện tử đại chúng từ khoảng 2012'],
    ['crypto', /tiền mã hóa|bitcoin|\bcrypto\b|\bnft\b/i, 2009, 'Bitcoin 2009'],
    ['ai', /ChatGPT|chatgpt|trí tuệ nhân tạo|\bAI\b|deepfake/, 2016, 'AI đại chúng từ khoảng 2016; ChatGPT 2022'],
    ['covid', /covid|giãn cách xã hội/i, 2020, 'COVID-19 đại dịch 2020'],
    ['hiv', /\bHIV\b|\bAIDS\b/, 1981, 'AIDS được ghi nhận 1981'],
    ['ivf', /\bIVF\b|thụ tinh ống nghiệm/i, 1978, 'em bé ống nghiệm đầu tiên 1978'],
    ['surrogacy', /mang thai hộ/i, 1985, 'mang thai hộ dùng phôi (gestational) từ 1985'],
    ['pill', /thuốc tránh thai|viên tránh thai/i, 1960, 'viên tránh thai Enovid 1960'],
    ['dna', /\bADN\b|\bDNA\b|xét nghiệm huyết thống/i, 1985, 'dấu vân tay ADN 1985'],
    ['mri', /\bMRI\b|cộng hưởng từ/i, 1976, 'ảnh MRI người đầu tiên (ngón tay) 1976; toàn thân 3/7/1977'],
    ['ct', /chụp CT|\bCT scan\b|cắt lớp vi tính/i, 1971, 'CT lâm sàng đầu tiên 1971'],
    ['chemo', /hóa trị/i, 1946, 'hóa trị liệu ung thư đầu tiên thập niên 1940'],
    ['transplant', /ghép (thận|gan|tim|tạng)/i, 1954, 'ghép thận thành công đầu tiên 1954'],
    ['atm', /\bATM\b|máy rút tiền/i, 1967, 'ATM đầu tiên 1967'],
    ['creditcard', /thẻ tín dụng/i, 1958, 'BankAmericard 1958'],
    ['laptop', /laptop|máy tính xách tay/i, 1981, 'Osborne 1 (1981)'],
    ['playstation', /playstation/i, 1994, 'PlayStation 1994'],
    ['xbox', /\bxbox\b/i, 2001, 'Xbox 2001'],
    ['lol', /liên minh huyền thoại|liên minh:|league of legends|tốc chiến/i, 2009, 'League of Legends 2009'],
    ['lienquan', /liên quân/i, 2016, 'Arena of Valor 2016'],
    ['battleroyale', /\bpubg\b|free fire/i, 2017, 'PUBG 2017, Free Fire 2017'],
    ['minecraft', /minecraft/i, 2009, 'Minecraft 2009 (bản alpha)'],
    ['esports', /e-?sports?\b|giải esports/i, 1997, 'giải Quake Red Annihilation 1997'],
    ['videogame', /trò chơi điện tử|chơi game|\bgame (?:online|thủ)\b/i, 1972, 'Pong/Odyssey 1972'],
    ['podcast', /podcast/i, 2004, 'podcast 2004'],
    ['spotify', /spotify/i, 2008, 'Spotify 2008'],
    ['fanculture', /fanmeeting|fan meeting|lightstick|\btrainee\b/i, 1996, 'văn hóa thần tượng hiện đại: H.O.T. ra mắt 1996'],
    ['videocall', /gọi video|video call|facetime|\bskype\b/i, 2003, 'Skype 2003'],
    ['kpop', /k-?pop|đu idol/i, 1996, 'K-pop hiện đại: H.O.T. 1996'],
    ['cctv', /camera (an ninh|giám sát|cho thấy|ghi lại|quan sát)|\bcctv\b/i, 1949, 'camera giám sát thương mại 1949'],
    ['appstore', /ứng dụng (cá cược|hẹn hò|gọi xe|giao hàng|ngân hàng|học|vay|ví|cảnh báo|di động|điện thoại)|(qua|trên|bằng) ứng dụng|\bAPI\b/i, 2008, 'App Store 2008'],
    ['netculture', /dân mạng|cư dân mạng|khắp mạng|đăng bài|bài đăng|nhóm chat/i, 1998, 'diễn đàn/phòng chat công cộng cuối thập niên 1990'],
    ['pc', /mở máy tính|bật máy tính|máy tính cá nhân|\bPC\b/, 1977, 'Apple II, TRS-80, PET 1977'],
    ['robotclub', /câu lạc bộ robot/i, 1990, 'câu lạc bộ robot học đường từ thập niên 1990'],
    ['msg', /tin nhắn|nhắn tin/i, 1992, 'tin nhắn văn bản SMS 1992'],
    ['ielts', /\bIELTS\b/, 1989, 'IELTS ra mắt 1989'],
    ['toefl', /\bTOEFL\b/i, 1964, 'TOEFL 1964'],
    ['app', /\bapp\b|app tín dụng|ứng dụng vay/i, 2008, 'App Store 2008'],
    ['viral', /clip (đã |được |lan truyền|viral)|video (lan truyền|viral)|lan truyền (khắp|trên) mạng|\bviral\b|triệu lượt xem/i, 2005, 'video lan truyền trên YouTube từ 2005'],
    ['followers', /người theo dõi|lượt xem|lượt thích|nút theo dõi|\bfollower|làm nội dung|kênh (của bạn|mãi|vẫn)/i, 2006, 'mạng xã hội và nền tảng video có số đo người theo dõi từ giữa thập niên 2000'],
    ['hashtag', /hashtag|\bselfie\b|sống ảo/i, 2007, 'hashtag 2007, selfie phổ biến 2010'],
    ['phoneuse', /trên điện thoại|xem điện thoại|chơi điện thoại|lướt điện thoại|điện thoại (của bạn|của mẹ|của bố) |quét điện thoại|điện thoại lén|gọi điện thoại di động/i, 1983, 'điện thoại di động cầm tay 1983'],
    ['moba', /\bMOBA\b|game chiến thuật đồng đội/i, 2009, 'MOBA hiện đại: League of Legends 2009'],
    ['khoi', /\bkhối [A-Z]\d{2}\b|tổ hợp (xét tuyển|môn)/i, 2009, 'mã khối A00, A01, D01… dùng khoảng 2009–2010'],
    ['doimoi', /Đổi Mới|thời kỳ đổi mới|những năm đầu Đổi mới|năm đầu Đổi mới/, 1986, 'Đổi mới được Đại hội VI quyết định 12/1986'],
    ['karaoke', /karaoke/i, 1971, 'karaoke ra đời ở Nhật Bản 1971'],
    ['talent_tv', /cuộc thi tìm kiếm giọng hát|tìm kiếm tài năng trên truyền hình|show (tìm kiếm|thực tế)|chương trình thực tế|truyền hình thực tế|gameshow|game show/i, 1950, 'trò chơi truyền hình (quiz show) xuất hiện cuối thập niên 1940–1950'],
    ['realityshow', /truyền hình thực tế|chương trình thực tế|reality show|cuộc thi tìm kiếm giọng hát|tìm kiếm tài năng/i, 1973, 'An American Family 1973 mở đầu truyền hình thực tế; Survivor/Big Brother 1997–2000'],
    ['atvncg', /anh trai vượt ngàn chông gai|anh trai ["“]?say hi/i, 2024, 'chương trình truyền hình thực tế phát sóng lần đầu năm 2024']
  ].map(function (t) { return { id: t[0], re: t[1], from: t[2], basis: t[3], ad: ADOPT[t[0]] || null }; });
  // Nghề không nhận ra được qua tên (năm đầu tiên nghề có thể tồn tại): tài xế công nghệ 2009 (Uber), quán net 1991, lập trình viên 1950, v.v.
  var JOB_FROM = { tx_cn: 2009, quan_net: 1994, kd_online: 1995, dev: 1950, data: 1960, fl_dev: 1960, fl_video: 1975, tuyen_thu_es: 1997, coach_es: 1997, caster_es: 1997, dau_tu_es: 1997, cay_thue: 2009, lua_dao: 1995, tiep_vien: 1930, kskl: 1930, phi_cong: 1914, ky_su_vu_tru: 1957, nc_y_sinh: 1940, telesale: 1960, tiem_dt: 1985, rapper: 1973, dj: 1935, shipper: 2010, streamer: 2011, youtuber: 2006, kol_live: 2016, fl_aff: 2012, nail: 1970, spa: 1975, pt_gym: 1975, nha_cai: 1995, scam_kh: 1995, stylist: 1950, fl_long_tieng: 1950, mc_tv: 1940, dau_tu_es: 1997 };
  var MAXFROM = Object.keys(JOB_FROM).reduce(function (m, k) { return Math.max(m, JOB_FROM[k]); }, TECH.reduce(function (m, t) { return Math.max(m, t.from); }, 0)), NONE = [], cache = {}, stats = { text: 0, scene: 0, opts: 0, job: 0, act: 0 };
  // 9.5.5: tình huống cả khái niệm là hiện đại (văn hóa fan, mạng xã hội, cuộc thi truyền hình, nghề làm móng…) — không xảy ra trước năm này; nước ghi riêng thì dùng năm riêng
  var ID_FROM = [
    [/^(kpop|am_fan_cuong|scout155|sb_hop_dong_no_le)$/, 1996], [/^fan_san_bay$/, 1990], [/^show_rap$/, 1980], [/^am_clip_lan_truyen$/, 2005], [/^(creator_nghi|brand105_offer)$/, 2006], [/^(mxh_|cn_mang_xa_hoi)/, 2006],
    [/^sb_tao_phot$/, 1995], [/^sv_vay$/, 2012], [/^choi_game_nha$/, 1972], [/^chon_game$/, 2009], [/^am_thi_truyen_hinh$/, 1983, { VN: 2000 }], [/^db_cuoc_thi$/, 1990, { VN: 2010 }], [/^hh_moi$/, 1965, { VN: 2008 }],
    [/^spa_tham_my_chui$/, 1990], [/^(dk_nail|nail_hoa_chat|dk_nail_nho)/, 1970, { VN: 1990 }], [/^nv_dien_thoai$/, 1995], [/^xkld/, 1960, { VN: 1992 }], [/^hx_karaoke$/, 1971, { VN: 1995 }],
    [/^lg_pride$/, 1970], [/^dk_ship$/, 2010], [/^dk_bar_nho$/, 1975], [/^mc_dan_lon$/, 1950], [/^(streamer|kol_|live_)/, 2011]
  ];
  var ID_MAX = ID_FROM.reduce(function (m, x) { return Math.max(m, x[1], x[2] ? Math.max.apply(null, Object.keys(x[2]).map(function (k) { return x[2][k]; })) : 0); }, 0);
  function residence(l) { return l && (l.country || l.abroad && l.abroad.code) ? E.H.resCode(l) : null; }
  function idBlocked(id, l) {
    var y = worldYear(l);
    if (typeof id !== 'string') return false;
    if (/^(sixth829|gcse857|schoolEngland829|ukAlevelIb850)$/.test(id) && y < 2017) return true;
    if (y >= ID_MAX) return false;
    var cc = residence(l);
    for (var i = 0; i < ID_FROM.length; i++) if (ID_FROM[i][0].test(id)) { var from = ID_FROM[i][2] && ID_FROM[i][2][cc] != null ? ID_FROM[i][2][cc] : ID_FROM[i][1]; if (y < from) { stats.id = (stats.id || 0) + 1; return true; } }
    return false;
  }
  function worldYear(l) { return l && l.birthYear != null ? l.birthYear + (l.age || 0) : 9999; }
  function localAt(l, y) { var cc = residence(l); return cc && E.ERA920 && y >= E.ERA920.FROM && y <= E.ERA920.TO ? E.ERA920.at(cc, y) : null; }
  var ADO = {};
  function activeFor(l) {
    var y = worldYear(l), g = activeAt(y), a = localAt(l, y); if (!a) return g;
    var k = residence(l) + ':' + y, c = ADO[k]; if (c) return c;
    var extra = TECH.filter(function (t) { return t.ad && y >= t.from && !(a[t.ad[0]] >= t.ad[1]); });
    return (ADO[k] = extra.length ? g.concat(extra) : g);
  }
  function activeAt(y) { if (y >= MAXFROM) return NONE; return cache[y] || (cache[y] = TECH.filter(function (t) { return y < t.from; })); }
  function firstHit(act, s) { for (var i = 0; i < act.length; i++) if (act[i].re.test(s)) return act[i]; return null; }
  function anachronism(l, s) { var a = activeFor(l); return a.length && typeof s === 'string' && s ? firstHit(a, s) : null; }
  // Thay từ theo thời đại (giữ nội dung tình cảm thay vì bỏ câu): [nhận diện, năm hết hiệu lực, thay thế theo năm].
  function caseLike(src, w) { return src.charAt(0) !== src.charAt(0).toLowerCase() ? w.charAt(0).toUpperCase() + w.slice(1) : w; }
  var SUBS = [
    { re: /nhắn tin/gi, to: 2024, f: function (y, l) { var a = localAt(l, y); if (a ? (a.mobile >= 3 || a.internet >= 1) : y >= 1992) return null; return (a ? a.fixed >= 0.5 : y >= 1960) ? 'gọi điện' : 'viết thư'; } },
    { re: /tin nhắn/gi, to: 2024, f: function (y, l) { var a = localAt(l, y); if (a ? (a.mobile >= 3 || a.internet >= 1) : y >= 1992) return null; return (a ? a.fixed >= 0.5 : y >= 1960) ? 'lời nhắn' : 'lá thư'; } },
    { re: /gọi video/gi, to: 2024, f: function (y, l) { var a = localAt(l, y); if (a ? a.internet >= 3 : y >= 2003) return null; return (a ? a.fixed >= 0.5 : y >= 1960) ? 'gọi điện' : 'viết thư'; } }
  ];
  var SUBS_TO = SUBS.reduce(function (m, x) { return Math.max(m, x.to); }, 0);
  function substitute(l, s) {
    var y = worldYear(l); if (y >= SUBS_TO || typeof s !== 'string') return s;
    for (var i = 0; i < SUBS.length; i++) if (y < SUBS[i].to) s = s.replace(SUBS[i].re, function (m) { var w = SUBS[i].f(y, l); return w == null ? m : caseLike(m, w); });
    return s;
  }
  // Cắt các câu sai thời. Trả về chuỗi mới; null khi là dòng nhật ký và không còn gì; giữ nguyên bản gốc khi là văn bản cảnh mà câu nào cũng sai thời.
  function clean(l, s, isLog) {
    if (typeof s !== 'string' || !s) return s;
    s = substitute(l, s);
    var a = activeFor(l); if (!a.length || !firstHit(a, s)) return s;
    var removed = 0, lines = s.split('\n').map(function (line) {
      if (!firstHit(a, line)) return line;
      var parts = line.replace(/([.!?…]+)\s+/g, '$1\u0001').split('\u0001'), keep = parts.filter(function (p) { return !firstHit(a, p); });
      removed += parts.length - keep.length; return keep.join(' ');
    });
    var out = lines.join('\n').replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
    if (!out) return isLog ? null : s;
    if (removed) stats.text++;
    return out;
  }
  // --- 1. đường lời kể và văn bản cảnh có sẵn: E.famLogic (isLog=true cho nhật ký, false cho văn bản cảnh / nhãn hành động) ---
  var famLogic0 = E.famLogic;
  E.famLogic = function (l, t, isLog) {
    var u = clean(l, t, !!isLog); if (u == null) return null;
    return famLogic0 ? famLogic0.call(this, l, u, isLog) : u;
  };
  // --- 2. cảnh: cắt lựa chọn sai thời, bỏ cả cảnh nếu cốt lõi sai thời ---
  function refine(l, dec) {
    var a = activeFor(l); if (!a.length || !dec || typeof dec !== 'object') return dec;
    if (typeof dec.title === 'string') dec.title = substitute(l, dec.title);
    if (typeof dec.text === 'string') dec.text = substitute(l, dec.text);
    if (Array.isArray(dec.opts)) dec.opts.forEach(function (o) { if (o) { if (typeof o.l === 'string') o.l = substitute(l, o.l); if (typeof o.h === 'string') o.h = substitute(l, o.h); } });
    var skip = false, opts = Array.isArray(dec.opts) ? dec.opts : [];
    if (typeof dec.title === 'string' && firstHit(a, dec.title)) skip = true;
    var keep = opts.filter(function (o) { return !firstHit(a, String(o.l || '') + ' ' + String(o.h || '')); });
    if (keep.length < opts.length) { stats.opts += opts.length - keep.length; dec.opts = keep; if (!keep.length) skip = true; }
    if (typeof dec.text === 'string' && firstHit(a, dec.text)) {
      var t2 = clean(l, dec.text, false); if (t2 === dec.text) skip = true; else dec.text = t2; // câu nào cũng sai thời
    }
    if (skip) { dec.data = dec.data || {}; dec.data.eraSkip = true; stats.scene++; }
    return dec;
  }
  function wrapDec(id) {
    var d = E.DEC[id]; if (!d || d.__era902) return; d.__era902 = true;
    var mk = d.make; if (typeof mk === 'function') d.make = function () { return refine(arguments[0], mk.apply(this, arguments)); };
    var v = d.valid; d.valid = function (l, data) { if (data && data.eraSkip) return false; if (idBlocked(id, l)) return false; return typeof v === 'function' ? v.apply(this, arguments) : true; };
  }
  Object.keys(E.DEC).forEach(wrapDec);
  // không đưa vào hàng chờ: tình huống sai thời không chiếm chỗ của tình huống đúng thời
  E.TRIG.forEach(function (t) { if (t.__era902id) return; t.__era902id = true; var w = t.when; t.when = function (l, a) { return !idBlocked(t.id, l) && w.apply(this, arguments); }; });
  var SC0 = E.SC; if (typeof SC0 === 'function') E.SC = function (id) { var r = SC0.apply(this, arguments); wrapDec(id); return r; };
  // --- 3. nghề chưa tồn tại: careers.js gọi trước khi nhận việc ---
  function jobBlocked(l, id, c) {
    var y = worldYear(l); if (y >= MAXFROM && !(E.ERA920 && y <= E.ERA920.TO)) return false;
    if (JOB_FROM[id] && y < JOB_FROM[id]) { stats.job++; return true; }
    var a = activeFor(l); if (!a.length) return false;
    var s = String(id) + ' ' + ((c && c.t) || []).join(' ') + ' ' + ((c && c.prod) || []).join(' ');
    if (firstHit(a, s)) { stats.job++; return true; } return false;
  }
  // --- 4. hành động chủ động ---
  var actions0 = E.actions; if (typeof actions0 === 'function') E.actions = function (l) { var out = actions0.apply(this, arguments); if (!activeFor(l).length) return out; return out.filter(function (x) { if (firstHit(activeFor(l), x.l || '')) { stats.act++; return false; } return true; }); };
  E.ERA902 = { ID_FROM: ID_FROM, idBlocked: idBlocked, YEAR_MIN: YEAR_MIN, ADOPT: ADOPT, activeFor: activeFor, TECH: TECH, JOB_FROM: JOB_FROM, MAXFROM: MAXFROM, substitute: substitute, worldYear: worldYear, activeAt: activeAt, anachronism: anachronism, clean: clean, refine: refine, jobBlocked: jobBlocked, stats: stats };
  if (E.ERA917) E.ERA917.tech = E.ERA902; // gắn vào khung thời đại có sẵn
})(globalThis.G);
