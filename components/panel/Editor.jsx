import { useState, useEffect } from 'react';
import InputGroup from './InputGroup';
import settings from '@/lang/settings'

export default function Editor({ directory, files, setIsModalOpen }) {
  const [selectedLang, setSelectedLang] = useState(`${ settings.default }.json`);
  const [content, setContent] = useState({});

  // Parse the file content when the selected language changes
  useEffect(() => {
    setContent(files[selectedLang])
  }, [selectedLang, files]);

  // Update the content state when an attribute changes
  const handleAttributeChange = (attributeKey, newValue) => {
    let updatedContent = { ...content };
    // Support nested updates
    function updatePath(path, value, obj) {
      let parts = path.split('.');
      let last = parts.pop();
      let ref = obj;
      parts.forEach((part) => {
        if (!ref[part]) ref[part] = {};
        ref = ref[part];
      });
      ref[last] = value;
    }

    updatePath(attributeKey, newValue, updatedContent);
    setContent(updatedContent);
    onContentChange(directory, selectedLang, JSON.stringify(updatedContent, null, 2));
  };

  // Render the UI for language file editing
  return (
    <div className='space-y-5'>
      <div className='flex gap-3'>
        { !!content && Object.keys(files).map((lang) => (
            <button
                key={ `btn-${ lang }` }
                className={`px-4 py-2 border border-transparent rounded-md transition-colors ease-in-out shadow-sm text-sm font-medium focus:outline-none ${lang === selectedLang ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 hover:bg-slate-200'}`}
                onClick={ () => setSelectedLang(lang) }
            >
            { settings.flags[lang.replace('.json', '')] }
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
                  />
                )
              }
              <div className='mt-3'>
                <button onClick={ () => setIsModalOpen(true) } className='px-4 py-2 border border-transparent rounded-md transition-colors ease-in-out shadow-sm text-sm font-medium focus:outline-none text-white bg-indigo-600'>Save</button>
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