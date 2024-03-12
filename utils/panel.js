import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { promises as fsPromises } from 'fs'

export const getRoot = async (source, prefixFolder=true) => {
  const root = {}
  await traverseDirectory(source, root)

  let directoryName = source
  if (directoryName.endsWith('/')) directoryName.slice(0, -1)
  directoryName = directoryName.split('/').at(-1)

  return prefixFolder ? {
    [ directoryName ]: {
      ...root
    }
  } : { ...root }
}

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

function updateChildren(content, keys, values, iteration=0) {
  for (let [key, value] of Object.entries(content)) {
    if (key === keys[iteration]) {
      if (typeof value === 'object' && iteration < keys.length - 1) updateChildren(content[key], keys, values, iteration + 1);
      else content[key] = {
        ...content[key],
        ...values
      }
    }
  }
}

export const AddRow = async (path, lang, value, inpath) => {
  const langFolder = './lang/'
  if (path.startsWith('/')) path = path.slice(1)
  const entirePath = `${ langFolder }${ path }`

  const root = await getRoot(entirePath, false)

  const parsedPath = inpath.split('.').filter(el => el)
  updateChildren(root[lang], parsedPath, value)
  await writeFile(`${ entirePath }/${ lang }`, JSON.stringify(root[lang], null, 3))

  return true
}