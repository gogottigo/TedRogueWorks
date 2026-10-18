const results=[];
for(const item of state.orders){
 const payment=await state.api(item.uid,'/v1/orders/'+item.id+'/payment',{method:'crypto'});
 const r=await fetch('http://127.0.0.1:8088/__qa/order/'+item.id+'/provider-paid',{method:'POST',headers:{'X-Bakery-QA':'RC4_LOCAL_ONLY'}});
 const settled={status:r.status,text:await r.text()};const check=await state.api(item.uid,'/v1/orders/'+item.id+'/payment/reconcile',{});
 results.push({...item,payment,settled,status:check.data.payment?.order_status});
}
state.orders=results;
return results;
