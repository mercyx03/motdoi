'use strict';
const assert = require('node:assert/strict');
const E = require('./hardcore-isolation').gameContext().E;
const R = E.ROYAL920, A = E.ROYAL837, B = E.ROYAL847, F = E.FAITH830;

let count = 0;
function ok(v, m) { assert(v, m); count++; }
const quiet = () => {};

function life(c = 'GB', age = 20, sex = 'F') {
  const l = E.createLife({ mode: 'world', country: c, seed: 8470, gender: sex });
  Object.assign(l, { age, sex, birthYear: 2026 - age, pending: [], sched: [], school: null, job: null, indep: age >= 18, money: l.base * 1000, religion: A.CULTURE[c].faith });
  delete l.flags.royal;
  l.flags.royal920 = { houses: {}, met: {}, ledger: [], v: 1 };
  return l;
}

function house(l, c = 'GB') {
  const h = {
    cc: c,
    name: A.CULTURE[c].house,
    seat: 'root',
    founder837: 'root',
    members: [
      { id: 'root', name: 'Quốc vương', sex: 'M', by: 1960, role: 'sovereign', alive: true, titles: [{ key: 'sovereign' }], religion837: A.CULTURE[c].faith, country837: c },
      { id: 'player', player: true, name: l.name, sex: l.sex, by: l.birthYear, role: 'child', parent: 'root', alive: true, titles: [{ key: 'prince' }], religion837: A.CULTURE[c].faith, country837: c },
      { id: 'younger', name: 'Em Kế Tiếp', sex: 'M', by: l.birthYear + 2, role: 'child', parent: 'root', alive: true, titles: [{ key: 'prince' }], religion837: A.CULTURE[c].faith, country837: c }
    ]
  };
  l.flags.royal = { c, tier: 'direct' };
  R.st(l).houses[c] = h;
  A.prepare(l, h, false);
  B.syncTitles(l, h, h.members[0], null, quiet);
  return h;
}

function pick(l, id, key, arg, r = () => 0.2) {
  const d = E.DEC[id].make(l, r, arg);
  const i = d.data && d.data.keys ? d.data.keys.indexOf(key) : -1;
  const k = i >= 0 ? String(i) : key;
  if (!d.opts.some(o => o.k === k)) return false;
  E.DEC[id].apply(l, d, k, r, quiet);
  return true;
}

// 1. Chương trình đào tạo người kế vị Thụy Điển (SE)
{
  const l = life('SE', 18, 'F'), h = house(l, 'SE'), me = R.byId(h, 'player');
  const up = B.upState(l, me), sw = up.swedenTrack;
  ok(sw && sw.domesticOnly === true, 'SE heir has domestic education mandate');
  ok(R.mainTitle(me).includes('Thái nữ Thụy Điển'), 'SE female heir apparent title');
  ok(!pick(l, 'royalSwedenTrack847', 'mil_officers'), 'SE officer training requires basic conscription first');
  ok(pick(l, 'royalSwedenTrack847', 'mil_basic') && sw.milBasic && sw.milBranches.army, 'SE basic military + survival + defense structure');
  l.age = 19;
  ok(pick(l, 'royalSwedenTrack847', 'mil_officers') && sw.milBranches.navy, 'SE officer training Navy branch');
  l.age = 20;
  ok(pick(l, 'royalSwedenTrack847', 'mil_officers') && sw.milBranches.air && l.flags.royal.mil, 'SE officer training Air Force completes all 3 branches');
  ok(!pick(l, 'royalSwedenTrack847', 'un_embassy'), 'UN/embassy short internship requires UD training first');
  ok(pick(l, 'royalSwedenTrack847', 'riksdag') && sw.riksdag === 25, 'SE Riksdag & Constitutional study');
  ok(pick(l, 'royalSwedenTrack847', 'ud_diplomacy') && sw.ud === 25, 'SE Ministry for Foreign Affairs (UD) training');
  l.age = 21;
  ok(pick(l, 'royalSwedenTrack847', 'un_embassy') && sw.unIntern && sw.unIntern.duration.includes('ngắn hạn'), 'SE short-term UN/embassy internship preserves residency');
  ok(pick(l, 'royalSwedenTrack847', 'langs_eu'), 'SE multilingual training');
  for (const lg of ['Tiếng Thụy Điển', 'Tiếng Anh', 'Tiếng Pháp', 'Tiếng Đức']) {
    ok(up.langs.includes(lg), 'SE heir masters ' + lg);
  }
  // Khi lên ngôi, giữ cấp bậc tối cao trong ba quân chủng
  h.members[0].alive = false;
  R.succeed(l, h, quiet);
  ok(h.seat === 'player' && sw.supremeRank && me.supremeCommander847.includes('Ba Quân chủng'), 'SE sovereign holds supreme rank across Army, Navy, Air Force');
}

// 2. Tuổi thơ, Bảo mẫu châu Âu, Ngôn ngữ bản địa (Welsh/Bắc Âu), Công vụ 5-6t, Tách máy bay/xe 7-8t, Nội trú, 10 môn Quý tộc, Vệ sĩ & MXH
{
  const l = life('GB', 5, 'M'), h = house(l, 'GB'), me = R.byId(h, 'player');
  const up = B.upState(l, me);
  ok(up.nannyCount === 1 && up.autonomy === 15, 'Quality nanny with initial autonomy');
  ok(pick(l, 'royalUpbringing847', 'nanny_lang') && up.langs.length >= 2 && up.autonomy > 15, 'Nanny teaches natural 2nd language and increases autonomy');
  ok(pick(l, 'royalUpbringing847', 'regional_lang') && up.langs.includes('Tiếng Wales (Cymraeg)'), 'GB royal learns Welsh');
  ok(pick(l, 'royalUpbringing847', 'child_duty') && up.publicDuties === 1, 'Age 5-6 public duty with parents');
  ok(!up.separateTravel, 'Under 7 still travels with parents');

  // Sang 7 tuổi: tự động áp dụng quy tắc tách máy bay/xe chở riêng cho người kế vị trực tiếp
  l.age = 7;
  E.HOOKS.year.forEach(fn => fn(l, () => 0.3, quiet));
  ok(up.separateTravel === true, 'Age 7 heir automatically switches to separate plane/car travel');

  // Đan Mạch học tiếng Bắc Âu (Thụy Điển, Na Uy) & văn hóa giản dị
  const lDk = life('DK', 8, 'F'), hDk = house(lDk, 'DK'), meDk = R.byId(hDk, 'player'), upDk = B.upState(lDk, meDk);
  ok(pick(lDk, 'royalUpbringing847', 'regional_lang') && upDk.langs.some(x => x.includes('Thụy Điển') && x.includes('Na Uy')), 'DK royal learns Scandinavian neighbor languages');
  ok(upDk.security.nordicSimple === true && upDk.security.boundaryRule === true, 'Nordic simplicity + bodyguard no-touch boundary');
  ok(pick(lDk, 'royalUpbringing847', 'friends_circle') && upDk.friends.length === 1, 'Makes friends (commoner/well-off/noble) with discreet escort');

  // Trường nội trú quý tộc chia nam/nữ ở tuổi teen & 10 môn nghệ thuật/thể thao quý tộc
  l.age = 13;
  ok(pick(l, 'royalUpbringing847', 'boarding_0') && up.boarding && up.boarding.division === 'nam sinh', 'Teen male royal attends boys boarding school division');
  lDk.age = 13;
  ok(pick(lDk, 'royalUpbringing847', 'boarding_0') && upDk.boarding && upDk.boarding.division === 'nữ sinh', 'Teen female royal attends girls boarding school division');

  for (const [artKey] of B.ARTS_SPORTS) {
    ok(pick(l, 'royalUpbringing847', 'art_' + artKey) && up.arts[artKey] === 1, 'Royal practices noble art/sport: ' + artKey);
  }

  // Mạng xã hội: đội ngũ quản lý tk chính thức, tk clone tên kỳ lạ, và tự ý lập tk khi nhỏ bị lộ
  ok(pick(l, 'royalUpbringing847', 'social_team') && up.social.officialManagedByTeam, 'Official account managed by team');
  ok(pick(l, 'royalUpbringing847', 'social_clone') && up.social.cloneHandle && up.social.approvedByParents, 'Secret clone handle with strange name');
  ok(pick(l, 'royalUpbringing847', 'social_unapproved', null, () => 0.1) && up.social.leaks === 1 && !up.social.approvedByParents, 'Unapproved minor social media account triggers reprimand');
}

// 3. Thay đổi danh hiệu của người kế vị và người bạn đời khi kết hôn & đăng quang
{
  const l = life('GB', 26, 'M'), h = house(l, 'GB'), me = R.byId(h, 'player');
  // Thêm một anh cả làm người kế vị số 1 ban đầu để player đứng thứ 2
  h.members.splice(1, 0, { id: 'elder', name: 'Anh Cả', sex: 'M', by: l.birthYear - 3, role: 'child', parent: 'root', alive: true, titles: [{ key: 'prince' }], religion837: 'Anh giáo', country837: 'GB' });
  l.partner = { name: 'Catherine', sex: 'F', status: 'married', since: 25, alive: true };
  B.syncTitles(l, h, h.members[0], null, quiet);
  ok(l.partner.royalConsortTitle847.includes('Nữ Công tước'), 'Spouse of #2 in line has Ducal/Royal Princess style initially');

  // Anh cả qua đời -> player thành người kế vị số 1 (Prince of Wales) -> vợ thành Vương phi xứ Wales (Princess of Wales)
  h.members.find(m => m.id === 'elder').alive = false;
  B.syncTitles(l, h, h.members[0], null, quiet);
  ok(me.heirApparent847 && l.partner.royalConsortTitle847.includes('Vương phi xứ Wales'), 'Spouse title updates to Princess of Wales when partner becomes Heir Apparent');

  // Quốc vương băng hà -> player đăng quang -> vợ thành Hoàng hậu (Queen Consort)
  h.members[0].alive = false;
  R.succeed(l, h, quiet);
  ok(h.seat === 'player' && l.partner.royalConsortTitle847.includes('Hoàng hậu (Queen Consort)'), 'Spouse title updates to Queen Consort upon accession');
}

