import { useState, useEffect } from 'react'

interface UseLoadingTextOptions {
  isLoading: boolean
  baseText?: string
  interval?: number
  maxDots?: number
}

const useLoadingText = ({
  isLoading,
  baseText = 'Loading',
  interval = 250,
  maxDots = 3,
}: UseLoadingTextOptions): string => {
  const [dotCount, setDotCount] = useState(0)

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    if (isLoading) {
      intervalId = setInterval(() => {
        setDotCount((prevCount) => (prevCount + 1) % (maxDots + 1))
      }, interval)
    } else {
      setDotCount(0)
    }

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isLoading, interval, maxDots])

  return isLoading ? `${baseText}${'.'.repeat(dotCount)}` : baseText
}

export default useLoadingText
