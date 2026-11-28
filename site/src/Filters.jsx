import React from 'react';

export default function Filters({ categories, activeCategory, onSelectCategory }) {
  return (
    <div className="filters">
      <button
        className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        All
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
