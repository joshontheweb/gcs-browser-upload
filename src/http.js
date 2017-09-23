/* globals Worker */


// import axios from 'axios'
import debug from './debug'

let requestWorker = new Worker('/media/scripts/workers/request-worker.js')

export async function safePut (url, chunk, options) {
  return new Promise(function (resolve, reject) {
    requestWorker.addEventListener('message', function (e) {
      if (res.type === 'success') {
        var res = e.data
        debug(`'PUT' request response status: ${res.status}`)
        debug(`'PUT' request response headers: ${JSON.stringify(res.headers)}`)
        debug(`'PUT' request response body: ${res.data}`)
        resolve(res)
      } else {
        debug(`'PUT' error response status: ${res.status}`)
        debug(`'PUT' error response headers: ${JSON.stringify(res.headers)}`)
        debug(`'PUT' error response body: ${res.data}`)
        reject(res)
      }
    }, false)

    requestWorker.postMessage(Object.extend({
      type: 'PUT',
      url: url,
      data: chunk
    }, options))
  })
}
