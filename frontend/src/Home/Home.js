import { Avatar, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { isAutheticated } from '../Sign/Helper';
import './Home.css';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Link } from 'react-router-dom';

const HomePage=() =>{
    const {user:{name}}=isAutheticated();
    const [data,setData]=useState([]);
    const [suggestion,SetSuggestion]=useState([])

    useEffect(() => {
        fetch(`/posts`,{
            headers:{
                "Content-type":"application/json",             
            }
        }).then(res=>res.json())
        .then(result=>{
            setData(result)
        })
        
    }, [])

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
        
    }, [])
     const {token,user}=isAutheticated();
     
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

    }
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
            setData(newData)
        })

    }
    return (
        <div className="container  ">
            <div className="row">
            <div className="  col-md-7 ml-5  ">
        {data.map(item=>{
            return(

        
        <div className="  post  " key={item._id} >
            <div className="post_header"> 
             
            <Avatar className="post_Avatar"
            alt="Loading"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"/>
                
            <h3><Link className="pl-3 text-secondary" to={item.postedBy._id !== user._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> {item.postedBy._id == user._id && <DeleteOutlineIcon  onClick={() => {
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
        </div>
        <div className="col-md-4 p-4 ml-3  " style={{maxHeight:"400px"}}>
            <div style={{display:"flex" }}>
            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80" style={{width:"50px",height:"50px" ,borderRadius:"80px"}} alt="...Loading"/>
            <h6 className="ml-3 mt-2">{name}</h6>

            </div>
            <div className=" m-0 " style={{overflow:"scroll"}}>
                <h6>Suggestions For You</h6>
                {
                    suggestion.map(data=>{
                        return(
                            <ul style={{listStyleType:"none",padding:"0",display:"flex",justifyContent:"space-between"}}>
                                <Link to ={"/profile/"+data._id}>
                                <li style={{display:"flex",color:"black"}} > <Avatar style={{width:"24px", height:"25px"}}/><h6 className="ml-md-3">{data.name}</h6></li>
                                </Link><button style={{color:"blue",border:"0"}}>Follow</button>
                            </ul>
                        )
                    })
                }
            </div>
      

        </div>
        
      
        </div>
        </div>
        
    )
}

export default HomePage;
