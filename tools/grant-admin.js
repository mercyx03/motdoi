'use strict';
// Run privately on the deployment owner's computer. Never creates an account,
// changes a password, or grants roles through the public application.
const fs=require('fs'),path=require('path');
const username=(process.argv[2]||'').trim().toLowerCase();
if(!/^[a-z0-9_.]{3,24}$/.test(username)){console.error('Usage: node tools/grant-admin.js <existing-username>');process.exit(1);}
const folder=path.resolve(__dirname,'../.local');fs.mkdirSync(folder,{recursive:true});
const file=path.join(folder,'grant-admin.sql');
fs.writeFileSync(file,"CREATE TABLE IF NOT EXISTS game_account_roles (account_id INTEGER PRIMARY KEY, role TEXT NOT NULL CHECK(role = 'admin'));\nINSERT OR IGNORE INTO game_account_roles(account_id,role) SELECT id,'admin' FROM game_accounts WHERE username = '"+username+"';\nSELECT COUNT(*) AS granted FROM game_account_roles r JOIN game_accounts a ON a.id=r.account_id WHERE a.username='"+username+"' AND r.role='admin';\n");
console.log('Private SQL prepared: '+file+'\nExecute against the D1 database bound to REVIEWS_DB in Cloudflare Pages. A granted count of 1 confirms success. No password is needed.');
