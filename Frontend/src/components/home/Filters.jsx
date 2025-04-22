// Filters.jsx
import React from 'react';

const Filters = ({ selectedShape, onFilterChange }) => (
  <div className="filters-dropdown">
    <label htmlFor="targetShape" className="block text-sm font-medium text-gray-700">
      Filter by Target Shape
    </label>
    <select
      id="targetShape"
      value={selectedShape}
      onChange={(e) => onFilterChange(e.target.value)}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
    >
      <option value="">All</option>
      <option value="hourglass">Hourglass</option>
      <option value="pear">Pear</option>
      <option value="apple">Apple</option>
      <option value="rectangle">Rectangle</option>
      <option value="inverted triangle">Inverted Triangle</option>
    </select>
  </div>
);

export default Filters;
