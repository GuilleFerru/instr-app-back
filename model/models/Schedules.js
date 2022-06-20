import mongoose from "mongoose";

const SchedulesSchema = new mongoose.Schema({
    date: {
        type: String,
        require: true,
    },
    dateTime: {
        type: Date,
        default: null,
    },
    schedule: {
        type: Array,
        require: true,

    },
    columns: {
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

export const scheduleModel = mongoose.model("schedules", SchedulesSchema);