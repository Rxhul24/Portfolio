/* main.js — UI behavior, particles init, simple animations, skill bars
   Lightweight and stable.
*/
(function () {
  function isLowEndDevice() {
    if (navigator.deviceMemory !== undefined && navigator.deviceMemory < 4) return true;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth < 768) return true;
    return false;
  }

  function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    const cfg = {
      particles: {
        number: { value: (window.innerWidth < 768) ? 8 : 18, density: { enable: true, value_area: 1500 } },
        color: { value: ['#60a5fa', '#3b82f6'] },
        shape: { type: ['circle'] },
        opacity: { value: 0.18 },
        size: { value: 2.2, random: true },
        line_linked: { enable: true, distance: 120, color: '#60a5fa', opacity: 0.12, width: 1 },
        move: { enable: true, speed: (window.innerWidth < 768) ? 0.3 : 0.7 }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: window.innerWidth > 1024, mode: 'grab' }, onclick: { enable: false }, resize: true },
        modes: { grab: { distance: 120, line_linked: { opacity: 0.8 } } }
      },
      retina_detect: false
    };
    if (!isLowEndDevice()) particlesJS('particles-js', cfg);
    else {
      const p = document.getElementById('particles-js');
      if (p) p.style.background = 'radial-gradient(circle at 10% 10%, rgba(96,165,250,0.02), transparent 10%), radial-gradient(circle at 90% 90%, rgba(59,130,246,0.02), transparent 10%)';
    }
  }

  function enableHardwareAcceleration() {
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;transform:translateZ(0);top:-100px;left:-100px;width:1px;height:1px;opacity:.01;pointer-events:none';
    document.body.appendChild(el);
    window.addEventListener('load', () => document.body.classList.add('loaded'));
  }

  function initCodeHighlighting() {
    const pre = document.querySelector('.code-animation pre');
    if (!pre) return;
    const codeText = pre.textContent;
    // Minimal safe highlighting — avoid complex regex replacing DOM-unsafe characters
    const html = codeText
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|new)\b/g, '<span class="kw">$1</span>')
      .replace(/(['"`])((?:\\.|[^\\])*?)\1/g, '<span class="str">$&</span>')
      .replace(/(\/\/.*$)/gm, '<span class="com">$1</span>');
    pre.innerHTML = '<code>' + html + '</code>';
  }

  function initTerminalTyping() {
    const typingEl = document.querySelector('.terminal .typing');
    if (!typingEl) return;
    const phrases = ['node server.js', 'npm run build', 'git status'];
    let i = 0, j = 0, deleting = false;
    function tick() {
      const cur = phrases[i];
      if (!deleting) {
        typingEl.textContent = cur.slice(0, j + 1);
        j++;
        if (j === cur.length) { deleting = true; setTimeout(tick, 700); return; }
      } else {
        typingEl.textContent = cur.slice(0, j - 1);
        j--;
        if (j === 0) { deleting = false; i = (i + 1) % phrases.length; setTimeout(tick, 400); return; }
      }
      setTimeout(tick, 50 + Math.random() * 80);
    }
    setTimeout(tick, 600);
  }

  function initSkillBars() {
    document.querySelectorAll('.skill-progress').forEach(el => {
      const percent = el.dataset.progress || 70;
      el.style.width = '0%';
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            el.style.width = percent + '%';
            obs.disconnect();
          }
        });
      }, { threshold: 0.25 });
      obs.observe(el);
    });
  }

  function initAppear() {
    const els = document.querySelectorAll('.section-title, .project, .skill-card, .contact-card, .about-text p');
    els.forEach((el, idx) => {
      el.style.opacity = 0;
      el.style.transform = 'translateY(12px)';
      setTimeout(() => {
        el.style.transition = 'all .6s cubic-bezier(.2,.9,.2,1)';
        el.style.opacity = 1;
        el.style.transform = 'none';
      }, 200 + idx * 70);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    enableHardwareAcceleration();
    initParticles();
    initCodeHighlighting();
    initTerminalTyping();
    initSkillBars();
    initAppear();

    // header scroll class
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > 50) header.classList.add('scrolled'); else header.classList.remove('scrolled');
    }, { passive: true });
  });
})();
