const express=require('express');
const route=express();
const d=require('../controllers/controller')
const imageUplod=require('../midlwares/imageUplod');
const  transporter = require('../controllers/transpoter');


route.get('/',d.defaaultRout);
route.get('/Dashboard',d.Dashboard);
route.get('/404',d.err);
route.get('/signup',imageUplod.single('imgfile'),d.signup);
route.get('/signin',d.signin);
route.post('/register',d.register);
route.post('/usersignin',d.usersignin);
route.get('/addblog',d.addblog);
route.post('/addBlog',imageUplod.single('imgfile'),d.addBlog)
route.get('/view',d.view)
route.get('/back',d.back)
route.get('/deleteDoc/:id',d.deleteDoc)
route.get('/editDoc/:id',d.editDoc)
route.post('/updateDoc',imageUplod.single('imgfile'),d.updateDoc)
route.get('/profile',d.profile)
route.get('/logOut',d.logOut)
route.post('/addProfile',imageUplod.single('imgfile'), d.addProfile)
route.get('/add/:id',d.add)
route.get('/changePassword',d.changePassword)
route.post('/changepass',d.changepass)
route.get('/forgotpass',d.forgotpass)
route.post('/forgotpassword',d.forgotpassword)
// route.post('/otp',d.otpsave)
route.get('/newpassword/:token',d.newpassword)
route.post('/newpass',d.newpass)


module.exports=route;