'use strict';
const fs=require('fs'),https=require('https'),path=require('path');
const crypto=require('crypto');
const expected={'creatures.jsonl':'15f740cd22b6fc6bb0515f77aeb65494f95b1c60edd489d246dea79411752339','publicdomain-rpg.json':'ef08ba0eec8b7db09f52b0cd7e7b141efc0dcc0eac906f8f01e94eb4fba4d94f'};
const root=path.join(__dirname,'..'),cache=path.join(root,'.cache/fantasy'),cards=path.join(root,'docs/fantasy-sources');
const sources=[
 ['limloop/fantasy_creature_bestiary','creatures.jsonl','creatures.jsonl','bestiary-card.md'],
 ['ItsHotdogFred/npc-training-data-v1','training_data.csv','npc-training-data.csv','npc-card.md'],
 ['Angry-Wizard/rpg_grid_maps','map_info.csv','maps-info.csv','maps-info.csv.card.md'],
 ['Marcylene/rpg_ai','output.json','rpg-narrative.json','rpg-narrative.json.card.md'],
 ['practical-dreamer/RPGPT_PublicDomain-alpaca','RPGPT_PublicDomain_v2_alpaca.json','publicdomain-rpg.json','publicdomain-rpg.json.card.md']
];
function get(url,attempt=0){return new Promise((ok,no)=>https.get(url,r=>{if(r.statusCode>=300&&r.statusCode<400)return get(new URL(r.headers.location,url).href).then(ok,no);const chunks=[];r.on('data',c=>chunks.push(c));r.on('end',()=>r.statusCode===200?ok(Buffer.concat(chunks)):r.statusCode>=500&&attempt<3?setTimeout(()=>get(url,attempt+1).then(ok,no),1500):no(Error(r.statusCode+' '+url)));}).on('error',no));}
(async()=>{fs.mkdirSync(cache,{recursive:true});fs.mkdirSync(cards,{recursive:true});for(const [repo,file,local,card]of sources){const target=local==='npc-training-data.csv'?path.join(cards,local):path.join(cache,local);if(!fs.existsSync(target)||(expected[local]&&crypto.createHash('sha256').update(fs.readFileSync(target)).digest('hex')!==expected[local])){const b=await get('https://huggingface.co/datasets/'+repo+'/resolve/main/'+file);if(expected[local]&&crypto.createHash('sha256').update(b).digest('hex')!==expected[local])throw Error('Source checksum changed: '+repo);fs.writeFileSync(target,b);}fs.writeFileSync(path.join(cards,card),await get('https://huggingface.co/datasets/'+repo+'/resolve/main/README.md'));console.log(repo+': '+fs.statSync(target).size+' bytes');}
 const npcFile=path.join(cache,'npc-full.json');if(!fs.existsSync(npcFile)){const base='https://datasets-server.huggingface.co/rows?dataset=ItsHotdogFred%2Fnpc-training-data-v1&config=default&split=train&length=100&offset=';const first=JSON.parse((await get(base+'0')).toString('utf8')),all=first.rows.map(x=>x.row),total=first.num_rows_total;for(let offset=100;offset<total;offset+=400){const pages=await Promise.all(Array.from({length:Math.min(4,Math.ceil((total-offset)/100))},(_,i)=>get(base+(offset+i*100)).then(b=>JSON.parse(b.toString('utf8')))));for(const p of pages){if(p.partial||p.rows.some(x=>x.truncated_cells.length))throw Error('Incomplete NPC data');all.push(...p.rows.map(x=>x.row));}}if(all.length!==total)throw Error('NPC row count mismatch');fs.writeFileSync(npcFile,JSON.stringify(all));console.log('Full NPC partition: '+all.length+' records');}
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>https.globalAgent.destroy());
