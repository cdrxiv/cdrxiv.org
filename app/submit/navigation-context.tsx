'use client'

import React, { createContext, useContext, useState } from 'react'

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
