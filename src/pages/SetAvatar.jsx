import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import loader from '../assets/bece0c797cb134aefb2cb836578c9249.gif'
import {avatarRoute } from '../utils/APIRoutes'
import { Buffer } from 'buffer'

function SetAvatar() {
    const apiKey="15CeDPwvfBrYUy"
    const api=`https://api.multiavatar.com/4786545`
    const navigate=useNavigate()
    const [image,setImage]=useState([])
    const [isLoading,setIsLoading]=useState(true)
    const[selectedAvatar,setSelectedAvatar]=useState(undefined)
    
    const toastOptions={
        position:"bottom-center",
        autoClose:8000,
        pauseOnHover:true,
        draggable:true,
        theme:'dark',
    }
    useEffect(()=>{
        if(!(localStorage.getItem('chat-app-user'))){
            navigate('/login')
          }
    },[])
    useEffect(()=>{
        async function checkAvatar(){
            const user=await JSON.parse(localStorage.getItem("chat-app-user"))
            console.log(user)
            if(user.avatarImage){
                navigate('/chat')
            }
        }
        checkAvatar()
    },[])
    async function fetchData(){
        const arr=[];
        
        for(let i=0;i<4;i++){
            const {data}=await axios.get(`${api}/${Math.round(Math.random()*1000)}?apikey=${apiKey}`)
                const buffer=new Buffer(data)
                arr.push(buffer.toString("base64"))
           }
           setImage(arr)
           setIsLoading(false)
}
  

    const setProfilePicture=async(e)=>{
        e.preventDefault()
        if(selectedAvatar===undefined){
            toast.error("please select an avatar",toastOptions)
        }else{
            const user=await JSON.parse(localStorage.getItem("chat-app-user"))
            const {data}=await axios.post(`${avatarRoute}/${user._id}`,{
                image:image[selectedAvatar]
            })
            console.log(data.data.avatarImagesStatus)
            if(data.data.avatarImagesStatus===true){
                user.avatarImage=data.data.avatarImage
                localStorage.setItem("chat-app-user",JSON.stringify(user))
                navigate('/chat')
            }else{
                toast.error("Error setting avatar",toastOptions)
            }
        }
    };
       useEffect(()=>{
        
        
        fetchData()
       },[])
    
    return (
    <>
    {
        isLoading? <Container>
            <img src={loader} alt='loader' className="loader"/>
        </Container>:(

     
     <Container>
        
         <div className="title-container">
             <h1>
                 Pick an avatar as your profile
             </h1>
         </div>
         <div className="avatars">
             {image.map((avatar,index)=>{
                 
                    return(
                        <div 
                        key={index}
                         className={`avatar ${selectedAvatar===index ? "selected":""}`}>
                            <img src={`data:image/svg+xml;base64,${avatar}`} alt={"avatar"} onClick={()=>setSelectedAvatar(index)}/>


                        </div>
                       
                    )
                })
             }
         </div>
         <button className='submit-btn' onClick={(e)=>setProfilePicture(e)}>Set as profile picture</button>
         </Container>
            )
        }
     <ToastContainer/>
 
    </>
  )
  
}

const Container=styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
gap:3rem;
background-color:#131324;
height:100vh;
width:100vw;
.loader{
    max-inline-size:100%;
}
.title-container{
    h1{
        color:white;
    }
}
.avatars{
    display:flex;
    gap:2rem;
    .avatar{
      border:0.4rem solid transparent;
      padding:0.4rem;
      border-radius:5rem;
      display:flex;
      justify-content:center;
      align-items:center;
      transition:0.5s ease-in-out;
      
      img{
          height:6rem;
          cursor:pointer;
        }  
    }
    .selected{
        border:0.4rem solid #4e0eff;
    }
    
    
   
}
.submit-btn{
        background-color:#997afo;
        padding:1rem 2rem;
        font-weight:bold;
        cursor:pointer;
        font-size:1rem;
        text-transform:uppercase;
        border-radius:0.4rem;
        transition:0.5s ease-in-out;
        &:hover{
            background-color:#4e0eff
        }
    }
`

export default SetAvatar
