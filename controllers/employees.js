import { ApiEmployee } from '../api/employees.js';

export class ControllerEmployee {

    constructor() {
        this.apiEmployee = new ApiEmployee();
    }

    createEmployee = async (req, res) => {
        try {
            const { employee } = req.body;
            const empResp = await this.apiEmployee.createEmployee(employee);
            return res.status(200).json({empResp});
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    getForScheduleEmployees = async (_req, res) => {
        try {
            const empResp = await this.apiEmployee.getForScheduleEmployees();
            return res.status(200).json(empResp);
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }
}
