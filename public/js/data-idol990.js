/* Một Đời — 9.9.0: dữ liệu ngành âm nhạc theo nước và theo thời kỳ (giải thưởng, địa điểm, hợp đồng nhóm, văn hóa hẹn hò).
   Giải thưởng lấy cảm hứng từ giải thật; mốc năm thành lập lấy theo giải thật đến 2025. Từ 2026 trở đi là mô phỏng: giải thật
   tiếp tục (đổi tên, đổi hạng mục) và xuất hiện giải mới theo xu hướng nền tảng; hạng mục, người thắng và con số là cân bằng trò chơi. */
(function (G) {
  'use strict';
  var E = G.E; if (!E) return;
  // Thời kỳ công nghệ phát hành: quyết định cách một sản phẩm lan truyền và hình thức concert
  var ERAS = [
    { to: 1969, id: 'radio', n: 'radio và đĩa than', reach: 'đài phát thanh, đĩa than và biểu diễn trực tiếp', live: 'sân khấu, nhà hát' },
    { to: 1989, id: 'tv', n: 'truyền hình và băng đĩa', reach: 'truyền hình, băng cassette và radio', live: 'nhà thi đấu, lưu diễn' },
    { to: 2004, id: 'cd', n: 'đĩa CD và truyền hình', reach: 'đĩa CD, truyền hình, radio và nhạc chuông', live: 'nhà thi đấu, sân vận động' },
    { to: 2015, id: 'web', n: 'nhạc số và video trực tuyến', reach: 'cửa hàng nhạc số, YouTube và mạng xã hội', live: 'sân vận động, livestream' },
    { to: 2025, id: 'short', n: 'streaming và video ngắn', reach: 'nền tảng streaming, video ngắn và thử thách nhảy', live: 'sân vận động, concert trực tuyến' },
    { to: 2040, id: 'ai', n: 'thời AI và thực tế mở rộng', reach: 'đề xuất của AI, video ngắn, remix do người nghe tạo', live: 'sân vận động, concert hologram và thực tế ảo' },
    { to: 9999, id: 'immersive', n: 'thời nhập vai', reach: 'không gian ảo, thực tế mở rộng và cộng đồng nhỏ rất đông', live: 'sân khấu hybrid thật–ảo, sân vận động' }
  ];
  function era(y) { for (var i = 0; i < ERAS.length; i++) if (y <= ERAS[i].to) return ERAS[i]; return ERAS[ERAS.length - 1]; }
  // Mỗi giải: id, tên theo năm, from, to (null = còn), tier (grand|main|rookie|popular|critic|honor), scope (dom|intl), lề tên khi đổi
  function A(id, name, from, tier, o) { o = o || {}; return { id: id, n: name, from: from, to: o.to || null, tier: tier, scope: o.scope || 'dom', cat: o.cat || null, min: o.min || 0, need: o.need || null, month: o.month || 12 }; }
  var KR = [
    A('golden', function (y) { return y < 2001 ? 'Giải Đại thưởng Đĩa nhạc – Video Hàn Quốc' : 'Golden Disc Awards'; }, 1986, 'grand', { cat: ['Album của năm', 'Bài hát của năm'] }),
    A('seoul', 'Seoul Music Awards', 1990, 'grand', { cat: ['Giải thưởng lớn (daesang)'] }),
    A('mama', function (y) { return y < 2004 ? 'Mnet Music Video Festival' : y < 2009 ? 'Mnet KM Music Festival' : y < 2022 ? 'Mnet Asian Music Awards (MAMA)' : 'MAMA Awards'; }, 1999, 'grand', { cat: ['Nghệ sĩ của năm', 'Album của năm', 'Bài hát của năm'] }),
    A('melon', 'Melon Music Awards', 2009, 'grand', { cat: ['Nghệ sĩ của năm', 'Album của năm', 'Bài hát của năm'] }),
    A('kma', 'Korean Music Awards', 2004, 'critic'),
    A('gaon', function (y) { return y < 2023 ? 'Gaon Chart Music Awards' : 'Circle Chart Music Awards'; }, 2012, 'main'),
    A('ceremony2030', 'Lễ trao giải Âm nhạc toàn cầu Hàn Quốc', 2030, 'grand', { cat: ['Nghệ sĩ toàn cầu của năm'], min: 1 })
  ];
  var JP = [
    A('jra', 'Japan Record Awards', 1959, 'grand'),
    A('jgd', 'Japan Gold Disc Award', 1987, 'main'),
    A('kohaku', 'NHK Kōhaku Uta Gassen (được mời)', 1951, 'honor'),
    A('mtvjp', 'MTV Video Music Awards Japan', 2002, 'popular', { to: 2024 }),
    A('jpfuture', 'Giải Âm nhạc Nhật Bản số', 2027, 'grand')
  ];
  var CN = [
    A('rthk', 'RTHK Top Ten Chinese Gold Songs Awards', 1978, 'main'),
    A('gma', 'Golden Melody Awards', 1990, 'critic'),
    A('cnmusic', 'Giải âm nhạc Hoa ngữ toàn cầu', 2000, 'grand'),
    A('tme', 'Tencent Music Entertainment Awards', 2017, 'popular'),
    A('cnfuture', 'Giải Âm nhạc Hoa ngữ thời số', 2028, 'grand')
  ];
  var VN = [
    A('maivang', 'Giải Mai Vàng', 1995, 'popular'),
    A('lsx', 'Làn Sóng Xanh', 1997, 'grand', { cat: ['Ca sĩ của năm', 'Ca khúc của năm'] }),
    A('conghien', 'Giải Cống hiến', 2005, 'critic'),
    A('zma', 'Zing Music Awards', 2010, 'main'),
    A('vnfuture', 'Giải Âm nhạc Việt Nam số', 2028, 'main')
  ];
  var TH = [
    A('season', 'Season Awards', 1990, 'grand'),
    A('kazz', 'Kazz Awards', 2007, 'popular'),
    A('joox', 'Joox Thailand Music Awards', 2017, 'main'),
    A('thsot', 'Sound of Thailand Music Awards', 2026, 'grand')
  ];
  var ID = [A('ami', 'Anugerah Musik Indonesia', 1997, 'grand'), A('idpop', 'Giải âm nhạc đại chúng Indonesia', 2012, 'popular')];
  var PH = [A('awit', 'Awit Awards', 1969, 'grand'), A('myx', 'Myx Music Awards', 2006, 'popular')];
  var IN = [A('filmfare', 'Filmfare Award ca sĩ phát thanh', 1954, 'grand'), A('mirchi', 'Mirchi Music Awards', 2009, 'main')];
  var US = [
    A('grammy', 'Grammy', 1959, 'grand', { cat: ['Thu âm của năm', 'Album của năm', 'Nghệ sĩ mới xuất sắc'] }),
    A('ama', 'American Music Awards', 1974, 'popular'),
    A('bbma', 'Billboard Music Awards', 1990, 'main'),
    A('vma', 'MTV Video Music Awards', 1984, 'popular'),
    A('cma', 'CMA Awards', 1967, 'main'),
    A('rrhof', 'Rock & Roll Hall of Fame (được vinh danh)', 1986, 'honor', { need: 'veteran' })
  ];
  var GB = [A('brit', 'Brit Awards', 1977, 'grand'), A('mercury', 'Mercury Prize', 1992, 'critic'), A('mobo', 'MOBO Awards', 1996, 'main')];
  var FR = [A('victoires', 'Victoires de la musique', 1985, 'grand'), A('nrj', 'NRJ Music Awards', 2000, 'popular')];
  var DE = [A('echo', 'Echo', 1992, 'grand', { to: 2018 }), A('dmp', 'Giải Âm nhạc Đức (kế nhiệm Echo)', 2019, 'grand')];
  var BR = [A('pmb', 'Prêmio da Música Brasileira', 1988, 'grand'), A('latin', 'Latin Grammy', 2000, 'grand', { scope: 'intl' })];
  var MX = [A('nuestro', 'Premios Lo Nuestro', 1989, 'main'), A('latin', 'Latin Grammy', 2000, 'grand', { scope: 'intl' })];
  var NG = [A('headies', 'The Headies', 2006, 'grand'), A('mama_af', 'MTV Africa Music Awards', 2008, 'popular', { to: 2016 })];
  var DEF = [A('nat', 'Giải Âm nhạc quốc gia', 1900, 'grand'), A('natpop', 'Giải khán giả bình chọn quốc gia', 1975, 'popular'), A('natcritic', 'Giải của giới phê bình', 1985, 'critic'), A('natdig', 'Giải âm nhạc số quốc gia', 2012, 'main')];
  // Giải quốc tế: ai cũng có thể được đề cử nếu có sản phẩm vượt biên giới
  var INTL = [
    A('i_grammy', 'Grammy', 1959, 'grand', { scope: 'intl', min: 3e6 }),
    A('i_bbma', 'Billboard Music Awards', 1990, 'main', { scope: 'intl', min: 2e6 }),
    A('i_vma', 'MTV Video Music Awards', 1984, 'popular', { scope: 'intl', min: 1.5e6 }),
    A('i_ema', 'MTV Europe Music Awards', 1994, 'popular', { scope: 'intl', min: 1.5e6 }),
    A('i_mama', 'MAMA – hạng mục nghệ sĩ châu Á', 2004, 'main', { scope: 'intl', min: 8e5 }),
    A('i_global', 'Giải Âm nhạc toàn cầu (thế hệ mới)', 2032, 'grand', { scope: 'intl', min: 2e6 })
  ];
  var IND = {
    KR: { n: 'ngành K-pop', aw: KR, contract: 7, dating: 3, dome: 2015, stadium: 1984, arena: 1986, hall: 1950, cities: ['Tokyo', 'Bangkok', 'Los Angeles', 'Paris', 'Jakarta'], idolGroup: true },
    JP: { n: 'ngành J-pop', aw: JP, contract: 5, dating: 3, dome: 1988, stadium: 1958, arena: 1964, hall: 1950, cities: ['Seoul', 'Taipei', 'Bangkok', 'Los Angeles'], idolGroup: true },
    CN: { n: 'ngành nhạc Hoa ngữ', aw: CN, contract: 5, dating: 2, dome: 2020, stadium: 2008, arena: 1995, hall: 1950, cities: ['Hồng Kông', 'Singapore', 'Kuala Lumpur', 'Vancouver'], idolGroup: true },
    VN: { n: 'ngành V-pop', aw: VN, contract: 5, dating: 1, dome: null, stadium: 2003, arena: 1990, hall: 1950, cities: ['Seoul', 'Bangkok', 'Singapore', 'Paris'], idolGroup: false },
    TH: { n: 'ngành T-pop', aw: TH, contract: 5, dating: 1, dome: null, stadium: 1998, arena: 2000, hall: 1950, cities: ['Seoul', 'Tokyo', 'Jakarta', 'Manila'], idolGroup: true },
    ID: { n: 'ngành nhạc Indonesia', aw: ID, contract: 5, dating: 1, dome: null, stadium: 1962, arena: 2005, hall: 1950, cities: ['Kuala Lumpur', 'Singapore', 'Bangkok'], idolGroup: false },
    PH: { n: 'ngành P-pop', aw: PH, contract: 5, dating: 1, dome: 2013, stadium: 1934, arena: 1975, hall: 1950, cities: ['Los Angeles', 'Seoul', 'Singapore', 'Dubai'], idolGroup: true },
    IN: { n: 'ngành nhạc Ấn Độ', aw: IN, contract: 5, dating: 1, dome: null, stadium: 1950, arena: 1993, hall: 1950, cities: ['Dubai', 'London', 'Toronto', 'Singapore'], idolGroup: false },
    US: { n: 'ngành nhạc Mỹ', aw: US, contract: 7, dating: 0, dome: 1965, stadium: 1923, arena: 1959, hall: 1950, cities: ['London', 'Toronto', 'Tokyo', 'Mexico City', 'Sydney'], idolGroup: false },
    GB: { n: 'ngành nhạc Anh', aw: GB, contract: 7, dating: 0, dome: 2007, stadium: 1923, arena: 1960, hall: 1950, cities: ['New York', 'Paris', 'Berlin', 'Sydney'], idolGroup: false },
    FR: { n: 'ngành nhạc Pháp', aw: FR, contract: 5, dating: 0, dome: null, stadium: 1938, arena: 1984, hall: 1950, cities: ['Bruxelles', 'Montréal', 'Genève', 'Dakar'], idolGroup: false },
    DE: { n: 'ngành nhạc Đức', aw: DE, contract: 5, dating: 0, dome: null, stadium: 1936, arena: 1990, hall: 1950, cities: ['Vienna', 'Zurich', 'Amsterdam'], idolGroup: false },
    BR: { n: 'ngành nhạc Brasil', aw: BR, contract: 5, dating: 0, dome: null, stadium: 1950, arena: 1985, hall: 1950, cities: ['Lisbon', 'Buenos Aires', 'Miami'], idolGroup: false },
    MX: { n: 'ngành nhạc Mexico', aw: MX, contract: 5, dating: 0, dome: null, stadium: 1966, arena: 1990, hall: 1950, cities: ['Los Angeles', 'Madrid', 'Bogotá'], idolGroup: false },
    NG: { n: 'ngành Afrobeats', aw: NG, contract: 5, dating: 0, dome: null, stadium: 2003, arena: 2008, hall: 1950, cities: ['London', 'Accra', 'Atlanta'], idolGroup: false }
  };
  var DEFIND = { n: 'ngành âm nhạc trong nước', aw: DEF, contract: 5, dating: 1, dome: null, stadium: 1960, arena: 1985, hall: 1950, cities: ['một nước láng giềng', 'một thủ đô lớn trong khu vực', 'một thành phố có đông kiều bào'], idolGroup: false };
  var TIER_N = { grand: 'giải lớn', main: 'giải chính', rookie: 'giải tân binh', popular: 'giải bình chọn', critic: 'giải giới chuyên môn', honor: 'vinh danh' };
  function industry(code) { return IND[code] || DEFIND; }
  function nameOf(a, y) { return typeof a.n === 'function' ? a.n(y) : a.n; }
  function active(a, y) { return y >= a.from && (!a.to || y <= a.to); }
  function awards(code, y, scope) { var out = []; var src = scope === 'intl' ? INTL.concat(industry(code).aw.filter(function (a) { return a.scope === 'intl'; })) : industry(code).aw.filter(function (a) { return a.scope !== 'intl'; }); src.forEach(function (a) { if (active(a, y)) out.push(a); }); if (!out.length && scope !== 'intl') DEF.forEach(function (a) { if (active(a, y)) out.push(a); }); return out; }
  // Địa điểm: sức chứa và năm có thể thuê được; từ năm "next" có thêm nơi mới
  var VEN = { hall: ['nhà hát / hội trường', 2500], arena: ['nhà thi đấu trong nhà', 12000], dome: ['sân vận động mái vòm (dome)', 45000], stadium: ['sân vận động ngoài trời', 60000] };
  function venues(code, y) { var d = industry(code), out = []; ['hall', 'arena', 'dome', 'stadium'].forEach(function (k) { if (d[k] != null && y >= d[k]) out.push({ k: k, n: VEN[k][0], cap: VEN[k][1] }); }); return out; }
  E.IDOL990D = { ERAS: ERAS, era: era, IND: IND, DEFIND: DEFIND, INTL: INTL, industry: industry, awards: awards, nameOf: nameOf, active: active, venues: venues, VEN: VEN, TIER_N: TIER_N };
})(globalThis.G);
