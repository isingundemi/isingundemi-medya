const {chromium}=require('playwright');const fs=require('fs');
const out=process.argv[2], step=process.argv[3]?parseFloat(process.argv[3]):0;
const D=JSON.parse(fs.readFileSync('../kolaj/vdata.json','utf8'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file://'+process.cwd()+'/vframe.html');await p.evaluate(()=>document.fonts.ready);await p.evaluate(d=>window.init(d),D);await p.waitForTimeout(300);
fs.mkdirSync(out,{recursive:true});
const N=step?null:Math.round(D.total*30);
const times=step?process.argv.slice(4).map(Number):[...Array(N).keys()].map(i=>i/30);
for(let i=0;i<times.length;i++){await p.evaluate(t=>window.seek(t),times[i]);
 await p.screenshot({path:`${out}/${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
