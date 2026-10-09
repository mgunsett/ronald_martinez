import { useEffect, useState } from 'react'

export const pad2 = (n) => String(n).padStart(2, '0')

// Precarga una foto grande (una sola vez por src), así el lightbox la
// muestra sin espera al abrir o al pasar a la siguiente.
const preloaded = new Set()
export function preload(src) {
  if (!src || preloaded.has(src)) return
  preloaded.add(src)
  const img = new window.Image()
  img.decoding = 'async'
  img.src = src
}

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
