"use client"

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: {message: string}[];
    id: string
}) {
    const [chats, setChats] = useState(messages);
    const [currentMsg, setCurrentMsg] = useState("");
    const {socket, loading} = useSocket();
    useEffect(() => {
        if (socket && !loading) {

            // todo: make it a separate hook with socket and id
            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "chat") {
                    // todo: check if this is this room's msg or not
                    setChats(c => [...c, {message: parsedData.message}]);
                }
            }
        }
        // return () => {
        //     socket?.close();
        // }
    }, [socket, loading, id])

    return <div>
        {chats.map(m => <div>{m.message}</div>)}
        <input type="text" placeholder="Enter msg here..." value={currentMsg} onChange={e => {
            setCurrentMsg(e.target.value);
        }}></input>
        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                message: currentMsg
            }))

            setCurrentMsg("");
        }}>Send message</button>
    </div>
}