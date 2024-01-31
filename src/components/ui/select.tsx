import { Listbox } from '@headlessui/react'

import classNames from 'clsx'
import Label from './label'

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  id: string
  fallback: string
  icon?: React.ReactNode
  label: string
  options: {
    value: string
    text: string
  }[]
  selectedOption:
    | {
      value: string
      text: string
    }
    | undefined
  setValue: (value: string | undefined) => void
}

export default function Select(props: Props) {
  const { id, fallback, icon, label, options, selectedOption, setValue }
    = props

  const disabled = options.length === 0

  const buttonClassName = classNames(
    'relative flex flex-row items-center w-full px-8 py-2 text-left text-black border rounded-md border-slate-300 focus:outline focus:outline-yellow-500',
    {
      'text-slate-500': disabled,
    },
  )

  return (
    <>
      <Label htmlFor={id} text={label} />
      <Listbox
        value={selectedOption?.value ?? ''}
        onChange={setValue}
        disabled={disabled}
      >
        <div className="relative mt-1">
          <Listbox.Button
            id={id}
            className={buttonClassName}

          >
            <div className="absolute left-2">{icon}</div>
            <div className="grow truncate">
              {selectedOption?.text ?? fallback}
            </div>
            <span className="i-heroicons-outline-selector absolute right-2 size-6" />
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto overflow-y-scroll rounded-md border border-slate-300 bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm">
            {options.map((option, index) => (
              <Listbox.Option key={index} value={option.value}>
                {({ active, selected }) => {
                  const optionClassName = classNames(
                    'relative pl-8 p-2 cursor-pointer',
                    {
                      'bg-slate-200': active,
                    },
                  )

                  return (
                    <div className={optionClassName}>
                      {selected && (
                        <span
                          className="i-heroicons-outline-check absolute left-2 size-6"
                        />
                      )}
                      <div className="truncate">
                        {option.text}
                      </div>
                    </div>
                  )
                }}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </>
  )
}
