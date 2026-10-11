import React from 'react';
import './CatalogueFilter.css';

function CatalogueFilter({
  searchTerm,
  onSearchChange,
  category,
  onCategoryChange,
  onlyAvailable,
  onAvailableChange,
  onSearch,
  onReset,
}) {
  return (
    <form className="filter-form" onSubmit={onSearch}>
      <input
        type="text"
        placeholder="Search by title, author, or ISBN..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="category-select"
      >
        <option value="">All Categories</option>
        <option value="Software Engineering">Software Engineering</option>
        <option value="Programming">Programming</option>
        <option value="Science">Science</option>
        <option value="Fiction">Fiction</option>
        <option value="Technology">Technology</option>
      </select>

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={onlyAvailable}
          onChange={(e) => onAvailableChange(e.target.checked)}
        />
        Available only
      </label>

      <button type="submit" className="search-btn">Search</button>
      <button type="button" onClick={onReset} className="reset-btn">Reset</button>
    </form>
  );
}

export default CatalogueFilter;
