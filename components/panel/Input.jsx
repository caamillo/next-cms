import React, { useState, useEffect } from 'react';

export default function Input({ label, data, idx }) {
  const [inputValue, setInputValue] = useState(data);

  useEffect(() => {
    setInputValue(data);
  }, [data]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div key={idx} className="flex gap-3 justify-center items-center pl-3">
      {!!label && <p className="text-slate-500 font-medium text-sm min-w-fit">{label}</p>}
      <input
        type="text"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  );
}
