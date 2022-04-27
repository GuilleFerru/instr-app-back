// import { v4 as uuid } from 'uuid';
import { ApiSchedule } from './api/schedules.js';
import { ApiDailyWork } from './api/dailyWorks.js';
// import { userExtractorForSocket } from './utils/userExtractor.js';
import { formatDate } from './utils/formatDate.js';
import { loggerError, loggerInfo } from "./utils/logger.js";


const apiSchedule = new ApiSchedule();
const apiDailyWork = new ApiDailyWork();
// const controllerSchedule = new ControllerSchedule();

export default (io) => {

    io.on("connection", async (socket) => {
        loggerInfo.info(`Socket ${socket.id} connected`);

        const sockets = await io.fetchSockets()

        // const req = { headers: { authorization: sockets[0].handshake.auth.token }, user: {} };
        
        // const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);



        // // console.log(wrap(userExtractor(req), ''))
        // io.use(wrap(userExtractorForSocket(req)))

        // io.use((socket, next) => {
        //     console.log(socket.request.user)
            
        //     if (socket.request.user) {
        //         next();
        //     } else {
        //         console.log('No user found');
        //         next(new Error('unauthorized'))
        //     }
        // });


        console.log('List of connected sockets:')
        sockets.forEach(socket => {
            console.log(socket.id)
        });

        // SCHEDULES
        socket.on("get_schedule", (date) => apiSchedule.handleSocket({ date, socket, action: "get_schedule" }));
        socket.on("schedule_join_room", (id) => {
            socket.join(id)
            loggerInfo.info(`Socket ${socket.id} joined Schedules room ${id}`);
            loggerInfo.info(io.sockets.adapter.rooms.get(id));
        })
        socket.on("schedule_leave_room", (id) => {
            socket.leave(id)
            socket.to(id).emit("schedule_leave_room", id);
            loggerInfo.info(`Socket ${socket.id} left Schedules room ${id}`);
        })
        socket.on("update_schedule", (date, scheduleData, roomId) => apiSchedule.handleSocket({ date, socket, action: "update_schedule", scheduleData, roomId }));
        socket.on("update_schedule_columns", (date, scheduleData, roomId) => apiSchedule.handleSocket({ date, socket, action: "update_schedule_columns", scheduleData, roomId, io }));

        // DAILY WORKS
        socket.on("get_daily_works", (date) => apiDailyWork.handleSocket({ date, socket, action: "get_daily_works" }));
        socket.on("create_daily_work", (dailyWorkData, roomId) => apiDailyWork.handleSocket({ socket, action: "create_daily_work", dailyWorkData, roomId: formatDate(roomId) }));
        socket.on("daily_works_join_room", (date) => {
            const id = formatDate(date);
            socket.join(id)
            loggerInfo.info(`Socket ${socket.id} joined Daily Works room ${id}`);
            loggerInfo.info(io.sockets.adapter.rooms.get(id));
        })
        socket.on("daily_works_leave_room", (date) => {
            const id = formatDate(date);
            socket.leave(id)
            socket.to(id).emit("daily_works_leave_room", id);
            loggerInfo.info(`Socket ${socket.id} left Daily Works room ${id}`);
        })
        socket.on("update_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "update_daily_work", dailyWorkData, roomId: formatDate(roomId) }));
        socket.on("bulk_update_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "bulk_update_daily_work", dailyWorkData, roomId: formatDate(roomId) }));
        socket.on("delete_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "delete_daily_work", dailyWorkData, roomId: formatDate(roomId), io }));




        socket.on("disconnect", () => {
            loggerInfo.info(`Socket ${socket.id} disconnected`);
        });
    });
}