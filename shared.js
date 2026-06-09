/* ═══════════════════════════════════════════
   THE E CHRONICLES — SHARED JS
═══════════════════════════════════════════ */

// ── GOOGLE APPS SCRIPT URL ──
// This proxies Drive photos by filename (roll.jpg, 501.jpg etc.)
const DRIVE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwLLQUPlL8I9eTKJNqk4CsJp8pBfFm5GmSfOjPZxSj5i1UsPFVxr6iJ7x_yf3v8s0Og/exec';
const MEMBERS_FOLDER_ID = '1OnuO3Pg1nM-3TDwvs9AMif_4IfqUjPompzrivTFXUJuA0W-lfsyQxs2yYyoXdnkSS_k0Hc7B';
const MEMORY_FOLDER_ID  = '1C4QnE1sg3U7brdpO_OONjkVDK0mwF4QZ';

// ── NAV HTML (injected into every page) ──
const NAV_HTML = `
<nav class="nav">
  <a href="index.html" class="nav-brand">
    <div class="brand-badge">
      <svg width="22" height="22" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-logo-svg">
        <ellipse cx="17" cy="17" rx="15" ry="6" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.5" fill="none"/>
        <ellipse cx="17" cy="17" rx="15" ry="6" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.5" fill="none" transform="rotate(60 17 17)"/>
        <ellipse cx="17" cy="17" rx="15" ry="6" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.5" fill="none" transform="rotate(120 17 17)"/>
        <circle cx="32" cy="17" r="2" fill="currentColor" opacity="0.8" class="orbit-dot-1"/>
        <circle cx="24.5" cy="4.5" r="1.5" fill="currentColor" opacity="0.7" class="orbit-dot-2"/>
        <circle cx="9.5" cy="29.5" r="1.5" fill="currentColor" opacity="0.7" class="orbit-dot-3"/>
        <circle cx="17" cy="17" r="5" fill="currentColor" opacity="0.15"/>
        <circle cx="17" cy="17" r="5" stroke="currentColor" stroke-width="1.4" fill="none"/>
        <text x="17" y="21" text-anchor="middle" font-family="Georgia,serif" font-size="8" font-weight="700" fill="currentColor">E</text>
      </svg>
    </div>
    <span>The E Chronicles</span>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="members.html">Members</a></li>
    <li><a href="gallery.html">Gallery</a></li>
    <li><a href="schedule.html">Schedule</a></li>
    <li><a href="events.html">Events</a></li>
    <li><a href="notices.html">Notices</a></li>
    <li><a href="resources.html">Resources</a></li>
    <li><a href="achievements.html">Achievements</a></li>
    <li><a href="birthdays.html">Birthdays</a></li>
    <li><a href="memory-wall.html">Memory Wall</a></li>
    <li><a href="farewell.html">Farewell</a></li>
  </ul>
  <div style="display:flex;align-items:center;gap:.5rem">
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light / dark mode">🌙</button>
    <button class="nav-menu-btn" id="menuBtn" aria-label="Toggle menu">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </div>
</nav>`;

const FOOTER_HTML = `
<footer>
  <div class="footer-brand">The E Chronicles</div>
  <div class="footer-text">Section E · St. Xavier's College · Batch 2025–2027 · Science (Biology)</div>
<div class="footer-text" style="font-size:0.72rem;opacity:0.6;">Made with<span style="display:inline-block;animation:heartbeat 1.5s ease-in-out infinite;color:var(--accent);">💜</span> by <a href="https://saurav-pandey999.github.io/worldofvisions/" target="_blank" style="color:var(--accent);text-decoration:none;animation:colorShift 1.5s ease-in-out infinite;display:inline-block;">Vision-S</a></div>
</footer>`;