// 4. Nghi thức sinh con Hoàng gia theo từng nước (GB, NO, SE, BE, ES, MC, DK), sinh thường vs sinh mổ, đa thai, đại bác, đèn màu, xét duyệt tên & rửa tội
{
  // 4a. Hoàng gia Anh (GB): Ca sinh đơn thuận lợi (mẹ khỏe, con khỏe) -> Lindo Wing, thắp đèn London, đại bác 13h00
  const l = life('GB', 28, 'F'), h = house(l, 'GB');
  l.st.hea = 85;
  l.partner = { name: 'William', sex: 'M', status: 'married', since: 24, alive: true };
  l.kids = [{ name: 'George', sex: 'M', born: 28, alive: true }];
  R.kidsYear(l, quiet);
  const rec = B.ensureRoyalBirthRecord(l, 28);
  rec.hourBorn = 10; // Trước 13h chiều -> bắn đại bác ngay hôm nay
  ok(rec.delivery === 'vaginal' && rec.healthyQuick && rec.count === 1, 'Healthy first singleton delivery is vaginal & eligible for quick discharge');
  ok(rec.nameAnnounced === 'pending_week', 'Vaginal singleton birth announces name after a few days to 1 week');
  ok(pick(l, 'royalBirthProtocol847', 'gb_lindo_wing') && rec.mediaDebut.includes('Lindo Wing'), 'GB healthy singleton debuts on Lindo Wing steps at St. Mary\'s');
  ok(pick(l, 'royalBirthProtocol847', 'london_lights') && rec.lightsOn && rec.lightColor.includes('xanh lam'), 'London landmarks light up blue for a royal boy');
  ok(pick(l, 'royalBirthProtocol847', 'gun_salute') && rec.saluteFired, 'GB 13:00 gun salute (62 Tower of London + 41 Green Park + 5 stations)');

  // Xét duyệt tên nghiêm ngặt cho 6 vị trí kế vị đầu tiên + lễ rửa tội váy Victoria có đủ nội ngoại 2 bên
  ok(pick(l, 'royalBirthProtocol847', 'name_approval_strict') && rec.rejectedName847, 'Overly freestyle name rejected for baby in top 6 line of succession');
  ok(pick(l, 'royalBirthProtocol847', 'name_approval_dynastic') && rec.nameAnnounced === 'completed' && l.kids[0].royalName837.includes(A.CULTURE.GB.house), 'Approved dynastic name announced');
  ok(pick(l, 'royalBirthProtocol847', 'royal_christening_full') && rec.christening.done && l.kids[0].faith830.royalRite837.bothFamilies && l.kids[0].faith830.royalRite837.gown.includes('Victoria'), 'Royal christening invites both paternal & maternal families and uses Victorian gown');

  // 4b. Ca sinh đôi (nam - nữ) / sinh mổ ở tuổi 30: không ra Lindo Wing, công bố tên ngay, đèn hồng + xanh, thứ tự kế vị theo phút chào đời
  l.age = 30;
  l.kids.push(
    { name: 'Charlotte', sex: 'F', born: 30, alive: true },
    { name: 'Louis', sex: 'M', born: 30, alive: true }
  );
  R.kidsYear(l, quiet);
  const rec2 = B.ensureRoyalBirthRecord(l, 30);
  rec2.hourBorn = 16; // Sau 13h chiều -> bắn đại bác vào 13h ngày mai
  ok(rec2.delivery === 'cesarean' && rec2.count === 2 && rec2.nameAnnounced === 'immediate', 'Twin birth uses C-section, prioritizes health, and announces names immediately');
  ok(rec2.lightColor.includes('hồng xen lẫn xanh lam'), 'Boy-girl twins trigger mixed pink and blue London landmark lighting');
  ok(!pick(l, 'royalBirthProtocol847', 'gb_lindo_wing'), 'Lindo Wing early step debut blocked for C-section / twins');
  ok(pick(l, 'royalBirthProtocol847', 'csection_protocol') && rec2.mediaDebut.includes('ban công cung điện sau vài tuần'), 'C-section sends family photo with older sibling and debuts on palace balcony weeks later');
  const orderIds = R.order(l, h).map(m => m.name);
  ok(orderIds.indexOf('Charlotte') < orderIds.indexOf('Louis'), 'Twin born minutes earlier precedes younger twin in succession line');

  // 4c. Na Uy (NO): 21 phát đại bác ở 11 pháo đài lúc 12h trưa & bộ ảnh Ba Thế Hệ tại dinh thự Skaugum sau khi rời viện Rigshospitalet
  const lNo = life('NO', 27, 'M'), hNo = house(lNo, 'NO');
  lNo.kids = [{ name: 'Ingrid', sex: 'F', born: 27, alive: true }];
  R.kidsYear(lNo, quiet);
  const recNo = B.ensureRoyalBirthRecord(lNo, 27);
  ok(B.SALUTE_RULES.NO.stations === 11 && B.SALUTE_RULES.NO.hour === 12, 'Norway 11 fortresses 21-gun salute at 12:00 noon');
  ok(pick(lNo, 'royalBirthProtocol847', 'no_skaugum_portrait') && recNo.mediaDebut.includes('Ba Thế Hệ tại dinh thự Skaugum'), 'Norway 3-generation portrait at Skaugum');

  // 4d. Bỉ (BE): Thông cáo 3 ngôn ngữ, anh chị lớn vào thăm trước, Photo Call tại bệnh viện Erasme/St. Jan & sổ chúc mừng tại Cung điện Brussels
  const lBe = life('BE', 29, 'F'), hBe = house(lBe, 'BE');
  lBe.kids = [
    { name: 'Elisabeth', sex: 'F', born: 26, alive: true },
    { name: 'Gabriel', sex: 'M', born: 29, alive: true }
  ];
  R.kidsYear(lBe, quiet);
  const recBe = B.ensureRoyalBirthRecord(lBe, 29);
  ok(pick(lBe, 'royalBirthProtocol847', 'be_trilingual_photocall') && recBe.mediaDebut.includes('Erasme/St. Jan') && recBe.guestbookBe.entries === 1500, 'Belgium trilingual release, older sibling visit, hospital Photo Call & Brussels Palace guestbook');

  // 4e. Thụy Điển (SE) & Tây Ban Nha (ES): Đại bác 5 trạm lúc 12h trưa (SE) & họp báo/ảnh chân dung do gia đình tự chụp
  const lSe = life('SE', 28, 'F'), hSe = house(lSe, 'SE');
  lSe.kids = [{ name: 'Estelle', sex: 'F', born: 28, alive: true }];
  R.kidsYear(lSe, quiet);
  const recSe = B.ensureRoyalBirthRecord(lSe, 28);
  ok(B.SALUTE_RULES.SE.stations === 5 && B.SALUTE_RULES.SE.hour === 12, 'Sweden 5 fixed stations 21-gun salute at 12:00 noon');
  ok(pick(lSe, 'royalBirthProtocol847', 'es_se_press_photo') && recSe.mediaDebut.includes('gia đình tự chụp'), 'Sweden/Spain hospital press or family-taken portrait after rest');

  // 4f. Monaco (MC) & Đan Mạch (DK): Ra mắt từ ban công cung điện trước thần dân ở quảng trường
  const lMc = life('MC', 28, 'M'), hMc = house(lMc, 'MC');
  lMc.kids = [{ name: 'Jacques', sex: 'M', born: 28, alive: true }];
  R.kidsYear(lMc, quiet);
  const recMc = B.ensureRoyalBirthRecord(lMc, 28);
  ok(pick(lMc, 'royalBirthProtocol847', 'mc_dk_balcony') && recMc.mediaDebut.includes('ban công Cung điện'), 'Monaco/Denmark palace balcony debut');

  // 4g. Tương thích bản lưu (Save migration)
  const migrated = E.migrate(JSON.parse(JSON.stringify(l)));
  E.migrateExt(migrated);
  ok(R.st(migrated).royalBirths847[28].christening.done === true && R.st(migrated).royalBirths847[30].count === 2, 'Save migration preserves royal847 birth records and state');
}

