

export class ControllerLogin {

    login = async (req, res) => {
        try {
            const user = {
                username: req.user.username,
                legajo: req.user.legajo,
                sector: req.user.sector,
                isAdmin: req.user.isAdmin
            }
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(500).json(user);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }



}