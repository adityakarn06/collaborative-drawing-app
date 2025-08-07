import { WebSocket, WebSocketServer } from "ws";
import jwt from "jsonwebtoken"
import { prismaClient } from "@repo/db/client";
import { JWT_SECRET } from "@repo/backend-common/jwtConfig";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server started on ws://localhost:8080");

// one user can connect to multiple rooms
interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}
const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded == "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
    
}

wss.on("connection", function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get("token") || "";

    const userId = checkUser(token);

    if (userId === null) {
        ws.close();
        return null;
    }

    users.push({
        userId,
        rooms: [],
        ws
    })

    ws.on("message", async function message(data) {
        let parsedData;
        try {
            const dataString = data.toString();
            parsedData = JSON.parse(dataString);
            
            if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData) || !parsedData.type) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Invalid message format"
                }));
                return;
            }
        } catch (error) {
            console.error("Failed to parse message:", error);
            ws.send(JSON.stringify({
                type: "error",
                message: "Invalid JSON message"
                }));
            return;
        }

        console.log("Received message:", parsedData);

        if (parsedData.type === "join_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: "User not found"
                }))
                return;
            }
            if (!parsedData.roomId) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Room ID not provided"
                }))
                return;
            }
            // todo: check if room exists or not
            if (user.rooms.includes(parsedData.roomId)) {
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Already in room"
                }))
                return;
            }
            
            user?.rooms.push(parsedData.roomId);
            ws.send(JSON.stringify({
                type: "joined_room",
                roomId: parseInt(parsedData.roomId, 10)
            }))
        }

        if (parsedData.type === "leave_room") {
            const user = users.find(x => x.ws === ws);
            if (!user) {
                return;
            }
            user.rooms = user?.rooms.filter(x => x === parsedData.room);
            ws.send(JSON.stringify({
                type: "left_room",
                roomId: parseInt(parsedData.roomId, 10)
            }))
        }

        if (parsedData.type === "chat") {
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            //todo: check if msg isn't too long

            // this is really slow --- idealy we should propagate it to the db via queue through pipelines
            // also add a rate limit
            try {
                await prismaClient.chat.create({
                    data: {
                        roomId: parseInt(roomId, 10),
                        userId,
                        message
                    }
                })
            } catch (error) {
                console.error("Error saving chat message:", error);
                ws.send(JSON.stringify({
                    type: "error",
                    message: "Failed to save message"
                }));
                return;
            }
            

            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({
                        type: "chat",
                        roomId,
                        message
                    }))
                }
            })
        }
    })
})