// 5. Đào tạo Người kế vị & Nghi lễ Hoàng gia Na Uy (NO - 8.10.48)
{
  const l = life('NO', 8, 'F'), h = house(l, 'NO'), me = R.byId(h, 'player');
  const up = B.upState(l, me), no = up.norwayTrack;
  ok(no && no.modelCitizen === true && no.crownOnAltarOnly === true, 'NO heir track initialized with model citizen & 1908 no-coronation rule');
  ok(pick(l, 'royalNorwayTrack848', 'no_public_school') && no.publicSchool && no.walkToSchool, 'NO heir attends local public school (trường làng) and walks to school');
  ok(pick(l, 'royalNorwayTrack848', 'no_syttende_mai') && no.syttendeMaiCount === 1, 'NO 17 May National Day in Bunad welcoming Childrens Parade without military parade');
  l.age = 19;
  ok(pick(l, 'royalNorwayTrack848', 'no_mil_navy_air') && no.milBranches.navy && no.milBranches.air, 'NO Navy & Air Force academy training');
  ok(pick(l, 'royalNorwayTrack848', 'no_mil_engineer12m') && no.milBranches.engineer12m && l.flags.royal.mil, 'NO 12-month National Engineer Battalion training completes military qualification');
  ok(pick(l, 'royalNorwayTrack848', 'no_uni_env_law') && no.uniEnvLaw === 25, 'NO university focus on Environment/Sustainability & Constitutional Law');
  ok(pick(l, 'royalNorwayTrack848', 'no_study_abroad') && no.abroadStudy && no.abroadStudy.status === 'completed', 'NO heir allowed to study abroad');
  ok(pick(l, 'royalNorwayTrack848', 'no_daily_simplicity') && no.publicTransitDrive, 'NO royal uses public transport / drives own car without motorcade');
  ok(pick(l, 'royalNorwayTrack848', 'no_sustainable_banquet') && no.sustainableBanquet, 'NO state banquet prioritizes local eco-friendly produce and minimal waste');
  ok(!pick(l, 'royalNorwayTrack848', 'no_storting_oath'), 'Storting oath requires being monarch');
  h.members[0].alive = false;
  R.succeed(l, h, quiet);
  ok(h.seat === 'player', 'NO player succeeds to throne');
  ok(pick(l, 'royalNorwayTrack848', 'no_storting_oath') && no.stortingOath, 'NO new monarch swears constitutional oath before Storting');
  ok(pick(l, 'royalNorwayTrack848', 'no_nidaros_blessing') && no.nidarosBlessing && h.accession837.crownOnAltarOnly848, 'NO Consecration/Blessing at Nidaros Cathedral with crown on altar only');
}

// 6. Đào tạo Người kế vị & Nghi lễ Hoàng gia Đan Mạch (DK - 8.10.48)
{
  const l = life('DK', 7, 'M'), h = house(l, 'DK'), me = R.byId(h, 'player');
  const up = B.upState(l, me), dk = up.denmarkTrack;
  ok(dk && dk.noCrownMuseumOnly === true, 'DK heir track initialized with 1849 no-coronation rule');
  ok(pick(l, 'royalDenmarkTrack848', 'dk_public_school') && dk.publicSchoolTranegard, 'DK heir attends public primary school Tranegårdskolen');
  l.age = 19;
  ok(pick(l, 'royalDenmarkTrack848', 'dk_aarhus_uni') && dk.aarhusPoliSci === 25, 'DK heir studies Political Science at Aarhus University');
  ok(pick(l, 'royalDenmarkTrack848', 'dk_harvard_pseudonym') && dk.harvardPseudonym === 'Frederik Henriksen', 'DK heir studies at Harvard under a pseudonym');
  ok(pick(l, 'royalDenmarkTrack848', 'dk_antvorskov_officer') && dk.antvorskovOfficer, 'DK officer training at Antvorskov Barracks');
  ok(pick(l, 'royalDenmarkTrack848', 'dk_frogman_corps') && dk.frogmanCorps && l.flags.royal.mil, 'DK elite Navy Frogman Corps (Frømandskorpset) training completed');
  h.members[0].alive = false;
  R.succeed(l, h, quiet);
  ok(h.seat === 'player', 'DK player succeeds to throne');
  ok(pick(l, 'royalDenmarkTrack848', 'dk_christiansborg_proclamation') && dk.christiansborgProclaimed && h.accession837.noCrownBalcony848, 'DK PM proclaims 3 times on Christiansborg balcony; monarch in military uniform without crown');
  ok(pick(l, 'royalDenmarkTrack848', 'dk_carriage_procession') && dk.carriageProcession, 'DK Hygge horse-drawn carriage procession with Royal Hussars');
  ok(pick(l, 'royalDenmarkTrack848', 'dk_secular_thanksgiving') && dk.secularThanksgiving, 'DK civic/cultural church thanksgiving service');
}

// 7. Ấn Độ (IN): Hệ thống Đẳng cấp, Tôn giáo, Cải đạo & Hạn ngạch Suất học (SC 15%, ST 7.5%, OBC 27% vs General - 8.10.48)
{
  const I8 = E.ROYAL848;
  ok(I8.INDIA_CATEGORIES.SC.quotaShare === 0.15 && I8.INDIA_CATEGORIES.ST.quotaShare === 0.075 && I8.INDIA_CATEGORIES.OBC.quotaShare === 0.27, 'India constitutional quota shares: SC 15%, ST 7.5%, OBC 27%');

  const l = E.createLife({ mode: 'world', country: 'IN', seed: 8480, gender: 'M' });
  Object.assign(l, { age: 16, alive: true, indep: false, school: 'upper', pending: [], sched: [], money: l.base * 0.2, religion: 'Ấn Độ giáo' });
  l.fam.q = 1;
  const st = I8.indiaState848(l);
  st.origCategory = 'SC';
  I8.syncIndiaCategory848(l, st);
  ok(st.activeCategory === 'SC' && !st.scQuotaLostByConversion, 'Hindu Dalit student holds legal SC category');

  ok(pick(l, 'indiaQuotaFaith848', 'convert_navayana') && st.faith === 'Phật giáo Navayana' && st.activeCategory === 'SC', 'Converting to Navayana Buddhism escapes caste doctrine while preserving SC quota');

  l.age = 17;
  ok(pick(l, 'indiaQuotaFaith848', 'convert_christian_islam') && st.scQuotaLostByConversion && st.activeCategory === 'GEN' && st.socialStigmaRemains, 'Converting from SC to Christianity/Islam loses legal SC quota while social stigma remains');

  l.st.kno = 55;
  pick(l, 'indiaQuotaFaith848', 'apply_iit');
  ok(!st.admittedInst, 'Score 55 fails General cutoff (78) after losing SC status');

  l.age = 18;
  ok(pick(l, 'indiaQuotaFaith848', 'convert_navayana') && st.activeCategory === 'SC', 'Re-embracing Navayana Buddhism restores SC legal status');
  ok(pick(l, 'indiaQuotaFaith848', 'apply_aiims') && st.admittedInst && st.admittedInst.includes('AIIMS') && l.major === 'med', 'Score 55 passes SC cutoff (50) for AIIMS Medicine with 100% tuition waiver');
  ok(pick(l, 'indiaQuotaFaith848', 'claim_sc_st_support') && st.scholarshipClaimed, 'SC student receives free hostel, tuition waiver, and living stipend');

  l.age = 22;
  ok(pick(l, 'indiaQuotaFaith848', 'social_mobility_civil') && st.socialMobilityCivil, 'Reservation enables upward social mobility into civil service');
  ok(pick(l, 'indiaQuotaFaith848', 'quota_social_debate') && st.debatedQuota, 'Social conflict & debate over quota vs General competition modeled');

  const uniDec = E.DEC.uni.make(l, () => 0.3);
  ok(uniDec.opts.some(o => o.k === 'india_quota848'), 'Indian university decision includes IIT/AIIMS quota route');
}

// 8. Ấn Độ (IN 8.10.49): Bức tranh Tôn giáo - Nhánh nhỏ, Tháp Varna, Họ (Surname) như CMND xã hội & Hạn ngạch EWS 10%
{
  const I8 = E.ROYAL848;
  ok(I8.INDIA_CATEGORIES.EWS && I8.INDIA_CATEGORIES.EWS.quotaShare === 0.10, 'EWS 10% constitutional quota exists for low-income Forward Castes');
  ok(I8.INDIA_VARNAS849.Brahmin.surnames.includes('Sharma') && I8.INDIA_VARNAS849.Kshatriya.surnames.includes('Singh') && I8.INDIA_VARNAS849.Vaishya.surnames.includes('Gupta') && I8.INDIA_VARNAS849.Dalit.surnames.includes('Jatav'), 'Varna surnames mapped accurately');
  ok(I8.INDIA_RELIGIONS849.Hindu.share.includes('~79.8%') && I8.INDIA_RELIGIONS849.Islam.share.includes('~14.2%') && I8.INDIA_RELIGIONS849.Christian.share.includes('~2.3%') && I8.INDIA_RELIGIONS849.Sikh.share.includes('~1.7%') && I8.INDIA_RELIGIONS849.Buddhist.share.includes('~0.7%') && I8.INDIA_RELIGIONS849.Jain.share.includes('~0.4%'), 'India religious shares match demographic data');

  const l = E.createLife({ mode: 'world', country: 'IN', seed: 8491, gender: 'M' });
  Object.assign(l, { age: 16, alive: true, indep: false, school: 'upper', pending: [], sched: [], money: l.base * 0.25, religion: 'Ấn Độ giáo' });
  l.fam.q = 2;
  const st = I8.indiaState848(l);
  st.origCategory = 'GEN';
  st.varna = 'Brahmin';
  st.surname = 'Sharma';
  st.ewsApproved = false;
  I8.syncIndiaCategory848(l, st);
  ok(st.activeCategory === 'GEN', 'Forward Caste student starts as General before claiming EWS');
  ok(pick(l, 'indiaQuotaFaith848', 'apply_ews_10') && st.ewsApproved && st.activeCategory === 'EWS', 'Low-income Brahmin claims EWS 10% quota');
  l.age = 17;
  l.st.kno = 70;
  ok(pick(l, 'indiaQuotaFaith848', 'apply_iit') && st.admittedInst && st.admittedInst.includes('IIT'), 'Score 70 passes EWS cutoff (68) for IIT whereas General requires 78');

  ok(pick(l, 'indiaQuotaFaith848', 'surname_identity') && l.sur === 'Sharma', 'Surname identity check synchronizes Varna surname onto Indian character');
  ok(pick(l, 'indiaQuotaFaith848', 'hindu_branches') && st.faith === 'Ấn Độ giáo' && st.faithBranch, 'Learned Hindu branches (Vaishnavism, Shaivism, Shaktism Durga Puja, Smartism Advaita Vedanta)');
  ok(pick(l, 'indiaQuotaFaith848', 'christian_csi_cni_baptist') && st.faithBranch, 'Learned Indian Christian branches (CSI 1947, CNI 1970, CMC Vellore, Northeast Baptist Nagaland, Malankara Orthodox)');
  ok(pick(l, 'indiaQuotaFaith848', 'sikh_khalsa_punjab') && st.sikhKhalsa && st.surname === 'Singh' && l.sur === 'Singh', 'Learned Sikh Khalsa 5Ks vs Sahajdhari & Punjab granary');
  l.age = 18;
  ok(pick(l, 'indiaQuotaFaith848', 'jain_parsi_economy') && st.faithBranch.includes('Jain (Svetambara) & công nghiệp Parsi'), 'Learned Jain Ahimsa (Svetambara Dilwara vs Digambara) & Parsi Tata industrial philanthropy');
  ok(pick(l, 'indiaQuotaFaith848', 'quota_social_debate') && st.hindutvaObserved, 'Observed BJP / Ram Mandir Ayodhya & quota social debate');
}

