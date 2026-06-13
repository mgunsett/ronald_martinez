import { useRef, useEffect } from 'react'
import { Box, Grid, Text, Flex, VStack, HStack, Link } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../../hooks/useScrubReveal'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

const mediaLogos = [
  'La Voz', 'TyC Sports', 'Olé', 'Clarín', 'Infobae', 'ESPN',
  'La Nación', 'TNT Sports', 'DirecTV', 'Canal 12',
]

function PressCard({ article, index }) {
  const cardRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <Box
      ref={cardRef}
      as={Link}
      href={article.url}
      isExternal
      display="block"
      textDecoration="none"
      border="1px solid rgba(139,69,19,0.18)"
      p={6}
      position="relative"
      transition="transform 0.3s, border-color 0.3s, background 0.3s"
      _hover={{
        transform: 'translateY(-4px)',
        borderColor: 'rgba(139,69,19,0.5)',
        bg: 'rgba(139,69,19,0.04)',
        textDecoration: 'none',
      }}
      style={{ opacity: 0 }}
      _before={{
        content: '""', position: 'absolute', top: 0, left: 0,
        w: '28px', h: '2px', bg: 'brand.brown',
      }}
      _after={{
        content: '""', position: 'absolute', bottom: 0, left: 0,
        w: '0', h: '2px',
        background: 'linear-gradient(90deg, #8B4513, #D4A84B)',
        transition: 'width 0.4s',
      }}
      sx={{ '&:hover::after': { width: '100%' } }}
    >
      <VStack align="start" spacing={4} h="100%">
        <Flex justify="space-between" align="center" w="100%">
          <Box
            px={3} py={1}
            bg="rgba(139,69,19,0.12)"
            border="1px solid rgba(139,69,19,0.3)"
          >
            <Text fontFamily="mono" fontSize="9px" color="brand.brownLight"
                  textTransform="uppercase" letterSpacing="widest">
              {article.media}
            </Text>
          </Box>
          <Text
            fontFamily="mono" fontSize="xl" color="brand.gray"
            transition="transform 0.2s, color 0.2s"
            sx={{ 'a:hover &': { transform: 'translate(3px, -3px)', color: 'brand.brownLight' } }}
          >
            ↗
          </Text>
        </Flex>

        <Text fontFamily="heading" fontSize="xl" color="white" lineHeight={1.2} flex={1}>
          {article.title}
        </Text>

        <Text fontFamily="mono" fontSize="10px" color="brand.gray"
              letterSpacing="wider" textTransform="uppercase">
          {article.date}
        </Text>
      </VStack>
    </Box>
  )
}

export default function PressSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [{ ref: titleRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } }],
    start: 'top 80%',
    end:   'top 40%',
  })

  return (
    <Box
      id="prensa"
      ref={sectionRef}
      bg="#100A06"
      py={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Flex align="flex-end" justify="space-between" mb={10} ref={titleRef}>
          <Box>
            <Text fontFamily="mono" fontSize="10px" color="brand.brown"
                  textTransform="uppercase" letterSpacing="widest" mb={2}>
              Medios
            </Text>
            <Text fontFamily="heading" fontSize={{ base: '4xl', lg: '6xl' }}
                  color="white" lineHeight={1}>
              Prensa
            </Text>
          </Box>
        </Flex>

        {/* Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={5} mb={14}>
          {playerData.press.map((article, i) => (
            <PressCard key={article.title} article={article} index={i} />
          ))}
        </Grid>

        {/* Media logos marquee */}
        <Box
          borderTop="1px solid rgba(139,69,19,0.12)"
          pt={8}
          overflow="hidden"
        >
          <Text fontFamily="mono" fontSize="9px" color="brand.gray"
                textTransform="uppercase" letterSpacing="widest" mb={5} textAlign="center">
            Presencia en medios
          </Text>
          <Box overflow="hidden">
            <Flex className="marquee-track" align="center" whiteSpace="nowrap" flexShrink={0}>
              {[...mediaLogos, ...mediaLogos].map((name, i) => (
                <HStack key={i} spacing={3} px={6}>
                  <Box w="4px" h="4px" bg="rgba(139,69,19,0.5)" flexShrink={0} />
                  <Text
                    fontFamily="heading"
                    fontSize="lg"
                    color="rgba(255,255,255,0.2)"
                    letterSpacing="widest"
                    textTransform="uppercase"
                  >
                    {name}
                  </Text>
                </HStack>
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
