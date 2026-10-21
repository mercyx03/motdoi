/* Reproducible semantic Vietnamese adaptation, not a verbatim prose translation.
   Raw MIT sources and checksums are recorded in docs/fantasy-sources/. */
'use strict';
const fs=require('fs'),crypto=require('crypto');
const root=require('path').join(__dirname,'..');
const raw=fs.readFileSync(root+'/.cache/fantasy/creatures.jsonl','utf8');
const csv=fs.readFileSync(root+'/docs/fantasy-sources/npc-training-data.csv','utf8');
const magic={hydromancy:['thuy','Thủy','thủy thuật'],geomancy:['tho','Thạch','địa thuật'],aeromancy:['phong','Phong','phong thuật'],chronomancy:['thoi','Thời','thời thuật'],technomancy:['co','Cơ','cơ thuật'],biomancy:['sinh','Mộc','sinh thuật'],pyromancy:['hoa','Hỏa','hỏa thuật'],necromancy:['hac','U','tử linh thuật'],none:['thu','Hoang','thể chất']};
const vi={energy:'năng lượng',carnivore:'thịt',parasitic:'ký sinh',photosynthesis:'ánh sáng',herbivore:'cỏ cây',omnivore:'tạp thực',mineral:'khoáng vật',solitary:'đơn độc',symbiotic:'cộng sinh',pack:'theo bầy',hivemind:'ý thức liên kết',colonial:'quần thể',matriarchal:'bầy mẫu hệ',herd:'theo đàn',tiny:'rất nhỏ',small:'nhỏ',medium:'vừa',large:'lớn',huge:'khổng lồ',gargantuan:'đại cự thú',divine:'thần tính',demonic:'ma giới',magical:'ma lực',mechanical:'cơ giới',extradimensional:'dị giới',natural:'tự nhiên',superintelligent:'trí tuệ siêu việt',sapient:'có lý trí',sentient:'có cảm nhận',collective:'trí tuệ tập thể',primitive:'bản năng sơ khai',animal:'bản năng thú'};
const epithets=['Dạ Sương','Huyết Nguyệt','Lam Vân','Bạch Thạch','Hắc Uyên','Tinh Lạc','Cổ Mộc','Ngân Tuyền','Tàn Nhật','Phong Vũ','Hồng Liên','Thiên Ảnh','Vân Hải','Tử Trúc','Thanh Khê','Vọng Nguyệt','Lưu Quang','Hoang Sa','Lôi Âm','Băng Hà','Huyền Sơn','Cửu Khúc','Tịch Dương','Mộng Trạch'];
const creatures=raw.trim().split(/\r?\n/).map((line,i)=>{
  const x=JSON.parse(line),m=magic[x.magic_type];if(!m)throw Error('Unknown magic '+x.magic_type);
  const tier={easy:1,medium:2,hard:3,legendary:4}[x.difficulty];if(!tier)throw Error('Unknown difficulty');
  const habitat=/swamp|fen|marsh|bog/i.test(x.habitat_en)?'Đầm Lầy':/desert|sand/i.test(x.habitat_en)?'Hoang Mạc':/mountain|peak|cliff|cave|underground/i.test(x.habitat_en)?'Sơn Động':/sea|ocean|river|lake|water/i.test(x.habitat_en)?'Thủy Vực':/ruin|temple|city|castle/i.test(x.habitat_en)?'Di Tích':'Rừng Hoang';
  const name=m[1]+' '+(/dragon/i.test(x.name_en)?'Long':/wolf|hound/i.test(x.name_en)?'Lang':/bird|raven|eagle/i.test(x.name_en)?'Điểu':/spider/i.test(x.name_en)?'Chu':/tree|root|bloom|flora/i.test(x.name_en)?'Mộc Linh':'Thú')+' '+epithets[i%24]+' '+epithets[Math.floor(i/24)%24];
  return {id:'beast_'+String(i+1).padStart(4,'0'),name,element:m[0],tier,size:vi[x.size],origin:vi[x.origin],intelligence:vi[x.intelligence],social:vi[x.social_structure],diet:vi[x.diet],habitat,
    text:'Sinh vật '+vi[x.origin]+', thân hình '+vi[x.size]+', sinh sống tại '+habitat.toLowerCase()+'. Sử dụng '+m[2]+', hoạt động '+vi[x.social_structure]+'. Nguồn thức ăn: '+vi[x.diet]+'.',sourceRow:i+1};
});
function parseCSV(s){let rows=[],row=[],cell='',quoted=false;for(let i=0;i<s.length;i++){const c=s[i];if(c==='"'){if(quoted&&s[i+1]==='"'){cell+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(cell);cell='';}else if(c==='\n'&&!quoted){row.push(cell.replace(/\r$/,''));if(row.some(Boolean))rows.push(row);row=[];cell='';}else cell+=c;}if(cell||row.length){row.push(cell);rows.push(row);}return rows;}
const jobs={'Stable Hand':'người giữ chuồng','Tailor':'thợ may','Guard':'vệ binh','Cook':'đầu bếp','Merchant':'thương nhân','Shepherd':'người chăn cừu','Farmer':'nông dân','Hunter':'thợ săn','Miner':'thợ mỏ','Carpenter':'thợ mộc','Blacksmith':'thợ rèn','Potter':'thợ gốm','Baker':'thợ bánh','Messenger':'sứ giả','Fisher':'ngư dân','Fisherman':'ngư dân','Innkeeper':'chủ quán trọ','Woodcutter':'tiều phu','Weaver':'thợ dệt','Herbalist':'dược sư','Tanner':'thợ thuộc da'};
const fullFile=root+'/.cache/fantasy/npc-full.json';
const rows=fs.existsSync(fullFile)?JSON.parse(fs.readFileSync(fullFile,'utf8')).map(x=>[x.system_message,x.player_message,x.ai_message]):parseCSV(csv).slice(1),npcs=rows.map((r,i)=>{
 const job=(r[0].match(/Job:\s*([^\n]+)/)||[])[1],role=jobs[job];if(!role)throw Error('Unknown NPC job '+job);
 const rep=+(r[2].match(/Reputation:\s*(-?\d+)/)||[0,0])[1],ability=/Attack/.test(r[2])?'cảnh giác':/Follow|Lead/.test(r[2])?'dẫn đường':/Flee/.test(r[2])?'rút lui':'trò chuyện';
 const intent=/help|task|work|quest/i.test(r[1])?'giúp việc':/buy|sell|price|trade/i.test(r[1])?'giao thương':/where|road|take me|lead/i.test(r[1])?'hỏi đường':/thank|saved|kind|good day/i.test(r[1])?'thiện chí':rep<0?'xung đột':'hỏi chuyện';
 return {id:'npc_'+(i+1),role,intent,rep:Math.max(-3,Math.min(3,rep)),response:rep<0?role.charAt(0).toUpperCase()+role.slice(1)+' dè chừng, không muốn tiếp tục cuộc nói chuyện.':rep>0?role.charAt(0).toUpperCase()+role.slice(1)+' vui vẻ chia sẻ kinh nghiệm và ghi nhận thiện chí của bạn.':role.charAt(0).toUpperCase()+role.slice(1)+' kể về công việc hằng ngày và tình hình trên đường.',ability,sourceRow:i+1};
});
const manifest={sources:[{id:'limloop/fantasy_creature_bestiary',url:'https://huggingface.co/datasets/limloop/fantasy_creature_bestiary',license:'MIT',rows:creatures.length,sha256:crypto.createHash('sha256').update(raw).digest('hex')},{id:'ItsHotdogFred/npc-training-data-v1',file:fs.existsSync(fullFile)?'train (full partition)':'training_data.csv',url:'https://huggingface.co/datasets/ItsHotdogFred/npc-training-data-v1',license:'MIT',rows:npcs.length,sha256:crypto.createHash('sha256').update(fs.existsSync(fullFile)?fs.readFileSync(fullFile):csv).digest('hex')}],adaptation:'Tên và mô tả tiếng Việt được biên soạn từ các thuộc tính có cấu trúc; không tuyên bố là bản dịch nguyên văn toàn bộ văn xuôi. Thế giới, gia tộc và cơ chế được thiết kế riêng.'};
fs.writeFileSync(root+'/public/js/fantasy-imports.js','/* MIT dataset adaptations. See docs/fantasy-sources/manifest.json. */\n(function(G){G.FANTASY_IMPORTS='+JSON.stringify({creatures,npcs,sources:manifest.sources})+';})(globalThis.G);\n');
fs.writeFileSync(root+'/docs/fantasy-sources/manifest.json',JSON.stringify(manifest,null,2)+'\n');
console.log('Adapted '+creatures.length+' creatures and '+npcs.length+' NPC interactions to Vietnamese.');
require('./build-fantasy-extra.js');
