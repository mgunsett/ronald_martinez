import { useEffect, useState } from 'react'

export const pad2 = (n) => String(n).padStart(2, '0')

// Mobile = por debajo del breakpoint `md` de Chakra (48em / 768px)
const MOBILE_QUERY = '(max-width: 47.99em)'

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isMobile
}
