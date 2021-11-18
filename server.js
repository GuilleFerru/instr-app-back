const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users.js");
const authRoute = require("./routes/auth");
const empRoute = require("./routes/employees");
const shiftRoute = require("./routes/shifts");

//servidor express
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.info(`Servidor listo en el puerto ${port}`);
});

app.on("error", (error) => {
    console.error(error);
});


dotenv.config();

try {
    mongoose.connect(process.env.MONGO_URL, () => {
        console.log('Connected to MongoDB');
    });
}
catch (err) {
    loggerError.error(`MongoDB: Error en conectar: ${err}`)
    throw err
}



app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))

app.use('/api/user', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/shift', shiftRoute)
app.use('/api/emp', empRoute)




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


