document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealTargets = document.querySelectorAll(
  '.card, .about-grid, .contact-link, .section-head, .hero-sub, .hero-actions, .about-badges span'
);

if (!prefersReducedMotion) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  revealTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(60px) scale(0.94)';
    el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${(i % 8) * 0.05}s, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${(i % 8) * 0.05}s`;
    observer.observe(el);
  });
}

const bgGrid = document.querySelector('.bg-grid');
const scrollProgress = document.getElementById('scrollProgress');

function onScroll() {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (docHeight > 0 ? (scrollY / docHeight) * 100 : 0) + '%';

  if (!prefersReducedMotion) {
    bgGrid.style.transform = `translateY(${scrollY * 0.15}px)`;
  }
}
window.addEventListener('scroll', onScroll);
onScroll();

// 3D tilt on project/contact cards for pointer devices
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.card:not(.card-more)').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top) / rect.height - 0.5) * -10;
      const rotateY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


