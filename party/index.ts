import type * as Party from "partykit/server";

const colr = () => Math.floor(Math.random()*255)

interface MyObject {
  t: {
    color:string,
    pos:number
  };
  [key: string]: {}; // Index signature
}

export default class Server implements Party.Server {
  constructor(readonly room: Party.Room) {
       
  }

  async onClose(connection: Party.Connection<unknown>){
    // connection.send()

    let userList = await this.room.storage.get<MyObject>("userlist");
    if(typeof userList == 'object' && userList){
      delete userList[connection.id]
    }
    await this.room.storage.put("userlist",userList)
    const event = new Event("message")
    for (const everyone of this.room.getConnections()) {
      everyone.send(JSON.stringify({type:'init',userList}));
    }
    
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    
    let userList = await this.room.storage.get("userlist");
    if(!userList){
      await this.room.storage.put("userlist",{[conn.id]:{pos:0,color:`${colr()},${colr()},${colr()}`}})
    }else {
      userList = {...userList,[conn.id]:{pos:0,color:`${colr()},${colr()},${colr()}`}}
      await this.room.storage.put("userlist",userList)
    }
    for (const everyone of this.room.getConnections()) {
      everyone.send(JSON.stringify({type:'init',userList}));
    }
  }

  async onMessage(message: string, sender: Party.Connection) {   
  
    // socket.send(JSON.stringify({ type: "roll-dice" })); 
    const postMessage = JSON.parse(message)
    if(postMessage.type == "roll-dice"){
      let userList = await this.room.storage.get<MyObject>("userlist");
      if(userList){
        userList = {...userList,[sender.id]:{...userList[sender.id],pos:Math.floor(Math.random()*200)}}
        await this.room.storage.put("userlist",userList)
      }
      console.log(sender.id,'sender id')
      for (const everyone of this.room.getConnections()) {
        everyone.send(JSON.stringify({type:'init',userList}));
      }
    }
    console.log(postMessage,'-state')
  }
}

Server satisfies Party.Worker;
 