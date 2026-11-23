/* ==========================================================================
   MOTE CLASS — Partículas Luminosas com Cache de Textura Compartilhado e Bloom
   ========================================================================== */

import { randomUnit } from './random.js';

// 1. Paletas ricas com cores vivas e alta saturação luminosa
const COLOR_VARIANTS = [
  {
    outer:   [234, 150, 8],
    ambient: [250, 190, 20],
    glow:    [253, 218, 50],
    warm:    [254, 240, 138],
    inner:   [255, 252, 220]
  },
  {
    outer:   [217, 100, 10],
    ambient: [245, 150, 15],
    glow:    [251, 191, 36],
    warm:    [253, 224, 71],
    inner:   [255, 246, 210]
  },
  {
    outer:   [202, 138, 4],
    ambient: [234, 179, 8],
    glow:    [250, 204, 21],
    warm:    [254, 240, 138],
    inner:   [255, 255, 230]
  },
  {
    outer:   [234, 88, 12],
    ambient: [249, 115, 22],
    glow:    [251, 146, 60],
    warm:    [253, 186, 116],
    inner:   [255, 250, 240]
  }
];

const SPRITE_SIZE = 512;
let sharedSprites = null;

function rgba(c, a) {
  return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;
}

function getSharedSprites() {
  if (sharedSprites) return sharedSprites;

  sharedSprites = COLOR_VARIANTS.map((variant) => {
    const canvas = document.createElement('canvas');
    canvas.width = SPRITE_SIZE;
    canvas.height = SPRITE_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const center = SPRITE_SIZE / 2;
    const maxRadius = center - 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, maxRadius);

    gradient.addColorStop(0.000, 'rgba(255, 255, 255, 1.0)');
    gradient.addColorStop(0.008, 'rgba(255, 255, 255, 0.95)');
    gradient.addColorStop(0.025, rgba(variant.inner, 0.78));
    gradient.addColorStop(0.060, rgba(variant.warm, 0.52));
    gradient.addColorStop(0.120, rgba(variant.glow, 0.32));
    gradient.addColorStop(0.220, rgba(variant.ambient, 0.18));
    gradient.addColorStop(0.380, rgba(variant.ambient, 0.10));
    gradient.addColorStop(0.560, rgba(variant.outer, 0.05));
    gradient.addColorStop(0.740, rgba(variant.outer, 0.022));
    gradient.addColorStop(0.880, rgba(variant.outer, 0.008));
    gradient.addColorStop(0.960, rgba(variant.outer, 0.002));
    gradient.addColorStop(1.000, rgba(variant.outer, 0.000));

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  });

  return sharedSprites;
}

export class Mote {
  constructor(width, height) {
    this.phase = randomUnit() * Math.PI * 2;
    this.pulseSpeed = 1.3 + randomUnit() * 1.4;
    this.individualSize = 0.90 + randomUnit() * 0.45;
    this.intensityBase = 0.82 + randomUnit() * 0.18;
    this.colorIndex = Math.floor(randomUnit() * COLOR_VARIANTS.length);

    this.reposition(width, height, true);
  }

  reposition(width, height, initial = false) {
    this.x = randomUnit() * width;
    this.y = 38 + randomUnit() * Math.max(1, height - 38);

    const speedFactor = 0.02 + randomUnit() * 0.16;
    this.vx = (randomUnit() - 0.5) * speedFactor;
    this.vy = (randomUnit() - 0.5) * (speedFactor * 0.7);

    this.z = initial ? 0.15 + randomUnit() * 0.85 : 0.15 + randomUnit() * 0.35;
    this.zSpeed = (randomUnit() - 0.48) * 0.0022;
    this.life = initial ? randomUnit() * 1000 : 0;
  }

  update(width, height) {
    this.life += 1;
    this.phase += 0.01;

    this.x += this.vx + Math.sin(this.phase * 0.8) * 0.05;
    this.y += this.vy + Math.cos(this.phase * 0.7) * 0.04;

    this.z += this.zSpeed;
    if (this.z > 1.15) this.zSpeed = -Math.abs(this.zSpeed);
    if (this.z < 0.14) this.zSpeed = Math.abs(this.zSpeed);

    if (this.x < -160 || this.x > width + 160 || this.y < 10 || this.y > height + 160) {
      this.reposition(width, height, false);
    }
  }

  draw(ctx) {
    const sprites = getSharedSprites();
    const sprite = sprites[this.colorIndex];

    const pulse = 0.88 + Math.sin(this.phase * this.pulseSpeed) * 0.12;
    const proximity = Math.max(0, Math.min(1, (this.z - 0.14) / 0.98));
    const renderRadius = (90 + proximity * 180) * this.individualSize * pulse;
    const renderDiam = renderRadius * 2;
    const brightness = (0.38 + proximity * 0.60) * this.intensityBase * pulse;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1.0, brightness);
    ctx.drawImage(
      sprite,
      this.x - renderRadius,
      this.y - renderRadius,
      renderDiam,
      renderDiam
    );
    ctx.restore();
  }
}
