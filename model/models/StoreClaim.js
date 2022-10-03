import mongoose from "mongoose";

const StoreClaimSchema = new mongoose.Schema({
    item: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    nonstockdate: {
        type: Date,
        require: true,
    },
    claimdate: {
        type: Date,
    },
    claimed: {
        type: Boolean,
        default: false,
    },
    claimedBy: {
        type: String,
    },
    claimedQty: {
        type: Number,
    },
    addedToClaim: {
        type: Boolean,
        default: false,
    },
    sector: {
        type: String,
        require: true,
        default: "Instrumentos-Sistemas",
    }
},
    { timestamps: true }
);

export const storeClaimModel = mongoose.model("storeClaims", StoreClaimSchema);