import { assert } from 'chai'
import React from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import clsx from 'clsx'

import { useNavigate, useParams } from '@tanstack/react-router'
import { LocalStreamKey, localAtom, setAudioVideoEnabledAtom } from '@/atoms/local'
import Button from '@/components/ui/button'
import { getVideoAudioEnabled } from '@/pages/webrtc/-lib/mesh/stream'
import { peersAtom } from '@/atoms/peers'
import { sendMessage } from '@/pages/webrtc/-lib/mesh/data'
import { mapGet, rtcDataChannelMap, streamMap } from '@/pages/webrtc/-lib/mesh/maps'

interface ControlProps {
  children: React.ReactElement
  disabled?: boolean
  text: string
}

function Control(props: ControlProps) {
  const { children, disabled = false, text } = props

  const textClassName = clsx('text-sm font-bold', {
    'text-red-500': disabled,
  })

  return (
    <div className="relative flex flex-col items-center space-y-2">
      {children}
      <div className={textClassName}>{text}</div>
    </div>
  )
}

export default function Controls() {
  const navigate = useNavigate()
  const { roomCode, roomName } = useParams({
    from: '/webrtc/$roomCode/$roomName',
  })
  const [local, setLocal] = useAtom(localAtom)
  const peers = useAtomValue(peersAtom)
  const setAudioVideoEnabled = useSetAtom(setAudioVideoEnabledAtom)
  const stream = mapGet(streamMap, LocalStreamKey)

  assert(local.status === 'connecting' || local.status === 'connected')

  const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream)

  const handleLeave = () => {
    navigate({
      to: `/webrtc/goodbye`,
      search: { roomCode, roomName },
      mask: {
        to: '/webrtc/goodbye',
        unmaskOnReload: true,
      },
    })
  }

  const handleToggleAudio = React.useCallback(() => {
    peers.forEach((peer) => {
      const channel = rtcDataChannelMap.get(peer.sid)

      if (channel !== undefined) {
        sendMessage(channel, {
          type: 'peer-state',
          name: local.name,
          audioEnabled: !audioEnabled,
          videoEnabled,
        })
      }
    })

    const audioTracks = stream?.getAudioTracks()

    if (audioTracks !== undefined && audioTracks.length > 0)
      audioTracks[0].enabled = !audioEnabled

    setAudioVideoEnabled({
      audioEnabled: !audioEnabled,
      videoEnabled,
    })
  }, [audioEnabled, local.name, peers, setLocal, stream, videoEnabled])

  const handleToggleVideo = React.useCallback(() => {
    peers.forEach((peer) => {
      const channel = rtcDataChannelMap.get(peer.sid)

      if (channel !== undefined) {
        sendMessage(channel, {
          type: 'peer-state',
          name: local.name,
          audioEnabled,
          videoEnabled: !videoEnabled,
        })
      }
    })

    const videoTracks = stream?.getVideoTracks()

    if (videoTracks !== undefined && videoTracks.length > 0)
      videoTracks[0].enabled = !videoEnabled

    setAudioVideoEnabled({
      audioEnabled,
      videoEnabled: !videoEnabled,
    })
  }, [audioEnabled, local.name, peers, setLocal, stream, videoEnabled])

  const videoIconClassName = clsx('absolute', {
    'text-slate-800': !videoEnabled,
  })
  const audioIconClassName = clsx('absolute', {
    'text-slate-800': !audioEnabled,
  })

  return (
    <div className="m-2 flex items-center justify-center space-x-8 sm:m-4">
      <Control disabled={!audioEnabled} text="麦克风">
        <Button
          color={audioEnabled ? 'slate' : 'red'}
          icon={<span className={clsx('i-heroicons-outline-microphone absolute size-6', audioIconClassName)} />}
          onClick={handleToggleAudio}
          square
        />
      </Control>
      <Control disabled={!videoEnabled} text="摄像头">
        <Button
          color={videoEnabled ? 'slate' : 'red'}
          icon={
            <div className={clsx('i-heroicons-outline-video-camera absolute size-6', videoIconClassName)} />
          }
          onClick={handleToggleVideo}
          square
        />
      </Control>
      <Control text="离开房间">
        <Button
          color="slate"
          icon={
            <div className={clsx('i-heroicons-outline-phone absolute size-6 text-red-500')} />
          }
          onClick={handleLeave}
          square
        />
      </Control>
    </div>
  )
}
