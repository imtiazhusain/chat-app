import express from "express";
import morgan from "morgan";
import { PORT, SERVER_URL } from "./config/index.js";
import getDirname from "./utils/getDirName.js";
import connectDB from "./database/connectDB.js";
import errorHandler from "./middlewares/errors/errorHandler.js";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import messageRoutes from "./routes/message.routes.js";
import path from "path";
import { app, io, server } from "./socket/socket.js";
app.use(express.json());
app.use(morgan("tiny"));
app.disable("x-powered-by");
connectDB();

// this line is for deployment purpose it will give us root directory
const rootDirectory = path.resolve();

// CORS
app.use(cors());

// Use the function with import.meta.url to get the current directory
const __dirname = getDirname(import.meta.url, path);

app.use("/public", express.static(__dirname + "/public"));

// this line is for deployment
app.use(express.static(rootDirectory + "/frontend/dist"));

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(errorHandler);

// all routes that does not match then this will be called but commented for deployment purpose because of we send index.html file if no path matched
// app.use((req, res) => {
//   res.status(404).json({ STATUS: "ERROR", MESSAGE: "Page not Found" });
// });

// this line is for deployment
app.get("*", (req, res) => {
  console.log("path...");
  console.log(path.join(rootDirectory, "frontend", "dist", "index.html"));
  res.sendFile(path.join(rootDirectory, "frontend", "dist", "index.html"));
});
server.listen(PORT, () => {
  console.log(`${SERVER_URL}`);
});
