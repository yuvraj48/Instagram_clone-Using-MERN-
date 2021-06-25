const express = require("express")
const router=express.Router()

const {isSignedin,isAuthenticated} =require("../controller/auth");
const { createPost,postgetbyid,getallpost,getpost ,getlikes,getunlike,getuserpic,getComments,deletepost} = require("../controller/Post");
const {getUserById} = require("../controller/User");



router.param("userId",getUserById);
router.param("PostId",postgetbyid);

router.post('/createpost/:userId',isSignedin,isAuthenticated,createPost);
router.get('/posts',getallpost);

router.get('/mypost/:userId',isSignedin,isAuthenticated,getpost);
router.get('/userpic',getuserpic);
router.put('/likes/:userId',isSignedin,isAuthenticated,getlikes);
router.put('/comments/:userId',isSignedin,isAuthenticated,getComments);
router.put('/unlike/:userId',isSignedin,isAuthenticated,getunlike);
router.delete('/:PostId/:userId',isSignedin,isAuthenticated,deletepost);

module.exports = router;