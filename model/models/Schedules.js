import mongoose from "mongoose";

const SchedulesSchema = new mongoose.Schema({
    date: {
        type: String,
        require: true,
    },
    schedule: {
        type: Array,
        require: true,

    },
    timeSchedule: {
        type: Array,
        require: true,
    },
    employeesForSchedule: {
        type: Array,
        require: true,
    },
    aditionals: {
        type: Array,
        require: true,
    }
},
    { timestamps: true }
);

export const scheduleModel = mongoose.model("schedules", SchedulesSchema);