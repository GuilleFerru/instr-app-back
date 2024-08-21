import mongoose from "mongoose";
import { sequentialIdMiddleware, deleteWorkshopsMiddleware } from "../../utils/storeWorkshopModelsMiddlewares.js";
import { storeWorkshopModel } from "../models/StoreWorkshops.js"

const StoreWorkshopUbicationSchema = new mongoose.Schema({
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
sequentialIdMiddleware(StoreWorkshopUbicationSchema, 'storeWorkshopUbication');
// Middleware para borrar todos los documentos de StoreWorshops que tengan un storeWorkshopUbication == id
deleteWorkshopsMiddleware(StoreWorkshopUbicationSchema, storeWorkshopModel, 'storeWorkshopUbication');



export const storeWorkshopUbicationModel = mongoose.model("storeWorkshopUbications", StoreWorkshopUbicationSchema);