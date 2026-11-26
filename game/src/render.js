import { CONFIG } from './config.js';
import { drawPlane } from './plane.js';
import { drawParticles } from './particles.js';
import { drawMarkers } from './markers.js';

export function drawScene(ctx, state, world, particles) {
  const { width, height } = ctx.canvas;
  const camX = Math.max(0, state.plane.x - 3000);
  const palette = CONFIG.palette;

  // Sunset sky.
  const sky = ctx.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, palette.skyTop);
  sky.addColorStop(1, palette.horizon);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, height);

  // Sun and its surrounding glow.
  const sunX = width - 150;
  const sunY = 100;
  const rad = 40;
  const glow = ctx.createRadialGradient(sunX, sunY, rad, sunX, sunY, rad * 3);
  glow.addColorStop(0, palette.sun + '88');
  glow.addColorStop(1, palette.sun + '00');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, rad * 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = palette.sun;
  ctx.beginPath();
  ctx.arc(sunX, sunY, rad, 0, Math.PI * 2);
  ctx.fill();

  // Three distant sine-ridge layers in world coordinates.
  const mountain = (altitudeFeet, amplitudeFeet, phase, color) => {
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let sx = 0; sx <= 1280; sx += 20) {
      const worldX = camX + sx / 0.09;
      const ridgeFeet = altitudeFeet + Math.sin(worldX / 2200 + phase) * amplitudeFeet;
      ctx.lineTo((worldX - camX) * 0.09, 800 - ridgeFeet * 0.12);
    }
    ctx.lineTo(1280, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };
  mountain(2600, 600, 0, palette.mountainFar);
  mountain(1900, 450, 0.5, palette.mountainMid);
  mountain(1200, 300, 1, palette.mountainNear);

  // Terrain height is a function of world x in metres, returning feet.
  ctx.beginPath();
  for (let sx = 0; sx <= 1280; sx += 20) {
    const worldX = camX + sx / 0.09;
    const h = world.terrainHeight(worldX);
    const screenY = 800 - h * 0.12;
    if (sx === 0) ctx.moveTo(sx, screenY);
    else ctx.lineTo(sx, screenY);
  }
  ctx.lineTo(1280, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = palette.field;
  ctx.fill();

  // Runway bands extend ten pixels upward from ground level.
  const groundY = 800 - 0 * 0.12;
  const runwayHeight = 10;
  const dash = 15;
  for (const runway of [world.runways.departure, world.runways.destination]) {
    const screenX0 = (runway.x0 - camX) * 0.09;
    const screenX1 = (runway.x1 - camX) * 0.09;
    const left = Math.max(0, screenX0);
    const right = Math.min(width, screenX1);
    if (right <= left) continue;
    ctx.fillStyle = palette.runway;
    ctx.fillRect(left, groundY - runwayHeight, right - left, runwayHeight);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    const firstDash = screenX0 + Math.max(0, Math.floor((left - screenX0) / (dash * 2))) * dash * 2;
    for (let x = firstDash; x < right; x += dash * 2) {
      const dashStart = Math.max(left, x);
      const dashEnd = Math.min(right, x + dash);
      if (dashEnd <= dashStart) continue;
      ctx.beginPath();
      ctx.moveTo(dashStart, groundY - runwayHeight / 2);
      ctx.lineTo(dashEnd, groundY - runwayHeight / 2);
      ctx.stroke();
    }
  }

  drawMarkers(ctx, state, world);
  drawPlane(ctx, state.plane, camX, height/2);
  drawParticles(ctx, particles, camX, height/2);
}
