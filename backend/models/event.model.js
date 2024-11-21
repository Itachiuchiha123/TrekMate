import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            maxLength: [32, "Title's max length hit"],
        },
        // TODO make location something that actually represents a location?
        location: {
            type: String, // For now
            required: true,
        },
        isPublic: {
            type: Boolean,
            default: true,
            required: true,
        },
        startsAt: { type: Date, required: true },
        description: {
            type: String,
        },
        members: [
            {
                user: { type: ObjectId, ref: "User", required: true },
                role: {
                    type: String,
                    enum: ["host", "admin", "member"],
                    default: "member",
                    required: true,
                },
                joinedAt: { type: Date, default: Date.now },
                _id: false,
            },
        ],
        invites: [
            {
                user: { type: ObjectId, ref: "User", required: true },
                invitedAt: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending",
                    required: true,
                },
                _id: false,
            },
        ],
        requests: [
            {
                user: { type: ObjectId, ref: "User", required: true },
                requestedAt: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending",
                    required: true,
                },
                _id: false,
            },
        ],
    },
    {
        timestamps: true,
    }
);

eventSchema.method("publicDetails", function () {
    const { requests, invites, ...details } = this.toObject();
    return details;
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