// 9. Việt Nam (VN 8.10.49): Đời sống Tâm linh - Tôn giáo theo hoàn cảnh & Cách ly tuyệt đối không rò rỉ dữ liệu Ấn Độ / Hoàng gia Âu
{
  const lVN = E.createLife({ mode: 'vn', country: 'VN', seed: 8492, gender: 'F' });
  Object.assign(lVN, { age: 16, alive: true, indep: false, school: 'upper', pending: [], sched: [], money: lVN.base * 0.2 });
  lVN.fam.q = 1;
  const actsVN = E.actions(lVN).filter(x => x.ok === true && !x.catalogHidden).map(x => x.id);
  ok(actsVN.includes('vnFaithContext849'), 'VN character has access to Vietnamese spiritual/religious context menu');
  ok(!actsVN.includes('indiaQuotaFaith848') && !actsVN.includes('royalSwedenTrack847') && !actsVN.includes('royalNorwayTrack848') && !actsVN.includes('royalDenmarkTrack848'), 'VN character NEVER sees India caste/quota or European royal menus');

  // Ngay cả khi nhân vật VN đi du lịch/công tác sang Ấn Độ, cũng không bị gán đẳng cấp Varna hay hạn ngạch Ấn Độ
  lVN.abroad = { c: 'IN', left: 1 };
  const actsVNAbroad = E.actions(lVN).filter(x => x.ok === true && !x.catalogHidden).map(x => x.id);
  ok(!actsVNAbroad.includes('indiaQuotaFaith848') && !(lVN.flags.world120 && lVN.flags.world120.india848), 'VN character visiting India abroad never gets Indian caste/quota state');
  lVN.abroad = null;

  const vst = E.ROYAL848.vnFaithState849(lVN);
  ok(vst && vst.region && vst.familyClass, 'VN faith state initialized based on region, class, and family background');
  ok(pick(lVN, 'vnFaithContext849', 'vn_ancestors_buddhism') && vst.tradition.includes('Phật giáo'), 'VN ancestor worship & Vietnamese Buddhism (Bắc tông, Nam tông, Khất sĩ, Trúc Lâm) practiced');
  ok(pick(lVN, 'vnFaithContext849', 'vn_catholic_protestant') && (vst.tradition.includes('Công giáo') || vst.tradition.includes('Tin Lành')), 'VN Catholic/Protestant parish community & charity practiced');
  ok(pick(lVN, 'vnFaithContext849', 'vn_caodai_hoahao_mau') && (vst.tradition.includes('Cao Đài') || vst.tradition.includes('Mẫu')), 'VN indigenous faiths (Thờ Mẫu Tam Tứ phủ, Cao Đài, Phật giáo Hòa Hảo) learned');
  ok(pick(lVN, 'vnFaithContext849', 'vn_charity_scholarship') && vst.charityAid, 'Low-income VN student receives khuyến học scholarship from temple/parish');
  lVN.age = 18;
  lVN.money = lVN.base * 2;
  ok(pick(lVN, 'vnFaithContext849', 'vn_merit_philanthropy') && vst.meritPatron, 'Well-off VN character performs thiện nguyện / khuyến học philanthropy');

  // Ngược lại, nhân vật Ấn Độ không bao giờ thấy menu tâm linh nội địa Việt Nam
  const lIN = E.createLife({ mode: 'world', country: 'IN', seed: 8493, gender: 'M' });
  Object.assign(lIN, { age: 18, alive: true, pending: [], sched: [] });
  const actsIN = E.actions(lIN).filter(x => x.ok === true && !x.catalogHidden).map(x => x.id);
  ok(!actsIN.includes('vnFaithContext849'), 'Indian character NEVER sees Vietnam-specific faith menu');
}

// 10. Hàn Quốc (KR 8.10.50): Lễ Baek-il 100 ngày (Mâm cúng Samshin, 4 bánh Tteok chia 100 người, Hanbok/Decor nam-nữ & 3 phân khúc Tiết kiệm / Khá giả / Thượng lưu Chaebol)
{
  const I0 = E.ROYAL850;
  ok(I0.KR_BAEKIL_CAKES850.length === 4 && I0.KR_BAEKIL_TIERS850.saving && I0.KR_BAEKIL_TIERS850.affluent && I0.KR_BAEKIL_TIERS850.elite, 'KR Baek-il cakes & 3 socioeconomic tiers defined');

  const lKr = E.createLife({ mode: 'world', country: 'KR', seed: 8501, gender: 'F' });
  Object.assign(lKr, { age: 28, alive: true, indep: true, school: null, pending: [], sched: [], money: lKr.base * 5, religion: 'Phật giáo' });
  lKr.fam.q = 4;
  const boy = { name: 'Min-jun', sex: 'M', born: 28, alive: true };
  const girl = { name: 'Seo-yeon', sex: 'F', born: 27, alive: true };
  lKr.kids = [girl, boy];

  const recBoy = I0.krBaekIlRecord850(lKr, boy);
  const recGirl = I0.krBaekIlRecord850(lKr, girl);
  ok(recBoy.hanjaColor.includes('xanh dương hoặc xanh lá') && recBoy.hanbok.includes('Baji'), 'KR boy Baek-il uses blue/green 百 character, pastel blue/beige backdrop & Baji Hanbok');
  ok(recGirl.hanjaColor.includes('hồng hoặc đỏ/vàng') && recGirl.hanbok.includes('Chima') && recGirl.hanbok.includes('Ayam'), 'KR girl Baek-il uses pink/red/yellow 百 character, dusty pink/peach backdrop & Chima + Ayam Hanbok');

  ok(pick(lKr, 'krBaekIl850', 'samshin_table') && recBoy.samshinOffered, 'KR Samshin Halmoni offering (3 white rice bowls, 3 uncut seaweed soup bowls, 3 Namul)');
  ok(pick(lKr, 'krBaekIl850', 'tteok_100_share') && recBoy.shared100Neighbors, 'KR 4 traditional Tteok cakes & sharing Baekseolgi with 100 people');
  ok(pick(lKr, 'krBaekIl850', 'tier_old_money_modest') && recBoy.oldMoneyModest && recBoy.baekilBanjiGoldRing, 'Old money KR family can choose modest affluent Hanjeongsik style with 1-don (3.75g) Baek-il banji gold ring');

  recBoy.done = false;
  ok(pick(lKr, 'krBaekIl850', 'tier_saving') && recBoy.tierChosen === 'saving', 'KR Saving tier (Self-Baek-il with Coupang/Naver rental & home photos)');
  recBoy.done = false;
  ok(pick(lKr, 'krBaekIl850', 'tier_affluent') && recBoy.tierChosen === 'affluent' && recBoy.baekilBanjiGoldRing, 'KR Affluent tier (Hanjeongsik, Design Tteok, Snapshot photographer & Baek-il banji ring)');
  recBoy.done = false;
  ok(pick(lKr, 'krBaekIl850', 'tier_elite') && recBoy.tierChosen === 'elite' && recBoy.chaebolGoldBars, 'KR Elite Chaebol tier (6-star Shilla/Signiel VIP, Art Director, Haute Couture Hanbok, gold bars & Dior Baby/Gucci Kids)');
}

