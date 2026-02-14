import "dotenv/config";
import express, { urlencoded } from "express"
import cors from "cors"
import r from "./Routing.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", r)

app.listen(process.env.PORT);
console.log("server active");