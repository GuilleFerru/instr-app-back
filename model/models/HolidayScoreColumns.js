import mongoose from "mongoose";

const HolidayScoreColumnSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const holidayScoreColumnsModel = mongoose.model("holidayscorecoltable", HolidayScoreColumnSchema);