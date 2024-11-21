import express from "express";

import {
    deleteEvent,
    handleEventInvitation,
    handleJoinRequest,
    hostEvent,
    inviteToEvent,
    joinEvent,
    kickEventMember,
    updateEventMember,
    viewEvent,
} from "../controllers/event.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, hostEvent);
router.get("/:eventId", verifyToken, viewEvent);
router.delete("/:eventId", verifyToken, deleteEvent);
router.put("/:eventId", verifyToken, (req, res) => {
    res.send("Edit event coming soon");
});

router.put("/:eventId/members/:memberId", verifyToken, updateEventMember);
router.delete("/:eventId/members/:memberId", verifyToken, kickEventMember);

router.post("/:eventId/requests", verifyToken, joinEvent);
router.patch("/:eventId/requests/:requestorId", verifyToken, handleJoinRequest);

router.post("/:eventId/invites", verifyToken, inviteToEvent);
router.patch("/:eventId/invites", verifyToken, handleEventInvitation);
export default router;
