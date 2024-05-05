import type * as Party from "partykit/server";
type posType = {
    [key: string]: { [value: string]: number }
}
export type User = {
    name: string,
    pos: number,
    bal: number,
    colour: string,
    connId: string
}

export const snakes_ladders_pos: posType = {
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

export function getRandomColor() {
    const randomColor = Math.floor((Math.random() * 8388607) + 8388607).toString(16);
    return '#' + randomColor.padStart(6, '0');
}

export const error = (room:Party.Room,message:string) => {
    room.broadcast(JSON.stringify({ type: 'error', message }))
}

export const rateLimit = (sender: Party.Connection,room:Party.Room) => {

    const now = new Date().getTime()

    const prev = (sender.state && 'lastMessageTime' in sender.state && sender.state.lastMessageTime) as number

    if (prev && now < (prev + 200)) {
        sender.close(1008,"rate limit exceeded")
    } else {
        sender.setState({ lastMessageTime: now })
    }
}

// find userIndex for next non winner user

export const getNextUserIndex = (userQueue: User[], userIndex: number, winners: String[]) => {

    let nextUserIndex = (userIndex + 1) % userQueue.length; // (current + 1)%length
    // start loop from current + 1 user to last user
    let start = nextUserIndex
    let end = nextUserIndex + userQueue.length - 1

    for (let i = start; i <= end; i++) {

        let translatedIndex = i % userQueue.length

        if (!winners.includes(userQueue[translatedIndex].name)) {
            // index of the next non winner user
            return translatedIndex;
        }
    }

    return -1
}


export const getCurrentPositionOutcome = (pos: string) => {

    if (snakes_ladders_pos["snakes"][pos]) {

        return { value: 'snake', pos: snakes_ladders_pos["snakes"][pos] }
    }

    if (snakes_ladders_pos["ladders"][pos]) {

        return { value: 'ladder', pos: snakes_ladders_pos["ladders"][pos] }

    }

    return {pos:0,value:''}
}