import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)
const MotionImage = motion(Image)

const SPRING = { type: 'spring', stiffness: 240, damping: 28, mass: 0.9 }

function Lightbox({ photo, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft')  onPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  const touchStart = useRef(0)

  return (
    <MotionBox
      position="fixed" inset={0} zIndex={900}
      bg="rgba(0,0,0,0.93)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      display="flex" alignItems="center" justifyContent="center"
      onClick={onClose}
      onTouchStart={(e) => { touchStart.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStart.current
        if (dx > 50) onPrev()
        if (dx < -50) onNext()
      }}
    >
      <MotionImage
        src={photo.src} alt={photo.alt}
        maxH="78vh" maxW="90vw"
        objectFit="contain"
        borderRadius="12px"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      
      {/* Navigation wings */}
      <Box position="absolute" left={50} top={0} bottom={0} w="15%"
           display={{ base: 'none', lg: 'flex' }} alignItems="center" justifyContent="center"
           onClick={(e) => { e.stopPropagation(); onPrev() }}
           cursor="pointer" opacity={0.4} _hover={{ opacity: 1 }} transition="opacity 0.2s">
        <Text fontFamily="heading" fontSize="3xl" color="white">‹</Text>
      </Box>
      <Box position="absolute" right={50} top={0} bottom={0} w="15%"
           display={{ base: 'none', lg: 'flex' }} alignItems="center" justifyContent="center"
           onClick={(e) => { e.stopPropagation(); onNext() }}
           cursor="pointer" opacity={0.4} _hover={{ opacity: 1 }} transition="opacity 0.2s">
        <Text fontFamily="heading" fontSize="3xl" color="white">›</Text>
      </Box>
      {/* Close */}
      <Box
        position="absolute" top={16} right={40}
        cursor="pointer" opacity={0.5} transition="opacity 0.2s"
        onClick={onClose}
      >
        <Text fontFamily="heading" fontSize="2xl" color="white" _hover={{ opacity: 1, color: '#ec8496' }}>✕</Text>
      </Box>
    </MotionBox>
  )
}

function GalleryCard({ photo, offset, abs, cardW, spacing, total, index, onFocus, onZoom }) {
  const isCenter = offset === 0
  const dir = offset === 0 ? 0 : offset > 0 ? 1 : -1

  return (
    <MotionBox
      position="absolute"
      top="50%"
      left="50%"
      h={{ base: '78%', md: '86%' }}
      style={{ width: cardW, transformStyle: 'preserve-3d' }}
      initial={false}
      animate={{
        x: `calc(-50% + ${offset * spacing}px)`,
        y: '-50%',
        rotateY: -dir * 32,
        scale: 1 - abs * 0.13,
        z: -abs * 160,
        opacity: abs > 2 ? 0 : 1,
      }}
      transition={SPRING}
      zIndex={20 - abs * 4}
      cursor={isCenter ? 'zoom-in' : 'pointer'}
      onClick={() => (isCenter ? onZoom() : onFocus())}
      pointerEvents={abs > 2 ? 'none' : 'auto'}
    >
      <Box
        position="relative"
        w="100%" h="100%"
        overflow="hidden"
        borderRadius={{ base: '18px', md: '10px' }}
        border="1px solid"
        borderColor={isCenter ? 'rgba(30,95,168,0.45)' : 'whiteAlpha.100'}
        boxShadow={isCenter
          ? '0 40px 90px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)'
          : '0 24px 60px rgba(0,0,0,0.45)'}
        transition="border-color 0.4s"
      >
        <Image
          src={photo.src} alt={photo.alt}
          w="100%" h="100%"
          objectFit="cover"
          objectPosition="center"
          draggable={false}
        />

        {/* Velo oscuro en tarjetas laterales */}
        <Box
          position="absolute" inset={0}
          bg="rgba(5,11,20,0.55)"
          opacity={isCenter ? 0 : 1}
          transition="opacity 0.45s ease"
          pointerEvents="none"
        />

        {/* Degradado inferior */}
        <Box
          position="absolute" inset={0}
          background="linear-gradient(to top, rgba(3,6,10,0.92) 0%, transparent 42%, rgba(3,6,10,0.2) 100%)"
          pointerEvents="none"
        />

        {/* Badge índice */}
        <Flex
          position="absolute" top={4} right={4}
          align="center"
          px={2.5} py={1}
          borderRadius="full"
          bg="rgba(5,11,20,0.55)"
          backdropFilter="blur(6px)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          opacity={isCenter ? 1 : 0}
          transition="opacity 0.4s ease"
        >
          <Text fontFamily="mono" fontSize="10px" color="white" letterSpacing="0.15em">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Text>
        </Flex>

        {/* Info de la foto central */}
        <Box
          position="absolute" bottom={0} left={0} right={0}
          p={{ base: 4, md: 6 }}
          opacity={isCenter ? 1 : 0}
          transform={isCenter ? 'translateY(0)' : 'translateY(12px)'}
          transition="opacity 0.45s ease 0.05s, transform 0.45s ease 0.05s"
        >
         {/* Logo */}
        <Text
          fontFamily="heading"
          fontSize="2xl"
          letterSpacing="wider"
          cursor="pointer"
          onClick={(e) => handleLink(e, '#hero')}
          color="white"
          _hover={{ color: 'brand.brown' }}
          transition="color 0.2s"
        >
          RM<Box as="span" color="brand.brown">_</Box>
        </Text>
        </Box>

        {/* Lupa al hover en la central */}
        {isCenter && (
          <Flex
            position="absolute" top={4} left={4}
            boxSize="34px"
            align="center" justify="center"
            borderRadius="full"
            bg="rgba(5,11,20,0.5)"
            backdropFilter="blur(6px)"
            border="1px solid"
            borderColor="whiteAlpha.200"
            opacity={0}
            transition="opacity 0.3s ease"
            sx={{ '[role=group]:hover &': { opacity: 1 } }}
          >
            <Text fontFamily="heading" fontSize="lg" color="white" lineHeight={1}>⤢</Text>
          </Flex>
        )}
      </Box>
    </MotionBox>
  )
}

export default function GallerySection() {
  const [current,   setCurrent]   = useState(0)
  const [lightbox,  setLightbox]  = useState(null)
  const [stageW,    setStageW]    = useState(0)
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const stageRef   = useRef(null)
  const total      = playerData.gallery.length

  // Medir el ancho del escenario para calcular tamaños en px
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setStageW(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  useEffect(() => {
    const handler = (e) => {
      if (lightbox !== null) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, next, prev])

  // offset circular para loop infinito
  const circularOffset = (i) => {
    let o = i - current
    if (o > total / 2)  o -= total
    if (o < -total / 2) o += total
    return o
  }

  const cardW   = Math.max(180, Math.min(stageW * 0.4, 440))
  const spacing = cardW * 0.62

  const onDragEnd = (_e, info) => {
    const threshold = 70
    if (info.offset.x < -threshold || info.velocity.x < -350) next()
    else if (info.offset.x > threshold || info.velocity.x > 350) prev()
  }

  return (
    <Box
      id="galeria"
      ref={sectionRef}
      bg="brand.dark"
      minH="100vh"
      py={{ base: 16, lg: 20 }}
      overflow="hidden"
      position="relative"
    >
      {/* glow ambiental */}
      <Box
        position="absolute" top="10%" left="50%" transform="translateX(-50%)"
        w="70vw" h="40vw" maxW="900px"
        background="radial-gradient(ellipse, rgba(30,95,168,0.14) 0%, transparent 70%)"
        pointerEvents="none"
      />

      <Box maxW="1400px" mx="auto" px={{ base: 5, lg: 10 }} position="relative">
        <Flex align="flex-end" justify="space-between" mb={{ base: 8, md: 10 }} ref={titleRef}>
          <Box>
            <Text fontFamily="mono" fontSize="10px" color="white"
                  textTransform="uppercase" letterSpacing="widest">
              Fotos
            </Text>
            <Text fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
                  color="brand.brown" lineHeight={1}>
              Galería
            </Text>
          </Box>
          <Text fontFamily="mono" fontSize="sm" color="brand.gray" letterSpacing="wider">
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Text>
        </Flex>
      </Box>

      {/* Escenario 3D */}
      <Box
        ref={stageRef}
        position="relative"
        h={{ base: '420px', md: '500px', lg: '560px' }}
        sx={{ perspective: '1800px' }}
        overflow="hidden"
      >
        {/* Sombra de piso bajo la central */}
        <Box
          position="absolute" bottom="8%" left="50%" transform="translateX(-50%)"
          w={`${cardW * 0.9}px`} h="40px"
          background="radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 70%)"
          filter="blur(10px)"
          pointerEvents="none"
          zIndex={0}
        />

        {/* Capa de arrastre */}
        <MotionBox
          position="absolute" inset={0}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={onDragEnd}
          style={{ transformStyle: 'preserve-3d' }}
          role="group"
        >
          {playerData.gallery.map((photo, i) => {
            const offset = circularOffset(i)
            const abs = Math.abs(offset)
            if (abs > 2) return null
            return (
              <GalleryCard
                key={photo.id}
                photo={photo}
                offset={offset}
                abs={abs}
                cardW={cardW}
                spacing={spacing}
                total={total}
                index={i}
                onFocus={() => setCurrent(i)}
                onZoom={() => setLightbox(i)}
              />
            )
          })}
        </MotionBox>

        {/* Fades laterales */}
        <Box position="absolute" left={0} top={0} bottom={0} w={{ base: '8%', lg: '14%' }}
             bgGradient="linear(to-r, brand.dark, transparent)" zIndex={30} pointerEvents="none" />
        <Box position="absolute" right={0} top={0} bottom={0} w={{ base: '8%', lg: '14%' }}
             bgGradient="linear(to-l, brand.dark, transparent)" zIndex={30} pointerEvents="none" />
      </Box>

      {/* Controles */}
      <Box maxW="1400px" mx="auto" px={{ base: 5, lg: 10 }} mt={{ base: 6, md: 10 }}>
        <Flex align="center" justify="center" gap={{ base: 4, md: 6 }}>
          {/* Flecha izq */}
          <Box
            as="button" onClick={prev} aria-label="Anterior"
            boxSize="44px" flexShrink={0}
            display="flex" alignItems="center" justifyContent="center"
            border="1px solid" borderColor="whiteAlpha.200" borderRadius="full"
            color="whiteAlpha.800" transition="all 0.25s"
            _hover={{ bg: 'brand.brown', borderColor: 'brand.brown', color: 'white' }}
            _active={{ transform: 'scale(0.92)' }}
          >
            <Text fontFamily="heading" fontSize="xl" lineHeight={1}>‹</Text>
          </Box>

          {/* Tira de miniaturas */}
          <Flex gap={2} align="center" overflowX="auto" py={1}
                sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
            {playerData.gallery.map((photo, i) => {
              const active = i === current
              return (
                <Box
                  key={photo.id}
                  as="button"
                  onClick={() => setCurrent(i)}
                  flexShrink={0}
                  w={active ? { base: '54px', md: '70px' } : { base: '40px', md: '48px' }}
                  h={{ base: '40px', md: '48px' }}
                  borderRadius="md"
                  overflow="hidden"
                  position="relative"
                  border="1px solid"
                  borderColor={active ? 'brand.brown' : 'whiteAlpha.200'}
                  boxShadow={active ? '0 0 0 2px rgba(30,95,168,0.4)' : 'none'}
                  opacity={active ? 1 : 0.5}
                  transition="all 0.3s ease"
                  _hover={{ opacity: 1 }}
                >
                  <Image src={photo.src} alt={photo.alt}
                         w="100%" h="100%" objectFit="cover" draggable={false} />
                </Box>
              )
            })}
          </Flex>

          {/* Flecha der */}
          <Box
            as="button" onClick={next} aria-label="Siguiente"
            boxSize="44px" flexShrink={0}
            display="flex" alignItems="center" justifyContent="center"
            border="1px solid" borderColor="whiteAlpha.200" borderRadius="full"
            color="whiteAlpha.800" transition="all 0.25s"
            _hover={{ bg: 'brand.brown', borderColor: 'brand.brown', color: 'white' }}
            _active={{ transform: 'scale(0.92)' }}
          >
            <Text fontFamily="heading" fontSize="xl" lineHeight={1}>›</Text>
          </Box>
        </Flex>
      </Box>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            photo={playerData.gallery[lightbox]}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox((l) => (l - 1 + total) % total)}
            onNext={() => setLightbox((l) => (l + 1) % total)}
          />
        )}
      </AnimatePresence>
    </Box>
  )
}
