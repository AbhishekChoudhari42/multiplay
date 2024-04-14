"use client"
import React, { useRef, useEffect, useState } from 'react'
import usePartySocket from "partysocket/react";

type userListType = {
  user: {
    color: string,
    pos: number
  }
}

type usersState = {
  userQueue:string[],
  userIndex:number
}

const Multiplay = ({ params }: { params: { roomId: string } }) => {

  const [userList, setUserList] = React.useState<userListType>({ user: { color: '0,0,0', pos: 0 } })
  const [user, setUser] = React.useState<string>("")
  const [users,setUsers] = React.useState<usersState>({userQueue:[],userIndex:0})
  const [timer,setTimer] = useState<number>(0)
  const serverTime = useRef(0);
  const arr = new Array(10).fill(0)
  
  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
    room: params.roomId ?? 'default_room',
    onMessage(event) {
      const message = event.data;
      const parsedMsg = JSON.parse(message);
      if (parsedMsg.type == 'init') {
        setUserList(parsedMsg.userList)
        setUsers({userQueue:parsedMsg.userQueue,userIndex:parsedMsg.userIndex})
      }
      if( parsedMsg.type ==  'dice-roll'){
        // startTimer()
        setUserList(parsedMsg.userList)
        setUsers({userQueue:parsedMsg.userQueue,userIndex:parsedMsg.userIndex})
        
      }
      if(parsedMsg.type == 'time'){
        console.log('time event')
        // startTimer()
        console.log(parsedMsg.userIndex)
        serverTime.current = parsedMsg.serverTime;
        setUsers({...users,userIndex:parsedMsg.userIndex })
      }
    },
  });
  
  useEffect(()=>{
    setUser(socket._pk)
  },[socket])

  // const startTimer = () => {
  //   console.log("timer started")
  //     const interval = setInterval(()=>{
  //         const currentTime = new Date().getTime()
  //         const timeDiff = currentTime - serverTime.current
  //         console.log(serverTime.current)
  //         setTimer(timeDiff)
  //     },1000) 
  // }

  const rollDice = () => {
    socket.send(JSON.stringify({ type: "roll-dice" }));
  };

  return (
    <div className='flex flex-col'>
      <h2>{params.roomId}</h2>
      <h2>{timer}</h2>
      <h2>{user}</h2>
      { users.userQueue[users.userIndex] == user && <button className='bg-indigo-500 mb-8' onClick={() => { rollDice() }}>roll dice</button>}
      <div className='flex flex-col gap-2'>
        {
          arr.map((e, index) => {
            return <div key={index} className={`w-full min-h-[20px] bg-neutral-800 border border-neutral-700 p-1 gap-2 flex justify-between items-center`}>
              {typeof userList == 'object' && Object.values(userList).map((e: any, i) => {
                return (index == e.pos && <div className='w-[20px] flex items-center justify-center' style={{ background: `rgb(${e.color})` }} key={i}><p>{e.pos}</p></div>)
              })}
            </div>
          })
        }
      </div>
      <div className='bg-blue-900 border p-2'>
        {
          users.userQueue?.map((e,i)=>{
            return <div className={`${i == users.userIndex ? 'bg-red-500':''}`} key={i}>{e}</div>
          })
        }
      </div>
    </div>
  )
}

export default Multiplay