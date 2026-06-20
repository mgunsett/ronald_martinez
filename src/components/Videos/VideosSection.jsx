import { useRef, useEffect, useState } from 'react'
import { Box, Flex, Text, AspectRatio } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiPlay, FiX, FiArrowUpRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { playerData } from '../../data/playerData'
import useScrubReveal from '../../hooks/useScrubReveal'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)

// Pulso del anillo del botón play
const pulse = keyframes`
  0%   { transform: scale(1);   opacity: 0.5; }
  70%  { transform: scale(1.7); opacity: 0; }
  100% { transform: scale(1.7); opacity: 0; }
`

// Barrido de brillo diagonal al hover
const sheen = keyframes`
  0%   { transform: translateX(-130%) skewX(-18deg); opacity: 0; }
  35%  { opacity: 0.5; }
  100% { transform: translateX(230%) skewX(-18deg); opacity: 0; }
`

// Anillo cónico que gira alrededor del play
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

// Parpadeo del punto REC
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
`

// Marco biselado (esquina superior derecha cortada)
const NOTCH = 'polygon(0 0, calc(100% - 46px) 0, 100% 46px, 100% 100%, 0 100%)'

export default function VideosSection() {
  const video = playerData.videos[0]

  const ghostRef = useRef(null)
  const wrapRef = useRef(null)
  const revealRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [open, setOpen] = useState(false)

  const sectionRef = useRef(null)
  const headerRef   = useRef(null)
  
  useScrubReveal(sectionRef, {
    elements: [{ ref: headerRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } }],
    start: 'top 80%',
    end: 'top 40%',
  })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
        }
      )
      if (!reduced && revealRef.current) {
        gsap.fromTo(
          revealRef.current,
          { y: 60, autoAlpha: 0, rotateX: 8, transformPerspective: 1200 },
          {
            y: 0,
            autoAlpha: 1,
            rotateX: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: wrapRef.current, start: 'top 82%', once: true },
          }
        )
      }
      if (!reduced && ghostRef.current) {
        gsap.to(ghostRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (!video) return null

  return (
    <Box
      as="section"
      id="videos"
      ref={sectionRef}
      position="relative"
      minH="100vh"
      bg="brand.dark"
      px={{ base: 5, md: 12, lg: 40 }}
      pt={{ base: 20, md: '10%' }}
      pb={{base: 12, md: '10%'}}
      overflow="hidden"
    >
      {/* glows ambientales */}
      <Box
        position="absolute"
        top={{base:'10%',md:"-5%"}}
        right="-12%"
        w="55vw"
        h="55vw"
        background="radial-gradient(ellipse, rgba(30,95,168,0.16) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* número fantasma gigante (dorsal) */}
      <Text
        ref={ghostRef}
        aria-hidden
        position="absolute"
        top={{ base: '10%', md: '12%' }}
        right={{ base: '-6%', md: '2%' }}
        fontFamily="heading"
        fontSize={{ base: '40vw', md: '30vw' }}
        lineHeight={0.8}
        color="transparent"
        pointerEvents="none"
        userSelect="none"
        zIndex={0}
        sx={{ WebkitTextStroke: '1.5px rgba(30,95,168,0.14)' }}
      >
        {playerData.number}
      </Text>
    
      <Box maxW="1240px" mx="auto" position="relative" zIndex={1}>

        {/* ── Header ── */}
        <Flex direction={'column'} align="flex-start" justify="flex-start" ref={headerRef} mb={{ base: 8, md: 10 }} ml={{base:0 , md:'-30px', lg:'-90px'}}>
           <Text fontFamily="mono" fontSize="10px" color="white"
              textTransform="uppercase" letterSpacing="widest">
              HIGHLIGHTS
            </Text>
            <Text fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
              color="brand.brown" lineHeight={1}>
              VIDEOS
            </Text>
        </Flex>

        {/* ── Player ── */}
        <Box ref={wrapRef} position="relative">
          {/* riel vertical (solo desktop grande) */}
          
          <Flex
            display={{ base: 'none', lg: 'flex' }}
            position="absolute"
            left="-52px"
            top="0"
            bottom="0"
            align="center"
            justify="center"
            zIndex={2}
          >
            <Text
              fontFamily="mono"
              fontSize="11px"
              letterSpacing="0.4em"
              textTransform="uppercase"
              color="whiteAlpha.500"
              sx={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {video.season} — {playerData.name} {playerData.fullName}
            </Text>
          </Flex>
          
          {/* wrapper con sombra que sigue el bisel */}
          <Box
            ref={revealRef}
            position="relative"
            cursor="pointer"
            role="group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => setOpen(true)}
            transition="transform 0.5s ease, filter 0.5s ease"
            transform={hovered ? 'translateY(-6px)' : 'translateY(0)'}
            sx={{
              filter: hovered
                ? 'drop-shadow(0 45px 80px rgba(0,0,0,0.6))'
                : 'drop-shadow(0 28px 60px rgba(0,0,0,0.5))',
            }}
          >
            
            <AspectRatio ratio={{ base: 4 / 5, md: 15 / 7 }}>
              <Box
                position="relative"
                overflow="hidden"
                bg="#03060A"
                boxShadow="inset 0 0 0 1px rgba(255,255,255,0.08)"
                sx={{ clipPath: NOTCH }}
              >
                {/* cover */}
                <Box
                  as="img"
                  src={video.cover}
                  alt={video.title}
                  position="absolute"
                  inset={0}
                  w="100%"
                  h="100%"
                  borderRadius={'10px'}
                  objectFit="cover"
                  objectPosition="center 38%"
                  opacity={hovered ? 0 : 1}
                  transition="opacity 0.5s ease, transform 0.7s ease"
                  transform={hovered ? 'scale(1.05)' : 'scale(1)'}
                />

                {/* preview YouTube muteado al hover */}
                {hovered && (
                  <Box
                    as="iframe"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${video.youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1&disablekb=1&fs=0&start=8`}
                    title={video.title}
                    allow="autoplay; encrypted-media"
                    position="absolute"
                    top="50%"
                    left="50%"
                    border="none"
                    pointerEvents="none"
                    sx={{
                      transform: 'translate(-50%, -50%)',
                      minWidth: '100%',
                      minHeight: '100%',
                      aspectRatio: '16 / 9',
                    }}
                  />
                )}

                {/* gradiente + viñeta */}
                <Box
                  position="absolute"
                  inset={0}
                  pointerEvents="none"
                  bg="linear-gradient(180deg, rgba(5,11,20,0.2) 0%, rgba(5,11,20,0.15) 40%, rgba(5,11,20,0.85) 100%)"
                />
                <Box
                  position="absolute"
                  inset={0}
                  pointerEvents="none"
                  background="radial-gradient(ellipse at center, transparent 42%, rgba(3,6,10,0.8) 125%)"
                  opacity={hovered ? 1 : 0.4}
                  transition="opacity 0.5s ease"
                />

                {/* scanlines sutiles tipo señal de video */}
                <Box
                  position="absolute"
                  inset={0}
                  pointerEvents="none"
                  zIndex={2}
                  opacity={hovered ? 0.5 : 0.25}
                  transition="opacity 0.5s ease"
                  sx={{
                    background:
                      'repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 2px, transparent 4px)',
                  }}
                />

                {/* letterbox al hover */}
                <Box position="absolute" top={0} left={0} right={0} h={hovered ? { base: '20px', md: '32px' } : '0px'} bg="rgba(3,6,10,0.95)" transition="height 0.5s cubic-bezier(0.22,1,0.36,1)" pointerEvents="none" zIndex={2} />
                <Box position="absolute" bottom={0} left={0} right={0} h={hovered ? { base: '20px', md: '32px' } : '0px'} bg="rgba(3,6,10,0.95)" transition="height 0.5s cubic-bezier(0.22,1,0.36,1)" pointerEvents="none" zIndex={2} />

                {/* badge REC + categoría */}
                <Flex
                  position="absolute"
                  top={{ base: 4, md: 6 }}
                  left={{ base: 4, md: 6 }}
                  align="center"
                  gap={2}
                  bg="rgba(5,11,20,0.55)"
                  backdropFilter="blur(6px)"
                  border="1px solid"
                  borderColor="rgba(30,95,168,0.55)"
                  px={3}
                  py="6px"
                  zIndex={4}
                >
                  <Box w="7px" h="7px" borderRadius="full" bg="#E5484D" animation={`${blink} 1.6s ease-in-out infinite`} />
                  <Text fontFamily="mono" fontSize="10px" letterSpacing="0.26em" textTransform="uppercase" color="white">
                    {video.category}
                  </Text>
                </Flex>

                {/* botón play central */}
                <Flex position="absolute" inset={0} align="center" justify="center" zIndex={5}>
                  <Box
                    position="relative"
                    w={{ base: '76px', md: '110px' }}
                    h={{ base: '76px', md: '110px' }}
                    transition="transform 0.45s cubic-bezier(0.22,1,0.36,1)"
                    transform={hovered ? 'scale(1.12)' : 'scale(1)'}
                  >
                    <Box position="absolute" inset={0} borderRadius="full" border="1px solid" borderColor="brand.brown" animation={`${pulse} 2.8s ease-out infinite`} />
                    <Box position="absolute" inset={0} borderRadius="full" border="1px solid" borderColor="brand.brown" animation={`${pulse} 2.8s ease-out infinite 1.4s`} />
                    <Box
                      position="absolute"
                      inset="-8px"
                      borderRadius="full"
                      opacity={hovered ? 1 : 0}
                      transition="opacity 0.4s ease"
                      sx={{
                        background:
                          'conic-gradient(from 0deg, transparent 0deg, rgba(77,147,214,0.95) 80deg, rgba(30,95,168,1) 150deg, transparent 220deg, transparent 360deg)',
                        WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                        mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                      }}
                      animation={`${spin} 4s linear infinite`}
                    />
                    <Box position="absolute" inset="-8px" borderRadius="full" border="1px solid" borderColor="whiteAlpha.200" />
                    <Flex
                      position="absolute"
                      inset={0}
                      align="center"
                      justify="center"
                      borderRadius="full"
                      border="1px solid"
                      borderColor="whiteAlpha.700"
                      bg="rgba(5,11,20,0.4)"
                      backdropFilter="blur(10px)"
                      transition="all 0.4s ease"
                      boxShadow={hovered ? '0 0 36px rgba(30,95,168,0.6)' : 'none'}
                      _groupHover={{ bg: 'rgba(30,95,168,0.5)', borderColor: 'white' }}
                    >
                      <Box as={FiPlay} fontSize={{ base: '26px', md: '38px' }} ml="4px" color="white" />
                    </Flex>
                  </Box>
                </Flex>

                {/* título al hover (sube desde abajo) */}
                <Box
                  position="absolute"
                  bottom={{ base: 5, md: 8 }}
                  left={{ base: 5, md: 8 }}
                  right={{ base: 5, md: 8 }}
                  zIndex={4}
                  opacity={hovered ? 1 : 0}
                  transform={hovered ? 'translateY(0)' : 'translateY(16px)'}
                  transition="opacity 0.45s ease 0.05s, transform 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s"
                  pointerEvents="none"
                >
                  <Text fontFamily="mono" fontSize={{base:'8px',md:"10px"}} letterSpacing="0.28em" textTransform="uppercase" color="brand.brownLight" mb={1}>
                    Jugadas destacadas
                  </Text>
                  <Text fontFamily="heading" fontSize={{ base: '3xl', md: '4xl' }} lineHeight={1} color="white" letterSpacing="0.01em" noOfLines={1}>
                    {video.season}
                  </Text>
                </Box>

                {/* sheen diagonal */}
                <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none" zIndex={2}>
                  {hovered && (
                    <Box position="absolute" top={0} bottom={0} left={0} w="40%" background="linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" animation={`${sheen} 1.1s ease-out`} />
                  )}
                </Box>
              </Box>
            </AspectRatio>
          </Box>
        </Box>

        {/* ── Línea de tiempo / footer broadcast ── */}
        <Flex
          mt={{ base: 6, md: 8 }}
          justifyContent={'flex-end'}
          align="center"
          gap={{ base: 4, md: 8 }}
        >
          <Flex
            as="button"
            onClick={() => setOpen(true)}
            align="center"
            gap={2}
            flexShrink={0}
            role="group"
            alignSelf={{ base: 'flex-end', md: 'auto' }}
            color="whiteAlpha.800"
            transition="color 0.3s ease"
            _hover={{ color: 'brand.brownLight' }}
          >
            <Text fontFamily="mono" fontSize="xs" letterSpacing="0.24em" textTransform="uppercase">
              Ver completo
            </Text>
            <Box as={FiArrowUpRight} fontSize="18px" transition="transform 0.3s ease" _groupHover={{ transform: 'translate(3px, -3px)' }} />
          </Flex>
        </Flex>
      </Box>

      {/* ── Modal fullscreen ── */}
      <AnimatePresence>
        {open && (
          <MotionBox
            position="fixed"
            inset={0}
            zIndex={2000}
            bg="rgba(3,6,10,0.95)"
            backdropFilter="blur(12px)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={{ base: 4, md: 12 }}
            onClick={() => setOpen(false)}
          >
            <Box
              as="button"
              position="absolute"
              top={{ base: 4, md: 6 }}
              right={{ base: 4, md: 6 }}
              color="white"
              onClick={() => setOpen(false)}
              transition="color 0.3s ease, transform 0.3s ease"
              _hover={{ color: 'brand.brownLight', transform: 'rotate(90deg)' }}
            >
              <Box as={FiX} fontSize="32px" />
            </Box>
            <MotionBox
              w="100%"
              maxW="1100px"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              boxShadow="0 40px 120px rgba(0,0,0,0.7)"
            >
              <AspectRatio ratio={16 / 9}>
                <Box
                  as="iframe"
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                  title={video.fullTitle}
                  border="none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  w="100%"
                  h="100%"
                />
              </AspectRatio>
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}
