import { Server } from "socket.io";
import { verifySocketAuth } from "./auth.js";
import { registerEventChatHandler } from "./eventChatHandler.js";
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

        socket.emit("joinedEvents", {
            events: events.map((event) => event._id),
        });

        registerEventChatHandler(io, socket);

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
