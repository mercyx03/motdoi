/* Nguồn và mốc áp dụng của phần mở rộng ROYAL920; gia tộc trong game vẫn hư cấu. */
(function(G){'use strict';
  G.E.ROYAL858_DATA={checkedAt:'2026-11-09',countries:['GB','ES','BE','SE','DK','NL','LU','MC'],rules:{
    uk1917:{from:'1917-11-30',source:'https://www.college-of-arms.gov.uk/resources/styles-and-titles-of-the-royal-family',note:'Con của quân chủ, cháu qua con trai; ngoại lệ chắt trưởng nam và Lord/Lady theo văn thư.'},
    uk2012:{from:'2012-12-31',source:'https://www.thegazette.co.uk/notice/L-60384-1738680',note:'Tất cả con của con trai trưởng của Prince of Wales.'},
    uk1948:{from:'1948-10-22',source:'https://www.college-of-arms.gov.uk/resources/styles-and-titles-of-the-royal-family',note:'Ngoại lệ cho con Princess Elizabeth và Duke of Edinburgh; chỉ áp khi có phạm vi được ghi rõ.'},
    wales:{from:null,source:'https://researchbriefings.files.parliament.uk/documents/CBP-9372/CBP-9372.pdf',note:'Tước phong riêng, không tự có vì đứng đầu hàng kế vị.'},
    cornwall:{from:'1337-01-01',precision:'year',source:'https://www.duchyofcornwall.org/faqs/',note:'Con trai trưởng còn sống của quân chủ đồng thời là người thừa kế; không cấp mặc định cho nữ hoặc cháu.'},
    rothesay:{from:'1469-01-01',precision:'year',source:'https://www.gov.uk/government/publications/kings-or-princes-consent/kings-and-princes-consent',note:'Điều kiện con trai trưởng của quân chủ; dùng tại Scotland. Chưa có căn cứ tự cấp nữ thừa kế.'},
    ukSurname:{from:'1960-02-08',source:'https://www.royal.uk/royal-family-name',note:'Nhà Windsor và họ Mountbatten-Windsor là hai dữ liệu khác nhau; cần đúng dòng hậu duệ.'},
    sussex:{from:'2018-07-16',source:'https://www.thegazette.co.uk/notice/3071743',remainder:'heirsMaleBody',territory:'Sussex',key:'duke',note:'Ca tham chiếu: heirs male of the body lawfully begotten.'},
    edinburgh:{from:'2023-03-10',source:'https://www.royal.uk/news-and-activity/2023-03-10/the-king-confers-the-dukedom-of-edinburgh-upon-the-prince-edward',remainder:'life',territory:'Edinburgh',key:'duke',note:'Ca tham chiếu sáng lập năm 2023: chỉ suốt đời người nhận.'},
    spain:{from:'1987-12-02',source:'https://www.boe.es/eli/es/rd/1987/11/06/1368/con',note:'Điều 2 Asturias/phối ngẫu; điều 3 Infante; điều 4 con Infante là Grande; điều 6 quyền dùng tước cá nhân chung thân.'},
    belgium:{from:'2015-11-12',source:'https://www.ejustice.just.fgov.be/cgi/article_body.pl?language=fr&caller=summary&pub_date=2015-11-24&numac=2015021075',note:'Con/cháu trực hệ quân chủ và người thừa kế theo sắc lệnh; quyền cũ được giữ riêng, không hồi tố xóa.'},
    brabant:{from:'2001-10-16',source:'https://www.monarchie.be/en/royal-family/princess-elisabeth-duchess-of-brabant',note:'Tước riêng của con trưởng quân chủ; kiểm nhánh đại diện, không gán cho mọi người đứng số 1.'},
    sweden:{from:'1980-01-01',source:'https://www.kungahuset.se/english/royal-house',note:'Prince/Princess, HRH và Royal House tách nhau; tước tỉnh do quyết định riêng.'},
    se2019:{from:'2019-10-07',source:'https://www.kungahuset.se/english/archive/press-releases/2021-03-28-prince-julian-herbert-folke-duke-of-halland',note:'Nguồn xác nhận quyết định 7/10/2019; chỉ áp nhánh được chỉ định. Giữ Prince/Princess và dukedom, tách HRH/Royal House.'},
    estelle:{from:'2012-02-24',source:'https://www.kungahuset.se/english/royal-house/hrh-princess-estelle',territory:'Östergötland',note:'Ca đối chiếu cá nhân, không là tước mặc định cho mọi người thừa kế.'},
    monpezat:{from:'2008-04-30',precision:'month',source:'https://www.kongehuset.dk/en/news/changes-in-titles-and-forms-of-address-in-the-royal-family',note:'Grant theo nhánh được chỉ định, không đồng nghĩa họ pháp lý.'},
    dk2023:{from:'2023-01-01',source:'https://www.kongehuset.dk/en/news/changes-in-titles-and-forms-of-address-in-the-royal-family',note:'Hậu duệ Joachim: Count/Countess of Monpezat, Excellency; giữ thứ tự kế vị.'},
    netherlands:{from:'2002-06-12',source:'https://www.koninklijkhuis.nl/onderwerpen/koninklijk-huis/titels-en-aanspreektitels',note:'Phân biệt Orange, Netherlands, Orange-Nassau, Count, Jonkheer; danh xưng và họ theo sắc lệnh từng nhánh.'},
    nlHouse:{from:'2002-06-12',source:'https://www.royal-house.nl/topics/monarchy/royal-house/royal-house-and-royal-family',note:'Royal House khác Royal Family; xét độ thân thuộc và quyền kế vị.'},
    luxembourg:{from:'2023-07-01',source:'https://monarchie.lu/en/luxembourg-monarchy/constitutional-monarchy',note:'Người thừa kế từ 18 tuổi dùng Hereditary Grand Duke/Duchess; không tự gắn Bourbon-Parma.'},
    bourbon:{from:null,source:'https://monarchie.lu/en/luxembourg-monarchy/former-sovereigns/hrh-grand-duke-henri',note:'Căn cứ theo người/dòng riêng, không suy ra từ tước kế vị.'},
    crownGB:{from:'2015-03-26',source:'https://www.legislation.gov.uk/ukpga/2013/20',note:'Ưu tiên giới chỉ bỏ cho người sinh sau 28/10/2011; tước quý tộc dùng remainder riêng.'},
    crownES:{from:'1978-12-29',source:'https://www.casareal.es/EN/corona/Paginas/la-corona-hoy_orden.aspx',note:'Ưu tiên nam trong cùng hàng con; đại diện theo nhánh.'}
  }};
})(globalThis.G);
