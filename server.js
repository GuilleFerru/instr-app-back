import express, {json} from 'express';
import mongoose from "mongoose";
import { config } from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
// import {userRoute} from "./router/users.js.js";
// import {authRoute} from "./router/auth.js.js";
// import {empRoute} from "./router/employees.js";


const app = express();
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.info(`Servidor listo en el puerto ${port}`);
});

app.on("error", (error) => {
    console.error(error);
});

config();

app.use(json());
app.use(express.urlencoded({ extended: true }));

try {
    mongoose.connect(process.env.MONGO_URL, () => {
        console.log('Connected to MongoDB');
    });
}
catch (err) {
    loggerError.error(`MongoDB: Error en conectar: ${err}`)
    throw err
}


//middleware
app.use(json());
app.use(helmet());
app.use(morgan("common"));

import {RouterShift} from "./router/shifts.js";
// const RouterShift = require('./router/shifts.js');
const routerShift = new RouterShift();

// app.use('/api/user', userRoute)
// app.use('/api/auth', authRoute)
app.use('/api/shift', routerShift.start())
// app.use('/api/emp', empRoute)




app.get('/', (req, res) => {
    res.send('Home Page')
})





// const io = new SocketIO.Server(server)
// const empDailyScheduleData = [];


// /* Socket para datos de personal */

// io.on('connection', socket => {
//     socket.emit('empDailyScheduleData', empDailyScheduleData);
// });



// /*  LECTURA DEL ARCHIVO DEL PERONAL POR DIA    */


// const readEmpDailySchedule = () => {
//     fs.readFile('empDailySchedule.txt', "UTF-8", (error, content) => {
//         if (error) {
//             console.error("Hubo un error con fs.readFile!");
//         } else {
//             const contentJSON = JSON.parse(content);
//             contentJSON.forEach(empDailyData => {
//                 empDailyScheduleData.push(empDailyData)
//             });
//         }
//     })
// }


