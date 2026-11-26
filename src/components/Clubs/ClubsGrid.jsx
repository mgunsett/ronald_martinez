import { useRef, useEffect } from 'react'
import { Box, Grid, Flex, Text, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

// Clubes "Grilla de escudos": una baldosa por club con el escudo completo en
// gris de fondo, el club actual en el acento y una baldosa de resumen al final.

// Paleta de Ronaldo en oscuro: fondo, panel, acento azul, dorado y líneas.
const BG = '#050B14'
const PANEL = '#0B1626'
const ACC = '#4D93D6'
const LINE = 'rgba(77,147,214,0.25)'

// Vínculo corto para la etiqueta de arriba; cualquier otra nota va como línea aparte.
function linkLabel(club, i) {
  if (i === 0) return 'Actual'
  if (/selecci/i.test(club.name)) return 'Selección'
  if (/préstamo/i.test(club.info)) return 'Préstamo'
  if (/debut/i.test(club.info)) return 'Debut'
  return ''
}
const extraNote = (club) => (/préstamo|debut/i.test(club.info || '') ? '' : (club.info || '').trim())

function ClubTile({ club, index }) {
  const isCur = index === 0
  const label = linkLabel(club, index)
  const note = extraNote(club)

  return (
    <Box
      as="article"
      data-tile
      role="group"
      position="relative"
      overflow="hidden"
      bg={isCur ? ACC : BG}
      color={isCur ? BG : 'brand.bone'}
      px={{ base: 4, md: 6 }}
      py={{ base: '18px', md: '26px' }}
      minH={{ base: '190px', md: '250px' }}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      sx={{
        '@media (hover: hover) and (pointer: fine)': isCur ? {} : {
          transition: 'background .3s cubic-bezier(0.23,1,0.32,1)',
          '&:hover': { bg: PANEL },
          '&:hover .club-crest': { transform: 'scale(1.08)' },
        },
      }}
    >
      {/* Escudo completo, en gris y tenue, de fondo */}
      <Image
        src={club.logo}
        alt=""
        aria-hidden="true"
        position="absolute"
        right={{ base: '-24px', md: '-34px' }}
        bottom={{ base: '-24px', md: '-34px' }}
        boxSize={{ base: '130px', md: '190px' }}
        objectFit="contain"
        pointerEvents="none"
        filter={isCur ? 'grayscale(1)' : 'grayscale(1) contrast(1.1)'}
        opacity={isCur ? 0.3 : 0.16}
        sx={isCur ? { mixBlendMode: 'multiply' } : undefined}
      />

      {label && (
        <Text
          position="absolute"
          top={{ base: 4, md: 6 }}
          right={{ base: '14px', md: '22px' }}
          fontSize={{ base: '9px', md: '10px' }}
          fontWeight="bold"
          letterSpacing="0.16em"
          textTransform="uppercase"
          color={isCur ? BG : 'brand.gray'}
        >
          {label}
        </Text>
      )}

      <Image
        className="club-crest"
        src={club.logo}
        alt={`Escudo de ${club.name}`}
        loading="lazy"
        boxSize={{ base: '54px', md: '76px' }}
        objectFit="contain"
        position="relative"
        transition="transform .4s cubic-bezier(0.23,1,0.32,1)"
      />

      <Box position="relative">
        <Text fontSize="12px" fontWeight="bold" letterSpacing="0.16em" color={isCur ? BG : 'brand.gray'}>
          {club.years}
        </Text>
        <Text as="h3" mt={{ base: 2, md: 4 }} fontFamily="heading" fontWeight={400} fontSize={{ base: '21px', md: '28px' }} textTransform="uppercase" lineHeight={1.05}>
          {club.name}
        </Text>
        <Text mt="6px" fontSize="11px" letterSpacing="0.2em" textTransform="uppercase" color={isCur ? BG : 'brand.gray'}>
          {club.country}
        </Text>
        {club.titles?.map((t) => (
          <Text key={t} mt="10px" fontSize="12px" color={isCur ? BG : ACC}>★ {t}</Text>
        ))}
        {note && (
          <Text mt="6px" fontSize="12px" color={isCur ? BG : 'brand.amber'}>{note}</Text>
        )}
      </Box>
    </Box>
  )
}

export function ClubsGrid() {
  const wrapRef = useRef(null)
  const clubs = playerData.clubs
  const countries = new Set(clubs.map((c) => c.country)).size
  const titles = clubs.reduce((a, c) => a + (c.titles?.length || 0), 0)

  const summary = [
    { n: clubs.length, label: clubs.length === 1 ? 'Club' : 'Clubes' },
    { n: countries, label: countries === 1 ? 'País' : 'Países' },
    titles ? { n: titles, label: titles === 1 ? 'Título' : 'Títulos' } : null,
  ].filter(Boolean)

  // Si la cantidad de baldosas no cierra la grilla, el resumen ocupa el hueco
  const total = clubs.length + 1
  const spanLg = (4 - (total % 4)) % 4 + 1
  const spanBase = total % 2 ? 2 : 1

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        gsap.utils.toArray('[data-tile]', wrapRef.current),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06,
          scrollTrigger: { trigger: wrapRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <Box as="section" id="clubes" aria-labelledby="clubes-title" mt={{ base: 16, lg: 24 }} ref={wrapRef}>
      <Box mb={7}>
        <Text fontFamily="mono" fontSize="11px" fontWeight={700} color="brand.amber" textTransform="uppercase" letterSpacing="0.24em">
          Trayectoria
        </Text>
        <Text as="h2" id="clubes-title" fontFamily="heading" fontSize={{ base: '6xl', lg: '8xl' }} color={ACC} lineHeight={0.9}>
          Clubes
        </Text>
      </Box>

      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap="2px"
        bg={LINE}
        border="1px solid"
        borderColor={LINE}
      >
        {clubs.map((club, i) => <ClubTile key={club.name} club={club} index={i} />)}

        <Grid
          data-tile
          bg={PANEL}
          px={{ base: 4, md: 6 }}
          py={{ base: '18px', md: '26px' }}
          alignContent="center"
          gap="14px"
          gridColumn={{ base: `span ${spanBase}`, lg: `span ${spanLg}` }}
        >
          {summary.map((s) => (
            <Flex key={s.label} align="baseline" gap={3}>
              <Text fontFamily="heading" fontWeight={400} fontSize={{ base: '46px', md: '64px' }} lineHeight={0.9} color={ACC} minW={{ base: '44px', md: '60px' }}>
                {s.n}
              </Text>
              <Text fontSize="11px" letterSpacing="0.2em" textTransform="uppercase" color="#D6E0EC">{s.label}</Text>
            </Flex>
          ))}
        </Grid>
      </Grid>
    </Box>
  )
}

export default ClubsGrid
