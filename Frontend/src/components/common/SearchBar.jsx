import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../functions/price';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Function to fetch suggestions
  const fetchSuggestions = async (query) => {
    if (query.length > 0) {
      try {
        const response = await axios.get(`http://localhost:7000/api/product/search/suggestions?query=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Update suggestions when the search query changes
  useEffect(() => {
    fetchSuggestions(searchQuery);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]); // Close suggestions dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission or button click (search)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`); // Redirect to the search results page
    }
    setSuggestions([]); // Close suggestions dropdown on Enter
  };

  // Handle selecting a suggestion
  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion._id}`); // Redirect to the product's detail page
    setSuggestions([]); // Close suggestions dropdown on suggestion click
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          🔍
        </button>
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <div ref={dropdownRef} className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded-lg z-10">
            {suggestions?.map((suggestion) => (
              <div
                key={suggestion._id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              >
                <div className='flex gap-5'>
                  <img width={50} className='rounded-full' src={suggestion.imageGallery[0]} alt="" />
                  <div>
                    <div>{suggestion.name}</div>
                    <div>Rs. {formatPrice(suggestion.price)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
