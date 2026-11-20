#!/usr/bin/env python3
"""Read-only GLB audit. Adjacent days included, all timestamps America/Toronto."""
import os, json, struct, datetime, io, subprocess, hashlib
from pathlib import Path
from zoneinfo import ZoneInfo
import numpy as np
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
ZONE=ZoneInfo('America/Toronto')
def stamp(t): return datetime.datetime.fromtimestamp(t,ZONE).isoformat()
def inspect(p):
 b=p.read_bytes(); magic,version,length=struct.unpack_from('<III',b);assert magic==0x46546c67 and length==len(b)
 off=12;g=None;binary=b''
 while off<len(b):
  size,kind=struct.unpack_from('<II',b,off);off+=8;data=b[off:off+size];off+=size
  if kind==0x4e4f534a:g=json.loads(data)
  elif kind==0x004e4942:binary=data
 s=p.stat();birth=subprocess.run(['stat','-c','%W',str(p)],capture_output=True,text=True).stdout.strip()
 def accessor(i):
  a=g['accessors'][i];v=g['bufferViews'][a['bufferView']];typ={5126:'<f4',5125:'<u4',5123:'<u2',5121:'u1',5122:'<i2',5120:'i1'}[a['componentType']];n={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}[a['type']];dt=np.dtype(typ)
  return np.ndarray((a['count'],n),dt,buffer=binary,offset=v.get('byteOffset',0)+a.get('byteOffset',0),strides=(v.get('byteStride',dt.itemsize*n),dt.itemsize))
 meshes=g.get('meshes',[]);tri=0;primitives=0;verts=0;points=[]
 for m in meshes:
  for prim in m['primitives']:
   primitives+=1;pos=accessor(prim['attributes']['POSITION']);verts+=len(pos)
   n=g['accessors'][prim['indices']]['count'] if 'indices'in prim else len(pos)
   mode=prim.get('mode',4);tri+=n//3 if mode==4 else max(0,n-2) if mode in (5,6) else 0
 def mat(n):
  if 'matrix'in n:return np.array(n['matrix']).reshape(4,4).T
  x,y,z,w=n.get('rotation',[0,0,0,1]);rot=np.array([[1-2*y*y-2*z*z,2*x*y-2*z*w,2*x*z+2*y*w],[2*x*y+2*z*w,1-2*x*x-2*z*z,2*y*z-2*x*w],[2*x*z-2*y*w,2*y*z+2*x*w,1-2*x*x-2*y*y]])
  a=np.eye(4);a[:3,:3]=rot @ np.diag(n.get('scale',[1,1,1]));a[:3,3]=n.get('translation',[0,0,0]);return a
 def walk(i,parent):
  n=g['nodes'][i];a=parent@mat(n)
  if 'mesh'in n:
   for prim in meshes[n['mesh']]['primitives']:
    ps=accessor(prim['attributes']['POSITION']);points.append(ps@a[:3,:3].T+a[:3,3])
  for c in n.get('children',[]):walk(c,a)
 for i in g.get('scenes',[{'nodes':[]}])[g.get('scene',0)]['nodes']:walk(i,np.eye(4))
 ps=np.concatenate(points);lo=ps.min(axis=0);hi=ps.max(axis=0);center=(hi+lo)/2;dims=hi-lo
 images=[]
 for im in g.get('images',[]):
  if 'bufferView'in im:
   v=g['bufferViews'][im['bufferView']];imdata=binary[v.get('byteOffset',0):v.get('byteOffset',0)+v['byteLength']];img=Image.open(io.BytesIO(imdata));images.append({'size':list(img.size),'format':img.format,'bytes':len(imdata)})
 return {'filename':p.name,'modified':stamp(s.st_mtime),'creation':stamp(int(birth)) if birth and int(birth)>0 else None,'bytes':s.st_size,'sha256':hashlib.sha256(b).hexdigest(),'meshes':len(meshes),'meshNodes':sum('mesh'in n for n in g.get('nodes',[])),'primitives':primitives,'vertices':verts,'triangles':tri,'animations':[{'name':a.get('name','unnamed'),'channels':len(a.get('channels',[]))}for a in g.get('animations',[])],'skins':len(g.get('skins',[])),'bounds':{'min':lo.tolist(),'max':hi.tolist(),'dimensions':dims.tolist(),'center':center.tolist()},'centered':bool(np.linalg.norm(center)<max(dims)*.02),'groundAtY0':bool(abs(lo[1])<max(dims)*.01),'textures':images,'materials':g.get('materials',[]),'nodeNames':[n.get('name','unnamed') for n in g.get('nodes',[])],'independentMovement':'No validated articulation; inspect mesh nodes before moving components.','warnings':(['High polygon count'] if tri>150000 else [])+(['Large file'] if s.st_size>15000000 else [])}
if __name__=='__main__':
 files=[];scanned=0
 for p in Path(os.environ.get('ASSET_SOURCE_DIR', str(Path.home()/'Downloads'))).rglob('*.glb'):
  scanned+=1
  dt=datetime.datetime.fromtimestamp(p.stat().st_mtime,ZONE).date()
  birth=int(subprocess.run(['stat','-c','%W',str(p)],capture_output=True,text=True).stdout.strip()or 0)
  dates=[dt]+([datetime.datetime.fromtimestamp(birth,ZONE).date()]if birth>0 else [])
  if any(datetime.date(2026,11,18)<=d<=datetime.date(2026,11,21)for d in dates):files.append(p)
 results=[inspect(p) for p in sorted(files,key=lambda p:p.stat().st_mtime)]
 (ROOT/'reports/scan-summary.json').write_text(json.dumps({'timezone':'America/Toronto','window':['2026-11-18','2026-11-21'],'selection':'creation OR modification date','totalGLBsScanned':scanned,'candidates':len(results)},indent=2))
 (ROOT/'reports/inventory.json').write_text(json.dumps(results,indent=2))
 for r in results:print(r['filename'],r['triangles'],r['meshes'],r['bounds']['dimensions'],r['textures'])
