// Renders transparent 1920x1080 overlay PNGs, one element per file, for ffmpeg compositing.
const {chromium}=require('playwright');const fs=require('fs');
const N='#1c2a4a',G='#d9a521',R='#d63a24',GR='#1f9d55',W='#ffffff';
const I={ // 24x24 viewBox icons, stroke style
 fuel:`<path d="M4 18h16M6 14h12" stroke="${N}" stroke-width="2.2" stroke-linecap="round"/><rect x="5" y="14" width="14" height="4" rx="1" fill="#a86b32" stroke="${N}" stroke-width="1.6"/><path d="M12 3c2.5 3 4 4.6 4 6.8A4 4 0 0 1 8 9.8C8 8 9.4 7 10 5.6c.6 1.4 1.6 2 2 2.2" fill="#f2992e" stroke="${R}" stroke-width="1.6" stroke-linejoin="round"/>`,
 o2:`<circle cx="12" cy="12" r="9" fill="#e8f1fb" stroke="${N}" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-family="P" font-weight="800" font-size="10" fill="${N}">O₂</text>`,
 heat:`<path d="M10 4a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z" fill="#fff" stroke="${N}" stroke-width="2"/><circle cx="12" cy="17" r="2.2" fill="${R}"/><path d="M12 15V8" stroke="${R}" stroke-width="2" stroke-linecap="round"/>`,
 boxes:`<rect x="3" y="11" width="8" height="8" fill="#c9965a" stroke="${N}" stroke-width="1.6"/><rect x="13" y="11" width="8" height="8" fill="#c9965a" stroke="${N}" stroke-width="1.6"/><rect x="8" y="3" width="8" height="8" fill="#d8a96c" stroke="${N}" stroke-width="1.6"/>`,
 plug:`<rect x="2" y="13" width="20" height="6" rx="2" fill="#fff" stroke="${N}" stroke-width="1.8"/><circle cx="6" cy="16" r="1.2" fill="${N}"/><circle cx="10" cy="16" r="1.2" fill="${N}"/><circle cx="14" cy="16" r="1.2" fill="${N}"/><circle cx="18" cy="16" r="1.2" fill="${N}"/><path d="M6 13V8M10 13V6M14 13V9M18 13V5" stroke="${N}" stroke-width="1.8" stroke-linecap="round"/><path d="M15 3l2 2-2 1 2 2" stroke="${R}" stroke-width="1.6" fill="none"/>`,
 radio:`<rect x="7" y="7" width="10" height="15" rx="2" fill="#2f3b57" stroke="${N}" stroke-width="1.6"/><path d="M9 7V2" stroke="${N}" stroke-width="2" stroke-linecap="round"/><rect x="9" y="10" width="6" height="4" rx="1" fill="#9fd3ff"/><circle cx="12" cy="18" r="1.5" fill="${G}"/><path d="M19 6a5 5 0 0 1 0 6M21 4a8 8 0 0 1 0 10" stroke="${G}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
 shout:`<path d="M3 10v4h3l7 4V6L6 10z" fill="${G}" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" stroke="${N}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
 bell:`<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" fill="${R}" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 20a2 2 0 0 0 4 0" stroke="${N}" stroke-width="1.8" fill="none"/><path d="M2.5 8a10 10 0 0 1 3-4.5M21.5 8a10 10 0 0 0-3-4.5" stroke="${G}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
 phone:`<rect x="7" y="2" width="10" height="20" rx="2.5" fill="#2f3b57" stroke="${N}" stroke-width="1.6"/><rect x="8.5" y="4.5" width="7" height="13" rx="1" fill="#e8f1fb"/><path d="M10.2 12.2c.8 1.4 1.9 2.4 3.3 3.1l1.1-1.1-1.3-.9-.6.6c-.6-.3-1.2-.9-1.5-1.5l.6-.6-.9-1.3z" fill="${GR}"/><circle cx="12" cy="19.5" r=".9" fill="#9aa6c0"/>`,
 pin:`<rect x="6" y="9" width="8" height="13" rx="3" fill="${R}" stroke="${N}" stroke-width="1.6"/><path d="M8 9V6h4v3" fill="#333" stroke="${N}" stroke-width="1.4"/><circle cx="18" cy="6" r="3" fill="none" stroke="${G}" stroke-width="2"/><path d="M15 7l-3 1" stroke="${G}" stroke-width="2" stroke-linecap="round"/>`,
 aim:`<circle cx="12" cy="12" r="9" fill="none" stroke="${N}" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="${R}" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="${R}"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4" stroke="${N}" stroke-width="1.8"/>`,
 squeeze:`<rect x="7" y="12" width="7" height="11" rx="2.5" fill="${R}" stroke="${N}" stroke-width="1.5"/><rect x="8.5" y="9" width="4" height="3" fill="#444" stroke="${N}" stroke-width="1.2"/><path d="M8 9l11-4" stroke="${N}" stroke-width="2.4" stroke-linecap="round"/><path d="M8 10.5l11 1" stroke="${N}" stroke-width="2.4" stroke-linecap="round"/><path d="M20.5 3.5v3M20.5 6.5l-1.3-1.3M20.5 6.5l1.3-1.3M20.5 14.5v-3M20.5 11.5l-1.3 1.3M20.5 11.5l1.3 1.3" stroke="${G}" stroke-width="1.6" stroke-linecap="round"/>`,
 sweep:`<path d="M4 15c3-5 13-5 16 0" fill="none" stroke="${N}" stroke-width="2.2" stroke-linecap="round"/><path d="M4 15l-.5-3.5M4 15l3.4-1" stroke="${N}" stroke-width="2.2" stroke-linecap="round"/><path d="M20 15l.5-3.5M20 15l-3.4-1" stroke="${N}" stroke-width="2.2" stroke-linecap="round"/><path d="M9 21c0-2 1.5-3 3-5 1.5 2 3 3 3 5" fill="#f2992e" stroke="${R}" stroke-width="1.4"/>`,
 low:`<path d="M2 4h20" stroke="#8a8f99" stroke-width="3" stroke-linecap="round"/><path d="M3 7c3-1.5 6 1 9-.3s6-1 9 .3" stroke="#a9adb5" stroke-width="2" fill="none"/><circle cx="8" cy="12" r="2" fill="${N}"/><path d="M9.5 13.5l4 2.5 4-1M12 15.5l-1.5 5M14 16.5l3 4.5" stroke="${N}" stroke-width="2.2" stroke-linecap="round" fill="none"/><path d="M19 9v5m-2-2 2 2 2-2" stroke="${GR}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
 elevator:`<rect x="4" y="2" width="16" height="20" rx="1.5" fill="#dfe3ea" stroke="${N}" stroke-width="1.6"/><path d="M12 2v20" stroke="${N}" stroke-width="1.4"/><path d="M8 7l1.5-2L11 7M13 5l1.5 2L16 5" stroke="${N}" stroke-width="1.4" fill="none"/>`,
 exit:`<rect x="1" y="3" width="22" height="18" rx="2" fill="${GR}"/><circle cx="12.5" cy="6.6" r="1.6" fill="#fff"/><path d="M12 9l-2.5 3 2.5 1.5-1 4.5M12 9l2.2 2.5 2.3-.5M11 13.5l3 1 .8 3.5M9.5 12l-2.5.8" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none"/><path d="M17.5 14h3.5m-1.5-1.5L21 14l-1.5 1.5" stroke="#fff" stroke-width="1.4" fill="none"/>`,
 assembly:`<rect x="1" y="1" width="22" height="22" rx="2" fill="${GR}"/><path d="M3 3l3.5 3.5M21 3l-3.5 3.5M3 21l3.5-3.5M21 21l-3.5-3.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><path d="M6.5 6.5v-2.2M6.5 6.5H4.3M17.5 6.5v-2.2M17.5 6.5h2.2M6.5 17.5v2.2M6.5 17.5H4.3M17.5 17.5v2.2M17.5 17.5h2.2" stroke="#fff" stroke-width="1.4"/><circle cx="9.5" cy="10" r="1.4" fill="#fff"/><circle cx="14.5" cy="10" r="1.4" fill="#fff"/><circle cx="12" cy="9.2" r="1.5" fill="#fff"/><path d="M8 15c0-2 1-3 1.5-3s1.5 1 1.5 3M13 15c0-2 1-3 1.5-3S16 13 16 15M10.3 15.5c0-2.6.8-4 1.7-4s1.7 1.4 1.7 4" fill="#fff"/>`,
 check:`<rect x="4" y="3" width="16" height="19" rx="2" fill="#fff" stroke="${N}" stroke-width="1.6"/><rect x="8" y="1.5" width="8" height="3.5" rx="1" fill="${G}" stroke="${N}" stroke-width="1.2"/><path d="M7.5 10l1.5 1.5 3-3M7.5 16l1.5 1.5 3-3" stroke="${GR}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M14 10.5h3M14 16.5h3" stroke="${N}" stroke-width="1.6" stroke-linecap="round"/>`,
};
const mark=(t)=>t==='x'?`<div class="m x"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg></div>`:t==='v'?`<div class="m v"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`:t?`<div class="m n">${t}</div>`:'';
const chip=(icon,x,y,s=170,m='')=>`<div class="chip" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px"><svg viewBox="0 0 24 24">${I[icon]}</svg>${mark(m)}</div>`;
const css=`@font-face{font-family:P;font-weight:800;src:url(poppins-latin-800-normal.woff2)}
*{margin:0;padding:0}body{width:1920px;height:1080px;background:transparent;position:relative;overflow:hidden;font-family:P}
.chip{position:absolute;background:${W};border-radius:28px;border:5px solid ${G};box-shadow:0 14px 34px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center}
.chip svg{width:68%;height:68%}
.m{position:absolute;right:-18px;top:-18px;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:4px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.3)}
.m svg{width:60%;height:60%}.x{background:${R}}.v{background:${GR}}.n{background:${N};color:${G};font-weight:800;font-size:32px}
.arrow{position:absolute;font-weight:800;font-size:64px;color:${G};text-shadow:0 4px 10px rgba(0,0,0,.4)}
.tri{position:absolute}`;
// Elements: name -> html
const Y=56; // lower band, keeps faces clear
const E={
 s2_tri:`<svg class="tri" style="left:1080px;top:150px" width="640" height="600" viewBox="0 0 640 600"><defs><filter id="g"><feGaussianBlur stdDeviation="6"/></filter></defs><polygon points="320,60 70,520 570,520" fill="rgba(255,255,255,.25)" stroke="${G}" stroke-width="22" stroke-linejoin="round" filter="url(#g)" opacity=".6"/><polygon points="320,60 70,520 570,520" fill="rgba(255,255,255,.18)" stroke="${G}" stroke-width="14" stroke-linejoin="round"/><g transform="translate(250,150) scale(5.8)"><path d="M12 3c3.5 4 5.5 6.3 5.5 9.4a5.5 5.5 0 0 1-11 0C6.5 10 8.3 8.6 9.2 6.7c.8 1.9 2.2 2.8 2.8 3z" fill="#f2992e" stroke="${R}" stroke-width="1.4" stroke-linejoin="round"/></g></svg>`,
 s2_a:chip('fuel',1055,575,190),
 s2_b:chip('o2',1305,115,190),
 s2_c:chip('heat',1555,575,190),
 s3_a:chip('boxes',1060,Y,170,'x'),
 s3_b:chip('plug',1340,Y,170,'x'),
 s3_c:chip('radio',1620,Y,170,'v'),
 s4_a:chip('shout',1040,Y,170),
 s4_ar1:`<svg class="tri" style="left:1230px;top:${Y+55}px" width="80" height="60" viewBox="0 0 80 60"><path d="M6 30h52M44 12l20 18-20 18" stroke="${G}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 s4_b:chip('bell',1340,Y,170),
 s4_ar2:`<svg class="tri" style="left:1530px;top:${Y+55}px" width="80" height="60" viewBox="0 0 80 60"><path d="M6 30h52M44 12l20 18-20 18" stroke="${G}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
 s4_c:chip('phone',1640,Y,170),
 s5_a:chip('pin',110,Y,170,'1'),
 s5_b:chip('aim',350,Y,170,'2'),
 s5_c:chip('squeeze',590,Y,170,'3'),
 s5_d:chip('sweep',830,Y,170,'4'),
 s6_a:chip('low',560,Y,170,'v'),
 s6_b:chip('elevator',875,Y,170,'x'),
 s6_c:chip('exit',1190,Y,170,'v'),
 s7_a:chip('assembly',1020,Y,170),
 s7_b:chip('check',1260,Y,170,'v'),
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
fs.mkdirSync('ov',{recursive:true});
for(const [k,h] of Object.entries(E)){fs.writeFileSync('_t.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${h}</body></html>`);
await p.goto('file://'+process.cwd()+'/_t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
await p.screenshot({path:'ov/'+k+'.png',omitBackground:true});}
await b.close();})();
