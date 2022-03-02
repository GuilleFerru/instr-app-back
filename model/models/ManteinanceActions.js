import mongoose from "mongoose";

const ManteinanceActionSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
},
    { timestamps: true }
);

export const manteinanceActionModel = mongoose.model("manteinanceactions", ManteinanceActionSchema);