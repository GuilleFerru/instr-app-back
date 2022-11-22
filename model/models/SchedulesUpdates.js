import mongoose from "mongoose";

const SchedulesUpdatesSchema = new mongoose.Schema({
    legajo: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        default: null,
    },
    fromSchedule: {
        type: Array,
        require: true,
    },
    toSchedule: {
        type: Array,
        require: true,
    },
    sector: {
        type: String,
        require: true,
    }


},
    { timestamps: true }
);

export const scheduleUpdatesModel = mongoose.model("schedulesupdates", SchedulesUpdatesSchema);