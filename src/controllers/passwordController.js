const Password = require("../models/passwordSchema");

// 🟢 Create new password entry
exports.createPassword = async (req, res) => {
    try {
        const newPassword = await Password.create(req.body);
        res.status(201).json({
            success: true,
            message: "Password entry created successfully.",
            data: newPassword,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🔵 Get all password entries
exports.getPasswords = async (req, res) => {
    try {
        const passwords = await Password.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: passwords });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🟡 Update password entry
exports.updatePassword = async (req, res) => {
    try {
        const updated = await Password.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: "Password entry not found" });
        res
            .status(200)
            .json({ success: true, message: "Updated successfully", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




exports.deletePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Password.deleteOne({
            _id: id,
        });

        if (deletedProduct.deletedCount > 0) {
            return res.status(200).send({
                message: "Product deleted successfully",
                productId: id,
            });
        } else {
            return res.status(404).send({
                message: "Product not found",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error." });
    }
};