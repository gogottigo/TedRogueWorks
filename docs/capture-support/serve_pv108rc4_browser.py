"""RC4 full main/API local QA ONLY: temporary SQLite, synthetic Telegram identity/payment provider.

This is not the phone launcher and not a merchant/Telegram E2E test.
Runs real main.main() and its payment/notification watchers; polling and external
Telegram/provider transports are synthetic. Run with requirements-dev installed. The browser runner signs QA initData for the
explicit dummy token below. No existing .env, token or database is used.
"""
import os
import sys
import tempfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
fixture=tempfile.TemporaryDirectory(prefix='bakery-rc3-browser-')
os.environ.update(BOT_TOKEN='123456:RC3_BROWSER_ONLY',CRYPTOBOT_TOKEN='BROWSER_FAKE',ADMIN_ID='1',PICKUP_ADDRESS='Санкт-Петербург, тестовый адрес',DATABASE_PATH=str(Path(fixture.name)/'browser_fixture.db'),TIMEZONE='Europe/Moscow')
from aiohttp import web
from api.core import ApiCore
from api.media import BundledProductMediaProvider
from api.transport_aiohttp import create_app
from services.payment_provider import CryptoBotPaymentProvider
from services.demo_catalog import seed_demo_catalog
from services.demo_media import seed_demo_media

class BrowserCrypto:
    def __init__(self):self.invoices=[]
    async def close(self): pass
    async def get_me(self):return {'name':'Browser QA'}
    async def create_rub_btc_invoice(self,amount_rub,description,payload,expires_in):
        item={'invoice_id':900+len(self.invoices),'status':'active','currency_type':'fiat','fiat':'RUB','amount':f'{amount_rub:.2f}','accepted_assets':'BTC','payload':payload,'bot_invoice_url':'https://t.me/CryptoBot?start=browser_fake'}
        self.invoices.append(item);return dict(item)
    async def get_invoice(self,invoice_id):return next((dict(i) for i in self.invoices if str(i['invoice_id'])==str(invoice_id)),None)
    async def get_invoices(self,status=None,count=100):return [dict(i) for i in self.invoices if status is None or i['status']==status][:count]
    async def delete_invoice(self,invoice_id):
        for i in self.invoices:
            if str(i['invoice_id'])==str(invoice_id):i['status']='expired'
        return True

seed_demo_catalog();seed_demo_media()
crypto=BrowserCrypto()
core=ApiCore(bot_token=os.environ['BOT_TOKEN'],payment_provider=CryptoBotPaymentProvider(crypto))
core.bot_username='BakeryBrowserQABot'
app=create_app(core,media_provider=BundledProductMediaProvider())

# Only this localhost dummy-token fixture exposes provider controls. Production
# create_app/API has no QA routes. No order/payment table is edited by controls.
import asyncio
from contextlib import suppress
from decimal import Decimal
from datetime import datetime, timezone
import db
from services import admins
for uid,role in [(8002,admins.ADMIN),(8003,admins.MANAGER),(8004,admins.BAKER),(8005,admins.SELLER)]:
    db.upsert_user(uid,name='QA '+role)
    admins.set_admin_role(uid,role,actor_id=1,event_key='rc4-role-'+str(uid))

# Populate staff domains through their normal services, not direct order status edits.
from services import staff_workspace, discovery, promotions
from datetime import timedelta
from zoneinfo import ZoneInfo
from config import TIMEZONE
pid=db.list_all_products()[0]['id']
day=datetime.now(ZoneInfo(TIMEZONE)).date().isoformat()
staff_workspace.perform(1,'production.create_actual',{'pickup_date':day,'quantities':{str(pid):3},'reason':'RC4 QA plan'},event_key='rc4-qa-batch')
campaign=staff_workspace.perform(1,'future.create',{'slug':'rc4-qa','name':'Праздничный предзаказ QA','description':'Контролируемая проверка ролей','fulfillment_mode':'holiday','status':'draft','ordering_opens_at':None,'ordering_closes_at':None,'lead_time_minutes':60,'cancel_before_minutes':60},event_key='rc4-qa-campaign')['campaign_id']
staff_workspace.perform(1,'future.product',{'campaign_id':campaign,'product_id':pid,'max_qty_per_order':5,'price_rub_override':None,'sort_order':0},event_key='rc4-qa-future-product')
staff_workspace.perform(1,'future.window',{'campaign_id':campaign,'pickup_date':(datetime.now(ZoneInfo(TIMEZONE)).date()+timedelta(days=2)).isoformat(),'start_time':'10:00','end_time':'11:00','capacity_orders':10,'capacity_units':20,'cancellable_until':None},event_key='rc4-qa-future-window')
discovery.create_bundle('Набор QA',{pid:1})
promotions.create_promotion('RC4QA','percent',10)

