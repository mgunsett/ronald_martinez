import { useRef, useEffect } from 'react'
import { Box, Grid, Text, Flex, VStack, HStack, Link, Image } from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../../hooks/useScrubReveal'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function Stars({ count = 5 }) {
  return (
    <HStack spacing={1}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} as={FaStar} boxSize="14px"
          color={i < count ? 'brand.amber' : 'whiteAlpha.200'} />
      ))}
    </HStack>
  )
}

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
    <Box ref={cardRef} role="group" style={{ opacity: 0 }}>
      {/* Burbuja */}
      <Box
        as={Link}
        href={article.url}
        isExternal
        display="block"
        textDecoration="none"
        bg="#070F1A"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="lg"
        p={6}
        position="relative"
        transition="border-color 0.35s, transform 0.35s, background 0.35s"
        _after={{
          content: '""', position: 'absolute', bottom: '-9px', left: 8,
          w: 0, h: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid #070F1A',
          filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.06))',
        }}
        _groupHover={{
          borderColor: 'rgba(30,95,168,0.5)',
          transform: 'translateY(-4px)',
          bg: 'brand.dark',
          _before: { width: '40px' },
          textDecoration: 'none',
        }}
      >
        <VStack align="start" spacing={4}>
          <Flex justify="space-between" align="center" w="100%">
            <Stars count={article.rating ?? 5} />
            <Box
              px={2.5} py={1}
              bg="rgba(30,95,168,0.10)"
              border="1px solid rgba(30,95,168,0.28)"
              borderRadius="sm"
            >
              <Text fontFamily="mono" fontSize="9px" color="brand.brownLight"
                textTransform="uppercase" letterSpacing="0.18em">
                {article.media}
              </Text>
            </Box>
          </Flex>

          <Text fontFamily="body" fontSize={{base:'xs',md:"md"}} color="boneWarm" lineHeight={1.55}>
            “{article.title}”
          </Text>

          <Text fontFamily="mono" fontSize="11px" color="brand.brownLight"
            textTransform="uppercase" letterSpacing="0.18em"
            transition="color 0.25s"
            _groupHover={{ color: 'white' }}>
            Leer más →
          </Text>
        </VStack>
      </Box>

      {/* Autor */}
      <HStack spacing={3} mt={5} pl={2}>
        <Flex
          boxSize="42px"
          flexShrink={0}
          borderRadius="full"
          overflow="hidden"
          align="center"
          justify="center"
          bg="linear-gradient(135deg, #0B2A4A, #1E5FA8)"
          border="1px solid"
          borderColor="whiteAlpha.200"
          transition="border-color 0.35s, box-shadow 0.35s"
          _groupHover={{
            borderColor: 'brand.brown',
            boxShadow: '0 0 0 3px rgba(30,95,168,0.16)',
          }}
        >
          {article.logo ? (
            <Image
              src={article.logo}
              alt={`Logo de ${article.media}`}
              boxSize="100%"
              objectFit="cover"
              objectPosition="center"
              loading="lazy"
            />
          ) : (
            <Text fontFamily="heading" fontSize="lg" color="white" lineHeight={1}>
              {getInitials(article.media)}
            </Text>
          )}
        </Flex>
        <Box>
          <Text fontFamily="heading" fontSize="lg" color="white" lineHeight={1}>
            {article.media}
          </Text>
          <Text fontFamily="mono" fontSize="10px" color="brand.gray"
            textTransform="uppercase" letterSpacing="0.18em" mt={0.5}>
            {article.date}
          </Text>
        </Box>
      </HStack>
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
      as="section"
      id="prensa"
      ref={sectionRef}
      bg="#050B14"
      pb={{ base: 16, lg: 20 }}
      pt={0}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Flex align="flex-end" justify="space-between" mb={4} ref={titleRef}>
          <Box>
            <Text fontFamily="mono" fontSize={{base:'12px',md:"10px"}} color="white"
                  textTransform="uppercase" letterSpacing="widest">
              Testimonios
            </Text>
            <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
                  color="brand.brown" lineHeight={1}>
              Prensa
            </Text>
          </Box>
        </Flex>

        {/* Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={4}>
          {playerData.press.map((article, i) => (
            <PressCard key={article.title} article={article} index={i} />
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
