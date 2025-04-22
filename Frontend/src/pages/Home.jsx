import React, { useState, useEffect } from "react";
import ProductCard from "../components/home/ProductCard";
import Filters from "../components/home/Filters";
import Sorting from "../components/home/Sorting";
import Pagination from "../components/home/Pagination";
import { fetchProducts } from "../components/home/services/api";
import img from "../assets/bg.jpg"
const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("relevant");

  const fetchAndSetProducts = async () => {
    const data = await fetchProducts({
      targetShape: selectedCategory,
      sortBy: selectedSort,
      page: currentPage,
    });
    setProducts(data.products);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchAndSetProducts();
  }, [selectedCategory, selectedSort, currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <img src={img} alt="Banner" className="w-screen h-[34rem] object-cover" />
      <div className="container mx-auto px-4 py-8">
        {/* Filters and Sorting Section */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Filters
            selectedCategory={selectedCategory}
            onFilterChange={setSelectedCategory}
          />
          <Sorting
            selectedSort={selectedSort}
            onSortChange={setSelectedSort}
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