runtime={}
async def full_runtime(app):
    import main
    from aiogram import Bot
    from test_f1_13_r4_android_regressions import RecordingSession
    session=RecordingSession()
    real_build=main.build_dispatcher
    def build(**kwargs):
        dp=real_build(**kwargs)
        async def polling(bot,**workflow):
            runtime.update(bot=bot,dp=dp,workflow=workflow,session=session)
            try:await asyncio.Event().wait()
            finally:await dp.storage.close()
        dp.start_polling=polling
        return dp
    main.build_dispatcher=build
    main.Bot=lambda *args,**kwargs:Bot(*args,session=session,**kwargs)
    main.CryptoPay=lambda token:crypto
    main.YOOKASSA_ENABLED=False
    task=asyncio.create_task(main.main())
    try:
        for _ in range(200):
            if 'dp' in runtime:break
            if task.done():await task
            await asyncio.sleep(.01)
        else:raise RuntimeError('full main runtime not ready')
        yield
    finally:
        task.cancel()
        with suppress(asyncio.CancelledError):await task
app.cleanup_ctx.append(full_runtime)

def guard(request):
    if request.remote not in {'127.0.0.1','::1'} or request.headers.get('X-Bakery-QA')!='RC4_LOCAL_ONLY':
        raise web.HTTPForbidden()

async def settle(request):
    guard(request)
    order=db.get_order(int(request.match_info['id']))
    with db.connect() as conn:
        attempt=conn.execute('SELECT provider_payment_id FROM payment_attempts WHERE order_id=? ORDER BY id DESC LIMIT 1',(int(request.match_info['id']),)).fetchone()
    invoice=next((i for i in crypto.invoices if attempt and str(i['invoice_id'])==str(attempt['provider_payment_id'])),None)
    if invoice is None:raise web.HTTPNotFound()
    invoice.update(status='paid',paid_asset='BTC',paid_amount=str(Decimal(invoice['amount'])/Decimal('1000000')),paid_fiat_rate='1000000',paid_at=datetime.now(timezone.utc).isoformat())
    return web.json_response({'ok':True})

async def observe(request):
    guard(request)
    from services.notifications import dispatch_due_notifications,notification_summary
    first=await dispatch_due_notifications(runtime['bot'],limit=1000)
    again=await dispatch_due_notifications(runtime['bot'],limit=1000)
    with db.connect() as conn:
        events=[dict(r) for r in conn.execute('SELECT event_type,recipient_id,status,order_id FROM notification_events ORDER BY id')]
    return web.json_response({'ok':True,'watchers':sorted(t.get_coro().__name__ for t in asyncio.all_tasks() if t.get_coro().__name__ in {'payment_watcher','notification_watcher'}),'notifications':notification_summary(),'events':events,'first':first,'again':again,'invoices':len(crypto.invoices)})

async def native(request):
    guard(request)
    from aiogram.types import Update,Message,Chat,User
    body=await request.json();uid=int(body['user_id']);before=len(runtime['session'].calls)
    update=Update(update_id=900000+before,message=Message(message_id=before+1,date=datetime.now(timezone.utc),chat=Chat(id=uid,type='private'),from_user=User(id=uid,is_bot=False,first_name='QA'),text=body['text']))
    await runtime['dp'].feed_update(runtime['bot'],update,**runtime['workflow'])
    return web.json_response({'ok':True,'calls':[{'method':m.__api_method__,'text':getattr(m,'text',None),'rich':bool(getattr(m,'rich_message',None))} for m in runtime['session'].calls[before:]]})

async def revoke(request):
    guard(request)
    admins.set_admin_active(int(request.match_info['id']),False,actor_id=1,event_key='rc4-revoke-'+request.match_info['id'])
    return web.json_response({'ok':True})

app.router.add_post('/__qa/order/{id}/provider-paid',settle)
app.router.add_get('/__qa/runtime',observe)
app.router.add_post('/__qa/native',native)
app.router.add_post('/__qa/revoke/{id}',revoke)
try:web.run_app(app,host='127.0.0.1',port=int(os.environ.get('BROWSER_QA_PORT','8087')),access_log=None)
finally:fixture.cleanup()
