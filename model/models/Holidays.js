import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema({
    periodName: {
        type: String,
        require: true,
        unique: true,
    },
    startDate: {
        type: Date,
        require: true,
    },
    endDate: {
        type: Date,
        require: true,
    },
    holidaysData: {
        type: Array,
        require: true,
        default: [],
    },
    sector: {
        type: String,
        require: true,
        default: "Instrumentos-Sistemas",
    }
},
    { timestamps: true }
);

export const holidayModel = mongoose.model("holidays", HolidaySchema);