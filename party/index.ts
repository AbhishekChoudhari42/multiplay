import type * as Party from "partykit/server";
import { handleDiceRoll, initGame, playerLeft } from "./utils";

type UserList = {
  [key: string]: {
    color: string,
    pos: number,
  }; // Index signature
}

export default class Server implements Party.Server {
  
  constructor(readonly room: Party.Room) {
    
  }

  gameStarted: boolean = false;
  userQueue: string[] = [];
  userIndex: number = 0;
  timeOuts: NodeJS.Timeout[] = [];
  startTime: number = 0;
  
  async onClose(connection: Party.Connection<unknown>) {
    console.log(connection.id, " -- left")
    if (this.userQueue.length == 1) {
      this.room.storage.delete('userlist')
      this.gameStarted = false
      return
    }
    const index = this.userQueue.indexOf(connection.id)
    this.userQueue.splice(index, 1)
    this.userIndex = (this.userIndex) % this.userQueue.length;
    playerLeft(this.room, connection.id,this.userQueue,this.userIndex)
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    if (!this.gameStarted) {
      this.userQueue.push(conn.id)
      initGame(this.room, conn.id, this.userQueue, this.userIndex)
    }
  }

  // startGame() {
  //   this.userIndex = (this.userIndex + 1) % this.userQueue.length;
  //   this.room.broadcast(JSON.stringify({ type: 'time', userIndex: this.userIndex, serverTime: this.startTime, userQueue: this.userQueue }))
  //   this.startTime = new Date().getTime()
  //   let timeout = setTimeout(() => {
  //     this.startGame()
  //   }, 1000 * 5)
  //   this.timeOuts.push(timeout)
  // }

  async onMessage(message: string, sender: Party.Connection) {
    const postMessage = JSON.parse(message)
    console.log(this.userQueue, ' -- [', this.userIndex, ']');
    switch (postMessage.type) {
      case "roll-dice":
        if (this.userQueue[this.userIndex] == sender.id) {

          // on dice roll by first user when game is not started
          if (!this.gameStarted && this.userIndex == 0 && this.startTime == 0) {
               this.gameStarted = true
              //  this.startGame()
          }
          // on all dice rolls 
          if (this.gameStarted){
            this.userIndex = (this.userIndex + 1) % this.userQueue.length;
            this.startTime = new Date().getTime()
            this.room.broadcast(JSON.stringify({ type: 'time', userIndex: this.userIndex, serverStartTime: this.startTime }))
            handleDiceRoll(this.room, sender.id, this.userQueue, this.userIndex, this.startTime);
          }
        }
        break;
    }
  }

  async onRequest(req: Party.Request) {

    if (req.method == 'POST') {
      console.log(req)
      return new Response("POST", { status: 200 })
    }
    return new Response("Method not allowed", { status: 400 })
  }
}

Server satisfies Party.Worker;
