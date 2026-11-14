/* 9.0: mức tiếp cận internet theo nước ảnh hưởng tần suất các sự kiện phụ thuộc internet (mạng xã hội, việc làm trực tuyến, freelance, game, thể thao điện tử, giao hàng qua ứng dụng).
   Trước đây một đứa trẻ ở nước có dưới 10% dân số dùng internet vẫn gặp các sự kiện này nhiều như ở nước trên 90%.
   Nguồn: World Bank WDI IT.NET.USER.ZS (CC BY 4.0), xem data-access890.js. Đây là mức trung bình toàn quốc; điều chỉnh theo thành thị/nông thôn, nhóm thu nhập gia đình và tuổi là tham số trò chơi, không phải số liệu.
   Chỉ giảm tần suất, không bao giờ tăng; từ mức tiếp cận hiệu dụng 75% trở lên không đổi gì (nên người ở nước đã phổ cập không bị ảnh hưởng). Nước không có số liệu không bị giới hạn.
   Quyết định mỗi sự kiện theo năm là xác định từ mã đời và năm nên tải lại bản lưu không đổi kết quả. */
(function(G){'use strict';var E=G.E,H=E.H,D=G.ACCESS890_DATA;if(!E.TRIG||!D)return;
var IDS=['net_coi','viec_online','tiktok','nap_game','ld_app_khoa_tk','net_tre_tron_hoc','telesale_data_ban','es_hop_dong_doi','es_ban_do','es_toxic_mang','es_nghien_choi','es_scout','fl_khach_quyt','fl_bhxh_tu_nguyen','fl_hop_dong_doc_quyen','fl_dich_tai_lieu_mat','fl_content_ai','fl_aff_hang_kem','fl_long_tieng_giong_ai','fl_burnout_lam_dem','cn_mang_xa_hoi_toxic','ghep_game','chon_game','dk_game','dk_game_nho','dk_ship','dk_ship_nho','fan_sinh_nhat','fan_vote','fan_photocard','fan_war','mxh_boc_phot','mxh_hoi_nhom','k6_lua_game'];
var FULL=.75;
function hash(k){var h=2166136261;k=String(k);for(var i=0;i<k.length;i++){h^=k.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;}
function base(l){var c=H.resCode(l),v=D.net[c];return v==null?null:v/100;}
// Mức tiếp cận hiệu dụng của một người trong năm hiện tại của họ (0..1).
function effective(l,age){
 var b=base(l);if(b==null)return null;
 var a=age==null?l.age:age,w=a<25?1.5:a<55?1:.6; // người trẻ dùng internet nhiều hơn mức trung bình toàn quốc, người lớn tuổi ít hơn
 var x=Math.min(1,b*w);
 x*=l.urban===false?.8:l.urban?1.12:1;
 var q=l.fam&&l.fam.q;x*=q>=4?1.2:q<=2?.8:1;
 return Math.max(.01,Math.min(1,x));
}
// Hệ số giữ lại sự kiện: 1 nếu đã phổ cập (hoặc không có số liệu), nhỏ hơn 1 ở nơi ít người dùng internet.
function factor(l,age){var e=effective(l,age);return e==null?1:Math.min(1,e/FULL);}
function pass(l,id,a){var f=factor(l,a);return f>=1||hash((l.id||l.seed||'')+':'+id+':'+a)<f;}
var wrapped=0;
E.TRIG.forEach(function(t){if(IDS.indexOf(t.id)<0||t.access890)return;var when=t.when;t.when=function(l,a){return when.apply(this,arguments)&&pass(l,t.id,a);};t.access890=true;wrapped++;});
E.ACCESS890={IDS:IDS,FULL:FULL,base:base,effective:effective,factor:factor,pass:pass,wrapped:wrapped,source:D.source,year:D.year};
})(globalThis.G);
