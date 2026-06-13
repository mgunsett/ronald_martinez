import { useRef } from 'react'
import { Box, Grid, Text, Flex, VStack, HStack, Link, Icon } from '@chakra-ui/react'
import useScrubReveal from '../../hooks/useScrubReveal'
import { playerData } from '../../data/playerData'

function SocialCard({ item, index }) {
  const IconComponent = item.icon
  return (
    <Box
      as={Link}
      href={item.url}
      isExternal
      display="block"
      textDecoration="none"
      border="1px solid rgba(139,69,19,0.18)"
      p={{ base: 6, lg: 8 }}
      position="relative"
      overflow="hidden"
      transition="border-color 0.3s, background 0.3s"
      _hover={{ borderColor: 'rgba(139,69,19,0.5)', bg: item.hoverColor, textDecoration: 'none' }}
      _before={{
        content: '""', position: 'absolute', top: 0, left: 0,
        w: '32px', h: '2px', bg: 'brand.brown',
      }}
    >
      {/* Watermark icon */}
      <Box
        position="absolute"
        right={{ base: '-10px', lg: '-20px' }}
        bottom={{ base: '-20px', lg: '-30px' }}
        opacity={0.05}
        pointerEvents="none"
      >
        <Icon as={IconComponent} fontSize={{ base: '120px', lg: '160px' }} color="brand.brown" />
      </Box>

      <VStack align="start" spacing={3} position="relative" zIndex={1}>
        <Icon as={IconComponent} fontSize="28px" color="brand.brownLight" />
        <Box>
          <Text fontFamily="heading" fontSize="2xl" color="white" lineHeight={1}>
            {item.label}
          </Text>
          <Text fontFamily="mono" fontSize="sm" color="brand.brownLight" letterSpacing="wider" mt={1}>
            {item.handle}
          </Text>
        </Box>
        <HStack spacing={2} mt={2}>
          <Text fontFamily="mono" fontSize="10px" color="brand.gray"
                textTransform="uppercase" letterSpacing="widest">
            Seguir
          </Text>
          <Text color="brand.brown" fontSize="sm">→</Text>
        </HStack>
      </VStack>
    </Box>
  )
}

function ContactCard({ item }) {
  const isMarketing = item.title.toLowerCase().includes('marketing')
  const IconComponent = item.icon

  return (
    <Box
      as={Link}
      href={item.url}
      display="block"
      textDecoration="none"
      border="1px solid"
      borderColor={isMarketing ? 'rgba(212,168,75,0.35)' : 'rgba(139,69,19,0.18)'}
      borderLeft={isMarketing ? '2px solid' : '1px solid'}
      borderLeftColor={isMarketing ? 'brand.amber' : 'rgba(139,69,19,0.18)'}
      p={6}
      position="relative"
      transition="border-color 0.3s, background 0.3s"
      _hover={{
        borderColor: isMarketing ? 'rgba(212,168,75,0.6)' : 'rgba(139,69,19,0.5)',
        bg: item.hoverColor,
        textDecoration: 'none',
      }}
    >
      <HStack spacing={4}>
        <Icon
          as={IconComponent}
          fontSize="24px"
          color={isMarketing ? 'brand.amber' : 'brand.brownLight'}
        />
        <VStack align="start" spacing={0.5}>
          <Text fontFamily="mono" fontSize="9px"
                color={isMarketing ? 'brand.amber' : 'brand.brown'}
                textTransform="uppercase" letterSpacing="widest">
            {item.title}
          </Text>
          <Text fontFamily="heading" fontSize="xl" color="white" lineHeight={1.1}>
            {item.label}
          </Text>
          <Text fontFamily="mono" fontSize="xs" color="brand.gray" letterSpacing="wider">
            {item.handle}
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}

export default function ContactSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const gridRef    = useRef(null)
  const contactRef = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef,   fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 }, position: '<' },
      { ref: gridRef,    fromVars: { y: 40, opacity: 0 }, vars: { y: 0, opacity: 1 }, position: '-=0.3' },
      { ref: contactRef, fromVars: { y: 30, opacity: 0 }, vars: { y: 0, opacity: 1 }, position: '-=0.2' },
    ],
    start: 'top 80%',
    end:   'top 30%',
  })

  return (
    <Box
      id="contacto"
      ref={sectionRef}
      bg="brand.dark"
      py={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Box mb={12} ref={titleRef}>
          <Text fontFamily="mono" fontSize="10px" color="brand.brown"
                textTransform="uppercase" letterSpacing="widest" mb={2}>
            Contacto
          </Text>
          <Text fontFamily="heading" fontSize={{ base: '4xl', lg: '6xl' }}
                color="white" lineHeight={1}>
            Conectá
          </Text>
        </Box>

        {/* Social media grid */}
        <Box ref={gridRef} mb={8}>
          <Text fontFamily="mono" fontSize="9px" color="brand.gray"
                textTransform="uppercase" letterSpacing="widest" mb={4}>
            Redes Sociales
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            {playerData.socialMedia.map((item, i) => (
              <SocialCard key={item.label} item={item} index={i} />
            ))}
          </Grid>
        </Box>

        {/* Professional contact */}
        <Box ref={contactRef}>
          <Text fontFamily="mono" fontSize="9px" color="brand.gray"
                textTransform="uppercase" letterSpacing="widest" mb={4}>
            Contacto Profesional
          </Text>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
            {playerData.contact.map((item) => (
              <ContactCard key={item.title} item={item} />
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}
