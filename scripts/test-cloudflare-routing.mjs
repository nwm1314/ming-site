import { execFileSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const host = '127.0.0.1';
const port = 4323;
const baseUrl = `http://${host}:${port}`;
const routes = [
  { path: '/', expectedStatus: 200 },
  { path: '/blog', expectedStatus: 200 },
  { path: '/blog/static-first', expectedStatus: 200 },
  { path: '/search', expectedStatus: 200 },
  { path: '/rss.xml', expectedStatus: 200 },
  { path: '/robots.txt', expectedStatus: 200 },
  { path: '/admin', expectedStatus: 200, admin: true },
  { path: '/admin/config.yml', expectedStatus: 200 },
  { path: '/404', expectedStatus: [200, 404] },
  { path: '/random-nonexistent-path', expectedStatus: 404, custom404: true },
];

if (!existsSync('dist/404.html')) {
  throw new Error(
    'dist/404.html is missing. Run `pnpm build` before `pnpm test:cf`.',
  );
}

const command = process.platform === 'win32' ? 'cmd.exe' : 'pnpm';
const commandArgs =
  process.platform === 'win32'
    ? [
        '/d',
        '/s',
        '/c',
        `pnpm exec wrangler dev --local --ip ${host} --port ${port}`,
      ]
    : [
        'exec',
        'wrangler',
        'dev',
        '--local',
        '--ip',
        host,
        '--port',
        String(port),
      ];
const server = spawn(command, commandArgs, {
  env: { ...process.env, NO_COLOR: '1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let output = '';
server.stdout.on('data', (chunk) => {
  output += chunk.toString();
});
server.stderr.on('data', (chunk) => {
  output += chunk.toString();
});

const stop = () => {
  if (server.killed || server.exitCode !== null) return;

  if (process.platform === 'win32') {
    try {
      execFileSync('taskkill', ['/pid', String(server.pid), '/t', '/f'], {
        stdio: 'ignore',
      });
    } catch {
      server.kill();
    }
    return;
  }

  server.kill();
};
process.once('SIGINT', stop);
process.once('SIGTERM', stop);

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      await fetch(baseUrl);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  throw new Error(`Wrangler dev did not start within 30 seconds.\n${output}`);
}

try {
  await waitForServer();

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route.path}`);
    const allowedStatuses = Array.isArray(route.expectedStatus)
      ? route.expectedStatus
      : [route.expectedStatus];

    if (!allowedStatuses.includes(response.status)) {
      throw new Error(
        `${route.path}: expected ${allowedStatuses.join(' or ')}, received ${response.status}`,
      );
    }

    if (route.custom404) {
      const body = await response.text();
      if (!body.includes('这页走丢了')) {
        throw new Error(
          `${route.path}: response did not contain the custom 404 marker`,
        );
      }
    }

    if (route.admin) {
      const body = await response.text();
      if (!body.includes('<meta name="robots" content="noindex, nofollow"')) {
        throw new Error(`${route.path}: response did not contain the admin noindex marker`);
      }
    }

    console.log(`${route.path} -> ${response.status}`);
  }

  console.log('Cloudflare Static Assets routing smoke passed.');
} finally {
  stop();
}
