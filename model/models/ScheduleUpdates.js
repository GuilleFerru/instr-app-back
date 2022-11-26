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
    reason: {
        type: String,
        default: 'no especifcado',
    },
    sector: {
        type: String,
        require: true,
    }
},
    { timestamps: true }
);

export const scheduleUpdateModel = mongoose.model("schedulesupdates", SchedulesUpdatesSchema);