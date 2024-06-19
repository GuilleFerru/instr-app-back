import mongoose from "mongoose";

const StoreWorkshopSchema = new mongoose.Schema({
    eqType: {
        type: Number,
        require: true,
    },
    tag: {
        type: String,
        default: '-',
    },
    item: {
        type: String,
        default: '-',
    },
    bigDescription: {
        type: String,
        default: 'Sin información relevante',
    },
    storeWorkshopUbication: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 0,
    },
    sector: {
        type: String,
        require: true,
        default: "Instrumentos-Sistemas",
    }
},
    { timestamps: true }
);

export const storeWorkshopModel = mongoose.model("storeWorkshops", StoreWorkshopSchema);