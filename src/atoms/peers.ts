import { atom } from 'jotai'

export type Peer = {
  name?: string
  sid: string
  audioEnabled: boolean
  videoEnabled: boolean
} & (
  | {
    status: 'connecting'
  }
  | {
    status: 'connected'
  }
)

export const defaultPeersState: Peer[] = []

export const peersAtom = atom<Peer[]>(defaultPeersState)

export const addPeerAtom = atom(
  null, // 第一个参数是 null 表示这是一个只写原子
  (get, set, sid: string) => { // 第三个参数是依赖注入的操作参数
    const peers = get(peersAtom)
    set(peersAtom, [
      ...peers,
      {
        sid,
        status: 'connecting',
        audioEnabled: false,
        videoEnabled: false,
      },
    ])
  },
)

export const deletePeerAtom = atom(
  null,
  (get, set, sid: string) => {
    const peers = get(peersAtom)
    set(peersAtom, peers.filter(peer => peer.sid !== sid))
  },
)

export const setPeerConnectedAtom = atom(
  null,
  (get, set, sid: string) => {
    const peers = get(peersAtom)
    set(peersAtom, peers.map((peer) => {
      if (peer.sid !== sid)
        return peer as any

      return { ...peer, status: 'connected' }
    }))
  },
)

export const setPeerStateAtom = atom(
  null,
  (get, set, { sid, name, audioEnabled, videoEnabled }: { sid: string, name: string, audioEnabled: boolean, videoEnabled: boolean }) => {
    const peers = get(peersAtom)
    set(peersAtom, peers.map((peer) => {
      if (peer.sid !== sid)
        return peer

      return { ...peer, name, audioEnabled, videoEnabled }
    }))
  },
)

export const peersActions = {
  addPeerAtom,
  deletePeerAtom,
  setPeerConnectedAtom,
  setPeerStateAtom,
}
