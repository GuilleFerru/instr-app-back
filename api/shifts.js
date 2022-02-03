import { DBMongoDao } from '../model/DAOs/DBMongoDao.js';

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

    constructor() {
        this.dbMongoDAO = new DBMongoDao();

    }

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

    checkShift = (year, shift) => {
        try {

            if (shift === 1) {

                if (this.flagOne === 0) {
                    this.dateOne = this.normalizeShiftOne(year);
                    this.flagOne = 1;
                }

                if (this.dateOne.getDay() === 1 && this.shiftOne[this.shiftOne.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftOne.push({
                            date: this.dateOne.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 1,
                            schedule: "N"
                        })
                        this.dateOne.setDate(this.dateOne.getDate() + 1)
                    }
                }
                if (this.dateOne.getDay() === 1 && this.shiftOne[this.shiftOne.length - 1].schedule === "N") {
                    for (let i = 1; i <= 2; i++) {
                        this.shiftOne.push({
                            date: this.dateOne.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 1,
                            schedule: "F"
                        })
                        this.dateOne.setDate(this.dateOne.getDate() + 1)
                    }
                }
                if (this.dateOne.getDay() === 3 && this.shiftOne[this.shiftOne.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftOne.push({
                            date: this.dateOne.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 1,
                            schedule: "T"
                        })
                        this.dateOne.setDate(this.dateOne.getDate() + 1)
                    }

                }
                if (this.dateOne.getDay() === 3 && this.shiftOne[this.shiftOne.length - 1].schedule === "T") {
                    this.shiftOne.push({
                        date: this.dateOne.toLocaleString("es-AR", { dateStyle: "short" }),
                        shift: 1,
                        schedule: "F"
                    })
                    this.dateOne.setDate(this.dateOne.getDate() + 1)

                }
                if (this.dateOne.getDay() === 4 && this.shiftOne[this.shiftOne.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftOne.push({
                            date: this.dateOne.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 1,
                            schedule: "M"
                        })
                        this.dateOne.setDate(this.dateOne.getDate() + 1)
                    }
                }
                if (this.dateOne.getDay() === 4 && this.shiftOne[this.shiftOne.length - 1].schedule === "M") {
                    for (let i = 1; i <= 4; i++) {
                        this.shiftOne.push({
                            date: this.dateOne.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 1,
                            schedule: "F"
                        })
                        this.dateOne.setDate(this.dateOne.getDate() + 1)
                    }
                }
            }

            if (shift === 2) {

                if (this.flagTwo === 0) {
                    this.dateTwo = this.normalizeShiftTwo(year);
                    this.flagTwo = 1;
                }

                if (this.dateTwo.getDay() === 3 && this.shiftTwo[this.shiftTwo.length - 1].schedule === "T") {
                    this.shiftTwo.push({
                        date: this.dateTwo.toLocaleString("es-AR", { dateStyle: "short" }),
                        shift: 2,
                        schedule: "F"
                    })
                    this.dateTwo.setDate(this.dateTwo.getDate() + 1)
                }

                if (this.dateTwo.getDay() === 4 && this.shiftTwo[this.shiftTwo.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftTwo.push({
                            date: this.dateTwo.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 2,
                            schedule: "M"
                        })
                        this.dateTwo.setDate(this.dateTwo.getDate() + 1)
                    }
                }

                if (this.dateTwo.getDay() === 4 && this.shiftTwo[this.shiftTwo.length - 1].schedule === "M") {
                    for (let i = 1; i <= 4; i++) {
                        this.shiftTwo.push({
                            date: this.dateTwo.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 2,
                            schedule: "F"
                        })
                        this.dateTwo.setDate(this.dateTwo.getDate() + 1)
                    }
                }

                if (this.dateTwo.getDay() === 1 && this.shiftTwo[this.shiftTwo.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftTwo.push({
                            date: this.dateTwo.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 2,
                            schedule: "N"
                        })
                        this.dateTwo.setDate(this.dateTwo.getDate() + 1)
                    }
                }

                if (this.dateTwo.getDay() === 1 && this.shiftTwo[this.shiftTwo.length - 1].schedule === "N") {
                    for (let i = 1; i <= 2; i++) {
                        this.shiftTwo.push({
                            date: this.dateTwo.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 2,
                            schedule: "F"
                        })
                        this.dateTwo.setDate(this.dateTwo.getDate() + 1)
                    }
                }

                if (this.dateTwo.getDay() === 3 && this.shiftTwo[this.shiftTwo.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftTwo.push({
                            date: this.dateTwo.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 2,
                            schedule: "T"
                        })
                        this.dateTwo.setDate(this.dateTwo.getDate() + 1)
                    }
                }
            }

            if (shift === 3) {

                if (this.flagThree === 0) {
                    this.dateThree = this.normalizeShiftThree(year);
                    this.flagThree = 1;
                }

                if (this.dateThree.getDay() === 1 && this.shiftThree[this.shiftThree.length - 1].schedule === "N") {
                    for (let i = 1; i <= 2; i++) {
                        this.shiftThree.push({
                            date: this.dateThree.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 3,
                            schedule: "F"
                        })
                        this.dateThree.setDate(this.dateThree.getDate() + 1)
                    }
                }

                if (this.dateThree.getDay() === 3 && this.shiftThree[this.shiftThree.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftThree.push({
                            date: this.dateThree.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 3,
                            schedule: "T"
                        })
                        this.dateThree.setDate(this.dateThree.getDate() + 1)
                    }
                }

                if (this.dateThree.getDay() === 3 && this.shiftThree[this.shiftThree.length - 1].schedule === "T") {
                    this.shiftThree.push({
                        date: this.dateThree.toLocaleString("es-AR", { dateStyle: "short" }),
                        shift: 3,
                        schedule: "F"
                    })
                    this.dateThree.setDate(this.dateThree.getDate() + 1)
                }

                if (this.dateThree.getDay() === 4 && this.shiftThree[this.shiftThree.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftThree.push({
                            date: this.dateThree.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 3,
                            schedule: "M"
                        })
                        this.dateThree.setDate(this.dateThree.getDate() + 1)
                    }
                }

                if (this.dateThree.getDay() === 4 && this.shiftThree[this.shiftThree.length - 1].schedule === "M") {
                    for (let i = 1; i <= 4; i++) {
                        this.shiftThree.push({
                            date: this.dateThree.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 3,
                            schedule: "F"
                        })
                        this.dateThree.setDate(this.dateThree.getDate() + 1)
                    }
                }

                if (this.dateThree.getDay() === 1 && this.shiftThree[this.shiftThree.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftThree.push({
                            date: this.dateThree.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 3,
                            schedule: "N"
                        })
                        this.dateThree.setDate(this.dateThree.getDate() + 1)
                    }
                }


            }

            if (shift === 4) {

                if (this.flagFour === 0) {
                    this.dateFour = this.normalizeShiftFour(year);
                    this.flagFour = 1;
                }

                if (this.dateFour.getDay() === 4 && this.shiftFour[this.shiftFour.length - 1].schedule === "M") {
                    for (let i = 1; i <= 4; i++) {
                        this.shiftFour.push({
                            date: this.dateFour.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 4,
                            schedule: "F"
                        })
                        this.dateFour.setDate(this.dateFour.getDate() + 1)
                    }
                }


                if (this.dateFour.getDay() === 1 && this.shiftFour[this.shiftFour.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftFour.push({
                            date: this.dateFour.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 4,
                            schedule: "N"
                        })
                        this.dateFour.setDate(this.dateFour.getDate() + 1)
                    }
                }

                
                if (this.dateFour.getDay() === 1 && this.shiftFour[this.shiftFour.length - 1].schedule === "N") {
                    for (let i = 1; i <= 2; i++) {
                        this.shiftFour.push({
                            date: this.dateFour.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 4,
                            schedule: "F"
                        })
                        this.dateFour.setDate(this.dateFour.getDate() + 1)
                    }
                }

                if (this.dateFour.getDay() === 3 && this.shiftFour[this.shiftFour.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftFour.push({
                            date: this.dateFour.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 4,
                            schedule: "T"
                        })
                        this.dateFour.setDate(this.dateFour.getDate() + 1)
                    }
                }

                if (this.dateFour.getDay() === 3 && this.shiftFour[this.shiftFour.length - 1].schedule === "T") {
                    this.shiftFour.push({
                        date: this.dateFour.toLocaleString("es-AR", { dateStyle: "short" }),
                        shift: 4,
                        schedule: "F"
                    })
                    this.dateFour.setDate(this.dateFour.getDate() + 1)
                }

                if (this.dateFour.getDay() === 4 && this.shiftFour[this.shiftFour.length - 1].schedule === "F") {
                    for (let i = 1; i <= 7; i++) {
                        this.shiftFour.push({
                            date: this.dateFour.toLocaleString("es-AR", { dateStyle: "short" }),
                            shift: 4,
                            schedule: "M"
                        })
                        this.dateFour.setDate(this.dateFour.getDate() + 1)
                    }
                }



     


            }

        } catch (error) {
            console.log(error)
        }
    }

    createShift = async (turno) => {
        try {
            const dt = new Date();
            const year = dt.getFullYear();
            const NUMBER_SHIFTS = 4;


            for (let shift = 1; shift <= NUMBER_SHIFTS; shift++) {
                for (let i = 1; i <= 2; i++) {
                    // const date = new Date(year, i - 1, 1);
                    this.checkShift(year, shift);
                }
            }

            console.log(this.shiftOne)
            console.log(this.shiftTwo)
            console.log(this.shiftThree)
            console.log(this.shiftFour)

            // const shift = await this.dbMongoDAO.createShift(turno, this.shiftOne);
            // return shift;
            return true
        } catch (err) {
            console.log(err);
        }
    }
}
// module.exports = ApiShift;