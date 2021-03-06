import { ApiDailyWork } from '../api/dailyWorks.js';
import { parseStringToDate } from '../utils/formatDate.js';



export class ControllerDailyWork {

    constructor() {
        this.apiDailyWork = new ApiDailyWork();
    }

    convertBeginDateToDate = async (req, res) => {
        await this.apiDailyWork.convertBeginDateToDate();
        res.status(200).send('ok');
    }


    createDailyWork = async (req, res) => {
        try {
            const data = req.body;
            const dailyWork = await this.apiDailyWork.createDailyWork(data);
            res.status(200).send(dailyWork);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getDailyWork = async (req, res) => {
        try {
            const { date } = req.params;
            const resultado = await this.apiDailyWork.getDailyWork(date);
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getDailyWorkRoutine = async (req, res) => {
        try {
            const { routineScheduleId } = req.params;
            const resultado = await this.apiDailyWork.getDailyWorkRoutine(routineScheduleId);
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getDailyWorkSearchBy = async (req, res) => {
        try {
            const { value } = req.params;
            const resultado = await this.apiDailyWork.getDailyWorkSearchBy(value);
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getDailyWorkSearchAdvance = async (req, res) => {
        try {
            const dataToJSON = JSON.parse(req.query.params);
            const { dataForSearch } = dataToJSON;
            const resultado = await this.apiDailyWork.getDailyWorkSearchAdvance(dataForSearch);
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getDailyWorkDataForSearch = async (_req, res) => {
        try {
            const resultado = await this.apiDailyWork.getDailyWorkDataForSearch();
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }


    getDailyWorkForPlantShutdown = async (_req, res) => {
        try {
            const resultado = await this.apiDailyWork.getDailyWorkForPlantShutdown();
            return res.status(200).json(resultado);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    updateDailyWork = async (req, res) => {
        try {
            const { date } = req.params;
            const { updatedWork } = req.body;
            const dailyWork = await this.apiDailyWork.updateDailyWork(date, updatedWork);
            res.status(200).send(dailyWork);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    updateFromRoutineDetail = async (req, res) => {
        try {
            const { updatedWork } = req.body;
            //tuve que parsear la fecha porque viene en string y a la api le tiene que llegar si o si en date.
            const date = parseStringToDate(updatedWork.beginDate);
            const updateResp = await this.apiDailyWork.updateDailyWork(date, updatedWork);
            res.status(200).send(updateResp);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    updateBulkDailyWork = async (req, res) => {
        try {
            const { date } = req.params;
            const { newDailyWorks } = req.body;
            newDailyWorks.forEach(async (dailyWork) => await this.apiDailyWork.updateDailyWork(date, dailyWork));
            res.status(200).send(true);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }


    deleteDailyWork = async (req, res) => {
        try {
            const { id } = req.body.data;
            const dailyWork = await this.apiDailyWork.deleteDailyWork(id);
            res.status(200).send(dailyWork);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }


}