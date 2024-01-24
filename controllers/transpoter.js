const nodemailer = require("nodemailer");
const userModel=require('../models/userModel')
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "prajapatirahul7043@gmail.com",
    pass: "thdbsiiyzrghekwb",
  },
});

const mail=async(req,res)=>{
  const {uid}=req.cookies;
  const user=await userModel.findById(uid);
    console.log("user",user);
    const info = await transporter.sendMail({
    from: 'prajapatirahul7043@gmail.com', // sender address
    to: user.email, // list of receivers
    subject: "Just for test mail", // Subject line
    html: "<h2>Mail send success</h2>", // html body
  });
  res.send("Mail send success")
  console.log("Message sent: %s", info.messageId);
}


module.exports={mail};