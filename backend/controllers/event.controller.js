import Event from "../models/event.model.js";
import User from "../models/user.model.js";
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
        startsAt: startsAt,
        description,
        members: [{ user: userId, role: "host" }],
    });

    await newEvent.save();
    await newEvent.populate("members.user", "name email");

    req.io.userJoinRoom(userId, newEvent._id.toString());

    res.status(201).json({
        msg: "Successfully created event",
        event: newEvent,
    });
});

export const viewEvent = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
        return res.status(404).json({ msg: "Event doesnt exist" });
    }

    const privileged = event.members.find(
        (member) =>
            member.user.toString() == userId &&
            ["host", "admin"].includes(member.role)
    );

    return res.status(200).json(privileged ? event : event.publicDetails());
});

export const deleteEvent = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
        return res.status(404).json({ msg: "Event doesnt exist" });
    }
    const privileged = event.members.find(
        (member) =>
            member.user.toString() == userId && ["host"].includes(member.role)
    );

    if (!privileged) {
        return res.status(403).json({ msg: "You cannot delete this event" });
    }

    await event.deleteOne();

    req.io.to(event._id).emit("event:deleted", {
        msg: "An event you are in has been deleted by the host :/",
        data: { event: event._id, host: userId },
    });
    req.io.socketsLeave(event._id);

    return res.status(200).json({ msg: "Succesfully deleted event" });
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

        req.io.userJoinRoom(userId, event._id.toString());
        req.io.to(event._id.toString()).emit("event:join", {
            msg: "New user joined an event :)",
            data: {
                event: event._id,
                user: userId,
            },
        });

        successMessage = "Succesfully joined the event";
    } else {
        event.requests.push({ user: userId });
        await event.save();

        req.io.to(event._id.toString()).emit("event:request", {
            msg: "User requested to join an event",
            data: {
                event: event._id,
                user: userId,
            },
        });

        successMessage = "Succesfully sent request to join event";
    }

    return res.status(201).json({ msg: successMessage });
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

    if (decision) {
        request.status = "accepted";
        event.members.push;
        // Add user to member
        event.members.push({ user: requestorId });
        req.io.userJoinRoom(requestorId, event._id.toString());
        req.io.to(event._id.toString()).emit("event:join", {
            msg: "New user joined an event :)",
            data: {
                event: event._id,
                user: userId,
            },
        });
    } else {
        request.status = "rejected";
    }

    await event.save();

    req.io
        .to(req.io.getUserSockets(requestorId))
        .emit(`event:request_${request.status}`, {
            msg: `Request has been ${request.status}`,
            data: { event: event._id },
        });

    return res
        .status(200)
        .json({ msg: `Succesfully ${request.status} the request` });
});

export const inviteToEvent = asyncHandler(async (req, res) => {
    const userId = req.userId; // Sender
    const { eventId } = req.params;
    const { receiver } = req.body; // Reciever

    if (!receiver) {
        return res.status(400).json({ msg: "Fill all fields" });
    }

    // Check if the event id is valid
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ msg: "Event doesnt exist" });
    }

    // Check if the sender has valid perms for inviting
    const privileged = event.members.find(
        (member) =>
            member.user.toString() == userId &&
            ["host", "admin"].includes(member.role)
    );
    if (!privileged) {
        return res
            .status(403)
            .json({ msg: "You can't send invites in this event" });
    }

    // Check if the new member is a valid user
    const validUser = await User.findById(receiver);
    if (!validUser) {
        return res.status(404).json({ msg: "User can't be invited" });
    }

    // Check if the member is already a member
    if (event.members.find((member) => member.user.toString() == receiver)) {
        return res.status(409).json({ msg: "User is already a member" });
    }

    // Check if the member has already been invited
    if (
        event.invites.find(
            (invite) =>
                invite.user.toString() == receiver && invite.status == "pending"
        )
    ) {
        return res.status(409).json({ msg: "An invite is already pending" });
    }

    event.invites.push({ user: receiver });
    await event.save();

    req.io.to(req.io.getUserSockets(receiver)).emit("event:invite", {
        msg: "You have been invited to join an event",
        data: { event: event._id },
    });

    return res.status(201).json({ msg: "Invitation made" });
});

export const handleEventInvitation = asyncHandler(async (req, res) => {
    const userId = req.userId; // receiver
    const { eventId } = req.params;
    const { decision } = req.body;

    if (typeof decision !== "boolean") {
        return res.status(400).json({ msg: "Fill all fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ msg: "Not invited to that event :(" });
    }

    const invited = event.invites.find(
        (invite) => invite.user == userId && invite.status == "pending"
    );
    if (!invited) {
        return res.status(404).json({ msg: "Not invited to that event :(" });
    }

    // Invited
    if (decision) {
        invited.status = "accepted";
        event.members.push({ user: userId });
    } else {
        invited.status = "rejected";
    }
    await event.save();

    return res
        .status(200)
        .json({ msg: `Succesfully ${invited.status} the invitation` });
});

export const updateEventMember = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { memberId, eventId } = req.params;
    const { role } = req.body;

    if (!["admin", "member"].includes(role)) {
        return res.status(400).json({ msg: "Invalid role" });
    }

    // Check if the event id is valid
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ msg: "Event doesnt exist" });
    }

    // Check if the user has valid perms for updating role
    const privileged = event.members.find(
        (member) =>
            member.user.toString() == userId && ["host"].includes(member.role)
    );
    if (!privileged) {
        return res.status(403).json({ msg: "You can't change member roles" });
    }

    // Check if the member exists
    const member = event.members.find(
        (member) => member.user.toString() == memberId
    );
    if (!member) {
        return res.status(404).json({ msg: "User is not a member" });
    }

    if (member.user.toString() == userId) {
        return res.status(409).json({ msg: "Cant change your role" });
    }

    member.role = role;
    await event.save();

    return res.status(200).json({ msg: "Succesfully updated member" });
});

export const kickEventMember = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { memberId, eventId } = req.params;

    // Check if the event id is valid
    const event = await Event.findById(eventId);
    if (!event) {
        return res.status(404).json({ msg: "Event doesnt exist" });
    }

    // Check if the user has valid perms for updating role
    const self = event.members.find(
        (member) => member.user.toString() == userId
    );
    if (!self || self.role == "member") {
        return res.status(403).json({ msg: "Can't perform this action" });
    }

    // Get the target user
    const target = event.members.find(
        (member) => member.user.toString() == memberId
    );
    if (!target) {
        return res.status(404).json({ msg: "Not a member" });
    }

    if (target.user.toString() == self.user.toString()) {
        return res.status(409).json({ msg: "Cant kick yourself" });
    }

    if (self.role != "host" && ["host", "admin"].includes(target.role)) {
        return res.status(403).json({ msg: "Not enough perms to do this" });
    }

    // Finally kick member
    event.members.filter((member) => member.user.toString() !== target.user);

    await event.save();

    req.io.to(req.io.getUserSockets(memberId)).emit("event:kick", {
        msg: "You have been kicked from an event :(",
        data: { event: event._id },
    });

    return res.status(200).json({ msg: "Kicked the user" });
});
