'use strict';
const fs=require('fs'),path=require('path');
const copy=new Map(fs.readFileSync(path.join(__dirname,'../docs/update-copy.tsv'),'utf8').trim().split(/\r?\n/).map(line=>{
 const [id,title,...details]=line.split('\t');return [id,{title,details}];
}));
// Keep the full engineering history in CHANGELOG; publish player-facing changes.
const rewrites = [
 ['Thêm năm nguồn Aurelia', 'Bổ sung chất liệu cho các câu chuyện Fantasy và những biến cố giữa các gia tộc.'],
 ['Nhập đủ 3.280 bản ghi', 'Bổ sung linh thú, tương tác với nhân vật, mô tả địa hình và nhiệm vụ được chuyển thể sang tiếng Việt.'],
 ['Thêm Fantasy gia tộc ở cạnh', 'Thêm Fantasy gia tộc cạnh Việt Nam / Toàn thế giới, với bản lưu riêng, xuất thân, cha mẹ, hôn nhân, con cái và truyền đời từ sơ sinh.'],
 ['Nhà giàu không bị biến thành thiếu thốn', 'Sửa tình huống nhà giàu bỗng thiếu thốn sau vài lựa chọn; bỏ lời giải thích lặp lại trong hồ sơ, gợi ý và nhật ký. Bản lưu cũ được cập nhật lời kể, giữ nguyên chi phí đã chọn.'],
 ['Hai hành động mới chỉ do người chơi chọn', 'Hai hành động luyện tập mới chỉ được thực hiện khi người chơi chủ động chọn.'],
 ['Gia cố danh sách anh chị em khi tiếp đời', 'Sửa danh sách anh chị em khi tiếp đời: giữ đúng tên, giới tính và thứ tự sinh, kể cả gia đình định cư ở Nhật và nhân vật là con một.'],
 ['Ứng dụng hẹn hò đúng với từng nước.', 'Ứng dụng hẹn hò thay đổi theo nước nhân vật đang sống, thay vì dùng chung danh sách của Việt Nam.'],
 ['Máy chủ hỗ trợ lọc theo sao', 'Có thể lọc đánh giá theo số sao và tải thêm các đánh giá trước.'],
 ['Trường chuyên: sửa nhật ký', 'Trường chuyên: nhật ký ghi đúng tỉnh hoặc thành phố nơi nhân vật sống.'],
 ['Di chúc: các lựa chọn không còn', 'Di chúc: sửa phần gợi ý trống trong các lựa chọn.'],
 ['Trang đánh giá dùng logo SVG', 'Trang đánh giá đồng bộ logo, kiểu chữ và thanh điều hướng với trang chủ; thêm nút Trang chủ và Chơi ngay.'],
 ['Thêm trang reviews.html', 'Thêm trang đánh giá với lựa chọn 1–5 sao, điểm trung bình, phân bố sao và danh sách đánh giá mới nhất.'],
 ['Giữ bản nháp khi mạng/dịch vụ lỗi', 'Giữ bản nháp khi mạng lỗi, chỉ xóa sau khi gửi thành công; hạn chế gửi trùng khi đang chờ phản hồi.'],
 ['Tên địa danh / phim có nguồn;', 'Thêm địa danh và phim có thật; giá các gói và quà tặng được ước tính cho trò chơi.'],
 ['Tên trường / ngành đối chiếu', 'Tên trường và ngành học dựa trên thông tin thực tế; thu nhập và kết quả tác phẩm được mô phỏng trong game.'],
 ['Lưu RNG riêng cho thị trường:', 'Tải lại giữ nguyên giá thị trường trong năm, tránh việc làm mới để mua bán kiếm chênh lệch.'],
 ['Cloudflare Pages _worker.js lấy nguồn', 'Bảng giá vàng, chứng khoán và ngoại tệ có thời điểm cập nhật; khi nguồn giá gián đoạn, giữ giá gần nhất và hiển thị thời gian.'],
 ['Ngoại hình vẫn cố định theo danh tính', 'Ngoại hình nhân vật giữ ổn định theo danh tính trong suốt quá trình chơi.'],
 ['Biến thể cố định theo nhân vật', 'Diện mạo xuất phát điểm cố định theo nhân vật, không thay đổi khi mở lại và không tự làm đổi hoàn cảnh gia đình.'],
 ['Bỏ giá 2,5 triệu áp chung.', 'Giá vật phẩm thay đổi theo từng trò chơi; Minecraft và Roblox có lựa chọn diện mạo miễn phí. Các mức giá chưa xác minh được ghi là ước tính.'],
 ['Danh tính hình ảnh cố định theo tên', 'Diện mạo cố định theo tên và ngày sinh. Cảnh gia đình chỉ hiện người còn sống, đang ở cùng; khung cảnh phù hợp với nơi nhân vật sinh sống.'],
 ['Running Man / 2 Ngày 1 Đêm chuyển', 'Running Man / 2 Ngày 1 Đêm có chuỗi mùa quay trong cùng năm: 3 chuyến, mỗi chuyến 5 lượt lựa chọn. Địa điểm, nhiệm vụ, khách mời và đội chơi được chọn ngẫu nhiên.'],
 ['Mỗi đội có 4 người, luôn có người chơi', 'Mỗi đội có 4 người, luôn có người chơi và không trùng thành viên. Khách mời thay đổi theo thời gian; lưu rồi chơi tiếp vẫn giữ đúng đội đã chọn.']
];
const technical = /(?:\b(?:tests?|tools?|docs?|public|dist)\/|\.(?:js|json|py|md|csv|toml|sql|parquet)\b|\b(?:npm|node|python|RNG|API|HTML|CSS|JSON|SVG|D1|REVIEWS_DB|Worker|Cloudflare|FormSubmit|GitHub|checksum|revision|localStorage|AbortSignal|undefined)\b|kiểm thử|hồi quy|bộ test|bộ kiểm tra|bản đối chiếu|bộ dò lỗi|công cụ quản trị|công cụ mới|đã render|khóa cache|cache key|Hugging Face|Nemotron-Personas)/i;
function playerLine(value) {
 let text=value.trim();
 const rewrite=rewrites.find(([prefix])=>text.startsWith(prefix));
 if(rewrite)return rewrite[1];
 text=text.replace(/ Có xuất bản lưu JSON và bách khoa linh thú có tìm kiếm \/ phân trang\./,' Có thể xuất bản lưu và tìm kiếm trong bách khoa linh thú.')
  .replace(/SVG minh họa 2D/g,'hình minh họa 2D');
 return technical.test(text)?null:text;
}
function playerEntry(entry) {
 if(entry.private)return null;
 const edited=copy.get(entry.id);
 if(edited)return {...entry,title:edited.title,summary:edited.details[0],details:edited.details};
 const details=entry.details.map(playerLine).filter(Boolean);
 if(!details.length)return null;
 const titles={
  'git-119bce2a2116':'Tài khoản, lưu tiến trình và xuất thân theo từng tỉnh',
  'git-cf06f858b276':'Hoàn thiện mô phỏng cuộc sống Việt Nam và thêm thành tựu',
  'git-e4842dfb3efd':'Sửa số lượt đánh giá, mở rộng con người, văn hóa và lịch sử Việt Nam'
 };
 const title=titles[entry.id]||entry.title.replace(/^\+\s*[—–-]\s*/, '');
 return {...entry,title,summary:playerLine(entry.summary)||details[0],details};
}
module.exports={playerLine,playerEntry,technical};
