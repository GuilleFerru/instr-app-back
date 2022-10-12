import mongoose from "mongoose";

const StoreItemsSchema = new mongoose.Schema({
    item: {
        type: String,
        require: true,
    },
    unit: {
        type: String,
    },
    smallDescription: {
        type: String,
    },
    storeUbication: {
        type: String,
    },
    bigDescription: {
        type: String,
    },
    quantity: {
        type: Number,
    },
},
    { timestamps: true }
);

export const storeItemModel = mongoose.model("storeItems", StoreItemsSchema);