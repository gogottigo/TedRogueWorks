/* Optional authoring tool: requires Playwright, no runtime dependency. */
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
async function render(browser){
 const directory=path.join(root,'public/images/social');fs.mkdirSync(directory,{recursive:true});
 const image=(id,scene,width)=>'data:image/webp;base64,'+fs.readFileSync(path.join(root,'public/images/projects',id,`${scene}-${width}.webp`)).toString('base64');
 const cyr=fs.readFileSync(path.join(root,'public/fonts/inter-cyrillic-wght-normal.woff2')).toString('base64'),latin=fs.readFileSync(path.join(root,'public/fonts/inter-latin-wght-normal.woff2')).toString('base64');
 const cases=[
 ['studio',['Сайты.\nБоты.\nАвтоматизация.','Websites.\nBots.\nAutomation.'],['Telegram и MAX · от задачи к продукту','Telegram and MAX · from task to product'],image('profsanteh-plus','catalog',1440)],
 ['profistal14',['ПрофиСталь 14','Profistal14'],['Сайт и каталог изделий','Website and product catalog'],image('profistal14','catalog',1440)],
 ['profsanteh-plus',['ПрофСантех+','ProfSanteh+'],['Структура каталога и подбор','Catalog structure and selection'],image('profsanteh-plus','catalog',1440)],
 ['pekarnya-chudes',['Пекарня\nЧудес','Pekarnya\nChudes'],['Telegram-сервис · демоверсия','Telegram service · demonstration'],image('pekarnya-chudes','selection',390)],
 ['pravoslavnii-mir',['Православный\nМир','Pravoslavny\nMir'],['Поиск мест и библиотека · в разработке','Place discovery and library · in development'],image('pravoslavnii-mir','place',1440)]
 ];
 const p=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 for(const [id,titles,subtitles,src]of cases)for(const [i,lang]of ['ru','en'].entries()){
  await p.setContent(`<!doctype html><html lang="${lang}"><meta charset="utf-8"><style>
  @font-face{font-family:Inter;src:url(data:font/woff2;base64,${cyr});font-weight:100 900;unicode-range:U+0400-045F,U+2116}@font-face{font-family:Inter;src:url(data:font/woff2;base64,${latin});font-weight:100 900;unicode-range:U+0000-00FF,U+2000-206F}
  *{box-sizing:border-box}body{margin:0;background:#f4f2ec;color:#181a1d;font-family:Inter,Arial,sans-serif;padding:44px 48px}.brand{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #181a1d33;padding-bottom:24px;font-size:23px}.brand span{color:#686a6b;font-size:18px}.body{display:grid;grid-template-columns:1fr 490px;gap:30px;height:470px;padding-top:26px}.copy{display:flex;flex-direction:column;justify-content:center}.eyebrow{color:#1648d8;font-size:15px;letter-spacing:2px;margin:0 0 24px}h1{font-size:${id==='studio'?56:51}px;font-weight:500;line-height:1.13;letter-spacing:-2px;margin:0;white-space:pre-line;overflow-wrap:anywhere}p{font-size:21px;line-height:1.5;max-width:500px;margin:22px 0 0;color:#686a6b}.screen{height:450px;display:flex;align-items:center;justify-content:center;background:#e7e6e0;padding:14px;border:1px solid #181a1d22}img{display:block;max-width:100%;max-height:100%;height:auto;width:auto;object-fit:contain;box-shadow:0 4px 16px #181a1d15}
  </style><div class="brand">TRW Studio<span>trwstudio.art</span></div><div class="body"><div class="copy"><div class="eyebrow">${lang==='ru'?'СТУДИЯ РАЗРАБОТКИ':'DEVELOPMENT STUDIO'}</div><h1>${titles[i]}</h1><p>${subtitles[i]}</p></div><div class="screen"><img src="${src}" alt=""></div></div></html>`);
  await p.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});
  await p.screenshot({path:path.join(directory,`${id}-${lang}.jpg`),type:'jpeg',quality:90});
 }
 await p.close();return {images:10,width:1200,height:630};
}
module.exports={render};
if(require.main===module){const {chromium}=require('playwright');(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{}),args:['--no-sandbox']});try{console.log(await render(browser));}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1})}
