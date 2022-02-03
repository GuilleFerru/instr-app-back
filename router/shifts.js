// import express from "express";
// import { loggerError, loggerInfo, loggerWarn } from "../utils/logger.js";
// import { shifts } from "../models/Shifts.js";

import express from 'express';
// const express = require('express');
// const ControllerShift = require('../controllers/ControllerShift.js');
import {ControllerShift} from '../controllers/shifts.js';


const router = express.Router();

export class RouterShift {
    constructor() {
        this.controllerShift = new ControllerShift();
    }

    start() {
        router.post('/create', this.controllerShift.createShift);
        return router;
    }

}

// module.exports = RouterShift;

// const router = express.Router();



// const shiftsArray = [];


// const normalizeShiftOne = (year) => {
//     const date = new Date(year, 0, 1);
//     while (date.getDay() !== 1) {
//         shiftsArray.push({
//             date: date.toLocaleString("es-AR", { dateStyle: "short" }),
//             shift: 1,
//             schedule: "F"
//         })
//         date.setDate(date.getDate() + 1)
//     }
//     return date;
// }

// const checkShift = (date, shift, initialDateShiftOne) => {

//     if (shift === 1) {
//         if (date.getDay() === 1 && shiftsArray[shiftsArray.length - 1].schedule === "F") {
//             for (let i = 1; i <= 7; i++) {
//                 shiftsArray.push({
//                     date: date.toLocaleString("es-AR", { dateStyle: "short" }),
//                     shift: 1,
//                     schedule: "N"
//                 })
//                 date.setDate(date.getDate() + 1)
//             }

//         }
//         if (date.getDay() === 1 && shiftsArray[shiftsArray.length - 1].schedule === "N") {

//             for (let i = 1; i <= 2; i++) {
//                 shiftsArray.push({
//                     date: date.toLocaleString("es-AR", { dateStyle: "short" }),
//                     shift: 1,
//                     schedule: "F"
//                 })
//                 date.setDate(date.getDate() + 1)

//             }

//         }
//         if (date.getDay() === 3 && shiftsArray[shiftsArray.length - 1].schedule === "F") {

//             for (let i = 1; i <= 7; i++) {
//                 shiftsArray.push({
//                     date: date.toLocaleString("es-AR", { dateStyle: "short" }),
//                     shift: 1,
//                     schedule: "T"
//                 })
//                 date.setDate(date.getDate() + 1)

//             }

//         }
//         if (date.getDay() === 3 && shiftsArray[shiftsArray.length - 1].schedule === "T") {
//             shiftsArray.push({
//                 date: date.toLocaleString("es-AR", { dateStyle: "short" }),
//                 shift: 1,
//                 schedule: "F"
//             })
//             date.setDate(date.getDate() + 1)

//         }
//         if (date.getDay() === 4 && shiftsArray[shiftsArray.length - 1].schedule === "F") {
//             for (let i = 1; i <= 7; i++) {
//                 shiftsArray.push({
//                     date: date.toLocaleString("es-AR", { dateStyle: "short" }),
//                     shift: 1,
//                     schedule: "M"
//                 })
//                 date.setDate(date.getDate() + 1)

//             }

//         }

//         if (date.getDay() === 4 && shiftsArray[shiftsArray.length - 1].schedule === "M") {
//             for (let i = 1; i <= 4; i++) {
//                 shiftsArray.push({
//                     date: date.toLocaleString("es-AR", { dateStyle: "short" }),
//                     shift: 1,
//                     schedule: "F"
//                 })
//                 date.setDate(date.getDate() + 1)

//             }
//         }

//     }
// }


// router.post("/register", async (req, res) => {
//     try {
//         const dt = new Date();
//         const year = dt.getFullYear();
//         const NUMBER_SHIFTS = 4;
//         const date = normalizeShiftOne(year);

//         for (let shift = 1; shift <= NUMBER_SHIFTS; shift++) {
//             for (let i = 1; i <= 130; i++) {
//                 // const date = new Date(year, i - 1, 1);
//                 checkShift(date, shift);
//             }
//         }

//         const newShift = await shifts.insertMany({
//             turno: req.body.turno,
//             shift: shiftsArray,
//         });

//         // const shift = await newShift.save();
//         res.status(200).json(newShift);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });

// export const shiftRoute = router;

