import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/webrtc/media')({
  component: Video,
})
function Video() {
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [mediaType, setMediaType] = useState<'video' | 'audio'>('video')
  const videoConstraints: MediaStreamConstraints = {
    video: true,
    audio: false,
  }
  const audioConstraints: MediaStreamConstraints = {
    audio: true,
    video: false,
  }
  function onOpenCamera() {
    navigator.mediaDevices.getUserMedia(mediaType === 'video' ? videoConstraints : audioConstraints).then((stream) => {
      mediaType === 'video' ? setVideoStream(stream) : setAudioStream(stream)
      mediaType === 'video' ? videoRef.current!.srcObject = stream : audioRef.current!.srcObject = stream
    }).catch((error) => {
      console.error(error)
    })
  }
  function onCloseCamera() {
    // 获取所有轨道
    const tracks = mediaType === 'video' ? videoStream?.getVideoTracks() : audioStream?.getAudioTracks()
    // 遍历并停止所有轨道
    tracks?.forEach((track) => {
      track.stop()
    })
  }
  return (
    <div>
      <video ref={videoRef} autoPlay controls playsInline />
      <audio ref={audioRef} autoPlay controls />

      <div className="flex justify-center gap-4">
        <button className="btn" onClick={onOpenCamera}>打开摄像头</button>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Video</span>
            <input type="radio" onChange={() => setMediaType('video')} name="radio-10" className="radio checked:bg-red-500" checked={mediaType === 'video'} />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Audio</span>
            <input type="radio" name="radio-10" onChange={() => setMediaType('audio')} className="radio checked:bg-blue-500" checked={mediaType === 'audio'} />
          </label>
        </div>
        <button className="btn" onClick={onCloseCamera}>停止媒体传输</button>
      </div>
    </div>
  )
}
