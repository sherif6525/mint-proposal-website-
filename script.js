/* =====================================================
   FOR YOU — A Birthday Story
   Script
   ===================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------
     0. CONTENT — edit these to personalize the story
     --------------------------------------------------- */

  // Chapter 1: The letter (typewriter effect)
  const LETTER_TEXT =
`I've been trying to write this for days, and I keep starting over because nothing feels big enough.

So I'll just say it simply: being with you has made my ordinary days feel like the best part of the story.

Happy birthday, love. Here's to everything still ahead of us.`;

  // Chapter 2: Photo captions (in order, photo1.jpg → photo10.jpg)
  const PHOTO_CAPTIONS = [
    'that day',
    'us, again',
    'my favorite view',
    'unplanned, perfect',
    'somewhere new',
    'just because',
    'golden hour',
    'still my favorite',
    'one more',
    'and forever'
  ];

  // Chapter 3: Reasons I love you
  const REASONS = [
    'The way you laugh at your own jokes before you even finish telling them.',
    'How you make any place feel like home within five minutes.',
    'The way you remember tiny details about people you barely know.',
    'Your unstoppable curiosity — about everything, always.',
    'How safe and calm I feel just sitting next to you.',
    'The way you sing in the car like no one is listening.'
  ];

  // Chapter 4: Memory Lane timeline
  const MEMORIES = [
    { date: 'The Beginning', title: 'The first time we met', text: 'I don\'t think either of us knew what was starting that day — but I remember exactly how it felt.' },
    { date: 'Early Days', title: 'Our first trip together', text: 'New city, no plan, and somehow it was perfect. That\'s when I knew this was different.' },
    { date: 'A Quiet Favorite', title: 'That ordinary Tuesday', text: 'Nothing special happened. We just talked for hours and I never wanted it to end.' },
    { date: 'Through It All', title: 'The hard week we got through', text: 'It wasn\'t easy, but you stayed. That meant more than you know.' },
    { date: 'Right Now', title: 'Today', text: 'Another year of you in the world — and another year of us. I\'m so glad I get this.' }
  ];

  // Chapter 5: Little things
  const LITTLE_THINGS = [
    { label: 'Inside Joke', content: '"It\'s fine, I have a system" — narrator: she did not have a system.', sub: 'still makes me laugh every time' },
    { label: 'Nickname', content: 'Bug', sub: 'don\'t ask, it just stuck' },
    { label: 'Favorite Quote of Yours', content: '"We can just figure it out when we get there."', sub: 'your unofficial life motto' },
    { label: 'Reminds Me of You', content: 'Rainy mornings, the smell of coffee, and that one song we always skip back to.', sub: '' },
    { label: 'Little Habit I Love', content: 'How you always save the best bite of food for last.', sub: '' },
    { label: 'A Promise', content: 'More slow mornings, more bad jokes, more us — for a long time.', sub: '' }
  ];

  // Chapter 6: Surprise quote
  const SURPRISE_QUOTE = '“You are my today and all of my tomorrows.”';
  const SURPRISE_ATTR = '— Leo Christopher';


  /* ---------------------------------------------------
     1. AMBIENT PARTICLES
     --------------------------------------------------- */
  function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const count = window.innerWidth < 640 ? 14 : 24;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';

      const size = 3 + Math.random() * 6;
      const left = Math.random() * 100;
      const duration = 18 + Math.random() * 22;
      const delay = Math.random() * -duration;
      const drift = (Math.random() - 0.5) * 120;

      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${left}%`;
      p.style.bottom = `-20px`;
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${delay}s`;
      p.style.setProperty('--drift', `${drift}px`);

      frag.appendChild(p);
    }
    container.appendChild(frag);
  }


  /* ---------------------------------------------------
     2. STORY SPINE — scroll progress + chapter nodes
     --------------------------------------------------- */
  function initSpine() {
    const spine = document.getElementById('spine');
    const fill = document.getElementById('spineFill');
    const nodesContainer = document.getElementById('spineNodes');
    const opening = document.getElementById('opening');
    const chapters = Array.from(document.querySelectorAll('[data-leaf]'));

    if (!spine || !fill || !nodesContainer) return;

    // Build a node for each chapter, positioned proportionally to the
    // document height (recalculated on resize).
    const nodeEls = chapters.map((chapter) => {
      const node = document.createElement('div');
      node.className = 'spine__node';
      node.setAttribute('role', 'link');
      node.setAttribute('tabindex', '0');
      node.setAttribute('aria-label', chapter.dataset.chapter);
      node.innerHTML = '<span class="spine__node-leaf"></span>';

      const goTo = () => chapter.scrollIntoView({ behavior: 'smooth', block: 'start' });
      node.addEventListener('click', goTo);
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(); }
      });

      nodesContainer.appendChild(node);
      return { el: node, chapter };
    });

    let docHeight = 1;

    // Position nodes using the same coordinate space as the fill line:
    // scroll progress (0–1) over (document height − viewport height),
    // mapped to 0–100% of the fixed spine container. Using document-
    // relative percentages here would bunch every node near the top,
    // since the spine itself is only one viewport tall.
    function layout() {
      docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

      nodeEls.forEach(({ el, chapter }) => {
        const progress = chapter.offsetTop / docHeight;
        const pct = Math.min(98, Math.max(1, progress * 100));
        el.style.top = `${pct}%`;
      });
    }

    function update() {
      const scrollY = window.scrollY;

      // Hide the spine while the opening scene is in view.
      const openingRect = opening.getBoundingClientRect();
      const showSpine = openingRect.bottom < window.innerHeight * 0.6;
      spine.classList.toggle('is-hidden', !showSpine);

      // Update the fill line height (0–1000 viewBox units).
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      fill.setAttribute('y2', String(progress * 1000));

      // Update active / passed state on nodes.
      const viewportCenter = scrollY + window.innerHeight * 0.4;
      nodeEls.forEach(({ el, chapter }) => {
        const top = chapter.offsetTop;
        const bottom = top + chapter.offsetHeight;
        const isActive = viewportCenter >= top && viewportCenter < bottom;
        const isPassed = viewportCenter >= bottom;
        el.classList.toggle('is-active', isActive);
        el.classList.toggle('is-passed', isPassed && !isActive);
      });
    }

    layout();
    update();

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', () => { layout(); update(); });
  }


  /* ---------------------------------------------------
     3. OPENING SCENE — "Begin Our Story" button
     --------------------------------------------------- */
  function initOpening() {
    const btn = document.getElementById('beginBtn');
    const chapter1 = document.getElementById('chapter1');
    if (!btn || !chapter1) return;

    btn.addEventListener('click', () => {
      chapter1.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }


  /* ---------------------------------------------------
     4. CHAPTER 1 — Envelope + typewriter letter
     --------------------------------------------------- */
  function initLetter() {
    const frame = document.querySelector('.envelope-frame');
    const envelope = document.getElementById('envelope');
    const letterCard = document.getElementById('letterCard');
    const typedEl = document.getElementById('letterTyped');
    if (!envelope || !letterCard || !typedEl || !frame) return;

    let opened = false;
    let typingStarted = false;

    function typeWriter() {
      if (typingStarted) return;
      typingStarted = true;

      typedEl.classList.add('is-typing');
      const text = LETTER_TEXT;
      let i = 0;

      function step() {
        if (i <= text.length) {
          typedEl.textContent = text.slice(0, i);
          i++;
          // Vary speed slightly for a more natural feel; pause longer on punctuation.
          const char = text[i - 1];
          let delay = 18;
          if (char === ',' ) delay = 120;
          if (char === '.' || char === '\n') delay = 220;
          setTimeout(step, delay);
        } else {
          typedEl.classList.remove('is-typing');
        }
      }
      step();
    }

    function open() {
      if (opened) return;
      opened = true;

      envelope.classList.add('is-open');
      frame.classList.add('is-open');
      envelope.setAttribute('aria-expanded', 'true');

      // Reveal the letter card slightly after the envelope animation starts.
      setTimeout(() => {
        letterCard.classList.add('is-visible');
        typeWriter();
      }, 500);
    }

    envelope.addEventListener('click', open);
    envelope.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }


  /* ---------------------------------------------------
     5. CHAPTER 2 — Polaroids + Lightbox
     --------------------------------------------------- */
  function initPolaroids() {
    const field = document.getElementById('polaroidField');
    if (!field) return;

    const total = 10;
    const photos = [];

    // A spread of rotation angles for a "scattered" feel.
    const rotations = [-6, 4, -3, 7, -8, 3, -5, 6, -4, 8];
    const floatDurations = [6.5, 7.5, 7, 8, 6.8, 7.2, 6.6, 7.8, 7.1, 6.9];
    const floatDelays = [0, 0.6, 1.2, 0.3, 0.9, 1.5, 0.2, 1.1, 0.7, 1.4];

    for (let i = 1; i <= total; i++) {
      const src = `photo${i}.jpeg`;
      const caption = PHOTO_CAPTIONS[i - 1] || '';
      photos.push({ src, caption });

      const card = document.createElement('div');
      card.className = 'polaroid reveal';
      card.style.setProperty('--rot', `${rotations[(i - 1) % rotations.length]}deg`);
      card.style.setProperty('--float-dur', `${floatDurations[(i - 1) % floatDurations.length]}s`);
      card.style.setProperty('--float-delay', `${floatDelays[(i - 1) % floatDelays.length]}s`);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open photo: ${caption}`);
      card.dataset.index = String(i - 1);

      card.innerHTML = `
        <div class="polaroid__photo">
          <img src="${src}" alt="${caption}" loading="lazy" />
        </div>
        <p class="polaroid__caption">${caption}</p>
      `;

      field.appendChild(card);
    }

    initLightbox(photos);
  }

  function initLightbox(photos) {
    const lightbox = document.getElementById('lightbox');
    const backdrop = document.getElementById('lightboxBackdrop');
    const img = document.getElementById('lightboxImg');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const field = document.getElementById('polaroidField');

    if (!lightbox || !img || !field) return;

    let currentIndex = 0;

    function show(index) {
      currentIndex = (index + photos.length) % photos.length;
      const photo = photos[currentIndex];
      img.src = photo.src;
      img.alt = photo.caption;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    function next() { show(currentIndex + 1); }
    function prev() { show(currentIndex - 1); }

    // Open on tap/click of any polaroid.
    field.addEventListener('click', (e) => {
      const card = e.target.closest('.polaroid');
      if (!card) return;
      show(Number(card.dataset.index));
    });

    field.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.polaroid');
      if (!card) return;
      e.preventDefault();
      show(Number(card.dataset.index));
    });

    closeBtn?.addEventListener('click', close);
    backdrop?.addEventListener('click', close);
    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    // Swipe support
    let touchStartX = 0;
    let touchStartY = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      // Ignore mostly-vertical swipes (could be scroll attempts).
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;

      if (dx < 0) next(); else prev();
    }, { passive: true });
  }


  /* ---------------------------------------------------
     6. CHAPTER 3 — Reason cards (tap to flip)
     --------------------------------------------------- */
  function initReasons() {
    const grid = document.getElementById('reasonsGrid');
    if (!grid) return;

    REASONS.forEach((reason, i) => {
      const card = document.createElement('div');
      card.className = 'reason-card reveal';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Tap to reveal a reason');

      const num = String(i + 1).padStart(2, '0');

      card.innerHTML = `
        <div class="reason-card__face reason-card__face--front">
          <span class="reason-card__number">${num}</span>
          <span class="reason-card__prompt">Tap to reveal</span>
        </div>
        <div class="reason-card__face reason-card__face--back">
          ${reason}
        </div>
      `;

      const toggle = () => card.classList.toggle('is-flipped');
      card.addEventListener('click', toggle);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });

      grid.appendChild(card);
    });
  }


  /* ---------------------------------------------------
     7. CHAPTER 4 — Memory Lane timeline
     --------------------------------------------------- */
  function initTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    MEMORIES.forEach((memory) => {
      const item = document.createElement('div');
      item.className = 'timeline-item reveal';
      item.innerHTML = `
        <span class="timeline-item__dot"></span>
        <p class="timeline-item__date">${memory.date}</p>
        <h3 class="timeline-item__title">${memory.title}</h3>
        <p class="timeline-item__text">${memory.text}</p>
      `;
      timeline.appendChild(item);
    });
  }


  /* ---------------------------------------------------
     8. CHAPTER 5 — Little things
     --------------------------------------------------- */
  function initLittleThings() {
    const grid = document.getElementById('littleGrid');
    if (!grid) return;

    LITTLE_THINGS.forEach((thing) => {
      const card = document.createElement('div');
      card.className = 'little-card reveal';
      if (thing.label.toLowerCase().includes('quote')) {
        card.classList.add('little-card--quote');
      }
      card.innerHTML = `
        <p class="little-card__label">${thing.label}</p>
        <p class="little-card__content">${thing.content}</p>
        ${thing.sub ? `<p class="little-card__sub">${thing.sub}</p>` : ''}
      `;
      grid.appendChild(card);
    });
  }


  /* ---------------------------------------------------
     9. CHAPTER 6 — Gift box, confetti, surprise reveal
     --------------------------------------------------- */
  function initGift() {
    const gift = document.getElementById('gift');
    const surprise = document.getElementById('surprise');
    const canvas = document.getElementById('confetti');
    if (!gift || !surprise) return;

    let opened = false;

    function open() {
      if (opened) return;
      opened = true;

      gift.classList.add('is-open');
      gift.setAttribute('aria-expanded', 'true');

      setTimeout(() => {
        surprise.classList.add('is-visible');
        surprise.setAttribute('aria-hidden', 'false');
      }, 350);

      if (canvas) launchConfetti(canvas);
    }

    gift.addEventListener('click', open);
    gift.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  }

  // Lightweight canvas confetti — no dependencies.
  function launchConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    }
    resize();

    const colors = ['#7A9D7C', '#A5B68D', '#FAF7F0', '#243B2F', '#FFFFFF'];
    const count = window.innerWidth < 640 ? 70 : 130;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;

    const pieces = Array.from({ length: count }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.3,
      y: h * 0.35,
      vx: (Math.random() - 0.5) * 6,
      vy: -(Math.random() * 6 + 4),
      size: 4 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      gravity: 0.18 + Math.random() * 0.08,
      drag: 0.985
    }));

    const start = performance.now();
    const duration = 3200;

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);

      let activeCount = 0;

      for (const p of pieces) {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (p.y > h + 30) continue;
        activeCount++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        // Fade out near the end of the animation.
        const fadeStart = duration * 0.6;
        ctx.globalAlpha = elapsed > fadeStart
          ? Math.max(0, 1 - (elapsed - fadeStart) / (duration - fadeStart))
          : 1;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < duration && activeCount > 0) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    requestAnimationFrame(frame);

    window.addEventListener('resize', resize, { once: true });
  }


  /* ---------------------------------------------------
     10. SCROLL-TRIGGERED REVEALS (IntersectionObserver)
     --------------------------------------------------- */
  function initScrollReveals() {
    const targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // Special-case the timeline dots, which use a slightly
          // different "visible" trigger for their glow.
          if (entry.target.classList.contains('timeline-item')) {
            entry.target.classList.add('is-visible');
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach((el) => observer.observe(el));
  }


  /* ---------------------------------------------------
     INIT
     --------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initOpening();
    initLetter();
    initPolaroids();
    initReasons();
    initTimeline();
    initLittleThings();
    initGift();

    // Reveal-on-scroll needs the dynamically created elements above
    // to already exist in the DOM before observing them.
    initScrollReveals();

    // Spine needs final layout dimensions, so init last (and on load
    // for late-loading images affecting page height).
    initSpine();
    window.addEventListener('load', initSpine);
  });

})();