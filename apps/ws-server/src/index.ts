import { WebSocketServer} from "ws"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/jwtConfig";

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server started on ws://localhost:8080");

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
    // auth
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

    ws.on("message", function message(data) {
        console.log(`received: ${data}`);
        ws.send("pong");
    });
})