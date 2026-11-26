export function createParticles() {
  return { list: [] };
}

export function spawnExhaust(p, x, y) {
  const particle = {
    x,
    y,
    vx: 0.5,
    vy: -0.5,
    life: 0.5,
    max: 0.5,
    size: 2,
    color: '#c9a37a'
  };
  p.list.push(particle);
  if (p.list.length > 200) p.list.shift();
}

export function spawnBurst(p, x, y, color = '#ffd27a') {
  for (let i = 0; i < 14; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 1.5 + 0.5;
    p.list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      max: 1.0,
      size: 1.5,
      color
    });
  }
}

export function spawnDust(p, x, y) {
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.5 + 0.1;
    p.list.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 0.8,
      max: 0.8,
      size: 1.0,
      color: '#8a6b4a'
    });
  }
}

export function updateParticles(p, dt) {
  const alive = [];
  for (const part of p.list) {
    part.x += part.vx * dt;
    part.y += part.vy * dt;
    part.life -= dt;
    if (part.life > 0) alive.push(part);
  }
  p.list = alive;
}

export function drawParticles(ctx, p, camX) {
  for (const part of p.list) {
    const alpha = part.life / part.max;
    ctx.save();
    ctx.globalAlpha = alpha;
    const cx = (part.x - camX) * 0.09;
    const cy = 800 - part.y * 0.12;
    ctx.beginPath();
    ctx.arc(cx, cy, part.size, 0, Math.PI * 2);
    ctx.fillStyle = part.color;
    ctx.fill();
    ctx.restore();
  }
}

