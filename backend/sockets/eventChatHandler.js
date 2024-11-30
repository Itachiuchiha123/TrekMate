export const registerEventChatHandler = (io, socket) => {
    socket.on("event:sendMessage", async (payload) => {
        // Check eventid
        const event = await Event.findOne({
            _id: payload.eventId,
            "members.user": socket.userId,
        }).lean();

        if (!event) {
            socket.emit("event:sendMessage", {
                ok: false,
                msg: "Can't find that event",
            });
            return;
        }

        // Broadcast to members of that room
        socket.to(payload.eventId).emit("newMessage", {
            ...payload,
            sender: socket.userId,
        });
    });
};
