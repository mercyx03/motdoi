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
    MC: { native: 'Tiếng Pháp', regional: 'Tiếng Monégasque', foreign: ['Tiếng Anh', 'Tiếng Ý', 'Tiếng Đức'] },
    NL: { native: 'Tiếng Hà Lan', regional: 'Tiếng Frisian / Tây Ban Nha (giao thoa gia đình)', foreign: ['Tiếng Anh', 'Tiếng Tây Ban Nha', 'Tiếng Pháp', 'Tiếng Đức'] },
    LU: { native: 'Tiếng Luxembourg / Pháp / Đức', regional: 'Ba ngôn ngữ quốc gia Luxembourg', foreign: ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức'] },
    LI: { native: 'Tiếng Đức', regional: 'Phương ngữ Alemannic Liechtenstein', foreign: ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Ý'] }
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
    MC: { M: ['Institution François d’Assise – Nicolas Barré', 'Institut Le Rosey (Thụy Sĩ)'], F: ['Institution François d’Assise – Nicolas Barré', 'Institut Le Rosey (Thụy Sĩ)'] },
    NL: { M: ['Christelijk Gymnasium Sorghvliet (The Hague)', 'UWC Atlantic'], F: ['Christelijk Gymnasium Sorghvliet (The Hague)', 'UWC Atlantic'] },
    LU: { M: ['Lycée Robert-Schuman', 'Collège Alpin International Beau Soleil'], F: ['Lycée Robert-Schuman', 'Collège Alpin International Beau Soleil'] },
    LI: { M: ['Liechtensteinisches Gymnasium (Vaduz)', 'Institut Le Rosey (Thụy Sĩ)'], F: ['Liechtensteinisches Gymnasium (Vaduz)', 'Institut Le Rosey (Thụy Sĩ)'] }
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
    var cNow = m.country837 || (A.context(l) && A.context(l).c) || 'GB';
    if (cNow === 'NO' && !ps.upbringing847.norwayTrack) {
      ps.upbringing847.norwayTrack = {
        modelCitizen: true,
        publicSchool: false,
        walkToSchool: false,
        milBranches: { navy: false, air: false, engineer12m: false },
        uniEnvLaw: 0,
        abroadStudy: null,
        stortingOath: false,
        nidarosBlessing: false,
        crownOnAltarOnly: true,
        syttendeMaiCount: 0,
        publicTransitDrive: false,
        sustainableBanquet: false
      };
    }
    if (cNow === 'DK' && !ps.upbringing847.denmarkTrack) {
      ps.upbringing847.denmarkTrack = {
        publicSchoolTranegard: false,
        aarhusPoliSci: 0,
        harvardPseudonym: null,
        frogmanCorps: false,
        antvorskovOfficer: false,
        christiansborgProclaimed: false,
        noCrownMuseumOnly: true,
        carriageProcession: false,
        secularThanksgiving: false
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
    },
    NL: {
      sovereign: { F: 'Hoàng hậu Hà Lan (Koningin) · Bệ hạ', M: 'Hoàng thân Phối ngẫu Hà Lan (Prins-gemaal) · Điện hạ' },
      heir: { F: 'Vương phi xứ Orange (Prinses van Oranje) · Điện hạ', M: 'Phối ngẫu Nữ Thân vương xứ Orange · Điện hạ' },
      direct: { F: 'Công nương Hà Lan · Điện hạ', M: 'Phối ngẫu Hoàng gia Hà Lan' }
    },
    LU: {
      sovereign: { F: 'Đại Công tước phu nhân Luxembourg (Grande-Duchesse) · Điện hạ', M: 'Phối ngẫu Nữ Đại Công tước Luxembourg · Điện hạ' },
      heir: { F: 'Đại Công thế tử phi Luxembourg · Điện hạ', M: 'Phối ngẫu Nữ Đại Công thế tử Luxembourg · Điện hạ' },
      direct: { F: 'Công nương Luxembourg · Điện hạ', M: 'Phối ngẫu Đại Công thất Luxembourg' }
    },
    LI: {
      sovereign: { F: 'Thân vương phi Liechtenstein (Fürstin von und zu Liechtenstein) · Điện hạ', M: 'Phối ngẫu Nữ Thân vương Liechtenstein · Điện hạ' },
      heir: { F: 'Thế tử phi / Nhiếp chính vương phi Liechtenstein (Erbprinzessin) · Điện hạ', M: 'Phối ngẫu Thế nữ Liechtenstein · Điện hạ' },
      direct: { F: 'Công nương Liechtenstein · Điện hạ', M: 'Phối ngẫu Vương thất Liechtenstein' }
    }
  };
  var HEIR_TITLES = {
    GB: { M: 'Thân vương xứ Wales (Prince of Wales) · Điện hạ', F: 'Vương nữ Kế vị (Princess of Wales / Heir Apparent) · Điện hạ' },
    SE: { M: 'Thái tử Thụy Điển (Kronprins) · Điện hạ', F: 'Thái nữ Thụy Điển (Kronprinsessa) · Điện hạ' },
    NO: { M: 'Thái tử Na Uy (Kronprins) · Điện hạ', F: 'Thái nữ Na Uy (Kronprinsesse) · Điện hạ' },
    DK: { M: 'Thái tử Đan Mạch (Kronprins) · Điện hạ', F: 'Thái nữ Đan Mạch (Kronprinsesse) · Điện hạ' },
    BE: { M: 'Hoàng tử Bỉ, Công tước xứ Brabant · Điện hạ', F: 'Công chúa Bỉ, Nữ Công tước xứ Brabant · Điện hạ' },
    ES: { M: 'Príncipe de Asturias · Điện hạ', F: 'Princesa de Asturias · Điện hạ' },
    MC: { M: 'Thế tử Monaco, Hầu tước xứ Baux · Điện hạ', F: 'Thế nữ Monaco, Nữ Hầu tước xứ Baux · Điện hạ' },
    NL: { M: 'Thân vương xứ Orange (Prins van Oranje) · Điện hạ', F: 'Nữ Thân vương xứ Orange (Prinses van Oranje) · Điện hạ' },
    LU: { M: 'Đại Công thế tử Luxembourg (Grand-Duc Héritier) · Điện hạ', F: 'Nữ Đại Công thế tử Luxembourg (Grande-Duchesse Héritière) · Điện hạ' },
    LI: { M: 'Thế tử / Nhiếp chính vương Liechtenstein (Erbprinz) · Điện hạ', F: 'Thế nữ Liechtenstein (Erbprinzessin) · Điện hạ' }
  };
  var SOVEREIGN_SUPREME_MIL = {
    SE: 'Đại tướng / Đô đốc Tối cao Ba Quân chủng (Lục quân, Hải quân, Không quân Thụy Điển)',
    GB: 'Tổng Tư lệnh Tối cao Các Lực lượng Vũ trang Anh',
    NO: 'Tổng Tư lệnh Tối cao Quân đội Na Uy',
    DK: 'Tổng Tư lệnh Tối cao Lực lượng Vũ trang Đan Mạch',
    BE: 'Tổng Tư lệnh Các Lực lượng Vũ trang Bỉ',
    ES: 'Tổng Tư lệnh Tối cao (Capitán General) Lực lượng Vũ trang Tây Ban Nha',
    MC: 'Nguyên thủ Tối cao & Người Bảo hộ Hiến pháp Thân vương quốc Monaco',
    NL: 'Nguyên thủ Quốc gia Vương quốc Hà Lan',
    LU: 'Tổng Tư lệnh Lực lượng Vũ trang Đại Công quốc Luxembourg',
    LI: 'Nguyên thủ Tối cao Thân vương quốc Liechtenstein'
  };

  function syncTitles(l, h, newSov, oldSov, log) {
    if (!h || !A.COUNTRIES.includes(h.cc)) return;
    if (typeof syncLegitimacy851 === 'function') syncLegitimacy851(l, h);
    var line = R.order(l, h), heir = line[0], c = h.cc;
    h.members.forEach(function (m, idx) {
      var isChildOfReigningSov = !m.parent || m.parent === h.seat || Boolean(m.investedBySov850);
      m.heirApparent847 = m === heir && isChildOfReigningSov;
      m.waitingParentAccession850 = m === heir ? false : (line.indexOf(m) > 0 && m.parent && m.parent !== h.seat);
      if (m.heirApparent847 && !m.investedHeirAt850) {
        m.investedHeir850 = true;
        m.investedHeirAt850 = yr(l);
        m.investedHeirAge850 = yr(l) - (m.by || l.birthYear);
      }
      if (c === 'ES') {
        m.asturias837 = m.heirApparent847;
        m.infante837 = m.parent === h.seat || (!!heir && m.parent === heir.id);
      }
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
      if (c === 'NL') return (m.sex === 'F' ? 'Nữ hoàng Hà Lan (Koningin)' : 'Quốc vương Hà Lan (Koning)') + ' · Bệ hạ';
      if (c === 'LU') return (m.sex === 'F' ? 'Nữ Đại Công tước Luxembourg' : 'Đại Công tước Luxembourg') + ' · Điện hạ';
      if (c === 'LI') return (m.sex === 'F' ? 'Nữ Thân vương Liechtenstein' : 'Thân vương Liechtenstein (Fürst)') + ' · Điện hạ';
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
    if (q.c === 'NO' && l.age >= 5) appendKey('norwayTrack848', 'Đào tạo Người kế vị & Nghi lễ Hoàng gia Na Uy: Trường làng, Công binh/Hải quân, Lễ Ban Phước & 17/5');
    if (q.c === 'DK' && l.age >= 5) appendKey('denmarkTrack848', 'Đào tạo Người kế vị & Nghi lễ Hoàng gia Đan Mạch: Trường công Tranegårdskolen, Người nhái & Ban công Christiansborg');
    if (l.age >= 4) appendKey('upbringing847', 'Bảo mẫu đa ngôn ngữ, trường nội trú quý tộc, nghệ thuật & quy tắc an ninh/MXH');
    if ((l.kids || []).some(function (k) { return k.alive !== false && k.royal920; })) appendKey('birthProtocol847', 'Nghi thức chào đón em bé Hoàng gia: đại bác, thắp đèn London, chụp ảnh & rửa tội');
    return d;
  };
  E.DEC.royalLife837.apply = function (l, d, k, r, log) {
    var key = d && d.data && d.data.keys && d.data.keys[Number(k)];
    if (key === 'swedenTrack847') { X.next(l, 'royalSwedenTrack847', r); return; }
    if (key === 'norwayTrack848') { X.next(l, 'royalNorwayTrack848', r); return; }
    if (key === 'denmarkTrack848') { X.next(l, 'royalDenmarkTrack848', r); return; }
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


  // ================= 6. Đào tạo Người kế vị & Nghi lễ Hoàng gia Na Uy (NO - 8.10.48) =================
  X.menu('royalNorwayTrack848', 'Đào tạo "Công dân kiểu mẫu" & Nghi lễ Hoàng gia Na Uy', function (l) {
    var q = A.context(l);
    if (X.reason(l, 5) !== true) return X.reason(l, 5);
    return q && q.c === 'NO' && q.me ? true : 'Dành cho thành viên Hoàng gia Na Uy từ 5 tuổi';
  }, function (l) {
    var q = A.context(l), up = upState(l, q.me), no = up.norwayTrack;
    return 'Chương trình của người thừa kế Na Uy tập trung rèn thành một "công dân kiểu mẫu" trước khi trở thành vị vua; nghi lễ thế tục đã bỏ đăng quang truyền thống từ năm 1908.\n' +
      '• Giáo dục phổ thông công lập: ' + (no.publicSchool ? 'Đã học trường làng/phổ thông công lập địa phương, tự đi bộ đến trường cùng trẻ em thường dân ✓' : 'Chưa ghi nhận') + '.\n' +
      '• Quân sự (bờ biển dài & chiến lược NATO): Hải quân/Không quân ' + (no.milBranches.navy ? '✓' : '○') + ' · 12 tháng Tiểu đoàn Công binh Quốc gia ' + (no.milBranches.engineer12m ? '✓' : '○') + '.\n' +
      '• Đại học & Quốc tế: Môi trường/Phát triển bền vững & Luật Hiến pháp (' + no.uniEnvLaw + '/100)' + (no.abroadStudy ? ' · Đã du học nước ngoài' : ' · Được phép du học nước ngoài') + '.\n' +
      '• Nghi lễ Na Uy (từ 1908 không đội vương miện): Tuyên thệ Storting ' + (no.stortingOath ? '✓' : '○') + ' · Lễ Ban Phước Nhà thờ Nidaros (vương miện đặt trên bàn thờ) ' + (no.nidarosBlessing ? '✓' : '○') + ' · Quốc khánh 17/5 mặc Bunad đón diễu hành thiếu nhi (' + no.syttendeMaiCount + ' lần).';
  }, function (l) {
    var q = A.context(l); if (!q || !q.me) return [];
    var ps = A.personState(l, q.me), up = upState(l, q.me), no = up.norwayTrack, out = [];
    function row(k, label, min, max, run, why) {
      if (l.age < min || (max && l.age > max)) return;
      out.push({ k: k, l: label, why: why || up.acted[k] === yr(l) ? why || 'Đã thực hiện năm nay' : true, run: function (l, r, log) { if (up.acted[k] === yr(l)) return; up.acted[k] = yr(l); run(r, log); } });
    }
    row('no_public_school', 'Học trường mẫu giáo & phổ thông công lập địa phương (trường làng): tự đi bộ đến trường cùng trẻ thường dân', 5, 18, function (r, log) {
      no.publicSchool = true; no.walkToSchool = true;
      up.autonomy = Math.min(100, up.autonomy + 14); ps.prepared = Math.min(100, ps.prepared + 6);
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100); H.fx(l, { soc: 3, hap: 2 });
      log('Khác hoàn toàn với truyền thống trường tư quý tộc tại Anh, bạn học trường phổ thông công lập địa phương cùng trẻ em thường dân, tự đi bộ tới lớp và không nhận bất kỳ sự biệt đãi nào để thấu hiểu đời sống thực tế của người dân.', 'good');
    }, no.publicSchool ? 'Đã theo học hệ thống trường công lập địa phương' : null);

    row('no_mil_navy_air', 'Đào tạo Quân sự bắt buộc tại Học viện Hải quân & Không quân Hoàng gia Na Uy (chiến lược bờ biển & NATO)', 18, 45, function (r, log) {
      no.milBranches.navy = true; no.milBranches.air = true;
      ps.prepared = Math.min(100, ps.prepared + 10); H.fx(l, { hea: 3, kno: 2 });
      if (no.milBranches.engineer12m && l.flags.royal) l.flags.royal.mil = true;
      log('Vì Na Uy có đường bờ biển dài và là thành viên chiến lược của NATO, bạn hoàn thành khóa đào tạo sĩ quan tại Học viện Hải quân và Không quân Hoàng gia Na Uy.', 'good');
    }, no.milBranches.navy && no.milBranches.air ? 'Đã hoàn thành đào tạo Hải quân & Không quân' : null);

    row('no_mil_engineer12m', 'Hoàn thành 12 tháng huấn luyện thực chiến khốc liệt tại Tiểu đoàn Công binh Quốc gia (Ingeniørbataljonen)', 18, 35, function (r, log) {
      no.milBranches.engineer12m = true;
      ps.prepared = Math.min(100, ps.prepared + 10); H.fx(l, { hea: 4, kno: 2 });
      if (no.milBranches.navy && l.flags.royal) l.flags.royal.mil = true;
      log('Bạn trải qua 12 tháng huấn luyện thực chiến khắc nghiệt tại Tiểu đoàn Công binh Quốc gia ở miền Bắc Na Uy, rèn kỹ năng chiến trường và tinh thần đồng đội.', 'good');
    }, no.milBranches.engineer12m ? 'Đã hoàn thành 12 tháng tại Tiểu đoàn Công binh' : null);

    row('no_uni_env_law', 'Học Đại học: Khoa học Chính trị, Luật Hiến pháp & trọng tâm Phát triển Bền vững / Môi trường', 18, 40, function (r, log) {
      no.uniEnvLaw = Math.min(100, no.uniEnvLaw + 25);
      ps.constitution = Math.min(100, ps.constitution + 10); ps.prepared = Math.min(100, ps.prepared + 7); H.fx(l, { kno: 3 });
      log('Bạn nghiên cứu sâu về Khoa học Chính trị, Luật Hiến pháp và đặc biệt là Phát triển Bền vững / Môi trường — lĩnh vực thế mạnh và mối quan tâm hàng đầu của Na Uy.', 'good');
    });

    row('no_study_abroad', 'Du học đại học nước ngoài để mở rộng tầm nhìn quốc tế (không bị cấm như Thụy Điển)', 18, 35, function (r, log) {
      no.abroadStudy = { year: yr(l), status: 'completed' };
      ps.prepared = Math.min(100, ps.prepared + 8); H.fx(l, { kno: 3, soc: 2 });
      log('Không bị ràng buộc cấm học nước ngoài như Thụy Điển, bạn theo học chương trình đại học quốc tế ở nước ngoài trước khi trở về nước đảm nhận công vụ.', 'good');
    }, no.abroadStudy ? 'Đã hoàn thành kỳ du học quốc tế' : null);

    row('no_storting_oath', 'Tuyên thệ tuân thủ Hiến pháp trước Quốc hội Na Uy (Storting)', 18, 99, function (r, log) {
      no.stortingOath = true;
      if (q.h.accession837) q.h.accession837.stortingOath848 = true;
      ps.constitution = Math.min(100, ps.constitution + 8); R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100);
      log('Trước Quốc hội Na Uy (Storting), Đức Vua đọc lời tuyên thệ trang trọng tuân thủ Hiến pháp và pháp luật của vương quốc.', 'big');
    }, q.h.seat !== q.me.id ? 'Chỉ thực hiện khi lên ngôi Quốc vương/Nữ hoàng Na Uy' : no.stortingOath ? 'Đã tuyên thệ trước Storting' : null);

    row('no_nidaros_blessing', 'Lễ Ban Phước (Consecration/Blessing) tại Nhà thờ Nidaros ở Trondheim: Vương miện chỉ đặt trên bàn thờ, tuyệt đối không đội', 18, 99, function (r, log) {
      no.nidarosBlessing = true; no.crownOnAltarOnly = true;
      if (q.h.accession837) { q.h.accession837.ceremony = 'completed'; q.h.accession837.ceremonyAt = yr(l); q.h.accession837.crownOnAltarOnly848 = true; }
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 4, 0, 100);
      log('Na Uy đã bỏ hoàn toàn lễ đăng quang truyền thống từ năm 1908. Không có xức dầu thánh bí ẩn hay đội vương miện: Nhà vua và Hoàng hậu đến Nhà thờ Nidaros tại Trondheim nhận lời cầu nguyện và ban phước lành từ các giám mục, trong khi Vương miện Hoàng gia chỉ được đặt trang trọng trên bàn thờ như một biểu tượng lịch sử.', 'big');
    }, q.h.seat !== q.me.id ? 'Dành cho Quốc vương/Nữ hoàng mới lên ngôi' : no.nidarosBlessing ? 'Đã cử hành Lễ Ban Phước tại Nhà thờ Nidaros' : null);

    row('no_syttende_mai', 'Lễ Quốc khánh Na Uy (17/5) "không duyệt binh": Mặc trang phục truyền thống Bunad đứng trên ban công Cung điện Oslo chào đoàn diễu hành thiếu nhi', 5, 99, function (r, log) {
      no.syttendeMaiCount++;
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100); H.fx(l, { hap: 3, soc: 2 });
      log('Ngày Quốc khánh 17/5 tại Na Uy không phô diễn vũ khí quân sự: cả gia đình Hoàng gia mặc trang phục truyền thống Bunad, đứng hàng giờ trên ban công Cung điện Hoàng gia ở Oslo vẫy chào hàng chục nghìn học sinh đi bộ diễu hành qua quảng trường.', 'big');
    });

    row('no_daily_simplicity', 'Nghi lễ đời thường giản dị: Đi phương tiện công cộng hoặc tự lái xe ngoài phố không đoàn hộ tống rầm rộ', 18, 99, function (r, log) {
      no.publicTransitDrive = true;
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100); H.fx(l, { hap: 2 });
      log('Giữ đúng phong cách gần gũi của Hoàng gia Na Uy, bạn tự lái xe hoặc đi tàu điện công cộng ngoài đường phố Oslo mà không có đoàn xe hộ tống phô trương.', 'good');
    });

    row('no_sustainable_banquet', 'Tổ chức Quốc yến chiêu đãi quốc khách: trang trọng nhưng ưu tiên sản vật địa phương, thân thiện môi trường & chống lãng phí', 18, 99, function (r, log) {
      no.sustainableBanquet = true;
      ps.protocol = Math.min(100, ps.protocol + 6); R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100);
      log('Bữa tiệc chiêu đãi quốc khách tại Cung điện Oslo diễn ra vô cùng trang trọng nhưng thực đơn ưu tiên hải sản và nông sản địa phương theo mùa, thân thiện với môi trường và hạn chế tối đa sự lãng phí.', 'good');
    });

    return out;
  }, 5, 'Học tập');

  // ================= 7. Đào tạo Người kế vị & Nghi lễ Hoàng gia Đan Mạch (DK - 8.10.48) =================
  X.menu('royalDenmarkTrack848', 'Hòa nhập Giáo dục Công lập, Quân sự Người nhái & Nghi lễ Đan Mạch', function (l) {
    var q = A.context(l);
    if (X.reason(l, 5) !== true) return X.reason(l, 5);
    return q && q.c === 'DK' && q.me ? true : 'Dành cho thành viên Hoàng gia Đan Mạch từ 5 tuổi';
  }, function (l) {
    var q = A.context(l), up = upState(l, q.me), dk = up.denmarkTrack;
    return 'Hoàng gia Đan Mạch phá vỡ truyền thống "gia sư hoàng gia" biệt lập để hòa nhập vào hệ thống giáo dục quốc gia; nghi lễ bỏ đăng quang tôn giáo từ năm 1849, tập trung vào ban công Christiansborg, tính pháp lý hiến pháp và sự ấm áp "Hygge".\n' +
      '• Trường công lập chuẩn mực: ' + (dk.publicSchoolTranegard ? 'Trường tiểu học công lập Tranegårdskolen (xếp hàng, vui chơi bình đẳng cùng con em thợ điện, kỹ sư Copenhagen) ✓' : 'Chưa ghi nhận') + '.\n' +
      '• Đại học & Quốc tế: Đại học Aarhus – Khoa học Chính trị (' + dk.aarhusPoliSci + '/100)' + (dk.harvardPseudonym ? ' · Du học Harvard dưới tên giả: ' + dk.harvardPseudonym : '') + '.\n' +
      '• Quân sự chuyên sâu: Lực lượng Người nhái Hải quân (Frømandskorpset) ' + (dk.frogmanCorps ? '✓' : '○') + ' · Khóa Sĩ quan Doanh trại Antvorskov ' + (dk.antvorskovOfficer ? '✓' : '○') + '.\n' +
      '• Nghi lễ Đan Mạch (từ 1849 không đội vương miện): Tuyên bố 3 lần từ ban công Cung điện Christiansborg ' + (dk.christiansborgProclaimed ? '✓' : '○') + ' · Diễu hành xe ngựa Hygge ' + (dk.carriageProcession ? '✓' : '○') + ' · Lễ tạ ơn dân sự tại nhà thờ ' + (dk.secularThanksgiving ? '✓' : '○') + '.';
  }, function (l) {
    var q = A.context(l); if (!q || !q.me) return [];
    var ps = A.personState(l, q.me), up = upState(l, q.me), dk = up.denmarkTrack, out = [];
    function row(k, label, min, max, run, why) {
      if (l.age < min || (max && l.age > max)) return;
      out.push({ k: k, l: label, why: why || up.acted[k] === yr(l) ? why || 'Đã thực hiện năm nay' : true, run: function (l, r, log) { if (up.acted[k] === yr(l)) return; up.acted[k] = yr(l); run(r, log); } });
    }
    row('dk_public_school', 'Theo học trường tiểu học công lập Tranegårdskolen: xếp hàng và vui chơi bình đẳng như mọi trẻ em Copenhagen', 5, 16, function (r, log) {
      dk.publicSchoolTranegard = true;
      up.autonomy = Math.min(100, up.autonomy + 14); ps.prepared = Math.min(100, ps.prepared + 6);
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100); H.fx(l, { soc: 3, hap: 2 });
      log('Khép lại thời kỳ học gia sư riêng biệt tại cung điện Amalienborg, bạn đến học tại trường tiểu học công lập Tranegårdskolen: tự xếp hàng và chơi đùa bình đẳng với con của một thợ điện hay kỹ sư tại Copenhagen.', 'good');
    }, dk.publicSchoolTranegard ? 'Đã hoàn thành bậc tiểu học công lập Tranegårdskolen' : null);

    row('dk_aarhus_uni', 'Theo học Khoa học Chính trị tại Đại học Aarhus (lộ trình Thạc sĩ Khoa học Chính trị)', 18, 40, function (r, log) {
      dk.aarhusPoliSci = Math.min(100, dk.aarhusPoliSci + 25);
      ps.constitution = Math.min(100, ps.constitution + 10); ps.prepared = Math.min(100, ps.prepared + 8); H.fx(l, { kno: 3 });
      log('Sau khi tốt nghiệp trung học trong nước, bạn theo học ngành Khoa học Chính trị tại Đại học Aarhus danh tiếng, nối tiếp truyền thống hoàn thành học vị Thạc sĩ của Vua Frederik X.', 'good');
    });

    row('dk_harvard_pseudonym', 'Du học tại Đại học Harvard (Mỹ) dưới một cái tên giả để tránh truyền thông săn đón', 19, 35, function (r, log) {
      dk.harvardPseudonym = l.sex === 'F' ? 'Isabella Henriksen' : 'Frederik Henriksen';
      ps.prepared = Math.min(100, ps.prepared + 9); H.fx(l, { kno: 3, soc: 2 });
      log('Bạn lên đường du học tại Đại học Harvard (Mỹ) và đăng ký dưới cái tên giả "' + dk.harvardPseudonym + '" để tránh ống kính truyền thông, tự do tranh luận học thuật như một sinh viên quốc tế bình thường.', 'good');
    }, dk.harvardPseudonym ? 'Đã hoàn thành kỳ học tại Harvard dưới tên giả' : null);

    row('dk_antvorskov_officer', 'Gia nhập quân đội & theo học Khóa đào tạo Sĩ quan tại Doanh trại Antvorskov', 18, 35, function (r, log) {
      dk.antvorskovOfficer = true;
      ps.prepared = Math.min(100, ps.prepared + 9); H.fx(l, { hea: 3, kno: 2 });
      if (dk.frogmanCorps && l.flags.royal) l.flags.royal.mil = true;
      log('Bạn gia nhập quân đội Đan Mạch và theo học Khóa đào tạo Sĩ quan tại Doanh trại Antvorskov (Slagelse), xây dựng lý lịch quân sự vững chắc cho người kế vị.', 'good');
    }, dk.antvorskovOfficer ? 'Đã hoàn thành khóa sĩ quan tại Doanh trại Antvorskov' : null);

    row('dk_frogman_corps', 'Thử thách khắc nghiệt: Khóa huấn luyện Lực lượng Người nhái Tinh nhuệ thuộc Hải quân Đan Mạch (Frømandskorpset)', 19, 38, function (r, log) {
      dk.frogmanCorps = true;
      ps.prepared = Math.min(100, ps.prepared + 12); H.fx(l, { hea: 4, kno: 2 });
      if (l.flags.royal) l.flags.royal.mil = true;
      log('Bạn vượt qua các bài tập sinh tồn và tác chiến dưới nước khốc liệt bậc nhất thế giới của Lực lượng Người nhái Tinh nhuệ thuộc Hải quân Đan Mạch (Frømandskorpset), nối bước Vua Frederik X.', 'big');
    }, dk.frogmanCorps ? 'Đã chinh phục khóa huấn luyện Người nhái Frømandskorpset' : null);

    row('dk_christiansborg_proclamation', 'Bàn giao tại Hội đồng Nhà nước & Tuyên bố đăng quang tối giản từ ban công Cung điện Christiansborg (mặc quân phục, không đội vương miện)', 18, 99, function (r, log) {
      dk.christiansborgProclaimed = true; dk.noCrownMuseumOnly = true;
      if (q.h.accession837) { q.h.accession837.ceremony = 'completed'; q.h.accession837.ceremonyAt = yr(l); q.h.accession837.noCrownBalcony848 = true; }
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 5, 0, 100);
      log('Đan Mạch đã bỏ lễ đăng quang tôn giáo từ năm 1849. Ngay khi ký tuyên bố bàn giao quyền lực tại Hội đồng Nhà nước, Thủ tướng Đan Mạch bước ra ban công Cung điện Christiansborg hô vang ba lần trước hàng vạn người dân: "Đức vua/Nữ hoàng đã chuyển giao ngôi vị, Tân Quốc vương/Nữ hoàng vạn tuế!". Bạn xuất hiện trên ban công trong bộ quân phục chỉnh tề, vẫy chào nhân dân mà không đội bất kỳ vương miện nào (các báu vật hoàng gia chỉ trưng bày trong bảo tàng lịch sử).', 'big');
    }, q.h.seat !== q.me.id ? 'Chỉ thực hiện khi lên ngôi Quốc vương/Nữ hoàng Đan Mạch' : dk.christiansborgProclaimed ? 'Đã cử hành lễ tuyên bố trên ban công Cung điện Christiansborg' : null);

    row('dk_carriage_procession', 'Diễu hành xe ngựa cùng kỵ binh Hoàng gia qua phố phường Copenhagen trong không khí ấm áp "Hygge"', 18, 99, function (r, log) {
      dk.carriageProcession = true;
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 3, 0, 100); H.fx(l, { hap: 3 });
      log('Ngay sau lễ tuyên bố trên ban công, Vua và Hoàng hậu ngồi trên cỗ xe ngựa có lực lượng kỵ binh Hoàng gia hộ tống đi qua các con phố Copenhagen, nhận lời chúc tụng ấm áp và gần gũi theo đúng tinh thần "Hygge" của người Đan Mạch.', 'good');
    }, q.h.seat !== q.me.id ? 'Dành cho Quốc vương/Nữ hoàng và phối ngẫu sau lễ tuyên bố' : null);

    row('dk_secular_thanksgiving', 'Dự buổi lễ tạ ơn ngắn tại nhà thờ: mang tính dân sự, văn hóa và gắn kết dân tộc thay vì thần quyền', 18, 99, function (r, log) {
      dk.secularThanksgiving = true;
      R.st(l).cred = U.clamp((R.st(l).cred == null ? 60 : R.st(l).cred) + 2, 0, 100);
      log('Vài ngày sau lễ lên ngôi, gia đình Hoàng gia tham dự buổi lễ tạ ơn ngắn gọn tại nhà thờ, mang đậm tính dân sự và văn hóa dân tộc thay vì nghi thức thần quyền.', 'good');
    }, q.h.seat !== q.me.id ? 'Dành cho Quốc vương/Nữ hoàng sau khi lên ngôi' : null);

    return out;
  }, 5, 'Học tập');

  // Mở rộng royalCeremony837 cho Na Uy (NO) và Đan Mạch (DK)
  if (E.DEC.royalCeremony837) {
    var oldCerMake = E.DEC.royalCeremony837.make, oldCerApply = E.DEC.royalCeremony837.apply;
    E.DEC.royalCeremony837.make = function (l, r, arg) {
      var d = oldCerMake.apply(this, arguments), q = A.context(l);
      if (!q || !q.me) return d;
      d.data.keys = d.data.keys || [];
      function appendCer(k, label) {
        var idx = String(d.opts.length);
        d.data.keys.push(k);
        d.opts.push({ k: idx, l: label, h: '' });
      }
      if (q.c === 'NO') {
        d.text = 'Na Uy đã bỏ hoàn toàn lễ đăng quang truyền thống từ năm 1908: tân vương tuyên thệ trước Quốc hội (Storting) và nhận Lễ Ban Phước tại Nhà thờ Nidaros (Trondheim) với Vương miện chỉ đặt trên bàn thờ, tuyệt đối không đội. Quốc khánh 17/5 mặc Bunad vẫy chào đoàn diễu hành thiếu nhi thay vì duyệt binh quân sự; quốc yến ưu tiên sản vật địa phương bền vững.';
        appendCer('open_no848', 'Mở nghi lễ Na Uy: Tuyên thệ Storting, Lễ Ban Phước Nidaros, Quốc khánh 17/5 & Đời thường giản dị');
      } else if (q.c === 'DK') {
        d.text = 'Đan Mạch đã bỏ lễ đăng quang tôn giáo từ năm 1849: chuyển giao quyền lực tại Hội đồng Nhà nước, Thủ tướng tuyên bố 3 lần trên ban công Cung điện Christiansborg, nhà vua mới mặc quân phục không đội vương miện, sau đó diễu hành xe ngựa ấm áp kiểu "Hygge" và dự lễ tạ ơn dân sự.';
        appendCer('open_dk848', 'Mở nghi lễ Đan Mạch: Tuyên bố ban công Christiansborg, Diễu hành xe ngựa Hygge & Lễ tạ ơn');
      }
      return d;
    };
    E.DEC.royalCeremony837.apply = function (l, d, k, r, log) {
      var key = d && d.data && d.data.keys && d.data.keys[Number(k)];
      if (key === 'open_no848') { X.next(l, 'royalNorwayTrack848', r); return; }
      if (key === 'open_dk848') { X.next(l, 'royalDenmarkTrack848', r); return; }
      return oldCerApply.apply(this, arguments);
    };
  }

  // ================= 8. Ấn Độ (IN - Tách biệt tuyệt đối với VN): Đẳng cấp Varna, Họ (Surname), Tôn giáo chi tiết & Hạn ngạch SC/ST/OBC/EWS (8.10.49) =================
  var INDIA_VARNAS849 = {
    Brahmin: {
      key: "Brahmin",
      vnName: "Bà-la-môn (Brahmin — Tu sĩ, học giả, triết gia & lãnh đạo tôn giáo)",
      popGroup: "Forward Castes / General (~20–25% dân số)",
      defaultCat: "GEN",
      surnames: ["Sharma", "Chaturvedi", "Trivedi", "Banerjee", "Mukherjee", "Iyer", "Iyengar"],
      surnameMeaning: "Họ gắn với học thức, kinh điển Veda (Chaturvedi: thông suốt 4 bộ kinh Veda; Trivedi: 3 bộ kinh Veda; Sharma: sự bảo hộ; Banerjee/Mukherjee: học giả Bengal; Iyer/Iyengar: Brahmin miền Nam)."
    },
    Kshatriya: {
      key: "Kshatriya",
      vnName: "Sát-đế-lợi (Kshatriya — Vua chúa, quý tộc, chiến binh & lãnh đạo chính trị/quân sự)",
      popGroup: "Forward Castes / General (~20–25% dân số)",
      defaultCat: "GEN",
      surnames: ["Singh", "Roy", "Rai", "Chauhan", "Rathore"],
      surnameMeaning: "Họ gắn với quyền lực, đất đai và hoàng tộc (Singh: Sư tử của người Rajput vùng Rajasthan; Roy/Rai: Vua/Chúa đất; Chauhan, Rathore)."
    },
    Vaishya: {
      key: "Vaishya",
      vnName: "Phệ-xá (Vaishya — Thương nhân, tài chính, kế toán & chủ đất giàu có)",
      popGroup: "Forward Castes / một số nhánh nhỏ thuộc OBC",
      defaultCat: "GEN",
      surnames: ["Gupta", "Agarwal", "Aggarwal", "Shah", "Mehta"],
      surnameMeaning: "Họ gắn với giao thương, kế toán, tiền tệ (Gupta: người bảo vệ kho tàng; Agarwal: thương nhân vùng Agroha; Shah: thương gia; Mehta: kế toán/quản lý)."
    },
    Shudra: {
      key: "Shudra",
      vnName: "Thu-đà (Shudra — Tầng lớp lao động, nông dân nhỏ, thợ thủ công & phục vụ)",
      popGroup: "OBC (Other Backward Classes — ~41–45% dân số, nhóm đông nhất Ấn Độ, có tiếng nói chính trị rất mạnh)",
      defaultCat: "OBC",
      surnames: ["Kumar", "Yadav", "Kurmi", "Patel"],
      surnameMeaning: "Họ bắt nguồn từ nghề thủ công truyền thống (như Kumar: thợ gốm — nay phổ biến ở nhiều tầng lớp) hoặc cộng đồng nông nghiệp địa phương."
    },
    Dalit: {
      key: "Dalit",
      vnName: "Dalit (Ngoài hệ thống 4 đẳng cấp Varna / Tiện dân)",
      popGroup: "SC (Scheduled Castes — ~16.6% dân số Ấn Độ)",
      defaultCat: "SC",
      surnames: ["Jatav", "Chamar", "Kumar", "Mahar", "Valmiki"],
      surnameMeaning: "Họ từng gắn với công việc chân tay bị cổ thư coi là 'ô uế' (xử lý da thuộc, dọn dẹp, dệt vải như Jatav, Chamar) hoặc tên làng xã; nhiều người dùng họ Kumar để giảm kỳ thị khi giao tiếp."
    },
    Adivasi: {
      key: "Adivasi",
      vnName: "Bộ tộc bản địa (Adivasi / Scheduled Tribes)",
      popGroup: "ST (Scheduled Tribes — ~8.6% dân số, sống ở vùng sâu vùng xa, miền núi và Đông Bắc Ấn Độ)",
      defaultCat: "ST",
      surnames: ["Murmu", "Soren", "Munda", "Oraon"],
      surnameMeaning: "Họ trùng với tên bộ tộc bản địa hoặc vùng núi sinh sống."
    }
  };

  var INDIA_CATEGORIES = {
    SC: {
      code: "SC",
      name: "SC (Scheduled Castes — Đẳng cấp được xếp lịch / Dalit, ~16.6% dân số)",
      quotaShare: 0.15,
      quotaLabel: "15% hạn ngạch",
      cutoffIIT: 48,
      cutoffAIIMS: 50,
      tuitionWaiver: 1.0,
      freeHostel: true,
      stipendFactor: 0.18,
      varnaOrigin: "Nhóm Dalit nằm ngoài 4 đẳng cấp Varna truyền thống, từng chịu sự kỳ thị và cô lập nặng nề nhất trong lịch sử."
    },
    ST: {
      code: "ST",
      name: "ST (Scheduled Tribes — Bộ tộc được xếp lịch, ~8.6% dân số)",
      quotaShare: 0.075,
      quotaLabel: "7.5% hạn ngạch",
      cutoffIIT: 46,
      cutoffAIIMS: 48,
      tuitionWaiver: 1.0,
      freeHostel: true,
      stipendFactor: 0.18,
      varnaOrigin: "Các cộng đồng dân tộc thiểu số bản địa sống ở vùng sâu vùng xa, miền núi (như Đông Bắc Ấn Độ)."
    },
    OBC: {
      code: "OBC",
      name: "OBC (Other Backward Classes — Các tầng lớp kém phát triển khác, ~41–45% dân số)",
      quotaShare: 0.27,
      quotaLabel: "27% hạn ngạch",
      cutoffIIT: 60,
      cutoffAIIMS: 63,
      tuitionWaiver: 0.5,
      freeHostel: false,
      stipendFactor: 0.08,
      varnaOrigin: "Nhóm đông dân nhất Ấn Độ, chủ yếu gồm tầng lớp Thu-đà (Shudra) và một số nhánh nhỏ Phệ-xá (Vaishya), có tiếng nói chính trị rất mạnh do số lượng áp đảo."
    },
    EWS: {
      code: "EWS",
      name: "EWS (Economically Weaker Sections — Phân khúc kinh tế yếu thế thuộc đẳng cấp trên)",
      quotaShare: 0.10,
      quotaLabel: "10% hạn ngạch bổ sung",
      cutoffIIT: 68,
      cutoffAIIMS: 72,
      tuitionWaiver: 0.5,
      freeHostel: false,
      stipendFactor: 0.06,
      varnaOrigin: "Chính sách bổ sung 10% hạn ngạch dành cho những người thuộc đẳng cấp trên (Bà-la-môn Brahmin, Sát-đế-lợi Kshatriya, Phệ-xá Vaishya) nhưng có hoàn cảnh kinh tế khó khăn."
    },
    GEN: {
      code: "GEN",
      name: "General / Forward Castes (Tầng lớp trên không thuộc diện ưu tiên, ~20–25% dân số)",
      quotaShare: 0.405,
      quotaLabel: "Cạnh tranh tự do (điểm chuẩn rất cao)",
      cutoffIIT: 78,
      cutoffAIIMS: 82,
      tuitionWaiver: 0,
      freeHostel: false,
      stipendFactor: 0,
      varnaOrigin: "Gồm các đẳng cấp cao truyền thống (Brahmin, Kshatriya, Vaishya khá giả) nắm giữ phần lớn của cải và vị trí lãnh đạo, cạnh tranh điểm chuẩn rất cao."
    }
  };

  var INDIA_RELIGIONS849 = {
    Hindu: {
      share: "~79.8% dân số Ấn Độ",
      branches: [
        { k: "vaishnavism", name: "Vaishnavism (Thờ thần Vishnu, ~65–70%)", desc: "Chiếm đại đa số người Hindu; rất phổ biến ở miền Bắc, miền Tây và miền Trung Ấn Độ." },
        { k: "shaivism", name: "Shaivism (Thờ thần Shiva, ~25%)", desc: "Phát triển mạnh ở miền Nam Ấn Độ (như bang Tamil Nadu), vùng Kashmir và dãy Himalaya." },
        { k: "shaktism", name: "Shaktism (Thờ Nữ thần, ~3–5%)", desc: "Tập trung rất đông ở phía Đông Ấn Độ (bang Tây Bengal, Assam) với đại lễ hội Durga Puja." },
        { k: "smartism", name: "Smartism & Triết học Advaita Vedanta (~2–3%)", desc: "Nhóm trí thức, triết học tự do và các phong trào cải cách hiện đại." }
      ]
    },
    Islam: {
      share: "~14.2% dân số Ấn Độ (một trong những cộng đồng Hồi giáo lớn nhất thế giới; chịu tỷ lệ nghèo và mù chữ cao hơn mặt bằng chung do rào cản lịch sử)",
      branches: [
        { k: "sunni_barelvi", name: "Dòng Sunni – Trường phái Barelvi (~85–90% Hồi giáo Ấn Độ)", desc: "Chiếm tuyệt đại đa số người Hồi giáo Ấn Độ, chịu ảnh hưởng đậm nét của truyền thống Sufi." },
        { k: "sunni_deobandi", name: "Dòng Sunni – Trường phái Deobandi", desc: "Trường phái thần học cải cách khởi phát từ Bắc Ấn Độ." },
        { k: "shia", name: "Dòng Shia (~10–15% — lớn thứ 3 thế giới)", desc: "Tập trung đông tại các thành phố Lucknow, Hyderabad và vùng Jammu & Kashmir." }
      ]
    },
    Christian: {
      share: "~2.3% dân số Ấn Độ",
      branches: [
        { k: "catholic_in", name: "Công giáo (~50–60% Kitô hữu Ấn Độ)", desc: "Bao gồm Công giáo La Mã (Goa, Mumbai) và các Giáo hội Công giáo Đông phương tại bang Kerala." },
        { k: "csi_cni", name: "Tin Lành Hợp nhất: CSI (miền Nam, 1947) & CNI (miền Bắc, 1970) (~50% khối Tin Lành)", desc: "Mô hình Hợp nhất Giáo hội độc đáo sau khi Anh rút đi (hợp nhất Anh giáo, Giám lý, Trưởng lão, Congregational), giữ quản lý Giám mục (Episcopal) và sở hữu các trường đại học, bệnh viện danh tiếng như Đại học Y Christian Medical College (CMC) Vellore." },
        { k: "baptist_ne", name: "Tin Lành Báp-tít vùng Đông Bắc (~25% khối Tin Lành — Nagaland >90% Báp-tít, Mizoram, Meghalaya)", desc: "Bắt nguồn từ các nhà truyền giáo Mỹ thế kỷ 19; tự trị từng nhà thờ địa phương, báp-tít người trưởng thành và gắn sâu với bản sắc tộc người vùng cao." },
        { k: "pentecostal_in", name: "Phong trào Ngũ Tuần (Tin Lành)", desc: "Bùng nổ nhờ nguồn tài trợ quốc tế cho quỹ từ thiện, trường học miễn phí và bệnh viện, thu hút người nghèo và tầng lớp thấp tìm cơ hội thay đổi số phận." },
        { k: "malankara_orthodox", name: "Chính Thống giáo Đông phương (~10–15% — Giáo hội Syria Malankara miền Nam)", desc: "Cộng đồng Kitô hữu cổ xưa và lâu đời nhất tại miền Nam Ấn Độ." }
      ]
    },
    Sikh: {
      share: "~1.7% dân số Ấn Độ (thịnh vượng nông nghiệp tại 'vựa lúa' Punjab & có tiếng nói quyền lực lớn trong quân đội, chính trị)",
      branches: [
        { k: "khalsa", name: "Khalsa Sikhs (Chính thống, ~70–80%)", desc: "Đã làm lễ rửa tội, tuân thủ nghiêm ngặt '5K', quấn khăn Turban che tóc dài, giữ dao găm nghi lễ và mang họ Singh (nam) hoặc Kaur (nữ)." },
        { k: "sahajdhari", name: "Sahajdhari Sikhs (~20–30%)", desc: "Tin và tôn kính kinh sách đạo Sikh nhưng có thể cắt tóc hoặc không giữ trọn vẹn vẻ ngoài của Khalsa." }
      ]
    },
    Buddhist: {
      share: "~0.7% dân số Ấn Độ (gắn liền với phong trào giải phóng giai cấp Dalit)",
      branches: [
        { k: "navayana", name: "Navayana (Tân Phật giáo, ~85–90% — bang Maharashtra)", desc: "Do Tiến sĩ B.R. Ambedkar khởi xướng năm 1956 như một tuyên ngôn chính trị từ chối hệ thống đẳng cấp Hindu và đòi bình đẳng dân sự." },
        { k: "vajrayana", name: "Kim Cương thừa (Tây Tạng, ~5–7%)", desc: "Gồm người dân vùng cao Himalaya (Ladakh, Arunachal Pradesh) và cộng đồng Tây Tạng tị nạn." },
        { k: "theravada_mahayana", name: "Nguyên thủy & Đại thừa (~3–5%)", desc: "Các cộng đồng bản địa vùng biên giới phía Đông (gần Myanmar) và chư tăng tại các thánh tích." }
      ]
    },
    Jain: {
      share: "~0.4% dân số Ấn Độ (tỷ lệ biết chữ và thu nhập bình quân cao nhất Ấn Độ; thực hành Ahimsa – Bất hại, làm thương mại, ngân hàng, vàng & kim cương toàn cầu)",
      branches: [
        { k: "svetambara", name: "Svetambara (Bạch y phái / Áo trắng, ~65–70%)", desc: "Tu sĩ mặc đồ trắng, cởi mở với thương mại và đời sống thế tục, chấp nhận phụ nữ đạt giải thoát; có ngân sách khổng lồ xây đền đá cẩm thạch tráng lệ (như đền Dilwara) và vận động chính sách." },
        { k: "digambara", name: "Digambara (Không y phái / Khỏa thân, ~30–35%)", desc: "Tu sĩ khỏa thân biểu thị sự từ bỏ tuyệt đối; khắt khe và bảo thủ hơn." }
      ]
    },
    Parsi: {
      share: "Hỏa giáo (Người Parsi — chưa đầy 60.000 người, quyền lực kinh tế công nghiệp & từ thiện)",
      branches: [
        { k: "parsi_zoroastrian", name: "Cộng đồng Parsi (Hỏa giáo — tiêu biểu như gia tộc Tata / Tata Group)", desc: "Quyền lực hàng đầu trong công nghiệp hóa Ấn Độ (sở hữu những thương hiệu lớn như Jaguar Land Rover, Air India) đi đôi với truyền thống từ thiện xây bệnh viện và viện nghiên cứu lớn nhất đất nước." }
      ]
    }
  };

  var SC_ELIGIBLE_FAITHS = ["Ấn Độ giáo", "Hindu", "Phật giáo", "Phật giáo Navayana", "Sikh giáo", "Đạo Sikh"];

  // Chỉ áp dụng cho nhân vật Ấn Độ (mode world, country IN), tuyệt đối không áp dụng cho nhân vật Việt Nam
  function inIndia848(l) {
    return Boolean(l && l.mode === "world" && l.country === "IN" && H.resCode(l) === "IN");
  }

  function inVN849(l) {
    return Boolean(l && (l.mode === "vn" || l.country === "VN") && H.resCode(l) === "VN");
  }

  function indiaState848(l) {
    var w = E.WORLD120.s(l);
    if (!w.india848) {
      var qFam = (l.fam && l.fam.q) || 2;
      var rr = rng(l.id + ":india848");
      var orig = qFam <= 1 ? (rr() < 0.65 ? "SC" : "ST") : qFam === 2 ? (rr() < 0.45 ? "SC" : "OBC") : qFam === 3 ? (rr() < 0.55 ? "OBC" : "GEN") : "GEN";
      var varna = orig === "SC" ? "Dalit" : orig === "ST" ? "Adivasi" : orig === "OBC" ? "Shudra" : (rr() < 0.35 ? "Brahmin" : rr() < 0.65 ? "Kshatriya" : "Vaishya");
      var vInfo = INDIA_VARNAS849[varna] || INDIA_VARNAS849.Shudra;
      var sur = vInfo.surnames[Math.floor(rr() * vInfo.surnames.length)];
      var curFaith = l.religion || "Ấn Độ giáo";
      var scLost = orig === "SC" && !SC_ELIGIBLE_FAITHS.includes(curFaith);
      var ewsEligible = orig === "GEN" && qFam <= 2;
      w.india848 = {
        varna: varna,
        surname: sur,
        origCategory: orig,
        activeCategory: scLost ? "GEN" : (ewsEligible ? "EWS" : orig),
        faith: curFaith,
        faithBranch: "vaishnavism",
        sikhKhalsa: false,
        scQuotaLostByConversion: scLost,
        socialStigmaRemains: orig === "SC" || orig === "ST",
        navayanaConverted: false,
        admittedInst: null,
        scholarshipClaimed: false,
        socialMobilityCivil: false,
        debatedQuota: false,
        hindutvaObserved: false,
        acted: {}
      };
    }
    if (!w.india848.varna) {
      w.india848.varna = w.india848.origCategory === "SC" ? "Dalit" : w.india848.origCategory === "ST" ? "Adivasi" : w.india848.origCategory === "OBC" ? "Shudra" : "Brahmin";
      w.india848.surname = INDIA_VARNAS849[w.india848.varna].surnames[0];
    }
    return w.india848;
  }

  function syncIndiaCategory848(l, st) {
    st = st || indiaState848(l);
    var qFam = (l.fam && l.fam.q) || 2;
    if (st.origCategory === "SC") {
      if (SC_ELIGIBLE_FAITHS.includes(st.faith)) {
        st.activeCategory = "SC";
        st.scQuotaLostByConversion = false;
      } else {
        st.activeCategory = "GEN";
        st.scQuotaLostByConversion = true;
        st.socialStigmaRemains = true;
      }
    } else if (st.origCategory === "GEN") {
      st.activeCategory = (st.ewsApproved || qFam <= 1) ? "EWS" : "GEN";
    } else {
      st.activeCategory = st.origCategory;
    }
    return st;
  }

  X.menu("indiaQuotaFaith848", "Hệ thống Đẳng cấp, Họ tên, Tôn giáo & Hạn ngạch Suất học (Ấn Độ)", function (l) {
    if (!l.alive || !inIndia848(l)) return "Không áp dụng: chỉ dành cho công dân Ấn Độ đang sinh sống tại Ấn Độ";
    return X.reason(l, 12);
  }, function (l) {
    var st = syncIndiaCategory848(l), cat = INDIA_CATEGORIES[st.activeCategory] || INDIA_CATEGORIES.GEN, vInfo = INDIA_VARNAS849[st.varna] || INDIA_VARNAS849.Shudra;
    var lossNote = st.scQuotaLostByConversion
      ? "⚠ Giao thoa pháp lý – tôn giáo: Xuất thân là Dalit (SC), nhưng do cải đạo sang " + st.faith + " (ngoài Hindu giáo, Phật giáo và Sikh giáo), bạn bị mất tư cách pháp lý SC và mất suất học bổng/hạn ngạch 15% (với lý do pháp lý rằng Kitô giáo/Hồi giáo về giáo lý không công nhận đẳng cấp), dù định kiến xã hội thực tế vẫn chưa biến mất.\n"
      : "";
    return "• Tầng lớp & Họ (Surname như 'thẻ căn cước xã hội'): " + vInfo.vnName + " · Họ gia đình: " + st.surname + " (" + vInfo.popGroup + ").\n" +
      "• Danh mục pháp lý Hiến pháp Ấn Độ: " + cat.name + " (" + cat.quotaLabel + "). Tôn giáo hiện tại: " + st.faith + (st.faithBranch ? " · Nhánh: " + st.faithBranch : "") + ".\n" +
      lossNote +
      "• Ngưỡng điểm chuẩn mô phỏng: Kỹ thuật IIT (" + cat.cutoffIIT + "/100) · Y khoa AIIMS (" + cat.cutoffAIIMS + "/100, ngành cực kỳ đắt đỏ và giới hạn chỉ tiêu khắt khe)." +
      (st.admittedInst ? "\n• Trường đã trúng tuyển: " + st.admittedInst + (st.scholarshipClaimed ? " (đã nhận miễn/giảm học phí, ký túc xá & trợ cấp)" : "") + "." : "");
  }, function (l) {
    if (!inIndia848(l)) return [];
    var st = syncIndiaCategory848(l), cat = INDIA_CATEGORIES[st.activeCategory] || INDIA_CATEGORIES.GEN, vInfo = INDIA_VARNAS849[st.varna] || INDIA_VARNAS849.Shudra, out = [];
    function row(k, label, min, run, why) {
      if (l.age < min) return;
      out.push({ k: k, l: label, why: why || st.acted[k] === yr(l) ? why || "Đã thực hiện năm nay" : true, run: function (l, r, log) { if (st.acted[k] === yr(l)) return; st.acted[k] = yr(l); run(r, log); } });
    }

    // 1. Họ (Surname) phản ánh tầng lớp Varna, nghề nghiệp cổ xưa & quê quán
    row("surname_identity", "Tìm hiểu Họ gia đình (" + st.surname + ") — 'thẻ căn cước' hiển thị đẳng cấp Varna, tôn giáo & quê quán", 12, function (r, log) {
      l.sur = st.surname;
      H.fx(l, { kno: 2 });
      log("Tại Ấn Độ, Họ (Surname) chính là 'thẻ căn cước xã hội' ngay khi giới thiệu bản thân. Họ " + st.surname + " của bạn thuộc nhóm " + vInfo.vnName + ": " + vInfo.surnameMeaning, "neutral");
    });

    // 2. Phân khúc kinh tế yếu thế EWS (10% hạn ngạch cho người thuộc đẳng cấp Brahmin / Kshatriya / Vaishya có hoàn cảnh khó khăn)
    if (st.origCategory === "GEN" && st.activeCategory !== "EWS") {
      row("apply_ews_10", "Đăng ký hồ sơ EWS (Phân khúc kinh tế yếu thế — 10% hạn ngạch cho người thuộc đẳng cấp Brahmin/Kshatriya/Vaishya có hoàn cảnh khó khăn)", 15, function (r, log) {
        st.ewsApproved = true;
        syncIndiaCategory848(l, st);
        log("Bạn thuộc tầng lớp trên (" + vInfo.vnName + ") nhưng gia đình có hoàn cảnh kinh tế khó khăn nên được chứng nhận diện EWS (Economically Weaker Sections — 10% hạn ngạch bổ sung), giúp giảm ngưỡng điểm chuẩn đại học và được hỗ trợ một phần học phí.", "good");
      }, ((l.fam && l.fam.q) || 2) > 2 && l.money > l.base * 1.5 ? "Chỉ áp dụng cho hộ gia đình thuộc đẳng cấp trên có thu nhập/tài sản thấp" : null);
    }

    // 3. Các nhánh tôn giáo đặc thù tại Ấn Độ (Hindu, Hồi giáo Sunni/Shia, Kitô giáo CSI/CNI/Báp-tít/Malankara, Sikh Khalsa/Sahajdhari, Kỳ Na giáo Svetambara/Digambara, Hỏa giáo Parsi)
    row("hindu_branches", "Thực hành truyền thống Hindu giáo (~79.8% dân số): Vaishnavism (Vishnu), Shaivism (Shiva), Shaktism (Durga Puja) & Smartism", 12, function (r, log) {
      var b = INDIA_RELIGIONS849.Hindu.branches[hash(l.id + yr(l)) % INDIA_RELIGIONS849.Hindu.branches.length];
      st.faith = "Ấn Độ giáo"; l.religion = "Ấn Độ giáo"; st.faithBranch = b.name;
      syncIndiaCategory848(l, st); H.fx(l, { hap: 2, kno: 2 });
      log("Bạn gắn bó với nhánh " + b.name + ": " + b.desc, "good");
    });

    row("christian_csi_cni_baptist", "Tìm hiểu mô hình Giáo hội Hợp nhất Ấn Độ (CSI miền Nam 1947 / CNI miền Bắc 1970, Đại học Y CMC Vellore), Báp-tít Đông Bắc (Nagaland) & Chính thống Syria Malankara", 14, function (r, log) {
      var b = INDIA_RELIGIONS849.Christian.branches[hash(l.id + ":chr:" + yr(l)) % INDIA_RELIGIONS849.Christian.branches.length];
      st.faithBranch = b.name; H.fx(l, { kno: 3, soc: 2 });
      log("Khác với đa số quốc gia nơi các hệ phái Tin Lành hoạt động tách biệt, Ấn Độ có mô hình Hợp nhất Giáo hội độc đáo (CSI năm 1947 và CNI năm 1970 chiếm ~50% khối Tin Lành, sở hữu các trường đại học và bệnh viện danh tiếng như CMC Vellore), bên cạnh vùng Đông Bắc Nagaland (>90% Báp-tít), Công giáo Goa/Kerala và Giáo hội Chính thống Syria Malankara lâu đời nhất miền Nam. Ghi nhận tìm hiểu: " + b.name + ".", "good");
    });

    row("sikh_khalsa_punjab", "Thực hành Đạo Sikh (~1.7% dân số tại 'vựa lúa' Punjab): Lễ rửa tội Khalsa ('5K', khăn Turban, họ Singh/Kaur) vs. Sahajdhari", 14, function (r, log) {
      st.faith = "Đạo Sikh"; l.religion = "Đạo Sikh";
      st.sikhKhalsa = true;
      st.surname = l.sex === "F" ? "Kaur" : "Singh";
      l.sur = st.surname;
      st.faithBranch = "Khalsa Sikhs (Chính thống ~70–80%, giữ 5K & họ " + st.surname + ")";
      syncIndiaCategory848(l, st); H.fx(l, { hap: 3, hea: 2, soc: 2 });
      log("Bạn thực hành truyền thống Khalsa Sikhs chính thống tại bang Punjab: tuân thủ nghiêm ngặt '5K', quấn khăn Turban, giữ dao găm nghi lễ và mang họ " + st.surname + " (" + (l.sex === "F" ? "Kaur cho nữ" : "Singh cho nam") + "). Cộng đồng người Sikh biến Punjab thành 'vựa lúa' trù phú của Ấn Độ và có tiếng nói quyền lực trong quân đội lẫn chính trị.", "big");
    });

    row("jain_parsi_economy", "Giao lưu mạng lưới kinh tế Kỳ Na giáo (Ahimsa – Bạch y phái Svetambara / Không y phái Digambara, kim cương & ngân hàng) và Hỏa giáo Parsi (tập đoàn công nghiệp & từ thiện)", 18, function (r, log) {
      st.faithBranch = "Mạng lưới thương mại Jain (Svetambara) & công nghiệp Parsi";
      H.fx(l, { kno: 3, soc: 3 });
      H.cash(l, Math.round(l.base * 0.25), "Hợp tác thương mại & quỹ học thuật Jain / Parsi");
      log("Tuy chỉ chiếm 0.4% dân số, người theo Kỳ Na giáo (Jain) có tỷ lệ biết chữ và thu nhập bình quân cao nhất Ấn Độ: vì giữ giới Ahimsa (Bất hại, không làm nông nghiệp sợ hại côn trùng/rễ cây), họ chuyển sang tài chính, ngân hàng, vàng và đá quý toàn cầu; nhánh Áo trắng (Svetambara ~65–70%) dùng tiềm lực kinh tế xây các đền đá cẩm thạch tráng lệ như đền Dilwara. Bên cạnh đó, cộng đồng Hỏa giáo Parsi (<60.000 người, như gia tộc Tata) nắm quyền lực công nghiệp hóa và xây dựng các bệnh viện, viện nghiên cứu hàng đầu đất nước.", "big");
    });

    // 4. Làn sóng cải đạo sang Phật giáo Tân xe (Navayana - B.R. Ambedkar 1956) hoặc Kitô giáo / Hồi giáo / Ngũ Tuần
    if (st.origCategory === "SC" || st.origCategory === "OBC" || st.origCategory === "ST") {
      row("convert_navayana", "Cải đạo sang Phật giáo Tân xe (Navayana – truyền thống Tiến sĩ B.R. Ambedkar 1956): tuyên ngôn chính trị đòi bình đẳng & giữ nguyên hạn ngạch SC", 14, function (r, log) {
        st.faith = "Phật giáo Navayana"; l.religion = "Phật giáo";
        st.faithBranch = "Navayana (Tân Phật giáo ~85–90% Phật tử Ấn Độ, bang Maharashtra)";
        st.navayanaConverted = true;
        syncIndiaCategory848(l, st);
        H.fx(l, { hap: 4, kno: 2 });
        log("Noi gương phong trào năm 1956 của Tiến sĩ B.R. Ambedkar (cha đẻ Hiến pháp Ấn Độ, người dẫn dắt hơn 365.000 người Dalit cải đạo), bạn chuyển sang Phật giáo Tân xe (Navayana): đây không chỉ là thay đổi tâm linh mà còn là tuyên ngôn chính trị từ chối hệ thống đẳng cấp Hindu và đòi bình đẳng dân sự, đồng thời vẫn giữ nguyên tư cách pháp lý SC (15% chỉ tiêu).", "big");
      }, st.faith === "Phật giáo Navayana" ? "Đang theo Phật giáo Navayana" : null);

      row("convert_christian_islam", "Cải đạo sang Kitô giáo (hoặc phong trào Ngũ Tuần / Hồi giáo Sunni-Shia): nhận hỗ trợ giáo dục/từ thiện nhưng mất tư cách pháp lý SC", 14, function (r, log) {
        var nextFaith = r() < 0.5 ? "Kitô giáo" : "Hồi giáo";
        st.faith = nextFaith; l.religion = nextFaith === "Kitô giáo" ? "Tin Lành" : "Hồi giáo";
        st.faithBranch = nextFaith === "Kitô giáo" ? "Tin Lành Ngũ Tuần / Giáo hội Hợp nhất (hỗ trợ trường học, bệnh viện miễn phí)" : "Hồi giáo Sunni (Barelvi/Deobandi) & Shia";
        syncIndiaCategory848(l, st);
        H.fx(l, { hap: 1, kno: 2 });
        if (st.origCategory === "SC") {
          log("Bạn cải đạo sang " + nextFaith + " để thoát khỏi định kiến đẳng cấp và tiếp cận các chương trình trường học, bệnh viện từ thiện. Tuy nhiên, theo luật Ấn Độ (chỉ công nhận SC cho người theo Hindu, Phật giáo và Sikh giáo), bạn bị tước tư cách pháp lý SC cùng suất học bổng/hạn ngạch 15%, dù sự kỳ thị xã hội ngoài đời thực vẫn không hề giảm bớt.", "bad");
        } else {
          log("Bạn cải đạo sang " + nextFaith + " (" + st.faithBranch + ").", "neutral");
        }
      }, ["Kitô giáo", "Hồi giáo"].includes(st.faith) ? "Đã cải đạo sang " + st.faith : null);
    }

    // 5. Thi tuyển vào IIT (Kỹ thuật) hoặc AIIMS (Y khoa) với cơ chế Hạn ngạch (SC 15%, ST 7.5%, OBC 27%, EWS 10% vs General)
    row("apply_iit", "Ứng tuyển Học viện Công nghệ Ấn Độ (IIT) — Điểm chuẩn nhóm " + st.activeCategory + ": " + cat.cutoffIIT + "/100", 17, function (r, log) {
      var score = Math.round(l.st.kno || 50);
      if (score < cat.cutoffIIT) {
        log("Điểm học lực hiện tại (" + score + "/100) chưa đạt ngưỡng trúng tuyển IIT của nhóm " + st.activeCategory + " (cần " + cat.cutoffIIT + "/100)." + (st.scQuotaLostByConversion ? " Do đã mất tư cách SC sau khi cải đạo sang " + st.faith + ", bạn phải cạnh tranh ở ngưỡng điểm rất cao của nhóm General (78/100)." : ""), "bad");
        return;
      }
      st.admittedInst = "IIT (Học viện Công nghệ Ấn Độ)";
      l.school = "uni"; l.major = "it"; l.schoolEnd = Math.max(l.schoolEnd || 0, l.age + 4);
      H.fx(l, { kno: 5, hap: 4 });
      log("Trúng tuyển vào " + st.admittedInst + " theo diện " + cat.name + "! " + (st.activeCategory === "GEN" ? "Bạn vượt qua tỷ lệ chọi khốc liệt của nhóm phổ thông (General)." : "Chính sách hạn ngạch Hiến pháp (" + cat.quotaLabel + ") đã mở cánh cửa đại học danh tiếng cho bạn."), "big");
    }, st.admittedInst ? "Đã trúng tuyển " + st.admittedInst : null);

    row("apply_aiims", "Ứng tuyển Viện Khoa học Y khoa Toàn Ấn (AIIMS – Ngành Y) — Điểm chuẩn nhóm " + st.activeCategory + ": " + cat.cutoffAIIMS + "/100", 17, function (r, log) {
      var score = Math.round(l.st.kno || 50);
      var medCost = l.base * (1 - cat.tuitionWaiver) * 1.4;
      if (score < cat.cutoffAIIMS) {
        log("Ngành Y tại AIIMS là một trong những ngành có điểm chuẩn cao nhất và giới hạn chỉ tiêu khắt khe nhất: điểm của bạn (" + score + "/100) chưa đạt mức " + cat.cutoffAIIMS + "/100 của diện " + st.activeCategory + ".", "bad");
        return;
      }
      if (cat.tuitionWaiver < 1 && l.money < medCost && ((l.fam && l.fam.q) || 2) < 4) {
        log("Dù đủ điểm, ngành Y đòi hỏi chi phí rất lớn (" + H.money(l, medCost) + ") trong khi bạn không thuộc diện miễn toàn bộ học phí SC/ST và gia đình chưa đủ điều kiện kinh tế.", "bad");
        return;
      }
      if (medCost > 0 && l.money >= medCost) H.cash(l, -medCost, "Học phí ngành Y (AIIMS)");
      st.admittedInst = "AIIMS (Viện Khoa học Y khoa Toàn Ấn)";
      l.school = "uni"; l.major = "med"; l.schoolEnd = Math.max(l.schoolEnd || 0, l.age + 5);
      H.fx(l, { kno: 6, hap: 5 });
      log("Bạn đỗ vào ngành Y danh giá tại " + st.admittedInst + " (diện " + st.activeCategory + ")! " + (cat.tuitionWaiver === 1 ? "Nhờ chính sách hỗ trợ SC/ST tại trường công lập, bạn được miễn 100% học phí để theo đuổi ngành Y đắt đỏ." : "Bạn vượt qua cả rào cản điểm số lẫn chi phí của ngành Y."), "big");
    }, st.admittedInst ? "Đã trúng tuyển " + st.admittedInst : null);

    // 6. Nhận gói học bổng, miễn học phí, ký túc xá miễn phí & trợ cấp sinh hoạt cho SC/ST/OBC/EWS
    if (["SC", "ST", "OBC", "EWS"].includes(st.activeCategory)) {
      row("claim_sc_st_support", "Nhận gói hỗ trợ trường công lập (" + st.activeCategory + "): miễn/giảm học phí, ký túc xá & trợ cấp sinh hoạt", 17, function (r, log) {
        st.scholarshipClaimed = true;
        var stipend = Math.round(l.base * cat.stipendFactor);
        if (stipend > 0) H.cash(l, stipend, "Trợ cấp sinh hoạt & học bổng diện " + st.activeCategory);
        H.fx(l, { hap: 3, kno: 2 });
        log("Trường đại học công lập cấp cho bạn gói hỗ trợ diện " + st.activeCategory + ": " + (cat.freeHostel ? "miễn 100% học phí, bố trí ký túc xá miễn phí và cấp trợ cấp sinh hoạt " : "hỗ trợ 50% học phí và phụ cấp học tập ") + H.money(l, stipend) + ".", "good");
      }, !st.admittedInst && l.school !== "uni" ? "Cần đang theo học đại học công lập (như IIT, AIIMS...)" : st.scholarshipClaimed ? "Đã nhận gói học bổng & ký túc xá" : null);
    }

    // 7. Sự dịch chuyển xã hội & Quyền lực chính trị – tôn giáo (Chủ nghĩa dân tộc Hindu BJP / Ram Mandir Ayodhya vs. Hạn ngạch giai cấp)
    row("social_mobility_civil", "Thi tuyển Công chức / Vị trí Lãnh đạo công (Hạn ngạch việc làm công): tạo bước dịch chuyển vị thế xã hội ngoạn mục", 21, function (r, log) {
      st.socialMobilityCivil = true;
      H.fx(l, { kno: 3, soc: 4, hap: 4 });
      H.cash(l, Math.round(l.base * 0.45), "Lương & phụ cấp công chức nhà nước Ấn Độ");
      log("Nhờ hệ thống hạn ngạch trong giáo dục và tuyển dụng việc làm công của Hiến pháp Ấn Độ, bạn gia nhập đội ngũ trí thức và công chức nhà nước — hoàn thành cuộc dịch chuyển vị thế xã hội ngoạn mục.", "big");
    }, (l.st.kno || 50) < (["SC", "ST"].includes(st.activeCategory) ? 50 : ["OBC", "EWS"].includes(st.activeCategory) ? 58 : 72) ? "Cần trau dồi thêm kiến thức để vượt qua kỳ thi tuyển công chức" : st.socialMobilityCivil ? "Đã đạt bước tiến công chức / trí thức" : null);

    row("quota_social_debate", "Quan sát tranh luận Hạn ngạch (SC 15%, ST 7.5%, OBC 27%, EWS 10%) & sức ảnh hưởng chính trị – tôn giáo tại Ấn Độ (Ram Mandir Ayodhya / phong trào giai cấp)", 16, function (r, log) {
      st.debatedQuota = true; st.hindutvaObserved = true;
      H.fx(l, { kno: 2, soc: 2 });
      log("Tại Ấn Độ hiện đại, tôn giáo và hạn ngạch gắn chặt với quyền lực chính trị: một mặt là chủ nghĩa dân tộc Hindu (đảng cầm quyền BJP thúc đẩy bản sắc Hindu, xây dựng lại đại đền Ram Mandir ở Ayodhya, điều chỉnh sách giáo khoa lịch sử); mặt khác là tiếng nói chính trị hùng hậu của khối OBC (~41–45% dân số), phong trào Tân Phật giáo Navayana của người Dalit và những cuộc biểu tình tranh cãi gay gắt về hạn ngạch đại học giữa áp lực dân số đông và chỉ tiêu ngành Y/Kỹ thuật khan hiếm.", "neutral");
    });

    return out;
  }, 12, "Học tập");

  // ================= 9. Việt Nam (VN - Tách biệt rõ với Ấn Độ & Bắc Âu): Bối cảnh Tín ngưỡng – Tôn giáo theo Hoàn cảnh, Gia thế & Vùng miền (8.10.49) =================
  function vnFaithState849(l) {
    var s = l.flags.vnFaith849;
    if (!s) {
      var qFam = (l.fam && l.fam.q) || 2;
      var prov = String(l.province || l.city || "");
      var region = /Hà Nội|Hải Phòng|Quảng Ninh|Bắc Ninh|Nam Định|Ninh Bình|Thái Bình|Phú Thọ|Lào Cai|Sơn La/.test(prov) ? "Miền Bắc" : /Huế|Đà Nẵng|Nghệ An|Hà Tĩnh|Quảng Bình|Quảng Nam|Khánh Hòa|Đắk Lắk|Gia Lai|Lâm Đồng/.test(prov) ? "Miền Trung – Tây Nguyên" : "Miền Nam";
      s = l.flags.vnFaith849 = {
        region: region,
        familyClass: qFam <= 1 ? "hộ khó khăn" : qFam === 2 ? "hộ lao động bình dân" : qFam === 3 ? "hộ trung lưu" : "gia đình khá giả / có điều kiện",
        tradition: null,
        charityAid: false,
        meritPatron: false,
        acted: {}
      };
    }
    return s;
  }

  X.menu("vnFaithContext849", "Đời sống Tín ngưỡng – Tôn giáo theo Gia cảnh & Vùng miền (Việt Nam)", function (l) {
    if (!l.alive || !inVN849(l)) return "Không áp dụng: chỉ dành cho nhân vật đang sinh sống tại Việt Nam";
    return X.reason(l, 8);
  }, function (l) {
    var s = vnFaithState849(l);
    return "Tại Việt Nam, đời sống tôn giáo và tín ngưỡng chịu ảnh hưởng tự nhiên bởi truyền thống gia đình, vùng miền (" + s.region + "), giới tính và hoàn cảnh kinh tế (" + s.familyClass + ") — hoàn toàn không có hệ thống đẳng cấp Varna/Dalit hay hạn ngạch tôn giáo kiểu Ấn Độ.\n" +
      "• Tôn giáo / Tín ngưỡng hiện tại: " + (l.religion || "Thờ cúng tổ tiên") + (s.tradition ? " · Nếp sinh hoạt: " + s.tradition : "") + ".";
  }, function (l) {
    if (!inVN849(l)) return [];
    var s = vnFaithState849(l), qFam = (l.fam && l.fam.q) || 2, out = [];
    function row(k, label, min, run, why) {
      if (l.age < min) return;
      out.push({ k: k, l: label, why: why || s.acted[k] === yr(l) ? why || "Đã thực hiện năm nay" : true, run: function (l, r, log) { if (s.acted[k] === yr(l)) return; s.acted[k] = yr(l); run(r, log); } });
    }
    row("vn_ancestors_buddhism", "Giữ nếp Thờ cúng Gia tiên & Phật giáo Việt Nam (Bắc tông, Nam tông, Khất sĩ, Thiền phái Trúc Lâm): đi chùa lễ Phật, Vu Lan báo hiếu", 8, function (r, log) {
      s.tradition = s.region === "Miền Nam" ? "Phật giáo Bắc tông / Nam tông / Khất sĩ & cúng giỗ gia tiên" : "Phật giáo Bắc tông / Thiền phái Trúc Lâm & thờ cúng tổ tiên";
      H.fx(l, { hap: 2, soc: 2 });
      log("Gia đình bạn giữ nếp " + s.tradition + " tại " + s.region + ": chăm lo bàn thờ gia tiên ngày giỗ Tết, đi lễ chùa đầu năm và mùa Vu Lan báo hiếu.", "good");
    });
    row("vn_catholic_protestant", "Sinh hoạt Giáo xứ Công giáo (Thiếu nhi Thánh Thể, ca đoàn, bác ái Caritas) hoặc Hội thánh Tin Lành Việt Nam", 8, function (r, log) {
      s.tradition = /Tin Lành/.test(l.religion || "") ? "Hội thánh Tin Lành Việt Nam (Trường Chúa nhật & ban Thanh tráng)" : "Giáo xứ Công giáo Việt Nam (học giáo lý, ca đoàn & bác ái)";
      H.fx(l, { hap: 2, soc: 2 });
      log("Bạn gắn bó với sinh hoạt cộng đoàn tại địa phương (" + s.tradition + "), rèn lối sống kỷ luật, sẻ chia và gắn kết xóm đạo.", "good");
    });
    row("vn_caodai_hoahao_mau", "Tìm hiểu tín ngưỡng bản địa & tôn giáo nội sinh Việt Nam (Thờ Mẫu Tam Tứ phủ, Đạo Cao Đài, Phật giáo Hòa Hảo miền Tây)", 12, function (r, log) {
      s.tradition = s.region === "Miền Nam" ? "Đạo Cao Đài / Phật giáo Hòa Hảo (tu nhân học Phật, bếp ăn và xe cấp cứu từ thiện)" : "Tín ngưỡng thờ Mẫu Tam Tứ phủ & lễ hội truyền thống Việt Nam";
      H.fx(l, { kno: 2, hap: 2 });
      log("Bạn tìm hiểu và trân trọng nét đẹp văn hóa tâm linh bản địa Việt Nam: " + s.tradition + ".", "good");
    });
    if (qFam <= 2) {
      row("vn_charity_scholarship", "Nhận học bổng khuyến học & hỗ trợ từ thiện từ nhà chùa / giáo xứ / hội thánh địa phương khi gia cảnh khó khăn", 8, function (r, log) {
        s.charityAid = true;
        var aid = Math.round(l.base * 0.1);
        H.cash(l, aid, "Học bổng khuyến học & hỗ trợ thiện nguyện tại địa phương");
        H.fx(l, { hap: 3, kno: 2 });
        log("Khi gia đình còn chật vật, quỹ khuyến học của nhà chùa / giáo xứ địa phương trao tặng bạn suất học bổng " + H.money(l, aid) + " cùng sách vở để tiếp sức đến trường.", "good");
      }, s.charityAid ? "Đã nhận học bổng khuyến học" : null);
    }
    if (qFam >= 3 || l.money >= l.base * 2) {
      row("vn_merit_philanthropy", "Đóng góp quỹ khuyến học, bếp ăn 0 đồng và tu bổ cơ sở tâm linh – văn hóa tại quê hương", 18, function (r, log) {
        var gift = Math.round(l.base * 0.08);
        if (l.money < gift) return;
        s.meritPatron = true;
        H.cash(l, -gift, "Đóng góp thiện nguyện & khuyến học tại địa phương");
        H.fx(l, { hap: 3, soc: 3 });
        log("Khi có điều kiện kinh tế, bạn đóng góp " + H.money(l, gift) + " cho bếp ăn từ thiện, quỹ khuyến học trẻ em nghèo và gìn giữ di sản tâm linh tại quê hương.", "good");
      });
    }
    return out;
  }, 8, "Đời sống");

  // Tích hợp lối tắt vào quyết định đại học (E.DEC.uni) CHỈ KHI là công dân Ấn Độ sống tại Ấn Độ (IN)
  if (E.DEC.uni) {
    var oldUniMake848 = E.DEC.uni.make, oldUniApply848 = E.DEC.uni.apply;
    E.DEC.uni.make = function (l, r) {
      var d = oldUniMake848.apply(this, arguments);
      if (inIndia848(l) && !l.abroad) {
        var st = syncIndiaCategory848(l), cat = INDIA_CATEGORIES[st.activeCategory] || INDIA_CATEGORIES.GEN;
        d.opts.push({
          k: "india_quota848",
          l: "Xét tuyển Đại học Công lập Ấn Độ (IIT / AIIMS) theo diện " + st.activeCategory + " (" + cat.quotaLabel + ")",
          h: "Điểm chuẩn IIT " + cat.cutoffIIT + ", AIIMS " + cat.cutoffAIIMS + (cat.freeHostel ? " · Miễn học phí & ký túc xá SC/ST" : "")
        });
      }
      return d;
    };
    E.DEC.uni.apply = function (l, d, k, r, log) {
      if (k === "india_quota848" && inIndia848(l)) {
        X.next(l, "indiaQuotaFaith848", r);
        return;
      }
      return oldUniApply848.apply(this, arguments);
    };
  }


  // ================= 10. Hàn Quốc (KR): Lễ Baek-il 100 ngày cho bé (Ý nghĩa sinh tồn, Mâm cúng Samshin, 4 loại bánh Tteok, Hanbok/Decor nam-nữ & 3 phân khúc Tiết kiệm / Khá giả / Thượng lưu Chaebol - 8.10.50) =================
  var KR_BAEKIL_CAKES850 = [
    { k: "baekseolgi", name: "Bánh gạo trắng (Baekseolgi)", meaning: "Màu trắng tinh khiết tượng trưng cho sự trong sáng và lời cầu chúc em bé ít ốm đau; chia sẻ cho 100 người xung quanh để tích phúc đức và sự trường thọ cho bé." },
    { k: "susupatteok", name: "Bánh gạo đậu đỏ (Susupatteok)", meaning: "Màu đỏ của đậu mang ý nghĩa xua đuổi ma quỷ và vận xui." },
    { k: "songpyeon", name: "Bánh ngũ sắc (Songpyeon)", meaning: "Cầu chúc trí tuệ sáng suốt và tâm hồn phong phú." },
    { k: "injeolmi", name: "Bánh nếp (Injeolmi)", meaning: "Cầu chúc sự dẻo dai, bền bỉ và sức khỏe vững vàng." }
  ];

  var KR_BAEKIL_GENDER_STYLE850 = {
    M: {
      hanjaColor: "Chữ Hán 'Bách' (百) trên bánh Baekseolgi in màu xanh dương hoặc xanh lá",
      backdrop: "Phông nền và bóng bay tông xanh pastel, xám nhạt, beige tối giản (Minimalism)",
      hanbok: "Áo Vest truyền thống kèm quần (Baji) tông xanh, tím nhã nhặn"
    },
    F: {
      hanjaColor: "Chữ Hán 'Bách' (百) trên bánh Baekseolgi in màu hồng hoặc đỏ/vàng",
      backdrop: "Phông nền và bóng bay tông hồng khói, cam đào, vàng nhạt tinh tế (Minimalism)",
      hanbok: "Áo và váy xòe (Chima) tông hồng, đỏ rực rỡ kèm mũ dây ruy-băng (Ayam)"
    }
  };

  var KR_BAEKIL_TIERS850 = {
    saving: {
      code: "saving",
      name: "Nhóm Tiết kiệm — 'Self-Baek-il' (Tự làm tại nhà, tối ưu chi phí)",
      wonRange: "50.000 – 70.000 Won (~900.000 – 1.250.000đ)",
      costFactor: 0.012,
      decor: "Thuê set phụ kiện decor 100 ngày trên Coupang / Naver Shopping (20.000 – 40.000 Won ~ 350.000–700.000đ: vải trải bàn, bình hoa giả, khay gỗ bày bánh, dây chữ 'Happy 100 Days' và 1 bộ Hanbok cho bé; chụp xong đóng gói ship trả lại cửa hàng)",
      cakes: "Đặt set bánh gạo cơ bản (1 ổ Baekseolgi in chữ 百 nhỏ, 1 đĩa bánh đậu đỏ, 1 đĩa bánh ngũ sắc) tại tiệm bánh gần nhà (~30.000 Won ~ 550.000đ); mâm cúng thần Samshin nấu đơn giản gồm cơm trắng và canh rong biển Miyeok-guk",
      guestsAndPhoto: "Chỉ có bố mẹ và em bé (hoặc thêm ông bà nội ngoại nếu ở gần); bố mẹ tự dùng điện thoại thông minh / máy ảnh cá nhân chụp tại phòng khách rồi cả nhà cùng ăn tối",
      gifts: ["Set ảnh Self-Baek-il tại phòng khách", "Bữa tối gia đình ấm cúng"]
    },
    affluent: {
      code: "affluent",
      name: "Nhóm Khá giả (Trung lưu Seoul, Busan) — 'Chuyên nghiệp, nhanh gọn và đỡ tốn sức'",
      wonRange: "100.000 – 200.000 Won bánh nghệ thuật + gói nhà hàng Hanjeongsik / Snapshot",
      costFactor: 0.09,
      decor: "Đặt dịch vụ trang trí tiệc tại nhà hoặc phòng riêng nhà hàng truyền thống Hàn Quốc cao cấp (Hanjeongsik) / nhà hàng buffet khách sạn theo phong cách truyền thống sang trọng hoặc hiện đại (Modern style)",
      cakes: "Đặt set bánh gạo từ tiệm bánh nghệ thuật (Design Tteok), tạo hình hoa, đóng hộp gỗ sang trọng (~100.000 – 200.000 Won ~ 1.8–3.6 triệu VNĐ)",
      guestsAndPhoto: "Thuê 1 thợ ảnh chuyên nghiệp (Snapshot) chụp cho bé và gia đình trong 1–2 tiếng; khách mời gồm ông bà, cô dì chú bác ruột thịt (10 – 15 người)",
      gifts: ["Nhẫn vàng ròng 100 ngày (Baek-il banji — 1 chỉ 3.75g khắc chữ 百 hoặc hình vương miện cầu giàu sang, may mắn)"]
    },
    elite: {
      code: "elite",
      name: "Nhóm Thượng lưu (Tài phiệt Chaebol / Ngôi sao / Old money) — Đẳng cấp nghệ thuật tại khách sạn 6 sao",
      wonRange: "Vài triệu đến hàng chục triệu Won (Phòng VIP Shilla Hotel / Signiel Seoul)",
      costFactor: 0.75,
      decor: "Tổ chức tại phòng VIP khách sạn 6 sao (Shilla Hotel, Signiel Seoul); Giám đốc Nghệ thuật (Art Director) thiết kế riêng với 100% hoa tươi nhập khẩu đắt đỏ kết hợp đồ gốm, đồ đồng truyền thống thủ công cao cấp",
      cakes: "Bánh gạo nghệ thuật thượng hạng và ẩm thực hoàng gia riêng tư",
      guestsAndPhoto: "Bé diện Hanbok may đo riêng độc bản (Haute Couture) từ nghệ nhân nổi tiếng; thuê ekip quay phim, chụp ảnh phóng sự hàng đầu; giữ tính riêng tư (chỉ gia đình và những người bạn cực kỳ quyền lực)",
      gifts: ["Hàng loạt lắc tay vàng & thỏi vàng tài lộc", "Quần áo & phụ kiện xa xỉ (Dior Baby, Gucci Kids)", "Set quà cảm ơn khách (nước hoa, nến thơm, sâm quý)"]
    }
  };

  function inKorea850(l) {
    return Boolean(l && H.resCode(l) === "KR");
  }

  function krBaekIlRecord850(l, k) {
    if (!k) return null;
    if (!k.baekIl850) {
      var stStyle = KR_BAEKIL_GENDER_STYLE850[k.sex === "F" ? "F" : "M"];
      k.baekIl850 = {
        babyName: k.name,
        sex: k.sex,
        hanjaColor: stStyle.hanjaColor,
        backdrop: stStyle.backdrop,
        hanbok: stStyle.hanbok,
        samshinOffered: false,
        shared100Neighbors: false,
        tierChosen: null,
        oldMoneyModest: false,
        baekilBanjiGoldRing: false,
        chaebolGoldBars: false,
        done: false
      };
    }
    return k.baekIl850;
  }

  X.menu("krBaekIl850", "Lễ Baek-il 100 Ngày Cho Bé (Truyền thống & Hiện đại Hàn Quốc)", function (l) {
    if (!l.alive || !inKorea850(l)) return "Không áp dụng: chỉ dành cho gia đình đang sinh sống tại Hàn Quốc";
    if (!l.kids || !l.kids.some(function (k) { return k.alive !== false; })) return "Cần có con để tổ chức hoặc xem lại kỷ niệm Lễ Baek-il 100 ngày";
    return X.reason(l, 16);
  }, function (l) {
    var k = (l.kids || []).slice().reverse().find(function (x) { return x.alive !== false && x.born === l.age; }) || (l.kids || []).slice().reverse().find(function (x) { return x.alive !== false; });
    if (!k) return "Chưa có hồ sơ bé.";
    var rec = krBaekIlRecord850(l, k);
    return "• Ý nghĩa Lễ Baek-il (100 ngày): đánh dấu cột mốc sinh tồn vượt qua 100 ngày đầu đời và biểu tượng số 100 (百) của sự trọn vẹn, viên mãn, cầu chúc bé sống lâu và khỏe mạnh. Người Hàn chuộng phong cách tối giản, tinh tế (Minimalism) và sự riêng tư gia đình.\n" +
      "• Bé " + k.name + " (" + (k.sex === "F" ? "Bé gái" : "Bé trai") + "): " + rec.hanjaColor + " · " + rec.backdrop + " · Trang phục: " + rec.hanbok + ".\n" +
      "• Trạng thái: " + (rec.done ? "Đã tổ chức (" + rec.tierName + ")" : "Đang chuẩn bị") +
      (rec.samshinOffered ? " · Đã cúng tạ ơn bà mụ Samshin Halmoni (3 bát cơm trắng, 3 bát canh rong biển không cắt dao kéo, 3 rau Namul)" : "") +
      (rec.shared100Neighbors ? " · Đã chia sẻ bánh Baekseolgi cho 100 người tích phúc" : "") +
      (rec.baekilBanjiGoldRing ? " · Quà nhẫn vàng ròng Baek-il banji (1 chỉ 3.75g)" : "") +
      (rec.chaebolGoldBars ? " · Quà lắc tay vàng, thỏi vàng & đồ hiệu Dior Baby / Gucci Kids" : "") + ".";
  }, function (l) {
    if (!inKorea850(l)) return [];
    var k = (l.kids || []).slice().reverse().find(function (x) { return x.alive !== false && x.born === l.age; }) || (l.kids || []).slice().reverse().find(function (x) { return x.alive !== false; });
    if (!k) return [];
    var rec = krBaekIlRecord850(l, k), fFaith = String(l.religion || ""), isChristian = /Công giáo|Tin Lành|Kitô|Cơ Đốc|Catholic|Protestant/i.test(fFaith), out = [];

    if (!isChristian) {
      out.push({
        k: "samshin_table",
        l: "Sửa soạn mâm cúng tạ ơn bà mụ Samshin Halmoni: đúng 3 bát cơm trắng, 3 bát canh rong biển Miyeok-guk (không cắt bằng dao kéo) & bộ ba rau Namul",
        why: rec.samshinOffered ? "Đã thực hiện lễ tạ ơn Samshin Halmoni" : true,
        run: function (l, r, log) {
          rec.samshinOffered = true;
          H.fx(l, { hap: 2 });
          log("Gia đình sửa soạn mâm cúng tạ ơn bà mụ Samshin Halmoni (vị thần bảo hộ sinh sản và trẻ nhỏ) đã che chở cho " + k.name + " vượt qua 100 ngày đầu đời: đúng 3 bát cơm trắng, 3 bát canh rong biển Miyeok-guk tuyệt đối không cắt bằng dao kéo (để cầu tuổi thọ dài lâu) và bộ ba rau Namul.", "good");
        }
      });
    }

    out.push({
      k: "tteok_100_share",
      l: "Chuẩn bị 4 loại bánh gạo (Baekseolgi in chữ 百, bánh đậu đỏ xua vận xui, Songpyeon cầu trí tuệ, Injeolmi cầu dẻo dai) & chia sẻ cho 100 người tích phúc",
      why: rec.shared100Neighbors ? "Đã chuẩn bị và chia sẻ bánh gạo 100 ngày" : true,
      run: function (l, r, log) {
        rec.shared100Neighbors = true;
        H.fx(l, { hap: 3, soc: 3 });
        log("Bạn chuẩn bị trọn bộ bánh truyền thống cho " + k.name + ": bánh gạo trắng Baekseolgi (" + rec.hanjaColor + ") chia sẻ cho 100 người xung quanh để tích phúc đức và trường thọ, bánh gạo đậu đỏ xua đuổi vận xui, bánh ngũ sắc Songpyeon cầu trí tuệ và bánh nếp Injeolmi cầu sự dẻo dai.", "good");
      }
    });

    out.push({
      k: "tier_saving",
      l: KR_BAEKIL_TIERS850.saving.name + " (" + KR_BAEKIL_TIERS850.saving.wonRange + ")",
      why: rec.done ? "Đã tổ chức Lễ Baek-il cho bé" : true,
      run: function (l, r, log) {
        var t = KR_BAEKIL_TIERS850.saving, cost = l.base * t.costFactor;
        if (l.money >= cost) H.cash(l, -cost, "Lễ Self-Baek-il 100 ngày tiết kiệm tại nhà");
        rec.done = true; rec.tierChosen = "saving"; rec.tierName = t.name;
        var p844 = E.BABY844 && E.BABY844.state ? E.BABY844.state(l, k) : null;
        if (p844) { p844.stage = "done"; p844.format = "Self-Baek-il 100 ngày tại nhà"; p844.scale = t.name; p844.cost = cost; p844.photos = "điện thoại gia đình"; }
        H.fx(l, { hap: 3 });
        log("Gia đình tổ chức 'Self-Baek-il' ấm cúng tại phòng khách cho " + k.name + ": " + t.decor + ". " + t.cakes + ". Bé diện " + rec.hanbok + " trước phông nền (" + rec.backdrop + ") để bố mẹ tự chụp ảnh kỷ niệm.", "good");
      }
    });

    out.push({
      k: "tier_affluent",
      l: KR_BAEKIL_TIERS850.affluent.name + " (Nhà hàng Hanjeongsik, bánh Design Tteok, thợ ảnh Snapshot & nhẫn vàng Baek-il banji 1 chỉ 3.75g)",
      why: rec.done ? "Đã tổ chức Lễ Baek-il cho bé" : (l.money < l.base * KR_BAEKIL_TIERS850.affluent.costFactor ? "Chưa đủ ngân sách cho gói Khá giả" : true),
      run: function (l, r, log) {
        var t = KR_BAEKIL_TIERS850.affluent, cost = l.base * t.costFactor;
        H.cash(l, -cost, "Lễ Baek-il 100 ngày tại nhà hàng Hanjeongsik & thợ ảnh Snapshot");
        rec.done = true; rec.tierChosen = "affluent"; rec.tierName = t.name; rec.baekilBanjiGoldRing = true;
        var p844 = E.BABY844 && E.BABY844.state ? E.BABY844.state(l, k) : null;
        if (p844) { p844.stage = "done"; p844.format = "Baek-il 100 ngày chuyên nghiệp (Hanjeongsik)"; p844.scale = t.name; p844.cost = cost; p844.photos = "thợ ảnh chuyên nghiệp (Snapshot)"; }
        H.fx(l, { hap: 5, soc: 3 });
        log("Gia đình tổ chức Lễ Baek-il theo phong cách trung lưu khá giả tại Seoul/Busan cho " + k.name + ": " + t.decor + "; " + t.cakes + "; " + t.guestsAndPhoto + ". Ông bà và người thân trao tặng bé chiếc nhẫn vàng ròng 100 ngày (Baek-il banji — 1 chỉ 3.75g khắc chữ 百 / hình vương miện) cầu chúc giàu sang, may mắn.", "big");
      }
    });

    out.push({
      k: "tier_elite",
      l: KR_BAEKIL_TIERS850.elite.name + " (Phòng VIP Shilla/Signiel 6 sao, Art Director, Hanbok Haute Couture, thỏi vàng & Dior Baby/Gucci Kids)",
      why: rec.done ? "Đã tổ chức Lễ Baek-il cho bé" : (l.money < l.base * KR_BAEKIL_TIERS850.elite.costFactor ? "Cần nền tảng tài chính Thượng lưu / Chaebol" : true),
      run: function (l, r, log) {
        var t = KR_BAEKIL_TIERS850.elite, cost = l.base * t.costFactor;
        H.cash(l, -cost, "Đại tiệc Baek-il 100 ngày phòng VIP khách sạn 6 sao Shilla / Signiel");
        rec.done = true; rec.tierChosen = "elite"; rec.tierName = t.name; rec.baekilBanjiGoldRing = true; rec.chaebolGoldBars = true;
        var p844 = E.BABY844 && E.BABY844.state ? E.BABY844.state(l, k) : null;
        if (p844) { p844.stage = "done"; p844.format = "Baek-il Thượng lưu 6 sao (Shilla/Signiel)"; p844.scale = t.name; p844.cost = cost; p844.photos = "ekip phóng sự nghệ thuật"; }
        H.fx(l, { hap: 6, soc: 5 });
        log("Lễ Baek-il 100 ngày của " + k.name + " được tổ chức như một tác phẩm nghệ thuật tại phòng VIP khách sạn 6 sao (Shilla Hotel / Signiel Seoul): " + t.decor + ". " + t.guestsAndPhoto + ". Bé nhận hàng loạt lắc tay vàng, thỏi vàng tài lộc cùng đồ hiệu xa xỉ (Dior Baby, Gucci Kids), và bố mẹ gửi tặng khách những set quà cảm ơn gồm nước hoa, nến thơm và sâm quý.", "big");
      }
    });

    if (((l.fam && l.fam.q) || 2) >= 4 || l.money >= l.base * KR_BAEKIL_TIERS850.elite.costFactor) {
      out.push({
        k: "tier_old_money_modest",
        l: "Gia đình Thượng lưu (Old money) nhưng chủ động chọn tổ chức kiểu Khá giả ấm cúng (số hiếm — ưu tiên sự giản dị cho thế hệ mình)",
        why: rec.done ? "Đã tổ chức Lễ Baek-il cho bé" : true,
        run: function (l, r, log) {
          var t = KR_BAEKIL_TIERS850.affluent, cost = l.base * t.costFactor;
          if (l.money >= cost) H.cash(l, -cost, "Lễ Baek-il ấm cúng của gia đình Old money");
          rec.done = true; rec.tierChosen = "affluent_old_money"; rec.tierName = "Thượng lưu (Old money) chọn phong cách Khá giả ấm cúng"; rec.oldMoneyModest = true; rec.baekilBanjiGoldRing = true;
          H.fx(l, { hap: 5, soc: 2 });
          log("Dù xuất thân gia đình Thượng lưu (Old money) với mạng lưới quan hệ rộng thường làm tiệc 6 sao, đến đời mình vợ chồng bạn chủ động chọn tổ chức Lễ Baek-il 100 ngày theo quy mô Khá giả ấm cúng tại phòng riêng Hanjeongsik cùng 10–15 người thân ruột thịt và nhận nhẫn vàng Baek-il banji truyền thống.", "good");
        }
      });
    }

    return out;
  }, 16, "Gia đình");

  // ================= 11. Hoàng gia Tây Ban Nha (ES) & Quy tắc Sắc phong Thái tử/Thái nữ, Kế vị nhiều thế hệ (8.10.50) =================
  function spainSuccessionInfo850(l, h) {
    if (!h) return null;
    var line = R.order(l, h), sov = R.byId(h, h.seat), heir = line[0];
    var sovAge = sov ? yr(l) - (sov.by || 1950) : 70;
    return {
      cc: h.cc,
      isSpainCatholic: h.cc === "ES",
      faith: h.cc === "ES" ? "Công giáo La Mã (Roman Catholicism — tôn giáo chiếm đa số tại Tây Ban Nha, ảnh hưởng sâu sắc tới nghi lễ và truyền thống vương triều)" : (A.CULTURE[h.cc] && A.CULTURE[h.cc].faith || ""),
      ruleDesc: h.cc === "ES"
        ? "Ưu tiên nam giới trong cùng hàng con (Male-preference primogeniture): nếu có Hoàng tử thì ưu tiên Hoàng tử lớn tuổi nhất lên kế vị dù trước đó đã có Công chúa; nếu không có con trai thì Trưởng nữ lên kế vị (Princesa de Asturias)."
        : "Thái tử/Thái nữ luôn đứng đầu (#1) trong hàng kế vị, tiếp đến là con đầu của họ (#2) và cháu của con đầu họ (#3, nếu có).",
      grandchildRule: "Cháu gái, cháu trai (hoặc chắt) của Quốc vương/Nữ hoàng đang trị vì KHÔNG tự động là Thái tử/Thái nữ (vì cha/mẹ hoặc ông/bà đang giữ ngôi Thái tử/Thái nữ); chỉ được sắc phong kỹ càng làm Thái tử/Thái nữ khi cha hoặc mẹ đã chính thức lên ngai vàng.",
      longevityNote: "Khi vị vua đương nhiệm sống rất thọ (" + sovAge + " tuổi) và chưa thoái vị vì lý do sức khỏe hoặc qua đời, người kế vị có thể ở tuổi trung niên/cao niên mới làm Thái tử/Thái nữ hoặc lên ngôi Vua/Nữ hoàng.",
      sovAge: sovAge,
      heir: heir
    };
  }

  X.menu("royalSpainSuccession850", "Quy tắc Sắc phong Thái tử/Thái nữ, Kế vị Nhiều Thế hệ & Đặc thù Tây Ban Nha", function (l) {
    if (!l.alive) return "Không khả dụng";
    var q = A.context(l);
    if (!q || !q.h || !q.me) return "Không áp dụng: chỉ dành cho thành viên Hoàng gia";
    return X.reason(l, 10);
  }, function (l) {
    var q = A.context(l);
    if (!q || !q.h || !q.me) return "Chưa có hồ sơ Hoàng gia.";
    var info = spainSuccessionInfo850(l, q.h), pos = R.lineOf(l, q.h, q.me);
    return "• Tôn giáo & Hiến định: " + info.faith + ".\n" +
      "• Thứ tự kế vị: " + info.ruleDesc + " Hiện tại bạn đứng thứ " + (pos || "—") + " trong danh sách kế vị.\n" +
      "• Quy tắc sắc phong qua các thế hệ: " + info.grandchildRule + "\n" +
      "• Tuổi thọ Quân vương & Thời điểm truyền ngôi: " + info.longevityNote;
  }, function (l) {
    var q = A.context(l);
    if (!q || !q.h || !q.me) return [];
    var h = q.h, me = q.me, up = upState(l, me), out = [];
    function row(k, label, run, why) {
      out.push({ k: k, l: label, why: why || up.acted[k] === yr(l) ? why || "Đã thực hiện năm nay" : true, run: function (l, r, log) { if (up.acted[k] === yr(l)) return; up.acted[k] = yr(l); run(r, log); } });
    }

    row("multigen_investiture_check", "Đối chiếu quy tắc sắc phong Thái tử/Thái nữ qua nhiều thế hệ (Cháu/chắt của Vua đang trị vì & người kế vị lớn tuổi)", function (r, log) {
      syncTitles(l, h, R.byId(h, h.seat), null, log);
      var line = R.order(l, h), pos = R.lineOf(l, h, me), sov = R.byId(h, h.seat);
      up.checkedMultigen850 = true;
      H.fx(l, { kno: 2 });
      if (me.heirApparent847) {
        log("Cha/mẹ của bạn đã truyền ngôi hoặc đang là Quân vương trên ngai vàng (" + (sov && sov.name || "Quốc vương") + "), nên bạn được sắc phong chính thức làm " + (HEIR_TITLES[h.cc] && HEIR_TITLES[h.cc][me.sex] || "Thái tử/Thái nữ") + " đứng đầu hàng kế vị (#1), tiếp theo là con trưởng và cháu trưởng của bạn.", "good");
      } else if (me.parent && me.parent !== h.seat && me.id !== h.seat) {
        log("Bạn đang là cháu/chắt của vị Vua đang trị vì (đứng thứ #" + (pos || "—") + " trong hàng kế vị sau cha/mẹ hoặc ông/bà của mình): theo quy tắc hoàng gia, cháu nội/ngoại của Vua đương nhiệm chưa tự động mang tước Thái tử/Thái nữ mà chỉ được sắc phong kỹ càng sau khi cha hoặc mẹ chính thức lên ngai vàng.", "neutral");
      } else {
        log("Đã đối chiếu thứ tự kế vị nhiều thế hệ: người Thái tử/Thái nữ đứng đầu (#1), tiếp đến là con trưởng của họ (#2) và cháu của con trưởng họ (#3, nếu có).", "neutral");
      }
    });

    if (h.cc === "ES") {
      row("es_catholic_primogeniture", "Thực hành truyền thống Công giáo La Mã & Quy tắc kế vị Tây Ban Nha (Príncipe / Princesa de Asturias & Infante / Infanta de España)", function (r, log) {
        l.religion = "Công giáo";
        me.religion837 = "Công giáo";
        up.spainCatholic850 = true;
        syncTitles(l, h, R.byId(h, h.seat), null, log);
        H.fx(l, { kno: 2, hap: 2, soc: 2 });
        log("Hoàng gia Tây Ban Nha gắn liền với truyền thống Công giáo La Mã (tôn giáo chiếm đa số tại Tây Ban Nha). Về luật kế vị hiện hành, Tây Ban Nha ưu tiên Hoàng tử (nam) hơn Công chúa (nữ) trong cùng hàng con (nếu có nhiều hoàng tử thì hoàng tử lớn tuổi nhất lên ngôi; nếu không có con trai thì Trưởng nữ được phong làm Nữ Thân vương xứ Asturias — Princesa de Asturias để kế vị).", "good");
      });
    }

    var sov = R.byId(h, h.seat);
    if (sov && sov.id !== me.id && (yr(l) - (sov.by || 1950)) >= 78) {
      row("long_lived_monarch_abdication", "Quân vương tiền nhiệm tuổi cao sức yếu (" + (yr(l) - (sov.by || 1950)) + " tuổi) quyết định thoái vị vì lý do sức khỏe để truyền ngôi cho đời sau", function (r, log) {
        sov.abdicated837 = true;
        R.succeed(l, h, log);
        syncTitles(l, h, R.byId(h, h.seat), sov, log);
        H.fx(l, { kno: 2, soc: 2 });
        log("Sau nhiều thập kỷ trị vì trường thọ, vị vua tiền nhiệm chính thức thoái vị vì lý do sức khỏe để truyền ngôi cho thế hệ kế tiếp; các tước vị Thái tử/Thái nữ của đời sau được sắc phong lại theo đúng thứ tự kế vị.", "big");
      });
    }

    return out;
  }, 10, "Đời sống");

  // ================= 12. Anh Quốc (GB): Chọn A-Level vs. IB Diploma theo 3 Nhóm ngành Đại học (Bắt buộc A-Level / Chuộng IB / Cân bằng - 8.10.50) =================
  var UK_ALEVEL_IB_GROUPS850 = {
    alevel_mandatory: {
      groupName: "Nhóm 1: Ngành BẮT BUỘC hoặc ƯU TIÊN TUYỆT ĐỐI A-Level (Chuyên sâu tối đa)",
      majors: [
        {
          k: "med",
          name: "Y khoa, Nha khoa & Thú y (Medicine, Dentistry & Veterinary)",
          reqSubjects: "A-Level: Hóa học + Sinh học + Toán/Vật lý (đòi hỏi điểm A hoặc A*)",
          whyTrack: "Đại học Anh yêu cầu điểm tối đa ở các môn khoa học cốt lõi; học 3–4 môn A-Level giúp giảm áp lực các môn xã hội (không bị quá tải như 6 môn của IB) để dồn 100% sức lực cho Hóa học và Sinh học cực khó."
        },
        {
          k: "eng",
          name: "Kỹ thuật chuyên sâu (Hàng không, Tự động hóa, Cơ khí, Dân dụng — Imperial College London, Cambridge / Russell Group)",
          reqSubjects: "A-Level: Toán + Toán nâng cao (Further Maths) + Vật lý",
          whyTrack: "Chương trình đại học Anh vào thẳng kiến thức kỹ thuật nặng ngay từ tuần đầu tiên; các trường Russell Group (Imperial, Cambridge...) yêu cầu hoặc cực kỳ ưu tiên môn Toán nâng cao (Further Maths) ở bậc A-Level — điều mà IB khó đáp ứng chuyên sâu bằng."
        },
        {
          k: "it",
          name: "Khoa học Máy tính (Computer Science)",
          reqSubjects: "A-Level: Toán + Toán nâng cao (Further Maths) + Khoa học Máy tính",
          whyTrack: "Ngành Khoa học Máy tính tại Anh thiên về toán học tư duy thuần túy hơn là chỉ gõ code; học sinh A-Level 3 môn (Toán, Toán nâng cao, Máy tính) có lợi thế vượt trội về tư duy toán học so với học sinh IB phải chia thời gian cho 6 nhóm môn."
        }
      ]
    },
    ib_preferred: {
      groupName: "Nhóm 2: Ngành CỰC KỲ CHUỘNG hoặc ƯU TIÊN IB DIPLOMA (Tư duy phản biện, bài luận EE 4.000 từ & Lý thuyết nhận thức TOK)",
      majors: [
        {
          k: "law",
          name: "Ngành Luật (Law / LLB)",
          reqSubjects: "IB Diploma: 6 nhóm môn + Tiểu luận EE (4.000 từ) + Lý thuyết nhận thức (TOK)",
          whyTrack: "Ngành Luật tại Anh đòi hỏi đọc hiểu khối lượng văn bản khổng lồ và tư duy phản biện lật ngược vấn đề; học sinh IB có lợi thế tuyệt đối nhờ tư duy logic từ TOK và kỹ năng viết luận nhuần nhuyễn."
        },
        {
          k: "ppe",
          name: "Chính trị, Triết học & Kinh tế (Khối ngành tinh hoa PPE — Oxford, LSE)",
          reqSubjects: "IB Diploma: Toán + Lịch sử/Kinh tế/Triết học (cả Tự nhiên lẫn Xã hội) + TOK & EE",
          whyTrack: "Bản chất của PPE tại Oxford hay LSE là liên ngành; cấu trúc IB bắt buộc học cả tự nhiên lẫn xã hội bổ trợ hoàn hảo cho tư duy tổng hợp đa chiều của ngành này."
        },
        {
          k: "ir",
          name: "Quan hệ Quốc tế & Nghiên cứu Phát triển (International Relations & Development Studies)",
          reqSubjects: "IB Diploma: Ngoại ngữ + Lịch sử/Địa lý toàn cầu + TOK & EE",
          whyTrack: "Đúng như tên gọi 'Tú tài Quốc tế', IB giáo dục học sinh thành công dân toàn cầu, hiểu biết sâu sắc về văn hóa, lịch sử và các vấn đề toàn cầu."
        },
        {
          k: "psy",
          name: "Tâm lý học (Psychology)",
          reqSubjects: "IB Diploma: Toán + Sinh học + các môn Nhân văn / Tâm lý học",
          whyTrack: "Tâm lý học vừa cần khoa học (nghiên cứu não bộ, thống kê số liệu) vừa cần xã hội (thấu hiểu hành vi con người); học sinh IB học đều cả Toán/Sinh lẫn Nhân văn sẽ hòa nhập rất nhanh."
        }
      ]
    },
    balanced: {
      groupName: "Nhóm 3: Ngành CÂN BẰNG (Chọn A-Level hay IB đều ổn — tùy phong cách học lệch sâu hay học đều rộng)",
      majors: [
        {
          k: "biz_alevel",
          majorCode: "biz",
          track: "alevel",
          name: "Kinh tế, Tài chính & Kinh doanh — Hướng A-Level (Học lệch sâu, đi thẳng trọng tâm)",
          reqSubjects: "A-Level: Toán + Kinh tế + Kế toán / Kinh doanh",
          whyTrack: "Tập trung học sâu vào Toán, Kinh tế và Kế toán/Kinh doanh, đi thẳng vào trọng tâm định lượng mà không tốn sức cho các môn ngoài ngành."
        },
        {
          k: "biz_ib",
          majorCode: "biz",
          track: "ib",
          name: "Kinh tế, Tài chính & Kinh doanh — Hướng IB Diploma (Học đều rộng, cạnh tranh trường top)",
          reqSubjects: "IB Diploma: Bắt buộc Toán cấp độ cao (Maths Higher Level - HL) + Kinh tế học HL",
          whyTrack: "Phù hợp người thích góc nhìn toàn cầu rộng mở, nhưng bắt buộc phải chọn Toán cấp độ cao (Maths HL) kết hợp Kinh tế học để cạnh tranh vào các trường top."
        },
        {
          k: "arch_alevel",
          majorCode: "art",
          track: "alevel",
          name: "Kiến trúc & Thiết kế — Hướng A-Level (Có nhiều thời gian đầu tư Hồ sơ nghệ thuật Portfolio)",
          reqSubjects: "A-Level: Toán + Vật lý + Nghệ thuật (Art & Design)",
          whyTrack: "Vừa rèn tư duy kỹ thuật kết cấu (Toán, Vật lý) vừa dành trọn thời gian rảnh để chăm chút Hồ sơ nghệ thuật (Portfolio)."
        },
        {
          k: "arch_ib",
          majorCode: "art",
          track: "ib",
          name: "Kiến trúc & Thiết kế — Hướng IB Diploma (Visual Arts HL + Toán/Lý + CAS & EE)",
          reqSubjects: "IB Diploma: Toán/Lý + Nghệ thuật ở cấp độ HL + chứng chỉ cốt lõi CAS, EE",
          whyTrack: "Cho nền tảng văn hóa – thẩm mỹ đa chiều, nhưng vất vả hơn vì phải hoàn thành các chứng chỉ cốt lõi (CAS, EE 4.000 từ) song song với việc làm hồ sơ nghệ thuật."
        }
      ]
    }
  };

  function inUK850(l) {
    return Boolean(l && H.resCode(l) === "GB");
  }

  function ukStudyState850(l) {
    var s = l.flags.study829 || (l.flags.study829 = {});
    if (!s.ukTrack850) {
      s.ukTrack850 = {
        mode: s.track === "ib" ? "ib" : "alevel",
        targetGroup: null,
        targetMajor: null,
        furtherMaths: false,
        tokEeCompleted: false,
        mathsHL: false,
        portfolioReady: false,
        fitBonusApplied: false
      };
    }
    return s.ukTrack850;
  }

  X.menu("ukAlevelIb850", "Định hướng Chuyên sâu A-Level vs. IB Diploma theo Nhóm Ngành Đại học (Anh Quốc)", function (l) {
    if (!l.alive || !inUK850(l)) return "Không áp dụng: chỉ dành cho học sinh / sinh viên tại Vương quốc Anh (GB)";
    return X.reason(l, 15);
  }, function (l) {
    var u = ukStudyState850(l), s829 = l.flags.study829 || {};
    return "• Lộ trình Sixth Form hiện tại: " + (u.mode === "ib" ? "IB Diploma (6 nhóm môn + Tiểu luận EE 4.000 từ + Lý thuyết nhận thức TOK + CAS)" : "A-Level (Chuyên sâu 3–4 môn cốt lõi đạt điểm A/A*)") +
      (s829.sixth ? " · " + s829.sixth : "") + ".\n" +
      "• Định hướng nhóm ngành đại học Anh: " + (u.targetName || "Chưa chọn") +
      (u.reqSubjects ? " (" + u.reqSubjects + ")" : "") +
      (u.furtherMaths ? " · Đã có Toán nâng cao (Further Maths)" : "") +
      (u.tokEeCompleted ? " · Đã hoàn thành EE (4.000 từ) & TOK" : "") + ".";
  }, function (l) {
    if (!inUK850(l)) return [];
    var u = ukStudyState850(l), s829 = l.flags.study829 || (l.flags.study829 = {}), out = [];

    // Nhóm 1: Bắt buộc / Ưu tiên tuyệt đối A-Level
    UK_ALEVEL_IB_GROUPS850.alevel_mandatory.majors.forEach(function (m) {
      out.push({
        k: "al_" + m.k,
        l: "[Ưu tiên tuyệt đối A-Level] " + m.name + " — " + m.reqSubjects,
        why: u.targetMajor === m.k && u.mode === "alevel" ? "Đang theo lộ trình A-Level này" : true,
        run: function (l, r, log) {
          u.mode = "alevel";
          u.targetGroup = "alevel_mandatory";
          u.targetMajor = m.k;
          u.targetName = m.name;
          u.reqSubjects = m.reqSubjects;
          u.furtherMaths = m.k === "eng" || m.k === "it";
          s829.track = "science";
          s829.sixth = m.reqSubjects;
          H.fx(l, { kno: 3 });
          log("Bạn chọn lộ trình A-Level chuyên sâu cho ngành " + m.name + " (" + m.reqSubjects + "). " + m.whyTrack, "good");
        }
      });
    });

    // Nhóm 2: Cực kỳ chuộng / Ưu tiên IB Diploma
    UK_ALEVEL_IB_GROUPS850.ib_preferred.majors.forEach(function (m) {
      out.push({
        k: "ib_" + m.k,
        l: "[Ưu tiên IB Diploma — TOK & EE 4.000 từ] " + m.name + " — " + m.reqSubjects,
        why: u.targetMajor === m.k && u.mode === "ib" ? "Đang theo lộ trình IB Diploma này" : true,
        run: function (l, r, log) {
          u.mode = "ib";
          u.targetGroup = "ib_preferred";
          u.targetMajor = m.k;
          u.targetName = m.name;
          u.reqSubjects = m.reqSubjects;
          u.tokEeCompleted = true;
          s829.track = "ib";
          s829.sixth = m.reqSubjects;
          H.fx(l, { kno: 3, soc: 2 });
          log("Bạn chọn lộ trình IB Diploma cho ngành " + m.name + " (" + m.reqSubjects + "). " + m.whyTrack, "good");
        }
      });
    });

    // Nhóm 3: Nhóm ngành Cân bằng (Chọn A-Level hay IB đều ổn tùy phong cách học)
    UK_ALEVEL_IB_GROUPS850.balanced.majors.forEach(function (m) {
      out.push({
        k: "bal_" + m.k,
        l: "[Nhóm Cân bằng] " + m.name + " — " + m.reqSubjects,
        why: u.targetBalancedKey === m.k ? "Đang theo lộ trình này" : true,
        run: function (l, r, log) {
          u.mode = m.track;
          u.targetGroup = "balanced";
          u.targetBalancedKey = m.k;
          u.targetMajor = m.majorCode;
          u.targetName = m.name;
          u.reqSubjects = m.reqSubjects;
          if (m.k === "biz_ib") u.mathsHL = true;
          if (m.k === "arch_alevel" || m.k === "arch_ib") u.portfolioReady = true;
          s829.track = m.track === "ib" ? "ib" : "science";
          s829.sixth = m.reqSubjects;
          H.fx(l, { kno: 3, hap: m.k === "arch_ib" ? -1 : 1 });
          log("Bạn chọn " + m.name + " (" + m.reqSubjects + "). " + m.whyTrack, "good");
        }
      });
    });

    return out;
  }, 15, "Học tập");

  // ================= 13. Hệ thống Đam mê (Passions), Sở trường / Năng khiếu (Aptitudes) & Sở đoản (Weaknesses) — Biến đổi tự nhiên & Bảo toàn kỹ năng (8.10.50) =================
  var PASSION_DOMAINS850 = [
    { k: "math_logic", name: "Toán học & Tư duy Logic", majors: ["it", "eng", "fin"], skills: ["toan_hoc", "lap_trinh"] },
    { k: "bio_med", name: "Y sinh & Khoa học Sự sống", majors: ["med", "pharm"], skills: ["so_cuu", "y_hoc"] },
    { k: "eng_tech", name: "Kỹ thuật, Cơ khí & Tự động hóa", majors: ["eng", "it"], skills: ["sua_chua", "co_khi"] },
    { k: "law_lit", name: "Ngôn ngữ, Văn chương & Lý luận Pháp luật", majors: ["law", "lit", "jour"], skills: ["hung_bien", "viet_lach"] },
    { k: "econ_biz", name: "Kinh tế, Tài chính & Thương mại", majors: ["biz", "fin", "mkt"], skills: ["kinh_doanh", "dau_tu"] },
    { k: "art_design", name: "Hội họa, Kiến trúc & Thiết kế Thẩm mỹ", majors: ["art", "arch"], skills: ["hoi_hoa", "thiet_ke"] },
    { k: "music_perf", name: "Âm nhạc & Nghệ thuật Biểu diễn", majors: ["music", "act"], skills: ["nhac_cu", "ca_hat"] },
    { k: "sport_ath", name: "Thể thao & Vận động Thể chất", majors: ["sport"], skills: ["boi", "vo_thuat"] },
    { k: "lang_ir", name: "Ngoại ngữ, Lịch sử & Quan hệ Quốc tế", majors: ["ir", "lang"], skills: ["ngoai_ngu", " giao_tiep"] },
    { k: "psy_soc", name: "Tâm lý học & Thấu cảm Xã hội", majors: ["psy", "edu", "soc"], skills: ["lang_nghe", "thau_cam"] }
  ];

  function passionState850(l) {
    var p = l.flags.passion850;
    if (!p) {
      var rr = rng(l.id + ":passion850");
      var keys = PASSION_DOMAINS850.map(function (d) { return d.k; });
      // Số lượng đam mê, năng khiếu (sở trường) và sở đoản tùy mỗi người ít hay nhiều (1–3 đam mê, 1–3 năng khiếu, 1–2 sở đoản)
      var passionCount = 1 + (Math.floor(rr() * 3));
      var aptitudeCount = 1 + (Math.floor(rr() * 3));
      var weaknessCount = 1 + (Math.floor(rr() * 2));
      var passions = [], aptitudes = [], weaknesses = [];
      for (var i = 0; i < keys.length; i++) {
        var k = keys[(i + Math.floor(rr() * keys.length)) % keys.length];
        if (passions.length < passionCount && !passions.includes(k)) passions.push(k);
      }
      // Năng khiếu sẵn có không nhất thiết trùng với đam mê (có thể giỏi một lĩnh vực nhưng không đam mê nó)
      for (var j = 0; j < keys.length; j++) {
        var k2 = keys[(j * 3 + Math.floor(rr() * keys.length)) % keys.length];
        if (aptitudes.length < aptitudeCount && !aptitudes.includes(k2)) aptitudes.push(k2);
      }
      for (var w = 0; w < keys.length; w++) {
        var k3 = keys[(w * 5 + Math.floor(rr() * keys.length)) % keys.length];
        if (weaknesses.length < weaknessCount && !aptitudes.includes(k3) && !passions.includes(k3) && !weaknesses.includes(k3)) {
          weaknesses.push(k3);
        }
      }
      var retainedSkills = {};
      aptitudes.forEach(function (ak) { retainedSkills[ak] = 20; });
      p = l.flags.passion850 = {
        passions: passions,
        aptitudes: aptitudes,
        weaknesses: weaknesses,
        retainedSkills: retainedSkills,
        shiftsCount: 0,
        lastShiftAge: 0,
        history: [],
        acted: {}
      };
    }
    return p;
  }

  function domainName850(k) {
    var d = PASSION_DOMAINS850.find(function (x) { return x.k === k; });
    return d ? d.name : k;
  }

  function evalDomainFit850(l, domainKey) {
    var p = passionState850(l);
    var isPassion = p.passions.includes(domainKey);
    var isAptitude = p.aptitudes.includes(domainKey);
    var isWeakness = p.weaknesses.includes(domainKey);
    // Không tự động ghét một ngành không thuộc đam mê của mình trừ khi đó là sở đoản!
    // Năng khiếu sẵn có không có nghĩa là thích nó nhưng làm việc tốt hơn vì trơn tru.
    return {
      domainKey: domainKey,
      isPassion: isPassion,
      isAptitude: isAptitude,
      isWeakness: isWeakness,
      hatesIt: isWeakness && !isPassion,
      smoothWorkBonus: isAptitude ? 4 : 0,
      enthusiasmBonus: isPassion ? 4 : 0,
      neutralOk: !isPassion && !isWeakness
    };
  }

  X.menu("passionAptitude850", "Đam mê, Năng khiếu (Sở trường) & Sở đoản Cá nhân", function (l) {
    if (!l.alive) return "Không khả dụng";
    return X.reason(l, 6);
  }, function (l) {
    var p = passionState850(l);
    var skList = Object.keys(p.retainedSkills || {}).map(function (k) { return domainName850(k) + " (Lv." + p.retainedSkills[k] + ")"; });
    return "• Đam mê hiện tại (làm việc hăng say & năng suất hơn): " + (p.passions.map(domainName850).join(", ") || "Đang khám phá") + ".\n" +
      "• Năng khiếu / Sở trường sẵn có (không đồng nghĩa với thích, nhưng học và làm trơn tru, hiệu quả hơn): " + (p.aptitudes.map(domainName850).join(", ") || "Chưa bộc lộ") + ".\n" +
      "• Sở đoản / Lĩnh vực yếu (có quyền chọn né tránh hoặc chủ động rèn luyện cải thiện): " + (p.weaknesses.map(domainName850).join(", ") || "Đã khắc phục hết sở đoản") + ".\n" +
      "• Nguyên tắc: Bạn KHÔNG tự động ghét một ngành không thuộc đam mê của mình (trừ khi đó là sở đoản). Khi hết đam mê cũ, các kỹ năng đã luyện từ trước vẫn được giữ nguyên: " + (skList.join(", ") || "Chưa tích lũy") + ".";
  }, function (l) {
    var p = passionState850(l), out = [];
    function row(k, label, run, why) {
      out.push({ k: k, l: label, why: why || p.acted[k] === yr(l) ? why || "Đã thực hiện năm nay" : true, run: function (l, r, log) { if (p.acted[k] === yr(l)) return; p.acted[k] = yr(l); run(r, log); } });
    }

    // 1. Học tập / làm việc theo Đam mê (hăng say & năng suất cao)
    if (p.passions.length) {
      var pk = p.passions[0];
      row("pursue_passion", "Theo đuổi & đào sâu Đam mê (" + domainName850(pk) + "): học và làm với sự hăng say, năng suất vượt trội", function (r, log) {
        p.retainedSkills[pk] = (p.retainedSkills[pk] || 10) + 12;
        l.skill = Math.min(100, (l.skill || 20) + 4);
        H.fx(l, { hap: 4, kno: 4 });
        log("Khi được làm đúng đam mê (" + domainName850(pk) + "), bạn vô cùng hăng say và đạt năng suất cao; kỹ năng chuyên môn tích lũy lên mức Lv." + p.retainedSkills[pk] + ".", "good");
      });
    }

    // 2. Phát huy Năng khiếu / Sở trường sẵn có (dù không nhất thiết đam mê nhưng làm việc cực kỳ trơn tru)
    if (p.aptitudes.length) {
      var ak = p.aptitudes.find(function (x) { return !p.passions.includes(x); }) || p.aptitudes[0];
      row("leverage_aptitude", "Phát huy Năng khiếu sẵn có (" + domainName850(ak) + "): dù không phải sở thích cuồng nhiệt nhưng xử lý công việc cực kỳ trơn tru, hiệu quả", function (r, log) {
        p.retainedSkills[ak] = (p.retainedSkills[ak] || 20) + 10;
        l.skill = Math.min(100, (l.skill || 20) + 4);
        H.fx(l, { kno: 4, hap: 1 });
        log("Năng khiếu sẵn có ở lĩnh vực " + domainName850(ak) + " giúp bạn tiếp thu và giải quyết công việc trơn tru, chuẩn xác hơn hẳn dù bạn coi đây là thế mạnh thực tế chứ không nhất thiết là đam mê cháy bỏng.", "good");
      });
    }

    // 3. Học/làm một lĩnh vực Trung lập (không thuộc đam mê nhưng không phải sở đoản -> không hề ghét)
    var neutralDom = PASSION_DOMAINS850.find(function (d) { return !p.passions.includes(d.k) && !p.weaknesses.includes(d.k); });
    if (neutralDom) {
      row("study_neutral_domain", "Học & làm việc ở lĩnh vực trung lập (" + neutralDom.name + "): không thuộc đam mê nhưng không phải sở đoản nên vẫn giữ tâm thế thoải mái", function (r, log) {
        p.retainedSkills[neutralDom.k] = (p.retainedSkills[neutralDom.k] || 5) + 6;
        H.fx(l, { kno: 3, hap: 1 });
        log("Bạn học và làm việc trong lĩnh vực " + neutralDom.name + ": dù không phải đam mê lớn nhất, vì đây không phải sở đoản nên bạn hoàn toàn không ghét bỏ mà vẫn hoàn thành tốt công việc.", "neutral");
      });
    }

    // 4. Đối với Sở đoản: chọn Né tránh hoặc Chủ động rèn luyện cải thiện
    if (p.weaknesses.length) {
      var wk = p.weaknesses[0];
      row("avoid_weakness", "Chủ động né tránh Sở đoản (" + domainName850(wk) + ") để dồn thời gian cho Sở trường & Đam mê", function (r, log) {
        H.fx(l, { hap: 3 });
        if (l.mind) l.mind.stress = Math.max(0, (l.mind.stress || 20) - 4);
        log("Bạn tỉnh táo né tránh lĩnh vực sở đoản (" + domainName850(wk) + ") không phù hợp với mình để tập trung vào thế mạnh cốt lõi, giúp tinh thần nhẹ nhõm hơn.", "good");
      });

      row("improve_weakness", "Quyết tâm rèn luyện khắc phục Sở đoản (" + domainName850(wk) + "): vượt qua điểm yếu bằng sự kiên trì", function (r, log) {
        p.weaknesses = p.weaknesses.filter(function (x) { return x !== wk; });
        p.retainedSkills[wk] = (p.retainedSkills[wk] || 0) + 10;
        p.history.push({ age: l.age, type: "overcome_weakness", domain: wk });
        H.fx(l, { kno: 3, hap: 2 });
        log("Nhờ kiên trì rèn luyện, bạn đã cải thiện được lĩnh vực từng là sở đoản (" + domainName850(wk) + ") và không còn cảm thấy e ngại hay ghét nó nữa!", "big");
      });
    }

    // 5. Sự thay đổi tự nhiên của đam mê theo năm tháng (vừa phải, giữ nguyên kỹ năng đã luyện từ trước)
    row("natural_passion_shift", "Trải nghiệm cột mốc thay đổi sở thích tự nhiên: có thể vơi một đam mê cũ hoặc mở lòng với một đam mê mới (vẫn giữ nguyên kỹ năng đã luyện)", function (r, log) {
      var cand = PASSION_DOMAINS850.find(function (d) { return !p.passions.includes(d.k) && !p.weaknesses.includes(d.k); });
      var faded = p.passions.length > 1 ? p.passions.pop() : null;
      if (faded) {
        p.retainedSkills[faded] = Math.max(p.retainedSkills[faded] || 15, 15);
      }
      if (cand && p.passions.length < 3) {
        p.passions.push(cand.k);
      }
      p.shiftsCount = (p.shiftsCount || 0) + 1;
      p.lastShiftAge = l.age;
      H.fx(l, { hap: 2, kno: 2 });
      log("Theo thời gian và trải nghiệm sống, tâm lý của bạn có sự chuyển dịch tự nhiên ở mức vừa phải: " +
        (faded ? "bạn không còn quá say mê " + domainName850(faded) + " như trước (nhưng toàn bộ kỹ năng Lv." + p.retainedSkills[faded] + " đã luyện từ trước vẫn còn nguyên trong người), " : "") +
        (cand ? "đồng thời bạn tìm thấy niềm hứng thú mới với " + cand.name + "." : "giữ nhịp cân bằng với các sở thích hiện tại."), "good");
    });

    return out;
  }, 6, "Học tập");

  // ================= 14. Hệ thống 16 Nhóm Tính cách MBTI (Ảnh hưởng vừa phải tới Công việc, Học tập, Gia đình & Quan hệ; quyền quyết định thuộc về bản thân - 8.10.50) =================
  var MBTI_TYPES850 = {
    INTJ: { code: "INTJ", name: "Nhà Chiến lược (Architect)", group: "Nhà Phân tích", workStyle: "Tư duy hệ thống dài hạn, độc lập và tối ưu hóa quy trình", relStyle: "Quan tâm bằng hành động thực tế, giải pháp sâu sắc và sự chung thủy bền bỉ", studyStyle: "Thích đào sâu bản chất lý thuyết và tự lập kế hoạch học tập" },
    INTP: { code: "INTP", name: "Nhà Tư duy (Logician)", group: "Nhà Phân tích", workStyle: "Phân tích logic sắc bén, giải quyết bài toán phức tạp và sáng tạo khái niệm", relStyle: "Tôn trọng không gian riêng tư, chia sẻ tri thức và thẳng thắn chân thành", studyStyle: "Học cực nhanh khi hiểu nguyên lý gốc, thích khám phá tự do" },
    ENTJ: { code: "ENTJ", name: "Nhà Điều hành (Commander)", group: "Nhà Phân tích", workStyle: "Quyết đoán, định hướng mục tiêu lớn và tổ chức đội ngũ hiệu quả", relStyle: "Chủ động bảo vệ gia đình, định hướng tương lai chung rõ ràng", studyStyle: "Có tính cạnh tranh cao, thích cấu trúc rõ ràng và hiệu quả thực chiến" },
    ENTP: { code: "ENTP", name: "Người Tranh biện (Debater)", group: "Nhà Phân tích", workStyle: "Nhạy bén với ý tưởng mới, phản biện đa chiều và ứng biến linh hoạt", relStyle: "Hài hước, truyền cảm hứng và luôn làm mới bầu không khí gia đình", studyStyle: "Thích tranh luận mở, liên ngành và lật ngược vấn đề" },
    INFJ: { code: "INFJ", name: "Người Che chở (Advocate)", group: "Nhà Ngoại giao", workStyle: "Làm việc có lý tưởng, chiều sâu nhân văn và trực giác nhạy bén", relStyle: "Thấu cảm sâu sắc, lắng nghe tâm tư người thân và gắn kết tinh thần", studyStyle: "Kết nối kiến thức với ý nghĩa nhân sinh và giá trị đạo đức" },
    INFP: { code: "INFP", name: "Người Hòa giải (Mediator)", group: "Nhà Ngoại giao", workStyle: "Sáng tạo giàu cảm xúc, trung thành với giá trị cốt lõi cá nhân", relStyle: "Dịu dàng, bao dung, luôn nâng đỡ cảm xúc của bạn đời và con cái", studyStyle: "Học tốt nhất khi có cảm hứng nghệ thuật, văn chương và nhân văn" },
    ENFJ: { code: "ENFJ", name: "Người Chỉ dẫn (Protagonist)", group: "Nhà Ngoại giao", workStyle: "Truyền lửa, kết nối tập thể và dẫn dắt bằng sự khích lệ", relStyle: "Ấm áp, chu đáo, luôn vun đắp sự hòa thuận giữa các thế hệ gia đình", studyStyle: "Học nhóm hiệu quả, giỏi thuyết trình và tổng hợp quan điểm" },
    ENFP: { code: "ENFP", name: "Người Truyền cảm hứng (Campaigner)", group: "Nhà Ngoại giao", workStyle: "Nhiệt huyết, giàu trí tưởng tượng và giỏi mở rộng mạng lưới quan hệ", relStyle: "Tràn đầy năng lượng tích cực, lãng mạn và cởi mở chia sẻ", studyStyle: "Đa dạng sở thích, tiếp thu nhanh qua trải nghiệm và giao lưu" },
    ISTJ: { code: "ISTJ", name: "Người Trách nhiệm (Logistician)", group: "Nhà Bảo hộ", workStyle: "Kỷ luật, tỉ mỉ, đáng tin cậy tuyệt đối và tôn trọng nguyên tắc", relStyle: "Bày tỏ tình yêu qua trách nhiệm chu toàn, giữ chữ tín với gia đình", studyStyle: "Ôn luyện có hệ thống, ghi chép cẩn thận và nắm chắc kiến thức nền" },
    ISFJ: { code: "ISFJ", name: "Người Nuôi dưỡng (Defender)", group: "Nhà Bảo hộ", workStyle: "Tận tâm, kiên nhẫn, hỗ trợ hậu phương vững chắc và chu đáo từng chi tiết", relStyle: "Ghi nhớ từng thói quen nhỏ của người thân, chăm sóc gia đình ân cần", studyStyle: "Chăm chỉ, bền bỉ, phát huy tốt trong môi trường học tập ổn định" },
    ESTJ: { code: "ESTJ", name: "Người Quản lý (Executive)", group: "Nhà Bảo hộ", workStyle: "Tổ chức thực tế, rõ ràng về trách nhiệm và điều phối nguồn lực giỏi", relStyle: "Chỗ dựa vững vàng về tài chính và nề nếp gia phong", studyStyle: "Thực tế, bám sát mục tiêu điểm số và lộ trình chuẩn mực" },
    ESFJ: { code: "ESFJ", name: "Người Quan tâm (Consul)", group: "Nhà Bảo hộ", workStyle: "Hợp tác nhịp nhàng, xây dựng văn hóa tập thể gắn kết và hiếu khách", relStyle: "Giữ gìn truyền thống sum họp gia đình, quan tâm chu đáo tới hai bên nội ngoại", studyStyle: "Học tập tích cực khi có sự tương tác với thầy cô và bạn bè" },
    ISTP: { code: "ISTP", name: "Nhà Kỹ thuật (Virtuoso)", group: "Nhà Thám hiểm", workStyle: "Bình tĩnh xử lý khủng hoảng, khéo tay thực hành và tư duy cơ học nhạy bén", relStyle: "Không nói hoa mỹ nhưng luôn sẵn sàng sửa chữa, giúp đỡ việc thực tế trong nhà", studyStyle: "Học qua thực hành, thí nghiệm và tháo lắp trực tiếp" },
    ISFP: { code: "ISFP", name: "Người Nghệ sĩ (Adventurer)", group: "Nhà Thám hiểm", workStyle: "Gu thẩm mỹ tinh tế, linh hoạt và trân trọng tự do sáng tạo", relStyle: "Nhẹ nhàng, tinh tế, tôn trọng cá tính riêng của người thương và con cái", studyStyle: "Tiếp thu mạnh qua hình ảnh, âm thanh và trải nghiệm thẩm mỹ" },
    ESTP: { code: "ESTP", name: "Người Thực thi (Entrepreneur)", group: "Nhà Thám hiểm", workStyle: "Nhanh nhạy nắm bắt cơ hội thị trường, dám hành động và thương lượng giỏi", relStyle: "Sôi nổi, hào sảng, thích đưa gia đình đi trải nghiệm thực tế", studyStyle: "Ưa ứng dụng thực tiễn nhanh hơn là lý thuyết dài dòng" },
    ESFP: { code: "ESFP", name: "Người Trình diễn (Entertainer)", group: "Nhà Thám hiểm", workStyle: "Tỏa sáng trước đám đông, giao tiếp cuốn hút và lan tỏa niềm vui", relStyle: "Biến mỗi ngày bên gia đình thành niềm vui ấm áp, giàu tình cảm", studyStyle: "Hứng thú với các hoạt động ngoại khóa, nghệ thuật và tương tác trực tiếp" }
  };

  function mbtiState850(l) {
    var m = l.flags.mbti850;
    if (!m) {
      var keys = Object.keys(MBTI_TYPES850);
      var idx = hash(String(l.id || l.name) + ":mbti850") % keys.length;
      var code = keys[idx];
      m = l.flags.mbti850 = {
        code: code,
        selfSelected: false,
        workApplied: 0,
        relApplied: 0,
        acted: {}
      };
    }
    return m;
  }

  X.menu("mbtiProfile850", "Nhóm Tính cách MBTI (16 Nhóm — Xu hướng Học tập, Công việc & Cách Quan tâm Gia đình)", function (l) {
    if (!l.alive) return "Không khả dụng";
    return X.reason(l, 10);
  }, function (l) {
    var m = mbtiState850(l), info = MBTI_TYPES850[m.code] || MBTI_TYPES850.INFJ;
    return "• Nhóm MBTI hiện tại của bạn: " + info.code + " — " + info.name + " (" + info.group + ").\n" +
      "• Phong cách học tập: " + info.studyStyle + ".\n" +
      "• Phong cách công việc: " + info.workStyle + ".\n" +
      "• Cách tương tác & quan tâm gia đình / người thương: " + info.relStyle + ".\n" +
      "• Lưu ý: MBTI chỉ phản ánh xu hướng tự nhiên và ảnh hưởng một phần vừa phải; mọi lựa chọn học tập, nghề nghiệp và cách ứng xử vẫn hoàn toàn do bản thân bạn quyết định.";
  }, function (l) {
    var m = mbtiState850(l), info = MBTI_TYPES850[m.code] || MBTI_TYPES850.INFJ, out = [];
    function row(k, label, run, why) {
      out.push({ k: k, l: label, why: why || m.acted[k] === yr(l) ? why || "Đã thực hiện năm nay" : true, run: function (l, r, log) { if (m.acted[k] === yr(l)) return; m.acted[k] = yr(l); run(r, log); } });
    }

    row("mbti_work_study", "Vận dụng thế mạnh " + info.code + " (" + info.name + ") vào học tập & công việc (vẫn giữ sự chủ động của bản thân)", function (r, log) {
      m.workApplied = (m.workApplied || 0) + 1;
      H.fx(l, { kno: 2, hap: 2 });
      log("Bạn phát huy xu hướng tự nhiên của nhóm " + info.code + " (" + info.workStyle.toLowerCase() + " · " + info.studyStyle.toLowerCase() + ") giúp nhịp học tập và làm việc thuận lợi hơn, đồng thời chủ động điều chỉnh khi cần thiết.", "good");
    });

    row("mbti_family_care", "Thể hiện sự quan tâm tới gia đình, bạn đời & bạn bè theo cách riêng của " + info.code + " (" + info.relStyle + ")", function (r, log) {
      m.relApplied = (m.relApplied || 0) + 1;
      if (l.partner) l.partner.close = U.clamp((l.partner.close || 60) + 3, 0, 100);
      H.fx(l, { soc: 3, hap: 2 });
      log("Trong các mối quan hệ và gia đình, bạn thể hiện sự gắn kết theo phong cách " + info.code + " (" + info.relStyle.toLowerCase() + "), đồng thời lắng nghe để thấu hiểu sự khác biệt tính cách của người thân.", "good");
    });

    Object.keys(MBTI_TYPES850).forEach(function (code) {
      var t = MBTI_TYPES850[code];
      out.push({
        k: "set_mbti_" + code,
        l: "Định hình / tự chọn nhóm tính cách MBTI: " + t.code + " — " + t.name + " (" + t.group + ")",
        why: m.code === code ? "Đang là nhóm MBTI hiện tại" : true,
        run: function (l, r, log) {
          m.code = code;
          m.selfSelected = true;
          log("Bạn xác định nhóm tính cách MBTI của mình là " + t.code + " — " + t.name + " (" + t.workStyle + "). Bạn làm chủ các quyết định của bản thân mà không bị đóng khung cứng nhắc bởi nhãn tính cách.", "neutral");
        }
      });
    });

    return out;
  }, 10, "Đời sống");

  // ================= 15. Văn hóa Giờ sinh Can Chi & Tuổi Con Giáp: Chỉ dùng ở Á Đông (VN, CN, JP, KR, KP...), Phương Tây KHÔNG dùng giờ/tuổi con giáp (8.10.50) =================
  var EAST_ASIAN_ZODIAC_COUNTRIES850 = ["VN", "CN", "JP", "KR", "KP", "TW", "HK", "MO", "SG"];
  var ZODIAC_ANIMALS_VN850 = ["Tý (Chuột)", "Sửu (Trâu)", "Dần (Hổ)", "Mẹo (Mèo)", "Thìn (Rồng)", "Tỵ (Rắn)", "Ngọ (Ngựa)", "Mùi (Dê)", "Thân (Khỉ)", "Dậu (Gà)", "Tuất (Chó)", "Hợi (Lợn)"];
  var ZODIAC_ANIMALS_EA850 = ["Tý (Chuột)", "Sửu (Trâu)", "Dần (Hổ)", "Mão (Thỏ)", "Thìn (Rồng)", "Tỵ (Rắn)", "Ngọ (Ngựa)", "Mùi (Dê)", "Thân (Khỉ)", "Dậu (Gà)", "Tuất (Chó)", "Hợi (Lợn)"];

  function usesEasternZodiac850(l) {
    if (!l) return true;
    var c = l.country || (l.mode === "vn" ? "VN" : H.resCode(l));
    return EAST_ASIAN_ZODIAC_COUNTRIES850.includes(c);
  }

  function easternZodiacAnimal850(l) {
    if (!usesEasternZodiac850(l)) return null;
    var by = l.birthYear || 2000;
    var idx = ((by - 4) % 12 + 12) % 12;
    var c = l.country || (l.mode === "vn" ? "VN" : H.resCode(l));
    return c === "VN" ? ZODIAC_ANIMALS_VN850[idx] : ZODIAC_ANIMALS_EA850[idx];
  }

  if (E.astroText) {
    var oldAstroText850 = E.astroText;
    E.astroText = function (l) {
      var raw = oldAstroText850(l);
      var mb = mbtiState850(l);
      if (usesEasternZodiac850(l)) {
        var animal = easternZodiacAnimal850(l);
        return raw + (animal ? " · tuổi " + animal : "") + (mb && mb.code ? " · MBTI: " + mb.code : "");
      }
      // Ở phương Tây (Anh, Mỹ, Bắc Âu, Tây Ban Nha...): KHÔNG dùng giờ sinh Can Chi (giờ Tý, Sửu, Dần...) hay tuổi con giáp!
      var a = l.astro51 || {};
      var hr = l.birthHour != null ? l.birthHour : 8;
      return (a.sign || "Bạch Dương") + " · sinh lúc " + hr + "h00 · " + (a.theme || "cởi mở") + (mb && mb.code ? " · MBTI: " + mb.code : "");
    };
  }

  // ================= 16. 10 Hoàng gia Châu Âu: Tôn giáo, Quyền Kế vị (Tuyệt đối Bình đẳng vs. Ưu tiên Nam giới), Quyền Phủ quyết Hiến định, Đặc quyền Màu Trắng Vatican & Quy định Con cái / Con ngoài giá thú (8.10.51) =================
  var EURO_ROYAL_MATRIX851 = {
    GB: {
      cc: "GB",
      name: "Vương quốc Anh (Nhà Windsor / Alderwick)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 2013,
      stateReligion: true,
      officialFaith: "Anh giáo",
      faithBranch: "Giáo hội Anh (Church of England — Tin Lành Anh giáo)",
      monarchReligiousRole: "Người đứng đầu tối cao (Supreme Governor) của Giáo hội Anh",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: false,
      childFaithGroup: "mandatory",
      childFaithRule: "BẮT BUỘC 100% con cái trong hàng kế vị phải rửa tội và nuôi dạy trong Giáo hội Anh (Church of England) dù bố/mẹ có người theo Công giáo; nếu nuôi dạy theo Công giáo sẽ mất quyền kế vị.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ đã có hôn thú hợp pháp; kết hôn sau sinh không hợp pháp hóa quyền kế vị."
    },
    SE: {
      cc: "SE",
      name: "Thụy Điển (Nhà Bernadotte / Lindenvik)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 1980,
      stateReligion: false,
      officialFaith: "Tin Lành Lutheran",
      faithBranch: "Tin Lành nhánh Lutheran (Evangelical Lutheran — Đạo luật Kế vị Thụy Điển)",
      monarchReligiousRole: "Quốc vương/Nữ hoàng và thành viên trong hàng kế vị phải theo đức tin Tin Lành thuần túy (Evangelical Lutheran)",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: false,
      childFaithGroup: "mandatory",
      childFaithRule: "BẮT BUỘC 100% các hoàng tử, công chúa trong hàng kế vị phải được rửa tội và nuôi dạy theo đức tin Tin Lành Lutheran của Hoàng gia, nếu không sẽ mất quyền kế vị.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ đã kết hôn hợp pháp có sự chấp thuận của Chính phủ theo đề nghị Quốc vương."
    },
    NO: {
      cc: "NO",
      name: "Na Uy (Nhà Glücksburg / Fjordheim)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 1990,
      stateReligion: false,
      officialFaith: "Tin Lành Lutheran",
      faithBranch: "Tin Lành nhánh Lutheran (Giáo hội Quốc gia Na Uy — Evangelical Lutheran)",
      monarchReligiousRole: "Quốc vương Na Uy bắt buộc theo Tin Lành Evangelical Lutheran theo Hiến pháp",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: false,
      childFaithGroup: "mandatory",
      childFaithRule: "BẮT BUỘC 100% con cái trong hàng kế vị được làm lễ rửa tội tại nhà thờ quốc gia theo nghi thức Tin Lành Lutheran từ nhỏ.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ đã có hôn thú hợp pháp."
    },
    DK: {
      cc: "DK",
      name: "Đan Mạch (Nhà Glücksburg–Monpezat / Lindenborg)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 2009,
      stateReligion: true,
      officialFaith: "Tin Lành Lutheran",
      faithBranch: "Tin Lành nhánh Lutheran (Folkekirken — Giáo hội Quốc gia Đan Mạch)",
      monarchReligiousRole: "Quốc vương/Nữ hoàng bắt buộc thuộc Giáo hội Tin Lành Lutheran Đan Mạch",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: false,
      childFaithGroup: "mandatory",
      childFaithRule: "BẮT BUỘC 100% các em bé hoàng gia (như con của Vua Frederik X và Hoàng hậu Mary người Úc) đều phải làm lễ rửa tội tại nhà thờ quốc gia theo nghi thức Lutheran từ nhỏ.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ đã kết hôn hợp pháp."
    },
    NL: {
      cc: "NL",
      name: "Hà Lan (Vương tộc Orange-Nassau / Oranjeval)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 1983,
      stateReligion: false,
      officialFaith: "Tin Lành",
      faithBranch: "Truyền thống Tin Lành Cải cách (Vương tộc Orange-Nassau) kết hợp tự do tôn giáo thế tục",
      monarchReligiousRole: "Hiến pháp thế tục không ép buộc tôn giáo; gia đình có sự giao thoa Tin Lành (Vua Willem-Alexander) và Công giáo (Hoàng hậu Máxima)",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: false,
      childFaithGroup: "voluntary_or_blended",
      childFaithRule: "Con cái theo truyền thống nhưng có sự giao thoa gia đình: luật thế tục không ép buộc theo đạo Tin Lành mới được kế vị. Thái nữ Catharina-Amalia và hai em gái vẫn rửa tội Tin Lành để tôn trọng truyền thống Vương tộc Orange-Nassau, nhưng lớn lên vừa đi lễ nhà thờ Công giáo cùng mẹ (Hoàng hậu Máxima), vừa dự lễ Tin Lành cùng cha (Vua Willem-Alexander) mà không gặp rào cản pháp lý nào.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ kết hôn hợp pháp có Quốc hội chấp thuận."
    },
    BE: {
      cc: "BE",
      name: "Vương quốc Bỉ (Nhà Saxe-Coburg / Brabantval)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 1991,
      stateReligion: false,
      officialFaith: "Công giáo",
      faithBranch: "Công giáo La Mã truyền thống sùng đạo trên nền Hiến pháp thế tục tách biệt nhà thờ và nhà nước",
      monarchReligiousRole: "Vua Philippe giữ sự trung lập chính trị và tôn giáo trước công chúng để đại diện cho mọi người dân Bỉ, nhưng có đời sống đức tin Công giáo cá nhân rất sâu sắc",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: true,
      childFaithGroup: "voluntary_or_blended",
      childFaithRule: "Tự do hoàn toàn trên giấy tờ hiến pháp (nếu Thái nữ Elisabeth kết hôn với người khác đạo, con cái vẫn giữ nguyên 100% quyền kế vị dù theo tôn giáo nào), nhưng thực tế 100% các con đều được tự nguyện rửa tội và nuôi dạy theo Công giáo La Mã vì truyền thống văn hóa – lịch sử sâu sắc.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: Luật kế vị Bỉ chỉ dựa trên dòng dõi hợp pháp từ Vua Albert II và sự chấp thuận hôn nhân của Vua/Quốc hội; con ngoài giá thú bị loại vĩnh viễn."
    },
    LU: {
      cc: "LU",
      name: "Đại Công quốc Luxembourg (Nhà Luxembourg-Nassau / Nassauval)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 2011,
      stateReligion: false,
      officialFaith: "Công giáo",
      faithBranch: "Công giáo La Mã truyền thống lâu đời trên nền Hiến pháp thế tục",
      monarchReligiousRole: "Đại Công tước giữ vai trò lập hiến; Đại Công tước phu nhân có Đặc quyền màu trắng (Privilège du blanc) tại Vatican",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: true,
      childFaithGroup: "voluntary_or_blended",
      childFaithRule: "Tự do hoàn toàn trên giấy tờ pháp lý, nhưng 100% con cái được tự nguyện rửa tội và nuôi dạy theo Công giáo La Mã vì truyền thống lịch sử sâu sắc.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ đã có hôn thú hợp pháp được Đại Công tước chấp thuận."
    },
    ES: {
      cc: "ES",
      name: "Tây Ban Nha (Vương triều Borbón / Valdeoliva)",
      primogeniture: "male_preference",
      equalReformYear: null,
      stateReligion: false,
      officialFaith: "Công giáo",
      faithBranch: "Công giáo La Mã theo truyền thống lịch sử (Hiến pháp Tây Ban Nha không quy định quốc giáo)",
      monarchReligiousRole: "Vai trò của Nhà vua mang tính biểu tượng và lập hiến: Nhà vua KHÔNG THỂ dùng lý do tôn giáo để từ chối ký ban hành một đạo luật đã được Quốc hội (Cortes Generales) thông qua; Hoàng hậu Tây Ban Nha có Đặc quyền màu trắng (Privilège du blanc) tại Vatican",
      canVetoReligious851: false,
      vaticanPrivilegeDuBlanc: true,
      childFaithGroup: "voluntary_or_blended",
      childFaithRule: "Tự do hoàn toàn trên giấy tờ (tự nguyện hơn là ép buộc), dù trong thực tế các con vẫn làm lễ rửa tội và đám cưới theo nghi thức Công giáo La Mã truyền thống.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ đã kết hôn hợp pháp."
    },
    MC: {
      cc: "MC",
      name: "Thân vương quốc Monaco (Hoàng tộc Grimaldi / Rocheval)",
      primogeniture: "male_preference",
      equalReformYear: null,
      stateReligion: true,
      officialFaith: "Công giáo",
      faithBranch: "Công giáo La Mã là Quốc giáo (State Religion) trong Hiến pháp Monaco (luật kế vị bằng văn bản chỉ bắt buộc có quốc tịch Monaco, nhưng thực tế gia tộc Grimaldi luôn giữ vững đức tin Công giáo)",
      monarchReligiousRole: "Thân vương Monaco nắm quyền lực chính trị, lập pháp thực tế rất lớn: với tư cách người bảo hộ Hiến pháp và Quốc giáo, Thân vương CÓ QUYỀN PHỦ QUYẾT các dự luật đi ngược lại giáo lý Công giáo (ví dụ thực tế: Thân vương Albert II từ chối ký các dự luật mở rộng quyền phá thai); Thân vương phi Monaco (như Vương phi Charlene chủ động cải đạo năm 2011) có Đặc quyền màu trắng (Privilège du blanc) tại Vatican",
      canVetoReligious851: true,
      vaticanPrivilegeDuBlanc: true,
      childFaithGroup: "mandatory",
      childFaithRule: "BẮT BUỘC 100% con cái của Hoàng tộc Grimaldi (như cặp song sinh Thế tử Jacques & Công chúa Gabriella) phải được rửa tội và nuôi dạy theo nghi thức Công giáo La Mã.",
      outOfWedlockRule: "monaco_post_birth_legitimation",
      outOfWedlockNote: "Ngoại lệ duy nhất tại châu Âu — Cơ chế 'Hợp pháp hóa sau sinh': theo Hiến pháp và Bộ luật Dân sự Monaco, một đứa trẻ sinh ra ngoài giá thú sẽ NGAY LẬP TỨC được đưa vào danh sách kế vị nếu sau đó cha mẹ ruột kết hôn hợp pháp với nhau (có sự chấp thuận của Thân vương, như thực tế các con của Công chúa Caroline là Andrea và Charlotte Casiraghi)."
    },
    LI: {
      cc: "LI",
      name: "Thân vương quốc Liechtenstein (Vương tộc Liechtenstein / Vaduzstein)",
      primogeniture: "absolute_primogeniture",
      equalReformYear: 2024,
      reformedFromSalicLaw: true,
      stateReligion: true,
      officialFaith: "Công giáo",
      faithBranch: "Công giáo La Mã là Quốc giáo (State Religion) được bảo vệ trong Hiến pháp Liechtenstein",
      monarchReligiousRole: "Đứng đầu bởi Thân vương trị vì (như Thân vương Hans-Adam II và Nhiếp chính vương Alois) có quyền lực hiến định rất lớn; Luật Hôn nhân gia tộc (House Law) khắt khe đòi hỏi môn đăng hộ đối và sự đồng ý bằng văn bản của Thân vương trị vì",
      canVetoReligious851: true,
      vaticanPrivilegeDuBlanc: false,
      childFaithGroup: "mandatory",
      childFaithRule: "BẮT BUỘC 100% con cái sinh ra trong gia tộc phải được rửa tội và nuôi dạy trong đức tin Công giáo La Mã để duy trì tính hợp pháp và bảo vệ quốc giáo.",
      outOfWedlockRule: "permanent_ban",
      outOfWedlockNote: "Cấm vĩnh viễn: bắt buộc sinh ra SAU KHI cha mẹ đã có hôn thú hợp pháp được Thân vương trị vì đồng ý bằng văn bản."
    }
  };

  function euroRoyalConfig851(cc) {
    return EURO_ROYAL_MATRIX851[cc] || EURO_ROYAL_MATRIX851.GB;
  }

  function syncLegitimacy851(l, h) {
    if (!h || !EURO_ROYAL_MATRIX851[h.cc]) return;
    var cfg = EURO_ROYAL_MATRIX851[h.cc];
    var parentsMarried = Boolean(l.partner && l.partner.status === "married");
    h.members.forEach(function (m) {
      if (!m.bornOutOfWedlock851) return;
      if (cfg.outOfWedlockRule === "monaco_post_birth_legitimation") {
        if (parentsMarried && !m.unapprovedMarriage851 && !m.barredLine837) {
          m.legitimatedByMarriage851 = true;
          m.illegitimate837 = false;
        } else if (!m.legitimatedByMarriage851) {
          m.illegitimate837 = true;
        }
      } else {
        m.permanentIllegitimacyBan851 = true;
        m.illegitimate837 = true;
        m.legitimatedByMarriage851 = false;
      }
    });
  }

  function evaluateChildFaithEligibility851(l, h, childMember, chosenFaith) {
    if (!h || !childMember) return { eligible: true };
    var cfg = euroRoyalConfig851(h.cc);
    childMember.religion837 = chosenFaith;
    if (cfg.childFaithGroup === "mandatory") {
      var fk = A.faithKey(chosenFaith);
      var okFaith = h.cc === "GB" ? fk === "anglican" : ["SE", "NO", "DK"].includes(h.cc) ? fk === "lutheran" : ["MC", "LI"].includes(h.cc) ? fk === "catholic" : true;
      childMember.disinheritedForFaith851 = !okFaith;
      return {
        eligible: okFaith,
        group: "mandatory",
        requiredFaith: cfg.officialFaith,
        disinherited: !okFaith
      };
    }
    childMember.disinheritedForFaith851 = false;
    if (h.cc === "NL") {
      childMember.dutchBlendedFaith851 = true;
    }
    return {
      eligible: true,
      group: "voluntary_or_blended",
      requiredFaith: cfg.officialFaith,
      disinherited: false
    };
  }

  X.menu("royalEuroSuccessionFaith851", "Tôn giáo, Quyền Kế vị 10 Hoàng gia Châu Âu, Phủ quyết Hiến định, Đặc quyền Trắng Vatican & Con ngoài giá thú", function (l) {
    if (!l.alive) return "Không khả dụng";
    var q = A.context(l);
    if (!q || !q.h || !q.me || !EURO_ROYAL_MATRIX851[q.c]) return "Không áp dụng: chỉ dành cho 10 Hoàng gia Châu Âu (GB, SE, NO, DK, NL, BE, LU, ES, MC, LI)";
    return X.reason(l, 10);
  }, function (l) {
    var q = A.context(l);
    if (!q || !q.h || !q.me) return "Chưa có hồ sơ Hoàng gia.";
    var cfg = euroRoyalConfig851(q.c), pos = R.lineOf(l, q.h, q.me);
    var primoText = cfg.primogeniture === "male_preference"
      ? "Ưu tiên nam giới (Male-preference primogeniture — chỉ còn Tây Ban Nha và Monaco áp dụng tại châu Âu: nam giới được ưu tiên trước rồi mới tới nữ giới)"
      : "Tuyệt đối bình đẳng (Absolute primogeniture" + (cfg.reformedFromSalicLaw ? " — cải cách từ Luật Salic cổ bảo thủ nhất châu Âu sang cho phép phụ nữ kế vị ngang bằng nam giới" : cfg.equalReformYear ? " — áp dụng từ năm " + cfg.equalReformYear : "") + ": người con đầu lòng bất kể Hoàng tử hay Công chúa đều là người kế vị số 1)";
    return "• Quốc gia & Vương tộc: " + cfg.name + " (Vị trí của bạn: " + (q.h.seat === q.me.id ? "Quân vương đương nhiệm" : pos ? "Thứ #" + pos + " trong hàng kế vị" : "Ngoài hàng kế vị") + ").\n" +
      "• Quy tắc kế vị giới tính: " + primoText + ".\n" +
      "• Tôn giáo & Quyền lực Hiến định: " + cfg.faithBranch + ". " + cfg.monarchReligiousRole + ".\n" +
      "• Quy định Tôn giáo đối với Con cái (" + (cfg.childFaithGroup === "mandatory" ? "Nhóm Bắt buộc 100%" : "Nhóm Tách biệt pháp lý / Giao thoa tự do") + "): " + cfg.childFaithRule + "\n" +
      "• Quy định Con ngoài giá thú: " + cfg.outOfWedlockNote;
  }, function (l) {
    var q = A.context(l);
    if (!q || !q.h || !q.me) return [];
    var h = q.h, me = q.me, c = q.c, cfg = euroRoyalConfig851(c), up = upState(l, me), out = [];
    function row(k, label, run, why) {
      out.push({ k: k, l: label, why: why || up.acted[k] === yr(l) ? why || "Đã thực hiện năm nay" : true, run: function (l, r, log) { if (up.acted[k] === yr(l)) return; up.acted[k] = yr(l); run(r, log); } });
    }

    row("compare_10_euro_monarchies", "Đối chiếu 10 Hoàng gia Châu Âu: 8 nước Tuyệt đối bình đẳng (SE 1980, NL 1983, NO 1990, BE 1991, DK 2009, LU 2011, GB 2013, LI cải cách Luật Salic) vs. 2 nước Ưu tiên nam giới (ES, MC)", function (r, log) {
      syncLegitimacy851(l, h);
      syncTitles(l, h, R.byId(h, h.seat), null, log);
      up.comparedEuro10_851 = true;
      H.fx(l, { kno: 3 });
      log("Tại châu Âu hiện nay chỉ còn đúng 2 hoàng gia ưu tiên nam giới là Tây Ban Nha (ES) và Monaco (MC). Cả 8 hoàng gia còn lại gồm Thụy Điển (tiên phong 1980), Hà Lan (1983), Na Uy (1990), Bỉ (1991), Đan Mạch (2009), Luxembourg (2011), Vương quốc Anh (2013) và Liechtenstein (đã cải cách Luật Gia tộc từ Luật Salic cổ sang bình đẳng giới) đều áp dụng quyền kế vị tuyệt đối cho người con đầu lòng bất kể Hoàng tử hay Công chúa.", "good");
    });

    if (c === "ES") {
      row("es_constitutional_no_religious_veto", "Tây Ban Nha: Giữ truyền thống Công giáo tự nguyện & tôn trọng vai trò Quân chủ lập hiến biểu tượng (không dùng lý do tôn giáo để từ chối ký luật của Quốc hội)", function (r, log) {
        up.esNoReligiousVeto851 = true;
        H.fx(l, { kno: 3, soc: 2 });
        log("Tại Tây Ban Nha, Công giáo La Mã là truyền thống lịch sử tự nguyện (vẫn tổ chức lễ rửa tội, đám cưới Công giáo nhưng luật không ép buộc). Vai trò của Nhà vua mang tính biểu tượng và lập hiến: Nhà vua KHÔNG THỂ dùng lý do tôn giáo để từ chối ký ban hành một đạo luật đã được Quốc hội (Cortes Generales) thông qua.", "good");
      });
    }

    if (c === "MC") {
      row("mc_prince_catholic_veto", "Monaco: Thực thi quyền lực lập pháp của Thân vương bảo hộ Hiến pháp — Phủ quyết dự luật đi ngược lại giáo lý Công giáo (Quốc giáo)", function (r, log) {
        up.mcPrinceCatholicVeto851 = true;
        H.fx(l, { kno: 3, soc: 2 });
        log("Khác với vai trò biểu tượng ở Tây Ban Nha, tại Monaco Công giáo La Mã là Quốc giáo và Thân vương Monaco nắm quyền lực chính trị – lập pháp thực tế rất lớn. Với tư cách người bảo hộ Hiến pháp, bạn sử dụng quyền phủ quyết để từ chối ký ban hành dự luật đi ngược lại giáo lý Công giáo của quốc gia (như tiền lệ Thân vương Albert II từ chối các dự luật mở rộng quyền phá thai).", "big");
      });
      row("mc_spouse_voluntary_catholic_conversion", "Monaco: Bạn đời chủ động cải đạo sang Công giáo La Mã trước lễ cưới để hòa nhập đời sống Hoàng tộc Grimaldi (như Vương phi Charlene năm 2011)", function (r, log) {
        up.mcSpouseConverted851 = true;
        if (l.partner) l.partner.religion130 = "Công giáo";
        H.fx(l, { hap: 3, soc: 3 });
        log("Dù luật kế vị thành văn của Monaco chỉ bắt buộc quốc tịch Monaco chứ không ép bạn đời phải theo đạo, người kết hôn với thành viên Hoàng tộc Grimaldi (như Vương phi Charlene năm 2011) đã chủ động cải đạo sang Công giáo La Mã trước khi cưới để hòa nhập trọn vẹn vào đời sống hoàng gia và quốc gia.", "good");
      });
    }

    if (c === "BE") {
      row("be_secular_constitution_devout_catholic", "Bỉ: Kết hợp Hiến pháp thế tục (kế vị theo dòng dõi hợp pháp Vua Albert II, không bắt buộc tôn giáo) với đời sống Công giáo sùng đạo và trung lập trước công chúng", function (r, log) {
        up.beSecularDevout851 = true;
        H.fx(l, { kno: 3, soc: 3 });
        log("Giống Tây Ban Nha, Bỉ không có quốc giáo và Hiến pháp bảo đảm tách biệt nhà thờ – nhà nước: quyền kế vị chỉ dựa trên dòng dõi hợp pháp từ Vua Albert II và sự chấp thuận hôn nhân của Vua/Quốc hội (dù kết hôn khác đạo, con cái vẫn giữ nguyên 100% quyền kế vị). Trên thực tế, Hoàng gia Bỉ (như Vua Philippe, Hoàng hậu Mathilde, Thái nữ Elisabeth) vẫn tự nguyện nuôi dạy tất cả các con theo Công giáo La Mã sùng đạo, đồng thời giữ sự trung lập chính trị – tôn giáo trước công chúng.", "good");
      });
    }

    if (["BE", "ES", "LU", "MC"].includes(c)) {
      row("vatican_privilege_du_blanc", "Tòa thánh Vatican: Thực hiện 'Đặc quyền màu trắng' (Privilège du blanc) — Mặc trang phục trắng diện kiến Giáo hoàng tại Vatican", function (r, log) {
        up.vaticanPrivilegeDuBlanc851 = true;
        H.fx(l, { hap: 4, soc: 4 });
        var queenTitle = c === "BE" ? "Hoàng hậu Bỉ (như Hoàng hậu Mathilde)" : c === "ES" ? "Hoàng hậu Tây Ban Nha" : c === "LU" ? "Đại Công tước phu nhân Luxembourg" : "Thân vương phi Monaco";
        log("Nhờ truyền thống Công giáo lâu đời và bền chặt, " + queenTitle + " là một trong số cực ít phụ nữ trên thế giới được Tòa thánh Vatican trao 'Đặc quyền màu trắng' (Privilège du blanc) — được phép mặc trang phục màu trắng và mạng che mặt trắng khi diện kiến Giáo hoàng thay vì trang phục màu đen bắt buộc như các nguyên thủ hay phu nhân khác.", "big");
      });
    }

    if (c === "LI") {
      row("li_salic_to_equal_and_house_law", "Liechtenstein: Bảo vệ Quốc giáo Công giáo, tuân thủ Luật Hôn nhân gia tộc (House Law) bằng văn bản của Thân vương & Cải cách từ Luật Salic cổ sang Bình đẳng giới", function (r, log) {
        up.liHouseLawAndEqualReform851 = true;
        if (R.st(l).ownConsent837) R.st(l).ownConsent837.writtenPrincelyConsent851 = true;
        H.fx(l, { kno: 3, soc: 3 });
        log("Tại Liechtenstein, Công giáo La Mã là Quốc giáo trong Hiến pháp; các thành viên muốn kết hôn và giữ quyền kế vị cho mình cùng con cái bắt buộc phải có sự đồng ý bằng văn bản của Thân vương trị vì theo Luật Hôn nhân gia tộc (House Law) khắt khe (môn đăng hộ đối, bạn đời thường theo Công giáo như Công tước phu nhân Sophie xứ Bavaria). Đồng thời, từ truyền thống bảo thủ nhất châu Âu (Luật Salic cổ cấm hoàn toàn phụ nữ kế vị), Liechtenstein đã cải cách cho phép người con đầu lòng bất kể Hoàng tử hay Công chúa đều là người kế vị số 1.", "big");
      });
    }

    if (c === "NL") {
      row("nl_protestant_catholic_family_blend", "Hà Lan: Rửa tội Tin Lành theo truyền thống Vương tộc Orange-Nassau nhưng giao thoa tự do (dự lễ nhà thờ Công giáo cùng mẹ & lễ Tin Lành cùng cha)", function (r, log) {
        up.nlBlendedFaith851 = true;
        (l.kids || []).forEach(function (k) {
          if (k.royal920) {
            var km = R.byId(h, k.royal920.id);
            if (km) km.dutchBlendedFaith851 = true;
          }
        });
        H.fx(l, { hap: 4, soc: 3, kno: 2 });
        log("Tại Hà Lan, luật pháp thế tục không ép buộc con cái phải theo đạo Tin Lành mới được kế vị. Như gia đình Vua Willem-Alexander (Tin Lành) và Hoàng hậu Máxima (Công giáo sùng đạo), Thái nữ Catharina-Amalia và các em vẫn làm lễ rửa tội Tin Lành để tôn trọng truyền thống Vương tộc Orange-Nassau, nhưng lớn lên vừa đi lễ nhà thờ Công giáo cùng mẹ, vừa dự lễ Tin Lành cùng cha một cách tự do.", "good");
      });
    }

    row("child_faith_upbringing_check", "Áp dụng quy chuẩn rửa tội & nuôi dạy đức tin cho con cái trong hàng kế vị (" + (cfg.childFaithGroup === "mandatory" ? "Nhóm Bắt buộc 100%: " + cfg.officialFaith : "Nhóm Tách biệt pháp lý / Tự nguyện: " + cfg.officialFaith) + ")", function (r, log) {
      up.childFaithChecked851 = true;
      (l.kids || []).forEach(function (k) {
        if (k.royal920) {
          var km = R.byId(h, k.royal920.id);
          if (km) evaluateChildFaithEligibility851(l, h, km, cfg.officialFaith);
        }
      });
      H.fx(l, { kno: 2, hap: 2 });
      log("Quy chuẩn nuôi dạy con cái tại " + cfg.name + ": " + cfg.childFaithRule, "good");
    });

    var hasOutOfWedlock = h.members.some(function (m) { return m.bornOutOfWedlock851; });
    if (hasOutOfWedlock) {
      row("resolve_out_of_wedlock_legitimation", c === "MC"
        ? "Monaco: Hợp pháp hóa sau sinh cho con sinh ngoài giá thú khi cha mẹ kết hôn hợp pháp (đưa ngay vào danh sách kế vị như Andrea & Charlotte Casiraghi)"
        : "Đối chiếu quy định con sinh trước hôn nhân tại " + cfg.name + " (Cấm vĩnh viễn vào hàng kế vị dù cha mẹ kết hôn sau đó)", function (r, log) {
        if (c === "MC" && l.partner) {
          l.partner.status = "married";
        }
        syncLegitimacy851(l, h);
        syncTitles(l, h, R.byId(h, h.seat), null, log);
        if (c === "MC") {
          log("Theo Hiến pháp và Bộ luật Dân sự Monaco, ngay khi cha mẹ ruột kết hôn hợp pháp với nhau (được Thân vương chấp thuận), người con sinh ra trước đám cưới được HỢP PHÁP HÓA SAU SINH và lập tức được đưa vào danh sách kế vị hợp pháp (như tiền lệ các con của Công chúa Caroline là Andrea và Charlotte Casiraghi).", "big");
        } else {
          log("Theo luật kế vị của " + cfg.name + " (cùng 8 hoàng gia châu Âu khác ngoài Monaco), một đứa trẻ bắt buộc phải được sinh ra SAU KHI cha mẹ đã có hôn thú hợp pháp; dù sau này cha mẹ có kết hôn hợp pháp, người con sinh trước hôn nhân vẫn vĩnh viễn không được vào danh sách kế vị.", "neutral");
        }
      });
    }

    return out;
  }, 10, "Đời sống");

  E.ROYAL851 = {
    EURO_ROYAL_MATRIX851: EURO_ROYAL_MATRIX851,
    euroRoyalConfig851: euroRoyalConfig851,
    syncLegitimacy851: syncLegitimacy851,
    evaluateChildFaithEligibility851: evaluateChildFaithEligibility851
  };

  E.ROYAL850 = {
    KR_BAEKIL_CAKES850: KR_BAEKIL_CAKES850,
    KR_BAEKIL_GENDER_STYLE850: KR_BAEKIL_GENDER_STYLE850,
    KR_BAEKIL_TIERS850: KR_BAEKIL_TIERS850,
    UK_ALEVEL_IB_GROUPS850: UK_ALEVEL_IB_GROUPS850,
    PASSION_DOMAINS850: PASSION_DOMAINS850,
    MBTI_TYPES850: MBTI_TYPES850,
    EAST_ASIAN_ZODIAC_COUNTRIES850: EAST_ASIAN_ZODIAC_COUNTRIES850,
    inKorea850: inKorea850,
    krBaekIlRecord850: krBaekIlRecord850,
    spainSuccessionInfo850: spainSuccessionInfo850,
    inUK850: inUK850,
    ukStudyState850: ukStudyState850,
    passionState850: passionState850,
    evalDomainFit850: evalDomainFit850,
    mbtiState850: mbtiState850,
    usesEasternZodiac850: usesEasternZodiac850,
    easternZodiacAnimal850: easternZodiacAnimal850
  };

  E.ROYAL848 = {
    INDIA_VARNAS849: INDIA_VARNAS849,
    INDIA_CATEGORIES: INDIA_CATEGORIES,
    INDIA_RELIGIONS849: INDIA_RELIGIONS849,
    SC_ELIGIBLE_FAITHS: SC_ELIGIBLE_FAITHS,
    inIndia848: inIndia848,
    inVN849: inVN849,
    indiaState848: indiaState848,
    syncIndiaCategory848: syncIndiaCategory848,
    vnFaithState849: vnFaithState849
  };
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
