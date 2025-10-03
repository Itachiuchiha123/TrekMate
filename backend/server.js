import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();

// Use whitelist for cors
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);

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

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on http://localhost:" + PORT);
});
