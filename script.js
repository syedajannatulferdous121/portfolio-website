/* ─── AOS (scroll-reveal) ─────────────────────────────── */
AOS.init({ once: true, duration: 700, easing: "ease-out-cubic" });

/* ─── Main client-side interactions ───────────────────── */
document.addEventListener("DOMContentLoaded", () => {

  /* 1. Smooth anchor scrolling */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(link.getAttribute("href"))
              .scrollIntoView({ behavior: "smooth" });
    });
  });

  /* 2. 3-D tilt on project cards (VanillaTilt) */


// add data-tilt to anything that should tilt (keeps code self-documenting)
 VanillaTilt.init(
   document.querySelectorAll('[data-tilt]'),
   { max: 6, speed: 350, glare: true, 'max-glare': .25 }
 );





/* 3. Fade-in on sections, cards & edu-chips */
/* ─── Fade-in on scroll ───────────────────────────────── */
const reveal = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        reveal.unobserve(entry.target);           // run once
      }
    });
  },
  { rootMargin: '0px 0px -10% 0px' }
);

// now it’s safe to start observing
document
  .querySelectorAll('section, .project-card, .edu-chip, .exp-card')
  .forEach(el => reveal.observe(el));




/* ─── Experience card reveal ───────────────────────── */
if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  // one highly-optimised batch instead of N individual triggers
  ScrollTrigger.batch(".exp-card", {
    start: "top 85%",
    onEnter: batch =>
      gsap.from(batch, {
        opacity: 0,
        rotationY: -45,
        x: -80,
        duration: 1,
        ease: "power3.out",
        stagger: { each: 0.15, grid: "auto" }
      }),
    once: true               // fire only the first time
  });
}









/* progress bar */
const prog = document.getElementById("scrollProgress");
if (prog) {
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const pct = (h.scrollTop || h.scrollY) /
                (h.scrollHeight - h.clientHeight);
    prog.style.width = `${pct * 100}%`;
  });
}

 /* Skills doughnut chart (optional) */
  const skillsCanvas = document.getElementById("skillsChart");
  if (skillsCanvas && window.Chart) {
    const ctx = skillsCanvas.getContext("2d");
    new Chart(ctx, {
      type : "doughnut",
      data : {
        labels: ["Lang & Tools","Front-End","Data & Testing"],
        datasets: [{
          data: [8,7,5],
          backgroundColor: [
            "rgba(62,230,164,.5)",
            "rgba(107,140,255,.5)",
            "rgba(255,189,214,.5)"
          ],
          borderWidth: 0
        }]
      },
      options: {
        cutout : "70%",
        plugins: {
          legend: {
            position: "bottom",
            labels  : { boxWidth:12, font:{ size:12 } }
          }
        }
      }
    });
  }








  /* 6. Dark-mode toggle (persisted) */
  const root       = document.documentElement;
  const themeBtn   = document.getElementById("themeToggle");
  if (localStorage.theme === "dark") toggleDark(true);
  themeBtn.addEventListener("click", () => toggleDark());

  function toggleDark(force) {
    const isDark = force !== undefined ? force : !root.classList.contains("dark");
    root.classList.toggle("dark", isDark);
    localStorage.theme = isDark ? "dark" : "light";
    themeBtn.firstElementChild.classList.toggle("fa-moon", !isDark);
    themeBtn.firstElementChild.classList.toggle("fa-sun",  isDark);
  }
});

/* ✨ Timeline progress bar */
const timelineSec = document.querySelector(".timeline-section");
if (timelineSec) {
  const tlLine = timelineSec.querySelector(".timeline");
  window.addEventListener("scroll", () => {
    const rect = timelineSec.getBoundingClientRect();
    const viewH = window.innerHeight;
    const progress = Math.min(
      1,
      Math.max(0, (viewH - rect.top) / (rect.height + viewH))
    );
    tlLine.style.setProperty("--fill", `${progress * 100}%`);
  });
}

