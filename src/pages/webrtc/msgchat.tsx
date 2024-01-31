import { createFileRoute } from '@tanstack/react-router'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import consola from 'consola'
import { toast } from 'sonner'

export const Route = createFileRoute('/webrtc/msgchat')({
  component: Websocket,
})

const ChatMessage = memo(({ id, text }: { id: string, text: string }) => (
  <li>
    {id}
    ：
    {text}
  </li>
))

function Websocket() {
  const [userId, setUserId] = useState('')
  const [message, setMessage] = useState('') // 维护消息状态
  const [messages, setMessages] = useState<{
    id: string
    text: string
  }[]>([]) // 维护所有消息的状态
  const socketRef = useRef<Socket | null>(null) // 使用ref来存储socket的实例, 避免在每次render时重新创建
  useEffect(() => {
    // 连接到WebSocket服务器
    socketRef.current = io('/msg', {
      path: '/socket/webrtc',
    })
    socketRef.current.on('messageHistory', (history) => {
      setMessages(history)
    })
    socketRef.current.on('connect', () => {
      consola.success('Connected to WebSocket server!')
    })
    socketRef.current.on('userId', (id) => {
      setUserId(id)
    })
    socketRef.current.on('leave', (id) => {
      toast.error(`用户${id}断开连接`)
    })

    // 监听从服务器接收的消息
    socketRef.current.on('receivedMessage', (incomingMessage) => {
      setMessages(prevMessages => [...prevMessages, incomingMessage])
    })

    return () => {
      socketRef.current?.disconnect()
    }
  }, [])

  // 发送消息到服务器
  const handleSendMessage = useCallback(() => {
    if (message.trim()) {
      socketRef.current?.emit('sendMessage', message)
      setMessages(prevMessages => [...prevMessages, {
        id: userId,
        text: message,
      }]) // 将发送的消息添加到消息列表
      setMessage('') // 清空输入框
    }
  }, [message, userId, socketRef])

  const handleMessageChange = useCallback((event) => {
    setMessage(event.target.value)
  }, [])

  return (
    <div>

      <h1>Websocket</h1>
      {userId && (
        <div className="alert alert-info">
          <span>
            当前用户为
            {userId}
          </span>
        </div>
      )}
      <div>
        <input
          value={message}
          onChange={handleMessageChange}
          onKeyUp={(e) => {
            if (e.key === 'Enter')
              handleSendMessage()
          }}
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
        <button onClick={handleSendMessage} className="btn">发送</button>
        <div>
          {messages.map((msg, index) => (
            <ChatMessage key={index} id={msg.id} text={msg.text} />
          ))}
        </div>
      </div>
    </div>
  )
}
