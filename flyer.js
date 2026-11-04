(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const fv=$('#flyer'),pages=$$('.fv-page',fv),dots=$('#fvDots'),prev=$('.fv-nav.prev'),next=$('.fv-nav.next'),stage=$('#fvStage'),notesBox=$('.fv-notes');
let cur=0,isOpen=false,lastFocus=null,sound=true;

/* ---- soft chimes (Web Audio), pentatonic ---- */
let ac;const scale=[392,440,523.25,587.33,659.25,783.99,880,1046.5];
function chime(seq){if(!sound||reduce)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();
 seq.forEach((n,i)=>{const t=ac.currentTime+i*.11,o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain();
  o.type='sine';o2.type='triangle';o.frequency.value=scale[n];o2.frequency.value=scale[n]*2;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.12,t+.02);g.gain.exponentialRampToValueAtTime(.0008,t+1.1);
  o.connect(g);o2.connect(g);g.connect(ac.destination);o.start(t);o2.start(t);o.stop(t+1.2);o2.stop(t+1.2)})}catch(e){}}

/* ---- note particles ---- */
const glyphs=['♪','♫','♬','♩','𝄞'],cols=['#f5c76b','#ee7d1b','#6eb2a8','#ff8fb8','#fff3d0'];
function burst(n=14,box=notesBox,fromY){for(let i=0;i<n;i++){const s=document.createElement('span');
 s.textContent=glyphs[i%glyphs.length];
 s.style.cssText=`--s:${18+Math.random()*26}px;--c:${cols[i%cols.length]};--dx:${(Math.random()-.5)*Math.min(innerWidth,700)}px;--dy:${-120-Math.random()*Math.min(innerHeight*.6,420)}px;--r:${(Math.random()-.5)*80}deg;animation-delay:${Math.random()*.25}s`;
 if(fromY)s.style.bottom=fromY;box.appendChild(s);setTimeout(()=>s.remove(),2100)}}
window.DAburst=n=>{if(!reduce)burst(n);chime([2,4,5,7])};

/* ---- pages ---- */
dots.innerHTML=pages.map((p,i)=>`<button type="button" aria-label="${p.getAttribute('aria-label')}" data-i="${i}"></button>`).join('');
function show(i,silent){i=Math.max(0,Math.min(pages.length-1,i));const dir=i-cur;cur=i;
 pages.forEach((p,k)=>{p.classList.toggle('on',k===i);p.classList.toggle('before',k<i);p.classList.toggle('after',k>i);
  k===i?p.removeAttribute('aria-hidden'):p.setAttribute('aria-hidden','true');p.inert=k!==i});
 $$('button',dots).forEach((b,k)=>b.setAttribute('aria-current',k===i));
 prev.disabled=i===0;next.disabled=i===pages.length-1;
 if(!silent&&dir){if(!reduce)burst(12);chime(dir>0?[i+1,i+3]:[i+3,i+1])}}
function open(i=0){if(isOpen){show(i);return}isOpen=true;lastFocus=document.activeElement;
 fv.hidden=false;document.body.classList.add('fv-lock');fv.classList.toggle('noanim',reduce);
 pages.forEach(p=>{p.style.transition='none'});show(i,true);void fv.offsetWidth;pages.forEach(p=>p.style.transition='');
 fv.classList.add('open');requestAnimationFrame(()=>requestAnimationFrame(()=>fv.classList.add('show')));
 chime([0,2,4,5,7]);if(!reduce)setTimeout(()=>burst(18),900);
 setTimeout(()=>$('#fvClose').focus({preventScroll:true}),400)}
function close(){if(!isOpen)return;isOpen=false;fv.classList.remove('show');
 setTimeout(()=>{fv.hidden=true;fv.classList.remove('open');document.body.classList.remove('fv-lock');lastFocus&&lastFocus.focus&&lastFocus.focus({preventScroll:true})},reduce?0:450)}

/* ---- wiring ---- */
document.addEventListener('click',e=>{
 const f=e.target.closest('[data-flyer]');if(f){e.preventDefault();open(+f.dataset.flyer);return}
 const a=e.target.closest('a[href="#apply"]');if(a){e.preventDefault();open(2);return}
 const g=e.target.closest('[data-go]');if(g&&fv.contains(g)){show(+g.dataset.go);return}
 const d=e.target.closest('#fvDots button');if(d)show(+d.dataset.i)});
prev.onclick=()=>show(cur-1);next.onclick=()=>show(cur+1);$('#fvClose').onclick=close;
$('#fvSound').onclick=e=>{sound=!sound;e.currentTarget.setAttribute('aria-pressed',sound);e.currentTarget.setAttribute('aria-label',sound?'Sound on':'Sound off');if(sound)chime([4,6])};
fv.addEventListener('click',e=>{if(e.target===fv)close()});
document.addEventListener('keydown',e=>{if(!isOpen)return;const typing=/INPUT|TEXTAREA/.test(document.activeElement.tagName);
 if(e.key==='Escape')close();else if(!typing&&e.key==='ArrowRight')show(cur+1);else if(!typing&&e.key==='ArrowLeft')show(cur-1);
 else if(e.key==='Tab'){const f=$$('button:not(:disabled),a[href],input,textarea',fv).filter(x=>x.offsetParent&&!x.closest('[inert]'));if(!f.length)return;const a=f[0],z=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
/* swipe */
let sx=0,sy=0,sk=false;
stage.addEventListener('touchstart',e=>{sk=!e.target.closest('input,textarea');sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
stage.addEventListener('touchend',e=>{if(!sk)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.6)show(cur+(dx<0?1:-1))},{passive:true});
$$('.fp-card input,.fp-card textarea',fv).forEach(i=>i.addEventListener('focus',()=>setTimeout(()=>i.scrollIntoView({block:'center',behavior:'smooth'}),250)));

/* ---- About: reveal, tilt, floating notes ---- */
const ab=$('#about'),card=$('#aboutCard');
if(ab){const fn=$('.float-notes',ab);if(fn&&!reduce)fn.innerHTML=Array.from({length:12},(_,i)=>`<span style="--x:${(i*8.3+Math.random()*5).toFixed(0)}%;--s:${20+Math.random()*26|0}px;--t:${9+Math.random()*7|0}s;--d:${-(Math.random()*12).toFixed(1)}s;--w:${(Math.random()-.5)*120|0}px;--r:${(Math.random()-.5)*60|0}deg">${glyphs[i%4]}</span>`).join('');
 const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){ab.classList.add('in');io.disconnect();if(!reduce)setTimeout(()=>chime([2,4]),500)}}),{threshold:.25});io.observe(ab);
 if(!reduce&&matchMedia('(hover:hover)').matches){const st=$('#aboutStage');st.addEventListener('pointermove',e=>{const r=st.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`rotateY(${x*9}deg) rotateX(${-y*7}deg)`});st.addEventListener('pointerleave',()=>card.style.transform='')}}

/* ---- scroll reveals for the rest of the page ---- */
const targets=$$('.membership>*,.events>*,.gallery>.label,.gallery>h2,.gallery>.intro,.gallery figure,.apply-inner>*,.voices>*,.hero-copy>*');
targets.forEach((t,i)=>{t.classList.add('rv');t.style.setProperty('--dl',(i%4)*.09+'s')});
const io2=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io2.unobserve(en.target)}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
targets.forEach(t=>io2.observe(t));
/* table rows are built before this file runs; give them a gentle stagger */
$$('#fees tbody tr').forEach((r,i)=>{r.classList.add('rv');r.style.setProperty('--dl',i*.06+'s');io2.observe(r)});

show(0,true);
})();
