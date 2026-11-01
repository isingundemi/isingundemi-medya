const {chromium}=require('playwright');const fs=require('fs');
const [mode,out,dur]=[process.argv[2],process.argv[3],parseFloat(process.argv[4]||'8')];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+process.cwd()+'/outro.html?m='+mode);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
fs.mkdirSync(out,{recursive:true});
const N=Math.round(dur*30);
for(let i=0;i<N;i++){await p.evaluate(t=>window.seek(t),i/30);await p.screenshot({path:`${out}/${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:94});}
await b.close();})();
