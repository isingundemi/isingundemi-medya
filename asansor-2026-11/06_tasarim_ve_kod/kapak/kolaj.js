// Renders overlay PNGs for the 4-language promo collage.
const {chromium}=require('playwright');const fs=require('fs');
const N='#1c2a4a',G='#d9a521',GR='#2e6b4a';
const css=`@font-face{font-family:P;font-weight:500;src:url(poppins-latin-ext-500-normal.woff2),url(poppins-latin-500-normal.woff2)}
@font-face{font-family:P;font-weight:600;src:url(poppins-latin-ext-600-normal.woff2),url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:700;src:url(poppins-latin-ext-700-normal.woff2),url(poppins-latin-700-normal.woff2)}
@font-face{font-family:P;font-weight:800;src:url(poppins-latin-ext-800-normal.woff2),url(poppins-latin-800-normal.woff2)}
@font-face{font-family:P;font-weight:500;unicode-range:U+0000-00FF;src:url(poppins-latin-500-normal.woff2)}
@font-face{font-family:P;font-weight:600;unicode-range:U+0000-00FF;src:url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:700;unicode-range:U+0000-00FF;src:url(poppins-latin-700-normal.woff2)}
@font-face{font-family:P;font-weight:800;unicode-range:U+0000-00FF;src:url(poppins-latin-800-normal.woff2)}
@font-face{font-family:K;font-weight:700;src:url(kufi700.woff2)}
@font-face{font-family:K;font-weight:800;src:url(kufi800.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{position:relative;overflow:hidden;font-family:P,K;background:transparent}
.ar{font-family:K}`;
const spk=(c)=>`<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="${G}" stroke="${N}"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`;
const L={tr:'Türkçe',ku:'Kurmancî',ar:'<span class=ar>العربية</span>',en:'English'};
const jobs=[];const full=(name,html,w=1920,h=1080)=>jobs.push({name,html,w,h,clip:null});
const el=(name,html,w,h)=>jobs.push({name,html,w,h,clip:true});
// ---- intro (16:9 full-frame layers; left 60% free) ----
full('i_logo',`<div style="position:absolute;left:150px;top:150px;background:#fff;border-radius:20px;padding:20px 32px;box-shadow:0 14px 40px rgba(28,42,74,.18);border-bottom:7px solid ${G}"><img src="logo.png" style="height:84px;display:block"></div>`);
full('i_title',`<div style="position:absolute;left:150px;top:325px;width:900px">
 <div style="color:${N};font-weight:800;font-size:76px;line-height:1.05;letter-spacing:1px">İŞ GÜVENLİĞİ</div>
 <div style="display:inline-block;margin-top:14px;background:${G};color:${N};font-weight:800;font-size:76px;line-height:1.05;padding:6px 26px 10px;border-radius:12px">ARTIK 4 DİLDE</div></div>`);
const tagx=[150,470,150,470],tagy=[560,560,662,662];
['tr','ku','ar','en'].forEach((k,i)=>full('i_tag_'+k,`<div style="position:absolute;left:${tagx[i]}px;top:${tagy[i]}px;display:flex;align-items:center;gap:14px;background:#fff;border:5px solid ${G};border-radius:50px;padding:12px 30px 12px 22px;box-shadow:0 10px 26px rgba(28,42,74,.22)">${spk(N).replace(/width="30" height="30"/,'width="44" height="44"')}<span style="color:${N};font-weight:800;font-size:46px;line-height:1.1">${L[k]}</span></div>`));
// ---- language pill (cropped element) ----
['tr','ku','ar','en'].forEach(k=>el('pill_'+k,`<div id=e style="display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,.95);border:3px solid ${G};border-radius:40px;padding:9px 22px 9px 16px;box-shadow:0 6px 18px rgba(0,0,0,.28)">${spk(N)}<span style="color:${N};font-weight:700;font-size:30px">${L[k]}</span></div>`,600,120));
// ---- gold wipe bar ----
el('bar',`<div id=e style="width:90px;height:1080px;position:relative"><div style="position:absolute;left:30px;top:0;width:30px;height:1080px;background:linear-gradient(90deg,rgba(217,165,33,0),rgba(244,205,90,.95) 35%,#fff6d6 50%,rgba(244,205,90,.95) 65%,rgba(217,165,33,0));filter:blur(1px)"></div><div style="position:absolute;left:41px;top:0;width:8px;height:1080px;background:${G}"></div></div>`,90,1080);
// ---- replacement cards (exact geometry of the burned-in cards) ----
const card=(num,a,b,left,right)=>`<div style="position:absolute;top:882px;height:108px;left:${left}px;min-width:${right-left}px;display:flex;border-radius:12px;overflow:hidden;background:#f7f7f7;box-shadow:0 6px 18px rgba(0,0,0,.18)">
 <div style="width:90px;background:${G};display:flex;align-items:center;justify-content:center;color:${N};font-weight:800;font-size:44px">${num}</div>
 <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:0 40px;white-space:nowrap;font-weight:700;font-size:44px;color:${N}">${a}<span style="color:${GR}">&nbsp;${b}</span></div></div>`;