/* ╭─ CONSTELLATION CANVAS (tiny) ─────────────────────────╮ */
(() => {
  const cvs = document.getElementById('eduConstellation');
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  const nodes = [], NODE_COUNT = 60, MAX_DIST = 120;
  const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; };
  window.addEventListener('resize', resize); resize();

  for(let i=0;i<NODE_COUNT;i++){
    nodes.push({
      x: Math.random()*cvs.width,
      y: Math.random()*cvs.height,
      vx:(Math.random()-.5)*.6,
      vy:(Math.random()-.5)*.6
    });
  }
  const step = () =>{
    ctx.clearRect(0,0,cvs.width,cvs.height);
    for(const n of nodes){
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>cvs.width) n.vx*=-1;
      if(n.y<0||n.y>cvs.height) n.vy*=-1;
      ctx.fillStyle='#dbe1ff';
      ctx.fillRect(n.x,n.y,2,2);
    }
    for(let i=0;i<NODE_COUNT;i++){
      for(let j=i+1;j<NODE_COUNT;j++){
        const a=nodes[i], b=nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
        if(d<MAX_DIST){
          ctx.strokeStyle=`rgba(219,225,255,${1-d/MAX_DIST})`;
          ctx.lineWidth=.7;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  };
  step();
})();


/* ╭─ EXPERIENCE PARTICLES – upward “confetti” ───────────╮ */
/* ╭─ EXPERIENCE 2.0 EFFECTS ─────────────────────────────╮ */
(() => {
  /* 1️⃣ Halo canvas – three slowly drifting colour blobs */
  const halo = document.getElementById('expHalo');
  if (halo){
    const ctx = halo.getContext('2d');
    const blobs = [...Array(3)].map(() => ({
      x:Math.random()*innerWidth,
      y:Math.random()*innerHeight,
      r:180+Math.random()*140,
      vx:(Math.random()-.5)*.2,
      vy:(Math.random()-.5)*.2,
      c:`hsl(${Math.random()*360} 80% 60% / .9)`
    }));
    const resize = () => { halo.width=innerWidth; halo.height=innerHeight; };
    addEventListener('resize',resize); resize();
    const tick = ()=>{
      ctx.clearRect(0,0,halo.width,halo.height);
      blobs.forEach(b=>{
        b.x+=b.vx; b.y+=b.vy;
        if(b.x<-b.r||b.x>innerWidth+b.r) b.vx*=-1;
        if(b.y<-b.r||b.y>innerHeight+b.r) b.vy*=-1;
        const g=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
        g.addColorStop(0,b.c); g.addColorStop(1,'transparent');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,2*Math.PI); ctx.fill();
      });
      requestAnimationFrame(tick);
    };
    tick();
  }

  /* 2️⃣ Confetti-stream particles */
  const cvs = document.getElementById('expParticles');
  if(cvs){
    const ctx = cvs.getContext('2d');
    const P = [...Array(90)].map(()=>({
      x:Math.random()*innerWidth,
      y:Math.random()*innerHeight,
      s:Math.random()*2+1,
      vy:Math.random()*1.2+0.3
    }));
    const resize=()=>{cvs.width=innerWidth; cvs.height=innerHeight;};
    addEventListener('resize',resize); resize();
    (function loop(){
      ctx.clearRect(0,0,cvs.width,cvs.height);
      P.forEach(p=>{
        ctx.globalAlpha = p.s/3;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(p.x,p.y,p.s,p.s*3);
        p.y -= p.vy; if(p.y<-10){ p.y=cvs.height+20; p.x=Math.random()*cvs.width;}
      });
      requestAnimationFrame(loop);
    })();
  }


})();


/* ╭─ SKILLS ORBITS – planets around a sun (no libs) ─────╮ */


