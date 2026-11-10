# Nhiếp chính và đối chiếu lịch sử — mốc65

HOÀN THÀNH TRIỂN KHAI MỐC65 — KIỂM THỬ TRỌNG ĐIỂM ĐẠT — CHƯA NGHIỆM THU TOÀN DIỆN; chưa hoàn tất toàn bộ yêu cầu. Nền khôi phục3f0512b là mốc64. Tiếp tục cả danh sách docs/REMAINING-863-PROGRESS.md, không dừng sau65.

## Mã hiện có, chưa commit

- royal865.js nối registry920/858/861/862, không tạo registry nhân vật mới. index thêm sau education863, trước royal864. app.js có ngày sinh xác minh trong form tên Tây Ban Nha và form biên bản Hội đồng Nhiếp chính.
- Monaco1962: đã đọc ảnh trang905 công báo5490 gốc; trực hệ hợp pháp, con nuôi/hậu duệ con nuôi khi không có hậu duệ hợp pháp; nhận nuôi có hồ sơ solemn riêng. Không tự thêm anh chị em như luật2002. Tuổi thực hiện quyền21 trước06/04/2002,18 sau. Đã xác minh Loi1249Art2 ở công báo7541, không chỉ dựa bộ luật hiện hành.
- Monaco2002statutes từ08/06/2002:4vị trí Hội đồng;2015:7;2022:7/8 tùy phối ngẫu đủ điều kiện, chủ tọa và tối đa2người không quốc tịchMC. Ủy quyền tạm thời khác kết luận mất khả năng; sau2022heiradult hoặc council nếuminor;2015/2002 xét phối ngẫu/người trưởng thành theo điều kiện đúng thời kỳ. Vẫn giữ người giữ ngôi, không đổi ngôi vì bệnh.
- Hồ sơ incapacity: request/evidence/refer/recognize năm sau/restore, authorityCrownCouncilMonaco và CortesSpain. Các thao tác rõ kịch bản, không là hồ sơ nhà nước thật.
- Council: thành phần theooffice, reference, quốc tịch, tuổi tương đối; attendance/direct/proxy/max1proxy; conflicts loạiquorum;quorum5;simplemajority/tiechair. Mọi vị trí dự phải có phiếu/abstain. Chair không do người vắng chỉ cóủyquyền chủtrì. configure lưu lịch sử, sessionIDs chống lặp qua cả lịch sử. Không tạo tên người ảo cho công chức; danh mục là vị trí thiết chế. UI8/7fieldsets cho người chơi nhập kịch bản.
- M.council stepregency từ2022 bắt buộc phiên hợp lệ đúngcandidate và sauđềcử; menu mở monacoSession865. CrownCouncil vẫn bước quyết định mô phỏng riêng, không tự gán quorum chưa có nguồn.
- Monaco hộ tịch: nút cũ dùng currentparent.spouse đã thay bằng monacoCivil865. Người chơi xác lập rõhai cha mẹ (IDs), không tự nhận bạn đời hiện tại là cha/mẹmọitrẻ. Cần hôn nhân đã xảy ra và được chấp thuận qua wedding837/royal920. Nhận filiation sau hôn nhân/không rõ thứ tự cùngnăm cần possessionétat, nộp, chờnăm và phán quyết. Không tự sinh đámcưới. Hiệu lực hộ tịch từ ngàyhônnhân/knownFrom riêng, không sửa nhật ký cũ. Posthumous chỉkhi códescendants. M.recordLegitimation API cũ giữ tương thích nhưngUIkhông còn booleansmộtclick.
- Spain hiện đại: regent18+Spanish nationality riêng explicit, unknown không tự suy ra từcountry837; parent thennearesteligibleline;incapacityCortes nhậnxétsau hồsơ; fallbackCortes1/3/5;guardianwillSpanishbybirth/parentwidow/Cortes, chốngkiêmnhiệmregenttrừdirectascendants qua haicha mẹ. Đã thêm kết thúc/giữ lịch sử giám hộ khi trưởng thành, qua đời, đổi người giữ ngôi, chính trị hoặc không còn là cha/mẹ góa; nhiếp chính cha/mẹ không bị buộc cùng điều kiện góa của giám hộ.
- Quốc tịchSpain mới freshscenario gắnES, savecũunknown giữpendingcóUIđối chiếu; m.es862.nationalities865. S.roleOverride dừngcôngvụ khi quânchủMC/ESkhôngđủtuổi/mấtkhảnăng; ESgrant/special/courtesy/revoke chặn quyềnquânchủ đangnhiếpchính.
- Spainhọ: từ06/02/2000cócha mẹthỏathuậnđảohọ;trướcđómặcđịnhcha trướcmẹ kểcảargparentlàmẹ;2017khôngkhẳngđịnhlàlầnđầuchọnđảohọ. Anhchịemcùnghai cha mẹ giữorderđãđăngký. Source1999Law dùngtrướcmốc2017. Transitionminorfullsiblings1999chưaUI/đổiđăngkýriêng — CẦN LÀM.
- Ngàychínhxác S.date bắtbuộccùngnămhiệntại vàcalendarvalid; staleoverridekhôngghim thời gian. ESformngàysinh đúngby,khôngtươnglai; oldyearonlykhôngtựnhậnInfante nếu cùngnăm cha/mẹmấtAsturias vàkhôngbiếtthứtự. Đã có test thực tế sameyear/cutoff và sửa lại ngày sau khi trước đó có căn cứ tự tính; UI báo lỗi ngày sai trước consume.
- EStransitions keyed explicitreference865:Juan/MariaMercedes/Pilar/Margarita1987,JuanCarlos/Sofia2014; khôngmatchname,khôngtruyềncon/phốingẫu,ngườimấtkhônggiữlifehonorific. markReferencehiệntạiAPI/fixtures,chưaUIthamchiếusổpháplý. Khôngápchođangseat.