// 11. Tây Ban Nha (ES) & Quy tắc Sắc phong Thái tử/Thái nữ, Kế vị nhiều thế hệ (Cháu/chắt không tự động lên Thái tử/Thái nữ khi cha/mẹ chưa lên ngôi - 8.10.50)
{
  const lEs = life('ES', 22, 'F'), hEs = house(lEs, 'ES');
  // Trong house mặc định: root (Quốc vương), player (F, sinh 2004), younger (M, sinh 2006)
  // Tại Tây Ban Nha (ES): ưu tiên nam giới -> em trai (younger, M) đứng trước chị gái (player, F)!
  const lineEs = R.order(lEs, hEs);
  ok(lineEs[0].id === 'younger' && lineEs[1].id === 'player', 'Spain male-preference primogeniture places younger Prince ahead of older Princess');

  // Nếu không có con trai (chỉ có 2 công chúa): Trưởng nữ đứng đầu và được sắc phong Princesa de Asturias
  hEs.members.find(m => m.id === 'younger').sex = 'F';
  B.syncTitles(lEs, hEs, hEs.members[0], null, quiet);
  ok(R.order(lEs, hEs)[0].id === 'player' && R.byId(hEs, 'player').heirApparent847 && R.byId(hEs, 'player').asturias837, 'Spain eldest daughter becomes Princesa de Asturias when there is no son');

  // Thêm con đầu của Thái nữ (cháu ngoại của Vua đang trị vì) và cháu của con đầu (chắt của Vua đang trị vì)
  hEs.members.push(
    { id: 'grandchild1', name: 'Cháu Trưởng', sex: 'F', by: 2024, role: 'grandchild', parent: 'player', alive: true, titles: [{ key: 'prince' }], religion837: 'Công giáo', country837: 'ES' },
    { id: 'greatgrand1', name: 'Chắt Trưởng', sex: 'M', by: 2025, role: 'greatgrandchild', parent: 'grandchild1', alive: true, titles: [{ key: 'prince' }], religion837: 'Công giáo', country837: 'ES' }
  );
  const orderMulti = R.order(lEs, hEs).map(m => m.id);
  ok(orderMulti[0] === 'player' && orderMulti[1] === 'grandchild1' && orderMulti[2] === 'greatgrand1' && orderMulti[3] === 'younger', 'Line of succession: #1 Heir Apparent -> #2 first child of Heir -> #3 grandchild of Heir -> #4 younger sibling');

  B.syncTitles(lEs, hEs, hEs.members[0], null, quiet);
  const gc = R.byId(hEs, 'grandchild1');
  ok(!gc.heirApparent847 && !gc.asturias837 && gc.waitingParentAccession850, 'Grandchild of reigning Sovereign is NOT automatically Crown Princess while parent is still Heir Apparent');

  // Ngay cả khi cha/mẹ qua đời sớm mà Ông/Bà (Quốc vương root sống rất thọ) vẫn đang trị vì, người cháu cũng chưa tự động mang tước sắc phong của con vua cho tới khi được truyền ngôi/sắc phong
  hEs.members[0].by = 1940; // Vua 86 tuổi sống rất thọ
  ok(pick(lEs, 'royalSpainSuccession850', 'es_catholic_primogeniture') && lEs.religion === 'Công giáo', 'Spanish royal Catholic tradition & primogeniture verified');
  ok(pick(lEs, 'royalSpainSuccession850', 'multigen_investiture_check'), 'Multi-generational investiture check executed');
  ok(pick(lEs, 'royalSpainSuccession850', 'long_lived_monarch_abdication') && hEs.seat === 'player', 'Long-lived monarch (86yo) abdicates for health reasons; player ascends throne at mature age');
  // Sau khi player lên làm Nữ hoàng (hEs.seat === 'player'), người con trưởng (grandchild1) mới chính thức được sắc phong làm Thái nữ (Princesa de Asturias)!
  ok(gc.heirApparent847 === true && gc.asturias837 === true && gc.investedHeir850 === true, 'Grandchild is formally invested as Princesa de Asturias ONLY AFTER parent ascends the throne');
}

// 12. Anh Quốc (GB 8.10.50): Chọn A-Level vs. IB Diploma theo 3 Nhóm ngành Đại học
{
  const lUk = E.createLife({ mode: 'world', country: 'GB', seed: 8502, gender: 'M' });
  Object.assign(lUk, { age: 16, alive: true, indep: false, school: 'upper', pending: [], sched: [], city: 'London' });
  const u = E.ROYAL850.ukStudyState850(lUk);
  ok(pick(lUk, 'ukAlevelIb850', 'al_med') && u.mode === 'alevel' && u.targetMajor === 'med', 'UK Medicine/Dentistry/Vet prioritizes A-Level Chemistry + Biology');
  ok(pick(lUk, 'ukAlevelIb850', 'al_eng') && u.furtherMaths === true && u.targetMajor === 'eng', 'UK Russell Group Engineering prioritizes A-Level Maths + Further Maths + Physics');
  ok(pick(lUk, 'ukAlevelIb850', 'al_it') && u.furtherMaths === true && u.targetMajor === 'it', 'UK Computer Science prioritizes A-Level Maths + Further Maths + CS');
  ok(pick(lUk, 'ukAlevelIb850', 'ib_law') && u.mode === 'ib' && u.tokEeCompleted && u.targetMajor === 'law', 'UK Law favors IB Diploma (TOK & 4,000-word EE essay)');
  ok(pick(lUk, 'ukAlevelIb850', 'ib_ppe') && u.mode === 'ib' && u.targetMajor === 'ppe', 'UK Oxford/LSE PPE favors interdisciplinary IB Diploma');
  ok(pick(lUk, 'ukAlevelIb850', 'ib_ir') && u.mode === 'ib' && u.targetMajor === 'ir', 'UK International Relations favors IB Diploma');
  ok(pick(lUk, 'ukAlevelIb850', 'ib_psy') && u.mode === 'ib' && u.targetMajor === 'psy', 'UK Psychology favors IB Diploma combining science & humanities');
  ok(pick(lUk, 'ukAlevelIb850', 'bal_biz_ib') && u.mathsHL === true && u.targetMajor === 'biz', 'UK Balanced Economics/Finance with IB requires Maths Higher Level (HL)');
  ok(pick(lUk, 'ukAlevelIb850', 'bal_arch_alevel') && u.portfolioReady === true && u.mode === 'alevel', 'UK Architecture/Design A-Level balances Maths/Physics with Art Portfolio');
}

// 13. Hệ thống Đam mê, Năng khiếu (Sở trường) & Sở đoản: Không tự động ghét ngành ngoài đam mê, cải thiện sở đoản & giữ kỹ năng khi đổi đam mê (8.10.50)
{
  const lPa = E.createLife({ mode: 'vn', country: 'VN', seed: 8503, gender: 'F' });
  Object.assign(lPa, { age: 18, alive: true, pending: [], sched: [] });
  const p = E.ROYAL850.passionState850(lPa);
  p.passions = ['math_logic', 'music_perf'];
  p.aptitudes = ['econ_biz']; // Có năng khiếu kinh doanh nhưng không nằm trong đam mê
  p.weaknesses = ['art_design'];

  const fitPassion = E.ROYAL850.evalDomainFit850(lPa, 'math_logic');
  const fitAptitudeOnly = E.ROYAL850.evalDomainFit850(lPa, 'econ_biz');
  const fitNeutral = E.ROYAL850.evalDomainFit850(lPa, 'law_lit');
  const fitWeakness = E.ROYAL850.evalDomainFit850(lPa, 'art_design');

  ok(fitPassion.isPassion && fitPassion.enthusiasmBonus > 0 && !fitPassion.hatesIt, 'Passion domain gives enthusiasm & productivity bonus');
  ok(fitAptitudeOnly.isAptitude && !fitAptitudeOnly.isPassion && fitAptitudeOnly.smoothWorkBonus > 0 && !fitAptitudeOnly.hatesIt, 'Aptitude without passion still works smoothly without being hated');
  ok(fitNeutral.neutralOk && !fitNeutral.hatesIt, 'Non-passion domain is NOT hated unless it is a weakness');
  ok(fitWeakness.isWeakness && fitWeakness.hatesIt, 'Weakness domain is identified as a weakness');

  ok(pick(lPa, 'passionAptitude850', 'pursue_passion') && p.retainedSkills.math_logic >= 22, 'Pursuing passion builds skill');
  ok(pick(lPa, 'passionAptitude850', 'leverage_aptitude') && p.retainedSkills.econ_biz >= 30, 'Leveraging aptitude works smoothly');
  ok(pick(lPa, 'passionAptitude850', 'study_neutral_domain'), 'Studying neutral non-passion domain works comfortably');
  ok(pick(lPa, 'passionAptitude850', 'avoid_weakness'), 'Player can choose to avoid weakness');
  ok(pick(lPa, 'passionAptitude850', 'improve_weakness') && !p.weaknesses.includes('art_design') && p.retainedSkills.art_design >= 10, 'Player can choose to practice and overcome weakness');
  ok(pick(lPa, 'passionAptitude850', 'natural_passion_shift') && p.shiftsCount === 1 && p.retainedSkills.math_logic >= 22, 'Natural passion shift preserves previously trained skills');
}

