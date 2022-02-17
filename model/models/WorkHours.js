import mongoose from "mongoose";

const WorkHoursSchema = new mongoose.Schema({
    schedule: {
        type: String,
        require: true,
    },
    hour: {
        type: Number,
        require: true,
    }
},
    { timestamps: true }
);

export const workHoursModel = mongoose.model("workhours", WorkHoursSchema);