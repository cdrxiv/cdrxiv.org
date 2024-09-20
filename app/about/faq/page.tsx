'use client'

import { useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import FAQContent from './faq.mdx'

const FAQ: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const params = useParams()

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    if (hash && containerRef.current) {
      const element = containerRef.current.querySelector(`#${hash}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [params])

  return (
    <div ref={containerRef}>
      <FAQContent />
    </div>
  )
}

export default FAQ
