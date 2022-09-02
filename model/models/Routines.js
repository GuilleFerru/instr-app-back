import mongoose from "mongoose";

const RoutinesSchema = new mongoose.Schema({
    plant: {
        type: Number,
        require: true,
    },
    attelier: {
        type: Number,
        require: true,
    },
    tag: {
        type: String,
        require: true,
        unique: true,
    },
    timeSchedule: {
        type: Number,
        require: true,
    },
    frecuency: {
        type: Number,
        require: true,
    },
    manteinance: {
        type: Number,
        require: true,
    },
    action: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    sector: {
        type: String,
        require: true,
    }
},
    { timestamps: true }
);

export const routineModel = mongoose.model("routines", RoutinesSchema);