
(() => {
  // Remove page 'not-loaded' after load
  onload = () => {
    const t = setTimeout(() => {
      document.body.classList.remove('not-loaded');
      clearTimeout(t);
    }, 1000);
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Page enter animation
    document.body.classList.add('page-enter');
    requestAnimationFrame(() => {
      setTimeout(() => document.body.classList.remove('page-enter'), 20);
    });

    const exitDelay = 420;

    // AJAX navigation to swap <main> without full reload
    async function ajaxNavigate(href, push = true) {
      if (!href || href.startsWith('#')) return;
      document.body.classList.add('page-exit');
      try {
        const res = await fetch(href, { credentials: 'same-origin' });
        if (!res.ok) throw new Error('Network');
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newMain = doc.querySelector('main');
        const oldMain = document.querySelector('main');
        if (newMain && oldMain) {
          oldMain.replaceWith(newMain);
          const newTitle = doc.querySelector('title');
          if (newTitle) document.title = newTitle.textContent;
          initFrames(document);
        } else {
          window.location.href = href; return;
        }
        if (push) history.pushState({ url: href }, '', href);
      } catch (e) {
        window.location.href = href;
      } finally {
        setTimeout(() => document.body.classList.remove('page-exit'), exitDelay);
      }
    }

    // Delegate clicks on transition links to ajaxNavigate
    document.addEventListener('click', (ev) => {
      const a = ev.target.closest && ev.target.closest('a.transition-link');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      ev.preventDefault();
      ajaxNavigate(href, true);
    });

    window.addEventListener('popstate', () => {
      ajaxNavigate(location.href, false);
    });

    // Frame/viewer setup
    let activeFrame = null;

    function initFrames(root = document) {
      const frames = Array.from(root.querySelectorAll('.frame'));
      const input = document.getElementById('imageInput');
      const viewer = document.querySelector('.img-viewer');
      const viewerImg = viewer && viewer.querySelector('.viewer-img');
      const viewerMsg = viewer && viewer.querySelector('.viewer-message');
      const viewerClose = viewer && viewer.querySelector('.viewer-close');
      const viewerRemove = viewer && viewer.querySelector('.viewer-remove');

      function setActive(frameEl) {
        Array.from(document.querySelectorAll('.frame')).forEach(f => f.classList.remove('active'));
        frameEl.classList.add('active');
        activeFrame = frameEl;
      }

      function showViewer(frameEl) {
        if (!viewer) return;
        const img = frameEl.querySelector('.frame-img');
        let src = '';
        if (img) src = img.getAttribute('src') || (img.dataset && img.dataset.src) || '';
        if (viewerImg) {
          if (src) { viewerImg.src = src; viewerImg.style.display = ''; }
          else { viewerImg.removeAttribute('src'); viewerImg.style.display = 'none'; }
        }
        const messages = {
          '1': "Happy Valentine’s Day, my langga Emerald. You’re not just my girlfriend—you’re my peace, my comfort, and my favorite person. No matter how busy or stressful life gets, thinking about you makes everything lighter. I’m so thankful for your love, your smile, and the way you understand me even without words. I don’t just love you today. I choose you every day. 💕",
          '2': "Happy Valentine’s Day, my Emerald. You came into my life and turned ordinary days into something special. Your love feels like home, like safety, like something I never want to lose. If love was a journey, I’d walk every mile with you—no hesitation, no second thoughts. You are my today and all my tomorrows. I love you more than words can explain. 💕",
          '3': "Happy Valentine’s Day to the most beautiful girl in my world! Emerald, you really stole my heart and never gave it back… but honestly, you can keep it forever. 😌 You’re my favorite notification, my daily happiness, and the reason I smile at my phone like a crazy person. Forever yours, langga. 💘"
        };
        const id = frameEl.dataset.frame;
        if (viewerMsg) viewerMsg.textContent = messages[id] || '';
        viewer.classList.remove('hidden');
        viewer.setAttribute('aria-hidden', 'false');
      }

      if (viewerClose) viewerClose.addEventListener('click', () => { viewer.classList.add('hidden'); viewer.setAttribute('aria-hidden', 'true'); });
      if (viewerRemove) viewerRemove.addEventListener('click', () => {
        if (!activeFrame) return; const img = activeFrame.querySelector('.frame-img'); if (img) img.src = ''; if (viewerImg) viewerImg.src = ''; viewer.classList.add('hidden'); viewer.setAttribute('aria-hidden', 'true');
      });
      if (viewer) viewer.addEventListener('click', (e) => { if (e.target === viewer) { viewer.classList.add('hidden'); viewer.setAttribute('aria-hidden', 'true'); } });

      function setActiveAndShow(frameEl) { setActive(frameEl); requestAnimationFrame(() => showViewer(frameEl)); }

      frames.forEach(f => {
        f.addEventListener('click', () => { setActiveAndShow(f); });
        f.addEventListener('dblclick', () => { setActive(f); if (input) input.click(); });
      });

      if (!activeFrame && frames.length > 0) activeFrame = document.querySelector('.frame.active') || frames[0];
    }

    // Initialize frames on first load
    initFrames(document);

    // File input handler (global document input)
    const globalInput = document.getElementById('imageInput');
    if (globalInput) {
      globalInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        const target = activeFrame || document.querySelector('.frame');
        if (!target) { URL.revokeObjectURL(url); return; }
        const img = target.querySelector('.frame-img');
        if (!img) { URL.revokeObjectURL(url); return; }
        img.src = url;
        const viewer = document.querySelector('.img-viewer');
        const viewerImg = viewer && viewer.querySelector('.viewer-img');
        if (viewer && viewerImg && target === activeFrame) viewerImg.src = url;
        img.onload = () => { URL.revokeObjectURL(url); };
      });
    }
  });
})();