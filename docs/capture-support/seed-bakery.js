state.apiTokens={};state.api=async(uid,url,body)=>{
 if(!state.apiTokens[uid]){let r=await fetch('http://127.0.0.1:8088/v1/auth/telegram',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({init_data:signed(uid)})});state.apiTokens[uid]=(await r.json()).session_token;}
 const r=await fetch('http://127.0.0.1:8088'+url,{method:body===undefined?'GET':'POST',headers:{Authorization:'Bearer '+state.apiTokens[uid],'Content-Type':'application/json','X-Idempotency-Key':require('crypto').randomUUID()},body:body===undefined?undefined:JSON.stringify(body)});return {status:r.status,data:await r.json()};};
const results=[];
for(const uid of [88301,88302,88303]){
 await state.api(uid,'/v1/cart/intents',{action:'set',product_id:uid===88301?1:uid===88302?3:9,qty:2});
 const body={pickup_date:'2026-10-17',pickup_start:'02:00',pickup_end:'03:00',comment:'Демонстрационный заказ для портфолио'};
 const pre=await state.api(uid,'/v1/checkout/preview',body);if(!pre.data.preview)throw Error(JSON.stringify(pre));
 const created=await state.api(uid,'/v1/checkout',{...body,review_hash:pre.data.preview.review_hash});if(!created.data.order)throw Error(JSON.stringify(created));
 const id=created.data.order.id;const r=await fetch('http://127.0.0.1:8088/__qa/order/'+id+'/provider-paid',{method:'POST',headers:{'X-Bakery-QA':'RC4_LOCAL_ONLY'}});
 const settled={status:r.status,text:await r.text()};const check=await state.api(uid,'/v1/orders/'+id+'/payment/reconcile',{});
 results.push({id,uid,settled,status:check.data.payment?.order_status});
}
state.orders=results;
return results;
