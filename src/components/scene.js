import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { disposeObject,localURL } from './utils.js';

export function lights(scene){scene.add(new THREE.HemisphereLight(0xe5f6ff,0x7b8274,2.6));const key=new THREE.DirectionalLight(0xfff1d3,3.2);key.position.set(-3,6,4);scene.add(key);const fill=new THREE.DirectionalLight(0xbddfff,1.1);fill.position.set(4,3,-4);scene.add(fill);}
export function createLoader(){return new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);}
export function normalize(model,width,rotation=[0,0,0]){
 const oriented=new THREE.Group();oriented.add(model);model.rotation.fromArray(rotation);model.updateMatrixWorld(true);
 const box=new THREE.Box3().setFromObject(model);const size=box.getSize(new THREE.Vector3());const center=box.getCenter(new THREE.Vector3());
 const factor=width/Math.max(size.x,size.z);model.position.sub(new THREE.Vector3(center.x,box.min.y,center.z));oriented.scale.setScalar(factor);oriented.updateMatrixWorld(true);
 return {oriented,rawBox:box,size,factor};
}
export class Diorama {
 constructor(config,manifest,quality,onStatus){this.config=config;this.manifest=manifest;this.quality=quality;this.onStatus=onStatus;this.root=new THREE.Group();this.entries=new Map();this.loader=createLoader();this.errors=[];this.ray=new THREE.Raycaster();this.overrides={};this.pending=new Map();}
 async load(){await this.ensure('ground');for(const [key,c] of Object.entries(this.config.assets)){if(key!=='ground'&&c.visible)await this.ensure(key);}return this;}
 async ensure(key){
  if(this.entries.has(key))return this.entries.get(key);
  if(this.pending.has(key))return this.pending.get(key);
  const p=this.loadEntry(key);this.pending.set(key,p);try{return await p;}finally{this.pending.delete(key);}
 }
 async loadEntry(key){
  const c=this.config.assets[key];const asset=this.manifest.find(a=>a.id===c.asset);if(!asset){this.onStatus(`Asset not assigned: ${key}`);return null;}
  this.onStatus(`Loading ${asset.label}…`);
  try{
   const gltf=await this.loader.loadAsync(localURL(asset.quality[this.quality]));
   const pivot=new THREE.Group();pivot.name=key;const {oriented}=normalize(gltf.scene,c.width,c.rotation);pivot.add(oriented);this.root.add(pivot);
   const materials=[];gltf.scene.traverse(o=>{if(o.isMesh){o.frustumCulled=true;const list=Array.isArray(o.material)?o.material:[o.material];for(const m of list)materials.push({material:m,opacity:m.opacity,transparent:m.transparent,depthWrite:m.depthWrite});}});
   const e={key,pivot,oriented,model:gltf.scene,materials,clips:gltf.animations};this.entries.set(key,e);this.applyTransform(key);return e;
  }catch(err){this.errors.push(`${key}: ${err.message}`);this.onStatus(`Could not load ${asset.label}. Other assets remain usable.`);console.error(err);return null;}
 }
 applyTransform(key){const e=this.entries.get(key);if(!e)return;const c=this.config.assets[key];e.model.rotation.fromArray(c.rotation);e.model.position.set(0,0,0);e.model.updateMatrixWorld(true);
  // Compute the rotation-aware local bounds before applying the independent display scale.
  const box=new THREE.Box3();
  const parent=e.model.parent;e.model.removeFromParent();e.model.updateMatrixWorld(true);box.setFromObject(e.model,true);const s=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());parent.add(e.model);
  e.model.position.set(-center.x,-box.min.y,-center.z);e.oriented.scale.setScalar(c.width/Math.max(s.x,s.z)*c.scale);
  e.pivot.position.fromArray(c.position);e.pivot.position.y+=c.groundOffset;
  e.contact=null;e.pivot.updateMatrixWorld(true);if(key!=='ground')this.groundEntry(e);else for(const item of this.entries.values())item.contact=null;e.pivot.visible=c.visible;
 }
 surfaceAt(x,z){
  const ground=this.entries.get('ground');if(!ground)return 0;
  ground.pivot.updateMatrixWorld(true);this.ray.set(new THREE.Vector3(x,5,z),new THREE.Vector3(0,-1,0));const hits=this.ray.intersectObject(ground.pivot,true);
  for(const hit of hits){if(hit.face){const normal=hit.face.normal.clone().transformDirection(hit.object.matrixWorld);if(normal.y>.65)return hit.point.y;}}
  return null;
 }
 groundEntry(e){const c=this.config.assets[e.key];const {x,z}=e.pivot.position;if(!e.contact||Math.hypot(x-e.contact.x,z-e.contact.z)>.01)e.contact={x,z,y:this.surfaceAt(x,z)};const y=e.contact.y;e.offPlatform=y===null;e.pivot.position.y=(y??0)+c.position[1]+c.groundOffset;}
 async toggle(key,visible){this.config.assets[key].visible=visible;const e=visible?await this.ensure(key):this.entries.get(key);if(e)e.pivot.visible=visible;}
 setOpacity(e,opacity){const visible=opacity>.015;e.pivot.visible=this.config.assets[e.key].visible&&visible&&!e.offPlatform;for(const {material:m,opacity:base,transparent,depthWrite}of e.materials){const fading=opacity<.995;const nextTransparent=fading||transparent;if(m.transparent!==nextTransparent){m.transparent=nextTransparent;m.needsUpdate=true;}m.opacity=base*opacity;m.depthWrite=fading?false:depthWrite;}}
 renderState(s,{editing=false,showFinished=false}={}){
  for(const [key,e]of this.entries){const c=this.config.assets[key];e.pivot.visible=c.visible;if(key==='ground')continue;
   e.pivot.position.x=c.position[0];e.pivot.position.z=c.position[2];e.pivot.rotation.set(0,0,0);
   let opacity=1;
   if(!editing&&c.animation?.enabled){const a=c.animation.amplitude??1;
    if(key==='rover')e.pivot.position.z+=s.rover*.40*a;
    if(key==='arm')e.pivot.position.x+=s.arm*.15*a;
    if(key==='excavator')e.pivot.rotation.y=s.excavator*.06*a;
    if(key==='crane')e.pivot.rotation.y=-s.crane*.08*a;
    if(key==='finished')opacity=showFinished?1:s.finished;
    if(key==='frame')opacity=showFinished?0:s.frame;
   }
   if(!editing&&showFinished&&key==='frame')opacity=0;
   this.groundEntry(e);
   if(!editing&&key==='frame'&&s.time>=18&&s.time<29&&c.animation?.enabled)e.pivot.position.y+=Math.sin(Math.PI*(s.time-18)/11)**2*.07;
   this.setOpacity(e,opacity);
  }
 }
 diagnostics(){const result=[];for(const [k,e]of this.entries){if(k==='ground'||!this.config.assets[k].visible)continue;if(e.offPlatform)result.push(`${k} lies outside the platform surface and is hidden until corrected`);if(!e.pivot.visible)continue;const b=new THREE.Box3().setFromObject(e.pivot);for(const [k2,e2]of this.entries){if(k2<=k||k2==='ground'||!e2.pivot.visible||[k,k2].every(x=>['frame','finished'].includes(x)))continue;const other=new THREE.Box3().setFromObject(e2.pivot);if(b.intersectsBox(other))result.push(`${k} / ${k2}: bounds overlap; inspect visually`);}}return result;}
 dispose(){for(const e of this.entries.values())disposeObject(e.pivot);this.root.removeFromParent();this.entries.clear();}
}
