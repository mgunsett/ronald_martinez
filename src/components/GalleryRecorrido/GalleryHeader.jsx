import { useEffect, useRef } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Encabezado "Fotos / Galería" con su entrada GSAP, igual al de la galería
 * actual. `meta` es el texto chico de la derecha (contador o indicación).
 */
export function GalleryHeader({ meta, mb = { base: 8, md: 10 } }) {
  const titleRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true } },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box maxW="1400px" mx="auto" px={{ base: 5, lg: 10 }} position="relative" w="100%">
      <Flex align="flex-end" justify="space-between" mb={mb} ref={titleRef} gap={4}>
        <Box>
          <Text fontFamily="mono" fontSize="10px" color="white" textTransform="uppercase" letterSpacing="widest">
            Fotos
          </Text>
          <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }} color="brand.brown" lineHeight={1}>
            Galería
          </Text>
        </Box>
        <Text fontFamily="mono" fontSize="sm" color="brand.gray" letterSpacing="wider" whiteSpace="nowrap" aria-live="polite" sx={{ fontVariantNumeric: 'tabular-nums' }}>
          {meta}
        </Text>
      </Flex>
    </Box>
  )
}

// Glow ambiental azul de la sección
export function GalleryGlow() {
  return (
    <Box
      position="absolute"
      top={{ base: '16%', md: '10%' }}
      left="50%"
      transform="translateX(-50%)"
      w="70vw"
      h="40vw"
      maxW="900px"
      background="radial-gradient(ellipse, rgba(30,95,168,0.14) 0%, transparent 70%)"
      pointerEvents="none"
    />
  )
}

export default GalleryHeader
