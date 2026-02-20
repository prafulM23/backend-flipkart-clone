import "dotenv/config";
import express, { urlencoded } from "express"
import cors from "cors"
import routs from "./Routing.js"

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routs)

app.listen(process.env.PORT);
console.log("server active");