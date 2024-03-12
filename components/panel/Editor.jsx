import { useState, useEffect, useRef } from 'react';
import InputGroup from './InputGroup';
import settings from '@/lang/settings'
import Image from 'next/image'
import loading from '@/assets/icons/loading.svg'

const filterFiles = (files) =>
  Object.fromEntries(
    Object.entries(files).filter(([ file ]) => file.endsWith('.json'))
  )


export default function Editor({ directory, files, absolutePath, setIsModalOpen }) {
  const [selectedLang, setSelectedLang] = useState(Object.keys(filterFiles(files))[0]);
  const [content, setContent] = useState({})
  const [ updates, setUpdates ] = useState({})
  const [ isSaving, setIsSaving ] = useState(false)
  const saveRef = useRef()

  useEffect(() => {
    if (Object.keys(updates).length > 0) saveRef.current.disabled = false
    console.log(updates)
  }, [ updates ])

  useEffect(() => {
    setSelectedLang(Object.keys(filterFiles(files))[0])
  }, [ files ])

  useEffect(() => {
    setUpdates({}) // Wipe Updates
    setContent(files[selectedLang])
  }, [ selectedLang, files ])

  const updateField = async (path, lang, row, data) => {
    const res = await fetch('/api/panel', {
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
    if (!res.ok) return console.error('Error')
    setContent(await res.json())
    saveRef.current.disabled = true
  }

  const save = async () => {
    setIsSaving(true)
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
    setIsSaving(false)
  }

  return (
    <div className='space-y-5'>
      <div className='flex gap-3'>
        { !!content && Object.keys(filterFiles(files)).map((lang) => (
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
                    setContent={ setContent }
                  />
                )
              }
              <div onClick={ save } className='mt-3 w-fit'>
                <button ref={ saveRef } disabled className='px-4 py-2 border border-transparent flex flex-col justify-center items-center rounded-md transition-colors ease-in-out shadow-sm disabled:bg-indigo-600/50 text-sm font-medium focus:outline-none text-white bg-indigo-600'>
                  <div className='w-[30px]'>
                    {
                      !isSaving ?
                        <p>Save</p> :
                        <Image
                            src={ loading }
                            width={ 20 }
                            height={ 20 }
                            className='spin-anim w-[30px] h-[20px]'
                            alt={ 'loading' }
                        />
                    }
                  </div>
                </button>
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