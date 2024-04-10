import express, {json} from "express";
import cors from "cors";
import * as http from 'http';
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(json())
const PORT = process.env.PORT || 8000;
dotenv.config();

import userReg from "./routes/authentication/user-register.js";
import userLogin from "./routes/authentication/user-login.js";
import userLogout from "./routes/authentication/user-logout.js";
import authToken from "./routes/authentication/authenticate-token.js" 

import initializeSocket from "./routes/meeting.js";

const server = http.createServer(app);
const io = initializeSocket(server);

app.use("/register", userReg);
app.use("/login", userLogin);
app.use("/logout", userLogout);
app.use("/authToken", authToken);

app.get('/', function (req, res) {
    res.send('Hellow World');
});

server.listen(PORT, process.env.ADDRESS, () => {
    console.log(`Server is running on port ${PORT}`);
});
