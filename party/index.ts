import type * as Party from "partykit/server";

const colr = () => Math.floor(Math.random()*255)

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {
    
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `Connected:
      id: ${conn.id}
      room: ${this.room.id}
      url: ${new URL(ctx.request.url).pathname}`
      );
    
    conn.setState({colour:`rgb(${colr()},${colr()},${colr()})`})
    // let's send a message to the connection
    conn.send(JSON.stringify({type:'init',state:conn.state}));
  }

  async onMessage(message: string, sender: Party.Connection) {   
  
    this.room.storage.put(`${sender.id}`,{position:0})
    sender.setState({pos:0})
    console.log(sender.state)

    // let's log the message
    // console.log(`connection ${sender.id} sent message: ${message}`);
    // as well as broadcast it to all the other connections in the room...
    const postMessage = JSON.parse(message)
    console.log(postMessage)
    console.log(sender.state,'-state')
    // this.room.broadcast(JSON.stringify({type:'init',state:sender.state}))
    // dice event
    // 

    // this.room.broadcast(
      // JSON.stringify(postMessage),
      // `${sender.id}: ${message}`,
      // ...except for the connection it came from
      // [sender.id]
    // );
  }
}

Server satisfies Party.Worker;
 