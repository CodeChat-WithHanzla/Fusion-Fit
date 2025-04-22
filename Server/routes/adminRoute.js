const express = require("express");
const {
    getDashboardStats
} = require("../controllers/adminController");
const { isAuthenticated, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", isAuthenticated, isAdmin, getDashboardStats);

module.exports = router;