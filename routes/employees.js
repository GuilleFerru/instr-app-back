const router = require("express").Router();
const Employee = require('../models/Employees');

router.post('/register', async (req, res) => {
    try {
        const newEmployee = await new Employee({
            legajo: req.body.legajo,
            nombre: req.body.nombre,
            turno: req.body.turno,
            horario: req.body.horario,
            horasDiarias: req.body.horasDiarias
        })
        const employee = await newEmployee.save();
        res.status(200).json(employee)
    } catch (err) {
        res.status(500).json(err);

    }
})
module.exports = router;