/* Football configuration: gameplay estimates, not historical club finances or official fixtures. */
(function (G) {
  'use strict';
  var markets = {
    VN: ['AFC', 'V.League', 'Cúp Quốc gia', 18000, 53, ['Hà Nội FC', 'Hoàng Anh Gia Lai']],
    JP: ['AFC', 'J1 League', 'Emperor Cup', 180000, 70, ['Kashima Antlers', 'Urawa Reds']],
    KR: ['AFC', 'K League', 'Korea Cup', 140000, 68, ['Ulsan HD', 'Jeonbuk Hyundai']],
    TH: ['AFC', 'Thai League', 'Thai FA Cup', 45000, 58, ['Buriram United', 'BG Pathum']],
    GB: ['UEFA', 'Premier League', 'FA Cup', 2400000, 88, ['Arsenal', 'Liverpool']],
    ES: ['UEFA', 'La Liga', 'Copa del Rey', 1800000, 87, ['Real Madrid', 'Barcelona']],
    DE: ['UEFA', 'Bundesliga', 'DFB-Pokal', 1400000, 85, ['Bayern München', 'Borussia Dortmund']],
    IT: ['UEFA', 'Serie A', 'Coppa Italia', 1300000, 84, ['Inter', 'Juventus']],
    FR: ['UEFA', 'Ligue 1', 'Coupe de France', 950000, 82, ['Paris Saint-Germain', 'Lyon']],
    BR: ['CONMEBOL', 'Série A', 'Copa do Brasil', 300000, 77, ['Flamengo', 'Palmeiras']],
    AR: ['CONMEBOL', 'Primera División', 'Copa Argentina', 160000, 74, ['River Plate', 'Boca Juniors']],
    US: ['CONCACAF', 'MLS', 'US Open Cup', 450000, 73, ['LA Galaxy', 'Seattle Sounders']],
    MX: ['CONCACAF', 'Liga MX', 'Cúp quốc gia mô phỏng', 500000, 75, ['Club América', 'Monterrey']],
    EG: ['CAF', 'Egyptian Premier League', 'Egypt Cup', 90000, 66, ['Al Ahly', 'Zamalek']],
    ZA: ['CAF', 'Premiership', 'Nedbank Cup', 65000, 63, ['Mamelodi Sundowns', 'Orlando Pirates']],
    NZ: ['OFC', 'National League', 'Chatham Cup', 14000, 48, ['Auckland City', 'Wellington Olympic']]
  };
  var confeds = {
    AFC: { club: 'AFC Champions League Elite', nation: 'AFC Asian Cup', anchor: 2027, cycle: 4, strength: 66, slots: 8 },
    UEFA: { club: 'UEFA Champions League', second: 'UEFA Europa League', nation: 'UEFA European Championship', anchor: 2024, cycle: 4, strength: 82, slots: 16 },
    CONMEBOL: { club: 'Copa Libertadores', nation: 'Copa América', anchor: 2024, cycle: 4, strength: 79, slots: 6 },
    CAF: { club: 'CAF Champions League', nation: 'Africa Cup of Nations', anchor: 2025, cycle: 2, strength: 67, slots: 9 },
    CONCACAF: { club: 'CONCACAF Champions Cup', nation: 'CONCACAF Gold Cup', anchor: 2025, cycle: 2, strength: 68, slots: 6 },
    OFC: { club: 'OFC Champions League', nation: 'OFC Nations Cup', anchor: 2024, cycle: 4, strength: 49, slots: 1 }
  };
  var clubs = [];
  Object.keys(markets).forEach(function (code) {
    var m = markets[code];
    for (var i = 0; i < 12; i++) {
      var tier = i < 4 ? 1 : i < 8 ? 2 : 3;
      clubs.push({ id: code + '-' + i, name: m[5][i] || 'CLB mô phỏng ' + code + ' ' + (i + 1), country: code,
        confed: m[0], league: tier === 1 ? m[1] : tier === 2 ? 'Hạng dưới · ' + code : 'Bán chuyên · ' + code,
        cup: m[2], tier: tier, strength: Math.max(15, m[4] - i * 4), reputation: Math.max(10, m[4] - i * 3),
        financeUSD: m[3] * (i < 2 ? 5 : tier === 1 ? 1 : tier === 2 ? .12 : .025),
        academy: Math.max(30, m[4] - i * 3), promotion: Math.max(.12, .5 - i * .03), competition: m[4] - i * 2,
        minAge: 10, maxAge: 21, education: i !== 7, scholarship: i < 6, scout: Math.max(15, m[4] - i * 5),
        objective: i < 2 ? 'Cạnh tranh chức vô địch' : tier === 1 ? 'Giành suất dự cúp' : 'Phát triển cầu thủ và trụ hạng',
        tactics: ['possession', 'counter', 'defensive'][i % 3] });
    }
  });
  G.E.FOOTBALL_DATA = { markets: markets, confeds: confeds, clubs: clubs,
    calendar: { world: { anchor: 2026, cycle: 4 }, clubWorld: { anchor: 2025, cycle: 4, from: 2025 }, youth: { anchor: 2025, cycle: 2 } },
    positions: { GK: 'Thủ môn', DF: 'Hậu vệ', MF: 'Tiền vệ', FW: 'Tiền đạo' },
    weights: { GK: { defence: 4, vision: 2, strength: 2, discipline: 1 }, DF: { defence: 4, strength: 2, speed: 1, passing: 1 },
      MF: { passing: 3, vision: 3, technique: 2, stamina: 1 }, FW: { finishing: 4, speed: 2, technique: 2, spirit: 1 } },
    skills: ['technique', 'speed', 'stamina', 'strength', 'defence', 'passing', 'finishing', 'vision', 'spirit', 'discipline'],
    skillNames: ['Kỹ thuật', 'Tốc độ', 'Sức bền', 'Sức mạnh', 'Phòng ngự', 'Chuyền bóng', 'Dứt điểm', 'Tư duy chiến thuật', 'Tinh thần', 'Kỷ luật / đồng đội'],
    model: 'Mùa giải rút gọn, đối thủ tổng hợp, lương USD ước tính gameplay; không tái hiện lịch sử hoặc thể thức chính thức.' };
})(globalThis.G);
