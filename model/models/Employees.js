import mongoose from "mongoose";

const EmployeesSchema = new mongoose.Schema({
    legajo: {
        type: String,
        require: true,
        min: 3,
        max: 20,
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
    }
},
    { timestamps: true }
);
export const empleados = mongoose.model("Employees", EmployeesSchema);
