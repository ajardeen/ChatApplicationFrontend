import { io } from "socket.io-client";

const socket = io(`https://chatapplicationbackend-dzdy.onrender.com`, {
    transports: ["websocket"],
});

export default socket;
