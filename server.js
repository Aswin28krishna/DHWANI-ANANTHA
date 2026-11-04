require('dotenv').config();
const express=require('express'),path=require('path'),fs=require('fs'),crypto=require('crypto'),Database=require('better-sqlite3');
const PORT=process.env.PORT||3000,ADMIN=process.env.ADMIN_PASSWORD||'',DB=process.env.DB_PATH||path.join(__dirname,'data','dhwani.db');
fs.mkdirSync(path.dirname(DB),{recursive:true});
const db=new Database(DB);db.pragma('journal_mode=WAL');
db.exec(`CREATE TABLE IF NOT EXISTS applications(id INTEGER PRIMARY KEY AUTOINCREMENT,created_at TEXT DEFAULT CURRENT_TIMESTAMP,
name TEXT,age TEXT,phone TEXT,email TEXT,address TEXT,category TEXT,referrer TEXT,referrer_details TEXT,status TEXT DEFAULT 'new',notes TEXT DEFAULT '')`);
db.exec(`CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT,date TEXT NOT NULL,title TEXT NOT NULL,time TEXT DEFAULT '',place TEXT DEFAULT '',note TEXT DEFAULT '')`);
const CATS=['Charter','Patron','Life','Preferred','Associate','Institutional','Honorary'],STATUS=['new','contacted','paid','approved','rejected'];
const app=express();app.disable('x-powered-by');app.set('trust proxy',1);app.use(express.json({limit:'20kb'}));
app.use((q,s,n)=>{s.set({'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin'});n()});

/* tiny rate limit: 8 applications / hour / IP */
const hits=new Map();
const limited=ip=>{const now=Date.now(),a=(hits.get(ip)||[]).filter(t=>now-t<36e5);a.push(now);hits.set(ip,a);return a.length>8};

const clean=(v,n=200)=>String(v??'').trim().slice(0,n);
app.post('/api/apply',(q,s)=>{
 if(limited(q.ip))return s.status(429).json({ok:false,error:'Too many attempts. Please try again later.'});
 const b=q.body||{};if(b.website)return s.json({ok:true}); // honeypot
 const d={name:clean(b.name,100),age:clean(b.age,100),phone:clean(b.phone,30),email:clean(b.email,120),address:clean(b.address,400),category:clean(b.category,30),referrer:clean(b.referrer,100),referrer_details:clean(b.referrerDetails,100)};
 if(!d.name)return s.status(400).json({ok:false,error:'Name is required.'});
 if(d.phone.replace(/\D/g,'').length<10)return s.status(400).json({ok:false,error:'Enter a valid phone number.'});
 if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email))return s.status(400).json({ok:false,error:'Enter a valid email.'});
 if(!CATS.includes(d.category))return s.status(400).json({ok:false,error:'Choose a membership category.'});
 if(!b.consent)return s.status(400).json({ok:false,error:'Please confirm the declaration.'});
 const r=db.prepare(`INSERT INTO applications(name,age,phone,email,address,category,referrer,referrer_details)VALUES(@name,@age,@phone,@email,@address,@category,@referrer,@referrer_details)`).run(d);
 console.log(`New application #${r.lastInsertRowid}: ${d.name} (${d.category})`);
 s.json({ok:true,id:r.lastInsertRowid});
});

/* events: public read */
app.get('/api/events',(q,s)=>{s.set('Cache-Control','no-cache');s.json(db.prepare('SELECT id,date,title,time,place,note FROM events ORDER BY date,time').all())});

/* admin */
const auth=(q,s,n)=>{const p=String(q.get('x-admin-password')||'');
 if(!ADMIN)return s.status(503).json({error:'ADMIN_PASSWORD is not set on the server.'});
 const a=crypto.createHash('sha256').update(p).digest(),b=crypto.createHash('sha256').update(ADMIN).digest();
 if(!crypto.timingSafeEqual(a,b))return s.status(401).json({error:'Wrong password.'});n()};
app.get('/api/admin/applications',auth,(q,s)=>s.json(db.prepare('SELECT * FROM applications ORDER BY id DESC').all()));
app.patch('/api/admin/applications/:id',auth,(q,s)=>{const{status,notes}=q.body||{};
 if(status!==undefined&&!STATUS.includes(status))return s.status(400).json({error:'Bad status'});
 if(status!==undefined)db.prepare('UPDATE applications SET status=? WHERE id=?').run(status,q.params.id);
 if(notes!==undefined)db.prepare('UPDATE applications SET notes=? WHERE id=?').run(clean(notes,1000),q.params.id);s.json({ok:true})});
app.delete('/api/admin/applications/:id',auth,(q,s)=>{db.prepare('DELETE FROM applications WHERE id=?').run(q.params.id);s.json({ok:true})});
app.get('/api/admin/export.csv',auth,(q,s)=>{const rows=db.prepare('SELECT * FROM applications ORDER BY id').all();
 const k=['id','created_at','name','age','phone','email','address','category','referrer','referrer_details','status','notes'];
 const e=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
 s.type('text/csv').set('Content-Disposition','attachment; filename=applications.csv').send([k.join(',')].concat(rows.map(r=>k.map(c=>e(r[c])).join(','))).join('\n'))});

const evData=b=>({date:clean(b.date,10),title:clean(b.title,120),time:clean(b.time,40),place:clean(b.place,160),note:clean(b.note,300)});
const evOk=d=>/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&!isNaN(Date.parse(d.date))&&d.title;
app.get('/api/admin/events',auth,(q,s)=>s.json(db.prepare('SELECT * FROM events ORDER BY date DESC,time').all()));
app.post('/api/admin/events',auth,(q,s)=>{const d=evData(q.body||{});if(!evOk(d))return s.status(400).json({error:'A valid date and a title are required.'});
 const r=db.prepare('INSERT INTO events(date,title,time,place,note)VALUES(@date,@title,@time,@place,@note)').run(d);s.json({ok:true,id:r.lastInsertRowid})});
app.put('/api/admin/events/:id',auth,(q,s)=>{const d=evData(q.body||{});if(!evOk(d))return s.status(400).json({error:'A valid date and a title are required.'});
 db.prepare('UPDATE events SET date=@date,title=@title,time=@time,place=@place,note=@note WHERE id=@id').run({...d,id:q.params.id});s.json({ok:true})});
app.delete('/api/admin/events/:id',auth,(q,s)=>{db.prepare('DELETE FROM events WHERE id=?').run(q.params.id);s.json({ok:true})});

app.use(express.static(path.join(__dirname,'public'),{extensions:['html'],maxAge:'1h'}));
app.listen(PORT,()=>{console.log(`Dhwani–Anantha running on http://localhost:${PORT}  (admin: /admin)`);if(!ADMIN)console.warn('⚠ Set ADMIN_PASSWORD in .env to enable the admin dashboard.')});
