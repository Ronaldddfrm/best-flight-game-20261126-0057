import { CONFIG } from './config.js';
import { input } from './input.js';
import { createWorld } from './world.js';
import { createPlane, stepPlane } from './plane.js';
import { createParticles, spawnExhaust, spawnBurst, updateParticles, drawParticles } from './particles.js';
import { Sfx } from './audio.js';
import { LEGS, createMission, updateMission } from './missions.js';
import { drawScene } from './render.js';
import { drawHUD, drawScreen } from './hud.js';

const canvas = document.getElementById('game');
canvas.width = CONFIG.canvas.width;
canvas.height = CONFIG.canvas.height;
const ctx = canvas.getContext('2d');
input.init();

const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed')) || 1;

function makeState() {
  return {
    plane: createPlane(),
    world: createWorld(seed),
    mission: createMission(),
    particles: createParticles(),
    sfx: new Sfx(),
    status: 'title',
    camX: 0,
  };
}

let state = makeState();
let legDoneTimer = 0;
let previousTime = null;

switch (params.get('shot')) {
  case 'play':
    state.status = 'flying';
    Object.assign(state.plane, {
      x: 4200, y: 600, throttle: 0.8, speedKt: 120, onGround: false,
    });
    break;
  case 'landing':
    state.status = 'flying';
    state.mission.leg = 2;
    Object.assign(state.plane, {
      x: 11200, y: 400, speedKt: 90, throttle: 0.3, onGround: false,
    });
    break;
  case 'end':
    state.status = 'success';
    state.mission.score = 2350;
    state.mission.leg = 2;
    Object.assign(state.plane, { x: 11600, y: 0, onGround: true });
    break;
  case 'start':
  default:
    break;
}

function frame(time) {
  const dt = previousTime === null ? 0 : Math.max(0, Math.min(0.05, (time - previousTime) / 1000));
  previousTime = time;

  if (input.wasPressed('KeyM')) {
    state.sfx.setMuted(!state.sfx.muted);
  }
  if (input.wasPressed('KeyP')) {
    if (state.status === 'flying') state.status = 'paused';
    else if (state.status === 'paused') state.status = 'flying';
  }

  if (state.status === 'title' && input.wasPressed('Enter')) {
    state.status = 'flying';
  } else if ((state.status === 'crashed' || state.status === 'success') && input.wasPressed('Enter')) {
    state.sfx.engine(0);
    state = makeState();
    state.status = 'flying';
    legDoneTimer = 0;
  }

  if (state.status === 'flying') {
    const previousRingsHit = state.mission.ringsHit;
    const previousLeg = state.mission.leg;
    const unhitRings = state.world.rings.filter(ring => !ring.hit);

    stepPlane(state.plane, input, state.world, dt);
    updateMission(state.mission, state.plane, state.world, input, dt);
    if (state.plane.throttle > 0.2) {
      spawnExhaust(state.particles, state.plane.x, state.plane.y);
    }
    updateParticles(state.particles, dt);
    state.sfx.engine(state.plane.throttle);
    state.sfx.setMuted(state.sfx.muted);

    if (state.mission.ringsHit > previousRingsHit) {
      const lastHitRing = unhitRings.filter(ring => ring.hit).pop();
      if (lastHitRing) spawnBurst(state.particles, lastHitRing.x, lastHitRing.y);
      state.sfx.chime();
    }
    if (state.mission.leg > previousLeg && LEGS[state.mission.leg]) {
      state.status = 'legdone';
      legDoneTimer = 1.2;
    }
    if (state.mission.status === 'crashed') {
      state.sfx.crash();
      state.status = 'crashed';
    } else if (state.mission.status === 'success') {
      state.sfx.chime();
      state.status = 'success';
    }
  } else if (state.status === 'legdone') {
    legDoneTimer = Math.max(0, legDoneTimer - dt);
    if (legDoneTimer === 0) state.status = 'flying';
  }

  if (state.status !== 'flying') state.sfx.engine(0);
  state.camX = Math.max(0, state.plane.x - 400);
  // drawScene already draws particles using drawParticles from particles.js.
  drawScene(ctx, state, state.world, state.particles);

  if (state.status === 'flying' || state.status === 'paused') {
    drawHUD(ctx, state);
    if (state.status === 'paused') {
      ctx.save();
      ctx.font = 'bold 32px monospace';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PAUSED - press P to resume', canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
  } else {
    drawScreen(ctx, state.status, state);
  }

  input.endFrame();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
