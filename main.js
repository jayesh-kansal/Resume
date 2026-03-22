/* ================================================================
   JAYESH KANSAL — main.js
   Custom cursor · Navbar scroll · Mobile menu · Scroll reveal
   Count-up animation · Smooth micro-interactions
   ================================================================ */

(function () {
  'use strict';

  /* ── Custom cursor ──────────────────────────────────────── */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    // Smooth follower with lerp
    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top  = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      cursor.style.opacity = '1';
      follower.style.opacity = '1';
    });
  }

  /* ── Navbar scroll state ────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu toggle ─────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      const open = navbar.classList.toggle('mobile-open');
      const spans = navToggle.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'translateY(7.5px) rotate(45deg)';
        spans[1].style.transform = 'translateY(-7.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.transform = '';
      }
    });

    // Close on link click
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          navbar.classList.remove('mobile-open');
          navToggle.querySelectorAll('span').forEach(s => s.style.transform = '');
        });
      });
    }
  }

  /* ── Scroll reveal ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings in the same parent
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 400);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Count-up animation ─────────────────────────────────── */
  const countEls = document.querySelectorAll('.count-up');

  if (countEls.length > 0 && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1600;
          const start = performance.now();

          function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
          }

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.round(easeOutQuart(progress) * target);
            el.textContent = value;
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    countEls.forEach(el => countObserver.observe(el));
  }

  /* ── Contact form ───────────────────────────────────────── */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = form.querySelector('#name')?.value.trim();
      const email   = form.querySelector('#email')?.value.trim();
      const message = form.querySelector('#message')?.value.trim();

      if (!name || !email || !message) {
        // Shake invalid empty fields
        [
          { el: form.querySelector('#name'),    val: name },
          { el: form.querySelector('#email'),   val: email },
          { el: form.querySelector('#message'), val: message },
        ].forEach(({ el, val }) => {
          if (!val && el) {
            el.style.borderColor = '#c0392b';
            el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
          }
        });
        return;
      }

      // Simulate send — swap this for Formspree / EmailJS before going live
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        if (formSuccess) {
          formSuccess.hidden = false;
          setTimeout(() => { formSuccess.hidden = true; }, 5000);
        }
      }, 800);
    });
  }

  /* ── Smooth hover tilt on photo ─────────────────────────── */
  const photoFrame = document.querySelector('.photo-frame');
  if (photoFrame) {
    photoFrame.addEventListener('mousemove', (e) => {
      const rect = photoFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      photoFrame.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    photoFrame.addEventListener('mouseleave', () => {
      photoFrame.style.transform = '';
    });
  }

  /* ── Active nav link highlight based on URL ─────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

})();
