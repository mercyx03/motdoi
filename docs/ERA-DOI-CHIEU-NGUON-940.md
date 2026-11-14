# Đối chiếu nguồn cho bối cảnh lịch sử (9.3.1, bổ sung 9.3.2)

Ngày thực hiện: 15/11/2026. Kiểm các khẳng định trong `public/js/era920-pol.js` (độc lập, chế độ, chiến tranh, tên nước, tên thành phố), `public/js/hist920.js` (17 biến cố) và một phần bảng mốc công nghệ `public/js/era902.js`.

## Phương pháp và mức kiểm chứng
- Nguồn là **bách khoa trực tuyến (Wikipedia tiếng Anh, bản wikitext tải 15/11/2026)** và **kết quả tìm kiếm web** (Britannica, giáo trình đại học, báo cáo CIA đã giải mật, UNHCR, Bảo tàng Tưởng niệm Holocaust Hoa Kỳ…). Đây là nguồn **thứ cấp**: chưa đọc văn bản gốc (hiệp định, nghị quyết, tài liệu lưu trữ) và chưa đọc nghiên cứu học thuật. Mức mới: `ver: secondary`.
- Với từng khẳng định, tập lệnh tìm các mốc năm/ngày bắt buộc trong bài (ví dụ "24 March 1976" và "10 December 1983" cho chế độ quân sự Argentina). Khớp tự động chỉ chứng minh bài báo có các mốc đó, không chứng minh cách game diễn đạt; các câu chữ trong game đã đọc lại bằng mắt.
- Không dùng dữ liệu của 1in8b.

## Kết quả
| Nhóm | Số mục | Khớp tự động | Ghi chú |
|---|---|---|---|
| Năm độc lập / chấm dứt thuộc địa (83 nước) | 83 | 83 | so với bảng "List of national independence days"; 5 nước cần ghi chú (xem dưới) |
| Chế độ, chiến tranh, tên nước, tên thành phố (`era920-pol.js`) | 118 | 116 | 2 mục lệch do tên bài/định dạng, đã xác nhận bằng mắt |
| Biến cố và công nghệ chọn lọc (`hist920.js`, `era902.js`) | 54 | 47 | 7 mục lệch do tên bài/định dạng, đã xác nhận bằng tìm kiếm web |

## Sai sót đã phát hiện và sửa
- Quần đảo Ellice đổi tên thành Tuvalu năm **1975** (độc lập 1978); bảng cũ ghi tên cũ đến 1977. Đã sửa `NAMES` thành đến 1974.
- Dòng bối cảnh Síp 1974 có lỗi đánh máy "đảo đảo chính". Đã sửa.
- Quán internet đầy đủ chỉ có từ 1994 (Cyberia ở London, The Binary Café ở Toronto); mạng đầu thập niên 1990 (SFnet, 7/1991) là mạng máy tính đặt ở quán cà phê, còn bị tranh luận là "quán net". Đã sửa `quan_net` từ 1991 thành 1994.
- Ví MoMo được cấp phép 11/2012 (M_Service lập 2007 làm nạp tiền điện thoại; ứng dụng 2014). Mốc "ví điện tử/QR" đổi từ 2011 thành 2012.
- Mức kiểm chứng của 17 biến cố nâng từ `public` (chưa đối chiếu) lên `secondary` (đã đối chiếu nguồn thứ cấp).

- Năm độc lập cần ghi chú: Guinea-Bissau (tuyên bố 1973, Bồ Đào Nha công nhận 1974; game dùng 1974), Maldives, Qatar, Quần đảo Marshall, Morocco (dòng đầu của bảng là ngày lễ hoặc sự kiện khác; dòng độc lập thực sự khớp 1965, 1971, 1986, 1956).

## Còn khác biệt giữa các nguồn (game không nêu số, hoặc số chỉ là tham số)
- Số người bị giam trong các trại học tập cải tạo sau 1975: từ vài trăm nghìn đến trên một triệu tùy nguồn; thời gian giam từ vài tháng đến trên 15 năm. Game không nêu số.
- Số người di cư Bắc–Nam 1954: từ khoảng 660.000 đến một triệu; số tập kết ra Bắc: khoảng 90.000 đến 130.000 tùy nguồn. Game không nêu số.
- Số thuyền nhân: khoảng 800.000 đến nơi an toàn; số chết trên biển ước tính 200.000 đến 400.000 hoặc hơn, có tranh luận. Tỷ lệ chết/bị bắt/đến nơi (15% / 25% / 60%) và phân bổ nước định cư (Hoa Kỳ 60, Úc 14, Canada 14, Pháp 5, Đức 4, Anh 3) là **tham số trò chơi, chưa có nguồn đối chiếu**.
- Sơ tán học sinh Hà Nội và Hải Phòng 1965–1968: chỉ tìm thấy lời kể cá nhân và báo cáo năm 1972; số lượng và tổ chức chưa kiểm chứng. Game chỉ nói chung là trường sơ tán về nông thôn.
- Cải cách ruộng đất: nguồn đều nhất trí chiến dịch 1953–1956, lãnh đạo xin lỗi công khai năm 1956 và Trường Chinh mất chức Tổng Bí thư 10/1956; một số nguồn đặt giai đoạn sửa sai kéo sang 1957.
- Khmer Đỏ: ngày 17/4/1975 và việc sơ tán dân thành phố được xác nhận; con số 1,5–2 triệu người chết là ước tính, các nguồn dao động.

## Chưa đối chiếu
- 40 mốc công nghệ còn lại của `era902.js` (phần lớn là mốc sản phẩm rất quen thuộc; bài kiểm chỉ chạy cho 14 mục rủi ro nhất). Cần chạy tiếp `scratchpad` kiểm tra hoặc đọc nguồn.
- Ngưỡng phổ cập (di động ≥ 1 trên 100 dân, internet ≥ 1–10%): tham số trò chơi, không phải mốc thống kê.
- Mô tả "Hơn 140 nước có dòng bối cảnh": đã kiểm 118 khẳng định đại diện cho các nước đó, không phải từng dòng một.
- Số liệu theo năm của giai đoạn 2 lấy nguyên từ nguồn quốc tế nên không thuộc phạm vi đối chiếu này.

