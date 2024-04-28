import type * as Party from "partykit/server";

// type UserList = {
//     [key: string]: {
//         color: string,
//         pos: number,
//     }; // Index signature
// }
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

// export const handleDiceRoll = async (room: Party.Room, senderId: string,userQueue : string[],userIndex:number,startTime:number) => {
//     let userList = await room.storage.get<UserList>("userlist");
//     if (userList) {
//         const newPos = (userList[senderId].pos + Math.floor(Math.random() * 5 + 1)) % 10
//         userList = { ...userList, [senderId]: { ...userList[senderId], pos: newPos } }
//         await room.storage.put("userlist", userList)
//         room.broadcast(JSON.stringify({ type: 'dice-roll', userList, userQueue, userIndex,startTime}))
//     }
// }

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
