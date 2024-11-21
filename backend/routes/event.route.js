import express from "express";

import {
    deleteEvent,
    handleEventInvitation,
    handleJoinRequest,
    hostEvent,
    inviteToEvent,
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

router.post("/:eventId/requests", verifyToken, joinEvent);
router.patch("/:eventId/requests/:requestorId", verifyToken, handleJoinRequest);

router.post("/:eventId/invites", verifyToken, inviteToEvent);
router.patch("/:eventId/invites", verifyToken, handleEventInvitation);
export default router;
