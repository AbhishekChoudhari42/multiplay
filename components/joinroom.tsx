"use client"
import { useStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { StoreType } from '@/utils/types'

const Joinroom = () => {
  const [roomId, setRoomId] = React.useState<string>("")
  const store = useStore<StoreType>(state => state)
  const router = useRouter()

  useEffect(()=>{
    store.error!='' && toast.error(store.error)
  },[])

  const handleGameJoin = (roomId:string) => {
    if(roomId == null || roomId == ''){
      toast.error("Please enter Room name")
      return
    }
    
    if(store.user == null || store.user == ""){
      toast.error("Please enter Player name")
      return
    }

    router.push(`/${roomId}`)
  } 

  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center bg-black/80'>
      <h1 className='mb-16 p-4  font-extrabold text-2xl'>Snakes and Ladders</h1>
      <p>{store.error}</p>
      <div className='flex flex-col p-4 max-w-[400px] bg-black/80 backdrop-blur-md rounded-lg'>
        <input placeholder='Room name' className='p-2 rounded-md bg-neutral-200 text-black outline-1' value={roomId} onChange={(e) => { setRoomId(e.target.value) }} />
        <input placeholder='Player name' className='p-2 rounded-md bg-neutral-200 text-black outline-1 mt-4' value={store.user} onChange={(e) => { store.setUser(e.target.value) }} />
        <button onClick={()=>handleGameJoin(roomId)} className='w-full p-2 rounded-md bg-blue-600 mt-8'>Join Game</button>
      </div>
      <Toaster  position='top-center' />
    </div>
  )
}

export default Joinroom