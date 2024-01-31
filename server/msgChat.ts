import type { Server as IOServer, Socket } from 'socket.io'
import consola from 'consola'

const messageHistory: {
  id: string
  text: string
}[] = []

function initSocket(socket: Socket) {
  consola.success(`用户${socket.id}已连接`)
  socket.emit('userId', socket.id)
  // 发送历史消息给新连接的用户
  socket.emit('messageHistory', messageHistory)
  socket
    .on('init', async (data) => {
      // 处理init事件，使用与该事件发送的数据
      consola.log('init event received', data)
    })
    .on('disconnect', () => {
      // 处理客户端断开连接的逻辑
      consola.error(`用户${socket.id}断开连接`)
      socket.broadcast.emit('leave', socket.id)
    })
    // 监听客户端发送的sendMessage事件
    .on('sendMessage', (message) => {
      consola.info(`Received message from ${socket.id}: ${message}`)

      // 存储消息到历史数组
      const messageData = {
        id: socket.id,
        text: message,
      }
      messageHistory.push(messageData)
      // 将消息广播给所有客户端，除了发送消息的那个客户端
      socket.broadcast.emit('receivedMessage', messageData)
    })
}

function socket(io: IOServer) {
  const msgNamespace = io.of('/msg')
  msgNamespace
    .on('connection', initSocket)
}

export default socket
