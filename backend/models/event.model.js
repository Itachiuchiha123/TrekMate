import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema(
    {
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
        starts_at: { type: Date, required: true },
        description: {
            type: String,
        },
        members: [
            {
                user: { type: ObjectId, ref: "User" },
                role: {
                    type: String,
                    enum: ["host", "admin", "member"],
                    required: true,
                },
            },
        ],
        invites: [
            {
                user: { type: ObjectId, ref: "User", required: true },
                invited_at: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending",
                },
            },
        ],
        requests: [
            {
                user: { type: ObjectId, ref: "User", required: true },
                requested_at: { type: Date, default: Date.now },
                status: {
                    type: String,
                    enum: ["pending", "accepted", "rejected"],
                    default: "pending",
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
