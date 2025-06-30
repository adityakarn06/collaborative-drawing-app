import express from "express"

const app = express();
const PORT = 3001;

app.get("/", (req, res) => {
    res.json({
        message: "hello world"
    })
});

app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`)
});