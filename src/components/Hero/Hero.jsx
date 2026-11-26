import { useRef, useEffect } from 'react'
import { Box, Flex, Text, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { playerData } from '../../data/playerData'
import useMatches from '../../hooks/useMatches'
import useSeasonStats from '../../hooks/useSeasonStats'
import { useLoading } from '../../context/LoadingContext'

// ─── Hero "Split con ficha" · versión oscura (comparador: Hero O5) ────
// Columna de texto a la izquierda (píldora con dorsal y posición, nombre,
// club y selección, 4 números de la temporada y botones) y panel en
// diagonal a la derecha con degradé azul Vélez, el dorsal en contorno, un
// brillo detrás del recorte y la tarjeta de partidos translúcida.
// Mobile: el recorte ocupa el panel de arriba y la zona del texto lleva
// blur + velo oscuro para que se lea sobre las piernas del recorte.

const EASE = 'cubic-bezier(0.23,1,0.32,1)'
const MATCH_H = '84px' // alto de la tarjeta de partidos en mobile
const C = {
  accent: '#4D93D6',      // azul claro: apellido y números
  gold: 'brand.amber',    // dorado: goles, dorsal y botón principal
  panel: 'linear-gradient(165deg,#1E5FA8 0%,#123E7A 45%,#0B2A4A 100%)',
  bg: 'radial-gradient(60% 70% at 18% 55%,#0e1f38 0%,#050B14 70%)',
}

const isNum = (v) => typeof v === 'number' && Number.isFinite(v)
const norm = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Partidos, Goles, Tiros al arco y Valoración: de API-Football si está
// sincronizado, y si no de playerData.seasonStats (por rótulo).
function heroStats(season) {
  const fixed = (label) => playerData.seasonStats.find((s) => norm(s.label) === norm(label))?.value
  const pick = (v, label) => (v ?? fixed(label))
  return [
    { label: 'Partidos', value: pick(season?.partidos, 'Partidos') },
    { label: 'Goles', value: pick(season?.goles, 'Goles'), hl: true },
    { label: 'Tiros al arco', value: pick(season?.tirosArco, 'Tiros al arco') },
    { label: 'Valoración', value: isNum(season?.rating) ? season.rating.toFixed(1) : fixed('Valoración') },
  ].filter((s) => s.value !== undefined && s.value !== null)
}

const code = (name = '') => name.replace(/[^A-Za-zÀ-ÿ ]/g, '').trim().slice(0, 3).toUpperCase()

function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: -20 })
  else target.scrollIntoView({ behavior: 'smooth' })
}

function MatchCell({ label, accent, title, meta }) {
  return (
    <Box px={{ base: 3, lg: '18px' }} py={{ base: '10px', lg: '14px' }} minW={0}>
      <Text fontFamily="mono" fontSize="10px" fontWeight="700" letterSpacing="0.24em" textTransform="uppercase"
        color={accent ? 'brand.amber' : 'brand.gray'} mb="4px">
        {label}
      </Text>
      <Text fontFamily="heading" fontSize={{ base: '20px', lg: '24px' }} lineHeight={1} color="white"
        letterSpacing="0.06em" sx={{ fontVariantNumeric: 'tabular-nums' }} noOfLines={1}>
        {title}
      </Text>
      <Text mt="4px" fontFamily="mono" fontSize="11px" color="brand.gray" letterSpacing="0.1em" textTransform="uppercase" noOfLines={1}>
        {meta}
      </Text>
    </Box>
  )
}

function MatchCard({ last, next }) {
  const played = last && last.homeScore !== null && last.awayScore !== null
  return (
    <Box
      className="hs-match"
      role="group"
      aria-label="Partidos"
      position="absolute"
      zIndex={6}
      left={{ base: '20px', lg: 'auto' }}
      right={{ base: '20px', lg: '40px' }}
      bottom={{ base: '20px', lg: '40px' }}
      h={{ base: MATCH_H, lg: 'auto' }}
      display="grid"
      gridTemplateColumns="1fr 1fr"
      bg="rgba(11,22,38,0.92)"
      border="1px solid rgba(77,147,214,0.2)"
      borderRadius="6px"
      overflow="hidden"
      boxShadow="0 20px 50px rgba(0,0,0,0.5)"
      backdropFilter="blur(6px)"
    >
      {last && (
        <MatchCell
          label="Último"
          title={played
            ? `${code(last.home.name)} ${last.homeScore}–${last.awayScore} ${code(last.away.name)}`
            : `${code(last.home.name)} vs ${code(last.away.name)}`}
          meta={last.date}
        />
      )}
      {next && (
        <Box borderLeft="1px solid rgba(77,147,214,0.2)" minW={0}>
          <MatchCell
            label="Próximo"
            accent
            title={`${code(next.home.name)} vs ${code(next.away.name)}`}
            meta={[next.date, next.stadium].filter(Boolean).join(' · ')}
          />
        </Box>
      )}
    </Box>
  )
}

