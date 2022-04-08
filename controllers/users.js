export class ControllerUser {
    createUser = async (_req, res) => {
        try {
            // console.log(req.body);
            const created = true
            if (created) {
                return res.status(200).json(created);
            } else {
                return res.status(500).json(created);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    failRegister = async (_req, res) => {
        try {
            console.log('fail')
            const fail = true
            if (fail) {
                return res.status(200).json(fail);
            } else {
                return res.status(500).json(fail);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }



}