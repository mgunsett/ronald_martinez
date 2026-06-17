import { useRef, useEffect } from 'react'
import {
  Box, Grid, GridItem, Text, Flex, VStack, HStack, Image, Badge,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../../hooks/useScrubReveal'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

function BioCard() {
  const BIO = [
  { label: 'Edad', key: 'age' },
  { label: 'Altura', key: 'height' },
  { label: 'Peso', key: 'weight' },
  { label: 'Pie', key: 'foot' },
  { label: 'Nacimiento', key: 'birthDate' },
  { label: 'Lugar', key: 'birthPlace' },
]
  return (
          <Box>
            <Text
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.28em"
                textTransform="uppercase"
                color="whiteAlpha.600"
                mb={5}
              >
                Datos personales
              </Text>
            <Box
              bg="#050B14"
              border="1px solid"
              borderColor="whiteAlpha.100"
              p={{ base: 5, md: 6 }}
              h="90%"
              position="relative"
              sx={{
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '36px',
                  height: '3px',
                  bg: 'brand.brown',
                },
              }}
            >
              <VStack align="stretch" spacing={3}>
                {BIO.map((row) => (
                  <Flex
                    key={row.key}
                    justify="space-between"
                    align="center"
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.50"
                    pb={3}
                    transition="all 0.3s ease"
                    _hover={{ 
                      borderColor: 'brand.brown',
                      transform: 'translateY(-2px)',
                    }}
                  >
                    <Text
                      fontFamily="mono"
                      fontSize="11px"
                      letterSpacing="0.18em"
                      textTransform="uppercase"
                      color="whiteAlpha.600"
                    >
                      {row.label}
                    </Text>
                    <Text fontFamily="mono" fontSize="sm" fontWeight={500}>
                      {playerData[row.key]}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Box>

  )
}

function SeasonCards() {
  const cardRefs = useRef([])
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            duration: 0.7, delay: i * 0.1, ease: 'power3.out',
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Grid templateColumns="repeat(2, 1fr)" gap={3}>

      {playerData.seasonStats.map((s, i) => (
        <Box
          key={s.label}
          ref={(el) => (cardRefs.current[i] = el)}
          border="1px solid rgba(139,69,19,0.18)"
          p={5}
          position="relative"
          cursor="default"
          transition="border-color 0.3s, background 0.3s"
          _hover={{
            borderColor: 'rgba(139,69,19,0.45)',
            bg: 'rgba(139,69,19,0.05)',
          }}
          _before={{
            content: '""', position: 'absolute', bottom: 0, left: 0,
            w: '0', h: '2px', bg: 'brand.brown', transition: 'width 0.35s',
          }}
          sx={{ '&:hover::before': { width: '100%' } }}
        >
          <Text fontFamily="heading" fontSize="4xl" color="white" lineHeight={1} mb={1}>
            {s.value}
          </Text>
          <Text fontFamily="mono" fontSize="10px" color="brand.gray"
                textTransform="uppercase" letterSpacing="widest">
            {s.label}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}

function StatBars() {
  const barRefs  = useRef([])
  const numRefs  = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      playerData.stats.forEach((s, i) => {
        const bar = barRefs.current[i]
        const num = numRefs.current[i]
        if (!bar) return
        const obj = { val: 0 }
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: s.value / 100,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, start: 'top 88%', once: true },
            duration: 1.2,
            delay: i * 0.08,
          }
        )
        gsap.to(obj, {
          val: s.value,
          ease: 'power2.out',
          duration: 1.2,
          delay: i * 0.08,
          scrollTrigger: { trigger: bar, start: 'top 88%', once: true },
          onUpdate() { if (num) num.textContent = Math.round(obj.val) },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box
      border="1px solid rgba(139,69,19,0.18)"
      p={6}
      position="relative"
      _before={{
        content: '""', position: 'absolute', top: 0, left: 0,
        w: '32px', h: '2px', bg: 'brand.amber',
      }}
    >
      <Text fontFamily="mono" fontSize="9px" color="brand.amber"
            textTransform="uppercase" letterSpacing="widest" mb={5}>
        Habilidades
      </Text>
      <VStack spacing={4} align="stretch">
        {playerData.stats.map((s, i) => (
          <Box key={s.label}>
            <Flex justify="space-between" mb={1.5}>
              <Text fontFamily="mono" fontSize="11px" color="white"
                    textTransform="uppercase" letterSpacing="wider">
                {s.label}
              </Text>
              <Text ref={(el) => (numRefs.current[i] = el)}
                    fontFamily="heading" fontSize="sm" color="brand.brownLight">
                0
              </Text>
            </Flex>
            <Box h="3px" bg="rgba(255,255,255,0.08)" position="relative">
              <Box
                ref={(el) => (barRefs.current[i] = el)}
                position="absolute"
                top={0} left={0}
                w="100%" h="100%"
                bg="linear-gradient(90deg, #8B4513 0%, #C4783E 60%, #D4A84B 100%)"
                transformOrigin="left"
                transform="scaleX(0)"
              />
            </Box>
          </Box>
        ))}
      </VStack>
    </Box>
  )
}

function ClubTimeline() {
  const timelineRef = useRef(null)
  let isDragging = false
  let startX = 0
  let scrollLeft = 0

  const onDown = (e) => {
    isDragging = true
    startX = (e.pageX ?? e.touches?.[0]?.pageX) - timelineRef.current.offsetLeft
    scrollLeft = timelineRef.current.scrollLeft
    timelineRef.current.style.cursor = 'grabbing'
  }
  const onMove = (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = (e.pageX ?? e.touches?.[0]?.pageX) - timelineRef.current.offsetLeft
    timelineRef.current.scrollLeft = scrollLeft - (x - startX) * 1.1
  }
  const onUp = () => {
    isDragging = false
    if (timelineRef.current) timelineRef.current.style.cursor = 'grab'
  }

  return (
    <Box mt={10}>
      <Text fontFamily="mono" fontSize="9px" color="brand.brown"
            textTransform="uppercase" letterSpacing="widest" mb={5}>
        Trayectoria
      </Text>
      <Box
        ref={timelineRef}
        overflowX="auto"
        cursor="grab"
        pb={4}
        sx={{ '&::-webkit-scrollbar': { height: '2px' }, scrollSnapType: 'x mandatory',
              '&::-webkit-scrollbar-thumb': { bg: 'brand.brown' } }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <HStack spacing={0} align="stretch" w="max-content">
          {playerData.clubs.map((club, i) => (
            <HStack key={club.name} spacing={0} align="stretch">
              <Box
                w="220px"
                p={5}
                border="1px solid rgba(139,69,19,0.18)"
                scrollSnapAlign="start"
                flexShrink={0}
                transition="border-color 0.3s, transform 0.3s"
                _hover={{ borderColor: 'rgba(139,69,19,0.5)', transform: 'translateY(-3px)' }}
                position="relative"
                _before={{
                  content: '""', position: 'absolute', top: 0, left: 0,
                  w: '24px', h: '2px', bg: i === 0 ? 'brand.brown' : 'rgba(139,69,19,0.3)',
                }}
              >
                <VStack align="start" spacing={2}>
                  {club.logo ? (
                    <Image src={club.logo} alt={club.name} boxSize="36px" objectFit="contain" />
                  ) : (
                    <Box boxSize="36px" bg="rgba(139,69,19,0.2)"
                         border="1px solid rgba(139,69,19,0.3)"
                         display="flex" alignItems="center" justifyContent="center">
                      <Text fontFamily="heading" fontSize="10px" color="brand.brownLight">
                        {club.name.slice(0, 3).toUpperCase()}
                      </Text>
                    </Box>
                  )}
                  <Box>
                    <Text fontFamily="heading" fontSize="lg" color="white" lineHeight={1.1}>
                      {club.name}
                    </Text>
                    <Text fontFamily="mono" fontSize="10px" color="brand.gray"
                          letterSpacing="wider">{club.country}</Text>
                  </Box>
                  <Text fontFamily="mono" fontSize="10px" color="brand.brownLight"
                        letterSpacing="wider">{club.years}</Text>
                  {club.titles.length > 0 && (
                    <VStack align="start" spacing={1}>
                      {club.titles.map((t) => (
                        <HStack key={t} spacing={1}>
                          <Box w="4px" h="4px" bg="brand.amber" flexShrink={0} />
                          <Text fontFamily="mono" fontSize="9px" color="brand.amber"
                                letterSpacing="wider">{t}</Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}
                  {club.info && (
                    <Text fontFamily="mono" fontSize="9px" color="brand.gray"
                          lineHeight={1.5}>{club.info}</Text>
                  )}
                </VStack>
              </Box>
              {i < playerData.clubs.length - 1 && (
                <Flex align="center" px={3}>
                  <Box w="24px" h="1px" bg="rgba(139,69,19,0.3)" />
                  <Box w="4px" h="4px" bg="brand.brown" flexShrink={0} mx={1} />
                </Flex>
              )}
            </HStack>
          ))}
        </HStack>
      </Box>
    </Box>
  )
}

export default function StatsSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } },
    ],
    start: 'top 80%',
    end:   'top 40%',
  })

  return (
    <Box
      id="estadisticas"
      ref={sectionRef}
      bg="##050B14"
      pt={{ base: 16, lg: 20 }}
      pb={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
      borderTopLeftRadius={{ base: '14px', lg: '22px' }}
      borderTopRightRadius={{ base: '14px', lg: '22px' }}
      boxShadow="0 -24px 80px rgba(0,0,0,0.65)"
    >
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Flex align="flex-end" justify="space-between" mb={10}>
          <Box ref={titleRef}>
            <Text fontFamily="mono" fontSize="10px" color="white"
                  textTransform="uppercase" letterSpacing="widest" mb={2}>
              Temporada 2024 / 2025
            </Text>
            <Text fontFamily="heading" fontSize={{ base: '4xl', lg: '6xl' }}
                  color="brand.brown" lineHeight={1}>
              Estadísticas
            </Text>
          </Box>
        </Flex>

        {/* 3-column grid */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1.1fr 1fr' }}
          gap={5}
        >
          <GridItem><BioCard /></GridItem>
          <GridItem><SeasonCards /></GridItem>
          <GridItem><StatBars /></GridItem>
        </Grid>

        {/* Club timeline */}
        <ClubTimeline />
      </Box>
    </Box>
  )
}
