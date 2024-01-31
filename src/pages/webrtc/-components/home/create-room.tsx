import React from 'react'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import Button from '../../../../components/ui/button'
import { cleanSlug, slugify } from '@/pages/webrtc/-lib/rooms/slug'
import { createRoomCode, randomRoomName } from '@/pages/webrtc/-lib/rooms/room-encoding'

export default function CreateRoom() {
  const navigate = useNavigate()
  const [roomName, setRoomName] = useState('')

  const submit = useCallback(async (event) => {
    event.preventDefault()
    if (roomName === '') {
      toast.error('请输入房间名')
      return
    }
    let cleanRoomName = cleanSlug(roomName)
    cleanRoomName = cleanRoomName === '' ? randomRoomName() : cleanRoomName
    const roomCode = createRoomCode(cleanRoomName)

    navigate({
      to: `/webrtc/$roomCode/$roomName`,
      params: {
        roomCode,
        roomName: cleanRoomName,
      },
      search: {
        created: true,
      },
      mask: {
        to: '/webrtc/$roomCode/$roomName',
        params: {
          roomCode,
          roomName: cleanRoomName,
        },
        unmaskOnReload: true,
      },
    })
  }, [roomName, navigate])

  const handleChange = useCallback((value: string) => {
    if (value === '') {
      toast.error('请输入房间名')
      return
    }
    setRoomName(slugify(value))
  }, [])

  return (
    <form
      className="mb-24 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
      onSubmit={event => submit(event)}
    >
      <div className="sm:w-56">
        <input type="text" value={roomName} onChange={e => handleChange(e.target.value)} placeholder="输入房间名" className="input input-bordered w-full max-w-xs" />
      </div>
      <Button
        icon={<span className=" i-heroicons-outline-plus-circle text-[20px]" />}
        onClick={submit}
        text="创建房间"
      />
    </form>
  )
}
