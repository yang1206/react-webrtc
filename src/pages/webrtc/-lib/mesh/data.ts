import { assert } from 'chai'
import consola from 'consola'
import { toast } from 'sonner'
import { mapGet, rtcDataChannelMap, streamMap } from './maps'
import { getVideoAudioEnabled } from './stream'
import { jotaiStore } from '@/lib/store'
import type { Local } from '@/atoms/local'
import { LocalStreamKey, localAtom } from '@/atoms/local'
import { peersActions } from '@/atoms/peers'

interface MessagePeerState {
  type: 'peer-state'
  name: string
  audioEnabled: boolean
  videoEnabled: boolean
}

export type Message = MessagePeerState

function onPeerState(sid: string, message: MessagePeerState) {
  consola.debug(
    `received peer state sid=[${sid}] name=[${message.name}] audioEnabled=[${message.audioEnabled}] videoEnabled=[${message.videoEnabled}]`,
  )
  const localPeer = jotaiStore.get(localAtom)
  assert(localPeer.status === 'connected')

  if (localPeer.name !== message.name) {
    toast.info(`${message.name} 加入房间`, {
      position: 'top-right',
    })
  }

  jotaiStore.set(peersActions.setPeerStateAtom, {
    sid,
    name: message.name,
    audioEnabled: message.audioEnabled,
    videoEnabled: message.videoEnabled,
  })
}

export function sendMessage(channel: RTCDataChannel, message: Message) {
  channel.send(JSON.stringify(message))
}

export function registerDataChannel(sid: string, channel: RTCDataChannel, local: Local): void {
  assert(
    local.status !== 'requestingName'
    && local.status !== 'requestingPermissions',
  )

  channel.onopen = () => {
    const stream = mapGet(streamMap, LocalStreamKey)
    const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream)
    sendMessage(channel, {
      type: 'peer-state',
      name: local.name,
      audioEnabled,
      videoEnabled,
    })
  }

  channel.onmessage = function (event) {
    const message: Message = JSON.parse(event.data)

    switch (message.type) {
      case 'peer-state': {
        onPeerState(sid, message)
      }
    }
  }

  rtcDataChannelMap.set(sid, channel)
}
