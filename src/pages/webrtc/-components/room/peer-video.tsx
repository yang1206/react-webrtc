import React from 'react'
import GridVideo from './grid-video'
import type { Peer } from '@/atoms/peers'
import { streamMap } from '@/pages/webrtc/-lib/mesh/maps'

interface Props {
  peer: Peer
}

export default function PeerVideo(props: Props) {
  const { peer } = props
  const stream = streamMap.get(peer.sid)

  return (
    <GridVideo
      audioDisabled={!peer.audioEnabled}
      loading={peer.status !== 'connected'}
      name={peer.name}
      stream={stream}
      videoDisabled={!peer.videoEnabled}
    />
  )
}
