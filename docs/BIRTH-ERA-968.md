# Rà soát nơi sinh và năm sinh — 9.6.8 Preview

Phạm vi: mở rộng thiết lập và các lớp engine/ERA902/ERA920.POL/CTX945 hiện có. Không thay định danh quốc gia, thành phố, tỉnh hoặc viết lại lịch sử trong bản lưu.

## Đã sửa

- Chọn năm trước 2025 chuyển giao diện sang danh sách 63 vùng trước sáp nhập. Chuyển từ một vùng gộp giữ vùng trung tâm tương ứng; lựa chọn trực tiếp qua engine vẫn đọc chỉ số theo danh sách đầu vào, không lẫn chỉ số 34/63. Chế độ thế giới sinh tại VN cũng giữ mốc năm.
- Xem trước phản ánh tỉnh và dân tộc đang chọn. Hướng dẫn năm sinh ngẫu nhiên không tự dùng Việt Nam. Cảnh báo định lượng trước 1950 nói đúng giới hạn mô hình đang có; các năm 2024 trở đi vẫn có bối cảnh.
- Nơi sinh và nhật ký đầu đời đi qua cùng lớp tên lịch sử như vị trí hiển thị; nơi sinh giữ nguyên tên của năm chào đời khi thời gian trôi qua. Không viết lại nơi sinh trong bản lưu cũ.
- Chọn vùng VN có mô tả ảnh hưởng tại tỉnh lỵ tương ứng. Tên thành phố nhiều giai đoạn có cận đầu và cận cuối, tránh gọi Leningrad vào 1900. Hiển thị tên lịch sử không làm đổi khóa địa lý; lớp vùng nhận cả tên cũ trong bản lưu.
- Lọc nghề của bố mẹ lúc sinh và khi tìm lại việc bằng điều kiện nghề/công nghệ đang có theo năm hiện tại và nước cư trú. Không chỉ giấu lời kể sau khi đã phát sinh nghề.
- Bối cảnh chính trị theo nước đang có mặt, kể cả cư trú tạm thời. Hồ sơ nhớ nước đã ghi để chuyển nước trong cùng năm vẫn cập nhật được.
- Sự kiện khó khăn giữ năm, nước và địa điểm khi tạo. Kiểm tra lại nguyên nhân và vị trí trước khi giải quyết; sự kiện quá hạn không áp dụng hậu quả. Bản lưu cũ thiếu metadata nước/thành phố vẫn kiểm tra nguyên nhân và năm.

## Nguồn đối chiếu tên lịch sử

Đọc ngày 17/11/2026. Game dùng bước năm; năm có đổi tên giữa năm dùng nhãn của giai đoạn mới, chưa chia theo ngày của từng sự kiện.

- Saint Petersburg → Petrograd (1914) → Leningrad (1924), trở lại tên cũ từ 1991: [Thư viện Quốc gia Nga](https://nlr.ru/eng/RA2180/petersburg-leningrad), [Bách khoa Saint Petersburg, nghị quyết 26/1/1924](https://www.encspb.ru/object/2804021838?dv=2853872336&lc=en). Trang thư viện có nội dung chỉ mục tìm kiếm nhưng lần mở trực tiếp trả 403; không coi đã đọc toàn bộ trang.
- Tsaritsyn → Stalingrad (1925) → Volgograd (1961): [Chính quyền Volgograd](https://www.volgadmin.ru/d/about/History), [Đại học Quốc gia Volgograd](https://volsu.ru/upload/medialibrary/ece/EN_welcome_vog_for_web.pdf).
- Akmolinsk → Tselinograd (1961) → Akmola (1992) → Astana (1998): [Chính quyền Astana](https://www.gov.kz/org/astana?lang=en). Giữ cửa sổ Nur-Sultan 2019–2021 có sẵn; năm 2022 dùng tên Astana theo quy ước năm.
- Pishpek → Frunze (1926): [Chính quyền Bishkek](https://www.bishkek.gov.kg/en/history). Giữ mốc trở lại Bishkek 1991 của bảng cũ.
- Verny → Alma-Ata (1921): [Chính quyền Almaty](https://www.gov.kz/org/almaty/activities/27965?lang=en). Giữ mốc Almaty từ 1993 của bảng cũ.
- Dyushambe → Stalinabad (1929), Dushanbe từ 1961: [Bách khoa Quốc gia Tajikistan](https://donishnoma.tj/?c_id=5459&lang=en).
- Huambo → Nova Lisboa (1928): [Cơ quan Chính phủ Angola](https://scm.gov.ao/web/noticias/presidente-autoriza-adjudica%C3%A7%C3%A3o-de-contratos-para-a-constru%C3%A7%C3%A3o-de-infra-estruturas). Giữ mốc trở lại Huambo từ 1975 của bảng cũ.

## Độ phủ kiểm tra và phần chưa xác minh

`tests/birth-era968.js` kiểm tính nhất quán 194 nước có lượt sinh trong menu, 1.083 địa điểm (gồm 63 tỉnh lỵ VN), tại 1900, 1918, 1939, 1945, 1950, 1970, 1990, 2010, 2023 và 2026. Kiểm tên cũ và tên chuẩn cho cùng kết quả vùng; chỉ số hữu hạn trong khoảng; có dữ liệu năm; nghề bố mẹ; bản lưu và sự kiện hết hiệu lực.

Đây là rà tính nhất quán của dữ liệu game, không phải chứng nhận mọi thành phố và mọi năm đều đúng lịch sử. Danh sách quốc gia/vùng vẫn là các mốc địa lý hiện có; chưa dựng ranh giới hành chính của từng năm. Danh sách đô thị chưa có mốc hình thành riêng cho mọi thành phố mới. Trọng số chọn quốc gia/tỉnh ngẫu nhiên vẫn dựa trên dữ liệu dân số/lượt sinh hiện có, chưa có chuỗi trọng số theo năm. Dữ liệu trước 1950 vẫn dùng ước tính của mô hình; không thay bằng số liệu quốc gia chưa có nguồn. Chưa xác minh mọi luật, quyền tiếp cận trường học/nghề theo từng địa phương và nhóm xã hội. Các mục này cần đối chiếu tiếp trước khi tuyên bố độ chính xác lịch sử toàn diện.

Regression toàn bộ trên mã cuối, bản lưu thật và binding REVIEWS_DB Production còn ở GĐ6. Chỉ đóng gói Preview, chủ dự án tự triển khai.
