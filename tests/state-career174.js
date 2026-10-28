'use strict';
const assert = require('assert');
const { gameContext } = require('./hardcore-isolation');
const G = gameContext();
const E = G.E, U = G.U, S174 = E.STATE174, P116 = E.PUBLIC116, C118 = E.CIVIC118;

let passed = 0;
function ok(cond, msg) {
  assert(cond, msg);
  passed++;
}

function makeLife(jobId = 'cong_chuc', rank = 0, age = 32) {
  const l = E.createLife({ mode: 'vn', seed: 1742026 });
  Object.assign(l, {
    age,
    indep: true,
    edu: 5,
    major: 'eco',
    school: null,
    abroad: null,
    retired: false,
    pending: [],
    sched: [],
    money: l.base * 50,
    record: 0
  });
  l.st.kno = 88;
  l.st.soc = 80;
  l.st.hea = 85;
  l.flags.military = 0;
  E.startJob(l, jobId, () => 0.5, () => {}, true);
  l.job.rank = rank;
  l.job.rankTracked = rank;
  l.job.rankSince = age - 5;
  l.job.yrs = 8;
  l.job.sen = 8;
  l.job.rep = 78;
  S174.syncState(l);
  return l;
}

function pickMenu(l, menuId, optKey, r = () => 0.2) {
  const d = E.DEC[menuId].make(l, r);
  const idx = d.data && d.data.keys ? d.data.keys.indexOf(optKey) : -1;
  assert(idx >= 0, `${menuId} missing option key ${optKey} (available: ${d.data && d.data.keys})`);
  E.DEC[menuId].apply(l, d, String(idx), r, () => {});
  return d;
}

// ============================================================================
// TEST A — NGÂN HÀNG NHÀ NƯỚC VIỆT NAM (KHÔNG BIẾN THÀNH GIÁM ĐỐC SỞ)
// ============================================================================
{
  ok(E.CAR.ngan_hang_nn && E.CAR.ngan_hang_nn.cat === 'state', 'Test A1: ngan_hang_nn career exists in E.CAR with cat=state');
  const sbvTitles = E.CAR.ngan_hang_nn.t;
  ok(!sbvTitles.some(t => /giám đốc sở/i.test(t)), 'Test A2: ngan_hang_nn has no "giám đốc sở" title');
  ok(sbvTitles.includes('chuyên viên Ngân hàng Nhà nước') && sbvTitles.includes('vụ trưởng Ngân hàng Nhà nước') && sbvTitles.includes('phó thống đốc Ngân hàng Nhà nước') && sbvTitles.includes('thống đốc Ngân hàng Nhà nước'),
    'Test A3: ngan_hang_nn has authentic SBV hierarchy up to Thống đốc NHNN');

  // Ứng tuyển qua stateEmployer123 vào Ngân hàng Nhà nước Việt Nam
  const l = makeLife('van_phong', 0, 28);
  pickMenu(l, 'stateEmployer123', 'Ngân hàng Nhà nước Việt Nam', () => 0.1);
  ok(E.resolveJob(l.job.id) === 'ngan_hang_nn', 'Test A4: stateEmployer123 assigns ngan_hang_nn instead of cong_chuc');
  ok(/Ngân hàng Nhà nước/i.test(E.jobTitle(l)), 'Test A5: jobTitle at SBV reflects SBV specialist');

  // Kiểm tra migrate bản lưu cũ từng bị gán cong_chuc tại Ngân hàng Nhà nước Việt Nam
  const legacy = makeLife('cong_chuc', 4, 42);
  legacy.job.employer123 = { name: 'Ngân hàng Nhà nước Việt Nam', factor: 1.05 };
  E.migrateExt(legacy);
  ok(E.resolveJob(legacy.job.id) === 'ngan_hang_nn' && legacy.job.rank === 5, 'Test A6: legacy save with cong_chuc at SBV auto-migrates to ngan_hang_nn Vụ trưởng');
  ok(!/giám đốc sở/i.test(E.jobTitle(legacy)), 'Test A7: migrated SBV save never displays Giám đốc sở');

  // Kiểm tra lộ trình phát triển từ Vụ trưởng NHNN -> Phó Thống đốc -> Thống đốc -> Phó Thủ tướng / Bí thư Tỉnh ủy
  const s = S174.syncState(legacy);
  S174.grantPartyMember(legacy);
  s.theory = 3;
  s.planned = true;
  s.kpi.expertise = 88; s.kpi.management = 85; s.kpi.coordination = 84; s.kpi.integrity = 90; s.kpi.credibility = 85;
  S174.syncState(legacy);
  const pathsFromVuTruong = S174.availablePathways(legacy);
  ok(pathsFromVuTruong.some(p => p.pos.title === 'phó thống đốc Ngân hàng Nhà nước' && p.check.ok), 'Test A8: Vụ trưởng NHNN can advance to Phó Thống đốc NHNN');
  ok(pathsFromVuTruong.some(p => p.pos.title === 'thứ trưởng' || p.pos.title === 'phó chủ tịch UBND tỉnh'), 'Test A9: Vụ trưởng NHNN has cross-branch transfer paths to Thứ trưởng or Phó Chủ tịch UBND tỉnh');

  S174.applyPosition(legacy, 'ngan_hang_nn', 7, 'bổ nhiệm', () => {});
  ok(E.jobTitle(legacy) === 'thống đốc Ngân hàng Nhà nước', 'Test A10: reaches Thống đốc Ngân hàng Nhà nước');
  const pathsFromGovernor = S174.availablePathways(legacy);
  ok(pathsFromGovernor.some(p => p.pos.title === 'phó thủ tướng Chính phủ' || p.pos.title === 'bí thư Tỉnh ủy' || p.pos.title === 'Bí thư Trung ương Đảng'),
    'Test A11: Thống đốc NHNN is not dead-ended and can advance to Phó Thủ tướng / Bí thư Tỉnh ủy / Bí thư TW Đảng');
}

