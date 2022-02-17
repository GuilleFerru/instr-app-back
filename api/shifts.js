import { dao } from '../server.js'
import { loggerError, loggerInfo, loggerWarn } from '../utils/logger.js';


export class ApiShift {

    shiftOne = [];
    flagOne = 0;
    dateOne;

    shiftTwo = [];
    flagTwo = 0;
    dateTwo;

    shiftThree = [];
    flagThree = 0;
    dateThree;

    shiftFour = [];
    flagFour = 0;
    dateFour;


    shiftFive = [];
    flagFive = 0;
    dateFive;

    shiftSix = [];
    flagSix = 0;
    dateSix;

    normalizeShiftOne = (year) => {
        const date = new Date(year, 0, 1);
        while (date.getDay() !== 1) {
            this.shiftOne.push({
                date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                shift: 1,
                schedule: "F"
            })
            date.setDate(date.getDate() + 1)
        }
        return date;
    }

    normalizeShiftTwo = (year) => {
        const date = new Date(year, 0, 1);
        for (let i = 1; i <= 4; i++) {
            this.shiftTwo.push({
                date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                shift: 2,
                schedule: "T"
            })
            date.setDate(date.getDate() + 1)
        }
        return date;
    }

    normalizeShiftThree = (year) => {
        const date = new Date(year, 0, 1);
        for (let i = 1; i <= 2; i++) {
            this.shiftThree.push({
                date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                shift: 3,
                schedule: "N"
            })
            date.setDate(date.getDate() + 1)
        }
        return date;
    }

    normalizeShiftFour = (year) => {
        const date = new Date(year, 0, 1);
        for (let i = 1; i <= 5; i++) {
            this.shiftFour.push({
                date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                shift: 4,
                schedule: "M"
            })
            date.setDate(date.getDate() + 1)
        }
        return date;
    }

    normalizeShiftFive = (year) => {
        const date = new Date(year, 0, 1);
        for (let i = 1; i <= 2; i++) {
            this.shiftFive.push({
                date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                shift: 5,
                schedule: "F"
            })
            date.setDate(date.getDate() + 1)
        }
        return date;
    }

    normalizeShiftSix = (year) => {
        const date = new Date(year, 0, 1);
        for (let i = 1; i <= 2; i++) {
            this.shiftSix.push({
                date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                shift: 6,
                schedule: "F"
            })
            date.setDate(date.getDate() + 1)
        }
        return date;
    }

    shiftStartNightAfterRest = (date, shift, shiftNumber) => {
        if (date.getDay() === 1 && shift[shift.length - 1].schedule === "F") {
            for (let i = 1; i <= 7; i++) {
                shift.push({
                    date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                    shift: shiftNumber,
                    schedule: "N"
                })
                date.setDate(date.getDate() + 1)
            }
        }

    }

    shiftStartRestAfterNight = (date, shift, shiftNumber) => {
        if (date.getDay() === 1 && shift[shift.length - 1].schedule === "N") {
            for (let i = 1; i <= 2; i++) {
                shift.push({
                    date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                    shift: shiftNumber,
                    schedule: "F"
                })
                date.setDate(date.getDate() + 1)
            }
        }
    }

    shiftStartAfternoonAfterRest = (date, shift, shiftNumber) => {
        if (date.getDay() === 3 && shift[shift.length - 1].schedule === "F") {
            for (let i = 1; i <= 7; i++) {
                shift.push({
                    date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                    shift: shiftNumber,
                    schedule: "T"
                })
                date.setDate(date.getDate() + 1)
            }
        }
    }

    shiftStartRestAfterAfternoon = (date, shift, shiftNumber) => {
        if (date.getDay() === 3 && shift[shift.length - 1].schedule === "T") {
            shift.push({
                date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                shift: shiftNumber,
                schedule: "F"
            })
            date.setDate(date.getDate() + 1)
        }
    }

