import { initDraw } from "@/draw";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Circle, MousePointer, Pencil, RectangleHorizontal } from "lucide-react";
import { Game } from "@/draw/game";

export type selectedToolType = "pencil" | "rect" | "circle" | "pointer";

export function Canvas({
    roomId,
    socket
}: {
    roomId: string,
    socket: WebSocket | null
}) {
    const [selectedTool, setSelectedTool] = useState<selectedToolType>("pointer");
    const [game, setGame] = useState<Game>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { width, height } = useWindowSize();

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const g = new Game(canvas, roomId, socket!);
            setGame(g);

            return () => {
                g.destroy;
            }
        }
    }, [canvasRef]);

    return (
        <div className="h-screen overflow-hidden">
            <canvas ref={canvasRef} width={width} height={height}></canvas>
            <div className="absolute top-5 right-5 justify-center flex gap-2 px-3 py-2 bg-white/15 shadow-md rounded-lg">
                <IconButton activated={selectedTool === "pointer"} icon={<MousePointer className="w-5 h-5" /> } onClick={() => {
                    setSelectedTool("pointer");
                }} />
                <IconButton activated={selectedTool === "pencil"} icon={<Pencil className="w-5 h-5" /> } onClick={() => {
                    setSelectedTool("pencil");
                }} />
                <IconButton activated={selectedTool === "rect"} icon={<RectangleHorizontal className="w-5 h-5" /> } onClick={() => {
                    setSelectedTool("rect");
                }} />
                <IconButton activated={selectedTool === "circle"} icon={<Circle className="w-5 h-5" /> } onClick={() => {
                    setSelectedTool("circle");
                }} />
            </div>
        </div>
    );
}