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

  let record = wrongCodeTracker.get(ip);

  // ✅ Check if user is already blocked
  if (record && record.blockUntil && record.blockUntil > Date.now()) {
    const hoursLeft = Math.ceil((record.blockUntil - Date.now()) / (60 * 60 * 1000));
    return res.status(429).json({
      message: `Too many wrong special code attempts. Try again after ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}.`,
    });
  }

  // ✅ Skip limiter if no special code provided
  if (!userCode || userCode.trim() === "") {
    return next();
  }

  // ✅ Correct code but previously blocked
  if (record && record.blockUntil && record.blockUntil > Date.now()) {
    const hoursLeft = Math.ceil((record.blockUntil - Date.now()) / (60 * 60 * 1000));
    return res.status(429).json({
      message: `You are temporarily blocked. Try again after ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}.`,
    });
  }

  // ✅ Correct code and not blocked → allow & reset attempts
  if (userCode === specialCode) {
    wrongCodeTracker.delete(ip);
    return next();
  }

  // ❌ Wrong code
  if (!record) {
    record = { attempts: 1, blockUntil: null };
  } else {
    record.attempts += 1;
  }

  // ✅ If reached max attempts, block for 24h
  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockUntil = Date.now() + BLOCK_TIME;
  }

  // ✅ Update record safely
  wrongCodeTracker.set(ip, { ...record });

  // ✅ If just got blocked
  if (record.blockUntil) {
    const hoursLeft = Math.ceil((record.blockUntil - Date.now()) / (60 * 60 * 1000));
    return res.status(429).json({
      message: `Too many wrong special code attempts. You are blocked for ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}.`,
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
