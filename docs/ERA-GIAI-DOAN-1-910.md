# Giai đoạn 1 bối cảnh lịch sử: chọn năm sinh và chặn nội dung sai thời (9.1.0)

Module: `public/js/era902.js` (gắn vào khung năm thế giới của `era917.js` qua `E.ERA917.tech`). Kiểm thử: `tests/era902.js`, thước đo độc lập `tests/era-oracle902.js`.

## Quy tắc
- Năm thế giới của nhân vật = năm sinh + tuổi. Ô "Năm sinh (thử nghiệm)" cho chọn từ 1900 đến năm nay; để trống là năm nay.
- Mỗi mục trong bảng dưới là **năm sớm nhất** sản phẩm, kỹ thuật hay sự kiện đó có thể xuất hiện ở bất kỳ nước nào. Trước năm đó:
  1. lời kể và văn bản cảnh (qua `E.famLogic`/`famFix`) bị cắt các câu sai thời; dòng nhật ký không còn gì thì bỏ;
  2. cảnh dựng bằng `DEC.make` bị cắt lựa chọn sai thời, bỏ cả cảnh nếu tiêu đề hoặc mọi lựa chọn sai thời (`data.eraSkip`, xử lý trong `prune` của `engine.js`);
  3. `startJob` (`careers.js`) từ chối nghề chưa tồn tại;
  4. danh sách hành động chủ động ẩn mục sai thời;
  5. vài từ thông dụng được thay bằng cách nói hợp thời thay vì bỏ câu: "nhắn tin" thành "viết thư" (trước 1960) hoặc "gọi điện" (trước 1992), "tin nhắn" thành "lá thư" hoặc "lời nhắn", "gọi video" thành "viết thư" hoặc "gọi điện".
- Đời có năm thế giới từ 2024 trở đi đi đường tắt, không đổi một byte so với trước (có kiểm thử).

## Giới hạn đã biết (chưa làm trong giai đoạn 1)
- Số liệu dân số và kinh tế vẫn của hiện nay: tuổi thọ, tử vong trẻ em, tỷ suất sinh, GDP, giá cả, cơ cấu nghề.
- Tên nước, tên thành phố và ranh giới theo năm (Liên Xô, Nam Tư, Sài Gòn trước 1976, các thuộc địa...) chưa có; đời sinh 1950 ở Việt Nam hiện ghi "TP. Hồ Chí Minh".
- Mức phổ biến công nghệ theo từng nước (TV, điện thoại, internet ở Việt Nam, Nigeria, Mỹ khác nhau nhiều) chưa có; bảng dưới chỉ là mốc sớm nhất ở bất kỳ nước nào.
- Chính sách và thể chế theo năm (lương hưu, bảo hiểm y tế, giáo dục bắt buộc, quyền bầu cử, chế độ hôn nhân...) chưa có ngoài những gì `era917.js` đã làm.
- Sự kiện lịch sử thế giới và từng nước (chiến tranh, nạn đói, đại dịch, cải cách) chưa có.
- Bộ kiểm tra chỉ nhìn thấy những từ có trong bảng. Nội dung sai thời nằm ngoài từ vựng này vẫn có thể còn; mỗi lần rà phải mở rộng bảng và thước đo.

## Mức độ kiểm chứng của bảng mốc
Các năm dưới đây là mốc công khai quen thuộc, ghi theo hướng **sớm nhất có thể** để không chặn nhầm. Chúng chưa được đọc lại từng nguồn gốc trong phiên làm việc này; trước khi dùng làm khẳng định lịch sử cho người chơi cần đối chiếu nguồn (ghi cột "Cơ sở").

