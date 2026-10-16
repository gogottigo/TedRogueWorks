/* Optional: npm install --no-save --package-lock=false playwright, then
   npx playwright install chromium && node scripts/verify_browser.cjs.
   No external messages are sent: the form's window.open is intercepted. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const { pathToFileURL } = require('node:url');
const routePath = value => new URL(value).pathname.replace(/index\.html$/, '');

async function run(launchOptions = {}) {
  const root = path.resolve(__dirname, '../dist');
  const routes = [];
  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, item.name);
      if (item.isDirectory()) walk(file);
      else if (file.endsWith('.html')) {
        const rel = path.relative(root, file).replaceAll(path.sep, '/');
        routes.push('/' + (rel.endsWith('index.html') ? rel.slice(0, -10) : rel));
      }
    }
  }
  walk(root);
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
  const server = http.createServer((req, res) => {
    let requested = decodeURIComponent(new URL(req.url, 'http://local').pathname);
    if (requested.startsWith('/spck-preview/TRW_Studio/dist/')) requested = requested.slice('/spck-preview/TRW_Studio/dist'.length);
    let file = path.resolve(root, '.' + requested);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  const report = { pages: routes.length, visits: 0, widths: [320, 360, 390, 430, 768, 1440], overflows: [], pageErrors: [], httpErrors: [] };
  try {
    browser = await chromium.launch({ headless: true, ...launchOptions });
    report.browser = browser.version();
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const origin = `http://127.0.0.1:${server.address().port}`;
    page.on('pageerror', e => report.pageErrors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) report.httpErrors.push({ url: r.url(), status: r.status() }); });
    for (const width of report.widths) {
      await page.setViewportSize({ width, height: 900 });
      for (const url of routes) {
        await page.goto(origin + url);
        assert.equal(await page.locator('h1').count(), 1, url);
        const expected = url === '/404.html' ? '/en/' : url.startsWith('/en/') ? url.slice(3) : '/en' + url;
        assert.equal(routePath(await page.locator('.language-link').evaluate(e => e.href)), expected, url);
        const size = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
        if (size.scroll > size.width + 1) {
          const elements = await page.evaluate(() => [...document.querySelectorAll('main *')]
            .filter(e => e.getBoundingClientRect().right > innerWidth + 1)
            .map(e => ({ tag: e.tagName, class: e.getAttribute('class'), right: Math.round(e.getBoundingClientRect().right) }))
            .slice(-8));
          report.overflows.push({ url, width, scrollWidth: size.scroll, elements });
        }
        report.visits++;
      }
    }
    // Real captures replace the old decorative SVG preview.
    for (const url of ['/', '/en/', '/projects/', '/en/projects/']) {
      await page.goto(origin + url);
      const images = page.locator('.real-project-preview img');
      assert.equal(await images.count(), 3);
      await images.evaluateAll(items => items.forEach(image => image.loading = 'eager'));
      await page.waitForFunction(() => [...document.querySelectorAll('.real-project-preview img')].every(i => i.complete && i.naturalWidth > 0));
    }
    report.realPreviews = 'PASS: all 3 project captures load in RU/EN';
    for (const url of ['/', '/en/', '/projects/', '/en/projects/']) {
      await page.goto(origin + url);
      const indices = await page.locator('.project-case-index').allTextContents();
      assert.deepEqual(indices.map(s => s.trim().slice(0, 2)), ['01', '02', '03']);
    }
    for (const rootPath of ['', '/en']) for (const slug of ['profistal14', 'pekarnya-chudes', 'profsanteh-plus']) {
      const route = rootPath + '/projects/' + slug + '/';
      await page.goto(origin + route);
      await page.setViewportSize({width:390,height:844});
      const links=page.locator('.screen-link');
      const total=await links.count();
      for(let n=0;n<total;n++) {
        const image=links.nth(n).locator('img');
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(i=>i.loading='eager');
        await page.waitForFunction(i=>i.complete && i.naturalWidth>0,await image.elementHandle());
      }
      await links.first().click();
      await page.locator('dialog[open]').waitFor();
      assert(await page.locator('[data-screen-caption]').innerText().then(t=>t.startsWith('1 /')));
      await page.locator('[data-next]').click();
      assert(await page.locator('[data-screen-caption]').innerText().then(t=>t.startsWith('2 /')));
      await page.keyboard.press('ArrowLeft');
      assert(await page.locator('[data-screen-caption]').innerText().then(t=>t.startsWith('1 /')));
      await page.keyboard.press('Escape');
      await page.locator('dialog').waitFor({state:'hidden'});
      assert(await links.first().evaluate(e=>e===document.activeElement));
    }
    report.caseGalleries='PASS: all 6 cases, every image, arrows, keyboard, Escape and focus return';
    await page.setViewportSize({width:1440,height:900});
    // Patch 04: shared commercial data, native FAQ and contact form journeys.
    const commercial = [];
    for (const locale of ['ru', 'en']) {
      const prefix = locale === 'ru' ? '' : '/en';
      await page.goto(origin + prefix + '/about/');
      await page.setViewportSize({ width: 390, height: 844 });
      commercial.push(await page.locator('[data-price-id]').evaluateAll(items => items.map(i => ({id:i.dataset.priceId,min:i.dataset.priceMin,max:i.dataset.priceMax,weeks:i.dataset.weeks}))));
      assert.equal(commercial.at(-1).length, 7);
      assert.equal(await page.locator('[data-defect-days]').getAttribute('data-defect-days'), '30');
      assert.equal(await page.locator('.studio-faq details').count(), 8);
      for (const item of await page.locator('.studio-faq details').all()) {
        const summary = item.locator('summary');
        await summary.focus();
        await page.keyboard.press('Enter');
        assert.equal(await item.getAttribute('open'), '');
        assert(await item.locator('p').isVisible());
        const bounds = await item.boundingBox();
        assert(bounds.x >= 0 && bounds.x + bounds.width <= 391);
        await summary.press('Enter');
        assert.equal(await item.getAttribute('open'), null);
      }
      // The contact page uses the original Telegram Share transport, without sending anything.
      await page.goto(origin + prefix + '/contact/');
      await page.evaluate(() => {window.__opened=[];window.open=(...args)=>{window.__opened.push(args);return null;};});
      await page.locator('[name=name]').fill('Contact test');
      await page.locator('[name=reply]').fill('@preview');
      await page.locator('[name=service]').selectOption('web');
      await page.locator('[name=message]').fill('A website & bot');
      await page.locator('#project-form button').click();
      const entries = await page.evaluate(()=>window.__opened);
      assert.equal(entries.length,1);
      const shared = new URL(entries[0][0]);
      assert.equal(shared.origin+shared.pathname,'https://t.me/share/url');
      assert.equal(shared.searchParams.get('url'),'https://trwstudio.art'+prefix+'/');
      assert(shared.searchParams.get('text').includes('A website & bot'));
      assert(shared.searchParams.get('text').includes(locale==='ru'?'Направление: Сайты и каталоги.':'Service: Websites and catalogs.'));
      // The pricing links are usable with both mobile menu and footer navigation.
      await page.locator('.nav-toggle').click();
      await page.locator('#site-navigation a[href*="#pricing"]').click();
      assert.equal(new URL(page.url()).hash,'#pricing');
      assert.equal(routePath(page.url()),prefix+'/about/');
      await page.locator('.site-footer a[href*="#terms"]').click();
      assert.equal(new URL(page.url()).hash,'#terms');
    }
    assert.deepEqual(commercial[0],commercial[1], 'Commercial numbers and ranges must match in RU/EN');
    report.commercial = 'PASS: 7 matching prices/time ranges, 30-day policy, 16 FAQ keyboard interactions, RU/EN contact Share flow, pricing/terms navigation';
    await page.setViewportSize({width:1440,height:900});
    // Follow links in both directions, including actual articles.
    for (const url of ['/about/', '/projects/pekarnya-chudes/', '/blog/redmi-13c-home-server/']) {
      await page.goto(origin + url);
      await page.locator('.language-link').click();
      assert.equal(routePath(page.url()), '/en' + url);
      await page.locator('.language-link').click();
      assert.equal(routePath(page.url()), url);
    }
    report.languageNavigation = 'PASS: 3 round trips';
    await page.goto(origin + '/');
    await page.evaluate(() => { window.__opened = []; window.open = (...args) => { window.__opened.push(args); return null; }; });
    await page.locator('#project-form button').click();
    assert.equal(await page.evaluate(() => window.__opened.length), 0);
    await page.locator('[name=name]').fill('Тест & проверка');
    await page.locator('[name=reply]').fill('@test_user');
    await page.locator('[name=message]').fill('Каталог + бот #1\nНовая строка');
    await page.locator('#project-form button').click();
    const opened = await page.evaluate(() => window.__opened);
    assert.equal(opened.length, 1);
    const share = new URL(opened[0][0]);
    assert.equal(share.origin + share.pathname, 'https://t.me/share/url');
    assert.equal(share.searchParams.get('url'), 'https://trwstudio.art/');
    assert.equal(share.searchParams.get('text'), 'Здравствуйте! Меня зовут Тест & проверка.\nСвязаться со мной: @test_user.\n\nО проекте:\nКаталог + бот #1\nНовая строка');
    // Check both languages, every service CTA, and preservation of an existing draft.
    const structures = [];
    let serviceChecks = 0;
    for (const [url, locale] of [['/', 'ru'], ['/en/', 'en']]) {
      await page.goto(origin + url);
      structures.push(await page.locator('.studio-home').evaluate(e => [...e.querySelectorAll('*')].map(n => n.tagName)));
      assert.equal(await page.locator('[data-service-card]').count(), 4);
      assert.equal(await page.locator('.home-process-list > li').count(), 4);
      assert.equal(await page.locator('.home-step-output').count(), 4);
      await page.evaluate(() => { window.__opened = []; window.open = (...args) => { window.__opened.push(args); return null; }; });
      await page.locator('#project-form button').click();
      assert.equal(await page.evaluate(() => window.__opened.length), 0);
      await page.locator('[name=name]').fill('Test & Тест');
      await page.locator('[name=reply]').fill('@test_user');
      await page.locator('[name=message]').fill('Draft + текст #1\nSecond line');
      for (const service of ['web', 'telegram', 'automation', 'support']) {
        await page.locator(`[data-select-service="${service}"]`).click();
        assert.equal(new URL(page.url()).hash, '#contact');
        assert.equal(await page.locator('[name=service]').inputValue(), service);
        assert.equal(await page.locator('[name=message]').inputValue(), 'Draft + текст #1\nSecond line');
        await page.locator('#project-form button').click();
        const args = await page.evaluate(() => window.__opened.at(-1));
        const payload = new URL(args[0]);
        const selected = await page.locator('[name=service] option:checked').textContent();
        const expectedText = locale === 'ru'
          ? `Здравствуйте! Меня зовут Test & Тест.\nСвязаться со мной: @test_user.\n\nНаправление: ${selected}.\nО проекте:\nDraft + текст #1\nSecond line`
          : `Hello! My name is Test & Тест.\nYou can reach me at: @test_user.\n\nService: ${selected}.\nAbout the project:\nDraft + текст #1\nSecond line`;
        assert.equal(payload.origin + payload.pathname, 'https://t.me/share/url');
        assert.equal(payload.searchParams.get('url'), 'https://trwstudio.art' + url);
        assert.equal(payload.searchParams.get('text'), expectedText);
        serviceChecks++;
      }
      const count = await page.evaluate(() => window.__opened.length);
      await page.locator('[name=service]').selectOption('');
      assert.equal(await page.evaluate(() => window.__opened.length), count, 'Changing a selection must not send a message');
      await page.locator('#project-form button').click();
      const last = new URL((await page.evaluate(() => window.__opened.at(-1)))[0]);
      assert(!last.searchParams.get('text').includes(locale === 'ru' ? 'Направление:' : 'Service:'));
      const exampleLinks = await page.locator('.home-example-link').evaluateAll(links => links.map(a => new URL(a.href).pathname.replace(/index\.html$/, '')));
      assert.deepEqual(exampleLinks, [url + 'projects/profistal14/', url + 'projects/pekarnya-chudes/']);
    }
    assert.deepEqual(structures[0], structures[1], 'Home DOM structures must match across languages');
    report.homeParity = 'PASS: identical section/component structure in RU and EN';
    report.services = `PASS: ${serviceChecks} service CTA and localized payload checks; typed draft preserved`;
    report.form = 'PASS: original RU message retained; RU/EN validation, default and selected services, Unicode and multiline; window.open intercepted';
    const noJS = await browser.newContext({ javaScriptEnabled: false });
    const plain = await noJS.newPage();
    for (const url of ['/', '/en/']) {
      await plain.goto(origin + url);
      assert(await plain.locator('#project-form button').isDisabled());
      assert.equal(await plain.locator('.home-contact-direct').getAttribute('href'), 'https://t.me/gogottigotti');
      await plain.locator('[data-select-service="web"]').click();
      assert.equal(new URL(plain.url()).hash, '#contact');
    }
    for (const prefix of ['', '/en']) {
      await plain.goto(origin + prefix + '/about/');
      const faq=plain.locator('.studio-faq details').first();
      await faq.locator('summary').click();
      assert(await faq.locator('p').isVisible());
      assert.equal(await plain.locator('[data-price-id]').count(),7);
      await plain.goto(origin+prefix+'/contact/');
      assert(await plain.locator('#project-form button').isDisabled());
      assert.equal(await plain.locator('.home-contact-direct').getAttribute('href'),'https://t.me/gogottigotti');
    }
    // Both contexts are disposed by browser.close() in finally. This also works
    // with serverless Chromium builds that run contexts in a single process.
    report.noJavaScript = 'PASS: home/contact anchors and direct Telegram links; inactive forms; RU/EN FAQ and prices without JS';
    // Disclosure menu: tap, Escape, outside click, and desktop/mobile transitions.
    for (const url of ['/', '/en/']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(origin + url);
      const toggle = page.locator('.nav-toggle');
      assert(await toggle.isVisible());
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert(!(await page.locator('.site-nav').isVisible()));
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      assert(await page.locator('.site-nav').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      assert(await toggle.evaluate(e => e === document.activeElement));
      await toggle.click();
      await page.locator('#hero-title').click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
      await page.setViewportSize({ width: 1440, height: 900 });
      assert(await page.locator('.site-nav').isVisible());
      assert(!(await toggle.isVisible()));
      await page.setViewportSize({ width: 390, height: 844 });
      assert(!(await page.locator('.site-nav').isVisible()));
      const action = await page.locator('.home-hero-actions .studio-action').first().evaluate(e => ({ color: getComputedStyle(e).color, background: getComputedStyle(e).backgroundColor, border: getComputedStyle(e).borderBottomStyle }));
      assert.equal(action.color, 'rgb(22, 72, 216)');
      assert.equal(action.background, 'rgba(0, 0, 0, 0)');
      assert.equal(action.border, 'solid');
      assert.equal(await page.locator('.motion-orbit').evaluate(e => getComputedStyle(e).animationName), 'none');
    }
    report.mobileMenu = 'PASS: RU/EN tap, Escape/focus, outside click, responsive reset';
    report.cta = 'PASS: shared blue underlined actions, transparent background';
    const animated = await browser.newContext({ reducedMotion: 'no-preference' });
    const moving = await animated.newPage();
    for (const url of ['/', '/en/']) {
      await moving.goto(origin + url);
      assert.equal(await moving.locator('.motion-orbit').evaluate(e => getComputedStyle(e).animationName), 'home-orbit');
    }
    report.animation = 'PASS: shared orbit in RU/EN; disabled for reduced motion';
    // The same dist must work under a directory mount, without rewriting the domain settings.
    const prefix = '/spck-preview/TRW_Studio/dist';
    await page.setViewportSize({ width: 1440, height: 900 });
    const escaped = [];
    const watch = req => { const u = new URL(req.url()); if (u.origin === origin && !u.pathname.startsWith(prefix + '/')) escaped.push(u.pathname); };
    page.on('request', watch);
    for (const url of routes) {
      await page.goto(origin + prefix + url);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 242, 236)');
    }
    await page.goto(origin + prefix + '/index.html');
    assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 242, 236)');
    assert(await page.locator('.profistal-real-preview img').evaluate(e => e.complete && e.naturalWidth > 0));
    await page.locator('.home-work .project-repo-link').first().click();
    assert.equal(routePath(page.url()), prefix + '/projects/profistal14/');
    await page.locator('.language-link').click();
    assert.equal(routePath(page.url()), prefix + '/en/projects/profistal14/');
    await page.locator('.site-footer > a').click();
    assert.equal(routePath(page.url()), prefix + '/en/');
    assert(await page.locator('#project-form button').isEnabled());
    page.off('request', watch);
    assert.deepEqual(escaped, []);
    report.nestedPreview = 'PASS: all 19 pages styled; image, case, language, footer and JS under /spck-preview/TRW_Studio/dist/';
    // Test every page as a local file, then the archive root launcher.
    for (const url of routes) {
      const file = url.endsWith('.html') ? path.join(root, url) : path.join(root, url, 'index.html');
      await page.goto(pathToFileURL(file).href);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 242, 236)');
    }
    await page.goto(pathToFileURL(path.resolve(root, '../index.html')).href);
    await page.waitForURL(pathToFileURL(path.join(root, 'index.html')).href);
    assert.equal(await page.locator('body').evaluate(e => getComputedStyle(e).backgroundColor), 'rgb(244, 242, 236)');
    assert(await page.locator('#project-form button').isEnabled());
    assert(await page.locator('.profistal-real-preview img').evaluate(e => e.complete && e.naturalWidth > 0));
    await page.locator('.home-work .project-repo-link').first().click();
    assert.equal(page.url(), pathToFileURL(path.join(root, 'projects/profistal14/index.html')).href);
    await page.locator('.language-link').click();
    assert.equal(page.url(), pathToFileURL(path.join(root, 'en/projects/profistal14/index.html')).href);
    report.localFilePreview = 'PASS: all 19 pages styled; root launcher, image, inline JS, case and language via file://';
    if (process.env.QA_SCREENSHOTS) {
      fs.mkdirSync(process.env.QA_SCREENSHOTS, { recursive: true });
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        for (const [name, url] of [['home-ru', '/'], ['home-en', '/en/']]) {
          await page.goto(origin + url);
          await page.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0); await new Promise(requestAnimationFrame); });
          await page.screenshot({ path: path.join(process.env.QA_SCREENSHOTS, `${name}-${width}.png`), fullPage: true });
          if (url === '/') for (const section of ['services', 'process', 'contact']) {
            await page.locator(`#${section}`).screenshot({ path: path.join(process.env.QA_SCREENSHOTS, `${section}-${width}.png`) });
          }
        }
      }
    }
    if (process.env.QA_SCREENSHOTS) {
      for (const width of [320,390,768,1440]) {
        await page.setViewportSize({width,height:900});
        for(const [name,url] of [['studio-ru','/about/'],['studio-en','/en/about/'],['contact-ru','/contact/'],['contact-en','/en/contact/']]){
          await page.goto(origin+url);
          await page.screenshot({path:path.join(process.env.QA_SCREENSHOTS,`${name}-${width}.png`)});
          if(url.includes('contact'))await page.locator('.contact-form').screenshot({path:path.join(process.env.QA_SCREENSHOTS,`${name}-form-${width}.png`)});
          if(url.includes('about'))for(const section of ['pricing','terms','faq']){
            await page.locator('#'+section).evaluate(e=>e.scrollIntoView({block:'start'}));
            await page.screenshot({path:path.join(process.env.QA_SCREENSHOTS,`${name}-${section}-${width}.png`)});
          }
        }
      }
    }
    // Readability checks for the new content; native device testing remains separate.
    const textScaling=[];
    for(const localeRoot of ['', '/en'])for(const route of ['/about/','/contact/'])for(const scale of [125,200]){
      await page.setViewportSize({width:320,height:900});
      await page.goto(origin+localeRoot+route);
      await page.evaluate(scale=>{document.documentElement.style.fontSize=16*scale/100+'px';document.querySelectorAll('.studio-faq details').forEach(d=>d.open=true);},scale);
      const extra=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
      assert(extra<=1, `${localeRoot}${route} at ${scale}% has overflow ${extra}`);
      textScaling.push({route:localeRoot+route,scale,overflow:extra});
    }
    report.newContentTextScaling=textScaling;
    assert.deepEqual(report.pageErrors, []);
    assert.deepEqual(report.httpErrors, []);
    assert.deepEqual(report.overflows, [], 'Unexpected horizontal page overflow');
    return report;
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
}

module.exports = { run };
if (require.main === module) run().then(r => console.log(JSON.stringify(r, null, 2))).catch(e => { console.error(e); process.exitCode = 1; });
