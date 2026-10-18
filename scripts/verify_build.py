#!/usr/bin/env python3
"""Check actual generated HTML: links, fragments, locales and home-page regressions."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit, urljoin
import posixpath
import re

ROOT = Path(__file__).resolve().parents[1] / 'dist'


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.h1 = 0
        self.lang = None
        self.switch = None
        self.footer = False
        self.footer_home = None
        self.form = None
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.append(a['id'])
        if tag == 'h1':
            self.h1 += 1
        if tag == 'html':
            self.lang = a.get('lang')
        if tag == 'footer':
            self.footer = True
        if tag == 'a':
            if 'language-link' in a.get('class', '').split():
                self.switch = a.get('href')
            if self.footer and self.footer_home is None:
                self.footer_home = a.get('href')
        if tag == 'form' and a.get('id') == 'project-form':
            self.form = a
        for key in ('href', 'src'):
            if key in a:
                self.links.append(a[key])

    def handle_endtag(self, tag):
        if tag == 'footer':
            self.footer = False


def route(file):
    name = file.relative_to(ROOT).as_posix()
    return '/' + (name[:-10] if name.endswith('index.html') else name)


def page_key(url):
    return url[:-10] if url.endswith('index.html') else url


def main():
    pages = {route(p): Page(p.read_text()) for p in ROOT.rglob('*.html')}
    assert pages, 'Build the site first with npm run build'
    errors = []
    count = 0
    for url, page in pages.items():
        en = url.startswith('/en/')
        if page.h1 != 1:
            errors.append(f'{url}: expected one H1, got {page.h1}')
        if page.lang != ('en' if en else 'ru'):
            errors.append(f'{url}: wrong document language')
        duplicates = [key for key, n in Counter(page.ids).items() if n > 1]
        if duplicates:
            errors.append(f'{url}: duplicate IDs {duplicates}')
        expected = url[3:] if en else '/en' + url
        if url == '/404.html':
            expected = '/en/'
        if page_key(urlsplit(urljoin('https://local' + url, page.switch or '')).path) != expected or expected not in pages:
            errors.append(f'{url}: wrong/missing translation {page.switch}, expected {expected}')
        if page_key(urlsplit(urljoin('https://local' + url, page.footer_home or '')).path) != ('/en/' if en else '/'):
            errors.append(f'{url}: footer home leaves its language')
        for link in page.links:
            target = urlsplit(link)
            if target.scheme or target.netloc:
                continue
            path = unquote(target.path)
            dest = path if path.startswith('/') else posixpath.normpath(posixpath.join(posixpath.dirname(url), path))
            if not path:
                dest = url
            candidate = ROOT / dest.lstrip('/')
            exists = dest in pages or candidate.is_file() or (candidate / 'index.html').is_file()
            if not exists:
                errors.append(f'{url}: missing local target {link}')
            elif target.fragment and page_key(dest) in pages and unquote(target.fragment) not in pages[page_key(dest)].ids:
                errors.append(f'{url}: missing fragment {link}')
            count += 1
    for url in ['/', '/en/']:
        form = pages[url].form or {}
        if form.get('data-share-url') != 'https://t.me/share/url':
            errors.append(f'{url}: Telegram share flow changed')
        if form.get('data-site-url') != 'https://trwstudio.art' + url:
            errors.append(f'{url}: wrong form site URL')
        if form.get('data-locale') != ('en' if url == '/en/' else 'ru'):
            errors.append(f'{url}: wrong form language')
        text = (ROOT / url.lstrip('/') / 'index.html').read_text()
        services = re.findall(r'data-service-card="([^"]+)"', text)
        if services != ['web', 'telegram', 'automation', 'support']:
            errors.append(f'{url}: incomplete service directions')
        for section in ['projects', 'services', 'studio', 'process', 'contact']:
            if section not in pages[url].ids:
                errors.append(f'{url}: missing home section {section}')
    for url in ['/', '/en/', '/projects/', '/en/projects/']:
        text = (ROOT / url.lstrip('/') / 'index.html').read_text()
        indices = re.findall(r'<p class="project-case-index"[^>]*>(\d+)', text)
        if indices != ['01', '02', '03', '04']:
            errors.append(f'{url}: project order is not 01, 02, 03, 04')
    for file in ROOT.rglob('*.html'):
        text = file.read_text()
        if re.search(r'(?:href|src|poster|action)="/(?!/)', text):
            errors.append(f'{file}: root-relative path breaks nested/file preview')
    if errors:
        raise SystemExit('\n'.join(errors))
    print(f'PASS: {len(pages)} HTML pages; {count} local links/resources/fragments; '
          'H1, IDs, document languages, translation routes, footer and form settings.')


if __name__ == '__main__':
    main()
