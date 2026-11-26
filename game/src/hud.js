import { LEGS, rankTitle } from './missions.js';

const WIDTH = 1280;
const HEIGHT = 800;

export function drawHUD(ctx, state) {
  const { plane, mission } = state;
  const leg = LEGS[mission.leg];
  const fuel = Math.max(0, Math.min(100, plane.fuel));
  const damage = Math.max(0, Math.min(100, plane.damage));
  const seconds = Math.max(0, Math.floor(mission.time));
  const timer = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  ctx.save();
  ctx.fillStyle = 'rgba(20,10,40,0.65)';
  ctx.fillRect(0, 0, WIDTH, 56);
  ctx.font = '16px monospace';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'white';
  ctx.fillText(`ALT ${Math.round(plane.y)} ft`, 16, 16);
  ctx.fillText(`SPD ${Math.round(plane.speedKt)} kt`, 200, 16);
  ctx.fillText(`HDG ${Math.round(plane.heading)} deg`, 368, 16);

  ctx.fillText('FUEL', 16, 40);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(68, 34, 120, 12);
  ctx.fillStyle = fuel < 25 ? 'red' : 'green';
  ctx.fillRect(68, 34, 120 * fuel / 100, 12);

  ctx.fillStyle = 'white';
  ctx.fillText('DMG', 208, 40);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(250, 34, 120, 12);
  ctx.fillStyle = 'orange';
  ctx.fillRect(250, 34, 120 * damage / 100, 12);

  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(leg.name + ' - ' + leg.goal, WIDTH / 2, 40, 500);
  ctx.textAlign = 'right';
  ctx.fillText(timer, WIDTH - 16, 16);
  ctx.fillText(`SCORE ${mission.score}`, WIDTH - 16, 40);

  if (mission.message) {
    ctx.font = '20px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'gold';
    ctx.fillText(mission.message, WIDTH / 2, 82, WIDTH - 32);
  }
  ctx.restore();
}

export function drawScreen(ctx, kind, state) {
  const { mission } = state;
  let title;
  let lines;

  switch (kind) {
    case 'title':
      title = 'CUMULUS COURIER';
      lines = [
        'Fly the sunset route: 6 rings, one supply drop, one landing.',
        'ArrowUp/Down throttle - ArrowLeft/Right pitch - SPACE drop - P pause - M mute',
        'Press ENTER to fly',
      ];
      break;
    case 'legdone':
      title = 'LEG COMPLETE';
      lines = [mission.message, 'Press ENTER to continue'];
      break;
    case 'crashed':
      title = 'CRASHED';
      lines = ['Score: ' + mission.score + ' - Press ENTER to retry'];
      break;
    case 'success':
      title = 'DELIVERY COMPLETE';
      lines = ['Score: ' + mission.score + ' - Rank: ' + rankTitle(mission.score) + ' - Press ENTER to fly again'];
      break;
    default:
      return;
  }

  ctx.save();
  ctx.fillStyle = 'rgba(10,5,30,0.72)';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'gold';
  ctx.font = 'bold 48px monospace';
  const lineHeight = 38;
  const titleY = HEIGHT / 2 - (76 + (lines.length - 1) * lineHeight) / 2;
  ctx.fillText(title, WIDTH / 2, titleY, WIDTH - 64);
  ctx.fillStyle = 'white';
  ctx.font = '20px monospace';
  lines.forEach((line, index) => {
    ctx.fillText(line, WIDTH / 2, titleY + 76 + index * lineHeight, WIDTH - 64);
  });
  ctx.restore();
}
