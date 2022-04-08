import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    password: {
        type: String,
        require: true,
        min: 4
    },
    name:{
        type: String,
        require: true,
        min: 3,
    },
    lastname:{
        type: String,
        require: true,
        min: 3,
    },
    legajo: {
        type: Number,
        require: true,
        unique: true
    },
    sector: {
        type: String,
        require: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},
    { timestamps: true }
);

export const userModel = mongoose.model("users", UserSchema);