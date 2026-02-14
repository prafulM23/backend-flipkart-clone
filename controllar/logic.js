import model from "../model/connect.js"
import User from "../model/valid.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

const jwt_key = process.env.JWT_KEY;
console.log("key",jwt_key);
const GenrateOtp = (length) => {
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += crypto.randomInt(0, 10).toString()
    }
    return otp;
}

const transportar = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS
    }
})

export const create = async (req, res) => {
    const { name, price, category, } = req.body;

    await model.create(req.body)
    console.log(name, price, category)
    res.send("cerate ")

}

export const Verify = async (req, res) => {
    try {
        const { getemail, getotp } = req.body;
        console.log(getemail, getotp);
        const existUser = await User.findOne({ email: getemail })
        console.log("verify data", existUser)
        if (!existUser) {
            return (res.status(400).json({ msg: "User Not Found" }))
        }
        if (getotp !== existUser.otp) {
            return (res.status(400).json({ msg: "OTP Not Valid" }))
        }
        if (Date.now() > existUser.otpExpiry) {
            return (res.status(400).json({ msg: "Expired OTP" }))
        }

        existUser.otp = undefined;
        existUser.otpExpiry = undefined;
        existUser.Verifed = true

        await existUser.save();
        const mailoption = {
            from: "prafulm2310@gmail.com",
            to: getemail,
            subject: "Welcome to Flipkart 🎉",
            html: `
        <div style="font-family: Arial, sans-serif; background-color:#f5f5f5; padding:20px;">
          <div style="max-width:600px; background:#fff; border-radius:10px; padding:25px; margin:auto;">
            <h2 style="color:#2874f0; text-align:center;">Welcome to Flipkart, ${getemail || "User"}!</h2>
            <p style="font-size:16px; color:#333;">
              We’re excited to have you on board 🛒
            </p>
            <p style="font-size:15px; color:#555;">
              You can now explore millions of products, get exciting offers, and enjoy fast delivery.
            </p>
            <a href="https://www.flipkart.com" target="_blank" 
               style="display:inline-block; background:#2874f0; color:#fff; text-decoration:none; padding:10px 20px; border-radius:5px; margin-top:15px;">
               Start Shopping
            </a>
            <hr style="margin-top:25px;"/>
            <p style="font-size:13px; color:gray; text-align:center;">
              This is an automated message — please do not reply.
            </p>
          </div>
        </div>
      `,
        }
        await transportar.sendMail(mailoption, (err, res) => {
            if (err) {
                return console.log("error", err);
            } else {
                console.log("email sent :");
            }
        })
        const token = jwt.sign({ getemail }, jwt_key, { expiresIn: "1h" });
        res.status(200).json({ msg: "OTP Verified Succesfully", token })
    } catch (error) {
        res.status(500).json("Server Not Response")
    }
}

export const Sign = async (req, res) => {
    try {
        const { email } = req.body;
        const existUser = await User.findOne({ email })
        if (existUser && existUser.Verifed) {
            return (res.status(400).json({ msg: "User Already SignUp" }))
        }
        const otp = GenrateOtp(4)
        if (existUser) {
            existUser.otp = otp;
            existUser.otpExpiry = Date.now() + 5 * 60 * 1000
            await existUser.save();
        } else {
            await User.create({
                email,
                otp,
                otpExpiry: Date.now() + 5 * 60 * 1000
            })
        }

        const mailoption = {
            from: "prafulm2310@gmail.com",
            to: email,
            subject: "Flipkart - Verify your email address",
            html: `
        <div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:10px;">
          <h2 style="color:#2874f0;">Flipkart Verification</h2>
          <p>Hi there 👋,${email}</p>
          <p>Thank you for registering with <b>Flipkart</b>!</p>
          <p>Use the following OTP to verify your account:</p>
          <h1 style="color:#2874f0; letter-spacing:3px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <hr/>
          <p style="font-size:12px; color:gray;">If you did not request this, please ignore this email.</p>
        </div>
      `,
        }

        await transportar.sendMail(mailoption, (err, res) => {
            if (err) {
                return console.log("error", err);
            } else {
                console.log("email sent :");
            }
        })
        res.status(200).json({ msg: "OTP Sent Check email" })
    } catch (error) {
        res.status(500).json({ msg: "Server Not response" })
        console.log("error aa rhi he ")
    }
}

export const login = async (req, res) => {
    try {
        const { email } = req.body;

        const existUser = await User.findOne({ email })
        if (!existUser) {
            return (res.status(400).json({ msg: "user not signUp" }))
        }
        if (!existUser.Verifed) {
            return res.status(400).json({ msg: "User not verified" });

        }

        const otp = GenrateOtp(4);

        existUser.otp = otp;
        existUser.otpExpiry = Date.now() + 5 * 60 * 1000
        await existUser.save()

        console.log("login data", existUser)

        const mailoption = {
            from: "prafulm2310@gmail.com",
            to: email,
            subject: "Flipkart -Login Verify your email address",
            html: `
        <div style="font-family:sans-serif; padding:20px; border:1px solid #eee; border-radius:10px;">
          <h2 style="color:#2874f0;">Flipkart Login Verification</h2>
          <p>Hi there 👋,</p>
          <p>Use the following OTP to verify your account:</p>
          <h1 style="color:#2874f0; letter-spacing:3px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
          <hr/>
          <p style="font-size:12px; color:gray;">If you did not request this, please ignore this email.</p>
        </div>
      `,
        }
        await transportar.sendMail(mailoption, (err, res) => {
            if (err) {
                return console.log("error", err);
            } else {
                console.log("email sent :");

            }

        })



        res.status(200).json({ msg: "Login OTP Sent " })

    } catch (error) {
        res.status(500).json({ msg: "Server Error" })
        console.log("errror aa rhi he")
    }

}

export const read = async (req, res) => {
    const data = await User.find()

    console.log("read")
    res.send(data)

}

export const update = (req, res) => {
    console.log("update")
    res.send("update ")

}