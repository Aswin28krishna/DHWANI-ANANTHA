/* ============================================================
   DHWANI–ANANTHA — SITE SETTINGS
   This is the ONLY file you need to edit after launch.
   Leave a value as "" and that feature hides or falls back safely.
   ============================================================ */
window.DA_CONFIG = {

  /* WhatsApp -------------------------------------------------- */
  // Enquiry number: country code + number, digits only. e.g. "919876543210"
  whatsappNumber: "",
  // Community group invite link, e.g. "https://chat.whatsapp.com/AbCdEf123"
  whatsappGroupLink: "",

  /* Application form ------------------------------------------ */
  // Paste a Formspree / Web3Forms / Google Apps Script URL here.
  formEndpoint: "/api/apply",
  // Or, if hosting on Netlify, set true (Netlify Forms needs no endpoint).
  netlifyForms: false,
  // Used for the footer link and as a fallback if no endpoint is set.
  contactEmail: "",

  /* Payments -------------------------------------------------- */
  payment: {
    // Payment-gateway page/link (Razorpay, Cashfree, Stripe, etc.)
    defaultLink: "",
    // Optional: a different link per category. Overrides defaultLink.
    links: { Charter: "", Patron: "", Life: "", Preferred: "", Associate: "", Institutional: "", Honorary: "" },
    // Optional UPI: shows a "Pay by UPI" button on phones with the joining fee filled in.
    upiId: "", upiName: "Dhwani Anantha",
    // Shown after applying while no link is set (e.g. bank details).
    manualInstructions: "Payment details will be shared with you by the Dhwani–Anantha team."
  },

  /* Social (optional) ----------------------------------------- */
  social: { instagram: "", facebook: "", youtube: "" },

  /* Membership (from the flyer — edit here if fees change) ----- */
  membership: [
    { name: "Charter",       seats: 12,  monthly: 150, joining: 300,    onetime: 3600,    guests: 3, credits: 4 },
    { name: "Patron",        seats: 5,   monthly: 600, joining: 48000,  onetime: 240000,  guests: 5, credits: 4 },
    { name: "Life",          seats: 20,  monthly: 500, joining: 24000,  onetime: 480000,  guests: 3, credits: 4 },
    { name: "Preferred",     seats: 30,  monthly: 300, joining: 12500,  onetime: 375000,  guests: 2, credits: 3 },
    { name: "Associate",     seats: 144, monthly: 300, joining: 2400,   onetime: 345600,  guests: 1, credits: 2 },
    { name: "Institutional", seats: 5,   monthly: 600, joining: 60000,  onetime: 300000,  guests: 6, credits: 6 },
    { name: "Honorary",      seats: 5,   monthly: 150, joining: 0,      onetime: 0,       guests: 1, credits: 5 },
    { name: "Founder",       seats: 3,   monthly: null, joining: null,  onetime: null,    guests: 3, credits: 4, closed: true }
  ],

  /* Events — add one line per event. date = YYYY-MM-DD --------- */
  events: [
    // { date: "2026-12-13", title: "Monthly Singing Meet", time: "5:00 PM", place: "Venue, Thiruvananthapuram", note: "Open to members and guests." },
  ],

  /* Gallery — replace with real event photos when you have them  */
  gallery: [
    { src: "assets/flyer-page-1.webp", title: "The invitation", caption: "Sing • Connect • Heal" },
    { src: "assets/flyer-page-2.webp", title: "Categories & fees", caption: "Membership" },
    { src: "assets/flyer-page-3.webp", title: "Application form", caption: "Apply to join" }
  ],
  galleryTitle: "The flyer",
  galleryIntro: "Share it with a friend who sings, plays or simply loves music.",

  /* Testimonials — section stays hidden until you add real ones. */
  testimonials: [
    // { quote: "…", name: "Member name", category: "Charter" },
  ]
};
