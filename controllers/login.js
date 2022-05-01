
import jwt from "jsonwebtoken";
import config from "../config.js";
// import { app } from "../server.js";
// import passport from 'passport';
// import cookieParser from "cookie-parser";
// import session from "express-session";


// app.use(cookieParser());

// app.use(session({
//     secret: config.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 * 7
//     }
// }));


// app.use(passport.session());

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
                name: req.user.name,
                lastname: req.user.lastname,
                legajo: req.user.legajo,
                sector: req.user.sector,
                token
            }
            if (user) {
                // res.cookie('token', token)
                res.cookie('token', token).status(200).json(user);
            } else {
                return res.status(500).json(user);
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    }

    failLogin = (req, res) => {
        return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }



}