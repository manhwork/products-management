const mongoose = require('mongoose');

// Hàm connect là hàm tự định nghĩa
module.exports.connect = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success");
        
    } catch (error) {
        console.log("Connect Error");
        
    }
}