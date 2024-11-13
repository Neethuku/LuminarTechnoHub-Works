const users = require("../Model/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

exports.userRegistration = async(req,res) => {
    const {username,email,password} = req.body
    try {
        if(!username || !email || !password){
            return res.status(400).json('All fields are required')
        }
        const existingUser = await users.findOne({email})
        if(existingUser){
            return res.status(409).json("User already exists..Please login")
        }else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password,salt)
            const newuser = new users({username,email,password:hashedPassword})
            await newuser.save()
            return res.status(201).json({message:"User registered successfully",newuser})
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"})
    }
}


exports.userLogin = async(req,res) => {
    const {email,password} = req.body
    try {
        if(!email || !password){
            return res.status(400).json('All fields are required')
        }
        const existingUser = await users.findOne({email})
        if(!existingUser){
            return res.status(404).json("User not found")
        }
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password)
        if(!isPasswordCorrect){
            return res.status(401).json("Invalid password")
        }
        const token = jwt.sign({userId:existingUser._id},process.env.jwt_secretKey)
        const userDetails = {
            _id:existingUser._id,
            email:existingUser.email,
            username:existingUser.username
        }
        return res.status(200).json({message:"Login successfull",userDetails,token})
    } catch (error) {
        console.log(error);
        return res.status(500).json("Internal server error")
    }
}

exports.sendOTPtoEmail = async(req,res) => {
    const {email} = req.body
    const existingUser = await users.findOne({email})
    try {
        if(!existingUser){
            return res.status(404).json("User not found")
        }else{
            const otp = Math.floor(100000 + Math.random() * 900000)
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:process.env.EmailId,
                    pass:process.env.Emailpswd
                } 
            })
            const mailOptions = {
                from : process.env.EmailId,
                to : email,
                subject : 'Your OTP code',
                text:`Your OTP is : ${otp}.`
            }
            const sendmail = await transporter.sendMail(mailOptions);
            console.log('Email sent' + sendmail.response)
            return res.status(200).json({message:"OTP sent successfully"})
        }
    } catch (error) {
        console.log('Error sending otp',error);
        return res.status(500).json({message:"Internal server error"})
    }

}
