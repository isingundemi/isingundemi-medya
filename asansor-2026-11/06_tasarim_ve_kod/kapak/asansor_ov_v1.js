const {chromium}=require('playwright');const fs=require('fs');
const OUT='../asansor/ov/';
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
const frame=`<body style="background:#fff">
<div style="position:absolute;top:210px;left:0;right:0;display:flex;flex-direction:column;align-items:center">
 <img src="logo.png" style="height:84px">
 <div style="margin-top:22px;display:flex;align-items:center;gap:18px;font-weight:600;font-size:27px;color:${N}"><i style="display:block;width:150px;height:3px;background:${G}"></i>İş Dünyası | Çalışma Hayatı | İSG<i style="display:block;width:150px;height:3px;background:${G}"></i></div>
 <div style="margin-top:24px;background:${G};color:${N};font-weight:800;font-size:26px;letter-spacing:2px;padding:8px 26px;border-radius:30px">ASANSÖR GÜVENLİĞİ</div>
 <div style="margin-top:20px;width:960px;background:${G};color:${N};font-weight:800;font-size:58px;line-height:1.12;text-align:center;padding:20px 24px">ASANSÖRÜN HALATI<br>KOPARSA NE OLUR?</div>
 <div style="margin-top:18px;font-weight:700;font-size:36px;color:${GR}">Halat · Fren · Etiket</div>
</div>
<div style="position:absolute;top:860px;left:0;width:1080px;height:608px;background:#000"></div>
<div style="position:absolute;top:1530px;left:60px;right:60px;background:${N};border-radius:16px;padding:20px 20px 18px;text-align:center">
 <div style="color:#fff;font-weight:800;font-size:40px">▶ Daha fazla İSG videosu <span style="color:${G}">YouTube'da</span></div>
 <div style="color:#fff;font-weight:700;font-size:28px;margin-top:6px">@isingundemi · Abone ol, kaydet, paylaş</div></div>
<div style="position:absolute;top:1712px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-end">
 <div><div style="font-weight:700;font-size:32px;color:${N}">Alpay Oktay</div><div style="font-weight:500;font-size:22px;color:#4a5068">A Sınıfı İş Güvenliği Uzmanı</div></div>
 <div style="font-weight:700;font-size:28px;color:${N}">@isingundemi</div></div></body>`;
const cap=(t)=>`<body style="background:transparent"><div style="position:absolute;left:0;right:0;top:1356px;display:flex;justify-content:center">
<div style="max-width:1000px;background:rgba(255,255,255,.96);border-left:8px solid ${G};border-radius:10px;padding:12px 22px;font-weight:700;font-size:36px;line-height:1.25;color:${N};text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.35)">${t}</div></div></body>`;
const chip=(t,red)=>`<body style="background:transparent"><div style="position:absolute;left:28px;top:884px;background:${red?'#c62828':G};color:${red?'#fff':N};font-weight:800;font-size:40px;letter-spacing:1px;padding:8px 24px 10px;border-radius:12px;box-shadow:0 6px 16px rgba(0,0,0,.35)">${t}</div></body>`;
const wm=`<body style="background:transparent"><div style="position:absolute;right:22px;top:1300px;opacity:.55;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.75);border-radius:8px;padding:4px 10px"><img src="logo.png" style="height:22px"><div style="font-weight:700;font-size:13px;color:${N}">@isingundemi</div></div></body>`;
const lab=(c,a,b,size)=>`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;background:${c};border:4px solid #fff;border-radius:14px;width:${size}px;padding:14px 6px;box-shadow:0 8px 20px rgba(0,0,0,.35);color:${c=='#f2c230'?N:'#fff'}"><div style="font-weight:800;font-size:${size>300?44:30}px;line-height:1">${a}</div><div style="font-weight:700;font-size:${size>300?30:22}px;margin-top:6px">${b}</div></div>`;
const labels4=`<body style="background:transparent"><div style="position:absolute;left:0;right:0;top:1150px;display:flex;justify-content:center;gap:14px">
${lab('#2e9e4f','YEŞİL','Kusursuz',230)}${lab('#1f6fd1','MAVİ','Hafif kusurlu',230)}${lab('#f2c230','SARI','Kusurlu',230)}${lab('#c62828','KIRMIZI','Güvensiz',230)}</div></body>`;
const red=`<body style="background:transparent"><div style="position:absolute;left:70px;top:1040px">${lab('#c62828','⛔ KIRMIZI','GÜVENSİZ · BİNME',420)}</div></body>`;
const green=`<body style="background:transparent"><div style="position:absolute;left:70px;top:1100px">${lab('#2e9e4f','✓ YEŞİL','Kusursuz',300)}</div></body>`;
const jobs=[['frame',frame,false],['wm',wm,true],['labels4',labels4,true],['red',red,true],['green',green,true]];
const C=JSON.parse(fs.readFileSync('../asansor/ov/text.json','utf8'));
C.caps.forEach((t,i)=>jobs.push(['cap'+i,cap(t),true]));
C.chips.forEach((t,i)=>jobs.push(['chip'+i,chip(t,t.includes('KIRMIZI')),true]));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [n,h,tr] of jobs){fs.writeFileSync('_a.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head>${h}</html>`);
await p.goto('file://'+process.cwd()+'/_a.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);
await p.screenshot({path:OUT+n+'.png',omitBackground:tr});}
await b.close();})();
