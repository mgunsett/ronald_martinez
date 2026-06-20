import { useRef } from 'react'
import { Box, Flex, Text, SimpleGrid, Grid, Image } from '@chakra-ui/react'
import { playerData } from '../../data/playerData'
import { useScrubReveal } from '../../hooks/useScrubReveal'

function SocialCard({ item }) {
  const Icon = item.iconBg
  const gradientFill = item.hoverGradient
    ? { '[role=group]:hover & path': { fill: `url(#${item.hoverGradient})` } }
    : undefined
  return (
    <Box
      as="a"
      href={item.url}
      target={item.url?.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      position="relative"
      overflow="hidden"
      bg="rgba(255,255,255,0.02)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius={'10px'}
      p={{ base: 6, md: 8 }}
      transition="all 0.3s ease"
      role="group"
      _hover={{
        transform: 'translateY(-3px)',
          borderColor: 'brand.brownDark',
          bg: 'brand.dark'
      }}
    >
      {/* watermark gigante */}
      <Box
        position="absolute"
        right="-10px"
        bottom="-40px"
        opacity={0.05}
        transition="all 0.4s ease"
        _groupHover={{ opacity: 0.18, color: (item.hoverColor) }}
        color="white"
        pointerEvents="none"
        sx={gradientFill}
      >
        <Box as={Icon} fontSize="180px" />
      </Box>
      <Box position="relative">
        {item.icon && (
        <Box
          as={Icon}
          fontSize="28px"
          mb={6}
          color="whiteAlpha.700"
          transition="color 0.3s ease"
          _groupHover={{ color: item.hoverColor }}
          sx={gradientFill}
        />
        )}
        {item.image && (
          <Image
          src={item.image}
          w={'30px'}
          h={'30px'}
          mb={6}
          filter="brightness(0.3)"
          color="whiteAlpha.700"
          transition="all 0.3s ease"
          _groupHover={{ color: item.hoverColor, filter:"brightness(0.9)"}}
        />
        )}
        <Text
          fontFamily="mono"
          fontSize="10px"
          letterSpacing="0.24em"
          textTransform="uppercase"
          color="whiteAlpha.500"
          mb={1}
        >
          {item.label}
        </Text>
        <Text fontFamily="heading" fontSize={{base:'xl',md:"2xl"}}>
          {item.handle}
        </Text>
      </Box>
    </Box>
  )
}

function ContactRow({ item, gold }) {
  const Icon = item.icon
  return (
    <Box
      as="a"
      href={item.url}
      target={item.url?.startsWith('http') ? '_blank' : undefined}
      rel="noopener noreferrer"
      display="block"
      bg="rgba(255,255,255,0.02)"
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius='10px'
      borderLeftColor= {gold ? 'brand.amber' : 'brand.brownDark'}
      borderLeftWidth= '4px'
      borderLeftStyle= 'solid'
      p={{ base: 5, md: 8 }}
      transition="all 0.3s ease"
      role="group"
      _hover={{
        transform: 'translateY(-3px)',
        borderColor: gold ? 'brand.amber' : 'brand.brown',
      }}
    >
      <Flex align="center" gap={4}>
        {item.icon && (
          <Box
            ml={3}
            as={Icon}
            fontSize="40px"
            color='whiteAlpha.400'
            opacity={0.4}
            transition='all 0.8 ease'
            _groupHover={{ opacity: 1, color: 'brand.brown' }}
          />
        )}
        {item.image && (
          <Box boxSize="60px" overflow="hidden" transition="all 0.5s ease" >
            <Image 
            src={item.image} 
            alt={item.label} 
            w="100%"
            filter="brightness(0.3)"
            transition="all 0.3s ease"
            _groupHover={{ 
              filter: 'brightness(0.9)',
             }}
             />
          </Box>
        )}
        <Box ml={gold ? '8px' : '16px'}>
          <Text
            fontFamily="mono"
            fontSize="10px"
            letterSpacing="0.24em"
            textTransform="uppercase"
            color="whiteAlpha.500"
          >
            {item.label}
          </Text>
          <Text fontFamily="heading" fontSize="2xl" fontWeight={500}>
            {item.handle}
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

export function ContactSection() {
  const professional = playerData.contact.filter(
    (c) => c.title === 'Representante Deportivo'
  )
  const representative = playerData.contact.filter(
    (c) => c.title === 'Contacto Marketing'
  )

  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const socialRef  = useRef(null)
  const proRef     = useRef(null)
  const repRef     = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [
      { ref: headerRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } },
      { ref: socialRef, fromVars: { y: 40, opacity: 0 }, vars: { y: 0, opacity: 1 } },
      { ref: proRef,    fromVars: { y: 40, opacity: 0 }, vars: { y: 0, opacity: 1 } },
      { ref: repRef,    fromVars: { y: 40, opacity: 0 }, vars: { y: 0, opacity: 1 } },
    ],
    start: 'top 80%',
    end:   'top 35%',
  })

  return (
    <Box
      as="section"
      id="contact"
      ref={sectionRef}
      position="relative"
      bg="#080C12"
      px={{ base: 6, md: 12, lg: 20 }}
      py={{ base: 20, md: 28 }}
      overflow="hidden"
    >
      <Box className="deco-grid" />

    

      <Box position="relative" zIndex={1} maxW="1400px" mx="auto">
        {/* Header */}
        <Box ref={headerRef} mb={{ base: 8, md: 10 }}>
          <Text fontFamily="mono" fontSize="10px" color="white"
                  textTransform="uppercase" letterSpacing="widest">
            #Redes
          </Text>
          <Text fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
                  color="brand.brown" lineHeight={1}>
            Contacto
          </Text>
        </Box>

        {/* Social media */}
        <Box ref={socialRef} mb={4}>
          <Text
            fontFamily="mono"
            fontSize="11px"
            letterSpacing="0.28em"
            textTransform="uppercase"
            color="whiteAlpha.600"
            mb={5}
          >
            Redes sociales
          </Text>
          {/* Definición del degradado oficial de Instagram (referenciado por fill: url(#insta-gradient)) */}
          <Box as="svg" w={0} h={0} position="absolute" aria-hidden>
            <defs>
              <linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#f09433" />
                <stop offset="25%"  stopColor="#e6683c" />
                <stop offset="50%"  stopColor="#dc2743" />
                <stop offset="75%"  stopColor="#cc2366" />
                <stop offset="100%" stopColor="#bc1888" />
              </linearGradient>
            </defs>
          </Box>
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 2 }} spacing={4}>
            {playerData.socialMedia.map((s, i) => (
              <SocialCard key={i} item={s} />
            ))}
          </SimpleGrid>
        </Box>

        {/* Contacto profesional */}
        <Box ref={proRef} mb={4}>
          <Text
            fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.28em"
                textTransform="uppercase"
                color="whiteAlpha.600"
                mb={5}
          >
            Representante Deportivo
          </Text>
          <Grid templateColumns={{ base: '1fr', md: '1fr' }} gap={4}>
            {professional.map((c, i) => (
              <ContactRow key={i} item={c} />
            ))}
          </Grid>
        </Box>

        {/* Representante */}
        <Box ref={repRef}>
          <Text
            fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.28em"
                textTransform="uppercase"
                color="brand.amber"
                mb={5}
          >
            Representante de marketing
          </Text>
          <Grid templateColumns={{ base: '1fr', md: '1fr' }} gap={4}>
            {representative.map((c, i) => (
              <ContactRow key={i} item={c} gold />
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  )
}

export default ContactSection
