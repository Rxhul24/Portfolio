/**
 * Lightweight robot-guide for Rahul Thakur
 * Uses GSAP (loaded via CDN)
 */
(function () {
  let container, speechText;
  let isMobile = false, followMouse = true, animActive = false;
  let mouseX = 0, mouseY = 0, lastUpdate = 0;

  const messages = {
    home: "Hi! I'm Rahul — welcome to my portfolio.",
    about: "I build practical web apps and APIs. I like shipping working features.",
    skills: "Average-to-good across frontend and backend. Continually learning ML.",
    projects: "Projects include SkillBridge and AgroShield — small, useful, tested.",
    contact: "Reach me at rahulthakurk024@gmail.com or 7354627793."
  };

  function detectMobile() {
    isMobile = (window.innerWidth <= 768) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isMobile) followMouse = false;
  }

  function create() {
    container = document.getElementById('robot-guide-container');
    if (!container) return;
    container.innerHTML = `
      <div class="robot" aria-hidden="true">
        <div class="body">
          <div class="head"><div class="visor"></div></div>
        </div>
      </div>
      <div id="robot-speech" class="robot-speech" role="status" aria-live="polite"><span id="robot-speech-text">${messages.home}</span></div>
    `;
    const style = document.createElement('style');
    style.textContent = `
      #robot-guide-container{position:fixed;width:110px;height:110px;top:90px;right:30px;z-index:40;pointer-events:none}
      .robot{width:100%;height:100%;display:flex;align-items:center;justify-content:center}
      .robot .body{width:70px;height:70px;background:linear-gradient(180deg,#0b1220,#07111a);border-radius:12px;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 30px rgba(2,8,23,0.6)}
      .robot .head{width:56px;height:28px;background:#071426;border-radius:8px;display:flex;align-items:center;justify-content:center}
      .visor{width:46px;height:8px;background:linear-gradient(90deg,#60a5fa,#3b82f6);border-radius:4px;opacity:0.95}
      #robot-speech{position:absolute;right:130px;top:12px;background:rgba(12,14,16,0.94);color:#eaf6ff;padding:10px 12px;border-radius:10px;max-width:260px;box-shadow:0 10px 30px rgba(2,8,23,0.6);font-size:13px}
      @media(max-width:768px){#robot-guide-container{right:18px;bottom:18px;top:auto} #robot-speech{display:none}}
    `;
    document.head.appendChild(style);
    speechText = document.getElementById('robot-speech-text');
  }

  function initMouse() {
    document.addEventListener('mousemove', throttle((e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (!animActive && followMouse) { requestAnimationFrame(followMouseFn); animActive = true; }
    }, 16), { passive: true });
  }

  function followMouseFn() {
    if (!container || isMobile || !followMouse) { animActive = false; return; }
    const now = performance.now();
    if (now - lastUpdate < 12) { requestAnimationFrame(followMouseFn); return; }
    lastUpdate = now;
    const targetX = mouseX - container.offsetWidth / 2;
    const targetY = mouseY - container.offsetHeight / 2;
    const curRect = container.getBoundingClientRect();
    const curLeft = curRect.left;
    const curTop = curRect.top;
    const newX = curLeft + (targetX - curLeft) / 6;
    const newY = curTop + (targetY - curTop) / 6;
    gsap.to(container, { left: newX, top: newY, duration: 0.12, ease: 'power1.out', overwrite: 'auto', onComplete: () => {
      animActive = false;
      if (followMouse) requestAnimationFrame(followMouseFn);
    }});
  }

  function idleFloat() {
    gsap.to('.robot .body', { y: '-=6', duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  function initScrollListener() {
    let lastSection = '';
    const sections = ['home', 'about', 'skills', 'projects', 'contact'];
    function check() {
      for (let s of sections) {
        const el = document.getElementById(s);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.25) {
          if (lastSection !== s) {
            lastSection = s;
            speakForSection(s);
          }
          break;
        }
      }
    }
    window.addEventListener('scroll', throttle(check, 150), { passive: true });
    check();
  }

  function speakForSection(sec) {
    const text = messages[sec] || messages.home;
    if (speechText) {
      speechText.textContent = text;
      gsap.fromTo('#robot-speech', { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease: 'power2.out' });
      setTimeout(() => gsap.to('#robot-speech', { opacity: 0, duration: .35 }), 3500);
    }
  }

  function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  function init() {
    detectMobile();
    create();
    if (!isMobile) initMouse();
    initScrollListener();
    idleFloat();
  }

  function detectMobile() {
    isMobile = (window.innerWidth <= 768) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isMobile) followMouse = false;
  }

  document.addEventListener('DOMContentLoaded', init);
})();
