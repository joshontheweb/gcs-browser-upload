import axios from 'axios'
import debug from './debug'

// axios.create({
//   maxRedirects: 0
// })

axios.defaults.maxRedirects = 0

export async function safePut () {
  try {
    return await axios.put.apply(null, arguments)
  } catch (e) {
    // if (e instanceof Error) {
    //   console.log(e.response.status, e.response.statusText, e.response.headers)
    //   throw e
    // } else {
    // console.log(e.response.status, e.response.statusText, e.response.headers)
    debug(`'PUT' request response ${e.response}`)
    return e.response
    // }
  }
}
