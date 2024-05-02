import Board from '@/components/board'
import Multiplay from '@/components/multiplay'
import VideoFeed from '@/components/videofeed'
import React from 'react'

const page = ({ params }: { params: { roomId: string } }) => {

  return (
    <div className='w-screen  h-screen bg-banner'>
      <div className='w-screen h-screen flex flex-col justify-center items-center bg-black/90'>
      <div className='max-w-[400px]'>
        <Multiplay params={params} />
      </div>
      </div>
    </div>
  )
}

export default page