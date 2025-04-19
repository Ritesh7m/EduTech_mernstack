const mongoose = require('mongoose');
require('dotenv').config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGO_URL),{
        useNewUrlParser:true,
        useUnifiedTopology:true,
         
    }.then(()=>{
        console.log("DB connected...")

    })
    .catch((error)=>{
        console.log('failed to connect...')
        console.error(error);
        process.exit(1); 
    })
}