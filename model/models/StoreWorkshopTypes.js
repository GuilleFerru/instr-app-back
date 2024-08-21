import mongoose from "mongoose";
import { sequentialIdMiddleware, deleteWorkshopsMiddleware } from "../../utils/storeWorkshopModelsMiddlewares.js";
import { storeWorkshopModel } from "../models/StoreWorkshops.js"

const StoreWorkshopTypeSchema = new mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: {
        type: String,
        require: true,
        unique: true,
    }
},
    { timestamps: true }
);


// Middleware para incrementar el contador antes de guardar un nuevo documento
sequentialIdMiddleware(StoreWorkshopTypeSchema, 'storeWorkshopType');
// Middleware para borrar todos los documentos de StoreWorshops que tengan un eqType == id
deleteWorkshopsMiddleware(StoreWorkshopTypeSchema, storeWorkshopModel, 'storeWorkshopType')

export const storeWorkshopTypeModel = mongoose.model("storeWorkshopTypes", StoreWorkshopTypeSchema);