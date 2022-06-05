import mongoose from "mongoose";

const DailyWorksSchema = new mongoose.Schema({
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
    },
    timeSchedule: {
        type: Number,
        require: true,
    },
    manteinance: {
        type: Number,
        require: true,
    },
    ot: {
        type: String,
    },
    action: {
        type: Number,
        require: true,
    },
    description: {
        type: String,
        default: '',
    },
    complete: {
        type: String,
        default: 'P',
    },
    beginDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    routineScheduleId: {
        type: String,
    },
    plantShutdownWorkId: {
        type: String,
    },
    sector: {
        type: String,
        require: true,
        default: 'Instrumentos-Sistemas'
    }
},
    { timestamps: true }
);

export const dailyWorkModel = mongoose.model("dailyworks", DailyWorksSchema);