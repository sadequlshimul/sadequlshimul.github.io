/* ===== goal.js: আপনার লক্ষ্য (পথের স্টেশন) ===== */
var MV=[
 {i:'🎓',t:'পড়াশোনা',s:['সার্টিফিকেট ও কাগজপত্র গুছিয়ে নেওয়া','Studienkolleg বা বিশ্ববিদ্যালয়ে আবেদন','ভিসা আবেদন','জার্মানিতে ক্লাস শুরু']},
 {i:'💼',t:'Ausbildung',s:['পেশা ও ক্ষেত্র বেছে নেওয়া','সিভি ও আবেদনপত্র তৈরি','প্রতিষ্ঠানে আবেদন','ভিসা ও কাগজপত্র','নতুন কাজ বা প্রশিক্ষণ শুরু']},
 {i:'👨‍👩‍👧',t:'পরিবার',s:['প্রয়োজনীয় সনদ ও কাগজপত্র গোছানো','ভিসার আবেদন','প্রক্রিয়া ও অপেক্ষা','পরিবারের সাথে নতুন জীবন']}
];
var mv=-1,BN=['২','৩','৪','৫','৬','৭'];
function mvSel(i){mv=mv===i?-1:i;renderWg()}
function renderWg(){
  var m=MV[mv];
  $('mv').innerHTML=MV.map(function(x,i){return '<button class="'+(i===mv?'on':'')+'" onclick="mvSel('+i+')"><span>'+x.i+'</span>'+esc(x.t)+'</button>'}).join('');
  if(mv<0){$('mvTxt').innerHTML='';return}
  $('mvTxt').innerHTML='<ul class="tl"><li class="me" style="animation-delay:0s"><i>১</i><b>ভাষা শেখা</b><span class="tg">এই ধাপে Jabirs Weg আপনার পাশে</span></li>'+m.s.map(function(t,k){return '<li style="animation-delay:'+((k+1)*0.15)+'s"><i>'+BN[k]+'</i>'+esc(t)+'</li>'}).join('')+'</ul><small class="tn">নিয়ম বদলাতে পারে, আবেদনের আগে অফিসিয়াল সাইট দেখে নিন।</small>';
}

(function(){
var st=document.createElement('style');
st.textContent=''
+'.mv button span{display:grid;place-items:center;width:38px;height:38px}.mv button span svg{width:36px;height:36px;fill:currentColor}';document.head.appendChild(st);
var ICO=['<svg viewBox="0 0 40 40"><path d="M20 8 3 16.5 20 25l17-8.5z"/><path d="M35 18.5h2V28h-2z" opacity=".7"/><path d="M10 21.5v7c0 2.5 4.5 4.5 10 4.5s10-2 10-4.5v-7L20 27z" opacity=".7"/></svg>','<svg viewBox="0 0 40 40"><path d="M15 12v-2a2.5 2.5 0 0 1 2.5-2.5h5A2.5 2.5 0 0 1 25 10v2h-2.5v-1.5h-5V12z"/><rect x="5" y="12" width="30" height="10" rx="3"/><rect x="5" y="24" width="30" height="9" rx="3" opacity=".7"/></svg>','<svg viewBox="0 0 40 40"><circle cx="14" cy="11" r="5"/><path d="M4 34v-8a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7v8z"/><circle cx="30" cy="19" r="3.8" opacity=".75"/><path d="M23 34v-4a5.5 5.5 0 0 1 5.5-5.5h3A5.5 5.5 0 0 1 37 30v4z" opacity=".75"/></svg>'];
W('renderWg',function(o){return function(){o.apply(this,arguments);var b=$('mv').children;for(var i=0;i<b.length&&i<ICO.length;i++){if(b[i].firstChild)b[i].firstChild.innerHTML=ICO[i]}}});
})();
