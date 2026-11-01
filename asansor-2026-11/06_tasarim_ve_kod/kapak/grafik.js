const {chromium}=require('playwright');const fs=require('fs');
const css=`@font-face{font-family:P;font-weight:600;src:url(poppins-latin-ext-600-normal.woff2),url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:600;unicode-range:U+0000-00FF;src:url(poppins-latin-600-normal.woff2)}
@font-face{font-family:P;font-weight:800;src:url(poppins-latin-ext-800-normal.woff2),url(poppins-latin-800-normal.woff2)}
@font-face{font-family:P;font-weight:800;unicode-range:U+0000-00FF;src:url(poppins-latin-800-normal.woff2)}
*{margin:0;padding:0}body{width:1920px;height:1080px;background:transparent;position:relative;overflow:hidden;font-family:P}`;
const E={
 filigran:`<div style="position:absolute;right:44px;bottom:40px;display:flex;flex-direction:column;align-items:flex-end;opacity:.62;filter:drop-shadow(0 2px 6px rgba(0,0,0,.55))">
  <div style="background:rgba(255,255,255,.88);border-radius:12px;padding:8px 14px"><img src="logo.png" style="height:34px;display:block"></div>
  <div style="color:#fff;font-weight:600;font-size:20px;margin-top:4px;letter-spacing:.5px">@isingundemi</div></div>`,
 giris:`<div style="position:absolute;right:120px;top:300px;width:760px;display:flex;flex-direction:column;align-items:flex-start">
  <div style="background:#fff;border-radius:22px;padding:22px 34px;box-shadow:0 18px 50px rgba(0,0,0,.35);border-bottom:8px solid #d9a521"><img src="logo.png" style="height:92px;display:block"></div>
  <div style="margin-top:26px;display:flex;align-items:center;gap:16px">
   <div style="background:#1c2a4a;color:#d9a521;font-weight:800;font-size:34px;padding:10px 22px;border-radius:14px">3.ç</div>
   <div style="background:#d9a521;padding:14px 26px;border-radius:14px;display:flex;align-items:center;gap:16px">
    <svg viewBox="0 0 24 24" width="52" height="52"><path d="M12 2c3.8 4.3 6 6.9 6 10.3a6 6 0 0 1-12 0C6 9.7 8 8.1 9 6c.9 2.1 2.4 3.1 3 3.3z" fill="#fff" stroke="#c8321e" stroke-width="1.6" stroke-linejoin="round"/></svg>
    <span style="color:#1c2a4a;font-weight:800;font-size:46px;letter-spacing:1px">YANGIN · FIRE</span></div></div>
  <div style="margin-top:18px;display:flex;align-items:center;gap:12px;background:rgba(28,42,74,.9);border-radius:40px;padding:10px 22px">
   <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="#d9a521"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>
   <span style="color:#fff;font-weight:600;font-size:26px">TR <span style="color:#d9a521">|</span> EN</span></div></div>`,
 kapanis:`<div style="position:absolute;left:50%;top:70px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center">
  <div style="background:#fff;border-radius:22px;padding:18px 30px;box-shadow:0 18px 50px rgba(0,0,0,.35);border-bottom:8px solid #d9a521"><img src="logo.png" style="height:78px;display:block"></div>
  <div style="margin-top:14px;background:rgba(28,42,74,.92);color:#fff;font-weight:600;font-size:30px;padding:10px 26px;border-radius:40px">@isingundemi</div></div>`
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
for(const [k,h] of Object.entries(E)){fs.writeFileSync('_g.html',`<!doctype html><html><head><meta charset=utf-8><style>${css}</style></head><body>${h}</body></html>`);
await p.goto('file://'+process.cwd()+'/_g.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
await p.screenshot({path:'ov/'+k+'.png',omitBackground:true});}
await b.close();})();
