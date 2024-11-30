import { Server } from "socket.io";
import { verifySocketAuth } from "./auth.js";
import { registerEventChatHandler } from "./eventChatHandler.js";
import Event from "../models/event.model.js";

export default function socket(httpServer) {
    const io = new Server(httpServer);

    const userSockets = {};

    // Handle socket authorization
    io.use(verifySocketAuth);

    io.on("connection", async (socket) => {
        if (!userSockets[socket.userId]) {
            userSockets[socket.userId] = new Set();
        }

        userSockets[socket.userId].add(socket.id);

        // Make user socket join their rooms
        const events = await Event.find({
            "members.user": socket.userId,
        }).lean();

        events.forEach((event) => {
            socket.join(event._id.toString());
        });

        socket.emit("user:events", {
            events: events.map((event) => event._id),
        });

        registerEventChatHandler(io, socket);

        socket.on("disconnect", () => {
            if (userSockets[socket.userId]) {
                userSockets[socket.userId].delete(socket.id);
                if (userSockets[socket.userId].size === 0) {
                    delete userSockets[socket.userId];
                }
            }
        });
    });

    io.getUserSockets = (userId) => {
        return Array.from(userSockets[userId]);
    };

    io.userJoinRoom = (userId, room) => {
        io.in(io.getUserSockets(userId)).socketsJoin(room);
    };

    return io;
}
