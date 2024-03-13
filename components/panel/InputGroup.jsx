import Input from "./Input";
import Image from "next/image";
import plus from '@/assets/icons/plus.svg'
import Delete from '@/assets/icons/delete.svg'
import { useEffect, useState } from "react"

const sortStringFirst = (data) => {
    if (Array.isArray(data)) {
        return data.sort((a, b) => {
          const isAString = typeof a === 'string'
          const isBString = typeof b === 'string'
    
          if (isAString && !isBString) return -1
          else if (!isAString && isBString) return 1

          return 0
        })
    } else if (typeof data === 'object' && data !== null) {
        const sortedKeys = Object.keys(data).sort((a, b) => {
            const isAString = typeof data[a] === 'string'
            const isBString = typeof data[b] === 'string'

            if (isAString && !isBString) return -1
            else if (!isAString && isBString) return 1
            return 0
        })
    
        const sortedObject = {}
        for (const key of sortedKeys) {
            sortedObject[key] = data[key]
        }

        return sortedObject
    }
    
    return null
}

export default function InputGroup({ label, data, indent = 0, idx, prev='', root, lang, setUpdates, setContent, setToDelete }) {
    const generateKey = (prefix, index) => `${prefix}-${indent}-${index}`;
    const [ path, setPath ] = useState(`${ prev.length ? `${ prev }.` : '' }${ label }`)
    useEffect(() => {
        setPath(`${ prev.length ? `${ prev }.` : '' }${ label }`)
      }, [prev, label])

    const addRowHandler = async (data) => {
        if (Array.isArray(data)) console.log('Create field with empty key')
        else if (typeof data === 'object') console.log('Create field with key')
        else return console.log('data not valid')

        const res = await fetch('/api/panel', {
            method: 'POST',
            body: JSON.stringify({
                job: 'AddRow',
                data: {
                    'path': root,
                    'inpath': path,
                    'lang': lang,
                    'data': {
                        'test': 'test'
                    }
                }
            })
        })
        if (!res.ok) return console.error('Error')
        setContent(await res.json())
    }

    return (
        <div key={idx} className="space-y-3" style={{ paddingLeft: `${indent * 20}px` }}>
            {
                !!label &&
                    <div className="flex items-center gap-3 mt-5">
                        <p className="uppercase text-xs text-slate-600 font-bold tracking-wide">{label}</p>
                        {
                            (Array.isArray(data) || typeof data === 'object') &&
                                <div className="flex gap-1">
                                    <div key={ generateKey('add-row', `${ label }-${ idx }`) } onClick={ () => addRowHandler(data) } className="flex justify-center items-center bg-indigo-600 hover:bg-indigo-400 transition-colors px-2 py-1 gap-1 rounded-md cursor-pointer">
                                        <Image
                                            src={ plus }
                                            width={ 15 }
                                            height={ 15 }
                                            alt={ 'plus' }
                                        />
                                        <p className="text-xs text-white font-bold">ADD</p>
                                    </div>
                                    <div onClick={ () => setToDelete(`${ path }`) } className='cursor-pointer rounded-md w-6 h-6 flex justify-center items-center bg-red-400 text-white'>
                                        <Image
                                            width={ 16 }
                                            height={ 16 }
                                            src={ Delete }
                                            alt='delete'
                                        />
                                    </div>
                                </div>
                        }
                    </div>
            }
            {
                Array.isArray(data) || typeof data === 'object' ?
                    Object.entries(sortStringFirst(data)).map(([key, value], c) =>
                        Array.isArray(value) || typeof value === 'object' ?
                            <InputGroup
                                label={key}
                                data={value}
                                indent={indent + 1}
                                idx={generateKey(`igp-arr`, `${key}-${c}`)}
                                key={generateKey(`igp-arr`, `${key}-${c}`)}
                                prev={ path }
                                root={ root }
                                lang={ lang }
                                setUpdates={ setUpdates }
                                setContent={ setContent }
                                setToDelete={ setToDelete }
                            /> :
                            typeof value === 'object' ?
                            <Input
                                label={_key}
                                data={_value}
                                path={ root }
                                rpath={ path }
                                lang={ lang }
                                setUpdates={ setUpdates }
                                key={generateKey(`i-obj-field`, `${_key}-${_c}`)}
                                idx={generateKey(`i-obj-field`, `${_key}-${_c}`)}
                                setToDelete={ setToDelete }
                            /> :
                            typeof value === 'string' ?
                                <Input
                                    data={value}
                                    label={ key }
                                    path={ root }
                                    rpath={ path }
                                    lang={ lang }
                                    setUpdates={ setUpdates }
                                    key={generateKey(`i-in-field`, `${key}-${c}`)}
                                    idx={generateKey(`i-in-field`, `${key}-${c}`)}
                                    setToDelete={ setToDelete }
                                /> :
                            <div key={generateKey(`inv-in-field`, `${key}-${c}`)}>Invalid Value</div>
                    ) :
            typeof data === 'string' ?
                <Input
                    data={data}
                    path={ root }
                    rpath={ path }
                    lang={ lang }
                    setUpdates={ setUpdates }
                    key={generateKey(`i-field`, `${idx}`)}
                    idx={generateKey(`i-field`, `${idx}`)}
                    setToDelete={ setToDelete }
                /> :
                <div key={generateKey(`inv-field`, `${idx}`)}>Invalid Value</div>
            }
        </div>
    );
}
