import { createFileRoute } from '@tanstack/react-router'
import React from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { validateRoom } from '@/pages/webrtc/-lib/rooms/room-encoding'
import type { Socket } from '@/pages/webrtc/-lib/mesh/websocket'
import { createSocket } from '@/pages/webrtc/-lib/mesh/websocket'
import { defaultLocalState, localAtom } from '@/atoms/local'
import { defaultPeersState, peersAtom } from '@/atoms/peers'
import { defaultRoomState, roomAtom, setErrorAtom, setReadyAtom } from '@/atoms/room'
import RequestName from '@/pages/webrtc/-components/room/request-name'
import RequestPermission from '@/pages/webrtc/-components/room/request-permission'
import RequestDevices from '@/pages/webrtc/-components/room/request-devices'
import Loading from '@/pages/webrtc/-components/room/loading'
import Call from '@/pages/webrtc/-components/room/call'
import {
  rtcDataChannelMap,
  rtcPeerConnectionMap,
  streamMap,
} from '@/pages/webrtc/-lib/mesh/maps'

export const Route = createFileRoute('/webrtc/$roomCode/$roomName')({
  component: Page,
})

function Page() {
  const { roomCode, roomName } = Route.useParams()

  const [local, setLocal] = useAtom(localAtom)
  const [room, setRoom] = useAtom(roomAtom)
  const setPeers = useSetAtom(peersAtom)
  const setErrorRoom = useSetAtom(setErrorAtom)
  const setReadyRoom = useSetAtom(setReadyAtom)
  const socketRef = React.useRef<Socket>()
  // Parse and validate room from url
  React.useEffect(() => {
    (async () => {
      try {
        validateRoom(roomCode, roomName)
      }
      catch (err) {
        setErrorRoom()
        return
      }

      setReadyRoom(roomName)
    })()
  }, [setRoom])

  // Clean up on unmount, which only happens on navigating to another page
  React.useEffect(() => {
    return () => {
      // Reset app state
      setPeers(defaultPeersState)
      setRoom(defaultRoomState)
      setLocal(defaultLocalState)

      if (socketRef.current !== undefined)
        socketRef.current.disconnect()

      streamMap.forEach((stream, key) => {
        stream?.getTracks().forEach((track) => {
          track.stop()
        })
        streamMap.delete(key)
      })

      rtcDataChannelMap.forEach((channel, sid) => {
        channel.close()
        rtcDataChannelMap.delete(sid)
      })

      rtcPeerConnectionMap.forEach((rtcPeerConnection, sid) => {
        rtcPeerConnection.close()
        rtcPeerConnectionMap.delete(sid)
      })
    }
  }, [setLocal, setPeers, setRoom])

  React.useEffect(() => {
    (async () => {
      if (local.status === 'connecting')

        createSocket(roomCode, local, socketRef)
    })()
  }, [local, roomCode, setLocal, setPeers])

  return (
    <div className="size-full max-h-full max-w-full overflow-hidden">
      {room.status === 'loading' && <Loading />}
      {room.status === 'error' && <p>{room.error}</p>}
      {room.status === 'ready' && (
        <>
          {local.status === 'requestingName' && <RequestName />}
          {local.status === 'requestingPermissions' && <RequestPermission />}
          {local.status === 'requestingDevices' && <RequestDevices />}
          {local.status === 'connecting' && <Loading />}
          {local.status === 'connected' && <Call />}
        </>
      )}
    </div>
  )
}
