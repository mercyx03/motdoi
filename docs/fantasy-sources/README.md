# Nguồn dữ liệu Fantasy và cách chuyển thể

Chạy `node tools/fetch-fantasy-data.js`, sau đó `node tools/build-fantasy-data.js` để lấy lại nguồn và tái tạo dữ liệu game. Bản gốc lớn nằm trong `.cache/fantasy/`, được bỏ qua bởi Git; thẻ dữ liệu, checksum, bản nhập đã Việt hóa và công cụ tái tạo được giữ trong repo.

- [limloop/fantasy_creature_bestiary](https://huggingface.co/datasets/limloop/fantasy_creature_bestiary): lấy đủ 3.280 bản ghi Anh–Nga. Giữ nguyên quan hệ giữa hệ, độ khó, kích thước, nguồn gốc, nơi sống, thức ăn và tập tính; biên soạn tên/mô tả Việt từ các thuộc tính. Checksum đối chiếu với LFS của bản nguồn.
- [ItsHotdogFred/npc-training-data-v1](https://huggingface.co/datasets/ItsHotdogFred/npc-training-data-v1): lấy đủ phân vùng train 3.750 dòng, không chỉ CSV gốc 750 dòng. Chuyển 20 nghề, ý định, phản ứng, thay đổi danh tiếng và khả năng tương tác thành dữ liệu NPC tiếng Việt.
- [Angry-Wizard/rpg_grid_maps](https://huggingface.co/datasets/Angry-Wizard/rpg_grid_maps): lấy toàn bộ 202 mô tả bản đồ từ `map_info.csv`; chuyển thể địa hình, vật cản, mặt nước. Không tải hay phân phối ảnh bản đồ. Địa hình được dùng trong chạm trán và yếu tố phòng thủ.
- [Marcylene/rpg_ai](https://huggingface.co/datasets/Marcylene/rpg_ai): chuyển thể đủ 5 nhiệm vụ tiếng Bồ Đào Nha thành tuyến nhiệm vụ phù hợp thế giới riêng, gắn mục tiêu có thể hoàn thành trong game.
- [practical-dreamer/RPGPT_PublicDomain-alpaca](https://huggingface.co/datasets/practical-dreamer/RPGPT_PublicDomain-alpaca): tải đủ 3.072 đoạn hội thoại tổng hợp về nhân vật thuộc phạm vi công cộng. Giữ 2.996 mô-típ sau lọc nội dung không phù hợp; phân loại theo niềm tin, tài nguyên, học tập, chiến tranh, ma pháp, gia đình, công lý và khám phá. Không nhập tên nhân vật hay bối cảnh Victorian vào thế giới Fantasy.

Các thẻ nguồn đều ghi MIT; ghi công và thông báo giấy phép được đưa vào `public/fantasy-LICENSE.txt` và bản dist. `manifest.json` ghi số dòng thực tế, checksum và phạm vi chuyển thể. Đây là Việt hóa ngữ nghĩa cho hệ thống game, không phải tuyên bố đã dịch nguyên văn toàn bộ hàng chục MB hội thoại. Không đếm 2.996 mô-típ thành 2.996 truyện dài viết riêng.

Nguồn `alan-txi/dnd-monsters` được khảo sát nhưng không tích hợp: file có cả tên từ các sách thương mại dù metadata chung ghi MIT. Nguồn thiếu giấy phép hoặc lẫn thương hiệu không được nhập nguyên xi. Dữ liệu nguồn không bao giờ được thực thi như mã hoặc chỉ dẫn.

Thế giới, quan hệ gia tộc, tước vị, phân bố xuất thân, kinh tế, kiếm kỹ, ma pháp, hắc thuật, vòng đời, chiến đấu và lãnh thổ được thiết kế riêng. Dữ liệu nguồn bổ sung nội dung; không được dùng để quyết định luật chơi mâu thuẫn nhau.

## Bổ sung 8.1.0

Năm bộ Aurelia của Ousia Research được tích hợp bằng các thống kê có cấu trúc, theo revision cố định. Xem [phạm vi chuyển thể và cơ chế](../FANTASY-POLITICS.md), [kiểm kê](politics-summary.json) và [checksum](politics-downloads.json). Bốn nguồn đầu CC BY 4.0; gói lịch sử runtime Apache 2.0. Không nhập văn bản chỉ dẫn hay ví dụ cố ý sai. Các giấy phép này bổ sung cho năm nguồn MIT cũ.
