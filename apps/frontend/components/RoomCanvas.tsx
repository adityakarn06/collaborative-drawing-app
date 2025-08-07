"use client";

import { WS_URL } from "@/config/config";
import { initDraw } from "@/draw";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "./Canvas";

export default function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNzg2YTNjOS03ZmZlLTQxMGQtOTAyYi05YWY4NWJjYjg3NDAiLCJpYXQiOjE3NTQ1MzYyNDZ9.F7tLtX-SA-b4G_2AszEHY2SzsUquIYV2WHDpHXEngnQ";
        if (!token) {
            console.error("No token found in localStorage");
            return;
        }
        const ws = new WebSocket(`${WS_URL}?token=${token}`);
        ws.onopen = () => {
            console.log("WebSocket connection established");
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId
            }));
        };
        // return () => {
        //     ws.close();
        // };
    }, [roomId]);

    if (!socket) {
        return <div className="flex flex-col items-center justify-center h-screen">
            <p>Connecting to the drawing room...</p>
            <p>Please wait...</p>
        </div>
    }

    return (
        <div>
            <Canvas roomId={roomId} socket={socket} />
        </div>
    )
}