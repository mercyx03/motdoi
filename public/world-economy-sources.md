# Kinh tế toàn thế giới — V5.2.0

Ngày lấy dữ liệu: 17/10/2026. Phạm vi: 194 quốc gia ngoài Việt Nam trong danh sách 195 quốc gia của trò chơi. Phần chơi Việt Nam tiếp tục dùng bảng lương riêng.

## Nguồn dữ liệu

- [ILOSTAT — dữ liệu và công cụ tải](https://ilostat.ilo.org/data/): bảng **EAR_EMTA_SEX_CUR_NB_A**, thu nhập bình quân tháng của người làm công theo giới tính và đơn vị tiền. Chọn tổng hai giới (SEX_T), USD (CUR_TYPE_USD), quan sát mới nhất có trong 2020–2025; cùng năm ưu tiên khảo sát lực lượng lao động BA, sau đó sắp mã nguồn để kết quả lặp lại được. [Tệp nguồn tải xuống](https://rplumber.ilo.org/data/indicator?format=.csv.gz&id=EAR_EMTA_SEX_CUR_NB_A).
- [Khái niệm tiền lương ILO](https://ilostat.ilo.org/methods/concepts-and-definitions/description-wages-and-working-time-statistics/): đây là tiền lương gộp của người làm công, không phải thu nhập của toàn bộ dân cư hay mức lương bắt buộc cho từng nghề.
- [World Bank WDI — GDP bình quân USD](https://data.worldbank.org/indicator/NY.GDP.PCAP.CD), [GDP bình quân PPP](https://data.worldbank.org/indicator/NY.GDP.PCAP.PP.CD), [PPP tiêu dùng hộ gia đình](https://data.worldbank.org/indicator/PA.NUS.PRVT.PP), [tỷ giá bình quân](https://data.worldbank.org/indicator/PA.NUS.FCRF): lấy cặp năm chung mới nhất trong 2020–2025, không ghép hai đơn vị tiền từ hai năm khác nhau.
- [World Bank — ý nghĩa của PPP](https://datahelpdesk.worldbank.org/knowledgebase/articles/114945-why-are-some-series-shown-in-purchasing-power-pari): phân biệt sức mua với số tiền quy đổi theo tỷ giá.

Dữ liệu lương trực tiếp: **129/194 nước**. **65/194 nước** còn lại được ghi `estimate` hoặc `proxy` trong CSV/JSON. Năm quan sát khác nhau giữa các nước; không coi đây là bảng lương thời gian thực năm 2026. Ví dụ: Nhật 2021, Hàn 2022, Thái 2025. Giữ cả mã nguồn ILO và cờ trạng thái quan sát, kể cả cờ thay đổi chuỗi `B` nếu có.

## Ước tính khi thiếu dữ liệu

- Từ các quan sát ILO có GDP cùng năm hoặc GDP mới nhất khả dụng, tính tỷ lệ lương năm / GDP bình quân. Loại các tỷ lệ ngoài 0,15–3 để giảm ảnh hưởng khác biệt phạm vi thống kê.
- Chia bốn nhóm GDP bình quân danh nghĩa: dưới 2.000, dưới 8.000, dưới 25.000 và từ 25.000 USD. Dùng trung vị tỷ lệ từng nhóm, không tự gán một mức lương giống nhau cho mọi nước.
- Các trung vị dùng trong bản này: {"0": 1.8182944675100932, "1": 1.020090693006106, "2": 0.6995344082718176, "3": 0.9357141282191255}.
- Vatican tham chiếu Ý; Monaco tham chiếu Pháp; Liechtenstein tham chiếu Thụy Sĩ khi thiếu quan sát trực tiếp. Đây là quy ước mô phỏng, không phải số liệu lương đã đo ở ba nước đó.
- Nếu World Bank thiếu GDP, dùng GDP PPP trong dữ liệu quốc gia sẵn có của game và mức giá ước tính; `gdpYear` để trống. Nếu thiếu chỉ số giá hộ gia đình, dữ liệu giá cũ hơn 2022 hoặc tỷ lệ giá bất thường ngoài 0,12–2, dùng GDP danh nghĩa / GDP PPP và đánh dấu `gdp-proxy`.

## Cách áp dụng trong game

1. Mốc lương Việt Nam để chuẩn hóa: ILO Việt Nam 2024, 355,043 USD/tháng, tương đương khoảng 9,018 triệu đồng theo tỷ giá tham chiếu có sẵn trong trò chơi. Bảng lương riêng của chế độ Việt Nam không bị sửa.
2. Mỗi nghề giữ mức tương quan với mốc lương, cấp bậc, trình độ và kỹ năng. Nghề phổ thông tại Nhật/Hàn có lương danh nghĩa cao hơn Việt Nam; Thái chỉ cao hơn vừa phải theo mốc quan sát, không bị nhân tùy tiện nhiều lần.
3. Các khoản lương vượt 1,5 lần mốc chuẩn có độ chênh thu nhập tăng chậm dần theo thị trường. Tránh áp nguyên tỷ lệ rất cao của một nghề Việt Nam sang mọi nước rồi thổi lương phi công, bác sĩ, quản lý. Đây là công thức cân bằng game, chưa phải số liệu lương của từng chức danh tại từng nước. Thu nhập danh tiếng/phi pháp có hệ thống riêng.
4. Hệ số mô phỏng: đô thị 1,04; nông thôn 0,83; việc tự do 0,90; nông nghiệp 0,82. Các hệ số này không phải thống kê ILO về chênh lệch đô thị hay từng nghề.
5. Chi phí sống dùng GDP PPP và tỷ lệ giá tiêu dùng. Nền ngân sách được giới hạn trong 45–90% lương bình quân năm quy về USD PPP trước hệ số đô thị/nông thôn; các mục ăn ở, con cái, xe cộ, dịch vụ tiếp tục tính riêng từ nền đó. Tránh GDP rất cao do cấu trúc kinh tế của một nước làm mọi hộ gia đình đều phải chi quá mức lương.
6. USD nội bộ vẫn là USD PPP; chuyển về USD danh nghĩa hoặc tiền bản địa lúc hiển thị. Không cộng số tiền thuộc hai đơn vị vào nhau. Tỷ giá hiển thị có sẵn trong game là tham chiếu, không phải bảng tỷ giá trực tiếp.
7. Bản lưu cũ giữ nguyên tiền và tài sản. Khi tải lại cập nhật nền chi phí; khi tính năm làm việc kế tiếp, bỏ mốc lương sàn cũ ở thị trường đã thay đổi. Không đổi lại thu nhập lịch sử đã nhận.

## Tệp kiểm tra

- `world-economy-countries.csv`: đủ 194 nước, giá trị, năm và loại nguồn.
- `world-economy-data.json`: dữ liệu đầy đủ dùng để sinh module chạy offline.
- `tools/build-world-economy.py`: sinh module từ bản chụp ILO/WB đã tải, không cần gọi mạng khi người chơi mở game.
- `tests/update520.js`: lương phổ thông và cấp bậc, Việt Nam giữ nguyên, thị trường chuyển nơi ở, bản lưu cũ và một đời hoàn chỉnh ở mỗi quốc gia.

Các mốc thống kê là nền tham khảo. Lương cá nhân, thuế/bảo hiểm, biến động việc làm và chi phí là mô phỏng của game, không phải dự báo tài chính hay bảng lương pháp định của 194 quốc gia.
