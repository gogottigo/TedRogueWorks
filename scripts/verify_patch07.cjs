/* DOM behavior checks, not a browser/layout/physical Android test.
   Requires optional jsdom; no runtime website dependency. */
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {JSDOM}=require('jsdom');
const root=process.env.TRW_QA_ROOT||path.resolve(__dirname,'..'),dist=path.join(root,'dist');
const bundled=(d,token)=>[...d.querySelectorAll('script[type=module]')].filter(e=>e.textContent.includes(token)).map(e=>e.textContent).join('\n');
const wait=()=>new Promise(r=>setTimeout(r,0));
function page(route){return new JSDOM(fs.readFileSync(path.join(dist,route,'index.html'),'utf8'),{url:'https://local.test/'+route+'/',runScripts:'outside-only',pretendToBeVisual:true});}
async function run(){
 const report={kind:'jsdom logic and static metadata; NO layout engine/browser/device verification',galleries:[],forms:[],metadata:[],prices:[],limits:['DOM report does not measure layout; see QA_PATCH07_BROWSER.json for real Chromium results','Physical Android system text and physical gallery recheck remain open']};
 for(const lang of ['','en/'])for(const id of ['profistal14','pekarnya-chudes','profsanteh-plus','pravoslavnii-mir']){
  const dom=page(lang+'projects/'+id),w=dom.window,d=w.document,dialog=d.querySelector('dialog'),viewport=d.querySelector('.screen-zoom'),img=viewport.querySelector('img');
  dialog.showModal=()=>{dialog.open=true;d.querySelector('[data-close]').focus()};dialog.close=()=>{dialog.open=false;dialog.dispatchEvent(new w.Event('close'))};
  viewport.scrollTo=(x,y)=>{viewport.scrollLeft=x;viewport.scrollTop=y};viewport.setPointerCapture=()=>{};
  let viewportWidth=350;Object.defineProperty(viewport,'clientWidth',{get:()=>viewportWidth});
  let fail=false,pending;img.decode=()=>pending|| (fail?Promise.reject(Error('test failed image')):Promise.resolve());
  w.HTMLElement.prototype.getClientRects=function(){return [{width:50,height:44}]};
  const vv=new w.EventTarget();Object.assign(vv,{width:390,height:700,offsetLeft:0,offsetTop:0});Object.defineProperty(w,'visualViewport',{value:vv});
  w.eval(bundled(d,'data-gallery'));const links=[...d.querySelectorAll('.screen-link')],zoom=d.querySelector('[data-zoom]');
  for(let i=0;i<links.length;i++){
   links[i].click();await wait();assert(dialog.open);assert(!img.hidden);assert.equal(img.src,links[i].href);assert.equal(viewport.getAttribute('aria-busy'),'false');
   assert.equal(zoom.getAttribute('aria-pressed'),'false');zoom.click();assert.equal(zoom.getAttribute('aria-pressed'),'true');assert(dialog.hasAttribute('data-actual-size'));assert.equal(d.activeElement,viewport);
   assert(parseFloat(dialog.style.getPropertyValue('--image-width'))>=630);
   const pointer=(type,x,y)=>{const e=new w.MouseEvent(type,{bubbles:true,clientX:x,clientY:y,button:0});Object.defineProperties(e,{pointerId:{value:1},pointerType:{value:'mouse'}});viewport.dispatchEvent(e)};
   pointer('pointerdown',200,200);pointer('pointermove',100,120);assert.equal(viewport.scrollLeft,100);assert.equal(viewport.scrollTop,80);pointer('pointerup',100,120);assert(!viewport.hasAttribute('data-dragging'));
   vv.width=700;vv.height=320;viewportWidth=660;vv.dispatchEvent(new w.Event('resize'));assert.equal(dialog.style.getPropertyValue('--viewer-width'),'672px');assert(parseFloat(dialog.style.getPropertyValue('--image-width'))>=1188);
   vv.width=390;vv.height=700;viewportWidth=350;vv.dispatchEvent(new w.Event('resize'));
   zoom.click();assert.equal(viewport.scrollLeft,0);assert.equal(viewport.scrollTop,0);assert(!dialog.hasAttribute('data-actual-size'));
   const native=d.querySelector('[data-native]');native.click();assert.equal(native.getAttribute('aria-pressed'),'true');assert.equal(parseFloat(dialog.style.getPropertyValue('--image-width')),Number(links[i].dataset.width));native.click();assert(!dialog.hasAttribute('data-actual-size'));
   d.querySelector('[data-next]').click();await wait();assert.equal(img.src,links[(i+1)%links.length].href);assert.equal(zoom.getAttribute('aria-pressed'),'false');
   d.querySelector('[data-prev]').click();await wait();assert.equal(img.src,links[i].href);
   img.click();assert(dialog.open);d.querySelector('[data-close]').click();assert(!dialog.open);assert.equal(d.activeElement,links[i]);assert(!d.documentElement.classList.contains('gallery-open'));
  }
  fail=true;links[0].click();await wait();assert(img.hidden);assert(zoom.disabled);assert(d.querySelector('[data-screen-status]').textContent);assert.equal(viewport.getAttribute('aria-busy'),'false');
  fail=false;d.querySelector('[data-next]').click();await wait();assert(!img.hidden);assert(!zoom.disabled);assert.equal(d.querySelector('[data-screen-status]').textContent,'');dialog.close();
  let resolve;pending=new Promise(r=>resolve=r);links[0].click();dialog.close();resolve();await wait();assert(!dialog.open);assert(img.hidden);pending=undefined;
  report.galleries.push({route:lang+'projects/'+id,screens:links.length,loadZoomPanFitNavigationFocusClose:true,exactOneToOne:true,simulatedViewportResize:true,errorRecoveryAndStaleLoad:true});dom.window.close();
 }
 for(const lang of ['','en/'])for(const route of [lang,lang+'contact']){
  const dom=page(route),w=dom.window,d=w.document;let opened;w.open=(url)=>{opened=new URL(url)};w.eval(bundled(d,'data-project-form'));
  const form=d.querySelector('form'),select=form.querySelector('select');
  form.querySelector('[name=name]').value='Тест & Test';form.querySelector('[name=reply]').value='@test';form.querySelector('textarea').value='Нужен бот MAX\nКаталог и заявки';select.value='telegram';
  assert(select.selectedOptions[0].textContent.includes('MAX'));assert(!form.querySelector('button').disabled);
  form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(opened.origin,'https://t.me');assert.equal(opened.pathname,'/share/url');assert(opened.searchParams.get('text').includes('MAX'));assert(opened.searchParams.get('text').includes('Тест & Test'));assert(opened.searchParams.get('text').includes('\nКаталог и заявки'));
  opened=undefined;form.querySelector('[name=name]').value='   ';form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));assert.equal(opened,undefined);
  report.forms.push({route,MAXOption:true,encodedShareText:true,whitespaceBlocked:true,nativeTelegram:'Not exercised; Patch06 verified by user video 1072'});dom.window.close();
 }
 const gather=(dir)=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?gather(path.join(dir,e.name)):e.name.endsWith('.html')?[path.join(dir,e.name)]:[]);
 for(const f of gather(dist)){
  const dom=new JSDOM(fs.readFileSync(f,'utf8')),d=dom.window.document;if(f.endsWith('404.html')){assert(d.querySelector('meta[name=robots]').content.includes('noindex'));dom.window.close();continue;}
  const canonical=d.querySelector('link[rel=canonical]').href;assert(canonical.startsWith('https://trwstudio.art/'));assert.equal(d.querySelectorAll('[hreflang]').length,3);assert.equal(d.querySelector('meta[property="og:description"]').content,d.querySelector('meta[name=description]').content);
  const image=d.querySelector('meta[property="og:image"]').content;assert(fs.existsSync(path.join(dist,new URL(image).pathname)));report.metadata.push(path.relative(dist,f));dom.window.close();
 }
 for(const lang of ['','en/']){const dom=page(lang+'about'),d=dom.window.document;assert(d.querySelector('meta[name=description]').content.includes('MAX'));assert.equal(d.querySelectorAll('.studio-faq details').length,9);
  const numbers=[...d.querySelectorAll('[data-price-id]')].map(e=>[e.dataset.priceMin,e.dataset.priceMax,e.dataset.weeks]);assert.deepEqual(numbers,[['50000','80000','2-4'],['80000','150000','4-6'],['100000','200000','5-8'],['45000','90000','3-5'],['160000','320000','8-12'],['30000','70000','2-4'],['15000','40000','1-2']]);assert.equal(d.querySelector('[data-defect-days]').dataset.defectDays,'30');report.prices.push({locale:lang?'en':'ru',allSevenRangesUnchanged:true,defectWindow:30});dom.window.close();}
 return report;
}
module.exports={run};if(require.main===module)run().then(r=>console.log(JSON.stringify(r,null,2))).catch(e=>{console.error(e);process.exitCode=1});
