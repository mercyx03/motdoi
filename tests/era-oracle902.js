'use strict';
// 9.1 giai đoạn 1: "thước đo" độc lập cho nội dung sai thời. Mỗi dòng: [id, biểu thức nhận diện trong lời kể, năm đầu tiên có thể xảy ra, ghi chú nguồn/cơ sở].
// Năm là năm đầu tiên sản phẩm/kỹ thuật được bán hoặc dùng công khai ở bất kỳ nước nào (không phải năm phổ biến ở từng nước; phần đó thuộc giai đoạn 2).
// Chỉ liệt kê mốc có thể đối chiếu công khai; mốc chưa chắc thì không đưa vào.
const TECH = [
  ['tv', /\bTV\b|\btivi\b|\bti vi\b|truyền hình/i, 1936, 'BBC phát sóng truyền hình công cộng thường xuyên từ 11/1936'],
  ['mobile', /điện thoại di động|điện thoại cầm tay|\bđi động\b/i, 1983, 'Motorola DynaTAC bán thương mại 1983'],
  ['sms', /\bSMS\b/, 1992, 'tin nhắn SMS đầu tiên gửi 12/1992'],
  ['smartphone', /điện thoại thông minh|smartphone|iPhone|Android/i, 2007, 'iPhone ra mắt 2007'],
  ['internet', /\binternet\b|\bonline\b|\bwebsite\b|trang web|\bemail\b|\bgmail\b|\be-mail\b/i, 1991, 'World Wide Web công bố công khai 1991'],
  ['wifi', /\bwi-?fi\b/i, 1999, 'Wi-Fi tiêu dùng (AirPort) 1999'],
  ['google', /\bgoogle\b|tìm kiếm trên mạng/i, 1998, 'Google thành lập 1998'],
  ['facebook', /facebook|\bmạng xã hội\b|fanpage|messenger/i, 2004, 'Facebook 2004'],
  ['youtube', /youtube|youtuber/i, 2005, 'YouTube 2005'],
  ['instagram', /instagram/i, 2010, 'Instagram 2010'],
  ['tiktok', /tiktok|douyin/i, 2016, 'Douyin 2016, TikTok quốc tế 2017'],
  ['zalo', /\bzalo\b/i, 2012, 'Zalo 2012'],
  ['netflix', /netflix/i, 1997, 'Netflix thành lập 1997 (thuê DVD)'],
  ['stream', /livestream|\bstreamer\b|\btwitch\b/i, 2011, 'Twitch 2011'],
  ['dating_app', /tinder|ứng dụng hẹn hò|app hẹn hò/i, 2009, 'Grindr 2009, Tinder 2012'],
  ['ridehail', /\bgrab\b|\buber\b|tài xế công nghệ|xe ôm công nghệ/i, 2009, 'Uber 2009'],
  ['ewallet', /ví điện tử|\bmomo\b|zalopay|thanh toán qr|quét mã qr/i, 2011, 'ví điện tử/QR thanh toán đại chúng từ ~2011'],
  ['crypto', /tiền mã hóa|bitcoin|\bcrypto\b|\bnft\b/i, 2009, 'Bitcoin 2009'],
  ['ai', /ChatGPT|chatgpt|trí tuệ nhân tạo|\bAI\b|deepfake/, 2016, 'AI đại chúng từ ~2016; ChatGPT 2022'],
  ['covid', /covid|giãn cách xã hội/i, 2020, 'COVID-19 đại dịch 2020'],
  ['hiv', /\bHIV\b|\bAIDS\b/, 1981, 'AIDS được ghi nhận 1981'],
  ['ivf', /\bIVF\b|thụ tinh ống nghiệm|mang thai hộ/i, 1978, 'em bé ống nghiệm đầu tiên 1978'],
  ['pill', /thuốc tránh thai|viên tránh thai/i, 1960, 'viên tránh thai Enovid 1960'],
  ['dna', /\bADN\b|\bDNA\b|huyết thống/i, 1985, 'dấu vân tay ADN 1985'],
  ['mri', /\bMRI\b|cộng hưởng từ/i, 1977, 'ảnh MRI người đầu tiên 1977'],
  ['ct', /chụp CT|\bCT scan\b|cắt lớp vi tính/i, 1971, 'CT lâm sàng đầu tiên 1971'],
  ['chemo', /hóa trị/i, 1946, 'hóa trị liệu ung thư đầu tiên 1940s'],
  ['transplant', /ghép (thận|gan|tim|tạng)/i, 1954, 'ghép thận thành công đầu tiên 1954'],
  ['atm', /\bATM\b|máy rút tiền/i, 1967, 'ATM đầu tiên 1967'],
  ['creditcard', /thẻ tín dụng/i, 1958, 'BankAmericard 1958'],
  ['laptop', /laptop|máy tính xách tay/i, 1981, 'Osborne 1 (1981)'],
  ['playstation', /playstation/i, 1994, 'PlayStation 1994'],
  ['xbox', /\bxbox\b/i, 2001, 'Xbox 2001'],
  ['lol', /liên minh huyền thoại|liên minh:|league of legends|tốc chiến/i, 2009, 'League of Legends 2009'],
  ['lienquan', /liên quân/i, 2016, 'Arena of Valor 2016'],
  ['battleroyale', /\bpubg\b|free fire/i, 2017, 'PUBG 2017, Free Fire 2017'],
  ['minecraft', /minecraft/i, 2009, 'Minecraft 2009 (alpha)'],
  ['esports', /e-?sports?\b|giải esports/i, 1997, 'giải Quake Red Annihilation 1997'],
  ['videogame', /trò chơi điện tử|chơi game|\bgame online\b/i, 1972, 'Pong/Odyssey 1972'],
  ['podcast', /podcast/i, 2004, 'podcast 2004'],
  ['ielts', /\bIELTS\b/, 1989, 'IELTS ra mắt 1989'],
  ['toefl', /\bTOEFL\b/i, 1964, 'TOEFL 1964'],
  ['spotify', /spotify/i, 2008, 'Spotify 2008'],
  ['videocall', /gọi video|video call|facetime|\bskype\b/i, 2003, 'Skype 2003'],
  ['kpop', /k-?pop|đu idol/i, 1996, 'K-pop hiện đại: H.O.T. 1996'],
  ['cctv', /camera (an ninh|giám sát|cho thấy|ghi lại|quan sát)|\bcctv\b/i, 1949, 'camera giám sát thương mại 1949'],
  ['appstore', /ứng dụng (cá cược|hẹn hò|gọi xe|giao hàng|ngân hàng|học|vay|ví|cảnh báo|di động|điện thoại)|(qua|trên|bằng) ứng dụng|\bAPI\b/i, 2008, 'App Store 2008'],
  ['netculture', /dân mạng|cư dân mạng|khắp mạng|đăng bài|bài đăng|nhóm chat/i, 1998, 'phòng chat công cộng cuối thập niên 1990'],
  ['pc', /mở máy tính|bật máy tính|máy tính cá nhân|\bPC\b/, 1977, 'Apple II, TRS-80, PET 1977'],
  ['msg', /tin nhắn|nhắn tin/i, 1992, 'tin nhắn văn bản SMS 1992']
];
function scan(life, opts) {
  const out = [], by = life.birthYear;
  (life.log || []).forEach(e => {
    const wy = by + e.a, t = String(e.t || '');
    for (const [id, re, from] of TECH) if (wy < from && re.test(t)) out.push({ id, year: wy, from, age: e.a, text: t.slice(0, 160) });
  });
  return out;
}
module.exports = { TECH, scan };