(()=>{                   // self-contained, small & fast
  const cvs=document.getElementById('skillsOrbits'); if(!cvs) return;
  const ctx=cvs.getContext('2d');
  const resize=()=>{cvs.width=cvs.offsetWidth; cvs.height=cvs.offsetHeight};
  window.addEventListener('resize',resize); resize();

  const orbits=[
    {r:60,s:.021,c:'#ffffff66'},
    {r:110,s:.016,c:'#ffffff44'},
    {r:160,s:.012,c:'#ffffff33'}
  ];
  let t=0;
  const loop=()=>{
    ctx.clearRect(0,0,cvs.width,cvs.height);
    ctx.translate(cvs.width/2,cvs.height/2);
    orbits.forEach(o=>{
      ctx.strokeStyle=o.c; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(0,0,o.r,0,2*Math.PI); ctx.stroke();

      const x=Math.cos(t*o.s)*o.r, y=Math.sin(t*o.s)*o.r;
      ctx.fillStyle='#fff9'; ctx.fillRect(x-2,y-2,4,4);  // tiny planet
    });
    ctx.setTransform(1,0,0,1,0,0); t+=1;
    requestAnimationFrame(loop);
  };
  loop();
})();

document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ initialize Chart.js polar area or donut
  const ctx = document.getElementById("skillsChart").getContext("2d");
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Lang & Tools","Front-End","Data & Testing"],
      datasets: [{
        data: [8,7,5],
        backgroundColor: [
          "rgba(62,230,164,.5)",
          "rgba(107,140,255,.5)",
          "rgba(255,189,214,.5)"
        ]
      }]
    },
    options: {
      cutout: "70%",
      plugins: { legend: { position: "bottom", labels:{ boxWidth:12, font:{size:12} }}}
    }
  });

  // 2️⃣ for each ring, spread its children evenly around that ring’s radius
  document.querySelectorAll(".skills-ring").forEach(ring => {
    const icons = Array.from(ring.children);
    const count = icons.length;
    const R = parseFloat(ring.dataset.radius);
    icons.forEach((icon, idx) => {
      const angle = (2 * Math.PI * idx) / count - Math.PI/2; 
      const x = Math.cos(angle) * R;
      const y = Math.sin(angle) * R;
      icon.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
});




/* ╭─ WARP-TUNNEL CANVAS (projects) ────────────────────────╮ */
(() =>{
  const c=document.getElementById('projTunnel'); if(!c) return;
  const ctx=c.getContext('2d');
  const RESIZE=()=>{c.width=c.offsetWidth; c.height=c.offsetHeight};
  window.addEventListener('resize',RESIZE); RESIZE();

  const stars=[...Array(320)].map(()=>({a:Math.random()*Math.PI*2,r:Math.random()*1+1,d:Math.random()*1+1}));
  let z=0;
  const tick=()=>{
    ctx.clearRect(0,0,c.width,c.height);
    ctx.translate(c.width/2,c.height/2);
    stars.forEach(s=>{
      const k=(z+s.d)%200/200;                  // depth 0-1
      const x=Math.cos(s.a)*k*c.width*0.6;
      const y=Math.sin(s.a)*k*c.height*0.6;
      ctx.globalAlpha=1-k; ctx.fillStyle='#ffffff';
      ctx.fillRect(x,y,s.r*(1-k)*2,s.r*(1-k)*2);
    });
    ctx.setTransform(1,0,0,1,0,0);
    z+=1.2; if(z>200) z=0;
    requestAnimationFrame(tick);
  };
  tick();
})();






// spread icons around each skills-ring
document.querySelectorAll(".skills-ring").forEach(ring => {
  const icons = Array.from(ring.children);
  const count = icons.length;
  const R = +ring.dataset.radius;
  icons.forEach((icon, i) => {
    const angle = 2 * Math.PI * i / count - Math.PI/2;
    const x = Math.cos(angle) * R;
    const y = Math.sin(angle) * R;
    icon.style.transform = `translate(${x}px, ${y}px)`;
  });
});











/* ╭─ CONSTELLATION CANVAS (publications) ──────────────────╮ */
(() =>{
  const cvs = document.getElementById('pubConstellation'); if(!cvs) return;
  const ctx = cvs.getContext('2d');
  const resize = () => { cvs.width = cvs.offsetWidth; cvs.height = cvs.offsetHeight; };
  window.addEventListener('resize', resize); resize();

  const N = 70, MAX = 110, nodes=[];
  for(let i=0;i<N;i++){
    nodes.push({x:Math.random()*cvs.width, y:Math.random()*cvs.height,
                vx:(Math.random()-.5)*.5,  vy:(Math.random()-.5)*.5});
  }
  const step = ()=>{
    ctx.clearRect(0,0,cvs.width,cvs.height);
    nodes.forEach(n=>{
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>cvs.width)  n.vx*=-1;
      if(n.y<0||n.y>cvs.height) n.vy*=-1;
      ctx.fillStyle='#cfd9ff'; ctx.fillRect(n.x,n.y,1.8,1.8);
    });
    for(let i=0;i<N;i++){
      for(let j=i+1;j<N;j++){
        const a=nodes[i], b=nodes[j];
        const d=Math.hypot(a.x-b.x,a.y-b.y); if(d<MAX){
          ctx.strokeStyle=`rgba(207,217,255,${1-d/MAX})`;
          ctx.lineWidth=.6; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  };
  step();
})();


// ╭─ CONTACT – particles & ring trigger ───────────────────╮
(() => {
  // 1️⃣ Three.js particle swirl
  const canvas = document.getElementById('contactParticles');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true });
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 1000);
  camera.position.z = 200;
  renderer.setSize(innerWidth, innerHeight);

  const geo = new THREE.BufferGeometry();
  const count = 800;
  const pos = new Float32Array(count*3).map(() => (Math.random()-0.5)*400);
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({ color:0xffffff, size:2, transparent:true, opacity:.4 });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);

  function tick() {
    pts.rotation.y += 0.0008;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  /* —— Anime.js: kick satellites in one-by-one on load —— */
document.addEventListener('DOMContentLoaded', () => {
  const sats = document.querySelectorAll('.lang-sat');
  anime({
    targets: sats,
    opacity: [0, 1],
    scale:   [0.5, 1],
    easing:  'easeOutBack',
    delay:   anime.stagger(180)        // 0->180->360 ms …
  });
});



/*  ▸ re-init tilt + AOS when a project tab is shown  */
const projTab = document.getElementById("projTabContent");
projTab.addEventListener("shown.bs.tab", () => {
  VanillaTilt.init(document.querySelectorAll('#projects [data-tilt]'));
  AOS.refresh();
});






  // 2️⃣ Animate proficiency rings when scrolled into view
  AOS.refresh(); // ensure AOS has initialized
})();

/* fade & pop satellites when the lang-card enters the viewport */
AOS.init();           // already in your file – leave as is

document.querySelectorAll('.lang-card').forEach(card => {
  card.addEventListener('aos:in', () => {
    card.querySelectorAll('.lang-sat').forEach(sat => {
      sat.style.opacity   = '1';
      sat.style.transform = sat.dataset.t;   // hop to final orbit
    });
  });
});



// ─── QRCODE.JS: generate your email-vCard QR ─────────────────
new QRCode(document.getElementById("qrCode"), {
  text:    "mailto:syedajannatulferdous121@gmail.com?subject=Hello!",
  width:   120, height: 120,
  colorDark: "#000", colorLight: "#fff", correctLevel: QRCode.CorrectLevel.H
});


// after loading qrcode.min.js
new QRCode(document.getElementById("qrCode"), {
  text:      "https://wa.me/4917636389870",
  width:     100,
  height:    100,
  colorDark: "#000000",
  colorLight:"#ffffff",
  correctLevel: QRCode.CorrectLevel.H
});




// ─── FORM VALIDATION & EMAILJS ───────────────────────────────
const validator = new JustValidate("#contactForm");
validator
  .addField("input[name=user_name]",    [{ rule: "required" }])
  .addField("input[name=user_email]",   [{ rule: "required" }, { rule: "email" }])
  .addField("textarea[name=message]",   [{ rule: "required" }])
  .onSuccess((event) => {
    event.preventDefault();
    emailjs.sendForm("YOUR_SERVICE_ID","YOUR_TEMPLATE_ID","#contactForm")
      .then(() => {
        gsap.to(".contact-form button", { text: "Sent ✅", duration: .5 });
      })
      .catch(() => {
        gsap.to(".contact-form button", { text: "Error ❌", duration: .5 });
      });
  });

// ─── GSAP INTRO TIMELINE ────────────────────────────────────
gsap.timeline({
  scrollTrigger: {
    trigger: ".contact-card",   // ← changed from .lang-card
    start: "top 80%",
    once: true
  }
})
  .to(".contact-form", { autoAlpha: 1, y: 0, duration: .8, ease: "power3.out" })
  .to(".qr-code",      { autoAlpha: 1, scale: 1,   duration: .6 }, "-=0.4");



  /* JS – tiny vanilla lazy-loader (runs immediately) */
document.addEventListener('DOMContentLoaded',()=>{
  const img = document.querySelector('.hero-bg');
  const src = img.dataset.src;
  const hiRes = new Image();
  hiRes.src = src;
  hiRes.onload = () => {
    img.src = src;
    img.dataset.loaded = 'true';
  };
});



// 5️⃣ Back-to-top button
const backBtn = document.getElementById("backToTop");
backBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
window.addEventListener("scroll", () => {
  backBtn.classList.toggle("show", window.scrollY > 400);
});

















// medinym

function initGallery () {

  /* 0️⃣ register Swiper modules (💥 important) */
  const { Autoplay, EffectCoverflow, Navigation,
          Mousewheel, Keyboard } = Swiper;
  Swiper.use([Autoplay, EffectCoverflow, Navigation, Mousewheel, Keyboard]);


  /* ① Lazy-load thumbs */
  const observer = lozad('.lazy', { loaded: el => el.classList.add('loaded') });
  observer.observe();

  /* ② Swiper carousel */
  const swipe = new Swiper('.gallery-swiper', {
    effect        : 'coverflow',
    grabCursor    : true,
    slidesPerView : 'auto',
    centeredSlides: true,
    loop          : true,
    speed         : 900,
    spaceBetween  : 24,
    coverflowEffect:{
      rotate:0, stretch:0, depth:160, modifier:1, slideShadows:false
    },
    autoplay:{
      delay: 3200,          // 3.2 s per slide
      disableOnInteraction:false
    },
    mousewheel : { forceToAxis:true, sensitivity:.8 },
    navigation : { nextEl:'.swiper-button-next', prevEl:'.swiper-button-prev' },
    keyboard   : { enabled:true }
  });

/* --- kick Autoplay in case Swiper didn’t start it by itself --- */
if (swipe.params.autoplay && !swipe.autoplay?.running) {
  swipe.autoplay.start();
}




  /* ③ GLightbox */
  GLightbox({ selector: '.glightbox', touchNavigation:true });

  /* ④ Progress-bar & Masonry once images in Swiper are loaded */
  imagesLoaded('.gallery-swiper', () => {

    const grid = new Isotope('.masonry-grid', { itemSelector:'a', layoutMode:'masonry' });

    document.querySelectorAll('.filter-btn').forEach(b =>
      b.addEventListener('click', () => {
        document.querySelector('.filter-btn.active')?.classList.remove('active');
        b.classList.add('active');
        grid.arrange({ filter: b.dataset.filter });
      })
    );

    const bar = document.querySelector('.swiper-progress .bar');
    swipe.on('slideChangeTransitionEnd', () => {
      const pct = (swipe.realIndex + 1) /
                  (swipe.slides.length - swipe.loopedSlides) * 100;
      bar.style.width = pct + '%';
    });

    /* fancy hover-shadow */
    document.querySelectorAll('.swiper-slide img').forEach(img => {
      const apply = () => {
        Vibrant.from(img).getPalette((err,pal) => {
          if (pal?.Vibrant) img.parentElement.style.setProperty('--hover', pal.Vibrant.getHex());
        });
      };
      img.complete ? apply() : img.addEventListener('load', apply);
    });
  });
}

if (document.readyState !== 'loading') {
  initGallery();            // DOM is ready – call straight away
} else {
  document.addEventListener('DOMContentLoaded', initGallery);
}











/* ─── Brain-Wave modal Swiper (v9+) ───────────────────── */
(() => {
  const mdl = document.getElementById('wheelModal');
  if (!mdl) return;                    // safety

  /* Pull ES-modules out of global Swiper bundle */
  const { Autoplay, Pagination, EffectFade } = Swiper;

  let swiper = null;                   // create once

  mdl.addEventListener('shown.bs.modal', () => {
    if (!swiper) {
      swiper = new Swiper('.wheelSwiper', {
        modules      : [Autoplay, Pagination, EffectFade],
        loop         : true,
        effect       : 'fade',
        fadeEffect   : { crossFade: true },
        speed        : 800,
        autoplay     : { delay: 2800, disableOnInteraction: false },
        pagination   : { el: '.wheelSwiper .swiper-pagination', clickable: true }
      });
    } else {
      swiper.update();      // resize awareness
      swiper.autoplay.start();
    }
  });

  mdl.addEventListener('hide.bs.modal', () => swiper?.autoplay.stop());
})();







/* ── 6 G modal: animate KPI bars & reset on close ── */
(() => {
  const mdl = document.getElementById('g6Modal');
  if (!mdl) return;

  mdl.addEventListener('shown.bs.modal', () => {
    mdl.querySelectorAll('.progress-bar[data-width]')
       .forEach(bar => bar.style.width = bar.dataset.width + '%');
  });

  mdl.addEventListener('hidden.bs.modal', () => {
    mdl.querySelectorAll('.progress-bar[data-width]')
       .forEach(bar => (bar.style.width = '0%'));
  });
})();







// UI/UX gallery prev/next
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.uiux-gallery');
  const prevBtn = document.querySelector('.uiux-prev');
  const nextBtn = document.querySelector('.uiux-next');
  const slideWidth = () => gallery.clientWidth * 0.8;

  prevBtn.addEventListener('click', () => {
    gallery.scrollBy({ left: -slideWidth(), behavior: 'smooth' });
  });
  nextBtn.addEventListener('click', () => {
    gallery.scrollBy({ left:  slideWidth(), behavior: 'smooth' });
  });
});





/* === Defer rich backgrounds & animations to in-viewport ========== */
(() => {
  const targets = document.querySelectorAll(
    '.edu-hero, .exp-hero, .skills-hero, .proj-hero, .pub-hero, .contact-hero'
  );
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('bg-live');   // turn on rich gradient + animations
        // once it’s live, we don’t need to observe again
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '100px 0px', threshold: 0.05 });

  targets.forEach(el => io.observe(el));
})();



/* Hero “Scroll ↓” → smooth scroll to the next section */
(() => {
  const trigger = document.querySelector('#hero .hero-scroll');
  if (!trigger) return;

  // Find the first real <section> after the hero (fallback to #education)
  const nextSection = (() => {
    const list = Array.from(document.querySelectorAll('section'));
    return list[0] || document.querySelector('#education');
  })();

  const go = () => nextSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  trigger.addEventListener('click', (e) => { e.preventDefault(); go(); });
  trigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
  });

  // a11y: make the div behave like a button
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('tabindex', '0');
  trigger.setAttribute('aria-label', 'Scroll to next section');
})();






