/* Bộ tên theo văn hóa cho chế độ Thế giới.
   order: 'sf' = họ trước tên (Đông Á, Hungary…), mặc định tên trước họ.
   fem: quy tắc đổi họ cho nữ ('slav', 'cz', 'gr'); LF = danh sách họ riêng cho nữ.
   style: 'double' (2 họ, kiểu Tây Ban Nha/Bồ Đào Nha), 'patronym' (họ = tên cha), 'bin' (bin/binti).
   Với cn/kr/jp/kp/sg mỗi mục có dạng Latin:chữ gốc(:Hán-Việt). */
(function (G) {
  'use strict';
  var P = {
    cn: { order: 'sf', native: 1,
      L: 'Wang:王:Vương,Li:李:Lý,Zhang:张:Trương,Liu:刘:Lưu,Chen:陈:Trần,Yang:杨:Dương,Huang:黄:Hoàng,Zhao:赵:Triệu,Wu:吴:Ngô,Zhou:周:Chu,Xu:徐:Từ,Sun:孙:Tôn,Ma:马:Mã,Zhu:朱:Chu,Hu:胡:Hồ,Guo:郭:Quách,He:何:Hà,Lin:林:Lâm,Gao:高:Cao,Luo:罗:La',
      M: 'Hao:浩:Hạo,Wei:伟:Vĩ,Yu:宇:Vũ,Jie:杰:Kiệt,Ming:明:Minh,Jun:俊:Tuấn,Lei:磊:Lỗi,Tao:涛:Đào,Yang:洋:Dương,Chen:晨:Thần,Haoran:浩然:Hạo Nhiên,Yuxuan:宇轩:Vũ Hiên,Junjie:俊杰:Tuấn Kiệt,Zhiqiang:志强:Chí Cường,Zixuan:子轩:Tử Hiên,Bowen:博文:Bác Văn,Jianguo:建国:Kiến Quốc,Ruichen:瑞辰:Thụy Thần',
      F: 'Xin:欣:Hân,Jing:静:Tĩnh,Li:丽:Lệ,Na:娜:Na,Ying:颖:Dĩnh,Yan:燕:Yến,Xiaoyu:晓雨:Hiểu Vũ,Zihan:梓涵:Tử Hàm,Yutong:雨彤:Vũ Đồng,Xinyi:欣怡:Hân Di,Shiyu:诗雨:Thi Vũ,Mei:美:Mỹ,Fang:芳:Phương,Lan:兰:Lan,Ruoxi:若曦:Nhược Hi,Yuxi:语汐:Ngữ Tịch,Jiayi:佳怡:Giai Di,Hui:慧:Tuệ' },
    sg: { order: 'sf', native: 1,
      L: 'Tan:陈:Trần,Lim:林:Lâm,Lee:李:Lý,Ng:黄:Hoàng,Ong:王:Vương,Wong:黄:Hoàng,Goh:吴:Ngô,Chua:蔡:Thái,Chan:曾:Tằng,Koh:许:Hứa,Teo:张:Trương,Ang:洪:Hồng,Yeo:杨:Dương,Tay:郑:Trịnh',
      M: 'Wei Ming:伟明:Vĩ Minh,Jun Jie:俊杰:Tuấn Kiệt,Zhi Hao:志豪:Chí Hào,Kai Xiang:凯翔:Khải Tường,Jia Hao:家豪:Gia Hào,Yong Sheng:永胜:Vĩnh Thắng,Wen Jie:文杰:Văn Kiệt,Rui En:睿恩:Duệ Ân',
      F: 'Hui Min:慧敏:Tuệ Mẫn,Xin Yi:欣怡:Hân Di,Jia Ying:佳颖:Giai Dĩnh,Li Ting:丽婷:Lệ Đình,Shu Fen:淑芬:Thục Phân,Wen Qi:文琪:Văn Kỳ,Yu Xuan:雨萱:Vũ Huyên,Mei Ling:美玲:Mỹ Linh' },
    kr: { order: 'sf', native: 1,
      L: 'Kim:김,Lee:이,Park:박,Choi:최,Jung:정,Kang:강,Cho:조,Yoon:윤,Jang:장,Lim:임,Han:한,Oh:오,Seo:서,Shin:신,Kwon:권,Hwang:황,Song:송',
      M: 'Min-jun:민준,Seo-jun:서준,Do-yun:도윤,Ye-jun:예준,Si-woo:시우,Ha-jun:하준,Ji-ho:지호,Joo-won:주원,Ji-hoon:지훈,Hyun-woo:현우,Jun-seo:준서,Eun-woo:은우,Dong-hyun:동현,Sung-min:성민,Tae-yang:태양,Woo-jin:우진',
      F: 'Seo-yeon:서연,Seo-yun:서윤,Ji-woo:지우,Ha-eun:하은,Min-seo:민서,Ji-yoo:지유,Yoon-seo:윤서,Chae-won:채원,Su-ah:수아,Ji-min:지민,Da-eun:다은,Ye-eun:예은,Soo-jin:수진,Hye-jin:혜진,Yu-na:유나,Ha-rin:하린' },
    kp: { order: 'sf', native: 1,
      L: 'Kim:김,Ri:리,Pak:박,Choe:최,Jong:정,Kang:강,Jo:조,Han:한,Ryu:류,Hong:홍,Ryang:량,O:오',
      M: 'Chol-min:철민,Song-il:성일,Kwang-hyok:광혁,Myong-chol:명철,Jin-hyok:진혁,Yong-su:영수,Il-nam:일남,Chung-guk:충국,Hyok-chol:혁철,Un-chol:은철',
      F: 'Kum-hui:금희,Son-hwa:선화,Un-jong:은정,Hyang-mi:향미,Ok-sun:옥순,Myong-hui:명희,Chun-hwa:춘화,Yong-ae:영애,Hye-gyong:혜경,Su-ryon:수련' },
    jp: { order: 'sf', native: 1,
      L: 'Sato:佐藤,Suzuki:鈴木,Takahashi:高橋,Tanaka:田中,Watanabe:渡辺,Ito:伊藤,Yamamoto:山本,Nakamura:中村,Kobayashi:小林,Kato:加藤,Yoshida:吉田,Yamada:山田,Sasaki:佐々木,Matsumoto:松本,Inoue:井上,Kimura:木村,Hayashi:林,Shimizu:清水',
      M: 'Haruto:陽翔,Sota:蒼太,Ren:蓮,Minato:湊,Yuto:悠斗,Riku:陸,Hinata:陽向,Sora:颯,Daiki:大輝,Takumi:拓海,Kenta:健太,Yuki:勇気,Haruki:春樹,Kaito:海斗,Itsuki:樹,Shota:翔太',
      F: 'Himari:陽葵,Mei:芽依,Tsumugi:紬,Sakura:桜,Yui:結衣,Mio:澪,Rin:凛,Aoi:葵,Hina:陽菜,Yuna:結菜,Akari:朱莉,Hana:花,Misaki:美咲,Nanami:七海,Koharu:心春,Saki:咲' },
    th: { M: 'Somchai,Somsak,Anan,Kittisak,Nattapong,Thanakorn,Prasert,Wichai,Chaiwat,Pongsakorn,Phuwadon,Thanawat,Sarawut,Apichat',
      F: 'Siriporn,Nattaya,Ploy,Kanokwan,Pimchanok,Supaporn,Wanida,Malee,Chompoo,Arunee,Duangjai,Rattana,Sasithorn,Pornthip',
      L: 'Saetang,Srisuk,Wongsawat,Chaiyaporn,Thongchai,Rattanakorn,Sukprasert,Boonmee,Kaewmanee,Phromma,Jaidee,Somboon,Charoenpol,Inthasorn' },
    kh: { order: 'sf', L: 'Sok,Chea,Kim,Heng,Chan,Meas,Keo,Pich,Sum,Ly,Nhem,Prak,Seng,Ouk,Touch',
      M: 'Dara,Sophal,Vuthy,Rithy,Sokha,Visal,Piseth,Vannak,Chantha,Kosal,Samnang,Sovann,Rotha,Pheakdey',
      F: 'Sreymom,Sophea,Chanthou,Bopha,Malis,Sreyneang,Phalla,Sokunthea,Raksmey,Channary,Kanha,Sreyleak,Davy,Leakhena' },
    la: { M: 'Somphone,Khamla,Bounmy,Souksavanh,Phonesavanh,Thongchanh,Vilay,Kongkham,Sengphet,Bouasone,Khamphet,Anousone',
      F: 'Keo,Noy,Vanida,Malaythong,Phetsamone,Chanthala,Souphaphone,Manivanh,Bouakham,Douangchanh,Sisouk,Phonevilay',
      L: 'Phommachanh,Sisavath,Vongsa,Keomany,Inthavong,Phengsavath,Saysana,Sengsouriya,Chanthavong,Douangdeuane,Xayavong,Souvannavong' },
    mm: { M: 'Aung Ko,Zaw Min,Kyaw Zin,Htet Naing,Min Thu,Thant Zin,Aung Myo,Ye Lin,Kyaw Kyaw,Soe Moe,Hein Htet,Myo Win',
      F: 'Su Su,Aye Aye,Thandar,Nilar,Hnin Wai,May Thu,Ei Mon,Khin Khin,Phyu Phyu,Thiri,Zin Mar,Yadanar',
      L: 'Aung,Min,Htun,Oo,Naing,Win,Kyaw,Zaw,Lwin,Tun', LF: 'Hlaing,Myint,Thant,Nwe,Mon,Kyi,Aye,Htwe,Phyo,San' },
    id: { M: 'Budi,Agus,Andi,Rizky,Dimas,Fajar,Hendra,Arif,Bayu,Eko,Muhammad,Aditya,Yoga,Reza,Wahyu,Ilham',
      F: 'Siti,Dewi,Putri,Ayu,Sri,Nur,Rina,Indah,Fitri,Wulan,Anisa,Dian,Ratna,Nabila,Aulia,Mega',
      L: 'Santoso,Wijaya,Saputra,Pratama,Hidayat,Kusuma,Setiawan,Nugroho,Gunawan,Susanto,Purnomo,Siregar,Simanjuntak,Hasibuan,Ramadhan,Firmansyah',
      LF: 'Lestari,Wati,Rahayu,Sari,Kurniawati,Puspita,Handayani,Wulandari,Saputri,Pratiwi,Anggraini,Permata' },
    my: { style: 'bin', M: 'Ahmad,Muhammad,Amir,Haziq,Faiz,Danial,Hafiz,Irfan,Aiman,Syafiq,Zulkifli,Hakim,Firdaus,Aqil,Rizal,Azman',
      F: 'Nur Aisyah,Siti Nurhaliza,Nurul Izzah,Aina,Aisyah,Sofea,Alya,Hannah,Damia,Farah,Nabila,Puteri,Balqis,Qistina,Zara,Hidayah',
      L: 'Abdullah,Ismail,Hassan,Ibrahim,Yusof,Rahman,Osman,Hamid,Razak,Aziz,Salleh,Ahmad,Kamal,Jamil' },
    ph: { M: 'Jose,Juan,Mark,John Paul,Christian,Jericho,Angelo,Carlo,Miguel,Rafael,Joshua,Kenneth,Ramon,Paolo,Nathaniel,Rodel',
      F: 'Maria,Angelica,Kristine,Princess,Mary Joy,Jasmine,Nicole,Andrea,Rose Ann,Camille,Kimberly,Althea,Lorna,Joy,Mae,Divina',
      L: 'Santos,Reyes,Cruz,Bautista,Ocampo,Garcia,Mendoza,Torres,Tomas,Andrada,Castillo,Flores,Villanueva,Ramos,Dela Cruz,Aquino,Navarro,Mercado' },
    in: { M: 'Aarav,Vivaan,Aditya,Arjun,Rohan,Rahul,Amit,Suresh,Ramesh,Vijay,Sanjay,Arun,Karthik,Imran,Mohammed,Rajesh,Deepak,Harpreet,Ankit,Manoj',
      F: 'Priya,Ananya,Aadhya,Diya,Pooja,Sunita,Kavita,Lakshmi,Meera,Neha,Anjali,Divya,Fatima,Shreya,Kavya,Sneha,Pallavi,Rekha,Simran,Asha',
      L: 'Sharma,Kumar,Singh,Patel,Gupta,Yadav,Reddy,Iyer,Nair,Das,Mishra,Khan,Verma,Joshi,Rao,Chauhan,Pillai,Banerjee,Mehta,Ansari,Mukherjee,Kaur' },
    pk: { M: 'Muhammad,Ali,Ahmed,Hassan,Usman,Bilal,Hamza,Imran,Faisal,Zain,Abdullah,Asad,Tariq,Saad,Waqas,Shahid',
      F: 'Ayesha,Fatima,Zainab,Hira,Sana,Maryam,Amna,Iqra,Sadia,Nimra,Mahnoor,Rabia,Saba,Kiran,Aliya,Noor',
      L: 'Khan,Ahmed,Malik,Hussain,Butt,Qureshi,Chaudhry,Shah,Iqbal,Raza,Akhtar,Siddiqui,Abbasi,Rajput,Awan,Baloch' },
    bd: { M: 'Mohammad,Abdul,Rafiq,Sabbir,Tanvir,Arif,Mahmud,Rakib,Shakil,Nayeem,Sohel,Kamal,Habib,Rashed,Sumon,Jahid',
      F: 'Fatema,Nusrat,Sharmin,Taslima,Farzana,Ayesha,Sadia,Jannat,Sumaiya,Rumana,Shirin,Nasrin,Tania,Mitu,Moushumi,Rupa',
      L: 'Hossain,Rahman,Islam,Ahmed,Uddin,Alam,Chowdhury,Sarkar,Miah,Haque,Roy,Das,Mondal,Sheikh',
      LF: 'Akter,Khatun,Begum,Sultana,Islam,Rahman,Chowdhury,Roy,Das,Parvin' },
    lk: { M: 'Kasun,Nuwan,Chamara,Dinesh,Saman,Tharindu,Ruwan,Lahiru,Asanka,Mahesh,Pradeep,Nimal,Kumar,Sivakumar',
      F: 'Nadeesha,Dilini,Chathurika,Sanduni,Ishara,Hasini,Kumari,Nirosha,Tharushi,Madhavi,Anoma,Sachini,Priyanka,Kavitha',
      L: 'Perera,Fernando,de Silva,Bandara,Jayasinghe,Rathnayake,Wickramasinghe,Gunawardena,Dissanayake,Herath,Kumara,Senanayake,Rajapaksha,Sivanathan' },
    np: { M: 'Ram,Bikash,Suman,Sagar,Prakash,Krishna,Anish,Rajesh,Dipesh,Bishal,Sanjay,Hari,Nabin,Roshan',
      F: 'Sita,Gita,Sunita,Anjali,Pooja,Sarita,Asmita,Kabita,Sabina,Rojina,Srijana,Laxmi,Sushmita,Puja',
      L: 'Shrestha,Gurung,Tamang,Thapa,Magar,Rai,Adhikari,Karki,Sharma,Poudel,Bhattarai,Khadka,Limbu,Maharjan,Basnet,Yadav' },
    bt: { M: 'Tshering,Dorji,Karma,Sonam,Pema,Kinley,Ugyen,Jigme,Ngawang,Tashi,Sangay,Namgay',
      F: 'Dechen,Choki,Pema,Sonam,Kinley,Yangchen,Tshering,Deki,Dema,Karma,Zangmo,Wangmo',
      L: 'Dorji,Wangchuk,Tenzin,Norbu,Penjor,Gyeltshen,Namgyel,Rinzin,Phuntsho', LF: 'Wangmo,Zangmo,Lhamo,Yangzom,Choden,Dema,Pelden,Yangki,Lhaden' },
    ar: { M: 'Mohammed,Ahmed,Ali,Omar,Youssef,Khalid,Hassan,Ibrahim,Abdullah,Mahmoud,Mustafa,Karim,Tariq,Salem,Hamza,Yassin,Adam,Rami,Said,Bilal',
      F: 'Fatima,Mariam,Aisha,Nour,Layla,Sara,Huda,Amira,Salma,Rania,Yasmin,Hana,Zainab,Rahma,Dina,Lina,Khadija,Malak,Jana,Hiba',
      L: 'Al-Hassan,Al-Ahmad,Haddad,Mansour,Khalil,Saleh,Nasser,Hamdan,Al-Masri,Darwish,Ibrahim,Abdallah,Al-Sayed,Othman,Farouk,Hussein,Mahmoud,Al-Rashid,Bakr,Qasim,Benali,El Amrani,Bouzid,Al-Tamimi' },
    af: { M: 'Ahmad,Mohammad,Abdul,Farid,Hamid,Wahid,Rahim,Najib,Sharif,Zabihullah,Mirwais,Habib,Jawad,Samiullah',
      F: 'Fatima,Zahra,Maryam,Mariam,Shabnam,Laila,Freshta,Malalai,Nargis,Parwana,Zarghona,Sima,Homa,Sakina',
      L: 'Ahmadzai,Karimi,Rahimi,Hakimi,Popal,Noori,Sultani,Wardak,Stanekzai,Hashimi,Amiri,Safi,Durrani,Haidari' },
    fa: { M: 'Mohammad,Ali,Hossein,Reza,Amir,Mehdi,Hamid,Arash,Kian,Dariush,Parsa,Saeed,Babak,Farhad,Hamed,Sina',
      F: 'Fatemeh,Zahra,Maryam,Narges,Sara,Leila,Shirin,Nazanin,Parisa,Mahsa,Niloufar,Roya,Yasmin,Setareh,Ziba,Elham',
      L: 'Hosseini,Mohammadi,Ahmadi,Rezaei,Moradi,Karimi,Jafari,Rahimi,Sadeghi,Hashemi,Ghorbani,Mousavi,Tehrani,Kazemi,Azizi,Rostami' },
    tj: { fem: 'slav', M: 'Firdavs,Rustam,Farrukh,Shohrukh,Jamshed,Behruz,Daler,Sino,Umed,Bakhtiyor,Siyovush,Faridun',
      F: 'Madina,Nigina,Zarina,Mehrona,Shahnoza,Firuza,Gulnora,Parvina,Malika,Sitora,Nilufar,Dilnoza',
      L: 'Rahimov,Karimov,Saidov,Nazarov,Sharipov,Davlatov,Rajabov,Kurbonov,Mirzoev,Safarov,Nabiev,Sodiqov' },
    ca: { fem: 'slav', M: 'Nurlan,Yerlan,Daniyar,Aibek,Timur,Rustam,Bekzod,Sardor,Azamat,Askar,Bakhyt,Dauren,Jasur,Islom,Murat,Serdar',
      F: 'Aigerim,Dana,Madina,Aruzhan,Gulnara,Dilnoza,Malika,Zarina,Kamila,Aizhan,Saule,Nargiza,Ainura,Gulshan,Maral,Aisuluu',
      L: 'Nurlanov,Akhmetov,Abdullaev,Karimov,Toktarov,Bekov,Sultanov,Yusupov,Rakhimov,Alimov,Ermekov,Mamytov,Usmanov,Saparov,Berdiev,Atayev' },
    az: { fem: 'slav', M: 'Ali,Elvin,Rashad,Murad,Tural,Ramil,Kamran,Farid,Orkhan,Nijat,Vugar,Emin',
      F: 'Aysel,Leyla,Gunel,Nigar,Sevinj,Aynur,Narmin,Fidan,Lala,Ulviyya,Konul,Shahla',
      L: 'Aliyev,Mammadov,Hasanov,Huseynov,Guliyev,Ismayilov,Abbasov,Rzayev,Suleymanov,Jafarov,Karimov,Valiyev' },
    tr: { M: 'Mehmet,Mustafa,Ahmet,Ali,Hüseyin,Hasan,Yusuf,Emre,Burak,Murat,Eymen,Ömer,Kerem,Can,Mert,Alparslan',
      F: 'Ayşe,Fatma,Zeynep,Elif,Emine,Hatice,Merve,Esra,Defne,Ecrin,Büşra,Selin,Asel,Nehir,Azra,Melek',
      L: 'Yılmaz,Kaya,Demir,Şahin,Çelik,Yıldız,Yıldırım,Öztürk,Aydın,Özdemir,Arslan,Doğan,Kılıç,Aslan,Çetin,Koç,Kurt,Polat' },
    ru: { fem: 'slav', M: 'Aleksandr,Dmitry,Maksim,Sergei,Andrei,Alexei,Ivan,Mikhail,Nikolai,Artyom,Kirill,Egor,Vladimir,Pavel,Roman,Timofei',
      F: 'Anastasia,Maria,Anna,Ekaterina,Olga,Elena,Tatiana,Natalia,Irina,Svetlana,Sofia,Polina,Daria,Ksenia,Yulia,Varvara',
      L: 'Ivanov,Smirnov,Kuznetsov,Popov,Vasiliev,Petrov,Sokolov,Mikhailov,Novikov,Fedorov,Morozov,Volkov,Alekseev,Lebedev,Kozlov,Pavlov,Orlov,Belov' },
    ua: { fem: 'slav', M: 'Oleksandr,Andriy,Dmytro,Serhiy,Mykola,Ivan,Taras,Bohdan,Yuriy,Vasyl,Maksym,Oleh,Artem,Volodymyr',
      F: 'Olena,Oksana,Iryna,Nataliya,Tetiana,Yulia,Kateryna,Anastasiia,Sofiia,Mariia,Viktoriia,Halyna,Solomiia,Daryna',
      L: 'Shevchenko,Kovalenko,Bondarenko,Tkachenko,Kravchenko,Melnyk,Boyko,Kovalchuk,Oliynyk,Shevchuk,Polishchuk,Lysenko,Marchenko,Rudenko,Savchenko' },
    pl: { fem: 'slav', M: 'Jan,Piotr,Krzysztof,Andrzej,Tomasz,Paweł,Michał,Marcin,Jakub,Kacper,Antoni,Szymon,Filip,Mateusz',
      F: 'Anna,Maria,Katarzyna,Małgorzata,Agnieszka,Barbara,Zofia,Zuzanna,Julia,Maja,Hanna,Oliwia,Alicja,Magdalena',
      L: 'Nowak,Kowalski,Wiśniewski,Wójcik,Kowalczyk,Kamiński,Lewandowski,Zieliński,Szymański,Woźniak,Dąbrowski,Kozłowski,Mazur,Jankowski' },
    cz: { fem: 'cz', M: 'Jiří,Jan,Petr,Josef,Pavel,Martin,Tomáš,Jakub,Lukáš,Ondřej,David,Matyáš,Marek,Michal',
      F: 'Jana,Eva,Hana,Anna,Lenka,Kateřina,Lucie,Věra,Tereza,Eliška,Adéla,Natálie,Klára,Petra',
      L: 'Novák,Svoboda,Novotný,Dvořák,Černý,Procházka,Kučera,Veselý,Horák,Němec,Pokorný,Pospíšil,Hájek,Král' },
    yu: { M: 'Marko,Nikola,Luka,Stefan,Ivan,Milan,Aleksandar,Dragan,Petar,Filip,Lazar,Nemanja,Tomislav,Amar,Emir,Luka',
      F: 'Ana,Marija,Jelena,Milica,Ivana,Sara,Mia,Tijana,Katarina,Dragana,Lejla,Amina,Petra,Maja,Nina,Lana',
      L: 'Jovanović,Petrović,Nikolić,Marković,Đorđević,Horvat,Kovačević,Babić,Marić,Hodžić,Popović,Pavlović,Knežević,Begović,Novak,Krajnc' },
    bg: { fem: 'slav', M: 'Georgi,Ivan,Dimitar,Nikolay,Hristo,Petar,Aleksandar,Todor,Stoyan,Martin,Viktor,Kaloyan',
      F: 'Maria,Ivanka,Elena,Yordanka,Desislava,Gergana,Viktoria,Nikol,Radostina,Petya,Tsvetelina,Kalina',
      L: 'Ivanov,Georgiev,Dimitrov,Petrov,Nikolov,Hristov,Stoyanov,Todorov,Iliev,Angelov,Atanasov,Kolev' },
    ro: { M: 'Andrei,Alexandru,Ion,Mihai,Gabriel,Ștefan,David,Cristian,Florin,Bogdan,Răzvan,Vasile,Lucian,Matei',
      F: 'Maria,Elena,Ioana,Andreea,Ana,Alexandra,Mihaela,Gabriela,Cristina,Daria,Sofia,Irina,Bianca,Raluca',
      L: 'Popescu,Ionescu,Popa,Pop,Constantin,Stan,Dumitru,Stoica,Gheorghe,Rusu,Munteanu,Matei,Ciobanu,Lungu,Ceban,Rotaru' },
    hu: { order: 'sf', M: 'Bence,Máté,Levente,Dominik,Dániel,László,István,Zoltán,Gábor,Péter,Ádám,Marcell,Zsolt,Attila',
      F: 'Hanna,Anna,Zsófia,Luca,Lili,Eszter,Katalin,Erzsébet,Ildikó,Réka,Boglárka,Dóra,Viktória,Nóra',
      L: 'Nagy,Kovács,Tóth,Szabó,Horváth,Varga,Kiss,Molnár,Németh,Farkas,Balogh,Papp,Takács,Juhász' },
    gr: { fem: 'gr', M: 'Georgios,Ioannis,Konstantinos,Dimitrios,Nikolaos,Panagiotis,Christos,Vasileios,Athanasios,Michail,Alexandros,Spyros,Andreas',
      F: 'Maria,Eleni,Aikaterini,Vasiliki,Sofia,Georgia,Anastasia,Dimitra,Ioanna,Konstantina,Eirini,Despina,Christina',
      L: 'Papadopoulos,Papadakis,Georgiou,Nikolaou,Dimitriou,Konstantinou,Ioannou,Vlachos,Pappas,Oikonomou,Karagiannis,Makris,Christodoulou,Antoniou' },
    de: { M: 'Lukas,Leon,Finn,Paul,Jonas,Elias,Noah,Felix,Maximilian,Thomas,Michael,Andreas,Stefan,Jürgen,Matthias,Tobias',
      F: 'Emma,Mia,Hannah,Sophia,Lea,Lena,Anna,Laura,Julia,Sabine,Petra,Katharina,Marie,Clara,Johanna,Ursula',
      L: 'Müller,Schmidt,Schneider,Fischer,Weber,Meyer,Wagner,Becker,Schulz,Hoffmann,Koch,Richter,Bauer,Klein,Wolf,Gruber,Huber,Keller,Schröder,Neumann' },
    fr: { M: 'Gabriel,Louis,Raphaël,Jules,Adam,Lucas,Léo,Hugo,Arthur,Nathan,Thomas,Nicolas,Julien,Pierre,Antoine,Mathis',
      F: 'Jade,Louise,Emma,Alice,Chloé,Léa,Manon,Camille,Inès,Sarah,Juliette,Marie,Céline,Élise,Margaux,Lina',
      L: 'Martin,Bernard,Dubois,Thomas,Robert,Richard,Petit,Durand,Leroy,Moreau,Simon,Laurent,Lefebvre,Michel,Garcia,Fontaine,Rousseau,Girard,Lambert,Bonnet' },
    ht: { M: 'Wilson,Jameson,Ricardo,Kervens,Jacky,Stanley,Frantz,Junior,Jean-Robert,Ronald,Évens,Marc,Jean-Claude,Wisly',
      F: 'Marie,Nadège,Mirlande,Rose-Marie,Fabiola,Guerline,Sophonie,Esther,Lovely,Judith,Roseline,Daphnée,Widline,Nathalie',
      L: 'Joseph,Jean,Pierre,Louis,Charles,Jean-Baptiste,Saint-Louis,Paul,Augustin,Dorvil,Etienne,Michel,Desir,Noel' },
    en: { M: 'Oliver,Jack,Noah,James,William,Henry,Liam,Ethan,Lucas,Michael,David,Daniel,Thomas,Benjamin,Samuel,Jacob,Logan,Mason,Ryan,Charlie',
      F: 'Olivia,Emma,Amelia,Charlotte,Sophia,Isla,Ava,Mia,Emily,Grace,Chloe,Sarah,Jessica,Hannah,Lily,Ella,Harper,Ruby',
      L: 'Smith,Johnson,Williams,Brown,Jones,Miller,Davis,Wilson,Taylor,Anderson,Thomas,Moore,Martin,Jackson,White,Harris,Clark,Lewis,Walker,Hall,Young,King,Wright,Evans,Roberts,Murphy,O\'Brien,Kelly,Campbell,Stewart,Thompson' },
    car: { M: 'Andre,Jamal,Shane,Kevin,Tyrone,Marlon,Dwayne,Ricardo,Kemar,Rohan,Damion,Jerome,Omari,Shamar',
      F: 'Shanice,Kerry-Ann,Tamika,Keisha,Monique,Simone,Latoya,Ashanti,Renee,Natalia,Gabrielle,Alicia,Jada,Tiana',
      L: 'Brown,Williams,Campbell,Thompson,Clarke,Reid,Grant,Henry,Bailey,Richards,Joseph,Charles,Gordon,Edwards,Francis,Scott' },
    es: { style: 'double', M: 'Hugo,Martín,Lucas,Mateo,Leo,Daniel,Alejandro,Pablo,Manuel,Álvaro,Javier,Antonio,José,David,Sergio,Jorge',
      F: 'Lucía,Sofía,Martina,María,Julia,Paula,Valeria,Emma,Daniela,Carmen,Laura,Ana,Elena,Isabel,Marta,Alba',
      L: 'García,Rodríguez,González,Fernández,López,Martínez,Sánchez,Pérez,Gómez,Martín,Jiménez,Ruiz,Hernández,Díaz,Moreno,Muñoz,Álvarez,Romero,Navarro,Torres' },
    es_la: { style: 'double', M: 'Santiago,Mateo,Sebastián,Matías,Diego,Nicolás,Alejandro,Samuel,Daniel,José,Juan,Luis,Carlos,Miguel Ángel,Emiliano,Jesús,Andrés,Gabriel',
      F: 'Sofía,Valentina,Isabella,Camila,Valeria,Mariana,Gabriela,Daniela,María José,Ximena,Luciana,Victoria,Fernanda,Guadalupe,Ana,Paola',
      L: 'García,Rodríguez,Martínez,Hernández,López,González,Pérez,Sánchez,Ramírez,Torres,Flores,Rivera,Gómez,Díaz,Cruz,Morales,Reyes,Gutiérrez,Ortiz,Castillo,Rojas,Vargas,Mendoza,Quispe,Mamani' },
    pt: { style: 'double', M: 'Francisco,João,Afonso,Tomás,Duarte,Rodrigo,Santiago,Miguel,Pedro,Diogo,Rafael,Martim,Gonçalo,Tiago',
      F: 'Maria,Leonor,Matilde,Beatriz,Carolina,Mariana,Ana,Inês,Sofia,Margarida,Joana,Rita,Catarina,Francisca',
      L: 'Silva,Santos,Ferreira,Pereira,Oliveira,Costa,Rodrigues,Martins,Jesus,Sousa,Fernandes,Gonçalves,Gomes,Lopes,Marques,Almeida,Ribeiro,Carvalho' },
    br: { style: 'double', M: 'Miguel,Arthur,Gael,Heitor,Theo,Davi,Gabriel,Bernardo,Samuel,João Pedro,Lucas,Pedro,Rafael,Matheus,Gustavo,Felipe,Bruno,Thiago',
      F: 'Helena,Alice,Laura,Maria Alice,Valentina,Heloísa,Maria Clara,Cecília,Júlia,Ana Clara,Beatriz,Larissa,Camila,Fernanda,Mariana,Gabriela',
      L: 'Silva,Santos,Oliveira,Souza,Rodrigues,Ferreira,Alves,Pereira,Lima,Gomes,Costa,Ribeiro,Martins,Carvalho,Almeida,Lopes,Soares,Fernandes,Vieira,Barbosa' },
    ao: { M: 'João,António,Manuel,José,Francisco,Domingos,Paulo,Armando,Celso,Edson,Nelson,Augusto,Joaquim,Américo',
      F: 'Maria,Ana,Joana,Teresa,Isabel,Luísa,Fátima,Esperança,Graça,Celeste,Rosa,Felismina,Josefina,Albertina',
      L: 'dos Santos,da Silva,Lourenço,Fernandes,Mendes,Gomes,Cossa,Macuácua,Sitoe,Chissano,Neto,Tavares,Lopes,Ximenes,Soares,Guterres' },
    it: { M: 'Leonardo,Francesco,Alessandro,Lorenzo,Mattia,Andrea,Gabriele,Tommaso,Riccardo,Edoardo,Giuseppe,Marco,Luca,Giovanni,Antonio,Matteo',
      F: 'Sofia,Giulia,Aurora,Alice,Ginevra,Emma,Giorgia,Beatrice,Chiara,Francesca,Martina,Anna,Elena,Sara,Valentina,Rosa',
      L: 'Rossi,Russo,Ferrari,Esposito,Bianchi,Romano,Colombo,Ricci,Marino,Greco,Bruno,Gallo,Conti,De Luca,Costa,Giordano,Mancini,Rizzo,Lombardi,Moretti,Borg,Camilleri' },
    nl: { M: 'Noah,Daan,Sem,Lucas,Levi,Finn,Liam,Milan,Jesse,Thomas,Bram,Pieter,Jan,Dirk,Wouter,Arthur',
      F: 'Emma,Julia,Mila,Tess,Sophie,Zoë,Sara,Nora,Anna,Lotte,Fleur,Eva,Lisa,Femke,Marie,Elise',
      L: 'de Jong,Jansen,de Vries,van den Berg,van Dijk,Bakker,Janssens,Visser,Smit,Meijer,de Boer,Mulder,Peeters,Maes,Willems,Claes,Bos,Vos,Hendriks' },
    nord: { M: 'Lars,Erik,Anders,Magnus,Nils,Oskar,William,Lucas,Liam,Emil,Filip,Johan,Henrik,Mikkel,Jakob,Gunnar',
      F: 'Ingrid,Astrid,Freja,Maja,Ella,Alma,Elsa,Saga,Ida,Emma,Nora,Sofie,Karin,Linnea,Sigrid,Anna',
      L: 'Hansen,Johansen,Olsen,Nielsen,Jensen,Andersson,Johansson,Karlsson,Nilsson,Eriksson,Larsson,Pedersen,Lindqvist,Berg,Bergström,Sigurðsson' },
    fi: { M: 'Juhani,Mikko,Matti,Antti,Janne,Ville,Onni,Eino,Leo,Väinö,Aleksi,Elias,Eetu,Juha',
      F: 'Aino,Helmi,Aada,Sofia,Emilia,Ella,Venla,Liisa,Maria,Anna,Johanna,Laura,Sanna,Eveliina',
      L: 'Korhonen,Virtanen,Mäkinen,Nieminen,Mäkelä,Hämäläinen,Laine,Heikkinen,Koskinen,Järvinen,Lehtonen,Saarinen,Salminen,Lahtinen' },
    lt: { M: 'Lukas,Jonas,Mantas,Tomas,Darius,Matas,Nojus,Kajus,Rokas,Paulius',
      F: 'Rūta,Ieva,Gabija,Austėja,Emilija,Lėja,Kamilė,Urtė,Agnė,Viktorija',
      L: 'Kazlauskas,Petrauskas,Jankauskas,Vaitkus,Stankevičius,Žukauskas,Butkus,Paulauskas,Urbonas,Navickas',
      LF: 'Kazlauskaitė,Petrauskienė,Jankauskaitė,Vaitkutė,Stankevičiūtė,Žukauskienė,Butkutė,Paulauskaitė,Urbonaitė,Navickienė' },
    lv: { M: 'Jānis,Andris,Mārtiņš,Kristaps,Roberts,Gustavs,Edgars,Artūrs,Emīls,Ralfs',
      F: 'Anna,Līga,Kristīne,Elīna,Laura,Sofija,Alise,Marta,Ieva,Evelīna',
      L: 'Bērziņš,Kalniņš,Ozoliņš,Liepiņš,Krūmiņš,Jansons,Vītols,Kļaviņš,Zariņš,Pētersons',
      LF: 'Bērziņa,Kalniņa,Ozoliņa,Liepiņa,Krūmiņa,Jansone,Vītola,Kļaviņa,Zariņa,Pētersone' },
    ee: { M: 'Rasmus,Mihkel,Karl,Markus,Tanel,Martin,Robin,Oliver,Kristjan,Andres',
      F: 'Mari,Kadri,Liis,Triin,Sofia,Eliise,Laura,Maria,Anna,Kertu',
      L: 'Tamm,Saar,Sepp,Mägi,Kask,Rebane,Ilves,Kukk,Lepik,Koppel' },
    he: { M: 'David,Yosef,Moshe,Ariel,Noam,Itai,Yonatan,Daniel,Eitan,Omer,Avraham,Uri,Lavi,Yehuda',
      F: 'Noa,Tamar,Maya,Yael,Shira,Avigail,Sarah,Esther,Michal,Rivka,Talia,Hila,Adi,Ayala',
      L: 'Cohen,Levi,Mizrahi,Peretz,Biton,Friedman,Avraham,Dahan,Katz,Azoulay,Ben-David,Shapiro,Goldberg,Rosenberg' },
    hy: { M: 'Davit,Narek,Aram,Tigran,Arman,Hayk,Gor,Levon,Armen,Vardan,Karen,Samvel',
      F: 'Anahit,Mariam,Ani,Lilit,Nare,Gayane,Hasmik,Siranush,Arpi,Tatev,Lusine,Nane',
      L: 'Hovhannisyan,Harutyunyan,Sargsyan,Khachatryan,Grigoryan,Petrosyan,Hakobyan,Vardanyan,Karapetyan,Gevorgyan,Avetisyan,Mkrtchyan' },
    ka: { M: 'Giorgi,Davit,Luka,Nikoloz,Levan,Irakli,Zurab,Lasha,Sandro,Giga,Tornike,Beka',
      F: 'Nino,Mariam,Ana,Tamar,Elene,Natia,Salome,Ketevan,Eka,Lika,Tekla,Sopho',
      L: 'Beridze,Kapanadze,Gelashvili,Maisuradze,Giorgadze,Lomidze,Tsiklauri,Bolkvadze,Kvaratskhelia,Nozadze,Japaridze,Abashidze' },
    sq: { M: 'Ardit,Arbër,Endri,Klevis,Erion,Besnik,Gjergj,Arben,Altin,Dritan,Noel,Amar',
      F: 'Ana,Ajla,Era,Klea,Sara,Elira,Arta,Jonida,Blerina,Dorina,Ema,Anisa',
      L: 'Hoxha,Shehu,Gashi,Krasniqi,Berisha,Leka,Kola,Dervishi,Prifti,Çela,Marku,Basha' },
    mn: { order: 'sf', M: 'Batbayar,Temuulen,Bilguun,Erdene,Ganbold,Munkh-Erdene,Tsogt,Bat-Orgil,Enkhbat,Tuguldur,Khuslen,Sukhbat',
      F: 'Anujin,Enkhjin,Nomin,Khulan,Oyun,Saraa,Solongo,Tsetseg,Uyanga,Gerel,Altantsetseg,Bolormaa',
      L: 'Bat,Ganbaatar,Dorj,Tseren,Enkhbold,Gantulga,Sukhbaatar,Baatar,Purev,Tumur,Batjargal,Ochir' },
    mg: { M: 'Andry,Hery,Fanomezana,Rivo,Mamy,Faly,Toky,Haja,Njaka,Lova,Fetra,Tsiry',
      F: 'Voahangy,Lalao,Hanta,Fara,Holy,Mialy,Nirina,Soa,Tahina,Rindra,Volana,Onja',
      L: 'Rakotomalala,Randriamampionona,Rasoanaivo,Razafindrakoto,Andrianarivo,Rakotonirina,Ramanantsoa,Randrianasolo,Rabemananjara,Ratsimbazafy' },
    afw: { M: 'Chukwuemeka,Oluwaseun,Ibrahim,Musa,Abdullahi,Emeka,Tunde,Kwame,Kofi,Yaw,Samuel,Daniel,Chinedu,Aliyu,Babatunde,Kwabena,Mohammed,Sani',
      F: 'Ngozi,Chioma,Aisha,Fatima,Funmilayo,Adaeze,Amina,Yetunde,Ama,Akosua,Abena,Blessing,Esther,Hauwa,Zainab,Efua,Halima,Precious',
      L: 'Okafor,Adeyemi,Bello,Ibrahim,Mohammed,Okonkwo,Abubakar,Mensah,Owusu,Boateng,Asante,Danjuma,Eze,Olawale,Nwosu,Yusuf,Kamara,Johnson,Koroma,Sesay,Musa,Adebayo' },
    afr: { M: 'Mamadou,Moussa,Ibrahima,Abdoulaye,Ousmane,Amadou,Jean,Serge,Kouassi,Koffi,Didier,Patrice,Christian,Souleymane,Issa,Boubacar',
      F: 'Fatoumata,Aminata,Mariam,Aïssatou,Awa,Kadiatou,Hawa,Marie,Grâce,Esther,Adjoua,Akissi,Nafissatou,Rokia,Salimata,Chantal',
      L: 'Diallo,Traoré,Coulibaly,Konaté,Keïta,Sow,Ba,Diop,Ndiaye,Kouamé,Kaboré,Ouédraogo,Mbemba,Ilunga,Tshibangu,Mukendi,Kasongo,Mahamat,Issoufou,Camara,Sylla,Fofana,Bamba,Mensah' },
    afe: { M: 'John,Joseph,Peter,Daniel,Brian,Kevin,Juma,Baraka,Emmanuel,Mwangi,Otieno,Kiprotich,Mugisha,Jean-Claude,Hakizimana,Hassani',
      F: 'Mary,Grace,Faith,Mercy,Wanjiru,Akinyi,Neema,Rehema,Amani,Aisha,Esther,Joyce,Uwase,Ishimwe,Achieng,Zawadi',
      L: 'Mwangi,Otieno,Kamau,Odhiambo,Kariuki,Ochieng,Mushi,Mollel,Kimaro,Okello,Ssempala,Mugisha,Niyonzima,Habimana,Uwimana,Nshimiyimana,Mwakyusa,Hassan,Nakato,Wekesa' },
    et: { style: 'patronym', M: 'Abebe,Tesfaye,Dawit,Yonas,Haile,Bereket,Mulugeta,Getachew,Solomon,Kebede,Biniam,Mekonnen,Tewodros,Amanuel,Girma,Alemayehu',
      F: 'Tigist,Meseret,Hiwot,Selam,Bethlehem,Mahlet,Almaz,Tsion,Hanna,Rahel,Saba,Feven,Liya,Eden,Meron,Helen' },
    so: { style: 'patronym', M: 'Mohamed,Abdi,Ahmed,Hassan,Ali,Abdirahman,Omar,Yusuf,Abdullahi,Ismail,Farah,Mahad,Hussein,Aden',
      F: 'Hodan,Fadumo,Asha,Amina,Sahra,Halima,Hibo,Ifrah,Ayan,Nimco,Ubah,Hawa,Ladan,Sagal' },
    ss: { style: 'patronym', M: 'Deng,Garang,Mayen,Akol,Majok,Machar,Kuol,Lual,Malual,Bol,Ajak,Chol,Gatluak,Kiir',
      F: 'Nyandeng,Achol,Ayen,Adut,Nyibol,Abuk,Akuol,Nyakuoth,Ajok,Aluel,Nyamal,Achan,Nyabol,Awut' },
    afs: { M: 'Thabo,Sipho,Themba,Bongani,Mandla,Tendai,Tatenda,Blessing,Kagiso,Lwazi,Mpho,Thulani,Chikondi,Mwila,Tapiwa,Kabelo',
      F: 'Nomsa,Thandiwe,Lerato,Zanele,Nandi,Palesa,Ayanda,Chipo,Rutendo,Naledi,Busisiwe,Tsitsi,Mulenga,Kefilwe,Tumelo,Precious',
      L: 'Dlamini,Nkosi,Ndlovu,Khumalo,Mokoena,Mahlangu,Zulu,Moyo,Ncube,Sibanda,Banda,Phiri,Mwale,Tembo,Molefe,Mutasa,Shikongo,Chirwa,Mbewe,Sithole' },
    pac: { M: 'Sione,Tevita,Viliami,Joseva,Ioane,Tomasi,Peni,Mikaele,Junior,John,Peter,Kaleb,Semi,Iosefa',
      F: 'Mele,Losana,Ana,Salote,Litia,Seini,Grace,Mary,Sela,Vika,Ofa,Leilani,Mere,Talia',
      L: 'Tupou,Fifita,Vea,Naivalu,Waqa,Tuilagi,Faleolo,Leota,Kila,Morea,Iamo,Toua,Kabua,Tebano,Ioane,Tamate' }
  };

  function split(s) { return s ? s.split(',') : null; }
  Object.keys(P).forEach(function (k) {
    var p = P[k];
    p.Ma = split(p.M); p.Fa = split(p.F); p.La = split(p.L); p.LFa = split(p.LF);
  });

  function femSur(rule, s) {
    if (rule === 'slav') {
      if (/(ov|ev|ёv|in|yn)$/.test(s)) return s + 'a';
      if (/skiy$/.test(s)) return s.replace(/skiy$/, 'skaya');
      if (/ski$/.test(s)) return s.replace(/ski$/, 'ska');
      if (/cki$/.test(s)) return s.replace(/cki$/, 'cka');
      if (/dzki$/.test(s)) return s.replace(/dzki$/, 'dzka');
      return s;
    }
    if (rule === 'cz') {
      if (/ý$/.test(s)) return s.replace(/ý$/, 'á');
      if (/a$/.test(s)) return s.replace(/a$/, 'ová');
      if (/ek$/.test(s)) return s.replace(/ek$/, 'ková');
      return s + 'ová';
    }
    if (rule === 'gr') {
      if (/os$/.test(s)) return s.replace(/os$/, 'ou');
      if (/is$/.test(s)) return s.replace(/is$/, 'i');
      if (/as$/.test(s)) return s.replace(/as$/, 'a');
      return s;
    }
    return s;
  }

  function parts(entry) { var a = entry.split(':'); return { lat: a[0], nat: a[1] || '', hv: a[2] || '' }; }

  // Sinh tên cho một bộ tên. surname: giữ họ (vd con theo họ cha). Trả về {full, sub, sur}
  function worldName(r, poolKey, sex, surname) {
    var U = G.U;
    if (poolKey === 'vn') {
      var vn = G.VN.vnName(r, 'kinh', sex, surname);
      return { full: vn.full, sub: '', sur: vn.sur };
    }
    var p = P[poolKey] || P.en;
    var given = U.pick(r, sex === 'F' ? p.Fa : p.Ma);
    var full, sub = '', sur;
    if (p.native) {
      var g = parts(given);
      var s = surname ? parts(surname) : parts(U.pick(r, p.La));
      sur = surname || [s.lat, s.nat, s.hv].filter(Boolean).join(':');
      full = s.lat + ' ' + g.lat;
      var nat = s.nat + (poolKey === 'jp' ? ' ' : '') + g.nat;
      sub = nat + (s.hv && g.hv ? ' · ' + s.hv + ' ' + g.hv : '');
      return { full: full, sub: sub, sur: sur };
    }
    if (p.style === 'patronym') {
      sur = surname || U.pick(r, p.Ma);
      return { full: given + ' ' + sur, sub: '', sur: sur };
    }
    if (p.style === 'bin') {
      sur = surname || U.pick(r, p.La);
      return { full: given + (sex === 'F' ? ' binti ' : ' bin ') + sur, sub: '', sur: sur };
    }
    if (p.style === 'double') {
      sur = surname || U.pick(r, p.La);
      var mother = U.pick(r, p.La);
      if (mother === sur) mother = U.pick(r, p.La);
      return { full: given + ' ' + sur + ' ' + mother, sub: '', sur: sur };
    }
    if (surname) {
      sur = surname;
      var ix = p.La.indexOf(surname);
      if (sex === 'F' && p.LFa && ix >= 0 && p.LFa[ix]) return { full: given + ' ' + p.LFa[ix], sub: '', sur: sur };
    }
    else if (sex === 'F' && p.LFa) sur = U.pick(r, p.LFa);
    else sur = U.pick(r, p.La);
    var shown = sex === 'F' && p.fem ? femSur(p.fem, sur) : sur;
    full = p.order === 'sf' ? shown + ' ' + given : given + ' ' + shown;
    return { full: full, sub: '', sur: sur };
  }

  G.NAMES = { P: P, worldName: worldName, femSur: femSur };
})(typeof window !== 'undefined' ? (window.G = window.G || {}) : (globalThis.G = globalThis.G || {}));
