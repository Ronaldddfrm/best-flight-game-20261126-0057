export function drawMarkers(ctx, state, world) {
  const camX = Math.max(0, state.plane.x - 3000);
  const screenX = (worldX) => (worldX - camX) * 0.09;
  const screenY = (altitudeFeet) => 800 - altitudeFeet * 0.12;
  const isOffScreen = (x) => x < -60 || x > 1340;

  for (const ring of world.rings) {
    const x = screenX(ring.x);
    if (isOffScreen(x)) continue;

    ctx.save();
    ctx.globalAlpha = ring.hit ? 0.25 : 1;
    ctx.strokeStyle = '#ffd27a';
    ctx.lineWidth = 4;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ffd27a';
    ctx.beginPath();
    ctx.arc(x, screenY(ring.y), 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const zoneX = screenX(world.dropZone.x);
  const zoneWidth = world.dropZone.width * 0.09;
  if (zoneX + zoneWidth >= -60 && zoneX <= 1340) {
    const centreX = zoneX + zoneWidth / 2;
    ctx.save();
    ctx.strokeStyle = '#7dff8a';
    ctx.fillStyle = '#7dff8a';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(zoneX, 760, zoneWidth, 40);
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(centreX, 800);
    ctx.lineTo(centreX, 744);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centreX, 744);
    ctx.lineTo(centreX + 16, 751);
    ctx.lineTo(centreX, 758);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  for (const storm of world.storms) {
    const x = screenX(storm.x);
    if (isOffScreen(x)) continue;

    const y = screenY(storm.y);
    const radius = storm.r * 0.12;
    ctx.save();
    ctx.fillStyle = 'rgba(120,100,160,0.35)';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffdc62';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    const tickSize = Math.min(10, radius * 0.2);
    for (let i = -1; i <= 1; i += 1) {
      const tickX = x + i * radius * 0.45;
      ctx.beginPath();
      ctx.moveTo(tickX + tickSize * 0.4, y - tickSize);
      ctx.lineTo(tickX - tickSize * 0.4, y);
      ctx.lineTo(tickX + tickSize * 0.4, y);
      ctx.lineTo(tickX - tickSize * 0.4, y + tickSize);
      ctx.stroke();
    }
    ctx.restore();
  }
}