### Bảng công nghệ, sản phẩm, sự kiện
| Năm | Mã | Cơ sở |
|---|---|---|
| 1936 | `tv` | BBC phát sóng truyền hình công cộng thường xuyên từ 11/1936 |
| 1946 | `chemo` | hóa trị liệu ung thư đầu tiên thập niên 1940 |
| 1949 | `cctv` | camera giám sát thương mại 1949 |
| 1954 | `transplant` | ghép thận thành công đầu tiên 1954 |
| 1958 | `creditcard` | BankAmericard 1958 |
| 1960 | `pill` | viên tránh thai Enovid 1960 |
| 1964 | `toefl` | TOEFL 1964 |
| 1967 | `atm` | ATM đầu tiên 1967 |
| 1971 | `ct` | CT lâm sàng đầu tiên 1971 |
| 1972 | `videogame` | Pong/Odyssey 1972 |
| 1977 | `mri` | ảnh MRI người đầu tiên 1977 |
| 1977 | `pc` | Apple II, TRS-80, PET 1977 |
| 1978 | `ivf` | em bé ống nghiệm đầu tiên 1978 |
| 1981 | `hiv` | AIDS được ghi nhận 1981 |
| 1981 | `laptop` | Osborne 1 (1981) |
| 1983 | `mobile` | Motorola DynaTAC bán thương mại 1983 |
| 1985 | `dna` | dấu vân tay ADN 1985 |
| 1985 | `surrogacy` | mang thai hộ dùng phôi (gestational) từ 1985 |
| 1989 | `ielts` | IELTS ra mắt 1989 |
| 1990 | `robotclub` | câu lạc bộ robot học đường từ thập niên 1990 |
| 1991 | `internet` | World Wide Web công bố công khai 1991 |
| 1992 | `msg` | tin nhắn văn bản SMS 1992 |
| 1992 | `sms` | tin nhắn SMS đầu tiên 12/1992 |
| 1994 | `playstation` | PlayStation 1994 |
| 1996 | `fanculture` | văn hóa thần tượng hiện đại: H.O.T. ra mắt 1996 |
| 1996 | `kpop` | K-pop hiện đại: H.O.T. 1996 |
| 1997 | `esports` | giải Quake Red Annihilation 1997 |
| 1997 | `netflix` | Netflix thành lập 1997 (thuê DVD) |
| 1998 | `google` | Google thành lập 1998 |
| 1998 | `netculture` | diễn đàn/phòng chat công cộng cuối thập niên 1990 |
| 1999 | `wifi` | Wi-Fi tiêu dùng 1999 |
| 2001 | `xbox` | Xbox 2001 |
| 2003 | `videocall` | Skype 2003 |
| 2004 | `facebook` | Facebook 2004 |
| 2004 | `podcast` | podcast 2004 |
| 2005 | `youtube` | YouTube 2005 |
| 2007 | `smartphone` | iPhone ra mắt 2007 |
| 2008 | `appstore` | App Store 2008 |
| 2008 | `spotify` | Spotify 2008 |
| 2009 | `crypto` | Bitcoin 2009 |
| 2009 | `dating_app` | Grindr 2009, Tinder 2012 |
| 2009 | `lol` | League of Legends 2009 |
| 2009 | `minecraft` | Minecraft 2009 (bản alpha) |
| 2009 | `ridehail` | Uber 2009 |
| 2010 | `instagram` | Instagram 2010 |
| 2011 | `ewallet` | ví điện tử/QR thanh toán đại chúng từ khoảng 2011 |
| 2011 | `stream` | Twitch 2011 |
| 2012 | `zalo` | Zalo 2012 |
| 2016 | `ai` | AI đại chúng từ khoảng 2016; ChatGPT 2022 |
| 2016 | `lienquan` | Arena of Valor 2016 |
| 2016 | `tiktok` | Douyin 2016, TikTok quốc tế 2017 |
| 2017 | `battleroyale` | PUBG 2017, Free Fire 2017 |
| 2020 | `covid` | COVID-19 đại dịch 2020 |
| 2024 | `atvncg` | chương trình truyền hình thực tế phát sóng lần đầu năm 2024 |

### Nghề chưa tồn tại trước năm
| Năm | Mã nghề |
|---|---|
| 1914 | `phi_cong` |
| 1930 | `tiep_vien` |
| 1930 | `kskl` |
| 1935 | `dj` |
| 1940 | `nc_y_sinh` |
| 1950 | `dev` |
| 1957 | `ky_su_vu_tru` |
| 1960 | `data` |
| 1960 | `fl_dev` |
| 1960 | `telesale` |
| 1973 | `rapper` |
| 1975 | `fl_video` |
| 1985 | `tiem_dt` |
| 1991 | `quan_net` |
| 1995 | `kd_online` |
| 1995 | `lua_dao` |
| 1997 | `tuyen_thu_es` |
| 1997 | `coach_es` |
| 1997 | `caster_es` |
| 1997 | `dau_tu_es` |
| 2009 | `tx_cn` |
| 2009 | `cay_thue` |
