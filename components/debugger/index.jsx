import { useContext, useState, useEffect, useRef } from "react"
import { MainContext } from "@/contexts/MainContext"
import useUpdates from "@/hooks/useUpdates"

export default function Debugger({ route, locale }) {
    const { translation } = useContext(MainContext)
    const [ toggle, setToggle ] = useState(translation.toggle)
    const [ updates, setUpdates ] = useUpdates()

    useEffect(() => {
        if (!updates) return
        console.log('updates', updates)
    }, [ updates ])

    const save = async (row, data) => {
        const res = await fetch('/api/panel', {
            method: 'POST',
            body: JSON.stringify({
                job: 'UpdateRow',
                data: {
                    'path': `pages/${ route }`,
                    'inpath': row,
                    'lang': `${ locale }.json`,
                    'data': data
                }
            })
        })
        if (!res.ok) return console.error('Error')
        setUpdates({})
        //setContent(await res.json())
        //saveRef.current.disabled = true
    }

    const saveAll = async () => {
        for (let update of Object.keys(updates)) {
            await save(update, updates[update])
        }
    }

    useEffect(() => {
        if (toggle === undefined) return

        if (toggle) translation.start()
        else translation.stop()
    }, [ toggle ])

    return (
        <div className="fixed bottom-3 right-3 space-y-4">
            {
                toggle && !!updates && Object.keys(updates).length > 0 &&
                    <div onClick={ saveAll } className="bg-indigo-600 w-12 h-12 font-bold text-white flex justify-center items-center cursor-pointer rounded-md text-xl">
                        S
                    </div>
            }
            <div onClick={ () => setToggle(toggle => !toggle) } className={`w-12 h-12 outline outline-2 text-lg cursor-pointer shadow-xl rounded-md font-semibold flex justify-center transition-colors items-center ${ !toggle ? 'outline-slate-400 bg-slate-100 text-slate-700' : 'outline-indigo-700 bg-indigo-600 text-white' }`}>
                { toggle ? 'ON' : 'OFF' }
            </div>
        </div>
    )
}