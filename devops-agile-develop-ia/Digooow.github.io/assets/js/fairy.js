/* ==========================================================================
   FAIRY CLASS — Modelo, Física e Renderização 3D
   ========================================================================== */

import { randomUnit } from './random.js';

const PALETTE_CYCLE_COUNT = 10;
const GOLDEN_ANGLE_DEG = 137.508;

function hslSectorToRgb(segment, chroma, x) {
  if (segment < 1) return [chroma, x, 0];
  if (segment < 2) return [x, chroma, 0];
  if (segment < 3) return [0, chroma, x];
  if (segment < 4) return [0, x, chroma];
  if (segment < 5) return [x, 0, chroma];
  return [chroma, 0, x];
}

function hslToRgb(hue, saturation, lightness) {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const segment = hue / 60;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = l - chroma / 2;
  const [red, green, blue] = hslSectorToRgb(segment, chroma, x);

  return {
    red: Math.round((red + match) * 255),
    green: Math.round((green + match) * 255),
    blue: Math.round((blue + match) * 255)
  };
}

function createFairyPalette(index) {
  const hue = (index * GOLDEN_ANGLE_DEG + (index % PALETTE_CYCLE_COUNT) * 3.7) % 360;
  const saturation = 98 + (index % 4) * 4;
  const bodyLightness = 88 - (index % 3) * 4;
  const wingLightness = 88 + (index % 4) * 4;
  const glowLightness = 50 + (index % 3) * 4;

  return {
    body: hslToRgb(hue, saturation, bodyLightness),
    wing: hslToRgb(hue, saturation + 8, wingLightness),
    glow: hslToRgb(hue, saturation + 12, glowLightness)
  };
}

function rgba(color, alpha) {
  return `rgba(${color.red}, ${color.green}, ${color.blue}, ${alpha})`;
}

export class Fairy {
  constructor(width, height, paletteIndex = 0) {
    this.palette = createFairyPalette(paletteIndex);
    this.reposition(width, height, true);
  }

  reposition(width, height, initial = false) {
    this.x = randomUnit() * width;
    this.y = 38 + randomUnit() * Math.max(1, height - 38);
    this.z = initial ? 0.1 + randomUnit() * 0.8 : 0.1 + randomUnit() * 0.3;

    this.angle = randomUnit() * Math.PI * 2;
    this.targetAngle = this.angle;
    this.erraticism = randomUnit();
    this.speed = 0.08 + randomUnit() * 0.52;
    this.currentSpeed = this.speed;

    this.nextDirectionChange = Math.floor(20 + randomUnit() * (1 - this.erraticism) * 250);
    this.turnSeverity = 0.02 + this.erraticism * 0.12;

    this.assignDepthBehavior();

    this.phase = randomUnit() * Math.PI * 2;
    this.noiseOffset = randomUnit() * 1000;
    this.wingSpeed = 0.15 + this.speed * 0.4 + randomUnit() * 0.1;
  }

  assignDepthBehavior() {
    const rand = randomUnit();
    if (rand < 0.65) {
      this.zBehavior = 0;
      this.zSpeed = (randomUnit() - 0.5) * 0.002;
      return;
    }
    if (rand < 0.88) {
      this.zBehavior = 1;
      this.zSpeed = -0.0008 - randomUnit() * 0.002;
      return;
    }
    this.zBehavior = 2;
    this.zSpeed = 0.002 + randomUnit() * 0.004;
  }

  updateHeading() {
    this.nextDirectionChange -= 1;
    if (this.nextDirectionChange <= 0) {
      const angleShift = (randomUnit() - 0.5) * Math.PI * (0.3 + this.erraticism * 1.2);
      this.targetAngle += angleShift;
      this.currentSpeed = this.speed * (0.5 + randomUnit() * 0.9);
      this.nextDirectionChange = Math.floor(20 + (1 - this.erraticism) * 200 + randomUnit() * 80);
    }

    this.angle += (this.targetAngle - this.angle) * this.turnSeverity;
  }

  updateDepth(width, height) {
    this.z += this.zSpeed;
    if (this.zBehavior === 0) {
      if (this.z > 0.92) this.zSpeed = -Math.abs(this.zSpeed);
      if (this.z < 0.12) this.zSpeed = Math.abs(this.zSpeed);
    }

    if (this.z < 0.04 || this.z > 3.5) {
      this.reposition(width, height, false);
    }
  }

  wrapOrRespawn(width, height) {
    const margin = 120 * Math.max(1, this.z);
    const outOfBounds =
      this.x < -margin ||
      this.x > width + margin ||
      this.y < 38 - margin ||
      this.y > height + margin;

    if (!outOfBounds) return;

    if (this.z > 1.2) {
      this.reposition(width, height, false);
      return;
    }

    if (this.x < -margin) this.x = width + margin;
    else if (this.x > width + margin) this.x = -margin;

    if (this.y < 38 - margin) this.y = height + margin;
    else if (this.y > height + margin) this.y = 38 - margin;
  }

