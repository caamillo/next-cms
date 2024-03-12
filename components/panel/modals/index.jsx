import { useEffect, useRef } from "react"

export default function Modal({ children, isOpen }) {

    const modalRef = useRef()

    useEffect(() => {
        if (isOpen) setTimeout(() => {
            modalRef.current.setAttribute('data-show', '')
        }, 300)
    }, [ isOpen ])

    return (
        <div className={`w-screen h-screen fixed top-0 left-0 transition-all duration-300 ease-out flex justify-center items-center ${ isOpen ? 'bg-[#00000050] backdrop-blur-sm' :'pointer-events-none opacity-0' }`}>
            <div ref={ modalRef } className="transition-transform duration-500 ease-in-out translate-y-[-300%] data-[show]:translate-y-0">{ children }</div>
        </div>
    )
}