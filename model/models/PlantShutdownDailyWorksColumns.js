import mongoose from "mongoose";

const PlantShutdownDailyWorkColumnSchema = new mongoose.Schema({
    columns: {
        type: Array,
        require: true,
    },
},
    { timestamps: true }
);

export const plantShutdowndailyWorksColumnsSchemaModel = mongoose.model("plantshutdowndailyworkstable", PlantShutdownDailyWorkColumnSchema);