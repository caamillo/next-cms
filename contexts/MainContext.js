'use client'
import { useState, useEffect, createContext } from "react"
import { Translate } from "@/lib/debugger"

let updates = {}

export const MainContext = createContext()
export const MainContextProvider = ({ children, localizedContent }) => {
    const translation = Translate(localizedContent, updates)

    return (
        <MainContext.Provider value={{ translation, updates }}>
            { children }
        </MainContext.Provider>
    )
}