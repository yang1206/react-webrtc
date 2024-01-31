import { assert } from 'chai'
import React from 'react'
import { useAtomValue } from 'jotai'
import GridVideo from './grid-video'
import { LocalStreamKey, localAtom } from '@/atoms/local'
import { mapGet, streamMap } from '@/pages/webrtc/-lib/mesh/maps'
import { getVideoAudioEnabled } from '@/pages/webrtc/-lib/mesh/stream'

export default function LocalVideo() {
  const local = useAtomValue(localAtom)

  assert(local.status === 'connecting' || local.status === 'connected')
  const stream = mapGet(streamMap, LocalStreamKey)
  const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream)

  return (
    <GridVideo
      audioDisabled={!audioEnabled}
      local
      name={`${local.name} (You)`}
      stream={stream}
      videoDisabled={!videoEnabled}
    />
  )
}
