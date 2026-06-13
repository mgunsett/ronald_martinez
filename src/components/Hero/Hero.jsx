import { useRef, useEffect, useCallback } from 'react'
import { Box, Text, Flex, VStack, HStack, Image } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MatchBox from './MatchBox'
import { playerData } from '../../data/playerData'
import useMatches from '../../hooks/useMatches'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)

function PlayerPanel() {
  return (
    <VStack align="start" spacing={2}>
      <HStack>
        <Text fontFamily="mono" fontSize="10px" color="brand.gray"
              textTransform="uppercase" letterSpacing="widest">
          Posición
        </Text>
        <Text fontFamily="mono" fontSize="10px" color="brand.brown"
              fontWeight="700" textTransform="uppercase" letterSpacing="widest">
          {playerData.positionShort}
        </Text>
      </HStack>
      <Text fontFamily="heading" fontSize={{ base: '4xl', lg: '5xl' }}
            color="white" lineHeight={1}>
        #{playerData.number}
      </Text>
      <Flex justifyContent='flex-start' alignItems='flex-end' gap={'5px'} spacing={1}>
        <Image src={playerData.nationalityFlag} w={{base:'20px', md:'15px'}} />
        <Text mb={'-5px'} fontFamily="mono" fontSize="md" color="brand.gray" letterSpacing="wider">
          {playerData.nationality}
        </Text>
      </Flex>
      <Flex justifyContent='flex-start' alignItems='flex-end' gap={'5px'} spacing={1}>
        <Image src={playerData.logoCurrentClub} w={{ base: '20px', md: '20px' }} h={'auto'} />
        <Text fontFamily="mono" fontSize="md" color="whiteAlpha.500" letterSpacing="wider">
          {playerData.currentClub}
        </Text>
      </Flex>
    </VStack>
  )
}

