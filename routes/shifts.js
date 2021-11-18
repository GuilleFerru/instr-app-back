const router = require("express").Router();
const Shift = require('../models/Shifts');


router.post('/register', async (req, res) => {
    try {
        const newShift = await new Shift({
            nombre: req.body.nombre,
            mes: req.body.mes,
            dia: req.body.dia,
            horario: req.body.horario,
        })
        const shift = await newShift.save();
        res.status(200).json(shift)
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;