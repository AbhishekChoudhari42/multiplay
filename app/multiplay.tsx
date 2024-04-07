"use client"
import React,{useRef,useEffect,useState} from 'react'
import usePartySocket from "partysocket/react";

const multiplay = () => {

    const [currentState,setCurrentState] = React.useState<string>('black')
    const [index,setIndex] = React.useState<number>(0)
    const arr = new Array(10).fill(0)

    const socket = usePartySocket({
        host: process.env.NEXT_PARTY_KIT_URL || 'http://127.0.0.1:1999',
        room: "123",
        onMessage(event) {
          const message = event.data;
          const parsedMsg = JSON.parse(message);
          if(parsedMsg.type == 'init'){
            console.log(parsedMsg)
            setCurrentState(parsedMsg.state.colour)
          }
        },
    });

    const rollDice = () => {
        socket.send(JSON.stringify({ type: "roll-dice" }));
    };

  return (
    <div className='flex flex-col'>
        <button onClick={()=>{rollDice}}>send event</button>
        {currentState}
        <div style={{background:currentState}} className={`w-10 h-10 bg-[${currentState}]`}>aaa</div>
        <h1>{index}</h1>
        {/* {arr.map((e,i)=>{
          return <div  className={`${index == i ? 'bg-red-600':'bg-green-500'}`} key={i}></div>
        })} */}
    </div>
  )
}

export default multiplay