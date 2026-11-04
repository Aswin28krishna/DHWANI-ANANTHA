(()=>{
const C=window.DA_CONFIG||{},P=C.payment||{},$=s=>document.querySelector(s),
inr=n=>'₹'+Number(n).toLocaleString('en-IN'),
esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
wa=(t='')=>C.whatsappNumber?`https://wa.me/${C.whatsappNumber.replace(/\D/g,'')}?text=${encodeURIComponent(t)}`:'';
const cats=C.membership||[],open=cats.filter(c=>!c.closed);

/* equalizer */
const eq=$('.eq');if(eq)eq.innerHTML=Array.from({length:44},(_,i)=>`<span style="--d:${(Math.sin(i*1.7)+1.4).toFixed(2)}s;--h:${30+Math.round(Math.abs(Math.sin(i*.9))*70)}%;--o:${-(i*0.13).toFixed(2)}s"></span>`).join('');
/* nav */
const nav=$('.nav'),mb=$('.menu');
mb.onclick=()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o)};
document.querySelectorAll('#nav a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');mb.setAttribute('aria-expanded',false)});

/* membership table + form radios */
$('#fees tbody').innerHTML=cats.map(c=>{const f=v=>v==null?'—':v===0?'₹0':inr(v);
return `<tr><th scope="row" data-l="Category">${esc(c.name)}</th><td data-l="Seats">${c.seats}</td><td data-l="Monthly">${f(c.monthly)}</td><td data-l="Joining">${f(c.joining)}</td><td data-l="One-time">${f(c.onetime)}</td><td data-l="Guests">${c.guests}</td><td data-l="Track credits">${c.credits}</td><td>${c.closed?'':`<a class="pick" href="#apply" data-c="${esc(c.name)}">Apply</a>`}</td></tr>`}).join('');
$('#radios').innerHTML=open.map((c,i)=>`<label><input type="radio" name="category" value="${esc(c.name)}" ${i?'':'required'}> ${esc(c.name)}</label>`).join('');
document.addEventListener('click',e=>{const a=e.target.closest('.pick');if(a){const r=document.querySelector(`input[name=category][value="${a.dataset.c}"]`);if(r)r.checked=true}});

/* WhatsApp group / enquiry button */
const w=$('#wa');
if(C.whatsappGroupLink){w.href=C.whatsappGroupLink;w.textContent='Join our WhatsApp group';w.hidden=false}
else if(C.whatsappNumber){w.href=wa('Hello Dhwani–Anantha, I would like to know more about membership.');w.textContent='Ask us on WhatsApp';w.hidden=false}