jobs.push({name:'card_ku',w:1920,h:1080,center:true,html:card(4,'Destê vekirî têkeve,','kulm nekeve',554,1366)});
jobs.push({name:'card_en',w:1920,h:1080,center:true,html:card(5,'Back D-ring:','between shoulder blades',442,1479)});
// ---- subtitles (16:9) ----
const SUB={sub_tr1:'Bir kıvılcım, saniyeler içinde yangına dönüşebilir.',sub_tr2:'Peki, o an ne yapmalısın?',
 sub_ar1:'<span class=ar>إذا كان الحريق صغيرًا، وكنتَ مُدرَّبًا، وخلفك طريقُ خروجٍ مفتوح، يمكنك استخدام الطفاية المناسبة.</span>',
 sub_ar2:'<span class=ar>اسحب مسمار الأمان، وجِّه الفوّهة إلى قاعدة اللهب، اضغط، وحرِّك يمينًا ويسارًا.</span>'};
const sub=(t,top,fs,mw)=>`<div style="position:absolute;left:0;right:0;top:${top}px;display:flex;justify-content:center"><div style="max-width:${mw}px;background:rgba(255,255,255,.95);border-left:8px solid ${G};border-radius:10px;padding:10px 22px;font-weight:700;font-size:${fs}px;line-height:1.35;color:${N};text-align:center;box-shadow:0 6px 18px rgba(0,0,0,.3)" dir=auto>${t}</div></div>`;
for(const [k,t] of Object.entries(SUB)){full(k,sub(t,930,34,1500));}
// vertical captions (1080x1920 layer, caption area under the video slot)
for(const [k,t] of Object.entries(SUB)){full('v_'+k,sub(t,1500,38,1000),1080,1920);}
full('v_card_ku',sub('Destê vekirî têkeve, <span style="color:'+GR+'">kulm nekeve</span>',1500,40,1000),1080,1920);
full('v_card_en',sub('Back D-ring: <span style="color:'+GR+'">between shoulder blades</span>',1500,40,1000),1080,1920);
// ---- outro ----
full('o_bg',`<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#ffffff 0%,#f6f4ef 70%,#efebe2 100%)"></div>
<div style="position:absolute;left:0;right:0;top:118px;height:3px;background:linear-gradient(90deg,transparent,${G},transparent);opacity:.7"></div>
<div style="position:absolute;left:0;right:0;bottom:118px;height:3px;background:linear-gradient(90deg,transparent,${G},transparent);opacity:.7"></div>`);
full('o_logo',`<div style="position:absolute;left:0;right:0;top:215px;display:flex;justify-content:center"><img src="logo.png" style="height:120px"></div>`);
full('o_slogan',`<div style="position:absolute;left:0;right:0;top:420px;text-align:center;color:${N};font-weight:800;font-size:72px">Doğru bilgi, <span style="background:${G};padding:2px 22px 8px;border-radius:12px">güvenli yaşam.</span></div>`);
full('o_langs',`<div style="position:absolute;left:0;right:0;top:600px;display:flex;justify-content:center;gap:22px">${['tr','ku','ar','en'].map(k=>`<div style="display:flex;align-items:center;gap:10px;background:#fff;border:3px solid ${G};border-radius:40px;padding:10px 24px">${spk(N)}<span style="color:${N};font-weight:700;font-size:32px">${L[k]}</span></div>`).join('')}</div>`);
full('o_cta',`<div style="position:absolute;left:0;right:0;top:760px;display:flex;justify-content:center"><div style="background:${N};color:#fff;font-weight:700;font-size:38px;padding:16px 40px;border-radius:16px">▶ Eğitimler YouTube'da <span style="color:${G}">·</span> @isingundemi</div></div>`);
// ---- vertical frame (house format) ----
const vf=(k)=>`<div style="position:absolute;inset:0;background:#fff"></div>
<div style="position:absolute;top:200px;left:0;right:0;display:flex;flex-direction:column;align-items:center">
 <img src="logo.png" style="height:84px">
 <div style="margin-top:22px;display:flex;align-items:center;gap:18px;font-weight:600;font-size:27px;color:${N}"><i style="display:block;width:150px;height:3px;background:${G}"></i>İş Dünyası | Çalışma Hayatı | İSG<i style="display:block;width:150px;height:3px;background:${G}"></i></div>
 <div style="margin-top:22px;width:960px;background:${G};color:${N};font-weight:800;font-size:58px;line-height:1.12;text-align:center;padding:18px 24px">İŞ GÜVENLİĞİ ARTIK 4 DİLDE</div>
 <div style="margin-top:22px;display:flex;align-items:center;gap:12px;background:#fff;border:3px solid ${G};border-radius:40px;padding:10px 26px">${spk(N)}<span style="color:${N};font-weight:800;font-size:36px">${L[k]}</span></div>
</div>
<div style="position:absolute;top:860px;left:0;width:1080px;height:608px;background:#000"></div>
<div style="position:absolute;top:1700px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:flex-end">
 <div><div style="font-weight:700;font-size:32px;color:${N}">Alpay Oktay</div><div style="font-weight:500;font-size:22px;color:#4a5068">A Sınıfı İş Güvenliği Uzmanı</div></div>
 <div style="font-weight:700;font-size:28px;color:${N}">@isingundemi</div></div>`;
