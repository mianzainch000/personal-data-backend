const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
    createPassword,
    getPasswords,
    updatePassword,
    deletePassword,
} = require("../controllers/passwordController");

router.post("/create", authenticate, createPassword);
router.get("/get", authenticate, getPasswords);
router.put("/update/:id", authenticate, updatePassword);
router.delete("/delete/:id", authenticate, deletePassword);

module.exports = router;
