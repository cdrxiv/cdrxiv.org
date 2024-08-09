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
  const handleClick = useCallback((href: string) => {}, [])

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

export const useLinkWithWarning = (href: string) => {
  const router = useRouter()
  const { shouldWarn } = useContext(NavigationContext)

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
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
    [shouldWarn, href, router],
  )

  return { onClick: handleClick }
}
