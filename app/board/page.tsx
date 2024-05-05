import Board from '@/components/board'
import Multiplay from '@/components/multiplay'
import VideoFeed from '@/components/videofeed'
import React from 'react'

const page = ({ params }: { params: { roomId: string } }) => {

  return (
    <div className='w-screen h-screen'>
      <div className=''>
        <Board/>
      </div>
    </div>
  )
}

export default page