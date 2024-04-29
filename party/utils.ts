import type * as Party from "partykit/server";
type posType = {
    [key:string]:{[value:string]:number}
}
export const snakes_ladders_pos:posType = {
    "snakes": {
      "98": 40,
      "94": 76,
      "88": 52,
      "65": 44,
      "53": 30,
      "42": 17,
      "39": 2,
      "26": 4
    },
    "ladders": {
      "3": 24,
      "12": 45,
      "32": 48,
      "41": 62,
      "49": 68,
      "61": 80,
      "73": 91
    }
  }
  
  
type User = {
    name:string,
    pos: number,
    bal:number,
    colour: string,
    connId:string
}

export function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor.padStart(6, '0');
}

export function getUserIndexByConnection(connId:string,userQueue:User[]){
    let i = -1
    userQueue.forEach((el,index) => {
        if(el.connId == connId){
            i = index
        }
    }); 
    return i
}

export function getUserIndexByUsername(name:string,userQueue:User[]){
    let i = -1
    userQueue.forEach((el,index) => {
        if(el.name == name){
            i = index
        }
    }); 
    return i
}



// export const initGame = async (room: Party.Room, connectionId: string,userQueue:string[], userIndex:number) => {
        
//     let userList = await room.storage.get("userlist");
//     await room.storage.put("userlist",userList)
//     room.broadcast(JSON.stringify({type:'init',userList,userQueue, userIndex}))
// }


// export const playerLeft = async (room: Party.Room, connectionId: string,userQueue:string[], userIndex:number) => {

//     let userList = await room.storage.get<UserList>("userlist");

//     if(typeof userList == 'object' && userList){
//       delete userList[connectionId]
//     }

//     userQueue = userQueue.filter((a)=>a != connectionId)
//     await room.storage.put("userlist",userList)
//     room.broadcast(JSON.stringify({type:'init',userList,userQueue,userIndex}))
// }

// export const rateLimit = (sender:Party.Connection) => {

//     const now = new Date().getTime()
//     console.log('===',now)

//         const prev = (sender.state && 'lastMessageTime' in sender.state && sender.state.lastMessageTime) as number

//         if(prev && now < (prev + 200)){
//             sender.close()
//             return false
//         }else{
//             sender.setState({lastMessageTime:now})
//         }

//         return true
// }
