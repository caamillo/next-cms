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

const editField = (content, keys, val, iteration=0) => {
  for (let [key, value] of Object.entries(content)) {
    if (key === keys[iteration]) {
      if (typeof value === 'object' && iteration < keys.length - 1) editField(content[key], keys, val, iteration + 1);
      else content[key] = val
    }
  }
}

const removeField = (content, keys, iteration=0) => {
  let c = 0
  for (let [key, value] of Object.entries(content)) {
    if (key === keys[iteration]) {
      if (typeof value === 'object' && iteration < keys.length - 1) removeField(content[key], keys, iteration + 1);
      else {
        if (Array.isArray(content)) content.splice(c, 1)
        else if (typeof content === 'object') {
          delete content[key]
        }
        return
      }
    }
    c += 1
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

  return root[lang]
}

export const UpdateRow = async (path, lang, value, inpath) => {
  const langFolder = './lang/'
  if (path.startsWith('/')) path = path.slice(1)
  const entirePath = `${ langFolder }${ path }`
  const root = await getRoot(entirePath, false)

  const parsedPath = inpath.split('.').filter(el => el)
  console.log('content', root[lang])
  editField(root[lang], parsedPath, value)
  await writeFile(`${ entirePath }/${ lang }`, JSON.stringify(root[lang], null, 3))

  return root[lang]
}

export const DeleteRow = async (path, lang, inpath) => {
  const langFolder = './lang/'
  if (path.startsWith('/')) path = path.slice(1)
  const entirePath = `${ langFolder }${ path }`

  const root = await getRoot(entirePath, false)
  const parsedPath = inpath.split('.').filter(el => el)
  removeField(root[lang], parsedPath)
  await writeFile(`${ entirePath }/${ lang }`, JSON.stringify(root[lang], null, 3))

  return root[lang]
}