    shiftStartMorningAfterRest = (date, shift, shiftNumber) => {
        if (date.getDay() === 4 && shift[shift.length - 1].schedule === "F") {
            for (let i = 1; i <= 7; i++) {
                shift.push({
                    date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                    shift: shiftNumber,
                    schedule: "M"
                })
                date.setDate(date.getDate() + 1)
            }
        }
    }

    shiftStartRestAfterMorning = (date, shift, shiftNumber) => {
        if (date.getDay() === 4 && shift[shift.length - 1].schedule === "M") {
            for (let i = 1; i <= 4; i++) {
                shift.push({
                    date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                    shift: shiftNumber,
                    schedule: "F"
                })
                date.setDate(date.getDate() + 1)
            }
        }
    }

    shiftStartDailyAfterRest = (date, shift, shiftNumber, schedule) => {
        if (date.getDay() === 1 && shift[shift.length - 1].schedule === "F") {
            for (let i = 1; i <= 5; i++) {
                shift.push({
                    date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                    shift: shiftNumber,
                    schedule: schedule
                })
                date.setDate(date.getDate() + 1);
            }
        }
    }

    shiftStartRestAfterDaily = (date, shift, shiftNumber, schedule) => {
        if (date.getDay() === 6 && shift[shift.length - 1].schedule === schedule) {
            for (let i = 1; i <= 2; i++) {
                shift.push({
                    date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                    shift: shiftNumber,
                    schedule: "F"
                })
                date.setDate(date.getDate() + 1)

            }
        }
    }

    checkShift = (year, shift) => {
        try {

            if (shift === 1) {

                if (this.flagOne === 0) {
                    this.dateOne = this.normalizeShiftOne(year);
                    this.flagOne = 1;
                }

                this.shiftStartNightAfterRest(this.dateOne, this.shiftOne, 1);
                this.shiftStartRestAfterNight(this.dateOne, this.shiftOne, 1);
                this.shiftStartAfternoonAfterRest(this.dateOne, this.shiftOne, 1);
                this.shiftStartRestAfterAfternoon(this.dateOne, this.shiftOne, 1);
                this.shiftStartMorningAfterRest(this.dateOne, this.shiftOne, 1);
                this.shiftStartRestAfterMorning(this.dateOne, this.shiftOne, 1);
            }

            if (shift === 2) {

                if (this.flagTwo === 0) {
                    this.dateTwo = this.normalizeShiftTwo(year);
                    this.flagTwo = 1;
                }

                this.shiftStartRestAfterAfternoon(this.dateTwo, this.shiftTwo, 2);
                this.shiftStartMorningAfterRest(this.dateTwo, this.shiftTwo, 2);
                this.shiftStartRestAfterMorning(this.dateTwo, this.shiftTwo, 2);
                this.shiftStartNightAfterRest(this.dateTwo, this.shiftTwo, 2);
                this.shiftStartRestAfterNight(this.dateTwo, this.shiftTwo, 2);
                this.shiftStartAfternoonAfterRest(this.dateTwo, this.shiftTwo, 2);
            }

            if (shift === 3) {

                if (this.flagThree === 0) {
                    this.dateThree = this.normalizeShiftThree(year);
                    this.flagThree = 1;
                }

                this.shiftStartRestAfterNight(this.dateThree, this.shiftThree, 3);
                this.shiftStartAfternoonAfterRest(this.dateThree, this.shiftThree, 3);
                this.shiftStartRestAfterAfternoon(this.dateThree, this.shiftThree, 3);
                this.shiftStartMorningAfterRest(this.dateThree, this.shiftThree, 3);
                this.shiftStartRestAfterMorning(this.dateThree, this.shiftThree, 3);
                this.shiftStartNightAfterRest(this.dateThree, this.shiftThree, 3);
            }

            if (shift === 4) {

                if (this.flagFour === 0) {
                    this.dateFour = this.normalizeShiftFour(year);
                    this.flagFour = 1;
                }

                this.shiftStartRestAfterMorning(this.dateFour, this.shiftFour, 4);
                this.shiftStartNightAfterRest(this.dateFour, this.shiftFour, 4);
                this.shiftStartRestAfterNight(this.dateFour, this.shiftFour, 4);
                this.shiftStartAfternoonAfterRest(this.dateFour, this.shiftFour, 4);
                this.shiftStartRestAfterAfternoon(this.dateFour, this.shiftFour, 4);
                this.shiftStartMorningAfterRest(this.dateFour, this.shiftFour, 4);
            }

            if (shift === 5) {
                if (this.flagFive === 0) {
                    this.dateFive = this.normalizeShiftFive(year);
                    this.flagFive = 1;
                }
                for (let i = 1; i <= this.shiftOne.length; i++) {
                    this.shiftStartDailyAfterRest(this.dateFive, this.shiftFive, 5, 'D');
                    this.shiftStartRestAfterDaily(this.dateFive, this.shiftFive, 5, 'D');
                }
            }

            if (shift === 6) {
                if (this.flagSix === 0) {
                    this.dateSix = this.normalizeShiftSix(year);
                    this.flagSix = 1;
                }
                for (let i = 1; i <= this.shiftOne.length; i++) {               
                    this.shiftStartDailyAfterRest(this.dateSix, this.shiftSix, 6, 'D1');
                    this.shiftStartRestAfterDaily(this.dateSix, this.shiftSix, 6, 'D1');
                }
            }

        } catch (error) {
            loggerError.error(error);
        }
    }


