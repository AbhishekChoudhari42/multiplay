"use client"
import Link from 'next/link'
import React from 'react'

const Joinroom = () => {
  const [roomId,setRoomId] = React.useState<string>("")

  return (
    <div className='flex flex-col p-4 '>
        <input className='p-2 bg-neutral-800 outline-1' value={roomId} onChange={(e)=>{setRoomId(e.target.value)}}/>
        <Link href={`/${roomId}`}>
            <button className='w-full p-2 bg-blue-600 mt-4'>Join Room</button>
        </Link>
    </div>  
  )
}

export default Joinroom