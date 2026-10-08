/**
 * Search and Filter Controls Component
 * Provides keyword search, category dropdown, date filter, upcoming toggle, and clear button
 */
import React from 'react';
import { Search, Tag, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

export const SearchFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  date,
  setDate,
  upcomingOnly,
  setUpcomingOnly,
  categories = [],
  onReset
}) => {
  const hasActiveFilters = search || (category && category !== 'All') || date || upcomingOnly;

  return (
    <div className="filter-card">
      <div className="filter-grid">
        {/* Keyword Search */}
        <div className="input-icon-group">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by event title, keyword, or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Dropdown */}
        <div className="input-icon-group">
          <Tag size={18} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Specific Date Picker */}
        <div className="input-icon-group">
          <CalendarIcon size={18} />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            title="Filter by event date"
          />
        </div>

        {/* Upcoming Only Toggle */}
        <label className="toggle-container" title="Filter out past events">
          <input
            type="checkbox"
            checked={upcomingOnly}
            onChange={(e) => setUpcomingOnly(e.target.checked)}
          />
          <span>Upcoming Only</span>
        </label>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="btn btn-outline btn-sm"
            title="Clear all active filters"
          >
            <RotateCcw size={15} />
            <span>Clear</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;
