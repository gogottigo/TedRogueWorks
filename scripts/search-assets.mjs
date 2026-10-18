/** Build sitemap/robots from real emitted routes, excluding the error document. */
import fs from 'node:fs';
import path from 'node:path';
import {siteConfig} from '../site.config.mjs';
const root=path.resolve('dist'),pages=[];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(e.name==='index.html'){const relative=path.relative(root,path.dirname(file)).split(path.sep).join('/');pages.push(new URL(relative?`/${relative}/`:'/',siteConfig.url).href);}}}
walk(root);
fs.writeFileSync(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.sort().map(url=>`  <url><loc>${url}</loc></url>`).join('\n')+'\n</urlset>\n');
fs.writeFileSync(path.join(root,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml',siteConfig.url).href}\n`);
console.log(`Search assets: ${pages.length} canonical routes, error page excluded.`);
