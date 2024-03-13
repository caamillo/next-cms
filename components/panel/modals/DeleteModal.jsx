import Image from "next/image"
import Delete from '@/assets/icons/delete.svg'
import Close from '@/assets/icons/close.svg'
import { useRef } from "react"

export default function DeleteModal({ victim, setVictim, path, lang, setContent }) {

    const inputRef = useRef()

    const handleDelete = async () => {
        const text = inputRef.current.value.trim()
        if (text !== victim) return
        const res = await fetch('/api/panel', {
            method: 'POST',
            body: JSON.stringify({
                job: 'DeleteRow',
                data: {
                    'path': path,
                    'inpath': victim,
                    'lang': lang,
                    'data': 'remove'
                }
            })
        })
        if (!res.ok) return console.error('Error')
        setContent(await res.json())
        setVictim()
    }

    return (
        <div className=" bg-white relative rounded-md w-[600px] px-5 py-6">
            <p className="font-medium text-4xl">Are you sure to delete <span className="font-bold text-slate-500">{ victim.split('.').at(-1) }</span>?</p>
            <p className="text-lg text-slate-600">If so, please digit <span className=" tracking-wide font-bold">{ victim }</span></p>
            <div className="flex justify-center items-center gap-3 mt-5">
                <input
                    type="text"
                    className="w-full text-lg py-1 px-2 outline outline-1 outline-slate-400 rounded"
                    placeholder={ victim }
                    ref={ inputRef }
                />
                <button onClick={ handleDelete } className="bg-red-500 p-2 rounded-md flex justify-center items-center cursor-pointer aspect-square w-10 h-10">
                    <Image
                        src={ Delete }
                        width={ 20 }
                        height={ 20 }
                        alt="delete"
                    />
                </button>
            </div>
            <Image
                src={ Close }
                alt="close"
                width={ 30 }
                height={ 30 }
                onClick={ () => setVictim() }
                className="absolute top-5 right-5 cursor-pointer"
            />
        </div>
    )
}