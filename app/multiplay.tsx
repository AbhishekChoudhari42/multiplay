"use client"
import React from 'react'
import usePartySocket from "partysocket/react";
type Poll = {
    title: string;
    options: string[];
    votes?: number[];
  };

const multiplay = () => {

    const [vote,setVote] = React.useState<number>(0)
    const [votes,setVotes] = React.useState<number[]>([])

    const socket = usePartySocket({
        host: 'http://127.0.0.1:1999',
        room: "123",
        onMessage(event) {
          const message = event.data as Poll;
          if (message.votes) {
            setVotes(message.votes);
          }
        }
    });

    const sendVote = (option: number) => {
        console.log('send vote')
        socket.send(JSON.stringify({ type: "vote", option }));
        setVote(option);
    };

  return (
    <div>
        <button onClick={()=>{sendVote(1)}}>send event</button>
        <h1>{vote}</h1>
        {votes.map((e)=>{
          return <p>{e}1</p>
        })}
    </div>
  )
}

export default multiplay