// const request = require('request-promise-native')
// import * as request from 'request-promise-native'
// import request from 'request-promise-native'
import bhttp from 'bhttp'
// import { request } from 'popsicle'
import needle from 'needle'
import debug from './debug'

var request = needle

// request.headers = {}
// debugger

export async function safePut (url, chunk, options) {
  var headers = options.headers
  // console.log('BYTELENGTH: ', chunk.byteLength)
  // console.log('Buffer: ', chunk.buffer)
  // console.log('Size: ', chunk.size)
  // console.log('Chunk: ', chunk)

  function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = view[i];
    }
    return buffer;
  }

  let buffer

  if (chunk) {
    buffer = toBuffer(chunk)
  }

  // headers['Content-Length'] = buffer.byteLength
  // headers['Accept'] = 'application/json, text/plain, */*'

  // if (chunk) headers['Content-Length'] = chunk.byteLength
  // headers = {
  //   'Content-Range': 'bytes */*',
  //   // 'Content-Type': opts.contentType
  // }
  // var onUploadProgress = options.onUploadProgress
  debug('SAFEPUT URL / CHUNK: ', url, buffer && buffer.byteLength)
  debug('SAFEPUT HEADERS: ')
  debug(headers)
  try {
    var res = await new Promise(function (resolve, reject) {
      needle.put(url, buffer, {headers: headers}, function (err, res) {
        console.log('====ERROR: ', err, 'RES: ', res)
        if (err) return reject(err)
        resolve(res)
      })
      // .on('data', function (chunk) {
      //   if (onUploadProgress) onUploadProgress()
      // }).on('end', function () {
      //   if (onUploadEnd) onUploadEnd()
      // })
    })
    res.status = res.statusCode
    debug(`'PUT' request response status: ${res.statusCode}`)
    debug(`'PUT' request response headers: ${JSON.stringify(res.headers)}`)
    debug(`'PUT' request response body: ${res.body}`)
    return res
  } catch (err) {
    err.status = err.statusCode || 500
    console.log('ERROR Name: ', err)
    console.log('ERROR Name: ', err.name)
    console.log('ERROR statusCode: ', err.statusCode)
    console.log('ERROR Message: ', err.message)
    debug(`'PUT' error response status: ${err.status}`)
    debug(`'PUT' error response headers: ${JSON.stringify(err.headers)}`)
    debug(`'PUT' error response body: ${err.body}`)
    return err
  }
}
