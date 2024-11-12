const mongoose = require('mongoose')
ConnectionString = process.env.ConnectionString
mongoose.connect(ConnectionString).then(()=>{
    console.log('MongoDB connected with server');
    
}).catch((err)=>{
    console.log(`MongoDB connection failed`,err);
    
})