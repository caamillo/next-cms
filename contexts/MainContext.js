'use client'
import { useState, useEffect, createContext } from "react"
import { Translate } from "@/lib/debugger"

export const MainContext = createContext()
export const MainContextProvider = ({ children, localizedContent }) => {
    const [ updates, setUpdates ] = useState({})
    const translation = Translate(localizedContent, updates, setUpdates)

    useEffect(() => {
        console.log(updates)
    }, [ updates ])

    return (
        <MainContext.Provider value={{ translation, updates, setUpdates }}>
            { children }
        </MainContext.Provider>
    )
}