const {chromium}=require('playwright');const fs=require('fs');
const src=fs.readFileSync('asansor_ov.js','utf8');
const css=src.match(/const css=`([\s\S]*?)`;/)[1].replace('width:1080px;height:1920px','width:1280px;height:720px');
const N='#1c2a4a',G='#d9a521';
const html=`<body style="background:#fff">
<img src="th_img.jpg" style="position:absolute;right:0;top:0;width:760px;height:720px;object-fit:cover;object-position:50% 60%">
<div style="position:absolute;left:0;top:0;width:560px;height:720px;background:#fff"></div>
<div style="position:absolute;left:560px;top:0;width:90px;height:720px;background:linear-gradient(90deg,#fff,rgba(255,255,255,0))"></div>
<img src="logo.png" style="position:absolute;left:44px;top:40px;height:58px">
<div style="position:absolute;left:44px;top:150px;width:600px;font-weight:800;font-size:76px;line-height:1.02;color:${N}">ASANSÖRÜN<br>HALATI<br><span style="background:${G};padding:0 14px;display:inline-block;margin-top:8px">KOPARSA?</span></div>
<div style="position:absolute;left:44px;top:470px;font-weight:700;font-size:34px;color:#2e6b4a">Düşer mi? Cevap bu frende.</div>
<div style="position:absolute;left:44px;top:560px;display:flex;gap:10px">${['TR','KU','AR','EN'].map(x=>`<div style="background:${N};color:#fff;font-weight:800;font-size:28px;padding:6px 16px;border-radius:8px">${x}</div>`).join('')}</div>
<div style="position:absolute;left:44px;top:640px;font-weight:600;font-size:22px;color:#4a5068">4 dilde ses ve altyazı</div>
</body>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
fs.writeFileSync('_t.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head>${html}</html>`);
await p.goto('file://'+process.cwd()+'/_t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
await p.screenshot({path:'../asansor2/yt_kapak.jpg',type:'jpeg',quality:92});await b.close();})();
