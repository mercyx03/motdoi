/* Fantasy-only real-time spiritual power. No wall-clock timestamp is persisted:
   hidden tabs, paused play and time spent offline never grant catch-up power. */
(function(G){'use strict';
var F=G.FANTASY,D=F.data,MAX=Number.MAX_SAFE_INTEGER/4;
D.spiritBooks=[
 {id:'tulinh',n:'Tụ Linh Nhập Môn',bonus:10,price:30,regions:['lang','truong','cho_song','ben_nuoc','thanh_do']},
 {id:'linhtuyen',n:'Linh Tuyền Dẫn Khí',bonus:20,price:90,regions:['ben_nuoc','truong','thanh_do']},
 {id:'tinhha',n:'Tinh Hà Thổ Nạp',bonus:35,price:220,regions:['truong','thanh_do']}
];
function ensure(l){if(!l.cultivation)l.cultivation={version:1,studyBonus:0,books:[]};return l.cultivation;}
F.ensureCultivation=ensure;
F.spiritNeeded=function(l){return Math.min(MAX,Math.ceil(100*Math.pow(1.18,Math.min(180,l.level-1))));};
F.requirement=function(level){var total=0;for(var i=1;i<Math.min(level,182);i++)total=Math.min(MAX,total+F.spiritNeeded({level:i}));return total;};
F.cultivationStage=function(level){var rank=Math.min(7,Math.floor((level-1)/5));return D.ranks[rank]+' · tầng '+(rank===7?level-35:(level-1)%5+1);};
F.mastery=function(l){return F.requirement(l.level)+l.xp;};
F.masteryName=function(){return 'Linh lực';};
F.spiritRate=function(l){var c=ensure(l),base=10*(1+F.stats(l).rank*.5),books=c.books.reduce(function(sum,id){var b=D.spiritBooks.find(function(x){return x.id===id;});return sum+(b?b.bonus:0);},0),bonus=c.studyBonus+books;return{base:base,bonus:bonus,study:c.studyBonus,books:books,total:base*(1+bonus/100)};};
F.addSpiritualPower=function(l,amount){if(!l.alive||!Number.isFinite(amount)||amount<=0)return false;ensure(l);l.xp=Math.min(MAX,l.xp+amount);return true;};
F.toggleCultivation=function(l){if(!F.free(l)||l.age<6)return false;l.meditating=!l.meditating;return true;};
F.absorb=function(l,seconds){if(!l.meditating||!F.free(l)||!l.alive||l.age<6||!Number.isFinite(seconds)||seconds<=0||seconds>5)return false;return F.addSpiritualPower(l,F.spiritRate(l).total*seconds);};
F.breakthrough=function(l){var needed=F.spiritNeeded(l);if(!F.free(l)||l.age<6||l.xp<needed||!Number.isSafeInteger(l.level+1))return false;var rank=F.stats(l).rank;l.xp-=needed;l.level++;l.points+=2;l.body++;l.spirit++;F.log(l,'Đột phá thành công: '+F.cultivationStage(l.level)+'. Giữ lại '+Math.round(l.xp)+' linh lực dư; nhận 2 điểm lĩnh ngộ.','big');if(F.stats(l).rank>rank)F.log(l,'Cảnh giới mới tăng tốc độ hấp thụ gốc lên '+F.spiritRate(l).base+' linh lực/giây.','good');return true;};
var study=F.study;F.study=function(l){var ok=study(l);if(ok&&l.age>=6){var c=ensure(l),old=c.studyBonus;c.studyBonus=Math.min(100,old+10);F.log(l,c.studyBonus>old?'Đọc sách nâng hiệu suất hấp thụ thêm 10 điểm %; tổng nghiên cứu +'+c.studyBonus+'%.':'Đã đạt +100% nghiên cứu; đọc sách vẫn nhận linh lực.','good');}return ok;};
F.availableSpiritBooks=function(l){return D.spiritBooks.filter(function(b){return b.regions.includes(l.location);});};
F.readSpiritBook=function(l,id){var b=F.availableSpiritBooks(l).find(function(x){return x.id===id;}),c=ensure(l);if(!b||!F.free(l)||l.age<12||l.ap<1||l.gold<b.price||c.books.includes(id))return false;l.ap--;l.gold-=b.price;c.books.push(id);F.log(l,'Học '+b.n+': cộng vĩnh viễn '+b.bonus+'% tốc độ hấp thụ linh lực gốc.','good');return true;};
var create=F.create;F.create=function(opts){var l=create(opts);ensure(l);return l;};
var migrate=F.migrate;F.migrate=function(l){var legacy=l&&!l.cultivation;l=migrate(l);if(!l)return null;if(legacy){l.xp=Math.max(0,l.xp)/(40+l.level*25)*F.spiritNeeded(l);ensure(l);}var c=l.cultivation;if(!c||c.version!==1||!Number.isFinite(c.studyBonus)||c.studyBonus<0||c.studyBonus>100||c.studyBonus%10!==0||!Array.isArray(c.books)||new Set(c.books).size!==c.books.length||c.books.some(function(id){return !D.spiritBooks.some(function(b){return b.id===id;});})||l.xp<0||l.xp>MAX)return null;l.meditating=false;return l;};
})(globalThis.G);
