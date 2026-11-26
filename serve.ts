import { createServer } from 'node:http';
import { promises as files } from 'node:fs';

const argumentsList = process.argv.slice(2);
const portPosition = argumentsList.indexOf('--port');
const inlinePort = argumentsList.find((argument) => argument.startsWith('--port='));
const portSetting = portPosition >= 0
  ? argumentsList[portPosition + 1]
  : inlinePort?.slice('--port='.length) ?? process.env.PORT ?? '8080';
const portNumber = Number(portSetting);
if (!portSetting || !Number.isInteger(portNumber) || portNumber < 1 || portNumber > 65535) {
  throw new Error('Choose a port between 1 and 65535.');
}

const documentRoot = new URL('./game/', import.meta.url);
const mediaTypes: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  jpg: 'image/jpeg',
  png: 'image/png',
  json: 'application/json; charset=utf-8',
};

const server = createServer(async (request, response) => {
  try {
    const requestPath = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    const segments = requestPath.split('/').filter(Boolean);
    if (segments.some((segment) => segment === '..' || segment.includes('\\') || segment.includes('\0'))) {
      response.writeHead(404).end('Not found');
      return;
    }
    if (requestPath.endsWith('/')) segments.push('index.html');
    const resource = new URL(segments.map(encodeURIComponent).join('/'), documentRoot);
    const metadata = await files.stat(resource);
    if (!metadata.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    const contents = await files.readFile(resource);
    const suffix = segments.at(-1)?.split('.').at(-1)?.toLowerCase() ?? '';
    response.writeHead(200, {
      'Content-Type': mediaTypes[suffix] ?? 'application/octet-stream',
      'Content-Length': contents.byteLength,
    });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(portNumber, '0.0.0.0', () => {
  console.log(`Game available at http://localhost:${portNumber}`);
});
