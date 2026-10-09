import { useEffect, useRef } from 'react'
import { Box, Image, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { pad2 } from './galleryUtils'

/**
 * Lightbox de la galería (mismo estilo que el de la galería actual):
 * fondo oscuro, foto con bordes redondeados, alas laterales ‹ ›, cierre ✕,
 * swipe en mobile y teclado (Esc, ← →). Pausa Lenis mientras está abierto.
 */

const MotionBox = motion(Box)
const MotionImage = motion(Image)

export function Lightbox({ images, label, index, onClose, onPrev, onNext }) {
  const photo = images[index]
  const touchStart = useRef(0)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [])

  return (
    <MotionBox
      role="dialog"
      aria-modal="true"
      aria-label={`${label}: foto ampliada`}
      position="fixed"
      inset={0}
      zIndex={900}
      bg="rgba(0,0,0,0.93)"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="14px"
      px={4}
      onClick={onClose}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - touchStart.current
        if (dx > 50) onPrev()
        if (dx < -50) onNext()
      }}
    >
      <MotionImage
        key={index}
        src={photo.src}
        alt={photo.alt}
        maxH="76vh"
        maxW="min(90vw, 1100px)"
        objectFit="contain"
        borderRadius="12px"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        draggable={false}
      />
      <Text fontFamily="mono" fontSize="13px" letterSpacing="0.12em" textTransform="uppercase" color="whiteAlpha.600" textAlign="center">
        {label} · {photo.caption} · {pad2(index + 1)} / {pad2(images.length)}
      </Text>

      {[
        { side: 'left', fn: onPrev, icon: '‹', label: 'Foto anterior' },
        { side: 'right', fn: onNext, icon: '›', label: 'Foto siguiente' },
      ].map(({ side, fn, icon, label: aria }) => (
        <Box
          key={side}
          as="button"
          type="button"
          aria-label={aria}
          position="absolute"
          {...{ [side]: 0 }}
          top={0}
          bottom={0}
          w="15%"
          display={{ base: 'none', lg: 'flex' }}
          alignItems="center"
          justifyContent="center"
          onClick={(e) => {
            e.stopPropagation()
            fn()
          }}
          opacity={0.4}
          _hover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <Text fontFamily="heading" fontSize="5xl" color="white">
            {icon}
          </Text>
        </Box>
      ))}
      <Box as="button" type="button" aria-label="Cerrar" position="absolute" top={4} right={6} opacity={0.6} _hover={{ opacity: 1, color: '#ec8496' }} transition="opacity 0.2s" onClick={onClose}>
        <Text fontFamily="heading" fontSize="2xl">
          ✕
        </Text>
      </Box>
    </MotionBox>
  )
}

export default Lightbox
