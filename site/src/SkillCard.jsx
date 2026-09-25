import React from 'react';

export default function SkillCard({ skill }) {
  return (
    <div className="skill-card">
      <div className="skill-header">
        <div>
          <div className="skill-name">{skill.name}</div>
          <div className="skill-path">{skill.path}</div>
        </div>
      </div>
      <div className="skill-desc">{skill.description}</div>
      <div className="skill-meta">
        <span className="badge badge-category">{skill.category}</span>
        <span className="badge badge-tier">Tier {skill.trustTier || '1'}</span>
        <span className="badge badge-risk">{skill.risk || 'low'}</span>
        {skill.maturity && <span className="badge" style={{ background: '#1c1917', color: '#d6d3d1' }}>{skill.maturity}</span>}
      </div>
      <div className="skill-actions">
        <code className="cmd">npx skills-quirk add {skill.name}</code>
      </div>
    </div>
  );
}
