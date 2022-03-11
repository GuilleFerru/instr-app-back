import mongoose from "mongoose";

const routineScheduleSchema = new mongoose.Schema({
    routine: {
        type: String,
        require: true,
    },
    startDate: {
        type: Date,
        require: true,
        default: '01/2/2022',
    },
    ot: {
        type: String,
    },
    dueDate: {
        type: Date,

    },
    checkDays: {
        type: Array
    },
    otherCheckDay: {
        type: Date,
        default: undefined
    },
    realCheckedDay: {
        type: Date,
        default: undefined

    },
    isExpired: {
        type: Boolean,
        require: true,
        default: false
    },
    complete: {
        type: Boolean,
        require: true,
        default: false
    },
    filePath: {
        type: String,
    },
    nickname: {
        type: String,
    },
    sector: {
        type: String,
        require: true,
    },
},
    { timestamps: true }
);

export const routineScheduleModel = mongoose.model("routinesschedules", routineScheduleSchema);