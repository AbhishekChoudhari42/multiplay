import Multiplay from '@/components/multiplay'
import React from 'react'

const page = ({ params }: { params: { roomId: string } }) => { 
 
return (
    <div className='max-w-[400px] flex justify-center items-center h-screen'>
        <Multiplay params={params}/>
    </div>
  )
}

export default page