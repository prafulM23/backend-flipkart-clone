import express from "express"
import cors from "cors"
import routs from "./Routing.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", routs)

app.get("/", (req, res) => {
    res.send("Backend Running on Vercel 🚀")
})

export default app