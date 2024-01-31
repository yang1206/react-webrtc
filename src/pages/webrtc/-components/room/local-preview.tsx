import Video from './video'
import { LocalStreamKey } from '@/atoms/local'
import { mapGet, streamMap } from '@/pages/webrtc/-lib/mesh/maps'

export default function LocalPreview() {
  const stream = mapGet(streamMap, LocalStreamKey)

  return (
    <div className="h-48 w-full rounded-md bg-slate-900">
      {stream !== null && <Video local stream={stream} />}
    </div>
  )
}
