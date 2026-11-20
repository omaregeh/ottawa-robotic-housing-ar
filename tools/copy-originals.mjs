/** Restore only the reviewed originals for optional asset preparation. Never overwrites a copy. */
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const selections=JSON.parse(await fs.readFile('src/config/asset-selections.json'));
const inventory=JSON.parse(await fs.readFile('reports/inventory.json'));
const directory=process.env.ASSET_SOURCE_DIR||path.join(os.homedir(),'Downloads');
await fs.mkdir('public/models/original',{recursive:true});
for(const entry of selections){
 const row=inventory.find(r=>r.filename===entry.filename);assert.ok(row,'Missing audited source');
 const source=path.join(directory,entry.filename),destination=path.join('public/models/original',entry.filename);
 const sourceHash=crypto.createHash('sha256').update(await fs.readFile(source)).digest('hex');assert.equal(sourceHash,row.sha256,`Source differs from audit: ${entry.filename}`);
 try{await fs.copyFile(source,destination,fs.constants.COPYFILE_EXCL);}catch(error){if(error.code!=='EEXIST')throw error;}
 const copyHash=crypto.createHash('sha256').update(await fs.readFile(destination)).digest('hex');assert.equal(copyHash,row.sha256,`Existing original copy differs: ${entry.filename}`);
}
console.log(`Verified ${selections.length} reviewed original copies. No source changed.`);
