import { Server } from "socket.io";
import { verifySocketAuth } from "./auth.js";
import { registerHelloHandler } from "./helloHandler.js";

export default function socket(httpServer) {
    const io = new Server(httpServer);

    // Handle socket authorization
    io.use(verifySocketAuth);

    io.on("connection", (socket) => {
        registerHelloHandler(io, socket);

        socket.on("disconnect", () => {
            console.log("Bye byeeee");
        });
    });

    return io;
}
