import { getRoot } from '@/utils/panel';
import { useState } from 'react';
import Editor from '@/components/panel/Editor';

export default function Panel({ directories }) {
  const [selectedPage, setSelectedPage] = useState(Object.keys(directories)[0]);

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className="w-screen flex">
      <div className="w-[20%] p-5 min-h-screen bg-gray-100 border-r">
        <div className='flex flex-col h-full justify-between'>
          <div>
            <p className='text-2xl font-semibold mb-5 text-gray-800'>Pages:</p>
            <div className='space-y-2'>
              {Object.keys(directories).map((directory) => (
                <button
                  key={directory}
                  className={`text-lg px-4 py-2 hover:bg-gray-200 rounded-md w-full text-left capitalize transition-colors duration-200 ease-in-out ${selectedPage === directory ? 'bg-gray-300' : ''}`}
                  onClick={() => handlePageSelect(directory)}
                >
                  {directory}
                </button>
              ))}
            </div>
          </div>
          <div>
            <button className="text-lg px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 w-full capitalize transition-colors duration-200 ease-in-out">
              Back
            </button>
          </div>
        </div>
      </div>
      <div className="w-full min-h-screen p-5">
        { selectedPage && (
          <Editor
            directory={selectedPage}
            files={directories[selectedPage]}
          />
        )}
      </div>
    </div>
  )
}

export async function getServerSideProps(context) {
  const root = await getRoot('./lang/pages/')
  // console.log(root)
  return {
      props: { directories: root }
  }
}
