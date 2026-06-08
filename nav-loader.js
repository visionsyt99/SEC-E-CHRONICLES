// Loads shared nav HTML into #nav-placeholder
// Each page sets window.NAV_ROOT before including this
(function() {
  const root = window.NAV_ROOT || '';
  const nav = 
  <nav class="nav">
    <div class="nav-brand">
      <div class="nav-logo-mark">
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
      <span class="nav-title">The E <span>Chronicles</span></span>
    </div>
    <ul class="nav-links">
      <li><a href="${root}index.html">Home</a></li>
      <li><a href="${root}about.html">About</a></li>
      <li><a href="${root}members.html">Members</a></li>
      <li><a href="${root}gallery.html">Gallery</a></li>
      <li><a href="${root}schedule.html">Schedule</a></li>
      <li><a href="${root}events.html">Events</a></li>
      <li><a href="${root}notices.html">Notices</a></li>
      <li><a href="${root}resources.html">Resources</a></li>
      <li><a href="${root}achievements.html">Achievements</a></li>
      <li><a href="${root}birthdays.html">Birthdays</a></li>
      <li><a href="${root}memory-wall.html">Memories</a></li>
       <li><a href="${root}farewell.html">Farewell</a></li>
    </ul>
    <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme" title="Toggle light / dark">🌙</button>
    <button class="nav-hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="mobile-menu" id="mobileMenu">
    <a href="${root}index.html">🏠 Home</a>
    <a href="${root}about.html">ℹ️ About</a>
    <a href="${root}members.html">👥 Members</a>
    <a href="${root}gallery.html">🖼️ Gallery</a>
    <a href="${root}schedule.html">📅 Schedule</a>
    <a href="${root}events.html">🎉 Events</a>
    <a href="${root}notices.html">📢 Notices</a>
    <a href="${root}resources.html">📚 Resources</a>
    <a href="${root}achievements.html">🏆 Achievements</a>
    <a href="${root}birthdays.html">🎂 Birthdays</a>
    <a href="${root}memory-wall.html">💬 Memories</a>
    <a href="${root}farewell.html">💌 Farewell </a>
  </div>;
  document.getElementById('nav-placeholder').innerHTML = nav;
})();

