/* ===== ticket.js: কার্ড/টিকিটের ছবি ও পেমেন্টের অবস্থা (বাকি / যাচাই চলছে / নিশ্চিত) ===== */
/* ---------- ticket image ---------- */
var lastT=null;
function tdata(c,name,no){var I=c.i;return{name:name,no:no,title:c.title,code:c.code,batch:c.bc,color:c.color,time:I.time,days:I.days,start:I.sd?fmtDate(I.sd):I.start}}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function fit(x,txt,maxW,size,wt){var z=size;do{x.font=wt+' '+z+'px "Hind Siliguri",sans-serif';z-=2}while(x.measureText(txt).width>maxW&&z>18)}
async function drawTicket(t){
  try{await document.fonts.load('700 30px "Hind Siliguri"','আকখ');await document.fonts.load('400 24px "Hind Siliguri"','আকখ');await document.fonts.load('600 30px "Hind Siliguri"','আকখ')}catch(e){}
  var W=1200,H=600,cv=document.createElement('canvas');cv.width=W;cv.height=H;var x=cv.getContext('2d');
  x.fillStyle='#f4f1ea';x.fillRect(0,0,W,H);
  rr(x,30,30,W-60,H-60,36);x.fillStyle='#ffffff';x.fill();
  x.save();rr(x,30,30,W-60,H-60,36);x.clip();
  x.fillStyle=t.color;x.fillRect(30,30,260,H-60);x.fillStyle='#ffda1a';x.fillRect(290,30,10,H-60);x.restore();
  x.textAlign='center';x.fillStyle='rgba(255,255,255,.9)';x.font='600 26px "Hind Siliguri",sans-serif';x.fillText('DEUTSCH',160,H/2-70);
  x.fillStyle='#ffffff';x.font='700 '+(t.code.length>3?64:110)+'px "Hind Siliguri",sans-serif';x.fillText(t.code,160,H/2+34);
  x.textAlign='left';x.fillStyle='#14213d';x.font='700 32px "Hind Siliguri",sans-serif';x.fillText('JABIRS WEG',340,92);
  x.fillStyle='#6a7385';x.font='400 24px "Hind Siliguri",sans-serif';x.fillText('Willkommen! · টিকিট',620,92);
  x.fillStyle='#14213d';fit(x,t.name,780,50,'700');x.fillText(t.name,340,170);
  x.fillStyle=t.color;fit(x,t.title,780,32,'600');x.fillText(t.title,340,216);
  var L=[];if(t.batch)L.push('ব্যাচ কোড: '+t.batch);
  var ts=[t.time,t.days].filter(Boolean).join(' · ');if(ts)L.push(lat(ts));
  if(t.start)L.push('শুরু: '+lat(t.start));
  x.fillStyle='#14213d';var y=268;L.forEach(function(l){fit(x,l,780,28,'400');x.fillText(l,340,y);y+=40});
  x.strokeStyle='#cfc8b8';x.lineWidth=3;x.setLineDash([12,10]);x.beginPath();x.moveTo(60,430);x.lineTo(W-60,430);x.stroke();x.setLineDash([]);
  x.fillStyle='#f4f1ea';x.beginPath();x.arc(30,430,26,0,7);x.fill();x.beginPath();x.arc(W-30,430,26,0,7);x.fill();
  x.fillStyle='#6a7385';x.font='400 24px "Hind Siliguri",sans-serif';x.fillText('আমার আইডি',340,486);
  x.fillStyle=t.color;x.font='700 64px "Hind Siliguri",sans-serif';x.fillText(t.no,340,555);
  x.textAlign='right';x.fillStyle='#6a7385';x.font='400 22px "Hind Siliguri",sans-serif';x.fillText(location.host||'',W-70,555);
  return cv;
}
async function showTicket(t,imgId,shId){
  lastT=t;var cv=await drawTicket(t);$(imgId).src=cv.toDataURL('image/png');
  try{var f=new File([''],'a.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]}))show(shId,true)}catch(e){}
}
async function saveTicket(){
  if(!lastT)return;var cv=await drawTicket(lastT);
  cv.toBlob(function(b){if(!b)return;var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='ticket-'+lastT.no+'.png';document.body.appendChild(a);a.click();a.remove()},'image/png');
}
async function shareTicket(){
  if(!lastT)return;var cv=await drawTicket(lastT);
  cv.toBlob(function(b){try{navigator.share({files:[new File([b],'ticket-'+lastT.no+'.png',{type:'image/png'})],title:'Jabirs Weg টিকিট'})}catch(e){}},'image/png');
}


(function(){
/* ---- কার্ডের অবস্থা: পেমেন্ট বাকি / যাচাই চলছে / নিশ্চিত ---- */
window.__st=window.__st||{};
function admView(){return $('dv')&&!$('dv').classList.contains('hide')}
function stOf(t){
  if(t.st)return t.st;
  var k=t.no+'|'+t.batch;if(window.__st[k])return window.__st[k];
  var r=(typeof rows!=='undefined'?rows:[]).filter(function(s){return s.booking_no===t.no&&s.batch_code===t.batch})[0];
  if(r)return r.paid?'paid':(r.expired_at?'expired':(r.proof_at?'verifying':'pending'));
  return 'paid';
}
W('tdata',function(o){return function(c,n,no){var t=o(c,n,no);t.st='pending';return t}});
W('drawTicket',function(o){return async function(t){
  var cv=await o(t),st=stOf(t),x=cv.getContext('2d'),W0=cv.width,B={paid:['#1e8e5a','✓ পেমেন্ট নিশ্চিত'],pending:['#e53935','পেমেন্ট বাকি'],verifying:['#1c7ed6','যাচাই চলছে'],expired:['#757575','✕ মেয়াদ শেষ']}[st]||['#1e8e5a','✓ পেমেন্ট নিশ্চিত'];
  if(st!=='paid'){x.save();x.translate(W0/2+60,cv.height/2+20);x.rotate(-0.3);x.globalAlpha=.08;x.fillStyle='#14213d';x.textAlign='center';var wm=st==='verifying'?'VERIFYING':(st==='expired'?'EXPIRED':'UNPAID');x.font='700 '+Math.min(150,Math.floor(900/wm.length))+'px "Hind Siliguri",sans-serif';x.fillText(wm,0,0);x.restore()}
  x.save();x.fillStyle=B[0];var w=290,h=52,px=W0-60-w,py=46;x.beginPath();x.moveTo(px+14,py);x.arcTo(px+w,py,px+w,py+h,14);x.arcTo(px+w,py+h,px,py+h,14);x.arcTo(px,py+h,px,py,14);x.arcTo(px,py,px+w,py,14);x.closePath();x.fill();
  x.fillStyle='#fff';x.textAlign='center';x.font='700 26px "Hind Siliguri",sans-serif';x.fillText(B[1],px+w/2,py+36);x.restore();
  return cv}});
function gate(){var t=lastT;if(t&&!admView()&&stOf(t)!=='paid'){alert('পেমেন্ট নিশ্চিত হলে কার্ড ডাউনলোড ও শেয়ার করতে পারবে।');return false}return true}
W('saveTicket',function(o){return function(){return gate()?o.apply(this,arguments):undefined}});
W('shareTicket',function(o){return function(){return gate()?o.apply(this,arguments):undefined}});
})();
