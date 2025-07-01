import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/jwtConfig";
import { authMiddleware } from "./authMiddleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common-zod/types"
import { prismaClient } from "@repo/db/client"
import bcrypt from "bcrypt"
import cors from "cors";

const app = express();
const PORT = 3001;

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

        try{
            const userExists = await prismaClient.user.findFirst({
                where: {
                email
                }
            });

            if (userExists) {
                res.json({ success: false, msg: "User already exists" });
                return;
            }

            const hashedPass = await bcrypt.hash(password, 10);
            const user = await prismaClient.user.create({
            data: {
                email,
                password: hashedPass,
                name
            }
            })

            res.status(201).json({
                success: true,
                message: "You are signed up",
                user
            })    
        }
        
        catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                message: "Error while signup"
            })
         }
});

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
        const user = await prismaClient.user.findFirst({
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

        res.json({ success: true, msg: "Logged in", token});
      } catch (error) {
        res.json({success: false, msg: "error while login"})
      }
});

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
        const room = await prismaClient.room.create({
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
});

app.get("/chats/:roomId", async (req, res) => {
    try {
      const roomId = Number(req.params.roomId);
      const messages = await prismaClient.chat.findMany({
        where: {
          roomId: roomId
        },
        orderBy: {
          id: "desc"
        },
        take: 50
      });
      res.json({
        messages
      })
    } catch (error) {
      console.log(error)
      res.json({
        msg: "Server error"
      })
    }
  })
  
  // send slug get room id
  app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
      where: {
        slug
      }
    });
    res.json({
      room
    })
  });

app.listen(PORT, () => {
    console.log(`Server runing at http://localhost:${PORT}`)
});