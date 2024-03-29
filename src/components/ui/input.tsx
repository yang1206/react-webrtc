import clsx from 'clsx'
import React from 'react'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  borderless?: boolean
  handleChange: (value: string) => void
  id?: string
  placeholder?: string
  value: string
}

export default function Input(props: Props) {
  const {
    borderless = false,
    handleChange,
    id,
    placeholder,
    value,
    ...rest
  } = props

  const _handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e.target.value)
    },
    [handleChange],
  )

  const className = clsx(
    'input input-bordered input-primary w-full max-w-xs',
    { 'border-none': borderless },
  )

  return (
    <input
      className={className}
      id={id}
      onChange={_handleChange}
      placeholder={placeholder}
      type="text"
      value={value}
      {...rest}
    />
  )
}
