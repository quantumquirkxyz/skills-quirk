import {mkdir,rm,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join,resolve} from 'node:path';

// Local-host, cross-process coordination using atomic directory creation.
// Never reclaim a stale lock automatically: without fencing, doing so could
// allow a paused former holder to publish after its lease was stolen.
export function createFilesystemPublicationCoordinator({directory,waitMs=5000,pollMs=50}={}) {
  if (typeof directory!=='string' || !directory.trim()) throw new Error('Lock directory required');
  if (!Number.isSafeInteger(waitMs)||waitMs<0||!Number.isSafeInteger(pollMs)||pollMs<1) throw new Error('Invalid lock timing');
  const root=resolve(directory);
  return {
    async withLock(target,key,fn) {
      if (typeof target!=='string'||!target||typeof key!=='string'||!key||typeof fn!=='function') throw new Error('Invalid lock request');
      await mkdir(root,{recursive:true});
      const hash=createHash('sha256').update(JSON.stringify([target,key])).digest('hex');
      const lock=join(root,hash+'.lock');
      const deadline=Date.now()+waitMs;
      while(true) {
        try { await mkdir(lock); break; }
        catch(error) {
          if(error?.code!=='EEXIST') throw error;
          if(Date.now()>=deadline) throw new Error('Publication lock unavailable; refusing unsafe write');
          await new Promise(done=>setTimeout(done,Math.min(pollMs,Math.max(1,deadline-Date.now()))));
        }
      }
      try {return await fn();}
      finally {
        // Failure to release must surface to the caller, rather than allow a
        // later writer to assume the operation was safely completed.
        await rm(lock,{recursive:false});
      }
    },
  };
}
