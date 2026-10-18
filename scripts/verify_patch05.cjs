/* Additional Patch 05 interaction checks. Export run(options) for an external Chromium. */
const assert = require('node:assert/strict'),
  fs = require('node:fs'),
  path = require('node:path'),
  http = require('node:http');
const { chromium } = require('playwright'),
  { pathToFileURL } = require('node:url');
async function run(options = {}) {
  const root = path.resolve(__dirname, '../dist'),
    server = http.createServer((req, res) => {
      let uri = decodeURIComponent(new URL(req.url, 'http://local').pathname).replace(
        /^\/nested\//,
        '/',
      );
      let f = path.resolve(root, '.' + uri);
      if (!f.startsWith(root + path.sep) && f !== root) {
        res.writeHead(403).end();
        return;
      }
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
      if (!fs.existsSync(f)) {
        res.writeHead(404).end();
        return;
      }
      const types = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'text/javascript',
        '.webp': 'image/webp',
        '.woff2': 'font/woff2',
        '.svg': 'image/svg+xml',
      };
      res.setHeader('Content-Type', types[path.extname(f)] || 'application/octet-stream');
      res.end(fs.readFileSync(f));
    });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  let browser;
  const report = {
      browser: null,
      fontChecks: [],
      galleries: [],
      forms: [],
      textScaling: [],
      tapTargets: [],
    },
    origin = `http://127.0.0.1:${server.address().port}`;
  const output = process.env.QA_SCREENSHOTS;
  let p;
  try {
    browser = await chromium.launch({ headless: true, ...options });
    report.browser = browser.version();
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: 'reduce',
    });
    p = await ctx.newPage();
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    for (const mode of ['http', 'nested', 'file']) {
      const base =
        mode === 'file'
          ? pathToFileURL(path.join(root, 'index.html')).href
          : origin + (mode === 'nested' ? '/nested/' : '/');
      await p.goto(base);
      const loaded = await p.evaluate(async () => {
        await document.fonts.ready;
        const faces = await document.fonts.load('500 16px "TRW Inter"', 'Сайт Studio ₽');
        return {
          count: faces.length,
          loaded: faces.every((f) => f.status === 'loaded'),
          family: getComputedStyle(document.body).fontFamily,
        };
      });
      assert(
        loaded.count >= 3 && loaded.loaded && loaded.family.includes('TRW Inter'),
        JSON.stringify({ mode, loaded }),
      );
      report.fontChecks.push({ mode, ...loaded });
    }
    // A real mobile image source, title → image → description, and image-to-case navigation.
    for (const locale of ['', '/en']) {
      await p.goto(origin + locale + '/');
      await p.evaluate(async () => {
        void document.body.offsetHeight;
        await document.fonts.ready;
        await new Promise(requestAnimationFrame);
      });
      const card = p.locator('.home-work .project-case').first();
      const title = await card.locator('h2').boundingBox(),
        image = await card.locator('.project-preview').boundingBox(),
        detail = await card.locator('.project-case-detail').boundingBox();
      assert(title.y < image.y && image.y < detail.y, 'mobile card reading order');
      assert((await card.locator('img').evaluate((i) => i.currentSrc)).includes('gallery-390.webp'));
      await card.locator('.project-preview-link').click();
      assert(p.url().includes('/projects/profistal14/'));
    }
    report.mobileCards =
      'PASS: actual mobile capture, heading/media/detail order and clickable preview in RU/EN';
    for (const width of [320, 390])
      for (const locale of ['', '/en'])
        for (const route of ['/', '/projects/']) {
          await p.setViewportSize({ width, height: 844 });
          await p.goto(origin + locale + route);
          await p.evaluate(async () => {
            void document.body.offsetHeight;
            await document.fonts.ready;
            await new Promise(requestAnimationFrame);
          });
          const segments = await p
            .locator('.project-card-title')
            .first()
            .evaluate((e) => {
              const n = e.firstChild,
                word = e.textContent.trim().split(' ')[0],
                range = document.createRange();
              range.setStart(n, 0);
              range.setEnd(n, word.length);
              return range.getClientRects().length;
            });
          assert.equal(
            segments,
            1,
            `${locale}${route} at ${width}: project name splits inside a word`,
          );
        }
    report.mobileHeadings =
      'PASS: project names do not split inside a word on home/projects RU/EN at 320/390 px';
    await p.setViewportSize({ width: 390, height: 844 });
    // Each gallery: real 1:1 pan, fixed background, correct return target after changing slides.
    for (const locale of ['', '/en'])
      for (const slug of ['profistal14', 'pekarnya-chudes', 'profsanteh-plus', 'pravoslavnii-mir']) {
        await p.goto(origin + locale + '/projects/' + slug + '/');
        const first = p.locator('.screen-link').first();
        await first.scrollIntoViewIfNeeded();
        const before = await p.evaluate(() => scrollY);
        await first.click();
        await p.locator('.screen-zoom img').evaluate((i) => i.decode());
        assert.equal(
          await p.evaluate(() => getComputedStyle(document.documentElement).overflow),
          'hidden',
        );
        await p.locator('[data-zoom]').click();
        assert.equal(await p.locator('[data-zoom]').getAttribute('aria-pressed'), 'true');
        const pane = p.locator('.screen-zoom'),
          dimensions = await pane.evaluate((e) => ({
            inner: e.clientWidth,
            scroll: e.scrollWidth,
          }));
        assert(dimensions.scroll > dimensions.inner, '1:1 image must be pannable');
        await pane.evaluate((e) => (e.scrollLeft = 60));
        assert(await pane.evaluate((e) => e.scrollLeft > 0));
        // Native modal focus must remain within the dialog.
        for (let i = 0; i < 10; i++) {
          await p.keyboard.press('Tab');
          assert(
            await p.evaluate(() =>
              document.querySelector('dialog').contains(document.activeElement),
            ),
          );
        }
        await p.locator('[data-zoom]').click();
        assert.equal(await p.locator('[data-zoom]').getAttribute('aria-pressed'), 'false');
        await p.locator('[data-next]').click();
        await p.locator('.screen-zoom img').evaluate((i) => i.decode());
        await p.keyboard.press('Escape');
        await p.waitForFunction(() => !document.documentElement.classList.contains('gallery-open'));
        assert(await first.evaluate((e) => e === document.activeElement));
        assert.notEqual(
          await p.evaluate(() => getComputedStyle(document.documentElement).overflow),
          'hidden',
        );
        const after = await p.evaluate(() => scrollY);
        assert(Math.abs(after - before) <= 2, `close jumped ${after - before}`);
        report.galleries.push({
          route: locale + '/projects/' + slug + '/',
          pan: true,
          focusTrap: true,
          returnToOpener: true,
          backgroundLocked: true,
        });
      }
    // Touch-enabled mobile emulation: real taps and a native overflow-pan gesture.
    const touchContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        reducedMotion: 'reduce',
      }),
      touchPage = await touchContext.newPage();
    await touchPage.goto(origin + '/');
    assert(await touchPage.evaluate(() => navigator.maxTouchPoints > 0));
    await touchPage.locator('.nav-toggle').tap();
    await touchPage.locator('#site-navigation a').filter({ hasText: 'Проекты' }).first().tap();
    await touchPage.locator('.project-preview-link').first().tap();
    await touchPage.locator('.screen-link').first().tap();
    await touchPage.locator('.screen-zoom img').evaluate((i) => i.decode());
    await touchPage.locator('[data-zoom]').tap();
    const bounds = await touchPage.locator('.screen-zoom').boundingBox(),
      cdp = await touchContext.newCDPSession(touchPage);
    const x = bounds.x + bounds.width - 45,
      y = bounds.y + Math.min(bounds.height / 2, 100);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 6; i++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x: x - i * 18, y }],
      });
      await touchPage.waitForTimeout(20);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await touchPage.waitForFunction(
      () => document.querySelector('.screen-zoom').scrollLeft > 20,
      {},
      { timeout: 3000 },
    );
    await touchPage.locator('[data-close]').tap();
    await touchPage.goto(origin + '/about/');
    await touchPage.locator('.studio-faq summary').first().tap();
    assert((await touchPage.locator('.studio-faq details').first().getAttribute('open')) === '');
    report.touchEmulation =
      'PASS: touch context, menu/card/gallery taps, native horizontal pan, close and FAQ; not physical Android';
    // Portrait → landscape: controls stay reachable and the image owns the scroll.
    await p.goto(origin + '/projects/profistal14/');
    await p.locator('.screen-link').first().click();
    await p.setViewportSize({ width: 844, height: 390 });
    for (const control of await p.locator('.screen-toolbar :is(a,button)').all()) {
      const b = await control.boundingBox();
      assert(b && b.y >= 0 && b.y + b.height <= 390 && b.x >= 0 && b.x + b.width <= 844);
    }
    await p.locator('[data-close]').click();
    report.landscape = 'PASS: 844×390 dialog controls reachable';
    await p.setViewportSize({ width: 390, height: 844 });
    // Short viewport simulates reduced visible area, not an actual Android IME.
    for (const locale of ['', '/en'])
      for (const route of ['/', '/contact/']) {
        await p.goto(origin + locale + route);
        await p.evaluate(() => {
          window.__opened = [];
          window.open = (...a) => {
            window.__opened.push(a);
            return null;
          };
        });
        for (const name of ['name', 'reply', 'message'])
          await p.locator(`[name=${name}]`).fill('   ');
        await p.locator('#project-form button').click();
        assert.equal(await p.evaluate(() => window.__opened.length), 0);
        assert(await p.locator('[name=name]').evaluate((e) => !e.validity.valid));
        await p.locator('[name=name]').fill('Проверка');
        await p.locator('[name=reply]').fill('@preview');
        await p.locator('[name=message]').fill('Длинный текст & новая строка\n'.repeat(30));
        await p.setViewportSize({ width: 390, height: 420 });
        await p.locator('[name=message]').focus();
        const submit = p.locator('#project-form button');
        await submit.scrollIntoViewIfNeeded();
        const b = await submit.boundingBox();
        assert(b.y >= 0 && b.y + b.height <= 421);
        assert((await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 1);
        await submit.click();
        assert.equal(await p.evaluate(() => window.__opened.length), 1);
        const share = new URL((await p.evaluate(() => window.__opened[0]))[0]);
        assert.equal(share.origin + share.pathname, 'https://t.me/share/url');
        assert(share.searchParams.get('text').includes('Длинный текст & новая строка'));
        await p.setViewportSize({ width: 390, height: 844 });
        report.forms.push({
          route: locale + route,
          spacesRejected: true,
          shortViewport: true,
          shareIntercepted: true,
        });
      }
    // Every final page at 200% text on the smallest supported width.
    const pages = [];
    function walk(dir) {
      for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const f = path.join(dir, item.name);
        if (item.isDirectory()) walk(f);
        else if (f.endsWith('.html')) pages.push(f);
      }
    }
    walk(root);
    for (const f of pages) {
      const relative = path.relative(root, f).replaceAll(path.sep, '/');
      await p.setViewportSize({ width: 320, height: 900 });
      await p.goto(origin + '/' + relative);
      await p.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
        document.querySelectorAll('details').forEach((d) => (d.open = true));
      });
      await p.evaluate(async () => {
        void document.body.offsetHeight;
        await document.fonts.ready;
        await new Promise(requestAnimationFrame);
      });
      const extra = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (extra > 1) {
        const offenders = await p.evaluate(() =>
          [...document.querySelectorAll('main *,header *,footer *')]
            .filter((e) => e.getBoundingClientRect().right > innerWidth + 1)
            .slice(-8)
            .map((e) => ({
              tag: e.tagName,
              class: e.className,
              right: e.getBoundingClientRect().right,
            })),
        );
        throw Error(JSON.stringify({ relative, extra, offenders }));
      }
      const collision = await p.evaluate(() => {
        const a = document.querySelector('.site-wordmark').getBoundingClientRect(),
          b = document.querySelector('.nav-toggle').getBoundingClientRect();
        const mark = document.querySelector('.site-wordmark');
        return (
          mark.scrollWidth > mark.clientWidth + 1 ||
          (b.width > 0 && Math.abs(a.y - b.y) < 20 && a.right > b.left - 4)
        );
      });
      assert(!collision, `${relative}: header controls collide at 200%`);
      report.textScaling.push({ page: relative, percent: 200, overflow: Math.max(0, extra) });
    }
    // An open mobile menu must remain readable when text is doubled.
    for (const locale of ['', '/en']) {
      await p.setViewportSize({ width: 320, height: 844 });
      await p.goto(origin + locale + '/about/');
      await p.evaluate(() => (document.documentElement.style.fontSize = '200%'));
      await p.evaluate(async () => {
        void document.body.offsetHeight;
        await document.fonts.ready;
        await new Promise(requestAnimationFrame);
      });
      await p.locator('.nav-toggle').click();
      const clipped = await p
        .locator('.site-nav>a')
        .evaluateAll((items) =>
          items.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent.trim()),
        );
      assert.deepEqual(clipped, [], `menu text clips at 200% ${locale}`);
      assert((await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 1);
    }
    report.menuTextScale = 'PASS: RU/EN open menus at 320 px and 200% text';
    // Compact toolbar typography must survive the shared action cascade, including text scaling.
    const gallerySizes = [];
    for (const size of [
      { width: 320, height: 568 },
      { width: 568, height: 320 },
      { width: 390, height: 420 },
    ]) {
      for (const scale of [100, 200])
        for (const locale of ['', '/en']) {
          await p.setViewportSize(size);
          await p.goto(origin + locale + '/projects/profistal14/');
          await p.evaluate((s) => (document.documentElement.style.fontSize = s + '%'), scale);
          await p.evaluate(async () => {
            void document.body.offsetHeight;
            await document.fonts.ready;
            await new Promise(requestAnimationFrame);
          });
          await p.locator('.screen-link').first().click();
          await p.locator('.screen-zoom img').evaluate((i) => i.decode());
          const dimensions = await p.locator('.screen-dialog').evaluate((d) => {
            const bounds = d.getBoundingClientRect(),
              view = d.querySelector('.screen-zoom').getBoundingClientRect();
            const controls = [
              ...d.querySelectorAll('.screen-toolbar button,.screen-toolbar a'),
            ].map((e) => {
              const r = e.getBoundingClientRect();
              return {
                font: parseFloat(getComputedStyle(e).fontSize),
                width: r.width,
                height: r.height,
                inside:
                  r.left >= bounds.left &&
                  r.right <= bounds.right &&
                  r.top >= bounds.top &&
                  r.bottom <= bounds.bottom,
              };
            });
            return {
              controls,
              viewHeight: view.height,
              inside:
                bounds.top >= 0 &&
                bounds.bottom <= innerHeight &&
                bounds.left >= 0 &&
                bounds.right <= innerWidth,
            };
          });
          assert(
            dimensions.inside && dimensions.viewHeight >= 80,
            JSON.stringify({ size, scale, locale, dimensions }),
          );
          for (const control of dimensions.controls) {
            assert(control.inside && control.width >= 43 && control.height >= 43);
            assert(
              Math.abs(control.font - ((16 * scale) / 100) * 0.85) < 0.1,
              'gallery toolbar font overridden',
            );
          }
          gallerySizes.push({ size, scale, locale, status: 'PASS' });
        }
    }
    report.compactGalleries = gallerySizes;
    // A failed image needs a visible error and an original link, then a recoverable next slide.
    await p.setViewportSize({ width: 390, height: 844 });
    await p.route('**/profistal14/gallery-1440.webp', (route) => route.abort());
    await p.goto(origin + '/projects/profistal14/');
    await p.locator('.screen-link').first().click();
    await p.waitForFunction(() =>
      document.querySelector('[data-screen-status]').textContent.includes('Не удалось'),
    );
    assert(
      await p
        .locator('[data-original]')
        .getAttribute('href')
        .then((v) => v.endsWith('gallery-1440.webp')),
    );
    await p.unroute('**/profistal14/gallery-1440.webp');
    await p.locator('[data-next]').click();
    await p.locator('.screen-zoom img').evaluate((i) => i.decode());
    await p.waitForFunction(
      () => document.querySelector('[data-screen-status]').textContent === '',
    );
    await p.locator('[data-close]').click();
    report.imageFailure = 'PASS: explicit load error, original link and recovery on next screen';
    // Main standalone actions at mobile widths (inline prose links intentionally excluded).
    await p.setViewportSize({ width: 390, height: 844 });
    for (const route of [
      '/',
      '/about/',
      '/contact/',
      '/blog/redmi-13c-home-server/',
      '/projects/profistal14/',
    ]) {
      await p.goto(origin + route);
      await p.locator('.nav-toggle').click();
      const small = await p
        .locator('.studio-action,.nav-toggle,.site-nav>a,.site-footer a,.post-meta a')
        .evaluateAll((items) =>
          items
            .filter((e) => e.getClientRects().length)
            .map((e) => ({
              text: e.textContent.trim(),
              height: e.getBoundingClientRect().height,
              width: e.getBoundingClientRect().width,
            }))
            .filter((x) => x.height < 43 || x.width < 43),
        );
      assert.deepEqual(small, [], JSON.stringify({ route, small }));
      report.tapTargets.push({ route, status: 'PASS' });
    }
    // Skip link and code blocks use the browser's own focus/scroll behaviour.
    await p.goto(origin + '/blog/redmi-13c-home-server/');
    await p.keyboard.press('Tab');
    assert(await p.locator('.skip-link').evaluate((e) => e === document.activeElement));
    await p.keyboard.press('Enter');
    assert(await p.locator('main').evaluate((e) => e === document.activeElement));
    const blocks = p.locator('pre');
    assert((await blocks.count()) > 0);
    for (const block of await blocks.all()) {
      assert.equal(await block.getAttribute('tabindex'), '0');
      assert.equal(await block.evaluate((e) => getComputedStyle(e).overflowX), 'auto');
    }
    const scroller = blocks.first();
    await scroller.focus();
    assert(await scroller.evaluate((e) => e === document.activeElement));
    report.article =
      'PASS: skip to content, native focusable/scrollable code, long content contained';
    // Mobile menu must close if keyboard focus leaves the header.
    await p.goto(origin + '/');
    await p.locator('.nav-toggle').click();
    await p.locator('#project-name').focus();
    await p.waitForFunction(
      () => !document.querySelector('.site-header').hasAttribute('data-menu-open'),
    );
    report.menuFocus = 'PASS';
    // Nested and local galleries retain inline JS and actual-size image sources.
    for (const url of [
      origin + '/nested/projects/profistal14/index.html',
      pathToFileURL(path.join(root, 'projects/profistal14/index.html')).href,
    ]) {
      await p.goto(url);
      await p.locator('.screen-link').first().click();
      await p.locator('.screen-zoom img').evaluate((i) => i.decode());
      await p.locator('[data-zoom]').click();
      assert(await p.locator('.screen-zoom').evaluate((e) => e.scrollWidth > e.clientWidth));
      await p.locator('[data-close]').click();
    }
    report.portableGallery = 'PASS: nested HTTP and file:// including actual-size mode';
    assert.deepEqual(errors, []);
    report.pageErrors = errors;
    if (output) {
      fs.mkdirSync(output, { recursive: true });
      for (const [name, route] of [
        ['card', '/'],
        ['case', '/projects/profistal14/'],
        ['bakery', '/projects/pekarnya-chudes/'],
        ['studio', '/about/'],
        ['contact', '/contact/'],
      ])
        for (const width of [390, 1440]) {
          await p.setViewportSize({ width, height: 900 });
          await p.goto(origin + route);
          if (name === 'card')
            await p.locator('.home-work').evaluate((e) => e.scrollIntoView({ block: 'start' }));
          await p.locator('img').evaluateAll((items) =>
            Promise.all(
              items
                .filter((i) => {
                  const r = i.getBoundingClientRect();
                  return r.top < innerHeight && r.bottom > 0;
                })
                .map((i) => i.decode().catch(() => {})),
            ),
          );
          await p.screenshot({ path: path.join(output, `polish-${name}-${width}.png`) });
        }
      await p.setViewportSize({ width: 390, height: 844 });
      await p.goto(origin + '/projects/profistal14/');
      await p.locator('.screen-link').first().click();
      await p.locator('.screen-zoom img').evaluate((i) => i.decode());
      await p.screenshot({ path: path.join(output, 'gallery-fit.png') });
      await p.locator('[data-zoom]').click();
      await p.screenshot({ path: path.join(output, 'gallery-actual.png') });
    }
    return report;
  } finally {
    if (browser) await browser.close();
    await new Promise((r) => server.close(r));
  }
}
module.exports = { run };
