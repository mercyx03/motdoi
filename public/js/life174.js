/* Một Đời — Đại tu hệ thống sự nghiệp nhà nước Việt Nam (STATE174):
   · Mô hình hóa đầy đủ chức danh (Position Metadata): id, title, branch, agency, roleType, level (1..10), điều kiện chuẩn hóa và đồ thị chuyển ngạch
   · 4 cơ chế tách biệt: Thăng ngạch chuyên môn, Bổ nhiệm quản lý nội bộ, Điều động ngang/lên cấp trên, Luân chuyển cán bộ cơ sở
   · Khắc phục triệt để lỗi Ngân hàng Nhà nước thành Giám đốc sở và lỗi Giám đốc sở luân chuyển về Chủ tịch UBND xã bị tụt xuống Phó giám đốc sở
   · Mở rộng 4 nhánh lớn: Hành chính địa phương & Sở/ngành, Ngân hàng Nhà nước & Tài chính công, Chính quyền & Chính phủ Trung ương, Hệ thống Đảng & Tỉnh ủy
   · Hệ thống KPI 5 chỉ số, hoạt động công vụ theo nhánh, 7 sự kiện sự nghiệp nhiều năm và bảng Hồ sơ / Lộ trình công vụ minh bạch */
(function (G) {
  'use strict';
  var E = G.E, H = E.H, U = G.U, C = E.WORLD120, X = E.UPDATE110, P116 = E.PUBLIC116, C118 = E.CIVIC118;

  // ===================================================================
  // 1. KHỞI TẠO & CHUẨN HÓA CÁC NGẠCH NGHỀ NHÀ NƯỚC MỚI TRONG E.CAR
  // ===================================================================
  function ensureCareers() {
    var defs = [
      ['ngan_hang_nn', [
        'chuyên viên Ngân hàng Nhà nước',
        'chuyên viên chính Ngân hàng Nhà nước',
        'phó trưởng phòng Ngân hàng Nhà nước',
        'trưởng phòng Ngân hàng Nhà nước',
        'giám đốc Ngân hàng Nhà nước chi nhánh tỉnh',
        'vụ trưởng Ngân hàng Nhà nước',
        'phó thống đốc Ngân hàng Nhà nước',
        'thống đốc Ngân hàng Nhà nước'
      ], [11, 14, 18, 23, 30, 38, 50, 62], [3, 4, 4, 4, 5, 5, 5], { cat: 'state', sec: 'formal', edu: 5, majors: ['eco', 'law'], soft: true, vnOnly: true, promo: 0.16, loss: 0.002, sigma: 0.05, w: 0.7 }],
      ['trung_uong', [
        'chuyên viên cấp bộ',
        'chuyên viên chính cấp bộ',
        'phó vụ trưởng / phó cục trưởng',
        'vụ trưởng / cục trưởng',
        'thứ trưởng',
        'bộ trưởng',
        'phó thủ tướng Chính phủ',
        'Thủ tướng Chính phủ'
      ], [10, 13.5, 18, 25, 48, 62, 70, 78], [3, 4, 4, 5, 5, 5, 5], { cat: 'state', sec: 'formal', edu: 5, majors: ['law', 'eco', 'it', 'edu'], soft: true, vnOnly: true, promo: 0.15, loss: 0.002, sigma: 0.05, w: 0.6 }],
      ['thanh_tra', [
        'thanh tra viên',
        'thanh tra viên chính',
        'phó chánh thanh tra sở / tỉnh',
        'chánh thanh tra tỉnh',
        'cục trưởng Thanh tra Chính phủ',
        'phó tổng thanh tra Chính phủ',
        'Tổng Thanh tra Chính phủ'
      ], [9.5, 13, 17, 23, 32, 48, 62], [3, 4, 4, 5, 5, 5], { cat: 'state', sec: 'formal', edu: 5, majors: ['law', 'eco'], soft: true, vnOnly: true, promo: 0.16, loss: 0.002, sigma: 0.05, w: 0.6 }],
      ['dang_uy', [
        'chuyên viên cơ quan cấp ủy',
        'phó trưởng phòng ban Đảng',
        'trưởng phòng ban Đảng',
        'phó trưởng ban Tỉnh ủy / phó chủ nhiệm UBKT Tỉnh ủy',
        'trưởng ban Tỉnh ủy / chủ nhiệm UBKT Tỉnh ủy',
        'phó bí thư Tỉnh ủy',
        'bí thư Tỉnh ủy',
        'phó trưởng ban Đảng Trung ương / ủy viên UBKT Trung ương',
        'trưởng ban Đảng Trung ương / chủ nhiệm UBKT Trung ương'
      ], [10, 13, 16.5, 22, 29, 36, 44, 54, 66], [3, 4, 4, 4, 5, 5, 5, 5], { cat: 'state', sec: 'formal', edu: 5, majors: ['law', 'eco', 'edu'], soft: true, vnOnly: true, promo: 0.15, loss: 0.002, sigma: 0.05, w: 0.6 }]
    ];
    defs.forEach(function (x) {
      var o = x[4];
      E.CAR[x[0]] = {
        id: x[0], t: x[1], vn: x[2], yrs: x[3],
        cat: o.cat, sec: o.sec, edu: o.edu, majors: o.majors, soft: o.soft,
        vnOnly: o.vnOnly, promo: o.promo, loss: o.loss, sigma: o.sigma, w: o.w
      };
    });
    // Sửa thứ tự chức danh bị đảo ngược ở E.CAR.chinh_tri (bậc 1 từng là phó trưởng ban cấp tỉnh rồi bậc 2 tụt về bí thư đảng ủy xã)
    if (E.CAR.chinh_tri && Array.isArray(E.CAR.chinh_tri.t) && E.CAR.chinh_tri.t.length >= 10) {
      E.CAR.chinh_tri.t[1] = 'bí thư đảng ủy cơ sở';
      E.CAR.chinh_tri.t[2] = 'phó trưởng ban cấp tỉnh';
    }
    if (P116 && Array.isArray(P116.IDS)) {
      ['ngan_hang_nn', 'trung_uong', 'thanh_tra', 'dang_uy', 'can_bo_xa', 'qltt', 'kiem_lam', 'dnnn', 'dieu_tra_vien', 'chap_hanh_vien', 'tro_giup_phap_ly'].forEach(function (id) {
        if (!P116.IDS.includes(id)) P116.IDS.push(id);
      });
    }
  }
  ensureCareers();

  // ===================================================================
  // 2. MÔ HÌNH METADATA CHỨC DANH & CẤP TƯƠNG ĐƯƠNG (LEVEL 1..10)
  // ===================================================================
  var BRANCHES = {
    hanh_chinh_dia_phuong: 'Hành chính & chính quyền địa phương',
    so_nganh: 'Cơ quan chuyên môn cấp sở / ngành tỉnh',
    ngan_hang_nn: 'Ngân hàng Nhà nước Việt Nam',
    tai_chinh_thue_hq: 'Tài chính công · Thuế · Hải quan',
    thanh_tra_kiem_toan: 'Thanh tra · Kiểm toán Nhà nước',
    tu_phap: 'Tư pháp · Tòa án · Viện kiểm sát',
    trung_uong: 'Bộ, cơ quan ngang Bộ & Chính phủ',
    dang_doan_the: 'Hệ thống tổ chức Đảng & Tỉnh ủy',
    su_nghiep_cong: 'Đơn vị sự nghiệp công lập (Giáo dục · Y tế · Khoa học)',
    luc_luong_vu_trang: 'Lực lượng vũ trang (Quân đội · Công an)',
    dnnn_ngoai_giao: 'Ngoại giao & Doanh nghiệp nhà nước'
  };

  var THEORY_NAMES = ['Chưa qua đào tạo lý luận', 'Sơ cấp lý luận chính trị', 'Trung cấp lý luận chính trị', 'Cao cấp lý luận chính trị'];
  var SENIOR_GRADES = ['', 'Chuyên viên chính / Ngạch chính', 'Chuyên viên cao cấp / Chuyên gia cao cấp', 'Chuyên gia tư vấn chính sách cấp Nhà nước'];

  var STATE_JOBS = [
    'can_bo_xa', 'cong_chuc', 'vien_chuc', 'hanh_chinh_cong', 'chinh_tri', 'dang_uy',
    'ngan_hang_nn', 'trung_uong', 'thanh_tra', 'thue', 'hai_quan', 'kiem_toan',
    'tham_phan', 'kiem_sat', 'ngoai_giao', 'qltt', 'kiem_lam', 'dnnn',
    'dieu_tra_vien', 'chap_hanh_vien', 'tro_giup_phap_ly', 'cong_an', 'quan_doi',
    'giao_vien', 'giang_vien', 'bac_si', 'nghien_cuu'
  ];

  // Bảng quy chiếu cấp bậc tương đương (Level 1..10) cho từng nghề và bậc rank
  var LEVEL_MAP = {
    can_bo_xa: [1, 3, 4],
    cong_chuc: [1, 3, 4, 5, 6],
    vien_chuc: [1, 3, 4, 6],
    hanh_chinh_cong: [1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10],
    chinh_tri: [1, 4, 5, 7, 8, 7, 8, 9, 10, 10],
    dang_uy: [1, 3, 4, 5, 6, 7, 8, 9, 10],
    ngan_hang_nn: [1, 2, 3, 4, 6, 6, 7, 8],
    trung_uong: [1, 2, 5, 6, 7, 8, 9, 10],
    thanh_tra: [1, 2, 5, 6, 6, 7, 8],
    thue: [1, 2, 3, 4, 6],
    hai_quan: [1, 2, 3, 4, 6],
    kiem_toan: [1, 2, 4, 6, 8],
    tham_phan: [1, 3, 5, 6, 8],
    kiem_sat: [1, 3, 5, 6, 8],
    ngoai_giao: [1, 2, 4, 6, 8],
    qltt: [1, 3, 4, 6],
    kiem_lam: [1, 2, 4, 6],
    dnnn: [1, 3, 4, 5, 6],
    dieu_tra_vien: [1, 3, 4, 6],
    chap_hanh_vien: [1, 3, 4, 6],
    tro_giup_phap_ly: [1, 2, 4, 6],
    giao_vien: [1, 2, 4, 5],
    giang_vien: [1, 2, 4, 5, 6],
    bac_si: [1, 2, 4, 5, 6],
    nghien_cuu: [1, 2, 4, 6],
    quan_doi: [1, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10],
    cong_an: [1, 1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10]
  };

  function branchOf(jobId, rank) {
    if (jobId === 'can_bo_xa' || (jobId === 'hanh_chinh_cong' && rank <= 4)) return 'hanh_chinh_dia_phuong';
    if (jobId === 'cong_chuc' || (jobId === 'hanh_chinh_cong' && rank >= 5 && rank <= 6) || jobId === 'qltt' || jobId === 'kiem_lam') return 'so_nganh';
    if (jobId === 'hanh_chinh_cong' && rank >= 7 && rank <= 8) return 'hanh_chinh_dia_phuong';
    if (jobId === 'hanh_chinh_cong' && rank >= 9) return 'trung_uong';
    if (jobId === 'ngan_hang_nn') return 'ngan_hang_nn';
    if (jobId === 'thue' || jobId === 'hai_quan') return 'tai_chinh_thue_hq';
    if (jobId === 'thanh_tra' || jobId === 'kiem_toan') return 'thanh_tra_kiem_toan';
    if (['tham_phan', 'kiem_sat', 'dieu_tra_vien', 'chap_hanh_vien', 'tro_giup_phap_ly'].includes(jobId)) return 'tu_phap';
    if (jobId === 'trung_uong') return 'trung_uong';
    if (jobId === 'dang_uy' || jobId === 'chinh_tri') return 'dang_doan_the';
    if (['vien_chuc', 'giao_vien', 'giang_vien', 'bac_si', 'nghien_cuu'].includes(jobId)) return 'su_nghiep_cong';
    if (jobId === 'quan_doi' || jobId === 'cong_an') return 'luc_luong_vu_trang';
    return 'dnnn_ngoai_giao';
  }

  function agencyOf(jobId, rank) {
    if (jobId === 'can_bo_xa' || (jobId === 'hanh_chinh_cong' && rank <= 4)) return 'UBND cấp xã / phường';
    if (jobId === 'hanh_chinh_cong' && (rank === 5 || rank === 6)) return 'Sở chuyên ngành thuộc UBND tỉnh';
    if (jobId === 'hanh_chinh_cong' && (rank === 7 || rank === 8)) return 'UBND cấp tỉnh / thành phố trực thuộc TW';
    if (jobId === 'hanh_chinh_cong' && rank >= 9) return 'Bộ / Cơ quan ngang Bộ';
    if (jobId === 'cong_chuc') return rank >= 3 ? 'Sở chuyên ngành cấp tỉnh' : 'Phòng chuyên môn thuộc Sở / UBND';
    if (jobId === 'vien_chuc') return 'Đơn vị sự nghiệp công lập';
    if (jobId === 'ngan_hang_nn') return rank === 4 ? 'Ngân hàng Nhà nước chi nhánh tỉnh / thành phố' : 'Ngân hàng Nhà nước Việt Nam (Trung ương)';
    if (jobId === 'trung_uong') return rank >= 6 ? 'Chính phủ nước CHXHCN Việt Nam' : 'Bộ / Cơ quan ngang Bộ';
    if (jobId === 'thanh_tra') return rank <= 3 ? 'Thanh tra sở / Thanh tra tỉnh' : 'Thanh tra Chính phủ';
    if (jobId === 'dang_uy') return rank <= 2 ? 'Cơ quan chuyên trách cấp ủy' : rank <= 6 ? 'Tỉnh ủy / Thành ủy & UBKT Tỉnh ủy' : 'Các Ban Đảng Trung ương & UBKT Trung ương';
    if (jobId === 'chinh_tri') return rank <= 1 ? 'Đảng ủy cơ sở / Mặt trận' : rank <= 4 ? 'Tỉnh ủy / UBND cấp tỉnh' : rank <= 6 ? 'Bộ / Cơ quan ngang Bộ' : 'Trung ương Đảng / Bộ Chính trị';
    if (jobId === 'thue') return rank >= 4 ? 'Cục Thuế tỉnh / Tổng cục Thuế' : 'Chi cục Thuế / Cục Thuế';
    if (jobId === 'hai_quan') return rank >= 4 ? 'Cục Hải quan / Tổng cục Hải quan' : 'Chi cục Hải quan';
    if (jobId === 'kiem_toan') return 'Kiểm toán Nhà nước';
    if (jobId === 'tham_phan') return rank >= 4 ? 'Tòa án nhân dân tối cao / cấp cao' : 'Tòa án nhân dân';
    if (jobId === 'kiem_sat') return rank >= 4 ? 'Viện kiểm sát nhân dân tối cao / cấp cao' : 'Viện kiểm sát nhân dân';
    if (jobId === 'ngoai_giao') return rank >= 3 ? 'Đại sứ quán / Bộ Ngoại giao' : 'Bộ Ngoại giao';
    if (jobId === 'qltt') return 'Cục Quản lý thị trường';
    if (jobId === 'kiem_lam') return 'Chi cục Kiểm lâm';
    if (jobId === 'dnnn') return 'Tập đoàn / Tổng công ty Nhà nước';
    if (jobId === 'cong_an') return 'Bộ Công an / Công an địa phương';
    if (jobId === 'quan_doi') return 'Bộ Quốc phòng / Quân khu – Đơn vị';
    return 'Cơ quan, đơn vị khu vực công';
  }

  function roleTypeOf(jobId, rank, lv) {
    if (jobId === 'dang_uy' || jobId === 'chinh_tri') return lv >= 4 ? 'party' : 'specialist';
    if (jobId === 'hanh_chinh_cong' && [3, 4, 7, 8].includes(rank)) return 'executive';
    if (jobId === 'can_bo_xa' && rank >= 1) return 'executive';
    if (lv <= 2) return 'specialist';
    if (lv >= 7) return 'executive';
    return 'management';
  }

  var POSITIONS = {};
  var BY_JOB_RANK = {};

  function buildPositions() {
    STATE_JOBS.forEach(function (jobId) {
      var c = E.CAR[jobId];
      if (!c || !Array.isArray(c.t)) return;
      BY_JOB_RANK[jobId] = [];
      c.t.forEach(function (title, r) {
        var lvArr = LEVEL_MAP[jobId] || [1, 2, 3, 4, 5, 6];
        var lv = lvArr[Math.min(r, lvArr.length - 1)] || Math.min(10, r + 1);
        var pid = jobId + '__r' + r;
        var br = branchOf(jobId, r);
        var reqParty = lv >= 4 || jobId === 'dang_uy' || jobId === 'chinh_tri' || jobId === 'cong_an' || jobId === 'quan_doi';
        var reqTheory = lv >= 7 ? 3 : lv >= 5 ? 2 : lv >= 3 ? 1 : 0;
        // edu=99 marks a specialist recruitment route, not an education index.
        var baseEdu = c.edu === 99 ? 5 : (c.edu || 3);
        var reqEdu = lv >= 7 ? 5 : Math.max(baseEdu, lv >= 4 ? 5 : 3);
        var reqTenure = r === 0 ? 0 : (c.yrs && c.yrs[Math.min(r - 1, c.yrs.length - 1)]) || 3;
        var reqKpi = lv >= 8 ? 78 : lv >= 6 ? 70 : lv >= 4 ? 62 : 52;
        var pos = {
          id: pid,
          jobId: jobId,
          rank: r,
          title: title,
          branch: br,
          branchName: BRANCHES[br] || 'Khu vực nhà nước',
          agency: agencyOf(jobId, r),
          roleType: roleTypeOf(jobId, r, lv),
          level: lv,
          reqEdu: reqEdu,
          reqParty: reqParty,
          reqTheory: reqTheory,
          reqTenure: reqTenure,
          reqKpi: reqKpi,
          nextUp: [],
          transfers: [],
          rotations: [],
          seniorTrack: lv >= 3 && lv <= 6 ? 'Có thể thi nâng ngạch Chuyên viên chính / Chuyên viên cao cấp hoặc Chuyên gia tư vấn chính sách' : ''
        };
        POSITIONS[pid] = pos;
        BY_JOB_RANK[jobId][r] = pos;
      });
    });

    // Liên kết nextUp (trong cùng ngạch) và transfers / rotations (liên thông giữa các ngạch, cơ quan)
    Object.keys(POSITIONS).forEach(function (pid) {
      var p = POSITIONS[pid], c = E.CAR[p.jobId];
      if (p.rank + 1 < c.t.length) {
        // Đặc biệt: trong hanh_chinh_cong, rank 4 -> 5 (Chủ tịch xã -> Phó GĐ sở), rank 6 -> 7 (GĐ sở -> Phó CT tỉnh), rank 8 -> 9 (CT tỉnh -> Thứ trưởng) là ranh giới bổ nhiệm liên cấp
        p.nextUp.push(p.jobId + '__r' + (p.rank + 1));
      }
    });

    function linkTransfer(fromJob, fromRank, toJob, toRank) {
      var a = BY_JOB_RANK[fromJob] && BY_JOB_RANK[fromJob][fromRank];
      var b = BY_JOB_RANK[toJob] && BY_JOB_RANK[toJob][toRank];
      if (a && b && !a.transfers.includes(b.id)) a.transfers.push(b.id);
    }
    function linkRotation(fromJob, fromRank, toJob, toRank) {
      var a = BY_JOB_RANK[fromJob] && BY_JOB_RANK[fromJob][fromRank];
      var b = BY_JOB_RANK[toJob] && BY_JOB_RANK[toJob][toRank];
      if (a && b && !a.rotations.includes(b.id)) a.rotations.push(b.id);
    }

    // 1. Nhánh xã/phường (can_bo_xa, hanh_chinh_cong 0..4) -> Sở ngành, Tỉnh ủy, Hành chính cấp tỉnh
    linkTransfer('can_bo_xa', 0, 'hanh_chinh_cong', 1);
    linkTransfer('can_bo_xa', 0, 'cong_chuc', 0);
    linkTransfer('can_bo_xa', 1, 'hanh_chinh_cong', 3);
    linkTransfer('can_bo_xa', 1, 'cong_chuc', 1);
    linkTransfer('can_bo_xa', 2, 'hanh_chinh_cong', 4);
    linkTransfer('can_bo_xa', 2, 'cong_chuc', 2);
    linkTransfer('can_bo_xa', 2, 'hanh_chinh_cong', 5);
    linkTransfer('can_bo_xa', 2, 'dang_uy', 2);
    linkTransfer('hanh_chinh_cong', 3, 'cong_chuc', 2);
    linkTransfer('hanh_chinh_cong', 3, 'dang_uy', 2);
    linkTransfer('hanh_chinh_cong', 4, 'cong_chuc', 2);
    linkTransfer('hanh_chinh_cong', 4, 'cong_chuc', 3);
    linkTransfer('hanh_chinh_cong', 4, 'hanh_chinh_cong', 5);
    linkTransfer('hanh_chinh_cong', 4, 'dang_uy', 3);
    linkTransfer('hanh_chinh_cong', 4, 'thanh_tra', 2);

    // 2. Nhánh Sở/ngành (cong_chuc, hanh_chinh_cong 5..6) -> UBND tỉnh, Tỉnh ủy, Bộ/Trung ương, Luân chuyển cơ sở
    linkTransfer('cong_chuc', 1, 'hanh_chinh_cong', 3);
    linkTransfer('cong_chuc', 2, 'hanh_chinh_cong', 4);
    linkTransfer('cong_chuc', 2, 'hanh_chinh_cong', 5);
    linkTransfer('cong_chuc', 2, 'dang_uy', 3);
    linkTransfer('cong_chuc', 2, 'trung_uong', 2);
    linkRotation('cong_chuc', 2, 'hanh_chinh_cong', 4);
    linkRotation('cong_chuc', 2, 'chinh_tri', 1);

    linkTransfer('cong_chuc', 3, 'hanh_chinh_cong', 5);
    linkTransfer('cong_chuc', 3, 'hanh_chinh_cong', 6);
    linkTransfer('cong_chuc', 3, 'dang_uy', 3);
    linkTransfer('cong_chuc', 3, 'trung_uong', 2);
    linkTransfer('cong_chuc', 3, 'thanh_tra', 3);
    linkRotation('cong_chuc', 3, 'hanh_chinh_cong', 4);
    linkRotation('cong_chuc', 3, 'chinh_tri', 1);

    // Giám đốc sở (cong_chuc rank 4 & hanh_chinh_cong rank 6)
    [['cong_chuc', 4], ['hanh_chinh_cong', 6]].forEach(function (pair) {
      var j = pair[0], rk = pair[1];
      linkTransfer(j, rk, 'hanh_chinh_cong', 7); // Phó Chủ tịch UBND tỉnh
      linkTransfer(j, rk, 'hanh_chinh_cong', 8); // Chủ tịch UBND tỉnh
      linkTransfer(j, rk, 'dang_uy', 4);         // Trưởng ban Tỉnh ủy / Chủ nhiệm UBKT Tỉnh ủy
      linkTransfer(j, rk, 'dang_uy', 5);         // Phó Bí thư Tỉnh ủy
      linkTransfer(j, rk, 'trung_uong', 3);      // Vụ trưởng / Cục trưởng cấp Bộ
      linkTransfer(j, rk, 'trung_uong', 4);      // Thứ trưởng
      linkRotation(j, rk, 'hanh_chinh_cong', 4); // Luân chuyển Chủ tịch UBND xã/phường trọng điểm
      linkRotation(j, rk, 'chinh_tri', 1);       // Luân chuyển Bí thư Đảng ủy xã/phường trọng điểm
    });

    // Phó Giám đốc sở (hanh_chinh_cong rank 5)
    linkTransfer('hanh_chinh_cong', 5, 'cong_chuc', 4);
    linkTransfer('hanh_chinh_cong', 5, 'dang_uy', 3);
    linkTransfer('hanh_chinh_cong', 5, 'trung_uong', 2);
    linkRotation('hanh_chinh_cong', 5, 'hanh_chinh_cong', 4);

    // 3. Nhánh Ngân hàng Nhà nước (ngan_hang_nn)
    linkTransfer('ngan_hang_nn', 2, 'trung_uong', 1);
    linkTransfer('ngan_hang_nn', 3, 'trung_uong', 2);
    linkTransfer('ngan_hang_nn', 3, 'cong_chuc', 3);
    linkRotation('ngan_hang_nn', 3, 'hanh_chinh_cong', 4);
    // Giám đốc NHNN chi nhánh tỉnh (rank 4) & Vụ trưởng NHNN (rank 5)
    linkTransfer('ngan_hang_nn', 4, 'ngan_hang_nn', 5);
    linkTransfer('ngan_hang_nn', 4, 'ngan_hang_nn', 6);
    linkTransfer('ngan_hang_nn', 4, 'hanh_chinh_cong', 7); // Phó Chủ tịch UBND tỉnh phụ trách kinh tế - tài chính
    linkTransfer('ngan_hang_nn', 4, 'dang_uy', 4);         // Trưởng ban Tỉnh ủy
    linkTransfer('ngan_hang_nn', 4, 'trung_uong', 3);      // Vụ trưởng Bộ Tài chính / VPCP
    linkRotation('ngan_hang_nn', 4, 'hanh_chinh_cong', 4);

    linkTransfer('ngan_hang_nn', 5, 'ngan_hang_nn', 6);
    linkTransfer('ngan_hang_nn', 5, 'hanh_chinh_cong', 7);
    linkTransfer('ngan_hang_nn', 5, 'trung_uong', 4);      // Thứ trưởng
    linkTransfer('ngan_hang_nn', 5, 'kiem_toan', 3);       // Phó Tổng Kiểm toán
    linkRotation('ngan_hang_nn', 5, 'ngan_hang_nn', 4);    // Luân chuyển làm Giám đốc NHNN chi nhánh tỉnh
    linkRotation('ngan_hang_nn', 5, 'hanh_chinh_cong', 7); // Luân chuyển làm Phó Chủ tịch UBND tỉnh

    // Phó Thống đốc NHNN (rank 6) & Thống đốc NHNN (rank 7)
    linkTransfer('ngan_hang_nn', 6, 'trung_uong', 4);      // Thứ trưởng
    linkTransfer('ngan_hang_nn', 6, 'trung_uong', 5);      // Bộ trưởng
    linkTransfer('ngan_hang_nn', 6, 'hanh_chinh_cong', 8); // Chủ tịch UBND tỉnh
    linkTransfer('ngan_hang_nn', 6, 'dang_uy', 6);         // Bí thư Tỉnh ủy
    linkRotation('ngan_hang_nn', 6, 'dang_uy', 5);         // Luân chuyển Phó Bí thư Tỉnh ủy

    linkTransfer('ngan_hang_nn', 7, 'trung_uong', 5);      // Bộ trưởng
    linkTransfer('ngan_hang_nn', 7, 'trung_uong', 6);      // Phó Thủ tướng Chính phủ
    linkTransfer('ngan_hang_nn', 7, 'dang_uy', 6);         // Bí thư Tỉnh ủy
    linkTransfer('ngan_hang_nn', 7, 'dang_uy', 8);         // Trưởng ban Đảng Trung ương
    linkTransfer('ngan_hang_nn', 7, 'chinh_tri', 7);       // Bí thư Trung ương Đảng

    // 4. Nhánh Thuế, Hải quan, Kiểm toán, Thanh tra, Tư pháp, Ngoại giao, DNNN, Sự nghiệp công
    [['thue', 4], ['hai_quan', 4], ['qltt', 3], ['kiem_lam', 3], ['dnnn', 4], ['vien_chuc', 3], ['giang_vien', 4], ['bac_si', 4], ['nghien_cuu', 3], ['dieu_tra_vien', 3], ['chap_hanh_vien', 3], ['tro_giup_phap_ly', 3]].forEach(function (pair) {
      linkTransfer(pair[0], pair[1], 'cong_chuc', 4);        // Giám đốc sở
      linkTransfer(pair[0], pair[1], 'hanh_chinh_cong', 7);  // Phó Chủ tịch UBND tỉnh
      linkTransfer(pair[0], pair[1], 'trung_uong', 3);       // Vụ trưởng / Cục trưởng cấp Bộ
      linkTransfer(pair[0], pair[1], 'trung_uong', 4);       // Thứ trưởng
      linkTransfer(pair[0], pair[1], 'dang_uy', 4);          // Trưởng ban Tỉnh ủy
    });
    [['kiem_toan', 3], ['thanh_tra', 3], ['thanh_tra', 4], ['tham_phan', 3], ['kiem_sat', 3], ['ngoai_giao', 3]].forEach(function (pair) {
      linkTransfer(pair[0], pair[1], 'hanh_chinh_cong', 7);
      linkTransfer(pair[0], pair[1], 'trung_uong', 4);
      linkTransfer(pair[0], pair[1], 'dang_uy', 4);
      linkTransfer(pair[0], pair[1], 'dang_uy', 5);
    });
    [['kiem_toan', 4], ['thanh_tra', 6], ['tham_phan', 4], ['kiem_sat', 4], ['ngoai_giao', 4]].forEach(function (pair) {
      linkTransfer(pair[0], pair[1], 'trung_uong', 5);
      linkTransfer(pair[0], pair[1], 'trung_uong', 6);
      linkTransfer(pair[0], pair[1], 'dang_uy', 6);
      linkTransfer(pair[0], pair[1], 'chinh_tri', 7);
    });

    // 5. Nhánh Trung ương (trung_uong, hanh_chinh_cong 7..10) & Đảng (dang_uy, chinh_tri)
    linkTransfer('trung_uong', 2, 'cong_chuc', 3);
    linkTransfer('trung_uong', 3, 'cong_chuc', 4);
    linkTransfer('trung_uong', 3, 'hanh_chinh_cong', 7);
    linkTransfer('trung_uong', 3, 'dang_uy', 4);
    linkRotation('trung_uong', 3, 'hanh_chinh_cong', 7); // Vụ trưởng luân chuyển làm Phó Chủ tịch UBND tỉnh
    linkRotation('trung_uong', 3, 'dang_uy', 4);

    linkTransfer('trung_uong', 4, 'hanh_chinh_cong', 8); // Thứ trưởng <-> Chủ tịch UBND tỉnh
    linkTransfer('trung_uong', 4, 'dang_uy', 5);         // Thứ trưởng <-> Phó Bí thư Tỉnh ủy
    linkTransfer('trung_uong', 4, 'dang_uy', 6);         // Thứ trưởng -> Bí thư Tỉnh ủy
    linkTransfer('trung_uong', 4, 'ngan_hang_nn', 6);    // Thứ trưởng <-> Phó Thống đốc NHNN
    linkRotation('trung_uong', 4, 'dang_uy', 5);
    linkRotation('trung_uong', 4, 'hanh_chinh_cong', 8);

    linkTransfer('trung_uong', 5, 'dang_uy', 6);         // Bộ trưởng <-> Bí thư Tỉnh ủy
    linkTransfer('trung_uong', 5, 'dang_uy', 8);         // Bộ trưởng <-> Trưởng ban Đảng TW
    linkTransfer('trung_uong', 5, 'chinh_tri', 7);       // Bộ trưởng -> Bí thư TW Đảng
    linkTransfer('trung_uong', 6, 'chinh_tri', 8);       // Phó Thủ tướng -> Ủy viên Bộ Chính trị

    linkTransfer('hanh_chinh_cong', 7, 'hanh_chinh_cong', 8);
    linkTransfer('hanh_chinh_cong', 7, 'dang_uy', 5);    // Phó CT tỉnh -> Phó Bí thư Tỉnh ủy
    linkTransfer('hanh_chinh_cong', 7, 'trung_uong', 4); // Phó CT tỉnh -> Thứ trưởng
    linkTransfer('hanh_chinh_cong', 8, 'dang_uy', 6);    // Chủ tịch tỉnh -> Bí thư Tỉnh ủy
    linkTransfer('hanh_chinh_cong', 8, 'trung_uong', 4); // Chủ tịch tỉnh -> Thứ trưởng
    linkTransfer('hanh_chinh_cong', 8, 'trung_uong', 5); // Chủ tịch tỉnh -> Bộ trưởng

    // Cơ quan Đảng (dang_uy) <-> Chính quyền
    linkTransfer('dang_uy', 2, 'cong_chuc', 2);
    linkTransfer('dang_uy', 2, 'hanh_chinh_cong', 4);
    linkTransfer('dang_uy', 3, 'cong_chuc', 3);
    linkTransfer('dang_uy', 3, 'hanh_chinh_cong', 5);
    linkRotation('dang_uy', 3, 'hanh_chinh_cong', 4);
    linkTransfer('dang_uy', 4, 'cong_chuc', 4);
    linkTransfer('dang_uy', 4, 'hanh_chinh_cong', 7);
    linkRotation('dang_uy', 4, 'hanh_chinh_cong', 4);
    linkTransfer('dang_uy', 5, 'hanh_chinh_cong', 8);    // Phó Bí thư Tỉnh ủy <-> Chủ tịch UBND tỉnh
    linkTransfer('dang_uy', 5, 'trung_uong', 4);         // Phó Bí thư Tỉnh ủy <-> Thứ trưởng
    linkTransfer('dang_uy', 6, 'trung_uong', 5);         // Bí thư Tỉnh ủy <-> Bộ trưởng
    linkTransfer('dang_uy', 6, 'dang_uy', 7);
    linkTransfer('dang_uy', 6, 'chinh_tri', 7);          // Bí thư Tỉnh ủy -> Bí thư Trung ương Đảng
    linkTransfer('dang_uy', 8, 'chinh_tri', 8);          // Trưởng ban Đảng TW -> Ủy viên Bộ Chính trị
  }
  buildPositions();

  // ===================================================================
  // 3. TRẠNG THÁI HỒ SƠ CÔNG VỤ & KPI (STATE174 RECORD)
  // ===================================================================
  function isVNState(l) {
    if (!l || !l.alive || !l.job || l.retired) return false;
    var here = (l.abroad && l.abroad.code) || l.country;
    if (here !== 'VN') return false;
    var jid = E.resolveJob(l.job.id);
    var c = E.CAR[jid];
    return !!(c && (c.cat === 'state' || c.cat === 'uniform' || STATE_JOBS.includes(jid)));
  }

  function posOf(l, jobId, rank) {
    var j = jobId || (l && l.job && E.resolveJob(l.job.id));
    var r = rank != null ? rank : (l && l.job ? (l.job.rank || 0) : 0);
    if (!j || !BY_JOB_RANK[j]) return null;
    var arr = BY_JOB_RANK[j];
    return arr[Math.min(Math.max(0, r), arr.length - 1)] || null;
  }

  function levelOf(l, jobId, rank) {
    var p = posOf(l, jobId, rank);
    return p ? p.level : 1;
  }

  function state(l) {
    if (!l.flags) l.flags = {};
    var s = l.flags.state174;
    if (!s) {
      s = l.flags.state174 = {
        kpi: { expertise: 58, management: 52, coordination: 54, integrity: 75, credibility: 56, overall: 59 },
        rating: 'Hoàn thành tốt nhiệm vụ',
        theory: 0,           // 0: chưa, 1: sơ cấp, 2: trung cấp, 3: cao cấp
        seniorGrade: 0,      // 0: ngạch thường, 1: chuyên viên chính, 2: chuyên viên cao cấp, 3: chuyên gia cao cấp
        planned: false,      // Đã vào quy hoạch cán bộ lãnh đạo, quản lý
        plannedLevel: 0,
        provincialParty: 0,  // 0: chưa, 1: Tỉnh ủy viên, 2: Ủy viên BTV Tỉnh ủy, 3: Phó Bí thư Tỉnh ủy, 4: Bí thư Tỉnh ủy, 5: Ủy viên TW Đảng, 6: Ủy viên Bộ Chính trị
        peakLevel: 1,
        peakTitle: '',
        peakJob: '',
        rotation: null,      // { active, fromJob, fromRank, fromTitle, fromLevel, startAge, minYears, completed }
        project: null,       // Đề án cải cách nhiều năm
        approvedBoundary: null,
        history: [],
        seenEvents: {}
      };
    }
    return s;
  }

  function syncState(l) {
    if (!l || !l.flags) return null;
    var s = state(l);
    // Sửa tương thích ngược: nếu nhân vật đang làm ở Ngân hàng Nhà nước Việt Nam nhưng mang jobId 'cong_chuc'
    if (l.job && E.resolveJob(l.job.id) === 'cong_chuc' && l.job.employer123 && /Ngân hàng Nhà nước/i.test(l.job.employer123.name || '')) {
      var oldRk = l.job.rank || 0;
      var mappedRk = [0, 2, 3, 4, 5][Math.min(oldRk, 4)];
      l.job.id = 'ngan_hang_nn';
      l.job.rank = mappedRk;
      delete l.job.t;
    }
    // Đồng bộ trình độ lý luận chính trị với CIVIC118.training & ctPath
    var c118 = l.flags.civic118;
    if (c118 && (c118.training || 0) > s.theory) s.theory = Math.min(3, c118.training);
    if (l.flags.ctPath && !l.flags.ctPath.no && s.theory < 3) s.theory = 3;
    if (l.flags.commandCourse96 && s.theory < 2) s.theory = 2;
    if (l.flags.generalCourse96 && s.theory < 3) s.theory = 3;
    if (c118 && s.theory > (c118.training || 0)) c118.training = s.theory;

    // Đồng bộ chức vụ cấp ủy Tỉnh ủy / Trung ương từ CIVIC118 hoặc job hiện tại
    if (c118 && c118.party && c118.party.level != null) {
      var mappedLv = [1, 2, 5, 6][c118.party.level] || 0;
      if (mappedLv > s.provincialParty) s.provincialParty = mappedLv;
    }
    if (l.job) {
      var jid = E.resolveJob(l.job.id), rk = l.job.rank || 0;
      if (jid === 'dang_uy') {
        if (rk === 4 && s.provincialParty < 2) s.provincialParty = 2;
        if (rk === 5 && s.provincialParty < 3) s.provincialParty = 3;
        if (rk === 6 && s.provincialParty < 4) s.provincialParty = 4;
        if (rk >= 7 && s.provincialParty < 5) s.provincialParty = 5;
      }
      if (jid === 'chinh_tri') {
        if (rk === 3 && s.provincialParty < 2) s.provincialParty = 2;
        if (rk === 4 && s.provincialParty < 4) s.provincialParty = 4;
        if (rk === 7 && s.provincialParty < 5) s.provincialParty = 5;
        if (rk >= 8 && s.provincialParty < 6) s.provincialParty = 6;
      }
      var p = posOf(l, jid, rk);
      if (p) {
        if (p.level > (s.peakLevel || 0)) {
          s.peakLevel = p.level;
          s.peakTitle = E.jobTitle(l) || p.title;
          s.peakJob = jid;
        }
        if (s.rotation && s.rotation.active && (l.age - s.rotation.startAge >= (s.rotation.minYears || 2))) {
          s.rotation.completed = true;
        }
      }
    }
    updateKpiOverall(l, s);
    return s;
  }

  function updateKpiOverall(l, s) {
    var k = s.kpi;
    var knoBonus = l && l.st ? Math.round((l.st.kno - 55) * 0.12) : 0;
    var repBonus = l && l.job && l.job.rep != null ? Math.round((l.job.rep - 50) * 0.15) : 0;
    k.expertise = U.clamp(Math.round(k.expertise), 20, 100);
    k.management = U.clamp(Math.round(k.management), 20, 100);
    k.coordination = U.clamp(Math.round(k.coordination), 20, 100);
    k.integrity = U.clamp(Math.round(k.integrity), 10, 100);
    k.credibility = U.clamp(Math.round(k.credibility), 20, 100);
    k.overall = U.clamp(Math.round(k.expertise * 0.25 + k.management * 0.22 + k.coordination * 0.18 + k.integrity * 0.20 + k.credibility * 0.15 + knoBonus * 0.2 + repBonus * 0.2), 20, 100);
    if (l && l.flags && l.flags.dirty) k.integrity = Math.min(k.integrity, 48);
    s.rating = k.overall >= 82 && k.integrity >= 70 ? 'Hoàn thành xuất sắc nhiệm vụ'
      : k.overall >= 65 && k.integrity >= 55 ? 'Hoàn thành tốt nhiệm vụ'
      : k.overall >= 50 ? 'Hoàn thành nhiệm vụ'
      : 'Chưa hoàn thành nhiệm vụ';
    return k.overall;
  }

  function partyMember(l) {
    if (!l || !l.flags) return false;
    var ok = !!((l.flags.civic106 && l.flags.civic106.party) || l.flags.dangVien || l.flags.partyMember || (l.job && ['chinh_tri', 'dang_uy'].includes(E.resolveJob(l.job.id))));
    if (ok) l.flags.dangVien = true;
    return ok;
  }

  function grantPartyMember(l) {
    if (!l.flags.civic106) l.flags.civic106 = {};
    l.flags.civic106.party = true;
    l.flags.partyMember = true;
    l.flags.dangVien = true;
  }

  function recordHistory(l, actionType, fromTitle, toTitle, agency) {
    var s = state(l);
    s.history.push({
      age: l.age,
      year: l.birthYear + l.age,
      type: actionType,
      from: fromTitle || 'Chưa giữ chức vụ',
      to: toTitle,
      agency: agency || (posOf(l) && posOf(l).agency) || ''
    });
    if (s.history.length > 25) s.history.shift();
  }

  function applyPosition(l, targetJobId, targetRank, actionType, log, customNote) {
    var s = syncState(l);
    var oldTitle = l.job ? E.jobTitle(l) : 'Khởi điểm';
    var oldLevel = l.job ? levelOf(l) : 1;
    var oldEmployer = l.job && l.job.employer123 ? l.job.employer123 : null;
    var sameJob = l.job && E.resolveJob(l.job.id) === targetJobId;
    var prevSen = l.job ? (l.job.sen || l.job.yrs || 0) : 0;
    var prevRep = l.job && l.job.rep != null ? l.job.rep : 65;

    if (!sameJob) {
      var r = function () { return U.rand(l); };
      E.startJob(l, targetJobId, r, function () {}, true);
    }
    if (!l.job) return false;
    var c = E.CAR[targetJobId];
    var rk = Math.min(Math.max(0, targetRank), c.t.length - 1);
    l.job.rank = rk;
    l.job.rankTracked = rk;
    l.job.rankSince = l.age;
    l.job.sen = Math.max(prevSen, l.job.sen || 0);
    l.job.rep = Math.max(prevRep, l.job.rep || 60);
    delete l.job.t;
    delete l.job.floor;
    delete l.job.last;

    if (targetJobId === 'ngan_hang_nn') {
      l.job.employer123 = { name: rk === 4 ? 'Ngân hàng Nhà nước chi nhánh tỉnh' : 'Ngân hàng Nhà nước Việt Nam', factor: 1.08 };
    } else if (oldEmployer && sameJob) {
      l.job.employer123 = oldEmployer;
    } else if (l.job.employer123 && /Ngân hàng Nhà nước/i.test(l.job.employer123.name || '') && targetJobId !== 'ngan_hang_nn') {
      delete l.job.employer123;
    }

    var newPos = posOf(l, targetJobId, rk);
    var newTitle = E.jobTitle(l);
    if (newPos && newPos.level > (s.peakLevel || 0)) {
      s.peakLevel = newPos.level;
      s.peakTitle = newTitle;
      s.peakJob = targetJobId;
    }
    if (oldLevel > (s.peakLevel || 0)) {
      s.peakLevel = oldLevel;
      if (!s.peakTitle) s.peakTitle = oldTitle;
    }
    recordHistory(l, actionType, oldTitle, newTitle, newPos && newPos.agency);
    if (log) {
      log((customNote || ('Quyết định ' + actionType + ': ' + oldTitle + ' → ' + newTitle)) + (newPos ? ' (' + newPos.agency + ').' : '.'), 'big');
    }
    return true;
  }

  // ===================================================================
  // 4. KIỂM TRA ĐIỀU KIỆN BỔ NHIỆM / ĐIỀU ĐỘNG / LUÂN CHUYỂN MINH BẠCH
  // ===================================================================
  function checkTargetRequirements(l, targetPos, mode) {
    var s = syncState(l);
    var curPos = posOf(l);
    var curLv = curPos ? curPos.level : 1;
    var effLv = Math.max(curLv, s.peakLevel || 1);
    var tenure = l.job ? Math.max(0, l.age - (l.job.rankSince != null ? l.job.rankSince : (l.job.since != null ? l.job.since : l.age))) : 0;
    var items = [];
    var okAll = true;

    function item(pass, label, detail) {
      if (!pass) okAll = false;
      items.push({ ok: !!pass, text: (pass ? '✔ Đã đạt: ' : '○ Chưa đạt: ') + label + (detail ? ' (' + detail + ')' : '') });
    }

    // 1. Học vấn
    var eduOk = (l.edu || 0) >= targetPos.reqEdu;
    item(eduOk, 'Trình độ học vấn từ ' + E.EDU[targetPos.reqEdu] + ' trở lên', 'hiện tại: ' + E.EDU[l.edu || 0]);

    // 2. Kỷ luật & lý lịch
    var cleanOk = (l.record || 0) === 0 && !(l.flags && l.flags.dirty) && s.kpi.integrity >= 50;
    item(cleanOk, 'Hồ sơ kỷ luật & liêm chính trong sạch', 'Liêm chính ' + s.kpi.integrity + '/100');

    // 3. Đảng viên
    if (targetPos.reqParty) {
      var pOk = partyMember(l);
      item(pOk, 'Là Đảng viên Đảng Cộng sản Việt Nam', pOk ? 'đã kết nạp Đảng' : 'cần kết nạp Đảng');
    }

    // 4. Lý luận chính trị
    if (targetPos.reqTheory > 0) {
      var thOk = s.theory >= targetPos.reqTheory;
      item(thOk, THEORY_NAMES[targetPos.reqTheory], 'hiện tại: ' + THEORY_NAMES[s.theory]);
    }

    // 5. Cấp bậc & thâm niên
    if (mode === 'rotation') {
      var rotOk = curLv >= 4 && targetPos.level <= curLv;
      item(rotOk, 'Thuộc diện cán bộ quản lý/quy hoạch cử đi luân chuyển cơ sở', 'Cấp hiện tại: Bậc ' + curLv);
    } else if (mode === 'post_rotation') {
      var prOk = !!(s.rotation && s.rotation.active && (s.rotation.completed || l.age - s.rotation.startAge >= 2));
      item(prOk, 'Hoàn thành tối thiểu 2 năm luân chuyển thực tiễn cơ sở', s.rotation ? (l.age - s.rotation.startAge) + '/2 năm' : 'chưa đi luân chuyển');
      var lvPrOk = targetPos.level >= (s.rotation ? s.rotation.fromLevel : curLv) && targetPos.level <= (s.rotation ? s.rotation.fromLevel + 2 : curLv + 2);
      item(lvPrOk, 'Chức danh bổ nhiệm sau luân chuyển tương đương hoặc cao hơn chức vụ trước luân chuyển', 'Bậc mục tiêu: ' + targetPos.level);
    } else {
      var lvGap = targetPos.level - effLv;
      var lvOk = lvGap <= 1 || (lvGap === 2 && s.planned && s.kpi.overall >= 75);
      item(lvOk, 'Cấp bậc tiệm cận hợp lệ (tối đa vượt 1 bậc, hoặc 2 bậc khi đã vào quy hoạch xuất sắc)', 'Bậc hiện tại/cao nhất: ' + effLv + ' → Bậc đích: ' + targetPos.level);
      var reqYrs = mode === 'transfer' && targetPos.level === curLv ? 1 : Math.max(2, targetPos.reqTenure - (s.planned ? 1 : 0));
      var tenOk = tenure >= reqYrs || (l.job && (l.job.yrs || 0) >= reqYrs + 2);
      item(tenOk, 'Thâm niên giữ chức vụ hiện tại tối thiểu ' + reqYrs + ' năm', 'hiện có ' + tenure + ' năm ở bậc này');
    }

    // 6. Chỉ số KPI công vụ
    var reqKpi = mode === 'rotation' ? 55 : targetPos.reqKpi;
    var kpiOk = s.kpi.overall >= reqKpi;
    item(kpiOk, 'Điểm đánh giá KPI công vụ đạt từ ' + reqKpi + '/100', 'hiện tại: ' + s.kpi.overall + '/100 · ' + s.rating);

    // 7. Quy hoạch cán bộ cho cấp cao (Level >= 6)
    if (targetPos.level >= 6 && mode !== 'rotation') {
      var planOk = s.planned || effLv >= targetPos.level || (P116 && P116.record && P116.record(l).points >= 6);
      item(planOk, 'Nằm trong danh sách quy hoạch cán bộ lãnh đạo, quản lý', planOk ? 'đã được đưa vào quy hoạch' : 'cần xét duyệt quy hoạch hoặc tích lũy điểm công vụ');
    }

    return { ok: okAll, items: items, summary: items.filter(function (x) { return !x.ok; }).map(function (x) { return x.text.replace(/^○ Chưa đạt: /, ''); }).join('; ') };
  }

  // ===================================================================
  // 5. SỬA BỘ MÁY THĂNG CHỨC (E.canAdvance, E.PUBLIC116, E.CIVIC118, ct_quy_hoach)
  // ===================================================================
  // 5.1. Bảo vệ ranh giới cấp hành chính & chặn tụt chức sau luân chuyển trong E.canAdvance
  var prevCanAdvance = E.canAdvance;
  E.canAdvance = function (l, c, yearEnd) {
    if (prevCanAdvance && !prevCanAdvance(l, c, yearEnd)) return false;
    if (!l || !l.job || !c) return true;
    var s = syncState(l);
    var jid = c.id || E.resolveJob(l.job.id);
    var rk = l.job.rank || 0;

    // Chặn tuyệt đối lỗi: nhân vật từng giữ chức Giám đốc sở (hoặc tương đương Level >= 6) đang luân chuyển làm Chủ tịch UBND xã (hanh_chinh_cong rank 4)
    // không bao giờ được thăng chức tuyến tính lên Phó giám đốc sở (rank 5, Level 5 < 6)
    if (jid === 'hanh_chinh_cong' && rk === 4 && ((s && s.rotation && s.rotation.active && s.rotation.fromLevel >= 6) || (s && s.peakLevel >= 6))) {
      if (yearEnd) return false;
      // Nếu xét qua publicReview116 (yearEnd === false), cho phép đi vào apply nhưng hook của chúng ta sẽ nhảy qua rank 5 lên thẳng >= fromLevel!
      return true;
    }

    // Trong hanh_chinh_cong, các ranh giới khác cơ quan chủ quản (rank 4 Chủ tịch xã -> rank 5 Phó GĐ sở; rank 6 GĐ sở -> rank 7 Phó CT tỉnh; rank 8 CT tỉnh -> rank 9 Thứ trưởng)
    // không tự động nhảy bậc vào cuối năm nếu chưa được phê duyệt điều động / bổ nhiệm hoặc chưa đủ điều kiện cấp ủy & lý luận
    if (yearEnd && jid === 'hanh_chinh_cong' && (rk === 4 || rk === 6 || rk === 8)) {
      if (s && s.approvedBoundary === rk + 1) return true;
      if (rk === 4) return partyMember(l) && s.theory >= 2 && s.kpi.overall >= 68;
      if (rk === 6) return partyMember(l) && s.theory >= 3 && s.planned && s.kpi.overall >= 74;
      if (rk === 8) return partyMember(l) && s.theory >= 3 && s.provincialParty >= 2 && l.age >= 50 && s.kpi.overall >= 80;
    }

    // Các vị trí lãnh đạo cấp cao ở ngạch mới (Phó Thống đốc / Thống đốc NHNN, Thứ trưởng / Bộ trưởng / Phó Thủ tướng, Phó Tổng Thanh tra, Phó Bí thư / Bí thư Tỉnh ủy)
    if (yearEnd && ['ngan_hang_nn', 'trung_uong', 'thanh_tra', 'dang_uy'].includes(jid)) {
      var nextPos = posOf(l, jid, rk + 1);
      if (nextPos && nextPos.level >= 6) {
        if (!partyMember(l) || s.theory < Math.min(2, nextPos.reqTheory) || s.kpi.overall < nextPos.reqKpi - 5) return false;
      }
      if (nextPos && nextPos.level >= 8 && l.age < 42) return false;
    }
    return true;
  };

  // 5.2. Sửa E.PUBLIC116.targets và E.DEC.publicReview116 / transfer116 để Giám đốc sở không bị coi là cấp thấp và không bị tụt xuống Phó giám đốc sở
  if (P116) {
    var origTargets = P116.targets;
    P116.targets = function (l) {
      var base = origTargets ? origTargets.apply(this, arguments) : [];
      if (!l || !l.job) return base;
      var s = syncState(l);
      var lv = Math.max(levelOf(l), s ? (s.peakLevel || 1) : 1);
      // Nếu nhân vật đang là Giám đốc sở (cong_chuc rank 4, Level 6) hoặc tương đương Level >= 6, mở các đích cấp tỉnh [5, 6, 7, 8] + luân chuyển Chủ tịch xã [4]
      if (lv >= 6) {
        var jid = E.resolveJob(l.job.id), rk = l.job.rank || 0;
        var pool = [4, 5, 6, 7, 8];
        return pool.filter(function (targetRank) {
          if (jid === 'hanh_chinh_cong' && targetRank === rk) return false;
          // Giám đốc sở (Level 6) không điều động sang Phó giám đốc sở (targetRank 5, Level 5)
          if (lv >= 6 && targetRank === 5) return false;
          return true;
        });
      }
      return base;
    };

    // Khi điều động qua transfer116: nếu đang ở Level >= 6 (VD Giám đốc sở) mà về nhận Chủ tịch UBND xã (rank 4), ghi nhận trạng thái Luân chuyển cơ sở!
    if (E.DEC.transfer116 && E.DEC.transfer116.apply) {
      var origTransfer116Apply = E.DEC.transfer116.apply;
      E.DEC.transfer116.apply = function (l, d, k, r, log) {
        var beforePos = posOf(l);
        var beforeTitle = l.job ? E.jobTitle(l) : '';
        var beforeJob = l.job ? E.resolveJob(l.job.id) : '';
        var beforeRk = l.job ? (l.job.rank || 0) : 0;
        var beforeLv = beforePos ? beforePos.level : 1;
        var res = origTransfer116Apply.apply(this, arguments);
        if (l.job && E.resolveJob(l.job.id) === 'hanh_chinh_cong' && l.job.rank === 4 && beforeLv >= 5) {
          var s = syncState(l);
          s.peakLevel = Math.max(s.peakLevel || 1, beforeLv);
          if (!s.peakTitle || beforeLv >= s.peakLevel) s.peakTitle = beforeTitle;
          s.rotation = {
            active: true,
            fromJob: beforeJob,
            fromRank: beforeRk,
            fromTitle: beforeTitle,
            fromLevel: beforeLv,
            startAge: l.age,
            minYears: 2,
            completed: false
          };
          recordHistory(l, 'luân chuyển cơ sở', beforeTitle, E.jobTitle(l), 'UBND cấp xã / phường');
          if (log) log('Bảo lưu cấp bậc trước luân chuyển (' + beforeTitle + ' · Bậc ' + beforeLv + '). Sau khi hoàn thành nhiệm kỳ thực tiễn cơ sở, bạn sẽ được xét bổ nhiệm chức vụ tương đương hoặc cao hơn (Phó Chủ tịch UBND tỉnh / Ủy viên BTV Tỉnh ủy), không quay lại chức Phó giám đốc sở.', 'good');
        }
        return res;
      };
    }

    // Khi xét thăng chức qua publicReview116: nếu đang là Chủ tịch UBND xã (rank 4) sau khi luân chuyển từ Giám đốc sở (fromLevel >= 6),
    // khi được thăng chức sẽ nhảy thẳng lên Phó Chủ tịch UBND tỉnh (rank 7), KHÔNG BAO GIỜ thành Phó giám đốc sở (rank 5)!
    if (E.DEC.publicReview116 && E.DEC.publicReview116.apply) {
      var origReview116Apply = E.DEC.publicReview116.apply;
      E.DEC.publicReview116.apply = function (l, d, k, r, log) {
        var s = syncState(l);
        var wasRotatedChair = l.job && E.resolveJob(l.job.id) === 'hanh_chinh_cong' && l.job.rank === 4 &&
          ((s.rotation && s.rotation.active && s.rotation.fromLevel >= 6) || s.peakLevel >= 6);
        var res = origReview116Apply.apply(this, arguments);
        if (wasRotatedChair && l.job && E.resolveJob(l.job.id) === 'hanh_chinh_cong' && l.job.rank === 5) {
          var targetRk = 7; // Phó Chủ tịch UBND tỉnh
          l.job.rank = targetRk;
          l.job.rankTracked = targetRk;
          l.job.rankSince = l.age;
          if (s.rotation) { s.rotation.active = false; s.rotation.completed = true; }
          s.peakLevel = Math.max(s.peakLevel || 6, 7);
          s.peakTitle = E.jobTitle(l);
          recordHistory(l, 'bổ nhiệm sau luân chuyển', 'chủ tịch UBND xã', E.jobTitle(l), 'UBND cấp tỉnh');
          if (log) log('Hoàn thành xuất sắc nhiệm kỳ luân chuyển cơ sở từ vị trí ' + (s.rotation && s.rotation.fromTitle || 'giám đốc sở') + ': bạn được bổ nhiệm giữ chức ' + E.jobTitle(l) + '.', 'big');
        }
        return res;
      };
    }
  }

  // 5.3. Mở rộng E.CIVIC118.management để công nhận mọi cán bộ quản lý nhà nước (Level >= 4)
  if (C118) {
    var origMgmt = C118.management;
    C118.management = function (l) {
      if (origMgmt && origMgmt(l)) return true;
      if (!isVNState(l)) return false;
      var s = syncState(l);
      return Math.max(levelOf(l), s ? (s.peakLevel || 1) : 1) >= 4;
    };
  }

  // 5.4. Nâng cấp ct_quy_hoach (life84.js) để không làm tụt bậc cán bộ lãnh đạo cấp sở/ngành khi chuyển sang ngạch chính trị
  if (E.DEC.ct_quy_hoach && E.DEC.ct_quy_hoach.def && Array.isArray(E.DEC.ct_quy_hoach.def.opts)) {
    var nhanOpt = E.DEC.ct_quy_hoach.def.opts.find(function (o) { return o.k === 'nhan'; });
    if (nhanOpt) {
      var origNhanRun = nhanOpt.run;
      nhanOpt.run = function (l, r, log) {
        var beforeLv = l.job ? levelOf(l) : 1;
        var beforeRk = l.job ? (l.job.rank || 0) : 0;
        var beforeJob = l.job ? E.resolveJob(l.job.id) : '';
        origNhanRun.apply(this, arguments);
        // Giữ nguyên hành vi test hồi quy: cong_chuc rank 2 -> chinh_tri rank 1
        // Nhưng nếu trước đó đã ở cấp Phó GĐ sở / GĐ sở / Vụ trưởng (beforeLv >= 5), đặt bậc tương xứng trong chinh_tri!
        if (l.job && E.resolveJob(l.job.id) === 'chinh_tri') {
          if (beforeJob === 'cong_chuc' && beforeRk === 2) {
            l.job.rank = 1;
          } else if (beforeLv >= 7) {
            l.job.rank = 3;
          } else if (beforeLv >= 5) {
            l.job.rank = 2;
          }
          l.job.rankTracked = l.job.rank;
          var s = syncState(l);
          s.planned = true;
          s.theory = Math.max(s.theory, 3);
        }
      };
    }
  }

  // ===================================================================
  // 6. DANH MỤC HOẠT ĐỘNG CÔNG VỤ THEO NHÁNH & CẬP NHẬT KPI HẰNG NĂM
  // ===================================================================
  var BRANCH_TASKS = {
    hanh_chinh_dia_phuong: [
      { k: 'mot_cua', l: 'Chấn chỉnh bộ phận Một cửa & giải quyết hồ sơ tồn đọng', exp: 3, mgmt: 3, coord: 2, intg: 2, cred: 4, note: 'Tỷ lệ hồ sơ giải quyết đúng hạn tại địa phương tăng lên trên 96%, người dân đánh giá tích cực.' },
      { k: 'doi_thoai', l: 'Tổ chức đối thoại trực tiếp với nhân dân về đất đai, hạ tầng', exp: 2, mgmt: 4, coord: 3, intg: 2, cred: 5, note: 'Nhiều kiến nghị kéo dài ở cơ sở được tháo gỡ ngay tại buổi đối thoại, giảm đơn thư vượt cấp.' },
      { k: 'chuyen_doi_so', l: 'Triển khai đề án số hóa hộ tịch và dịch vụ công trực tuyến', exp: 4, mgmt: 3, coord: 4, intg: 1, cred: 3, note: 'Địa phương nằm trong nhóm dẫn đầu về tỷ lệ hồ sơ trực tuyến và số hóa dữ liệu dân cư.' }
    ],
    so_nganh: [
      { k: 'tham_muu', l: 'Chủ trì xây dựng đề án quy hoạch & cơ chế chuyên ngành cấp tỉnh', exp: 5, mgmt: 3, coord: 4, intg: 1, cred: 3, note: 'Đề án chuyên ngành được UBND tỉnh và HĐND tỉnh thông qua với tỷ lệ tán thành cao.' },
      { k: 'lien_nganh', l: 'Điều phối tổ công tác liên sở tháo gỡ vướng mắc đầu tư công', exp: 3, mgmt: 4, coord: 5, intg: 2, cred: 3, note: 'Tiến độ giải ngân vốn đầu tư công của ngành tăng mạnh, tháo gỡ điểm nghẽn thủ tục.' },
      { k: 'kiem_tra_so', l: 'Rà soát quy trình thẩm định hồ sơ, phòng ngừa nhũng nhiễu', exp: 2, mgmt: 3, coord: 2, intg: 5, cred: 4, note: 'Kỷ cương hành chính trong toàn sở/ngành được siết chặt, không phát sinh sai phạm.' }
    ],
    ngan_hang_nn: [
      { k: 'dieu_hanh_td', l: 'Điều hành hạn mức tín dụng, lãi suất và thanh khoản hệ thống', exp: 5, mgmt: 4, coord: 4, intg: 2, cred: 4, note: 'Thanh khoản hệ thống tổ chức tín dụng ổn định, dòng vốn hướng vào lĩnh vực sản xuất ưu tiên.' },
      { k: 'thanh_tra_nh', l: 'Giám sát an toàn vĩ mô, xử lý nợ xấu và sở hữu chéo ngân hàng', exp: 4, mgmt: 4, coord: 3, intg: 5, cred: 4, note: 'Phát hiện và khoanh vùng sớm rủi ro tín dụng, giữ vững an toàn hệ thống ngân hàng.' },
      { k: 'thanh_toan_so', l: 'Phát triển hạ tầng thanh toán không dùng tiền mặt & dữ liệu tín dụng', exp: 5, mgmt: 3, coord: 4, intg: 2, cred: 3, note: 'Giao dịch thanh toán điện tử tăng trưởng mạnh, bảo đảm an ninh an toàn thông tin.' }
    ],
    tai_chinh_thue_hq: [
      { k: 'chong_that_thu', l: 'Chuyên đề chống thất thu ngân sách, chuyển giá và hoàn thuế gian lận', exp: 5, mgmt: 3, coord: 3, intg: 5, cred: 4, note: 'Truy thu và nộp ngân sách nhà nước hàng trăm tỷ đồng, giữ nghiêm kỷ luật tài khóa.' },
      { k: 'hai_quan_so', l: 'Tự động hóa thông quan điện tử và quản lý rủi ro xuất nhập khẩu', exp: 4, mgmt: 4, coord: 4, intg: 3, cred: 3, note: 'Thời gian thông quan hàng hóa giảm rõ rệt, tạo thuận lợi thương mại minh bạch.' }
    ],
    thanh_tra_kiem_toan: [
      { k: 'thanh_tra_cd', l: 'Chủ trì đoàn thanh tra / kiểm toán chuyên đề dự án trọng điểm', exp: 5, mgmt: 4, coord: 3, intg: 5, cred: 4, note: 'Kết luận thanh tra, kiểm toán chỉ rõ sai phạm, kiến nghị thu hồi tài sản nhà nước và sửa đổi cơ chế.' },
      { k: 'tiep_dan', l: 'Giải quyết dứt điểm các vụ việc khiếu nại, tố cáo phức tạp, tồn đọng', exp: 3, mgmt: 4, coord: 4, intg: 4, cred: 5, note: 'Nhiều vụ việc khiếu kiện kéo dài được rà soát khách quan, thấu tình đạt lý.' }
    ],
    tu_phap: [
      { k: 'xet_xu_an', l: 'Giải quyết các vụ án kinh tế, hành chính phức tạp đúng thời hạn luật định', exp: 5, mgmt: 3, coord: 3, intg: 5, cred: 4, note: 'Bản án, quyết định bảo đảm đúng người, đúng tội, đúng pháp luật, không có án oan sai hay hủy sửa.' },
      { k: 'cai_cach_tp', l: 'Triển khai phiên tòa số hóa và nâng cao chất lượng tranh tụng', exp: 4, mgmt: 4, coord: 4, intg: 3, cred: 4, note: 'Chất lượng hồ sơ và công tác kiểm sát, xét xử được hội đồng chuyên môn đánh giá cao.' }
    ],
    trung_uong: [
      { k: 'xay_dung_luat', l: 'Chủ trì soạn thảo dự án Luật / Nghị định trình Chính phủ và Quốc hội', exp: 5, mgmt: 4, coord: 5, intg: 2, cred: 4, note: 'Dự thảo văn bản quy phạm pháp luật có tính khả thi cao, tháo gỡ chồng chéo thể chế giữa các bộ ngành.' },
      { k: 'dieu_phoi_vung', l: 'Điều phối chương trình mục tiêu quốc gia & liên kết vùng kinh tế', exp: 4, mgmt: 5, coord: 5, intg: 2, cred: 4, note: 'Cơ chế phối hợp giữa các bộ và địa phương vận hành thông suốt, đạt mục tiêu Chính phủ giao.' }
    ],
    dang_doan_the: [
      { k: 'cong_tac_can_bo', l: 'Rà soát quy hoạch, thẩm định tiêu chuẩn chính trị và đánh giá cán bộ', exp: 4, mgmt: 5, coord: 4, intg: 4, cred: 5, note: 'Công tác nhân sự cấp ủy bảo đảm dân chủ, khách quan, đúng quy trình 5 bước.' },
      { k: 'kiem_tra_dang', l: 'Kiểm tra, giám sát chuyên đề tổ chức Đảng và đảng viên giữ chức vụ', exp: 4, mgmt: 4, coord: 3, intg: 5, cred: 5, note: 'Giữ nghiêm kỷ luật, kỷ cương của Đảng, kịp thời chấn chỉnh những biểu hiện suy thoái.' }
    ],
    su_nghiep_cong: [
      { k: 'de_tai_cong', l: 'Chủ trì đề tài khoa học / đổi mới chuyên môn và quản trị đơn vị công lập', exp: 5, mgmt: 4, coord: 3, intg: 2, cred: 4, note: 'Chất lượng dịch vụ sự nghiệp công và uy tín học thuật của đơn vị được nâng cao rõ rệt.' }
    ],
    luc_luong_vu_trang: [
      { k: 'chuyen_an', l: 'Chỉ đạo phương án sẵn sàng chiến đấu, bảo đảm an ninh trật tự địa bàn', exp: 4, mgmt: 5, coord: 4, intg: 4, cred: 5, note: 'Giữ vững thế trận an ninh nhân dân, quốc phòng toàn dân trên địa bàn trọng điểm.' }
    ],
    dnnn_ngoai_giao: [
      { k: 'hoi_nhap', l: 'Thúc đẩy ngoại giao kinh tế / tái cơ cấu quản trị doanh nghiệp nhà nước', exp: 4, mgmt: 4, coord: 5, intg: 3, cred: 4, note: 'Bảo toàn và phát triển vốn nhà nước, mở rộng quan hệ đối tác chiến lược.' }
    ]
  };

  function tasksFor(l) {
    var p = posOf(l);
    var br = p ? p.branch : 'so_nganh';
    return BRANCH_TASKS[br] || BRANCH_TASKS.so_nganh;
  }

  // ===================================================================
  // 7. DANH SÁCH LỘ TRÌNH CHỨC DANH TIẾP THEO (UPWARD / TRANSFER / ROTATION)
  // ===================================================================
  function availablePathways(l) {
    if (!isVNState(l)) return [];
    var s = syncState(l);
    var cur = posOf(l);
    if (!cur) return [];
    var out = [];
    var seen = {};

    function addPath(pid, mode, labelPrefix) {
      if (!pid || seen[pid + ':' + mode]) return;
      var tPos = POSITIONS[pid];
      if (!tPos) return;
      if (tPos.jobId === cur.jobId && tPos.rank === cur.rank) return;
      // Chặn tuyệt đối lộ trình làm tụt chức so với chức vụ cao nhất từng giữ (ví dụ từ Giám đốc sở Bậc 6 luân chuyển về Chủ tịch xã không bao giờ đi lên Phó GĐ sở Bậc 5 hay Trưởng phòng Bậc 4)
      var minAllowedLevel = Math.max(cur.level, s.rotation && s.rotation.fromLevel || 0, s.peakLevel || 0);
      if (mode !== 'rotation' && minAllowedLevel > cur.level && tPos.level < minAllowedLevel) {
        return;
      }
      seen[pid + ':' + mode] = true;
      var check = checkTargetRequirements(l, tPos, mode);
      out.push({
        pos: tPos,
        mode: mode,
        modeLabel: labelPrefix,
        check: check
      });
    }

    // 1. Nếu đang trong diện luân chuyển cơ sở (ví dụ Giám đốc sở về làm Chủ tịch UBND xã), hiển thị ngay lộ trình đề bạt sau luân chuyển!
    if (s.rotation && s.rotation.active) {
      var fromLv = s.rotation.fromLevel || s.peakLevel || 6;
      if (fromLv >= 6) {
        addPath('hanh_chinh_cong__r7', 'post_rotation', 'Bổ nhiệm sau luân chuyển');
        addPath('dang_uy__r4', 'post_rotation', 'Bổ nhiệm sau luân chuyển (Cấp ủy)');
        addPath('dang_uy__r5', 'post_rotation', 'Bổ nhiệm sau luân chuyển (Thường vụ Tỉnh ủy)');
        addPath('trung_uong__r3', 'post_rotation', 'Điều động về Bộ/Trung ương sau luân chuyển');
        addPath('hanh_chinh_cong__r6', 'post_rotation', 'Phân công lại Giám đốc sở trọng điểm');
      } else {
        addPath('cong_chuc__r3', 'post_rotation', 'Bổ nhiệm Phó Giám đốc sở sau luân chuyển');
        addPath('hanh_chinh_cong__r5', 'post_rotation', 'Bổ nhiệm Phó Giám đốc sở sau luân chuyển');
        addPath('dang_uy__r3', 'post_rotation', 'Bổ nhiệm Phó Trưởng ban Tỉnh ủy');
      }
    }

    // 2. Thăng tiến nội bộ (nextUp)
    cur.nextUp.forEach(function (pid) {
      addPath(pid, 'up', 'Thăng chức / Bổ nhiệm kế cận');
    });

    // 3. Điều động ngang hoặc bổ nhiệm liên cơ quan (transfers)
    cur.transfers.forEach(function (pid) {
      var tPos = POSITIONS[pid];
      var lbl = tPos && tPos.level > cur.level ? 'Bổ nhiệm liên thông cấp trên' : 'Điều động / Chuyển ngạch tương đương';
      addPath(pid, 'transfer', lbl);
    });

    // 4. Luân chuyển cán bộ cơ sở / địa phương (rotations)
    if (!s.rotation || !s.rotation.active) {
      cur.rotations.forEach(function (pid) {
        addPath(pid, 'rotation', 'Luân chuyển rèn luyện thực tiễn cơ sở');
      });
    }

    return out;
  }

  // ===================================================================
  // 8. GIAO DIỆN HỒ SƠ CÔNG VỤ, KPI, BỔ NHIỆM, LUÂN CHUYỂN & TỈNH ỦY
  // ===================================================================
  var PROVINCIAL_PARTY_ROLES = [
    { lv: 1, title: 'Tỉnh ủy viên (Ủy viên BCH Đảng bộ tỉnh)', reqLevel: 4, reqTheory: 2, reqKpi: 66, civicIdx: 0 },
    { lv: 2, title: 'Ủy viên Ban Thường vụ Tỉnh ủy', reqLevel: 6, reqTheory: 3, reqKpi: 72, civicIdx: 1 },
    { lv: 3, title: 'Phó Bí thư Tỉnh ủy', reqLevel: 6, reqTheory: 3, reqKpi: 76, targetJob: 'dang_uy', targetRank: 5 },
    { lv: 4, title: 'Bí thư Tỉnh ủy', reqLevel: 7, reqTheory: 3, reqKpi: 80, targetJob: 'dang_uy', targetRank: 6 },
    { lv: 5, title: 'Ủy viên Ban Chấp hành Trung ương Đảng', reqLevel: 8, reqTheory: 3, reqKpi: 84, civicIdx: 2 },
    { lv: 6, title: 'Ủy viên Bộ Chính trị', reqLevel: 9, reqTheory: 3, reqKpi: 88, civicIdx: 3 }
  ];

  function checkPartyRole(l, roleDef) {
    var s = syncState(l);
    var effLv = Math.max(levelOf(l), s.peakLevel || 1);
    var pOk = partyMember(l);
    var thOk = s.theory >= roleDef.reqTheory;
    var lvOk = effLv >= roleDef.reqLevel;
    var kpiOk = s.kpi.overall >= roleDef.reqKpi;
    var cleanOk = (l.record || 0) === 0 && !(l.flags && l.flags.dirty);
    var orderOk = s.provincialParty >= roleDef.lv - 1 || effLv >= roleDef.reqLevel + 1;
    var missing = [];
    if (!pOk) missing.push('Cần là Đảng viên');
    if (!thOk) missing.push('Cần ' + THEORY_NAMES[roleDef.reqTheory]);
    if (!lvOk) missing.push('Cần giữ chức vụ từ Bậc ' + roleDef.reqLevel + ' trở lên (hiện tại Bậc ' + effLv + ')');
    if (!kpiOk) missing.push('Cần KPI ≥ ' + roleDef.reqKpi + '/100');
    if (!orderOk) missing.push('Cần qua cấp ủy liền kề trước đó');
    if (!cleanOk) missing.push('Không vi phạm kỷ luật');
    return { ok: pOk && thOk && lvOk && kpiOk && cleanOk && orderOk, missing: missing };
  }

  function statusSummaryText(l) {
    if (!isVNState(l)) return 'Bạn hiện không công tác trong khu vực nhà nước Việt Nam.';
    var s = syncState(l), p = posOf(l), k = s.kpi;
    var tenure = Math.max(0, l.age - (l.job.rankSince != null ? l.job.rankSince : (l.job.since != null ? l.job.since : l.age)));
    var lines = [
      '• Chức danh hiện tại: ' + E.jobTitle(l) + ' (Mã: ' + (p ? p.id : l.job.id) + ' · Cấp tương đương: Bậc ' + (p ? p.level : 1) + '/10)',
      '• Cơ quan / Đơn vị: ' + ((l.job.employer123 && l.job.employer123.name) || (p ? p.agency : 'Cơ quan nhà nước')) + ' · Nhánh: ' + (p ? p.branchName : 'Nhà nước'),
      '• Thâm niên chức vụ hiện tại: ' + tenure + ' năm (tổng ' + (l.job.yrs || 0) + ' năm trong ngành)' + (s.seniorGrade ? ' · Ngạch: ' + SENIOR_GRADES[s.seniorGrade] : ''),
      '• Chính trị & Quy hoạch: ' + (partyMember(l) ? 'Đảng viên' : 'Quần chúng') + ' · ' + THEORY_NAMES[s.theory] + ' · ' + (s.planned ? 'Đã vào quy hoạch cán bộ lãnh đạo' : 'Chưa vào quy hoạch cấp cao') + (s.provincialParty ? ' · Cấp ủy: ' + PROVINCIAL_PARTY_ROLES[s.provincialParty - 1].title : ''),
      '• Chỉ số KPI công vụ: Tổng hợp ' + k.overall + '/100 (' + s.rating + ') — Chuyên môn ' + k.expertise + ' · Quản lý ' + k.management + ' · Phối hợp ' + k.coordination + ' · Liêm chính ' + k.integrity + ' · Tín nhiệm ' + k.credibility
    ];
    if (s.rotation && s.rotation.active) {
      lines.push('• Trạng thái luân chuyển: Đang luân chuyển cơ sở từ chức vụ ' + s.rotation.fromTitle + ' (Bậc ' + s.rotation.fromLevel + ', đã đi ' + (l.age - s.rotation.startAge) + '/' + s.rotation.minYears + ' năm' + (s.rotation.completed ? ' — Đủ điều kiện xét bổ nhiệm vượt cấp' : '') + ').');
    } else if (s.peakLevel > (p ? p.level : 1)) {
      lines.push('• Chức vụ cao nhất từng giữ: ' + s.peakTitle + ' (Bậc ' + s.peakLevel + '/10 — được bảo lưu tương đương khi xét bổ nhiệm).');
    }
    var paths = availablePathways(l);
    if (paths.length) {
      lines.push('\nLỘ TRÌNH CHỨC DANH KHẢ THI TIẾP THEO:');
      paths.slice(0, 6).forEach(function (pt) {
        lines.push((pt.check.ok ? '✔ [Đủ điều kiện] ' : '○ [Chưa đủ ĐK] ') + pt.modeLabel + ': ' + pt.pos.title + ' (' + pt.pos.agency + ' · Bậc ' + pt.pos.level + ')' + (pt.check.ok ? '' : ' — Thiếu: ' + pt.check.summary));
      });
    }
    return lines.join('\n');
  }

  // Menu 1: Hồ sơ công vụ, KPI & lộ trình chức danh (stateCareer174)
  if (X && X.menu) {
    X.menu('stateCareer174', 'Hồ sơ công vụ, KPI & lộ trình chức danh', function (l) {
      return isVNState(l) ? true : 'Chỉ áp dụng khi đang làm việc trong khu vực nhà nước tại Việt Nam';
    }, statusSummaryText, function (l) {
      var opts = [
        { k: 'work', l: 'Thực thi nhiệm vụ chuyên môn, đề án & nâng cao KPI công vụ', run: function (l, r) { X.next(l, 'stateWork174', r); } },
        { k: 'transfer', l: 'Bổ nhiệm, điều động, luân chuyển & thi nâng ngạch chuyên gia', run: function (l, r) { X.next(l, 'stateTransfer174', r); } },
        { k: 'party', l: 'Quy hoạch cán bộ, lý luận chính trị & con đường vào Tỉnh ủy', run: function (l, r) { X.next(l, 'stateParty174', r); } }
      ];
      return opts;
    }, 18, 'Công vụ & quản lý');

    // Menu 2: Thực thi công vụ, đề án cải cách & nâng cao KPI (stateWork174)
    X.menu('stateWork174', 'Hoạt động chuyên môn, quản lý & đề án công vụ', function (l) {
      return isVNState(l) ? true : 'Chỉ áp dụng cho cán bộ, công chức, viên chức đang công tác';
    }, function (l) {
      var s = syncState(l), p = posOf(l);
      return 'Đơn vị: ' + (p ? p.agency : 'Cơ quan nhà nước') + ' · KPI hiện tại: ' + s.kpi.overall + '/100 (' + s.rating + ').\nMỗi năm bạn có thể chủ trì một nhiệm vụ trọng tâm của ngành để tích lũy thành tích chuyên môn, quản lý, phối hợp liên ngành và điểm công vụ.';
    }, function (l) {
      var s = syncState(l), tasks = tasksFor(l);
      var doneThisYear = s.workAt === l.age;
      var out = tasks.map(function (t) {
        return {
          k: t.k,
          l: t.l,
          h: '+Chuyên môn +' + t.exp + ' · +Quản lý +' + t.mgmt + ' · +Phối hợp +' + t.coord + ' · +Tín nhiệm +' + t.cred,
          why: doneThisYear ? 'Đã thực hiện nhiệm vụ trọng tâm trong năm nay' : true,
          run: function (l, r, log) {
            s.workAt = l.age;
            s.kpi.expertise = U.clamp(s.kpi.expertise + t.exp, 20, 100);
            s.kpi.management = U.clamp(s.kpi.management + t.mgmt, 20, 100);
            s.kpi.coordination = U.clamp(s.kpi.coordination + t.coord, 20, 100);
            s.kpi.integrity = U.clamp(s.kpi.integrity + t.intg, 10, 100);
            s.kpi.credibility = U.clamp(s.kpi.credibility + t.cred, 20, 100);
            updateKpiOverall(l, s);
            if (l.job) l.job.rep = U.clamp((l.job.rep == null ? 60 : l.job.rep) + 3, 0, 100);
            if (P116 && P116.record) {
              var pRec = P116.record(l);
              pRec.projects = (pRec.projects || 0) + 1;
              pRec.points = Math.min(20, (pRec.points || 0) + 2);
            }
            H.fx(l, { kno: 1, soc: 1 });
            log(t.note + ' (KPI công vụ đạt ' + s.kpi.overall + '/100 · ' + s.rating + ').', 'good');
          }
        };
      });
      // Đề án cải cách nhiều năm (Multi-year project)
      out.push({
        k: 'multi_project',
        l: s.project && !s.project.done ? 'Báo cáo nghiệm thu Đề án trọng điểm cấp ngành (' + s.project.name + ')' : 'Đăng ký chủ trì Đề án cải cách / chuyển đổi số cấp ngành (2 năm)',
        why: s.project && !s.project.done ? (l.age > s.project.startAge ? true : 'Cần sang năm tiếp theo để nghiệm thu đề án') : (doneThisYear ? 'Đã nhận nhiệm vụ trọng tâm trong năm nay' : true),
        run: function (l, r, log) {
          if (!s.project || s.project.done) {
            var p = posOf(l);
            var pName = p && p.branch === 'ngan_hang_nn' ? 'Đề án tái cơ cấu thanh khoản & ngân hàng số'
              : p && p.branch === 'hanh_chinh_dia_phuong' ? 'Đề án chính quyền điện tử & cải cách thủ tục hành chính cấp cơ sở'
              : p && p.branch === 'trung_uong' ? 'Đề án hoàn thiện thể chế và phân cấp quản lý nhà nước'
              : 'Đề án hiện đại hóa quản lý chuyên ngành và kiểm soát công vụ';
            s.project = { name: pName, startAge: l.age, done: false };
            s.workAt = l.age;
            s.kpi.expertise = U.clamp(s.kpi.expertise + 3, 20, 100);
            updateKpiOverall(l, s);
            log('Bạn được giao chủ trì "' + pName + '" trong 2 năm. Hoàn thành nghiệm thu vào năm tới sẽ giúp tăng mạnh tín nhiệm quy hoạch và mở cơ hội bổ nhiệm.', 'good');
          } else {
            s.project.done = true;
            s.workAt = l.age;
            s.planned = true;
            s.kpi.expertise = U.clamp(s.kpi.expertise + 5, 20, 100);
            s.kpi.management = U.clamp(s.kpi.management + 5, 20, 100);
            s.kpi.credibility = U.clamp(s.kpi.credibility + 6, 20, 100);
            updateKpiOverall(l, s);
            if (P116 && P116.record) { var pr = P116.record(l); pr.projects = (pr.projects || 0) + 1; pr.points = Math.min(20, (pr.points || 0) + 3); }
            log('Nghiệm thu xuất sắc "' + s.project.name + '". Bạn được ghi nhận sáng kiến cấp ngành và đưa vào diện quy hoạch cán bộ lãnh đạo, quản lý.', 'big');
          }
        }
      });
      return out;
    }, 18, 'Công vụ & quản lý');

    // Menu 3: Bổ nhiệm, điều động, luân chuyển & ngạch chuyên gia (stateTransfer174)
    X.menu('stateTransfer174', 'Bổ nhiệm, điều động, luân chuyển & ngạch chuyên gia', function (l) {
      return isVNState(l) ? true : 'Chỉ áp dụng khi đang làm việc trong khu vực nhà nước tại Việt Nam';
    }, function (l) {
      var s = syncState(l), p = posOf(l);
      return 'Chức vụ hiện tại: ' + E.jobTitle(l) + ' (Bậc ' + (p ? p.level : 1) + '/10 · ' + (p ? p.agency : '') + ').\n' +
        'Hệ thống tách biệt rõ 4 cơ chế: (1) Bổ nhiệm lên chức vụ cao hơn; (2) Điều động ngang sang cơ quan/ngành khác tương đương; (3) Luân chuyển về giữ chức chủ chốt địa phương để rèn luyện thực tiễn rồi đề bạt lên chức cao hơn; (4) Thi nâng ngạch Chuyên viên chính / Chuyên viên cao cấp.';
    }, function (l) {
      var s = syncState(l), paths = availablePathways(l);
      var out = paths.map(function (pt, idx) {
        var tPos = pt.pos;
        return {
          k: 'path_' + idx,
          l: pt.modeLabel + ': ' + tPos.title + ' (' + tPos.agency + ' · Bậc ' + tPos.level + ')',
          h: pt.check.ok ? '✔ Đủ điều kiện trình xét quyết định' : 'Chưa đủ: ' + pt.check.summary,
          why: pt.check.ok ? true : 'Thiếu điều kiện: ' + pt.check.summary,
          run: function (l, r, log) {
            if (!pt.check.ok) return;
            var beforeTitle = E.jobTitle(l);
            var beforeJob = E.resolveJob(l.job.id);
            var beforeRk = l.job.rank || 0;
            var beforeLv = levelOf(l);
            if (pt.mode === 'rotation') {
              s.peakLevel = Math.max(s.peakLevel || 1, beforeLv);
              if (!s.peakTitle || beforeLv >= s.peakLevel) s.peakTitle = beforeTitle;
              s.rotation = {
                active: true,
                fromJob: beforeJob,
                fromRank: beforeRk,
                fromTitle: beforeTitle,
                fromLevel: beforeLv,
                startAge: l.age,
                minYears: 2,
                completed: false
              };
              applyPosition(l, tPos.jobId, tPos.rank, 'luân chuyển cán bộ về cơ sở', log,
                'Ban Tổ chức và cơ quan chủ quản quyết định luân chuyển bạn từ vị trí ' + beforeTitle + ' (Bậc ' + beforeLv + ') về giữ chức ' + tPos.title + ' để tích lũy thực tiễn điều hành địa phương');
              if (l.job) l.job.rankSince = l.age - 1;
              s.planned = true;
              return;
            }
            if (pt.mode === 'post_rotation' && s.rotation) {
              s.rotation.active = false;
              s.rotation.completed = true;
            }
            if (tPos.jobId === 'hanh_chinh_cong') s.approvedBoundary = tPos.rank;
            applyPosition(l, tPos.jobId, tPos.rank, pt.mode === 'post_rotation' ? 'bổ nhiệm sau luân chuyển' : pt.mode === 'up' ? 'bổ nhiệm thăng chức' : 'điều động và bổ nhiệm', log);
          }
        };
      });

      // Cơ chế 4: Thi nâng ngạch chuyên môn / chuyên gia cao cấp (cho người muốn phát triển chuyên sâu hoặc đã đạt đỉnh ngạch)
      var nextGrade = (s.seniorGrade || 0) + 1;
      if (nextGrade <= 3) {
        var reqGradeTenure = nextGrade * 4;
        var reqGradeKpi = 52 + nextGrade * 6;
        var canGrade = (l.job.yrs || 0) >= reqGradeTenure && s.kpi.expertise >= reqGradeKpi && l.edu >= 5;
        out.push({
          k: 'senior_grade',
          l: 'Thi nâng ngạch chuyên môn: ' + SENIOR_GRADES[nextGrade] + ' (+12% phụ cấp hệ số lương chuyên gia)',
          why: canGrade ? true : 'Cần đại học, ' + reqGradeTenure + ' năm công tác và KPI chuyên môn ≥ ' + reqGradeKpi,
          run: function (l, r, log) {
            if (!canGrade) return;
            s.seniorGrade = nextGrade;
            s.kpi.expertise = U.clamp(s.kpi.expertise + 4, 20, 100);
            s.kpi.credibility = U.clamp(s.kpi.credibility + 3, 20, 100);
            updateKpiOverall(l, s);
            recordHistory(l, 'nâng ngạch chuyên môn', E.jobTitle(l), SENIOR_GRADES[nextGrade], posOf(l) && posOf(l).agency);
            log('Bạn vượt qua kỳ thi nâng ngạch công chức/viên chức, được bổ nhiệm vào ngạch ' + SENIOR_GRADES[nextGrade] + ' và hưởng hệ số lương chuyên gia cao hơn.', 'big');
          }
        });
      }
      return out;
    }, 18, 'Công vụ & quản lý');

    // Menu 4: Quy hoạch cán bộ, lý luận chính trị & con đường vào Tỉnh ủy (stateParty174)
    X.menu('stateParty174', 'Quy hoạch cán bộ, lý luận chính trị & Tỉnh ủy', function (l) {
      return isVNState(l) ? true : 'Chỉ áp dụng cho cán bộ, công chức, viên chức khu vực nhà nước tại Việt Nam';
    }, function (l) {
      var s = syncState(l), effLv = Math.max(levelOf(l), s.peakLevel || 1);
      var lines = [
        '• Đảng tịch: ' + (partyMember(l) ? 'Đảng viên ĐCSVN' : 'Chưa kết nạp Đảng') + ' · Lý luận chính trị: ' + THEORY_NAMES[s.theory],
        '• Quy hoạch cán bộ: ' + (s.planned ? 'Đã nằm trong quy hoạch chức danh lãnh đạo, quản lý' : 'Chưa vào quy hoạch'),
        '• Cấp ủy hiện tại: ' + (s.provincialParty ? PROVINCIAL_PARTY_ROLES[s.provincialParty - 1].title : 'Chưa tham gia Tỉnh ủy / Trung ương'),
        '\nĐIỀU KIỆN TIẾP CẬN TỈNH ỦY & TRUNG ƯƠNG:'
      ];
      PROVINCIAL_PARTY_ROLES.forEach(function (rDef) {
        var chk = checkPartyRole(l, rDef);
        var mark = s.provincialParty >= rDef.lv ? '★ [Đã đạt]' : chk.ok ? '✔ [Đủ điều kiện ứng cử/cơ cấu]' : '○ [Chưa đủ ĐK]';
        lines.push(mark + ' ' + rDef.title + (s.provincialParty >= rDef.lv ? '' : chk.ok ? '' : ' — ' + chk.missing.join(', ')));
      });
      return lines.join('\n');
    }, function (l) {
      var s = syncState(l);
      var out = [];

      // 1. Kết nạp Đảng nếu chưa là Đảng viên
      if (!partyMember(l)) {
        var canJoinParty = (l.record || 0) === 0 && !(l.flags && l.flags.dirty) && (l.job.yrs || 0) >= 1 && s.kpi.overall >= 55;
        out.push({
          k: 'join_party',
          l: 'Bồi dưỡng nhận thức về Đảng và xét kết nạp Đảng viên',
          why: canJoinParty ? true : 'Cần ít nhất 1 năm công tác tốt (KPI ≥ 55) và lý lịch trong sạch',
          run: function (l, r, log) {
            if (!canJoinParty) return;
            grantPartyMember(l);
            s.kpi.credibility = U.clamp(s.kpi.credibility + 4, 20, 100);
            updateKpiOverall(l, s);
            recordHistory(l, 'kết nạp Đảng', E.jobTitle(l), 'Đảng viên ĐCSVN', posOf(l) && posOf(l).agency);
            log('Sau thời gian phấn đấu và thử thách tại chi bộ cơ quan, bạn được kết nạp vào Đảng Cộng sản Việt Nam.', 'big');
          }
        });
      }

      // 2. Học Sơ cấp / Trung cấp / Cao cấp lý luận chính trị
      if (s.theory < 3) {
        var nextTh = s.theory + 1;
        var reqLvForTh = nextTh === 1 ? 1 : nextTh === 2 ? 2 : 4;
        var canStudyTh = partyMember(l) && Math.max(levelOf(l), s.peakLevel || 1) >= reqLvForTh && s.theoryAt !== l.age;
        out.push({
          k: 'study_theory',
          l: 'Đi học lớp ' + THEORY_NAMES[nextTh] + (nextTh === 3 ? ' tại Học viện Chính trị quốc gia Hồ Chí Minh' : ' tại Trường Chính trị tỉnh'),
          why: canStudyTh ? true : (!partyMember(l) ? 'Cần là Đảng viên' : s.theoryAt === l.age ? 'Đã tham gia khóa bồi dưỡng năm nay' : 'Cần giữ vị trí từ Bậc ' + reqLvForTh + ' trở lên'),
          run: function (l, r, log) {
            if (!canStudyTh) return;
            s.theory = nextTh;
            s.theoryAt = l.age;
            if (!l.flags.civic118) l.flags.civic118 = { trust: 0, completed: 0, training: 0, role: null, level: -1 };
            l.flags.civic118.training = Math.max(l.flags.civic118.training || 0, nextTh);
            s.kpi.expertise = U.clamp(s.kpi.expertise + 2, 20, 100);
            s.kpi.management = U.clamp(s.kpi.management + 3, 20, 100);
            updateKpiOverall(l, s);
            H.fx(l, { kno: 2 });
            log('Bạn hoàn thành chương trình và nhận bằng ' + THEORY_NAMES[nextTh] + ', đủ tiêu chuẩn lý luận chính trị cho các chức danh lãnh đạo, cấp ủy cao hơn.', 'good');
          }
        });
      }

      // 3. Xét đưa vào quy hoạch cán bộ lãnh đạo, quản lý
      if (!s.planned) {
        var canPlan = partyMember(l) && s.theory >= 1 && s.kpi.overall >= 64 && (l.job.yrs || 0) >= 2;
        out.push({
          k: 'register_planning',
          l: 'Đề nghị xét bổ sung vào quy hoạch cán bộ lãnh đạo, quản lý và cấp ủy',
          why: canPlan ? true : 'Cần là Đảng viên, có trình độ lý luận chính trị, ≥ 2 năm công tác và KPI ≥ 64/100',
          run: function (l, r, log) {
            if (!canPlan) return;
            s.planned = true;
            s.plannedLevel = Math.max(levelOf(l) + 2, 6);
            s.kpi.credibility = U.clamp(s.kpi.credibility + 4, 20, 100);
            updateKpiOverall(l, s);
            recordHistory(l, 'quy hoạch cán bộ', E.jobTitle(l), 'Quy hoạch lãnh đạo & cấp ủy', posOf(l) && posOf(l).agency);
            log('Hội nghị cán bộ chủ chốt bỏ phiếu tín nhiệm cao, đưa bạn vào danh sách quy hoạch chức danh lãnh đạo, quản lý và cấp ủy nhiệm kỳ kế tiếp.', 'big');
          }
        });
      }

      // 4. Các bước tham gia Tỉnh ủy & Trung ương (Tỉnh ủy viên -> Ủy viên BTV Tỉnh ủy -> Phó Bí thư -> Bí thư Tỉnh ủy -> Ủy viên TW -> Bộ Chính trị)
      PROVINCIAL_PARTY_ROLES.forEach(function (rDef) {
        if (s.provincialParty >= rDef.lv) return;
        var chk = checkPartyRole(l, rDef);
        out.push({
          k: 'party_role_' + rDef.lv,
          l: 'Ứng cử / Nhận phân công: ' + rDef.title,
          why: chk.ok ? true : 'Chưa đủ điều kiện: ' + chk.missing.join('; '),
          run: function (l, r, log) {
            if (!chk.ok) return;
            s.provincialParty = rDef.lv;
            s.planned = true;
            // Đồng bộ với CIVIC118 để các hệ thống cũ (leadership115, civic118) nhận diện đầy đủ
            if (!l.flags.civic118) l.flags.civic118 = { trust: 0, completed: 0, training: s.theory, role: null, level: -1 };
            var c118 = l.flags.civic118;
            c118.training = Math.max(c118.training || 0, s.theory);
            if (rDef.civicIdx != null && C118 && C118.roles && C118.roles[rDef.civicIdx]) {
              var cr = C118.roles[rDef.civicIdx];
              c118.trust = Math.max(c118.trust || 0, cr.trust);
              c118.completed = Math.max(c118.completed || 0, cr.work);
              c118.level = Math.max(c118.level == null ? -1 : c118.level, rDef.civicIdx);
              c118.role = cr.name;
              c118.party = { level: rDef.civicIdx, name: cr.name, since: l.age, until: l.age + 5 };
              c118.roleAt = l.age;
            }
            if (rDef.targetJob && rDef.targetRank != null) {
              var targetPos = posOf(l, rDef.targetJob, rDef.targetRank);
              if ((targetPos && levelOf(l) < targetPos.level) || E.resolveJob(l.job.id) === 'dang_uy') {
                applyPosition(l, rDef.targetJob, rDef.targetRank, 'bầu giữ chức vụ Thường trực Tỉnh ủy', log);
                return;
              }
            }
            recordHistory(l, 'cơ cấu cấp ủy', E.jobTitle(l), rDef.title, 'Tỉnh ủy / Trung ương Đảng');
            log('Đại hội / Hội nghị Ban Chấp hành tín nhiệm bầu và chuẩn y bạn giữ trọng trách: ' + rDef.title + ' (đồng thời công tác tại ' + E.jobTitle(l) + ').', 'big');
          }
        });
      });

      return out;
    }, 18, 'Công vụ & quản lý');
  }

  // ===================================================================
  // 9. SỰ KIỆN SỰ NGHIỆP NHÀ NƯỚC NHIỀU NĂM (7 CHUỖI SỰ KIỆN)
  // ===================================================================
  if (C && C.incident && C.event) {
    // Sự kiện 1: Đợt rà soát, bổ sung quy hoạch cán bộ lãnh đạo, quản lý
    C.incident('state174_planning', 'Rà soát, bổ sung quy hoạch cán bộ nhiệm kỳ mới', function (l) {
      return isVNState(l) && l.age >= 28 && l.age <= 56 && !state(l).planned && state(l).kpi.overall >= 60;
    }, function (l) {
      return 'Cơ quan tổ chức hội nghị lấy phiếu tín nhiệm bổ sung quy hoạch chức danh lãnh đạo, quản lý nhiệm kỳ tới cho vị trí kế cận của ' + E.jobTitle(l) + '.';
    }, function (l) {
      return [
        { k: 'propose', l: 'Trình chương trình hành động cải cách và đăng ký vào diện quy hoạch', run: function (l, r, log) {
          var s = syncState(l);
          grantPartyMember(l);
          s.planned = true;
          s.theory = Math.max(s.theory, 2);
          s.kpi.credibility = U.clamp(s.kpi.credibility + 5, 20, 100);
          updateKpiOverall(l, s);
          log('Chương trình hành động thực tế giúp bạn đạt số phiếu tín nhiệm cao, chính thức được đưa vào quy hoạch cán bộ lãnh đạo, quản lý.', 'big');
        } },
        { k: 'steady', l: 'Tập trung làm tốt chuyên môn hiện tại, chưa nhận quy hoạch quản lý', run: function (l, r, log) {
          var s = syncState(l);
          s.kpi.expertise = U.clamp(s.kpi.expertise + 4, 20, 100);
          updateKpiOverall(l, s);
          log('Bạn ưu tiên chiều sâu nghiệp vụ chuyên môn và giữ uy tín với đồng nghiệp.', 'neutral');
        } }
      ];
    });
    C.event('state174_planning', function (l) { return isVNState(l) && l.age >= 28 && l.age <= 55 && !state(l).planned && state(l).kpi.overall >= 62; }, 0.08);

    // Sự kiện 2: Quyết định luân chuyển cán bộ về cơ sở (Giám đốc sở / Trưởng phòng / Vụ trưởng -> Chủ tịch / Bí thư xã phường trọng điểm)
    C.incident('state174_rotation', 'Chủ trương luân chuyển cán bộ về địa phương trọng điểm', function (l) {
      return isVNState(l) && levelOf(l) >= 4 && levelOf(l) <= 6 && (!state(l).rotation || !state(l).rotation.active);
    }, function (l) {
      return 'Ban Thường vụ có chủ trương luân chuyển một số cán bộ cấp sở, ngành (' + E.jobTitle(l) + ') về giữ chức Chủ tịch UBND hoặc Bí thư Đảng ủy xã/phường trọng điểm trong 2 năm để rèn luyện toàn diện trước khi đề bạt lên cấp cao hơn.';
    }, function (l) {
      return [
        { k: 'accept_rot', l: 'Nhận quyết định luân chuyển về cơ sở 2 năm (bảo lưu bậc ' + levelOf(l) + ' để xét bổ nhiệm vượt cấp)', run: function (l, r, log) {
          var s = syncState(l);
          var beforeTitle = E.jobTitle(l), beforeJob = E.resolveJob(l.job.id), beforeRk = l.job.rank || 0, beforeLv = levelOf(l);
          s.peakLevel = Math.max(s.peakLevel || 1, beforeLv);
          s.peakTitle = beforeTitle;
          s.planned = true;
          s.rotation = { active: true, fromJob: beforeJob, fromRank: beforeRk, fromTitle: beforeTitle, fromLevel: beforeLv, startAge: l.age, minYears: 2, completed: false };
          applyPosition(l, 'hanh_chinh_cong', 4, 'luân chuyển cán bộ cơ sở', log,
            'Bạn nhận quyết định luân chuyển từ vị trí ' + beforeTitle + ' về giữ chức Chủ tịch UBND xã/phường trọng điểm');
        } },
        { k: 'stay_agency', l: 'Xin ở lại cơ quan hiện tại để hoàn thành đề án chuyên môn', run: function (l, r, log) {
          var s = syncState(l);
          s.kpi.expertise = U.clamp(s.kpi.expertise + 3, 20, 100);
          updateKpiOverall(l, s);
          log('Ban Tổ chức ghi nhận nguyện vọng và giao bạn tiếp tục phụ trách công tác chuyên môn tại đơn vị.', 'neutral');
        } }
      ];
    });
    C.event('state174_rotation', function (l) { return isVNState(l) && l.age >= 33 && l.age <= 52 && levelOf(l) >= 4 && levelOf(l) <= 6 && (!state(l).rotation || !state(l).rotation.active); }, 0.05);

    // Sự kiện 3: Đại hội Đảng bộ cấp tỉnh — cơ hội bầu vào Tỉnh ủy
    C.incident('state174_provincial_party', 'Nhân sự Đại hội Đảng bộ cấp tỉnh nhiệm kỳ mới', function (l) {
      return isVNState(l) && Math.max(levelOf(l), state(l).peakLevel || 1) >= 4 && state(l).provincialParty < 2;
    }, function (l) {
      return 'Chuẩn bị nhân sự Đại hội Đảng bộ tỉnh nhiệm kỳ mới, tiểu ban nhân sự xem xét giới thiệu cán bộ tiêu biểu từ khối ' + (posOf(l) ? posOf(l).branchName : 'nhà nước') + ' tham gia Ban Chấp hành Đảng bộ tỉnh (Tỉnh ủy viên).';
    }, function (l) {
      return [
        { k: 'join_tinh_uy', l: 'Hoàn thiện hồ sơ lý luận chính trị và nhận đề cử vào Tỉnh ủy', run: function (l, r, log) {
          var s = syncState(l);
          grantPartyMember(l);
          s.theory = Math.max(s.theory, 2);
          s.planned = true;
          s.provincialParty = Math.max(s.provincialParty, levelOf(l) >= 6 ? 2 : 1);
          var roleTitle = PROVINCIAL_PARTY_ROLES[s.provincialParty - 1].title;
          if (!l.flags.civic118) l.flags.civic118 = { trust: 20, completed: 4, training: s.theory, role: roleTitle, level: s.provincialParty - 1 };
          else { l.flags.civic118.role = roleTitle; l.flags.civic118.level = Math.max(l.flags.civic118.level || 0, s.provincialParty - 1); }
          recordHistory(l, 'trúng cử cấp ủy', E.jobTitle(l), roleTitle, 'Tỉnh ủy');
          log('Tại Đại hội Đảng bộ tỉnh, bạn trúng cử ' + roleTitle + ' với số phiếu tín nhiệm cao.', 'big');
        } },
        { k: 'focus_exec', l: 'Tập trung điều hành chuyên môn tại đơn vị', run: function (l, r, log) {
          var s = syncState(l);
          s.kpi.management = U.clamp(s.kpi.management + 3, 20, 100);
          updateKpiOverall(l, s);
          log('Bạn tiếp tục tập trung toàn lực cho công tác quản lý chuyên ngành.', 'neutral');
        } }
      ];
    });
    C.event('state174_provincial_party', function (l) { return isVNState(l) && l.age >= 35 && Math.max(levelOf(l), state(l).peakLevel || 1) >= 5 && state(l).provincialParty < 2; }, 0.06);

    // Sự kiện 4: Thanh tra, kiểm tra công vụ & giải trình trách nhiệm người đứng đầu
    C.incident('state174_inspection', 'Đoàn thanh tra, kiểm tra công vụ liên ngành', function (l) {
      return isVNState(l) && (l.job.yrs || 0) >= 2;
    }, function (l) {
      return 'Đoàn kiểm tra công vụ và tài chính công làm việc tại ' + (posOf(l) ? posOf(l).agency : 'đơn vị') + ' về tiến độ giải quyết hồ sơ, quy trình thẩm định và trách nhiệm công vụ.';
    }, function (l) {
      return [
        { k: 'transparent', l: 'Cung cấp toàn bộ hồ sơ minh bạch, nhận trách nhiệm chấn chỉnh khâu chậm trễ', run: function (l, r, log) {
          var s = syncState(l);
          s.kpi.integrity = U.clamp(s.kpi.integrity + 5, 10, 100);
          s.kpi.credibility = U.clamp(s.kpi.credibility + 4, 20, 100);
          updateKpiOverall(l, s);
          log('Đoàn kiểm tra đánh giá cao tính minh bạch và liêm chính của bạn, ghi nhận đơn vị thực hiện đúng quy định pháp luật.', 'good');
        } },
        { k: 'defend_proc', l: 'Giải trình chi tiết các vướng mắc do quy định chồng chéo và kiến nghị sửa đổi', run: function (l, r, log) {
          var s = syncState(l);
          s.kpi.expertise = U.clamp(s.kpi.expertise + 4, 20, 100);
          s.kpi.coordination = U.clamp(s.kpi.coordination + 4, 20, 100);
          updateKpiOverall(l, s);
          log('Báo cáo giải trình có căn cứ pháp lý chặt chẽ của bạn được đoàn thanh tra tiếp thu để kiến nghị hoàn thiện cơ chế.', 'good');
        } }
      ];
    });
    C.event('state174_inspection', function (l) { return isVNState(l) && l.age >= 26 && (l.job.yrs || 0) >= 3; }, 0.05);

    // Sự kiện 5: Điều động cán bộ giữa Bộ/Ngành Trung ương, NHNN và địa phương
    C.incident('state174_central_secondment', 'Điều động, biệt phái cán bộ giữa Trung ương và địa phương', function (l) {
      return isVNState(l) && levelOf(l) >= 5 && levelOf(l) <= 7;
    }, function (l) {
      var p = posOf(l);
      var atCentral = p && (p.branch === 'trung_uong' || p.branch === 'ngan_hang_nn');
      return atCentral
        ? 'Ban Tổ chức và lãnh đạo Bộ/Ngành xem xét điều động bạn về giữ chức vụ lãnh đạo tại địa phương (Phó Chủ tịch UBND tỉnh / Phó Bí thư Tỉnh ủy) để kết hợp kinh nghiệm vĩ mô với thực tiễn.'
        : 'Bộ chủ quản và Văn phòng Chính phủ có đợt tuyển chọn, điều động cán bộ lãnh đạo địa phương (' + E.jobTitle(l) + ') về giữ chức Vụ trưởng / Cục trưởng hoặc Thứ trưởng tại Trung ương.';
    }, function (l) {
      var p = posOf(l);
      var atCentral = p && (p.branch === 'trung_uong' || p.branch === 'ngan_hang_nn');
      return [
        { k: 'accept_sec', l: atCentral ? 'Nhận điều động về lãnh đạo UBND tỉnh / Tỉnh ủy' : 'Nhận điều động về công tác tại Bộ / Cơ quan Trung ương', run: function (l, r, log) {
          var s = syncState(l);
          grantPartyMember(l);
          s.theory = Math.max(s.theory, 3);
          s.planned = true;
          var lv = Math.max(levelOf(l), s.peakLevel || 5);
          if (atCentral) {
            applyPosition(l, 'hanh_chinh_cong', lv >= 7 ? 8 : 7, 'điều động Trung ương về địa phương', log);
          } else {
            applyPosition(l, 'trung_uong', lv >= 6 ? 4 : 3, 'điều động địa phương về Trung ương', log);
          }
        } },
        { k: 'remain', l: 'Tiếp tục gắn bó với cơ quan hiện tại', run: function (l, r, log) {
          var s = syncState(l);
          s.kpi.credibility = U.clamp(s.kpi.credibility + 3, 20, 100);
          updateKpiOverall(l, s);
          log('Bạn tiếp tục công tác tại đơn vị hiện tại và giữ vững tín nhiệm.', 'neutral');
        } }
      ];
    });
    C.event('state174_central_secondment', function (l) { return isVNState(l) && l.age >= 38 && levelOf(l) >= 5 && levelOf(l) <= 7; }, 0.045);
  }

  // ===================================================================
  // 10. HOOK HẰNG NĂM, PHỤ CẤP NGẠCH CHUYÊN GIA, TƯƠNG THÍCH BẢN LƯU & PROFILE UI
  // ===================================================================
  var prevCareerYear = E.careerYear;
  E.careerYear = function (l, r, log, focus) {
    if (l && l.alive && l.job) syncState(l);
    var inc = prevCareerYear.apply(this, arguments);
    if (typeof inc === 'number' && inc > 0 && isVNState(l)) {
      var s = syncState(l);
      // Phụ cấp ngạch Chuyên viên chính / Chuyên viên cao cấp / Chuyên gia cao cấp (+12% mỗi bậc) và phụ cấp hoàn thành xuất sắc nhiệm vụ
      var mult = 1 + (s.seniorGrade || 0) * 0.12 + (s.kpi.overall >= 82 ? 0.06 : s.kpi.overall >= 68 ? 0.03 : 0);
      inc *= mult;
    }
    return inc;
  };

  E.HOOKS.year.push(function (l, r, log) {
    if (!l || !l.alive || !isVNState(l)) return;
    var s = syncState(l);
    // Tiến triển KPI tự nhiên hằng năm theo quá trình công tác
    var focusGain = l.focus === 'work' ? 2 : 1;
    s.kpi.expertise = U.clamp(s.kpi.expertise + focusGain, 20, 100);
    if (levelOf(l) >= 3) s.kpi.management = U.clamp(s.kpi.management + 1, 20, 100);
    s.kpi.coordination = U.clamp(s.kpi.coordination + 1, 20, 100);
    updateKpiOverall(l, s);

    // Thông báo khi hoàn thành đủ 2 năm luân chuyển cơ sở
    if (s.rotation && s.rotation.active && !s.rotation.notifiedDone && (l.age - s.rotation.startAge >= (s.rotation.minYears || 2))) {
      s.rotation.completed = true;
      s.rotation.notifiedDone = true;
      if (log) {
        log('Bạn đã hoàn thành ' + (l.age - s.rotation.startAge) + ' năm luân chuyển thực tiễn tại cơ sở (' + E.jobTitle(l) + '). Hồ sơ của bạn đã đủ điều kiện xét bổ nhiệm lên chức vụ cao hơn vị trí trước khi luân chuyển (' + s.rotation.fromTitle + '). Mở "Bổ nhiệm, điều động, luân chuyển" để chọn vị trí tiếp theo.', 'big');
      }
    }
  });

  var prevMigrate = E.migrateExt;
  E.migrateExt = function (l) {
    if (prevMigrate) prevMigrate(l);
    if (l && l.flags) syncState(l);
  };

  var prevProfile = E.profile;
  E.profile = function (l) {
    var a = prevProfile.apply(this, arguments);
    if (l && isVNState(l)) {
      var s = syncState(l), p = posOf(l);
      a.jobInfo.push('Cơ quan & ngạch: ' + (p ? p.agency : 'Nhà nước') + ' · Cấp bậc ' + (p ? p.level : 1) + '/10' + (s.seniorGrade ? ' · ' + SENIOR_GRADES[s.seniorGrade] : ''));
      a.jobInfo.push('KPI công vụ: ' + s.kpi.overall + '/100 (' + s.rating + ') · Lý luận: ' + THEORY_NAMES[s.theory] + (s.planned ? ' · Đã quy hoạch' : ''));
      if (s.provincialParty) a.jobInfo.push('Chức vụ cấp ủy: ' + PROVINCIAL_PARTY_ROLES[s.provincialParty - 1].title);
      if (s.rotation && s.rotation.active) a.jobInfo.push('Luân chuyển cơ sở: từ ' + s.rotation.fromTitle + ' (Bậc ' + s.rotation.fromLevel + ' · ' + (l.age - s.rotation.startAge) + '/' + s.rotation.minYears + ' năm)');
      var paths = availablePathways(l);
      if (paths.length) {
        a.jobInfo.push('Lộ trình tiếp theo: ' + paths.slice(0, 3).map(function (pt) { return pt.pos.title + (pt.check.ok ? ' [Đủ ĐK]' : ' [Chưa đủ ĐK]'); }).join(', '));
      }
    }
    return a;
  };

  E.STATE174 = {
    BRANCHES: BRANCHES,
    THEORY_NAMES: THEORY_NAMES,
    SENIOR_GRADES: SENIOR_GRADES,
    PROVINCIAL_PARTY_ROLES: PROVINCIAL_PARTY_ROLES,
    POSITIONS: POSITIONS,
    BY_JOB_RANK: BY_JOB_RANK,
    isVNState: isVNState,
    state: state,
    syncState: syncState,
    posOf: posOf,
    levelOf: levelOf,
    partyMember: partyMember,
    grantPartyMember: grantPartyMember,
    checkTargetRequirements: checkTargetRequirements,
    checkPartyRole: checkPartyRole,
    availablePathways: availablePathways,
    applyPosition: applyPosition,
    statusSummaryText: statusSummaryText
  };
})(globalThis.G);
