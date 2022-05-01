// import passport from "passport";
// import passportJwt from "passport-jwt";
// import config from "../config.js";

// const ExtractJWT = passportJwt.ExtractJwt;
// const JWTStrategy = passportJwt.Strategy;

// passport.use(new JWTStrategy({
//     jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//     secretOrKey: config.SECRET_KEY,
// }, (token, done) => {
//     try {
//         console.log(token);
//         done(null, token);
//     } catch (error) {
//         done(error);
//     }
// }));

