"use client"
import React, { useState } from 'react'
import ReactPlayer from "react-player";

const VideoFeed = () => {

    const [localStream,setLocalStream] = useState<MediaStream>()

    const startStream = async () => {
        
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });

        setLocalStream(stream)

    }


  return (
    <div>
        <button onClick={startStream} className='w-20 bg-blue-600 text-white'>start</button>
        {localStream && <ReactPlayer playing muted url={localStream} height={"200px"} width={"300px"} />}
    </div>
  )
}

export default VideoFeed