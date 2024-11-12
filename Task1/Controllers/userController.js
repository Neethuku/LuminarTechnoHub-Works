const users = require("../Model/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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