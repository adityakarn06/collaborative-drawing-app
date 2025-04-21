import { WebSocketServer } from "ws";
import { prisma } from "@repo/db";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket) => {
    socket.on("message", (msg) => {
        socket.send("pong");
    })
})