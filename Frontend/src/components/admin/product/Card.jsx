import React from "react";
import { formatPrice } from '../../../functions/price'

const ProductCard = ({ product }) => {
  return (
    <div className="max-w-sm rounded-lg border border-gray-200 shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={product.imageGallery[0] || "https://via.placeholder.com/150"}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{product.name}</h3>
        <p className="text-gray-600 mt-2 line-clamp-3">{product.description}</p>
        <div className="mt-4">
          <span className="text-sm text-gray-500">Target Body Type: </span>
          <span className="text-sm font-medium text-gray-700">{product?.targetShapes[0].toUpperCase()}</span>
        </div>
        <div className="mt-4">
          <span className="text-sm text-gray-500">Type: </span>
          <span className="text-sm font-medium text-gray-700">{product?.type.toUpperCase()}</span>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500">Stock: </span>
          <span
            className={`text-sm font-medium ${product.stock === 0
              ? "text-red-600"
              : product.stock > 10
                ? "text-green-600"
                : "text-orange-600"
              }`}
          >
            {product.stock === 0
              ? "Out of stock"
              : `${product.stock} available`}
          </span>
        </div>
        <div className="mt-4">
          <span className="text-lg font-semibold text-gray-800">Rs. {formatPrice(product.price)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
