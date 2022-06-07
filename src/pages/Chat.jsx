import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allUserRoute,host } from '../utils/APIRoutes'
import styled from 'styled-components'
import Contact from '../components/Contact'
import Welcome from '../components/Welcome'
import Chatcontainer from '../components/Chatcontainer'
import {io, Socket} from "socket.io-client"
import Logout from '../components/Logout'
function Chat() {
  const socket=useRef()
  const [contacts,setContacts]=useState([])
  const [currentUser,setCurrentUser]=useState(undefined)
  const [currentChat,setCurrentchat]=useState(undefined)
  const [isLoaded,setIsloaded]=useState(false)

  const navigate=useNavigate()
  
  useEffect(()=>{
    async function checkUser() {
  
      if((localStorage.getItem('chat-app-user'))){
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
        setIsloaded(true)
      }else{
        navigate('/login')
        
      }
    }
    checkUser()
  },[])

  useEffect(()=>{
    async function check(){
      if(currentUser){
        socket.current=io(host)
        socket.current.emit("add-user",currentUser._id)
      }
    }
check()
  },[currentUser])
  
  useEffect(()=>{
    async function fetchData() {
      if(currentUser){
        if(currentUser.avatarImage){
          const {data}=await axios.get(`${allUserRoute}/${currentUser._id}`)
          setContacts(data.data)
        }else{
          navigate('/setAvatar')
        }
      }
      
    }
    fetchData()
  },[currentUser])
  console.log(currentUser)
  const handleChatchange=async(chat)=>{
    setCurrentchat(chat)
  }
  return (
    <Container>

      <div className="container">
     
      <Contact contacts={contacts} currentUser={currentUser} changeChat={handleChatchange}/>
      {
        isLoaded && currentChat===undefined ? (<Welcome currentUser={currentUser}/>):(
        <Chatcontainer currentChat={currentChat} currentUser={currentUser} socket={socket}/> )
      }
     
      </div>
      <div className="logout">
      <Logout/>
      </div>
     
    </Container>  )
}

const Container=styled.div`
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;

.container{
  height: 85vh;
  width: 85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;

  @media screen and (min-width: 720px) and (max-width:1080px) {
    grid-template-columns: 35% 65%;
    
  }
}
`

export default Chat