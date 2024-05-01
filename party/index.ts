import type * as Party from "partykit/server";
import { getRandomColor, User , getNextUserIndex, getCurrentPositionOutcome} from "./utils";

export default class Server implements Party.Server {

  constructor(readonly room: Party.Room) { }

  gameStarted: boolean = false;
  userQueue: User[] = [];
  userIndex: number = 0;
  winners: string[] = [];

  async onClose(connection: Party.Connection<unknown>) {

    if (this.userQueue.length == 1) {

      this.gameStarted = false
      this.userQueue = []
      this.userIndex = 0
      this.winners = []
      return

    }
    
    const index = this.userQueue.findIndex(user => user.connId == connection.id)
    this.userQueue.splice(index,1)

    this.winners = this.winners.filter(e => e != this.userQueue[index].name)
    
    this.userIndex = getNextUserIndex(this.userQueue,this.userIndex,this.winners)
    
    this.room.broadcast(JSON.stringify({ type: 'user_left_response', userQueue: this.userQueue, userIndex: this.userIndex }))
  }
 
  async onMessage(message: string, sender: Party.Connection) {

    const postMessage = JSON.parse(message)

    switch (postMessage.type) {

      case "user_join_event":

        if (this.gameStarted || this.userQueue.length == 4) {
          // -- need to add the error message in client
          sender.close()
          return
        }
        // if user with name present in room then replace previous connection id with new connection id
        
        let currentUserIndexByName = this.userQueue.findIndex(e => e.name == postMessage.username)

        if (currentUserIndexByName > -1) {

          this.userQueue[currentUserIndexByName].connId = sender.id

        } else {

          this.userQueue.push({
            name: postMessage.username,
            colour: getRandomColor(),
            pos: 0,
            bal: 1500,
            connId: sender.id
          })

        }

        this.room.broadcast(JSON.stringify({ type: 'user_join_response', userQueue: this.userQueue, userIndex: this.userIndex }))

        break;
        
        case "dice_roll_event":

        if (this.userQueue[this.userIndex].connId == sender.id) {
        
          if (this.userIndex == 0 && !this.gameStarted) {
            this.gameStarted = true
          }
        
          if (this.gameStarted) {

            // const dice = Math.ceil(Math.random() * 5.999)
            const dice = 99
            
            const currentUserIndex = this.userIndex
            const currentPos = this.userQueue[currentUserIndex].pos
            
            // add dice value to current pos & limit to 99
            this.userQueue[this.userIndex].pos = (dice + currentPos <= 99 ? currentPos + dice : currentPos)

            // updating the userIndex 
            this.userIndex = getNextUserIndex(this.userQueue,this.userIndex,this.winners)
              
            // user reaches the end of the game
            if (this.userQueue[currentUserIndex].pos == 99) {
              this.winners.push(this.userQueue[currentUserIndex].name)            
            }

            const pos = String(this.userQueue[currentUserIndex].pos)            
            const outcome = getCurrentPositionOutcome(pos)

            if (outcome.pos == 0) {
              
              this.room.broadcast(JSON.stringify({ type: 'dice_roll_response', userQueue: this.userQueue, nextUserIndex: this.userIndex, currentUserIndex, dice, winners: this.winners }))
            
            } else {

              const tempPlayer = { ...this.userQueue[currentUserIndex] }
              // revisit -- to pass only intermediate player position
              this.userQueue[currentUserIndex].pos = outcome.pos
              this.room.broadcast(JSON.stringify({ type: 'snake_or_ladder', userQueue: this.userQueue, nextUserIndex: this.userIndex, currentUserIndex, outcome: outcome.value, tempPlayer: tempPlayer, dice }))
            }
          }
        }
        break;
    }
  }
}

Server satisfies Party.Worker;
