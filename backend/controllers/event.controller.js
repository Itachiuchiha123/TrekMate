import Event from "../models/event.model.js";
import asyncHandler from "express-async-handler";

export const hostEvent = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { title, location, isPublic, startsAt, description } = req.body;

    // title, location, isPublic, startsAt required
    if (
        !title ||
        title.length > 32 ||
        !location ||
        typeof isPublic !== "boolean" ||
        isNaN(new Date(startsAt))
    ) {
        return res.status(400).json({ msg: "All fields required" });
    }

    // Check if this title already exists
    const event = await Event.findOne({ title }).lean();
    if (event) {
        return res.status(409).json({ msg: "Event title already exists" });
    }

    const newEvent = new Event({
        title,
        location,
        isPublic,
        starts_at: startsAt,
        description,
        members: [{ user: userId, role: "host" }],
    });

    await newEvent.save();
    await newEvent.populate("members.user", "name email");

    res.status(201).json({
        msg: "Successfully created event",
        event: newEvent.toJSON(),
    });
});

export const joinEvent = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { eventId } = req.params;

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ msg: "Event doesn't exist" });
    }

    // Check if the user is already in as a member
    if (event.members.find((member) => member.user.toString() == userId)) {
        return res.status(409).json({ msg: "Already a member" });
    }

    // Check if theres already a request
    if (event.requests.find((request) => request.user.toString() == userId)) {
        return res.status(409).json({ msg: "Already made a request" });
    }

    let successMessage = "";
    if (event.isPublic) {
        event.members.push({ user: userId });
        await event.save();
        successMessage = "Succesfully joined the event";
    } else {
        event.requests.push({ user: userId });
        await event.save();
        successMessage = "Succesfully sent request to join event";
    }

    return res.status(200).json({ msg: successMessage });
});

export const handleJoinRequest = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { eventId, requestorId } = req.params;
    const { decision } = req.body;

    if (typeof decision !== "boolean") {
        return res.status(400).json({ msg: "All fields required" });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ msg: "Event doesnt exist" });
    }

    // Check if the current user is eligible for accepting/rejecting task
    const eligible = event.members.find(
        (member) =>
            member.user.toString() == userId &&
            ["host", "admin"].includes(member.role)
    );
    if (!eligible) {
        return res.status(403).json({ msg: "You can't do this" });
    }

    // Check if the request even exists
    const request = event.requests.find(
        (joinRequest) =>
            joinRequest.user.toString() == requestorId &&
            joinRequest.status === "pending"
    );
    if (!request) {
        return res.status(404).json({ msg: "Join request not found" });
    }

    request.status = decision ? "accepted" : "rejected";

    // Add user to member
    event.members.push({ user: requestorId });
    await event.save();

    return res
        .status(200)
        .json({ msg: `Succesfully ${request.status} the request` });
});
