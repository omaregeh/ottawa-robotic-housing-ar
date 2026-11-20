import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { validConfig } from '../src/components/utils.js';

const config = validConfig(JSON.parse(await fs.readFile('src/config/scene.json')));
const manifest = JSON.parse(await fs.readFile('public/models/manifest.json'));
const inventory = JSON.parse(await fs.readFile('reports/inventory.json'));
const checksums = JSON.parse(await fs.readFile('public/models/checksums.json'));
const requireOriginals = process.argv.includes('--require-originals');
const sourceDir = process.env.ASSET_SOURCE_DIR || path.join(os.homedir(), 'Downloads');
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
await MeshoptDecoder.ready;
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
let sourceHashesVerified = 0;
let originalCopyHashesVerified = 0;
for (const row of inventory) {
  for (const [kind, file] of [['source', path.join(sourceDir, row.filename)], ['copy', `public/models/original/${row.filename}`]]) {
    let buffer;
    try { buffer = await fs.readFile(file); }
    catch (error) { if (error.code === 'ENOENT' && !requireOriginals) continue; throw error; }
    assert.equal(hash(buffer), row.sha256, `Original content changed: ${row.filename}`);
    if (kind === 'source') sourceHashesVerified++; else originalCopyHashesVerified++;
  }
}
let totalTriangles = 0, totalBytes = 0;
for (const entry of manifest) {
  assert.ok(!/Robotic Lift Handling/i.test(entry.filename));
  for (const [quality, file] of Object.entries(entry.quality)) {
    const bytes = await fs.readFile(`public/${file}`);
    assert.equal(hash(bytes), checksums[file], `Runtime checksum mismatch: ${file}`);
    const document = await io.read(`public/${file}`);
    assert.ok(document.getRoot().listMeshes().length > 0);
    let count = 0;
    for (const mesh of document.getRoot().listMeshes()) for (const primitive of mesh.listPrimitives()) {
      const positions = primitive.getAttribute('POSITION');
      assert.ok(positions.getCount() > 0);
      assert.ok(positions.getArray().every(Number.isFinite));
      count += (primitive.getIndices()?.getCount() ?? positions.getCount()) / 3;
    }
    if (quality === 'lite' && Object.values(config.assets).some(c => c.visible && c.asset === entry.id)) {
      totalTriangles += count; totalBytes += bytes.length;
    }
  }
}
for (const [file, expected] of Object.entries(checksums)) assert.equal(hash(await fs.readFile(`public/${file}`)), expected, file);
for (const [key, c] of Object.entries(config.assets)) assert.ok(manifest.some(a => a.id === c.asset), key);
assert.ok((await fs.stat('public/targets/development.mind')).size > 10000);
const result = { sourceHashesVerified, originalCopyHashesVerified, optimizedModelsValidated: manifest.length * 2, defaultLoadedTriangles: Math.round(totalTriangles), defaultTransferMiB: totalBytes / 1048576 };
await fs.writeFile('reports/validation.json', JSON.stringify(result, null, 2));
console.log(result);
