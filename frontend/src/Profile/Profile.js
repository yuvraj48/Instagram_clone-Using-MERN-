
import React, { useEffect, useState } from 'react'
import { Modal,Button, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { isAutheticated } from '../Sign/Helper';
import M from 'materialize-css';
import { useHistory } from 'react-router';
import { Avatar } from '@material-ui/core';
import {BeatLoader} from 'react-spinners'
const Profile=()=> {
    let history=useHistory()
    const [mypics,setPics]=useState([])
    const {user,token}= isAutheticated();
    const [modal,setModal] =useState(false);
    const [image,setImage]=useState("");
    const [url,setUrl]=useState("");
    const [picture,setPicture]=useState([]);
    const toggle=()=>setModal(!modal);
    const {
        user:{name,followers,following}

    }=isAutheticated();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 6000)
      }, []);

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
        fetch(`/mypost/${user._id}`,{
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${token}`
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result);
        

        })
        
    }, [])

   
    
    useEffect(() => {
        if(url){
            fetch(`/uploadurphoto/${user._id}`,{
                method:"put",
                headers:{
                    Accept:"application/json",
                    "Content-type":"application/json",
                     Authorization:`Bearer ${token}`
                },
                body:JSON.stringify({
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html:"Unable to save post",className:"#43a047 red darken-3"})
                }
                else{
                   M.toast({html:"Post Uploaded Successfuly",className:"#43a047 green darken-3"})
                history.push('/')
                }
            })
            .catch(err=>{
                console.log(err)
            })
            

        }
    
    }, [url])

    const uploadPic=()=>{
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
        <>
        {loading === false ? (    
        <div className="container p-4 ">
         
             
            <div   style={{display:"flex",justifyContent:"space-around" }}>
                <div style={{display:"flex"}}>
                {!picture.length==0?
            <div ><Avatar src={picture.slice(-1)[0]} style={{width:"150px",height:"150px" ,borderRadius:"80px"}}/></div>:
            <div><Avatar  style={{width:"150px",height:"150px" ,borderRadius:"80px"}}/></div>

            }
              
                    
                    <Button className="btn btn-sm" style={{fontWeight:"bold",maxHeight:"30px"}} color="success" onClick={toggle}>+</Button>
                 <Modal isOpen={modal} toggle={toggle}>
                 <ModalHeader>Upload Your Profile Pic</ModalHeader>
                 <ModalBody>
                 <div className="file-field input-field mr-auto">
            <div className="btn">
             <span className="p-1 bg-primary text-light mr-2" >File</span>
             <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
            </div>
          
         </div>
                 </ModalBody>
                 <ModalFooter> <button className="btn btn-success" onClick={()=>uploadPic()}>Upload pic</button></ModalFooter>
                 </Modal>
                </div>
                <div className=" mr-5 ">
                    <h4>{name}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"110%" }}>
                        <h5>{mypics?mypics.length:"0"} posts</h5>
                        <h5>{followers?followers.length:"0"} followers</h5>
                        <h5>{following?following.length:"0"} following</h5>
                       
                    </div>
                </div>
            </div>
            <div className="card-deck ml-md-5 mt-md-5 p-5 " style={{borderTop:"1px solid lightgrey"  }}>
                
                    {mypics.map(items=>{
                        return(
                            <div className="card" style={{maxWidth:"300px", minHeight:"300px",maxHeight:"300px",minWidth:"250px"}}>
                                <img className="mb-auto mt-auto " src={items.photo} alt={items.title}/>
                                </div>

                        )
                    })
                }
            
         
         </div>
        


        </div>
          ) : (
            <div className=" col-md-12 text-center  " style={{marginTop:"20%",marginBottom:"20%"}} >
            <BeatLoader />
            </div>
          )}
          </>
    )
}

export default Profile