// ── NAV for index (root level) ──
const NAV_HTML_ROOT = `
<nav class="nav">
  <a href="index.html" class="nav-brand">
    <div class="brand-badge">
      <svg width="22" height="22" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" class="nav-logo-svg">
        <ellipse cx="17" cy="17" rx="15" ry="6" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.5" fill="none"/>
        <ellipse cx="17" cy="17" rx="15" ry="6" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.5" fill="none" transform="rotate(60 17 17)"/>
        <ellipse cx="17" cy="17" rx="15" ry="6" stroke="currentColor" stroke-width="1.2" stroke-opacity="0.5" fill="none" transform="rotate(120 17 17)"/>
        <circle cx="32" cy="17" r="2" fill="currentColor" opacity="0.8" class="orbit-dot-1"/>
        <circle cx="24.5" cy="4.5" r="1.5" fill="currentColor" opacity="0.7" class="orbit-dot-2"/>
        <circle cx="9.5" cy="29.5" r="1.5" fill="currentColor" opacity="0.7" class="orbit-dot-3"/>
        <circle cx="17" cy="17" r="5" fill="currentColor" opacity="0.15"/>
        <circle cx="17" cy="17" r="5" stroke="currentColor" stroke-width="1.4" fill="none"/>
        <text x="17" y="21" text-anchor="middle" font-family="Georgia,serif" font-size="8" font-weight="700" fill="currentColor">E</text>
      </svg>
    </div>
    <span>The E Chronicles</span>
  </a>
  <ul class="nav-links" id="navLinks">
    <li><a href="index.html" class="active">Home</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="members.html">Members</a></li>
    <li><a href="gallery.html">Gallery</a></li>
    <li><a href="schedule.html">Schedule</a></li>
    <li><a href="events.html">Events</a></li>
    <li><a href="notices.html">Notices</a></li>
    <li><a href="resources.html">Resources</a></li>
    <li><a href="achievements.html">Achievements</a></li>
    <li><a href="birthdays.html">Birthdays</a></li>
    <li><a href="memory-wall.html">Memory Wall</a></li>
  </ul>
  <div style="display:flex;align-items:center;gap:.5rem">
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light / dark mode">🌙</button>
    <button class="nav-menu-btn" id="menuBtn" aria-label="Toggle menu">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
  </div>
</nav>`;

function injectNav(isRoot = false) {
  document.body.insertAdjacentHTML('afterbegin', isRoot ? NAV_HTML_ROOT : NAV_HTML);
  document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);

  // mobile toggle
  const btn = document.getElementById('menuBtn');
  const links = document.getElementById('navLinks');
  if (btn && links) {
    btn.addEventListener('click', () => links.classList.toggle('open'));
  }

  // active link highlight
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href').endsWith(path)) a.classList.add('active');
  });

  // ── THEME TOGGLE ──
  const html = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');

  function isDark() {
    if (html.classList.contains('dark')) return true;
    if (html.classList.contains('light')) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  function applyTheme(dark) {
    html.classList.remove('dark', 'light');
    html.classList.add(dark ? 'dark' : 'light');
    toggleBtn.textContent = dark ? '☀️' : '🌙';
    toggleBtn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
    localStorage.setItem('ec_theme', dark ? 'dark' : 'light');
  }

  const saved = localStorage.getItem('ec_theme');
  if (saved) {
    applyTheme(saved === 'dark');
  } else {
    toggleBtn.textContent = isDark() ? '☀️' : '🌙';
  }

  toggleBtn.addEventListener('click', () => applyTheme(!isDark()));
}

// ── SCROLL REVEAL ──
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
}

