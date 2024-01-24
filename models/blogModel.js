const mongoose=require('mongoose');

const blogSchema=new mongoose.Schema({
    // title:{
    //     type: String
    // },
    admin_id:{
        type: String
    },
    title:String,
    description:String,
    imgpath:String,
    
})

const blogModel=mongoose.model('blogModel',blogSchema);

module.exports=blogModel;