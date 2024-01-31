import React from 'react'
import { useSetAtom } from 'jotai'
import Select from '../../../../components/ui/select'
import LocalPreview from './local-preview'
import PreForm from './pre-form'
import { mapGet, streamMap } from '@/pages/webrtc/-lib/mesh/maps'
import { LocalStreamKey, setConnectingAtom } from '@/atoms/local'
import {
  createLocalStream,
  getDevices,
  getVideoAudioEnabled,
  stopStream,
} from '@/pages/webrtc/-lib/mesh/stream'
import type {
  Devices,
} from '@/pages/webrtc/-lib/mesh/stream'

export default function RequestDevices() {
  const setLocal = useSetAtom(setConnectingAtom)
  const [devices, setDevices] = React.useState<Devices>()

  React.useEffect(() => {
    (async () => {
      setDevices(await getDevices())
    })()
  }, [])

  const joinRoom = React.useCallback(async () => {
    const stream = mapGet(streamMap, LocalStreamKey)
    const { audioEnabled, videoEnabled } = getVideoAudioEnabled(stream)
    setLocal({
      audioEnabled,
      videoEnabled,
    })
  }, [setLocal])

  const handleDeviceChange = React.useCallback(
    async (
      deviceId: string | undefined,
      cb: (devices: Devices) => Promise<MediaStream | null>,
    ) => {
      if (devices === undefined || deviceId === undefined)
        return

      const stream = mapGet(streamMap, LocalStreamKey)
      stopStream(stream)
      streamMap.set(LocalStreamKey, await cb(devices))
    },
    [devices],
  )

  const handleAudioChange = React.useCallback(
    (deviceId: string | undefined) => {
      handleDeviceChange(deviceId, async (devices: Devices) => {
        const selectedAudio
          = devices.audio.find((device) => {
            return device.id === deviceId
          }) ?? null
        const stream = await createLocalStream({
          audioDeviceId: selectedAudio?.id,
          videoDeviceId: devices.selectedVideo?.id,
        })
        setDevices({ ...devices, selectedAudio })
        return stream
      })
    },
    [handleDeviceChange],
  )

  const handleVideoChange = React.useCallback(
    (deviceId: string | undefined) => {
      handleDeviceChange(deviceId, async (devices: Devices) => {
        const selectedVideo
          = devices.video.find((device) => {
            return device.id === deviceId
          }) ?? null
        const stream = await createLocalStream({
          videoDeviceId: selectedVideo?.id,
          audioDeviceId: devices.selectedAudio?.id,
        })
        setDevices({ ...devices, selectedVideo })
        return stream
      })
    },
    [handleDeviceChange],
  )

  return (
    <PreForm
      body={(
        <>
          <LocalPreview />
          <Select
            id="audio-select"
            fallback="No microphones found"
            icon={<span className="i-heroicons-outline-microphone size-4" />}
            label="麦克风"
            selectedOption={
              devices?.selectedAudio
                ? {
                    value: devices.selectedAudio.id,
                    text: devices.selectedAudio.name,
                  }
                : undefined
            }
            options={
              devices?.audio.map((device) => {
                return {
                  value: device.id,
                  text: device.name,
                }
              }) ?? []
            }
            setValue={handleAudioChange}
          />
          <Select
            id="video-select"
            fallback="No cameras found"
            icon={<span className="i-heroicons-outline-video-camera size-4" />}
            label="摄像头"
            selectedOption={
              devices?.selectedVideo
                ? {
                    value: devices.selectedVideo.id,
                    text: devices.selectedVideo.name,
                  }
                : undefined
            }
            options={
              devices?.video.map((device) => {
                return {
                  value: device.id,
                  text: device.name,
                }
              }) ?? []
            }
            setValue={handleVideoChange}
          />
        </>
      )}
      handleSubmit={joinRoom}
      submitText="加入房间"
    />
  )
}
