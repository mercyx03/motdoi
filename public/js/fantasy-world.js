(function(G){'use strict';
var D=G.FANTASY_DATA={
  classes:[{id:'dan',n:'Thường dân',w:48,gold:20,influence:2},{id:'thuong',n:'Thương hộ',w:18,gold:100,influence:12},{id:'thegia',n:'Thế gia địa phương',w:14,gold:170,influence:25},{id:'phap',n:'Gia tộc pháp sư',w:8,gold:220,influence:40},{id:'kiem',n:'Gia tộc kiếm sĩ danh giá',w:8,gold:220,influence:40},{id:'quytoc',n:'Gia đình quý tộc',w:4,gold:400,influence:65}],
  titles:['Thường dân','Huân tước','Nam tước','Tử tước','Bá tước','Hầu tước','Công tước'],
  ranks:['Chưa thức tỉnh','Sơ học','Học đồ','Tinh luyện','Chiến sư','Đại sư','Tông sư','Huyền thoại'],
  paths:{kiem:'Kiếm kỹ',phap:'Ma pháp',hac:'Hắc ma pháp',ren:'Rèn khí',duoc:'Dược thuật'},
  houses:[
    ['lan','Lam Tinh','phap','thuy','coi_trang','Truyền thừa thủy thuật, bảo vệ nguồn nước và thương lộ.'],
    ['hong','Hồng Diệm','phap','hoa','cao_nguyen','Pháp sư hỏa hệ, giữ những lò luyện tinh thạch phía bắc.'],
    ['bach','Bạch Phong','kiem','phong','son_thanh','Kiếm sĩ trọng danh dự, trấn giữ đường qua núi.'],
    ['huyen','Huyền Nham','kiem','tho','ai_da','Kiếm sĩ phòng thủ và thợ rèn, bảo vệ thành ải.'],
    ['ngan','Ngân Diệp','phap','sinh','rung_bac','Gia tộc trị liệu, bảo hộ rừng và thảo dược.'],
    ['da','Dạ Khế','hac','hac','thap_co','Nghiên cứu cấm thư; trong tộc có cả người bảo hộ lẫn kẻ muốn đánh đổi mọi thứ.'],
    ['kim','Kim Lộ','ren','co','cho_song','Thế gia thương nghiệp và cơ thuật, dựa vào khế ước.'],
    ['thien','Thiên Hành','kiem','phong','dong_co','Kỵ sĩ bảo vệ đoàn lữ hành trên đồng cỏ.'],
    ['tu','Tử Nguyệt','hac','thoi','di_tich','Gia tộc truy tìm ký ức và phong ấn cổ.'],
    ['linh','Linh Tuyền','duoc','thuy','ben_nuoc','Dược sư và người chữa lành, giữ bến sông.'],
    ['an','An Hà','kiem','thu','lang','Dòng họ bình dân, sống bằng ruộng và công việc trong làng.'],
    ['vu','Vũ Sa','phap','tho','hoang_sa','Thế gia sa mạc, giữ giếng và tuyến vận tải phía đông.']
  ],
  regions:[
    ['lang','Làng Bình Minh',0,0,0,'thu',1,'Khu dân cư',0,0],['truong','Học viện Ngân Đăng',1,0,0,'phap',2,'Học viện',0,1],['cho_song','Chợ ven sông',2,0,0,'co',3,'Thương lộ',1,2],['ben_nuoc','Bến Linh Tuyền',3,0,1,'thuy',4,'Thủy Vực',1,3],['coi_trang','Cõi Trăng',4,0,2,'thuy',0,'Thủy Vực',2,4],
    ['dong_co','Đồng Cỏ Gió',0,1,1,'phong',7,'Rừng Hoang',1,5],['rung_bac','Rừng Ngân Diệp',1,1,2,'sinh',4,'Rừng Hoang',2,6],['mo_dong','Mỏ Đồng Đỏ',2,1,2,'tho',3,'Sơn Động',2,7],['ai_da','Ải Huyền Nham',3,1,3,'tho',3,'Sơn Động',3,8],['cao_nguyen','Cao Nguyên Tro',4,1,4,'hoa',1,'Hoang Mạc',4,9],
    ['dam_lay','Đầm Sương Độc',0,2,3,'sinh',5,'Đầm Lầy',3,10],['son_thanh','Sơn Thành Bạch Phong',1,2,3,'phong',2,'Sơn Động',3,11],['di_tich','Di Tích Tử Nguyệt',2,2,4,'thoi',8,'Di Tích',4,12],['hoang_sa','Hoang Sa Lưu Quang',3,2,4,'tho',11,'Hoang Mạc',4,13],['long_huyet','Thung Lũng Long Huyết',4,2,5,'hoa',1,'Sơn Động',5,14],
    ['thap_co','Tháp Dạ Khế',0,3,4,'hac',5,'Di Tích',4,15],['vuc_sau','Vực Vô Thanh',1,3,5,'hac',5,'Di Tích',5,16],['bien_co','Bờ Biển Cổ',2,3,4,'thuy',0,'Thủy Vực',4,17],['cong_sao','Cổng Sao Rạn',3,3,6,'thoi',8,'Di Tích',6,18],['thanh_do','Thánh Đô Vương Miện',4,3,0,'thu',6,'Khu dân cư',0,19]
  ],
  skills:[
    ['kiem_1','Thế kiếm căn bản','kiem',1,0,0,'attack',3],['kiem_2','Bộ pháp Lưu Phong','kiem',2,3,1,'evade',5],['kiem_3','Phá Giáp Trảm','kiem',3,5,2,'pierce',8],['kiem_4','Kiếm Tâm','kiem',4,8,3,'focus',12],['kiem_5','Thiên Quang Nhất Kiếm','kiem',6,14,4,'burst',20],
    ['phap_1','Ma tiễn','phap',1,0,0,'magic',4],['phap_2','Khiên nguyên tố','phap',2,3,1,'shield',6],['phap_3','Liên hoàn nguyên tố','phap',3,5,2,'magic',10],['phap_4','Tụ linh','phap',4,8,3,'mana',13],['phap_5','Kết giới tinh tú','phap',6,14,4,'magic',22],
    ['hac_1','Ảnh tiễn','hac',1,0,0,'dark',5],['hac_2','Trói bóng','hac',2,3,1,'bind',7],['hac_3','Hấp thu tà khí','hac',3,5,2,'drain',10],['hac_4','Ấn khế hư ảnh','hac',4,8,3,'dark',15],['hac_5','Vực ảnh','hac',6,14,4,'dark',24],
    ['ren_1','Luyện kim căn bản','ren',1,0,0,'craft',0],['ren_2','Khắc phù trang bị','ren',3,4,1,'craft',0],['duoc_1','Nhận dược thảo','duoc',1,0,0,'heal',0],['duoc_2','Luyện linh dược','duoc',3,4,1,'heal',0]
  ],
  elements:{thu:'Thể chất',hoa:'Hỏa',thuy:'Thủy',tho:'Thổ',phong:'Phong',sinh:'Sinh mệnh',hac:'Hắc ám',thoi:'Thời gian',co:'Cơ thuật'},
  items:{go:{n:'Gỗ linh',price:4},quang:{n:'Quặng tinh',price:6},thao:{n:'Linh thảo',price:5},tinh:{n:'Tinh thạch',price:15},hac:{n:'Hắc tinh',price:25},thuoc:{n:'Thuốc hồi phục',price:12},mana:{n:'Dược hồi ma lực',price:14}},
  quests:[['ho_tong','Hộ tống đoàn hàng','travel',3,35,25],['rung','Làm sạch đường rừng','hunt',3,40,30],['thu_thap','Dược liệu cho trạm chữa','thao',5,30,20],['ren','Quặng cho lò rèn','quang',5,35,20],['khao_sat','Khảo sát các miền','discover',5,60,45],['phong_an','Phong ấn dị biến','boss',1,100,80],['cuu_tro','Tiếp tế vùng chiến sự','aid',2,55,35],['hoc_gia','Nghiên cứu tinh thạch','tinh',3,65,40]],
  eventAges:{baby:[0,2],child:[3,5],pupil:[6,11],youth:[12,17],adult:[18,45],mature:[46,69],elder:[70,110]}
};
D.houses=D.houses.map(function(x){return{id:x[0],n:x[1],path:x[2],element:x[3],home:x[4],lore:x[5]};});
D.regions=D.regions.map(function(x){return{id:x[0],n:x[1],x:x[2],y:x[3],danger:x[4],element:x[5],owner:x[6],habitat:x[7],minRank:x[8],index:x[9]};});
D.skills=D.skills.map(function(x){return{id:x[0],n:x[1],path:x[2],rank:x[3],points:x[4],pre:x[5],effect:x[6],cost:x[7]};});
D.quests=D.quests.map(function(x){return{id:x[0],n:x[1],goal:x[2],need:x[3],gold:x[4],xp:x[5]};});
D.guilds=[{id:'vebinh',n:'Đoàn Kiếm Vệ',path:'kiem',min:20,ranks:['Tân vệ','Vệ sĩ','Đội trưởng','Chỉ huy']},{id:'phaphoi',n:'Pháp Hội Ngân Đăng',path:'phap',min:20,ranks:['Học viên','Pháp sư','Giảng sư','Đại giảng sư']},{id:'bongtoi',n:'Hội Nghiên Cứu Dạ Ấn',path:'hac',min:25,ranks:['Người nghiên cứu','Thủ thư bóng tối','Giám định cấm thư','Người giữ phong ấn']},{id:'congtuong',n:'Công Tượng Hội',path:'ren',min:15,ranks:['Thợ học việc','Nghệ nhân','Chủ xưởng','Đại công tượng']},{id:'duochanh',n:'Dược Hành Hội',path:'duoc',min:15,ranks:['Học dược','Dược sư','Dược trưởng','Đại dược sư']}];
D.equipment=[];
['Kiếm Lưu Phong','Pháp trượng Tinh Đăng','Trượng Dạ Ấn','Giáp Huyền Nham'].forEach(function(name,type){for(var tier=1;tier<=5;tier++)D.equipment.push({id:'eq_'+type+'_'+tier,n:name+' · '+['','Phàm','Tinh','Linh','Huyền','Cổ'][tier],slot:type===3?'armor':'weapon',path:['kiem','phap','hac','ren'][type],tier:tier,minLevel:tier*5,bonus:tier*5});});
})(globalThis.G);