## Ghi chú các mục chưa khớp tự động
- `LR-civil`: Tên bài sai trong bảng kiểm. Cuộc nội chiến thứ nhất 1989–1997, thứ hai 1999–2003 (kiến thức công khai).
- `PH-ml`: Bài ghi ngày 17/1/1981 (đúng với "tháng 1/1981"); mẫu regex không bắt định dạng ngày.
- `ev-geneva-300`: Xác nhận bằng tìm kiếm web: Hiệp định cho 300 ngày tự do đi lại (nguồn giáo trình SUNY, Britannica).
- `ev-rt`: Nguồn ghi kết thúc 31/10, 1/11 hoặc 2/11/1968; bảng game chỉ dùng năm 1965–1968, khớp.
- `ev-arvn-draft`: Xác nhận bằng tìm kiếm web: luật tổng động viên tháng 6/1968, nam 18–38 tuổi (CIA, bản tin báo chí).
- `ev-reedu`: Không có bài tên đó; xác nhận bằng tìm kiếm web: số bị giam rất khác nhau giữa các nguồn (từ vài trăm nghìn đến trên một triệu); game không nêu số.
- `ev-nez`: Không có bài tên đó; xác nhận bằng tìm kiếm web: chương trình vùng kinh tế mới từ 1975–1976, điều kiện khắc nghiệt (bài New Economic Zones program).
- `ev-mk2001`: Tên bài sai; xác nhận bằng tìm kiếm web: xung đột từ cuối 1/2001 đến Hiệp định Ohrid 13/8/2001.
- `t-atvncg`: Xác nhận bằng tìm kiếm web: chương trình phát sóng lần đầu 29/6/2024.

