const fs=require('fs'),path=require('path'),sharp=require('sharp');
(async()=>{const dir=path.resolve(process.argv[2]||'promo/events-14'),files=fs.readdirSync(dir).filter(x=>/\.png$/.test(x)).sort();
const cells=await Promise.all(files.map(async(f,i)=>({input:await sharp(path.join(dir,f)).resize(270,338).png().toBuffer(),left:(i%4)*282+6,top:Math.floor(i/4)*350+6})));
await sharp({create:{width:1128,height:Math.ceil(files.length/4)*350,channels:3,background:'#0b1823'}}).composite(cells).png().toFile(path.resolve(process.argv[3]||'promo/14-su-kien-xem-truoc.png'));console.log(files.length+' images in contact sheet');})();
