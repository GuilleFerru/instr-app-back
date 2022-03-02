import mongoose from "mongoose";

const ManteinanceFrecuencySchema = new mongoose.Schema({
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

export const manteinanceFrecuencyModel = mongoose.model("manteinancefrecuencies", ManteinanceFrecuencySchema);