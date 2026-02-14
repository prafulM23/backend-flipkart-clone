import express from "express"
const rout = express.Router()
import * as calls from "./controllar/logic.js"

rout.get("/read",calls.read)
rout.post("/sign",calls.Sign)
rout.post("/create",calls.create)
rout.post("/login",calls.login)
rout.post("/update",calls.update)
rout.post("/verify",calls.Verify)

export default rout


