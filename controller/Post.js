const InsPosts = require("../models/Instapost");



exports.postgetbyid =(req,res,next,id)=>{
    InsPosts.findById(id)
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err){
            return res.status(400).json({
                error:"Not Found"
            })
        }
    
    req.Posts=post
    next();
    }
    )
}

exports.createPost=(req,res)=>{
    const {title,body,pic}=req.body
   
    if(!title||!body||!pic){
        return res.status(422).json({error:"ADD all the fields"})
    }
    req.profile.salt=undefined;
    req.profile.encry_password=undefined
    
    
    const peeps = new InsPosts({
       title,
       body,
       photo:pic,
       postedBy:req.profile

    })
    peeps.save((err,people)=>{
        if(err){
            return res.status(400).json({
                error:"Not able to save"
            })
        }
        res.json({people})
    })
};

exports.getallpost=(req,res)=>{
    InsPosts.find()    
    .populate("postedBy","_id name")
    .populate("picture","profilepic")
    .populate("comments.postedBy","_id name")
    .exec((err,instapost)=>{
        if(err){
            return res.status(400).json({
                error:"NOt found"
            })
        }
        res.json(instapost);
    })
};

exports.getpost=(req,res)=>{
    InsPosts.find({postedBy:req.profile._id})
    .populate("postedBy","_id name pic ") 
    .exec((err,mypost)=>{
        if(err){
            return res.status(400).json({
                error:"NOt found"
            })
        }
        res.json(mypost);
    })
};
exports.getuserpic=(req,res)=>{
    InsPosts.find({postedBy:req.profile._id})
    .populate("postedBy","_id name pic ") 
    .exec((err,mypost)=>{
        if(err){
            return res.status(400).json({
                error:"NOt found"
            })
        }
        res.json(mypost);
    })
};

exports.getlikes=(req,res)=>{
    InsPosts.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.profile._id}
    },{
        new:true,
        useFindAndModify:false
    })
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
}
exports.getunlike=(req,res)=>{
    InsPosts.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.profile._id}
    },{
        new:true,
        useFindAndModify:false
    })
    
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
}


exports.getComments=(req,res)=>{
    const comment = {
        pic:req.body.pic,
        postedBy:req.profile._id
    }
    User.findByIdAndUpdate(req.profile._id,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name")
    .populate("postedby","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
};

exports.deletepost=(req,res)=>{
    let InsPost=req.Posts
    if(InsPost.postedBy._id.toString() === req.profile._id.toString()){
        InsPost.remove((err,result)=>{
            if(err){
              return res.status(400).json({
                error: "Product failed to delete "
              });
            }
            res.json(result)
          })
        }
        
    }


