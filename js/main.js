/**
 * Pepite Rouge - Main JavaScript
 * Handles animations, interactions, and UI behavior
 */
(function () {
  'use strict';

  var isMobile = window.innerWidth < 768;
  var isTouch = 'ontouchstart' in window;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== PRELOADER =====
  var preloader = document.getElementById('preloader');
  var wipe = document.getElementById('preloadWipe');
  var fill = document.getElementById('preloadFill');
  var pct = document.getElementById('preloadPercent');
  var imgs = document.querySelectorAll('img:not([loading="lazy"])');
  var loaded = 0;
  var total = imgs.length || 1;

  function updatePreload() {
    loaded++;
    var p = Math.min(Math.round((loaded / total) * 100), 100);
    fill.style.width = p + '%';
    pct.textContent = p + '%';
    if (loaded >= total) finishPreload();
  }

  imgs.forEach(function (img) {
    if (img.complete) { loaded++; return; }
    img.addEventListener('load', updatePreload);
    img.addEventListener('error', updatePreload);
  });

  var p0 = Math.round((loaded / total) * 100);
  fill.style.width = p0 + '%';
  pct.textContent = p0 + '%';
  if (loaded >= total) setTimeout(finishPreload, 600);
  setTimeout(finishPreload, 2500); // Hard timeout

  var preloadDone = false;

  function finishPreload() {
    if (preloadDone) return;
    preloadDone = true;
    setTimeout(function () {
      wipe.classList.add('wipe-in');
      setTimeout(function () {
        preloader.classList.add('done');
        wipe.classList.remove('wipe-in');
        wipe.classList.add('wipe-out');
        document.body.classList.remove('loading');
        setTimeout(function () {
          wipe.remove();
          heroEntrance();
        }, 450);
      }, 450);
    }, 300);
  }

  // ===== HERO ENTRANCE =====
  function heroEntrance() {
    // Steam
    document.querySelector('.steam-svg').classList.add('anim');

    // Split text
    var charIdx = 0;
    document.querySelectorAll('.hero-title .line').forEach(function (line) {
      var nodes = Array.from(line.childNodes);
      nodes.forEach(function (node) {
        if (node.nodeType === 3 && node.textContent.trim()) {
          var text = node.textContent;
          var frag = document.createDocumentFragment();
          text.split('').forEach(function (ch) {
            if (ch === ' ') {
              var sp = document.createElement('span');
              sp.style.width = '0.3em';
              sp.style.display = 'inline-block';
              frag.appendChild(sp);
              return;
            }
            var span = document.createElement('span');
            span.className = 'char';
            span.textContent = ch;
            span.style.animationDelay = (0.05 + charIdx * 0.03) + 's';
            frag.appendChild(span);
            charIdx++;
          });
          node.replaceWith(frag);
        }
      });
    });

    requestAnimationFrame(function () {
      document.querySelectorAll('.hero-title .char').forEach(function (c) {
        c.classList.add('in');
      });
    });

    // Badges
    setTimeout(function () {
      document.querySelectorAll('.hero-title .badge').forEach(function (b, i) {
        b.style.animationDelay = (0.6 + i * 0.15) + 's';
        b.classList.add('in');
      });
    }, 100);

    // Images
    setTimeout(function () { document.querySelector('.hero-red-bg').classList.add('in'); }, 200);
    setTimeout(function () { document.querySelector('.hero-img-main').classList.add('in'); }, 350);
    setTimeout(function () { document.querySelector('.hero-img-round').classList.add('in'); }, 500);
    setTimeout(function () {
      var m = document.querySelector('.hero-mascot');
      m.classList.add('in');
      setTimeout(function () {
        m.classList.remove('in');
        m.classList.add('float');
      }, 700);
    }, 700);
    setTimeout(function () { document.querySelector('.hero-doodle').classList.add('in'); }, 800);

    // Subtitle + actions
    setTimeout(function () { document.querySelector('.hero-subtitle').classList.add('in'); }, 600);
    setTimeout(function () { document.querySelector('.hero-actions').classList.add('in'); }, 700);

    // Particles
    if (!isMobile) createParticles();
  }

  // ===== PARTICLES =====
  function createParticles() {
    var container = document.querySelector('.hero-inner');
    for (var i = 0; i < 8; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      var size = 6 + Math.random() * 12;
      p.style.setProperty('--p-size', size + 'px');
      p.style.setProperty('--p-opacity', (0.04 + Math.random() * 0.06).toFixed(2));
      p.style.setProperty('--p-dur', (6 + Math.random() * 8) + 's');
      p.style.setProperty('--p-delay', (Math.random() * 5) + 's');
      p.style.setProperty('--p-drift', (-15 - Math.random() * 20) + 'px');
      p.style.left = (Math.random() * 100) + '%';
      p.style.top = (10 + Math.random() * 80) + '%';
      container.appendChild(p);
    }
  }

  // ===== CUSTOM CURSOR =====
  if (!isTouch && !isMobile) {
    var cursor = document.getElementById('cursor');
    var mx = 0, my = 0, rx = 0, ry = 0, cursorMoving = false;
    var cursorDot = cursor.children[0];
    var cursorRing = cursor.children[1];
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (!cursor.classList.contains('active')) cursor.classList.add('active');
      if (!cursorMoving) { cursorMoving = true; cursorLoop(); }
    }, { passive: true });
    var hoverSel = 'a, button, .product-card, .category-card, .tab-btn';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverSel)) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverSel)) cursor.classList.remove('hover');
    });

    function cursorLoop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursorDot.style.transform = 'translate(' + mx + 'px, ' + my + 'px) translate(-50%, -50%)';
      cursorRing.style.transform = 'translate(' + rx + 'px, ' + ry + 'px) translate(-50%, -50%)';
      if (Math.abs(mx - rx) > 0.5 || Math.abs(my - ry) > 0.5) {
        requestAnimationFrame(cursorLoop);
      } else { cursorMoving = false; }
    }
  }

  // ===== MAGNETIC BUTTONS =====
  if (!isTouch) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        btn.style.transition = 'transform 0.5s var(--spring)';
        btn.style.transform = 'translate(0,0)';
        setTimeout(function () { btn.style.transition = ''; }, 500);
      });
    });
  }

  // ===== RIPPLE EFFECT =====
  document.querySelectorAll('.btn-primary, .btn-cta, .btn-white, .newsletter-form button').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var r = this.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(r.width, r.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });

  // ===== 3D TILT =====
  if (!isTouch && !isMobile) {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        card.style.transition = 'none';
        card.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-5px)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.5s var(--ease-out-expo)';
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      });
    });
  }

  // ===== TAB INDICATOR =====
  var tabIndicator = document.getElementById('tabIndicator');
  var tabs = document.querySelectorAll('.tab-btn');

  function moveIndicator(btn) {
    var r = btn.getBoundingClientRect();
    var pr = btn.parentElement.getBoundingClientRect();
    tabIndicator.style.left = (r.left - pr.left) + 'px';
    tabIndicator.style.width = r.width + 'px';
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      moveIndicator(btn);
    });
  });

  requestAnimationFrame(function () {
    var active = document.querySelector('.tab-btn.active');
    if (active) moveIndicator(active);
  });

  // ===== SCROLL OBSERVER =====
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      if (e.target.hasAttribute('data-counter')) animateCounters(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children, .clip-reveal, .footer-socials, [data-counter]'
  ).forEach(function (el) { obs.observe(el); });

  // ===== COUNTER ANIMATION =====
  function animateCounters(container) {
    container.querySelectorAll('[data-target]').forEach(function (el) {
      var target = parseInt(el.dataset.target);
      var suffix = el.dataset.suffix || '';
      var duration = 2000;
      var start = performance.now();

      function step(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    });
  }

  // ===== UNIFIED SCROLL HANDLER =====
  var scrollProgress = document.getElementById('scrollProgress');
  var scrollBtn = document.getElementById('scrollTop');
  var navbar = document.getElementById('navbar');

  window.addEventListener('scroll', function () {
    var s = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    scrollProgress.style.transform = 'scaleX(' + (s / max) + ')';
    // Navbar shadow
    navbar.classList.toggle('scrolled', s > 20);
    // Scroll-to-top
    scrollBtn.classList.toggle('visible', s > 400);
  }, { passive: true });

  scrollBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== MOBILE NAV =====
  document.getElementById('navToggle').addEventListener('click', function () {
    document.getElementById('navLinks').classList.toggle('active');
  });

  // ===== FORM HELPERS =====
  function showFormFeedback(form, success, message) {
    var existing = form.querySelector('.form-feedback');
    if (existing) existing.remove();

    var div = document.createElement('div');
    div.className = 'form-feedback ' + (success ? 'form-feedback-success' : 'form-feedback-error');
    div.textContent = message;
    form.appendChild(div);

    setTimeout(function () { div.remove(); }, 5000);
  }

  function setFormLoading(btn, loading) {
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = 'ENVOI...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
      btn.disabled = false;
      btn.style.opacity = '';
    }
  }

  // ===== NEWSLETTER FORM =====
  var newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');
      var email = this.querySelector('input[type="email"]').value;

      setFormLoading(btn, true);
      fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        showFormFeedback(newsletterForm, data.success, data.message);
        if (data.success) newsletterForm.reset();
      })
      .catch(function () {
        showFormFeedback(newsletterForm, false, 'Erreur de connexion. Reessayez.');
      })
      .finally(function () { setFormLoading(btn, false); });
    });
  }

  // ===== CONTACT FORM =====
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = this.querySelector('button[type="submit"]');

      var data = {
        name: this.querySelector('#name').value,
        email: this.querySelector('#email').value,
        subject: this.querySelector('#subject').value,
        message: this.querySelector('#message').value
      };

      setFormLoading(btn, true);
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(function (r) { return r.json(); })
      .then(function (result) {
        showFormFeedback(contactForm, result.success, result.message);
        if (result.success) contactForm.reset();
      })
      .catch(function () {
        showFormFeedback(contactForm, false, 'Erreur de connexion. Reessayez.');
      })
      .finally(function () { setFormLoading(btn, false); });
    });
  }

})();
