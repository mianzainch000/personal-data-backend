const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// 🧠 Memory-based tracker (IP + wrong attempts)
const wrongCodeTracker = new Map();

// 🕒 24 hours in milliseconds
const BLOCK_TIME = 24 * 60 * 60 * 1000;
const MAX_ATTEMPTS = 3;

const specialCode = "109213123141947"; // ✅ your real code

// 🕐 Helper to format remaining time
const formatRemainingTime = (msLeft) => {
  const hours = Math.floor(msLeft / (60 * 60 * 1000));
  const minutes = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
  if (hours <= 0 && minutes <= 0) return "a few seconds";
  if (hours <= 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${minutes > 1 ? "s" : ""}`;
};

// 🔒 Custom limiter middleware
const customSpecialCodeLimiter = (req, res, next) => {
  const key = req.headers["x-forwarded-for"] || req.ip; // consistent IP detection
  const { specialCode: userCode } = req.body;

  let record = wrongCodeTracker.get(key);

  // ✅ Already blocked?
  if (record && record.blockUntil && record.blockUntil > Date.now()) {
    const remaining = record.blockUntil - Date.now();
    const timeLeft = formatRemainingTime(remaining);
    return res.status(429).json({
      message: `Too many wrong special code attempts. Try again after ${timeLeft}.`,
    });
  }

  // ✅ Skip limiter if blank
  if (!userCode || userCode.trim() === "") return next();

  // ✅ Correct code but still blocked
  if (record && record.blockUntil && record.blockUntil > Date.now()) {
    const remaining = record.blockUntil - Date.now();
    const timeLeft = formatRemainingTime(remaining);
    return res.status(429).json({
      message: `You are temporarily blocked. Try again after ${timeLeft}.`,
    });
  }

  // ✅ Correct code & not blocked → reset
  if (userCode === specialCode) {
    wrongCodeTracker.delete(key);
    return next();
  }

  // ❌ Wrong code
  if (!record) {
    record = { attempts: 1, blockUntil: null };
  } else {
    record.attempts += 1;
  }

  // 🚫 Block if too many wrong tries
  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockUntil = Date.now() + BLOCK_TIME; // ⏳ full 24 hours
  }

  wrongCodeTracker.set(key, { ...record });

  // ✅ If blocked now
  if (record.blockUntil) {
    const remaining = record.blockUntil - Date.now();
    const timeLeft = formatRemainingTime(remaining);
    return res.status(429).json({
      message: `Too many wrong special code attempts. You are blocked for ${timeLeft}.`,
    });
  }

  // ✅ Still have attempts left
  return res.status(400).json({
    message: `Wrong special code. Attempts left: ${MAX_ATTEMPTS - record.attempts}`,
  });
};

// ✅ Routes
router.post("/signupMyPersonalData", userController.validate("signup"), userController.signup);

router.post("/login", customSpecialCodeLimiter, userController.validate("login"), userController.login);

router.post("/forgotPassword", userController.validate("forgotPassword"), userController.forgotPassword);

router.post("/resetPassword/:tokenEmail", userController.validate("resetPassword"), userController.resetPassword);

module.exports = router;
