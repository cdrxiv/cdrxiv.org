import React, { useState, useEffect } from 'react'
import { Box } from 'theme-ui'

const Loading = () => {
  const [dotCount, setDotCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prevCount) => (prevCount + 1) % 4)
    }, 250)

    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ fontSize: 3 }}>
      Loading
      {[...Array(3)].map((_, index) => (
        <span
          key={index}
          style={{
            opacity: index < dotCount ? 1 : 0,
            marginLeft: '2px',
          }}
        >
          .
        </span>
      ))}
    </Box>
  )
}

export default Loading
