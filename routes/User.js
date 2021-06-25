const express = require("express");
const router = express.Router();


const {getUser,getProfile,getUserById,updateuser,follow,unfollow,getallusers,searchuser,getSubpost,getUserprofile} = require("../controller/User");
const {isAuthenticated,isSignedin} = require("../controller/auth");
const {postgetbyid} = require("../controller/Post")
router.param("userId",getUserById);
router.param("postId",postgetbyid);

router.get("/profile/:userId",isSignedin,getUser);
router.get("/allprofile",isSignedin,getallusers);
router.put("/fam/:userId",isSignedin,follow)
router.put("/unfolow/:userId",isSignedin,unfollow)
router.put("/user/:userId",isSignedin,isAuthenticated,updateuser);
router.post("/searching",searchuser);
router.get("/subpost/:userId",isSignedin,getSubpost)
router.put("/uploadurphoto/:userId",isSignedin,getProfile)
router.get("/user/:userId",isSignedin,getUserprofile);




module.exports=router;