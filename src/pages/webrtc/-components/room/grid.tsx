import React from 'react'
import { useAtomValue } from 'jotai'
import clsx from 'clsx'
import { useElementSize } from 'usehooks-ts'
import LocalVideo from './local-video'
import PeerVideo from './peer-video'
import { peersAtom } from '@/atoms/peers'

function chunk<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  let i = 0

  while (i < array.length)
    chunks.push(array.slice(i, (i += chunkSize)))

  return chunks
}

export default function Grid() {
  const peers = useAtomValue(peersAtom)

  const [squareRef, { width, height }] = useElementSize()

  const videos = React.useMemo<React.ReactElement[]>(() => {
    return [
      <LocalVideo key="local" />,
      ...peers.map(peer => <PeerVideo key={peer.sid} peer={peer} />),
    ]
  }, [peers])

  const isPortrait = (width ?? 0) < (height ?? 0)
  const total = videos.length
  const x = Math.floor(Math.sqrt(total))
  const y = Math.ceil(total / x)
  const cols = isPortrait ? x : y
  const rows = isPortrait ? y : x

  const videosRows = useMemo(() => {
    return chunk(videos, isPortrait ? rows : cols)
  }, [cols, isPortrait, videos, rows])

  const { cellWidth, cellHeight } = useMemo(() => {
    const padding = window.innerWidth < 640 ? 4 : 8

    let cellWidth = (width ?? 0) / cols
    let cellHeight = (height ?? 0) / rows

    if (cellWidth / 4 > cellHeight / 3)
      cellWidth = 4 * (cellHeight / 3)

    if (cellHeight > cellWidth)
      cellHeight = cellWidth

    return {
      cellWidth: cellWidth - (padding * rows - padding),
      cellHeight: cellHeight - (padding * rows - padding),
    }
  }, [cols, height, rows, width])

  const columnClassName = clsx(
    'flex size-full min-h-[40vh] items-center justify-center',
    {
      'flex-col': !isPortrait,
      'flex-row': isPortrait,
    },
  )

  const rowClassName = clsx('flex', {
    'flex-row pb-2 sm:pb-4 last:pb-0 last:sm:pb-0': !isPortrait,
    'flex-col pr-2 sm:pr-4 last:pr-0 last:sm:pb-0': isPortrait,
  })

  const videoClassName = clsx('inline-block', {
    'pr-2 sm:pr-4 last:pr-0 last:sm:pr-0': !isPortrait,
    'pb-2 sm:pb-4 last:pb-0 last:sm:pb-0': isPortrait,
  })

  return (
    <div className="size-full  basis-full">
      <div ref={squareRef} className={columnClassName}>
        {videosRows.map((videosRow, index) => (
          <div key={`row-${index}`} className={rowClassName}>
            {videosRow.map((video, index) => (
              <div
                key={`video-${index}`}
                className={videoClassName}
                style={{ width: cellWidth, height: cellHeight }}
              >
                {video}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
