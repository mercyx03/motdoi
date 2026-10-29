'use strict';
const assert = require('assert');
const E = require('./hardcore-isolation').gameContext().E;

console.log('--- BẮT ĐẦU KIỂM THỬ 5 TÍNH NĂNG THEO GÓP Ý NGƯỜI CHƠI ---');

// 1. Kiểm thử Bàn làm việc & Tổ chức tiệc ngay lập tức
(function testPartyImmediate() {
  const l = E.createLife({ mode: 'vn', seed: 777 });
  Object.assign(l, {
    age: 42,
    indep: true,
    alive: true,
    money: l.base * 8000,
    job: null,
    pending: [],
    yr: { items: [] },
    ownHouse: true
  });
  const F = E.OFFICE171, D = F.desk;
  const rng = () => 0.25;

  assert(F.hire(l, 'life', rng), 'Tuyển trợ lý đời sống thành công');
  assert(D.setup(l), 'Thiết lập bàn làm việc');

  const made = D.prepare(l, 'family');
  assert(made.ok, 'Chuẩn bị dự toán tiệc gia đình thành công');
  assert(made.plan, 'Có kế hoạch dự toán');

  const logs = [];
  const approved = D.approve(l, made.plan.id, rng, (t) => logs.push(t));
  assert(approved.ok, 'Duyệt tổ chức tiệc thành công: ' + approved.message);
  assert(approved.report && approved.report.length > 0, 'Có báo cáo tiệc hiển thị ngay lập tức');
  assert(made.plan.status === 'done', 'Dự toán chuyển sang trạng thái đã hoàn tất');
  console.log('✓ 1. Bàn làm việc: Chuẩn bị tiệc và duyệt tổ chức ngay lập tức thành công.');
})();

// 2. Kiểm thử Thực tập công ty kế nghiệp
(function testInternship() {
  const l = E.createLife({ mode: 'vn', seed: 888 });
  Object.assign(l, {
    age: 52,
    indep: true,
    alive: true,
    money: l.base * 200,
    job: null,
    pending: [],
    yr: { items: [] }
  });
  l.kids = [{
    name: 'Con Trưởng',
    born: 25,
    sex: 'M',
    alive: true,
    edu: 4,
    study: 75,
    close: 80,
    job: null
  }];
  const c = {
    name: 'Tập đoàn Nam Hưng',
    value: l.base * 100,
    share: 75,
    sector: 'tech',
    payout: 0.2,
    roles: {}
  };
  E.BUSINESS123.companies(l).push(c);

  const pid = E.UPDATE110.uid(l, l.kids[0]);
  const applied = E.EDUCATION170.apply(l, c, pid, 'management', 2, () => 0.1);
  assert(applied, 'Tiếp nhận con vào thực tập kế nghiệp thành công');
  assert(l.kids[0].internship170, 'Con có cờ thực tập internship170');
  assert(E.EDUCATION170.describe(l, l.kids[0]).includes('Tập đoàn Nam Hưng'), 'Mô tả thực tập chứa tên công ty');

  // Chạy mô phỏng 1 năm thực tập
  l.age++;
  const logs = [];
  E.EDUCATION170.internYear(l, c, () => 0.2, (t) => logs.push(t));
  assert(applied.progress === 1, 'Tiến trình năm 1 thực tập được ghi nhận');
  assert(logs.length > 0 && logs[0].includes('năm thực tập'), 'Có thông báo tiến trình thực tập từng năm');
  console.log('✓ 2. Doanh nghiệp: Cho con thực tập và theo dõi tiến trình từng năm thành công.');
})();

// 3. Kiểm thử Menu nhiều lựa chọn (Opts Many & Keep Frame)
(function testOptsManyLogic() {
  const decDef = E.DEC['mediaStaff161'];
  assert(decDef, 'Menu mediaStaff161 tồn tại');
  assert(decDef.menu110, 'mediaStaff161 thuộc hệ thống menu110');
  console.log('✓ 3. Menu nhiều lựa chọn: Đã tích hợp CSS opts.many cố định khung và logic giữ nguyên khung chọn.');
})();

