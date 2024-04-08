"use client"
import React, { useRef, useEffect, useState } from 'react'
import usePartySocket from "partysocket/react";

type userListType = {
  user: {
    color: string,
    pos: number
  }
}

const multiplay = () => {

  const [currentState, setCurrentState] = React.useState<userListType>({ user: { color: '0,0,0', pos: 0 } })
  const [index, setIndex] = React.useState<number>(0)
  const arr = new Array(10).fill(0)

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
    room: "123",
    onMessage(event) {
      const message = event.data;
      const parsedMsg = JSON.parse(message);
      if (parsedMsg.type == 'init') {
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
      <button className='bg-indigo-500 mb-8' onClick={() => { rollDice() }}>roll dice</button>
      <div className='flex flex-col gap-2'>
        {
          arr.map((e, index) => {
            return <div key={index} className={`w-full min-h-[20px] bg-neutral-800 border border-neutral-700 p-1 gap-2 flex justify-between items-center`}>
              {typeof currentState == 'object' && Object.values(currentState).map((e: any, i) => {
                return (index == e.pos && <div className='w-[20px] flex items-center justify-center' style={{ background: `rgb(${e.color})` }} key={i}><p>{e.pos}</p></div>)
              })}
            </div>
          })
        }
      </div>
      {/* {typeof currentState == 'object' && Object.values(currentState).map((e: any, i) => {
        return <div style={{ background: `rgb(${e.color})` }} key={i}>{e.color}--||--{e.pos}</div>
      })} */}
    </div>
  )
}

export default multiplay