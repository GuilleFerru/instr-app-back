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
    },
},
    { timestamps: true }
);

export const plantShutdownModel = mongoose.model("plantshutdowns", PlantShutdownSchema);