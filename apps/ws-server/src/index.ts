import { WebSocket, WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken"
import { prisma } from "../node_modules/@repo/db/src/index";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server started on ws://localhost:8080");

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
    // authorization
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
        const parsedData = JSON.parse(data as unknown as string);

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
                roomId: parsedData.roomId
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
                roomId: parsedData.roomId
            }))
        }

        if (parsedData.type === "chat") {
            console.log("chat received")
            const roomId = parsedData.roomId;
            const message = parsedData.message;

            // this is really slow --- idealy we should propagate it to the db via queue through pipelines
            // also add a rate limit
            await prisma.chat.create({
                data: {
                    roomId,
                    userId,
                    message
                }
            })

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