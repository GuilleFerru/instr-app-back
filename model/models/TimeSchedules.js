import mongoose from "mongoose";


const TimeScheduleSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    schedule: {
        type: String,
        require: true,
    },
},
    { timestamps: true }
);




export const timeScheduleModel = mongoose.model("timeSchedule", TimeScheduleSchema);