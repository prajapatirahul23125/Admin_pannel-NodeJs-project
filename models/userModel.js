const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type: String, required: true
    },
    email:{
        type: String, required: true
    },
    password:{
        type: String, required: true
    },
    imgpath: {
        type: String,
    
      },

    token:{
        type:String,
        required:false
    }
})

const userModel=mongoose.model('userModel',userSchema);

module.exports=userModel;