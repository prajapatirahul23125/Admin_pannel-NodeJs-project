const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/profile').then(()=>{
    console.log("mongodb conected");
}).catch((err)=>{
    console.log("error");
});

module.exports=mongoose;