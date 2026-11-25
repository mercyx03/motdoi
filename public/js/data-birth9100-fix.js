/* Một Đời — 9.10.0 làm rõ các sự kiện còn chung chung ("độc lập", "sóng thần") bằng ngày/chi tiết đã được kiểm chứng.
   Chỉ thay khi nước, năm và nguyên văn cũ khớp, nên không ảnh hưởng bản lưu hay dữ liệu khác. */
(function (G) {
  'use strict';
  var D = G.BIRTH987; if (!D || !D.EV) return;
  var IND = { GH: [1957, '6/3'], IN: [1947, '15/8'], PK: [1947, '14/8'], ID: [1945, '17/8'], PH: [1946, '4/7'], MY: [1957, '31/8'], SG: [1965, '9/8'], KE: [1963, '12/12'], TZ: [1961, '9/12'], UG: [1962, '9/10'], NG: [1960, '1/10'], CI: [1960, '7/8'], CM: [1960, '1/1'], MG: [1960, '26/6'], CD: [1960, '30/6'], DZ: [1962, '5/7'], TN: [1956, '20/3'], MA: [1956, '2/3'], SD: [1956, '1/1'], ZM: [1964, '24/10'], MW: [1964, '6/7'], ZW: [1980, '18/4'], MZ: [1975, '25/6'], AO: [1975, '11/11'], NA: [1990, '21/3'], JM: [1962, '6/8'], TT: [1962, '31/8'], HR: [1991, '25/6'], SI: [1991, '25/6'], UA: [1991, '24/8'], BY: [1991, '25/8'], LT: [1990, '11/3'], EE: [1991, '20/8'], KZ: [1991, '16/12'], AM: [1991, '21/9'], AZ: [1991, '18/10'], GE: [1991, '9/4'], MD: [1991, '27/8'], LK: [1948, '4/2'], MM: [1948, '4/1'], KH: [1953, '9/11'], LA: [1953, '22/10'], CY: [1960, '16/8'], MT: [1964, '21/9'], UZ: [1991, '1/9'], TM: [1991, '27/10'], TJ: [1991, '9/9'], KG: [1991, '31/8'] };
  var TEXT = { LK: [2004, 'sóng thần', 'sóng thần Ấn Độ Dương cướp đi hơn ba mươi nghìn sinh mạng ở Sri Lanka'], MV: [2004, 'sóng thần', 'sóng thần Ấn Độ Dương tràn qua nhiều đảo san hô thấp'] };
  D.FIX9100 = { patched: 0 };
  Object.keys(IND).forEach(function (c) { (D.EV[c] || []).forEach(function (e) { if (e[0] === IND[c][0] && e[1] === 'độc lập') { e[1] = 'độc lập ngày ' + IND[c][1]; D.FIX9100.patched++; } }); });
  Object.keys(TEXT).forEach(function (c) { (D.EV[c] || []).forEach(function (e) { if (e[0] === TEXT[c][0] && e[1] === TEXT[c][1]) { e[1] = TEXT[c][2]; D.FIX9100.patched++; } }); });
})(globalThis.G);
