

document.addEventListener('DOMContentLoaded', () => {

  const cursor     = document.querySelector('.cursor');
  const cursorRing = document.querySelector('.cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Lag the ring behind
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover expand
  document.querySelectorAll('a, button, .card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });


  const shoe     = document.getElementById('shoeWrap');
  const headline = document.querySelector('.headline');
  const arcSvg   = document.querySelector('.arc-svg');
  const dotOrb   = document.querySelector('.dot-orb');

  const hero = document.querySelector('.hero');
  hero.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    if (shoe) {
      shoe.style.transform = `translate(calc(-50% + ${dx * -16}px), calc(-50% + ${dy * -12}px)) scale(1)`;
    }
    if (headline) {
      headline.style.transform = `translate(calc(-50% + ${dx * 7}px), calc(-50% + ${dy * 5}px))`;
    }
    if (arcSvg) {
      arcSvg.style.transform = `translate(calc(-50% + ${dx * 10}px), calc(-50% + ${dy * 8}px))`;
    }
  });


  const revealEls = document.querySelectorAll(
    '.section-label, .craft-heading, .craft-body, .craft-stat-row, ' +
    '.collection-title, .collection-link, .card, ' +
    '.quote-mark, .quote-text, .quote-attr, .footer-top'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => {
    observer.observe(el);
  });

 
  const craftImg = document.querySelector('.craft-image-col img');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Craft section parallax
    if (craftImg) {
      const section = document.querySelector('.section-craft');
      const rect    = section.getBoundingClientRect();
      const ratio   = 1 - (rect.top / window.innerHeight);
      const offset  = Math.min(Math.max(ratio * 40, 0), 60);
      craftImg.style.transform = `scale(1.1) translateY(-${offset * 0.4}px)`;
    }
  }, { passive: true });

 
  const statNums = document.querySelectorAll('.stat-num');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCount(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCount(el, target) {
    const suffix   = el.dataset.suffix || '';
    const duration = 1400;
    const start    = performance.now();

    (function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    })(performance.now());
  }

  
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: var(--blue-cta);
    z-index: 9999;
    transition: width 0.1s linear;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const docH    = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / docH) * 100;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });

});