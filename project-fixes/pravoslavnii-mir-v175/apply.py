"""Apply the exact visual source overlay used for portfolio screenshots, to a v1.75 copy."""
from pathlib import Path
import sys,hashlib,json,os,shutil

here=Path(__file__).resolve().parent
root=Path(sys.argv[1]).resolve()
assert (root/'VERSION').read_text().strip() in {'1.75','v1.75'}, 'Expected Pravoslavnii Mir v1.75'
baseline=json.loads((here/'baseline-html.json').read_text())
updates={}
for rel,expected in baseline.items():
 p=root/rel
 original=p.read_text()
 href=os.path.relpath(root/'css/portfolio-visual.css',p.parent).replace(os.sep,'/')
 link=f'<link rel="stylesheet" href="{href}">\n'
 if link in original:
  original=original.replace(link,'')
 assert hashlib.sha256(original.encode()).hexdigest()==expected, f'Unknown HTML changes: {rel}'
 if '</head>' in original:updates[p]=original.replace('</head>',link+'</head>')
for p,t in updates.items():p.write_text(t)
for source in (here/'overlay').rglob('*'):
 if source.is_file():
  dest=root/source.relative_to(here/'overlay');dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,dest)
manifest=root/'FILE_SHA256SUMS.txt'
manifest.write_text(''.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.relative_to(root).as_posix()+'\n' for p in sorted(root.rglob('*')) if p.is_file() and p!=manifest and '__pycache__' not in p.parts and not any(part.startswith('.') for part in p.relative_to(root).parts)))
print(f'Applied visual overlay: {len(updates)} HTML pages, local CSS/fonts; checksums updated.')
