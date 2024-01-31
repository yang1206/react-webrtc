import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Button from '@/components/ui/button'

export const Route = createFileRoute('/webrtc/goodbye')({
  component: GoodBye,
})

function GoodBye() {
  const { roomCode, roomName } = Route.useSearch<{ roomCode: string, roomName: string }>()
  const navigate = useNavigate()

  const handleRejoin = useCallback(() => {
    if (roomName !== undefined && roomCode !== undefined) {
      navigate({
        to: `/webrtc/$roomCode/$roomName`,
        params: { roomCode, roomName },
      })
    }
  }, [roomCode, roomName])

  const handleHome = () => {
    navigate({
      to: '/webrtc/videochat',
    })
  }
  return (
    <div className="p-4 py-32 text-center">
      <h1 className="mb-8 text-5xl">👋</h1>
      <div className="mb-16 text-3xl text-slate-300">你离开了房间</div>
      <div className="flex justify-center space-x-4">
        {(roomCode && roomName) !== undefined && (
          <Button color="slate" text="重新加入" onClick={handleRejoin} />
        )}
        <Button text="回到首页" onClick={handleHome} />
      </div>
    </div>
  )
}
