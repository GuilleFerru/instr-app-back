import mongoose from "mongoose";


const AttelierSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    plant:{
        type: String,
        require: true,
    },
    description: {
        type: String,
        
    }
},
    { timestamps: true }
);




export const attelierModel = mongoose.model("attelieres", AttelierSchema);