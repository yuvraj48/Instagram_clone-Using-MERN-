const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const posdataSchema = mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    body:{
        type:String,
        trim:true
    },
    photo:{
        type:String,
        required:true,
        trim:true
    },
    likes:[{type:ObjectId,ref:"users"}],
    
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"users"}
    }],
 
    postedBy: {
        type: ObjectId,
        ref: "users"
     },
     
   
   

});
module.exports=mongoose.model("instapost",posdataSchema);