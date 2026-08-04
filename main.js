/* ============================================================
   SHREESH NALAWADE — PORTFOLIO ENGINE
   Three.js Particles • GSAP Animations • Lenis Scroll
   Custom Cursor • Preloader • Typewriter • Counters
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // PRELOADER
  // ============================================================
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloader-fill');
  const preloaderPercent = document.getElementById('preloader-percent');
  const preloaderText = document.getElementById('preloader-text');

  const preloaderMessages = [
    'Initializing System',
    'Loading Assets',
    'Building Interface',
    'Calibrating Visuals',
    'Deploying Experience'
  ];

  let progress = 0;
  let messageIndex = 0;

  function updatePreloader() {
    progress += Math.random() * 12 + 3;
    if (progress > 100) progress = 100;

    preloaderFill.style.width = progress + '%';
    preloaderPercent.textContent = Math.floor(progress) + '%';

    const newMsgIndex = Math.min(Math.floor(progress / 25), preloaderMessages.length - 1);
    if (newMsgIndex !== messageIndex) {
      messageIndex = newMsgIndex;
      preloaderText.style.opacity = '0';
      setTimeout(() => {
        preloaderText.textContent = preloaderMessages[messageIndex];
        preloaderText.style.opacity = '1';
      }, 200);
    }

    if (progress < 100) {
      setTimeout(updatePreloader, 150 + Math.random() * 200);
    } else {
      setTimeout(() => {
        preloader.classList.add('loaded');
        document.body.style.overflow = '';
        initAfterLoad();
      }, 600);
    }
  }

  // Start preloader
  document.body.style.overflow = 'hidden';
  setTimeout(updatePreloader, 400);

  // ============================================================
  // INIT AFTER LOAD
  // ============================================================
  function initAfterLoad() {
    initLenis();
    initGSAP();
    initHeroAnimation();
    initTypewriter();
    initCounters();
    initSkillsCanvas();
  }

  // ============================================================
  // CUSTOM CURSOR
  // ============================================================
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorLabel = document.getElementById('cursor-label');

  if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      // Dot follows tightly
      dotX += (mouseX - dotX) * 0.3;
      dotY += (mouseY - dotY) * 0.3;
      cursorDot.style.left = dotX + 'px';
      cursorDot.style.top = dotY + 'px';

      // Ring follows with delay
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';

      // Label follows cursor
      if (cursorLabel) {
        cursorLabel.style.left = mouseX + 'px';
        cursorLabel.style.top = mouseY + 'px';
      }

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Dynamic Hover Delegation across all static & modal elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .btn, .thumbnail-item, [data-cursor-label], .project-card, .hotspot-card, .project-modal-close');
      if (target) {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
        const label = target.getAttribute('data-cursor-label');
        if (label && cursorLabel) {
          cursorLabel.textContent = label;
          cursorLabel.classList.add('visible');
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, .btn, .thumbnail-item, [data-cursor-label], .project-card, .hotspot-card, .project-modal-close');
      if (target) {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
        if (cursorLabel) cursorLabel.classList.remove('visible');
      }
    });
  }

  // ============================================================
  // NAVIGATION
  // ============================================================
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileOverlay = document.getElementById('mobile-overlay');

  // Scroll effect (Optimized with cached section bounds to eliminate layout thrashing & jitter)
  let sectionCache = [];

  function updateSectionCache() {
    sectionCache = Array.from(document.querySelectorAll('section[id]')).map(section => {
      const id = section.getAttribute('id');
      return {
        top: section.offsetTop,
        height: section.offsetHeight,
        link: document.querySelector(`.nav-links .nav-link[href="#${id}"]`)
      };
    });
  }

  // Build initial cache and refresh on window resize
  updateSectionCache();
  window.addEventListener('resize', updateSectionCache, { passive: true });

  let isScrollTicking = false;
  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    const scrollPos = scrollY + 200;
    for (let i = 0; i < sectionCache.length; i++) {
      const item = sectionCache[i];
      if (item.link) {
        if (scrollPos >= item.top && scrollPos < item.top + item.height) {
          item.link.classList.add('active');
        } else {
          item.link.classList.remove('active');
        }
      }
    }
    isScrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isScrollTicking) {
      requestAnimationFrame(handleNavScroll);
      isScrollTicking = true;
    }
  }, { passive: true });

  // Hamburger
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
      const expanded = hamburger.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded);
      document.body.style.overflow = expanded ? 'hidden' : '';
    });
  }

  window.closeMobileNav = function () {
    hamburger.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.length > 1) {
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (err) {}
      }
    });
  });


  // ============================================================
  // LENIS SMOOTH SCROLL (High-Refresh Fast Mouse Wheel Engine)
  // ============================================================
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
      duration: 0.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.35, // Fast & responsive mouse wheel speed
      touchMultiplier: 1.8,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
  }

  // ============================================================
  // GSAP SCROLL ANIMATIONS
  // ============================================================
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // --- Reveal Up animations ---
    gsap.utils.toArray('.reveal-up').forEach((el, i) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
          delay: i % 4 * 0.1, // stagger within view
        }
      );
    });

    // --- Reveal Scale ---
    gsap.utils.toArray('.reveal-scale').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1, scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          }
        }
      );
    });

    // --- Timeline items ---
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
          delay: i * 0.15,
        }
      );
    });

    // --- Project cards ---
    gsap.utils.toArray('.project-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          delay: i * 0.2,
        }
      );
    });

    // --- Cert cards stagger ---
    gsap.utils.toArray('.cert-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
          },
          delay: i * 0.06,
        }
      );
    });

    // --- Education cards ---
    gsap.utils.toArray('.edu-card').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
          },
          delay: i * 0.15,
        }
      );
    });

    // --- Section dividers ---
    gsap.utils.toArray('.section-divider').forEach(div => {
      gsap.fromTo(div,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: div,
            start: 'top 95%',
          }
        }
      );
    });

    // --- Parallax vignette ---
    gsap.to('.vignette', {
      opacity: 0.8,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1,
      }
    });
  }

  // ============================================================
  // HERO ANIMATION SEQUENCE
  // ============================================================
  function initHeroAnimation() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ delay: 0.3 });

    // Greeting
    tl.to('#hero-greeting', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Name reveal
    const heroName = document.getElementById('hero-name');
    if (heroName) {
      heroName.innerHTML = `
        <span class="hero-firstname-wrapper">SHREESH</span>
        <span class="hero-lastname">NALAWADE</span>
      `;

      tl.fromTo('.hero-firstname-wrapper, .hero-lastname',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.2,
        },
        '-=0.3'
      );
    }


    // CTAs
    tl.to('#hero-ctas', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out'
    }, '-=0.2');

    // Socials
    tl.to('#hero-socials', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3');
  }

  // ============================================================
  // TYPEWRITER EFFECT
  // ============================================================
  function initTypewriter() {
    const typedEl = document.getElementById('typed-text');
    if (!typedEl) return;

    const roles = [
      'Full-Stack Developer',
      'AI/ML Intern @ CollegeDoors',
      'AWS Cloud Architect',
      'UI/UX Designer',
      'Creative Technologist',
      'Game Dev (UE5)',
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        typedEl.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
          isDeleting = true;
          typeSpeed = 2000; // Pause at end
        } else {
          typeSpeed = 60 + Math.random() * 60;
        }
      } else {
        typedEl.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          typeSpeed = 400; // Pause before next word
        } else {
          typeSpeed = 30;
        }
      }

      setTimeout(type, typeSpeed);
    }

    // Start after hero animation
    setTimeout(type, 2500);
  }

  // ============================================================
  // ANIMATED COUNTERS
  // ============================================================
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          if (isNaN(target)) return;

          const suffix = el.textContent.replace(/[0-9]/g, '');
          animateCount(el, 0, target, 1800, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  }

  function animateCount(el, start, end, duration, suffix) {
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // THREE.JS PARTICLE SYSTEM (HERO)
  // ============================================================
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle count setup
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 700 : 1800;



    // --- PARTICLES ---
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 110;
      positions[i3 + 1] = (Math.random() - 0.5) * 110;
      positions[i3 + 2] = (Math.random() - 0.5) * 90;

      velocities[i3] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

      sizes[i] = Math.random() * 2.5 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for crimson glowing particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color(0x9A0A12) },
        uColorDark: { value: new THREE.Color(0x570008) },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        varying float vAlpha;
        varying float vDist;

        void main() {
          vec3 pos = position;
          pos.x += sin(uTime * 0.4 + position.y * 0.1) * 0.6;
          pos.y += cos(uTime * 0.3 + position.x * 0.1) * 0.6;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float dist = length(mvPosition.xyz);
          vDist = dist;
          vAlpha = smoothstep(90.0, 12.0, dist);
          gl_PointSize = size * (35.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uColorDark;
        varying float vAlpha;
        varying float vDist;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;

          float glow = 1.0 - smoothstep(0.0, 0.5, d);
          glow = pow(glow, 2.0);

          vec3 color = mix(uColorDark, uColor, glow * 0.85);
          float alpha = glow * vAlpha * 0.75;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse interaction
    let mouseNorm = { x: 0, y: 0 };
    document.addEventListener('mousemove', (e) => {
      mouseNorm.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseNorm.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Resize
    function onResize() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    // Animation loop with full-page scroll reactivity
    let time = 0;
    function animate() {
      requestAnimationFrame(animate);

      time += 0.012;
      material.uniforms.uTime.value = time;

      // Scroll position tracking
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollProgress = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);

      // Particle system rotation & scroll morph
      particles.rotation.y = (mouseNorm.x * 0.12) + time * 0.05 + scrollProgress * 1.5;
      particles.rotation.x = (mouseNorm.y * 0.06) + Math.sin(time * 0.1) * 0.2;


      // Drift particles with dynamic scroll speed boost
      const speedMult = 1 + scrollProgress * 1.5;
      const pos = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        pos[i3] += velocities[i3] * speedMult;
        pos[i3 + 1] += velocities[i3 + 1] * speedMult;
        pos[i3 + 2] += velocities[i3 + 2] * speedMult;

        // Wrap around boundary
        if (pos[i3] > 60) pos[i3] = -60;
        if (pos[i3] < -60) pos[i3] = 60;
        if (pos[i3 + 1] > 60) pos[i3 + 1] = -60;
        if (pos[i3 + 1] < -60) pos[i3 + 1] = 60;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }
    animate();
  }


  // Init particles on load
  window.addEventListener('load', () => {
    setTimeout(initParticles, 100);
  });

  // ============================================================
  // SKILLS CANVAS — Interactive Constellation
  // ============================================================
  function initSkillsCanvas() {
    const canvas = document.getElementById('skills-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let mouse = { x: -1000, y: -1000 };
    let animId;

    const skills = [
      'JavaScript', 'React', 'PHP', 'Python', 'Java', 'C++',
      'AWS', 'MySQL', 'HTML5', 'CSS3', 'Git', 'Docker',
      'Figma', 'Node.js', 'REST API', 'TypeScript',
      'UE5', 'Oracle', 'AI/ML', 'DevOps',
      'UI/UX', 'CI/CD', 'SQL', 'Illustrator'
    ];

    const nodes = [];
    const connections = [];

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = 500;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initNodes();
    }

    function initNodes() {
      nodes.length = 0;
      connections.length = 0;

      const centerX = width / 2;
      const centerY = height / 2;
      const radiusX = Math.min(width * 0.38, 350);
      const radiusY = Math.min(height * 0.35, 200);

      skills.forEach((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2 - Math.PI / 2;
        const r = 0.6 + Math.random() * 0.4;
        const x = centerX + Math.cos(angle) * radiusX * r;
        const y = centerY + Math.sin(angle) * radiusY * r;

        nodes.push({
          x, y,
          baseX: x,
          baseY: y,
          vx: 0, vy: 0,
          radius: 3 + Math.random() * 2,
          label: skill,
          alpha: 0.4 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      });

      // Create connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            connections.push({ from: i, to: j, dist });
          }
        }
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      // Draw connections
      connections.forEach(conn => {
        const a = nodes[conn.from];
        const b = nodes[conn.to];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Check mouse proximity to line midpoint
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const mouseDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
        const mouseInfluence = Math.max(0, 1 - mouseDist / 150);

        const alpha = (0.06 + mouseInfluence * 0.2) * (1 - dist / 200);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(119, 8, 14, ${alpha})`;
        ctx.lineWidth = 0.5 + mouseInfluence;
        ctx.stroke();
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        // Gentle float
        node.x = node.baseX + Math.sin(time + node.phase) * 3;
        node.y = node.baseY + Math.cos(time * 0.8 + node.phase) * 2;

        // Mouse repulsion
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isHovered = dist < 60;

        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          node.x -= (dx / dist) * force * 8;
          node.y -= (dy / dist) * force * 8;
        }

        // Node glow
        const glowRadius = isHovered ? 20 : 8;
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowRadius);
        gradient.addColorStop(0, `rgba(154, 10, 18, ${isHovered ? 0.8 : 0.5})`);
        gradient.addColorStop(1, 'rgba(119, 8, 14, 0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, isHovered ? 4 : node.radius, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? '#9A0A12' : `rgba(119, 8, 14, ${node.alpha})`;
        ctx.fill();

        // Label
        if (isHovered || dist < 80) {
          const labelAlpha = isHovered ? 1 : Math.max(0, 1 - dist / 80);
          ctx.font = `${isHovered ? '600' : '400'} ${isHovered ? 12 : 10}px "JetBrains Mono", monospace`;
          ctx.fillStyle = `rgba(${isHovered ? '128, 151, 183' : '154, 10, 18'}, ${labelAlpha})`;
          ctx.textAlign = 'center';
          ctx.fillText(node.label, node.x, node.y - (isHovered ? 16 : 12));
        }
      });

      animId = requestAnimationFrame(draw);
    }

    // Only animate when visible
    const skillsSection = document.getElementById('skills');
    const skillsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (!animId) draw();
      } else {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    }, { threshold: 0.1 });

    resize();
    skillsObserver.observe(skillsSection);
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      animId = null;
      resize();
      if (skillsSection.getBoundingClientRect().top < window.innerHeight) draw();
    });
  }

  // ============================================================
  // CONTACT FORM HANDLER
  // ============================================================
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Transmitting...';
    btn.disabled = true;

    // Simulate send (replace with actual backend)
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      form.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  };

  // ============================================================
  // MAGNETIC BUTTON EFFECT
  // ============================================================
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // ============================================================
  // SKILL ITEM HOVER SOUND EFFECT (visual pulse)
  // ============================================================
  document.querySelectorAll('.skill-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(item, { scale: 1 }, {
          scale: 1.05, duration: 0.15, yoyo: true, repeat: 1,
          ease: 'power2.out'
        });
      }
    });
  });

  // ============================================================
  // 3D CARD TILT & GLARE SHEEN ENGINE
  // ============================================================
  const tiltableCards = document.querySelectorAll('.project-card, .skill-category, .timeline-card, .about-stat-card, .cert-card, .edu-card');
  
  tiltableCards.forEach(card => {
    card.classList.add('tilt-card');

    // Create glare layer if missing
    if (!card.querySelector('.card-glare')) {
      const glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Rotation angles (max 12 deg)
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Spotlight glare coordinates
      card.style.setProperty('--glare-x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--glare-y', `${(y / rect.height) * 100}%`);
      card.style.setProperty('--glow-angle', `${Math.atan2(y - centerY, x - centerX) * (180 / Math.PI) + 90}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ============================================================
  // WEB AUDIO SYNTHESIZER (CYBER SFX ENGINE v3)
  // ============================================================
  let audioCtx = null;
  let isSfxEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Tactical Mechanical Micro Click (Keycap & UI Hover)
  function playMicroClick(baseFreq = 840, duration = 0.03) {
    if (!isSfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      
      const now = audioCtx.currentTime;
      const freq = baseFreq + (Math.random() - 0.5) * 60;
      
      // Main tone
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + duration);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + duration);

      // Soft metallic snap layer
      const oscSnap = audioCtx.createOscillator();
      const gainSnap = audioCtx.createGain();
      oscSnap.type = 'triangle';
      oscSnap.frequency.setValueAtTime(2400, now);
      oscSnap.frequency.exponentialRampToValueAtTime(600, now + 0.012);

      gainSnap.gain.setValueAtTime(0.02, now);
      gainSnap.gain.exponentialRampToValueAtTime(0.0005, now + 0.012);

      oscSnap.connect(gainSnap);
      gainSnap.connect(audioCtx.destination);
      oscSnap.start(now);
      oscSnap.stop(now + 0.012);
    } catch (e) {}
  }

  // Futuristic Sub-Bass Pulse Trigger (Button Click & Action)
  function playPulseTrigger() {
    if (!isSfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      // Sub-bass thwack
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(210, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.16);

      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.0005, now + 0.16);

      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Sci-Fi Synth Shimmer (Lowpass filtered for warmth)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(950, now);
      osc2.frequency.exponentialRampToValueAtTime(320, now + 0.09);

      gain2.gain.setValueAtTime(0.025, now);
      gain2.gain.exponentialRampToValueAtTime(0.0005, now + 0.09);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      osc2.connect(filter);
      filter.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(now);
      osc2.stop(now + 0.09);
    } catch (e) {}
  }

  // Cyber Modal Warp Sweep
  function playModalWarp() {
    if (!isSfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.22);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {}
  }

  // Haptic feedback function
  function triggerHaptics(pattern = [15]) {
    if (navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (e) {}
    }
  }

  // Attach audio & haptic triggers to hover & click across interactive elements
  const sfxTargets = document.querySelectorAll('a, button, .btn, .skill-item, .project-card, .timeline-card, .about-stat-card, .cert-card, .edu-card');
  sfxTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playMicroClick(720, 0.03);
      triggerHaptics([10]);
    });
    el.addEventListener('click', () => {
      playPulseTrigger();
      triggerHaptics([25, 15, 35]);
    });
  });

  // SFX Toggle Widget Handler
  const sfxBtn = document.getElementById('sfx-toggle-btn');
  const sfxStatus = document.getElementById('sfx-status');

  if (sfxBtn && sfxStatus) {
    sfxBtn.addEventListener('click', () => {
      isSfxEnabled = !isSfxEnabled;
      if (isSfxEnabled) {
        sfxBtn.classList.remove('muted');
        sfxStatus.textContent = 'SFX: ON';
        playPulseTrigger();
      } else {
        sfxBtn.classList.add('muted');
        sfxStatus.textContent = 'SFX: OFF';
      }
    });
  }

  // ============================================================
  // HERO PHOTO INTERACTIVE MOUSE PARALLAX
  // ============================================================
  const heroBgImage = document.querySelector('.hero-bg-image');
  const heroElem = document.getElementById('hero');

  if (heroElem && heroBgImage) {
    heroElem.addEventListener('mousemove', (e) => {
      const rect = heroElem.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      heroBgImage.style.transform = `scale(1.1) translate(${x * -18}px, ${y * -18}px)`;
    });

    heroElem.addEventListener('mouseleave', () => {
      heroBgImage.style.transform = 'scale(1.05) translate(0, 0)';
    });
  }

  // ============================================================
  // INTERACTIVE CYBER TERMINAL ENGINE
  // ============================================================
  const terminalModal = document.getElementById('terminal-modal');
  const terminalToggleBtn = document.getElementById('terminal-toggle-btn');
  const terminalCloseBtn = document.getElementById('terminal-close-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');

  function toggleTerminal() {
    if (!terminalModal) return;
    const isActive = terminalModal.classList.contains('active');
    if (isActive) {
      terminalModal.classList.remove('active');
      terminalModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('terminal-open');
    } else {
      terminalModal.classList.add('active');
      terminalModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('terminal-open');
      setTimeout(() => { if (terminalInput) terminalInput.focus(); }, 100);
    }
  }


  if (terminalToggleBtn) terminalToggleBtn.addEventListener('click', toggleTerminal);
  if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', toggleTerminal);

  // Shortcut key '~' to toggle terminal
  document.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleTerminal();
      }
    }
    if (e.key === 'Escape' && terminalModal && terminalModal.classList.contains('active')) {
      toggleTerminal();
    }
  });

  // Terminal commands handler
  if (terminalInput && terminalOutput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        if (!cmd) return;

        // Print input line
        const inputLine = document.createElement('div');
        inputLine.className = 'terminal-line';
        inputLine.innerHTML = `<span class="crimson">shreesh@system:~$</span> ${cmd}`;
        terminalOutput.appendChild(inputLine);

        // Process command
        let responseHTML = '';
        switch (cmd) {
          case 'help':
            responseHTML = `
              <div class="terminal-line"><span class="yellow">AVAILABLE COMMANDS:</span></div>
              <div class="terminal-line">  <span class="green">help</span>       - Display available terminal commands</div>
              <div class="terminal-line">  <span class="green">whoami</span>     - About Shreesh Nalawade</div>
              <div class="terminal-line">  <span class="green">skills</span>     - View core technology stack</div>
              <div class="terminal-line">  <span class="green">projects</span>   - Display featured production builds</div>
              <div class="terminal-line">  <span class="green">contact</span>    - Show contact information</div>
              <div class="terminal-line">  <span class="green">matrix</span>     - Trigger cyber matrix particle boost</div>
              <div class="terminal-line">  <span class="green">clear</span>      - Clear terminal screen</div>
            `;
            break;
          case 'whoami':
            responseHTML = `<div class="terminal-line">Shreesh Nalawade — Full-Stack Developer, UI/UX Designer, and AI/ML Project Intern at CollegeDoors. Pursuing B.Tech CSE (AI/ML) in Mumbai, India. AWS Certified Cloud Architect (92%).</div>`;
            break;
          case 'skills':
            responseHTML = `<div class="terminal-line"><span class="cyan">STACK:</span> React.js, PHP, Python, AWS Cloud, MySQL, JavaScript, Three.js, GSAP, Figma, Unreal Engine 5.</div>`;
            break;
          case 'projects':
            responseHTML = `<div class="terminal-line">1. <span class="cyan">GST Government Portal</span> — Officially inaugurated bilingual portal cutting overhead by 40%.</div><div class="terminal-line">2. <span class="cyan">D-Fash Brand Identity</span> — 5★ rated startup design system.</div><div class="terminal-line">3. <span class="cyan">UE5 3D Environments</span> — RTX optimized C++ & Blueprints.</div>`;
            break;
          case 'contact':
            responseHTML = `<div class="terminal-line">Email: <span class="cyan">shreeshnalawade9@gmail.com</span> | LinkedIn: <span class="cyan">linkedin.com/in/shreesh9</span> | GitHub: <span class="cyan">github.com/shreesh9</span></div>`;
            break;
          case 'matrix':
            responseHTML = `<div class="terminal-line <green>">CYBER MATRIX MODE ACTIVATED. Boosted 3D Particle Velocity!</div>`;
            playPulseTrigger();
            break;
          case 'clear':
            terminalOutput.innerHTML = '';
            return;
          default:
            responseHTML = `<div class="terminal-line">Command not recognized: '<span class="crimson">${cmd}</span>'. Type <span class="green">'help'</span> for command list.</div>`;
        }

        const respLine = document.createElement('div');
        respLine.innerHTML = responseHTML;
        terminalOutput.appendChild(respLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        playMicroClick(800, 0.03);
      }
    });
  }


  // ============================================================
  // PROJECT SHOWCASE & GALLERY MODAL SYSTEM
  // ============================================================

  const projectData = {
    visionbridge: {
      title: "VisionBridge 👁️⚡🌉",
      type: "// AI • Mobile • Assistive Vision • Under Active Development",
      tagline: "Next-Gen Accessibility & Computer Vision Assistive Platform",
      desc: "State-of-the-art voice-first assistive mobile app empowering visually impaired users with real-time Groq Vision AI (Llama 3.2), Google MLKit OCR, and 1-on-1 WebRTC video calling assistance.",
      highlights: [
        "🤖 Groq Vision AI Engine (Llama 3.2) with Real-Time Object Detection & Scene Summarization",
        "🔊 Text-To-Speech (TTS) Natural Voice Audio Description Stream",
        "📞 WebRTC Peer-to-Peer 1-on-1 Video Calling with Multi-Volunteer Alerting",
        "🛡️ Native Android FLAG_SECURE Privacy & Emergency SOS Location Escalation"
      ],
      tech: ["Flutter", "Dart 3.2", "Groq Vision AI", "WebRTC P2P", "Google MLKit", "Firebase", "Riverpod"],
      images: [
        { url: "assets/vision bridge/thumbnail.png", label: "VisionBridge App Showcase & System Architecture" }
      ],
      liveUrl: null,
      statusNote: "🚧 Under Active Development (v9.09.05)"
    },
    gstdept: {
      title: "GOVT of INDIA GST Dept & ShivJayanti Utsav Samiti Portal",
      type: "// Government • Full-Stack • Live Operational",
      tagline: "Official State Portal, Internal Web App & Cultural Event Platform",
      desc: "Dual-purpose project showcase covering both the secure GST department internal web application and the high-traffic ShivJayanti Utsav Samiti cultural event portal module. Features on-site developer photo gallery, system architecture, and video feature walk-throughs.",
      highlights: [
        "🏛️ Official Government Web App & Administrative Infrastructure",
        "⚡ 40% Operational Overhead Cut & 80% Print Cost Savings",
        "📸 On-Site Developer & Event Ceremonial Photo Gallery",
        "📽️ Implementation Video Demos & Live Walkthroughs"
      ],
      tech: ["PHP 8", "JavaScript (ES6+)", "MySQL", "HTML5 / CSS3", "Admin Workflow Engine"],
      videos: [
        { url: "https://www.youtube.com/embed/lMytb_MnI_A", label: "Official GST Inauguration Ceremony", type: "youtube" },
        { url: "https://www.youtube.com/embed/bSeYgFjbX4w", label: "GST Department Portal Overview", type: "youtube" }
      ],
      images: [
        { url: "assets/gst/IMG_20240218_155809.jpg", label: "On-Site Inauguration Preparation" },
        { url: "assets/gst/IMG-20240310-WA0005.jpg", label: "Official Government Event Ceremony" },
        { url: "assets/gst/IMG_20240221_131806.jpg", label: "Live System Demonstration to Officials" },
        { url: "assets/gst/gst dept.jpg", label: "GST Portal Administrative Dashboard" }
      ],
      liveUrl: null,
      statusNote: "🏛️ Live Operational across internal government network"
    },
    pricesense: {
      title: "PriceSenseAI",
      type: "// Full-Stack • AI • Live & Published Research Paper",
      tagline: "Automated E-Commerce Price Sensing & Intelligence Platform",
      desc: "Track product prices across Amazon, Walmart, and Zara with AI web data extraction (Firecrawl), Supabase PostgreSQL database, automated pg_cron daily price monitoring, mathematical value scoring framework, historical pricing analytics, and published research metrics.",
      highlights: [
        "🔍 Multi-Store AI Web Extraction (Firecrawl Engine with Anti-Bot Bypass)",
        "📈 Mathematical Value Scoring Framework & Price Drop History Analytics",
        "🔄 Supabase pg_cron Automated Background Job Monitoring",
        "📜 Published Research Paper Metrics & System Architecture"
      ],
      tech: ["Next.js 16", "Firecrawl AI", "Supabase PostgreSQL", "pg_cron", "Resend Email", "Recharts", "Tailwind CSS"],
      images: [
        { url: "assets/price sense/Screenshot 2026-07-25 150902.png", label: "Interactive Dashboard & Price Trend Graph" },
        { url: "assets/price sense/Screenshot 2026-07-25 150916.png", label: "Product Tracker List & AI Scraper Status" },
        { url: "assets/price sense/Screenshot 2026-07-25 150926.png", label: "Price Drop Alert Settings & Email Notifications" }
      ],
      liveUrl: "https://price-sense-ai.vercel.app/",
      statusNote: "🚀 Live Platform & Published Research Paper"
    },
    koshi: {
      title: "Koshi Career Coach",
      type: "// AI • EdTech • Live Platform",
      tagline: "Interactive Career Guidance & Mentorship Platform",
      desc: "AI-powered personalized career guidance and skill navigator platform empowering students with interactive career roadmap generators, student assessment dashboards, skill gap diagnostics, and responsive UI design showcase.",
      highlights: [
        "🎯 Interactive Learning Roadmap Generators & Personal Skill Trees",
        "📊 Student Assessment & Skill Gap Diagnostics Engine",
        "🤖 AI-Powered Career Mentorship & Real-Time Guidance"
      ],
      tech: ["React", "Node.js", "Tailwind CSS", "AI Career Guidance Engine", "Vercel Cloud"],
      images: [
        { url: "assets/koshi/Screenshot 2026-07-25 150831.png", label: "AI Career Coach Dashboard & Personalization" },
        { url: "assets/koshi/Screenshot 2026-07-25 150837.png", label: "Skill Gap Diagnostics & Learning Roadmap" },
        { url: "assets/koshi/Screenshot 2026-07-25 150843.png", label: "Interactive Mentoring Hub" }
      ],
      liveUrl: "https://koshi-six.vercel.app/",
      statusNote: "⚡ Deployed & Live Operational"
    },
    ue5dev: {
      title: "UE5 Game Developer — Environment Design & Solo Game Dev",
      type: "// Game Dev • 3D Art • In Showcase",
      tagline: "High-Fidelity Souls-like Action RPG & Environment Art",
      desc: "High-fidelity Souls-like Action RPG and 3D environment art engineered in Unreal Engine 5. Covers PBR material setups, landscape heightmap editing, volumetric lighting passes, and custom C++ / Blueprints combat and movement mechanics breakdown.",
      highlights: [
        "⚔️ Souls-like Action RPG Combat Mechanics & Hit-Box Blueprints",
        "🌄 Photorealistic PBR Material Setups & Landscape Heightmap Editing",
        "💡 Unreal Engine 5 Lumen Global Illumination & Volumetric Fog Lighting Passes",
        "🎮 Optimized RTX 4060 Performance Profiling & Shader Compilation Passes"
      ],
      tech: ["Unreal Engine 5", "C++", "Blueprints", "PBR Materials", "Lumen GI", "Nanite"],
      images: [
        { url: "assets/ue 5/WhatsApp Image 2026-07-25 at 3.47.43 PM (2).jpeg", label: "Unreal Engine 5 Environment Render & Combat Arena" }
      ],
      liveUrl: null,
      statusNote: "🎮 Portfolio Art & Engine Mechanics Showcase"
    }
  };


  function playModalWarp() {
    if (!isSfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  }

  function openProjectModal(projectId) {
    const data = projectData[projectId];
    const projectModal = document.getElementById('project-detail-modal');
    const projectModalBody = document.getElementById('project-modal-body');

    if (!data || !projectModal || !projectModalBody) return;

    // Combine all media items (videos first, then images)
    const mediaItems = [];
    if (data.videos && data.videos.length) {
      data.videos.forEach(v => mediaItems.push({ type: 'video', url: v.url, label: v.label }));
    }
    if (data.images && data.images.length) {
      data.images.forEach(img => mediaItems.push({ type: 'image', url: img.url, label: img.label }));
    }

    const firstMedia = mediaItems[0] || null;

    let html = `
      <div class="modal-header-tag">${data.type}</div>
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-description">${data.desc}</p>
    `;

    // Status Note
    if (data.statusNote) {
      html += `<div style="margin-bottom: 24px; padding: 14px 18px; background: rgba(154, 10, 18, 0.15); border: 1px solid rgba(154, 10, 18, 0.4); border-radius: 10px; color: #E1FDFE; font-family: var(--font-mono); font-size: 13px;">${data.statusNote}</div>`;
    }

    // Media Stage (Primary Viewer + Thumbnail Selector)
    if (mediaItems.length > 0) {
      html += `
        <div class="modal-media-section">
          <h4 style="color: var(--ice); font-size: 13px; font-family: var(--font-mono); margin-bottom: 12px; letter-spacing: 0.15em; text-transform: uppercase;">// Interactive Production Media Stage</h4>
          
          <!-- Primary Showcase Stage -->
          <div id="modal-primary-stage" class="project-video-box" style="margin-bottom: 16px; position: relative;">
            ${firstMedia.type === 'video' || firstMedia.type === 'youtube' ? (
              firstMedia.url.includes('youtube.com') ? `
                <iframe id="stage-active-video" src="${firstMedia.url}" style="width: 100%; height: 440px; border: none; display: block; background: #000;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              ` : `
                <video id="stage-active-video" controls preload="metadata" playsinline poster="${data.images && data.images.length ? data.images[0].url : ''}" style="width: 100%; max-height: 440px; display: block; object-fit: contain; background: #000;">
                  <source src="${firstMedia.url}" type="video/mp4">
                </video>
              `
            ) : `
              <img id="stage-active-image" src="${firstMedia.url}" alt="${firstMedia.label}" style="width: 100%; max-height: 440px; display: block; object-fit: contain; background: #120b18;">
            `}
            <div style="padding: 10px 16px; background: rgba(22, 16, 28, 0.95); border-top: 1px solid rgba(128, 151, 183, 0.2); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <span id="stage-active-label" style="font-family: var(--font-mono); font-size: 12px; color: var(--steel-blue); font-weight: 600;">${firstMedia.label}</span>
              <a id="stage-active-full-btn" href="${firstMedia.url}" target="_blank" rel="noopener noreferrer" class="btn btn-ghost" style="padding: 4px 12px; font-size: 10px;" data-cursor-label="FULL VIEW">
                🔍 Open Full Resolution
              </a>
            </div>
          </div>

          <!-- Thumbnail Selector Strip -->
          ${mediaItems.length > 1 ? `
            <div style="margin-top: 16px;">
              <div style="font-family: var(--font-mono); font-size: 11px; color: var(--steel); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.1em;">Click thumbnail to inspect media (${mediaItems.length} available):</div>
              <div class="project-gallery-grid" style="grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
                ${mediaItems.map((item, idx) => `
                  <div class="gallery-img-wrapper thumbnail-item ${idx === 0 ? 'active-thumb' : ''}" data-type="${item.type}" data-url="${item.url}" data-label="${item.label}" style="cursor: pointer !important; border: ${idx === 0 ? '2px solid var(--crimson-bright)' : '1px solid rgba(128, 151, 183, 0.2)'}; border-radius: 8px; overflow: hidden; transition: all 0.3s ease;">
                    ${item.type === 'video' || item.type === 'youtube' ? `
                      <div style="position: relative; height: 90px; background: #000; display: flex; align-items: center; justify-content: center;">
                        <span style="font-size: 24px; color: var(--crimson-bright); z-index: 2;">▶</span>
                        <span style="position: absolute; bottom: 4px; left: 4px; font-family: var(--font-mono); font-size: 9px; color: #fff; background: rgba(0,0,0,0.7); padding: 2px 4px; border-radius: 3px;">VIDEO</span>
                      </div>
                    ` : `
                      <img src="${item.url}" alt="${item.label}" style="width: 100%; height: 90px; object-fit: cover; display: block;" loading="lazy">
                    `}
                    <div style="padding: 4px 6px; font-family: var(--font-mono); font-size: 10px; color: var(--steel-blue); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: #16101c;">${item.label}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Key Highlights
    if (data.highlights && data.highlights.length) {
      html += `
        <div style="margin: 24px 0;">
          <h4 style="color: var(--ice); font-size: 13px; font-family: var(--font-mono); margin-bottom: 12px; letter-spacing: 0.15em; text-transform: uppercase;">// Key Capabilities & Impact</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px;">
            ${data.highlights.map(h => `<li style="color: var(--steel); font-size: 14px; line-height: 1.6; padding-left: 22px; position: relative;"><span style="position: absolute; left: 0; color: var(--crimson-bright); font-weight: bold;">&#9656;</span> ${h}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    // Technology Stack Badges
    if (data.tech && data.tech.length) {
      html += `
        <div style="margin-top: 24px;">
          <h4 style="color: var(--ice); font-size: 13px; font-family: var(--font-mono); margin-bottom: 12px; letter-spacing: 0.15em; text-transform: uppercase;">// Technology Stack</h4>
          <div class="tech-tags" style="margin-bottom: 24px;">
            ${data.tech.map(t => `<span class="tech-tag" style="font-size: 12px; padding: 6px 14px;">${t}</span>`).join('')}
          </div>
        </div>
      `;
    }

    // Live Site Button
    if (data.liveUrl) {
      html += `
        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(128, 151, 183, 0.2); display: flex; gap: 14px;">
          <a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 14px 28px; font-size: 13px;" data-cursor-label="LAUNCH SITE">
            Launch Live Website ↗
          </a>
        </div>
      `;
    }

    projectModalBody.innerHTML = html;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (typeof lenis !== 'undefined' && lenis) lenis.stop();
    playModalWarp();

    // Attach Thumbnail Switcher Event Handlers
    const stageBox = document.getElementById('modal-primary-stage');
    const stageLabel = document.getElementById('stage-active-label');
    const stageFullBtn = document.getElementById('stage-active-full-btn');
    const thumbElements = projectModalBody.querySelectorAll('.thumbnail-item');

    thumbElements.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const type = thumb.getAttribute('data-type');
        const url = thumb.getAttribute('data-url');
        const label = thumb.getAttribute('data-label');

        // Update active border style
        thumbElements.forEach(t => t.style.border = '1px solid rgba(128, 151, 183, 0.2)');
        thumb.style.border = '2px solid var(--crimson-bright)';

        // Update stage media
        if (stageBox) {
          stageBox.querySelector('video, img, iframe')?.remove();
          if (url.includes('youtube.com') || type === 'youtube') {
            const iframeElem = document.createElement('iframe');
            iframeElem.id = 'stage-active-video';
            iframeElem.src = url;
            iframeElem.style.cssText = 'width: 100%; height: 440px; border: none; display: block; background: #000;';
            iframeElem.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframeElem.allowFullscreen = true;
            stageBox.insertBefore(iframeElem, stageBox.lastElementChild);
          } else if (type === 'video') {
            const videoElem = document.createElement('video');
            videoElem.id = 'stage-active-video';
            videoElem.controls = true;
            videoElem.preload = 'metadata';
            videoElem.playsInline = true;
            videoElem.style.cssText = 'width: 100%; max-height: 440px; display: block; object-fit: contain; background: #000;';
            videoElem.innerHTML = `<source src="${url}" type="video/mp4">`;
            stageBox.insertBefore(videoElem, stageBox.lastElementChild);
          } else {
            const imgElem = document.createElement('img');
            imgElem.id = 'stage-active-image';
            imgElem.src = url;
            imgElem.alt = label;
            imgElem.style.cssText = 'width: 100%; max-height: 440px; display: block; object-fit: contain; background: #120b18;';
            stageBox.insertBefore(imgElem, stageBox.lastElementChild);
          }
        }

        if (stageLabel) stageLabel.textContent = label;
        if (stageFullBtn) stageFullBtn.href = url;

        playMicroClick(820, 0.03);
      });
    });
  }

  function closeProjectModal() {
    const projectModal = document.getElementById('project-detail-modal');
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open', 'terminal-open');
    if (typeof lenis !== 'undefined' && lenis) lenis.start();

    // Pause all playing videos
    const videos = projectModal.querySelectorAll('video');
    videos.forEach(v => v.pause());
  }



  // Universal Click Handler for Project Cards & Open Buttons
  document.addEventListener('click', (e) => {
    // If click originates inside project detail modal content, allow links/buttons inside modal to work naturally
    if (e.target.closest('.project-modal-content') || e.target.closest('.terminal-container')) {
      return;
    }

    const openBtn = e.target.closest('.open-project-modal');
    const hotspotTarget = e.target.closest('.open-hotspot-modal, .hotspot-card, .battlestation-card');
    const projectCard = e.target.closest('.project-card');

    if (openBtn) {
      e.preventDefault();
      const projId = openBtn.getAttribute('data-project-id');
      if (projId) openProjectModal(projId);
    } else if (hotspotTarget) {
      e.preventDefault();
      const hotspotId = hotspotTarget.getAttribute('data-hotspot-id') || hotspotTarget.closest('[data-hotspot-id]')?.getAttribute('data-hotspot-id');
      if (hotspotId) openHotspotModal(hotspotId);
    } else if (projectCard) {
      // If clicking directly on an external Vercel link inside project card, let browser open it
      if (e.target.closest('a[target="_blank"]')) return;
      const projId = projectCard.getAttribute('data-project-id');
      if (projId) openProjectModal(projId);
    }
  });

  // Backdrop click to close project detail modal
  const projectModal = document.getElementById('project-detail-modal');
  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Keyboard Accessibility for Hotspot Cards
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.classList.contains('hotspot-card')) {
        const hotspotId = activeEl.getAttribute('data-hotspot-id');
        if (hotspotId) {
          e.preventDefault();
          openHotspotModal(hotspotId);
        }
      }
    }
  });

  const projectModalCloseBtn = document.getElementById('project-modal-close-btn');
  if (projectModalCloseBtn) {
    projectModalCloseBtn.addEventListener('click', closeProjectModal);
  }

  // ============================================================
  // BATTLESTATION & BIO HUB INTERACTIVE SYSTEM
  // ============================================================
  const hotspotData = {
    monitors: {
      title: "🖥️ Acer Nitro 2K QHD 180Hz & Setup Environment",
      type: "// DISPLAY & DESK ENVIRONMENT",
      desc: "High-refresh 2K IPS gaming monitor mounted over a custom ₹25k L-shaped ergonomic table with Toji Fushiguro deskmat and wall-mounted 1080p TV.",
      specs: [
        "Primary Display: Acer Nitro VG270IU 27\" IPS QHD (2560x1440 2K, 180Hz, 0.5ms GTG)",
        "Secondary Screen: Mounted 1080p Full-HD TV Screen",
        "Custom Desk: ₹25k Custom Built Ergonomic L-Shaped Gaming Table",
        "Deskmat: Comic Sense Toji Fushiguro Edition Extra-Large Desk Pad",
        "Lighting: Custom Ambient LED Room Illumination"
      ]
    },
    'pc-rig': {
      title: "💻 Custom Crystal White PC Rig",
      type: "// DESKTOP SPECS & PERFORMANCE",
      desc: "Custom-built high-performance developer workstation in an Ant Esports Crystal White Mini Tower, liquid-cooled and built for Unreal Engine 5, Machine Learning, and heavy full-stack compilation.",
      specs: [
        "CPU: AMD Ryzen 7 5800X (8 Cores, 16 Threads, 4.7GHz Max Boost)",
        "GPU: Zotac Twin Edge Nvidia GeForce RTX 4060 8GB GDDR6",
        "Motherboard: ASUS Prime B550M-A WiFi II",
        "RAM: 16GB (2x8GB) White ADATA XPG Spectrix D50 DDR4",
        "Cooling: DeepCool LE720 360mm ARGB AIO Liquid Cooler (3 Fans)",
        "Storage: 1TB WD Black SN770 NVMe M.2 SSD",
        "Chassis: Ant Esports Crystal White Mini Tower + 650W Power Supply"
      ]
    },
    peripherals: {
      title: "⌨️ Wireless Keyboards, Mice & Peripherals",
      type: "// PERIPHERALS & INPUT RIG",
      desc: "Dual keyboard and mouse configuration for seamless multi-machine development between desktop rig and laptop workstation.",
      specs: [
        "Primary Keyboard: Portronics Hydra 10 Mechanical Wireless Keyboard (Bluetooth / 2.4GHz)",
        "Primary Mouse: Razer DeathAdder Essential Ergonomic Gaming Mouse",
        "Secondary Setup: Ant Esports MK1300 60% Mechanical Keyboard + Zebronics Gaming Mouse",
        "Laptop Workstation: HP Pavilion (Ryzen 5 7000-series, GTX 1650, 16GB RAM, 512GB SSD + 1TB HDD, 144Hz)"
      ]
    },
    audio: {
      title: "🎧 Audio Engineering, Headphones & Mobile",
      type: "// AUDIO & GEAR TELEMETRY",
      desc: "Goated gaming and studio monitoring headphone setup paired with wireless buds and mobile devices.",
      specs: [
        "Headphones 1: EKSA E900 Goated Gaming & Monitoring Headphones",
        "Headphones 2: Redgear Studio Gaming Headphones",
        "Wireless Earbuds: OnePlus Nord Buds",
        "Creative Digital Tablet: 15-inch Screen Digital Drawing Graphics Tablet",
        "Print Infrastructure: Epson USB + WiFi All-In-One Printer",
        "Mobile Device: Apple iPhone 14"
      ]
    }
  };

  function openHotspotModal(hotspotId) {
    const data = hotspotData[hotspotId];
    const projectModal = document.getElementById('project-detail-modal');
    const projectModalBody = document.getElementById('project-modal-body');

    if (!data || !projectModal || !projectModalBody) return;

    let html = `
      <div class="modal-header-tag">${data.type}</div>
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-description">${data.desc}</p>
      <div style="margin-top: 20px;">
        <h4 style="color: var(--ice); font-size: 13px; font-family: var(--font-mono); margin-bottom: 12px; letter-spacing: 0.15em; text-transform: uppercase;">// System Specifications & Equipment Breakdown</h4>
        <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px;">
          ${data.specs.map(s => `<li style="color: var(--steel); font-size: 14px; line-height: 1.6; padding-left: 20px; position: relative;"><span style="position: absolute; left: 0; color: var(--crimson-bright); font-weight: bold;">&#9656;</span> ${s}</li>`).join('')}
        </ul>
      </div>
    `;
    projectModalBody.innerHTML = html;
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (typeof lenis !== 'undefined' && lenis) lenis.stop();
    playModalWarp();
  }

  // Rig Stage Gallery Switcher
  function initRigStageGallery() {
    const mainImg = document.getElementById('rig-main-stage-img');
    const labelElem = document.getElementById('rig-active-label');
    const thumbs = document.querySelectorAll('.rig-thumb-item');

    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const url = thumb.getAttribute('data-url');
        const label = thumb.getAttribute('data-label');

        thumbs.forEach(t => t.classList.remove('active-rig-thumb'));
        thumb.classList.add('active-rig-thumb');

        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = url;
          mainImg.alt = label;
          if (labelElem) labelElem.textContent = label;
          mainImg.style.opacity = '1';
        }, 150);

        playMicroClick(840, 0.03);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRigStageGallery);
  } else {
    initRigStageGallery();
  }

  // Real-Time RGB Theme Toggle Engine
  const rgbButtons = document.querySelectorAll('.rgb-toggle-btn');
  rgbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rgbButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-rgb-mode');
      document.body.classList.remove('rgb-neon-red', 'rgb-stealth', 'rgb-cyber-white');
      if (mode === 'stealth') {
        document.body.classList.add('rgb-stealth');
      } else if (mode === 'cyber-white') {
        document.body.classList.add('rgb-cyber-white');
      } else {
        document.body.classList.add('rgb-neon-red');
      }

      playPulseTrigger();
      triggerHaptics([30, 20, 40]);
    });
  });

  // Draggable Badges Handler
  const draggableBadges = document.querySelectorAll('.draggable-badge');
  draggableBadges.forEach(badge => {
    let activeDrag = false;
    let startX, startY, initialLeft = 0, initialTop = 0;

    badge.addEventListener('mousedown', (e) => {
      activeDrag = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = parseInt(badge.style.left || 0);
      initialTop = parseInt(badge.style.top || 0);
      badge.style.position = 'relative';
      badge.style.zIndex = '100';
    });

    window.addEventListener('mousemove', (e) => {
      if (!activeDrag) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      badge.style.left = `${initialLeft + dx}px`;
      badge.style.top = `${initialTop + dy}px`;
    });

    window.addEventListener('mouseup', () => {
      activeDrag = false;
    });
  });

  // EXPOSE MODAL FUNCTIONS GLOBALLY so inline onclick handlers work
  window.__openProjectModal = openProjectModal;
  window.__closeProjectModal = closeProjectModal;
  window.__openHotspotModal = openHotspotModal;

})();


