import jwt from "jsonwebtoken";
import config from "../config.js";

export const userExtractor = (req, res, next) => {
    let token = req.headers.authorization;
    if (token && token.toLowerCase().startsWith("bearer")) {
        token = token.slice(7, token.length);
    }
    if (token) {
        jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
            
            if (err) {
                return res.status(401).json({ message: "Token faltante o invalido" });
            }
            req.user = decoded;
            next();
        });
    } else {
        return res.status(401).json({ message: "Token faltante o invalido" });
    }

}