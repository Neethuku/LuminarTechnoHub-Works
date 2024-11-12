require('dotenv').config()
const express = require('express')
const cors = require('cors')
require('./DB/Connection')
const router = require('./Routes/Route')

const userServer = express()
userServer.use(cors())
userServer.use(express.json())
userServer.use(router)

const PORT = 3000
userServer.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})

userServer.get('/',(req,res)=>{
    res.status(200).send("<h1>Server started!!</h1>")
})