import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createFilesystemPublicationCoordinator} from '../scripts/filesystem-publication-coordinator.mjs';

test('separate coordinator instances serialize one publication key',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'quirk-lock-'));
  try {
    const a=createFilesystemPublicationCoordinator({directory});
    const b=createFilesystemPublicationCoordinator({directory});
    let active=0,maxActive=0;
    const run=async(coordinator)=>coordinator.withLock('pr:8','key',async()=>{
      active++;maxActive=Math.max(active,maxActive);
      await new Promise(done=>setTimeout(done,25));
      active--;
    });
    await Promise.all([run(a),run(b)]);
    assert.equal(maxActive,1);
  } finally {await rm(directory,{recursive:true,force:true});}
});
test('times out safely while another holder owns the lock',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'quirk-lock-'));
  try {
    const a=createFilesystemPublicationCoordinator({directory});
    const b=createFilesystemPublicationCoordinator({directory,waitMs:0});
    let release;
    const blocked=new Promise(done=>{release=done;});
    let entered;
    const acquired=new Promise(done=>{entered=done;});
    const holder=a.withLock('pr:8','key',async()=>{entered();await blocked;});
    await acquired;
    await assert.rejects(b.withLock('pr:8','key',async()=>{}),/lock unavailable/);
    release();
    await holder;
    await b.withLock('pr:8','key',async()=>{});
  } finally {await rm(directory,{recursive:true,force:true});}
});
test('releases lock when critical section fails',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'quirk-lock-'));
  try {
    const coordinator=createFilesystemPublicationCoordinator({directory});
    await assert.rejects(coordinator.withLock('issue:3','key',async()=>{throw new Error('write failed');}),/write failed/);
    assert.equal(await coordinator.withLock('issue:3','key',async()=>42),42);
  } finally {await rm(directory,{recursive:true,force:true});}
});
