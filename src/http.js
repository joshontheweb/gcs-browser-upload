import axios from 'axios'
import debug from './debug'

// axios.create({
//   maxRedirects: 0
// })

axios.defaults.maxRedirects = 0

export async function safePut () {
  try {
    var res = await axios.put.apply(null, arguments)
    debug(`'PUT' request response: ${res}`)
    // debug(`'PUT' request response status: ${res.status}`)
    // debug(`'PUT' request response headers: ${JSON.stringify(res.headers)}`)
    // debug(`'PUT' request response body: ${res.data}`)
    return res
  } catch (e) {
    // if (e instanceof Error) {
    //   console.log(e.response.status, e.response.statusText, e.response.headers)
    //   throw e
    // } else {
    // console.log(e.response.status, e.response.statusText, e.response.headers)
    debug(`'PUT' error request response: ${e.response}`)
    // debug(`'PUT' error response status: ${e.response.status}`)
    // debug(`'PUT' error response headers: ${JSON.stringify(e.response.headers)}`)
    // debug(`'PUT' error response body: ${e.response.data}`)
    console.error(e)
    return e.response
    // }
  }
}
