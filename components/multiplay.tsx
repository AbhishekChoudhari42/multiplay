"use client"
import React, { useRef, useEffect, useState } from 'react'
import { UserType, UserStateType, StoreType } from '@/utils/types'
import { generateZigzag } from '@/utils'
import './board.css';

import usePartySocket from "partysocket/react";
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';

import {motion} from 'framer-motion'
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti'


const Multiplay = ({ params }: { params: { roomId: string } }) => {

  const store = useStore<StoreType>(state => state)
  const [playerWon, setPlayerWon] = useState(false)
  const [users, setUsers] = React.useState<UserStateType>({ userQueue: [], userIndex: 0,winners:[] })

  const router = useRouter()

  if (store.user == '') {
    router.push('/')
  }

  const size = 10;
  const zigzagNumbers = generateZigzag(size);
  let board = []

  for (let i = 0; i < zigzagNumbers.length; i++) {
    const number = zigzagNumbers[i];
    const postionMap = ['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0']
    board.push(
      <div key={number} className={`square ${users.userQueue.findIndex(e => e.pos == number - 1) > -1 ?? 'special-snake'}`}>
        <div className='absolute top-0 left-0 w-full h-full'>
          {users.userQueue.length > 0 && Object.values(users.userQueue).map((e: UserType, i) => {
            return ((users.userQueue[i].pos + 1) == number && e.colour && <motion.div key={e.name+e.colour} layoutId={e.name} className={`w-[15px] h-[15px] m-[1px] border-2 border-black rounded-lg absolute ${postionMap[i]}`} style={{ background: e.colour }}></motion.div>)
          })}
        </div>
      </div>
    );
  }

  const socket = usePartySocket({
    host: process.env.NEXT_PUBLIC_PARTYKIT_HOST,
    room: params.roomId ?? 'default_room',
    onClose() {
      router.push('/')
    },
    onOpen() {
      if (store.user != '') socket.send(JSON.stringify({ type: "user_join_event", username: store.user }));
      toast.success('room joined!')
    }
  });

  socket.onmessage = (event) => {

    const message = event.data;
    const parsedMsg = JSON.parse(message);
    const username = users.userQueue[users.userIndex]?.name
    
    switch (parsedMsg.type) {

      case 'user_join_response':
        setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex,winners:[] })
        break;

      case 'user_left_response':
        setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex,winners:users.winners})
        break;

      case 'dice_roll_response':
        
        toast( username +" : "+ parsedMsg.dice,{duration:1000})
        setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex,winners:parsedMsg.winners })
        break;
      case 'snake_or_ladder':

        if(parsedMsg.outcome == 'ladder') toast(username, { icon: '🔼',duration:2000});
        if(parsedMsg.outcome == 'snake') toast(username, { icon: '🐍',duration:2000});
        
        let tempQueue = [...parsedMsg.userQueue]
        tempQueue[parsedMsg.currentUserIndex] = parsedMsg.tempPlayer
        
        setUsers({ userQueue: tempQueue, userIndex: parsedMsg.userIndex,winners:users.winners })
        
        setTimeout(()=>{
          setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex,winners:users.winners })
        },500)
        
        break;

      case 'player_won':
        setPlayerWon(true)
        setTimeout(() => {
          setPlayerWon(false)
        }, 10 * 1000)
    }
  }

  const rollDice = () => {
    console.log("diceee")
    socket.send(JSON.stringify({ type: "dice_roll_event" }));
  };

  return (
    <div className='flex flex-col'>

      <Toaster  position='top-center' />
      {playerWon &&
        <div className='confetti'>
          <Confetti height={window.innerHeight} width={window.innerWidth} />
        </div>
      }
      <div className='w-full bg-black mb-8 flex gap-4'>
           {
              users.userQueue.map(e=>{
                const winner = users.winners.includes(e.name)
                const winnerIndex = users.winners.indexOf(e.name)
                return <div key={e.colour+e.name} className='p-2 w-full  rounded-md max-w-[25%] relative' style={{ background: e.colour,border:winner ? '2px solid white':`2px solid ${e.colour + '66'}`}}>{e.name} {winnerIndex > -1 && <span className='absolute w-[25px] h-[25px] p-2 top-[-10px] right-[-10px] rounded-lg border-1 border-white flex justify-center items-center' style={{ background: 'white',border:'2px solid white'}}><p className='text-black'>{winnerIndex+1}</p></span>}</div>
              })
           }
      </div>
      <div className="board rounded-md bg-black">
        {
          board
        }
      </div>
      {
        <button
          disabled={users.userQueue[users.userIndex]?.name != store.user}
          className={`bg-indigo-500 mt-8 p-2 rounded-md ${users.userQueue[users.userIndex]?.name == store.user ? 'opacity-100' : 'opacity-10'}`}
          onClick={rollDice}>roll dice
        </button>
      }

    </div>
  )
}

export default Multiplay