## Nguồn

- https://journaldemonaco.gouv.mc/content/download/60254/1401881/file/JO_1962_J_5490.pdf .cache/mc1962.pdf,.cache/mc1962-page5.png đãxem; skillPDFđãđọc vàthôngbáo.
- https://journaldemonaco.gouv.mc/Journaux/2002/Journal-7541/Loi-n-1.249-du-2-avril-2002-portant-revision-de-la-Constitution-du-17-decembre-1962 Art2đổituổi18,Art10bộluậtmới;05/04pub->06/04.
- https://journaldemonaco.gouv.mc/en/Journaux/2002/Journal-7550/Ordonnance-Souveraine-n-15.368-du-29-mai-2002-relative-aux-Statuts-de-la-Famille-Souveraine Art6/7/8/9/13.
- 2015/2022 URLs trongmc861-data/royal865.sources. Original2015rawHTML.cache/mc2015.html; khôngdùngconsolidated2026backfillcácmốc.
- CivilArticles226-9..14 source https://legimonaco.mc/code/code-civil%402022.08.13/index.html : bothfiliation,marriageprior/laterfiliationjudgment,possessiond’état,posthumousdescendants,effectmarriagedate. 1986legalfrom.
- Spain1978Art59/60/61 https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a59 ;titles1368/1987Art5regentAlteza;DT1..4personal.
- Spain2000names https://www.boe.es/buscar/doc.php?id=BOE-A-1999-21569 .BOEexplicit06/02/2000effective.

## Đang nghiên cứu trước1978/1987 (CHƯA mã hóa)

- https://www.boe.es/buscar/doc.php?id=BOE-A-1967-5 LOE1967Art11absence/illnessheir30+elseRegencyCouncil;Art12tutorguardSpanishCatholic,incompatibleRegent/PrimeMinister/CortesPresident. DA4amendedsuccessionArticle9maleSpanish30Catholic,oath;Article11femaleCANNOTREIGNbuttransmittoheirs;under30regentuntil30;Art14incapacity2/3Government,2/3CouncilKingdom,Cortes. Khôngáp18+female1978ngược1975–1978.
- https://www.boe.es/boe/dias/1967/04/21/pdfs/A05250-05272.pdf consolidatedlawArt11same; nguồn1947first khácspecificdescendantswording. Chưalấyđượctextfull1947official, URLhttps://www.boe.es/datos/pdfs/BOE/1947/208/A04238-04239.pdf (chưamở).
- https://www.boe.es/buscar/act.php?id=BOE-A-1969-915 individualJuanCarlosdesignation; khôngbiếnthànhgenericroyalinheritance1947–1975.
- https://www.boe.es/buscar/pdf/1977/BOE-A-1977-1909-consolidado.pdf RD54/1977,22/01/1977effective; FelipepersonallyAsturias+traditionaltitles,khôngmọingườiđứngđầu1975trởđi.
- 1876primarySenado/Congresolinksởmaster,Art60malepriorityrepresentation. Cầnđọctuổiregencyguardianspecific1876vàperiod1923/1931;khôngapplyallpre1978.

## Kiểm tra tới hiện tại

- royal865158PASS (MCera,adoption,21/18,incapacity,quorum/proxy/conflict,ESregency/guardian/names/transition,civilactualR.wed). Cầnthêmnegativecases/UItestbiênbản.
- monaco861126PASS;fixturethêmthànhphần+phiếuthậttrướcM.councilregency,khôngnớiđiềukiện.
- spain862198,royal85884PASS ởmốctrướcmấybổsungcuối;chạytestảnhhưởnglạitrướcpackage.
- royal865-browser10menu/action390/1280PASSsource sauformcouncil; thậtghiESbirthDate8651980-03-10. Đã xem ảnhcouncil390; form quốc tịch dùng tên nước, trạng thái dịch tiếng Việt; browser kiểm tra thật session đã ghi và ngày sinh sai giữ form, ngày đúng được lưu. Testupdatesexpect65.
- Quick65 đãPASS11smoke/10saves/10save-safety/14NPC; cảnh báo cũ hc_story vàseedDate.now giữ rõ. Kết quả artifact và Git cuối ghi ở cuối sổ.

