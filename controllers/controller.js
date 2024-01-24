const userModel=require('../models/userModel');
const blogModel=require('../models/blogModel');
const profileModel=require('../models/profileModel');
const bcrypt=require('bcrypt')
const cookies=require('cookies');
const nodemailer = require("nodemailer");
// const linkPreviewGenerator =require("link-preview-generator");
const randomstring = require("randomstring");

const fs=require('fs')
var user_id;


const defaaultRout= async(req ,res)=>{
    const data=await userModel.find();
    const user = data.filter((u) =>{
        return user_id == u.id;
    })
    const logIn=req.cookies;
    if(logIn.uid){

        res.render('index',{user:user[0]})
    }
    else{
        res.redirect('/signin')
    }
 
};
const Dashboard=(req ,res)=>{
    res.redirect('/');
    // res.render('index.ejs');
};
const signup=(req,res)=>{
    res.render('signup');
}
const signin=(req,res)=>{
    res.render('signin');
}

const err=async(req,res)=>{
    const data=await userModel.find();
    const user = data.filter((u) =>{
        return user_id == u.id;
    })
    res.render('404.ejs',{user:user[0]});
}

const addblog=async(req,res)=>{
    const data=await userModel.find();
    const user = data.filter((u) =>{
        return user_id == u.id;
    })

        res.render('add-blog',{user:user[0]})

}
const register=async (req,res)=>{
    // console.log("req.body",req.body);
    const {name,email,password,conf_password,token}=req.body;
    try{
        const salt=10;
        const  enPass=await bcrypt.hash(password, salt)
        const newUser= new userModel({
            name,email,password:enPass,token:""
        })
        await newUser.save();
        console.log("newuser",newUser);
        if(password===conf_password){
            console.log("user_id",user_id);
            const transporter =await nodemailer.createTransport({
                service: "Gmail",
                port: 465,
                secure: true,
                auth: {
                  // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                  user: "prajapatirahul7043@gmail.com",
                  pass: "thdbsiiyzrghekwb",
                },
            });
                 
            // const {uid}=req.cookies;
            const user=await userModel.findOne();
            // const user=users.filter((ans)=>{
                
            // })
                console.log("user",user);
                const info = await transporter.sendMail({
                from: '<prajapatirahul7043@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "Thanks for signup", // Subject line
                html: "<h2>Thanks for signup</h2>", // html body
            });
            res.render('signin')
            // res.send("Mail send success")
            // console.log("Message sent: %s", info.messageId);
            
        // res.send("register success");
            
        }
        else{
            res.redirect('back');
        }
    }
    catch(err){
        console.log("db err",err);
        res.redirect('back');
    }
   
}



const usersignin=async (req,res)=>{
    console.log("signin",req.body);
    try{
        const users=await userModel.find();
        
        // console.log("user",users);
        let user = users.filter((ans)=>{
            return ans.email==req.body.email;
        });
        console.log("email match..");
            if(user.length==0){
                console.log("user created..");
            }
            else{
                const dPass = await bcrypt.compare(req.body.password,user[0].password)
                console.log("dpass",dPass);
                if(dPass){
                    console.log("password match..");
                    user_id = user[0].id;
                    let myCookies={
                        httpOnly:true,
                    }
                    res.cookie('uid',user[0].id,myCookies)
                    res.redirect('/');
                }
                else{
                    console.log("password err...");
                    res.redirect('back');
                }
            }
                    
    }catch(err){
        console.log("Sinin err",err);
        res.redirect('back');
    }
    
}

const changepass=async(req,res)=>{
    const {uid}=req.cookies;
    const {oldpassword,newpassword,confpassword}=req.body;
    console.log("uid",uid);

    const user=await userModel.findById(uid);
    console.log("user",user);

    const cPass = await bcrypt.compare(oldpassword,user.password)
    console.log("cpass",cPass);
    if(cPass){
        if (newpassword == confpassword) {
            const sratio = 10;
            const enpass =await bcrypt.hash(newpassword , sratio);
            const updatepass=await userModel.findByIdAndUpdate(uid,{password:enpass})
            console.log("updatepass",updatepass);
            res.redirect('/')
        } 
        else{
            console.log("your new pass is not match your conf password");
        }
    }else{
        console.log("yor pass is not math");
    }
    

}

const logOut=(req,res)=>{
    res.clearCookie('uid');
    res.redirect('/signin');

}
const addBlog=async (req,res)=>{
    try{
        const newBlog=await new blogModel({
            title:req.body.title,
            description:req.body.description,
            imgpath:req.file.path,
            admin_id: user_id
        }); 
        newBlog.save();
       res.redirect('/addblog');
    }
    catch(err){
        console.log("add blog err",err);
        res.redirect('back');
    }
   
}

const view=async (req,res)=>{
    try{
        // const blogview= await blogModel.find();
        // res.render('index.ejs', {});
        const blogs=await blogModel.find();
        // console.log("blog====",blogs);
        res.render('viewblog.ejs',{blogs:blogs,user_id});
    }
    catch(err){
        console.log("err",err);
    }
}
const back=(req,res)=>{
    res.redirect('/addBlog');
}

