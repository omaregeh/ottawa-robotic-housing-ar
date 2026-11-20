"""Blender-only working copies. UV-aware collapse decimation; originals never saved."""
import bpy,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
(ROOT/'.local/prepared').mkdir(parents=True,exist_ok=True)
rows=json.loads((ROOT/'reports/inventory.json').read_text());selections=json.loads((ROOT/'src/config/asset-selections.json').read_text());mapping={s['filename']:s['id']for s in selections}
assert len(rows)==len(selections) and all(r['filename']in mapping for r in rows), 'Candidate roster changed; review selections first.'
ids=[mapping[r['filename']]for r in rows]
for row,id in zip(rows,ids):
 if id=='ground' or id.startswith('finished'):continue
 bpy.ops.wm.read_factory_settings(use_empty=True);bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models/original'/row['filename']))
 meshes=[o for o in bpy.context.scene.objects if o.type=='MESH']
 for quality in ['lite']:
  target=(50000 if id=='ground' else 25000) if quality=='lite' else (100000 if id=='ground' else 50000)
  for o in meshes:
   for m in list(o.modifiers):o.modifiers.remove(m)
   dec=o.modifiers.new('Mobile working-copy reduction','DECIMATE');dec.ratio=min(1,target/row['triangles']);dec.use_collapse_triangulate=True
  out=ROOT/'.local/prepared'/f'{id}-{quality}.glb'
  bpy.ops.export_scene.gltf(filepath=str(out),export_format='GLB',export_apply=True,export_yup=True)
  print('PREPARED',id,quality,flush=True)
