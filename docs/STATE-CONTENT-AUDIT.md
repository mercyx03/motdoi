# Rà soát nội dung liên quan cơ quan nhà nước

Ngày rà soát: 23/10/2026. Đây là rà soát nội dung và cơ chế mô phỏng, không phải kết luận pháp lý về bôi nhọ hay xuyên tạc.

## Phạm vi và phương pháp

- Đọc danh sách kịch bản được nạp từ public/index.html và rà nội dung nghề nghiệp, lựa chọn, lời kể, kết quả và các nhánh bổ sung.
- Tìm những nhóm từ liên quan chính quyền, chính trị, nhà nước, quân đội, công an, hối lộ, chạy chức, can thiệp và tố tụng.
- Nạp toàn bộ mô-đun hiện tại theo đúng thứ tự, tạo nhân vật thử riêng trong bộ nhớ và xác nhận bốn lựa chọn đáng chú ý còn xuất hiện, có thể thực hiện. Không dùng bản lưu của người chơi, không sửa cơ sở dữ liệu.
- Phân biệt nội dung gắn nghề của nhân vật người chơi, lời của NPC, tình huống ngoại quốc và tên người thật. Bình luận do người chơi đăng trong database không nằm trong phạm vi lần rà này.
- Chưa sửa hay xóa tình huống trong lượt rà soát này.

## Kết luận

Có nội dung tiêu cực liên quan cá nhân làm việc trong cơ quan nhà nước: nhận hối lộ, chạy chức, can thiệp xử lý vi phạm, nhận tiền bảo kê, nghi vấn ép cung và sai phạm tố tụng. Không nên nói game hoàn toàn không có nội dung nhạy cảm thuộc nhóm này.

Trong những nhánh đã kiểm tra, chưa thấy tình huống tiêu cực nêu đích danh một lãnh đạo có thật cụ thể; phần lớn áp dụng cho nghề hoặc nhân vật do người chơi điều khiển. Tuy nhiên, việc dùng chức danh và cơ quan có thật cùng các kết quả được kể như sự thật có thể tạo cách hiểu ngoài ý định hư cấu.

## Các phát hiện ưu tiên

