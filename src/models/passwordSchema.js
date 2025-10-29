const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema(
    {
        appName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Password", passwordSchema);
