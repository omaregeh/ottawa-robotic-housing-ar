/** Compile the exact print artwork with the installed MindAR browser compiler.
 * Isolated Chrome profile, local server only; no external image upload.
 */
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { decode } from '@msgpack/msgpack';

const server = await createServer({
  configFile: false, server: { host: '127.0.0.1', port: 5181, strictPort: true },
  plugins: [{ name: 'poster-compiler-page', configureServer(server) {
    server.middlewares.use('/compile-poster', (_req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.end('<!doctype html><title>Local poster compiler</title><p>Local MindAR compilation</p>');
    });
  } }]
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ executablePath: process.env.CHROME_BIN ?? '/usr/bin/google-chrome',
    headless: true, args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const page = await browser.newPage();
  page.on('pageerror', error => console.error(error.message));
  await page.exposeFunction('compileProgress', value => console.log(`MindAR: ${Math.round(value)}%`));
  await page.goto('http://127.0.0.1:5181/compile-poster');
  page.setDefaultTimeout(300000);
  const bytes = await page.evaluate(async () => {
    const { Compiler } = await import('/node_modules/mind-ar/dist/mindar-image.prod.js');
    const image = new Image(); image.src = '/targets/poster.png'; await image.decode();
    const compiler = new Compiler();
    await compiler.compileImageTargets([image], value => window.compileProgress(value));
    return Array.from(compiler.exportData());
  });
  const buffer = Buffer.from(bytes), compiled = decode(buffer);
  assert.equal(compiled.v, 2); assert.equal(compiled.dataList.length, 1);
  const metadata = JSON.parse(await fs.readFile('public/targets/poster.json'));
  assert.deepEqual(compiled.dataList[0].targetImage, { width: metadata.width, height: metadata.height });
  await fs.writeFile('public/targets/poster.mind', buffer);
  metadata.trackingSha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  metadata.matchingKeyframes = compiled.dataList[0].matchingData.length;
  metadata.trackingFeatureCounts = compiled.dataList[0].trackingData.map(frame => frame.points.length);
  await fs.writeFile('public/targets/poster.json', JSON.stringify(metadata, null, 2) + '\n');
  console.log(`Compiled poster.mind: ${buffer.length} bytes; ${metadata.matchingKeyframes} matching keyframes.`);
} finally { await browser?.close(); await server.close(); }
