import mongoose from "mongoose";

const DailyWorkColumnSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const dailyWorkColumnsModel = mongoose.model("dailyworkscoltable", DailyWorkColumnSchema);