/* Một Đời — 9.8.9 bối cảnh theo vùng, tỉnh của Việt Nam và bổ sung sự kiện cả nước 1990–2025.
   REG: [[nơi], từ, đến, giai đoạn của vùng, đời sống]; REV: [năm, [nơi], sự kiện, mức 1|2, sắc thái]. Nơi = tên tỉnh (cũ hoặc sau sắp xếp 2025) hoặc mã vùng '@DBSCL'.
   Nguồn thứ cấp (bách khoa, báo chí), đối chiếu 23/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] }); D.REG = D.REG || {}; D.REV = D.REV || {};
  var BAC = ['@MNPB', '@DBSH', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình'];
  var NAM = ['Quảng Trị', 'Thừa Thiên Huế', 'Huế', '@NTB', '@TN', '@DNB', '@DBSCL'];
  var BIEN_GIOI_BAC = ['Lạng Sơn', 'Cao Bằng', 'Hà Giang', 'Lào Cai', 'Lai Châu', 'Quảng Ninh', 'Điện Biên', 'Tuyên Quang'];
  var MIEN_TRUNG = ['Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Huế', 'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa'];
  D.REG.VN = (D.REG.VN || []).concat([
    [['@MNPB'], 1900, 1944, 'miền núi thời Pháp thuộc', 'Đồng bào các dân tộc làm nương rẫy, đi chợ phiên; đồn binh Pháp ở thị trấn, mỏ thiếc Tĩnh Túc, mỏ kẽm, mỏ than'],
    [['@DBSCL', '@DNB'], 1900, 1944, 'Nam Kỳ thuộc địa', 'Đồn điền cao su miền Đông, ruộng lúa bát ngát miền Tây của điền chủ; tá điền vay nợ, nộp tô; Sài Gòn – Chợ Lớn sầm uất'],
    [BAC, 1955, 1975, 'miền Bắc xây dựng chủ nghĩa xã hội', 'Hợp tác xã nông nghiệp, tem phiếu, nhà trẻ của hợp tác xã; từ 1965 máy bay Mỹ ném bom, trẻ em sơ tán về nông thôn, thanh niên lên đường ra mặt trận'],
    [NAM, 1955, 1975, 'Việt Nam Cộng hòa ở miền Nam', 'Kinh tế thị trường có viện trợ Mỹ, xe Honda, đài phát thanh, tân nhạc ở thành thị; chiến sự ở nông thôn, ấp chiến lược, thanh niên đến tuổi phải đi quân dịch'],
    [['Quảng Trị'], 1972, 1975, 'vùng giới tuyến sau mùa hè đỏ lửa', 'Thành cổ Quảng Trị bị tàn phá năm 1972, nhiều làng trắng đất; bom mìn còn sót lại khắp nơi'],
    [NAM, 1976, 1985, 'miền Nam sau ngày thống nhất', 'Cải tạo công thương nghiệp, đổi tiền, nhiều gia đình đi vùng kinh tế mới; người từng làm việc cho chính quyền cũ đi học tập cải tạo; làn sóng vượt biển'],
    [BIEN_GIOI_BAC, 1979, 1991, 'vùng biên giới phía Bắc sau chiến tranh', 'Thị xã Lạng Sơn, Cao Bằng, Lào Cai bị tàn phá năm 1979; giao tranh kéo dài ở Vị Xuyên (Hà Giang) tới cuối thập niên 1980, đồng bào sơ tán khỏi vành đai biên giới'],
    [BIEN_GIOI_BAC, 1992, 2025, 'biên mậu và cửa khẩu', 'Cửa khẩu mở lại, buôn bán qua biên giới nhộn nhịp; vẫn còn rà phá bom mìn ở các huyện biên giới'],
    [['@TN'], 1976, 1995, 'kinh tế mới ở Tây Nguyên', 'Nông trường, lâm trường; người Kinh từ miền Bắc, miền Trung lên khai hoang; đời sống đồng bào bản địa còn rất khó khăn'],
    [['@TN'], 1996, 2025, 'thủ phủ cà phê', 'Cà phê, hồ tiêu, sầu riêng làm giàu rồi lại lao đao theo giá; rừng bị thu hẹp, di dân tự do; mùa khô thiếu nước tưới'],
    [['@DNB'], 1996, 2025, 'vùng khu công nghiệp', 'Bình Dương, Đồng Nai thu hút hàng triệu công nhân từ khắp nơi, xóm trọ mọc lên quanh khu công nghiệp; TP. Hồ Chí Minh là đầu tàu kinh tế'],
    [['@DBSCL'], 1986, 2014, 'vựa lúa và thủy sản', 'Ba vụ lúa mỗi năm, nuôi tôm, cá tra xuất khẩu; mùa nước nổi, đi lại bằng ghe xuồng; nhiều người trẻ lên Sài Gòn, Bình Dương làm công nhân'],
    [['@DBSCL'], 2015, 2025, 'thích ứng hạn mặn', 'Hạn mặn xâm nhập sâu các năm 2016, 2020; sạt lở bờ sông; chuyển sang trồng cây ăn trái, nuôi tôm; cầu và cao tốc nối về TP. Hồ Chí Minh'],
    [['@MNPB'], 1986, 2025, 'miền núi phía Bắc đổi mới', 'Đường lên bản được làm, điện lưới về xã; ruộng bậc thang, chợ phiên trở thành điểm du lịch; nhiều thanh niên xuống đồng bằng làm công nhân'],
    [['@DBSH'], 1996, 2025, 'đồng bằng công nghiệp hóa', 'Khu công nghiệp điện tử ở Bắc Ninh, Hải Phòng, Thái Nguyên; ruộng thu hẹp, làng nghề và xe máy khắp ngõ'],
    [MIEN_TRUNG, 1986, 2025, 'dải đất miền Trung', 'Mùa bão lũ tháng 9 – 11 hằng năm; nhiều nhà có người đi làm xa; du lịch biển phát triển ở Đà Nẵng, Hội An, Nha Trang'],
    [['Đà Nẵng'], 1997, 2025, 'thành phố trực thuộc trung ương', 'Tách khỏi Quảng Nam – Đà Nẵng năm 1997, xây cầu, mở biển cho du lịch; được xem là thành phố đáng sống'],
    [['Hà Nội'], 2008, 2025, 'Hà Nội mở rộng', 'Hà Tây sáp nhập vào Hà Nội năm 2008; đô thị lan ra các huyện ngoại thành, đường vành đai và đường sắt trên cao'],
    [['TP. Hồ Chí Minh'], 1976, 1985, 'Sài Gòn đổi tên TP. Hồ Chí Minh', 'Cải tạo tư sản, xếp hàng mua nhu yếu phẩm, chợ trời'],
    [['TP. Hồ Chí Minh'], 1986, 2025, 'đầu tàu kinh tế phía Nam', 'Kinh tế tư nhân sôi động, kẹt xe giờ cao điểm, nhà cao tầng và căn hộ; dân nhập cư từ khắp nơi']
  ]);
  D.REV.VN = (D.REV.VN || []).concat([
    [1930, ['Nghệ An', 'Hà Tĩnh'], 'phong trào Xô viết Nghệ Tĩnh', 2, ''], [1945, ['@DBSH', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình'], 'nạn đói Ất Dậu cướp đi rất nhiều sinh mạng', 2, 'grief'],
    [1954, BAC, 'đội cải cách ruộng đất về làng', 1, ''], [1968, ['Thừa Thiên Huế', 'Huế', 'TP. Hồ Chí Minh'], 'giao tranh dữ dội trong Tết Mậu Thân', 2, 'grief'],
    [1972, ['Quảng Trị'], '81 ngày đêm ở Thành cổ Quảng Trị', 2, 'grief'], [1972, ['Hà Nội', 'Hải Phòng'], 'trận B-52 mười hai ngày đêm cuối năm, phố Khâm Thiên bị san phẳng', 2, 'grief'],
    [1975, NAM, 'Sài Gòn đổi chủ ngày 30/4, nhiều gia đình di tản ra nước ngoài', 2, ''], [1979, BIEN_GIOI_BAC, 'giao tranh ác liệt ở biên giới, người dân phải sơ tán', 2, 'grief'],
    [1984, ['Hà Giang', 'Tuyên Quang'], 'mặt trận Vị Xuyên bùng nổ', 2, 'grief'], [1997, ['@DBSCL'], 'bão Linda đổ bộ Cà Mau, hàng nghìn ngư dân mất tích trên biển', 2, 'grief'],
    [1997, ['Đà Nẵng', 'Quảng Nam'], 'Quảng Nam – Đà Nẵng tách thành hai đơn vị', 1, ''], [1999, ['Thừa Thiên Huế', 'Huế', 'Quảng Trị', 'Quảng Nam', 'Quảng Ngãi'], 'đại hồng thủy cuối năm', 2, 'grief'],
    [2000, ['@DBSCL'], 'lũ lớn nhất nhiều thập kỷ ở đồng bằng sông Cửu Long', 2, 'grief'], [2004, ['Cần Thơ', 'Hậu Giang'], 'Cần Thơ trở thành thành phố trực thuộc trung ương, Hậu Giang tách tỉnh', 1, ''],
    [2006, ['Đà Nẵng', 'Quảng Nam', 'Thừa Thiên Huế', 'Huế'], 'bão Xangsane quét qua', 1, 'grief'], [2008, ['Hà Nội'], 'Hà Tây sáp nhập vào Hà Nội; trận mưa lụt lịch sử cuối tháng 10', 2, ''],
    [2009, ['Quảng Nam', 'Quảng Ngãi', 'Kon Tum', 'Gia Lai', 'Đà Nẵng'], 'bão Ketsana gây lũ lớn', 2, 'grief'], [2010, ['Hà Tĩnh', 'Quảng Bình'], 'lũ chồng lũ tháng 10', 2, 'grief'],
    [2014, ['Bình Dương', 'Đồng Nai', 'Hà Tĩnh'], 'biểu tình phản đối giàn khoan Hải Dương 981 biến thành bạo loạn ở khu công nghiệp', 1, ''],
    [2016, ['Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế', 'Huế'], 'cá chết hàng loạt dọc bờ biển, ngư dân không ra khơi được', 2, 'grief'], [2016, ['@DBSCL'], 'hạn mặn lịch sử, ruộng lúa chết khô', 2, 'grief'],
    [2017, ['Khánh Hòa', 'Phú Yên'], 'bão Damrey', 2, 'grief'], [2017, ['Yên Bái', 'Sơn La'], 'lũ quét tàn phá nhiều bản làng', 1, 'grief'],
     [2020, ['Thừa Thiên Huế', 'Huế', 'Quảng Nam', 'Quảng Trị', 'Quảng Bình'], 'mưa lũ và sạt lở núi ở Rào Trăng, Trà Leng', 2, 'grief'], [2020, ['@DBSCL'], 'hạn mặn lại xâm nhập sâu', 1, 'grief'],
    [2021, ['TP. Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Long An'], 'giãn cách kéo dài, hàng nghìn người chạy xe máy về quê', 2, 'grief'], [2022, ['Đà Nẵng'], 'mưa lớn kỷ lục gây ngập sâu giữa tháng 10', 1, 'grief'],
    [2023, ['Hà Nội'], 'cháy chung cư mini ở Khương Hạ làm 56 người chết', 2, 'grief'], [2024, ['Quảng Ninh', 'Hải Phòng', 'Lào Cai', 'Yên Bái', 'Cao Bằng', 'Phú Thọ', 'Thái Nguyên'], 'bão Yagi và lũ quét Làng Nủ', 2, 'grief'],
    [2024, ['TP. Hồ Chí Minh', 'Bình Dương'], 'tuyến metro số 1 Bến Thành – Suối Tiên vận hành', 1, 'joy'], [2021, ['Hà Nội'], 'tuyến đường sắt trên cao Cát Linh – Hà Đông chạy chính thức', 1, 'joy']
  ]);
  // Bổ sung các năm 1990–2025 cho cả nước
  D.EV.VN = (D.EV.VN || []).concat([
    [1990, 'Luật Doanh nghiệp tư nhân và Luật Công ty ra đời', 1, ''], [1992, 'Hiến pháp 1992 thừa nhận kinh tế nhiều thành phần', 1, ''], [1993, 'Luật Đất đai giao quyền sử dụng đất lâu dài cho nông dân', 1, ''],
    [1996, 'Đại hội VIII đặt mục tiêu công nghiệp hóa, hiện đại hóa', 1, ''], [1998, 'Hà Nội đăng cai Hội nghị cấp cao ASEAN lần thứ 6', 1, ''], [2001, 'Hiệp định thương mại song phương Việt – Mỹ có hiệu lực', 1, ''],
    [2004, 'dịch cúm gia cầm H5N1', 1, 'grief'], [2005, 'Thủ tướng Phan Văn Khải thăm Mỹ, chuyến đầu tiên kể từ sau chiến tranh', 1, ''],
    [2011, 'lạm phát gần 19%, giá cả tăng mạnh', 1, 'grief'], [2012, 'Quốc hội thông qua Luật Biển Việt Nam', 1, ''], [2013, 'Hiến pháp 2013 được thông qua', 1, ''],
    [2014, 'Trung Quốc hạ đặt giàn khoan Hải Dương 981 trong vùng biển Việt Nam', 2, ''], [2015, 'kết thúc đàm phán Hiệp định Đối tác xuyên Thái Bình Dương (TPP)', 1, ''], [2017, 'Tuần lễ cấp cao APEC tại Đà Nẵng; bão Damrey', 1, ''],
    [2019, 'Hà Nội đăng cai Hội nghị thượng đỉnh Mỹ – Triều Tiên', 1, ''], [2023, 'nâng cấp quan hệ với Mỹ lên Đối tác chiến lược toàn diện', 1, '']
  ]);
})(globalThis.G);
