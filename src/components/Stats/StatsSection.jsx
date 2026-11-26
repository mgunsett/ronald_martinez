import { useRef } from 'react'
import {
  Box, Text, Flex, VStack, HStack, Image, IconButton,
} from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'
import StatsDossier from './StatsDossier'

gsap.registerPlugin(ScrollTrigger)

function ClubNode({ club, isFirst, isLast, isActive }) {
  const NODE_W = { base: '180px', md: '220px' }
  const BADGE = '74px'

  return (
    <Box
      w={NODE_W}
      flexShrink={0}
      scrollSnapAlign="center"
      position="relative"
      pt={8}
    >
      {/* Riel + nodo del escudo */}
      <Flex h={BADGE} align="center" justify="center" position="relative">
        {/* Línea conectora (segmento por club) */}
        <Box
          position="absolute"
          top="50%"
          left={isFirst ? '50%' : 0}
          right={isLast ? '50%' : 0}
          h="1px"
          bg="whiteAlpha.200"
          transform="translateY(-50%)"
        />
        {/* Tramo recorrido (resaltado hacia el club actual) */}
        {isFirst && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            right={0}
            h="1px"
            bgGradient="linear(to-r, brand.brown, transparent)"
            transform="translateY(-50%)"
          />
        )}

        {/* Escudo */}
        <Flex
          boxSize={BADGE}
          borderRadius="full"
          align="center"
          justify="center"
          position="relative"
          zIndex={1}
          bg="#070F1A"
          border="1px solid"
          borderColor={isActive ? 'brand.brown' : 'whiteAlpha.200'}
          boxShadow={isActive ? '0 0 0 4px rgba(30,95,168,0.18), 0 0 26px rgba(30,95,168,0.35)' : 'none'}
          transition="border-color 0.35s, box-shadow 0.35s, transform 0.35s"
          _groupHover={{
            borderColor: 'brand.brown',
            transform: 'translateY(-4px)',
            boxShadow: '0 0 0 4px rgba(30,95,168,0.18), 0 0 26px rgba(30,95,168,0.35)',
          }}
        >
          <Image
            src={club.logo}
            alt={`Escudo de ${club.name}`}
            boxSize="46px"
            objectFit="contain"
            loading="lazy"
            filter={isActive ? 'none' : 'saturate(0.85)'}
            transition="filter 0.35s"
          />
        </Flex>
      </Flex>

      {/* Tarjeta */}
      <Box
        mt={5}
        mx={2}
        px={4}
        pt={5}
        pb={8}
        bg="#070F1A"
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius="lg"
        textAlign="center"
        position="relative"
        transition="border-color 0.35s, transform 0.35s, background 0.35s"
        _before={{
          content: '""', position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          w: isActive ? '40px' : '0', h: '2px', bg: 'brand.brown',
          transition: 'width 0.35s',
        }}
        _groupHover={{
          borderColor: 'rgba(30,95,168,0.5)',
          transform: 'translateY(-4px)',
          bg: 'rgba(30,95,168,0.04)',
          _before: { width: '40px' },
        }}
      >
        <Text
          fontFamily="mono"
          fontSize="10px"
          color={isActive ? 'brand.brownLight' : 'brand.gray'}
          textTransform="uppercase"
          letterSpacing="0.2em"
        >
          {club.years}
        </Text>
        <Text fontFamily="heading" fontSize="xl" color="white" lineHeight={1.05} mt={1}>
          {club.name}
        </Text>
        <Text
          fontFamily="mono"
          fontSize="10px"
          color="brand.gray"
          textTransform="uppercase"
          letterSpacing="0.18em"
          mt={1}
        >
          {club.country}
        </Text>

        {club.titles.length > 0 && (
          <VStack spacing={1.5} mt={3}>
            {club.titles.map((t) => (
              <HStack key={t} spacing={1.5} justify="center">
                <Box w="4px" h="4px" bg="brand.amber" borderRadius="full" flexShrink={0} />
                <Text fontFamily="mono" fontSize="9px" color="brand.amber" letterSpacing="0.12em">
                  {t}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}

        {club.info && (
          <Text fontFamily="mono" fontSize="10px" color="brand.gray" lineHeight={1.5} mt={3}>
            {club.info}
          </Text>
        )}
      </Box>
    </Box>
  )
}

function ClubTimeline() {
  const scrollRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  const scrollByDir = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  const onDown = (e) => {
    const el = scrollRef.current
    if (!el) return
    drag.current.active = true
    drag.current.moved = false
    drag.current.startX = (e.pageX ?? e.touches?.[0]?.pageX) - el.offsetLeft
    drag.current.scrollLeft = el.scrollLeft
    el.style.cursor = 'grabbing'
  }
  const onMove = (e) => {
    const el = scrollRef.current
    if (!drag.current.active || !el) return
    const x = (e.pageX ?? e.touches?.[0]?.pageX) - el.offsetLeft
    const delta = (x - drag.current.startX) * 1.15
    if (Math.abs(delta) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.scrollLeft - delta
  }
  const onUp = () => {
    drag.current.active = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  const arrowProps = {
    variant: 'unstyled',
    minW: '38px',
    h: '38px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'full',
    border: '1px solid',
    borderColor: 'whiteAlpha.200',
    color: 'whiteAlpha.700',
    transition: 'all 0.25s',
    _hover: { borderColor: 'brand.brown', color: 'white', bg: 'rgba(30,95,168,0.12)' },
    _active: { transform: 'scale(0.92)' },
  }

  return (
    <Box mt={16}>
      <Flex align="flex-end" justify="space-between" mb={7}>
        <Box>
          <Text fontFamily="mono" fontSize="10px" color="white"
                  textTransform="uppercase" letterSpacing="widest">
            Trayectoria
          </Text>
          <Text as="h2" fontFamily="heading" fontSize={{ base: '5xl', lg: '6xl' }}
                  color="brand.brown" lineHeight={1}>
            Clubes
          </Text>
        </Box>
        <HStack spacing={2}>
          <IconButton aria-label="Anterior" icon={<FiChevronLeft size={18} />}
                      onClick={() => scrollByDir(-1)} {...arrowProps} />
          <IconButton aria-label="Siguiente" icon={<FiChevronRight size={18} />}
                      onClick={() => scrollByDir(1)} {...arrowProps} />
        </HStack>
      </Flex>

      <Box
        ref={scrollRef}
        overflowX="auto"
        cursor="grab"
        pb={6}
        sx={{
          scrollSnapType: 'x mandatory',
          '&::-webkit-scrollbar': { height: '2px' },
          '&::-webkit-scrollbar-track': { bg: 'whiteAlpha.50' },
          '&::-webkit-scrollbar-thumb': { bg: 'brand.brown' },
        }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation() } }}
      >
        <HStack spacing={0} align="stretch" w="max-content" px={1}>
          {playerData.clubs.map((club, i) => (
            <Box key={club.name} role="group">
              <ClubNode
                club={club}
                isFirst={i === 0}
                isLast={i === playerData.clubs.length - 1}
                isActive={i === 0}
              />
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  )
}

export default function StatsSection() {
  return (
    <Box
      as="section"
      id="estadisticas"
      bg="#050B14"
      pt={{ base: 16, lg: 20 }}
      pb={{ base: 16, lg: 20 }}
      px={{ base: 5, lg: 10 }}
      borderTopLeftRadius={{ base: '14px', lg: '22px' }}
      borderTopRightRadius={{ base: '14px', lg: '22px' }}
      boxShadow="0 -24px 80px rgba(0,0,0,0.65)"
    >
      <Box maxW="1400px" mx="auto">
        <StatsDossier />

        {/* Club timeline */}
        <ClubTimeline />
      </Box>
    </Box>
  )
}
