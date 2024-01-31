import type { Server, Socket } from 'socket.io'
import consola from 'consola'
import type {
  WebRtcAnswer,
  WebRtcIceCandidate,
  WebRtcOffer,
} from '../typings/websockets'

function onJoinRoom(socket: Socket) {
  return (room: string) => {
    consola.info(`join room=${room} sid=${socket.id}`)

    socket.join(room)
    socket.broadcast.to(room).emit('peerConnect', socket.id)
  }
}

function onWebRtcAnswer(server: Server, socket: Socket) {
  return ({ answerSdp, sid }: WebRtcAnswer) => {
    consola.info(`webRtcAnswer fromSid=${socket.id} toSid=${sid}`)

    server.sockets.sockets
      .get(sid)
      ?.emit('webRtcAnswer', { answerSdp, sid: socket.id })
  }
}

function onWebRtcIceCandidate(server: Server, socket: Socket) {
  return ({ candidate, label, sid }: WebRtcIceCandidate) => {
    consola.debug(`webRtcIceCandidate fromSid=${socket.id} toSid=${sid}`)

    server.sockets.sockets
      .get(sid)
      ?.emit('webRtcIceCandidate', { candidate, label, sid: socket.id })
  }
}

function onWebRtcOffer(server: Server, socket: Socket) {
  return ({ offerSdp, sid }: WebRtcOffer) => {
    consola.info(`webRtcOffer fromSid=${socket.id} toSid=${sid}`)

    server.sockets.sockets
      .get(sid)
      ?.emit('webRtcOffer', { sid: socket.id, offerSdp })
  }
}

function onDisconnect(socket: Socket) {
  return (reason: string) => {
    consola.info(`disconnecting reason=${reason} sid=${socket.id}`)

    socket.rooms.forEach((room) => {
      socket.broadcast.to(room).emit('peerDisconnect', socket.id)
    })
  }
}

function onConnection(server: Server) {
  return (socket: Socket) => {
    consola.info(`connection sid=${socket.id}`)

    socket.emit('connected')
    socket.on('joinRoom', onJoinRoom(socket))
    socket.on('disconnecting', onDisconnect(socket))
    socket.on('webRtcAnswer', onWebRtcAnswer(server, socket))
    socket.on('webRtcIceCandidate', onWebRtcIceCandidate(server, socket))
    socket.on('webRtcOffer', onWebRtcOffer(server, socket))
  }
}

function socket(io: Server) {
  const videoNamespace = io.of('/video')

  videoNamespace
    .on('connection', onConnection(io))
}

export default socket
