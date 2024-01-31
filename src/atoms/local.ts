import { assert } from 'chai'
import { atom } from 'jotai'

export const LocalStreamKey = 'local'

export type Local =
  | {
    status: 'requestingName'
  }
  | {
    status: 'requestingPermissions'
    name: string
  }
  | {
    status: 'requestingDevices'
    name: string
  }
  | {
    status: 'connecting'
    name: string
    audioEnabled: boolean
    videoEnabled: boolean
  }
  | {
    status: 'connected'
    name: string
    audioEnabled: boolean
    videoEnabled: boolean
  }

export const defaultLocalState: Local = {
  status: 'requestingName',
}

export const localAtom = atom<Local>(defaultLocalState)

// 设置音频和视频的使能状态
export const setAudioVideoEnabledAtom = atom(
  null,
  (get, set, { audioEnabled, videoEnabled }: { audioEnabled: boolean, videoEnabled: boolean }) => {
    const local = get(localAtom)
    assert(local.status === 'connecting' || local.status === 'connected')
    set(localAtom, { ...local, audioEnabled, videoEnabled })
  },
)

// 设置为连接中状态
export const setConnectingAtom = atom(
  null,
  (get, set, { audioEnabled, videoEnabled }: { audioEnabled: boolean, videoEnabled: boolean }) => {
    const local = get(localAtom)
    assert(local.status === 'requestingDevices')
    set(localAtom, { ...local, status: 'connecting', audioEnabled, videoEnabled })
  },
)

// 设置为请求设备状态
export const setRequestingDevicesAtom = atom(
  null,
  (get, set) => {
    const local = get(localAtom)
    assert(local.status === 'requestingPermissions')
    set(localAtom, { ...local, status: 'requestingDevices' })
  },
)

// 设置为请求权限状态
export const setRequestingPermissionsAtom = atom(
  null,
  (get, set, name: string) => {
    const local = get(localAtom)
    assert(local.status === 'requestingName')
    localStorage.setItem('name', name)
    set(localAtom, { ...local, name, status: 'requestingPermissions' })
  },
)

// 设置为已连接状态
export const setSocketAtom = atom(
  null,
  (get, set) => {
    const local = get(localAtom)
    assert(local.status === 'connecting' || local.status === 'connected')
    set(localAtom, { ...local, status: 'connected' })
  },
)
