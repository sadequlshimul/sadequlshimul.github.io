/* ===== home.js: হোম পেজের অপশন-কার্ড (লক্ষ্য · কোর্স · মক টেস্ট · আমার ব্যাচ · ভোকাবুলারি) ===== */
var greets=['Hallo!','Guten Tag!','Willkommen!','Los geht’s!','Viel Erfolg!'],gi=0;
setInterval(function(){if(document.hidden||$('home').classList.contains('hide'))return;var a=document.activeElement;if(a&&(a.tagName==='INPUT'||a.tagName==='SELECT'))return;gi=(gi+1)%greets.length;$('hi').textContent=greets[gi]},2200);
(function(){
var s3=document.createElement('style');
s3.textContent='#hub{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:14px;grid-column:1/-1}@media(min-width:900px){#hub{grid-template-columns:repeat(5,1fr)}}.ht:nth-child(5){grid-column:1/-1;min-height:96px}@media(min-width:900px){.ht:nth-child(5){grid-column:auto;min-height:132px}}'
+'.ht{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:8px;text-align:left;background:var(--card);color:var(--ink);border-radius:18px;padding:18px 14px 14px;box-shadow:0 2px 10px rgba(0,30,70,.08);overflow:hidden;min-height:132px;border:0}'
+'.ht:before{content:"";position:absolute;left:0;top:0;right:0;height:5px;background:var(--c)}'
+'.ht .ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--c);color:#fff}.ht .ic svg{width:26px;height:26px;fill:currentColor}'
+'.ht b{font-size:17px;line-height:1.25}.ht small{color:var(--mute);font-weight:400;font-size:12.5px;line-height:1.4}'
+'.ht .ar{position:absolute;right:12px;top:18px;font-size:20px;line-height:1;color:var(--mute);transition:transform .2s}'
+'.ht.on{background:var(--c);color:#fff}.ht.on small,.ht.on .ar{color:rgba(255,255,255,.88)}.ht.on .ic{background:rgba(255,255,255,.22)}.ht.on .ar{transform:rotate(90deg)}.ht.on:before{background:rgba(255,255,255,.4)}'
+'.pn{margin-top:12px;animation:pin .25s ease both}@keyframes pin{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.pn{animation:none}}'
;
document.head.appendChild(s3);var IC={
 c:'<svg viewBox="0 0 24 24"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5A1.5 1.5 0 0 0 5 18.5V5.5zM6.5 19H20v2H6.5a1.5 1.5 0 0 1 0-3z"/></svg>',
 m:'<svg viewBox="0 0 24 24"><path d="M9 2h6a1 1 0 0 1 1 1v1h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2V3a1 1 0 0 1 1-1zm0 2v1h6V4H9zm-.7 9.3 1.4 1.4 3-3 1.4 1.4-4.4 4.4-2.8-2.8z"/></svg>',
 t:'<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5V7z"/></svg>',
 g:'<svg viewBox="0 0 24 24"><path d="M6 3h2v18H6zm3 1h10l-2.5 4L19 12H9z"/></svg>',
 v:'<b style="font-size:20px;font-weight:700;line-height:1">Aa</b>'};
var T=[['g','তোমার লক্ষ্য','পড়াশোনা · Ausbildung · পরিবার','#e8590c'],['c','সকল কোর্স','বর্তমানে চালু সব ব্যাচ','#1e8e5a'],['m','মক টেস্ট','A1 · A2 · B1','#6f42c1'],['t','আমার ব্যাচ','আইডি বা ফোন নম্বর দিয়ে','#0c8599'],['v','ভোকাবুলারি','der · die · das আলাদা রঙে','#c2255c']];
var hm=$('home');if(!hm||$('hub'))return;
var H=document.createElement('div');H.id='hub';
H.innerHTML=T.map(function(x){return '<button class="ht" data-k="'+x[0]+'" style="--c:'+x[3]+'"><span class="ic">'+IC[x[0]]+'</span><b>'+x[1]+'</b><small id="hts_'+x[0]+'">'+x[2]+'</small><span class="ar">›</span></button>'}).join('');
hm.insertBefore(H,hm.firstChild);
var PAGE={g:'goal',c:'courses',m:'mock',t:'my',v:'vocab'};
H.addEventListener('click',function(e){var b=e.target&&e.target.closest?e.target.closest('.ht'):null;if(b)go(PAGE[b.getAttribute('data-k')])});
W('renderHome',function(o){return function(){o.apply(this,arguments);var s=$('hts_c');if(s&&typeof PC!=='undefined'&&PC.length)s.textContent=PC.length+'টি কোর্স চালু, ট্যাপ করে দেখো'}});
})();
