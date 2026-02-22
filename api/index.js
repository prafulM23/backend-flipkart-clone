import express from "express"
import cors from "cors"
import routs from "./Routing.js"
import { connentMongo } from "./model/connect.js"

const app = express()
connentMongo()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", routs)

app.get("/", (req, res) => {
    res.send("Backend Running on Vercel 🚀")
})

export default app