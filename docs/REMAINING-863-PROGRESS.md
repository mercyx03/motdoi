# Tiếp tục hoàn thiện các yêu cầu còn thiếu — bắt đầu từ nền e3eb853

Chủ dự án yêu cầu làm hết các phần còn thiếu đã liệt kê, ngoại trừ nghiệm thu toàn diện. Đây là một công việc liên tục; không dừng sau riêng giáo dục, không tự bắt đầu GĐ mới và không tuyên bố toàn bộ đã xong khi còn mục mở.

## Đã làm trong đợt đang chạy

- Mở rộng STUDY857, không tạo registry học sinh khác. Có cấu hình cơ bản đủ76 vùng trong danh mục Mỹ/Canada/Úc/GB; nguồn từng vùng ở education863-data.js, ảnh chụp10/11/2026. Chưa đồng nghĩa toàn bộ nghĩa vụ pháp lý/ngoại lệ của từng vùng đã được cấu trúc hóa.
- Quỹ giờ giám hộ dùng chung; tối đa6 đợt/24 giờ trong cấu hình mới, giới hạn gia đình theo người chăm sóc. Save cũ giữ giới hạn3/12 khi chưa có cờ phiên bản.
- Alberta supervised và Prairie South SK có hoàn chi phí thực, chứng từ, hạn tiếp nhận, trần; NZ theo phần kỳ/ngày ngoàiNZ.
- Khoa học GCSE hai đường, thêm ngoại ngữ có văn bằng, khóa kết quả. Hồ sơ provider cho GED/HiSET/AP/SAT/IGCSE/A-Level/IB/Leaving/NSC/HSC/VCE. HSC/VCE có học phần và đánh giá từng năm; không chỉ thêm lời kể.
- Học phần dual enrollment, đối chiếu tín chỉ theo cơ sở nhận; học bạ khi quay lại trường; đối chiếu học thuật Oxford và xét hồ sơ/nhập học vào cơ sở mô phỏng.
- education863267 kiểm tra lúc đầu, hiện287; study-home857204 (giảm38 assertion unknown vì các vùng đã mở), royal847248 sau chọn khoa học đúng đường mới; smoke/saves/save-safety/NPC đạt ở mốc trước sửa cuối. Browser nguồn8 menu390/1280 đạt.

## Còn phải tiếp tục cho toàn yêu cầu

1. Giáo dục: hoàn tất kiểm tra giao diện/build; bổ sung dữ liệu tuổi/ngoại lệ/hạn và đường văn bằng vào dữ liệu thay vì chỉ ghi chú khi đã xác minh. Rà lộ trình tuyển sinh, điều kiện riêng và tính toàn vẹn hồ sơ (không cấp bằng từ một nút xác nhận). Nguồn đang có trong các file dữ liệu và lịch sử công cụ; không tự suy ra luật khi chưa đọc nguồn.
2. Mốc64 đã triển khai thêm nghi lễ/tín ngưỡng/lịch lễ theo195 nơi sống và nguồn gốc; đã chặn một số ca vai trò đặc biệt, vườn hoàng gia. international864852 kiểm tra. Rà nội dung quốc tế tiếp nếu có ca ngoài danh mục: rà ngoài13 sự kiện tuổi thơ đã sửa; bản địa hóa theo nơi sống, vùng văn hóa, loại gia đình và thời kỳ; sự kiện chung phải trung tính, không gán tập tục Việt Nam. Không mặc định mọi nước có cùng phong tục hoặc hoàng gia đều ở cung điện.
3. Mốc64 đã có81 chủ đề theo tuổi cho27nước, hồ sơ court864 bốn bước qua5+năm với chứng cứ, quỹ riêng, ý kiến từng người, phân vai thử và xét lại;808 kiểm tra. Tiếp tục các ngoại lệ pháp lý4–6; chiều sâu phe phái/tranh vai trò, ảnh hưởng, bằng chứng, nguồn lực và hậu quả nhiều năm; sự kiện riêng cho27 nước theo cơ chế hiện có. Giữ tước và quyền kế vị độc lập với gây sức ép/thẩm mỹ.
4. Tước châu Âu: tiếp tục ngoại lệ thời kỳ/cá nhân của GB/BE/SE/DK/NL/LU từ sổ858; bổ sung dữ liệu có nguồn, không lấy một ca cá nhân thành luật chung.
5. Monaco: bộ luật trước2002/2015, mất khả năng tạm thời, chi tiết hai hội đồng, ngoại lệ tước/phối ngẫu và hộ tịch/phán quyết cần triển khai tiếp.
6. Tây Ban Nha: các bộ luật trước1978/1987, họ trước2017, nhiếp chính, chuyển tiếp1987/2014, tước địa danh và thay đổi cùng năm cần triển khai tiếp.
7. Nhật ký phát hành cũ đã đúng; bản63 mới packaged theo chính sách vì chưa có xác nhận upload riêng. Không deploy. Cuối đợt phải build dist/ZIP mới, kiểm nội dung/nhật ký, commit/push nhánh hiện tại. Chỉ bỏ qua nghiệm thu toàn diện, không bỏ test chuyên đề và tương thích.

