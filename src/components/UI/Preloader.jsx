import { useEffect, useRef } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { playerData } from '../../data/playerData'

// Recursos que conforman el Hero: sin ellos la primera pantalla se ve incompleta
const CRITICAL_ASSETS = [
  playerData.image,
  playerData.nationalityFlag,
  playerData.logoCurrentClub,
]

const MIN_DURATION = 900   // evita el parpadeo del loader cuando todo viene cacheado
const MAX_DURATION = 7000  // salida de emergencia si algún recurso nunca resuelve

function preloadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve()
    const img = new Image()
    img.onload  = resolve
    img.onerror = resolve
    img.src = src
    if (img.complete) resolve()
  })
}

export default function Preloader({ onReady, onExited }) {
  const rootRef  = useRef(null)
  const logoRef  = useRef(null)
  const barRef   = useRef(null)
  const fillRef  = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    let raf
    let shown   = 0      // progreso dibujado (interpolado)
    let target  = 0      // progreso real de los recursos
    let settled = false  // todo listo → la barra ya puede llegar a 100
    let minTimer

    const started = performance.now()

    gsap.to([logoRef.current, barRef.current], {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
    })

    const jobs = [
      ...CRITICAL_ASSETS.map(preloadImage),
      Promise.resolve(document.fonts?.ready),
    ]

    let loaded = 0
    const bump = () => {
      loaded += 1
      // se reserva el tramo final para el cierre: la barra nunca salta a 100 de golpe
      target = (loaded / jobs.length) * 0.92
    }
    jobs.forEach((job) => job.then(bump, bump))

    const settle = () => { settled = true; target = 1 }

    Promise.all(jobs.map((job) => job.catch(() => {}))).then(() => {
      minTimer = setTimeout(settle, Math.max(0, MIN_DURATION - (performance.now() - started)))
    })
    const bailout = setTimeout(settle, MAX_DURATION)

    const exit = () => {
      onReady?.()   // libera las animaciones de entrada del Navbar y el Hero
      gsap.timeline({ onComplete: () => onExited?.() })
        .to([logoRef.current, barRef.current], {
          y: -14, opacity: 0, duration: 0.45, stagger: 0.06, ease: 'power2.in',
        })
        .to(rootRef.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
    }

    const tick = () => {
      // la barra persigue al progreso real y acelera en el tramo de cierre
      shown += (target - shown) * (settled ? 0.16 : 0.08)
      if (settled && target - shown < 0.01) shown = 1

      if (fillRef.current)  fillRef.current.style.transform = `scaleX(${shown})`
      if (countRef.current) countRef.current.textContent = String(Math.round(shown * 100)).padStart(3, '0')

      if (shown >= 1) return exit()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(minTimer)
      clearTimeout(bailout)
    }
  }, [onReady, onExited])

  return (
    <Flex
      ref={rootRef}
      position="fixed"
      inset={0}
      zIndex={99999999}
      direction="column"
      align="center"
      justify="center"
      gap={{ base: 8, md: 10 }}
      bg="brand.dark"
    >
      {/* Glow de fondo — mismo lenguaje visual que el Hero */}
      <Box
        position="absolute"
        inset={0}
        pointerEvents="none"
        background="radial-gradient(ellipse 60% 50% at 50% 45%, rgba(30,95,168,0.16) 0%, transparent 70%)"
      />

      {/* Logo de iniciales — el mismo del Navbar y el Footer */}
      <Box ref={logoRef} position="relative" style={{ opacity: 0, transform: 'translateY(12px)' }}>
        <Text
          fontFamily="heading"
          fontSize={{ base: '58px', md: '76px' }}
          lineHeight={1}
          letterSpacing="0.08em"
          color="white"
          textAlign="center"
        >
          RM<Box as="span" color="brand.brown" ml="1px">_</Box>
        </Text>
        <Text
          fontFamily="mono"
          fontSize={{ base: '9px', md: '10px' }}
          letterSpacing="0.3em"
          textTransform="uppercase"
          color="whiteAlpha.400"
          textAlign="center"
          mt={2}
        >
          {playerData.name} {playerData.fullName}
        </Text>
      </Box>

      {/* Barra de carga */}
      <Box
        ref={barRef}
        position="relative"
        w={{ base: '62vw', md: '300px' }}
        maxW="320px"
        style={{ opacity: 0, transform: 'translateY(12px)' }}
      >
        <Box
          h="2px"
          w="full"
          borderRadius="full"
          bg="rgba(255,255,255,0.08)"
          overflow="hidden"
          boxShadow="0 0 26px rgba(30,95,168,0.35)"
        >
          <Box
            ref={fillRef}
            h="full"
            w="full"
            borderRadius="full"
            bgGradient="linear(to-r, brand.brownDark, brand.brown 45%, brand.brownLight)"
            style={{ transform: 'scaleX(0)', transformOrigin: 'left center' }}
          />
        </Box>

        <Flex mt={3} justify="space-between" align="center">
          <Text
            fontFamily="mono"
            fontSize="9px"
            letterSpacing="0.28em"
            textTransform="uppercase"
            color="whiteAlpha.400"
          >
            Cargando
          </Text>
          <Flex align="baseline" gap="2px">
            <Text
              ref={countRef}
              fontFamily="mono"
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.12em"
              color="brand.brownLight"
            >
              000
            </Text>
            <Text fontFamily="mono" fontSize="9px" color="brand.gray">%</Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}
