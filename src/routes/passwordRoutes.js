const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
    createPassword,
    getPasswords,
    updatePassword,
    deletePassword,
    reorderPasswords, // Import naya function
} = require("../controllers/passwordController");

router.post("/create", authenticate, createPassword);
router.get("/get", authenticate, getPasswords);
router.put("/reorder", authenticate, reorderPasswords); // Put request for order
router.put("/update/:id", authenticate, updatePassword);
router.delete("/delete/:id", authenticate, deletePassword);

module.exports = router;
