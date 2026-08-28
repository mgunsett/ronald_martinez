import { useEffect, useState } from 'react'

// `lg` de Chakra = 62em (992px): mismo corte que usan los breakpoints del Hero
const DESKTOP_QUERY = '(min-width: 62em)'

export default function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_QUERY).matches)

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY)
    const handler = (e) => setIsDesktop(e.matches)
    setIsDesktop(mql.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return isDesktop
}