## Việc cần tiếp ngay

1. XemảnhsourceUIcouncil,hoànthiệnvalidationdayform/tutorend/MCcivilbranches &courtUInegative; thửMCcouncilformsubmitthật (browserđãclicknhưngchưaassertsessionpersist),nhữngmốcminoroldcouncil.
2. Spainhistoricrule/dataandpersonalrefs;EU6countriesexceptions;education76ages/deadlinesremaining. KhôngdừngsauMonaco/Spain.
3. Bump65/notespackaged,giữ187historyentries;quick+affectedtests+browser/source/dist;packagefreshZIP,explicitcommit/pushverifiedbranch. Khôngdeploy.
4. Sau65tiếptụcfullscope,khônggửifinalhoànthànhkhiMASTERcònmở.

## Kiểm chứng bổ sung

- royal865158: thêm khóa phiếu/đại diện/chủtọa, chấm dứt nhiếp chính khi quân chủ mất, cập nhật thành phần trong nhiếp chính;2002wife cần bằng chứng custody khi không phải ủy quyền tạm thời.
- monaco861126, spain862198, royal85884, royal83767, royal84359, royal847248, royal-birth-display186, md5-920118, royal860153, royal864808, children14138, family13067 PASS.
- Browser10menu/action ở390/1280source PASS, ghi thật biên bản quorum5 và ngày sinh1980-03-10; ngày sai bị chặn trên form. Không tràn/JS/NaN/undefined.
- update-release1092 và update-history-timezonesPASS;187mục cũ nguyên dữ liệu.
- Remoteoriginmercyx03/motdoi public;push/admin đã xác minh,0workflow/0hook/0deployment. Không deploy. REVIEWS_DBProduction chưa kiểm chứng.

## Điểm phải tiếp sau mốc65

- Quy chế1882 và các bản sửa trước2002 chưa đủ dữ liệu người nhiếp chính; chỉ áp tuổi21/18 và luật kế vị1962đã đọc. Không lấy2015điền ngược.
- Bổ sung toàn bộ các bước tên/giấy tờ một dòng cha mẹ và thay thứ tự cho fullsiblings minors theo chuyển tiếp2000; pre1978/1987Spain và EU6 còn mở trongMASTER.
- Rà sinh con/names của Spain: A.child cũ đang lấy parent.spouse để cho hai họ ngay cả khi coParent108 thiếu/khác. Cần dùng mã coParent108 đã có; không phá tên save cũ. Nối backfill tên khi dữ liệu birthđượcgán saulegacyka. R.kidsYear khiđãmarriedroyal dùngs.spouse cho mọikid cần kiểmtracoParent khác/nhánhcũ; không tự gán mọi con cho bạn đời mới. Đây là mục liên quan filiation/gia phả, làm ở bước tiếp, không tự coi xong.

## Artifact cuối mốc65

- Đã chạy lại smoke11/saves10/save-safety10/NPC14 sau nối ngày sinh: PASS. Các module ảnh hưởng nêu trên cũng PASS.
- Ngày sinh đã có trong nhân vật được nối vào hồ sơ, sửa chủ động cập nhật ngày/tháng nhân vật và con; snapshot/restore/chuyển đời giữ mốc đã biết, không bốc lại. Tuổi thực hiện quyền/đủ điều kiện nhiếp chính đối chiếu sinh nhật khi đã có ngày.
- package:cloudflare PASS;28files;ZIP3466950bytes;SHA256301C5401E00DC2BEEF534983D7E6D08CEAC25E8C24B58AB34F35C085BB59A51D. Đã đọc lại toàn bộ tên/nội dungZIP soSHA256dist; index.html ởgốc,Worker/routes/headers/.well-known được giữ.
- JSONdocs/source/dist vàHTMLnhúng đồng bộ;187mục cũ giữ nguyên,65packaged/releasedAtnull. correctedAt65 dùng để đồng bộ bản biên tập bổ sung ngày sinh; không sửa ngày phát hành cũ.
- Browserdist cuối sẽ được ghi ngay sau khi kết thúc; không coi artifact là Production-ready: chưa regression tổng thể/thiết bị/save thật và bindingREVIEWS_DB. Không deploy.
- Nền khôi phục3f0512b; dùnggitrevert commit đợt65,package lại và chủ dự án uploadDashboard, khôngreset/forcepush. Giữ thay đổi riêng healthsys919.js/world-country-jobs832-browser.js,Claude.md/audit/local/PROMPT; không stage chúng. Artifact có mã y tế ngoài commit.

- Browserdist cuối10menu/action390/1280PASS; biên bảnthật,ngàysinhsai/đúng,tìmkiếm/lọc/tảithêmnhậtký vàkhôngtràn/lỗiJSđạt.
