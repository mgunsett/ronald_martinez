import { useState, useEffect, useRef } from 'react'
import { Box, Flex, Text, Image, Link } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { playerData } from '../../data/playerData'
import { useLoading } from '../../context/LoadingContext'

// ─── Navbar "Índice a pantalla completa" (comparador: Navbar C5) ─────
// Barra mínima (iniciales + dorsal, Contacto y MENÚ) con mix-blend
// difference, así se lee sobre fondos claros y oscuros. El menú abre a
// pantalla completa: links gigantes numerados con la sección activa en
// contorno, contactos abajo y la foto a la derecha (arriba en mobile).
//
// Transiciones (CSS): cada regla del estado cerrado define cómo SALE y
// cada regla `.is-open` define cómo ENTRA.
//   Abrir (~1 s): el fondo baja como persiana → la foto sube desde abajo
//   con un zoom suave → links en cascada → contactos y nombre.
//   Cerrar (~0,7 s): links suben y se van → la foto se cierra hacia
//   arriba → el fondo sube. `.is-closing` dura lo que la salida.

const C = {
  ink: '#123E7A',   // links y textos del menú
  gold: '#C9972E',  // números, hover y etiquetas
  gray: '#5C6A88',
  bg: '#F4F6FB',
}
const IN = 'cubic-bezier(.76,0,.24,1)'
const OUT = 'cubic-bezier(.7,0,.84,0)'
const EASE = 'cubic-bezier(0.23,1,0.32,1)'
const CLOSE_MS = 800

export const navLinks = [
  { label: 'Inicio',       href: '#hero' },
  { label: 'Estadísticas', href: '#estadisticas' },
  { label: 'Videos',       href: '#videos' },
  { label: 'Galería',      href: '#galeria' },
  { label: 'Prensa',       href: '#prensa' },
  { label: 'Contacto',     href: '#contact' },
]

function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) window.__lenis.scrollTo(target, { offset: href === '#hero' ? 0 : -20 })
  else target.scrollIntoView({ behavior: 'smooth' })
}

