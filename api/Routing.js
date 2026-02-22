import express from "express"
const routing = express.Router()
import * as calls from "./controller/logic.js"

routing.get("/read", calls.read)
routing.post("/sign", calls.Sign)
routing.post("/login", calls.login)
routing.post("/update", calls.update)
routing.post("/verify", calls.Verify)

export default routing


