const User = require("../models/Users");
const Insposts = require("../models/Instapost")

exports.getUserById = (req,res,next,id) => {
    User.findById(id)
    .populate("postedBy","_id")
    .exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"No user found in db"
            })
        }
        req.profile=user;
        next();
    });
};
exports.getSubpost=(req,res)=>{
    // if postedBy in following
Insposts.find({postedBy:{$in:req.profile.following}})
.populate("postedBy","_id name pic")
.populate("comments.postedBy","_id name")
.sort('-createdAt')
.then(posts=>{
    res.json({posts})
})
.catch(err=>{
    console.log(err)
})
}

 
exports.getUserprofile=(req,res)=>{
    req.profile.salt=undefined;
    req.profile.encry_password=undefined;
    req.profile.createdAt=undefined;
    req.profile.updatedAt=undefined;
    return res.json(req.profile );
}

exports.getUser = (req,res) => {
    let user = req.profile
    Insposts.find({postedBy: req.profile._id})
    .populate("postedBy","_id name pic")
    .exec((err,posts)=>{
        if(err){
            return res.status(400).json({
                error:"No post in this account"
            })
        }
        return res.json({user,posts})
    })
};


exports.follow=(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.profile._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.profile._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
};
exports.unfollow=(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.profile._id}
    },
    {new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.profile._id,{
            $pull:{following:req.body.followId}
        },{new:true}).then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    }
    )
};
exports.searchuser=(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({name:{$regex:userPattern}})
    .select("_id email name pic")
 
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
}

exports.getallusers=(req,res)=>{
    User.find()
    .exec((err,instapost)=>{
        if(err){
            return res.status(400).json({
                error:"NOt found"
            })
        }
        res.json(instapost);
    })
    
}

exports.updateuser=(req,res)=>{
    User.findByIdAndUpdate(
        {_id:req.user_id},
        {$set:req.body},
        {new:true,useFindAndModify:false},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"Failed to update"
                });
            }
            user.salt=undefined;
            user.encry_password=undefined;
            res.json(user);
        }
    )
};



exports.getProfile=(req,res)=>{
  
    User.findByIdAndUpdate(req.profile._id,{
        $push:{pic:req.body.pic}
    },{
        new:true
    })

    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
};