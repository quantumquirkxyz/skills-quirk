#!/usr/bin/env node
// work-item-router.mjs - Routes work items to appropriate quirk skills
// This integrates the work-item routing system with the skill lab.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const skillsRoot = join(root, '.agents', 'skills');
const contextFile = join(root, 'CONTEXT.md');

function loadContext() { 
  try { return readFileSync(contextFile, 'utf8'); } 
  catch { return ''; } 
}

function loadSkills() {
  const skills = [];
  try {
    const scanDir = (dir, depth = 0) => {
      const entries = readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory() && entry.name !== 'platform' && depth < 3) {
          const skillFile = join(full, 'SKILL.md');
          if (existsSync(skillFile)) {
            skills.push({ name: entry.name, file: skillFile, parent: join(dir, entry.name) });
          } else {
            scanDir(full, depth + 1);
          }
        }
      }
    };
    scanDir(skillsRoot);
  } catch {}
  return skills;
}

function routeWorkItem(description) {
  const skills = loadSkills();
  const context = loadContext();
  const keywords = (description || '').toLowerCase();
  
  // Simple keyword-based routing for demonstration
  const routing = {
    'spec': ['to-spec', 'domain-modeling', 'grill-with-docs', 'agent-canvas', 'context-engine'],
    'ticket': ['to-tickets', 'triage', 'subagent-swarm'],
    'implement': ['implement', 'tdd', 'skill-creator', 'mcp-server'],
    'review': ['review-pr', 'plan-review-fixes', 'review-fix-loop'],
    'bug': ['diagnosing-bugs', 'tdd', 'implement'],
    'test': ['testing', 'evaluate-skill', 'skill-testing-framework'],
    'release': ['release-management', 'deployment', 'monitoring-alerting'],
    'skill': ['skill-template-generator', 'skill-testing-framework', 'agent-observability'],
    'setup': ['integration-playground', 'setup-quirk-skills'],
    'default': ['ask-to', 'capability-router'],
  };
  
  const matches = [];
  for (const [key, skillList] of Object.entries(routing)) {
    if (keywords.includes(key) || keywords.includes(key.replace(/-.*$/, ''))) {
      matches.push(...skillList);
    }
  }
  
  const recommendations = matches.length ? [...new Set(matches)] : routing.default;
  
  return {
    input: description,
    recommendations,
    skillsLoaded: skills.length,
    contextLength: context.length,
    nextSteps: recommendations.slice(0, 3),
    note: 'Review skills selected by the router and confirm with ask-to.',
  };
}

function main() {
  const args = process.argv.slice(2);
  const description = args.join(' ') || process.env.WORK_ITEM_DESCRIPTION || 'default routing';
  const result = routeWorkItem(description);
  console.log(JSON.stringify(result, null, 2));
}

main();
