#!/usr/bin/env python3
"""Render code-authored SVG social cards with actual project screenshots.
Optional authoring dependencies: CairoSVG and Pillow. No browser or website runtime dependency.
The screenshot is embedded in full, without retouching; typography is DejaVu Sans.
"""
from pathlib import Path
from io import BytesIO
from base64 import b64encode
from html import escape
import cairosvg
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
CASES=[
 ('studio',[['Сайты.','Боты.','Автоматизация.'],['Websites.','Bots.','Automation.']],['Telegram и MAX · от задачи к продукту','Telegram and MAX · from task to product'],'profsanteh-plus/catalog-1440.webp'),
 ('profistal14',[['ПрофиСталь 14'],['Profistal14']],['Каталог и галерея изделий','Catalog and product gallery'],'profistal14/catalog-1440.webp'),
 ('profsanteh-plus',[['ПрофСантех+'],['ProfSanteh+']],['Структура каталога и подбор','Catalog structure and selection'],'profsanteh-plus/catalog-1440.webp'),
 ('pekarnya-chudes',[['Пекарня','Чудес'],['Pekarnya','Chudes']],['Telegram-сервис · демоверсия','Telegram service · demonstration'],'pekarnya-chudes/selection-390.webp'),
 ('pravoslavnii-mir',[['Православный','Мир'],['Pravoslavny','Mir']],['Карточка места · в разработке','Place details · in development'],'pravoslavnii-mir/place-1440.webp'),
]
def render():
 output=ROOT/'public/images/social';output.mkdir(parents=True,exist_ok=True)
 for id,titles,subtitles,screen in CASES:
  b=BytesIO();Image.open(ROOT/'public/images/projects'/screen).save(b,format='PNG')
  src='data:image/png;base64,'+b64encode(b.getvalue()).decode()
  for i,locale in enumerate(['ru','en']):
   lines=titles[i];font=52 if id=='studio' else 48
   top=210 if len(lines)>1 else 270
   text=''.join(f'<text x="48" y="{top+j*66}" font-size="{font}" font-weight="500">{escape(line)}</text>' for j,line in enumerate(lines))
   # Keep long subtitle on two explicit lines; no auto-wrapping assumption in SVG.
   sub=subtitles[i]
   split=sub.split(' · ')
   subtitle=''.join(f'<text x="48" y="{top+len(lines)*66+24+j*32}" font-size="21" fill="#565b60">{escape(line)}</text>' for j,line in enumerate(split))
   svg=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#f4f2ec"/><g font-family="DejaVu Sans, sans-serif" fill="#181a1d"><text x="48" y="68" font-size="25">TRW Studio</text><text x="1152" y="68" text-anchor="end" font-size="19" fill="#565b60">trwstudio.art</text><path d="M48 98H1152" stroke="#c9c8c1"/><text x="48" y="145" font-size="14" letter-spacing="1.6" fill="#1648d8">{'СТУДИЯ РАЗРАБОТКИ' if locale=='ru' else 'DEVELOPMENT STUDIO'}</text>{text}{subtitle}<rect x="650" y="130" width="502" height="450" fill="#e7e6e0"/><image x="664" y="144" width="474" height="422" preserveAspectRatio="xMidYMid meet" xlink:href="{src}"/></g></svg>'''
   rendered=cairosvg.svg2png(bytestring=svg.encode())
   Image.open(BytesIO(rendered)).convert('RGB').save(output/f'{id}-{locale}.jpg',quality=90,optimize=True)
 print('Rendered 10 social cards at 1200×630 from SVG and actual screenshots.')
if __name__=='__main__':render()
