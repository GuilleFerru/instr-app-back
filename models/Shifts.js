const mongoose = require("mongoose");

const ShiftsSchema = new mongoose.Schema({
    nombre: {
        type: String,
        require: true,
    },
    mes: {
        type: Array,
        require: true,
        
    },
    dia: {
        type: String,
        require: true,
    },
    horario: {
        type: String,
        require: true,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Shifts", ShiftsSchema);