'use client'

import { useRouter } from 'next/navigation'
import React, { createContext, useCallback, useContext, useState } from 'react'

const NavigationContext = createContext<{
  shouldWarn: boolean
  setNavigationWarning: (value: boolean) => void
}>({ shouldWarn: false, setNavigationWarning: () => {} })

interface ProviderProps {
  children: React.ReactNode
}

export const NavigationProvider: React.FC<ProviderProps> = ({ children }) => {
  const [value, setValue] = useState(false)

  return (
    <NavigationContext.Provider
      value={{ shouldWarn: value, setNavigationWarning: setValue }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => {
  return useContext(NavigationContext)
}

export const useLinkWithWarning = () => {
  const router = useRouter()
  const { shouldWarn } = useContext(NavigationContext)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault()
      if (
        shouldWarn &&
        !window.confirm('You have unsaved changes. Do you still want to leave?')
      ) {
        return
      } else {
        router.push(href)
      }
    },
    [shouldWarn, router],
  )

  return { onClick: handleClick }
}
