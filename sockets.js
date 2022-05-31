import { ApiSchedule } from './api/schedules.js';
import { ApiDailyWork } from './api/dailyWorks.js';
import { ApiRoutine } from './api/routines.js';
import { ApiPlantShutdown } from './api/plantShutdowns.js';
import { ApiPlantShutdownWork } from './api/plantShutdownWorks.js';
import { formatDate } from './utils/formatDate.js';
import { loggerInfo } from "./utils/logger.js";

const apiSchedule = new ApiSchedule();
const apiDailyWork = new ApiDailyWork();
const apiRoutine = new ApiRoutine();
const apiPlantShutdown = new ApiPlantShutdown();
const apiPlantShutdownWork = new ApiPlantShutdownWork();


export default (io) => {

    io.on("connection", async (socket) => {
        loggerInfo.info(`Socket ${socket.id} connected`);

        const sockets = await io.fetchSockets();

        // console.log('List of connected sockets:')
        // sockets.forEach(socket => {
        //     console.log(socket.id)
        // });

        // SCHEDULES
        socket.on("get_schedule", (date) => apiSchedule.handleSocket({ date, socket, action: "get_schedule" }));
        socket.on("schedule_join_room", (id) => {
            socket.join(id)
            // loggerInfo.info(`Socket ${socket.id} joined Schedules room ${id}`);
            // loggerInfo.info(io.sockets.adapter.rooms.get(id));
        })
        socket.on("schedule_leave_room", (id) => {
            socket.leave(id)
            socket.to(id).emit("schedule_leave_room", id);
            // loggerInfo.info(`Socket ${socket.id} left Schedules room ${id}`);
        })
        socket.on("update_schedule", (date, scheduleData, roomId) => apiSchedule.handleSocket({ date, socket, action: "update_schedule", scheduleData, roomId }));
        socket.on("update_schedule_columns", (date, scheduleData, roomId) => apiSchedule.handleSocket({ date, socket, action: "update_schedule_columns", scheduleData, roomId, io }));
        socket.on("delete_schedule", (date, scheduleData, roomId) => apiSchedule.handleSocket({ date, socket, action: "delete_schedule", scheduleData, roomId: formatDate(roomId), io }));

        // DAILY WORKS
        socket.on("get_daily_works", (date) => apiDailyWork.handleSocket({ date, socket, action: "get_daily_works" }));
        socket.on("get_daily_works_for_plant_shutdown", () => apiDailyWork.handleSocket({ socket, action: "get_daily_works_for_plant_shutdown" }));
        socket.on("create_daily_work", (dailyWorkData, roomId) => apiDailyWork.handleSocket({ socket, action: "create_daily_work", dailyWorkData, roomId: formatDate(roomId), io }));
        socket.on("daily_works_join_room", (date) => {
            const id = formatDate(date);
            socket.join(id)
            // loggerInfo.info(`Socket ${socket.id} joined Daily Works room ${id}`);
            // loggerInfo.info(io.sockets.adapter.rooms.get(id));
        })
        socket.on("daily_works_leave_room", (date) => {
            const id = formatDate(date);
            socket.leave(id)
            socket.to(id).emit("daily_works_leave_room", id);
            // loggerInfo.info(`Socket ${socket.id} left Daily Works room ${id}`);
        })
        socket.on("update_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "update_daily_work", dailyWorkData, roomId: formatDate(roomId), io }));
        socket.on("bulk_update_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "bulk_update_daily_work", dailyWorkData, roomId: formatDate(roomId), io }));
        socket.on("delete_daily_work", (date, dailyWorkData, roomId) => apiDailyWork.handleSocket({ date, socket, action: "delete_daily_work", dailyWorkData, roomId: formatDate(roomId), io }));


        //ROUTINES
        socket.on("get_qtyOverDueRoutines", () => apiRoutine.handleSocket({ socket, action: "get_qtyOverDueRoutines", io }));

        //PLANTSHUTDOWNS
        socket.on("get_plant_shutdowns", (date) => apiPlantShutdown.handleSocket({ date, socket, action: "get_plant_shutdowns" }));
        socket.on("create_plant_shutdown", (plantShutdownData) => apiPlantShutdown.handleSocket({ socket, action: "create_plant_shutdown", plantShutdownData, io }));
        socket.on("update_plant_shutdown", (date, plantShutdownData) => apiPlantShutdown.handleSocket({ date, socket, action: "update_plant_shutdown", plantShutdownData, io }));
        socket.on("delete_plant_shutdown", (plantShutdownData) => apiPlantShutdown.handleSocket({ socket, action: "delete_plant_shutdown", plantShutdownData, io }));
        socket.on("create_plant_shutdown_work_from_work_to_do", (plantShutdownWorkData) => apiPlantShutdownWork.handleSocket({ socket, action: "create_plant_shutdown_work_from_work_to_do", plantShutdownWorkData, io }));
        socket.on("bulk_create_plant_shutdown_work_from_work_to_do", (plantShutdownWorkData) => apiPlantShutdownWork.handleSocket({ socket, action: "bulk_create_plant_shutdown_work_from_work_to_do", plantShutdownWorkData, io }));
        socket.on("get_plant_shutdown_works", (plantShutdownWorkData) => apiPlantShutdownWork.handleSocket({ socket, action: "get_plant_shutdown_works", plantShutdownWorkData }));
        socket.on("create_plant_shutdown_work", (plantShutdownWorkData) => apiPlantShutdownWork.handleSocket({ socket, action: "create_plant_shutdown_work", plantShutdownWorkData, io }));
        socket.on("update_plant_shutdown_work", (plantShutdownWorkData) => apiPlantShutdownWork.handleSocket({ socket, action: "update_plant_shutdown_work", plantShutdownWorkData, io }));
        socket.on("delete_plant_shutdown_work", (plantShutdownWorkData) => apiPlantShutdownWork.handleSocket({ socket, action: "delete_plant_shutdown_work", plantShutdownWorkData, io }));



        socket.on("disconnect", () => {
            loggerInfo.info(`Socket ${socket.id} disconnected`);
        });
    });
}
