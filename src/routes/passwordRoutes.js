const express = require("express");
const router = express.Router();
const {
    createPassword,
    getPasswords,
    updatePassword,
    deletePassword,
} = require("../controllers/passwordController");

// 🟢 Create new password
router.post("/create", createPassword);

// 🔵 Get all passwords
router.get("/get", getPasswords);

// 🟡 Update by ID
router.put("/update:id", updatePassword);

// 🔴 Delete by ID
router.delete("/delete:id", deletePassword);

module.exports = router;
