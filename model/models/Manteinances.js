import mongoose from "mongoose";

const ManteinanceSchema = new mongoose.Schema({
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

export const manteinanceModel = mongoose.model("manteinances", ManteinanceSchema);