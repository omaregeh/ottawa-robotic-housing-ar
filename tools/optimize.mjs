import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, textureCompress, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
await Promise.all([MeshoptEncoder.ready,MeshoptDecoder.ready,MeshoptSimplifier.ready]);
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder,'meshopt.decoder':MeshoptDecoder});
const inventory=JSON.parse(await fs.readFile('reports/inventory.json'));
const selections=JSON.parse(await fs.readFile('src/config/asset-selections.json'));
if(inventory.length!==selections.length||inventory.some(r=>!selections.some(s=>s.filename===r.filename)))throw Error('Candidate roster changed. Review thumbnails and update asset-selections.json before preparing assets.');
const manifest=[];const report=[];
for(let i=0;i<inventory.length;i++){
 const row=inventory[i];const selection=selections.find(s=>s.filename===row.filename);const id=selection.id;const original=`models/original/${row.filename}`;
 await fs.copyFile(path.join(process.env.ASSET_SOURCE_DIR || path.join(os.homedir(), 'Downloads'), row.filename),`public/${original}`,fs.constants.COPYFILE_EXCL).catch(e=>{if(e.code!=='EEXIST')throw e;});
 const entry={id,label:selection.label,filename:row.filename,original,thumbnail:`reports/thumbnails/${String(i).padStart(2,'0')}.png`,quality:{}};
 for(const quality of ['lite','standard']){
  const output=`models/optimized/${id}-${quality}.glb`;
  const target=quality==='lite'?(id==='ground'?50000:25000):(id==='ground'?100000:50000);
  const textureSize=quality==='lite'?(id==='ground'||id.startsWith('finished')?1024:512):(id==='ground'?2048:1024);
  const prepared=`.local/prepared/${id}-${quality}.glb`;
  const source=(id==='ground'||id.startsWith('finished')||quality==='standard')?`public/${original}`:await fs.access(prepared).then(()=>prepared).catch(()=>`public/${original}`);
  const doc=await io.read(source);
  await doc.transform(dedup(),weld(),simplify({simplifier:MeshoptSimplifier,ratio:Math.min(1,target/row.triangles),error:.005}),prune(),textureCompress({encoder:sharp,targetFormat:'webp',resize:[textureSize,textureSize],quality:quality==='lite'?75:85}),meshopt({encoder:MeshoptEncoder,level:'medium'}));
  await io.write(`public/${output}`,doc);
  const bytes=(await fs.stat(`public/${output}`)).size;
  let triangles=0;for(const m of doc.getRoot().listMeshes())for(const p of m.listPrimitives())triangles+=(p.getIndices()?.getCount()??p.getAttribute('POSITION').getCount())/3;
  entry.quality[quality]=output;report.push({id,quality,preparation:source===prepared?'Blender UV-aware collapse decimation + meshopt':'Meshopt simplification only',originalBytes:row.bytes,optimizedBytes:bytes,originalTriangles:row.triangles,triangles:Math.round(triangles),textureLimit:textureSize});
  console.log(`${id} ${quality}: ${Math.round(triangles)} triangles, ${(bytes/1048576).toFixed(2)} MiB`);
 }
 manifest.push(entry);
 await fs.writeFile('reports/optimization.json',JSON.stringify(report,null,2));
}
await fs.writeFile('public/models/manifest.json',JSON.stringify(manifest,null,2));

const checksums={};for(const entry of manifest)for(const file of Object.values(entry.quality))checksums[file]=crypto.createHash('sha256').update(await fs.readFile(`public/${file}`)).digest('hex');
for(const file of ['targets/development.mind','targets/development.png'])checksums[file]=crypto.createHash('sha256').update(await fs.readFile(`public/${file}`)).digest('hex');
await fs.writeFile('public/models/checksums.json',JSON.stringify(checksums,null,2)+'\n');
