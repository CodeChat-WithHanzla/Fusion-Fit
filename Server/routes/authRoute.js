const express = require("express");
const {
  signup,
  login,
  sendVerificationEmail,
  verifyEmail,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-verification-email", sendVerificationEmail);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
module.exports = router;
