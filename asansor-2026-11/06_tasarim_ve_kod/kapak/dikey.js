// Renders the vertical house-format frame and caption overlays (1080x1920).
const {chromium}=require('playwright');const fs=require('fs');
const css=`@font-face{font-family:P;font-weight:500;src:url(poppins-latin-ext-500-normal.woff2),url(poppins-latin-500-normal.woff2)}
@font-face{font-family:P;font-weight:600;src:url(poppins-latin-ext-600-normal.woff2),url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:700;src:url(poppins-latin-ext-700-normal.woff2),url(poppins-latin-700-normal.woff2)}
@font-face{font-family:P;font-weight:800;src:url(poppins-latin-ext-800-normal.woff2),url(poppins-latin-800-normal.woff2)}
@font-face{font-family:P;font-weight:500;unicode-range:U+0000-00FF;src:url(poppins-latin-500-normal.woff2)}
@font-face{font-family:P;font-weight:600;unicode-range:U+0000-00FF;src:url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:700;unicode-range:U+0000-00FF;src:url(poppins-latin-700-normal.woff2)}
@font-face{font-family:P;font-weight:800;unicode-range:U+0000-00FF;src:url(poppins-latin-800-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:P}`;
const N='#1c2a4a',G='#d9a521',GR='#2e6b4a';
const frame=(pill,title,sub)=>`<body style="background:#fff">
<div style="position:absolute;top:210px;left:0;right:0;display:flex;flex-direction:column;align-items:center">
 <img src="logo.png" style="height:84px">
 <div style="margin-top:22px;display:flex;align-items:center;gap:18px;font-weight:600;font-size:27px;color:${N}"><i style="display:block;width:150px;height:3px;background:${G}"></i>İş Dünyası | Çalışma Hayatı | İSG<i style="display:block;width:150px;height:3px;background:${G}"></i></div>
 <div style="margin-top:24px;background:${G};color:${N};font-weight:800;font-size:26px;letter-spacing:2px;padding:8px 26px;border-radius:30px">${pill}</div>
 <div style="margin-top:20px;width:960px;background:${G};color:${N};font-weight:800;font-size:58px;line-height:1.12;text-align:center;padding:20px 24px">${title}</div>
 <div style="margin-top:18px;font-weight:700;font-size:36px;color:${GR}">${sub}</div>
</div>
<div style="position:absolute;top:860px;left:0;width:1080px;height:608px;background:#000"></div>
<div style="position:absolute;top:1530px;left:60px;right:60px;background:${N};border-radius:16px;padding:22px 20px;text-align:center">
 <div style="color:#fff;font-weight:800;font-size:40px">▶ Tam video <span style="color:${G}">YouTube'da</span></div>
 <div style="color:#fff;font-weight:600;font-size:24px;margin-top:4px">İşin Gündemi kanalı · Türkçe & English · Abone ol, kaydet</div></div>
<div style="position:absolute;top:1700px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-end">
 <div><div style="font-weight:700;font-size:32px;color:${N}">Alpay Oktay</div><div style="font-weight:500;font-size:22px;color:#4a5068">A Sınıfı İş Güvenliği Uzmanı</div></div>
 <div style="font-weight:700;font-size:28px;color:${N}">@isingundemi</div></div></body>`;
const cap=(t)=>`<body style="background:transparent"><div style="position:absolute;left:0;right:0;top:1356px;display:flex;justify-content:center">
<div style="max-width:1000px;background:rgba(255,255,255,.96);border-left:8px solid ${G};border-radius:10px;padding:12px 22px;font-weight:700;font-size:36px;line-height:1.25;color:${N};text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.35)">${t}</div></div></body>`;
const end=(a,b)=>`<body style="background:transparent"><div style="position:absolute;top:860px;left:0;width:1080px;height:608px;background:rgba(28,42,74,.82);display:flex;flex-direction:column;align-items:center;justify-content:center">
<div style="color:#fff;font-weight:800;font-size:54px;text-align:center;line-height:1.2">${a}</div>
<div style="margin-top:22px;background:${G};color:${N};font-weight:800;font-size:40px;padding:12px 30px;border-radius:12px">${b}</div></div></body>`;
const jobs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const j of jobs){let h=j.kind==='frame'?frame(...j.args):j.kind==='cap'?cap(...j.args):end(...j.args);
fs.writeFileSync('_d.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head>${h}</html>`);
await p.goto('file://'+process.cwd()+'/_d.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(120);
await p.screenshot({path:j.out,omitBackground:j.kind!=='frame'});}
await b.close();})();