## Dữ liệu ngoài phạm vi

Giữ Claude.md, .local-state-review.txt, audit-world-520.json. Không stage healthsys919.js, world-country-jobs832-browser.js, healthsys-rx-cap.js và các PROMPT riêng. Artifact vẫn chứa mã y tế có sẵn trong workspace; không tái dựng chính xác chỉ từ commit đợt này. Remote origin mercyx03/motdoi, nhánh codex/life-context-upgrade; không merge main hoặc deploy Cloudflare.

## Nguồn lịch sử mới đã tìm được, dành cho bước tiếp sau64

- Monaco công báo5490 ngày24/12/1962, bản gốc PDF: https://journaldemonaco.gouv.mc/content/download/60254/1401881/file/JO_1962_J_5490.pdf . ĐÃ ĐỌC ảnh trang5 (trang905): Art10 hậu duệ trực hệ hợp pháp ưu tiên nam; nếu không có hậu duệ hợp pháp thì con nuôi hoặc hậu duệ hợp pháp của con nuôi. Art11 tuổi thực hiện quyền21, không18! Hiến pháp có hiệu lực ngay17/12 theoArt96/diễn văn; bản PDF ở.cache/mc1962.pdf và ảnhpage5.png. Cần kiểm tra mốc sửa11 theoLoi1249 trước mã hóa; không lấy bản2002 làm1962.
- Monaco2002statutes: https://journaldemonaco.gouv.mc/en/Journaux/2002/Journal-7550/Ordonnance-Souveraine-n-15.368-du-29-mai-2002-relative-aux-Statuts-de-la-Famille-Souveraine . Công bố07/06/2002 ->08/06. Art6ủy quyền/khôngcóủyquyền: heiradult rồiwife rồinearestadult; Art7minor widowmothercustody thennearestadult,nationalityMC required; council4offices incldoyenCouronneNationalnomination, không2015seven. Wife remarried losesregency/custody. 1918adoptionorders repealed.
- Monaco2015original: https://journaldemonaco.gouv.mc/Journaux/2015/Journal-8228/Ordonnance-Souveraine-n-5.344-du-2-juin-2015-portant-statuts-de-la-Famille-Souveraine . Đã đọc đầy đủrawHTML.cachedmc2015.html. Arts4/7/8spouse/heir adult,Art9MCnational+resident,Art11council7,Art17remarriedspouse losesregency/custody;Art23divorcedspouse retainsMCnationalitypersonallynontransmissible.
- Monaco2022: https://journaldemonaco.gouv.mc/fr/Journaux/2022/Journal-8603/Ordonnance-Souveraine-n-9.389-du-29-juillet-2022-modifiant-l-Ordonnance-Souveraine-n-5.344-du-2-juin-2015-modifiee . From13/08. Councils7or8;spousechairsifnotseparated/impeded; otherwiseoldestappointedfourchairs. Max2nonnationals. Quorum5,oneproxy/member,tiechairvote,conflictabstainerexcluded. Noarbitraryuser clicks forassentwithoutactualquorum.
- SpainLey40/1999 https://www.boe.es/buscar/doc.php?id=BOE-A-1999-21569 . Effective06/02/2000 explicitlyBOEanalysis. Beforefatherthenmotherdefault;from2000agreementcanreversefirstchild bindsfullsiblings. Transitionminorfullsiblings orderchangebothparentsagreement+hearingcompetentminors+registralapproval; noautosilenceapproval.
- Spain1368/1987 consolidated https://www.boe.es/buscar/act.php?id=BOE-A-1987-25284 . DT1Juan/MaríadeMercedesCountBarcelonaHRHlife;DT2JuanCarlosactualsistersonlyInfantaHRHlifeNOspouse/children;DT3recognizedtitle+HRHpersonallylifeNOdesc;DT4since19/06/2014JuanCarlos/SofiahonorificKingQueenMajestadpersonallylife. NeedreferenceIDscope,nevermatchnameonly. Art5regentAltezaifnohigherstyle.
- SpainconstitutionArts59/60 https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229#a59 . Minorparentelseadultnearestline;incapacityrequiresCortesrecognitionthenadultheirelseminorregimeuntilheiradult;fallbackCortes1/3/5nationals18+. TutorwillSpanishbybirthadult,elsewidowedparent,elseCortes;regent/tutorincompatibleexceptdirectascendant.
- Spain1876original primary https://www.congreso.es/constitucion/ficheros/historicas/cons_1876.pdf and https://www.senado.es/web/conocersenado/senadohistoria/senado18341923/Constitucion1876/detalle/index.html?id=18760630_constitucion . Art60malepriorityrepresentation, needfullperiodvalidity/1931abolition+1975transition ratherthanapply1876throughall1978. No verifiedpre1987generalInfantetableyet.

## Mốc65 tiếp theo — chưa kết thúc toàn yêu cầu

