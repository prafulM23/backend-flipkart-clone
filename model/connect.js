
import mongoose from "mongoose";
console.log("mongo",process.env.MONGO_URL);
const url = ("mongodb://localhost:27017/Flipkart_data")


mongoose.connect(url)

const FLip_product = new mongoose.Schema({
    name: String,
    img: String,
    price: Number,
    category: String,

})
export default mongoose.model("product_detail", FLip_product)
