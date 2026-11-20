import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleTimeline,PHASES,Timeline } from '../src/animations/timeline.js';
test('six construction phases cover the 54 second loop without gaps',()=>{assert.equal(PHASES[0].start,0);assert.equal(PHASES.at(-1).end,54);PHASES.slice(1).forEach((p,i)=>assert.equal(p.start,PHASES[i].end));for(let t=0;t<54;t+=.1)assert.ok(sampleTimeline(t).phase>=0);});
test('completion fades in and all animated state resets continuously',()=>{const start=sampleTimeline(0),end=sampleTimeline(54-1e-5);assert.equal(sampleTimeline(46).finished,1);assert.equal(sampleTimeline(0).finished,0);for(const k of ['rover','arm','crane','excavator','finished','frame'])assert.ok(Math.abs(start[k]-end[k])<1e-5,k);assert.deepEqual(sampleTimeline(54),start);});
test('pause and tracking loss freeze construction; speed changes progress',()=>{const t=new Timeline();t.playing=true;t.speed=2;t.update(.05);assert.equal(t.time,.1);t.update(.05,false);assert.equal(t.time,.1);t.playing=false;t.update(.05);assert.equal(t.time,.1);t.restart();assert.equal(t.time,0);});
