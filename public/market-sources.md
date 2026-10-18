# Vàng và cổ phiếu — bản 4.8.1

## Nguồn và đơn vị

- Vang.today: https://www.vang.today/en/api ; https://www.vang.today/api/prices . SJL1L10 (vàng miếng SJC), SJ9999 (nhẫn SJC), PQHN24NTT (PNJ 24K). API niêm yết VND/lượng, game chia 10 để lưu theo chỉ. Đây là nguồn tổng hợp, không tự nhận là API trực tiếp của SJC / PNJ.
- VNDIRECT: https://banggia.vndirect.com.vn/ ; API https://api-finfo.vndirect.com.vn/v4/stock_prices?sort=date:desc&q=code:FPT&size=1 . Lấy close của phiên gần nhất, nhân 1.000 từ nghìn VND thành VND/cổ phiếu. Mã: E1VFVN30, VCB, FPT, VNM, HPG, MWG, GAS.
- Yahoo Finance: https://finance.yahoo.com/ ; chart API regularMarketPrice, regularMarketTime và currency USD. Mã: SPY, AAPL, MSFT, NVDA, KO, TM. Dùng giá phiên được công bố gần nhất, không giả lập chênh mua/bán bằng số ngẫu nhiên.
- ExchangeRate-API: https://www.exchangerate-api.com/docs/free ; https://open.er-api.com/v6/latest/USD . Quy đổi tiền đầu tư theo USD/VND của bảng giá; tiền ngoại quốc nội bộ game vẫn là USD PPP, quy đổi qua mức giá hiện có của game.

Bảng dự phòng được lấy ngày 17/10/2026. Thời điểm cụ thể nằm trong từng bản ghi `asOf` của `data/market-prices.json`; chứng khoán có thể mang ngày phiên trước do nghỉ / đóng cửa. Không gắn thời gian tải trang làm thời gian giá. Bảng dự phòng và market-data.js giữ cùng dữ liệu khi phát hành.

## Cách hoạt động

- Cloudflare `_worker.js` chỉ phục vụ `/api/market`, lấy 15 yêu cầu upstream cố định và cache 300 giây. Không nhận URL tùy ý, không có API key hay lệnh giao dịch thật. Nguồn lỗi giữ bản dự phòng, trả danh sách lỗi và giữ nguyên thời điểm giá cũ.
- Khi mở bảng bằng tay, game tự kiểm tra tối đa một lần mỗi năm phút; có nút cập nhật. Mỗi mã hiển thị nguồn và thời điểm theo giờ Việt Nam. Giá ngoài đời ở thời điểm đó, không phải dự báo giá theo năm tương lai của nhân vật. Phí môi giới / thuế thực tế chưa được cộng trong mô phỏng.
- Vàng lưu theo chỉ, bước 0,1 chỉ = 0,01 lượng. Cổ phiếu / ETF nhập số nguyên, có thể chọn lô lẻ. Người chơi mua vàng theo `ask` (doanh nghiệp bán ra), bán theo `bid` (doanh nghiệp mua vào).
- Tiền mặt chỉ đổi khi xác nhận hợp lệ, xem được tổng tiền trước đó. Chặn số âm / không hữu hạn / nhập sai / thiếu tiền / bán quá số giữ / xác nhận lại / đổi tiền / đổi giá / đổi hoàn cảnh. Danh mục định giá theo giá bán được, không cộng tiền mặt hoặc giá trị danh mục hai lần.
- Danh mục mới lưu số lượng và giá vốn theo VND hoặc USD. Không chạy lợi suất, hủy niêm yết hay cổ tức ngẫu nhiên như danh mục mô phỏng cũ. Từ 4.8.1, giá tăng / giảm ngẫu nhiên theo năm mô phỏng; số lượng và giá vốn giữ nguyên. Nút kiểm tra giá ngoài đời không đặt lại giá mô phỏng. Đổi đơn vị tiền của nơi sống vẫn được quy đổi khi định giá.
- Bản lưu cũ không bị tự dựng số lượng: khoản cũ tiếp tục giữ nguyên. Mục quy đổi cho xem trước số lượng theo giá đang lưu, giữ nguyên tổng tài sản và tiền mặt; phần chưa đủ đơn vị ở khoản cũ. Đây là quy đổi kế toán, không khôi phục giao dịch lịch sử. Khoản cổ phiếu chung / penny không có mã thực vẫn là mô phỏng cũ.

## Đưa lên Cloudflare

Tải toàn bộ nội dung `public`, gồm `_worker.js`, `_routes.json`, `data`, `js` và `css` lên Pages. Không chỉ tải index.html hoặc js. Cloudflare hỗ trợ `_worker.js` khi kéo thả Direct Upload: https://developers.cloudflare.com/pages/get-started/direct-upload/ . Mẫu Worker dùng ASSETS: https://developers.cloudflare.com/pages/functions/advanced-mode/ .

Nếu dùng Workers qua CLI, wrangler.toml đã chỉ main tới public/_worker.js và binding ASSETS. Nếu chạy máy chủ tĩnh khác mà không có API, game thông báo chưa lấy giá mới và giữ bảng có thời điểm đã lưu. Máy chủ thử `node tools/serve.js` cũng hỗ trợ route API.

## Thay đổi từ 4.8.1

Theo lựa chọn của người chơi, bảng giá thật chỉ làm mốc ban đầu khi mở đầu tư. Sau khi mô phỏng thị trường bắt đầu, mỗi năm game cập nhật giá ngẫu nhiên đúng một lần; số lượng và giá vốn giữ nguyên. Giá mua / giá bán cùng biến động, không đảo chiều spread vàng. Ba loại vàng chia sẻ xu hướng, cổ phiếu chia sẻ xu hướng thị trường VN / Mỹ và có dao động riêng; ETF có độ dao động nhỏ hơn các cổ phiếu biến động mạnh trong mô hình. Đây là tham số cân bằng game, không phải dự báo hay lợi suất thực tế.

RNG thị trường được lưu riêng trong marketBook, không dùng RNG sự kiện chính. Lưu / mở lại không quay lại giá mới; xem bảng hoặc bấm kiểm tra giá ngoài đời không đặt lại giá mô phỏng, không thay đổi tỷ giá của danh mục đã bắt đầu mô phỏng. Nguồn thật mới chỉ cập nhật mốc cho các cuộc đời mới. Giá hiện tại và nhật ký ghi rõ năm mô phỏng, phần nguồn / asOf là mốc ngoài đời ban đầu.

Khi bán, game so sánh giá bán được với giá vốn bình quân có trọng số số lượng từ các lần mua: chênh mỗi đơn vị, phần trăm, tổng lãi / lỗ cho lượng đang bán. Bán một phần giảm giá vốn theo tỷ lệ. Với vàng, so sánh đã gồm chênh giá mua / bán; % âm ngay sau khi mua không có nghĩa giá thị trường vừa giảm. Giá vốn 0 không tính % vô hạn. Phí / thuế thực tế chưa tính.
