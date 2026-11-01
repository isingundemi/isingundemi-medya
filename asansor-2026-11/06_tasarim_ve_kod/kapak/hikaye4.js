const {chromium}=require('playwright');const fs=require('fs');
const OUT='../hikaye/ov/';fs.mkdirSync(OUT,{recursive:true});
const css=`@font-face{font-family:P;font-weight:500;src:url(poppins-latin-ext-500-normal.woff2),url(poppins-latin-500-normal.woff2)}
@font-face{font-family:P;font-weight:600;src:url(poppins-latin-ext-600-normal.woff2),url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:700;src:url(poppins-latin-ext-700-normal.woff2),url(poppins-latin-700-normal.woff2)}
@font-face{font-family:P;font-weight:800;src:url(poppins-latin-ext-800-normal.woff2),url(poppins-latin-800-normal.woff2)}
@font-face{font-family:P;font-weight:500;unicode-range:U+0000-00FF;src:url(poppins-latin-500-normal.woff2)}
@font-face{font-family:P;font-weight:600;unicode-range:U+0000-00FF;src:url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:700;unicode-range:U+0000-00FF;src:url(poppins-latin-700-normal.woff2)}
@font-face{font-family:P;font-weight:800;unicode-range:U+0000-00FF;src:url(poppins-latin-800-normal.woff2)}
@font-face{font-family:K;font-weight:700;src:url(kufi700.woff2)}@font-face{font-family:K;font-weight:800;src:url(kufi800.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;font-family:P}`;
const N='#1c2a4a',G='#d9a521';
// layout: logo 250 | big band 360-520 | selector 556-640 | window 680-1490 | caption 1512 | name 1740
const WY=680,WH=810;
const frame=`<body style="background:#fff">
<div style="position:absolute;top:236px;left:0;right:0;display:flex;flex-direction:column;align-items:center">
 <img src="logo.png" style="height:78px">
 <div style="margin-top:14px;display:flex;align-items:center;gap:18px;font-weight:600;font-size:25px;color:${N}"><i style="display:block;width:140px;height:3px;background:${G}"></i>İş Dünyası | Çalışma Hayatı | İSG<i style="display:block;width:140px;height:3px;background:${G}"></i></div>
</div>
<div style="position:absolute;top:${WY}px;left:0;width:1080px;height:${WH}px;background:#000"></div>
<div style="position:absolute;top:${WY-6}px;left:0;width:1080px;height:6px;background:${G}"></div>
<div style="position:absolute;top:${WY+WH}px;left:0;width:1080px;height:6px;background:${G}"></div>
<div style="position:absolute;top:1748px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-end">
 <div><div style="font-weight:700;font-size:30px;color:${N}">Alpay Oktay</div><div style="font-weight:500;font-size:21px;color:#4a5068">A Sınıfı İş Güvenliği Uzmanı</div></div>
 <div style="font-weight:700;font-size:28px;color:${N}">@isingundemi</div></div></body>`;
const band=(html,ar,fs_=104)=>`<body style="background:transparent"><div style="position:absolute;top:378px;left:0;right:0;display:flex;justify-content:center">
<div style="min-width:620px;background:${G};color:${N};font-family:${ar?'K':'P'};font-weight:800;font-size:${fs_}px;line-height:1;text-align:center;padding:${ar?'20px 60px 34px':'26px 60px 30px'};border-radius:14px;box-shadow:0 10px 24px rgba(28,42,74,.18)">${html}</div></div></body>`;
const spk=(c)=>`<svg width="30" height="30" viewBox="0 0 24 24" style="margin-right:8px;flex:none"><path fill="${c}" d="M3 9v6h4l5 5V4L7 9H3z"/><path fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;
const LANGS=[['tr','Türkçe',0],['ku','Kurmancî',0],['ar','العربية',1],['en','English',0]];
const sel=(on)=>`<body style="background:transparent"><div style="position:absolute;top:566px;left:0;right:0;display:flex;justify-content:center;gap:14px">
${LANGS.map(([k,t,ar])=>{const a=on.includes(k);return `<div style="display:flex;align-items:center;justify-content:center;width:238px;height:76px;border-radius:40px;background:${a?N:'#eef0f4'};border:3px solid ${a?G:'#e1e4ea'};color:${a?'#fff':'#9aa0ad'};font-family:${ar?'K':'P'};font-weight:800;font-size:${ar?30:31}px;${a?'box-shadow:0 6px 16px rgba(28,42,74,.28)':''}">${a?spk(G):''}${t}</div>`}).join('')}
</div></body>`;
const cap=(t,ar)=>`<body style="background:transparent"><div style="position:absolute;left:0;right:0;top:1514px;display:flex;justify-content:center">
<div dir="${ar?'rtl':'ltr'}" style="max-width:1010px;background:#f6f3ea;border-${ar?'right':'left'}:8px solid ${G};border-radius:10px;padding:${ar?'8px 24px 14px':'12px 24px'};font-family:${ar?'K':'P'};font-weight:700;font-size:${ar?36:37}px;line-height:1.3;color:${N};text-align:center">${t}</div></div></body>`;
const wm=`<body style="background:transparent"><div style="position:absolute;right:20px;top:${WY+WH-70}px;opacity:.55;display:flex;flex-direction:column;align-items:center;background:rgba(255,255,255,.75);border-radius:8px;padding:4px 10px"><img src="logo.png" style="height:22px"><div style="font-weight:700;font-size:13px;color:${N}">@isingundemi</div></div></body>`;
const T=JSON.parse(fs.readFileSync('../asansor2/texts.json','utf8'));
const jobs=[['frame',frame,false],['wm',wm,true],
 ['b_4dil',band('4 DİLDE',0,122),true],
 ['b_tr',band('Türkçe'),true],['b_ku',band('Kurmancî'),true],['b_ar',band('العربية',1,100),true],['b_en',band('English'),true],
 ['b_yt',band('ŞİMDİ YOUTUBE\'DA',0,74),true],['b_yt2',band('BU AKŞAM 20:00 · YOUTUBE',0,60),true],
 ['s_tr',sel(['tr']),true],['s_ku',sel(['ku']),true],['s_ar',sel(['ar']),true],['s_en',sel(['en']),true],
 ['s_tk',sel(['tr','ku']),true],['s_tka',sel(['tr','ku','ar']),true],['s_all',sel(['tr','ku','ar','en']),true],['s_none',sel([]),true],
 ['c_tr',cap(T.tr[0],0),true],['c_ku',cap(T.ku[0],0),true],['c_ar',cap(T.ar[0],1),true],['c_en',cap(T.en[0],0),true],
 ['c_hook',cap('Aynı video · <b style="color:#b8860b">4 dilde</b> ses ve altyazı',0),true],
 ['c_yt',cap('⚙ Ayarlar → <b style="color:#b8860b">Ses parçası</b> → dilini seç',0),true]];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [n,h,tr] of jobs){fs.writeFileSync('_h.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head>${h}</html>`);
await p.goto('file://'+process.cwd()+'/_h.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(120);
await p.screenshot({path:OUT+n+'.png',omitBackground:tr});}
await b.close();console.log('ok',jobs.length)})();
