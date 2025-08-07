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

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket | null) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Failed to get canvas context");
    return;
  }

  let existingShapes: Shape[] = await getExistingShapes(roomId);
  if (!existingShapes) {
    existingShapes = [];
  }

  if (!socket) {
    console.error("WebSocket is not connected");
    return;
  }

  socket.onmessage = (event => {
    const message = JSON.parse(event.data);
    if (message.type === "chat") {
        const parsedShape = JSON.parse(message.message);
        existingShapes.push(parsedShape);
        clearCanvas(existingShapes, canvas, ctx);
    }
    });

  clearCanvas(existingShapes, canvas, ctx);

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

    const shape: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        height,
        width
    }
    existingShapes.push(shape)

    socket?.send(JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(shape)
    }));
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

async function getExistingShapes(roomId: string) {
    const { data } = await axios.get(`${HTTP_BACKEND_URL}/chats/${roomId}`);
    const messages = data.messages;

    // const shapes: Shape[] = messages.map((message: any) => {
    //     if (message.type === "rect") {
    //         return {
    //             type: "rect",
    //             x: message.x,
    //             y: message.y,
    //             width: message.width,
    //             height: message.height
    //         };
    //     } else if (message.type === "circle") {
    //         return {
    //             type: "circle",
    //             centerX: message.centerX,
    //             centerY: message.centerY,
    //             radius: message.radius
    //         };
    //     }
    //     return null;
    // }).filter((shape: Shape | null) => shape !== null) as Shape[];
    
    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message);
        return messageData;
    });
    return shapes;
}