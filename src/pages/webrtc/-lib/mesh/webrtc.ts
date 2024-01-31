import { assert } from 'chai'
import type { Socket } from 'socket.io-client'
import consola from 'consola'
import type { ClientEvents, ServerEvents } from '../../../../../typings/websockets'
import { jotaiStore } from '../../../../lib/store'
import { mapGet, streamMap } from './maps'
import { registerDataChannel } from './data'
import type { Local } from '@/atoms/local'
import { LocalStreamKey } from '@/atoms/local'
import { peersActions } from '@/atoms/peers'

const iceServers = {
  iceServers: [
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
}

export function createRtcPeerConnection(socket: Socket<ServerEvents, ClientEvents>, local: Local, sid: string, creator: boolean): RTCPeerConnection {
  assert(local.status === 'connecting')

  const rtcPeerConnection = new RTCPeerConnection(iceServers)
  const stream = mapGet(streamMap, LocalStreamKey)

  stream?.getTracks().forEach((track) => {
    rtcPeerConnection.addTrack(track, stream)
  })

  rtcPeerConnection.ontrack = (e) => {
    if (e.streams.length > 0)
      streamMap.set(sid, e.streams[0])
  }

  rtcPeerConnection.onicecandidate = (e) => {
    consola.debug(
      'ice candidate',
      e.candidate?.candidate,
      rtcPeerConnection.iceConnectionState,
    )
    if (e.candidate !== null) {
      socket.emit('webRtcIceCandidate', {
        sid,
        label: e.candidate.sdpMLineIndex,
        candidate: e.candidate.candidate,
      })
    }

    if (
      rtcPeerConnection.iceConnectionState === 'connected'
      || rtcPeerConnection.iceConnectionState === 'completed'
    )
      jotaiStore.set(peersActions.setPeerConnectedAtom, sid)
  }

  if (creator) {
    const channel = rtcPeerConnection.createDataChannel('data')
    registerDataChannel(sid, channel, local)
  }
  else {
    rtcPeerConnection.ondatachannel = (event) => {
      registerDataChannel(sid, event.channel, local)
    }
  }

  return rtcPeerConnection
}
