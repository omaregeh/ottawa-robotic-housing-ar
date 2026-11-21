/** Ensure the print image, PDF, and compiled target are a complete matching set. */
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { decode } from '@msgpack/msgpack';
import sharp from 'sharp';
const metadata = JSON.parse(await fs.readFile('public/targets/poster.json'));
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
for (const [path, checksum] of [[metadata.image, metadata.imageSha256], [metadata.pdf, metadata.pdfSha256], [metadata.trackingTarget, metadata.trackingSha256]]) {
  assert.equal(hash(await fs.readFile(`public/${path}`)), checksum, `Poster asset changed without updating its matching set: ${path}`);
}
assert.equal(metadata.sourceSha256, metadata.imageSha256, 'Preserve the recovered original artwork');
const image = await sharp(`public/${metadata.image}`).metadata();
assert.equal(image.width, metadata.width); assert.equal(image.height, metadata.height);
const compiled = decode(await fs.readFile(`public/${metadata.trackingTarget}`));
assert.equal(compiled.v, 2); assert.equal(compiled.dataList.length, 1);
assert.deepEqual(compiled.dataList[0].targetImage, {width: image.width, height: image.height});
assert.ok(compiled.dataList[0].matchingData.length > 0);
assert.ok(compiled.dataList[0].trackingData.every(frame => frame.points.length > 0));
const scene = JSON.parse(await fs.readFile('src/config/scene.json'));
assert.equal(scene.ar.targetUrl, metadata.trackingTarget); assert.equal(scene.ar.targetIndex, metadata.targetIndex);
assert.equal(metadata.qrURL, 'https://omaregeh.github.io/ottawa-robotic-housing-ar/');
console.log('Poster image/PDF/target checksums, target features, dimensions, and scene mapping passed.');
