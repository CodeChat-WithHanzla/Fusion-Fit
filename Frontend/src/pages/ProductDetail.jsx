import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ImageGallery from "../components/home/ImageGallery";
import StarRating from "../components/Rating";
import Comment from '../components/Comment'
import {showSuccess, showError} from '../components/common/Notify'

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Initial quantity for Add to Cart
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      name: "John Doe",
      rating: 5,
      text: "Absolutely love this product! The quality is outstanding and it exceeded my expectations.",
      date: "2024-01-05"
    },
    {
      name: "Sarah Smith",
      rating: 4,
      text: "Great value for money. Would definitely recommend to others.",
      date: "2024-01-03"
    },
    {
      name: "Michael Brown",
      rating: 5,
      text: "Perfect fit for my needs. The customer service was excellent too!",
      date: "2024-01-01"
    }
  ]);

  const navigate = useNavigate();
  const randomRating = 4.5; // You can make this dynamic

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([
        {
          name: "Guest User",
          rating: 5,
          text: newComment,
          date: new Date().toISOString().split('T')[0]
        },
        ...comments
      ]);
      setNewComment("");
    }
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/product/single/${id}`
        );
        setProduct(response.data.product);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type) => {
    setQuantity((prevQuantity) => {
      if (type === "increase" && product.stock && prevQuantity >= product.stock) {
        return prevQuantity; // Prevent increasing beyond stock
      }
      return type === "increase" ? prevQuantity + 1 : Math.max(1, prevQuantity - 1);
    });
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProductIndex = cart.findIndex(item => item._id === product._id);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    showSuccess(`Added ${quantity} of ${product.name} to the cart!`);
  };

  const handleBuyNow = () => {
    showSuccess("Proceeding to checkout!");
    const tempCart = [{ ...product, quantity }]; // Store product temporarily
    localStorage.setItem("buyNowItem", JSON.stringify(tempCart)); // Save in a separate key
    navigate("/checkout");
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const isLowStock = product.stock < 10; // Determine if stock is low
  const isOutOfStock = product.stock <= 0; // Check if the product is out of stock

  return (
    <div className="container mx-auto mt-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10">
        {/* Image Gallery */}
        <ImageGallery images={product.imageGallery} altText={product.name} />

        {/* Product Details */}
        <div className="space-y-5">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center space-x-4">
            <StarRating rating={randomRating} />
            <span className="text-lg font-semibold text-gray-700">
              {randomRating} / 5
            </span>
          </div>

          <p className="text-lg text-gray-700">{product.description}</p>
          <p className="text-2xl font-bold text-orange-600">Rs. {product.price}</p>

          {/* Stock Info */}
          {isOutOfStock ? (
            <p className="text-red-600 font-bold">Out of Stock</p>
          ) : (
            isLowStock && (
              <p className="text-yellow-600 font-bold">
                Only {product.stock} items left in stock!
              </p>
            )
          )}

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <div className="flex items-center space-x-4">
              <button
                className="w-10 h-10 bg-gray-200 rounded-md text-xl font-bold hover:bg-gray-300"
                onClick={() => handleQuantityChange("decrease")}
              >
                -
              </button>
              <span className="text-lg font-semibold">{quantity}</span>
              <button
                className={`w-10 h-10 rounded-md text-xl font-bold ${quantity >= product.stock
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
                  }`}
                onClick={() => handleQuantityChange("increase")}
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          )}

          {/* Add to Cart and Buy Now Buttons */}
          <div className="flex space-x-4">
            <button
              className={`flex-1 rounded-md py-2 text-white ${isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              Add to Cart
            </button>
            <button
              className={`flex-1 rounded-md py-2 text-white ${isOutOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
                }`}
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>


      {/* Reviews and Comments Section */}
      <hr />
      <div className="my-10">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex flex-col space-y-4 max-w-2xl">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
            >
              Post Review
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6 max-w-4xl">
          {comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
