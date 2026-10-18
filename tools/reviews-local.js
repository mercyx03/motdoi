// Local D1-compatible adapter. Only tools/serve.js loads this; never deployed.
const {DatabaseSync}=require('node:sqlite'),fs=require('fs'),path=require('path');
module.exports=function(file){fs.mkdirSync(path.dirname(file),{recursive:true});const db=new DatabaseSync(file);
 function prepare(sql){let values=[];return{bind(...args){values=args;return this;},async run(){return this.execute();},async all(){return this.execute();},execute(){const s=db.prepare(sql);if(/^(SELECT|PRAGMA)/i.test(sql))return{success:true,results:s.all(...values)};const v=s.run(...values);return{success:true,meta:{changes:Number(v.changes)}};}};}
 return{prepare,async batch(statements){db.exec('BEGIN');try{const result=statements.map(s=>s.execute());db.exec('COMMIT');return result;}catch(e){db.exec('ROLLBACK');throw e;}},close(){db.close();}};
};
