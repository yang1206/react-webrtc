import clsx from 'clsx'

interface Props {
  local?: boolean
  stream: MediaStream
  videoDisabled?: boolean
}

export default function Video(props: Props) {
  const { local = false, stream, videoDisabled = false } = props

  const className = clsx('size-full rounded-md  object-cover', {
    'scale-x-[-1]': local,
    'hidden': videoDisabled,
  })

  return (
    <video
      ref={(video) => {
        if (video === null)
          return

        video.srcObject = stream
      }}
      tabIndex={-1}
      autoPlay
      muted={local}
      className={className}
    />
  )
}
