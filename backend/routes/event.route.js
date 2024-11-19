import express from "express";

import { hostEvent, joinEvent } from "../controllers/event.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Host an event
router.post("/host", verifyToken, hostEvent);
router.post("/:eventId/join", verifyToken, joinEvent);

export default router;
