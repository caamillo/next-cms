import { useState, useEffect } from "react"

export default function useUpdates() {
    const [ updates, setUpdates ] = useState()

    const changeUpdates = (data) => {
        localStorage.setItem('updates', JSON.stringify(data))
        setUpdates(data)
    }

    useEffect(() => {
        const t = setInterval(() => {
            const raw = localStorage.getItem('updates')
            if (raw === JSON.stringify(updates)) return
            const parsed = raw ? JSON.parse(raw) : {}
            setUpdates(parsed)
            // console.log(updates.current)
        }, 500)
        return () => clearInterval(t)
    })

    return [
        updates,
        changeUpdates
    ]
}