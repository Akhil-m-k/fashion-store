const  mongoose = require("mongoose")
const dbConnect = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected successfully");
    }catch(error){
        console.log(error)
    }
}

module.exports = dbConnect;