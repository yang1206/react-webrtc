import type { PropsWithChildren } from 'react'
import { createContext, useEffect } from 'react'

const DarkModeActionContext = createContext({})

export function DarkModeProvider(props: PropsWithChildren) {
  const { isDark, toggleDark } = useDark()
  return (
    <DarkModeActionContext.Provider value={{ isDark, toggleDark }}>
      {props.children}
      <ThemeObserver />
    </DarkModeActionContext.Provider>
  )
}

function ThemeObserver() {
  const { isDark } = useDark()
  useEffect(() => {
    if (isDark) {
      document.documentElement.dataset.theme = 'business'
      document.documentElement.classList.toggle('dark', true)
    }
    else {
      document.documentElement.dataset.theme = 'bumblebee'
      document.documentElement.classList.toggle('dark', false)
    }
  }, [isDark])

  return null
}
