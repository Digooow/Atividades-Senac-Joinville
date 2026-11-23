/* ==========================================================================
   CANVAS ENGINE — Gerenciamento e Loop do Canvas
   ========================================================================== */

import { Fairy } from './fairy.js';
import { Mote } from './mote.js';

export function initFairyCanvas() {
  const canvas = document.getElementById('fairy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let fairies = [];
  let motes = [];
  let allEntities = [];
  let animationFrame = 0;
  let lastFrameTime = 0;
  const reducedMotion = globalThis.matchMedia('(prefers-reduced-motion: reduce)');

  function resize() {
    width = globalThis.innerWidth;
    height = globalThis.innerHeight;
    const renderScale = Math.min(1, globalThis.devicePixelRatio || 1);
    canvas.width = Math.floor(width * renderScale);
    canvas.height = Math.floor(height * renderScale);
    ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  }

  function spawnLights() {
    fairies = [];
    motes = [];

    const isMobile = globalThis.innerWidth < 768;
    const fairyCount = isMobile ? 14 : 26;
    for (let i = 0; i < fairyCount; i += 1) {
      fairies.push(new Fairy(width, height, i));
    }

    const moteCount = isMobile ? 55 : 100;
    for (let i = 0; i < moteCount; i += 1) {
      motes.push(new Mote(width, height));
    }

    allEntities = [...fairies, ...motes];
  }

  resize();
  spawnLights();
  globalThis.addEventListener('resize', () => {
    resize();
    spawnLights();
  }, { passive: true });

  function loop() {
    animationFrame = requestAnimationFrame(loop);
    if (reducedMotion.matches || document.hidden) return;

    const now = performance.now();
    if (now - lastFrameTime < 33) return;
    lastFrameTime = now;

    ctx.clearRect(0, 0, width, height);

    for (const fairy of fairies) {
      fairy.update(width, height);
    }
    for (const mote of motes) {
      mote.update(width, height);
    }

    allEntities.sort((a, b) => a.z - b.z);
    for (const entity of allEntities) {
      entity.draw(ctx);
    }
  }

  loop();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      lastFrameTime = 0;
      cancelAnimationFrame(animationFrame);
      loop();
    }
  });
}
