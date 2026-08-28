import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Preloader from '../components/UI/Preloader'

// Fuera del provider (ej. /admin) no hay loader: todo se considera listo
const LoadingContext = createContext({ isReady: true })

export const useLoading = () => useContext(LoadingContext)

export function LoadingProvider({ children }) {
  const [isReady, setIsReady]       = useState(false) // recursos del Hero listos → animaciones de entrada
  const [showLoader, setShowLoader] = useState(true)  // overlay montado

  // el scroll queda bloqueado mientras el loader está en pantalla
  useEffect(() => {
    if (!showLoader) {
      window.__lenis?.start()
      document.body.style.overflow = ''
      return
    }

    window.__lenis?.stop()
    document.body.style.overflow = 'hidden'
    return () => {
      window.__lenis?.start()
      document.body.style.overflow = ''
    }
  }, [showLoader])

  const handleReady  = useCallback(() => setIsReady(true), [])
  const handleExited = useCallback(() => setShowLoader(false), [])

  return (
    <LoadingContext.Provider value={{ isReady }}>
      {showLoader && <Preloader onReady={handleReady} onExited={handleExited} />}
      {children}
    </LoadingContext.Provider>
  )
}

export default LoadingContext
