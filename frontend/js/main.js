// main.js — Azad Girls Mat. Hr. Sec. School
// Light Green + Lime Yellow Theme

/* ── Navbar & Mobile Menu ──────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navMenu');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  // Back-to-top button
  if (backToTop) {
    window.scrollY > 80 ? backToTop.classList.add('show') : backToTop.classList.remove('show');
  }
  // Active nav link highlighting
  const sp = window.scrollY + 100;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector('.nav-link[href="#' + sec.id + '"]');
    if (!link) return;
    if (sp >= sec.offsetTop && sp < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    }
  });
});

if (hamburger) {
  hamburger.addEventListener('click', () => navMenu && navMenu.classList.toggle('open'));
}
document.querySelectorAll('.nav-link').forEach(link =>
  link.addEventListener('click', () => navMenu && navMenu.classList.remove('open'))
);

/* ── Hero Slider ───────────────────────────────────────── */
const track   = document.getElementById('sliderTrack');
const dots    = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('slidePrev');
const nextBtn = document.getElementById('slideNext');
const slides  = document.querySelectorAll('.slide');
let current = 0, sliderTimer;

function goTo(idx) {
  current = (idx + slides.length) % slides.length;
  if (track) track.style.transform = 'translateX(-' + (current * 100) + '%)';
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}
function resetSliderTimer() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goTo(current + 1), 5000);
}

if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetSliderTimer(); });
if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetSliderTimer(); });
dots.forEach((dot, i) => dot.addEventListener('click', () => { goTo(i); resetSliderTimer(); }));

// Touch/swipe support
let touchStartX = 0;
if (track) {
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetSliderTimer(); }
  });
}
goTo(0);
resetSliderTimer();

/* ── Scroll Reveal Animation ───────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), (i % 5) * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Counter Animation ─────────────────────────────────── */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let curr = 0;
      const step = target / 112;
      const t = setInterval(() => {
        curr += step;
        if (curr >= target) { curr = target; clearInterval(t); }
        el.textContent = Math.floor(curr).toLocaleString() + suffix;
      }, 16);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

/* ── Gallery Filter Tabs ───────────────────────────────── */
document.querySelectorAll('.gtab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gtab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.getAttribute('data-cat');
    document.querySelectorAll('.gitem').forEach(item => {
      item.style.display = (cat === 'all' || item.getAttribute('data-cat') === cat) ? '' : 'none';
    });
  });
});

/* ── Enquiry Form — validation + API submission ─────────── */
const form = document.getElementById('enquiryForm');
if (form) {
  const rules = {
    studentName:   { required: true, minLength: 2, label: 'Student name' },
    parentName:    { required: true, minLength: 2, label: 'Parent name' },
    email:         { required: true, pattern: /^\S+@\S+\.\S+$/, label: 'Valid email' },
    phone:         { required: true, pattern: /^[0-9]{10}$/, label: '10-digit phone number' },
    classApplying: { required: true, label: 'Class' }
  };

  function validateField(name, input) {
    const rule   = rules[name];
    const val    = input.value.trim();
    const errEl  = document.getElementById(name + 'Error');
    let error    = '';
    if (rule.required && !val)                             error = rule.label + ' is required';
    else if (rule.minLength && val.length < rule.minLength) error = rule.label + ' must be at least ' + rule.minLength + ' characters';
    else if (rule.pattern && val && !rule.pattern.test(val)) error = 'Please enter a valid ' + rule.label.toLowerCase();
    input.classList.toggle('error', !!error);
    if (errEl) { errEl.textContent = error; errEl.classList.toggle('show', !!error); }
    return !error;
  }

  // Real-time validation
  Object.keys(rules).forEach(name => {
    const input = form.querySelector('[name="' + name + '"]');
    if (!input) return;
    input.addEventListener('blur', () => validateField(name, input));
    input.addEventListener('input', () => { if (input.classList.contains('error')) validateField(name, input); });
  });

  // Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(name => {
      const input = form.querySelector('[name="' + name + '"]');
      if (input && !validateField(name, input)) valid = false;
    });
    if (!valid) return;

    const btn  = form.querySelector('.btn-block');
    const orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const data = {};
    Object.keys(rules).forEach(name => {
      const el = form.querySelector('[name="' + name + '"]');
      if (el) data[name] = el.value.trim();
    });
    const msgEl = form.querySelector('[name="message"]');
    data.message = msgEl ? msgEl.value.trim() : '';

    try {
      const res    = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        form.style.display = 'none';
        const successEl = document.getElementById('formSuccess');
        if (successEl) successEl.classList.add('show');
      } else {
        alert(result.message || 'Something went wrong. Please try again.');
        btn.disabled = false;
        btn.textContent = orig;
      }
    } catch (err) {
      alert('Network error. Please check your connection and try again.');
      btn.disabled = false;
      btn.textContent = orig;
    }
  });
}

/* ── Smooth Scroll for anchor links ────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  });
});