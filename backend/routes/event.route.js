import express from "express";

import {
    deleteEvent,
    handleJoinRequest,
    hostEvent,
    joinEvent,
    viewEvent,
} from "../controllers/event.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, hostEvent);
router.get("/:eventId", verifyToken, viewEvent);
router.delete("/:eventId", verifyToken, deleteEvent);
router.put("/:eventId", verifyToken, (req, res) => {
    res.send("coming soon");
});

router.post("/:eventId/members", verifyToken, joinEvent);
router.patch("/:eventId/members/:requestorId", verifyToken, handleJoinRequest);

export default router;
