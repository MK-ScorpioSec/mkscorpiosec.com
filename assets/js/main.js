// Nav scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile menu
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Email channel: mobile → mailto, desktop → copy + toast
function handleEmailClick(e) {
  e.preventDefault();
  const email = atob('Y29udGFjdEBta3Njb3JwaW9zZWMuY29t');
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  if (isMobile) {
    window.location.href = 'mailto:' + email;
  } else {
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.getElementById('email-toast');
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 3000);
    }).catch(() => {
      window.location.href = 'mailto:' + email;
    });
  }
}

// Dynamic posts feed from /posts.json
(async () => {
  const feed = document.getElementById('posts-feed');
  if (!feed) return;
  try {
    const res = await fetch('/posts.json');
    if (!res.ok) return;
    const { posts } = await res.json();
    if (!posts || posts.length === 0) return;
    const PLATFORM_ICONS = { Medium: 'MD', 'Dev.to': 'DV', GitHub: 'GH', LinkedIn: 'in' };
    feed.innerHTML = `
      <p class="section-label" style="margin-bottom:1rem">Latest Posts & Research</p>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        ${posts.map(p => `
          <a href="${p.url}" target="_blank" rel="noopener"
             style="display:flex;align-items:center;gap:1rem;padding:0.85rem 1.1rem;border:1px solid var(--border);border-radius:4px;text-decoration:none;transition:border-color 0.2s"
             onmouseover="this.style.borderColor='var(--red)'" onmouseout="this.style.borderColor='var(--border)'">
            <span style="font-family:var(--font-mono);font-size:0.6rem;font-weight:700;letter-spacing:0.1em;background:var(--surface);padding:0.25rem 0.5rem;border-radius:2px;color:var(--gold);min-width:2.2rem;text-align:center">${PLATFORM_ICONS[p.platform] || p.platform.slice(0,2).toUpperCase()}</span>
            <span style="font-family:var(--font-head);font-size:0.9rem;color:var(--light);flex:1">${p.title}</span>
            <span style="font-family:var(--font-mono);font-size:0.65rem;color:var(--muted)">${p.tag || ''}</span>
            <span style="font-family:var(--font-mono);font-size:0.6rem;color:var(--muted)">${p.date}</span>
          </a>`).join('')}
      </div>`;
  } catch (_) {}
})();
