import { atom } from 'jotai'

export type Room =
  | {
    status: 'loading'
  }
  | {
    status: 'error'
    error: string
  }
  | {
    status: 'ready'
    name: string
  }

export const defaultRoomState: Room = {
  status: 'loading',
}

export const roomAtom = atom<Room>(defaultRoomState)

export const setErrorAtom = atom(
  null, // read function not needed for write-only atoms
  (get, set, _arg: void) => {
    set(roomAtom, { status: 'error', error: 'Invalid room' })
  },
)

export const setReadyAtom = atom(
  null, // read function not needed for write-only atoms
  (get, set, roomName: string) => {
    set(roomAtom, { status: 'ready', name: roomName })
  },
)