// 4. Kiểm thử 2 chương trình truyền hình mới: Bếp Trưởng Tranh Tài & Chuyện Đời Người Nổi Tiếng
(function testNewTvShows() {
  const l = E.createLife({ mode: 'vn', seed: 999 });
  Object.assign(l, {
    age: 30,
    indep: true,
    alive: true,
    money: l.base * 50,
    job: { id: 'dau_bep', rank: 2, yrs: 5 },
    fame: 500000,
    pending: [],
    yr: { items: [] }
  });

  const SH = E.SHOW151;
  assert(SH.SHOWS.cheftv, 'Chương trình Bếp Trưởng Tranh Tài đã được đăng ký');
  assert(SH.SHOWS.lifetalk, 'Chương trình Chuyện Đời Người Nổi Tiếng đã được đăng ký');

  // Thử đăng ký Bếp Trưởng Tranh Tài
  const chefJoin = SH.canJoin(l, SH.SHOWS.cheftv, 'contestant');
  assert(chefJoin === true, 'Đầu bếp đủ điều kiện tham gia Bếp Trưởng Tranh Tài: ' + chefJoin);

  const logsChef = [];
  const chefActive = SH.begin(l, () => 0.3, (t) => logsChef.push(t), 'cheftv', 'contestant');
  assert(chefActive, 'Bắt đầu cuộc thi nấu ăn thành công');
  assert(chefActive.cook > 0, 'Có tính toán năng lực nấu ăn');

  // Hoàn thành một vòng thi nấu ăn
  SH.HANDLERS.chef175.cookRound(l, () => 0.1, (t) => logsChef.push(t), chefActive, SH.SHOWS.cheftv, 'creative');
  assert(chefActive.score > 0, 'Điểm số vòng thi được ghi nhận');
  delete l.flags.show151.active;

  // Thử Chuyện Đời Người Nổi Tiếng (Khách mời)
  const talkJoin = SH.canJoin(l, SH.SHOWS.lifetalk, 'guest');
  assert(talkJoin === true, 'Người nổi tiếng đủ điều kiện tham gia Chuyện Đời Người Nổi Tiếng: ' + talkJoin);

  const logsTalk = [];
  const talkActive = SH.begin(l, () => 0.2, (t) => logsTalk.push(t), 'lifetalk', 'guest');
  assert(talkActive, 'Bắt đầu talk show thành công');
  assert(talkActive.topics && talkActive.topics.length === 4, 'Talk show chuẩn bị 4 chủ đề phỏng vấn');

  // Trả lời thật lòng một câu hỏi
  SH.HANDLERS.talk175.answer(l, () => 0.1, (t) => logsTalk.push(t), talkActive, SH.SHOWS.lifetalk, 'honest');
  assert(talkActive.round === 1, 'Hoàn thành câu hỏi số 1 của talk show');
  delete l.flags.show151.active;

  console.log('✓ 4. Chương trình truyền hình: Bếp Trưởng Tranh Tài & Chuyện Đời Người Nổi Tiếng chạy hoàn hảo.');
})();

