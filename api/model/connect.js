
import mongoose from "mongoose";
// console.log("mongo", process.env.MONGO_URL);
// const url = ("mongodb://localhost:27017/Flipkart_data")


export const connentMongo = () => {
    const url = process.env.MONGO_URL
    mongoose.connect(url)
}

