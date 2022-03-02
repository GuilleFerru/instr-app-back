import mongoose from "mongoose";


const TagSchema = new mongoose.Schema({
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

export const tagModel = mongoose.model("tags", TagSchema);