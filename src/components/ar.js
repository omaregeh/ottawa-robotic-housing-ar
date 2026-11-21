import * as THREE from 'three';
import { decode } from '@msgpack/msgpack';
import { lights } from './scene.js';
export async function startAR({container,target,config,diorama,onTracking,onStatus,onFrame}){
 if(!isSecureContext)throw Error('Camera access requires HTTPS, or localhost on this device. Open the HTTPS deployment on your phone.');
 if(!navigator.mediaDevices?.getUserMedia)throw Error('This browser does not expose camera access. Try a current Safari or Chrome browser.');
 const response=await fetch(target);if(!response.ok||response.headers.get('content-type')?.includes('text/html'))throw Error('Target file missing. Add poster.mind, choose the sample target, or upload a compiled .mind file.');
 let compiled;try{compiled=decode(new Uint8Array(await response.arrayBuffer()));}catch{throw Error('This is not a valid compiled MindAR target. Use the official compiler to export a .mind file.');}
 if(compiled.v!==2||!Array.isArray(compiled.dataList)||!compiled.dataList[config.ar.targetIndex]?.targetImage?.width)throw Error('Target version or target index does not match MindAR 1.2.5. Recompile and check targetIndex.');
 const { MindARThree }=await import('mind-ar/dist/mindar-image-three.prod.js');
 const mind=new MindARThree({container,imageTargetSrc:target,maxTrack:1,uiLoading:'no',uiScanning:'no',uiError:'no',filterMinCF:.001,filterBeta:10,warmupTolerance:5,missTolerance:5});
 mind.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));mind.renderer.outputColorSpace=THREE.SRGBColorSpace;mind.renderer.toneMapping=THREE.ACESFilmicToneMapping;lights(mind.scene);
 const anchor=mind.addAnchor(config.ar.targetIndex);const orientation=new THREE.Group();orientation.rotation.fromArray(config.ar.rotation);orientation.scale.setScalar(config.ar.scale);orientation.position.fromArray(config.ar.position);anchor.group.add(orientation);orientation.add(diorama.root);
 // MindAR target plane is XY with +Z out of the paper. Keep scene +Y aligned
 // with poster +Y so the XZ ground projects out like a shelf. A slight yaw
 // reveals the sides; positive target Z brings the stage in front of the poster.
 let active=true,tracked=false;
 anchor.onTargetFound=()=>{tracked=true;onTracking(true);onStatus('Target found · construction site anchored');};
 anchor.onTargetLost=()=>{tracked=false;onTracking(false);onStatus('Tracking lost · point back at the printed image');};
 function stop(){active=false;mind.renderer.setAnimationLoop(null);try{mind.controller?.stopProcessVideo();}catch{}for(const track of mind.video?.srcObject?.getTracks?.()??[])track.stop();mind.video?.remove();mind.video=null;mind.renderer.dispose();mind.renderer.domElement.remove();mind.cssRenderer?.domElement.remove();orientation.remove(diorama.root);}
 try{onStatus('Requesting camera · allow access to continue');await mind.start();if(!active){stop();return;}onStatus('Camera ready · point at the selected printed image');mind.renderer.setAnimationLoop((ms)=>{onFrame(ms,tracked&&!document.hidden);mind.renderer.render(mind.scene,mind.camera);});return {mind,anchor,stop};}catch(error){stop();throw error instanceof Error?error:new Error('Camera access was denied or the camera is unavailable. Check this site’s camera permission, then retry.');}
}
