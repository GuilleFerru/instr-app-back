import { ApiManteinanceAction } from '../api/manteinanceActions.js';

export class ControllerManteinanceAction {

    constructor() {
        this.apiManteinanceAction = new ApiManteinanceAction();
    }

    createManteinanceAction = async (req, res) => {
        try {
            const manteinanceAction = req.body;
            const mantActResp = await this.apiManteinanceAction.createManteinanceAction(manteinanceAction);
            return res.status(200).json({ mantActResp });
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

}
