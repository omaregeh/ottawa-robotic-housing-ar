"""Run with blender --background --python tools/render_assets.py. Does not write to Downloads."""
import bpy, json, math, sys
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
rows=json.loads((ROOT/'reports/inventory.json').read_text())
folder='thumbnails'
if '--optimized' in sys.argv:
 rows=[{'path':str(ROOT/'.local/render'/f"{a['id']}.glb"),'filename':a['label']}for a in json.loads((ROOT/'public/models/manifest.json').read_text())];folder='optimized-thumbnails'
(ROOT/'reports'/folder).mkdir(exist_ok=True)
for idx,row in enumerate(rows):
 out=ROOT/'reports'/folder/f'{idx:02}.png'
 if out.exists():continue
 bpy.ops.wm.read_factory_settings(use_empty=True)
 bpy.ops.import_scene.gltf(filepath=row.get('path', str(ROOT/'public/models/original'/row['filename'])))
 objs=[o for o in bpy.context.scene.objects if o.type=='MESH']
 coords=[o.matrix_world@Vector(v) for o in objs for v in o.bound_box]
 lo=Vector(tuple(min(v[i] for v in coords) for i in range(3)));hi=Vector(tuple(max(v[i] for v in coords) for i in range(3)));c=(lo+hi)/2;r=max(hi-lo)
 bpy.ops.object.camera_add(location=c+Vector((1.6,-2.2,1.45))*r);cam=bpy.context.object;cam.rotation_euler=(c-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=r*1.75;bpy.context.scene.camera=cam
 scene=bpy.context.scene;scene.render.engine='BLENDER_WORKBENCH';scene.display.shading.light='STUDIO';scene.display.shading.color_type='TEXTURE';scene.display.shading.show_shadows=True;scene.display.shading.show_cavity=True;scene.display.shading.background_type='WORLD';scene.world=bpy.data.worlds.new('World');scene.world.color=(.15,.18,.22)
 scene.render.resolution_x=640;scene.render.resolution_y=480;scene.render.resolution_percentage=100;scene.render.image_settings.file_format='PNG';scene.render.filepath=str(out)
 bpy.ops.render.render(write_still=True)
 print('THUMBNAIL',idx,row['filename'],flush=True)

# Inspection thumbnails are publication artifacts; omit local render metadata.
if folder=='thumbnails':
 import runpy
 runpy.run_path(str(ROOT/'tools/sanitize-thumbnails.py'),run_name='__main__')
