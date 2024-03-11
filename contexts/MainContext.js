'use client'
import { useEffect, createContext } from "react"
import { Translate } from "@/lib/debugger"

export const MainContext = createContext()
export const MainContextProvider = ({ children, localizedContent }) => {
    const translation = Translate(localizedContent)

    return (
        <MainContext.Provider value={{ translation }}>
            { children }
        </MainContext.Provider>
    )
}