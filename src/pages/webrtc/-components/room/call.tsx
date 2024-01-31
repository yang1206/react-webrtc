import React from 'react'
import Controls from './controls'
import Grid from './grid'

export default function Call() {
  return (
    <div className="flex size-full flex-col p-2 pb-0 sm:p-4 sm:pb-0">
      <Grid />
      <Controls />
    </div>
  )
}
