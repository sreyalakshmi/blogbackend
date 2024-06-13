const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const{blogmodel}=require("./model/blog")
mongoose.connect("mongodb+srv://sreya:sreya123@cluster0.rk6cqoj.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")
const app=express()
app.use(cors())
app.use(express.json())

const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}


app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let blog=new blogmodel(input)
    blog.save()
    console.log(blog)
    res.json({"status":"success"})
})

app.post("/signin",(req,res)=>{
   let input=req.body
   blogmodel.find({"email":req.body.email}).then(
    (response)=>{
        if (response.length>0) {
            let dbPassword=response[0].password
            console.log(dbPassword)
            bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                if (isMatch) {
                   jwt.sign({"email":input.email},"blog-app",{expiresIn:"1d"},
                   (error,token)=>{
                    if (error) {
                        res.json({"status":"unable to create token"})
                    } else {
                        res.json({"status":"success","userid":response[0]._id,"token":token})
                    }
                   }
                )
                } else {
                    res.json({"status":"incorrect"})
                }
            })
            
        } else {
            res.json({"status":"user not found"})
        }
        }
   ).catch()
})

app.listen(8080,()=>{
    console.log("server started")
})