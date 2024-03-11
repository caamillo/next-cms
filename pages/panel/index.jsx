import { getRoot } from '@/utils/panel';
import { useEffect, useState } from 'react';
import Editor from '@/components/panel/Editor';
import Accordion from '@/components/panel/Accordion';

export default function Panel({ directories }) {
  
  const [dirName, setDirName] = useState(Object.keys(directories)[0])
  const [scopeDirs, setScopeDirs] = useState(directories[dirName]) // Focuser of dirs
  const [selectedPage, setSelectedPage] = useState(Object.keys(scopeDirs)[0]) // Util for sidebar to highlight current page
  const [path, setPath] = useState(scopeDirs[selectedPage]) // Handle the state of current file we are watching

  useEffect(() => {
    if (!selectedPage) return
    setPath(scopeDirs[selectedPage])
  }, [ selectedPage ])

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  const handleSide = (head, sub) => {
    console.log(head, sub, path)
    setPath(path => {
      return path[sub]
    })
    setScopeDirs(scope => {
      console.log(scope)
        return {
          ...scope[head],
          _back: { [dirName]: { ...scope } }
        }
    })
    setDirName(head)
    setSelectedPage(sub)
  }

  const handleBack = () => {
    setScopeDirs(scope => {
      const directoryName = Object.keys(scope._back)[0]
      const dir = scope._back[directoryName]

      const firstPage = Object.keys(dir)[0]
      setSelectedPage(firstPage)
      setPath(dir[firstPage])
      setDirName(directoryName)

      return dir
    })
  }

  return (
    <div className="w-screen h-screen flex">
      <div className="w-[20%] min-w-[300px] p-5 bg-slate-100 border-r">
        <div className='flex flex-col h-full justify-between'>
          <div>
            <p className='text-2xl font-semibold mb-5 text-gray-800 capitalize'>{ dirName }:</p>
            <div className='space-y-2'>
              {Object.keys(scopeDirs).filter(el => el !== '_back').map((directory, c) => (
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
                <button onClick={ handleBack } className="text-lg px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 w-full capitalize transition-colors duration-200 ease-in-out">
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
            files={ path }
          />
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const root = await getRoot('./lang/pages')
  console.log(root)
  return {
      props: { directories: root }
  }
}
