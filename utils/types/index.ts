export type UserType = {
    name: string,
    pos: number,
    bal: number,
    colour: string,
    connId: string
}
  
export type UserStateType = {
    userQueue: UserType[],
    userIndex: number
}
  
export type StoreType = {
    user: string,
    setUser: (userValue: string) => void
}

