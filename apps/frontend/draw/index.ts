import axios from "axios";
import { HTTP_BACKEND_URL } from "@/config/config";

type Shape = {
    type: "rect";
    x: number;
    y: number;
    height: number;
    width: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
}

export function initDraw(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");

  // TODO: take existing shapes from backend
  let existingShapes: Shape[] = [];

  if (!ctx) {
    console.error("Failed to get canvas context");
    return;
  }
  ctx.fillStyle = "rgba(0, 0, 0)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let isDrawing = false;
  let startX = 0;
  let startY = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      const width = e.clientX - startX;
      const height = e.clientY - startY;
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1;

      ctx.strokeRect(startX, startY, width, height);
    }
  });

  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false;
    const width = e.clientX - startX;
    const height = e.clientY - startY;
    existingShapes.push({
        type: "rect",
        x: startX,
        y: startY,
        height,
        width
    })
  });
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // clear the rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // render existing shapes
    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 1;
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}

