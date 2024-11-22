export const registerHelloHandler = (io, socket) => {
    const replyClient = (payload) => {
        console.log(payload);
        socket.emit("helloclient", {
            msg: "hello from the server wassup client?",
        });
    };

    socket.on("helloserver", replyClient);
};
