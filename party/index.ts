import type * as Party from "partykit/server";
import { getRandomColor, getUserIndexByConnection, getUserIndexByUsername } from "./utils";

type User = {
  name: string,
  pos: number,
  bal: number,
  colour: string,
  connId: string
}

export default class Server implements Party.Server {

  constructor(readonly room: Party.Room) {

  }

  gameStarted: boolean = false;
  userQueue: User[] = [];
  userIndex: number = 0;
  startTime: number = 0;

  async onClose(connection: Party.Connection<unknown>) {
    if (this.userQueue.length == 1){
      this.userQueue = []
      this.gameStarted = false
      return
    }
    const index = this.userQueue.findIndex(user => user.connId == connection.id)
    this.userQueue.splice(index, 1)
    this.userIndex = (this.userIndex) % this.userQueue.length;
    this.room.broadcast(JSON.stringify({type:'user_left_response',userQueue:this.userQueue, userIndex: this.userIndex}))
  }

  async onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {

  }

  async onMessage(message: string, sender: Party.Connection) {

    const postMessage = JSON.parse(message)

    switch (postMessage.type) {

      case "user_join_event":

        if (this.gameStarted || this.userQueue.length == 4) {
          sender.close()
          return
        }

        let currentUserIndexByName = getUserIndexByUsername(postMessage.username, this.userQueue)
        let currentUserIndexByConn = getUserIndexByConnection(sender.id, this.userQueue)


        if (currentUserIndexByName > -1) {

          this.userQueue[currentUserIndexByName].connId = sender.id

       } else if (currentUserIndexByConn > -1) {

          this.userQueue[currentUserIndexByConn].name = postMessage.username

        } else {

          this.userQueue.push({
            name: postMessage.username,
            colour: getRandomColor(),
             pos: 0,
            bal: 1500,
            connId: sender.id
          })

        }
        this.room.broadcast(JSON.stringify({type:'user_join_response',userQueue:this.userQueue, userIndex: this.userIndex}))
        break;
      case "dice_roll_event":
        if(this.userQueue[this.userIndex].connId == sender.id){
          if(this.userIndex == 0 && !this.gameStarted){
            this.gameStarted = true
          }
          if(this.gameStarted){
            const dice = Math.ceil(Math.random()*5.999)
            const currentPos = this.userQueue[this.userIndex].pos
            this.userQueue[this.userIndex].pos = (dice+currentPos <= 99 ? currentPos + dice : currentPos)
            this.userIndex = (this.userIndex + 1) % this.userQueue.length;
            this.room.broadcast(JSON.stringify({type:'dice_roll_response',userQueue:this.userQueue, userIndex: this.userIndex,dice}))
          }
        }
        break;
    }
  }
}

Server satisfies Party.Worker;
