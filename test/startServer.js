import { start, resetServer, stop, getRequests } from './lib/server'

(async function () {
  console.log(await start())
})()