// ── STUDENTS DATA ──
const STUDENTS = [
  { roll: 501, name: "ROHIT KUMAR YADAV",      cr: false },
  { roll: 502, name: "SAUMYA DONGOL",           cr: false },
  { roll: 503, name: "RONISHA KHADKA",          cr: false },
  { roll: 504, name: "RUBY YADAV",              cr: false },
  { roll: 505, name: "RUPAK SHRESTHA",          cr: false },
  { roll: 506, name: "RUPESH KUMAR MANDAL",     cr: false },
  { roll: 507, name: "SACHIN KUMAR YADAV",      cr: false },
  { roll: 508, name: "SADHNA RAI",              cr: false },
  { roll: 509, name: "SHAADIKA KAFLE",          cr: false },
  { roll: 510, name: "SAGAR BABU SHRESTHA",     cr: false },
  { roll: 511, name: "SAKAR NEUPANE",           cr: false },
  { roll: 512, name: "SAKAR PAUDEL",            cr: false },
  { roll: 513, name: "SAKSHAM ADHIKARI",        cr: false },
  { roll: 514, name: "SAKSHAM THAPA",           cr: false },
  { roll: 515, name: "SAKSHI YADAV",            cr: false },
  { roll: 516, name: "SAKSHYAM POUDEL",         cr: false },
  { roll: 517, name: "SAMBHAV PANDEY",          cr: false },
  { roll: 518, name: "SAMIKSHYA GHALE",         cr: false },
  { roll: 519, name: "SAMIN ROKAYA",            cr: false },
  { roll: 520, name: "SAMIP POUDEL",            cr: false },
  { roll: 521, name: "SAMIR KC",                cr: false },
  { roll: 522, name: "SAMPADA POUDEL",          cr: false },
  { roll: 523, name: "SAMRIDDHA MANDAL",        cr: false },
  { roll: 524, name: "SAMRIDDHI KARKI",         cr: false },
  { roll: 525, name: "SAMRIDDHI PANT",          cr: false },
  { roll: 526, name: "SAMRIDH SINGH",           cr: false },
  { roll: 527, name: "SANDESH SAH",             cr: false },
  { roll: 528, name: "SANDIP KC",               cr: false },
  { roll: 529, name: "SANSAR KAPHLE",           cr: false },
  { roll: 530, name: "SANTOSH KUMAR MANDAL",    cr: false },
  { roll: 531, name: "SAPEKSH MAHATO",          cr: false },
  { roll: 532, name: "SARTHAK KAFLE",           cr: false },
  { roll: 533, name: "SATISH SUBEDI",           cr: false },
  { roll: 534, name: "SAUGAT NEPAL",            cr: false },
  { roll: 535, name: "SAUKHIN BARAL",           cr: false },
  { roll: 536, name: "SAURAV JHA",              cr: false },
  { roll: 537, name: "SAURAV KHANAL",           cr: false },
  { roll: 538, name: "SAURAV KUMAR YADAV",      cr: false },
  { roll: 539, name: "SHASHANK YADAV",          cr: false },
  { roll: 540, name: "SAURAV PANDEY",           cr: true,  crTitle: "Class Representative" },
  { roll: 541, name: "SEKHA LIMBU",             cr: false },
  { roll: 542, name: "SHAMBHABI GHIMIRE",       cr: false },
  { roll: 543, name: "SHISHIR BHURTEL",         cr: false },
  { roll: 544, name: "SHISHIR JUNG RANA",       cr: false },
  { roll: 545, name: "SHISHIR KHANAL",          cr: false },
  { roll: 546, name: "SHIVA THARU CHAUDHARY",   cr: false },
  { roll: 547, name: "SHOVANA KARKI",           cr: false },
  { roll: 548, name: "SHREEJI POKHREL",         cr: true,  crTitle: "Class Representative" },
  { roll: 549, name: "SHREESAK PANDEY",         cr: false },
  { roll: 550, name: "SHREYANKA THAPALIYA",     cr: false },
  { roll: 551, name: "SHREYA TAMANG",           cr: false },
  { roll: 552, name: "SHREYNA SHRESTHA",        cr: false },
  { roll: 553, name: "RAVI SHANKAR MAHATO",     cr: false },
  { roll: 554, name: "SACHIN B.K.",             cr: false },
  { roll: 555, name: "SAURAV LUITEL",           cr: false },
  { roll: 556, name: "SAURAV NEUPANE",          cr: false },
];