// 14. Hệ thống 16 Nhóm Tính cách MBTI & Văn hóa Giờ sinh / Tuổi Con Giáp Á Đông vs. Phương Tây (8.10.50)
{
  const I0 = E.ROYAL850;
  ok(Object.keys(I0.MBTI_TYPES850).length === 16, 'All 16 MBTI types defined');

  const lVn = E.createLife({ mode: 'vn', country: 'VN', seed: 8504, year: 1999, gender: 'M' }); // 1999 = năm Kỷ Mão / Mẹo
  lVn.birthYear = 1999;
  Object.assign(lVn, { age: 20, alive: true, pending: [], sched: [] });
  const m = I0.mbtiState850(lVn);
  ok(m && I0.MBTI_TYPES850[m.code], 'Initial MBTI assigned');
  ok(pick(lVn, 'mbtiProfile850', 'mbti_work_study') && m.workApplied === 1, 'MBTI work/study style applied moderately');
  ok(pick(lVn, 'mbtiProfile850', 'mbti_family_care') && m.relApplied === 1, 'MBTI family/relationship care applied');
  ok(pick(lVn, 'mbtiProfile850', 'set_mbti_INTJ') && m.code === 'INTJ' && m.selfSelected, 'Player retains full agency to choose/shape own MBTI');

  // Kiểm tra văn hóa Giờ sinh Can Chi & Tuổi con giáp:
  // Á Đông (VN, CN, JP, KR, KP) dùng giờ Can Chi và tuổi con giáp (VN năm 1999 là Mẹo (Mèo), KR/CN/JP năm 1999 là Mão (Thỏ))
  const astroVn = E.astroText(lVn);
  ok(astroVn.includes('giờ ') && astroVn.includes('tuổi Mẹo (Mèo)') && astroVn.includes('MBTI: INTJ'), 'Vietnam astroText includes Can Chi birth hour, Vietnamese zodiac Mẹo (Mèo), and MBTI');

  const lKr = E.createLife({ mode: 'world', country: 'KR', seed: 8505, year: 1999, gender: 'F' });
  lKr.birthYear = 1999;
  const astroKr = E.astroText(lKr);
  ok(astroKr.includes('giờ ') && astroKr.includes('tuổi Mão (Thỏ)'), 'Korea/China/Japan/North Korea astroText uses Can Chi birth hour and zodiac Mão (Thỏ)');

  // Phương Tây (GB, US, SE, ES...) TUYỆT ĐỐI KHÔNG dùng giờ Can Chi (Tý, Sửu, Dần...) hay tuổi con giáp!
  for (const wc of ['GB', 'US', 'SE', 'ES']) {
    const lWest = E.createLife({ mode: 'world', country: wc, seed: 8506, year: 1999, gender: 'M' });
    lWest.birthYear = 1999;
    const astroWest = E.astroText(lWest);
    ok(!I0.usesEasternZodiac850(lWest) && I0.easternZodiacAnimal850(lWest) === null, wc + ' does not use Eastern zodiac');
    ok(astroWest.includes('sinh lúc ') && !/giờ (Tý|Sửu|Dần|Mão|Thìn|Tỵ|Ngọ|Mùi|Thân|Dậu|Tuất|Hợi)/.test(astroWest) && !astroWest.includes('tuổi '), wc + ' astroText uses 24h clock and Western zodiac without Can Chi hour or animal zodiac');
  }
}

// 15. Fix học tập Vương quốc Anh (GB) không lẫn chương trình/sự kiện Việt Nam & tích hợp lựa chọn A-Level/IB ở tuổi 16 (8.10.51)
{
  for (const city of ['London', 'Manchester', 'Edinburgh', 'Cardiff', 'Belfast']) {
    const lGb = E.createLife({ mode: 'world', country: 'GB', seed: 901 });
    lGb.city = city;
    lGb.fam.q = 4;
    lGb.st.hea = 90;
    for (let a = 0; a < 18; a++) {
      E.beginYear(lGb);
      let g = 0;
      while (lGb.pending && lGb.pending.length && g++ < 20) {
        const p = lGb.pending[0];
        const sub = p.opts.find(o => o.k === 'submit');
        const alMed = p.id === 'sixth829' ? p.opts.find(o => o.k === 'al_eng') : null;
        E.resolve(lGb, sub ? sub.k : alMed ? alMed.k : p.opts[0].k);
      }
      E.finishYear(lGb);
      g = 0;
      while (lGb.pending && lGb.pending.length && g++ < 20) {
        const p = lGb.pending[0];
        const sub = p.opts.find(o => o.k === 'submit');
        E.resolve(lGb, sub ? sub.k : p.opts[0].k);
      }
      E.endYear(lGb);
    }
    const vnLeak = lGb.log.filter(x => /lớp [0-9]|THCS|THPT|báo tường|vào Nam \/ ra Bắc|tiền tiểu học/i.test(x.t));
    ok(vnLeak.length === 0, 'UK city ' + city + ' has zero Vietnamese school stage or event leakage');
    ok(lGb.flags.study829 && lGb.flags.study829.ukTrack850 && lGb.flags.study829.ukTrack850.furtherMaths === true, 'UK age-16 sixth829 popup directly supports A-Level/IB major groups across all UK regions (' + city + ')');
  }
}

