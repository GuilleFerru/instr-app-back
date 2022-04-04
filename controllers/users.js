// import { ApiUser } from '../api/users.js';

export class ControllerUser {

    // constructor() {
    //     this.apiUser = new ApiUser();
    // }
    createUser = async (req, res) => {
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



}