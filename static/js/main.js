(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hasGsap = !!window.gsap && !!window.ScrollTrigger;
  try { window.lucide && lucide.createIcons(); } catch (e) {}
  if (hasGsap) { gsap.registerPlugin(ScrollTrigger); if (!reduce) document.documentElement.classList.add('gsap'); }
  else $$('.skill-card').forEach(c => c.classList.add('no-js'));

  // ---------- nav (profile icon only) + back to top ----------
  const top = $('#top');
  const onScroll = () => top.classList.toggle('show', scrollY > 700);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.onclick = () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

  // ---------- hero: split name, roles ----------
  const chars = $('.chars');
  if (chars) { const t = chars.textContent; chars.innerHTML = [...t].map(c => `<span class="ch" aria-hidden="true">${c === ' ' ? '&nbsp;' : c}</span>`).join(''); }
  const roleEl = $('#role');
  let typer = null;
  const stopTyping = () => { clearTimeout(typer); typer = null; };
  const startTyping = () => {           // restarts from the first role every time
    if (!roleEl) return; stopTyping();
    const roles = (roleEl.dataset.roles || '').split('|').filter(Boolean); if (!roles.length) return;
    if (reduce) { roleEl.textContent = roles[0]; return; }
    let i = 0, j = 0, del = false; roleEl.textContent = '';
    const tick = () => {
      const w = roles[i]; roleEl.textContent = w.slice(0, j);
      if (!del && j === w.length) { del = true; typer = setTimeout(tick, 1600); return; }
      if (del && j === 0) { del = false; i = (i + 1) % roles.length; }
      j += del ? -1 : 1; typer = setTimeout(tick, del ? 35 : 70);
    };
    tick();
  };
  // run while the hero is on screen; when you scroll back up, replay name + typing
  const heroEl = $('#home'); let heroLeft = false;
  if (heroEl) new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (heroLeft && hasGsap && !reduce) {
        gsap.fromTo('.ch', { yPercent: 110, rotate: 6, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: .8, stagger: .03, ease: 'power4.out', overwrite: true });
        gsap.fromTo('.hero .meta,.role,.lead,.cta>*,.tag', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .07, delay: .2, ease: 'power3.out', overwrite: true });
      }
      startTyping();
    } else { stopTyping(); heroLeft = true; }
  }, { threshold: .25 }).observe(heroEl);
  const skipIntro = document.documentElement.classList.contains('skip-intro');
  const intro = () => {
    document.body.classList.add('ready');
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}
    if (skipIntro) return; // coming back from the profile page: no loader / no replay
    if (hasGsap && !reduce) gsap.from('.ch', { yPercent: 110, rotate: 6, opacity: 0, duration: 1, stagger: .035, ease: 'power4.out', delay: .2 });
    if (hasGsap && !reduce) gsap.from('.hero .meta,.role,.lead,.cta>*,.tag', { y: 24, opacity: 0, duration: .9, stagger: .1, delay: .6, ease: 'power3.out' });
  };
  if (skipIntro) intro(); else addEventListener('load', () => setTimeout(intro, 900));
  setTimeout(() => document.body.classList.add('ready'), 4000); // never trap the visitor behind the loader

  // ---------- particles ----------
  const cv = $('#particles');
  if (cv && !reduce) {
    const x = cv.getContext('2d'); let W, H, P = [], m = { x: -999, y: -999 }, run = true, dpr = Math.min(devicePixelRatio || 1, 2);
    const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
      P = Array.from({ length: Math.min(90, Math.floor(W / 14)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3, r: Math.random() * 1.6 + .6 })); };
    size(); addEventListener('resize', size);
    cv.parentElement.addEventListener('pointermove', e => { const b = cv.getBoundingClientRect(); m.x = e.clientX - b.left; m.y = e.clientY - b.top; });
    cv.parentElement.addEventListener('pointerleave', () => m.x = m.y = -999);
    new IntersectionObserver(([e]) => { run = e.isIntersecting; if (run) draw(); }).observe(cv);
    function draw() {
      if (!run) return; x.clearRect(0, 0, W, H);
      for (const p of P) {
        const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
        if (d < 140) { p.x += dx / d * 1.6; p.y += dy / d * 1.6; }
        p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.3); x.fillStyle = d < 140 ? '#ff3030' : 'rgba(255,48,48,.55)'; x.shadowColor = '#ff3030'; x.shadowBlur = 8; x.fill();
        if (d < 180) { x.shadowBlur = 0; x.strokeStyle = `rgba(255,48,48,${(1 - d / 180) * .5})`; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(m.x, m.y); x.stroke(); }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ---------- card tilt and spotlight (native system cursor) ----------
  if (fine && !reduce) {
    $$('.tilt').forEach(t => {
      t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(); t.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 6 + 'deg'); t.style.setProperty('--rx', (.5 - (e.clientY - r.top) / r.height) * 6 + 'deg'); });
      t.addEventListener('pointerleave', () => { t.style.setProperty('--rx', '0deg'); t.style.setProperty('--ry', '0deg'); });
    });
  }
  $$('.spot').forEach(s => s.addEventListener('pointermove', e => { const r = s.getBoundingClientRect(); s.style.setProperty('--mx', e.clientX - r.left + 'px'); s.style.setProperty('--my', e.clientY - r.top + 'px'); }));

  // ---------- scroll animations ----------
  if (hasGsap) {
    $$('.reveal').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => {
      el.classList.add('in-view'); reduce ? gsap.set(el, { opacity: 1 }) : gsap.fromTo(el, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: .9, ease: 'power3.out' }); } }));
    $$('.stats dd').forEach(d => { const to = +d.dataset.to; if (!to) return;
      ScrollTrigger.create({ trigger: d, start: 'top 90%', once: true, onEnter: () => { const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: () => d.textContent = Math.round(o.v) }); } }); });
    gsap.to('.progress', { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.line', start: 'top 70%', end: 'bottom 70%', scrub: true } });
    $$('.glow').forEach((g, i) => !reduce && gsap.to(g, { y: i ? -120 : 120, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } }));
  } else { $$('.reveal').forEach(e => e.classList.add('in-view')); $('.progress').style.setProperty('--p', 1); }

  // ---------- project modal ----------
  const projects = JSON.parse($('#projects-data').textContent), modal = $('#modal'), body = $('#m-body');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const list = a => `<ul>${(a || []).map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  let opener = null;
  const open = id => {
    const p = projects.find(p => p.id === id); if (!p) return; opener = document.activeElement;
    body.innerHTML = `<h2 id="m-title">${esc(p.title)}</h2><p>${esc(p.short)}</p><ul class="tags" style="margin-top:14px">${p.tags.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
      ${p.screenshots.length ? `<div class="shots">${p.screenshots.map(s => `<img src="${esc(s)}" alt="${esc(p.title)} screenshot" loading="lazy">`).join('')}</div>` : ''}
      <h4>Features</h4>${list(p.features)}<h4>Challenges</h4>${list(p.challenges)}<h4>Technical overview</h4><p>${esc(p.explanation)}</p>
      <div class="acts" style="margin-top:22px">${p.live ? `<a class="btn mini solid" href="${esc(p.live)}" target="_blank" rel="noopener">Live demo</a>` : ''}${p.github ? `<a class="btn mini ghost" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>` : ''}</div>`;
    modal.hidden = false; document.body.style.overflow = 'hidden'; $('.x', modal).focus();
  };
  const close = () => { modal.hidden = true; document.body.style.overflow = ''; opener && opener.focus(); };
  $$('[data-open]').forEach(b => b.onclick = () => open(b.dataset.open));
  // whole project card opens the details (links/buttons keep their own action)
  $$('.proj').forEach(card => card.addEventListener('click', e => { if (e.target.closest('a,button')) return; open(card.dataset.id); }));
  $('.x', modal).onclick = close; modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { if (!modal.hidden) close(); }
    if (e.key === 'Tab' && !modal.hidden) { const f = $$('a,button', modal); const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } } });

  // ---------- contact form ----------
  const form = $('#form'), status = $('.status', form), rules = {
    name: v => v.trim().length < 2 && 'Enter your name.', email: v => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) && 'Enter a valid email address.',
    subject: v => v.trim().length < 3 && 'Enter a subject.', message: v => v.trim().length < 10 && 'Write at least 10 characters.' };
  const show = (k, msg) => { const f = form.elements[k], s = f.nextElementSibling; s.textContent = msg || ''; f.setAttribute('aria-invalid', !!msg); };
  Object.keys(rules).forEach(k => form.elements[k].addEventListener('blur', () => show(k, rules[k](form.elements[k].value))));
  const csrf = () => (document.cookie.match(/csrftoken=([^;]+)/) || [])[1] || '';
  form.addEventListener('submit', async e => {
    e.preventDefault(); status.textContent = ''; let bad = null;
    for (const k in rules) { const m = rules[k](form.elements[k].value); show(k, m); if (m && !bad) bad = k; }
    if (bad) return form.elements[bad].focus();
    const btn = $('button', form); btn.disabled = true; btn.textContent = 'Sending...';
    try {
      const r = await fetch(form.action, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrf() }, credentials: 'same-origin', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      const d = await r.json();
      if (d.ok) { form.classList.add('sent'); form.reset(); setTimeout(() => form.classList.remove('sent'), 6000); }
      else { Object.entries(d.errors || {}).forEach(([k, v]) => show(k, v)); status.textContent = 'Please fix the highlighted fields.'; }
    } catch { status.textContent = 'Could not send. Check your connection or email me directly.'; }
    btn.disabled = false; btn.textContent = 'Send message';
  });
})();
