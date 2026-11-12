/* Football configuration: gameplay estimates, not historical club finances or official fixtures. */
(function (G) {
  'use strict';
  var markets = {
    VN: ['AFC', 'V.League', 'Cúp Quốc gia', 18000, 53, ['Hà Nội FC', 'Hoàng Anh Gia Lai', 'Công an Hà Nội', 'Thể Công Viettel', 'Công an Nhân dân', 'Hưng Yên', 'Thái Nguyên', 'Thép Cần Thơ', 'Đắk Lắk', 'Vĩnh Long', 'Quảng Ngãi', 'Trường Giang Gia Định']],
    JP: ['AFC', 'J1 League', 'Emperor Cup', 180000, 70, ['Kashima Antlers', 'Urawa Reds', 'Kashiwa Reysol', 'FC Tokyo']],
    KR: ['AFC', 'K League', 'Korea Cup', 140000, 68, ["Ulsan HD", "Jeonbuk Hyundai", "FC Seoul", "Pohang Steelers"]],
    TH: ['AFC', 'Thai League', 'Thai FA Cup', 45000, 58, ['Buriram United', 'BG Pathum', 'True Bangkok United', 'Uthai Thani FC']],
    GB: ['UEFA', 'Premier League', 'FA Cup', 2400000, 88, ['Arsenal', 'Liverpool', 'Manchester City', 'Chelsea']],
    ES: ['UEFA', 'La Liga', 'Copa del Rey', 1800000, 87, ['Real Madrid', 'Barcelona', 'Atlético de Madrid', 'Athletic Club']],
    DE: ['UEFA', 'Bundesliga', 'DFB-Pokal', 1400000, 85, ['Bayern München', 'Borussia Dortmund', 'RB Leipzig', 'Bayer 04 Leverkusen']],
    IT: ['UEFA', 'Serie A', 'Coppa Italia', 1300000, 84, ["Inter", "Juventus", "Milan", "Napoli"]],
    FR: ['UEFA', 'Ligue 1', 'Coupe de France', 950000, 82, ["Paris Saint-Germain", "Lyon", "Olympique de Marseille", "AS Monaco"]],
    BR: ['CONMEBOL', 'Série A', 'Copa do Brasil', 300000, 77, ["Flamengo", "Palmeiras", "Fluminense", "Botafogo"]],
    AR: ['CONMEBOL', 'Primera División', 'Copa Argentina', 160000, 74, ["River Plate", "Boca Juniors", "Racing Club", "Independiente"]],
    US: ['CONCACAF', 'MLS', 'US Open Cup', 450000, 73, ['LA Galaxy', 'Seattle Sounders FC', 'Atlanta United', 'Austin FC']],
    MX: ['CONCACAF', 'Liga MX', null, 500000, 75, ['Club América', 'Monterrey', 'León', 'Universidad Nacional']],
    EG: ['CAF', 'Egyptian Premier League', 'Egypt Cup', 90000, 66, ['Al Ahly', 'Zamalek', 'Pyramids FC', 'Ceramica Cleopatra']],
    ZA: ['CAF', 'Premiership', 'Nedbank Cup', 65000, 63, ['Mamelodi Sundowns', 'Orlando Pirates', 'Kaizer Chiefs', 'AmaZulu FC']],
    NZ: ['OFC', 'National League', 'Chatham Cup', 14000, 48, ["Auckland City", "Wellington Olympic", "Auckland United", "Birkenhead United"]]
  };
  var confeds = {
    AFC: { club: 'AFC Champions League Elite', nation: 'AFC Asian Cup', anchor: 2027, cycle: 4, strength: 66, slots: 8 },
    UEFA: { club: 'UEFA Champions League', second: 'UEFA Europa League', nation: 'UEFA European Championship', anchor: 2024, cycle: 4, strength: 82, slots: 16 },
    CONMEBOL: { club: 'Copa Libertadores', nation: 'Copa América', anchor: 2024, cycle: 4, strength: 79, slots: 6 },
    CAF: { club: 'CAF Champions League', nation: 'Africa Cup of Nations', anchor: 2025, cycle: 2, strength: 67, slots: 9 },
    CONCACAF: { club: 'CONCACAF Champions Cup', nation: 'CONCACAF Gold Cup', anchor: 2025, cycle: 2, strength: 68, slots: 6 },
    OFC: { club: 'OFC Champions League', nation: 'OFC Nations Cup', anchor: 2024, cycle: 4, strength: 49, slots: 1 }
  };
  var sources = {
    TH: 'https://thaileague.co.th/standings/?season=2025-26',
    EG: 'https://www.egyptianproleague.com/news/details/323',
    MX: 'https://leaguescup.ligamx.net/clubes',
    KR: "https://tv.kleague.com/en-int/page/k-league-1",
    IT: "https://img.legaseriea.it/vimages/685029e1/258%20-%20Pick%20Top%20Match%20Serie%20A%20Enilive%202025-2026.pdf",
    BR: "https://www.cbf.com.br/futebol-brasileiro/times/campeonato-brasileiro/serie-a/2025",
    AR: "https://www.ligaprofesional.ar/notas/primera/2025/05/05/agenda-para-octavos-de-final/",
    FR: "https://ligue1.com/fr/articles/l1_article_2867-coupes-d-europe-quand-reprennent-les-clubs-francais",
    NZ: "https://www.nzfootball.co.nz/newsarticle/170010?newsfeedId=671503",
    DE: 'https://www.bundesliga.com/en/bundesliga/clubs',
    ZA: "https://www.psl.co.za/news/article/5613244-nedbank-cup-2026-participating-clubs",
    US: 'https://www.mlssoccer.com/news/who-s-in-who-s-out-every-mls-club-s-roster-updates-for-2026',
    VN: 'https://vpf.vn/season/v-league-2026/?action=calendar&pagejs=1',
    GB: 'https://www.premierleague.com/en/news/4668605/everything-thats-been-decided-in-202526-league',
    ES: 'https://www.laliga.com/es-GB/laliga-easports/clubes',
    JP: 'https://aboutj.jleague.jp/corporate/en/about_jclubs/profile_jclubs/'
  };
  var vnTier2Source = 'https://vpf.vn/tin-tuc/tin-hang-nhat/truoc-vong-1-hnqg-2026-27-dien-mao-moi-va-tham-vong-moi/';
  var vnTier3Source = 'https://vff.org.vn/boc-tham-xep-lich-thi-dau-giai-hang-nhi-quoc-gia-2026-14-doi-tranh-3-suat-thang-hang/';
  var secondTier = {
    EG: {"name":"Second Division A","season":"2025/26","source":"https://www.efa.com.eg/ar/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1/%D8%AD%D9%83%D8%A7%D9%85-%D9%85%D8%A8%D8%A7%D8%B1%D9%8A%D8%A7%D8%AA-%D8%A7%D9%84%D8%AE%D9%85%D9%8A%D8%B3-%D9%88%D8%A7%D9%84%D8%AC%D9%85%D8%B9%D8%A9-%D9%81%D9%8A-%D8%A7%D9%84%D8%AC%D9%88%D9%84%D8%A9-%D8%A7%D9%84%D8%B3%D8%A7%D8%A8%D8%B9%D8%A9-%D9%84%D8%AF%D9%88%D8%B1%D9%8A-%D8%A7%D9%84%D9%82%D8%B3%D9%85-%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%8A-%D8%A3-%D8%AF%D9%88%D8%B1%D9%8A-%D8%A7%D9%84%D9%85%D8%AD%D8%AA%D8%B1%D9%81%D9%8A%D9%86/","teams":["Dayrout","La Viena","El Dakhleya","Petrol Asyut"]},
    NZ: {"name":"NRFL Championship","season":"2025","source":"https://www.nrf.org.nz/newsarticle/150917?newsfeedId=2045262","teams":["Cambridge","Melville United","Hamilton Wanderers","Ngaruawahia United"]},
    MX: {"name":"Liga de Expansión MX","season":"2025/26","source":"https://fmf.mx/docs/reglamentos/484.pdf","teams":["Alebrijes de Oaxaca","Atlante","Club Atlético Morelia","Cancún FC"]},
    ZA: {"name":"Motsepe Foundation Championship","season":"2025/26","source":"https://www.psl.co.za/news/article/5613244-nedbank-cup-2026-participating-clubs","teams":["Casric Stars","Highbury FC","Hungry Lions FC","University of Pretoria"]},
    AR: {"name":"Primera Nacional","season":"2025","source":"https://www.afa.com.ar/app/posts/programacion-y-arbitros-para-la-proxima-fecha-de-las-categorias-de-ascenso","teams":["Colegiales","Quilmes","All Boys","Almagro"]},
    US: {"name":"USL Championship","season":"2026","source":"https://www.uslsoccer.com/news_article/show/1351433","teams":["Charleston Battery","Louisville City FC","Pittsburgh Riverhounds SC","Sacramento Republic FC"]},
    BR: {"name":"Série B","season":"2025","source":"https://www.crb.esp.br/jogos/crb-vice-campeao-regional-representa-o-nordeste-na-serie-b-de-2025","teams":["Paysandu","Avaí","Coritiba","Goiás"]},
    TH: {"name":"Thai League 2","season":"2025/26","source":"https://thaileague.co.th/v1/documents/60/THAI_LEAGUE_2_2025-26_FIXTURES_UPDATE_170768.pdf","teams":["Police Tero FC","Chanthaburi FC","Pattani FC","Lampang FC"]},
    FR: { name: 'Ligue 2', season: '2025/26', source: 'https://ligue1.com/fr/articles/l1_article_2660-', teams: ['AS Saint-Étienne', 'Stade de Reims', 'Montpellier Hérault SC', 'Amiens SC'] },
    IT: { name: 'Serie B', season: '2025/26', source: 'https://d5rzfs5ck83rq.cloudfront.net/legab.it/documenti/2025-26/C.U._LNPB_n._7_del_31.07.2025_-_Calendario_Serie_BKT_2025-2026.pdf', teams: ['Bari', 'Palermo', 'Sampdoria', 'Spezia'] },
    JP: { name: 'J2 League', season: '2026', source: 'https://aboutj.jleague.jp/corporate/en/about_jclubs/profile_jclubs/', teams: ['Hokkaido Consadole Sapporo', 'Vanraure Hachinohe', 'Vegalta Sendai', 'Blaublitz Akita'] },
    KR: { name: 'K League 2', season: '2025', source: 'https://www.kleague.com/news_view.do?orderBy=seq&seq=93837&viewOption=album', teams: ['Incheon United', 'Suwon Samsung Bluewings', 'Bucheon FC 1995', 'Seoul E-Land'] },
    GB: { name: 'EFL Championship', season: '2025/26', source: 'https://www.dcfc.co.uk/news/2025/05/202526-season-sky-bet-championship-line-up-confirmed', teams: ['Derby County', 'Ipswich Town', 'Leicester City', 'Southampton'] },
    DE: { name: '2. Bundesliga', season: '2025/26', source: 'https://datencenter.dfb.de/competitions/2-bundesliga/seasons/2025-2026/teams',
      teams: ['Hertha BSC', 'Hannover 96', 'Fortuna Düsseldorf', '1. FC Nürnberg'] },
    ES: { name: 'LALIGA HYPERMOTION', season: '2025/26', source: 'https://www.laliga.com/calendario-2025-2026/laliga-hypermotion',
      teams: ['RC Deportivo', 'Málaga CF', 'Granada CF', 'Real Zaragoza'] }
  };
  var thirdTier = {
    ZA: {"name":"ABC Motsepe League","season":"2024/25","source":"https://www.sabcsport.com/soccer/news/abc-motsepe-league-national-playoff-semifinals-engulfed-in-arbitration-storm","teamSources":["https://www.sabcsport.com/soccer/news/abc-motsepe-league-national-playoff-semifinals-engulfed-in-arbitration-storm","https://www.sabcsport.com/soccer/news/abc-motsepe-league-national-playoff-semifinals-engulfed-in-arbitration-storm","https://www.sabcsport.com/soccer/news/safa-disregard-court-order-as-abc-motsepe-national-playoffs-go-ahead","https://www.sabcsport.com/soccer/news/safa-disregard-court-order-as-abc-motsepe-national-playoffs-go-ahead"],"teams":["Zizwe United","Midlands Wanderers","The Bees FC","Thames FC"]},
    MX: {"name":"Liga Premier · Serie A","season":"2025/26","source":"https://intranet.ligapremier.mx/public/pdf/reglamentos/Reglamento%20de%20Competencia%202025-2026.pdf","teams":["Inter Playa del Carmen","Montañeses FC","Pioneros Cancún","Tapachula FC"]},
    TH: {"name":"Thai League 3","season":"2025/26","source":"https://thaileague.co.th/v1/announcements-index/%E0%B8%AA%E0%B8%A1%E0%B8%B2%E0%B8%84%E0%B8%A1%E0%B8%AF-%E0%B9%81%E0%B8%88%E0%B8%87%E0%B9%82%E0%B8%9B%E0%B8%A3%E0%B9%81%E0%B8%81%E0%B8%A3%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%81%E0%B8%82%E0%B8%87%E0%B8%82%E0%B8%99-%E0%B8%9F%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5-%E0%B9%84%E0%B8%97%E0%B8%A2%E0%B8%A5%E0%B8%81-3-%E0%B8%A3%E0%B8%AD%E0%B8%9A%E0%B9%81%E0%B8%8A%E0%B8%A1%E0%B9%80%E0%B8%9B%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%A5%E0%B8%81-%E0%B8%A4%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A5-202526/","teams":["North Bangkok University FC","Chiangmai FC","Prime Bangkok FC","Uttaradit FC"]},
    NZ: {"name":"NRFL Northern Conference","season":"2023","source":"https://www.nrf.org.nz/newsarticle/128598","teams":["Central United","Bucklands Beach","Oratia United","West Auckland"]},
    EG: {"name":"Second Division B · Group 1B","season":"2025/26","source":"https://efa.com.eg/media/4bpb54kz/%D8%AC%D8%AF%D9%88%D9%84-%D8%A7%D9%84%D9%82%D8%B3%D9%85-%D8%A7%D9%84%D8%AB%D8%A7%D9%86%D9%8A-%D8%A7%D9%84%D9%85%D8%AC%D9%85%D9%88%D8%B9%D8%A9-%D8%A7%D9%84%D8%A7-%D9%88%D9%84%D9%8A-%D8%A8-%D9%85%D9%88%D8%B3%D9%85-2025-2026-1.pdf","teams":["El Minya","Misr El Makasa","Beni Mazar","Telephonat Beni Suef"]},
    AR: {"name":"Primera B Metropolitana","season":"2025","source":"https://www.afa.com.ar/Futbol/posts/calendario-y-jueces-para-las-categorias-de-ascenso","teams":["Flandria","Real Pilar FC","Villa San Carlos","Acassuso"]},
    US: {"name":"USL League One","season":"2026","source":"https://www.uslsoccer.com/news_article/show/1351434","teams":["Greenville Triumph SC","Richmond Kickers","Union Omaha","Forward Madison FC"]},
    BR: {"name":"Série C","season":"2025","source":"https://www.cbf.com.br/futebol-brasileiro/tabelas/campeonato-brasileiro/serie-c/2025/1899?documento=IMT","teams":["Ponte Preta","Náutico","Guarani","Figueirense"]},
    FR: { name: 'National', season: '2025/26', source: 'https://www.fcvb.fr/wp-content/uploads/2025/07/Calendrier-25-26_compressed-1.pdf', teams: ['Dijon FCO', 'FC Sochaux-Montbéliard', 'FC Rouen', 'SM Caen'] },
    IT: { name: 'Serie C', season: '2026/27', source: 'https://www.seriec.com/', teams: ['Foggia', 'Potenza', 'Catania', 'Salernitana'] },
    JP: { name: 'J3 League', season: '2026', source: 'https://aboutj.jleague.jp/corporate/en/about_jclubs/profile_jclubs/', teams: ['Fukushima United FC', 'Tochigi SC', 'Thespa Gunma', 'S.C. Sagamihara'] },
    KR: { name: 'K3 League', season: '2026', source: 'https://www.kfa.or.kr/competition/k3_2026.php', teams: ['Siheung Citizen', 'Pocheon Citizen', 'Daejeon Korail', 'Busan Transportation Corporation'] },
    GB: { name: 'EFL League One', season: '2025/26', source: 'https://www.cardiffcityfc.co.uk/news/202526-sky-bet-league-one-fixtures', teams: ['Cardiff City', 'Luton Town', 'Plymouth Argyle', 'Bolton Wanderers'] },
    DE: { name: '3. Liga', season: '2025/26', source: 'https://datencenter.dfb.de/competitions/3-liga/seasons/2025-2026/teams',
      teams: ['TSV 1860 München', 'Hansa Rostock', '1. FC Saarbrücken', 'Rot-Weiss Essen'] },
    ES: { name: 'Primera Federación', season: '2025/26', source: 'https://rfef.es/sites/default/files/2025-07/Calendario_Primera_Federacion_G1_2025-2026.pdf',
      teams: ['CD Tenerife', 'SD Ponferradina', 'Racing Club Ferrol', 'CD Lugo'] }
  };
  var firstSeasons = {"VN":"2026","JP":"2026","GB":"2025/26","US":"2026","ZA":"2025/26","EG":"2025/26","TH":"2026/27","KR":"2026","IT":"2025/26","BR":"2025","AR":"2025","FR":"2025/26","NZ":"2026"};
  var clubs = [];
  Object.keys(markets).forEach(function (code) {
    var m = markets[code];
    for (var i = 0; i < 12; i++) {
      var tier = i < 4 ? 1 : i < 8 ? 2 : 3;
      var vnLeague = code === 'VN' && (tier === 2 ? { name: 'V.League 2', season: '2026/27', source: vnTier2Source } : tier === 3 ? { name: 'Hạng Nhì Quốc gia', season: '2026', source: vnTier3Source } : null);
      var leagueReference = vnLeague || (tier === 2 ? secondTier[code] : tier === 3 ? thirdTier[code] : null);
      var name = m[5][i] || leagueReference && leagueReference.teams && leagueReference.teams[i % 4];
      if (!name) throw new Error('Thiếu tên CLB tham chiếu: ' + code + '-' + i);
      clubs.push({ id: code + '-' + i, name: name, country: code,
        confed: m[0], league: leagueReference ? leagueReference.name : tier === 1 ? m[1] : tier === 2 ? 'Hạng dưới · ' + code : 'Bán chuyên · ' + code,
        cup: tier === 3 && leagueReference ? null : m[2], source: name ? (leagueReference ? leagueReference.teamSources && leagueReference.teamSources[i % 4] || leagueReference.source : sources[code] || null) : null, referenceSeason: leagueReference && leagueReference.season || (tier === 1 ? firstSeasons[code] : null) || null, tier: tier, strength: Math.max(15, m[4] - i * 4), reputation: Math.max(10, m[4] - i * 3),
        financeUSD: m[3] * (i < 2 ? 5 : tier === 1 ? 1 : tier === 2 ? .12 : .025),
        academy: Math.max(30, m[4] - i * 3), promotion: Math.max(.12, .5 - i * .03), competition: m[4] - i * 2,
        minAge: 10, maxAge: 21, education: i !== 7, scholarship: i < 6, scout: Math.max(15, m[4] - i * 5),
        objective: i < 2 ? 'Cạnh tranh chức vô địch' : tier === 1 ? 'Giành suất dự cúp' : 'Phát triển cầu thủ và trụ hạng',
        tactics: ['possession', 'counter', 'defensive'][i % 3] });
    }
  });
  G.E.FOOTBALL_DATA = { markets: markets, confeds: confeds, clubs: clubs, sources: sources,
    calendar: { world: { anchor: 2026, cycle: 4 }, clubWorld: { anchor: 2025, cycle: 4, from: 2025 }, youth: { anchor: 2025, cycle: 2 } },
    positions: { GK: 'Thủ môn', DF: 'Hậu vệ', MF: 'Tiền vệ', FW: 'Tiền đạo' },
    weights: { GK: { defence: 4, vision: 2, strength: 2, discipline: 1 }, DF: { defence: 4, strength: 2, speed: 1, passing: 1 },
      MF: { passing: 3, vision: 3, technique: 2, stamina: 1 }, FW: { finishing: 4, speed: 2, technique: 2, spirit: 1 } },
    skills: ['technique', 'speed', 'stamina', 'strength', 'defence', 'passing', 'finishing', 'vision', 'spirit', 'discipline'],
    skillNames: ['Kỹ thuật', 'Tốc độ', 'Sức bền', 'Sức mạnh', 'Phòng ngự', 'Chuyền bóng', 'Dứt điểm', 'Tư duy chiến thuật', 'Tinh thần', 'Kỷ luật / đồng đội'],
    model: 'Mùa giải rút gọn, đối thủ tổng hợp, lương USD ước tính gameplay; không tái hiện lịch sử hoặc thể thức chính thức.' };
})(globalThis.G);
