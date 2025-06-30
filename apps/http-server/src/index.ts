import express from "express"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/backend-common/jwtConfig";
import { authMiddleware } from "./authMiddleware";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common-zod/types"

const app = express();
const PORT = 3001;

app.post("/signup", (req, res) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            msg: "incorrect inputs"
        })
        return;
    }

    const { email, password, name } = req.body;

    res.json({
        message: "hello world"
    })
});

app.post("/signin", (req, res) => {
    const parsedData = SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            msg: "incorrect inputs"
        })
        return;
    }

    const { email, password } = req.body;

    //db call

    const userId = 1;

    const token = jwt.sign({
        userId
      }, JWT_SECRET)

    res.json({
        success: true,
        token
    })
});

app.post("/room", authMiddleware, (req, res) => {
    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        res.json({
            msg: "incorrect inputs"
        })
        return;
    }
    const { slug } = req.body;
    res.json({
        success: true,
        roomId: "123"
    })
});


app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`)
});