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

// 🔴 Delete password entry
exports.deletePassword = async (req, res) => {
    try {
        const deleted = await Password.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res
                .status(404)
                .json({ success: false, message: "Password entry not found" });
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
