import { Server } from "socket.io";
import http from "http";
import express from "express";
const app = express();
const server = http.createServer(app);

// for online users it stores all users in object form
const userSocketMap = {}; //{userId:socketID}

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const io = new Server(server, {
  // we don't need cors as frontend code is also served by the same server  but if you are not using frontend build code add these line
  // cors: {
  //   origin: ["http://localhost:5173"],
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  // },
});
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  // socket.on() is used to listen to the events. can be used both on client and server side

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  //io.emit is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("joinChat", (room) => {
    socket.join(room); // creating a room for perticular user
    console.log("user joined room " + room);
  });

  // socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("typing", (room) => socket.to(room).emit("typing"));
  // socket.on("stopTyping", (room) => socket.in(room).emit("stopTyping"));
  socket.on("stopTyping", (room) => socket.to(room).emit("stopTyping"));
});
export { app, io, server };
