import express from "express";
import { empleados } from '../model/models/Employees.js';


const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const newEmployee = await empleados.insertMany({
            legajo: req.body.legajo,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
        })
        res.status(200).json(newEmployee)
    } catch (err) {
        res.status(500).json(err);
    } finally {
        // await newEmployee.disconnect();
    }
})
export const empRoute = router;