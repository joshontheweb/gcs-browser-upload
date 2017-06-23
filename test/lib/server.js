import axios from 'axios'
import express from 'express'
import getPort from 'get-port'
import pify from 'pify'
import bodyParser from 'body-parser'

let server = null
let requests = []
let file = null
const router = new express.Router()

router.use(bodyParser.text())

router.use((req, res, next) => {
  const range = req.headers['content-range']
  const matchKnown = range.match(/^bytes (\d+?)-(\d+?)\/(\d+?)$/)
  const matchUnknownRange = range.match(/^bytes \*\/(\d+?)$/)
  const matchUnknownTotal = range.match(/^bytes (\d+?)-(\d+?)\/\*$/)
  const matchUnknownRangeAndTotal = range.match(/^bytes \*\/\*$/)

  if (matchUnknownRangeAndTotal) {
    req.range = {
      known: false
    }
    next()
  } else if (matchUnknownRange) {
    req.range = {
      known: false,
      total: matchUnknownRange[1]
    }
    next()
  } else if (matchUnknownTotal) {
    req.range = {
      known: true,
      start: matchUnknownTotal[1],
      end: matchUnknownTotal[2]
    }
    next()
  } else if (matchKnown) {
    req.range = {
      known: true,
      start: matchKnown[1],
      end: matchKnown[2],
      total: matchKnown[3]
    }
    next()
  } else {
    res.status(400).send('No valid content-range header provided')
  }
})

router.use((req, res, next) => {
  requests.push({
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    body: req.body
  })
  next()
})

router.put('/', (req, res) => {
  if (!file) {
    file = {
      total: req.range.total,
      index: 0
    }
  }

  if (req.range.end) {
    file.index = req.range.end
  }
  res.set('range', `bytes=0-${file.index}`)
  if (file.index + 1 === file.total) {
    console.log('UPLOAD COMPLETED')
    res.send(200).send('OK')
  } else {
    res.status(308).send('Resume Incomplete')
  }
})

router.put('/fail', (req, res) => {
  res.status(500).send('Internal Server Error')
})

export async function start () {
  const port = await getPort()
  const app = express()
  app.use('/file', router)
  server = await pify(::app.listen)(port)
  axios.defaults.baseURL = `http://localhost:${port}`
}

export function resetServer () {
  requests = []
  file = null
}

export function stop () {
  if (server) {
    server.close()
    server = null
  }
}

export function getRequests () {
  return requests
}
