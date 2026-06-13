import { useState, useEffect, useRef, useCallback } from 'react'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)
const MotionImage = motion(Image)

const SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }

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
        maxH="88vh" maxW="90vw"
        objectFit="contain"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      {/* Caption */}
      <Box
        position="absolute" bottom={6} left={0} right={0}
        textAlign="center" pointerEvents="none"
        onClick={(e) => e.stopPropagation()}
      >
        <Text fontFamily="mono" fontSize="xs" color="brand.brownLight"
              textTransform="uppercase" letterSpacing="widest">
          {photo.caption}
        </Text>
      </Box>
      {/* Navigation wings */}
      <Box position="absolute" left={0} top={0} bottom={0} w="15%"
           display={{ base: 'none', lg: 'flex' }} alignItems="center" justifyContent="center"
           onClick={(e) => { e.stopPropagation(); onPrev() }}
           cursor="pointer" opacity={0.4} _hover={{ opacity: 1 }} transition="opacity 0.2s">
        <Text fontFamily="heading" fontSize="3xl" color="white">‹</Text>
      </Box>
      <Box position="absolute" right={0} top={0} bottom={0} w="15%"
           display={{ base: 'none', lg: 'flex' }} alignItems="center" justifyContent="center"
           onClick={(e) => { e.stopPropagation(); onNext() }}
           cursor="pointer" opacity={0.4} _hover={{ opacity: 1 }} transition="opacity 0.2s">
        <Text fontFamily="heading" fontSize="3xl" color="white">›</Text>
      </Box>
      {/* Close */}
      <Box
        position="absolute" top={5} right={5}
        cursor="pointer" opacity={0.5} _hover={{ opacity: 1 }} transition="opacity 0.2s"
        onClick={onClose}
      >
        <Text fontFamily="heading" fontSize="2xl" color="white">✕</Text>
      </Box>
    </MotionBox>
  )
}

export default function GallerySection() {
  const [current,   setCurrent]   = useState(0)
  const [lightbox,  setLightbox]  = useState(null)
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const total      = playerData.gallery.length
  const touchStart = useRef(0)

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

  useEffect(() => {
    const handler = (e) => {
      if (lightbox !== null) return
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % total)
      if (e.key === 'ArrowLeft')  setCurrent((c) => (c - 1 + total) % total)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [total, lightbox])

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total])

  return (
    <Box
      id="galeria"
      ref={sectionRef}
      bg="brand.dark"
      minH="100vh"
      py={{ base: 16, lg: 20 }}
      overflow="hidden"
    >
      <Box maxW="1400px" mx="auto" px={{ base: 5, lg: 10 }}>
        <Flex align="flex-end" justify="space-between" mb={10} ref={titleRef}>
          <Box>
            <Text fontFamily="mono" fontSize="10px" color="brand.brown"
                  textTransform="uppercase" letterSpacing="widest" mb={2}>
              Fotos
            </Text>
            <Text fontFamily="heading" fontSize={{ base: '4xl', lg: '6xl' }}
                  color="white" lineHeight={1}>
              Galería
            </Text>
          </Box>
          <Text fontFamily="mono" fontSize="sm" color="brand.gray" letterSpacing="wider">
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </Text>
        </Flex>
      </Box>

      {/* Carousel stage */}
      <Box
        position="relative"
        h={{ base: '55vw', md: '45vw', lg: '38vw' }}
        maxH={{ base: '380px', lg: '520px' }}
        overflow="hidden"
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStart.current
          if (dx > 50) prev()
          if (dx < -50) next()
        }}
      >
        {/* Edge fade overlays */}
        <Box position="absolute" left={0} top={0} bottom={0} w={{ base: '6%', lg: '10%' }}
             bgGradient="linear(to-r, brand.dark, transparent)" zIndex={10} pointerEvents="none" />
        <Box position="absolute" right={0} top={0} bottom={0} w={{ base: '6%', lg: '10%' }}
             bgGradient="linear(to-l, brand.dark, transparent)" zIndex={10} pointerEvents="none" />

        {playerData.gallery.map((photo, i) => {
          const offset = i - current
          const visible = Math.abs(offset) <= 2
          if (!visible) return null

          return (
            <MotionBox
              key={photo.id}
              position="absolute"
              top={0}
              left="50%"
              h="100%"
              animate={{
                x: `calc(-50% + ${offset * 55}vw)`,
                scale: offset === 0 ? 1 : 0.82,
                opacity: offset === 0 ? 1 : 0.38,
              }}
              transition={SPRING}
              style={{ width: offset === 0 ? '48vw' : '40vw', maxWidth: offset === 0 ? '680px' : '540px' }}
              cursor={offset === 0 ? 'zoom-in' : 'pointer'}
              onClick={() => offset === 0 ? setLightbox(current) : setCurrent(i)}
              zIndex={offset === 0 ? 5 : 1}
            >
              <Box position="relative" w="100%" h="100%" overflow="hidden">
                <Image
                  src={photo.src} alt={photo.alt}
                  w="100%" h="100%"
                  objectFit="cover"
                  objectPosition="center"
                  draggable={false}
                />
                {/* Gradient overlay */}
                <Box
                  position="absolute" inset={0}
                  background="linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%, rgba(0,0,0,0.25) 100%)"
                />
                {offset === 0 && (
                  <Box position="absolute" bottom={4} left={4} right={4}>
                    <Text fontFamily="mono" fontSize="10px" color="brand.brownLight"
                          textTransform="uppercase" letterSpacing="widest" mb={0.5}>
                      {photo.category}
                    </Text>
                    <Text fontFamily="condensed" fontSize="sm" color="white" fontWeight="500">
                      {photo.caption}
                    </Text>
                  </Box>
                )}
              </Box>
            </MotionBox>
          )
        })}
      </Box>

      {/* Controls */}
      <Box maxW="1400px" mx="auto" px={{ base: 5, lg: 10 }} mt={8}>
        <Flex align="center" justify="space-between">
          {/* Arrows */}
          <Flex gap={3}>
            <Box
              as="button" onClick={prev}
              w="40px" h="40px" border="1px solid rgba(139,69,19,0.35)"
              display="flex" alignItems="center" justifyContent="center"
              cursor="pointer" transition="all 0.2s" borderRadius="50%"
              _hover={{ bg: 'brand.brown', borderColor: 'brand.brown' }}
              color="white"
            >
              <Text fontFamily="heading" fontSize="xl" lineHeight={1}>‹</Text>
            </Box>
            <Box
              as="button" onClick={next}
              w="40px" h="40px" border="1px solid rgba(139,69,19,0.35)"
              display="flex" alignItems="center" justifyContent="center"
              cursor="pointer" transition="all 0.2s" borderRadius="50%"
              _hover={{ bg: 'brand.brown', borderColor: 'brand.brown' }}
              color="white"
            >
              <Text fontFamily="heading" fontSize="xl" lineHeight={1}>›</Text>
            </Box>
          </Flex>

          {/* Dots */}
          <Flex gap={2} align="center">
            {playerData.gallery.map((_, i) => (
              <Box
                key={i}
                as="button"
                onClick={() => setCurrent(i)}
                h="3px"
                w={i === current ? '28px' : '12px'}
                bg={i === current ? 'brand.brown' : 'rgba(139,69,19,0.3)'}
                transition="all 0.3s"
                cursor="pointer"
                boxShadow={i === current ? '0 0 10px rgba(139,69,19,0.6)' : 'none'}
              />
            ))}
          </Flex>
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