// ============================================================================
// TEST B — GIÁM ĐỐC SỞ → CHỦ TỊCH UBND XÃ (KHÔNG BỊ TỤT XUỐNG PHÓ GIÁM ĐỐC SỞ)
// ============================================================================
{
  // Kịch bản 1: Giám đốc sở ở nghề cong_chuc (rank 4, Level 6)
  const dir = makeLife('cong_chuc', 4, 40);
  S174.grantPartyMember(dir);
  const s = S174.syncState(dir);
  s.theory = 3;
  s.planned = true;
  s.kpi.expertise = 84; s.kpi.management = 82; s.kpi.coordination = 80; s.kpi.integrity = 88; s.kpi.credibility = 82;
  S174.syncState(dir);

  ok(E.jobTitle(dir) === 'giám đốc sở' && S174.levelOf(dir) === 6, 'Test B1: Giám đốc sở (cong_chuc rank 4) has Level 6');
  const targets116 = P116.targets(dir);
  ok(targets116.includes(7) && targets116.includes(8) && !targets116.includes(5),
    'Test B2: PUBLIC116.targets for Giám đốc sở offers Phó CT / CT UBND tỉnh (7, 8) and never offers Phó giám đốc sở (5)');

  // Luân chuyển Giám đốc sở về làm Chủ tịch UBND xã (hanh_chinh_cong rank 4)
  let paths = S174.availablePathways(dir);
  const rotIdx = paths.findIndex(p => p.mode === 'rotation' && p.pos.jobId === 'hanh_chinh_cong' && p.pos.rank === 4);
  ok(rotIdx >= 0 && paths[rotIdx].check.ok, 'Test B3: Giám đốc sở has valid grassroots rotation option to Chủ tịch UBND xã');
  pickMenu(dir, 'stateTransfer174', 'path_' + rotIdx);

  ok(E.resolveJob(dir.job.id) === 'hanh_chinh_cong' && dir.job.rank === 4 && E.jobTitle(dir) === 'chủ tịch UBND xã',
    'Test B4: Giám đốc sở rotated to Chủ tịch UBND xã');
  ok(s.rotation && s.rotation.active && s.rotation.fromLevel === 6 && s.peakLevel === 6,
    'Test B5: rotation state preserves original Level 6 (Giám đốc sở)');

  // Kiểm tra E.canAdvance(dir, E.CAR.hanh_chinh_cong, true) không bao giờ tự thăng tuyến tính lên rank 5 (Phó giám đốc sở)
  ok(E.canAdvance(dir, E.CAR.hanh_chinh_cong, true) === false,
    'Test B6: year-end linear promotion from Chủ tịch UBND xã (rank 4) to Phó giám đốc sở (rank 5) is blocked for rotated Giám đốc sở');

  // Kiểm tra danh sách lộ trình khi đang làm Chủ tịch UBND xã luân chuyển: tuyệt đối không có Phó giám đốc sở
  dir.age += 2;
  S174.syncState(dir);
  paths = S174.availablePathways(dir);
  ok(!paths.some(p => p.pos.title === 'phó giám đốc sở'),
    'Test B7: availablePathways for rotated Giám đốc sở at Chủ tịch UBND xã never contains Phó giám đốc sở');
  ok(paths.some(p => p.mode === 'post_rotation' && p.pos.title === 'phó chủ tịch UBND tỉnh' && p.check.ok),
    'Test B8: after 2 years of grassroots rotation, cadre qualifies for post-rotation appointment to Phó Chủ tịch UBND tỉnh');

  // Kiểm tra cả trường hợp người chơi bấm xét thăng chức qua publicReview116: phải nhảy thẳng lên Phó Chủ tịch UBND tỉnh (rank 7), không phải rank 5!
  const dirVia116 = JSON.parse(JSON.stringify(dir));
  Object.assign(P116.record(dirVia116), { projects: 5, points: 10, failures: 2 });
  const rev = E.DEC.publicReview116.make(dirVia116);
  E.DEC.publicReview116.apply(dirVia116, rev, 'apply', () => 0.1, () => {});
  ok(dirVia116.job.rank === 7 && E.jobTitle(dirVia116) === 'phó chủ tịch UBND tỉnh',
    'Test B9: publicReview116 promotes rotated Giám đốc sở at Chủ tịch UBND xã directly to Phó Chủ tịch UBND tỉnh (rank 7), skipping Phó giám đốc sở (rank 5)');

  // Thực hiện bổ nhiệm sau luân chuyển qua stateTransfer174
  const postRotIdx = paths.findIndex(p => p.mode === 'post_rotation' && p.pos.title === 'phó chủ tịch UBND tỉnh');
  pickMenu(dir, 'stateTransfer174', 'path_' + postRotIdx);
  ok(dir.job.rank === 7 && E.jobTitle(dir) === 'phó chủ tịch UBND tỉnh' && !s.rotation.active,
    'Test B10: stateTransfer174 promotes rotated Giám đốc sở to Phó Chủ tịch UBND tỉnh and completes rotation');
}

