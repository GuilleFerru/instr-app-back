import mongoose from "mongoose";

const ShiftsSchema = new mongoose.Schema({
    date: {
        type: String,
        require: true,
    },
    shifts: {
        type: Array,
        require: true,
        
    }
},
    { timestamps: true }
);

export const shiftModel = mongoose.model("shifts", ShiftsSchema);