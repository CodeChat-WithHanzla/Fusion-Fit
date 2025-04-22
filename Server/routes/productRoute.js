const express = require("express");
const { isAdmin, isAuthenticated } = require("../middlewares/authMiddleware")
const {
    getProducts,
    listProduct,
    getListedProducts,
    deleteProduct,
    getProductById,
    updateProduct,
    getSuggesstions,
    searchProducts
} = require("../controllers/productController");
const multer = require("../helpers/multer");
const router = express.Router();

router.get("/all/products", getProducts);
router.post("/list", isAdmin, multer, listProduct);
router.get("/listed-products", isAdmin, getListedProducts);
router.put("/update/:id", isAdmin, multer, updateProduct);
router.delete("/delete/:id", isAdmin, deleteProduct);
router.get("/single/:id", getProductById);
router.get("/search/suggestions", getSuggesstions);
router.get('/search', searchProducts);


module.exports = router;