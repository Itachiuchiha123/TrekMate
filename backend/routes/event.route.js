import express from "express";

import {
    handleJoinRequest,
    hostEvent,
    joinEvent,
} from "../controllers/event.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, hostEvent);
router.post("/:eventId/members", verifyToken, joinEvent);
router.patch("/:eventId/members/:requestorId", verifyToken, handleJoinRequest);

export default router;
