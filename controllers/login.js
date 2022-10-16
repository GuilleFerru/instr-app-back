import jwt from "jsonwebtoken";
import config from "../config.js";

export class ControllerLogin {

    login = async (req, res) => {
        try {
            const userForToken = {
                id: req.user._id,
                username: req.user.username,
            }
            const token = jwt.sign(userForToken, config.SECRET_KEY, { expiresIn: '7d' });
            const user = {
                username: req.user.username,
                userType: req.user.userType,
                name: req.user.name,
                lastname: req.user.lastname,
                legajo: req.user.legajo,
                sector: req.user.sector,
                token
            }
            if (user) {
                res.cookie('token', token).status(200).json(user);
            } else {
                return res.status(500).json(user);
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    failLogin = (_req, res) => {
        return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }



}