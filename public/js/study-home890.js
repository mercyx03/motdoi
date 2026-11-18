/* 9.0: nâng độ sâu sáu vùng học tại nhà đã có quy tắc chung (British Columbia, Queensland, Manitoba, Nova Scotia, Florida, Virginia) bằng trang chính thức đọc được ngày 14/11/2026.
   Bổ sung tuổi, hạn nộp, người dạy, đánh giá, tài trợ và điều kiện văn bằng; giữ mã báo cáo cũ ("đăng ký năm", "annual report") và mã lộ trình "family" để bản lưu cũ chạy tiếp.
   Vùng chưa đọc được nguồn (Ontario: PDF không trích được văn bản; Western Australia: chỉ đọc qua bản tóm tắt; South Australia, Tasmania và nhiều bang Mỹ chặn truy cập tự động) giữ nguyên quy tắc chung.
   Thủ tục là ảnh chụp 2026, không phải ngày hiệu lực pháp luật; không gán số tiền chưa xác minh. */
(function(G){'use strict';var E=G.E,S=E.STUDY857;if(!S||!S.RULES||!S.SOURCES||!['CA:BC','AU:QLD','CA:MB','CA:NS','US:FL','US:VA'].every(function(k){return S.RULES[k];}))return;
S.SOURCES.bc='https://www2.gov.bc.ca/gov/content/education-training/k-12/support/classroom-alternatives/homeschooling';
S.SOURCES.qld='https://ppr.qed.qld.gov.au/pp/home-education-in-queensland-procedure';
S.SOURCES.mb='https://www.edu.gov.mb.ca/k12/schools/ind/homeschool/faqs.html';
S.SOURCES.ns='https://www.ednet.ns.ca/homeschooling/questions-answers';
S.SOURCES.fl='https://www.flsenate.gov/Laws/Statutes/2023/1002.41';
S.SOURCES.va='https://law.lis.virginia.gov/vacode/title22.1/chapter14/section22.1-254.1/';
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
upgrade('CA:MB','mb',{
 ages:[5,17],
 withdrawal:'Thông báo cho Bộ trưởng bằng Student Notification Form gửi Homeschooling Office trước 1/9 (gia đình quay lại) hoặc trong 30 ngày kể từ khi bắt đầu (gia đình mới), kèm bản phác thảo chương trình; thông báo lại hằng năm.',
 curriculum:'Bản phác thảo chương trình phải bao gồm ngôn ngữ, toán, khoa học, khoa học xã hội; chương trình tỉnh là tùy chọn',
 assessment:'Báo cáo tiến độ từng học sinh vào tháng 1 và tháng 6; không bắt buộc kiểm tra cấp tỉnh',
 aidNote:'Tỉnh không cấp tài trợ cho gia đình homeschool.',
 credentialNote:'Homeschooling Office không cấp tín chỉ; học sinh chỉ nhận bằng tốt nghiệp Manitoba khi đủ điều kiện tốt nghiệp.',
 records:['student notification form','bản phác thảo chương trình','báo cáo tháng 1 và tháng 6','kế hoạch','bài làm']});
upgrade('CA:NS','ns',{
 withdrawal:'Phụ huynh phải đăng ký với Bộ Giáo dục: nộp Registration Form cho từng trẻ mỗi năm, nhận được trước 20/9, gửi Regional Education Services (qua thư hoặc biểu mẫu trực tuyến); trẻ mới hoặc vào lớp đầu cấp cần giấy khai sinh. Trẻ phải đủ năm tuổi trước ngày 31/12 mới đăng ký được.',
 assessment:'Báo cáo tiến độ học sinh hằng năm vào tháng 6; chấp nhận dạng nhận xét tự do',
 aidNote:'Bộ không cấp tài trợ cho homeschool.',
 credentialNote:'Bộ không cấp tín chỉ hay chứng nhận tốt nghiệp; trường tiếp nhận quyết định tín chỉ lớp cuối cấp.',
 records:['registration form','giấy khai sinh','báo cáo tiến độ tháng 6','kế hoạch','bài làm']});
upgrade('US:FL','fl',{
 withdrawal:'Gửi thông báo bằng văn bản có chữ ký cho tổng giám đốc học khu trong 30 ngày kể từ khi lập chương trình (họ tên, địa chỉ, ngày sinh từng trẻ); học khu đăng ký ngay. Khi kết thúc phải thông báo trong 30 ngày.',
 teacher:'Phụ huynh không cần chứng chỉ giáo viên Florida; người đánh giá hằng năm (nếu chọn đường giáo viên) phải có chứng chỉ Florida hợp lệ',
 curriculum:'Chương trình tuần tự do phụ huynh chỉ đạo; luật không quy định giáo trình cụ thể',
 assessment:'Lưu portfolio (nhật ký hoạt động và mẫu bài làm, giữ 2 năm) và nộp đánh giá giáo dục hằng năm cho học khu: giáo viên có chứng chỉ xem xét, bài thi chuẩn hóa hoặc bài thi của bang. Tiến bộ chưa đạt thì bị quản chế một năm.',
 credentialNote:'Luật không nêu việc cấp bằng; mốc hoàn thành chương trình dựa trên bản khai có chữ ký.',
 sourceNote:'Đọc văn bản Đạo luật 2023 (flsenate.gov), chưa đối chiếu với văn bản 2026.',
 records:['thông báo','portfolio','đánh giá hằng năm','kế hoạch','bài làm']});
upgrade('US:VA','va',{
 ages:[5,17],
 withdrawal:'Gửi thông báo hằng năm cho giám đốc học khu trước 15/8 (hoặc trong 30 ngày nếu mới chuyển đến), kèm danh sách môn học và bằng chứng đáp ứng một trong bốn tiêu chí (bằng trung học, giáo viên đủ điều kiện, chương trình học đã chọn hoặc bằng chứng giáo dục đầy đủ).',
 teacher:'Cha mẹ có bằng trung học là một trong các tiêu chí; hoặc giáo viên đủ điều kiện, chương trình học đã chọn',
 curriculum:'Mô tả chương trình bằng danh sách môn học',
 assessment:'Trước 1/8 năm sau nộp bằng chứng tiến bộ: điểm chuẩn hóa từ phân vị thứ tư trở lên hoặc bản đánh giá mà giám đốc học khu chấp nhận; không bắt buộc dưới sáu tuổi. Thiếu bằng chứng thì quản chế một năm.',
 aidNote:'Luật yêu cầu học khu cho học sinh homeschool dự AP, PSAT/NMSQT và PreACT; không nêu tiền hỗ trợ.',
 records:['notice of intent','danh sách môn học','bằng chứng tiến bộ','kế hoạch','bài làm']});
E.STUDY890={upgraded:['CA:BC','AU:QLD','CA:MB','CA:NS','US:FL','US:VA'],verifiedAt:'2026-11-14'};
})(globalThis.G);
