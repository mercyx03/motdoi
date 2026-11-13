/* 8.10.79: thuế thu nhập tiền lương theo nước sống (Anh, Úc, Singapore, Canada), mở rộng cách Việt Nam (tax-resident.js) và Mỹ (world836.js) đã làm.
   Đầu vào là thu nhập làm công sau bảo hiểm bắt buộc sẵn có; thuế tính theo biểu lũy tiến của năm thu nhập, đổi qua tiền địa phương rồi trở lại đơn vị tiền của game.
   Chỉ áp dụng cho năm có biểu đã đối chiếu; năm trước mốc đó và nước chưa có biểu giữ hành vi cũ (không thuế). Ước tính: chưa gồm giảm trừ cá nhân, thuế địa phương và đóng góp an sinh riêng. */
(function(G){'use strict';var E=G.E,H=E.H;if(!E.careerYear||!E.ECON918)return;
var SRC={
 GB:'https://www.gov.uk/government/publications/rates-and-allowances-income-tax/income-tax-rates-and-allowances-current-and-past',
 AU:'https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents',
 SG:'https://www.iras.gov.sg/taxes/individual-income-tax/basics-of-individual-income-tax/tax-residency-and-tax-rates/individual-income-tax-rates',
 CA:'https://www.canada.ca/en/revenue-agency/services/tax/individuals/tax-rates-brackets/current-year.html'};
// bands: [giới hạn trên của thu nhập chịu thuế, thuế suất]; from: năm thu nhập đầu tiên áp dụng.
var RULES={
 GB:{from:2023,name:'Anh (Anh, xứ Wales, Bắc Ireland)',cur:'GBP',scope:'Biểu thuế thu nhập 2023–24 đến 2026–27: miễn thuế 12.570 bảng (giảm dần khi thu nhập trên 100.000), 20% đến 37.700, 40% đến 125.140, 45% trên đó. Chưa gồm Scotland và National Insurance.',
  allowance:function(g){return Math.max(0,12570-Math.max(0,(g-100000)/2));},bands:function(){return [[37700,.2],[125140,.4],[Infinity,.45]];}},
 AU:{from:2024,name:'Úc',cur:'AUD',scope:'Biểu cư dân Úc: miễn thuế đến 18.200 đô la; 16% đến 45.000 (15% từ 2026–27), 30% đến 135.000, 37% đến 190.000, 45% trên đó. Thêm thuế Medicare 2% (giảm cho thu nhập thấp: miễn đến 28.011, giảm dần đến 35.013 theo mức 2025–26); chưa gồm phụ phí Medicare.',
  levy:function(t){return Math.min(t*.02,Math.max(0,(t-28011)*.1));},allowance:function(){return 18200;},bands:function(y){return [[26800,y>=2026?.15:.16],[116800,.3],[171800,.37],[Infinity,.45]];}},
 SG:{from:2023,name:'Singapore',cur:'SGD',scope:'Biểu cư dân từ năm tính thuế 2024: 0% đến 20.000, rồi 2%, 3,5%, 7%, 11,5%, 15%, 18%, 19%, 19,5%, 20%, 22% đến 500.000, 23% đến 1.000.000, 24% trên đó. Chưa gồm giảm trừ cá nhân; ngưỡng 500.000 và 1.000.000 của hai bậc cao nhất chưa đối chiếu được từ trang nguồn.',
  allowance:function(){return 0;},bands:function(){return [[20000,0],[30000,.02],[40000,.035],[80000,.07],[120000,.115],[160000,.15],[200000,.18],[240000,.19],[280000,.195],[320000,.2],[500000,.22],[1000000,.23],[Infinity,.24]];}},
 CA:{from:2026,name:'Canada (liên bang)',cur:'CAD',scope:'Biểu liên bang 2026: 14% đến 58.523, 20,5% đến 117.045, 26% đến 181.440, 29% đến 258.482, 33% trên đó; tín dụng cá nhân cơ bản 16.452 (giảm dần còn 14.829 ở bậc 29–33%) tính theo 14%. Chưa gồm thuế tỉnh/vùng và đóng góp CPP/EI.',
  allowance:function(){return 0;},bands:function(){return [[58523,.14],[117045,.205],[181440,.26],[258482,.29],[Infinity,.33]];},
  credit:function(g){var bpa=g<=181440?16452:g>=258482?14829:16452-(16452-14829)*(g-181440)/(258482-181440);return bpa*.14;}}
};
function code(l){return H.resCode(l);}
function year(l){return l.birthYear+l.age;}
function state(l){return l.flags.tax879||(l.flags.tax879={history:[]});}
function rate(cc){var c=G.CUR.CUR[cc];return c&&c.rate||1;}
function toLocal(l,v){return v*G.CUR.priceLevel(l.gdp||80)*rate(code(l));}
function fromLocal(l,v){return v/rate(code(l))/G.CUR.priceLevel(l.gdp||80);}
function compute(cc,y,gross){var R=RULES[cc];if(!R||y<R.from)return null;var taxable=Math.max(0,gross-R.allowance(gross)),left=taxable,last=0,tax=0;R.bands(y).forEach(function(b){var part=Math.max(0,Math.min(left,b[0]-last));if(!isFinite(b[0]))part=left;tax+=part*b[1];left-=part;last=b[0];});if(R.credit)tax=Math.max(0,tax-R.credit(gross));var levy=R.levy?R.levy(gross):0;return{gross:gross,taxable:taxable,tax:tax+levy,levy:levy};}
var career=E.careerYear;
E.careerYear=function(l,r,log){var cc=code(l),R=RULES[cc],job=l.job,c=job&&E.jobDef(l),wage=!!c&&(H.isEmployee(l)||E.isStableService(l)||c.id==='quan_ly_gia_dinh139'||E.BUSINESS133&&c.id===E.BUSINESS133.chair),out=career.apply(this,arguments);
 if(!R||l.cur==='vnd'||year(l)<R.from||!wage||!(out>0)||E.FOOTBALL&&E.FOOTBALL.employed(l))return out;
 var s=state(l);if(s.at===l.age)return out;s.at=l.age;var q=compute(cc,year(l),toLocal(l,out));if(!q)return out;var tax=fromLocal(l,q.tax);
 var row={age:l.age,year:year(l),cc:cc,gross:out,taxableLocal:q.taxable,tax:tax,cur:R.cur,rate:out>0?tax/out:0};s.history.push(row);s.history=s.history.slice(-30);
 if(tax>0&&l.alive)log('Thuế thu nhập tiền lương ở '+R.name+' (ước tính): '+H.money(l,tax)+'/năm, khoảng '+Math.round(row.rate*100)+'% thu nhập sau bảo hiểm.','neutral');
 return out-tax;};
var slip=E.ECON918.slip;E.ECON918.slip=function(l){var p=slip.apply(this,arguments),s=l.flags.tax879,row=s&&s.history[s.history.length-1];if(p&&row&&row.age===p.age&&!p.taxed){p.tax=row.tax;p.taxed=true;p.net-=row.tax;p.tax879=true;}return p;};
var convert=E.abroadConvert;E.abroadConvert=function(l,f){var out=convert.apply(this,arguments),s=l.flags.tax879;if(s)s.history.forEach(function(h){h.gross*=f;h.tax*=f;});return out;};
var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments),s=l.flags.tax879,row=s&&s.history[s.history.length-1];if(row&&row.age===l.age&&p.jobInfo&&RULES[code(l)])p.jobInfo.push('Thuế thu nhập tiền lương '+H.money(l,row.tax/12)+'/tháng ('+Math.round(row.rate*100)+'% thu nhập sau bảo hiểm)');return p;};
E.TAX879={RULES:RULES,SRC:SRC,compute:compute,state:state,toLocal:toLocal,fromLocal:fromLocal,verifiedAt:'2026-11-13'};
})(globalThis.G);