['tr','ku','ar','en'].forEach(k=>jobs.push({name:'v_frame_'+k,w:1080,h:1920,html:vf(k),opaque:true}));
jobs.push({name:'v_frame_all',w:1080,h:1920,opaque:true,html:vf('tr').replace(/<div style="margin-top:22px;display:flex;align-items:center;gap:12px;background:#fff;border:3px[\s\S]*?<\/div>\n<\/div>/,`<div style="margin-top:22px;font-weight:800;font-size:42px;color:${GR}">Türkçe · Kurmancî · <span class=ar>العربية</span> · English</div>\n</div>`)});
(async()=>{const b=await chromium.launch();
for(const j of jobs){const p=await b.newPage({viewport:{width:j.w,height:j.h}});
let body=j.html;
fs.writeFileSync('_k.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}body{width:${j.w}px;height:${j.h}px}</style></head><body>${body}</body></html>`);
await p.goto('file://'+process.cwd()+'/_k.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);
if(j.center){await p.evaluate(()=>{const c=document.body.firstElementChild;const w=c.getBoundingClientRect().width;c.style.left=(960-w/2)+'px';});}
const out='../kolaj/ov/'+j.name+'.png';
if(j.clip){const bb=await (await p.$('#e')).boundingBox();await p.screenshot({path:out,omitBackground:true,clip:{x:bb.x,y:bb.y,width:Math.ceil(bb.width),height:Math.ceil(bb.height)}});}
else await p.screenshot({path:out,omitBackground:!j.opaque});
await p.close();}
await b.close();})();
