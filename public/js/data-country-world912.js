/* Một Đời — §13 (8.10.17): hồ sơ quốc gia mở rộng cho COUNTRY_DEPTH_DATA có sẵn (life173 đọc khi nạp).
   Không phải hệ thống mới: mỗi nước thêm đúng các trường education/festivals/marriage/cuisine/labor/lifeEvents
   mà life173 đã dùng (sự kiện nhiều năm, đối chiếu lao động, lễ hội, món ăn, chuẩn bị cưới).
   Nguồn theo nước: hồ sơ giáo dục UNESCO GEM (education-profiles.org), trang quốc gia ILO, trang quốc gia UNESCO,
   cổng dữ liệu giới của Ngân hàng Thế giới (khung pháp lý hôn nhân/gia đình). tools/country-sources-912.js kiểm
   từng URL (HTTP 200 + tên nước trong tiêu đề) và ghi docs/country-sources-912.json.
   Giới hạn trung thực: nội dung do nhóm phát triển biên soạn, URL đã kiểm tồn tại và đúng nước, CHƯA đối chiếu
   từng câu với trang nguồn → metadata.confidence = 'source-linked', fullyAccepted vẫn false trong audit.
   Mọi chi phí/kết quả là cân bằng gameplay, không phải dữ liệu thống kê. */
