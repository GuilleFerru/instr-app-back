import mongoose from "mongoose";

const OtherRoutineColumnSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const otherRoutineColumnModel = mongoose.model("otherroutinescoltables", OtherRoutineColumnSchema);