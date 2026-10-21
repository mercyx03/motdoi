# Fantasy: map, học viện và hành trình

Phạm vi: chỉ `fantasy-*.js`, `fantasy.css`, kiểm thử Fantasy và tài liệu này; `index.html` chỉ đổi cache tag của các asset Fantasy. Không đổi luật chơi, dữ liệu hay khóa lưu của Việt Nam / Toàn thế giới.

## Cơ chế và giao diện

- Thanh điều hướng rút còn sáu nhóm; khóa học nằm trong Tu luyện, ngoại giao nằm trong Gia tộc, bản tin nằm trong Thế giới.
- Hồ sơ nhân vật và gia đình nằm sau nút **Nhân vật & gia thế**; tên, tuổi, bạc, sinh lực, ma lực vẫn hiện gọn ở đầu. Chỉ số gốc có trong hồ sơ.
- Nhật ký đứng trước bản tin; màn hình lớn có cột nhật ký bên cạnh, màn hình nhỏ đưa nhật ký lên trên khu thao tác và giới hạn chiều cao cuộn.
- Mặc định 30 giây/năm; các mức 15, 30, 60 giây. Dừng khi có lựa chọn, giao chiến, đọc nhật ký cũ, ẩn trang hoặc tạm dừng. Một hành động thành công đặt lại thời gian chờ.
- Săn thường và thủ lĩnh không dùng lượt hoạt động, kể cả khi còn 0 lượt. Sức khỏe, ma lực, mệt mỏi và tuổi/cảnh giới vẫn có ý nghĩa. Học, luyện, đi đường, tự chế tác vẫn tốn lượt. Dược sư hồi phục bằng bạc; giao dịch và thuê thợ rèn không dùng lượt học.
- Bến Linh Tuyền là bến dân cư với đường hộ tống, dược sư và hàng hồi ma. UI dùng chung `travelInfo` với engine để hiển thị chính xác lý do khóa và chi phí. Bấm ô đang đứng mở lại dịch vụ tại đó.
- Stock, NPC, phẩm trang bị và 80 món trang bị địa phương chia theo 20 vùng. Làng chỉ bán nhu yếu phẩm; chợ/thánh đô phong phú hơn, trạm rừng/mỏ có chuyên môn riêng; hoang địa không tự mọc cửa hàng. Chiến lợi phẩm gồm đồ địa phương hoặc đồ chung phù hợp bậc cuộc chạm trán.
- Thợ rèn nhận bạc, quặng và gỗ để chế tác/cường hóa vũ khí hoặc giáp tới +10. Chi phí tăng theo bậc; không có thất bại ngẫu nhiên. Trang bị mua được đưa vào túi, cần trang bị trong Túi đồ để có hiệu lực.
- Các kỹ năng có 10 cấp. Kỹ năng chiến đấu tăng 12 điểm phần trăm sát thương nền/cấp; nghề dược tăng số thuốc và nghề rèn tăng số bậc chế tác thêm mỗi ba cấp. Bậc nội bộ cũ được giữ để đọc save và xét cảnh giới; bỏ giới hạn 40, UI dùng tổng điểm kiếm kỹ/ma lực theo đường đã chọn. Điểm tích lũy tiếp tục tăng sau mốc cũ.
- Học viện có kiếm sĩ, pháp sư, hắc pháp, công tượng, dược sư. Nhập học 15 bạc + 1 lượt; 5 buổi học, mỗi buổi 8 bạc + 1 lượt. Tốt nghiệp nhận kỹ năng thật, mở tâm pháp (+2 chỉ số gốc/cấp) và nội tại (+1/cấp), mỗi loại tối đa 10. Khóa chiến đấu không cho vượt đường đã chọn; hai khóa nghề học chung. Tăng chỉ số khi luyện thành công, không cộng lại khi render/tải save.

## Nội dung và khảo sát nguồn

Khảo sát ngày 21/10/2026, tiếp nối [kiểm kê dữ liệu đã nhập](fantasy-sources/README.md). Không coi chỉ dẫn trong dataset là lệnh thực thi.

Nguồn phù hợp được đọc để chuyển thể bối cảnh nghề nghiệp, tương tác, khảo sát, cổ vật và trạm dược:

