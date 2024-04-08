// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const cors = require("cors");

// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "*",
// 		methods: [ "GET", "POST" ]
// 	}
// });

// app.use(cors());

// io.on("connection", (socket) => {
// 	socket.emit("me", socket.id);
// 	console.log('socket.id:', socket.id);

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	});

// 	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
// 		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
// 	});

// 	socket.on("answerCall", (data) => {
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	});
// });

// // const socketRoutes = require("./routes/meeting");

// // Mount the Socket.io route on /socket.io
// // app.use("/meet", socketRoutes(server));

// app.get("/", (req, res) => {
//     res.send("Server is running.");
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");

const initializeSocket = require("./routes/meeting");

app.use(cors());

// Initialize socket.io and pass the HTTP server instance
const io = initializeSocket(server);

app.get("/", (req, res) => {
    res.send("Server is running.");
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
