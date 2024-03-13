import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Delete from '@/assets/icons/delete.svg'

export default function Input({ label, data, idx, path, rpath, lang, setUpdates, setToDelete }) {
  const [inputValue, setInputValue] = useState(data);

  useEffect(() => {
    setInputValue(data);
  }, [ data ]);

  const handleChange = (e) => {
    setInputValue(e.target.value)
    setUpdates(updates => {
      updates[path] = updates[path] ?? {}
      updates[path][lang] = updates[path][lang] ?? {}
      updates[path][lang][`${ rpath }${ label ? '.' + label : '' }`] = e.target.value
      return {
        ...updates
      }
    })
  }

  return (
    <div key={ idx } className="flex gap-3 justify-center items-center">
      {!!label &&
        <p className="text-slate-500 font-medium w-[100px] text-sm break-all">{ label }</p>
      }
      <div className='w-full relative'>
        <input
          type="text"
          className="block min-w-[300px] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={inputValue}
          onChange={handleChange}
        />
        <div onClick={ () => setToDelete(`${ rpath }${ label ? '.' + label : '' }`) } className='absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer rounded-md w-6 h-6 flex justify-center items-center bg-red-400 text-white'>
          <Image
            width={ 16 }
            height={ 16 }
            src={ Delete }
            alt='delete'
          />
        </div>
      </div>
    </div>
  );
}
