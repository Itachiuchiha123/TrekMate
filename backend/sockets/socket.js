import { Server } from "socket.io";
import { verifySocketAuth } from "./auth.js";
import { registerHelloHandler } from "./helloHandler.js";
import Event from "../models/event.model.js";

export default function socket(httpServer) {
    const io = new Server(httpServer);

    const userMap = {};

    // Handle socket authorization
    io.use(verifySocketAuth);

    io.on("connection", async (socket) => {
        userMap[socket.userId] = socket.id;

        // Make user socket join their rooms
        const events = await Event.find({
            "members.user": socket.userId,
        }).lean();

        events.forEach((event) => {
            socket.join(event._id.toString());
        });

        registerHelloHandler(io, socket);

        socket.on("disconnect", () => {
            if (userMap[socket.userId]) {
                delete userMap[socket.userId];
            }
            console.log("Bye byeeee");
        });
    });

    io.getSocketId = (userId) => {
        return userMap[userId];
    };
    io.userJoinRoom = (userId, room) => {
        io.in(userMap[userId]).socketsJoin(room);
    };

    return io;
}
