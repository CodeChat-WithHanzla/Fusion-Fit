// api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:7000/api";

export const fetchProducts = async (filters) => {
  const { targetShape, sortBy, page } = filters;
  const response = await axios.get(`${API_BASE_URL}/product/all/products`, {
    params: { targetShape, sortBy, page }
  });
  return response.data;
};
