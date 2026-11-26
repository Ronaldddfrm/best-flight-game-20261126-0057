import { CONFIG } from './config.js';
import { mulberry32, range, hashNoise } from './random.js';

export function createWorld(seed) {
  const rng = mulberry32(seed);
  const terrainHeight = (x) => {
    // Runway flat zones
    if (x < 400 || x > 11000) return 0;
    // Layered sine waves via hashNoise
    const height = 100 + 100 * hashNoise(x * 0.001 + seed, seed);
    return height;
  };

  const rings = CONFIG.ridgeRings.map((x, i) => ({
    x,
    y: 300 + 400 * ((hashNoise(x * 0.0005 + seed, seed) + 1) / 2),
    r: 120,
    hit: false,
  }));

  const runways = {
    departure: { x0: 0, x1: 800, y: 0 },
    destination: { x0: 11200, x1: 12000, y: 0 },
  };

  const storms = [4500, 7500, 10000].map((x) => ({
    x,
    y: 1500,
    r: 350,
  }));

  const dropZone = { x: 8500, width: 300 };

  return { seed, terrainHeight, rings, runways, storms, dropZone };
}

