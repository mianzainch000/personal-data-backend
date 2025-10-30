const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// ✅ Routes
router.post(
    "/signupMyPersonalData",
    userController.validate("signup"),
    userController.signup
);

router.post("/login", userController.validate("login"), userController.login);

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
