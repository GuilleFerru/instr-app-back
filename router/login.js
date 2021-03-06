import express from 'express';
import { ControllerLogin } from '../controllers/login.js';
import { userModel } from '../model/models/Users.js';
import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';


const loginStrategyName = 'login';

const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);


// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//     jsonWebTokenOptions: {
//         ignoreExpiration: false
//     },
//     secretOrKey: config.SECRET_KEY,
//     algoithms: ['HS256'],
// }, (jwtPayload, done) => {
//     userModel.findOne({ _id: jwtPayload.id }, (err, user) => {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//         }
//     });
// }))

// const wrapMiddlewareForSocketIo = middleware => (socket, next) => middleware(socket.request, {}, next);
// io.use(wrapMiddlewareForSocketIo(passport.initialize()));
// io.use(wrapMiddlewareForSocketIo(passport.authenticate(['jwt'])));


passport.use(
    loginStrategyName,
    new LocalStrategy(
        {
            passReqToCallback: true
        },
        (_req, username, password, done) => {
            userModel.findOne({ username: username }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                if (!isValidPassword(user, password)) {
                    return done(null, false, { message: 'Wrong password' });
                }
                return done(null, user);
            });
        }
    ));

passport.serializeUser((user, done) => {
    if (user) done(null, user._id);
});

passport.deserializeUser((user, done) => {
    userModel.findById(user._id, (err, user) => {
        done(err, user);
    });
})

const router = express.Router();

export class RouterLogin {
    constructor() {
        this.controllerLogin = new ControllerLogin();
    }

    start() {
        router.post('/login', passport.authenticate(loginStrategyName, { failureRedirect: '/api/faillogin' }), this.controllerLogin.login);
        router.get('/faillogin', this.controllerLogin.failLogin);
        return router;
    }

}