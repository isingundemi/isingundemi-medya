const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
for(const [bg,top,patch,out] of [['bg_kemer.jpg',452,'','kemer4'],['bg_yangin.jpg',454,'50,462,300,50&sm=1','yangin4']]){
await p.goto('file://'+process.cwd()+'/dil4.html?bg='+bg+'&top='+top+'&patch='+patch);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);
await p.screenshot({path:out+'.jpg',type:'jpeg',quality:95});}
await b.close();})();
