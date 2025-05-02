import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded) {
      // @ts-ignore
      req.userId = decoded.userId;
      next();
    } else {
      res.status(403).json({
        msg: "Unauthorized",
      });
    }
  } catch (error) {
    res.status(403).json({
      msg: "Unauthorized",
    });
  }
};
