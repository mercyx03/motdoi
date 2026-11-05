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

console.log('royal847: ' + count + ' checks passed');
