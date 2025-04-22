import React, { useEffect, useState } from "react";
import axios from "axios";
import CartProduct from "../components/cart/CartProduct";
import OrderSummary from "../components/cart/OrderSummary";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const fetchStockData = async () => {
      const stockInfo = {};
      for (const product of storedCart) {
        try {
          const { data } = await axios.get(`http://localhost:7000/api/product/single/${product._id}`);
          stockInfo[product._id] = data.product.stock;
        } catch (err) {
          console.error("Error fetching stock:", err);
        }
      }
      setStockData(stockInfo);
    };

    fetchStockData();
  }, []);

  const handleUpdateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleSelectProduct = (productId, isSelected) => {
    if (isSelected) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const selectedCartItems = cart.filter((product) =>
    selectedProducts.includes(product._id)
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.length > 0 ? (
            cart.map((product) => (
              <CartProduct
                key={product._id}
                product={product}
                isSelected={selectedProducts.includes(product._id)}
                stock={stockData[product._id]}
                onSelectProduct={handleSelectProduct}
                onUpdateCart={handleUpdateCart}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>
        <OrderSummary cart={selectedCartItems} />
      </div>
    </div>
  );
};


export default CartPage;
