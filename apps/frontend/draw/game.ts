import { selectedToolType } from "@/components/Canvas";
import { getExistingShapes } from "./http";

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
} | {
        type: "pencil";
        x: number;
        y: number;
        height: number;
        width: number;
} | {
        type: "pointer";
};

export class Game {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShapes: Shape[] = [];
    private roomId: string;
    private socket: WebSocket;
    private isDrawing: boolean;
    private startX: number = 0;
    private startY: number = 0;
    private selectedTool: selectedToolType;

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShapes = [];
        this.roomId = roomId;
        this.socket = socket;
        this.isDrawing = false;
        this.selectedTool = "pointer";
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
    }

    destroy() {
        this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
        this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
        this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
        this.socket.close();
    }

    setTool(tool: selectedToolType) {
        this.selectedTool = tool;
    }

    async init() {
        this.existingShapes = await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    initHandlers() {
          this.socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
              const parsedShape = JSON.parse(message.message);
              this.existingShapes.push(parsedShape);
              this.clearCanvas();
            }
          };
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "rgba(0, 0, 0)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
        // render existing shapes
        this.existingShapes.map((shape) => {
          if (shape.type === "rect") {
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(
              shape.centerX,
              shape.centerY,
              shape.radius,
              0,
              Math.PI * 2
            );
            this.ctx.stroke();
            this.ctx.closePath();
        } else if (shape.type === "pencil") {
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(shape.x, shape.y);
            this.ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            this.ctx.stroke();
            this.ctx.closePath();
          }
        });
    }

    mouseDownHandler = (e: MouseEvent) => {
        this.isDrawing = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
    }

    mouseMoveHandler = (e: MouseEvent) => {
        if (this.isDrawing) {
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle = "white";
            this.ctx.lineWidth = 1;
      
            const selectedTool = this.selectedTool;
            if (selectedTool === "rect") {
              this.ctx.strokeRect(this.startX, this.startY, width, height);
            } else if (selectedTool === "pencil") {
              this.ctx.beginPath();
              this.ctx.moveTo(this.startX, this.startY);
              this.ctx.lineTo(e.clientX, e.clientY);
              this.ctx.stroke();
              this.ctx.closePath();
            } else if (selectedTool === "pointer") {
              return;
            } else if (selectedTool === "circle") {
              const radius = Math.sqrt(width * width + height * height) / 2;
              const centerX = this.startX + width / 2;
              const centerY = this.startY + height / 2;
              this.ctx.beginPath();
              this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              this.ctx.stroke();
              this.ctx.closePath();
            }
          }
    }

    mouseUpHandler = (e: MouseEvent) => {
        this.isDrawing = false;
            const width = e.clientX - this.startX;
            const height = e.clientY - this.startY;

            const selectedTool = this.selectedTool;
            let shape: Shape | null = null;
            
            if (selectedTool === "rect") {
                shape = {
                    type: "rect",
                    x: this.startX,
                    y: this.startY,
                    height,
                    width,
                };
            } else if (selectedTool === "circle") {
                shape = {
                    type: "circle",
                    centerX: this.startX + width / 2,
                    centerY: this.startY + height / 2,
                    radius: Math.sqrt(width * width + height * height) / 2,
                };
            } else if (selectedTool === "pencil") {
                shape = {
                    type: "pencil",
                    x: this.startX,
                    y: this.startY,
                    height,
                    width,
                };
            } else {
                return;
            }
        
            if (!shape) {
              return;
            }
        
            this.existingShapes.push(shape);
        
            this.socket?.send(
              JSON.stringify({
                type: "chat",
                roomId: this.roomId,
                message: JSON.stringify(shape),
              })
            );
    }

    initMouseHandlers() {
        this.canvas.addEventListener("mousedown", this.mouseDownHandler);

        this.canvas.addEventListener("mousemove", this.mouseMoveHandler);

        this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    }
}