// import passport from "passport";
// import { userModel } from '../model/models/Users.js';
// import { Strategy as LocalStrategy } from 'passport-local';
// import bcrypt from 'bcrypt';




// const loginStrategyName = 'login';
// const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);




// passport.use(loginStrategyName, new LocalStrategy(
//     {
//         passReqToCallback: true
//     },
//     (_req, username, password, done) => {
//         console.log("_req", _req);
//         userModel.findOne({ username: username }, (err, user) => {
//             if (err) {
//                 return done(err);
//             }
//             if (!user) {
//                 return done(null, false, { message: 'User not found' });
//             }
//             if (!isValidPassword(user, password)) {
//                 return done(null, false, { message: 'Wrong password' });
//             }
//             return done(null, user);
//         });
//     }
// ));

// passport.serializeUser((user, done) => {
//     if (user) done(null, user._id);
// });

// passport.deserializeUser((user, done) => {
//     userModel.findById(user._id, (err, user) => {
//         done(err, user);
//     });
// })