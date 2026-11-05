/* Một Đời — 8.10.47: Đào tạo người kế vị Thụy Điển, tuổi thơ & bảo mẫu đa ngôn ngữ, trường nội trú quý tộc,
   an ninh/di chuyển tách biệt, mạng xã hội hoàng gia, thay đổi danh hiệu bạn đời và nghi thức chào mừng em bé chào đời
   theo từng quốc gia (GB, SE, NO, DK, BE, ES, MC) có xét sinh đơn/đôi/ba/tư, sinh thường/sinh mổ, đèn màu danh thắng,
   đại bác chào mừng, chụp ảnh và lễ rửa tội hai bên nội ngoại. Mở rộng ROYAL920, ROYAL837, GENETICS912, FAITH830. */
(function (G) {
  'use strict';
  var E = G.E, R = E.ROYAL920, A = E.ROYAL837, H = E.H, U = G.U, X = E.UPDATE110, F = E.FAITH830;
  if (!R || !A || !X) return;

  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); h ^= h >>> 16; return h >>> 0; }
  function u(seed) { return hash(seed) / 4294967296; }
  function rng(seed) { var a = hash(seed) || 1; return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function yr(l) { return l.birthYear + l.age; }

  // ================= 1. Ngôn ngữ & Bảo mẫu theo quốc gia =================
  var NANNY_LANG = {
    GB: { native: 'Tiếng Anh', regional: 'Tiếng Wales (Cymraeg)', foreign: ['Tiếng Tây Ban Nha', 'Tiếng Pháp', 'Tiếng Đức'] },
    SE: { native: 'Tiếng Thụy Điển', regional: 'Tiếng Bắc Âu (Đan Mạch / Na Uy)', foreign: ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức'] },
    DK: { native: 'Tiếng Đan Mạch', regional: 'Tiếng Thụy Điển & Na Uy (Bắc Âu)', foreign: ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức'] },
    NO: { native: 'Tiếng Na Uy', regional: 'Tiếng Thụy Điển & Đan Mạch (Bắc Âu)', foreign: ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức'] },
    BE: { native: 'Tiếng Hà Lan / Pháp / Đức', regional: 'Ba ngôn ngữ quốc gia Bỉ (Hà Lan, Pháp, Đức)', foreign: ['Tiếng Anh', 'Tiếng Tây Ban Nha'] },
    ES: { native: 'Tiếng Tây Ban Nha', regional: 'Ngôn ngữ vùng Tây Ban Nha', foreign: ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức'] },
    MC: { native: 'Tiếng Pháp', regional: 'Tiếng Monégasque', foreign: ['Tiếng Anh', 'Tiếng Ý', 'Tiếng Đức'] }
  };
  var ARTS_SPORTS = [
    ['polo', 'Cưỡi ngựa & chơi Polo', 'sport', 'Rèn kỹ năng cưỡi ngựa và phối hợp đồng đội trên sân cỏ.'],
    ['ballet', 'Múa ba lê cổ điển', 'dance', 'Rèn tư thế uyển chuyển, kỷ luật hình thể và cảm thụ âm nhạc.'],
    ['archery', 'Bắn cung', 'sport', 'Tập trung sự điềm tĩnh, chuẩn xác và kiểm soát nhịp thở.'],
    ['sailing', 'Đua thuyền buồm', 'sport', 'Học điều khiển buồm, đọc gió và phối hợp thủy thủ đoàn.'],
    ['ballroom', 'Khiêu vũ cung đình', 'dance', 'Tập valse và các điệu khiêu vũ nghi lễ cho dạ tiệc quốc gia.'],
    ['tea', 'Nghệ thuật thưởng trà & tiếp khách', 'etiquette', 'Học quy tắc bàn trà, trò chuyện lịch thiệp và lắng nghe khách quý.'],
    ['chess', 'Đánh cờ chiến thuật', 'kno', 'Rèn tư duy chiến lược, tính kiên nhẫn và phân tích tình huống.'],
    ['harp', 'Đàn Harp (đàn hạc)', 'instrument', 'Luyện ngón đàn thanh nhã, biểu diễn trong không gian thính phòng.'],
    ['painting', 'Hội họa & ký họa', 'draw', 'Quan sát thiên nhiên, kiến trúc và vẽ màu nước, sơn dầu.'],
    ['poetry', 'Thơ ca & văn chương cổ điển', 'kno', 'Đọc hiểu thi ca, lịch sử văn hóa và rèn cách diễn đạt trang trọng.']
  ];
  var BOARDING = {
    GB: { M: ['Eton College (khu nội trú nam)', 'Gordonstoun (nội trú rèn thể chất & kỷ luật)', 'Wellington College'], F: ['Marlborough College (khu nữ sinh)', 'Benenden School (trường nội trú nữ quý tộc)', 'Gordonstoun'] },
    SE: { M: ['Lundbergs Skola (nội trú truyền thống Thụy Điển)', 'Sigtunaskolan Humanistiska Läroverket (SSHL)'], F: ['Sigtunaskolan Humanistiska Läroverket (SSHL)', 'Enskilda Gymnasiet (chương trình nội trú/bán trú Stockholm)'] },
    DK: { M: ['Herlufsholm Kostskole (khu nam sinh)', 'Sorø Akademi'], F: ['Herlufsholm Kostskole (khu nữ sinh)', 'Sorø Akademi'] },
    NO: { M: ['Kongshavn / trường nội trú Bắc Âu', 'UWC Red Cross Nordic'], F: ['Kongshavn / trường nội trú Bắc Âu', 'UWC Red Cross Nordic'] },
    ES: { M: ['Colegio Santa María de los Rosales / nội trú quý tộc', 'UWC Atlantic'], F: ['Colegio Santa María de los Rosales / nội trú quý tộc', 'UWC Atlantic'] },
    BE: { M: ['Sint-Jan Berchmanscollege (Brussels)', 'Collège Cardinal Mercier'], F: ['Sint-Jan Berchmanscollege (Brussels)', 'Institut Vierge Fidèle'] },
    MC: { M: ['Institution François d’Assise – Nicolas Barré', 'Institut Le Rosey (Thụy Sĩ)'], F: ['Institution François d’Assise – Nicolas Barré', 'Institut Le Rosey (Thụy Sĩ)'] }
  };

  function upState(l, m) {
    var ps = A.personState(l, m);
    if (!ps.upbringing847) {
      var c = m.country837 || (A.context(l) && A.context(l).c) || 'GB', cfg = NANNY_LANG[c] || NANNY_LANG.GB, rr = rng(l.id + ':nanny847:' + m.id);
      var f1 = cfg.foreign[Math.floor(rr() * cfg.foreign.length)], f2 = cfg.foreign[(Math.floor(rr() * cfg.foreign.length) + 1) % cfg.foreign.length];
      ps.upbringing847 = {
        nannyCount: 1, // ít nhưng chất lượng
        nannyOrigin: f1.replace('Tiếng ', ''),
        langs: [cfg.native],
        targetLangs: Array.from(new Set([cfg.native, cfg.regional, f1, f2].concat(c === 'SE' ? ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức'] : []))),
        autonomy: 15,
        publicDuties: 0,
        separateTravel: false,
        boarding: null,
        arts: {},
        friends: [],
        security: { guards: (R.lineOf(l, R.house(l, c), m) || 99) <= 3 ? 4 : 2, boundaryRule: true, nordicSimple: ['SE', 'NO', 'DK'].includes(c) },
        social: { officialManagedByTeam: true, cloneHandle: null, cloneStyle: 'hidden', approvedByParents: false, leaks: 0 },
        swedenTrack: c === 'SE' ? { domesticOnly: true, riksdag: 0, ud: 0, unIntern: null, milBasic: false, milBranches: { army: false, navy: false, air: false }, supremeRank: false } : null,
        acted: {}
      };
    }
    return ps.upbringing847;
  }

  // ================= 2. Danh hiệu khi đăng quang / lên chức người kế vị & bạn đời =================
  var CONSORT_TITLES = {
    GB: {
      sovereign: { F: 'Hoàng hậu (Queen Consort) · Bệ hạ', M: 'Hoàng thân Phối ngẫu (Prince Consort) · Điện hạ' },
      heir: { F: 'Vương phi xứ Wales (Princess of Wales) · Điện hạ', M: 'Phối ngẫu Vương nữ Kế vị · Điện hạ' },
      direct: { F: 'Nữ Công tước / Vương phi Hoàng gia · Điện hạ', M: 'Phối ngẫu Công chúa Hoàng gia' }
    },
    SE: {
      sovereign: { F: 'Hoàng hậu Thụy Điển (Drottning) · Bệ hạ', M: 'Hoàng thân Phối ngẫu Thụy Điển · Điện hạ' },
      heir: { F: 'Thái tử phi Thụy Điển (Kronprinsessa) · Điện hạ', M: 'Hoàng thân Thụy Điển, Công tước xứ Västergötland · Điện hạ' },
      direct: { F: 'Công nương Thụy Điển · Điện hạ', M: 'Hoàng thân / Phối ngẫu Hoàng gia Thụy Điển' }
    },
    NO: {
      sovereign: { F: 'Hoàng hậu Na Uy (Dronning) · Bệ hạ', M: 'Hoàng thân Phối ngẫu Na Uy · Điện hạ' },
      heir: { F: 'Thái tử phi Na Uy (Kronprinsesse) · Điện hạ', M: 'Phối ngẫu Thái nữ Na Uy · Điện hạ' },
      direct: { F: 'Công nương Na Uy', M: 'Phối ngẫu Công chúa Na Uy' }
    },
    DK: {
      sovereign: { F: 'Hoàng hậu Đan Mạch (Dronning) · Bệ hạ', M: 'Hoàng thân Phối ngẫu Đan Mạch (Prinsgemål) · Điện hạ' },
      heir: { F: 'Thái tử phi Đan Mạch (Kronprinsesse) · Điện hạ', M: 'Hoàng thân Đan Mạch (Prins) · Điện hạ' },
      direct: { F: 'Công nương Đan Mạch · Điện hạ', M: 'Bá tước / Phối ngẫu Hoàng gia Đan Mạch' }
    },
    BE: {
      sovereign: { F: 'Hoàng hậu Bỉ (Koningin / Reine / Königin) · Bệ hạ', M: 'Hoàng thân Phối ngẫu Bỉ · Điện hạ' },
      heir: { F: 'Nữ Công tước xứ Brabant (Phối ngẫu) · Điện hạ', M: 'Hoàng thân Bỉ, Công tước xứ Brabant (Phối ngẫu) · Điện hạ' },
      direct: { F: 'Công nương Bỉ · Điện hạ', M: 'Hoàng thân / Phối ngẫu Hoàng gia Bỉ' }
    },
    ES: {
      sovereign: { F: 'Reina consorte · Bệ hạ', M: 'Príncipe consorte · Điện hạ' },
      heir: { F: 'Princesa de Asturias (consorte) · Điện hạ', M: 'Consorte de la Princesa de Asturias · Điện hạ' },
      direct: { F: 'Phối ngẫu Infante de España', M: 'Phối ngẫu Infanta de España' }
    },
    MC: {
      sovereign: { F: 'Thân vương phi Monaco (Princesse de Monaco) · Điện hạ', M: 'Phối ngẫu Nữ Thân vương Monaco · Điện hạ' },
      heir: { F: 'Hầu tước phu nhân xứ Baux · Điện hạ', M: 'Phối ngẫu Hầu tước xứ Baux' },
      direct: { F: 'Phối ngẫu Vương thất Monaco', M: 'Phối ngẫu Vương thất Monaco' }
    }
  };
  var HEIR_TITLES = {
    GB: { M: 'Thân vương xứ Wales (Prince of Wales) · Điện hạ', F: 'Vương nữ Kế vị (Princess of Wales / Heir Apparent) · Điện hạ' },
    SE: { M: 'Thái tử Thụy Điển (Kronprins) · Điện hạ', F: 'Thái nữ Thụy Điển (Kronprinsessa) · Điện hạ' },
    NO: { M: 'Thái tử Na Uy (Kronprins) · Điện hạ', F: 'Thái nữ Na Uy (Kronprinsesse) · Điện hạ' },
    DK: { M: 'Thái tử Đan Mạch (Kronprins) · Điện hạ', F: 'Thái nữ Đan Mạch (Kronprinsesse) · Điện hạ' },
    BE: { M: 'Hoàng tử Bỉ, Công tước xứ Brabant · Điện hạ', F: 'Công chúa Bỉ, Nữ Công tước xứ Brabant · Điện hạ' },
    ES: { M: 'Príncipe de Asturias · Điện hạ', F: 'Princesa de Asturias · Điện hạ' },
    MC: { M: 'Thế tử Monaco, Hầu tước xứ Baux · Điện hạ', F: 'Thế nữ Monaco, Nữ Hầu tước xứ Baux · Điện hạ' }
  };
  var SOVEREIGN_SUPREME_MIL = {
    SE: 'Đại tướng / Đô đốc Tối cao Ba Quân chủng (Lục quân, Hải quân, Không quân Thụy Điển)',
    GB: 'Tổng Tư lệnh Tối cao Các Lực lượng Vũ trang Anh',
    NO: 'Tổng Tư lệnh Tối cao Quân đội Na Uy',
    DK: 'Tổng Tư lệnh Tối cao Lực lượng Vũ trang Đan Mạch',
    BE: 'Tổng Tư lệnh Các Lực lượng Vũ trang Bỉ',
    ES: 'Tổng Tư lệnh Tối cao (Capitán General) Lực lượng Vũ trang Tây Ban Nha'
  };

  function syncTitles(l, h, newSov, oldSov, log) {
    if (!h || !A.COUNTRIES.includes(h.cc)) return;
    var line = R.order(l, h), heir = line[0], c = h.cc;
    h.members.forEach(function (m) {
      m.heirApparent847 = m === heir;
      if (m.id === h.seat) {
        m.supremeCommander847 = SOVEREIGN_SUPREME_MIL[c] || 'Nguyên thủ Quốc gia';
        var up = upState(l, m);
        if (up.swedenTrack) up.swedenTrack.supremeRank = true;
      }
      if (c === 'GB' && m === heir && !(m.titles || []).some(function (t) { return t.key === 'wales' && !t.lost; })) {
        R.grant(m, 'wales', 'substantive', false, 'phong cho người đứng đầu hàng kế vị', yr(l));
      }
      var sp = m.spouse && R.byId(h, m.spouse);
      if (sp) {
        var roleTier = m.id === h.seat ? 'sovereign' : m === heir ? 'heir' : 'direct';
        var tbl = CONSORT_TITLES[c] || CONSORT_TITLES.GB;
        var nextStyle = tbl[roleTier] && tbl[roleTier][sp.sex] || tbl.direct[sp.sex];
        var prevStyle = sp.consortStyle847;
        sp.consortStyle847 = nextStyle;
        sp.consortTier847 = roleTier;
        if (roleTier === 'sovereign') R.grant(sp, 'consort', 'courtesy', false, 'phối ngẫu của người trị vì khi đăng quang', yr(l));
        if (prevStyle && prevStyle !== nextStyle && log) {
          log('Khi ' + m.name + (roleTier === 'sovereign' ? ' lên ngôi' : ' trở thành người kế vị số 1') + ', danh hiệu của bạn đời ' + sp.name + ' được cập nhật thành: ' + nextStyle + '.', 'neutral');
        }
      }
    });
    // Nếu người chơi kết hôn với thành viên hoàng gia hoặc là quân vương/người kế vị có l.partner
    var me = R.byId(h, 'player');
    if (me && l.partner && l.partner.status === 'married' && !me.spouse) {
      var roleTier2 = h.seat === 'player' ? 'sovereign' : heir === me ? 'heir' : 'direct';
      var tbl2 = CONSORT_TITLES[c] || CONSORT_TITLES.GB;
      var nextPartnerTitle = tbl2[roleTier2] && tbl2[roleTier2][l.partner.sex] || tbl2.direct[l.partner.sex];
      if (l.partner.royalConsortTitle847 !== nextPartnerTitle) {
        var had = l.partner.royalConsortTitle847;
        l.partner.royalConsortTitle847 = nextPartnerTitle;
        if (had && log) log('Danh hiệu chính thức của bạn đời ' + l.partner.name + ' thay đổi theo vị trí kế vị/nhiệm vụ mới: ' + nextPartnerTitle + '.', 'good');
      }
    }
  }

  var oldWedding837 = A.wedding;
  A.wedding = function (l, r, log, mode) {
    var ok = oldWedding837.apply(this, arguments);
    var q = A.context(l);
    if (q && q.h) syncTitles(l, q.h, R.byId(q.h, q.h.seat), null, log);
    return ok;
  };

  var oldTitle837 = A.title;
  A.title = function (m) {
    if (!m) return null;
    var c = m.country837;
    if (m.consortStyle847 && (m.role === 'consort' || m.role === 'spouse')) return m.consortStyle847;
    if (c === 'ES') return oldTitle837(m);
    var active = (m.titles || []).filter(function (t) { return !t.lost; });
    if (active.some(function (t) { return t.key === 'sovereign'; })) {
      if (c === 'SE') return (m.sex === 'F' ? 'Nữ hoàng Thụy Điển (Drottning)' : 'Quốc vương Thụy Điển (Konung)') + ' · Bệ hạ';
      if (c === 'NO') return (m.sex === 'F' ? 'Nữ hoàng Na Uy' : 'Quốc vương Na Uy') + ' · Bệ hạ';
      if (c === 'DK') return (m.sex === 'F' ? 'Nữ hoàng Đan Mạch' : 'Quốc vương Đan Mạch') + ' · Bệ hạ';
      if (c === 'BE') return (m.sex === 'F' ? 'Nữ hoàng của người Bỉ' : 'Quốc vương của người Bỉ') + ' · Bệ hạ';
      if (c === 'MC') return (m.sex === 'F' ? 'Nữ Thân vương Monaco' : 'Thân vương Monaco') + ' · Điện hạ';
    }
    if (m.heirApparent847 && HEIR_TITLES[c] && !active.some(function (t) { return t.key === 'sovereign'; })) {
      return HEIR_TITLES[c][m.sex];
    }
    return oldTitle837(m);
  };

  // ================= 3. Chương trình đào tạo người kế vị Thụy Điển & Bắc Âu =================
  X.menu('royalSwedenTrack847', 'Chương trình đào tạo Người kế vị & Quân sự – Ngoại giao (Thụy Điển)', function (l) {
    var q = A.context(l);
    if (X.reason(l, 14) !== true) return X.reason(l, 14);
    return q && q.c === 'SE' && q.me ? true : 'Dành cho thành viên Hoàng gia Thụy Điển từ 14 tuổi';
  }, function (l) {
    var q = A.context(l), up = upState(l, q.me), sw = up.swedenTrack;
    var pos = R.lineOf(l, q.h, q.me);
    return 'Hiến pháp Thụy Điển quy định người thừa kế học tập trong nước (không du học dài hạn làm mất điều kiện cư trú), chương trình cá nhân hóa tối đa để chuẩn bị vai trò nguyên thủ quốc gia.\n' +
      '• Vị trí hiện tại: ' + (q.h.seat === q.me.id ? 'Quốc vương/Nữ hoàng đương nhiệm · ' + (q.me.supremeCommander847 || SOVEREIGN_SUPREME_MIL.SE) : pos ? 'Thứ ' + pos + ' trong hàng kế vị' : 'Thành viên hoàng gia') + '.\n' +
      '• Quân sự toàn diện (Lục quân, Hải quân, Không quân): ' + [sw.milBranches.army ? 'Lục quân ✓' : 'Lục quân ○', sw.milBranches.navy ? 'Hải quân ✓' : 'Hải quân ○', sw.milBranches.air ? 'Không quân ✓' : 'Không quân ○'].join(' · ') + (sw.supremeRank ? ' · Đã giữ cấp bậc tối cao 3 quân chủng.' : '') + '\n' +
      '• Hiến pháp & Quốc hội (Riksdag): ' + sw.riksdag + '/100 · Bộ Ngoại giao (UD): ' + sw.ud + '/100' + (sw.unIntern ? ' · Thực tập ngắn hạn: ' + sw.unIntern.where + ' (' + sw.unIntern.status + ')' : '') + '.\n' +
      '• Ngôn ngữ đã thành thạo: ' + up.langs.join(', ') + ' (mục tiêu: Thụy Điển, Anh, Pháp, Đức).';
  }, function (l) {
    var q = A.context(l); if (!q || !q.me) return [];
    var ps = A.personState(l, q.me), up = upState(l, q.me), sw = up.swedenTrack, out = [];
    function row(k, label, min, run, why) {
      if (l.age < min) return;
      out.push({ k: k, l: label, why: why || up.acted[k] === yr(l) ? why || 'Đã thực hiện năm nay' : true, run: function (l, r, log) { if (up.acted[k] === yr(l)) return; up.acted[k] = yr(l); run(r, log); } });
    }
    row('mil_basic', 'Nghĩa vụ quân sự cơ bản, chiến thuật sinh tồn & cấu trúc phòng thủ quốc gia', 18, function (r, log) {
      sw.milBasic = true; sw.milBranches.army = true; ps.prepared = Math.min(100, ps.prepared + 8); H.fx(l, { hea: 3, kno: 2 });
      log('Bạn hoàn thành kỳ huấn luyện quân sự cơ bản và chiến thuật sinh tồn tại Thụy Điển: rèn luyện thể lực, cấu trúc phòng thủ tổng lực cùng các học viên trong nước.', 'good');
    }, sw.milBasic ? 'Đã hoàn thành khóa cơ bản' : null);
    row('mil_officers', 'Khóa đào tạo sĩ quan tại Học viện Phòng vệ Thụy Điển (Lục quân, Hải quân, Không quân)', 19, function (r, log) {
      if (!sw.milBranches.army) sw.milBranches.army = true;
      else if (!sw.milBranches.navy) sw.milBranches.navy = true;
      else sw.milBranches.air = true;
      ps.prepared = Math.min(100, ps.prepared + 10); H.fx(l, { hea: 2, kno: 3 });
      if (sw.milBranches.army && sw.milBranches.navy && sw.milBranches.air && l.flags.royal) l.flags.royal.mil = true;
      log('Bạn tham gia khóa sĩ quan chuyên sâu tại Học viện Phòng vệ Quốc gia Thụy Điển (Försvarshögskolan), nắm vững phối hợp ba quân chủng Lục quân, Hải quân và Không quân để chuẩn bị cho vai trò nguyên thủ tương lai.', 'good');
    }, !sw.milBasic ? 'Cần hoàn thành kỳ nghĩa vụ quân sự cơ bản trước' : (sw.milBranches.army && sw.milBranches.navy && sw.milBranches.air ? 'Đã hoàn thành đủ 3 quân chủng' : null));
    row('riksdag', 'Học sâu về Hiến pháp Thụy Điển, Quốc hội (Riksdag) và quan hệ Hoàng gia – Chính phủ', 16, function (r, log) {
      sw.riksdag = Math.min(100, sw.riksdag + 25); ps.constitution = Math.min(100, ps.constitution + 12); ps.prepared = Math.min(100, ps.prepared + 6); H.fx(l, { kno: 3 });
      log('Bạn học chuyên đề với các học giả hiến pháp và quan sát hoạt động của Quốc hội (Riksdag): người kế vị không học chính trị để tranh cử, mà để hiểu cách vận hành đất nước và giữ vai trò nguyên thủ lập hiến trung lập.', 'good');
    });
    row('ud_diplomacy', 'Khóa đào tạo đặc biệt tại Bộ Ngoại giao Thụy Điển (UD) về đối ngoại, an ninh & thương mại', 18, function (r, log) {
      sw.ud = Math.min(100, sw.ud + 25); ps.prepared = Math.min(100, ps.prepared + 8); H.fx(l, { kno: 3, soc: 2 });
      log('Bạn tham gia chương trình đào tạo của Bộ Ngoại giao Thụy Điển (Utrikesdepartementet): phân tích chính sách đối ngoại, an ninh toàn cầu và thương mại quốc tế.', 'good');
    });
    row('un_embassy', 'Thực tập ngắn hạn tại Liên Hợp Quốc (UN) hoặc Đại sứ quán Thụy Điển ở nước ngoài', 20, function (r, log) {
      var where = r() < 0.5 ? 'Phái đoàn Thụy Điển tại Liên Hợp Quốc (UN)' : 'Đại sứ quán Thụy Điển ở nước ngoài';
      sw.unIntern = { where: where, year: yr(l), duration: 'ngắn hạn trong năm (tuân thủ quy định cư trú trong nước của Hiến pháp)', status: 'hoàn thành' };
      ps.prepared = Math.min(100, ps.prepared + 9); H.fx(l, { kno: 3, soc: 3 });
      log('Bạn được gửi đi thực tập ngắn hạn tại ' + where + '. Thời gian được thu xếp chặt chẽ để tích lũy kinh nghiệm ngoại giao đa phương mà không vi phạm quy định cư trú và học tập trong nước.', 'good');
    }, sw.ud < 25 ? 'Cần học khóa cơ sở tại Bộ Ngoại giao (UD) trước' : null);
    row('langs_eu', 'Rèn luyện đa ngôn ngữ châu Âu (Anh, Pháp, Đức) & lịch sử huyết thống hoàng gia', 14, function (r, log) {
      ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức'].forEach(function (lg) { if (!up.langs.includes(lg)) up.langs.push(lg); });
      E.LIFE138.skill(l, 'language').level = Math.min(100, E.LIFE138.skill(l, 'language').level + 12);
      ps.protocol = Math.min(100, ps.protocol + 6); H.fx(l, { kno: 3 });
      log('Ngoài tiếng Thụy Điển, bạn rèn thành thạo tiếng Anh, tiếng Pháp và tiếng Đức để giao tiếp trực tiếp với các hoàng tộc châu Âu có quan hệ huyết thống lâu đời.', 'good');
    });
    return out;
  }, 14, 'Học tập');

  // ================= 4. Tuổi thơ, Bảo mẫu, Trường nội trú, Nghệ thuật, An ninh & Mạng xã hội =================
  X.menu('royalUpbringing847', 'Bảo mẫu đa ngôn ngữ, trường nội trú, nghệ thuật & đời sống kín đáo', function (l) {
    var q = A.context(l);
    if (X.reason(l, 4) !== true) return X.reason(l, 4);
    return A.managed(l) && q && q.me ? true : 'Dành cho thành viên hoàng gia được mô phỏng';
  }, function (l) {
    var q = A.context(l), up = upState(l, q.me), cfg = NANNY_LANG[q.c] || NANNY_LANG.GB;
    var pos = R.lineOf(l, q.h, q.me) || 99;
    var travelNote = l.age < 7 ? 'Đang dưới 7 tuổi: còn đi chung xe/máy bay với cha mẹ trong các chuyến đi gia đình.' : (pos <= 3 || up.separateTravel ? 'Từ 7–8 tuổi trở lên (nhánh kế vị trực tiếp): bắt buộc tách xe chở riêng / máy bay riêng với người trị vì và người kế vị khác để bảo đảm an toàn danh sách kế vị.' : 'Đi lại có đội hộ tống theo quy chuẩn hoàng gia.');
    return '• Bảo mẫu hoàng gia: số lượng ít nhưng chất lượng cao (người châu Âu giúp học tự nhiên ' + cfg.foreign.join(', ') + '; đặc thù ' + q.c + ' học thêm ' + cfg.regional + '). Mức tự lập hiện tại: ' + up.autonomy + '/100.\n' +
      '• Ngôn ngữ đã thông thạo: ' + up.langs.join(', ') + '.\n' +
      '• Quy tắc di chuyển & hộ tống: ' + travelNote + ' Vệ sĩ đi kèm (' + up.security.guards + ' người) giữ khoảng cách để không ai tự ý chạm vào thành viên hoàng gia khi chưa được phép.\n' +
      '• Mạng xã hội: Tài khoản chính thức do đội ngũ truyền thông quản lý. ' + (up.social.cloneHandle ? 'Tài khoản cá nhân ẩn danh: ' + up.social.cloneHandle + (up.social.approvedByParents ? ' (đã xin phép)' : ' (lập lén)') : 'Không tự ý dùng tài khoản cá nhân công khai.');
  }, function (l) {
    var q = A.context(l); if (!q || !q.me) return [];
    var ps = A.personState(l, q.me), up = upState(l, q.me), cfg = NANNY_LANG[q.c] || NANNY_LANG.GB, pos = R.lineOf(l, q.h, q.me) || 99, out = [];
    function row(k, label, min, max, run, why) {
      if (l.age < min || (max && l.age > max)) return;
      out.push({ k: k, l: label, why: why || up.acted[k] === yr(l) ? why || 'Đã thực hiện năm nay' : true, run: function (l, r, log) { if (up.acted[k] === yr(l)) return; up.acted[k] = yr(l); run(r, log); } });
    }
    row('nanny_lang', 'Học ngoại ngữ tự nhiên cùng bảo mẫu châu Âu & rèn tính tự lập theo tuổi', 4, 14, function (r, log) {
      var nextLang = (cfg.foreign || []).find(function (lg) { return !up.langs.includes(lg); }) || (up.targetLangs || []).find(function (lg) { return !up.langs.includes(lg); }) || cfg.foreign[0];
      if (!up.langs.includes(nextLang)) up.langs.push(nextLang);
      up.autonomy = Math.min(100, up.autonomy + (l.age >= 10 ? 15 : 10));
      E.LIFE138.skill(l, 'language').level = Math.min(100, E.LIFE138.skill(l, 'language').level + 10);
      H.fx(l, { kno: 2, hap: 1 });
      log('Bảo mẫu người nước ngoài trò chuyện hằng ngày giúp bạn thấm tự nhiên ' + nextLang + '. Khi lớn dần, bảo mẫu lùi lại để bạn tự sắp xếp đồ đạc và rèn tính tự lập (' + up.autonomy + '/100).', 'good');
    });
    if (q.c === 'GB' || q.c === 'DK' || q.c === 'NO' || q.c === 'SE' || q.c === 'BE') {
      row('regional_lang', 'Học ngôn ngữ truyền thống/bản địa: ' + cfg.regional, 5, 25, function (r, log) {
        if (!up.langs.includes(cfg.regional)) up.langs.push(cfg.regional);
        ps.protocol = Math.min(100, ps.protocol + 5); ps.prepared = Math.min(100, ps.prepared + 4); H.fx(l, { kno: 2 });
        log('Bạn học ' + cfg.regional + ' để chuẩn bị cho các nghi lễ và chuyến công vụ gắn bó mật thiết với văn hóa từng vùng và các hoàng gia láng giềng.', 'good');
      }, up.langs.includes(cfg.regional) ? 'Đã thành thạo ' + cfg.regional : null);
    }
    row('child_duty', 'Đi theo cha mẹ dự sự kiện công vụ: lễ phép, trang nghiêm, bắt tay và chào hỏi', 5, 12, function (r, log) {
      up.publicDuties++; ps.protocol = Math.min(100, ps.protocol + 8); ps.prepared = Math.min(100, ps.prepared + 4);
      var calm = (l.st.soc || 50) + ps.protocol >= 60 || r() < 0.75;
      log(calm ? 'Từ 5–6 tuổi bạn bắt đầu theo cha mẹ xuất hiện ở sự kiện chính thức: đứng ngay ngắn, bắt tay, chào hỏi lễ phép và chững chạc hơn nhiều bạn đồng trang lứa.' : 'Bạn cố gắng giữ vẻ trang nghiêm, bắt tay khách quý đúng phép tắc dù lịch trình khá dài với một đứa trẻ.', 'good');
    });
    row('separate_travel', 'Áp dụng quy tắc di chuyển máy bay riêng / xe chở riêng để bảo vệ hàng kế vị', 7, 99, function (r, log) {
      up.separateTravel = true; ps.prepared = Math.min(100, ps.prepared + 4);
      log('Từ 7–8 tuổi trở đi, bạn bắt đầu đi máy bay riêng hoặc xe hộ tống tách biệt với người trị vì và những người kế vị trực tiếp khác, phòng ngừa rủi ro mất toàn bộ danh sách kế vị trong một chuyến đi.', 'neutral');
    }, up.separateTravel ? 'Đã áp dụng quy tắc tách chuyến bay/xe hộ tống' : null);
    if (l.age >= 12 && l.age <= 18) {
      var bSchools = (BOARDING[q.c] || BOARDING.GB)[l.sex === 'F' ? 'F' : 'M'];
      bSchools.forEach(function (sch, idx) {
        row('boarding_' + idx, 'Theo học trường nội trú quý tộc (khu ' + (l.sex === 'F' ? 'nữ sinh' : 'nam sinh') + '): ' + sch, 12, 18, function (r, log) {
          up.boarding = { school: sch, division: l.sex === 'F' ? 'nữ sinh' : 'nam sinh', at: yr(l) };
          E.LIFE138.state(l).environment = 'boarding';
          ps.protocol = Math.min(100, ps.protocol + 6); ps.prepared = Math.min(100, ps.prepared + 6); up.autonomy = Math.min(100, up.autonomy + 10);
          H.fx(l, { kno: 3, soc: 2 });
          log('Bạn vào học tại ' + sch + ' (phân khu ' + (l.sex === 'F' ? 'nữ sinh' : 'nam sinh') + '): sinh hoạt kỷ luật, tự lập và gắn kết với bạn bè quý tộc lẫn học sinh tài năng.', 'good');
        }, up.boarding && up.boarding.school === sch ? 'Đang theo học trường này' : null);
      });
    }
    ARTS_SPORTS.forEach(function (art) {
      row('art_' + art[0], 'Rèn luyện quý tộc: ' + art[1], 6, 30, function (r, log) {
        up.arts[art[0]] = (up.arts[art[0]] || 0) + 1;
        if (['sport', 'dance', 'instrument', 'draw'].includes(art[2])) {
          var sk = E.LIFE138.skill(l, art[2]); sk.level = Math.min(100, sk.level + 6);
        } else H.fx(l, { kno: 2 });
        ps.protocol = Math.min(100, ps.protocol + 3); H.fx(l, { hap: 2 });
        log(art[1] + ': ' + art[3] + ' (Cấp độ rèn luyện: ' + up.arts[art[0]] + ').', 'good');
      });
    });
    row('friends_circle', 'Giao lưu bạn bè (thường dân, khá giả, quý tộc) & ra phố kín đáo cùng đội hộ tống', 7, 99, function (r, log) {
      var bg = U.pick(r, ['bạn thường dân cùng lớp', 'bạn gia đình khá giả', 'bạn con nhà quý tộc lâu đời']);
      var fName = H.stranger(l, r, r() < 0.5 ? 'M' : 'F');
      up.friends.push({ name: fName, bg: bg, at: yr(l) });
      if (up.friends.length > 10) up.friends.shift();
      H.fx(l, { hap: 3, soc: 2 });
      var nordicText = up.security.nordicSimple ? ' Với văn hóa giản dị và gần gũi của Bắc Âu (' + q.c + '), bạn đi dạo rất tự nhiên nhưng vẫn kín đáo để tránh gây chú ý.' : ' Bạn ăn mặc giản dị để tránh bị nhận ra giữa đám đông.';
      log('Bạn kết bạn với ' + fName + ' (' + bg + '). Khi ra ngoài luôn có vệ sĩ hộ tống giữ khoảng cách hợp lý, đảm bảo không ai tự ý đụng chạm thành viên hoàng gia khi chưa được phép.' + nordicText, 'good');
    });
    row('social_team', 'Để đội ngũ truyền thông vận hành tài khoản chính thức; giữ lịch trình không dùng MXH cá nhân', 10, 99, function (r, log) {
      up.social.officialManagedByTeam = true; R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 2, 0, 100);
      ps.stress = Math.max(0, ps.stress - 3);
      log('Tài khoản chính thức do đội ngũ truyền thông hoàng gia biên tập và đăng tải. Bạn tập trung vào lịch học và công vụ dày đặc, tránh xa ồn ào mạng xã hội.', 'good');
    });
    row('social_clone', l.age < 18 ? 'Xin phép cha mẹ lập tài khoản clone ẩn danh (tên kỳ lạ, chỉ kết bạn kín)' : 'Dùng tài khoản clone ẩn danh với biệt danh kỳ lạ để giữ riêng tư', 12, 99, function (r, log) {
      var handles = ['@arctic_teapot_' + (hash(l.id) % 900 + 100), '@quiet_Cloud_Fjord', '@emerald_acorn_88', '@midnight_harp_owl', '@velvet_polo_fox'];
      up.social.cloneHandle = handles[hash(l.id + yr(l)) % handles.length];
      up.social.approvedByParents = true;
      H.fx(l, { hap: 2 });
      log('Bạn dùng tài khoản ẩn danh ' + up.social.cloneHandle + ' ở chế độ riêng tư tuyệt đối, không để lộ danh tính hoàng gia và chỉ giữ liên lạc với vài người bạn thật sự tin cậy.', 'neutral');
    });
    if (l.age >= 11 && l.age < 18) {
      row('social_unapproved', 'Tự ý lập tài khoản mạng xã hội khi chưa có sự cho phép của hoàng gia', 11, 17, function (r, log) {
        up.social.approvedByParents = false;
        if (r() < 0.65) {
          up.social.leaks++; ps.stress = U.clamp(ps.stress + 6, 0, 100); R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) - 3, 0, 100);
          log('Tài khoản tự lập bị báo chí phát hiện qua danh sách bạn bè. Văn phòng hoàng gia yêu cầu khóa ngay và nhắc nhở nghiêm khắc vì hoàng tử/công chúa nhỏ không được tự ý dùng mạng xã hội khi chưa được phép.', 'bad');
        } else {
          log('Bạn lén dùng một thời gian rồi tự khóa vì lịch học và công vụ quá bận rộn, lại luôn lo bị phát hiện.', 'neutral');
        }
      });
    }
    return out;
  }, 4, 'Đời sống');

  // Tự động kích hoạt tách phương tiện từ 7–8 tuổi cho người kế vị trực tiếp trong yearHook
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !A.managed(l)) return;
    var q = A.context(l); if (!q || !q.me) return;
    syncTitles(l, q.h, R.byId(q.h, q.h.seat), null, null);
    var up = upState(l, q.me), pos = R.lineOf(l, q.h, q.me) || 99;
    if (l.age === 7 && pos <= 3 && !up.separateTravel) {
      up.separateTravel = true;
      if (log) log('Bước sang tuổi lên 7, văn phòng hoàng gia áp dụng quy định an ninh kế vị: bạn bắt đầu di chuyển bằng máy bay và xe hộ tống riêng, không đi chung phương tiện với quân vương hoặc người kế vị trực tiếp khác.', 'neutral');
    }
  });

  // ================= 5. Sinh nở Hoàng gia, Đa thai, Đại bác, Đèn màu, Chụp ảnh & Đặt tên =================
  // Mở rộng đa thai hoàng gia cực hiếm (sinh đôi, sinh 3, và cực cực hiếm sinh 4) + thứ tự ra đời quyết định thứ tự kế vị
  var QUAD_ROYAL = 0.00002;
  function birthGroupKids(l, bornAge) {
    return (l.kids || []).filter(function (k) { return k.alive !== false && k.born === (bornAge == null ? l.age : bornAge); });
  }

  function ensureRoyalBirthRecord(l, bornAge) {
    var q = A.context(l); if (!q) return null;
    var s = R.st(l); s.royalBirths847 = s.royalBirths847 || {};
    var ageKey = bornAge == null ? l.age : bornAge;
    var kids = birthGroupKids(l, ageKey);
    if (!kids.length) return null;
    if (s.royalBirths847[ageKey] && s.royalBirths847[ageKey].count === kids.length) {
      // Cập nhật danh sách nếu vừa có thêm bé trong cùng năm
      s.royalBirths847[ageKey].kidIds = kids.map(function (k) { return X.uid(l, k); });
      return s.royalBirths847[ageKey];
    }
    var rr = rng(l.id + ':rbirth847:' + ageKey);
    // Hỗ trợ sinh 4 cực cực hiếm nếu chưa sinh đa thai hoặc nâng từ ca sinh mới
    if (kids.length === 1 && !kids[0].adopted && rr() < QUAD_ROYAL) {
      for (var qi = 1; qi < 4; qi++) {
        var sx = rr() < 0.5 ? 'M' : 'F', clone = JSON.parse(JSON.stringify(kids[0]));
        delete clone.uid110; delete clone.royal920; clone.sex = sx; clone.name = H.stranger(l, rr, sx).split(' ')[0];
        l.kids.push(clone); X.uid(l, clone);
      }
      R.kidsYear(l, function () {});
      kids = birthGroupKids(l, ageKey);
    }
    var count = kids.length;
    var priorDeliveries = Object.keys(s.royalBirths847).filter(function (k) { return Number(k) !== Number(ageKey); }).length;
    // Lưu ý ca sinh: sinh đôi/ba/tư hoặc ca 2, 3 có chỉ định mổ, hoặc ca 1 mổ tùy sức khỏe và nhu cầu thực; sinh đơn mẹ khỏe con khỏe mới sinh thường ra viện sớm
    var motherHea = l.sex === 'F' ? (l.st.hea || 70) : 75;
    var cSection = Boolean(l.preferCesarean847) || count >= 2 || motherHea < 60 || priorDeliveries >= 1;
    var motherBabyHealthy = !cSection && motherHea >= 60;
    // Gán thứ tự chào đời từng phút để luật kế vị phân định rõ ai ra trước / ra sau
    kids.forEach(function (k, idx) {
      k.birthMinuteOrder847 = idx + 1;
      if (k.royal920) {
        var m = R.byId(q.h, k.royal920.id);
        if (m) m.birthOrder837 = ageKey * 10 + idx + 1;
      }
    });
    var boys = kids.filter(function (k) { return k.sex === 'M'; }).length;
    var girls = kids.filter(function (k) { return k.sex === 'F'; }).length;
    var lightColor = boys > 0 && girls > 0 ? 'hồng xen lẫn xanh lam (sinh đôi/đa thai cả nam và nữ)' : boys > 0 ? 'xanh lam (It\'s a boy)' : 'hồng (It\'s a girl)';
    var hourBorn = Math.floor(rr() * 24);
    var rec = {
      age: ageKey,
      year: yr(l),
      cc: q.c,
      count: count,
      multipleLabel: count === 1 ? 'sinh đơn' : count === 2 ? (boys === 1 && girls === 1 ? 'sinh đôi nam – nữ (niềm vui nhân đôi)' : 'sinh đôi cùng giới (' + (boys === 2 ? 'hai hoàng tử' : 'hai công chúa') + ')') : count === 3 ? 'sinh ba hoàng gia (rất hiếm)' : 'sinh tư hoàng gia (cực kỳ hiếm)',
      secretMultiple: count >= 2 && rr() < 0.7, // nhiều thành viên hoàng gia giấu kín đa thai tới tận ngày sinh
      delivery: cSection ? 'cesarean' : 'vaginal',
      healthyQuick: motherBabyHealthy,
      hourBorn: hourBorn,
      kidIds: kids.map(function (k) { return X.uid(l, k); }),
      lightsOn: false,
      lightColor: lightColor,
      saluteFired: false,
      mediaDebut: null,
      nameAnnounced: cSection ? 'immediate' : 'pending_week', // Sinh mổ ưu tiên sức khỏe không chụp ảnh bậc thềm mà công bố ngay họ tên; sinh thường ra viện sớm, công bố tên sau vài ngày tới 1 tuần
      christening: { done: false, paternalRelatives: true, maternalRelatives: true, inLawsInvited: true, victoriaGown: true },
      guestbookBe: q.c === 'BE' ? { digital: true, palace: 'Cung điện Hoàng gia Brussels', entries: 0 } : null,
      acted: {}
    };
    s.royalBirths847[ageKey] = rec;
    return rec;
  }

  var SALUTE_RULES = {
    GB: {
      hour: 13,
      desc: '13h00 chiều: Tháp London (62 phát), Công viên Green Park (41 phát) cùng 5 địa điểm pháo lễ khác trên toàn Vương quốc (Lâu đài Edinburgh, Lâu đài Cardiff, Lâu đài Hillsborough, Căn cứ Hải quân Portsmouth và Devonport)',
      stations: 7,
      shots: '62 phát tại Tower of London, 41 phát tại Green Park & các pháo đài'
    },
    NO: {
      hour: 12,
      desc: 'Đúng 12h00 trưa: loạt 21 phát đại bác đồng loạt tại 11 pháo đài và căn cứ quân sự trải dài khắp đất nước Na Uy (từ Pháo đài Akershus ở Oslo tới Vardøhus ở cực Bắc)',
      stations: 11,
      shots: '21 phát đại bác tại 11 pháo đài/căn cứ quân sự'
    },
    SE: {
      hour: 12,
      desc: 'Đúng 12h00 trưa: loạt 21 phát đại bác chào mừng tại 5 trạm pháo lễ cố định chính của Thụy Điển (Skeppsholmen ở Stockholm, Boden, Härnösand, Karlskrona và Göteborg)',
      stations: 5,
      shots: '21 phát đại bác tại 5 trạm chính cố định'
    },
    DK: {
      hour: 12,
      desc: '12h00 trưa: loạt 21 phát đại bác từ Pháo đài Sixtus (Holmen, Copenhagen) và Lâu đài Kronborg',
      stations: 2,
      shots: '21 phát đại bác'
    },
    BE: {
      hour: 12,
      desc: 'Nghi thức pháo lễ chào mừng em bé Hoàng gia Bỉ tại Brussels',
      stations: 1,
      shots: 'pháo lễ chào mừng theo nghi thức Vương thất Bỉ'
    },
    ES: {
      hour: 12,
      desc: 'Thông cáo trọng thể của Cung điện Zarzuela và nghi thức chào mừng Hoàng gia Tây Ban Nha',
      stations: 1,
      shots: 'nghi thức chào mừng Hoàng gia'
    },
    MC: {
      hour: 12,
      desc: 'Loạt pháo lễ từ Pháo đài Antoine chào mừng thành viên mới của Vương thất Monaco',
      stations: 1,
      shots: 'pháo lễ chào mừng tại Monaco'
    }
  };

  var LONDON_LANDMARKS = [
    'Cầu Tháp London (Tower Bridge)',
    'Vòng quay Thiên niên kỷ (London Eye)',
    'Đài phun nước tại Quảng trường Trafalgar',
    'Tháp truyền thông BT Tower (chạy dòng chữ đèn LED)',
    'Cầu Golden Jubilee'
  ];

  // Kiểm duyệt tên em bé hoàng gia (đặc biệt 6 vị trí kế vị đầu tiên)
  var FREESTYLE_NAMES = ['Neon', 'Galaxy', 'X-Alpha', 'Pixel', 'Bão Tố', 'Rebel', 'Rockstar', 'Crypto', 'Lucky'];
  var DYNASTIC_APPROVED = {
    GB: { M: ['George Alexander Louis', 'Arthur Charles Edward'], F: ['Charlotte Elizabeth Diana', 'Victoria Mary Alexandra'] },
    SE: { M: ['Carl Gustaf Oscar', 'Oscar Carl Olof'], F: ['Victoria Ingrid Alice', 'Estelle Silvia Ewa'] },
    NO: { M: ['Haakon Magnus Olav', 'Sverre Magnus Harald'], F: ['Ingrid Alexandra Maud', 'Astrid Martha Ragnhild'] },
    DK: { M: ['Christian Valdemar Henri', 'Frederik Henrik André'], F: ['Isabella Henrietta Ingrid', 'Margrethe Mary Josephine'] },
    BE: { M: ['Gabriel Baudouin Charles', 'Emmanuel Léopold Guillaume'], F: ['Elisabeth Thérèse Marie', 'Eléonore Fabiola Victoria'] },
    ES: { M: ['Felipe Juan Pablo', 'Fernando Carlos Alfonso'], F: ['Leonor de Todos los Santos', 'Sofía de Todos los Santos'] },
    MC: { M: ['Jacques Honoré Rainier', 'Albert Louis Pierre'], F: ['Gabriella Thérèse Marie', 'Caroline Grace Charlotte'] }
  };

  X.menu('royalBirthProtocol847', 'Nghi thức đón em bé Hoàng gia, đại bác, thắp đèn & ra mắt công chúng', function (l) {
    var q = A.context(l);
    if (!l.alive || !A.managed(l) || !q) return 'Dành cho gia đình hoàng gia được mô phỏng';
    var hasNewborn = birthGroupKids(l, l.age).length > 0;
    var anyRoyalKids = (l.kids || []).some(function (k) { return k.alive !== false && k.royal920; });
    return hasNewborn || anyRoyalKids ? true : 'Cần có em bé hoàng gia mới chào đời hoặc đang trong tuổi sơ sinh';
  }, function (l) {
    var q = A.context(l);
    var rec = ensureRoyalBirthRecord(l, l.age) || (R.st(l).royalBirths847 && R.st(l).royalBirths847[ Object.keys(R.st(l).royalBirths847).slice(-1)[0] ]);
    if (!rec) return 'Chưa có hồ sơ ca sinh mới trong năm nay.';
    var kids = (l.kids || []).filter(function (k) { return rec.kidIds.includes(X.uid(l, k)); });
    var names = kids.map(function (k) {
      var m = k.royal920 && R.byId(q.h, k.royal920.id), pos = m && R.lineOf(l, q.h, m);
      return k.name + ' (ra đời thứ ' + (k.birthMinuteOrder847 || 1) + (pos ? ', vị trí kế vị #' + pos : '') + ')';
    }).join(', ');
    var sal = SALUTE_RULES[q.c] || SALUTE_RULES.GB;
    var timing = rec.hourBorn < sal.hour ? 'bắn ngay lúc ' + sal.hour + 'h00 hôm nay (do bé sinh lúc ' + rec.hourBorn + 'h00, trước mốc bắn)' : 'chuyển sang bắn đúng ' + sal.hour + 'h00 ngày hôm sau (do bé sinh lúc ' + rec.hourBorn + 'h00, đã qua mốc giờ bắn trong ngày)';
    return '• Ca sinh: ' + rec.multipleLabel + (rec.secretMultiple ? ' (giữ kín đến tận ngày sinh, báo chí vỡ òa "niềm vui nhân đôi/nhân ba")' : '') + ' · Phương pháp: ' + (rec.delivery === 'cesarean' ? 'Sinh mổ (ưu tiên sức khỏe mẹ và bé, không chụp ảnh ngay trước cổng viện, công bố ngay họ tên)' : 'Sinh thường thuận lợi (mẹ khỏe, con khỏe)') + '.\n' +
      '• Danh sách bé & thứ tự kế vị: ' + names + '.\n' +
      '• Nghi thức đại bác (' + q.c + '): ' + sal.desc + ' — Lịch bắn: ' + timing + '.\n' +
      (q.c === 'GB' ? '• Thắp đèn danh thắng London: ' + LONDON_LANDMARKS.join(', ') + ' — Màu đèn: ' + rec.lightColor + '.\n' : '') +
      '• Ra mắt truyền thông: ' + (rec.mediaDebut || 'chưa thực hiện') + ' · Lễ rửa tội (nội ngoại 2 bên & sui gia): ' + (rec.christening.done ? 'đã cử hành' : 'đang chuẩn bị') + '.';
  }, function (l) {
    var q = A.context(l); if (!q) return [];
    var rec = ensureRoyalBirthRecord(l, l.age) || (R.st(l).royalBirths847 && R.st(l).royalBirths847[Object.keys(R.st(l).royalBirths847).slice(-1)[0]]);
    if (!rec) return [];
    var kids = (l.kids || []).filter(function (k) { return rec.kidIds.includes(X.uid(l, k)); });
    var olderSibs = (l.kids || []).filter(function (k) { return k.alive !== false && k.born < rec.age; });
    var sal = SALUTE_RULES[q.c] || SALUTE_RULES.GB;
    var out = [];
    function row(k, label, run, why) {
      out.push({ k: k, l: label, why: why || rec.acted[k] ? why || 'Đã thực hiện' : true, run: function (l, r, log) { if (rec.acted[k]) return; rec.acted[k] = true; run(r, log); } });
    }

    // 1. Nghi thức bắn đại bác theo quốc gia & giờ sinh
    row('gun_salute', 'Cử hành nghi thức bắn đại bác chào mừng (' + sal.shots + ' lúc ' + sal.hour + 'h00)', function (r, log) {
      rec.saluteFired = true;
      var dayNote = rec.hourBorn < sal.hour ? 'Đúng ' + sal.hour + 'h00 cùng ngày' : 'Vì em bé chào đời lúc ' + rec.hourBorn + 'h00 (đã qua mốc ' + sal.hour + 'h00), nghi thức được cử hành trang trọng vào đúng ' + sal.hour + 'h00 ngày hôm sau';
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100);
      log(dayNote + ': ' + sal.desc + '. Tiếng đại bác vang rền báo tin vui cho toàn dân.', 'big');
    }, rec.saluteFired ? 'Đã bắn đại bác chào mừng' : null);

    // 2. Thắp đèn danh lam thắng cảnh London (Anh) + Trang nhất báo chí
    if (q.c === 'GB') {
      row('london_lights', 'Thắp sáng hàng loạt danh thắng London (' + rec.lightColor + ') & lên trang nhất báo chí', function (r, log) {
        rec.lightsOn = true;
        var boys = kids.filter(function (k) { return k.sex === 'M'; }).length, girls = kids.filter(function (k) { return k.sex === 'F'; }).length;
        var btText = boys > 0 && girls > 0 ? '"It\'s a boy and a girl!"' : boys > 0 ? '"It\'s a boy!"' : '"It\'s a girl!"';
        log('Báo chí đưa tin trang nhất về thành viên mới trong dòng kế vị. Khắp London, ' + LONDON_LANDMARKS.slice(0, 3).join(', ') + ' và Cầu Golden Jubilee đồng loạt thắp đèn màu ' + rec.lightColor + ', còn Tháp BT Tower chạy dòng chữ LED ' + btText + ' ăn mừng.', 'big');
      }, rec.lightsOn ? 'Đã thắp đèn mừng tại London' : null);
    }

    // 3. Quy trình xuất hiện / chụp ảnh đặc trưng theo từng Hoàng gia & phương pháp sinh
    if (q.c === 'GB') {
      row('gb_lindo_wing', 'Bế con bước ra bậc thềm Lindo Wing – Bệnh viện St. Mary\'s (truyền thống từ thời Công nương Diana)', function (r, log) {
        rec.mediaDebut = 'Bậc thềm Lindo Wing, Bệnh viện St. Mary\'s (London)';
        log('Chỉ vài giờ / một ngày sau ca sinh đơn thuận lợi, mẹ và bé khỏe mạnh bước ra trước bậc thềm khu sản Lindo Wing của Bệnh viện St. Mary\'s, vẫy chào hàng trăm phóng viên và người dân rồi về cung điện sớm để tránh chen lấn ảnh hưởng bệnh viện xung quanh. Tên chính thức sẽ được công bố sau vài ngày tới 1 tuần.', 'good');
      }, rec.delivery !== 'vaginal' || !rec.healthyQuick || rec.count > 1 ? 'Chỉ áp dụng khi sinh đơn, sinh thường thuận lợi, mẹ khỏe và con khỏe' : null);
    }
    if (rec.delivery === 'cesarean' || rec.count >= 2) {
      row('csection_protocol', 'Ưu tiên sức khỏe sau sinh mổ/đa thai: công bố ngay họ tên, gửi ảnh em bé (cùng anh chị lớn) & hẹn ra mắt ban công sau vài tuần', function (r, log) {
        rec.mediaDebut = 'Công bố tên ngay & gửi ảnh gia đình (ưu tiên hồi phục sau sinh mổ), ra mắt ban công cung điện sau vài tuần';
        rec.nameAnnounced = 'announced_immediately';
        var sibNote = olderSibs.length ? ' kèm bức ảnh ấm áp có mặt anh/chị lớn (' + olderSibs.map(function (s) { return s.name; }).join(', ') + ')' : '';
        log('Do ' + (rec.count >= 2 ? rec.multipleLabel + ' và ' : '') + 'ca sinh mổ ưu tiên tuyệt đối sức khỏe của mẹ và bé, gia đình không chụp ảnh trực tiếp tại cổng viện mà công bố ngay họ tên được đặt và thứ tự chào đời theo luật kế vị. Văn phòng gửi ảnh em bé' + sibNote + ' để người dân đỡ nôn nóng mong chờ; sau vài tuần hồi phục, gia đình mới bế bé ra ban công cung điện diện kiến công chúng.', 'good');
      });
    }
    if (q.c === 'NO') {
      row('no_skaugum_portrait', 'Trở về dinh thự Skaugum từ Bệnh viện Rigshospitalet & công bố bộ ảnh chân dung Ba Thế Hệ', function (r, log) {
        rec.mediaDebut = 'Bộ ảnh chân dung Ba Thế Hệ tại dinh thự Skaugum (Na Uy)';
        var sov = R.byId(q.h, q.h.seat);
        log('Khác với Anh, Hoàng gia Na Uy để mẹ và bé rời Bệnh viện Rigshospitalet về dinh thự riêng (Skaugum) nghỉ ngơi rồi mới phát hành bộ ảnh chân dung chính thức đầu tiên, quy tụ ba thế hệ: ' + (sov ? sov.name : 'Đức Vua') + ', người kế vị và em bé mới sinh.', 'good');
      });
    }
    if (q.c === 'BE') {
      row('be_trilingual_photocall', 'Phát thông cáo 3 ngôn ngữ (Hà Lan, Pháp, Đức), đón anh chị vào thăm trước & Photo Call tại Bệnh viện Erasme / St. Jan + mở sổ chúc mừng Brussels', function (r, log) {
        rec.mediaDebut = 'Photo Call tại Bệnh viện Erasme/St. Jan & Sổ chúc mừng tại Cung điện Brussels';
        if (rec.guestbookBe) rec.guestbookBe.entries += 1500;
        var sibVisit = olderSibs.length ? 'Các anh chị lớn (' + olderSibs.map(function (s) { return s.name; }).join(', ') + ') được đưa vào bệnh viện thăm em bé trước, sau đó cả gia đình mới cùng xuất hiện' : 'Hai vợ chồng cùng bế em bé xuất hiện';
        log('Cung điện Hoàng gia Bỉ phát thông cáo chính thức bằng cả ba ngôn ngữ (Hà Lan, Pháp, Đức). Khoảng 2–3 ngày sau sinh khi mẹ hồi phục, ' + sibVisit + ' trong buổi chụp ảnh ngắn (Photo Call) tại bệnh viện và nán lại vài phút chia sẻ niềm vui với phóng viên. Đồng thời, sổ chúc mừng giấy và kỹ thuật số được mở tại Cung điện Hoàng gia Brussels để người dân gửi lời chúc.', 'good');
      });
    }
    if (q.c === 'ES' || q.c === 'SE') {
      row('es_se_press_photo', 'Tổ chức họp báo ngắn tại bệnh viện sau khi nghỉ ngơi hoặc đăng ảnh chân dung do chính gia đình tự chụp', function (r, log) {
        rec.mediaDebut = 'Họp báo ngắn tại bệnh viện & ảnh chân dung do gia đình tự chụp (' + q.c + ')';
        log('Theo truyền thống kín tiếng trong ngày đầu của Hoàng gia ' + (q.c === 'SE' ? 'Thụy Điển' : 'Tây Ban Nha') + ', gia đình đợi mẹ và bé nghỉ ngơi đầy đủ rồi mới tổ chức buổi chụp hình/họp báo ngắn tại bệnh viện và đăng tải bức ảnh chân dung đầu tiên do chính cha mẹ chụp.', 'good');
      });
    }
    if (q.c === 'MC' || q.c === 'DK') {
      row('mc_dk_balcony', 'Ra mắt chính thức từ ban công cung điện trước thần dân tại quảng trường sau vài tuần / dịp lễ', function (r, log) {
        rec.mediaDebut = 'Ra mắt từ ban công Cung điện (' + q.c + ')';
        log('Theo truyền thống của ' + (q.c === 'MC' ? 'Vương thất Monaco' : 'Hoàng gia Đan Mạch') + ', sau vài tuần hồi phục hoặc vào ngày lễ trọng đại, cha mẹ bế em bé bước ra ban công cung điện vẫy chào đông đảo thần dân tập trung dưới quảng trường.', 'big');
      });
    }

    // 4. Đặt & xét duyệt tên Hoàng gia (bị từ chối nếu quá tự do ở 6 vị trí kế vị đầu)
    row('name_approval_strict', 'Đề xuất tên phá cách tự do cho con (kiểm tra quy tắc 6 vị trí kế vị đầu tiên)', function (r, log) {
      var firstKid = kids[0], m = firstKid && firstKid.royal920 && R.byId(q.h, firstKid.royal920.id);
      var pos = m && R.lineOf(l, q.h, m) || 99;
      var freeName = FREESTYLE_NAMES[hash(l.id + rec.age) % FREESTYLE_NAMES.length];
      if (pos <= 6) {
        rec.acted.name_approval_strict = false; // Cho phép chọn lại tên chuẩn
        rec.rejectedName847 = freeName;
        log('Bạn đề xuất tên "' + freeName + '", nhưng vì bé đứng thứ ' + pos + ' trong hàng kế vị (thuộc 6 vị trí kế vị đầu tiên), Quốc vương và Hội đồng/Văn phòng Hoàng gia từ chối tên quá tự do, yêu cầu chọn tên chuẩn mực mang tính lịch sử vương triều.', 'bad');
      } else {
        firstKid.royalNickname847 = freeName;
        log('Vì bé ở xa ngai vàng (thứ ' + pos + '), gia đình được linh hoạt giữ tên gọi riêng "' + freeName + '" bên cạnh tên nghi lễ.', 'neutral');
      }
    });

    row('name_approval_dynastic', 'Công bố tên chuẩn mực truyền thống Hoàng gia (sau vài ngày – 1 tuần hoặc theo thông cáo)', function (r, log) {
      var poolObj = DYNASTIC_APPROVED[q.c] || DYNASTIC_APPROVED.GB;
      kids.forEach(function (k, idx) {
        var pool = poolObj[k.sex === 'F' ? 'F' : 'M'] || poolObj.M;
        var chosen = pool[(hash(l.id + k.name) + idx) % pool.length];
        k.royalName837 = k.name + ' ' + chosen + ' ' + A.CULTURE[q.c].house;
        var m = k.royal920 && R.byId(q.h, k.royal920.id);
        if (m) m.fullName837 = k.royalName837;
      });
      rec.nameAnnounced = 'completed';
      log('Văn phòng Hoàng gia chính thức công bố tên đầy đủ theo truyền thống vương triều cho ' + kids.map(function (k) { return k.royalName837; }).join('; ') + '.', 'good');
    });

    // 5. Lễ rửa tội Hoàng gia: đủ 2 bên nội ngoại (không phân biệt sui gia thường dân hay quý tộc), váy thời Victoria
    row('royal_christening_full', 'Tổ chức Lễ Rửa Tội Hoàng gia: mời đủ hai bên nội – ngoại (sui gia thường dân hay quý tộc đều trân trọng) & mặc váy rửa tội thời Victoria', function (r, log) {
      rec.christening.done = true;
      kids.forEach(function (k) {
        var d = F.infant(l, k);
        d.baptized837 = { at: 0, year: yr(l), infant: true };
        d.royalRite837 = { gown: 'váy rửa tội bản sao thời Nữ hoàng Victoria (dùng chung cho cả hoàng tử và công chúa)', country: q.c, bothFamilies: true, inLawsHonored: true };
      });
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100);
      H.fx(l, { hap: 3 });
      log('Lễ rửa tội diễn ra trang trọng: em bé (dù là hoàng tử hay công chúa) mặc chiếc váy rửa tội truyền thống từ thời Victoria. Gia đình mời đầy đủ cả bên nội lẫn bên ngoại — ông bà ngoại và sui gia dù xuất thân thường dân hay quý tộc đều có vị trí trang trọng trong buổi lễ và ảnh chính thức.', 'big');
    }, rec.christening.done ? 'Đã tổ chức lễ rửa tội' : null);

    return out;
  }, 16, 'Gia đình');

  // Đính kèm liên kết vào menu royalLife837 và royalChild837 hiện có để người chơi dễ mở từ một nơi
  var oldLifeMake = E.DEC.royalLife837.make, oldLifeApply = E.DEC.royalLife837.apply;
  E.DEC.royalLife837.make = function (l, r, arg) {
    var d = oldLifeMake.apply(this, arguments), q = A.context(l);
    if (!q || !q.me) return d;
    d.data.keys = d.data.keys || [];
    function appendKey(k, label) {
      var idx = String(d.opts.length);
      d.data.keys.push(k);
      d.opts.push({ k: idx, l: label, h: '' });
    }
    if (q.c === 'SE' && l.age >= 14) appendKey('swedenTrack847', 'Đào tạo Người kế vị Thụy Điển: Quân sự 3 quân chủng, Riksdag, Bộ Ngoại giao & UN');
    if (l.age >= 4) appendKey('upbringing847', 'Bảo mẫu đa ngôn ngữ, trường nội trú quý tộc, nghệ thuật & quy tắc an ninh/MXH');
    if ((l.kids || []).some(function (k) { return k.alive !== false && k.royal920; })) appendKey('birthProtocol847', 'Nghi thức chào đón em bé Hoàng gia: đại bác, thắp đèn London, chụp ảnh & rửa tội');
    return d;
  };
  E.DEC.royalLife837.apply = function (l, d, k, r, log) {
    var key = d && d.data && d.data.keys && d.data.keys[Number(k)];
    if (key === 'swedenTrack847') { X.next(l, 'royalSwedenTrack847', r); return; }
    if (key === 'upbringing847') { X.next(l, 'royalUpbringing847', r); return; }
    if (key === 'birthProtocol847') { X.next(l, 'royalBirthProtocol847', r); return; }
    return oldLifeApply.apply(this, arguments);
  };

  // Tự động khởi tạo hồ sơ ca sinh hoàng gia khi có con mới chào đời trong năm
  E.HOOKS.year.push(function (l, r, log) {
    if (!l.alive || !A.managed(l)) return;
    var newborns = birthGroupKids(l, l.age);
    if (newborns.length) {
      var rec = ensureRoyalBirthRecord(l, l.age);
      if (rec && !rec.announcedLog) {
        rec.announcedLog = true;
        var sal = SALUTE_RULES[rec.cc] || SALUTE_RULES.GB;
        if (log) log('Tin vui Hoàng gia (' + rec.cc + '): ' + rec.multipleLabel + ' (' + (rec.delivery === 'cesarean' ? 'sinh mổ, ưu tiên sức khỏe mẹ và bé' : 'sinh thường thuận lợi') + '). ' + sal.shots + ' chuẩn bị cử hành đúng ' + sal.hour + 'h00.', 'big');
      }
    }
  });

  E.ROYAL847 = {
    NANNY_LANG: NANNY_LANG,
    ARTS_SPORTS: ARTS_SPORTS,
    BOARDING: BOARDING,
    CONSORT_TITLES: CONSORT_TITLES,
    HEIR_TITLES: HEIR_TITLES,
    SALUTE_RULES: SALUTE_RULES,
    LONDON_LANDMARKS: LONDON_LANDMARKS,
    upState: upState,
    syncTitles: syncTitles,
    ensureRoyalBirthRecord: ensureRoyalBirthRecord
  };
})(globalThis.G);
