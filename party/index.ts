import type * as Party from "partykit/server";
import { handleDiceRoll, initGame, playerLeft } from "./utils";

type UserList = {
  [key: string]: {
      color: string,
      pos: number,
  }; // Index signature
}

export default class Server implements Party.Server {
  gameStarted:boolean = false;
  userQueue: string[] = [];
  userIndex: number = 0;
  timeOuts: NodeJS.Timeout[] = [];
  constructor(readonly room: Party.Room) {
      
  }

  async onClose(connection: Party.Connection<unknown>){
    console.log(connection.id," -- left")
    const index = this.userQueue.indexOf(connection.id)
    this.userQueue.splice(index,1)
    playerLeft(this.room,connection.id)    
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    if(!this.gameStarted){
      this.userQueue.push(conn.id)
      initGame(this.room,conn.id,this.userQueue,this.userIndex)
    }
  }

  async onMessage(message: string, sender: Party.Connection) {   
    const postMessage = JSON.parse(message)
    console.log(this.userQueue,' -- [',this.userIndex,']');
    switch(postMessage.type){
      case "roll-dice":
        if(this.userQueue[this.userIndex] == sender.id){
          
          this.userIndex = (this.userIndex + 1)%this.userQueue.length;  
          handleDiceRoll(this.room,sender.id,this.userQueue,this.userIndex);
          
          this.timeOuts.forEach((e)=>{
            clearTimeout(e)
          })

          const timeout = setTimeout(async () =>{

            let userList = await this.room.storage.get<UserList>("userlist");
            this.userIndex = (this.userIndex + 1)%this.userQueue.length;
            this.room.broadcast(JSON.stringify({type:'timer',userList,userQueue : this.userQueue, userIndex : this.userIndex}))  
            console.log(" updated --- --- ")
          },1000 * 30)

          this.timeOuts.push(timeout)
        }
      break;
    }
  }

  async onAlarm(){
    console.log("onAlarm")

   
  }

  async onRequest(req: Party.Request) {

      if(req.method == 'POST'){
        console.log(req)
        return new Response("POST", { status: 200 })
      }

      return new Response("Method not allowed", { status: 400 })

  }
}

Server satisfies Party.Worker;
 