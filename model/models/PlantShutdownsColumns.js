import mongoose from "mongoose";

const PlantShutdownsColumnsSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const plantShutdownsColumnsSchemaModel = mongoose.model("plantshutdownscoltables", PlantShutdownsColumnsSchema);