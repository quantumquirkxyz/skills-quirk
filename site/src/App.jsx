import React, { useState, useEffect } from 'react';
import SkillCard from './SkillCard';
import Filters from './Filters';
import skillsData from './skills.json';

function App() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [skills, setSkills] = useState(skillsData.skills || []);

  useEffect(() => {
    fetch('/skills.json')
      .then(r => r.json())
      .then(data => setSkills(data.skills || []))
      .catch(() => setSkills(skillsData.skills || []));
  }, []);

  const categories = [...new Set(skills.map(s => s.category))].sort();

  const filtered = skills.filter(s => {
    const matchesQuery = !query ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.description.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <header>
        <h1>⚡ Quirk Skills</h1>
        <div className="subtitle">
          {skills.length} skills across {categories.length} categories — validated, scored, and agent-ready
        </div>
      </header>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search skills by name, description, or capability..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="stats">
        <div className="stat">
          <div className="stat-value">{skills.length}</div>
          <div className="stat-label">Total Skills</div>
        </div>
        <div className="stat">
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat">
          <div className="stat-value">{filtered.length}</div>
          <div className="stat-label">Showing</div>
        </div>
      </div>
      <Filters
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />
      <div className="skills-grid">
        {filtered.map(skill => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </div>
    </div>
  );
}

export default App;
