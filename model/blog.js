const mongoose=require("mongoose")
const schema=mongoose.Schema({
    "name":String,
    "email":String,
    "password":{type:String,required:true}
})
let blogmodel=mongoose.model("users",schema)
module.exports={blogmodel}