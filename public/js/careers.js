/* Một Đời — nghề nghiệp, thang bậc thăng tiến, thu nhập, danh tiếng, thi đấu.
   Thu nhập khai báo theo "triệu đồng/tháng ở Việt Nam" cho từng bậc; quốc gia khác quy đổi theo mức sống tương đối. */
(function (G) {
  'use strict';
  var U = G.U, E = G.E, H = E.H, W = G.W;
  function isVN(l) { return l.country === 'VN'; }

  var CAT = {
    poor: 'Lao động tự do', worker: 'Công nhân & thợ', biz: 'Buôn bán & kinh doanh', sale: 'Bán hàng (sale)', office: 'Văn phòng',
    med: 'Y tế', uniform: 'Công an & quân đội', edu: 'Giáo dục', media: 'Báo chí – truyền hình', show: 'Showbiz', creator: 'Sáng tạo nội dung',
    sport: 'Thể thao', esport: 'Esports', chess: 'Cờ', beauty: 'Làm đẹp & thời trang', crime: 'Phi pháp', farm: 'Nông nghiệp', other: 'Khác',
    state: 'Cơ quan nhà nước', free: 'Freelancer (làm tự do)', service: 'Dịch vụ, du lịch & hàng không'
  };
  var POLICE = ['Thiếu úy', 'Trung úy', 'Thượng úy', 'Đại úy', 'Thiếu tá', 'Trung tá', 'Thượng tá', 'Đại tá', 'Thiếu tướng'];
  // [id, danh xưng theo bậc, thu nhập (triệu/tháng) theo bậc, số năm tối thiểu mỗi bậc, tuỳ chọn]
  var D = [
    // --- lao động tự do / phổ thông ---
    ['an_xin', ['người ăn xin'], [1.5], [], { cat: 'poor', hidden: 1, sec: 'inf' }],
    ['ve_chai', ['người nhặt ve chai', 'chủ vựa ve chai'], [3.5, 14], [6], { cat: 'poor', sec: 'inf', w: 0.6 }],
    ['ve_so', ['người bán vé số dạo'], [4], [], { cat: 'poor', sec: 'inf', vn: 1, w: 0.6 }],
    ['ban_rong', ['bán hàng rong', 'chủ sạp chợ'], [5, 12], [5], { cat: 'poor', sec: 'inf', w: 1 }],
    ['xe_om', ['xe ôm truyền thống'], [7], [], { cat: 'poor', sec: 'inf', sex: [1.5, 0.1], haz: [0.03, 0.002, 'tai nạn giao thông'] }],
    ['tx_cn', ['tài xế xe máy công nghệ', 'tài xế ô tô công nghệ'], [9, 15], [3], { cat: 'poor', sec: 'inf', edu: 2, sex: [1.6, 0.4], haz: [0.03, 0.0015, 'tai nạn giao thông'], tag: 'driver' }],
    ['shipper', ['shipper', 'trưởng nhóm giao hàng'], [10, 14], [3], { cat: 'poor', sec: 'inf', edu: 1, sex: [1.4, 0.5], haz: [0.03, 0.0012, 'tai nạn giao thông'], tag: 'driver' }],
    ['phu_ho', ['phụ hồ', 'thợ hồ', 'cai thầu xây dựng', 'chủ thầu xây dựng'], [8.5, 12, 22, 50], [2, 5, 6], { cat: 'poor', sec: 'inf', sex: [1.6, 0.3], haz: [0.03, 0.002, 'tai nạn lao động'] }],
    ['giup_viec', ['người giúp việc'], [8.5], [], { cat: 'poor', sec: 'inf', sex: [0.05, 1.3] }],
    ['bao_ve', ['nhân viên bảo vệ', 'đội trưởng bảo vệ'], [8, 11], [5], { cat: 'poor', sec: 'formal', edu: 1, sex: [1.3, 0.2] }],
    ['phuc_vu', ['phục vụ quán ăn', 'quản lý nhà hàng'], [7, 15], [4], { cat: 'poor', sec: 'inf', edu: 1 }],
    ['nong', ['làm nông', 'chủ trang trại'], [5, 18], [10], { cat: 'farm', sec: 'farm', rural: 1 }],
    ['ngu_dan', ['bạn thuyền đánh cá', 'thuyền trưởng', 'chủ tàu cá'], [7, 12, 30], [4, 6], { cat: 'farm', sec: 'inf', coast: 1, sex: [1.5, 0.05], haz: [0.03, 0.004, 'bão biển, mất tích ngoài khơi'] }],
    ['phu_giup', ['phụ giúp gia đình'], [2], [], { cat: 'other', hidden: 1, sec: 'inf' }],
    // --- công nhân & thợ ---
    ['cong_nhan', ['công nhân', 'tổ trưởng', 'chuyền trưởng', 'quản đốc'], [9.5, 11.5, 14, 20], [3, 3, 5], { cat: 'worker', sec: 'formal', edu: 1, w: 2.2 }],
    ['tho_may', ['thợ may', 'chủ tiệm may'], [9, 15], [6], { cat: 'worker', sec: 'inf', edu: 1, sex: [0.4, 1.3] }],
    ['tho_dien', ['thợ điện', 'kỹ thuật viên điện', 'đội trưởng kỹ thuật'], [10, 14, 20], [3, 5], { cat: 'worker', sec: 'formal', edu: 4, sex: [1.5, 0.2] }],
    ['tho_sua_xe', ['thợ phụ sửa xe', 'thợ sửa xe', 'chủ tiệm sửa xe'], [5, 10, 22], [2, 5], { cat: 'worker', sec: 'inf', edu: 1, sex: [1.6, 0.1] }],
    ['tho_han', ['thợ hàn', 'thợ hàn bậc cao'], [11, 17], [5], { cat: 'worker', sec: 'formal', edu: 4, sex: [1.5, 0.1], haz: [0.02, 0.001, 'tai nạn lao động'] }],
    ['ky_thuat_vien', ['kỹ thuật viên', 'trưởng ca', 'trưởng bộ phận kỹ thuật'], [10, 15, 25], [3, 5], { cat: 'worker', sec: 'formal', edu: 4 }],
    ['dau_bep', ['phụ bếp', 'đầu bếp', 'bếp trưởng'], [6, 12, 25], [2, 6], { cat: 'worker', sec: 'inf', edu: 1 }],
    ['quan_net', ['nhân viên quán net', 'chủ quán net'], [5, 15], [5], { cat: 'worker', sec: 'inf', edu: 1, talent: 'game', w: 0.6 }],
    ['tho_moc', ['thợ mộc', 'thợ mộc lành nghề', 'chủ xưởng gỗ'], [9, 15, 40], [3, 7], { cat: 'worker', sec: 'inf', edu: 1, sex: [1.5, 0.1], sigma: 0.25 }],
    ['tai_xe_tai', ['phụ xe', 'tài xế xe tải', 'tài xế container', 'chủ xe tải'], [7, 13, 20, 35], [2, 4, 6], { cat: 'worker', sec: 'inf', edu: 1, sex: [1.6, 0.05], haz: [0.03, 0.0018, 'tai nạn giao thông'], tag: 'driver' }],
    ['tho_mo', ['thợ lò', 'tổ trưởng thợ lò', 'quản đốc phân xưởng mỏ'], [15, 20, 28], [4, 6], { cat: 'worker', sec: 'formal', edu: 1, sex: [1.6, 0.02], w: 0.35, haz: [0.04, 0.0015, 'sập lò khi đang làm việc dưới hầm mỏ'] }],
    ['gian_khoan', ['công nhân giàn khoan', 'kỹ thuật viên giàn khoan', 'trưởng ca giàn khoan'], [25, 45, 75], [3, 5], { cat: 'worker', sec: 'formal', edu: 4, sex: [1.6, 0.1], w: 0.3, haz: [0.02, 0.0008, 'tai nạn trên giàn khoan ngoài khơi'] }],
    ['thuyen_vien', ['thủy thủ tàu viễn dương', 'sĩ quan boong', 'đại phó', 'thuyền trưởng tàu viễn dương'], [12, 30, 60, 110], [2, 4, 6], { cat: 'worker', sec: 'formal', edu: 4, sex: [1.6, 0.05], w: 0.35, haz: [0.02, 0.001, 'tai nạn hàng hải'] }],
    // --- làm đẹp & thời trang ---
    ['tho_toc', ['thợ phụ tiệm tóc', 'thợ làm tóc', 'chủ salon tóc'], [5, 12, 30], [2, 5], { cat: 'beauty', sec: 'inf', edu: 1 }],
    ['nail', ['thợ nail', 'thợ nail chính', 'chủ tiệm nail'], [6, 12, 25], [2, 5], { cat: 'beauty', sec: 'inf', edu: 1, sex: [0.3, 1.5] }],
    ['makeup', ['trợ lý makeup', 'makeup artist', 'makeup artist nổi tiếng'], [6, 15, 50], [2, 6], { cat: 'beauty', sec: 'inf', edu: 2, sex: [0.4, 1.6], talent: 'làm đẹp', soft: 1 }],
    ['stylist', ['trợ lý stylist', 'stylist', 'stylist cho người nổi tiếng'], [7, 18, 60], [2, 6], { cat: 'beauty', sec: 'inf', edu: 3, talent: 'làm đẹp', soft: 1 }],
    ['tk_thoi_trang', ['nhà thiết kế thời trang tập sự', 'nhà thiết kế thời trang', 'giám đốc sáng tạo thương hiệu'], [8, 20, 70], [3, 6], { cat: 'beauty', sec: 'inf', edu: 4, major: 'art', soft: 1, talent: 'làm đẹp' }],
    ['su_kien', ['nhân viên tổ chức sự kiện', 'trưởng nhóm sự kiện', 'chủ công ty sự kiện'], [8, 18, 50], [3, 6], { cat: 'beauty', sec: 'inf', edu: 3, sigma: 0.35 }],
    ['nhiep_anh', ['thợ chụp ảnh', 'nhiếp ảnh gia', 'nhiếp ảnh gia có tiếng'], [7, 15, 35], [3, 6], { cat: 'beauty', sec: 'inf', edu: 3, talent: 'hội họa', soft: 1 }],
    ['nguoi_mau', ['người mẫu ảnh', 'người mẫu sàn diễn', 'người mẫu có tiếng', 'người mẫu hạng A', 'siêu mẫu'], [7], [], { cat: 'beauty', sec: 'inf', edu: 2, fame: 1, talent: 'làm đẹp' }],
    ['barber', ['thợ cắt tóc nam', 'barber', 'chủ tiệm barber'], [6, 14, 30], [2, 5], { cat: 'beauty', sec: 'inf', edu: 1, sex: [1.4, 0.4] }],
    ['tho_xam', ['thợ xăm học việc', 'thợ xăm', 'nghệ sĩ xăm có tiếng'], [5, 15, 45], [2, 6], { cat: 'beauty', sec: 'inf', edu: 1, talent: 'hội họa', sigma: 0.35 }],
    ['spa', ['kỹ thuật viên spa', 'trưởng kỹ thuật spa', 'chủ spa'], [7, 12, 35], [3, 6], { cat: 'beauty', sec: 'inf', edu: 1, sex: [0.3, 1.5], sigma: 0.3 }],
    // --- buôn bán & kinh doanh (chủ kinh doanh thu nhập cao nhưng rủi ro) ---
    ['kd_online', ['bán hàng online', 'chủ shop online', 'chủ thương hiệu riêng'], [7, 22, 70], [2, 4], { cat: 'biz', sec: 'inf', edu: 2, sigma: 0.6, prod: ['nước hoa', 'mỹ phẩm', 'quần áo', 'đồ ăn vặt', 'phụ kiện điện thoại', 'nước hoa chiết'] }],
    ['kd_tap_hoa', ['chủ tạp hóa', 'chủ đại lý'], [12, 30], [6], { cat: 'biz', sec: 'inf', edu: 1, sigma: 0.25 }],
    ['kd_quan', ['chủ quán', 'chủ chuỗi quán'], [15, 70], [6], { cat: 'biz', sec: 'inf', edu: 1, sigma: 0.5, hidden: 1, prod: ['quán cà phê', 'quán nhậu', 'quán bún', 'tiệm trà sữa'] }],
    ['tiem_vang', ['nhân viên tiệm vàng', 'chủ tiệm vàng', 'chủ chuỗi tiệm vàng'], [8, 50, 150], [6, 8], { cat: 'biz', sec: 'inf', edu: 1, w: 0.2, sigma: 0.3, vn: 1 }],
    ['cam_do', ['nhân viên tiệm cầm đồ', 'chủ tiệm cầm đồ'], [8, 35], [5], { cat: 'biz', sec: 'inf', edu: 1, w: 0.25, sigma: 0.4 }],
    ['chu_xuong', ['chủ xưởng nhỏ', 'chủ nhà máy', 'chủ doanh nghiệp sản xuất lớn'], [30, 90, 250], [5, 8], { cat: 'biz', sec: 'inf', edu: 2, sigma: 0.6, hidden: 1, fail: 0.05, prod: ['xưởng may', 'xưởng gỗ', 'xưởng cơ khí', 'xưởng bao bì', 'xưởng chế biến nông sản'] }],
    ['kd_tu_do', ['kinh doanh tự do', 'chủ công ty nhỏ', 'giám đốc công ty', 'chủ tịch tập đoàn'], [18, 50, 150, 500], [3, 5, 8], { cat: 'biz', sec: 'inf', edu: 2, sigma: 0.7, hidden: 1, fail: 0.06, prod: ['nhựa gia dụng', 'vật liệu xây dựng', 'nông sản xuất khẩu', 'logistics', 'thời trang', 'nội thất', 'nước hoa', 'thiết bị điện'] }],
    // --- sale ---
    ['telesale', ['nhân viên telesale', 'trưởng nhóm telesale'], [7, 12], [3], { cat: 'sale', sec: 'formal', edu: 2, sigma: 0.3 }],
    ['sale_bh', ['tư vấn viên bảo hiểm', 'trưởng nhóm kinh doanh bảo hiểm', 'giám đốc khu vực'], [6, 20, 60], [3, 5], { cat: 'sale', sec: 'inf', edu: 3, sigma: 0.55 }],
    ['sale_bds', ['môi giới bất động sản', 'trưởng nhóm môi giới', 'giám đốc sàn bất động sản'], [6, 30, 100], [3, 5], { cat: 'sale', sec: 'inf', edu: 3, sigma: 0.8 }],
    ['sale_oto', ['tư vấn bán ô tô', 'trưởng phòng kinh doanh showroom'], [12, 35], [5], { cat: 'sale', sec: 'formal', edu: 3, sigma: 0.35 }],
    ['sale_mp', ['nhân viên bán mỹ phẩm', 'quản lý cửa hàng mỹ phẩm'], [7, 14], [4], { cat: 'sale', sec: 'formal', edu: 2, sex: [0.4, 1.5] }],
    ['sale_b2b', ['nhân viên kinh doanh', 'trưởng nhóm kinh doanh', 'trưởng phòng kinh doanh', 'giám đốc kinh doanh'], [10, 18, 35, 70], [2, 3, 4], { cat: 'sale', sec: 'formal', edu: 3, sigma: 0.35 }],
    // --- văn phòng ---
    ['van_phong', ['thực tập sinh', 'nhân viên văn phòng', 'trưởng nhóm', 'trưởng phòng', 'giám đốc'], [5, 11, 18, 30, 60], [1, 3, 4, 5], { cat: 'office', sec: 'formal', edu: 5 }],
    ['ke_toan', ['thực tập sinh kế toán', 'kế toán viên', 'kế toán tổng hợp', 'kế toán trưởng', 'giám đốc tài chính'], [5, 11, 16, 25, 60], [1, 3, 4, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'eco' }],
    ['ngan_hang', ['giao dịch viên ngân hàng', 'chuyên viên tín dụng', 'trưởng phòng ngân hàng', 'giám đốc chi nhánh ngân hàng'], [10, 16, 35, 70], [3, 4, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'eco' }],
    ['marketing', ['thực tập sinh marketing', 'chuyên viên marketing', 'trưởng phòng marketing', 'giám đốc marketing'], [5, 13, 30, 60], [1, 4, 5], { cat: 'office', sec: 'formal', edu: 5, majors: ['eco', 'art', 'law'] }],
    ['dev', ['thực tập sinh lập trình', 'lập trình viên', 'lập trình viên cấp cao', 'trưởng nhóm kỹ thuật', 'giám đốc công nghệ'], [5, 18, 38, 60, 100], [1, 3, 3, 5], { cat: 'office', sec: 'formal', edu: 5, major: 'it' }],
    ['ky_su', ['kỹ sư', 'kỹ sư chính', 'giám đốc dự án'], [12, 22, 45], [4, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'it' }],
    ['ky_su_xd', ['kỹ sư xây dựng', 'chỉ huy trưởng công trình', 'giám đốc dự án xây dựng'], [11, 22, 45], [4, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'it', haz: [0.01, 0.0002, 'tai nạn ở công trường'] }],
    ['ky_su_co_dien', ['kỹ sư cơ điện', 'kỹ sư trưởng cơ điện', 'giám đốc kỹ thuật nhà máy'], [12, 22, 45], [4, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'it' }],
    ['data', ['chuyên viên phân tích dữ liệu', 'chuyên gia dữ liệu cấp cao', 'trưởng nhóm dữ liệu', 'giám đốc dữ liệu'], [13, 25, 45, 80], [3, 4, 6], { cat: 'office', sec: 'formal', edu: 5, majors: ['it', 'eco'] }],
    ['nhan_su', ['nhân viên nhân sự', 'chuyên viên tuyển dụng', 'trưởng phòng nhân sự', 'giám đốc nhân sự'], [9, 15, 30, 60], [2, 4, 6], { cat: 'office', sec: 'formal', edu: 5, majors: ['eco', 'law', 'edu'], soft: 1 }],
    ['logistics', ['nhân viên xuất nhập khẩu', 'chuyên viên logistics', 'trưởng phòng logistics', 'giám đốc logistics'], [10, 16, 30, 60], [2, 4, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'eco' }],
    ['kien_truc', ['kiến trúc sư', 'kiến trúc sư chủ trì', 'giám đốc thiết kế'], [10, 20, 45], [4, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'art' }],
    ['thiet_ke', ['thiết kế đồ họa', 'thiết kế chính', 'giám đốc sáng tạo'], [9, 18, 40], [3, 6], { cat: 'office', sec: 'formal', edu: 4, majors: ['art', 'it'], talent: 'hội họa', soft: 1 }],
    ['luat_su', ['trợ lý luật sư', 'luật sư', 'luật sư thành viên', 'luật sư điều hành hãng luật'], [7, 20, 45, 90], [2, 5, 6], { cat: 'office', sec: 'formal', edu: 5, major: 'law' }],
    // --- cơ quan nhà nước: lương = hệ số × lương cơ sở 2,34 triệu + phụ cấp (đã gồm phụ cấp công vụ, thâm niên) ---
    ['cong_chuc', ['chuyên viên', 'phó phòng', 'trưởng phòng', 'phó giám đốc sở', 'giám đốc sở'], [8.5, 11, 14.5, 20, 28], [4, 5, 5, 6], { cat: 'state', sec: 'formal', edu: 5, promo: 0.25, loss: 0.004 }],
    ['vien_chuc', ['viên chức hạng III', 'viên chức hạng II', 'trưởng phòng đơn vị sự nghiệp', 'giám đốc trung tâm'], [8, 11, 15, 21], [4, 5, 6], { cat: 'state', sec: 'formal', edu: 5, promo: 0.25, loss: 0.004 }],
    ['can_bo_xa', ['công chức xã / phường', 'phó chủ tịch UBND xã / phường', 'chủ tịch UBND xã / phường', 'bí thư đảng ủy xã / phường'], [7.5, 9.5, 12, 14], [5, 5, 5], { cat: 'state', sec: 'formal', edu: 5, promo: 0.2, loss: 0.004, w: 1.2, vn: 1 }],
    ['thue', ['công chức thuế', 'kiểm soát viên thuế', 'đội trưởng thuế', 'trưởng thuế cơ sở', 'cục trưởng thuế'], [9, 13, 17, 23, 32], [3, 5, 6, 7], { cat: 'state', sec: 'formal', edu: 5, major: 'eco', promo: 0.22, loss: 0.003 }],
    ['hai_quan', ['nhân viên hải quan', 'kiểm tra viên hải quan', 'đội trưởng hải quan', 'chi cục trưởng hải quan', 'cục trưởng hải quan'], [10, 14, 19, 26, 35], [3, 5, 6, 7], { cat: 'state', sec: 'formal', edu: 5, majors: ['eco', 'law'], promo: 0.22, loss: 0.003 }],
    ['tham_phan', ['thư ký tòa án', 'thẩm phán sơ cấp', 'thẩm phán trung cấp', 'thẩm phán cao cấp', 'chánh án tòa án tỉnh'], [8, 13, 18, 25, 32], [3, 6, 7, 7], { cat: 'state', sec: 'formal', edu: 5, major: 'law', promo: 0.2, loss: 0.002 }],
    ['kiem_sat', ['kiểm tra viên viện kiểm sát', 'kiểm sát viên sơ cấp', 'kiểm sát viên trung cấp', 'kiểm sát viên cao cấp', 'viện trưởng VKSND tỉnh'], [8, 13, 18, 25, 32], [3, 6, 7, 7], { cat: 'state', sec: 'formal', edu: 5, major: 'law', promo: 0.2, loss: 0.002 }],
    ['ngoai_giao', ['tùy viên ngoại giao', 'bí thư thứ ba', 'bí thư thứ nhất', 'tham tán', 'đại sứ'], [10, 14, 22, 32, 50], [3, 4, 5, 7], { cat: 'state', sec: 'formal', edu: 5, majors: ['law', 'eco'], w: 0.3, promo: 0.2, loss: 0.002 }],
    ['qltt', ['kiểm soát viên thị trường', 'đội trưởng quản lý thị trường', 'chi cục trưởng quản lý thị trường'], [8, 12, 18], [5, 7], { cat: 'state', sec: 'formal', edu: 5, majors: ['eco', 'law'], loss: 0.003 }],
    ['kiem_toan', ['kiểm toán viên nhà nước', 'kiểm toán viên chính', 'kiểm toán viên cao cấp', 'kiểm toán trưởng'], [10, 15, 22, 32], [4, 6, 7], { cat: 'state', sec: 'formal', edu: 5, major: 'eco', loss: 0.002 }],
    ['kiem_lam', ['kiểm lâm viên', 'trạm trưởng kiểm lâm', 'hạt trưởng kiểm lâm'], [8, 11, 15], [5, 7], { cat: 'state', sec: 'formal', edu: 4, rural: 1, sex: [1.5, 0.3], haz: [0.02, 0.0005, 'bị lâm tặc tấn công khi tuần tra rừng'] }],
    ['dnnn', ['kỹ sư tập đoàn nhà nước', 'chuyên viên chính tập đoàn', 'trưởng ban tập đoàn', 'phó tổng giám đốc tập đoàn'], [15, 25, 40, 90], [3, 6, 8], { cat: 'state', sec: 'formal', edu: 5, majors: ['it', 'eco'], vn: 1, w: 0.6, loss: 0.005, prod: ['EVN', 'Viettel', 'PetroVietnam', 'VNPT', 'Vietnam Airlines', 'Vinacomin', 'Vietcombank'] }],
    ['nghien_cuu', ['nghiên cứu viên', 'nghiên cứu viên chính', 'phó giáo sư', 'giáo sư'], [10, 16, 25, 35], [4, 6, 6], { cat: 'edu', sec: 'formal', edu: 6 }],
    // --- y tế ---
    ['bac_si', ['bác sĩ thực hành', 'bác sĩ', 'bác sĩ chuyên khoa I', 'bác sĩ chuyên khoa II', 'trưởng khoa', 'giám đốc bệnh viện'], [6, 14, 22, 32, 45, 70], [2, 4, 4, 5, 6], { cat: 'med', sec: 'formal', edu: 5, major: 'med', loss: 0.005 }],
    ['dieu_duong', ['điều dưỡng hạng IV', 'điều dưỡng hạng III', 'điều dưỡng hạng II', 'điều dưỡng trưởng khoa', 'điều dưỡng trưởng bệnh viện'], [9, 11, 14, 18, 25], [3, 4, 5, 6], { cat: 'med', sec: 'formal', edu: 4, major: 'med', soft: 1, sex: [0.4, 1.4], loss: 0.005 }],
    ['duoc_si', ['dược sĩ', 'dược sĩ trưởng', 'chủ nhà thuốc'], [10, 18, 35], [4, 6], { cat: 'med', sec: 'formal', edu: 5, major: 'med' }],
    ['nha_si', ['nha sĩ', 'bác sĩ răng hàm mặt', 'chủ phòng khám nha khoa'], [15, 30, 80], [3, 6], { cat: 'med', sec: 'formal', edu: 5, major: 'med', sigma: 0.4 }],
    ['thu_y', ['bác sĩ thú y', 'bác sĩ thú y chính', 'chủ phòng khám thú y'], [9, 15, 35], [3, 6], { cat: 'med', sec: 'formal', edu: 5, major: 'med', sigma: 0.3 }],
    // --- công an & quân đội ---
    ['cong_an', POLICE, [9, 10, 11, 13, 15, 17, 20, 24, 35], [2, 3, 3, 4, 4, 4, 4, 6], { cat: 'uniform', sec: 'formal', edu: 99, hidden: 1, ladder: 1, loss: 0.003, haz: [0.02, 0.0008, 'hy sinh khi làm nhiệm vụ'] }],
    ['quan_doi', POLICE, [9, 10, 11, 13, 15, 17, 20, 24, 35], [2, 3, 3, 4, 4, 4, 4, 6], { cat: 'uniform', sec: 'formal', edu: 99, hidden: 1, ladder: 1, loss: 0.003, haz: [0.01, 0.0005, 'tai nạn khi huấn luyện'] }],
    // --- giáo dục ---
    ['giao_vien', ['giáo viên hạng III', 'giáo viên hạng II', 'giáo viên hạng I', 'tổ trưởng chuyên môn', 'phó hiệu trưởng', 'hiệu trưởng'], [8.5, 10.5, 13, 15, 18, 23], [3, 4, 3, 4, 5], { cat: 'edu', sec: 'formal', edu: 5, major: 'edu', loss: 0.005 }],
    ['giang_vien', ['giảng viên', 'giảng viên chính', 'phó giáo sư', 'giáo sư'], [10, 16, 25, 35], [5, 6, 6], { cat: 'edu', sec: 'formal', edu: 6 }],
    ['gia_su', ['gia sư', 'chủ trung tâm dạy thêm'], [6, 30], [5], { cat: 'edu', sec: 'inf', edu: 3, sigma: 0.4 }],
    ['gv_mam_non', ['giáo viên mầm non', 'tổ trưởng chuyên môn mầm non', 'hiệu trưởng trường mầm non'], [7.5, 9.5, 14], [4, 6], { cat: 'edu', sec: 'formal', edu: 4, major: 'edu', soft: 1, sex: [0.05, 1.6], loss: 0.005 }],
    ['pt_gym', ['huấn luyện viên cá nhân (PT)', 'PT cao cấp', 'chủ phòng gym'], [8, 18, 40], [3, 5], { cat: 'sport', sec: 'inf', edu: 2, w: 0.6, sigma: 0.35 }],
    // --- báo chí – truyền hình ---
    ['phong_vien', ['phóng viên', 'biên tập viên', 'trưởng ban', 'tổng biên tập'], [9, 15, 25, 45], [4, 6, 8], { cat: 'media', sec: 'formal', edu: 5, major: 'law' }],
    ['mc_tv', ['MC đài địa phương', 'MC truyền hình', 'MC nổi tiếng', 'nhà sản xuất chương trình'], [8, 15, 40, 50], [3, 5, 6], { cat: 'media', sec: 'formal', edu: 5, talent: 'ăn nói', majors: ['law', 'art'], soft: 1 }],
    ['dao_dien', ['trợ lý đạo diễn', 'đạo diễn', 'đạo diễn nổi tiếng'], [8, 20, 60], [4, 6], { cat: 'media', sec: 'inf', edu: 5, major: 'art', sigma: 0.5 }],
    // --- showbiz & sáng tạo nội dung (thu nhập theo danh tiếng) ---
    // danh xưng theo 5 hạng danh tiếng: <10 nghìn · 10 nghìn · 100 nghìn · 1 triệu · 10 triệu người hâm mộ
    ['ca_si', ['ca sĩ hát đám cưới, phòng trà', 'ca sĩ hạng C', 'ca sĩ hạng B', 'ca sĩ hạng A', 'diva / ngôi sao ca nhạc hàng đầu'], [7], [], { cat: 'show', sec: 'inf', edu: 2, fame: 1, talent: 'âm nhạc' }],
    ['dien_vien', ['diễn viên quần chúng', 'diễn viên vai phụ', 'diễn viên vai chính', 'diễn viên hạng A', 'ngôi sao điện ảnh'], [5], [], { cat: 'show', sec: 'inf', edu: 2, fame: 1, talent: 'diễn xuất' }],
    ['rapper', ['rapper underground', 'rapper có tiếng', 'rapper hạng B', 'rapper hạng A', 'ngôi sao rap'], [4], [], { cat: 'show', sec: 'inf', edu: 1, fame: 1, talent: 'âm nhạc' }],
    ['dv_hai', ['diễn viên hài sân khấu nhỏ', 'diễn viên hài có tiếng', 'danh hài', 'danh hài hạng A', 'danh hài quốc dân'], [6], [], { cat: 'show', sec: 'inf', edu: 2, fame: 1, talent: 'ăn nói' }],
    ['vu_cong', ['vũ công phụ họa', 'vũ công chính', 'biên đạo múa', 'tổng đạo diễn sân khấu'], [7, 14, 30, 60], [3, 5, 7], { cat: 'show', sec: 'inf', edu: 2, w: 0.5, sigma: 0.35 }],
    ['nhac_si', ['nhạc công', 'nhạc sĩ / producer', 'producer có tiếng', 'producer hàng đầu'], [8, 18, 45, 120], [3, 5, 6], { cat: 'show', sec: 'inf', edu: 2, talent: 'âm nhạc', sigma: 0.5 }],
    ['bien_kich', ['biên kịch tập sự', 'biên kịch', 'biên kịch chính', 'biên kịch ăn khách'], [7, 15, 30, 60], [3, 5, 6], { cat: 'show', sec: 'inf', edu: 5, majors: ['law', 'art'], sigma: 0.45 }],
    ['ql_nghe_si', ['trợ lý nghệ sĩ', 'quản lý nghệ sĩ', 'quản lý ngôi sao hạng A', 'giám đốc công ty giải trí'], [7, 18, 40, 100], [2, 4, 6], { cat: 'show', sec: 'inf', edu: 3, w: 0.5, sigma: 0.4 }],
    ['dj', ['DJ quán bar', 'DJ sự kiện', 'DJ nổi tiếng'], [10, 25, 80], [3, 5], { cat: 'show', sec: 'inf', edu: 1, talent: 'âm nhạc', sigma: 0.4 }],
    ['mc_su_kien', ['MC đám cưới', 'MC sự kiện', 'MC sự kiện có tiếng'], [8, 20, 50], [3, 5], { cat: 'show', sec: 'inf', edu: 3, talent: 'ăn nói', sigma: 0.35 }],
    ['streamer', ['streamer'], [3], [], { cat: 'creator', sec: 'inf', edu: 1, fame: 1, talent: 'game', soft: 1 }],
    ['youtuber', ['YouTuber / TikToker'], [3], [], { cat: 'creator', sec: 'inf', edu: 1, fame: 1, w: 0.7 }],
    ['kol_live', ['người livestream bán hàng', 'KOC review sản phẩm', 'KOL', 'KOL hàng đầu', '"chiến thần" livestream'], [5], [], { cat: 'creator', sec: 'inf', edu: 1, fame: 1, w: 0.6 }],
    // --- freelancer: tự do, thu nhập theo dự án, bấp bênh ---
    ['fl_thiet_ke', ['freelancer thiết kế', 'freelancer thiết kế có khách quen', 'freelancer nhận dự án quốc tế'], [8, 20, 45], [2, 4], { cat: 'free', sec: 'inf', edu: 3, majors: ['art', 'it'], talent: 'hội họa', soft: 1, sigma: 0.5 }],
    ['fl_dich', ['cộng tác viên dịch thuật', 'biên dịch viên tự do', 'phiên dịch cabin'], [7, 15, 40], [3, 6], { cat: 'free', sec: 'inf', edu: 3, talent: 'ngoại ngữ', sigma: 0.4 }],
    ['fl_content', ['cộng tác viên viết bài', 'content writer tự do', 'copywriter có tiếng'], [6, 14, 30], [2, 5], { cat: 'free', sec: 'inf', edu: 3, majors: ['law', 'art', 'eco'], soft: 1, sigma: 0.45 }],
    ['fl_dev', ['lập trình viên tự do', 'freelancer lập trình nhận dự án nước ngoài', 'freelancer lập trình hàng đầu'], [15, 35, 80], [2, 4], { cat: 'free', sec: 'inf', edu: 5, major: 'it', sigma: 0.45 }],
    ['fl_video', ['dựng video tự do', 'editor video có khách quen', 'chủ studio hậu kỳ'], [7, 18, 40], [2, 5], { cat: 'free', sec: 'inf', edu: 2, sigma: 0.45 }],
    ['fl_day', ['gia sư online', 'giáo viên dạy online', 'chủ khóa học online'], [6, 15, 50], [2, 5], { cat: 'free', sec: 'inf', edu: 5, sigma: 0.6 }],
    ['fl_aff', ['làm affiliate / TikTok Shop', 'affiliate có thu nhập ổn định', 'chủ kênh affiliate lớn'], [4, 20, 80], [2, 4], { cat: 'free', sec: 'inf', edu: 2, sigma: 0.8, w: 0.8 }],
    ['fl_long_tieng', ['lồng tiếng tự do', 'diễn viên lồng tiếng', 'đạo diễn lồng tiếng'], [6, 15, 30], [3, 6], { cat: 'free', sec: 'inf', edu: 3, talent: 'ăn nói', sigma: 0.35 }],
    // --- dịch vụ, du lịch & hàng không ---
    ['phi_cong', ['học viên phi công', 'cơ phó', 'cơ trưởng', 'cơ trưởng huấn luyện'], [25, 100, 220, 300], [2, 6, 8], { cat: 'service', sec: 'formal', edu: 5, w: 0.15, sex: [1.6, 0.15], loss: 0.004 }],
    ['tiep_vien', ['tiếp viên hàng không', 'tiếp viên trưởng'], [22, 40], [6], { cat: 'service', sec: 'formal', edu: 3, w: 0.35, sex: [0.5, 1.4] }],
    ['kskl', ['kiểm soát viên không lưu', 'kíp trưởng không lưu'], [28, 45], [6], { cat: 'service', sec: 'formal', edu: 5, major: 'it', w: 0.2, loss: 0.003 }],
    ['hdv', ['hướng dẫn viên du lịch', 'hướng dẫn viên quốc tế', 'chủ công ty lữ hành'], [10, 20, 45], [3, 6], { cat: 'service', sec: 'inf', edu: 3, w: 0.7, sigma: 0.35 }],
    ['le_tan', ['lễ tân khách sạn', 'giám sát tiền sảnh', 'quản lý khách sạn', 'tổng quản lý khách sạn'], [7, 12, 25, 60], [3, 4, 6], { cat: 'service', sec: 'formal', edu: 3 }],
    ['barista', ['nhân viên pha chế', 'barista chính', 'quản lý quán cà phê'], [6, 9, 15], [2, 4], { cat: 'service', sec: 'inf', edu: 1 }],
    ['bartender', ['bartender', 'bartender trưởng', 'chủ quán bar'], [8, 16, 40], [3, 6], { cat: 'service', sec: 'inf', edu: 1, minAge: 18, sigma: 0.35 }],
    ['thu_ngan', ['thu ngân siêu thị', 'giám sát ngành hàng', 'quản lý siêu thị'], [7.5, 11, 20], [3, 5], { cat: 'service', sec: 'formal', edu: 2 }],
    ['sau_rieng', ['làm thuê vườn sầu riêng', 'chủ vườn sầu riêng', 'chủ vựa sầu riêng xuất khẩu'], [7, 40, 120], [5, 6], { cat: 'farm', sec: 'farm', rural: 1, vn: 1, sigma: 0.8, fail: 0.04, w: 0.5 }],
    ['nuoi_tom', ['công nhân trại tôm', 'chủ đầm tôm', 'chủ trang trại tôm công nghệ cao'], [7, 35, 100], [4, 6], { cat: 'farm', sec: 'farm', coast: 1, sigma: 0.8, fail: 0.05, w: 0.6 }],
    // --- thể thao, esports, cờ ---
    ['vdv', ['vận động viên năng khiếu', 'vận động viên đội tuyển tỉnh', 'vận động viên đội tuyển quốc gia', 'ngôi sao thể thao'], [3, 7, 15, 40], [], { cat: 'sport', sec: 'formal', edu: 1, talent: 'thể thao', skillRank: 1, maxAge: 36 }],
    ['hlv_tt', ['trợ lý huấn luyện viên', 'huấn luyện viên', 'HLV đội tuyển quốc gia'], [9, 18, 40], [4, 8], { cat: 'sport', sec: 'formal', edu: 1, hidden: 1 }],
    ['tuyen_thu_es', ['tuyển thủ học viện', 'tuyển thủ chuyên nghiệp', 'tuyển thủ chủ lực', 'ngôi sao esports'], [5, 15, 40, 100], [], { cat: 'esport', sec: 'inf', edu: 1, talent: 'game', skillRank: 1, maxAge: 30 }],
    ['coach_es', ['trợ lý HLV esports', 'HLV esports', 'HLV trưởng đội tuyển esports'], [10, 25, 50], [3, 5], { cat: 'esport', sec: 'inf', edu: 1, hidden: 1 }],
    ['caster_es', ['MC / caster esports', 'caster esports nổi tiếng'], [10, 40], [5], { cat: 'esport', sec: 'inf', edu: 2, hidden: 1 }],
    ['dau_tu_es', ['nhà đầu tư esports'], [40], [], { cat: 'esport', sec: 'inf', hidden: 1, sigma: 0.8, fail: 0.08 }],
    ['ky_thu', ['kỳ thủ'], [5], [], { cat: 'chess', sec: 'inf', edu: 1, talent: 'cờ', skillRank: 0 }],
    ['hlv_co', ['huấn luyện viên cờ', 'HLV đội tuyển cờ'], [8, 20], [6], { cat: 'chess', sec: 'inf', hidden: 1 }],
    // --- phi pháp ---
    ['doi_no', ['đòi nợ thuê', 'đàn em', 'đại ca'], [12, 25, 60], [3, 5], { cat: 'crime', sec: 'crime', hidden: 1, crime: [0.09, 0.006, 'bị đâm trong một vụ thanh toán', 'cưỡng đoạt tài sản'] }],
    ['cho_vay', ['cho vay nặng lãi', 'chủ app vay tiền'], [25, 120], [4], { cat: 'crime', sec: 'crime', hidden: 1, crime: [0.1, 0.002, 'bị con nợ trả thù', 'cho vay lãi nặng'] }],
    ['lua_dao', ['lừa đảo qua mạng', 'trùm lừa đảo'], [20, 100], [4], { cat: 'crime', sec: 'crime', hidden: 1, crime: [0.12, 0, '', 'lừa đảo chiếm đoạt tài sản'] }],
    ['trom', ['trộm vặt', 'trộm chuyên nghiệp'], [6, 15], [3], { cat: 'crime', sec: 'crime', hidden: 1, crime: [0.2, 0.003, 'bị đánh hội đồng khi bị bắt quả tang', 'trộm cắp tài sản'] }],
    ['ma_tuy', ['bán lẻ ma túy', 'đầu nậu ma túy'], [30, 150], [3], { cat: 'crime', sec: 'crime', hidden: 1, crime: [0.2, 0.02, 'bị bắn trong một vụ giao dịch ma túy', 'mua bán trái phép chất ma túy'] }],
    ['buon_lau', ['buôn lậu qua biên giới', 'đầu nậu buôn lậu'], [15, 60], [4], { cat: 'crime', sec: 'crime', hidden: 1, crime: [0.08, 0.004, 'tai nạn khi chạy trốn lực lượng chức năng', 'buôn lậu'] }],
    ['nha_cai', ['ghi lô đề, làm nhà cái cá độ'], [20], [], { cat: 'crime', sec: 'crime', hidden: 1, crime: [0.1, 0, '', 'tổ chức đánh bạc'] }],
    // --- khác ---
    ['xkld', ['lao động ở nước ngoài'], [20], [], { cat: 'other', sec: 'inf', hidden: 1 }],
    ['scam_kh', ['bị ép làm việc trong trại lừa đảo'], [0], [], { cat: 'crime', sec: 'inf', hidden: 1 }]
  ];
  var CAR = E.CAR;
  D.forEach(function (x) {
    var o = x[4] || {};
    CAR[x[0]] = { id: x[0], t: x[1], vn: x[2], yrs: x[3], cat: o.cat || 'other', sec: o.sec || 'inf', edu: o.edu || 0, major: o.major, majors: o.majors, soft: o.soft,
      talent: o.talent, sex: o.sex, haz: o.haz, crime: o.crime, fame: o.fame, sigma: o.sigma || 0.12, fail: o.fail || 0, hidden: o.hidden, w: o.w || 1,
      rural: o.rural, coast: o.coast, vnOnly: o.vn, ladder: o.ladder, skillRank: o.skillRank, minAge: o.minAge, maxAge: o.maxAge, prod: o.prod, promo: o.promo, loss: o.loss, tag: o.tag };
  });
  // tương thích ngược với bản 1.0
  var ALIAS = { farm: 'nong', fish: 'ngu_dan', labor: 'phu_ho', factory: 'cong_nhan', vendor: 'ban_rong', driver: 'tx_cn', ship: 'shipper', tailor: 'tho_may', hair: 'tho_toc', guard: 'bao_ve',
    cook: 'dau_bep', domestic: 'giup_viec', mech: 'tho_sua_xe', elec: 'tho_dien', nurse: 'dieu_duong', tech: 'ky_thuat_vien', soldier: 'quan_doi', sales: 'sale_b2b', athlete: 'vdv',
    office: 'van_phong', teacher: 'giao_vien', acct: 'ke_toan', bank: 'ngan_hang', eng: 'ky_su', doctor: 'bac_si', pharm: 'duoc_si', civil: 'cong_chuc', lawyer: 'luat_su',
    journo: 'phong_vien', design: 'thiet_ke', artist: 'ca_si', research: 'nghien_cuu', biz: 'kd_tu_do' };
  function resolveJob(id) { return CAR[id] ? id : ALIAS[id] || 'cong_nhan'; }
  function J(l) { return l.job ? CAR[resolveJob(l.job.id)] : null; }

  function scale(l, c, monthly) {
    if (G.WEC) { var local = G.WEC.scale(l, c, monthly); if (local != null) return local; }
    if (l.cur === 'vnd') return Math.pow(l.base / 90, 0.45); // chênh lệch vùng miền: Hà Nội/TP.HCM cao hơn ~20–30%
    return l.base / 90;
  }
  // thu nhập theo danh tiếng (triệu/tháng ở VN)
  function fameMonthly(f) {
    if (f < 1e4) return 1.5 + f / 1e4 * 3;
    if (f < 1e5) return 5 + (f - 1e4) / 9e4 * 15;
    if (f < 1e6) return 20 + (f - 1e5) / 9e5 * 100;
    if (f < 1e7) return 120 + (f - 1e6) / 9e6 * 600;
    return 720 + Math.min(4000, (f - 1e7) / 1e7 * 800);
  }
  // nghệ sĩ mới vào nghề vẫn có cát-xê sàn (hát đám cưới, đóng quần chúng…) — không thấp hơn mức khởi điểm của nghề
  function fameIncome(c, f) { return Math.max(c.vn[0] >= 4 ? c.vn[0] * 0.85 : 0, fameMonthly(f)); }
  var FAME_TIERS = [[0, 'mới vào nghề'], [1e4, 'có chút tiếng tăm'], [1e5, 'được nhiều người biết đến'], [1e6, 'nổi tiếng'], [1e7, 'ngôi sao hàng đầu']];
  function fameTier(f) { var t = 0; for (var i = 0; i < FAME_TIERS.length; i++) if (f >= FAME_TIERS[i][0]) t = i; return t; }
  function fmtFollowers(f) { return f >= 1e6 ? U.fmtNum(f / 1e6, 1) + ' triệu' : f >= 1e3 ? U.fmtNum(f / 1e3, 0) + ' nghìn' : U.fmtNum(f); }

  function jobLabel(id) { var c = CAR[resolveJob(id)]; return c.t[0]; }
  function jobTitleOf(l) {
    if (!l.job) return null;
    if (l.job.t) return l.job.t;
    var c = J(l), rk = Math.min(l.job.rank || 0, c.t.length - 1);
    if (c.ladder) return (c.id === 'cong_an' ? (H.inVN(l) ? 'Công an' : 'Cảnh sát') : 'Quân đội') + ' · ' + c.t[rk] + (c.id === 'cong_an' && l.job.br && E.POLICE_BR ? ' · ' + E.POLICE_BR[l.job.br] : '');
    if (c.id === 'streamer') return 'streamer ' + (l.game || 'game') + ' (' + fmtFollowers(l.fame) + ' người theo dõi)';
    if (c.id === 'youtuber') return 'YouTuber / TikToker (' + fmtFollowers(l.fame) + ' người đăng ký)';
    if (c.id === 'kol_live') return c.t[Math.min(fameTier(l.fame), c.t.length - 1)] + ' (' + fmtFollowers(l.fame) + ' người theo dõi)';
    if (c.fame && c.t.length > 1) return c.t[Math.min(fameTier(l.fame), c.t.length - 1)];
    if (c.fame) return c.t[0] + ' ' + FAME_TIERS[fameTier(l.fame)][1];
    if (c.id === 'tuyen_thu_es' || c.id === 'coach_es') return c.t[rk] + ' ' + (l.game || '');
    if (c.id === 'vdv') return E.sportTitle ? E.sportTitle(l, rk) : c.t[rk] + (l.talentSub ? ' môn ' + l.talentSub : ''); // v2.9: danh xưng theo từng môn
    if (c.id === 'ky_thu') return (l.titles && l.titles.length ? l.titles[l.titles.length - 1] : 'kỳ thủ') + ' ' + (l.talentSub || 'cờ');
    if (c.prod && l.job.p) return c.t[rk] + ' (' + l.job.p + ')';
    return H.inVN(l) ? c.t[rk] : c.t[rk].replace('VKSND', 'viện kiểm sát').replace('UBND', 'hội đồng');
  }
  // bằng cấp chỉ cộng thêm khi vượt yêu cầu của nghề (lương nghề cần đại học đã là lương của người có bằng đại học);
  // lương nhà nước theo hệ số, không phụ thuộc trường danh tiếng
  // v3.0: thạc sĩ, tiến sĩ được trả cao hơn hẳn ở nghề cần bằng đại học (nhà nước cũng xếp hệ số lương cao hơn); chứng chỉ ngoại ngữ còn hạn cộng thêm
  var EDT = [0.8, 0.85, 0.92, 1, 1.05, 1.12, 1.27, 1.42];
  function eduMult(l, c) {
    var need = Math.min(c.edu >= 99 ? 5 : c.edu || 0, 7), m = EDT[l.edu] / EDT[need];
    m = U.clamp(m, 0.85, c.edu >= 5 ? 1.32 : 1.12) * (E.certBonus ? E.certBonus(l, c) : 1);
    if (l.edu >= 5 && c.cat !== 'state' && c.cat !== 'uniform') m *= 1 + ((l.uniTier || 1) - 1) * 0.5;
    return Math.min(m, 1.4); // v7.1: học vấn, trường danh tiếng, chứng chỉ cộng lại tối đa ×1,4
  }
  function monthlyEst(l, id, rank) {
    var c = CAR[resolveJob(id)], rk = rank || 0;
    var m = c.fame ? fameIncome(c, l.fame || 500) : c.id === 'xkld' ? 20 : c.vn[Math.min(rk, c.vn.length - 1)];
    var eduM = eduMult(l, c);
    if (c.sec === 'crime' || c.fame || c.skillRank != null) eduM = 1;
    return m * scale(l, c, m) * eduM;
  }
  function offerHint(l, id) {
    var c = CAR[resolveJob(id)];
    var s = c.fame ? 'Thu nhập phụ thuộc lượng người theo dõi' : 'Khoảng ' + E.fmtMoney(l, monthlyEst(l, id, startRank(l, c))) + '/tháng';
    if (c.sec === 'crime') s += ' · phạm pháp, có thể vào tù';
    else if (c.sigma >= 0.5) s += ' · bấp bênh';
    if (c.haz) s += ' · nguy hiểm';
    return s;
  }
  function offerAI(l, id) {
    var c = CAR[resolveJob(id)];
    var w = Math.pow(monthlyEst(l, id, 0) + 1, 0.8);
    if (c.talent && c.talent === l.talent) w *= 2.5;
    if (c.sec === 'crime') w *= E.H.aiW(l, { bad: 1.5, risk: 1 });
    if (c.fame) w *= E.H.aiW(l, { risk: 0.8, amb: 1 }) * 0.6;
    return w;
  }
  function eligible(l, c) {
    if (c.hidden) return false;
    if (c.minAge && l.age < c.minAge) return false;
    if (c.edu > l.edu) return false;
    if (c.vnOnly && !H.inVN(l)) return false; // v7.0: ở ngoài Việt Nam thì không làm việc chỉ có ở Việt Nam
    if (c.cat === 'state' && l.abroad) return false;
    if (c.major && !c.soft && c.major !== l.major) return false;
    if (c.majors && !c.soft && c.majors.indexOf(l.major) < 0) return false;
    if (c.talent && c.talent !== l.talent && !(c.soft && (c.major === l.major || (c.majors && c.majors.indexOf(l.major) >= 0)))) return false;
    if (c.rural && l.urban) return false;
    if (c.coast && !(l.coast && !l.urban)) return false;
    if (c.maxAge && l.age > (c.id === 'vdv' && E.sportInfo ? E.sportInfo(l).max : c.maxAge) - 6) return false;
    // v7.0: từ 58 tuổi không còn được tuyển mới vào khu vực chính thức (gần tuổi nghỉ hưu); từ 65 tuổi tránh việc nặng nhọc, nguy hiểm
    if (l.age >= 58 && c.sec === 'formal' && !(l.job && resolveJob(l.job.id) === c.id)) return false;
    if (l.age >= 65 && c.haz) return false;
    if (l.age >= 62 && !(l.job && resolveJob(l.job.id) === c.id) && /vũ công|thợ hồ|phụ hồ|bartender|pha chế|tài xế xe tải|shipper|giao hàng|người mẫu|vận động viên|bốc vác|thợ xây/.test(c.t[0])) return false;
    return true;
  }
  function offers(l, r) {
    var cands = Object.keys(CAR).map(function (k) { return CAR[k]; }).filter(function (c) { return eligible(l, c); });
    var picked = [];
    for (var i = 0; i < 3 && cands.length; i++) {
      var c = U.wpick(r, cands, function (c) {
        var w = c.w;
        if (c.edu >= 5) w *= 3;
        if (c.major && c.major === l.major) w *= 4;
        if (c.majors && c.majors.indexOf(l.major) >= 0) w *= 3;
        if (c.talent && c.talent === l.talent) w *= 4;
        if (c.id === 'nong') w = l.fam.fJob && /ruộng|nương|nông|rẫy|chăn/.test(l.fam.fJob) ? 9 : 4;
        if (c.sex) w *= l.sex === 'M' ? c.sex[0] : c.sex[1];
        if (l.edu >= 5 && c.edu < 3) w *= 0.15;
        if (l.record && c.sec === 'formal') w *= 0.15;
        return w;
      });
      picked.push(c.id); cands = cands.filter(function (x) { return x !== c; });
    }
    return picked;
  }
  // v2.8: người đã đi làm nhiều năm không phải bắt đầu lại từ "thực tập sinh" — vào bậc hợp với tuổi & kinh nghiệm
  function startRank(l, c) {
    if (!c || c.ladder || c.fame || c.skillRank != null || c.t.length < 2 || E.noStartRank) return 0;
    var exp = l.workYrs || 0, rk = 0;
    if (/thực tập|tập sự|học việc|học viên|^trợ lý|^phụ /.test(c.t[0]) && exp >= 2) rk = 1;
    if (l.edu >= 6 && c.edu >= 5 && c.t.length >= 3) rk = Math.max(rk, 1); // v3.0: có bằng thạc sĩ / tiến sĩ thì không vào ở bậc thấp nhất
    if (l.edu >= 7 && c.edu >= 5 && c.t.length >= 4 && exp >= 3) rk = Math.max(rk, 2);
    rk = Math.min(rk, c.t.length - 1);
    // Bằng cấp / tuổi không tự biến người mới thành quản lý, trưởng bộ phận.
    var history = l.jobsHist || [];
    var experience = history.reduce(function (n, h, i) { var end = h.to == null ? (history[i + 1] ? history[i + 1].from : l.age) : h.to; return n + (resolveJob(h.id) === c.id ? Math.max(0, end - h.from) : 0); }, 0);
    if (experience >= (c.yrs[0] || 3) && /trưởng|quản lý/.test(c.t[1] || '') && !/chủ|giám đốc/.test(c.t[1])) rk = Math.max(rk, 1);
    while (rk > 0 && (/trưởng|quản lý|giám đốc|chủ |chủ tịch/.test(c.t[rk]) || rk >= 2 && /giáo sư|cấp cao|bậc cao/.test(c.t[rk])) && experience < c.yrs.slice(0, rk).reduce(function (a, y) { return a + y; }, 0)) rk--;
    return rk;
  }
  function offerLabel(l, id) { var c = CAR[resolveJob(id)]; return c.t[startRank(l, c)]; }
  function startJob(l, id, r, log, quiet) {
    id = resolveJob(id);
    var c = CAR[id];
    if (c.minAge && l.age < c.minAge) { if (!quiet) log('Công việc này chỉ nhận từ ' + c.minAge + ' tuổi.', 'neutral'); return false; }
    if (l.job && resolveJob(l.job.id) === id && l.job.yrs === 0 && l.jobsHist && l.jobsHist.length && l.jobsHist[l.jobsHist.length - 1].from === l.age) return; // v2.8: vừa nhận đúng việc này trong năm
    if (l.school && l.school !== 'police') { if (!quiet) log('Bỏ dở việc học để đi làm.', 'bad'); l.school = null; l.schoolEnd = null; l.cityStudent = null; if (l.abroad && l.abroad.study) l.abroad = null; }
    l.job = { id: id, rank: startRank(l, c), yrs: 0, since: l.age, rankSince: l.age };
    l.job.rankTracked = l.job.rank;
    if (c.prod) l.job.p = U.pick(r, c.prod);
    if (c.fame && !l.fame) l.fame = U.randint(r, 200, 3000) * (l.talent === c.talent ? 2 : 1);
    if ((id === 'streamer' || id === 'tuyen_thu_es' || id === 'coach_es') && !l.game) { if (l.talent !== 'game' && !l.gameType) l.gameType = r() < 0.5 ? 'FPS' : 'MOBA'; l.game = E.gameFor(l, r); } // v2.8: game khớp thể loại sở trường
    if (c.skillRank != null) l.job.rank = c.id === 'tuyen_thu_es' ? 0 : rankBySkill(l, c);
    if (id === 'tuyen_thu_es' && E.ESPORTS) E.ESPORTS.init(l, r);
    l.flags.needJob = false; l.indep = true;
    l.jobsHist = l.jobsHist || [];
    l.jobsHist.push({ id: id, from: l.age });
    if (!quiet) { log('Bắt đầu công việc mới: ' + jobTitleOf(l) + '.', c.sec === 'crime' ? 'bad' : 'good'); H.fx(l, { hap: 3 }); }
    if (c.sec === 'crime') { H.fx(l, { karma: -10 }); H.mem(l, 'Ngày bạn bước chân vào con đường ' + c.t[0] + '.', 3); }
    if (!l.flags.firstJob && c.sec !== 'crime') { l.flags.firstJob = true; H.mem(l, 'Tháng lương đầu tiên — bạn mua tặng mẹ một món quà nhỏ.', 3); }
  }
  function rankBySkill(l, c) {
    var s = l.skill || 0;
    if (c.id === 'ky_thu') return 0;
    return s >= 85 ? 3 : s >= 70 ? 2 : s >= 50 ? 1 : 0;
  }
  function isCrime(l) { var c = J(l); return !!(c && c.sec === 'crime'); }

  // ---------- Thi đấu ----------
  function sportYear(l, r, log, c, y) {
    var a = l.age, rk = l.job.rank, wealthy = l.gdp > 25;
    if (c.id === 'vdv') {
      // v2.9: giải đấu ghi rõ môn; môn đồng đội (bóng đá, bóng rổ…) rất hiếm khi có huy chương Olympic, golf / bi-a không có ở SEA Games mọi kỳ
      var SI = E.sportInfo ? E.sportInfo(l) : { team: false, n: l.talentSub || 'thể thao' }, mn = ' (' + SI.n + ')';
      if (rk >= 1 && r() < (SI.team ? 0.15 : 0.25) + (l.skill - 50) / 100) medal(l, r, log, (SI.team ? 'Giải vô địch quốc gia cùng câu lạc bộ' : 'Giải vô địch quốc gia') + mn, 0.4);
      if (rk >= 2 && y % 2 === 1 && isVN(l) && r() < (SI.sea === false ? 0 : (SI.team ? 0.25 : 0.35) + (l.skill - 70) / 60)) medal(l, r, log, 'SEA Games ' + y + mn, SI.n === 'bóng đá' ? 4 : 2);
      if (rk >= 2 && y % 4 === 2 && r() < (SI.team ? 0.02 : 0.06) + (l.skill - 75) / 150 + (wealthy ? 0.08 : 0)) medal(l, r, log, 'ASIAD ' + y + mn, 5);
      if (rk >= 2 && y % 4 === 0 && SI.olympic !== false && r() < (SI.team ? 0.002 : 0.015 + (l.skill - 85) / 300 + (wealthy ? 0.05 : 0))) medal(l, r, log, 'Thế vận hội Olympic ' + y + mn, 20);
    } else if (c.id === 'tuyen_thu_es') {
      if (E.ESPORTS && E.ESPORTS.managed(l)) return;
      var g = l.game || 'esports';
      if (rk >= 1 && r() < 0.2 + (l.skill - 50) / 120) { log('Cùng đội vô địch giải ' + g + ' quốc gia.', 'good'); H.cash(l, l.base * 0.3, 'Tiền thưởng giải đấu'); l.fame = (l.fame || 0) * 1.5 + 5000; H.mem(l, 'Nâng cúp vô địch ' + g + ' quốc gia giữa tiếng hò reo.', 4); }
      if (rk >= 2 && y % 2 === 1 && /Liên Quân|Liên Minh|Mobile Legends|Valorant|PUBG|Free Fire/.test(g) && r() < 0.3 + (l.skill - 70) / 80) medal(l, r, log, 'SEA Games ' + y + ' (' + g + ')', 1.5);
      if (rk >= 3 && r() < 0.08 + (l.skill - 88) / 100) {
        var wt = /Liên Minh/.test(g) ? 'Chung kết Thế giới Liên Minh Huyền Thoại' : /Liên Quân/.test(g) ? 'AWC — giải Liên Quân thế giới' : /Mobile Legends/.test(g) ? 'M-Series thế giới' : /Valorant/.test(g) ? 'Valorant Champions' : /CS2/.test(g) ? 'CS2 Major' : 'giải thế giới ' + g;
        log('Lên ngôi vô địch ' + wt + '!', 'big'); H.cash(l, l.base * 6, 'Tiền thưởng ' + wt); l.fame = (l.fame || 0) * 3 + 2e5; l.medals.push({ ev: wt, m: 'vàng', y: y, career: c.id, sport: l.game }); H.mem(l, 'Khoảnh khắc nâng cúp ' + wt + '.', 7);
      }
    } else if (c.id === 'ky_thu') {
      var chess = l.talentSub === 'cờ vua';
      var T = chess ? [[65, 'Kiện tướng FIDE (FM)'], [78, 'Kiện tướng Quốc tế (IM)'], [88, 'Đại kiện tướng (GM)']] : [[65, 'Kiện tướng quốc gia'], [80, 'Đại kiện tướng quốc gia'], [90, 'Đại kiện tướng quốc tế']];
      T.forEach(function (t) {
        if (l.skill >= t[0] && l.titles.indexOf(t[1]) < 0) { l.titles.push(t[1]); log('Đạt danh hiệu ' + t[1] + ' môn ' + (l.talentSub || 'cờ') + '.', 'big'); H.fx(l, { hap: 8 }); H.mem(l, 'Ngày được phong ' + t[1] + '.', 5); l.job.rank = Math.min(3, (l.job.rank || 0) + 1); }
      });
      if (r() < 0.15 + (l.skill - 60) / 100) { log('Vô địch một giải ' + (l.talentSub || 'cờ') + (l.skill > 80 ? ' quốc tế' : ' toàn quốc') + '.', 'good'); H.cash(l, l.base * (l.skill > 80 ? 0.8 : 0.2), 'Tiền thưởng giải cờ'); }
      if (isVN(l) && y % 2 === 1 && l.skill > 75 && r() < 0.3) medal(l, r, log, 'SEA Games ' + y + ' (' + (l.talentSub || 'cờ') + ')', 1.5);
    }
  }
  function medal(l, r, log, ev, bonus) {
    var x = r(), m = x < 0.33 ? 'vàng' : x < 0.66 ? 'bạc' : 'đồng';
    l.medals.push({ ev: ev, m: m, y: l.birthYear + l.age, career: l.job && resolveJob(l.job.id), sport: l.job && resolveJob(l.job.id) === 'tuyen_thu_es' ? l.game : l.talentSub });
    var mult = m === 'vàng' ? 1 : m === 'bạc' ? 0.5 : 0.3;
    H.cash(l, l.base * bonus * mult, 'Thưởng huy chương ' + m + ' ' + ev);
    log('Giành huy chương ' + m + ' tại ' + ev + '!', m === 'vàng' ? 'big' : 'good');
    H.fx(l, { hap: m === 'vàng' ? 10 : 6 });
    l.fame = (l.fame || 0) + (m === 'vàng' ? 2e5 : 5e4) * bonus / 2;
    if (m === 'vàng' || bonus >= 5) H.mem(l, 'Đứng trên bục nhận huy chương ' + m + ' ' + ev + ', quốc ca vang lên.', bonus >= 5 ? 8 : 5);
  }

  // ---------- Một năm sự nghiệp: trả về thu nhập ----------
  function careerYear(l, r, log, focus) {
    if (!l.job || l.flags.military) return 0;
    var c = J(l), a = l.age, y = l.birthYear + a;
    if (!c) return 0;
    if (G.WEC && l.cur !== 'vnd') {
      var market = G.WEC.context(l), key = market.code + ':' + (market.data && market.data.usd) + ':' + l.urban + ':' + c.id;
      if (market.data && l.job.market52 !== key) {
        ['last', 'lastRk', 'floor', 'floorRk', 'sportPrevSalary', 'sportPaidFactor'].forEach(function (k) { delete l.job[k]; });
        l.job.market52 = key;
      }
    }
    l.job.yrs++; l.workYrs++;
    var inc = 0;
    // kỹ năng (thể thao, esports, cờ, danh tiếng)
    if (c.skillRank != null || c.fame) {
      if (c.id === 'tuyen_thu_es' && E.ESPORTS && E.ESPORTS.managed(l)) {
        E.ESPORTS.annual(l, r, log, focus);
      } else {
      var peak = c.id === 'tuyen_thu_es' ? 22 : c.id === 'ky_thu' ? 35 : c.id === 'vdv' && E.sportInfo ? E.sportInfo(l).peak : 27;
      var dg = a <= peak ? 3 + r() * 5 + (focus === 'work' ? 3 : focus === 'balance' ? 1.5 : 0) + (focus === 'health' && c.id === 'vdv' ? 2 : 0) + (l.talent === c.talent ? 2 : 0) : -(1 + r() * 4);
      l.skill = U.clamp((l.skill || 20) + dg, 0, 100);
      if (c.skillRank) { var nr = rankBySkill(l, c); if (nr > l.job.rank) { l.job.rank = nr; log('Được gọi lên: ' + jobTitleOf(l) + '.', 'good'); H.fx(l, { hap: 6 }); if (nr >= 2) H.mem(l, 'Lần đầu khoác áo đội tuyển quốc gia.', 5); } }
      }
      sportYear(l, r, log, c, y);
      if (E.sportPromote && !(c.id === 'tuyen_thu_es' && E.ESPORTS && E.ESPORTS.managed(l))) E.sportPromote(l, log);
    }
    if (c.fame) {
      var f0 = l.fame || 300;
      // v2.2: nổi tiếng là chuyện hiếm — đa số dừng ở hạng thấp, càng lên cao càng khó (hiệu ứng bão hòa)
      var lf = Math.log(Math.max(50, f0)) / Math.LN10;
      var g = Math.exp(0.6 * U.normal(r) + (l.talent === c.talent ? 0.15 : 0) + (focus === 'work' ? 0.12 : focus === 'balance' ? 0.06 : 0) + (l.skill - 50) / 250 - (a > 45 ? 0.3 : 0) - Math.max(0, lf - 4.5) * 0.4);
      if (r() < 0.03) { g *= 5 + r() * 15; log('Một ' + (c.id === 'ca_si' || c.id === 'rapper' ? 'bài hát' : c.id === 'dien_vien' ? 'vai diễn' : c.id === 'dv_hai' ? 'tiểu phẩm' : c.id === 'nguoi_mau' ? 'bộ ảnh' : c.id === 'kol_live' ? 'phiên livestream' : 'video') + ' bất ngờ viral, lượng người theo dõi tăng vọt!', 'big'); H.mem(l, 'Đêm bạn thức trắng nhìn lượt xem tăng từng giây.', 4); }
      l.fame = Math.min(5e7, Math.max(50, f0 * g));
      [[1e4, 'Cán mốc 10 nghìn người theo dõi.', 1], [1e5, c.cat === 'creator' ? 'Nhận nút bạc YouTube — 100 nghìn người đăng ký!' : 'Được 100 nghìn người hâm mộ biết tên.', 2], [1e6, c.cat === 'creator' ? 'Nhận nút vàng — 1 triệu người đăng ký!' : 'Trở thành người nổi tiếng với hơn 1 triệu người hâm mộ.', 3], [1e7, c.cat === 'creator' ? 'Nút kim cương — 10 triệu người đăng ký!' : 'Cán mốc 10 triệu người hâm mộ — đứng trên đỉnh cao.', 4]].forEach(function (m) {
        if (c.t.length > 1) m[1] = 'Lên hạng: giờ bạn là ' + c.t[Math.min(m[2], c.t.length - 1)] + ' (' + fmtFollowers(m[0]) + ' người hâm mộ).';
        if (f0 < m[0] && l.fame >= m[0] && !(l.flags.fameHit || (l.flags.fameHit = {}))[m[0]]) { l.flags.fameHit[m[0]] = 1; log(m[1], 'big'); H.fx(l, { hap: 6 }); if (m[0] >= 1e5) H.mem(l, m[1], m[0] >= 1e6 ? 6 : 4); if (m[0] >= 1e6 && c.cat === 'creator' && !l.flags.mediaCo) { l.flags.mediaCo = true; log('Thành lập công ty truyền thông riêng.', 'good'); } }
      });
      var t0 = fameTier(f0), t1 = fameTier(l.fame * 1.25); // v6.9.1: chỉ báo tụt hạng khi giảm hẳn dưới mốc (tránh báo lên / xuống liên tục)
      if (c.t.length > 1 && t1 < t0 && !(l.flags.fameDropAt != null && a - l.flags.fameDropAt < 5)) { l.flags.fameDropAt = a; log('Danh tiếng đi xuống, tụt hạng thành ' + c.t[Math.min(t1, c.t.length - 1)] + '.', 'bad'); H.fx(l, { hap: -4 }); }
      inc = fameIncome(c, l.fame) * 12 * scale(l) * Math.exp(U.normal(r) * 0.3);
      if (l.fame < 1e4 && l.job.yrs >= 4 && !l.flags.creatorWarned) { l.flags.creatorWarned = true; H.sched(l, 'creator_nghi', 0); }
    } else if (c.id === 'xkld') {
      inc = (l.abroad && l.abroad.mult ? l.abroad.mult * 5.5 : 20) * 12 * Math.exp(U.normal(r) * 0.1);
    } else {
      var rk = Math.min(l.job.rank, c.vn.length - 1);
      var eduM = eduMult(l, c);
      if (c.sec === 'crime' || c.skillRank != null) eduM = 1;
      var qM = c.sec === 'formal' && c.cat !== 'state' ? [1, 0.95, 0.98, 1, 1.04, 1.08][l.fam.q] : 1;
      var focM = focus === 'work' ? 1.06 : focus === 'rest' ? 0.94 : 1;
      // v3.0: lương không còn "quay số" mỗi năm — mỗi người có mức năng lực / chỗ làm cố định, cộng thâm niên;
      // nghề ổn định chỉ dao động nhẹ, nghề bấp bênh (buôn bán, tự do) thì lúc lời lúc lỗ nhưng có quán tính
      var J0 = l.job;
      if (J0.k == null) J0.k = Math.exp(U.normal(r) * c.sigma * 0.6);
      J0.nz = (J0.nz || 0) * 0.5 + U.normal(r) * 0.5;
      J0.sen = (J0.sen || 0) + 1;
      var noise = Math.exp(J0.nz * c.sigma * (c.sigma >= 0.4 ? 0.9 : c.sec === 'formal' ? 0.25 : 0.5));
      var senior = 1 + Math.min(12, J0.sen - 1) * 0.01; // v7.1: thâm niên tối đa +12%
      inc = c.vn[rk] * 12 * scale(l, c, c.vn[rk]) * eduM * qM * focM * (E.athletePay && /^(vdv|tuyen_thu_es|ky_thu)$/.test(c.id) ? E.athletePay(l, rk) : c.id === 'vdv' && E.sportPay ? E.sportPay(l, rk) : 1) * J0.k * noise * senior;
      if (c.id === 'tuyen_thu_es' && E.esportsIncome) inc = E.esportsIncome(l, inc, r, log);
      // vừa được thăng chức thì lương năm sau không thể thấp hơn trước; nghề ổn định không tự dưng tụt lương
      if (c.id === 'tuyen_thu_es' && E.ESPORTS && E.ESPORTS.managed(l)) { J0.floor = null; J0.last = null; }
      if (J0.floor && J0.floorRk === rk) inc = Math.max(inc, J0.floor);
      else if (J0.last && J0.lastRk === rk && c.sigma < 0.4) inc = Math.max(inc, J0.last * 0.97);
      J0.floor = null; J0.last = inc; J0.lastRk = rk;
      if (E.sportSalary && /^(vdv|tuyen_thu_es|ky_thu)$/.test(c.id) && !(c.id === 'tuyen_thu_es' && E.ESPORTS && E.ESPORTS.managed(l))) inc = E.sportSalary(l, inc, log);
      if (c.id === 'scam_kh') inc = 0;
    }
    // thăng tiến theo thang bậc & số năm
    if (!c.fame && c.skillRank == null && l.job.rank < c.t.length - 1) {
      var need = c.yrs[l.job.rank] || 3;
      if (l.job.yrs >= need && (!E.canAdvance || E.canAdvance(l, c, true))) {
        var pp = c.ladder ? (l.job.rank >= 7 ? 0.04 + (l.st.kno - 70) / 300 : 0.85 - (l.karma < -20 ? 0.4 : 0)) :
          (c.promo || 0.2) + (l.st.kno - 50) / 250 + (focus === 'work' ? 0.12 : focus === 'balance' ? 0.06 : 0) + ((l.tr && l.tr.amb) - 50) / 300 + (l.talent === 'ăn nói' ? 0.04 : 0) - l.job.rank * 0.06 +
          (l.flags.eliteBoost && l.flags.eliteBoost === c.id ? 0.3 : 0); // v2.5: con nhà có "ô dù" thăng tiến nhanh hơn
        // v7.1: tháp thăng tiến — càng lên cao càng ít chỗ; bậc cao nhất chỉ dành cho số ít (trước đây ~43% người 45 tuổi đã ở bậc cao nhất)
        if (!c.ladder) { var L1 = Math.max(1, c.t.length - 1), fr = (l.job.rank + 1) / L1; pp = Math.min(0.45, pp) * (0.62 - 0.5 * Math.pow(fr, 1.4)) * (c.cat === 'farm' ? 0.35 : 1); }
        // v7.4: thực tập sinh, học việc, tập sự hết thời gian thử việc thì phần lớn được nhận chính thức (trước đây có người kẹt 8 năm ở bậc thực tập)
        if (!c.ladder && l.job.rank === 0 && /thực tập|tập sự|học việc|học viên|^phụ /.test(c.t[0])) pp = Math.max(pp, 0.6 + (focus === 'work' ? 0.15 : 0));
        if (r() < pp) {
          l.job.rank++; l.job.yrs = 0; l.job.rankSince = l.age + 1; l.job.rankTracked = l.job.rank;
          if (inc > 0 && !c.fame) { l.job.floor = inc * (1.08 + r() * 0.1); l.job.floorRk = Math.min(l.job.rank, c.vn.length - 1); } // v3.0: thăng chức là tăng lương
          var ru = !c.ladder && E.rankUpText ? E.rankUpText(l, c) : null; // v4.4: nghề tự do, tự kinh doanh không có "thăng chức"
          log(c.ladder ? 'Được thăng quân hàm ' + c.t[l.job.rank] + '.' : ru ? ru.t : 'Được thăng chức: ' + jobTitleOf(l) + '.', 'good'); H.fx(l, { hap: 5 });
          if (l.job.rank === c.t.length - 1) H.mem(l, c.ladder ? 'Ngày nhận quyết định thăng quân hàm ' + c.t[l.job.rank] + '.' : ru ? ru.m : 'Ngày nhận quyết định bổ nhiệm ' + c.t[l.job.rank] + '.', 5);
        }
      }
    }
    // nghề bấp bênh: vẫn có cơ hội tìm việc khác tốt hơn
    if ((c.id === 'an_xin' || c.id === 've_chai' || c.id === 'phu_giup') && a < 58 && r() < 0.25) l.flags.upgradeJob = true;
    // kinh doanh: thất bại
    if (c.fail && !(c.cat === 'farm' && l.job.rank === 0) && r() < c.fail * (l.st.kno > 70 ? 0.7 : 1)) {
      var lost = l.base * (0.5 + r() * (l.job.rank + 1));
      log('Làm ăn thua lỗ nặng, ' + (l.job.p || 'công ty') + ' phá sản. Mất ' + E.fmtMoney(l, lost) + '.', 'bad');
      H.cash(l, -lost, 'Thua lỗ, phá sản'); H.fx(l, { hap: -12 }); H.mem(l, 'Ngày phải đóng cửa ' + (l.job.p || 'công ty') + ', bao năm gây dựng tan thành mây khói.', 5);
      l.job = null; l.flags.needJob = true; return inc * 0.3;
    }
    // phạm pháp: bị bắt / bị thanh toán
    if (c.crime) {
      H.fx(l, { karma: -3 });
      if (c.crime[1] && r() < c.crime[1]) { H.kill(l, c.crime[2], log, true); return inc; }
      var pa = c.crime[0] * (1.15 - l.st.kno / 250) * (E.crimeRankK ? E.crimeRankK(l, c) : (l.job.rank >= 1 ? 0.85 : 1)); // v4.5: ông trùm có đàn em, có người chống lưng — ít bị bắt hơn
      if (E.CRIME911) { E.CRIME911.pressure(l,Math.max(1,Math.min(3,1+Math.floor((l.job.rank||0)/3)))); E.CRIME911.year(l, r, log, pa, c); }
      else if (r() < pa) H.sched(l, 'bi_bat', 0, { why: c.crime[3], sev: c.id === 'ma_tuy' ? 3 : c.id === 'lua_dao' || c.id === 'cho_vay' ? 2 : 1 });
    }
    // nguy hiểm nghề nghiệp
    if (c.haz) {
      if (r() < c.haz[1]) { H.kill(l, c.haz[2], log, true); return inc; }
      if (r() < c.haz[0]) { log(c.tag === 'driver' ? 'Bị tai nạn khi đang chạy xe kiếm tiền, nghỉ làm mấy tuần.' : 'Bị tai nạn lao động, phải nghỉ dưỡng thương.', 'bad'); H.fx(l, { hea: -8, hap: -3 }); inc *= 0.9; }
    }
    // mất việc
    var lossP = c.loss != null ? c.loss : c.sec === 'formal' ? 0.02 : c.sec === 'farm' ? 0 : c.sec === 'crime' ? 0 : 0.03;
    if (!E.isStableService(l) && !c.fame && c.skillRank == null && c.id !== 'xkld' && c.id !== 'phu_giup' && H.isEmployee(l) && r() < lossP * E.layoffRisk(l)) { // v5.6.3: chức cao nhất, mới thăng chức, sắp nghỉ hưu… ít / không bị cắt giảm
      log('Mất việc ' + jobTitleOf(l) + '.', 'bad'); l.job = null; l.flags.needJob = true; H.fx(l, { hap: -6 }); return inc * 0.5;
    }
    // v2.5: chủ cơ sở không "bị cho nghỉ" nhưng có thể ế ẩm phải đóng cửa (cơ nghiệp gia đình thì không)
    if (!c.fame && c.sec === 'inf' && !H.isEmployee(l) && !l.job.fam && r() < lossP * (c.cat === 'free' ? 1.5 : 1)) {
      log(c.cat === 'free' ? 'Mất dần khách hàng, mấy tháng liền không có dự án — đành tạm gác nghề tự do.' : 'Làm ăn ế ẩm mấy năm liền, ' + (l.job.p || jobTitleOf(l)) + ' phải đóng cửa.', 'bad'); l.job = null; l.flags.needJob = true; H.fx(l, { hap: -8 }); return inc * 0.5;
    }
    // giải nghệ (thể thao / esports)
    var maxA = c.id === 'tuyen_thu_es' && E.ESPORTS && E.ESPORTS.managed(l) ? E.ESPORTS.init(l, r).retire : c.id === 'vdv' && E.sportInfo ? E.sportInfo(l).max : c.maxAge; // v2.9: mỗi môn một tuổi giải nghệ
    if (maxA && (a >= maxA || (a >= maxA - 6 && l.skill < 45 && r() < 0.3))) {
      log(c.cat === 'esport' ? 'Giải nghệ thi đấu esports.' : 'Giải nghệ sau những năm thi đấu.', 'big');
      H.mem(l, 'Trận đấu cuối cùng trước khi giải nghệ — bạn cúi chào khán giả.', 5);
      if(E.CAREER_DEPTH900){E.CAREER_DEPTH900.retire(l,r,log);return inc;}
      var next = c.id === 'tuyen_thu_es' ? U.wpick(r, ['coach_es', 'caster_es', 'streamer'], function (x) { return x === 'streamer' ? 2 : 1; }) : 'hlv_tt';
      l.job = null; startJob(l, next, r, log);
      if (next === 'streamer') l.fame = Math.max(l.fame || 0, 2e4);
      return inc;
    }
    // nghỉ hưu
    var formal = c.sec === 'formal' || E.pensionCovered && E.pensionCovered(l, c);
    var retAge;
    if (c.ladder) { var rk2 = l.job.rank; retAge = (rk2 <= 3 ? 53 : rk2 === 4 ? 55 : rk2 === 5 ? 57 : rk2 === 6 ? 60 : 62) - (l.sex === 'F' && rk2 >= 6 ? 2 : 0); }
    else if (c.sec === 'crime') retAge = 70;
    // v2.4: chủ doanh nghiệp không có tuổi nghỉ hưu — còn khỏe, còn vốn thì còn làm (thường đến 70–78 rồi giao lại)
    else if ((c.cat === 'biz' || c.owner) && (c.owner || /^(chủ|giám đốc)/.test(c.t[Math.min(l.job.rank || 0, c.t.length - 1)]) || /^kd_/.test(c.id))) retAge = 70 + (l.job.bizRet != null ? l.job.bizRet : (l.job.bizRet = U.randint(r, 0, 8)));
    else retAge = isVN(l) ? (formal ? (l.sex === 'M' ? 62 : 60) : 65 + U.randint(r, 0, 7)) : (l.gdp > 15 ? 65 : 68 + U.randint(r, 0, 5));
    if (l.flags.afterRet && !c.ladder) retAge = Math.max(retAge, l.flags.afterRet); // đã nghỉ hưu rồi đi làm/kinh doanh tiếp
    if (c.ladder && l.job.rank >= 8) retAge = Math.max(retAge, 65); // senior command extension in the simulation
    if (E.retirementAge125) retAge = E.retirementAge125(l, retAge);
    if (l.job.retireNow) retAge = Math.min(retAge, a); // v3.6: người chơi tự chọn nghỉ hưu
    if (a >= retAge || (a >= 55 && l.st.hea < 25)) {
      var firstRet = !l.flags.retOnce;
      l.lastIncome = inc;
      // v3.0: đủ 15 năm đóng BHXH mới có lương hưu; mức hưởng theo số năm đóng (nam 20 năm, nữ 15 năm được 45%, mỗi năm thêm 2%, tối đa 75%)
      var SIy = l.si ? l.si.yrs : null;
      l.pensioned = l.pensioned || (SIy != null ? SIy >= 15 : !E.pensionCovered && formal && l.workYrs >= 15);
      if (l.pensioned && l.pensionInc == null) {
        if (SIy) { var avg = l.si.sum / Math.max(1, SIy), rt = l.sex === 'M' ? (SIy < 20 ? 0.4 + (SIy - 15) * 0.01 : 0.45 + (SIy - 20) * 0.02) : 0.45 + (SIy - 15) * 0.02; l.pensionRate = U.clamp(rt, 0.4, 0.75); l.pensionInc = avg * l.pensionRate; }
        else l.pensionInc = inc * 0.55; // lương hưu tính theo lương lúc nghỉ hưu lần đầu
      }
      var kidHeir = c.cat === 'biz' ? l.kids.filter(function (k) { return k.alive && a - k.born >= 25; })[0] : null;
      if (c.cat === 'biz' && !firstRet) log('Khép lại việc kinh doanh tuổi già sau ' + (l.job.yrs || 1) + ' năm, giờ chỉ vui với con cháu.', 'big');
      else if (kidHeir) { log('Giao lại ' + (l.job.p || 'cơ nghiệp') + ' cho con ' + kidHeir.name + ' sau ' + l.workYrs + ' năm gây dựng, lui về làm "cố vấn".', 'big'); H.mem(l, 'Ngày trao chìa khóa cửa hàng cho con.', 5); }
      else log((l.pensioned ? 'Nghỉ hưu, nhận lương hưu hằng tháng' : c.cat === 'biz' ? 'Sang nhượng lại việc kinh doanh, nghỉ ngơi tuổi già' : 'Thôi làm việc vì tuổi cao sức yếu') + ' sau ' + l.workYrs + ' năm lao động' + (c.ladder ? ', quân hàm ' + c.t[l.job.rank] : '') + '.', 'big');
      if (firstRet) H.mem(l, 'Buổi chia tay đồng nghiệp ngày nghỉ hưu.', 3);
      if (firstRet || !l.peakTitle) l.peakTitle = jobTitleOf(l);
      l.retired = true; l.job = null; l.flags.retOnce = true;
      // còn khỏe, có vốn: được hỏi có muốn kinh doanh / làm thêm sau khi nghỉ hưu không
      if (firstRet && a <= 66 && l.st.hea >= 45 && c.cat !== 'biz' && E.netWorth(l) - (l.houseVal || 0) > l.base * 1.2) H.sched(l, 'sau_huu', 1);
    }
    return inc;
  }

  function careerSummary(l) {
    var h = l.jobsHist || [];
    if (!h.length) return l.retired ? 'Làm việc ' + l.workYrs + ' năm rồi nghỉ hưu.' : '';
    var main = h.map(function (x, i) { return { id: x.id, len: (h[i + 1] ? h[i + 1].from : l.age) - x.from }; }).sort(function (a, b) { return b.len - a.len; })[0];
    var c = CAR[resolveJob(main.id)];
    var t = l.peakTitle || (l.job && l.job.id === main.id ? jobTitleOf(l) : c.t[0]);
    var s = c.sec === 'crime' ? 'Sống bằng nghề ' + c.t[0] + '.' : c.fame ? 'Làm ' + c.t[0] + (l.fame >= 1e5 ? ', từng có ' + fmtFollowers(l.fame) + ' người theo dõi' : '') + '.' :
      'Làm ' + t + (main.len > 1 ? ' suốt ' + main.len + ' năm' : '') + '.';
    if (l.retired) s += l.pensioned ? ' Nghỉ hưu sau ' + l.workYrs + ' năm lao động.' : ' Làm lụng ' + l.workYrs + ' năm, đến khi tuổi già sức yếu mới thôi.';
    return s;
  }

  E.resolveJob = resolveJob; E.jobLabel = jobLabel; E.jobTitleOf = jobTitleOf; E.offerHint = offerHint; E.offerAI = offerAI; E.offers = offers;
  // v5.6.3: nguy cơ bị cắt giảm nhân sự (0–1) theo vị trí, thâm niên, tuổi và đặc thù nghề
  var NOT_STAFF = /^(tx_cn|xe_om|shipper|ve_chai|ve_so|ban_rong|makeup|stylist|nhiep_anh|mc_su_kien|dj|tho_xam|hoa_si|cay_thue|gia_su|pt_gym|nhac_si|bien_kich|dao_dien|streamer|youtuber|kol_live|fl_)/;
  var SECURE = /^(phi_cong|bac_si|dieu_duong|duoc_si|nha_si|giang_vien|nghien_cuu|kiem_toan|luat_su)$/;
  function layoffRisk(l) {
    if (!l.job || l.job.fam || E.isStableService(l) || !H.isEmployee(l)) return 0;
    var c = CAR[resolveJob(l.job.id)]; if (!c || c.fame || c.sec === 'crime' || NOT_STAFF.test(c.id)) return 0;
    var n = c.t.length, rk = l.job.rank || 0, k = 1;
    if (n > 1 && rk >= n - 1) return 0; // người đứng đầu (giám đốc, cơ trưởng huấn luyện, tổng quản lý…) không nằm trong danh sách cắt giảm
    if (n >= 4 && rk >= n - 2) k *= 0.35;
    if (rk > 0 && (l.job.yrs || 0) < 1) k *= 0.3; // vừa được đề bạt
    if ((l.job.yrs || 0) >= 8) k *= 0.7;
    if (l.age >= 57) k *= 0.5;
    if (SECURE.test(c.id)) k *= 0.4;
    return k;
  }
  E.layoffRisk = layoffRisk;
  E.isFreelanceJob = function (l) { return !!(l.job && NOT_STAFF.test(resolveJob(l.job.id))); };
  E.startJob = startJob; E.startRank = startRank; E.offerLabel = offerLabel; E.careerYear = careerYear; E.isCrime = isCrime; E.careerSummary = careerSummary; E.monthlyEst = monthlyEst;
  E.jobEligible = eligible; E.rankBySkill = rankBySkill; E.fameMonthly = fameMonthly; E.fmtFollowers = fmtFollowers; E.jobDef = J; E.CAT = CAT; E.JOB_ALIAS = ALIAS; E.medal = medal;
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
