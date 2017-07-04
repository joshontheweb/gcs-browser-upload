import { Promise } from 'es6-promise'
import SparkMD5 from 'spark-md5'
import debug from './debug'

class FileProcessor {
  constructor (file, chunkSize) {
    this.paused = false
    this.file = file
    this.chunkSize = chunkSize
    this.unpauseHandlers = []
  }

  async run (fn, startIndex = 0, endIndex) {
    const { file, chunkSize } = this
    const totalChunks = Math.ceil(file.size / chunkSize)
    let spark = new SparkMD5.ArrayBuffer()

    debug('Starting run on file:')
    debug(` - Total chunks: ${totalChunks}`)
    debug(` - Start index: ${startIndex}`)
    debug(` - End index: ${endIndex || totalChunks}`)

    const processIndex = async (index) => {
      if (index === totalChunks || index === endIndex) {
        debug('File process complete')
        return
      }
      if (this.paused) {
        await waitForUnpause()
      }

      const start = index * chunkSize
      console.time('processIndex:file.slice')
      const section = file.slice(start, start + chunkSize)
      console.timeEnd('processIndex:file.slice')

      console.time('processIndex:getData')
      const chunk = await getData(section)
      console.timeEnd('processIndex:getData')

      console.time('processIndex:getChecksum')
      const checksum = getChecksum(spark, chunk)
      console.timeEnd('processIndex:getChecksum')

      const shouldContinue = await fn(checksum, index, chunk)
      if (shouldContinue !== false) {
        await processIndex(index + 1)
      }
    }

    const waitForUnpause = () => {
      return new Promise((resolve) => {
        this.unpauseHandlers.push(resolve)
      })
    }

    await processIndex(startIndex)
  }

  pause () {
    this.paused = true
  }

  unpause () {
    this.paused = false
    this.unpauseHandlers.forEach((fn) => fn())
    this.unpauseHandlers = []
  }
}

export function getChecksum (spark, chunk) {
  spark.append(chunk)
  const state = spark.getState()
  const checksum = spark.end()
  spark.setState(state)
  return checksum
}

export async function getData (blob) {
  return new Promise((resolve, reject) => {
    let reader = new window.FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(blob)
  })
}

export default FileProcessor
