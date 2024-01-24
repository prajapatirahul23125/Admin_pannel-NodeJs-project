const express=require('express');
const app=express();
const route=require('./routes/route');
const body_parser=require('body-parser');
const db=require('./db/config')
const port=3020;
const cookie_parser=require('cookie-parser')

app.set("view engine","ejs");
app.use(body_parser.urlencoded({extended:false}));
app.use(cookie_parser());
app.use('/',route);
app.use(express.static('views'));
app.use('/views/img',express.static('./views/img'))
// app.use(express.static(path.join(__dirname, 'views')));

db
app.listen(port,(req,res)=>{
    console.log(`Server run on port ${port}`);
})