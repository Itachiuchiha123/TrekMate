import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addNotification } from "../features/notification/notificationSlice";
import { toast } from "react-hot-toast";

const API_URL = process.env.NODE_ENV === 'production'
    ? `${process.env.REACT_APP_BACKEND}`
    : 'http://localhost:5000';

const useSocket = () => {
    const socketRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const socket = io(API_URL, {
            path: "/ws/notifications",
            transports: ["websocket"],
            withCredentials: true, // 👈 crucial to send cookies!
        });

        socket.on("notification:new", (data) => {
            dispatch(addNotification(data));
            toast(`${data.sender?.username || "Someone"} ${getMessage(data)}`, {
                icon: "🔔",
            });
            console.log("New notification received:", data);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    return socketRef.current;
};

export default useSocket;

const getMessage = (notif) => {
    switch (notif.type) {
        case "like":
            return "liked your post";
        case "comment":
            return "commented on your post";
        case "follow":
            return "followed you";
        case "message":
            return "sent you a message";
        default:
            return "sent a notification";
    }
};
