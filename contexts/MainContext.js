'use client'
import { useState, useEffect, createContext } from "react"
import { Translate } from "@/lib/debugger"

export const MainContext = createContext()
export const MainContextProvider = ({ children, localizedContent }) => {
    const [ translation, setTranslation ] = useState({ t: () => undefined })
    useEffect(() => {
        const rawUpdates = localStorage.getItem('updates')
        const parsedUpdates = rawUpdates ? JSON.parse(rawUpdates) : {}
        setTranslation(Translate(localizedContent, parsedUpdates))
    }, [])

    return (
        <MainContext.Provider value={{ translation }}>
            { children }
        </MainContext.Provider>
    )
}