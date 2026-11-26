export function mulberry32(seed) {
  let t = seed;
  return function() {
    t += 0x6D2B79F5;
    let s = t;
    s = (s ^ (s >>> 15)) * (s | 1);
    s ^= s + ((s ^ (s >>> 7)) * (s | 61));
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}
export function range(rng, min, max) {
  return min + (max - min) * rng();
}
export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}
export function hashNoise(x, seed) {
  const f = mulberry32(seed);
  let h = 0;
  for (let i = 0; i < 4; i++) {
    const freq = Math.pow(2, i);
    h += Math.sin(x * freq + f()) * Math.pow(0.5, i);
  }
  return Math.max(-1, Math.min(1, h));
}