// ============================================================================
// TEST C — TIẾP CẬN TỈNH ỦY (TỪ CHÍNH QUYỀN CƠ SỞ, SỞ/NGÀNH VÀ CƠ QUAN ĐẢNG)
// ============================================================================
{
  // Con đường 1: Từ Giám đốc sở -> Tỉnh ủy viên -> Ủy viên BTV Tỉnh ủy -> Phó Bí thư Tỉnh ủy -> Bí thư Tỉnh ủy
  const l = makeLife('cong_chuc', 4, 42);
  const s = S174.syncState(l);
  s.kpi.expertise = 86; s.kpi.management = 85; s.kpi.coordination = 82; s.kpi.integrity = 90; s.kpi.credibility = 86;
  S174.syncState(l);

  // Kết nạp Đảng qua stateParty174
  pickMenu(l, 'stateParty174', 'join_party');
  ok(S174.partyMember(l), 'Test C1: player can join the Party via stateParty174');

  // Học Sơ cấp -> Trung cấp -> Cao cấp lý luận chính trị
  pickMenu(l, 'stateParty174', 'study_theory');
  l.age++;
  pickMenu(l, 'stateParty174', 'study_theory');
  l.age++;
  pickMenu(l, 'stateParty174', 'study_theory');
  ok(s.theory === 3 && l.flags.civic118 && l.flags.civic118.training === 3,
    'Test C2: political theory study reaches Cao cấp (level 3) and syncs with civic118.training');

  // Đăng ký quy hoạch cán bộ
  pickMenu(l, 'stateParty174', 'register_planning');
  ok(s.planned === true, 'Test C3: player enters leadership planning (quy hoạch)');

  // Ứng cử Tỉnh ủy viên (role 1) và Ủy viên BTV Tỉnh ủy (role 2)
  pickMenu(l, 'stateParty174', 'party_role_1');
  ok(s.provincialParty === 1 && l.flags.civic118.role === 'Tỉnh ủy viên', 'Test C4: Giám đốc sở elected Tỉnh ủy viên');

  pickMenu(l, 'stateParty174', 'party_role_2');
  ok(s.provincialParty === 2 && l.flags.civic118.role === 'Ủy viên Ban Thường vụ Tỉnh ủy', 'Test C5: advances to Ủy viên Ban Thường vụ Tỉnh ủy');

  // Ứng cử Phó Bí thư Tỉnh ủy (role 3) -> chuyển sang ngạch Thường trực Tỉnh ủy (dang_uy rank 5)
  pickMenu(l, 'stateParty174', 'party_role_3');
  ok(s.provincialParty === 3 && E.resolveJob(l.job.id) === 'dang_uy' && l.job.rank === 5 && E.jobTitle(l) === 'phó bí thư Tỉnh ủy',
    'Test C6: advances to Phó Bí thư Tỉnh ủy');

  // Ứng cử Bí thư Tỉnh ủy (role 4) -> dang_uy rank 6
  pickMenu(l, 'stateParty174', 'party_role_4');
  ok(s.provincialParty === 4 && E.resolveJob(l.job.id) === 'dang_uy' && l.job.rank === 6 && E.jobTitle(l) === 'bí thư Tỉnh ủy',
    'Test C7: advances to Bí thư Tỉnh ủy');

  // Ứng cử Ủy viên BCH Trung ương Đảng (role 5)
  pickMenu(l, 'stateParty174', 'party_role_5');
  ok(s.provincialParty === 5 && l.flags.civic118.role === 'Ủy viên Ban Chấp hành Trung ương Đảng',
    'Test C8: Bí thư Tỉnh ủy elected Ủy viên Ban Chấp hành Trung ương Đảng');

  // Con đường 2: Từ cơ quan chuyên trách cấp ủy (dang_uy) đi lên Trưởng ban Tỉnh ủy -> Phó Bí thư Tỉnh ủy
  const partyCadre = makeLife('dang_uy', 4, 41);
  ok(E.jobTitle(partyCadre) === 'trưởng ban Tỉnh ủy / chủ nhiệm UBKT Tỉnh ủy' && S174.state(partyCadre).provincialParty >= 2,
    'Test C9: Trưởng ban Tỉnh ủy / Chủ nhiệm UBKT Tỉnh ủy is recognized in Ban Thường vụ Tỉnh ủy');
}

