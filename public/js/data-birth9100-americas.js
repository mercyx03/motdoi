/* Một Đời — 9.10.0 bổ sung sự kiện thật (đợt 3, châu Mỹ và Caribe): nâng các nước còn mỏng, thêm thể thao, văn hóa, đời sống.
   Cùng quy tắc chống trùng với data-birth989-more.js. Nguồn thứ cấp, đối chiếu 25/11/2026. */
(function (G) {
  'use strict';
  var D = G.BIRTH987 || (G.BIRTH987 = { ERA: {}, EV: {}, WORLD: [] });
  var STOP = { 'năm': 1, 'của': 1, 'được': 1, 'những': 1, 'người': 1, 'trong': 1, 'cho': 1, 'với': 1, 'các': 1, 'một': 1, 'lần': 1, 'đầu': 1, 'tiên': 1, 'lớn': 1 };
  function wd(t) { return String(t).toLowerCase().split(/[^\p{L}\d]+/u).filter(function (x) { return x.length >= 3 && !STOP[x]; }); }
  function dup(c, r) { var a = wd(r[1]); return (D.EV[c] || []).some(function (e) { if (e[0] !== r[0]) return false; var b = wd(e[1]); return e[1] === r[1] || a.filter(function (x) { return b.indexOf(x) >= 0; }).length >= 2; }); }
  function ev(c, rows) { rows.forEach(function (r) { if (!dup(c, r)) (D.EV[c] || (D.EV[c] = [])).push([r[0], r[1], r[2] || 1, r[3] || '']); }); }
  var J = 'joy', Gr = 'grief';

  ev('EC', [[1941, 'chiến tranh biên giới với Peru', 2, Gr], [2000, 'bỏ đồng sucre, chuyển sang dùng đô la Mỹ', 2], [2016, 'động đất ven biển Manabí', 2, Gr]]);
  ev('GT', [[1944, 'cuộc cách mạng tháng Mười lật độc tài Ubico', 2], [1954, 'đảo chính lật Tổng thống Árbenz', 2], [1976, 'động đất lớn tháng Hai', 2, Gr], [1992, 'Rigoberta Menchú nhận giải Nobel Hòa bình', 2, J], [2015, 'tổng thống từ chức vì bê bối tham nhũng', 1], [2023, 'Bernardo Arévalo thắng cử tổng thống', 1]]);
  ev('BO', [[1932, 'chiến tranh Chaco với Paraguay bùng nổ', 2, Gr], [1952, 'cách mạng quốc gia tháng Tư', 2], [1967, 'Che Guevara bị bắt và hạ sát ở La Higuera', 2], [2000, 'Chiến tranh Nước ở Cochabamba', 2], [2005, 'Evo Morales đắc cử tổng thống', 2], [2019, 'khủng hoảng sau bầu cử, Morales từ chức', 2]]);
  ev('PG', [[1942, 'chiến dịch Kokoda', 2, Gr], [1988, 'khởi đầu cuộc khủng hoảng Bougainville', 2, Gr], [1998, 'sóng thần ở Aitape', 2, Gr], [2019, 'trưng cầu dân ý Bougainville với đa số chọn độc lập', 2]]);
  ev('PY', [[1932, 'chiến tranh Chaco với Bolivia', 2, Gr], [1954, 'Stroessner đảo chính', 2], [1989, 'Stroessner bị lật đổ', 2], [1991, 'ký hiệp ước Asunción thành lập Mercosur', 2], [2004, 'cháy siêu thị Ycuá Bolaños', 2, Gr], [2008, 'Fernando Lugo đắc cử', 1]]);
  ev('DO', [[1930, 'bão San Zenón tàn phá Santo Domingo', 2, Gr], [1937, 'vụ thảm sát người Haiti ở biên giới', 2, Gr], [1961, 'Trujillo bị ám sát', 2], [1965, 'nội chiến và Mỹ đổ quân', 2, Gr]]);
  ev('HN', [[1954, 'đại bãi công ở các đồn điền chuối', 2], [1969, 'chiến tranh bóng đá với El Salvador', 2, Gr], [1998, 'bão Mitch', 2, Gr], [2009, 'đảo chính lật Tổng thống Zelaya', 2]]);
  ev('NI', [[1934, 'Augusto Sandino bị sát hại', 2, Gr], [1972, 'động đất Managua', 2, Gr], [1979, 'cách mạng Sandinista', 2], [1990, 'Violeta Chamorro thắng cử', 2], [2018, 'biểu tình bị đàn áp tháng Tư', 2, Gr]]);
  ev('SV', [[1932, 'cuộc đàn áp "La Matanza"', 2, Gr], [1969, 'chiến tranh bóng đá với Honduras', 2, Gr], [1980, 'Tổng giám mục Romero bị ám sát', 2, Gr], [1981, 'thảm sát El Mozote', 2, Gr], [1992, 'hiệp định hòa bình kết thúc nội chiến', 2], [2001, 'hai trận động đất tháng Một và tháng Hai', 2, Gr], [2019, 'Nayib Bukele thắng cử', 1]]);
  ev('PA', [[1914, 'kênh đào Panama chính thức thông tàu', 2, J], [1964, 'bạo loạn Ngày Quốc kỳ', 2, Gr], [1977, 'hiệp ước Torrijos–Carter', 2], [1989, 'Mỹ đổ quân vào Panama', 2, Gr], [1999, 'Mỹ bàn giao kênh đào', 2], [2016, 'khánh thành tuyến kênh mở rộng', 2, J]]);
  ev('CR', [[1948, 'nội chiến ngắn, bãi bỏ quân đội', 2], [1949, 'hiến pháp mới cho phụ nữ đi bầu', 2], [1987, 'Óscar Arias nhận giải Nobel Hòa bình', 2, J]]);
  ev('JM', [[1944, 'phổ thông đầu phiếu lần đầu', 2], [1962, 'độc lập ngày 6 tháng Tám', 2, J], [1976, 'ban bố tình trạng khẩn cấp vì bạo lực chính trị', 2, Gr], [1988, 'bão Gilbert', 2, Gr], [2008, 'Usain Bolt phá kỷ lục ở Bắc Kinh', 2, J]]);
  ev('GY', [[1978, 'thảm kịch Jonestown', 2, Gr], [2015, 'phát hiện mỏ dầu ngoài khơi', 2], [2019, 'khai thác dầu thương mại đầu tiên', 2]]);
  ev('TT', [[1937, 'bãi công dầu khí, phong trào Butler', 2], [1970, 'phong trào Quyền lực Da đen', 2], [1994, 'Brian Lara đạt 375 điểm kỷ lục cricket', 1, J], [2004, 'Brian Lara đạt 400 điểm không bị loại', 1, J]]);
  ev('SR', [[1980, 'đảo chính của các hạ sĩ quan', 1], [1982, 'vụ giết người hàng loạt tháng Mười Hai', 2, Gr], [1987, 'hiến pháp mới và bầu cử', 1], [1992, 'hiệp định hòa bình chấm dứt chiến tranh rừng', 2], [2010, 'Desi Bouterse trở lại làm tổng thống', 1]]);
  ev('BZ', [[1961, 'bão Hattie tàn phá thành phố Belize', 2, Gr], [1970, 'dời thủ đô về Belmopan', 1], [2001, 'bão Iris', 2, Gr]]);
  ev('BS', [[1967, 'chính quyền đa số da đen đầu tiên', 2], [1992, 'bão Andrew quét qua quần đảo', 2, Gr], [2019, 'bão Dorian tàn phá Abaco và Grand Bahama', 2, Gr]]);
  ev('BB', [[1951, 'bão Janet', 2, Gr], [1968, 'Garry Sobers đánh sáu sáu liên tiếp', 1, J], [2021, 'trở thành nước cộng hòa, Sandra Mason nhậm chức', 2]]);
  ev('LC', [[1951, 'phổ thông đầu phiếu', 1], [1979, 'độc lập ngày 22 tháng Hai', 2, J], [1992, 'Derek Walcott nhận giải Nobel Văn học', 2, J]]);
  ev('VC', [[1902, 'núi lửa La Soufrière phun trào', 2, Gr], [1979, 'độc lập và núi lửa lại hoạt động', 2], [2021, 'La Soufrière phun trào, hàng chục nghìn người sơ tán', 2, Gr]]);
  ev('AG', [[1967, 'trở thành quốc gia liên kết với Anh', 1], [1995, 'bão Luis', 2, Gr], [2017, 'bão Irma tàn phá Barbuda', 2, Gr]]);
  ev('KN', [[1983, 'độc lập ngày 19 tháng Chín', 2, J], [1998, 'trưng cầu dân ý đòi tách của Nevis', 1], [1998, 'bão Georges', 2, Gr]]);
  ev('DM', [[1979, 'bão David', 2, Gr], [1980, 'Eugenia Charles thành nữ thủ tướng đầu tiên của vùng', 2, J], [2017, 'bão Maria tàn phá đảo', 2, Gr]]);
})(globalThis.G);
