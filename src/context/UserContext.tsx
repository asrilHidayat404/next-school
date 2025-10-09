"use client"

import { User, UserWithRole } from "@/src/types"
import { createContext, useState, ReactNode, useContext } from "react"


type UserContextType = {
  user: UserWithRole | null
  setUser: React.Dispatch<React.SetStateAction<UserWithRole | null>>
}
export const UserContext = createContext<UserContextType | null>(null)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserWithRole | null>(null)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}