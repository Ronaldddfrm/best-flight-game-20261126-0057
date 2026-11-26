export const LEGS = [
  { name: 'RIDGE RINGS', goal: 'Fly through all 6 glowing rings' },
  { name: 'SUPPLY DROP', goal: 'Press SPACE over the marked drop zone' },
  { name: 'FINAL APPROACH', goal: 'Land gently on the destination runway' },
];

export function createMission() {
  return {
    leg: 0,
    ringsHit: 0,
    dropDone: false,
    dropErrorM: 0,
    score: 0,
    status: 'flying',
    message: '',
    time: 0,
    landed: false,
  };
}

export function updateMission(m, plane, world, input, dt) {
  m.time += dt;
  // ring hit logic for leg 0
  if (m.leg === 0) {
    // assume world.rings is array of {x, y, radius}
    for (let i = 0; i < world.rings.length; i++) {
      const ring = world.rings[i];
      const dx = plane.x - ring.x;
      const dy = plane.y - ring.y;
      const dist = Math.hypot(dx, dy);
      if (!ring.hit && Math.abs(plane.x - ring.x) < 150 && Math.abs(plane.y - ring.y) < ring.r) {
        ring.hit = true;
        m.ringsHit++;
        m.score += 100;
        m.message = 'Ring! +100';
      }
    }
    if (m.ringsHit === 6) {
      m.leg = 1;
    }
  }
  // supply drop logic for leg 1
  if (m.leg === 1) {
    if (input.wasPressed('Space')) {
      const dropXMin = 8500;
      const dropXMax = 8800;
      if (plane.x >= dropXMin && plane.x <= dropXMax) {
        m.dropDone = true;
        const centerX = (dropXMin + dropXMax) / 2;
        m.dropErrorM = Math.abs(plane.x - centerX);
        const bonus = Math.max(0, 500 - m.dropErrorM);
        m.score += bonus;
        m.message = `Drop! +${bonus}`;
        m.leg = 2;
      }
    }
  }
  // final approach logic for leg 2
  if (m.leg === 2) {
    if (plane.onGround && plane.x > 11200) {
      m.landed = true;
      const landingBonus = Math.max(
        0,
        1000 - plane.damage * 5 - (plane.speedKt > 90 ? 300 : 0),
      );
      const fuelBonus = plane.fuel * 10;
      const timeBonus = Math.max(0, 300 - m.time);
      m.score += landingBonus + fuelBonus + timeBonus;
      m.status = 'success';
      m.message = 'Landed!';
    }
  }
  // crash conditions
  if (plane.damage >= 100) {
    m.status = 'crashed';
  }
  if (plane.fuel <= 0 && plane.speedKt < 10 && !plane.onGround) {
    m.status = 'crashed';
  }
}

export function rankTitle(score) {
  if (score > 2500) return 'ACE COURIER';
  if (score > 1800) return 'SKY CAPTAIN';
  if (score > 900) return 'ROOKIE PILOT';
  return 'TRAINEE';
}

