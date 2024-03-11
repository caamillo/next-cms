import { useContext, useState, useEffect } from "react"
import { MainContext } from "@/contexts/MainContext"

export default function Debugger() {
    const { translation } = useContext(MainContext)
    const [ toggle, setToggle ] = useState(translation.toggle)

    useEffect(() => {
        if (toggle) {
            translation.toggle = true
            translation.loop()
        } else translation.toggle = false
    }, [ toggle ])

    return (
        <div onClick={ () => setToggle(toggle => !toggle) } className="fixed bottom-3 right-3 w-12 h-12 outline outline-slate-400 bg-slate-100 text-slate-700 text-lg cursor-pointer shadow-xl rounded-md font-bold flex justify-center items-center">
            { toggle ? 'ON' : 'OFF' }
        </div>
    )
}