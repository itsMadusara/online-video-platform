// const socketIO = require('socket.io');
import { Server } from 'socket.io';

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        socket.emit("me", socket.id);
        
        console.log('New connection:', socket.id);

        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded");
        });

        socket.on("callUser", ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit("callUser", { signal: signalData, from, name });
        });

        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal);
        });
    });

    return io;
}

export default initializeSocket;