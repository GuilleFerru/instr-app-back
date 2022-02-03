import mongoose from "mongoose";

const ShiftsSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
    },
    shift: {
        type: Array,
        require: true,
        
    },
    anio: {
        type: String,
        require: true,
    }
},
    { timestamps: true }
);

export const shifts = mongoose.model("shifts", ShiftsSchema);