const deleteDoc=async (req,res)=>{
    console.log("id",req.params);
    try{
        const deletefile=await blogModel.findByIdAndDelete(req.params.id);
        fs.unlink(deletefile.imgpath,()=>{
            res.redirect('/view');
        })
        
    }
    catch(err){
        console.log("delete err",err);
    }
}
const editDoc=async(req,res)=>{
    try{
        const data=await userModel.find();
        const user = data.filter((u) =>{
            return user_id == u.id;
        })
    
        let singleDoc=await blogModel.findById(req.params.id)
        console.log("singleDoc====",singleDoc);
        res.render('editblog.ejs',{singleDoc,user:user[0]})
    }
    catch(err){
        console.log("edit err",err);
    }
    
}

const updateDoc=async (req,res)=>{

    const {id ,title,description}=req.body;
    const imgpath=req.file.path;
    try{
        const oldData= await blogModel.findById(id)
        fs.unlink(oldData.imgpath,()=>{
            console.log("success");
        })
        const updatedata=await blogModel.findByIdAndUpdate(id,{title:title, description:description, imgpath:imgpath})
        console.log("Update====",updatedata);
        res.redirect('/view');
    }
    catch(err){
        console.log("update err",err);
    }

    
}

const addProfile =async (req, res) => {

    try{
        console.log('file',req.file);

        const {name, age, specialty, skils, email,description} = req.body
        let addProfile =await new profileModel({
            name,
              specialty,
              skils,
            //   gender,
            //   dob,
            //   contact,
              email,
              age,
              description,
            //   country,
            //   city,
              imgpath: req.file.path,
              userId:user_id
        });
        
        addProfile.save()
        res.redirect('/profile')
    }catch(err){
        console.log(err);
    }

}

const profile=async (req,res)=>{
    // const data=await userModel.find();
    // const userdata = data.filter((u) =>{
    //     return user_id == u.id;
    // })

    const profileData=await profileModel.find();
    const users=await userModel.find();

    const user = users.filter((u) =>{
        return user_id == u.id;
    })

    const profileUser = profileData.filter((user) =>{
        return user_id == user.userId;
    })

    console.log("user",user);

    res.render('profile',{user : user[0],profileUser,user_id});
}

const add=async(req,res)=>{
    try{
        const users=await userModel.find();

        const user = users.filter((u) =>{
        return user_id == u.id;
    })
        let singleDoc=await userModel.findById(req.params.id)
        console.log("singleDoc====",singleDoc);
        res.render('addProfile',{singleDoc,user:user[0]})
    }
    catch(err){
        console.log("edit err",err);
    }
}


const changePassword=(req,res)=>{
    res.render('changePassword');
}

const forgotpass=(req,res)=>{
    res.render('forgotPassword');
}
const forgotpassword=async(req,res)=>{
    try{
        const users=await userModel.find();
        const user = users.filter((ans)=>{
            return ans.email==req.body.email;
        });
        console.log("email match..");
        if(user){
            let myCookies={
                httpOnly:true,
            }
            res.cookie('uid',user[0].id,myCookies)
            const token = await randomstring.generate();
              console.log("previewData",token);
              
                const newupdate=await userModel.findByIdAndUpdate(user[0].id,{token})
                console.log("newupdate",newupdate);
    
    
                const transporter =await nodemailer.createTransport({
                    service: "Gmail",
                    port: 465,
                    secure: true,
                    auth: {
                      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                      user: "prajapatirahul7043@gmail.com",
                      pass: "thdbsiiyzrghekwb",
                    },
                });
                     
                // const {uid}=req.cookies;
                const userupdate=await userModel.findById(user[0].id);
                // const user=users.filter((ans)=>{
                    
                // })
                    console.log("user",userupdate);
                    const info = await transporter.sendMail({
                    from: '<prajapatirahul7043@gmail.com>', // sender address
                    to: userupdate.email, // list of receivers
                    subject: "Forgot password", // Subject line
                    html: `<p>update pass<a href='http://localhost:3020/newpassword/${token}'>http://localhost:3020/newpassword/${token}</a></p>`, // html body
                    });
              res.redirect('/signin')
        }
        else{
            res.redirect('/404')
        }
        
        
    }catch(err){
        console.log("token err");
    }     
}
const newpassword=async(req,res)=>{
    const {uid}=req.cookies;
    const {token}=req.params;
    const users=await userModel.findById(uid)
    console.log("uptoken",req.params);
    if(users.token==token){
        res.render('newPass');
    }
    else{
        res.redirect('/404')
    }
}
// const otpsave=(req,res)=>{
//     const {otp}=req.cookies;
//     if(otp==req.body.otp){
//         res.render('newPass')
//     }
//     else{
//         res.redirect('/forgotpass')
//     }
// }
const newpass=async(req,res)=>{
    const {newpassword,confpassword}=req.body;
    const {uid}=req.cookies;
    if (newpassword == confpassword) {
        const sratio = 10;
        const enpass =await bcrypt.hash(newpassword , sratio);
        const updatepass=await userModel.findByIdAndUpdate(uid,{password:enpass,token:''})
        console.log("updatepass",updatepass);
        res.render('signin')
    } 
    else{
        res.redirect('/404')
    }
}






module.exports={defaaultRout,err,Dashboard,signup,register,signin,usersignin,addblog,addBlog,view,back,deleteDoc,editDoc,updateDoc,profile,addProfile,add,logOut,changePassword,changepass,forgotpass,forgotpassword,newpass,newpassword}
