/* v4.7.0 — đời sống thế giới. Tình huống hư cấu, không phải xác suất thống kê.
   Nguồn và quy ước: world-events-sources.md. */
(function(G){
'use strict';
var E=G.E,H=E.H,U=G.U,W=G.W,CASES=[];
// quốc gia | trải nghiệm văn hóa | hoàn cảnh | lựa chọn | chuyện đời sống | hoàn cảnh | lựa chọn | nhóm
var ROWS=`
US|Buổi nhạc tại thư viện|Thư viện địa phương tổ chức buổi nghe nhạc jazz kèm giới thiệu lịch sử.|Nghe nhạc và trao đổi với người hướng dẫn|Học ở community college|Bạn tìm hiểu khóa học ngắn tại trường cộng đồng, nhưng cần cân đối lịch và học phí.|So sánh học phí, thời gian và khả năng chuyển tín chỉ|study
CA|Ngày hội mùa đông|Một trung tâm cộng đồng giới thiệu hoạt động mùa đông phù hợp người mới.|Chọn hoạt động nhẹ trong nhà nếu thời tiết xấu|Chuẩn bị mùa lạnh|Dự báo rét khiến lịch đi làm cần điều chỉnh, bạn còn thiếu kế hoạch dự phòng.|Kiểm tra trang phục và tuyến đi làm an toàn|work
MX|Xưởng làm giấy cắt|Một xưởng cộng đồng giới thiệu nghệ thuật giấy cắt papel picado.|Thử làm mẫu trang trí và hỏi về nguồn gốc|Ý tưởng bán hàng thủ công|Bạn được mời phụ trách một gian hàng cuối tuần, chưa rõ tiền nguyên liệu và hoa hồng.|Lập bảng chi phí và thống nhất phần việc|work
BR|Vòng tròn capoeira|Một nhóm giới thiệu capoeira và phần âm nhạc của loại hình này.|Quan sát rồi thử nhịp cơ bản theo sức khỏe|Lịch ca và trận bóng|Đồng nghiệp đề xuất đổi ca để xem bóng, nhưng chưa ai nhận phần bàn giao.|Thống nhất đổi ca và ghi lại việc cần bàn giao|work
AR|Buổi giới thiệu tango|Nhà văn hóa mở buổi tìm hiểu âm nhạc và lịch sử tango.|Nghe nhạc, không bắt buộc phải khiêu vũ|Hợp đồng làm thêm|Một công việc ngắn hạn trả theo sản phẩm, phần nghiệm thu còn mơ hồ.|Yêu cầu xác nhận khối lượng và lịch thanh toán|work
CL|Đêm kể chuyện bầu trời|Nhóm khoa học cộng đồng giới thiệu quan sát bầu trời qua ảnh và bản đồ sao.|Học cách đọc bản đồ sao ở điểm sinh hoạt gần nhà|Bài tập môi trường|Lớp học đề nghị xây dựng dự án tiết kiệm nước với số liệu đo tại trường.|Đo thực tế rồi đề xuất cách giảm lãng phí|school
PE|Xưởng dệt cộng đồng|Người hướng dẫn giới thiệu cách phối màu trong một số nghề dệt của Peru.|Tìm hiểu hoa văn và ghi rõ nguồn khi giới thiệu|Dự án du lịch nhỏ|Bạn nhận nhiệm vụ giới thiệu một hành trình, nhưng ảnh quảng cáo chưa được phép sử dụng.|Xin phép tác giả và mô tả đúng điều kiện chuyến đi|work
CO|Buổi tìm hiểu cà phê|Một buổi giới thiệu hành trình hạt cà phê có cả phần tham quan bằng hình ảnh.|Tìm hiểu quy trình, không cần uống cà phê|Học kỹ năng số|Trung tâm cộng đồng có nhóm thực hành công cụ số, lịch trùng một việc riêng.|Chọn buổi phù hợp rồi học theo nhóm|study
GB|Câu lạc bộ đọc sách|Thư viện mời người dân thảo luận một cuốn sách, có bản dễ đọc.|Mượn bản phù hợp và chia sẻ cảm nhận|Chuyến tàu đi làm|Tuyến bạn thường đi thông báo thay đổi giờ, bạn có cuộc hẹn công việc.|Kiểm tra lịch mới và báo thời gian đến|work
FR|Một ngày tìm hiểu điện ảnh|Nhà văn hóa chiếu trích đoạn phim Pháp kèm thảo luận, không yêu cầu kiến thức trước.|Tham gia buổi thảo luận miễn phí|Hồ sơ thuê chỗ ở|Bạn xem một nơi ở mới nhưng hợp đồng chưa tách rõ tiền thuê và phí dịch vụ.|Đọc hợp đồng, kiểm tra chủ cho thuê trước khi đặt cọc|housing
DE|Buổi sửa đồ cộng đồng|Một repair café mời người dân học sửa vật dụng cùng tình nguyện viên.|Mang đồ nhỏ đã ngắt điện để tìm hiểu an toàn|Lộ trình học nghề|Bạn cân nhắc một khóa đào tạo kết hợp thực hành, thông tin tuyển sinh còn thiếu.|Hỏi rõ chuẩn đầu vào, chi phí và lịch thực hành|study
IT|Xưởng tìm hiểu tranh khảm|Nhà văn hóa giới thiệu kỹ thuật tranh khảm bằng vật liệu mô hình.|Làm mẫu nhỏ và tìm hiểu cách bảo tồn|Khách muốn giao sớm|Đơn hàng cần giao sớm hơn lịch, nhưng cắt bước kiểm tra có thể làm sai chất lượng.|Thương lượng tiến độ thay vì bỏ kiểm tra|work
ES|Buổi học nhịp flamenco|Một câu lạc bộ giới thiệu nhạc và nhịp vỗ tay flamenco.|Học nhịp nhẹ, chọn ngồi nghe nếu cần|Dự án lớp bằng hai ngôn ngữ|Nhóm học sinh có người mới chuyển đến, chưa hiểu hết phần phân công.|Chia việc rõ ràng và hỗ trợ ngôn ngữ|school
PT|Buổi nghe fado|Một thư viện mở buổi giới thiệu fado và các bản ghi âm có chú giải.|Nghe và hỏi về bối cảnh bài hát|Việc làm theo mùa|Lịch công việc theo mùa được đề xuất nhưng giờ nghỉ và tiền làm thêm chưa rõ.|Hỏi điều kiện bằng văn bản trước khi nhận|work
NL|Chuyến đi xe đạp cộng đồng|Nhóm dân cư giới thiệu cách tổ chức đường đi an toàn, có lựa chọn đi bộ.|Chọn lộ trình phù hợp khả năng vận động|Dự án bảo vệ nguồn nước|Lớp học cần xây dựng mô hình quản lý nước với vật liệu tái sử dụng.|Thử mô hình rồi ghi cả kết quả chưa thành công|school
BE|Gặp gỡ truyện tranh|Thư viện tổ chức buổi trao đổi về truyện tranh Bỉ và cách kể chuyện bằng hình.|Đọc một tác phẩm và thử vẽ khung truyện|Bàn giao đa ngôn ngữ|Một thông báo công việc cần gửi cho nhóm dùng nhiều ngôn ngữ.|Dùng bản hướng dẫn dễ hiểu và xác nhận lại|work
CH|Ngày hội đường mòn|Câu lạc bộ giới thiệu bản đồ đường mòn, kèm lựa chọn tuyến bằng phẳng gần nhà.|Chọn tuyến theo thể lực và dự báo thời tiết|Học quản lý ngân sách|Một khóa cộng đồng hướng dẫn lập ngân sách cá nhân, không hứa hẹn lợi nhuận.|Lập quỹ dự phòng trước khi tính đầu tư|study
AT|Buổi nghe nhạc cổ điển|Nhà văn hóa mở buổi nghe nhạc có người giải thích cấu trúc tác phẩm.|Nghe và hỏi điều mình chưa hiểu|Dự án thực hành nghề|Bạn có cơ hội dự giờ một lớp thực hành, cần phân biệt buổi tham khảo và chứng chỉ chính thức.|Xác nhận giá trị khóa học trước khi đăng ký|study
SE|Buổi trò chuyện cộng đồng|Một nhóm dân cư mời mọi người nghỉ giải lao cùng nhau, đồ uống tùy chọn.|Tham gia và lắng nghe người mới|Cuộc họp quá tải|Lịch họp kéo dài làm việc cá nhân bị dồn, bạn muốn đề xuất thay đổi.|Đề xuất chương trình họp gọn và giờ tập trung|work
NO|Câu chuyện về thiên nhiên|Nhóm địa phương giới thiệu cách đi chơi ngoài trời mà giảm tác động môi trường.|Chọn đường ngắn và mang rác về|Lịch làm việc mùa tối|Ngày ít ánh sáng khiến bạn khó giữ giờ ngủ khi làm việc.|Sắp xếp giờ nghỉ, trao đổi lịch phù hợp|work
FI|Tìm hiểu văn hóa sauna|Một buổi sinh hoạt giới thiệu văn hóa sauna; tham gia thực tế hoàn toàn tự nguyện.|Nghe giới thiệu, không cần vào phòng nóng|Học cùng thư viện|Thư viện có nhóm học độc lập, bạn đang cần lịch ôn đều đặn.|Chọn mục tiêu nhỏ và ghi tiến bộ mỗi tuần|study
DK|Xưởng thiết kế đơn giản|Nhà văn hóa mời người dân thử thiết kế một vật dụng dùng lại nhiều lần.|Thử làm mô hình rồi trao đổi công năng|Góp ý ở nơi làm việc|Nhóm đang chọn cách phân công, ý kiến người mới chưa được nghe.|Mời mọi người góp ý và xác nhận trách nhiệm|work
PL|Buổi kể chuyện dân gian|Thư viện giới thiệu truyện dân gian Ba Lan và mời kể lại bằng tranh.|Chọn một câu chuyện để tìm hiểu|Nhóm học lập trình|Bạn được mời tham gia dự án nhỏ, có người mới và người đã biết nhiều.|Chia nhiệm vụ vừa sức và kiểm tra mã cùng nhau|study
GR|Buổi giới thiệu sân khấu|Một câu lạc bộ nói về sân khấu Hy Lạp qua trích đoạn và mô hình.|Nghe giới thiệu rồi thử đọc một đoạn ngắn|Tổ chức sự kiện địa phương|Bạn giúp chuẩn bị hoạt động cộng đồng, ngân sách và người phụ trách chưa rõ.|Công khai kế hoạch và kiểm tra khả năng tiếp cận|community
TR|Xưởng nghệ thuật ebru|Người hướng dẫn giới thiệu vẽ họa tiết trên mặt nước bằng vật liệu phù hợp.|Thử mẫu đơn giản theo hướng dẫn|Báo giá thay đổi|Chi phí nguyên liệu của đơn hàng đổi, khách vẫn nghĩ dùng báo giá cũ.|Giải thích phần thay đổi trước khi tiếp tục|work
RU|Câu lạc bộ văn học|Thư viện tổ chức buổi đọc truyện ngắn Nga, có phần trao đổi dành cho người mới.|Chọn đoạn dễ đọc và chia sẻ cảm nhận|Lịch học từ xa|Khóa học trực tuyến thay đổi giờ gặp nhóm, bạn chưa có cách theo dõi bài.|Thống nhất giờ và lưu bản ghi bài học được phép|study
UA|Xưởng trang trí trứng|Một nhóm văn hóa giới thiệu nghệ thuật pysanka qua vật liệu mô hình.|Tìm hiểu hoa văn và thử trang trí|Giữ bản sao giấy tờ|Bạn muốn sắp xếp hồ sơ cá nhân để tránh thất lạc khi chuyển chỗ ở.|Lưu bản sao an toàn và ghi thông tin liên hệ cần thiết|housing
JP|Tìm hiểu washoku|Trung tâm cộng đồng giới thiệu washoku qua ảnh và cách sắp xếp bữa ăn.|Hỏi về nguyên liệu, chọn phần phù hợp chế độ ăn|Nhóm chuẩn bị phỏng vấn|Bạn cân nhắc buổi thực hành phỏng vấn, nhóm muốn chia sẻ cả điều chưa làm tốt.|Luyện trả lời trung thực và xin phản hồi|study
KR|Buổi thử viết Hangul|Thư viện mở buổi thực hành nét chữ Hangul cho người quan tâm ngôn ngữ.|Thử viết và tìm hiểu lịch sử chữ viết|Đề nghị làm thêm giờ|Công việc phát sinh cuối ngày, lịch nghỉ đã được sắp xếp từ trước.|Trao đổi phạm vi công việc và thời gian bù phù hợp|work
CN|Xưởng thư pháp|Nhà văn hóa giới thiệu thư pháp, có người hướng dẫn cho người mới.|Tập nét cơ bản, không so thành tích|Dự án học theo nhóm|Lớp học cần trình bày một ý tưởng kỹ thuật, nhóm đang chia việc không đều.|Phân công rõ và ghi nguồn tài liệu|school
SG|Câu chuyện khu ăn uống cộng đồng|Một buổi giới thiệu văn hóa hawker có phần nói về người giữ nghề.|Tìm hiểu câu chuyện người bán, không bắt buộc mua món|Ứng dụng học tập mới|Khóa học mời bạn dùng một nền tảng, nhưng yêu cầu quá nhiều thông tin riêng.|Kiểm tra quyền riêng tư và chọn dữ liệu cần thiết|study
IN|Buổi tìm hiểu yoga|Nhà văn hóa giới thiệu yoga, có lựa chọn chỉ nghe và bài tập rất nhẹ.|Chọn mức phù hợp sức khỏe, dừng nếu khó chịu|Dự án ngôn ngữ|Nhóm học có người dùng nhiều ngôn ngữ khác nhau, tài liệu chung khó hiểu.|Thống nhất cách chú giải và hỏi lại nội dung|school
ID|Xưởng tìm hiểu batik|Một nhóm thợ giới thiệu hoa văn và kỹ thuật batik qua mẫu vật.|Hỏi nguồn gốc họa tiết rồi thử trên giấy|Cửa hàng lên mạng|Bạn được giao đưa danh mục hàng lên mạng, ảnh và mô tả chưa thống nhất.|Kiểm tra tồn kho và mô tả đúng sản phẩm|work
TH|Buổi giới thiệu múa khon|Nhà văn hóa giới thiệu mặt nạ và sân khấu khon bằng tư liệu.|Nghe câu chuyện và quan sát động tác mẫu|Khách quốc tế cần hướng dẫn|Trong công việc, khách hiểu nhầm một phần dịch vụ do khác ngôn ngữ.|Giải thích rõ điều đã bao gồm và xin xác nhận|work
MY|Buổi kể chuyện đa văn hóa|Thư viện mời người dân kể về ngôn ngữ và ký ức trong khu phố.|Nghe nhiều góc nhìn, không gán tập quán cho mọi người|Nhóm làm việc nhiều ngôn ngữ|Hướng dẫn mới chưa có bản mọi người đều hiểu, dễ dẫn đến sai sót.|Viết lại bằng ngôn ngữ dễ hiểu và minh họa|work
PH|Buổi giới thiệu dệt thủ công|Một nhóm cộng đồng giới thiệu các mẫu dệt và người giữ nghề.|Tìm hiểu nguồn gốc trước khi dùng họa tiết|Cuộc gọi với người thân xa nhà|Bạn có người thân còn sống ở xa, lịch liên lạc thường bị lệch.|Hẹn giờ phù hợp và hỏi thăm việc thực tế|family
BD|Xưởng dệt jamdani|Một buổi giới thiệu jamdani giải thích công sức của người dệt.|Quan sát mẫu và hỏi về cách giữ nghề|Nhóm học chống lừa đảo số|Trung tâm cộng đồng hướng dẫn kiểm tra tin nhắn và thông tin tài khoản.|Thực hành nhận biết đường dẫn giả|study
PK|Buổi tìm hiểu nghệ thuật trang trí xe|Nhóm văn hóa giới thiệu các họa tiết và câu chuyện trên xe tải trang trí.|Vẽ mẫu trên giấy và hỏi về người làm nghề|Khóa kỹ năng điện tử|Bạn được giới thiệu khóa học sửa thiết bị, thông tin dụng cụ và an toàn còn thiếu.|Kiểm tra nội dung thực hành và điều kiện an toàn|study
NP|Buổi kể chuyện núi rừng|Thư viện giới thiệu đời sống vùng núi qua lời kể, ảnh và bản đồ.|Nghe câu chuyện của nhiều cộng đồng|Đi học khi đường khó đi|Tuyến đến lớp tạm khó đi do thời tiết, trường cho phép nhận bài từ xa.|Liên hệ giáo viên và chọn cách đi an toàn|school
LK|Xưởng giới thiệu mặt nạ|Nhà văn hóa giới thiệu nghề làm mặt nạ và các bối cảnh biểu diễn.|Quan sát, tìm hiểu ý nghĩa trước khi thử vẽ|Góc học ở thư viện|Bạn cần chỗ học yên tĩnh, thư viện đang tổ chức nhóm hỗ trợ người học.|Đặt lịch phù hợp và chia sẻ tài liệu hợp pháp|study
AU|Buổi tìm hiểu nghệ thuật bản địa|Trung tâm văn hóa có người được cộng đồng cho phép giới thiệu tác phẩm và bối cảnh.|Nghe hướng dẫn, tôn trọng quyền sử dụng hình ảnh|Lịch làm ngoài trời|Trong công việc ngoài trời, thông báo nắng nóng khiến lịch ban đầu không phù hợp.|Đề xuất nghỉ mát và điều chỉnh giờ theo cảnh báo|outdoor
NZ|Buổi nghe chuyện văn hóa Māori|Một hoạt động do người hướng dẫn giới thiệu tiếng nói và câu chuyện Māori.|Lắng nghe, hỏi quy tắc trước khi chụp ảnh|Dự án bảo vệ cảnh quan|Nhóm dân cư chuẩn bị dọn rác, khu vực làm việc cần chọn theo mức an toàn.|Nhận việc nhẹ phù hợp, không vào khu bị hạn chế|community
EG|Tìm hiểu nghề thủ công|Nhà văn hóa giới thiệu một số nghề thủ công Ai Cập qua mẫu và tư liệu.|Trao đổi với người hướng dẫn và ghi lại nguồn|Chỗ ở gần nơi học|Bạn đang chọn chỗ ở để học tiếp, giá thuê rẻ nhưng đường đi dài.|Tính cả tiền đi lại và thời gian trước khi chọn|housing
MA|Xưởng tìm hiểu zellige|Nhóm nghệ nhân giới thiệu cách phối hình của gạch khảm zellige.|Thử ghép mẫu bằng giấy|Đơn hàng thủ công mới|Một khách muốn dùng họa tiết truyền thống, nhưng chưa rõ nguồn và quyền sử dụng ảnh.|Trao đổi với người giữ nghề và làm rõ thỏa thuận|work
ZA|Buổi kể chuyện bằng nhiều tiếng|Thư viện có hoạt động đọc truyện bằng nhiều ngôn ngữ Nam Phi.|Chọn câu chuyện và nghe người khác diễn giải|Học kỹ năng phỏng vấn|Một nhóm cộng đồng giúp thực hành phỏng vấn, không hứa bảo đảm có việc.|Soạn hồ sơ trung thực và luyện tình huống|study
NG|Câu lạc bộ điện ảnh|Một nhóm giới thiệu cách kể chuyện trong điện ảnh Nigeria.|Xem trích đoạn được phép rồi thảo luận|Kinh doanh qua mạng|Bạn được giao trả lời khách trực tuyến, một đơn đòi chuyển tiền ngoài quy trình.|Xác minh danh tính và giữ thanh toán trong thỏa thuận|work
KE|Buổi giới thiệu văn học|Thư viện mời người dân đọc truyện của các tác giả Kenya.|Đọc một đoạn rồi trao đổi về góc nhìn|Giải chạy cộng đồng|Nhóm dân cư tổ chức đi bộ và chạy nhẹ, mỗi người tự chọn cự ly.|Chọn đi bộ theo sức khỏe, không chạy đua thành tích|community
ET|Tìm hiểu văn hóa cà phê|Một buổi giới thiệu văn hóa cà phê có cả lựa chọn chỉ nghe câu chuyện.|Hỏi về trình tự và chọn đồ uống phù hợp|Bài tập lưu ký ức|Giáo viên mời lớp tìm hiểu một nghề ở địa phương qua phỏng vấn tự nguyện.|Xin phép người kể và ghi đúng lời|school
GH|Xưởng tìm hiểu kente|Người hướng dẫn giới thiệu hoa văn kente và công sức người dệt.|Tìm hiểu ý nghĩa, không tự gán một mẫu cho mọi người|Khóa quản lý cửa hàng|Bạn cân nhắc học quản lý tồn kho, nhóm thực hành bằng số liệu mô phỏng.|So sánh đầu vào, hàng tồn và doanh thu|study
SA|Buổi tìm hiểu thư pháp Ả Rập|Một buổi sinh hoạt giới thiệu nghệ thuật chữ viết, không yêu cầu tham gia nghi lễ.|Tìm hiểu hình thức chữ và thử mẫu đơn giản|Dự án tiết kiệm nước|Tại nơi làm việc, nhóm đề xuất giảm lãng phí nước, chưa có số liệu trước sau.|Đo mức dùng rồi thử cải tiến nhỏ|work
AE|Câu chuyện nghề lặn ngọc trai|Nhà văn hóa giới thiệu lịch sử nghề lặn ngọc trai qua tư liệu.|Nghe câu chuyện và hỏi về điều kiện lao động xưa|Làm việc với nhóm quốc tế|Nhóm dùng nhiều múi giờ, lịch họp khiến vài người liên tục bị bất tiện.|Luân phiên giờ họp và gửi nội dung trước|work
KH|Buổi giới thiệu múa truyền thống|Nhà văn hóa giới thiệu động tác và trang phục sân khấu Khmer.|Nghe hướng dẫn, không tự nhận vai trò nghi lễ|Lớp kỹ năng du lịch|Bạn cân nhắc khóa học hỗ trợ khách, trung tâm chưa giải thích rõ bằng chứng nhận.|Hỏi học phí và giá trị chứng nhận trước khi học|study
LA|Buổi kể chuyện nghề dệt|Người hướng dẫn giới thiệu các mẫu dệt và câu chuyện người làm nghề.|Quan sát và hỏi xin phép trước khi chụp mẫu|Nhóm học gần nhà|Một nhóm cộng đồng chia sẻ tài liệu học, có người không có mạng ổn định.|Chuẩn bị bản giấy và chia lịch trao đổi|study
`.trim().split('\n');
ROWS.forEach(function(line){var x=line.split('|');if(!W.BY[x[0]])throw Error('Unknown world country '+x[0]);
 CASES.push({id:x[0]+'_culture',code:x[0],kind:'culture',min:12,max:100,title:x[1],text:x[2],care:x[3]});
 CASES.push({id:x[0]+'_life',code:x[0],kind:x[7],min:x[7]==='school'?8:x[7]==='family'?12:18,max:x[7]==='school'?17:100,title:x[4],text:x[5],care:x[6]});
});
var COMMON=[
 ['child',5,7,'Ngày đầu nhóm sinh hoạt','Nhóm sinh hoạt gần nhà có trò ghép hình, bạn chưa quen ai.','Xin người hướng dẫn giúp làm quen'],
 ['child',5,7,'Một câu chuyện bằng tranh','Thư viện tổ chức đọc truyện bằng tranh cho trẻ nhỏ.','Nghe kể và thử kể lại bằng lời của mình'],
 ['child',5,7,'Không muốn tham gia trò chơi','Một trò chơi khiến bạn không thoải mái, người hướng dẫn cho phép chọn khác.','Nói điều mình cần và chọn trò nhẹ hơn'],
 ['child',5,7,'Đồ chơi dùng chung','Bạn muốn giữ một món đồ nhưng người khác cũng đang chờ.','Thỏa thuận chơi lần lượt cùng người hướng dẫn'],
 ['child',5,7,'Nhận biết người hỗ trợ','Buổi sinh hoạt giới thiệu cách tìm người có trách nhiệm khi cần giúp.','Nhớ điểm hẹn và hỏi khi chưa hiểu'],
 ['child',5,7,'Buổi vẽ nơi mình sống','Bạn được mời vẽ điều quen thuộc quanh nhà, không có xếp hạng.','Vẽ theo điều mình nhớ, không cần giống người khác'],
 ['school',8,17,'Người bạn mới trong lớp','Một bạn vừa chuyển đến còn bối rối với lịch học.','Giải thích lịch và mời bạn cùng làm bài'],
 ['school',10,17,'Dự án tìm hiểu nơi sống','Lớp học cần một bản giới thiệu khu vực bằng thông tin có nguồn.','Phân biệt điều quan sát được và điều cần kiểm chứng'],
 ['school',8,17,'Bài kiểm tra chưa phản ánh đúng','Bạn làm sai một phần dù đã học, cần xem lại cách hiểu đề.','Nhờ giáo viên giải thích rồi tự làm lại'],
 ['study',18,65,'Học tiếp khi đã trưởng thành','Bạn tìm được khóa học nhưng thông tin học phí và lịch chưa đầy đủ.','Hỏi chi phí toàn khóa và chọn lịch vừa sức'],
 ['study',18,65,'Học bổng cần hồ sơ','Một quỹ công bố cơ hội học tập, bạn chưa biết mình đáp ứng yêu cầu không.','Kiểm tra điều kiện và nộp hồ sơ trung thực'],
 ['work',18,100,'Mức lương trong lời mời','Lời mời công việc chưa phân biệt lương cơ bản và khoản phụ thuộc kết quả.','Yêu cầu làm rõ điều kiện trước khi quyết định'],
 ['work',18,100,'Đồng nghiệp cần bàn giao','Một đồng nghiệp nghỉ ngắn hạn, bạn cần biết giới hạn việc được giao.','Chốt đầu việc, thời hạn và người hỗ trợ'],
 ['work',18,100,'Công cụ tự động hóa mới','Nhóm cân nhắc dùng công cụ mới, có nguy cơ đưa dữ liệu nhạy cảm lên mạng.','Thử dữ liệu giả và kiểm tra quyền truy cập'],
 ['housing',18,100,'Tiền cọc cần minh bạch','Bạn xem một nơi ở, người giới thiệu thúc chuyển cọc ngay.','Xác minh nơi ở và thỏa thuận trước khi chuyển tiền'],
 ['housing',18,100,'Chia sẻ không gian sống','Bạn cân nhắc ở chung để giảm chi phí, chưa thống nhất giờ nghỉ và việc nhà.','Thỏa thuận quy tắc trước khi nhận lời'],
 ['community',12,100,'Nhóm tình nguyện địa phương','Nhóm dân cư có việc hỗ trợ phù hợp nhiều mức thể lực.','Chọn nhiệm vụ vừa sức và xác nhận giờ tham gia'],
 ['community',12,100,'Tin đồn trong khu phố','Một thông tin chưa rõ nguồn đang được chia sẻ nhiều.','Kiểm chứng trước khi chuyển tiếp'],
 ['community',12,100,'Đồ cũ còn dùng được','Điểm trao đổi cộng đồng nhận đồ sạch còn hoạt động, không yêu cầu đóng góp tiền.','Chỉ chia sẻ món mình có quyền cho'],
 ['urban',18,100,'Đường đi thay đổi','Tuyến đi quen thuộc đang được sửa chữa, lịch sinh hoạt bị ảnh hưởng.','Xem tuyến dự phòng và báo người có hẹn'],
 ['rural',18,100,'Kết nối ngoài trung tâm','Buổi học từ xa cần mạng ổn định hơn nơi bạn đang ở.','Tải tài liệu được phép và xin lịch dự phòng'],
 ['partner',18,100,'Hai lịch nghỉ khác nhau','Bạn và người ấy có lịch rảnh không trùng nhau.','Cùng chọn khoảng thời gian phù hợp cả hai'],
 ['parent',18,100,'Con hỏi về văn hóa','Một người con còn nhỏ hỏi vì sao mỗi người có thói quen khác nhau.','Cùng tìm hiểu, không phán xét khác biệt'],
 ['elder',60,100,'Nhịp sống tuổi già','Nhóm cộng đồng giới thiệu sinh hoạt nhẹ và trò chuyện theo sở thích.','Chọn hoạt động hợp sức khỏe, không cố theo người khác'],
 ['elder',60,100,'Lưu lại câu chuyện đời mình','Thư viện mời người lớn tuổi tự nguyện ghi lại ký ức, có quyền giữ riêng.','Viết một đoạn và tự chọn người được đọc'],
 ['community',12,100,'Dữ liệu cá nhân cần giữ kín','Một biểu mẫu hoạt động xin thông tin không liên quan.','Hỏi mục đích và chỉ cung cấp phần cần thiết'],
 ['community',12,100,'Lối vào chưa thuận tiện','Hoạt động công cộng có lối vào khó tiếp cận với một số người.','Góp ý thêm lựa chọn tham gia thuận tiện'],
 ['family',12,100,'Giữ liên lạc với người thân','Một người thân còn sống muốn hẹn trò chuyện, lịch hai bên chưa hợp.','Hẹn thời gian vừa sức và nghe điều họ muốn nói'],
 ['culture',12,100,'Buổi trao đổi ẩm thực','Nhóm cộng đồng giới thiệu món ăn qua câu chuyện, ảnh và công thức.','Tìm hiểu nguyên liệu, không cần nếm món'],
 ['culture',12,100,'Tủ sách về nơi đang sống','Thư viện có tài liệu về nhiều cộng đồng tại nơi bạn sống.','Chọn một góc nhìn mới và ghi lại điều học được']
];
COMMON.forEach(function(x,i){CASES.push({id:'common_'+i,kind:x[0],min:x[1],max:x[2],title:x[3],text:x[4],care:x[5]});});
function current(l){return l.abroad&&l.abroad.code||l.country;}
function free(l){return l.alive&&!(l.jailUntil!=null&&l.age<l.jailUntil)&&!(l.flags.military&&l.age<l.flags.military)&&!(l.abroad&&l.abroad.trapped);}
function family(l){var f=l.fam;return !!(f&&((!f.noMom&&f.mAlive)||(!f.noDad&&f.fAlive))||(l.kids||[]).some(function(k){return k.alive!==false;})||(l.sibList||[]).some(function(s){return s.alive===true; }));}
function suitable(l,c){if(!free(l)||!W.BY[current(l)]||current(l)==='VN'||l.age<c.min||l.age>c.max||c.code&&c.code!==current(l))return false;
 if(c.kind==='school')return !!l.school;
 if(c.kind==='work'||c.kind==='outdoor'){var j=l.job&&E.jobDef(l);return !!j&&j.sec!=='crime'&&(c.kind!=='outdoor'||['worker','poor'].indexOf(j.cat)>=0);}
 if(c.kind==='partner')return !!l.partner&&l.partner.alive!==false&&l.partner.age>=18;
 if(c.kind==='parent')return(l.kids||[]).some(function(k){return k.alive!==false&&l.age-k.born>=4&&l.age-k.born<18;});
 if(c.kind==='family')return family(l);
 if(c.kind==='urban')return !!l.urban;
 if(c.kind==='rural')return !l.urban;
 return true;
}
function state(l){return l.flags.worldStories||(l.flags.worldStories={seen:{},count:0,serial:0});}
function pool(l){if(!free(l)||current(l)==='VN'||!W.BY[current(l)])return[];var s=state(l);if(s.at===l.age&&s.count>=2)return[];return CASES.filter(function(c){var a=s.seen[c.id];return suitable(l,c)&&(a==null||l.age-a>=8);});}
function key(l){return[current(l),l.cur,l.abroad&&l.abroad.since||'',l.movedTo||'',l.city||''].join('|');}
function subject(l,c){
 if(c.kind==='work'||c.kind==='outdoor')return[l.job&&l.job.id,l.job&&l.job.rank,l.job&&l.job.rankSince].join('|');
 if(c.kind==='school')return[l.school,l.schoolEnd].join('|');
 if(c.kind==='partner')return l.partner?[l.partner.heritageId||'',l.partner.name,l.partner.since,l.partner.age,l.partner.status].join('|'):'';
 if(c.kind==='parent')return(l.kids||[]).filter(function(k){return k.alive!==false&&l.age-k.born>=4&&l.age-k.born<18;}).map(function(k){return[k.parentId||'',k.name,k.born].join(':');}).join('|');
 return '';
}
function valid(l,d){if(!d||!d.caseId)return pool(l).length>0;var s=state(l);var c=get(d);return !!c&&d.subject===subject(l,c)&&d.at===l.age&&d.location===key(l)&&d.token===s.serial&&!s.usedToken&&pool(l).some(function(c){return c.id===d.caseId;});}
function get(d){return CASES.filter(function(c){return c.id===d.caseId;})[0];}
function cost(l){return Math.max(0,l.base||0)*.015;}
function finish(l,r,log,d,k){if(!valid(l,d))return;var s=state(l),c=get(d);if(k==='learn'&&(l.age<18||l.money<cost(l)))return;
 if(s.at!==l.age){s.at=l.age;s.count=0;}s.count++;s.seen[c.id]=l.age;s.usedToken=true;
 var where=W.BY[current(l)].name;
 if(k==='care'){H.fx(l,{kno:1,soc:1,hap:1});
 if(c.kind==='work'||c.kind==='outdoor')l.job.rep=U.clamp((l.job.rep==null?50:l.job.rep)+2,0,100);
 if(c.kind==='partner')l.partner.close=U.clamp((l.partner.close||50)+2,0,100);
 if(c.kind==='parent'){var child=l.kids.filter(function(x){return x.alive!==false&&l.age-x.born>=4&&l.age-x.born<18;})[0];child.close=U.clamp((child.close||50)+2,0,100);}
 log(where+' · '+c.title+': '+c.care+'. Bạn dành thời gian thực hiện, hiểu rõ hơn hoàn cảnh và giữ được cuộc trao đổi tôn trọng.','good');}
 else if(k==='learn'){var amount=cost(l);H.cash(l,-amount,'Tự chi buổi tìm hiểu: '+c.title);H.fx(l,{kno:2,hap:1});log(where+' · '+c.title+': bạn tự trả '+H.mb(l,amount)+' từ tiền riêng cho một buổi tìm hiểu có hướng dẫn. Đây là chi phí mô phỏng, không phải học phí thị trường hay bằng cấp.','neutral');}
 else if(k==='rush'){H.fx(l,{soc:-2});if(l.mind)l.mind.stress=U.clamp(l.mind.stress+2,0,100);if(c.kind==='work'&&l.job)l.job.rep=U.clamp((l.job.rep==null?50:l.job.rep)-3,0,100);log(where+' · '+c.title+': quyết định vội khi chưa kiểm tra khiến bạn phải giải thích và làm lại, chưa có thay đổi hợp đồng hay chuyển tiền.','bad');}
 else if(k==='rest'){H.fx(l,{hap:1});if(l.mind)l.mind.stress=U.clamp(l.mind.stress-2,0,100);log(where+' · '+c.title+': '+U.pick(H.rf(l),['bạn chọn nghỉ và giữ lịch riêng, không phát sinh phí.','bạn để dịp khác, dành thời gian nghỉ ngơi.','bạn xin phép vắng lần này, ở nhà thư giãn.'])+'','neutral');}
 else log(where+' · '+c.title+': '+U.pick(H.rf(l),['bạn chưa tham gia, không phát sinh phí hoặc thay đổi hoàn cảnh.','bạn cảm ơn lời mời nhưng chưa tham gia lần này.','bạn để dành dịp khác, chưa tham gia.']),'neutral');
}
E.SC('world_doi_song',{title:function(l,d){var c=get(d);return c?c.title:'Chuyện nơi đang sống';},valid:valid,
 prep:function(l,r,arg){var p=pool(l);if(arg&&arg.group)p=p.filter(function(c){return GROUPS[arg.group]&&GROUPS[arg.group].indexOf(c.kind)>=0;});if(!p.length)return{};var local=p.filter(function(c){return c.code;});var c=U.pick(r,local.length&&r()<.65?local:p);var s=state(l);s.serial++;s.usedToken=false;return{caseId:c.id,at:l.age,location:key(l),subject:subject(l,c),token:s.serial};},
 text:function(l,d){var c=get(d);return c?W.BY[current(l)].name+' · '+c.text:'';},opts:[
 {k:'care',l:function(l,d){var c=get(d);return c?c.care+' · không phát sinh phí':'Tìm hiểu miễn phí';},run:function(l,r,log,d){finish(l,r,log,d,'care');}},
 {k:'learn',l:function(l){return'Dành một buổi tìm hiểu có hướng dẫn · tự trả '+H.mb(l,cost(l));},req:function(l){return l.age>=18&&l.money>=cost(l);},run:function(l,r,log,d){finish(l,r,log,d,'learn');}},
 {k:'rush',l:'Quyết định vội, bỏ qua việc kiểm tra · có thể mất uy tín',req:function(l,d){var c=get(d);return c&&['work','school','housing'].indexOf(c.kind)>=0;},ai:{w:.1},run:function(l,r,log,d){finish(l,r,log,d,'rush');}},
 {k:'rest',l:'Giữ thời gian nghỉ ngơi · miễn phí',run:function(l,r,log,d){finish(l,r,log,d,'rest');}},
 {k:'no',l:'Để dịp khác · không chi tiền',run:function(l,r,log,d){finish(l,r,log,d,'no');}}
]});
var GROUPS={culture:['culture'],learn:['school','study','child'],work:['work','outdoor'],people:['family','parent','partner','elder'],local:['community','urban','rural','housing']};
E.SC('world_chu_de',{title:'Cuộc sống nơi đang sống',valid:function(l){return pool(l).length>0;},text:function(l){var code=current(l),count=CASES.filter(function(c){return c.code===code;}).length;return W.BY[code].name+' · Chọn một chủ đề đang phù hợp hoàn cảnh. Có '+count+' tình huống riêng cho quốc gia này và '+COMMON.length+' tình huống chung được lọc theo tuổi, học tập, công việc, nơi ở, người thân. Mỗi năm tối đa hai chuyện; cùng một chuyện chỉ trở lại sau ít nhất tám năm. Các khoản chi và xác suất chọn sự kiện là cân bằng mô phỏng.';},opts:Object.keys(GROUPS).map(function(k,i){return{k:k,l:['Văn hóa và nghệ thuật','Tuổi thơ / học tập','Công việc','Người thân / tình yêu / tuổi già','Nhà ở / sinh hoạt cộng đồng'][i],req:function(l){return pool(l).some(function(c){return GROUPS[k].indexOf(c.kind)>=0;});},run:function(l,r){if(pool(l).some(function(c){return GROUPS[k].indexOf(c.kind)>=0;}))l.pending.unshift(E.DEC.world_doi_song.make(l,r,{group:k}));}};}).concat([{k:'no',l:'Đóng lại',run:function(){}}])});
var D=E.DEC.world_doi_song,apply=D.apply;D.apply=function(l,d){if(!valid(l,d.data))return;return apply.apply(this,arguments);};
E.ACT.push({id:'world_doi_song',g:'Gia đình & bạn bè',l:'Chuyện đời sống / văn hóa nơi đang sống',min:5,sc:'world_chu_de',avail:function(l){return pool(l).length?true:'Chưa có chuyện mới phù hợp nơi sống hoặc đã đủ hai chuyện năm nay';},ai:{w:.35}});
E.TRIG.push({id:'world_doi_song',when:function(l){return pool(l).length>0;},p:.7,cd:1,rep:true});
E.WORLD_STORIES={cases:CASES,pool:pool,valid:valid,current:current,cost:cost,suitable:suitable,groups:GROUPS};
})(G);
