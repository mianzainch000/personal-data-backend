const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const userController = require("../controller/userController");

// ✅ Ek hi instance global scope me banao
const specialCodeLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3, // max 3 attempts
  message: { message: "Too many special code login attempts. Try again after 24 hours." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Conditional middleware
const conditionalLoginLimiter = (req, res, next) => {
  const { specialCode } = req.body;

  // agar user ne kuch likha hai (sahi ya galat)
  if (specialCode && specialCode.trim() !== "") {
    console.log("Limiter applied for special code attempt");
    return specialCodeLimiter(req, res, next); // 🔥 same limiter instance use ho raha hai
  }

  // agar blank hai → limiter skip
  next();
};

// ✅ Routes
router.post(
  "/signupMyPersonalData",
  userController.validate("signup"),
  userController.signup
);

router.post(
  "/login",
  conditionalLoginLimiter, // 🔥 sirf tab chalega jab special code likha ho
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
