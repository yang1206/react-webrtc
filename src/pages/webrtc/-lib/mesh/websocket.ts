import type { Socket as IOSocket } from 'socket.io-client'
import { io } from 'socket.io-client'
import consola from 'consola'
import { toast } from 'sonner'
import type {
  ClientEvents,
  ServerEvents,
  WebRtcAnswer,
  WebRtcIceCandidate,
  WebRtcOffer,
} from '../../../../../typings/websockets'
import { createRtcPeerConnection } from './webrtc'
import {
  mapGet,
  rtcDataChannelMap,
  rtcPeerConnectionMap,
  streamMap,
} from './maps'
import { peersActions, peersAtom } from '@/atoms/peers'
import type { Local } from '@/atoms/local'
import { setSocketAtom } from '@/atoms/local'
import { jotaiStore } from '@/lib/store'

export type Socket = IOSocket<ServerEvents, ClientEvents>

function onConnected(socket: Socket, roomCode: string) {
  return () => {
    consola.success(`connected`)
    socket.emit('joinRoom', roomCode)
    jotaiStore.set(setSocketAtom)
  }
}

function onPeerConnect(socket: Socket, local: Local) {
  return async (sid: string) => {
    consola.success(`peerConnect sid=${sid}`)

    if (rtcPeerConnectionMap.get(sid)) {
      console.warn('Received connect from known peer')
      return
    }

    const rtcPeerConnection = createRtcPeerConnection(
      socket,
      local,
      sid,
      true,
    )
    rtcPeerConnectionMap.set(sid, rtcPeerConnection)
    const offerSdp = await rtcPeerConnection.createOffer()
    rtcPeerConnection.setLocalDescription(offerSdp)
    jotaiStore.set(peersActions.addPeerAtom, sid)
    socket.emit('webRtcOffer', { offerSdp, sid })
  }
}

function onPeerDisconnect() {
  return (sid: string) => {
    consola.warn(`peerDisconnect sid=${sid}`)
    const leave = jotaiStore.get(peersAtom).find(peer => peer.sid === sid)
    toast.warning(`${leave?.name} 离开房间`, {
      position: 'top-right',
    })

    const rtcPeerConnection = rtcPeerConnectionMap.get(sid)
    rtcPeerConnection?.close()
    rtcPeerConnectionMap.delete(sid)

    const rtcDataChannel = rtcDataChannelMap.get(sid)
    rtcDataChannel?.close()
    rtcDataChannelMap.delete(sid)

    streamMap.delete(sid)
    jotaiStore.set(peersActions.deletePeerAtom, sid)
  }
}

function onWebRtcOffer(socket: Socket, local: Local) {
  return async ({ offerSdp, sid }: WebRtcOffer) => {
    consola.warn(`webRtcOffer fromSid=${socket.id} toSid=${sid}`)

    const rtcPeerConnection = createRtcPeerConnection(
      socket,
      local,
      sid,
      false,
    )
    rtcPeerConnectionMap.set(sid, rtcPeerConnection)
    jotaiStore.set(peersActions.addPeerAtom, sid)

    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(offerSdp))
    const answerSdp = await rtcPeerConnection.createAnswer()
    rtcPeerConnection.setLocalDescription(answerSdp)

    socket.emit('webRtcAnswer', { answerSdp, sid })
  }
}

function onWebRtcAnswer(socket: Socket) {
  return (webRtcAnswer: WebRtcAnswer) => {
    consola.warn(`webRtcAnswer fromSid=${socket.id} toSid=${webRtcAnswer.sid}`)
    const rtcPeerConnection = mapGet(rtcPeerConnectionMap, webRtcAnswer.sid)
    rtcPeerConnection.setRemoteDescription(
      new RTCSessionDescription(webRtcAnswer.answerSdp),
    )
  }
}

function onWebRtcIceCandidate() {
  return (webRtcIceCandidate: WebRtcIceCandidate) => {
    const rtcPeerConnection = mapGet(
      rtcPeerConnectionMap,
      webRtcIceCandidate.sid,
    )
    consola.success(
      'received ice candidate',
      webRtcIceCandidate.candidate,
      rtcPeerConnection.iceConnectionState,
    )
    rtcPeerConnection.addIceCandidate(
      new RTCIceCandidate({
        sdpMLineIndex: webRtcIceCandidate.label,
        candidate: webRtcIceCandidate.candidate,
      }),
    )

    if (
      rtcPeerConnection.iceConnectionState === 'connected'
      || rtcPeerConnection.iceConnectionState === 'completed'
    )
      jotaiStore.set(peersActions.setPeerConnectedAtom, webRtcIceCandidate.sid)
  }
}

export async function createSocket(roomCode: string, local: Local, socketRef: React.MutableRefObject<Socket | undefined>): Promise<void> {
  const socket: Socket = io('/video', {
    path: '/socket/webrtc',
  })

  socketRef.current = socket

  socket.on('connected', onConnected(socket, roomCode))
  socket.on('peerConnect', onPeerConnect(socket, local))
  socket.on('peerDisconnect', onPeerDisconnect())
  socket.on('webRtcOffer', onWebRtcOffer(socket, local))
  socket.on('webRtcAnswer', onWebRtcAnswer(socket))
  socket.on('webRtcIceCandidate', onWebRtcIceCandidate())
}
