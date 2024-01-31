import React from 'react'
import { useSetAtom } from 'jotai'
import PreForm from './pre-form'
import { setRequestingPermissionsAtom } from '@/atoms/local'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'

export default function RequestName() {
  const setLocal = useSetAtom(setRequestingPermissionsAtom)

  const [name, setName] = React.useState<string>(
    localStorage.getItem('name') ?? '',
  )

  const submitName = React.useCallback(() => {
    setLocal(name)
  }, [name, setLocal])

  return (
    <PreForm
      body={(
        <>
          <Label htmlFor="name" text="昵称" />
          <Input
            handleChange={setName}
            id="name"
            placeholder="请输入你的昵称"
            required
            value={name}
          />
        </>
      )}
      handleSubmit={submitName}
      submitText="下一步"
    />
  )
}
