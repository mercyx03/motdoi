/* Dữ liệu Việt Nam: 63 tỉnh thành (trước 1/7/2025), 34 tỉnh thành (sau sáp nhập), 54 dân tộc.
   Số liệu dân số làm tròn theo Niên giám Thống kê 2023 (nghìn người); tỷ lệ đô thị & chỉ số thu nhập
   tương đối (1.0 = trung bình cả nước) là ước tính từ GSO/VHLSS, chỉ dùng để mô phỏng. */
(function (G) {
  'use strict';
  // [tên tỉnh cũ, vùng, dân số (nghìn), % đô thị, chỉ số thu nhập, tỉnh mới (sau 2025), đô thị trung tâm, ven biển?]
  var RAW63 = [
    ['Hà Nội', 'DBSH', 8436, 49, 1.55, 'Hà Nội', 'Hà Nội', 0],
    ['Hà Giang', 'MNPB', 911, 16, 0.45, 'Tuyên Quang', 'thành phố Hà Giang', 0],
    ['Cao Bằng', 'MNPB', 547, 25, 0.5, 'Cao Bằng', 'thành phố Cao Bằng', 0],
    ['Bắc Kạn', 'MNPB', 327, 21, 0.55, 'Thái Nguyên', 'thành phố Bắc Kạn', 0],
    ['Tuyên Quang', 'MNPB', 805, 15, 0.65, 'Tuyên Quang', 'thành phố Tuyên Quang', 0],
    ['Lào Cai', 'MNPB', 770, 24, 0.95, 'Lào Cai', 'thành phố Lào Cai', 0],
    ['Điện Biên', 'MNPB', 640, 19, 0.45, 'Điện Biên', 'thành phố Điện Biên Phủ', 0],
    ['Lai Châu', 'MNPB', 482, 18, 0.5, 'Lai Châu', 'thành phố Lai Châu', 0],
    ['Sơn La', 'MNPB', 1300, 15, 0.55, 'Sơn La', 'thành phố Sơn La', 0],
    ['Yên Bái', 'MNPB', 846, 21, 0.6, 'Lào Cai', 'thành phố Yên Bái', 0],
    ['Hòa Bình', 'MNPB', 880, 18, 0.65, 'Phú Thọ', 'thành phố Hòa Bình', 0],
    ['Thái Nguyên', 'MNPB', 1336, 37, 1.2, 'Thái Nguyên', 'thành phố Thái Nguyên', 0],
    ['Lạng Sơn', 'MNPB', 802, 21, 0.6, 'Lạng Sơn', 'thành phố Lạng Sơn', 0],
    ['Quảng Ninh', 'DBSH', 1381, 67, 1.75, 'Quảng Ninh', 'thành phố Hạ Long', 1],
    ['Bắc Giang', 'MNPB', 1922, 23, 1.0, 'Bắc Ninh', 'thành phố Bắc Giang', 0],
    ['Phú Thọ', 'MNPB', 1516, 19, 0.75, 'Phú Thọ', 'thành phố Việt Trì', 0],
    ['Vĩnh Phúc', 'DBSH', 1213, 30, 1.25, 'Phú Thọ', 'thành phố Vĩnh Yên', 0],
    ['Bắc Ninh', 'DBSH', 1488, 33, 1.6, 'Bắc Ninh', 'thành phố Bắc Ninh', 0],
    ['Hải Dương', 'DBSH', 1957, 32, 1.05, 'Hải Phòng', 'thành phố Hải Dương', 0],
    ['Hải Phòng', 'DBSH', 2131, 46, 1.6, 'Hải Phòng', 'Hải Phòng', 1],
    ['Hưng Yên', 'DBSH', 1302, 17, 1.05, 'Hưng Yên', 'thành phố Hưng Yên', 0],
    ['Thái Bình', 'DBSH', 1880, 12, 0.8, 'Hưng Yên', 'thành phố Thái Bình', 1],
    ['Hà Nam', 'DBSH', 885, 25, 0.95, 'Ninh Bình', 'thành phố Phủ Lý', 0],
    ['Nam Định', 'DBSH', 1887, 19, 0.75, 'Ninh Bình', 'thành phố Nam Định', 1],
    ['Ninh Bình', 'DBSH', 1010, 23, 0.95, 'Ninh Bình', 'thành phố Hoa Lư', 1],
    ['Thanh Hóa', 'BTB', 3760, 19, 0.8, 'Thanh Hóa', 'thành phố Thanh Hóa', 1],
    ['Nghệ An', 'BTB', 3442, 16, 0.7, 'Nghệ An', 'thành phố Vinh', 1],
    ['Hà Tĩnh', 'BTB', 1323, 22, 0.85, 'Hà Tĩnh', 'thành phố Hà Tĩnh', 1],
    ['Quảng Bình', 'BTB', 916, 21, 0.75, 'Quảng Trị', 'thành phố Đồng Hới', 1],
    ['Quảng Trị', 'BTB', 650, 31, 0.8, 'Quảng Trị', 'thành phố Đông Hà', 1],
    ['Thừa Thiên Huế', 'BTB', 1166, 52, 0.85, 'Huế', 'Huế', 1],
    ['Đà Nẵng', 'NTB', 1245, 87, 1.35, 'Đà Nẵng', 'Đà Nẵng', 1],
    ['Quảng Nam', 'NTB', 1519, 27, 0.85, 'Đà Nẵng', 'thành phố Tam Kỳ', 1],
    ['Quảng Ngãi', 'NTB', 1248, 18, 0.95, 'Quảng Ngãi', 'thành phố Quảng Ngãi', 1],
    ['Bình Định', 'NTB', 1504, 33, 0.85, 'Gia Lai', 'thành phố Quy Nhơn', 1],
    ['Phú Yên', 'NTB', 877, 30, 0.75, 'Đắk Lắk', 'thành phố Tuy Hòa', 1],
    ['Khánh Hòa', 'NTB', 1253, 50, 1.0, 'Khánh Hòa', 'thành phố Nha Trang', 1],
    ['Ninh Thuận', 'NTB', 598, 36, 0.8, 'Khánh Hòa', 'thành phố Phan Rang – Tháp Chàm', 1],
    ['Bình Thuận', 'NTB', 1250, 39, 0.9, 'Lâm Đồng', 'thành phố Phan Thiết', 1],
    ['Kon Tum', 'TN', 580, 32, 0.65, 'Quảng Ngãi', 'thành phố Kon Tum', 0],
    ['Gia Lai', 'TN', 1590, 30, 0.75, 'Gia Lai', 'thành phố Pleiku', 0],
    ['Đắk Lắk', 'TN', 1918, 25, 0.75, 'Đắk Lắk', 'thành phố Buôn Ma Thuột', 0],
    ['Đắk Nông', 'TN', 680, 16, 0.7, 'Lâm Đồng', 'thành phố Gia Nghĩa', 0],
    ['Lâm Đồng', 'TN', 1332, 38, 0.95, 'Lâm Đồng', 'thành phố Đà Lạt', 0],
    ['Bình Phước', 'DNB', 1046, 24, 0.95, 'Đồng Nai', 'thành phố Đồng Xoài', 0],
    ['Tây Ninh', 'DNB', 1190, 31, 0.95, 'Tây Ninh', 'thành phố Tây Ninh', 0],
    ['Bình Dương', 'DNB', 2763, 84, 1.45, 'TP. Hồ Chí Minh', 'thành phố Thủ Dầu Một', 0],
    ['Đồng Nai', 'DNB', 3255, 44, 1.2, 'Đồng Nai', 'thành phố Biên Hòa', 0],
    ['Bà Rịa – Vũng Tàu', 'DNB', 1187, 51, 1.6, 'TP. Hồ Chí Minh', 'thành phố Vũng Tàu', 1],
    ['TP. Hồ Chí Minh', 'DNB', 9456, 78, 1.6, 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 1],
    ['Long An', 'DBSCL', 1735, 17, 1.05, 'Tây Ninh', 'thành phố Tân An', 0],
    ['Tiền Giang', 'DBSCL', 1790, 16, 0.85, 'Đồng Tháp', 'thành phố Mỹ Tho', 1],
    ['Bến Tre', 'DBSCL', 1300, 10, 0.75, 'Vĩnh Long', 'thành phố Bến Tre', 1],
    ['Trà Vinh', 'DBSCL', 1020, 18, 0.75, 'Vĩnh Long', 'thành phố Trà Vinh', 1],
    ['Vĩnh Long', 'DBSCL', 1030, 18, 0.8, 'Vĩnh Long', 'thành phố Vĩnh Long', 0],
    ['Đồng Tháp', 'DBSCL', 1600, 18, 0.75, 'Đồng Tháp', 'thành phố Cao Lãnh', 0],
    ['An Giang', 'DBSCL', 1910, 31, 0.7, 'An Giang', 'thành phố Long Xuyên', 0],
    ['Kiên Giang', 'DBSCL', 1750, 28, 0.85, 'An Giang', 'thành phố Rạch Giá', 1],
    ['Cần Thơ', 'DBSCL', 1250, 70, 1.0, 'Cần Thơ', 'Cần Thơ', 0],
    ['Hậu Giang', 'DBSCL', 730, 28, 0.75, 'Cần Thơ', 'thành phố Vị Thanh', 0],
    ['Sóc Trăng', 'DBSCL', 1200, 33, 0.7, 'Cần Thơ', 'thành phố Sóc Trăng', 1],
    ['Bạc Liêu', 'DBSCL', 920, 28, 0.8, 'Cà Mau', 'thành phố Bạc Liêu', 1],
    ['Cà Mau', 'DBSCL', 1210, 23, 0.75, 'Cà Mau', 'thành phố Cà Mau', 1]
  ];

  // 34 đơn vị sau sáp nhập 2025; cập nhật loại đơn vị đến tháng 10/2026.
  // Giữ thứ tự / ID để tương thích bản lưu cũ.
  var NEW34 = [
    ['Hà Nội', 'Thành phố'], ['Huế', 'Thành phố'], ['Hải Phòng', 'Thành phố'], ['Đà Nẵng', 'Thành phố'],
    ['TP. Hồ Chí Minh', 'Thành phố'], ['Cần Thơ', 'Thành phố'],
    ['Lai Châu', 'Tỉnh'], ['Điện Biên', 'Tỉnh'], ['Sơn La', 'Tỉnh'], ['Lạng Sơn', 'Tỉnh'], ['Quảng Ninh', 'Thành phố'],
    ['Thanh Hóa', 'Tỉnh'], ['Nghệ An', 'Tỉnh'], ['Hà Tĩnh', 'Tỉnh'], ['Cao Bằng', 'Tỉnh'],
    ['Tuyên Quang', 'Tỉnh'], ['Lào Cai', 'Tỉnh'], ['Thái Nguyên', 'Tỉnh'], ['Phú Thọ', 'Tỉnh'], ['Bắc Ninh', 'Thành phố'],
    ['Hưng Yên', 'Tỉnh'], ['Ninh Bình', 'Tỉnh'], ['Quảng Trị', 'Tỉnh'], ['Quảng Ngãi', 'Tỉnh'], ['Gia Lai', 'Tỉnh'],
    ['Khánh Hòa', 'Tỉnh'], ['Lâm Đồng', 'Tỉnh'], ['Đắk Lắk', 'Tỉnh'], ['Đồng Nai', 'Thành phố'], ['Tây Ninh', 'Tỉnh'],
    ['Vĩnh Long', 'Tỉnh'], ['Đồng Tháp', 'Tỉnh'], ['Cà Mau', 'Tỉnh'], ['An Giang', 'Tỉnh']
  ];

  var REGIONS = {
    MNPB: 'Trung du và miền núi phía Bắc', DBSH: 'Đồng bằng sông Hồng', BTB: 'Bắc Trung Bộ',
    NTB: 'Duyên hải Nam Trung Bộ', TN: 'Tây Nguyên', DNB: 'Đông Nam Bộ', DBSCL: 'Đồng bằng sông Cửu Long'
  };

  var P63 = RAW63.map(function (r, i) {
    return { id: i, name: r[0], region: r[1], pop: r[2], urban: r[3] / 100, wealth: r[4], newName: r[5], city: r[6], coast: !!r[7] };
  });
  var byName = {};
  P63.forEach(function (p) { byName[p.name] = p; });

  var P34 = NEW34.map(function (r, i) {
    var members = P63.filter(function (p) { return p.newName === r[0]; });
    var pop = members.reduce(function (s, p) { return s + p.pop; }, 0);
    return { id: i, name: r[0], kind: r[1], members: members, pop: pop };
  });

  // 54 dân tộc: [tên, dân số 2019, kiểu tên, tỉnh cư trú chính (tên tỉnh cũ), hồ sơ tôn giáo, hệ số kinh tế, nhóm nhà ở]
  var ETH_RAW = [
    ['Kinh', 82085826, 'kinh', null, 'kinh', 0, 'kinh'],
    ['Tày', 1845492, 'tay', 'Cao Bằng,Lạng Sơn,Bắc Kạn,Tuyên Quang,Hà Giang,Thái Nguyên,Lào Cai,Yên Bái,Đắk Lắk', 'trad', -0.6, 'san'],
    ['Thái', 1820950, 'thai', 'Sơn La,Điện Biên,Nghệ An,Thanh Hóa,Lai Châu,Yên Bái,Hòa Bình', 'trad', -0.8, 'san'],
    ['Mường', 1452095, 'muong', 'Hòa Bình,Thanh Hóa,Phú Thọ,Sơn La,Ninh Bình', 'trad', -0.6, 'san'],
    ['Mông', 1393547, 'hmong', 'Hà Giang,Điện Biên,Sơn La,Lào Cai,Lai Châu,Yên Bái,Cao Bằng,Nghệ An', 'hmong', -1.6, 'trinh'],
    ['Khmer', 1319652, 'khmer', 'Sóc Trăng,Trà Vinh,Kiên Giang,An Giang,Bạc Liêu,Cà Mau', 'khmer', -0.8, 'kinh'],
    ['Nùng', 1083298, 'tay', 'Lạng Sơn,Cao Bằng,Hà Giang,Bắc Giang,Thái Nguyên,Đắk Lắk', 'trad', -0.8, 'san'],
    ['Dao', 891151, 'dao', 'Hà Giang,Tuyên Quang,Lào Cai,Yên Bái,Quảng Ninh,Cao Bằng,Bắc Kạn', 'trad', -1.2, 'dat'],
    ['Hoa', 749466, 'hoa', 'TP. Hồ Chí Minh,Đồng Nai,Sóc Trăng,Kiên Giang,Bạc Liêu,Quảng Ninh', 'hoa', 0.4, 'kinh'],
    ['Gia Rai', 513930, 'tn', 'Gia Lai,Kon Tum', 'tn', -1.1, 'san'],
    ['Ê Đê', 398671, 'tn', 'Đắk Lắk,Phú Yên', 'tn', -1.0, 'dai'],
    ['Ba Na', 286910, 'tn', 'Gia Lai,Kon Tum,Bình Định', 'tn', -1.2, 'san'],
    ['Xơ Đăng', 212277, 'tn', 'Kon Tum,Quảng Nam,Quảng Ngãi', 'tn', -1.3, 'san'],
    ['Sán Chay', 201398, 'tay', 'Thái Nguyên,Tuyên Quang,Bắc Giang', 'trad', -0.8, 'san'],
    ['Cơ Ho', 200800, 'tn', 'Lâm Đồng', 'tn', -1.0, 'san'],
    ['Chăm', 178948, 'cham', 'Ninh Thuận,Bình Thuận,An Giang,TP. Hồ Chí Minh', 'cham', -0.8, 'kinh'],
    ['Sán Dìu', 183004, 'tay', 'Thái Nguyên,Vĩnh Phúc,Bắc Giang,Quảng Ninh', 'trad', -0.5, 'dat'],
    ['Hrê', 149460, 'tn', 'Quảng Ngãi', 'trad', -1.3, 'san'],
    ['Ra Glai', 146613, 'tn', 'Ninh Thuận,Khánh Hòa', 'trad', -1.4, 'san'],
    ['Mnông', 127334, 'tn', 'Đắk Nông,Đắk Lắk', 'tn', -1.3, 'san'],
    ['Xtiêng', 100752, 'tn', 'Bình Phước', 'tn', -1.1, 'san'],
    ['Bru - Vân Kiều', 94598, 'ts', 'Quảng Trị,Quảng Bình', 'trad', -1.4, 'san'],
    ['Thổ', 91430, 'muong', 'Nghệ An,Thanh Hóa', 'trad', -0.9, 'dat'],
    ['Khơ Mú', 90612, 'north', 'Nghệ An,Điện Biên,Sơn La', 'trad', -1.5, 'san'],
    ['Cơ Tu', 74173, 'ts', 'Quảng Nam,Thừa Thiên Huế', 'trad', -1.2, 'san'],
    ['Giáy', 67858, 'north', 'Lào Cai,Hà Giang,Lai Châu', 'trad', -1.0, 'dat'],
    ['Giẻ Triêng', 63322, 'tn', 'Kon Tum,Quảng Nam', 'trad', -1.3, 'san'],
    ['Tà Ôi', 52356, 'ts', 'Thừa Thiên Huế,Quảng Trị', 'trad', -1.2, 'san'],
    ['Mạ', 50322, 'tn', 'Lâm Đồng,Đắk Nông', 'tn', -1.1, 'san'],
    ['Co', 40442, 'tn', 'Quảng Ngãi,Quảng Nam', 'trad', -1.2, 'san'],
    ['Chơ Ro', 29520, 'tn', 'Đồng Nai,Bà Rịa – Vũng Tàu', 'trad', -0.8, 'san'],
    ['Xinh Mun', 29503, 'north', 'Sơn La,Điện Biên', 'trad', -1.5, 'san'],
    ['Hà Nhì', 25539, 'north', 'Lai Châu,Lào Cai,Điện Biên', 'trad', -1.4, 'trinh'],
    ['Chu Ru', 23242, 'tn', 'Lâm Đồng,Ninh Thuận', 'tn', -1.0, 'san'],
    ['Lào', 17532, 'thai', 'Điện Biên,Lai Châu,Sơn La', 'buddh', -1.0, 'san'],
    ['Kháng', 16180, 'north', 'Sơn La,Điện Biên,Lai Châu', 'trad', -1.5, 'san'],
    ['La Chí', 15126, 'north', 'Hà Giang', 'trad', -1.4, 'san'],
    ['Phù Lá', 12471, 'north', 'Lào Cai,Hà Giang,Sơn La', 'trad', -1.4, 'dat'],
    ['La Hủ', 12113, 'north', 'Lai Châu', 'trad', -1.7, 'dat'],
    ['La Ha', 10157, 'north', 'Sơn La', 'trad', -1.4, 'san'],
    ['Pà Thẻn', 8248, 'north', 'Hà Giang,Tuyên Quang', 'trad', -1.4, 'dat'],
    ['Chứt', 7513, 'ts', 'Quảng Bình', 'trad', -1.6, 'san'],
    ['Lự', 6757, 'thai', 'Lai Châu', 'buddh', -1.3, 'san'],
    ['Lô Lô', 4827, 'north', 'Hà Giang,Cao Bằng', 'trad', -1.4, 'trinh'],
    ['Mảng', 4650, 'north', 'Lai Châu', 'trad', -1.7, 'san'],
    ['Cơ Lao', 4003, 'north', 'Hà Giang', 'trad', -1.5, 'trinh'],
    ['Bố Y', 3232, 'north', 'Lào Cai,Hà Giang', 'trad', -1.3, 'dat'],
    ['Cống', 2729, 'north', 'Lai Châu,Điện Biên', 'trad', -1.6, 'san'],
    ['Ngái', 1649, 'hoa', 'Quảng Ninh,Bắc Giang', 'hoa', -0.6, 'dat'],
    ['Si La', 909, 'north', 'Lai Châu,Điện Biên', 'trad', -1.6, 'dat'],
    ['Pu Péo', 903, 'north', 'Hà Giang', 'trad', -1.4, 'trinh'],
    ['Rơ Măm', 639, 'tn', 'Kon Tum', 'trad', -1.5, 'san'],
    ['Brâu', 525, 'tn', 'Kon Tum', 'trad', -1.6, 'san'],
    ['Ơ Đu', 428, 'north', 'Nghệ An', 'trad', -1.5, 'san']
  ];

  // Tỷ lệ quay: Kinh cố định 86%, 53 dân tộc còn lại chia 14% theo dân số thực tế (Tổng điều tra 2019)
  var minorityTotal = ETH_RAW.slice(1).reduce(function (s, e) { return s + e[1]; }, 0);
  var ETH = ETH_RAW.map(function (e, i) {
    return {
      id: i, name: e[0], pop: e[1], style: e[2],
      homes: e[3] ? e[3].split(',') : null, rel: e[4], econ: e[5], house: e[6],
      share: i === 0 ? 0.86 : 0.14 * e[1] / minorityTotal
    };
  });

  // Hồ sơ tôn giáo (ước tính theo Tổng điều tra 2019 & Ban Tôn giáo Chính phủ)
  var RELIGION = {
    kinh: 'Không theo tôn giáo (thờ cúng tổ tiên):72,Phật giáo:15,Công giáo:7.5,Cao Đài:1.5,Phật giáo Hòa Hảo:1.5,Tin Lành:1',
    trad: 'Tín ngưỡng truyền thống, thờ cúng tổ tiên:85,Tin Lành:8,Công giáo:4,Phật giáo:3',
    hmong: 'Tín ngưỡng truyền thống, thờ cúng tổ tiên:68,Tin Lành:30,Công giáo:2',
    khmer: 'Phật giáo Nam tông:95,Không theo tôn giáo:5',
    hoa: 'Phật giáo & tín ngưỡng dân gian:60,Không theo tôn giáo (thờ cúng tổ tiên):30,Công giáo:6,Tin Lành:4',
    tn: 'Tin Lành:40,Tín ngưỡng truyền thống:38,Công giáo:22',
    cham: 'Bà La Môn (Chăm Bà Chăm):40,Hồi giáo Bà Ni:30,Hồi giáo (Islam):30',
    buddh: 'Phật giáo Nam tông:60,Tín ngưỡng truyền thống:40'
  };

  var HOUSE = {
    kinh: ['nhà cấp bốn', 'nhà ống', 'nhà mái bằng'], san: ['nhà sàn'], trinh: ['nhà trình tường'],
    dat: ['nhà đất mái ngói', 'nhà gỗ'], dai: ['nhà dài truyền thống']
  };

  var RURAL_DESC = {
    MNPB: ['một bản vùng cao', 'một xã miền núi', 'một thôn vùng trung du'],
    DBSH: ['một làng quê đồng bằng', 'một thôn ven đê'],
    BTB: ['một làng quê', 'một xã ven biển', 'một xã vùng bán sơn địa'],
    NTB: ['một xã ven biển', 'một làng chài', 'một xã miền núi'],
    TN: ['một buôn làng Tây Nguyên', 'một xã vùng cao nguyên', 'một thôn trồng cà phê'],
    DNB: ['một xã ven đô', 'một ấp vùng cao su', 'một xã ngoại thành'],
    DBSCL: ['một ấp vùng sông nước', 'một xã ven kênh rạch', 'một cù lao']
  };

  // Chỉ số quốc gia (ước tính 2023-2024, GSO / WB / UN WPP)
  var STATS = {
    pop: 100.3e6, births: 1.35e6, e0: 74.7, e0m: 72.2, e0f: 77.4, u5: 20, gdpPPP: 14.3, gdpNominal: 4.3,
    urban: 0.38, fertility: 1.91, avgIncomeMonth: 7.7 /* triệu đồng/tháng, lao động */, uni: 0.3
  };

  // ===== TÊN NGƯỜI VIỆT & DÂN TỘC =====
  var KINH_SUR = 'Nguyễn:38,Trần:11,Lê:9.5,Phạm:7,Hoàng:3,Huỳnh:2.1,Phan:4.5,Vũ:2,Võ:1.9,Đặng:2.1,Bùi:2,Đỗ:1.4,Hồ:1.3,Ngô:1.3,Dương:1,Lý:0.5,Đinh:0.6,Trịnh:0.5,Đoàn:0.5,Lâm:0.4,Mai:0.4,Trương:0.4,Cao:0.3,Hà:0.4,Lương:0.3,Tạ:0.2,Châu:0.2,Tô:0.2,Thái:0.2,Phùng:0.2,Lưu:0.2,Kiều:0.1,Quách:0.1,Tôn:0.1,La:0.1';
  var NAMES = {
    kinh: {
      sur: KINH_SUR,
      midM: 'Văn:3,Đức:3,Minh:4,Quang:3,Hữu:2,Thành:2,Gia:3,Anh:2,Công:1,Trung:1,Tuấn:1,Hoàng:2,Ngọc:1,Xuân:1,Đình:1,Bảo:3,Nhật:2,Khánh:1,Thanh:1,Chí:1,Duy:1,Quốc:1,Đăng:1,Phúc:1',
      midF: 'Thị:3,Ngọc:3,Thu:2,Thanh:2,Thùy:2,Bảo:3,Khánh:2,Minh:3,Phương:2,Mai:1,Hồng:1,Diệu:1,Kim:1,Hoài:1,Tuệ:1,Gia:2,Như:1,Quỳnh:1,An:1,Hà:1,Tường:1',
      M: 'An,Bảo,Bình,Cường,Dũng,Duy,Đạt,Đức,Hải,Hiếu,Hoàng,Huy,Hùng,Khang,Khoa,Khôi,Kiên,Lâm,Long,Lộc,Minh,Nam,Nghĩa,Nhân,Phát,Phong,Phúc,Quân,Quang,Sơn,Tài,Thắng,Thịnh,Tiến,Toàn,Trí,Trung,Tuấn,Tùng,Việt,Vinh,Vũ,Đăng,Hưng,Khải,Nguyên,Thiện,Tâm',
      fullM: 'Văn An,Văn Bình,Văn Cường,Văn Dũng,Văn Hải,Văn Hùng,Văn Long,Văn Nam,Văn Sơn,Văn Thắng,Văn Toàn,Văn Tuấn,Văn Hậu,Văn Đức,Văn Lâm,Văn Tài,Văn Tiến,Văn Thành,Văn Quyết,Văn Hưng,Văn Khánh,Văn Lực,Văn Phong,Văn Thanh,Đức Anh,Đức Minh,Đức Huy,Đức Thắng,Đức Trung,Đức Long,Đức Mạnh,Đức Tài,Đức Hiếu,Đức Phúc,Đức Duy,Đức Thịnh,Minh Anh,Minh Đức,Minh Hiếu,Minh Hoàng,Minh Khang,Minh Khôi,Minh Nhật,Minh Quân,Minh Tuấn,Minh Trí,Minh Hải,Minh Phúc,Minh Thành,Minh Châu,Minh Long,Quang Huy,Quang Minh,Quang Vinh,Quang Hải,Quang Dũng,Quang Trung,Quang Khải,Quang Đạt,Hữu Phước,Hữu Nghĩa,Hữu Thắng,Hữu Tài,Hữu Lộc,Hữu Trí,Hữu Đạt,Thành Đạt,Thành Long,Thành Nam,Thành Trung,Thành Công,Thành Luân,Gia Bảo,Gia Huy,Gia Khánh,Gia Hưng,Gia Phúc,Gia Khang,Gia Kiệt,Gia Minh,Anh Tuấn,Anh Dũng,Anh Khoa,Anh Quân,Anh Đức,Anh Tú,Công Minh,Công Danh,Công Thành,Công Hậu,Trung Kiên,Trung Hiếu,Trung Dũng,Trung Nghĩa,Trung Đức,Tuấn Anh,Tuấn Kiệt,Tuấn Hưng,Tuấn Khải,Hoàng Long,Hoàng Nam,Hoàng Phúc,Hoàng Anh,Hoàng Minh,Hoàng Việt,Hoàng Hải,Ngọc Hải,Ngọc Sơn,Ngọc Tú,Ngọc Quang,Xuân Trường,Xuân Bách,Xuân Hùng,Xuân Phúc,Đình Trọng,Đình Phong,Đình Khoa,Đình Tuấn,Bảo Long,Bảo Nam,Bảo Khang,Bảo Anh,Bảo Lâm,Nhật Minh,Nhật Huy,Nhật Nam,Nhật Quang,Nhật Duy,Khánh Duy,Khánh Toàn,Khánh Hưng,Khánh Nam,Thanh Tùng,Thanh Sơn,Thanh Bình,Thanh Phong,Thanh Hải,Thanh Tâm,Chí Thanh,Chí Công,Chí Bảo,Chí Hiếu,Duy Mạnh,Duy Khánh,Duy Anh,Duy Hưng,Quốc Bảo,Quốc Anh,Quốc Huy,Quốc Khánh,Quốc Việt,Quốc Trung,Đăng Khoa,Đăng Khôi,Đăng Quang,Phúc Thịnh,Phúc Lâm,Phúc An,Tiến Dũng,Tiến Đạt,Tiến Thành,Mạnh Hùng,Mạnh Cường,Mạnh Tuấn,Việt Hoàng,Việt Anh,Việt Dũng,Hải Đăng,Hải Nam,Hải Long,Thế Anh,Thế Vinh,Thế Hiển,Tấn Phát,Tấn Tài,Tấn Lộc,Phước Lộc,Phước Thiện,Trọng Nhân,Trọng Hiếu,Thiện Nhân,Nguyên Khang,Khôi Nguyên,Minh Nhân,Kim Long,Trường Giang,Sơn Tùng,Tùng Lâm',
      fullF: 'Thị Lan,Thị Hoa,Thị Hồng,Thị Hương,Thị Mai,Thị Nga,Thị Thu,Thị Hạnh,Thị Huyền,Thị Thảo,Thị Hằng,Thị Dung,Thị Loan,Thị Yến,Thị Phương,Thị Ngọc,Thị Thủy,Thị Bích,Thị Liên,Thị Nhung,Thị Trang,Thị Vân,Thị Hà,Thị Thanh,Thị Oanh,Thị Hiền,Thị Tuyết,Thị Kim,Thị Lý,Ngọc Anh,Ngọc Ánh,Ngọc Hân,Ngọc Lan,Ngọc Mai,Ngọc Trâm,Ngọc Diệp,Ngọc Hà,Ngọc Huyền,Ngọc Linh,Ngọc Bích,Ngọc Quỳnh,Thu Hà,Thu Trang,Thu Hương,Thu Thủy,Thu Phương,Thu Hằng,Thu Uyên,Thu Huyền,Thanh Hương,Thanh Hà,Thanh Tâm,Thanh Thảo,Thanh Huyền,Thanh Mai,Thanh Vân,Thanh Nhàn,Thanh Trúc,Thùy Linh,Thùy Dung,Thùy Trang,Thùy Dương,Thùy Chi,Thùy Tiên,Bảo Anh,Bảo Ngọc,Bảo Châu,Bảo Trâm,Bảo Vy,Bảo Hân,Bảo Yến,Khánh Linh,Khánh Huyền,Khánh Ly,Khánh Vy,Khánh Chi,Khánh An,Khánh Ngân,Minh Anh,Minh Thư,Minh Châu,Minh Ngọc,Minh Hằng,Minh Tâm,Minh Khuê,Minh Thùy,Minh Trang,Phương Anh,Phương Linh,Phương Thảo,Phương Uyên,Phương Nhi,Phương Ly,Phương Mai,Mai Anh,Mai Linh,Mai Phương,Mai Chi,Mai Hương,Hồng Nhung,Hồng Hạnh,Hồng Ngọc,Hồng Vân,Hồng Nhung,Diệu Linh,Diệu Thúy,Diệu Hương,Kim Ngân,Kim Chi,Kim Oanh,Kim Thoa,Kim Liên,Hoài Thương,Hoài An,Hoài Linh,Tuệ An,Tuệ Lâm,Tuệ Nhi,Gia Hân,Gia Linh,Gia Như,Như Quỳnh,Như Ý,Quỳnh Anh,Quỳnh Chi,Quỳnh Như,Quỳnh Trang,Quỳnh Hương,Hà My,Hà Phương,Hà Vy,Hà Linh,Hà Anh,Lan Anh,Lan Hương,Lan Phương,Hải Yến,Hải Anh,Hải Vân,Huyền Trang,Huyền My,Mỹ Linh,Mỹ Duyên,Mỹ Hạnh,Cẩm Tú,Cẩm Ly,Cẩm Nhung,Tường Vy,Thảo Nguyên,Thảo Vy,Thảo My,Yến Nhi,Ánh Dương,Ánh Tuyết,Bích Ngọc,Bích Phương,Bích Hằng,Thúy Hằng,Thúy Kiều,Thúy Nga,Vân Anh,Vân Khánh,Trà My,Diễm My,Diễm Quỳnh,Kiều Trang,Kiều Oanh,Tú Anh,Tú Uyên,Nhã Uyên,Nhã Phương,An Nhiên,Đan Thanh,Uyên Nhi,Ngân Hà,Xuân Mai,Xuân Quỳnh,Hồng Ánh,Ngọc Châu,Thục Anh,Thục Trinh,Bảo Trân,Phương Trinh,Thanh Trúc,Ngọc Trinh,Thu Ngân',
      F: 'Anh,Châu,Chi,Dung,Duyên,Giang,Hà,Hân,Hằng,Hạnh,Hiền,Hoa,Hồng,Hương,Huyền,Lan,Linh,Loan,Ly,Mai,My,Nga,Ngân,Ngọc,Nhi,Nhung,Oanh,Phương,Quyên,Quỳnh,Tâm,Thảo,Thư,Thủy,Trang,Trâm,Uyên,Vân,Vy,Yến,An,Tú,Khuê,Diệp,Nhiên,Ngân'
    },
    hmong: {
      sur: 'Giàng:4,Vàng:4,Lý:3,Sùng:3,Thào:3,Hờ:2,Mùa:2,Lầu:2,Vừ:2,Cứ:1,Hạng:1,Tráng:1,Sình:1',
      midM: 'A:5,Seo:2,Mí:1', midF: 'Thị:3,Mí:2,Thị Mỷ:0',
      M: 'Páo,Sính,Chứ,Dình,Pó,Lử,Sử,Chơ,Tủa,Dế,Chá,Lềnh,Sình,Nhà,Tồng,Sùng,Dủa,Phử',
      F: 'Mỷ,Dua,Pà,Dợ,Mai,Lan,Chở,Sua,Dính,Mỉ,Già,Ly,Say,Dở,Sú,Pùa'
    },
    thai: {
      sur: 'Lò:4,Lường:3,Cầm:3,Quàng:2,Hà:2,Vi:2,Tòng:2,Lù:2,Điêu:1,Lộc:1,Mè:1,Bạc:1,Khoàng:1',
      midM: 'Văn:6,Minh:1', midF: 'Thị:6,Thu:1',
      M: 'Ún,Pánh,Thoại,Xôm,Ọn,Chương,Phong,Quý,Tiến,Hoan,Thanh,Bun,Hươn,Sơn,Duy,Hải',
      F: 'Ơn,Xuân,Hoa,Mai,Lả,Phương,Ngọc,Hương,Thoa,Bích,Ánh,Nhung,Hồng,Dung,Uyên'
    },
    tay: {
      sur: 'Nông:3,Hoàng:3,Lục:2,Ma:2,Lương:2,Bế:2,Đàm:2,Triệu:2,Lăng:1,Hà:2,Lành:1,Vi:1,Dương:1,Lý:1,Lộc:1,Chu:1,Mông:1',
      midM: 'Văn:5,Đức:1,Minh:1', midF: 'Thị:5,Thu:1,Hồng:1',
      M: 'Thắng,Khánh,Toàn,Dũng,Hùng,Quyết,Sơn,Tuấn,Nam,Pẻng,Chiến,Kiên,Hải,Đạt,Long,Trường',
      F: 'Hoa,Lan,Mai,Thắm,Hằng,Huệ,Nga,Thu,Hương,Ngọc,Thảo,Phượng,Liên,Thơm,Vân'
    },
    muong: {
      sur: 'Đinh:3,Bùi:4,Quách:2,Bạch:1,Hà:2,Xa:1,Phạm:1,Hoàng:1',
      midM: 'Văn:6,Công:1', midF: 'Thị:6',
      M: 'Lưu,Thắng,Hùng,Khương,Sơn,Tâm,Hòa,Thành,Bình,Dũng,Tuấn,Long,Quân,Toản',
      F: 'Ngọc,Hồng,Huệ,Lan,Mai,Thắm,Hoa,Hương,Liên,Thu,Thanh,Nhàn,Yến,Diệp'
    },
    khmer: {
      sur: 'Thạch:4,Danh:3,Sơn:3,Kim:2,Lâm:2,Châu:1,Lý:1,Kiên:1,Trịnh:1,Mai:1',
      midM: '—:5,Văn:1', midF: 'Thị:5,—:2',
      M: 'Sa Rươne,Sóc,Phol,Rinh,Chanh Đa,Sà Phong,Ca Ri,Pô,Sóc Khiêm,Sơ Phi,Rô Ny,Thươl,Đa Ra,Sô Vanh',
      F: 'Sa Ri,Sô Phi,Pha Ly,Sóc Kha,Chanh Thy,Sô Khom,Mai,Kim Ly,Sà Ra,Thươl,Ny,Đa Ni,Sa Vy'
    },
    dao: {
      sur: 'Triệu:4,Bàn:3,Đặng:3,Lý:2,Chảo:2,Tẩn:2,Phàn:1,Chìu:1,Lò:1',
      midM: 'Văn:4,Seo:2,Kiềm:1,Tòn:1', midF: 'Thị:4,Mẩy:2,Mùi:1',
      M: 'Chàn,Phin,Quẩy,Kiềm,Tả,Sinh,Lở,Chòi,Kháo,Phú,Thanh,Hưng,Lìn,Vạn',
      F: 'Mẩy,Sử,Liều,Phây,Nhất,Dung,Hoa,Lan,Mai,Xuân,Dinh,Chiêu'
    },
    hoa: {
      sur: 'Lâm:3,Trương:3,Quách:2,Lưu:2,Tạ:2,Hứa:2,Lý:2,Mã:2,Diệp:1,Tăng:1,Châu:1,Huỳnh:2,Lư:1,Vương:1',
      midM: 'Vĩnh:2,Gia:2,Tuấn:2,Quốc:2,Kiến:1,Chấn:1,Thiên:1', midF: 'Mỹ:3,Ngọc:2,Tú:2,Bội:1,Gia:2,Uyển:1',
      M: 'Phát,Kiệt,Hào,Vinh,Cường,Huy,Lương,Hưng,Thành,Khang,Minh,Tường,Long,Phong',
      F: 'Linh,Ngân,Anh,Doanh,Trân,Quyên,Hà,Lệ,Mẫn,Như,Uyển,Dĩnh,Tuyết,Yến'
    },
    cham: {
      sur: 'Đàng:3,Thông:2,Thiên Sanh:1,Lưu:2,Quảng:2,Châu:1,Bá:1,Thuận:1,Mohamad:1,Sa:1',
      midM: 'Văn:3,—:2', midF: 'Thị:4,—:1',
      M: 'Năng,Thành,Phú,Tài,Sakaya,Inrasara,Hảo,Lộc,Hải,Ali,Ismail,Kha,Trí,Tấn',
      F: 'Ka Pal,Hồng,Mỹ,Khuê,Aisah,Fatimah,Lan,Hạnh,Nữ,Như,Nhung,Phương,Thu'
    },
    tn: { // Gia Rai, Ê Đê, Ba Na, Xơ Đăng, Cơ Ho, Mnông... (họ đứng sau, nữ có tiền tố H')
      sur: 'Ksor:3,Rơ Mah:2,Siu:2,Rah Lan:1,Kpă:2,Nay:2,Niê:3,Mlô:1,Êban:1,Byă:1,Adrơng:1,Hwing:1,Đinh:2,K\'Dăm:1,Ka:1,Y:0',
      midM: 'Y:4,A:2,—:2', midF: 'H\':6,—:1',
      M: 'Rin,Bhăm,Đen,Ngọc,Blúp,Khuê,Hiên,Thuần,Sơn,Kông,Dhiêng,Plô,Wưu,Jứ,Bơ,Tlang',
      F: 'Lan,Hen,Nhi,Bia,Ble,Mai,Uyên,Thoa,Duyên,Ngân,Nga,Huê,Djuê,Pai,Lang'
    },
    ts: { // Trường Sơn: Bru - Vân Kiều, Cơ Tu, Tà Ôi, Chứt
      sur: 'Hồ:5,A Lăng:2,Bríu:1,Zơ Râm:1,Pả:1,Kăn:1,Côn:1,Đinh:1,Arâl:1,Bh\'riu:1',
      midM: 'Văn:5,—:1', midF: 'Thị:5,—:1',
      M: 'Đức,Ka,Lơi,Phúc,Hiếu,Nhân,Tâm,Kiên,Bơn,Pao,Thoi,Viên,Bình,Khoa',
      F: 'Thoa,Nga,Hiền,Lan,Phương,Mai,Hoa,Bông,Hồng,Thu,Thảo,Linh,Trang'
    },
    north: { // các dân tộc ít người phía Bắc
      sur: 'Lò:3,Lý:3,Vàng:2,Hoàng:2,Ma:2,Lù:2,Pờ:1,Chu:1,Phàn:1,Chảo:1,Lồ:1,Vi:1,Lô:1,Sần:1,Thào:1',
      midM: 'Văn:4,A:2,Seo:1,Lao:1', midF: 'Thị:5,Mí:1',
      M: 'Chung,Sáng,Pao,Chơ,Diu,Sinh,Lả,Lù,Tà,Kim,Sơn,Hùng,Thành,Tuyên',
      F: 'Mỷ,Dâu,Mai,Hoa,Lan,Phương,Hương,Thu,Xuân,Pa,Chi,Thanh'
    }
  };

  function parseW(spec) { return spec.split(',').map(function (s) { var p = s.split(':'); return [p[0], p.length > 1 ? +p[1] : 1]; }); }
  var NAMEP = {};
  Object.keys(NAMES).forEach(function (k) {
    var n = NAMES[k];
    NAMEP[k] = { sur: parseW(n.sur), midM: parseW(n.midM), midF: parseW(n.midF), M: n.M.split(','), F: n.F.split(','), fullM: n.fullM ? n.fullM.split(',') : null, fullF: n.fullF ? n.fullF.split(',') : null };
  });

  function vnName(r, style, sex, surname) {
    var U = G.U, p = NAMEP[style] || NAMEP.kinh;
    var sur = surname || U.wpick(r, p.sur, function (x) { return x[1]; })[0];
    var fl = sex === 'F' ? p.fullF : p.fullM;
    if (fl && style === 'kinh') { // v3.5: tên đệm + tên gọi có thật, không ghép ngẫu nhiên; tránh trùng họ với tên gọi ("Hà Thu Hà")
      var nm = '';
      for (var t = 0; t < 6; t++) { nm = U.wpick(r, fl, function (x) { return /^(Văn|Thị) /.test(x) ? 0.55 : 1; }); var w = nm.split(' '); if (w[w.length - 1] !== sur && w[0] !== sur) break; }
      return { full: sur + ' ' + nm, sur: sur };
    }
    var mid = U.wpick(r, sex === 'F' ? p.midF : p.midM, function (x) { return x[1]; })[0];
    var given = U.pick(r, sex === 'F' ? p.F : p.M);
    if (mid === '—') mid = '';
    var parts;
    if (style === 'tn') {
      // Kiểu Tây Nguyên: Y Rin Niê / H'Lan Ksor (tên trước, họ sau)
      if (mid === "H'") return { full: "H'" + given + ' ' + sur, sur: sur };
      parts = [mid, given, sur];
    } else if (style === 'hmong' && mid === 'A') {
      parts = [sur, 'A', given];
    } else parts = [sur, mid, given];
    return { full: parts.filter(Boolean).join(' '), sur: sur };
  }

  G.VN = {
    P63: P63, P34: P34, byName: byName, ETH: ETH, REGIONS: REGIONS, RELIGION: RELIGION,
    HOUSE: HOUSE, RURAL_DESC: RURAL_DESC, STATS: STATS, vnName: vnName,
    ethByName: function (n) { for (var i = 0; i < ETH.length; i++) if (ETH[i].name === n) return ETH[i]; return null; }
  };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