// ============================================================================
// TEST D — CÁC NHÁNH NHÀ NƯỚC KHÁC (XÃ/PHƯỜNG, SỞ/NGÀNH, THUẾ/HẢI QUAN, THANH TRA, TƯ PHÁP, TRUNG ƯƠNG)
// ============================================================================
{
  // 1. Cấp xã/phường (can_bo_xa) không còn kịch trần ở rank 2 (Chủ tịch UBND xã/phường)
  const commune = makeLife('can_bo_xa', 2, 35);
  S174.grantPartyMember(commune);
  const sc = S174.syncState(commune);
  sc.theory = 2; sc.planned = true; sc.kpi.overall = 72;
  const communePaths = S174.availablePathways(commune);
  ok(communePaths.length >= 3 && communePaths.some(p => p.pos.jobId === 'cong_chuc' || p.pos.jobId === 'hanh_chinh_cong' || p.pos.jobId === 'dang_uy'),
    'Test D1: Chủ tịch UBND xã/phường (can_bo_xa rank 2) has upward/transfer pathways to district/provincial offices');

  // 2. Ngành Thuế / Hải quan / Kiểm toán / Thanh tra / Tòa án / Kiểm sát khi đạt đỉnh ngạch đều có lộ trình liên thông
  for (const [jobId, maxRank] of [['thue', 4], ['hai_quan', 4], ['kiem_toan', 4], ['thanh_tra', 6], ['tham_phan', 4], ['kiem_sat', 4], ['trung_uong', 5]]) {
    const cad = makeLife(jobId, maxRank, 46);
    S174.grantPartyMember(cad);
    const st = S174.syncState(cad);
    st.theory = 3; st.planned = true;
    const pList = S174.availablePathways(cad);
    ok(pList.length > 0, `Test D2 (${jobId}): top rank ${maxRank} has cross-agency progression pathways`);
  }

  // 3. Thi nâng ngạch chuyên gia (Chuyên viên chính -> Chuyên viên cao cấp) và tăng phụ cấp lương
  const spec = makeLife('cong_chuc', 2, 34);
  const incBefore = E.careerYear(spec, () => 0.5, () => {}, 'work');
  pickMenu(spec, 'stateTransfer174', 'senior_grade');
  ok(S174.state(spec).seniorGrade === 1, 'Test D3: specialist upgrades to Chuyên viên chính');
  const incAfter = E.careerYear(spec, () => 0.5, () => {}, 'work');
  ok(incAfter > incBefore * 1.05, 'Test D4: senior specialist grade increases state salary');

  // 4. Thực thi nhiệm vụ công vụ (stateWork174) và Đề án cải cách 2 năm
  const worker = makeLife('ngan_hang_nn', 3, 33);
  const kpi0 = S174.state(worker).kpi.overall;
  pickMenu(worker, 'stateWork174', 'dieu_hanh_td');
  ok(S174.state(worker).kpi.overall >= kpi0, 'Test D5: branch task dieu_hanh_td improves KPI');
  worker.age++;
  pickMenu(worker, 'stateWork174', 'multi_project');
  ok(S174.state(worker).project && !S174.state(worker).project.done, 'Test D6: multi-year reform project started');
  worker.age++;
  pickMenu(worker, 'stateWork174', 'multi_project');
  ok(S174.state(worker).project.done && S174.state(worker).planned === true, 'Test D7: completing multi-year project grants leadership planning status');
}

