import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Filters from "../components/home/Filters";
import Sorting from "../components/home/Sorting";
import Pagination from "../components/home/Pagination";
import ProductCard from "../components/home/ProductCard";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("relevant");
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:7000/api/product/search`,
        {
          params: {
            query,
            category: selectedCategory,
            sort: selectedSort,
            page: currentPage,
            limit: 20,
          },
        }
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [query, selectedCategory, selectedSort, currentPage]);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="search-results-page bg-gray-50 min-h-screen">
      {/* Filters and Sorting Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-white shadow-md rounded-md m-4">
        <h2 className="text-lg font-bold mb-2 sm:mb-0">Search Results for "{query}"</h2>
        <div className="flex space-x-4">
          <Filters
            selectedCategory={selectedCategory}
            onFilterChange={handleFilterChange}
          />
          <Sorting
            selectedSort={selectedSort}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Products Grid or No Results */}
      <div className="products-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500">Loading...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <img
              src="https://img.icons8.com/?size=100&id=12773&format=png&color=000000"
              alt="No results"
              className="w-32 mx-auto mb-4"
            />
            <p className="text-lg font-medium text-gray-600">No products found</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
            >
              Browse Categories
            </button>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="pagination-container p-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SearchResults;
