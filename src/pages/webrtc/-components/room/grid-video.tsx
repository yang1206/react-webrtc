import clsx from 'clsx'
import Loading from './loading'
import Video from './video'

interface StatusProps {
  audioDisabled: boolean
  name?: string
  videoDisabled: boolean
}

function Status(props: StatusProps) {
  const { audioDisabled, name, videoDisabled } = props

  const className = clsx(
    'text-shadow absolute bottom-2 left-2 z-10 flex max-w-full items-center space-x-2 leading-none text-white dark:text-black sm:text-lg sm:leading-none',
    {
      'sm:bottom-4 sm:left-4': !videoDisabled,
    },
  )

  const audioIconClassName = clsx('absolute', {
    'text-red-500': audioDisabled,
  })

  return (
    <div className={className}>
      <span className={clsx('i-heroicons-outline-microphone size-4', audioIconClassName)} />
      <span className="truncate pl-5 pr-4">
        {name}
      </span>
    </div>
  )
}

interface Props {
  audioDisabled: boolean
  loading?: boolean
  local?: boolean
  name?: string
  stream?: MediaStream | null
  videoDisabled: boolean
}

export default function GridVideo(props: Props) {
  const {
    audioDisabled,
    loading = false,
    local = false,
    name,
    stream,
    videoDisabled,
  } = props

  const status = (
    <Status
      audioDisabled={audioDisabled}
      name={name}
      videoDisabled={videoDisabled}
    />
  )

  return (
    <div className="relative size-full">
      {loading
        ? (
          <div className="flex size-full items-center justify-center">
            <Loading />
          </div>
          )
        : (
          <>
            {!videoDisabled && status}
            {stream && (
              <Video
                local={local}
                videoDisabled={videoDisabled}
                stream={stream}
              />
            )}
            {videoDisabled && (
              <div className="flex size-full items-center justify-center">
                <div className="relative flex size-40 items-center justify-center rounded-md bg-indigo-500">
                  {status}
                </div>
              </div>
            )}
          </>
          )}
    </div>
  )
}
