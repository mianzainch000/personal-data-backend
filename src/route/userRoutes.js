const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const userController = require("../controller/userController");

// ✅ Correct special code
const VALID_SPECIAL_CODE = "109213123141947";

// ✅ Ek hi instance global scope me banao (galat code ke liye)
const wrongCodeLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // max 3 galat attempts
  message: {
    message: "Too many wrong special code attempts. Please try again after 24 hours.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Conditional middleware
const conditionalLoginLimiter = (req, res, next) => {
  const { specialCode } = req.body;

  // 🟢 Agar blank hai → skip limiter
  if (!specialCode || specialCode.trim() === "") {
    return next();
  }

  // 🟢 Agar correct special code hai → skip limiter
  if (specialCode.trim() === VALID_SPECIAL_CODE) {
    console.log("✅ Correct special code entered — limiter skipped");
    return next();
  }

  // 🔴 Agar galat special code hai → limiter apply
  console.log("❌ Wrong special code entered — limiter applied");
  return wrongCodeLimiter(req, res, next);
};

// ✅ Routes
router.post(
  "/signupMyPersonalData",
  userController.validate("signup"),
  userController.signup
);

router.post(
  "/login",
  conditionalLoginLimiter,
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