// ── DETAILED STUDENT PROFILES ──
const STUDENT_PROFILES = {
  503: {
    photo: "https://drive.google.com/uc?export=view&id=1hL5rHvvijCTbA4ZQVf3JVwx9HU82vdIE",
    quote: "Friendly, chill and always learning",
    experience: "Mix of learning, laughter, memories, and growing as a person",
    wantsManagement: false,
    email: "ronishakhadka042@gmail.com",
    dob: { bsYear: 2065, bsMonth: 10, bsDay: 29, monthName: "Magh" }
  },
  504: {
    photo: "https://drive.google.com/uc?export=view&id=16aaLpCAkmB5K0APzFYkSxv7p62Ced2QS",
    quote: "I'm quite good at remembering birthdays guys 😅",
    experience: "I love how everyone makes me feel included and seen. I love how my friends motivate me through the ups and downs. What I love about Section E is that we're funny, supportive, and always trying to hype each other up. Our section just has a different vibe compared to others, and that's what makes it special.",
    wantsManagement: false,
    email: "rubyyadav0922@gmail.com",
    dob: { bsYear: 2066, bsMonth: 6, bsDay: 6, monthName: "Ashwin" }
  },
  510: {
    photo: "https://drive.google.com/open?id=1x10ce99NfTe1ydeVHoU0aJtr6S_eb7q2",
    quote: "Different roots, same tree. We grew in different ways but share the same foundation. We started as strangers, but we leave as a family.",
    experience: "The Secret Santa remained a lasting memory for me. And it's the best class ever. Thanks everyone for the unforgettable memories and for always lifting each other up. Shoutout to you all and you all are truly incredible!",
    wantsManagement: false,
    email: "025neb510@sxc.edu.np",
    dob: { bsYear: 2065, bsMonth: 7, bsDay: 19, monthName: "Kartik" }
  },
  516: {
    photo: "https://drive.google.com/uc?export=view&id=11807Lk1Ez5weQdJdfnQ7Z1N8E5-wUyAM",
    quote: "I just want to be unforgettable than popular — so don't forget about me 😃😂",
    experience: "U guys are the best and I had a wonderful time with everyone.",
    wantsManagement: false,
    email: "sakshyampouudel@gmail.com",
    dob: { bsYear: 2064, bsMonth: 6, bsDay: 7, monthName: "Ashwin" }
  },
  518: {
    photo: "https://drive.google.com/uc?export=view&id=1yX2nXZ8DUsNvAq2OhjPNqkSkX-b9_aXr",
    quote: "A true warrior has no enemies.",
    experience: "Secret Santa…",
    wantsManagement: false,
    email: "025neb518@sxc.edu.np",
    dob: { bsYear: 2065, bsMonth: 5, bsDay: 17, monthName: "Bhadra" }
  },
  522: {
    photo: "https://drive.google.com/uc?export=view&id=1GRjaXQmMOXweFl_xOFODmfLvQxRt1gzr",
    quote: "\"Only those who dare to fail greatly can ever achieve greatly.\"",
    experience: "I love you Section E. ❤️",
    wantsManagement: true,
    email: "025neb522@sxc.edu.np",
    dob: { bsYear: 2066, bsMonth: 1, bsDay: 30, monthName: "Baishakh" }
  },
  523: {
    photo: "https://drive.google.com/uc?export=view&id=13AOuaV4T1kWsmrc8DOPjT5SoHpxaEz6e",
    quote: "JUST DO IT GOOD.",
    experience: "I hope the experience goes beyond our expectation in Class 12.",
    wantsManagement: false,
    email: "025neb523@sxc.edu.np",
    dob: { bsYear: 2065, bsMonth: 10, bsDay: 9, monthName: "Magh" }
  },
  524: {
    photo: "https://drive.google.com/uc?export=view&id=1T9X_VF_QO--1vRO756uNdtWRS2_LxH-D",
    quote: "Learn to learn ✨",
    experience: "Section E feels like the home of different perspectives — creative minds residing together with fun, thoughtfulness, passion and unity.",
    wantsManagement: false,
    email: "025neb524@sxc.edu.np",
    dob: { bsYear: 2066, bsMonth: 6, bsDay: 29, monthName: "Ashwin" }
  },
  525: {
    photo: "https://drive.google.com/uc?export=view&id=1ENP5Fg53q8Kbj58eDnSbiBhrpD9f0Gyz",
    quote: "The resistance",
    experience: "Da coolest section imo.",
    wantsManagement: false,
    email: "025neb525@sxc.edu.np",
    dob: { bsYear: 2066, bsMonth: 7, bsDay: 9, monthName: "Kartik" }
  },
  527: {
    photo: "https://drive.google.com/uc?export=view&id=1gdRT3YUsz9TNkZQR0VekKbqJF3RTte7u",
    quote: "Sablai Pranam, Jay Siya Ram",
    experience: "Fun, memorable, motivating — full of smart people.",
    wantsManagement: false,
    email: "mesandeshsah.21@gmail.com",
    dob: { bsYear: 2067, bsMonth: 2, bsDay: 21, monthName: "Jesth" }
  },
  531: {
    photo: "https://drive.google.com/uc?export=view&id=1CGlgmwdcBzU8-kYyn_GY3OThilZjVZJQ",
    quote: "Be good with everyone, enjoy the life and travel",
    experience: "A1 experience.",
    wantsManagement: false,
    email: "025neb531@sxc.edu.np",
    dob: { bsYear: 2066, bsMonth: 6, bsDay: null, monthName: "Ashwin" }
  },
  536: {
    photo: "https://drive.google.com/uc?export=view&id=1MtLuvSpmv9PPhek91jrMGVTxYshc7miQ",
    quote: "Life's meant to be enjoyed and I am doing that",
    experience: "Greatttttttttttt — had fun treks and hikes with mates and ofc the fun in the classes are next level as well.",
    wantsManagement: false,
    email: "025neb536@sxc.edu.np",
    dob: { bsYear: 2065, bsMonth: 10, bsDay: 25, monthName: "Magh" }
  },
  543: {
    photo: "https://drive.google.com/open?id=1_puAwwcudFe29ep8NjnhztsP5xkyl0ee",
    quote: "I LOVE being one of the students of sec E. Quite blissful. Yes",
    experience: "I LOVE being one of the students of sec E. Quite blissful. Yes",
    wantsManagement: false,
    email: "025neb543@sxc.edu.np",
    dob: { bsYear: 2065, bsMonth: 10, bsDay: 4, monthName: "Magh" }
  },
  552: {
    photo: "https://drive.google.com/uc?export=view&id=1zCLNqUDypYhYIemCRaUTDc9b31f8NPYW",
    quote: "Carpe Diem",
    experience: "We've succeeded the 'family within a family' narrative so far.",
    wantsManagement: true,
    email: "shreynaashrestha@gmail.com",
    dob: { bsYear: 2066, bsMonth: 1, bsDay: 5, monthName: "Baishakh" }
  },
  540: {
    photo: "https://drive.google.com/uc?export=view&id=1m_Inr2guEhS6V3zZDcWCwD8YtepfF1Ls",
    quote: "\"Some wait for the spark. I bring the fire.\" Not just leading. Building the vision.",
    experience: "Leading Section E as Class Representative — building systems, fostering unity, and making sure everyone's voice is heard.",
    wantsManagement: true,
    email: "visionsyt99@gmail.com",
    dob: { bsYear: 2067, bsMonth: 12, bsDay: 1, monthName: "Chaitra" }
  },
   548: {
  photo: "https://drive.google.com/uc?export=view&id=1zbe2AbwKFLc0zSAkpn01YZaHVBTvn446",
  quote: "Serene 🙂‍↔️",
  experience: "👍",
  wantsManagement: false,
  email: "pokhrelshreeji07@gmail.com",
  dob: { bsYear: 2065, bsMonth: 12, bsDay: 25, monthName: "Chaitra" }
},
   533: {
  photo: "https://drive.google.com/uc?export=view&id=1HhI6hDgRNua6zkDY5FxNVRm-a4IDe6UM",
  quote: "Wanderer",
  experience: "The best",
  wantsManagement: false,
  email: "025neb533@sxc.edu.np",
  dob: { bsYear: 2065, bsMonth: 11, bsDay: 1, monthName: "Fagun" }
},
   547: {
  photo: "https://drive.google.com/uc?export=view&id=1VVWhUAt5_m5suQ1TfUp5CxR4q-KY9YxK",
  quote: "भविष्य अगाडि, मेरो भूत पछाडि छ ।",
  experience: "glad to be in such a wholesome section",
  wantsManagement: false,
  email: "025neb547@sxc.edu.np",
  dob: { bsYear: 2066, bsMonth: 11, bsDay: 20, monthName: "Fagun" }
},
   505: {
  photo: "https://drive.google.com/uc?export=view&id=1KLiotk5_A681nFz97eJP90GRDxMfmbNJ",
  quote: "You should never dance in an music which feels comfortable because it is playing with you not you are playing with the music",
  experience: "I feel curious to know more in my class",
  wantsManagement: false,
  email: "025neb505@sxc.edu.np",
  dob: { bsYear: 2066, bsMonth: 9, bsDay: 24, monthName: "Poush" }
},
551: {
  photo: "https://drive.google.com/uc?export=view&id=1k3de6nyFKBqMAKwuwSuu9gp_kIQ-fC4S",
  quote: "Don't let what you cannot do interfere with what you can do - John Wooden",
  experience: "My favorite memories are not just one moment but every moment I spend with my friends. My classroom has become my comfort zone where I can be myself and happy. I just wanna tell everyone to enjoy your +2 journey because once it's gone, it never comes back😉",
  wantsManagement: false,
  email: "shreyatamang2067@gmail.com",
  dob: { bsYear: 2067, bsMonth: 5, bsDay: 22, monthName: "Bhadra" }
},
   512: {
  photo: "https://drive.google.com/uc?export=view&id=1aBcDeFgHiJkLmNoPqRsTuVwXyZ123456",
  quote: "Live in the moment, because some memories never fade.",
  experience: "A beautiful rollercoaster of late-night assignments, laughter, and lifelong friends.",
  wantsManagement: false,
  email: "025neb512@sxc.edu.np",
  dob: { bsYear: 2066, bsMonth: 2, bsDay: 25, monthName: "Jestha" }
},
539: {
  photo: "https://drive.google.com/uc?export=view&id=1zYxWvUtSrQpOnMlKjIhGfEdCbBa654321",
  quote: "Chasing dreams and deadlines, but always down for momos.",
  experience: "SXC gave me a classroom that feels like home and memories I'll hold onto forever.",
  wantsManagement: false,
  email: "aaravsharma2066@gmail.com",
  dob: { bsYear: 2066, bsMonth: 2, bsDay: 26, monthName: "Jestha" }
}
};

