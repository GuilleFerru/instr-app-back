import mongoose from "mongoose";

const PlantsSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
    }
},
    { timestamps: true }
);

export const plantsModel = mongoose.model("plants", PlantsSchema);