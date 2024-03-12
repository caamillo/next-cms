import React, { useState, useEffect } from 'react';

export default function Input({ label, data, idx, path, rpath, lang, setUpdates }) {
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
      <input
        type="text"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}