(function (G) {
  'use strict';
  var E = G.E, D = E.COUNTRY_DEPTH_DATA;
  if (!D) throw new Error('data-country-depth.js must load before data-country-world912.js');
  var PEER = 'https://education-profiles.org/', ILO = 'https://www.ilo.org/regions-and-countries/', UN = 'https://www.unesco.org/en/countries/', GD = 'https://genderdata.worldbank.org/en/economies/';
  // cc: [tên trong tiêu đề trang nguồn, hồ sơ GEM, trang ILO, trang dữ liệu giới WB]
  var SRC = {
    AF:["Afghanistan","central-and-southern-asia/afghanistan/~afghanistan","asia-and-pacific/afghanistan","afghanistan"],
    AL:["Albania","europe-and-northern-america/albania/~albania","europe-and-central-asia/albania","albania"],
    DZ:["Algeria","northern-africa-and-western-asia/algeria/~algeria","africa/algeria","algeria"],
    AD:["Andorra","europe-and-northern-america/andorra/~andorra",null,"andorra"],
    AO:["Angola","sub-saharan-africa/angola/~angola","africa/angola","angola"],
    AG:["Antigua and Barbuda","latin-america-and-the-caribbean/antigua-and-barbuda/~antigua-and-barbuda","latin-america-and-caribbean/caribbean/antigua-and-barbuda","antigua-and-barbuda"],
    AR:["Argentina","latin-america-and-the-caribbean/argentina/~argentina","latin-america-and-caribbean/argentina","argentina"],
    AM:["Armenia","northern-africa-and-western-asia/armenia/~armenia","europe-and-central-asia/armenia","armenia"],
    AU:["Australia","oceania/australia/~australia","asia-and-pacific/australia","australia"],
    AT:["Austria","europe-and-northern-america/austria/~austria","europe-and-central-asia/european-union-eu/austria","austria"],
    AZ:["Azerbaijan","northern-africa-and-western-asia/azerbaijan/~azerbaijan","europe-and-central-asia/azerbaijan","azerbaijan"],
    BS:["Bahamas","latin-america-and-the-caribbean/bahamas/~bahamas","latin-america-and-caribbean/caribbean/bahamas","bahamas-the"],
    BH:["Bahrain","northern-africa-and-western-asia/bahrain/~bahrain","arab-states/bahrain","bahrain"],
    BD:["Bangladesh","central-and-southern-asia/bangladesh/~bangladesh","asia-and-pacific/bangladesh","bangladesh"],
    BB:["Barbados","latin-america-and-the-caribbean/barbados/~barbados","latin-america-and-caribbean/caribbean/barbados","barbados"],
    BY:["Belarus","europe-and-northern-america/belarus/~belarus","europe-and-central-asia/belarus","belarus"],
    BE:["Belgium","europe-and-northern-america/belgium/~belgium","europe-and-central-asia/european-union-eu/belgium","belgium"],
    BZ:["Belize","latin-america-and-the-caribbean/belize/~belize","latin-america-and-caribbean/caribbean/belize","belize"],
    BJ:["Benin","sub-saharan-africa/benin/~benin","africa/benin","benin"],
    BT:["Bhutan","central-and-southern-asia/bhutan/~bhutan",null,"bhutan"],
    BO:["Bolivia","latin-america-and-the-caribbean/bolivia-plurinational-state-of/~bolivia","latin-america-and-caribbean/bolivia","bolivia"],
    BA:["Bosnia and Herzegovina","europe-and-northern-america/bosnia-and-herzegovina/~bosnia-and-herzegovina","europe-and-central-asia/bosnia-and-herzegovina","bosnia-and-herzegovina"],
    BW:["Botswana","sub-saharan-africa/botswana/~botswana","africa/botswana","botswana"],
    BR:["Brazil","latin-america-and-the-caribbean/brazil/~brazil","latin-america-and-caribbean/brazil","brazil"],
    BN:["Brunei","eastern-and-south-eastern-asia/brunei-darussalam/~brunei-darussalam","asia-and-pacific/brunei-darussalam","brunei-darussalam"],
    BG:["Bulgaria","europe-and-northern-america/bulgaria/~bulgaria","europe-and-central-asia/european-union-eu/bulgaria","bulgaria"],
    BF:["Burkina Faso","sub-saharan-africa/burkina-faso/~burkina-faso","africa/burkina-faso","burkina-faso"],
    BI:["Burundi","sub-saharan-africa/burundi/~burundi","africa/burundi","burundi"],
    CV:["Cabo Verde","sub-saharan-africa/cabo-verde/~cabo-verde","africa/cabo-verde","cabo-verde"],
    KH:["Cambodia","eastern-and-south-eastern-asia/cambodia/~cambodia","asia-and-pacific/cambodia","cambodia"],
    CM:["Cameroon","sub-saharan-africa/cameroon/~cameroon","africa/cameroon","cameroon"],
    CA:["Canada","europe-and-northern-america/canada/~canada","canada","canada"],
    CF:["Central African Republic","sub-saharan-africa/central-african-republic/~central-african-republic","africa/central-african-republic","central-african-republic"],
    TD:["Chad","sub-saharan-africa/chad/~chad","africa/chad-republic","chad"],
    CL:["Chile","latin-america-and-the-caribbean/chile/~chile","latin-america-and-caribbean/chile","chile"],
    CN:["China","eastern-and-south-eastern-asia/china/~china","asia-and-pacific/china","china"],
    CO:["Colombia","latin-america-and-the-caribbean/colombia/~colombia","latin-america-and-caribbean/colombia","colombia"],
    KM:["Comoros","sub-saharan-africa/comoros/~comoros","africa/comoros","comoros"],
    CG:["Congo","sub-saharan-africa/congo/~congo","africa/congo","congo-rep"],
    CD:["Democratic Republic of Congo","sub-saharan-africa/democratic-republic-of-congo/~democratic-republic-of-congo","africa/democratic-republic-congo","congo-dem-rep"],
    CR:["Costa Rica","latin-america-and-the-caribbean/costa-rica/~costa-rica","latin-america-and-caribbean/costa-rica","costa-rica"],
    CI:["Ivoire","sub-saharan-africa/cote-divoire/~cote-divoire","africa/c%C3%B4te-d%E2%80%99ivoire","cote-d-ivoire"],
    HR:["Croatia","europe-and-northern-america/croatia/~croatia","europe-and-central-asia/european-union-eu/croatia","croatia"],
    CU:["Cuba","latin-america-and-the-caribbean/cuba/~cuba","latin-america-and-caribbean/cuba","cuba"],
    CY:["Cyprus","europe-and-northern-america/cyprus/~cyprus","europe-and-central-asia/european-union-eu/cyprus","cyprus"],
    CZ:["Czech","europe-and-northern-america/czech-republic/~czech-republic","europe-and-central-asia/european-union-eu/czechia","czechia"],
    DK:["Denmark","europe-and-northern-america/denmark/~denmark","europe-and-central-asia/european-union-eu/denmark","denmark"],
    DJ:["Djibouti","sub-saharan-africa/djibouti/~djibouti","africa/djibouti","djibouti"],
    DM:["Dominica","latin-america-and-the-caribbean/dominica/~dominica",null,"dominica"],
    DO:["Dominican Republic","latin-america-and-the-caribbean/dominican-republic/~dominican-republic","latin-america-and-caribbean/dominican-republic","dominican-republic"],
    EC:["Ecuador","latin-america-and-the-caribbean/ecuador/~ecuador","latin-america-and-caribbean/ecuador","ecuador"],
    EG:["Egypt","northern-africa-and-western-asia/egypt/~egypt","africa/egypt","egypt-arab-rep"],
    SV:["El Salvador","latin-america-and-the-caribbean/el-salvador/~el-salvador","latin-america-and-caribbean/el-salvador","el-salvador"],
    GQ:["Equatorial Guinea","sub-saharan-africa/equatorial-guinea/~equatorial-guinea","africa/equatorial-guinea","equatorial-guinea"],
    ER:["Eritrea","sub-saharan-africa/eritrea/~eritrea","africa/eritrea","eritrea"],
    EE:["Estonia","europe-and-northern-america/estonia/~estonia","europe-and-central-asia/european-union-eu/estonia","estonia"],
    SZ:["Eswatini","sub-saharan-africa/eswatini/~eswatini","africa/eswatini","eswatini"],
    ET:["Ethiopia","sub-saharan-africa/ethiopia/~ethiopia","africa/ethiopia","ethiopia"],
    FJ:["Fiji","oceania/fiji/~fiji","asia-and-pacific/pacific-island-countries/fiji","fiji"],
    GA:["Gabon","sub-saharan-africa/gabon/~gabon","africa/gabon","gabon"],
    GM:["Gambia","sub-saharan-africa/gambia/~gambia","africa/gambia","gambia-the"],
    GE:["Georgia","northern-africa-and-western-asia/georgia/~georgia","europe-and-central-asia/georgia","georgia"],
    DE:["Germany","europe-and-northern-america/germany/~germany","europe-and-central-asia/european-union-eu/germany","germany"],
    GR:["Greece","europe-and-northern-america/greece/~greece","europe-and-central-asia/european-union-eu/greece","greece"],
    GD:["Grenada","latin-america-and-the-caribbean/grenada/~grenada","latin-america-and-caribbean/caribbean/grenada","grenada"],
    GT:["Guatemala","latin-america-and-the-caribbean/guatemala/~guatemala","latin-america-and-caribbean/guatemala","guatemala"],
    GN:["Guinea","sub-saharan-africa/guinea/~guinea","africa/guinea","guinea"],
    GW:["Guinea-Bissau","sub-saharan-africa/guinea-bissau/~guinea-bissau","africa/guinea-bissau","guinea-bissau"],
    GY:["Guyana","latin-america-and-the-caribbean/guyana/~guyana","latin-america-and-caribbean/caribbean/guyana","guyana"],
    HT:["Haiti","latin-america-and-the-caribbean/haiti/~haiti","latin-america-and-caribbean/haiti","haiti"],
    VA:["Holy See",null,null,null],
    HN:["Honduras","latin-america-and-the-caribbean/honduras/~honduras","latin-america-and-caribbean/honduras","honduras"],
    HU:["Hungary","europe-and-northern-america/hungary/~hungary","europe-and-central-asia/european-union-eu/hungary","hungary"],
    IS:["Iceland","europe-and-northern-america/iceland/~iceland","europe-and-central-asia/iceland","iceland"],
    IN:["India","central-and-southern-asia/india/~india","asia-and-pacific/india","india"],
    ID:["Indonesia","eastern-and-south-eastern-asia/indonesia/~indonesia","asia-and-pacific/indonesia","indonesia"],
    IR:["Iran","central-and-southern-asia/iran-islamic-republic-of/~iran-islamic-republic-of","asia-and-pacific/iran-islamic-republic","iran-islamic-rep"],
    IQ:["Iraq","northern-africa-and-western-asia/iraq/~iraq","arab-states/iraq","iraq"],
    IL:["Israel","northern-africa-and-western-asia/israel/~israel","israel","israel"],
    IT:["Italy","europe-and-northern-america/italy/~italy","europe-and-central-asia/european-union-eu/italy","italy"],
    JM:["Jamaica","latin-america-and-the-caribbean/jamaica/~jamaica","latin-america-and-caribbean/caribbean/jamaica","jamaica"],
    JO:["Jordan","northern-africa-and-western-asia/jordan/~jordan","arab-states/jordan","jordan"],
    KZ:["Kazakhstan","central-and-southern-asia/kazakhstan/~kazakhstan","europe-and-central-asia/kazakhstan","kazakhstan"],
    KE:["Kenya","sub-saharan-africa/kenya/~kenya","africa/kenya","kenya"],
    KI:["Kiribati","oceania/kiribati/~kiribati","asia-and-pacific/pacific-island-countries/kiribati","kiribati"],
    KP:["Korea","eastern-and-south-eastern-asia/democratic-peoples-republic-of-korea/~democratic-peoples-republic-of-korea",null,"korea-dem-people-s-rep"],
    KR:["Korea","eastern-and-south-eastern-asia/republic-of-korea/~republic-of-korea","asia-and-pacific/korea-republic","korea-rep"],
    KW:["Kuwait","northern-africa-and-western-asia/kuwait/~kuwait","arab-states/kuwait","kuwait"],
    KG:["Kyrgyz","central-and-southern-asia/kyrgyzstan/~kyrgyzstan","europe-and-central-asia/kyrgyzstan","kyrgyz-republic"],
    LA:["Lao","eastern-and-south-eastern-asia/lao-peoples-democratic-republic/~lao-peoples-democratic-republic","asia-and-pacific/lao-peoples-democratic-republic","lao-pdr"],
    LV:["Latvia","europe-and-northern-america/latvia/~latvia","europe-and-central-asia/european-union-eu/latvia","latvia"],
    LB:["Lebanon","northern-africa-and-western-asia/lebanon/~lebanon","arab-states/lebanon","lebanon"],
    LS:["Lesotho","sub-saharan-africa/lesotho/~lesotho","africa/lesotho","lesotho"],
    LR:["Liberia","sub-saharan-africa/liberia/~liberia","africa/liberia","liberia"],
    LY:["Libya","northern-africa-and-western-asia/libya/~libya","africa/libya","libya"],
    LI:["Liechtenstein","europe-and-northern-america/liechtenstein/~liechtenstein",null,"liechtenstein"],
    LT:["Lithuania","europe-and-northern-america/lithuania/~lithuania","europe-and-central-asia/european-union-eu/lithuania","lithuania"],
    LU:["Luxembourg","europe-and-northern-america/luxembourg/~luxembourg","europe-and-central-asia/european-union-eu/luxembourg","luxembourg"],
    MG:["Madagascar","sub-saharan-africa/madagascar/~madagascar","africa/madagascar","madagascar"],
    MW:["Malawi","sub-saharan-africa/malawi/~malawi","africa/malawi","malawi"],
    MY:["Malaysia","eastern-and-south-eastern-asia/malaysia/~malaysia","asia-and-pacific/malaysia","malaysia"],
    MV:["Maldives","central-and-southern-asia/maldives/~maldives","asia-and-pacific/maldives","maldives"],
    ML:["Mali","sub-saharan-africa/mali/~mali","africa/mali","mali"],
    MT:["Malta","europe-and-northern-america/malta/~malta","europe-and-central-asia/european-union-eu/malta","malta"],
    MH:["Marshall Islands","oceania/marshall-islands/~marshall-islands","asia-and-pacific/pacific-island-countries/marshall-islands","marshall-islands"],
    MR:["Mauritania","sub-saharan-africa/mauritania/~mauritania","africa/mauritania","mauritania"],
    MU:["Mauritius","sub-saharan-africa/mauritius/~mauritius","africa/mauritius","mauritius"],
    MX:["Mexico","latin-america-and-the-caribbean/mexico/~mexico","latin-america-and-caribbean/mexico","mexico"],
    FM:["Micronesia","oceania/micronesia-federated-states-of/~micronesia-federated-states-of",null,"micronesia-fed-sts"],
    MD:["Moldova","europe-and-northern-america/moldova/~moldova","europe-and-central-asia/moldova-republic","moldova"],
    MC:["Monaco","europe-and-northern-america/monaco/~monaco",null,"monaco"],
    MN:["Mongolia","eastern-and-south-eastern-asia/mongolia/~mongolia","asia-and-pacific/mongolia","mongolia"],
    ME:["Montenegro","europe-and-northern-america/montenegro/~montenegro","europe-and-central-asia/montenegro","montenegro"],
    MA:["Morocco","northern-africa-and-western-asia/morocco/~morocco","africa/morocco","morocco"],
    MZ:["Mozambique","sub-saharan-africa/mozambique/~mozambique","africa/mozambique","mozambique"],
    MM:["Myanmar","eastern-and-south-eastern-asia/myanmar/~myanmar","asia-and-pacific/myanmar","myanmar"],
    NA:["Namibia","sub-saharan-africa/namibia/~namibia","africa/namibia","namibia"],
    NR:["Nauru","oceania/nauru/~nauru",null,"nauru"],
    NP:["Nepal","central-and-southern-asia/nepal/~nepal","asia-and-pacific/nepal","nepal"],
    NL:["Netherlands","europe-and-northern-america/netherlands/~netherlands","europe-and-central-asia/european-union-eu/netherlands-kingdom","netherlands"],
    NI:["Nicaragua","latin-america-and-the-caribbean/nicaragua/~nicaragua","latin-america-and-caribbean/nicaragua","nicaragua"],
    NE:["Niger","sub-saharan-africa/niger/~niger","africa/niger","niger"],
    NG:["Nigeria","sub-saharan-africa/nigeria/~nigeria","africa/nigeria","nigeria"],
    MK:["North Macedonia","europe-and-northern-america/north-macedonia/~north-macedonia","europe-and-central-asia/north-macedonia-republic","north-macedonia"],
    NO:["Norway","europe-and-northern-america/norway/~norway","europe-and-central-asia/norway","norway"],
    OM:["Oman","northern-africa-and-western-asia/oman/~oman","arab-states/oman","oman"],
    PK:["Pakistan","central-and-southern-asia/pakistan/~pakistan","asia-and-pacific/pakistan","pakistan"],
    PW:["Palau","oceania/palau/~palau","asia-and-pacific/pacific-island-countries/palau","palau"],
    PS:["Palestin","northern-africa-and-western-asia/state-of-palestine/~state-of-palestine","arab-states/occupied-palestinian-territory","west-bank-and-gaza"],
    PA:["Panama","latin-america-and-the-caribbean/panama/~panama","latin-america-and-caribbean/panama","panama"],
    PG:["Papua New Guinea","oceania/papua-new-guinea/~papua-new-guinea","asia-and-pacific/pacific-island-countries/papua-new-guinea","papua-new-guinea"],
    PY:["Paraguay","latin-america-and-the-caribbean/paraguay/~paraguay","latin-america-and-caribbean/paraguay","paraguay"],
    PE:["Peru","latin-america-and-the-caribbean/peru/~peru","latin-america-and-caribbean/peru","peru"],
    PH:["Philippines","eastern-and-south-eastern-asia/philippines/~philippines","asia-and-pacific/philippines","philippines"],
    PL:["Poland","europe-and-northern-america/poland/~poland","europe-and-central-asia/european-union-eu/poland","poland"],
    PT:["Portugal","europe-and-northern-america/portugal/~portugal","europe-and-central-asia/european-union-eu/portugal","portugal"],
    QA:["Qatar","northern-africa-and-western-asia/qatar/~qatar","arab-states/qatar","qatar"],
    RO:["Romania","europe-and-northern-america/romania/~romania","europe-and-central-asia/european-union-eu/romania","romania"],
    RU:["Russia","europe-and-northern-america/russian-federation/~russian-federation","russian-federation","russian-federation"],
    RW:["Rwanda","sub-saharan-africa/rwanda/~rwanda","africa/rwanda","rwanda"],
    KN:["Kitts","latin-america-and-the-caribbean/saint-kitts-and-nevis/~saint-kitts-and-nevis",null,"st-kitts-and-nevis"],
    LC:["Lucia","latin-america-and-the-caribbean/saint-lucia/~saint-lucia","latin-america-and-caribbean/caribbean/saint-lucia","st-lucia"],
    VC:["Vincent","latin-america-and-the-caribbean/saint-vincent-and-the-grenadines/~saint-vincent-and-the-grenadines",null,"st-vincent-and-the-grenadines"],
    WS:["Samoa","oceania/samoa/~samoa","asia-and-pacific/pacific-island-countries/samoa","samoa"],
    SM:["San Marino","europe-and-northern-america/san-marino/~san-marino","europe-and-central-asia/european-union-eu/san-marino","san-marino"],
    ST:["Sao Tome","sub-saharan-africa/sao-tome-and-principe/~sao-tome-and-principe","africa/sao-tome-and-principe","sao-tome-and-principe"],
    SA:["Saudi Arabia","northern-africa-and-western-asia/saudi-arabia/~saudi-arabia","arab-states/saudi-arabia","saudi-arabia"],
    SN:["Senegal","sub-saharan-africa/senegal/~senegal","africa/senegal","senegal"],
    RS:["Serbia","europe-and-northern-america/serbia/~serbia","europe-and-central-asia/serbia","serbia"],
    SC:["Seychelles","sub-saharan-africa/seychelles/~seychelles","africa/seychelles","seychelles"],
    SL:["Sierra Leone","sub-saharan-africa/sierra-leone/~sierra-leone","africa/sierra-leone","sierra-leone"],
    SG:["Singapore","eastern-and-south-eastern-asia/singapore/~singapore","asia-and-pacific/singapore","singapore"],
    SK:["Slovak","europe-and-northern-america/slovakia/~slovakia","europe-and-central-asia/european-union-eu/slovakia","slovak-republic"],
    SI:["Slovenia","europe-and-northern-america/slovenia/~slovenia","europe-and-central-asia/european-union-eu/slovenia","slovenia"],
    SB:["Solomon Islands","oceania/solomon-islands/~solomon-islands","asia-and-pacific/pacific-island-countries/solomon-islands","solomon-islands"],
    SO:["Somalia","sub-saharan-africa/somalia/~somalia","africa/somalia","somalia"],
    ZA:["South Africa","sub-saharan-africa/south-africa/~south-africa","africa/south-africa","south-africa"],
    SS:["South Sudan","sub-saharan-africa/south-sudan/~south-sudan","africa/south-sudan","south-sudan"],
    ES:["Spain","europe-and-northern-america/spain/~spain","europe-and-central-asia/european-union-eu/spain","spain"],
    LK:["Sri Lanka","central-and-southern-asia/sri-lanka/~sri-lanka","asia-and-pacific/sri-lanka","sri-lanka"],
    SD:["Sudan","northern-africa-and-western-asia/sudan/~sudan","africa/sudan","sudan"],
    SR:["Suriname","latin-america-and-the-caribbean/suriname/~suriname","latin-america-and-caribbean/caribbean/suriname","suriname"],
    SE:["Sweden","europe-and-northern-america/sweden/~sweden","europe-and-central-asia/european-union-eu/sweden","sweden"],
    CH:["Switzerland","europe-and-northern-america/switzerland/~switzerland","europe-and-central-asia/switzerland","switzerland"],
    SY:["Syria","northern-africa-and-western-asia/syrian-arab-republic/~syrian-arab-republic","arab-states/syrian-arab-republic","syrian-arab-republic"],
    TJ:["Tajikistan","central-and-southern-asia/tajikistan/~tajikistan","europe-and-central-asia/tajikistan","tajikistan"],
    TZ:["Tanzania","sub-saharan-africa/united-republic-of-tanzania/~united-republic-of-tanzania","africa/tanzania-united-republic","tanzania"],
    TH:["Thailand","eastern-and-south-eastern-asia/thailand/~thailand","asia-and-pacific/thailand","thailand"],
    TL:["Timor-Leste","eastern-and-south-eastern-asia/timor-leste/~timor-leste","asia-and-pacific/timor-leste","timor-leste"],
    TG:["Togo","sub-saharan-africa/togo/~togo","africa/togo","togo"],
    TO:["Tonga","oceania/tonga/~tonga","asia-and-pacific/pacific-island-countries/tonga","tonga"],
    TT:["Trinidad and Tobago","latin-america-and-the-caribbean/trinidad-and-tobago/~trinidad-and-tobago","latin-america-and-caribbean/caribbean/trinidad-and-tobago","trinidad-and-tobago"],
    TN:["Tunisia","northern-africa-and-western-asia/tunisia/~tunisia","africa/tunisia","tunisia"],
    TR:["Türkiye","northern-africa-and-western-asia/turkiye/~turkiye","europe-and-central-asia/t%C3%BCrkiye-0","turkiye"],
    TM:["Turkmenistan","central-and-southern-asia/turkmenistan/~turkmenistan","europe-and-central-asia/turkmenistan","turkmenistan"],
    TV:["Tuvalu","oceania/tuvalu/~tuvalu","asia-and-pacific/pacific-island-countries/tuvalu","tuvalu"],
    UG:["Uganda","sub-saharan-africa/uganda/~uganda","africa/uganda","uganda"],
    UA:["Ukraine","europe-and-northern-america/ukraine/~ukraine","europe-and-central-asia/ukraine","ukraine"],
    AE:["United Arab Emirates","northern-africa-and-western-asia/united-arab-emirates/~united-arab-emirates","arab-states/united-arab-emirates","united-arab-emirates"],
    GB:["United Kingdom","europe-and-northern-america/united-kingdom/~united-kingdom","europe-and-central-asia/united-kingdom","united-kingdom"],
    UY:["Uruguay","latin-america-and-the-caribbean/uruguay/~uruguay","latin-america-and-caribbean/uruguay","uruguay"],
    UZ:["Uzbekistan","central-and-southern-asia/uzbekistan/~uzbekistan","europe-and-central-asia/uzbekistan","uzbekistan"],
    VU:["Vanuatu","oceania/vanuatu/~vanuatu","asia-and-pacific/pacific-island-countries/vanuatu","vanuatu"],
    VE:["Venezuela","latin-america-and-the-caribbean/venezuela-bolivarian-republic-of/~venezuela-bolivarian-republic-of","latin-america-and-caribbean/venezuela","venezuela-rb"],
    YE:["Yemen","northern-africa-and-western-asia/yemen/~yemen","arab-states/yemen","yemen-rep"],
    ZM:["Zambia","sub-saharan-africa/zambia/~zambia","africa/zambia","zambia"],
    ZW:["Zimbabwe","sub-saharan-africa/zimbabwe/~zimbabwe","africa/zimbabwe","zimbabwe"]
  };
  // Nước không có trang quốc gia ILO: dùng cổng chính phủ hoặc trang khu vực ILO (ghi rõ, không giả là trang quốc gia).
  var ALT_WORK = {
    AD: ['https://www.govern.ad/', 'Andorra'], BT: ['https://www.moice.gov.bt/', 'MoICE'], DM: ['https://dominica.gov.dm/', 'Dominica'],
    KP: [ILO + 'asia-and-pacific', 'Asia and the Pacific'], LI: ['https://www.liechtenstein.li/', 'Liechtenstein'], FM: ['https://gov.fm/', 'FSM'],
    MC: ['https://www.gouv.mc/', 'Monaco'], NR: ['https://www.nauru.gov.nr/', 'Nauru'], KN: ['https://www.gov.kn/', 'Kitts'], VC: ['https://www.gov.vc/', 'Vincent']
  };
  var SPECIAL = { VA: { edu: ['https://www.vaticanstate.va/en/', 'Vatican'], work: ['https://www.vaticanstate.va/en/', 'Vatican'], wed: ['https://www.vatican.va/content/vatican/en.html', 'Holy See'] } };
  var EXTRA_TITLE = { CD: ['Congo'], PS: ['West Bank'], CZ: ['Czechia'], TR: ['Turkiye'], KP: ["People"], CI: ['Cote'] };

  function urls(cc) {
    var s = SRC[cc], names = [s[0]].concat(EXTRA_TITLE[cc] || []), sp = SPECIAL[cc] || {}, out = {};
    out.edu = sp.edu ? { url: sp.edu[0], expect: [sp.edu[1]] } : { url: PEER + s[1], expect: names };
    out.work = sp.work ? { url: sp.work[0], expect: [sp.work[1]] } : s[2] ? { url: ILO + s[2], expect: names } : { url: ALT_WORK[cc][0], expect: [ALT_WORK[cc][1]] };
    out.culture = { url: UN + cc.toLowerCase(), expect: names };
    out.wed = sp.wed ? { url: sp.wed[0], expect: [sp.wed[1]] } : { url: GD + s[3], expect: names };
    return out;
  }

  function pick(cc, n) { return (cc.charCodeAt(0) * 7 + cc.charCodeAt(1) * 3) % n; }
  function cname(cc) { return (G.W.BY[cc] && G.W.BY[cc].name) || cc; }
  function lower1(s) { return s.charAt(0).toLowerCase() + s.slice(1); }

  // Sự kiện nhiều năm dựng từ chính dữ liệu đã biên soạn của nước đó (tên lộ trình, kỳ thi, lễ, quy định lao động, bước cưới),
  // đi qua cùng cơ chế caseWhy/startCase/finishCase của life173 (2 lượt theo dõi qua các năm, có thất bại, gián đoạn).
  function events(cc, sp) {
    var N = cname(cc), v = pick(cc, 3), k = cc.toLowerCase(), e = sp.e, f = sp.f[0], w = sp.w[sp.wi == null ? 1 : sp.wi], m = sp.m;
    var exam = sp.x ? 'Nếu chọn hướng học thuật, bạn còn phải chuẩn bị ' + sp.x + '; ' : 'Điều kiện xét tuyển do hệ thống và từng cơ sở ở đây quy định, bạn cần đọc kỹ yêu cầu; ';
    return [
      { id: k + '_route912', kind: 'education', min: 15, max: 19, source: 'edu',
        title: ['Chọn hướng sau bậc phổ thông tại ', 'Buổi hướng nghiệp cuối cấp ở ', 'Kế hoạch học tiếp của học sinh ở '][v] + N,
        text: 'Người tư vấn hư cấu muốn bạn so sánh ' + e[0][0] + ', ' + e[1][0] + ' và ' + e[2][0] + '. ' + exam + 'một buổi nói chuyện không tự cấp bằng hay suất học.',
        goal: 'tìm lộ trình học vừa sức tại ' + N },
      { id: k + '_training912', kind: 'training', min: 18, source: 'edu',
        title: ['Thử sức với ', 'Tìm hiểu kỹ ', 'Một buổi học thử: '][v] + lower1(e[1][0]) + ' (' + N + ')',
        text: e[1][1] + ' Người hướng dẫn hư cấu đề nghị bạn xem chương trình, bài thực hành và chi phí trước khi cam kết; không ai hứa việc làm sau một buổi.',
        goal: 'biết mình có hợp cách học và nghề này không', options: ['Xem chương trình và làm thử một bài thực hành', 'Dự buổi giới thiệu, chưa cam kết', 'Giữ ngân sách, để năm sau tính tiếp'],
        followup: 'Bạn đối chiếu bài thực hành với yêu cầu chương trình; bằng cấp vẫn phải học và được đánh giá đủ.' },
      { id: k + '_work912', kind: 'work', min: 18, source: 'work',
        title: ['Lịch ca mới và quy định ở ', 'Đối chiếu điều kiện làm việc tại ', 'Một đề nghị đổi giờ làm ở '][v] + N,
        text: 'Đơn vị hư cấu đề nghị đổi lịch làm. ' + w[0] + ': ' + w[1] + ' Bạn muốn đối chiếu hợp đồng và bảng chấm công trước khi nhận; chưa có kết luận ai làm sai.',
        goal: 'làm rõ lịch làm và cách trả công có căn cứ', options: ['Giữ bảng giờ và hẹn đối chiếu hợp đồng', 'Đề xuất lịch làm vừa sức khỏe và gia đình', 'Chưa nhận ca mới khi điều khoản chưa rõ'],
        followup: 'Bạn và người phụ trách đối chiếu từng ca với hợp đồng thay vì đoán theo một con số truyền miệng.' },
      { id: k + '_fest912', kind: 'community', min: 12, source: 'culture',
        title: f[1] + [' ở ' + N + ': góp sức vừa khả năng', ' cùng hàng xóm ở ' + N, ' tại ' + N + ' không cần chạy đua chi phí'][v],
        text: 'Người quen rủ bạn tham gia ' + f[1] + ' (' + f[2] + '): ' + f[4] + '. Không ai buộc phải chi nhiều hay theo một tín ngưỡng; bạn chọn mức tham gia phù hợp.',
        goal: 'tham gia lễ một cách tôn trọng, vừa ngân sách', options: ['Cùng chia việc và hẹn kiểm lại năm sau', 'Tham gia một phần, không nhận khoản chi', 'Xin phép không tham gia lần này'],
        followup: 'Nhóm xem lại khoản đã chi và cách tổ chức; ai không theo phong tục này vẫn được tôn trọng.' },
      { id: k + '_wed912', kind: 'marriage', min: 18, source: 'wed',
        title: ['Chuẩn bị chuyện cưới tại ', 'Tìm hiểu thủ tục kết hôn ở ', 'Hai người cùng bàn chuyện cưới ở '][v] + N,
        text: 'Hai bạn muốn tìm hiểu trước: ' + m.map(function (x) { return x[0]; }).join('; ') + '. Gia đình có thể góp ý nhưng không quyết định thay; tổ chức lễ không tự thay việc đăng ký.',
        goal: 'thống nhất cách tổ chức và thủ tục với người yêu',
        followup: 'Hai bạn kiểm lại sự đồng thuận, giấy tờ và ngân sách; đăng ký kết hôn vẫn là quyết định riêng của cả hai.' }
    ];
  }

  var added = [];
  function add(cc, sp) {
    if (!SRC[cc]) throw new Error('No source row for ' + cc);
    if (D.profiles[cc]) throw new Error('Country already has a depth profile: ' + cc);
    var key = { edu: cc.toLowerCase() + 'Edu912', work: cc.toLowerCase() + 'Work912', culture: cc.toLowerCase() + 'Culture912', wed: cc.toLowerCase() + 'Wed912' }, u = urls(cc);
    Object.keys(key).forEach(function (kind) { D.sources[key[kind]] = u[kind].url; });
    var p = {
      countryCode: cc,
      education: sp.e.map(function (x, i) { return { id: ['academic', 'vocational', 'higher'][i] + '912', name: x[0], note: x[1], route: ['academic', 'vocational', 'applied'][i], source: key.edu }; }),
      festivals: sp.f.map(function (x) { return { id: /_[a-z]{2}$/.test(x[0]) ? x[0] : x[0] + '_' + cc.toLowerCase(), name: x[1], date: x[2], calendar: x[3], activity: x[4], since: x[5], source: key.culture }; }),
      marriage: sp.m.map(function (x, i) { return { id: 'wed' + i + '912', name: x[0], note: x[1], source: key.wed }; }),
      cuisine: { dishes: sp.d.slice(), source: key.culture },
      labor: sp.w.map(function (x, i) { return { id: 'work' + i + '912', name: x[0], note: x[1], source: key.work }; }),
      lifeEvents: events(cc, sp).map(function (ev) { ev.source = key[ev.source]; return ev; })
    };
    if (sp.x) p.exam = sp.x;
    p.metadata = { verifiedAt: '2026-11-01', referenceYear: 2026, confidence: 'source-linked', authoring: 'compiled-912', legalFrom: 2026, futurePolicy: 'game-assumption', sources: [] };
    ['education', 'festivals', 'marriage', 'labor', 'lifeEvents'].forEach(function (field) {
      p[field].forEach(function (v) { v.countryCode = cc; if (p.metadata.sources.indexOf(v.source) < 0) p.metadata.sources.push(v.source); });
    });
    if (p.metadata.sources.indexOf(p.cuisine.source) < 0) p.metadata.sources.push(p.cuisine.source);
    D.profiles[cc] = p; added.push(cc);
  }
  E.COUNTRY_WORLD912 = { SRC: SRC, urls: urls, add: add, added: added, events: events };
})(globalThis.G);