export default function Hero() {
  const outerRef     = useRef(null)
  const containerRef = useRef(null)
  const bgGlowRef    = useRef(null)
  const midLayerRef  = useRef(null)
  const photoRef     = useRef(null)
  const line1Ref     = useRef(null)
  const line2Ref     = useRef(null)
  const vignetteRef  = useRef(null)
  const { matches }  = useMatches()

  const handleMouseMove = useCallback((e) => {
    const xn = (e.clientX / window.innerWidth  - 0.5) * 2
    const yn = (e.clientY / window.innerHeight - 0.5) * 2
    gsap.to(bgGlowRef.current,   { x: xn * 6,  y: yn * 3,  duration: 1.8, ease: 'power2.out' })
    gsap.to(midLayerRef.current, { x: xn * 14, y: yn * 7,  duration: 1.3, ease: 'power2.out' })
    gsap.to(photoRef.current,    { x: xn * 28, y: yn * 14, duration: 1.0, ease: 'power2.out' })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo([line1Ref.current, line2Ref.current],
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay: 0.4 }
      )
      gsap.fromTo(photoRef.current,
        { clipPath: 'inset(100% 0 0 0)', opacity: 0 },
        { clipPath: 'inset(0% 0 0 0)', opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.6 }
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(vignetteRef.current,
        { opacity: 0.15 },
        {
          opacity: 0.75,
          ease: 'none',
          scrollTrigger: {
            trigger: outerRef.current,
            start: 'top top',
            end: '+=80vh',
            scrub: 1.2,
          },
        }
      )
    }, outerRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box ref={outerRef} h="200vh" position="relative" zIndex={1}>
      <Box
        ref={containerRef}
        position="sticky"
        top={0}
        h="100vh"
        overflow="hidden"
        bg="brand.dark"
      >
        {/* Warm brown glow — BG layer */}
        <Box
          ref={bgGlowRef}
          position="absolute"
          inset="-10%"
          zIndex={1}
          pointerEvents="none"
          background="radial-gradient(ellipse 70% 60% at 65% 50%, rgba(139,69,19,0.14) 0%, transparent 70%)"
        />

        {/* Ghost text — MID layer */}
        <Box
          ref={midLayerRef}
          position="absolute"
          inset={0}
          zIndex={2}
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          userSelect="none"
        >
          <Text
            fontFamily="heading"
            fontSize={{ base: '28vw', md: '22vw' }}
            color="transparent"
            lineHeight={0.85}
            style={{ WebkitTextStroke: '1px rgba(255,255,255,0.055)' }}
          >
            {playerData.name}
          </Text>
          <Text
            fontFamily="heading"
            fontSize={{ base: '28vw', md: '22vw' }}
            color="transparent"
            lineHeight={0.85}
            style={{ WebkitTextStroke: '1px rgba(139,69,19,0.12)' }}
          >
            {playerData.fullName}
          </Text>
        </Box>

        {/* Player photo */}
        <Box
          position="absolute"
          inset={0}
          zIndex={5}
          display="flex"
          alignItems="flex-end"
          justifyContent={{ base: 'center', lg: 'flex-end' }}
          pr={{ base: 0, lg: '5%' }}
          pointerEvents="none"
        >
          <Box
            ref={photoRef}
            h={{ base: '78vh', lg: '94vh' }}
            style={{ clipPath: 'inset(100% 0 0 0)', opacity: 0 }}
          >
            <Image
              src={playerData.image}
              alt={`${playerData.name} ${playerData.fullName}`}
              h="100%"
              maxW={{ base: '95vw', lg: '50vw' }}
              objectFit="contain"
              objectPosition="bottom center"
              draggable={false}
            />
          </Box>
        </Box>

        {/* Visible name text */}
        <Box
          position="absolute"
          inset={0}
          zIndex={10}
          pointerEvents="none"
          display="flex"
          flexDir="column"
          alignItems={{ base: 'center', lg: 'flex-start' }}
          justifyContent={{ base: 'flex-end', lg: 'center' }}
          pl={{ base: 0, lg: '6%' }}
          pb={{ base: '180px', lg: 0 }}
        >
          <Box overflow="hidden">
            <Text
              ref={line1Ref}
              fontFamily="heading"
              fontSize={{ base: '18vw', md: '16vw', lg: '13vw' }}
              color="white"
              lineHeight={0.9}
              style={{ opacity: 0 }}
            >
              {playerData.name}
            </Text>
          </Box>
          <Box overflow="hidden">
            <Text
              ref={line2Ref}
              fontFamily="heading"
              fontSize={{ base: '18vw', md: '16vw', lg: '13vw' }}
              color="brand.brown"
              lineHeight={0.9}
              style={{ opacity: 0 }}
            >
              {playerData.fullName}
            </Text>
          </Box>
        </Box>

        {/* Player info — bottom left */}
        <Box
          position="absolute"
          bottom={{ base: 'auto', lg: '14%' }}
          top={{ base: '18%', lg: 'auto' }}
          left={{ base: '5%', lg: '5%' }}
          zIndex={15}
        >
          <PlayerPanel />
        </Box>

        {/* MatchBox desktop */}
        <Box
          position="absolute"
          bottom="12%"
          right="3%"
          zIndex={15}
          display={{ base: 'none', lg: 'block' }}
        >
          <MatchBox last={matches.last} next={matches.next} variant="card" />
        </Box>

        {/* MatchBox mobile */}
        <Box
          position="absolute"
          bottom="40px"
          left={0}
          right={0}
          zIndex={15}
          display={{ base: 'block', lg: 'none' }}
        >
          <MatchBox last={matches.last} next={matches.next} variant="strip" />
        </Box>

        {/* Marquee bar */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          zIndex={18}
          h="38px"
          bg="brand.brown"
          overflow="hidden"
          display="flex"
          alignItems="center"
        >
          <Flex className="marquee-track" align="center" whiteSpace="nowrap" flexShrink={0}>
            {[...playerData.marqueeItems, ...playerData.marqueeItems].map((item, i) => (
              <Text
                key={i}
                fontFamily="mono"
                fontSize="10px"
                color="rgba(255,255,255,0.85)"
                textTransform="uppercase"
                letterSpacing="widest"
                fontWeight="600"
                px={4}
              >
                {item}
              </Text>
            ))}
          </Flex>
        </Box>

        {/* Scroll indicator */}
        <MotionBox
          position="absolute"
          bottom="50px"
          left="50%"
          style={{ translateX: '-50%' }}
          zIndex={16}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          display={{ base: 'none', lg: 'flex' }}
          flexDir="column"
          alignItems="center"
          gap={2}
        >
          <Box w="1px" h="28px" bg="rgba(255,255,255,0.25)" />
          <Text fontFamily="mono" fontSize="9px" color="rgba(255,255,255,0.3)"
                letterSpacing="widest" textTransform="uppercase">
            Scroll
          </Text>
        </MotionBox>

        {/* Vignette */}
        <Box
          ref={vignetteRef}
          position="absolute"
          inset={0}
          zIndex={20}
          background="radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)"
          pointerEvents="none"
          style={{ opacity: 0.15 }}
        />
      </Box>
    </Box>
  )
}
