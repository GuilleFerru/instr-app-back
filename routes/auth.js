import express from "express";
import { usuarios } from '../models/User.js';
import { genSalt, hash, compare } from 'bcrypt';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('user auth')
})

router.post('/register', async (req, res) => {
    try {
        //pass encriptado
        const salt = await genSalt(10);
        const hashedPassword = await hash(req.body.password, salt);
        const newUser = await usuarios.insertMany({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        res.status(200).json(newUser)
    } catch (err) {
        res.status(500).json(err);

    }
})

router.post('/login', async (req, res) => {
    try {
        const user = await usuarios.findOne({ email: req.body.email });
        !user && res.status(404).json({ user: 'Usuario no encontrado' });

        const validPassword = await compare(req.body.password, user.password);
        !validPassword && res.status(400).json({ user: 'Contraseña incorrecta' });

        res.status(200).json(user)
    } catch (err) {
        res.status(500).json(err);

    }
})

export const authRoute = router;