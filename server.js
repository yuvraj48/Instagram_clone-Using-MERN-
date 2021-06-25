const express = require("express");
const app = express();
const mongoose = require('mongoose');
const  cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const {MONGO_URI} = require('./config/dev')
//routes

//connection vWgkxD6rmKCwCnr1

//working site
//https://instagram1109.herokuapp.com/login


mongoose.connect(MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
});
const db=mongoose.connection
  db.once('open', () => {
    console.log('DB connected');
  })

//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(require("./routes/auth"));
app.use(require("./routes/Post"));
app.use(require("./routes/User"));
app.use(cookieParser());

const port = process.env.PORT || 9000
if(process.env.NODE_ENV=="production"){
  app.use(express.static('frontend/build'))
  const path =require('path')
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,'frontend','build','index.html'))
  })
}
app.listen(port,()=>{
    console.log(`app is running at ${port}`);
  });

