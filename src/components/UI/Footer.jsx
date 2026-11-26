import { useEffect, useRef } from 'react'
import { Box, Flex, Text, Link, Image } from '@chakra-ui/react'
import { FiArrowUp, FiArrowUpRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { playerData } from '../../data/playerData'
import sportfolioWeb from '@assets/sportfolio_web.webp'

// Footer "Firma": escudo, posición y club actual, links, "Volver arriba" y la
// firma gigante a todo el ancho (los dos últimos caracteres en contorno).
// Abajo, derechos y crédito del desarrollador.

const SIGNATURE = 'ronaldo77'
const ACC = '#4D93D6'
const BG = '#03070D'
const EASE = 'cubic-bezier(0.23,1,0.32,1)'

function toTop() {
  if (window.__lenis) window.__lenis.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Footer() {
  const ref = useRef(null)
  const wordRef = useRef(null)
  const cut = SIGNATURE.length - 2

  const links = [
    ...playerData.socialMedia.map((s) => ({ label: s.label, url: s.url })),
    ...playerData.contact.map((c) => ({ label: c.label, url: c.url })),
  ]

  // La firma ocupa justo el ancho disponible, sea cual sea la pantalla
  useEffect(() => {
    const el = wordRef.current
    if (!el) return
    const fit = () => {
      el.style.fontSize = '100px'
      const w = el.getBoundingClientRect().width
      const box = el.parentElement.clientWidth
      if (w && box) el.style.fontSize = `${(100 * box / w) * 0.99}px`
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(el.parentElement)
    return () => ro.disconnect()
  }, [])

  // Entrada de la firma con IntersectionObserver: el footer es lo último de la
  // página y su posición cambia cuando cargan imágenes y videos de arriba.
  useEffect(() => {
    const el = wordRef.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.set(el, { yPercent: 40, opacity: 0 })
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      gsap.to(el, { yPercent: 10, opacity: 1, duration: 0.9, ease: 'expo.out' })
      io.disconnect()
    }, { threshold: 0.15 })
    io.observe(ref.current)
    return () => { io.disconnect(); gsap.killTweensOf(el) }
  }, [])

  return (
    <Box ref={ref} as="footer" bg={BG} px={{ base: 5, md: 12, lg: 20 }} pt={{ base: 11, md: 14 }} overflow="hidden" position="relative">
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={6}>
        <Flex align="center" gap={{ base: 4, md: 5 }}>
          <Image src={playerData.logoCurrentClub} alt={`Escudo de ${playerData.currentClub}`} boxSize={{ base: '52px', md: '68px' }} objectFit="contain" />
          <Text fontFamily="heading" fontSize={{ base: '30px', md: 'clamp(30px, 3vw, 46px)' }} lineHeight={0.95} textTransform="uppercase">
            {playerData.position}
            <Box as="span" display="block" color={ACC}>{playerData.currentClub}</Box>
          </Text>
        </Flex>

        <Flex
          as="button"
          type="button"
          onClick={toTop}
          align="center"
          gap={3}
          fontFamily="mono"
          fontSize="13px"
          fontWeight={700}
          letterSpacing="0.18em"
          textTransform="uppercase"
          color={ACC}
          _focusVisible={{ outline: '2px solid', outlineColor: 'brand.amber', outlineOffset: '3px' }}
          sx={{
            '&:active .up-ico': { transform: 'scale(0.94)' },
            '@media (hover: hover) and (pointer: fine)': { '&:hover .up-ico': { transform: 'translateY(-4px)', bg: ACC, color: BG } },
          }}
        >
          Volver arriba
          <Box className="up-ico" as="span" boxSize="54px" borderRadius="full" border="1.5px solid" borderColor={ACC} display="grid" placeItems="center" fontSize="20px" transition={`transform 200ms ${EASE}, background 200ms ease, color 200ms ease`}>
            <FiArrowUp aria-hidden="true" />
          </Box>
        </Flex>
      </Flex>

      <Flex gap={{ base: 4, md: 6 }} mt={{ base: 7, md: 8 }} flexWrap="wrap">
        {links.map((l) => (
          <Link
            key={l.url}
            href={l.url}
            isExternal
            display="inline-flex"
            alignItems="center"
            gap="6px"
            fontFamily="mono"
            fontSize="13px"
            letterSpacing="0.18em"
            textTransform="uppercase"
            color="white"
            borderBottom="1px solid"
            borderColor="rgba(77,147,214,0.35)"
            pb={1}
            transition="color 200ms ease"
            _hover={{ color: ACC, textDecoration: 'none' }}
            _focusVisible={{ outline: '2px solid', outlineColor: 'brand.amber', outlineOffset: '3px' }}
          >
            {l.label} <FiArrowUpRight aria-hidden="true" />
          </Link>
        ))}
      </Flex>

      {/* Firma gigante */}
      <Box mt={{ base: 8, md: 11 }}>
        <Text
          ref={wordRef}
          aria-hidden="true"
          display="inline-block"
          fontFamily="heading"
          fontSize="20vw"
          lineHeight={0.78}
          color={ACC}
          textTransform="uppercase"
          whiteSpace="nowrap"
          userSelect="none"
          transform="translateY(10%)"
        >
          {SIGNATURE.slice(0, cut)}
          <Box as="span" color="transparent" sx={{ WebkitTextStroke: `2px ${ACC}` }}>{SIGNATURE.slice(cut)}</Box>
        </Text>
      </Box>

      <Flex
        position="relative"
        zIndex={1}
        bg={BG}
        borderTop="2px solid"
        borderColor={ACC}
        mx={{ base: -5, md: -12, lg: -20 }}
        px={{ base: 5, md: 12, lg: 20 }}
        pt={{ base: 4, md: 5 }}
        pb={{ base: 5, md: 6 }}
        justify="space-between"
        align={{ base: 'flex-start', md: 'center' }}
        direction={{ base: 'column', md: 'row' }}
        gap={3}
      >
        <Text fontFamily="mono" fontSize="12px" letterSpacing="0.12em" textTransform="uppercase" color="brand.gray">
          © {new Date().getFullYear()} {playerData.displayName} · Todos los derechos reservados
        </Text>

        {/* Crédito de desarrollo */}
        <Flex direction="column" fontSize="12px" color="rgba(255,255,255,0.3)" letterSpacing="0.05em" textTransform="uppercase" fontFamily="mono">
          Desarrollo Web
          <Link
            href="https://matiasgunsett.netlify.app/sportfolio"
            isExternal
            aria-label="Sportfolio Web"
            transition="opacity 200ms ease"
            _hover={{ opacity: 0.6 }}
          >
            <Image src={sportfolioWeb} alt="Sportfolio Web" display="block" width="85px" height="auto" mx="2px" pt="4px" />
          </Link>
        </Flex>
      </Flex>
    </Box>
  )
}
