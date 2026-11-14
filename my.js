/* ===== my.js: আমার ব্যাচ ===== */
/* ---------- my batch ---------- */
var myT=[];
function myLS(){try{return JSON.parse(localStorage.getItem('jw_my'))}catch(e){return null}}
function saveMy(k){try{localStorage.setItem('jw_my',JSON.stringify({k:k}))}catch(e){}}
function forgetMy(){try{localStorage.removeItem('jw_my')}catch(e){}show('myRes',false);show('myLookup',true);$('myKey').value='';$('myErr').textContent='';document.body.style.removeProperty('--p');$('myBtn').textContent='আমার ব্যাচ দেখুন →'}
async function initMy(){
  var s=myLS();
  if(s&&s.k){$('myKey').value=s.k;await lookupMy(true)}
  else{show('myRes',false);show('myLookup',true)}
}
async function lookupMy(silent){
  var key=$('myKey').value.trim().replace(/[\s-]/g,''),err=$('myErr');err.textContent='';
  var isId=/^JW\d{6}$/i.test(key),isPh=/^(\+?88)?01[3-9]\d{8}$/.test(key);
  if(!isId&&!isPh){err.textContent='আমার আইডি (যেমন JW123456) অথবা মোবাইল নম্বর (01XXXXXXXXX) লিখুন।';show('myRes',false);show('myLookup',true);return}
  if(isId)key=key.toUpperCase();
  var r=await SB.rpc('my_booking',{p_key:key});
  if(r.error){err.textContent=msgOf(r.error);show('myLookup',true);return}
  if(!r.data||!r.data.length){err.textContent='এই আইডি বা নম্বরে কোনো বুকিং পাওয়া যায়নি।';show('myRes',false);show('myLookup',true);return}
  saveMy(key);await renderMy(r.data);
}
function cardMy(m,i){
  var left=m.m_sd?daysLeft(m.m_sd):null,cd='';
  if(!m.m_active)cd='<div class="cd">এই বুকিং বাতিল করা হয়েছে।</div>';
  else if(m.m_done)cd='<div class="cd"><b style="font-size:20px">এই ব্যাচ সম্পন্ন হয়েছে</b></div>';
  else if(!m.m_current)cd='<div class="cd">এটি আগের ব্যাচের বুকিং।</div>';
  else if(left===null)cd='<div class="cd">ক্লাস শুরুর তারিখ শীঘ্রই জানানো হবে।</div>';
  else if(left>1)cd='<div class="cd">ক্লাস শুরু হতে<b>'+left+' দিন বাকি</b></div>';
  else if(left===1)cd='<div class="cd"><b>আগামীকাল ক্লাস শুরু!</b></div>';
  else if(left===0)cd='<div class="cd"><b>আজ ক্লাস শুরু!</b></div>';
  else cd='<div class="cd">ক্লাস শুরু হয়ে গেছে।</div>';
  var ri=[['ধরন',m.m_mode],['সময়কাল',m.m_dur],['সময়',m.m_time],['বার',m.m_days],['কবে থেকে শুরু',startTxt(m.m_sd,m.m_start)],['বিস্তারিত',m.m_extra]].filter(function(x){return x[1]});
  return '<div class="card" style="border-left:8px solid '+esc(m.m_color||'#0058a3')+'"><h2>'+esc(m.m_course)+'</h2><p class="sub">'+esc(m.m_name)+' · '+esc(m.m_no)+'</p>'
    +'<div style="margin:8px 0"><span class="pill" style="background:var(--soft);color:var(--ink)">ব্যাচ '+esc(m.m_batch)+'</span> <span class="pill '+(m.m_paid?'pd':'pen')+'">'+(m.m_paid?'Paid':'Pending')+'</span>'+(m.m_active?'':' <span class="pill cx">Cancelled</span>')+'</div>'+cd
    +(!m.m_paid&&m.m_active?'<p class="sub" style="margin-top:8px">পেমেন্ট নিশ্চিত হলে এখানে Paid দেখাবে।</p>':'')
    +(ri.length?'<h2 style="font-size:16px;margin:14px 0 4px">ক্লাসের তথ্য</h2>'+ri.map(function(x){return '<div class="irow"><span>'+x[0]+'</span><b>'+esc(lat(x[1]))+'</b></div>'}).join(''):'')
    +'<img id="mtk_'+i+'" class="tkimg" alt="Ticket"><div class="tools" style="justify-content:center"><button onclick="saveTicketAt('+i+')">টিকিট ডাউনলোড</button><button class="g hide" id="msh_'+i+'" onclick="shareTicketAt('+i+')">শেয়ার করুন</button></div></div>';
}
async function renderMy(list){
  document.body.style.setProperty('--p',list[0].m_color||'#0058a3');
  myT=list.map(function(m){return{name:m.m_name,no:m.m_no,title:m.m_course,code:m.m_code,batch:m.m_batch,color:m.m_color||'#0058a3',time:m.m_time,days:m.m_days,start:m.m_sd?fmtDate(m.m_sd):m.m_start}});
  $('myList').innerHTML=list.map(cardMy).join('');
  show('myLookup',false);show('myRes',true);
  var can=false;try{var f=new File([''],'a.png',{type:'image/png'});can=!!(navigator.canShare&&navigator.canShare({files:[f]}))}catch(e){}
  for(var i=0;i<myT.length;i++){
    if(can)show('msh_'+i,true);
    try{var cv=await drawTicket(myT[i]);var im=$('mtk_'+i);if(im)im.src=cv.toDataURL('image/png')}catch(e){}
  }
}
function saveTicketAt(i){lastT=myT[i];saveTicket()}
function shareTicketAt(i){lastT=myT[i];shareTicket()}


(function(){
W('cardMy',function(o){return function(m,i){
  var h=o(m,i).replace(/<p class="sub" style="margin-top:8px">পেমেন্ট নিশ্চিত হলে এখানে Paid দেখাবে।<\/p>/,'');
  return h.replace(/<\/div>$/,'<div id="mpay_'+i+'"></div></div>')}});
W('renderMy',function(o){return function(list){
  var p=o(list);
  list.forEach(function(m,i){if(!m.m_paid){var e=$('mpay_'+i);if(e&&m.pi)e.innerHTML=payHtml(m.pi)}});
  return p}});
})();
