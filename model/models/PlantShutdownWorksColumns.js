import mongoose from "mongoose";

const PlantShutdownWorksColumnsSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const plantShutdownWorksColumnsSchemaModel = mongoose.model("plantshutdownworkscoltables", PlantShutdownWorksColumnsSchema);