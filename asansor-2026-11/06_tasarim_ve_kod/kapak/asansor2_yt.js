const {chromium}=require('playwright');const fs=require('fs');
const OUT='../asansor2/ov/';fs.mkdirSync(OUT+'ov_yt',{recursive:true});
const src=fs.readFileSync('asansor_ov.js','utf8');
const css=src.match(/const css=`([\s\S]*?)`;/)[1].replace('width:1080px;height:1920px','width:1920px;height:1080px');
const N='#1c2a4a',G='#d9a521';
const frame=`<body style="background:#fff">
<div style="position:absolute;left:0;top:0;width:1920px;height:120px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 44px">
 <img src="logo.png" style="height:60px">
 <div style="font-weight:800;font-size:40px;color:${N};letter-spacing:.5px">ASANSÖRÜN HALATI KOPARSA NE OLUR?</div>
 <div style="width:420px"></div></div>
<div style="position:absolute;left:0;top:114px;width:1920px;height:6px;background:${G}"></div></body>`;
const chip=(t,red)=>`<body style="background:transparent"><div style="position:absolute;right:44px;top:30px;background:${red?'#c62828':G};color:${red?'#fff':N};font-weight:800;font-size:32px;padding:6px 22px 8px;border-radius:10px;white-space:nowrap">${t}</div></body>`;
const pl=(c,a)=>`<div style="background:${c};color:${c=='#f2c230'?N:'#fff'};border-radius:8px;width:100px;padding:8px 2px;text-align:center;font-weight:800;font-size:20px">${a}</div>`;
const labels4=`<body style="background:transparent"><div style="position:absolute;right:44px;top:30px;display:flex;gap:8px">${pl('#2e9e4f','YEŞİL')}${pl('#1f6fd1','MAVİ')}${pl('#f2c230','SARI')}${pl('#c62828','KIRMIZI')}</div></body>`;
const wm=`<body style="background:transparent"><div style="position:absolute;right:30px;top:990px;opacity:.6;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.75);border-radius:8px;padding:5px 12px"><img src="logo.png" style="height:26px"><div style="font-weight:700;font-size:15px;color:${N}">@isingundemi</div></div></body>`;
const C=JSON.parse(fs.readFileSync(OUT+'text.json','utf8'));
const jobs=[['frame_yt',frame,false,OUT],['wm',wm,true,OUT+'ov_yt/'],['labels4',labels4,true,OUT+'ov_yt/']];
C.chips.forEach((t,i)=>jobs.push(['chip'+i,chip(t,t.includes('KIRMIZI')),true,OUT+'ov_yt/']));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
for(const [n,h,tr,o] of jobs){fs.writeFileSync('_y.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head>${h}</html>`);
await p.goto('file://'+process.cwd()+'/_y.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);
await p.screenshot({path:o+n+'.png',omitBackground:tr});}
await b.close();})();
