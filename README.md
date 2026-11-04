# Dhwani–Anantha — full-stack site

Node.js + Express + SQLite. Frontend is in `public/`, backend is `server.js`.

## Run on your computer (needs Node.js 18+ from nodejs.org)
1. Open this folder in a terminal (in VS Code: Terminal > New Terminal).
2. `npm install`
3. Copy `.env.example` to `.env` and set `ADMIN_PASSWORD` to a long password.
4. `npm start`
5. Site: http://localhost:3000   Admin: http://localhost:3000/admin

Do NOT double-click index.html. The form needs the server running.

## What it does
- Visitors apply on the site and it is saved to the database (`data/dhwani.db`).
- /admin: sign in, search, change status (new / contacted / paid / approved / rejected),
  add notes, delete, export CSV, tap a phone number to open WhatsApp.
- Protection: validation, spam trap, 8 applications/hour per IP, password-protected admin.

## Put it online (needs a Node host, NOT Netlify Drop)
Render.com or Railway.app: create a Web Service from this folder (via GitHub).
- Build: `npm install`   Start: `npm start`
- Environment: `ADMIN_PASSWORD=...` and `DB_PATH=/data/dhwani.db`
- Attach a persistent disk mounted at `/data`, otherwise applications are lost on redeploy.
Use HTTPS (hosts provide it) because the admin password is sent with each request.

## Later updates: edit `public/config.js`
whatsappGroupLink, whatsappNumber, payment links / UPI, events, fees, social, testimonials.

## Not included yet
Email/WhatsApp alerts for new applications, automatic payment confirmation (webhooks),
and member logins. Payment is manual: after someone pays, mark them "paid" in /admin.

## v2.1 additions (flyer experience)
- About section is now the flyer's "About Us" page, revealed band-by-band with shine, tilt and floating notes.
- Flyer viewer (public/flyer.js, flyer.css): opens with a staff-line curtain + chime; swipe, arrows, keys or dots to turn pages with note bursts. Page 3 is the real, fillable application form styled like the printed flyer. All "Apply / Join" buttons open it.
- Sound toggle (♪) top-right of the viewer. Flyer images are in public/assets/flyer-page-1..3.webp.

## Events (managed from /admin)
Sign in at /admin → Events tab → add, edit or delete events. They appear on the website calendar immediately
(stored in the same database). Events still listed in public/config.js are shown too, so remove them there to avoid duplicates.

## Responsive
public/responsive.css adds phone / tablet / laptop / TV layouts (loaded last). Screens 1800px+ are scaled up automatically
(1.3x at 1080p, 1.8x at 1440p, 2.4x at 4K). Works with touch, mouse, keyboard and TV remote (visible focus ring, D-pad friendly).
