import mongoose from "mongoose";

const DailyWorkRoutinesColumnSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const dailyWorkRoutineColumnModel = mongoose.model("dailyworkRoutinescoltable", DailyWorkRoutinesColumnSchema);