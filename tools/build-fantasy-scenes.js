'use strict';
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const rows=fs.readFileSync(path.join(root,'docs/fantasy-scenes.tsv'),'utf8').trim().split(/\r?\n/),scenes={};
for(const line of rows){const [id,text,...results]=line.split('\t');if(!id||scenes[id]||!text||results.length!==3||results.some(x=>!x))throw Error('Invalid scene: '+id);scenes[id]={text,results};}
fs.writeFileSync(path.join(root,'public/js/fantasy-narrative-data.js'),'/* Authored Fantasy scenes and choice outcomes. */\n(function(G){G.FANTASY_SCENES='+JSON.stringify(scenes,null,2)+';})(globalThis.G);\n');
console.log('Built '+rows.length+' Fantasy scenes and '+rows.length*3+' choice outcomes.');