// ============================================================================
// TEST E — TƯƠNG THÍCH BẢN LƯU, HIỂN THỊ PROFILE & KHÔNG HỎNG NGHỀ NGOÀI NHÀ NƯỚC
// ============================================================================
{
  const stateLife = makeLife('ngan_hang_nn', 4, 39);
  const prof = E.profile(stateLife);
  ok(prof.jobInfo.some(line => /KPI công vụ/i.test(line)) && prof.jobInfo.some(line => /Lộ trình tiếp theo/i.test(line)),
    'Test E1: E.profile displays state KPI, agency level, and next career pathways');

  const privLife = makeLife('dev', 1, 29);
  ok(S174.isVNState(privLife) === false, 'Test E2: private-sector IT job is not treated as state career');
  const privInc = E.careerYear(privLife, () => 0.5, () => {}, 'work');
  ok(Number.isFinite(privInc) && privInc > 0, 'Test E3: private-sector careerYear works normally');

  // Kiểm tra E.isStableService cho toàn bộ ngạch mới
  for (const jid of ['ngan_hang_nn', 'trung_uong', 'thanh_tra', 'dang_uy']) {
    const x = makeLife(jid, 0, 26);
    ok(E.isStableService(x) === true, `Test E4 (${jid}): E.isStableService is true`);
  }
}

console.log('State career overhaul (STATE174): ' + passed + ' checks passed.');
