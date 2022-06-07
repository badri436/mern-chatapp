import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { getAllMessageRoute, sendMessageRoute } from '../utils/APIRoutes'
import Chatinput from './Chatinput'
import Logout from './Logout'
import {v4 as uuidv4} from "uuid"
import Messages from './Messages'
function Chatcontainer({currentChat,currentUser,socket}) {
    const [messages,setMessages]=useState([])
    const [arrivalMessage,setArrivalMessage]=useState(null)
    const [isLoading,setIsLoading]=useState(false)
   const scrollRef=useRef()
   
    useEffect(()=>{
        async function getMessages(){
            if(currentChat){
        const response=await axios.post(getAllMessageRoute,{
            from:currentUser._id,
            to:currentChat._id
        })
        console.log(response.data)
        setMessages(response.data)
        setIsLoading(true)
    }
    }
    getMessages()
    
    },[currentChat])
    
    const handleSendmsg=async(msg)=>{
       const {data}=await axios.post(sendMessageRoute,{
           from:currentUser._id,
           to:currentChat._id,
           message:msg
       })
      socket.current.emit("send-msg",{
          to:currentChat._id,
          from:currentUser._id,
          message:msg
      })

      const msgs=[...messages]
      msgs.push({fromSelf:true,message:msg})
      setMessages(msgs)
    }

    useEffect(()=>{
    async function checkSocket(){ 
        if(socket.current){
            socket.current.on("msg-receive",(msg)=>{
                setArrivalMessage({fromSelf:false,message:msg})
            })
        }
    }
        checkSocket()
},[])

    useEffect(()=>{
        async function checkArrival(){
        arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage])
        }
        checkArrival()
    },[])

    useEffect(()=>{
        async function scroll(){
        scrollRef.current?.scrollIntoView({behaviour:"smooth"})
        }
        scroll()
    },[messages])


    const navigate=useNavigate()
    useEffect(()=>{
        if(!(localStorage.getItem('chat-app-user'))){
            navigate('/login')
          }
    },[])

  return (
  <>
      {
      currentChat && (<Container>
      <div className="chat-header">
          <div className="user-details">
              <div className="avatar">
              <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt={"avatar"} />
              </div>
              <div className="username">
                  <h3>{currentChat.name}</h3>
              </div>
          </div>
          <Logout/>
      </div>

     <div className="chat-messages">
         {
             isLoading && 
             messages.map((message)=>{
                return (
                    <div ref={scrollRef} key={uuidv4()}>
                    <div className={`message ${message.fromSelf ? "sended":"received"}`}>
                    <div className="content">
                        <p>
                            {message.message}
                        </p>
                    </div>
                    </div>
                    </div>
                )
             })
         }
     </div>
    <Chatinput handleSendmsg={handleSendmsg}/>
      
  </Container>
      )
}
      </>
      )
}
const Container=styled.div`
display: grid;
grid-template-rows: 10% 78% 12%;
gap: 0.1rem;
overflow: auto;
&::-webkit-scrollbar{
    width: 0.2rem;
    &-thumb{
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius:1rem;
    }
}
    padding-top: 1rem;
    @media screen and (min-width:720px) and (max-width:1080px) {
        grid-template-rows:15% 70% 15% ;
    }
    .chat-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 2rem;
    }
    .user-details{
        display: flex;
        align-items: center;
        gap: 1rem;
    
    .avatar{
        img{
            height: 3rem;
        }
    }
    .username{
        h3{
            color: white;
        }
    }
}
    .chat-messages{
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
        .message{
            display: flex;
            align-items: center;
            .content{
                max-width: 40%;
                overflow-wrap:break-word;
                padding: 1rem;
                border-radius: 1rem;
                font-size: 1.1rem;
                color: white;
            }
        }
        .sended{
            justify-content: flex-end;
            .content{
                background-color: #4f04ff21;
            }
        }
        .received{
            justify-content: flex-start;
            background-color: #9900ff20;
        }
    }

`
export default Chatcontainer