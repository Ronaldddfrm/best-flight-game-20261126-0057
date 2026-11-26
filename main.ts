import { copyFileSync, lstatSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const projectDirectory = fileURLToPath(new URL('.', import.meta.url));
const deliveryDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

function transferDirectory(source: string, destination: string): void {
  if (!lstatSync(source).isDirectory()) {
    throw new Error(`Expected a directory: ${source}`);
  }
  mkdirSync(destination, { recursive: true });
  for (const filename of readdirSync(source).sort()) {
    const origin = join(source, filename);
    const target = join(destination, filename);
    const entry = lstatSync(origin);
    if (entry.isDirectory()) {
      transferDirectory(origin, target);
    } else if (entry.isFile()) {
      copyFileSync(origin, target);
    } else {
      throw new Error(`Cannot package a link or special file: ${origin}`);
    }
  }
}

mkdirSync(deliveryDirectory, { recursive: true });
for (const folder of ['game', 'screenshots']) {
  transferDirectory(join(projectDirectory, folder), join(deliveryDirectory, folder));
}

const dossierBytes = buildDossier(deliveryDirectory, {
  game_path_max_bytes: 1000,
  game_max_bytes: 50331648,
  game_max_files: 993,
  screenshots: { max_bytes: 262144, max: 4 },
  text_max_bytes: 163840,
});
writeFileSync(join(deliveryDirectory, 'dossier.json'), dossierBytes);