const btn = {
  as: 'a',
  py: '14px',
  px: '24px',
  borderRadius: '4px',
  fontFamily: 'mono',
  fontSize: '13px',
  fontWeight: '700',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  border: '1.5px solid',
  transition: `transform .25s ${EASE}`,
  sx: { '@media (hover: hover) and (pointer: fine)': { '&:hover': { transform: 'translateY(-2px)' } } },
}

export default function Hero() {
  const rootRef = useRef(null)
  const { matches } = useMatches()
  const season = useSeasonStats()
  const { isReady } = useLoading()
  const stats = heroStats(season)

  // Una sola entrada coordinada (cuando el loader libera la vista):
  // panel, recorte, textos en cascada y tarjeta de partidos.
  useEffect(() => {
    if (!isReady || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hs-panel', { xPercent: 30, opacity: 0, duration: 1.2 })
        .from('.hs-player', { y: 40, opacity: 0, duration: 1.4 }, 0.3)
        .from('.hs-rv', { y: 28, opacity: 0, duration: 1, stagger: 0.1 }, 0.2)
        .from('.hs-match', { y: 24, opacity: 0, duration: 1 }, 0.9)
    }, rootRef)
    return () => ctx.revert()
  }, [isReady])

  const handleLink = (e, href) => { e.preventDefault(); scrollTo(href) }

  return (
    <Box
      as="section"
      id="hero"
      ref={rootRef}
      position="relative"
      overflow="hidden"
      bg={C.bg}
      display="grid"
      gridTemplateColumns={{ base: '1fr', lg: '1.05fr 1fr' }}
      gridTemplateRows={{ base: '50% 50%', lg: '1fr' }}
      minH={{ base: '780px', lg: '640px' }}
      sx={{
        '--sv': '1vh',
        '@supports (height: 1svh)': { '--sv': '1svh' },
        height: 'calc(100 * var(--sv))',
      }}
    >
      {/* Columna de texto */}
      <Flex
        className="hs-txt"
        position="relative"
        zIndex={5}
        gridRow={{ base: 2, lg: 1 }}
        direction="column"
        justify={{ base: 'flex-start', lg: 'center' }}
        pt={{ base: 2, lg: '96px' }}
        pb={{ base: `calc(${MATCH_H} + 28px)`, lg: '60px' }}
        pl={{ base: 5, lg: '60px' }}
        pr={{ base: 5, lg: 0 }}
        sx={{
          isolation: 'isolate',
          // Mobile: blur + velo oscuro sobre la parte del recorte que queda detrás del texto
          '@media (max-width: 61.99em)': {
            '&::before': {
              content: '""', position: 'absolute', zIndex: -1, left: 0, right: 0, top: '-56px', bottom: 0,
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              background: 'linear-gradient(180deg,rgba(5,11,20,0) 0%,rgba(5,11,20,.55) 22%,rgba(5,11,20,.85) 60%,#050B14 100%)',
              WebkitMaskImage: 'linear-gradient(180deg,transparent 0,#000 64px)',
              maskImage: 'linear-gradient(180deg,transparent 0,#000 64px)',
            },
          },
        }}
      >
        <Flex className="hs-rv" align="center" gap="10px" alignSelf="flex-start" py="7px" pl="7px" pr="14px"
          borderRadius="full" bg="rgba(77,147,214,0.12)" color={C.accent} fontFamily="mono"
          fontSize={{ base: '11px', lg: '12px' }} fontWeight="700" letterSpacing="0.2em" textTransform="uppercase">
          <Flex as="span" boxSize="26px" borderRadius="full" bg={C.gold} color="brand.dark" align="center"
            justify="center" fontSize="12px" letterSpacing={0}>
            {playerData.number}
          </Flex>
          {playerData.position}
        </Flex>

        <Box as="h1" mt={{ base: '14px', lg: '22px' }} fontFamily="heading" fontWeight="400" lineHeight={0.86}>
          <Text as="span" className="hs-rv" display="block" color="brand.gray" letterSpacing="0.08em"
            fontFamily="body" fontWeight={500} fontSize={{ base: '6.5vw', lg: 'clamp(30px, 3.6vw, 60px)' }}>
            {playerData.name}
          </Text>
          <Text as="span" className="hs-rv" display="block" color={C.accent} ml="-0.03em" whiteSpace="nowrap"
            fontSize={{ base: '15.5vw', lg: 'clamp(72px, 8.8vw, 160px)' }}>
            {playerData.fullName}
          </Text>
        </Box>

        <Flex className="hs-rv" align="center" gap={{ base: '10px', lg: '18px' }} mt={{ base: '12px', lg: '18px' }}
          fontFamily="mono" fontSize={{ base: '13px', lg: '15px' }} fontWeight="600" letterSpacing="0.1em"
          textTransform="uppercase" color="white">
          <Flex align="center" gap="8px">
            <Image src={playerData.logoCurrentClub} alt="" boxSize="24px" objectFit="contain" />
            {playerData.currentClub}
          </Flex>
          <Box w="1px" h="18px" bg="whiteAlpha.300" />
          <Flex align="center" gap="8px">
            <Image src={playerData.nationalityFlag} alt="" boxSize="22px" objectFit="contain" />
            {playerData.nationality}
          </Flex>
        </Flex>

        <Flex className="hs-rv" mt={{ base: '18px', lg: '30px' }} gap={{ base: 0, lg: '28px', xl: '40px' }}
          justify={{ base: 'space-between', lg: 'flex-start' }}>
          {stats.map((s) => (
            <Box key={s.label}>
              <Text fontFamily="heading" fontSize={{ base: '38px', lg: '48px', xl: '58px' }} lineHeight={1}
                color={s.hl ? C.gold : C.accent} sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {s.value}
              </Text>
              <Text mt="2px" fontFamily="mono" fontSize={{ base: '10px', lg: '11px' }} letterSpacing={{ base: '0.12em', lg: '0.2em' }}
                textTransform="uppercase" color="brand.gray">
                {s.label}
              </Text>
            </Box>
          ))}
        </Flex>

        <Flex className="hs-rv" display={{ base: 'none', lg: 'flex' }} gap="12px" mt="34px">
          <Box {...btn} href="#videos" onClick={(e) => handleLink(e, '#videos')} bg={C.gold} borderColor={C.gold} color="brand.dark">
            Ver jugadas
          </Box>
          <Box {...btn} href="#contact" onClick={(e) => handleLink(e, '#contact')} bg="transparent" borderColor="brand.brown" color={C.accent}>
            Contacto
          </Box>
        </Flex>
      </Flex>

      {/* Panel + recorte. En mobile la columna es estática para que el recorte
          se ubique respecto de todo el hero. */}
      <Box position={{ base: 'static', lg: 'relative' }} gridRow={1} gridColumn={{ base: 1, lg: 2 }}>
        <Box
          className="hs-panel"
          position="absolute"
          top={0}
          left={{ base: 0, lg: '-8%' }}
          right={0}
          bottom={{ base: '50%', lg: 0 }}
          bg={C.panel}
          overflow="hidden"
          sx={{ clipPath: { base: 'polygon(0 0,100% 0,100% 84%,0 100%)', lg: 'polygon(22% 0,100% 0,100% 100%,0 100%)' } }}
          _after={{ content: '""', display: { base: 'none', lg: 'block' }, position: 'absolute', left: 0, right: 0, bottom: 0, h: '10px', bg: 'brand.amber' }}
        >
          <Text aria-hidden="true" position="absolute" right={{ base: '-4%', lg: '-2%' }} top="-6%" fontFamily="heading"
            lineHeight={1} color="transparent" fontSize={{ base: '52vh', lg: '84vh' }}
            sx={{ WebkitTextStroke: '2px rgba(255,255,255,0.12)' }}>
            {playerData.number}
          </Text>
        </Box>
        {/* Brillo detrás del recorte para despegar la camiseta azul del panel */}
        <Box aria-hidden="true" position="absolute" zIndex={2} pointerEvents="none" borderRadius="full"
          left="50%" w={{ base: '90%', lg: '70%' }} top={{ base: '12%', lg: 'auto' }} bottom={{ base: 'auto', lg: '8%' }}
          transform="translateX(-45%)" sx={{ aspectRatio: '1' }}
          bg="radial-gradient(closest-side, rgba(77,147,214,0.35), rgba(77,147,214,0))" />
        <Image
          className="hs-player"
          src={playerData.heroCutout}
          alt={playerData.heroCutoutAlt}
          fetchpriority="high"
          draggable={false}
          position="absolute"
          zIndex={3}
          left={{ base: '50%', lg: '59%' }}
          transform="translateX(-50%)"
          top={{ base: '118px', lg: 'auto' }}
          bottom={{ base: 'auto', lg: 0 }}
          h={{ base: 'calc(64% - 40px)', lg: '86%' }}
          w="auto"
          maxW="none"
          objectFit="contain"
          filter="drop-shadow(-20px 24px 40px rgba(0,0,0,0.65))"
        />
      </Box>

      <MatchCard last={matches.last} next={matches.next} />
    </Box>
  )
}
