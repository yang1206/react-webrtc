import React from 'react'
import Submit from '@/components/ui/submit'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  body: React.ReactElement
  handleSubmit: () => void
  submitText: string
}

export default function PreForm(props: Props) {
  const { body, handleSubmit, submitText } = props

  const _handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      handleSubmit()
    },
    [handleSubmit],
  )

  return (
    <form
      className="flex size-full items-center justify-center text-black"
      onSubmit={_handleSubmit}
    >
      <div className="flex w-80 flex-col rounded-lg bg-white">
        <div className="flex grow flex-col space-y-8 p-4">{body}</div>
        <div className="border-t border-slate-300 p-4">
          <Submit text={submitText} fill />
        </div>
      </div>
    </form>
  )
}
