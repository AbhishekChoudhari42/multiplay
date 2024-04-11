import type * as Party from "partykit/server";

type UserList = {
    [key: string]: {
        color: string,
        pos: number,
    }; // Index signature
}
const colr = () => Math.floor(Math.random()*255)

export const handleDiceRoll = async (room: Party.Room, senderId: string,userQueue : string[],userIndex:number) => {
    let userList = await room.storage.get<UserList>("userlist");
    if (userList) {
        const newPos = (userList[senderId].pos + Math.floor(Math.random() * 5 + 1)) % 10
        userList = { ...userList, [senderId]: { ...userList[senderId], pos: newPos } }
        await room.storage.put("userlist", userList)
        room.broadcast(JSON.stringify({ type: 'dice-roll', userList, userQueue, userIndex}))
    }
}

export const initGame = async (room: Party.Room, connectionId: string,userQueue:string[], userIndex:number) => {
        
    let userList = await room.storage.get("userlist");

    if(!userList){
        userList = {[connectionId]:{pos:0,color:`${colr()},${colr()},${colr()}`}}
    }else {
        userList = {...userList,[connectionId]:{pos:0,color:`${colr()},${colr()},${colr()}`}}
    }
    await room.storage.put("userlist",userList)
    room.broadcast(JSON.stringify({type:'init',userList,userQueue, userIndex}))
}


export const playerLeft = async (room: Party.Room, connectionId: string) => {

let userList = await room.storage.get<UserList>("userlist");
    if(typeof userList == 'object' && userList){
      delete userList[connectionId]
    }
    await room.storage.put("userlist",userList)
    room.broadcast(JSON.stringify({type:'init',userList}))

}


export const nextTurn = () =>{

}