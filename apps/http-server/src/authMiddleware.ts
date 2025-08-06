import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/jwtConfig";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"] ?? "";
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded && typeof decoded === 'object' && 'userId' in decoded && typeof decoded.userId === 'string') {
            req.userId = decoded.userId;
            next();
        }  else{
            res.status(403).json({
                success: false,
                message: "unauthorized"
            })
        }
    } catch (error) {
        res.status(403).json({
            success: false,
            message: "unauthorized"
        });
    }
}