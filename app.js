const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bcrypt=require("bcryptjs")
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

app.listen(8080,()=>{
    console.log("server started")
})