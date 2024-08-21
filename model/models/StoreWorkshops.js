import mongoose from "mongoose";

const StoreWorkshopSchema = new mongoose.Schema({
    eqType: {
        type: mongoose.Schema.Types.Number, ref: 'storeWorkshopTypes',
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
        type: mongoose.Schema.Types.Number, ref: 'storeWorkshopUbications',
    },
    quantity: {
        type: Number,
        default: 1,
    },
    state: {
        type: Number,
        default: 1,
    },
    date: {
        type: Date,
        require: true,
    },
    sector: {
        type: String,
        require: true,
        default: "Instrumentos-Sistemas",
    }
},
    { timestamps: true }
);

StoreWorkshopSchema.index({ storeWorkshopUbication: 1 });

export const storeWorkshopModel = mongoose.model("storeWorkshops", StoreWorkshopSchema);

