import CreateRoom from './create-room'

export default function Hero() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">
            点对点视频通话
          </h1>
          <p className="py-6" />
          <CreateRoom />
        </div>
      </div>

    </div>
  )
}
