import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket() {
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();
    
    // todo: get token from auth and use that in params

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxZDE3YmFjZi1lMmQ4LTRkM2ItOGY5MC05NjJkNGI4ZjViOGUiLCJpYXQiOjE3NDYxODA3OTh9.Bs25sfVqSJJDWOtWGPGpeGzPdxoGCmjlPzhf92kU13Q`);
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }
    }, [])

    return {
        socket,
        loading
    }
}