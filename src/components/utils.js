export function downloadJSON(name,value){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
export function validConfig(data){
 if(data?.version!==1||!data.assets||typeof data.assets!=='object')throw Error('Expected scene configuration version 1.');
 for(const [key,c] of Object.entries(data.assets)){
  if(!/^[a-z]+$/.test(key)||typeof c.asset!=='string')throw Error('Invalid asset entry.');
  for(const field of ['position','rotation'])if(!Array.isArray(c[field])||c[field].length!==3||!c[field].every(Number.isFinite))throw Error(`Invalid ${field} for ${key}`);
  if(!Number.isFinite(c.scale)||c.scale<=0||!Number.isFinite(c.width)||c.width<=0||!Number.isFinite(c.groundOffset)||typeof c.visible!=='boolean')throw Error(`Invalid dimensions for ${key}`);
 }
 if(data.duration!==54)throw Error('This timeline requires duration 54.');
 if(!data.ar||!Number.isInteger(data.ar.targetIndex)||!Number.isFinite(data.ar.scale)||data.ar.scale<=0)throw Error('Invalid AR configuration.');
 for(const field of ['position','rotation'])if(!Array.isArray(data.ar[field])||data.ar[field].length!==3||!data.ar[field].every(Number.isFinite))throw Error(`Invalid AR ${field}`);
 return data;
}
export function disposeObject(object){const textures=new Set();object.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material])){if(!m)continue;for(const v of Object.values(m))if(v?.isTexture)textures.add(v);m.dispose();}});for(const t of textures){t.dispose();t.source?.data?.close?.();}}
export const localURL=(path)=>`${import.meta.env.BASE_URL}${path}`;
export const escapeHTML=(s)=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
