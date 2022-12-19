const express=require('express')
var cors = require('cors')

const Jwt=require('jsonwebtoken')
const jwtKey='Tic-Tac-Toe'

var app = express()
app.use(cors())
require('./db/config')
const User=require('./db/User');
app.use(express.json())


app.post("/register",async(req,resp)=>{
   let user=new User(req.body);
   let result= await user.save();
   result=result.toObject(); 
   delete result.password;
   Jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
      if(err){
         resp.send({result:'Something Went Wrong Please Try After Sometime...'});
      }
      resp.send("Account Created Successfully");
   })
})
app.post("/login", async(req,resp)=>{
   console.log("data")
   if(req.body.password && req.body.email){
      let user =await User.findOne(req.body).select("-password");
      if(user){
         Jwt.sign({user},jwtKey,{expiresIn:"2h"},(err,token)=>{
            if(err){
               resp.send({result:'Something Went Wrong Please Try After Sometime...'});
            }
            resp.send({user,auth:token});
         })
      }
      else{
         resp.send({result:'No user found'});
      }
   }
   else{
       resp.send({result:'No user found'});
   }
  
})


function verifyToken(req,resp,next){
   let token=req.headers['authorization'];
   if(token){
      token=token.split(' ')[1];
      
      Jwt.verify(token,jwtKey,(err,valid)=>{
         if(err){
            resp.status(401).send({result:"Please Provide Valid Token..."})
         }
         else{
             next()
         }
      })
   }
   else{
      resp.status(403).send({result :"Please Add Token With Header"})
   }

   
}
 app.listen(5000);