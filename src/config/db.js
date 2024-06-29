const mongoose = require('mongoose');

const url = process.env.URL_MONGODB || "mongodb://localhost:27017/video"

const connectDB = async()=>{
    try{
        await mongoose.connect(url);
        console.log('MongoDB Connected');
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;