    createShift = async (rounds) => {
        try {
            const dropShift = await dao.dropShiftCollection();

            if (dropShift) {
                // siempre va a empezar del 01-01-2022, por body le voy a mandar la cantidad de vueltas que quiero que haga el ciclo
                const year = 2022;
                const NUMBER_SHIFTS = 6;

                for (let shift = 1; shift <= NUMBER_SHIFTS; shift++) {
                    for (let i = 1; i <= rounds; i++) {
                        this.checkShift(year, shift);
                    }
                }

                // uso el shiftOne para terminar cada vuelta, el resto de los turnos incluidos el diurno se van a ajustar a las vueltas del turno uno.
                const date = new Date(year, 0, 1);
                for (let i = 1; i <= this.shiftOne.length; i++) {
                    const shifts = [
                        {
                            date: date.toLocaleString("es-AR", { dateStyle: "short" }),
                            shifts: [
                                {
                                    shift: this.shiftOne[i - 1].shift,
                                    schedule: this.shiftOne[i - 1].schedule
                                },
                                {
                                    shift: this.shiftTwo[i - 1].shift,
                                    schedule: this.shiftTwo[i - 1].schedule
                                },
                                {
                                    shift: this.shiftThree[i - 1].shift,
                                    schedule: this.shiftThree[i - 1].schedule
                                },
                                {
                                    shift: this.shiftFour[i - 1].shift,
                                    schedule: this.shiftFour[i - 1].schedule
                                },
                                {
                                    shift: this.shiftFive[i - 1].shift,
                                    schedule: this.shiftFive[i - 1].schedule
                                },
                                {
                                    shift: this.shiftSix[i - 1].shift,
                                    schedule: this.shiftSix[i - 1].schedule
                                }
                            ]
                        }
                    ];
                    date.setDate(date.getDate() + 1)
                    await dao.createShift(shifts);
                }
            }
        } catch (err) {
            loggerError.error(err);
        } finally {
            loggerWarn.warn("Cantidad de vueltas del turno: " + rounds, " se creo el día " + new Date().toLocaleString("es-AR", { dateStyle: "short" }));
            return true;
        }
    }

    getShift = async (date) => {
        try {
            const shifts = await dao.getShift(date);
            return shifts;
        } catch (err) {
            loggerError.error(err);
        }
    }
}
