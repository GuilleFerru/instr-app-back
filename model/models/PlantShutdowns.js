import mongoose from "mongoose";

const PlantShutdownSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    beginDate: {
        type: Date,
        require: true,
    },
    endDate: {
        type: Date,
        default: null,

    },
    timeSchedule: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
    },
    complete: {
        type: String,
    },
    sector: {
        type: String,
        require: true,
        default: "Instrumentos-Sistemas",
    },
},
    { timestamps: true }
);

export const plantShutdownModel = mongoose.model("plantshutdowns", PlantShutdownSchema);