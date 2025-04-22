import React from 'react';

const Sorting = ({ selectedSort, onSortChange }) => {
  return (
    <div className='sorting-dropdown '>
        <label htmlFor="sorting" className="block text-sm font-medium text-gray-700">
            Sorting By:
        </label>
    <select
      value={selectedSort}
      onChange={(e) => onSortChange(e.target.value)}
      className="sorting-dropdown"
    >
      <option value="relevant">Relevant</option>
      <option value="priceLowToHigh">Price: Low to High</option>
      <option value="priceHighToLow">Price: High to Low</option>
      <option value="newest">Newest</option>
    </select>
    </div>
  );
};

export default Sorting;