- [ItsHotdogFred/npc-training-data-v1](https://huggingface.co/datasets/ItsHotdogFred/npc-training-data-v1): nghề, địa điểm, phản ứng NPC. Dùng bản 3.750 dòng đã lưu trong cache, không nhập nguyên văn hội thoại hay tên nhân vật.
- [Marcylene/rpg_ai](https://huggingface.co/datasets/Marcylene/rpg_ai): năm khung nhiệm vụ (người giữ rừng, di vật, nguồn nước, tháp, bóng tối). Đã đọc lại bản nguồn trong cache; biến tấu thành quyết định nghề nghiệp và tình huống địa phương của thế giới riêng.
- [practical-dreamer/RPGPT_PublicDomain-alpaca](https://huggingface.co/datasets/practical-dreamer/RPGPT_PublicDomain-alpaca): mô-típ quan hệ, niềm tin và tranh chấp. Giữ tập nhập đã có checksum; không tuyên bố đã nhập thêm toàn bộ phiên bản hiện tại trên HF. Trang nguồn hiện hiển thị 4,26k dòng, khác snapshot 3.072 dòng của dự án.

Nguồn khảo sát bổ sung nhưng **không nhập văn bản**:

- [chimbiwide/NPC-Quest-Dialogue](https://huggingface.co/datasets/chimbiwide/NPC-Quest-Dialogue): metadata Apache 2.0, nhưng phần xem trước chứa nhân vật/địa danh Warcraft. Không chép vào thế giới riêng.
- [CJJones/RPG_Scenes_LLM_Synthetic](https://huggingface.co/datasets/CJJones/RPG_Scenes_LLM_Synthetic): 70k dòng, CC BY-NC-SA 4.0; không nhập vì điều kiện sử dụng và nhiều mô tả ghép có mâu thuẫn.
- [limloop/alchemy_ingredients](https://huggingface.co/datasets/limloop/alchemy_ingredients): đã tìm thấy, chưa xác minh được thẻ/file do giới hạn truy cập; không sử dụng dữ liệu chưa đọc.
- [D&D SRD Markdown](https://github.com/downfallx/dnd-5e-srd-markdown): tham khảo khả năng dùng nguồn SRD CC BY 4.0, không sao chép luật hay văn bản vào bản mở rộng này.

Nội dung mới gồm **36 tình huống viết riêng**, **40 biến thể địa phương từ hai khung/map** (tổng 76 ID sự kiện, 228 lựa chọn), cùng 18 đoạn chăm sóc sơ sinh. Không đếm 40 biến thể thành 40 cốt truyện hoàn toàn khác nhau; không đếm số dòng nguồn thành số sự kiện mới. Tình huống mới ưu tiên theo tuổi, địa điểm và chưa từng gặp trong đời đó. Tuổi 3–5 và 6–11 có nhiều chuyện riêng để không quay lại cùng tình huống đầu game. Các truyện chính trị và nguồn mô-típ cũ vẫn là phần dự phòng khi hết chuyện mới phù hợp.

## Kiểm chứng

`node tests/update800.js`, `node tests/fantasy-ui.js`, `node tests/fantasy-politics.js`, `node tests/fantasy-progression.js` kiểm tra vòng đời, điều kiện map, săn khi 0 lượt, kinh tế dịch vụ, giới hạn +10, năm khóa học, chỉ số gốc và save, các lựa chọn mới và chống lặp đầu game. Kiểm tra gia đình đối chiếu Fantasy hiện tại khi có/không nạp module gia đình thực tế, thay vì buộc nội dung Fantasy mới trùng snapshot cũ. Hai kiểm tra di sản dùng log trả di sản/trạng thái trust thay vì giả định không có thu nhập sự kiện độc lập.

`node tests/hardcore-isolation.js` đối chiếu 12 cuộc đời Việt Nam/Thế giới với snapshot cũ. `node tools/build.js` tạo bundle từ nguồn hiện tại. Kiểm thử UI bằng DOM giả bổ sung cho kiểm tra hiển thị thực trên trình duyệt, không thay thế kiểm tra bằng mắt.