// 16. 10 Hoàng gia Châu Âu: Tôn giáo, Quyền Kế vị (8 Bình đẳng tuyệt đối vs 2 Ưu tiên nam giới ES & MC), Phủ quyết Hiến định, Đặc quyền Trắng Vatican, Tôn giáo Con cái & Hợp pháp hóa Con ngoài giá thú Monaco (8.10.51)
{
  const R1 = E.ROYAL851;
  const all10 = ['GB', 'SE', 'NO', 'DK', 'NL', 'BE', 'LU', 'ES', 'MC', 'LI'];
  ok(all10.every(c => A.COUNTRIES.includes(c) && R1.EURO_ROYAL_MATRIX851[c]), 'All 10 European monarchies registered in ROYAL837 and EURO_ROYAL_MATRIX851');

  // 8 nước Tuyệt đối bình đẳng (SE 1980, NL 1983, NO 1990, BE 1991, DK 2009, LU 2011, GB 2013, LI cải cách Luật Salic): Trưởng nữ đứng trước em trai
  for (const c of ['SE', 'NL', 'NO', 'BE', 'DK', 'LU', 'GB', 'LI']) {
    const lEq = life(c, 14, 'F'), hEq = house(lEq, c);
    const order = R.order(lEq, hEq);
    ok(order[0].id === 'player' && order[1].id === 'younger', c + ' uses Absolute Primogeniture: eldest daughter (#1) precedes younger brother (#2)');
    ok(R1.euroRoyalConfig851(c).primogeniture === 'absolute_primogeniture', c + ' marked absolute_primogeniture');
  }

  // Chỉ có Tây Ban Nha (ES) và Monaco (MC) ưu tiên nam giới: Em trai đứng trước chị gái trong cùng hàng con
  for (const c of ['ES', 'MC']) {
    const lMp = life(c, 22, 'F'), hMp = house(lMp, c);
    const order = R.order(lMp, hMp);
    ok(order[0].id === 'younger' && order[1].id === 'player', c + ' uses Male-Preference Primogeniture: younger brother (#1) precedes elder sister (#2)');
    ok(R1.euroRoyalConfig851(c).primogeniture === 'male_preference', c + ' marked male_preference');
  }

  // Tây Ban Nha (ES) vs Monaco (MC): Quân chủ biểu tượng không được phủ quyết luật vì tôn giáo vs Thân vương Monaco có quyền phủ quyết dự luật trái giáo lý Công giáo
  const lEs = life('ES', 28, 'M'), hEs = house(lEs, 'ES'), meEs = R.byId(hEs, 'player'), upEs = B.upState(lEs, meEs);
  ok(!R1.euroRoyalConfig851('ES').stateReligion && !R1.euroRoyalConfig851('ES').canVetoReligious851, 'Spain has no state religion and King cannot veto laws on religious grounds');
  ok(pick(lEs, 'royalEuroSuccessionFaith851', 'compare_10_euro_monarchies') && upEs.comparedEuro10_851, 'Compared 10 European monarchies');
  ok(pick(lEs, 'royalEuroSuccessionFaith851', 'es_constitutional_no_religious_veto') && upEs.esNoReligiousVeto851, 'Spain symbolic constitutional monarch action');
  ok(pick(lEs, 'royalEuroSuccessionFaith851', 'vatican_privilege_du_blanc') && upEs.vaticanPrivilegeDuBlanc851, 'Queen of Spain holds Vatican Privilège du blanc');

  const lMc = life('MC', 30, 'M'), hMc = house(lMc, 'MC'), meMc = R.byId(hMc, 'player'), upMc = B.upState(lMc, meMc);
  lMc.partner = { name: 'Charlene', sex: 'F', status: 'married', since: 28, alive: true, religion130: 'Tin Lành' };
  ok(R1.euroRoyalConfig851('MC').stateReligion && R1.euroRoyalConfig851('MC').canVetoReligious851, 'Monaco has Catholic State Religion and Sovereign Prince can veto bills violating Catholic doctrine');
  ok(pick(lMc, 'royalEuroSuccessionFaith851', 'mc_prince_catholic_veto') && upMc.mcPrinceCatholicVeto851, 'Monaco Prince legislative veto over bill contradicting Catholic doctrine');
  ok(pick(lMc, 'royalEuroSuccessionFaith851', 'mc_spouse_voluntary_catholic_conversion') && lMc.partner.religion130 === 'Công giáo', 'Monaco spouse proactively converts to Catholicism before marriage');
  ok(pick(lMc, 'royalEuroSuccessionFaith851', 'vatican_privilege_du_blanc') && upMc.vaticanPrivilegeDuBlanc851, 'Princess of Monaco holds Vatican Privilège du blanc');

  // Bỉ (BE): Hiến pháp thế tục tách biệt nhà thờ – nhà nước + truyền thống Công giáo sùng đạo + Đặc quyền màu trắng Vatican (Hoàng hậu Mathilde)
  const lBe = life('BE', 26, 'F'), hBe = house(lBe, 'BE'), meBe = R.byId(hBe, 'player'), upBe = B.upState(lBe, meBe);
  ok(!R1.euroRoyalConfig851('BE').stateReligion && R1.euroRoyalConfig851('BE').vaticanPrivilegeDuBlanc, 'Belgium has secular constitution and Queen Mathilde holds Vatican Privilège du blanc');
  ok(pick(lBe, 'royalEuroSuccessionFaith851', 'be_secular_constitution_devout_catholic') && upBe.beSecularDevout851, 'Belgium secular constitution + devout Catholic practice');
  ok(pick(lBe, 'royalEuroSuccessionFaith851', 'vatican_privilege_du_blanc') && upBe.vaticanPrivilegeDuBlanc851, 'Queen of Belgium exercises Vatican Privilège du blanc');

  // Liechtenstein (LI): Quốc giáo Công giáo, Luật Hôn nhân gia tộc (House Law) cần văn bản đồng ý của Thân vương & Cải cách từ Luật Salic cổ sang Bình đẳng giới
  const lLi = life('LI', 25, 'F'), hLi = house(lLi, 'LI'), meLi = R.byId(hLi, 'player'), upLi = B.upState(lLi, meLi);
  ok(R1.euroRoyalConfig851('LI').reformedFromSalicLaw && R1.euroRoyalConfig851('LI').stateReligion, 'Liechtenstein reformed from Salic Law and protects Catholic State Religion');
  ok(pick(lLi, 'royalEuroSuccessionFaith851', 'li_salic_to_equal_and_house_law') && upLi.liHouseLawAndEqualReform851, 'Liechtenstein House Law written consent & Salic Law reform action');

  // Hà Lan (NL): Giao thoa gia đình (Rửa tội Tin Lành Orange-Nassau + dự lễ Công giáo cùng mẹ & Tin Lành cùng cha)
  const lNl = life('NL', 28, 'F'), hNl = house(lNl, 'NL'), meNl = R.byId(hNl, 'player'), upNl = B.upState(lNl, meNl);
  lNl.partner = { name: 'Partner', sex: 'M', status: 'married', since: 25, alive: true };
  lNl.kids = [{ name: 'Amalia', sex: 'F', born: lNl.age, alive: true }];
  R.kidsYear(lNl, quiet);
  ok(pick(lNl, 'royalEuroSuccessionFaith851', 'nl_protestant_catholic_family_blend') && upNl.nlBlendedFaith851, 'Netherlands blended Protestant/Catholic family upbringing');

  // Kiểm tra 2 nhóm quy định tôn giáo đối với Con cái:
  // Nhóm 1 (Bắt buộc 100%: GB, SE, NO, DK, MC, LI) -> nếu cải đạo khác đạo Hoàng gia sẽ mất quyền kế vị
  const kidMc = { id: 'mc_kid', name: 'Jacques', sex: 'M', by: 2020, parent: 'player', alive: true, titles: [{ key: 'prince' }], country837: 'MC' };
  hMc.members.push(kidMc);
  const resMcWrong = R1.evaluateChildFaithEligibility851(lMc, hMc, kidMc, 'Không tôn giáo');
  ok(!resMcWrong.eligible && kidMc.disinheritedForFaith851 && !R.order(lMc, hMc).some(m => m.id === 'mc_kid'), 'Mandatory group (MC/LI/GB/SE/NO/DK): child not raised in royal faith loses succession right');
  const resMcRight = R1.evaluateChildFaithEligibility851(lMc, hMc, kidMc, 'Công giáo');
  ok(resMcRight.eligible && !kidMc.disinheritedForFaith851 && R.order(lMc, hMc).some(m => m.id === 'mc_kid'), 'Mandatory group (MC): child baptized & raised Roman Catholic retains succession right');

  // Nhóm 2 (Tự do pháp lý / Giao thoa: NL, BE, ES, LU) -> dù con cái theo đạo khác cũng giữ nguyên 100% quyền kế vị
  const kidBe = { id: 'be_kid', name: 'Gabriel', sex: 'M', by: 2020, parent: 'player', alive: true, titles: [{ key: 'prince' }], country837: 'BE' };
  hBe.members.push(kidBe);
  const resBeOther = R1.evaluateChildFaithEligibility851(lBe, hBe, kidBe, 'Không tôn giáo');
  ok(resBeOther.eligible && !kidBe.disinheritedForFaith851 && R.order(lBe, hBe).some(m => m.id === 'be_kid'), 'Voluntary/Secular group (BE/ES/LU/NL): child retains 100% succession right regardless of religion');

  // Kiểm tra Con ngoài giá thú: Monaco (MC) Hợp pháp hóa sau sinh khi cha mẹ kết hôn hợp pháp vs 9 nước còn lại cấm vĩnh viễn
  lMc.partner.status = 'dating';
  const mcOutWedlock = { id: 'mc_casiraghi', name: 'Andrea', sex: 'M', by: 2022, parent: 'player', alive: true, titles: [], country837: 'MC', religion837: 'Công giáo', bornOutOfWedlock851: true, illegitimate837: true };
  hMc.members.push(mcOutWedlock);
  R1.syncLegitimacy851(lMc, hMc);
  ok(!R.order(lMc, hMc).some(m => m.id === 'mc_casiraghi'), 'Monaco child born out of wedlock is excluded before parents marry');
  ok(pick(lMc, 'royalEuroSuccessionFaith851', 'resolve_out_of_wedlock_legitimation'), 'Monaco post-birth legitimation action executed');
  ok(mcOutWedlock.legitimatedByMarriage851 === true && !mcOutWedlock.illegitimate837 && R.order(lMc, hMc).some(m => m.id === 'mc_casiraghi'), 'Monaco child born out of wedlock is immediately placed into line of succession after parents legally marry');

  // Ngược lại tại Bỉ (BE) và 8 nước còn lại: Cấm vĩnh viễn dù cha mẹ kết hôn hợp pháp sau đó
  lBe.partner = { name: 'Spouse', sex: 'M', status: 'married', since: 26, alive: true };
  const beOutWedlock = { id: 'be_out', name: 'ChildOut', sex: 'M', by: 2021, parent: 'player', alive: true, titles: [], country837: 'BE', religion837: 'Công giáo', bornOutOfWedlock851: true, illegitimate837: true };
  hBe.members.push(beOutWedlock);
  ok(pick(lBe, 'royalEuroSuccessionFaith851', 'resolve_out_of_wedlock_legitimation'), 'Belgium out-of-wedlock check executed');
  ok(beOutWedlock.permanentIllegitimacyBan851 === true && beOutWedlock.illegitimate837 === true && !R.order(lBe, hBe).some(m => m.id === 'be_out'), 'Other 9 European monarchies permanently bar children born before parents legal marriage even if parents marry later');
}