  update(width, height) {
    this.phase += 0.015;
    this.noiseOffset += 0.01;

    this.updateHeading();

    const waveNoiseX = Math.sin(this.phase * 1.7 + this.noiseOffset) * 0.3;
    const waveNoiseY = Math.cos(this.phase * 1.3 + this.noiseOffset) * 0.3;
    const effectiveSpeed = this.currentSpeed * (0.4 + 0.6 * Math.min(1.5, this.z));

    this.x += (Math.cos(this.angle) + waveNoiseX) * effectiveSpeed;
    this.y += (Math.sin(this.angle) + waveNoiseY) * effectiveSpeed * 0.8;

    this.updateDepth(width, height);
    this.wrapOrRespawn(width, height);
  }

  computeAlpha() {
    if (this.z <= 1.0) {
      const pulse = 0.78 + Math.sin(this.phase * 2) * 0.18;
      const opacity = 0.25 + this.z * 0.75;
      return Math.min(1, opacity * pulse);
    }
    return Math.max(0, 1.0 - (this.z - 1.0) / 2.5);
  }

  drawAura(ctx) {
    const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 70);
    aura.addColorStop(0, rgba(this.palette.wing, 0.6));
    aura.addColorStop(0.45, rgba(this.palette.glow, 0.16));
    aura.addColorStop(1, rgba(this.palette.glow, 0));
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, 0, 70, 0, Math.PI * 2);
    ctx.fill();
  }

  drawWing(ctx, side, wingFlutter) {
    ctx.save();
    ctx.rotate(side * (-0.22 + wingFlutter));
    const wingGrad = ctx.createRadialGradient(side * 22, -12, 2, side * 25, -12, 42);
    wingGrad.addColorStop(0, rgba(this.palette.body, 0.92));
    wingGrad.addColorStop(0.35, rgba(this.palette.wing, 0.72));
    wingGrad.addColorStop(0.82, rgba(this.palette.glow, 0.3));
    wingGrad.addColorStop(1, rgba(this.palette.glow, 0));
    ctx.fillStyle = wingGrad;
    ctx.beginPath();
    ctx.ellipse(side * 25, -12, 38, 18, side * (Math.PI / 5), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = rgba(this.palette.body, 0.52);
    ctx.beginPath();
    ctx.moveTo(side * 2, -9);
    ctx.lineTo(side * 50, -30);
    ctx.moveTo(side * 12, -13);
    ctx.lineTo(side * 43, -3);
    ctx.stroke();
    ctx.restore();
  }

  drawBody(ctx, glow) {
    ctx.shadowBlur = 38 * glow;
    const bodyGradient = ctx.createLinearGradient(0, -22, 0, 28);
    bodyGradient.addColorStop(0, rgba(this.palette.body, 1));
    bodyGradient.addColorStop(0.45, rgba(this.palette.wing, 0.96));
    bodyGradient.addColorStop(1, rgba(this.palette.glow, 0.48));
    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = rgba(this.palette.body, 0.86);
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.ellipse(0, -18, 5, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-5, -23);
    ctx.quadraticCurveTo(-10, -18, -8, -10);
    ctx.quadraticCurveTo(-5, -24, 0, -25);
    ctx.quadraticCurveTo(5, -24, 8, -10);
    ctx.quadraticCurveTo(10, -18, 5, -23);
    ctx.fillStyle = rgba(this.palette.glow, 0.68);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, -11);
    ctx.bezierCurveTo(-8, -6, -8, 8, -18, 27);
    ctx.quadraticCurveTo(0, 21, 18, 27);
    ctx.bezierCurveTo(8, 8, 8, -6, 0, -11);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = rgba(this.palette.wing, 0.9);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-4, -9);
    ctx.quadraticCurveTo(-19, -25, -40, -28);
    ctx.moveTo(4, -9);
    ctx.quadraticCurveTo(19, -25, 40, -28);
    ctx.moveTo(-5, -2);
    ctx.quadraticCurveTo(-11, 10, -24, 22);
    ctx.moveTo(5, -2);
    ctx.quadraticCurveTo(11, 10, 24, 22);
    ctx.stroke();
  }

  draw(ctx) {
    const alpha = this.computeAlpha();
    if (alpha <= 0.01) return;

    const scale = 0.7 * this.z;
    const glow = Math.min(2.5, 0.4 + this.z * 0.8);
    const direction = Math.cos(this.angle) >= 0 ? 1 : -1;
    const wingFlutter = Math.sin(this.phase * 3.5 * this.wingSpeed) * 0.18;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(direction * scale, scale);
    ctx.globalAlpha = alpha;
    ctx.shadowColor = rgba(this.palette.glow, 0.9);
    ctx.shadowBlur = 22 * glow;

    this.drawAura(ctx);

    ctx.strokeStyle = rgba(this.palette.body, 0.72);
    ctx.lineWidth = 1.2;
    this.drawWing(ctx, -1, wingFlutter);
    this.drawWing(ctx, 1, wingFlutter);

    this.drawBody(ctx, glow);
    ctx.restore();
  }
}
