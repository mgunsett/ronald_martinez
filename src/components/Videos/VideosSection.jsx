import { useRef, useEffect } from 'react'
import { Box, Text, Flex, VStack, Image } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)

function ComingSoon() {
  return (
    <Box
      position="relative"
      w="100%"
      maxW="1000px"
      mx="auto"
      sx={{ paddingTop: '56.25%' }}
      overflow="hidden"
      border="1px solid rgba(139,69,19,0.2)"
    >
      <Box
        position="absolute"
        inset={0}
        bg="rgba(12,7,5,0.9)"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        gap={4}
      >
        <Image
          src={playerData.image}
          alt={playerData.name}
          position="absolute"
          inset={0}
          w="100%"
          h="100%"
          objectFit="cover"
          objectPosition="top center"
          opacity={0.18}
        />
        <MotionBox
          position="relative"
          zIndex={1}
          textAlign="center"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Box
            w="72px"
            h="72px"
            mx="auto"
            mb={4}
            border="2px solid rgba(139,69,19,0.5)"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              w={0}
              h={0}
              ml="4px"
              borderTop="12px solid transparent"
              borderBottom="12px solid transparent"
              borderLeft="20px solid"
              borderLeftColor="brand.brown"
            />
          </Box>
          <Text fontFamily="heading" fontSize="2xl" color="white" letterSpacing="wider">
            Highlights
          </Text>
          <Text fontFamily="mono" fontSize="xs" color="brand.brownLight"
                letterSpacing="widest" textTransform="uppercase" mt={1}>
            Próximamente
          </Text>
        </MotionBox>
      </Box>
    </Box>
  )
}

export default function VideosSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const blockRef   = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', once: true },
        }
      )
      gsap.fromTo(blockRef.current,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)', opacity: 1,
          duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: blockRef.current, start: 'top 75%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box
      id="videos"
      ref={sectionRef}
      bg="brand.dark"
      minH="100vh"
      display="flex"
      flexDir="column"
      justifyContent="center"
      py={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto" w="100%">
        <Flex
          align={{ base: 'flex-start', lg: 'flex-end' }}
          justify="space-between"
          flexDir={{ base: 'column', lg: 'row' }}
          mb={8}
          gap={4}
          ref={titleRef}
        >
          <Box>
            <Text fontFamily="mono" fontSize="10px" color="brand.brown"
                  textTransform="uppercase" letterSpacing="widest" mb={2}>
              Highlights
            </Text>
            <Text fontFamily="heading" fontSize={{ base: '4xl', lg: '6xl' }}
                  color="white" lineHeight={1}>
              Videos
            </Text>
          </Box>
          <VStack align={{ base: 'start', lg: 'end' }} spacing={1}>
            <Text fontFamily="mono" fontSize="sm" color="brand.gray" letterSpacing="wider">
              {playerData.name} {playerData.fullName}
            </Text>
            <Text fontFamily="mono" fontSize="xs" color="brand.brownLight"
                  letterSpacing="wider" textTransform="uppercase">
              {playerData.currentClub} — {playerData.positionShort}
            </Text>
          </VStack>
        </Flex>

        <Box ref={blockRef} style={{ opacity: 0 }}>
          <ComingSoon />
        </Box>
      </Box>
    </Box>
  )
}
