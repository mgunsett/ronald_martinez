import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import theme from './theme'
import App from './App'
import './styles/globals.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
  duration:       1.2,
  easing:         (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation:    'vertical',
  smoothWheel:    true,
  wheelMultiplier: 1,
})

window.__lenis = lenis
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
)
