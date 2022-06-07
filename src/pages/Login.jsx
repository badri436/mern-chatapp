import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import {ToastContainer,toast} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios'
import { loginRoute } from '../utils/APIRoutes'
function Login() {

    const navigate=useNavigate()
    const [values,setValues]=useState({
        email:"",
        password:"",

    })
    const handleSubmit=async(event)=>{
        event.preventDefault()
        
       if(handleValidation()){
           
        const {password,email}=values
        const {data}=await axios.post(loginRoute,{
            email:email,
            password:password
        })
        
        if(data.status===false){
            toast.error(data.message,toastOptions)
        }
        if(data.status===true){
            localStorage.setItem('chat-app-user',JSON.stringify(data.data))
            navigate("/setAvatar")
        }
        }
           
            
          
        }
      
    

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

useEffect(()=>{
  if(localStorage.getItem('chat-app-user')){
    navigate("/setAvatar")
}
},[])
const handleValidation=()=>{
    const {password,confirmPassword,username,email}=values
    if(email==""){
        toast.error("email is required",toastOptions)
        return false
    }else if(password==""){
      toast.error("password is required",toastOptions)
      return false
  }
    return true

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
            <input type={"email"} placeholder="email" name="email" onChange={(e)=>handleChange(e)}></input>
            <input type={"password"} placeholder="password" name="password" onChange={(e)=>handleChange(e)}></input>
           
            <button type='submit'>Login</button>
            <span>Don't have an account ? <Link to="/register">Register</Link></span>
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
form {
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
        background-color:grey;
        padding:1rem 2rem;
        font-weight:bold;
        cursor:pointer;
        font-size:1rem;
        border: none;
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

export default Login