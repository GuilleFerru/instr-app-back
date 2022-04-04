import express from 'express';
import { userModel } from '../model/models/Users.js';
import { ControllerUser } from '../controllers/users.js';
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';


const signUpStrategyName = "signup";

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

passport.use(signUpStrategyName, new LocalStrategy(
    {
        passReqToCallback: true
    },
    (req, username, password, done) => {
        userModel.findOne({ username: username }, (err, user) => {
            if (err) {
                return done(err);
            }
            if (user) {
                return done(null, false, { message: 'User already exists' });
            }
            const newUser = new userModel();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.legajo = req.body.legajo;
            newUser.sector = req.body.sector;
            newUser.isAdmin = req.body.isAdmin;
            
            newUser.save((err) => {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        });
    }));


passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((user, done) => {
    userModel.findById(user._id, (err, user) => {
        done(err, user);
    });
})

const router = express.Router();

export class RouterUser {

    constructor() {
        this.controllerUser = new ControllerUser();
    }

    start() {
        router.post('/register', passport.authenticate(signUpStrategyName, { failureRedirect: '/failsignup' }), this.controllerUser.createUser);
        return router;
    }

}