/* calendar */
let ev=(C.events||[]).filter(e=>/^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((a,b)=>a.date.localeCompare(b.date));
const now=new Date(),iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,today=iso(now);
let cur=new Date(now.getFullYear(),now.getMonth(),1);
function cal(){const y=cur.getFullYear(),m=cur.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate();
$('#month').textContent=cur.toLocaleString('en-IN',{month:'long',year:'numeric'});let h='';
for(let i=0;i<first;i++)h+='<div class="muted"></div>';
for(let d=1;d<=n;d++){const k=iso(new Date(y,m,d)),es=ev.filter(e=>e.date===k);
h+=es.length?`<button class="has" data-d="${k}" aria-label="${d}: ${esc(es.map(e=>e.title).join(', '))}"><span>${d}</span><i></i></button>`:`<div class="${k===today?'today':''}">${d}</div>`}
$('#days').innerHTML=h}
function list(k){const l=k?ev.filter(e=>e.date===k):ev.filter(e=>e.date>=today).slice(0,4);
$('#upcoming').innerHTML=l.length?l.map(e=>`<div class="ev"><b>${new Date(e.date+'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}${e.time?' · '+esc(e.time):''}</b><span>${esc(e.title)}</span><p>${esc([e.place,e.note].filter(Boolean).join(' — '))}</p></div>`).join(''):
`<span>♪</span><div><b>Dates will be announced soon</b><p>${C.whatsappGroupLink?'Join the WhatsApp group to hear first.':'Check back shortly.'}</p></div>`}
$('#prev').onclick=()=>{cur.setMonth(cur.getMonth()-1);cal()};$('#next').onclick=()=>{cur.setMonth(cur.getMonth()+1);cal()};
$('#days').onclick=e=>{const b=e.target.closest('.has');if(b)list(b.dataset.d)};cal();list();
fetch('/api/events').then(r=>r.ok?r.json():[]).then(j=>{if(!Array.isArray(j)||!j.length)return;const ok=e=>/^\d{4}-\d{2}-\d{2}$/.test(e.date);ev=[...ev,...j.filter(ok)].sort((a,b)=>a.date.localeCompare(b.date));cal();list()}).catch(()=>{});

/* gallery + testimonials */
$('#galTitle').textContent=C.galleryTitle||'Gallery';$('#galIntro').textContent=C.galleryIntro||'';
$('#galGrid').innerHTML=(C.gallery||[]).map((g,i)=>`<figure class="${i?'':'tall'}"><a href="#gallery" data-flyer="${i}"><img src="${esc(g.src)}" alt="${esc(g.title)}" loading="lazy"></a><figcaption><b>${esc(g.title)}</b><span>${esc(g.caption||'')}</span></figcaption></figure>`).join('');
if(!(C.gallery||[]).length)$('#gallery').hidden=true;
if((C.testimonials||[]).length){$('#voices').hidden=false;$('#navVoices').hidden=false;
$('#tGrid').innerHTML=C.testimonials.map(t=>`<article><p>“${esc(t.quote)}”</p><small>— ${esc(t.name)}${t.category?' · '+esc(t.category):''}</small></article>`).join('')}

/* footer */
const fl=[];if(C.contactEmail)fl.push(`<a href="mailto:${esc(C.contactEmail)}">${esc(C.contactEmail)}</a>`);
Object.entries(C.social||{}).forEach(([k,v])=>v&&fl.push(`<a href="${esc(v)}" target="_blank" rel="noopener">${k[0].toUpperCase()+k.slice(1)}</a>`));
fl.push('<a href="privacy.html">Privacy</a>');$('#foot').innerHTML=fl.join(' &nbsp;•&nbsp; ');

/* application form */
const form=$('#form'),msg=$('#message');
const summary=d=>`New membership application\nName: ${d.name}\nAge & occupation: ${d.age||'-'}\nPhone: ${d.phone}\nEmail: ${d.email}\nAddress: ${d.address||'-'}\nCategory: ${d.category}\nIntroduced by: ${d.referrer||'-'} (${d.referrerDetails||'-'})`;
async function send(d){
 if(C.formEndpoint){const r=await fetch(C.formEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...d,consent:form.consent.checked})});const j=await r.json().catch(()=>({}));if(!r.ok||j.ok===false){const x=new Error(j.error||'');x.server=1;throw x}return 'sent'}
 if(C.netlifyForms){const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()});if(!r.ok)throw 0;return 'sent'}
 if(C.whatsappNumber){window.open(wa(summary(d)),'_blank');return 'manual'}
 if(C.contactEmail){location.href=`mailto:${C.contactEmail}?subject=${encodeURIComponent('Membership application — '+d.name)}&body=${encodeURIComponent(summary(d))}`;return 'manual'}
 throw new Error('not-configured')}
function payBlock(cat){const c=cats.find(x=>x.name===cat)||{},link=(P.links||{})[cat]||P.defaultLink;
 if(c.joining===0)return `<p>There is no joining fee for ${esc(cat)} membership.</p>`;
 let h=`<p class="fee">Joining fee: <b>${inr(c.joining)}</b><br><small>Then ${inr(c.monthly)} per month, or ${inr(c.onetime)} one-time.</small></p>`;
 if(link)h+=`<a class="btn primary" href="${esc(link)}" target="_blank" rel="noopener">Pay joining fee</a>`;
 if(P.upiId)h+=` <a class="btn outline dark" href="upi://pay?pa=${encodeURIComponent(P.upiId)}&pn=${encodeURIComponent(P.upiName||'')}&am=${c.joining}&cu=INR&tn=${encodeURIComponent('Dhwani-Anantha '+cat+' joining')}">Pay by UPI</a>`;
 if(!link&&!P.upiId)h+=`<p>${esc(P.manualInstructions||'')}</p>`;return h}
form.onsubmit=async e=>{e.preventDefault();msg.textContent='';
 if(form.website&&form.website.value)return;
 if(!form.checkValidity()){form.reportValidity();return}
 const d=Object.fromEntries(new FormData(form)),btn=form.querySelector('.submit');
 if(d.phone.replace(/\D/g,'').length<10){msg.textContent='Enter a phone number with at least 10 digits.';form.phone.focus();return}
 btn.disabled=true;btn.textContent='Sending…';
 try{const mode=await send(d);
  $('#done').innerHTML=`<h3>Thank you, ${esc(d.name.split(' ')[0])}.</h3><p>${mode==='sent'?'Your application has been received.':'Your application is ready. Please press send in the app that just opened to complete it.'}</p><div class="paybox"><h4>Next: joining fee</h4>${payBlock(d.category)}</div>${C.whatsappGroupLink?`<a class="whatsapp" href="${esc(C.whatsappGroupLink)}" target="_blank" rel="noopener">Join our WhatsApp group</a>`:''}`;
  form.hidden=true;$('#done').hidden=false;window.DAburst&&window.DAburst(26);$('#done').scrollIntoView({behavior:'smooth',block:'center'});form.reset()}
 catch(err){msg.textContent=err&&err.server&&err.message?err.message:err&&err.message==='not-configured'?'Applications are not switched on yet. Please check back soon.':'Could not send your application. Check your connection and try again.'}
 btn.disabled=false;btn.textContent='Submit application'}
})();
