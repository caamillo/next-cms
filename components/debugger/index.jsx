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
        <div onClick={ () => setToggle(toggle => !toggle) } className={`fixed bottom-3 right-3 w-12 h-12 outline outline-2 text-lg cursor-pointer shadow-xl rounded-md font-semibold flex justify-center transition-colors items-center ${ !toggle ? 'outline-slate-400 bg-slate-100 text-slate-700' : 'outline-indigo-700 bg-indigo-600 text-white' }`}>
            { toggle ? 'ON' : 'OFF' }
        </div>
    )
}