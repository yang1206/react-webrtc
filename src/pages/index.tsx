import { createFileRoute, redirect } from '@tanstack/react-router'
import { fetchGithubRepo } from '@/api'

export const Route = createFileRoute('/')({
  component: Home,
  loader: () => {
    redirect({
      to: '/webrtc/videochat',
      throw: true,
    })
  },
})
function Home() {
  const { data, isLoading } = fetchGithubRepo({
    variables: { repo: 'yang1206/react-template' },
  })
  if (isLoading)
    return <div>Loading...</div>

  return (
    <>
      <a className="block" href={data?.html_url}>{data?.full_name}</a>
    </>
  )
}
