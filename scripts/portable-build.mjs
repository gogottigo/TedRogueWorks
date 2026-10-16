/** Make the one production build portable to an arbitrary SPCK preview directory. */
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
const files = [];
function walk(dir) { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, entry.name); entry.isDirectory() ? walk(file) : files.push(file); } }
walk(root);
function localReference(value, file) {
  if (!value.startsWith('/') || value.startsWith('//')) return value;
  const [, raw, suffix = ''] = value.match(/^([^?#]*)(.*)$/);
  let target = path.resolve(root, '.' + decodeURIComponent(raw));
  if (target !== root && !target.startsWith(root + path.sep)) throw new Error(`Unsafe local path: ${value}`);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) throw new Error(`Missing build target: ${value} in ${file}`);
  let relative = path.relative(path.dirname(file), target).split(path.sep).join('/');
  if (!relative.startsWith('.')) relative = './' + relative;
  return encodeURI(relative) + suffix;
}
let htmlCount = 0, inlined = 0;
for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.html')) {
    // Small self-contained Astro modules can run on file:// as well as HTTP previews.
    source = source.replace(/<script\b([^>]*)>\s*<\/script>/gi, (whole, attrs) => {
      const src = attrs.match(/\bsrc="([^"]+)"/);
      if (!src || !/\btype="module"/.test(attrs) || !src[1].startsWith('/')) return whole;
      const asset = path.resolve(root, '.' + src[1]);
      if (!asset.startsWith(root + path.sep) || !fs.existsSync(asset)) return whole;
      const code = fs.readFileSync(asset, 'utf8');
      // Keep modules with dependencies external; their references are rebased below.
      if (/\b(?:import|export)\s*(?:[({*]|["'])/.test(code)) return whole;
      inlined++;
      return `<script${attrs.replace(/\s*src="[^"]+"/, '')}>${code.replace(/<\/script/gi, '<\\/script')}</script>`;
    });
    source = source.replace(/\b(href|src|poster|action)="([^"]*)"/g, (_, key, value) => `${key}="${localReference(value, file)}"`);
    source = source.replace(/\bsrcset="([^"]*)"/g, (_, value) => `srcset="${value.split(',').map(item => { const [url, ...descriptor] = item.trim().split(/\s+/); return [localReference(url, file), ...descriptor].join(' '); }).join(', ')}"`);
    htmlCount++;
  } else if (file.endsWith('.css')) {
    source = source.replace(/url\((['"]?)(\/[^)'"\s]+)\1\)/g, (_, quote, value) => `url(${quote}${localReference(value, file)}${quote})`);
    source = source.replace(/(@import\s+['"])(\/[^'"]+)(['"])/g, (_, before, value, after) => before + localReference(value, file) + after);
  } else if (file.endsWith('.js')) {
    source = source.replace(/(\b(?:from|import)\s*['"])(\/[^'"]+)(['"])/g, (_, before, value, after) => before + localReference(value, file) + after);
    source = source.replace(/(\bimport\s*\(\s*['"])(\/[^'"]+)(['"]\s*\))/g, (_, before, value, after) => before + localReference(value, file) + after);
  } else continue;
  fs.writeFileSync(file, source);
}
console.log(`Portable build: ${htmlCount} HTML pages; ${inlined} self-contained modules inlined; production canonical URLs retained.`);
