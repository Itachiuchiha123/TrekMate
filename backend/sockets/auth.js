import { decodeToken } from "../middleware/verifyToken.js";

export const verifySocketAuth = (socket, next) => {
    const token = socket.handshake.query.token;
    const decoded = decodeToken(token);
    if (!decoded) {
        return next(new Error("Authorization error"));
    }

    socket.userId = decoded.userId;
    next();
};
