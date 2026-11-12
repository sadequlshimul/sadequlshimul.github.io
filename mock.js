/* ===== mock.js: মক টেস্ট (A1 · A2 · B1) — মক টেস্ট ট্যাপ করলে তবেই লোড হয় ===== */
(function(){
var s3=document.createElement('style');
s3.textContent=''
+'.lv{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.lv button{display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--soft);color:var(--ink);border-radius:16px;padding:14px 6px;font-size:13px;line-height:1.3}'
+'.lv i{font-style:normal;display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:var(--c);color:#fff;font-weight:700;font-size:20px}.lv button.on{background:var(--c);color:#fff}.lv button.on i{background:rgba(255,255,255,.25)}'
+'.mods{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.mods div{background:var(--soft);border-radius:12px;padding:10px;font-size:14px}.mods small{display:block;color:var(--mute);font-size:12px}';
document.head.appendChild(s3);
var LV=[['A1','#1e8e5a'],['A2','#0c8599'],['B1','#6f42c1']],MD=[['📖','Lesen','পড়া'],['🎧','Hören','শোনা'],['✍️','Schreiben','লেখা'],['🗣️','Sprechen','বলা']];
window.initMock=function(pm){
  pm.innerHTML='<div class="card"><h2>📝 মক টেস্ট</h2><p class="sub">তোমার লেভেল বেছে নাও</p><div class="lv">'
   +LV.map(function(l){return '<button data-l="'+l[0]+'" style="--c:'+l[1]+'"><i>'+l[0]+'</i><b>মক টেস্ট '+l[0]+'</b></button>'}).join('')+'</div><div id="lvDet"></div></div>';
  pm.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.lv button'):null;if(!b)return;
    var l=b.getAttribute('data-l'),col=b.style.getPropertyValue('--c');
    Array.prototype.forEach.call(pm.querySelectorAll('.lv button'),function(x){x.classList.toggle('on',x===b)});
    $('lvDet').innerHTML='<div style="margin-top:14px;border-left:6px solid '+col+';padding-left:12px"><h2 style="font-size:18px">মক টেস্ট '+l+'</h2><p class="sub">চারটা অংশে পুরো পরীক্ষার মতো অনুশীলন। টেস্টের নিয়ম, সময় ও বুকিং এখানে যোগ হবে।</p></div><div class="mods">'
     +MD.map(function(m){return '<div>'+m[0]+' <b>'+m[1]+'</b><small>'+m[2]+' · শীঘ্রই</small></div>'}).join('')+'</div>';
  });
};
})();
