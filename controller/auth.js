const User = require("../models/Users");
const {  validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const {SECRET} =require("../config/prod")

exports.signup = (req, res) => {
  const errors = validationResult(req); //expressvalidator binds the validation result to req body

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB"
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "USER email does not exists"
      });
    }

    if (!user.autheticate(password)) {
      return res.status(401).json({
        error: "Email and password do not match"
      });
    }

    //create token
    const token = jwt.sign({ _id: user._id },SECRET);   
    //put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    //send response to front end
    const { _id, name, email ,followers,following,pic} = user; //destructure
    return res.json({ token, user: { _id, name, email,followers,following} });
  });
};

//signout
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout succesfully"
  });
};



exports.isSignedin=expressJwt({
  secret:process.env.SECRET,
   algorithms : ['HS256'] ,
  userProperty:"auth"  //payload:data
});//issigned in check the incoming request has valid jwt in authorizationheader.if the token is valid it will append the verified users id in auth key to request object 



//middleware 
exports.isAuthenticated=(req,res,next)=>{
  let checker = req.profile && req.auth && req.profile._id == req.auth._id
  if(!checker){
    return res.status(403).json({
      error:"Acess Denied "
    });
  }
  next();
};
