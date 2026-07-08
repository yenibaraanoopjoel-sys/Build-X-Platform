import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "./config";

const socket = io(SOCKET_BASE_URL, {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;