// Sección visible para marcarla en el índice
function useActiveSection() {
  const [active, setActive] = useState('#hero')
  useEffect(() => {
    const seen = {}
    const els = navLinks.map((l) => document.querySelector(l.href)).filter(Boolean)
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { seen[e.target.id] = e.isIntersecting ? e.intersectionRatio : 0 })
      let best = null, ratio = 0
      els.forEach((el) => { if ((seen[el.id] || 0) > ratio) { ratio = seen[el.id]; best = el.id } })
      if (best) setActive(`#${best}`)
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-20% 0px -40% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

const contacts = [
  ...playerData.contact.map((c) => ({ role: c.title, name: c.label, url: c.url })),
  ...playerData.socialMedia.filter((s) => s.label === 'Instagram').map((s) => ({ role: 'Instagram', name: s.handle, url: s.url })),
]

const overlayCss = {
  // Fondo: persiana desde arriba
  '.ix-ov': {
    visibility: 'hidden',
    clipPath: 'inset(0 0 100% 0)',
    transition: `clip-path .55s ${OUT} .2s, visibility 0s .75s`,
  },
  '&.is-open .ix-ov': { visibility: 'visible', clipPath: 'inset(0 0 0 0)', transition: `clip-path .75s ${IN}, visibility 0s` },
  // Links en cascada (entran desde abajo, salen hacia arriba)
  '.ix-lbl': { display: 'inline-block', transform: 'translateY(105%)', transition: `transform .35s ${OUT}, color .3s` },
  '&.is-open .ix-lbl': { transform: 'none', transition: `transform .9s ${EASE} var(--d), color .3s` },
  '&.is-closing .ix-lbl': { transform: 'translateY(-105%)' },
  '.ix-num': { opacity: 0, transition: 'opacity .2s' },
  '&.is-open .ix-num': { opacity: 1, transition: `opacity .6s ${EASE} calc(var(--d) + .15s)` },
  '.ix-ct': { opacity: 0, transform: 'translateY(14px)', transition: 'opacity .2s, transform .2s' },
  '&.is-open .ix-ct': { opacity: 1, transform: 'none', transition: `opacity .7s ${EASE} .75s, transform .7s ${EASE} .75s` },
  // Foto: se abre desde abajo con zoom-out; al cerrar se va hacia arriba
  '.ix-clip': { clipPath: 'inset(100% 0 0 0)', transition: `clip-path .45s ${OUT} .05s` },
  '&.is-open .ix-clip': { clipPath: 'inset(0 0 0 0)', transition: `clip-path 1s ${IN} .2s` },
  '&.is-closing .ix-clip': { clipPath: 'inset(0 0 100% 0)' },
  '.ix-img': { transform: 'scale(1.08) translateY(-3%)', transition: `transform .5s ${OUT}` },
  '&.is-open .ix-img': { transform: 'none', transition: `transform 1.6s ${EASE} .2s` },
  '&.is-closing .ix-img': { transform: 'scale(1.06) translateY(-4%)' },
  '.ix-cap': { opacity: 0, transform: 'translateY(18px)', transition: 'opacity .2s, transform .2s' },
  '&.is-open .ix-cap': { opacity: 1, transform: 'none', transition: `opacity .7s ${EASE} .8s, transform .8s ${EASE} .8s` },
  '@media (hover: hover) and (pointer: fine)': { '.ix-link:hover .ix-lbl': { color: C.gold } },
  '@media (prefers-reduced-motion: reduce)': { '*': { transition: 'none !important' } },
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)
  const active = useActiveSection()
  const btnRef = useRef(null)
  const barRef = useRef(null)
  const closeTimer = useRef(null)
  const { isReady } = useLoading()

  // La barra entra recién cuando el loader terminó
  useEffect(() => {
    if (!isReady) return
    gsap.fromTo(barRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', delay: 0.35 })
  }, [isReady])

  const toggle = (v) => {
    clearTimeout(closeTimer.current)
    if (!v && open) {
      setClosing(true)
      closeTimer.current = setTimeout(() => setClosing(false), CLOSE_MS)
    } else setClosing(false)
    setOpen(v)
  }
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  // Mientras está abierto: frena Lenis, bloquea el scroll y cierra con Escape
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') { toggle(false); btnRef.current?.focus() } }
    window.addEventListener('keydown', onKey)
    return () => {
      window.__lenis?.start()
      document.documentElement.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const go = (e, href) => {
    e.preventDefault()
    const wasOpen = open
    toggle(false)
    // espera a que se libere el scroll antes de desplazar
    setTimeout(() => scrollTo(href), wasOpen ? 80 : 0)
  }

  return (
    <Box className={`${open ? 'is-open' : ''} ${closing ? 'is-closing' : ''}`} sx={overlayCss}>
      <Flex
        ref={barRef}
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        align="center"
        justify="space-between"
        px={{ base: 5, lg: 12 }}
        py={{ base: 3, lg: '18px' }}
        color="white"
        style={{ opacity: 0 }}
        sx={{ mixBlendMode: 'difference' }}
      >
        <Link href="#hero" onClick={(e) => go(e, '#hero')} aria-label={`Inicio · ${playerData.displayName}`}
          fontFamily="heading" fontSize="30px" letterSpacing="0.04em" _hover={{ textDecoration: 'none' }}>
          {playerData.initials}_{playerData.number}
        </Link>
        <Flex align="center" gap="26px">
          <Link href="#contact" onClick={(e) => go(e, '#contact')} display={{ base: 'none', md: 'block' }}
            fontFamily="mono" fontSize="13px" fontWeight="600" letterSpacing="0.2em" textTransform="uppercase" _hover={{ textDecoration: 'none' }}>
            Contacto
          </Link>
          <Box
            as="button"
            ref={btnRef}
            onClick={() => toggle(!open)}
            aria-expanded={open}
            aria-controls="menu-indice"
            display="flex"
            alignItems="center"
            gap="12px"
            fontFamily="mono"
            fontSize="13px"
            fontWeight="700"
            letterSpacing="0.24em"
            textTransform="uppercase"
            minH="44px"
            _focusVisible={{ outline: '2px solid', outlineColor: 'brand.amber', outlineOffset: '3px' }}
          >
            <Box as="span" aria-hidden="true" position="relative" w="30px" h="12px">
              <Box as="span" position="absolute" left={0} right={0} top={0} h="2px" bg="currentColor"
                transition={`transform .5s ${EASE}`} transform={open ? 'translateY(5px) rotate(45deg)' : 'none'} />
              <Box as="span" position="absolute" left="10px" right={0} bottom={0} h="2px" bg="currentColor"
                transition={`transform .5s ${EASE}`} transform={open ? 'translate(-10px,-5px) rotate(-45deg)' : 'none'} />
            </Box>
            {open ? 'Cerrar' : 'Menú'}
          </Box>
        </Flex>
      </Flex>

      <Box
        id="menu-indice"
        className="ix-ov"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        position="fixed"
        inset={0}
        zIndex={999}
        display="grid"
        gridTemplateColumns={{ base: '1fr', lg: '1.25fr 1fr' }}
        gridTemplateRows={{ base: 'auto 1fr', lg: '1fr' }}
        bg={C.bg}
        overflow="hidden"
      >
        <Flex as="nav" aria-label="Principal" direction="column" justify={{ base: 'flex-start', lg: 'center' }}
          position="relative" pt={{ base: '22px', lg: '110px' }} pb={{ base: '30px', lg: '40px' }} px={{ base: 5, lg: 12 }}
          overflowY="auto">
          {navLinks.map((l, i) => {
            const on = active === l.href
            return (
              <Link key={l.href} className="ix-link" href={l.href} onClick={(e) => go(e, l.href)} tabIndex={open ? 0 : -1}
                aria-current={on ? 'true' : undefined}
                display="flex" alignItems="baseline" gap={{ base: '14px', lg: '22px' }} overflow="hidden"
                color={C.ink} fontFamily="heading" textTransform="uppercase" lineHeight={1}
                fontSize={{ base: '14vw', lg: 'clamp(52px, 7vw, 116px)' }} _hover={{ textDecoration: 'none' }}
                _focusVisible={{ outline: '2px solid', outlineColor: C.gold, outlineOffset: '2px' }}
                style={{ '--d': `${0.35 + i * 0.06}s` }}>
                <Text as="small" className="ix-num" fontFamily="mono" fontSize="13px" letterSpacing="0.16em" color={C.gold}
                  fontWeight="600" w="28px" flexShrink={0}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Box as="span" className="ix-lbl" color={on ? 'transparent' : C.ink}
                  sx={on ? { WebkitTextStroke: `1.5px ${C.ink}` } : undefined}>
                  {l.label}
                </Box>
              </Link>
            )
          })}

          <Flex className="ix-ct" mt={{ base: '22px', lg: '34px' }} wrap="wrap" gap="10px 28px">
            {contacts.map((c) => (
              <Box key={c.url}>
                <Text fontFamily="mono" fontSize="10px" letterSpacing="0.24em" textTransform="uppercase" color={C.gray} mb="2px">{c.role}</Text>
                <Link href={c.url} isExternal tabIndex={open ? 0 : -1} fontFamily="mono" fontSize="15px" fontWeight="700"
                  letterSpacing="0.06em" color={C.ink}>{c.name}</Link>
              </Box>
            ))}
          </Flex>
        </Flex>

        <Box position="relative" overflow="hidden" bg={C.bg} order={{ base: -1, lg: 0 }}
          h={{ base: '30vh', lg: 'auto' }} minH={{ base: '190px', lg: 0 }}>
          <Box className="ix-clip" position="absolute" inset={0}
            bg="radial-gradient(70% 60% at 55% 40%, #1E5FA8 0%, #0B2A4A 55%, #050B14 100%)">
            <Image className="ix-img" src={playerData.menuPortrait} alt={playerData.menuPortraitAlt} decoding="async"
              position="absolute" inset={0} w="100%" h="100%" objectFit="cover" objectPosition="50% 15%" />
            <Box position="absolute" inset={0} bg="linear-gradient(0deg, rgba(5,11,20,0.9) 0%, transparent 45%)" />
            <Box position="absolute" left={0} right={0} top={0} h="130px" bg="linear-gradient(180deg, rgba(5,11,20,0.7), transparent)" />
          </Box>
          <Flex className="ix-cap" position="absolute" left={{ base: 5, lg: 8 }} right={{ base: 5, lg: 8 }} bottom={{ base: 4, lg: '30px' }}
            zIndex={2} color="white" align="flex-end" justify="space-between">
            <Box>
              <Text fontFamily="mono" fontSize="12px" letterSpacing="0.24em" textTransform="uppercase" opacity={0.8}>
                {playerData.position} · #{playerData.number}
              </Text>
              <Text fontFamily="heading" textTransform="uppercase" lineHeight={0.9} fontSize={{ base: '40px', lg: '68px' }}>
                {playerData.name}<br />{playerData.fullName}
              </Text>
            </Box>
            <Image src={playerData.logoCurrentClub} alt={playerData.currentClub} h={{ base: '40px', lg: '64px' }} />
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
