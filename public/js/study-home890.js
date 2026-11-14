/* 9.0: nâng độ sâu hai vùng học tại nhà đã có quy tắc chung (British Columbia, Queensland) bằng trang chính thức đọc được ngày 14/11/2026.
   Bổ sung tuổi, hạn nộp, người dạy, đánh giá, tài trợ và điều kiện văn bằng; giữ mã báo cáo cũ ("đăng ký năm", "annual report") và mã lộ trình "family" để bản lưu cũ chạy tiếp.
   Vùng chưa đọc được nguồn (Ontario: PDF không trích được văn bản; Western Australia: chỉ đọc qua bản tóm tắt; các bang Mỹ chặn truy cập tự động) giữ nguyên quy tắc chung.
   Thủ tục là ảnh chụp 2026, không phải ngày hiệu lực pháp luật; không gán số tiền chưa xác minh. */
(function(G){'use strict';var E=G.E,S=E.STUDY857;if(!S||!S.RULES||!S.SOURCES||!S.RULES['CA:BC']||!S.RULES['AU:QLD'])return;
S.SOURCES.bc='https://www2.gov.bc.ca/gov/content/education-training/k-12/support/classroom-alternatives/homeschooling';
S.SOURCES.qld='https://ppr.qed.qld.gov.au/pp/home-education-in-queensland-procedure';
function upgrade(key,source,extra){var r=S.RULES[key];Object.assign(r,{source:S.SOURCES[source],checkedAt:'2026-11-14',depth890:true},extra);}
upgrade('CA:BC','bc',{
 withdrawal:'Đăng ký học sinh tại trường công (hiệu trưởng đăng ký), trường tư, trường tiếng Pháp hoặc trường học trực tuyến trước 30/9 hằng năm; không đăng ký mà tự dạy là vi phạm. Trường đăng ký không có quyền duyệt hay giám sát chương trình.',
 teacher:'Cha mẹ chịu trách nhiệm toàn bộ chương trình; không cần giáo viên có chứng chỉ BC',
 curriculum:'Cha mẹ tự cung cấp và giám sát chương trình; không yêu cầu đạt chuẩn của tỉnh, Bộ không thanh tra',
 oversight:'ít thủ tục',
 assessment:'Trường đăng ký phải cung cấp dịch vụ đánh giá miễn phí; cha mẹ có thể nhận hoặc từ chối',
 aidNote:'Tỉnh cấp $250 cho trường công (và $175 cho trường tư nhóm 1, 2) cho mỗi học sinh đăng ký, trả cho trường chứ không trả cho phụ huynh; game không cấp tiền mặt cho gia đình.',
 credentialNote:'Học sinh đăng ký homeschool không được cấp bằng tốt nghiệp BC (Dogwood) chỉ bằng homeschool; có thể học khóa trực tuyến lấy tín chỉ từ lớp 10 đến 12.',
 routes:[{id:'family',name:'Đăng ký ở trường công (hiệu trưởng đăng ký)',mode:'registration'},{id:'independent',name:'Đăng ký ở trường tư / trực tuyến (trường tự quyết định có nhận)',mode:'registration'}]});
upgrade('AU:QLD','qld',{
 ages:[6,16],
 withdrawal:'Nộp đơn đăng ký cho Queensland Home Education kèm tóm tắt chương trình và giấy tờ chứng minh (thường là giấy khai sinh); giữ ghi danh trường cho đến khi nộp đơn. Đăng ký tạm thời trước, sau đó đăng ký chính thức.',
 curriculum:'Bản tóm tắt chương trình phải cho thấy giáo dục chất lượng cao, đáp ứng nhu cầu đang thay đổi của trẻ và có cách theo dõi tiến độ',
 oversight:'giám sát chặt',
 assessment:'Báo cáo viết hằng năm, nộp trước ngày kỷ niệm đăng ký 2–3 tháng; không nộp thì nhận thông báo yêu cầu giải trình trong 30 ngày và có thể bị hủy đăng ký. Đổi địa chỉ phải báo trong 28 ngày.',
 aidNote:'Có trợ cấp sách và học liệu (Textbook and Resource Allowance) cho phụ huynh nhưng chưa xác minh mức tiền nên game không chi.',
 credentialNote:'Trang thủ tục không nói về điều kiện cấp bằng; game không tự cấp văn bằng cuối cấp.',
 records:['chứng nhận đăng ký','tóm tắt chương trình','báo cáo thường niên','kế hoạch','bài làm']});
E.STUDY890={upgraded:['CA:BC','AU:QLD'],verifiedAt:'2026-11-14'};
})(globalThis.G);
