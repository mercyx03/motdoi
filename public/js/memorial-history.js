/* Completed lives are archived separately from saves that are still in progress. */
(function(G){'use strict';var MEM='mkn.memorial',LAST='mkn.lastEnd';
function save(l,stages,cohort,store,labels){if(!l||l.alive||!l.death||!l.id)return false;var rows=store.get(MEM,[]);if(!Array.isArray(rows))rows=[];var old=rows.find(function(x){return x&&x.id===l.id;});var record={id:l.id,name:l.name,sub:l.nameSub,where:labels.where,years:labels.years,age:l.death.age,cause:l.death.cause,summary:labels.summary,words:l.finalWords,refl:l.refl,yrs:l.yrs,e0sex:l.e0sex,age2:l.age,savedAt:Date.now(),fin:stages&&stages.length?stages:old&&old.fin||[]};rows=rows.filter(function(x){return x&&x.id!==l.id;});rows.push(record);if(!store.set(MEM,rows.slice(-60)))return false;l.flags=l.flags||{};l.flags.memorialSaved=true;store.set(LAST,{life:l,cohort:cohort});return true;}
function recover(store,labels){var last=store.get(LAST,null),l=last&&last.life;if(!l||l.alive||!l.death||l.flags&&(l.flags.memorialSaved||l.flags.memorialDeleted))return false;return save(l,null,last.cohort,store,labels(l));}
function removed(store,id){var last=store.get(LAST,null);if(last&&last.life&&last.life.id===id){last.life.flags=last.life.flags||{};last.life.flags.memorialDeleted=true;store.set(LAST,last);}}
G.MemorialHistory={save:save,recover:recover,removed:removed};
})(globalThis.G);
