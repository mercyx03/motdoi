/* Mở rộng study829: hồ sơ học tại nhà và lựa chọn England. Quy tắc là ảnh chụp 2026;
   các mức tiến độ, thời gian, chi phí và điểm thi là mô phỏng, không phải tư vấn pháp lý. */
(function(G){
  'use strict';
  var E=G.E,H=E.H,X=E.UPDATE110,M=E.MOCK_EXAM853;
  var UNKNOWN='Chưa có dữ liệu cho khu vực này';
  var SUBJECT_NAME={math:'Toán',lit:'Ngôn ngữ / Văn học',english:'Tiếng Anh',science:'Khoa học',humanities:'Nhân văn'};
  var STATUS={completed:'Đã hoàn thành lộ trình',school:'Học qua trường',draft:'Đang chuẩn bị',needsInfo:'Cần bổ sung',pending:'Chờ xét hồ sơ',approved:'Đã hoàn tất thủ tục',active:'Đang học tại nhà',reviewResidence:'Cần đối chiếu nơi cư trú mới'};
  var LABEL={allowed:'Được phép',notice:'Cần thông báo',registration:'Cần đăng ký / miễn học tại trường',approval:'Cần phê duyệt trước',special:'Chỉ lộ trình đặc biệt',unknown:UNKNOWN};
  var REGIONS={
    US:'AL:Alabama|AK:Alaska|AZ:Arizona|AR:Arkansas|CA:California|CO:Colorado|CT:Connecticut|DE:Delaware|DC:District of Columbia|FL:Florida|GA:Georgia|HI:Hawaii|ID:Idaho|IL:Illinois|IN:Indiana|IA:Iowa|KS:Kansas|KY:Kentucky|LA:Louisiana|ME:Maine|MD:Maryland|MA:Massachusetts|MI:Michigan|MN:Minnesota|MS:Mississippi|MO:Missouri|MT:Montana|NE:Nebraska|NV:Nevada|NH:New Hampshire|NJ:New Jersey|NM:New Mexico|NY:New York|NC:North Carolina|ND:North Dakota|OH:Ohio|OK:Oklahoma|OR:Oregon|PA:Pennsylvania|RI:Rhode Island|SC:South Carolina|SD:South Dakota|TN:Tennessee|TX:Texas|UT:Utah|VT:Vermont|VA:Virginia|WA:Washington|WV:West Virginia|WI:Wisconsin|WY:Wyoming',
    CA:'AB:Alberta|BC:British Columbia|MB:Manitoba|NB:New Brunswick|NL:Newfoundland and Labrador|NS:Nova Scotia|NT:Northwest Territories|NU:Nunavut|ON:Ontario|PE:Prince Edward Island|QC:Quebec|SK:Saskatchewan|YT:Yukon',
    AU:'ACT:Australian Capital Territory|NSW:New South Wales|NT:Northern Territory|QLD:Queensland|SA:South Australia|TAS:Tasmania|VIC:Victoria|WA:Western Australia',
    GB:'England:England|Scotland:Scotland|Wales:Wales|Northern Ireland:Northern Ireland'
  };
  Object.keys(REGIONS).forEach(function(c){REGIONS[c]=REGIONS[c].split('|').map(function(v){var p=v.split(':');return {id:p[0],name:p[1]};});});
  var SOURCES={
    england:'https://www.gov.uk/home-education',
    curriculum:'https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4/the-national-curriculum-in-england-framework-for-key-stages-1-to-4',
    languages:'https://www.gov.uk/government/publications/national-curriculum-in-england-languages-progammes-of-study',
    tx:'https://tea2.tea.texas.gov/families-and-students/finding-school-your-child/home-schooling',
    ok:'https://oklahoma.gov/education/services/school-choice/home-school.html',
    id:'https://www.sde.idaho.gov/about-us/departments/school-choice/home-school/',
    nj:'https://www.nj.gov/education/safety/nontraditional/faq_homeschool.shtml',
    mi:'https://www.michigan.gov/mde/services/flexible-learning/options/nonpub-home/home-school-information/exemption-f-home-school',
    ia:'https://educate.iowa.gov/pk-12/educational-choice/homeschooling',
    ca:'https://www.cde.ca.gov/sp/ps/homeschool.asp',
    ny:'https://www.nysed.gov/nonpublic-schools/home-instruction-questions-and-answers',
    ma:'https://www.doe.mass.edu/homeschool/',
    ri:'https://ride.ri.gov/students-families/education-programs/home-schooling',
    vt:'https://education.vermont.gov/schools/school-operations/home-study',
    nz:'https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/home-education/apply-home-educate-your-child',
    nzAid:'https://www.education.govt.nz/parents-and-caregivers/schools-year-0-13/home-education/allowances-families-who-homeschool',
    exams:'https://www.jcq.org.uk/private-candidates/',
    french:'https://www.aqa.org.uk/subjects/french/gcse/french-8652',
    german:'https://www.aqa.org.uk/subjects/german/gcse/german-8662',
    spanish:'https://www.aqa.org.uk/subjects/spanish/gcse/spanish-8692',
    ak:'https://frontier.asdk12.org/about-us/faqs',
    pa:'https://www.legis.state.pa.us/WU01/LI/LI/US/HTM/1949/0/0014.013.000.027.001..HTM',
    scotland:'https://education.gov.scot/parentzone/my-school/choosing-a-school/home-education',
    wales:'https://www.gov.wales/home-education-handbook-home-educators-html',
    ab:'https://www.alberta.ca/home-education',
    sk:'https://www.saskatchewan.ca/Residents/Education-and-Learning/PreK-12-Education-Early-Learning-and-Schools/Home-Schooling',
    nsw:'https://www.nsw.gov.au/education-and-training/home-schooling/registration-guidelines/registration-at-a-glance',
    vic:'https://www2.vrqa.vic.gov.au/register-home-educate',
    ie:'https://www.tusla.ie/services/family-community-support/alternative-education-assessment-and-registration-service/home-education/',
    za:'https://www.education.gov.za/Programmes/HomeEducation.aspx'
  };
  var RULES={};
  function add(key,mode,source,note,extra){RULES[key]=Object.assign({key:key,mode:mode,source:SOURCES[source],checkedAt:'2026-11-09',snapshotFrom:2026,legalEffectiveAt:null,scope:key,oversight:mode==='approval'?'giám sát chặt':mode==='allowed'?'ít thủ tục':'có theo dõi',withdrawal:note,teacher:'Phụ huynh / người giám hộ; điều kiện riêng theo hình thức',curriculum:'Giáo dục phù hợp; lưu kế hoạch và bài làm',schedule:'Lịch toàn thời gian phù hợp; không gán số giờ chưa xác minh',reports:[],assessment:'Theo yêu cầu của lộ trình / cơ sở tiếp nhận',aid:null,records:['kế hoạch','bài làm','học bạ'],routes:[{id:'family',name:'Gia đình tự tổ chức',mode:mode}]},extra||{});}
  add('GB:England','notice','england','Thông báo rút hoàn toàn khỏi trường; trường chuyên biệt do chính quyền sắp xếp hoặc school attendance order cần phép hội đồng.',{ages:[5,16],participationUntil:18,curriculum:'Giáo dục phù hợp toàn thời gian; không bắt buộc chương trình quốc gia. Sau tuổi rời trường còn nghĩa vụ giáo dục / đào tạo tới 18: https://www.gov.uk/know-when-you-can-leave-school',routes:[{id:'family',name:'Gia đình tự tổ chức',mode:'notice'},{id:'tutor',name:'Gia đình thuê gia sư',mode:'notice'}]});
  add('US:TX','allowed','tx','Không đăng ký hoặc xin duyệt TEA; rút tên ở trường cũ và giữ bằng chứng học.',{curriculum:'Dạy thực chất bằng tài liệu: đọc, viết chính tả, ngữ pháp, toán, công dân tốt',familyDiploma:true});
  add('US:OK','allowed','ok','Không bắt buộc đăng ký/duyệt; thư báo cho trường là khuyến nghị, không biến thành điều kiện luật định.',{ages:[5,18]});
  add('US:ID','allowed','id','Không có thủ tục đăng ký; gia đình chịu chi phí và chọn chương trình.');
  add('US:NJ','allowed','nj','Giáo dục tương đương ngoài trường; cơ sở nhận xét xếp lớp và tín chỉ.',{ages:[6,16]});
  add('US:MI','allowed','mi','Chỉ xét exemption (f); không gộp với nonpublic school hoặc dịch vụ giáo dục đặc biệt.',{curriculum:'Chương trình có tổ chức: đọc, chính tả, toán, khoa học, lịch sử, công dân, văn học, viết, ngữ pháp Anh',teacher:'Cha mẹ / giám hộ theo exemption (f)'});
  add('US:CA','notice','ca','Trường tư tại nhà nộp Private School Affidavit; affidavit không phải chứng nhận hay kiểm định.',{ages:[6,18],reports:['hồ sơ chuyên cần'],routes:[{id:'family',name:'Trường tư tại nhà độc lập — PSA',mode:'notice'},{id:'privateOnline',name:'Trường tư trực tuyến nhận học sinh',mode:'registration'},{id:'publicIndependent',name:'Independent study qua trường công / charter',mode:'approval',schoolManaged:true,resources:true},{id:'credentialTutor',name:'Gia sư có credential California',mode:'registration',credential:true}],teacher:'Hình thức private school: người có khả năng dạy; hình thức tutor cần credential đúng cấp',records:['affidavit','chuyên cần','môn học','hồ sơ người dạy']});
  add('US:NY','notice','ny','Letter of intent, IHIP để học khu kiểm tra tuân thủ; không coi IHIP là giấy phép tùy ý.',{reports:['báo cáo quý 1','báo cáo quý 2','báo cáo quý 3','báo cáo quý 4','đánh giá cuối năm'],curriculum:'Môn theo cấp trong 100.10; IHIP ghi tài liệu và lịch báo cáo',schedule:'180 ngày; lớp 1–6: 900 giờ/năm, lớp 7–12: 990 giờ/năm',oversight:'giám sát chặt',records:['IHIP','chuyên cần','báo cáo quý','đánh giá']});
  add('US:MA','approval','ma','Học khu nơi cư trú duyệt trước; thông báo chưa cho phép nghỉ trường.',{ages:[6,16],reports:['đánh giá theo thỏa thuận học khu']});
  add('US:RI','approval','ri','School committee địa phương duyệt trước; thống nhất cách đánh giá.',{reports:['chuyên cần','báo cáo theo học khu'],assessment:'Phương pháp và địa điểm đánh giá theo thỏa thuận'});
  add('US:VT','registration','vt','Chờ xác nhận Home Study enrollment rồi mới rút khỏi trường; không cấp bằng từ bang.',{ages:[6,16],reports:['annual notice'],records:['notice','bằng chứng đầu vào','tiến độ']});
  add('NZ:*','registration','nz','Mỗi trẻ có Certificate of Exemption trước khi bắt đầu; mọi giám hộ phải đồng ý.',{ages:[6,16],reports:['statutory declaration kỳ 1','statutory declaration kỳ 2'],curriculum:'Học tốt và đều đặn tương đương trường; Te Kura là trường từ xa riêng',aid:{source:SOURCES.nzAid,currency:'NZD',halfYear:[398,338.5,278.5,199],untilYearAge:19},routes:[{id:'family',name:'Gia đình học với Certificate of Exemption',mode:'registration'}]});
  add('US:AK','allowed','ak','Homeschool độc lập tách khỏi correspondence qua học khu; không gán hỗ trợ của correspondence cho gia đình độc lập.');
  add('US:PA','notice','pa','Supervisor nộp affidavit và kế hoạch; phải có bằng trung học hoặc tương đương, kiểm tra điều kiện pháp lý khác.',{teacher:'Supervisor có bằng trung học / tương đương; evaluator đủ điều kiện riêng',reports:['portfolio và đánh giá cuối năm'],schedule:'180 ngày HOẶC 900 giờ tiểu học / 990 giờ trung học',oversight:'giám sát chặt',records:['affidavit','portfolio','đánh giá'],routes:[{id:'family',name:'Home education program — supervisor đủ điều kiện',mode:'notice',credential:true}]});
  add('US:IA','allowed','ia','Chọn đúng CPI hoặc IPI; không gán yêu cầu 148 ngày của CPI cho mọi hình thức.',{routes:[{id:'ipi',name:'IPI — báo thông tin khi được yêu cầu, chương trình theo luật',mode:'allowed'},{id:'cpiTeacher',name:'CPI option 1 — giáo viên có license giám sát',mode:'registration',credential:true},{id:'cpiParent',name:'CPI option 2 — phụ huynh; điều kiện theo dịch vụ đăng ký',mode:'registration'}],schedule:'CPI: ít nhất 148 ngày, 37 ngày/quý; IPI dùng điều kiện riêng',reports:['đối chiếu nghĩa vụ đúng CPI / IPI đã chọn']});
  add('GB:Scotland','approval','scotland','Rút khỏi state school cần đồng ý của chính quyền; chưa từng đi state school có ngoại lệ cần đối chiếu.',{routes:[{id:'family',name:'Rút khỏi state school để học tại nhà',mode:'approval'}],curriculum:'Chương trình phù hợp Scotland; không áp đặt GCSE / Key Stage England'});
  add('GB:Wales','notice','wales','Thông báo cho trường; ngoại lệ trường chuyên biệt / attendance order phải xét riêng.',{curriculum:'Giáo dục phù hợp Wales, không dùng chương trình England',routes:[{id:'family',name:'Elective home education Wales',mode:'notice'}]});
  add('CA:AB','notice','ab','Hai hình thức: supervised qua school authority tiếp nhận, hoặc notification-only không nhận funding.',{routes:[{id:'family',name:'Notification-only — không funding',mode:'notice'},{id:'supervised',name:'Supervised — trường tiếp nhận và hai đánh giá/năm',mode:'registration',resources:true}],reports:['thông báo hàng năm'],assessment:'Supervised: ít nhất hai đánh giá chính thức/năm',aidNote:'Supervised: 50% grant cho cha mẹ, cần tiếp nhận trước 30/9 và chứng từ hợp lệ. Chưa xác minh số tiền theo năm nên chưa chi; notification-only không funding.'});
  add('CA:SK','registration','sk','School division nơi cư trú đăng ký; gửi notification và written education plan.',{reports:['kế hoạch năm học','hồ sơ đánh giá tiến độ'],aidNote:'Hỗ trợ tài nguyên tùy school division; chưa có mức tiền toàn tỉnh được xác minh nên không tự cấp tiền.'});
  add('AU:NSW','registration','nsw','Đăng ký với NSW Department of Education (từ 6/5/2025); kiểm chương trình và không gian học trước khi bắt đầu.',{ages:[6,17],curriculum:'Chương trình NSW / NESA; lưu cách thực hiện và tiến độ',reports:['hồ sơ chương trình và tiến độ'],credentialNote:'Không tự cấp HSC từ homeschool. HSC cần provider và đánh giá của chương trình phù hợp; distance education là học qua trường riêng.'});
  add('AU:VIC','registration','vic','Nộp learning plan và chờ VRQA đăng ký; distance education thuộc registered provider riêng.',{ages:[6,17],credentialNote:'Muốn Senior Secondary qualification phải chuyển sang provider đủ điều kiện và hủy đăng ký homeschool; không tự cấp VCE.'});
  add('IE:*','registration','ie','Tusla AEARS đánh giá mức giáo dục tối thiểu trước khi ghi vào sổ đăng ký.',{reports:['đánh giá giáo dục tối thiểu'],credentialNote:'Leaving Certificate: cần cơ quan khảo thí / trung tâm tiếp nhận và phần coursework; chưa xác minh danh mục nên chưa mở dự thi.'});
  add('ZA:*','registration','za','Nộp hồ sơ HOD cấp tỉnh; nộp đơn chưa có nghĩa đã đăng ký.',{reports:['đánh giá tiến độ','đánh giá cuối cấp bởi assessor phù hợp'],legalEffectiveAt:'2024-12-24',effectiveSource:'https://www.education.gov.za/Portals/0/Media/Parliamentary%20Questions/2025/WQ%20657%20NA.pdf?ver=2025-06-12-144125-950',credentialNote:'NSC cần provider, SBA, thực hành và thi đủ điều kiện. Cambridge/GED không tự cho quyền đại học; cần công nhận và miễn trừ theo cơ sở, chưa xác minh nên chưa mở.'});
  function peek(l){return l.flags&&l.flags.study829||{};}
  function state(l){return l.flags.study829||(l.flags.study829={});}
  function hs(l,create){var s=create?state(l):peek(l);return s.home||(create?(s.home={version:1,status:'school',history:[],subjects:{},obligations:{},aidClaims:{}}):null);}
  function year(l){return l.birthYear+l.age;}
  function region(l){
    var c=H.resCode(l),explicit=l.abroad?l.abroad.educationRegion:l.educationRegion;
    var place=l.abroad?(l.abroad.city||''):[l.city,l.province,l.state,l.prov&&l.prov.old].filter(Boolean).join(' ');
    var list=REGIONS[c]||[],found=list.find(function(x){return explicit===x.id||explicit===x.name;});
    if(found)return found.id;
    found=list.find(function(x){return new RegExp('(^|[^A-Za-z])'+x.name+'([^A-Za-z]|$)','i').test(place);});
    if(found)return found.id;
    var actualCity=l.abroad?l.abroad.city:l.city;
    if(c==='US'&&E.WORLD836&&E.WORLD836.places[actualCity])return E.WORLD836.places[actualCity][0];
    var cities={US:{Houston:'TX',Dallas:'TX',Austin:'TX','Los Angeles':'CA','San Francisco':'CA','New York':'NY',Boston:'MA'},GB:{London:'England',Manchester:'England',Birmingham:'England',Liverpool:'England',Leeds:'England',Bristol:'England',Glasgow:'Scotland',Edinburgh:'Scotland',Cardiff:'Wales',Belfast:'Northern Ireland'},CA:{Calgary:'AB',Edmonton:'AB',Regina:'SK',Saskatoon:'SK','Moose Jaw':'SK',Vancouver:'BC',Victoria:'BC',Winnipeg:'MB',Fredericton:'NB',Moncton:'NB',"St. John's":'NL',Halifax:'NS',Yellowknife:'NT',Iqaluit:'NU',Toronto:'ON',Ottawa:'ON',Charlottetown:'PE',Montréal:'QC',Montreal:'QC',Québec:'QC','Quebec City':'QC',Whitehorse:'YT'},AU:{Sydney:'NSW',Melbourne:'VIC',Canberra:'ACT',Darwin:'NT',Brisbane:'QLD',Adelaide:'SA',Hobart:'TAS',Perth:'WA'}};
    var map=cities[c]||{};return Object.keys(map).reduce(function(v,k){return v||(place.indexOf(k)>=0?map[k]:'');},'');
  }
  function rule(l){var c=H.resCode(l),key=c+':'+(region(l)||'*'),a=RULES[key]||RULES[c+':*'];
    if(!a||year(l)<a.snapshotFrom)return {key:key,mode:c==='VN'?'special':'unknown',routes:[],withdrawal:c==='VN'?'Giữ học chính quy; học bổ trợ tại nhà và trực tuyến qua trường không tự thay thế việc nhập học.':UNKNOWN,source:null,reports:[],records:[]};
    return a;
  }
  function active(l){var s=hs(l);return !!(s&&s.status==='active'&&s.key===rule(l).key&&rule(l).mode!=='unknown');}
  function history(l,s,event){s.history.push({year:year(l),age:l.age,key:s.key,event:event});}
  function route(l,id){return rule(l).routes.find(function(x){return x.id===id;});}
  function prerequisites(l,s){var a=rule(l),v=route(l,s.route),missing=[];
    if(!v)return [UNKNOWN];
    if(!s.documents)missing.push('hồ sơ rút trường / thông báo / đăng ký');
    if(!s.plan)missing.push('kế hoạch, người dạy, lịch học và hồ sơ lưu');
    if(!s.consulted)missing.push('ý kiến học sinh và đồng thuận giám hộ');
    if(v.credential&&!s.credential)missing.push('credential đúng cấp của người dạy');
    if(a.mode==='unknown')missing.push(UNKNOWN);return missing;
  }
  function request(l,id,motive){var a=rule(l),v=route(l,id),s=hs(l,true);
    if(!v||l.age<5||l.age>19||['active','pending'].includes(s.status)||a.ages&&l.age<a.ages[0])return false;
    s.key=a.key;s.route=id;s.motive=motive||'nhịp học';s.status='draft';s.documents=false;s.plan=false;s.consulted=false;s.credential=false;s.submittedAt=null;
    history(l,s,'Chuẩn bị '+v.name+'; lý do: '+s.motive);return true;
  }
  function submit(l){var s=hs(l),v=s&&route(l,s.route);if(!s||!v||s.status!=='draft'||s.key!==rule(l).key)return false;
    if(prerequisites(l,s).length){s.status='needsInfo';history(l,s,'Cần bổ sung hồ sơ');return false;}
    var needs=['approval','registration'].includes(v.mode)||H.resCode(l)==='GB'&&(peek(l).specialSchool||peek(l).attendanceOrder);
    s.status=needs?'pending':'approved';s.submittedAt=year(l);history(l,s,needs?'Chờ cơ quan / trường tiếp nhận xét hồ sơ':'Đã hoàn tất thủ tục thông báo');return true;
  }
  function review(l){var s=hs(l);if(!s||s.status!=='pending'||s.key!==rule(l).key||year(l)<=s.submittedAt)return false;
    s.status=prerequisites(l,s).length?'needsInfo':'approved';history(l,s,s.status==='approved'?'Hồ sơ được duyệt':'Cần bổ sung');return true;
  }
  function start(l){var s=hs(l);if(!s||s.status!=='approved'||s.key!==rule(l).key)return false;
    s.previous={school:l.school,schoolEnd:l.schoolEnd};s.status='active';s.started=year(l);s.schoolManaged=!!route(l,s.route).schoolManaged;
    s.resources=route(l,s.route).resources?{textbooks:true,device:s.schoolManaged,access:'Theo chương trình đủ điều kiện đã tiếp nhận; không phải trợ cấp tiền mặt'}:null;
    if(!s.schoolManaged){l.school=l.age<11?'primary':l.age<16?'lower':'upper';l.schoolEnd=null;}
    if(E.EDUCATION863)E.EDUCATION863.startDate(l);history(l,s,'Bắt đầu học tại nhà');return true;
  }
  function reconcile(l){var s=hs(l);if(!s||s.status==='school'||s.key===rule(l).key)return;
    s.status='reviewResidence';history(l,s,'Đổi nơi cư trú: giữ học bạ, cần thủ tục và công nhận tại nơi mới');
  }
  function back(l,type){var s=hs(l);if(!s||s.status==='school')return false;
    history(l,s,'Xin vào '+type+'; trường nhận xét xếp lớp và phần cần bổ sung');s.status='school';s.reentry={type:type,year:year(l),recognition:'Chờ trường nhận đối chiếu học bạ; chưa tự chuyển tín chỉ'};
    if(E.EDUCATION863)E.EDUCATION863.recognition(l);l.school=l.age<11?'primary':l.age<16?'lower':type==='private'?'priv':'upper';l.schoolEnd=l.age>=16?Math.max(l.age+1,18):null;
    var childhood=l.flags.life138;if(childhood){childhood.environment=type;childhood.current=null;childhood.schoolSerial=(childhood.schoolSerial||0)+1;}return true;
  }
  function obligations(l){var a=rule(l),s=hs(l),v=s&&route(l,s.route);if(v&&v.reports)return v.reports;
    if(a.key==='CA:AB'&&s&&s.route==='supervised')return ['thông báo hàng năm','đánh giá chính thức 1','đánh giá chính thức 2'];return a.reports||[];}

  // Dated submissions are stored alongside the original yearly checklist.
  function reportingDate873(l) {
    var date=l.educationDate863;
    return /^\d{4}-\d{2}-\d{2}$/.test(date||'') && Number(date.slice(0,4))===year(l) ? date : null;
  }
  function reportingDeadline873(l,id,period) {
    var info=rule(l).calendar873, range=info&&info.reports[id];
    if(!range)return null;
    return {opens:(period+range[0])+'-'+range[1],due:(period+range[2])+'-'+range[3]};
  }
  function reportTiming873(l,id,period,submittedOn) {
    var date=submittedOn||reportingDate873(l), deadline=reportingDeadline873(l,id,period);
    if(!deadline||!date)return 'undated';
    if(date<deadline.opens)return 'early';
    return date>deadline.due?'late':'on-time';
  }
  function logObligation(l,id,forYear,submittedOn){var s=hs(l),at=forYear==null?year(l):forYear;if(!active(l)||!obligations(l).includes(id)||!Number.isInteger(at)||at>year(l)||at<s.started)return false;var k=at+':'+id;if(s.obligations[k])return false;if(submittedOn&&(!/^\d{4}-\d{2}-\d{2}$/.test(submittedOn)||!submittedOn.startsWith(year(l)+'-')||!Number.isFinite(Date.parse(submittedOn))||new Date(submittedOn).toISOString().slice(0,10)!==submittedOn))return false;var timing=reportTiming873(l,id,at,submittedOn);if(timing==='early')return false;s.obligations[k]=true;if(reportingDeadline873(l,id,at)){var filed=s.filings873||(s.filings873={});filed[k]={date:submittedOn||reportingDate873(l),timing:timing,deadline:reportingDeadline873(l,id,at).due};}history(l,s,'Nộp '+id+' cho năm '+at+(timing==='late'?' · nộp sau hạn':timing==='undated'?' · chưa ghi ngày nộp':''));return true;}
  function study(l,subject,mode,log){var s=hs(l);if(!active(l)||s.schoolManaged||!['math','lit','english','science','humanities'].includes(subject))return false;
    if(s.practiceYear!==year(l)){s.practiceYear=year(l);s.blocks=0;s.tutorHours=0;}
    var maxBlocks=l.flags.educationVersion863?6:3,maxHours=l.flags.educationVersion863?24:12;if(s.blocks>=maxBlocks)return false;
    var tutor=mode==='tutor',summer=mode==='summer',ratio=tutor?.06:summer?.02:0,fee=l.base*ratio;
    var energy=l.st.hea==null?50:l.st.hea,hours=tutor?2:summer?6:4;if(E.EDUCATION863&&!E.EDUCATION863.canTeach(l,hours))return false;
    if(energy<25||s.tutorHours+hours>maxHours)return false;
    if(l.kid){if(l.money<fee)return false;H.cash(l,-fee,'Tài liệu và học tập tại nhà');}
    else if(fee&&!E.LIFE138.fund(l,ratio,'Học tại nhà',function(){return .5;},log||function(){}))return false;
    s.blocks++;s.tutorHours+=hours;if(E.EDUCATION863){E.EDUCATION863.taught(l,hours);E.EDUCATION863.spent(l,fee,tutor?'tuition':'materials');}
    var old=s.subjects[subject]||0,gain=(tutor?16:summer?14:12)*(0.5+(l.st.kno||50)/100)*(1-old/140)*(energy<50?.7:1);
    s.subjects[subject]=Math.min(100,old+gain);H.fx(l,{kno:1,hea:summer?-2:0});
    var m=M.mockExamState853(l);m.specificV2=m.specificV2||{};m.specificV2.uni=m.specificV2.uni||{};m.specificV2.uni[subject]=Math.max(m.specificV2.uni[subject]||0,s.subjects[subject]/100);
    history(l,s,'Học '+SUBJECT_NAME[subject]+' bằng '+mode+'; '+Math.round(s.subjects[subject])+'/100');if(log)log('Tiến độ '+SUBJECT_NAME[subject]+': '+Math.round(s.subjects[subject])+'/100. Môn khác giữ tiến độ; còn '+(maxBlocks-s.blocks)+' đợt năm nay.','good');return true;
  }
  function milestones(l){var s=hs(l)||{},a=rule(l),subjects=s.subjects||{},complete=['math','lit','english','science','humanities'].every(function(k){return subjects[k]>=80;});
    var certificate=!!s.diploma,missing=[];
    if(!complete)missing.push('Hoàn thành từng môn trong kế hoạch học tập');
    if(!certificate)missing.push('Văn bằng / kết quả thi và học bạ được cơ sở tiếp nhận công nhận');
    if(!s.receivingOffer)missing.push('Yêu cầu riêng của cơ sở đại học / cao đẳng chưa được xác minh');
    var result={programComplete:complete,compulsoryEnded:a.ages?l.age>=Math.max(a.ages[1],a.participationUntil||0):null,credentialEligible:complete&&!!a.familyDiploma,credentialReceived:certificate,admissionEligible:complete&&certificate&&!!s.receivingOffer,missing:missing};return E.EDUCATION863?E.EDUCATION863.extendMilestones(l,result):result;
  }
  function diploma(l){var s=hs(l),m=milestones(l);if(!active(l)||!m.credentialEligible||s.diploma)return false;s.diploma={type:'family',name:'Homeschool diploma do gia đình cấp',year:year(l),transcript:Object.assign({},s.subjects)};history(l,s,'Gia đình cấp diploma; không phải bằng trường hay GED');return true;}
  function claim(l,period,ordinal){if(E.EDUCATION863)return E.EDUCATION863.nzClaim(l,period,ordinal);var s=hs(l),a=rule(l),aid=a.aid;if(!active(l)||!aid||l.age>aid.untilYearAge||![1,2].includes(period))return false;
    var id=year(l)+':'+period;if(s.aidClaims[id]||!s.obligations[year(l)+':statutory declaration kỳ '+period]||s.started>=year(l))return false;
    var amount=aid.halfYear[Math.min(3,Math.max(0,ordinal||0))];s.aidClaims[id]={currency:'NZD',amount:amount,year:year(l)};
    // Bộ máy tiền chung quy đổi NZD theo base; không giả định tiền đang dùng là NZD.
    var credit=E.WORLD836.usd(l,amount/G.CUR.CUR.NZ.rate);H.cash(l,credit,'Home Education Supervision Allowance kỳ '+period);s.aidClaims[id].credited=credit;
    history(l,s,'Nhận '+amount+' NZD kỳ '+period+'; quy đổi theo đơn vị tiền hiện tại');return true;
  }
  function report(l){var a=rule(l),s=hs(l),m=milestones(l);return [a.key+' · '+LABEL[a.mode],a.withdrawal,a.source?'Nguồn chính thức: '+a.source+' · đối chiếu '+a.checkedAt+'; áp dụng ảnh chụp từ '+a.snapshotFrom:'',a.curriculum||'',a.schedule||'',a.teacher||'',a.assessment||'',a.aidNote||'',a.credentialNote||'',a.records.length?'Hồ sơ giữ: '+a.records.join(', '):'',a.oversight?'Thủ tục: '+a.oversight:'',s?'Hồ sơ: '+(STATUS[s.status]||s.status)+' · '+(s.motive||''):'Chưa lập hồ sơ học tại nhà.',s&&s.resources?'Tài nguyên chương trình: '+s.resources.access:'',s&&s.key!==a.key?'Nơi cư trú đã đổi: cần đối chiếu lại, chưa được tiếp tục theo quy tắc nơi cũ.':'',s?'Tiến độ: '+Object.keys(s.subjects).map(function(k){return (SUBJECT_NAME[k]||k)+' '+Math.round(s.subjects[k])+'/100';}).join(' · '):'',s?'Hoàn thành chương trình: '+(m.programComplete?'Có':'Chưa')+' · Hết nghĩa vụ: '+(m.compulsoryEnded==null?'Chưa đủ dữ liệu':m.compulsoryEnded?'Có':'Chưa')+' · Văn bằng: '+(m.credentialReceived?'Đã nhận':'Chưa')+' · Nộp đại học: '+(m.admissionEligible?'Đủ điều kiện đã biết':'Còn yêu cầu'):'',m.missing.join('; '),'Trường chính quy có giáo viên, học nhóm và cơ sở vật chất; học tại nhà cần thời gian người dạy và chủ động kết nối cộng đồng.'].filter(Boolean).join('\n');}

  function child(l,id,create){var k=(l.kids||[]).find(function(k){return k.uid110===id&&k.alive!==false;});if(!k||!E.FAM920||!E.FAM920.present(l,k,{withPartner:!!l.partner}))return null;
    if(create&&!k.study829)k.study829={};
    var home=k.study829&&k.study829.home,oldSchool=home&&home.childSchool||{school:'lower',schoolEnd:null};
    var out={id:k.uid110,name:k.name,age:l.age-k.born,birthYear:l.birthYear+k.born,country:H.resCode(l),educationRegion:l.abroad?l.abroad.educationRegion:l.educationRegion,city:l.abroad?l.abroad.city:l.city,province:l.province,state:l.state,flags:{study829:k.study829||{},mockExam853:k.mockExam853,educationVersion863:l.flags.educationVersion863},st:{kno:k.study||50,hea:70},money:l.money,base:l.base,cur:l.cur,gdp:l.gdp,school:oldSchool.school,schoolEnd:oldSchool.schoolEnd,alive:true,mode:l.mode,kid:k,aidOrdinal:(l.kids||[]).filter(function(x){return x.alive!==false&&x.study829&&x.study829.home&&x.study829.home.status==='active';}).sort(function(a,b){return a.born-b.born;}).indexOf(k)};Object.defineProperty(out,'guardian863',{value:l,enumerable:false});out.educationDivision=l.educationDivision;out.educationDate863=l.educationDate863;out.edu=k.edu||0;return out;
  }
  function target(l,arg,create){return arg&&arg.kid?child(l,arg.kid,create):l;}
  function valid(l){return l.alive&&!(l.jailUntil>l.age)&&(l.age>=5&&l.age<=19||(l.kids||[]).some(function(k){return k.alive!==false&&l.age-k.born>=5&&l.age-k.born<=19;}))?true:'Dành cho học sinh hoặc giám hộ có con tuổi đi học';}
  var MOTIVES=['nhịp học chưa phù hợp','bạo lực học đường','hỗ trợ học tập / khuyết tật','gia đình di chuyển','thể thao / nghệ thuật','giá trị gia đình','sở thích học sinh'];
  X.menu('homeschool857','Học tại nhà: quy định, hồ sơ và tiến độ',valid,function(l,d){var t=target(l,d.arg);return t?report(t):'Con cần sống cùng giám hộ để lập hồ sơ tại nơi cư trú này.';},function(l,arg){
    var t=target(l,arg),out=[];if(!t)return out;
    if(!arg.kid)(l.kids||[]).filter(function(k){return k.alive!==false&&l.age-k.born>=5&&l.age-k.born<=19;}).forEach(function(k){out.push({k:'kid:'+X.uid(l,k),l:'Giáo dục con: '+k.name,run:function(l,r){X.next(l,'homeschool857',r,{kid:k.uid110});}});});
    if(t.age<5||t.age>19)return out;
    var a=rule(t),s=hs(t),base=arg.kid?{kid:arg.kid}:{};
    function action(k,label,fn,why){out.push({k:k,l:label,why:why||true,run:function(l,r,log){var z=target(l,base,true);if(!z)return;reconcile(z);fn(z,log);if(z.kid){z.kid.study829=z.flags.study829;z.kid.study=z.st.kno;z.kid.mockExam853=z.flags.mockExam853;var h=hs(z);if(h)h.childSchool={school:z.school,schoolEnd:z.schoolEnd};H.cash(l,z.money-l.money,'Giáo dục tại nhà cho '+z.name);}X.next(l,'homeschool857',r,base);}});}
    if(arg.filing873&&active(t)){
      var filing=arg.filing873, deadline=reportingDeadline873(t,filing.id,filing.period), current=reportingDate873(t);
      if(deadline&&[year(t),year(t)-1].includes(filing.period)&&obligations(t).includes(filing.id)){
        var dates=current?[current]:[year(t)+'-01-01',deadline.opens,deadline.due,year(t)+'-12-31'];
        dates.filter(function(date,index){return dates.indexOf(date)===index&&date.startsWith(year(t)+'-')&&date>=deadline.opens;}).sort().forEach(function(date){
          action('date:'+date,'Nộp '+filing.id+' ngày '+date+(date>deadline.due?' · sau hạn':''),function(z,log){
            if(logObligation(z,filing.id,filing.period,date)&&date>deadline.due)log('Hồ sơ được ghi nhận nộp sau hạn.','neutral');
          });
        });
      }
      out.push({k:'back873',l:'Quay lại hồ sơ học tại nhà',run:function(l,r){X.next(l,'homeschool857',r,base);}});
      return out;
    }
    if(!s||['school','reviewResidence'].includes(s.status)){
      if(!arg.motive){MOTIVES.forEach(function(v,i){out.push({k:'motive'+i,l:'Trao đổi lý do: '+v,why:a.routes.length?true:a.withdrawal,run:function(l,r){X.next(l,'homeschool857',r,Object.assign({},base,{motive:v}));}});});}
      else a.routes.forEach(function(v){action('route:'+v.id,v.name+' · '+LABEL[v.mode],function(z){request(z,v.id,arg.motive);});});
    }else if(['draft','needsInfo'].includes(s.status)){
      [['documents','Chuẩn bị giấy tờ rút trường / đăng ký'],['plan','Lập chương trình, lịch học, hồ sơ người dạy'],['consulted','Lắng nghe học sinh và thống nhất với giám hộ']].forEach(function(v){action(v[0],v[1],function(z){var q=hs(z,true);q[v[0]]=true;q.status='draft';history(z,q,v[1]);},s[v[0]]?'Đã chuẩn bị':true);});
      if(route(t,s.route)&&route(t,s.route).credential)action('credential','Xác nhận bằng cấp hoặc điều kiện người dạy theo hình thức',function(z){hs(z).credential=true;});
      action('submit','Nộp hồ sơ · '+prerequisites(t,s).join('; '),function(z){submit(z);});
    }else if(s.status==='pending')action('review','Xem kết quả xét hồ sơ vào kỳ năm sau',function(z){review(z);},year(t)>s.submittedAt?true:'Hồ sơ đang chờ; chưa chuyển trạng thái học');
    else if(s.status==='approved')action('start','Chuyển lộ trình và bắt đầu học',function(z){start(z);});
    if(active(t)){
      if(!s.schoolManaged)['math','lit','english','science','humanities'].forEach(function(k){['self','tutor','summer'].forEach(function(mode){action('learn:'+k+':'+mode,'Học '+SUBJECT_NAME[k]+' · '+({self:'tự thiết kế bài học',tutor:'gia sư',summer:'xuyên hè'})[mode],function(z,log){study(z,k,mode,log);});});});
      function filingRow(v,period,key){
        var deadline=reportingDeadline873(t,v,period), timing=reportTiming873(t,v,period), done=s.obligations[period+':'+v];
        var label='Nộp '+v+' · kỳ '+period+(deadline?' · hạn '+deadline.due:'');
        if(deadline&&!done){
          var filing={id:v,period:period};
          out.push({k:key,l:label,why:timing==='early'?'Chưa mở kỳ nộp':true,run:function(l,r){
            X.next(l,'homeschool857',r,Object.assign({},base,{filing873:filing}));
          }});
        }else action(key,label,function(z){logObligation(z,v,period);},done?'Đã nộp kỳ này':true);
      }
      obligations(t).forEach(function(v){filingRow(v,year(t),'report:'+v);});
      if(s.started<year(t))obligations(t).filter(function(v){return !s.obligations[(year(t)-1)+':'+v];}).forEach(function(v){filingRow(v,year(t)-1,'overdue:'+v);});
      action('community','Câu lạc bộ, lớp nhóm và thể thao cộng đồng',function(z,log){var q=hs(z);if(q.socialAt===year(z))return;q.socialAt=year(z);H.fx(z,{soc:2,hap:2});history(z,q,'Tham gia nhóm cộng đồng');log('Bạn dành thời gian gặp bạn bè và học nhóm.','good');},s.socialAt===year(t)?'Đã tham gia năm nay':true);
      action('diploma','Xét homeschool diploma do gia đình cấp',function(z){diploma(z);},milestones(t).credentialEligible?true:'Cần hoàn thành môn và lộ trình có căn cứ cấp diploma');
      if(a.aid)[1,2].forEach(function(p){action('aid'+p,'Nhận trợ cấp NZ kỳ '+p+' sau khai báo (chỉ năm học đầy đủ)',function(z){claim(z,p,z.aidOrdinal||0);});});
      if(!arg.kid&&H.resCode(t)==='GB'&&region(t)==='England')out.push({k:'exam',l:'GCSE: thi thử và đăng ký thí sinh tự do',run:function(l,r){X.next(l,'gcse857',r);}});
    }
    out.push({k:'continuation863',l:'Văn bằng, tài trợ và công nhận học bạ',run:function(l,r){X.next(l,'education863',r,base);}});if(s&&s.status!=='school')['public','private','boarding','international'].forEach(function(v){action('school:'+v,'Quay lại '+({public:'trường công',private:'trường tư',boarding:'nội trú',international:'trường quốc tế'})[v]+' · đối chiếu học bạ',function(z){back(z,v);});});
    return out;
  },5,'Học tập');

  // Các danh mục dưới đây là trường / trung tâm hư cấu có lịch ổn định, không là directory thật.
  var LANG={fr:'Tiếng Pháp',es:'Tiếng Tây Ban Nha',de:'Tiếng Đức',la:'Latin',grc:'Hy Lạp cổ',zh:'Tiếng Trung',it:'Tiếng Ý',ru:'Tiếng Nga',ja:'Tiếng Nhật',ar:'Tiếng Ả Rập',pl:'Tiếng Ba Lan',no:'Tiếng Na Uy',tr:'Tiếng Thổ Nhĩ Kỳ'};
  var ELECTIVES={history:['Lịch sử','Nhân văn','A'],geography:['Địa lý','Nhân văn','B'],rs:['Religious Studies (môn thi, khác RE)','Nhân văn','C'],drama:['Kịch','Nghệ thuật','A'],music:['Âm nhạc','Nghệ thuật','B'],art:['Mỹ thuật','Nghệ thuật','C'],photography:['Nhiếp ảnh','Nghệ thuật','D'],business:['Kinh doanh','Công nghệ, kinh doanh và truyền thông','A'],economics:['Kinh tế','Công nghệ, kinh doanh và truyền thông','B'],computing:['Khoa học máy tính','Công nghệ, kinh doanh và truyền thông','C'],media:['Truyền thông','Công nghệ, kinh doanh và truyền thông','D']};
  Object.keys(LANG).forEach(function(k,i){ELECTIVES[k]=[LANG[k],['la','grc'].includes(k)?'Cổ ngữ':'Ngoại ngữ hiện đại',['A','B','C','D'][i%4]];});
  var QUAL={fr:{board:'AQA',code:'8652',from:2026,source:SOURCES.french},de:{board:'AQA',code:'8662',from:2026,source:SOURCES.german},es:{board:'AQA',code:'8692',from:2026,source:SOURCES.spanish}};
  var AQA_CATALOG='https://www.aqa.org.uk/qualifications?level=gcse';
  [['history','8145'],['geography','8035','fieldwork'],['rs','8062'],['drama','8261','performance'],['music','8271','performance'],['art','8202','coursework'],['photography','8206','coursework'],['business','8132'],['economics','8136'],['computing','8525'],['media','8572','coursework']].forEach(function(a){QUAL[a[0]]={board:'AQA',code:a[1],from:2026,source:AQA_CATALOG,assessment:a[2]||'written'};});
  QUAL.la={board:'OCR',code:'J282',from:2026,source:'https://www.ocr.org.uk/qualifications/by-type/gcse/classics/',assessment:'written'};
  QUAL.grc={board:'OCR',code:'J292',from:2026,source:'https://www.ocr.org.uk/qualifications/gcse/classical-greek-j292-from-2016/',assessment:'written'};
  ['fr','es','de'].forEach(function(k){QUAL[k].assessment='speaking';});
  function en(l){return H.resCode(l)==='GB'&&region(l)==='England'&&year(l)>=2014;}
  function eng(l,create){var s=create?state(l):peek(l);if(s.england)return s.england;
    var legacy={languages:{},chosen:[],enrolled:[],confirmed:false,history:[]};
    (s.electives||[]).forEach(function(name){var id=Object.keys(ELECTIVES).find(function(k){return ELECTIVES[k][0]===name||name==='Tôn giáo học'&&k==='rs'||name==='Hội họa'&&k==='art';});if(id&&!legacy.chosen.includes(id))legacy.chosen.push(id);});
    if(create)s.england=legacy;return legacy;
  }
  function schoolConfig(l){var childhood=l.flags.life138||{},e=eng(l),custom=e.school||{},type=custom.type||childhood.environment||'public';
    return Object.assign({id:'school:'+String(l.city||'')+':'+type,type:type,min:type==='international'?4:3,max:type==='international'?4:type==='private'?3:4,languages:type==='international'?Object.keys(LANG):['fr','es','de','la','grc'],full:[],clashes:{},privateCandidate:active(l),maintained:type==='public',examSubjects:['math','lit','english'].concat(Object.keys(QUAL)),assessmentSupport:active(l)?['written','speaking']:['written','speaking','fieldwork','performance','coursework','practical'],feeRate:.02},custom,e.centre||{});
  }
  function ks(l){var y=l.age-4;return y<=2?1:y<=6?2:y<=9?3:y<=11?4:5;}
  function offered(l,k){var c=schoolConfig(l);if(LANG[k]&&!c.languages.includes(k))return 'Trường không mở tiếng này';if(c.full.includes(k))return 'Lớp đã đầy';if(ks(l)===3&&['la','grc'].includes(k))return 'KS3 cần ngoại ngữ hiện đại; giữ tiến độ cổ ngữ ở lớp bổ trợ';return true;}
  function chooseLanguage(l,k){if(!en(l)||l.age<7||l.age>17||offered(l,k)!==true)return false;var s=eng(l,true);if(s.enrolled.includes(k))return false;if(s.enrolled.length>=3)return false;
    if(s.enrolled.some(function(x){return schoolConfig(l).clashes[k]===x||schoolConfig(l).clashes[x]===k;}))return false;
    s.enrolled.push(k);s.languages[k]=s.languages[k]||{level:Math.min(100,Math.max(0,(l.lang&&l.lang[k]||0)*20)),years:0};s.history.push({year:year(l),event:'Bắt đầu '+LANG[k]});return true;
  }
  function electiveReason(l,k){var s=eng(l),c=schoolConfig(l),v=ELECTIVES[k];if(!en(l)||ks(l)!==4)return 'Chọn môn trong Year 10–11';if(s.confirmed)return 'Đã chốt nguyện vọng';if(!v)return 'Môn không hợp lệ';if(s.chosen.includes(k))return 'Đã chọn';if(s.chosen.length>=c.max)return 'Hết suất môn tự chọn';if(LANG[k]&&offered(l,k)!==true)return offered(l,k);
    if(s.chosen.some(function(x){return ELECTIVES[x]&&ELECTIVES[x][2]===v[2]||c.clashes[k]===x||c.clashes[x]===k;}))return 'Trùng giờ với môn đã chọn';return true;
  }
  function select(l,k){if(electiveReason(l,k)!==true)return false;eng(l,true).chosen.push(k);return true;}
  function englishReport(l){var s=eng(l),c=schoolConfig(l),key=ks(l),comp=c.maintained&&!active(l)&&year(l)>=2014;
    return 'England · Year '+(l.age-4)+' · KS'+key+' · '+c.type+'.\n'+(comp&&key===2?'Ngoại ngữ hiện đại hoặc cổ ngữ bắt buộc.':comp&&key===3?'Ngoại ngữ hiện đại bắt buộc; có thể bắt đầu tiếng mới.':key===4?'Ngoại ngữ là lựa chọn GCSE; maintained school phải cho tiếp cận nhóm môn này.':'Danh mục theo chính sách riêng; không áp đặt chương trình maintained school.')+'\nTiếng đang học: '+s.enrolled.map(function(k){return LANG[k];}).join(', ')+'\nKỹ năng giữ lâu dài: '+Object.keys(s.languages).map(function(k){var p=s.languages[k];return LANG[k]+' '+Math.round(p.level)+'/100 ('+(p.level<30?'cơ bản':p.level<70?'trung bình':'thành thạo')+')'+(['la','grc'].includes(k)?' · đọc hiểu, ngữ pháp, dịch văn bản':'');}).join('; ')+'\nMôn chương trình bắt buộc không đồng nghĩa đăng ký GCSE: tiếng Anh, toán, khoa học; PE, RE và giáo dục phù hợp vẫn theo loại trường.\nSuất tự chọn '+s.chosen.length+'/'+c.min+'–'+c.max+' · còn '+Math.max(0,c.max-s.chosen.length)+'. '+(s.confirmed?'Đã chốt.':'Chưa chốt.')+'\nGCSE giúp chuẩn bị A-Level / IB; ngưỡng môn, điểm và chuyển tín chỉ do trường nhận quyết định, chưa có dữ liệu từng cơ sở.\nNguồn: '+SOURCES.curriculum+'\n'+SOURCES.languages;
  }
  // Thay menu cùng ID và hồ sơ cũ, không tạo hệ chọn môn song song.
  for(var ai=E.ACT.length-1;ai>=0;ai--)if(E.ACT[ai].id==='schoolEngland829')E.ACT.splice(ai,1);
  X.menu('schoolEngland829','Hồ sơ học tập England',function(l){return en(l)&&l.alive&&l.age>=7&&l.age<=17?true:'Cần cư trú England, từ Year 3; vùng chưa rõ không dùng mặc định England';},englishReport,function(l){
    var s=eng(l),out=[],c=schoolConfig(l);
    c.languages.forEach(function(k){if(!LANG[k])return;out.push({k:'lang:'+k,l:'Học '+LANG[k],why:s.enrolled.includes(k)?'Đang học':offered(l,k),run:function(l,r){chooseLanguage(l,k);X.next(l,'schoolEngland829',r);}});});
    s.enrolled.forEach(function(k){out.push({k:'stop:'+k,l:'Đổi khỏi '+LANG[k]+' · giữ kỹ năng',run:function(l,r){var z=eng(l,true);z.enrolled=z.enrolled.filter(function(x){return x!==k;});X.next(l,'schoolEngland829',r);}});});
    if(ks(l)===4){Object.keys(ELECTIVES).forEach(function(k){var v=ELECTIVES[k],q=QUAL[k],qualified=q&&year(l)>=q.from;out.push({k:k,l:v[1]+' · '+v[0]+(qualified?' · GCSE'+(q?' '+q.board+' '+q.code:''):' · lớp bổ trợ; chưa xác minh văn bằng GCSE'),why:electiveReason(l,k),run:function(l,r){select(l,k);X.next(l,'schoolEngland829',r);}});});
      s.chosen.forEach(function(k){out.push({k:'remove:'+k,l:'Bỏ nguyện vọng '+(ELECTIVES[k]||[k])[0],why:s.confirmed?'Đã chốt':true,run:function(l,r){if(!eng(l).confirmed)eng(l,true).chosen=eng(l).chosen.filter(function(v){return v!==k;});X.next(l,'schoolEngland829',r);}});});
      out.push({k:'confirm',l:'Chốt nguyện vọng; trường kiểm tra đăng ký văn bằng',why:s.chosen.length>=c.min&&!s.confirmed?true:'Cần đủ suất tối thiểu, chưa chốt',run:function(l,r){var z=eng(l,true);if(z.chosen.length>=c.min&&z.chosen.length<=c.max){z.confirmed=true;state(l).electives=z.chosen.map(function(k){return ELECTIVES[k][0];});state(l).subjects=state(l).electives.join(', ');}X.next(l,'schoolEngland829',r);}});
      out.push({k:'exam',l:'GCSE: thi thử, dự báo và đăng ký thi',run:function(l,r){X.next(l,'gcse857',r);}});
    }
    if(l.age>=16&&!peek(l).track)out.push({k:'sixth',l:'Sau Year 11: đăng ký A-Level / IB / học nghề',why:peek(l).gcse||completedGcse(l)?true:'Cần kết quả GCSE đã chốt',run:function(l,r){X.next(l,'sixth829',r);}});
    return out;
  },7,'Học tập');
  function examSubjects(l){return ['math','lit','english'].concat(E.EDUCATION863?E.EDUCATION863.science(l):[]).concat(eng(l).chosen.filter(function(k){return QUAL[k]&&year(l)>=QUAL[k].from;}));}
  function centreAccepts(l,k){var c=schoolConfig(l),q=QUAL[k];return c.examSubjects.includes(k)&&(!q||c.assessmentSupport.includes(q.assessment));}
  function examInput(l,subject){var i=M.inputs(l,'special',null,subject),s=eng(l),home=hs(l);i.kind='special';i.subject=subject;i.skills=M.skills(l,'uni');var p=s.languages[subject];if(p)i.subjectSkills[subject]=Math.max(i.subjectSkills[subject]||0,p.level/100);var level=home&&(home.subjects[subject]||(['combined','biology','chemistry','physics'].includes(subject)?home.subjects.science:0));if(level)i.subjectSkills[subject]=Math.max(i.subjectSkills[subject]||0,level/100);return i;}
  function gcseCalculate(input,room){var d=M.calculate(input,room),x=d.scores[0];return {subject:x.subject,grade:x.score<2?0:Math.min(9,Math.max(1,Math.floor(x.score*.9))),scale:9,raw:d,inputs:input};}
  function gcseForecast(l){return examSubjects(l).map(function(k){var i=examInput(l,k);return {subject:k,low:gcseCalculate(i,-1).grade,expected:gcseCalculate(i,0).grade,high:gcseCalculate(i,1).grade};});}
  function examReason(l){if(E.EDUCATION863&&l.flags.educationVersion863&&!E.EDUCATION863.science(l).length)return 'Cần chọn Combined Science hoặc ba khoa học riêng';if(!en(l)||l.age<14)return 'Cần học sinh England đủ tuổi lộ trình học';var c=schoolConfig(l),s=eng(l),reg=s.registration;if(!reg||reg.year!==year(l))return 'Chưa đăng ký trung tâm nhận đúng môn và năm';if(reg.subjects.join('|')!==examSubjects(l).join('|'))return 'Đã đổi môn: cần đăng ký lại';if(reg.schoolId!==c.id)return 'Đổi trường / trung tâm: cần đăng ký lại';return true;}
  function register(l){if(E.EDUCATION863&&l.flags.educationVersion863&&!E.EDUCATION863.science(l).length)return false;if(!en(l)||l.age<14||l.age>19)return false;var c=schoolConfig(l),subjects=examSubjects(l),s=eng(l,true),old=s.registration;
    if(old&&old.year===year(l)&&old.schoolId===c.id&&old.subjects.join('|')===subjects.join('|'))return false;
    var retained=old&&old.year===year(l)&&old.schoolId===c.id?old.subjects:[],fee=l.base*c.feeRate*subjects.filter(function(k){return !retained.includes(k);}).length;
    if(!subjects.every(function(k){return centreAccepts(l,k);})||l.money<fee)return false;
    if(old)(s.entryHistory||(s.entryHistory=[])).push(old);H.cash(l,-fee,'Lệ phí GCSE tại trung tâm tiếp nhận');s.registration={year:year(l),subjects:subjects,schoolId:c.id,privateCandidate:active(l),fee:fee,assessments:'Trung tâm tiếp nhận hỗ trợ đủ phần nói / thực hành của môn nhận'};return true;}
  function gcseSit(l){if(examReason(l)!==true)return false;var s=eng(l,true),key=year(l)+':'+examSubjects(l).join('|');s.results=s.results||{};if(s.results[key])return s.results[key];
    s.subjectResults=s.subjectResults||{};var rows=examSubjects(l).map(function(k){var subjectKey=year(l)+':'+k;if(s.subjectResults[subjectKey])return s.subjectResults[subjectKey];var i=examInput(l,k),raw=M.official(l,'special','GCSE857:'+year(l),k);return s.subjectResults[subjectKey]=E.EDUCATION863?E.EDUCATION863.combined(gcseCalculate(i,raw.roomDraw)):gcseCalculate(i,raw.roomDraw);});s.results[key]=rows;return rows;
  }
  X.menu('gcse857','GCSE: thi thử và trung tâm tiếp nhận',function(l){return en(l)&&l.alive&&l.age>=14&&l.age<=19?true:'Dành cho GCSE tại England';},function(l){var c=schoolConfig(l);return 'Thang GCSE 9–1; 0 là U. Không dùng tổng /30 Việt Nam. Thi thử và thi thật dùng cùng công thức từng môn, không bảo đảm điểm.\n'+gcseForecast(l).map(function(x){return (LANG[x.subject]||SUBJECT_NAME[x.subject]||x.subject)+': '+x.low+'–'+x.high+'; kỳ vọng '+x.expected;}).join('\n')+'\n'+examReason(l)+'\nTrung tâm tiếp nhận '+c.id+' nhận: '+c.examSubjects.filter(function(k){return centreAccepts(l,k);}).map(function(k){return LANG[k]||SUBJECT_NAME[k]||(ELECTIVES[k]||[k])[0];}).join(', ')+'. Phí dự kiến '+H.money(l,l.base*c.feeRate)+'/môn; kỳ thi cuối năm, hỗ trợ đánh giá phần nói cho tiếng mở.\nThí sinh tự do thật phải tìm trung tâm nhận tất cả phần đánh giá: '+SOURCES.exams;},function(l){var c=schoolConfig(l),s=eng(l);return [{k:'scienceCombined',l:'Khoa học: Combined Science — hai điểm GCSE',run:function(l,r){E.EDUCATION863.chooseScience(l,'combined');X.next(l,'gcse857',r);}},{k:'scienceSeparate',l:'Khoa học: Biology, Chemistry, Physics riêng',run:function(l,r){E.EDUCATION863.chooseScience(l,'separate');X.next(l,'gcse857',r);}},{k:'centreFull',l:'Chọn trung tâm tiếp nhận có hỗ trợ thực hành và coursework',run:function(l,r){eng(l,true).centre={id:'centre:'+String(l.city||'')+':full',examSubjects:['math','lit','english'].concat(Object.keys(QUAL)),assessmentSupport:['written','speaking','fieldwork','performance','coursework','practical'],feeRate:.035};X.next(l,'gcse857',r);}},{k:'practice',l:'Luyện đề GCSE theo bộ máy thi hiện có',run:function(l,r,log){M.train(l,'uni','standard',function(){});log('Sau luyện đề GCSE: '+gcseForecast(l).map(function(x){return (LANG[x.subject]||SUBJECT_NAME[x.subject]||x.subject)+' '+x.low+'–'+x.high+'/9';}).join(' · ')+'. Không đổi kết quả thi thật.','neutral');X.next(l,'gcse857',r);}},{k:'register',l:'Đăng ký trung tâm và đóng lệ phí',why:E.EDUCATION863&&l.flags.educationVersion863&&!E.EDUCATION863.science(l).length?'Cần chọn cách thi khoa học':examReason(l)===true?'Đã đăng ký đúng môn năm nay':examSubjects(l).every(function(k){return centreAccepts(l,k);})?true:'Trung tâm không nhận đủ môn / phần đánh giá',run:function(l,r){register(l);X.next(l,'gcse857',r);}},{k:'sit',l:'Dự thi chính thức; khóa kết quả theo kỳ và môn',why:examReason(l),run:function(l,r,log){var result=gcseSit(l);if(result)log('Kết quả GCSE: '+result.map(function(x){return (LANG[x.subject]||SUBJECT_NAME[x.subject]||x.subject)+' '+(x.grades863?x.grades863.join('–'):(x.grade||'U'))+'/9';}).join(' · ')+'. Kết quả đã khóa; điều kiện trường tiếp nhận xét riêng.','good');}}];},14,'Học tập');

  var grad=E.gradFail;E.gradFail=function(l){if(active(l)&&!hs(l).schoolManaged)return true;return grad&&grad.apply(this,arguments);};
  ['hs'].forEach(function(id){if(!E.DEC[id])return;var old=E.DEC[id].valid;E.DEC[id].valid=function(l){if(hs(l)&&['active','reviewResidence'].includes(hs(l).status)&&!hs(l).schoolManaged)return false;return old?old.apply(this,arguments):true;};});
  function completedGcse(l){var results=eng(l).results||{},keys=Object.keys(results);if(keys.length)return results[keys[keys.length-1]];var diploma=hs(l)?.diploma;return diploma?.type==='igcse'?diploma.transcript:null;}
  var sixth=E.DEC.sixth829,sixthValid=sixth.valid,sixthPrep=sixth.def.prep,sixthApply=sixth.apply;
  sixth.valid=function(l){if(!en(l))return sixthValid.apply(this,arguments);return l.alive&&l.age>=16&&l.age<=19&&!peek(l).track&&!!(peek(l).gcse||completedGcse(l));};
  sixth.def.prep=function(l,r){if(!en(l))return sixthPrep.apply(this,arguments);var result=completedGcse(l);return {grade:peek(l).gcse||(result?Math.round(result.reduce(function(n,x){return n+x.grade;},0)/result.length):0)};};
  sixth.apply=function(l,d,k,r,log){if(en(l)&&!sixth.valid(l))return;var oldGcse=peek(l).gcse;sixthApply.apply(this,arguments);if(oldGcse!=null)state(l).gcse=oldGcse;if(en(l)&&peek(l).track&&hs(l)&&hs(l).status==='active'){history(l,hs(l),'Nhập học Sixth Form; giữ kết quả GCSE và hồ sơ học tại nhà');hs(l).status='school';}};
  var careValid=E.DEC.careSchool138.valid;E.DEC.careSchool138.valid=function(l){return active(l)?false:careValid.apply(this,arguments);};
  var careApply=E.DEC.careSchool138.apply;E.DEC.careSchool138.apply=function(l,d,k,r,log){if(active(l)){log('Hãy dùng Quay lại trường trong hồ sơ học tại nhà để đối chiếu học bạ.','neutral');return;}return careApply.apply(this,arguments);};
  var heir=E.heirAtAge;if(heir)E.heirAtAge=function(parent,k){var l=heir.apply(this,arguments);if(l&&k.study829){l.flags.study829=JSON.parse(JSON.stringify(k.study829));if(k.mockExam853)l.flags.mockExam853=JSON.parse(JSON.stringify(k.mockExam853));l.educationRegion=parent.abroad?parent.abroad.educationRegion:parent.educationRegion;var h=hs(l);if(h&&h.childSchool){l.school=h.childSchool.school;l.schoolEnd=h.childSchool.schoolEnd;}if(h&&h.status==='active'&&!h.schoolManaged&&k.edu==null)l.edu=Math.min(l.edu,2);reconcile(l);}return l;};
  E.HOOKS.year.push(function(l,r,log){
    reconcile(l);var s=hs(l);if(s&&s.status==='pending')review(l);
    if(active(l)&&s.tick!==year(l)){s.tick=year(l);var due=obligations(l).filter(function(k){return !s.obligations[year(l)+':'+k];});if(due.length)log('Học tại nhà: còn '+due.join(', ')+'. Hồ sơ chưa nộp được giữ sang lần xem sau.','neutral');if(s.socialAt!==year(l))log('Bạn có thể tìm câu lạc bộ hoặc lớp nhóm để duy trì bạn bè khi học tại nhà.','neutral');}
    (l.kids||[]).forEach(function(k){if(k.study829){var t=child(l,k.uid110,true);if(t){reconcile(t);review(t);}}});
    if(!en(l)||l.age<7||l.age>17)return;var z=eng(l,true),c=schoolConfig(l),key=ks(l);if(z.at===year(l))return;z.at=year(l);
    if(key===3)z.enrolled=z.enrolled.filter(function(k){return !['la','grc'].includes(k)&&c.languages.includes(k);});
    if([2,3].includes(key)&&c.maintained&&!active(l)&&!z.enrolled.length){var lang=c.languages.find(function(k){return offered(l,k)===true;});if(lang)chooseLanguage(l,lang);}
    z.enrolled.forEach(function(k){var p=z.languages[k]||(z.languages[k]={level:0,years:0});if(c.full.includes(k))return;p.level=Math.min(100,p.level+(3+(l.st.kno||50)/20)*(1-p.level/130));p.years++;if(!['la','grc'].includes(k)){l.lang=l.lang||{};l.lang[k]=Math.max(l.lang[k]||0,Math.min(5,Math.floor(p.level/20)));}});
  });
  var profile=E.profile;E.profile=function(l){var p=profile.apply(this,arguments),s=hs(l);if(s)p.jobInfo.push('Học tại nhà: '+(STATUS[s.status]||s.status)+' · '+milestones(l).missing.join('; '));return p;};
  E.STUDY857={REGIONS:REGIONS,RULES:RULES,SOURCES:SOURCES,LANG:LANG,QUAL:QUAL,rule:rule,region:region,peek:peek,home:hs,active:active,request:request,submit:submit,review:review,start:start,back:back,reconcile:reconcile,study:study,milestones:milestones,diploma:diploma,claim:claim,logObligation:logObligation,reportingDeadline873:reportingDeadline873,report:report,en:en,eng:eng,schoolConfig:schoolConfig,chooseLanguage:chooseLanguage,select:select,electiveReason:electiveReason,gcseCalculate:gcseCalculate,gcseForecast:gcseForecast,gcseSit:gcseSit,register:register,examReason:examReason,child:child};
})(globalThis.G);
