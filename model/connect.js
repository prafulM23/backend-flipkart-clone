
import mongoose from "mongoose";

export const connectMongo = () => {
    const url = ("mongodb://localhost:27017/Flipkart_data")
    mongoose.connect(url)

    console.log("connentc --------------")

}

