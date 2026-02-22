import mongoose from "mongoose";

const Flip_user = new mongoose.Schema({
    email:String,
    otp:String,
    otpExpiry:Date,
    Verifed:{type:Boolean,default:false}
})

export default mongoose.model("User_data",Flip_user, "User_data")