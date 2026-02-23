import express, { urlencoded } from "express"
import cors from "cors"
import r from "./Routing.js"
import { connectMongo } from "./model/connect.js";
const app = express();

connectMongo()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static("images"))


app.use("/", r)
app.listen(5000);
console.log("server active");