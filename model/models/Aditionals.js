import mongoose from "mongoose";


const AditionalSchema = new mongoose.Schema({
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




export const aditionalModel = mongoose.model("aditionals", AditionalSchema);