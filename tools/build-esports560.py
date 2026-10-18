"""Build the shipped, dated 2026 reference catalog; no invented player names."""
import json,pathlib,re
ROOT=pathlib.Path('.local/esports')
games={'lol':{'name':'Liên Minh Huyền Thoại'},'val':{'name':'Valorant'},'aov':{'name':'Liên Quân Mobile'},'tft':{'name':'Đấu Trường Chân Lý (TFT)'}}
leagues=[]
def league(id,game,name,host,rows,source,snapshot):
    ts=[]
    for i,(n,p) in enumerate(rows):
        ts.append({'id':id+'-'+str(i),'name':n,'players':p.split('|') if isinstance(p,str) else p})
    leagues.append(dict(id=id,game=game,name=name,host=host,teams=ts,source=source,snapshot=snapshot))
matches=json.loads((ROOT/'lol-matches.json').read_text(encoding='utf-8'))
for id,host in [('LCK','KR'),('LPL','CN'),('LEC','DE'),('LCS','US'),('CBLOL','BR'),('LCP','TW')]:
    grouped={}
    for lg,t,pos,n,date in matches:
        if lg==id:grouped.setdefault(t,{})[pos]=n
    rows=[(t,[p[x] for x in ['top','jng','mid','bot','sup']]) for t,p in grouped.items()]
    league(id,'lol',id,host,rows,'https://github.com/twodotone/finalLOL/blob/main/data/csv/2026_LoL_esports_match_data_from_OraclesElixir.csv','Đội hình ra sân đến 10/04/2026; LEC gồm khách mời Versus')
    if id=='LEC':
        for t in leagues[-1]['teams']:
            if t['name'] in ['Los Ratones','Karmine Corp Blue']:t['guest']=True
league('AOG','aov','Đấu Trường Danh Vọng · Việt Nam','VN',[
('BOOM Esports','Emper|Anne|Failure|DucTiep|Tama|Seed'),('Rex Regum Qeon','TKien|Yang|Tack4|Triet|Karl|LittleQ|Veritas'),('Team Secret','Acacia|Kaisa|Boka|TNhan|Tlinhhh|TrPhuoc|Ducky'),('BOX Gaming','TriNguyen|08QT|Peak|Ciara|Mapu|Chip'),('One Star Esports','Libr4|Stark|Zet|Sea|Spiris|NamMilk'),('FPT Polytechnic','VIT|ThanhDuy|Sleepy|Sindhu|TheKhang|Chu'),('GAM Esports','Kuga|Yiuling|Aliyah|TienPhat|PhuHoang|Adonis|Owen'),('Saigon Phantom','Nolan|Yuu|Fish|Shin|Khoa|23xJuly|Soul'),('FPT x Flash','HuyHoang|Julius|Maris|BeTroc|Yutan|HieuDuc|Nắng')],
'https://vsgg.com/en/news/19930','Mùa Đông 2026')
for t in leagues[-1]['teams']:
    if t['name'] in ['BOOM Esports','Rex Regum Qeon']:t['winterOnly']=True
