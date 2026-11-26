export const CONFIG = {
  canvas: { width: 1280, height: 800 },
  world: { length: 12000, departure: { x: 0 }, destination: { x: 12000 } },
  scale: 0.09,
  speed: { stall: 55, cruise: 120, max: 180 },
  fuel: { initial: 100, burn: 0.045 },
  damage: { min: 0, max: 100 },
  ridgeRings: [3500, 4200, 4900, 5600, 6300, 7000],
  dropZone: { x: 8500, width: 300 },
  scoring: {
    ring: 100,
    dropMax: 500,
    landingMax: 1000,
    fuelBonusPerUnit: 10,
    timeBonusPerSecond: 1,
    timeLimit: 300
  },
  palette: {
    skyTop: '#2a1a4a',
    horizon: '#ff7e3d',
    sun: '#ffd27a',
    mountainFar: '#241a3d',
    mountainMid: '#3a2b5c',
    mountainNear: '#2f6b3a',
    field: '#2f6b3a',
    runway: '#3c3f4a'
  }
};
