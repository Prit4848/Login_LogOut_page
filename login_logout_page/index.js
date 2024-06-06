const express = require("express");
const app = express();
const userModel = require('./models/user')
const path = require('path');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

app.use(cookieParser())
app.set("view engine","ejs")
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));

app.get('/',function(req,res){
    res.render("index")
})

app.post('/create', function(req,res){
    let { username,email,password,age} = req.body;

    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(password,salt,async (err,hash)=>{
            // console.log(hash)
            let user = await userModel.create({
                    username,
                    email,
                    password: hash,
                    age
                 })

                 let token = jwt.sign({email},"prprpr");
                 res.cookie("token",token);
                 res.send(user)
        })
    })
    //  let user = await userModel.create({
    //     username,
    //     email,
    //     password,
    //     age
    //  })

     
})
app.get('/login',function(req,res){
    res.render("login")
})

app.post('/login',async function(req,res){
    let { email,password} = req.body;
    let user =await userModel.findOne({email : req.body.email},)
    if(!user) return res.send("something is wrong!")
    
    bcrypt.compare(req.body.password,user.password,function(err,result){
        if(result){
            let token = jwt.sign({email:user.email},"prprpr");
            res.cookie("token",token);
            res.send("you are login ")
        } 
        else res.send("something is wrong !!!")
    })
})
app.get('/logout',function(req,res){
    res.cookie("token","")
    res.redirect('/')
})


app.listen(3000)