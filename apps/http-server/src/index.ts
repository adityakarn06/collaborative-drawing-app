import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import { prisma } from "../node_modules/@repo/db/src/index";
import { JWT_SECRET } from "@repo/backend-common/config";
import { authMiddleware } from "./authMiddleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types"

declare global {
  namespace Express {
      export interface Request {
          userId?:string;
      }
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      msg: "incorrect inputs"
    })
    return;
  }

  const { email, password, name } = req.body;

  const userExists = await prisma.user.findFirst({
    where: {
      email
    }
  });
  if (userExists) {
    res.json({ success: false, msg: "User already exists" });
    return;
  }

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        name
      }
    })

    res.json({ success: true, msg: "User created" });
  } catch (error) {
    res.json({ success: false, msg: "Error while signup "})
  }
})

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      msg: "incorrect inputs"
    })
    return;
  }

  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email
      }
    })
    if (!user) {
      res.json({ success: false, msg: "User doesn't exist...please signup"});
      return;
    }
    const passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
      res.json({ success: false, msg: "Incorrect Password"});
      return;
    }
    const token = jwt.sign({
      userId: user.id
    }, JWT_SECRET);
    res.json({ success: true, msg: "User logged in", token});
  } catch (error) {
    res.json({success: false, msg: "error while login"})
  }
})

app.post("/room", authMiddleware, async (req, res) => {
  const data = CreateRoomSchema.safeParse(req.body);
  if (!data.success) {
    res.json({
      msg: "incorrect inputs"
    })
    return;
  }
  const { slug } = req.body;
  const userId = req.userId || "";

  try {
    const room = await prisma.room.create({
      data: {
        slug,
        adminId: userId
      }
    })
  
    res.json({
      roomId: room.id
    })
  } catch (error) {
    res.json({
      msg: "room need to be unique"
    })
  }
})

app.listen(PORT, () => {
    console.log(`Server runing at http://localhost:${PORT}`);
})