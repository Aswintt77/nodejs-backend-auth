// routes/authRoutes.js
const express = require("express");
const { signup, signin, sendOtp, verifyOtp } = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
