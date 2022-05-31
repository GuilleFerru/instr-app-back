import mongoose from "mongoose";

const PlantShutdownWorksToDoColumnsSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const plantShutdownWorksToDoColumnsSchemaModel = mongoose.model("plantshutdownworkstodocoltables", PlantShutdownWorksToDoColumnsSchema);