- Monaco1962/2002: đã thêm hậu duệ/nhậnnuôi và tuổi21/18; nhiếp chính2002/2015/2022, hồ sơ mất khả năng/ủy quyền, phiên quorum/proxy/conflict/phiếu và holder không đổi. Hộ tịch có đúnghaicha mẹ + hôn nhân đã xảy ra + nộp/chờ/phán quyết khi cần. Chi tiết docs/ROYAL-865-PROGRESS.md.
- Tây Ban Nha hiện đại: nhiếp chính/giám hộ/quốc tịch riêng/Cortes; mốc họ06/02/2000; ngày sinh/cutoff cùngnăm, sửa ngày có lịch sử; các ca tham chiếu1987/2014.
- royal865158, monaco861126, spain862198; smoke/saves/save-safety/NPC và các module ảnh hưởng đạt. Browser10menu/action390/1280source đạt, có ghi thật biên bản và ngày sinh; artifact cuối/Git xem sổ865.
- Còn phải làm: dữ liệu giáo dục chi tiết; luật/ngoại lệEU6; Monacoquychế1882trước2002; Spaintrước1978/1987, chuyển tiếpfullsiblingsminor2000 và nguồn tước địa danh; coParent108/họ khi sinh và đổi bạn đời (chi tiết sổ865). Không dừng sau65.

Nguồn EU cho bước66: NLFrisoactual24/04/2004wedding,KB19/03published31/03effectiveatmarriage https://zoek.officielebekendmakingen.nl/stb-2004-126 và https://www.koninklijkhuis.nl/leden-koninklijk-huis/in-memoriam/prins-friso/huwelijk-en-gezin . RetainsPrinceOrangeNassauHRHpersonally,hereditaryCount, surnameVanOranje-NassauvanAmsberg;losePrinceNetherlands/RoyalHouse/lineafterunauthorizedmarriage.
LUofficial https://monarchie.lu/fr/actualites/predicats-et-titres 28/02/2014:JeanrenunciationdoesNOTchangetitles/styles,nofinancialcompensation;childrenCountNassau1995->PrinceNassauHRH2004(personalbranch,yearspecificnotpreciseday). Gov1986namesmalelegitconsenteddescendants source https://sip.gouvernement.lu/dam-assets/publications/bulletin/1986/BID_1986_6/BID_1986_6.pdf . Official2012GuillaumeGrandDucHeritieratwedding https://monarchie.lu/fr/actualites/mariage-princier-prince-guillaume-princesse-stephanie-ceremonie-civile confirmsactualhistoricreferencebefore2023,notgenericage18lawbyitself.

## Bổ sung của chủ dự án — phạm vi toàn game, đang triển khai

- Yêu cầu mới áp dụng TẤT CẢ chỗ ghi “mô phỏng”, không chỉ trường Y: bỏ nhãn thừa, thay tên/dữ liệu tự đặt bằng thông tin thật được đối chiếu, giữ ghi chú tình huống chính trị khi cần. Không được chỉ xóa chữ rồi công bố tham số tự đặt thành thông tin thật. Rà cả trường/ngành/chứng chỉ, nghề nghiệp, ngân hàng/tài chính, thể thao, y tế, cư trú/quốc tịch, phong tục và đời sống.
- Kiểm kê ban đầu:87 file JS,260 dòng có cụm này (bao gồm cả chú thích kỹ thuật); .cache/simulation-wording866.json là bản kiểm kê tạm, chưa phải kết quả hoàn thiện. Nhật ký cũ là lịch sử công bố, giữ nguyên; không sửa lời cũ hàng loạt.
- ĐÃ SỬA NaN biểu quyết doanh nghiệp cha mẹ: voters908 trước đây dùng100/p.length nhưng p là từng người, không phải mảng. Đổi sang số phụ huynh còn sống; không sửa cổ phần/tài sản. Bổ sung hai/một/không phụ huynh và tải lại. tests/dynasty908.js2285 PASS.
- ĐÃ BỎ bước đổi toàn bộ tên đại học thật sang nhóm giả ở royal847; giữ IDs và lịch sử bản lưu, không biến ngưỡng điểm tự đặt thành điểm chuẩn chính thức. royal847248 PASS. CHƯA hoàn thiện dữ liệu/đường tuyển sinh của mọi trường, fallback công lập giả ở life67 và thông tin sai thành phố/nhập học chuyên nghiệp ở Mỹ còn cần sửa; chưa tuyên bố dữ liệu toàn game là thật.
- Đợt66 còn đang làm: chưa nâng version/changelog, chưa build hoặc push các thay đổi đang dở. dist/dist.zip ổn định vẫn của65(a5800ea), KHÔNG coi là artifact của đợt này. Cần tiếp tục dữ liệu thật toàn game, kiểm thử, bản lưu, build/ZIP và commit/push theo quy trình; vẫn không nghiệm thu toàn diện hoặc deploy.

Mốc66 đang chốt artifact Preview: chi tiết REFERENCE-866-PROGRESS.md. Có sửa NaN, tên trường/sở thích/DELF-DALF, biểu VND Vietcombank có nguồn và coParent108. Công cụ kiểm kê mở rộng264file/104file369dòng ứng viên cần rà; không đồng nghĩa toàn game đã được thay dữ liệu thật. Các mục mở phía trên vẫn tiếp tục, không coi66là kết thúc toàn yêu cầu.
