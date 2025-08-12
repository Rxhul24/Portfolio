/* Simple, stable smooth scroll for anchor links.
   No locomotive; uses requestAnimationFrame easing.
*/
(function () {
  const HEADER_OFFSET = 72;
  const DURATION = 650;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function scrollToY(targetY, duration = DURATION) {
    const start = window.pageYOffset;
    const diff = targetY - start;
    let startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      const time = ts - startTime;
      const pct = Math.min(time / duration, 1);
      window.scrollTo(0, Math.round(start + diff * easeInOutCubic(pct)));
      if (time < duration) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const rect = target.getBoundingClientRect();
    const targetY = window.pageYOffset + rect.top - HEADER_OFFSET;
    scrollToY(targetY);
    // close mobile menu if open
    const menu = document.querySelector('.menu');
    const hamb = document.querySelector('.hamburger');
    if (menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      if (hamb) hamb.setAttribute('aria-expanded', 'false');
      menu.style.display = '';
    }
  }, { passive: false });

  document.addEventListener('DOMContentLoaded', () => {
    // simple mobile menu toggle
    const hamb = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    if (hamb && menu) {
      hamb.addEventListener('click', () => {
        const open = menu.classList.toggle('active');
        hamb.setAttribute('aria-expanded', open ? 'true' : 'false');
        menu.style.display = open ? 'flex' : '';
      });
    }
  });
})();
