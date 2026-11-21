(() => {
  function init() {
    const page = document.querySelector('.atlas');
    if (!page || page.dataset.ready) return;
    page.dataset.ready = 'true';
    const links = [...page.querySelectorAll('[data-project]')];
    const articles = new Map([...page.querySelectorAll('[data-article]')].map(el => [el.dataset.article, el]));
    const canvas = page.querySelector('[data-plate]');
    const stage = canvas.parentElement;
    const caption = page.querySelector('[data-phase]');
    const scrub = page.querySelector('[data-scrub]');
    const play = page.querySelector('[data-play]');
    let key = '';
    let phases = [];
    let progress = 62;
    let frame = 0;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      play.setAttribute('aria-pressed', 'false');
      play.setAttribute('aria-label', '播放图解');
    }
    function paint() {
      if (!window.TinkerPlate || !stage.clientWidth) return;
      window.TinkerPlate.draw(canvas, key, progress / 100);
      stage.classList.add('is-drawn');
      page.querySelector('[data-transport]').hidden = false;
    }
    function setProgress(value) {
      progress = Math.max(0, Math.min(100, value));
      const label = phases[Math.min(2, Math.floor(progress * 3 / 100))];
      scrub.value = String(Math.round(progress));
      scrub.style.setProperty('--pct', progress + '%');
      scrub.setAttribute('aria-valuetext', label + '，' + Math.round(progress) + '%');
      caption.textContent = label;
      paint();
    }
    function select(id) {
      if (!articles.has(id)) id = links[0].dataset.project;
      if (key === id) return;
      stop();
      key = id;
      const active = articles.get(id);
      for (const [name, article] of articles) article.hidden = name !== id;
      for (const link of links) {
        if (link.dataset.project === id) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      }
      phases = JSON.parse(active.dataset.stages);
      page.querySelector('[data-plate-heading]').textContent = active.querySelector('[data-question]').textContent;
      canvas.setAttribute('aria-label', active.querySelector('[data-question]').textContent + ' 三个阶段：' + phases.join('、'));
      setProgress(62);
    }
    function fromLocation() {
      select(location.hash.startsWith('#p-') ? location.hash.slice(3) : links[0].dataset.project);
    }
    function choose(id) {
      if (key === id) return;
      history.pushState(null, '', '#p-' + id);
      select(id);
      page.querySelector('[data-selection-status]').textContent = '已展开 ' + articles.get(id).querySelector('[data-project-title]').textContent;
    }
    links.forEach((link, i) => {
      link.href = '#p-' + link.dataset.project;
      link.addEventListener('click', event => {
        if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        choose(link.dataset.project);
      });
      link.addEventListener('keydown', event => {
        const offset = ['ArrowDown','ArrowRight'].includes(event.key) ? 1 : ['ArrowUp','ArrowLeft'].includes(event.key) ? -1 : 0;
        if (!offset) return;
        event.preventDefault();
        const next = links[(i + offset + links.length) % links.length];
        next.focus();
        choose(next.dataset.project);
      });
    });
    function locate(event) {
      const bounds = stage.getBoundingClientRect();
      const scale = Math.min(bounds.width / 720, bounds.height / 330);
      const start = bounds.left + (bounds.width - 720 * scale) / 2;
      setProgress((event.clientX - start) * 100 / (720 * scale));
    }
    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0 || !event.isPrimary) return;
      stop();
      stage.setPointerCapture(event.pointerId);
      locate(event);
    });
    stage.addEventListener('pointermove', event => {
      if (stage.hasPointerCapture(event.pointerId)) locate(event);
    });
    scrub.addEventListener('input', () => { stop(); setProgress(Number(scrub.value)); });
    play.addEventListener('click', () => {
      if (frame) { stop(); return; }
      const start = progress >= 99 ? 0 : progress;
      const begin = performance.now();
      let previous = -Infinity;
      function tick(now) {
        if (now - previous >= 32 || now - begin >= (100 - start) * 85) {
          setProgress(start + (now - begin) / 85);
          previous = now;
        }
        if (progress >= 100) { stop(); return; }
        frame = requestAnimationFrame(tick);
      }
      play.setAttribute('aria-pressed', 'true');
      play.setAttribute('aria-label', '暂停图解');
      frame = requestAnimationFrame(tick);
    });
    window.addEventListener('hashchange', fromLocation);
    window.addEventListener('popstate', fromLocation);
    window.addEventListener('pageshow', fromLocation);
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    reduced.addEventListener('change', stop);
    if ('ResizeObserver' in window) new ResizeObserver(paint).observe(stage);
    else window.addEventListener('resize', paint);
    fromLocation();
    loadLatest(page);
  }

  async function loadLatest(page) {
    try {
      const response = await fetch('/liubai/api/posts', { credentials: 'omit', headers: { Accept: 'application/json' } });
      if (!response.ok) return;
      const { posts } = await response.json();
      const post = posts.filter(p => p.status === 'published' && typeof p.title === 'string' && /^[a-zA-Z0-9_-]+$/.test(p.id)).sort((a, b) => b.created - a.created)[0];
      if (!post) return;
      const link = page.querySelector('[data-latest-link]');
      link.textContent = post.title;
      link.href = '/liubai/p/' + encodeURIComponent(post.id);
      const day = new Date(Number(post.created) * 1000);
      if (!Number.isNaN(day.getTime())) {
        const time = page.querySelector('[data-latest-date]');
        time.dateTime = day.toISOString();
        time.textContent = new Intl.DateTimeFormat('zh-CN', { month: 'long', day: 'numeric', timeZone: 'America/Toronto' }).format(day);
      }
    } catch { /* The journal link remains usable while the feed is unavailable. */ }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
