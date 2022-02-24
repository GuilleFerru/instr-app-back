import mongoose from "mongoose";

const EmployeesSchema = new mongoose.Schema({
    legajo: {
        type: Number,
        require: true,
        unique: true
    },
    nombre: {
        type: String,
        require: true,
        max: 50,
    },
    apellido: {
        type: String,
        require: true,
        max: 50,
    },
    puesto: {
        type: String,
        require: true,
        max: 100,
    },
    categoria: {
        type: String,
        require: true,
        max: 50,
    },
    shift:{
        type: Number,
        require: true,
        default: 5
    },
    schedule: {
        type: Number,
        require: true,
    },
    sector: {
        type: String,
        require: true,
    },
},
    { timestamps: true }
);
export const empModel = mongoose.model("employees", EmployeesSchema);
