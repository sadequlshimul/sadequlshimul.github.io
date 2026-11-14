/* ===== payment.js: পেমেন্ট বক্স, কাউন্টডাউন, প্রমাণ জমা, আমার আইডি ===== */
(function(){
var st=document.createElement('style');
st.textContent=''
+'.pay{background:var(--soft);border-radius:14px;padding:14px;margin-top:14px;text-align:left}.pay.ok{color:#176b3a;font-weight:700}.pay h3{margin:0 0 8px;font-size:17px}'
+'.pamt{margin-bottom:8px}.pamt b{font-size:20px;color:var(--p)}'
+'.pref{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:var(--card);border:2px dashed var(--p);border-radius:12px;padding:10px 12px}.pref span{flex:1 1 100%;font-size:12px;color:var(--mute)}.pref b{flex:1;font-size:21px;letter-spacing:1px}.pref button{padding:6px 14px;font-size:13px}'
+'.pwarn{background:#fff3cd;color:#664d03;border-radius:10px;padding:10px 12px;margin:10px 0;font-size:14px;line-height:1.6}'
+'.prow2{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 0;border-top:1px solid var(--line)}.prow2 span{color:var(--mute)}.prow2 b{text-align:right}.prow2 button{padding:3px 10px;font-size:12px;margin-left:8px}';
st.textContent+='.pay.exp{background:#fdecea;color:#8b1a1a}.pay.v{background:#e8f4ff}.pcd{font-size:15px;text-align:center;background:var(--card);border-radius:12px;padding:8px;margin-bottom:10px}.pcd b{font-size:24px;color:var(--p);margin:0 4px}.pcd.low b{color:#c92a2a}'
+'.pf{margin-top:12px;border-top:1px dashed var(--line);padding-top:12px}.pfile{display:block;text-align:center;background:var(--card);border:2px dashed var(--p);border-radius:12px;padding:12px;font-weight:600;cursor:pointer;margin:8px 0}.pfile input{display:none}.pf .t{margin-top:8px}'
+'#pfv{position:fixed;inset:0;z-index:99;background:rgba(0,0,0,.85);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:10px;padding:16px;color:#fff;overflow:auto}#pfv img{max-width:100%;border-radius:10px}';;document.head.appendChild(st);
var _rpc=SB.rpc;
/* ---- পেমেন্ট প্যানেল ---- */
window.cpTxt=function(el,t){try{navigator.clipboard.writeText(t);el.textContent='কপি ✓'}catch(e){el.textContent=t}};
function mm(s){s=Math.max(0,Math.floor(s));return pad2(Math.floor(s/60))+':'+pad2(s%60)}
function shrink(f){return new Promise(function(res,rej){var im=new Image(),u=URL.createObjectURL(f);im.onload=function(){
  var s=Math.min(1,2400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
  var q=.88;(function t(){c.toBlob(function(b){if(!b)return rej();if(b.size>900000&&q>.5){q-=.1;t()}else res(b)},'image/jpeg',q)})()};im.onerror=rej;im.src=u})}
async function upload(path,blob){
  var h={apikey:SUPABASE_KEY,'Content-Type':'image/jpeg'};
  if(SUPABASE_KEY.indexOf('sb_')!==0)h.Authorization='Bearer '+SUPABASE_KEY;
  try{var r=await fetch(SUPABASE_URL+'/storage/v1/object/proofs/'+path,{method:'POST',headers:h,body:blob});
    if(!r.ok){var j={};try{j=await r.json()}catch(e){}return{error:j.message||('http '+r.status)}}return{}}catch(e){return{error:'network'}}
}
window.refreshPay=function(bn){
  rp('pay_info',{p_no:bn}).then(function(q){if(q.error||!q.data)return;q.data.bn=bn;
    Array.prototype.forEach.call(document.querySelectorAll('.pay[data-bn="'+bn+'"]'),function(el){el.outerHTML=payHtml(q.data)});
    if(q.data.st){
      if($('okCard')&&!$('okCard').classList.contains('hide')&&lastT&&document.querySelector('#okCard .pay[data-bn="'+bn+'"]')){lastT.st=q.data.st;showTicket(lastT,'tkImg','shBtn')}
      else if(!$('my').classList.contains('hide')&&typeof lookupMy==='function')lookupMy(true)}})
};
window.pfPick=function(inp){var n=inp.parentNode.nextElementSibling;if(n)n.textContent=inp.files[0]?'✓ '+inp.files[0].name:''};
window.submitProof=async function(bn,btn){
  var f=$('pf_'+bn).files[0],trx=$('pt_'+bn).value.trim(),m=$('pm_'+bn);m.textContent='';
  if(trx.length<6){m.textContent='ব্যাংক থেকে পাওয়া ট্রানজেকশন নম্বর লিখুন (কমপক্ষে ৬ অক্ষর)।';return}
  btn.disabled=true;btn.textContent='জমা হচ্ছে…';var path='';
  if(f){try{var blob=await shrink(f);path=bn+'/'+Date.now()+'.jpg';var u=await upload(path,blob);
      if(u.error){m.textContent='ছবি আপলোড হয়নি ('+u.error+'), আবার চেষ্টা করুন।';btn.disabled=false;btn.textContent='প্রমাণ জমা দিন';return}}
    catch(e){m.textContent='ছবিটা পড়া যায়নি, অন্য ছবি দিন।';btn.disabled=false;btn.textContent='প্রমাণ জমা দিন';return}}
  var r=await rp('submit_proof',{p_no:bn,p_trx:trx,p_path:path});
  if(r.error){m.textContent=/expired|cancelled/.test(r.error.message)?'দুঃখিত, সময় শেষ, বুকিং বাতিল হয়েছে।':'সমস্যা হয়েছে, আবার চেষ্টা করুন।';btn.disabled=false;btn.textContent='প্রমাণ জমা দিন';if(/expired|cancelled/.test(r.error.message)){refreshPay(bn);loadCourses(false)}return}
  refreshPay(bn);
};
setInterval(function(){Array.prototype.forEach.call(document.querySelectorAll('.pcd[data-end]'),function(el){
  var s=Math.round((+el.getAttribute('data-end')-Date.now())/1000);
  if(s>0){el.querySelector('b').textContent=mm(s);el.classList.toggle('low',s<120)}
  else{el.removeAttribute('data-end');var bn=el.getAttribute('data-bn');rp('expire_bookings').then(function(){refreshPay(bn);loadCourses(false)})}})},1000);
window.payHtml=function(p){
  if(!p)return '';
  var bn=esc(p.bn||''),w=function(c,h){return '<div class="pay '+c+'" data-bn="'+bn+'">'+h+'</div>'};
  if(p.paid||p.st==='paid')return w('ok','পেমেন্ট নিশ্চিত হয়েছে।');
  if(p.st==='expired')return w('exp','<b>পেমেন্টের সময় শেষ হয়েছে, বুকিং বাতিল হয়েছে।</b><div class="sub" style="margin-top:6px">আসন ফাঁকা থাকলে আবার বুক করতে পারেন, আপনার আমার আইডি একই থাকবে। টাকা পাঠিয়ে ফেলে থাকলে আমাদের জানান।</div>');
  if(p.st==='cancelled')return '';
  if(p.st==='verifying')return w('v','<b>প্রমাণ জমা হয়েছে, যাচাই চলছে।</b><div class="sub" style="margin-top:6px">আমরা মিলিয়ে দেখে নিশ্চিত করলে এখানে Paid দেখাবে। কোর্স আইডি: <b>'+esc(p.cid||'')+'</b></div>');
  var rs=[['ব্যাংক',p.b,0],['অ্যাকাউন্টের নাম',p.n,0],['অ্যাকাউন্ট নম্বর',p.a,1],['শাখা',p.r,0]].filter(function(x){return x[1]});
  return w('','<h3>পেমেন্ট করুন</h3>'
   +(p.left!=null?'<div class="pcd'+(p.left<120?' low':'')+'" data-bn="'+bn+'" data-end="'+(Date.now()+p.left*1000)+'">বাকি সময় <b>'+mm(p.left)+'</b> মিনিট</div>':'')
   +(p.amt?'<div class="pamt">কোর্স ফি <b>'+esc(lat(p.amt))+'</b></div>':'')
   +'<div class="pref"><span>রেফারেন্স হিসেবে এই কোর্স আইডি দিন</span><b>'+esc(p.cid||'')+'</b><button onclick="cpTxt(this,\''+esc(p.cid||'')+'\')">কপি</button></div>'
   +'<div class="pwarn">ব্যাংকে টাকা পাঠানোর সময় রেফারেন্স বা নোট ঘরে এই <b>কোর্স আইডি</b> অবশ্যই দিতে হবে, আর নিচে ট্রানজেকশন নম্বরও দিতে হবে। নইলে পেমেন্ট নিশ্চিত হবে না।</div>'
   +(rs.length?rs.map(function(x){return '<div class="prow2"><span>'+x[0]+'</span><b>'+esc(x[1])+(x[2]?'<button onclick="cpTxt(this,\''+esc(String(x[1]).replace(/\s/g,''))+'\')">কপি</button>':'')+'</b></div>'}).join(''):'<p class="sub">ব্যাংকের তথ্য শীঘ্রই জানানো হবে।</p>')
   +(p.t?'<p class="sub" style="margin-top:8px">'+esc(p.t)+'</p>':'')
   +(bn?'<div class="pf"><b>টাকা পাঠানোর পর প্রমাণ দিন</b><div class="sub">ব্যাংক থেকে পাওয়া <b>ট্রানজেকশন নম্বর</b> লিখতে হবে (বাধ্যতামূলক)। স্ক্রিনশট দিলে ভালো, তবে বাধ্যতামূলক নয়।'+(p.left!=null?' সময়ের মধ্যে জমা না দিলে বুকিং বাতিল হবে।':'')+'</div>'
     +'<input class="t" id="pt_'+bn+'" placeholder="ট্রানজেকশন নম্বর (বাধ্যতামূলক)" autocomplete="off">'
     +'<label class="pfile">স্ক্রিনশট (ঐচ্ছিক)<input type="file" accept="image/*" id="pf_'+bn+'" onchange="pfPick(this)"></label><div class="sub"></div>'
     +'<button class="w" onclick="submitProof(\''+bn+'\',this)">প্রমাণ জমা দিন</button><div class="msg" id="pm_'+bn+'"></div></div>':'')
   +'<p class="sub" style="font-size:12px;margin-top:8px">আমার আইডি স্থায়ী, সেটা দিয়ে "আমার ব্যাচ" দেখা যাবে। পেমেন্টের জন্য শুধু কোর্স আইডি লাগবে।</p>');
};
var im=$('tkImg');if(im&&!$('okPay')){var dv=document.createElement('div');dv.id='okPay';im.parentNode.insertBefore(dv,im.nextSibling)}
async function myBooking(a){
  var key=a&&a.p_key,res=null;
  if(/^JW\d{6}$/i.test(key||'')){
    var sb=await rp('student_bookings',{p_key:key});
    if(!sb.error&&sb.data&&sb.data.length){
      var parts=await Promise.all(sb.data.map(function(no){return _rpc.call(SB,'my_booking',{p_key:no})})),list=[],seen={};
      parts.forEach(function(r){if(!r.error&&Array.isArray(r.data))r.data.forEach(function(m){if(!seen[m.m_no]){seen[m.m_no]=1;list.push(m)}})});
      res={data:list,error:null};
    }
  }
  if(!res)res=await _rpc.call(SB,'my_booking',a);
  if(!res.error&&Array.isArray(res.data)&&res.data.length){
    var mp=await rp('student_ids',{p_nos:res.data.map(function(m){return m.m_no})});
    res.data.forEach(function(m){m.bn=m.m_no;if(!mp.error&&mp.data&&mp.data[m.m_no])m.m_no=mp.data[m.m_no]});
  }
  if(!res.error&&Array.isArray(res.data)){
    await Promise.all(res.data.map(async function(m){var k=m.m_no+'|'+m.m_batch;
      if(m.m_paid){window.__st[k]='paid';return}
      var q=await rp('pay_info',{p_no:m.bn||m.m_no});
      if(!q.error&&q.data){q.data.bn=m.bn||m.m_no;m.pi=q.data;window.__st[k]=q.data.st||'pending'}else window.__st[k]='pending'}));
  }
  return res;
}
SB.rpc=function(fn,a){
  if(fn==='my_booking')return myBooking(a);
  var p=_rpc.call(SB,fn,a);
  if(fn==='register_booking')return p.then(async function(r){
    if(r.error||!r.data)return r;
    var e=$('okPay');if(e)e.innerHTML='';
    var q=await rp('pay_info',{p_no:r.data}),sid=r.data;
    if(!q.error&&q.data){sid=q.data.sid||sid;q.data.bn=r.data;if(e)e.innerHTML=payHtml(q.data)}
    return{data:sid,error:null}});
  return p;
};
})();
