"use client"
import React, { useRef, useEffect, useState } from 'react'
import usePartySocket from "partysocket/react";
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/store';
import { UserType, UserStateType, StoreType } from '@/utils/types'
import './board.css';
import Confetti from 'react-confetti'


const generateZigzag = (size: number): number[] => {
  let total = size * size;
  let matrix: number[] = [];
  let leftToRight = true;

  for (let row = 0; row < size; row++) {
    let currentRow: number[] = new Array(size);
    for (let col = 0; col < size; col++) {
      let index = leftToRight ? col : (size - 1 - col);
      currentRow[index] = total--;
    }
    matrix.push(...currentRow);
    leftToRight = !leftToRight; // Toggle direction
  }

  return matrix;
};

const Multiplay = ({ params }: { params: { roomId: string } }) => {

  const store = useStore<StoreType>(state => state)
  const [playerWon, setPlayerWon] = useState(false)
  const [users, setUsers] = React.useState<UserStateType>({ userQueue: [], userIndex: 0 })
  const router = useRouter()

  if (store.user == '') {
    router.push('/')
  }

  const size = 10;
  const zigzagNumbers = generateZigzag(size);
  let board = []

  let posMap = ['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0']

  for (let i = 0; i < zigzagNumbers.length; i++) {
    const number = zigzagNumbers[i];
    board.push(
      <div className={`square ${users.userQueue.findIndex(e => e.pos == number - 1) > -1 ?? 'special-snake'}`} key={i}>
        {/* {number} */}
        <div className='absolute top-0 left-0 w-full h-full'>
          {users.userQueue.length > 0 && Object.values(users.userQueue).map((e: UserType, i) => {
            return ((users.userQueue[i].pos + 1) == number && e.colour && <div className={`w-[15px] h-[15px] m-[1px] border-2 border-black rounded-lg absolute ${posMap[i]}`} style={{ background: e.colour }} key={e.colour + i}></div>)
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
    }
  });

  socket.onmessage = (event) => {

    const message = event.data;
    const parsedMsg = JSON.parse(message);

    switch (parsedMsg.type) {

      case 'user_join_response':
        setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex })
        break;

      case 'user_left_response':
        setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex })
        break;

      case 'dice_roll_response':
        console.log(parsedMsg.dice)
        setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex })
        break;
      case 'snake_or_ladder':
        setTimeout(() => {
          setUsers({ userQueue: parsedMsg.userQueue, userIndex: parsedMsg.userIndex })
        }, 1 * 1000)
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
      {playerWon &&
        <div className='confetti'>
          <Confetti height={window.innerHeight} width={window.innerWidth} />
        </div>
      }
      <div className='w-full'>
        
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