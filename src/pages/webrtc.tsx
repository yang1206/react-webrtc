import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/webrtc')({
  component: LayoutComponent,
})
function LayoutComponent() {
  return (
    <div className="mockup-browser border  border-base-300">
      <div className="mockup-browser-toolbar">
        <div className="input border border-base-300">webrtc</div>
      </div>
      <div className="flex justify-center border-t border-base-300 px-4 py-16">
        <Outlet />
      </div>
    </div>
  )
}
