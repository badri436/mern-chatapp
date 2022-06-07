import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { registerRoute } from '../utils/APIRoutes'
export default function Register() {

    const navigate=useNavigate()
    const [values,setValues]=useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:""

    })
   

    const handleChange=(e)=>{
        setValues({...values,[e.target.name]:e.target.value})
}

const toastOptions={
    position:"bottom-center",
    autoClose:8000,
    pauseOnHover:true,
    draggable:true,
    theme:'dark',
}
const handleValidation=async()=>{
    const {password,confirmPassword,username,email}=values
    if(password!==confirmPassword){
        toast.error("password and confirm password should be same",toastOptions)
        return false;

    }else if(username.length<3){
        toast.error("username should be greater than 3 characters",toastOptions)
        return false
    }else if(password.length<8){
        toast.error("password should be equal or greater than 8 characters",toastOptions)
        return false
    }else if(email==""){
        toast.error("email is required",toastOptions)
        return false
    }
    return true

}
const handleSubmit=async(event)=>{
    event.preventDefault()
    
   if(handleValidation()){
       
    const {password,confirmPassword,username,email}=values
    const {data}=await axios.post(registerRoute,{
        username:username,
        email:email,
        password:password
    })
    
    if(data.status===false){
        toast.error(data.message,toastOptions)
    }else{

        localStorage.setItem('chat-app-user',JSON.stringify(data.data))
        navigate("/setAvatar")
   
    }
       
        
      
    }
}

  return (
    <>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className="brand">
                <img/>
                <h1>
                snappy
                </h1>
            </div>
            <input type={"text"} placeholder="username" name="username" onChange={(e)=>handleChange(e)}></input>
            <input type={"email"} placeholder="email" name="email" onChange={(e)=>handleChange(e)}></input>
            <input type={"password"} placeholder="password" name="password" onChange={(e)=>handleChange(e)}></input>
            <input type={"password"} placeholder="confirm password" name="confirmPassword" onChange={(e)=>handleChange(e)}></input>
            <button type='submit'>Create user</button>
            <span>Already have an account ?<Link to="/login">login</Link></span>
        </form>
    </FormContainer>
    <ToastContainer/>
    </>
  )
}

const FormContainer=styled.div`
height:100vh;
width:100vw;
display:flex;
flex-direction:column;
justify-content:center;
gap:1rem;
align-items:center;
background-color:blue;

.brand{
    display:flex;
    align-items:center;
    justify-content:center;
}
h1{
    color:white;
    text-transform:uppercase
}
form{
    display:flex;
    flex-direction:column;
    gap:2rem;
    background-color:#00000076;
    border-radius:2rem;
    padding:3rem 2rem;

    input{
        background-color:transparent;
        padding:1rem;
        border:0.1rem solid #4e0eff;
        border-radius:0.4rem;
        color:white;
        width:100%;
        font-size:1rem;
        &:focus{
            border:0.1rem solid #997af0;
            outline:none;
        }
    }
    button{
       background-color: #00000076;
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
    span{
        color:white;
        text-transform:uppercase;
        
    }
    a{
        color:#4e0eff;
        text-transform:none;
        font-weight:bold;
        cursor:pointer;
        text-decoration:none;
    }
}
`
