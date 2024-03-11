import Image from 'next/image'
import Expand from "../../assets/icons/expand.svg"
import { useEffect, useState } from 'react'

export default function Accordion({ title, data, cb, isActive, handleSide }) {

    const [ isOpen, setIsOpen ] = useState(isActive)
    const [ dirs ] = useState( Object.keys(data).filter(el => !el.endsWith('.json') && el !== '_back'))

    useEffect(() => {
        if (isActive) setTimeout(() => {
            setIsOpen(isActive)
        }, 100)
        else setIsOpen(false)
    }, [ isActive ])

    return (
        <div className='w-full cursor-pointer'>
            <button onClick={ () => cb(title) } className={`text-lg px-4 py-2 w-full text-left capitalize transition-colors duration-200 ease-in-out flex justify-between ${ isActive ? dirs.length > 0 ? 'bg-slate-300 rounded-tl-md rounded-tr-md' : 'bg-slate-300 rounded-md' : 'hover:bg-slate-200 rounded-md'}`}>
                <p>{ title }</p>
                { dirs.length > 0 && <Image className={`transition-transform duration-300 ease-in-out ${ isOpen ? 'rotate-180' : '' }`} src={ Expand } width={ 30 } height={ 30 } alt='expand' /> }
            </button>
            {
                dirs.length > 0 &&
                    <div style={{ transition: 'grid-template-rows .2s ease-in-out' }} className={`grid rounded-bl-md rounded-br-md ${ !isOpen ? 'grid-rows-[0fr]' : 'grid-rows-[1fr] bg-slate-200' }`}>
                        <div className='overflow-hidden'>
                            <div className='p-2'>
                                {
                                   dirs.map((directory, c) =>
                                            <button onClick={ () => handleSide(title, directory) } key={ `subdir-${ title }${ c }` } className='p-2 pl-4 rounded-md hover:bg-slate-300 transition-colors w-full text-start'>
                                                { directory }
                                            </button>
                                        )
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}