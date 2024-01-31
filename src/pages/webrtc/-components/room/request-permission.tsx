import React from 'react'
import { useSetAtom } from 'jotai'
import PreForm from './pre-form'
import { LocalStreamKey, setRequestingDevicesAtom } from '@/atoms/local'
import { streamMap } from '@/pages/webrtc/-lib/mesh/maps'
import { createLocalStream } from '@/pages/webrtc/-lib/mesh/stream'

export default function RequestPermission() {
  const setRequestingDevices = useSetAtom(setRequestingDevicesAtom)

  const requestPermissions = React.useCallback(async () => {
    const stream = await createLocalStream()
    streamMap.set(LocalStreamKey, stream)
    setRequestingDevices()
  }, [setRequestingDevices])

  return (
    <PreForm
      body={(
        <>
          <div>
            为了能共享您的摄像头和麦克风，我们会请求访问这些设备。
          </div>
          <div className="text-slate-500">
            您仍然可以随时停止共享设备。
          </div>
        </>
      )}
      handleSubmit={requestPermissions}
      submitText="请求权限"
    />
  )
}
