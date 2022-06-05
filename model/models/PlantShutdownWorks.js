import mongoose from "mongoose";

const PlantShutdownWorksSchema = new mongoose.Schema({
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
    workToDo: {
        type: String,
    },
    description: {
        type: String,
        default: '',
    },
    complete: {
        type: String,
    },
    beginDate: {
        type: Date,

    },
    endDate: {
        type: Date,
        default: null,
    },
    routineScheduleId: {
        type: String,
    },
    plantShutdownId: {
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

export const plantShutdownWorkModel = mongoose.model("plantshutdownworks", PlantShutdownWorksSchema);