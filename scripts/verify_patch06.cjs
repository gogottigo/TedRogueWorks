const fs=require('fs'),path=require('path'),http=require('http'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
async function run(options={}){
 const root=path.resolve(__dirname,'../dist'),report={metadata:[],gallery:[],pinch:[],notFound:[]};
 const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.svg':'image/svg+xml'};
 function fileFor(uri){let f=path.join(root,decodeURIComponent(uri));if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');return f;}
 const server=http.createServer((req,res)=>{const f=fileFor(new URL(req.url,'http://local').pathname);if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){res.writeHead(404).end();return}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,...options});
 try{
  const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  const urls=[...fs.readFileSync(path.join(root,'sitemap.xml'),'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);assert.equal(urls.length,20);assert(!urls.some(u=>u.includes('404')));
  for(const url of urls){const route=new URL(url).pathname;await p.goto(origin+route);const meta=await p.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,image:document.querySelector('meta[property="og:image"]')?.content,alternates:[...document.querySelectorAll('link[hreflang]')].map(e=>({lang:e.hreflang,href:e.href}))}));assert.equal(meta.canonical,url);assert(meta.title&&meta.description);assert.equal(meta.alternates.length,3);assert(meta.image.startsWith('https://trwstudio.art/images/social/'));assert(fs.existsSync(fileFor(new URL(meta.image).pathname)));for(const a of meta.alternates)assert(urls.includes(a.href));report.metadata.push({route,status:'PASS'});}
  report.headingChecks=0;
  for(const width of [320,390,768,1440])for(const locale of ['', '/en'])for(const route of ['/', '/projects/', '/projects/pravoslavnii-mir/']){
   await p.setViewportSize({width,height:900});await p.goto(origin+locale+route);await p.evaluate(()=>document.fonts.ready);
   const fragments=await p.locator('.project-card-title,.portfolio-case h1').evaluateAll(es=>es.map(e=>{const n=e.firstChild,word=e.textContent.trim().split(' ')[0],r=document.createRange();r.setStart(n,0);r.setEnd(n,Math.min(word.length,n.textContent.length));return {text:e.textContent,lines:r.getClientRects().length}}));
   assert(fragments.every(f=>f.lines===1),JSON.stringify({width,locale,route,fragments}));report.headingChecks+=fragments.length;
  }
  await p.setViewportSize({width:390,height:844});
  await p.goto(origin+'/projects/profistal14/');await p.locator('.screen-link').first().click();await p.locator('.screen-zoom img').evaluate(i=>i.decode());
  const original=await p.locator('.screen-toolbar').boundingBox();
  for(let n=0;n<4;n++){const fit=await p.locator('.screen-zoom').evaluate(el=>{const a=el.getBoundingClientRect(),b=el.querySelector('img').getBoundingClientRect();return {frame:a.height,image:b.height,width:b.width,frameWidth:a.width}});assert(fit.image<=fit.frame+1,JSON.stringify(fit));assert(fit.width<=fit.frameWidth+1);const box=await p.locator('.screen-toolbar').boundingBox();assert(Math.abs(box.y-original.y)<1,'Toolbar moves between images');await p.locator('[data-next]').click();await p.locator('.screen-zoom img').evaluate(i=>i.decode());}
  report.gallery.push('PASS: stable toolbar across landscape/portrait images; full image fits');
  await p.keyboard.press('Escape');await p.goto(origin+'/projects/pekarnya-chudes/');await p.locator('.screen-link').first().click();await p.locator('.screen-zoom img').evaluate(i=>i.decode());const before=await p.locator('dialog').boundingBox();let release;
  await p.locator('.screen-link').nth(1).evaluate(e=>e.href+='?qa=delayed');await p.route('**/pekarnya-chudes/catalog-390.webp*',async route=>{await new Promise(r=>release=r);await route.abort();});await p.locator('[data-next]').click();await p.waitForFunction(()=>document.querySelector('.screen-zoom').getAttribute('aria-busy')==='true');const loading=await p.locator('dialog').boundingBox();assert(Math.abs(before.y-loading.y)<1&&Math.abs(before.height-loading.height)<1);while(!release)await p.waitForTimeout(20);release();await p.waitForFunction(()=>document.querySelector('[data-screen-status]').textContent.includes('Не удалось'));await p.unroute('**/pekarnya-chudes/catalog-390.webp*');await p.locator('[data-next]').click();await p.locator('.screen-zoom img').evaluate(i=>i.decode());report.gallery.push('PASS: delayed/failed load preserves dialog size; next image recovers');
  const cdp=await p.context().newCDPSession(p);
  for(const factor of [1.5,2,2.5]){await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:factor});await p.waitForTimeout(150);const position=await p.locator('[data-close]').evaluate(e=>{const r=e.getBoundingClientRect(),v=visualViewport;return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,vx:v.offsetLeft,vy:v.offsetTop,vw:v.width,vh:v.height}});assert(position.x>=position.vx-1&&position.right<=position.vx+position.vw+1&&position.y>=position.vy-1&&position.bottom<=position.vy+position.vh+1,JSON.stringify(position));report.pinch.push({factor,closeReachable:true});}
  await cdp.send('Emulation.setPageScaleFactor',{pageScaleFactor:1});await p.locator('[data-close]').click();
  const html=fs.readFileSync(path.join(root,'404.html'),'utf8');assert(/noindex,follow/.test(html));
  for(const base of ['https://trwstudio.art','https://gogottigo.github.io/TedRogueWorks']){
   const q=await browser.newPage();await q.route('**/*',async route=>{const u=new URL(route.request().url());let pathname=u.pathname.replace(/^\/TedRogueWorks/,'');const missing=pathname==='/missing/deep/page/';const f=missing?path.join(root,'404.html'):fileFor(pathname);if(fs.existsSync(f)){await route.fulfill({status:missing?404:200,contentType:mime[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)})}else await route.fulfill({status:404,body:''});});await q.goto(base+'/missing/deep/page/');const bg=await q.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor);assert.equal(bg,'rgb(244, 242, 236)');await q.locator('.site-footer > a').click();assert.equal(q.url(),base+'/index.html');report.notFound.push({base,styled:true,homeLink:true});await q.close();
  }
  report.physicalAndroid='OPEN: physical rotation, text setting, generated Telegram draft and gallery recheck require user device';
  return report;
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
module.exports={run};
if(require.main===module)run(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{}).then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e);process.exitCode=1});
