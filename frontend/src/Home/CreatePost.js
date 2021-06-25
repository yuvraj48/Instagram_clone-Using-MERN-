
import React, { useState,useEffect } from 'react';
import { useHistory } from 'react-router';
import {isAutheticated} from "../Sign/Helper";
import M from 'materialize-css';

const CreatePost=()=> {
    let history=useHistory()
    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    const {user,token}=isAutheticated()

    useEffect(() => {
        if(url){
            fetch(`/createpost/${user._id}`,{
                method:"post",
                headers:{
                    Accept:"application/json",
                    "Content-type":"application/json",
                     Authorization:`Bearer ${token}`
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                   M.toast({html:data.error,className:"#c62828 red-darken-3"})
                }
                else{
                   M.toast({html:"Post Uploaded Successfuly",className:"#43a047 green darken-3"})
                history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
            

        }
    
    }, [url])

    const postDetails=()=>{
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","dqidaoart")
        fetch("	https://api.cloudinary.com/v1_1/dqidaoart/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    
    }
    return (
        <div className="card input-filled" style={{
            margin:"10px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            
            <input className="mt-1" type='text' placeholder="title" onChange={(e)=>setTitle(e.target.value)} value={title}/>
            <input className="mt-2" type='text' placeholder="body" onChange={(e)=>setBody(e.target.value)} value={body}/>
           <div className="file-field input-field mr-auto">
            <div className="btn">
             <span className="p-1 bg-primary text-light mr-2" >File</span>
             <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
          
         </div>
         <button className="btn btn-success" onClick={()=>postDetails()}>POST</button>
  
        </div>
    )
}

export default CreatePost

