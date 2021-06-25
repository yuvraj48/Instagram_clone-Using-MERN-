const mongoose = require('mongoose');
var crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
uuidv4(); 
const { ObjectId } = mongoose.Schema;

var UserSchema = new mongoose.Schema(
    {
        name : {
            type:String,
            required:true,
            maxlength:32,
            trim:true
        },

        lastname:{
            type:String,
            maxlength:32,
            trim:true
        },

        email:{
            type:String,
            required:true,
            trim:true,
            unique:true
        },
      
        phone:{
            type:Number,
            maxlength:10,
            unique:true
        },
    
        role: {
            type: Number,
            default: 0
        },

        followers:[{type:ObjectId,ref:"users"}],
        following:[{type:ObjectId,ref:"users"}],
        
        pic:[{
            type:String,
           
        }],
         encry_password:{
            type:String,
            required:true
    
        },
        
    
        salt:String,

        
    
        userinfo:{ 
            type:String,
            trim:true
    
        }
    }
    );

    UserSchema
    .virtual("password")
    .set(function(password) {    
      this._password = password;
      this.salt = uuidv4();
      this.encry_password = this.securepassword(password);
    })
    .get(function() {
      return this._password;
    });
  UserSchema.methods={
  autheticate:function(plainpassword){
      return this.encry_password === this.securepassword(plainpassword);
  
  },
  securepassword:function (plainpassword){
      if(!plainpassword) return "";
      try{
          return crypto
          .createHmac("sha256",this.salt)
          .update(plainpassword)
          .digest("hex");
          }catch(err){
              return ""
  
          }
  
  }
  }
  module.exports=mongoose.model("users",UserSchema);
