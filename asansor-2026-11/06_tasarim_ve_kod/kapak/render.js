const {chromium}=require('playwright');const fs=require('fs');
const base=fs.readFileSync('kapak.html','utf8');
const v={
 tr:{TAG:'İş Dünyası | Çalışma Hayatı | İSG',UST:'TEMEL İSG EĞİTİMİ',H1:'YANGINDA',BAND:'NE YAPMALISIN?',ALT:'Önle <b>·</b> Söndür <b>·</b> Tahliye ol',SURE:'⏱ <em>1 dakikada</em> temel eğitim',DILS:'Türkçe · English',UNVAN:'A Sınıfı İş Güvenliği Uzmanı'},
 en:{TAG:'Business | Working Life | OHS',UST:'BASIC SAFETY TRAINING',H1:'FIRE SAFETY',BAND:'WHAT TO DO?',ALT:'Prevent <b>·</b> Extinguish <b>·</b> Evacuate',SURE:'⏱ <em>1-minute</em> essential training',DILS:'English · Türkçe',UNVAN:'Certified OHS Expert (Class A, Türkiye)'}};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:2});
for(const k of Object.keys(v)){let h=base;for(const [a,c] of Object.entries(v[k]))h=h.replaceAll('__'+a+'__',c);fs.writeFileSync('k_'+k+'.html',h);
await p.goto('file://'+process.cwd()+'/k_'+k+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);
await p.screenshot({path:'kapak-'+k+'-2x.png'});}
await b.close();})();
