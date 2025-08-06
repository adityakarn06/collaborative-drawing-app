"use client";
import { initDraw } from "@/draw";
import { use, useEffect, useRef } from "react";

export default function CanvasPage() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            initDraw(canvas);
        }
    }, [canvasRef]);

    return (
        <div>
            <canvas ref={canvasRef} width={1080} height={1000}></canvas>
            <div className="absolute bottom-0 right-0 flex gap-1 p-2 bg-gray-200">
                <div className="bg-white px-4 py-2 text-black">Rect</div>
                <div className="bg-white px-4 py-2 text-black">Circle</div>
            </div>
        </div>
    )
}