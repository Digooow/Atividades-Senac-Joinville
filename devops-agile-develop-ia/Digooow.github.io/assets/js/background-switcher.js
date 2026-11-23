/* ==========================================================================
   BACKGROUND SWITCHER — Transição de Fundo no Scroll com Lazy Hydration
   ========================================================================== */

const SECTIONS = [
  { id: 'home', index: 0 },
  { id: 'pipeline', index: 1 },
  { id: 'projetos', index: 2 },
  { id: 'terminal', index: 3 },
  { id: 'sobre', index: 4 }
];

function hydrateSlide(slide) {
  if (!slide) return;
  const bgUrl = slide.dataset.bg;
  if (!bgUrl || slide.dataset.bgLoaded === 'true') return;

  slide.style.backgroundImage = `url("${bgUrl}")`;
  slide.dataset.bgLoaded = 'true';
}

export function initBackgroundSwitcher() {
  const slides = document.querySelectorAll('.bg-slide');
  if (!slides.length) return;

  function updateBackground() {
    const scrollPos = globalThis.scrollY + globalThis.innerHeight * 0.45;
    let activeIndex = 0;

    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el && scrollPos >= el.offsetTop) {
        activeIndex = sec.index;
      }
    }

    hydrateSlide(slides[activeIndex]);
    hydrateSlide(slides[activeIndex + 1]);

    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === activeIndex);
    });
  }

  if ('IntersectionObserver' in globalThis) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const match = SECTIONS.find((s) => s.id === entry.target.id);
          if (match) {
            hydrateSlide(slides[match.index]);
          }
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '450px 0px' }
    );

    for (const sec of SECTIONS) {
      const el = document.getElementById(sec.id);
      if (el && sec.index > 0) {
        observer.observe(el);
      }
    }
  } else {
    slides.forEach(hydrateSlide);
  }

  globalThis.addEventListener('scroll', updateBackground, { passive: true });
  updateBackground();
}
