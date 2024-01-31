import type { Server as HTTPServer } from 'node:http'
import { createServer } from 'node:http'
import process from 'node:process'
import express from 'express'
import consola from 'consola'
import { Server as IOServer } from 'socket.io'
import msgchatSocket from './msgChat'
import videochatSocket from './videoChat'

const app = express()

const httpServer = createServer(app)
const port = process.env.PORT || 3000
function setupSockets(server: HTTPServer) {
  const io = new IOServer(server, {
    serveClient: false,
    path: '/webrtc',
  })

  videochatSocket(io)
  msgchatSocket(io)

  return io
}

httpServer.listen(port, () => {
  setupSockets(httpServer)

  consola.info(`Server running on http://localhost:${port}`)
})
