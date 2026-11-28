// Read-only presentation bridge for the eight prioritized workflow skills.
// This is deliberately not a side-effect executor: create-issue, create-PR,
// merge, code edits, and project updates remain owned by canonical skills.
import {renderLifecycleArtifact} from './render-lifecycle-artifact.mjs';

const pilots=Object.freeze({
  'to-spec':{category:'project',surfaces:['issue','file','json']},
  'to-tickets':{category:'project',surfaces:['issue','file','json']},
  'review-pr':{category:'delivery',surfaces:['pr','comment','file','json']},
  'plan-review-fixes':{category:'delivery',surfaces:['pr','comment','file','json']},
  'implement-review-fixes':{category:'delivery',surfaces:['pr','file','json']},
  'publish-open-pr':{category:'routing',surfaces:['pr','file','json']},
  'ship-subissue':{category:'routing',surfaces:['pr','file','json']},
  'github-project-analysis':{category:'research',surfaces:['file','json']},
});
export function listOutputPilots() {
  return Object.entries(pilots).map(([name,config])=>({name,...config}));
}
export function presentPilotArtifact(skill,artifact,{title,summary,surface='file',validation=[],nextActions=[]}={}) {
  const pilot=pilots[skill];
  if (!pilot) throw new Error('Skill is not in the approved output pilot set');
  if (!pilot.surfaces.includes(surface)) throw new Error('Output surface is not allowed for skill: '+skill);
  if (!artifact || artifact.producer!==skill) throw new Error('Canonical artifact producer mismatch: '+skill);
  if (!Array.isArray(validation)||!Array.isArray(nextActions)) throw new Error('Validation and next actions must be arrays');
  const result=renderLifecycleArtifact(artifact,{title,summary,surface:surface==='json'?'file':surface,validation,nextActions});
  return surface==='json'
    ? {...result,markdown:undefined,json:JSON.stringify(result.presentation,null,2)+'\n'}
    : result;
}
