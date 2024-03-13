import { getRoot } from '@/utils/panel';
import { useEffect, useState } from 'react';
import Editor from '@/components/panel/Editor';
import Accordion from '@/components/panel/Accordion';
import Modal from '@/components/panel/modals'
import DeleteModal from '@/components/panel/modals/DeleteModal';

const filterDirs = (dirs) =>
  Object.fromEntries(
    Object.entries(dirs).filter(([ dir ]) => !dir.endsWith('.json'))
  )

const doesFieldExists = (source, keys, iteration=0) => {
    for (let [key, value] of Object.entries(source)) {
        if (key === keys[iteration]) {
            if (iteration < keys.length - 1) return doesFieldExists(source[key], keys, iteration + 1)
            else return true
        }
    }
    return false
}

const isValidField = (files, lang, keys) =>
    doesFieldExists(files[lang], keys.split('.'))

export default function Panel({ directories }) {
  
  const [dirName, setDirName] = useState(Object.keys(directories)[0])
  const [scopeDirs, setScopeDirs] = useState(directories[dirName]) // Focuser of dirs
  const [selectedPage, setSelectedPage] = useState(Object.keys(scopeDirs)[0]) // Util for sidebar to highlight current page
  const [files, setFiles] = useState(scopeDirs[selectedPage]) // Handle the state of current file we are watching
  const [ lang, setLang ] = useState()
  const [ isModalOpen, setIsModalOpen ] = useState(false)
  const [ toDelete, setToDelete ] = useState()
  const [ victim, setVictim ] = useState()
  const [ absolutePath, setAbsolutePath ] = useState(`pages/${ selectedPage }`)
  const [ content, setContent ] = useState({})

  useEffect(() => {
    if (!files || !lang || !toDelete) return
    console.log(files[lang], toDelete.split('.'))
    if (isValidField(files, lang, toDelete)) setVictim(toDelete)
  }, [ toDelete, lang, files ])

  useEffect(() => {
    if (victim) return setIsModalOpen(true)
    setIsModalOpen(false)
    setToDelete()
  }, [ victim ])

  useEffect(() => {
    if (!selectedPage) return
    setFiles(scopeDirs[selectedPage])
    setAbsolutePath(abs =>
        abs.split('/').slice(0, -1).join('/') + `/${ selectedPage }`
      )
  }, [ selectedPage ])

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  const handleSide = (head, sub) => {
    setFiles(files => {
      return files[sub]
    })
    setScopeDirs(scope => {
        return {
          ...scope[head],
          _back: { [dirName]: { ...scope } }
        }
    })
    setAbsolutePath(abs => `${ abs }/${ sub }`)
    setDirName(head)
    setSelectedPage(sub)
  }

  const handleBack = () => {
    setScopeDirs(scope => {
      const directoryName = Object.keys(scope._back)[0]
      const dir = scope._back[directoryName]

      const firstPage = Object.keys(dir)[0]
      setSelectedPage(firstPage)
      setFiles(dir[firstPage])
      setDirName(directoryName)
      setAbsolutePath(abs =>
          abs.split('/').slice(0, -2).join('/') + `/${ firstPage }`
        )

      return dir
    })
  }

  return (
    <div className="w-screen h-screen flex">
      <Modal isOpen={ isModalOpen } >
        {
          victim &&
          <DeleteModal victim={ victim } setVictim={ setVictim } path={ absolutePath } lang={ lang } setContent={ setContent } />
        }
      </Modal>
      <div className="w-[20%] min-w-[300px] p-5 bg-slate-100 border-r">
        <div className='flex flex-col h-full justify-between'>
          <div>
            <p className='text-2xl font-semibold mb-5 text-slate-800 capitalize'>{ dirName }:</p>
            <div className='space-y-2'>
              {Object.keys(filterDirs(scopeDirs)).filter(el => el !== '_back').map((directory, c) => (
                <Accordion
                  key={ directory + c }
                  title={ directory }
                  data={ scopeDirs[directory] }
                  cb={ handlePageSelect }
                  isActive={ selectedPage === directory }
                  handleSide={ handleSide }
                />
              ))}
            </div>
          </div>
          <div>
            {
              !!scopeDirs?._back &&
                <button onClick={ handleBack } className="text-lg px-4 py-2 bg-slate-300 hover:bg-slate-400 rounded-md text-slate-800 w-full capitalize transition-colors duration-200 ease-in-out">
                  Back
                </button>
            }
          </div>
        </div>
      </div>
      <div className="w-full p-5">
        { selectedPage && (
          <Editor
            directory={selectedPage}
            files={ files }
            setToDelete={ setToDelete }
            absolutePath={ absolutePath }
            setLang={ setLang }
            content={ content }
            setContent={ setContent }
          />
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const root = await getRoot('./lang/pages')
  return {
      props: { directories: root }
  }
}
