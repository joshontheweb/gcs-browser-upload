import needle from 'needle'
import debug from './debug'

var request = needle

function toBuffer (ab) {
  var buffer = new Buffer(ab.byteLength)
  var view = new Uint8Array(ab)
  for (var i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]
  }
  return buffer
}

export async function safePut (url, chunk, options) {
  var headers = options.headers

  let buffer = null

  if (chunk) {
    buffer = toBuffer(chunk)
  }

  debug('SAFEPUT HEADERS: ')
  debug(headers)
  try {
    var res = await new Promise(function (resolve, reject) {
      var req = request.put(url, buffer, {headers: headers}, function (err, res) {
        if (err) return reject(err)
        resolve(res)
      })

      var totalUploaded = 0
      req.on('data', function (chunk) {
        if (options.onUploadProgress) options.onUploadProgress({loaded: totalUploaded += chunk.length})
      })
    })
    res.status = res.statusCode
    debug(`'PUT' request response status: ${res.statusCode}`)
    debug(`'PUT' request response headers: ${JSON.stringify(res.headers)}`)
    debug(`'PUT' request response body: ${res.body}`)
    return res
  } catch (err) {
    err.status = err.statusCode
    debug(`'PUT' error response status: ${err.status}`)
    debug(`'PUT' error response headers: ${JSON.stringify(err.headers)}`)
    debug(`'PUT' error response body: ${err.body}`)
    return err
  }
}
