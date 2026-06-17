import { Box, Flex, Text, Image, HStack, VStack } from '@chakra-ui/react'

function Shield({ src, name, size = '36px' }) {
  if (src) return <Image src={src} alt={name} boxSize={size} objectFit="contain" />
  return (
    <Box
      boxSize={size}  
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontFamily="heading" fontSize="10px" color="brand.brownLight">
        {name?.slice(0, 3).toUpperCase()}
      </Text>
    </Box>
  )
}

function MatchSlot({ data, label, labelColor }) {
  const { home, away, homeScore, awayScore, date, stadium, competition } = data

  return (
    <Box>
      <Text fontFamily="mono" fontSize="9px" fontWeight="700" letterSpacing="widest"
            textTransform="uppercase" color={labelColor} mb={2}>
        {label}
      </Text>

      {/* Teams row */}
      <Flex align="center" justify="space-between" gap={2}>
        <VStack spacing={1} align="center" flex={1}>
          <Shield src={home.shield} name={home.name} />
          <Text fontFamily="mono" fontSize="9px" color="whiteAlpha.700" textTransform="uppercase"
                letterSpacing="wider" textAlign="center" noOfLines={1}>
            {home.name}
          </Text>
        </VStack>

        {/* Score */}
        <Box textAlign="center" px={2}>
          {homeScore !== null && awayScore !== null ? (
            <HStack spacing={1} justify="center">
              <Text fontFamily="heading" fontSize="2xl" color="white" lineHeight={1}>
                {homeScore}
              </Text>
              <Text fontFamily="heading" fontSize="lg" color="brand.brown" lineHeight={1}>
                —
              </Text>
              <Text fontFamily="heading" fontSize="2xl" color="white" lineHeight={1}>
                {awayScore}
              </Text>
            </HStack>
          ) : (
            <Text fontFamily="heading" fontSize="xl" color="brand.brownLight" letterSpacing="wider">
              VS
            </Text>
          )}
          {competition && (
            <Text fontFamily="mono" fontSize="8px" color="brand.gray" letterSpacing="wider"
                  textTransform="uppercase" mt={0.5} textAlign="center">
              {competition}
            </Text>
          )}
        </Box>

        <VStack spacing={1} align="center" flex={1}>
          <Shield src={away.shield} name={away.name} />
          <Text fontFamily="mono" fontSize="9px" color="whiteAlpha.700" textTransform="uppercase"
                letterSpacing="wider" textAlign="center" noOfLines={1}>
            {away.name}
          </Text>
        </VStack>
      </Flex>

      <Flex mt={2} justify="space-between" align="center">
        <Text fontFamily="mono" fontSize="8px" color="brand.gray" letterSpacing="wider">
          {date}
        </Text>
        {stadium && (
          <Text fontFamily="mono" fontSize="8px" color="brand.gray" letterSpacing="wider"
                textAlign="right" noOfLines={1} maxW="100px">
            {stadium}
          </Text>
        )}
      </Flex>
    </Box>
  )
}

export function MatchBox({ last, next, variant = 'card' }) {
  const isCard = variant === 'card'

  if (isCard) {
    return (
      <Box
        w="280px"
        bg="brand.dark  "
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor= 'brand.brownDark'
        p={4}
        position="relative"
        transition="transform 0.3s, border-color 0.3s"
        _hover={{ transform: 'translateY(-3px)', borderBottomColor: 'brand.brownLight' }}
        _before={{
          content: '""',
          position: 'absolute',
          top: 0, left: 0,
          w: '28px', h: '2px',
          bg: 'brand.brown',
        }}
      >
        <VStack spacing={4} align="stretch">
          <MatchSlot data={last} label="Último Resultado" labelColor="brand.amber" />
          <Box h="1px" bg="rgba(255,255,255,0.07)" />
          <MatchSlot data={next} label="Próximo Partido"  labelColor="brand.brown" />
        </VStack>
      </Box>
    )
  }

  return (
    <Box
      bg="rgba(12,7,5,0.82)"
      backdropFilter="blur(10px)"
      borderTop="1px solid"
      borderColor='brand.brown'
      px={4}
      py={3}
    >
      <Flex gap={0}>
        <Box flex={1} pr={3}>
          <MatchSlot data={last} label="Último Resultado" labelColor="brand.amber" />
        </Box>
        <Box w="1px" bg="rgba(255,255,255,0.07)" mx={2} />
        <Box flex={1} pl={3}>
          <MatchSlot data={next} label="Próximo Partido" labelColor="brand.brown" />
        </Box>
      </Flex>
    </Box>
  )
}

export default MatchBox
