import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/pages/webrtc/-components/home/hero'

export const Route = createFileRoute('/webrtc/videochat')({
  component: VideoChat,
})

function VideoChat() {
  return (
    <Hero />
  )
}
