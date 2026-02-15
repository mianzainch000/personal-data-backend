const mongoose = require("mongoose");
const { Schema } = mongoose;

const meterReadingSchema = new Schema(
    {
        month: { type: String, trim: true },
        reading: { type: Number },
        unit: { type: Number },
        bill: { type: Number },
        meterId: { type: Schema.Types.ObjectId, ref: "Meter", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
        order: { type: Number, default: 0 },
    },
    { timestamps: true },
);

const MeterReading =
    mongoose.models.MeterReading ||
    mongoose.model("MeterReading", meterReadingSchema);
module.exports = MeterReading;
