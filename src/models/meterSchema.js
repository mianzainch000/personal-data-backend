const mongoose = require("mongoose");
const { Schema } = mongoose;
const meterSchema = new mongoose.Schema(
    {
        meterName: {
            type: String,
            trim: true,
        },
        meterConsumerId: {
            type: String,
            trim: true,
        },
        meterReferenceNo: {
            type: String,
            trim: true,
        },

        order: { type: Number, default: 0 },
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Meter", meterSchema);