## Bảng đối chiếu: năm độc lập (83 nước)
| Nước | Năm trong game | Dòng của bảng Wikipedia |
|---|---|---|
| Libya (LY) | 1951 | Libya / Independence Day / 24 December / 1951 / United Kingdom Italy France / Independence from Italy on 10 February 1947, released from British and French on 24 December |
| Morocco (MA) | 1956 | Morocco / Proclamation of Independence Day / 11 January / 1944 / France Spain / Proclamation of Independence. |
| Tunisia (TN) | 1956 | Tunisia / Independence Day / 20 March / 1956 / France / Termination of the Treaty of Bardo and signing of the Franco-Tunisian protocol led to the relinquishment of French |
| Sudan (SD) | 1956 | Sudan / Independence Day / 1 January / 1956 / United Kingdom Egypt / A polling process was carried out resulting in the composition of a democratic parliament and Ismail  |
| Campuchia (KH) | 1953 | Cambodia / Independence Day / 9 November / 1953 / France / Ceremony transferring military from French to Cambodian officials based on a military hand-over agreement reach |
| Lào (LA) | 1953 | KHÔNG THẤY |
| Malaysia (MY) | 1957 | Malaysia / Independence Day/National Day / 31 August / 1957 / Malayan Declaration of Independence. |
| Ghana (GH) | 1957 | Ghana / Independence Day / 6 March / 1957 / United Kingdom / On Wednesday, 6 March 1957, when Kwame Nkrumah, the inaugural Prime Minister of Ghana, declared to the people |
| Guinea (GN) | 1958 | Guinea / Independence Day / 2 October / 1958 / France / Withdrawal of French authority after the collapse of the Fourth Republic and establishment of the Fifth Republic t |
| Cameroon (CM) | 1960 | Cameroon / National Day / 20 May / 1972 / United Kingdom France / Cameroon gained independence on 1 January 1960, but does not celebrate that date. Instead, it celebrates |
| Togo (TG) | 1960 | Togo / Independence Day / 27 April / 1960 / France / On 13 October 1958 the French government announced that full independence would be granted. On 14 November 1958 the U |
| Madagascar (MG) | 1960 | Madagascar / Independence Day / 26 June / 1960 / France / Separation of the autonomous Malagasy Republic from the French Community. |
| CHDC Congo (CD) | 1960 | KHÔNG THẤY |
| Somalia (SO) | 1960 | Somalia / Independence Day / 26 June / 1960 / United Kingdom Italy / British Somaliland gained independence from the United Kingdom, although Italian Somaliland wouldn't  |
| Benin (BJ) | 1960 | Benin / Independence Day / 1 August / 1960 / France / Effective date of the agreement with France signed on 11 July creating the independent Republic of Dahomey. |
| Niger (NE) | 1960 | Niger / Independence Day / 3 August / 1960 / France / Effective date of the agreement with France signed on 11 July. |
| Burkina Faso (BF) | 1960 | Burkina Faso / Proclamation of Independence Day / 11 December / 1958 / France / Effective date when French Upper Volta became an autonomous republic in the French Communi |
| Bờ Biển Ngà (CI) | 1960 | Ivory Coast / Independence Day / 7 August / 1960 / France / Effective date of the agreement with France signed on 11 July. |
| Chad (TD) | 1960 | Chad / Republic Day / 28 November / 1958 / Effective date when Chad became an autonomous republic in the French Community. |
| Cộng hòa Trung Phi (CF) | 1960 | Central African Republic / National Day / 1 December / 1958 / France / Effective date when Central African Republic became an autonomous republic of the French Community. |
| Cộng hòa Congo (CG) | 1960 | KHÔNG THẤY |
| Gabon (GA) | 1960 | Gabon / Independence Day / 16–17 August / 1960 / France / Effective date of the agreement with France signed on 15 July. |
| Senegal (SN) | 1960 | Senegal / Independence Day / 4 April / 1960 / France / Transfer of power agreement signed between the Mali Federation and France. |
| Mali (ML) | 1960 | Mali / Independence Day / 22 September / 1960 / France / Dissolution of the Mali Federation following secession of Senegal led to the independence of the Sudanese Republi |
| Mauritania (MR) | 1960 | Mauritania / Independence Day / 28 November / 1960 / France / Effective date of the agreement with France signed on 19 October. |
| Nigeria (NG) | 1960 | Nigeria / Independence Day / 1 October / 1960 / United Kingdom / Nigeria Independence Act 1960. |
| Síp (CY) | 1960 | Cyprus / Independence Day / 1 October / 1960 / United Kingdom / Effective date of the London-Zürich Agreements was 16 August 1960, but the public holiday was moved to 1 O |
| Sierra Leone (SL) | 1961 | Sierra Leone / Independence Day / 27 April / 1961 / On 20 April 1960, Milton Margai led a 24-member Sierra Leonean delegation at constitutional conferences that were held |
| Kuwait (KW) | 1961 | Kuwait / National Day / 25 February / 1961 / United Kingdom / Independence actually occurred on 19 June 1961, but celebrate on 25 February each year to honor Sheikh Abdul |
| Tanzania (TZ) | 1961 | Tanzania / Independence Day / 9 December / 1961 / United Kingdom / Independence as Tanganyika. |
| Rwanda (RW) | 1962 | Rwanda / Independence Day / 1 July / 1962 / Belgium / Effective date of the United Nations General Assembly Resolution 1746 terminating the Rwanda-Urundi Trusteeship. |
| Burundi (BI) | 1962 | Burundi / Independence Day / 1 July / 1962 / Belgium / Effective date of the United Nations General Assembly Resolution 1746 terminating the Ruanda-Urundi Trusteeship. |
| Uganda (UG) | 1962 | Uganda / Independence Day / 9 October / 1962 / United Kingdom / Initially a Commonwealth realm, the country would become a republic one year later. |
| Algeria (DZ) | 1962 | Algeria / Independence Day / 5 July / 1962 / France / Algeria gained independence following the Algerian War and the Algerian independence referendum. France officially r |
| Jamaica (JM) | 1962 | Jamaica / Independence Day / 6 August / 1962 / United Kingdom / Independence of Jamaica. |
| Trinidad và Tobago (TT) | 1962 | Trinidad and Tobago / Independence Day / 31 August / 1962 / Effective date of the Trinidad and Tobago Independence Act 1962. |
| Samoa (WS) | 1962 | Samoa / Independence Day / 1 June / 1962 / New Zealand / Named Western Samoa until 1997, it was the first Polynesian nation to be recognized as a sovereign state in the 2 |
| Kenya (KE) | 1963 | Kenya / Madaraka Day / 1 June / 1963 / United Kingdom / Kenya attained internal self rule after being a British colony since 1920. |
| Malawi (MW) | 1964 | Malawi / Independence Day / 6 July / 1964 / United Kingdom / Name of the country changed from Nyasaland to Malawi. |
| Zambia (ZM) | 1964 | Zambia / Independence Day / 24 October / 1964 / United Kingdom / Effective date of the Zambia Independence Act 1964. |
| Malta (MT) | 1964 | Malta / Independence Day / 21 September / 1964 / United Kingdom / Malta Independence Act. |
| Gambia (GM) | 1965 | KHÔNG THẤY |
| Maldives (MV) | 1965 | Maldives / National Day / 1st of Rabi' al-Awwal, 3rd month of Islamic calendar / 1573 / Portugal / Termination of Portuguese rule in the archipelago following the uprisin |
| Botswana (BW) | 1966 | Botswana / Independence Day / 30 September / 1966 / United Kingdom / Effective date of the Botswana Independence Act 1966. |
| Lesotho (LS) | 1966 | Lesotho / Independence Day / 4 October / 1966 / United Kingdom / Name of the country changed from Basutoland to Lesotho. |
| Barbados (BB) | 1966 | Barbados / Independence Day / 30 November / 1966 / United Kingdom / Effective date of the Barbados Independence Act 1966. Also the anniversary of the formal proclamation  |
| Guyana (GY) | 1966 | Guyana / Independence Day / 26 May / 1966 / United Kingdom / The Guyana Independence Act came into effect. |
| Mauritius (MU) | 1968 | Mauritius / Independence Day / 12 March / 1968 / United Kingdom / Constitution of Mauritius enacted in force. |
| Eswatini (SZ) | 1968 | Eswatini / Independence Day (Somhlolo Day) / 6 September / 1968 / United Kingdom / Commemorates independence. Also called Somhlolo Day or Subhuza Day, after the 19th-cent |
| Guinea Xích Đạo (GQ) | 1968 | Equatorial Guinea / Independence Day / 12 October / 1968 / Spain / Independence from Spain following the country's only free and fair election to date in September 1968. |
| Nauru (NR) | 1968 | Nauru / Independence Day / 31 January / 1968 / Australia New Zealand United Kingdom / Effective date of the Nauru Independence Act 1967. Also marks the date of the return |
| Fiji (FJ) | 1970 | Fiji / Fiji Day / 10 October / 1970 / United Kingdom / Instruments of Independence |
| Tonga (TO) | 1970 | Tonga / Emancipation Day / 4 June / 1970 / United Kingdom / Termination of protectorate status in 1970. |
| Bahrain (BH) | 1971 | Bahrain / Independence Day / 16 December / 1971 / United Kingdom / Ascension of Isa bin Salman Al Khalifa to the throne. |
| Qatar (QA) | 1971 | Qatar / National Day / 18 December / 1878 / Ottoman Empire / On 18 December 1878, Jassim bin Mohammed Al Thani succeeded his father, Mohammed bin Thani as ruler of the Qa |
| UAE (AE) | 1971 | United Arab Emirates / National Day / 2 December / 1971 / United Kingdom / Merger of six emirates in the Persian Gulf (Abu Dhabi, Ajman, Dubai, Fujairah, Sharjah, and Umm |
| Bahamas (BS) | 1973 | KHÔNG THẤY |
| Guinea-Bissau (GW) | 1974 | Guinea-Bissau / Independence Day / 24 September / 1973 / Portugal / Declaration of independence in September 1973 during the country's war of liberation, although it woul |
| Grenada (GD) | 1974 | Grenada / Independence Day / 7 February / 1974 / United Kingdom / Accession of Sir Eric Gairy as the inaugural Prime Minister of Grenada. |
| Mozambique (MZ) | 1975 | Mozambique / Independence Day / 25 June / 1975 / Portugal / In September 1964 the Mozambique Liberation Front (FRELIMO) began an armed guerilla campaign against the Portu |
| Angola (AO) | 1975 | Angola / Independence Day / 11 November / 1975 / Portugal / The Alvor Agreement, signed on 15 January 1975, granted Angola independence from Portugal on 11 November, endi |
| Cabo Verde (CV) | 1975 | Cape Verde / Independence Day / 5 July / 1975 / Portugal / Effective date of the Agreement Between Portugal and Partido Africano para a Independência da Guiné e Cabo Verd |
| São Tomé và Príncipe (ST) | 1975 | São Tomé and Príncipe / Independence Day / 12 July / 1975 / Portugal / Effective date of the agreement with Portugal reached on 26 November 1974. |
| Comoros (KM) | 1975 | Comoros / Independence Day / 6 July / 1975 / France / Unilateral declaration of independence by the Chamber of Deputies of Comoros following the 1974 Comorian independenc |
| Papua New Guinea (PG) | 1975 | Papua New Guinea / Independence Day / 16 September / 1975 / Australia / Effective date of the Papua New Guinea Independence Act 1975 |
| Suriname (SR) | 1975 | Suriname / Independence Day / 25 November / 1975 / Netherlands / Under the left-wing pro-independence Den Uyl cabinet Suriname gained independence, albeit with substantia |
| Seychelles (SC) | 1976 | Seychelles / Independence Day / 29 June / 1976 / United Kingdom / Sir James R. Mancham became the country's first President, with France-Albert René as Prime Minister. |
| Djibouti (DJ) | 1977 | Djibouti / Independence Day / 27 June / 1977 / France / Independence from France following a successful independence referendum held in May 1977. |
| Dominica (DM) | 1978 | Dominica / Independence Day / 3 November / 1978 / United Kingdom / Independence from the United Kingdom following the creation of the Dominican constitution. |
| Quần đảo Solomon (SB) | 1978 | Solomon Islands / Independence Day / 7 July / 1978 / United Kingdom / Solomon Islands Act 1978. |
| Tuvalu (TV) | 1978 | Tuvalu / Independence Day / 1 October / 1978 / United Kingdom / Toaripi Lauti became the inaugural Tuvaluan prime minister. |
| Saint Lucia (LC) | 1979 | Saint Lucia / Independence Day / 22 February / 1979 / Association with the United Kingdom fully terminated. |
| Saint Vincent và Grenadines (VC) | 1979 | Saint Vincent and the Grenadines / Independence Day / 27 October / 1979 / Association with the United Kingdom fully terminated. |
| Kiribati (KI) | 1979 | Kiribati / National Day / 12 July / 1979 / United Kingdom / Kiribati gained its independence from the United Kingdom, becoming a sovereign state in 1979. |
| Vanuatu (VU) | 1980 | Vanuatu / Independence Day / 30 July / 1980 / United Kingdom France / Name of the country changed from the New Hebrides to Vanuatu. |
| Belize (BZ) | 1981 | Belize / Independence Day / 21 September / 1981 / United Kingdom / Effective day of the Belize Act 1981. |
| Antigua và Barbuda (AG) | 1981 | Antigua and Barbuda / Independence Day / 1 November / 1981 / United Kingdom / The effective date of the Antigua Termination of Association Order passed by the Parliament  |
| Saint Kitts và Nevis (KN) | 1983 | Saint Kitts and Nevis / Independence Day / 19 September / 1983 / United Kingdom / Association with the United Kingdom fully terminated. |
| Brunei (BN) | 1984 | Brunei / National Day / 23 February / 1984 / United Kingdom / Brunei gained full independence effective 1 January 1984 under the Treaty of Friendship and Co-operation of  |
| Namibia (NA) | 1990 | Namibia / Independence Day / 21 March / 1990 / South Africa / The New York Accords signed in December 1988 guaranteed Namibian independence two years later. |
| Quần đảo Marshall (MH) | 1986 | Marshall Islands / Constitution Day / 1 May / 1979 / United States / Constitution of the Marshall Islands enacted in force. |
| Micronesia (FM) | 1986 | Micronesia / Independence Day / 3 November / 1986 / United States / Effective date of the Compact of Free Association. |
| Palau (PW) | 1994 | Palau / Independence Day / 1 October / 1994 / United States / 9 July 1980 is Palau's Constitution Day usually commemorated with formal events. Independence Day celebratio |

## Bảng đối chiếu: chế độ, chiến tranh, tên nước, tên thành phố
| Mã | Khẳng định | Bài | Kết quả |
|---|---|---|---|
| `AR-junta` | AR 24/3/1976–10/12/1983 độc tài quân sự | [National Reorganization Process](https://en.wikipedia.org/wiki/National_Reorganization_Process) | khớp |
| `CL-pinochet` | CL 11/9/1973–11/3/1990 | [Military dictatorship of Chile](https://en.wikipedia.org/wiki/Military_dictatorship_of_Chile) | khớp |
| `BR-military` | BR 1/4/1964–15/3/1985 | [Military dictatorship in Brazil](https://en.wikipedia.org/wiki/Military_dictatorship_in_Brazil) | khớp |
| `UY-dict` | UY 1973–1985 | [Civic-military dictatorship of Uruguay](https://en.wikipedia.org/wiki/Civic-military_dictatorship_of_Uruguay) | khớp |
| `ES-franco` | ES Franco đến cuối 1975 | [Francoist Spain](https://en.wikipedia.org/wiki/Francoist_Spain) | khớp |
| `PT-estado` | PT Estado Novo đến 25/4/1974 | [Estado Novo (Portugal)](https://en.wikipedia.org/wiki/Estado_Novo_(Portugal)) | khớp |
| `GR-junta` | GR 21/4/1967–24/7/1974 | [Greek junta](https://en.wikipedia.org/wiki/Greek_junta) | khớp |
| `CY-1974` | CY 1974 đảo chính và Thổ Nhĩ Kỳ đưa quân vào | [Turkish invasion of Cyprus](https://en.wikipedia.org/wiki/Turkish_invasion_of_Cyprus) | khớp |
| `IR-rev` | IR cách mạng 1979 | [Iranian Revolution](https://en.wikipedia.org/wiki/Iranian_Revolution) | khớp |
| `IR-war` | Iran–Iraq 9/1980–8/1988 | [Iran–Iraq War](https://en.wikipedia.org/wiki/Iran%E2%80%93Iraq_War) | khớp |
| `KW-gulf` | Iraq xâm chiếm Kuwait 2/8/1990 | [Iraqi invasion of Kuwait](https://en.wikipedia.org/wiki/Iraqi_invasion_of_Kuwait) | khớp |
| `IQ-2003` | Iraq war 3/2003–12/2011 | [Iraq War](https://en.wikipedia.org/wiki/Iraq_War) | khớp |
| `AF-soviet` | AF Liên Xô 12/1979–2/1989 | [Soviet–Afghan War](https://en.wikipedia.org/wiki/Soviet%E2%80%93Afghan_War) | khớp |
| `AF-us` | AF 10/2001–8/2021 | [War in Afghanistan (2001–2021)](https://en.wikipedia.org/wiki/War_in_Afghanistan_(2001%E2%80%932021)) | khớp |
| `AF-taliban` | AF Taliban 1996–2001 | [Afghanistan](https://en.wikipedia.org/wiki/Afghanistan) | khớp |
| `LB-civil` | LB 4/1975–10/1990 | [Lebanese Civil War](https://en.wikipedia.org/wiki/Lebanese_Civil_War) | khớp |
| `SY-civil` | SY nội chiến từ 2011 | [Syrian civil war](https://en.wikipedia.org/wiki/Syrian_civil_war) | khớp |
| `UA-2014` | UA 2014 Crimea | [2014 Russian annexation of Crimea](https://en.wikipedia.org/wiki/2014_Russian_annexation_of_Crimea) | khớp |
| `UA-2022` | UA 24/2/2022 | [Russo-Ukrainian war (2022–present)](https://en.wikipedia.org/wiki/Russo-Ukrainian_war_(2022%E2%80%93present)) | khớp |
| `ET-derg` | ET Derg 1974–1991 | [Derg](https://en.wikipedia.org/wiki/Derg) | khớp |
| `SO-civil` | SO nội chiến từ 1991 | [Somali Civil War](https://en.wikipedia.org/wiki/Somali_Civil_War) | khớp |
| `SL-civil` | SL 1991–2002 | [Sierra Leone Civil War](https://en.wikipedia.org/wiki/Sierra_Leone_Civil_War) | khớp |
| `LR-civil` | LR 1989–2003 | [Liberian civil wars](https://en.wikipedia.org/wiki/Liberian_civil_wars) | chưa khớp tự động (xem mục ghi chú) |
| `AO-civil` | AO 1975–2002 | [Angolan Civil War](https://en.wikipedia.org/wiki/Angolan_Civil_War) | khớp |
| `MZ-civil` | MZ 1977–1992 | [Mozambican Civil War](https://en.wikipedia.org/wiki/Mozambican_Civil_War) | khớp |
| `DZ-civil` | DZ thập niên 1990 | [Algerian Civil War](https://en.wikipedia.org/wiki/Algerian_Civil_War) | khớp |
| `CD-wars` | CD 1996–97 và 1998–2003 | [Congolese Civil War](https://en.wikipedia.org/wiki/Congolese_Civil_War) | khớp |
| `RW-civil` | RW 1990–1993 | [Rwandan Civil War](https://en.wikipedia.org/wiki/Rwandan_Civil_War) | khớp |
| `RW-geno` | RW diệt chủng 4–7/1994 | [Rwandan genocide](https://en.wikipedia.org/wiki/Rwandan_genocide) | khớp |
| `BI-civil` | BI 1993–2005 | [Burundian Civil War](https://en.wikipedia.org/wiki/Burundian_Civil_War) | khớp |
| `NG-biafra` | NG 1967–1970 | [Nigerian Civil War](https://en.wikipedia.org/wiki/Nigerian_Civil_War) | khớp |
| `SD-civil` | SD 1983–2005 | [Second Sudanese Civil War](https://en.wikipedia.org/wiki/Second_Sudanese_Civil_War) | khớp |
| `LK-civil` | LK 1983–5/2009 | [Sri Lankan civil war](https://en.wikipedia.org/wiki/Sri_Lankan_civil_war) | khớp |
| `CO-conflict` | CO 1964–2016 | [Colombian conflict](https://en.wikipedia.org/wiki/Colombian_conflict) | khớp |
| `NP-civil` | NP 1996–2006 | [Nepalese Civil War](https://en.wikipedia.org/wiki/Nepalese_Civil_War) | khớp |
| `PE-conflict` | PE 1980–2000 | [Internal conflict in Peru](https://en.wikipedia.org/wiki/Internal_conflict_in_Peru) | khớp |
| `GT-civil` | GT 1960–1996 | [Guatemalan Civil War](https://en.wikipedia.org/wiki/Guatemalan_Civil_War) | khớp |
| `SV-civil` | SV 1979–1992 | [Salvadoran Civil War](https://en.wikipedia.org/wiki/Salvadoran_Civil_War) | khớp |
| `NI-revolution` | NI cách mạng 1979 | [Nicaraguan Revolution](https://en.wikipedia.org/wiki/Nicaraguan_Revolution) | khớp |
| `NI-contra` | NI Contra 1981–1990 | [Contras](https://en.wikipedia.org/wiki/Contras) | khớp |
| `CU-special` | CU thời kỳ đặc biệt | [Special Period](https://en.wikipedia.org/wiki/Special_Period) | khớp |
| `KP-famine` | KP 1994–1998 | [1990s North Korean famine](https://en.wikipedia.org/wiki/1990s_North_Korean_famine) | khớp |
| `ID-1965` | ID 1965–1966 | [Indonesian mass killings of 1965–66](https://en.wikipedia.org/wiki/Indonesian_mass_killings_of_1965%E2%80%9366) | khớp |
| `ID-1998` | ID Suharto từ chức 21/5/1998 | [Suharto](https://en.wikipedia.org/wiki/Suharto) | khớp |
| `CN-gl` | CN đói 1959–1961 | [Great Chinese Famine](https://en.wikipedia.org/wiki/Great_Chinese_Famine) | khớp |
| `CN-cr` | CN 1966–1976 | [Cultural Revolution](https://en.wikipedia.org/wiki/Cultural_Revolution) | khớp |
| `CN-1child` | CN một con 1980–2015 | [One-child policy](https://en.wikipedia.org/wiki/One-child_policy) | khớp |
| `IN-emergency` | IN khẩn cấp 6/1975–3/1977 | [The Emergency (India)](https://en.wikipedia.org/wiki/The_Emergency_(India)) | khớp |
| `PK-1971` | PK/IN chiến tranh 1971 | [India–Pakistan war of 1971](https://en.wikipedia.org/wiki/India%E2%80%93Pakistan_war_of_1971) | khớp |
| `MM-1962` | MM 1962 đảo chính | [1962 Burmese coup d'état](https://en.wikipedia.org/wiki/1962_Burmese_coup_d'%C3%A9tat) | khớp |
| `MM-8888` | MM 1988 | [8888 Uprising](https://en.wikipedia.org/wiki/8888_Uprising) | khớp |
| `MM-2021` | MM 2021 đảo chính 1/2 | [2021 Myanmar coup d'état](https://en.wikipedia.org/wiki/2021_Myanmar_coup_d'%C3%A9tat) | khớp |
| `LA-civil` | LA 1959–1975 | [Laotian Civil War](https://en.wikipedia.org/wiki/Laotian_Civil_War) | khớp |
| `LA-lpdr` | LA CHDCND Lào 12/1975 | [Laos](https://en.wikipedia.org/wiki/Laos) | khớp |
| `HU-1956` | HU 10–11/1956 | [Hungarian Revolution of 1956](https://en.wikipedia.org/wiki/Hungarian_Revolution_of_1956) | khớp |
| `RO-1989` | RO 12/1989 | [Romanian revolution](https://en.wikipedia.org/wiki/Romanian_revolution) | khớp |
| `KR-1961` | KR 1961 đảo chính | [May 16 coup](https://en.wikipedia.org/wiki/May_16_coup) | khớp |
| `KR-1987` | KR 1987 dân chủ hóa | [June Democratic Struggle](https://en.wikipedia.org/wiki/June_Democratic_Struggle) | khớp |
| `PH-ml` | PH thiết quân luật 9/1972–1/1981 | [Martial law under Ferdinand Marcos](https://en.wikipedia.org/wiki/Martial_law_under_Ferdinand_Marcos) | chưa khớp tự động (xem mục ghi chú) |
| `PH-edsa` | PH 2/1986 | [People Power Revolution](https://en.wikipedia.org/wiki/People_Power_Revolution) | khớp |
| `DE-wall` | DE tường Berlin 13/8/1961, 9/11/1989 | [Berlin Wall](https://en.wikipedia.org/wiki/Berlin_Wall) | khớp |
| `DE-reunif` | DE 3/10/1990 | [German reunification](https://en.wikipedia.org/wiki/German_reunification) | khớp |
| `SU-end` | Liên Xô tan rã 26/12/1991 | [Dissolution of the Soviet Union](https://en.wikipedia.org/wiki/Dissolution_of_the_Soviet_Union) | khớp |
| `CS-end` | Tiệp Khắc 31/12/1992 | [Dissolution of Czechoslovakia](https://en.wikipedia.org/wiki/Dissolution_of_Czechoslovakia) | khớp |
| `YU-1991` | SI/HR 25/6/1991 | [Breakup of Yugoslavia](https://en.wikipedia.org/wiki/Breakup_of_Yugoslavia) | khớp |
| `BA-war` | BA 1992–1995 | [Bosnian War](https://en.wikipedia.org/wiki/Bosnian_War) | khớp |
| `FRY` | RS/ME 1992–2003 và 2003–2006 | [Serbia and Montenegro](https://en.wikipedia.org/wiki/Serbia_and_Montenegro) | khớp |
| `MK-name` | MK đổi tên 2019 | [North Macedonia](https://en.wikipedia.org/wiki/North_Macedonia) | khớp |
| `VN-geneva` | VN Genève 1954, vĩ tuyến 17 | [1954 Geneva Conference](https://en.wikipedia.org/wiki/1954_Geneva_Conference) | khớp |
| `VN-reunif` | VN thống nhất 2/7/1976 | [Vietnam](https://en.wikipedia.org/wiki/Vietnam) | khớp |
| `VN-rvn` | VNCH 1955 | [South Vietnam](https://en.wikipedia.org/wiki/South_Vietnam) | khớp |
| `ZA-apartheid` | ZA 1948–1994 | [Apartheid](https://en.wikipedia.org/wiki/Apartheid) | khớp |
| `KH-kr` | KH Khmer Đỏ 17/4/1975–7/1/1979 | [Khmer Rouge](https://en.wikipedia.org/wiki/Khmer_Rouge) | khớp |
| `KH-republic` | KH Cộng hòa Khmer 1970–1975 | [Khmer Republic](https://en.wikipedia.org/wiki/Khmer_Republic) | khớp |
| `KH-prk` | KH Cộng hòa Nhân dân Campuchia 1979–1989 | [People's Republic of Kampuchea](https://en.wikipedia.org/wiki/People's_Republic_of_Kampuchea) | khớp |
| `KH-untac` | KH UNTAC 1992–1993 | [United Nations Transitional Authority in Cambodia](https://en.wikipedia.org/wiki/United_Nations_Transitional_Authority_in_Cambodia) | khớp |
| `KR-war` | KR/KP chiến tranh đình chiến 27/7/1953 | [Korean War](https://en.wikipedia.org/wiki/Korean_War) | khớp |
| `YE-unif` | YE thống nhất 22/5/1990 | [Yemeni unification](https://en.wikipedia.org/wiki/Yemeni_unification) | khớp |
| `ER-fed` | ER liên bang 1952, sáp nhập 1962, độc lập 1991/1993 | [Eritrea](https://en.wikipedia.org/wiki/Eritrea) | khớp |
| `SS-indep` | SS 9/7/2011 | [South Sudan](https://en.wikipedia.org/wiki/South_Sudan) | khớp |
| `TL-indep` | TL xâm chiếm 1975, sáp nhập 1976, độc lập 20/5/2002 | [Timor-Leste](https://en.wikipedia.org/wiki/Timor-Leste) | khớp |
| `SG-merger` | SG 1963 vào Malaysia, 9/8/1965 | [State of Singapore (Malaysia)](https://en.wikipedia.org/wiki/State_of_Singapore_(Malaysia)) | khớp |
| `ZW-udi` | ZW UDI 1965, độc lập 1980 | [Rhodesia's Unilateral Declaration of Independence](https://en.wikipedia.org/wiki/Rhodesia's_Unilateral_Declaration_of_Independence) | khớp |
| `ZW-1980` | ZW 18/4/1980 | [Zimbabwe](https://en.wikipedia.org/wiki/Zimbabwe) | khớp |
| `BD-1971` | BD 1971 | [Bangladesh Liberation War](https://en.wikipedia.org/wiki/Bangladesh_Liberation_War) | khớp |
| `NA-1990` | NA 21/3/1990 | [Namibia](https://en.wikipedia.org/wiki/Namibia) | khớp |
| `TV-name` | TV Ellice → Tuvalu 1975, độc lập 1978 | [Tuvalu](https://en.wikipedia.org/wiki/Tuvalu) | khớp |
| `BJ-name` | BJ Dahomey → Benin 1975 | [Benin](https://en.wikipedia.org/wiki/Benin) | khớp |
| `BF-name` | BF Upper Volta → Burkina Faso 1984 | [Burkina Faso](https://en.wikipedia.org/wiki/Burkina_Faso) | khớp |
| `SZ-name` | SZ → Eswatini 2018 | [Eswatini](https://en.wikipedia.org/wiki/Eswatini) | khớp |
| `WS-name` | WS 1997 | [Samoa](https://en.wikipedia.org/wiki/Samoa) | khớp |
| `LK-name` | LK Ceylon → Sri Lanka 1972 | [Sri Lanka](https://en.wikipedia.org/wiki/Sri_Lanka) | khớp |
| `MM-name` | MM Burma → Myanmar 1989 | [Myanmar](https://en.wikipedia.org/wiki/Myanmar) | khớp |
| `CD-zaire` | CD Zaire 1971–1997 | [Democratic Republic of the Congo](https://en.wikipedia.org/wiki/Democratic_Republic_of_the_Congo) | khớp |
| `BZ-name` | BZ 1973 | [Belize](https://en.wikipedia.org/wiki/Belize) | khớp |
| `DJ-name` | DJ 1967 Afars and Issas | [Djibouti](https://en.wikipedia.org/wiki/Djibouti) | khớp |
| `VU-name` | VU 1980 New Hebrides | [Vanuatu](https://en.wikipedia.org/wiki/Vanuatu) | khớp |
| `KI-name` | KI 1979 | [Kiribati](https://en.wikipedia.org/wiki/Kiribati) | khớp |
| `GY-name` | GY 1966 | [Guyana](https://en.wikipedia.org/wiki/Guyana) | khớp |
| `C-saigon` | Sài Gòn → TP.HCM 1976 | [Ho Chi Minh City](https://en.wikipedia.org/wiki/Ho_Chi_Minh_City) | khớp |
| `C-mumbai` | Bombay → Mumbai 1995 | [Mumbai](https://en.wikipedia.org/wiki/Mumbai) | khớp |
| `C-chennai` | Madras → Chennai 1996 | [Chennai](https://en.wikipedia.org/wiki/Chennai) | khớp |
| `C-kolkata` | Calcutta → Kolkata 2001 | [Kolkata](https://en.wikipedia.org/wiki/Kolkata) | khớp |
| `C-bengaluru` | Bangalore → Bengaluru 2014 | [Bengaluru](https://en.wikipedia.org/wiki/Bengaluru) | khớp |
| `C-yangon` | Rangoon → Yangon 1989 | [Yangon](https://en.wikipedia.org/wiki/Yangon) | khớp |
| `C-spb` | Leningrad → St Petersburg 1991 | [Saint Petersburg](https://en.wikipedia.org/wiki/Saint_Petersburg) | khớp |
| `C-volgograd` | Stalingrad → Volgograd 1961 | [Volgograd](https://en.wikipedia.org/wiki/Volgograd) | khớp |
| `C-almaty` | Alma-Ata → Almaty 1993 | [Almaty](https://en.wikipedia.org/wiki/Almaty) | khớp |
| `C-astana` | Akmola → Astana 1998; Nur-Sultan 2019–2022 | [Astana](https://en.wikipedia.org/wiki/Astana) | khớp |
| `C-bishkek` | Frunze → Bishkek 1991 | [Bishkek](https://en.wikipedia.org/wiki/Bishkek) | khớp |
| `C-dushanbe` | Stalinabad → Dushanbe 1961 | [Dushanbe](https://en.wikipedia.org/wiki/Dushanbe) | khớp |
| `C-kinshasa` | Léopoldville → Kinshasa 1966 | [Kinshasa](https://en.wikipedia.org/wiki/Kinshasa) | khớp |
| `C-lubumbashi` | Élisabethville → Lubumbashi 1966 | [Lubumbashi](https://en.wikipedia.org/wiki/Lubumbashi) | khớp |
| `C-harare` | Salisbury → Harare 1982 | [Harare](https://en.wikipedia.org/wiki/Harare) | khớp |
| `C-mutare` | Umtali → Mutare 1982 | [Mutare](https://en.wikipedia.org/wiki/Mutare) | khớp |
| `C-gweru` | Gwelo → Gweru 1982 | [Gweru](https://en.wikipedia.org/wiki/Gweru) | khớp |
| `C-maputo` | Lourenço Marques → Maputo 1976 | [Maputo](https://en.wikipedia.org/wiki/Maputo) | khớp |
| `C-huambo` | Nova Lisboa → Huambo 1975 | [Huambo](https://en.wikipedia.org/wiki/Huambo) | khớp |

## Bảng đối chiếu: biến cố và công nghệ
| Mã | Khẳng định | Bài | Kết quả |
|---|---|---|---|
| `ev-indochina` | Chiến tranh Đông Dương lần thứ nhất 1946–1954 | [First Indochina War](https://en.wikipedia.org/wiki/First_Indochina_War) | khớp |
| `ev-geneva-300` | Genève: 300 ngày tự do đi lại | [Operation Passage to Freedom](https://en.wikipedia.org/wiki/Operation_Passage_to_Freedom) | chưa khớp tự động (xem mục ghi chú) |
| `ev-geneva-17` | Genève: chia tại vĩ tuyến 17, 7/1954 | [1954 Geneva Conference](https://en.wikipedia.org/wiki/1954_Geneva_Conference) | khớp |
| `ev-geneva-regroup` | Tập kết lực lượng và gia đình Việt Minh ra Bắc (khoảng 90.000) | [1954 Geneva Conference](https://en.wikipedia.org/wiki/1954_Geneva_Conference) | khớp |
| `ev-land-1953` | Cải cách ruộng đất 1953–1956 | [Land reform in North Vietnam](https://en.wikipedia.org/wiki/Land_reform_in_North_Vietnam) | khớp |
| `ev-land-sai` | Sửa sai 1956 | [Land reform in North Vietnam](https://en.wikipedia.org/wiki/Land_reform_in_North_Vietnam) | khớp |
| `ev-truongchinh` | Trường Chinh từ chức 1956 | [Trường Chinh](https://en.wikipedia.org/wiki/Tr%C6%B0%E1%BB%9Dng_Chinh) | khớp |
| `ev-us-1965` | Quân bộ chiến Mỹ 3/1965 | [Vietnam War](https://en.wikipedia.org/wiki/Vietnam_War) | khớp |
| `ev-rt` | Rolling Thunder 3/1965–11/1968 | [Operation Rolling Thunder](https://en.wikipedia.org/wiki/Operation_Rolling_Thunder) | chưa khớp tự động (xem mục ghi chú) |
| `ev-lb2` | Linebacker II 12/1972 (Hà Nội, Hải Phòng) | [Operation Linebacker II](https://en.wikipedia.org/wiki/Operation_Linebacker_II) | khớp |
| `ev-tet` | Tết Mậu Thân 1968, Huế | [Battle of Huế](https://en.wikipedia.org/wiki/Battle_of_Hu%E1%BA%BF) | khớp |
| `ev-arvn-draft` | VNCH động viên 1968 | [Army of the Republic of Vietnam](https://en.wikipedia.org/wiki/Army_of_the_Republic_of_Vietnam) | chưa khớp tự động (xem mục ghi chú) |
| `ev-pavn-draft` | VNDCCH nghĩa vụ quân sự 1960 | [People's Army of Vietnam](https://en.wikipedia.org/wiki/People's_Army_of_Vietnam) | khớp |
| `ev-reedu` | Học tập cải tạo sau 1975 | [Re-education camps (Vietnam)](https://en.wikipedia.org/wiki/Re-education_camps_(Vietnam)) | chưa khớp tự động (xem mục ghi chú) |
| `ev-nez` | Vùng kinh tế mới | [New Economic Zones](https://en.wikipedia.org/wiki/New_Economic_Zones) | chưa khớp tự động (xem mục ghi chú) |
| `ev-boat` | Thuyền nhân 1975– | [Vietnamese boat people](https://en.wikipedia.org/wiki/Vietnamese_boat_people) | khớp |
| `ev-hoa` | Làn sóng người Hoa 1978–1979 | [Hoa people](https://en.wikipedia.org/wiki/Hoa_people) | khớp |
| `ev-currency` | Đổi tiền 1978 và 9/1985 | [Vietnamese đồng](https://en.wikipedia.org/wiki/Vietnamese_%C4%91%E1%BB%93ng) | khớp |
| `ev-doimoi` | Đổi Mới, Đại hội VI 12/1986 | [Đổi Mới](https://en.wikipedia.org/wiki/%C4%90%E1%BB%95i_M%E1%BB%9Bi) | khớp |
| `ev-resolution10` | Nghị quyết 10 năm 1988 | [Đổi Mới](https://en.wikipedia.org/wiki/%C4%90%E1%BB%95i_M%E1%BB%9Bi) | khớp |
| `ev-cambodia` | VN ở Campuchia 12/1978–1989 | [Cambodian–Vietnamese War](https://en.wikipedia.org/wiki/Cambodian%E2%80%93Vietnamese_War) | khớp |
| `ev-sinovn` | Chiến tranh biên giới 17/2/1979 | [Sino-Vietnamese War](https://en.wikipedia.org/wiki/Sino-Vietnamese_War) | khớp |
| `ev-evac` | Khmer Đỏ vào Phnôm Pênh 17/4/1975 và sơ tán | [Khmer Rouge](https://en.wikipedia.org/wiki/Khmer_Rouge) | khớp |
| `ev-kr-money` | Khmer Đỏ bãi bỏ tiền tệ, chợ, trường học | [Khmer Rouge](https://en.wikipedia.org/wiki/Khmer_Rouge) | khớp |
| `ev-kr-toll` | Khmer Đỏ 1,5–2 triệu người chết | [Cambodian genocide](https://en.wikipedia.org/wiki/Cambodian_genocide) | khớp |
| `ev-kr-end` | Khmer Đỏ sụp đổ 7/1/1979 | [Khmer Rouge](https://en.wikipedia.org/wiki/Khmer_Rouge) | khớp |
| `ev-oil73` | Cú sốc dầu 10/1973 | [1973 oil crisis](https://en.wikipedia.org/wiki/1973_oil_crisis) | khớp |
| `ev-recession80` | Suy thoái đầu thập niên 1980 | [Early 1980s recession](https://en.wikipedia.org/wiki/Early_1980s_recession) | khớp |
| `ev-shock-therapy` | Thả giá 1/1992 ở Nga | [Shock therapy (economics)](https://en.wikipedia.org/wiki/Shock_therapy_(economics)) | khớp |
| `ev-hyper` | Siêu lạm phát Nam Tư 1992–94, Ba Lan 1989–90 | [Hyperinflation](https://en.wikipedia.org/wiki/Hyperinflation) | khớp |
| `ev-albania` | Albania 1997 sơ đồ kim tự tháp | [1997 Albanian civil unrest](https://en.wikipedia.org/wiki/1997_Albanian_civil_unrest) | khớp |
| `ev-yugo` | Các cuộc chiến tranh Nam Tư 1991–2001 | [Yugoslav Wars](https://en.wikipedia.org/wiki/Yugoslav_Wars) | khớp |
| `ev-sarajevo` | Vây hãm Sarajevo 4/1992–2/1996 | [Siege of Sarajevo](https://en.wikipedia.org/wiki/Siege_of_Sarajevo) | khớp |
| `ev-kosovo` | NATO ném bom 3–6/1999 | [NATO bombing of Yugoslavia](https://en.wikipedia.org/wiki/NATO_bombing_of_Yugoslavia) | khớp |
| `ev-mk2001` | Xung đột Macedonia 2001 | [2001 Macedonian conflict](https://en.wikipedia.org/wiki/2001_Macedonian_conflict) | chưa khớp tự động (xem mục ghi chú) |
| `ev-asia97` | Khủng hoảng châu Á 7/1997 | [1997 Asian financial crisis](https://en.wikipedia.org/wiki/1997_Asian_financial_crisis) | khớp |
| `ev-ge-2008` | Thất nghiệp Mỹ đỉnh 10,0% 10/2009 | [Great Recession in the United States](https://en.wikipedia.org/wiki/Great_Recession_in_the_United_States) | khớp |
| `ev-iceland` | Iceland 10/2008 ngân hàng sụp đổ | [2008–2011 Icelandic financial crisis](https://en.wikipedia.org/wiki/2008%E2%80%932011_Icelandic_financial_crisis) | khớp |
| `ev-tsunami` | Sóng thần 26/12/2004 | [2004 Indian Ocean earthquake and tsunami](https://en.wikipedia.org/wiki/2004_Indian_Ocean_earthquake_and_tsunami) | khớp |
| `ev-covid` | WHO tuyên bố đại dịch 11/3/2020 | [COVID-19 pandemic](https://en.wikipedia.org/wiki/COVID-19_pandemic) | khớp |
| `t-tv` | TV: BBC 1936 | [History of television](https://en.wikipedia.org/wiki/History_of_television) | khớp |
| `t-mobile` | Điện thoại di động 1983 | [DynaTAC](https://en.wikipedia.org/wiki/DynaTAC) | khớp |
| `t-www` | WWW công khai 1991 | [World Wide Web](https://en.wikipedia.org/wiki/World_Wide_Web) | khớp |
| `t-facebook` | Facebook 2004 | [Facebook](https://en.wikipedia.org/wiki/Facebook) | khớp |
| `t-youtube` | YouTube 2005 | [YouTube](https://en.wikipedia.org/wiki/YouTube) | khớp |
| `t-hiv` | AIDS ghi nhận 1981 | [HIV/AIDS](https://en.wikipedia.org/wiki/HIV%2FAIDS) | khớp |
| `t-ivf` | IVF 1978 | [Louise Brown](https://en.wikipedia.org/wiki/Louise_Brown) | khớp |
| `t-pill` | Viên tránh thai 1960 | [Combined oral contraceptive pill](https://en.wikipedia.org/wiki/Combined_oral_contraceptive_pill) | khớp |
| `t-atm` | ATM 1967 | [ATM](https://en.wikipedia.org/wiki/ATM) | khớp |
| `t-lol` | League of Legends 2009 | [League of Legends](https://en.wikipedia.org/wiki/League_of_Legends) | khớp |
| `t-pubg` | PUBG 2017 | [PUBG: Battlegrounds](https://en.wikipedia.org/wiki/PUBG%3A_Battlegrounds) | khớp |
| `t-appstore` | App Store 2008 | [App Store (Apple)](https://en.wikipedia.org/wiki/App_Store_(Apple)) | khớp |
| `t-skype` | Skype 2003 | [Skype](https://en.wikipedia.org/wiki/Skype) | khớp |
| `t-atvncg` | Anh trai vượt ngàn chông gai 2024 | [Anh Trai Vượt Ngàn Chông Gai](https://en.wikipedia.org/wiki/Anh_Trai_V%C6%B0%E1%BB%A3t_Ng%C3%A0n_Ch%C3%B4ng_Gai) | chưa khớp tự động (xem mục ghi chú) |
## Bổ sung 15/11/2026 (9.3.2)
- **40 mốc công nghệ còn lại**: 45 khẳng định chạy thêm, 41 khớp tự động. 4 lệch do tên bài hoặc định dạng: Twitch 2011, CT lâm sàng 1971, giải esports Red Annihilation 1997 (đều là mốc rất quen thuộc, chưa tìm được nguồn khác trong lượt này; giữ nguyên) và MRI. Với MRI, nguồn cho thấy ảnh MRI người đầu tiên là ngón tay năm 1976 (Mansfield, Nottingham), toàn thân 3/7/1977 (Damadian); mốc sớm nhất sửa từ 1977 thành 1976.
- **Văn bản gốc (bản chép lại trên Wikisource) của Hiệp định đình chỉ chiến sự ở Việt Nam, 20/7/1954**: điều 14(d) cho phép dân thường ở vùng của bên này sang vùng của bên kia, được giúp đỡ, từ khi hiệp định có hiệu lực đến khi di chuyển quân đội xong; điều 15 giới hạn việc di chuyển quân trong 300 ngày; điều 1 lập vùng phi quân sự rộng không quá 5 km mỗi bên giới tuyến quân sự tạm thời. Khớp với câu trong game; tuy vậy văn bản không nêu tên vĩ tuyến 17 (đường nằm trên bản đồ đính kèm và tuyên bố cuối cùng).
- Các điểm nhạy cảm khác (cải cách ruộng đất, học tập cải tạo, Khmer Đỏ) chưa đọc được văn bản gốc hay nghiên cứu học thuật; vẫn ở mức nguồn thứ cấp.

## Hiệu chỉnh tham số biến cố (15/11/2026)
Xem `docs/ERA-GIAI-DOAN-3-5-930.md`, mục tham số. Thay đổi: tử vong quân nhân miền Bắc ×1,5; vượt biên chết 20% (trước 15%); phân bổ nước định cư US 55 / AU 15 / CA 14 / FR 9 / DE 4 / GB 3; mất tiền khi lạm phát phi mã 60%/30% với nhóm Liên Xô cũ, Serbia, Bosnia và 35%/20% với nhóm khác; COVID-19 2022 từ 45% xuống 35%. Mọi tỷ lệ vẫn là tham số, chỉ đã được kéo về cùng bậc độ lớn với các mốc công bố.