// 17. Thứ tự kế vị theo nhánh (cháu đích tôn đẩy chú/dì xuống) & tước hiệu xứ sở của người kế vị và bạn đời (8.10.52)
{
  function lineHouse(c) {
    const l = life(c, 30, 'M');
    const h = {
      cc: c, name: A.CULTURE[c].house, seat: 'root', founder837: 'root',
      members: [
        { id: 'root', name: 'Sov', sex: 'M', by: 1940, role: 'sovereign', alive: true, titles: [{ key: 'sovereign' }], religion837: A.CULTURE[c].faith },
        { id: 'heirD', name: 'HeirDaughter', sex: 'F', by: 1966, parent: 'root', alive: true, titles: [{ key: 'prince' }], religion837: A.CULTURE[c].faith },
        { id: 'sib', name: 'Uncle', sex: 'M', by: 1968, parent: 'root', alive: true, titles: [{ key: 'prince' }], religion837: A.CULTURE[c].faith },
        { id: 'k1', name: 'Child1', sex: 'F', by: 1990, parent: 'heirD', alive: true, titles: [], religion837: A.CULTURE[c].faith },
        { id: 'k2', name: 'Child2', sex: 'M', by: 1992, parent: 'heirD', alive: true, titles: [], religion837: A.CULTURE[c].faith },
        { id: 'k3', name: 'Child3', sex: 'F', by: 1994, parent: 'heirD', alive: true, titles: [], religion837: A.CULTURE[c].faith }
      ]
    };
    R.st(l).houses[c] = h; A.prepare(l, h, false);
    return { l, h };
  }
  // Bình đẳng tuyệt đối (SE): #1 Thái nữ, #2 con 1, #3 con 2, #4 con 3, rồi mới tới chú
  {
    const { l, h } = lineHouse('SE');
    ok(R.order(l, h).map(m => m.id).join(',') === 'heirD,k1,k2,k3,sib', 'Absolute: heir #1, children #2-#4 by birth, uncle after');
    h.members.push({ id: 'gk1', name: 'Grandchild', sex: 'M', by: 2015, parent: 'k1', alive: true, titles: [], religion837: A.CULTURE.SE.faith });
    ok(R.order(l, h).map(m => m.id).join(',') === 'heirD,k1,gk1,k2,k3,sib', 'First grandchild of heir becomes #3 and pushes younger children & uncle down');
    h.members.push({ id: 'gk2', name: 'Grandchild2', sex: 'F', by: 2017, parent: 'k1', alive: true, titles: [], religion837: A.CULTURE.SE.faith });
    ok(R.order(l, h).map(m => m.id).join(',') === 'heirD,k1,gk1,gk2,k2,k3,sib', 'Second grandchild pushes the rest further down');
  }
  // Ưu tiên nam (ES): con trai đứng trước chị gái; con của con trai đứng ngay sau cha mình
  {
    const { l, h } = lineHouse('ES');
    h.members.find(m => m.id === 'heirD').sex = 'M';
    h.members.find(m => m.id === 'sib').sex = 'F';
    ok(R.order(l, h).map(m => m.id).join(',') === 'heirD,k2,k1,k3,sib', 'Male preference: younger son k2 precedes elder sister k1');
    h.members.push({ id: 'gk', name: 'SonOfK2', sex: 'M', by: 2018, parent: 'k2', alive: true, titles: [], religion837: A.CULTURE.ES.faith });
    ok(R.order(l, h).map(m => m.id).join(',') === 'heirD,k2,gk,k1,k3,sib', 'Male preference: child of the son stands right after his father');
  }
  // Tước hiệu xứ sở của người kế vị số 1
  ok(B.HEIR_TITLES.GB.M.includes('Thân vương xứ Wales') && B.HEIR_TITLES.GB.M.includes('Cornwall') && B.HEIR_TITLES.GB.M.includes('Rothesay'), 'GB heir: Prince of Wales, Duke of Cornwall & Rothesay');
  ok(B.HEIR_TITLES.GB.F.includes('Thân vương nữ xứ Wales'), 'GB female heir: Princess of Wales in own right');
  ok(B.HEIR_TITLES.BE.F.includes('Nữ Công tước xứ Brabant') && B.HEIR_TITLES.ES.F.includes('Thân vương nữ xứ Asturias'), 'BE Brabant / ES Asturias heir titles');
  ok(B.HEIR_TITLES.SE.F.includes('Västergötland') && !/xứ/.test(B.HEIR_TITLES.NO.M.replace('không phong xứ riêng', '')), 'SE duchy granted by King; NO has no territorial title');
  ok(B.HEIR_TITLES.DK.M.includes('Monpezat') && B.HEIR_TITLES.MC.F.includes('Nữ Hầu tước xứ Baux'), 'DK Monpezat family title; MC Marquise des Baux');
  ok(B.HEIR_TITLES.LU.M.includes('Đại Công tước Kế vị') && B.HEIR_TITLES.LU.M.includes('Bourbon-Parma') && B.HEIR_TITLES.LI.F.includes('Thân vương nữ Kế vị'), 'LU Hereditary Grand Duke + Bourbon-Parma; LI Hereditary Princess');
  // Vợ của Thái tử hưởng phiên bản nữ; chồng của Thái nữ không chạm tước xứ của vợ (trừ Thụy Điển mượn danh hạ vị)
  const CT = B.CONSORT_TITLES;
  ok(CT.GB.heir.F.includes('Vương phi xứ Wales') && CT.ES.heir.F.includes('Vương phi xứ Asturias') && CT.BE.heir.F.includes('Brabant') && CT.MC.heir.F.includes('Baux'), 'Wife of male heir shares female version of territorial title');
  ok(CT.BE.heir.M.startsWith('Hoàng tử Bỉ') && CT.ES.heir.M.startsWith('Vương thân Tây Ban Nha') && CT.LU.heir.M.startsWith('Hoàng tử xứ Luxembourg') && CT.MC.heir.M.startsWith('Hoàng thân Monaco'), 'Husband of female heir gets only honorary prince title (BE/ES/LU/MC)');
  ok(CT.LI.heir.M.includes('không là Thân vương xứ Liechtenstein') && CT.NO.heir.M.includes('Vương thân Na Uy') && CT.DK.heir.M.includes('Vương thân'), 'LI/NO/DK husband consort titles');
  ok(CT.SE.heir.M.includes('Công tước danh dự xứ Västergötland') && CT.SE.heir.M.includes('không sở hữu'), 'SE husband borrows duchy name in subordinate honorary form');
  {
    const lW = life('ES', 30, 'F'), hW = house(lW, 'ES'), meW = R.byId(hW, 'player');
    hW.members.find(m => m.id === 'younger').alive = false;
    lW.partner = { name: 'Husband', sex: 'M', status: 'married', since: 28, alive: true };
    B.syncTitles(lW, hW, hW.members[0], null, quiet);
    ok(meW.heirApparent847 && R.mainTitle(meW).includes('Thân vương nữ xứ Asturias') && lW.partner.royalConsortTitle847.includes('Vương thân Tây Ban Nha') && !lW.partner.royalConsortTitle847.startsWith('Vương phi'), 'Spanish female heir title and husband never holds Asturias');
  }
}

// 18. Thi thử Cấp 2 vào Cấp 3 (Lớp 10) & Thi thử Đại học — Ước lượng điểm chuẩn và cải thiện điểm thi thật (8.10.53)
{
  const M853 = E.MOCK_EXAM853;
  ok(M853 && typeof M853.estimateHighSchool853 === 'function' && typeof M853.estimateUniExam853 === 'function', 'MOCK_EXAM853 API exposed');

  // 18a. Thi thử Cấp 2 vào Cấp 3 (Lớp 10): ước lượng không làm bẩn save, thi thử nâng điểm thi thật vượt mốc Chuyên Amsterdam (38/50)
  const hsLife = E.createLife({ mode: 'vn', seed: 85301 });
  Object.assign(hsLife, { age: 14, edu: 1, school: 'lower', pending: [], sched: [] });
  hsLife.st.kno = 96;
  const snapBeforeHs = JSON.stringify(hsLife);
  const estHs0 = M853.estimateHighSchool853(hsLife);
  ok(JSON.stringify(hsLife) === snapBeforeHs, 'estimateHighSchool853 is pure and never mutates save');
  ok(estHs0.knoBase === 33.6 && estHs0.min50 === 33.6 && estHs0.max50 === 48.6 && estHs0.schools.length === 7, 'Grade 10 estimate shows 33.6-48.6/50 and 7 schools');
  const ams0 = estHs0.schools.find(s => s.name.includes('Amsterdam'));
  ok(ams0 && ams0.cut === 38 && ams0.prob < 80, 'Even with kno=96, Amsterdam (38/50) has <80% pass chance without mock practice');

  pick(hsLife, 'mockHighSchool853', 'hs_mock_standard');
  pick(hsLife, 'mockHighSchool853', 'hs_mock_specialized');
  hsLife.age = 15; hsLife.edu = 2;
  pick(hsLife, 'mockHighSchool853', 'hs_mock_review');
  const estHs1 = M853.estimateHighSchool853(hsLife);
  ok(estHs1.hsCount === 2 && estHs1.hsBonus >= 4.0 && estHs1.hsFloorBonus >= 3.0 && estHs1.hsSpecialBonus >= 5.0, 'Grade 10 mock exams accumulate bonus, floor & special bonus');
  ok(estHs1.last && estHs1.last.total50 > 0 && estHs1.min50 >= 38, 'Minimum Grade 10 score reaches >=38/50 after mock training');

  const hsDec = E.DEC.highSchool125.make(hsLife, () => 0);
  ok(hsDec.text.includes('Ước lượng điểm thi lớp 10') && hsDec.opts[0].h.includes('Ước lượng đỗ'), 'highSchool125 displays score estimate and pass probability');
  E.DEC.highSchool125.apply(hsLife, hsDec, '0', () => 0, quiet);
  ok(hsLife.school === 'upper' && E.WORLD120.p(hsLife).highExam.score >= 38, 'Mock exam bonus enables passing Amsterdam (38/50) even on worst RNG day (r=0)');

  // 18b. Thi thử Đại học: chẩn đoán tâm lý phòng thi (examApt âm) và nâng điểm thi thật vượt mốc trường Top
  const uniLife = E.createLife({ mode: 'vn', seed: 85302 });
  Object.assign(uniLife, { age: 16, edu: 2, school: 'upper', schoolEnd: 18, khoi: 'A00', pending: [], sched: [] });
  uniLife.st.kno = 95;
  uniLife.flags.examApt = -1.5;
  const snapBeforeUni = JSON.stringify(uniLife);
  const estUni0 = M853.estimateUniExam853(uniLife);
  ok(JSON.stringify(uniLife) === snapBeforeUni, 'estimateUniExam853 is pure and never mutates save');
  ok(estUni0.expected30 <= 20.5 && estUni0.aptShort.includes('cuống'), 'Diagnoses why kno=95 with examApt=-1.5 only scores ~20/30 without mock practice');

  pick(uniLife, 'mockUniExam853', 'uni_mock_standard');
  pick(uniLife, 'mockUniExam853', 'uni_mock_intensive');
  uniLife.age = 17;
  pick(uniLife, 'mockUniExam853', 'uni_mock_intensive');
  pick(uniLife, 'mockUniExam853', 'uni_mock_aptitude');
  const estUni1 = M853.estimateUniExam853(uniLife);
  ok(estUni1.uniCount === 4 && estUni1.uniBonus === 3.5 && estUni1.aptRecovery === 2.5 && estUni1.expected30 >= 25.5, 'University mock training recovers examApt penalty and boosts expected score to >=25.5/30');
  const finalScore = E.rollExamScore(uniLife, () => 0.5);
  ok(finalScore >= 25.25 && uniLife.flags.exam127 && uniLife.flags.exam127.scores.length === 3, 'rollExamScore includes mock exam bonus and updates EXAM127 subject breakdown');

  // Hiển thị ước lượng trên khoi912, luyen_thi và study_wishes54
  uniLife.examScore = null;
  const khoiDec = E.DEC.khoi912.make(uniLife, () => 0.5);
  const ltDec = E.DEC.luyen_thi.make(uniLife, () => 0.5);
  ok(khoiDec.text.includes('Ước lượng điểm thi Đại học') && ltDec.text.includes('Ước lượng điểm thi hiện tại'), 'khoi912 and luyen_thi display live university score estimate');
  uniLife.age = 18; uniLife.edu = 3; uniLife.school = null; uniLife.examScore = finalScore;
  E.EDUCATION54.open(uniLife, () => 0.5);
  const wishDec = E.DEC.study_wishes54.make(uniLife, () => 0.5);
  ok(wishDec.text.includes('Điểm thi THPT hiện có'), 'study_wishes54 displays current examScore');
}

console.log('royal847: ' + count + ' checks passed');