| Ưu tiên | Tình huống và vị trí | Nội dung đang có | Đánh giá và hướng xử lý |
|---|---|---|---|
| Cao | csgt — public/js/scenarios.js:458–463 | Chọn đưa phong bì: có nhánh 40% trả một phần tiền rồi được cho đi; lời kể mang sắc thái trung tính. | Đã xác nhận trên mô-đun đang chạy. Dễ khiến người chơi hiểu đưa tiền ngoài quy định là một cách giải quyết thông thường. Nên bỏ nhánh đạt mục đích; giữ chấp hành, giải trình hoặc khiếu nại phù hợp. |
| Cao | vc_bo_nhiem — public/js/jobs2.js:291–294 | Lời rỉ tai phải chạy mới chắc; chọn chạy chức có 70% thử thăng chức khi đủ điều kiện, hậu quả có thể đến sau. | Đã xác nhận nhân vật từ bậc 2 lên 3 ngay sau lựa chọn. Có lựa chọn thi tuyển công khai và xử lý sai phạm, nhưng phần thưởng tức thời vẫn gợi chuyện mua chức có hiệu quả. Ưu tiên thay bằng hồ sơ, thi tuyển, thẩm định và kết quả minh bạch. |
| Cao | dtv_hoi_cung — public/js/jobs.js:274–282 | Cấp trên giục có lời khai; người chơi có thể gây sức ép, có nhánh vụ án được chuyển đi dù lời khai chưa chắc đúng. | Đã xác nhận lựa chọn còn xuất hiện. Cần tránh kể việc có lời khai như hoàn tất được vụ việc; tách nghi vấn và xác minh, không coi bức cung là phương án nghiệp vụ. |
| Cao | ca_bao_ke_quan_bar — public/js/jobs2.js:312–315 | Cán bộ công an được đề nghị làm cố vấn, nhận phong bì định kỳ; người chơi nhận tiền và có thể bị điều tra sau. | Đã xác nhận tiền tăng khi chọn nhận. Đây là hành vi của nhân vật hư cấu, không phải mô tả toàn lực lượng; dù vậy, liên hệ chức danh thật với thu nhập bảo kê cần cân nhắc loại bỏ hoặc viết thành phát hiện, từ chối và trình báo. |
| Cần rà lại | ca_chuyen_an, tp_chay_an — public/js/jobs.js:189–192, 237–254 | Lựa chọn nhận tiền cho qua, nhận tiền nương tay trong xét xử. | Có đánh dấu lựa chọn sai và có hậu quả, nhưng vẫn thưởng tiền trước. Cùng vấn đề bình thường hóa lối tắt; nên sửa đồng bộ với nhóm trên. |
| Cần rà lại | ks_oan_sai — public/js/jobs.js:255–263 | Lời kể rằng cơ quan điều tra muốn truy tố cho kịp tiến độ, lựa chọn ký cáo trạng cho kịp chỉ tiêu. | Cách nói khẳng định, bao quát về cơ quan và chỉ tiêu dễ tạo quy kết. Nên giới hạn vào một hồ sơ có dấu hiệu cần kiểm tra, không gán động cơ khi chưa xác minh. |
| Cần rà lại | xa_ho_ngheo, hq_hang_lau_quen, ca_nguoi_nha_vi_pham — public/js/jobs2.js:261–270, 303–305 | Ưu ái người nhà lãnh đạo, nhờ can thiệp, gọi điện nói khéo. | Có phương án đúng quy định. Cần giữ rõ là đề nghị hay nghi vấn từ một cá nhân, không mặc định đặc quyền tồn tại hoặc tác động thành công. |
| Cần rà lại | public_scandal101 — public/js/life101.js:86–100 | Scandal về hợp đồng người nhà, quà tặng, phát biểu và tin nhắn cũng áp dụng cho các nghề chính trị/hành chính. | Nội dung có nhấn mạnh chưa có kết luận, nhưng được phát sinh ngẫu nhiên cho người chơi làm lãnh đạo. Cần tránh để tần suất và tiêu đề gây cảm giác cứ giữ chức là gắn với bê bối; tách tin chưa kiểm chứng và hành vi đã xác minh. |
| Cần làm rõ mô phỏng | tg_dac_xa — public/js/life43.js:344–345; các tuyến chức danh life101, life115, life116 | Lời kể và điều kiện đơn giản hóa về đặc xá, thăng cấp, bổ nhiệm, bầu chọn. | Không phải nội dung bôi nhọ tự thân. Tuy nhiên không nên trình bày tỷ lệ, mốc thời gian hay một lần bấm của game như quy định thật. Muốn đối chiếu pháp luật hiện hành cần một lượt tra cứu riêng bằng nguồn chính thức. |

## Những chỗ không nên đánh đồng

- Cứu hộ, bảo vệ người dân, chống gian lận, thi tuyển công khai, từ chối quà và xử lý sai phạm là mô phỏng công vụ thông thường, không phải bôi nhọ chỉ vì có tên cơ quan nhà nước.
- Nhánh đình công/tuần hành qg_dinh_cong trong life72 giới hạn theo dữ liệu các nước ngoài Việt Nam. Không nên kết luận đây là tình huống mô tả Việt Nam chỉ dựa trên từ khóa biểu tình.
- Tên TP. Hồ Chí Minh, tên trường hoặc địa danh xuất hiện trong dữ liệu không phải một cáo buộc với một người thật.
- Có hậu quả đạo đức, kỷ luật và điều tra giúp phân biệt lựa chọn sai, nhưng không tự khắc phục cách viết khái quát hoặc cơ chế thưởng cho sai phạm.

## Khuyến nghị

1. Ưu tiên gỡ kết quả đạt mục đích do đưa phong bì, chạy chức và gây sức ép lấy lời khai.
2. Đổi các lời kể khẳng định về tổ chức thành sự việc cụ thể cần xác minh; không gán tội hoặc động cơ khi chưa có căn cứ trong câu chuyện.
3. Giữ cơ chế công vụ và tiến thân theo năng lực, thẩm định, trách nhiệm, phục vụ người dân; không gắn bê bối với chức danh như một thuộc tính mặc định.
4. Nếu giữ nhánh sai phạm, dùng nhân vật hư cấu và trách nhiệm cá nhân rõ ràng, không gắn nhân vật công chúng có thật vào câu chuyện giả định.
5. Rà riêng các câu nói như quy định pháp luật thật trước khi phát hành nếu muốn cam kết tính chính xác thực tế.
