/* 8.10.77: đối chiếu hồ sơ quốc gia theo văn bản chính thức, thay nguồn tổng hợp cho từng mệnh đề đã kiểm.
   Mỗi dòng ghi nguồn, ngày đối chiếu và phạm vi áp dụng; mệnh đề sai hoặc thiếu mốc thời kỳ được sửa tại đây. */
(function(G){'use strict';var E=G.E,D=E.COUNTRY_DEPTH_DATA;if(!D)return;var AT='2026-11-13';
var SRC={
 krCivil874:'https://elaw.klri.re.kr/eng_service/lawView.do?hseq=55222&lang=ENG',
 cnCivil874:'https://www.chinajusticeobserver.com/law/x/civil-code-of-china-part-v-marriage-and-family-20200528',
 idMarriage874:'https://peraturan.bpk.go.id/Details/122740',
 sgMarriage874:'https://www.marriage.gov.sg/Civil_Overview_of_Marriage_Process.pdf',
 sgHolidays874:'https://www.mom.gov.sg/employment-practices/public-holidays',
 thEquality874:'https://thailand.prd.go.th/en/content/category/detail/id/2874/iid/357988',
 phFamily874:'https://www.officialgazette.gov.ph/1987/07/06/executive-order-no-209-s-1987/',
 deBGB874:'https://www.gesetze-im-internet.de/bgb/__1353.html',
 deAge874:'https://www.gesetze-im-internet.de/bgb/__1303.html',
 deCeremony874:'https://www.gesetze-im-internet.de/bgb/__1310.html',
 jpAge874:'https://www.moj.go.jp/EN/MINJI/minji07_00218.html',
 thAge874:'https://www.thailandlawonline.com/translations/marriage-equality-act-amendment-act-no-24-b-e-2567'
};
Object.keys(SRC).forEach(function(k){D.sources[k]=SRC[k];});
// [nước, trường, id, nguồn, phạm vi/căn cứ, ghi chú thay thế (nếu cần sửa)]
var ROWS=[
 ['KR','marriage','wed1912','krCivil874','Bộ luật Dân sự Hàn Quốc, Điều 807 (từ 18 tuổi) và Điều 808 (người chưa thành niên cần cha mẹ đồng ý); tuổi thành niên 19.'],
 ['KR','marriage','wed0912','krCivil874','Bộ luật Dân sự Hàn Quốc, Điều 812 (hôn nhân có hiệu lực khi khai báo).'],
 ['CN','marriage','wed1912','cnCivil874','Bộ luật Dân sự Trung Quốc 2020, Điều 1047 (nam 22, nữ 20); bản dịch dựa trên bản của Quốc hội Trung Quốc.'],
 ['CN','marriage','wed0912','cnCivil874','Bộ luật Dân sự Trung Quốc 2020, Điều 1049 (đăng ký kết hôn).'],
 ['ID','marriage','wed1912','idMarriage874','Luật số 16/2019 sửa Điều 7 Luật Hôn nhân 1974, hiệu lực 15/10/2019.','Mốc luật từ 15/10/2019: cả hai từ đủ 19 tuổi. Trước đó: nam 19, nữ 16. Dưới 21 tuổi vẫn cần cha mẹ cho phép.'],
 ['SG','marriage','wed1912','sgMarriage874','Cổng hôn nhân của Chính phủ Singapore (ROM): từ 21 tuổi; 18–21 cần cha mẹ đồng ý và giấy phép; dưới 18 cần Giấy phép Hôn nhân Đặc biệt.','Từ 21 tuổi tự đăng ký; 18–21 cần cha mẹ đồng ý; dưới 18 phải xin Giấy phép Hôn nhân Đặc biệt và tham gia chương trình chuẩn bị hôn nhân.'],
 ['SG','marriage','wed0912','sgMarriage874','Registry of Marriages (ROM) và Registry of Muslim Marriages (ROMM).'],
 ['SG','festivals','national_day_sg','sgHolidays874','Danh mục ngày nghỉ lễ của Bộ Nhân lực Singapore.'],
 ['SG','festivals','chinese_new_year_sg','sgHolidays874','Danh mục ngày nghỉ lễ của Bộ Nhân lực Singapore.'],
 ['SG','festivals','hari_raya_sg','sgHolidays874','Danh mục ngày nghỉ lễ của Bộ Nhân lực Singapore.'],
 ['TH','marriage','wed1912','thAge874','Bộ luật Dân sự và Thương mại Thái Lan, Điều 1448 sửa bởi Luật số 24 B.E. 2567 (Luật Bình đẳng Hôn nhân), hiệu lực 23/1/2025.','Từ 23/1/2025: hai người bất kể giới tính, từ đủ 18 tuổi (trước đó 17); dưới 20 tuổi cần cha mẹ đồng ý.'],
 ['TH','marriage','wed0912','thEquality874','Đăng ký tại văn phòng huyện (Cục Hành chính cấp tỉnh).'],
 ['PH','marriage','wed1912','phFamily874','Bộ luật Gia đình Philippines (EO 209/1987), Điều 5 và 14.','Mốc luật: 18; 18–21 cần cha mẹ đồng ý; 21–25 cần hỏi ý kiến cha mẹ.'],
 ['PH','marriage','wed0912','phFamily874','Bộ luật Gia đình Philippines (EO 209/1987), Điều 9–11 về giấy phép kết hôn.'],
 ['PH','marriage','wed2912','phFamily874','Bộ luật Gia đình chỉ quy định vô hiệu/hủy hôn; ly hôn theo Bộ luật Nhân thân Hồi giáo (PD 1083) áp dụng cho người Hồi giáo.'],
 ['DE','marriage','wed1912','deBGB874','BGB §1353 (hôn nhân giữa hai người khác hoặc cùng giới, từ 01/10/2017).'],
 ['DE','marriage','wed0912','deCeremony874','BGB §1310: hôn nhân chỉ thành lập khi hai người tuyên bố trước viên chức hộ tịch (Standesamt); §1303: tuổi kết hôn 18.']
];
var applied=0;ROWS.forEach(function(x){var p=D.profiles[x[0]],arr=p&&p[x[1]],row=arr&&arr.find(function(r){return r.id===x[2];});if(!row)return;row.sourceGeneral874=row.source;row.source=x[3];row.verified874={at:AT,scope:x[4]};if(x[5])row.note=x[5];applied++;});
// Tuổi kết hôn tối thiểu (có cha mẹ đồng ý khi luật yêu cầu) theo nơi sống và năm; life87 gọi khi không áp luật Việt Nam.
var AGE={
 CN:{src:'cnCivil874',f:function(y){return y>=1981?{M:22,F:20,t:'Luật Hôn nhân 1980 và Bộ luật Dân sự 2020 (Điều 1047): nam 22, nữ 20.'}:{M:20,F:18,t:'Luật Hôn nhân 1950: nam 20, nữ 18.'};}},
 ID:{src:'idMarriage874',f:function(y){return y>=2020?{M:19,F:19,t:'Luật 16/2019 (từ 15/10/2019): cả hai 19 tuổi.'}:y>=1975?{M:19,F:16,t:'Luật Hôn nhân 1974: nam 19, nữ 16.'}:null;}},
 KR:{src:'krCivil874',f:function(y){return y>=2008?{M:18,F:18,t:'Bộ luật Dân sự Điều 807 (sửa bởi Luật 8720/2007): cả hai 18; dưới 19 cần cha mẹ đồng ý.'}:{M:18,F:16,t:'Điều 807 trước sửa đổi 2007: nam 18, nữ 16.'};}},
 JP:{src:'jpAge874',f:function(y){return y>=2023?{M:18,F:18,t:'Bộ luật Dân sự Nhật sửa đổi, hiệu lực 1/4/2022: cả hai 18.'}:{M:18,F:16,t:'Bộ luật Dân sự Nhật trước 1/4/2022: nam 18, nữ 16 (cần cha mẹ đồng ý khi chưa thành niên).'};}},
 TH:{src:'thAge874',f:function(y){return y>=2025?{M:18,F:18,t:'Điều 1448 sửa đổi, hiệu lực 23/1/2025: từ 18 tuổi.'}:{M:17,F:17,t:'Điều 1448 trước 2025: từ 17 tuổi.'};}},
 PH:{src:'phFamily874',f:function(y){return y>=1988?{M:18,F:18,t:'Bộ luật Gia đình (EO 209/1987), Điều 5: từ 18; 18–21 cần cha mẹ đồng ý.'}:null;}},
 SG:{src:'sgMarriage874',f:function(){return {M:18,F:18,t:'Singapore: 18–21 cần cha mẹ đồng ý; dưới 18 chỉ khi có Giấy phép Hôn nhân Đặc biệt.'};}},
 DE:{src:'deAge874',f:function(y){return y>=2018?{M:18,F:18,t:'BGB §1303 (từ 22/7/2017): 18 tuổi, không ngoại lệ.'}:null;}}
};
function at874(l){var cc=E.resCode?E.resCode(l):(l&&l.abroad&&l.abroad.code)||(l&&l.country)||'VN',y=(l&&l.birthYear!=null&&l.age!=null)?l.birthYear+l.age:null,R=AGE[cc];if(!R||y==null)return null;var v=R.f(y);if(!v)return null;return {code:cc,year:y,M:v.M,F:v.F,text:v.t,source:R.src};}
E.MARRY_AGE874={rules:AGE,at:at874,age:function(l,sex){var v=at874(l);return v?(sex==='M'?v.M:v.F):null;}};
E.COUNTRY_VERIFIED874={rows:ROWS,applied:applied,checkedAt:AT};
})(globalThis.G);
