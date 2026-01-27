const mongoose = require("mongoose");
const { Schema } = mongoose;
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
        order: { type: Number, default: 0 },
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Password", passwordSchema);
