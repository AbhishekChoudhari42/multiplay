"use client"
import React,{useRef,useEffect,useState} from 'react'
import usePartySocket from "partysocket/react";

type userListType = {
  user:{
    color:string,
    pos:number
  }
}

const multiplay = () => {

    const [currentState,setCurrentState] = React.useState<userListType>({user:{color:'0,0,0',pos:0}})
    const [index,setIndex] = React.useState<number>(0)
    const arr = new Array(10).fill(0)

    const socket = usePartySocket({
        host: process.env.NEXT_PUBLIC_PARTYKIT_HOST || 'http://127.0.0.1:1999',
        room: "123",
        onMessage(event) {
          const message = event.data;
          const parsedMsg = JSON.parse(message);
          if(parsedMsg.type == 'init'){
            setCurrentState(parsedMsg.userList)
          }
        },
    });
  
    const rollDice = () => {
        console.log('roll dice')
        socket.send(JSON.stringify({ type: "roll-dice" }));
    };

  return (
    <div className='flex flex-col'>
        <button className='bg-indigo-500' onClick={()=>{rollDice()}}>send event</button>
        <div className={`w-10 h-10 bg-[${currentState}]`}>aaa</div>
        <h1>{index}</h1>
        {/* {console.log(Object.values(currentState))} */}
        {Object.values(currentState).map((e:any,i)=>{
          return <div style={{background:`rgb(${e.color})`}} key={i}>{e.color}--||--{e.pos}</div>
        })}
    </div>
  )
}

export default multiplay