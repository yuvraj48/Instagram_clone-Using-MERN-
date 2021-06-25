
import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { isAutheticated } from '../Sign/Helper';
import {BeatLoader} from 'react-spinners'

const UserProfile=()=> {
    const [mypics,setPics]=useState(null)
    const {user,token}= isAutheticated();
   const {user:{followers,following
         }}=isAutheticated();
   const {userid}= useParams();
  
 


   const followperson=()=>{
    fetch(`/fam/${user._id}`,{
        method:"put",
        headers:{
            "Content-type":"application/json",
             Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({
            followId:userid
        })
    }).then(res=>res.json())
    .then(result=>{
        
       
       setPics((foll)=>{
        return {
               ...foll,       
            user:{
                ...foll.user,
                followers:[...foll.user.followers,result._id]
               }
        }
    })
 
        
    })

}

const unfollowUser = ()=>{
    fetch(`/unfolow/${user._id}`,{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${token}`
        },
        body:JSON.stringify({
            unfollowId:userid
        })
    }).then(res=>res.json())
    .then(data=>{
        
        
        
         setPics((foll)=>{
            const newFollower = foll.user.followers.filter(item=>item != data._id )
             return {
                 ...foll,
                 user:{
                     ...foll.user,
                     followers:newFollower
                    }
             }
         })
       
    })
}


    useEffect(() => {
        fetch(`/profile/${userid}`,{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result.user.pic)
          setPics(result);
            

        })
        
    }, [])

    return (
        <>
           {mypics ?
        <div className="container p-4 ">
            <div   style={{display:"flex",justifyContent:"space-around" }}>
                {!mypics.user.pic.length==0 ?
                <div>
                <Avatar src={mypics.user.pic.slice(-1)[0]} style={{width:"150px",height:"150px" ,borderRadius:"80px"}}/>
                
                </div>:
                <div> <Avatar style={{width:"150px",height:"150px" ,borderRadius:"80px"}}/></div>
           }
                <div className=" mr-5 ">
                    <h4>{mypics.user.name}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%"}}>
                          <h5>{mypics.posts.length}</h5>
                        <h5>{mypics.user.followers.length}</h5>
                        <h5>{mypics.user.following.length}</h5>
                    </div>
                    {mypics.user.followers.includes(user._id)?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue btn-primary darken-1"
                  
                    onClick={()=>unfollowUser(userid)}
                    >
                       Unfollow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light btn-primary  darken-1"
                    onClick={()=>followperson(userid)}
                    >
                     Follow
                    </button>
                    }
                </div>
            </div>
            <div className="card-deck ml-md-5 mt-md-5 p-5 " style={{borderTop:"1px solid lightgrey"  }}>
            {
                    mypics.posts.map(items=>{
                        return(
                            <div className="card" style={{maxWidth:"300px", minHeight:"300px",maxHeight:"300px",minWidth:"250px"}}>
                                <img className="mb-auto mt-auto " src={items.photo} alt={items.title}/>
                                </div>

                        )
                    })
                }
            
         
         </div>


        </div>
          : <div className=" col-md-12 text-center  " style={{marginTop:"20%",marginBottom:"20%"}} >
          <BeatLoader />
          </div>
          }
        </>
    )
}


export default UserProfile;
