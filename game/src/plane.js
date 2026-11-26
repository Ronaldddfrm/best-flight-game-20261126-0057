import { CONFIG } from './config.js';

export function createPlane() {
  return {
    x: 400,
    y: 0,
    vx: 0,
    vy: 0,
    speedKt: 0,
    throttle: 0,
    pitch: 0,
    fuel: 100,
    damage: 0,
    heading: 90,
    onGround: true
  };
}

export function stepPlane(plane, input, world, dt) {
  // throttle control
  if (input.isDown('ArrowUp')) {
    plane.throttle = Math.min(plane.throttle + 0.5 * dt, 1);
  }
  if (input.isDown('ArrowDown')) {
    plane.throttle = Math.max(plane.throttle - 0.5 * dt, 0);
  }
  // pitch control
  if (input.isDown('ArrowLeft')) {
    plane.pitch = Math.max(plane.pitch - 0.5 * dt, -0.5);
  }
  if (input.isDown('ArrowRight')) {
    plane.pitch = Math.min(plane.pitch + 0.5 * dt, 0.5);
  }
  // throttle zero if out of fuel
  if (plane.fuel <= 0) {
    plane.throttle = 0;
  }
  // fuel consumption
  plane.fuel -= plane.throttle * 0.045 * dt;
  if (plane.fuel < 0) plane.fuel = 0;
  // speed towards target
  const targetSpeed = plane.throttle * 180;
  const drag = 0.1 * dt;
  if (plane.speedKt < targetSpeed) {
    plane.speedKt = Math.min(plane.speedKt + (targetSpeed - plane.speedKt) * drag, targetSpeed);
  } else {
    plane.speedKt = Math.max(plane.speedKt - (plane.speedKt - targetSpeed) * drag, targetSpeed);
  }
  // position update
  const groundHeight = world.terrainHeight(plane.x);
  plane.x += plane.speedKt * 0.514 * dt * 2.5;
  plane.y += plane.pitch * plane.speedKt * 1.2 * dt;
  // stall handling
  if (plane.speedKt < 55 && !plane.onGround) {
    plane.vy = plane.vy - 30 * dt;
    plane.y -= 40 * dt;
    plane.damage += 1 * dt; // simple risk
  }
  // ground collision
  const wasAirborne = !plane.onGround;
  if (plane.y <= groundHeight) {
    if (wasAirborne && plane.speedKt > 140) {
      plane.damage += 20;
    }
    plane.y = groundHeight;
    plane.onGround = true;
  } else {
    plane.onGround = false;
  }
  // takeoff
  if (plane.onGround && plane.speedKt > 60 && plane.pitch > 0) {
    plane.onGround = false;
  }
}

export function drawPlane(ctx, plane, camX) {
  const scale = CONFIG.scale;
  const screenX = (plane.x - camX) * scale;
  const screenY = 800 - plane.y * 0.12;
  ctx.save();
  ctx.translate(screenX, screenY);
  ctx.rotate(-plane.pitch);
  // fuselage
  ctx.fillStyle = '#FF8C00';
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // wings
  ctx.fillStyle = '#FFEFD5';
  ctx.beginPath();
  ctx.moveTo(-15, 0);
  ctx.lineTo(15, 0);
  ctx.lineTo(10, -5);
  ctx.lineTo(-10, -5);
  ctx.closePath();
  ctx.fill();
  // tail
  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(5, -12);
  ctx.lineTo(-5, -12);
  ctx.closePath();
  ctx.fill();
  // propeller
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(25, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  // window
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(-5, -2, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

