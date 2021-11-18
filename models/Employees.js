const mongoose = require("mongoose");

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
    turno: {
        type: String,
        require: true,
        max: 50,
    },
    horario: {
        type: String,
        require: true,
    },
    horasDiarias: {
        type: String,
        require: true,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Employees", EmployeesSchema);