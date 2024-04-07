"use client"
import React,{useRef,useEffect,useState} from 'react'
import usePartySocket from "partysocket/react";


const multiplay = () => {

    const [vote,setVote] = React.useState<number>(0)
    const [votes,setVotes] = React.useState<number[]>([])

    const socket = usePartySocket({
        host: process.env.NEXT_PARTY_KIT_URL || 'http://127.0.0.1:1999',
        room: "123",
        onMessage(event) {
          const message = event.data;
          const parsedMsg = JSON.parse(message);
          // parsedMsg.pixel
          console.log()
          if (parsedMsg.pixel) {
            setVotes([...votes,parsedMsg.pixel]);
          }
        },
    });

    const sendVote = (option: number) => {
        socket.send(JSON.stringify({ type: "vote", option }));
        setVote(option);
    };
    type Pixel = {
      x:number,
      y:number
    }
    const sendPixels = ({x,y}:Pixel) => {
      socket.send(JSON.stringify({ type: "pixels", pixel:{x,y} }));
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPainting, setIsPainting] = useState(false);
    const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas!.getContext('2d')!;

        const startPainting = (position: { x: number; y: number }) => {
            setIsPainting(true);
            setLastPosition(position);
        };

        const stopPainting = () => {
            setIsPainting(false);
            setLastPosition(null);
            context.beginPath(); // Resets the current path, so the line doesn't continue after stopping
        };

        const paint = (newPosition: { x: number; y: number }) => {
            if (!isPainting || !lastPosition) return;
            drawLine(lastPosition, newPosition);
            sendPixels(newPosition)
            setLastPosition(newPosition);
        };

        const drawLine = (oldPosition: { x: number; y: number }, newPosition: { x: number; y: number }) => {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.moveTo(oldPosition.x, oldPosition.y);
            context.lineTo(newPosition.x, newPosition.y);
            context.stroke();
            context.closePath();
        };

        const getMousePosition = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
            if (!canvas) return null;
            const rect = canvas.getBoundingClientRect();

            if (event instanceof TouchEvent) {
                if (event.touches.length > 0) {
                    const touch = event.touches[0];
                    return {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    };
                }
            } else { // Mouse Event
                return {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                };
            }

            return null;
        };

        // Mouse Event Handlers
        const handleMouseDown = (event: MouseEvent) => {
            const position = getMousePosition(event);
            if (position) startPainting(position);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const position = getMousePosition(event);
            if (position) paint(position);
        };

        // Touch Event Handlers
        const handleTouchStart = (event: TouchEvent) => {
            event.preventDefault(); // Prevents the mouse event from firing
            const position = getMousePosition(event);
            if (position) startPainting(position);
        };

        const handleTouchMove = (event: TouchEvent) => {
            event.preventDefault(); // Prevents scrolling and other default touch behaviors
            const position = getMousePosition(event);
            if(position){
              sendPixels(position)
            }
            if (position) paint(position);
        };

        canvas?.addEventListener('mousedown', handleMouseDown);
        canvas?.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', stopPainting);
        
        canvas?.addEventListener('touchstart', handleTouchStart);
        canvas?.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', stopPainting);

        return () => {
            canvas?.removeEventListener('mousedown', handleMouseDown);
            canvas?.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', stopPainting);
            
            canvas?.removeEventListener('touchstart', handleTouchStart);
            canvas?.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', stopPainting);
        };
    }, [isPainting, lastPosition]);

  return (
    <div>
        <canvas width={400} height={400} className='w-[400px] h-[400px] bg-slate-50' ref={canvasRef}>
        </canvas>
        <button onClick={()=>{sendVote(1)}}>send event</button>
        <h1>{vote}</h1>
        {votes.map((e,index)=>{
          return <p key={index}>{JSON.stringify(e)}1</p>
        })}
    </div>
  )
}

export default multiplay