export const PHASES = [
 {start:0,end:9,name:'Materials arrive',detail:'The rover delivers materials to the work area.'},
 {start:9,end:18,name:'Prepare the site',detail:'The excavator makes a small positioning movement.'},
 {start:18,end:29,name:'Build the frame',detail:'The construction arm approaches as the frame rises into place.'},
 {start:29,end:39,name:'Assist assembly',detail:'The crane repositions with its integrated wall. No simulated joints.'},
 {start:39,end:49,name:'A home takes shape',detail:'The timber frame transitions to a completed modular home.'},
 {start:49,end:54,name:'Ready to build again',detail:'The site returns to the start of the demonstration.'}
];
export const clamp=(x)=>Math.min(1,Math.max(0,x));
export const smooth=(a,b,t)=>{const v=clamp((t-a)/(b-a));return v*v*(3-2*v);};
export function sampleTimeline(time,duration=54){
 const t=((time%duration)+duration)%duration;
 const reset=1-smooth(49,54,t);
 const finished=smooth(39,44,t)*reset;
 return {time:t,phase:PHASES.findIndex(p=>t>=p.start&&t<p.end),finished,frame:1-finished,
 rover: smooth(0,7,t)*reset,
 excavator: t>=9&&t<18?Math.sin(Math.PI*(t-9)/9):0,
 arm: smooth(18,24,t)*reset,
 frameRise: smooth(19,27,t),
 crane: t>=29&&t<39?Math.sin(Math.PI*(t-29)/10):0};
}
export class Timeline {
 constructor(duration=54){this.duration=duration;this.time=0;this.speed=1;this.playing=!globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}
 update(delta,allowed=true){if(this.playing&&allowed)this.time=(this.time+Math.min(delta,.1)*this.speed)%this.duration;return sampleTimeline(this.time,this.duration);}
 restart(){this.time=0;}
}