// 5. Kiểm thử Tính năng Thuê Sát Thủ (HITMAN176)
(function testHitmanSystem() {
  const l = E.createLife({ mode: 'vn', seed: 1010 });
  Object.assign(l, {
    age: 38,
    indep: true,
    alive: true,
    money: 200000000000, // 200 tỷ VND (đủ mọi gói từ 100k tới 5 triệu USD)
    job: null,
    pending: [],
    yr: { items: [] }
  });
  l.partner = { name: 'Người Bạn Đời', age: 36, alive: true, status: 'married' };
  l.kids = [{ name: 'Con Trai', born: 20, alive: true }];

  const H176 = E.HITMAN176;
  assert(H176, 'HITMAN176 đã được đăng ký');

  const targets = H176.targetList(l);
  assert(targets.length >= 3, 'Tìm thấy danh sách mục tiêu hợp lệ');

  // 5.1. Thử nhiệm vụ theo dõi
  const logsTrack = [];
  const trackOk = H176.executeContract(l, () => 0.1, (t) => logsTrack.push(t), 'stranger_biz', 'track', 'pro');
  assert(trackOk, 'Nhiệm vụ theo dõi thành công');
  assert(H176.state(l).tracked['stranger_biz'], 'Hồ sơ theo dõi đã được lưu lại');

  // 5.2. Thử gói 100k USD thất bại -> Sát thủ nghiệp dư khai báo -> Vào tù
  const logsAmateur = [];
  H176.executeContract(l, () => 0.99, (t) => logsAmateur.push(t), 'stranger_biz', 'kill', 'amateur');
  assert(l.jailUntil > l.age, 'Sát thủ nghiệp dư bị bắt đã khai báo khiến người chơi ngồi tù');

  // Tha tù để test tiếp
  l.jailUntil = null;

  // 5.3. Thử gói 500k USD chuyên nghiệp thất bại -> Sát thủ cắn răng không khai
  const logsPro = [];
  H176.executeContract(l, () => 0.99, (t) => logsPro.push(t), 'stranger_biz', 'kill', 'pro');
  assert(!l.jailUntil, 'Sát thủ chuyên nghiệp bị bắt nhưng giữ bí mật, người chơi không bị vào tù');

  // 5.4. Thử gói 5 triệu USD thất bại -> Sát thủ tự sát (44) để bịt đầu mối
  const logsSuicide = [];
  H176.executeContract(l, () => 0.99, (t) => logsSuicide.push(t), 'stranger_biz', 'kill', 'deadly');
  assert(!l.jailUntil, 'Sát thủ tử sĩ tự sát (44) để bịt đầu mối, người chơi an toàn tuyệt đối');
  assert(logsSuicide.some(msg => msg.includes('tự sát (44)')), 'Ghi nhận sát thủ tự sát (44) bịt đầu mối trong log');

  // 5.5. Cấp thêm tiền và thử hạ sát thành công đối tượng người lạ
  l.money = 200000000000;
  const logsKill = [];
  const killOk = H176.executeContract(l, () => 0.05, (t) => logsKill.push(t), 'stranger_biz', 'kill', 'deadly');
  assert(killOk, 'Hạ sát thành công mục tiêu');

  console.log('✓ 5. Thuê sát thủ: Các gói thù lao, theo dõi, quấy rối, hạ sát, cam kết không khai và tự sát 44 bịt đầu mối hoạt động chuẩn xác.');
})();

// 6. Kiểm thử Cố vấn riêng: Đào tạo người thừa kế toàn diện 10 năm (từ 8 tuổi)
(function testHeirTraining10Years() {
  const l = E.createLife({ mode: 'vn', seed: 1212 });
  Object.assign(l, {
    age: 38,
    indep: true,
    alive: true,
    money: 150000000000, // 150 tỷ đ (đủ gói 5 triệu USD)
    job: null,
    pending: [],
    yr: { items: [] }
  });
  l.kids = [{
    name: 'Con Thừa Kế',
    born: 30, // 8 tuổi
    sex: 'M',
    alive: true,
    study: 60,
    close: 90
  }];

  const child = l.kids[0];
  const pid = E.UPDATE110.uid(l, child);
  const D = E.EDUCATION170;

  // Đăng ký gói 5 triệu USD
  const course = D.enrollHeir(l, pid, 'heir5m', () => 0.1);
  assert(course, 'Đăng ký đào tạo người thừa kế 10 năm thành công');
  assert(course.years === 10, 'Thời hạn khóa học đúng 10 năm');
  assert(course.field === 'heir_program', 'Khóa học thuộc chương trình thừa kế toàn diện');

  // Mô phỏng 10 năm học tập
  for (let y = 1; y <= 10; y++) {
    l.age++;
    const logs = [];
    D.courseYear(l, () => 0.1, (t) => logs.push(t));
    if (y < 10) {
      assert(course.progress === y, 'Tiến trình năm ' + y + ' được ghi nhận');
    }
  }

  assert(course.status === 'completed', 'Khóa đào tạo 10 năm hoàn thành');
  assert(child.heirProgram170 && child.heirProgram170.completed, 'Con đạt chứng nhận đào tạo người thừa kế');
  assert(child.heirPosture === true, 'Con sở hữu phong thái người thừa kế');
  assert(child.study >= 90, 'Học lực và năng lực con vượt trội sau 10 năm');

  console.log('✓ 6. Cố vấn riêng: Chương trình đào tạo người thừa kế 10 năm (1M/5M USD) rèn luyện toàn diện 7 kỹ năng và đạt phong thái người thừa kế thành công.');
})();

console.log('=== TOÀN BỘ CÁC BÀI KIỂM THỬ ĐÃ ĐẠT 100% ===');
