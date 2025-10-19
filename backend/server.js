import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import socket from "./sockets/socket.js";
import upload from "./middleware/upload.js";
import uploadrouter from "./routes/uploadRoute.js";
import userRouter from "./routes/user.route.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socket(server);

const allowedOrigins = ["http://127.0.0.1:5173", "http://localhost:5173", "https://trekmate-np.vercel.app", "http://localhost:3000"];

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(
    cors({
        origin: (origin, callback) => {

            if (!origin || allowedOrigins.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api", uploadrouter);
app.use("/api/user", userRouter);


// 404 error handler
app.use((req, res, next) => {
    next({ displayMessage: "Resource not found", status: 404 });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);

    const displayJSON = {
        statusCode: err.status || 500,
        msg: err.displayMessage || "Internal Server Error",
    };

    if (process.env.NODE_ENV == "development") {
        displayJSON.stack = err.stack;
    }

    res.status(displayJSON.statusCode).json(displayJSON);

    next(); // for sanity
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    connectDB();
    console.log("Server is running on http://localhost:" + PORT);
});