leagues[-1]['teams'].append(dict(id='AOG-SPN',name='Super Nova',players=['Acacia','Kaisa','Phoenix','Triết','zzZ'],archived=True,source='https://maisesports.com.br/campeonatos/kog-arena-of-glory-spring-2026/escalacoes',snapshot='Mùa Xuân 2026; đã rời giải trước mùa Đông'))
league('RPL','aov','RoV Pro League · Thái Lan','TH',[
('Buriram United Esports','Littleboyz|AlmondP|NuNu|Ligky|Deawwy|Summer'),('FULL SENSE','AshEarth|Overone|Agetsive|Sharkz|NOARje|Givemeakiss'),('Bacon Time','Markky|Bonus|Kimsensei|Opar|Alawin|PIXZY'),('King of Gamers Club','Baskung|Cinderella|PuPu|Nightza|JDust (KrataiA)|GIMPO|Pmons'),('Hydra Esports','Possu|Commiw|Barely (Koffi)|Wonderwall|Acapae|PPKAZ'),('eArena','JKP|NBank|Jdai|NEGAN|Pj|Ohmmy|EXOLAR'),('Tenacity','SRY|Erez|Fakeplayz|MOOP|Difoxn|POGPOG'),('SOLYX Esports','Farook|Myra|Psocute|1S1K|Joelong|Ch1lly'),('Godji Check','NTNz|Faye|Lisnyp|Rika|larminq|Artie')],
'https://vsgg.com/news/19647','Mùa Đông 2026')
league('GCS','aov','GCS · Đài Loan / Hồng Kông','TW',[
('ANK Gaming','LiTing|Tao|Long|BUU|Guoguy|WeiT'),('Banmei Gaming','Neil|XCaiii|Junnn|Yanyan|Kai|Leduo|Baini'),('Cathay ONE Team','Wuliu|XH|Inu|Luky|Hong|Shao'),('Deep Cross Gaming','Xcen|XinChen|Miruki|YouLun|Yaooo|Weiyu'),('Hong Kong Attitude','Weinnn|Dwei|YanPu|Takeshi|Metaverse|Afu'),('LIT ESPORTS','Kajaa|Dong|Baduck|Yummy|Zirui|Leng|XNNX|Zui'),('WANIN FlashWolves','YuXiang|Zhenzhe|NaiLiu|Abao|Zhan|WeiZ')],
'https://esports.moba.garena.tw/gcs/team','Danh sách hiện hành trên trang GCS, đọc 18/10/2026')
league('ACS','aov','AoV Crown Series · Indonesia','ID',[
('Carnifex','Amane|Tuna|Yoloo|Godspeed|Kenshin'),('Cyberlaxy Esports','Outlaw|Daamha|Twenty|Rinss|Sugarmini'),('Jumpstart','Yuzuki|Chandler|Momochan|Babymeow|Han'),('Phenomenal One','Kobokkobok|Kocekkocek|Kobelkobel|Kekerkeker|Krocokroco|Kedutkedut'),('DarksideID','Mif|Volker|Escipion|NiChulian|Yay'),('Timeless','Hekal|sagwa|Anyaa|Miracle|3Muu|Donuts'),('Silence But Deadly',"Celcius|Gunslinger|Shiro|Molana|Articvoier|Yuna'|Regalia'"),('Ascendant','Valdo|Febrychi|SKRULL|Hyo|Nagii')],
'https://liquipedia.net/honorofkings/AOV_Crown_Series/2026','24–26/04/2026 · vòng tuyển chọn APL')
for id,names in {
'AMER':'VIT k3soju|FNC Darth Nub|ACAD Dishsoap|CTG Kaiweng|CTG Dankmemes01|K0nda1|FL Upsetmax|BruhbruhbruhWHO|VCLF',
'EMEA':'MIH ZyK0o|MIH Tarteman|M8 Jedusor|Pepoglad|Guillosko h|MIH Bensac|MKOI Safo20|AG Horox|Hypno',
'APAC':'RRQ YBY1|FQ AQ1H|Seoill|Steppy|steelo of bora|VP Maris|ZETA Title|VP Milo|FW Iron Bog|A Long',
'CN':'WBG XZZ|AG LiTuChuan|TEC Ringo|AUR Huanmie|QituX|Jiejie|LiShao|TLG diaomei|WBG Tianlong|suirenka|XiaoGe|huanyi'}.items():
    league('TFT-'+id,'tft',id,{'AMER':'US','EMEA':'DE','APAC':'VN','CN':'CN'}[id],[(n,[n]) for n in names.split('|')],
    'https://teamfighttactics.leagueoflegends.com/en-us/news/esports/space-gods-tacticians-crown-primer/','40 tuyển thủ Space Gods Tactician’s Crown · 10–12/07/2026')
    leagues[-1]['individual']=True
if (ROOT/'valorant.json').exists():leagues+=json.loads((ROOT/'valorant.json').read_text(encoding='utf-8'))
if (ROOT/'valorant-extra.json').exists():leagues+=json.loads((ROOT/'valorant-extra.json').read_text(encoding='utf-8'))
data={'season':2026,'checked':'2026-10-18','games':games,'leagues':leagues}
(ROOT/'catalog-audit.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
# Keep provenance in the local audit, not in the player-facing deployment.
for x in leagues:
    x.pop('source',None)
    for t in x['teams']:t.pop('source',None)
pathlib.Path('public/js/esports-data.js').write_text('/* Danh mục tham chiếu có ngày chốt riêng; xem esports-sources.md. */\n(function(G){ G.ESPORTS_DATA='+json.dumps(data,ensure_ascii=False,indent=2)+'; })(globalThis.G);\n',encoding='utf-8')
print('Built',len(leagues),'leagues;',sum(len(x['teams']) for x in leagues),'teams/individuals')
