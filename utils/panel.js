import { readdir } from 'fs/promises'
import { join } from 'path'
import { promises as fsPromises } from 'fs'

export const getRoot = async (source) => {
  const root = {}
  await traverseDirectory(source, root)
  return root
};

const traverseDirectory = async (source, parentObject) => {
  const dirents = await readdir(source, { withFileTypes: true })

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      parentObject[dirent.name] = {}
      await traverseDirectory(join(source, dirent.name), parentObject[dirent.name])
    } else if (dirent.name.endsWith('.json')) {
      const filePath = join(source, dirent.name)
      try {
        const fileContents = await fsPromises.readFile(filePath, 'utf8')
        parentObject[dirent.name] = JSON.parse(fileContents)
      } catch (error) {
        console.error(`Error reading or parsing JSON file ${filePath}: ${error}`)
        parentObject[dirent.name] = `Error: ${error}`
      }
    }
  }
}

const mergeLangs = (path) => {
    const ext = Object.keys(path).filter(el => el.endsWith('.json'))
    const data = {}

    for (let lang of ext)
        data[lang] = path[lang]
    console.log(data)
    
    return [ ...Object.keys(path).filter(el => !el.endsWith('.json')), data ]
}