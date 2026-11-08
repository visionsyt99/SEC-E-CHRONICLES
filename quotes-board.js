/**
 * THE E CHRONICLES — OVERHEARD IN SECTION E (QUOTE BOARD)
 * St. Xavier's College | Section E | 2025–2027
 * 
 * Interactive classroom quote board:
 * - Filter by Teacher Lore, Backbench Wisdom, Lab Panic, Exam Hall, Canteen Banter
 * - Real-time keyword search & sorting (Most Reacted, Newest, Random)
 * - Hero "Quote of the Moment" with animated roll/shuffle
 * - 5 interactive live emoji reactions (😂, 💀, 🔥, ❤️, 🫡) with persistent localStorage counts
 * - 1-click clipboard copy with rich formatting & native Web Share API integration
 * - "Submit a Quote" modal with instant client-side preview & local persistence
 * - Supports integration with ec-data.json, Firebase client (ec-data-updated), and standalone mode
 * - Also provides mini-widget auto-mount for index.html (#section-e-quote-widget)
 */
(function () {
  'use strict';

  // ── SEED QUOTES (Authentic, respectful, relatable St. Xavier's / Section E lore) ──
  const DEFAULT_QUOTES = [
    {
      id: "q-101",
      text: "If you don't write units in the final numerical answer, I will assume you measured it in bananas.",
      speaker: "Physics Department",
      role: "Faculty Lore",
      category: "teachers",
      context: "Period 2 · Room 204 · Numerical Problems",
      date: "Grade 11",
      reactions: { "😂": 48, "💀": 19, "🔥": 31, "❤️": 8, "🫡": 39 }
    },
    {
      id: "q-102",
      text: "Titration is not a race to see who finishes first! That is not pale pink, that is royal purple!",
      speaker: "Chemistry Lab Instructor",
      role: "Faculty Lore",
      category: "lab",
      context: "Chemistry Practical Lab · Burette & Pipette",
      date: "Grade 11",
      reactions: { "😂": 64, "💀": 37, "🔥": 18, "❤️": 6, "🫡": 24 }
    },
    {
      id: "q-103",
      text: "Assume x. If you cannot even assume x in mathematics, how will you assume success in your life?",
      speaker: "Math Department",
      role: "Faculty Lore",
      category: "teachers",
      context: "Derivatives & Calculus Class",
      date: "Grade 12",
      reactions: { "😂": 52, "💀": 44, "🔥": 42, "❤️": 14, "🫡": 57 }
    },
    {
      id: "q-104",
      text: "Draw the diagram neatly. The frog should look like an amphibian, not an amoeba that met with an unfortunate accident.",
      speaker: "Biology Faculty",
      role: "Faculty Lore",
      category: "teachers",
      context: "Anatomy Record Book Check",
      date: "Grade 11",
      reactions: { "😂": 71, "💀": 29, "🔥": 21, "❤️": 16, "🫡": 25 }
    },
    {
      id: "q-105",
      text: "Bro, the reading is coming negative. Let's just make it positive and add a random decimal so it looks rigorously experimental.",
      speaker: "Anonymous Lab Bench #4",
      role: "Section E Student",
      category: "lab",
      context: "Screw Gauge & Vernier Caliper Lab",
      date: "Practical Session",
      reactions: { "😂": 85, "💀": 58, "🔥": 36, "❤️": 10, "🫡": 49 }
    },
    {
      id: "q-106",
      text: "Don't ask me anything right now. I memorized this derivation 90 seconds ago and it's already evaporating from my brain.",
      speaker: "Exam Hall Survivor",
      role: "Section E Student",
      category: "exams",
      context: "Hallway outside Exam Hall · 5 mins before 1st Term",
      date: "Terminal Exam",
      reactions: { "😂": 94, "💀": 72, "🔥": 28, "❤️": 19, "🫡": 66 }
    },
    {
      id: "q-107",
      text: "Tie should touch your belt buckle! Why is your collar standing up like you are shooting a South Indian action movie?",
      speaker: "Prefect / Morning Inspection",
      role: "Assembly Lore",
      category: "teachers",
      context: "Main College Gate · 8:15 AM Uniform Inspection",
      date: "Every Monday Morning",
      reactions: { "😂": 59, "💀": 25, "🔥": 22, "❤️": 9, "🫡": 34 }
    },
    {
      id: "q-108",
      text: "One plate chowmein, one samosa, four forks. Pure economic efficiency.",
      speaker: "The Canteen Syndicate",
      role: "Section E Squad",
      category: "canteen",
      context: "College Canteen · Corner Table",
      date: "Lunch Break",
      reactions: { "😂": 76, "💀": 17, "🔥": 51, "❤️": 42, "🫡": 33 }
    },
    {
      id: "q-109",
      text: "Can someone please cough loudly every time Sir turns toward the blackboard so we can pass the assignment?",
      speaker: "Last Bench Strategist",
      role: "Section E Student",
      category: "backbench",
      context: "Back Row · Period 5",
      date: "Daily Strategy",
      reactions: { "😂": 82, "💀": 41, "🔥": 46, "❤️": 13, "🫡": 53 }
    },
    {
      id: "q-110",
      text: "Is this derivation in the NEB syllabus or is it strictly in Sir's spiritual imagination?",
      speaker: "Confused Scholar",
      role: "Section E Student",
      category: "exams",
      context: "After 40 mins of theoretical astrophysics",
      date: "Grade 12",
      reactions: { "😂": 97, "💀": 68, "🔥": 39, "❤️": 15, "🫡": 61 }
    },
    {
      id: "q-111",
      text: "I can hear someone turning a page in the 5th bench! You should not even be thinking that loudly during reading time!",
      speaker: "English Literature Teacher",
      role: "Faculty Lore",
      category: "teachers",
      context: "Silent Reading Period",
      date: "Grade 11",
      reactions: { "😂": 53, "💀": 22, "🔥": 16, "❤️": 7, "🫡": 31 }
    },
    {
      id: "q-112",
      text: "Who borrowed my blue Reynolds pen during 1st period? I have a particular set of skills. I will find you, and I will borrow your scientific calculator.",
      speaker: "Desperate Note-Taker",
      role: "Section E Student",
      category: "backbench",
      context: "Window Bench · Period 4",
      date: "Class Mystery",
      reactions: { "😂": 69, "💀": 21, "🔥": 34, "❤️": 14, "🫡": 38 }
    },
    {
      id: "q-113",
      text: "There are two types of students in Section E: those who start practical files 2 weeks early, and those who borrow their file at 7:45 AM on submission day.",
      speaker: "Class Observer",
      role: "Section E Lore",
      category: "lab",
      context: "Practical Submission Morning",
      date: "Grade 12",
      reactions: { "😂": 104, "💀": 77, "🔥": 58, "❤️": 22, "🫡": 83 }
    },
    {
      id: "q-114",
      text: "Bell has rung for you, not for me. Until I put down the chalk, nobody moves an inch.",
      speaker: "Chemistry Faculty",
      role: "Faculty Lore",
      category: "teachers",
      context: "Period 4 · 12:44 PM (Lunch bell ringing)",
      date: "Classic Moment",
      reactions: { "😂": 88, "💀": 62, "🔥": 27, "❤️": 11, "🫡": 45 }
    }
  ];

  const CATEGORIES = [
    { key: "all", label: "All Quotes", icon: "💬" },
    { key: "teachers", label: "Teacher Lore", icon: "👨‍🏫" },
    { key: "backbench", label: "Backbenchers", icon: "🎒" },
    { key: "lab", label: "Lab Panic", icon: "🧪" },
    { key: "exams", label: "Exam Hall", icon: "📝" },
    { key: "canteen", label: "Canteen Banter", icon: "☕" }
  ];

  const STORAGE_KEY_REACTIONS = 'ec_quote_reactions_v1';
  const STORAGE_KEY_SUBMITTED = 'ec_quote_submitted_v1';

  // State
  let allQuotes = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'popular'; // popular | newest | random
  let featuredQuoteIndex = 0;

  /* ── CSS INJECTION (Scoped & Theme Responsive) ── */
  function injectStyles() {
    if (document.getElementById('ec-quote-board-styles')) return;
    const style = document.createElement('style');
    style.id = 'ec-quote-board-styles';
    style.textContent = `
      /* ── SECTION E QUOTE BOARD STYLES ── */
      .qb-wrap {
        max-width: 1150px;
        margin: 0 auto;
        padding: 2.5rem 1.5rem 5rem;
        font-family: var(--font-body, 'DM Sans', system-ui, -apple-system, sans-serif);
        color: var(--text, #1a0f3a);
      }

      /* Page Hero Header */
      .qb-hero-header {
        text-align: center;
        margin-bottom: 2.8rem;
        position: relative;
      }
      .qb-badge-label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--font-mono, 'DM Mono', monospace);
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--accent, #6c3fff);
        background: var(--accent-light, rgba(108,63,255,0.08));
        border: 1px solid var(--border, rgba(120,80,220,0.18));
        padding: 0.4rem 0.9rem;
        border-radius: 999px;
        margin-bottom: 0.9rem;
      }
      .qb-main-title {
        font-family: var(--font-display, 'Syne', sans-serif);
        font-size: clamp(2.2rem, 5vw, 3.4rem);
        font-weight: 800;
        line-height: 1.15;
        letter-spacing: -0.02em;
        margin: 0 0 0.8rem;
        background: linear-gradient(135deg, var(--text, #1a0f3a) 30%, var(--accent, #6c3fff) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .qb-subtitle {
        font-size: 1.05rem;
        color: var(--text2, #4a3d70);
        max-width: 640px;
        margin: 0 auto 1.6rem;
        line-height: 1.6;
      }

      /* Action Bar: Submit & Stats */
      .qb-action-row {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
      .qb-btn-submit {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--accent, #6c3fff);
        color: #ffffff;
        font-weight: 600;
        font-size: 0.95rem;
        padding: 0.75rem 1.4rem;
        border-radius: var(--radius, 14px);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(108,63,255,0.3);
        transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
      }
      .qb-btn-submit:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(108,63,255,0.45);
        background: var(--accent2, #a020f0);
      }
      .qb-stats-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.7rem 1.1rem;
        background: var(--surface2, #f3f0ff);
        border: 1px solid var(--border, rgba(120,80,220,0.15));
        border-radius: var(--radius, 14px);
        font-size: 0.9rem;
        color: var(--text2, #4a3d70);
        font-weight: 500;
      }

      /* Featured Quote of the Moment */
      .qb-featured-card {
        background: linear-gradient(135deg, var(--surface, #ffffff), var(--surface2, #f9f8ff));
        border: 1.5px solid var(--border, rgba(120,80,220,0.22));
        border-radius: 20px;
        padding: 2.2rem;
        margin-bottom: 3rem;
        position: relative;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(108,63,255,0.06);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
      }
      .qb-featured-card::before {
        content: '“';
        position: absolute;
        top: -20px;
        right: 25px;
        font-family: var(--font-serif, 'Cormorant Garamond', 'Fraunces', serif);
        font-size: 11rem;
        line-height: 1;
        color: var(--accent, #6c3fff);
        opacity: 0.07;
        pointer-events: none;
        user-select: none;
      }
      .qb-featured-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.2rem;
        flex-wrap: wrap;
        gap: 0.8rem;
      }
      .qb-featured-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        padding: 0.3rem 0.75rem;
        border-radius: 999px;
        background: var(--gold-light, rgba(176,125,16,0.12));
        color: var(--gold, #b07d10);
        border: 1px solid rgba(176,125,16,0.25);
      }
      .qb-btn-shuffle {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        background: transparent;
        border: 1px solid var(--border, rgba(120,80,220,0.25));
        padding: 0.45rem 0.9rem;
        border-radius: 999px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--accent, #6c3fff);
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .qb-btn-shuffle:hover {
        background: var(--accent-light, rgba(108,63,255,0.1));
        transform: rotate(2deg) scale(1.02);
      }
      .qb-featured-text {
        font-family: var(--font-serif, 'Fraunces', 'Cormorant Garamond', serif);
        font-size: clamp(1.3rem, 2.8vw, 1.85rem);
        font-style: italic;
        line-height: 1.45;
        color: var(--text, #1a0f3a);
        margin: 0 0 1.4rem;
        position: relative;
        z-index: 1;
      }
      .qb-featured-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        border-top: 1px solid var(--border, rgba(120,80,220,0.1));
        padding-top: 1.2rem;
      }
      .qb-speaker-info {
        display: flex;
        align-items: center;
        gap: 0.8rem;
      }
      .qb-avatar-circle {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--accent, #6c3fff), var(--accent2, #a020f0));
        color: #ffffff;
        font-family: var(--font-display, 'Syne', sans-serif);
        font-weight: 700;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 3px 10px rgba(108,63,255,0.25);
      }
      .qb-speaker-name {
        font-weight: 700;
        font-size: 1.05rem;
        color: var(--text, #1a0f3a);
      }
      .qb-speaker-role {
        font-size: 0.82rem;
        color: var(--text2, #4a3d70);
      }

      /* Filter & Controls Toolbar */
      .qb-toolbar {
        display: flex;
        flex-direction: column;
        gap: 1.2rem;
        margin-bottom: 2rem;
      }
      .qb-category-scroll {
        display: flex;
        gap: 0.6rem;
        overflow-x: auto;
        padding-bottom: 0.4rem;
        scrollbar-width: thin;
      }
      .qb-cat-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.6rem 1.1rem;
        border-radius: 999px;
        border: 1px solid var(--border, rgba(120,80,220,0.18));
        background: var(--surface, #ffffff);
        color: var(--text2, #4a3d70);
        font-size: 0.88rem;
        font-weight: 600;
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
      }
      .qb-cat-pill:hover {
        border-color: var(--accent, #6c3fff);
        color: var(--accent, #6c3fff);
      }
      .qb-cat-pill.active {
        background: var(--accent, #6c3fff);
        color: #ffffff;
        border-color: var(--accent, #6c3fff);
        box-shadow: 0 4px 14px rgba(108,63,255,0.25);
      }

      .qb-controls-row {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        align-items: center;
      }
      .qb-search-box {
        flex: 1;
        min-width: 240px;
        position: relative;
      }
      .qb-search-input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.5rem;
        background: var(--surface, #ffffff);
        border: 1px solid var(--border, rgba(120,80,220,0.2));
        border-radius: var(--radius, 14px);
        color: var(--text, #1a0f3a);
        font-size: 0.95rem;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;
      }
      .qb-search-input:focus {
        border-color: var(--accent, #6c3fff);
        box-shadow: 0 0 0 3px rgba(108,63,255,0.12);
      }
      .qb-search-icon {
        position: absolute;
        left: 0.9rem;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.5;
        font-size: 0.95rem;
        pointer-events: none;
      }
      .qb-sort-select {
        padding: 0.75rem 1.2rem;
        background: var(--surface, #ffffff);
        border: 1px solid var(--border, rgba(120,80,220,0.2));
        border-radius: var(--radius, 14px);
        color: var(--text2, #4a3d70);
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        outline: none;
      }

      /* Quotes Grid */
      .qb-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        gap: 1.5rem;
      }
      .qb-card {
        background: var(--surface, #ffffff);
        border: 1px solid var(--border, rgba(120,80,220,0.15));
        border-radius: 18px;
        padding: 1.6rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.02);
      }
      .qb-card:hover {
        transform: translateY(-4px);
        border-color: var(--border-hover, rgba(120,80,220,0.35));
        box-shadow: 0 10px 25px rgba(108,63,255,0.08);
      }
      .qb-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .qb-badge-cat {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.25rem 0.65rem;
        border-radius: 999px;
        background: var(--accent-light, rgba(108,63,255,0.08));
        color: var(--accent, #6c3fff);
      }
      .qb-badge-user-submitted {
        font-size: 0.72rem;
        font-weight: 700;
        padding: 0.25rem 0.65rem;
        border-radius: 999px;
        background: rgba(16,185,129,0.12);
        color: #059669;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
      }
      .qb-card-text {
        font-family: var(--font-serif, 'Fraunces', 'Cormorant Garamond', Georgia, serif);
        font-size: 1.15rem;
        line-height: 1.5;
        color: var(--text, #1a0f3a);
        margin: 0 0 1.2rem;
        font-style: italic;
        position: relative;
      }
      .qb-card-text::before {
        content: '“';
        font-size: 1.6rem;
        line-height: 0;
        margin-right: 0.25rem;
        color: var(--accent, #6c3fff);
        vertical-align: -0.25rem;
      }
      .qb-card-text::after {
        content: '”';
        font-size: 1.6rem;
        line-height: 0;
        margin-left: 0.15rem;
        color: var(--accent, #6c3fff);
        vertical-align: -0.25rem;
      }

      .qb-card-attribution {
        margin-bottom: 1.2rem;
      }
      .qb-attr-name {
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--text, #1a0f3a);
      }
      .qb-attr-context {
        font-size: 0.8rem;
        color: var(--text3, #9080b8);
        margin-top: 0.2rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
      }

      /* Reactions & Card Footer */
      .qb-card-footer {
        border-top: 1px solid var(--border, rgba(120,80,220,0.1));
        padding-top: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.6rem;
      }
      .qb-reaction-group {
        display: flex;
        gap: 0.35rem;
        flex-wrap: wrap;
      }
      .qb-rxn-btn {
        background: var(--surface2, #f3f0ff);
        border: 1px solid var(--border, rgba(120,80,220,0.12));
        border-radius: 999px;
        padding: 0.25rem 0.55rem;
        font-size: 0.82rem;
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        cursor: pointer;
        color: var(--text2, #4a3d70);
        font-weight: 600;
        transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
        user-select: none;
      }
      .qb-rxn-btn:hover {
        transform: scale(1.08);
        border-color: var(--accent, #6c3fff);
      }
      .qb-rxn-btn.user-reacted {
        background: var(--accent-light, rgba(108,63,255,0.15));
        border-color: var(--accent, #6c3fff);
        color: var(--accent, #6c3fff);
      }

      .qb-card-tools {
        display: flex;
        gap: 0.4rem;
      }
      .qb-tool-btn {
        background: transparent;
        border: 1px solid var(--border, rgba(120,80,220,0.15));
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text2, #4a3d70);
        font-size: 0.85rem;
        transition: all 0.2s ease;
      }
      .qb-tool-btn:hover {
        background: var(--surface2, #f3f0ff);
        color: var(--accent, #6c3fff);
        border-color: var(--accent, #6c3fff);
      }

      /* Empty State */
      .qb-empty-box {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 1.5rem;
        background: var(--surface, #ffffff);
        border: 1px dashed var(--border, rgba(120,80,220,0.25));
        border-radius: 20px;
      }
      .qb-empty-icon {
        font-size: 2.8rem;
        margin-bottom: 0.8rem;
      }

      /* Modal for submitting quotes */
      .qb-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(10, 8, 25, 0.65);
        backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.2rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
      }
      .qb-modal-backdrop.open {
        opacity: 1;
        pointer-events: auto;
      }
      .qb-modal-card {
        background: var(--surface, #ffffff);
        border: 1px solid var(--border, rgba(120,80,220,0.25));
        border-radius: 22px;
        max-width: 540px;
        width: 100%;
        padding: 2.2rem;
        box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        transform: translateY(20px) scale(0.97);
        transition: transform 0.25s ease;
        position: relative;
        max-height: 90vh;
        overflow-y: auto;
      }
      .qb-modal-backdrop.open .qb-modal-card {
        transform: translateY(0) scale(1);
      }
      .qb-modal-close {
        position: absolute;
        top: 1.2rem;
        right: 1.2rem;
        background: var(--surface2, #f3f0ff);
        border: none;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text2, #4a3d70);
      }
      .qb-form-group {
        margin-bottom: 1.3rem;
      }
      .qb-form-label {
        display: block;
        font-size: 0.88rem;
        font-weight: 600;
        color: var(--text, #1a0f3a);
        margin-bottom: 0.45rem;
      }
      .qb-form-input, .qb-form-textarea, .qb-form-select {
        width: 100%;
        box-sizing: border-box;
        padding: 0.75rem 1rem;
        background: var(--surface2, #f3f0ff);
        border: 1px solid var(--border, rgba(120,80,220,0.2));
        border-radius: 12px;
        font-family: inherit;
        font-size: 0.95rem;
        color: var(--text, #1a0f3a);
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .qb-form-input:focus, .qb-form-textarea:focus, .qb-form-select:focus {
        border-color: var(--accent, #6c3fff);
        box-shadow: 0 0 0 3px rgba(108,63,255,0.15);
      }
      .qb-form-textarea {
        resize: vertical;
        min-height: 90px;
      }

      /* Toast Notification */
      .qb-toast {
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: #111827;
        color: #ffffff;
        padding: 0.85rem 1.4rem;
        border-radius: 999px;
        font-size: 0.9rem;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10001;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        pointer-events: none;
      }
      .qb-toast.show {
        transform: translateY(0);
        opacity: 1;
      }

      /* Compact Homepage Widget (#section-e-quote-widget) */
      .qb-widget {
        background: var(--surface, #ffffff);
        border: 1px solid var(--border, rgba(120,80,220,0.18));
        border-radius: 18px;
        padding: 1.5rem;
        position: relative;
        box-shadow: 0 4px 20px rgba(108,63,255,0.05);
      }
      .qb-widget-tag {
        font-family: var(--font-mono, monospace);
        font-size: 0.72rem;
        font-weight: 700;
        color: var(--accent, #6c3fff);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        margin-bottom: 0.6rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .qb-widget-quote {
        font-family: var(--font-serif, serif);
        font-style: italic;
        font-size: 1.12rem;
        line-height: 1.45;
        color: var(--text, #1a0f3a);
        margin: 0 0 0.8rem;
      }
      .qb-widget-author {
        font-size: 0.85rem;
        color: var(--text2, #4a3d70);
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .qb-widget-link {
        color: var(--accent, #6c3fff);
        text-decoration: none;
        font-weight: 700;
        font-size: 0.82rem;
      }
      .qb-widget-link:hover {
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── LOCALSTORAGE HELPERS ── */
  function getStoredReactions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_REACTIONS) || '{}');
    } catch (e) {
      return {};
    }
  }

  function saveStoredReactions(data) {
    try {
      localStorage.setItem(STORAGE_KEY_REACTIONS, JSON.stringify(data));
    } catch (e) {}
  }

  function getSubmittedQuotes() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMITTED) || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveSubmittedQuote(quote) {
    try {
      const existing = getSubmittedQuotes();
      existing.unshift(quote);
      localStorage.setItem(STORAGE_KEY_SUBMITTED, JSON.stringify(existing));
    } catch (e) {}
  }

  /* ── TOAST MESSAGE ── */
  let toastEl = null;
  function showToast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'qb-toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = `<span>✨</span> <span>${escapeHtml(msg)}</span>`;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ── COMBINE DATA SOURCES ── */
  function loadAllQuotes() {
    // 1. Check if siteData has quotes
    let remoteQuotes = [];
    if (window._siteData && Array.isArray(window._siteData.quotes)) {
      remoteQuotes = window._siteData.quotes;
    }

    // 2. Client-submitted quotes
    const userSubmitted = getSubmittedQuotes();

    // 3. Fallback / Seed quotes
    const base = remoteQuotes.length ? remoteQuotes : DEFAULT_QUOTES;

    // Deduplicate by ID
    const map = new Map();
    userSubmitted.forEach(q => map.set(q.id, { ...q, isUserSubmitted: true }));
    base.forEach(q => {
      if (!map.has(q.id)) {
        map.set(q.id, { ...q });
      }
    });

    // Merge with user's local reactions
    const userReactions = getStoredReactions();
    const list = Array.from(map.values()).map(q => {
      const rxns = { ...(q.reactions || { "😂": 0, "💀": 0, "🔥": 0, "❤️": 0, "🫡": 0 }) };
      const userVotes = userReactions[q.id] || [];
      return {
        ...q,
        reactions: rxns,
        userVotes: userVotes
      };
    });

    return list;
  }

  /* ── RENDER FULL QUOTE BOARD ── */
  function renderBoard(root) {
    allQuotes = loadAllQuotes();

    root.innerHTML = `
      <div class="qb-wrap">
        <!-- Hero Header -->
        <header class="qb-hero-header">
          <div class="qb-badge-label">
            <span>🗣️</span> Overheard in Class
          </div>
          <h1 class="qb-main-title">Overheard in Section E</h1>
          <p class="qb-subtitle">
            The legendary teacher lore, backbench survival tactics, lab chaos, and canteen debates that define St. Xavier's Section E.
          </p>
          <div class="qb-action-row">
            <button class="qb-btn-submit" id="qb-open-submit-modal">
              <span>✍️</span> Submit a Quote
            </button>
            <div class="qb-stats-pill">
              <span>📚</span> <strong id="qb-total-count">${allQuotes.length}</strong> quotes immortalized
            </div>
          </div>
        </header>

        <!-- Featured Quote of the Moment -->
        <section class="qb-featured-card" id="qb-featured-container">
          <!-- Populated dynamically -->
        </section>

        <!-- Toolbar: Filters, Search & Sort -->
        <div class="qb-toolbar">
          <div class="qb-category-scroll" id="qb-category-bar">
            ${CATEGORIES.map(c => `
              <button class="qb-cat-pill ${c.key === currentCategory ? 'active' : ''}" data-cat="${c.key}">
                <span>${c.icon}</span> <span>${c.label}</span>
              </button>
            `).join('')}
          </div>

          <div class="qb-controls-row">
            <div class="qb-search-box">
              <span class="qb-search-icon">🔍</span>
              <input type="text" class="qb-search-input" id="qb-search" placeholder="Search quotes, teachers, classmates, or room..."/>
            </div>
            <select class="qb-sort-select" id="qb-sort">
              <option value="popular">🔥 Most Reacted</option>
              <option value="newest">⏱️ Newest First</option>
              <option value="random">🎲 Random Shuffle</option>
            </select>
          </div>
        </div>

        <!-- Quotes Grid -->
        <div class="qb-grid" id="qb-cards-grid"></div>

        <!-- Submit Modal -->
        <div class="qb-modal-backdrop" id="qb-modal">
          <div class="qb-modal-card">
            <button class="qb-modal-close" id="qb-modal-close-btn">&times;</button>
            <h2 style="font-family:var(--font-display, 'Syne', sans-serif); margin-top:0; font-size:1.45rem; color:var(--text, #1a0f3a);">
              ✍️ Submit a Section E Quote
            </h2>
            <p style="font-size:0.88rem; color:var(--text2, #4a3d70); margin-bottom:1.4rem;">
              Did a teacher or classmate say something legendary today? Add it to the section archives!
            </p>

            <form id="qb-submit-form">
              <div class="qb-form-group">
                <label class="qb-form-label">The Quote *</label>
                <textarea class="qb-form-textarea" id="qb-input-quote" required placeholder="“If you don't write units, I will assume you measured in bananas...”"></textarea>
              </div>

              <div class="qb-form-group">
                <label class="qb-form-label">Who said it? *</label>
                <input type="text" class="qb-form-input" id="qb-input-speaker" required placeholder="e.g. Physics Department, Sharma Sir, Rohan, Backbencher #3"/>
              </div>

              <div class="qb-form-group">
                <label class="qb-form-label">Category</label>
                <select class="qb-form-select" id="qb-input-category">
                  <option value="teachers">👨‍🏫 Teacher Lore</option>
                  <option value="backbench">🎒 Backbenchers</option>
                  <option value="lab">🧪 Lab Panic</option>
                  <option value="exams">📝 Exam Hall</option>
                  <option value="canteen">☕ Canteen Banter</option>
                </select>
              </div>

              <div class="qb-form-group">
                <label class="qb-form-label">Context / Occasion / Location (optional)</label>
                <input type="text" class="qb-form-input" id="qb-input-context" placeholder="e.g. Period 3 · Room 204 · During Titration Practical"/>
              </div>

              <div class="qb-form-group">
                <label class="qb-form-label">Your Name / Roll No (optional)</label>
                <input type="text" class="qb-form-input" id="qb-input-submitter" placeholder="Leave empty for anonymous"/>
              </div>

              <button type="submit" class="qb-btn-submit" style="width:100%; justify-content:center; padding:0.85rem;">
                Post to Section E Quote Board
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Attach Event Handlers
    attachBoardEvents(root);
    renderFeaturedQuote();
    filterAndRenderCards();
  }

  /* ── FEATURED / SHUFFLE QUOTE ── */
  function renderFeaturedQuote() {
    const container = document.getElementById('qb-featured-container');
    if (!container || !allQuotes.length) return;

    if (featuredQuoteIndex >= allQuotes.length) featuredQuoteIndex = 0;
    const q = allQuotes[featuredQuoteIndex];
    const initials = (q.speaker || 'E').slice(0, 2).toUpperCase();

    container.innerHTML = `
      <div class="qb-featured-top">
        <span class="qb-featured-tag">🌟 Quote of the Moment</span>
        <button class="qb-btn-shuffle" id="qb-featured-roll-btn">
          <span>🎲</span> Roll another
        </button>
      </div>
      <blockquote class="qb-featured-text">
        ${escapeHtml(q.text)}
      </blockquote>
      <div class="qb-featured-meta">
        <div class="qb-speaker-info">
          <div class="qb-avatar-circle">${escapeHtml(initials)}</div>
          <div>
            <div class="qb-speaker-name">${escapeHtml(q.speaker)}</div>
            <div class="qb-speaker-role">${escapeHtml(q.context || q.role || 'Section E Lore')}</div>
          </div>
        </div>
        <button class="qb-btn-shuffle" style="font-size:0.82rem;" data-copy-id="${q.id}">
          <span>📋</span> Copy
        </button>
      </div>
    `;

    const rollBtn = document.getElementById('qb-featured-roll-btn');
    if (rollBtn) {
      rollBtn.addEventListener('click', () => {
        featuredQuoteIndex = (featuredQuoteIndex + 1) % allQuotes.length;
        renderFeaturedQuote();
      });
    }

    const copyBtn = container.querySelector('[data-copy-id]');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => copyQuote(q));
    }
  }

  /* ── FILTER & SORT & RENDER ── */
  function filterAndRenderCards() {
    const grid = document.getElementById('qb-cards-grid');
    if (!grid) return;

    let list = allQuotes.filter(q => {
      // Category check
      if (currentCategory !== 'all' && q.category !== currentCategory) return false;
      // Search check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inText = (q.text || '').toLowerCase().includes(query);
        const inSpeaker = (q.speaker || '').toLowerCase().includes(query);
        const inContext = (q.context || '').toLowerCase().includes(query);
        if (!inText && !inSpeaker && !inContext) return false;
      }
      return true;
    });

    // Sorting
    if (currentSort === 'popular') {
      list.sort((a, b) => {
        const sumA = Object.values(a.reactions || {}).reduce((x, y) => x + y, 0);
        const sumB = Object.values(b.reactions || {}).reduce((x, y) => x + y, 0);
        return sumB - sumA;
      });
    } else if (currentSort === 'newest') {
      list.reverse();
    } else if (currentSort === 'random') {
      list.sort(() => Math.random() - 0.5);
    }

    if (!list.length) {
      grid.innerHTML = `
        <div class="qb-empty-box">
          <div class="qb-empty-icon">🦗</div>
          <h3 style="margin:0 0 0.5rem; color:var(--text, #1a0f3a);">No quotes found</h3>
          <p style="color:var(--text2, #4a3d70); margin:0;">
            No one has uttered that yet! Try searching something else or submit the first one.
          </p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(q => {
      const rxns = q.reactions || { "😂": 0, "💀": 0, "🔥": 0, "❤️": 0, "🫡": 0 };
      const userVotes = q.userVotes || [];

      return `
        <article class="qb-card" id="card-${q.id}">
          <div>
            <div class="qb-card-header">
              <span class="qb-badge-cat">${getCategoryLabel(q.category)}</span>
              ${q.isUserSubmitted ? `<span class="qb-badge-user-submitted">✨ Freshly Added</span>` : ''}
            </div>
            <p class="qb-card-text">${escapeHtml(q.text)}</p>
            <div class="qb-card-attribution">
              <div class="qb-attr-name">— ${escapeHtml(q.speaker)}</div>
              ${q.context ? `<div class="qb-attr-context"><span>📍</span> <span>${escapeHtml(q.context)}</span></div>` : ''}
            </div>
          </div>

          <footer class="qb-card-footer">
            <div class="qb-reaction-group">
              ${['😂', '💀', '🔥', '❤️', '🫡'].map(emoji => {
                const count = rxns[emoji] || 0;
                const hasVoted = userVotes.includes(emoji);
                return `
                  <button class="qb-rxn-btn ${hasVoted ? 'user-reacted' : ''}" data-quote-id="${q.id}" data-emoji="${emoji}">
                    <span>${emoji}</span>
                    <span>${count}</span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="qb-card-tools">
              <button class="qb-tool-btn" title="Copy to clipboard" data-copy-id="${q.id}">📋</button>
              <button class="qb-tool-btn" title="Share quote" data-share-id="${q.id}">🚀</button>
            </div>
          </footer>
        </article>
      `;
    }).join('');

    // Attach reaction & tool listeners
    grid.querySelectorAll('.qb-rxn-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.quoteId;
        const emoji = btn.dataset.emoji;
        handleReaction(qid, emoji);
      });
    });

    grid.querySelectorAll('[data-copy-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.copyId;
        const q = allQuotes.find(x => x.id === qid);
        if (q) copyQuote(q);
      });
    });

    grid.querySelectorAll('[data-share-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.shareId;
        const q = allQuotes.find(x => x.id === qid);
        if (q) shareQuote(q);
      });
    });
  }

  function getCategoryLabel(key) {
    const c = CATEGORIES.find(x => x.key === key);
    return c ? `${c.icon} ${c.label}` : '💬 Section E';
  }

  /* ── REACTIONS HANDLER ── */
  function handleReaction(quoteId, emoji) {
    const q = allQuotes.find(x => x.id === quoteId);
    if (!q) return;

    const userReactions = getStoredReactions();
    if (!userReactions[quoteId]) userReactions[quoteId] = [];

    if (!q.reactions) q.reactions = {};
    if (!q.reactions[emoji]) q.reactions[emoji] = 0;

    if (userReactions[quoteId].includes(emoji)) {
      // Undo reaction
      userReactions[quoteId] = userReactions[quoteId].filter(e => e !== emoji);
      q.reactions[emoji] = Math.max(0, q.reactions[emoji] - 1);
    } else {
      // Add reaction
      userReactions[quoteId].push(emoji);
      q.reactions[emoji] += 1;
    }

    saveStoredReactions(userReactions);
    q.userVotes = userReactions[quoteId];

    // Re-render card or grid
    filterAndRenderCards();
  }

  /* ── COPY & SHARE ── */
  function copyQuote(q) {
    const formatted = `“${q.text}”\n— ${q.speaker}${q.context ? ` (${q.context})` : ''}\n[Overheard in Section E // The E Chronicles]`;
    navigator.clipboard.writeText(formatted).then(() => {
      showToast('Quote copied to clipboard! Ready to share 📋');
    }).catch(() => {
      showToast('Copied!');
    });
  }

  function shareQuote(q) {
    const formatted = `“${q.text}” — ${q.speaker} (${q.context || 'St. Xavier\'s Section E'})`;
    if (navigator.share) {
      navigator.share({
        title: 'Overheard in Section E',
        text: formatted,
        url: window.location.href
      }).catch(() => {});
    } else {
      copyQuote(q);
    }
  }

  /* ── ATTACH BOARD EVENTS ── */
  function attachBoardEvents(root) {
    // Category pills
    const catBar = document.getElementById('qb-category-bar');
    if (catBar) {
      catBar.addEventListener('click', e => {
        const pill = e.target.closest('.qb-cat-pill');
        if (!pill) return;
        catBar.querySelectorAll('.qb-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.cat;
        filterAndRenderCards();
      });
    }

    // Search input
    const searchInput = document.getElementById('qb-search');
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        searchQuery = e.target.value;
        filterAndRenderCards();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('qb-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', e => {
        currentSort = e.target.value;
        filterAndRenderCards();
      });
    }

    // Modal controls
    const modal = document.getElementById('qb-modal');
    const openModalBtn = document.getElementById('qb-open-submit-modal');
    const closeModalBtn = document.getElementById('qb-modal-close-btn');
    const submitForm = document.getElementById('qb-submit-form');

    if (openModalBtn && modal) {
      openModalBtn.addEventListener('click', () => modal.classList.add('open'));
    }
    if (closeModalBtn && modal) {
      closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
    }
    if (modal) {
      modal.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('open');
      });
    }

    // Form submit
    if (submitForm) {
      submitForm.addEventListener('submit', e => {
        e.preventDefault();
        const text = document.getElementById('qb-input-quote').value.trim();
        const speaker = document.getElementById('qb-input-speaker').value.trim();
        const category = document.getElementById('qb-input-category').value;
        const context = document.getElementById('qb-input-context').value.trim();
        const submitter = document.getElementById('qb-input-submitter').value.trim();

        if (!text || !speaker) return;

        const newQuote = {
          id: 'user-' + Date.now(),
          text,
          speaker,
          category,
          context: context || (submitter ? `Submitted by ${submitter}` : 'Section E Memory'),
          role: 'Classmate Submission',
          reactions: { "😂": 1, "💀": 0, "🔥": 1, "❤️": 1, "🫡": 0 }
        };

        saveSubmittedQuote(newQuote);
        allQuotes.unshift({ ...newQuote, isUserSubmitted: true, userVotes: [] });

        // Update count badge
        const countBadge = document.getElementById('qb-total-count');
        if (countBadge) countBadge.textContent = allQuotes.length;

        modal.classList.remove('open');
        submitForm.reset();
        showToast('Quote added to the board! ✨');
        filterAndRenderCards();
      });
    }
  }

  /* ── COMPACT HOMEPAGE WIDGET MOUNT ── */
  function mountCompactWidget(container) {
    const quotes = loadAllQuotes();
    if (!quotes.length) return;
    let index = Math.floor(Math.random() * quotes.length);

    function renderWidget() {
      const q = quotes[index];
      container.innerHTML = `
        <div class="qb-widget">
          <div class="qb-widget-tag">
            <span>🗣️ Overheard in Section E</span>
            <button style="background:none;border:none;cursor:pointer;font-size:0.85rem;" id="qb-widget-next-btn" title="Next quote">🎲 Next</button>
          </div>
          <p class="qb-widget-quote">“${escapeHtml(q.text)}”</p>
          <div class="qb-widget-author">
            <span>— ${escapeHtml(q.speaker)}</span>
            <a href="quotes.html" class="qb-widget-link">View all (${quotes.length}) &rarr;</a>
          </div>
        </div>
      `;

      const btn = container.querySelector('#qb-widget-next-btn');
      if (btn) {
        btn.addEventListener('click', () => {
          index = (index + 1) % quotes.length;
          renderWidget();
        });
      }
    }

    renderWidget();
  }

  /* ── AUTO-INITIALIZATION ── */
  function init() {
    injectStyles();

    // 1. Look for Quote Board Full Root
    let boardRoot = document.getElementById('quote-board-root') || document.querySelector('.quotes-board-container');
    
    // If on a page with filename quotes.html or quotes-board.html and no root, mount onto main or body
    if (!boardRoot && (window.location.pathname.includes('quotes') || document.title.toLowerCase().includes('quote'))) {
      boardRoot = document.createElement('main');
      boardRoot.id = 'quote-board-root';
      const navEl = document.querySelector('nav') || document.getElementById('nav-container');
      if (navEl && navEl.nextSibling) {
        navEl.parentNode.insertBefore(boardRoot, navEl.nextSibling);
      } else {
        document.body.appendChild(boardRoot);
      }
    }

    if (boardRoot) {
      renderBoard(boardRoot);
    }

    // 2. Look for Compact Widget Root (for homepage or sidebars)
    const widgetRoot = document.getElementById('section-e-quote-widget');
    if (widgetRoot) {
      mountCompactWidget(widgetRoot);
    }
  }

  // Realtime update listener from Firebase
  window.addEventListener('ec-data-updated', () => {
    const root = document.getElementById('quote-board-root') || document.querySelector('.quotes-board-container');
    if (root) renderBoard(root);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export globally for custom integrations
  window.ECQuoteBoard = {
    init,
    loadAllQuotes,
    submitQuote: saveSubmittedQuote
  };
})();
