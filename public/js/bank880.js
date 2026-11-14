/* 8.10.80: lãi tiết kiệm và lãi vay theo nước sống, lấy từ số liệu ngân hàng trung ương / cơ quan bảo hiểm tiền gửi.
   Mở rộng life112 (sổ tiết kiệm) và H.addLoan (engine): sổ mới và khoản vay mới ký từ năm số liệu trở đi theo biểu của nước đang sống.
   Khoản vay và sổ đã ký giữ nguyên điều khoản lúc ký; năm trước mốc số liệu và nước chưa có số liệu giữ hành vi cũ.
   Đây là lãi suất bình quân/niêm yết của cả thị trường, không phải biểu của một ngân hàng cụ thể. Singapore chưa có: MAS đã ngừng chuỗi lãi suất ngân hàng. */
(function(G){'use strict';var E=G.E,H=E.H;if(!H||!H.addLoan)return;
// deposit: {kỳ hạn năm: lãi/năm}; loans: lãi/năm theo loại khoản vay của engine. from: năm thế giới đầu tiên áp dụng.
var DATA={
 GB:{from:2026,cur:'GBP',asOf:'2026-09',published:'2026-10-29',
  name:'Tiền gửi có kỳ hạn — lãi bình quân khoản gửi mới (Bank of England)',
  source:'https://www.bankofengland.co.uk/statistics/effective-interest-rates/2026/september-2026',
  deposit:{1:.0442},loans:{home:.0463,bank:.0985},
  note:'Bank of England, Effective interest rates tháng 9/2026: tiền gửi có kỳ hạn mới 4,42%, vay thế chấp mới 4,63%, vay tiêu dùng khác 9,85%.'},
 US:{from:2026,cur:'USD',asOf:'2026-10-19',published:'2026-10-19',
  name:'Chứng chỉ tiền gửi (CD) — lãi bình quân toàn quốc (FDIC)',
  source:'https://www.fdic.gov/national-rates-and-rate-caps',
  loanSource:'https://www.federalreserve.gov/releases/g19/current/default.htm',loanSources:{home:'https://www.freddiemac.com/pmms'},
  deposit:{1:.0176,2:.0155,3:.0139,5:.0141},loans:{home:.0711,bank:.119,car:.0754,card:.2119},
  note:'FDIC National Rates 19/10/2026 (CD 12 tháng 1,76%); Fed G.19 quý 3/2026: vay cá nhân 24 tháng 11,90%, vay mua xe mới 60 tháng 7,54%, thẻ tín dụng 21,19%. Freddie Mac PMMS 12/11/2026: vay mua nhà cố định 30 năm 7,11%.'},
 CA:{from:2026,cur:'CAD',asOf:'2026-11-11',published:'2026-11-11',
  name:'GIC kỳ hạn — lãi niêm yết của các ngân hàng lớn (Bank of Canada)',
  source:'https://www.bankofcanada.ca/rates/banking-and-financial-statistics/posted-interest-rates-offered-by-chartered-banks/',
  deposit:{1:.0245,3:.032,5:.0275},loans:{home:.0619},
  note:'Bank of Canada, lãi niêm yết tuần 11/11/2026: GIC 1 năm 2,45%, 3 năm 3,20%, 5 năm 2,75%; vay thế chấp thông thường 5 năm 6,19% (lãi niêm yết, người vay thường được giảm).'},
 AU:{from:2026,cur:'AUD',asOf:'2026-10',published:'2026-11-06',
  name:'Tiền gửi có kỳ hạn ngân hàng — lãi tham chiếu khoản 10.000 AUD (RBA)',
  source:'https://www.rba.gov.au/statistics/tables/csv/f4-data.csv',
  loanSource:'https://www.rba.gov.au/statistics/tables/csv/f6-data.csv',
  deposit:{1:.05,3:.042},loans:{home:.062,card:.2174},
  note:'RBA bảng F4 tháng 10/2026: tiền gửi kỳ hạn 1 năm 5,00%, 3 năm 4,20%; F6 tháng 9/2026: vay mua nhà để ở lãi thả nổi khoản mới bình quân 6,2%; F5: thẻ tín dụng chuẩn 21,74%.'}
};
function code(l){return H.resCode(l);}
function year(l){return l.birthYear+l.age;}
function data(l){var d=DATA[code(l)];return d&&year(l)>=d.from?d:null;}
function offers(l){var d=data(l);if(!d)return [];return [{k:'avg880-'+code(l),n:d.name,online:false,currency:d.cur,asOf:d.asOf,source:d.source,rates:d.deposit,market880:true}];}
function loanRate(l,type){var d=data(l);return d&&d.loans[type]!=null?d.loans[type]:null;}
function note(l){var d=data(l);return d?'Lãi tham chiếu nơi đang sống: '+d.note:'';}
// Khoản vay mới nhận lãi của nơi đang sống; ghi nguồn vào hợp đồng để không đổi khi chuyển nước hay khi biểu cập nhật.
var add=H.addLoan;H.addLoan=function(l,type){var n=(l.loans||[]).length,out=add.apply(this,arguments),rate=loanRate(l,type),d=data(l),L=l.loans&&l.loans.length>n?l.loans[l.loans.length-1]:null;
 if(L&&L.type===type&&rate!=null){L.rate=rate;L.ref880={cc:code(l),asOf:d.asOf,source:(d.loanSources&&d.loanSources[type])||d.loanSource||d.source,year:year(l)};}
 return out;};
E.BANK880={DATA:DATA,data:data,offers:offers,loanRate:loanRate,note:note,verifiedAt:'2026-11-14'};
})(globalThis.G);
