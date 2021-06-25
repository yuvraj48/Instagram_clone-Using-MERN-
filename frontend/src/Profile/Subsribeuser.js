import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { isAutheticated } from '../Sign/Helper';
import '../Home/Home.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Link ,useParams} from 'react-router-dom';
import { CardBody ,Card} from 'reactstrap';
import {BeatLoader} from 'react-spinners'
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';

const Subscribeduser=() =>{
  
    const {user:{name}}=isAutheticated();
    const {userid}= useParams();
    const [data,setData]=useState([]);
    const [picture,setPicture]=useState([]);
    const [suggestion,SetSuggestion]=useState([]);
    const {token,user}=isAutheticated();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 600)
      }, [])
      

    useEffect(() => {
       
        fetch(`/user/${user._id}`,{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            }
        }).then(res=>res.json())
        .then(result=>{
            setPicture(result.pic);          

        })
        
    }, []);

    useEffect(() => {
        fetch(`/allprofile`,{
            headers:{
                "Content-type":"application/json", 
                Authorization:`Bearer ${token}`            
            }
        }).then(res=>res.json())
        .then(result=>{
        
            SetSuggestion(result)
        })
        
    }, []);

 
   
    useEffect(() => {
        fetch(`/subpost/${user._id}`,{
            headers:{
                "Content-type":"application/json",  
                Authorization:`Bearer ${token}`           
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result.posts)
            
                   
        })
        
    }, [])
    
     
     const makeComment =(text,postId)=>{
         fetch(`/comments/${user._id}`,{
             method:"put",
             headers:{
                 "Content-type":"application/json",
                 Authorization:`Bearer ${token}`
             },
             body:JSON.stringify({
                 postId,
                 text
             })
         }).then(res=>res.json())
         .then(result=>{
             const newData=data.map(item=>{
                 if(item._id==result._id){
                     return result
                 }
                 else{
                     return item
                 }
             })
             setData(newData)
         })
     };

     const deletePost=(postId)=>{
         fetch(`/${postId}/${user._id}`,{
             method:"delete",
             headers:{
                 "Content-type":"application/json",
                 Authorization:`Bearer ${token}`
             }

         }).then(res=>res.json())
         .then(result=>{
             console.log(result);
             const newData = data.filter(item=>{
                 return item._id !==result._id
             })
             setData(newData)
         })
     };
     
     const followperson=(userid)=>{
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
            console.log(result)
            
        })
    };

    const unfollowUser = (userid)=>{
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
        .then(result=>{
            setData( result.followers.filter(item=>item!=result._id))
            

            
            
           
        })
    };

    const likepost=(id)=>{
        fetch(`/likes/${user._id}`,{
            method:"put",
            headers:{
                "Content-type":"application/json",
                 Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        })

    };


    const unlikepost=(id)=>{
        fetch(`/unlike/${user._id}`,{
            method:"put",
            headers:{
                "Content-type":"application/json",
                 Authorization:`Bearer ${token}`
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
        })

    }
    return (
        <div className="container  "> 
          <>
         {loading === false ? (                     
            <div className="row">
                
                {!data.length==0?
                   <div className="  col-md-7 ml-lg-5  ">
         
                   {data.map(item=>{
                     return(  
                     <div className="  post  " key={item._id} >
                     <div className="post_header"> 
                    
                      <Avatar src={item.postedBy.pic.slice(-1)[0]} className="post_Avatar"alt="Loading"/>
                        <h3><Link className="pl-3 text-secondary" to={item.postedBy._id !== user._id?"/profile/"+item.postedBy._id :"/profile"  }>
                            {item.postedBy.name}</Link> {item.postedBy._id == user._id && <DeleteOutlineIcon  onClick={() => {
                              deletePost(item._id);
                            }}className="ml-auto"/>}</h3>
        
        
                    </div>
                    <img className="post_image " src={item.photo} alt="...Loading"/>
                     <div>
                         {item.likes.includes(user._id)?
                         <IconButton onClick={()=>{unlikepost(item._id)}}>< FavoriteIcon style={{color:"red"}}/></IconButton>:
                         <IconButton onClick={()=>{likepost(item._id)}}> <FavoriteBorderIcon/></IconButton>}
                    
           
                      <h6 className="m-0 pl-2"> {item.likes.length} likes</h6>                 
                    <h5 className="post-text pl-2 m-0 "><strong>{item.postedBy.name}:</strong> {item.title}</h5>
                    <p className="m-0 p-0 pl-2 text-secondary">view comments</p>
                    {
                        item.comments.map(record=>{
                            return(
                                <h5 key={record._id} className=" pl-2 "><strong>{record.postedBy.name}:</strong> {record.text}</h5>
                            )
                        })
                    }
        
                    </div>
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        makeComment(e.target[0].value,item._id)
                    }}>
                    <input  className="col-12 post_border form-control p-4" type=" text" placeholder="Add a comment"/>
                    </form>
                    
                   
                </div>
                      )
                    })}
                   
                </div>:
                <div className="  col-md-7 ml-lg-5 mt-lg-5 ">
                  <Card style={{height:"330px"}}>
                      <CardBody className="text-center mt-2"><HomeOutlinedIcon  style={{fontSize:"80px",color:"#606060"}}/>
                        <div className="mt-4"><h2>Welcome To Instagram</h2></div>
                        <h5 className="text-secondary">When you follow people you will see photos they post here</h5>
                        <div className="mt-4"><Link to='/profile'  ><h6 style={{maxWidth:"200px ",textDecoration:"none"}} className="border ml-auto mr-auto bg-primary text-white p-2 ">Upload new profile pic</h6></Link></div>
                        </CardBody>
                  </Card>
                </div>
                
                }
            
          
         
         
        
        <div className="col-md-4 p-4 ml-3  " style={{maxHeight:"400px"}}>
            <div style={{display:"flex"}}>
            {!picture.length==0?
            <div ><Avatar src={picture.slice(-1)[0]}/></div>:
            <div><Avatar  style={{fontSize:"20px"}}/></div>

            }
            <h4 className="ml-3">{name}</h4>
            </div>
         
          
            <div className=" m-0 " style={{overflow:"scroll"}}>
                <h6>Suggestions For You</h6>
                {
                    suggestion.map(data=>{
                        return(
                            <ul style={{listStyleType:"none",padding:"0",display:"flex",justifyContent:"space-between"}}>
                                <Link to ={"/profile/"+data._id}>
                                <li style={{display:"flex",color:"black"}} > <Avatar src={data.pic.slice(-1)[0]} style={{width:"24px", height:"25px"}}/><h6 className="ml-md-3">{data.name}</h6></li>
                                </Link>{data.followers.includes(user._id)?
                                 <button style={{color:"blue",border:"0" }} onClick={()=>unfollowUser(data._id)}>unfollow</button>:
                                <button style={{color:"blue",border:"0" }} onClick={()=>followperson(data._id)}>Follow</button>
                                }
                            </ul>
                        )
                    })
                }
            </div>
         </div>  
        
        </div>
        ) : (
            <div className=" col-md-12 text-center  " style={{marginTop:"20%",marginBottom:"20%"}} >
            <BeatLoader />
            </div>
          )}
          </>
       
     </div>
        
    )
}

export default Subscribeduser;
