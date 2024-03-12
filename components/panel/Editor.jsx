import { useState, useEffect, useRef } from 'react';
import InputGroup from './InputGroup';
import settings from '@/lang/settings'

const updateField = (path, lang, row, data) => {
  fetch('/api/panel', {
      method: 'POST',
      body: JSON.stringify({
          job: 'UpdateRow',
          data: {
              'path': path,
              'inpath': row,
              'lang': lang,
              'data': data
          }
      })
  })
      .then(res => res.json())
      .then(data => console.log(data))
}

export default function Editor({ directory, files, absolutePath, setIsModalOpen }) {
  const [selectedLang, setSelectedLang] = useState(Object.keys(files)[0]);
  const [content, setContent] = useState({})
  const [ updates, setUpdates ] = useState({})
  const saveRef = useRef()

  useEffect(() => {
    if (Object.keys(updates).length > 0) saveRef.current.disabled = false
  }, [ updates ])

  useEffect(() => {
    setSelectedLang(Object.keys(files)[0])
  }, [ files ])

  useEffect(() => {
    setUpdates({}) // Wipe Updates
    setContent(files[selectedLang])
  }, [ selectedLang, files ])


  const save = async () => {
    if (saveRef.current.disabled) return
    for (let path of Object.keys(updates)) {
      console.log(path)
      for (let lang of Object.keys(updates[path])) {
        console.log(lang)
        for (let row of Object.keys(updates[path][lang])) {
          const data = updates[path][lang][row]
          console.log(row)
          console.log(data)
          await updateField(path, lang, row, data)
        }
      }
    }
  }

  return (
    <div className='space-y-5'>
      <div className='flex gap-3'>
        { !!content && Object.keys(files).map((lang) => (
            <button
                key={ `btn-${ lang }` }
                className={`px-4 py-2 border border-transparent rounded-md transition-colors ease-in-out shadow-sm text-sm font-medium focus:outline-none ${lang === selectedLang ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 hover:bg-slate-200'}`}
                onClick={ () => setSelectedLang(lang) }
            >
            { settings.flags[lang.replace('.json', '')] ?? lang.replace('.json', '') }
        </button>
        ))}
      </div>
      <div className='w-full h-full'>
        {
          !!content ?
            <>
              {
                Object.entries(content).map(([key, value], c) =>
                  <InputGroup
                    label={ key }
                    data={ value }
                    key={ `igp-0${ c }${ selectedLang }` }
                    idx={ `${ c }${ selectedLang }` }
                    lang={ selectedLang }
                    root={ absolutePath }
                    setUpdates={ setUpdates }
                  />
                )
              }
              <div onClick={ save } className='mt-3 w-fit'>
                <button ref={ saveRef } disabled className='px-4 py-2 border border-transparent rounded-md transition-colors ease-in-out shadow-sm disabled:bg-indigo-600/50 text-sm font-medium focus:outline-none text-white bg-indigo-600'>Save</button>
              </div>
            </>
          :
              <div className='flex w-full h-full justify-center items-center'>
                <p>Empty.</p>
              </div>
        }
      </div>
    </div>
  );
}