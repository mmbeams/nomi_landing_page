import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', update)
    update()
    return () => window.removeEventListener('resize', update)
  }, [breakpoint])
  return isMobile
}
