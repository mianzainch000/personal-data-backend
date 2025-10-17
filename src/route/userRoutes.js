const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

// 🧠 Memory-based tracker (IP + wrong attempts)
const wrongCodeTracker = new Map();

// 🕒 24 hours in milliseconds
const BLOCK_TIME = 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 3;

const specialCode = "109213123141947"; // ✅ your real code

// 🔒 Custom middleware
const customSpecialCodeLimiter = (req, res, next) => {
  const ip = req.ip;
  const { specialCode: userCode } = req.body;

  // Check existing record for this IP
  const record = wrongCodeTracker.get(ip);

  // Agar already blocked hai aur block time khatam nahi hua
  if (record && record.blockUntil && record.blockUntil > Date.now()) {
    const hoursLeft = Math.ceil((record.blockUntil - Date.now()) / (60 * 60 * 1000));
    return res.status(429).json({
      message: `Too many wrong special code attempts. Try again after ${hoursLeft} hours.`,
    });
  }

  // Agar code blank hai to limiter skip karo
  if (!userCode || userCode.trim() === "") {
    return next();
  }

  // ✅ Agar sahi code hai — lekin user already blocked hai
  if (record && record.blockUntil && record.blockUntil > Date.now()) {
    return res.status(429).json({
      message: "Your access is temporarily blocked due to wrong attempts.",
    });
  }

  // ✅ Agar sahi code hai (aur blocked nahi hai)
  if (userCode === specialCode) {
    // Reset attempts
    wrongCodeTracker.delete(ip);
    return next();
  }

  // ❌ Agar galat code hai
  if (!record) {
    wrongCodeTracker.set(ip, { attempts: 1, blockUntil: null });
  } else {
    record.attempts += 1;
    // Agar 3 ya usse zyada galti kar di
    if (record.attempts >= MAX_ATTEMPTS) {
      record.blockUntil = Date.now() + BLOCK_TIME;
    }
    wrongCodeTracker.set(ip, record);
  }

  if (record?.attempts >= MAX_ATTEMPTS) {
    return res.status(429).json({
      message: "Too many wrong special code attempts. You are blocked for 24 hours.",
    });
  } else {
    return res.status(400).json({
      message: `Wrong special code. Attempts left: ${MAX_ATTEMPTS - record.attempts}`,
    });
  }
};

// ✅ Routes
router.post(
  "/signupMyPersonalData",
  userController.validate("signup"),
  userController.signup
);

router.post(
  "/login",
  customSpecialCodeLimiter, // 👈 Custom limiter lagao
  userController.validate("login"),
  userController.login
);

router.post(
  "/forgotPassword",
  userController.validate("forgotPassword"),
  userController.forgotPassword
);

router.post(
  "/resetPassword/:tokenEmail",
  userController.validate("resetPassword"),
  userController.resetPassword
);

module.exports = router;
