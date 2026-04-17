/* ══════════════════════════════════════════════════════════════
   aaronsnowberger.com — Main JavaScript
   Sections: Prefs · Nav · Smooth Scroll · Bio Tabs ·
             Copy Bio · Color Swatches · QR Codes · Lightbox ·
             Scroll Reveal
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. PREFERENCE PERSISTENCE ──────────────────────────────
     Keys: asb_theme · asb_lang · asb_aurora
     (Anti-flash script in <head> applies saved values before
     first paint, so these just wire up the toggle buttons.)
  ──────────────────────────────────────────────────────────── */
  const html = document.documentElement;

  const PREFS = {
    theme:  localStorage.getItem('asb_theme')  || 'dark',
    lang:   localStorage.getItem('asb_lang')   || 'en',
    aurora: localStorage.getItem('asb_aurora') || 'off',
  };

  // Apply in case anti-flash script missed something
  html.setAttribute('data-theme',  PREFS.theme);
  html.setAttribute('data-lang',   PREFS.lang);
  html.setAttribute('data-aurora', PREFS.aurora);

  function setPref(key, value, attr) {
    localStorage.setItem(key, value);
    html.setAttribute(attr, value);
  }

  // Theme
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) {
    themeBtn.textContent = PREFS.theme === 'dark' ? '☀' : '☾';
    themeBtn.addEventListener('click', function () {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setPref('asb_theme', next, 'data-theme');
      this.textContent = next === 'dark' ? '☀' : '☾';
    });
  }

  // Language
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.textContent = PREFS.lang === 'en' ? '한국어' : 'English';
    langBtn.addEventListener('click', function () {
      const next = html.getAttribute('data-lang') === 'en' ? 'ko' : 'en';
      setPref('asb_lang', next, 'data-lang');
      this.textContent = next === 'en' ? '한국어' : 'English';
    });
  }

  // Aurora
  const auroraBtn = document.getElementById('auroraBtn');
  if (auroraBtn) {
    auroraBtn.setAttribute('aria-pressed', PREFS.aurora === 'on' ? 'true' : 'false');
    auroraBtn.addEventListener('click', function () {
      const next = html.getAttribute('data-aurora') === 'on' ? 'off' : 'on';
      setPref('asb_aurora', next, 'data-aurora');
      this.setAttribute('aria-pressed', next === 'on' ? 'true' : 'false');
    });
  }

  /* ── 2. NAV — scroll + progress bar ─────────────────────────
  ──────────────────────────────────────────────────────────── */
  const mainnav = document.getElementById('mainnav');
  const prog    = document.getElementById('prog');

  window.addEventListener('scroll', function () {
    if (mainnav) mainnav.classList.toggle('scrolled', window.scrollY > 40);
    if (prog) {
      const scrolled = window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight) * 100;
      prog.style.width = Math.min(scrolled, 100) + '%';
    }
  }, { passive: true });

  // Hamburger menu
  const ham = document.getElementById('ham');
  const mob = document.getElementById('mobMenu');
  if (ham && mob) {
    ham.addEventListener('click', function () {
      mob.classList.toggle('open');
      this.classList.toggle('open', mob.classList.contains('open'));
    });
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mob.classList.remove('open');
        if (ham) ham.classList.remove('open');
      });
    });
  }

  /* ── 3. SMOOTH SCROLL ────────────────────────────────────────
     CSS scroll-behavior:smooth handles most cases; this JS
     override adds the nav-height offset and works on older
     browsers / Safari that ignore the CSS rule.
  ──────────────────────────────────────────────────────────── */
  const NAV_HEIGHT = 68;

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const id     = this.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (mob) mob.classList.remove('open');
    });
  });

  /* ── 4. BIO TABS ─────────────────────────────────────────────
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('.btab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const target = this.dataset.tab;
      document.querySelectorAll('.btab').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.bio-pane').forEach(function (p) {
        p.classList.remove('active');
        p.classList.remove('bio-flipped'); // clear any lang flip when switching tabs
      });
      this.classList.add('active');
      const pane = document.getElementById('bio-' + target);
      if (pane) pane.classList.add('active');
      updateFlipLabels();
    });
  });

  /* ── 4b. BIO LANGUAGE FLIP ───────────────────────────────────
     Toggles .bio-flipped on the current pane, showing the
     opposite language from the global site setting.
     Independent of the site-wide lang toggle.
  ──────────────────────────────────────────────────────────── */
  function getFlipLabel(pane) {
    var globalLang = html.getAttribute('data-lang') || 'en';
    var flipped    = pane && pane.classList.contains('bio-flipped');
    var showingKo  = (globalLang === 'ko') ? !flipped : flipped;
    return showingKo ? 'View English' : '한국어 보기';
  }

  function updateFlipLabels() {
    document.querySelectorAll('.lang-flip-btn').forEach(function (btn) {
      var pane = btn.closest('.bio-pane');
      var lbl  = btn.querySelector('.flip-label');
      if (lbl) lbl.textContent = getFlipLabel(pane);
    });
  }

  document.querySelectorAll('.lang-flip-btn').forEach(function (btn) {
    var pane = btn.closest('.bio-pane');
    var lbl  = btn.querySelector('.flip-label');
    if (lbl) lbl.textContent = getFlipLabel(pane); // set initial label

    btn.addEventListener('click', function () {
      var pane = this.closest('.bio-pane');
      if (!pane) return;
      pane.classList.toggle('bio-flipped');
      var lbl = this.querySelector('.flip-label');
      if (lbl) lbl.textContent = getFlipLabel(pane);
    });
  });

  // Sync flip button labels when global lang changes
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      setTimeout(updateFlipLabels, 0); // run after the lang attr updates
    });
  }

  /* ── 5. COPY BIO TEXT ────────────────────────────────────────
     Reads the bio pane for paragraphs matching the requested
     language class (en / ko) and copies plain text.
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const pane       = document.getElementById(this.dataset.target);
      const langTarget = this.dataset.langTarget || 'en';
      if (!pane) return;

      const paras = Array.from(pane.querySelectorAll('.bio-text p.' + langTarget));
      const text  = paras.length
        ? paras.map(function (p) { return p.innerText.trim(); }).join('\n\n')
        : (pane.querySelector('.bio-text') || pane).innerText.trim();

      const origHTML = this.innerHTML;
      const self     = this;

      function markCopied() {
        self.classList.add('copied');
        self.innerHTML = '<span class="copy-icon">✓</span> Copied!';
        setTimeout(function () {
          self.classList.remove('copied');
          self.innerHTML = origHTML;
        }, 2200);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied).catch(function () {
          fallbackCopy(text, markCopied);
        });
      } else {
        fallbackCopy(text, markCopied);
      }
    });
  });

  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    if (cb) cb();
  }

  /* ── 6. COLOR SWATCHES — copy HEX on click ──────────────────
  ──────────────────────────────────────────────────────────── */
  document.querySelectorAll('.swatch-wrap').forEach(function (sw) {
    sw.addEventListener('click', function () {
      const hex   = this.dataset.hex;
      const label = this.querySelector('.swatch-hex');
      if (!label) return;

      const orig = label.textContent;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).catch(function () {});
      }
      label.textContent = 'Copied!';
      setTimeout(function () { label.textContent = orig; }, 1600);
    });
  });

  /* ── 7. QR CODES ─────────────────────────────────────────────
     Data-driven: any element with data-qr-url gets a QR code.
     Click a QR box to open it full-size in the lightbox.
     Uses qrcodejs loaded via CDN in <head>.
  ──────────────────────────────────────────────────────────── */
  function initQR() {
    if (typeof QRCode === 'undefined') return;

    var opts = {
      width: 84, height: 84,
      colorDark: '#000000', colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    };

    document.querySelectorAll('[data-qr-url]').forEach(function (el) {
      var url   = el.dataset.qrUrl;
      var label = el.dataset.qrLabel || url;
      if (!url) return;

      // Generate QR if not already done
      if (!el.hasChildNodes()) {
        new QRCode(el, Object.assign({}, opts, { text: url }));
      }

      // Click to open in lightbox
      el.addEventListener('click', function () {
        var canvas = this.querySelector('canvas');
        if (!canvas) return;
        openLightbox(canvas.toDataURL('image/png'), label + ' · ' + url);
      });
    });

    // Download button: downloads the first QR code found
    var dlBtn = document.getElementById('qrDlBtn');
    if (dlBtn) {
      dlBtn.addEventListener('click', function () {
        var canvas = document.querySelector('[data-qr-url] canvas');
        if (!canvas) return;
        var a = document.createElement('a');
        a.href     = canvas.toDataURL('image/png');
        a.download = 'aaron-kr-qr.png';
        a.click();
      });
    }
  }

  // Init after QRCode script loads (it has defer attribute)
  if (document.readyState === 'complete') {
    initQR();
  } else {
    window.addEventListener('load', initQR);
  }

  /* ── 8. LIGHTBOX ─────────────────────────────────────────────
     Opens on: photo cards (click), stat photo (click),
               .photo-btn-view button (click)
     Closes on: X button, backdrop click, Escape key
  ──────────────────────────────────────────────────────────── */
  var lightbox  = document.getElementById('lightbox');
  var lbImg     = document.getElementById('lightboxImg');
  var lbCap     = document.getElementById('lightboxCaption');
  var lbDl      = document.getElementById('lightboxDl');
  var lbWrap    = document.getElementById('lightboxWrap');
  var lbClose   = document.getElementById('lightboxClose');

  function openLightbox(src, caption) {
    if (!src || !lightbox) return;
    lbImg.src          = src;
    lbCap.textContent  = caption || '';
    lbDl.href          = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Clickable elements with data-lightbox-src
  document.querySelectorAll('[data-lightbox-src]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      // Don't intercept download link clicks
      if (e.target.closest('.photo-btn-dl') || e.target.tagName === 'A') return;
      openLightbox(this.dataset.lightboxSrc, this.dataset.lightboxCaption);
    });
  });

  // "View" buttons inside photo overlays
  document.querySelectorAll('.photo-btn-view').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var card = this.closest('[data-lightbox-src]');
      if (card) openLightbox(card.dataset.lightboxSrc, card.dataset.lightboxCaption);
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', function (e) {
    if (lbWrap && !lbWrap.contains(e.target)) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ── 9. SCROLL REVEAL ────────────────────────────────────────
     IntersectionObserver: adds .in class when element enters
     viewport. The .rise CSS class handles the animation.
  ──────────────────────────────────────────────────────────── */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.rise').forEach(function (el) { obs.observe(el); });

  /* ── 10. TESTIMONIALS SLIDER — WP REST API ──────────────────
     Fetches testimonials from notes.aaron.kr, randomly selects
     up to MAX_SLIDES, injects slide HTML, then inits the slider.
     Photos come from _embedded['wp:featuredmedia'][0].source_url;
     falls back to initials avatar if unavailable.
  ──────────────────────────────────────────────────────────── */
  (function () {
    var API_URL    = 'https://notes.aaron.kr/wp-json/wp/v2/testimonials?per_page=20&_embed';
    var MAX_SLIDES = 10;
    var MAX_CHARS  = 300;  // truncate quotes at this many chars (at sentence boundary)
    var INTERVAL   = 6000; // ms between auto-advances
    var DURATION   = 6000; // must match INTERVAL for progress bar

    var track    = document.getElementById('tsmTrack');
    var dotsWrap = document.getElementById('tsmDots');
    var bar      = document.getElementById('tsmBar');
    var prevBtn  = document.getElementById('tsmPrev');
    var nextBtn  = document.getElementById('tsmNext');

    if (!track) return;

    /* ── Fetch + render ────────────────────────────────────── */
    fetch(API_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        /* shuffle and cap */
        var shuffled = data.slice().sort(function () { return Math.random() - 0.5; });
        var selected = shuffled.slice(0, MAX_SLIDES);

        track.innerHTML = selected.map(function (t) {
          /* ── Parse name / role from title ── */
          var raw  = (t.title && t.title.rendered) || '';
          /* decode common HTML entities */
          raw = raw.replace(/&#8217;/g, '\u2019')
                   .replace(/&#8216;/g, '\u2018')
                   .replace(/&amp;/g,   '&')
                   .replace(/&quot;/g,  '"');
          var comma = raw.indexOf(',');
          var name  = (comma > -1 ? raw.slice(0, comma) : raw).trim();
          var role  = (comma > -1 ? raw.slice(comma + 1) : '').trim();

          /* ── Initials ── */
          var parts   = name.split(/\s+/);
          var initial = (parts[0] ? parts[0][0] : '') +
                        (parts[1] ? parts[1][0] : '');

          /* ── Badge: detect academic by title keywords ── */
          var isAc       = /professor|full sail/i.test(raw);
          var badgeClass = isAc ? 'ac'       : 'sv';
          var badgeLabel = isAc ? 'Academic' : 'Client';
          var catClass   = isAc ? 'ac'       : 'svc';

          /* ── Strip HTML from quote ── */
          var tmp       = document.createElement('div');
          tmp.innerHTML = (t.content && t.content.rendered) || '';
          var quote     = (tmp.textContent || tmp.innerText || '').trim()
                            .replace(/\s+/g, ' ');

          /* ── Truncate at sentence boundary ── */
          if (quote.length > MAX_CHARS) {
            var cutoff = quote.lastIndexOf('.', MAX_CHARS);
            quote = (cutoff > MAX_CHARS * 0.5
              ? quote.slice(0, cutoff + 1)
              : quote.slice(0, MAX_CHARS)) + '\u2026';
          }

          /* ── Featured photo URL ── */
          /* Prefers custom REST field 'featured_image_url' added by mu-plugin.
             Falls back to _embedded if not present. */
          var photoUrl = '';
          try {
            if (t.featured_image_url) {
              photoUrl = t.featured_image_url;
            } else {
              var media = t._embedded && t._embedded['wp:featuredmedia'];
              if (media && media[0] && media[0].source_url) {
                photoUrl = media[0].source_url;
              }
            }
          } catch (e) { /* fall through to initials */ }

          return [
            '<div class="tsm-slide" data-cat="' + catClass + '">',
              '<div class="tsm-person">',
                '<div class="tsm-avatar-wrap">',
                  '<div class="tsm-avatar-ring"></div>',
                  '<div class="tsm-avatar"',
                       ' data-photo="'   + photoUrl + '"',
                       ' data-initial="' + initial  + '">',
                    '<span class="tsm-avatar-initial">' + initial + '</span>',
                  '</div>',
                '</div>',
                '<div class="tsm-name-block">',
                  '<div class="tsm-pname">' + name + '</div>',
                  '<div class="tsm-prole">' + role + '</div>',
                  '<span class="tsm-badge tsm-badge-' + badgeClass + '">' + badgeLabel + '</span>',
                '</div>',
              '</div>',
              '<div class="tsm-body">',
                '<p class="tsm-quote-text">' + quote + '</p>',
              '</div>',
            '</div>'
          ].join('');
        }).join('');

        initSlider();
      })
      .catch(function () {
        /* silently hide the section nav on error */
        var nav = document.querySelector('.tsm-nav');
        if (nav) nav.style.display = 'none';
      });

    /* ── Slider init (called after slides are in the DOM) ──── */
    function initSlider() {
      var slides  = Array.from(track.querySelectorAll('.tsm-slide'));
      var total   = slides.length;
      var current = 0;
      var timer   = null;
      var paused  = false;

      if (!total) return;

      /* ── Avatar photo injection ─────────────────────────── */
      slides.forEach(function (slide) {
        var avatar  = slide.querySelector('.tsm-avatar');
        if (!avatar) return;
        var photo   = avatar.dataset.photo;
        var initial = avatar.dataset.initial;
        if (!photo) return;
        var img = document.createElement('img');
        img.alt = initial || '';
        img.onload = function () {
          var span = avatar.querySelector('.tsm-avatar-initial');
          if (span) span.style.display = 'none';
          avatar.insertBefore(img, avatar.firstChild);
        };
        img.onerror = function () { /* keep initials */ };
        img.src = photo;
      });

      /* ── Dots ────────────────────────────────────────────── */
      if (dotsWrap) dotsWrap.innerHTML = '';
      slides.forEach(function (_, i) {
        var dot = document.createElement('button');
        dot.className = 'tsm-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        if (dotsWrap) dotsWrap.appendChild(dot);
      });

      function getDots() {
        return dotsWrap ? Array.from(dotsWrap.querySelectorAll('.tsm-dot')) : [];
      }

      /* ── Core navigation ─────────────────────────────────── */
      function goTo(index) {
        current = (index + total) % total;
        track.style.transform = 'translateX(-' + (current * 100) + '%)';
        getDots().forEach(function (d, i) {
          d.classList.toggle('active', i === current);
        });
        restartBar();
      }

      if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

      /* ── Progress bar ────────────────────────────────────── */
      function restartBar() {
        if (!bar) return;
        bar.style.transition = 'none';
        bar.style.transform  = 'scaleX(0)';
        void bar.offsetWidth; // force reflow
        bar.style.transition = 'transform ' + DURATION + 'ms linear';
        bar.style.transform  = 'scaleX(1)';
      }

      /* ── Auto-advance timer ──────────────────────────────── */
      function startTimer() {
        clearInterval(timer);
        timer = setInterval(function () {
          if (!paused) goTo(current + 1);
        }, INTERVAL);
      }

      function resetTimer() { clearInterval(timer); startTimer(); }

      /* ── Pause on hover / focus ──────────────────────────── */
      var stage = document.querySelector('.tsm-stage');
      if (stage) {
        stage.addEventListener('mouseenter', function () { paused = true;  });
        stage.addEventListener('mouseleave', function () { paused = false; });
        stage.addEventListener('focusin',    function () { paused = true;  });
        stage.addEventListener('focusout',   function () { paused = false; });
      }

      /* ── Touch / swipe ───────────────────────────────────── */
      var touchStartX = 0;
      if (stage) {
        stage.addEventListener('touchstart', function (e) {
          touchStartX = e.touches[0].clientX;
        }, { passive: true });
        stage.addEventListener('touchend', function (e) {
          var diff = touchStartX - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) {
            goTo(diff > 0 ? current + 1 : current - 1);
            resetTimer();
          }
        }, { passive: true });
      }

      /* ── Keyboard support ────────────────────────────────── */
      document.addEventListener('keydown', function (e) {
        var section = document.getElementById('testimonials');
        if (!section || !section.contains(document.activeElement)) return;
        if (e.key === 'ArrowLeft')  { goTo(current - 1); resetTimer(); }
        if (e.key === 'ArrowRight') { goTo(current + 1); resetTimer(); }
      });

      /* ── Init ────────────────────────────────────────────── */
      goTo(0);
      startTimer();
    }

  })();

})();
