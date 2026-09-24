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
const glowField = document.querySelector('.glow-field');
const scrollProgress = document.getElementById('scrollProgress');

function onScroll() {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 40);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (docHeight > 0 ? (scrollY / docHeight) * 100 : 0) + '%';

  if (!prefersReducedMotion) {
    bgGrid.style.transform = `translateY(${scrollY * 0.15}px)`;
    glowField.style.transform = `translateY(${scrollY * 0.06}px)`;
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

// Custom magnetic cursor
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.documentElement.classList.add('has-custom-cursor');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('.btn, .card, .contact-link, .terminal-trigger, .whatsapp-float, .nav-links a').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
  });

  // Magnetic pull on standalone buttons (cards already have their own tilt effect)
  document.querySelectorAll('.btn, .terminal-trigger, .whatsapp-float').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}

// Ambient particle canvas that reacts to the cursor
const particleCanvas = document.getElementById('particleCanvas');
if (particleCanvas && !prefersReducedMotion) {
  const ctx = particleCanvas.getContext('2d');
  let particles = [];
  const mouse = { x: null, y: null };

  function resizeCanvas() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  }

  function initParticles() {
    const count = Math.min(70, Math.floor((particleCanvas.width * particleCanvas.height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * particleCanvas.width,
      y: Math.random() * particleCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));
  }

  resizeCanvas();
  initParticles();
  window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
  });
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function drawParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;
    });

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(124,92,255,${(1 - dist / 140) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          ctx.strokeStyle = `rgba(34,211,238,${(1 - dist / 110) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = 'rgba(232,232,240,0.5)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// Terminal / command palette
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalInput = document.getElementById('terminalInput');
const terminalBody = document.getElementById('terminalBody');
const terminalTrigger = document.getElementById('terminalTrigger');

function openTerminal() {
  terminalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => terminalInput.focus(), 10);
}
function closeTerminal() {
  terminalOverlay.hidden = true;
  document.body.style.overflow = '';
}

terminalTrigger.addEventListener('click', openTerminal);
terminalOverlay.addEventListener('click', (e) => {
  if (e.target === terminalOverlay) closeTerminal();
});

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
    e.preventDefault();
    openTerminal();
  } else if (e.key === 'Escape' && !terminalOverlay.hidden) {
    closeTerminal();
  }
});

const terminalCommands = {
  proyectos: { goto: '#proyectos' },
  proyecto: { goto: '#proyectos' },
  about: { goto: '#about' },
  contacto: { goto: '#contacto' },
  contact: { goto: '#contacto' },
  whatsapp: { open: 'https://wa.me/56992259960' },
  github: { open: 'https://github.com/tmontes30' },
  linkedin: { open: 'https://www.linkedin.com/in/tomas-montesa/' },
  whoami: 'Tomás Montes — desarrollador full-stack. Construye software que resuelve problemas reales.',
  sudo: 'Permiso denegado. Pero un mensaje por WhatsApp seguro funciona — probá "whatsapp".',
};

const terminalState = { mode: null, guessTarget: 0, guessAttempts: 0, history: [] };

const terminalJokes = [
  '¿Por qué los programadores prefieren el frío? Porque odian los bugs.',
  'Hay 10 tipos de personas: las que entienden binario y las que no.',
  '99 problemas y todos son de CSS.',
  'Un SQL entra a un bar, se acerca a dos mesas y pregunta: "¿Puedo hacer un JOIN?"',
  'Mi código no tiene bugs, solo funcionalidades inesperadas.',
];
const terminalFortunes = [
  'El mejor código es el que no tenés que escribir.',
  'Todo bug es una feature que todavía no documentaste.',
  'Primero hacelo funcionar, después hacelo bien, después hacelo rápido.',
  'La deuda técnica siempre cobra intereses.',
  'Un commit sin mensaje claro es un regalo envenenado para tu yo del futuro.',
];

function printTerminalLine(text) {
  const p = document.createElement('p');
  p.textContent = text;
  terminalBody.appendChild(p);
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

function typeTerminalLines(lines, delay) {
  let i = 0;
  (function next() {
    if (i >= lines.length) return;
    printTerminalLine(lines[i]);
    i++;
    setTimeout(next, delay);
  })();
}

function handleGuessInput(raw) {
  if (/^(salir|exit|cancelar)$/i.test(raw)) {
    printTerminalLine('Juego cancelado. El número era ' + terminalState.guessTarget + '.');
    terminalState.mode = null;
    return;
  }
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 100) {
    printTerminalLine('Escribí un número entero entre 1 y 100 (o "salir").');
    return;
  }
  terminalState.guessAttempts++;
  if (n === terminalState.guessTarget) {
    printTerminalLine(`¡Exacto! Era ${n}. Lo lograste en ${terminalState.guessAttempts} intento${terminalState.guessAttempts === 1 ? '' : 's'}.`);
    terminalState.mode = null;
  } else if (n < terminalState.guessTarget) {
    printTerminalLine('Más alto ↑');
  } else {
    printTerminalLine('Más bajo ↓');
  }
}

function playRps(userChoiceRaw) {
  const map = { piedra: 'piedra', rock: 'piedra', papel: 'papel', paper: 'papel', tijera: 'tijera', tijeras: 'tijera', scissors: 'tijera' };
  const userChoice = map[(userChoiceRaw || '').toLowerCase()];
  if (!userChoice) {
    printTerminalLine('Uso: rps piedra|papel|tijera');
    return;
  }
  const options = ['piedra', 'papel', 'tijera'];
  const cpuChoice = options[Math.floor(Math.random() * 3)];
  let result;
  if (userChoice === cpuChoice) {
    result = 'Empate';
  } else if (
    (userChoice === 'piedra' && cpuChoice === 'tijera') ||
    (userChoice === 'papel' && cpuChoice === 'piedra') ||
    (userChoice === 'tijera' && cpuChoice === 'papel')
  ) {
    result = 'Ganaste';
  } else {
    result = 'Perdiste';
  }
  printTerminalLine(`Vos: ${userChoice} — CPU: ${cpuChoice} → ${result}`);
}

function runCalc(expr) {
  if (!/^[0-9+\-*/().\s]+$/.test(expr) || !expr.trim()) {
    printTerminalLine('Uso: calc <expresión> — solo números y + - * / ( )');
    return;
  }
  try {
    const result = Function('"use strict";return (' + expr + ')')();
    printTerminalLine(expr.trim() + ' = ' + result);
  } catch (err) {
    printTerminalLine('Expresión inválida.');
  }
}

function runHackAnimation() {
  typeTerminalLines(
    [
      'Iniciando protocolo...',
      'Escaneando puertos... listo',
      'Buscando mainframe... encontrado',
      'Bypassing firewall [■■■■■■□□□□] 60%',
      'Bypassing firewall [■■■■■■■■■■] 100%',
      'Acceso concedido.',
      '(Tranquilo, esto no hackea nada — es solo un chiste)',
    ],
    450
  );
}

let matrixCanvas = null;
let matrixFrame = null;
let matrixClickHandler = null;
let matrixKeyHandler = null;
function startMatrix() {
  matrixCanvas = document.createElement('canvas');
  matrixCanvas.id = 'matrixCanvas';
  matrixCanvas.style.position = 'fixed';
  matrixCanvas.style.inset = '0';
  matrixCanvas.style.zIndex = '400';
  matrixCanvas.style.pointerEvents = 'none';
  document.body.appendChild(matrixCanvas);
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  const ctx = matrixCanvas.getContext('2d');
  const fontSize = 16;
  const columns = Math.floor(matrixCanvas.width / fontSize);
  const drops = new Array(columns).fill(1);
  const chars = 'アイウエオカキクケコサシスセソ0123456789';

  function draw() {
    ctx.fillStyle = 'rgba(4,4,8,0.08)';
    ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    ctx.fillStyle = '#4ade80';
    ctx.font = fontSize + 'px monospace';
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, y * fontSize);
      if (y * fontSize > matrixCanvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });
    matrixFrame = requestAnimationFrame(draw);
  }
  draw();

  matrixClickHandler = () => stopMatrix();
  matrixKeyHandler = () => stopMatrix();
  setTimeout(() => {
    document.addEventListener('click', matrixClickHandler);
    document.addEventListener('keydown', matrixKeyHandler);
  }, 0);
}
function stopMatrix() {
  if (matrixFrame) cancelAnimationFrame(matrixFrame);
  if (matrixCanvas) {
    matrixCanvas.remove();
    matrixCanvas = null;
  }
  if (matrixClickHandler) {
    document.removeEventListener('click', matrixClickHandler);
    matrixClickHandler = null;
  }
  if (matrixKeyHandler) {
    document.removeEventListener('keydown', matrixKeyHandler);
    matrixKeyHandler = null;
  }
}
function toggleMatrix() {
  if (matrixCanvas) {
    stopMatrix();
  } else {
    printTerminalLine('Matrix activado — tocá, hacé clic o presioná cualquier tecla para volver.');
    closeTerminal();
    startMatrix();
  }
}

terminalInput.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = terminalInput.value.trim();
  if (!raw) return;

  printTerminalLine('guest@cavedevz:~$ ' + raw);
  terminalInput.value = '';

  if (terminalState.mode === 'guess') {
    handleGuessInput(raw);
    return;
  }

  terminalState.history.push(raw);
  const cmd = raw.toLowerCase();

  if (cmd === 'clear') {
    terminalBody.innerHTML = '';
    return;
  }
  if (cmd === 'help') {
    printTerminalLine('Navegación: proyectos, about, contacto, whatsapp, github, linkedin');
    printTerminalLine('Diversión: joke, fortune, coinflip, dice, guess, rps <piedra|papel|tijera>, calc <expresión>, time, matrix, hack, history');
    printTerminalLine('Otros: whoami, sudo, clear');
    return;
  }
  if (cmd === 'history') {
    const prev = terminalState.history.slice(0, -1);
    if (!prev.length) printTerminalLine('(todavía no escribiste otros comandos)');
    else prev.forEach((h, idx) => printTerminalLine(`${idx + 1}  ${h}`));
    return;
  }
  if (cmd === 'matrix') { toggleMatrix(); return; }
  if (cmd === 'hack') { runHackAnimation(); return; }
  if (cmd === 'joke' || cmd === 'chiste') { printTerminalLine(terminalJokes[Math.floor(Math.random() * terminalJokes.length)]); return; }
  if (cmd === 'fortune') { printTerminalLine(terminalFortunes[Math.floor(Math.random() * terminalFortunes.length)]); return; }
  if (cmd === 'coinflip' || cmd === 'moneda') { printTerminalLine(Math.random() < 0.5 ? 'Cara' : 'Cruz'); return; }
  if (cmd === 'dice' || cmd === 'dado') { printTerminalLine('Salió ' + (Math.floor(Math.random() * 6) + 1)); return; }
  if (cmd === 'time' || cmd === 'hora') { printTerminalLine(new Date().toLocaleString('es-CL')); return; }
  if (cmd === 'guess' || cmd === 'adivina') {
    terminalState.mode = 'guess';
    terminalState.guessTarget = Math.floor(Math.random() * 100) + 1;
    terminalState.guessAttempts = 0;
    printTerminalLine('Pensé un número entre 1 y 100. Escribí un número para adivinar (o "salir" para cancelar).');
    return;
  }
  if (cmd.startsWith('rps') || cmd.startsWith('ppt')) {
    playRps(raw.split(' ')[1]);
    return;
  }
  if (cmd.startsWith('calc ')) {
    runCalc(raw.slice(5));
    return;
  }

  const entry = terminalCommands[cmd];
  if (!entry) {
    printTerminalLine(`command not found: ${cmd} — probá "help"`);
    return;
  }

  if (typeof entry === 'string') {
    printTerminalLine(entry);
  } else if (entry.goto) {
    printTerminalLine('Abriendo ' + cmd + '...');
    setTimeout(() => {
      closeTerminal();
      document.querySelector(entry.goto).scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }, 300);
  } else if (entry.open) {
    printTerminalLine('Abriendo ' + cmd + ' en una pestaña nueva...');
    setTimeout(() => window.open(entry.open, '_blank', 'noopener'), 250);
  }
});







