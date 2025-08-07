import { initDraw } from "@/draw";
import { useEffect, useRef } from "react";

export function Canvas({
    roomId,
    socket
}: {
    roomId: string,
    socket: WebSocket | null
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            initDraw(canvas, roomId, socket);
        }
    }, [canvasRef]);

    return (
        <canvas ref={canvasRef} width={1080} height={1000}></canvas>
    );
}