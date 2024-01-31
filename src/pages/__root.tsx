import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'sonner'
import Footer from '@/components/Footer'
import NProgress from '@/components/NProgress'

export const Route = createRootRoute({
  component: Layout,
})
function Layout() {
  return (
    <>
      <main className="px-4 py-10 text-center font-sans text-gray-700 dark:text-gray-200">
        <div className="flex justify-center gap-3">
          <Link to="/webrtc/media">
            <button className="link-hover link">摄像头</button>
          </Link>
          <Link to="/webrtc/msgchat">
            <button className="link-hover link">文字聊天室</button>
          </Link>
          <Link to="/webrtc/videochat">
            <button className="link-hover link">视频聊天室</button>
          </Link>
        </div>
        <Outlet />
        <Footer />
      </main>
      <Toaster />
      <NProgress />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}

export default Layout
