import { create } from 'zustand'
interface Store{
    user:string,
    setUser:(userValue:string)=>void
  }
export const useStore = create<Store>((set) => ({
  user: "",
  setUser: (userValue:string) => set({ user: userValue }),
}))