// ── LOAD SITE DATA FROM GITHUB ──
// Single source of truth: data/ec-data.json in the repo.
// Uses the GitHub Contents API (not raw.githubusercontent.com) to bypass CDN cache.
const _GH_OWNER = 'visionsyt99';
const _GH_REPO  = 'SEC-E-CHRONICLES';
const _GH_FILE  = 'data/ec-data.json';

let _siteDataCache = null;

async function loadSiteData() {
  if (_siteDataCache) return _siteDataCache;
  try {
    const url = `https://api.github.com/repos/${_GH_OWNER}/${_GH_REPO}/contents/${_GH_FILE}`;
    const r = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github+json' },
      cache: 'no-store'
    });
    if (!r.ok) { console.warn('loadSiteData: GitHub returned', r.status); return {}; }
    const d = await r.json();
    const text = atob(d.content.replace(/\n/g, ''));
    _siteDataCache = JSON.parse(text);
    return _siteDataCache;
  } catch (e) {
    console.error('loadSiteData failed:', e);
    return {};
  }
}

// ── PHOTO URL HELPER ──
// Priority:
//  1. Admin-panel per-member Drive File ID (from ec-data.json memberPhotos)
//  2. Explicit photo in STUDENT_PROFILES (hardcoded)
//  3. Apps Script proxy (roll.jpg from folder)
function getDriveFolderPhotoUrl(roll, memberPhotosFromDB) {
  // 1. Admin-panel override from GitHub data
  try {
    const adminPhotos = memberPhotosFromDB || {};
    if (adminPhotos[roll] && adminPhotos[roll].trim()) {
      return `https://drive.google.com/thumbnail?id=${adminPhotos[roll].trim()}&sz=w400`;
    }
  } catch(e) {}

  // 2. Hardcoded profile photo
  const p = STUDENT_PROFILES[roll];
  if (p && p.photo) {
    const m = p.photo.match(/[?&]id=([^&]+)/) || p.photo.match(/\/d\/([^/]+)\//);
    if (m) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w400`;
    return p.photo;
  }

  // 3. Apps Script proxy: serves roll.jpg from MEMBERS_FOLDER_ID
  return `${DRIVE_SCRIPT_URL}?roll=${roll}&type=member`;
}

// Alias used by members.html (pass memberPhotos from loadSiteData if available)
function getBestPhoto(roll, memberPhotosFromDB) {
  return getDriveFolderPhotoUrl(roll, memberPhotosFromDB);
}

function getInitials(name) {
  return name.split(' ').slice(0,2).map(w => w[0]).join('');
}

// ── COUNTDOWN HELPER ──
// Correctly handles both "YYYY-MM-DD" and "YYYY-MM-DD HH:MM" event dates
function getCountdown(targetDate) {
  const now = new Date();
  // Parse: if targetDate is a Date object use it, else parse string
  let target;
  if (targetDate instanceof Date) {
    target = targetDate;
  } else {
    const s = String(targetDate).trim();
    // "2026-06-15" with no time → treat as local midnight (avoid UTC offset shift)
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y,mo,d] = s.split('-').map(Number);
      target = new Date(y, mo-1, d, 0, 0, 0);
    } else {
      target = new Date(s);
    }
  }
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0, passed: true };
  const totalSecs = Math.floor(diff / 1000);
  const days  = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins  = Math.floor((totalSecs % 3600) / 60);
  const secs  = totalSecs % 60;
  return { days, hours, mins, secs, passed: false };
}

// ── ANIMATED MESH BACKGROUND (light theme) ──
function initMeshBackground(){
  if(document.getElementById('ec-mesh-canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'ec-mesh-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');
  function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  const N = 28;
  const nodes = Array.from({length:N}, ()=>({
    x: Math.random()*window.innerWidth,
    y: Math.random()*window.innerHeight,
    vx: (Math.random()-.5)*0.45,
    vy: (Math.random()-.5)*0.45,
    r: Math.random()*2.5+1.5,
    hue: Math.random()*60+220,
  }));

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const dark = document.documentElement.classList.contains('dark');

    nodes.forEach(n=>{
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>canvas.width) n.vx*=-1;
      if(n.y<0||n.y>canvas.height) n.vy*=-1;
      n.hue = (n.hue + 0.05) % 360;
    });

    for(let i=0;i<N;i++){
      for(let j=i+1;j<N;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        const maxDist=canvas.width*0.28;
        if(dist<maxDist){
          // Dark: lower alpha so lines don't overpower the dark bg
          const alpha = dark
            ? (1-dist/maxDist)*0.12
            : (1-dist/maxDist)*0.18;
          const grad=ctx.createLinearGradient(nodes[i].x,nodes[i].y,nodes[j].x,nodes[j].y);
          // Dark: richer saturation, slightly darker lightness
          const l = dark ? '45%' : '55%';
          grad.addColorStop(0,`hsla(${nodes[i].hue},85%,${l},${alpha})`);
          grad.addColorStop(1,`hsla(${nodes[j].hue},85%,${l},${alpha})`);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.strokeStyle=grad;
          ctx.lineWidth=dist<maxDist*0.4?1.2:0.6;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n=>{
      // Dark: stronger glow since dark bg makes it pop more
      const glowAlpha  = dark ? 0.22 : 0.14;
      const dotAlpha   = dark ? 0.70 : 0.55;
      const dotL       = dark ? '65%' : '55%';
      const glow=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*7);
      glow.addColorStop(0,`hsla(${n.hue},90%,60%,${glowAlpha})`);
      glow.addColorStop(1,`hsla(${n.hue},90%,60%,0)`);
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r*7,0,Math.PI*2);
      ctx.fillStyle=glow;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=`hsla(${n.hue},85%,${dotL},${dotAlpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initMeshBackground();

});
