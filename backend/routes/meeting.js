// const express = require("express");
// const { Server } = require("socket.io");

// const router = express.Router();

// function socketRoutes(server) {
//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"]
//         }
//     });

//     router.io = io;

//     io.on("connection", (socket) => {
//         socket.emit("me", socket.id);
//         console.log("New connection: ", socket.id);
    
//         socket.on("disconnect", () => {
//             socket.broadcast.emit("callEnded")
//         });
    
//         socket.on("callUser", ({ userToCall, signalData, from, name }) => {
//             io.to(userToCall).emit("callUser", { signal: signalData, from, name });
//         });
    
//         socket.on("answerCall", (data) => {
//             io.to(data.to).emit("callAccepted", data.signal)
//         });
//     });

//     return router;
// }

// module.exports = socketRoutes;

const socketIO = require('socket.io');

function initializeSocket(server) {
    const io = socketIO(server, {
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

module.exports = initializeSocket;