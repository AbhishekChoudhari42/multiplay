"use client"
import { useStore } from '@/store/store'
import Link from 'next/link'
import React from 'react'
interface Store{
  user:string,
  setUser:(userValue:string)=>void
}

const Joinroom = () => {
  const [roomId,setRoomId] = React.useState<string>("")
  const store = useStore<Store>(state=>state)
  

  return (
    <div className='flex flex-col p-4 '>
        <input placeholder='Room' className='p-2 bg-neutral-800 outline-1' value={roomId} onChange={(e)=>{setRoomId(e.target.value)}}/>
        <input placeholder='User' className='p-2 bg-neutral-800 outline-1 mt-4' value={store.user} onChange={(e)=>{store.setUser(e.target.value)}}/>
        <Link href={`/${roomId}`}>
            <button className='w-full p-2 bg-blue-600 mt-4'>Join Room</button>
        </Link>
    </div>  
  )
}

export default Joinroom