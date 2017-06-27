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
    return res
  } catch (e) {
    // if (e instanceof Error) {
    //   console.log(e.response.status, e.response.statusText, e.response.headers)
    //   throw e
    // } else {
    // console.log(e.response.status, e.response.statusText, e.response.headers)
    debug(`'PUT' error request response: ${e.response}`)
    return e.response
    // }
  }
}
